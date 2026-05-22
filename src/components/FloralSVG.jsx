export default function FloralSVG({ size = 120, opacity = 0.3, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true" style={{ display: 'block', ...style }}>
      {/* Lotus petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx="60" cy="60" rx="7" ry="22"
          fill="var(--color-gold)"
          opacity={opacity}
          transform={`rotate(${angle} 60 60) translate(0 -26)`}
        />
      ))}
      {/* Inner petals */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
        <ellipse
          key={`i-${i}`}
          cx="60" cy="60" rx="4" ry="14"
          fill="var(--color-gold)"
          opacity={opacity * 0.7}
          transform={`rotate(${angle} 60 60) translate(0 -16)`}
        />
      ))}
      {/* Center */}
      <circle cx="60" cy="60" r="7" fill="var(--color-gold)" opacity={opacity * 2.5} />
      <circle cx="60" cy="60" r="3" fill="var(--color-gold)" opacity={opacity * 3} />
      {/* Stem */}
      <line x1="60" y1="82" x2="60" y2="110" stroke="var(--color-gold)" strokeWidth="1.5" opacity={opacity} strokeLinecap="round" />
      {/* Leaves */}
      <path d="M60 95 Q45 88 38 78" stroke="var(--color-gold)" strokeWidth="1.2" opacity={opacity * 0.8} fill="none" strokeLinecap="round" />
      <path d="M60 95 Q75 88 82 78" stroke="var(--color-gold)" strokeWidth="1.2" opacity={opacity * 0.8} fill="none" strokeLinecap="round" />
    </svg>
  )
}
