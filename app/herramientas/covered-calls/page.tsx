"use client";

import { useMemo, useState } from "react";

import { ToolBackLink } from "@/components/ToolBackLink";

/* ---------- helpers de formato ---------- */

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

const fmtPct = (n: number) =>
  `${n >= 0 ? "" : "−"}${Math.abs(n).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} %`;

/* parsea un input de texto a número (admite coma decimal, vacío = 0) */
const parse = (v: string) => {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/* ---------- campo de entrada ---------- */

function Field({
  label,
  value,
  onChange,
  suffix,
  step = "any",
  min = "0",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  step?: string;
  min?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[rgba(35,231,255,0.15)] bg-[#131318] px-4 py-3 pr-14 text-white outline-none transition-colors focus:border-[#23e7ff] focus:ring-1 focus:ring-[#23e7ff]"
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

/* ---------- tarjeta de resultado ---------- */

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? "border-[rgba(35,231,255,0.3)] bg-[rgba(35,231,255,0.06)]"
          : "border-white/8 bg-[#131318]"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div
        className={`mt-1.5 text-2xl font-bold tracking-tight ${
          accent ? "text-[#23e7ff]" : "text-white"
        }`}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-sm text-zinc-400">{sub}</div>}
    </div>
  );
}

/* ---------- página ---------- */

export default function CoveredCallsPage() {
  const [entry, setEntry] = useState("100");
  const [shares, setShares] = useState("100");
  const [strike, setStrike] = useState("105");
  const [premium, setPremium] = useState("2");
  const [days, setDays] = useState("30");

  const r = useMemo(() => {
    const entryN = parse(entry);
    const sharesN = parse(shares);
    const strikeN = parse(strike);
    const premiumN = parse(premium);
    const daysN = parse(days);

    const primaTotal = premiumN * sharesN;
    const capital = entryN * sharesN;

    // rendimiento si NO te asignan (prima pura sobre el capital inmovilizado)
    const retNoAsignado = capital > 0 ? primaTotal / capital : 0;
    const retNoAsignadoAnual = daysN > 0 ? retNoAsignado * (365 / daysN) : 0;

    // ganancia sobre la acción si te asignan (revalorización hasta el strike)
    const gananciaAccion = (strikeN - entryN) * sharesN;

    // rendimiento si te asignan (prima + revalorización hasta strike)
    const beneficioAsignado = primaTotal + gananciaAccion;
    const retAsignado = capital > 0 ? beneficioAsignado / capital : 0;
    const retAsignadoAnual = daysN > 0 ? retAsignado * (365 / daysN) : 0;

    // breakeven = precio de entrada − prima por acción
    const breakeven = entryN - premiumN;

    // upside techado = (strike − entrada) / entrada
    const upside = entryN > 0 ? (strikeN - entryN) / entryN : 0;

    return {
      primaTotal,
      capital,
      retNoAsignado,
      retNoAsignadoAnual,
      retAsignado,
      retAsignadoAnual,
      beneficioAsignado,
      gananciaAccion,
      breakeven,
      upside,
    };
  }, [entry, shares, strike, premium, days]);

  return (
    <div className="px-6 pb-24 pt-8">
      <div className="mx-auto max-w-3xl">
        <ToolBackLink />

        {/* cabecera */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(35,231,255,0.2)] bg-[rgba(35,231,255,0.05)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#23e7ff]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#23e7ff]">
              Herramientas · Opciones
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Calculadora de <span style={{ color: "#23e7ff" }}>Covered Calls</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400">
            Estima el rendimiento de vender una call cubierta: la prima que
            cobras hoy y los dos escenarios al vencimiento — que te asignen o que
            no.
          </p>
        </div>

        {/* inputs */}
        <div className="rounded-2xl border border-[rgba(35,231,255,0.12)] bg-[#0d0d11] p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Precio de entrada por acción"
              value={entry}
              onChange={setEntry}
              suffix="$"
            />
            <Field
              label="Nº de acciones"
              value={shares}
              onChange={setShares}
              step="1"
            />
            <Field
              label="Strike de la call"
              value={strike}
              onChange={setStrike}
              suffix="$"
            />
            <Field
              label="Prima recibida por acción"
              value={premium}
              onChange={setPremium}
              suffix="$"
            />
            <Field
              label="Días al vencimiento"
              value={days}
              onChange={setDays}
              step="1"
              suffix="días"
            />
          </div>
        </div>

        {/* resultados */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Stat
            label="Prima total recibida"
            value={fmtUSD(r.primaTotal)}
            accent
          />
          <Stat label="Capital inmovilizado" value={fmtUSD(r.capital)} />

          <Stat
            label="Si NO te asignan (prima pura)"
            value={fmtPct(r.retNoAsignado * 100)}
            sub={`Anualizado: ${fmtPct(r.retNoAsignadoAnual * 100)}`}
            accent
          />
          <Stat
            label="Si te asignan (prima + revalorización)"
            value={fmtPct(r.retAsignado * 100)}
            sub={`Anualizado: ${fmtPct(r.retAsignadoAnual * 100)} · ${fmtUSD(
              r.beneficioAsignado,
            )}`}
            accent
          />

          <Stat
            label="Breakeven (entrada − prima)"
            value={fmtUSD(r.breakeven)}
            sub="Por debajo de aquí entras en pérdidas"
          />
          <Stat
            label="Upside techado (entrada → strike)"
            value={fmtPct(r.upside * 100)}
            sub={`Ganancia sobre la acción si te asignan: ${fmtUSD(
              r.gananciaAccion,
            )}`}
          />
        </div>

        {/* disclaimer */}
        <p className="mt-8 rounded-xl border border-white/8 bg-[#131318] p-4 text-xs leading-relaxed text-zinc-500">
          ⚠️ Esta herramienta es solo para fines educativos e informativos.{" "}
          <strong className="text-zinc-400">No constituye asesoría financiera</strong>,
          recomendación de inversión ni oferta de compra o venta de ningún
          activo. Los resultados son estimaciones simplificadas que no incluyen
          comisiones, impuestos, dividendos ni el riesgo de caída del subyacente.
          Invierte bajo tu propia responsabilidad.
        </p>
      </div>
    </div>
  );
}
