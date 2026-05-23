import React, { useState, useRef } from 'react'
import FloatingParticles from './components/FloatingParticles.jsx'
import Hero from './components/Hero.jsx'
import GameSelector from './components/GameSelector.jsx'
import MoodPicker from './components/MoodPicker.jsx'
import DreamPicker from './components/DreamPicker.jsx'
import NumberDisplay from './components/NumberDisplay.jsx'
import PreviousDraws from './components/PreviousDraws.jsx'
import HotNumbers from './components/HotNumbers.jsx'

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-4 px-6 mb-10 max-w-3xl mx-auto">
      <div className="flex-1" style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.25))' }} />
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: 'rgba(251,191,36,0.4)' }}>◆</span>
        <span className="text-xs uppercase tracking-widest flex-shrink-0" style={{ color: 'rgba(251,191,36,0.4)' }}>{label}</span>
        <span className="text-xs" style={{ color: 'rgba(251,191,36,0.4)' }}>◆</span>
      </div>
      <div className="flex-1" style={{ height: 1, background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.25))' }} />
    </div>
  )
}

export default function App() {
  const [gameType, setGameType] = useState(null)
  const [mood, setMood] = useState(null)
  const [selectedDreams, setSelectedDreams] = useState([])
  const [showNumbers, setShowNumbers] = useState(false)
  const [regenerateKey, setRegenerateKey] = useState(0)
  const [started, setStarted] = useState(false)

  const mainRef = useRef(null)
  const numbersRef = useRef(null)

  const handleStart = () => {
    setStarted(true)
    setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const resetNumbers = () => { if (showNumbers) setShowNumbers(false) }

  const handleDreamToggle = (dream) => {
    setSelectedDreams(prev =>
      prev.some(d => d.id === dream.id) ? prev.filter(d => d.id !== dream.id) : [...prev, dream]
    )
    resetNumbers()
  }

  const handleGameSelect = (id) => { setGameType(id); resetNumbers() }
  const handleMoodSelect = (m)  => { setMood(m); resetNumbers() }

  const handleGenerate = () => {
    if (!gameType || !mood) return
    if (showNumbers) {
      setRegenerateKey(k => k + 1)
    } else {
      setShowNumbers(true)
    }
    setTimeout(() => numbersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
  }

  const canGenerate = Boolean(gameType && mood)

  return (
    <div className="relative min-h-screen">
      <FloatingParticles />

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(8,2,2,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(251,191,36,0.1)',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-black text-xl tracking-tight">
            <span style={{ color: '#faf5f0' }}>Lucky</span>
            <span className="gradient-text-gold"> 7</span>
            <span className="text-sm ml-2 font-normal" style={{ color: 'rgba(251,191,36,0.35)' }}>幸运</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: 'rgba(250,245,240,0.25)' }}>
              Singapore Lottery Guide
            </span>
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold" style={{ color: '#f87171' }}>Live</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <Hero onStart={handleStart} />

      {/* Main wizard */}
      {started && (
        <div ref={mainRef} className="relative z-10">
          <SectionDivider label="Your Fortune Session" />

          <GameSelector selected={gameType} onSelect={handleGameSelect} />
          <MoodPicker selected={mood} onSelect={handleMoodSelect} />
          <DreamPicker selected={selectedDreams} onToggle={handleDreamToggle} />

          <HotNumbers gameType={gameType} />

          {/* Generate CTA */}
          <div className="text-center px-6 mb-14">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="relative px-14 py-4 rounded-full font-black text-base uppercase tracking-widest text-white active:scale-95"
              style={canGenerate ? {
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                boxShadow: showNumbers
                  ? '0 0 60px rgba(220,38,38,0.5)'
                  : '0 0 30px rgba(220,38,38,0.25)',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(250,245,240,0.25)',
                cursor: 'not-allowed',
              }}
              onMouseEnter={e => { if (canGenerate) e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <span className="flex items-center gap-2 justify-center">
                <span>{showNumbers ? '🔄' : '🏮'}</span>
                <span>{showNumbers ? 'Regenerate Fortune' : 'Reveal My Fortune'}</span>
              </span>
            </button>

            {!canGenerate && (
              <p className="text-xs mt-3" style={{ color: 'rgba(250,245,240,0.2)' }}>
                {!gameType ? '← Select a game type above' : '← Choose your mood to continue'}
              </p>
            )}
          </div>

          {/* Numbers */}
          <div ref={numbersRef}>
            <NumberDisplay
              gameType={gameType}
              mood={mood}
              dreams={selectedDreams}
              visible={showNumbers}
              regenerateKey={regenerateKey}
            />
          </div>

          {/* Previous draws */}
          <SectionDivider label="Recent Draw Results" />
          <PreviousDraws />
        </div>
      )}

      {/* Footer */}
      <footer
        className="relative z-10 py-10 text-center"
        style={{ borderTop: '1px solid rgba(251,191,36,0.08)' }}
      >
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="text-lg">🏮</span>
          <span className="font-black text-lg">
            <span style={{ color: '#faf5f0' }}>Lucky</span>
            <span className="gradient-text-gold"> 7</span>
          </span>
          <span className="text-lg">🏮</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(250,245,240,0.2)' }}>
          For entertainment purposes only. Always bet responsibly.
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(250,245,240,0.1)' }}>
          18+ only · Singapore Pools is the sole authorised lottery operator in Singapore.
        </p>
      </footer>
    </div>
  )
}
