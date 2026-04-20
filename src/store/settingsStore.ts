import { create } from 'zustand'

export type Difficulty = 'easy' | 'normal' | 'hard'

export interface SettingsState {
  soundEnabled: boolean
  difficulty: Difficulty
  setSoundEnabled: (v: boolean) => void
  setDifficulty: (d: Difficulty) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  soundEnabled: true,
  difficulty: 'normal',
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setDifficulty: (difficulty) => set({ difficulty }),
}))
