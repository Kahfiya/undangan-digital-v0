import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Lotus bud
const Lotus = ({ size = 40, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" style={style}>
    <ellipse cx="20" cy="24" rx="5" ry="12" fill="var(--color-gold)" opacity="0.5" transform="rotate(-20 20 24)" />
    <ellipse cx="20" cy="24" rx="5" ry="14" fill="var(--color-gold)" opacity="0.55" />
    <ellipse cx="20" cy="24" rx="5" ry="12" fill="var(--color-gold)" opacity="0.5" transform="rotate(20 20 24)" />
    <ellipse cx="20" cy="30" rx="8" ry="4" fill="var(--color-gold)" opacity="0.3" />
    <line x1="20" y1="34" x2="20" y2="40" stroke="var(--color-gold)" strokeWidth="1" opacity="0.4" />
  </svg>
)

// Curved branch with dots
const Branch = ({ size = 48, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={style}>
    <path d="M4 44 Q16 20 36 8" stroke="var(--color-gold)" strokeWidth="1.2" opacity="0.45" fill="none" strokeLinecap="round" />
    <circle cx="36" cy="8" r="3" fill="var(--color-gold)" opacity="0.5" />
    <circle cx="24" cy="24" r="2" fill="var(--color-gold)" opacity="0.4" />
    <circle cx="14" cy="36" r="1.5" fill="var(--color-gold)" opacity="0.35" />
  </svg>
)

// Diamond sparkle
const Sparkle = ({ size = 24, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={style}>
    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" fill="var(--color-gold)" opacity="0.55" />
  </svg>
)

// Crescent moon petal
const Crescent = ({ size = 36, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true" style={style}>
    <path d="M18 4 C28 4 32 12 30 22 C26 18 20 16 14 18 C10 12 10 4 18 4Z" fill="var(--color-gold)" opacity="0.4" />
  </svg>
)

const ORNAMENTS = [
  { C: Lotus,    size: 44, top: '6%',  left: '4%',  py: -70,  amp: 10, delay: 0 },
  { C: Branch,   size: 52, top: '12%', left: '86%', py: -55,  amp: 14, delay: 0.5 },
  { C: Sparkle,  size: 22, top: '28%', left: '91%', py: -90,  amp: 8,  delay: 0.9 },
  { C: Crescent, size: 38, top: '48%', left: '3%',  py: -65,  amp: 12, delay: 0.2 },
  { C: Lotus,    size: 34, top: '62%', left: '88%', py: -80,  amp: 16, delay: 0.7 },
  { C: Sparkle,  size: 18, top: '72%', left: '7%',  py: -45,  amp: 7,  delay: 1.1 },
  { C: Branch,   size: 44, top: '82%', left: '83%', py: -60,  amp: 11, delay: 0.3 },
  { C: Crescent, size: 28, top: '20%', left: '50%', py: -100, amp: 6,  delay: 0.6 },
]

export default function FloatingOrnaments({ triggerRef }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current.querySelectorAll('.ornament-inner')
      items.forEach((el, i) => {
        const { py, amp, delay } = ORNAMENTS[i] || {}

        // Scroll parallax on wrapper
        const wrapper = el.parentElement
        gsap.to(wrapper, {
          y: py,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef?.current || document.body,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        })

        // Sine float on inner — separate property, no conflict
        gsap.to(el, {
          y: amp,
          duration: 2.5 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay,
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [triggerRef])

  return (
    <div ref={containerRef} aria-hidden="true" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
    }}>
      {ORNAMENTS.map(({ C, size, top, left }, i) => (
        <div key={i} className="ornament" style={{ position: 'absolute', top, left, willChange: 'transform' }}>
          <div className="ornament-inner" style={{ willChange: 'transform' }}>
            <C size={size} />
          </div>
        </div>
      ))}
    </div>
  )
}
