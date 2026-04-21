import type { BallState, PaddleState, Vec2 } from '../types/game'
import { GAME_CONFIG } from '../config/gameConfig'
import { clamp, vecDot, vecLen, vecNormalize, vecScale } from '../utils/math'

/** 将速度限制为恒定标量 speed，避免数值漂移导致“抖动” */
export function enforceBallSpeed(vel: Vec2, speed: number): Vec2 {
  const len = vecLen(vel)
  if (len < 1e-6) return { x: 0, y: -speed }
  return vecScale(vel, speed / len)
}

/**
 * 挡板偏转：根据击中位置在挡板上的相对横向偏移，改变出射角。
 * 左端 / 中间 / 右端 出射方向明显不同；保持速率不变。
 */
export function reflectOffPaddle(ball: BallState, paddle: PaddleState): Vec2 {
  const centerX = paddle.x + paddle.width / 2
  const halfW = paddle.width / 2
  const rel = halfW > 1e-6 ? clamp((ball.pos.x - centerX) / halfW, -1, 1) : 0
  const maxA = GAME_CONFIG.paddleMaxBounceAngle
  const bounceAngle = rel * maxA
  const speed = ball.speed
  return {
    x: Math.sin(bounceAngle) * speed,
    y: -Math.abs(Math.cos(bounceAngle)) * speed,
  }
}

/** 竖直墙反弹：入射角 = 反射角（法线水平） */
export function bounceWallX(vel: Vec2): Vec2 {
  return { x: -vel.x, y: vel.y }
}

/** 水平墙反弹 */
export function bounceWallY(vel: Vec2): Vec2 {
  return { x: vel.x, y: -vel.y }
}

/** 用法线 n（从墙指向球）反射速度，保证 n 与入射方向点积 < 0 时才翻转 */
export function bounceWithNormal(vel: Vec2, n: Vec2): Vec2 {
  const nn = vecNormalize(n)
  if (vecDot(vel, nn) >= 0) return vel
  const d = vecDot(vel, nn)
  return { x: vel.x - 2 * d * nn.x, y: vel.y - 2 * d * nn.y }
}
