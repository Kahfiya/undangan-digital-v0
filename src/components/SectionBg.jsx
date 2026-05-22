/**
 * SectionBg — background image dengan overlay untuk section manapun.
 * Taruh sebagai child pertama di dalam <section style={{position:'relative'}}>
 */
export default function SectionBg({ src, overlay = 'rgba(255,255,255,0.88)' }) {
  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
        onError={e => { e.target.style.display = 'none' }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: overlay,
          zIndex: 0,
        }}
      />
    </>
  )
}
