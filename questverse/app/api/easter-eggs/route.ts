import { NextResponse } from "next/server";

/**
 * GET /api/easter-eggs - 获取玩家已发现的彩蛋
 * POST /api/easter-eggs - 记录新彩蛋
 *
 * Phase 1: 客户端 LocalStorage 负责
 * Phase 2: 服务端持久化
 */

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
    message: "Phase 1: 客户端 LocalStorage",
  });
}

export async function POST(request: Request) {
  try {
    const { eggId } = (await request.json()) as { eggId: string };
    return NextResponse.json({ success: true, eggId });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 400 }
    );
  }
}
