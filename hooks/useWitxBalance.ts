"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { WITX_MINT } from "@/lib/constants";

export function useWitxBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: new PublicKey(WITX_MINT),
        });

        const total = accounts.value.reduce((sum, acc) => {
          const amount = acc.account.data.parsed.info.tokenAmount.uiAmount ?? 0;
          return sum + amount;
        }, 0);

        if (!cancelled) setBalance(total);
      } catch (err) {
        console.error("Error fetching $WITX balance:", err);
        if (!cancelled) setBalance(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [publicKey, connection]);

  return { balance, loading };
}
