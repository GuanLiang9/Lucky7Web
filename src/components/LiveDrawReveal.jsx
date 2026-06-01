import React, { useState, useEffect } from 'react'

// Single digit that cycles randomly before landing on the real digit
function RollingDigit({ digit, cycles }) {
  const [display, setDisplay] = useState(String(Math.floor(Math.random() * 10)))
  const [done, setDone] = useState(false)

  useEffect(() => {
    let count = 0
    const id = setInterval(() => {
      count++
      if (count >= cycles) {
        clearInterval(id)
        setDisplay(digit)
        setDone(true)
      } else {
        setDisplay(String(Math.floor(Math.random() * 10)))
      }
    }, 75)
    return () => clearInterval(id)
  }, [digit, cycles])

  return (
    <span style={{
      display: 'inline-block',
      minWidth: '0.8ch',
      fontVariantNumeric: 'tabular-nums',
      animation: done ? 'slotLand 0.35s ease-out both' : 'none',
    }}>
      {display}
    </span>
  )
}

// 4D prize row — reveals when `active` becomes true
const PRIZES = [
  { key: 'first',  icon: '🥇', label: '1st Prize', color: '#fbbf24' },
  { key: 'second', icon: '🥈', label: '2nd Prize', color: '#9ca3af' },
  { key: 'third',  icon: '🥉', label: '3rd Prize', color: '#d97706' },
]

function FourDContent({ draw, count }) {
  return (
    <div>
      {PRIZES.map((p, i) => {
        const active = count > i
        const number = draw[p.key] || '—'
        return (
          <div key={p.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 14, marginBottom: 8,
            background: active ? `${p.color}12` : 'rgba(255,255,255,0.02)',
            border: `1px solid ${active ? p.color + '45' : 'rgba(255,255,255,0.05)'}`,
            transition: 'background 0.35s, border 0.35s',
            animation: active ? 'slideUp 0.35s ease-out both' : 'none',
            opacity: active ? 1 : 0.1,
          }}>
            <span style={{ fontSize: 14, color: 'rgba(250,245,240,0.5)' }}>
              {p.icon} {p.label}
            </span>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '0.22em', color: p.color }}>
              {active
                ? number.split('').map((d, idx) => (
                    <RollingDigit key={idx} digit={d} cycles={10 + idx * 4} />
                  ))
                : '—'}
            </div>
          </div>
        )
      })}

      {count >= 4 && (
        <div style={{ marginTop: 14, animation: 'slideUp 0.4s ease-out both' }}>
          {[
            { label: 'Starter Prizes', items: draw.starters || [] },
            { label: 'Consolation',    items: draw.consolation || [] },
          ].map(g => (
            <div key={g.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'rgba(250,245,240,0.3)', marginBottom: 6, letterSpacing: '0.1em' }}>
                {g.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {g.items.map(n => (
                  <span key={n} style={{
                    fontSize: 11, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4,
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(250,245,240,0.35)',
                    letterSpacing: '0.1em',
                  }}>{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Single TOTO ball that pops in with ballReveal animation
function TotoBall({ number, revealed, isBonus }) {
  return (
    <div style={{
      width: 58, height: 58, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 19, fontWeight: 900, flexShrink: 0,
      opacity: revealed ? 1 : 0,
      animation: revealed ? 'ballReveal 0.55s cubic-bezier(0.36,0.07,0.19,0.97) both' : 'none',
      background: isBonus
        ? 'radial-gradient(circle at 35% 35%, rgba(220,38,38,0.55), rgba(185,28,28,0.3))'
        : 'radial-gradient(circle at 35% 35%, rgba(251,191,36,0.5), rgba(245,158,11,0.2))',
      border: `2.5px solid ${isBonus ? 'rgba(220,38,38,0.85)' : 'rgba(251,191,36,0.8)'}`,
      color: isBonus ? '#fca5a5' : '#fef3c7',
      boxShadow: revealed
        ? isBonus ? '0 4px 24px rgba(220,38,38,0.55)' : '0 4px 20px rgba(251,191,36,0.45)'
        : 'none',
    }}>
      {revealed ? number : ''}
    </div>
  )
}

function TotoContent({ draw, count }) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
        {(draw.numbers || []).map((n, i) => (
          <TotoBall key={i} number={n} revealed={count > i} isBonus={false} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: 'rgba(250,245,240,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          + Bonus Ball
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <TotoBall number={draw.bonus} revealed={count >= 7} isBonus />
      </div>

      {count >= 8 && (
        <div style={{
          textAlign: 'center',
          padding: '14px 18px', borderRadius: 14,
          background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)',
          animation: 'slideUp 0.4s ease-out both',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(250,245,240,0.35)', marginBottom: 6, letterSpacing: '0.1em' }}>
            Group 1 Jackpot
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fbbf24' }}>{draw.jackpot || '—'}</div>
          <div style={{ fontSize: 12, marginTop: 6,
            color: (draw.winners || 0) > 0 ? '#fbbf24' : 'rgba(250,245,240,0.3)' }}>
            {(draw.winners || 0) === 0
              ? 'No Group 1 winner — jackpot rolls over'
              : `${draw.winners} winner${draw.winners > 1 ? 's' : ''}`}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main overlay ──────────────────────────────────────────────────────────────
// count tracks how many items have been revealed:
//   4D:   0=none, 1=1st, 2=2nd, 3=3rd, 4=starters+consolation (done)
//   TOTO: 0=none, 1-6=balls, 7=bonus, 8=jackpot (done)

export default function LiveDrawReveal({ game, draw, onDismiss }) {
  const [count,  setCount]  = useState(0)
  const [fading, setFading] = useState(false)

  const total = game === '4d' ? 4 : 8
  const done  = count >= total

  // Drive the sequential reveal
  useEffect(() => {
    if (count >= total) return
    const delay =
      count === 0                      ? 400    // lead-in before first item
      : game === 'toto' && count === 6 ? 1900   // dramatic pause before bonus
      : game === 'toto' && count === 7 ? 1000   // pause before jackpot info
      : game === 'toto'                ? 1300   // between TOTO balls
      : count === 3                    ? 2000   // 4D: pause before starters
      :                                  1900   // between 4D prizes
    const id = setTimeout(() => setCount(c => c + 1), delay)
    return () => clearTimeout(id)
  }, [count, total, game])

  // Auto-dismiss 6s after all revealed
  useEffect(() => {
    if (!done) return
    const id = setTimeout(() => { setFading(true); setTimeout(onDismiss, 700) }, 6000)
    return () => clearTimeout(id)
  }, [done, onDismiss])

  const dismiss = () => { setFading(true); setTimeout(onDismiss, 700) }

  return (
    <div
      onClick={done ? dismiss : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(4,0,0,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.7s ease',
        animation: 'fadeIn 0.4s ease both',
      }}
    >
      {/* Ambient red glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 65% 45% at 50% 50%, rgba(220,38,38,0.09) 0%, transparent 70%)',
      }} />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 420,
          background: 'linear-gradient(160deg, rgba(24,4,4,0.98), rgba(10,1,1,0.99))',
          border: '1px solid rgba(220,38,38,0.3)',
          borderRadius: 28,
          padding: '28px 22px 22px',
          boxShadow: '0 0 100px rgba(220,38,38,0.14), 0 30px 60px rgba(0,0,0,0.65)',
          animation: 'slideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '4px 14px', borderRadius: 99,
            background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.35)',
            marginBottom: 12,
          }}>
            <span className="animate-pulse" style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#f87171', display: 'inline-block',
            }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#f87171', letterSpacing: '0.14em' }}>
              LIVE DRAW
            </span>
          </div>

          <div style={{ fontSize: 26, fontWeight: 900, color: '#faf5f0', marginBottom: 4 }}>
            {game === 'toto' ? 'TOTO' : '4D'} Draw #{draw.drawNo}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(250,245,240,0.3)' }}>
            {draw.day} · {draw.date}
          </div>
        </div>

        {game === '4d'
          ? <FourDContent draw={draw} count={count} />
          : <TotoContent  draw={draw} count={count} />
        }

        {/* Footer */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          {done ? (
            <button
              onClick={dismiss}
              style={{
                fontSize: 12, color: 'rgba(250,245,240,0.3)',
                background: 'none', border: 'none', cursor: 'pointer',
                letterSpacing: '0.05em', padding: '6px 16px', minHeight: 0,
              }}
            >
              Tap anywhere to dismiss
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span className="animate-pulse" style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#dc2626', display: 'inline-block',
              }} />
              <span style={{ fontSize: 11, color: 'rgba(250,245,240,0.3)', letterSpacing: '0.08em' }}>
                Drawing in progress…
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
