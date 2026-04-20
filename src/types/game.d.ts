/** 二维向量 */
export type Vec2 = { x: number; y: number }

/** 弹球状态 */
export interface BallState {
  pos: Vec2
  vel: Vec2
  radius: number
  speed: number
}

/** 挡板状态 */
export interface PaddleState {
  x: number
  y: number
  width: number
  height: number
}

/** 砖块类型 */
export type BrickType = 'normal' | 'hard' | 'gold'

/** 砖块状态 */
export interface BrickState {
  id: string
  pos: Vec2
  width: number
  height: number
  hp: number
  type: BrickType
  color: string
}

/** 关卡配置（后续 Sprint 填充） */
export interface LevelConfig {
  level: number
  ballSpeed: number
  paddleWidth: number
  brickRows: number
  brickCols: number
  brickMap: number[][]
}

/** 游戏阶段 */
export type GamePhase = 'idle' | 'playing' | 'paused' | 'levelClear' | 'gameOver'
