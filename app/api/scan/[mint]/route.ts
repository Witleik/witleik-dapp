import { NextRequest, NextResponse } from 'next/server';

// Validación de mint address de Solana (base58)
const MINT_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

interface DexScreenerPair {
  dexId?: string;
  priceUsd?: string;
  liquidity?: { usd?: number };
  marketCap?: number;
  fdv?: number;
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  txns?: { h24?: { buys?: number; sells?: number } };
  baseToken?: { name?: string; symbol?: string };
}

interface DexScreenerResponse {
  pairs?: DexScreenerPair[] | null;
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/scan/[mint]'>
) {
  const { mint } = await ctx.params;

  // 1. Validar formato base58 de Solana
  if (!MINT_REGEX.test(mint)) {
    return NextResponse.json(
      { error: 'La dirección de mint no es una address de Solana válida (base58).' },
      { status: 400 }
    );
  }

  // 2. Consultar DexScreener desde el servidor (evita CSP/CORS del cliente)
  let res: Response;
  try {
    res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
      { next: { revalidate: 30 } } // cache de 30s para evitar rate-limit
    );
  } catch {
    return NextResponse.json(
      { error: 'Error de red al conectar con DexScreener. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: 'DexScreener no respondió correctamente. Inténtalo más tarde.' },
      { status: 502 }
    );
  }

  let data: DexScreenerResponse;
  try {
    data = await res.json();
  } catch {
    return NextResponse.json(
      { error: 'DexScreener devolvió una respuesta no válida.' },
      { status: 502 }
    );
  }

  const pairs = data.pairs;

  // 3. Sin pares = token no encontrado o sin liquidez
  if (!pairs || pairs.length === 0) {
    return NextResponse.json(
      { error: 'No se encontraron pares de trading para esta mint. Puede que el token no exista o no tenga liquidez.' },
      { status: 404 }
    );
  }

  // 4. Elegir el par con MÁS liquidez
  const best = [...pairs].sort(
    (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
  )[0];

  // 5. Respuesta limpia
  return NextResponse.json({
    name: best.baseToken?.name ?? null,
    symbol: best.baseToken?.symbol ?? null,
    dexId: best.dexId ?? null,
    priceUsd: best.priceUsd ? Number(best.priceUsd) : null,
    liquidity: best.liquidity?.usd ?? null,
    marketCap: best.marketCap ?? best.fdv ?? null,
    volume24h: best.volume?.h24 ?? null,
    priceChange24h: best.priceChange?.h24 ?? null,
    buys24h: best.txns?.h24?.buys ?? null,
    sells24h: best.txns?.h24?.sells ?? null,
  });
}
