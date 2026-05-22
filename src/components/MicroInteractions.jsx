import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * MicroInteractions — World-class micro-interactions for the entire app
 * Adds subtle hover effects and interactions to all interactive elements
 */
export default function MicroInteractions() {
  useEffect(() => {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('button, .btn, [role="button"]')
    buttons.forEach(button => {
      if (button.classList.contains('hover-button')) return // Skip if already enhanced

      const handleMouseEnter = () => {
        gsap.to(button, {
          scale: 1.02,
          y: -1,
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      const handleMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          y: 0,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      button.addEventListener('mouseenter', handleMouseEnter)
      button.addEventListener('mouseleave', handleMouseLeave)
    })

    // Enhanced link hover effects
    const links = document.querySelectorAll('a:not(.nav-item)')
    links.forEach(link => {
      const handleMouseEnter = () => {
        gsap.to(link, {
          color: 'var(--color-gold)',
          scale: 1.01,
          duration: 0.2,
          ease: 'power2.out'
        })
      }

      const handleMouseLeave = () => {
        gsap.to(link, {
          color: 'inherit',
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        })
      }

      link.addEventListener('mouseenter', handleMouseEnter)
      link.addEventListener('mouseleave', handleMouseLeave)
    })

    // Enhanced input focus effects
    const inputs = document.querySelectorAll('input, textarea, select')
    inputs.forEach(input => {
      const handleFocus = () => {
        gsap.to(input, {
          scale: 1.01,
          boxShadow: '0 0 0 3px rgba(212,175,55,0.2), 0 4px 15px rgba(0,0,0,0.1)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      const handleBlur = () => {
        gsap.to(input, {
          scale: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
    })

    // Enhanced card hover effects
    const cards = document.querySelectorAll('.card, .couple-card, .hg-card')
    cards.forEach(card => {
      if (card.classList.contains('magnetic-target')) return // Skip if already enhanced

      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -4,
          scale: 1.01,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 8px 25px rgba(212,175,55,0.1)',
          duration: 0.4,
          ease: 'power3.out'
        })
      }

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          duration: 0.4,
          ease: 'power3.out'
        })
      }

      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)
    })

    // Scroll-triggered animations for elements entering viewport
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target
          
          // Fade in with slide up
          gsap.fromTo(element, 
            { opacity: 0, y: 30, scale: 0.95 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 0.8, 
              ease: 'power3.out',
              delay: Math.random() * 0.2 // Slight random delay for organic feel
            }
          )
          
          observer.unobserve(element)
        }
      })
    }, observerOptions)

    // Observe elements that should animate on scroll
    const animateOnScroll = document.querySelectorAll(
      '.section-title, .section-subtitle, .gold-divider, p:not(.animated), .nav-item'
    )
    animateOnScroll.forEach(el => {
      if (!el.classList.contains('animated')) {
        el.classList.add('animated')
        observer.observe(el)
      }
    })

    // Enhanced navigation hover effects
    const navItems = document.querySelectorAll('.nav-item')
    navItems.forEach(item => {
      const handleMouseEnter = () => {
        gsap.to(item, {
          scale: 1.1,
          color: 'var(--color-gold)',
          textShadow: '0 0 10px rgba(212,175,55,0.5)',
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      }

      const handleMouseLeave = () => {
        gsap.to(item, {
          scale: 1,
          color: 'inherit',
          textShadow: 'none',
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      item.addEventListener('mouseenter', handleMouseEnter)
      item.addEventListener('mouseleave', handleMouseLeave)
    })

    // Cleanup function
    return () => {
      observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}