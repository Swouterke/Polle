// Little red-haired girl, drawn as SVG. Four directions, two walk frames.
// dir: 'down' | 'up' | 'left' | 'right'   frame: 0 | 1

const C = {
  hair: '#c8461b',
  hairLight: '#e86a2c',
  hairDark: '#9a3212',
  skin: '#ffe0cc',
  skinShade: '#f3c3a8',
  blush: '#ff9a9a',
  freckle: '#d98b62',
  eye: '#2b1a14',
  dress: '#2e8b6e',
  dressDark: '#226b54',
  collar: '#fffaf2',
  sock: '#fffaf2',
  shoe: '#5a2e1c',
  ribbon: '#ffd34d',
  ribbonDark: '#e0a91f',
  outline: '#3a1d12',
}

const stroke = { stroke: C.outline, strokeWidth: 0.9, strokeLinejoin: 'round', strokeLinecap: 'round' }

function Legs({ frame, walking }) {
  // left/right leg vertical offset for a little walk cycle
  const a = walking ? (frame ? -1.2 : 0.6) : 0
  const b = walking ? (frame ? 0.6 : -1.2) : 0
  return (
    <g>
      <g transform={`translate(0 ${a})`}>
        <rect x="12.3" y="33" width="3" height="4" fill={C.sock} {...stroke} />
        <path d="M11.6 37 h4.2 a1.4 1.4 0 0 1 0 2.4 h-4.2 a1.2 1.2 0 0 1 0 -2.4z" fill={C.shoe} {...stroke} />
      </g>
      <g transform={`translate(0 ${b})`}>
        <rect x="16.7" y="33" width="3" height="4" fill={C.sock} {...stroke} />
        <path d="M16.2 37 h4.2 a1.2 1.2 0 0 1 0 2.4 h-4.2 a1.4 1.4 0 0 1 0 -2.4z" fill={C.shoe} {...stroke} />
      </g>
    </g>
  )
}

function SideLegs({ frame, walking }) {
  const swing = walking ? (frame ? 1.6 : -1.6) : 0
  return (
    <g>
      <g transform={`translate(${-swing} 0)`}>
        <rect x="14.6" y="33" width="2.8" height="4" fill={C.sock} {...stroke} />
        <path d="M14 37 h4.6 a1.3 1.3 0 0 1 0 2.4 h-4.6z" fill={C.shoe} {...stroke} />
      </g>
      <g transform={`translate(${swing} 0)`}>
        <rect x="15.4" y="33" width="2.8" height="4" fill={C.sock} {...stroke} />
        <path d="M14.8 37 h4.6 a1.3 1.3 0 0 1 0 2.4 h-4.6z" fill={C.shoe} {...stroke} />
      </g>
    </g>
  )
}

function Dress() {
  return (
    <g>
      <path d="M11.5 24 Q16 22.6 20.5 24 L23.6 33.6 Q16 35.4 8.4 33.6 Z" fill={C.dress} {...stroke} />
      {/* skirt folds */}
      <path d="M13.4 28 L12.6 33.8 M18.6 28 L19.4 33.8" stroke={C.dressDark} strokeWidth="0.8" fill="none" />
      {/* collar */}
      <path d="M13 24 Q16 27 19 24 Q16 25 13 24z" fill={C.collar} {...stroke} />
    </g>
  )
}

function Front({ frame, walking }) {
  const arm = walking ? (frame ? 0.8 : -0.8) : 0
  return (
    <g>
      {/* back hair */}
      <path d="M6.6 14 Q6 5 16 4.2 Q26 5 25.4 14 Q25.6 21 23.4 25 L8.6 25 Q6.4 21 6.6 14z" fill={C.hairDark} {...stroke} />
      <Legs frame={frame} walking={walking} />
      {/* arms */}
      <path d={`M11.6 25.2 Q9.6 27 ${9.4} ${30.2 + arm}`} stroke={C.outline} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d={`M11.6 25.2 Q9.6 27 ${9.4} ${30.2 + arm}`} stroke={C.skin} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d={`M20.4 25.2 Q22.4 27 ${22.6} ${30.2 - arm}`} stroke={C.outline} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d={`M20.4 25.2 Q22.4 27 ${22.6} ${30.2 - arm}`} stroke={C.skin} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Dress />
      {/* pigtails */}
      <path d="M6.8 13 Q2.4 16 3.6 22.4 Q4.6 25.6 7.4 24.6 Q6 20 8.6 16z" fill={C.hair} {...stroke} />
      <path d="M25.2 13 Q29.6 16 28.4 22.4 Q27.4 25.6 24.6 24.6 Q26 20 23.4 16z" fill={C.hair} {...stroke} />
      <path d="M4.6 18 Q4.4 21 5.6 23" stroke={C.hairLight} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M27.4 18 Q27.6 21 26.4 23" stroke={C.hairLight} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* face */}
      <ellipse cx="16" cy="14.6" rx="8.2" ry="7.8" fill={C.skin} {...stroke} />
      {/* bangs */}
      <path d="M7.6 14 Q7.4 5.4 16 5 Q24.6 5.4 24.4 14 Q22.6 10.4 20.6 10 Q19.6 12 17.6 11.4 Q16.4 9.4 14.4 11.2 Q12.4 12 11.4 10.2 Q9.2 11.2 7.6 14z" fill={C.hair} {...stroke} />
      <path d="M11 7.4 Q14 5.8 17.6 6.4" stroke={C.hairLight} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx="12.6" cy="15.6" rx="1.35" ry="1.75" fill={C.eye} />
      <ellipse cx="19.4" cy="15.6" rx="1.35" ry="1.75" fill={C.eye} />
      <circle cx="13.1" cy="15" r="0.5" fill="#fff" />
      <circle cx="19.9" cy="15" r="0.5" fill="#fff" />
      {/* cheeks + freckles */}
      <ellipse cx="10.6" cy="18.4" rx="1.6" ry="1" fill={C.blush} opacity="0.7" />
      <ellipse cx="21.4" cy="18.4" rx="1.6" ry="1" fill={C.blush} opacity="0.7" />
      <g fill={C.freckle}>
        <circle cx="11.2" cy="17.3" r="0.32" />
        <circle cx="12.3" cy="17.9" r="0.32" />
        <circle cx="10.4" cy="17.9" r="0.28" />
        <circle cx="20.8" cy="17.3" r="0.32" />
        <circle cx="19.7" cy="17.9" r="0.32" />
        <circle cx="21.6" cy="17.9" r="0.28" />
      </g>
      {/* smile */}
      <path d="M14.8 19.2 Q16 20.3 17.2 19.2" stroke={C.outline} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* ribbons */}
      <Ribbon x={6.6} y={13.2} />
      <Ribbon x={25.4} y={13.2} />
    </g>
  )
}

function Ribbon({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 L-2.6 -1.8 L-2.6 1.8z" fill={C.ribbon} {...stroke} strokeWidth="0.6" />
      <path d="M0 0 L2.6 -1.8 L2.6 1.8z" fill={C.ribbon} {...stroke} strokeWidth="0.6" />
      <circle r="0.9" fill={C.ribbonDark} {...stroke} strokeWidth="0.6" />
    </g>
  )
}

function Back({ frame, walking }) {
  const arm = walking ? (frame ? 0.8 : -0.8) : 0
  return (
    <g>
      <Legs frame={frame} walking={walking} />
      <path d={`M11.6 25.2 Q9.6 27 9.4 ${30.2 - arm}`} stroke={C.outline} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d={`M11.6 25.2 Q9.6 27 9.4 ${30.2 - arm}`} stroke={C.skin} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d={`M20.4 25.2 Q22.4 27 22.6 ${30.2 + arm}`} stroke={C.outline} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d={`M20.4 25.2 Q22.4 27 22.6 ${30.2 + arm}`} stroke={C.skin} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Dress />
      {/* pigtails */}
      <path d="M6.8 13 Q2.4 16 3.6 22.4 Q4.6 25.6 7.4 24.6 Q6 20 8.6 16z" fill={C.hair} {...stroke} />
      <path d="M25.2 13 Q29.6 16 28.4 22.4 Q27.4 25.6 24.6 24.6 Q26 20 23.4 16z" fill={C.hair} {...stroke} />
      {/* back of head */}
      <path d="M7.6 14 Q7.4 5 16 4.6 Q24.6 5 24.4 14 Q24.2 21 16 22.6 Q7.8 21 7.6 14z" fill={C.hair} {...stroke} />
      {/* parting + shine */}
      <path d="M16 5 L16 13" stroke={C.hairDark} strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <path d="M11 8 Q13 6.6 14.6 6.6" stroke={C.hairLight} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M17.4 6.6 Q19 6.6 21 8" stroke={C.hairLight} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <Ribbon x={6.6} y={13.2} />
      <Ribbon x={25.4} y={13.2} />
    </g>
  )
}

// Facing right; mirrored for left
function Side({ frame, walking }) {
  const arm = walking ? (frame ? 2 : -2) : 0
  return (
    <g>
      {/* pigtail behind */}
      <path d="M9.6 12.4 Q4.4 14 4.8 21 Q5.4 25 8.6 24.2 Q7.4 19.6 10.8 16.4z" fill={C.hair} {...stroke} />
      <Ribbon x={9.6} y={13} />
      <SideLegs frame={frame} walking={walking} />
      <path d="M11.4 24 Q16 22.6 20.6 24 L22.6 33.6 Q16 35.4 9.4 33.6 Z" fill={C.dress} {...stroke} />
      <path d="M15.6 27.6 L15.2 33.8" stroke={C.dressDark} strokeWidth="0.8" fill="none" />
      {/* arm */}
      <path d={`M16 25 Q${16 + arm * 0.6} 28 ${16 + arm} 30.4`} stroke={C.outline} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d={`M16 25 Q${16 + arm * 0.6} 28 ${16 + arm} 30.4`} stroke={C.skin} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* head */}
      <path d="M8.4 14 Q8 5.4 16.4 5 Q24.4 5.4 24.2 13.6 Q24.6 15 24 16.6 Q23 21.6 16.6 22.4 Q9.2 21.8 8.4 14z" fill={C.skin} {...stroke} />
      {/* hair over the head, leaving the face on the right */}
      <path d="M8.2 15.6 Q7 5.4 16.4 4.8 Q24.6 5 24.4 12.6 Q23 10.4 21 10.6 Q20.2 12.2 18.6 11.6 Q16.4 11.8 14.8 13 Q13.4 15 13.8 18.8 Q10.8 19.8 8.2 15.6z" fill={C.hair} {...stroke} />
      <ellipse cx="14.6" cy="16" rx="1.2" ry="1.6" fill={C.skinShade} {...stroke} strokeWidth="0.7" />
      <path d="M11 7.6 Q14 5.8 18 6.2" stroke={C.hairLight} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* eye, cheek, freckles */}
      <ellipse cx="20.6" cy="15.6" rx="1.25" ry="1.7" fill={C.eye} />
      <circle cx="21" cy="15" r="0.45" fill="#fff" />
      <ellipse cx="20" cy="18.6" rx="1.5" ry="0.95" fill={C.blush} opacity="0.7" />
      <g fill={C.freckle}>
        <circle cx="21.6" cy="17.8" r="0.3" />
        <circle cx="22.6" cy="18.2" r="0.28" />
        <circle cx="20.8" cy="17.6" r="0.28" />
      </g>
      <path d="M21.8 19.8 Q22.8 20.2 23.4 19.4" stroke={C.outline} strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  )
}

export default function Girl({ dir = 'down', frame = 0, walking = false }) {
  return (
    <svg viewBox="0 0 32 42" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }}>
      <ellipse cx="16" cy="40" rx="7" ry="1.6" fill="rgba(0,0,0,0.18)" />
      {dir === 'down' && <Front frame={frame} walking={walking} />}
      {dir === 'up' && <Back frame={frame} walking={walking} />}
      {dir === 'right' && <Side frame={frame} walking={walking} />}
      {dir === 'left' && (
        <g transform="translate(32 0) scale(-1 1)">
          <Side frame={frame} walking={walking} />
        </g>
      )}
    </svg>
  )
}
