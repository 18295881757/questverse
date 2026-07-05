"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { HandLandmarker } from "@mediapipe/tasks-vision";
import { scenesNeonArcade } from "@/lib/content/planets/neon-arcade";
import { useGameStore } from "@/lib/game-engine/index";
import { cn } from "@/lib/utils/cn";
import type { Hotspot, Scene } from "@/types/scene";
import { EasterEggToast } from "./EasterEggToast";
import { HotspotInteraction } from "./HotspotInteraction";
import { PuzzleModal } from "./PuzzleModal";

type GestureStatus = "idle" | "requesting" | "ready" | "no-hand" | "error";

type WorldNode = {
  id: string;
  scene: Scene;
  hotspot: Hotspot;
  position: THREE.Vector3;
  color: string;
};

type NodeMesh = THREE.Mesh & { userData: { node: WorldNode } };

type HandPoint = { x: number; y: number; z?: number };

const triggerColors: Record<Hotspot["trigger"]["kind"], string> = {
  examine: "#00fff5",
  dialog: "#b14dff",
  puzzle: "#ff2e88",
  item: "#f9e547",
  transition: "#39ff14",
  easter_egg: "#ffffff",
};

function makeWorldNodes() {
  const tierConfig = [
    { radius: 4.2, y: -2.4, twist: 0 },
    { radius: 3.0, y: -0.1, twist: 0.62 },
    { radius: 1.85, y: 2.05, twist: 1.2 },
  ];

  return scenesNeonArcade.flatMap((scene, sceneIndex) => {
    const tier = tierConfig[sceneIndex] ?? tierConfig[tierConfig.length - 1];
    return scene.hotspots.map((hotspot, hotspotIndex) => {
      const angle =
        (hotspotIndex / Math.max(1, scene.hotspots.length)) * Math.PI * 2 +
        tier.twist;
      const yOffset = Math.sin(angle * 1.5) * 0.22;

      return {
        id: `${scene.id}:${hotspot.id}`,
        scene,
        hotspot,
        color: triggerColors[hotspot.trigger.kind],
        position: new THREE.Vector3(
          Math.cos(angle) * tier.radius,
          tier.y + yOffset,
          Math.sin(angle) * tier.radius
        ),
      };
    });
  });
}

function makeEntryDioramaNodes() {
  const entryScene = scenesNeonArcade.find(
    (scene) => scene.id === "neon_arcade_entry"
  );
  if (!entryScene) return [];

  const positions: Record<string, THREE.Vector3> = {
    hs_arcade_door: new THREE.Vector3(2.2, 1.05, -1.42),
    hs_poster_classic: new THREE.Vector3(-2.55, 1.55, -1.36),
    hs_reverie_sign: new THREE.Vector3(0, 3.15, -1.32),
    hs_coin_atm: new THREE.Vector3(3.45, 0.76, -1.18),
    hs_blinky_reflection: new THREE.Vector3(4.25, 0.12, 1.15),
    hs_egg_pong: new THREE.Vector3(-4.6, 0.12, 1.75),
  };

  return entryScene.hotspots.map((hotspot) => ({
    id: `${entryScene.id}:${hotspot.id}`,
    scene: entryScene,
    hotspot,
    color: triggerColors[hotspot.trigger.kind],
    position: positions[hotspot.id] ?? new THREE.Vector3(0, 1, 0),
  }));
}

function getNodeSize(hotspot: Hotspot) {
  if (hotspot.trigger.kind === "puzzle") return 0.34;
  if (hotspot.trigger.kind === "transition") return 0.28;
  if (hotspot.trigger.kind === "item") return 0.25;
  return 0.21;
}

function createCanvasTextMesh({
  text,
  width,
  height,
  color,
  background = "rgba(3, 4, 18, 0.72)",
  fontSize = 58,
}: {
  text: string;
  width: number;
  height: number;
  color: string;
  background?: string;
  fontSize?: number;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = color;
    context.lineWidth = 10;
    context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `700 ${fontSize}px monospace`;
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 24;

    const lines = text.split("\n");
    const lineHeight = fontSize * 1.18;
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      context.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
}

function addBox(
  group: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function addPlane(
  group: THREE.Group,
  size: [number, number],
  position: [number, number, number],
  material: THREE.Material,
  rotation: [number, number, number] = [0, 0, 0]
) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function addNeonFrame(
  group: THREE.Group,
  center: [number, number, number],
  size: [number, number],
  color: string
) {
  const material = new THREE.MeshBasicMaterial({ color });
  const [x, y, z] = center;
  const [width, height] = size;
  addBox(group, [width, 0.045, 0.045], [x, y + height / 2, z], material);
  addBox(group, [width, 0.045, 0.045], [x, y - height / 2, z], material);
  addBox(group, [0.045, height, 0.045], [x - width / 2, y, z], material);
  addBox(group, [0.045, height, 0.045], [x + width / 2, y, z], material);
}

function buildEntryDiorama(scene: THREE.Scene, world: THREE.Group) {
  const animated: THREE.Object3D[] = [];
  scene.fog = new THREE.FogExp2("#050512", 0.045);

  const facadeMaterial = new THREE.MeshStandardMaterial({
    color: "#101022",
    roughness: 0.58,
    metalness: 0.18,
  });
  const sideMaterial = new THREE.MeshStandardMaterial({
    color: "#080a16",
    roughness: 0.72,
    metalness: 0.12,
  });
  const asphaltMaterial = new THREE.MeshStandardMaterial({
    color: "#070814",
    roughness: 0.18,
    metalness: 0.78,
  });
  const cyanMaterial = new THREE.MeshBasicMaterial({
    color: "#00fff5",
    transparent: true,
    opacity: 0.92,
  });
  const magentaMaterial = new THREE.MeshBasicMaterial({
    color: "#ff2e88",
    transparent: true,
    opacity: 0.92,
  });
  const yellowMaterial = new THREE.MeshBasicMaterial({
    color: "#f9e547",
    transparent: true,
    opacity: 0.88,
  });
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: "#090b18",
    emissive: "#00fff5",
    emissiveIntensity: 0.35,
    roughness: 0.08,
    metalness: 0.45,
    transparent: true,
    opacity: 0.88,
  });

  addPlane(
    world,
    [15.5, 9.4],
    [0, -0.06, 0.8],
    asphaltMaterial,
    [-Math.PI / 2, 0, 0]
  );

  addBox(world, [6.5, 3.6, 0.7], [0, 1.75, -1.82], facadeMaterial);
  addBox(world, [2.25, 3.95, 0.82], [-4.55, 1.92, -2.1], sideMaterial);
  addBox(world, [2.4, 4.55, 0.82], [4.65, 2.18, -2.06], sideMaterial);
  addBox(world, [0.2, 3.4, 0.14], [-3.36, 1.7, -1.35], magentaMaterial);
  addBox(world, [0.2, 3.2, 0.14], [3.36, 1.62, -1.35], cyanMaterial);

  const sign = createCanvasTextMesh({
    text: "REVERIE\nARCADE",
    width: 3.8,
    height: 0.95,
    color: "#ff2e88",
    fontSize: 92,
  });
  sign.position.set(0, 3.12, -1.33);
  world.add(sign);
  addBox(world, [4.2, 0.09, 0.08], [0, 2.54, -1.29], cyanMaterial);
  addBox(world, [4.2, 0.06, 0.08], [0, 3.73, -1.29], magentaMaterial);

  const door = addBox(world, [1.25, 1.95, 0.08], [2.18, 0.9, -1.26], glassMaterial);
  door.rotation.y = -0.04;
  addNeonFrame(world, [2.18, 0.94, -1.19], [1.48, 2.24], "#39ff14");

  const poster = createCanvasTextMesh({
    text: "ATARI\n2600\n1977",
    width: 1.05,
    height: 1.35,
    color: "#f9e547",
    background: "rgba(28, 20, 8, 0.86)",
    fontSize: 78,
  });
  poster.position.set(-2.5, 1.52, -1.28);
  world.add(poster);

  addBox(world, [0.72, 1.35, 0.42], [3.47, 0.68, -1.1], new THREE.MeshStandardMaterial({
    color: "#1a1e2f",
    emissive: "#00fff5",
    emissiveIntensity: 0.18,
    roughness: 0.32,
    metalness: 0.45,
  }));
  addBox(world, [0.5, 0.18, 0.045], [3.47, 1.1, -0.86], cyanMaterial);
  const coinLabel = createCanvasTextMesh({
    text: "25c",
    width: 0.48,
    height: 0.26,
    color: "#00fff5",
    fontSize: 90,
  });
  coinLabel.position.set(3.47, 0.72, -0.84);
  world.add(coinLabel);

  const openSign = createCanvasTextMesh({
    text: "OPEN\nRAIN OR SHINE",
    width: 1.05,
    height: 0.74,
    color: "#00fff5",
    fontSize: 62,
  });
  openSign.position.set(4.66, 2.45, -1.38);
  openSign.rotation.z = -0.04;
  world.add(openSign);

  for (let i = 0; i < 7; i += 1) {
    const x = -5.25 + (i % 2) * 0.65;
    const y = 0.8 + Math.floor(i / 2) * 0.78;
    addBox(world, [0.38, 0.22, 0.05], [x, y, -1.52], i % 2 ? cyanMaterial : magentaMaterial);
  }
  for (let i = 0; i < 8; i += 1) {
    const x = 4.18 + (i % 2) * 0.74;
    const y = 0.76 + Math.floor(i / 2) * 0.78;
    addBox(world, [0.42, 0.22, 0.05], [x, y, -1.5], i % 2 ? magentaMaterial : yellowMaterial);
  }

  const puddleMaterial = new THREE.MeshBasicMaterial({
    color: "#00fff5",
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });
  const magentaPuddleMaterial = new THREE.MeshBasicMaterial({
    color: "#ff2e88",
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  });
  const puddles = [
    { x: -2.2, z: 1.5, scale: [1.8, 0.54], material: puddleMaterial },
    { x: 1.0, z: 2.0, scale: [2.3, 0.62], material: magentaPuddleMaterial },
    { x: 4.2, z: 1.18, scale: [1.4, 0.44], material: magentaPuddleMaterial },
    { x: -4.55, z: 1.78, scale: [1.05, 0.36], material: puddleMaterial },
  ];
  puddles.forEach(({ x, z, scale, material }) => {
    const puddle = new THREE.Mesh(new THREE.CircleGeometry(1, 48), material);
    puddle.rotation.x = -Math.PI / 2;
    puddle.scale.set(scale[0], scale[1], 1);
    puddle.position.set(x, -0.035, z);
    world.add(puddle);
  });

  addBox(world, [0.36, 0.08, 0.9], [4.2, 0.03, 1.18], new THREE.MeshBasicMaterial({
    color: "#ff2e88",
    transparent: true,
    opacity: 0.65,
  }));
  addBox(world, [0.06, 0.06, 0.62], [4.02, 0.08, 1.18], magentaMaterial);
  addBox(world, [0.06, 0.06, 0.62], [4.38, 0.08, 1.18], magentaMaterial);

  addBox(world, [0.08, 0.08, 0.78], [-4.82, 0.08, 1.78], cyanMaterial);
  addBox(world, [0.08, 0.08, 0.78], [-4.38, 0.08, 1.78], cyanMaterial);
  addBox(world, [0.16, 0.16, 0.16], [-4.6, 0.12, 1.78], yellowMaterial);

  const rainGeometry = new THREE.BufferGeometry();
  const rainPositions: number[] = [];
  for (let i = 0; i < 180; i += 1) {
    const x = (Math.random() - 0.5) * 14;
    const y = Math.random() * 5.6 + 0.2;
    const z = Math.random() * 6.2 - 3.0;
    rainPositions.push(x, y, z, x - 0.08, y - 0.46, z + 0.03);
  }
  rainGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(rainPositions, 3)
  );
  const rain = new THREE.LineSegments(
    rainGeometry,
    new THREE.LineBasicMaterial({
      color: "#8ffcff",
      transparent: true,
      opacity: 0.32,
    })
  );
  world.add(rain);
  animated.push(rain);

  const rainGlow = new THREE.PointLight("#00fff5", 12, 8);
  rainGlow.position.set(-2.3, 2.8, 1.4);
  scene.add(rainGlow);
  const signGlow = new THREE.PointLight("#ff2e88", 38, 8);
  signGlow.position.set(0, 3.0, 0.6);
  scene.add(signGlow);
  const doorGlow = new THREE.PointLight("#39ff14", 20, 6);
  doorGlow.position.set(2.25, 1.2, 0.25);
  scene.add(doorGlow);

  return { animated };
}

function landmarkDistance(
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getPalmCenter(landmarks: HandPoint[]) {
  return {
    x: (landmarks[0].x + landmarks[5].x + landmarks[9].x + landmarks[17].x) / 4,
    y: (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[17].y) / 4,
  };
}

function countFoldedFingers(
  landmarks: HandPoint[],
  palmCenter: { x: number; y: number },
  palmSize: number
) {
  const fingers = [
    { tip: 8, pip: 6 },
    { tip: 12, pip: 10 },
    { tip: 16, pip: 14 },
    { tip: 20, pip: 18 },
  ];

  return fingers.filter(({ tip, pip }) => {
    const tipDistance = landmarkDistance(landmarks[tip], palmCenter);
    const pipDistance = landmarkDistance(landmarks[pip], palmCenter);
    return tipDistance < Math.max(pipDistance * 1.2, palmSize * 0.72);
  }).length;
}

function getZoomLabel(pinchRatio: number) {
  if (pinchRatio > 1.05) return "PINCH OUT / ZOOM IN";
  if (pinchRatio < 0.42) return "PINCH IN / ZOOM OUT";
  return "HAND TRACKING";
}

export function NeonArcadeGestureWorld({
  planetId,
  sceneId,
}: {
  planetId: string;
  sceneId: string;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const nodeMeshes = useRef<NodeMesh[]>([]);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const gestureLoopRef = useRef<number | null>(null);
  const gestureSessionRef = useRef(0);
  const pointerRef = useRef({
    down: false,
    x: 0,
    y: 0,
    moved: false,
  });
  const targetRotation = useRef({ x: -0.12, y: 0.35 });
  const targetZoom = useRef(8.2);
  const lastHandAt = useRef(0);
  const gestureStatusRef = useRef<GestureStatus>("idle");
  const gestureMessageRef = useRef("CAMERA GESTURE OFF");

  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [gestureStatus, setGestureStatus] = useState<GestureStatus>("idle");
  const [gestureMessage, setGestureMessage] = useState("CAMERA GESTURE OFF");
  const tickPlayTime = useGameStore((s) => s._uiActions.tickPlayTime);
  const progress = useGameStore((s) => s.progress);
  const isEntryDiorama = sceneId === "neon_arcade_entry";
  const nodes = useMemo(
    () => (isEntryDiorama ? makeEntryDioramaNodes() : makeWorldNodes()),
    [isEntryDiorama]
  );
  const currentScene = scenesNeonArcade.find((scene) => scene.id === sceneId);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        tickPlayTime(30);
      }
    }, 30000);

    return () => window.clearInterval(interval);
  }, [tickPlayTime]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const mountElement = mount;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#050511", isEntryDiorama ? 0.045 : 0.052);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 80);
    if (isEntryDiorama) {
      camera.position.set(0, 2.1, 8.6);
      targetZoom.current = 8.6;
      targetRotation.current = { x: -0.12, y: 0 };
    } else {
      camera.position.set(0, 0.2, targetZoom.current);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountElement.appendChild(renderer.domElement);

    const world = new THREE.Group();
    groupRef.current = world;
    scene.add(world);

    const ambient = new THREE.AmbientLight("#38385f", 1.2);
    scene.add(ambient);
    const cyanLight = new THREE.PointLight("#00fff5", 42, 18);
    cyanLight.position.set(-3.5, 3, 4);
    scene.add(cyanLight);
    const magentaLight = new THREE.PointLight("#ff2e88", 48, 18);
    magentaLight.position.set(3.5, -1, 5);
    scene.add(magentaLight);

    const animatedObjects: THREE.Object3D[] = [];

    if (isEntryDiorama) {
      const diorama = buildEntryDiorama(scene, world);
      animatedObjects.push(...diorama.animated);
    } else {
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: "#0c1128",
        emissive: "#00fff5",
        emissiveIntensity: 0.8,
        metalness: 0.35,
        roughness: 0.38,
      });
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.22, 5.8, 16),
        trunkMaterial
      );
      trunk.position.y = -0.15;
      world.add(trunk);

      const ringMaterial = new THREE.MeshBasicMaterial({
        color: "#00fff5",
        transparent: true,
        opacity: 0.35,
      });
      [-2.4, -0.1, 2.05].forEach((y, index) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry([4.2, 3.0, 1.85][index], 0.012, 8, 96),
          ringMaterial.clone()
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        world.add(ring);
      });

      const spiralMaterial = new THREE.LineBasicMaterial({
        color: "#ff2e88",
        transparent: true,
        opacity: 0.7,
      });
      const spiralPoints: THREE.Vector3[] = [];
      for (let i = 0; i < 220; i += 1) {
        const t = i / 219;
        const y = -3.0 + t * 6.2;
        const radius = 4.35 - t * 2.75;
        const angle = t * Math.PI * 9;
        spiralPoints.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius
          )
        );
      }
      world.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(spiralPoints),
          spiralMaterial
        )
      );
    }

    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let i = 0; i < 320; i += 1) {
      starPositions.push(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 18
      );
    }
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3)
    );
    scene.add(
      new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
          color: "#f9e547",
          size: 0.035,
          transparent: true,
          opacity: 0.85,
        })
      )
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#00fff5",
      transparent: true,
      opacity: 0.28,
    });
    nodeMeshes.current = nodes.map((node) => {
      const material = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: isEntryDiorama ? 1.2 : 1.9,
        metalness: 0.2,
        roughness: 0.25,
      });
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(
          isEntryDiorama ? getNodeSize(node.hotspot) * 0.82 : getNodeSize(node.hotspot),
          1
        ),
        material
      ) as unknown as NodeMesh;
      mesh.position.copy(node.position);
      mesh.userData.node = node;
      world.add(mesh);

      if (!isEntryDiorama) {
        world.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(0, node.position.y, 0),
              node.position,
            ]),
            lineMaterial.clone()
          )
        );
      }

      return mesh;
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const tempPosition = new THREE.Vector3();

    function resize() {
      const rect = mountElement.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    function pickNode(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(nodeMeshes.current, false)[0];
      if (hit) {
        setSelectedHotspot(hit.object.userData.node.hotspot);
      }
    }

    function onPointerDown(event: PointerEvent) {
      pointerRef.current = {
        down: true,
        x: event.clientX,
        y: event.clientY,
        moved: false,
      };
      renderer.domElement.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: PointerEvent) {
      if (!pointerRef.current.down) return;
      const dx = event.clientX - pointerRef.current.x;
      const dy = event.clientY - pointerRef.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) {
        pointerRef.current.moved = true;
      }
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      targetRotation.current.y += dx * 0.006;
      targetRotation.current.x = THREE.MathUtils.clamp(
        targetRotation.current.x + dy * 0.004,
        -0.9,
        0.75
      );
    }

    function onPointerUp(event: PointerEvent) {
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      if (!pointerRef.current.moved) {
        pickNode(event);
      }
      pointerRef.current.down = false;
    }

    function onPointerCancel(event: PointerEvent) {
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      pointerRef.current.down = false;
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      targetZoom.current = THREE.MathUtils.clamp(
        targetZoom.current + event.deltaY * 0.006,
        5.2,
        11.5
      );
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerCancel);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    function animate() {
      const elapsed = clock.getElapsedTime();
      const group = groupRef.current;
      const activeGesture = performance.now() - lastHandAt.current < 800;

      if (group) {
        if (!activeGesture && !pointerRef.current.down) {
          targetRotation.current.y += isEntryDiorama ? 0.00035 : 0.0012;
        }
        group.rotation.x += (targetRotation.current.x - group.rotation.x) * 0.06;
        group.rotation.y += (targetRotation.current.y - group.rotation.y) * 0.06;
      }

      camera.position.z += (targetZoom.current - camera.position.z) * 0.08;
      camera.lookAt(0, isEntryDiorama ? 1.15 : -0.05, 0);

      animatedObjects.forEach((object, index) => {
        object.position.y = -((elapsed * 1.8 + index * 1.6) % 5.4) + 4.9;
      });

      nodeMeshes.current.forEach((mesh, index) => {
        const pulse = 1 + Math.sin(elapsed * 2.5 + index * 0.55) * 0.08;
        mesh.scale.setScalar(pulse);
        mesh.rotation.x += 0.008;
        mesh.rotation.y += 0.012;

        const label = labelRefs.current[mesh.userData.node.id];
        if (!label) return;
        mesh.getWorldPosition(tempPosition);
        tempPosition.project(camera);
        const visible = tempPosition.z < 1;
        const x = (tempPosition.x * 0.5 + 0.5) * mountElement.clientWidth;
        const y = (-tempPosition.y * 0.5 + 0.5) * mountElement.clientHeight;
        label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        label.style.opacity = visible ? "1" : "0";
      });

      renderer.render(scene, camera);
      animationRef.current = window.requestAnimationFrame(animate);
    }
    animate();

    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerCancel);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", resize);
      nodeMeshes.current = [];
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [isEntryDiorama, nodes]);

  const disposeCameraResources = useCallback(() => {
    if (gestureLoopRef.current) {
      window.cancelAnimationFrame(gestureLoopRef.current);
      gestureLoopRef.current = null;
    }
    handLandmarkerRef.current?.close();
    handLandmarkerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const updateGestureReadout = useCallback(
    (status: GestureStatus, message: string) => {
      if (gestureStatusRef.current !== status) {
        gestureStatusRef.current = status;
        setGestureStatus(status);
      }

      if (gestureMessageRef.current !== message) {
        gestureMessageRef.current = message;
        setGestureMessage(message);
      }
    },
    []
  );

  const stopCamera = useCallback(() => {
    gestureSessionRef.current += 1;
    disposeCameraResources();
    updateGestureReadout("idle", "CAMERA GESTURE OFF");
  }, [disposeCameraResources, updateGestureReadout]);

  useEffect(
    () => () => {
      gestureSessionRef.current += 1;
      disposeCameraResources();
    },
    [disposeCameraResources]
  );

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      gestureSessionRef.current += 1;
      updateGestureReadout("error", "CAMERA API UNAVAILABLE");
      return;
    }

    const sessionId = gestureSessionRef.current + 1;
    gestureSessionRef.current = sessionId;
    disposeCameraResources();

    try {
      updateGestureReadout("requesting", "REQUESTING CAMERA");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
      if (gestureSessionRef.current !== sessionId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      video.srcObject = stream;
      await video.play();

      const { FilesetResolver, HandLandmarker } = await import(
        "@mediapipe/tasks-vision"
      );
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
      );

      let handLandmarker: HandLandmarker;
      try {
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            delegate: "GPU",
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          numHands: 1,
          runningMode: "VIDEO",
        });
      } catch {
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            delegate: "CPU",
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          numHands: 1,
          runningMode: "VIDEO",
        });
      }

      if (gestureSessionRef.current !== sessionId) {
        handLandmarker.close();
        return;
      }
      handLandmarkerRef.current = handLandmarker;
      updateGestureReadout("ready", "HAND LINK READY");

      function detect() {
        if (gestureSessionRef.current !== sessionId) return;

        const detector = handLandmarkerRef.current;
        const videoElement = videoRef.current;
        if (detector && videoElement?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
          const result = detector.detectForVideo(videoElement, performance.now());
          const landmarks = result.landmarks[0];

          if (landmarks) {
            const palmCenter = getPalmCenter(landmarks);
            const palmSize = Math.max(
              0.04,
              landmarkDistance(landmarks[0], landmarks[9])
            );
            const pinch = landmarkDistance(landmarks[4], landmarks[8]);
            const pinchRatio = pinch / palmSize;
            const foldedFingers = countFoldedFingers(
              landmarks,
              palmCenter,
              palmSize
            );
            const grabbing = foldedFingers >= 3;
            lastHandAt.current = performance.now();

            if (grabbing) {
              targetRotation.current.y = (0.5 - palmCenter.x) * 3.4;
              targetRotation.current.x = THREE.MathUtils.clamp(
                (palmCenter.y - 0.5) * 2.0,
                -0.9,
                0.75
              );
              updateGestureReadout("ready", "GRAB ROTATE");
            } else {
              targetZoom.current = THREE.MathUtils.clamp(
                11.7 - pinchRatio * 4.4,
                5.2,
                11.6
              );
              updateGestureReadout("ready", getZoomLabel(pinchRatio));
            }
          } else if (performance.now() - lastHandAt.current > 900) {
            updateGestureReadout("no-hand", "NO HAND");
          }
        }

        gestureLoopRef.current = window.requestAnimationFrame(detect);
      }

      detect();
    } catch {
      if (gestureSessionRef.current === sessionId) {
        disposeCameraResources();
        updateGestureReadout("error", "CAMERA BLOCKED");
      }
    }
  }, [disposeCameraResources, updateGestureReadout]);

  const minutes = Math.floor(progress.playTime / 60);
  const seconds = progress.playTime % 60;
  const playTimeLabel = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  const cameraActive =
    gestureStatus === "requesting" ||
    gestureStatus === "ready" ||
    gestureStatus === "no-hand";

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_center,#14143f_0%,#050511_66%,#010106_100%)]">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.24)_1px,transparent_1px)] bg-[length:100%_6px]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,#00fff5_1px,transparent_1px),linear-gradient(to_bottom,#ff2e88_1px,transparent_1px)] [background-size:72px_72px]" />

      {nodes.map((node) => (
        <button
          key={node.id}
          ref={(element) => {
            labelRefs.current[node.id] = element;
          }}
          type="button"
          onClick={() => setSelectedHotspot(node.hotspot)}
          className={cn(
            "absolute left-0 top-0 z-10 rounded border px-2 py-1",
            "bg-[var(--color-shadow)]/75 backdrop-blur-sm",
            "font-pixel text-[8px] transition-colors hover:bg-[var(--color-neon-cyan)] hover:text-black"
          )}
          style={{
            borderColor: node.color,
            color: node.color,
            boxShadow: `0 0 18px ${node.color}66`,
          }}
        >
          {node.hotspot.label ?? node.hotspot.id}
        </button>
      ))}

      <header className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4">
        <div>
          <p className="font-pixel text-[9px] text-[var(--color-text-muted)]">
            {isEntryDiorama
              ? "NEON ARCADE / RAIN DIORAMA"
              : "NEON ARCADE / CAMERA ORBIT"}
          </p>
          <h1 className="mt-2 font-pixel text-sm text-[var(--color-neon-magenta)] neon-glow md:text-base">
            {isEntryDiorama ? "雨夜街机厅外景" : "霓虹圣树星球"}
          </h1>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {isEntryDiorama
              ? "雨幕、霓虹灯、街机厅入口和积水反光已经做成立体切片。"
              : `${currentScene?.name ?? "第一星球"} 的记忆节点已经装载到同一个 3D 空间。`}
          </p>
        </div>
        <div className="text-right font-pixel text-[9px] text-[var(--color-text-muted)]">
          <p>{sceneId}</p>
          <p className="mt-2">{playTimeLabel}</p>
        </div>
      </header>

      <div className="absolute bottom-6 left-4 z-20 flex flex-wrap items-end gap-3">
        <div className="rounded border border-[var(--color-neon-cyan)]/50 bg-black/45 p-3 backdrop-blur-sm">
          <p className="font-pixel text-[8px] text-[var(--color-text-muted)]">
            GESTURE STATUS
          </p>
          <p
            className={cn(
              "mt-2 font-pixel text-[10px]",
              gestureStatus === "error"
                ? "text-[var(--color-neon-magenta)]"
                : gestureStatus === "ready"
                  ? "text-[var(--color-neon-green)]"
                  : "text-[var(--color-neon-cyan)]"
            )}
          >
            {gestureMessage}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={cameraActive ? stopCamera : startCamera}
              className="rounded border border-[var(--color-neon-cyan)] px-3 py-2 font-pixel text-[9px] text-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)] hover:text-black"
            >
              {cameraActive
                ? "关闭摄像头"
                : "开启摄像头"}
            </button>
          </div>
          <div className="mt-3 border-t border-[var(--color-neon-cyan)]/30 pt-3 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
            <p className="font-pixel text-[8px] text-[var(--color-neon-cyan)]">
              临时手势说明
            </p>
            <ul className="mt-2 space-y-1">
              <li>1. 手放进摄像头画面中央，保持整只手可见。</li>
              <li>2. 握拳像“抓住星球”，移动手掌可上下左右旋转。</li>
              <li>3. 拇指和食指张开是放大，捏合是缩小。</li>
              <li>4. 如果显示 NO HAND，拉远一点或提高光线。</li>
            </ul>
          </div>
        </div>

        <video
          ref={videoRef}
          muted
          playsInline
          className={cn(
            "h-24 w-32 scale-x-[-1] rounded border border-[var(--color-neon-magenta)]/60 object-cover opacity-80",
            gestureStatus === "idle" && "hidden"
          )}
        />
      </div>

      <div className="absolute bottom-6 right-4 z-20 rounded border border-[var(--color-neon-yellow)]/40 bg-black/45 px-3 py-2 font-pixel text-[9px] text-[var(--color-neon-yellow)] backdrop-blur-sm">
        <span>{progress.inventory.filter((id) => id.includes("key_")).length}/3 KEY</span>
        <span className="ml-3">{progress.foundEasterEggs.length} EGG</span>
      </div>

      {selectedHotspot && (
        <HotspotInteraction
          hotspot={selectedHotspot}
          planetId={planetId}
          onClose={() => setSelectedHotspot(null)}
        />
      )}
      <EasterEggToast />
      <PuzzleModal />
    </div>
  );
}
