import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeInitializer } from "@/components/ThemeInitializer";

export const metadata: Metadata = {
  title: "Escolha Difícil — A ou B?",
  description:
    "O jogo de perguntas impossíveis. Escolha entre A ou B e veja o que todo mundo prefere!",
  openGraph: {
    title: "Escolha Difícil — A ou B?",
    description: "Responda perguntas difíceis e compare com outros usuários!",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <ThemeInitializer />
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
