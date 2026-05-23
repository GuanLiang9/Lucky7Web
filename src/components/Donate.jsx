import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

const PAYLAH_URL = 'https://www.dbs.com.sg/personal/mobile/paylink/index.html?tranRef=PyVoTRP44Q'

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
        <div className="mb-2 text-2xl">🪙</div>
        <h3 className="text-xl font-black mb-1" style={{ color: '#faf5f0' }}>
          Buy me a kopi
        </h3>
        <p className="text-sm mb-1" style={{ color: 'rgba(251,191,36,0.5)' }}>请我喝杯咖啡</p>
        <p className="text-xs mb-6" style={{ color: 'rgba(250,245,240,0.3)' }}>
          If Lucky7 helped you strike it lucky — a small treat is always appreciated! Totally optional.
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
          Any amount welcome · 多少随意
        </p>
      </div>
    </div>
  )
}
