import type { Item, Planet, PuzzleCode, PuzzleSequence, Scene } from "@/types/scene";

/**
 * 第一颗星球：霓虹街机厅 (Neon Arcade)
 *
 * 主题：向 80 年代街机文化致敬
 * 主色调：霓虹粉 + 电光青
 * 难度：入门 - 教学第一类谜题（逆向思维）
 */

export const planetNeonArcade: Planet = {
  id: "neon_arcade",
  name: "霓虹街机厅 (Neon Arcade)",
  themeColor: "#FF2E88",
  description:
    "在 2040 年代的一场大停电之后，所有 VR 体验都冻结了。唯一还在运转的，是一家位于偏远小镇的街机厅 —— 数十台古老的投币游戏机依然亮着霓虹灯，吸引着寻找失落宝藏的玩家。",
  startSceneId: "neon_arcade_entry",
  // 入门星球无需解锁
};

export const scenesNeonArcade: Scene[] = [
  {
    id: "neon_arcade_entry",
    name: "街机厅入口",
    background: "/assets/images/places/neon_arcade/entry.svg",
    darkMode: "dark",
    ambientMusic: "ambient_arcade_hum",
    onEnterDialog: "intro_neon_arcade",
    hotspots: [
      {
        id: "hs_arcade_door",
        x: 80,
        y: 30,
        width: 8,
        height: 16,
        label: "入口",
        trigger: {
          kind: "transition",
          targetSceneId: "neon_arcade_hall",
          prompt: "走进去",
        },
      },
      {
        id: "hs_poster_classic",
        x: 15,
        y: 40,
        width: 10,
        height: 14,
        label: "海报",
        trigger: {
          kind: "examine",
          text: "墙上贴着一张泛黄的海报，写着：‘Atari 2600 (1977)’ —— 一切都起源于这个瞬间。",
        },
      },
      {
        id: "hs_reverie_sign",
        x: 41,
        y: 14,
        width: 24,
        height: 10,
        label: "霓虹招牌",
        trigger: {
          kind: "easter_egg",
          eggId: "atari_1977",
          flavorText:
            "招牌下方的细字写着 SINCE 1977。致敬 Atari 2600 进入家庭客厅的那一年。",
        },
      },
      {
        id: "hs_coin_atm",
        x: 63,
        y: 60,
        width: 8,
        height: 13,
        label: "换币机",
        trigger: {
          kind: "examine",
          text: "换币机卡在 0.25 USD 的价格上。屏幕提示：真正的入口从来不是投币口，而是你愿不愿意把手伸向旧机器。",
        },
      },
      {
        id: "hs_blinky_reflection",
        x: 86,
        y: 72,
        width: 7,
        height: 6,
        label: "红色倒影",
        trigger: {
          kind: "easter_egg",
          eggId: "blinky_pacman",
          flavorText:
            "雨水里浮着一个红色鬼影般的反光。致敬《Pac-Man》里永远追在玩家身后的 Blinky。",
        },
      },
      {
        id: "hs_egg_pong",
        x: 5,
        y: 80,
        width: 4,
        height: 4,
        label: "...",
        trigger: {
          kind: "easter_egg",
          eggId: "pong_1972",
          flavorText:
            "🏓 *哔哔* - 致敬 1972 年雅达利推出的《Pong》，电子游戏史上第一个商业奇迹。",
        },
      },
    ],
  },
  {
    id: "neon_arcade_hall",
    name: "主厅",
    background: "/assets/images/places/neon_arcade/hall.svg",
    darkMode: "dark",
    ambientMusic: "ambient_8bit_loop",
    hotspots: [
      {
        id: "hs_first_cabinet",
        x: 30,
        y: 50,
        width: 12,
        height: 24,
        label: "投币街机",
        trigger: {
          kind: "puzzle",
          puzzleId: "puzzle_atari_secret_room",
          onSolve: {
            itemId: "key_fragment_atari",
            setsFlag: "met_first_master",
            storyProgress: 25,
          },
        },
      },
      {
        id: "hs_cabinet_centipede",
        x: 50,
        y: 50,
        width: 12,
        height: 24,
        label: "《小蜈蚣》街机",
        trigger: {
          kind: "examine",
          text:
            "这台机器的屏幕还亮着，上面有一段不断循环的 8-bit 旋律。",
        },
      },
      {
        id: "hs_cabinet_ms_pacMAN",
        x: 70,
        y: 50,
        width: 12,
        height: 24,
        label: "《吃豆人》",
        trigger: {
          kind: "easter_egg",
          eggId: "ms_pac_man",
          flavorText:
            "👻 不要被幽灵追捕。致敬 1982 年由南梦宫制作的经典街机游戏《Ms. Pac-Man》。",
        },
      },
      {
        id: "hs_cabinet_donkey_kong",
        x: 18,
        y: 48,
        width: 10,
        height: 22,
        label: "大金刚街机",
        trigger: {
          kind: "easter_egg",
          eggId: "donkey_kong_1981",
          flavorText:
            "倾斜的脚手架和滚动的木桶仍在屏幕上闪烁。致敬 1981 年的《Donkey Kong》。",
        },
      },
      {
        id: "hs_cabinet_galaga",
        x: 62,
        y: 22,
        width: 10,
        height: 18,
        label: "Galaga 机台",
        trigger: {
          kind: "easter_egg",
          eggId: "galaga_1981",
          flavorText:
            "屏幕里的外星编队像霓虹蜂群一样俯冲。致敬 Namco 1981 年的《Galaga》。",
        },
      },
      {
        id: "hs_soda_machine",
        x: 9,
        y: 66,
        width: 8,
        height: 16,
        label: "汽水机",
        trigger: {
          kind: "examine",
          text: "汽水机只剩一罐发光的橙味汽水。投币口旁刻着一句话：别急着通关，先看看墙角。",
        },
      },
      {
        id: "hs_old_comic",
        x: 84,
        y: 71,
        width: 10,
        height: 8,
        label: "旧漫画",
        trigger: {
          kind: "easter_egg",
          eggId: "superman_1938",
          flavorText:
            "一本卷边的旧漫画摊在沙发上，封面只剩红蓝两色。致敬 1938 年的《Action Comics #1》。",
        },
      },
      {
        id: "hs_back_room",
        x: 95,
        y: 50,
        width: 8,
        height: 30,
        label: "???",
        trigger: {
          kind: "transition",
          targetSceneId: "neon_arcade_hidden_room",
          prompt:
            "铜钥匙碎片贴近门缝时发出一声轻响。隐藏房间的锁芯终于转动了。",
          requires: {
            items: ["key_fragment_atari"],
            message:
              "门上的读卡器只闪了一下红光。它在等待一枚来自 Adventure 街机的钥匙碎片。",
          },
        },
      },
    ],
  },
  {
    id: "neon_arcade_hidden_room",
    name: "隐藏房间",
    background: "/assets/images/places/neon_arcade/hidden-room.svg",
    darkMode: "dark",
    ambientMusic: "ambient_secret_room",
    hotspots: [
      {
        id: "hs_reverie_terminal",
        x: 48,
        y: 43,
        width: 18,
        height: 16,
        label: "旧终端",
        trigger: {
          kind: "examine",
          text:
            "绿色字符在 CRT 上缓慢浮现：'第一把钥匙不是奖品，它是坐标。去听那张永远不会播完的黑胶。—— A.N. Reverie'",
        },
      },
      {
        id: "hs_atari_console",
        x: 28,
        y: 62,
        width: 16,
        height: 12,
        label: "Atari 主机",
        trigger: {
          kind: "easter_egg",
          eggId: "atari_2600_console",
          flavorText:
            "木纹面板、黑色摇杆、红色按钮。致敬 Atari 2600，这台机器把客厅变成了宇宙入口。",
        },
      },
      {
        id: "hs_reverie_note",
        x: 66,
        y: 59,
        width: 16,
        height: 12,
        label: "手写笔记",
        trigger: {
          kind: "item",
          itemId: "note_reverie_first_signal",
          oneTime: true,
        },
      },
      {
        id: "hs_system_map",
        x: 73,
        y: 32,
        width: 12,
        height: 16,
        label: "系统地图",
        trigger: {
          kind: "puzzle",
          puzzleId: "puzzle_arcade_system_map",
          onSolve: {
            itemId: "note_arcade_system_map",
            setsFlag: "decoded_arcade_map",
            storyProgress: 32,
          },
        },
      },
      {
        id: "hs_tetris_poster",
        x: 16,
        y: 27,
        width: 10,
        height: 13,
        label: "方块海报",
        trigger: {
          kind: "easter_egg",
          eggId: "tetris_1984",
          flavorText:
            "海报上的几何方块刚好缺了一格长条。致敬 1984 年诞生的《Tetris》。",
        },
      },
      {
        id: "hs_hidden_room_exit",
        x: 5,
        y: 48,
        width: 8,
        height: 26,
        label: "回到主厅",
        trigger: {
          kind: "transition",
          targetSceneId: "neon_arcade_hall",
          prompt: "主厅的霓虹光从门缝里漏进来。",
        },
      },
    ],
  },
];

// 谜题数据 - 第一个谜题对应"逆向思维"
export const firstPuzzle: PuzzleSequence = {
  id: "puzzle_atari_secret_room",
  type: "reverse" as const,
  name: "雅达利：隐藏的房间",
  hint: "游戏史上第一个 Easter Egg 藏在反向之中。Warren Robinett 把自己的名字藏在《Adventure》（雅达利 2600, 1980）的隐藏房间中。",
  hints: [
    "提示 1: 尝试逆向操作。",
    "提示 2: 真正的解法不需要赢，只需要进入特定的房间。",
    "提示 3: 游戏作者 Warren Robinett 希望玩家知道这是他自己做的 —— 当游戏是 'Atari Adventure' 时，唯一能让其被记住的方法是留下名字。",
  ],
  maxHints: 3,
  reward: {
    itemId: "key_fragment_atari",
    storyProgress: 25,
    setsFlag: "met_first_master",
  },
  easterEgg: "robinett_1979",
  // 谜题具体配置由谜题模板填充
  sequence: ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT"],
  items: [
    { id: "arrow_up", display: "↑", emoji: "⬆️" },
    { id: "arrow_down", display: "↓", emoji: "⬇️" },
    { id: "arrow_left", display: "←", emoji: "⬅️" },
    { id: "arrow_right", display: "→", emoji: "➡️" },
  ],
  reverseExecution: true,
};

export const arcadeSystemMapPuzzle: PuzzleCode = {
  id: "puzzle_arcade_system_map",
  type: "wisdom",
  name: "系统地图：第一坐标",
  hint: "墙上的系统地图被一层绿色光标锁住。旁边写着：'不是钥匙打开地图，而是来源打开地图。'",
  hints: [
    "提示 1: 看看第一枚钥匙来自哪里。",
    "提示 2: 不是 Warren Robinett 的名字，而是那台机器的姓氏。",
    "提示 3: 输入 ATARI。",
  ],
  maxHints: 3,
  inputLength: 12,
  correctAnswer: "ATARI",
  charset: "A-Z",
  placeholder: "SOURCE",
  reward: {
    itemId: "note_arcade_system_map",
    storyProgress: 32,
    setsFlag: "decoded_arcade_map",
  },
  successText:
    "系统地图亮起一条从街机厅通往唱片室的紫色路线：'第二段讯号不是下一站，而是校准器。'",
};

// 第一颗星球的钥匙碎片（奖杯）
export const firstKeyFragment: Item = {
  id: "key_fragment_atari",
  name: "Atari 钥匙碎片",
  description: "游戏史上第一颗真正的彩蛋 - 来自 Warren Robinett 的《Adventure》",
  icon: "🎮",
  isKeyFragment: true,
  lore:
    "这枚碎片象征着'逆向思维'。Warren Robinett 在公司不让他署名的时代，用隐藏的名字赢得了永恒的纪念 — 这是游戏作者对游戏玩家的第一封情书。",
};

export const firstSignalNote: Item = {
  id: "note_reverie_first_signal",
  name: "Reverie 的第一封便签",
  description:
    "一张贴在 CRT 旁边的便签：'你已经学会倒着读历史。下一步，去听噪声里缺失的那一拍。'",
  icon: "📝",
  lore:
    "A.N. Reverie 没有直接告诉玩家答案。他只留下足够多的方向，让愿意继续探索的人自己走到下一颗星球。",
};

export const arcadeSystemMapNote: Item = {
  id: "note_arcade_system_map",
  name: "街机厅系统地图",
  description:
    "一张从隐藏房间投影出的线路图：铜钥匙是坐标，玉钥匙是校准器，第三段讯号会出现在被剪掉的影像里。",
  icon: "🗺️",
  lore:
    "Reverie 把每把钥匙都当作一种读法，而不是单纯的奖杯。玩家需要把钥匙碎片当成语言来理解。",
};
