import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ⚙️ GANTI dengan nomor WhatsApp yang benar (format: 628xxx)
const WA_NUMBER = '6285931457921'

export default function RSVP() {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', guests: '1', attend: 'hadir' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.rsvp-inner', {
        opacity: 0, y: 32, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = form.attend === 'hadir'
      ? `Assalamu'alaikum, saya *${form.name}* akan hadir di pernikahan M. Riyan & Siti Arbayah bersama *${form.guests} orang*. Terima kasih atas undangannya! 🎊`
      : `Assalamu'alaikum, saya *${form.name}* mohon maaf tidak dapat hadir di pernikahan M. Riyan & Siti Arbayah. Semoga menjadi pernikahan yang berkah! 🤲`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const inputStyle = {
    width: '100%',
    minHeight: 48,
    padding: 'var(--space-3) var(--space-4)',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-bg-soft)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--color-text)',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  }

  return (
    <section ref={sectionRef} className="section" id="rsvp" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <p className="section-subtitle">Konfirmasi Kehadiran</p>
        <h2 className="section-title">RSVP</h2>
        <div className="gold-divider" />
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)', lineHeight: 1.7 }}>
          Mohon konfirmasi kehadiran Anda paling lambat <strong>28 Juni 2026</strong>
        </p>
      </div>

      <form className="rsvp-inner" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label htmlFor="rsvp-name" style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
            Nama Lengkap
          </label>
          <input
            id="rsvp-name"
            type="text"
            required
            placeholder="Masukkan nama Anda"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.3)'}
          />
        </div>

        <div>
          <label htmlFor="rsvp-attend" style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
            Konfirmasi
          </label>
          <select
            id="rsvp-attend"
            value={form.attend}
            onChange={e => setForm(f => ({ ...f, attend: e.target.value }))}
            style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23d4af37' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
          >
            <option value="hadir">Insya Allah Hadir</option>
            <option value="tidak">Mohon Maaf, Tidak Hadir</option>
          </select>
        </div>

        {form.attend === 'hadir' && (
          <div>
            <label htmlFor="rsvp-guests" style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
              Jumlah Tamu
            </label>
            <select
              id="rsvp-guests"
              value={form.guests}
              onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
              style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23d4af37' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
            >
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} orang</option>)}
            </select>
          </div>
        )}

        <button type="submit" className="btn-gold" style={{ marginTop: 'var(--space-2)', width: '100%' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.17-1.4l-.37-.22-3.76.98.998-3.648-.242-.376A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="currentColor"/>
          </svg>
          Kirim via WhatsApp
        </button>
      </form>
      </div>
    </section>
  )
}
