import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const COUPLE = [
  {
    id: 'pria',
    src: '/couple/Mempelai%20Pria.jpg',
    alt: 'Mempelai Pria',
    label: 'The Groom',
    name: 'M. Riyan',
    subtitle: 'Putra dari pasangan bpk SAIFUL dan ibu MAIMUNAH',
    instagram: '',
    imgPos: 'center 20%',
  },
  {
    id: 'wanita',
    src: '/couple/Mempelai%20Wanita.jpg',
    alt: 'Mempelai Wanita',
    label: 'The Bride',
    name: 'Siti Arbayah',
    subtitle: 'Putri dari pasangan bpk H NORDIN dan ibu HJ SITI ASYIAH',
    instagram: '',
    imgPos: 'center 20%',
  },
]

export default function Couple() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal elements per section
      COUPLE.forEach((p) => {
        const trigger = `.mempelai-sec-${p.id}`
        gsap.fromTo(`${trigger} .couple-content > *`,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, y: 0, 
            stagger: 0.2, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: trigger,
              start: 'top 60%',
            }
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} id="couple">
      {COUPLE.map((p) => (
        <section
          key={p.id}
          className={`mempelai-sec-${p.id}`}
          style={{
            position: 'relative',
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            background: '#000'
          }}
        >
          {/* Full Screen Image Background - Tanpa Figura */}
          <img
            src={p.src}
            alt={p.alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: p.imgPos,
              filter: 'brightness(0.85) contrast(1.05)'
            }}
          />

          {/* Subtle Dark/Gold Gradient Overlay for text readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Content Overlay */}
          <div className="couple-content" style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 2.5rem',
            color: '#FFFFFF',
            zIndex: 2
          }}>
            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: '1.2rem',
              fontWeight: 500,
              marginBottom: '0.5rem'
            }}>
              {p.label}
            </p>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 10vw, 3.8rem)',
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              maxWidth: '80%'
            }}>
              {p.name}
            </h2>

            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '300px',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              {p.subtitle}
            </p>

            {/* Instagram Button - Glass Style */}
            {p.instagram && (
              <a
                href={`https://instagram.com/${p.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.8rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  width: 'fit-content',
                  fontSize: '1rem',
                  fontWeight: 400,
                  fontFamily: "'Lora', serif"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                @{p.instagram}
              </a>
            )}

            {/* Bottom Horizontal Line - Identical to Target */}
            <div style={{
              position: 'absolute',
              bottom: '10%',
              left: '2.5rem',
              right: '2.5rem',
              height: '1px',
              background: 'rgba(255,255,255,0.6)'
            }} />
          </div>
        </section>
      ))}
    </div>
  )
}
