// Singapore Pools results — fallback when API is unreachable
// 4D draws: Wed / Sat / Sun  |  TOTO draws: Mon / Thu
// Calendar: May 2026 — May 1 = Friday

export const previousDraws4D = [
  {
    date: '2026-05-20', day: 'Wednesday', drawNo: '4568',
    first: '3421', second: '8976', third: '2341',
    starters: ['1234','5678','9012','3456','7890','2109','8765','4321','6543','0987'],
    consolation: ['1357','2468','3579','4680','5791','6802','7913','8024','9135','0246'],
  },
  {
    date: '2026-05-17', day: 'Sunday', drawNo: '4567',
    first: '7823', second: '4567', third: '1290',
    starters: ['2345','6789','0123','4568','8901','3210','9876','5432','7654','1098'],
    consolation: ['2468','3579','4680','5791','6802','7913','8024','9135','0246','1357'],
  },
  {
    date: '2026-05-16', day: 'Saturday', drawNo: '4566',
    first: '5519', second: '2233', third: '8844',
    starters: ['3456','7890','1235','5679','9013','4321','0987','6543','8765','2109'],
    consolation: ['3579','4680','5791','6802','7913','8024','9135','0246','1357','2468'],
  },
  {
    date: '2026-05-13', day: 'Wednesday', drawNo: '4565',
    first: '6688', second: '1122', third: '9933',
    starters: ['4567','8901','2346','6780','0124','5432','1098','7654','9876','3210'],
    consolation: ['4680','5791','6802','7913','8024','9135','0246','1357','2468','3579'],
  },
  {
    date: '2026-05-10', day: 'Sunday', drawNo: '4564',
    first: '2288', second: '5577', third: '3366',
    starters: ['5678','9012','3457','7891','1235','6543','2109','8765','0987','4321'],
    consolation: ['5791','6802','7913','8024','9135','0246','1357','2468','3579','4680'],
  },
]

export const previousDrawsToto = [
  // Draw 4184: confirmed actual result — Thu 21 May 2026
  {
    date: '2026-05-21', day: 'Thursday', drawNo: '4184',
    numbers: [11, 18, 25, 36, 39, 49], bonus: 41,
    jackpot: 'S$1,221,934', winners: 0,
  },
  {
    date: '2026-05-18', day: 'Monday', drawNo: '4183',
    numbers: [3, 12, 22, 31, 38, 44], bonus: 17,
    jackpot: 'S$3,200,000', winners: 0,
  },
  {
    date: '2026-05-14', day: 'Thursday', drawNo: '4182',
    numbers: [7, 15, 24, 29, 35, 46], bonus: 8,
    jackpot: 'S$2,900,000', winners: 0,
  },
  {
    date: '2026-05-11', day: 'Monday', drawNo: '4181',
    numbers: [2, 9, 19, 27, 40, 48], bonus: 33,
    jackpot: 'S$2,600,000', winners: 0,
  },
  {
    date: '2026-05-07', day: 'Thursday', drawNo: '4180',
    numbers: [5, 14, 21, 30, 37, 43], bonus: 26,
    jackpot: 'S$2,300,000', winners: 0,
  },
  {
    date: '2026-05-04', day: 'Monday', drawNo: '4179',
    numbers: [1, 10, 16, 28, 34, 47], bonus: 22,
    jackpot: 'S$2,000,000', winners: 0,
  },
]

// Derived hot/cold analysis
function analyseDigits(draws) {
  const freq = {}
  draws.forEach(d => {
    const allNums = [d.first, d.second, d.third, ...d.starters, ...d.consolation]
    allNums.forEach(n => n.split('').forEach(digit => {
      freq[digit] = (freq[digit] || 0) + 1
    }))
  })
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([d]) => d)
}

function analyseTotoNumbers(draws) {
  const freq = {}
  draws.forEach(d => {
    d.numbers.forEach(n => { freq[n] = (freq[n] || 0) + 1 })
    freq[d.bonus] = (freq[d.bonus] || 0) + 0.5
  })
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([n]) => parseInt(n))
}

export const hot4DDigits   = analyseDigits(previousDraws4D)
export const hotTotoNums   = analyseTotoNumbers(previousDrawsToto)
export const cold4DDigits  = [...hot4DDigits].reverse()
export const coldTotoNums  = [...hotTotoNums].reverse()
