import { useEffect, useRef } from 'react'

/**
 * Auto-scroll dari atas ke bawah, hanya mobile.
 * Berhenti jika user scroll manual.
 * @param {boolean} active - mulai setelah phase 'open'
 * @param {number} delay   - jeda (ms) sebelum mulai scroll
 * @param {number} speed   - px per frame (default 0.6)
 */
export function useAutoScroll(active, delay = 3000, speed = 0.6) {
  const rafRef = useRef(null)
  const stoppedRef = useRef(false)

  useEffect(() => {
    if (!active) return

    const stopHandler = () => {
      stoppedRef.current = true
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('touchmove', stopHandler)
      window.removeEventListener('wheel', stopHandler)
    }

    const timer = setTimeout(() => {
      if (stoppedRef.current) return

      window.addEventListener('touchmove', stopHandler, { passive: true })
      window.addEventListener('wheel', stopHandler, { passive: true })

      const tick = () => {
        if (stoppedRef.current) return
        const lenis = window.__lenis
        const maxScroll = document.body.scrollHeight - window.innerHeight
        
        // Only trigger end of page stop if the page height is fully loaded (> 500px scrollable area)
        if (maxScroll > 500 && window.scrollY >= maxScroll - 10) {
          stopHandler()
          return
        }

        if (lenis) {
          lenis.scrollTo(window.scrollY + speed, { immediate: true })
        } else {
          window.scrollBy(0, speed)
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('touchmove', stopHandler)
      window.removeEventListener('wheel', stopHandler)
    }
  }, [active, delay, speed])
}
