/** 粒子引擎（阶段三 Sprint 2 实现） */
export type Particle = {
  pos: { x: number; y: number }
  vel: { x: number; y: number }
  life: number
  color: string
  size: number
}

export function spawnParticles(_at: { x: number; y: number }, _count: number): Particle[] {
  void _at
  void _count
  return []
}
