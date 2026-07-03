"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/game-engine/index";

/**
 * EasterEggToast - 全局彩蛋提示
 * 当玩家发现彩蛋时短暂浮现在屏幕中央
 */
export function EasterEggToast() {
  const activeEasterEgg = useGameStore((s) => s.ui.activeEasterEgg);
  const closeEasterEgg = useGameStore((s) => s._uiActions.closeEasterEgg);

  useEffect(() => {
    if (!activeEasterEgg) return;
    const timer = window.setTimeout(closeEasterEgg, 2200);
    return () => window.clearTimeout(timer);
  }, [activeEasterEgg, closeEasterEgg]);

  if (!activeEasterEgg) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="pointer-events-none fixed left-1/2 top-1/4 z-30 -translate-x-1/2"
    >
      <div className="rounded border border-[var(--color-neon-magenta)] bg-[var(--color-midnight)]/90 px-6 py-3 font-pixel text-[10px] text-[var(--color-neon-magenta)] neon-glow">
        ✧ EGG FOUND: {activeEasterEgg.id}
      </div>
    </motion.div>
  );
}
