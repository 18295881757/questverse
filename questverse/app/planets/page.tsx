import Link from "next/link";
import { PlanetSelect } from "@/components/game/PlanetSelect";

export const metadata = {
  title: "星球选择 - QuestVerse",
};

export default function PlanetsPage() {
  return (
    <div className="w-full pt-8">
      <header className="mb-8">
        <p className="font-pixel text-[10px] text-[var(--color-text-muted)]">
          QUESTVERSE MAP
        </p>
        <h1 className="mt-3 font-pixel text-3xl text-[var(--color-neon-cyan)] neon-glow">
          星球选择
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
          每颗星球都是一段被封存的文化记忆。完成前一颗星球的钥匙碎片后，下一扇门才会亮起。
        </p>
      </header>

      <PlanetSelect />

      <Link
        href="/"
        className="mt-8 inline-block font-pixel text-[10px] text-[var(--color-neon-cyan)] hover:underline"
      >
        ← 返回主页
      </Link>
    </div>
  );
}
