import { useCallback, useMemo } from 'react'
import { gameSynth } from '../engine/audioSynth'
import { useSettingsStore } from '../store/settingsStore'

/**
 * 游戏内音效：尊重设置里的音效开关
 */
export function useGameAudio() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)

  const wrap = useCallback(
    (fn: () => Promise<void>) => {
      if (!soundEnabled) return
      void fn().catch(() => {
        /* 浏览器拒绝 AudioContext 时忽略 */
      })
    },
    [soundEnabled],
  )

  return useMemo(
    () => ({
      paddleHit: () => wrap(() => gameSynth.playPaddleHit()),
      brickHit: () => wrap(() => gameSynth.playBrickHit()),
      brickBreak: () => wrap(() => gameSynth.playBrickBreak()),
      lifeLost: () => wrap(() => gameSynth.playLifeLost()),
      levelClear: () => wrap(() => gameSynth.playLevelClear()),
      gameOver: () => wrap(() => gameSynth.playGameOver()),
    }),
    [wrap],
  )
}
