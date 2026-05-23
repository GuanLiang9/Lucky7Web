import React, { useState, useEffect, useCallback } from 'react'
import {
  generate4DNumbers,
  generateTotoNumbers,
  regenerateSingle4DDigit,
  regenerateSingleTotoNumber,
} from '../utils/numberGenerator.js'

function DigitCard({ digit, onRefresh, position }) {
  const [flipping, setFlipping] = useState(false)

  const handleClick = () => {
    if (flipping) return
    setFlipping(true)
    setTimeout(() => {
      onRefresh(position)
      setFlipping(false)
    }, 350)
  }

  return (
    <div className="group flex flex-col items-center gap-1">
      <div
        className="number-card rounded-lg flex items-center justify-center select-none"
        onClick={handleClick}
        style={{
          width: 44,
          height: 52,
          ...(flipping ? {
            transform: 'rotateY(90deg) scale(0.9)',
            transition: 'transform 0.175s ease',
            opacity: 0.5,
          } : {
            transition: 'transform 0.175s ease',
          }),
        }}
        title="Tap to change"
      >
        <span className="gradient-text-gold font-black text-2xl">{digit}</span>
      </div>
      <span
        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'rgba(251,191,36,0.5)' }}
      >
        tap
      </span>
    </div>
  )
}

function FourDSet({ number, setIndex, label, mood, dreams, draws4D, onUpdate }) {
  const digits = number.split('')

  const handleDigitRefresh = (pos) => {
    const updated = regenerateSingle4DDigit(number, pos, mood, dreams.map(d => d.seed), draws4D)
    onUpdate(setIndex, updated)
  }

  return (
    <div className="glass-strong rounded-2xl p-4 text-center overflow-hidden">
      <div
        className="text-xs uppercase tracking-widest mb-4"
        style={{ color: 'rgba(251,191,36,0.5)' }}
      >
        {label}
      </div>
      <div className="flex gap-1.5 justify-center mb-3">
        {digits.map((d, i) => (
          <DigitCard key={i} digit={d} position={i} onRefresh={handleDigitRefresh} />
        ))}
      </div>
      <div className="text-xs" style={{ color: 'rgba(250,245,240,0.25)' }}>tap any digit to change</div>
    </div>
  )
}

const TOTO_TOP3 = [
  { icon: '🥇', label: 'Top Pick 福', color: { bg: 'rgba(251,191,36,0.18)', border: 'rgba(251,191,36,0.55)', text: '#fbbf24', size: 68 } },
  { icon: '🥈', label: 'Top Pick 发', color: { bg: 'rgba(203,213,225,0.12)', border: 'rgba(203,213,225,0.4)',  text: '#cbd5e1', size: 60 } },
  { icon: '🥉', label: 'Top Pick 财', color: { bg: 'rgba(217,119,6,0.15)',  border: 'rgba(217,119,6,0.45)',   text: '#d97706', size: 60 } },
]

function TotoDisplay({ numbers, mood, dreams, drawsToto, onUpdate }) {
  const [swapping, setSwapping] = useState(null)

  const handleSwap = (index) => {
    if (swapping !== null) return
    setSwapping(index)
    setTimeout(() => {
      const updated = regenerateSingleTotoNumber(numbers, index, mood, dreams.map(d => d.seed), drawsToto)
      onUpdate(updated)
      setSwapping(null)
    }, 400)
  }

  const top3   = numbers.slice(0, 3)
  const others = numbers.slice(3)

  return (
    <div className="glass-strong rounded-2xl p-5">
      {/* Top 3 picks */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {top3.map((n, i) => {
          const meta = TOTO_TOP3[i]
          return (
            <button
              key={i}
              onClick={() => handleSwap(i)}
              className="flex flex-col items-center rounded-2xl p-3 sm:p-4 transition-all active:scale-95"
              style={{
                background: meta.color.bg,
                border: `1px solid ${meta.color.border}`,
                opacity: swapping === i ? 0.4 : 1,
                animation: swapping === i ? 'spin 0.4s linear' : undefined,
              }}
              title="Click to swap"
            >
              <span className="text-sm mb-1">{meta.icon}</span>
              <span
                className="font-black text-2xl sm:text-3xl leading-none mb-1.5"
                style={{ color: meta.color.text, fontVariantNumeric: 'tabular-nums' }}
              >
                {n}
              </span>
              <span className="text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>
                {meta.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Remaining 3 picks */}
      <div
        className="rounded-xl p-3 mb-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="text-xs uppercase tracking-widest text-center mb-3" style={{ color: 'rgba(251,191,36,0.4)' }}>
          Additional Picks
        </div>
        <div className="flex justify-center gap-2">
          {others.map((n, i) => (
            <button
              key={i + 3}
              onClick={() => handleSwap(i + 3)}
              className="toto-ball w-11 h-11 sm:w-12 sm:h-12 rounded-full font-black text-base sm:text-lg flex items-center justify-center"
              style={swapping === i + 3 ? { opacity: 0.4, animation: 'spin 0.4s linear' } : {}}
              title="Click to swap"
            >
              <span className="gradient-text-gold">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-center mb-3" style={{ color: 'rgba(250,245,240,0.2)' }}>
        click any number to swap it
      </div>
      <div
        className="rounded-xl p-3 text-center"
        style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' }}
      >
        <p className="text-xs" style={{ color: 'rgba(250,245,240,0.4)' }}>Match 3+ numbers to win · Bonus ball drawn separately</p>
      </div>
    </div>
  )
}

function GeneratingState() {
  const symbols = ['🔮', '🏮', '🧧', '🌟', '💫']
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f + 1) % symbols.length), 350)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="text-center py-24">
      <div className="relative inline-block mb-6">
        <div
          className="text-7xl"
          style={{ display: 'inline-block', animation: 'float 2s ease-in-out infinite' }}
        >
          {symbols[frame]}
        </div>
        {/* Ripple */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid rgba(220,38,38,0.4)',
            animation: 'ripple 1.5s ease-out infinite',
          }}
        />
      </div>
      <div className="text-lg font-semibold" style={{ color: '#fbbf24' }}>Reading the cosmic signs...</div>
      <div className="mt-2 text-sm" style={{ color: 'rgba(250,245,240,0.3)' }}>Channelling your fortune</div>
    </div>
  )
}

export default function NumberDisplay({ gameType, mood, dreams, visible, regenerateKey, draws4D, drawsToto }) {
  const [fourDNumbers, setFourDNumbers] = useState([])
  const [totoNumbers, setTotoNumbers] = useState([])
  const [generating, setGenerating] = useState(false)

  const generate = useCallback(() => {
    setGenerating(true)
    setFourDNumbers([])
    setTotoNumbers([])
    setTimeout(() => {
      const dreamSeeds = dreams.map(d => d.seed)
      if (gameType === '4d' || gameType === 'both') setFourDNumbers(generate4DNumbers(mood, dreamSeeds, draws4D, regenerateKey))
      if (gameType === 'toto' || gameType === 'both') setTotoNumbers(generateTotoNumbers(mood, dreamSeeds, drawsToto, regenerateKey))
      setGenerating(false)
    }, 1600)
  }, [gameType, mood, dreams, draws4D, drawsToto, regenerateKey])

  useEffect(() => {
    if (visible) generate()
  }, [visible, regenerateKey])

  if (!visible) return null

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-16" style={{ animation: 'slideUp 0.6s ease-out both' }}>
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-4"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}
        >
          <span className="text-sm">🏮</span>
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: '#fbbf24' }}>
            Your Fortune Numbers
          </span>
          <span className="text-sm">🏮</span>
        </div>
        <h2 className="text-4xl font-black gradient-text-gold">天赐幸运</h2>
        <p className="text-sm mt-1" style={{ color: 'rgba(250,245,240,0.3)' }}>Heavenly Fortune · Personalised for you today</p>
        <div className="gold-line w-32 mx-auto mt-3" />
      </div>

      {generating ? (
        <GeneratingState />
      ) : (
        <div className="space-y-6">
          {/* 4D */}
          {(gameType === '4d' || gameType === 'both') && fourDNumbers.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', color: '#f87171' }}
                >
                  4D Numbers
                </span>
                <span className="text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>Next draw: Wed 25 May · Draw #4569</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fourDNumbers.map((num, i) => (
                  <FourDSet
                    key={i}
                    number={num}
                    setIndex={i}
                    label={['Lucky Pick 福', 'Alternate 发', 'Alternate 财'][i]}
                    mood={mood}
                    dreams={dreams}
                    draws4D={draws4D}
                    onUpdate={(idx, updated) =>
                      setFourDNumbers(prev => { const n = [...prev]; n[idx] = updated; return n })
                    }
                  />
                ))}
              </div>
              <div
                className="mt-3 rounded-xl p-3 text-xs text-center"
                style={{
                  background: 'rgba(220,38,38,0.05)',
                  border: '1px solid rgba(220,38,38,0.1)',
                  color: 'rgba(250,245,240,0.35)',
                }}
              >
                <strong style={{ color: 'rgba(250,245,240,0.5)' }}>Big Bet</strong> — any of 23 winning numbers &nbsp;|&nbsp;
                <strong style={{ color: 'rgba(250,245,240,0.5)' }}>Small Bet</strong> — top 3 prizes only
              </div>
            </div>
          )}

          {/* TOTO */}
          {(gameType === 'toto' || gameType === 'both') && totoNumbers.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24' }}
                >
                  TOTO Numbers
                </span>
                <span className="text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>
                  Jackpot S$3,200,000 · Next draw: Thu 26 May
                </span>
              </div>
              <TotoDisplay numbers={totoNumbers} mood={mood} dreams={dreams} drawsToto={drawsToto} onUpdate={setTotoNumbers} />
            </div>
          )}

          {/* Disclaimer */}
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(250,245,240,0.2)' }}>
              Lucky7 generates numbers for <strong style={{ color: 'rgba(250,245,240,0.35)' }}>entertainment only</strong>. Lottery draws are independent random events.
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(250,245,240,0.12)' }}>
              18+ only · Please gamble responsibly · Singapore Pools is the sole authorised operator
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
