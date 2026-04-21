import type { BrickState, BrickType, LevelConfig } from '../types/game'
import { GAME_CONFIG } from './gameConfig'

/** 地图单元：0 空，1 普通，2 硬砖，3 金砖 */
export type CellCode = 0 | 1 | 2 | 3

function cellToType(code: CellCode): BrickType | null {
  if (code === 0) return null
  if (code === 1) return 'normal'
  if (code === 2) return 'hard'
  return 'gold'
}

function typeToColor(type: BrickType): string {
  if (type === 'normal') return '#a78bfa'
  if (type === 'hard') return '#6366f1'
  return '#fbbf24'
}

function typeToHp(type: BrickType): number {
  if (type === 'normal') return 1
  if (type === 'hard') return 2
  return 3
}

/**
 * 根据关卡配置生成砖块列表（水平居中）
 */
export function buildBricksFromLevel(cfg: LevelConfig, canvasWidth: number): BrickState[] {
  const map = cfg.brickMap
  const rows = map.length
  if (rows === 0) return []
  const cols = map[0]?.length ?? 0
  if (cols === 0) return []

  const gap = GAME_CONFIG.brickGap
  const totalGap = gap * (cols + 1)
  const brickW = (canvasWidth - totalGap) / cols
  const brickH = GAME_CONFIG.brickRowHeight
  const top = GAME_CONFIG.brickTopOffset

  const bricks: BrickState[] = []
  for (let r = 0; r < rows; r++) {
    const row = map[r]
    for (let c = 0; c < cols; c++) {
      const code = (row[c] ?? 0) as CellCode
      const type = cellToType(code)
      if (!type) continue
      const x = gap + c * (brickW + gap)
      const y = top + r * (brickH + gap)
      bricks.push({
        id: `b-${cfg.level}-${r}-${c}`,
        pos: { x, y },
        width: brickW,
        height: brickH,
        hp: typeToHp(type),
        type,
        color: typeToColor(type),
      })
    }
  }
  return bricks
}

/** 关卡配置表（至少 1 关供阶段二验收） */
export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    ballSpeed: 340,
    paddleWidth: 96,
    brickRows: 5,
    brickCols: 8,
    brickMap: [
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 2, 2, 3, 3, 2, 2, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 2, 2, 0, 1, 1],
      [0, 3, 1, 1, 1, 1, 3, 0],
    ],
  },
  {
    level: 2,
    ballSpeed: 380,
    paddleWidth: 88,
    brickRows: 6,
    brickCols: 8,
    brickMap: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [0, 1, 3, 1, 1, 3, 1, 0],
      [1, 0, 1, 2, 2, 1, 0, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [3, 0, 1, 1, 1, 1, 0, 3],
    ],
  },
]
