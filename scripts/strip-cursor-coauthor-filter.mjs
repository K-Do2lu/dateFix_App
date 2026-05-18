import { readFileSync, writeFileSync } from 'node:fs'

const msg = readFileSync(0, 'utf8')
const cleaned = msg.replace(/^Co-authored-by: Cursor <cursoragent@cursor.com>\r?\n/gm, '')
writeFileSync(1, cleaned)
