import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useClipReveal } from './hooks/useClipReveal'

import EnvelopeGate from './components/EnvelopeGate'
import EntranceAnimation from './components/EntranceAnimation'
import LoadingScreen from './components/LoadingScreen'
import AudioPlayer from './components/AudioPlayer'
import BottomNav from './components/BottomNav'
import FallingPetals from './components/FallingPetals'
import FloatingElements from './components/FloatingElements'
import MagneticCursor from './components/MagneticCursor'
import MicroInteractions from './components/MicroInteractions'
import ScrollProgress from './components/ScrollProgress'

import Hero from './sections/Hero'
import Couple from './sections/Couple'
import HorizontalGallery from './sections/HorizontalGallery'
import RSVP from './sections/RSVP'
import Ucapan from './sections/Ucapan'
import Maps from './sections/Maps'
import Gift from './sections/Gift'
import Footer from './sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [phase, setPhase] = useState('envelope')
  useClipReveal(phase === 'open')

  useEffect(() => {
    if (phase !== 'open') return
    // Wait for paint then refresh so ScrollTrigger measures correctly
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
  }, [phase])

  return (
    <>
      <MagneticCursor />
      
      {phase === 'envelope' && (
        <EnvelopeGate onOpen={() => setPhase('entrance')} />
      )}

      {phase === 'entrance' && (
        <EntranceAnimation onComplete={() => setPhase('open')} />
      )}

      {/* Only mount main after open so ScrollTrigger measures real dimensions */}
      {phase === 'open' && (
        <main>
          <Hero />

          {/* Light wrapper: Couple + Gallery */}
          <div style={{
            position: 'relative',
            backgroundImage: 'url(/backgrounds/Background2.jpg)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.85)',
              pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Couple />
              <HorizontalGallery />
            </div>
          </div>

          {/* Light wrapper: RSVP → Footer */}
          <div style={{
            position: 'relative',
            backgroundImage: 'url(/backgrounds/Background2.jpg)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.85)',
              pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <RSVP />
              <Ucapan />
              <Maps />
              <Gift />
              <Footer />
            </div>
          </div>
        </main>
      )}

      {phase === 'open' && (
        <>
          <BottomNav />
          <AudioPlayer visible />
          <FallingPetals />
          <FloatingElements count={6} size="medium" />
          <MicroInteractions />
          <ScrollProgress />
        </>
      )}
    </>
  )
}
