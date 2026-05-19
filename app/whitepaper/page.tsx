"use client";

import { Download, FileText } from "lucide-react";

const sections = [
  {
    id: "1",
    title: "1. Introducción",
    content: `Witleik xToken ($WITX) es el activo digital oficial de Witleik Capital, un fondo de inversión híbrido, ético y transparente que combina estrategias DeFi avanzadas, inversión en bolsa tradicional y construcción de comunidad hispana internacional.

A diferencia de los tokens especulativos sin respaldo, $WITX está diseñado para reflejar la evolución real de un fondo en constante crecimiento. Su valor se sostiene en liquidez real, reinversión de beneficios y recompras periódicas financiadas por las ganancias del fondo.

$WITX no es una promesa de rendimiento. Es participación en el crecimiento real de Witleik Capital.`,
  },
  {
    id: "2",
    title: "2. Visión del Proyecto",
    content: `Witleik busca construir el fondo de inversión más transparente y descentralizado del mundo hispano.

Nuestra visión es demostrar que la inversión puede ser:

• Rentable — estrategias DeFi probadas y selección rigurosa en bolsa
• Transparente — todas las wallets y operaciones son públicas y verificables on-chain
• Comunitaria — la Witleik Society reúne a miembros que invierten, aprenden y crecen juntos`,
  },
  {
    id: "3",
    title: "3. Filosofía de Inversión",
    content: `$WITX se sustenta en tres pilares operativos del fondo:

DeFi Inteligente — Estrategia principal de carry trade en Solana. Colateral SOL en Kamino Finance, borrow USDC, despliegue en protocolos de yield estable (OnRe, Huma, SyrupUSDC) y posiciones de liquidez concentrada en Orca.

Bolsa Tradicional — Selección de acciones mediante sistema propio WIVS Score y generación de cashflow vía covered calls mensuales.

Reinversión Constante — Las ganancias del fondo se destinan a recompras periódicas de $WITX y refuerzo de la liquidez del pool.`,
  },
  {
    id: "4",
    title: "4. Tokenómica",
    content: `Nombre: Witleik xToken
Símbolo: $WITX
Red: Solana (SPL Token)
Decimales: 4
Supply inicial: 1,000,000
Supply máximo potencial: 100,000,000 (emisión controlada)
Contrato: irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8

Política de emisión: Cualquier emisión adicional se anuncia públicamente con cantidad y razón antes de ejecutarse — análogo a una ampliación de capital en mercados tradicionales. Cero emisiones ocultas.`,
  },
  {
    id: "5",
    title: "5. Liquidez y Trading",
    content: `Estado actual (mayo 2026):

• Precio: $0.0247
• Market cap: ~$24,000
• Liquidez en pool: ~$7,800
• Holders: 28
• Volumen diario: variable según actividad del mercado

Pares activos:

• Orca: WITX/SOL (par principal)
• Jupiter: swap directo agregado
• Raydium: liquidez secundaria

Seguimiento público:

• Dexscreener — métricas en tiempo real
• GeckoTerminal — datos de mercado verificados
• Solscan — auditoría on-chain de todas las wallets

Objetivo de liquidez Q3 2026: consolidar pool único en Orca con TVL mínimo de $15,000 y slippage inferior al 1% en operaciones de hasta $1,000.`,
  },
  {
    id: "6",
    title: "6. Utilidad del Token",
    content: `$WITX no es solo un activo especulativo. Representa participación activa en el ecosistema Witleik:

Acceso a Witleik Society — Comunidad privada de holders. Acceso requiere mínimo 100 $WITX en wallet. Dentro: reportes mensuales del fondo, decisiones operativas en tiempo real, llamadas mensuales con el fundador.

Recompras del fondo — Las ganancias reales de las estrategias DeFi y bolsa financian recompras periódicas de $WITX, fortaleciendo precio y liquidez.

Rol de Gestor Local — Holders con mínimo 1,000 $WITX pueden aplicar al programa de Gestores Locales con comisiones reales por operación y captación.

Futuro: staking y gobernanza — Cuando el fondo alcance masa crítica de holders activos, se activará staking con yield real del fondo y gobernanza vía Snapshot.`,
  },
  {
    id: "7",
    title: "7. Programas de Comunidad",
    content: `Gestores Locales — Red de representantes en LATAM y España. Comisiones por operación y nuevo inversor captado. Requisito: 1,000 $WITX como depósito de compromiso. Mercados prioritarios: Colombia, España, México, El Salvador.

Contenido de la Society — Reportes mensuales del estado del fondo, posiciones activas, decisiones tomadas y análisis post-mortem de operaciones cerradas.`,
  },
  {
    id: "8",
    title: "8. Comunidad y Canales Oficiales",
    content: `Canales activos:

• Telegram público — Witleik Society
• X / Twitter — análisis y proof on-chain diario
• Instagram (@witleik.capital) — contenido educativo y reels
• Website oficial — witleikcapital.com
• dApp — datos en vivo del ecosistema

Objetivos próximos 6 meses:

• 100+ holders activos
• $50,000+ en capital gestionado
• $15,000 en liquidez de pool
• Red activa de gestores en 3 países`,
  },
  {
    id: "9",
    title: "9. Roadmap",
    content: `Corto plazo (0–6 meses)

• Aprobación en Jupiter Strict List
• Lanzamiento completo de dApp Witleik con sección Mi Posición gated por holdings
• Primera tanda de Miembros Fundadores de Witleik Society (10 perfiles)
• Consolidación de liquidez a pool único optimizado
• Mínimo 50 holders activos

Medio plazo (6–18 meses)

• Implementación de staking de $WITX con yield real del fondo
• Activación de Snapshot para gobernanza descentralizada
• Establecimiento de sede operativa en El Salvador
• Superar $80,000 en capital bajo gestión
• Red de gestores activa en LATAM y España

Largo plazo (18+ meses)

• Superar $250,000 en activos bajo gestión
• Gobernanza tokenizada completa
• Expansión a producto de adquisición de negocios físicos con cashflow
• Posicionamiento como referente hispano número 1 en inversión descentralizada transparente`,
  },
];

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#23e7ff]/30 mb-6">
            <FileText className="w-4 h-4 text-[#23e7ff]" />
            <span className="text-xs tracking-widest text-[#23e7ff]">DOCUMENTO OFICIAL</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Whitepaper <span className="text-[#23e7ff]">$WITX</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
            Documento técnico oficial del token Witleik xToken y el ecosistema Witleik Capital. Versión Mayo 2026.
          </p>

          {/* DOWNLOAD BUTTON */}
          <a
            href="/Witleik_Whitepaper_WITX_Mayo2026.docx"
            download
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#23e7ff] text-[#0b0b0b] font-bold rounded-xl hover:bg-[#23e7ff]/90 transition-all hover:shadow-[0_0_30px_rgba(35,231,255,0.4)]"
          >
            <Download className="w-5 h-5" />
            Descargar Whitepaper (.docx)
          </a>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-12">
          <h2 className="text-sm tracking-widest text-gray-500 mb-4">ÍNDICE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#section-${s.id}`}
                className="text-gray-300 hover:text-[#23e7ff] transition py-1"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* SECCIONES */}
        {sections.map((s) => (
          <section key={s.id} id={`section-${s.id}`} className="mb-12 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#23e7ff]">{s.title}</h2>
            <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">
              {s.content}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
