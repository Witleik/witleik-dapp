import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import crypto from "crypto";
import { getWitxMarket } from "@/lib/witx";
import { getHolders } from "@/lib/holders";

// runtime Node por el módulo `crypto` de la verificación Ed25519.
export const runtime = "nodejs";

// POR QUÉ ESTO VA PROTEGIDO Y /api/witx NO
// El precio es público; el reparto de quién tiene cuánto, aunque esté en la
// cadena y cualquiera con un explorador pueda reconstruirlo, servido en una
// tabla ordenada y con los importes en dólares es otra cosa. Se pide la misma
// firma que para escribir posiciones: es POST y va firmado, no un GET abierto.
const FUND_WALLET = "SvCqj2Rbbv4GHCQt3doLzGK1KFEs4zeStgwokKRgxba";
const MAX_SKEW_MS = 120_000;
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

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

    if (!verifyFundSignature(message, signature, wallet)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let parsed: { action?: string; ts?: number };
    try {
      parsed = JSON.parse(message);
    } catch {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    if (typeof parsed.ts !== "number" || Math.abs(Date.now() - parsed.ts) > MAX_SKEW_MS) {
      return NextResponse.json({ error: "Firma expirada" }, { status: 401 });
    }

    // El precio primero: el valor en dólares de cada inversor sale de él, y si
    // no hay precio se devuelven igualmente las cantidades de tokens con los
    // importes a null, en vez de fallar entero. Saber cuántos tokens tiene cada
    // uno ya es la mitad de la respuesta.
    const market = await getWitxMarket();
    const holders = await getHolders(market.priceUsd);

    return NextResponse.json({ market, ...holders });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error en el servidor" },
      { status: 500 }
    );
  }
}
