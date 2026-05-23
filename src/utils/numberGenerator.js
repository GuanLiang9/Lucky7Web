function seededRandom(seed) {
  let s = Math.abs(seed) || 1
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function getSeed(mood, dreamSeeds, iteration = 0) {
  const now = new Date()
  const dateSeed = (now.getDate() + 1) * (now.getMonth() + 1) * ((now.getFullYear() % 100) + 1)
  const moodVal = Math.round((mood?.weight || 1) * 100)
  const dreamSum = dreamSeeds.reduce((a, b) => a + b, 0) || 50
  return ((dateSeed * moodVal) + dreamSum * 7 + iteration * 1337) % 99991 + 1
}

function weightedPick(rng, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
}

// Digit (0-9) weights from full 4D draw history
function getDigitWeights(draws4D) {
  const freq = new Array(10).fill(2)
  if (!draws4D?.length) return freq
  draws4D.forEach(d => {
    const all = [d.first, d.second, d.third, ...(d.starters || []), ...(d.consolation || [])]
    all.forEach(n => n && n.split('').forEach(ch => { freq[parseInt(ch)] += 3 }))
  })
  return freq
}

// Number (1-49) weights from TOTO history; index 0 is unused placeholder
function getTotoWeights(drawsToto) {
  const freq = new Array(50).fill(2)
  if (!drawsToto?.length) return freq
  drawsToto.forEach(d => {
    ;(d.numbers || []).forEach(n => { freq[n] += 3 })
    if (d.bonus) freq[d.bonus] += 1
  })
  return freq
}

// All prize numbers from the most recent 4D draw
function lastDraw4DNumbers(draws4D) {
  if (!draws4D?.length) return new Set()
  const d = draws4D[0]
  return new Set(
    [d.first, d.second, d.third, ...(d.starters || []), ...(d.consolation || [])].filter(Boolean)
  )
}

// All numbers from the most recent TOTO draw (main + bonus)
function lastDrawTotoNumbers(drawsToto) {
  if (!drawsToto?.length) return new Set()
  const d = drawsToto[0]
  return new Set([...(d.numbers || []), d.bonus].filter(Boolean))
}

export function generate4DNumbers(mood, dreamSeeds, draws4D, iteration = 0) {
  const seed = getSeed(mood, dreamSeeds, iteration)
  const rng = seededRandom(seed)
  const weights = getDigitWeights(draws4D)
  const excluded = lastDraw4DNumbers(draws4D)
  const used = new Set()

  return [0, 1, 2].map(() => {
    let num
    let attempts = 0
    do {
      num = Array.from({ length: 4 }, () => weightedPick(rng, weights)).join('')
      attempts++
    } while ((excluded.has(num) || used.has(num)) && attempts < 300)
    used.add(num)
    return num
  })
}

export function generateTotoNumbers(mood, dreamSeeds, drawsToto, iteration = 0) {
  const seed = getSeed(mood, dreamSeeds, iteration) + 555
  const rng = seededRandom(seed)

  // Start from frequency weights
  const weights = getTotoWeights(drawsToto).slice(1) // 49 elements, index i → number i+1

  // Hard-exclude last draw's numbers and bonus
  lastDrawTotoNumbers(drawsToto).forEach(n => {
    if (n >= 1 && n <= 49) weights[n - 1] = 0
  })

  // Boost numbers absent from the last 2 draws (overdue = statistically due)
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

export function regenerateSingle4DDigit(currentNumber, position, mood, dreamSeeds, draws4D) {
  const seed = getSeed(mood, dreamSeeds) + position * 1000 + Date.now() % 997
  const rng = seededRandom(seed)
  const weights = getDigitWeights(draws4D)
  const excluded = lastDraw4DNumbers(draws4D)

  let candidate
  let attempts = 0
  do {
    const digits = currentNumber.split('')
    digits[position] = weightedPick(rng, weights).toString()
    candidate = digits.join('')
    attempts++
  } while (excluded.has(candidate) && attempts < 50)

  return candidate
}

export function regenerateSingleTotoNumber(currentNumbers, index, mood, dreamSeeds, drawsToto) {
  const seed = getSeed(mood, dreamSeeds) + index * 777 + Date.now() % 991
  const rng = seededRandom(seed)
  const weights = getTotoWeights(drawsToto).slice(1)

  // Exclude last draw numbers from swap too
  lastDrawTotoNumbers(drawsToto).forEach(n => {
    if (n >= 1 && n <= 49) weights[n - 1] = 0
  })

  let newNum
  let attempts = 0
  do {
    newNum = weightedPick(rng, weights) + 1
    attempts++
  } while (currentNumbers.includes(newNum) && attempts < 200)

  const updated = [...currentNumbers]
  updated[index] = newNum
  return updated.sort((a, b) => a - b)
}
