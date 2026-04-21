import { useCallback, useState } from 'react'
import { Button } from '../components/ui/Button'
import { clearLeaderboard, getLeaderboard, type LeaderboardEntry } from '../utils/leaderboard'

type Props = {
  onBack: () => void
  /** 本局刚写入的记录 id，用于高亮 */
  highlightId?: string | null
}

function formatAt(iso: string): string {
  try {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  } catch {
    return iso
  }
}

/** 本地排行榜 Top10，支持清空（二次确认） */
export function LeaderboardPage({ onBack, highlightId }: Props) {
  const [rows, setRows] = useState<LeaderboardEntry[]>(() => getLeaderboard())

  const reload = useCallback(() => {
    setRows(getLeaderboard())
  }, [])

  const handleClear = () => {
    if (!window.confirm('确定清空排行榜？此操作不可恢复。')) return
    clearLeaderboard()
    reload()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
      <header className="relative flex shrink-0 items-center justify-center py-1">
        <button
          type="button"
          className="absolute left-0 font-body text-sm text-game-primary underline-offset-2 hover:underline"
          onClick={onBack}
        >
          返回
        </button>
        <h1 className="font-display text-lg text-game-accent">排行榜</h1>
      </header>

      <p className="font-body text-center text-[11px] text-slate-500">本地 Top10 · 仅保存在本机</p>

      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 font-body text-sm">
        {rows.length === 0 && <li className="py-8 text-center text-slate-500">暂无记录，去打一局吧～</li>}
        {rows.map((e: LeaderboardEntry, idx: number) => {
          const hi = highlightId && e.id === highlightId
          return (
            <li
              key={e.id}
              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
                hi
                  ? 'border-game-accent bg-amber-500/10 text-game-accent shadow-[0_0_12px_rgba(247,201,72,0.2)]'
                  : 'border-slate-700 bg-slate-900/40 text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-5 text-center text-slate-500">{idx + 1}</span>
                <span className="font-semibold text-game-primary">{e.score}</span>
                <span className="text-xs text-slate-500">L{e.level}</span>
              </span>
              <span className="text-[11px] text-slate-500">{formatAt(e.at)}</span>
            </li>
          )
        })}
      </ul>

      <div className="flex shrink-0 flex-col gap-2">
        <Button
          className="border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
          onClick={handleClear}
          disabled={rows.length === 0}
        >
          清空排行榜
        </Button>
      </div>
    </div>
  )
}
