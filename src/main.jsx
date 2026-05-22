import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Lenis smooth scroll + GSAP ScrollTrigger integration ──
const lenis = new Lenis({
  duration: 1.4,           // scroll duration — lebih tinggi = lebih smooth
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,    // mobile touch feel
})

// Sync Lenis dengan GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// Sync ScrollTrigger dengan Lenis scroll position
lenis.on('scroll', ScrollTrigger.update)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
