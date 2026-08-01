"use client";

import { useMemo, useState } from "react";

const CONCENTRATION_CAP = 10; // % tope de concentración por posición (fijo en v1)

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

const MONO = { fontFamily: "var(--font-jetbrains-mono)" };

type Conviction = "baja" | "media" | "alta";

const CONVICTION_FACTOR: Record<Conviction, number> = {
  baja: 0.33,
  media: 0.66,
  alta: 1,
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  step?: string;
  note?: string;
}

function Field({ label, value, onChange, suffix, step = "any", note }: FieldProps) {
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
      {note && <span className="text-xs text-zinc-500">{note}</span>}
    </label>
  );
}

interface StatProps {
  label: string;
  value: string;
  accent?: boolean;
}

function Stat({ label, value, accent }: StatProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? "border-[rgba(35,231,255,0.3)] bg-[rgba(35,231,255,0.06)]"
          : "border-[rgba(35,231,255,0.1)] bg-[rgba(35,231,255,0.04)]"
      }`}
    >
      <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      <p
        className="text-xl sm:text-2xl font-bold tracking-tight break-words"
        style={{ ...MONO, color: accent ? "#23e7ff" : "#ffffff" }}
      >
        {value}
      </p>
    </div>
  );
}

export function PositionSizer() {
  const [capital, setCapital] = useState("100000");
  const [price, setPrice] = useState("80");
  const [intrinsic, setIntrinsic] = useState("100");
  const [conviction, setConviction] = useState<Conviction>("media");

  const r = useMemo(() => {
    const capitalN = parse(capital);
    const priceN = parse(price);
    const intrinsicN = parse(intrinsic);

    // margen de seguridad %
    const marginPct =
      intrinsicN > 0 ? ((intrinsicN - priceN) / intrinsicN) * 100 : 0;

    const hasMargin = marginPct > 0;

    // factor de margen: 0 si <0%, escala lineal 0→1 entre 0% y 40%+
    const marginFactor = Math.max(0, Math.min(marginPct / 40, 1));

    const convFactor = CONVICTION_FACTOR[conviction];

    // peso sugerido % = tope × factor margen × factor convicción
    const weightPct = CONCENTRATION_CAP * marginFactor * convFactor;
    const investUsd = capitalN * (weightPct / 100);
    const shares = priceN > 0 ? Math.floor(investUsd / priceN) : 0;

    return {
      capitalN,
      priceN,
      intrinsicN,
      marginPct,
      hasMargin,
      weightPct,
      investUsd,
      shares,
    };
  }, [capital, price, intrinsic, conviction]);

  // color del margen: rojo negativo, amarillo bajo (<15%), verde sano
  const marginColor = !r.hasMargin
    ? "#ef4444"
    : r.marginPct < 15
      ? "#eab308"
      : "#22c55e";

  return (
    <div
      className="relative bg-gradient-to-br from-[#131318] to-[#0a0a0a] border border-[rgba(35,231,255,0.2)] rounded-2xl p-6 sm:p-8 overflow-hidden"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#23e7ff] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-2">
          Position Sizing · Value
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          Calcula cuánto del fondo asignar a una acción según tu margen de
          seguridad y tu convicción en la tesis — sin stop loss, estilo value. El
          peso sube cuanto mayor es el descuento frente a tu valor estimado y
          mayor tu convicción; el tope del 10% protege el fondo limitando la
          máxima pérdida por posición.
        </p>

        {/* inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <Field label="Capital total del fondo" value={capital} onChange={setCapital} suffix="$" />
          <Field label="Precio actual de la acción" value={price} onChange={setPrice} suffix="$" />
          <Field
            label="Valor intrínseco estimado por acción"
            value={intrinsic}
            onChange={setIntrinsic}
            suffix="$"
            note="Lo estimas tú según tu análisis."
          />
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">Convicción en la tesis</span>
            <div className="grid grid-cols-3 gap-2">
              {(["baja", "media", "alta"] as Conviction[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setConviction(c)}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold capitalize transition-colors ${
                    conviction === c
                      ? "border-[#23e7ff] bg-[rgba(35,231,255,0.1)] text-[#23e7ff]"
                      : "border-[rgba(35,231,255,0.15)] bg-[#0a0a0a] text-zinc-400 hover:border-[rgba(35,231,255,0.4)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </label>
        </div>

        {/* tope (dato, no editable) */}
        <div className="mb-6 rounded-xl border border-[rgba(35,231,255,0.1)] bg-[rgba(35,231,255,0.04)] px-4 py-3">
          <p className="text-sm text-zinc-400">
            Tope de concentración:{" "}
            <span className="text-[#23e7ff] font-semibold" style={MONO}>
              {CONCENTRATION_CAP}%
            </span>{" "}
            del fondo. Ninguna posición debe superarlo.
          </p>
        </div>

        {/* margen de seguridad destacado */}
        <div
          className="rounded-xl p-6 text-center mb-6 border"
          style={{ borderColor: `${marginColor}55`, background: `${marginColor}12` }}
        >
          <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-[0.2em] mb-2">
            Margen de seguridad
          </p>
          <p
            className="text-4xl sm:text-5xl font-bold tracking-tight break-words"
            style={{ ...MONO, color: marginColor }}
          >
            {r.marginPct >= 0 ? "+" : ""}
            {r.marginPct.toFixed(1)}%
          </p>
        </div>

        {/* sin margen: aviso y no se sugiere posición */}
        {!r.hasMargin ? (
          <div className="rounded-xl border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] p-4 mb-6">
            <p className="text-sm text-red-400">
              Sin margen de seguridad: la acción cotiza por encima de tu valor
              estimado. Tu estrategia no justifica entrar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <Stat label="Peso sugerido del fondo" value={`${r.weightPct.toFixed(2)}%`} accent />
            <Stat label="Capital a invertir" value={fmtUsd(r.investUsd)} accent />
            <Stat label="Nº de acciones aprox." value={r.shares.toLocaleString("es-ES")} />
          </div>
        )}

        {/* aviso de encuadre */}
        <div className="rounded-xl border border-[rgba(35,231,255,0.15)] bg-[rgba(35,231,255,0.04)] p-4">
          <p className="text-xs leading-relaxed text-zinc-400">
            <span className="text-[#23e7ff] font-semibold">Aviso.</span> Esto es
            una guía de asignación según tu estrategia, no una recomendación de
            compra. El valor intrínseco lo estimas tú.
          </p>
        </div>
      </div>
    </div>
  );
}
