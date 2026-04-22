type Props = {
  score: number
  reachedLevel: number
  brokeRecord: boolean
  onRetry: () => void
  onMenu: () => void
  onLeaderboard: () => void
  /** overlay：画布上层；page：独立全屏页 */
  variant?: 'overlay' | 'page'
}

/** 游戏结束：得分、刷新纪录动效、操作按钮 */
export function GameOverPanel({
  score,
  reachedLevel,
  brokeRecord,
  onRetry,
  onMenu,
  onLeaderboard,
  variant = 'overlay',
}: Props) {
  const shell =
    variant === 'page'
      ? 'flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-slate-800/80 bg-black/82 px-4 py-8 text-center shadow-inner'
      : 'absolute inset-0 z-[38] flex flex-col items-center justify-center gap-4 rounded-lg bg-black/85 px-4 text-center'

  return (
    <div className={shell}>
      <p className="font-display text-lg text-rose-400">游戏结束</p>

      {brokeRecord && (
        <div className="animate-pulse rounded-lg border border-game-accent/60 bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-500/20 px-4 py-2 font-display text-sm font-bold tracking-wide text-game-accent shadow-[0_0_20px_rgba(247,201,72,0.45)]">
          NEW RECORD!
        </div>
      )}

      <p className="font-body text-sm text-slate-300">
        得分 <span className="text-xl font-semibold text-game-primary">{score}</span>
      </p>
      <p className="font-body text-xs text-slate-500">到达第 {reachedLevel} 关</p>

      <div className="mt-2 flex w-full max-w-[260px] flex-col gap-2 font-body text-sm">
        <button
          type="button"
          className="rounded-full bg-game-primary py-2.5 font-semibold text-game-bg"
          onClick={onRetry}
        >
          再玩一局
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-500 py-2 text-slate-200"
          onClick={onLeaderboard}
        >
          排行榜
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-600 py-2 text-slate-400"
          onClick={onMenu}
        >
          返回主菜单
        </button>
      </div>
    </div>
  )
}
