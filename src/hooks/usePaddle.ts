import { useCallback, useRef, type MutableRefObject } from 'react'
import { clamp } from '../utils/math'

export type PaddleMetricsRef = {
  gameWidth: number
  paddleWidth: number
}

/**
 * 将指针 clientX 映射为挡板中心 X（逻辑坐标，已夹在边界内）
 */
export function paddleCenterFromClientX(
  clientX: number,
  rectLeft: number,
  gameWidth: number,
  paddleWidth: number,
): number {
  const x = clientX - rectLeft
  const half = paddleWidth / 2
  return clamp(x, half, gameWidth - half)
}

/**
 * 触摸 / 指针控制：在 active 时把挡板目标中心写入 targetCenterXRef（由游戏循环读取）
 */
export function usePaddleControl(metricsRef: MutableRefObject<PaddleMetricsRef>, active: boolean) {
  const targetCenterXRef = useRef<number | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!active) return
      e.currentTarget.setPointerCapture(e.pointerId)
      const { gameWidth, paddleWidth } = metricsRef.current
      const rect = e.currentTarget.getBoundingClientRect()
      targetCenterXRef.current = paddleCenterFromClientX(e.clientX, rect.left, gameWidth, paddleWidth)
    },
    [active, metricsRef],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!active) return
      if (!e.currentTarget.hasPointerCapture(e.pointerId) && e.buttons === 0) return
      const { gameWidth, paddleWidth } = metricsRef.current
      const rect = e.currentTarget.getBoundingClientRect()
      targetCenterXRef.current = paddleCenterFromClientX(e.clientX, rect.left, gameWidth, paddleWidth)
    },
    [active, metricsRef],
  )

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* 未 capture 时忽略 */
    }
  }, [])

  return { targetCenterXRef, onPointerDown, onPointerMove, onPointerUp }
}
