"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/ConnectButton";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Mi Posición", path: "/posicion" },
    { name: "Herramientas", path: "/herramientas" },
    {
      name: "Aprender",
      children: [
        { name: "Academia", path: "/academia" },
        { name: "Whitepaper", path: "/whitepaper" },
      ],
    },
    { name: "Swap", path: "/swap" },
    {
      name: "Comunidad",
      children: [
        { name: "Comunidad", path: "/comunidad" },
        { name: "Afiliados", path: "/afiliados" },
      ],
    },
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
          {navItems.map((item, index) => {
            const children = item.children;
            const isActive = children
              ? children.some((child) => child.path === pathname)
              : pathname === item.path;

            return (
              <span key={item.name} className="flex items-center gap-4">
                {children ? (
                  <span className="relative group py-2 -my-2">
                    <button
                      type="button"
                      className={`text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                        isActive
                          ? "text-[#23e7ff]"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {item.name}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="transition-transform group-hover:rotate-180"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 top-full pt-2 flex flex-col min-w-[160px] z-50">
                      <span className="flex flex-col rounded-xl border border-[rgba(35,231,255,0.12)] bg-[#0a0a0b] shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden">
                        {children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                              pathname === child.path
                                ? "text-[#23e7ff] bg-[rgba(35,231,255,0.06)]"
                                : "text-zinc-400 hover:text-zinc-100 hover:bg-[rgba(35,231,255,0.06)]"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </span>
                    </span>
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#23e7ff]"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
                {index < navItems.length - 1 && (
                  <span className="text-zinc-500">·</span>
                )}
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}