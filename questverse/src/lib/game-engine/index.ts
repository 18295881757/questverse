import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, PlayerSave } from "@/types/feature-flags";
import { SAVE_KEY, SAVE_VERSION } from "@/types/feature-flags";

const initialPlayerSave: PlayerSave = {
  currentPlanetId: "neon_arcade",
  currentSceneId: "neon_arcade_entry",
  inventory: [],
  solvedPuzzles: [],
  foundEasterEggs: [],
  flags: {},
  storyProgress: 0,
  hintsUsed: {},
  playTime: 0,
  lastSavedAt: new Date().toISOString(),
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      isLoaded: false,
      version: SAVE_VERSION,

      progress: initialPlayerSave,

      ui: {
        activePuzzleId: null,
        activeDialogId: null,
        activeItemId: null,
        activeEasterEgg: null,
        currentHintLevel: 0,
        settings: {
          quality: "high",
          textSpeed: "normal",
          easterEggsDiscoveredSeen: false,
        },
      },

      // Actions - 在此模块下扩展
      _uiActions: {
        openPuzzle: (puzzleId: string) => {
          set((state) => ({
            ui: { ...state.ui, activePuzzleId: puzzleId },
          }));
        },
        closePuzzle: () => {
          set((state) => ({
            ui: { ...state.ui, activePuzzleId: null },
          }));
        },
        openEasterEgg: (id: string, flavor: string) => {
          set((state) => ({
            ui: { ...state.ui, activeEasterEgg: { id, flavor } },
          }));
        },
        closeEasterEgg: () => {
          set((state) => ({
            ui: { ...state.ui, activeEasterEgg: null },
          }));
        },
        addItem: (itemId: string) => {
          set((state) => {
            if (state.progress.inventory.includes(itemId)) return state;
            return {
              progress: {
                ...state.progress,
                inventory: [...state.progress.inventory, itemId],
                lastSavedAt: new Date().toISOString(),
              },
            };
          });
        },
        markPuzzleSolved: (puzzleId: string) => {
          set((state) => {
            if (state.progress.solvedPuzzles.includes(puzzleId)) return state;
            return {
              progress: {
                ...state.progress,
                solvedPuzzles: [...state.progress.solvedPuzzles, puzzleId],
                lastSavedAt: new Date().toISOString(),
              },
            };
          });
        },
        applyPuzzleReward: (puzzleId, reward) => {
          set((state) => {
            const solvedPuzzles = state.progress.solvedPuzzles.includes(puzzleId)
              ? state.progress.solvedPuzzles
              : [...state.progress.solvedPuzzles, puzzleId];
            const inventory =
              reward?.itemId && !state.progress.inventory.includes(reward.itemId)
                ? [...state.progress.inventory, reward.itemId]
                : state.progress.inventory;
            const flags = reward?.setsFlag
              ? { ...state.progress.flags, [reward.setsFlag]: true }
              : state.progress.flags;
            const storyProgress = Math.max(
              state.progress.storyProgress,
              reward?.storyProgress ?? state.progress.storyProgress
            );

            return {
              progress: {
                ...state.progress,
                inventory,
                solvedPuzzles,
                flags,
                storyProgress,
                lastSavedAt: new Date().toISOString(),
              },
            };
          });
        },
        recordEasterEgg: (eggId: string) => {
          set((state) => {
            if (state.progress.foundEasterEggs.includes(eggId)) return state;
            return {
              progress: {
                ...state.progress,
                foundEasterEggs: [...state.progress.foundEasterEggs, eggId],
                storyProgress: Math.min(
                  100,
                  state.progress.storyProgress + 1
                ),
                lastSavedAt: new Date().toISOString(),
              },
            };
          });
        },
        setFlag: (key: string, value: boolean | string | number) => {
          set((state) => ({
            progress: {
              ...state.progress,
              flags: { ...state.progress.flags, [key]: value },
              lastSavedAt: new Date().toISOString(),
            },
          }));
        },
        travelTo: (planetId: string, sceneId: string) => {
          set((state) => ({
            progress: {
              ...state.progress,
              currentPlanetId: planetId,
              currentSceneId: sceneId,
              lastSavedAt: new Date().toISOString(),
            },
          }));
        },
        tickPlayTime: (seconds: number) => {
          if (seconds <= 0) return;
          set((state) => ({
            progress: {
              ...state.progress,
              playTime: state.progress.playTime + seconds,
              lastSavedAt: new Date().toISOString(),
            },
          }));
        },
      },
    }),
    {
      name: SAVE_KEY,
      version: 1,
      // 仅持久化 progress，避免 UI 状态污染
      partialize: (state) => ({
        progress: state.progress,
        version: state.version,
      }),
    }
  )
);

// 便捷 selector hooks
export const usePlayerProgress = () => useGameStore((s) => s.progress);
export const useUI = () => useGameStore((s) => s.ui);
