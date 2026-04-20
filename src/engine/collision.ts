import type { BallState, BrickState } from '../types/game'

export interface CircleRectHit {
  hit: boolean
  normal: { x: number; y: number }
}

/** 圆与轴对齐矩形碰撞（阶段二实现） */
export function circleRectCollision(_ball: BallState, _rect: BrickState): CircleRectHit {
  void _ball
  void _rect
  return { hit: false, normal: { x: 0, y: 0 } }
}
