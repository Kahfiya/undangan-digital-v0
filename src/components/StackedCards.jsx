import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * StackedCards — cards start stacked/overlapping, fan out on scroll.
 * Pass `cards` array: [{ label, title, subtitle, imgSrc, alt }]
 */
export default function StackedCards({ cards = [] }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cardEls = wrapRef.current.querySelectorAll('.stacked-card')
      const total = cardEls.length

      // Initial stacked state
      gsap.set(cardEls, (i) => ({
        x: (i - Math.floor(total / 2)) * 12,
        y: (total - 1 - i) * 6,
        rotate: (i - Math.floor(total / 2)) * 4,
        zIndex: i,
        transformOrigin: 'bottom center',
      }))

      // Fan out on scroll
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top 75%',
        end: 'top 30%',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress
          cardEls.forEach((el, i) => {
            const offset = i - Math.floor(total / 2)
            gsap.set(el, {
              x: offset * (12 + p * 100),
              y: (total - 1 - i) * 6 * (1 - p),
              rotate: offset * (4 - p * 4),
            })
          })
        },
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 280,
        marginTop: 'var(--space-8)',
      }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          className="stacked-card"
          style={{
            position: 'absolute',
            width: 'min(72vw, 240px)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--color-bg-soft)',
            border: '1px solid rgba(212,175,55,0.2)',
            boxShadow: 'var(--shadow-card)',
            willChange: 'transform',
          }}
        >
          {card.imgSrc && (
            <img
              src={card.imgSrc}
              alt={card.alt || card.title}
              style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          )}
          <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
            {card.label && (
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-1)' }}>
                {card.label}
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>{card.title}</p>
            {card.subtitle && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{card.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
