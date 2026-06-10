import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

/* ── Bird ── */
function Bird({ id, count }) {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const tlRef = useRef(null)
  const fleeing = useRef(false)
  
  // Efek depth 3D: Ukuran burung berbeda-beda berdasarkan ID agar tidak seragam
  const baseScale = useRef(0.95 + (id % 3) * 0.25).current // larger scale for adult birds

  // Wing flapping speed is unique per bird to avoid robotic synchronization
  const flapSpeed = useRef(0.22 + (id * 0.051) % 0.16).current

  const fleeState = useRef({ isFleeing: false, cx: 0, cy: 0 })

  useEffect(() => {
    if (!wrapRef.current) return

    // Physics parameters
    let x = (15 + (id * 20) % 70) / 100 * window.innerWidth
    let y = (20 + (id * 15) % 60) / 100 * window.innerHeight
    
    // Initial velocity vector
    const initialAngle = Math.random() * Math.PI * 2
    const startSpeed = 2.0
    let vx = Math.cos(initialAngle) * startSpeed
    let vy = Math.sin(initialAngle) * startSpeed

    // Craig Reynolds Wander parameters
    let wanderAngle = Math.random() * Math.PI * 2
    const circleDist = 120    // Distance of the wander circle in front of the bird
    const circleRadius = 60   // Radius of the wander circle (controls sharpness of turns)
    const wanderJitter = 0.12 // Maximum angle change per frame (controls wiggle frequency)

    // LERP targets for smooth transitions
    let currentScaleX = baseScale
    let currentPitch = 0

    // GSAP quickSetters for high-performance direct style writes
    const setX = gsap.quickSetter(wrapRef.current, "x", "px")
    const setY = gsap.quickSetter(wrapRef.current, "y", "px")
    const setRot = gsap.quickSetter(wrapRef.current, "rotation", "deg")
    const setScaleX = gsap.quickSetter(wrapRef.current, "scaleX")

    // Scroll tracking parameters
    let lastScrollY = window.scrollY
    let scrollVelocity = 0
    let smoothScrollVelocity = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY
      // Limit delta to prevent extreme screen-off jumps on fast trackpad scrolls
      if (Math.abs(delta) < 200) {
        scrollVelocity += delta * 0.15
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Set initial scale
    gsap.set(wrapRef.current, { scale: baseScale })

    let lastTime = performance.now()
    let rafId

    const loop = (time) => {
      const dt = Math.min(1.5, (time - lastTime) / 16.666)
      lastTime = time

      // Forces
      let fx = 0
      let fy = 0

      // 1. Smoothly interpolate scroll velocity to filter out high-frequency event jitter
      smoothScrollVelocity += (scrollVelocity - smoothScrollVelocity) * 0.12 * dt
      
      // Apply scroll reaction as a force (acceleration) rather than a velocity snap
      fy += smoothScrollVelocity * 0.7
      
      // Decay raw scroll velocity input
      scrollVelocity *= Math.pow(0.84, dt)

      // 2. Flee force (hover or touch)
      const fs = fleeState.current
      if (fs.isFleeing) {
        const dx = x - fs.cx
        const dy = y - fs.cy
        const dist = Math.hypot(dx, dy) || 1
        if (dist < 260) {
          const force = (260 - dist) / 260 * 18
          fx += (dx / dist) * force
          fy += (dy / dist) * force
        } else {
          fs.isFleeing = false
        }
      }

      // 3. Craig Reynolds Wander Steering Behavior
      const speed = Math.hypot(vx, vy) || 1
      const headingX = vx / speed
      const headingY = vy / speed
      
      const circleCenterX = headingX * circleDist
      const circleCenterY = headingY * circleDist

      wanderAngle += (Math.random() - 0.5) * wanderJitter

      const displacementX = Math.cos(wanderAngle) * circleRadius
      const displacementY = Math.sin(wanderAngle) * circleRadius

      const desiredVx = circleCenterX + displacementX
      const desiredVy = circleCenterY + displacementY

      const maxForce = fs.isFleeing ? 0.38 : 0.08
      const steerX = desiredVx - vx
      const steerY = desiredVy - vy
      const steerLen = Math.hypot(steerX, steerY) || 1

      if (steerLen > maxForce) {
        fx += (steerX / steerLen) * maxForce
        fy += (steerY / steerLen) * maxForce
      } else {
        fx += steerX
        fy += steerY
      }

      // Apply physics update
      vx += fx * dt
      vy += fy * dt

      // Clamp speed
      const maxSpeed = fs.isFleeing ? 7.2 : 2.6
      const currentSpeed = Math.hypot(vx, vy) || 1
      if (currentSpeed > maxSpeed) {
        vx = (vx / currentSpeed) * maxSpeed
        vy = (vy / currentSpeed) * maxSpeed
      }

      x += vx * dt
      y += vy * dt

      // 4. Smooth Screen Border Avoidance (Steer back gently instead of bouncing)
      const pad = 120
      const boundarySteerForce = 0.12
      if (x < pad) { vx += (pad - x) * boundarySteerForce * dt; }
      else if (x > window.innerWidth - pad) { vx += (window.innerWidth - pad - x) * boundarySteerForce * dt; }
      
      if (y < pad) { vy += (pad - y) * boundarySteerForce * dt; }
      else if (y > window.innerHeight - pad) { vy += (window.innerHeight - pad - y) * boundarySteerForce * dt; }

      // 5. Interpolated Rotation & Facing direction (Smooth 3D-like turns)
      let targetScaleX = vx > 0 ? -baseScale : baseScale // Face right if vx > 0, else left
      
      const pitchRad = Math.atan2(vy, Math.abs(vx))
      const targetPitch = Math.max(-24, Math.min(24, pitchRad * (180 / Math.PI)))
 
      currentScaleX += (targetScaleX - currentScaleX) * 0.09 * dt
      currentPitch += (targetPitch - currentPitch) * 0.08 * dt

      // Apply to DOM instantly
      setX(x)
      setY(y)
      setScaleX(currentScaleX)
      setRot(currentPitch)

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    
    // Play video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [baseScale, id])

  const triggerFlee = (cx, cy) => {
    fleeState.current = { isFleeing: true, cx, cy }
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  return (
    <div
      ref={wrapRef}
      onMouseEnter={e => flee(e.clientX, e.clientY)}
      onTouchStart={e => { e.preventDefault(); flee(e.touches[0].clientX, e.touches[0].clientY) }}
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 5,
        pointerEvents: 'auto', cursor: 'default',
        transform: 'translate(-50%,-50%)',
        willChange: 'transform',
      }}
    >
      {/* birdBob animates the up/down lift of the wing beats */}
      <div style={{
        transformOrigin: 'center center',
        animation: `birdBob ${flapSpeed}s ease-in-out infinite alternate`
      }}>
        <video
          ref={videoRef}
          src="/magic-garden/Burung2.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: 120, // larger width for adult birds
            height: 120, // larger height for adult birds
            objectFit: 'contain',
            filter: 'url(#chroma-key-white)', // key out white background dynamically to support dark backgrounds
          }}
        />
      </div>
    </div>
  )
}

/* ── BirdContainer ── */
export default function BirdContainer({ count = 6 }) {
  const birds = Array.from({ length: count }, (_, i) => i)

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 900, overflow: 'hidden' }}>
      {/* SVG chroma key filter definition */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="chroma-key-white" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      -3 -3 -3 9 0"
            />
          </filter>
        </defs>
      </svg>

      {birds.map(id => (
        <Bird key={id} id={id} count={count} />
      ))}
      <style>{`
        @keyframes birdBob {
          from { transform: translateY(-3.5px); }
          to   { transform: translateY(3.5px); }
        }
      `}</style>
    </div>
  )
}
