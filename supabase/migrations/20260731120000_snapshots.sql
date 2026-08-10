-- ============================================================================
-- Snapshots del fondo Witleik
--
-- Cuatro tablas nuevas. No se toca ninguna tabla existente (referrals,
-- positions_equity) ni sus políticas.
--
--   snapshots            una foto del fondo en un instante (cabecera)
--   snapshot_tokens      lo que había on-chain en esa foto (DeFi / Solana)
--   snapshot_positions   lo que había en la cuenta de bolsa en esa foto
--   snapshot_calls       las opciones call abiertas en esa foto
--
-- REGLAS APLICADAS
--   · Todo lo que es dinero o cantidad es `numeric`, sin precisión fijada.
--     Nunca float/real/double: son las cuentas del fondo.
--   · Todas las columnas de datos admiten NULL. Un snapshot con la parte DeFi
--     rellena y la de bolsa vacía es un snapshot válido, no un error.
--   · Ninguna columna de datos tiene DEFAULT. Un cero es un dato, un hueco es
--     un hueco.
--   · Obligatorias solo: taken_at, source, sources.
--
-- SEGURIDAD
--   RLS activado en las cuatro tablas y CERO políticas, ni para anon ni para
--   authenticated. La anon key viaja dentro del JavaScript que servimos:
--   cualquiera la extrae del navegador. Aquí hay precio de liquidación y
--   margen de la cuenta de bolsa. Solo la service role (que se salta RLS)
--   lee y escribe esto, y solo desde el servidor.
--
-- SE APLICA A MANO: pegar este fichero entero en el editor SQL del panel de
-- Supabase. Va en una transacción: o entra todo, o no entra nada.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. snapshots — cabecera
-- ----------------------------------------------------------------------------
create table public.snapshots (
  -- identidad y metadatos: no son "datos del fondo", por eso sí llevan default
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- obligatorias
  taken_at    timestamptz not null,   -- instante que retrata el snapshot (sin default: se declara siempre)
  source      text        not null
                check (source in ('automatic','manual','mixed')),
                                      -- cómo se compuso el snapshot:
                                      --   'automatic' todo leído por máquina (DeFi, precios, broker)
                                      --   'manual'    TODO tecleado a mano, sin ninguna lectura automática
                                      --   'mixed'     parte automática + parte tecleada a mano
  sources     jsonb       not null,   -- por cada fuente consultada: ok / qué falló / cuándo
                                      -- ej: {"kamino":"ok","helius":"error: timeout 30s","moomoo":"pending"}

  -- ---- DeFi · posición de carry en Kamino -----------------------------------
  kamino_collateral_usd       numeric,  -- colateral depositado, en USD
  kamino_debt_usd             numeric,  -- deuda viva, en USD
  kamino_net_usd              numeric,  -- colateral − deuda, en USD
  kamino_ltv                  numeric,  -- LTV actual, en % (46.20 = 46,20 %)
  kamino_liquidation_ltv      numeric,  -- LTV al que liquidan, en %
  kamino_liquidation_price_usd numeric, -- precio del colateral al que salta la liquidación, en USD
  kamino_health               numeric,  -- health factor tal cual lo da el protocolo
  kamino_net_apy              numeric,  -- APY neto de la posición, en %

  -- ---- DeFi · agregados ------------------------------------------------------
  defi_total_usd              numeric,  -- valor total del portafolio DeFi, en USD
  treasury_usd                numeric,  -- tesorería / otros, en USD
  liabilities_usd             numeric,  -- pasivos / deuda total del fondo, en USD

  -- ---- Bolsa · cuenta de broker ---------------------------------------------
  equity_total_usd            numeric,  -- valor de la cartera de bolsa, en USD
  equity_cash_usd             numeric,  -- efectivo en la cuenta, en USD
  equity_margin_used_usd      numeric,  -- margen utilizado, en USD
  equity_margin_available_usd numeric,  -- margen disponible, en USD
  equity_maintenance_margin_usd numeric,-- margen de mantenimiento exigido, en USD
  equity_margin_ratio         numeric,  -- ratio de margen, en %
  equity_buying_power_usd     numeric,  -- poder de compra, en USD
  equity_unrealized_pl_usd    numeric,  -- P/L no realizado de la cuenta, en USD

  -- ---- NAV -------------------------------------------------------------------
  witx_supply                 numeric,  -- supply emitido de $WITX en el momento del snapshot
  witx_price_usd              numeric,  -- precio de mercado de $WITX, en USD
  nav_total_usd               numeric,  -- NAV total neto de deuda, en USD
  nav_per_token_usd           numeric,  -- NAV por token, en USD

  notes                       text      -- comentario libre del snapshot
);

comment on table public.snapshots is
  'Foto del fondo Witleik en un instante. Sensible: solo service role. RLS sin políticas.';
comment on column public.snapshots.taken_at is
  'Instante que retrata el snapshot. No es created_at: un snapshot se puede cargar a posteriori.';
comment on column public.snapshots.source is
  'Cómo se compuso el snapshot: automatic (todo por máquina) | manual (todo a mano) | mixed (parte y parte). Restringido por CHECK.';
comment on column public.snapshots.sources is
  'Estado por fuente consultada, ej: {"kamino":"ok","helius":"error: timeout 30s","moomoo":"pending"}';
comment on column public.snapshots.kamino_ltv is
  'LTV en porcentaje (46.20 = 46,20 %), no en fracción.';

-- Así se va a consultar siempre: lo último primero.
create index snapshots_taken_at_idx on public.snapshots (taken_at desc);

-- ----------------------------------------------------------------------------
-- 2. snapshot_tokens — lo que había on-chain en esa foto
-- ----------------------------------------------------------------------------
create table public.snapshot_tokens (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  snapshot_id uuid        not null
                references public.snapshots (id) on delete cascade,

  mint        text,      -- dirección del mint en Solana
  symbol      text,      -- SOL, USDC, WITX...
  amount      numeric,   -- unidades del token (ya en decimales humanos, no lamports)
  price_usd   numeric,   -- precio unitario en USD en el momento del snapshot
  value_usd   numeric,   -- amount * price_usd, en USD
  venue       text,      -- dónde está: 'kamino' | 'orca' | 'onre' | 'huma' | 'wallet' | ...
  role        text       -- qué papel juega: 'colateral' | 'deuda' | 'lp' | 'yield' | 'tesoreria' | ...
);

comment on table public.snapshot_tokens is
  'Tokens on-chain del fondo dentro de un snapshot. Se borran en cascada con su snapshot.';
comment on column public.snapshot_tokens.amount is
  'Unidades en decimales humanos (1.5 SOL), no en unidades base.';

create index snapshot_tokens_snapshot_id_idx on public.snapshot_tokens (snapshot_id);

-- ----------------------------------------------------------------------------
-- 3. snapshot_positions — cuenta de bolsa en esa foto
--
-- ⚠️ LONG MV Y SHORT MV: NO EXISTEN COMO COLUMNA EN `snapshots`.
--
-- El encargo original del VP pedía ver el market value de los largos y el de
-- los cortos. Eso NO se guarda como columna suelta en la cabecera: sería un
-- dato duplicado que se puede quedar desfasado respecto a las filas de las que
-- sale. Se calcula agregando esta tabla: sumar `market_value_usd` agrupando por
-- `position_type` para ese `snapshot_id`.
--
-- Quien construya el endpoint de lectura (Fase D) tiene que AGREGAR, no leer
-- una columna que no existe:
--
--   select position_type, sum(market_value_usd) as market_value_usd
--   from public.snapshot_positions
--   where snapshot_id = $1
--   group by position_type;
--
-- Nota: `market_value_usd` admite NULL (posición sin precio del día). sum()
-- ignora los NULL, así que un total puede quedarse corto sin avisar; si eso
-- importa, cuenta aparte cuántas filas del grupo lo tienen a NULL.
-- ----------------------------------------------------------------------------
create table public.snapshot_positions (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  snapshot_id uuid        not null
                references public.snapshots (id) on delete cascade,

  ticker            text,     -- NVDA, TSLA...
  position_type     text,     -- 'long' | 'short' | ...
  shares            numeric,  -- número de acciones
  avg_cost          numeric,  -- coste medio por acción, en USD
  current_price     numeric,  -- precio por acción en el momento del snapshot, en USD
  market_value_usd  numeric,  -- valor de mercado de la posición, en USD
  unrealized_pl_usd numeric,  -- P/L no realizado, en USD
  pl_percent        numeric,  -- P/L en %
  notes             text
);

comment on table public.snapshot_positions is
  'Posiciones de bolsa dentro de un snapshot. Histórico congelado: no es positions_equity, que es el estado vivo.';

create index snapshot_positions_snapshot_id_idx on public.snapshot_positions (snapshot_id);

-- ----------------------------------------------------------------------------
-- 4. snapshot_calls — opciones call abiertas en esa foto
-- ----------------------------------------------------------------------------
create table public.snapshot_calls (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  snapshot_id uuid        not null
                references public.snapshots (id) on delete cascade,

  ticker            text,     -- subyacente
  side              text,     -- 'vendida' (covered call) | 'comprada'
  contracts         numeric,  -- número de contratos
  strike            numeric,  -- strike, en USD
  expiration        date,     -- fecha de vencimiento
  premium_usd       numeric,  -- prima por contrato cobrada o pagada, en USD
  current_price_usd numeric,  -- precio actual de la opción, en USD
  underlying_price_usd numeric,-- precio del subyacente en el snapshot, en USD
  delta             numeric,  -- delta de la opción
  implied_vol       numeric,  -- volatilidad implícita, en %
  pl_usd            numeric,  -- P/L de la call, en USD
  pl_percent        numeric,  -- P/L en %
  notes             text
);

comment on table public.snapshot_calls is
  'Opciones call abiertas dentro de un snapshot. Se borran en cascada con su snapshot.';

create index snapshot_calls_snapshot_id_idx on public.snapshot_calls (snapshot_id);

-- ----------------------------------------------------------------------------
-- 5. SEGURIDAD: RLS activado, CERO políticas
--
-- Sin políticas, RLS deniega todo a anon y a authenticated (PostgREST usa esos
-- roles). La service role tiene BYPASSRLS, así que el servidor sigue leyendo y
-- escribiendo con normalidad.
-- ----------------------------------------------------------------------------
alter table public.snapshots          enable row level security;
alter table public.snapshot_tokens    enable row level security;
alter table public.snapshot_positions enable row level security;
alter table public.snapshot_calls     enable row level security;

-- Cinturón y tirantes: además de RLS, retiramos los permisos que Supabase
-- concede por defecto a anon y authenticated sobre las tablas nuevas del
-- esquema public. Con esto, un SELECT desde el navegador ni siquiera llega a
-- evaluar RLS: falla antes, por permisos. No afecta a ninguna tabla existente.
revoke all on public.snapshots          from anon, authenticated;
revoke all on public.snapshot_tokens    from anon, authenticated;
revoke all on public.snapshot_positions from anon, authenticated;
revoke all on public.snapshot_calls     from anon, authenticated;

commit;
