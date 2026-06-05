import React from 'react'
import { t } from '../data/translations.js'
import VoiceInput from './VoiceInput.jsx'
import { nextDrawDate, fmtDrawDate, DRAW_4D, DRAW_TOTO } from '../utils/drawSchedule.js'

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

function nextJackpot(drawsToto) {
  if (!drawsToto?.length) return 'S$1,000,000+'
  const last = drawsToto[0]
  if (!last.winners) return last.jackpot + '+'
  return 'S$1,000,000+'
}

export default function Hero({ onStart, onVoiceResult, draws4D, drawsToto, lang = 'en' }) {
  const stats = [
    { label: t('nextDraw4D', lang),   value: fmtDrawDate(nextDrawDate(DRAW_4D)),   icon: '🎰' },
    { label: t('totoJackpot', lang),  value: nextJackpot(drawsToto),               icon: '💰' },
    { label: t('nextDrawToto', lang), value: fmtDrawDate(nextDrawDate(DRAW_TOTO)), icon: '🎱' },
  ]

  return (
    <div className="relative min-h-screen flex flex-col items-center px-5 sm:px-6 pt-16 sm:pt-20">
      <Lantern side="left" />
      <Lantern side="right" />

      {/* ── Centred content block ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full py-6 sm:py-8">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 mb-6"
          style={{
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.38)',
            boxShadow: '0 0 24px rgba(251,191,36,0.12)',
            animation: 'fadeIn 0.6s ease-out both',
          }}
        >
          <span className="text-sm">🧧</span>
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: '#fde68a' }}>
            {lang === 'en' ? 'Singapore Lucky Numbers' : '新加坡幸运数字'}
          </span>
          <span className="text-sm">🧧</span>
        </div>

        {/* Main title */}
        <div style={{ animation: 'slideUp 0.6s ease-out both' }}>
          <h1 className="font-black leading-none mb-2"
            style={{ fontSize: 'clamp(3.8rem, 14vw, 8rem)', color: '#faf5f0' }}>
            Lucky<span className="gradient-text-gold"> 7</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="gold-line w-14 sm:w-16" />
            <span className="text-sm tracking-[0.35em] font-medium" style={{ color: 'rgba(251,191,36,0.75)' }}>
              幸 运 数 字
            </span>
            <div className="gold-line w-14 sm:w-16" />
          </div>
        </div>

        <p className="text-base sm:text-lg md:text-xl max-w-sm sm:max-w-md mb-2"
          style={{ color: 'rgba(250,245,240,0.72)', animation: 'slideUp 0.6s ease-out 0.1s both' }}>
          {t('tagline', lang)}
        </p>
        <p className="text-sm max-w-xs sm:max-w-sm mb-7"
          style={{ color: 'rgba(250,245,240,0.38)', animation: 'slideUp 0.6s ease-out 0.18s both' }}>
          {t('subtitle', lang)}{' '}
          <span style={{ color: '#fbbf24' }} className="font-semibold">4D</span>{' '}
          {lang === 'en' ? 'and' : '和'}{' '}
          <span style={{ color: '#fb923c' }} className="font-semibold">TOTO</span>
        </p>

        {/* Manual CTA */}
        <button
          onClick={onStart}
          className="btn-red relative px-10 sm:px-12 py-4 sm:py-5 rounded-full font-black text-lg sm:text-xl uppercase tracking-widest text-white active:scale-95"
          style={{ animation: 'slideUp 0.6s ease-out 0.26s both' }}
        >
          <span className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl">🔮</span>
            {t('cta', lang)}
          </span>
        </button>

        {/* Voice CTA */}
        <div className="mt-5 w-full max-w-sm">
          <VoiceInput onResult={onVoiceResult} lang={lang} heroMode />
        </div>

        {/* Stats row — draw dates + jackpot — horizontal scroll on mobile */}
        <div
          className="mt-7 w-full max-w-sm sm:max-w-none"
          style={{ animation: 'fadeIn 0.8s ease-out 0.5s both' }}
        >
          {/* Mobile: horizontal scroll */}
          <div className="flex sm:hidden gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {stats.map(s => (
              <div key={s.label} className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(251,191,36,0.20)' }}>
                <span className="text-lg">{s.icon}</span>
                <div className="text-left">
                  <div className="text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: 'rgba(250,245,240,0.42)' }}>{s.label}</div>
                  <div className="text-sm font-bold whitespace-nowrap" style={{ color: '#fbbf24' }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: flex wrap */}
          <div className="hidden sm:flex flex-wrap justify-center gap-2">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(251,191,36,0.20)' }}>
                <span className="text-xl">{s.icon}</span>
                <div className="text-left">
                  <div className="text-sm uppercase tracking-widest" style={{ color: 'rgba(250,245,240,0.42)' }}>{s.label}</div>
                  <div className="text-base font-bold" style={{ color: '#fbbf24' }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>{/* end centred block */}

      {/* Scroll hint */}
      <div className="flex flex-col items-center gap-2 pb-5" style={{ opacity: 0.28 }}>
        <div className="text-xs uppercase tracking-widest" style={{ color: '#fbbf24' }}>scroll</div>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(251,191,36,0.6), transparent)' }} />
      </div>

    </div>
  )
}
