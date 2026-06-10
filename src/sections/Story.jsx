import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const STORY_ITEMS = [
  { year: '2020', title: 'Pertama Bertemu', desc: 'Sebuah pertemuan tak terduga yang mengubah segalanya.' },
  { year: '2021', title: 'Mulai Dekat', desc: 'Dari teman menjadi sahabat, dari sahabat menjadi lebih.' },
  { year: '2023', title: 'Resmi Berpacaran', desc: 'Hari di mana kami memutuskan untuk berjalan bersama.' },
  { year: '2025', title: 'Lamaran', desc: 'Sebuah janji yang diucapkan dari hati yang paling dalam.' },
  { year: '2026', title: 'Hari Pernikahan', desc: 'Menyempurnakan separuh agama, bersama selamanya.' },
]

export default function Story() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.from('.story-header', {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })

      // Timeline line draw dari atas ke bawah
      gsap.from('.story-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: '.story-line',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      })

      // Setiap item reveal bergantian dari kiri/kanan
      document.querySelectorAll('.story-item').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          x: i % 2 === 0 ? -60 : 60,
          scale: 0.95,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })

      // Dot pulse saat masuk
      document.querySelectorAll('.story-dot').forEach(dot => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: dot, start: 'top 88%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section" id="story">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="story-header" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <p className="section-subtitle" style={{ color: 'var(--color-gold-dark)' }}>Perjalanan Kami</p>
          <h2 className="section-title">Kisah Cinta Kami</h2>
          <div className="gold-divider" />
        </div>

        <div style={{ position: 'relative' }}>
          <div aria-hidden="true" className="story-line" style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(to bottom, transparent, var(--color-gold), transparent)',
            transform: 'translateX(-50%)',
          }} />

          {STORY_ITEMS.map((item, i) => (
            <div key={i} className="story-item" style={{
              display: 'flex',
              flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-8)',
              willChange: 'transform',
            }}>
              <div style={{
                flex: 1,
                textAlign: i % 2 === 0 ? 'right' : 'left',
                padding: 'var(--space-4)',
                background: 'rgba(255,255,255,0.05)', // Dark transparent
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: 'var(--shadow-card)',
                backdropFilter: 'blur(10px)',
              }}>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>{item.year}</p>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: '#fff', marginBottom: 'var(--space-1)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
              <div aria-hidden="true" className="story-dot" style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 0 0 4px rgba(255,255,255,0.1)', flexShrink: 0, zIndex: 1 }} />
              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
