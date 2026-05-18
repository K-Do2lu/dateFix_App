const API_BASE = import.meta.env.VITE_API_URL ?? ''

export type AppHealth = {
  ok: boolean
  push: boolean
  commit: string | null
}

export async function fetchAppHealth(): Promise<AppHealth | null> {
  try {
    const res = await fetch(`${API_BASE}/api/health`)
    if (!res.ok) {
      return null
    }
    return res.json() as Promise<AppHealth>
  } catch {
    return null
  }
}
