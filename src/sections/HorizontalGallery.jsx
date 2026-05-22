import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SLIDES = [
  { src: '/gallery/Albums1.jpg', caption: 'Momen Pertama' },
  { src: '/gallery/Albums2.jpg', caption: 'Bersama Selalu' },
  { src: '/gallery/Albums3.jpg', caption: 'Penuh Cinta' },
  { src: '/gallery/Albums4.jpg', caption: 'Satu Hati' },
]

export default function HorizontalGallery() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Header: word-by-word reveal ──
      const words = sectionRef.current.querySelectorAll('.hg-word')
      gsap.from(words, {
        opacity: 0,
        y: 40,
        rotationX: -30,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.hg-header', start: 'top 85%', once: true },
      })

      // ── Eyebrow line draw ──
      gsap.from('.hg-divider', {
        scaleX: 0,
        transformOrigin: 'center',
        duration: 0.8,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.hg-header', start: 'top 85%', once: true },
      })

      // ── Cards: clip-path reveal from bottom, staggered ──
      gsap.fromTo('.hg-card',
        { opacity: 0, y: 80, clipPath: 'inset(100% 0 0 0)' },
        {
          opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
          stagger: 0.12,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.hg-card', start: 'top 90%', once: true },
        }
      )

      // ── Per-card: image parallax depth ──
      sectionRef.current.querySelectorAll('.hg-card-img').forEach(img => {
        gsap.fromTo(img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.hg-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      })

      // ── Caption reveal on scroll ──
      sectionRef.current.querySelectorAll('.hg-caption').forEach(cap => {
        gsap.from(cap, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: cap, start: 'top 95%', once: true },
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const col1 = [SLIDES[0], SLIDES[2]]
  const col2 = [SLIDES[1], SLIDES[3]]

  return (
    <section
      ref={sectionRef}
      id="horizontal-gallery"
      style={{ position: 'relative', background: 'var(--color-bg-dark)', overflow: 'hidden' }}
    >
      {/* Fade top */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 90,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.88), transparent)',
        zIndex: 3, pointerEvents: 'none',
      }} />
      {/* Fade bottom */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 90,
        background: 'linear-gradient(to top, rgba(255,255,255,0.88), transparent)',
        zIndex: 3, pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
      <div className="hg-header" style={{
        textAlign: 'center',
        padding: 'clamp(56px, 9vw, 100px) var(--space-6) clamp(32px, 5vw, 56px)',
        position: 'relative', zIndex: 2,
      }}>
        <p style={{
          fontSize: '0.65rem', letterSpacing: '0.4em',
          textTransform: 'uppercase', color: 'var(--color-gold)',
          marginBottom: 'var(--space-3)',
        }}>Pre-Wedding</p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: '#fff', fontWeight: 400,
          lineHeight: 1.1,
        }}>
          {'Galeri Kenangan'.split(' ').map((w, i) => (
            <span key={i} className="hg-word" style={{ display: 'inline-block', marginRight: '0.3em' }}>{w}</span>
          ))}
        </h2>
        <div className="hg-divider" style={{
          width: 56, height: 1,
          background: 'var(--color-gold-gradient)',
          margin: 'var(--space-5) auto 0',
        }} />
      </div>

      {/* ── Masonry 2-col ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(8px, 1.5vw, 20px)',
        padding: '0 clamp(12px, 3vw, 48px) clamp(56px, 9vw, 100px)',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {/* Col 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 20px)' }}>
          {col1.map((slide, i) => (
            <Card key={i} slide={slide} />
          ))}
        </div>

        {/* Col 2 — offset */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: 'clamp(8px, 1.5vw, 20px)',
          marginTop: 'clamp(28px, 5vw, 56px)',
        }}>
          {col2.map((slide, i) => (
            <Card key={i} slide={slide} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Card({ slide }) {
  return (
    <div className="hg-card" style={{
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
      border: '1px solid rgba(212,175,55,0.15)',
      willChange: 'transform',
    }}>
      <img
        className="hg-card-img"
        src={slide.src}
        alt={slide.caption}
        loading="lazy"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          willChange: 'transform',
        }}
      />
      {/* Gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Caption */}
      <div className="hg-caption" style={{
        position: 'absolute',
        bottom: 'var(--space-5)',
        left: 'var(--space-5)',
      }}>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
          color: '#fff', fontStyle: 'italic',
          marginBottom: 5,
          textShadow: '0 1px 8px rgba(0,0,0,0.5)',
        }}>{slide.caption}</p>
        <div style={{ width: 28, height: 1, background: 'var(--color-gold)' }} />
      </div>
    </div>
  )
}
