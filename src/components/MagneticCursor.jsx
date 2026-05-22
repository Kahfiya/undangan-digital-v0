import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * MagneticCursor — World-class magnetic cursor effect
 * Creates smooth magnetic attraction to interactive elements
 */
export default function MagneticCursor() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const isTouch = useRef(false)

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) {
      isTouch.current = true
      return
    }

    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    
    let mouseX = 0, mouseY = 0
    let cursorX = 0, cursorY = 0
    let dotX = 0, dotY = 0

    // Smooth cursor following
    const updateCursor = () => {
      const ease = 0.15
      const dotEase = 0.25
      
      cursorX += (mouseX - cursorX) * ease
      cursorY += (mouseY - cursorY) * ease
      
      dotX += (mouseX - dotX) * dotEase
      dotY += (mouseY - dotY) * dotEase
      
      gsap.set(cursor, { x: cursorX, y: cursorY })
      gsap.set(cursorDot, { x: dotX, y: dotY })
      
      requestAnimationFrame(updateCursor)
    }
    updateCursor()

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Magnetic effect for interactive elements
    const handleMagneticEnter = (e) => {
      const element = e.currentTarget
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Scale cursor
      gsap.to(cursor, { scale: 3, duration: 0.3, ease: 'power2.out' })
      gsap.to(cursorDot, { scale: 0, duration: 0.3, ease: 'power2.out' })
      
      // Magnetic attraction
      const handleMagneticMove = (e) => {
        const deltaX = (e.clientX - centerX) * 0.3
        const deltaY = (e.clientY - centerY) * 0.3
        
        gsap.to(element, { 
          x: deltaX, 
          y: deltaY, 
          duration: 0.3, 
          ease: 'power2.out' 
        })
      }
      
      element.addEventListener('mousemove', handleMagneticMove)
      element._magneticMove = handleMagneticMove
    }

    const handleMagneticLeave = (e) => {
      const element = e.currentTarget
      
      // Reset cursor
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(cursorDot, { scale: 1, duration: 0.3, ease: 'power2.out' })
      
      // Reset element position
      gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
      
      // Remove magnetic move listener
      if (element._magneticMove) {
        element.removeEventListener('mousemove', element._magneticMove)
        delete element._magneticMove
      }
    }

    // Text hover effect
    const handleTextEnter = () => {
      gsap.to(cursor, { scale: 0.5, duration: 0.3, ease: 'power2.out' })
      gsap.to(cursorDot, { scale: 2, duration: 0.3, ease: 'power2.out' })
    }

    const handleTextLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(cursorDot, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove)
    
    // Magnetic elements
    const magneticElements = document.querySelectorAll('[data-magnetic]')
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', handleMagneticEnter)
      el.addEventListener('mouseleave', handleMagneticLeave)
    })
    
    // Text elements
    const textElements = document.querySelectorAll('h1, h2, h3, p, a')
    textElements.forEach(el => {
      el.addEventListener('mouseenter', handleTextEnter)
      el.addEventListener('mouseleave', handleTextLeave)
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      magneticElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMagneticEnter)
        el.removeEventListener('mouseleave', handleMagneticLeave)
        if (el._magneticMove) {
          el.removeEventListener('mousemove', el._magneticMove)
        }
      })
      textElements.forEach(el => {
        el.removeEventListener('mouseenter', handleTextEnter)
        el.removeEventListener('mouseleave', handleTextLeave)
      })
    }
  }, [])

  if (isTouch.current) return null

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          border: '1px solid rgba(212, 175, 55, 0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--color-gold)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  )
}