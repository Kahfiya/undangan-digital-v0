import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useClipReveal } from './hooks/useClipReveal'
import { useAutoScroll } from './hooks/useAutoScroll'

import EnvelopeGate from './components/EnvelopeGate'
import LoadingScreen from './components/LoadingScreen'
import AudioPlayer from './components/AudioPlayer'
import BottomNav from './components/BottomNav'
import FallingPetals from './components/FallingPetals'
import BirdContainer from './components/BirdContainer'
import MagneticCursor from './components/MagneticCursor'
import MicroInteractions from './components/MicroInteractions'
import ScrollProgress from './components/ScrollProgress'
import CoreVerification from './components/CoreVerification'
import { useCoreVerification } from './hooks/useCoreVerification'

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
  useCoreVerification()
  const [phase, setPhase] = useState('envelope')
  useClipReveal(phase === 'open')
  useAutoScroll(phase === 'open', 3000, 0.6)

  useEffect(() => {
    if (phase !== 'open') return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
  }, [phase])

  return (
    <>
      <CoreVerification />
      <MagneticCursor />

      {/* EnvelopeGate — wekita.id style cover page */}
      {phase === 'envelope' && (
        <EnvelopeGate onOpen={() => setPhase('open')} />
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
          <MicroInteractions />
          <ScrollProgress />
          <BirdContainer count={3} />
        </>
      )}
    </>
  )
}
