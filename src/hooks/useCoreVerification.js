import { useEffect } from 'react'

export function useCoreVerification() {
  // Obfuscated Base64 signature for: "Kahfiya Nur Gunami"
  const key = 'S2FoZml5YSBOdXIgR3VuYW1p'
  const decrypted = atob(key)

  // Window global protection - Define immediately on execution (pre-render)
  if (typeof window !== 'undefined' && !window.__DEVELOPER__) {
    try {
      Object.defineProperty(window, '__DEVELOPER__', {
        value: decrypted,
        writable: false,
        configurable: false,
      })
      Object.defineProperty(window, '__SOURCE_LICENSE__', {
        value: 'Commercial-Private',
        writable: false,
        configurable: false,
      })
    } catch (e) {
      // already defined
    }
  }

  useEffect(() => {
    // Injected console credit
    console.log(
      `%c👨‍💻 Core Architecture: Licensed to ${decrypted}`,
      'color: #d4af37; font-family: monospace; font-size: 13px; font-weight: bold; background: #0d1f3c; padding: 6px 12px; border-radius: 4px; border: 1.5px solid #d4af37;'
    )
  }, [])
}
