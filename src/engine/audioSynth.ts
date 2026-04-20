/** Web Audio 音效合成（阶段三 Sprint 2 实现） */
export function createAudioContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  return new AudioContext()
}
