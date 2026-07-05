import { notFound } from "next/navigation";
import { NeonArcadeGestureWorld } from "@/components/game/NeonArcadeGestureWorld";
import { SceneView } from "@/components/game/SceneView";
import { getPlanet, getScene } from "@/lib/content";

/**
 * 玩家进入具体场景
 * Route: /play/[planetId]/[sceneId]
 *
 * 在 Server Component 端进行权限校验（无 game store）
 * 客户端的 SceneView 内部会处理存档
 */
export default async function PlayScenePage({
  params,
}: {
  params: Promise<{ planetId: string; sceneId: string }>;
}) {
  const { planetId, sceneId } = await params;

  const planet = getPlanet(planetId);
  const scene = getScene(sceneId);

  if (!planet || !scene) {
    notFound();
  }

  if (planetId === "neon_arcade") {
    return <NeonArcadeGestureWorld planetId={planetId} sceneId={sceneId} />;
  }

  return <SceneView planetId={planetId} sceneId={sceneId} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ planetId: string; sceneId: string }>;
}) {
  const { sceneId } = await params;
  const scene = getScene(sceneId);
  return {
    title: scene ? `${scene.name} - QuestVerse` : "QuestVerse",
  };
}
