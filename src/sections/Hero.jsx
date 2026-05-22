import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FloralSVG from '../components/FloralSVG'
import FloatingOrnaments from '../components/FloatingOrnaments'
import SplitTextReveal from '../components/SplitTextReveal'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef  = useRef(null)
  const floralTopRef = useRef(null)
  const floralBotRef = useRef(null)
  const contentRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── World-class cinematic entrance ──
      const tl = gsap.timeline({ delay: 0.3 })

      // 1. Container fade in with scale
      tl.fromTo(sectionRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
      )

      // ── Advanced scroll effects ──
      
      // Video scale with perspective
      gsap.to('.hero-video', {
        scale: 1.25,
        rotationX: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Content parallax with 3D transform
      gsap.to(contentRef.current, {
        y: -120,
        opacity: 0,
        rotationX: 15,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1.5,
        },
      })

      // Multi-layer floral parallax
      gsap.to(floralTopRef.current, {
        y: -120,
        rotation: 10,
        scale: 1.1,
        scrollTrigger: { 
          trigger: sectionRef.current, 
          start: 'top top', 
          end: 'bottom top', 
          scrub: 2 
        },
      })
      
      gsap.to(floralBotRef.current, {
        y: 120,
        rotation: -10,
        scale: 1.1,
        scrollTrigger: { 
          trigger: sectionRef.current, 
          start: 'top top', 
          end: 'bottom top', 
          scrub: 2 
        },
      })

      // Floating animation for ornaments
      gsap.to('.floating-ornament', {
        y: '+=15',
        rotation: '+=5',
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.5
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
        perspective: 1200,
      }}
    >
      {/* Video — compressed untuk mobile, original untuk desktop */}
      <video
        className="hero-video"
        autoPlay muted loop playsInline
        aria-hidden="true"
        poster="/backgrounds/Background.jpg"
        data-parallax="0.3"
        ref={el => {
          if (!el) return
          // Pilih source berdasarkan lebar layar — media attribute tidak support di video
          const isMobile = window.innerWidth <= 768
          el.src = isMobile ? '/hero/Hero-bg2-mobile.mp4' : '/hero/Hero-bg2.mp4'
        }}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.6,
          willChange: 'transform', transformOrigin: 'center center',
        }}
      />

      {/* Fallback background image — tampil jika video gagal load */}
      <div aria-hidden="true" data-parallax="0.2" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/backgrounds/Background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.4,
        zIndex: -1,
      }} />

      {/* Dynamic overlay with gradient animation */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(45deg, rgba(26,18,9,0.8) 0%, rgba(26,18,9,0.4) 50%, rgba(26,18,9,0.9) 100%),
          radial-gradient(circle at 30% 70%, rgba(212,175,55,0.1) 0%, transparent 50%)
        `,
        animation: 'gradientShift 8s ease-in-out infinite',
      }} />

      {/* Floating ornaments with parallax */}
      <div data-parallax="0.4" data-float>
        <FloatingOrnaments triggerRef={sectionRef} />
      </div>

      {/* Floral top with enhanced parallax */}
      <div ref={floralTopRef} aria-hidden="true" data-parallax="0.6" style={{
        position: 'absolute', top: -20, left: '50%',
        transform: 'translateX(-50%)', willChange: 'transform',
      }}>
        <FloralSVG size={160} opacity={0.25} />
      </div>

      {/* Content with magnetic effects */}
      <div ref={contentRef} data-magnetic style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', padding: '0 var(--space-6)',
      }}>
        {/* Eyebrow with SplitTextReveal */}
        <SplitTextReveal 
          type="fade" 
          stagger={0.05}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-light)',
            marginBottom: 'var(--space-5)',
            display: 'block',
          }}
        >
          The Wedding of
        </SplitTextReveal>

        {/* Names with enhanced split text */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.75rem, 12vw, 5.5rem)',
          lineHeight: 1.05,
          color: '#ffffff',
          fontWeight: 400,
          margin: 0,
        }}>
          <SplitTextReveal 
            type="slide" 
            stagger={0.035}
            style={{ display: 'block' }}
          >
            M. Riyan
          </SplitTextReveal>
          
          {/* Ampersand */}
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 6vw, 3rem)',
            color: 'var(--color-gold-light)',
            fontStyle: 'italic',
            lineHeight: 1.2,
            margin: '0.2em 0',
          }}>&amp;</span>
          
          <SplitTextReveal 
            type="slide" 
            stagger={0.03}
            style={{
              display: 'block',
              color: 'var(--color-gold-light)',
              fontStyle: 'italic',
            }}
          >
            Siti Arbayah
          </SplitTextReveal>
        </h1>

        {/* Divider with glow effect */}
        <div style={{
          width: 72, height: 2,
          background: 'var(--color-gold-gradient)',
          margin: 'var(--space-6) auto',
          boxShadow: '0 0 20px rgba(212,175,55,0.5)',
          borderRadius: '1px',
        }} />

        {/* Date with floating animation */}
        <SplitTextReveal 
          type="wave" 
          stagger={0.02}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.9)',
            textTransform: 'uppercase',
            display: 'block',
          }}
        >
          Minggu, 05 Juli 2026
        </SplitTextReveal>
      </div>

      {/* Floral bottom with enhanced parallax */}
      <div ref={floralBotRef} aria-hidden="true" data-parallax="0.8" data-float style={{
        position: 'absolute', bottom: 60, left: '50%',
        transform: 'translateX(-50%)', willChange: 'transform',
      }}>
        <FloralSVG size={100} opacity={0.2} />
      </div>

      {/* Enhanced fade to next section */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 30%, #ffffff 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  )
}
