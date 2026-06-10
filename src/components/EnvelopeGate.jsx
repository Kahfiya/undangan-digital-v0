import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

export default function EnvelopeGate({ onOpen }) {
  const guestName = new URLSearchParams(window.location.search).get('to') || 'Tamu'
  const [visible, setVisible] = useState(true)

  const handleOpen = () => {
    setVisible(false)
    setTimeout(onOpen, 1000)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="gate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 9999, 
            overflow: 'hidden', 
            background: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Immersive Background Image with Overlay */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url("/gallery/Albums3.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.7)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
            }} />
          </div>

          {/* Content Wrapper */}
          <div style={{
            position: 'relative', zIndex: 10,
            width: '100%',
            maxWidth: '480px',
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#FFFFFF'
          }}>
            {/* THE WEDDING OF */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ 
                fontFamily: "'Lora', serif", 
                fontSize: '15px', 
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              THE WEDDING OF
            </motion.p>
            
            {/* Raudatul & Cahyo (Names) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={{ 
                fontFamily: "'Sacramento', cursive", 
                fontSize: '55px', 
                fontWeight: 400,
                margin: '0.5rem 0 1.5rem',
                lineHeight: 1.2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Riyan & Arbayah
            </motion.h1>

            {/* You're invited label */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{ 
                fontFamily: "'Lora', serif", 
                fontSize: '14px', 
                fontWeight: 400,
                letterSpacing: '1px',
                marginBottom: '2rem',
                opacity: 0.9
              }}
            >
              You're invited to our wedding ceremony
            </motion.p>

            {/* Guest Label Box - Presisi 1:1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(4px)',
                padding: '1.5rem 2rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '2.5rem',
                width: '80%',
              }}
            >
              <p style={{ 
                fontFamily: "'Lora', serif", 
                fontSize: '16px', 
                marginBottom: '0.5rem',
                opacity: 0.8
              }}>Dear,</p>
              <h2 style={{ 
                fontFamily: "'Lora', serif", 
                fontSize: '20px', 
                fontWeight: 600,
                margin: 0
              }}>{guestName}</h2>
            </motion.div>

            {/* Tombol Open - Putih Bulat Presisi */}
            <motion.button
              onClick={handleOpen}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: [1, 1.05, 1] }}
              transition={{ 
                opacity: { duration: 0.8, delay: 1.1 },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#FFFFFF',
                color: '#000000',
                border: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase'
              }}
            >
              Open
            </motion.button>
          </div>

          {/* Ornamen Bunga Bawah - Presisi Posisi */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '300px',
            pointerEvents: 'none',
            zIndex: 5
          }}>
            <img 
              src="/backgrounds/Bunga3.png" 
              alt="" 
              style={{ 
                width: '100%', 
                marginBottom: '-10px',
                opacity: 0.8
              }} 
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
