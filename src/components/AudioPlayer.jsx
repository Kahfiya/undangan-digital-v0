import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const PLAYLIST = [
  {
    src: '/audio/SpotiDown.App - Beautiful In White - Shane Filan.mp3',
    cover: '/audio/SpotiDown.App - Beautiful In White - Shane Filan.jpeg',
    title: 'Beautiful In White',
    artist: 'Shane Filan',
  },
]

export default function AudioPlayer({ visible = false }) {
  const audioRef = useRef(null)
  const wrapRef = useRef(null)
  const discRef = useRef(null)
  const spinAnim = useRef(null)
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const track = PLAYLIST[trackIdx]
  const trackIdxRef = useRef(trackIdx)

  // Auto-advance to next track
  useEffect(() => {
    trackIdxRef.current = trackIdx
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => {
      const next = (trackIdxRef.current + 1) % PLAYLIST.length
      setTrackIdx(next)
    }
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [trackIdx])

  // Load new track when trackIdx changes (skip on mount, handled by visible effect)
  const mountedRef = useRef(false)
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return }
    const audio = audioRef.current
    if (!audio) return
    audio.src = PLAYLIST[trackIdx].src
    audio.load()
    audio.play().then(() => setPlaying(true)).catch(() => {})
  }, [trackIdx])

  useEffect(() => {
    if (!visible) return
    gsap.fromTo(wrapRef.current,
      { opacity: 0, scale: 0.7, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 1 }
    )
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => {})
  }, [visible])

  // Spin disc when playing
  useEffect(() => {
    if (!discRef.current) return
    if (playing && !muted) {
      spinAnim.current = gsap.to(discRef.current, {
        rotation: '+=360', duration: 4, ease: 'none', repeat: -1,
      })
    } else {
      spinAnim.current?.pause()
    }
    return () => spinAnim.current?.kill()
  }, [playing, muted])

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !muted
    setMuted(m => !m)
  }

  if (!visible) return null

  return (
    <>
      <audio ref={audioRef} src={PLAYLIST[0].src} preload="auto" />

      <div ref={wrapRef} style={{
        position: 'fixed',
        bottom: 'calc(var(--nav-height) + var(--space-4))',
        right: 'var(--space-4)',
        zIndex: 900,
        opacity: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 'var(--space-2)',
      }}>
        {/* Expanded card */}
        {expanded && (
          <div style={{
            background: 'rgba(15,10,5,0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(212,175,55,0.35)',
            borderRadius: 16,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            minWidth: 200,
          }}>
            {/* Vinyl disc */}
            <div ref={discRef} style={{
              width: 52, height: 52, borderRadius: '50%',
              flexShrink: 0, position: 'relative',
              background: '#111',
              boxShadow: '0 0 0 2px rgba(212,175,55,0.4), 0 4px 12px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }}>
              {/* Vinyl grooves */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'repeating-radial-gradient(circle, #1a1a1a 0px, #111 2px, #1a1a1a 4px)',
              }} />
              {/* Cover art center */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 28, height: 28, borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid rgba(212,175,55,0.5)',
              }}>
                <img src={track.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Center hole */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 6, height: 6, borderRadius: '50%',
                background: '#111',
                border: '1px solid rgba(212,175,55,0.4)',
              }} />
            </div>

            {/* Song info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
              }}>{track.title}</p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                color: 'var(--color-gold-light)',
                lineHeight: 1.3,
              }}>{track.artist}</p>
            </div>

            {/* Mute */}
            <button onClick={toggleMute} aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'} style={{
              width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: muted ? 'rgba(255,255,255,0.4)' : 'var(--color-gold)',
              flexShrink: 0,
            }}>
              {muted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Main play button */}
        <button
          onClick={() => { togglePlay(); setExpanded(true) }}
          aria-label={playing ? 'Pause musik' : 'Play musik'}
          style={{
            width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'var(--color-gold-gradient)',
            boxShadow: playing && !muted
              ? '0 0 0 6px rgba(212,175,55,0.2), 0 4px 16px rgba(212,175,55,0.4)'
              : '0 4px 16px rgba(212,175,55,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'box-shadow 0.3s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="4" width="4" height="16" rx="1" fill="#1a1209"/>
              <rect x="14" y="4" width="4" height="16" rx="1" fill="#1a1209"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 5l11 7-11 7V5z" fill="#1a1209"/>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
