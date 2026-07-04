# QuestVerse 项目路线图

## 阶段总览

| 阶段 | 时间 | 目标 | 关键交付物 |
|---|---|---|---|
| Phase 1 | M1-M2 | 概念设计 | GDD、风格指南、两颗星球设计、数据模型 |
| Phase 2 | M3-M4 | MVP 原型 | 第一颗星球可玩 demo |
| Phase 3 | M5-M6 | 核心游戏 | 三类谜题 + 三颗星球 + 完整叙事 |
| Phase 4 | M7+ | 扩展 | UGC、社交、Steam 发布 |

## Phase 1 任务清单 (M1-M2)

### 已完成
- [x] Next.js + TypeScript + Tailwind 项目骨架
- [x] 核心类型系统 (src/types/scene.ts)
- [x] Zustand 游戏状态管理
- [x] GDD v0.1
- [x] 视觉风格指南
- [x] 第一颗星球（霓虹街机厅）详细设计
- [x] 第一颗星球的示例关卡数据
- [x] 主页、布局、场景视图、热点交互组件
- [x] API Routes (progress / puzzles / easter-eggs)
- [x] 项目路线图

### 待办
- [ ] 3 张低保真线框图（主页、场景视图、谜题弹窗）
- [ ] 1 个像素风招牌 + 1 个街机厅外景（用 Piskel 画或从 OpenGameArt 找）
- [x] 实际运行 `npm install` + `npm run dev` 验证
- [x] 第二颗星球（黑胶唱片室）草案
- [x] 第二类谜题 (courage/hidden_object) 设计与基础 UI

## Phase 1 完成标志

文档包完整：GDD + 风格指南 + 两颗星球设计 + 三类谜题定义  
代码可运行：`npm install` + `npm run dev` 不报错  
测试场景可访问：`/play/neon_arcade/neon_arcade_entry` 可点击

## Phase 2 任务清单 (M3-M4)

### 当前切片：第一颗星球可玩闭环

- [x] 解开铜钥匙后开放 `neon_arcade_hidden_room`
- [x] 隐藏房间新增 A.N. Reverie 终端、Atari 主机彩蛋、手写便签
- [x] 场景跳转支持 `requires.items` / `requires.flags` 条件
- [x] 记忆档案页接入 LocalStorage，展示故事进度、钥匙、笔记和彩蛋
- [x] HUD 游玩时间开始递增并以 `MM:SS` 展示
- [x] 第二星球试听室新增玉钥匙后的声纹抽屉线索
- [x] 第二星球基础玉钥匙闭环：唱机隐藏物谜题 → `key_fragment_vinyl` → 声纹抽屉 → `note_reverie_second_signal`
- [x] 通用智慧/密码谜题 UI (`PuzzleCode`)
- [x] 新增 2 条非钥匙线索链：隐藏房间系统地图、试听室倒放标签
- [x] 第二星球新增磁带档案室：`decoded_rewind_label` → `vinyl_vault_tape_archive` → `note_reverie_cut_frame`

### 待办

- [ ] 第一颗星球扩展到 5+ 个实际可用 hotspots
- [ ] 第二星球扩展为 15+ 分钟完整关卡（唱片排序、失败反馈、角色化提示）
- [ ] 补充 30-45 分钟试玩节奏文档
- [ ] 移动端 375x667 专项复测
- [ ] 键盘导航可访问性复测
- [ ] 发布公开 demo URL

## 关键里程碑

| 里程碑 | 日期 | 标志 |
|---|---|---|
| M1.0 | 2026-08-01 | Phase 1 完成 |
| M2.0 | 2026-09-01 | MVP Demo 上线 |
| M3.0 | 2026-10-15 | 两颗星球完整 |
| M4.0 | 2026-12-15 | 完整游戏发布 |

## 关键决策记录

| 决策 | 原因 | 时间 |
|---|---|---|
| 数据驱动 vs 硬编码 | 独立编辑关卡、不写代码 | 2026-07-02 |
| DOM + CSS 渲染（不 first） | 简单、可维护、够用 | 2026-07-02 |
| Zustand + LocalStorage | 比 Redux 简单 | 2026-07-02 |
| 像素风 8-bit 起步 | 美术成本低、契合主题 | 2026-07-02 |
| 暗色 only | 美学统一 | 2026-07-02 |

## 风险与缓解

| 风险 | 缓解 |
|---|---|
| 一个人无法坚持 | 短周期可演示目标 + 公开进度 |
| 谜题设计灵感枯竭 | 5 人测试 + 3 轮迭代 |
| 资源（图片/音乐）不足 | 全部用 CC0 / 开源 |
| 玩家少 | 注重"彩蛋分享"传播性 |

## 不做的事 (Out of Scope)

- VR / AR
- 多人实时联机
- 复杂 3D 引擎
- 用户账号系统（Phase 1-3）
- 移动端原生 app
- 真实支付

> 最后更新: 2026-07-03
