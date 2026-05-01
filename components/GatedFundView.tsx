"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWitxBalance } from "@/hooks/useWitxBalance";
import { GATE_THRESHOLD } from "@/lib/constants";

export function GatedFundView() {
  const { publicKey } = useWallet();
  const { balance, loading } = useWitxBalance();

  if (!publicKey) {
    return (
      <div className="rounded-2xl border border-cyan-400/20 bg-black p-6 text-center">
        <p className="text-zinc-400">Conecta tu wallet para ver las posiciones del fondo</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-cyan-400/20 bg-black p-6 text-center">
        <p className="text-zinc-400">Verificando balance...</p>
      </div>
    );
  }

  const passes = (balance ?? 0) >= GATE_THRESHOLD;

  if (!passes) {
    return (
      <div className="rounded-2xl border border-cyan-400/20 bg-black p-6 text-center">
        <p className="text-white text-lg font-semibold mb-2">Acceso restringido</p>
        <p className="text-zinc-400 mb-1">
          Necesitas mínimo <span className="text-cyan-400">{GATE_THRESHOLD.toLocaleString()} $WITX</span> para ver las posiciones detalladas del fondo.
        </p>
        <p className="text-zinc-500 text-sm">
          Balance actual: {(balance ?? 0).toLocaleString()} $WITX
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-black p-6">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Posiciones del Fondo</h2>
      <p className="text-zinc-400">Holder verificado · {(balance ?? 0).toLocaleString()} $WITX</p>
      <p className="text-sm text-zinc-500 mt-4">Próximo deploy: Kamino · Orca LP · OnRe · Huma en vivo.</p>
    </div>
  );
}