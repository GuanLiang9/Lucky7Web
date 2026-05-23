import React from 'react'
import { moods } from '../data/moods.js'

const colorStyles = {
  emerald: { active: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.5)',  text: '#34d399' },
  yellow:  { active: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.5)',   text: '#fde047' },
  purple:  { active: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.5)',  text: '#c084fc' },
  orange:  { active: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.5)',  text: '#fb923c' },
  cyan:    { active: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.5)',   text: '#22d3ee' },
  red:     { active: 'rgba(239,68,68,0.18)',   border: 'rgba(239,68,68,0.55)',  text: '#f87171' },
  violet:  { active: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.5)',  text: '#a78bfa' },
  amber:   { active: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.5)',  text: '#fcd34d' },
  blue:    { active: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.5)',  text: '#60a5fa' },
  pink:    { active: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.5)',  text: '#f472b6' },
  slate:   { active: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.5)', text: '#94a3b8' },
  gold:    { active: 'rgba(251,191,36,0.18)',  border: 'rgba(251,191,36,0.55)', text: '#fbbf24' },
  rose:    { active: 'rgba(244,63,94,0.15)',   border: 'rgba(244,63,94,0.5)',   text: '#fb7185' },
  teal:    { active: 'rgba(20,184,166,0.15)',  border: 'rgba(20,184,166,0.5)',  text: '#2dd4bf' },
  indigo:  { active: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.5)',  text: '#818cf8' },
}

export default function MoodPicker({ selected, onSelect }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-14">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(251,191,36,0.5)' }}>步骤二 · Step 2</div>
          <span className="text-xs rounded-full px-2 py-0.5 font-semibold" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: 'rgba(251,191,36,0.6)' }}>Optional</span>
        </div>
        <h2 className="text-3xl font-black" style={{ color: '#faf5f0' }}>How Are You Feeling?</h2>
        <p className="text-sm mt-2" style={{ color: 'rgba(250,245,240,0.35)' }}>Personalises your numbers · skip to use pure fate · 可跳过</p>
        <div className="gold-line w-24 mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {moods.map(mood => {
          const c = colorStyles[mood.color] || colorStyles.amber
          const isSelected = selected?.id === mood.id
          return (
            <button
              key={mood.id}
              onClick={() => onSelect(mood)}
              className="relative rounded-2xl p-4 text-center transition-all duration-300 hover:scale-[1.04]"
              style={{
                background: isSelected ? c.active : 'rgba(220,38,38,0.06)',
                border: `1px solid ${isSelected ? c.border : 'rgba(220,38,38,0.15)'}`,
                boxShadow: isSelected ? `0 0 20px ${c.active}` : 'none',
              }}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: isSelected ? c.text : '#faf5f0' }}
              >
                {mood.label}
              </div>
              <div
                className="text-xs font-medium mb-1"
                style={{ color: isSelected ? c.text : 'rgba(251,191,36,0.45)' }}
              >
                {mood.chinese}
              </div>
              <div className="text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>{mood.description}</div>
              <div className="text-xs" style={{ color: 'rgba(250,245,240,0.2)' }}>{mood.descChinese}</div>
              {isSelected && (
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: c.text, animation: 'goldPulse 1.5s ease-in-out infinite' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
