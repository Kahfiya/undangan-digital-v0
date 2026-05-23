import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import FloatingElements from './FloatingElements'

const spring = { type: 'spring', stiffness: 40, damping: 25 }
const gold = '#d4a843'

export default function HeroScene({ visible = true }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const bgY      = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const midY     = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const fgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const fgY      = useTransform(scrollYProgress, [0, 1], ['0%', '-6%'])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        overflow: 'hidden',
        background: '#0d1a0d',
      }}
    >
      {/* ── Layer 1: Background — Bercak.svg sebagai tekstur + video ── */}
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY, zIndex: 1 }}>
        {/* Video background */}
        <video
          autoPlay muted loop playsInline
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '110%', objectFit: 'cover', opacity: 0.55 }}
          ref={el => {
            if (!el) return
            el.src = window.innerWidth <= 768 ? '/hero/Hero-bg2-mobile.mp4' : '/hero/Hero-bg2.mp4'
          }}
        />
        {/* Bercak tekstur overlay */}
        <img
          src="/magic-garden/Bercak.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.18,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
        {/* Overlay gelap */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,20,10,0.35) 0%, rgba(10,20,10,0.65) 100%)',
        }} />
      </motion.div>

      {/* ── Layer 2: Midground — Pilar.png + FloatingElements ── */}
      <motion.div style={{ position: 'absolute', inset: 0, y: midY, zIndex: 2 }}>
        {/* Pilar kiri */}
        <motion.img
          src="/magic-garden/Pilar.png"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.6 }}
          style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '75%', width: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
        {/* Pilar kanan (mirror) */}
        <motion.img
          src="/magic-garden/Pilar.png"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.7 }}
          style={{
            position: 'absolute', bottom: 0, right: 0,
            height: '75%', width: 'auto',
            objectFit: 'contain',
            transform: 'scaleX(-1)',
            pointerEvents: 'none',
          }}
        />
        <FloatingElements />
      </motion.div>

      {/* ── Layer 3: Frame.svg sebagai bingkai dekoratif ── */}
      <motion.img
        src="/magic-garden/Frame.svg"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={visible ? { opacity: 0.55, scale: 1 } : {}}
        transition={{ ...spring, delay: 1.0 }}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* ── Layer 4: Foreground — teks nama mempelai ── */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          y: fgY, opacity: fgOpacity,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ ...spring, delay: 0.4 }}
          style={{ textAlign: 'center', padding: '0 24px' }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={visible ? { opacity: 1, letterSpacing: '0.4em' } : {}}
            transition={{ duration: 1.4, delay: 0.6, ease: 'easeOut' }}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.4em',
              color: 'rgba(212,175,55,0.85)',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            The Wedding of
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 0.8 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.8rem, 12vw, 5.5rem)',
              fontWeight: 400, color: '#ffffff',
              margin: 0, lineHeight: 1.05,
            }}
          >
            M. Riyan
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={visible ? { opacity: 1, scale: 1 } : {}}
            transition={{ ...spring, delay: 1.1 }}
            style={{
              display: 'block',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.4rem, 5vw, 2.8rem)',
              fontStyle: 'italic', color: gold,
              margin: '8px 0',
            }}
          >
            &amp;
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ ...spring, delay: 1.3 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 10vw, 4.8rem)',
              fontWeight: 400, fontStyle: 'italic',
              color: gold, margin: 0, lineHeight: 1.05,
            }}
          >
            Siti Arbayah
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={visible ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 1.6, ease: 'easeOut' }}
            style={{
              width: 72, height: 1.5,
              background: `linear-gradient(to right, transparent, ${gold}, transparent)`,
              margin: '20px auto', transformOrigin: 'center',
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 0.75 } : {}}
            transition={{ duration: 1, delay: 1.8 }}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '0.72rem', letterSpacing: '0.28em',
              color: 'rgba(255,255,255,0.75)',
              textTransform: 'uppercase',
            }}
          >
            Minggu · 05 Juli 2026
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Fade ke bawah */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to bottom, transparent, #fff)',
        zIndex: 6, pointerEvents: 'none',
      }} />
    </div>
  )
}
