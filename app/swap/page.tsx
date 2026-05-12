"use client";

import { JupiterSwap } from "@/components/JupiterSwap";

export default function SwapPage() {
  return (
    <div className="pt-8 px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          Comprar / Vender $WITX
        </h1>
        <p className="text-zinc-400 mb-8">
          Swap directo en Solana. Las comisiones generadas se reinvierten mensualmente en recompras de $WITX.
        </p>
        <JupiterSwap />
      </div>
    </div>
  );
}