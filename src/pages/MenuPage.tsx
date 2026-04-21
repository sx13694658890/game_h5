import { Button } from '../components/ui/Button'

type Props = {
  highScore: number
  onStart: () => void
  onLeaderboard: () => void
  onSettings: () => void
}

export function MenuPage({ highScore, onStart, onLeaderboard, onSettings }: Props) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <h1 className="font-display text-3xl tracking-wide text-game-primary drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]">
        StarPinball
      </h1>
      <p className="text-center font-body text-sm text-slate-400">触摸滑动挡板 · 消砖通关</p>
      <p className="font-body text-xs text-game-accent">
        历史最高 <span className="text-lg font-semibold text-game-primary">{highScore}</span> 分
      </p>
      <div className="flex w-full max-w-[240px] flex-col gap-3">
        <Button onClick={onStart}>开始游戏</Button>
        <Button onClick={onLeaderboard}>排行榜</Button>
        <Button onClick={onSettings}>设置</Button>
      </div>
    </div>
  )
}
