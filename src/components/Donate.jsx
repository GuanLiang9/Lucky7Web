import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

const PAYLAH_URL = 'https://www.dbs.com.sg/personal/mobile/paylink/index.html?tranRef=PyVoTRP44Q'

function GodOfFortuneIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow backdrop */}
      <circle cx="36" cy="36" r="34" fill="rgba(251,191,36,0.08)" />
      <circle cx="36" cy="36" r="28" fill="rgba(220,38,38,0.07)" />

      {/* Imperial hat / crown */}
      <rect x="20" y="14" width="32" height="6" rx="3" fill="#dc2626" />
      <rect x="24" y="8" width="24" height="8" rx="2" fill="#b91c1c" />
      <rect x="30" y="5" width="12" height="5" rx="2" fill="#dc2626" />
      {/* Hat jewel */}
      <circle cx="36" cy="7" r="2.5" fill="#fbbf24" />

      {/* Face */}
      <ellipse cx="36" cy="30" rx="12" ry="13" fill="#f5c97a" />

      {/* Eyes */}
      <ellipse cx="31" cy="27" rx="2" ry="2.2" fill="#1a0000" />
      <ellipse cx="41" cy="27" rx="2" ry="2.2" fill="#1a0000" />
      {/* Eye shine */}
      <circle cx="32" cy="26.2" r="0.7" fill="white" />
      <circle cx="42" cy="26.2" r="0.7" fill="white" />

      {/* Eyebrows — wise & bushy */}
      <path d="M28 24.5 Q31 23 34 24.5" stroke="#5c3a00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M38 24.5 Q41 23 44 24.5" stroke="#5c3a00" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Smile */}
      <path d="M31 33 Q36 37 41 33" stroke="#c0722a" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* Beard */}
      <path d="M25 35 Q24 42 28 48 Q32 52 36 52 Q40 52 44 48 Q48 42 47 35" fill="white" opacity="0.9" />
      <path d="M28 36 Q27 43 30 48" stroke="rgba(200,200,200,0.4)" strokeWidth="0.8" fill="none" />
      <path d="M36 37 Q36 45 36 51" stroke="rgba(200,200,200,0.4)" strokeWidth="0.8" fill="none" />
      <path d="M44 36 Q45 43 42 48" stroke="rgba(200,200,200,0.4)" strokeWidth="0.8" fill="none" />

      {/* Robe body */}
      <path d="M18 46 Q16 58 18 66 L54 66 Q56 58 54 46 Q46 42 36 42 Q26 42 18 46Z" fill="#dc2626" />
      {/* Robe collar */}
      <path d="M28 42 Q36 50 44 42" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
      {/* Robe trim */}
      <path d="M18 55 Q36 59 54 55" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.6" />

      {/* Gold ingot (元宝) held in front */}
      <ellipse cx="36" cy="57" rx="9" ry="5" fill="#fbbf24" />
      <ellipse cx="36" cy="55" rx="6" ry="3.5" fill="#f59e0b" />
      <ellipse cx="36" cy="54" rx="4" ry="2" fill="#fde68a" />
    </svg>
  )
}

export default function Donate() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 mb-16">
      <div
        className="rounded-3xl p-6 sm:p-8 text-center"
        style={{
          background: 'rgba(251,191,36,0.04)',
          border: '1px solid rgba(251,191,36,0.15)',
        }}
      >
        {/* Header */}
        <div className="flex justify-center mb-3" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <GodOfFortuneIcon />
        </div>
        <h3 className="text-xl font-black mb-1" style={{ color: '#faf5f0' }}>
          Struck lucky? 财神 accepts offerings
        </h3>
        <p className="text-sm mb-1" style={{ color: 'rgba(251,191,36,0.6)' }}>赢了就回馈财神爷</p>
        <p className="text-xs mb-6" style={{ color: 'rgba(250,245,240,0.35)' }}>
          Winners who share a portion of their windfall keep the Fortune God happy —
          and the blessings keep flowing. No pressure, totally from the heart. 🙏
        </p>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div
            className="rounded-2xl p-4 inline-block"
            style={{
              background: '#fff',
              border: '3px solid rgba(251,191,36,0.5)',
              boxShadow: '0 0 30px rgba(251,191,36,0.12)',
            }}
          >
            <QRCodeSVG
              value={PAYLAH_URL}
              size={180}
              bgColor="#ffffff"
              fgColor="#1a0000"
              level="M"
            />
          </div>
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f87171' }}>
            DBS PayLah!
          </span>
        </div>

        <p className="text-xs mb-5" style={{ color: 'rgba(250,245,240,0.35)' }}>
          Scan with your phone camera or banking app · 扫码即可付款
        </p>

        <p className="text-xs mt-2" style={{ color: 'rgba(250,245,240,0.15)' }}>
          Any amount, any time · 随缘随意
        </p>
      </div>
    </div>
  )
}
