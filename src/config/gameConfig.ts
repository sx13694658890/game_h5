/** 游戏常量（逻辑坐标系，与 Canvas CSS 像素一致） */
export const GAME_CONFIG = {
  targetFps: 60,
  defaultLives: 3,
  ballRadius: 8,
  paddleHeight: 12,
  paddleYInset: 56,
  brickGap: 6,
  brickTopOffset: 72,
  brickRowHeight: 22,
  maxComboMultiplier: 5,
  /** 挡板偏转：相对位置映射到最大偏离竖直方向的角度（弧度） */
  paddleMaxBounceAngle: Math.PI / 3,
} as const

export const BRICK_SCORE: Record<'normal' | 'hard' | 'gold', number> = {
  normal: 10,
  hard: 20,
  gold: 50,
}
