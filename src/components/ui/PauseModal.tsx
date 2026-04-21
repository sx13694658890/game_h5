type Props = {
  open: boolean
  onResume: () => void
  onRestart: () => void
  onExitMenu: () => void
}

/** 暂停：继续 / 重新开始 / 返回主菜单；点遮罩或 ✕ 视为继续 */
export function PauseModal({ open, onResume, onRestart, onExitMenu }: Props) {
  if (!open) return null

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center rounded-lg bg-black/75 px-4"
      role="presentation"
      onClick={onResume}
    >
      <button
        type="button"
        className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-slate-500 bg-slate-900/90 font-display text-lg text-slate-300 hover:bg-slate-800"
        aria-label="关闭并继续"
        onClick={(e) => {
          e.stopPropagation()
          onResume()
        }}
      >
        ×
      </button>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
        className="w-full max-w-[280px] rounded-2xl border border-slate-700 bg-slate-900/95 p-5 shadow-[0_0_24px_rgba(0,229,255,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="pause-title" className="mb-4 text-center font-display text-lg text-game-primary">
          已暂停
        </h2>
        <div className="flex flex-col gap-2 font-body text-sm">
          <button
            type="button"
            className="rounded-xl bg-game-primary py-2.5 font-semibold text-game-bg"
            onClick={onResume}
          >
            继续游戏
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-600 py-2.5 text-slate-200"
            onClick={onRestart}
          >
            重新开始
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-600 py-2.5 text-slate-400"
            onClick={onExitMenu}
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  )
}
