"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/lib/game-engine/index";
import { getPuzzle } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import type { PuzzleCode, PuzzleHiddenObject, PuzzleSequence } from "@/types/scene";

/**
 * PuzzleModal - 谜题全屏模态
 * Phase 1: 实现第一颗星球的 reverse 序列谜题
 */
export function PuzzleModal() {
  const activePuzzleId = useGameStore((s) => s.ui.activePuzzleId);
  const actions = useGameStore((s) => s._uiActions);
  const puzzle = activePuzzleId ? getPuzzle(activePuzzleId) : null;

  if (!activePuzzleId) return null;

  if (!puzzle) {
    return (
      <ModalShell onClose={actions.closePuzzle}>
        <p className="font-pixel text-xs text-[var(--color-neon-magenta)]">
          [谜题未配置]
        </p>
      </ModalShell>
    );
  }

  if (puzzle.type === "reverse") {
    return (
      <ReversePuzzle
        puzzle={puzzle as PuzzleSequence}
        onClose={actions.closePuzzle}
      />
    );
  }

  if (puzzle.type === "courage") {
    return (
      <HiddenObjectPuzzle
        puzzle={puzzle as PuzzleHiddenObject}
        onClose={actions.closePuzzle}
      />
    );
  }

  if (puzzle.type === "wisdom" && "correctAnswer" in puzzle) {
    return (
      <CodePuzzle puzzle={puzzle as PuzzleCode} onClose={actions.closePuzzle} />
    );
  }

  return (
    <ModalShell onClose={actions.closePuzzle}>
      <h2 className="font-pixel text-base text-[var(--color-neon-yellow)] neon-glow">
        {puzzle.name}
      </h2>
      <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
        这一类谜题将在下一阶段接入。
      </p>
    </ModalShell>
  );
}

function normalizeCodeAnswer(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, " ");
}

function CodePuzzle({
  puzzle,
  onClose,
}: {
  puzzle: PuzzleCode;
  onClose: () => void;
}) {
  const actions = useGameStore((s) => s._uiActions);
  const [answer, setAnswer] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [status, setStatus] = useState<"idle" | "wrong" | "solved">("idle");

  const solved = status === "solved";
  const expected = normalizeCodeAnswer(puzzle.correctAnswer);

  function submit() {
    if (normalizeCodeAnswer(answer) !== expected) {
      setStatus("wrong");
      return;
    }

    setStatus("solved");
    actions.applyPuzzleReward(puzzle.id, puzzle.reward);
    if (puzzle.easterEgg) {
      actions.recordEasterEgg(puzzle.easterEgg);
      actions.openEasterEgg(puzzle.easterEgg, "WISDOM SIGNAL DECODED");
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="mb-4 font-pixel text-[9px] text-[var(--color-text-muted)]">
        CRYSTAL KEY / WISDOM
      </div>
      <h2 className="font-pixel text-base text-[var(--color-neon-yellow)] neon-glow">
        {puzzle.name}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {puzzle.hint}
      </p>

      {!solved ? (
        <>
          <label className="mt-6 block">
            <span className="font-pixel text-[9px] text-[var(--color-neon-cyan)]">
              DECODED INPUT
            </span>
            <input
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value.slice(0, puzzle.inputLength));
                setStatus("idle");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              maxLength={puzzle.inputLength}
              placeholder={puzzle.placeholder ?? "TYPE CODE"}
              className="mt-3 w-full rounded border border-[var(--color-neon-cyan)]/50 bg-[var(--color-shadow)] px-4 py-3 font-pixel text-xs uppercase text-[var(--color-neon-cyan)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-neon-yellow)]"
            />
          </label>

          {puzzle.charset && (
            <p className="mt-3 font-pixel text-[8px] text-[var(--color-text-muted)]">
              CHARSET: {puzzle.charset}
            </p>
          )}

          {status === "wrong" && (
            <p className="mt-4 text-sm text-[var(--color-neon-magenta)]">
              解码器没有响应。也许答案藏在场景里，而不是藏在键盘里。
            </p>
          )}

          {hintLevel > 0 && (
            <p className="mt-4 text-sm text-[var(--color-neon-yellow)]">
              {puzzle.hints[hintLevel - 1]}
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                setAnswer("");
                setStatus("idle");
              }}
              className="rounded border border-[var(--color-text-muted)] px-4 py-2 font-pixel text-[10px] text-[var(--color-text-muted)] hover:border-[var(--color-neon-cyan)] hover:text-[var(--color-neon-cyan)]"
            >
              清空
            </button>
            <button
              type="button"
              onClick={() =>
                setHintLevel((level) => Math.min(puzzle.maxHints, level + 1))
              }
              className="rounded border border-[var(--color-neon-yellow)]/70 px-4 py-2 font-pixel text-[10px] text-[var(--color-neon-yellow)] hover:bg-[var(--color-neon-yellow)] hover:text-black"
            >
              提示 {hintLevel}/{puzzle.maxHints}
            </button>
            <button
              type="button"
              onClick={submit}
              className="rounded border border-[var(--color-neon-magenta)] bg-[var(--color-neon-magenta)]/10 px-4 py-2 font-pixel text-[10px] text-[var(--color-neon-magenta)] hover:bg-[var(--color-neon-magenta)] hover:text-black"
            >
              解码
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded border border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10 p-4">
          <p className="font-pixel text-xs text-[var(--color-neon-green)] neon-glow">
            SIGNAL DECODED
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
            {puzzle.successText ?? "这段隐藏信号已经写入你的档案。"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded bg-[var(--color-neon-green)] px-5 py-2 font-pixel text-[10px] text-black"
          >
            收下线索
          </button>
        </div>
      )}
    </ModalShell>
  );
}

function ReversePuzzle({
  puzzle,
  onClose,
}: {
  puzzle: PuzzleSequence;
  onClose: () => void;
}) {
  const actions = useGameStore((s) => s._uiActions);
  const [input, setInput] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [status, setStatus] = useState<"idle" | "wrong" | "solved">("idle");

  const expected = useMemo(
    () => (puzzle.reverseExecution ? [...puzzle.sequence].reverse() : puzzle.sequence),
    [puzzle]
  );
  const solved = status === "solved";

  function submit() {
    const isCorrect =
      input.length === expected.length &&
      input.every((value, index) => value === expected[index]);

    if (!isCorrect) {
      setStatus("wrong");
      return;
    }

    setStatus("solved");
    actions.applyPuzzleReward(puzzle.id, puzzle.reward);
    if (puzzle.easterEgg) {
      actions.recordEasterEgg(puzzle.easterEgg);
      actions.openEasterEgg(puzzle.easterEgg, "CREATED BY WARREN ROBINETT");
    }
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="mb-4 font-pixel text-[9px] text-[var(--color-text-muted)]">
        COPPER KEY / REVERSE THINKING
      </div>
      <h2 className="font-pixel text-base text-[var(--color-neon-yellow)] neon-glow">
        {puzzle.name}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {puzzle.hint}
      </p>

      <div className="mt-6 rounded border border-[var(--color-neon-cyan)]/30 bg-[var(--color-deep-bg)]/70 p-4">
        <div className="font-pixel text-[9px] text-[var(--color-text-muted)]">
          ORIGINAL INPUT
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {puzzle.sequence.map((step, index) => (
            <span
              key={`${step}-${index}`}
              className="rounded border border-[var(--color-text-muted)] px-3 py-2 font-pixel text-[10px] text-[var(--color-text-secondary)]"
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="font-pixel text-[9px] text-[var(--color-neon-cyan)]">
          YOUR INPUT
        </div>
        <div className="mt-3 min-h-10 rounded border border-[var(--color-neon-purple)]/40 bg-[var(--color-shadow)] px-3 py-3 font-pixel text-[10px] text-[var(--color-neon-purple)]">
          {input.length > 0 ? input.join(" / ") : "等待输入..."}
        </div>
      </div>

      {!solved ? (
        <>
          <div className="mx-auto mt-5 grid max-w-xs grid-cols-2 gap-3">
            {puzzle.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setInput((current) => {
                    if (current.length >= expected.length) return current;
                    return [
                      ...current,
                      item.id.replace("arrow_", "").toUpperCase(),
                    ];
                  });
                  setStatus("idle");
                }}
                className="rounded border border-[var(--color-neon-cyan)]/50 px-4 py-3 font-pixel text-xs text-[var(--color-neon-cyan)] transition-colors hover:bg-[var(--color-neon-cyan)] hover:text-[var(--color-deep-bg)]"
              >
                {item.display}
              </button>
            ))}
          </div>

          {status === "wrong" && (
            <p className="mt-4 text-sm text-[var(--color-neon-magenta)]">
              机器发出短促的错误音。它似乎在等待你把历史倒过来读。
            </p>
          )}

          {hintLevel > 0 && (
            <p className="mt-4 text-sm text-[var(--color-neon-yellow)]">
              {puzzle.hints[hintLevel - 1]}
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                setInput([]);
                setStatus("idle");
              }}
              className="rounded border border-[var(--color-text-muted)] px-4 py-2 font-pixel text-[10px] text-[var(--color-text-muted)] hover:border-[var(--color-neon-cyan)] hover:text-[var(--color-neon-cyan)]"
            >
              清空
            </button>
            <button
              type="button"
              onClick={() =>
                setHintLevel((level) => Math.min(puzzle.maxHints, level + 1))
              }
              className="rounded border border-[var(--color-neon-yellow)]/70 px-4 py-2 font-pixel text-[10px] text-[var(--color-neon-yellow)] hover:bg-[var(--color-neon-yellow)] hover:text-black"
            >
              提示 {hintLevel}/{puzzle.maxHints}
            </button>
            <button
              type="button"
              onClick={submit}
              className="rounded border border-[var(--color-neon-magenta)] bg-[var(--color-neon-magenta)]/10 px-4 py-2 font-pixel text-[10px] text-[var(--color-neon-magenta)] hover:bg-[var(--color-neon-magenta)] hover:text-black"
            >
              提交
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded border border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10 p-4">
          <p className="font-pixel text-xs text-[var(--color-neon-green)] neon-glow">
            CREATED BY WARREN ROBINETT
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
            屏幕闪了一下。你没有赢下游戏，而是找到了被藏起来的作者名字。
            一枚 Atari 钥匙碎片落入你的档案。
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded bg-[var(--color-neon-green)] px-5 py-2 font-pixel text-[10px] text-black"
          >
            收下碎片
          </button>
        </div>
      )}
    </ModalShell>
  );
}

function HiddenObjectPuzzle({
  puzzle,
  onClose,
}: {
  puzzle: PuzzleHiddenObject;
  onClose: () => void;
}) {
  const actions = useGameStore((s) => s._uiActions);
  const [foundTargets, setFoundTargets] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(puzzle.timeLimit ?? 60);
  const [status, setStatus] = useState<"playing" | "failed" | "solved">(
    "playing"
  );
  const [rewardApplied, setRewardApplied] = useState(false);

  const solved = status === "solved";
  const failed = status === "failed";

  useEffect(() => {
    if (solved || failed) return;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setStatus("failed");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [failed, solved]);

  useEffect(() => {
    if (status !== "playing") return;
    if (foundTargets.length !== puzzle.targets.length) return;

    setStatus("solved");
  }, [foundTargets.length, puzzle.targets.length, status]);

  useEffect(() => {
    if (!solved || rewardApplied) return;

    actions.applyPuzzleReward(puzzle.id, puzzle.reward);
    if (puzzle.easterEgg) {
      actions.recordEasterEgg(puzzle.easterEgg);
      actions.openEasterEgg(puzzle.easterEgg, "REVERIE SIGNAL RESTORED");
    }
    setRewardApplied(true);
  }, [actions, puzzle.easterEgg, puzzle.id, puzzle.reward, rewardApplied, solved]);

  function markFound(targetId: string) {
    if (solved || failed) return;

    setFoundTargets((current) => {
      if (current.includes(targetId)) return current;

      return [...current, targetId];
    });
  }

  function reset() {
    setFoundTargets([]);
    setHintLevel(0);
    setTimeLeft(puzzle.timeLimit ?? 60);
    setStatus("playing");
    setRewardApplied(false);
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-pixel text-[9px] text-[var(--color-text-muted)]">
          JADE KEY / COURAGE
        </div>
        <div
          className={cn(
            "rounded border px-3 py-2 font-pixel text-[10px]",
            timeLeft <= 10
              ? "border-[var(--color-neon-magenta)] text-[var(--color-neon-magenta)]"
              : "border-[var(--color-neon-yellow)] text-[var(--color-neon-yellow)]"
          )}
        >
          {timeLeft}s
        </div>
      </div>

      <h2 className="font-pixel text-base text-[var(--color-neon-yellow)] neon-glow">
        {puzzle.name}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {puzzle.hint}
      </p>

      <div className="mt-6 rounded border border-[var(--color-neon-purple)]/40 bg-[var(--color-deep-bg)]/70 p-3">
        <div className="relative h-[360px] overflow-hidden rounded bg-[radial-gradient(circle_at_center,#201944,#070716_70%)]">
          <div className="absolute left-[18%] top-[42%] h-24 w-36 border border-[var(--color-neon-purple)]/40 bg-black/30" />
          <div className="absolute left-[44%] top-[38%] h-32 w-44 border border-[var(--color-neon-yellow)]/30 bg-black/30" />
          <div className="absolute left-[74%] top-[38%] h-36 w-24 border border-[var(--color-neon-cyan)]/30 bg-black/30" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.28)_1px,transparent_1px)] bg-[length:100%_8px]" />

          {puzzle.targets.map((target) => {
            const found = foundTargets.includes(target.id);
            return (
              <button
                key={target.id}
                type="button"
                disabled={found || solved || failed}
                onClick={() => markFound(target.id)}
                aria-label={target.description}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: `${target.radius * 2}%`,
                  height: `${target.radius * 2}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={cn(
                  "absolute rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-yellow)]",
                  found
                    ? "border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/30 shadow-[0_0_24px_var(--color-neon-green)]"
                    : "border-[var(--color-neon-yellow)]/20 bg-[var(--color-neon-yellow)]/5 hover:border-[var(--color-neon-yellow)] hover:bg-[var(--color-neon-yellow)]/20"
                )}
              >
                <span className="sr-only">{target.description}</span>
                {found && (
                  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-pixel text-[10px] text-[var(--color-neon-green)]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-pixel text-[9px] text-[var(--color-neon-cyan)]">
          {foundTargets.length}/{puzzle.targets.length} FREQUENCIES
        </p>
        <button
          type="button"
          onClick={() =>
            setHintLevel((level) => Math.min(puzzle.maxHints, level + 1))
          }
          className="rounded border border-[var(--color-neon-yellow)]/70 px-4 py-2 font-pixel text-[10px] text-[var(--color-neon-yellow)] hover:bg-[var(--color-neon-yellow)] hover:text-black"
        >
          提示 {hintLevel}/{puzzle.maxHints}
        </button>
      </div>

      {hintLevel > 0 && (
        <p className="mt-4 text-sm text-[var(--color-neon-yellow)]">
          {puzzle.hints[hintLevel - 1]}
        </p>
      )}

      {failed && (
        <div className="mt-5 rounded border border-[var(--color-neon-magenta)] bg-[var(--color-neon-magenta)]/10 p-4">
          <p className="text-sm text-[var(--color-text-primary)]">
            噪声吞没了房间。深呼吸，再靠近一点。
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded border border-[var(--color-neon-magenta)] px-5 py-2 font-pixel text-[10px] text-[var(--color-neon-magenta)] hover:bg-[var(--color-neon-magenta)] hover:text-black"
          >
            重新聆听
          </button>
        </div>
      )}

      {solved && (
        <div className="mt-5 rounded border border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10 p-4">
          <p className="font-pixel text-xs text-[var(--color-neon-green)] neon-glow">
            SIGNAL RESTORED
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
            三段频率重新叠合。唱针停止颤抖，一枚玉色的声波碎片从黑胶中心浮起。
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded bg-[var(--color-neon-green)] px-5 py-2 font-pixel text-[10px] text-black"
          >
            收下碎片
          </button>
        </div>
      )}
    </ModalShell>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div
        className={cn(
          "relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg",
          "border-2 border-[var(--color-neon-cyan)]",
          "bg-[var(--color-midnight)]/95 p-6",
          "shadow-[0_0_50px_rgba(0,255,245,0.25)]"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 font-pixel text-xs text-[var(--color-text-muted)] hover:text-[var(--color-neon-magenta)]"
          aria-label="关闭谜题"
        >
          X
        </button>
        <div className="pt-7">{children}</div>
      </div>
    </div>
  );
}
