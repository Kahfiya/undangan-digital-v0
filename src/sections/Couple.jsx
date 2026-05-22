import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '../components/TextReveal'

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
          <p className="section-subtitle">Bismillahirrahmanirrahim</p>
          <h2 className="section-title">Dua Hati, Satu Janji</h2>
          <div className="gold-divider" />
          <p style={{
            fontSize: '0.8rem', color: 'var(--color-text-muted)',
            lineHeight: 1.9, textAlign: 'center', marginTop: 'var(--space-4)',
            maxWidth: 480, margin: 'var(--space-4) auto 0',
          }}>
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda
            untuk menyaksikan momen sakral kami.
          </p>
        </div>

        {/* Cards */}
        <div className="couple-cards" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-10)',
        }}>
          {COUPLE.map((p, i) => (
            <div key={i} className="couple-card" style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 16px 56px rgba(0,0,0,0.14)',
              border: '1px solid rgba(212,175,55,0.25)',
              background: 'var(--color-bg-soft)',
              willChange: 'transform',
              position: 'relative',
            }}>
              {/* Photo */}
              <div style={{ aspectRatio: p.aspectRatio, overflow: 'hidden', position: 'relative' }}>
                <img
                  className="couple-photo"
                  src={p.src}
                  alt={p.alt}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: p.objectPosition,
                    display: 'block', willChange: 'transform',
                  }}
                />
                {/* Gold shimmer sweep */}
                <div className="couple-shimmer" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.18) 50%, transparent 60%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }} />
              </div>

              {/* Info */}
              <div className="couple-info" style={{
                padding: 'var(--space-4) var(--space-4) var(--space-5)',
              }}>
                <p style={{
                  fontSize: '0.55rem', letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'var(--color-gold)',
                  marginBottom: 'var(--space-1)',
                }}>
                  {p.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  lineHeight: 1.2, marginBottom: 'var(--space-2)',
                }}>
                  {p.name}
                </p>
                <p style={{
                  fontSize: '0.7rem', color: 'var(--color-text-muted)',
                  lineHeight: 1.6, whiteSpace: 'pre-line',
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
