import { useRef, useEffect } from 'react'
import gsap from 'gsap'

/* ── Floral corner ornament ── */
function FloralCorner({ rotate = 0, x = 0, y = 0, size = 80 }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`} opacity="0.22">
      <line x1="0" y1="0" x2="0" y2={size * 0.7} stroke="#c8a84b" strokeWidth="0.9" />
      <line x1="0" y1="0" x2={size * 0.7} y2="0" stroke="#c8a84b" strokeWidth="0.9" />
      <line x1="0" y1={size * 0.28} x2={size * 0.22} y2={size * 0.16} stroke="#c8a84b" strokeWidth="0.7" />
      <line x1={size * 0.28} y1="0" x2={size * 0.16} y2={size * 0.22} stroke="#c8a84b" strokeWidth="0.7" />
      <ellipse cx={size*0.12} cy={size*0.09} rx={size*0.08} ry={size*0.045} fill="#c8a84b" transform={`rotate(-45 ${size*0.12} ${size*0.09})`} />
      <ellipse cx={size*0.09} cy={size*0.12} rx={size*0.08} ry={size*0.045} fill="#c8a84b" transform={`rotate(-135 ${size*0.09} ${size*0.12})`} />
      <ellipse cx={size*0.22} cy={size*0.16} rx={size*0.06} ry={size*0.035} fill="#c8a84b" transform={`rotate(-60 ${size*0.22} ${size*0.16})`} />
      <ellipse cx={size*0.16} cy={size*0.22} rx={size*0.06} ry={size*0.035} fill="#c8a84b" transform={`rotate(-150 ${size*0.16} ${size*0.22})`} />
      <circle cx="0" cy={size*0.7} r={size*0.035} fill="#c8a84b" />
      <circle cx={size*0.7} cy="0" r={size*0.035} fill="#c8a84b" />
      <circle cx={size*0.36} cy={size*0.04} r={size*0.022} fill="#c8a84b" opacity="0.6" />
      <circle cx={size*0.04} cy={size*0.36} r={size*0.022} fill="#c8a84b" opacity="0.6" />
    </g>
  )
}

export default function EnvelopeGate({ onOpen }) {
  const overlayRef  = useRef(null)
  const guestName   = new URLSearchParams(window.location.search).get('to') || ''

  const frameRef    = useRef(null)
  const frame2Ref   = useRef(null)
  const cornerTLRef = useRef(null)
  const cornerTRRef = useRef(null)
  const cornerBLRef = useRef(null)
  const cornerBRRef = useRef(null)
  const divTopRef   = useRef(null)
  const divBotRef   = useRef(null)
  const diamondRef  = useRef(null)
  const eyebrowRef  = useRef(null)
  const name1Ref    = useRef(null)
  const name2Ref    = useRef(null)
  const name3Ref    = useRef(null)
  const dateRef     = useRef(null)
  const guestRef    = useRef(null)
  const btnGroupRef = useRef(null)
  const btnBgRef    = useRef(null)
  const shimmerRef  = useRef(null)

  // Fixed viewBox — all elements must fit inside
  const W = 400
  const H = guestName ? 510 : 450
  const pad = 28
  const cSize = 22
  const gold = '#d4a843'

  // Button sits 24px below the date/guest block
  const btnY = guestName ? 414 : 345
  const btnW = 220
  const btnH = 46
  const btnX = W / 2 - btnW / 2   // = 90, centered on W=400

  useEffect(() => {
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

    ;[frameRef.current, frame2Ref.current,
      cornerTLRef.current, cornerTRRef.current,
      cornerBLRef.current, cornerBRRef.current,
      divTopRef.current, divBotRef.current,
      diamondRef.current,
    ].forEach(hide)

    gsap.set([eyebrowRef.current, name1Ref.current, name2Ref.current,
              name3Ref.current, dateRef.current, guestRef.current], { opacity: 0 })
    gsap.set(btnGroupRef.current, { opacity: 0, scale: 0.9, transformOrigin: `${W/2}px ${btnY + btnH/2}px` })

    const tl = gsap.timeline({ delay: 0.4 })

    tl.add(draw(frameRef.current,  { duration: 1.5, ease: 'power1.inOut' }))
      .add(draw(frame2Ref.current, { duration: 1.1, ease: 'power1.inOut' }), '-=0.9')
      .add([
        draw(cornerTLRef.current, { duration: 0.5 }),
        draw(cornerTRRef.current, { duration: 0.5 }),
        draw(cornerBLRef.current, { duration: 0.5 }),
        draw(cornerBRRef.current, { duration: 0.5 }),
      ], '-=0.4')
      .add(draw(diamondRef.current, { duration: 0.6, ease: 'power2.out' }), '-=0.15')
      .add(draw(divTopRef.current,  { duration: 0.45 }), '-=0.1')
      .to(eyebrowRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.05')
      .to(name1Ref.current,   { opacity: 1, duration: 0.75, ease: 'power3.out' }, '-=0.25')
      .to(name2Ref.current,   { opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.35')
      .to(name3Ref.current,   { opacity: 1, duration: 0.75, ease: 'power3.out' }, '-=0.35')
      .add(draw(divBotRef.current, { duration: 0.45 }), '-=0.25')
      .to(dateRef.current,  { opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.15')
      .to(guestRef.current, { opacity: 1, duration: 0.45, ease: 'power2.out' }, '-=0.05')
      .to(btnGroupRef.current, { opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.5)' }, '-=0.05')

    // Repeating shimmer sweep on button
    gsap.fromTo(shimmerRef.current,
      { x: -btnW },
      { x: btnW * 1.5, duration: 2, ease: 'power1.inOut', repeat: -1, repeatDelay: 2, delay: 2.8 }
    )

    return () => tl.kill()
  }, [])

  const handleOpen = () => {
    const tl = gsap.timeline({ onComplete: onOpen })
    tl.to(btnGroupRef.current, { scale: 0.95, duration: 0.1, ease: 'power2.in',
        transformOrigin: `${W/2}px ${btnY + btnH/2}px` })
      .to(btnGroupRef.current, { scale: 1.04, duration: 0.15, ease: 'power2.out' })
      .to(overlayRef.current,  { opacity: 0, duration: 0.85, ease: 'power3.inOut' }, '-=0.05')
  }

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(ellipse at 50% 42%, #fffef8 0%, #fdf6e3 55%, #f0e0b0 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Ambient glow — HTML div, not SVG, so no overflow issue */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '42%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 480, height: 480,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 68%)',
        pointerEvents: 'none',
        animation: 'glowPulse 4s ease-in-out infinite',
      }} />

      {/* SVG — overflow hidden so nothing bleeds out */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: 'min(calc(100vw - 48px), 400px)',
          height: 'auto',
          overflow: 'hidden',
          display: 'block',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
        aria-label="Undangan pernikahan M. Riyan dan Siti Arbayah"
      >
        <defs>
          {/* Clip button shimmer to pill shape */}
          <clipPath id="btnClip">
            <rect x={btnX} y={btnY} width={btnW} height={btnH} rx={btnH / 2} />
          </clipPath>
          {/* Shimmer gradient */}
          <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="40%"  stopColor="white" stopOpacity="0" />
            <stop offset="50%"  stopColor="white" stopOpacity="0.4" />
            <stop offset="60%"  stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Floating dust particles ── */}
        {[
          { cx: 70,  cy: 380, r: 1.4, d: 0,   t: 4.2 },
          { cx: 130, cy: 410, r: 1.0, d: 0.9, t: 3.8 },
          { cx: 200, cy: 420, r: 1.7, d: 1.6, t: 5.0 },
          { cx: 270, cy: 405, r: 1.1, d: 0.4, t: 4.5 },
          { cx: 330, cy: 390, r: 0.9, d: 1.2, t: 3.6 },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#f5c842">
            <animate attributeName="opacity" values="0;0.5;0"
              dur={`${p.t}s`} begin={`${p.d}s`} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate"
              values={`0 0; 0 -18; 0 0`}
              dur={`${p.t}s`} begin={`${p.d}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ── Floral corners ── */}
        <FloralCorner x={pad+2}   y={pad+2}   rotate={0}   size={72} />
        <FloralCorner x={W-pad-2} y={pad+2}   rotate={90}  size={72} />
        <FloralCorner x={pad+2}   y={H-pad-2} rotate={270} size={72} />
        <FloralCorner x={W-pad-2} y={H-pad-2} rotate={180} size={72} />

        {/* ── Outer frame ── */}
        <rect ref={frameRef}
          x={pad} y={pad} width={W-pad*2} height={H-pad*2}
          rx="3" fill="none" stroke={gold} strokeWidth="1" opacity="0.35"
        />

        {/* ── Inner frame ── */}
        <rect ref={frame2Ref}
          x={pad+9} y={pad+9} width={W-pad*2-18} height={H-pad*2-18}
          rx="2" fill="none" stroke={gold} strokeWidth="0.5" opacity="0.2"
        />

        {/* ── Corner L-brackets ── */}
        <path ref={cornerTLRef}
          d={`M ${pad+2} ${pad+cSize+10} L ${pad+2} ${pad+2} L ${pad+cSize+10} ${pad+2}`}
          fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round"
        />
        <path ref={cornerTRRef}
          d={`M ${W-pad-cSize-10} ${pad+2} L ${W-pad-2} ${pad+2} L ${W-pad-2} ${pad+cSize+10}`}
          fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round"
        />
        <path ref={cornerBLRef}
          d={`M ${pad+2} ${H-pad-cSize-10} L ${pad+2} ${H-pad-2} L ${pad+cSize+10} ${H-pad-2}`}
          fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round"
        />
        <path ref={cornerBRRef}
          d={`M ${W-pad-cSize-10} ${H-pad-2} L ${W-pad-2} ${H-pad-2} L ${W-pad-2} ${H-pad-cSize-10}`}
          fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round"
        />

        {/* ── Diamond ornament ── */}
        <circle cx={W/2} cy={82} r="2.5" fill={gold} opacity="0.45" />
        <path ref={diamondRef}
          d={`M ${W/2} 90 L ${W/2+11} 105 L ${W/2} 120 L ${W/2-11} 105 Z`}
          fill="none" stroke={gold} strokeWidth="1.3" strokeLinejoin="round"
        />

        {/* ── Top divider ── */}
        <circle cx={W/2-76} cy={138} r="2" fill={gold} opacity="0.4" />
        <line ref={divTopRef}
          x1={W/2-72} y1={138} x2={W/2+72} y2={138}
          stroke={gold} strokeWidth="0.8" opacity="0.5"
        />
        <circle cx={W/2+76} cy={138} r="2" fill={gold} opacity="0.4" />

        {/* ── Eyebrow ── */}
        <text ref={eyebrowRef}
          x={W/2} y={160}
          textAnchor="middle"
          fontFamily="'Montserrat', sans-serif"
          fontSize="10" letterSpacing="4.5"
          textLength="148" lengthAdjust="spacing"
          fill="rgba(160,110,10,0.85)"
        >THE WEDDING OF</text>

        {/* ── Names ── */}
        <text ref={name1Ref}
          x={W/2} y={206}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="40" fontWeight="400"
          fill="#2a1c08"
        >M. Riyan</text>

        <text ref={name2Ref}
          x={W/2} y={244}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="22" fontStyle="italic" fontWeight="400"
          fill="rgba(160,110,10,0.8)"
        >&amp;</text>

        <text ref={name3Ref}
          x={W/2} y={284}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="36" fontStyle="italic" fontWeight="400"
          fill="#2a1c08"
        >Siti Arbayah</text>

        {/* ── Bottom divider ── */}
        <circle cx={W/2-76} cy={304} r="2" fill={gold} opacity="0.4" />
        <line ref={divBotRef}
          x1={W/2-72} y1={304} x2={W/2+72} y2={304}
          stroke={gold} strokeWidth="0.8" opacity="0.5"
        />
        <circle cx={W/2+76} cy={304} r="2" fill={gold} opacity="0.4" />

        {/* ── Date ── */}
        <text ref={dateRef}
          x={W/2} y={328}
          textAnchor="middle"
          fontFamily="'Montserrat', sans-serif"
          fontSize="10" letterSpacing="3.5"
          textLength="168" lengthAdjust="spacing"
          fill="rgba(42,28,8,0.6)"
        >MINGGU · 05 JULI 2026</text>

        {/* ── Guest name ── */}
        <g ref={guestRef} opacity="0">
          {guestName && <>
            <text x={W/2} y={358} textAnchor="middle"
              fontFamily="'Montserrat', sans-serif" fontSize="9" letterSpacing="2.5"
              fill="rgba(42,28,8,0.45)">KEPADA YTH.</text>
            <text x={W/2} y={378} textAnchor="middle"
              fontFamily="'Playfair Display', serif" fontSize="17" fontStyle="italic"
              fill="#2a1c08">{guestName}</text>
          </>}
        </g>

        {/* ── Button group ── */}
        <g ref={btnGroupRef} style={{ cursor: 'pointer' }} onClick={handleOpen}>
          {/* Pill border */}
          <rect
            x={btnX} y={btnY}
            width={btnW} height={btnH}
            rx={btnH / 2}
            fill="rgba(212,168,67,0.07)"
            ref={btnBgRef}
            stroke={gold}
            strokeWidth="1.2"
          />

          {/* Shimmer sweep — clipped to pill */}
          <rect
            ref={shimmerRef}
            x={btnX - btnW} y={btnY}
            width={btnW} height={btnH}
            fill="url(#shimmerGrad)"
            clipPath="url(#btnClip)"
          />

          {/* Label — perfectly centered */}
          <text
            x={W / 2} y={btnY + btnH / 2 + 3.5}
            textAnchor="middle"
            dominantBaseline="auto"
            fontFamily="'Montserrat', sans-serif"
            fontSize="9.5" letterSpacing="4"
            fill={gold}
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >BUKA UNDANGAN</text>

          {/* Hover fill — toggled via onMouseEnter/Leave */}
          <rect
            x={btnX} y={btnY}
            width={btnW} height={btnH}
            rx={btnH / 2}
            fill="transparent"
            onMouseEnter={e => gsap.to(btnBgRef.current, { attr: { fill: 'rgba(212,168,67,0.16)' }, duration: 0.3 })}
            onMouseLeave={e => gsap.to(btnBgRef.current, { attr: { fill: 'rgba(212,168,67,0.07)' }, duration: 0.3 })}
          />
        </g>

        {/* ── Bottom dot trio ── */}
        <g opacity="0.28">
          <circle cx={W/2-18} cy={H-pad-10} r="1.4" fill={gold} />
          <circle cx={W/2}    cy={H-pad-10} r="2.0" fill={gold} />
          <circle cx={W/2+18} cy={H-pad-10} r="1.4" fill={gold} />
        </g>
      </svg>

      {/* Scroll hint */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 20, left: '50%',
        transform: 'translateX(-50%)',
        animation: 'bounceHint 2s ease-in-out infinite',
        opacity: 0.4,
      }}>
        <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
          <path d="M1 1l6 6 6-6" stroke="#c8a84b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <style>{`
        @keyframes bounceHint {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(7px); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 1;   transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 0.7; transform: translate(-50%,-50%) scale(1.1); }
        }
      `}</style>
    </div>
  )
}
