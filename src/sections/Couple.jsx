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
    subtitle: 'Putra ke-3 dari\nBpk. Saiful & Ibu Maimunah',
    imgPos: 'center top',
  },
  {
    id: 'wanita',
    src: '/couple/Mempelai%20Wanita.jpg',
    alt: 'Mempelai Wanita',
    label: 'Mempelai Wanita',
    name: 'Siti Arbayah',
    subtitle: 'Putri ke-2 dari\nBpk. H. Nordin & Ibu Hj. Siti Asyiah',
    imgPos: 'center top',
  },
]

/* ── Gold corner ornament ── */
function GoldCorner({ size = 36, rotate = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none"
      aria-hidden="true"
      style={{ display: 'block', transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 34 L2 2 L34 2" stroke="#d4a843" strokeWidth="1.5"
        fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      <circle cx="2" cy="2" r="2.5" fill="#d4a843" opacity="0.7"/>
      <circle cx="34" cy="2" r="1.5" fill="#d4a843" opacity="0.5"/>
      <circle cx="2" cy="34" r="1.5" fill="#d4a843" opacity="0.5"/>
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

      // Cards — left from left, right from right
      gsap.fromTo('.couple-card-left',
        { opacity: 0, x: -60, rotation: -4 },
        { opacity: 1, x: 0, rotation: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.couple-cards', start: 'top 80%', once: true } }
      )
      gsap.fromTo('.couple-card-right',
        { opacity: 0, x: 60, rotation: 4 },
        { opacity: 1, x: 0, rotation: 0, duration: 1.2, ease: 'power4.out', delay: 0.1,
          scrollTrigger: { trigger: '.couple-cards', start: 'top 80%', once: true } }
      )

      // Info text stagger
      gsap.fromTo('.couple-info',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out', delay: 0.4,
          scrollTrigger: { trigger: '.couple-cards', start: 'top 78%', once: true } }
      )

      // Gold shimmer on cards
      sectionRef.current.querySelectorAll('.card-shimmer').forEach((el, i) => {
        gsap.fromTo(el,
          { x: '-110%' },
          { x: '210%', duration: 1.4, ease: 'power2.inOut',
            delay: 0.8 + i * 0.2,
            scrollTrigger: { trigger: el.closest('.couple-card-wrap'), start: 'top 85%', once: true } }
        )
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleEnter = (e) => {
    const card = e.currentTarget.querySelector('.couple-card-img')
    gsap.to(card, { scale: 1.06, duration: 0.7, ease: 'power2.out' })
    gsap.to(e.currentTarget.querySelector('.card-overlay'), { opacity: 1, duration: 0.4 })
  }
  const handleLeave = (e) => {
    const card = e.currentTarget.querySelector('.couple-card-img')
    gsap.to(card, { scale: 1, duration: 0.6, ease: 'power2.inOut' })
    gsap.to(e.currentTarget.querySelector('.card-overlay'), { opacity: 0, duration: 0.4 })
  }

  return (
    <section ref={sectionRef} className="section" id="couple" style={{ position: 'relative' }}>

      {/* Header */}
      <div className="couple-header" style={{ textAlign: 'center' }}>
        <SplitTextReveal type="fade" className="section-subtitle" style={{ display: 'block' }}>
          Bismillahirrahmanirrahim
        </SplitTextReveal>
        <SplitTextReveal type="slide" className="section-title" style={{ display: 'block' }}>
          Dua Hati, Satu Janji
        </SplitTextReveal>
        <div className="gold-divider" />
        <SplitTextReveal type="blur" stagger={0.018} style={{
          display: 'block', fontSize: '0.95rem',
          color: 'var(--color-text-muted)', lineHeight: 2,
          maxWidth: 460, margin: 'var(--space-4) auto 0',
        }}>
          Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menyaksikan momen sakral kami.
        </SplitTextReveal>
      </div>

      {/* Cards */}
      <div className="couple-cards" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(16px, 4vw, 32px)',
        marginTop: 'var(--space-10)',
        alignItems: 'start',
      }}>
        {COUPLE.map((p, i) => (
          <div key={p.id} className={`couple-card-wrap couple-card-${i === 0 ? 'left' : 'right'}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)' }}
          >
            {/* ── Photo card with gold frame ── */}
            <div
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              style={{
                position: 'relative',
                width: '100%',
                cursor: 'default',
              }}
            >
              {/* Outer gold border frame */}
              <div style={{
                position: 'absolute', inset: -6,
                borderRadius: 'calc(var(--radius-lg) + 6px)',
                border: '1px solid rgba(212,175,55,0.35)',
                pointerEvents: 'none', zIndex: 2,
              }} />

              {/* Inner card */}
              <div style={{
                position: 'relative',
                aspectRatio: '3/4',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.4)',
              }}>
                {/* Photo */}
                <div className="couple-card-img" style={{
                  width: '100%', height: '100%',
                  backgroundImage: `url(${p.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: p.imgPos,
                  willChange: 'transform',
                }} />

                {/* Gold shimmer sweep */}
                <div className="card-shimmer" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(110deg, transparent 38%, rgba(212,175,55,0.2) 50%, transparent 62%)',
                  pointerEvents: 'none', zIndex: 1,
                }} />

                {/* Hover overlay */}
                <div className="card-overlay" style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(26,18,9,0.7) 0%, transparent 55%)',
                  opacity: 0, zIndex: 2, pointerEvents: 'none',
                }} />
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

            {/* ── Info below card ── */}
            <div className="couple-info" style={{ textAlign: 'center', width: '100%' }}>
              {/* Gold line top */}
              <div style={{
                width: 40, height: 1,
                background: 'var(--color-gold-gradient)',
                margin: '0 auto var(--space-3)',
                borderRadius: '1px',
              }} />

              <p style={{
                fontSize: '0.62rem', letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-dark)', fontWeight: 700,
                marginBottom: 'var(--space-2)',
              }}>{p.label}</p>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.15rem, 3vw, 1.5rem)',
                fontWeight: 400, color: 'var(--color-text)',
                marginBottom: 'var(--space-3)',
                lineHeight: 1.2,
              }}>{p.name}</h3>

              {p.subtitle.split('\n').map((line, j) => (
                <p key={j} style={{
                  fontSize: '0.78rem', color: 'var(--color-text-muted)',
                  lineHeight: 1.75, letterSpacing: '0.01em',
                }}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
