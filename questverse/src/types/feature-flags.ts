/**
 * QuestVerse - 状态管理类型定义
 * 使用 Zustand 管理游戏状态
 */

import type { PlayerSave, PuzzleReward } from "./scene";
export type { PlayerSave } from "./scene";

export interface GameActions {
  openPuzzle: (puzzleId: string) => void;
  closePuzzle: () => void;
  openEasterEgg: (id: string, flavor: string) => void;
  closeEasterEgg: () => void;
  addItem: (itemId: string) => void;
  markPuzzleSolved: (puzzleId: string) => void;
  applyPuzzleReward: (puzzleId: string, reward?: PuzzleReward) => void;
  recordEasterEgg: (eggId: string) => void;
  setFlag: (key: string, value: boolean | string | number) => void;
  travelTo: (planetId: string, sceneId: string) => void;
  tickPlayTime: (seconds: number) => void;
}

/**
 * 游戏运行时状态 - 完全可序列化（可保存到 LocalStorage）
 */
export interface GameState {
  // 元数据
  isLoaded: boolean;
  version: string;

  // 玩家进度（与 PlayerSave 同源）
  progress: PlayerSave;

  // UI 状态（不必序列化）
  ui: {
    /** 当前打开的谜题 */
    activePuzzleId: string | null;
    /** 当前打开的对话 */
    activeDialogId: string | null;
    /** 当前显示的物品描述 */
    activeItemId: string | null;
    /** 彩蛋弹窗 */
    activeEasterEgg: { id: string; flavor: string } | null;
    /** 提示等级 */
    currentHintLevel: number;
    /** 设置 */
    settings: {
      /** 音画细节程度 */
      quality: "low" | "medium" | "high";
      /** 文本速度 */
      textSpeed: "slow" | "normal" | "fast";
      /** 是否已读 EOS 文字 */
      easterEggsDiscoveredSeen: boolean;
    };
  };

  // Actions - 见 game-engine/store
  _uiActions: GameActions;
}

export const SAVE_VERSION = "0.1.0";
export const SAVE_KEY = "questverse:save";
