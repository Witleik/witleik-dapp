"use client";

import { ReactNode, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";

const WITX_MINT = "irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8";
const MINIMO_WITX = 1000;

export function LeccionPremiumGate({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function verificarBalance() {
      if (!publicKey || !connection) return;
      setCargando(true);
      try {
        const cuentas = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });
        const cuentaWitx = cuentas.value.find(
          (c) => c.account.data.parsed.info.mint === WITX_MINT
        );
        const cantidad = cuentaWitx?.account.data.parsed.info.tokenAmount.uiAmount ?? 0;
        setBalance(cantidad);
      } catch (error) {
        console.error("Error verificando balance:", error);
        setBalance(0);
      } finally {
        setCargando(false);
      }
    }
    if (connected && publicKey) verificarBalance();
    else setBalance(null);
  }, [publicKey, connected, connection]);

  if (!connected) return <PantallaBloqueo motivo="conectar" />;
  if (cargando) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-[#23e7ff] border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-500 uppercase tracking-wider">Verificando tu balance de $WITX...</p>
        </div>
      </div>
    );
  }
  if (balance === null || balance < MINIMO_WITX) return <PantallaBloqueo motivo="insuficiente" balance={balance ?? 0} />;
  return <>{children}</>;
}

function PantallaBloqueo({ motivo, balance }: { motivo: "conectar" | "insuficiente"; balance?: number }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        <div className="relative bg-gradient-to-br from-[#131318] to-[#0a0a0b] border border-[rgba(35,231,255,0.2)] rounded-2xl p-8 md:p-10 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#23e7ff] opacity-[0.05] rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(35,231,255,0.1)] border border-[rgba(35,231,255,0.3)] mb-6">
              <span className="text-3xl">🔒</span>
            </div>
            <p className="text-xs text-[#23e7ff] uppercase tracking-[0.2em] font-semibold mb-3">Contenido Premium</p>
            {motivo === "conectar" ? (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Conecta tu wallet para acceder</h2>
                <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto">Esta lección está reservada para holders con mínimo 1,000 $WITX. Conecta tu wallet para verificar tu acceso.</p>
                <div className="flex justify-center"><ConnectButton /></div>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Necesitas más $WITX</h2>
                <p className="text-sm text-zinc-400 mb-2">Tu balance actual: <span className="text-white font-semibold">{balance?.toLocaleString() ?? 0} $WITX</span></p>
                <p className="text-sm text-zinc-400 mb-8">Mínimo requerido: <span className="text-[#23e7ff] font-semibold">1,000 $WITX</span></p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={`https://jup.ag/swap/SOL-${WITX_MINT}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg bg-[#23e7ff] text-black font-semibold text-sm hover:bg-[#1ad4ec] transition-all">Comprar $WITX en Jupiter</a>
                  <Link href="/academia" className="px-6 py-3 rounded-lg border border-[rgba(35,231,255,0.3)] text-white font-semibold text-sm hover:border-[#23e7ff] transition-all">Volver a la academia</Link>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-zinc-600 mt-6">¿Dudas sobre cómo comprar $WITX? <Link href="/academia/invertir-en-witleik" className="text-[#23e7ff] hover:underline">Lee la lección gratuita</Link></p>
      </div>
    </div>
  );
}
