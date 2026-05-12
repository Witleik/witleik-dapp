"use client";

import { MyPosition } from "@/components/MyPosition";

export default function PosicionPage() {
  return (
    <div className="pt-8 px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Mi Posición</h1>
        <p className="text-zinc-400 mb-8">Tu balance y tier en el ecosistema Witleik</p>
        <MyPosition />
      </div>
    </div>
  );
}