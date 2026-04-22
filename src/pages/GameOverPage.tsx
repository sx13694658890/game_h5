import { GameOverPanel } from '../components/ui/GameOverPanel'

export type GameOverSnapshot = {
  score: number
  level: number
  brokeRecord: boolean
}

type Props = {
  snapshot: GameOverSnapshot
  onRetry: () => void
  onMenu: () => void
  onLeaderboard: () => void
}

/** 游戏结束独立页（与主流程路由统一） */
export function GameOverPage({ snapshot, onRetry, onMenu, onLeaderboard }: Props) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col gap-3 p-4">
      <header className="shrink-0 text-center font-body text-xs text-slate-500">本局结算</header>
      <GameOverPanel
        variant="page"
        score={snapshot.score}
        reachedLevel={snapshot.level}
        brokeRecord={snapshot.brokeRecord}
        onRetry={onRetry}
        onMenu={onMenu}
        onLeaderboard={onLeaderboard}
      />
    </div>
  )
}
