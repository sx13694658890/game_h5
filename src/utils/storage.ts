const PREFIX = 'star-pinball:'

export function storageKey(key: string): string {
  return `${PREFIX}${key}`
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(key))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): void {
  localStorage.setItem(storageKey(key), JSON.stringify(value))
}
