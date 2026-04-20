/** Canvas 游戏渲染层（阶段二实现） */
export function GameCanvas() {
  return (
    <canvas
      className="block w-full flex-1 touch-none rounded-lg border border-slate-800 bg-slate-950/80"
      aria-label="游戏画布"
    />
  )
}
