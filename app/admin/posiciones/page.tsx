"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/lib/supabase";
import { ConnectButton } from "@/components/ConnectButton";

// Mismo patrón de gating por wallet que app/admin/page.tsx.
const FUND_WALLET = "SvCqj2Rbbv4GHCQt3doLzGK1KFEs4zeStgwokKRgxba";

const CYAN = "#23e7ff";

type Position = {
  id: string;
  ticker: string | null;
  position_type: string | null;
  shares: number | null;
  avg_cost: number | null;
  current_price: number | null;
  strike: number | null;
  expiration: string | null;
  pl_percent: number | null;
  status: string | null;
  notes: string | null;
  updated_at: string | null;
};

type FormState = {
  id?: string;
  ticker: string;
  position_type: string;
  shares: string;
  avg_cost: string;
  current_price: string;
  strike: string;
  expiration: string;
  pl_percent: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  ticker: "",
  position_type: "",
  shares: "",
  avg_cost: "",
  current_price: "",
  strike: "",
  expiration: "",
  pl_percent: "",
  notes: "",
};

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function fmtNum(v: number | null, digits = 2): string {
  return v === null || v === undefined ? "—" : v.toFixed(digits);
}

export default function PosicionesPage() {
  const { publicKey, signMessage } = useWallet();
  const isFund = publicKey?.toBase58() === FUND_WALLET;

  const [rows, setRows] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("positions_equity")
      .select("*")
      .eq("status", "active")
      .order("updated_at", { ascending: false });
    if (error) setError(error.message);
    setRows((data as Position[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isFund) load();
  }, [isFund, load]);

  // Firma la acción con la wallet del fondo y la envía a la API server-side.
  const callApi = useCallback(
    async (action: "upsert" | "close", position: Record<string, unknown>) => {
      if (!publicKey || !signMessage) {
        throw new Error("La wallet no soporta firmar mensajes.");
      }
      const message = JSON.stringify({ action, ts: Date.now(), position });
      const sig = await signMessage(new TextEncoder().encode(message));
      const res = await fetch("/api/admin/posiciones", {
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
      return json.data as Position;
    },
    [publicKey, signMessage]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await callApi("upsert", {
        id: form.id,
        ticker: form.ticker,
        position_type: form.position_type,
        shares: form.shares,
        avg_cost: form.avg_cost,
        current_price: form.current_price,
        strike: form.strike,
        expiration: form.expiration,
        pl_percent: form.pl_percent,
        notes: form.notes,
      });
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  }

  async function handleClose(id: string) {
    setError(null);
    setBusy(true);
    try {
      await callApi("close", { id });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(p: Position) {
    setForm({
      id: p.id,
      ticker: p.ticker ?? "",
      position_type: p.position_type ?? "",
      shares: p.shares?.toString() ?? "",
      avg_cost: p.avg_cost?.toString() ?? "",
      current_price: p.current_price?.toString() ?? "",
      strike: p.strike?.toString() ?? "",
      expiration: p.expiration ?? "",
      pl_percent: p.pl_percent?.toString() ?? "",
      notes: p.notes ?? "",
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
              Panel privado · Posiciones
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Posiciones <span style={{ color: CYAN }}>Bolsa</span>
          </h1>
        </div>

        {!isFund ? (
          <div className="mt-6 rounded-2xl border border-[rgba(35,231,255,0.2)] bg-[#0a0a0a] p-8 text-center">
            <p className="mb-2 text-lg font-semibold text-white">Acceso restringido</p>
            <p className="mb-6 text-zinc-400">
              {publicKey
                ? "Esta wallet no tiene acceso al panel privado del fondo."
                : "Conecta la wallet del fondo para gestionar las posiciones."}
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Formulario alta / edición */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[rgba(35,231,255,0.2)] bg-[#0d0d0d] p-6"
            >
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {form.id ? "Editar posición" : "Nueva posición"}
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Field label="Ticker" value={form.ticker} onChange={(v) => setForm({ ...form, ticker: v })} placeholder="AAPL" required />
                <Field label="Tipo" value={form.position_type} onChange={(v) => setForm({ ...form, position_type: v })} placeholder="acción / call / put" />
                <Field label="Shares" value={form.shares} onChange={(v) => setForm({ ...form, shares: v })} type="number" placeholder="100" />
                <Field label="Costo prom." value={form.avg_cost} onChange={(v) => setForm({ ...form, avg_cost: v })} type="number" placeholder="180.5" />
                <Field label="Precio actual" value={form.current_price} onChange={(v) => setForm({ ...form, current_price: v })} type="number" placeholder="195.2" />
                <Field label="Strike" value={form.strike} onChange={(v) => setForm({ ...form, strike: v })} type="number" placeholder="200" />
                <Field label="Vencimiento" value={form.expiration} onChange={(v) => setForm({ ...form, expiration: v })} type="date" />
                <Field label="P/L %" value={form.pl_percent} onChange={(v) => setForm({ ...form, pl_percent: v })} type="number" placeholder="8.1" />
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-zinc-500">Notas</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#23e7ff]"
                />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[#23e7ff] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? "Firmando…" : form.id ? "Guardar cambios" : "Agregar posición"}
                </button>
                {form.id && (
                  <button
                    type="button"
                    onClick={() => setForm(EMPTY_FORM)}
                    className="rounded-lg border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {/* Tabla de posiciones activas */}
            <div className="overflow-x-auto rounded-2xl border border-[rgba(35,231,255,0.2)] bg-[#0d0d0d]">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-4 py-3">Ticker</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Shares</th>
                    <th className="px-4 py-3">Strike</th>
                    <th className="px-4 py-3">Vencimiento</th>
                    <th className="px-4 py-3">P/L %</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                        Cargando…
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                        Sin posiciones activas.
                      </td>
                    </tr>
                  ) : (
                    rows.map((p) => {
                      const pl = p.pl_percent ?? 0;
                      return (
                        <tr key={p.id} className="border-b border-zinc-900 last:border-0">
                          <td className="px-4 py-3 font-semibold text-white">{p.ticker ?? "—"}</td>
                          <td className="px-4 py-3 text-zinc-400">{p.position_type ?? "—"}</td>
                          <td className="px-4 py-3 text-zinc-300">{fmtNum(p.shares, 0)}</td>
                          <td className="px-4 py-3 text-zinc-300">{fmtNum(p.strike)}</td>
                          <td className="px-4 py-3 text-zinc-300">{p.expiration ?? "—"}</td>
                          <td
                            className="px-4 py-3 font-semibold"
                            style={{ color: pl >= 0 ? CYAN : "#ff5c5c" }}
                          >
                            {p.pl_percent === null ? "—" : `${pl > 0 ? "+" : ""}${pl.toFixed(2)}%`}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => startEdit(p)}
                                disabled={busy}
                                className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition hover:border-[#23e7ff] hover:text-[#23e7ff] disabled:opacity-50"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleClose(p.id)}
                                disabled={busy}
                                className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
                              >
                                Cerrar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-500">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#23e7ff]"
      />
    </div>
  );
}
