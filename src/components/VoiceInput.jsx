import React, { useState, useRef, useEffect } from 'react'
import { parseVoiceInput, VOICE_EXAMPLES } from '../utils/voiceParser.js'

// ── Browser support check ─────────────────────────────────────────────────────

const SR = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null

// ── Detected result pill ──────────────────────────────────────────────────────

function Pill({ emoji, label, color }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-2"
      style={{ background: color.bg, border: `1px solid ${color.border}` }}>
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-bold" style={{ color: color.text }}>{label}</span>
    </div>
  )
}

// ── Animated waveform bar ─────────────────────────────────────────────────────

function WaveBar({ delay }) {
  return (
    <div style={{
      width: 5, borderRadius: 3, background: '#fbbf24',
      animation: `voiceWave 0.8s ease-in-out ${delay}s infinite alternate`,
      minHeight: 6,
    }} />
  )
}

// ── Mic SVG icon ──────────────────────────────────────────────────────────────

function MicIcon({ size = 44, color = '#fbbf24' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
      <path d="M5 10a7 7 0 0 0 14 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8"  y1="21" x2="16" y2="21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
// heroMode=true  → large centered design for the landing page
// heroMode=false → compact card design for Step 2

export default function VoiceInput({ onResult, lang = 'en', heroMode = false }) {
  const [status,     setStatus]     = useState('idle')  // idle|listening|processing|done|error|unsupported
  const [transcript, setTranscript] = useState('')
  const [interim,    setInterim]    = useState('')
  const [detected,   setDetected]   = useState(null)
  const [exampleIdx, setExampleIdx] = useState(0)
  const recognitionRef = useRef(null)
  const transcriptRef  = useRef('')   // stable ref so onend closure sees latest value

  // Rotate example phrases
  useEffect(() => {
    const examples = VOICE_EXAMPLES[lang] || VOICE_EXAMPLES.en
    const id = setInterval(() => setExampleIdx(i => (i + 1) % examples.length), 3600)
    return () => clearInterval(id)
  }, [lang])

  // Keep ref in sync with state
  useEffect(() => { transcriptRef.current = transcript }, [transcript])

  function processResult(text) {
    const clean = text.trim()
    if (!clean) { setStatus('idle'); return }
    setStatus('processing')
    const result = parseVoiceInput(clean)
    setDetected(result)
    setStatus('done')
  }

  function startListening() {
    if (!SR) { setStatus('unsupported'); return }
    if (status === 'listening') { recognitionRef.current?.stop(); return }

    setTranscript(''); setInterim(''); setDetected(null); transcriptRef.current = ''

    const rec = new SR()
    rec.continuous     = false
    rec.interimResults = true
    rec.lang           = lang === 'zh' ? 'zh-CN' : 'en-SG'

    rec.onstart = () => setStatus('listening')

    rec.onresult = (e) => {
      let final = '', inter = ''
      for (const r of e.results) {
        if (r.isFinal) final += r[0].transcript
        else           inter += r[0].transcript
      }
      if (final) {
        setTranscript(prev => { const v = prev + final; transcriptRef.current = v; return v })
      }
      setInterim(inter)
    }

    rec.onend = () => {
      setInterim('')
      setTimeout(() => processResult(transcriptRef.current), 120)
    }

    rec.onerror = (e) => {
      if (e.error === 'no-speech')   { setStatus('idle'); return }
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

  // ── Build detected pills ────────────────────────────────────────────────────

  const pills = []
  if (detected?.gameType) pills.push({
    key: 'game',
    emoji: detected.gameType === '4d' ? '🎰' : detected.gameType === 'toto' ? '🎱' : '🧧',
    label: detected.gameType.toUpperCase(),
    color: { bg:'rgba(220,38,38,0.15)', border:'rgba(220,38,38,0.4)', text:'#f87171' },
  })
  if (detected?.zodiac) pills.push({
    key: 'zodiac',
    emoji: detected.zodiac.emoji,
    label: lang === 'zh' ? detected.zodiac.zh : detected.zodiac.en,
    color: { bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.4)', text:'#fbbf24' },
  })
  if (detected?.horoscope) pills.push({
    key: 'horoscope',
    emoji: detected.horoscope.emoji,
    label: lang === 'zh' ? detected.horoscope.zh : detected.horoscope.en,
    color: { bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.4)', text:'#c4b5fd' },
  })
  if (detected?.mood) pills.push({
    key: 'mood',
    emoji: detected.mood.emoji,
    label: lang === 'zh' ? detected.mood.chinese : detected.mood.label,
    color: { bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.4)', text:'#34d399' },
  })
  detected?.dreams?.forEach(d => pills.push({
    key: d.id,
    emoji: d.emoji,
    label: lang === 'zh' ? d.chinese : d.label,
    color: { bg:'rgba(251,191,36,0.1)', border:'rgba(251,191,36,0.3)', text:'rgba(251,191,36,0.8)' },
  }))
  const hasDetection = pills.length > 0

  // ── UI strings ──────────────────────────────────────────────────────────────

  const S = {
    en: {
      title:      '🎤 Speak Your Fortune',
      heroHint:   'Say your game, zodiac, mood & dream in one go',
      stepHint:   'Say your zodiac, mood or dream',
      example:    'e.g. "',
      tap:        'Tap mic & speak',
      listening:  '🔴 Listening… speak now',
      processing: 'Understanding…',
      detected:   'I detected:',
      noMatch:    "Heard you! Couldn't match anything — try again.",
      apply:      '✓ Apply & Generate',
      applyStep:  '✓ Apply These',
      retry:      '↩ Try Again',
      error:      'Mic access denied. Please allow in browser settings.',
      unsupported:'Voice not supported on this browser.',
    },
    zh: {
      title:      '🎤 语音输入',
      heroHint:   '一次说出游戏、生肖、心情和梦境',
      stepHint:   '说出您的生肖、心情或梦境',
      example:    '例如："',
      tap:        '点击麦克风说话',
      listening:  '🔴 聆听中… 请说话',
      processing: '正在识别…',
      detected:   '我听到了：',
      noMatch:    '听到了，但未能匹配 — 请再试一次。',
      apply:      '✓ 应用并生成',
      applyStep:  '✓ 应用这些',
      retry:      '↩ 重试',
      error:      '麦克风权限被拒绝，请在浏览器设置中允许。',
      unsupported:'此浏览器不支持语音输入。',
    },
  }
  const s = S[lang] || S.en
  const examples = VOICE_EXAMPLES[lang] || VOICE_EXAMPLES.en

  // ── Unsupported fallback ────────────────────────────────────────────────────

  if (!SR) {
    return heroMode ? null : (
      <div className="w-full max-w-3xl mx-auto px-6 mb-6">
        <div className="rounded-2xl p-4 text-center text-sm"
          style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(250,245,240,0.3)' }}>
          {s.unsupported}
        </div>
      </div>
    )
  }

  // ── HERO MODE ───────────────────────────────────────────────────────────────

  if (heroMode) {
    return (
      <div className="flex flex-col items-center" style={{ animation: 'slideUp 0.6s ease-out 0.38s both' }}>
        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-xs mb-7">
          <div className="flex-1 h-px" style={{ background:'rgba(251,191,36,0.18)' }} />
          <span className="text-base font-semibold" style={{ color:'rgba(250,245,240,0.35)' }}>
            {lang === 'en' ? 'or speak' : '或语音输入'}
          </span>
          <div className="flex-1 h-px" style={{ background:'rgba(251,191,36,0.18)' }} />
        </div>

        {/* Mic button */}
        <button
          onClick={startListening}
          disabled={status === 'processing'}
          className="relative flex items-center justify-center rounded-full transition-all active:scale-90 mb-4"
          style={{
            width: 112, height: 112,
            background: status === 'listening'
              ? 'linear-gradient(135deg,#dc2626,#b91c1c)'
              : 'rgba(251,191,36,0.08)',
            border: `3px solid ${status === 'listening' ? '#dc2626' : 'rgba(251,191,36,0.45)'}`,
            boxShadow: status === 'listening'
              ? '0 0 0 0 rgba(220,38,38,0.4)'
              : '0 0 32px rgba(251,191,36,0.12)',
            animation: status === 'listening' ? 'micPulse 1.2s ease-out infinite' : 'none',
            cursor: status === 'processing' ? 'default' : 'pointer',
          }}
        >
          {status === 'processing' ? (
            <div style={{ width:36, height:36, borderRadius:'50%', border:'4px solid rgba(251,191,36,0.4)', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
          ) : (
            <MicIcon size={50} color={status === 'listening' ? '#fff' : '#fbbf24'} />
          )}
        </button>

        {/* Status text */}
        {status === 'idle' && (
          <div className="text-center max-w-xs">
            <div className="text-lg font-bold mb-1" style={{ color:'rgba(250,245,240,0.55)' }}>{s.tap}</div>
            <div className="text-base" style={{ color:'rgba(250,245,240,0.3)' }}>
              {s.heroHint}
            </div>
            <div className="text-sm mt-2 italic" style={{ color:'rgba(251,191,36,0.5)', minHeight:22 }}>
              {s.example}{examples[exampleIdx]}"
            </div>
          </div>
        )}

        {status === 'listening' && (
          <div className="text-center">
            <div className="text-lg font-bold mb-3" style={{ color:'#f87171' }}>{s.listening}</div>
            <div className="flex items-end justify-center gap-1.5" style={{ height:44 }}>
              {[0, 0.1, 0.2, 0.15, 0.05, 0.25, 0.1, 0.3, 0.2, 0.08, 0.15, 0.22].map((d, i) => (
                <WaveBar key={i} delay={d} />
              ))}
            </div>
            {(transcript || interim) && (
              <div className="mt-4 text-sm px-5 py-2 rounded-2xl max-w-sm"
                style={{ background:'rgba(0,0,0,0.4)', color:'rgba(250,245,240,0.6)' }}>
                "{transcript}{interim}"
              </div>
            )}
          </div>
        )}

        {status === 'processing' && (
          <div className="text-lg font-semibold" style={{ color:'rgba(251,191,36,0.7)' }}>{s.processing}</div>
        )}

        {status === 'done' && (
          <div className="w-full max-w-sm text-center space-y-4">
            {transcript && (
              <div className="text-sm px-4 py-2 rounded-xl"
                style={{ background:'rgba(0,0,0,0.35)', color:'rgba(250,245,240,0.45)' }}>
                "{transcript}"
              </div>
            )}
            {hasDetection ? (
              <>
                <div className="text-sm font-bold" style={{ color:'rgba(250,245,240,0.45)' }}>{s.detected}</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {pills.map(p => <Pill key={p.key} {...p} />)}
                </div>
                <div className="flex justify-center gap-3 pt-1">
                  <button onClick={applyAndReset}
                    className="px-8 py-4 rounded-full font-black text-lg text-white transition-all active:scale-95"
                    style={{ background:'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow:'0 0 30px rgba(220,38,38,0.35)' }}>
                    {s.apply}
                  </button>
                  <button onClick={retry}
                    className="px-5 py-4 rounded-full font-bold text-base transition-all active:scale-95"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(250,245,240,0.4)' }}>
                    {s.retry}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-base" style={{ color:'rgba(250,245,240,0.4)' }}>{s.noMatch}</div>
                <button onClick={retry}
                  className="px-8 py-3 rounded-full font-bold text-base transition-all active:scale-95"
                  style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.35)', color:'#fbbf24' }}>
                  {s.retry}
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="text-center mt-2">
            <div className="text-2xl mb-2">🎤❌</div>
            <div className="text-sm" style={{ color:'rgba(250,245,240,0.4)' }}>{s.error}</div>
          </div>
        )}
      </div>
    )
  }

  // ── STEP 2 CARD MODE ────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-6">
      <div className="rounded-3xl overflow-hidden"
        style={{
          background: status === 'listening' ? 'rgba(220,38,38,0.08)'
            : status === 'done'             ? 'rgba(251,191,36,0.06)'
            : 'rgba(255,255,255,0.03)',
          border: `2px solid ${
            status === 'listening' ? 'rgba(220,38,38,0.45)'
            : status === 'done'   ? 'rgba(251,191,36,0.4)'
            : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 0.3s ease',
        }}>
        <div className="px-5 pt-5 pb-2 text-center">
          <div className="text-lg font-black mb-0.5" style={{ color:'#faf5f0' }}>{s.title}</div>
          <div className="text-sm" style={{ color:'rgba(250,245,240,0.4)' }}>{s.stepHint}</div>
        </div>

        <div className="flex flex-col items-center gap-4 px-5 pb-5">
          {/* Mic button */}
          <button onClick={startListening} disabled={status === 'processing'}
            className="relative flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{
              width:88, height:88,
              background: status === 'listening' ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'rgba(251,191,36,0.1)',
              border: `3px solid ${status === 'listening' ? '#dc2626' : 'rgba(251,191,36,0.4)'}`,
              boxShadow: status === 'listening' ? '0 0 0 0 rgba(220,38,38,0.4)' : '0 0 20px rgba(251,191,36,0.1)',
              animation: status === 'listening' ? 'micPulse 1.2s ease-out infinite' : 'none',
              cursor: status === 'processing' ? 'default' : 'pointer',
            }}>
            {status === 'processing' ? (
              <div style={{ width:32, height:32, borderRadius:'50%', border:'4px solid rgba(251,191,36,0.4)', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
            ) : (
              <MicIcon size={44} color={status === 'listening' ? '#fff' : '#fbbf24'} />
            )}
          </button>

          {status === 'idle' && (
            <div className="text-center">
              <div className="text-base font-semibold mb-1" style={{ color:'rgba(250,245,240,0.5)' }}>{s.tap}</div>
              <div className="text-sm italic" style={{ color:'rgba(250,245,240,0.3)', minHeight:20 }}>
                {s.example}{examples[exampleIdx]}"
              </div>
            </div>
          )}

          {status === 'listening' && (
            <div className="text-center">
              <div className="text-base font-bold mb-3" style={{ color:'#f87171' }}>{s.listening}</div>
              <div className="flex items-end justify-center gap-1" style={{ height:36 }}>
                {[0,0.1,0.2,0.15,0.05,0.25,0.1,0.3,0.2,0.08].map((d,i) => <WaveBar key={i} delay={d} />)}
              </div>
              {(transcript || interim) && (
                <div className="mt-3 text-sm px-4 py-2 rounded-xl"
                  style={{ background:'rgba(0,0,0,0.3)', color:'rgba(250,245,240,0.6)' }}>
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
              {transcript && (
                <div className="text-sm px-4 py-2 rounded-xl"
                  style={{ background:'rgba(0,0,0,0.3)', color:'rgba(250,245,240,0.5)' }}>
                  "{transcript}"
                </div>
              )}
              {hasDetection ? (
                <>
                  <div className="text-sm font-bold" style={{ color:'rgba(250,245,240,0.5)' }}>{s.detected}</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {pills.map(p => <Pill key={p.key} {...p} />)}
                  </div>
                  <div className="flex justify-center gap-3 pt-1">
                    <button onClick={applyAndReset}
                      className="px-7 py-3 rounded-full font-black text-base text-white transition-all active:scale-95"
                      style={{ background:'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow:'0 0 20px rgba(220,38,38,0.3)' }}>
                      {s.applyStep}
                    </button>
                    <button onClick={retry}
                      className="px-5 py-3 rounded-full font-bold text-base transition-all active:scale-95"
                      style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(250,245,240,0.4)' }}>
                      {s.retry}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm" style={{ color:'rgba(250,245,240,0.4)' }}>{s.noMatch}</div>
                  <button onClick={retry}
                    className="px-8 py-3 rounded-full font-bold text-base transition-all active:scale-95"
                    style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.35)', color:'#fbbf24' }}>
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
