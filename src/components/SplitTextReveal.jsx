import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * SplitTextReveal — World-class text animation with character-by-character reveals
 * Supports multiple animation types: slide, fade, rotate, wave
 */
export default function SplitTextReveal({ 
  children, 
  type = 'slide', 
  stagger = 0.03, 
  duration = 0.8,
  start = 'top 85%',
  className = '',
  style = {},
  ...props 
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !children) return

    // Simple fallback if children is not a string
    if (typeof children !== 'string') {
      return
    }

    // Split text into characters
    const text = children
    const chars = text.split('').map((char, i) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.style.willChange = 'transform, opacity'
      return span
    })

    // Replace content with character spans
    container.innerHTML = ''
    chars.forEach(char => container.appendChild(char))

    const ctx = gsap.context(() => {
      let fromVars = {}
      let toVars = {}

      switch (type) {
        case 'slide':
          fromVars = { opacity: 0, y: 60, rotationX: -40 }
          toVars = { opacity: 1, y: 0, rotationX: 0 }
          break
        case 'fade':
          fromVars = { opacity: 0, scale: 0.8 }
          toVars = { opacity: 1, scale: 1 }
          break
        case 'rotate':
          fromVars = { opacity: 0, rotation: 180, scale: 0 }
          toVars = { opacity: 1, rotation: 0, scale: 1 }
          break
        case 'wave':
          fromVars = { opacity: 0, y: 100, rotation: 15 }
          toVars = { opacity: 1, y: 0, rotation: 0 }
          break
        case 'blur':
          fromVars = { opacity: 0, filter: 'blur(10px)', scale: 1.2 }
          toVars = { opacity: 1, filter: 'blur(0px)', scale: 1 }
          break
        default:
          fromVars = { opacity: 0, y: 30 }
          toVars = { opacity: 1, y: 0 }
      }

      // Set initial state
      gsap.set(chars, fromVars)

      // Animate on scroll
      gsap.to(chars, {
        ...toVars,
        stagger,
        duration,
        ease: type === 'wave' ? 'elastic.out(1, 0.5)' : 'power3.out',
        scrollTrigger: {
          trigger: container,
          start,
          once: true,
        }
      })
    }, container)

    return () => ctx.revert()
  }, [children, type, stagger, duration, start])

  // Fallback for non-string children
  if (typeof children !== 'string') {
    return (
      <span className={className} style={style} {...props}>
        {children}
      </span>
    )
  }

  return (
    <span 
      ref={containerRef} 
      className={className}
      style={style}
      {...props}
    >
      {children}
    </span>
  )
}