import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  generate4DNumbers,
  generateTotoNumbers,
  generateSystemRollNumbers,
  generateTotoMatchNumbers,
  regenerateSingle4DDigit,
  regenerateSingleTotoNumber,
  predictNumbers4D,
  predictNumbersToto,
} from '../utils/numberGenerator.js'
import { t } from '../data/translations.js'

// ── Draw-date helpers ─────────────────────────────────────────────────────────

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
  const next = nextDrawDate(drawDays)
  let count = 0
  const d = new Date(last.date)
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

// ── Jackpot slot reel ────────────────────────────────────────────────────────
// Phases: waiting → fast (50ms) → slowing (140ms) → countdown (3 lead-in digits) → locked
// The "countdown" rolls through the 3 preceding digits before snapping to the final.

function SlotReel({ finalDigit, spinDelay, onRefresh, position, interactive }) {
  const [display,  setDisplay]  = useState('0')
  const [phase,    setPhase]    = useState('waiting')
  const [flipping, setFlipping] = useState(false)
  const fd = parseInt(finalDigit)

  useEffect(() => {
    setDisplay('0')
    setPhase('waiting')
    const timers = [], ivals = []
    const cleanup = () => { timers.forEach(clearTimeout); ivals.forEach(clearInterval) }

    timers.push(setTimeout(() => {
      setPhase('fast')
      const fast = setInterval(() => setDisplay(String(Math.floor(Math.random() * 10))), 50)
      ivals.push(fast)

      timers.push(setTimeout(() => {
        clearInterval(fast)
        setPhase('slowing')
        const slow = setInterval(() => setDisplay(String(Math.floor(Math.random() * 10))), 140)
        ivals.push(slow)

        timers.push(setTimeout(() => {
          clearInterval(slow)
          setPhase('countdown')
          setDisplay(String((fd + 7) % 10))                                          // −3
          timers.push(setTimeout(() => setDisplay(String((fd + 8) % 10)), 210))     // −2
          timers.push(setTimeout(() => setDisplay(String((fd + 9) % 10)), 430))     // −1
          timers.push(setTimeout(() => { setDisplay(finalDigit); setPhase('locked') }, 660))
        }, 600))
      }, 850))
    }, spinDelay))

    return cleanup
  }, [finalDigit, spinDelay, fd])

  const handleClick = () => {
    if (!interactive || phase !== 'locked' || flipping) return
    setFlipping(true)
    setTimeout(() => { onRefresh(position); setFlipping(false) }, 380)
  }

  const isLocked = phase === 'locked'

  return (
    <div className="group flex flex-col items-center gap-2"
      onClick={handleClick}
      style={{ cursor: interactive && isLocked ? 'pointer' : 'default' }}>

      {/* Reel window — slot-machine dark frame with gradient overlays */}
      <div style={{
        position: 'relative', width: 66, height: 86,
        background: 'linear-gradient(180deg,#0c0303 0%,#1c0606 50%,#0c0303 100%)',
        borderRadius: 13,
        border: `2px solid ${isLocked ? 'rgba(251,191,36,0.75)' : 'rgba(251,191,36,0.18)'}`,
        boxShadow: isLocked
          ? '0 0 28px rgba(251,191,36,0.4),0 0 8px rgba(220,38,38,0.2),inset 0 0 14px rgba(0,0,0,0.7)'
          : 'inset 0 0 14px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        transition: 'border-color 0.4s,box-shadow 0.5s',
        opacity: phase === 'waiting' ? 0 : 1,
      }}>
        {/* Top/bottom fade — creates the "viewing window" illusion */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to bottom,rgba(8,2,2,0.88) 0%,transparent 30%,transparent 70%,rgba(8,2,2,0.88) 100%)',
        }} />
        {/* Payline guides */}
        <div style={{ position:'absolute', left:7, right:7, top:'calc(50% - 20px)', height:1, background:'rgba(251,191,36,0.38)', zIndex:3 }} />
        <div style={{ position:'absolute', left:7, right:7, top:'calc(50% + 19px)', height:1, background:'rgba(251,191,36,0.38)', zIndex:3 }} />
        {/* Digit */}
        <div style={{ position:'absolute', inset:0, zIndex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{
            fontSize: '3rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums',
            color: isLocked ? '#fde68a' : '#fbbf24',
            filter: phase==='fast' ? 'blur(4px)' : phase==='slowing' ? 'blur(2px)' : phase==='countdown' ? 'blur(0.6px)' : 'none',
            transition: 'filter 0.2s,color 0.3s',
            animation: isLocked && !flipping ? 'slotLand 0.38s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
            ...(flipping && { opacity:0.4, transform:'scaleY(0.1)', transition:'transform 0.19s ease,opacity 0.19s' }),
          }}>
            {display}
          </span>
        </div>
      </div>

      {interactive && isLocked && (
        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:'rgba(251,191,36,0.55)' }}>
          tap
        </span>
      )}
    </div>
  )
}

// ── Confetti burst ────────────────────────────────────────────────────────────

function Confetti({ active }) {
  const particles = useMemo(() => {
    if (!active) return []
    const cols = ['#dc2626','#fbbf24','#f97316','#fde68a','#ef4444','#fcd34d','#fb923c','#fca5a5','#fed7aa']
    return Array.from({ length: 75 }, (_, i) => ({
      id: i,
      x:        Math.random() * 100,
      color:    cols[Math.floor(Math.random() * cols.length)],
      size:     Math.random() * 9 + 5,
      aspect:   Math.random() > 0.45 ? 1 : Math.random() * 2.2 + 0.4,
      circular: Math.random() > 0.55,
      delay:    Math.random() * 0.9,
      duration: Math.random() * 1.8 + 2.2,
    }))
  }, [active])

  if (!particles.length) return null
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, pointerEvents:'none', zIndex:998, overflow:'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left:`${p.x}%`, top:'-20px',
          width: p.size, height: p.size * p.aspect,
          background: p.color,
          borderRadius: p.circular ? '50%' : 3,
          animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
        }} />
      ))}
    </div>
  )
}

// ── Celebration overlay ───────────────────────────────────────────────────────

function CelebrationMessage({ active, lang }) {
  if (!active) return null
  return (
    <div style={{ position:'fixed', top:'32%', left:'50%', zIndex:999, pointerEvents:'none', animation:'celebrationPop 3.2s ease forwards' }}>
      <div style={{
        background: 'rgba(8,2,2,0.92)',
        border: '2px solid rgba(251,191,36,0.7)',
        borderRadius: 24, padding: '22px 44px', textAlign: 'center',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 0 80px rgba(251,191,36,0.35),0 0 30px rgba(220,38,38,0.2)',
      }}>
        <div style={{ fontSize:'2.8rem', marginBottom:10 }}>🎰 🎊 🎰</div>
        <div style={{ fontSize:'1.8rem', fontWeight:900, color:'#fbbf24', letterSpacing:'0.04em' }}>
          {lang === 'zh' ? '恭喜！' : 'Congratulations!'}
        </div>
        <div style={{ fontSize:'1.05rem', color:'rgba(250,245,240,0.6)', marginTop:6 }}>
          {lang === 'zh' ? '您的幸运数字已生成！' : 'Your lucky numbers are ready!'}
        </div>
      </div>
    </div>
  )
}

// ── Single 4D set ─────────────────────────────────────────────────────────────

function FourDSet({ number, mood, dreams, draws4D, onUpdate, revealDelay, interactive, lang }) {
  const digits = number.split('')

  const handleDigitRefresh = (pos) => {
    const updated = regenerateSingle4DDigit(number, pos, mood, dreams, draws4D)
    onUpdate(updated)
  }

  return (
    <div
      className="glass-strong rounded-2xl p-6 text-center overflow-hidden"
      style={{ animation: `setSlideIn 0.5s ease-out ${revealDelay}ms both` }}
    >
      <div className="text-base uppercase tracking-widest mb-5" style={{ color: 'rgba(251,191,36,0.5)' }}>
        {t('luckyPick', lang)}
      </div>
      <div className="flex gap-3 justify-center mb-4">
        {digits.map((d, i) => (
          <SlotReel
            key={i}
            finalDigit={d}
            spinDelay={revealDelay + i * 300}
            position={i}
            onRefresh={handleDigitRefresh}
            interactive={interactive}
          />
        ))}
      </div>
      <div className="text-sm mt-1" style={{ color: 'rgba(250,245,240,0.25)' }}>
        {interactive ? t('tapToChange', lang) : ''}
      </div>
    </div>
  )
}

// ── TOTO ball ─────────────────────────────────────────────────────────────────

function TotoBall({ number, index, onSwap, isSwapping, isRoll = false, delay = 0 }) {
  if (isRoll) {
    return (
      <div
        className="w-14 h-14 rounded-full font-black text-lg flex items-center justify-center"
        style={{
          background: 'rgba(139,92,246,0.18)',
          border: '2px solid rgba(139,92,246,0.55)',
          color: '#c4b5fd',
          animation: `ballReveal 0.5s cubic-bezier(0.175,0.885,0.32,1.275) ${delay}ms both`,
        }}
      >R</div>
    )
  }
  return (
    <button
      onClick={onSwap ? () => onSwap(index) : undefined}
      className="toto-ball w-14 h-14 rounded-full font-black text-xl flex items-center justify-center transition-all active:scale-95"
      style={{
        animation: `ballReveal 0.5s cubic-bezier(0.175,0.885,0.32,1.275) ${delay}ms both`,
        ...(isSwapping && { opacity: 0.4, animation: 'spin 0.4s linear' }),
      }}
      title={onSwap ? 'Click to swap' : undefined}
    >
      <span className="gradient-text-gold">{number}</span>
    </button>
  )
}

// ── TOTO result display ───────────────────────────────────────────────────────

const SYSTEM_ENTRY_COST = { 7: 7, 8: 28, 9: 84, 10: 210, 11: 462, 12: 924 }

function TotoResultDisplay({ totoResult, totoConfig, mood, dreams, zodiac, horoscope, drawsToto, onUpdate, interactive, revealKey, lang }) {
  const [swappingIndex, setSwappingIndex] = useState(null)

  const handleSwap = (index) => {
    if (!interactive || swappingIndex !== null || totoResult.type === 'system-roll') return
    setSwappingIndex(index)
    setTimeout(() => {
      const updated = regenerateSingleTotoNumber(totoResult.numbers, index, mood, dreams, drawsToto)
      onUpdate(updated)
      setSwappingIndex(null)
    }, 400)
  }

  const typeLabel = totoResult.type === 'match'
    ? (lang === 'zh' ? '多多配合' : 'TOTO Match')
    : totoResult.type === 'system-roll'
    ? (lang === 'zh' ? '系统滚动' : 'System Roll')
    : totoConfig.size === 6 ? t('totoOrdinary', lang) : `System ${totoConfig.size}`

  const count = totoConfig.count
  const costHint = totoResult.type === 'match'
    ? `Match ${count} · ${lang === 'zh' ? `若您的${count}个号码出现在开彩结果中则获奖` : `Pick ${count} ${count === 1 ? 'number' : 'numbers'} to appear in the draw result`}`
    : totoResult.type === 'system-roll'
    ? (lang === 'zh' ? '系统滚动 · S$1每注 · 由电脑为您选一个号码' : 'System Roll · S$1 per entry · Computer picks 1 number for you')
    : totoConfig.size === 6
    ? (lang === 'zh' ? '普通 · S$1每注' : 'Ordinary · S$1 per entry')
    : `System ${totoConfig.size} · S$${SYSTEM_ENTRY_COST[totoConfig.size] || '?'} per entry`

  const balls = totoResult.numbers
  const BALL_GAP = totoResult.type === 'match' ? 400 : 280

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-widest"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24' }}>
          {t('totoNumbers', lang)}
        </span>
        <span className="rounded-full px-3 py-1 text-sm font-semibold"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)', color: 'rgba(251,191,36,0.7)' }}>
          {typeLabel}
        </span>
        <span className="text-sm" style={{ color: 'rgba(250,245,240,0.3)' }}>
          {nextJackpot(drawsToto)} · {t('nextDraw', lang)} {fmtShort(nextDrawDate([1, 4]))}
        </span>
      </div>

      <div key={revealKey} className="glass-strong rounded-2xl p-6">
        <div className="flex gap-3 flex-wrap justify-center">
          {balls.map((n, i) => (
            <TotoBall key={i} number={n} index={i}
              onSwap={interactive ? handleSwap : null}
              isSwapping={swappingIndex === i}
              delay={i * BALL_GAP}
            />
          ))}
          {totoResult.type === 'system-roll' && (
            <TotoBall isRoll delay={balls.length * BALL_GAP} />
          )}
        </div>
        <div className="text-sm text-center mt-4" style={{ color: 'rgba(250,245,240,0.3)' }}>{costHint}</div>
        {interactive && totoResult.type !== 'system-roll' && (
          <div className="text-sm text-center mt-1" style={{ color: 'rgba(250,245,240,0.18)' }}>
            {t('clickToSwap', lang)}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl p-4 text-center"
        style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' }}>
        <p className="text-base" style={{ color: 'rgba(250,245,240,0.4)' }}>
          {totoResult.type === 'match'
            ? (lang === 'zh'
                ? `若您的${count}个号码出现在6+1开彩结果中则获奖`
                : `Win if your ${count} ${count === 1 ? 'number appears' : 'numbers all appear'} in the 6+1 draw result`)
            : t('match3plus', lang)}
        </p>
      </div>
    </div>
  )
}

// ── Generating spinner ────────────────────────────────────────────────────────

function GeneratingState({ fadingOut }) {
  const symbols = ['🔮', '🏮', '🧧', '🌟', '💫']
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f + 1) % symbols.length), 350)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="text-center py-28" style={fadingOut ? { animation: 'fadeOut 0.3s ease-out both' } : {}}>
      <div className="relative inline-block mb-6">
        <div className="text-8xl" style={{ display: 'inline-block', animation: 'float 2s ease-in-out infinite' }}>
          {symbols[frame]}
        </div>
        <div className="absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(220,38,38,0.4)', animation: 'ripple 1.5s ease-out infinite' }} />
      </div>
      <div className="text-2xl font-semibold" style={{ color: '#fbbf24' }}>Reading the cosmic signs...</div>
      <div className="mt-2 text-base" style={{ color: 'rgba(250,245,240,0.3)' }}>Channelling your fortune</div>
    </div>
  )
}

// ── Prize prediction panel ────────────────────────────────────────────────────

function PredictionPanel({ gameType, pred4D, predToto, mood, dreams, zodiac, horoscope, lang }) {
  const influenced = Boolean(mood) || (dreams?.length > 0) || Boolean(zodiac) || Boolean(horoscope)

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(99,62,180,0.06)', border: '1px solid rgba(139,92,246,0.18)' }}>
      <div className="px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.1)', background: 'rgba(99,62,180,0.06)' }}>
        <span className="text-xl">🔮</span>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold" style={{ color: '#c4b5fd' }}>{t('prizePrediction', lang)}</div>
          <div className="text-sm truncate" style={{ color: 'rgba(250,245,240,0.3)' }}>
            {pred4D || predToto ? `${pred4D?.drawsAnalyzed || predToto?.drawsAnalyzed || 0} ${t('drawsAnalysed', lang)}` : '—'}
            {influenced && (
              <span style={{ color: 'rgba(196,181,253,0.6)' }}>
                {zodiac ? ` · ${zodiac.emoji}` : ''}
                {horoscope ? ` ${horoscope.emoji}` : ''}
                {mood ? ` · ${mood.emoji}` : ''}
                {dreams?.length > 0 ? ` · ${dreams.length} dream${dreams.length > 1 ? 's' : ''}` : ''}
              </span>
            )}
          </div>
        </div>
        <span className="text-sm px-3 py-1 rounded-full flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.12)', color: 'rgba(196,181,253,0.8)', border: '1px solid rgba(139,92,246,0.25)' }}>
          {influenced ? t('personalised', lang) : t('statistical', lang)}
        </span>
      </div>

      {pred4D && (gameType === '4d' || gameType === 'both') && (
        <div className="px-5 pt-5 pb-4">
          <div className="text-sm uppercase tracking-widest mb-3" style={{ color: 'rgba(196,181,253,0.5)' }}>
            {t('pattern4D', lang)}
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {pred4D.numbers.map((n, i) => (
              <div key={i} className="rounded-xl px-4 py-2 font-black text-2xl"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
                  color: '#c4b5fd', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>
                {n}
              </div>
            ))}
          </div>
          <div className="flex gap-5 text-sm">
            <div className="flex items-center gap-2">
              <span>🔥</span>
              <span style={{ color: 'rgba(250,245,240,0.35)' }}>{t('trending', lang)}</span>
              <span style={{ color: 'rgba(251,191,36,0.7)' }}>{pred4D.hot.join(' · ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>❄️</span>
              <span style={{ color: 'rgba(250,245,240,0.35)' }}>{t('overdue', lang)}</span>
              <span style={{ color: 'rgba(147,197,253,0.7)' }}>{pred4D.cold.join(' · ')}</span>
            </div>
          </div>
        </div>
      )}

      {pred4D && predToto && gameType === 'both' && (
        <div style={{ height: 1, background: 'rgba(139,92,246,0.08)', margin: '0 20px' }} />
      )}

      {predToto && (gameType === 'toto' || gameType === 'both') && (
        <div className="px-5 pt-5 pb-4">
          <div className="text-sm uppercase tracking-widest mb-3" style={{ color: 'rgba(196,181,253,0.5)' }}>
            {t('predictedNums', lang)}
          </div>
          <div className="flex flex-wrap gap-3 mb-2">
            {predToto.numbers.map((n, i) => (
              <div key={i} className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base"
                style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd' }}>
                {n}
              </div>
            ))}
            {predToto.additionalNumber && (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base"
                style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', color: '#fca5a5' }}
                title="Predicted additional number"
              >
                {predToto.additionalNumber}
              </div>
            )}
          </div>
          {predToto.additionalNumber && (
            <div className="text-sm mb-3" style={{ color: 'rgba(250,245,240,0.25)' }}>
              <span style={{ color: 'rgba(220,38,38,0.6)' }}>●</span> {t('additionalNum', lang)}
            </div>
          )}
          <div className="flex gap-5 text-sm">
            <div className="flex items-center gap-2">
              <span>🔥</span>
              <span style={{ color: 'rgba(250,245,240,0.35)' }}>{t('hotLabel', lang)}</span>
              <span style={{ color: 'rgba(251,191,36,0.7)' }}>{predToto.hot.join(' · ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>❄️</span>
              <span style={{ color: 'rgba(250,245,240,0.35)' }}>{t('overdue', lang)}</span>
              <span style={{ color: 'rgba(147,197,253,0.7)' }}>{predToto.cold.join(' · ')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 py-3 text-sm"
        style={{ borderTop: '1px solid rgba(139,92,246,0.08)', background: 'rgba(0,0,0,0.12)', color: 'rgba(250,245,240,0.18)' }}>
        {t('statNote', lang)}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NumberDisplay({ gameType, mood, dreams, zodiac, horoscope, visible, regenerateKey, draws4D, drawsToto, sessionSeed, totoConfig, lang = 'en' }) {
  const [fourDNumber,      setFourDNumber]      = useState(null)
  const [totoResult,       setTotoResult]       = useState(null)
  const [generating,       setGenerating]       = useState(false)
  const [fadingOut,        setFadingOut]        = useState(false)
  const [interactive,      setInteractive]      = useState(false)
  const [revealKey,        setRevealKey]        = useState(0)
  const [showConfetti,     setShowConfetti]     = useState(false)
  const [showCelebration,  setShowCelebration]  = useState(false)

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
    setFadingOut(false)
    setInteractive(false)
    setFourDNumber(null)
    setTotoResult(null)
    setShowConfetti(false)
    setShowCelebration(false)

    setTimeout(() => {
      let fourd = null
      let toto  = null
      if (gameType === '4d' || gameType === 'both') {
        // Generate array but only show first (1 set for 4D)
        const nums = generate4DNumbers(mood, dreams, draws4D, regenerateKey, sessionSeed, zodiac, horoscope)
        fourd = nums[0]
      }
      if (gameType === 'toto' || gameType === 'both') {
        if (totoConfig.mode === 'ordinary') {
          if (totoConfig.size === 'system-roll') {
            const res = generateSystemRollNumbers(mood, dreams, drawsToto, regenerateKey, sessionSeed, zodiac, horoscope)
            toto = { type: 'system-roll', numbers: res.numbers }
          } else {
            const nums = generateTotoNumbers(mood, dreams, drawsToto, regenerateKey, sessionSeed, totoConfig.size, zodiac, horoscope)
            toto = { type: 'ordinary', numbers: nums }
          }
        } else {
          const nums = generateTotoMatchNumbers(mood, dreams, drawsToto, totoConfig.count, regenerateKey, sessionSeed, zodiac, horoscope)
          toto = { type: 'match', numbers: nums }
        }
      }

      setFadingOut(true)
      setTimeout(() => {
        setFourDNumber(fourd)
        setTotoResult(toto)
        setRevealKey(k => k + 1)
        setGenerating(false)
        setFadingOut(false)

        // Unlock + celebration timing
        // SlotReel: spinDelay per digit (i*300) + 850ms fast + 600ms slow + 660ms countdown = 2110ms per digit
        // Last digit (3) finishes at: 3*300 + 2110 = 3010ms
        const fourdReveal = fourd ? 3 * 300 + 850 + 600 + 660 + 200 : 0
        const ballCount   = toto ? toto.numbers.length + (toto.type === 'system-roll' ? 1 : 0) : 0
        const ballGap     = toto?.type === 'match' ? 400 : 280
        const totoReveal  = ballCount * ballGap + 700
        const unlockMs    = Math.max(totoReveal, fourdReveal)
        setTimeout(() => setInteractive(true), unlockMs)
        // Confetti + celebration fires after everything is revealed
        setTimeout(() => { setShowConfetti(true); setShowCelebration(true) }, unlockMs + 200)
        setTimeout(() => setShowConfetti(false),    unlockMs + 200 + 4500)
        setTimeout(() => setShowCelebration(false), unlockMs + 200 + 3400)
      }, 300)
    }, 1800)
  }, [gameType, mood, dreams, zodiac, horoscope, draws4D, drawsToto, regenerateKey, sessionSeed, totoConfig])

  useEffect(() => {
    if (visible) generate()
  }, [visible, generate])

  if (!visible) return null

  return (
    <>
    <Confetti active={showConfetti} />
    <CelebrationMessage active={showCelebration} lang={lang} />
    <div className="w-full max-w-3xl mx-auto px-6 mb-16" style={{ animation: 'slideUp 0.6s ease-out both' }}>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 mb-5"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
          <span className="text-xl">🏮</span>
          <span className="text-sm uppercase tracking-widest font-bold" style={{ color: '#fbbf24' }}>
            {t('fortuneTitle', lang)}
          </span>
          <span className="text-xl">🏮</span>
        </div>
        <h2 className="text-5xl font-black gradient-text-gold">天赐幸运</h2>
        <p className="text-base mt-2" style={{ color: 'rgba(250,245,240,0.3)' }}>{t('fortuneSubtitle', lang)}</p>
        <div className="gold-line w-32 mx-auto mt-4" />
      </div>

      {generating ? (
        <GeneratingState fadingOut={fadingOut} />
      ) : (
        <div className="space-y-8">

          {/* 4D — single set */}
          {(gameType === '4d' || gameType === 'both') && fourDNumber && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', color: '#f87171' }}>
                  {t('number4D', lang)}
                </span>
                <span className="text-sm" style={{ color: 'rgba(250,245,240,0.3)' }}>
                  {fmtShort(nextDrawDate([0, 3, 6]))} · Draw #{nextDrawNo(draws4D, [0, 3, 6])}
                </span>
              </div>
              <FourDSet
                key={revealKey}
                number={fourDNumber}
                mood={mood}
                dreams={dreams}
                draws4D={draws4D}
                revealDelay={0}
                interactive={interactive}
                lang={lang}
                onUpdate={(updated) => setFourDNumber(updated)}
              />
              <div className="mt-4 rounded-xl p-4 text-sm text-center"
                style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.1)', color: 'rgba(250,245,240,0.35)' }}>
                <strong style={{ color: 'rgba(250,245,240,0.5)' }}>{t('bigBet', lang)}</strong> — {t('bigBetDesc', lang)} &nbsp;|&nbsp;
                <strong style={{ color: 'rgba(250,245,240,0.5)' }}>{t('smallBet', lang)}</strong> — {t('smallBetDesc', lang)}
              </div>
            </div>
          )}

          {/* TOTO */}
          {(gameType === 'toto' || gameType === 'both') && totoResult && (
            <TotoResultDisplay
              totoResult={totoResult}
              totoConfig={totoConfig}
              mood={mood}
              dreams={dreams}
              zodiac={zodiac}
              horoscope={horoscope}
              drawsToto={drawsToto}
              interactive={interactive}
              revealKey={revealKey}
              lang={lang}
              onUpdate={(updated) => setTotoResult(prev => ({ ...prev, numbers: updated }))}
            />
          )}

          {/* Prize prediction */}
          {(pred4D || predToto) && (
            <PredictionPanel
              gameType={gameType}
              pred4D={pred4D}
              predToto={predToto}
              mood={mood}
              dreams={dreams}
              zodiac={zodiac}
              horoscope={horoscope}
              lang={lang}
            />
          )}

          {/* Disclaimer */}
          <div className="rounded-2xl p-5 text-center"
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-sm" style={{ color: 'rgba(250,245,240,0.2)' }}>
              {t('disclaimer', lang)}
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(250,245,240,0.12)' }}>
              {t('responsible', lang)}
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
