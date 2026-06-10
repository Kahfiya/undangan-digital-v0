import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitTextReveal from '../components/SplitTextReveal'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax
      gsap.to('.hero-bg', {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })

      // Reveal elements
      gsap.fromTo('.hero-content > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1.5, ease: 'power3.out' }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#000000',
        textAlign: 'center',
        color: '#FFFFFF'
      }}
    >
      {/* Background with Parallax and Overlay */}
      <div className="hero-bg" style={{ position: 'absolute', inset: '-20% 0', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/gallery/Albums3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0, 0, 0, 0.4)'
        }} />
      </div>

      {/* Content */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 2, padding: '0 2rem' }}>
        <p style={{
          fontFamily: "'Lora', serif",
          fontSize: '14px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          opacity: 0.9
        }}>The Wedding of</p>

        <h1 style={{
          fontFamily: "'Sacramento', cursive",
          fontSize: 'clamp(3.5rem, 15vw, 6rem)',
          fontWeight: 400,
          lineHeight: 1.1,
          margin: '0 0 2rem',
          textShadow: '2px 4px 10px rgba(0,0,0,0.5)'
        }}>Riyan & Arbayah</h1>

        <div style={{
          width: '60px',
          height: '1.5px',
          background: '#FFFFFF',
          margin: '0 auto 2.5rem',
          opacity: 0.8
        }} />

        <p style={{
          fontFamily: "'Lora', serif",
          fontSize: '18px',
          letterSpacing: '0.15em',
          fontWeight: 400
        }}>05 . 07 . 2026</p>
      </div>

      {/* Scroll Indicator - 1:1 Lavicia */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3
      }}>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, #FFFFFF, transparent)'
          }}
        />
      </div>

      {/* Floating Floral Ornaments */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '100px', opacity: 0.5 }}>
        <img src="/backgrounds/Bunga1.png" alt="" style={{ width: '100%' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '120px', opacity: 0.5, transform: 'rotate(150deg)' }}>
        <img src="/backgrounds/Bunga1.png" alt="" style={{ width: '100%' }} />
      </div>
    </section>
  )
}
