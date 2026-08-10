-- ============================================================================
-- Datos de ejemplo para probar las tablas de snapshots.
--
-- Tres snapshots semanales:
--   · 2026-07-17  solo parte DeFi (bolsa entera a NULL)          → source 'automatic'
--   · 2026-07-24  solo parte DeFi (bolsa a NULL, una fuente caída) → source 'automatic'
--   · 2026-07-31  completo, con tokens, posiciones y calls        → source 'mixed'
--
-- Sobre `source` (lo restringe un CHECK en la migración):
--   'automatic'  todo lo que hay en el snapshot lo leyó la máquina
--   'mixed'      parte automática + parte tecleada a mano por Manza
--   'manual'     TODO tecleado a mano, sin una sola lectura automática
-- Los dos primeros son solo DeFi leído de Kamino/Helius: 'automatic'. El
-- tercero suma la cuenta de bolsa, que se teclea a mano: 'mixed'. Ninguno de
-- los tres es 'manual'.
--
-- Los ids van fijos (uuid a mano) para poder borrarlos luego sin buscarlos.
--
-- Se pega en el editor SQL del panel de Supabase, igual que la migración.
-- Ojo: desde el editor SQL se ejecuta como rol privilegiado, así que RLS no
-- estorba. Con la anon key esto no se puede insertar, y así debe ser.
--
-- Al final hay un bloque de BORRADO, comentado a propósito: primero pruebas
-- las consultas con estos datos dentro, y cuando termines lo descomentas y lo
-- ejecutas para dejar la base limpia.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- Snapshot 1 — solo DeFi. Todas las columnas de bolsa quedan a NULL porque no
-- se listan: eso es un snapshot válido, no un error.
-- ----------------------------------------------------------------------------
insert into public.snapshots (
  id, taken_at, source, sources,
  kamino_collateral_usd, kamino_debt_usd, kamino_net_usd,
  kamino_ltv, kamino_liquidation_ltv, kamino_liquidation_price_usd,
  kamino_health, kamino_net_apy,
  defi_total_usd, treasury_usd, liabilities_usd,
  notes
) values (
  '11111111-1111-4111-8111-111111111111',
  '2026-07-17 09:00:00+00',
  'automatic',
  '{"kamino":"ok","helius":"ok"}'::jsonb,
  184320.50, 76400.00, 107920.50,
  41.45, 72.50, 96.30,
  1.75, 11.80,
  198740.25, 12500.00, 76400.00,
  'Solo DeFi: la cuenta de bolsa no se leyó esta semana.'
);

-- ----------------------------------------------------------------------------
-- Snapshot 2 — solo DeFi, y con una fuente caída registrada en `sources`.
-- `treasury_usd` va a 0.00 a propósito: un cero es un dato (la tesorería se
-- vació), distinto de dejarlo a NULL, que es un hueco.
-- ----------------------------------------------------------------------------
insert into public.snapshots (
  id, taken_at, source, sources,
  kamino_collateral_usd, kamino_debt_usd, kamino_net_usd,
  kamino_ltv, kamino_liquidation_ltv, kamino_liquidation_price_usd,
  kamino_health, kamino_net_apy,
  defi_total_usd, treasury_usd, liabilities_usd,
  notes
) values (
  '22222222-2222-4222-8222-222222222222',
  '2026-07-24 09:00:00+00',
  'automatic',
  '{"kamino":"ok","helius":"error: timeout 30s","moomoo":"pending"}'::jsonb,
  176980.00, 79250.00, 97730.00,
  44.78, 72.50, 101.15,
  1.62, 11.20,
  191410.75, 0.00, 79250.00,
  'Helius dio timeout: los valores de token se dejaron sin refrescar.'
);

-- ----------------------------------------------------------------------------
-- Snapshot 3 — completo: DeFi + bolsa + NAV, con hijos en las tres tablas.
-- source 'mixed': la parte DeFi se leyó automática, la de bolsa la tecleó Manza.
-- ----------------------------------------------------------------------------
insert into public.snapshots (
  id, taken_at, source, sources,
  kamino_collateral_usd, kamino_debt_usd, kamino_net_usd,
  kamino_ltv, kamino_liquidation_ltv, kamino_liquidation_price_usd,
  kamino_health, kamino_net_apy,
  defi_total_usd, treasury_usd, liabilities_usd,
  equity_total_usd, equity_cash_usd,
  equity_margin_used_usd, equity_margin_available_usd,
  equity_maintenance_margin_usd, equity_margin_ratio,
  equity_buying_power_usd, equity_unrealized_pl_usd,
  witx_supply, witx_price_usd, nav_total_usd, nav_per_token_usd,
  notes
) values (
  '33333333-3333-4333-8333-333333333333',
  '2026-07-31 09:00:00+00',
  'mixed',
  '{"kamino":"ok","helius":"ok","moomoo":"ok","jupiter":"ok"}'::jsonb,
  192450.75, 78900.00, 113550.75,
  40.99, 72.50, 94.80,
  1.81, 12.40,
  205310.40, 18250.00, 78900.00,
  84620.15, 9310.55,
  22400.00, 41200.00,
  13860.00, 28.50,
  50510.55, 6420.80,
  1000000, 0.02651, 229280.55, 0.22928,
  'Snapshot completo de cierre de mes.'
);

-- ---- Tokens del snapshot 3 --------------------------------------------------
insert into public.snapshot_tokens (
  snapshot_id, mint, symbol, amount, price_usd, value_usd, venue, role
) values
  ('33333333-3333-4333-8333-333333333333',
   'So11111111111111111111111111111111111111112', 'SOL',
   1015.2400, 189.5500, 192438.76, 'kamino', 'colateral'),
  ('33333333-3333-4333-8333-333333333333',
   'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 'USDC',
   78900.0000, 1.0000, 78900.00, 'kamino', 'deuda'),
  ('33333333-3333-4333-8333-333333333333',
   'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 'USDC',
   45120.8000, 1.0000, 45120.80, 'orca', 'lp'),
  -- Precio sin leer (Jupiter no cubre este mint): price_usd y value_usd a NULL,
  -- que es un hueco, no un cero.
  ('33333333-3333-4333-8333-333333333333',
   'irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8', 'WITX',
   250000.0000, null, null, 'wallet', 'tesoreria');

-- ---- Posiciones de bolsa del snapshot 3 -------------------------------------
insert into public.snapshot_positions (
  snapshot_id, ticker, position_type, shares, avg_cost, current_price,
  market_value_usd, unrealized_pl_usd, pl_percent, notes
) values
  ('33333333-3333-4333-8333-333333333333',
   'NVDA', 'long', 120, 142.3500, 178.9000,
   21468.00, 4386.00, 25.68, null),
  ('33333333-3333-4333-8333-333333333333',
   'ASML', 'long', 35, 812.4000, 905.1500,
   31680.25, 3246.25, 11.42, 'Núcleo de la cartera.'),
  -- Posición sin precio del día: el valor de mercado queda a NULL.
  ('33333333-3333-4333-8333-333333333333',
   'TSM', 'long', 90, 198.7000, null,
   null, null, null, 'Cotización no disponible al cierre.');

-- ---- Calls del snapshot 3 ---------------------------------------------------
insert into public.snapshot_calls (
  snapshot_id, ticker, side, contracts, strike, expiration,
  premium_usd, current_price_usd, underlying_price_usd,
  delta, implied_vol, pl_usd, pl_percent, notes
) values
  ('33333333-3333-4333-8333-333333333333',
   'NVDA', 'vendida', 1, 200.0000, '2026-09-18',
   612.0000, 438.5000, 178.9000,
   0.3200, 42.5000, 173.50, 28.35, 'Covered call sobre las 120 acciones.'),
  ('33333333-3333-4333-8333-333333333333',
   'ASML', 'comprada', 2, 1000.0000, '2026-12-18',
   2140.0000, 2585.0000, 905.1500,
   0.4100, 31.8000, 890.00, 20.79, null);

commit;

-- ============================================================================
-- CONSULTAS DE COMPROBACIÓN (ejecútalas con los datos dentro)
-- ============================================================================

-- Criterio 6: kamino_ltv y taken_at de las últimas 8 semanas, una fila por
-- snapshot, ordenadas por fecha.
--
--   select taken_at, kamino_ltv
--   from public.snapshots
--   where taken_at >= now() - interval '8 weeks'
--   order by taken_at desc;

-- Criterio 2: un snapshot solo con DeFi tiene toda la parte de bolsa a NULL.
--
--   select taken_at, kamino_ltv, equity_total_usd, equity_margin_used_usd
--   from public.snapshots
--   where id = '11111111-1111-4111-8111-111111111111';

-- Criterio 3: el borrado en cascada. Cuenta antes, borra uno, cuenta después.
--
--   select
--     (select count(*) from public.snapshot_tokens
--       where snapshot_id = '33333333-3333-4333-8333-333333333333')    as tokens,
--     (select count(*) from public.snapshot_positions
--       where snapshot_id = '33333333-3333-4333-8333-333333333333')    as posiciones,
--     (select count(*) from public.snapshot_calls
--       where snapshot_id = '33333333-3333-4333-8333-333333333333')    as calls;
--   -- esperado antes del borrado: 4 | 3 | 2 ; después: 0 | 0 | 0

-- Long MV / short MV: se AGREGAN, no hay columna en snapshots (ver el comentario
-- de snapshot_positions en la migración).
--
--   select position_type,
--          sum(market_value_usd)                        as market_value_usd,
--          count(*) filter (where market_value_usd is null) as sin_precio
--   from public.snapshot_positions
--   where snapshot_id = '33333333-3333-4333-8333-333333333333'
--   group by position_type;
--   -- esperado: long | 53148.25 | 1
--   -- (NVDA 21468.00 + ASML 31680.25; TSM no suma: está a NULL)
--   -- Este seed no trae cortos, así que no sale fila 'short'. Ojo en el
--   -- endpoint: la ausencia de fila es 0 posiciones, no un 0 de valor.

-- El CHECK de `source` rechaza cualquier otro valor:
--
--   insert into public.snapshots (taken_at, source, sources)
--   values (now(), 'cron', '{}'::jsonb);
--   -- esperado: ERROR  new row violates check constraint "snapshots_source_check"

-- ============================================================================
-- BORRADO — descoméntalo y ejecútalo cuando termines de probar.
-- Borra solo estos tres snapshots por id. Sus tokens, posiciones y calls se
-- van solos por ON DELETE CASCADE.
-- ============================================================================

-- delete from public.snapshots
-- where id in (
--   '11111111-1111-4111-8111-111111111111',
--   '22222222-2222-4222-8222-222222222222',
--   '33333333-3333-4333-8333-333333333333'
-- );
