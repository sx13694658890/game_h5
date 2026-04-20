import { useState } from 'react'
import { MobileFrame } from './components/layout/MobileFrame'
import { StarBackground } from './components/ui/StarBackground'
import { GamePage } from './pages/GamePage'
import { MenuPage } from './pages/MenuPage'

type Route = 'menu' | 'game'

function App() {
  const [route, setRoute] = useState<Route>('menu')

  return (
    <MobileFrame>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <StarBackground />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          {route === 'menu' ? (
            <MenuPage onStart={() => setRoute('game')} />
          ) : (
            <GamePage onBack={() => setRoute('menu')} />
          )}
        </div>
        {/* Tailwind 校验：霓虹描边 + 正文字体；CSS 变量：星光金 */}
        <p className="pointer-events-none absolute bottom-2 left-0 right-0 z-20 text-center font-body text-[10px] text-[var(--color-accent)] opacity-70">
          v0 脚手架 · Tailwind + CSS 变量已启用
        </p>
      </div>
    </MobileFrame>
  )
}

export default App
