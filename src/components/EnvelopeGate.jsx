import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

/* ── Falling Petals ── */
const PETAL_COLORS = ['#f9c6d0', '#f7b8c4', '#fad4bb', '#f5c842', '#e8a0b0']
const PETAL_COUNT = typeof window !== 'undefined' && window.innerWidth <= 768 ? 8 : 18

function usePetals() {
  const [petals] = useState(() =>
    Array.from({ length: PETAL_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 8 + Math.random() * 10,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 10,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 120,
    }))
  )
  return petals
}

function FallingPetals() {
  const petals = usePetals()
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 4, overflow: 'hidden' }}>
      {petals.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size * 0.7,
            borderRadius: '50% 0 50% 0',
            background: p.color,
            opacity: 0.75,
            animation: `petalFall ${p.duration}s ${p.delay}s linear infinite`,
            '--drift': `${p.drift}px`,
            '--rotate': `${p.rotate}deg`,
          }}
        />
      ))}
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.75; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(105vh) translateX(var(--drift)) rotate(var(--rotate)); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/* ── Butterfly ── */
function Butterfly({ id, initialX, initialY }) {
  const wrapRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const tlRef = useRef(null)
  const fleeing = useRef(false)

  const wings = [
    { body: '#d4a017', wing: '#f5c842' },
    { body: '#c4960a', wing: '#fad96a' },
    { body: '#b8860b', wing: '#fffacd' },
    { body: '#d4a843', wing: '#fff8dc' },
  ][id % 4]

  const nextPos = () => ({
    x: 60 + Math.random() * (window.innerWidth - 120),
    y: 60 + Math.random() * (window.innerHeight - 120),
  })

  // Buat path bergelombang antara dua titik dengan waypoint acak di tengah
  const flyTo = useCallback((tx, ty, onDone) => {
    const el = wrapRef.current
    if (!el) return
    const { x: sx, y: sy } = posRef.current
    // Waypoint acak di tengah untuk kurva natural
    const mx = (sx + tx) / 2 + (Math.random() - 0.5) * 200
    const my = (sy + ty) / 2 + (Math.random() - 0.5) * 150
    const dist = Math.hypot(tx - sx, ty - sy)
    const dur = 1.8 + dist / 300

    tlRef.current?.kill()
    tlRef.current = gsap.timeline({ onComplete: onDone })
      .to(el, { x: mx, y: my, duration: dur * 0.5, ease: 'sine.inOut' })
      .to(el, { x: tx, y: ty, duration: dur * 0.5, ease: 'sine.inOut' })

    posRef.current = { x: tx, y: ty }
  }, [])

  const wander = useCallback(() => {
    if (fleeing.current) return
    const t = nextPos()
    flyTo(t.x, t.y, () => setTimeout(wander, 200 + Math.random() * 500))
  }, [flyTo])

  useEffect(() => {
    const sx = initialX / 100 * window.innerWidth
    const sy = initialY / 100 * window.innerHeight
    posRef.current = { x: sx, y: sy }
    gsap.set(wrapRef.current, { x: sx, y: sy })
    const t = setTimeout(wander, id * 300 + 200)
    return () => { clearTimeout(t); tlRef.current?.kill() }
  }, [])

  const flee = (cx, cy) => {
    fleeing.current = true
    tlRef.current?.kill()
    const { x: bx, y: by } = posRef.current
    const dx = bx - cx, dy = by - cy
    const len = Math.hypot(dx, dy) || 1
    const tx = Math.max(30, Math.min(window.innerWidth - 30, bx + (dx / len) * 220))
    const ty = Math.max(30, Math.min(window.innerHeight - 30, by + (dy / len) * 220))
    posRef.current = { x: tx, y: ty }
    gsap.to(wrapRef.current, {
      x: tx, y: ty, duration: 0.35, ease: 'power4.out',
      onComplete() {
        fleeing.current = false
        setTimeout(wander, 300)
      },
    })
  }

  return (
    <div
      ref={wrapRef}
      onMouseEnter={e => flee(e.clientX, e.clientY)}
      onTouchStart={e => { e.preventDefault(); flee(e.touches[0].clientX, e.touches[0].clientY) }}
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 5,
        pointerEvents: 'auto', cursor: 'default',
        transform: 'translate(-50%,-50%)',
        willChange: 'transform',
      }}
    >
      {/* Inner: wing flap CSS — tidak konflik dengan GSAP karena parent pakai x/y matrix */}
      <div style={{
        animation: `wingFlap ${0.22 + id * 0.03}s ease-in-out infinite alternate`,
        transformOrigin: 'center center',
      }}>
        <svg width="32" height="26" viewBox="0 0 32 26" fill="none" style={{ filter: `drop-shadow(0 1px 4px rgba(180,130,0,0.45))` }}>
          <path d="M15 12 Q7 3 1 7 Q-1 13 6 15 Q11 16 15 12Z" fill={wings.wing} opacity="0.95"/>
          <path d="M17 12 Q25 3 31 7 Q33 13 26 15 Q21 16 17 12Z" fill={wings.wing} opacity="0.95"/>
          <path d="M15 14 Q8 15 5 21 Q7 25 12 23 Q15 21 15 14Z" fill={wings.body} opacity="0.85"/>
          <path d="M17 14 Q24 15 27 21 Q25 25 20 23 Q17 21 17 14Z" fill={wings.body} opacity="0.85"/>
          <ellipse cx="16" cy="13" rx="1.3" ry="6.5" fill="#6b4800" opacity="0.9"/>
          <line x1="15.2" y1="7" x2="11" y2="2" stroke="#6b4800" strokeWidth="0.9" strokeLinecap="round"/>
          <circle cx="10.5" cy="1.5" r="1.1" fill={wings.body}/>
          <line x1="16.8" y1="7" x2="21" y2="2" stroke="#6b4800" strokeWidth="0.9" strokeLinecap="round"/>
          <circle cx="21.5" cy="1.5" r="1.1" fill={wings.body}/>
        </svg>
      </div>
    </div>
  )
}

/* ── Main ── */
export default function EnvelopeGate({ onOpen }) {
  const guestName = new URLSearchParams(window.location.search).get('to') || ''
  const [visible, setVisible] = useState(true)
  const btnRef = useRef(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    const shimmer = btn.querySelector('.btn-shimmer')
    if (!shimmer) return
    const anim = gsap.fromTo(shimmer,
      { x: '-120%' },
      { x: '220%', duration: 2.2, ease: 'power1.inOut', repeat: -1, repeatDelay: 2.5, delay: 2 }
    )
    return () => anim.kill()
  }, [])

  const handleOpen = () => {
    setVisible(false)
    setTimeout(onOpen, 700)
  }

  const isMobile = window.innerWidth <= 768
  const butterflies = [
    { id: 0, initialX: 15, initialY: 20 },
    { id: 1, initialX: 70, initialY: 15 },
    ...(!isMobile ? [
      { id: 2, initialX: 40, initialY: 60 },
      { id: 3, initialX: 80, initialY: 55 },
    ] : []),
  ]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="gate"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', overflowX: 'hidden', background: '#f5ede0' }}
        >
          {/* Background — video desktop, image mobile */}
          {typeof window !== 'undefined' && window.innerWidth > 768 ? (
            <video
              autoPlay muted loop playsInline
              style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              src="/backgrounds/Background EnvelopeGate.mp4"
            />
          ) : (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 0,
              backgroundImage: 'url(/backgrounds/Background2.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          )}
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(248,242,228,0.35)', zIndex: 0 }} />

          {/* Bunga jatuh */}
          <FallingPetals />

          {/* Kupu-kupu */}
          {butterflies.map(b => <Butterfly key={b.id} {...b} />)}

          <style>{`
            @keyframes wingFlap {
              from { transform: scaleX(1) scaleY(1); }
              to   { transform: scaleX(0.3) scaleY(0.85); }
            }
          `}</style>

          {/* Content */}
          <div style={{
            position: 'relative', zIndex: 3,
            minHeight: '100dvh',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '48px 24px 80px', textAlign: 'center',
          }}>
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.6rem, 2.5vw, 0.72rem)', letterSpacing: '0.15em', color: '#c4960a', marginBottom: '1rem' }}
            >The Wedding of</motion.p>

            {/* Couple photo — arch frame premium */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, type: 'spring', stiffness: 60, damping: 16 }}
              style={{ position: 'relative', width: 'clamp(160px, 52vw, 210px)', marginBottom: '1.6rem' }}
            >
              {/* Arch photo container */}
              <div style={{
                width: '100%', aspectRatio: '3/4',
                borderRadius: '50% 50% 8px 8px / 40% 40% 8px 8px',
                overflow: 'hidden',
                boxShadow: '0 0 0 3px rgba(212,175,55,0.7), 0 0 0 6px rgba(212,175,55,0.2), 0 12px 48px rgba(0,0,0,0.18)',
                background: '#f5f0e8',
              }}>
                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                  <img src="/couple/Mempelai%20Wanita.jpg" alt="Mempelai Wanita"
                    style={{ width: '50%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                  <img src="/couple/Mempelai%20Pria.jpg" alt="Mempelai Pria"
                    style={{ width: '50%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                </div>
              </div>
              {/* Gold ornament top */}
              <div style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                width: 20, height: 20, borderRadius: '50%',
                background: 'radial-gradient(circle, #f5c842, #c4960a)',
                boxShadow: '0 0 8px rgba(212,175,55,0.8)',
              }} />
            </motion.div>

            {/* Names */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 8vw, 2.8rem)', fontWeight: 400, color: '#1a1209', lineHeight: 1.15, margin: '0 0 0.5rem' }}
            >M. Riyan</motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1rem, 4vw, 1.3rem)', fontStyle: 'italic', color: '#c4960a', margin: '0 0 0.5rem' }}
            >&amp;</motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 7vw, 2.4rem)', fontWeight: 400, fontStyle: 'italic', color: '#1a1209', lineHeight: 1.15, margin: '0 0 0.4rem' }}
            >Siti Arbayah</motion.h1>

            {/* Gold divider */}
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              style={{ width: 60, height: 1.5, background: 'linear-gradient(90deg, transparent, #c4960a, transparent)', margin: '0.6rem auto 1rem', transformOrigin: 'center' }}
            />

            {/* Date */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.55rem, 2vw, 0.65rem)', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(26,18,9,0.55)', marginBottom: '1rem' }}
            >Minggu · 05 Juli 2026</motion.p>

            {/* Button */}
            <motion.button
              ref={btnRef} onClick={handleOpen}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(212,175,55,0.5)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'relative', overflow: 'hidden', display: 'inline-flex', alignItems: 'center',
                padding: 'clamp(0.7rem, 3vw, 0.8rem) clamp(1.8rem, 6vw, 2.4rem)',
                background: 'linear-gradient(135deg, #c4960a 0%, #c4960a 50%, #c4960a 100%)',
                color: '#fff', border: 'none', borderRadius: 999,
                fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.7rem, 2.5vw, 0.78rem)',
                fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,175,55,0.4)', touchAction: 'manipulation',
              }}
            >
              <span className="btn-shimmer" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.28) 50%, transparent 62%)', pointerEvents: 'none' }} />
              Buka Undangan
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
