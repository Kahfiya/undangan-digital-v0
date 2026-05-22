import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * World-level custom cursor:
 * - Outer ring follows with lag (lerp)
 * - Inner dot snaps instantly
 * - Magnetic pull on buttons/links
 * - Expands on hover, shrinks on click
 * - Hidden on touch devices
 */
export default function CustomCursor() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    document.documentElement.style.cursor = 'none'

    const outer = outerRef.current
    const inner = innerRef.current
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let outerX = mouseX
    let outerY = mouseY

    // Inner dot — instant
    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.set(inner, { x: mouseX, y: mouseY })
    }
    window.addEventListener('mousemove', onMove)

    // Outer ring — lerp via GSAP ticker
    const tick = () => {
      outerX += (mouseX - outerX) * 0.12
      outerY += (mouseY - outerY) * 0.12
      gsap.set(outer, { x: outerX, y: outerY })
    }
    gsap.ticker.add(tick)

    // Magnetic effect on interactive elements
    const MAGNETIC = 'a, button, [data-magnetic]'
    const onEnter = (e) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      gsap.to(outer, { scale: 2.2, opacity: 0.6, duration: 0.3, ease: 'power2.out' })
      gsap.to(inner, { scale: 0.4, duration: 0.3, ease: 'power2.out' })
      el._magnetMove = (ev) => {
        const dx = (ev.clientX - cx) * 0.35
        const dy = (ev.clientY - cy) * 0.35
        gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' })
      }
      el.addEventListener('mousemove', el._magnetMove)
    }
    const onLeave = (e) => {
      const el = e.currentTarget
      gsap.to(outer, { scale: 1, opacity: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
      gsap.to(inner, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
      el.removeEventListener('mousemove', el._magnetMove)
    }

    const onDown = () => gsap.to([outer, inner], { scale: 0.7, duration: 0.15 })
    const onUp   = () => gsap.to([outer, inner], { scale: 1,   duration: 0.3, ease: 'elastic.out(1, 0.5)' })

    const attachMagnets = () => {
      document.querySelectorAll(MAGNETIC).forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attachMagnets()
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    // Re-attach when DOM changes (new sections mount)
    const observer = new MutationObserver(attachMagnets)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      gsap.ticker.remove(tick)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Outer ring */}
      <div ref={outerRef} aria-hidden="true" style={{
        position: 'fixed', top: 0, left: 0,
        width: 36, height: 36,
        borderRadius: '50%',
        border: '1.5px solid var(--color-gold)',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'difference',
        willChange: 'transform',
      }} />
      {/* Inner dot */}
      <div ref={innerRef} aria-hidden="true" style={{
        position: 'fixed', top: 0, left: 0,
        width: 6, height: 6,
        borderRadius: '50%',
        background: 'var(--color-gold)',
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        willChange: 'transform',
      }} />
    </>
  )
}
