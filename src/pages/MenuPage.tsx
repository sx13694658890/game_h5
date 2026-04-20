import { Button } from '../components/ui/Button'

type Props = {
  onStart: () => void
}

export function MenuPage({ onStart }: Props) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <h1 className="font-display text-3xl tracking-wide text-game-primary drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]">
        StarPinball
      </h1>
      <p className="text-center font-body text-sm text-slate-400">星际弹球 · 阶段一工程就绪</p>
      <div className="flex flex-col gap-3">
        <Button onClick={onStart}>开始游戏</Button>
        <Button disabled>排行榜</Button>
        <Button disabled>设置</Button>
      </div>
    </div>
  )
}
