import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import './styles/global.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── World-level Lenis smooth scroll ──
const lenis = new Lenis({
  duration: 1.6,
  easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // expo ease out
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.8,
  infinite: false,
})

// Expose globally so BottomNav scrollTo can use Lenis
window.__lenis = lenis

// Sync Lenis → GSAP ticker
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
)
