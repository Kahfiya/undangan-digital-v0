import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PHOTOS = [
  '/gallery/Albums1.jpg',
  '/gallery/Albums2.jpg',
  '/gallery/Albums3.jpg',
  '/gallery/Albums4.jpg',
  '/gallery/Albums5.jpg',
  '/gallery/Albums6.jpg',
]

export default function Gallery() {
  const sectionRef = useRef(null)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-header', {
        opacity: 0, y: 24, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      })
      gsap.from('.gallery-item', {
        opacity: 0,
        scale: 0.9,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.gallery-item', start: 'top 90%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Close lightbox on backdrop click
  const closeLightbox = () => setLightbox(null)

  return (
    <section ref={sectionRef} className="section" id="gallery">
      <div className="gallery-header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <p className="section-subtitle">Momen Indah</p>
        <h2 className="section-title">Album Foto</h2>
        <div className="gold-divider" />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-3)',
      }}>
        {PHOTOS.map((src, i) => (
          <button
            key={i}
            className="gallery-item"
            onClick={() => setLightbox(src)}
            aria-label={`Lihat foto ${i + 1}`}
            style={{
              padding: 0,
              border: 'none',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              cursor: 'pointer',
              aspectRatio: '1',
              background: '#222222',
              WebkitTapHighlightColor: 'transparent',
              transition: 'transform var(--transition-fast)',
            }}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={src}
              alt={`Foto galeri ${i + 1}`}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.parentElement.style.opacity = '0.3' }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto diperbesar"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-6)',
          }}
        >
          <button
            onClick={closeLightbox}
            aria-label="Tutup foto"
            style={{
              position: 'absolute',
              top: 'var(--space-5)',
              right: 'var(--space-5)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <img
            src={lightbox}
            alt="Foto diperbesar"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '85vh',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}
    </section>
  )
}
