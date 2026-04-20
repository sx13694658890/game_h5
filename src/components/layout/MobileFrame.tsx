import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

/**
 * 移动端安全区域 + 最大宽度容器，后续可接 letterbox 缩放
 */
export function MobileFrame({ children }: Props) {
  return (
    <div
      className="mx-auto flex h-full w-full max-w-[428px] flex-col bg-game-bg"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {children}
    </div>
  )
}
