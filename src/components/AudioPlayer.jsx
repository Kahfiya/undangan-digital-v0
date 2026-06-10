import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const PLAYLIST = [
  {
    src: '/audio/Ari Lasso - Cinta Terakhir.mp3',
    cover: '/audio/ari_lasso_cover.jpeg',
    title: 'Cinta Terakhir',
    artist: 'Ari Lasso',
  },
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

  // Sync playing state with actual audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }, [playing])

  // Load new track when trackIdx changes (skip on mount, handled by visible effect)
  const mountedRef = useRef(false)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    }
  }, [trackIdx])

  useEffect(() => {
    if (!visible) return
    gsap.fromTo(wrapRef.current,
      { opacity: 0, scale: 0.7, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 1 }
    )
    setPlaying(true)
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
    setPlaying(prev => !prev)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !muted
    setMuted(m => !m)
  }

  if (!visible) return null

  return (
    <>
      <audio ref={audioRef} src={PLAYLIST[trackIdx].src} preload="auto" />

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
        {/* Expanded card — shown only when paused */}
        {!playing && (
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-gold-light)',
            borderRadius: 16,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 15px 45px rgba(212,175,55,0.12)',
            minWidth: 180,
          }}>
            {/* Vinyl disc */}
            <div ref={discRef} style={{
              width: 48, height: 48, borderRadius: '50%',
              flexShrink: 0, position: 'relative',
              background: '#FFFFFF',
              boxShadow: '0 0 0 2px var(--color-gold-light), 0 4px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}>
              {/* Cover art center */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
              }}>
                <img src={track.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Song info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
              }}>{track.title}</p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem',
                color: 'var(--color-gold-dark)',
                lineHeight: 1.2,
              }}>{track.artist}</p>
            </div>

            {/* Mute */}
            <button onClick={toggleMute} aria-label={muted ? 'Aktifkan suara' : 'Matikan suara'} style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'rgba(212,175,55,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: muted ? 'var(--color-text-muted)' : 'var(--color-gold-dark)',
              flexShrink: 0,
            }}>
              {muted ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Main play button */}
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause musik' : 'Play musik'}
          style={{
            width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'var(--color-gold-gradient)',
            boxShadow: playing && !muted
              ? '0 0 0 6px rgba(212,175,55,0.15), 0 10px 25px rgba(212,175,55,0.3)'
              : '0 8px 20px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="4" width="4" height="16" rx="1" fill="#FFFFFF"/>
              <rect x="14" y="4" width="4" height="16" rx="1" fill="#FFFFFF"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 5l11 7-11 7V5z" fill="#FFFFFF"/>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
