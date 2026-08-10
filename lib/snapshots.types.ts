// Tipos de las tablas de snapshots del fondo.
//
// Escritos A MANO, igual que el resto de tipos del proyecto: aquí no hay CLI de
// Supabase ni database.types.ts generado. Si tocas la migración
// supabase/migrations/20260731120000_snapshots.sql, actualiza esto a la vez.
//
// ⚠️ Estas tablas son SOLO de servidor. Tienen RLS activado y cero políticas:
// el cliente `supabase` de lib/supabase.ts (anon key) no devuelve ni una fila.
// Se leen y escriben con la service role, como en app/api/admin/posiciones/route.ts.
//
// ⚠️ Sobre los `number`: en la base todo importe o cantidad es `numeric`, nunca
// coma flotante. PostgREST los serializa como número JSON, así que al llegar a
// JavaScript pasan a ser `number` y ahí sí hay coma flotante. Valen para
// mostrar; para sumar o comparar dinero de verdad, hazlo en SQL.
//
// ⚠️ Todas las columnas de datos son `| null` a propósito. Un snapshot con la
// parte DeFi rellena y la de bolsa vacía es válido. Un `null` es un hueco (no
// se pudo leer); un `0` es un dato (vale cero). No los confundas.

// Nombres de tabla, para no repetir literales por el código.
export const SNAPSHOTS_TABLE = "snapshots";
export const SNAPSHOT_TOKENS_TABLE = "snapshot_tokens";
export const SNAPSHOT_POSITIONS_TABLE = "snapshot_positions";
export const SNAPSHOT_CALLS_TABLE = "snapshot_calls";

// Cómo se compuso el snapshot. Lo restringe un CHECK en la base:
//   check (source in ('automatic','manual','mixed'))
// Si añades un valor aquí, añádelo también al CHECK de la migración.
//   'automatic'  todo lo que hay en el snapshot lo leyó la máquina
//   'manual'     TODO tecleado a mano, sin una sola lectura automática
//   'mixed'      parte automática + parte tecleada a mano
export type SnapshotSource = "automatic" | "manual" | "mixed";

// Estado de cada fuente consultada, tal cual se guarda en `snapshots.sources`.
// Ejemplo: { kamino: "ok", helius: "error: timeout 30s", moomoo: "pending" }
export type SourceStatus = Record<string, string>;

// Cabecera del snapshot. Solo taken_at, source y sources son obligatorios.
export type Snapshot = {
  id: string;
  created_at: string; // cuándo se escribió la fila
  taken_at: string; // instante que retrata el snapshot (ISO 8601)
  source: SnapshotSource;
  sources: SourceStatus;

  // DeFi · posición de carry en Kamino
  kamino_collateral_usd: number | null;
  kamino_debt_usd: number | null;
  kamino_net_usd: number | null;
  kamino_ltv: number | null; // en % (46.20 = 46,20 %)
  kamino_liquidation_ltv: number | null; // en %
  kamino_liquidation_price_usd: number | null;
  kamino_health: number | null;
  kamino_net_apy: number | null; // en %

  // DeFi · agregados
  defi_total_usd: number | null;
  treasury_usd: number | null;
  liabilities_usd: number | null;

  // Bolsa · cuenta de broker
  equity_total_usd: number | null;
  equity_cash_usd: number | null;
  equity_margin_used_usd: number | null;
  equity_margin_available_usd: number | null;
  equity_maintenance_margin_usd: number | null;
  equity_margin_ratio: number | null; // en %
  equity_buying_power_usd: number | null;
  equity_unrealized_pl_usd: number | null;

  // NAV
  witx_supply: number | null;
  witx_price_usd: number | null;
  nav_total_usd: number | null;
  nav_per_token_usd: number | null;

  notes: string | null;
};

// Tokens on-chain dentro de un snapshot.
export type SnapshotToken = {
  id: string;
  created_at: string;
  snapshot_id: string;
  mint: string | null;
  symbol: string | null;
  amount: number | null; // en decimales humanos (1.5 SOL), no en unidades base
  price_usd: number | null;
  value_usd: number | null;
  venue: string | null; // 'kamino' | 'orca' | 'onre' | 'huma' | 'wallet' | ...
  role: string | null; // 'colateral' | 'deuda' | 'lp' | 'yield' | 'tesoreria' | ...
};

// Posiciones de bolsa dentro de un snapshot.
// Es el histórico congelado, no confundir con la tabla `positions_equity`,
// que es el estado vivo que edita el panel de admin.
//
// ⚠️ El long MV y el short MV que pidió el VP NO son campos de `Snapshot`: se
// obtienen sumando `market_value_usd` agrupado por `position_type` para ese
// `snapshot_id`. Ver el comentario de la tabla en la migración.
export type SnapshotPosition = {
  id: string;
  created_at: string;
  snapshot_id: string;
  ticker: string | null;
  position_type: string | null; // 'long' | 'short' | ...
  shares: number | null;
  avg_cost: number | null;
  current_price: number | null;
  market_value_usd: number | null;
  unrealized_pl_usd: number | null;
  pl_percent: number | null;
  notes: string | null;
};

// Opciones call abiertas dentro de un snapshot.
export type SnapshotCall = {
  id: string;
  created_at: string;
  snapshot_id: string;
  ticker: string | null;
  side: string | null; // 'vendida' (covered call) | 'comprada'
  contracts: number | null;
  strike: number | null;
  expiration: string | null; // fecha ISO 'YYYY-MM-DD'
  premium_usd: number | null;
  current_price_usd: number | null;
  underlying_price_usd: number | null;
  delta: number | null;
  implied_vol: number | null; // en %
  pl_usd: number | null;
  pl_percent: number | null;
  notes: string | null;
};

// Lo que se manda al insertar: la base pone id y created_at.
export type SnapshotInsert = Omit<Snapshot, "id" | "created_at">;
export type SnapshotTokenInsert = Omit<SnapshotToken, "id" | "created_at">;
export type SnapshotPositionInsert = Omit<SnapshotPosition, "id" | "created_at">;
export type SnapshotCallInsert = Omit<SnapshotCall, "id" | "created_at">;

// Snapshot con sus hijos, tal como llega de un select con embeds:
//   .select('*, snapshot_tokens(*), snapshot_positions(*), snapshot_calls(*)')
export type SnapshotWithChildren = Snapshot & {
  snapshot_tokens: SnapshotToken[];
  snapshot_positions: SnapshotPosition[];
  snapshot_calls: SnapshotCall[];
};

// Fila de la serie de LTV que consume el histórico (criterio 6).
export type SnapshotLtvPoint = Pick<Snapshot, "taken_at" | "kamino_ltv">;
