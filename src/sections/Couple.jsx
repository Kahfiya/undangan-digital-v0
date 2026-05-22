import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs/lib/anime.es.js'
import TextReveal from '../components/TextReveal'
import SplitTextReveal from '../components/SplitTextReveal'

const COUPLE = [
  {
    label: 'Mempelai Pria',
    name: 'M. Riyan',
    subtitle: 'Putra ke-3 dari\nBpk. Saiful & Ibu Maimunah',
    src: '/couple/Mempelai-Pria.jpg',
    alt: 'Foto mempelai pria M. Riyan',
    objectPosition: 'top center',
    aspectRatio: '3/4',
  },
  {
    label: 'Mempelai Wanita',
    name: 'Siti Arbayah',
    subtitle: 'Putri ke-2 dari\nBpk. H. Nordin & Ibu Hj. Siti Asyiah',
    src: '/couple/Mempelai-Wanita.jpg',
    alt: 'Foto mempelai wanita Siti Arbayah',
    objectPosition: 'center center',
    aspectRatio: '3/4',
  },
]

export default function Couple() {
  const sectionRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  // Per-card refs for GSAP micro-interactions
  const photoRefs = useRef([])
  const overlayRefs = useRef([])
  const overlayTextRefs = useRef([])

  const handleEnter = (i) => {
    setHovered(i)
    // Photo zoom
    gsap.to(photoRefs.current[i], { scale: 1.08, duration: 0.7, ease: 'power2.out' })
    // Overlay slide up
    gsap.to(overlayRefs.current[i], { yPercent: 0, duration: 0.55, ease: 'power3.out' })
    // Text stagger in
    anime({
      targets: overlayTextRefs.current[i]?.children,
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(60, { start: 120 }),
      duration: 400,
      easing: 'easeOutExpo',
    })
  }

  const handleLeave = (i) => {
    setHovered(null)
    gsap.to(photoRefs.current[i], { scale: 1, duration: 0.6, ease: 'power2.inOut' })
    gsap.to(overlayRefs.current[i], { yPercent: 100, duration: 0.45, ease: 'power3.in' })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Header: setiap elemen muncul dengan delay dramatis ──
      const headerEls = sectionRef.current.querySelectorAll('.couple-header > *')
      gsap.fromTo(headerEls,
        { opacity: 0, y: 60, filter: 'blur(8px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          stagger: 0.18,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.couple-header', start: 'top 82%', once: true },
        }
      )

      // ── Card kiri: masuk dari kiri dengan rotation ──
      gsap.fromTo('.couple-card:nth-child(1)',
        { opacity: 0, x: -100, rotation: -6, transformOrigin: 'left center' },
        {
          opacity: 1, x: 0, rotation: 0,
          duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.couple-cards', start: 'top 82%', once: true },
        }
      )

      // ── Card kanan: masuk dari kanan dengan rotation ──
      gsap.fromTo('.couple-card:nth-child(2)',
        { opacity: 0, x: 100, rotation: 6, transformOrigin: 'right center' },
        {
          opacity: 1, x: 0, rotation: 0,
          duration: 1.2, ease: 'power4.out',
          delay: 0.12,
          scrollTrigger: { trigger: '.couple-cards', start: 'top 82%', once: true },
        }
      )

      // ── Photo parallax — zoom out saat scroll ──
      sectionRef.current.querySelectorAll('.couple-photo').forEach(img => {
        gsap.fromTo(img,
          { scale: 1.18, yPercent: -4 },
          {
            scale: 1, yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.couple-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      })

      // ── Info text: stagger reveal per baris ──
      sectionRef.current.querySelectorAll('.couple-info').forEach(info => {
        gsap.fromTo(Array.from(info.children),
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: info, start: 'top 92%', once: true },
          }
        )
      })

      // ── Gold shimmer sweep on cards ──
      sectionRef.current.querySelectorAll('.couple-shimmer').forEach((el, i) => {
        gsap.fromTo(el,
          { x: '-100%' },
          {
            x: '200%',
            duration: 1.2,
            ease: 'power2.inOut',
            delay: 0.8 + i * 0.15,
            scrollTrigger: { trigger: el.closest('.couple-card'), start: 'top 85%', once: true },
          }
        )
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section"
      id="couple"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="couple-header" style={{ textAlign: 'center' }}>
          <SplitTextReveal 
            type="fade" 
            className="section-subtitle"
            style={{ display: 'block' }}
          >
            Bismillahirrahmanirrahim
          </SplitTextReveal>
          
          <SplitTextReveal 
            type="slide" 
            className="section-title"
            style={{ display: 'block' }}
          >
            Dua Hati, Satu Janji
          </SplitTextReveal>
          
          <div className="gold-divider" data-pin-animate="scale" />
          
          <SplitTextReveal 
            type="blur" 
            stagger={0.02}
            style={{
              fontSize: '0.8rem', 
              color: 'var(--color-text-muted)',
              lineHeight: 1.9, 
              textAlign: 'center', 
              marginTop: 'var(--space-4)',
              maxWidth: 480, 
              margin: 'var(--space-4) auto 0',
              display: 'block',
            }}
          >
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menyaksikan momen sakral kami.
          </SplitTextReveal>
        </div>

        {/* Cards */}
        <div className="couple-cards" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-10)',
        }}>
          {COUPLE.map((p, i) => (
            <div
              key={i}
              className="couple-card magnetic-target"
              data-magnetic
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
              onTouchStart={() => handleEnter(i)}
              onTouchEnd={() => handleLeave(i)}
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 8px 25px rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.3)',
                background: 'var(--color-bg-soft)',
                willChange: 'transform',
                position: 'relative',
                cursor: 'none',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {/* Photo */}
              <div data-clip="up" data-parallax="0.2" style={{ 
                aspectRatio: p.aspectRatio, 
                overflow: 'hidden', 
                position: 'relative' 
              }}>
                <img
                  ref={el => photoRefs.current[i] = el}
                  className="couple-photo"
                  src={p.src}
                  alt={p.alt}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: p.objectPosition,
                    display: 'block', willChange: 'transform',
                    transformOrigin: 'center center',
                    filter: 'contrast(1.1) saturate(1.1)',
                  }}
                />
                
                {/* Gold shimmer sweep */}
                <div className="couple-shimmer" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.25) 50%, transparent 60%)',
                  pointerEvents: 'none', zIndex: 1,
                }} />

                {/* Hover overlay — slides up from bottom */}
                <div
                  ref={el => overlayRefs.current[i] = el}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(26,18,9,0.95) 0%, rgba(26,18,9,0.7) 60%, transparent 100%)',
                    transform: 'translateY(100%)',
                    display: 'flex', alignItems: 'flex-end',
                    padding: '24px 20px',
                    zIndex: 2,
                  }}
                >
                  <div ref={el => overlayTextRefs.current[i] = el}>
                    <p style={{
                      fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: 'var(--color-gold)', marginBottom: 6, opacity: 0,
                    }}>{p.label}</p>
                    <p style={{
                      fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                      color: '#fff', lineHeight: 1.2, marginBottom: 8, opacity: 0,
                    }}>{p.name}</p>
                    <p style={{
                      fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.6, whiteSpace: 'pre-line', opacity: 0,
                    }}>{p.subtitle}</p>
                    {/* Gold line accent */}
                    <div style={{
                      width: 40, height: 2, marginTop: 12,
                      background: 'var(--color-gold-gradient)', opacity: 0,
                      borderRadius: '1px',
                    }} />
                  </div>
                </div>
              </div>

              {/* Info below photo — visible when not hovered */}
              <div className="couple-info" style={{
                padding: 'var(--space-4) var(--space-4) var(--space-5)',
                transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                opacity: hovered === i ? 0.3 : 1,
              }}>
                <p style={{
                  fontSize: '0.55rem', letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'var(--color-gold)',
                  marginBottom: 'var(--space-1)',
                }}>{p.label}</p>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  lineHeight: 1.2, marginBottom: 'var(--space-2)',
                }}>{p.name}</p>
                <p style={{
                  fontSize: '0.7rem', color: 'var(--color-text-muted)',
                  lineHeight: 1.6, whiteSpace: 'pre-line',
                }}>{p.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
