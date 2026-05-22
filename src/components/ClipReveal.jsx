import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * ClipReveal — wraps any element with a clip-path scroll-driven reveal.
 * direction: 'up' | 'down' | 'left' | 'right' | 'circle'
 */
export default function ClipReveal({ children, direction = 'up', delay = 0, className = '', style = {} }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const clips = {
      up:     ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
      down:   ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
      left:   ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
      right:  ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
      circle: ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'],
    }

    const [from, to] = clips[direction] || clips.up

    gsap.set(el, { clipPath: from, willChange: 'clip-path' })

    const anim = gsap.to(el, {
      clipPath: to,
      duration: 1.1,
      delay,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

    return () => { anim.kill(); ScrollTrigger.getAll().forEach(t => t.vars.trigger === el && t.kill()) }
  }, [direction, delay])

  return (
    <div ref={ref} className={className} style={{ ...style, willChange: 'clip-path' }}>
      {children}
    </div>
  )
}
