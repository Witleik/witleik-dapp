"use client";

import { useEffect, useMemo, useState } from "react";

const WITX_MINT = "irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8";

// parsea texto a número (admite coma decimal, vacío = 0)
function parse(v: string): number {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function fmtUsd(n: number, maxFrac = 2): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maxFrac,
  });
}

function fmtNavPerToken(n: number): string {
  // respaldo por token suele ser sub-dólar: más decimales
  const frac = n < 0.01 ? 8 : n < 1 ? 6 : 4;
  return `$${n.toLocaleString("es-ES", { maximumFractionDigits: frac })}`;
}

const MONO = { fontFamily: "var(--font-jetbrains-mono)" };

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  step?: string;
}

function Field({ label, value, onChange, suffix, step = "any" }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[rgba(35,231,255,0.15)] bg-[#0a0a0a] px-4 py-3 pr-14 text-white outline-none transition-colors focus:border-[#23e7ff] focus:ring-1 focus:ring-[#23e7ff]"
          style={MONO}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

interface BreakdownRowProps {
  label: string;
  value: string;
  accent?: boolean;
  negative?: boolean;
}

function BreakdownRow({ label, value, accent, negative }: BreakdownRowProps) {
  const color = negative ? "#ef4444" : accent ? "#23e7ff" : "#ffffff";
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[rgba(35,231,255,0.08)] last:border-b-0">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-semibold" style={{ ...MONO, color }}>
        {value}
      </span>
    </div>
  );
}

export function NavCalculator() {
  const [defi, setDefi] = useState("0");
  const [bolsa, setBolsa] = useState("0");
  const [tesoreria, setTesoreria] = useState("0");
  const [pasivos, setPasivos] = useState("0");
  const [supply, setSupply] = useState("1000000");

  const [marketPrice, setMarketPrice] = useState<number | null>(null);

  // trae el precio de mercado actual de $WITX (opcional, no bloquea la calculadora)
  useEffect(() => {
    let cancelled = false;
    async function fetchPrice() {
      try {
        const res = await fetch(`/api/scan/${WITX_MINT}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data?.priceUsd === "number") {
          setMarketPrice(data.priceUsd);
        }
      } catch {
        // silencioso: la comparación de mercado es opcional
      }
    }
    fetchPrice();
    return () => {
      cancelled = true;
    };
  }, []);

  const r = useMemo(() => {
    const defiN = parse(defi);
    const bolsaN = parse(bolsa);
    const tesoreriaN = parse(tesoreria);
    const pasivosN = parse(pasivos);
    const supplyN = parse(supply);

    // NAV neto de deuda: activos − pasivos
    const navTotal = defiN + bolsaN + tesoreriaN - pasivosN;
    const navPerToken = supplyN > 0 ? navTotal / supplyN : 0;

    return { defiN, bolsaN, tesoreriaN, pasivosN, supplyN, navTotal, navPerToken };
  }, [defi, bolsa, tesoreria, pasivos, supply]);

  // comparación respaldo vs mercado
  const comparison = useMemo(() => {
    if (marketPrice === null || r.navPerToken <= 0) return null;
    const below = marketPrice < r.navPerToken;
    const diffPct =
      ((marketPrice - r.navPerToken) / r.navPerToken) * 100;
    return {
      below,
      label: below ? "Cotiza bajo respaldo" : "Cotiza sobre respaldo",
      color: below ? "#22c55e" : "#eab308",
      diffPct,
    };
  }, [marketPrice, r.navPerToken]);

  return (
    <div
      className="relative bg-gradient-to-br from-[#131318] to-[#0a0a0a] border border-[rgba(35,231,255,0.2)] rounded-2xl p-6 sm:p-8 overflow-hidden"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#23e7ff] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <Field
            label="Portafolio DeFi"
            value={defi}
            onChange={setDefi}
            suffix="$"
          />
          <Field
            label="Portafolio Bolsa"
            value={bolsa}
            onChange={setBolsa}
            suffix="$"
          />
          <Field
            label="Tesorería / Otros"
            value={tesoreria}
            onChange={setTesoreria}
            suffix="$"
          />
          <Field
            label="Pasivos / Deuda"
            value={pasivos}
            onChange={setPasivos}
            suffix="$"
          />
          <Field
            label="Supply total emitido de $WITX"
            value={supply}
            onChange={setSupply}
            step="1"
          />
        </div>

        {/* NAV por token destacado */}
        <div className="rounded-xl bg-[rgba(35,231,255,0.06)] border border-[rgba(35,231,255,0.25)] p-6 text-center mb-6">
          <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-[0.2em] mb-2">
            Valor de respaldo por token (NAV)
          </p>
          <p
            className="text-4xl sm:text-5xl font-bold text-[#23e7ff] tracking-tight break-words"
            style={MONO}
          >
            {fmtNavPerToken(r.navPerToken)}
          </p>
          {/* comparación con el mercado (opcional) */}
          {comparison && (
            <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border px-4 py-1.5"
              style={{
                borderColor: `${comparison.color}55`,
                background: `${comparison.color}12`,
              }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: comparison.color }}
              >
                {comparison.label}
              </span>
              <span className="text-xs text-zinc-400" style={MONO}>
                · Mercado {fmtNavPerToken(marketPrice as number)} (
                {comparison.diffPct >= 0 ? "+" : ""}
                {comparison.diffPct.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>

        {/* desglose */}
        <div className="rounded-xl bg-[rgba(35,231,255,0.04)] border border-[rgba(35,231,255,0.1)] px-5 py-2 mb-6">
          <BreakdownRow label="Portafolio DeFi" value={fmtUsd(r.defiN)} />
          <BreakdownRow label="Portafolio Bolsa" value={fmtUsd(r.bolsaN)} />
          <BreakdownRow label="Tesorería / Otros" value={fmtUsd(r.tesoreriaN)} />
          <BreakdownRow
            label="Pasivos / Deuda"
            value={`− ${fmtUsd(r.pasivosN)}`}
            negative
          />
          <BreakdownRow
            label="NAV total (neto de deuda)"
            value={fmtUsd(r.navTotal)}
            accent
          />
          <BreakdownRow
            label="Supply emitido"
            value={`${r.supplyN.toLocaleString("es-ES")} $WITX`}
          />
        </div>

        {/* aviso de encuadre */}
        <div className="rounded-xl border border-[rgba(35,231,255,0.15)] bg-[rgba(35,231,255,0.04)] p-4">
          <p className="text-xs leading-relaxed text-zinc-400">
            <span className="text-[#23e7ff] font-semibold">Aviso.</span> El NAV
            refleja el respaldo real del fondo por token. No es una promesa de
            precio ni una recomendación de inversión.
          </p>
        </div>
      </div>
    </div>
  );
}
