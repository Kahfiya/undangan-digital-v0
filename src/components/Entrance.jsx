import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

const gold = '#d4a843'
const cream = '#fffef8'
const spring = { type: 'spring', stiffness: 40, damping: 25 }

function BirdFly({ size, top, duration, delay, flip }) {
  return (
    <img
      src="/magic-garden/Burung.svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        left: 0,
        width: size,
        height: 'auto',
        pointerEvents: 'none',
        zIndex: 3,
        opacity: 0.75,
        filter: 'drop-shadow(0 2px 6px rgba(212,175,55,0.35))',
        animation: `${flip ? 'birdFlyR' : 'birdFlyL'} ${duration}s linear ${delay}s infinite, birdBob 2.4s ease-in-out ${delay}s infinite`,
      }}
    />
  )
}

/* ── Welcome Cover ── */
function WelcomeCover({ guestName, onOpen }) {
  const btnRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(btnRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.65, delay: 1.8, ease: 'back.out(1.5)' }
    )
  }, [])

  const W = 400
  const H = guestName ? 510 : 450
  const btnY = guestName ? 414 : 345

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: `radial-gradient(ellipse at 50% 42%, ${cream} 0%, #fdf6e3 55%, #f0e0b0 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '42%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 68%)',
        animation: 'glowPulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Burung terbang */}
      {[
        { size: 52, top: '10%', duration: 14, delay: 0.5, flip: false },
        { size: 34, top: '20%', duration: 19, delay: 4,   flip: true  },
        { size: 26, top: '6%',  duration: 24, delay: 8,   flip: false },
      ].map((b, i) => <BirdFly key={i} {...b} />)}

      {/* Bunga-Biru pojok kiri bawah */}
      <motion.img
        src="/magic-garden/Bunga-Biru.png"
        alt="" aria-hidden="true"
        initial={{ opacity: 0, x: -30, y: 30 }}
        animate={{ opacity: 0.75, x: 0, y: 0 }}
        transition={{ ...spring, delay: 0.3 }}
        style={{
          position: 'absolute', bottom: '-2%', left: '-2%',
          width: 'clamp(140px, 28vw, 220px)', height: 'auto',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      {/* Bunga-Biru pojok kanan bawah (mirror) */}
      <motion.img
        src="/magic-garden/Bunga-Biru.png"
        alt="" aria-hidden="true"
        initial={{ opacity: 0, x: 30, y: 30 }}
        animate={{ opacity: 0.75, x: 0, y: 0 }}
        transition={{ ...spring, delay: 0.5 }}
        style={{
          position: 'absolute', bottom: '-2%', right: '-2%',
          width: 'clamp(140px, 28vw, 220px)', height: 'auto',
          transform: 'scaleX(-1)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      {/* Bunga1 pojok kiri atas */}
      <motion.img
        src="/magic-garden/Bunga1.svg"
        alt="" aria-hidden="true"
        initial={{ opacity: 0, rotate: -15 }}
        animate={{ opacity: 0.5, rotate: 0 }}
        transition={{ ...spring, delay: 0.6 }}
        style={{
          position: 'absolute', top: '-1%', left: '-1%',
          width: 'clamp(100px, 20vw, 160px)', height: 'auto',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      {/* Bunga1 pojok kanan atas (mirror) */}
      <motion.img
        src="/magic-garden/Bunga1.svg"
        alt="" aria-hidden="true"
        initial={{ opacity: 0, rotate: 15 }}
        animate={{ opacity: 0.5, rotate: 0 }}
        transition={{ ...spring, delay: 0.8 }}
        style={{
          position: 'absolute', top: '-1%', right: '-1%',
          width: 'clamp(100px, 20vw, 160px)', height: 'auto',
          transform: 'scaleX(-1)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Frame.svg sebagai bingkai dekoratif di belakang kartu */}
      <motion.img
        src="/magic-garden/Frame.svg"
        alt="" aria-hidden="true"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 0.22, scale: 1 }}
        transition={{ ...spring, delay: 0.2 }}
        style={{
          position: 'absolute',
          width: 'min(calc(100vw - 24px), 460px)',
          height: 'auto',
          pointerEvents: 'none', zIndex: 1,
        }}
      />

      {/* Kartu SVG utama */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: 'min(calc(100vw - 48px), 400px)',
          height: 'auto', overflow: 'hidden',
          position: 'relative', zIndex: 2,
        }}
        aria-label="Undangan pernikahan M. Riyan dan Siti Arbayah"
      >
        {/* Outer frame */}
        <rect x="28" y="28" width={W-56} height={H-56} rx="3"
          fill="none" stroke={gold} strokeWidth="1" opacity="0.35" />
        {/* Inner frame */}
        <rect x="37" y="37" width={W-74} height={H-74} rx="2"
          fill="none" stroke={gold} strokeWidth="0.5" opacity="0.2" />

        {/* Corner brackets */}
        <path d="M 28 50 L 28 28 L 50 28" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <path d={`M ${W-50} 28 L ${W-28} 28 L ${W-28} 50`} fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <path d={`M 28 ${H-50} L 28 ${H-28} L 50 ${H-28}`} fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <path d={`M ${W-50} ${H-28} L ${W-28} ${H-28} L ${W-28} ${H-50}`} fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" />

        {/* Diamond */}
        <path d={`M ${W/2} 90 L ${W/2+11} 105 L ${W/2} 120 L ${W/2-11} 105 Z`}
          fill="none" stroke={gold} strokeWidth="1.3" strokeLinejoin="round" opacity="0.6" />

        {/* Dividers */}
        <line x1={W/2-72} y1="138" x2={W/2+72} y2="138" stroke={gold} strokeWidth="0.8" opacity="0.5" />
        <line x1={W/2-72} y1="304" x2={W/2+72} y2="304" stroke={gold} strokeWidth="0.8" opacity="0.5" />

        {/* Eyebrow */}
        <text x={W/2} y="160" textAnchor="middle"
          fontFamily="'Montserrat', sans-serif" fontSize="10" letterSpacing="4.5"
          fill="rgba(160,110,10,0.85)">THE WEDDING OF</text>

        {/* Names */}
        <text x={W/2} y="206" textAnchor="middle"
          fontFamily="'Playfair Display', serif" fontSize="40" fontWeight="400"
          fill="#2a1c08">M. Riyan</text>
        <text x={W/2} y="244" textAnchor="middle"
          fontFamily="'Playfair Display', serif" fontSize="22" fontStyle="italic"
          fill="rgba(160,110,10,0.8)">&amp;</text>
        <text x={W/2} y="284" textAnchor="middle"
          fontFamily="'Playfair Display', serif" fontSize="36" fontStyle="italic"
          fill="#2a1c08">Siti Arbayah</text>

        {/* Date */}
        <text x={W/2} y="328" textAnchor="middle"
          fontFamily="'Montserrat', sans-serif" fontSize="10" letterSpacing="3.5"
          fill="rgba(42,28,8,0.6)">MINGGU · 05 JULI 2026</text>

        {/* Guest name */}
        {guestName && (
          <>
            <text x={W/2} y="358" textAnchor="middle"
              fontFamily="'Montserrat', sans-serif" fontSize="9" letterSpacing="2.5"
              fill="rgba(42,28,8,0.45)">KEPADA YTH.</text>
            <text x={W/2} y="378" textAnchor="middle"
              fontFamily="'Playfair Display', serif" fontSize="17" fontStyle="italic"
              fill="#2a1c08">{guestName}</text>
          </>
        )}

        {/* Button */}
        <foreignObject x="90" y={btnY} width="220" height="46" ref={btnRef}>
          <button
            onClick={onOpen}
            style={{
              width: '100%', height: '100%',
              background: 'transparent',
              border: `1.2px solid ${gold}`,
              borderRadius: 23,
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10, letterSpacing: '4px',
              color: gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >BUKA UNDANGAN</button>
        </foreignObject>
      </svg>

      <style>{`
        @keyframes glowPulse {
          0%,100% { opacity:1; transform:translate(-50%,-50%) scale(1); }
          50%      { opacity:0.7; transform:translate(-50%,-50%) scale(1.1); }
        }
        @keyframes birdFlyL {
          from { transform: translateX(-80px); }
          to   { transform: translateX(110vw); }
        }
        @keyframes birdFlyR {
          from { transform: scaleX(-1) translateX(-80px); }
          to   { transform: scaleX(-1) translateX(110vw); }
        }
        @keyframes birdBob {
          0%,100% { margin-top: 0px; }
          50%     { margin-top: 18px; }
        }
      `}</style>
    </motion.div>
  )
}

/* ── Curtain panels ── */
function Curtains({ isOpen }) {
  const ease = [0.76, 0, 0.24, 1]
  return (
    <>
      <motion.div
        initial={{ scaleY: 1 }}
        animate={isOpen ? { scaleY: 0 } : {}}
        transition={{ duration: 1.1, ease }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '50%',
          zIndex: 9998,
          background: 'linear-gradient(to bottom, #1a0e05, #2d1a08)',
          transformOrigin: 'top',
        }}
      />
      <motion.div
        initial={{ scaleY: 1 }}
        animate={isOpen ? { scaleY: 0 } : {}}
        transition={{ duration: 1.1, ease }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: '50%',
          zIndex: 9998,
          background: 'linear-gradient(to top, #1a0e05, #2d1a08)',
          transformOrigin: 'bottom',
        }}
      />
    </>
  )
}

/* ── Main Entrance ── */
export default function Entrance({ onComplete }) {
  const [phase, setPhase] = useState('cover')
  const guestName = new URLSearchParams(window.location.search).get('to') || ''

  const handleOpen = () => {
    setPhase('curtain')
    setTimeout(onComplete, 1200)
  }

  return (
    <>
      <AnimatePresence>
        {phase === 'cover' && (
          <WelcomeCover key="cover" guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>
      {phase === 'curtain' && <Curtains isOpen />}
    </>
  )
}
