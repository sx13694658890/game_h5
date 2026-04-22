/** 避免 StrictMode / 重复 effect 下多次通知父级排行榜高亮 */
let lastNotifiedRecordId: string | null = null

export function resetGameOverHighlightFlag(): void {
  lastNotifiedRecordId = null
}

export function consumeGameOverHighlightOnce(recordId: string): boolean {
  if (lastNotifiedRecordId === recordId) return false
  lastNotifiedRecordId = recordId
  return true
}
