/** Web Audio API 合成音效（无外部音频文件） */

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  return ctx
}

async function ensureRunning(): Promise<AudioContext | null> {
  const c = getCtx()
  if (!c) return null
  if (c.state === 'suspended') await c.resume()
  return c
}

function beep(
  freq: number,
  dur: number,
  vol = 0.08,
  type: OscillatorType = 'sine',
  freqEnd?: number,
): void {
  const c = getCtx()
  if (!c) return
  const t = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (freqEnd != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t + dur)
  }
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.04)
}

function noiseBurst(dur: number, vol: number): void {
  const c = getCtx()
  if (!c) return
  const t = c.currentTime
  const len = Math.ceil(c.sampleRate * dur)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource()
  src.buffer = buf
  const g = c.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(g).connect(c.destination)
  src.start(t)
}

export const gameSynth = {
  async playPaddleHit(): Promise<void> {
    await ensureRunning()
    beep(160, 0.07, 0.11, 'triangle', 90)
  },

  async playBrickHit(): Promise<void> {
    await ensureRunning()
    beep(920, 0.035, 0.06, 'sine')
  },

  async playBrickBreak(): Promise<void> {
    await ensureRunning()
    noiseBurst(0.08, 0.07)
    beep(440, 0.1, 0.05, 'square', 120)
  },

  async playLifeLost(): Promise<void> {
    await ensureRunning()
    beep(220, 0.25, 0.1, 'sawtooth', 55)
  },

  /** 约 2.5s 简单胜利旋律 */
  async playLevelClear(): Promise<void> {
    const c = await ensureRunning()
    if (!c) return
    const t0 = c.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99]
    const step = 0.38
    notes.forEach((f, i) => {
      const t = t0 + i * step
      const osc = c.createOscillator()
      const g = c.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(f, t)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.linearRampToValueAtTime(0.07, t + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32)
      osc.connect(g).connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.35)
    })
  },

  async playGameOver(): Promise<void> {
    await ensureRunning()
    beep(330, 0.2, 0.08, 'sine', 196)
    setTimeout(() => {
      beep(196, 0.35, 0.07, 'sine', 130)
    }, 180)
  },
}
