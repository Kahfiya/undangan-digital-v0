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

      // ── Card left: clip-path reveal from left ──
      gsap.fromTo('.couple-card:nth-child(1)',
        {
          opacity: 0,
          x: -60,
          clipPath: 'inset(0 100% 0 0)',
        },
        {
          opacity: 1,
          x: 0,
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.couple-card', start: 'top 85%', once: true },
        }
      )

      // ── Card right: clip-path reveal from right ──
      gsap.fromTo('.couple-card:nth-child(2)',
        {
          opacity: 0,
          x: 60,
          clipPath: 'inset(0 0 0 100%)',
        },
        {
          opacity: 1,
          x: 0,
          clipPath: 'inset(0 0 0 0%)',
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: { trigger: '.couple-card', start: 'top 85%', once: true },
        }
      )

      // ── Photo parallax zoom on scroll ──
      document.querySelectorAll('.couple-photo').forEach(img => {
        gsap.fromTo(img,
          { scale: 1.12 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.couple-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        )
      })

      // ── Info text stagger reveal ──
      document.querySelectorAll('.couple-info').forEach(info => {
        const children = Array.from(info.children)
        gsap.from(children, {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: info, start: 'top 90%', once: true },
        })
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
        <TextReveal>
          <p className="section-subtitle">Bismillahirrahmanirrahim</p>
          <h2 className="section-title">Dua Hati, Satu Janji</h2>
          <div className="gold-divider" />
          <p style={{
            fontSize: '0.8rem', color: 'var(--color-text-muted)',
            lineHeight: 1.8, textAlign: 'center', marginTop: 'var(--space-4)',
          }}>
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda
            untuk menyaksikan momen sakral kami.
          </p>
        </TextReveal>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-10)',
        }}>
          {COUPLE.map((p, i) => (
            <div key={i} className="couple-card" style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              border: '1px solid rgba(212,175,55,0.25)',
              background: 'var(--color-bg-soft)',
              willChange: 'transform',
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
                {/* Subtle gold shimmer overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 60%)',
                  pointerEvents: 'none',
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
