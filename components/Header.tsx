"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/ConnectButton";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Mi Posición", path: "/posicion" },
    { name: "Afiliados", path: "/afiliados" },
    { name: "Swap", path: "/swap" },
    { name: "Whitepaper", path: "/whitepaper" },
    { name: "Comunidad", path: "/comunidad" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/60 border-b border-[rgba(35,231,255,0.12)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#23e7ff] animate-pulse-dot" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#23e7ff] blur-md" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-medium">
              dApp
            </span>
            <span className="text-base font-bold text-white tracking-wide">
              WITLEIK<span className="text-[#23e7ff]">.</span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item, index) => (
            <span key={item.path} className="flex items-center gap-4">
              <Link
                href={item.path}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? "text-[#23e7ff]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {item.name}
              </Link>
              {index < navItems.length - 1 && (
                <span className="text-zinc-500">·</span>
              )}
            </span>
          ))}
        </nav>

        <ConnectButton />
      </div>
    </header>
  );
}