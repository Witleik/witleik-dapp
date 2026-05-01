"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const xUrl = "https://x.com/witleikcapital";
  const instagramUrl = "https://instagram.com/witleik.capital";
  const telegramUrl = "https://t.me/witleiksociety";
  const webUrl = "https://witleikcapital.com";
  const whatsappUrl = "https://api.whatsapp.com/send/?phone=14438641223";

  return (
    <footer className="mt-auto border-t border-[rgba(35,231,255,0.12)] bg-black/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#23e7ff] animate-pulse-dot" />
              <span className="text-base font-bold text-white tracking-wide">
                WITLEIK<span className="text-[#23e7ff]">.</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Tu puerta de entrada al ecosistema $WITX. Swap directo en Solana.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-4">
              Comunidad
            </h4>
            <div className="flex flex-col gap-2">
              <a href={xUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-300 hover:text-[#23e7ff] transition-colors w-fit">X / Twitter</a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-300 hover:text-[#23e7ff] transition-colors w-fit">Instagram</a>
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-300 hover:text-[#23e7ff] transition-colors w-fit">Telegram</a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-4">
              Recursos
            </h4>
            <div className="flex flex-col gap-2">
              <a href={webUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-300 hover:text-[#23e7ff] transition-colors w-fit">Web oficial</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-300 hover:text-[#23e7ff] transition-colors w-fit">Contacto WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[rgba(35,231,255,0.08)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            {currentYear} Witleik Capital - Construido en Solana
          </p>
          <p className="text-xs text-zinc-600">
            Powered by <span className="text-[#23e7ff] font-semibold">$WITX</span>
          </p>
        </div>
      </div>
    </footer>
  );
}