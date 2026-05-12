"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";


const WITX_MINT = "irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8";

interface TokenData {
  precio: number | null;
  cambio24h: number | null;
  liquidez: number | null;
  volumen24h: number | null;
}

export default function Home() {
  const [datos, setDatos] = useState<TokenData>({
    precio: null,
    cambio24h: null,
    liquidez: null,
    volumen24h: null,
  });
  const [cargando, setCargando] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respJupiter = await fetch(
          `https://lite-api.jup.ag/price/v3?ids=${WITX_MINT}`
        );
        const datosJupiter = await respJupiter.json();
        const precio = datosJupiter[WITX_MINT]?.usdPrice ?? null;

        const respDex = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${WITX_MINT}`
        );
        const datosDex = await respDex.json();

        const pairs = datosDex.pairs || [];
        const mejorPair = [...pairs].sort(
          (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
        )[0];

        setDatos({
          precio,
          cambio24h: mejorPair?.priceChange?.h24 ?? null,
          liquidez: mejorPair?.liquidity?.usd ?? null,
          volumen24h: mejorPair?.volume?.h24 ?? null,
        });
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  const copiarContrato = () => {
    navigator.clipboard.writeText(WITX_MINT);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const formatearNumero = (num: number) => {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const cambioPositivo = (datos.cambio24h ?? 0) >= 0;

  const dexscreenerUrl = "https://dexscreener.com/solana/" + WITX_MINT;
  const solscanUrl = "https://solscan.io/token/" + WITX_MINT;
  const jupiterUrl = "https://jup.ag/swap/SOL-" + WITX_MINT;

  return (
    <div className="min-h-screen flex flex-col">

      <section className="relative overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-32 w-[800px] h-[800px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(35,231,255,0.18) 0%, rgba(35,231,255,0.04) 30%, transparent 60%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(35,231,255,0.25)] bg-[rgba(35,231,255,0.05)] mb-8 animate-fade-in-up">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse-dot" />
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-300 font-medium">
              Ecosistema en vivo - Solana
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-white">WITLEIK</span>
            <span className="text-[#23e7ff]"> CAPITAL</span>
          </h1>

          <p
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Tu puerta de entrada al ecosistema $WITX.
            <br className="hidden md:block" />
            <span className="text-zinc-500">
              Swap directo, datos en vivo, cero intermediarios.
            </span>
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.12)] rounded-2xl p-8 hover:border-[rgba(35,231,255,0.4)] transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#23e7ff] opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-[0.15em] font-semibold">
                  Precio $WITX
                </p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgba(35,231,255,0.08)]">
                  <div className="w-1 h-1 rounded-full bg-[#23e7ff] animate-pulse-dot" />
                  <span className="text-[10px] text-[#23e7ff] uppercase tracking-wider font-medium">
                    Live
                  </span>
                </div>
              </div>
              {cargando ? (
                <div className="h-12 w-48 bg-zinc-800 animate-pulse rounded" />
              ) : datos.precio !== null ? (
                <>
                  <p
                    className="text-5xl font-bold text-white tracking-tight"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    ${datos.precio.toFixed(6)}
                  </p>
                  {datos.cambio24h !== null && (
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={cambioPositivo ? "text-sm font-semibold text-[#00ff88]" : "text-sm font-semibold text-red-400"}
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {cambioPositivo ? "+" : "-"}{Math.abs(datos.cambio24h).toFixed(2)}%
                      </span>
                      <span className="text-xs text-zinc-500">ultimas 24h</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xl text-red-400">Error</p>
              )}
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.12)] rounded-2xl p-8 hover:border-[rgba(35,231,255,0.4)] transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#23e7ff] opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-[0.15em] font-semibold">
                  Liquidez del pool
                </p>
                <div className="px-2 py-0.5 rounded-full bg-[rgba(35,231,255,0.08)]">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
                    Orca
                  </span>
                </div>
              </div>
              {cargando ? (
                <div className="h-12 w-48 bg-zinc-800 animate-pulse rounded" />
              ) : datos.liquidez !== null ? (
                <>
                  <p
                    className="text-5xl font-bold text-white tracking-tight"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {formatearNumero(datos.liquidez)}
                  </p>
                  {datos.volumen24h !== null && (
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="text-sm text-zinc-400"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        Vol. 24h: {formatearNumero(datos.volumen24h)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xl text-red-400">Sin datos</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full px-6 pb-20">
        <div className="bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.12)] rounded-2xl p-8">
          <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-6">
            Informacion del token
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Contrato
              </p>
              <button
                onClick={copiarContrato}
                className="w-full text-left bg-[rgba(35,231,255,0.05)] hover:bg-[rgba(35,231,255,0.1)] border border-[rgba(35,231,255,0.15)] rounded-lg px-4 py-3 flex items-center justify-between gap-3 transition-all"
              >
                <span
                  className="text-xs md:text-sm text-zinc-300 truncate"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {WITX_MINT}
                </span>
                <span className="text-xs text-[#23e7ff] font-semibold whitespace-nowrap">
                  {copiado ? "Copiado" : "Copiar"}
                </span>
              </button>
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Red
              </p>
              <div className="bg-[rgba(35,231,255,0.05)] border border-[rgba(35,231,255,0.15)] rounded-lg px-4 py-3">
                <span className="text-sm text-white font-semibold">
                  Solana - SPL Token
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={dexscreenerUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[rgba(35,231,255,0.2)] text-zinc-300 hover:text-[#23e7ff] hover:border-[#23e7ff] transition-all">
              Dexscreener
            </a>
            <a href={solscanUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[rgba(35,231,255,0.2)] text-zinc-300 hover:text-[#23e7ff] hover:border-[#23e7ff] transition-all">
              Solscan
            </a>
            <a href={jupiterUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[rgba(35,231,255,0.2)] text-zinc-300 hover:text-[#23e7ff] hover:border-[#23e7ff] transition-all">
              Jupiter
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}