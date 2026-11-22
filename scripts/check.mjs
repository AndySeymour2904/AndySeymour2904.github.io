// The "build": there is nothing to compile, so this checks site/ before it ships.
// Every local href/src must point at a file that exists, every in-page #anchor must
// exist, and script.js must parse. Workers Builds runs it, so a broken link fails the deploy.
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('../site/', import.meta.url).pathname
const problems = []
for (const page of readdirSync(root).filter(f => f.endsWith('.html'))) {
  const html = readFileSync(join(root, page), 'utf8')
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]))
  for (const [, ref] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:|\/\/)/.test(ref)) continue
    if (ref.startsWith('#')) { if (ref.length > 1 && !ids.has(ref.slice(1))) problems.push(`${page}: no element with id ${ref}`); continue }
    const file = join(root, ref.replace(/^\//, '').split(/[?#]/)[0] || 'index.html')
    if (!existsSync(file)) problems.push(`${page}: missing ${ref}`)
  }
}
try { new Function(readFileSync(join(root, 'script.js'), 'utf8')) } catch (e) { problems.push(`script.js: ${e.message}`) }
const js = readFileSync(join(root, 'script.js'), 'utf8')
for (const [, img] of js.matchAll(/'(img\/[^']+)'/g)) if (!existsSync(join(root, img))) problems.push(`script.js: missing ${img}`)

if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
console.log('site/ looks fine')
