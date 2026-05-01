"use client";

import { ConnectButton } from "@/components/ConnectButton";

export function Header() {
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

        <ConnectButton />
      </div>
    </header>
  );
}