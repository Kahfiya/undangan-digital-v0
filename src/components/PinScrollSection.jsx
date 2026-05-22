import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * PinScrollSection — World-class pin scroll effect
 * Pins section while content animates through
 */
export default function PinScrollSection({ 
  children, 
  pinSpacing = true,
  duration = '200%',
  className = '',
  style = {},
  ...props 
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: duration,
        pin: true,
        pinSpacing,
        scrub: 1,
        onUpdate: (self) => {
          // Add custom animations based on progress
          const progress = self.progress
          
          // Example: fade in/out effect
          const opacity = progress < 0.5 
            ? gsap.utils.mapRange(0, 0.5, 0, 1, progress)
            : gsap.utils.mapRange(0.5, 1, 1, 0, progress)
          
          gsap.set(container, { opacity })
        }
      })
    }, container)

    return () => ctx.revert()
  }, [pinSpacing, duration])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}