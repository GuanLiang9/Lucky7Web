import React, { useState } from 'react'
import { dreamCategories } from '../data/dreams.js'

export default function DreamPicker({ selected, onToggle }) {
  const [activeCategory, setActiveCategory] = useState(dreamCategories[0].id)
  const currentCategory = dreamCategories.find(c => c.id === activeCategory)

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-14">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(251,191,36,0.5)' }}>步骤三 · Step 3</div>
          <span className="text-xs rounded-full px-2 py-0.5 font-semibold" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: 'rgba(251,191,36,0.6)' }}>Optional</span>
        </div>
        <h2 className="text-3xl font-black" style={{ color: '#faf5f0' }}>What Did You Dream?</h2>
        <p className="text-sm mt-2" style={{ color: 'rgba(250,245,240,0.35)' }}>Pick symbols to influence your numbers · or skip · 可跳过</p>
        <div className="gold-line w-24 mx-auto mt-3" />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {dreamCategories.map(cat => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200"
              style={isActive ? {
                background: 'rgba(220,38,38,0.2)',
                border: '1px solid rgba(220,38,38,0.5)',
                color: '#f87171',
              } : {
                background: 'rgba(220,38,38,0.05)',
                border: '1px solid rgba(220,38,38,0.12)',
                color: 'rgba(250,245,240,0.4)',
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span style={{ opacity: 0.6 }}>{cat.chinese}</span>
            </button>
          )
        })}
      </div>

      {/* Dream items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {currentCategory.items.map(item => {
          const isSelected = selected.some(s => s.id === item.id)
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item)}
              className="rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.04]"
              style={{
                background: isSelected ? 'rgba(251,191,36,0.1)' : 'rgba(220,38,38,0.05)',
                border: `1px solid ${isSelected ? 'rgba(251,191,36,0.45)' : 'rgba(220,38,38,0.12)'}`,
                boxShadow: isSelected ? '0 0 18px rgba(251,191,36,0.1)' : 'none',
              }}
            >
              <div className="text-2xl mb-1.5">{item.emoji}</div>
              <div
                className="text-xs font-semibold leading-tight"
                style={{ color: isSelected ? '#fbbf24' : 'rgba(250,245,240,0.6)' }}
              >
                {item.label}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: isSelected ? 'rgba(251,191,36,0.65)' : 'rgba(250,245,240,0.3)' }}
              >
                {item.chinese}
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
