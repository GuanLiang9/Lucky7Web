import React from 'react'

function Lantern({ side }) {
  const isLeft = side === 'left'
  return (
    <div
      className="absolute top-16 hidden lg:flex flex-col items-center"
      style={{
        [isLeft ? 'left' : 'right']: '3rem',
        animation: 'lanternSwing 4s ease-in-out infinite',
        transformOrigin: 'top center',
        animationDelay: isLeft ? '0s' : '0.8s',
      }}
    >
      <div className="w-px h-8" style={{ background: 'rgba(251,191,36,0.3)' }} />
      <div className="text-5xl" style={{ filter: 'drop-shadow(0 0 12px rgba(220,38,38,0.6))' }}>🏮</div>
    </div>
  )
}

export default function Hero({ onStart }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 pb-16">
      <Lantern side="left" />
      <Lantern side="right" />

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8"
        style={{
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.25)',
          animation: 'fadeIn 0.6s ease-out both',
        }}
      >
        <span className="text-sm">🧧</span>
        <span className="text-xs uppercase tracking-widest font-bold" style={{ color: '#fbbf24' }}>
          Singapore Lucky Numbers
        </span>
        <span className="text-sm">🧧</span>
      </div>

      {/* Main title */}
      <div style={{ animation: 'slideUp 0.6s ease-out both' }}>
        <h1
          className="font-black leading-none mb-2"
          style={{ fontSize: 'clamp(4.5rem, 13vw, 9rem)', color: '#faf5f0' }}
        >
          Lucky
          <span className="gradient-text-gold"> 7</span>
        </h1>
        {/* Chinese subtitle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="gold-line w-16" />
          <span className="text-sm tracking-[0.35em] font-medium" style={{ color: 'rgba(251,191,36,0.6)' }}>
            幸 运 数 字
          </span>
          <div className="gold-line w-16" />
        </div>
      </div>

      <p
        className="text-lg md:text-xl max-w-md mb-3"
        style={{ color: 'rgba(250,245,240,0.6)', animation: 'slideUp 0.6s ease-out 0.12s both' }}
      >
        Let the universe guide your numbers.
      </p>
      <p
        className="text-sm max-w-sm mb-12"
        style={{ color: 'rgba(250,245,240,0.3)', animation: 'slideUp 0.6s ease-out 0.22s both' }}
      >
        Your mood, your dreams — personalised lucky numbers for{' '}
        <span style={{ color: '#fbbf24' }} className="font-semibold">4D</span> and{' '}
        <span style={{ color: '#f97316' }} className="font-semibold">TOTO</span>
      </p>

      {/* CTA */}
      <button
        onClick={onStart}
        className="btn-red relative px-12 py-4 rounded-full font-black text-base uppercase tracking-widest text-white active:scale-95"
        style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}
      >
        <span className="flex items-center gap-2">
          <span>🔮</span>
          Reveal My Fortune
        </span>
      </button>

      {/* Stats row */}
      <div
        className="grid grid-cols-1 sm:flex sm:flex-wrap justify-center gap-2 mt-14 w-full max-w-sm sm:max-w-none"
        style={{ animation: 'fadeIn 0.8s ease-out 0.5s both' }}
      >
        {[
          { label: 'Next 4D Draw', value: 'Wed, 25 May', icon: '🎰' },
          { label: 'TOTO Jackpot', value: 'S$3,200,000', icon: '💰' },
          { label: 'Next TOTO Draw', value: 'Thu, 26 May', icon: '🎱' },
        ].map((s, i) => (
          <div
            key={s.label}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{
              background: 'rgba(220,38,38,0.07)',
              border: '1px solid rgba(251,191,36,0.12)',
            }}
          >
            <span className="text-lg">{s.icon}</span>
            <div className="text-left">
              <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(250,245,240,0.35)' }}>{s.label}</div>
              <div className="text-sm font-bold" style={{ color: '#fbbf24' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.25 }}>
        <div className="text-xs uppercase tracking-widest" style={{ color: '#fbbf24' }}>scroll</div>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(251,191,36,0.5), transparent)' }} />
      </div>
    </div>
  )
}
