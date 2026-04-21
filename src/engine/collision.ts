import type { BallState, BrickState, PaddleState } from '../types/game'
import { clamp, vecNormalize } from '../utils/math'

export interface CircleRectHit {
  hit: boolean
  /** 从矩形指向圆心的方向（单位向量），用于将球推出与反射 */
  normal: { x: number; y: number }
  /** 穿透深度（>0 表示重叠） */
  penetration: number
}

/**
 * 圆与轴对齐矩形碰撞检测（AABB）
 * normal 指向球心方向，便于将球沿法线推出并做镜面反射
 */
export function circleRectCollision(ball: BallState, rect: BrickState): CircleRectHit {
  const cx = ball.pos.x
  const cy = ball.pos.y
  const r = ball.radius
  const rx = rect.pos.x
  const ry = rect.pos.y
  const rw = rect.width
  const rh = rect.height

  const closestX = clamp(cx, rx, rx + rw)
  const closestY = clamp(cy, ry, ry + rh)
  const dx = cx - closestX
  const dy = cy - closestY
  const distSq = dx * dx + dy * dy

  if (distSq > r * r) {
    return { hit: false, normal: { x: 0, y: 0 }, penetration: 0 }
  }

  const dist = Math.sqrt(distSq)
  if (dist < 1e-6) {
    // 球心在矩形内或贴边：用法线取速度反方向近似
    const nx = cx < rx + rw / 2 ? -1 : 1
    const ny = cy < ry + rh / 2 ? -1 : 1
    const n = vecNormalize({ x: nx, y: ny })
    return { hit: true, normal: n, penetration: r }
  }

  const n = vecNormalize({ x: dx, y: dy })
  const penetration = r - dist
  return { hit: true, normal: n, penetration: Math.max(0, penetration) }
}

export function circlePaddleCollision(ball: BallState, paddle: PaddleState): CircleRectHit {
  const rect: BrickState = {
    id: 'paddle',
    pos: { x: paddle.x, y: paddle.y },
    width: paddle.width,
    height: paddle.height,
    hp: 1,
    type: 'normal',
    color: '#000',
  }
  return circleRectCollision(ball, rect)
}
