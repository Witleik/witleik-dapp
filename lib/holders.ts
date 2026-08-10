// Quién tiene $WITX y cuánto, leído de la cadena.
//
// DE DÓNDE SALE ESTO
// No hay ninguna tabla de inversores en la base de datos, y no se ha inventado
// una: la verdad de quién tiene tokens está en Solana, no en un Excel. Aquí se
// leen las cuentas de token del mint y se agrupan por propietario.
//
// LO QUE ESTO NO PUEDE DECIR
// La cadena da direcciones de wallet, no nombres. "Cuánto tiene cada inversor"
// se responde por wallet; para poner nombres haría falta una tabla que asocie
// wallet → persona, y eso es un dato que hay que meter a mano y decidir aparte.
// Tampoco distingue a un inversor de una wallet del propio fondo o de un pool
// de liquidez: por eso se marcan aparte las conocidas (ver ETIQUETAS).
import { WITX_MINT, FUND_WALLET } from "./constants";

export type Holder = {
  wallet: string;
  amount: number;
  /** Porcentaje sobre el supply en circulación leído, en % (12.5 = 12,5 %). */
  share: number;
  valueUsd: number | null;
  /** 'fondo' | 'liquidez' | null. Null es un inversor normal. */
  etiqueta: string | null;
};

export type Holders = {
  holders: Holder[];
  total: number;
  totalTokens: number;
  totalUsd: number | null;
  truncado: boolean;
  fetchedAt: string;
};

// Wallets que NO son inversores aunque aparezcan como poseedores. Se marcan en
// vez de esconderse: quitarlas de la lista sin decir nada haría que los
// porcentajes no cuadraran con la cadena y nadie sabría por qué.
const ETIQUETAS: Record<string, string> = {
  [FUND_WALLET]: "fondo",
};

// Helius pagina de 1000 en 1000. El tope de páginas evita que un token con
// cientos de miles de cuentas cuelgue la petición para siempre; si se alcanza,
// se devuelve `truncado: true` y quien lo pinte tiene que decirlo.
const POR_PAGINA = 1000;
const MAX_PAGINAS = 20;

type CuentaHelius = { owner?: string; amount?: number };

/**
 * Decimales del mint. Hay que pedirlos aparte porque getTokenAccounts NO los
 * devuelve: cada cuenta trae `amount` en unidades base y nada más. Comprobado
 * contra la cadena: $WITX tiene 4 decimales y un saldo de 16970 unidades base
 * son 1,697 tokens. Dar por hecho cero decimales multiplicaba cada saldo por
 * diez mil, y la tabla habría enseñado fortunas inventadas.
 */
async function decimalesDelMint(rpc: string): Promise<number> {
  const res = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "witx-decimals",
      method: "getTokenSupply",
      params: [WITX_MINT],
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Helius respondió HTTP ${res.status} al pedir el supply`);
  const data = await res.json();
  if (data?.error) throw new Error(`Helius: ${data.error?.message ?? "error al pedir el supply"}`);
  const dec = data?.result?.value?.decimals;
  if (!Number.isInteger(dec)) throw new Error("No pude leer los decimales del mint");
  return dec as number;
}

/**
 * Lee todos los poseedores del mint. Usa getTokenAccounts, que es un método
 * propio de Helius (DAS): el getProgramAccounts estándar tendría que traerse
 * todas las cuentas del programa de tokens y filtrarlas a mano, que es mucho
 * más caro y muchos RPC públicos directamente lo prohíben.
 */
export async function getHolders(precioUsd: number | null): Promise<Holders> {
  const rpc = process.env.NEXT_PUBLIC_HELIUS_RPC;
  if (!rpc) throw new Error("Falta NEXT_PUBLIC_HELIUS_RPC");

  const decimales = await decimalesDelMint(rpc);
  const divisor = Math.pow(10, decimales);

  const porWallet = new Map<string, number>();
  let pagina = 1;
  let truncado = false;

  for (;;) {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "witx-holders",
        method: "getTokenAccounts",
        params: {
          mint: WITX_MINT,
          page: pagina,
          limit: POR_PAGINA,
          options: { showZeroBalance: false },
        },
      }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Helius respondió HTTP ${res.status}`);
    const data = await res.json();
    if (data?.error) {
      throw new Error(
        `Helius: ${data.error?.message ?? "error desconocido"}. ` +
          "getTokenAccounts es un método de Helius; si el RPC configurado no es de Helius, no existe."
      );
    }

    const cuentas: CuentaHelius[] = data?.result?.token_accounts ?? [];
    if (cuentas.length === 0) break;

    for (const c of cuentas) {
      if (!c.owner) continue;
      const cantidad = Number(c.amount ?? 0) / divisor;
      if (!Number.isFinite(cantidad) || cantidad <= 0) continue;
      // Una misma persona puede tener varias cuentas de token del mismo mint;
      // sumarlas es lo que convierte "cuentas" en "inversores".
      porWallet.set(c.owner, (porWallet.get(c.owner) ?? 0) + cantidad);
    }

    if (cuentas.length < POR_PAGINA) break;
    pagina++;
    if (pagina > MAX_PAGINAS) {
      truncado = true;
      break;
    }
  }

  const totalTokens = [...porWallet.values()].reduce((s, n) => s + n, 0);

  const holders: Holder[] = [...porWallet.entries()]
    .map(([wallet, amount]) => ({
      wallet,
      amount,
      share: totalTokens > 0 ? (amount / totalTokens) * 100 : 0,
      valueUsd: precioUsd !== null ? amount * precioUsd : null,
      etiqueta: ETIQUETAS[wallet] ?? null,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    holders,
    total: holders.length,
    totalTokens,
    totalUsd: precioUsd !== null ? totalTokens * precioUsd : null,
    truncado,
    fetchedAt: new Date().toISOString(),
  };
}
