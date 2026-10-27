import { useCallback, useEffect, useRef, useState } from 'react'
import Girl from './Girl.jsx'

// # = hedge, . = path, S = start, E = Inari's front door
const MAZE = [
  '#####E#',
  '#...#.#',
  '#.#.#.#',
  '#.#...#',
  '#.#####',
  '#.....#',
  '###.#.#',
  '#S..#.#',
  '#######',
]

const ROWS = MAZE.length
const COLS = MAZE[0].length
const HEADER_ROWS = 2 // space above the maze for the restaurant
const STEP_MS = 170

const find = (ch) => {
  for (let r = 0; r < ROWS; r++) {
    const c = MAZE[r].indexOf(ch)
    if (c !== -1) return { r, c }
  }
}
const START = find('S')
const END = find('E')
const isWall = (r, c) => r < 0 || c < 0 || r >= ROWS || c >= COLS || MAZE[r][c] === '#'

const DIRS = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
}

const KEYS = {
  ArrowUp: 'up', w: 'up', W: 'up', z: 'up', Z: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left', q: 'left', Q: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
}

function useTileSize() {
  const calc = () => {
    const noDpad = window.matchMedia('(min-width: 700px) and (pointer: fine)').matches
    const w = Math.min(window.innerWidth - 32, 520) / COLS
    const h = (window.innerHeight - (noDpad ? 120 : 280)) / (ROWS + HEADER_ROWS)
    return Math.max(26, Math.floor(Math.min(w, h, 64)))
  }
  const [size, setSize] = useState(calc)
  useEffect(() => {
    const onResize = () => setSize(calc())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

function Restaurant() {
  return (
    <svg viewBox="0 0 96 64" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* walls */}
      <rect x="10" y="26" width="76" height="38" fill="#f6ead6" stroke="#3a1d12" strokeWidth="1.2" />
      <path d="M10 34 H86" stroke="#d9c6a6" strokeWidth="1" />
      {/* wooden posts */}
      <rect x="10" y="26" width="5" height="38" fill="#8a4b2a" stroke="#3a1d12" strokeWidth="1" />
      <rect x="81" y="26" width="5" height="38" fill="#8a4b2a" stroke="#3a1d12" strokeWidth="1" />
      {/* windows */}
      <rect x="19" y="38" width="16" height="12" fill="#ffd98a" stroke="#3a1d12" strokeWidth="1" />
      <path d="M27 38 V50 M19 44 H35" stroke="#8a4b2a" strokeWidth="0.9" />
      <rect x="61" y="38" width="16" height="12" fill="#ffd98a" stroke="#3a1d12" strokeWidth="1" />
      <path d="M69 38 V50 M61 44 H77" stroke="#8a4b2a" strokeWidth="0.9" />
      {/* door + noren curtain */}
      <rect x="39" y="38" width="18" height="26" fill="#4a2618" stroke="#3a1d12" strokeWidth="1" />
      <path d="M38 37 H58 V49 H52.4 V45 M52.4 49 H38 Z" fill="none" />
      <g stroke="#3a1d12" strokeWidth="0.9">
        <rect x="38.5" y="37" width="6.2" height="12" fill="#2c3e6b" />
        <rect x="44.9" y="37" width="6.2" height="12" fill="#2c3e6b" />
        <rect x="51.3" y="37" width="6.2" height="12" fill="#2c3e6b" />
      </g>
      {/* little white fox on the curtain */}
      <g transform="translate(48 43)" fill="#fffaf2">
        <path d="M-3.2 -2.6 L-2 0.4 L2 0.4 L3.2 -2.6 L1 -0.8 L-1 -0.8z" />
        <path d="M-2 0.4 L0 3 L2 0.4z" />
      </g>
      {/* roof */}
      <path d="M2 29 Q48 21 94 29 L86 17 Q48 9 10 17 Z" fill="#3b3f4a" stroke="#1e1a1f" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M10 17 Q48 9 86 17 L80 9 Q48 2 16 9 Z" fill="#4b505d" stroke="#1e1a1f" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 25 Q48 17 90 25" stroke="#666c7a" strokeWidth="0.8" fill="none" />
      {/* sign */}
      <rect x="31" y="14.5" width="34" height="11" rx="1.5" fill="#c8385c" stroke="#3a1d12" strokeWidth="1" />
      <text
        x="48"
        y="22.9"
        textAnchor="middle"
        fontFamily="'Fraunces Variable', Georgia, serif"
        fontWeight="700"
        fontSize="8.2"
        letterSpacing="1"
        fill="#fffaf2"
      >
        INARI
      </text>
      {/* lanterns */}
      {[22, 74].map((x) => (
        <g key={x} transform={`translate(${x} 29)`}>
          <path d="M0 -3 V0" stroke="#3a1d12" strokeWidth="0.8" />
          <ellipse cx="0" cy="4.2" rx="3.6" ry="4.4" fill="#e2463a" stroke="#3a1d12" strokeWidth="0.9" />
          <rect x="-2.2" y="-0.6" width="4.4" height="1.2" fill="#2a1a1a" />
          <rect x="-2.2" y="8" width="4.4" height="1.2" fill="#2a1a1a" />
          <path d="M-3.2 4.2 H3.2" stroke="#ffd34d" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  )
}

function Tree({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.6" y="2" width="3.2" height="7" fill="#8a4b2a" stroke="#3a1d12" strokeWidth="0.8" />
      <circle r="7" fill="#4f9a5a" stroke="#2c5a33" strokeWidth="0.9" />
      <circle cx="-2.4" cy="-2.4" r="2.6" fill="#6db776" />
    </g>
  )
}

export default function MazeGame({ onClose }) {
  const T = useTileSize()
  const [pos, setPos] = useState(START)
  const [dir, setDir] = useState('up')
  const [frame, setFrame] = useState(0)
  const [walking, setWalking] = useState(false)
  const [won, setWon] = useState(false)
  const [moves, setMoves] = useState(0)

  const posRef = useRef(START)
  const busy = useRef(false)
  const wonRef = useRef(false)
  const idleTimer = useRef()
  const holdTimer = useRef()

  const step = useCallback((d) => {
    if (busy.current || wonRef.current) return
    setDir(d)
    const [dr, dc] = DIRS[d]
    const { r, c } = posRef.current
    const nr = r + dr
    const nc = c + dc
    if (isWall(nr, nc)) return
    busy.current = true
    posRef.current = { r: nr, c: nc }
    setPos(posRef.current)
    setFrame((f) => 1 - f)
    setWalking(true)
    setMoves((m) => m + 1)
    clearTimeout(idleTimer.current)
    setTimeout(() => {
      busy.current = false
      if (nr === END.r && nc === END.c) {
        wonRef.current = true
        setWon(true)
      }
    }, STEP_MS)
    idleTimer.current = setTimeout(() => setWalking(false), STEP_MS + 120)
  }, [])

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose()
      const d = KEYS[e.key]
      if (d) {
        e.preventDefault()
        step(d)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, onClose])

  // swipe
  const touch = useRef(null)
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return
    step(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
  }

  // on-screen buttons: tap or hold to keep walking
  const startHold = (d) => (e) => {
    e.preventDefault()
    step(d)
    clearInterval(holdTimer.current)
    holdTimer.current = setInterval(() => step(d), STEP_MS + 20)
  }
  const stopHold = () => clearInterval(holdTimer.current)
  useEffect(() => () => {
    clearInterval(holdTimer.current)
    clearTimeout(idleTimer.current)
  }, [])

  const restart = () => {
    posRef.current = START
    wonRef.current = false
    setPos(START)
    setDir('up')
    setWon(false)
    setMoves(0)
  }

  const boardW = COLS * T
  const boardH = (ROWS + HEADER_ROWS) * T

  return (
    <div className="game" role="dialog" aria-modal="true" aria-label="Op weg naar Inari">
      <div className="game-top">
        <h2>Op weg naar Inari</h2>
        <button className="close game-close" onClick={onClose} aria-label="Sluiten">
          ×
        </button>
      </div>

      <div
        className="board"
        style={{ width: boardW, height: boardH }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* scenery above the maze */}
        <svg
          className="scenery"
          viewBox={`0 0 ${COLS * 10} ${HEADER_ROWS * 10}`}
          style={{ width: boardW, height: HEADER_ROWS * T }}
        >
          <rect width="100%" height="100%" fill="#cfe6b8" />
          <Tree x={7} y={8} s={0.95} />
          <Tree x={21} y={11} s={0.75} />
          <Tree x={33} y={7} s={0.6} />
        </svg>
        <div
          className="restaurant"
          style={{ left: (END.c - 1) * T, top: 0, width: 3 * T, height: HEADER_ROWS * T }}
        >
          <Restaurant />
        </div>

        {/* maze tiles */}
        {MAZE.map((row, r) =>
          [...row].map((ch, c) => (
            <div
              key={`${r}-${c}`}
              className={`tile ${ch === '#' ? 'hedge' : 'path'}${ch === 'E' ? ' door' : ''}`}
              style={{ left: c * T, top: (r + HEADER_ROWS) * T, width: T, height: T }}
            >
              {ch === '#' && (r * 7 + c * 3) % 5 === 0 && <span className="flower" />}
            </div>
          ))
        )}

        {/* the girl */}
        <div
          className={`girl${walking ? ' walking' : ''}${won ? ' entering' : ''}`}
          style={{
            width: T * 1.18,
            height: T * 1.55,
            transform: `translate(${pos.c * T - T * 0.09}px, ${(pos.r + HEADER_ROWS) * T - T * 0.62}px)`,
            transitionDuration: `${STEP_MS}ms`,
          }}
        >
          <Girl dir={dir} frame={frame} walking={walking} />
        </div>

      </div>

      <div className="dpad" onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}>
        <button className="dbtn up" onPointerDown={startHold('up')} aria-label="Omhoog">▲</button>
        <button className="dbtn left" onPointerDown={startHold('left')} aria-label="Links">◀</button>
        <button className="dbtn right" onPointerDown={startHold('right')} aria-label="Rechts">▶</button>
        <button className="dbtn down" onPointerDown={startHold('down')} aria-label="Omlaag">▼</button>
      </div>
      {won && (
        <div className="win">
          <div className="win-card">
            <p className="win-title">Je bent er!</p>
            <p className="win-sub">Tafeltje voor twee bij Inari 🦊❤️</p>
            <p className="win-moves">{moves} stapjes</p>
            <div className="win-buttons">
              <button className="btn secondary" onClick={restart}>
                Nog eens
              </button>
              <button className="btn primary" onClick={onClose}>
                Joepie!
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="game-hint">
        <span className="hint-touch">Swipe of gebruik de knoppen</span>
        <span className="hint-keys">Gebruik de pijltjestoetsen</span>
      </p>
    </div>
  )
}
