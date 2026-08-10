import { ToolBackLink } from "@/components/ToolBackLink";
import { PositionSizer } from "@/components/PositionSizer";

export default function PosicionPage() {
  return (
    <div className="px-6 pb-24 pt-8">
      <div className="mx-auto max-w-3xl">
        <ToolBackLink />

        {/* cabecera */}
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(35,231,255,0.2)] bg-[rgba(35,231,255,0.05)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#23e7ff]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#23e7ff]">
              Herramientas · Value
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Calculadora de <span style={{ color: "#23e7ff" }}>Posición</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400">
            Cuánto capital asignar a una acción según tu margen de seguridad y tu
            convicción, con un tope de concentración que protege el fondo.
          </p>
        </div>

        <PositionSizer />
      </div>
    </div>
  );
}
