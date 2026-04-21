import type { BrickType } from '../types/game'

export type Particle = {
  pos: { x: number; y: number }
  vel: { x: number; y: number }
  life: number
  maxLife: number
  color: string
  size: number
  gravity: number
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * 砖块消除时生成 12～20 个粒子，带重力与生命周期（透明度由 life/maxLife）
 */
export function spawnBrickBreakParticles(
  cx: number,
  cy: number,
  baseColor: string,
  type: BrickType,
): Particle[] {
  const count = type === 'gold' ? 20 : Math.floor(rand(12, 17))
  const out: Particle[] = []
  const spread = type === 'gold' ? 520 : 380
  const goldPalette = ['#fde68a', '#fbbf24', '#f59e0b', '#fcd34d']
  for (let i = 0; i < count; i++) {
    const ang = rand(0, Math.PI * 2)
    const spd = rand(120, spread) * (type === 'gold' ? 1.15 : 1)
    const c =
      type === 'gold'
        ? goldPalette[Math.floor(Math.random() * goldPalette.length)]!
        : baseColor
    const maxL = rand(0.55, 0.95)
    out.push({
      pos: { x: cx, y: cy },
      vel: { x: Math.cos(ang) * spd, y: Math.sin(ang) * spd - rand(40, 120) },
      life: maxL,
      maxLife: maxL,
      color: c,
      size: type === 'gold' ? rand(3.2, 5.5) : rand(2.2, 4.2),
      gravity: rand(520, 820),
    })
  }
  return out
}

export function updateParticles(particles: Particle[], dt: number): void {
  for (const p of particles) {
    p.vel.y += p.gravity * dt
    p.pos.x += p.vel.x * dt
    p.pos.y += p.vel.y * dt
    p.life -= dt
  }
  // 原地删除已死粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i]!.life <= 0) particles.splice(i, 1)
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    const a = Math.max(0, p.life / p.maxLife)
    ctx.globalAlpha = a
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}
