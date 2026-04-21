import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { BRICK_SCORE, GAME_CONFIG } from '../../config/gameConfig'
import { buildBricksFromLevel, LEVELS } from '../../config/levels'
import { theme } from '../../config/theme'
import { circlePaddleCollision, circleRectCollision } from '../../engine/collision'
import { drawParticles, spawnBrickBreakParticles, updateParticles, type Particle } from '../../engine/particleEngine'
import {
  bounceWallX,
  bounceWallY,
  bounceWithNormal,
  enforceBallSpeed,
  reflectOffPaddle,
} from '../../engine/physics'
import { useGameLoop } from '../../hooks/useGameLoop'
import { useGameAudio } from '../../hooks/useAudio'
import { usePaddleControl } from '../../hooks/usePaddle'
import { useGameStore } from '../../store/gameStore'
import { difficultyMultipliers, useSettingsStore } from '../../store/settingsStore'
import type { BallState, BrickState, LevelConfig, PaddleState } from '../../types/game'
import { clamp, vecAdd, vecScale } from '../../utils/math'

const TRAIL_LEN = 5

type Sim = {
  w: number
  h: number
  ball: BallState
  paddle: PaddleState
  bricks: BrickState[]
  particles: Particle[]
  ballTrail: { x: number; y: number }[]
}

function levelConfigForIndex(level1Based: number): LevelConfig {
  const idx = Math.max(0, (level1Based - 1) % LEVELS.length)
  return LEVELS[idx]!
}

function createSim(w: number, h: number, cfg: LevelConfig, mul: { ball: number; paddle: number }): Sim {
  const bricks = buildBricksFromLevel(cfg, w)
  const pw = Math.max(72, cfg.paddleWidth * mul.paddle)
  const paddleY = h - GAME_CONFIG.paddleYInset
  const paddleX = w / 2 - pw / 2
  const spd = cfg.ballSpeed * mul.ball
  const angle = (Math.random() - 0.5) * 0.55
  const vx = Math.sin(angle) * spd
  const vy = -Math.abs(Math.cos(angle)) * spd
  return {
    w,
    h,
    ball: {
      pos: { x: w / 2, y: paddleY - 48 },
      vel: { x: vx, y: vy },
      radius: GAME_CONFIG.ballRadius,
      speed: spd,
    },
    paddle: {
      x: paddleX,
      y: paddleY,
      width: pw,
      height: GAME_CONFIG.paddleHeight,
    },
    bricks,
    particles: [],
    ballTrail: [],
  }
}

function resetBallAbovePaddle(sim: Sim) {
  const { ball, paddle } = sim
  const angle = (Math.random() - 0.5) * 0.55
  const spd = ball.speed
  ball.pos = {
    x: paddle.x + paddle.width / 2,
    y: paddle.y - ball.radius - 4,
  }
  ball.vel = {
    x: Math.sin(angle) * spd,
    y: -Math.abs(Math.cos(angle)) * spd,
  }
  sim.ballTrail = []
}

function syncCanvasPixels(canvas: HTMLCanvasElement, w: number, h: number) {
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2.5)
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function drawBricks(
  ctx: CanvasRenderingContext2D,
  bricks: BrickState[],
  useRoundRect: boolean,
) {
  for (const b of bricks) {
    ctx.fillStyle = b.color
    ctx.strokeStyle = theme.colorBorder
    ctx.lineWidth = 1
    if (useRoundRect && typeof ctx.roundRect === 'function') {
      ctx.beginPath()
      ctx.roundRect(b.pos.x, b.pos.y, b.width, b.height, 4)
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.fillRect(b.pos.x, b.pos.y, b.width, b.height)
      ctx.strokeRect(b.pos.x, b.pos.y, b.width, b.height)
    }
    if (b.hp > 1) {
      ctx.fillStyle = '#fff'
      ctx.font = '10px sans-serif'
      ctx.fillText(String(b.hp), b.pos.x + 4, b.pos.y + 12)
    }
  }
}

function drawBallTrail(
  ctx: CanvasRenderingContext2D,
  trail: { x: number; y: number }[],
  ball: BallState,
) {
  const n = trail.length
  for (let i = n - 1; i >= 0; i--) {
    const t = trail[i]!
    const k = (i + 1) / (n + 1)
    ctx.globalAlpha = 0.12 + k * 0.28
    ctx.fillStyle = theme.colorAccent
    ctx.beginPath()
    ctx.arc(t.x, t.y, ball.radius * (0.42 + 0.1 * i), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

type Props = {
  sessionKey: number
}

export function GameCanvas({ sessionKey }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const simRef = useRef<Sim | null>(null)
  const metricsRef = useRef({ gameWidth: 320, paddleWidth: 96 })
  const paddleSoundAt = useRef(0)
  const level = useGameStore((s) => s.level)
  const phase = useGameStore((s) => s.phase)
  const difficulty = useSettingsStore((s) => s.difficulty)
  const audio = useGameAudio()
  const audioRef = useRef(audio)
  audioRef.current = audio

  const { targetCenterXRef, onPointerDown, onPointerMove, onPointerUp } = usePaddleControl(metricsRef, phase === 'playing')

  const resetSimFromLevel = useCallback(() => {
    const wrap = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const rect = wrap.getBoundingClientRect()
    const w = Math.max(200, rect.width)
    const h = Math.max(240, rect.height)
    syncCanvasPixels(canvas, w, h)
    const cfg = levelConfigForIndex(level)
    const mul = difficultyMultipliers(difficulty)
    metricsRef.current = { gameWidth: w, paddleWidth: Math.max(72, cfg.paddleWidth * mul.paddle) }
    simRef.current = createSim(w, h, cfg, mul)
  }, [level, difficulty])

  useLayoutEffect(() => {
    resetSimFromLevel()
  }, [resetSimFromLevel, sessionKey])

  useEffect(() => {
    const wrap = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const applySizeOnly = () => {
      const rect = wrap.getBoundingClientRect()
      const w = Math.max(200, rect.width)
      const h = Math.max(240, rect.height)
      const sim = simRef.current
      if (!sim) {
        syncCanvasPixels(canvas, w, h)
        return
      }
      const sx = w / sim.w
      const sy = h / sim.h
      sim.w = w
      sim.h = h
      sim.ball.pos.x *= sx
      sim.ball.pos.y *= sy
      sim.paddle.x *= sx
      sim.paddle.y = h - GAME_CONFIG.paddleYInset
      const cfg = levelConfigForIndex(level)
      const mul = difficultyMultipliers(useSettingsStore.getState().difficulty)
      sim.paddle.width = Math.max(72, cfg.paddleWidth * mul.paddle)
      sim.paddle.x = clamp(sim.paddle.x, 0, w - sim.paddle.width)
      for (const b of sim.bricks) {
        b.pos.x *= sx
        b.pos.y *= sy
        b.width *= sx
        b.height *= sy
      }
      for (const p of sim.particles) {
        p.pos.x *= sx
        p.pos.y *= sy
      }
      for (const t of sim.ballTrail) {
        t.x *= sx
        t.y *= sy
      }
      metricsRef.current = { gameWidth: w, paddleWidth: sim.paddle.width }
      syncCanvasPixels(canvas, w, h)
    }

    const ro = new ResizeObserver(applySizeOnly)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [level, difficulty])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const sim = simRef.current
    if (!canvas || !sim) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { w, h, ball, paddle, bricks, particles, ballTrail } = sim
    const useRound = typeof ctx.roundRect === 'function'

    ctx.fillStyle = theme.colorBg
    ctx.fillRect(0, 0, w, h)
    drawBricks(ctx, bricks, useRound)
    drawParticles(ctx, particles)
    drawBallTrail(ctx, ballTrail, ball)

    ctx.fillStyle = theme.colorPrimary
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)

    ctx.beginPath()
    ctx.fillStyle = theme.colorAccent
    ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = theme.colorAccent
    ctx.lineWidth = 1
    ctx.stroke()
  }, [])

  const tick = useCallback(
    (dtMs: number) => {
      const sim = simRef.current
      if (!sim) return
      if (useGameStore.getState().phase !== 'playing') return

      const dt = Math.min(dtMs / 1000, 1 / 30)
      const { ball, paddle, bricks, particles, ballTrail } = sim
      const { w, h } = sim

      const targetX = targetCenterXRef.current
      if (targetX != null) {
        paddle.x = targetX - paddle.width / 2
      }
      paddle.x = Math.max(0, Math.min(w - paddle.width, paddle.x))

      ball.pos.x += ball.vel.x * dt
      ball.pos.y += ball.vel.y * dt
      ball.vel = enforceBallSpeed(ball.vel, ball.speed)

      const r = ball.radius
      if (ball.pos.x - r < 0) {
        ball.pos.x = r
        ball.vel = bounceWallX(ball.vel)
      } else if (ball.pos.x + r > w) {
        ball.pos.x = w - r
        ball.vel = bounceWallX(ball.vel)
      }
      if (ball.pos.y - r < 0) {
        ball.pos.y = r
        ball.vel = bounceWallY(ball.vel)
      }

      for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i]!
        const hit = circleRectCollision(ball, brick)
        if (!hit.hit) continue

        ball.pos = vecAdd(ball.pos, vecScale(hit.normal, hit.penetration + 0.5))
        ball.vel = enforceBallSpeed(bounceWithNormal(ball.vel, hit.normal), ball.speed)

        brick.hp -= 1
        if (brick.hp <= 0) {
          const cx = brick.pos.x + brick.width / 2
          const cy = brick.pos.y + brick.height / 2
          particles.push(...spawnBrickBreakParticles(cx, cy, brick.color, brick.type))
          audioRef.current.brickBreak()
          const base = BRICK_SCORE[brick.type]
          useGameStore.getState().onBrickDestroyed(base)
          bricks.splice(i, 1)
          if (bricks.length === 0) {
            useGameStore.getState().notifyLevelClear()
            updateParticles(particles, dt)
            draw()
            return
          }
        } else {
          audioRef.current.brickHit()
        }
        break
      }

      if (ball.vel.y > 0) {
        const ph = circlePaddleCollision(ball, paddle)
        if (ph.hit) {
          ball.pos.y = Math.min(ball.pos.y, paddle.y - ball.radius - 0.5)
          ball.vel = enforceBallSpeed(reflectOffPaddle(ball, paddle), ball.speed)
          const t = performance.now()
          if (t - paddleSoundAt.current > 200) {
            paddleSoundAt.current = t
            audioRef.current.paddleHit()
          }
        }
      }

      if (ball.pos.y - r > h) {
        audioRef.current.lifeLost()
        const alive = useGameStore.getState().registerBallLost()
        if (alive) {
          resetBallAbovePaddle(sim)
        } else {
          setTimeout(() => audioRef.current.gameOver(), 280)
          draw()
          return
        }
      }

      updateParticles(particles, dt)
      ballTrail.unshift({ x: ball.pos.x, y: ball.pos.y })
      if (ballTrail.length > TRAIL_LEN) ballTrail.length = TRAIL_LEN

      draw()
    },
    [draw, targetCenterXRef],
  )

  useGameLoop(tick, phase === 'playing')

  useEffect(() => {
    draw()
  }, [draw, phase, sessionKey, level])

  return (
    <div
      ref={wrapperRef}
      className="relative min-h-[280px] flex-1 touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas ref={canvasRef} className="block h-full w-full rounded-lg border border-slate-800" aria-label="游戏画布" />
    </div>
  )
}
