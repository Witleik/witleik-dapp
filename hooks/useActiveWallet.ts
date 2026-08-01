"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";

export type ActiveWalletSource = "phantom" | "privy" | null;

export interface ActiveWallet {
  /** Dirección Solana en base58 de la wallet activa, o null si no hay ninguna. */
  address: string | null;
  /** Origen de la wallet activa. */
  source: ActiveWalletSource;
  /** true mientras alguno de los proveedores todavía se está inicializando. */
  isLoading: boolean;
}

/**
 * Devuelve la wallet Solana activa combinando dos orígenes independientes:
 *
 *  1. Phantom/Solflare vía @solana/wallet-adapter (PRIORIDAD).
 *  2. Wallet Solana embebida de Privy (email / Google), como fallback.
 *
 * Si Phantom está conectado, esa wallet gana. Si no, se usa la embebida de
 * Privy cuando el usuario está autenticado por email/Google.
 */
export function useActiveWallet(): ActiveWallet {
  // Origen 1: wallet-adapter (Phantom / Solflare)
  const { publicKey, connected, connecting } = useWallet();

  // Origen 2: Privy (auth + wallet Solana embebida)
  const { ready: privyReady, authenticated } = usePrivy();
  const { ready: solanaWalletsReady, wallets } = useSolanaWallets();

  const isLoading = !privyReady || connecting || !solanaWalletsReady;

  // Prioridad: Phantom / Solflare conectado por wallet-adapter.
  if (connected && publicKey) {
    return {
      address: publicKey.toBase58(),
      source: "phantom",
      isLoading,
    };
  }

  // Fallback: wallet Solana embebida de Privy.
  const embedded = wallets[0];
  if (authenticated && embedded) {
    return {
      address: embedded.address,
      source: "privy",
      isLoading,
    };
  }

  return { address: null, source: null, isLoading };
}
