import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type Props = {
  onDone: () => void
}

const SLOW_HINT_MS = 5000

/** 启动加载：资源等待、进度条、超时弱网提示，完成后进入主菜单 */
export function LoadingPage({ onDone }: Props) {
  const [progress, setProgress] = useState(0)
  const [showSlowHint, setShowSlowHint] = useState(false)

  useEffect(() => {
    let alive = true
    let intervalId = 0
    const slowTimer = window.setTimeout(() => {
      if (alive) setShowSlowHint(true)
    }, SLOW_HINT_MS)

    void (async () => {
      await Promise.all([
        document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve(),
        new Promise<void>((r) => setTimeout(r, 420)),
      ])
      if (!alive) return

      const t0 = performance.now()
      const minHoldMs = 1280
      intervalId = window.setInterval(() => {
        if (!alive) return
        const elapsed = performance.now() - t0
        const next = Math.min(100, Math.floor((elapsed / minHoldMs) * 100))
        setProgress((p) => Math.max(p, next))
        if (elapsed >= minHoldMs) {
          clearInterval(intervalId)
          setProgress(100)
          window.setTimeout(() => {
            if (alive) onDone()
          }, 300)
        }
      }, 48)
    })()

    return () => {
      alive = false
      clearTimeout(slowTimer)
      clearInterval(intervalId)
    }
  }, [onDone])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10">
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <p className="font-display text-2xl tracking-wide text-game-primary drop-shadow-[0_0_14px_rgba(0,229,255,0.55)]">
          StarPinball
        </p>
        <p className="font-body text-xs text-slate-500">星际弹球 · 加载资源</p>
      </motion.div>

      <div className="w-full max-w-[260px] space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-slate-800/90 ring-1 ring-slate-700/80">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-game-primary to-violet-400"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'tween', duration: 0.12, ease: 'linear' }}
          />
        </div>
        <p className="text-center font-body text-xs text-slate-400">{progress}%</p>
      </div>

      {showSlowHint && (
        <p className="max-w-xs text-center font-body text-xs text-amber-200/90">
          网络或设备较慢，若长时间无响应可刷新页面重试
        </p>
      )}
    </div>
  )
}
