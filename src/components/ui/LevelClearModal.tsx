import { useEffect, useState } from 'react'

type Props = {
  open: boolean
  /** 本关得分 */
  levelScore: number
  /** 1～3 星 */
  stars: 1 | 2 | 3
  /** 累计总分 */
  totalScore: number
  /** 当前关卡号（刚完成的关） */
  clearedLevel: number
  onNext: () => void
}

/** 关卡完成：本关得分 + 星级依次亮起 + 下一关 */
export function LevelClearModal({
  open,
  levelScore,
  stars,
  totalScore,
  clearedLevel,
  onNext,
}: Props) {
  const [visibleStars, setVisibleStars] = useState(0)

  useEffect(() => {
    if (!open) {
      setVisibleStars(0)
      return
    }
    setVisibleStars(0)
    const timers: number[] = []
    for (let i = 1; i <= stars; i++) {
      timers.push(window.setTimeout(() => setVisibleStars(i), 380 * i))
    }
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [open, stars])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-black/80 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-title"
        className="relative w-full max-w-[300px] rounded-2xl border border-amber-500/30 bg-slate-950/95 p-6 pt-10 text-center shadow-[0_0_32px_rgba(247,201,72,0.2)]"
      >
        <button
          type="button"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          aria-label="进入下一关"
          onClick={onNext}
        >
          ×
        </button>
        <h2 id="clear-title" className="font-display text-xl text-game-accent">
          关卡完成
        </h2>
        <p className="mt-1 font-body text-xs text-slate-500">第 {clearedLevel} 关</p>

        <p className="mt-4 font-body text-sm text-slate-300">
          本关得分 <span className="text-lg font-semibold text-game-primary">{levelScore}</span>
        </p>
        <p className="mt-1 font-body text-xs text-slate-500">累计 {totalScore} 分</p>

        <div className="mt-5 flex justify-center gap-2 text-2xl" aria-label="星级">
          {([1, 2, 3] as const).map((i) => {
            const earned = i <= stars
            const lit = earned && i <= visibleStars
            return (
              <span
                key={i}
                className={`transition-all duration-500 ${
                  lit
                    ? 'scale-100 text-game-accent opacity-100 drop-shadow-[0_0_10px_rgba(247,201,72,0.85)]'
                    : earned
                      ? 'scale-90 text-amber-900/40 opacity-40'
                      : 'scale-75 text-slate-800 opacity-25'
                }`}
              >
                ★
              </span>
            )
          })}
        </div>
        <p className="mt-2 font-body text-[11px] text-slate-500">评级 {stars} 星 · 依剩余生命与通关用时</p>

        <button
          type="button"
          className="mt-6 w-full rounded-full bg-game-primary py-2.5 font-body text-sm font-semibold text-game-bg"
          onClick={onNext}
        >
          下一关
        </button>
      </div>
    </div>
  )
}
