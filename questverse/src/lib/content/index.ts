import {
  planetNeonArcade,
  scenesNeonArcade,
  firstPuzzle,
  arcadeSystemMapPuzzle,
  firstKeyFragment,
  firstSignalNote,
  arcadeSystemMapNote,
} from "./planets/neon-arcade";
import {
  planetVinylVault,
  scenesVinylVault,
  lostFrequenciesPuzzle,
  reversedLabelPuzzle,
  vinylKeyFragment,
  secondSignalNote,
  rewindLabelNote,
  cutFrameNote,
} from "./planets/vinyl-vault";
import type { Item, Puzzle, Scene } from "@/types/scene";

/**
 * QuestVerse Content Registry
 *
 * 所有关卡、世界、谜题、物品的中央索引
 * 新内容只需在此注册即可被游戏识别
 */

// 星球
export const planets = [planetNeonArcade, planetVinylVault] as const;
export type PlanetId = (typeof planets)[number]["id"];

// 场景 - 用 id 索引方便快速查找
export const scenesById = new Map<string, Scene>(
  [...scenesNeonArcade, ...scenesVinylVault].map((s) => [s.id, s])
);

// 谜题
export const puzzlesById = new Map<string, Puzzle>([
  [firstPuzzle.id, firstPuzzle],
  [arcadeSystemMapPuzzle.id, arcadeSystemMapPuzzle],
  [lostFrequenciesPuzzle.id, lostFrequenciesPuzzle],
  [reversedLabelPuzzle.id, reversedLabelPuzzle],
]);

// 物品
export const itemsById = new Map<string, Item>([
  [firstKeyFragment.id, firstKeyFragment],
  [firstSignalNote.id, firstSignalNote],
  [arcadeSystemMapNote.id, arcadeSystemMapNote],
  [vinylKeyFragment.id, vinylKeyFragment],
  [secondSignalNote.id, secondSignalNote],
  [rewindLabelNote.id, rewindLabelNote],
  [cutFrameNote.id, cutFrameNote],
]);

/**
 * 查找函数 - 整个游戏只需这一组
 */
export function getScene(sceneId: string) {
  return scenesById.get(sceneId);
}

export function getPuzzle(puzzleId: string) {
  return puzzlesById.get(puzzleId);
}

export function getItem(itemId: string) {
  return itemsById.get(itemId);
}

export function getPlanet(planetId: string) {
  return planets.find((p) => p.id === planetId);
}

/**
 * 检查玩家是否满足星球的解锁条件
 */
export function canEnterPlanet(
  planetId: string,
  progress: {
    inventory: string[];
    flags: Record<string, unknown>;
    storyProgress: number;
  }
): { can: boolean; reason?: string } {
  const planet = getPlanet(planetId);
  if (!planet) return { can: false, reason: "星球不存在" };

  const cond = planet.unlocksWith;
  if (!cond) return { can: true };

  if (cond.items) {
    const missing = cond.items.filter((id) => !progress.inventory.includes(id));
    if (missing.length > 0) {
      return {
        can: false,
        reason: `缺少物品: ${missing.join(", ")}`,
      };
    }
  }

  if (cond.flags) {
    const missingFlag = cond.flags.find((flag) => !progress.flags[flag]);
    if (missingFlag) {
      return { can: false, reason: `未满足条件: ${missingFlag}` };
    }
  }

  if (cond.storyProgress !== undefined && progress.storyProgress < cond.storyProgress) {
    return { can: false, reason: `需要进度 ${cond.storyProgress}` };
  }

  return { can: true };
}
