# Lucky7 🏮

A Singapore lottery number generator for 4D and TOTO. Generates personalised lucky numbers based on your mood and dream symbols, with live draw results pulled directly from Singapore Pools.

**Live site:** https://lucky7web.pages.dev

---

## Features

- **Mood + Dream picker** — select your energy and dream symbols (English + 中文) to seed your lucky numbers
- **4D numbers** — 3 sets of 4-digit numbers, tap any individual digit to swap it
- **TOTO numbers** — 6 balls from 1–49, tap any ball to swap it
- **Live draw results** — Cloudflare Worker fetches Singapore Pools automatically after every draw
- **Hot / Cold analysis** — digits and numbers ranked by frequency across recent draws
- **Auto-caching** — results cached at Cloudflare edge for 2 hours, falls back to last known data if Singapore Pools is unreachable

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Hosting | Cloudflare Pages |
| Results API | Cloudflare Worker (`/api`) |
| Repo | GitHub |

## Project Structure

```
app/          # React frontend (Vite)
  src/
    components/   # UI components
    data/         # Static seeds + live API fetch
    utils/        # Seeded number generator
api/          # Cloudflare Worker
  src/
    index.js      # Scrapes Singapore Pools, returns JSON
```

## Local Development

```bash
cd app
npm install
npm run dev       # http://localhost:5173
```

## Deploy

**Frontend (Cloudflare Pages):**
```bash
cd app
npm run build
npx wrangler pages deploy dist --project-name lucky7web
```

**API Worker (Cloudflare Workers):**
```bash
cd api
npx wrangler deploy
```

## API

Worker endpoint: `https://lucky7-api.guanliang976.workers.dev/results`

Returns:
```json
{
  "4d":  [ { "date", "day", "drawNo", "first", "second", "third", "starters", "consolation" } ],
  "toto": [ { "date", "day", "drawNo", "numbers", "bonus", "jackpot", "winners" } ],
  "updatedAt": "2026-05-23T...",
  "live": { "4d": true, "toto": true }
}
```

Results are cached for 2 hours on Cloudflare's edge. `live: false` means Singapore Pools was unreachable and fallback static data was returned.

## Draw Schedule

| Game | Days |
|---|---|
| 4D | Wednesday, Saturday, Sunday |
| TOTO | Monday, Thursday |

---

> For entertainment purposes only. 18+ only. Please gamble responsibly.  
> Singapore Pools is the sole authorised lottery operator in Singapore.
