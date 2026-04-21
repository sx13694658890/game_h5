import { useGameStore } from '../../store/gameStore'

/** 游戏内抬头显示：分数 / 生命 / 关卡 / 连击 */
export function HUD() {
  const score = useGameStore((s) => s.score)
  const lives = useGameStore((s) => s.lives)
  const level = useGameStore((s) => s.level)
  const streak = useGameStore((s) => s.brickStreak)
  const nextMul = Math.min(5, Math.max(1, streak + 1))

  return (
    <div className="pointer-events-none flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 px-1 font-body text-[11px] text-slate-300">
      <span className="text-game-primary">分 {score}</span>
      <span className="text-game-accent">
        连击 {streak} → 下次×{nextMul}
      </span>
      <span className="text-rose-400">♥{lives}</span>
      <span className="text-slate-400">L{level}</span>
    </div>
  )
}
