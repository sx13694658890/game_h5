import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { MobileFrame } from './components/layout/MobileFrame'
import { StarBackground } from './components/ui/StarBackground'
import type { GameEntrySource } from './pages/GamePage'
import { GamePage } from './pages/GamePage'
import type { GameOverSnapshot } from './pages/GameOverPage'
import { GameOverPage } from './pages/GameOverPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { LoadingPage } from './pages/LoadingPage'
import { MenuPage } from './pages/MenuPage'
import { SettingsPage } from './pages/SettingsPage'
import { useGameStore } from './store/gameStore'
import { getHighScore } from './utils/leaderboard'

type Route = 'loading' | 'menu' | 'game' | 'game-over' | 'leaderboard' | 'settings'

function App() {
  const [route, setRoute] = useState<Route>('loading')
  const [leaderHighlightId, setLeaderHighlightId] = useState<string | null>(null)
  const [gameOverSnapshot, setGameOverSnapshot] = useState<GameOverSnapshot | null>(null)
  const [gameBootId, setGameBootId] = useState(0)
  const [gameEntrySource, setGameEntrySource] = useState<GameEntrySource>('menu')

  const resetRun = useGameStore((s) => s.resetRun)
  const prepareRetryAfterGameOver = useGameStore((s) => s.prepareRetryAfterGameOver)

  const handleGameOver = useCallback(
    (p: { score: number; level: number; brokeRecord: boolean; entryId: string }) => {
      setLeaderHighlightId(p.entryId)
      setGameOverSnapshot({ score: p.score, level: p.level, brokeRecord: p.brokeRecord })
      setRoute('game-over')
    },
    [],
  )

  const openLeaderboardFromMenu = useCallback(() => {
    setLeaderHighlightId(null)
    setRoute('leaderboard')
  }, [])

  const finishLoading = useCallback(() => {
    setRoute('menu')
  }, [])

  const openGameFromMenu = useCallback(() => {
    setGameEntrySource('menu')
    setGameBootId((k) => k + 1)
    setRoute('game')
  }, [])

  const retryFromGameOver = useCallback(() => {
    prepareRetryAfterGameOver()
    setGameEntrySource('retry')
    setGameBootId((k) => k + 1)
    setGameOverSnapshot(null)
    setRoute('game')
  }, [prepareRetryAfterGameOver])

  const menuFromGameOver = useCallback(() => {
    resetRun()
    setGameOverSnapshot(null)
    setRoute('menu')
  }, [resetRun])

  const leaderboardFromGameOver = useCallback(() => {
    resetRun()
    setGameOverSnapshot(null)
    setRoute('leaderboard')
  }, [resetRun])

  return (
    <MobileFrame>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <StarBackground />
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            className="relative z-10 flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0, x: route === 'game' ? 18 : -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: route === 'menu' ? 12 : -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {route === 'loading' && <LoadingPage onDone={finishLoading} />}
            {route === 'menu' && (
              <MenuPage
                highScore={getHighScore()}
                onStart={openGameFromMenu}
                onLeaderboard={openLeaderboardFromMenu}
                onSettings={() => setRoute('settings')}
              />
            )}
            {route === 'game' && (
              <GamePage
                key={gameBootId}
                entrySource={gameEntrySource}
                onBack={() => setRoute('menu')}
                onGameOver={handleGameOver}
              />
            )}
            {route === 'game-over' && gameOverSnapshot && (
              <GameOverPage
                snapshot={gameOverSnapshot}
                onRetry={retryFromGameOver}
                onMenu={menuFromGameOver}
                onLeaderboard={leaderboardFromGameOver}
              />
            )}
            {route === 'leaderboard' && (
              <LeaderboardPage highlightId={leaderHighlightId} onBack={() => setRoute('menu')} />
            )}
            {route === 'settings' && <SettingsPage onBack={() => setRoute('menu')} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </MobileFrame>
  )
}

export default App
