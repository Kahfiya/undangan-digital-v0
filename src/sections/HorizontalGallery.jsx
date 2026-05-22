import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitTextReveal from '../components/SplitTextReveal'

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
      style={{ position: 'relative', overflow: 'hidden' }}
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
            color: 'var(--color-gold)',
            marginBottom: 'var(--space-3)',
            display: 'block',
          }}
        >
          Albums
        </SplitTextReveal>
        
        <div className="hg-divider" data-pin-animate="scale" style={{
          width: 56, height: 2,
          background: 'var(--color-gold-gradient)',
          margin: 'var(--space-5) auto 0',
          borderRadius: '1px',
          boxShadow: '0 0 15px rgba(212,175,55,0.4)',
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
            <Card key={i} slide={slide} index={i} />
          ))}
        </div>

        {/* Col 2 — offset */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: 'clamp(8px, 1.5vw, 20px)',
          marginTop: 'clamp(28px, 5vw, 56px)',
        }}>
          {col2.map((slide, i) => (
            <Card key={i} slide={slide} index={i + 2} />
          ))}
        </div>
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
        boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(212,175,55,0.2)',
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
        boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
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
      className="hg-card magnetic-target" 
      data-magnetic
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
        border: '1px solid rgba(212,175,55,0.2)',
        willChange: 'transform',
        cursor: 'none',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <img
        className="hg-card-img"
        src={slide.src}
        alt={slide.caption}
        loading="lazy"
        data-parallax="0.1"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          willChange: 'transform',
          filter: 'contrast(1.05) saturate(1.1)',
        }}
      />
      
      {/* Enhanced gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      
      {/* Caption */}
      <div className="hg-caption" style={{
        position: 'absolute',
        bottom: 'var(--space-5)',
        left: 'var(--space-5)',
      }}>
        <SplitTextReveal 
          type="slide" 
          stagger={0.03}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            color: '#fff', 
            fontStyle: 'italic',
            marginBottom: 8,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            display: 'block',
          }}
        >
          {slide.caption}
        </SplitTextReveal>
        
        <div style={{ 
          width: 32, 
          height: 2, 
          background: 'var(--color-gold)',
          borderRadius: '1px',
          boxShadow: '0 0 10px rgba(212,175,55,0.5)',
        }} />
      </div>
    </div>
  )
}
