import { readJson, writeJson } from './storage'

/** 主菜单「开始游戏」时进入的关卡（1-based），通关后推进，游戏失败后重置为 1 */
const KEY = 'menu-start-level'

export function getMenuStartLevel(): number {
  const n = readJson<number>(KEY, 1)
  return typeof n === 'number' && Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
}

export function setMenuStartLevel(level: number): void {
  writeJson(KEY, Math.max(1, Math.floor(level)))
}

export function resetMenuStartLevelToFirst(): void {
  writeJson(KEY, 1)
}
