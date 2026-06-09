"use client";

import { useState } from "react";

// ── Validación base58 de Solana (mismo regex que la API route) ──
const MINT_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

interface ScanResult {
  name: string | null;
  symbol: string | null;
  dexId: string | null;
  priceUsd: number | null;
  liquidity: number | null;
  marketCap: number | null;
  volume24h: number | null;
  priceChange24h: number | null;
  buys24h: number | null;
  sells24h: number | null;
}

type Level = "green" | "yellow" | "red";

interface Verdict {
  level: Level;
  signals: string[];
}

const LEVEL_META: Record<Level, { emoji: string; label: string; color: string }> = {
  green: { emoji: "🟢", label: "Señales saludables", color: "#22c55e" },
  yellow: { emoji: "🟡", label: "Precaución", color: "#eab308" },
  red: { emoji: "🔴", label: "Alto riesgo", color: "#ef4444" },
};

// El peor de los tres niveles manda
function worst(levels: Level[]): Level {
  if (levels.includes("red")) return "red";
  if (levels.includes("yellow")) return "yellow";
  return "green";
}

function computeVerdict(r: ScanResult): Verdict {
  const signals: string[] = [];
  const levels: Level[] = [];

  // ── Liquidez ──
  const liq = r.liquidity ?? 0;
  if (liq < 10_000) {
    levels.push("red");
    signals.push("Liquidez muy baja (menos de $10k): difícil entrar o salir sin mover el precio.");
  } else if (liq < 50_000) {
    levels.push("yellow");
    signals.push("Liquidez moderada ($10k–$50k): cuidado con el slippage en órdenes grandes.");
  } else {
    levels.push("green");
  }

  // ── Volumen 24h ──
  const vol = r.volume24h ?? 0;
  if (vol < 1_000) {
    levels.push("red");
    signals.push("Volumen 24h casi nulo (menos de $1k): apenas hay actividad de trading.");
  } else if (vol < 25_000) {
    levels.push("yellow");
    signals.push("Volumen 24h bajo (menos de $25k): interés limitado en el token.");
  } else {
    levels.push("green");
  }

  // ── Presión de venta ──
  const buys = r.buys24h ?? 0;
  const sells = r.sells24h ?? 0;
  const totalTx = buys + sells;
  if (totalTx > 0) {
    const sellRatio = sells / totalTx;
    if (sellRatio >= 0.7) {
      levels.push("red");
      signals.push(
        `Fuerte presión vendedora: ${Math.round(sellRatio * 100)}% de las operaciones 24h son ventas.`
      );
    } else if (sellRatio >= 0.58) {
      levels.push("yellow");
      signals.push(
        `Presión vendedora elevada: ${Math.round(sellRatio * 100)}% de las operaciones 24h son ventas.`
      );
    } else {
      levels.push("green");
    }
  }

  return { level: worst(levels), signals };
}

// ── Formato ──
function fmtUsd(n: number | null, maxFrac = 2): string {
  if (n === null) return "—";
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maxFrac,
  });
}

function fmtPrice(n: number | null): string {
  if (n === null) return "—";
  // Precios sub-céntimo necesitan más decimales
  const frac = n < 0.01 ? 8 : n < 1 ? 6 : 4;
  return `$${n.toLocaleString("es-ES", { maximumFractionDigits: frac })}`;
}

function fmtNum(n: number | null): string {
  if (n === null) return "—";
  return n.toLocaleString("es-ES");
}

const MONO = { fontFamily: "var(--font-jetbrains-mono)" };

interface MetricProps {
  label: string;
  value: string;
  accent?: string;
}

function Metric({ label, value, accent }: MetricProps) {
  return (
    <div className="rounded-xl bg-[rgba(35,231,255,0.04)] border border-[rgba(35,231,255,0.1)] p-4">
      <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      <p
        className="text-xl sm:text-2xl font-bold tracking-tight break-words"
        style={{ ...MONO, color: accent ?? "#ffffff" }}
      >
        {value}
      </p>
    </div>
  );
}

export function WitxScanner() {
  const [mint, setMint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  async function analyze() {
    const value = mint.trim();
    setError(null);
    setResult(null);

    if (!MINT_REGEX.test(value)) {
      setError("La dirección no es una mint de Solana válida (base58).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/scan/${value}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo analizar el token.");
        return;
      }
      setResult(data as ScanResult);
    } catch {
      setError("Error de red. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") analyze();
  }

  const verdict = result ? computeVerdict(result) : null;
  const change = result?.priceChange24h ?? null;
  const changeColor =
    change === null ? "#ffffff" : change >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div
      className="relative bg-gradient-to-br from-[#131318] to-[#0a0a0a] border border-[rgba(35,231,255,0.2)] rounded-2xl p-6 sm:p-8 overflow-hidden"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#23e7ff] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-2">
          WITX Scanner
        </h3>
        <p className="text-zinc-400 text-sm mb-6">
          Pega la mint address de cualquier token de Solana y analiza su salud de mercado.
        </p>

        {/* Input + botón */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Mint address (base58)…"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="flex-1 min-w-0 bg-[#0a0a0a] border border-[rgba(35,231,255,0.2)] focus:border-[#23e7ff] focus:outline-none rounded-xl px-4 py-3 text-white placeholder-zinc-600 transition-colors"
            style={MONO}
          />
          <button
            onClick={analyze}
            disabled={loading}
            className="bg-gradient-to-r from-[#23e7ff] to-[#14b8d4] text-[#0a0a0a] font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(35,231,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Analizando…" : "Analizar"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)]">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Resultado */}
        {result && verdict && (
          <div className="space-y-6">
            {/* Cabecera token */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-bold text-white">
                {result.name ?? "Token desconocido"}
              </span>
              {result.symbol && (
                <span className="text-lg text-[#23e7ff] font-semibold">
                  ${result.symbol}
                </span>
              )}
              {result.dexId && (
                <span className="text-xs text-zinc-500 uppercase tracking-wider">
                  · {result.dexId}
                </span>
              )}
            </div>

            {/* Veredicto semáforo */}
            <div
              className="rounded-xl p-4 border flex items-center gap-3"
              style={{
                borderColor: `${LEVEL_META[verdict.level].color}55`,
                background: `${LEVEL_META[verdict.level].color}12`,
              }}
            >
              <span className="text-2xl leading-none">
                {LEVEL_META[verdict.level].emoji}
              </span>
              <span
                className="font-bold uppercase tracking-wider text-sm"
                style={{ color: LEVEL_META[verdict.level].color }}
              >
                {LEVEL_META[verdict.level].label}
              </span>
            </div>

            {/* Señales */}
            {verdict.signals.length > 0 && (
              <ul className="space-y-2">
                {verdict.signals.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-300">
                    <span className="text-zinc-600 select-none">›</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <Metric label="Precio" value={fmtPrice(result.priceUsd)} accent="#23e7ff" />
              <Metric label="Liquidez" value={fmtUsd(result.liquidity)} />
              <Metric label="Market Cap" value={fmtUsd(result.marketCap)} />
              <Metric label="Volumen 24h" value={fmtUsd(result.volume24h)} />
              <Metric
                label="Cambio 24h"
                value={change === null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
                accent={changeColor}
              />
              <Metric
                label="Txns 24h (B / V)"
                value={`${fmtNum(result.buys24h)} / ${fmtNum(result.sells24h)}`}
              />
            </div>
          </div>
        )}

        {/* Aviso prototipo */}
        <div className="mt-8 pt-4 border-t border-[rgba(35,231,255,0.08)]">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <span className="text-zinc-400 font-semibold">Prototipo.</span> Este
            análisis se basa solo en datos de mercado. Las verificaciones anti rug
            pull (mint authority, freeze authority, distribución de holders)
            llegarán con la integración RPC.
          </p>
        </div>
      </div>
    </div>
  );
}
