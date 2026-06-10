import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitTextReveal from '../components/SplitTextReveal'

gsap.registerPlugin(ScrollTrigger)

const COUPLE = [
  {
    id: 'pria',
    src: '/couple/Mempelai%20Pria.jpg',
    alt: 'Mempelai Pria',
    label: 'Mempelai Pria',
    name: 'M. Riyan',
    subtitle: 'Putra dan anak ke tiga dari pasangan bpk SAIFUL dan ibu MAIMUNAH',
    instagram: '',
    imgPos: 'center top',
  },
  {
    id: 'wanita',
    src: '/couple/Mempelai%20Wanita.jpg',
    alt: 'Mempelai Wanita',
    label: 'Mempelai Wanita',
    name: 'Siti Arbayah',
    subtitle: 'Putri dan anak ke dua dari pasangan bpk H NORDIN dan ibu HJ SITI ASYIAH',
    instagram: '',
    imgPos: 'center top',
  },
]

function GoldCorner({ size = 36, rotate = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none"
      aria-hidden="true"
      style={{ display: 'block', transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 34 L2 2 L34 2" stroke="var(--color-gold)" strokeWidth="1.5"
        fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      <circle cx="2" cy="2" r="2.5" fill="var(--color-gold)" opacity="0.7"/>
      <circle cx="34" cy="2" r="1.5" fill="var(--color-gold)" opacity="0.5"/>
      <circle cx="2" cy="34" r="1.5" fill="var(--color-gold)" opacity="0.5"/>
    </svg>
  )
}

export default function Couple() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo('.couple-header > *',
        { opacity: 0, y: 40, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.15, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.couple-header', start: 'top 82%', once: true } }
      )

      // Section animations per mempelai card
      COUPLE.forEach((p) => {
        const trigger = `.mempelai-${p.id}`
        
        // Image slide zoom reveal
        gsap.fromTo(`${trigger} .mempelai-img-wrap`,
          { opacity: 0, scale: 0.9, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power4.out',
            scrollTrigger: { trigger: trigger, start: 'top 75%', once: true } }
        )

        // Text content slides in left/right
        gsap.fromTo(`${trigger} .mempelai-info-wrap > *`,
          { opacity: 0, x: p.id === 'pria' ? -40 : 40 },
          { opacity: 1, x: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: trigger, start: 'top 70%', once: true } }
        )
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} id="couple" style={{ position: 'relative' }}>
      {/* Intro Header */}
      <div className="couple-header" style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-6) var(--space-8)' }}>
        <SplitTextReveal type="fade" className="section-subtitle" style={{ display: 'block' }}>
          Bismillahirrahmanirrahim
        </SplitTextReveal>
        <SplitTextReveal type="slide" className="section-title" style={{ display: 'block' }}>
          Dua Hati, Satu Janji
        </SplitTextReveal>
        <div className="blue-divider" />
        <SplitTextReveal type="blur" stagger={0.018} style={{
          display: 'block', fontSize: '0.95rem',
          color: 'var(--color-text-muted)', lineHeight: 2,
          maxWidth: 460, margin: 'var(--space-4) auto 0',
        }}>
          Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menyaksikan momen sakral pernikahan kami.
        </SplitTextReveal>
      </div>

      {/* Mempelai Sections (Full-screen 100vh per mempelai) */}
      {COUPLE.map((p) => (
        <section
          key={p.id}
          className={`mempelai-${p.id}`}
          style={{
            position: 'relative',
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--space-8) var(--space-6) calc(var(--space-8) + var(--nav-height))',
            overflow: 'hidden',
          }}
        >
          {/* Subtle floral background layer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(30,95,168,0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-6)',
            width: '100%',
            maxWidth: 400,
            zIndex: 2,
          }}>
            {/* Image frame */}
            <div className="mempelai-img-wrap" style={{ position: 'relative', width: '80%', aspectRatio: '3/4' }}>
              {/* Outer gold border frame */}
              <div style={{
                position: 'absolute', inset: -6,
                borderRadius: 'calc(var(--radius-lg) + 6px)',
                border: '1px solid rgba(212,175,55,0.35)',
                pointerEvents: 'none', zIndex: 2,
              }} />

              {/* Inner card container */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(13,31,60,0.15), 0 4px 16px rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.4)',
              }}>
                <img
                  src={p.src}
                  alt={p.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: p.imgPos,
                  }}
                />
              </div>

              {/* Gold corner ornaments */}
              <div style={{ position: 'absolute', top: -2, left: -2, zIndex: 3 }}>
                <GoldCorner size={28} rotate={0} />
              </div>
              <div style={{ position: 'absolute', top: -2, right: -2, zIndex: 3 }}>
                <GoldCorner size={28} rotate={90} />
              </div>
              <div style={{ position: 'absolute', bottom: -2, left: -2, zIndex: 3 }}>
                <GoldCorner size={28} rotate={270} />
              </div>
              <div style={{ position: 'absolute', bottom: -2, right: -2, zIndex: 3 }}>
                <GoldCorner size={28} rotate={180} />
              </div>
            </div>

            {/* Info details */}
            <div className="mempelai-info-wrap" style={{ textAlign: 'center', width: '100%' }}>
              <div style={{
                width: 40, height: 1,
                background: 'var(--color-gold-gradient)',
                margin: '0 auto var(--space-3)',
                borderRadius: '1px',
              }} />

              <p style={{
                fontSize: '0.65rem', letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-blue)', fontWeight: 700,
                marginBottom: 'var(--space-2)',
              }}>{p.label}</p>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                fontWeight: 400, color: 'var(--color-text)',
                marginBottom: 'var(--space-3)',
                lineHeight: 1.2,
              }}>{p.name}</h3>

              <p style={{
                fontSize: '0.8rem', color: 'var(--color-text-muted)',
                lineHeight: 1.75, letterSpacing: '0.01em',
                marginBottom: 'var(--space-4)',
                padding: '0 var(--space-4)'
              }}>{p.subtitle}</p>

              {/* Instagram Button */}
              {p.instagram && (
                <a
                  href={`https://instagram.com/${p.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    minHeight: 38,
                    padding: '0 var(--space-4)',
                    fontSize: '0.75rem',
                    border: '1px solid rgba(30, 95, 168, 0.35)',
                    color: 'var(--color-blue)',
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
