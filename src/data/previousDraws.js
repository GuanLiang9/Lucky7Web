// Singapore Pools results — fallback when API is unreachable.
// Real values snapshotted from singaporepools.com.sg.
// Live data flows in via fetchResults() and overrides this on success.

export const previousDraws4D = [
  {
    date: '2026-05-20', day: 'Wednesday', drawNo: '5485',
    first: '7699', second: '9517', third: '8945',
    starters: [], consolation: [],
  },
  {
    date: '2026-05-17', day: 'Sunday', drawNo: '5484',
    first: '0368', second: '8885', third: '4558',
    starters: [], consolation: [],
  },
  {
    date: '2026-05-16', day: 'Saturday', drawNo: '5483',
    first: '2735', second: '5857', third: '5182',
    starters: [], consolation: [],
  },
  {
    date: '2026-05-13', day: 'Wednesday', drawNo: '5482',
    first: '0672', second: '0496', third: '6465',
    starters: [], consolation: [],
  },
  {
    date: '2026-05-10', day: 'Sunday', drawNo: '5481',
    first: '7517', second: '1486', third: '4814',
    starters: [], consolation: [],
  },
]

export const previousDrawsToto = [
  {
    date: '2026-05-21', day: 'Thursday', drawNo: '4184',
    numbers: [11, 18, 25, 36, 39, 49], bonus: 41,
    jackpot: 'S$1,221,934', winners: 0,
  },
  {
    date: '2026-05-18', day: 'Monday', drawNo: '4183',
    numbers: [7, 18, 32, 37, 41, 44], bonus: 19,
    jackpot: 'S$3,009,849', winners: 0,
  },
  {
    date: '2026-05-14', day: 'Thursday', drawNo: '4182',
    numbers: [4, 8, 21, 25, 43, 46], bonus: 32,
    jackpot: 'S$1,242,409', winners: 0,
  },
  {
    date: '2026-05-11', day: 'Monday', drawNo: '4181',
    numbers: [6, 10, 25, 26, 34, 40], bonus: 30,
    jackpot: 'S$3,040,270', winners: 0,
  },
  {
    date: '2026-05-07', day: 'Thursday', drawNo: '4180',
    numbers: [2, 3, 8, 16, 20, 47], bonus: 10,
    jackpot: 'S$1,218,611', winners: 0,
  },
  {
    date: '2026-05-04', day: 'Monday', drawNo: '4179',
    numbers: [7, 18, 19, 30, 36, 48], bonus: 11,
    jackpot: 'S$12,813,283', winners: 0,
  },
]

// Derived hot/cold analysis — guard against bonus===0 polluting the index
function analyseDigits(draws) {
  const freq = {}
  draws.forEach(d => {
    const allNums = [d.first, d.second, d.third, ...d.starters, ...d.consolation]
    allNums.forEach(n => n && n.split('').forEach(digit => {
      freq[digit] = (freq[digit] || 0) + 1
    }))
  })
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([d]) => d)
}

function analyseTotoNumbers(draws) {
  const freq = {}
  draws.forEach(d => {
    d.numbers.forEach(n => {
      if (n >= 1 && n <= 49) freq[n] = (freq[n] || 0) + 1
    })
    if (d.bonus >= 1 && d.bonus <= 49) {
      freq[d.bonus] = (freq[d.bonus] || 0) + 0.5
    }
  })
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([n]) => parseInt(n))
}

export const hot4DDigits  = analyseDigits(previousDraws4D)
export const hotTotoNums  = analyseTotoNumbers(previousDrawsToto)
export const cold4DDigits = [...hot4DDigits].reverse()
export const coldTotoNums = [...hotTotoNums].reverse()
