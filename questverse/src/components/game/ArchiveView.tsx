"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getItem } from "@/lib/content";
import { useGameStore } from "@/lib/game-engine/index";
import { cn } from "@/lib/utils/cn";
import type { Item } from "@/types/scene";

const knownEasterEggs: Record<string, { title: string; detail: string }> = {
  pong_1972: {
    title: "Pong 1972",
    detail: "电子游戏商业化的第一声回响。",
  },
  ms_pac_man: {
    title: "Ms. Pac-Man 1982",
    detail: "街机黄金年代里最明亮的追逐。",
  },
  robinett_1979: {
    title: "Warren Robinett",
    detail: "第一个被玩家追寻到的作者签名。",
  },
  atari_2600_console: {
    title: "Atari 2600",
    detail: "把客厅变成游戏宇宙入口的木纹盒子。",
  },
  unknown_pleasures_1979: {
    title: "Unknown Pleasures",
    detail: "黑底白线的波形，像一扇通往噪声的门。",
  },
  kraftwerk_1978: {
    title: "Kraftwerk",
    detail: "机器、节拍与秩序感。",
  },
  reversed_tape_signal: {
    title: "Reversed Tape Signal",
    detail: "恐惧背后藏着第二段讯号。",
  },
  vhs_tracking_noise: {
    title: "VHS Tracking Noise",
    detail: "旧录像带的雪花点，把缺失影像藏在时间码里。",
  },
  atari_1977: {
    title: "Atari 2600 / 1977",
    detail: "家用游戏机把游乐场的一角带进客厅。",
  },
  blinky_pacman: {
    title: "Blinky",
    detail: "红色追逐者的倒影提醒玩家：经典角色也能藏在街边积水里。",
  },
  donkey_kong_1981: {
    title: "Donkey Kong 1981",
    detail: "脚手架、木桶和跳跃，构成早期平台游戏的舞台。",
  },
  galaga_1981: {
    title: "Galaga 1981",
    detail: "外星编队与街机厅里的霓虹蜂群。",
  },
  superman_1938: {
    title: "Action Comics #1",
    detail: "超级英雄流行文化的起点之一。",
  },
  tetris_1984: {
    title: "Tetris 1984",
    detail: "下落的方块把秩序和焦虑压进同一个网格。",
  },
};

function hasStoreHydrated() {
  return useGameStore.persist?.hasHydrated?.() ?? false;
}

function isItem(item: Item | undefined): item is Item {
  return Boolean(item);
}

export function ArchiveView() {
  const progress = useGameStore((s) => s.progress);
  const [hasHydrated, setHasHydrated] = useState(false);
  const keyItems = progress.inventory
    .map((itemId) => getItem(itemId))
    .filter(isItem)
    .filter((item) => item.isKeyFragment);
  const notes = progress.inventory
    .map((itemId) => getItem(itemId))
    .filter(isItem)
    .filter((item) => !item.isKeyFragment);

  useEffect(() => {
    setHasHydrated(hasStoreHydrated());
    return useGameStore.persist?.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, []);

  if (!hasHydrated) {
    return (
      <div className="rounded border border-[var(--color-neon-purple)]/30 bg-[var(--color-midnight)]/50 p-8 text-center">
        <p className="font-pixel text-xs text-[var(--color-text-muted)]">
          SYNCING ARCHIVE...
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <section className="rounded border border-[var(--color-neon-cyan)]/30 bg-[var(--color-midnight)]/50 p-5">
        <p className="font-pixel text-[9px] text-[var(--color-text-muted)]">
          QUEST STATUS
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="STORY" value={`${progress.storyProgress}%`} />
          <Stat label="KEYS" value={`${keyItems.length}/3`} />
          <Stat label="EGGS" value={`${progress.foundEasterEggs.length}`} />
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded bg-[var(--color-shadow)]">
          <div
            className="h-full bg-[var(--color-neon-cyan)] shadow-[0_0_16px_var(--color-neon-cyan)]"
            style={{ width: `${Math.min(100, progress.storyProgress)}%` }}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          当前位置：{progress.currentPlanetId} / {progress.currentSceneId}
        </p>
      </section>

      <section className="rounded border border-[var(--color-neon-yellow)]/30 bg-[var(--color-midnight)]/50 p-5">
        <p className="font-pixel text-[9px] text-[var(--color-text-muted)]">
          KEY FRAGMENTS
        </p>
        <div className="mt-4 space-y-3">
          {keyItems.length > 0 ? (
            keyItems.map((item) => (
              <InventoryRow
                key={item.id}
                icon={item.icon}
                title={item.name}
                detail={item.description}
              />
            ))
          ) : (
            <EmptyText>还没有钥匙碎片。第一台 Adventure 街机仍在等待。</EmptyText>
          )}
        </div>
      </section>

      <section className="rounded border border-[var(--color-neon-purple)]/30 bg-[var(--color-midnight)]/50 p-5">
        <p className="font-pixel text-[9px] text-[var(--color-text-muted)]">
          FIELD NOTES
        </p>
        <div className="mt-4 space-y-3">
          {notes.length > 0 ? (
            notes.map((item) => (
              <InventoryRow
                key={item.id}
                icon={item.icon}
                title={item.name}
                detail={item.description}
              />
            ))
          ) : (
            <EmptyText>隐藏房间里也许有 Reverie 留下的手写线索。</EmptyText>
          )}
        </div>
      </section>

      <section className="rounded border border-[var(--color-neon-magenta)]/30 bg-[var(--color-midnight)]/50 p-5">
        <p className="font-pixel text-[9px] text-[var(--color-text-muted)]">
          EASTER EGGS
        </p>
        <div className="mt-4 space-y-3">
          {progress.foundEasterEggs.length > 0 ? (
            progress.foundEasterEggs.map((eggId) => {
              const egg = knownEasterEggs[eggId];
              return (
                <InventoryRow
                  key={eggId}
                  icon="✧"
                  title={egg?.title ?? eggId}
                  detail={egg?.detail ?? "一枚尚未归档的文化回声。"}
                />
              );
            })
          ) : (
            <EmptyText>场景里藏着不止一枚彩蛋。慢一点，四处看看。</EmptyText>
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 lg:col-span-2">
        <Link
          href="/play/neon_arcade/neon_arcade_hall"
          className={cn(
            "rounded border border-[var(--color-neon-cyan)] px-4 py-2",
            "font-pixel text-[10px] text-[var(--color-neon-cyan)]",
            "hover:bg-[var(--color-neon-cyan)] hover:text-[var(--color-deep-bg)]"
          )}
        >
          返回街机厅
        </Link>
        <Link
          href="/planets"
          className="rounded border border-[var(--color-neon-purple)] px-4 py-2 font-pixel text-[10px] text-[var(--color-neon-purple)] hover:bg-[var(--color-neon-purple)] hover:text-[var(--color-deep-bg)]"
        >
          星球选择
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[var(--color-text-muted)]/40 bg-[var(--color-shadow)]/40 p-3">
      <p className="font-pixel text-[8px] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-2 font-pixel text-sm text-[var(--color-neon-cyan)]">
        {value}
      </p>
    </div>
  );
}

function InventoryRow({
  icon,
  title,
  detail,
}: {
  icon: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded border border-[var(--color-text-muted)]/30 bg-[var(--color-shadow)]/40 p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>
        <div>
          <p className="font-pixel text-[10px] text-[var(--color-text-primary)]">
            {title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded border border-[var(--color-text-muted)]/30 bg-[var(--color-shadow)]/40 p-4 text-sm text-[var(--color-text-muted)]">
      {children}
    </p>
  );
}
