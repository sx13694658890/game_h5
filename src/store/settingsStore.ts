import { create } from 'zustand'
import { readJson, writeJson } from '../utils/storage'

export type Difficulty = 'easy' | 'normal' | 'hard'

const SETTINGS_KEY = 'settings'

type PersistedSettings = {
  soundEnabled: boolean
  difficulty: Difficulty
}

function load(): PersistedSettings {
  return readJson<PersistedSettings>(SETTINGS_KEY, {
    soundEnabled: true,
    difficulty: 'normal',
  })
}

function save(s: PersistedSettings): void {
  writeJson(SETTINGS_KEY, s)
}

export interface SettingsState extends PersistedSettings {
  setSoundEnabled: (v: boolean) => void
  setDifficulty: (d: Difficulty) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = load()
  return {
    soundEnabled: initial.soundEnabled,
    difficulty: initial.difficulty,
    setSoundEnabled: (soundEnabled) => {
      set({ soundEnabled })
      const { difficulty } = get()
      save({ soundEnabled, difficulty })
    },
    setDifficulty: (difficulty) => {
      set({ difficulty })
      const { soundEnabled } = get()
      save({ soundEnabled, difficulty })
    },
  }
})

/** 难度对球速、挡板宽度的倍率（与关卡基础值相乘） */
export function difficultyMultipliers(d: Difficulty): { ball: number; paddle: number } {
  if (d === 'easy') return { ball: 0.86, paddle: 1.12 }
  if (d === 'hard') return { ball: 1.12, paddle: 0.88 }
  return { ball: 1, paddle: 1 }
}
