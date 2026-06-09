"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { NavCalculator } from "@/components/NavCalculator";

// Gate frontend v1 - para datos sensibles reales mover verificación a backend
const FUND_WALLET = "SvCqj2Rbbv4GHCQt3doLzGK1KFEs4zeStgwokKRgxba";

export default function AdminPage() {
  const { publicKey } = useWallet();
  const isFund = publicKey?.toBase58() === FUND_WALLET;

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] px-6 pb-24 pt-8"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="mx-auto max-w-3xl">
        {/* cabecera */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(35,231,255,0.2)] bg-[rgba(35,231,255,0.05)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#23e7ff]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#23e7ff]">
              Panel privado
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Admin <span style={{ color: "#23e7ff" }}>Witleik</span>
          </h1>
        </div>

        {/* Gate: si no es la wallet del fondo, no se renderiza nada del contenido */}
        {!isFund ? (
          <div className="mt-6 rounded-2xl border border-[rgba(35,231,255,0.2)] bg-[#0a0a0a] p-8 text-center">
            <p className="mb-2 text-lg font-semibold text-white">
              Acceso restringido
            </p>
            <p className="text-zinc-400">
              {publicKey
                ? "Esta wallet no tiene acceso al panel privado del fondo."
                : "Conecta la wallet del fondo para acceder al panel privado."}
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              NAV por Token
            </h2>
            <NavCalculator />
          </div>
        )}
      </div>
    </div>
  );
}
