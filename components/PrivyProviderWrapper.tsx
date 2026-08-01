"use client";

import { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

/**
 * Envuelve la app con Privy para habilitar login con email / Google y crear
 * automáticamente una wallet Solana embebida para usuarios sin wallet.
 *
 * Convive con WalletContextProvider (Phantom/Solflare vía wallet-adapter): son
 * árboles de contexto independientes. Este provider va POR FUERA de
 * WalletContextProvider (ver app/layout.tsx), que queda intacto.
 *
 * No se habilitan cadenas EVM: la wallet Ethereum embebida queda en 'off' por
 * defecto y el modal se limita a Solana (walletChainType: 'solana-only').
 */
export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google"],
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        appearance: {
          theme: "dark",
          accentColor: "#23e7ff",
          walletChainType: "solana-only",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
