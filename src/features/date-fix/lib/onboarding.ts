const GUIDE_SEEN_KEY = 'datefix:guide_seen'

export function hasSeenAppGuide(): boolean {
  return localStorage.getItem(GUIDE_SEEN_KEY) === '1'
}

export function markAppGuideSeen(): void {
  localStorage.setItem(GUIDE_SEEN_KEY, '1')
}
