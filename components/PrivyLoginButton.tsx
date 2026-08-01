"use client";

import { usePrivy } from "@privy-io/react-auth";

/**
 * Botón de login alternativo con Privy (email / Google). Convive con el
 * ConnectButton de Phantom sin reemplazarlo.
 *
 * - Mientras Privy no está listo: botón deshabilitado.
 * - Sin sesión: "Entrar con email" abre el modal de Privy.
 * - Con sesión: muestra el email del usuario + botón "Salir".
 *
 * Reusa las fuentes globales de la app (Geist / JetBrains Mono, heredadas del
 * body) para ser visualmente idéntico al resto de la UI. Paleta: acento
 * #23e7ff sobre fondo #0a0a0a, sin dorado.
 */
export function PrivyLoginButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return (
      <button
        type="button"
        disabled
        className="h-9 px-4 rounded-lg text-sm font-medium text-zinc-500 bg-[#0a0a0a] border border-[rgba(35,231,255,0.12)] cursor-not-allowed"
      >
        …
      </button>
    );
  }

  if (!authenticated) {
    return (
      <button
        type="button"
        onClick={() => login()}
        className="h-9 px-4 rounded-lg text-sm font-medium text-[#23e7ff] bg-[#0a0a0a] border border-[rgba(35,231,255,0.4)] transition-colors hover:bg-[rgba(35,231,255,0.08)] hover:border-[#23e7ff]"
      >
        Entrar con email
      </button>
    );
  }

  const email = user?.email?.address ?? user?.google?.email ?? "Conectado";

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden sm:inline-block max-w-[160px] truncate text-sm text-zinc-300"
        title={email}
      >
        {email}
      </span>
      <button
        type="button"
        onClick={() => logout()}
        className="h-9 px-4 rounded-lg text-sm font-medium text-zinc-400 bg-[#0a0a0a] border border-[rgba(35,231,255,0.12)] transition-colors hover:text-[#23e7ff] hover:border-[rgba(35,231,255,0.4)]"
      >
        Salir
      </button>
    </div>
  );
}
