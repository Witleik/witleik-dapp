"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WitxMarket } from "@/lib/witx";

// El precio de $WITX, en vivo de verdad.
//
// "En vivo" aquí significa que se vuelve a pedir solo cada REFRESCO_MS, no que
// se pida una vez al abrir la pestaña. Es la diferencia entre un precio y una
// foto de un precio, y es justo lo que faltaba: los tres sitios que ya pedían
// el precio lo hacían en un useEffect con dependencias vacías.
//
// Se apaga cuando la pestaña no se ve. Un panel abierto toda la tarde en una
// pestaña de fondo, pidiendo precio cada 20 segundos, son miles de peticiones a
// Jupiter para que no las lea nadie.
const REFRESCO_MS = 20_000;
const VERDE = "#00ff88";
const ROJO = "#ff4444";

function fmtUsd(v: number | null, digits = 6): string {
  if (v === null || !Number.isFinite(v)) return "—";
  return v.toLocaleString("es-ES", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function fmtCorto(v: number | null): string {
  if (v === null || !Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(2) + " M";
  if (Math.abs(v) >= 1_000) return (v / 1_000).toFixed(1) + " K";
  return v.toFixed(2);
}

export function WitxPriceLive({ onMarket }: { onMarket?: (m: WitxMarket) => void }) {
  const [market, setMarket] = useState<WitxMarket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latido, setLatido] = useState(false);
  // El precio anterior vive en una ref y no en el estado: solo sirve para
  // decidir el color del destello, y guardarlo en estado provocaría un render
  // extra en cada vuelta sin cambiar nada de lo que se ve.
  const anterior = useRef<number | null>(null);
  const [direccion, setDireccion] = useState<"sube" | "baja" | null>(null);

  const cargar = useCallback(async () => {
    try {
      // no-store en el cliente: la cache del navegador no debe tapar el
      // refresco. Quien decide cuánto dura el dato es el servidor.
      const res = await fetch("/api/witx", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "No pude leer el precio.");
        return;
      }
      setError(null);
      const previo = anterior.current;
      if (previo !== null && json.priceUsd !== previo) {
        setDireccion(json.priceUsd > previo ? "sube" : "baja");
      }
      anterior.current = json.priceUsd;
      setMarket(json);
      onMarket?.(json);
      setLatido(true);
      setTimeout(() => setLatido(false), 600);
    } catch {
      setError("Error de red al pedir el precio.");
    }
  }, [onMarket]);

  useEffect(() => {
    // La regla react-hooks/set-state-in-effect no distingue una llamada
    // asíncrona de una síncrona: aquí no se toca el estado al montar, se lanza
    // una petición de red y el estado se actualiza cuando responde. Eso es
    // exactamente "suscribirse a un sistema externo", que es el caso que la
    // propia regla permite; solo que no lo puede ver desde el análisis estático.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
    let id: ReturnType<typeof setInterval> | null = null;
    const arrancar = () => {
      if (id === null) id = setInterval(cargar, REFRESCO_MS);
    };
    const parar = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };
    const alCambiarVisibilidad = () => {
      if (document.hidden) parar();
      else {
        cargar();
        arrancar();
      }
    };
    if (!document.hidden) arrancar();
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    return () => {
      parar();
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    };
  }, [cargar]);

  const cambio = market?.priceChange24h ?? null;
  const colorCambio = cambio === null ? "#a1a1a6" : cambio >= 0 ? VERDE : ROJO;

  return (
    <div className="rounded-2xl border border-[rgba(35,231,255,0.2)] bg-[#0f0f12] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: error ? ROJO : VERDE,
                boxShadow: `0 0 8px ${error ? ROJO : VERDE}`,
                opacity: latido ? 1 : 0.45,
                transition: "opacity .5s",
              }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              $WITX en vivo
            </span>
          </div>

          <div
            className="mt-2 text-4xl font-bold tabular-nums md:text-5xl"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color:
                direccion === "sube" ? VERDE : direccion === "baja" ? ROJO : "#fff",
              transition: "color .8s",
            }}
          >
            {market?.priceUsd !== undefined && market?.priceUsd !== null
              ? `$${fmtUsd(market.priceUsd)}`
              : "—"}
          </div>

          {cambio !== null && (
            <div className="mt-1 text-sm font-semibold" style={{ color: colorCambio }}>
              {cambio >= 0 ? "▲" : "▼"} {Math.abs(cambio).toFixed(2)} % · 24 h
            </div>
          )}
        </div>

        <div className="text-right text-xs text-zinc-500">
          {market?.fetchedAt && (
            <div>
              actualizado{" "}
              {new Date(market.fetchedAt).toLocaleTimeString("es", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          )}
          <div className="mt-0.5">se refresca solo cada 20 s</div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-[rgba(255,68,68,0.35)] bg-[rgba(255,68,68,0.06)] px-3 py-2 text-xs text-[#ffb0b0]">
          {error}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Liquidez", market?.liquidityUsd ?? null],
          ["Volumen 24 h", market?.volume24h ?? null],
          ["Supply", market?.supply ?? null],
          ["Valor total", market?.valorTotalUsd ?? null],
        ].map(([etiqueta, valor]) => (
          <div
            key={etiqueta as string}
            className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0d] px-3 py-2.5"
          >
            <div className="text-[9.5px] uppercase tracking-[0.12em] text-zinc-500">
              {etiqueta as string}
            </div>
            <div
              className="mt-1 text-base font-semibold tabular-nums text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {fmtCorto(valor as number | null)}
            </div>
          </div>
        ))}
      </div>

      {/* De dónde salió cada número. Va a la vista y no escondido en la consola:
          si Jupiter se ha caído y el precio viene de DexScreener, quien mira
          esto tiene que poder saberlo sin abrir las herramientas del navegador. */}
      {market?.sources && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-600">
          {Object.entries(market.sources).map(([fuente, estado]) => (
            <span key={fuente}>
              <span style={{ color: estado === "ok" ? "#4b5563" : "#c98a3a" }}>
                {fuente}
              </span>
              : {estado}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
