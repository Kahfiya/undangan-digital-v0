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
import MagneticCursor from './components/MagneticCursor'
import MicroInteractions from './components/MicroInteractions'
import ScrollProgress from './components/ScrollProgress'
import CoreVerification from './components/CoreVerification'
import { useCoreVerification } from './hooks/useCoreVerification'

import Hero from './sections/Hero'
import Couple from './sections/Couple'
import Gallery from './sections/Gallery'
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
  useAutoScroll(phase === 'open', 3000, 1.2)

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

      {/* EnvelopeGate — 1:1 Lavicia style cover page */}
      {phase === 'envelope' && (
        <EnvelopeGate onOpen={() => setPhase('open')} />
      )}

      {/* Only mount main after open so ScrollTrigger measures real dimensions */}
      {phase === 'open' && (
        <main>
          <Hero />

          {/* Wrapper with Background Image (Like Couple Section) */}
          <div style={{
            position: 'relative',
            backgroundImage: 'url(/backgrounds/Background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
          }}>
            {/* Dark Overlay for Readability */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'rgba(0, 0, 0, 0.75)', 
              zIndex: 0 
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Couple />
              <Gallery />
              <Maps />
              <RSVP />
              <Ucapan />
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
        </>
      )}
    </>
  )
}
