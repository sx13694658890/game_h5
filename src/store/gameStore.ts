import { create } from 'zustand'
import type { BallState, BrickState, GamePhase, PaddleState } from '../types/game'

export interface GameStoreState {
  phase: GamePhase
  score: number
  combo: number
  lives: number
  level: number
  ball: BallState | null
  paddle: PaddleState | null
  bricks: BrickState[]
  setPhase: (phase: GamePhase) => void
}

export const useGameStore = create<GameStoreState>((set) => ({
  phase: 'idle',
  score: 0,
  combo: 0,
  lives: 3,
  level: 1,
  ball: null,
  paddle: null,
  bricks: [],
  setPhase: (phase) => set({ phase }),
}))
