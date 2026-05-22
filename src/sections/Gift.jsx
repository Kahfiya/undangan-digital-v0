import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ⚙️ Data rekening
const ACCOUNTS = [
  { bank: 'BNI', number: '1709052174', name: 'An M Riyan', logo: 'BNI' },
]

export default function Gift() {
  const sectionRef = useRef(null)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gift-card', {
        opacity: 0, y: 32, stagger: 0.15, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleCopy = (number, bank) => {
    navigator.clipboard.writeText(number).then(() => {
      setCopied(bank)
      setTimeout(() => setCopied(null), 2500)
    })
  }

  return (
    <section ref={sectionRef} className="section" id="gift" style={{ position: 'relative', overflow: 'hidden', paddingBottom: 'var(--space-12)' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <p className="section-subtitle">Hadiah Pernikahan</p>
          <h2 className="section-title">Amplop Digital</h2>
          <div className="gold-divider" />
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)', lineHeight: 1.7 }}>
            Doa restu Anda adalah hadiah terbaik bagi kami. Namun jika ingin memberikan tanda kasih, Anda dapat mengirimkan melalui:
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {ACCOUNTS.map((acc) => (
            <div
              key={acc.bank}
              className="gift-card"
              style={{
                padding: 'var(--space-5) var(--space-6)',
                background: 'var(--color-bg-soft)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(212,175,55,0.2)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {/* BNI Logo */}
                  <div style={{
                    width: 52, height: 32,
                    background: '#f15a22',
                    borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(241,90,34,0.3)',
                    flexShrink: 0,
                  }}>
                    <svg viewBox="0 0 52 20" width="44" height="16" aria-label="Logo BNI">
                      <text x="4" y="15"
                        fontFamily="Arial Black, sans-serif"
                        fontWeight="900"
                        fontSize="14"
                        fill="#ffffff"
                        letterSpacing="1"
                      >BNI</text>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', lineHeight: 1 }}>
                      Bank
                    </p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>
                      Bank Negara Indonesia
                    </p>
                  </div>
                </div>
                {/* Card chip icon */}
                <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="26" height="20" rx="3" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(212,175,55,0.06)"/>
                  <rect x="8" y="6" width="12" height="10" rx="1.5" stroke="var(--color-gold)" strokeWidth="1" fill="rgba(212,175,55,0.1)"/>
                  <line x1="14" y1="6" x2="14" y2="16" stroke="var(--color-gold)" strokeWidth="0.8"/>
                  <line x1="8" y1="11" x2="20" y2="11" stroke="var(--color-gold)" strokeWidth="0.8"/>
                </svg>
              </div>

              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
                {acc.number}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                a.n. {acc.name}
              </p>
              <button
                onClick={() => handleCopy(acc.number, acc.bank)}
                aria-label={`Salin nomor rekening ${acc.bank}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  minHeight: 44,
                  padding: '0 var(--space-5)',
                  borderRadius: 'var(--radius-full)',
                  border: copied === acc.bank ? 'none' : '1px solid var(--color-gold)',
                  background: copied === acc.bank ? 'var(--color-gold-gradient)' : 'transparent',
                  color: copied === acc.bank ? 'var(--color-bg-dark)' : 'var(--color-gold)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  transition: 'all var(--transition-smooth)',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {copied === acc.bank ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Tersalin!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    Salin Nomor
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Pesan bawah */}
        <div style={{
          marginTop: 'var(--space-8)',
          padding: 'var(--space-6)',
          background: 'rgba(212,175,55,0.06)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(212,175,55,0.15)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'var(--color-text-muted)',
            lineHeight: 1.8,
          }}>
            "Kehadiran dan doa restu Anda adalah hadiah terindah yang tidak ternilai bagi kami."
          </p>
          <div style={{ width: 32, height: 1, background: 'var(--color-gold)', margin: 'var(--space-4) auto 0', opacity: 0.5 }} />
          <p style={{ fontSize: '0.7rem', color: 'var(--color-gold)', marginTop: 'var(--space-3)', letterSpacing: '0.1em' }}>
            M. Riyan & Siti Arbayah
          </p>
        </div>
      </div>
    </section>
  )
}
