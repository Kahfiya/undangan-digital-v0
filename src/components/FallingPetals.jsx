import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const COLORS = ['#FFFFFF', '#FDFCF0', '#F1E5AC', '#D4AF37', '#F9F4E3']

// Petal shapes — variety untuk visual interest
const SHAPES = [
  // Teardrop
  (op, color) => `<path d="M9 0 C14 5, 18 11, 9 22 C0 11, 4 5, 9 0Z" fill="${color}" opacity="${op}"/>
            <path d="M9 3 C9 3 9 16 9 20" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>`,
  // Round petal
  (op, color) => `<ellipse cx="9" cy="11" rx="7" ry="10" fill="${color}" opacity="${op}"/>`,
  // Thin petal
  (op, color) => `<path d="M9 0 C11 6, 12 14, 9 22 C6 14, 7 6, 9 0Z" fill="${color}" opacity="${op}"/>`,
]

const PETAL_COUNT = 22

export default function FallingPetals() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const petals = container.querySelectorAll('.petal')
    const vw = () => window.innerWidth
    const vh = () => window.innerHeight

    petals.forEach((petal, i) => {
      const startX = Math.random() * vw()
      const duration = 7 + Math.random() * 8
      const delay = Math.random() * 12
      const swayX = 50 + Math.random() * 80
      const swayDir = Math.random() > 0.5 ? 1 : -1
      const size = 0.5 + Math.random() * 0.9
      const initRot = Math.random() * 360
      const rotAmt = 200 + Math.random() * 300

      gsap.set(petal, {
        x: startX,
        y: -40,
        scale: size,
        rotation: initRot,
        opacity: 0,
      })

      const tl = gsap.timeline({ repeat: -1, delay })

      tl.to(petal, { opacity: 0.55 + Math.random() * 0.3, duration: 0.8, ease: 'power1.in' })
        .to(petal, {
          y: vh() + 60,
          rotation: `+=${rotAmt}`,
          duration,
          ease: 'none',
        }, 0)
        // Sway
        .to(petal, {
          x: `+=${swayX * swayDir}`,
          duration: duration * 0.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 2,
        }, 0)
        .to(petal, { opacity: 0, duration: 1.2 }, `-=1.5`)
        .set(petal, {
          y: -40,
          x: Math.random() * vw(),
          opacity: 0,
          rotation: Math.random() * 360,
        })
    })

    return () => petals.forEach(p => gsap.killTweensOf(p))
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        zIndex: 500, pointerEvents: 'none', overflow: 'hidden',
      }}
    >
      {Array.from({ length: PETAL_COUNT }, (_, i) => {
        const shape = SHAPES[i % SHAPES.length]
        const color = COLORS[i % COLORS.length]
        const op = (0.55 + (i % 4) * 0.1).toFixed(2)
        return (
          <svg
            key={i}
            className="petal"
            width="18" height="22"
            viewBox="0 0 18 22"
            fill="none"
            style={{ position: 'absolute', top: 0, willChange: 'transform' }}
            dangerouslySetInnerHTML={{ __html: shape(op, color) }}
          />
        )
      })}
    </div>
  )
}
