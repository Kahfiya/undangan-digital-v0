import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import BirdContainer from './BirdContainer'

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

/* ── Main ── */
export default function EnvelopeGate({ onOpen }) {
  const guestName = new URLSearchParams(window.location.search).get('to') || ''
  const [visible, setVisible] = useState(true)
  const [slideIdx, setSlideIdx] = useState(0)
  const btnRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx(prev => (prev === 0 ? 1 : 0))
    }, 4500)
    return () => clearInterval(interval)
  }, [])

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="gate"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', overflowX: 'hidden', background: '#f0f5fa' }}
        >
          {/* Background Slideshow with Ken Burns effect */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#000000' }}>
            {['/gallery/Albums1.jpg', '/gallery/Albums2.jpg'].map((src, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: slideIdx === idx ? 1 : 0,
                  transition: 'opacity 2000ms ease-in-out, transform 8000ms ease-out',
                  transform: slideIdx === idx ? 'scale(1.12)' : 'scale(1.0)',
                  willChange: 'transform, opacity',
                }}
              />
            ))}
          </div>
          {/* Dark overlay for B&W theme readability */}
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 0 }} />

          {/* Bunga jatuh */}
          <FallingPetals />

          {/* Burung-burung terbang */}
          <BirdContainer count={3} />

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
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.6rem, 2.5vw, 0.72rem)', letterSpacing: '0.15em', color: 'var(--color-blue)', marginBottom: '1rem' }}
            >Pernikahan Suci</motion.p>

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
                boxShadow: '0 0 0 3px var(--color-blue), 0 0 0 6px var(--color-blue-pale), 0 12px 48px rgba(13,31,60,0.18)',
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
                background: 'radial-gradient(circle, var(--color-gold-light), var(--color-gold))',
                boxShadow: '0 0 8px rgba(212,175,55,0.8)',
              }} />
            </motion.div>

            {/* Names */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 8vw, 2.8rem)', fontWeight: 400, color: 'var(--color-text)', lineHeight: 1.15, margin: '0 0 0.5rem' }}
            >M. Riyan</motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1rem, 4vw, 1.3rem)', fontStyle: 'italic', color: 'var(--color-gold)', margin: '0 0 0.5rem' }}
            >&amp;</motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 7vw, 2.4rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--color-text)', lineHeight: 1.15, margin: '0 0 0.4rem' }}
            >Siti Arbayah</motion.h1>

            {/* Gold divider */}
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              style={{ width: 60, height: 1.5, background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)', margin: '0.6rem auto 1rem', transformOrigin: 'center' }}
            />

            {/* Date */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.55rem, 2vw, 0.65rem)', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '1rem' }}
            >Minggu · 05 Juli 2026</motion.p>

            {/* Button */}
            <motion.button
              ref={btnRef} onClick={handleOpen}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(30,95,168,0.5)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'relative', overflow: 'hidden', display: 'inline-flex', alignItems: 'center',
                padding: 'clamp(0.7rem, 3vw, 0.8rem) clamp(1.8rem, 6vw, 2.4rem)',
                background: 'var(--color-blue-gradient)',
                color: '#fff', border: 'none', borderRadius: 999,
                fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(0.7rem, 2.5vw, 0.78rem)',
                fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: 'pointer', boxShadow: 'var(--shadow-blue)', touchAction: 'manipulation',
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
