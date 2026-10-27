import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MazeGame from './MazeGame.jsx'

// Change this to whatever name you want on the page
const NAME = 'Polle'

// Every image dropped into /photos is picked up automatically at build time
const photos = Object.entries(
  import.meta.glob('/photos/*.{jpg,jpeg,png,gif,webp,avif,JPG,JPEG,PNG,GIF,WEBP}', {
    eager: true,
    query: '?url',
    import: 'default',
  })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)

// Words that pop up between the photos
const WORDS = [
  'Waauwie',
  'Ja manjes',
  'Gotndimme',
  'Ewegow',
  'Pipeloikie',
  'Patatteke',
  'Mammiiaaaaa',
  'Stovekeuhhhhh',
  'Kampernoelietje',
]

const rand = (min, max) => min + Math.random() * (max - min)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

/* ---------- Spawner: keeps a varying number of items on screen ---------- */

// Tweak these to change how busy the page feels
const PHOTO_SETTINGS = {
  minAtOnce: 1, // fewest photos on screen
  maxAtOnce: 5, // most photos on screen (on small screens this is capped to 3)
  minGap: 0.6, // seconds between spawn checks (min)
  maxGap: 3.2, // seconds between spawn checks (max)
}

const WORD_SETTINGS = {
  minAtOnce: 0,
  maxAtOnce: 3, // on small screens capped to 2
  minGap: 1.2,
  maxGap: 4,
}

function useSpawner(pool, settings, smallCap, make) {
  const [active, setActive] = useState([])
  const activeRef = useRef([])
  const nextId = useRef(0)
  activeRef.current = active

  useEffect(() => {
    if (pool.length === 0) return
    let timer
    const tick = () => {
      const small = window.innerWidth < 600
      const cap = Math.min(pool.length, small ? smallCap : settings.maxAtOnce)
      // re-roll the target every tick so the number on screen keeps changing
      const target = Math.round(rand(settings.minAtOnce, cap))
      const current = activeRef.current
      if (current.length < target) {
        const showing = new Set(current.map((p) => p.value))
        const options = pool.filter((v) => !showing.has(v))
        if (options.length) {
          const value = pick(options)
          const item = { ...make(value), value, id: nextId.current++ }
          setActive((list) => [...list, item])
        }
      }
      timer = setTimeout(tick, rand(settings.minGap, settings.maxGap) * 1000)
    }
    timer = setTimeout(tick, rand(200, 900))
    return () => clearTimeout(timer)
  }, [pool, settings, smallCap, make])

  const remove = useCallback((id) => setActive((list) => list.filter((p) => p.id !== id)), [])
  return [active, remove]
}

function makePhoto() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const base = Math.min(vw, vh * 0.9)
  const width = Math.min(380, base * rand(0.32, 0.58))
  const estHeight = width * 1.15
  const r0 = rand(-16, 16)
  return {
    width,
    left: rand(-width * 0.15, vw - width * 0.85),
    top: rand(-estHeight * 0.1, vh - estHeight * 0.9),
    life: rand(5, 11),
    dx: rand(-140, 140),
    dy: rand(-110, 110),
    r0,
    r1: r0 + rand(-14, 14),
    s0: rand(0.75, 0.95),
    s1: rand(0.95, 1.15),
  }
}

function makeWord(word) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // rough text width (incl. room for growing, tilting and drifting) so words stay on screen
  const charWidth = 0.65 * 16 * 1.15
  const maxSize = (vw - 110) / (word.length * charWidth)
  const size = Math.min(rand(1.4, 3.6) * (vw < 600 ? 0.8 : 1), maxSize)
  const estWidth = word.length * charWidth * size
  // keep words out of the middle band where the title and button sit
  const top = Math.random() < 0.5 ? rand(0.04, 0.28) : rand(0.68, 0.9)
  const r0 = rand(-14, 14)
  return {
    size,
    left: rand(50, Math.max(50, vw - estWidth - 50)),
    top: top * vh,
    life: rand(3.5, 7),
    dx: rand(-40, 40),
    dy: rand(-50, 50),
    r0,
    r1: r0 + rand(-8, 8),
    s0: rand(0.6, 0.9),
    s1: rand(1, 1.1),
    italic: Math.random() < 0.5,
    rose: Math.random() < 0.55,
  }
}

const motionVars = (p) => ({
  left: `${p.left}px`,
  top: `${p.top}px`,
  animationDuration: `${p.life}s`,
  '--dx': `${p.dx}px`,
  '--dy': `${p.dy}px`,
  '--r0': `${p.r0}deg`,
  '--r1': `${p.r1}deg`,
  '--s0': p.s0,
  '--s1': p.s1,
})

function FloatingStuff() {
  const [shownPhotos, removePhoto] = useSpawner(photos, PHOTO_SETTINGS, 3, makePhoto)
  const [shownWords, removeWord] = useSpawner(WORDS, WORD_SETTINGS, 2, makeWord)

  return (
    <div className="stage" aria-hidden="true">
      {shownPhotos.map((p) => (
        <figure
          key={p.id}
          className="float-photo"
          onAnimationEnd={() => removePhoto(p.id)}
          style={{ ...motionVars(p), width: `${p.width}px` }}
        >
          <img src={p.value} alt="" />
        </figure>
      ))}
      {shownWords.map((w) => (
        <span
          key={w.id}
          className={`float-word${w.italic ? ' italic' : ''}${w.rose ? ' rose' : ''}`}
          onAnimationEnd={() => removeWord(w.id)}
          style={{ ...motionVars(w), fontSize: `${w.size}rem` }}
        >
          {w.value}
        </span>
      ))}
    </div>
  )
}

/* ---------- Hearts ---------- */

const HEART_CHARS = ['❤️', '💖', '💕', '💗', '💘', '💓']

function Hearts() {
  // New random set on every page load
  const hearts = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        char: pick(HEART_CHARS),
        left: Math.random() * 100,
        size: rand(14, 40),
        duration: rand(6, 14),
        start: Math.random(),
        drift: rand(-60, 60),
      })),
    []
  )

  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            // negative delay = heart is already mid-flight when the page opens
            animationDelay: `-${h.start * h.duration}s`,
            animationDuration: `${h.duration}s`,
            '--drift': `${h.drift}px`,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  )
}

/* ---------- Dialog ---------- */

function Dialog({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return
    // ignore Escape while the mini game is open; it closes itself first
    const onKey = (e) => e.key === 'Escape' && !document.querySelector('.game') && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Sluiten">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

/* ---------- App ---------- */

export default function App() {
  const [dinnerOpen, setDinnerOpen] = useState(false)
  const [planClicks, setPlanClicks] = useState(0)
  const [gameOpen, setGameOpen] = useState(false)
  const gameTimer = useRef()

  const clickPlan = () => {
    const n = planClicks + 1
    setPlanClicks(n)
    // 10th click: show "Inari it is" for a moment, then start the mini game
    if (n === 10) gameTimer.current = setTimeout(() => setGameOpen(true), 1300)
  }
  useEffect(() => () => clearTimeout(gameTimer.current), [])

  const closeDinner = useCallback(() => {
    clearTimeout(gameTimer.current)
    setDinnerOpen(false)
    setPlanClicks(0)
  }, [])

  return (
    <>
      <FloatingStuff />
      <Hearts />

      <main>
        <h1>
          <span className="line1">Happy birthday,</span>
          <span className="name">{NAME}</span>
        </h1>

        <div className="buttons">
          <button className="btn primary" onClick={() => setDinnerOpen(true)}>
            Plan een etentje met Wouter
          </button>
        </div>
      </main>

      <Dialog open={dinnerOpen} onClose={closeDinner}>
        <p className="dialog-text">soon ...</p>
        <button
          key={planClicks /* re-trigger the wiggle on every click */}
          className={`btn primary plan-btn${planClicks > 0 ? ' wiggle' : ''}`}
          onClick={clickPlan}
        >
          PLANNEN MAAR!
        </button>
        {planClicks >= 3 && <p className="plan-result">Algauw é patatje ...</p>}
        {planClicks >= 6 && <p className="plan-result">Mo echt waar zunne!</p>}
        {planClicks >= 10 && (
          <>
            <p className="plan-result">Inari it is</p>
            <button className="btn secondary go-inari" onClick={() => setGameOpen(true)}>
              Naar Inari →
            </button>
          </>
        )}
      </Dialog>

      {gameOpen && <MazeGame onClose={() => setGameOpen(false)} />}
    </>
  )
}
