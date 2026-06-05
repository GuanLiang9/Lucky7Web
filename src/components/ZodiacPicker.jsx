import React, { useState } from 'react'
import { CHINESE_ZODIAC, WESTERN_ZODIAC } from '../data/zodiac.js'
import { t } from '../data/translations.js'

export default function ZodiacPicker({ selectedZodiac, selectedHoroscope, onZodiacSelect, onHoroscopeSelect, lang = 'en' }) {
  const [showWestern, setShowWestern] = useState(false)

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-10">

      {/* Chinese Zodiac */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-black" style={{ color: '#faf5f0' }}>{t('zodiacSection', lang)}</div>
            <div className="text-sm mt-0.5" style={{ color: 'rgba(250,245,240,0.4)' }}>{t('zodiacDesc', lang)}</div>
          </div>
          {selectedZodiac && (
            <button
              onClick={() => onZodiacSelect(null)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171' }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {CHINESE_ZODIAC.map(z => {
            const isSelected = selectedZodiac?.id === z.id
            return (
              <button
                key={z.id}
                onClick={() => onZodiacSelect(isSelected ? null : z)}
                className="rounded-2xl p-2 sm:p-3 text-center transition-all duration-200 hover:scale-[1.05] active:scale-95"
                style={{
                  background: isSelected ? 'rgba(251,191,36,0.18)' : 'rgba(220,38,38,0.09)',
                  border: `2px solid ${isSelected ? 'rgba(251,191,36,0.72)' : 'rgba(220,38,38,0.22)'}`,
                  boxShadow: isSelected ? '0 0 22px rgba(251,191,36,0.18)' : 'none',
                }}
              >
                <div className="text-2xl sm:text-3xl mb-0.5 sm:mb-1">{z.emoji}</div>
                <div className="text-xs sm:text-sm font-black leading-tight" style={{ color: isSelected ? '#fde68a' : '#faf5f0' }}>
                  {lang === 'zh' ? z.zh : z.en}
                </div>
                <div className="text-xs font-medium hidden sm:block" style={{ color: isSelected ? 'rgba(251,191,36,0.75)' : 'rgba(251,191,36,0.42)' }}>
                  {lang === 'zh' ? z.en : z.zh}
                </div>
              </button>
            )
          })}
        </div>

        {selectedZodiac && (
          <div
            className="mt-3 rounded-xl px-4 py-2.5 text-sm"
            style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)', animation: 'slideUp 0.2s ease-out both' }}
          >
            <span style={{ color: 'rgba(250,245,240,0.4)' }}>{selectedZodiac.emoji} Birth years: </span>
            <span style={{ color: '#fbbf24' }}>{selectedZodiac.years}</span>
          </div>
        )}
      </div>

      {/* Western Horoscope — collapsible */}
      <div className="mt-6">
        <button
          onClick={() => setShowWestern(v => !v)}
          className="w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all"
          style={{
            background: showWestern ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${showWestern ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <div className="text-left">
              <div className="text-sm font-bold" style={{ color: showWestern ? '#c4b5fd' : 'rgba(250,245,240,0.5)' }}>
                {t('horoscopeSection', lang)}
              </div>
              <div className="text-xs" style={{ color: 'rgba(250,245,240,0.25)' }}>{t('horoscopeDesc', lang)}</div>
            </div>
            {selectedHoroscope && (
              <span className="ml-2 text-sm" style={{ color: '#c4b5fd' }}>
                {selectedHoroscope.emoji} {lang === 'zh' ? selectedHoroscope.zh : selectedHoroscope.en}
              </span>
            )}
          </div>
          <span className="text-base transition-transform duration-200" style={{
            color: 'rgba(139,92,246,0.5)',
            display: 'inline-block',
            transform: showWestern ? 'rotate(180deg)' : 'none',
          }}>▾</span>
        </button>

        {showWestern && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2" style={{ animation: 'slideUp 0.2s ease-out both' }}>
            {WESTERN_ZODIAC.map(z => {
              const isSelected = selectedHoroscope?.id === z.id
              return (
                <button
                  key={z.id}
                  onClick={() => onHoroscopeSelect(isSelected ? null : z)}
                  className="rounded-xl p-2.5 sm:p-3 text-center transition-all duration-200 hover:scale-[1.03] active:scale-95"
                  style={{
                    background: isSelected ? 'rgba(139,92,246,0.20)' : 'rgba(139,92,246,0.07)',
                    border: `1px solid ${isSelected ? 'rgba(139,92,246,0.62)' : 'rgba(139,92,246,0.22)'}`,
                    boxShadow: isSelected ? '0 0 20px rgba(139,92,246,0.18)' : 'none',
                  }}
                >
                  <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{z.emoji}</div>
                  <div className="text-xs font-bold leading-tight" style={{ color: isSelected ? '#c4b5fd' : '#faf5f0' }}>
                    {lang === 'zh' ? z.zh : z.en}
                  </div>
                  <div className="text-xs mt-0.5 hidden sm:block" style={{ color: 'rgba(250,245,240,0.35)' }}>{z.date}</div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
