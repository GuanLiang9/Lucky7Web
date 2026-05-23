import React, { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'

function crc16(str) {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1)
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
}

function buildPayNowQR(mobile) {
  const proxy = `+65${mobile}`
  const pad = (s) => String(s.length).padStart(2, '0')

  const sub = [
    `00${pad('SG.PAYNOW')}SG.PAYNOW`,
    `01011`,
    `02${pad(proxy)}${proxy}`,
    `03011`,
    `0400`,
  ].join('')

  const tag26 = `26${pad(sub)}${sub}`
  const body = `000201010211${tag26}520400005303702 5802SG6304`.replace(' ', '')
  return body + crc16(body)
}

export default function Donate() {
  const qrValue = useMemo(() => buildPayNowQR('93228017'), [])

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
        <div className="mb-2 text-2xl">🪙</div>
        <h3 className="text-xl font-black mb-1" style={{ color: '#faf5f0' }}>
          Buy me a kopi
        </h3>
        <p className="text-sm mb-1" style={{ color: 'rgba(251,191,36,0.5)' }}>请我喝杯咖啡</p>
        <p className="text-xs mb-6" style={{ color: 'rgba(250,245,240,0.3)' }}>
          If Lucky7 helped you strike it lucky — a small treat is always appreciated! Totally optional.
        </p>

        {/* QR Code */}
        <div className="flex justify-center mb-5">
          <div
            className="rounded-2xl p-4 inline-block"
            style={{
              background: '#fff',
              border: '3px solid rgba(251,191,36,0.5)',
              boxShadow: '0 0 30px rgba(251,191,36,0.12)',
            }}
          >
            <QRCodeSVG
              value={qrValue}
              size={180}
              bgColor="#ffffff"
              fgColor="#1a0000"
              level="M"
            />
          </div>
        </div>

        {/* PayNow label */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3"
          style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f87171' }}>
            PayNow
          </span>
        </div>

        <p className="text-sm font-bold mb-1" style={{ color: '#fbbf24' }}>+65 9322 8017</p>
        <p className="text-xs" style={{ color: 'rgba(250,245,240,0.25)' }}>
          Scan with DBS PayLah!, OCBC, UOB, or any PayNow-enabled app
        </p>

        <p className="text-xs mt-5" style={{ color: 'rgba(250,245,240,0.15)' }}>
          Any amount welcome · 多少随意 · You enter the amount yourself
        </p>
      </div>
    </div>
  )
}
