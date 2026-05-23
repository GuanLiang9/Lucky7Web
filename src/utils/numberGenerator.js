// ── Core hash / PRNG ─────────────────────────────────────────────────────────

function mix32(a, b) {
  let h = ((a >>> 0) ^ Math.imul(b >>> 0, 0x9e3779b9)) >>> 0
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0
  return (h ^ (h >>> 16)) >>> 0
}

function seededRandom(seed) {
  let s = (seed >>> 0) || 1
  return () => {
    s = (s ^ (s << 13)) >>> 0
    s = (s ^ (s >>> 17)) >>> 0
    s = (s ^ (s << 5)) >>> 0
    return s / 4294967296
  }
}

// ── Seed construction ─────────────────────────────────────────────────────────
// sessionSeed is the dominant input — same mood+dreams on the same day still
// produces different numbers for every browser session.

function getSeed(mood, dreams, iteration = 0, sessionSeed = 0) {
  const now = new Date()
  const dateVal = now.getDate() * 31 + (now.getMonth() + 1) * 373 + (now.getFullYear() % 100) * 4093

  const moodStr = mood?.id || 'neutral'
  const moodVal = Math.round((mood?.weight || 1) * 1000) +
    Array.from(moodStr).reduce((a, c, i) => a + c.charCodeAt(0) * (i * 31 + 7), 0)

  const dreamArr = Array.isArray(dreams) ? dreams : []
  const dreamHash = dreamArr.reduce(
    (h, d, i) => mix32(h, ((typeof d === 'object' ? (d.seed || 0) : (d || 0)) * (i + 3) + 42) >>> 0),
    (dreamArr.length * 1234567 + 1) >>> 0
  )

  let seed = mix32((sessionSeed + 1) >>> 0, dateVal >>> 0)
  seed = mix32(seed, moodVal >>> 0)
  seed = mix32(seed, dreamHash)
  seed = mix32(seed, (iteration * 1000003 + 1) >>> 0)
  return (seed % 99991) + 1
}

// ── Mood & dream influence tables ─────────────────────────────────────────────

// Per-mood digit weight multipliers [digit 0..9]
const MOOD_DIGIT_MULT = {
  lucky:       [1.0, 1.5, 1.0, 1.2, 1.0, 1.0, 2.0, 2.5, 2.0, 1.8],
  hopeful:     [1.0, 1.8, 1.0, 1.5, 1.0, 1.0, 1.2, 1.5, 2.0, 1.8],
  dreamy:      [1.8, 1.0, 1.0, 2.0, 1.0, 1.0, 1.5, 1.0, 1.0, 2.2],
  adventurous: [1.0, 1.0, 1.0, 1.0, 1.5, 1.8, 1.8, 1.5, 1.0, 1.0],
  calm:        [1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 2.0, 1.0, 2.0, 1.0],
  excited:     [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 2.0, 2.5, 2.2],
  spiritual:   [1.0, 1.5, 1.0, 2.5, 1.0, 1.0, 1.0, 2.5, 1.0, 2.0],
  grateful:    [1.0, 1.8, 1.0, 1.0, 1.0, 1.0, 2.5, 1.0, 2.5, 1.5],
  confident:   [1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.5, 1.0, 2.5, 2.0],
  romantic:    [1.0, 1.0, 1.5, 1.5, 1.0, 2.0, 2.5, 1.0, 1.5, 1.0],
  anxious:     [1.5, 2.0, 2.0, 1.0, 1.5, 1.0, 1.0, 1.0, 1.0, 1.0],
  blessed:     [1.0, 1.2, 1.0, 1.0, 1.0, 1.5, 2.0, 1.0, 3.0, 1.5],
  nostalgic:   [1.0, 1.5, 1.5, 1.0, 2.0, 2.0, 1.5, 1.0, 1.0, 1.0],
  determined:  [1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 2.5, 2.0],
  peaceful:    [1.5, 1.0, 2.0, 1.0, 2.0, 1.0, 2.0, 1.0, 2.0, 1.0],
  mysterious:  [2.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 2.5, 1.0, 1.5],
}

// Per-dream digit boosts: [[digit, multiplier], ...]
const DREAM_DIGIT_BOOSTS = {
  dragon:    [[8, 3.0], [6, 2.0]],
  tiger:     [[3, 2.5], [7, 2.5]],
  fish:      [[5, 2.0], [6, 2.0]],
  bird:      [[2, 2.0], [3, 1.8]],
  snake:     [[1, 2.0], [4, 2.0], [6, 1.5]],
  rabbit:    [[4, 2.0], [5, 2.0]],
  water:     [[2, 2.0], [7, 2.0]],
  fire:      [[1, 2.0], [9, 2.5], [8, 1.5]],
  mountain:  [[5, 2.0], [8, 2.0]],
  rainbow:   [[7, 2.0], [8, 1.8], [3, 1.5]],
  lightning: [[1, 2.5], [7, 2.0]],
  moon:      [[0, 2.0], [3, 2.0], [8, 1.5]],
  gold:      [[9, 2.5], [8, 2.5], [6, 2.0]],
  gems:      [[8, 2.0], [4, 2.0], [7, 1.5]],
  car:       [[2, 2.0], [6, 2.0]],
  house:     [[5, 1.8], [2, 1.8], [8, 1.5]],
  wedding:   [[6, 2.5], [8, 2.5], [9, 1.5]],
  baby:      [[1, 2.5], [7, 2.0], [0, 1.5]],
  ancestor:  [[4, 2.0], [9, 2.0], [1, 1.5]],
  stranger:  [[3, 2.0], [5, 2.0]],
  celebrity: [[6, 2.0], [8, 2.5]],
  child:     [[2, 2.0], [5, 2.0]],
  lover:     [[5, 2.0], [6, 2.5], [8, 1.5]],
  boss:      [[1, 2.0], [8, 2.5]],
}

// Mood TOTO range biases: low=1–16, mid=17–33, high=34–49
const MOOD_TOTO_RANGE = {
  lucky:       { low: 1.0, mid: 1.2, high: 1.5 },
  hopeful:     { low: 1.1, mid: 1.2, high: 1.4 },
  dreamy:      { low: 1.3, mid: 1.0, high: 1.1 },
  adventurous: { low: 0.9, mid: 1.1, high: 1.7 },
  calm:        { low: 1.5, mid: 1.2, high: 0.8 },
  excited:     { low: 0.8, mid: 1.0, high: 1.7 },
  spiritual:   { low: 1.2, mid: 1.5, high: 1.0 },
  grateful:    { low: 1.2, mid: 1.3, high: 1.2 },
  confident:   { low: 1.0, mid: 1.2, high: 1.6 },
  romantic:    { low: 1.3, mid: 1.4, high: 1.0 },
  anxious:     { low: 1.5, mid: 1.0, high: 0.8 },
  blessed:     { low: 1.1, mid: 1.2, high: 1.4 },
  nostalgic:   { low: 1.4, mid: 1.2, high: 0.9 },
  determined:  { low: 1.0, mid: 1.1, high: 1.6 },
  peaceful:    { low: 1.4, mid: 1.2, high: 0.9 },
  mysterious:  { low: 1.0, mid: 1.6, high: 1.0 },
}

// Dream TOTO boosts: range multipliers + specific lucky numbers
const DREAM_TOTO_BOOSTS = {
  dragon:    { high: 1.5, lucky: [8, 18, 28, 38, 48] },
  tiger:     { mid:  1.4, lucky: [7, 17, 27, 37] },
  fish:      { low:  1.4, lucky: [5, 6, 15, 16] },
  bird:      { high: 1.3, lucky: [23, 33, 43] },
  snake:     { low:  1.5, lucky: [4, 14, 24] },
  rabbit:    { low:  1.3, lucky: [4, 5, 14, 45] },
  water:     { mid:  1.3, lucky: [2, 7, 22, 27] },
  fire:      { high: 1.5, lucky: [1, 9, 19, 39, 49] },
  mountain:  { mid:  1.2, lucky: [5, 8, 25, 35] },
  rainbow:   { mid:  1.4, lucky: [7, 17, 27, 37] },
  lightning: { high: 1.4, lucky: [1, 11, 41] },
  moon:      { low:  1.2, lucky: [3, 8, 13, 38] },
  gold:      { high: 1.5, lucky: [9, 19, 29, 39, 49] },
  gems:      { mid:  1.3, lucky: [4, 8, 14, 28, 48] },
  car:       { mid:  1.2, lucky: [2, 6, 26] },
  house:     { low:  1.3, lucky: [5, 8, 12, 25] },
  wedding:   { mid:  1.4, lucky: [6, 8, 16, 18] },
  baby:      { low:  1.4, lucky: [1, 7, 17] },
  ancestor:  { low:  1.3, lucky: [4, 9, 14, 49] },
  stranger:  { mid:  1.2, lucky: [3, 5, 23, 35] },
  celebrity: { high: 1.3, lucky: [6, 8, 16, 28] },
  child:     { low:  1.3, lucky: [2, 5, 12, 25] },
  lover:     { mid:  1.4, lucky: [5, 6, 15, 26] },
  boss:      { high: 1.3, lucky: [1, 8, 18, 48] },
}

// ── Weight builders ───────────────────────────────────────────────────────────

function weightedPick(rng, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
}

function getDreamObjects(dreams) {
  if (!Array.isArray(dreams)) return []
  return dreams.filter(d => d && typeof d === 'object' && d.id)
}

function getDigitWeights(draws4D, mood, dreams) {
  const freq = new Array(10).fill(2)
  draws4D?.forEach(d => {
    const all = [d.first, d.second, d.third, ...(d.starters || []), ...(d.consolation || [])]
    all.forEach(n => n?.split('').forEach(ch => { freq[parseInt(ch)] += 3 }))
  })
  const moodMults = MOOD_DIGIT_MULT[mood?.id] || new Array(10).fill(1.0)
  for (let i = 0; i < 10; i++) freq[i] = Math.round(freq[i] * moodMults[i])
  getDreamObjects(dreams).forEach(dream => {
    DREAM_DIGIT_BOOSTS[dream.id]?.forEach(([digit, mult]) => {
      freq[digit] = Math.round(freq[digit] * mult)
    })
  })
  return freq
}

function getTotoWeights(drawsToto, mood, dreams) {
  const freq = new Array(50).fill(2)
  drawsToto?.forEach(d => {
    ;(d.numbers || []).forEach(n => { freq[n] += 3 })
    if (d.bonus) freq[d.bonus] += 1
  })
  const rangeMult = MOOD_TOTO_RANGE[mood?.id] || { low: 1, mid: 1, high: 1 }
  for (let i = 1; i <= 49; i++) {
    const rm = i <= 16 ? rangeMult.low : i <= 33 ? rangeMult.mid : rangeMult.high
    freq[i] = Math.round(freq[i] * rm)
  }
  getDreamObjects(dreams).forEach(dream => {
    const boost = DREAM_TOTO_BOOSTS[dream.id]
    if (!boost) return
    for (let i = 1; i <= 49; i++) {
      const key = i <= 16 ? 'low' : i <= 33 ? 'mid' : 'high'
      if (boost[key]) freq[i] = Math.round(freq[i] * boost[key])
    }
    boost.lucky?.forEach(n => { if (n >= 1 && n <= 49) freq[n] = Math.round(freq[n] * 1.6) })
  })
  return freq
}

function lastDraw4DNumbers(draws4D) {
  if (!draws4D?.length) return new Set()
  const d = draws4D[0]
  return new Set([d.first, d.second, d.third, ...(d.starters || []), ...(d.consolation || [])].filter(Boolean))
}

function lastDrawTotoNumbers(drawsToto) {
  if (!drawsToto?.length) return new Set()
  const d = drawsToto[0]
  return new Set([...(d.numbers || []), d.bonus].filter(Boolean))
}

// ── Lucky number generation ───────────────────────────────────────────────────

export function generate4DNumbers(mood, dreams, draws4D, iteration = 0, sessionSeed = 0) {
  const seed = getSeed(mood, dreams, iteration, sessionSeed)
  const rng = seededRandom(seed)
  const weights = getDigitWeights(draws4D, mood, dreams)
  const excluded = lastDraw4DNumbers(draws4D)
  const used = new Set()

  return [0, 1, 2].map(() => {
    let num, attempts = 0
    do {
      num = Array.from({ length: 4 }, () => weightedPick(rng, weights)).join('')
      attempts++
    } while ((excluded.has(num) || used.has(num)) && attempts < 300)
    used.add(num)
    return num
  })
}

export function generateTotoNumbers(mood, dreams, drawsToto, iteration = 0, sessionSeed = 0) {
  const seed = getSeed(mood, dreams, iteration, sessionSeed) + 555
  const rng = seededRandom(seed)
  const weights = getTotoWeights(drawsToto, mood, dreams).slice(1)

  lastDrawTotoNumbers(drawsToto).forEach(n => {
    if (n >= 1 && n <= 49) weights[n - 1] = 0
  })

  const recentNums = new Set()
  drawsToto?.slice(0, 2).forEach(d => {
    ;(d.numbers || []).forEach(n => recentNums.add(n))
    if (d.bonus) recentNums.add(d.bonus)
  })
  for (let i = 0; i < weights.length; i++) {
    if (weights[i] > 0 && !recentNums.has(i + 1)) weights[i] = Math.round(weights[i] * 1.6)
  }

  const numbers = new Set()
  let attempts = 0
  while (numbers.size < 6 && attempts < 500) {
    numbers.add(weightedPick(rng, weights) + 1)
    attempts++
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export function regenerateSingle4DDigit(currentNumber, position, mood, dreams, draws4D) {
  const seed = getSeed(mood, dreams) + position * 1000 + (Date.now() % 99991)
  const rng = seededRandom(seed)
  const weights = getDigitWeights(draws4D, mood, dreams)
  const excluded = lastDraw4DNumbers(draws4D)

  let candidate, attempts = 0
  do {
    const digits = currentNumber.split('')
    digits[position] = weightedPick(rng, weights).toString()
    candidate = digits.join('')
    attempts++
  } while (excluded.has(candidate) && attempts < 50)

  return candidate
}

export function regenerateSingleTotoNumber(currentNumbers, index, mood, dreams, drawsToto) {
  const seed = getSeed(mood, dreams) + index * 777 + (Date.now() % 99991)
  const rng = seededRandom(seed)
  const weights = getTotoWeights(drawsToto, mood, dreams).slice(1)

  lastDrawTotoNumbers(drawsToto).forEach(n => {
    if (n >= 1 && n <= 49) weights[n - 1] = 0
  })

  let newNum, attempts = 0
  do {
    newNum = weightedPick(rng, weights) + 1
    attempts++
  } while (currentNumbers.includes(newNum) && attempts < 200)

  const updated = [...currentNumbers]
  updated[index] = newNum
  return updated.sort((a, b) => a - b)
}

// ── Statistical predictions ───────────────────────────────────────────────────

export function predictNumbers4D(draws4D, mood = null, dreams = []) {
  if (!draws4D?.length) return null

  const digitFreq = new Array(10).fill(0)
  const digitRecent = new Array(10).fill(0)

  draws4D.forEach((d, idx) => {
    const all = [d.first, d.second, d.third, ...(d.starters || []), ...(d.consolation || [])]
    all.forEach(n => n?.split('').forEach(ch => {
      const digit = parseInt(ch)
      digitFreq[digit]++
      if (idx < 5) digitRecent[digit]++
    }))
  })

  const hot = digitFreq
    .map((f, i) => ({ digit: i, score: digitRecent[i] * 2 + f }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4).map(x => x.digit)

  const cold = digitFreq
    .map((f, i) => ({ digit: i, score: digitRecent[i] * 3 + f }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4).map(x => x.digit)

  // Build weights: historical freq + mood/dream influence + overdue boost
  const weights = getDigitWeights(draws4D, mood, dreams).map((w, i) => {
    const overdueFactor = digitRecent[i] === 0 ? 1.8 : 1.0
    return Math.round(w * overdueFactor)
  })

  const histSeed = draws4D.slice(0, 3).reduce((h, d, i) => {
    return mix32(h, ((parseInt(d.first || '0') * (i + 1) * 1337) >>> 0))
  }, 42)
  const rng = seededRandom(histSeed)
  const excluded = lastDraw4DNumbers(draws4D)
  const used = new Set()

  const numbers = [0, 1, 2].map(() => {
    let num, attempts = 0
    do {
      num = Array.from({ length: 4 }, () => weightedPick(rng, weights)).join('')
      attempts++
    } while ((excluded.has(num) || used.has(num)) && attempts < 300)
    used.add(num)
    return num
  })

  return { numbers, hot: hot.slice(0, 3), cold: cold.slice(0, 3), drawsAnalyzed: draws4D.length }
}

export function predictNumbersToto(drawsToto, mood = null, dreams = []) {
  if (!drawsToto?.length) return null

  const freq = new Array(50).fill(0)
  const lastSeen = new Array(50).fill(drawsToto.length)

  drawsToto.forEach((d, drawIdx) => {
    ;(d.numbers || []).forEach(n => {
      if (n >= 1 && n <= 49) {
        freq[n]++
        if (lastSeen[n] === drawsToto.length) lastSeen[n] = drawIdx
      }
    })
    if (d.bonus >= 1 && d.bonus <= 49) {
      freq[d.bonus] += 0.5
      if (lastSeen[d.bonus] === drawsToto.length) lastSeen[d.bonus] = drawIdx
    }
  })

  const avgFreq = (freq.slice(1).reduce((a, b) => a + b, 0) / 49) || 1
  const lastDrawNums = new Set([...(drawsToto[0]?.numbers || []), drawsToto[0]?.bonus].filter(Boolean))

  const baseScores = freq.map((f, i) => {
    if (i === 0 || lastDrawNums.has(i)) return 0
    const overdueBonus = Math.min(lastSeen[i] / 3, 4)
    return (f / avgFreq) * 0.55 + overdueBonus * 0.45 + 0.1
  })

  // Blend with mood+dream weights for personalised prediction
  const moodWeights = getTotoWeights(drawsToto, mood, dreams)
  const combined = baseScores.map((s, i) =>
    i === 0 ? 0 : s * (moodWeights[i] / 5 + 0.5)
  )

  const candidates = combined
    .map((s, i) => ({ num: i, score: s }))
    .filter(x => x.num > 0 && x.score > 0)
    .sort((a, b) => b.score - a.score)

  const hot = candidates.slice(0, 4).map(x => x.num)
  const cold = [...candidates]
    .sort((a, b) => a.score - b.score)
    .filter(x => x.score > 0)
    .slice(0, 4).map(x => x.num)

  const histSeed = drawsToto.slice(0, 3).reduce((h, d, i) => {
    return mix32(h, (((d.numbers || [])[0] || 1) * (i + 2) * 999) >>> 0)
  }, 99)
  const rng = seededRandom(histSeed)

  const top20 = candidates.slice(0, 20)
  const top20Weights = top20.map(x => Math.max(x.score, 0.01))
  const chosen = new Set()
  let attempts = 0
  while (chosen.size < 6 && attempts < 500) {
    chosen.add(top20[weightedPick(rng, top20Weights)].num)
    attempts++
  }
  candidates.forEach(x => { if (chosen.size < 6 && x.score > 0) chosen.add(x.num) })

  return {
    numbers: Array.from(chosen).sort((a, b) => a - b),
    hot: hot.slice(0, 4),
    cold: cold.slice(0, 4),
    drawsAnalyzed: drawsToto.length,
  }
}
