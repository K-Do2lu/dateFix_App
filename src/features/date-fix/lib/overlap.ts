import type { Participant } from '../types'

/** 선택을 한 참가자만 교집합에 포함합니다. 아무도 없으면 빈 배열. */
export function computeEveryoneFreeDates(participants: Participant[]): string[] {
  const active = participants.filter((p) => p.availableDates.length > 0)
  if (active.length === 0) {
    return []
  }
  const sets = active.map((p) => new Set(p.availableDates))
  const [first, ...rest] = sets
  const out: string[] = []
  for (const day of first) {
    if (rest.every((s) => s.has(day))) {
      out.push(day)
    }
  }
  return out.sort()
}
