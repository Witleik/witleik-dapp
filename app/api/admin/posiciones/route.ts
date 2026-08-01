import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PublicKey } from "@solana/web3.js";
import crypto from "crypto";

// Las route handlers de Next 16 no se cachean por defecto (POST nunca se cachea).
// Forzamos runtime Node porque usamos el módulo `crypto` para verificar Ed25519.
export const runtime = "nodejs";

// Wallet del fondo: única autorizada a escribir. El gating del frontend es solo
// visual; la verdadera autorización vive aquí, comprobando una FIRMA real.
const FUND_WALLET = "SvCqj2Rbbv4GHCQt3doLzGK1KFEs4zeStgwokKRgxba";

// Ventana anti-replay: una firma solo es válida 120 s.
const MAX_SKEW_MS = 120_000;

// Prefijo DER (SPKI) para una clave pública Ed25519 cruda de 32 bytes.
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

// Cliente con service role: bypassa RLS. SOLO se instancia en el servidor.
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service role configuration");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Verifica que `message` fue firmado por la clave privada de la wallet del fondo.
function verifyFundSignature(
  message: string,
  signatureB64: string,
  wallet: string
): boolean {
  if (wallet !== FUND_WALLET) return false;
  try {
    const sig = Buffer.from(signatureB64, "base64");
    if (sig.length !== 64) return false;
    const pub = Buffer.from(new PublicKey(wallet).toBytes());
    const der = Buffer.concat([ED25519_SPKI_PREFIX, pub]);
    const keyObject = crypto.createPublicKey({
      key: der,
      format: "der",
      type: "spki",
    });
    return crypto.verify(null, Buffer.from(message, "utf8"), keyObject, sig);
  } catch {
    return false;
  }
}

function num(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

export async function POST(req: NextRequest) {
  try {
    const { message, signature, wallet } = await req.json();

    if (
      typeof message !== "string" ||
      typeof signature !== "string" ||
      typeof wallet !== "string"
    ) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    // 1) Verificar la firma contra la wallet del fondo.
    if (!verifyFundSignature(message, signature, wallet)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2) Parsear el payload firmado y comprobar la ventana anti-replay.
    let parsed: { action?: string; ts?: number; position?: Record<string, unknown> };
    try {
      parsed = JSON.parse(message);
    } catch {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const { action, ts, position } = parsed;
    if (typeof ts !== "number" || Math.abs(Date.now() - ts) > MAX_SKEW_MS) {
      return NextResponse.json({ error: "Firma expirada" }, { status: 401 });
    }

    const db = adminClient();
    const now = new Date().toISOString();

    // 3) Ejecutar la acción con service role.
    if (action === "close") {
      const id = position?.id;
      if (!id) {
        return NextResponse.json({ error: "Falta id" }, { status: 400 });
      }
      // Nunca borramos: solo marcamos como cerrada.
      const { data, error } = await db
        .from("positions_equity")
        .update({ status: "closed", updated_at: now })
        .eq("id", id)
        .select()
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    }

    if (action === "upsert") {
      if (!position || typeof position !== "object") {
        return NextResponse.json({ error: "Falta posición" }, { status: 400 });
      }

      const row: Record<string, unknown> = {
        ticker: str(position.ticker),
        position_type: str(position.position_type),
        shares: num(position.shares),
        avg_cost: num(position.avg_cost),
        current_price: num(position.current_price),
        strike: num(position.strike),
        expiration: str(position.expiration),
        pl_percent: num(position.pl_percent),
        notes: str(position.notes),
        updated_at: now,
      };

      if (!row.ticker) {
        return NextResponse.json({ error: "Ticker requerido" }, { status: 400 });
      }

      const id = position.id;
      if (id) {
        // Edición: no tocamos `status` (se mantiene como esté).
        const { data, error } = await db
          .from("positions_equity")
          .update(row)
          .eq("id", id)
          .select()
          .single();
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data });
      }

      // Alta: nace activa.
      row.status = "active";
      const { data, error } = await db
        .from("positions_equity")
        .insert(row)
        .select()
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data }, { status: 201 });
    }

    return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
  } catch (err) {
    console.error("[admin/posiciones] error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
