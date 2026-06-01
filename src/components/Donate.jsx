import React, { useState } from 'react'

const MOBILE = '93228017'

// ── God of Fortune icon ───────────────────────────────────────────────────────

function GodOfFortuneIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="rgba(251,191,36,0.08)" />
      <circle cx="36" cy="36" r="28" fill="rgba(220,38,38,0.07)" />
      <rect x="20" y="14" width="32" height="6" rx="3" fill="#dc2626" />
      <rect x="24" y="8"  width="24" height="8" rx="2" fill="#b91c1c" />
      <rect x="30" y="5"  width="12" height="5" rx="2" fill="#dc2626" />
      <circle cx="36" cy="7" r="2.5" fill="#fbbf24" />
      <ellipse cx="36" cy="30" rx="12" ry="13" fill="#f5c97a" />
      <ellipse cx="31" cy="27" rx="2" ry="2.2" fill="#1a0000" />
      <ellipse cx="41" cy="27" rx="2" ry="2.2" fill="#1a0000" />
      <circle cx="32" cy="26.2" r="0.7" fill="white" />
      <circle cx="42" cy="26.2" r="0.7" fill="white" />
      <path d="M28 24.5 Q31 23 34 24.5" stroke="#5c3a00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M38 24.5 Q41 23 44 24.5" stroke="#5c3a00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M31 33 Q36 37 41 33" stroke="#c0722a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M25 35 Q24 42 28 48 Q32 52 36 52 Q40 52 44 48 Q48 42 47 35" fill="white" opacity="0.9" />
      <path d="M18 46 Q16 58 18 66 L54 66 Q56 58 54 46 Q46 42 36 42 Q26 42 18 46Z" fill="#dc2626" />
      <path d="M28 42 Q36 50 44 42" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
      <ellipse cx="36" cy="57" rx="9" ry="5" fill="#fbbf24" />
      <ellipse cx="36" cy="55" rx="6" ry="3.5" fill="#f59e0b" />
      <ellipse cx="36" cy="54" rx="4" ry="2" fill="#fde68a" />
    </svg>
  )
}

// ── PayNow logo wordmark ──────────────────────────────────────────────────────

function PayNowBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-5 py-2"
      style={{ background: '#ef4444', boxShadow: '0 2px 12px rgba(239,68,68,0.35)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="white" fillOpacity="0.2" />
        <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-black text-sm text-white tracking-wide">PayNow</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Donate() {
  const [copied, setCopied] = useState(false)

  const copyNumber = () => {
    navigator.clipboard?.writeText(MOBILE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const saveQR = () => {
    const a = document.createElement('a')
    a.href = '/paynow-qr.jpg'
    a.download = 'lucky7-paynow-qr.jpg'
    a.click()
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-16">
      <div
        className="rounded-3xl p-6 sm:p-8 text-center"
        style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)' }}
      >
        {/* Header */}
        <div className="flex justify-center mb-3" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <GodOfFortuneIcon />
        </div>
        <h3 className="text-xl font-black mb-1" style={{ color: '#faf5f0' }}>
          Struck lucky? 财神 accepts offerings
        </h3>
        <p className="text-sm mb-1" style={{ color: 'rgba(251,191,36,0.6)' }}>赢了就回馈财神爷</p>
        <p className="text-sm mb-6" style={{ color: 'rgba(250,245,240,0.35)' }}>
          Winners who share a portion keep the Fortune God happy —
          and the blessings keep flowing. No pressure. 🙏
        </p>

        {/* PayNow QR */}
        <div className="flex flex-col items-center gap-4">
          <PayNowBadge />

          <div
            className="rounded-2xl p-4 inline-block"
            style={{
              background: '#fff',
              border: '3px solid rgba(239,68,68,0.5)',
              boxShadow: '0 0 36px rgba(239,68,68,0.15), 0 0 12px rgba(251,191,36,0.1)',
            }}
          >
            <img
              src="/paynow-qr.jpg"
              alt="PayNow QR Code"
              width={200}
              height={200}
              style={{ display: 'block', objectFit: 'cover' }}
            />
          </div>

          {/* Scan instruction + save */}
          <p className="text-sm" style={{ color: 'rgba(250,245,240,0.4)' }}>
            Scan with any Singapore banking app · 用任何银行应用扫码
          </p>
          <button
            onClick={saveQR}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs transition-opacity hover:opacity-70"
            style={{ border: '1px solid rgba(251,191,36,0.2)', color: 'rgba(251,191,36,0.5)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Save QR
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <div className="flex-1 h-px" style={{ background: 'rgba(251,191,36,0.15)' }} />
            <span className="text-xs" style={{ color: 'rgba(250,245,240,0.25)' }}>or transfer to</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(251,191,36,0.15)' }} />
          </div>

          {/* Mobile number — tap to copy */}
          <button
            onClick={copyNumber}
            className="flex flex-col items-center gap-1 rounded-2xl px-8 py-4 transition-all active:scale-95"
            style={{
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.25)',
            }}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(250,245,240,0.4)' }}>
              PayNow Mobile
            </span>
            <span className="text-3xl font-black tracking-widest" style={{ color: '#fbbf24' }}>
              {MOBILE.slice(0,4)} {MOBILE.slice(4)}
            </span>
            <span className="text-xs" style={{ color: copied ? '#34d399' : 'rgba(250,245,240,0.25)' }}>
              {copied ? '✓ Copied!' : 'tap to copy'}
            </span>
          </button>

          <p className="text-xs" style={{ color: 'rgba(250,245,240,0.15)' }}>
            Any amount · 随缘随意 · +65 {MOBILE.slice(0,4)} {MOBILE.slice(4)}
          </p>
        </div>
      </div>
    </div>
  )
}
