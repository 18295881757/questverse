import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * QuestVerse - 游戏主页
 * 玩家入口与游戏状态展示
 */
export default function HomePage() {
  // 由于这是 Server Component，初始渲染时无 store
  // 状态展示留给客户端组件
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center text-center">
      <header className="mb-12">
        <h1 className="font-pixel text-5xl font-bold text-[var(--color-neon-magenta)] neon-glow md:text-7xl">
          QUEST<span className="text-[var(--color-neon-cyan)]">VERSE</span>
        </h1>
        <p className="mt-4 font-pixel text-xs text-[var(--color-text-secondary)]">
          一个关于彩蛋、记忆与未知邀请的解谜冒险
        </p>
      </header>

      <section className="mb-16 max-w-2xl">
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
          你收到一封匿名信函，
          <span className="text-[var(--color-neon-yellow)] neon-glow">
            &ldquo;如果你正在读这条消息，你应该已经在游戏中了。&rdquo;
          </span>
          <br />
          <br />
          在霓虹微光中寻找线索，通过层层谜题，寻找彩蛋。
        </p>
      </section>

      <nav className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/planets"
          className={cn(
            "rounded border-2 border-[var(--color-neon-cyan)] px-8 py-4",
            "font-pixel text-sm text-[var(--color-neon-cyan)]",
            "transition-all hover:bg-[var(--color-neon-cyan)] hover:text-[var(--color-deep-bg)]",
            "hover:shadow-[0_0_30px_var(--color-neon-cyan)]"
          )}
        >
          ▶ 进入游戏
        </Link>
        <Link
          href="/play/neon_arcade/neon_arcade_entry"
          className={cn(
            "rounded border-2 border-[var(--color-text-muted)] px-8 py-4",
            "font-pixel text-sm text-[var(--color-text-secondary)]",
            "transition-all hover:border-[var(--color-neon-cyan)] hover:text-[var(--color-neon-cyan)]"
          )}
        >
          ⚡ 继续街机厅
        </Link>
        <Link
          href="/archive"
          className={cn(
            "rounded border-2 border-[var(--color-neon-purple)] px-8 py-4",
            "font-pixel text-sm text-[var(--color-neon-purple)]",
            "transition-all hover:bg-[var(--color-neon-purple)] hover:text-[var(--color-deep-bg)]",
            "hover:shadow-[0_0_30px_var(--color-neon-purple)]"
          )}
        >
          📚 记忆档案
        </Link>
      </nav>

      <footer className="mt-16 text-center text-xs text-[var(--color-text-secondary)]">
        <p>向 1980–2000 年代的游戏文化致敬</p>
        <p className="mt-1">Inspired by Ready Player One</p>
      </footer>
    </div>
  );
}
