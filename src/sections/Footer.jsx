import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FloralSVG from '../components/FloralSVG'

// Tanggal pernikahan: Minggu, 05 Juli 2026
const WEDDING_DATE = new Date('2026-07-05T08:00:00')

// ⚙️ GANTI dengan nomor WhatsApp dan pesan share
const WA_SHARE_NUMBER = '6285931457921'

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const calc = () => {
      const diff = targetDate - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

export default function Footer() {
  const sectionRef = useRef(null)
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer items masuk dengan stagger dramatis + blur
      gsap.fromTo('.footer-inner > *',
        { opacity: 0, y: 50, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        }
      )

      // Countdown numbers: scale bounce in
      gsap.fromTo('.countdown-unit',
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: '.countdown-wrap', start: 'top 88%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const [showModal, setShowModal] = useState(false)

  const handleShare = () => {
    const base = `${window.location.origin}${window.location.pathname}`
    const msg = `Assalamu'alaikum! Kami mengundang Anda ke pernikahan M. Riyan & Siti Arbayah pada Minggu, 05 Juli 2026. Lihat undangan digital kami di: ${base}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const countUnit = (val, label) => (
    <div className="countdown-unit" style={{ textAlign: 'center', minWidth: 56 }}>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 8vw, 2.5rem)', color: 'var(--color-gold)', lineHeight: 1 }}>
        {String(val ?? 0).padStart(2, '0')}
      </p>
      <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
        {label}
      </p>
    </div>
  )

  return (
    <footer ref={sectionRef} className="section" id="footer" style={{ textAlign: 'center' }}>
      <div className="footer-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
        <FloralSVG size={80} opacity={0.3} />

        <div>
          <p className="section-subtitle" style={{ color: 'var(--color-gold-dark)' }}>Menuju Hari Bahagia</p>
          <h2 className="section-title">Hitung Mundur</h2>
          <div className="gold-divider" />
        </div>

        {/* Countdown */}
        <div className="countdown-wrap" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {countUnit(days, 'Hari')}
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-gold)', marginBottom: 12 }}>:</span>
          {countUnit(hours, 'Jam')}
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-gold)', marginBottom: 12 }}>:</span>
          {countUnit(minutes, 'Menit')}
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-gold)', marginBottom: 12 }}>:</span>
          {countUnit(seconds, 'Detik')}
        </div>

        <div style={{ padding: 'var(--space-6)', background: 'var(--color-bg-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(212,175,55,0.15)', boxShadow: '0 10px 30px rgba(212,175,55,0.05)' }}>
          {/* Teks Arab */}
          <p style={{
            fontFamily: "'Amiri', 'Traditional Arabic', serif",
            fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
            lineHeight: 2,
            color: 'var(--color-gold-dark)',
            textAlign: 'center',
            direction: 'rtl',
            marginBottom: 'var(--space-4)',
          }}>
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
          </p>
          <div style={{ width: 40, height: 1, background: 'var(--color-gold)', opacity: 0.4, margin: '0 auto var(--space-4)' }} />
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-gold)', marginTop: 'var(--space-3)', letterSpacing: '0.1em' }}>
            — QS. Ar-Rum: 21
          </p>
        </div>

        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>
            M. Riyan & Siti Arbayah
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Minggu, 05 Juli 2026
          </p>
        </div>

        <button onClick={handleShare} className="btn-gold" aria-label="Bagikan undangan via WhatsApp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.17-1.4l-.37-.22-3.76.98.998-3.648-.242-.376A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="currentColor"/>
          </svg>
          Bagikan Undangan
        </button>

        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', paddingBottom: 'var(--space-4)' }}>
          Dibuat dengan ♥ · M. Riyan & Siti Arbayah 2026
        </p>
      </div>

    </footer>
  )
}
