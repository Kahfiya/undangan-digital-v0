import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function EnvelopeGate({ onOpen }) {
  const overlayRef = useRef(null)

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

    // Init text hidden
    gsap.set([eyebrowRef.current, name1Ref.current, name2Ref.current, dateRef.current, btnRef.current], {
      opacity: 0, y: 16,
    })

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
    .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.1')

    // 6. Names
    .to(name1Ref.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
    .to(name2Ref.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')

    // 7. Bottom divider
    .add(draw(divBot.current, { duration: 0.5 }), '-=0.3')

    // 8. Date
    .to(dateRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')

    // 9. Button
    .to(btnRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.1')

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
  const stroke = '#d4af37'
  const strokeW = 1.2

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 45%, #2a1c08 0%, #150e04 70%, #0a0703 100%)',
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
        background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* SVG canvas — all lines + text live here */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', maxWidth: 420, height: 'auto', overflow: 'visible' }}
        aria-label="Undangan pernikahan M. Riyan dan Siti Arbayah"
      >
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
          x={W / 2} y={232}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="38"
          fill="#ffffff"
          fontWeight="400"
        >
          M. Riyan
        </text>
        <text ref={name2Ref}
          x={W / 2} y={282}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="34"
          fill="#e8cc6a"
          fontStyle="italic"
          fontWeight="400"
        >
          &amp; Siti Arbayah
        </text>

        {/* ── Bottom divider ── */}
        <line ref={divBot}
          x1={W / 2 - 60} y1={308}
          x2={W / 2 + 60} y2={308}
          stroke={stroke} strokeWidth="0.8" opacity="0.6"
        />

        {/* ── Date ── */}
        <text ref={dateRef}
          x={W / 2} y={334}
          textAnchor="middle"
          fontFamily="'Montserrat', sans-serif"
          fontSize="11"
          letterSpacing="3"
          fill="rgba(255,255,255,0.75)"
        >
          MINGGU · 05 JULI 2026
        </text>

        {/* ── Open button (foreignObject for proper button) ── */}
        <foreignObject ref={btnRef} x={W / 2 - 90} y={390} width="180" height="52">
          <button
            onClick={handleOpen}
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: '1px solid rgba(212,175,55,0.6)',
              borderRadius: 999,
              color: '#d4af37',
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
    </div>
  )
}
