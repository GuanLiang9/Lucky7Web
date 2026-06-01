// Chinese Zodiac (12 animals) + Western Horoscope (12 signs)
// luckyDigits: [[digit, multiplier], ...] — same format as DREAM_DIGIT_BOOSTS
// luckyNums:   [n, ...]               — TOTO numbers 1–49 to boost
// totoRange:   { low, mid, high }     — range multipliers for 1–16, 17–33, 34–49

export const CHINESE_ZODIAC = [
  { id: 'rat',     idx: 0,  emoji: '🐭', en: 'Rat',     zh: '鼠', seed: 11,
    years: '1948 · 1960 · 1972 · 1984 · 1996 · 2008 · 2020',
    luckyDigits: [[2, 2.2], [3, 2.0], [0, 1.5]],
    luckyNums: [2, 3, 12, 22, 23, 33, 42],
    totoRange: { low: 1.2, mid: 1.3, high: 1.0 } },

  { id: 'ox',      idx: 1,  emoji: '🐮', en: 'Ox',      zh: '牛', seed: 22,
    years: '1949 · 1961 · 1973 · 1985 · 1997 · 2009 · 2021',
    luckyDigits: [[1, 2.0], [4, 2.2], [6, 1.8]],
    luckyNums: [1, 4, 6, 11, 14, 24, 34, 41],
    totoRange: { low: 1.4, mid: 1.1, high: 1.0 } },

  { id: 'tiger',   idx: 2,  emoji: '🐯', en: 'Tiger',   zh: '虎', seed: 33,
    years: '1950 · 1962 · 1974 · 1986 · 1998 · 2010 · 2022',
    luckyDigits: [[1, 2.0], [3, 2.2], [4, 1.8]],
    luckyNums: [1, 3, 4, 13, 14, 31, 34, 43],
    totoRange: { low: 1.0, mid: 1.2, high: 1.5 } },

  { id: 'rabbit',  idx: 3,  emoji: '🐰', en: 'Rabbit',  zh: '兔', seed: 44,
    years: '1951 · 1963 · 1975 · 1987 · 1999 · 2011 · 2023',
    luckyDigits: [[3, 2.0], [4, 2.2], [9, 1.8]],
    luckyNums: [3, 4, 9, 13, 14, 29, 34, 39, 49],
    totoRange: { low: 1.3, mid: 1.2, high: 1.0 } },

  { id: 'dragon',  idx: 4,  emoji: '🐲', en: 'Dragon',  zh: '龙', seed: 55,
    years: '1952 · 1964 · 1976 · 1988 · 2000 · 2012 · 2024',
    luckyDigits: [[1, 2.0], [6, 2.5], [7, 2.0]],
    luckyNums: [1, 6, 7, 16, 17, 26, 36, 37],
    totoRange: { low: 1.0, mid: 1.1, high: 1.6 } },

  { id: 'snake',   idx: 5,  emoji: '🐍', en: 'Snake',   zh: '蛇', seed: 66,
    years: '1953 · 1965 · 1977 · 1989 · 2001 · 2013 · 2025',
    luckyDigits: [[2, 2.0], [8, 2.5], [9, 1.8]],
    luckyNums: [2, 8, 9, 18, 19, 28, 38, 39],
    totoRange: { low: 1.2, mid: 1.0, high: 1.4 } },

  { id: 'horse',   idx: 6,  emoji: '🐴', en: 'Horse',   zh: '马', seed: 77,
    years: '1954 · 1966 · 1978 · 1990 · 2002 · 2014 · 2026',
    luckyDigits: [[2, 2.0], [3, 1.8], [7, 2.2]],
    luckyNums: [2, 3, 7, 17, 23, 27, 37, 47],
    totoRange: { low: 1.0, mid: 1.3, high: 1.4 } },

  { id: 'goat',    idx: 7,  emoji: '🐑', en: 'Goat',    zh: '羊', seed: 88,
    years: '1955 · 1967 · 1979 · 1991 · 2003 · 2015',
    luckyDigits: [[2, 2.0], [7, 2.2], [8, 1.8]],
    luckyNums: [2, 7, 8, 17, 27, 28, 37, 47],
    totoRange: { low: 1.3, mid: 1.3, high: 1.0 } },

  { id: 'monkey',  idx: 8,  emoji: '🐵', en: 'Monkey',  zh: '猴', seed: 99,
    years: '1956 · 1968 · 1980 · 1992 · 2004 · 2016',
    luckyDigits: [[1, 2.0], [8, 2.5], [0, 1.5]],
    luckyNums: [1, 8, 10, 18, 28, 38, 40, 48],
    totoRange: { low: 1.0, mid: 1.2, high: 1.5 } },

  { id: 'rooster', idx: 9,  emoji: '🐓', en: 'Rooster', zh: '鸡', seed: 13,
    years: '1957 · 1969 · 1981 · 1993 · 2005 · 2017',
    luckyDigits: [[5, 2.0], [7, 2.2], [8, 1.8]],
    luckyNums: [5, 7, 8, 15, 17, 25, 35, 45],
    totoRange: { low: 1.1, mid: 1.0, high: 1.5 } },

  { id: 'dog',     idx: 10, emoji: '🐶', en: 'Dog',     zh: '狗', seed: 24,
    years: '1958 · 1970 · 1982 · 1994 · 2006 · 2018',
    luckyDigits: [[3, 2.0], [4, 1.8], [9, 2.2]],
    luckyNums: [3, 4, 9, 13, 19, 29, 34, 39],
    totoRange: { low: 1.2, mid: 1.2, high: 1.2 } },

  { id: 'pig',     idx: 11, emoji: '🐷', en: 'Pig',     zh: '猪', seed: 35,
    years: '1959 · 1971 · 1983 · 1995 · 2007 · 2019',
    luckyDigits: [[2, 2.0], [5, 2.0], [8, 2.5]],
    luckyNums: [2, 5, 8, 12, 15, 22, 28, 38],
    totoRange: { low: 1.3, mid: 1.2, high: 1.0 } },
]

export const WESTERN_ZODIAC = [
  { id: 'aries',       emoji: '♈', en: 'Aries',       zh: '白羊座', date: 'Mar 21 – Apr 19', seed: 101,
    luckyDigits: [[1, 2.0], [9, 2.2], [8, 1.8]], luckyNums: [1, 8, 9, 18, 19, 28, 37, 39],
    totoRange: { low: 1.0, mid: 1.0, high: 1.6 } },
  { id: 'taurus',      emoji: '♉', en: 'Taurus',      zh: '金牛座', date: 'Apr 20 – May 20', seed: 102,
    luckyDigits: [[6, 2.2], [5, 1.8], [4, 1.5]], luckyNums: [6, 15, 16, 24, 25, 35, 45],
    totoRange: { low: 1.4, mid: 1.2, high: 1.0 } },
  { id: 'gemini',      emoji: '♊', en: 'Gemini',      zh: '双子座', date: 'May 21 – Jun 20', seed: 103,
    luckyDigits: [[5, 2.0], [7, 2.2], [3, 1.8]], luckyNums: [5, 7, 14, 15, 23, 35, 37, 47],
    totoRange: { low: 1.1, mid: 1.4, high: 1.1 } },
  { id: 'cancer',      emoji: '♋', en: 'Cancer',      zh: '巨蟹座', date: 'Jun 21 – Jul 22', seed: 104,
    luckyDigits: [[2, 2.0], [3, 2.2], [5, 1.5]], luckyNums: [2, 3, 15, 23, 33, 35, 43],
    totoRange: { low: 1.5, mid: 1.1, high: 0.9 } },
  { id: 'leo',         emoji: '♌', en: 'Leo',         zh: '狮子座', date: 'Jul 23 – Aug 22', seed: 105,
    luckyDigits: [[1, 2.2], [4, 2.0], [9, 1.8]], luckyNums: [1, 4, 9, 10, 19, 29, 41],
    totoRange: { low: 1.0, mid: 1.1, high: 1.6 } },
  { id: 'virgo',       emoji: '♍', en: 'Virgo',       zh: '处女座', date: 'Aug 23 – Sep 22', seed: 106,
    luckyDigits: [[6, 2.2], [0, 2.0], [5, 1.8]], luckyNums: [6, 10, 15, 16, 20, 26, 36, 46],
    totoRange: { low: 1.2, mid: 1.3, high: 1.1 } },
  { id: 'libra',       emoji: '♎', en: 'Libra',       zh: '天秤座', date: 'Sep 23 – Oct 22', seed: 107,
    luckyDigits: [[6, 2.0], [5, 2.2], [4, 1.8]], luckyNums: [6, 15, 24, 25, 35, 36, 45],
    totoRange: { low: 1.1, mid: 1.4, high: 1.1 } },
  { id: 'scorpio',     emoji: '♏', en: 'Scorpio',     zh: '天蝎座', date: 'Oct 23 – Nov 21', seed: 108,
    luckyDigits: [[1, 2.0], [2, 2.0], [4, 2.2]], luckyNums: [1, 2, 4, 11, 12, 14, 21, 41],
    totoRange: { low: 1.3, mid: 1.2, high: 1.1 } },
  { id: 'sagittarius', emoji: '♐', en: 'Sagittarius', zh: '射手座', date: 'Nov 22 – Dec 21', seed: 109,
    luckyDigits: [[3, 2.2], [7, 2.0], [9, 1.8]], luckyNums: [3, 7, 9, 17, 27, 37, 39, 47],
    totoRange: { low: 1.0, mid: 1.2, high: 1.5 } },
  { id: 'capricorn',   emoji: '♑', en: 'Capricorn',   zh: '摩羯座', date: 'Dec 22 – Jan 19', seed: 110,
    luckyDigits: [[6, 2.0], [8, 2.2], [9, 1.8]], luckyNums: [6, 8, 9, 18, 26, 28, 36, 38],
    totoRange: { low: 1.2, mid: 1.1, high: 1.4 } },
  { id: 'aquarius',    emoji: '♒', en: 'Aquarius',    zh: '水瓶座', date: 'Jan 20 – Feb 18', seed: 111,
    luckyDigits: [[4, 2.0], [7, 2.2], [1, 1.8]], luckyNums: [4, 7, 11, 14, 17, 24, 41, 47],
    totoRange: { low: 1.1, mid: 1.2, high: 1.4 } },
  { id: 'pisces',      emoji: '♓', en: 'Pisces',      zh: '双鱼座', date: 'Feb 19 – Mar 20', seed: 112,
    luckyDigits: [[3, 2.0], [7, 2.2], [2, 1.8]], luckyNums: [3, 7, 12, 22, 27, 32, 37, 47],
    totoRange: { low: 1.4, mid: 1.2, high: 1.0 } },
]

// Derive Chinese zodiac index from birth year: 0=Rat, 1=Ox, ... 11=Pig
export function zodiacFromYear(year) {
  const idx = ((year - 2020) % 12 + 12) % 12
  return CHINESE_ZODIAC[idx]
}
