"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { planets, canEnterPlanet } from "@/lib/content";
import { useGameStore } from "@/lib/game-engine/index";
import { cn } from "@/lib/utils/cn";

function hasStoreHydrated() {
  return useGameStore.persist?.hasHydrated?.() ?? false;
}

export function PlanetSelect() {
  const progress = useGameStore((s) => s.progress);
  const [hasHydrated, setHasHydrated] = useState(hasStoreHydrated);

  useEffect(() => {
    setHasHydrated(hasStoreHydrated());
    return useGameStore.persist?.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, []);

  if (!hasHydrated) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {planets.map((planet, index) => (
          <article
            key={planet.id}
            className="rounded-lg border border-[var(--color-text-muted)]/40 bg-[var(--color-midnight)]/60 p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-pixel text-[9px] text-[var(--color-text-muted)]">
                  WORLD {index + 1}
                </p>
                <h2
                  className="mt-2 font-pixel text-sm neon-glow"
                  style={{ color: planet.themeColor }}
                >
                  {planet.name}
                </h2>
              </div>
              <span className="font-pixel text-[9px] text-[var(--color-text-muted)]">
                SYNC
              </span>
            </div>
            <div className="min-h-24 rounded border border-[var(--color-text-muted)]/20 bg-[var(--color-shadow)]/40" />
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {planets.map((planet, index) => {
        const access = canEnterPlanet(planet.id, progress);
        const href = `/play/${planet.id}/${planet.startSceneId}`;

        return (
          <article
            key={planet.id}
            className={cn(
              "rounded-lg border bg-[var(--color-midnight)]/60 p-5",
              access.can
                ? "border-[var(--color-neon-cyan)]/40"
                : "border-[var(--color-text-muted)]/40 opacity-75"
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-pixel text-[9px] text-[var(--color-text-muted)]">
                  WORLD {index + 1}
                </p>
                <h2
                  className="mt-2 font-pixel text-sm neon-glow"
                  style={{ color: planet.themeColor }}
                >
                  {planet.name}
                </h2>
              </div>
              <span className="font-pixel text-[9px] text-[var(--color-neon-yellow)]">
                {access.can ? "OPEN" : "LOCKED"}
              </span>
            </div>
            <p className="min-h-24 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {planet.description}
            </p>
            {access.can ? (
              <Link
                href={href}
                className="mt-5 inline-block rounded border border-[var(--color-neon-cyan)] px-4 py-2 font-pixel text-[10px] text-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)] hover:text-[var(--color-deep-bg)]"
              >
                进入星球
              </Link>
            ) : (
              <p className="mt-5 font-pixel text-[9px] text-[var(--color-text-muted)]">
                {access.reason}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
