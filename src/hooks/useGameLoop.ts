import { useEffect, useRef } from 'react'

/**
 * requestAnimationFrame 游戏循环，传入 Δt（毫秒）
 * active 为 false 时不注册帧回调
 */
export function useGameLoop(onFrame: (dtMs: number) => void, active: boolean): void {
  const onFrameRef = useRef(onFrame)
  onFrameRef.current = onFrame

  useEffect(() => {
    if (!active) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dtMs = Math.min(now - last, 100)
      last = now
      onFrameRef.current(dtMs)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
}
