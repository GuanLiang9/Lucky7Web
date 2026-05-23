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

export function generate4DNumbers(mood, dreamSeeds) {
  const seed = getSeed(mood, dreamSeeds)
  const rng = seededRandom(seed)
  return [0, 1, 2].map(() =>
    Math.floor(rng() * 10000).toString().padStart(4, '0')
  )
}

export function generateTotoNumbers(mood, dreamSeeds) {
  const seed = getSeed(mood, dreamSeeds) + 555
  const rng = seededRandom(seed)
  const numbers = new Set()
  let attempts = 0
  while (numbers.size < 6 && attempts < 200) {
    numbers.add(Math.floor(rng() * 49) + 1)
    attempts++
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export function regenerateSingle4DDigit(currentNumber, position, mood, dreamSeeds) {
  const seed = getSeed(mood, dreamSeeds) + position * 1000 + Date.now() % 997
  const rng = seededRandom(seed)
  const newDigit = Math.floor(rng() * 10).toString()
  return currentNumber.substring(0, position) + newDigit + currentNumber.substring(position + 1)
}

export function regenerateSingleTotoNumber(currentNumbers, index, mood, dreamSeeds) {
  const seed = getSeed(mood, dreamSeeds) + index * 777 + Date.now() % 991
  const rng = seededRandom(seed)
  let newNum
  let attempts = 0
  do {
    newNum = Math.floor(rng() * 49) + 1
    attempts++
  } while (currentNumbers.includes(newNum) && attempts < 100)
  const updated = [...currentNumbers]
  updated[index] = newNum
  return updated.sort((a, b) => a - b)
}
