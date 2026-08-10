"use client";

import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WitxPriceLive } from "@/components/WitxPriceLive";
import type { Holders } from "@/lib/holders";

// Mismo gate visual que el resto de /admin. La autorización de verdad está en
// el endpoint, que exige una firma de la wallet del fondo: aquí solo se decide
// qué se pinta, y de eso no depende ningún secreto.
const FUND_WALLET = "SvCqj2Rbbv4GHCQt3doLzGK1KFEs4zeStgwokKRgxba";

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function fmtUsd(v: number | null): string {
  if (v === null || !Number.isFinite(v)) return "—";
  return (
    "$" +
    v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function fmtTokens(v: number): string {
  return v.toLocaleString("es-ES", { maximumFractionDigits: 2 });
}

function corta(w: string): string {
  return w.slice(0, 4) + "…" + w.slice(-4);
}

export default function InversoresPage() {
  const { publicKey, signMessage } = useWallet();
  const isFund = publicKey?.toBase58() === FUND_WALLET;

  const [datos, setDatos] = useState<Holders | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setError("La wallet no soporta firmar mensajes.");
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const message = JSON.stringify({ action: "inversores", ts: Date.now() });
      const sig = await signMessage(new TextEncoder().encode(message));
      const res = await fetch("/api/admin/inversores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          signature: toBase64(sig),
          wallet: publicKey.toBase58(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error en el servidor");
      setDatos(json as Holders);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, [publicKey, signMessage]);

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] px-6 pb-24 pt-8"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(35,231,255,0.2)] bg-[rgba(35,231,255,0.05)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#23e7ff]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#23e7ff]">
              Panel privado
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Inversores <span style={{ color: "#23e7ff" }}>Witleik</span>
          </h1>
        </div>

        {!isFund ? (
          <div className="mt-6 rounded-2xl border border-[rgba(35,231,255,0.2)] bg-[#0a0a0a] p-8 text-center">
            <p className="mb-2 text-lg font-semibold text-white">Acceso restringido</p>
            <p className="text-zinc-400">
              {publicKey
                ? "Esta wallet no tiene acceso al panel privado del fondo."
                : "Conecta la wallet del fondo para acceder al panel privado."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <WitxPriceLive />

            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0f0f12] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Quién tiene $WITX
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Leído de la cadena. La lista da wallets, no nombres: para ver
                    nombres haría falta una tabla que asocie wallet con persona.
                  </p>
                </div>
                <button
                  onClick={cargar}
                  disabled={cargando}
                  className="rounded-lg border border-[rgba(35,231,255,0.4)] px-4 py-2 text-sm font-semibold text-[#23e7ff] transition hover:bg-[rgba(35,231,255,0.1)] disabled:opacity-40"
                >
                  {cargando ? "Leyendo la cadena..." : datos ? "Actualizar" : "Cargar inversores"}
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-[rgba(255,68,68,0.35)] bg-[rgba(255,68,68,0.06)] px-3 py-2 text-xs text-[#ffb0b0]">
                  {error}
                </div>
              )}

              {datos && (
                <>
                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0d] px-4 py-3">
                      <div className="text-[9.5px] uppercase tracking-[0.12em] text-zinc-500">
                        Inversores
                      </div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums text-white">
                        {datos.total}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0d] px-4 py-3">
                      <div className="text-[9.5px] uppercase tracking-[0.12em] text-zinc-500">
                        Tokens en manos
                      </div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums text-white">
                        {fmtTokens(datos.totalTokens)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0d] px-4 py-3">
                      <div className="text-[9.5px] uppercase tracking-[0.12em] text-zinc-500">
                        Valor a precio de hoy
                      </div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums text-[#00ff88]">
                        {fmtUsd(datos.totalUsd)}
                      </div>
                    </div>
                  </div>

                  {/* Un tope alcanzado se dice. Una tabla recortada en silencio
                      se lee como una tabla completa, y las cuentas cuadrarían
                      mal sin que nadie supiera por qué. */}
                  {datos.truncado && (
                    <div className="mt-4 rounded-lg border border-[rgba(255,184,0,0.3)] bg-[rgba(255,184,0,0.07)] px-3 py-2 text-xs text-[#ffd479]">
                      Hay más poseedores de los que he leído: me he parado en el
                      tope de páginas. Los totales de arriba son de lo leído, no
                      del total real.
                    </div>
                  )}

                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[rgba(255,255,255,0.08)] text-left text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                          <th className="pb-2 pr-3 font-semibold">#</th>
                          <th className="pb-2 pr-3 font-semibold">Wallet</th>
                          <th className="pb-2 pr-3 text-right font-semibold">$WITX</th>
                          <th className="pb-2 pr-3 text-right font-semibold">%</th>
                          <th className="pb-2 text-right font-semibold">Valor hoy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datos.holders.map((h, i) => (
                          <tr
                            key={h.wallet}
                            className="border-b border-[rgba(255,255,255,0.04)]"
                          >
                            <td className="py-2 pr-3 text-zinc-600">{i + 1}</td>
                            <td className="py-2 pr-3">
                              <span className="font-mono text-xs text-zinc-300">
                                {corta(h.wallet)}
                              </span>
                              {h.etiqueta && (
                                <span className="ml-2 rounded-full border border-[rgba(35,231,255,0.35)] px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#23e7ff]">
                                  {h.etiqueta}
                                </span>
                              )}
                            </td>
                            <td className="py-2 pr-3 text-right tabular-nums text-white">
                              {fmtTokens(h.amount)}
                            </td>
                            <td className="py-2 pr-3 text-right tabular-nums text-zinc-400">
                              {h.share.toFixed(2)} %
                            </td>
                            <td className="py-2 text-right tabular-nums text-[#00ff88]">
                              {fmtUsd(h.valueUsd)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
