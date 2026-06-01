import React, { useState, useRef, useEffect } from 'react'
import FloatingParticles from './components/FloatingParticles.jsx'
import Hero from './components/Hero.jsx'
import GameSelector from './components/GameSelector.jsx'
import ZodiacPicker from './components/ZodiacPicker.jsx'
import MoodPicker from './components/MoodPicker.jsx'
import DreamPicker from './components/DreamPicker.jsx'
import VoiceInput from './components/VoiceInput.jsx'
import NumberDisplay from './components/NumberDisplay.jsx'
import PreviousDraws from './components/PreviousDraws.jsx'
import HotNumbers from './components/HotNumbers.jsx'
import Donate from './components/Donate.jsx'
import { fetchResults } from './data/api.js'
import { t } from './data/translations.js'

// ── Step progress bar ─────────────────────────────────────────────────────────

function StepBar({ step, lang }) {
  const steps = [
    { n: 1, label: t('step1Title', lang) },
    { n: 2, label: t('step2Title', lang) },
    { n: 3, label: t('step3Title', lang) },
  ]
  return (
    <div className="flex items-center justify-center gap-0 mb-10 px-6">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base transition-all duration-300"
              style={{
                background: step >= s.n ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'rgba(255,255,255,0.06)',
                border: step >= s.n ? 'none' : '1px solid rgba(255,255,255,0.12)',
                color: step >= s.n ? '#fff' : 'rgba(250,245,240,0.3)',
                boxShadow: step === s.n ? '0 0 20px rgba(220,38,38,0.4)' : 'none',
              }}
            >
              {step > s.n ? '✓' : s.n}
            </div>
            <div className="text-xs font-semibold text-center w-20" style={{ color: step >= s.n ? '#fbbf24' : 'rgba(250,245,240,0.25)' }}>
              {s.label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className="w-12 h-0.5 mb-5 mx-1 transition-all duration-300"
              style={{ background: step > s.n ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.08)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-4 px-6 mb-10 max-w-3xl mx-auto">
      <div className="flex-1" style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.25))' }} />
      <span className="text-sm uppercase tracking-widest flex-shrink-0" style={{ color: 'rgba(251,191,36,0.4)' }}>◆ {label} ◆</span>
      <div className="flex-1" style={{ height: 1, background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.25))' }} />
    </div>
  )
}

// ── Main app ──────────────────────────────────────────────────────────────────

export default function App() {
  const [sessionSeed]    = useState(() => Math.floor(Math.random() * 99991))
  const [lang,  setLang] = useState('en')
  const [step,  setStep] = useState(1)   // 1 = game, 2 = personalise, 3 = fortune

  // Pending auto-generate — set true after voice sets gameType so useEffect can fire
  const [pendingGenerate, setPendingGenerate] = useState(false)

  // Game
  const [gameType,    setGameType]    = useState(null)
  const [totoConfig,  setTotoConfig]  = useState({ mode: 'ordinary', size: 6 })

  // Personalise
  const [mood,            setMood]           = useState(null)
  const [selectedDreams,  setSelectedDreams] = useState([])
  const [selectedZodiac,  setSelectedZodiac] = useState(null)
  const [selectedHoroscope, setSelectedHoroscope] = useState(null)

  // Numbers
  const [showNumbers,    setShowNumbers]    = useState(false)
  const [regenerateKey,  setRegenerateKey]  = useState(0)
  const [started,        setStarted]        = useState(false)

  // Live results
  const [draws4D,        setDraws4D]        = useState(null)
  const [drawsToto,      setDrawsToto]      = useState(null)
  const [resultsUpdatedAt, setResultsUpdatedAt] = useState(null)
  const [resultsLive,    setResultsLive]    = useState({ '4d': false, toto: false })
  const [loadingResults, setLoadingResults] = useState(true)

  const mainRef    = useRef(null)
  const numbersRef = useRef(null)

  useEffect(() => {
    fetchResults().then(data => {
      setDraws4D(data.draws4D)
      setDrawsToto(data.drawsToto)
      setResultsUpdatedAt(data.updatedAt)
      setResultsLive(data.live)
      setLoadingResults(false)
    })
  }, [])

  const handleStart = () => {
    setStarted(true)
    setStep(1)
    setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const handleGameSelect = (id) => { setGameType(id); setShowNumbers(false) }
  const handleTotoConfig = (cfg) => { setTotoConfig(cfg); setShowNumbers(false) }
  const handleMoodSelect = (m)   => { setMood(m);       setShowNumbers(false) }
  const handleDreamToggle = (dream) => {
    setSelectedDreams(prev =>
      prev.some(d => d.id === dream.id) ? prev.filter(d => d.id !== dream.id) : [...prev, dream]
    )
    setShowNumbers(false)
  }
  const handleZodiacSelect    = (z) => { setSelectedZodiac(z);    setShowNumbers(false) }
  const handleHoroscopeSelect = (h) => { setSelectedHoroscope(h); setShowNumbers(false) }

  // Voice result handler — applies all detected selections, then auto-generates if game was said
  const handleVoiceResult = ({ zodiac, horoscope, dreams, mood, gameType: detectedGame }) => {
    setShowNumbers(false)
    if (zodiac)           setSelectedZodiac(zodiac)
    if (horoscope)        setSelectedHoroscope(horoscope)
    if (mood)             setMood(mood)
    if (dreams?.length)   setSelectedDreams(prev => {
      const merged = [...prev]
      dreams.forEach(d => { if (!merged.some(x => x.id === d.id)) merged.push(d) })
      return merged
    })
    if (detectedGame) {
      // Set game type then trigger auto-generate via useEffect
      setGameType(detectedGame)
      setPendingGenerate(true)
    } else {
      // No game type heard — go to step 1 so user can pick it
      setStarted(true)
      setStep(1)
      setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    }
  }

  const goToStep2 = () => {
    setStep(2)
    setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }
  const goToStep1 = () => {
    setStep(1)
    setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const handleGenerate = () => {
    if (!gameType) return
    setStep(3)
    if (showNumbers) { setRegenerateKey(k => k + 1) } else { setShowNumbers(true) }
    setTimeout(() => numbersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 180)
  }

  // Auto-generate after voice sets gameType — fires once gameType is populated
  useEffect(() => {
    if (pendingGenerate && gameType) {
      setPendingGenerate(false)
      setStarted(true)
      setStep(3)
      setShowNumbers(true)
      setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    }
  }, [pendingGenerate, gameType])

  const updatedLabel = resultsUpdatedAt
    ? `Updated ${new Date(resultsUpdatedAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}`
    : null

  const hasPersonalisation = mood || selectedZodiac || selectedHoroscope || selectedDreams.length > 0

  return (
    <div className="relative min-h-screen">
      <FloatingParticles />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(8,2,2,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(251,191,36,0.1)' }}>
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between gap-3">
          <span className="font-black text-2xl tracking-tight flex-shrink-0">
            <span style={{ color: '#faf5f0' }}>Lucky</span>
            <span className="gradient-text-gold"> 7</span>
            <span className="text-base ml-2 font-normal" style={{ color: 'rgba(251,191,36,0.35)' }}>幸运</span>
          </span>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
              className="rounded-full px-4 py-1.5 font-bold text-sm transition-all"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
            >
              {lang === 'en' ? '中文' : 'EN'}
            </button>

            {updatedLabel && (
              <span className="text-sm hidden sm:block" style={{ color: 'rgba(250,245,240,0.25)' }}>{updatedLabel}</span>
            )}
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                background: loadingResults ? 'rgba(100,100,100,0.1)' : resultsLive['4d'] || resultsLive.toto ? 'rgba(220,38,38,0.1)' : 'rgba(251,191,36,0.08)',
                border: `1px solid ${loadingResults ? 'rgba(100,100,100,0.2)' : resultsLive['4d'] || resultsLive.toto ? 'rgba(220,38,38,0.25)' : 'rgba(251,191,36,0.2)'}`,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: loadingResults ? '#6b7280' : resultsLive['4d'] || resultsLive.toto ? '#f87171' : '#fbbf24' }} />
              <span className="text-sm font-semibold"
                style={{ color: loadingResults ? '#6b7280' : resultsLive['4d'] || resultsLive.toto ? '#f87171' : '#fbbf24' }}>
                {loadingResults ? t('loading', lang) : resultsLive['4d'] || resultsLive.toto ? t('live', lang) : t('cached', lang)}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <Hero onStart={handleStart} onVoiceResult={handleVoiceResult} draws4D={draws4D} drawsToto={drawsToto} lang={lang} />

      {/* Main wizard */}
      {started && (
        <div ref={mainRef} className="relative z-10 pt-4">

          {/* Step progress */}
          <StepBar step={step} lang={lang} />

          {/* ── STEP 1: Game Selection ── */}
          {step === 1 && (
            <div style={{ animation: 'slideUp 0.35s ease-out both' }}>
              <GameSelector
                selected={gameType}
                onSelect={handleGameSelect}
                totoConfig={totoConfig}
                onTotoConfig={handleTotoConfig}
                lang={lang}
              />

              <div className="text-center px-6 mb-14">
                <button
                  onClick={goToStep2}
                  disabled={!gameType}
                  className="px-14 py-5 rounded-full font-black text-lg uppercase tracking-widest text-white transition-all active:scale-95"
                  style={gameType ? {
                    background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
                    boxShadow: '0 0 40px rgba(220,38,38,0.3)',
                    cursor: 'pointer',
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(250,245,240,0.25)',
                    cursor: 'not-allowed',
                  }}
                  onMouseEnter={e => { if (gameType) e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {t('nextPersonalise', lang)}
                </button>
                {!gameType && (
                  <p className="text-base mt-4" style={{ color: 'rgba(250,245,240,0.25)' }}>{t('generateHint', lang)}</p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2: Personalise ── */}
          {step === 2 && (
            <div style={{ animation: 'slideUp 0.35s ease-out both' }}>
              {/* Section header */}
              <div className="text-center px-6 mb-5 max-w-3xl mx-auto">
                <div className="text-sm uppercase tracking-widest mb-1" style={{ color: 'rgba(251,191,36,0.5)' }}>
                  {t('step2Label', lang)} · {t('optional', lang)}
                </div>
                <h2 className="text-4xl font-black" style={{ color: '#faf5f0' }}>{t('step2Title', lang)}</h2>
                <p className="text-base mt-2" style={{ color: 'rgba(250,245,240,0.35)' }}>
                  {lang === 'en' ? 'Speak or tap to personalise your lucky numbers' : '语音或点击输入您的个人化设置'}
                </p>
                <div className="gold-line w-24 mx-auto mt-3" />
              </div>

              {/* ── Voice input ── */}
              <VoiceInput onResult={handleVoiceResult} lang={lang} />

              {/* Divider */}
              <div className="flex items-center gap-3 px-6 mb-5 max-w-3xl mx-auto">
                <div className="flex-1 h-px" style={{ background:'rgba(251,191,36,0.12)' }} />
                <span className="text-sm" style={{ color:'rgba(250,245,240,0.25)' }}>
                  {lang === 'en' ? 'or select manually' : '或手动选择'}
                </span>
                <div className="flex-1 h-px" style={{ background:'rgba(251,191,36,0.12)' }} />
              </div>

              {/* Zodiac */}
              <div className="max-w-3xl mx-auto px-6 mb-2">
                <div className="text-base font-black mb-1" style={{ color: 'rgba(251,191,36,0.6)' }}>
                  {lang === 'en' ? '① Zodiac' : '① 生肖星座'}
                </div>
              </div>
              <ZodiacPicker
                selectedZodiac={selectedZodiac}
                selectedHoroscope={selectedHoroscope}
                onZodiacSelect={handleZodiacSelect}
                onHoroscopeSelect={handleHoroscopeSelect}
                lang={lang}
              />

              {/* Mood */}
              <div className="max-w-3xl mx-auto px-6 mb-2 mt-2">
                <div className="text-base font-black mb-1" style={{ color: 'rgba(251,191,36,0.6)' }}>
                  {lang === 'en' ? '② Mood' : '② 心情'}
                </div>
              </div>
              <MoodPicker selected={mood} onSelect={handleMoodSelect} lang={lang} />

              {/* Dreams */}
              <div className="max-w-3xl mx-auto px-6 mb-2">
                <div className="text-base font-black mb-1" style={{ color: 'rgba(251,191,36,0.6)' }}>
                  {lang === 'en' ? '③ Dreams' : '③ 梦境'}
                </div>
              </div>
              <DreamPicker selected={selectedDreams} onToggle={handleDreamToggle} lang={lang} />

              {/* Personalisation summary */}
              {hasPersonalisation && (
                <div className="w-full max-w-3xl mx-auto px-6 mb-6">
                  <div className="rounded-xl px-4 py-3 flex flex-wrap gap-2 items-center"
                    style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)' }}>
                    <span className="text-sm" style={{ color: 'rgba(250,245,240,0.35)' }}>
                      {lang === 'en' ? 'Your selections:' : '您的选择：'}
                    </span>
                    {selectedZodiac && (
                      <span className="text-sm rounded-full px-3 py-1" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
                        {selectedZodiac.emoji} {lang === 'zh' ? selectedZodiac.zh : selectedZodiac.en}
                      </span>
                    )}
                    {selectedHoroscope && (
                      <span className="text-sm rounded-full px-3 py-1" style={{ background: 'rgba(139,92,246,0.12)', color: '#c4b5fd' }}>
                        {selectedHoroscope.emoji} {lang === 'zh' ? selectedHoroscope.zh : selectedHoroscope.en}
                      </span>
                    )}
                    {mood && (
                      <span className="text-sm rounded-full px-3 py-1" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
                        {mood.emoji} {lang === 'zh' ? mood.chinese : mood.label}
                      </span>
                    )}
                    {selectedDreams.length > 0 && (
                      <span className="text-sm rounded-full px-3 py-1" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
                        {selectedDreams.length} {lang === 'en' ? 'dream(s)' : '个梦境'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="text-center px-6 pb-16 space-y-4">
                <button
                  onClick={handleGenerate}
                  className="block w-full max-w-sm mx-auto px-14 py-5 rounded-full font-black text-xl uppercase tracking-widest text-white active:scale-95 transition-all"
                  style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 0 50px rgba(220,38,38,0.35)', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {t('revealFortune', lang)}
                </button>
                <button
                  onClick={goToStep1}
                  className="text-base px-6 py-2 rounded-full transition-all"
                  style={{ color: 'rgba(250,245,240,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {t('backToGame', lang)}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Fortune ── */}
          {step === 3 && (
            <div style={{ animation: 'slideUp 0.35s ease-out both' }}>
              <div ref={numbersRef}>
                <NumberDisplay
                  gameType={gameType}
                  mood={mood}
                  dreams={selectedDreams}
                  zodiac={selectedZodiac}
                  horoscope={selectedHoroscope}
                  visible={showNumbers}
                  regenerateKey={regenerateKey}
                  draws4D={draws4D}
                  drawsToto={drawsToto}
                  sessionSeed={sessionSeed}
                  totoConfig={totoConfig}
                  lang={lang}
                />
              </div>

              {/* Regenerate / change buttons */}
              <div className="text-center px-6 mb-10 flex flex-col items-center gap-3">
                <button
                  onClick={handleGenerate}
                  className="px-12 py-4 rounded-full font-black text-base uppercase tracking-widest text-white transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 0 30px rgba(220,38,38,0.25)', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {t('regenerate', lang)}
                </button>
                <button
                  onClick={goToStep2}
                  className="text-sm px-5 py-2 rounded-full transition-all"
                  style={{ color: 'rgba(250,245,240,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {lang === 'en' ? '← Change personalisation' : '← 更改个人化设置'}
                </button>
              </div>

              <HotNumbers gameType={gameType} draws4D={draws4D} drawsToto={drawsToto} lang={lang} />

              <SectionDivider label={t('recentResults', lang)} />
              <PreviousDraws draws4D={draws4D} drawsToto={drawsToto} loading={loadingResults} live={resultsLive} updatedAt={resultsUpdatedAt} lang={lang} />
            </div>
          )}

          {/* Donate always visible once started */}
          {step === 3 && (
            <>
              <SectionDivider label={t('supportTitle', lang)} />
              <Donate />
            </>
          )}
        </div>
      )}

      {/* ── Mobile sticky bottom bar (shows during step 1 & 2) ── */}
      {started && step < 3 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
          style={{ background: 'rgba(8,2,2,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(251,191,36,0.15)', padding: '12px 20px env(safe-area-inset-bottom, 20px)' }}>
          <div className="flex items-center gap-3 max-w-sm mx-auto">
            {step === 2 && (
              <button onClick={goToStep1}
                className="flex-shrink-0 h-14 px-5 rounded-full font-bold text-base transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(250,245,240,0.5)' }}>
                ←
              </button>
            )}
            <button
              onClick={step === 1 ? goToStep2 : handleGenerate}
              disabled={!gameType}
              className="flex-1 h-14 rounded-full font-black text-lg uppercase tracking-wider text-white transition-all active:scale-95"
              style={gameType ? {
                background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
                boxShadow: '0 0 30px rgba(220,38,38,0.35)',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(250,245,240,0.25)',
              }}
            >
              {step === 1
                ? t('nextPersonalise', lang)
                : t('revealFortune', lang)}
            </button>
          </div>
        </div>
      )}

      {/* Bottom padding so sticky bar doesn't overlap content on mobile */}
      {started && step < 3 && <div className="h-24 sm:hidden" />}

      {/* Footer */}
      <footer className="relative z-10 py-10 text-center" style={{ borderTop: '1px solid rgba(251,191,36,0.08)' }}>
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="text-2xl">🏮</span>
          <span className="font-black text-2xl">
            <span style={{ color: '#faf5f0' }}>Lucky</span>
            <span className="gradient-text-gold"> 7</span>
          </span>
          <span className="text-2xl">🏮</span>
        </div>
        <p className="text-base" style={{ color: 'rgba(250,245,240,0.2)' }}>{t('footerNote', lang)}</p>
        <p className="text-sm mt-1" style={{ color: 'rgba(250,245,240,0.1)' }}>{t('footerLegal', lang)}</p>
      </footer>
    </div>
  )
}
