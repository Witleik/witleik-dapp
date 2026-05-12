"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWitxBalance } from "@/hooks/useWitxBalance";

const WITX_MINT = "irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8";

interface Tier {
  name: string;
  minBalance: number;
  color: string;
  description: string;
}

const TIERS: Tier[] = [
  {
    name: "Leyenda",
    minBalance: 250000,
    color: "#ffc933",
    description: "Inversor élite del ecosistema Witleik",
  },
  {
    name: "Pilar",
    minBalance: 100000,
    color: "#ffd966",
    description: "Sostén del ecosistema Witleik",
  },
  {
    name: "Magnate",
    minBalance: 50000,
    color: "#14b8d4",
    description: "Inversor mayoritario de $WITX",
  },
  {
    name: "Patrocinador",
    minBalance: 2500,
    color: "#23e7ff",
    description: "Inversor comprometido con Witleik",
  },
  {
    name: "Miembro",
    minBalance: 1000,
    color: "#4eedff",
    description: "Miembro activo de Witleik Society",
  },
  {
    name: "Aliado",
    minBalance: 100,
    color: "#a5f3ff",
    description: "Aliado del ecosistema Witleik",
  },
];

function getTier(balance: number): Tier | null {
  for (const tier of TIERS) {
    if (balance >= tier.minBalance) return tier;
  }
  return null;
}

function scrollToSwap() {
  const swapElement = document.getElementById("witleik-swap");
  if (swapElement) {
    swapElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function MyPosition() {
  const { publicKey } = useWallet();
  const { balance, loading } = useWitxBalance();
  const [precio, setPrecio] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const resp = await fetch(
          `https://lite-api.jup.ag/price/v3?ids=${WITX_MINT}`
        );
        const data = await resp.json();
        setPrecio(data[WITX_MINT]?.usdPrice ?? null);
      } catch (err) {
        console.error("Error fetching $WITX price:", err);
      }
    }
    fetchPrice();
  }, []);

  if (!publicKey) return null;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.12)] rounded-2xl p-8">
        <div className="h-32 w-full bg-zinc-800/30 animate-pulse rounded" />
      </div>
    );
  }
  
  const userBalance = balance ?? 0;
  const valorUsd = precio !== null ? userBalance * precio : null;
  const tier = getTier(userBalance);
  const porcentajeSupply = (userBalance / 1000000) * 100;

  if (userBalance < 100) {
    return (
      <div className="relative bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.12)] rounded-2xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#23e7ff] opacity-[0.04] rounded-full blur-3xl" />
        <div className="relative">
          <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-4">
            Mi Posicion
          </h3>
          <p className="text-2xl font-bold text-white mb-2">
            Aun no eres parte del ecosistema
          </p>
          <p className="text-zinc-400 mb-6">
            Necesitas minimo 100 $WITX para entrar a Witleik Society y desbloquear beneficios.
          </p>
          <button
            onClick={scrollToSwap}
            className="bg-gradient-to-r from-[#23e7ff] to-[#14b8d4] text-[#0a0a0b] font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(35,231,255,0.4)] transition-all"
          >
            Comprar mi primer $WITX
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.2)] rounded-2xl p-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#23e7ff] opacity-[0.05] rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold">
            Mi Posicion
          </h3>
          {tier && (
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full border"
              style={{
                borderColor: `${tier.color}40`,
                background: `${tier.color}10`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                style={{ background: tier.color }}
              />
              <span
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: tier.color }}
              >
                {tier.name}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              Tu balance
            </p>
            <p
              className="text-4xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {userBalance.toLocaleString("es-ES", { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-zinc-500 mt-1">$WITX</p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              Valor en USD
            </p>
            {valorUsd !== null ? (
              <>
                <p
                  className="text-4xl font-bold text-[#23e7ff] tracking-tight"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  ${valorUsd.toFixed(2)}
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  {porcentajeSupply.toFixed(3)}% del supply circulante
                </p>
              </>
            ) : (
              <div className="h-10 w-32 bg-zinc-800/30 animate-pulse rounded" />
            )}
          </div>
        </div>

        {tier && (
          <div className="mb-6 p-4 rounded-xl bg-[rgba(35,231,255,0.04)] border border-[rgba(35,231,255,0.1)]">
            <p className="text-sm text-zinc-300">
              <span className="font-semibold" style={{ color: tier.color }}>
                {tier.name}:
              </span>{" "}
              {tier.description}
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-[rgba(35,231,255,0.08)]">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Proxima recompra
            </p>
            <p className="text-sm text-white">
              <span className="text-[#23e7ff] font-semibold">Mensual</span> · 100% de los fees al token
            </p>
          </div>
          <button
            onClick={scrollToSwap}
            className="bg-gradient-to-r from-[#23e7ff] to-[#14b8d4] text-[#0a0a0b] font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(35,231,255,0.4)] transition-all whitespace-nowrap"
          >
            Comprar mas $WITX
          </button>
        </div>
      </div>
    </div>
  );
}