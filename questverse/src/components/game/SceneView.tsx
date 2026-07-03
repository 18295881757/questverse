"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game-engine/index";
import { getScene } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import type { Scene, Hotspot } from "@/types/scene";
import { HotspotInteraction } from "./HotspotInteraction";
import { PuzzleModal } from "./PuzzleModal";
import { EasterEggToast } from "./EasterEggToast";

/**
 * SceneView - 单个场景的渲染容器
 *
 * 责任:
 * 1. 渲染场景背景
 * 2. 渲染所有 hotspot（点击触发）
 * 3. 协调弹窗（对话 / 谜题 / 彩蛋）
 */
export function SceneView({
  planetId,
  sceneId,
}: {
  planetId: string;
  sceneId: string;
}) {
  const scene = getScene(sceneId);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  // Hooks 必须在条件之前
  const onHotspotClick = useCallback((h: Hotspot) => {
    setSelectedHotspot(h);
  }, []);

  if (!scene) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-pixel text-xs text-[var(--color-neon-magenta)]">
          SCENE NOT FOUND
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 背景层 - 此处使用纯色 + 渐变模拟，实际开发替换为 <Image> */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-br from-[var(--color-deep-bg)] via-[var(--color-midnight)] to-[var(--color-shadow)]",
          scene.darkMode === "night" && "from-purple-950/30 to-black",
          scene.darkMode === "dark" && "brightness-50"
        )}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${scene.background})` }}
        />
        {scene.id === "neon_arcade_entry" && (
          <div className="arcade-rain absolute inset-0 opacity-45" />
        )}
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#00fff5_1px,transparent_1px),linear-gradient(to_bottom,#00fff5_1px,transparent_1px)] [background-size:50px_50px]" />
      </div>

      {/* 场景标题 */}
      <SceneHeader scene={scene} />

      {/* 热点层 */}
      <div className="absolute inset-0">
        {scene.hotspots.map((h) => (
          <HotspotButton
            key={h.id}
            hotspot={h}
            onClick={() => onHotspotClick(h)}
          />
        ))}
      </div>

      {/* 底部 HUD - 道具 / 进度 */}
      <HUD />

      {/* 弹窗 */}
      <AnimatePresence>
        {selectedHotspot && (
          <HotspotInteraction
            hotspot={selectedHotspot}
            planetId={planetId}
            onClose={() => setSelectedHotspot(null)}
          />
        )}
      </AnimatePresence>

      {/* 彩蛋提示 (全局监听) */}
      <EasterEggToast />

      {/* 谜题模态 */}
      <PuzzleModal />
    </div>
  );
}

function SceneHeader({ scene }: { scene: Scene }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between"
    >
      <div className="font-pixel text-[10px] text-[var(--color-neon-cyan)] neon-glow">
        ▸ {scene.name}
      </div>
      <div className="font-pixel text-[10px] text-[var(--color-text-muted)]">
        {scene.id}
      </div>
    </motion.header>
  );
}

function HotspotButton({
  hotspot,
  onClick,
}: {
  hotspot: Hotspot;
  onClick: () => void;
}) {
  const [showLabel, setShowLabel] = useState(false);

  // 不同触发器有不同视觉反馈
  const indicator =
    hotspot.trigger.kind === "puzzle"
      ? "🎮"
      : hotspot.trigger.kind === "transition"
        ? "🚪"
        : hotspot.trigger.kind === "item"
          ? "✦"
          : hotspot.trigger.kind === "easter_egg"
            ? "✧"
            : "";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setShowLabel(true)}
      onHoverEnd={() => setShowLabel(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.width}%`,
        height: `${hotspot.height}%`,
      }}
      className={cn(
        "absolute group cursor-pointer",
        "transition-colors hover:bg-[var(--color-neon-cyan)]/10",
        "border border-transparent hover:border-[var(--color-neon-cyan)]/40"
      )}
      aria-label={hotspot.label ?? hotspot.trigger.kind}
    >
      <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-0 transition-opacity group-hover:opacity-100">
        {indicator}
      </span>
      {showLabel && hotspot.label && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--color-deep-bg)]/90 px-2 py-1 font-pixel text-[8px] text-[var(--color-neon-cyan)]">
          {hotspot.label}
        </span>
      )}
    </motion.button>
  );
}

function HUD() {
  const progress = useGameStore((s) => s.progress);
  const totalFragments = 3; // 三把钥匙
  const found = progress.inventory.filter((id) => id.includes("key_")).length;

  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-pixel text-[9px]">
      <div className="flex gap-3 text-[var(--color-neon-yellow)]">
        <span>{found}/{totalFragments} 🔑</span>
        <span>{progress.foundEasterEggs.length} 🥚</span>
      </div>
      <div className="text-[var(--color-text-muted)]">
        {Math.floor(progress.playTime / 60)}m
      </div>
    </div>
  );
}
