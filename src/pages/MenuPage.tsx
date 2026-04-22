import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { readJson, writeJson } from '../utils/storage'

const ONBOARDING_KEY = 'menu-onboarding-dismissed'

type Props = {
  highScore: number
  onStart: () => void
  onLeaderboard: () => void
  onSettings: () => void
}

export function MenuPage({ highScore, onStart, onLeaderboard, onSettings }: Props) {
  const [showOnboarding, setShowOnboarding] = useState(() => !readJson<boolean>(ONBOARDING_KEY, false))

  const dismissOnboarding = () => {
    writeJson(ONBOARDING_KEY, true)
    setShowOnboarding(false)
  }

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

      {showOnboarding && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-end gap-3 rounded-2xl bg-slate-950/75 p-5 pb-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="新手指引"
        >
          <div className="max-w-xs rounded-xl border border-game-primary/35 bg-slate-900/95 p-4 text-left shadow-lg shadow-cyan-900/20">
            <p className="font-display text-sm text-game-primary">新手提示</p>
            <ul className="mt-2 list-inside list-disc space-y-1.5 font-body text-xs leading-relaxed text-slate-300">
              <li>在画面下方左右滑动控制挡板</li>
              <li>击碎全部砖块进入下一关，球落底会扣命</li>
              <li>暂停里可重开本关或返回菜单</li>
            </ul>
          </div>
          <Button className="w-full max-w-[240px]" onClick={dismissOnboarding}>
            知道了
          </Button>
        </div>
      )}
    </div>
  )
}
