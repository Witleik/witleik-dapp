import Link from "next/link";

/* Para añadir una herramienta: agrega una entrada aquí. El grid escala solo. */
const tools = [
  {
    title: "Calculadora de Covered Calls",
    description:
      "Estima la prima, el breakeven y el rendimiento anualizado de una call cubierta.",
    href: "/herramientas/covered-calls",
  },
  {
    title: "WITX Scanner",
    description:
      "Analiza cualquier token de Solana: liquidez, volumen, presión de venta y veredicto de mercado.",
    href: "/herramientas/scanner",
  },
  {
    title: "Calculadora de Posición",
    description:
      "Cuánto capital asignar a una acción según tu margen de seguridad, convicción y un tope de concentración.",
    href: "/herramientas/posicion",
  },
];

export default function HerramientasPage() {
  return (
    <div className="px-6 pb-24 pt-8">
      <div className="mx-auto max-w-5xl">
        {/* cabecera */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(35,231,255,0.2)] bg-[rgba(35,231,255,0.05)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#23e7ff]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#23e7ff]">
              Herramientas
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Herramientas <span style={{ color: "#23e7ff" }}>Witleik</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400">
            Calculadoras y utilidades para tomar mejores decisiones. Gratis y
            sin conexión de wallet.
          </p>
        </div>

        {/* rejilla de tarjetas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col rounded-2xl border border-[rgba(35,231,255,0.12)] bg-[#0d0d11] p-6 transition-all hover:-translate-y-0.5 hover:border-[#23e7ff] hover:bg-[#131318] hover:shadow-[0_0_24px_rgba(35,231,255,0.12)]"
            >
              <h2 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[#23e7ff]">
                {tool.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                {tool.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#23e7ff]">
                Abrir
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
