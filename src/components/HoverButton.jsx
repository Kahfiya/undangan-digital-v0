import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * HoverButton — World-class button with magnetic and ripple effects
 */
export default function HoverButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  className = '',
  style = {},
  ...props 
}) {
  const buttonRef = useRef(null)
  const rippleRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const button = buttonRef.current
    const ripple = rippleRef.current
    const text = textRef.current
    if (!button || !ripple || !text) return

    // Magnetic effect
    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * 0.15
      const deltaY = (e.clientY - centerY) * 0.15

      gsap.to(button, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseEnter = () => {
      // Scale and glow effect
      gsap.to(button, {
        scale: 1.05,
        boxShadow: variant === 'primary' 
          ? '0 15px 35px rgba(212,175,55,0.4), 0 5px 15px rgba(0,0,0,0.1)'
          : '0 10px 25px rgba(0,0,0,0.15)',
        duration: 0.4,
        ease: 'power2.out'
      })

      // Text slide up effect
      gsap.to(text, {
        y: -2,
        duration: 0.3,
        ease: 'power2.out'
      })

      // Ripple expand
      gsap.fromTo(ripple, 
        { scale: 0, opacity: 0.8 },
        { scale: 1, opacity: 0.2, duration: 0.6, ease: 'power2.out' }
      )
    }

    const handleMouseLeave = () => {
      // Reset position and scale
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        boxShadow: variant === 'primary' 
          ? '0 8px 25px rgba(212,175,55,0.2), 0 3px 10px rgba(0,0,0,0.1)'
          : '0 4px 15px rgba(0,0,0,0.1)',
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })

      // Reset text
      gsap.to(text, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })

      // Ripple fade
      gsap.to(ripple, {
        scale: 1.2,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const handleClick = (e) => {
      // Click ripple effect
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.set(ripple, {
        left: x,
        top: y,
        scale: 0,
        opacity: 0.6
      })

      gsap.to(ripple, {
        scale: 3,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      })

      // Button press effect
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      })

      onClick?.(e)
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseenter', handleMouseEnter)
    button.addEventListener('mouseleave', handleMouseLeave)
    button.addEventListener('click', handleClick)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseenter', handleMouseEnter)
      button.removeEventListener('mouseleave', handleMouseLeave)
      button.removeEventListener('click', handleClick)
    }
  }, [onClick, variant])

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, var(--color-gold) 0%, #f4d03f 100%)',
          color: '#1a1209',
          border: 'none',
          boxShadow: '0 8px 25px rgba(212,175,55,0.2), 0 3px 10px rgba(0,0,0,0.1)',
        }
      case 'secondary':
        return {
          background: 'transparent',
          color: 'var(--color-gold)',
          border: '2px solid var(--color-gold)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        }
      case 'ghost':
        return {
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
        }
      default:
        return {}
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: '0.8rem',
          borderRadius: '6px',
        }
      case 'large':
        return {
          padding: '16px 32px',
          fontSize: '1.1rem',
          borderRadius: '12px',
        }
      default:
        return {
          padding: '12px 24px',
          fontSize: '0.9rem',
          borderRadius: '8px',
        }
    }
  }

  return (
    <button
      ref={buttonRef}
      className={`hover-button ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        cursor: 'none',
        willChange: 'transform',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {/* Ripple effect */}
      <div
        ref={rippleRef}
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: variant === 'primary' ? 'rgba(255,255,255,0.3)' : 'rgba(212,175,55,0.3)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: 0,
        }}
      />
      
      {/* Text content */}
      <span ref={textRef} style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
    </button>
  )
}