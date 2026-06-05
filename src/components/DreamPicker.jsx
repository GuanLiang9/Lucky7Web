import React, { useState } from 'react'
import { dreamCategories } from '../data/dreams.js'
import { t } from '../data/translations.js'

export default function DreamPicker({ selected, onToggle, lang = 'en' }) {
  const [activeCategory, setActiveCategory] = useState(dreamCategories[0].id)
  const currentCategory = dreamCategories.find(c => c.id === activeCategory)

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-10">
      <p className="text-sm mb-4" style={{ color: 'rgba(250,245,240,0.35)' }}>{t('dreamDesc', lang)}</p>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {dreamCategories.map(cat => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200"
              style={isActive ? {
                background: 'rgba(239,68,68,0.24)',
                border: '1.5px solid rgba(239,68,68,0.62)',
                color: '#fca5a5',
              } : {
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.20)',
                color: 'rgba(250,245,240,0.48)',
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className="hidden sm:inline" style={{ opacity: 0.65 }}>{cat.chinese}</span>
            </button>
          )
        })}
      </div>

      {/* Dream items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {currentCategory.items.map(item => {
          const isSelected = selected.some(s => s.id === item.id)
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item)}
              className="rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: isSelected ? 'rgba(251,191,36,0.14)' : 'rgba(220,38,38,0.08)',
                border: `1.5px solid ${isSelected ? 'rgba(251,191,36,0.58)' : 'rgba(220,38,38,0.20)'}`,
                boxShadow: isSelected ? '0 0 22px rgba(251,191,36,0.16)' : 'none',
              }}
            >
              <div className="text-3xl sm:text-4xl mb-2">{item.emoji}</div>
              <div
                className="text-sm font-semibold leading-tight"
                style={{ color: isSelected ? '#fde68a' : 'rgba(250,245,240,0.68)' }}
              >
                {lang === 'zh' ? item.chinese : item.label}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: isSelected ? 'rgba(251,191,36,0.72)' : 'rgba(250,245,240,0.35)' }}
              >
                {lang === 'zh' ? item.label : item.chinese}
              </div>
              {isSelected && (
                <div
                  className="mt-1.5 w-1.5 h-1.5 rounded-full mx-auto"
                  style={{ background: '#fbbf24', animation: 'goldPulse 1.5s ease-in-out infinite' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected pills */}
      {selected.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="text-xs self-center mr-1" style={{ color: 'rgba(250,245,240,0.3)' }}>Selected:</span>
          {selected.map(s => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
              style={{
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.3)',
                color: '#fbbf24',
              }}
            >
              {s.emoji} {s.label} · {s.chinese}
              <button
                onClick={() => onToggle(s)}
                className="ml-0.5 transition-colors hover:text-white"
                style={{ color: 'rgba(251,191,36,0.5)' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {selected.length === 0 && (
        <p className="mt-4 text-xs text-center" style={{ color: 'rgba(250,245,240,0.2)' }}>
          Optional — skip if you prefer pure fate
        </p>
      )}
    </div>
  )
}
