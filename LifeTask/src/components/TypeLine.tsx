import { useEffect, useRef, useState } from 'react'

type TypeLineProps = {
  text: string
  started: boolean
  charMs: number
  className?: string
  onDone?: () => void
}

export function TypeLine({
  text,
  started,
  charMs,
  className,
  onDone,
}: TypeLineProps) {
  const [count, setCount] = useState(0)
  const finished = useRef(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!started) {
      setCount(0)
      finished.current = false
      return
    }

    if (count >= text.length) {
      if (!finished.current) {
        finished.current = true
        onDoneRef.current?.()
      }
      return
    }

    const timer = window.setTimeout(() => setCount((n) => n + 1), charMs)
    return () => window.clearTimeout(timer)
  }, [started, count, text, charMs])

  return (
    <p className={className}>
      {text.slice(0, count)}
      {started && count < text.length ? <span className="caret" /> : null}
    </p>
  )
}
