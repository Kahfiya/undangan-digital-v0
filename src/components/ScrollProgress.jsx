import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * ScrollProgress — World-class scroll progress indicator
 * Elegant progress bar with smooth animations
 */
export default function ScrollProgress() {
  const progressRef = useRef(null)
  const circleRef = useRef(null)

  useEffect(() => {
    const progress = progressRef.current
    const circle = circleRef.current

    // Animate progress bar
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    })

    // Animate circle indicator
    gsap.to(circle, {
      rotation: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    })

    // Show/hide based on scroll position
    ScrollTrigger.create({
      start: 'top -100',
      end: 'max',
      onUpdate: (self) => {
        const opacity = self.progress > 0.05 ? 1 : 0
        gsap.to([progress.parentElement, circle.parentElement], {
          opacity,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    })

  }, [])

  return (
    <>
      {/* Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'rgba(212, 175, 55, 0.2)',
        zIndex: 1000,
        opacity: 0,
      }}>
        <div
          ref={progressRef}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))',
            transformOrigin: 'left',
            scaleX: 0,
          }}
        />
      </div>

      {/* Circular Progress */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        zIndex: 1000,
        opacity: 0,
      }}>
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="rgba(212, 175, 55, 0.2)"
            strokeWidth="2"
          />
          <circle
            ref={circleRef}
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="125.6"
            strokeDashoffset="125.6"
            transform="rotate(-90 25 25)"
            style={{
              strokeDashoffset: 'calc(125.6 - (125.6 * var(--progress, 0)))',
            }}
          />
        </svg>
        
        {/* Percentage text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '10px',
          color: 'var(--color-gold)',
          fontWeight: '500',
        }}>
          %
        </div>
      </div>
    </>
  )
}