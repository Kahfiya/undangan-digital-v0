import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs/lib/anime.es.js'
import SplitTextReveal from '../components/SplitTextReveal'

gsap.registerPlugin(ScrollTrigger)

const COUPLE = [
  {
    label: 'Mempelai Pria',
    name: 'M. Riyan',
    subtitle: 'Putra ke-3 dari\nBpk. Saiful & Ibu Maimunah',
    src: '/couple/Mempelai-Pria.jpg',
    alt: 'Foto mempelai pria M. Riyan',
    objectPosition: 'top center',
  },
  {
    label: 'Mempelai Wanita',
    name: 'Siti Arbayah',
    subtitle: 'Putri ke-2 dari\nBpk. H. Nordin & Ibu Hj. Siti Asyiah',
    src: '/couple/Mempelai-Wanita.jpg',
    alt: 'Foto mempelai wanita Siti Arbayah',
    objectPosition: 'center center',
  },
]

export default function Couple() {
  const sectionRef = useRef(null)
  const photoRefs  = useRef([])
  const overlayRefs = useRef([])
  const detailRefs  = useRef([])

  const handleEnter = (i) => {
    gsap.to(photoRefs.current[i],  { scale: 1.07, duration: 0.8, ease: 'power2.out' })
    gsap.to(overlayRefs.current[i], { opacity: 1,  duration: 0.5, ease: 'power2.out' })
    anime({
      targets: detailRefs.current[i]?.querySelectorAll('.detail-line'),
      translateY: [12, 0],
      opacity:    [0, 1],
      delay: anime.stagger(55, { start: 80 }),
      duration: 380,
      easing: 'easeOutExpo',
    })
  }

  const handleLeave = (i) => {
    gsap.to(photoRefs.current[i],  { scale: 1,   duration: 0.7, ease: 'power2.inOut' })
    gsap.to(overlayRefs.current[i], { opacity: 0, duration: 0.4, ease: 'power2.in' })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Header reveal
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.couple-header > *'),
        { opacity: 0, y: 50, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          stagger: 0.16, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.couple-header', start: 'top 82%', once: true },
        }
      )

      // Cards entrance — left rotates in from left, right from right
      gsap.fromTo('.couple-card:nth-child(1)',
        { opacity: 0, x: -80, rotation: -5, transformOrigin: 'left center' },
        { opacity: 1, x: 0,  rotation: 0,
          duration: 1.3, ease: 'power4.out',
          scrollTrigger: { trigger: '.couple-cards', start: 'top 80%', once: true } }
      )
      gsap.fromTo('.couple-card:nth-child(2)',
        { opacity: 0, x: 80, rotation: 5, transformOrigin: 'right center' },
        { opacity: 1, x: 0, rotation: 0,
          duration: 1.3, ease: 'power4.out', delay: 0.1,
          scrollTrigger: { trigger: '.couple-cards', start: 'top 80%', once: true } }
      )

      // Photo parallax
      sectionRef.current.querySelectorAll('.couple-photo').forEach(img => {
        gsap.fromTo(img,
          { yPercent: -6 },
          { yPercent: 6, ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.couple-card'),
              start: 'top bottom', end: 'bottom top', scrub: 1.5,
            } }
        )
      })

      // Gold shimmer sweep
      sectionRef.current.querySelectorAll('.couple-shimmer').forEach((el, i) => {
        gsap.fromTo(el,
          { x: '-110%' },
          { x: '210%', duration: 1.4, ease: 'power2.inOut',
            delay: 0.9 + i * 0.15,
            scrollTrigger: { trigger: el.closest('.couple-card'), start: 'top 85%', once: true } }
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

        {/* ── Header ── */}
        <div className="couple-header" style={{ textAlign: 'center' }}>
          <SplitTextReveal type="fade" className="section-subtitle" style={{ display: 'block' }}>
            Bismillahirrahmanirrahim
          </SplitTextReveal>
          <SplitTextReveal type="slide" className="section-title" style={{ display: 'block' }}>
            Dua Hati, Satu Janji
          </SplitTextReveal>
          <div className="gold-divider" />
          <SplitTextReveal
            type="blur" stagger={0.018}
            style={{
              display: 'block',
              fontSize: '0.95rem',
              color: 'var(--color-text-muted)',
              lineHeight: 2,
              maxWidth: 460,
              margin: 'var(--space-4) auto 0',
            }}
          >
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menyaksikan momen sakral kami.
          </SplitTextReveal>
        </div>

        {/* ── Portrait cards ── */}
        <div className="couple-cards" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(12px, 3vw, 28px)',
          marginTop: 'var(--space-10)',
          alignItems: 'start',
        }}>
          {COUPLE.map((p, i) => (
            <div
              key={i}
              className="couple-card"
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
              onTouchStart={() => handleEnter(i)}
              onTouchEnd={() => handleLeave(i)}
              style={{
                position: 'relative',
                /* Elegant oval/arch top — portrait shape */
                borderRadius: '999px 999px 40px 40px',
                overflow: 'hidden',
                /* Tall portrait ratio */
                aspectRatio: '2/3',
                boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 6px 20px rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.25)',
                cursor: 'default',
                willChange: 'transform',
              }}
            >
              {/* Photo */}
              <img
                ref={el => photoRefs.current[i] = el}
                className="couple-photo"
                src={p.src}
                alt={p.alt}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  objectPosition: p.objectPosition,
                  willChange: 'transform',
                  transformOrigin: 'center center',
                }}
              />

              {/* Gold shimmer sweep */}
              <div className="couple-shimmer" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(110deg, transparent 38%, rgba(212,175,55,0.22) 50%, transparent 62%)',
                pointerEvents: 'none', zIndex: 2,
              }} />

              {/* Permanent soft gradient at bottom — always readable */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,10,5,0.88) 0%, rgba(15,10,5,0.45) 38%, transparent 65%)',
                zIndex: 3,
                pointerEvents: 'none',
              }} />

              {/* Hover deepening overlay */}
              <div
                ref={el => overlayRefs.current[i] = el}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(15,10,5,0.55) 0%, rgba(15,10,5,0.2) 60%, transparent 100%)',
                  opacity: 0,
                  zIndex: 4,
                  pointerEvents: 'none',
                }}
              />

              {/* Info — always visible, floats over photo */}
              <div
                ref={el => detailRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  padding: 'clamp(16px, 4vw, 28px)',
                  zIndex: 5,
                  textAlign: 'center',
                }}
              >
                {/* Label */}
                <p className="detail-line" style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-light)',
                  marginBottom: 6,
                  fontWeight: 600,
                }}>
                  {p.label}
                </p>

                {/* Gold thin line */}
                <div className="detail-line" style={{
                  width: 32, height: 1,
                  background: 'var(--color-gold-gradient)',
                  margin: '0 auto 10px',
                  borderRadius: '1px',
                  opacity: 0.8,
                }} />

                {/* Name */}
                <p className="detail-line" style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.15rem, 3.5vw, 1.55rem)',
                  color: '#fff',
                  lineHeight: 1.15,
                  marginBottom: 8,
                  fontWeight: 400,
                  textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                }}>
                  {p.name}
                </p>

                {/* Subtitle */}
                <p className="detail-line" style={{
                  fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)',
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.75,
                  whiteSpace: 'pre-line',
                }}>
                  {p.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
