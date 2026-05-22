import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * ParallaxSection — World-class parallax container
 * Creates depth layers with sophisticated parallax effects
 */
export default function ParallaxSection({ 
  children, 
  speed = 0.5, 
  direction = 'vertical', // 'vertical' | 'horizontal'
  className = '',
  style = {},
  ...props 
}) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    
    if (!container || !content) return

    const ctx = gsap.context(() => {
      // Parallax effect based on direction
      if (direction === 'vertical') {
        gsap.to(content, {
          yPercent: -50 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })
      } else if (direction === 'horizontal') {
        gsap.to(content, {
          xPercent: -50 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })
      }

      // Add depth blur effect for background layers
      if (speed > 1) {
        gsap.to(content, {
          filter: `blur(${(speed - 1) * 2}px)`,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })
      }
    }, container)

    return () => ctx.revert()
  }, [speed, direction])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        overflow: 'hidden',
        ...style
      }}
      {...props}
    >
      <div
        ref={contentRef}
        style={{
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}