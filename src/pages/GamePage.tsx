import { useCallback, useEffect, useRef, useState } from 'react'
import { GameCanvas } from '../components/game/GameCanvas'
import { HUD } from '../components/ui/HUD'
import { LevelClearModal } from '../components/ui/LevelClearModal'
import { PauseModal } from '../components/ui/PauseModal'
import { useGameAudio } from '../hooks/useAudio'
import { useGameStore } from '../store/gameStore'
import { consumeGameOverHighlightOnce, resetGameOverHighlightFlag } from '../utils/gameOverHighlight'

export type GameEntrySource = 'menu' | 'retry'

type Props = {
  entrySource: GameEntrySource
  onBack: () => void
  onGameOver: (p: {
    score: number
    level: number
    brokeRecord: boolean
    entryId: string
  }) => void
}

export function GamePage({ entrySource, onBack, onGameOver }: Props) {
  const [sessionKey, setSessionKey] = useState(0)

  const phase = useGameStore((s) => s.phase)
  const level = useGameStore((s) => s.level)
  const score = useGameStore((s) => s.score)
  const lastLevelScoreDelta = useGameStore((s) => s.lastLevelScoreDelta)
  const lastLevelStars = useGameStore((s) => s.lastLevelStars)
  const lastRecordId = useGameStore((s) => s.lastRecordId)
  const lastBrokeRecord = useGameStore((s) => s.lastBrokeRecord)
  const resetRun = useGameStore((s) => s.resetRun)
  const restartCurrentLevel = useGameStore((s) => s.restartCurrentLevel)
  const beginPlaying = useGameStore((s) => s.beginPlaying)
  const advanceLevel = useGameStore((s) => s.advanceLevel)
  const pauseGame = useGameStore((s) => s.pauseGame)
  const resumeGame = useGameStore((s) => s.resumeGame)
  const audio = useGameAudio()
  const levelClearSound = useRef(false)

  const onGameOverCb = useCallback(
    (p: { score: number; level: number; brokeRecord: boolean; entryId: string }) => {
      onGameOver(p)
    },
    [onGameOver],
  )

  useEffect(() => {
    if (entrySource === 'menu') {
      resetRun()
    }
    beginPlaying()
  }, [entrySource, resetRun, beginPlaying])

  useEffect(() => {
    if (phase === 'playing') {
      resetGameOverHighlightFlag()
      return
    }
    if (phase !== 'gameOver' || !lastRecordId) return
    if (!consumeGameOverHighlightOnce(lastRecordId)) return
    onGameOverCb({
      score,
      level,
      brokeRecord: lastBrokeRecord,
      entryId: lastRecordId,
    })
  }, [phase, lastRecordId, lastBrokeRecord, score, level, onGameOverCb])

  useEffect(() => {
    if (phase === 'levelClear' && !levelClearSound.current) {
      levelClearSound.current = true
      audio.levelClear()
    }
    if (phase === 'playing') levelClearSound.current = false
  }, [phase, audio])

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        const { phase: ph, pauseGame: pause } = useGameStore.getState()
        if (ph === 'playing') pause()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const restartSession = () => {
    restartCurrentLevel()
    beginPlaying()
    setSessionKey((k) => k + 1)
  }

  const exitToMenu = () => {
    resetRun()
    onBack()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
      <header className="flex shrink-0 items-center justify-between font-body text-xs text-slate-400">
        <button
          type="button"
          className="text-game-primary underline-offset-2 hover:underline"
          onClick={exitToMenu}
        >
          返回
        </button>
        <span>星际弹球</span>
      </header>

      <HUD />

      <div className="relative flex min-h-0 flex-1 flex-col">
        {phase === 'playing' && (
          <button
            type="button"
            className="absolute right-2 top-2 z-20 rounded-lg border border-slate-600 bg-slate-900/90 px-2.5 py-1 font-body text-[11px] text-game-primary shadow-md"
            onClick={() => pauseGame()}
          >
            暂停
          </button>
        )}

        <GameCanvas sessionKey={sessionKey} />

        <LevelClearModal
          open={phase === 'levelClear'}
          levelScore={lastLevelScoreDelta}
          stars={lastLevelStars}
          totalScore={score}
          clearedLevel={level}
          onNext={() => advanceLevel()}
        />

        <PauseModal
          open={phase === 'paused'}
          onResume={() => resumeGame()}
          onRestart={restartSession}
          onExitMenu={exitToMenu}
        />
      </div>
    </div>
  )
}
