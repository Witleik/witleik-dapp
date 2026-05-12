"use client";

import { JupiterSwap } from "@/components/JupiterSwap";

export default function SwapPage() {
  return (
    <div className="pt-8 px-6 pb-24">
      <div className="max-w-3xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(35,231,255,0.2)] bg-[rgba(35,231,255,0.05)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#23e7ff] animate-pulse-dot" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#23e7ff] font-semibold">
            Swap · Solana
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Comprar / Vender <span style={{color: '#23e7ff'}}>$WITX</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-10 mx-auto">
          Swap directo en Solana. Las comisiones generadas se reinvierten mensualmente en recompras de $WITX.
        </p>
      </div>
      <JupiterSwap />
    </div>
    </div>
  );
}