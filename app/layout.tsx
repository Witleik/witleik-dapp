import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { PrivyProviderWrapper } from "@/components/PrivyProviderWrapper";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Witleik Capital — dApp",
  description: "Fondo de inversión híbrido. Transparencia radical en Solana.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Witleik",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#23e7ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://plugin.jup.ag/plugin-v1.js"
          strategy="beforeInteractive"
          data-preload
          defer
        />
      </head>
      <body className="min-h-full flex flex-col font-sans pb-20 md:pb-0">
        <PrivyProviderWrapper>
          <WalletContextProvider>
            <Header />
            {children}
            <BottomNav />
          </WalletContextProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}