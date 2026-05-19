"use client";

import { MessageCircle, Share2, Heart, Phone } from "lucide-react";

const channels = [
  {
    icon: MessageCircle,
    name: "Telegram",
    title: "Witleik Society",
    description: "Comunidad pública del ecosistema $WITX",
    cta: "Unirse al canal",
    href: "https://t.me/witleiksocietywitx",
  },
  {
    icon: Share2,
    name: "X / Twitter",
    title: "@witleikcapital",
    description: "Análisis, proof on-chain y resultados en vivo",
    cta: "Seguir en X",
    href: "https://x.com/witleikcapital",
  },
  {
    icon: Heart,
    name: "Instagram",
    title: "@witleik.capital",
    description: "Reels educativos y transparencia del fondo",
    cta: "Seguir en IG",
    href: "https://instagram.com/witleik.capital",
  },
  {
    icon: Phone,
    name: "WhatsApp",
    title: "Contacto directo",
    description: "Habla con el fundador del fondo",
    cta: "Abrir WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=14438641223",
  },
];

export default function ComunidadPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#23e7ff]/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#23e7ff] animate-pulse" />
            <span className="text-xs tracking-widest text-[#23e7ff]">COMUNIDAD WITLEIK</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-sans">
            Únete al <span className="text-[#23e7ff]">ecosistema</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Conecta con la comunidad de holders, recibe análisis en vivo y forma parte del crecimiento del fondo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#111] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-[#23e7ff]/50 hover:shadow-[0_0_30px_rgba(35,231,255,0.15)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#23e7ff]/10 border border-[#23e7ff]/20 flex items-center justify-center mb-4 group-hover:bg-[#23e7ff]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#23e7ff]" />
                </div>
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  {channel.name}
                </div>
                <h3 className="text-xl font-bold mb-2 font-sans">{channel.title}</h3>
                <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                  {channel.description}
                </p>
                <div className="inline-flex items-center text-sm text-[#23e7ff] group-hover:translate-x-1 transition-transform">
                  {channel.cta} →
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}