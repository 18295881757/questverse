import { ArchiveView } from "@/components/game/ArchiveView";

/**
 * 记忆档案 - 玩家查看自己的进度与彩蛋收藏
 */
export default function ArchivePage() {
  return (
    <div className="w-full pt-8">
      <header className="mb-8">
        <h1 className="font-pixel text-3xl text-[var(--color-neon-purple)] neon-glow">
          📚 记忆档案
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          那些被发现的、被记住的、无法被遗忘的瞬间
        </p>
      </header>

      <ArchiveView />
    </div>
  );
}
