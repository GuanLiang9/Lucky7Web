import React, { useState, useMemo } from 'react'
import { previousDraws4D, previousDrawsToto, hot4DDigits, cold4DDigits, hotTotoNums, coldTotoNums } from '../data/previousDraws.js'

function computeHot4D(draws) {
  const freq = {}
  draws.forEach(d => {
    const all = [d.first, d.second, d.third, ...(d.starters||[]), ...(d.consolation||[])]
    all.forEach(n => n && n.split('').forEach(digit => { freq[digit] = (freq[digit] || 0) + 1 }))
  })
  return Object.entries(freq).sort((a,b) => b[1]-a[1]).map(([d]) => d)
}

function computeHotToto(draws) {
  const freq = {}
  draws.forEach(d => {
    ;(d.numbers || []).forEach(n => {
      if (n >= 1 && n <= 49) freq[n] = (freq[n] || 0) + 1
    })
    if (d.bonus >= 1 && d.bonus <= 49) freq[d.bonus] = (freq[d.bonus] || 0) + 0.5
  })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([n]) => parseInt(n))
    .filter(n => n >= 1 && n <= 49)
}

function Badge({ label, color }) {
  return (
    <span
      className="text-xs rounded-full px-2 py-0.5 font-bold uppercase tracking-wide"
      style={{ background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
    >
      {label}
    </span>
  )
}

export default function HotNumbers({ gameType, draws4D, drawsToto }) {
  const [tab, setTab] = useState('hot')

  const isHot = tab === 'hot'

  const computed4D   = useMemo(() => computeHot4D(draws4D   || previousDraws4D),   [draws4D])
  const computedToto = useMemo(() => computeHotToto(drawsToto || previousDrawsToto), [drawsToto])

  const fourdDigits = isHot ? computed4D : [...computed4D].reverse()
  const totoNums    = (isHot ? computedToto : [...computedToto].reverse()).slice(0, 12)

  const show4d   = gameType === '4d'   || gameType === 'both'
  const showToto = gameType === 'toto' || gameType === 'both'

  if (!gameType) return null

  return (
    <div
      className="w-full max-w-3xl mx-auto px-6 mb-10 rounded-2xl p-5"
      style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-black" style={{ color: '#faf5f0' }}>
            {isHot ? '🔥 Hot Numbers' : '🧊 Cold Numbers'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(250,245,240,0.35)' }}>
            {isHot ? 'Appeared most in recent draws · 近期最常出现' : 'Due for a comeback · 久未出现'}
          </div>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'hot',  label: '🔥 Hot',  color: { bg: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.4)', text: '#f87171' } },
            { id: 'cold', label: '🧊 Cold', color: { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.4)',  text: '#22d3ee' } },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={tab === t.id ? {
                background: t.color.bg, border: `1px solid ${t.color.border}`, color: t.color.text,
              } : {
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(250,245,240,0.3)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* 4D hot digits */}
        {show4d && (
          <div>
            <div className="text-xs uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'rgba(251,191,36,0.5)' }}>
              <span>4D {isHot ? 'Hot' : 'Cold'} Digits</span>
              <Badge label={isHot ? '最热' : '最冷'} color={{ bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {fourdDigits.map((digit, i) => (
                <div
                  key={digit}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                    style={{
                      background: isHot
                        ? `rgba(220,38,38,${0.25 - i * 0.02})`
                        : `rgba(6,182,212,${0.2 - i * 0.015})`,
                      border: isHot
                        ? `1px solid rgba(220,38,38,${0.6 - i * 0.05})`
                        : `1px solid rgba(6,182,212,${0.5 - i * 0.04})`,
                      color: isHot ? '#fca5a5' : '#67e8f9',
                    }}
                  >
                    {digit}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(250,245,240,0.25)' }}>#{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOTO hot numbers */}
        {showToto && (
          <div>
            <div className="text-xs uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'rgba(251,191,36,0.5)' }}>
              <span>TOTO {isHot ? 'Hot' : 'Cold'} Numbers</span>
              <Badge label={isHot ? '最热' : '最冷'} color={{ bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {totoNums.map((n, i) => (
                <div
                  key={n}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm relative"
                  style={{
                    background: isHot
                      ? `rgba(220,38,38,${0.22 - i * 0.015})`
                      : `rgba(6,182,212,${0.18 - i * 0.012})`,
                    border: isHot
                      ? `1px solid rgba(220,38,38,${0.55 - i * 0.03})`
                      : `1px solid rgba(6,182,212,${0.45 - i * 0.025})`,
                    color: isHot ? '#fca5a5' : '#67e8f9',
                  }}
                >
                  {n}
                  {i < 3 && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center font-black"
                      style={{ background: '#fbbf24', color: '#000', fontSize: 7 }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs mt-4" style={{ color: 'rgba(250,245,240,0.2)' }}>
        Based on last {gameType === 'toto' ? '6' : '5'} draws · Past frequency does not guarantee future results
      </p>
    </div>
  )
}
