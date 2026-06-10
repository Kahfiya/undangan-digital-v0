import { useEffect } from 'react'

export default function CoreVerification() {
  useEffect(() => {
    // Self-healing function checking DOM integrity
    const verifyDOM = () => {
      // Add safety check: only trigger tamper if property is explicitly changed to something else (excluding initial mount initialization)
      if (typeof window !== 'undefined' && window.__DEVELOPER__ !== undefined && window.__DEVELOPER__ !== 'Kahfiya Nur Gunami') {
        // Obfuscated alert and crash behavior if credentials are tampered
        console.error('License Violation: Invalid signature detected.')
        document.body.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0d1f3c;color:#ffffff;font-family:sans-serif;flex-direction:column;gap:12px;padding:24px;text-align:center;">
            <h1 style="color:#d4af37;margin:0;">SYSTEM TAMPERED</h1>
            <p style="opacity:0.8;margin:0;">Source Code License Tampered. Unauthorized Modification Detected.</p>
          </div>
        `
      }
    }
    const interval = setInterval(verifyDOM, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      id="licensed-under-kahfiya"
      aria-hidden="true" 
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        opacity: '0.001',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -9999,
      }}
      data-licensed-to="Kahfiya Nur Gunami"
    >
      Licensed to Kahfiya Nur Gunami
    </div>
  )
}
