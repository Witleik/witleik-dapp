"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useWitxBalance } from "@/hooks/useWitxBalance";
import { GATE_THRESHOLD } from "@/lib/constants";

interface Leccion {
  slug: string;
  numero: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  nivel: string;
  bloqueada: boolean;
}

const LECCIONES: Leccion[] = [
  {
    slug: "fiat-a-solana",
    numero: "01",
    titulo: "De tu banco a Solana",
    descripcion: "Cómo convertir dinero de tu banco en SOL usando Coinbase, paso a paso.",
    duracion: "10 min",
    nivel: "Principiante",
    bloqueada: false,
  },
  {
    slug: "phantom",
    numero: "02",
    titulo: "Instalar Phantom y mover tu SOL",
    descripcion: "Crea tu propia wallet en Solana y aprende a custodiar tu dinero de forma segura.",
    duracion: "15 min",
    nivel: "Principiante",
    bloqueada: false,
  },
  {
    slug: "invertir-en-witleik",
    numero: "03",
    titulo: "Cómo invertir en Witleik",
    descripcion: "Compra $WITX en Jupiter y conviértete en parte del fondo Witleik.",
    duracion: "10 min",
    nivel: "Principiante",
    bloqueada: false,
  },
  {
    slug: "carry-trade",
    numero: "04",
    titulo: "Carry trade desde cero",
    descripcion: "Cómo replicar la estrategia central del fondo en Kamino paso a paso.",
    duracion: "20 min",
    nivel: "Intermedio",
    bloqueada: true,
  },
  {
    slug: "seguridad-avanzada",
    numero: "05",
    titulo: "Seguridad avanzada en cripto",
    descripcion: "Hardware wallets, separación por uso, scams reales que han visto los miembros.",
    duracion: "15 min",
    nivel: "Intermedio",
    bloqueada: true,
  },
  {
    slug: "estrategias-defi",
    numero: "06",
    titulo: "Estrategias DeFi para ganar dinero",
    descripcion: "Lending, apalancamiento, loops, liquidity pools y carry trade. Las 5 plays que mueven el dinero en Solana.",
    duracion: "25 min",
    nivel: "Intermedio/Avanzado",
    bloqueada: true,
  },
];

export default function Academia() {
  const { balance } = useWitxBalance();
  const tieneAcceso = balance !== null && balance >= GATE_THRESHOLD;

  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-32 w-[800px] h-[800px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(35,231,255,0.18) 0%, rgba(35,231,255,0.04) 30%, transparent 60%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(35,231,255,0.25)] bg-[rgba(35,231,255,0.05)] mb-8 animate-fade-in-up">
            <div className="w-1.5 h-1.5 rounded-full bg-[#23e7ff] animate-pulse-dot" />
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-300 font-medium">
              Academia Witleik
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-white">Aprende a invertir.</span>
            <br />
            <span className="text-[#23e7ff]">Desde cero.</span>
          </h1>

          <p
            className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Lecciones claras, directas y sin paja. Las 3 primeras son gratis.
            <br className="hidden md:block" />
            <span className="text-zinc-500">
              El contenido avanzado se desbloquea con 1,000 $WITX.
            </span>
          </p>
        </div>
      </section>

      {/* LISTA DE LECCIONES */}
      <section className="max-w-5xl mx-auto w-full px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LECCIONES.map((leccion) => (
            <LeccionCard key={leccion.slug} leccion={leccion} tieneAcceso={tieneAcceso} />
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-[rgba(35,231,255,0.05)] to-[rgba(35,231,255,0.01)] border border-[rgba(35,231,255,0.2)] rounded-2xl p-8 text-center">
          <p className="text-xs text-[#23e7ff] uppercase tracking-[0.2em] font-semibold mb-3">
            Acceso Premium
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            ¿Quieres desbloquear las lecciones avanzadas?
          </h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-xl mx-auto">
            Con 1,000 $WITX o más en tu wallet accedes a contenido exclusivo: carry trade real, seguridad avanzada y behind the scenes del fondo.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-[#23e7ff] text-black font-semibold text-sm hover:bg-[#1ad4ec] transition-all"
          >
            Comprar $WITX
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function LeccionCard({ leccion, tieneAcceso }: { leccion: Leccion; tieneAcceso: boolean }) {
  // Solo se ve "apagada" si es premium Y el usuario aún no tiene acceso.
  // Un holder con los tokens suficientes ve las premium tan vivas como las gratis.
  const apagada = leccion.bloqueada && !tieneAcceso;

  const contenido = (
    <div
      className={`group relative h-full bg-gradient-to-br from-[#131318] to-[#0a0a0b] border rounded-2xl p-6 transition-all duration-300 overflow-hidden ${
        apagada
          ? "border-zinc-800 opacity-70"
          : "border-[rgba(35,231,255,0.12)] hover:border-[rgba(35,231,255,0.4)]"
      }`}
    >
      {!apagada && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#23e7ff] opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity" />
      )}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p
            className={`text-xs font-semibold ${
              apagada ? "text-zinc-600" : "text-[#23e7ff]"
            }`}
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {leccion.numero}
          </p>
          {!leccion.bloqueada ? (
            <span className="text-[10px] uppercase tracking-wider text-[#00ff88] px-2 py-1 rounded border border-[rgba(0,255,136,0.2)]">
              Gratis
            </span>
          ) : tieneAcceso ? (
            <span className="text-[10px] uppercase tracking-wider text-[#23e7ff] px-2 py-1 rounded border border-[rgba(35,231,255,0.3)] flex items-center gap-1">
              ✓ Desbloqueada
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 px-2 py-1 rounded border border-zinc-800 flex items-center gap-1">
              🔒 1,000 $WITX
            </span>
          )}
        </div>

        <h3 className={`text-lg font-bold mb-2 ${apagada ? "text-zinc-400" : "text-white"}`}>
          {leccion.titulo}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed mb-5">
          {leccion.descripcion}
        </p>

        <div className="flex items-center gap-3 text-[10px] text-zinc-500 uppercase tracking-wider">
          <span>{leccion.duracion}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span>{leccion.nivel}</span>
        </div>
      </div>
    </div>
  );

  return <Link href={`/academia/${leccion.slug}`}>{contenido}</Link>;
}
