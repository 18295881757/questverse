"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/game-engine/index";
import { getPuzzle, getItem } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import type { Hotspot } from "@/types/scene";

/**
 * HotspotInteraction - 根据 hotspot.trigger.kind 分发到具体渲染
 * 这是数据驱动设计的核心 - 一个组件处理所有触发器类型
 */
export function HotspotInteraction({
  hotspot,
  planetId,
  onClose,
}: {
  hotspot: Hotspot;
  planetId: string;
  onClose: () => void;
}) {
  const trigger = hotspot.trigger;

  // 谜题型 - 打开谜题弹窗
  if (trigger.kind === "puzzle") {
    return <PuzzleLaunchTrigger hotspot={hotspot} onClose={onClose} />;
  }

  // 物品型
  if (trigger.kind === "item") {
    return <ItemPickupTrigger hotspot={hotspot} onClose={onClose} />;
  }

  // 场景跳转
  if (trigger.kind === "transition") {
    return (
      <TransitionTrigger
        hotspot={hotspot}
        planetId={planetId}
        onClose={onClose}
      />
    );
  }

  // 彩蛋
  if (trigger.kind === "easter_egg") {
    return <EasterEggTrigger hotspot={hotspot} onClose={onClose} />;
  }

  // 对话型
  if (trigger.kind === "dialog") {
    return <DialogTrigger hotspot={hotspot} onClose={onClose} />;
  }

  // 检查型 - 简单描述
  return (
    <ExamineCard
      text={"text" in trigger ? trigger.text : ""}
      onClose={onClose}
    />
  );
}

// ============================================================
// 子组件们
// ============================================================

function CardShell({
  children,
  onClose,
  maxWidth = "max-w-lg",
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-[90vw] rounded-lg",
          "border-2 border-[var(--color-neon-cyan)]",
          "bg-[var(--color-midnight)]/95 p-6",
          "shadow-[0_0_50px_rgba(0,255,245,0.3)]",
          maxWidth
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 font-pixel text-xs text-[var(--color-text-muted)] hover:text-[var(--color-neon-magenta)]"
        >
          ✕
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function ExamineCard({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <CardShell onClose={onClose}>
      <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
        {text}
      </p>
      <button
        onClick={onClose}
        className="mt-6 font-pixel text-[10px] text-[var(--color-neon-cyan)] hover:underline"
      >
        [关闭]
      </button>
    </CardShell>
  );
}

function PuzzleLaunchTrigger({
  hotspot,
  onClose,
}: {
  hotspot: Hotspot;
  onClose: () => void;
}) {
  const trigger = hotspot.trigger as Extract<Hotspot["trigger"], { kind: "puzzle" }>;
  const puzzle = getPuzzle(trigger.puzzleId);
  const openPuzzle = useGameStore((s) => s._uiActions.openPuzzle);

  if (!puzzle) {
    return <ExamineCard text="[谜题未配置]" onClose={onClose} />;
  }

  return (
    <CardShell onClose={onClose}>
      <h2 className="mb-4 font-pixel text-base text-[var(--color-neon-yellow)] neon-glow">
        {puzzle.name}
      </h2>
      <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
        {puzzle.hint}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="rounded border border-[var(--color-text-muted)] px-4 py-2 font-pixel text-[10px] text-[var(--color-text-muted)] hover:border-[var(--color-neon-cyan)] hover:text-[var(--color-neon-cyan)]"
        >
          离开
        </button>
        <button
          onClick={() => {
            openPuzzle(trigger.puzzleId);
            onClose();
          }}
          className="rounded border border-[var(--color-neon-magenta)] bg-[var(--color-neon-magenta)]/10 px-4 py-2 font-pixel text-[10px] text-[var(--color-neon-magenta)] hover:bg-[var(--color-neon-magenta)] hover:text-black"
        >
          ▶ 开始解谜
        </button>
      </div>
    </CardShell>
  );
}

function ItemPickupTrigger({
  hotspot,
  onClose,
}: {
  hotspot: Hotspot;
  onClose: () => void;
}) {
  const trigger = hotspot.trigger as Extract<Hotspot["trigger"], { kind: "item" }>;
  const item = getItem(trigger.itemId);
  const addItem = useGameStore((s) => s._uiActions.addItem);
  const progress = useGameStore((s) => s.progress);
  const missingItems =
    trigger.requires?.items?.filter((itemId) => !progress.inventory.includes(itemId)) ??
    [];
  const missingFlags =
    trigger.requires?.flags?.filter((flag) => !progress.flags[flag]) ?? [];
  const canPickUp = missingItems.length === 0 && missingFlags.length === 0;

  if (!canPickUp) {
    return (
      <CardShell onClose={onClose}>
        <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
          {trigger.requires?.message ??
            "这个物品像是在等待某段信号完成之后才会显现。"}
        </p>
        <p className="mt-4 font-pixel text-[9px] text-[var(--color-neon-yellow)]">
          {missingItems.length > 0
            ? `REQUIRES: ${missingItems.join(" / ")}`
            : `REQUIRES FLAG: ${missingFlags.join(" / ")}`}
        </p>
        <button
          onClick={onClose}
          className="mt-6 font-pixel text-[10px] text-[var(--color-neon-cyan)] hover:underline"
        >
          [关闭]
        </button>
      </CardShell>
    );
  }

  return (
    <CardShell onClose={onClose}>
      <p className="font-pixel text-xs text-[var(--color-text-muted)]">
        你发现了物品
      </p>
      <h2 className="mt-3 font-pixel text-base text-[var(--color-neon-yellow)] neon-glow">
        {item?.icon} {item?.name ?? "未知物品"}
      </h2>
      {item && (
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          {item.description}
        </p>
      )}
      <button
        onClick={() => {
          addItem(trigger.itemId);
          onClose();
        }}
        className="mt-6 rounded bg-[var(--color-neon-cyan)] px-6 py-2 font-pixel text-[10px] text-[var(--color-deep-bg)] hover:bg-[var(--color-neon-cyan)]/80"
      >
        拾取
      </button>
    </CardShell>
  );
}

function TransitionTrigger({
  hotspot,
  planetId,
  onClose,
}: {
  hotspot: Hotspot;
  planetId: string;
  onClose: () => void;
}) {
  const trigger = hotspot.trigger as Extract<
    Hotspot["trigger"],
    { kind: "transition" }
  >;
  const router = useRouter();
  const travelTo = useGameStore((s) => s._uiActions.travelTo);
  const progress = useGameStore((s) => s.progress);
  const [isTraveling, setIsTraveling] = useState(false);
  const missingItems =
    trigger.requires?.items?.filter((itemId) => !progress.inventory.includes(itemId)) ??
    [];
  const missingFlags =
    trigger.requires?.flags?.filter((flag) => !progress.flags[flag]) ?? [];
  const canTravel = missingItems.length === 0 && missingFlags.length === 0;

  return (
    <CardShell onClose={onClose}>
      <p className="text-sm text-[var(--color-text-primary)]">
        {canTravel
          ? (trigger.prompt ?? "你要去哪里？")
          : (trigger.requires?.message ?? "这里还没有响应。也许你缺少某个关键物品。")}
      </p>
      {!canTravel && (
        <p className="mt-4 font-pixel text-[9px] text-[var(--color-neon-yellow)]">
          {missingItems.length > 0
            ? `REQUIRES: ${missingItems.join(" / ")}`
            : `REQUIRES FLAG: ${missingFlags.join(" / ")}`}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={onClose}
          className="rounded border border-[var(--color-text-muted)] px-4 py-2 font-pixel text-[10px] text-[var(--color-text-muted)]"
        >
          留下
        </button>
        <button
          onClick={() => {
            if (!canTravel || isTraveling) return;
            setIsTraveling(true);
            travelTo(planetId, trigger.targetSceneId);
            router.push(`/play/${planetId}/${trigger.targetSceneId}`);
            onClose();
          }}
          disabled={!canTravel || isTraveling}
          className={cn(
            "rounded border px-4 py-2 font-pixel text-[10px]",
            canTravel
              ? "border-[var(--color-neon-cyan)] bg-[var(--color-neon-cyan)]/10 text-[var(--color-neon-cyan)]"
              : "cursor-not-allowed border-[var(--color-text-muted)] text-[var(--color-text-muted)]"
          )}
        >
          {isTraveling ? "前往中..." : "前往 →"}
        </button>
      </div>
    </CardShell>
  );
}

function EasterEggTrigger({
  hotspot,
  onClose,
}: {
  hotspot: Hotspot;
  onClose: () => void;
}) {
  const trigger = hotspot.trigger as Extract<
    Hotspot["trigger"],
    { kind: "easter_egg" }
  >;
  const recordEasterEgg = useGameStore.getState()._uiActions.recordEasterEgg;

  return (
    <CardShell onClose={onClose} maxWidth="max-w-md">
      <p className="font-pixel text-xs text-[var(--color-neon-magenta)] neon-glow">
        ✧ EGG FOUND ✧
      </p>
      <p className="mt-4 text-sm italic leading-relaxed text-[var(--color-text-primary)]">
        {trigger.flavorText}
      </p>
      <button
        onClick={() => {
          recordEasterEgg(trigger.eggId);
          onClose();
        }}
        className="mt-6 rounded border border-[var(--color-neon-magenta)] px-6 py-2 font-pixel text-[10px] text-[var(--color-neon-magenta)] hover:bg-[var(--color-neon-magenta)] hover:text-black"
      >
        记录到档案
      </button>
    </CardShell>
  );
}

function DialogTrigger({
  hotspot,
  onClose,
}: {
  hotspot: Hotspot;
  onClose: () => void;
}) {
  const trigger = hotspot.trigger as Extract<Hotspot["trigger"], { kind: "dialog" }>;
  return (
    <CardShell onClose={onClose}>
      <p className="font-pixel text-xs text-[var(--color-neon-purple)] neon-glow">
        对话 ID: {trigger.dialogId}
      </p>
      <p className="mt-4 text-sm text-[var(--color-text-primary)]">
        [对话系统待实现 - 下一阶段加入]
      </p>
      <button
        onClick={onClose}
        className="mt-6 font-pixel text-[10px] text-[var(--color-neon-cyan)] hover:underline"
      >
        [离开]
      </button>
    </CardShell>
  );
}
