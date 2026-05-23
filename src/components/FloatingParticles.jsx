import React, { useMemo } from 'react'

const CHARS = ['福', '发', '财', '运', '喜', '吉', '◆', '✦', '❋']

export default function FloatingParticles() {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    char: CHARS[i % CHARS.length],
    size: 10 + Math.random() * 14,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 8,
    opacity: 0.04 + Math.random() * 0.08,
    color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#dc2626' : '#f97316',
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

      {/* Large background glow orbs */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
    </div>
  )
}
