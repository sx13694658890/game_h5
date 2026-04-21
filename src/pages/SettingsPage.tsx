import { Button } from '../components/ui/Button'
import { useSettingsStore, type Difficulty } from '../store/settingsStore'

type Props = {
  onBack: () => void
}

const OPTIONS: { id: Difficulty; label: string; hint: string }[] = [
  { id: 'easy', label: '简单', hint: '球速较慢，挡板较宽' },
  { id: 'normal', label: '普通', hint: '默认平衡' },
  { id: 'hard', label: '困难', hint: '球速较快，挡板较窄' },
]

/** 设置：音效、难度（写入 localStorage） */
export function SettingsPage({ onBack }: Props) {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const difficulty = useSettingsStore((s) => s.difficulty)
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled)
  const setDifficulty = useSettingsStore((s) => s.setDifficulty)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
      <header className="flex items-center gap-3">
        <button
          type="button"
          className="font-body text-sm text-game-primary underline-offset-2 hover:underline"
          onClick={onBack}
        >
          返回
        </button>
        <h1 className="font-display text-lg text-game-accent">设置</h1>
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
        <h2 className="mb-3 font-body text-sm font-semibold text-slate-200">音效</h2>
        <label className="flex cursor-pointer items-center justify-between gap-3 font-body text-sm text-slate-300">
          <span>开启游戏音效</span>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="h-5 w-5 accent-game-primary"
          />
        </label>
        <p className="mt-2 font-body text-[11px] text-slate-500">关闭后碰撞与通关等均无声音；设置会自动保存。</p>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
        <h2 className="mb-3 font-body text-sm font-semibold text-slate-200">难度</h2>
        <div className="flex flex-col gap-2">
          {OPTIONS.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer flex-col rounded-lg border px-3 py-2 font-body text-sm transition ${
                difficulty === o.id
                  ? 'border-game-primary bg-cyan-500/10 text-game-primary'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="diff"
                  checked={difficulty === o.id}
                  onChange={() => setDifficulty(o.id)}
                  className="accent-game-primary"
                />
                {o.label}
              </span>
              <span className="mt-0.5 pl-6 text-[11px] text-slate-500">{o.hint}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="mt-auto">
        <Button className="w-full" onClick={onBack}>
          完成
        </Button>
      </div>
    </div>
  )
}
