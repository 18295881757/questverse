import Link from "next/link";

/**
 * 记忆档案 - 玩家查看自己的进度与彩蛋收藏
 * Phase 1 占位 - 完整实现会列出所有已发现的彩蛋、谜题进度
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

      <div className="rounded border border-[var(--color-neon-purple)]/30 bg-[var(--color-midnight)]/50 p-8 text-center">
        <p className="font-pixel text-xs text-[var(--color-text-muted)]">
          [记忆档案数据待接入 - 阶段二]
        </p>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          游玩后这里会显示你已发现的彩蛋、关键物品与剧情进度。
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-pixel text-[10px] text-[var(--color-neon-cyan)] hover:underline"
        >
          ← 返回主页
        </Link>
      </div>
    </div>
  );
}
