import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CLIPS = {
  up:     ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  down:   ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
  left:   ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  right:  ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  circle: ['circle(0% at 50% 50%)', 'circle(80% at 50% 50%)'],
}

/**
 * Auto-applies clip-path reveal to all [data-clip] elements in the DOM.
 * Usage: add data-clip="up|down|left|right|circle" and optionally data-clip-delay="0.2"
 * Call once in App after phase === 'open'
 */
export function useClipReveal(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const els = document.querySelectorAll('[data-clip]')
    const anims = []

    els.forEach((el) => {
      const dir = el.dataset.clip || 'up'
      const delay = parseFloat(el.dataset.clipDelay || '0')
      const [from, to] = CLIPS[dir] || CLIPS.up

      gsap.set(el, { clipPath: from })

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
      anims.push(anim)
    })

    return () => anims.forEach(a => a.kill())
  }, [enabled])
}
