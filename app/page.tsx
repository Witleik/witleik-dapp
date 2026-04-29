"use client";

import { useState, useEffect } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const WITX_MINT = "irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8";
const WALLET_FONDO = "SvCqj2Rbbv4GHCQt3doLzGK1KFEs4zeStgwokKRgxba";

export default function Home() {
  const [precio, setPrecio] = useState<number | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solPrecio, setSolPrecio] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respPrecios = await fetch(
          `https://lite-api.jup.ag/price/v3?ids=${WITX_MINT},So11111111111111111111111111111111111111112`
        );
        const datosPrecios = await respPrecios.json();
        setPrecio(datosPrecios[WITX_MINT].usdPrice);
        setSolPrecio(datosPrecios["So11111111111111111111111111111111111111112"].usdPrice);

        const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC;
        if (!rpcUrl) throw new Error("RPC no configurado");
        const connection = new Connection(rpcUrl);
        const lamports = await connection.getBalance(new PublicKey(WALLET_FONDO));
        setSolBalance(lamports / LAMPORTS_PER_SOL);

        setCargando(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  const valorSolUsd = solBalance !== null && solPrecio !== null ? solBalance * solPrecio : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold text-cyan-400">WITLEIK CAPITAL</h1>
      <p className="text-xl text-zinc-400 mt-4 mb-12">Dashboard del fondo</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div className="bg-zinc-900 border border-cyan-400/30 rounded-2xl p-8">
          <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Precio $WITX</p>
          {cargando ? (
            <p className="text-3xl text-zinc-400">Cargando...</p>
          ) : precio !== null ? (
            <p className="text-4xl font-bold text-cyan-400">${precio.toFixed(6)}</p>
          ) : (
            <p className="text-xl text-red-400">Error</p>
          )}
        </div>

        <div className="bg-zinc-900 border border-cyan-400/30 rounded-2xl p-8">
          <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">SOL en wallet del fondo</p>
          {cargando ? (
            <p className="text-3xl text-zinc-400">Cargando...</p>
          ) : solBalance !== null ? (
            <>
              <p className="text-4xl font-bold text-cyan-400">{solBalance.toFixed(4)} SOL</p>
              {valorSolUsd !== null && (
                <p className="text-lg text-zinc-400 mt-2">≈ ${valorSolUsd.toFixed(2)} USD</p>
              )}
            </>
          ) : (
            <p className="text-xl text-red-400">Error</p>
          )}
        </div>
      </div>
    </div>
  );
}