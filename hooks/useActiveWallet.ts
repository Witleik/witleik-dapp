"use client";

import { useWallet } from "@solana/wallet-adapter-react";

export type ActiveWalletSource = "phantom" | null;

export interface ActiveWallet {
  /** Dirección Solana en base58 de la wallet activa, o null si no hay ninguna. */
  address: string | null;
  /** Origen de la wallet activa. */
  source: ActiveWalletSource;
  /** true mientras el proveedor todavía se está inicializando. */
  isLoading: boolean;
}

/**
 * Devuelve la wallet Solana activa vía @solana/wallet-adapter (Phantom /
 * Solflare). Único origen desde que se quitó el login con Privy (2026-08-09,
 * decisión de Manza): solo se entra conectando la wallet.
 */
export function useActiveWallet(): ActiveWallet {
  const { publicKey, connected, connecting } = useWallet();

  if (connected && publicKey) {
    return {
      address: publicKey.toBase58(),
      source: "phantom",
      isLoading: connecting,
    };
  }

  return { address: null, source: null, isLoading: connecting };
}
