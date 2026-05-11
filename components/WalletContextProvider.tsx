"use client";

import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useWrappedReownAdapter } from "@jup-ag/jup-mobile-adapter";
import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_HELIUS_RPC!;
  const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!;

  const { reownAdapter, jupiterAdapter } = useWrappedReownAdapter({
    appKitOptions: {
      metadata: {
        name: "Witleik Capital",
        description: "Fondo de inversión híbrido en Solana. Transparencia radical.",
        url: "https://app.witleikcapital.com",
        icons: ["https://app.witleikcapital.com/web-app-manifest-512x512.png"],
      },
      projectId,
      features: {
        analytics: false,
        socials: ["google", "x", "apple"],
        email: false,
      },
      enableWallets: false,
    },
  });

  const wallets = useMemo(
    () => [reownAdapter, jupiterAdapter],
    [reownAdapter, jupiterAdapter]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}