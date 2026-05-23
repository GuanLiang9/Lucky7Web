import React from 'react'

const games = [
  {
    id: '4d',
    label: '4D',
    chinese: '四维',
    description: 'Pick 4 digits',
    range: '0000 – 9999',
    draws: 'Wed · Sat · Sun',
    icon: '🎰',
    prize: 'Up to S$2,000',
    prizeNote: 'per S$1 Big Bet',
    activeStyle: {
      background: 'rgba(220,38,38,0.18)',
      borderColor: 'rgba(220,38,38,0.6)',
      boxShadow: '0 0 30px rgba(220,38,38,0.15)',
    },
    activeLabelColor: '#f87171',
    dot: '#dc2626',
  },
  {
    id: 'toto',
    label: 'TOTO',
    chinese: '多多',
    description: 'Pick 6 numbers',
    range: '1 – 49',
    draws: 'Mon · Thu',
    icon: '🎱',
    prize: 'S$3.2M Jackpot',
    prizeNote: 'Current pool',
    activeStyle: {
      background: 'rgba(251,191,36,0.12)',
      borderColor: 'rgba(251,191,36,0.5)',
      boxShadow: '0 0 30px rgba(251,191,36,0.12)',
    },
    activeLabelColor: '#fbbf24',
    dot: '#fbbf24',
  },
  {
    id: 'both',
    label: 'Both',
    chinese: '全部',
    description: '4D + TOTO',
    range: 'Maximum luck',
    draws: 'All draw days',
    icon: '🧧',
    prize: 'Double chances',
    prizeNote: 'Combined fortune',
    activeStyle: {
      background: 'rgba(249,115,22,0.15)',
      borderColor: 'rgba(249,115,22,0.5)',
      boxShadow: '0 0 30px rgba(249,115,22,0.12)',
    },
    activeLabelColor: '#fb923c',
    dot: '#f97316',
  },
]

export default function GameSelector({ selected, onSelect }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-14">
      <div className="text-center mb-8">
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(251,191,36,0.5)' }}>步骤一 · Step 1 · Required</div>
        <h2 className="text-3xl font-black" style={{ color: '#faf5f0' }}>Choose Your Game</h2>
        <div className="gold-line w-24 mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {games.map(game => {
          const isSelected = selected === game.id
          return (
            <button
              key={game.id}
              onClick={() => onSelect(game.id)}
              className="relative rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.02] flex sm:block items-center gap-4"
              style={{
                background: isSelected ? game.activeStyle.background : 'rgba(220,38,38,0.06)',
                border: `1px solid ${isSelected ? game.activeStyle.borderColor : 'rgba(220,38,38,0.15)'}`,
                boxShadow: isSelected ? game.activeStyle.boxShadow : 'none',
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-2 h-2 rounded-full"
                  style={{ background: game.dot, animation: 'goldPulse 2s ease-in-out infinite', boxShadow: `0 0 8px ${game.dot}` }}
                />
              )}

              <div className="text-3xl sm:mb-3 flex-shrink-0">{game.icon}</div>

              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span
                    className="text-xl sm:text-2xl font-black"
                    style={{ color: isSelected ? game.activeLabelColor : '#faf5f0' }}
                  >
                    {game.label}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(251,191,36,0.35)' }}>{game.chinese}</span>
                </div>

                <div className="text-xs mb-0.5" style={{ color: 'rgba(250,245,240,0.45)' }}>{game.description}</div>
                <div className="text-xs font-mono" style={{ color: 'rgba(250,245,240,0.3)' }}>{game.range}</div>

                <div className="hidden sm:block text-xs mt-3 pt-2" style={{ color: 'rgba(250,245,240,0.25)', borderTop: '1px solid rgba(251,191,36,0.08)' }}>
                  {game.draws}
                </div>
                <div className="hidden sm:block mt-2">
                  <div className="text-xs font-bold" style={{ color: isSelected ? game.activeLabelColor : 'rgba(251,191,36,0.35)' }}>
                    {game.prize}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(250,245,240,0.2)' }}>{game.prizeNote}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
