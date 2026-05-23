function seededRandom(seed) {
  let s = Math.abs(seed) || 1
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function getSeed(mood, dreamSeeds) {
  const now = new Date()
  const dateSeed = (now.getDate() + 1) * (now.getMonth() + 1) * ((now.getFullYear() % 100) + 1)
  const moodVal = Math.round((mood?.weight || 1) * 100)
  const dreamSum = dreamSeeds.reduce((a, b) => a + b, 0) || 50
  return ((dateSeed * moodVal) + dreamSum * 7) % 99991 + 1
}

// Pick an index from a weighted array using the given rng
function weightedPick(rng, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
}

// Build digit (0-9) weights from 4D draw history
// Starts with base weight 2 (Laplace smoothing) so every digit stays possible
function getDigitWeights(draws4D) {
  const freq = new Array(10).fill(2)
  if (!draws4D?.length) return freq
  draws4D.forEach(d => {
    const all = [d.first, d.second, d.third, ...(d.starters || []), ...(d.consolation || [])]
    all.forEach(n => n && n.split('').forEach(ch => { freq[parseInt(ch)] += 3 }))
  })
  return freq
}

// Build number (1-49) weights from TOTO draw history
// Index 0 is a placeholder; actual numbers are at indices 1-49
function getTotoWeights(drawsToto) {
  const freq = new Array(50).fill(2)
  if (!drawsToto?.length) return freq
  drawsToto.forEach(d => {
    ;(d.numbers || []).forEach(n => { freq[n] += 3 })
    if (d.bonus) freq[d.bonus] += 1
  })
  return freq
}

export function generate4DNumbers(mood, dreamSeeds, draws4D) {
  const seed = getSeed(mood, dreamSeeds)
  const rng = seededRandom(seed)
  const weights = getDigitWeights(draws4D)

  return [0, 1, 2].map(() =>
    Array.from({ length: 4 }, () => weightedPick(rng, weights)).join('')
  )
}

export function generateTotoNumbers(mood, dreamSeeds, drawsToto) {
  const seed = getSeed(mood, dreamSeeds) + 555
  const rng = seededRandom(seed)
  // weights[1..49] — slice off index 0 so weightedPick returns 0-based index, then +1
  const weights = getTotoWeights(drawsToto).slice(1)

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
  const newDigit = weightedPick(rng, weights).toString()
  return currentNumber.substring(0, position) + newDigit + currentNumber.substring(position + 1)
}

export function regenerateSingleTotoNumber(currentNumbers, index, mood, dreamSeeds, drawsToto) {
  const seed = getSeed(mood, dreamSeeds) + index * 777 + Date.now() % 991
  const rng = seededRandom(seed)
  const weights = getTotoWeights(drawsToto).slice(1)

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
