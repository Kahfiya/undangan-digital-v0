import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FloralSVG from '../components/FloralSVG'
import FloatingOrnaments from '../components/FloatingOrnaments'

gsap.registerPlugin(ScrollTrigger)

// Split text into individual char spans
function splitChars(text, style = {}) {
  return text.split('').map((ch, i) => (
    <span key={i} className="char" style={{ display: 'inline-block', ...style }}>
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  ))
}

export default function Hero() {
  const sectionRef  = useRef(null)
  const floralTopRef = useRef(null)
  const floralBotRef = useRef(null)
  const contentRef  = useRef(null)
  const eyebrowRef  = useRef(null)
  const name1Ref    = useRef(null)
  const name2Ref    = useRef(null)
  const dividerRef  = useRef(null)
  const dateRef     = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Cinematic entrance ──
      const tl = gsap.timeline({ delay: 0.2 })

      // 1. Eyebrow letter-by-letter
      tl.from(eyebrowRef.current.querySelectorAll('.char'), {
        opacity: 0,
        y: 20,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
      })

      // 2. Name 1 — clip-path reveal from bottom
      tl.fromTo(name1Ref.current.querySelectorAll('.char'),
        { opacity: 0, y: 60, rotationX: -40, transformOrigin: 'bottom center' },
        { opacity: 1, y: 0, rotationX: 0, stagger: 0.035, duration: 0.8, ease: 'power4.out' },
        '-=0.2'
      )

      // 3. Name 2 — same but gold
      tl.fromTo(name2Ref.current.querySelectorAll('.char'),
        { opacity: 0, y: 60, rotationX: -40, transformOrigin: 'bottom center' },
        { opacity: 1, y: 0, rotationX: 0, stagger: 0.03, duration: 0.8, ease: 'power4.out' },
        '-=0.5'
      )

      // 4. Divider draw-in
      tl.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power2.inOut', transformOrigin: 'center' },
        '-=0.3'
      )

      // 5. Date fade up
      tl.from(dateRef.current, {
        opacity: 0, y: 16, duration: 0.6, ease: 'power2.out',
      }, '-=0.3')

      // ── Scroll: video scale ──
      gsap.to('.hero-video', {
        scale: 1.18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // ── Scroll: content parallax up + fade ──
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '45% top',
          scrub: 1,
        },
      })

      // ── Floral parallax ──
      gsap.to(floralTopRef.current, {
        y: -90,
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      })
      gsap.to(floralBotRef.current, {
        y: 90,
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--color-bg-dark)',
        perspective: 800,
      }}
    >
      {/* Video — compressed untuk mobile, original untuk desktop */}
      <video
        className="hero-video"
        autoPlay muted loop playsInline
        aria-hidden="true"
        poster="/backgrounds/Background.jpg"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.5,
          willChange: 'transform', transformOrigin: 'center center',
        }}
      >
        {/* Mobile: versi kecil ~500KB */}
        <source media="(max-width: 768px)" src="/hero/Hero-bg2-mobile.mp4" type="video/mp4" />
        {/* Desktop: versi original */}
        <source src="/hero/Hero-bg2.mp4" type="video/mp4" />
      </video>

      {/* Fallback background image — tampil jika video gagal load */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/backgrounds/Background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.4,
        zIndex: -1,
      }} />

      {/* Overlay */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(26,18,9,0.75) 0%, rgba(26,18,9,0.45) 50%, rgba(26,18,9,0.85) 100%)',
      }} />

      {/* Floating ornaments */}
      <FloatingOrnaments triggerRef={sectionRef} />

      {/* Floral top */}
      <div ref={floralTopRef} aria-hidden="true" style={{
        position: 'absolute', top: -20, left: '50%',
        transform: 'translateX(-50%)', willChange: 'transform',
      }}>
        <FloralSVG size={160} opacity={0.2} />
      </div>

      {/* Content */}
      <div ref={contentRef} style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', padding: '0 var(--space-6)',
      }}>
        {/* Eyebrow */}
        <p ref={eyebrowRef} style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--color-gold-light)',
          marginBottom: 'var(--space-5)',
        }}>
          {splitChars('The Wedding of')}
        </p>

        {/* Name 1 */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.75rem, 12vw, 5.5rem)',
          lineHeight: 1.05,
          color: '#ffffff',
          fontWeight: 400,
          margin: 0,
        }}>
          <span ref={name1Ref} style={{ display: 'block' }}>
            {splitChars('M. Riyan')}
          </span>
          {/* Name 2 */}
          <em ref={name2Ref} style={{
            display: 'block',
            color: 'var(--color-gold-light)',
            fontStyle: 'italic',
          }}>
            {splitChars('& Siti Arbayah')}
          </em>
        </h1>

        {/* Divider */}
        <div ref={dividerRef} style={{
          width: 72, height: 1,
          background: 'var(--color-gold-gradient)',
          margin: 'var(--space-6) auto',
        }} />

        {/* Date */}
        <p ref={dateRef} style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.8)',
          textTransform: 'uppercase',
        }}>
          Minggu, 05 Juli 2026
        </p>
      </div>

      {/* Floral bottom */}
      <div ref={floralBotRef} aria-hidden="true" style={{
        position: 'absolute', bottom: 60, left: '50%',
        transform: 'translateX(-50%)', willChange: 'transform',
      }}>
        <FloralSVG size={100} opacity={0.18} />
      </div>

      {/* Fade to next section */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 140,
        background: 'linear-gradient(to bottom, transparent, #ffffff)',
        zIndex: 2, pointerEvents: 'none',
      }} />
    </section>
  )
}
