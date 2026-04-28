"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [precio, setPrecio] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerPrecio() {
      try {
        const respuesta = await fetch(
          "https://lite-api.jup.ag/price/v3?ids=irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8"
        );
        const datos = await respuesta.json();
        const precioWitx = datos["irSRbc3iHPwYRkjPZgbg4MLW3oqPWNrxZbhBtja7jF8"].usdPrice;
        setPrecio(precioWitx);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener precio:", error);
        setCargando(false);
      }
    }

    obtenerPrecio();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-5xl font-bold text-cyan-400">
        WITLEIK CAPITAL
      </h1>
      <p className="text-xl text-zinc-400 mt-4 mb-12">
        Dashboard del fondo
      </p>

      <div className="bg-zinc-900 border border-cyan-400/30 rounded-2xl p-8 min-w-[300px]">
        <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">
          Precio $WITX
        </p>
        {cargando ? (
          <p className="text-3xl text-zinc-400">Cargando...</p>
        ) : precio !== null ? (
          <p className="text-4xl font-bold text-cyan-400">
            ${precio.toFixed(6)}
          </p>
        ) : (
          <p className="text-xl text-red-400">Error al cargar</p>
        )}
      </div>
    </div>
  );
}