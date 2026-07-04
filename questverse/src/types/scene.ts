/**
 * QuestVerse - 核心数据模型
 * Inspired by Ready Player One's data-driven world building
 *
 * 三个核心原则：
 * 1. 数据驱动：所有关卡内容用 JSON/TS 声明，而非硬编码
 * 2. 类型安全：从 schema 派生所有运行时数据
 * 3. 可扩展：新谜题类型只需扩展 Puzzle 联合类型
 */

// ============================================================
// 1. 世界结构 - Scene / Hotspot
// ============================================================

/**
 * 一个可交互的"热点" - 玩家点击场景中的某个元素
 * 可以是物品、人物、地点或隐藏的彩蛋
 */
export interface Hotspot {
  id: string;
  /** 屏幕坐标或网格坐标（暂用百分比 0-100） */
  x: number;
  y: number;
  /** 视觉宽度/高度，影响点击区域 */
  width: number;
  height: number;
  /** 鼠标悬停时的标签 */
  label?: string;

  // 触发器类型 - discriminated union
  trigger:
    | HotspotTriggerExamine
    | HotspotTriggerDialog
    | HotspotTriggerPuzzle
    | HotspotTriggerItem
    | HotspotTriggerTransition
    | HotspotTriggerEasterEgg;
}

export interface HotspotTriggerExamine {
  kind: "examine";
  /** 简短描述 */
  text: string;
}

export interface HotspotTriggerDialog {
  kind: "dialog";
  npcId: string;
  /** 对话树 ID - 指向 LoreContent */
  dialogId: string;
}

export interface HotspotTriggerPuzzle {
  kind: "puzzle";
  puzzleId: string;
  /** 解决后给予什么 */
  onSolve?: {
    itemId?: string;
    setsFlag?: string;
    storyProgress?: number;
  };
}

export interface HotspotTriggerItem {
  kind: "item";
  itemId: string;
  /** 拾取后是否消失 */
  oneTime: boolean;
  /** 拾取条件（如需要先完成谜题获得钥匙） */
  requires?: HotspotRequirement;
}

export interface HotspotTriggerTransition {
  kind: "transition";
  /** 跳转到的目标场景 */
  targetSceneId: string;
  /** 视觉提示文字 */
  prompt?: string;
  /** 进入条件（如需要钥匙碎片或剧情 flag） */
  requires?: HotspotRequirement;
}

export interface HotspotRequirement {
  items?: string[];
  flags?: string[];
  message?: string;
}

export interface HotspotTriggerEasterEgg {
  kind: "easter_egg";
  /** 彩蛋 ID - 用于发现自己彩蛋的玩家记录 */
  eggId: string;
  /** 显示的致敬文字 */
  flavorText: string;
}

/**
 * 一个完整场景 - 玩家看到的最大单位
 * 场景之间通过 HotspotTriggerTransition 跳转
 */
export interface Scene {
  id: string;
  /** 场景名称（仅供设计者参考） */
  name: string;
  /** 背景图片 ID */
  background: string;
  /** 是否为 dark/fog of war 模式（探索解谜常用） */
  darkMode?: "fog" | "dark" | "night";
  /** 可交互热点 */
  hotspots: Hotspot[];
  /** 进入场景时自动播放的对话 */
  onEnterDialog?: string;
  /** 环境音乐 ID */
  ambientMusic?: string;
}

// ============================================================
// 2. 解谜系统 - Puzzle
// ============================================================

/**
 * 三类核心谜题（对应头号玩家的三把钥匙）
 */
export type PuzzleType = "reverse" | "courage" | "wisdom";

/**
 * 谜题的 discriminated union 类型
 * 未来新增类型只需在联合中添加
 */
export type Puzzle =
  | PuzzleSequence
  | PuzzleRiddle
  | PuzzleHiddenObject
  | PuzzleCode
  | PuzzleLogic;

export interface PuzzleBase {
  id: string;
  type: PuzzleType;
  name: string;
  /** 解谜时的提示文本 */
  hint: string;
  /** 提示等级（分阶段） */
  hints: string[];
  /** 最大提示次数 */
  maxHints: number;
  /** 解决时获得的奖励 */
  reward?: PuzzleReward;
  /** 元数据 - 致敬元素 */
  easterEgg?: string;
}

/** 逆向思维类 - 序列倒序 */
export interface PuzzleSequence extends PuzzleBase {
  type: "reverse";
  /** 正确序列 */
  sequence: string[];
  /** 每个元素的视觉展示 */
  items: { id: string; display: string; emoji?: string }[];
  /** 必须反向执行（如"倒放历史事件"） */
  reverseExecution: boolean;
}

/** 智慧 / 谜语类 */
export interface PuzzleRiddle extends PuzzleBase {
  type: "wisdom";
  /** 谜面 */
  riddle: string;
  /** 答案（多语言可选） */
  answers: string[];
  /** 答案别名（用于灵活匹配） */
  answerAliases?: string[];
}

/** 隐藏对象类 - 勇气 */
export interface PuzzleHiddenObject extends PuzzleBase {
  type: "courage";
  /** 需要找到的对象列表 */
  targets: {
    id: string;
    description: string;
    /** 在背景中的归一化坐标 (0-100) */
    x: number;
    y: number;
    /** 可点击区域的半径 */
    radius: number;
  }[];
  /** 时间限制（秒），可选 */
  timeLimit?: number;
}

/** 密码/输入类 */
export interface PuzzleCode extends PuzzleBase {
  type: "wisdom";
  inputLength: number;
  /** 正确答案 */
  correctAnswer: string;
  /** 输入字符集（如 "0123456789"）*/
  charset?: string;
  /** 输入框占位提示 */
  placeholder?: string;
  /** 解开后显示的文本 */
  successText?: string;
}

/** 逻辑谜题 */
export interface PuzzleLogic extends PuzzleBase {
  type: "wisdom";
  puzzleData: Record<string, unknown>;
}

export interface PuzzleReward {
  itemId?: string;
  storyProgress?: number;
  setsFlag?: string;
  unlocksSceneId?: string;
}

// ============================================================
// 3. 物品 / 库存
// ============================================================

export interface Item {
  id: string;
  name: string;
  description: string;
  /** 图标（emoji 或图片路径） */
  icon: string;
  /** 是否为关键钥匙碎片 */
  isKeyFragment?: boolean;
  /** 关联的彩蛋 */
  lore?: string;
}

// ============================================================
// 4. 星球与导航
// ============================================================

export interface Planet {
  id: string;
  name: string;
  /** 主题色（霓虹）*/
  themeColor: string;
  /** 描述 */
  description: string;
  /** 起始场景 ID */
  startSceneId: string;
  /** 解锁条件 - 需要拥有哪些 item 或 flag */
  unlocksWith?: {
    items?: string[];
    flags?: string[];
    storyProgress?: number;
  };
  /** 完成条件 - 解锁下一颗星球 */
  completesWith?: {
    items?: string[];
    flags?: string[];
  };
}

// ============================================================
// 5. 玩家存档
// ============================================================

export interface PlayerSave {
  /** 当前所在星球 */
  currentPlanetId: string;
  /** 当前场景 */
  currentSceneId: string;
  /** 拥有的物品 */
  inventory: string[];
  /** 已解决的谜题 */
  solvedPuzzles: string[];
  /** 已发现的彩蛋 */
  foundEasterEggs: string[];
  /** 全局 flag（叙事标记） */
  flags: Record<string, boolean | string | number>;
  /** 故事进度（0-100） */
  storyProgress: number;
  /** 已使用的提示 */
  hintsUsed: Record<string, number>;
  /** 游玩时间（秒） */
  playTime: number;
  /** 最后保存时间 */
  lastSavedAt: string;
}

// ============================================================
// 6. 元数据 - 致敬元素 / 彩蛋
// ============================================================

export interface EasterEgg {
  id: string;
  /** 致敬对象 */
  tributeTo: string;
  flavorText: string;
  /** 发现难度 1-5 */
  rarity: "common" | "uncommon" | "rare" | "legendary";
}
