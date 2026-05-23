const API_URL = 'https://lucky7-api.guanliang976.workers.dev/results'

// Fallback data used when the API is unreachable
import { previousDraws4D, previousDrawsToto } from './previousDraws.js'

export async function fetchResults() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(API_URL, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    clearTimeout(timeout)
    return {
      draws4D:   data['4d']  || previousDraws4D,
      drawsToto: data.toto   || previousDrawsToto,
      updatedAt: data.updatedAt,
      live:      data.live   || { '4d': false, toto: false },
    }
  } catch (err) {
    clearTimeout(timeout)
    return {
      draws4D:   previousDraws4D,
      drawsToto: previousDrawsToto,
      updatedAt: null,
      live:      { '4d': false, toto: false },
    }
  }
}
