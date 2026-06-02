import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "Diário Online",
  description:
    "Seu diário pessoal, simples e privado. Escreva sobre o seu dia, registre seu humor e guarde suas memórias — tudo salvo só no seu navegador.",
  applicationName: "Diário Online",
  openGraph: {
    title: "Diário Online",
    description: "Seu diário pessoal e privado. Tudo fica só no seu navegador.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
