"use client";

import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useWrappedReownAdapter } from "@jup-ag/jup-mobile-adapter";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useReferralRegistration } from "@/hooks/useReferralRegistration";

function ReferralTracker() {
  useReferralRegistration();
  return null;
}

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
      enableWallets: true,
      featuredWalletIds: [
        "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Phantom
        "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // Solflare
        "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Backpack
      ],
    },
  });

  const wallets = useMemo(
    () => [reownAdapter, jupiterAdapter],
    [reownAdapter, jupiterAdapter]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ReferralTracker />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}