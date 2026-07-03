# QuestVerse - 视觉风格指南

> 致敬《头号玩家》双色系美学 + 80 年代街机像素风

---

## 1. 调色板 (Color Palette)

### 1.1 主题色

| 名称 | 颜色 | 用途 | 颜色码 |
|---|---|---|---|
| **霓虹粉** (Neon Magenta) | 🟣 | 主色、按钮、CTA | `#FF2E88` |
| **电光青** (Electric Cyan) | 🔵 | 链接、激活、能量 | `#00FFF5` |
| **紫罗兰** (Violet) | 🟪 | 神秘/魔法元素 | `#B14DFF` |
| **暖黄** (Warm Yellow) | 🟡 | 奖励、关键物品 | `#F9E547` |
| **霓虹绿** (Neon Green) | 🟢 | 成功、生命值 | `#39FF14` |

### 1.2 背景色

| 名称 | 颜色码 | 用途 |
|---|---|---|
| **深空蓝** (Deep Space) | `#0A0A1A` | 页面背景 |
| **午夜紫** (Midnight) | `#0F0F23` | 卡片、面板 |
| **暗影** (Shadow) | `#050511` | 凹陷区、阴影 |

### 1.3 文字色

| 名称 | 颜色码 | 用途 |
|---|---|---|
| **主文** | `#E0E0FF` | 正文 |
| **次文** | `#8888AA` | 提示、说明 |
| **暗文** | `#444466` | 禁用/已读 |

### 1.4 颜色使用规则

- ✅ 主色用于**主操作按钮**（最多一个屏幕一个）
- ✅ 奖励色**仅**用于关键物品、谜题通过、彩蛋发现
- ✅ 错误/警告用霓虹粉（不要用红色——这违背"霓虹"主题）
- ❌ 不混用太多霓虹色——一个屏幕最多 3 种霓虹色
- ❌ 不用纯黑——背景永远略带蓝调

---

## 2. 字体 (Typography)

### 2.1 字体族

| 用途 | 字体 | 备注 |
|---|---|---|
| **标题 / 像素风文字** | Press Start 2P | 来自 Google Fonts |
| **正文 / UI 文字** | Geist Sans (Next.js 默认) | 现代化无衬线 |

### 2.2 文字大小

| 用途 | 大小 | 备注 |
|---|---|---|
| **超大标题** | 48-72px | 主页 Hero、星球名 |
| **大标题** | 24-32px | 页面 H1 |
| **小标题** | 14-18px | 卡片标题 |
| **正文** | 14-16px | 默认 |
| **小字** | 10-12px | 提示、辅助信息 |
| **极小字** | 8-9px | 像素字体专用 |

### 2.3 文字效果

| 效果 | 用途 | CSS |
|---|---|---|
| **Neon Glow** | 像素大标题 | `text-shadow: 0 0 4px / 0 0 11px / 0 0 19px currentColor` |
| **像素阴影** | 复古 UI | `text-shadow: 2px 2px 0 #000` |
| **CRT 模糊** | 文字加载 | `filter: blur(0.5px) opacity(0.95)` |

---

## 3. UI 组件 (UI Components)

### 3.1 按钮

#### 主按钮（CTA）
```html
<button class="
  border-2 border-[var(--color-neon-cyan)]
  bg-transparent
  px-8 py-4
  font-pixel text-sm text-[var(--color-neon-cyan)]
  transition-all
  hover:bg-[var(--color-neon-cyan)]
  hover:text-[var(--color-deep-bg)]
  hover:shadow-[0_0_30px_var(--color-neon-cyan)]
">
  ▶ 进入游戏
</button>
```

#### 次按钮
```html
<button class="
  border-2 border-[var(--color-text-muted)]
  bg-transparent
  px-6 py-2
  font-pixel text-xs
  text-[var(--color-text-secondary)]
  hover:border-[var(--color-neon-cyan)]
  hover:text-[var(--color-neon-cyan)]
">
  取消
</button>
```

#### 危险按钮（删除/重置）
```html
<button class="
  border-2 border-[var(--color-neon-magenta)]
  bg-[var(--color-neon-magenta)]/10
  text-[var(--color-neon-magenta)]
  hover:bg-[var(--color-neon-magenta)]
  hover:text-black
">
  重置游戏
</button>
```

### 3.2 卡片 / 弹窗

```
+-----------------------------+
|  ✕                          |  <- 关闭按钮
|                             |
|  [内容]                     |
|                             |
|  [主按钮] [次按钮]          |
+-----------------------------+
```

- 边框：`border-2 border-[var(--color-neon-cyan)]`
- 背景：`bg-[var(--color-midnight)]/95`
- 阴影：`shadow-[0_0_50px_rgba(0,255,245,0.3)]`
- 圆角：`rounded-lg` (8px)
- 模糊背景：`backdrop-blur-sm`

### 3.3 输入框

```html
<input class="
  border border-[var(--color-text-muted)]
  bg-[var(--color-deep-bg)]
  px-3 py-2
  font-pixel text-xs
  text-[var(--color-text-primary)]
  focus:border-[var(--color-neon-cyan)]
  focus:outline-none
  focus:shadow-[0_0_10px_var(--color-neon-cyan)]
" />
```

---

## 4. 动画 (Animations)

使用 **Framer Motion** 实现。**CSS Keyframes** 用于简单重复动画。

### 4.1 过渡时间

| 场景 | 时长 | 缓动 |
|---|---|---|
| 弹窗出现 | 200ms | ease-out |
| 弹窗消失 | 150ms | ease-in |
| 按钮 hover | 100ms | linear |
| 场景切换 | 400ms | ease-in-out |
| 彩蛋提示 | 800ms | spring |

### 4.2 关键动效

- **霓虹闪烁**: `animate-pulse` 配合 currentColor
- **像素扫描**: 0.3s 横向 1px 移动
- **奖励弹出**: scale 0.9 → 1.0 + rotate 5deg
- **谜题提示**: 抖动 5px 来回三次

---

## 5. 视觉元素 (Visual Elements)

### 5.1 图标

- **优先使用 Emoji** — 跨平台、零成本、像素感
- **次选** 简单的 SVG 线性图标
- **不**使用写实图标

### 5.2 资产

| 类型 | 来源 | 风格 |
|---|---|---|
| 像素背景 | Kenney.nl, OpenGameArt | 8-bit 室内/室外 |
| 像素人物 | Kenney.nl, itch.io CC0 | 顶视图或立绘 |
| 音乐 | FreeMusicArchive, OpenGameArt | chiptune / synthwave |
| 音效 | freesound.org | 8-bit 提示音 |

### 5.3 字体许可

- **Press Start 2P**: SIL Open Font License, 100% 免费商用

---

## 6. 布局 (Layout)

### 6.1 网格

- 主容器 `max-w-6xl mx-auto`
- 居中、单栏、移动友好

### 6.2 留白

- **8px** 基础单位（所有边距、内边距必须是 4 的倍数）
- 段落间距 24-32px

### 6.3 场景视图 (Scene View)

```
┌──────────────────────────────────────┐
│  ▸ 场景名            scene_id        │  <- 顶部信息栏
│                                      │
│                                      │
│         (场景背景图)                  │
│         (Hotspots 在热点层)           │
│                                      │
│                                      │
│  🔑 1/3   🥚 12   5m                 │  <- 底部 HUD
└──────────────────────────────────────┘
```

---

## 7. 可访问性 (Accessibility)

- ✅ 文字与背景对比度 ≥ 4.5:1
- ✅ 所有交互元素有 `aria-label`
- ✅ 支持键盘导航
- ✅ 字体大小可缩放
- ⚠️ 霓虹效果对光敏感玩家可能不适——提供"减弱动画"选项

---

## 8. 暗色 vs 亮色

**仅支持暗色**。这是 QuestVerse 的核心美学方向。
亮色模式不符合世界观（暗调霓虹 = 故事氛围）。

如未来需要，可在主题色变量层面实现，但优先级低。

---

## 9. 实施示例

### 主页示例
```html
<header class="text-center">
  <h1 class="font-pixel text-5xl text-[var(--color-neon-magenta)] neon-glow">
    QUEST<span class="text-[var(--color-neon-cyan)]">VERSE</span>
  </h1>
  <p class="mt-4 font-pixel text-xs text-[var(--color-text-secondary)]">
    一个关于彩蛋、记忆与未知邀请的解谜冒险
  </p>
</header>
```

### 谜题卡片示例
```html
<div class="
  rounded border-2 border-[var(--color-neon-cyan)]
  bg-[var(--color-midnight)]/95 p-6
  shadow-[0_0_50px_rgba(0,255,245,0.3)]
">
  <h2 class="font-pixel text-base text-[var(--color-neon-yellow)] neon-glow">
    雅达利：隐藏的房间
  </h2>
  <p class="mt-3 text-sm text-[var(--color-text-secondary)]">
    谜题提示文本...
  </p>
</div>
```

---

## 10. 工具与资源

- **色卡工具**: coolors.co
- **像素画工具**: Aseprite（付费）, Piskelapp.com（免费在线）
- **字体工具**: fonts.google.com
- **图标**: emoji 标准 + 简单的 lucide / heroicons
- **截图参考**: opensgameart.org 的 8-bit 街机厅素材

---

> **更新日期**: 2026-07-02  
> **下次审查**: Phase 1 完成后
