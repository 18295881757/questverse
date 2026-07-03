import { NextResponse } from "next/server";
import { puzzlesById } from "@/lib/content";

/**
 * GET /api/puzzles - 获取所有谜题元数据
 *
 * Phase 1: 直接从 content 库序列化
 * Phase 2: 增加权限过滤、玩家进度覆盖
 */

export async function GET() {
  const puzzles = Array.from(puzzlesById.values()).map((p) => ({
    id: p.id,
    type: p.type,
    name: p.name,
    hint: p.hint,
    maxHints: p.maxHints,
  }));
  return NextResponse.json({ success: true, data: puzzles });
}
