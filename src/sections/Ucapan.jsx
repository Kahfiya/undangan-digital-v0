import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs/lib/anime.es.js'
import { supabase } from '../lib/supabase'

gsap.registerPlugin(ScrollTrigger)

const STORAGE_KEY = 'wedding_ucapan'
const EMOJIS = ['🌸', '💐', '✨', '🤍', '💛', '🌿', '🕊️', '💍', '🌺', '🎊']

const getInitials = (name) => name.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
const timeAgo = (ts) => {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return `${Math.floor(diff / 86400)} hari lalu`
}

const SEED_DATA = []

function FloatingParticle({ x, y, emoji, onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    anime({
      targets: ref.current,
      translateY: [-10, -120],
      translateX: [0, (Math.random() - 0.5) * 80],
      opacity: [1, 0],
      scale: [0.5, 1.4, 0],
      duration: 1800,
      easing: 'easeOutExpo',
      complete: onDone,
    })
  }, [])
  return (
    <span ref={ref} aria-hidden="true" style={{
      position: 'fixed', left: x, top: y, fontSize: 22,
      pointerEvents: 'none', zIndex: 9999, display: 'block',
    }}>{emoji}</span>
  )
}

export default function Ucapan() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const formRef    = useRef(null)
  const feedRef    = useRef(null)
  const btnRef     = useRef(null)
  const lineRef    = useRef(null)
  const particlesRef = useRef([])

  const [form, setForm] = useState({ name: '', message: '' })
  const [ucapan, setUcapan] = useState([])
  const [particles, setParticles] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [charCount, setCharCount] = useState(0)

  // ── Fetch from Supabase ───────────────────────────────────────────
  useEffect(() => {
    supabase
      .from('ucapan')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setUcapan(data) })

    // Realtime subscription
    const channel = supabase
      .channel('ucapan-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ucapan' }, (payload) => {
        setUcapan(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // ── Scroll entrance ──────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title letter-by-letter
      const title = titleRef.current
      if (title) {
        const text = title.textContent
        title.innerHTML = text.split('').map(c =>
          c === ' ' ? ' ' : `<span class="uc-char" style="display:inline-block;opacity:0;transform:translateY(40px)">${c}</span>`
        ).join('')
        gsap.to('.uc-char', {
          opacity: 1, y: 0, duration: 0.05, stagger: 0.04, ease: 'back.out(2)',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
        })
      }

      // Gold line draw
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power3.out', transformOrigin: 'left center',
          scrollTrigger: { trigger: lineRef.current, start: 'top 90%' } }
      )

      // Form slide in
      gsap.fromTo(formRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%' } }
      )

      // Feed slide in
      gsap.fromTo(feedRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: feedRef.current, start: 'top 85%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ── Animate new card when ucapan changes ─────────────────────────
  const prevLen = useRef(ucapan.length)
  useEffect(() => {
    if (ucapan.length > prevLen.current) {
      const cards = feedRef.current?.querySelectorAll('.uc-card')
      const newest = cards?.[0]
      if (newest) {
        anime({
          targets: newest,
          translateY: [-40, 0],
          opacity: [0, 1],
          scale: [0.92, 1],
          duration: 700,
          easing: 'spring(1, 80, 10, 0)',
        })
      }
    }
    prevLen.current = ucapan.length
  }, [ucapan])

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return

    // Button burst animation
    anime({
      targets: btnRef.current,
      scale: [1, 0.92, 1.06, 1],
      duration: 400,
      easing: 'easeInOutQuad',
    })

    // Spawn floating particles from button
    const rect = btnRef.current?.getBoundingClientRect()
    if (rect) {
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 60,
        y: rect.top,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      }))
      setParticles(p => [...p, ...newParticles])
    }

    const entry = { name: form.name.trim(), message: form.message.trim() }
    supabase.from('ucapan').insert(entry).select().single().then(({ data, error }) => {
      if (!error && data) {
        setUcapan(prev => [data, ...prev])
        setForm({ name: '', message: '' })
        setCharCount(0)
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
      }
    })
  }, [form, ucapan])

  const removeParticle = useCallback((id) => {
    setParticles(p => p.filter(x => x.id !== id))
  }, [])

  const avatarColors = ['#2d6a4f', '#1d3557', '#6d2b3d', '#5c4033', '#3d405b', '#4a4e69']
  const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length]

  return (
    <section ref={sectionRef} id="ucapan" style={{
      position: 'relative',
      background: 'transparent',
      padding: 'var(--space-16) var(--space-4)',
      overflow: 'hidden',
    }}>
      {/* Ambient background glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '70vw', height: '70vw', maxWidth: 600, maxHeight: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,200,66,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Floating particles portal */}
      {particles.map(p => (
        <FloatingParticle key={p.id} {...p} onDone={() => removeParticle(p.id)} />
      ))}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
        <p style={{
          fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'var(--color-gold-dark)', marginBottom: 'var(--space-3)',
          fontWeight: 600,
        }}>DOA &amp; UCAPAN</p>
        <h2 ref={titleRef} style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
          color: 'var(--color-text)', fontWeight: 400, lineHeight: 1.1,
        }}>Kirim Ucapan</h2>
        <div ref={lineRef} style={{
          width: 56, height: 1.5, margin: 'var(--space-4) auto 0',
          background: 'var(--color-gold-gradient)',
          transformOrigin: 'left center',
        }} />
      </div>

      {/* Single column layout for Form only */}
      <div style={{
        maxWidth: 600, margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>

        {/* ── Form ── */}
        <div ref={formRef} style={{ opacity: 0 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Nama Anda"
                required
                maxLength={60}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{
                  width: '100%', padding: '14px 18px',
                  background: 'var(--color-bg-soft)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12, color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--color-gold)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.05)'
                  anime({ targets: e.target, scale: [1, 1.01], duration: 200, easing: 'easeOutQuad' })
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <textarea
                placeholder="Tulis ucapan &amp; doa untuk kedua mempelai..."
                required
                maxLength={300}
                rows={5}
                value={form.message}
                onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setCharCount(e.target.value.length) }}
                style={{
                  width: '100%', padding: '14px 18px',
                  background: 'var(--color-bg-soft)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 12, color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  outline: 'none', resize: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--color-gold)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.05)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <span style={{
                position: 'absolute', bottom: 10, right: 14,
                fontSize: '0.7rem', color: charCount > 250 ? 'var(--color-gold)' : 'var(--color-text-muted)',
              }}>{charCount}/300</span>
            </div>

            <button
              ref={btnRef}
              type="submit"
              style={{
                padding: '15px 24px',
                background: 'var(--color-gold-gradient)',
                border: 'none', borderRadius: 12,
                color: '#000000', fontFamily: 'var(--font-body)',
                fontSize: '0.85rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'box-shadow 0.3s',
                boxShadow: '0 4px 20px rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(255,255,255,0.2)'
                anime({ targets: e.currentTarget, scale: 1.03, duration: 200, easing: 'easeOutQuad' })
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,255,255,0.1)'
                anime({ targets: e.currentTarget, scale: 1, duration: 200, easing: 'easeOutQuad' })
              }}
            >
              {submitted ? '✓ Terkirim!' : <>Kirim Ucapan <span>✨</span></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
