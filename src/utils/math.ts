import type { Vec2 } from '../types/game'

export function vecAdd(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function vecSub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function vecScale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s }
}

export function vecLenSq(v: Vec2): number {
  return v.x * v.x + v.y * v.y
}

export function vecLen(v: Vec2): number {
  return Math.sqrt(vecLenSq(v))
}

export function vecNormalize(v: Vec2): Vec2 {
  const len = vecLen(v)
  if (len < 1e-8) return { x: 0, y: 0 }
  return { x: v.x / len, y: v.y / len }
}

export function vecDot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y
}

/** 将速度 v 沿单位法线 n 做镜面反射（n 指向球外侧） */
export function reflectVelocity(v: Vec2, n: Vec2): Vec2 {
  const nn = vecNormalize(n)
  const d = vecDot(v, nn)
  return vecSub(v, vecScale(nn, 2 * d))
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}
