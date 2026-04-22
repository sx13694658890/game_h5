import { create } from 'zustand'
import type { GamePhase } from '../types/game'
import { getMenuStartLevel, resetMenuStartLevelToFirst, setMenuStartLevel } from '../utils/gameProgress'
import { addLeaderboardEntry } from '../utils/leaderboard'

export interface GameStoreState {
  phase: GamePhase
  score: number
  brickStreak: number
  lives: number
  level: number

  /** 当前关卡开始时的累计分数（用于本关得分） */
  scoreAtLevelStart: number
  /** 当前关卡开始时间戳（performance.now） */
  levelStartedAt: number
  /** 刚结束关卡的本关得分（供通关弹窗） */
  lastLevelScoreDelta: number
  /** 刚结束关卡的星级 1～3 */
  lastLevelStars: 1 | 2 | 3
  /** 最近一次游戏结束写入排行榜的条目 id（用于高亮） */
  lastRecordId: string | null
  lastBrokeRecord: boolean

  setPhase: (phase: GamePhase) => void
  resetRun: () => void
  restartCurrentLevel: () => void
  prepareRetryAfterGameOver: () => void
  beginPlaying: () => void
  pauseGame: () => void
  resumeGame: () => void
  onBrickDestroyed: (basePoints: number) => void
  registerBallLost: () => boolean
  notifyLevelClear: () => void
  advanceLevel: () => void
}

const now = () => performance.now()

const initial = (): Omit<
  GameStoreState,
  | 'setPhase'
  | 'resetRun'
  | 'restartCurrentLevel'
  | 'prepareRetryAfterGameOver'
  | 'beginPlaying'
  | 'pauseGame'
  | 'resumeGame'
  | 'onBrickDestroyed'
  | 'registerBallLost'
  | 'notifyLevelClear'
  | 'advanceLevel'
> => ({
  phase: 'idle',
  score: 0,
  brickStreak: 0,
  lives: 3,
  level: 1,
  scoreAtLevelStart: 0,
  levelStartedAt: now(),
  lastLevelScoreDelta: 0,
  lastLevelStars: 1,
  lastRecordId: null,
  lastBrokeRecord: false,
})

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...initial(),

  setPhase: (phase) => set({ phase }),

  resetRun: () =>
    set({
      ...initial(),
      level: getMenuStartLevel(),
      levelStartedAt: now(),
    }),

  restartCurrentLevel: () =>
    set((s) => ({
      lives: 3,
      score: 0,
      brickStreak: 0,
      phase: 'idle',
      scoreAtLevelStart: 0,
      levelStartedAt: now(),
      lastLevelScoreDelta: 0,
      lastLevelStars: 1,
      lastRecordId: null,
      lastBrokeRecord: false,
      level: s.level,
    })),

  prepareRetryAfterGameOver: () =>
    set((s) => ({
      lives: 3,
      score: 0,
      brickStreak: 0,
      phase: 'playing',
      scoreAtLevelStart: 0,
      levelStartedAt: now(),
      lastLevelScoreDelta: 0,
      lastLevelStars: 1,
      lastRecordId: null,
      lastBrokeRecord: false,
      level: s.level,
    })),

  beginPlaying: () =>
    set((s) => ({
      phase: 'playing',
      scoreAtLevelStart: s.score,
      levelStartedAt: now(),
    })),

  pauseGame: () => {
    const { phase } = get()
    if (phase === 'playing') set({ phase: 'paused' })
  },

  resumeGame: () => {
    const { phase } = get()
    if (phase === 'paused') set({ phase: 'playing' })
  },

  onBrickDestroyed: (basePoints) =>
    set((s) => {
      const streak = s.brickStreak + 1
      const mul = Math.min(5, Math.max(1, streak))
      return { score: s.score + basePoints * mul, brickStreak: streak }
    }),

  registerBallLost: () => {
    const s = get()
    const nextLives = s.lives - 1
    if (nextLives <= 0) {
      resetMenuStartLevelToFirst()
      const { entry, brokeRecord } = addLeaderboardEntry(s.score, s.level)
      set({
        lives: 0,
        brickStreak: 0,
        phase: 'gameOver',
        lastRecordId: entry.id,
        lastBrokeRecord: brokeRecord,
      })
      return false
    }
    set({ lives: nextLives, brickStreak: 0 })
    return true
  },

  notifyLevelClear: () => {
    const s = get()
    const durationSec = (now() - s.levelStartedAt) / 1000
    const levelScore = s.score - s.scoreAtLevelStart
    let stars: 1 | 2 | 3 = 1
    if ((s.lives >= 3 && durationSec < 55) || (s.lives >= 2 && durationSec < 38)) stars = 3
    else if (s.lives >= 2 && durationSec < 100) stars = 2
    set({
      phase: 'levelClear',
      lastLevelScoreDelta: levelScore,
      lastLevelStars: stars,
    })
  },

  advanceLevel: () => {
    set((s) => ({
      level: s.level + 1,
      brickStreak: 0,
      phase: 'playing',
      scoreAtLevelStart: s.score,
      levelStartedAt: now(),
    }))
    setMenuStartLevel(get().level)
  },
}))
