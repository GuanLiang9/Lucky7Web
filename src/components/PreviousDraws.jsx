import React, { useState } from 'react'
import { previousDraws4D, previousDrawsToto } from '../data/previousDraws.js'

function FourDDrawCard({ draw }) {
  const [showAll, setShowAll] = useState(false)

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>{draw.day} · Draw #{draw.drawNo}</div>
          <div className="text-sm font-bold" style={{ color: '#faf5f0' }}>{draw.date}</div>
        </div>
        <span
          className="text-xs rounded-full px-3 py-1 font-bold uppercase tracking-wider"
          style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171' }}
        >
          4D
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {[
          { label: '1st Prize', number: draw.first,  color: '#fbbf24', icon: '🥇' },
          { label: '2nd Prize', number: draw.second, color: '#9ca3af', icon: '🥈' },
          { label: '3rd Prize', number: draw.third,  color: '#d97706', icon: '🥉' },
        ].map(p => (
          <div key={p.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{p.icon}</span>
              <span className="text-xs" style={{ color: 'rgba(250,245,240,0.4)' }}>{p.label}</span>
            </div>
            <span
              className="font-black text-2xl tracking-[0.2em]"
              style={{ color: p.color, fontVariantNumeric: 'tabular-nums' }}
            >
              {p.number}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAll(v => !v)}
        className="text-xs w-full text-center py-2 transition-colors hover:opacity-80"
        style={{
          borderTop: '1px solid rgba(251,191,36,0.08)',
          color: 'rgba(251,191,36,0.4)',
        }}
      >
        {showAll ? '▲ Hide prizes' : '▼ Show Starter & Consolation'}
      </button>

      {showAll && (
        <div className="mt-3 space-y-2">
          {[
            { label: 'Starter', items: draw.starters },
            { label: 'Consolation', items: draw.consolation },
          ].map(group => (
            <div key={group.label}>
              <div className="text-xs mb-1.5" style={{ color: 'rgba(250,245,240,0.3)' }}>{group.label} Prizes</div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(n => (
                  <span
                    key={n}
                    className="text-xs font-mono rounded px-2 py-0.5 tracking-wider"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(250,245,240,0.4)' }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TotoDrawCard({ draw }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>{draw.day} · Draw #{draw.drawNo}</div>
          <div className="text-sm font-bold" style={{ color: '#faf5f0' }}>{draw.date}</div>
        </div>
        <span
          className="text-xs rounded-full px-3 py-1 font-bold uppercase tracking-wider"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
        >
          TOTO
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {draw.numbers.map(n => (
          <div
            key={n}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
            style={{
              background: 'rgba(251,191,36,0.1)',
              border: '1px solid rgba(251,191,36,0.35)',
              color: '#fde68a',
            }}
          >
            {n}
          </div>
        ))}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
          style={{
            background: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.4)',
            color: '#fca5a5',
          }}
          title="Bonus number"
        >
          {draw.bonus}
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3 text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>
        <span>Bonus:</span>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.35)', color: '#fca5a5' }}
        >
          {draw.bonus}
        </div>
      </div>

      <div
        className="space-y-1.5 pt-3"
        style={{ borderTop: '1px solid rgba(251,191,36,0.08)' }}
      >
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'rgba(250,245,240,0.35)' }}>Jackpot Prize</span>
          <span className="font-bold" style={{ color: '#fbbf24' }}>{draw.jackpot}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'rgba(250,245,240,0.35)' }}>Group 1 Winners</span>
          <span className="font-bold" style={{ color: draw.winners > 0 ? '#fbbf24' : 'rgba(250,245,240,0.2)' }}>
            {draw.winners === 0 ? 'No winner — jackpot rolls over' : draw.winners}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function PreviousDraws() {
  const [tab, setTab] = useState('4d')

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black" style={{ color: '#faf5f0' }}>Recent Results</h3>
        <div className="flex gap-2">
          {[
            { id: '4d',   label: '4D',   activeColor: '#f87171', activeBg: 'rgba(220,38,38,0.15)',   activeBorder: 'rgba(220,38,38,0.45)' },
            { id: 'toto', label: 'TOTO', activeColor: '#fbbf24', activeBg: 'rgba(251,191,36,0.12)',  activeBorder: 'rgba(251,191,36,0.4)' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
              style={tab === t.id ? {
                background: t.activeBg,
                border: `1px solid ${t.activeBorder}`,
                color: t.activeColor,
              } : {
                background: 'rgba(220,38,38,0.05)',
                border: '1px solid rgba(220,38,38,0.12)',
                color: 'rgba(250,245,240,0.3)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {tab === '4d'
          ? previousDraws4D.map(d => <FourDDrawCard key={d.drawNo} draw={d} />)
          : previousDrawsToto.map(d => <TotoDrawCard key={d.drawNo} draw={d} />)
        }
      </div>

      <p className="mt-4 text-xs text-center" style={{ color: 'rgba(250,245,240,0.15)' }}>
        Sample data for reference · singaporepools.com.sg for official results
      </p>
    </div>
  )
}
