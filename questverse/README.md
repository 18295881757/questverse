# QuestVerse

> A web-based treasure-hunting puzzle game inspired by Ready Player One

> 一款受《头号玩家》启发的浏览器寻宝解谜游戏

## 项目状态

🚧 **Phase 2: MVP 原型** — 开发中

## 设计灵感

基于 [《头号玩家》深度调研报告](../头号玩家-设计思想与场景分析报告.md) 的核心要素：

- **核心循环**: 探索 → 发现线索 → 解开谜题 → 获得钥匙碎片 → 推进剧情
- **三把钥匙叙事**: 逆向思维 / 勇气 / 智慧
- **彩蛋文化**: 致敬 80-00 年代游戏/动漫/电影文化
- **视觉风格**: 赛博朋克 + 像素复古 + 霓虹色

## 技术栈

- **Next.js 15** (App Router) — 全栈框架
- **TypeScript** — 类型安全
- **Tailwind CSS v4** — 样式
- **Zustand** — 游戏状态管理
- **Framer Motion** — 动画
- **数据驱动**: 关卡用 JSON/TS 声明，不写代码

## 目录结构

```
questverse/
├── app/                      # Next.js 路由
│   ├── page.tsx              # 游戏主页
│   ├── play/                 # 游戏内路由
│   │   ├── [planetId]/       # 星球
│   │   └── archive/          # 玩家的记忆碎片
│   └── api/                  # API routes
├── src/
│   ├── lib/
│   │   ├── game-engine/      # 游戏引擎核心
│   │   └── content/          # 关卡数据 (JSON/TS)
│   ├── components/
│   │   ├── game/             # 游戏内组件
│   │   └── ui/               # 通用 UI
│   ├── types/                # 类型定义
│   └── store/                # Zustand stores
├── public/                   # 静态资源
└── docs/                     # 设计文档
    ├── GDD.md                # 游戏设计文档
    ├── style-guide.md        # 视觉风格指南
    └── world-design/         # 世界观设计
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run typecheck

# Lint
npm run lint

# 构建生产
npm run build
```

## 路线图

| 阶段 | 时间 | 目标 |
|---|---|---|
| 1 | M1-M2 | 概念设计（本文档、风格指南、世界观） |
| 2 | M3-M4 | MVP 原型（第一颗星球 + 第一类谜题） |
| 3 | M5-M6 | 核心游戏（完整三关卡 + 多星球） |
| 4 | M7+ | 扩展与社交功能 |

详细规划见 [docs/ROADMAP.md](docs/ROADMAP.md)。

## 许可

本项目为个人创作项目。
