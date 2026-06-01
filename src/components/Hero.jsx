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
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
      <Lantern side="left" />
      <Lantern side="right" />

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-7"
        style={{
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.25)',
          animation: 'fadeIn 0.6s ease-out both',
        }}
      >
        <span className="text-sm">🧧</span>
        <span className="text-xs uppercase tracking-widest font-bold" style={{ color: '#fbbf24' }}>
          {lang === 'en' ? 'Singapore Lucky Numbers' : '新加坡幸运数字'}
        </span>
        <span className="text-sm">🧧</span>
      </div>

      {/* Main title */}
      <div style={{ animation: 'slideUp 0.6s ease-out both' }}>
        <h1 className="font-black leading-none mb-2"
          style={{ fontSize: 'clamp(4.5rem, 13vw, 9rem)', color: '#faf5f0' }}>
          Lucky<span className="gradient-text-gold"> 7</span>
        </h1>
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="gold-line w-16" />
          <span className="text-sm tracking-[0.35em] font-medium" style={{ color: 'rgba(251,191,36,0.6)' }}>
            幸 运 数 字
          </span>
          <div className="gold-line w-16" />
        </div>
      </div>

      <p className="text-xl md:text-2xl max-w-md mb-3"
        style={{ color: 'rgba(250,245,240,0.6)', animation: 'slideUp 0.6s ease-out 0.1s both' }}>
        {t('tagline', lang)}
      </p>
      <p className="text-base max-w-sm mb-10"
        style={{ color: 'rgba(250,245,240,0.3)', animation: 'slideUp 0.6s ease-out 0.18s both' }}>
        {t('subtitle', lang)}{' '}
        <span style={{ color: '#fbbf24' }} className="font-semibold">4D</span>{' '}
        {lang === 'en' ? 'and' : '和'}{' '}
        <span style={{ color: '#f97316' }} className="font-semibold">TOTO</span>
      </p>

      {/* ── Manual CTA ── */}
      <button
        onClick={onStart}
        className="btn-red relative px-14 py-5 rounded-full font-black text-xl uppercase tracking-widest text-white active:scale-95"
        style={{ animation: 'slideUp 0.6s ease-out 0.26s both' }}
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl">🔮</span>
          {t('cta', lang)}
        </span>
      </button>

      {/* ── Voice CTA — full one-shot voice input ── */}
      <div className="mt-8 w-full max-w-sm">
        <VoiceInput onResult={onVoiceResult} lang={lang} heroMode />
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-1 sm:flex sm:flex-wrap justify-center gap-2 mt-10 w-full max-w-sm sm:max-w-none"
        style={{ animation: 'fadeIn 0.8s ease-out 0.5s both' }}
      >
        {[
          { label: t('nextDraw4D', lang),   value: fmtDrawDate(nextDrawDate(DRAW_4D)),   icon: '🎰' },
          { label: t('totoJackpot', lang),  value: nextJackpot(drawsToto),              icon: '💰' },
          { label: t('nextDrawToto', lang), value: fmtDrawDate(nextDrawDate(DRAW_TOTO)), icon: '🎱' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(251,191,36,0.12)' }}>
            <span className="text-xl">{s.icon}</span>
            <div className="text-left">
              <div className="text-sm uppercase tracking-widest" style={{ color: 'rgba(250,245,240,0.35)' }}>{s.label}</div>
              <div className="text-base font-bold" style={{ color: '#fbbf24' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.2 }}>
        <div className="text-xs uppercase tracking-widest" style={{ color: '#fbbf24' }}>scroll</div>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(251,191,36,0.5), transparent)' }} />
      </div>
    </div>
  )
}
