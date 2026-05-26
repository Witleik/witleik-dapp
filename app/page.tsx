"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const WITX_MINT = "irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8";
const WALLET_FONDO = "SvCqj2Rbbv4GHCQt3doLzGK1KFEs4zeStgwokKRgxba";
const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=14438641223&text=Hola%20Manza%2C%20quiero%20informaci%C3%B3n%20para%20invertir%20en%20Witleik";

interface TokenData {
  precio: number | null;
  cambio24h: number | null;
  liquidez: number | null;
}

export default function Home() {
  const [datos, setDatos] = useState<TokenData>({
    precio: null,
    cambio24h: null,
    liquidez: null,
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

  const cambioPositivo = (datos.cambio24h ?? 0) >= 0;
  const dexscreenerUrl = "https://dexscreener.com/solana/" + WITX_MINT;
  const solscanUrl = "https://solscan.io/token/" + WITX_MINT;
  const jupiterUrl = "https://jup.ag/swap/SOL-" + WITX_MINT;
  const walletUrl = "https://solscan.io/account/" + WALLET_FONDO;

  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-32 w-[800px] h-[800px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(35,231,255,0.18) 0%, rgba(35,231,255,0.04) 30%, transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(35,231,255,0.25)] bg-[rgba(35,231,255,0.05)] mb-8 animate-fade-in-up">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse-dot" />
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-300 font-medium">
              Fondo activo en Solana
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
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up mb-3"
            style={{ animationDelay: "0.2s" }}
          >
            Fondo híbrido DeFi + bolsa.
          </p>
          <p
            className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up mb-10"
            style={{ animationDelay: "0.25s" }}
          >
            Operaciones públicas. Cero intermediarios. Transparencia radical.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/posicion"
              className="px-6 py-3 rounded-lg bg-[#23e7ff] text-black font-semibold text-sm hover:bg-[#1ad4ec] transition-all"
            >
              Ver portafolio en vivo
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-[rgba(35,231,255,0.3)] text-white font-semibold text-sm hover:border-[#23e7ff] hover:bg-[rgba(35,231,255,0.05)] transition-all"
            >
              Quiero invertir
            </a>
          </div>
        </div>
      </section>

      {/* MÉTRICAS DEL FONDO */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="AUM" value="$24K" sublabel="Capital gestionado" />
          <MetricCard
            label="Precio $WITX"
            value={
              cargando
                ? null
                : datos.precio !== null
                ? `$${datos.precio.toFixed(6)}`
                : "—"
            }
            sublabel="Live"
            live
          />
          <MetricCard
            label="Cambio 24h"
            value={
              cargando
                ? null
                : datos.cambio24h !== null
                ? `${cambioPositivo ? "+" : "-"}${Math.abs(datos.cambio24h).toFixed(2)}%`
                : "—"
            }
            sublabel="$WITX"
            valueColor={cambioPositivo ? "#00ff88" : "#f87171"}
          />
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-16">
        <div className="text-center mb-10">
          <p className="text-xs text-[#23e7ff] uppercase tracking-[0.2em] font-semibold mb-3">
            Cómo funciona Witleik
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Un ciclo simple. Resultados reales.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CicloCard
            numero="01"
            titulo="Compras $WITX"
            descripcion="Tu compra del token aporta capital al fondo."
          />
          <CicloCard
            numero="02"
            titulo="El fondo invierte"
            descripcion="Ese capital se despliega en estrategias reales para generar rendimiento."
          />
          <CicloCard
            numero="03"
            titulo="Las ganancias vuelven"
            descripcion="Con los beneficios reinvertimos en el propio token. Tu posición crece con el fondo."
          />
        </div>
      </section>

      {/* TRANSPARENCIA */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-16">
        <div className="relative bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.15)] rounded-2xl p-8 md:p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#23e7ff] opacity-[0.04] rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-xs text-[#23e7ff] uppercase tracking-[0.2em] font-semibold mb-3">
              Transparencia radical
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Todo lo que hace el fondo, lo puedes verificar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TransparenciaItem
                titulo="Wallet del fondo"
                descripcion="Pública en Solscan"
                href={walletUrl}
                external
              />
              <TransparenciaItem
                titulo="Posición en vivo"
                descripcion="DeFi + bolsa en tiempo real"
                href="/posicion"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TOKEN INFO */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-16">
        <div className="bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.12)] rounded-2xl p-8">
          <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-6">
            Información del token
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
                  Solana — SPL Token
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={dexscreenerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-2 rounded-lg border border-[rgba(35,231,255,0.2)] text-zinc-300 hover:text-[#23e7ff] hover:border-[#23e7ff] transition-all"
            >
              Dexscreener
            </a>
            <a
              href={solscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-2 rounded-lg border border-[rgba(35,231,255,0.2)] text-zinc-300 hover:text-[#23e7ff] hover:border-[#23e7ff] transition-all"
            >
              Solscan
            </a>
            <a
              href={jupiterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-2 rounded-lg border border-[rgba(35,231,255,0.2)] text-zinc-300 hover:text-[#23e7ff] hover:border-[#23e7ff] transition-all"
            >
              Jupiter
            </a>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-4xl mx-auto w-full px-6 pb-20">
        <div className="relative bg-gradient-to-br from-[rgba(35,231,255,0.08)] to-[rgba(35,231,255,0.02)] border border-[rgba(35,231,255,0.3)] rounded-2xl p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(35,231,255,0.08),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              ¿Quieres invertir en Witleik?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Inversión mínima $500. Hablamos por WhatsApp y te explico cómo funciona, cuánto se está rindiendo y cómo entrar.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg bg-[#23e7ff] text-black font-semibold text-sm hover:bg-[#1ad4ec] transition-all"
            >
              Hablar con Manza
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  live,
  valueColor,
}: {
  label: string;
  value: string | null;
  sublabel: string;
  live?: boolean;
  valueColor?: string;
}) {
  return (
    <div className="group relative bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.12)] rounded-2xl p-5 hover:border-[rgba(35,231,255,0.4)] transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-semibold">
            {label}
          </p>
          {live && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[rgba(35,231,255,0.08)]">
              <div className="w-1 h-1 rounded-full bg-[#23e7ff] animate-pulse-dot" />
              <span className="text-[9px] text-[#23e7ff] uppercase tracking-wider font-medium">
                Live
              </span>
            </div>
          )}
        </div>
        {value === null ? (
          <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded" />
        ) : (
          <p
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: valueColor || "white",
            }}
          >
            {value}
          </p>
        )}
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-2">
          {sublabel}
        </p>
      </div>
    </div>
  );
}

function CicloCard({
  numero,
  titulo,
  descripcion,
}: {
  numero: string;
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="group relative bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.12)] rounded-2xl p-6 hover:border-[rgba(35,231,255,0.4)] transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#23e7ff] opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity" />
      <div className="relative">
        <p
          className="text-xs text-[#23e7ff] font-semibold mb-4"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {numero}
        </p>
        <h3 className="text-lg font-bold text-white mb-2">{titulo}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{descripcion}</p>
      </div>
    </div>
  );
}

function TransparenciaItem({
  titulo,
  descripcion,
  href,
  external,
}: {
  titulo: string;
  descripcion: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="bg-[rgba(35,231,255,0.04)] border border-[rgba(35,231,255,0.12)] rounded-xl p-5 hover:border-[#23e7ff] hover:bg-[rgba(35,231,255,0.08)] transition-all h-full">
      <p className="text-sm font-semibold text-white mb-1">{titulo}</p>
      <p className="text-xs text-zinc-400">{descripcion}</p>
      {href && (
        <p className="text-[10px] text-[#23e7ff] uppercase tracking-wider mt-3">
          {external ? "Ver en Solscan →" : "Abrir →"}
        </p>
      )}
    </div>
  );
  if (!href) return content;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <Link href={href}>{content}</Link>;
}