"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

interface LeccionLayoutProps {
  numero: string;
  titulo: string;
  duracion: string;
  nivel: string;
  necesitas: string;
  children: ReactNode;
  siguiente?: { slug: string; titulo: string };
  anterior?: { slug: string; titulo: string };
}

export function LeccionLayout({
  numero,
  titulo,
  duracion,
  nivel,
  necesitas,
  children,
  siguiente,
  anterior,
}: LeccionLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <article className="max-w-3xl mx-auto w-full px-6 pt-16 pb-12">
        <Link
          href="/academia"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-[#23e7ff] uppercase tracking-wider mb-8 transition-colors"
        >
          ← Volver a la academia
        </Link>

        <div className="mb-10 pb-8 border-b border-zinc-900">
          <p
            className="text-xs text-[#23e7ff] font-semibold mb-3"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            Lección {numero}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            {titulo}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 uppercase tracking-wider">
            <span>⏱ {duracion}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>📊 {nivel}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>🎯 {necesitas}</span>
          </div>
        </div>

        <div className="leccion-content">
          {children}
        </div>

        {/* Navegación */}
        <div className="mt-16 pt-8 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-4">
          {anterior ? (
            <Link
              href={`/academia/${anterior.slug}`}
              className="group bg-[#131318] border border-zinc-800 hover:border-[rgba(35,231,255,0.4)] rounded-xl p-5 transition-all"
            >
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
                ← Lección anterior
              </p>
              <p className="text-sm text-white group-hover:text-[#23e7ff] font-semibold">
                {anterior.titulo}
              </p>
            </Link>
          ) : <div />}

          {siguiente ? (
            <Link
              href={`/academia/${siguiente.slug}`}
              className="group bg-[#131318] border border-zinc-800 hover:border-[rgba(35,231,255,0.4)] rounded-xl p-5 transition-all text-right"
            >
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
                Siguiente lección →
              </p>
              <p className="text-sm text-white group-hover:text-[#23e7ff] font-semibold">
                {siguiente.titulo}
              </p>
            </Link>
          ) : <div />}
        </div>
      </article>

      <Footer />
    </div>
  );
}
