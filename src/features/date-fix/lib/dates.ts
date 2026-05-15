/** 로컬(브라우저 타임존) 기준 YYYY-MM-DD */
export function toLocalDateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 시작·끝(포함), 로컬 자정 기준. 끝이 시작보다 이르면 순서를 바꿉니다. */
export function eachDateBetweenInclusive(a: string, b: string): string[] {
  const start = parseLocalDate(a)
  const end = parseLocalDate(b)
  if (end < start) {
    return eachDateBetweenInclusive(b, a)
  }
  const out: string[] = []
  const cur = new Date(start)
  while (cur <= end) {
    out.push(toLocalDateString(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return out
}

export function isSameLocalMonth(d: Date, year: number, monthIndex: number): boolean {
  return d.getFullYear() === year && d.getMonth() === monthIndex
}

/** 월요일 시작, 6주 그리드(42칸) */
export function getMonthGridCells(year: number, monthIndex: number): Date[] {
  const first = new Date(year, monthIndex, 1)
  const dow = first.getDay()
  const offsetMondayFirst = (dow + 6) % 7
  const start = new Date(year, monthIndex, 1 - offsetMondayFirst)
  const cells: Date[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    cells.push(d)
  }
  return cells
}

const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const

export function getWeekdayLabels(): readonly string[] {
  return WEEK_LABELS
}

export function formatDateLabel(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}
