// Datos de mercado de $WITX, en un solo sitio y desde el servidor.
//
// POR QUÉ EXISTE ESTE ARCHIVO
// Hasta ahora el precio se pedía en tres componentes distintos —la home
// (app/page.tsx), Mi Posición y la calculadora de NAV—, cada uno con su propio
// fetch y ninguno con refresco. Eso tenía dos consecuencias feas: dos partes de
// la misma pantalla podían estar enseñando precios distintos, y "en vivo" era
// en realidad "el precio de cuando abriste la pestaña".
//
// POR QUÉ DOS FUENTES
// Jupiter va primero porque agrega rutas de swap reales: es el precio que
// pagarías de verdad. DexScreener entra como respaldo y además aporta lo que
// Jupiter no da (variación 24 h, liquidez, volumen, capitalización).
// Si una cae, la otra sostiene el número y se deja dicho de dónde salió: un
// precio sin procedencia no se puede auditar, y estos números acaban delante de
// inversores.
import { WITX_MINT } from "./constants";

export type WitxMarket = {
  priceUsd: number | null;
  priceChange24h: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  marketCapUsd: number | null;
  supply: number | null;
  /** Capitalización recalculada por nosotros (precio × supply real on-chain). */
  valorTotalUsd: number | null;
  fetchedAt: string;
  /**
   * Qué se consultó y cómo fue: {"jupiter":"ok","dexscreener":"error: 502"}.
   * Sin esto, un precio a null es indistinguible de un precio cero y no hay
   * forma de saber cuál de las dos fuentes falló.
   */
  sources: Record<string, string>;
};

const JUPITER = "https://lite-api.jup.ag/price/v3";
const DEXSCREENER = "https://api.dexscreener.com/latest/dex/tokens";

// 30 s, el mismo que ya usaba /api/scan: suficiente para que se sienta vivo sin
// que Jupiter nos empiece a limitar por exceso de peticiones.
const CACHE_S = 30;

// El supply cambia con emisiones y quemas, no cada minuto, y además se pide por
// POST (que Next no cachea). Se guarda en memoria del proceso 5 minutos para no
// castigar a Helius en cada carga. Si el proceso se recicla se vuelve a pedir:
// es una optimización, no un estado del que dependa nada.
const SUPPLY_TTL_MS = 5 * 60 * 1000;
let supplyCache: { valor: number; cuando: number } | null = null;

type Intento<T> = { ok: true; valor: T } | { ok: false; error: string };

function fallo(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

async function precioJupiter(): Promise<Intento<number>> {
  try {
    const res = await fetch(`${JUPITER}?ids=${WITX_MINT}`, {
      next: { revalidate: CACHE_S },
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    const precio = Number(data?.[WITX_MINT]?.usdPrice);
    if (!Number.isFinite(precio) || precio <= 0) {
      return { ok: false, error: "sin precio en la respuesta" };
    }
    return { ok: true, valor: precio };
  } catch (e) {
    return { ok: false, error: fallo(e) };
  }
}

type DatosDex = {
  priceUsd: number | null;
  priceChange24h: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  marketCapUsd: number | null;
};

async function datosDexScreener(): Promise<Intento<DatosDex>> {
  try {
    const res = await fetch(`${DEXSCREENER}/${WITX_MINT}`, {
      next: { revalidate: CACHE_S },
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    const pairs = data?.pairs;
    if (!Array.isArray(pairs) || pairs.length === 0) {
      return { ok: false, error: "sin pares de liquidez" };
    }
    // El par con más liquidez, igual que hace /api/scan: en un par residual el
    // precio se mueve con cualquier operación pequeña y no representa nada.
    const best = [...pairs].sort(
      (a, b) => (b?.liquidity?.usd ?? 0) - (a?.liquidity?.usd ?? 0)
    )[0];
    const precio = Number(best?.priceUsd);
    return {
      ok: true,
      valor: {
        priceUsd: Number.isFinite(precio) && precio > 0 ? precio : null,
        priceChange24h: best?.priceChange?.h24 ?? null,
        liquidityUsd: best?.liquidity?.usd ?? null,
        volume24h: best?.volume?.h24 ?? null,
        marketCapUsd: best?.marketCap ?? best?.fdv ?? null,
      },
    };
  } catch (e) {
    return { ok: false, error: fallo(e) };
  }
}

async function supplyOnChain(): Promise<Intento<number>> {
  if (supplyCache && Date.now() - supplyCache.cuando < SUPPLY_TTL_MS) {
    return { ok: true, valor: supplyCache.valor };
  }
  const rpc = process.env.NEXT_PUBLIC_HELIUS_RPC;
  if (!rpc) return { ok: false, error: "falta NEXT_PUBLIC_HELIUS_RPC" };
  try {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "witx-supply",
        method: "getTokenSupply",
        params: [WITX_MINT],
      }),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    if (data?.error) return { ok: false, error: data.error?.message ?? "error RPC" };
    const supply = Number(data?.result?.value?.uiAmount);
    if (!Number.isFinite(supply)) return { ok: false, error: "supply no numérico" };
    supplyCache = { valor: supply, cuando: Date.now() };
    return { ok: true, valor: supply };
  } catch (e) {
    return { ok: false, error: fallo(e) };
  }
}

export async function getWitxMarket(): Promise<WitxMarket> {
  // En paralelo: son tres servicios que no dependen entre sí, y en serie la
  // página tardaría la suma de los tres en vez de lo que tarde el más lento.
  const [jup, dex, sup] = await Promise.all([
    precioJupiter(),
    datosDexScreener(),
    supplyOnChain(),
  ]);

  const sources: Record<string, string> = {
    jupiter: jup.ok ? "ok" : `error: ${jup.error}`,
    dexscreener: dex.ok ? "ok" : `error: ${dex.error}`,
    helius: sup.ok ? "ok" : `error: ${sup.error}`,
  };

  const datosDex = dex.ok ? dex.valor : null;
  // Jupiter manda; DexScreener solo entra si Jupiter no ha dado un precio.
  const priceUsd = jup.ok ? jup.valor : datosDex?.priceUsd ?? null;
  if (!jup.ok && datosDex?.priceUsd) sources.precio = "de DexScreener (Jupiter no respondió)";

  const supply = sup.ok ? sup.valor : null;

  return {
    priceUsd,
    priceChange24h: datosDex?.priceChange24h ?? null,
    liquidityUsd: datosDex?.liquidityUsd ?? null,
    volume24h: datosDex?.volume24h ?? null,
    marketCapUsd: datosDex?.marketCapUsd ?? null,
    supply,
    // Se calcula aquí en vez de fiarse del marketCap de DexScreener porque ese
    // usa el supply que DexScreener cree que hay; este usa el que hay de verdad.
    valorTotalUsd:
      priceUsd !== null && supply !== null ? priceUsd * supply : null,
    fetchedAt: new Date().toISOString(),
    sources,
  };
}
