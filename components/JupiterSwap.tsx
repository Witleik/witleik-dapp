"use client";

import { useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WITX_MINT } from "@/lib/constants";

declare global {
  interface Window {
    Jupiter: {
      init: (props: Record<string, unknown>) => void;
      syncProps?: (props: Record<string, unknown>) => void;
    };
  }
}

const REFERRAL_ACCOUNT = "BNrghHLYHmPGS7fpZMEJTB3ezTLpY7dssoRVRdiCpfLJ";
const REFERRAL_FEE_BPS = 100; // 1%
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export function JupiterSwap() {
  const walletContext = useWallet();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const tryInit = () => {
      if (typeof window === "undefined" || !window.Jupiter) return false;
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "jupiter-swap-container",
        enableWalletPassthrough: true,
        passthroughWalletContextState: walletContext,
        formProps: {
          initialInputMint: WITX_MINT,
          initialOutputMint: USDC_MINT,
          referralAccount: REFERRAL_ACCOUNT,
          referralFee: REFERRAL_FEE_BPS,
        },
      });
      initialized.current = true;
      return true;
    };

    if (tryInit()) return;

    const interval = setInterval(() => {
      if (tryInit()) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [walletContext]);

  useEffect(() => {
    if (initialized.current && typeof window !== "undefined" && window.Jupiter?.syncProps) {
      window.Jupiter.syncProps({ passthroughWalletContextState: walletContext });
    }
  }, [walletContext]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-cyan-400 mb-2 text-center">Comprar / Vender $WITX</h2>
      <p className="text-sm text-zinc-500 mb-6 text-center">Swap directo en Solana · 1% fee de plataforma</p>
      <div id="jupiter-swap-container" className="rounded-2xl overflow-hidden" />
    </div>
  );
}
