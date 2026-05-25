import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  generate4DNumbers,
  generateTotoNumbers,
  regenerateSingle4DDigit,
  regenerateSingleTotoNumber,
  predictNumbers4D,
  predictNumbersToto,
} from '../utils/numberGenerator.js'

// 4D: Sun=0, Wed=3, Sat=6 | TOTO: Mon=1, Thu=4
function nextDrawDate(days) {
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (days.includes(d.getDay())) return d
  }
}
function fmtShort(d) {
  return d.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' })
}
function nextDrawNo(draws, drawDays) {
  if (!draws?.length) return null
  const last = draws[0]
  const lastDate = new Date(last.date)
  const next = nextDrawDate(drawDays)
  let count = 0
  const d = new Date(lastDate)
  d.setDate(d.getDate() + 1)
  while (d <= next) {
    if (drawDays.includes(d.getDay())) count++
    d.setDate(d.getDate() + 1)
  }
  return String(parseInt(last.drawNo) + count)
}
function nextJackpot(drawsToto) {
  if (!drawsToto?.length) return 'S$1,000,000+'
  const last = drawsToto[0]
  return last.winners ? 'S$1,000,000+' : last.jackpot + '+'
}

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
    const updated = regenerateSingle4DDigit(number, pos, mood, dreams, draws4D)
    onUpdate(setIndex, updated)
  }

  return (
    <div className="glass-strong rounded-2xl p-4 text-center overflow-hidden">
      <div className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(251,191,36,0.5)' }}>
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

// One row of 6 TOTO numbers. Tracks swapping by VALUE so re-sorting after
// a swap doesn't animate the wrong ball.
function TotoSetRow({ numbers, setIndex, mood, dreams, drawsToto, onUpdate }) {
  const [swappingValue, setSwappingValue] = useState(null)

  const handleSwap = (index) => {
    if (swappingValue !== null) return
    const value = numbers[index]
    setSwappingValue(value)
    setTimeout(() => {
      const updated = regenerateSingleTotoNumber(numbers, index, mood, dreams, drawsToto)
      onUpdate(setIndex, updated)
      setSwappingValue(null)
    }, 400)
  }

  const setLabels = ['福 Lucky', '发 Bonus', '财 Wealth', '喜 Fortune']
  const label = setLabels[setIndex] || `Line ${setIndex + 1}`

  return (
    <div className="glass-strong rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div
          className="text-xs font-bold uppercase tracking-widest shrink-0 text-right"
          style={{ color: 'rgba(251,191,36,0.55)', minWidth: '3.5rem' }}
        >
          {label}
        </div>
        <div className="flex gap-2 flex-wrap flex-1 justify-center sm:justify-start">
          {numbers.map((n, i) => (
            <button
              key={n}
              onClick={() => handleSwap(i)}
              className="toto-ball w-11 h-11 sm:w-12 sm:h-12 rounded-full font-black text-base sm:text-lg flex items-center justify-center transition-all active:scale-95"
              style={swappingValue === n ? { opacity: 0.4, animation: 'spin 0.4s linear' } : {}}
              title="Click to swap"
            >
              <span className="gradient-text-gold">{n}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="text-xs text-center mt-2" style={{ color: 'rgba(250,245,240,0.2)' }}>
        click any number to swap
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
        <div className="text-7xl" style={{ display: 'inline-block', animation: 'float 2s ease-in-out infinite' }}>
          {symbols[frame]}
        </div>
        <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(220,38,38,0.4)', animation: 'ripple 1.5s ease-out infinite' }} />
      </div>
      <div className="text-lg font-semibold" style={{ color: '#fbbf24' }}>Reading the cosmic signs...</div>
      <div className="mt-2 text-sm" style={{ color: 'rgba(250,245,240,0.3)' }}>Channelling your fortune</div>
    </div>
  )
}

function PredictionPanel({ gameType, pred4D, predToto, mood, dreams }) {
  const hasMood = Boolean(mood)
  const dreamCount = dreams?.length || 0
  const influenced = hasMood || dreamCount > 0

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(99,62,180,0.06)', border: '1px solid rgba(139,92,246,0.18)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.1)', background: 'rgba(99,62,180,0.06)' }}
      >
        <span className="text-base">🔮</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold" style={{ color: '#c4b5fd' }}>Prize Prediction · 奖号预测</div>
          <div className="text-xs truncate" style={{ color: 'rgba(250,245,240,0.3)' }}>
            {pred4D || predToto
              ? `${pred4D?.drawsAnalyzed || predToto?.drawsAnalyzed || 0} draws analysed`
              : 'Insufficient draw history'}
            {influenced && (
              <span style={{ color: 'rgba(196,181,253,0.6)' }}>
                {hasMood ? ` · ${mood.emoji} ${mood.label}` : ''}
                {dreamCount > 0 ? ` · ${dreamCount} dream${dreamCount > 1 ? 's' : ''}` : ''}
              </span>
            )}
          </div>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.12)', color: 'rgba(196,181,253,0.8)', border: '1px solid rgba(139,92,246,0.25)' }}
        >
          {influenced ? 'Personalised' : 'Statistical'}
        </span>
      </div>

      {/* 4D prediction */}
      {pred4D && (gameType === '4d' || gameType === 'both') && (
        <div className="px-5 pt-4 pb-3">
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(196,181,253,0.5)' }}>
            4D · Pattern Prediction
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {pred4D.numbers.map((n, i) => (
              <div
                key={i}
                className="rounded-xl px-3 py-1.5 font-black text-lg"
                style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  color: '#c4b5fd',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.05em',
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <div className="flex gap-5 text-xs">
            <div className="flex items-center gap-1.5">
              <span>🔥</span>
              <span style={{ color: 'rgba(250,245,240,0.35)' }}>Trending:</span>
              <span style={{ color: 'rgba(251,191,36,0.7)' }}>{pred4D.hot.join(' · ')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>❄️</span>
              <span style={{ color: 'rgba(250,245,240,0.35)' }}>Overdue:</span>
              <span style={{ color: 'rgba(147,197,253,0.7)' }}>{pred4D.cold.join(' · ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Divider between 4D and TOTO */}
      {pred4D && predToto && gameType === 'both' && (
        <div style={{ height: 1, background: 'rgba(139,92,246,0.08)', margin: '0 20px' }} />
      )}

      {/* TOTO prediction */}
      {predToto && (gameType === 'toto' || gameType === 'both') && (
        <div className="px-5 pt-4 pb-3">
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(196,181,253,0.5)' }}>
            TOTO · Predicted Numbers
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {predToto.numbers.map((n, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd' }}
              >
                {n}
              </div>
            ))}
          </div>
          <div className="flex gap-5 text-xs">
            <div className="flex items-center gap-1.5">
              <span>🔥</span>
              <span style={{ color: 'rgba(250,245,240,0.35)' }}>Hot:</span>
              <span style={{ color: 'rgba(251,191,36,0.7)' }}>{predToto.hot.join(' · ')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>❄️</span>
              <span style={{ color: 'rgba(250,245,240,0.35)' }}>Overdue:</span>
              <span style={{ color: 'rgba(147,197,253,0.7)' }}>{predToto.cold.join(' · ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div
        className="px-5 py-2.5 text-xs"
        style={{ borderTop: '1px solid rgba(139,92,246,0.08)', background: 'rgba(0,0,0,0.12)', color: 'rgba(250,245,240,0.18)' }}
      >
        Statistical pattern analysis only — lottery draws are truly random events.
      </div>
    </div>
  )
}

export default function NumberDisplay({ gameType, mood, dreams, visible, regenerateKey, draws4D, drawsToto, sessionSeed }) {
  const [fourDNumbers, setFourDNumbers] = useState([])
  const [totoSets, setTotoSets] = useState([])
  const [totoSetCount, setTotoSetCount] = useState(2)
  const totoSetCountRef = useRef(2)
  const [generating, setGenerating] = useState(false)

  const pred4D = useMemo(
    () => (gameType === '4d' || gameType === 'both') ? predictNumbers4D(draws4D, mood, dreams) : null,
    [gameType, draws4D, mood, dreams]
  )
  const predToto = useMemo(
    () => (gameType === 'toto' || gameType === 'both') ? predictNumbersToto(drawsToto, mood, dreams) : null,
    [gameType, drawsToto, mood, dreams]
  )

  const generate = useCallback(() => {
    setGenerating(true)
    setFourDNumbers([])
    setTotoSets([])
    setTimeout(() => {
      if (gameType === '4d' || gameType === 'both')
        setFourDNumbers(generate4DNumbers(mood, dreams, draws4D, regenerateKey, sessionSeed))
      if (gameType === 'toto' || gameType === 'both') {
        const count = totoSetCountRef.current
        setTotoSets(
          Array.from({ length: count }, (_, i) =>
            generateTotoNumbers(mood, dreams, drawsToto, regenerateKey * 10 + i, sessionSeed)
          )
        )
      }
      setGenerating(false)
    }, 1600)
  }, [gameType, mood, dreams, draws4D, drawsToto, regenerateKey, sessionSeed])

  useEffect(() => {
    if (visible) generate()
  }, [visible, generate])

  const handleSetCountChange = (count) => {
    totoSetCountRef.current = count
    setTotoSetCount(count)
    if (totoSets.length === 0) return
    if (count > totoSets.length) {
      const extra = Array.from({ length: count - totoSets.length }, (_, i) =>
        generateTotoNumbers(mood, dreams, drawsToto, regenerateKey * 10 + totoSets.length + i + 50, sessionSeed)
      )
      setTotoSets(prev => [...prev, ...extra])
    } else {
      setTotoSets(prev => prev.slice(0, count))
    }
  }

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
                <span className="text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>
                  {fmtShort(nextDrawDate([0,3,6]))} · Draw #{nextDrawNo(draws4D, [0,3,6])}
                </span>
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
                style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.1)', color: 'rgba(250,245,240,0.35)' }}
              >
                <strong style={{ color: 'rgba(250,245,240,0.5)' }}>Big Bet</strong> — any of 23 winning numbers &nbsp;|&nbsp;
                <strong style={{ color: 'rgba(250,245,240,0.5)' }}>Small Bet</strong> — top 3 prizes only
              </div>
            </div>
          )}

          {/* TOTO */}
          {(gameType === 'toto' || gameType === 'both') && totoSets.length > 0 && (
            <div>
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                    style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24' }}
                  >
                    TOTO Numbers
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(250,245,240,0.3)' }}>
                    Jackpot {nextJackpot(drawsToto)} · Next draw: {fmtShort(nextDrawDate([1,4]))}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4].map(n => (
                    <button
                      key={n}
                      onClick={() => handleSetCountChange(n)}
                      className="rounded-full px-3 py-1 text-xs font-bold transition-all"
                      style={totoSetCount === n ? {
                        background: 'rgba(251,191,36,0.2)',
                        border: '1px solid rgba(251,191,36,0.6)',
                        color: '#fbbf24',
                      } : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(250,245,240,0.4)',
                      }}
                    >
                      Match {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {totoSets.map((numbers, setIdx) => (
                  <TotoSetRow
                    key={setIdx}
                    numbers={numbers}
                    setIndex={setIdx}
                    mood={mood}
                    dreams={dreams}
                    drawsToto={drawsToto}
                    onUpdate={(idx, updated) =>
                      setTotoSets(prev => { const s = [...prev]; s[idx] = updated; return s })
                    }
                  />
                ))}
              </div>
              <div
                className="mt-3 rounded-xl p-3 text-center"
                style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' }}
              >
                <p className="text-xs" style={{ color: 'rgba(250,245,240,0.4)' }}>Match 3+ numbers to win · Bonus ball drawn separately</p>
              </div>
            </div>
          )}

          {/* Prize prediction panel */}
          {(pred4D || predToto) && (
            <PredictionPanel
              gameType={gameType}
              pred4D={pred4D}
              predToto={predToto}
              mood={mood}
              dreams={dreams}
            />
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
