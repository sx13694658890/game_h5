import { readJson, writeJson } from './storage'

export type LeaderboardEntry = {
  id: string
  score: number
  /** 到达关卡（1-based） */
  level: number
  /** ISO 日期时间 */
  at: string
}

const KEY = 'leaderboard'

function sortEntries(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (b.score !== a.score) return b.score - a.score
  return new Date(b.at).getTime() - new Date(a.at).getTime()
}

export function getLeaderboard(): LeaderboardEntry[] {
  const list = readJson<LeaderboardEntry[]>(KEY, [])
  return [...list].sort(sortEntries).slice(0, 10)
}

export function getHighScore(): number {
  const list = getLeaderboard()
  return list.length ? list[0]!.score : 0
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * 写入一条记录并保留 Top10；返回新条目、是否打破历史最高、在榜内名次（1-based，未进榜为 0）
 */
export function addLeaderboardEntry(
  score: number,
  level: number,
): { entry: LeaderboardEntry; brokeRecord: boolean; rank: number } {
  const prevHigh = getHighScore()
  const brokeRecord = score > prevHigh
  const entry: LeaderboardEntry = {
    id: newId(),
    score,
    level,
    at: new Date().toISOString(),
  }
  const merged = [...getLeaderboard(), entry].sort(sortEntries).slice(0, 10)
  writeJson(KEY, merged)
  const rank = merged.findIndex((e) => e.id === entry.id) + 1
  return { entry, brokeRecord, rank }
}

export function clearLeaderboard(): void {
  writeJson(KEY, [] as LeaderboardEntry[])
}
