import type {
  Item,
  Planet,
  PuzzleCode,
  PuzzleHiddenObject,
  PuzzleLogic,
  Scene,
} from "@/types/scene";

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
        id: "hs_reversed_label",
        x: 57,
        y: 70,
        width: 12,
        height: 8,
        label: "倒放标签",
        trigger: {
          kind: "puzzle",
          puzzleId: "puzzle_reversed_label",
          onSolve: {
            itemId: "note_reverie_rewind_label",
            setsFlag: "decoded_rewind_label",
            storyProgress: 52,
          },
        },
      },
      {
        id: "hs_record_sorter",
        x: 67,
        y: 60,
        width: 14,
        height: 11,
        label: "排序台",
        trigger: {
          kind: "puzzle",
          puzzleId: "puzzle_record_release_order",
          onSolve: {
            itemId: "note_vinyl_calibration_disc",
            setsFlag: "sorted_vinyl_archive",
            storyProgress: 58,
          },
        },
      },
      {
        id: "hs_echo7_receiver",
        x: 31,
        y: 69,
        width: 10,
        height: 9,
        label: "Echo-7 接收器",
        trigger: {
          kind: "examine",
          text: "接收器里的合成声断断续续：'我是 Echo-7。别把噪声当敌人。先确认顺序，再确认恐惧。Joy Division 在前，Kraftwerk 的秩序在后，Reverie 只借用它们之间的空槽。'",
        },
      },
      {
        id: "hs_tape_archive_door",
        x: 88,
        y: 34,
        width: 8,
        height: 24,
        label: "磁带门",
        trigger: {
          kind: "transition",
          targetSceneId: "vinyl_vault_tape_archive",
          prompt:
            "倒放标签贴近门上的读头时，磁带轮开始反向转动。门缝里漏出一帧被剪掉的影像。",
          requires: {
            flags: ["decoded_rewind_label", "sorted_vinyl_archive"],
            message:
              "门上的读头吐出两段噪声：DNIWER / ORDER。你需要先解开倒放标签，并把唱片档案恢复到正确顺序。",
          },
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
      {
        id: "hs_signal_drawer",
        x: 82,
        y: 65,
        width: 10,
        height: 8,
        label: "声纹抽屉",
        trigger: {
          kind: "item",
          itemId: "note_reverie_second_signal",
          oneTime: true,
          requires: {
            items: ["key_fragment_vinyl"],
            message:
              "抽屉里只有沙沙作响的静电。三段频率重合之后，它也许会吐出真正的声纹。",
          },
        },
      },
    ],
  },
  {
    id: "vinyl_vault_tape_archive",
    name: "磁带档案室",
    background: "/assets/images/places/vinyl_vault/tape-archive.svg",
    darkMode: "night",
    ambientMusic: "ambient_tape_archive",
    hotspots: [
      {
        id: "hs_cut_frame_case",
        x: 47,
        y: 48,
        width: 18,
        height: 18,
        label: "剪掉的帧",
        trigger: {
          kind: "item",
          itemId: "note_reverie_cut_frame",
          oneTime: true,
          requires: {
            items: ["note_reverie_rewind_label"],
            message:
              "胶片盒被一圈倒放磁带缠住。你需要先理解标签上的方向。",
          },
        },
      },
      {
        id: "hs_vhs_wall",
        x: 20,
        y: 42,
        width: 14,
        height: 26,
        label: "录像带墙",
        trigger: {
          kind: "easter_egg",
          eggId: "vhs_tracking_noise",
          flavorText:
            "一排贴着手写标签的 VHS 磁带正在轻微抖动。致敬录像带追踪噪声、旧电视雪花点和那些只能倒回去看的家庭影像。",
        },
      },
      {
        id: "hs_archive_monitor",
        x: 70,
        y: 45,
        width: 14,
        height: 18,
        label: "监看屏",
        trigger: {
          kind: "examine",
          text:
            "监看屏停在一帧黑场，只有时间码在跳动：00:03:17:REVERIE。像是在等待第三颗钥匙的影像源。",
        },
      },
      {
        id: "hs_archive_exit",
        x: 6,
        y: 38,
        width: 8,
        height: 28,
        label: "回试听室",
        trigger: {
          kind: "transition",
          targetSceneId: "vinyl_vault_listening_room",
          prompt: "回到唱针和噪声仍在循环的试听室。",
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

export const reversedLabelPuzzle: PuzzleCode = {
  id: "puzzle_reversed_label",
  type: "wisdom",
  name: "倒放标签",
  hint: "标签上的字母像被磁带机咬过：DNIWER。你需要按它真正播放的方向读出来。",
  hints: [
    "提示 1: 这间房间一直在谈倒放。",
    "提示 2: DNIWER 不是乱码，它只是方向错了。",
    "提示 3: 输入 REWIND。",
  ],
  maxHints: 3,
  inputLength: 12,
  correctAnswer: "REWIND",
  charset: "A-Z",
  placeholder: "DECODE LABEL",
  reward: {
    itemId: "note_reverie_rewind_label",
    storyProgress: 52,
    setsFlag: "decoded_rewind_label",
  },
  successText:
    "标签背面的磁粉浮出一句话：'下一段影像要先倒回去看，真正缺失的不是画面，是剪辑点。'",
};

export const recordReleaseOrderPuzzle: PuzzleLogic = {
  id: "puzzle_record_release_order",
  type: "wisdom",
  name: "唱片排序：噪声之前",
  hint: "排序台上放着四张缺失年份的唱片。Echo-7 说：'别按你喜欢的顺序听，按它们成为记忆的顺序听。'",
  hints: [
    "Echo-7: 先看年份，不要看颜色。",
    "Echo-7: Joy Division 的波形先出现，Kraftwerk 的机器节拍随后校准房间。",
    "Echo-7: 正确顺序是 1977 → 1978 → 1979 → 1981。",
  ],
  maxHints: 3,
  reward: {
    itemId: "note_vinyl_calibration_disc",
    storyProgress: 58,
    setsFlag: "sorted_vinyl_archive",
  },
  puzzleData: {
    logicKind: "ordering",
    instructions:
      "按发行年份从早到晚排列这些实体媒介。排序错误不会惩罚你，但 Echo-7 会指出房间哪里还没有对齐。",
    choices: [
      {
        id: "unknown_pleasures",
        label: "Unknown Pleasures / 1979",
        detail: "黑底白线的脉冲波形，门口海报也在重复这条线。",
      },
      {
        id: "trans_europe_express",
        label: "Trans-Europe Express / 1977",
        detail: "机器节拍像轨道一样铺开，是这间房最早的秩序信号。",
      },
      {
        id: "computer_world",
        label: "Computer World / 1981",
        detail: "计算机合唱把档案变成一张会自我索引的网。",
      },
      {
        id: "the_man_machine",
        label: "The Man-Machine / 1978",
        detail: "红黑构图像校准用的测试卡，夹在机器和人之间。",
      },
    ],
    correctOrder: [
      "trans_europe_express",
      "the_man_machine",
      "unknown_pleasures",
      "computer_world",
    ],
    failureText:
      "Echo-7: '顺序错了。你不是在排喜好榜，你是在复原一段时间线。把最早的机器节拍放到最前面。'",
    successText:
      "四张唱片依次落针，空槽噪声被压成一条稳定的参考线。排序台弹出一枚薄薄的校准片。",
  },
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

export const secondSignalNote: Item = {
  id: "note_reverie_second_signal",
  name: "Reverie 的第二段声纹",
  description:
    "一张透明胶片，上面刻着三段重合的波形：'不是所有恐惧都需要被战胜，有些只需要被完整听见。'",
  icon: "〰️",
  lore:
    "这段声纹把玉钥匙指向下一段旅程：影像、倒放和那些被剪掉的镜头。",
};

export const rewindLabelNote: Item = {
  id: "note_reverie_rewind_label",
  name: "Reverie 的倒放标签",
  description:
    "一枚从磁带盒背面揭下的标签：'下一段影像要先倒回去看，真正缺失的不是画面，是剪辑点。'",
  icon: "⏪",
  lore:
    "这条线索把黑胶唱片室和未来的影像星球接起来：不是所有答案都藏在当前帧，有些藏在剪辑顺序里。",
};

export const vinylCalibrationNote: Item = {
  id: "note_vinyl_calibration_disc",
  name: "Echo-7 的校准片",
  description:
    "一枚薄薄的透明唱片，边缘刻着：'顺序不是答案本身，顺序让答案可以被听见。'",
  icon: "◎",
  lore:
    "Echo-7 用唱片发行年帮玩家理解这颗星球的真正规则：面对噪声之前，先让时间线重新站稳。",
};

export const cutFrameNote: Item = {
  id: "note_reverie_cut_frame",
  name: "Reverie 的剪帧索引",
  description:
    "一张夹在胶片盒里的索引卡：'第三把钥匙不在完整影片里，它在被剪掉的 3 分 17 秒。'",
  icon: "🎞️",
  lore:
    "这是通往未来影像星球的第一个硬线索。Reverie 暗示玩家要寻找不在正片里的内容：删减、倒放、时间码和剪辑点。",
};
