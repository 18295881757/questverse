import { NextResponse } from "next/server";
import type { PlayerSave } from "@/types/scene";

/**
 * GET /api/progress - 获取玩家存档
 * POST /api/progress - 保存玩家存档
 *
 * Phase 1: 占位实现 - 实际开发会用 SQLite + Drizzle
 * 客户端当前用 LocalStorage 即可工作
 */

const MOCK_SAVES = new Map<string, PlayerSave>();

export async function GET() {
  // Phase 2: 从数据库读取
  return NextResponse.json({
    success: true,
    data: null,
    message: "Phase 1: 本地存档中（LocalStorage）",
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PlayerSave;
    // Phase 2: 写入数据库
    MOCK_SAVES.set(body.currentSceneId, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 400 }
    );
  }
}
