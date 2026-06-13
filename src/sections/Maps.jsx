import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Link langsung dari client
const MAPS_LINK = 'https://maps.app.goo.gl/3ub4iXxdjLLGzAaJA'

// Embed URL — dibuat dari short link client (arahkan ke lokasi resepsi)
// Jika ingin embed tepat, client bisa ganti dengan embed URL dari Google Maps → Share → Embed
const MAPS_EMBED_URL = 'https://maps.google.com/maps?q=Komplek+Nusantara+Griya+Permai+Jl+Kuranji+Banjarbaru&output=embed'

export default function Maps() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.maps-header', {
        opacity: 0, y: 50, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
      })
      gsap.from('.maps-inner', {
        opacity: 0, y: 60, scale: 0.97, duration: 1, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const iconStar = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="var(--color-gold)"/>
    </svg>
  )

  const iconHome = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="9 22 9 12 15 12 15 22" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const iconStyle = {
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }

  return (
    <section ref={sectionRef} className="section" id="maps" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="maps-header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <p className="section-subtitle" style={{ color: 'var(--color-gold-dark)' }}>Lokasi Acara</p>
        <h2 className="section-title">Venue</h2>
        <div className="gold-divider" />
      </div>

      <div className="maps-inner" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{
          padding: 'var(--space-6)',
          background: 'var(--color-bg-soft)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}>
          {/* Akad Nikah */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={iconStyle}>{iconStar}</div>
              <div>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600 }}>Akad Nikah</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-text)' }}>Kamis, 02 Juli 2026</p>
              </div>
            </div>
          </div>

          <div style={{ 
            height: '1px', 
            background: 'rgba(212, 175, 55, 0.2)', 
            margin: 'var(--space-5) 0 var(--space-5) 48px' 
          }} />

          {/* Resepsi */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div style={iconStyle}>{iconHome}</div>
              <div>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)', fontWeight: 600 }}>Resepsi</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-text)' }}>Minggu, 05 Juli 2026</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 500, paddingLeft: 48, marginTop: 'var(--space-1)' }}>
              Komplek Nusantara Griya Permai Blok E
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', paddingLeft: 48, lineHeight: 1.6 }}>
              Jl. Kuranji, Rt/Rw 049/005<br />
              Kel. Guntung Manggis, Kec. Landasan Ulin Timur<br />
              Kota Banjarbaru
            </p>
          </div>
        </div>

        {/* Google Maps embed */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <iframe
            title="Lokasi venue pernikahan M. Riyan & Siti Arbayah"
            src={MAPS_EMBED_URL}
            width="100%"
            height="220"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          aria-label="Buka lokasi di Google Maps"
          style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
          Buka di Google Maps
        </a>
      </div>
      </div>
    </section>
  )
}
