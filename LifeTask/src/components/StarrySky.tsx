import { useMemo } from 'react'
import { content } from '../content'

type Star = {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
  opacity: number
}

function seededStars(count: number): Star[] {
  let seed = 42
  const next = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  return Array.from({ length: count }, (_, id) => ({
    id,
    left: next() * 100,
    top: next() * 100,
    size: 1 + next() * 2.2,
    delay: next() * 4,
    duration: 2.2 + next() * 3.4,
    opacity: 0.35 + next() * 0.65,
  }))
}

export function StarrySky() {
  const stars = useMemo(() => seededStars(90), [])
  const bg = content.backgroundUrl

  return (
    <div className="sky" aria-hidden="true">
      <div
        className="sky-photo"
        style={bg ? { backgroundImage: `url(${bg})` } : undefined}
      />
      <div className="sky-wash" />
      <div className="stars">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
      <div className="moon-track">
        <div className="moon" />
      </div>
    </div>
  )
}
