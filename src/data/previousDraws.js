// Singapore Pools results — fallback when API is unreachable.
// Real values snapshotted from singaporepools.com.sg on 2026-05-23.
// Live data flows in via fetchResults() and overrides this on success.

export const previousDraws4D = [
  {
    date: '2026-05-20', day: 'Wednesday', drawNo: '5485',
    first: '7699', second: '9517', third: '8945',
    starters:    ['1117','2873','3075','3722','5479','5720','7057','8567','8736','8812'],
    consolation: ['0582','0706','2066','2314','2937','4355','4683','7416','9345','9442'],
  },
  {
    date: '2026-05-17', day: 'Sunday', drawNo: '5484',
    first: '0368', second: '8885', third: '4558',
    starters:    ['0777','1776','4532','5227','6823','7075','8441','8802','9205','9672'],
    consolation: ['1871','2337','2662','3287','3608','5711','5975','6381','9826','9897'],
  },
  {
    date: '2026-05-16', day: 'Saturday', drawNo: '5483',
    first: '2735', second: '5857', third: '5182',
    starters:    ['2692','2805','5208','5291','6670','7746','8571','8886','9635','9893'],
    consolation: ['2274','2834','3287','3678','4908','5814','5862','7216','9071','9608'],
  },
  {
    date: '2026-05-13', day: 'Wednesday', drawNo: '5482',
    first: '0672', second: '0496', third: '6465',
    starters:    ['1457','2132','3540','6166','6847','7733','7865','8087','8229','9026'],
    consolation: ['0391','1374','1527','1663','2359','3819','5008','5031','7646','8003'],
  },
  {
    date: '2026-05-10', day: 'Sunday', drawNo: '5481',
    first: '7517', second: '1486', third: '4814',
    starters:    ['0047','0081','0327','0431','2259','2585','5535','6906','7976','9624'],
    consolation: ['0017','0738','1079','2171','2441','2679','2994','4979','6948','8281'],
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
    jackpot: 'S$3,009,849', winners: 1,
  },
  {
    date: '2026-05-14', day: 'Thursday', drawNo: '4182',
    numbers: [4, 8, 21, 25, 43, 46], bonus: 32,
    jackpot: 'S$1,242,409', winners: 0,
  },
  {
    date: '2026-05-11', day: 'Monday', drawNo: '4181',
    numbers: [6, 10, 25, 26, 34, 40], bonus: 30,
    jackpot: 'S$3,040,270', winners: 2,
  },
  {
    date: '2026-05-07', day: 'Thursday', drawNo: '4180',
    numbers: [2, 3, 8, 16, 20, 47], bonus: 10,
    jackpot: 'S$1,218,611', winners: 0,
  },
  {
    date: '2026-05-04', day: 'Monday', drawNo: '4179',
    numbers: [7, 18, 19, 30, 36, 48], bonus: 11,
    jackpot: 'S$12,813,283', winners: 1,
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
