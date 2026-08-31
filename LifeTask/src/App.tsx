import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { FairyHeart } from './components/FairyHeart'
import { StarrySky } from './components/StarrySky'
import { TypeLine } from './components/TypeLine'
import { content } from './content'
import { cssVars } from './cssVars'
import './App.css'

type Phase = 'intro' | 'left' | 'reveal' | 'story' | 'celebrate'
type Point = { left: number; top: number }

const YES_GAP = 28
const EDGE_PAD = 16
const MIN_JUMP = 52

function overlapsYes(
  point: Point,
  width: number,
  height: number,
  yesBox: DOMRect | undefined,
) {
  if (!yesBox) return false

  return !(
    point.left + width + YES_GAP < yesBox.left ||
    point.left - YES_GAP > yesBox.right ||
    point.top + height + YES_GAP < yesBox.top ||
    point.top - YES_GAP > yesBox.bottom
  )
}

function pickAroundYes(
  yesBox: DOMRect,
  width: number,
  height: number,
  last: Point | null,
): Point {
  const cx = (yesBox.left + yesBox.right) / 2
  const cy = (yesBox.top + yesBox.bottom) / 2
  const minR = content.noDodge.minAway
  const maxR = content.noDodge.maxAway
  const maxX = Math.max(EDGE_PAD, window.innerWidth - width - EDGE_PAD)
  const maxY = Math.max(EDGE_PAD, window.innerHeight - height - EDGE_PAD)

  for (let i = 0; i < 20; i += 1) {
    const angle = Math.random() * Math.PI * 2
    const dist = minR + Math.random() * (maxR - minR)
    const point: Point = {
      left: Math.min(maxX, Math.max(EDGE_PAD, cx + Math.cos(angle) * dist - width / 2)),
      top: Math.min(maxY, Math.max(EDGE_PAD, cy + Math.sin(angle) * dist - height / 2)),
    }

    if (overlapsYes(point, width, height, yesBox)) continue
    if (
      last &&
      Math.hypot(point.left - last.left, point.top - last.top) < MIN_JUMP
    ) {
      continue
    }

    return point
  }

  return {
    left: Math.min(maxX, yesBox.right + YES_GAP),
    top: Math.min(maxY, Math.max(EDGE_PAD, yesBox.top)),
  }
}

function App() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [introOn, setIntroOn] = useState(false)
  const [typedDone, setTypedDone] = useState(false)
  const [noPos, setNoPos] = useState<Point | null>(null)
  const yesRef = useRef<HTMLButtonElement>(null)

  const skyOn = phase === 'reveal' || phase === 'story' || phase === 'celebrate'
  const showIntro = phase === 'intro' && introOn
  const showStory = phase === 'story'
  const showAsk3 = showStory && typedDone
  const noSpot = noPos

  useEffect(() => {
    document.title = content.pageTitle
    const timer = window.setTimeout(() => setIntroOn(true), 80)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (phase !== 'reveal') return
    const timer = window.setTimeout(() => {
      setPhase('story')
    }, content.timings.skyRevealMs + content.timings.storyDelayMs)
    return () => window.clearTimeout(timer)
  }, [phase])

  function handleIntroNo() {
    setPhase('left')
  }

  function handleIntroYes() {
    setPhase('reveal')
  }

  function dodgeNo(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    const noBtn = event.currentTarget
    const yesBox = yesRef.current?.getBoundingClientRect()
    const width = noBtn.offsetWidth
    const height = noBtn.offsetHeight

    if (!yesBox) return

    setNoPos(pickAroundYes(yesBox, width, height, noPos))
  }

  function handleAgree() {
    setPhase('celebrate')
  }

  return (
    <div className={`stage${skyOn ? ' is-ready' : ''}`}>
      <StarrySky />
      <FairyHeart active={phase === 'celebrate'} />

      <main className="stage-main">
        <div
          className={`ask${showIntro ? ' is-visible' : ''}`}
          style={cssVars({ '--ask-fade': `${content.timings.introFadeMs}ms` })}
          inert={!showIntro}
        >
          <p className="ask-q">{content.scene1.question}</p>
          <div className="ask-actions">
            <button type="button" className="ask-btn" onClick={handleIntroYes}>
              {content.scene1.yes}
            </button>
            <button type="button" className="ask-btn" onClick={handleIntroNo}>
              {content.scene1.no}
            </button>
          </div>
        </div>

        <div
          className={`story${showStory ? ' is-visible' : ''}`}
          inert={!showStory}
        >
          <TypeLine
            className="story-line"
            text={content.scene2.text}
            started={showStory}
            charMs={content.timings.charMs}
            onDone={() => setTypedDone(true)}
          />

          <div
            className={`ask ask-follow${showAsk3 ? ' is-visible' : ''}`}
            style={cssVars({ '--ask-fade': `${content.timings.questionFadeMs}ms` })}
            inert={!showAsk3}
          >
            <p className="ask-q ask-q-sm">{content.scene3.question}</p>
            <div className="ask-actions">
              <button
                ref={yesRef}
                type="button"
                className="ask-btn"
                onClick={handleAgree}
              >
                {content.scene3.yes}
              </button>
              {noSpot ? <span className="ask-btn-slot" aria-hidden="true" /> : null}
              <button
                type="button"
                className={`ask-btn${noSpot ? ' is-fleeing' : ''}`}
                style={
                  noSpot
                    ? { left: noSpot.left, top: noSpot.top }
                    : undefined
                }
                onPointerDown={dodgeNo}
              >
                {content.scene3.no}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
