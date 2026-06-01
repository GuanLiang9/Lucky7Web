import React, { useState, useRef, useEffect } from 'react'
import { parseVoiceInput, VOICE_EXAMPLES } from '../utils/voiceParser.js'

// ── Browser support check ─────────────────────────────────────────────────────

const SR = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null

// ── Detected pill ─────────────────────────────────────────────────────────────

function Pill({ emoji, label, color }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full px-4 py-2"
      style={{ background: color.bg, border: `1px solid ${color.border}` }}>
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-bold" style={{ color: color.text }}>{label}</span>
    </div>
  )
}

// ── Waveform bars (shown while listening) ─────────────────────────────────────

function WaveBar({ delay }) {
  return (
    <div className="w-1 rounded-full" style={{
      background: '#fbbf24',
      animation: `voiceWave 0.8s ease-in-out ${delay}s infinite alternate`,
      minHeight: 8,
    }} />
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function VoiceInput({ onResult, lang = 'en', compact = false }) {
  const [status, setStatus]         = useState('idle')  // idle|listening|processing|done|error|unsupported
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim]       = useState('')
  const [detected, setDetected]     = useState(null)
  const [exampleIdx, setExampleIdx] = useState(0)
  const recognitionRef = useRef(null)
  const timerRef       = useRef(null)

  // Cycle example phrases
  useEffect(() => {
    const examples = VOICE_EXAMPLES[lang] || VOICE_EXAMPLES.en
    const t = setInterval(() => setExampleIdx(i => (i + 1) % examples.length), 3500)
    return () => clearInterval(t)
  }, [lang])

  const examples = VOICE_EXAMPLES[lang] || VOICE_EXAMPLES.en

  function processResult(text) {
    if (!text.trim()) { setStatus('idle'); return }
    setStatus('processing')
    const result = parseVoiceInput(text)
    setDetected(result)
    setStatus('done')
  }

  function startListening() {
    if (!SR) { setStatus('unsupported'); return }
    if (status === 'listening') { recognitionRef.current?.stop(); return }

    setTranscript(''); setInterim(''); setDetected(null)

    const rec = new SR()
    rec.continuous      = false
    rec.interimResults  = true
    rec.maxAlternatives = 1
    rec.lang = lang === 'zh' ? 'zh-CN' : 'en-SG'

    rec.onstart = () => setStatus('listening')

    rec.onresult = (e) => {
      let final = '', inter = ''
      for (const result of e.results) {
        if (result.isFinal) final += result[0].transcript
        else                inter += result[0].transcript
      }
      if (final) setTranscript(t => t + final)
      setInterim(inter)
    }

    rec.onend = () => {
      setInterim('')
      const full = transcript + interim
      // Small delay so state from onresult has settled
      timerRef.current = setTimeout(() => processResult(full || transcript), 150)
    }

    rec.onerror = (e) => {
      if (e.error === 'no-speech') { setStatus('idle'); return }
      if (e.error === 'not-allowed') { setStatus('error'); return }
      setStatus('error')
    }

    recognitionRef.current = rec
    rec.start()
  }

  function applyAndReset() {
    if (detected) onResult(detected)
    setStatus('idle'); setTranscript(''); setDetected(null)
  }

  function retry() {
    setStatus('idle'); setTranscript(''); setInterim(''); setDetected(null)
  }

  // ── Detected pills ──────────────────────────────────────────────────────────

  const pills = []
  if (detected?.zodiac) pills.push({
    emoji: detected.zodiac.emoji,
    label: lang === 'zh' ? detected.zodiac.zh : detected.zodiac.en,
    color: { bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.4)', text:'#fbbf24' },
  })
  if (detected?.horoscope) pills.push({
    emoji: detected.horoscope.emoji,
    label: lang === 'zh' ? detected.horoscope.zh : detected.horoscope.en,
    color: { bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.4)', text:'#c4b5fd' },
  })
  if (detected?.mood) pills.push({
    emoji: detected.mood.emoji,
    label: lang === 'zh' ? detected.mood.chinese : detected.mood.label,
    color: { bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.4)', text:'#34d399' },
  })
  detected?.dreams?.forEach(d => pills.push({
    emoji: d.emoji,
    label: lang === 'zh' ? d.chinese : d.label,
    color: { bg:'rgba(220,38,38,0.12)', border:'rgba(220,38,38,0.35)', text:'#f87171' },
  }))
  if (detected?.gameType) pills.push({
    emoji: detected.gameType === '4d' ? '🎰' : detected.gameType === 'toto' ? '🎱' : '🧧',
    label: detected.gameType.toUpperCase(),
    color: { bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.4)', text:'#fbbf24' },
  })

  const hasDetection = pills.length > 0

  // ── UI strings ──────────────────────────────────────────────────────────────

  const STR = {
    en: {
      title: '🎤 Speak Your Fortune',
      subtitle: 'Say your zodiac animal, mood, or dream',
      tapHint: 'Tap the mic and speak',
      listening: 'Listening... speak now',
      processing: 'Understanding...',
      detected: 'I detected:',
      noMatch: "I heard you, but couldn't match anything. Try again.",
      apply: '✓  Apply These',
      retry: '↩  Try Again',
      error: 'Microphone access denied. Please allow in browser settings.',
      unsupported: 'Voice input not supported on this browser.',
      example: 'e.g. "',
    },
    zh: {
      title: '🎤 语音输入',
      subtitle: '说出您的生肖、心情或梦境',
      tapHint: '点击麦克风后说话',
      listening: '正在聆听... 请说话',
      processing: '正在识别...',
      detected: '我听到了：',
      noMatch: '我听到了，但未能匹配。请再试一次。',
      apply: '✓  应用这些',
      retry: '↩  重试',
      error: '麦克风权限被拒绝，请在浏览器设置中允许。',
      unsupported: '此浏览器不支持语音输入。',
      example: '例如："',
    },
  }
  const s = STR[lang] || STR.en

  if (!SR) {
    return (
      <div className="w-full max-w-3xl mx-auto px-6 mb-6">
        <div className="rounded-2xl p-4 text-center text-sm" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(250,245,240,0.3)' }}>
          {s.unsupported}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-6">
      <div className="rounded-3xl overflow-hidden"
        style={{
          background: status === 'listening'
            ? 'rgba(220,38,38,0.08)'
            : status === 'done'
            ? 'rgba(251,191,36,0.06)'
            : 'rgba(255,255,255,0.03)',
          border: `2px solid ${
            status === 'listening' ? 'rgba(220,38,38,0.45)'
            : status === 'done'   ? 'rgba(251,191,36,0.4)'
            : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 0.3s ease',
        }}>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 text-center">
          <div className="text-lg font-black mb-0.5" style={{ color:'#faf5f0' }}>{s.title}</div>
          <div className="text-sm" style={{ color:'rgba(250,245,240,0.4)' }}>{s.subtitle}</div>
        </div>

        {/* Mic button area */}
        <div className="flex flex-col items-center gap-4 px-5 pb-5">

          {/* Big mic button */}
          <button
            onClick={startListening}
            disabled={status === 'processing'}
            className="relative flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{
              width: 96, height: 96,
              background: status === 'listening'
                ? 'linear-gradient(135deg,#dc2626,#b91c1c)'
                : 'linear-gradient(135deg,rgba(251,191,36,0.15),rgba(220,38,38,0.15))',
              border: `3px solid ${status === 'listening' ? '#dc2626' : 'rgba(251,191,36,0.4)'}`,
              boxShadow: status === 'listening'
                ? '0 0 0 0 rgba(220,38,38,0.4)'
                : '0 0 24px rgba(251,191,36,0.15)',
              animation: status === 'listening' ? 'micPulse 1.2s ease-out infinite' : 'none',
              cursor: status === 'processing' ? 'default' : 'pointer',
            }}
          >
            {status === 'processing' ? (
              <div className="w-8 h-8 rounded-full border-4 border-t-transparent" style={{ borderColor:'rgba(251,191,36,0.6)', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="12" rx="3"
                  fill={status === 'listening' ? '#ffffff' : '#fbbf24'} />
                <path d="M5 10a7 7 0 0 0 14 0" stroke={status === 'listening' ? '#ffffff' : '#fbbf24'}
                  strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke={status === 'listening' ? '#ffffff' : '#fbbf24'}
                  strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke={status === 'listening' ? '#ffffff' : '#fbbf24'}
                  strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          {/* Status text + waveform */}
          {status === 'idle' && (
            <div className="text-center">
              <div className="text-base font-semibold mb-1" style={{ color:'rgba(250,245,240,0.5)' }}>{s.tapHint}</div>
              <div className="text-sm italic" style={{ color:'rgba(250,245,240,0.3)', minHeight:20 }}>
                {s.example}{examples[exampleIdx]}"
              </div>
            </div>
          )}

          {status === 'listening' && (
            <div className="text-center">
              <div className="text-base font-bold mb-3" style={{ color:'#f87171' }}>{s.listening}</div>
              {/* Animated waveform */}
              <div className="flex items-end justify-center gap-1" style={{ height:36 }}>
                {[0,0.1,0.2,0.15,0.05,0.25,0.1,0.3,0.2,0.08].map((d,i) => (
                  <WaveBar key={i} delay={d} />
                ))}
              </div>
              {(transcript || interim) && (
                <div className="mt-3 text-sm px-4 py-2 rounded-xl" style={{ background:'rgba(0,0,0,0.3)', color:'rgba(250,245,240,0.6)' }}>
                  "{transcript}{interim}"
                </div>
              )}
            </div>
          )}

          {status === 'processing' && (
            <div className="text-base font-semibold" style={{ color:'rgba(251,191,36,0.7)' }}>{s.processing}</div>
          )}

          {status === 'done' && (
            <div className="w-full text-center space-y-3">
              {/* Show raw transcript */}
              {transcript && (
                <div className="text-sm px-4 py-2 rounded-xl" style={{ background:'rgba(0,0,0,0.3)', color:'rgba(250,245,240,0.5)' }}>
                  "{transcript}"
                </div>
              )}

              {hasDetection ? (
                <>
                  <div className="text-sm font-bold" style={{ color:'rgba(250,245,240,0.5)' }}>{s.detected}</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {pills.map((p, i) => <Pill key={i} {...p} />)}
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={applyAndReset}
                      className="px-8 py-3 rounded-full font-black text-base transition-all active:scale-95"
                      style={{ background:'linear-gradient(135deg,#dc2626,#b91c1c)', color:'#fff', boxShadow:'0 0 24px rgba(220,38,38,0.3)' }}
                    >
                      {s.apply}
                    </button>
                    <button
                      onClick={retry}
                      className="px-6 py-3 rounded-full font-bold text-base transition-all active:scale-95"
                      style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(250,245,240,0.5)' }}
                    >
                      {s.retry}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm" style={{ color:'rgba(250,245,240,0.4)' }}>{s.noMatch}</div>
                  <button
                    onClick={retry}
                    className="px-8 py-3 rounded-full font-bold text-base transition-all active:scale-95"
                    style={{ background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.35)', color:'#fbbf24' }}
                  >
                    {s.retry}
                  </button>
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-2">
              <div className="text-2xl">🎤❌</div>
              <div className="text-sm" style={{ color:'rgba(250,245,240,0.4)' }}>{s.error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
