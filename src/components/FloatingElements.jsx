import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * FloatingElements — World-class floating particles with physics
 * Creates ambient floating elements with realistic movement
 */
export default function FloatingElements({ count = 8, size = 'medium' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating elements
    const elements = []
    for (let i = 0; i < count; i++) {
      const element = document.createElement('div')
      element.className = 'floating-element'
      
      // Random size based on size prop
      let elementSize
      switch (size) {
        case 'small':
          elementSize = gsap.utils.random(2, 6)
          break
        case 'large':
          elementSize = gsap.utils.random(8, 16)
          break
        default:
          elementSize = gsap.utils.random(4, 10)
      }

      // Style the element
      Object.assign(element.style, {
        position: 'absolute',
        width: `${elementSize}px`,
        height: `${elementSize}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(212,175,55,${gsap.utils.random(0.1, 0.3)}) 0%, transparent 70%)`,
        pointerEvents: 'none',
        willChange: 'transform',
        filter: 'blur(0.5px)',
      })

      // Random initial position
      gsap.set(element, {
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(0, window.innerHeight),
        scale: gsap.utils.random(0.5, 1.5),
        opacity: gsap.utils.random(0.3, 0.8),
      })

      container.appendChild(element)
      elements.push(element)

      // Create floating animation with physics
      const duration = gsap.utils.random(8, 15)
      const amplitude = gsap.utils.random(30, 80)
      
      // Vertical floating
      gsap.to(element, {
        y: `+=${gsap.utils.random(-amplitude, amplitude)}`,
        duration: duration,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: gsap.utils.random(0, 2),
      })

      // Horizontal drift
      gsap.to(element, {
        x: `+=${gsap.utils.random(-amplitude * 0.5, amplitude * 0.5)}`,
        duration: duration * 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: gsap.utils.random(0, 3),
      })

      // Scale pulsing
      gsap.to(element, {
        scale: `+=${gsap.utils.random(0.2, 0.5)}`,
        duration: gsap.utils.random(3, 6),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: gsap.utils.random(0, 2),
      })

      // Opacity breathing
      gsap.to(element, {
        opacity: `+=${gsap.utils.random(0.2, 0.4)}`,
        duration: gsap.utils.random(4, 8),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: gsap.utils.random(0, 4),
      })

      // Rotation
      gsap.to(element, {
        rotation: 360,
        duration: gsap.utils.random(20, 40),
        ease: 'none',
        repeat: -1,
      })
    }

    // Mouse interaction - elements are attracted to cursor
    const handleMouseMove = (e) => {
      elements.forEach((element, i) => {
        const rect = element.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        // Attraction within 200px radius
        if (distance < 200) {
          const force = (200 - distance) / 200
          const pullX = deltaX * force * 0.1
          const pullY = deltaY * force * 0.1
          
          gsap.to(element, {
            x: `+=${pullX}`,
            y: `+=${pullY}`,
            duration: 2,
            ease: 'power2.out',
          })
        }
      })
    }

    // Resize handler
    const handleResize = () => {
      elements.forEach(element => {
        // Keep elements within viewport
        const rect = element.getBoundingClientRect()
        if (rect.left < 0 || rect.left > window.innerWidth) {
          gsap.set(element, { x: gsap.utils.random(0, window.innerWidth) })
        }
        if (rect.top < 0 || rect.top > window.innerHeight) {
          gsap.set(element, { y: gsap.utils.random(0, window.innerHeight) })
        }
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      elements.forEach(element => element.remove())
    }
  }, [count, size])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    />
  )
}