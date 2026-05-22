import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wraps children dengan reveal animasi saat scroll masuk viewport.
 * Props: from ('bottom'|'left'|'right'), distance, duration, delay
 */
export default function ScrollReveal({ children, from = 'bottom', distance = 50, duration = 0.9, delay = 0, style = {} }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const fromVars = {
      bottom: { opacity: 0, y: distance },
      left:   { opacity: 0, x: -distance },
      right:  { opacity: 0, x: distance },
      scale:  { opacity: 0, scale: 0.9, y: distance * 0.5 },
    }[from] || { opacity: 0, y: distance }

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...fromVars,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  )
}
