import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitTextReveal from '../components/SplitTextReveal'

const SLIDES = [
  { src: '/gallery/Albums1.jpg', caption: 'Selamanya' },
  { src: '/gallery/Albums2.jpg', caption: 'Bersama Selalu' },
  { src: '/gallery/Albums3.jpg', caption: 'Penuh Cinta' },
  { src: '/gallery/Albums4.jpg', caption: 'Satu Hati' },
  { src: '/gallery/Albums5.jpg', caption: 'Kenangan Indah' },
  { src: '/gallery/Albums6.jpg', caption: 'Momen Pertama' },
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

  const col1 = [SLIDES[0], SLIDES[2], SLIDES[4]]
  const col2 = [SLIDES[1], SLIDES[3], SLIDES[5]]

  return (
    <section
      ref={sectionRef}
      id="horizontal-gallery"
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}
    >
      {/* Header */}
      <div className="hg-header" style={{
        textAlign: 'center',
        padding: 'clamp(56px, 9vw, 100px) var(--space-6) clamp(32px, 5vw, 56px)',
        position: 'relative', zIndex: 2,
      }}>
        <SplitTextReveal 
          type="slide" 
          stagger={0.1}
          style={{
            fontSize: '1.5rem', 
            letterSpacing: '0.4em',
            textTransform: 'uppercase', 
            color: 'var(--color-gold-dark)',
            marginBottom: 'var(--space-3)',
            display: 'block',
            fontWeight: 600,
          }}
        >
          Gallery
        </SplitTextReveal>
        
        <div className="gold-divider" style={{ margin: 'var(--space-5) auto 0' }} />
      </div>

      {/* ── Vertical Stack ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
        padding: '0 1.5rem 6rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {SLIDES.map((slide, i) => (
          <Card key={i} slide={slide} index={i} />
        ))}
      </div>
    </section>
  )
}

function Card({ slide, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // Hover effects
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        boxShadow: '0 25px 80px rgba(212,175,55,0.1), 0 10px 30px rgba(212,175,55,0.05)',
        duration: 0.6,
        ease: 'power3.out'
      })

      gsap.to(card.querySelector('.hg-card-img'), {
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        duration: 0.6,
        ease: 'power3.out'
      })

      gsap.to(card.querySelector('.hg-card-img'), {
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
      })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div 
      ref={cardRef}
      className="hg-card" 
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid rgba(212,175,55,0.1)',
        willChange: 'transform',
        background: '#fff',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
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
          filter: 'brightness(102%) contrast(102%)',
        }}
      />
      
      {/* Enhanced light gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(252,252,252,0.8) 0%, rgba(252,252,252,0.2) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      
      {/* Caption */}
      <div className="hg-caption" style={{
        position: 'absolute',
        bottom: 'var(--space-4)',
        left: 'var(--space-4)',
      }}>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.85rem',
          color: 'var(--color-text)', 
          fontStyle: 'italic',
          marginBottom: 4,
          display: 'block',
        }}>
          {slide.caption}
        </p>
        
        <div style={{ 
          width: 24, 
          height: 1.5, 
          background: 'var(--color-gold)',
          borderRadius: '1px',
        }} />
      </div>
    </div>
  )
}
