import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Witleik Capital — dApp",
  description: "Fondo de inversión híbrido. Transparencia radical en Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://plugin.jup.ag/plugin-v1.js"
          strategy="beforeInteractive"
          data-preload
          defer
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
