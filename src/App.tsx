import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { MobileFrame } from './components/layout/MobileFrame'
import { StarBackground } from './components/ui/StarBackground'
import { GamePage } from './pages/GamePage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { MenuPage } from './pages/MenuPage'
import { SettingsPage } from './pages/SettingsPage'
import { getHighScore } from './utils/leaderboard'

type Route = 'menu' | 'game' | 'leaderboard' | 'settings'

function App() {
  const [route, setRoute] = useState<Route>('menu')
  const [leaderHighlightId, setLeaderHighlightId] = useState<string | null>(null)

  const handleGameOverRecorded = useCallback((p: { entryId: string; brokeRecord: boolean }) => {
    setLeaderHighlightId(p.entryId)
  }, [])

  const openLeaderboardFromMenu = useCallback(() => {
    setLeaderHighlightId(null)
    setRoute('leaderboard')
  }, [])

  const openLeaderboardFromGameOver = useCallback(() => {
    setRoute('leaderboard')
  }, [])

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
            {route === 'menu' && (
              <MenuPage
                highScore={getHighScore()}
                onStart={() => setRoute('game')}
                onLeaderboard={openLeaderboardFromMenu}
                onSettings={() => setRoute('settings')}
              />
            )}
            {route === 'game' && (
              <GamePage
                onBack={() => setRoute('menu')}
                onGoLeaderboard={openLeaderboardFromGameOver}
                onGameOverRecorded={handleGameOverRecorded}
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
