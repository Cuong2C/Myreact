import { useEffect, useLayoutEffect, useState } from 'react'
import { content } from '../content'

const HEART =
  'M 150 88 C 150 88 132 52 98 48 C 52 42 28 86 48 128 C 72 176 150 236 150 236 C 150 236 228 176 252 128 C 272 86 248 42 202 48 C 168 52 150 88 150 88'

const STEPS = 70
const CLUSTER = 9
const SPREAD = 8.5

type Dot = {
  x: number
  y: number
  size: number
  t: number
}

function seeded() {
  let seed = 97
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

function sampleRibbon(): Dot[] {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', HEART)
  svg.appendChild(path)
  document.body.appendChild(svg)

  const len = path.getTotalLength()
  const rand = seeded()
  const dots: Dot[] = []

  for (let i = 0; i < STEPS; i += 1) {
    const dist = (i / STEPS) * len
    const p = path.getPointAtLength(dist)
    const q = path.getPointAtLength(Math.min(len, dist + 3))
    const dx = q.x - p.x
    const dy = q.y - p.y
    const mag = Math.hypot(dx, dy) || 1
    const nx = -dy / mag
    const ny = dx / mag
    const t = i / (STEPS - 1)

    for (let k = 0; k < CLUSTER; k += 1) {
      const side = (rand() * 2 - 1) * SPREAD
      const along = (rand() * 2 - 1) * 2.8
      dots.push({
        x: p.x + nx * side + (dx / mag) * along,
        y: p.y + ny * side + (dy / mag) * along,
        size: 0.7 + rand() * 2.6,
        t,
      })
    }
  }

  svg.remove()
  return dots
}

type FairyHeartProps = {
  active: boolean
}

export function FairyHeart({ active }: FairyHeartProps) {
  const [dots, setDots] = useState<Dot[]>([])
  const [beating, setBeating] = useState(false)

  useLayoutEffect(() => {
    setDots(sampleRibbon())
  }, [])

  useEffect(() => {
    if (!active) {
      setBeating(false)
      return
    }
    const timer = window.setTimeout(() => {
      setBeating(true)
    }, content.timings.heartDrawMs)
    return () => window.clearTimeout(timer)
  }, [active])

  if (!active) return null

  return (
    <div className="fairy-layer" aria-hidden="true">
      <div
        className={`fairy-scene${beating ? ' is-beating' : ''}`}
        style={{ '--draw-ms': `${content.timings.heartDrawMs}ms` }}
      >
        <svg className="heart-svg" viewBox="0 0 300 260">
          <defs>
            <filter id="ribbon-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#ribbon-glow)">
            {dots.map((dot, i) => (
              <circle
                key={i}
                className="heart-dot"
                cx={dot.x}
                cy={dot.y}
                r={dot.size}
                style={{ '--t': String(dot.t) }}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
