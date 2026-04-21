import { useCallback, useEffect, useRef, useState } from 'react'

/** 避免 StrictMode 下重复通知父级高亮 */
let gameOverHighlightNotifiedId: string | null = null
import { GameCanvas } from '../components/game/GameCanvas'
import { HUD } from '../components/ui/HUD'
import { GameOverPanel } from '../components/ui/GameOverPanel'
import { LevelClearModal } from '../components/ui/LevelClearModal'
import { PauseModal } from '../components/ui/PauseModal'
import { useGameAudio } from '../hooks/useAudio'
import { useGameStore } from '../store/gameStore'

type Props = {
  onBack: () => void
  onGoLeaderboard: () => void
  onGameOverRecorded: (p: { entryId: string; brokeRecord: boolean }) => void
}

export function GamePage({ onBack, onGoLeaderboard, onGameOverRecorded }: Props) {
  const [sessionKey, setSessionKey] = useState(0)

  const phase = useGameStore((s) => s.phase)
  const level = useGameStore((s) => s.level)
  const score = useGameStore((s) => s.score)
  const lastLevelScoreDelta = useGameStore((s) => s.lastLevelScoreDelta)
  const lastLevelStars = useGameStore((s) => s.lastLevelStars)
  const lastRecordId = useGameStore((s) => s.lastRecordId)
  const lastBrokeRecord = useGameStore((s) => s.lastBrokeRecord)
  const resetRun = useGameStore((s) => s.resetRun)
  const beginPlaying = useGameStore((s) => s.beginPlaying)
  const advanceLevel = useGameStore((s) => s.advanceLevel)
  const pauseGame = useGameStore((s) => s.pauseGame)
  const resumeGame = useGameStore((s) => s.resumeGame)
  const audio = useGameAudio()
  const levelClearSound = useRef(false)

  const onGameOverRecordedCb = useCallback(
    (p: { entryId: string; brokeRecord: boolean }) => {
      onGameOverRecorded(p)
    },
    [onGameOverRecorded],
  )

  useEffect(() => {
    resetRun()
    beginPlaying()
  }, [resetRun, beginPlaying])

  useEffect(() => {
    if (phase === 'playing') {
      gameOverHighlightNotifiedId = null
      return
    }
    if (phase !== 'gameOver' || !lastRecordId) return
    if (gameOverHighlightNotifiedId === lastRecordId) return
    gameOverHighlightNotifiedId = lastRecordId
    onGameOverRecordedCb({ entryId: lastRecordId, brokeRecord: lastBrokeRecord })
  }, [phase, lastRecordId, lastBrokeRecord, onGameOverRecordedCb])

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
    resetRun()
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

        {phase === 'gameOver' && (
          <GameOverPanel
            score={score}
            reachedLevel={level}
            brokeRecord={lastBrokeRecord}
            onRetry={restartSession}
            onMenu={exitToMenu}
            onLeaderboard={() => {
              resetRun()
              onGoLeaderboard()
            }}
          />
        )}
      </div>
    </div>
  )
}
