import { GameCanvas } from '../components/game/GameCanvas'

type Props = {
  onBack: () => void
}

export function GamePage({ onBack }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-3 p-3">
      <header className="flex items-center justify-between font-body text-xs text-slate-400">
        <button
          type="button"
          className="text-game-primary underline-offset-2 hover:underline"
          onClick={onBack}
        >
          返回
        </button>
        <span>关卡 1</span>
      </header>
      <GameCanvas />
    </div>
  )
}
