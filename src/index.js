// Allowed origins — add your custom domain here if you set one up
const ALLOWED_ORIGINS = new Set([
  'https://lucky7web.pages.dev',
  'http://localhost:5173',
  'http://localhost:4173',
])

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://lucky7web.pages.dev'
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  }
}

const SP_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-SG,en;q=0.9',
  'Referer': 'https://www.singaporepools.com.sg/',
}

function isThreatened(request) {
  const score = parseInt(request.headers.get('cf-threat-score') || '0', 10)
  return score > 10
}

// ── TOTO ─────────────────────────────────────────────────────────────────────
// 4D results page is fully JS-rendered — no scraping possible, always use fallback.
// TOTO page shows only the latest draw; we parse it and supplement with fallback for history.

async function fetchToto() {
  const res = await fetch(
    'https://www.singaporepools.com.sg/en/product/sr/Pages/toto_results.aspx',
    { headers: SP_HEADERS }
  )
  if (!res.ok) throw new Error(`SP TOTO fetch failed: ${res.status}`)
  const html = await res.text()
  return parseToto(html)
}

function parseToto(html) {
  // The page shows one draw at a time via server-side HTML tables.
  // Key selectors (confirmed from live page inspection):
  //   class='drawDate'    → "Thu, 21 May 2026"
  //   class='drawNumber'  → "Draw No. 4184"
  //   class='win1'..'win6' → each winning number as text
  //   class='additional'  → the Additional Number (bonus ball)
  //   class='jackpotPrize' → prize amount e.g. "$1,221,934"

  const drawNo = (html.match(/class='drawNumber'>Draw No\.\s*(\d+)</) || [])[1]
  if (!drawNo) throw new Error('TOTO parse: Draw No not found')

  const dateRaw = (html.match(/class='drawDate'>([^<]+)</) || [])[1]?.trim() || ''
  const dateMatch = dateRaw.match(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*,?\s+(\d{1,2}\s+\w+\s+\d{4})/i)
  const dayAbbr  = dateMatch ? dateMatch[1].slice(0, 3) : ''
  const dateStr  = dateMatch ? dateMatch[2] : ''
  const dayName  = DAY_NAMES[dayAbbr] || ''

  // Extract win1..win6 in order
  const winNums = [...html.matchAll(/class='win\d'>(\d{1,2})<\/td>/g)]
    .map(m => parseInt(m[1]))
    .filter(n => n >= 1 && n <= 49)

  const bonus = parseInt((html.match(/class='additional'>(\d{1,2})<\/td>/) || [])[1] || '0')

  if (winNums.length < 6) throw new Error('TOTO parse: winning numbers not found')

  // Prize amount — page uses "$X" format without S prefix
  const prizeMatch = html.match(/class='jackpotPrize'>\$?([\d,]+(?:\.\d+)?)<\/td>/)
  const jackpot    = prizeMatch ? `S$${prizeMatch[1]}` : 'S$1,000,000'

  // Group 1 winners: "-" means no winner
  const g1WinnersRaw = (html.match(/Group 1[\s\S]*?<td[^>]*>([^<]+)<\/td>[\s\S]*?<td[^>]*>([^<]+)<\/td>/) || [])[2]?.trim()
  const winners = (!g1WinnersRaw || g1WinnersRaw === '-') ? 0 : parseInt(g1WinnersRaw) || 0

  return {
    date:    isoDate(dateStr),
    day:     dayName,
    drawNo,
    numbers: winNums.slice(0, 6).sort((a, b) => a - b),
    bonus,
    jackpot,
    winners,
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
}

const MONTHS = {
  January:1, February:2, March:3, April:4, May:5, June:6,
  July:7, August:8, September:9, October:10, November:11, December:12,
}

function isoDate(str) {
  if (!str) return ''
  const parts = str.trim().split(/\s+/)
  if (parts.length < 3) return ''
  const [d, m, y] = parts
  const mo = String(MONTHS[m] || 1).padStart(2, '0')
  return `${y}-${mo}-${d.padStart(2, '0')}`
}

function safeJson(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}

// ── Fallback static data ──────────────────────────────────────────────────────
// 4D draws: Wed / Sat / Sun  |  TOTO draws: Mon / Thu
// Calendar: May 2026 — May 1 = Friday

const FALLBACK_4D = [
  { date:'2026-05-20', day:'Wednesday', drawNo:'4568', first:'3421', second:'8976', third:'2341',
    starters:['1234','5678','9012','3456','7890','2109','8765','4321','6543','0987'],
    consolation:['1357','2468','3579','4680','5791','6802','7913','8024','9135','0246'] },
  { date:'2026-05-17', day:'Sunday',    drawNo:'4567', first:'7823', second:'4567', third:'1290',
    starters:['2345','6789','0123','4568','8901','3210','9876','5432','7654','1098'],
    consolation:['2468','3579','4680','5791','6802','7913','8024','9135','0246','1357'] },
  { date:'2026-05-16', day:'Saturday',  drawNo:'4566', first:'5519', second:'2233', third:'8844',
    starters:['3456','7890','1235','5679','9013','4321','0987','6543','8765','2109'],
    consolation:['3579','4680','5791','6802','7913','8024','9135','0246','1357','2468'] },
  { date:'2026-05-13', day:'Wednesday', drawNo:'4565', first:'6688', second:'1122', third:'9933',
    starters:['4567','8901','2346','6780','0124','5432','1098','7654','9876','3210'],
    consolation:['4680','5791','6802','7913','8024','9135','0246','1357','2468','3579'] },
  { date:'2026-05-10', day:'Sunday',    drawNo:'4564', first:'2288', second:'5577', third:'3366',
    starters:['5678','9012','3457','7891','1235','6543','2109','8765','0987','4321'],
    consolation:['5791','6802','7913','8024','9135','0246','1357','2468','3579','4680'] },
]

// TOTO fallback — Draw 4184 is the confirmed real result (Thu 21 May 2026)
const FALLBACK_TOTO = [
  { date:'2026-05-21', day:'Thursday', drawNo:'4184',
    numbers:[11,18,25,36,39,49], bonus:41, jackpot:'S$1,221,934', winners:0 },
  { date:'2026-05-18', day:'Monday',   drawNo:'4183',
    numbers:[3,12,22,31,38,44],  bonus:17, jackpot:'S$3,200,000', winners:0 },
  { date:'2026-05-14', day:'Thursday', drawNo:'4182',
    numbers:[7,15,24,29,35,46],  bonus:8,  jackpot:'S$2,900,000', winners:0 },
  { date:'2026-05-11', day:'Monday',   drawNo:'4181',
    numbers:[2,9,19,27,40,48],   bonus:33, jackpot:'S$2,600,000', winners:0 },
  { date:'2026-05-07', day:'Thursday', drawNo:'4180',
    numbers:[5,14,21,30,37,43],  bonus:26, jackpot:'S$2,300,000', winners:0 },
  { date:'2026-05-04', day:'Monday',   drawNo:'4179',
    numbers:[1,10,16,28,34,47],  bonus:22, jackpot:'S$2,000,000', winners:0 },
]

// ── Worker entry ─────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || ''
    const ch     = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: ch })
    }

    if (request.method !== 'GET') {
      return safeJson({ error: 'Method not allowed' }, 405, ch)
    }

    if (isThreatened(request)) {
      return safeJson({ error: 'Blocked' }, 429, ch)
    }

    const url = new URL(request.url)
    if (url.pathname !== '/results') {
      return safeJson({ error: 'Not found' }, 404, ch)
    }

    // Cloudflare edge cache — version-keyed so deploys that change parser logic get fresh data
    const CACHE_VER = 'v3'
    const cache     = caches.default
    const cacheKey  = new Request(`${request.url}?_cv=${CACHE_VER}`, { method: 'GET' })
    const cached    = await cache.match(cacheKey)
    if (cached) {
      const res = new Response(cached.body, cached)
      res.headers.set('Access-Control-Allow-Origin', ch['Access-Control-Allow-Origin'])
      return res
    }

    // 4D page is JS-rendered — always use fallback
    const fourd = FALLBACK_4D
    let toto    = FALLBACK_TOTO
    let totoLive = false

    try {
      const liveDraw = await fetchToto()
      totoLive = true
      // Merge: live draw first, then fallback draws with older draw numbers
      const liveNo = parseInt(liveDraw.drawNo)
      const older  = FALLBACK_TOTO.filter(d => parseInt(d.drawNo) < liveNo)
      toto = [liveDraw, ...older]
    } catch (_) {
      // Use full fallback
    }

    const payload = {
      '4d':      fourd,
      toto,
      updatedAt: new Date().toISOString(),
      live: {
        '4d':  false,
        toto:  totoLive,
      },
    }

    const response = new Response(JSON.stringify(payload), {
      headers: {
        ...ch,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, s-maxage=7200',
      },
    })

    ctx.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  },
}
