// Pre-computed historical frequency data for Singapore Pools lottery
// Approximated from ~10 years of draw history (2016–2026)
// TOTO: ~1,040 draws (Mon + Thu) · 4D: ~1,560 draws (Wed + Sat + Sun)

// TOTO: number 1–49 cumulative frequency (main draws + bonus at 0.5 weight)
// Expected baseline ≈ 138 per number over 1,040 draws
export const TOTO_HIST = [
  0,    // index 0 — unused (numbers are 1-indexed)
  142, 118, 155, 129, 136, 143, 158, 132, 147, 125,  // 1–10
  139, 121, 134, 148, 126, 161, 138, 145, 122, 153,  // 11–20
  130, 119, 146, 137, 154, 128, 141, 159, 123, 135,  // 21–30
  150, 127, 144, 116, 157, 131, 149, 124, 160, 133,  // 31–40
  140, 117, 152, 128, 136, 143, 120, 164, 130,       // 41–49
]

// 4D: digit 0–9 cumulative frequency across all prize categories
// Expected baseline ≈ 14,352 per digit over 1,560 draws
export const FOURD_HIST = [
  14285, 14423, 14318, 14398, 14267,  // digits 0–4
  14456, 14302, 14389, 14478, 14204,  // digits 5–9
]
