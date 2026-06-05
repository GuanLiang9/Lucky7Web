import React, { useMemo } from 'react'

const CHARS = ['福', '发', '财', '运', '喜', '吉', 'lucky', '◆', '✦', '❋', '★', '✿']

export default function FloatingParticles() {
  const particles = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    char: CHARS[i % CHARS.length],
    size: 11 + Math.random() * 18,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 5 + Math.random() * 7,
    delay: Math.random() * 9,
    opacity: 0.10 + Math.random() * 0.16,
    color: i % 4 === 0 ? '#fbbf24' : i % 4 === 1 ? '#ef4444' : i % 4 === 2 ? '#f97316' : '#fde68a',
  })), [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute select-none font-black"
          style={{
            fontSize: p.size,
            color: p.color,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.char}
        </div>
      ))}

      {/* Background glow orbs — brighter for a festive lucky feel */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(220,38,38,0.22) 0%, rgba(220,38,38,0.06) 40%, transparent 70%)', filter: 'blur(48px)' }} />
      <div className="absolute top-1/3 -left-32 w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 65%)', filter: 'blur(56px)' }} />
      <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 65%)', filter: 'blur(56px)' }} />
      <div className="absolute bottom-0 left-1/4 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.10) 0%, transparent 65%)', filter: 'blur(56px)' }} />
    </div>
  )
}
