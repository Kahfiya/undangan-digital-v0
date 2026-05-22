import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function EntranceAnimation({ onComplete }) {
  const wrapRef    = useRef(null)
  const videoRef   = useRef(null)
  const lineTopRef = useRef(null)
  const lineBotRef = useRef(null)
  const eyebrowRef = useRef(null)
  const name1Ref   = useRef(null)
  const name2Ref   = useRef(null)
  const dateRef    = useRef(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})

    const draw = (el, dur = 0.6) => {
      if (!el) return
      const len = el.getTotalLength?.() ?? 120
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      return gsap.to(el, { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut' })
    }

    gsap.set([eyebrowRef.current, name1Ref.current, name2Ref.current, dateRef.current], {
      opacity: 0, y: 20,
    })

    const tl = gsap.timeline({ onComplete })

    tl.delay(0.2)
    tl.add(draw(lineTopRef.current, 0.7))
    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
    tl.to(name1Ref.current,   { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.2')
    tl.to(name2Ref.current,   { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
    tl.add(draw(lineBotRef.current, 0.6), '-=0.3')
    tl.to(dateRef.current,    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    // Hold
    tl.to({}, { duration: 3 })
    // Fade out
    tl.to(wrapRef.current, { opacity: 0, duration: 0.9, ease: 'power2.inOut' })

    return () => tl.kill()
  }, [onComplete])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 9998, overflow: 'hidden' }}
    >
      <video
        ref={el => {
          if (!el) return
          videoRef.current = el
          el.src = window.innerWidth <= 768 ? '/hero/Hero-bg.mp4' : '/hero/Hero-bg2.mp4'
        }}
        muted playsInline loop
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(26,18,9,0.68) 0%, rgba(26,18,9,0.4) 50%, rgba(26,18,9,0.72) 100%)',
      }} />

      {/* SVG text + lines overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <svg
          viewBox="0 0 360 220"
          style={{ width: '90%', maxWidth: 480, height: 'auto', overflow: 'visible' }}
        >
          {/* Top line */}
          <line ref={lineTopRef}
            x1="100" y1="28" x2="260" y2="28"
            stroke="#f5c842" strokeWidth="0.8" opacity="0.7"
          />

          <text ref={eyebrowRef}
            x="180" y="52"
            textAnchor="middle"
            fontFamily="'Montserrat', sans-serif"
            fontSize="8" letterSpacing="4"
            fill="rgba(212,175,55,0.75)"
          >
            THE WEDDING OF
          </text>

          <text ref={name1Ref}
            x="180" y="110"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="44" fontWeight="400"
            fill="#ffffff"
          >
            M. Riyan
          </text>

          <text ref={name2Ref}
            x="180" y="158"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="38" fontWeight="400" fontStyle="italic"
            fill="#fad96a"
          >
            &amp; Siti Arbayah
          </text>

          {/* Bottom line */}
          <line ref={lineBotRef}
            x1="100" y1="178" x2="260" y2="178"
            stroke="#f5c842" strokeWidth="0.8" opacity="0.7"
          />

          <text ref={dateRef}
            x="180" y="200"
            textAnchor="middle"
            fontFamily="'Montserrat', sans-serif"
            fontSize="8" letterSpacing="3"
            fill="rgba(255,255,255,0.45)"
          >
            MINGGU · 05 JULI 2026
          </text>
        </svg>
      </div>
    </div>
  )
}
