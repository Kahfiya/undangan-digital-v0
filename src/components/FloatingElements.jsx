import { motion } from 'framer-motion'

const spring = { type: 'spring', stiffness: 40, damping: 25 }

/* Merak terbang dengan path kurva */
function Merak({ startX, startY, delay = 0, flip = false, size = 64 }) {
  return (
    <motion.img
      src="/magic-garden/Merak.svg"
      alt=""
      aria-hidden="true"
      initial={{ x: startX, y: startY, opacity: 0 }}
      animate={{
        x: [startX, startX + 140, startX + 80, startX + 220],
        y: [startY, startY - 70, startY - 30, startY - 110],
        opacity: [0, 1, 1, 0],
      }}
      transition={{ duration: 9, delay, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        width: size,
        height: 'auto',
        transform: flip ? 'scaleX(-1)' : 'none',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  )
}

/* Bunga melayang dengan rotasi lambat */
function FloatingFlower({ src, style, delay = 0, rotateRange = 8 }) {
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      animate={{
        y: [0, -12, 0],
        rotate: [-rotateRange / 2, rotateRange / 2, -rotateRange / 2],
        opacity: [0.85, 1, 0.85],
      }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
    />
  )
}

/* Papper/kertas jatuh berputar */
function Papper({ style, delay = 0 }) {
  return (
    <motion.img
      src="/magic-garden/Papper.svg"
      alt=""
      aria-hidden="true"
      animate={{
        y: [0, -8, 0],
        rotate: [0, 5, 0],
        opacity: [0.7, 0.9, 0.7],
      }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
    />
  )
}

export default function FloatingElements() {
  return (
    <>
      {/* Merak kiri → kanan */}
      <Merak startX={-90} startY={100} delay={1.5} size={60} />
      {/* Merak kanan → kiri (flip) */}
      <Merak startX={-50} startY={160} delay={4} flip size={48} />

      {/* Bunga pojok kiri bawah */}
      <FloatingFlower
        src="/magic-garden/Bunga1.svg"
        style={{ bottom: '6%', left: '2%', width: 140, zIndex: 3 }}
        delay={0}
      />
      {/* Bunga pojok kanan bawah */}
      <FloatingFlower
        src="/magic-garden/Bunga2.svg"
        style={{ bottom: '4%', right: '2%', width: 160, zIndex: 3, transform: 'scaleX(-1)' }}
        delay={1}
      />
      {/* Bunga kiri tengah */}
      <FloatingFlower
        src="/magic-garden/Bunga3.svg"
        style={{ top: '30%', left: '-2%', width: 120, zIndex: 3 }}
        delay={2}
        rotateRange={6}
      />
      {/* Bunga kanan tengah */}
      <FloatingFlower
        src="/magic-garden/Bunga4.svg"
        style={{ top: '25%', right: '-2%', width: 120, zIndex: 3, transform: 'scaleX(-1)' }}
        delay={1.5}
        rotateRange={6}
      />

      {/* Papper dekoratif */}
      <Papper
        style={{ bottom: '18%', left: '8%', width: 80, zIndex: 3, opacity: 0.6 }}
        delay={0.5}
      />
      <Papper
        style={{ bottom: '22%', right: '8%', width: 70, zIndex: 3, opacity: 0.5, transform: 'scaleX(-1)' }}
        delay={2}
      />
    </>
  )
}
