/** 星空背景（阶段三 Sprint 2 动效） */
export function StarBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-40"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.15),_transparent_55%)]" />
    </div>
  )
}
