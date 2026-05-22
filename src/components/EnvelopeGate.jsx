import { useRef, useEffect } from 'react'
import gsap from 'gsap'

// Floral corner SVG (rotated per corner)
function FloralCorner({ rotate = 0, x = 0, y = 0, size = 120 }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`} opacity="0.18">
      {/* stem */}
      <line x1="0" y1="0" x2="0" y2={size * 0.7} stroke="#c8a84b" strokeWidth="1" />
      <line x1="0" y1="0" x2={size * 0.7} y2="0" stroke="#c8a84b" strokeWidth="1" />
      {/* branch */}
      <line x1="0" y1={size * 0.3} x2={size * 0.25} y2={size * 0.18} stroke="#c8a84b" strokeWidth="0.8" />
      <line x1={size * 0.3} y1="0" x2={size * 0.18} y2={size * 0.25} stroke="#c8a84b" strokeWidth="0.8" />
      {/* leaves */}
      <ellipse cx={size * 0.13} cy={size * 0.1} rx={size * 0.09} ry={size * 0.05} fill="#c8a84b" transform={`rotate(-45 ${size*0.13} ${size*0.1})`} />
      <ellipse cx={size * 0.1} cy={size * 0.13} rx={size * 0.09} ry={size * 0.05} fill="#c8a84b" transform={`rotate(-135 ${size*0.1} ${size*0.13})`} />
      <ellipse cx={size * 0.25} cy={size * 0.18} rx={size * 0.07} ry={size * 0.04} fill="#c8a84b" transform={`rotate(-60 ${size*0.25} ${size*0.18})`} />
      <ellipse cx={size * 0.18} cy={size * 0.25} rx={size * 0.07} ry={size * 0.04} fill="#c8a84b" transform={`rotate(-150 ${size*0.18} ${size*0.25})`} />
      {/* flower tip */}
      <circle cx="0" cy={size * 0.7} r={size * 0.04} fill="#c8a84b" />
      <circle cx={size * 0.7} cy="0" r={size * 0.04} fill="#c8a84b" />
    </g>
  )
}

export default function EnvelopeGate({ onOpen }) {
  const overlayRef = useRef(null)
  const guestName = new URLSearchParams(window.location.search).get('to') || ''

  // SVG line refs
  const frameRef    = useRef(null)   // outer rect
  const cornerTLRef = useRef(null)
  const cornerTRRef = useRef(null)
  const cornerBLRef = useRef(null)
  const cornerBRRef = useRef(null)
  const divTop      = useRef(null)
  const divBot      = useRef(null)
  const diamondRef  = useRef(null)

  // Text refs
  const eyebrowRef  = useRef(null)
  const name1Ref    = useRef(null)
  const name2Ref    = useRef(null)
  const name3Ref    = useRef(null)
  const dateRef     = useRef(null)
  const btnRef      = useRef(null)

  useEffect(() => {
    // Helper: set all lines to invisible (dash = length, offset = length)
    const hide = (el) => {
      if (!el) return
      const len = el.getTotalLength?.() ?? 200
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
    }

    const draw = (el, opts = {}) => {
      if (!el) return null
      const len = el.getTotalLength?.() ?? 200
      gsap.set(el, { strokeDasharray: len })
      return gsap.to(el, { strokeDashoffset: 0, ease: 'power2.inOut', ...opts })
    }

    // Init all lines hidden
    ;[
      frameRef.current,
      cornerTLRef.current, cornerTRRef.current,
      cornerBLRef.current, cornerBRRef.current,
      divTop.current, divBot.current,
      diamondRef.current,
    ].forEach(hide)

    // Init text hidden — SVG text hanya support opacity, bukan CSS y
    gsap.set([eyebrowRef.current, name1Ref.current, name2Ref.current, name3Ref.current, dateRef.current], {
      opacity: 0,
    })
    gsap.set(btnRef.current, { opacity: 0 })

    const tl = gsap.timeline({ delay: 0.3 })

    // 1. Outer frame draws in
    tl.add(draw(frameRef.current, { duration: 1.4, ease: 'power1.inOut' }))

    // 2. Corner ornaments draw simultaneously
    .add([
      draw(cornerTLRef.current, { duration: 0.6 }),
      draw(cornerTRRef.current, { duration: 0.6 }),
      draw(cornerBLRef.current, { duration: 0.6 }),
      draw(cornerBRRef.current, { duration: 0.6 }),
    ], '-=0.4')

    // 3. Diamond center ornament
    .add(draw(diamondRef.current, { duration: 0.7, ease: 'power2.out' }), '-=0.2')

    // 4. Top divider
    .add(draw(divTop.current, { duration: 0.5 }), '-=0.2')

    // 5. Eyebrow text
    .to(eyebrowRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.1')

    // 6. Names
    .to(name1Ref.current, { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.2')
    .to(name2Ref.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .to(name3Ref.current, { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.3')

    // 7. Bottom divider
    .add(draw(divBot.current, { duration: 0.5 }), '-=0.3')

    // 8. Date
    .to(dateRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')

    // 9. Button
    .to(btnRef.current, { opacity: 1, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.1')

    return () => tl.kill()
  }, [])

  const handleOpen = () => {
    const tl = gsap.timeline({ onComplete: onOpen })
    tl.to(overlayRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' })
  }

  // SVG viewport
  const W = 400
  const H = 560
  const pad = 28        // frame inset
  const cSize = 22      // corner arm length
  const stroke = '#f5c842'
  const strokeW = 1.2

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 45%, #fffdf5 0%, #fdf6e3 60%, #f5e9c8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw', height: '50vw',
        maxWidth: 500, maxHeight: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* SVG canvas — all lines + text live here */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', maxWidth: 420, height: 'auto', overflow: 'visible' }}
        aria-label="Undangan pernikahan M. Riyan dan Siti Arbayah"
      >
        {/* ── Floral corner ornaments ── */}
        <FloralCorner x={pad + 2} y={pad + 2} rotate={0} size={80} />
        <FloralCorner x={W - pad - 2} y={pad + 2} rotate={90} size={80} />
        <FloralCorner x={pad + 2} y={H - pad - 2} rotate={270} size={80} />
        <FloralCorner x={W - pad - 2} y={H - pad - 2} rotate={180} size={80} />
        {/* ── Outer decorative frame ── */}
        <rect
          ref={frameRef}
          x={pad} y={pad}
          width={W - pad * 2} height={H - pad * 2}
          rx="2"
          fill="none"
          stroke={stroke}
          strokeWidth={strokeW}
          opacity="0.35"
        />

        {/* ── Corner ornaments ── */}
        {/* Top-left */}
        <path ref={cornerTLRef}
          d={`M ${pad + 2} ${pad + cSize + 10} L ${pad + 2} ${pad + 2} L ${pad + cSize + 10} ${pad + 2}`}
          fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"
        />
        {/* Top-right */}
        <path ref={cornerTRRef}
          d={`M ${W - pad - cSize - 10} ${pad + 2} L ${W - pad - 2} ${pad + 2} L ${W - pad - 2} ${pad + cSize + 10}`}
          fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"
        />
        {/* Bottom-left */}
        <path ref={cornerBLRef}
          d={`M ${pad + 2} ${H - pad - cSize - 10} L ${pad + 2} ${H - pad - 2} L ${pad + cSize + 10} ${H - pad - 2}`}
          fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"
        />
        {/* Bottom-right */}
        <path ref={cornerBRRef}
          d={`M ${W - pad - cSize - 10} ${H - pad - 2} L ${W - pad - 2} ${H - pad - 2} L ${W - pad - 2} ${H - pad - cSize - 10}`}
          fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"
        />

        {/* ── Diamond center ornament ── */}
        <path ref={diamondRef}
          d={`M ${W / 2} 108 L ${W / 2 + 10} 120 L ${W / 2} 132 L ${W / 2 - 10} 120 Z`}
          fill="none" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round"
        />

        {/* ── Top divider ── */}
        <line ref={divTop}
          x1={W / 2 - 60} y1={152}
          x2={W / 2 + 60} y2={152}
          stroke={stroke} strokeWidth="0.8" opacity="0.6"
        />

        {/* ── Eyebrow text ── */}
        <text ref={eyebrowRef}
          x={W / 2} y={178}
          textAnchor="middle"
          fontFamily="'Montserrat', sans-serif"
          fontSize="11"
          letterSpacing="4"
          fill="rgba(212,175,55,0.9)"
          style={{ textTransform: 'uppercase' }}
        >
          THE WEDDING OF
        </text>

        {/* ── Names ── */}
        <text ref={name1Ref}
          x={W / 2} y={222}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="38"
          fill="#2a1c08"
          fontWeight="400"
        >
          M. Riyan
        </text>
        <text ref={name2Ref}
          x={W / 2} y={268}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="26"
          fill="#2a1c08"
          fontStyle="italic"
          fontWeight="400"
        >
          &amp;
        </text>
        <text
          ref={name3Ref}
          x={W / 2} y={308}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="34"
          fill="#2a1c08"
          fontStyle="italic"
          fontWeight="400"
        >
          Siti Arbayah
        </text>

        {/* ── Bottom divider ── */}
        <line ref={divBot}
          x1={W / 2 - 60} y1={328}
          x2={W / 2 + 60} y2={328}
          stroke={stroke} strokeWidth="0.8" opacity="0.6"
        />

        {/* ── Date ── */}
        <text ref={dateRef}
          x={W / 2} y={354}
          textAnchor="middle"
          fontFamily="'Montserrat', sans-serif"
          fontSize="11"
          letterSpacing="3"
          fill="rgba(42,28,8,0.7)"
        >
          MINGGU · 05 JULI 2026
        </text>

        {/* ── Guest name ── */}
        {guestName && <>
          <text x={W / 2} y={388} textAnchor="middle" fontFamily="'Montserrat', sans-serif" fontSize="9" letterSpacing="2" fill="rgba(42,28,8,0.5)">
            KEPADA YTH.
          </text>
          <text x={W / 2} y={406} textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="16" fill="#2a1c08" fontStyle="italic">
            {guestName}
          </text>
        </>}

        {/* ── Open button (foreignObject for proper button) ── */}
        <foreignObject ref={btnRef} x={W / 2 - 90} y={390} width="180" height="52">
          <button
            onClick={handleOpen}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: `1px solid rgba(180,130,20,0.8)`,
              borderRadius: 999,
              color: '#f5c842',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.3s, color 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(212,175,55,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Buka Undangan
          </button>
        </foreignObject>
      </svg>

      {/* ── Scroll hint ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        animation: 'bounceHint 1.8s ease-in-out infinite',
      }}>
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '2px', color: 'rgba(42,28,8,0.4)', textTransform: 'uppercase' }}>
          Buka Undangan
        </span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M1 1l7 7 7-7" stroke="#c8a84b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
        </svg>
      </div>
      <style>{`@keyframes bounceHint { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }`}</style>
    </div>
  )
}
