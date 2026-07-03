import type { Item, Planet, PuzzleHiddenObject, Scene } from "@/types/scene";

/**
 * 第二颗星球：黑胶唱片室 (Vinyl Vault)
 *
 * 主题：80 年代音乐、实体媒介、在噪声中面对恐惧
 * 主色调：暗紫 + 暖金 + 磁带红
 * 难度：入门 - 第二类谜题（勇气 / 隐藏对象）
 */

export const planetVinylVault: Planet = {
  id: "vinyl_vault",
  name: "黑胶唱片室 (Vinyl Vault)",
  themeColor: "#B14DFF",
  description:
    "一间藏在城市地下的唱片室。墙上贴着褪色巡演海报，唱针在无人触碰的黑胶上循环空转。你要在噪声、倒放和失真中，找到 A.N. Reverie 留下的第二段讯号。",
  startSceneId: "vinyl_vault_entry",
  unlocksWith: {
    items: ["key_fragment_atari"],
  },
};

export const scenesVinylVault: Scene[] = [
  {
    id: "vinyl_vault_entry",
    name: "唱片室门口",
    background: "/assets/images/places/vinyl_vault/entry.svg",
    darkMode: "night",
    ambientMusic: "ambient_vinyl_noise",
    hotspots: [
      {
        id: "hs_vault_door",
        x: 72,
        y: 34,
        width: 13,
        height: 22,
        label: "地下门",
        trigger: {
          kind: "transition",
          targetSceneId: "vinyl_vault_listening_room",
          prompt: "门后传来唱针划过空槽的声音。",
        },
      },
      {
        id: "hs_joy_division_poster",
        x: 18,
        y: 30,
        width: 12,
        height: 18,
        label: "波形海报",
        trigger: {
          kind: "easter_egg",
          eggId: "unknown_pleasures_1979",
          flavorText:
            "一张黑底白线的波形图。致敬 Joy Division《Unknown Pleasures》(1979) 的经典封面。",
        },
      },
      {
        id: "hs_torn_ticket",
        x: 44,
        y: 66,
        width: 8,
        height: 6,
        label: "半张票根",
        trigger: {
          kind: "examine",
          text: "票根只剩半截，背面写着：‘真正可怕的不是噪声，而是你害怕把音量调大。’",
        },
      },
    ],
  },
  {
    id: "vinyl_vault_listening_room",
    name: "试听室",
    background: "/assets/images/places/vinyl_vault/listening-room.svg",
    darkMode: "night",
    ambientMusic: "ambient_reverse_tape",
    hotspots: [
      {
        id: "hs_turntable",
        x: 43,
        y: 48,
        width: 18,
        height: 18,
        label: "唱机",
        trigger: {
          kind: "puzzle",
          puzzleId: "puzzle_find_lost_frequencies",
          onSolve: {
            itemId: "key_fragment_vinyl",
            setsFlag: "heard_second_signal",
            storyProgress: 45,
          },
        },
      },
      {
        id: "hs_kraftwerk_shelf",
        x: 70,
        y: 38,
        width: 12,
        height: 24,
        label: "整齐的唱片架",
        trigger: {
          kind: "easter_egg",
          eggId: "kraftwerk_1978",
          flavorText:
            "唱片按机器般精准的间距排列。致敬 Kraftwerk 的电子音乐秩序感。",
        },
      },
      {
        id: "hs_reel_to_reel",
        x: 18,
        y: 48,
        width: 13,
        height: 16,
        label: "开盘机",
        trigger: {
          kind: "examine",
          text: "两只磁带轮缓慢反向转动，像一双不肯眨眼的眼睛。",
        },
      },
      {
        id: "hs_exit_to_entry",
        x: 5,
        y: 38,
        width: 8,
        height: 28,
        label: "出口",
        trigger: {
          kind: "transition",
          targetSceneId: "vinyl_vault_entry",
          prompt: "回到门口。",
        },
      },
    ],
  },
];

export const lostFrequenciesPuzzle: PuzzleHiddenObject = {
  id: "puzzle_find_lost_frequencies",
  type: "courage",
  name: "遗失的频率",
  hint: "唱片室的灯忽明忽暗。你需要在噪声吞没房间之前，找到三段被藏起来的声音。",
  hints: [
    "提示 1: 声音藏在会震动的东西附近。",
    "提示 2: 看唱机、音箱和磁带轮，那里有 Reverie 留下的三段频率。",
    "提示 3: 依次点亮左侧开盘机、中央唱机、右侧音箱。",
  ],
  maxHints: 3,
  targets: [
    {
      id: "left_reel_frequency",
      description: "左侧开盘机里倒转的低频",
      x: 24,
      y: 50,
      radius: 7,
    },
    {
      id: "needle_frequency",
      description: "唱针下方反复闪烁的中频",
      x: 52,
      y: 55,
      radius: 8,
    },
    {
      id: "speaker_frequency",
      description: "右侧音箱栅格里的高频",
      x: 78,
      y: 52,
      radius: 7,
    },
  ],
  timeLimit: 45,
  reward: {
    itemId: "key_fragment_vinyl",
    storyProgress: 45,
    setsFlag: "heard_second_signal",
  },
  easterEgg: "reversed_tape_signal",
};

export const vinylKeyFragment: Item = {
  id: "key_fragment_vinyl",
  name: "Vinyl 钥匙碎片",
  description: "一枚刻着声波纹路的玉色碎片，来自黑胶唱片室的失真讯号。",
  icon: "💿",
  isKeyFragment: true,
  lore:
    "这枚碎片象征着勇气。你没有关掉噪声，而是走近它，听见了藏在恐惧背后的旋律。",
};
