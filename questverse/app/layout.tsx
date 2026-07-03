import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { PixelLoader } from "@/components/game/PixelLoader";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "QuestVerse - 寻找彩蛋",
  description: "一款受《头号玩家》启发的浏览器寻宝解谜游戏",
  keywords: ["puzzle", "adventure", "pixel", "retro", "cyberpunk"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`h-full antialiased ${pressStart.variable}`}>
      <body className="min-h-full font-sans text-[var(--color-text-primary)]">
        <PixelLoader />
        <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
