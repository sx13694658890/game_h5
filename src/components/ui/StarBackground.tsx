import { useMemo } from 'react'

type Star = { id: number; left: string; top: string; size: number; delay: string; duration: string }

/** 多层星空：随机星点 + 不同闪烁周期（阶段三） */
export function StarBackground() {
  const stars = useMemo(() => {
    const out: Star[] = []
    for (let i = 0; i < 56; i++) {
      out.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2.2 + 0.6,
        delay: `${(Math.random() * 4).toFixed(2)}s`,
        duration: `${2.5 + Math.random() * 3.5}s`,
      })
    }
    return out
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.55]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,229,255,0.12),transparent_50%),radial-gradient(ellipse_at_80%_30%,rgba(247,201,72,0.08),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(15,23,42,0.9),#0a0e1a)]" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="star-twinkle absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDuration: s.duration,
            animationDelay: s.delay,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.8)`,
          }}
        />
      ))}
    </div>
  )
}
