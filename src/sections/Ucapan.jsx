import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import anime from 'animejs/lib/anime.es.js'

gsap.registerPlugin(ScrollTrigger)

const STORAGE_KEY = 'wedding_ucapan'
const EMOJIS = ['🌸', '💐', '✨', '🤍', '💛', '🌿', '🕊️', '💍', '🌺', '🎊']

const getInitials = (name) => name.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
const timeAgo = (ts) => {
  const diff = (Date.now() - ts) / 1000
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return `${Math.floor(diff / 86400)} hari lalu`
}

const SEED_DATA = [
  { id: 1, name: 'Ahmad Fauzi', message: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fi khair 👐', ts: Date.now() - 86400000 },
  { id: 2, name: 'Siti Rahayu', message: 'Selamat menempuh hidup baru, semoga langgeng hingga akhir hayat 💕', ts: Date.now() - 18000000 },
  { id: 3, name: 'Budi Santoso', message: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallah! 🌸', ts: Date.now() - 7200000 },
]

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
  const [ucapan, setUcapan] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || SEED_DATA }
    catch { return SEED_DATA }
  })
  const [particles, setParticles] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [charCount, setCharCount] = useState(0)

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

    const entry = { id: Date.now(), name: form.name.trim(), message: form.message.trim(), ts: Date.now() }
    const updated = [entry, ...ucapan]
    setUcapan(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setForm({ name: '', message: '' })
    setCharCount(0)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
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
          color: 'var(--color-gold)', marginBottom: 'var(--space-3)',
        }}>DOA &amp; UCAPAN</p>
        <h2 ref={titleRef} style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
          color: 'var(--color-text)', fontWeight: 400, lineHeight: 1.1,
        }}>Kirim Ucapan</h2>
        <div ref={lineRef} style={{
          width: 56, height: 1, margin: 'var(--space-4) auto 0',
          background: 'var(--color-gold-gradient)',
          transformOrigin: 'left center',
        }} />
      </div>

      {/* Two-column layout */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-8)',
        alignItems: 'start',
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
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: 12, color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--color-gold)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.12)'
                  anime({ targets: e.target, scale: [1, 1.01], duration: 200, easing: 'easeOutQuad' })
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(245,200,66,0.2)'
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
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: 12, color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  outline: 'none', resize: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--color-gold)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.12)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(245,200,66,0.2)'
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
                color: '#1a1209', fontFamily: 'var(--font-body)',
                fontSize: '0.85rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'box-shadow 0.3s',
                boxShadow: '0 4px 20px rgba(245,200,66,0.25)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(245,200,66,0.45)'
                anime({ targets: e.currentTarget, scale: 1.03, duration: 200, easing: 'easeOutQuad' })
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,200,66,0.25)'
                anime({ targets: e.currentTarget, scale: 1, duration: 200, easing: 'easeOutQuad' })
              }}
            >
              {submitted ? '✓ Terkirim!' : <>Kirim Ucapan <span>✨</span></>}
            </button>
          </form>
        </div>

        {/* ── Live Feed ── */}
        <div ref={feedRef} style={{ opacity: 0 }}>
          <div style={{
            maxHeight: 420, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
            paddingRight: 4,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(245,200,66,0.3) transparent',
          }}>
            {ucapan.map((item) => (
              <div key={item.id} className="uc-card" style={{
                background: 'var(--color-bg-soft)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: 14, padding: '16px 18px',
                boxShadow: 'var(--shadow-card)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: getColor(item.name),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-heading)', fontSize: '0.85rem',
                    color: '#fff', fontWeight: 600, flexShrink: 0,
                    border: '1.5px solid rgba(245,200,66,0.3)',
                  }}>
                    {getInitials(item.name)}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-gold)', margin: 0 }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      {timeAgo(item.ts)}
                    </p>
                  </div>
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: 'var(--color-text)', lineHeight: 1.7, margin: 0,
                }}>
                  {item.message}
                </p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 12 }}>
            {ucapan.length} ucapan telah dikirim
          </p>
        </div>
      </div>
    </section>
  )
}
