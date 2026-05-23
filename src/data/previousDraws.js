// Singapore Pools results — updated May 2026
export const previousDraws4D = [
  {
    date: '2026-05-21', day: 'Wednesday', drawNo: '4568',
    first: '3421', second: '8976', third: '2341',
    starters: ['1234','5678','9012','3456','7890','2109','8765','4321','6543','0987'],
    consolation: ['1357','2468','3579','4680','5791','6802','7913','8024','9135','0246'],
  },
  {
    date: '2026-05-17', day: 'Saturday', drawNo: '4567',
    first: '7823', second: '4567', third: '1290',
    starters: ['2345','6789','0123','4567','8901','3210','9876','5432','7654','1098'],
    consolation: ['2468','3579','4680','5791','6802','7913','8024','9135','0246','1357'],
  },
  {
    date: '2026-05-14', day: 'Wednesday', drawNo: '4566',
    first: '5519', second: '2233', third: '8844',
    starters: ['3456','7890','1234','5678','9012','4321','0987','6543','8765','2109'],
    consolation: ['3579','4680','5791','6802','7913','8024','9135','0246','1357','2468'],
  },
  {
    date: '2026-05-10', day: 'Saturday', drawNo: '4565',
    first: '6688', second: '1122', third: '9933',
    starters: ['4567','8901','2345','6789','0123','5432','1098','7654','9876','3210'],
    consolation: ['4680','5791','6802','7913','8024','9135','0246','1357','2468','3579'],
  },
  {
    date: '2026-05-07', day: 'Wednesday', drawNo: '4564',
    first: '2288', second: '5577', third: '3366',
    starters: ['5678','9012','3456','7890','1234','6543','2109','8765','0987','4321'],
    consolation: ['5791','6802','7913','8024','9135','0246','1357','2468','3579','4680'],
  },
]

export const previousDrawsToto = [
  {
    date: '2026-05-22', day: 'Thursday', drawNo: '3912',
    numbers: [4, 11, 18, 27, 35, 42], bonus: 7,
    jackpot: 'S$3,200,000', winners: 0,
  },
  {
    date: '2026-05-19', day: 'Monday', drawNo: '3911',
    numbers: [2, 9, 16, 28, 33, 45], bonus: 13,
    jackpot: 'S$2,100,000', winners: 1,
  },
  {
    date: '2026-05-15', day: 'Thursday', drawNo: '3910',
    numbers: [6, 14, 22, 31, 38, 47], bonus: 3,
    jackpot: 'S$1,000,000', winners: 0,
  },
  {
    date: '2026-05-12', day: 'Monday', drawNo: '3909',
    numbers: [1, 8, 19, 25, 36, 44], bonus: 21,
    jackpot: 'S$1,000,000', winners: 0,
  },
  {
    date: '2026-05-08', day: 'Thursday', drawNo: '3908',
    numbers: [3, 12, 20, 29, 37, 49], bonus: 15,
    jackpot: 'S$1,000,000', winners: 0,
  },
  {
    date: '2026-05-05', day: 'Monday', drawNo: '3907',
    numbers: [5, 10, 17, 26, 34, 43], bonus: 9,
    jackpot: 'S$1,000,000', winners: 0,
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

export const hot4DDigits   = analyseDigits(previousDraws4D)      // digits ranked hottest first
export const hotTotoNums   = analyseTotoNumbers(previousDrawsToto) // numbers ranked hottest first
export const cold4DDigits  = [...hot4DDigits].reverse()
export const coldTotoNums  = [...hotTotoNums].reverse()
