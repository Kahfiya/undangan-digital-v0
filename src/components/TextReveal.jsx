import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * TextReveal — premium clip-path + y reveal per child element.
 * Each direct child slides up from behind a mask.
 */
export default function TextReveal({ children, stagger = 0.14, duration = 0.9, start = 'top 88%' }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = Array.from(wrapRef.current.children)

      // Set initial state — clipped from below
      gsap.set(items, {
        opacity: 0,
        y: 48,
        clipPath: 'inset(0 0 100% 0)',
      })

      gsap.to(items, {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0 0 0% 0)',
        stagger,
        duration,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapRef.current,
          start,
          once: true,
        },
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [stagger, duration, start])

  return (
    <div ref={wrapRef}>
      {children}
    </div>
  )
}
