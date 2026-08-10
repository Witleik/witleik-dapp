import { NextResponse } from "next/server";
import { getWitxMarket } from "@/lib/witx";

// El precio de $WITX es público: está en DexScreener y en cualquier explorador
// de Solana. Este endpoint no lo protege porque no habría nada que proteger, y
// así puede leerlo la propia web, el panel de administración y la oficina de
// agentes sin montar tres caminos distintos.
//
// Node y no edge: lib/witx llama a Helius por RPC y usa la caché en memoria del
// proceso para el supply.
export const runtime = "nodejs";

export async function GET() {
  const market = await getWitxMarket();

  // 503 si no hay precio por ningún lado. Devolver 200 con el precio a null
  // haría que quien lo consuma pintara un "0,00 $" perfectamente creíble y
  // completamente falso; es mejor que falle de forma ruidosa.
  if (market.priceUsd === null) {
    return NextResponse.json(
      {
        error: "No pude obtener el precio de $WITX de ninguna fuente.",
        sources: market.sources,
      },
      { status: 503 }
    );
  }

  return NextResponse.json(market, {
    // Para el navegador y para cualquier CDN delante: 30 s de frescura y hasta
    // 60 s más sirviendo lo viejo mientras se revalida por detrás, para que una
    // caída momentánea de Jupiter no deje la pantalla sin precio.
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
