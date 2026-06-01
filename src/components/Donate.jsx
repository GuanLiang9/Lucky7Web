import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

// ── PayNow QR generator (EMVCo / SGQR spec) ──────────────────────────────────
// CRC-16/CCITT-FALSE: init=0xFFFF, poly=0x1021, no reflection

function crc16(str) {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function tlv(tag, value) {
  return `${tag}${String(value.length).padStart(2, '0')}${value}`
}

function buildPayNowQR(mobile, name = '') {
  const proxy = `+65${mobile.replace(/^(\+65|65)/, '')}`   // e.g. +6593228017
  const inner =
    tlv('00', 'SG.PAYNOW') +
    tlv('01', '0') +          // proxy type 0 = mobile number
    tlv('02', proxy) +
    tlv('03', '1') +          // editable amount = yes
    tlv('04', '00000000')     // no expiry
  const body =
    tlv('00', '01') +         // payload format indicator
    tlv('01', '11') +         // static QR
    tlv('26', inner) +        // merchant account info (PayNow)
    tlv('52', '0000') +       // MCC
    tlv('53', '702') +        // currency SGD
    tlv('58', 'SG') +         // country
    (name ? tlv('59', name.slice(0, 25)) : '') +
    tlv('60', 'Singapore') +  // city
    '6304'                    // CRC tag
  return body + crc16(body)
}

const MOBILE     = '93228017'
const NAME       = 'Lucky7'
const PAYNOW_QR  = buildPayNowQR(MOBILE, NAME)

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
            <QRCodeSVG
              value={PAYNOW_QR}
              size={200}
              bgColor="#ffffff"
              fgColor="#1a0000"
              level="M"
            />
          </div>

          {/* Scan instruction */}
          <p className="text-sm" style={{ color: 'rgba(250,245,240,0.4)' }}>
            Scan with any Singapore banking app · 用任何银行应用扫码
          </p>

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
