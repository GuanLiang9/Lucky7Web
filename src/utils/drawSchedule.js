// Singapore Pools draw schedule — SGT-aware
// All draw results are released at 18:30 SGT (6:30 PM).
// After that time, the draw is over and we show the NEXT draw.

export const DRAW_4D   = [0, 3, 6]  // Sun=0, Wed=3, Sat=6
export const DRAW_TOTO = [1, 4]     // Mon=1, Thu=4

const SGT_OFFSET_MS  = 8 * 60 * 60 * 1000  // UTC+8
const DRAW_HOUR      = 18
const DRAW_MINUTE    = 30

// Current instant as an SGT Date (use .getUTC*() methods to read SGT fields)
function nowSgt() {
  return new Date(Date.now() + SGT_OFFSET_MS)
}

// Day-of-week (0–6) of any Date in SGT
function sgtDay(dateUtc) {
  return new Date(dateUtc.getTime() + SGT_OFFSET_MS).getUTCDay()
}

// Has the 18:30 SGT cutoff already passed today?
function drawPassedToday(sgt) {
  const h = sgt.getUTCHours()
  const m = sgt.getUTCMinutes()
  return h > DRAW_HOUR || (h === DRAW_HOUR && m >= DRAW_MINUTE)
}

/**
 * Returns a Date object for the next upcoming draw.
 *   - If TODAY is a draw day AND 18:30 SGT has NOT passed → returns today.
 *   - Otherwise returns the nearest future draw day.
 */
export function nextDrawDate(days) {
  const now = nowSgt()
  const todaySgt = now.getUTCDay()

  if (days.includes(todaySgt) && !drawPassedToday(now)) {
    return new Date()  // today — use local Date for formatting
  }

  for (let i = 1; i <= 7; i++) {
    const d = new Date(Date.now() + i * 24 * 60 * 60 * 1000)
    if (days.includes(sgtDay(d))) return d
  }
}

/**
 * Format a draw date for display, e.g. "Sat, 7 Jun · 6:30 PM"
 */
export function fmtDrawDate(d) {
  if (!d) return '—'
  const base = d.toLocaleDateString('en-SG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  return `${base} · 6:30 PM`
}

/**
 * Predict the draw number for the next draw by counting draw days
 * between the last known draw and the next draw date.
 */
export function nextDrawNo(draws, days) {
  if (!draws?.length) return null
  const last = draws[0]
  const next = nextDrawDate(days)
  if (!next) return null

  let count = 0
  const cursor = new Date(last.date)
  cursor.setDate(cursor.getDate() + 1)           // start day after last draw

  // Count how many draw days fall between last draw and next draw (inclusive)
  const nextDay = new Date(next)
  nextDay.setHours(23, 59, 59)                   // end of next draw day

  while (cursor <= nextDay) {
    if (days.includes(sgtDay(cursor))) count++
    cursor.setDate(cursor.getDate() + 1)
  }

  return String(parseInt(last.drawNo) + count)
}
