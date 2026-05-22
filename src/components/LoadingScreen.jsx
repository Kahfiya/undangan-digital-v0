import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * LoadingScreen — World-class loading animation
 * Elegant entrance with sophisticated transitions
 */
export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const progressRef = useRef(null)
  const textRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const logo = logoRef.current
    const progressBar = progressRef.current
    const text = textRef.current

    // Initial setup
    gsap.set(container, { opacity: 1 })
    gsap.set(logo, { scale: 0.8, opacity: 0 })
    gsap.set(text, { y: 20, opacity: 0 })
    gsap.set(progressBar, { scaleX: 0 })

    // Entrance animation
    const tl = gsap.timeline()
    
    tl.to(logo, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)'
    })
    .to(text, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')

    // Simulate loading progress
    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(progressInterval)
        
        // Complete loading
        setTimeout(() => {
          completeLoading()
        }, 500)
      }
      
      setProgress(currentProgress)
      gsap.to(progressBar, {
        scaleX: currentProgress / 100,
        duration: 0.3,
        ease: 'power2.out'
      })
    }, 100)

    const completeLoading = () => {
      const exitTl = gsap.timeline({
        onComplete: () => {
          onComplete?.()
        }
      })

      // Logo burst effect
      exitTl.to(logo, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(logo, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.in(1.7)'
      }, '-=0.1')
      
      // Text fade
      .to(text, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      }, '-=0.4')
      
      // Progress bar complete
      .to(progressBar, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.6')
      
      // Container slide up
      .to(container, {
        y: '-100%',
        duration: 1,
        ease: 'power4.inOut'
      }, '-=0.2')
    }

    return () => {
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #1a1209 0%, #2d1f0f 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        opacity: 0,
      }}
    >
      {/* Logo/Icon */}
      <div
        ref={logoRef}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--color-gold-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px',
          boxShadow: '0 20px 60px rgba(212, 175, 55, 0.3)',
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: '#fff',
          borderRadius: '50%',
          position: 'relative',
        }}>
          {/* Heart icon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            color: 'var(--color-gold)',
          }}>
            ♥
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div
        ref={textRef}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          color: 'var(--color-gold-light)',
          marginBottom: '40px',
          textAlign: 'center',
        }}
      >
        M. Riyan & Siti Arbayah
      </div>

      {/* Progress bar container */}
      <div style={{
        width: '200px',
        height: '2px',
        background: 'rgba(212, 175, 55, 0.2)',
        borderRadius: '1px',
        overflow: 'hidden',
        marginBottom: '20px',
      }}>
        <div
          ref={progressRef}
          style={{
            height: '100%',
            background: 'var(--color-gold-gradient)',
            transformOrigin: 'left',
            borderRadius: '1px',
          }}
        />
      </div>

      {/* Progress percentage */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.6)',
        letterSpacing: '0.1em',
      }}>
        {Math.round(progress)}%
      </div>

      {/* Floating particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: 'var(--color-gold)',
              borderRadius: '50%',
              opacity: Math.random() * 0.5 + 0.2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-${i % 3} ${3 + Math.random() * 2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(20px) rotate(-180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33% { transform: translate(10px, -10px) rotate(120deg); }
          66% { transform: translate(-10px, 10px) rotate(240deg); }
        }
      `}</style>
    </div>
  )
}