// Shared content for every design option. Edit once, all designs update.
window.CV = {
  name: 'Andy Seymour',
  title: 'Software Engineer',
  location: 'London, UK',
  now: 'Strategy development, Gambit Research',
  summary: "Software engineer with twelve years in production systems. At Gambit Research I write trading strategies in C++ and Python. I joined to lead the data team and moved through internal tools before that. Before Gambit I spent four years at IBM building integration products, and started on flight software at BAE Systems.",
  short: 'I write trading strategies in C++ and Python at Gambit Research. Previously data team lead, IBM and BAE Systems.',
  email: 'andy@andyseymour.dev',
  links: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/andy-seymour-86a24ab1/' },
    { label: 'GitHub', url: 'https://github.com/AndySeymour2904' },
    { label: 'Stack Overflow', url: 'https://stackoverflow.com/users/1911439/andrew-seymour' },
  ],
  jobs: [
    { company: 'Gambit Research', place: 'London', from: 2019, to: null, roles: [
      { title: 'Strategy Development', tags: ['C++', 'Python'], text: 'Coding the trading strategies in C++ and Python.' },
      { title: 'Tools', tags: [], text: 'Internal software for the trading and research teams.' },
      { title: 'Data Team Lead', tags: ['Spark', 'Hadoop', 'Python', 'React', 'AWS'], text: 'Led the data team. Owned the ETL pipelines and brought new data sources onto the platform. Built web tools for analysts and helped technical and non-technical staff work with large datasets in HDFS.' },
    ] },
    { company: 'IBM', place: 'Hursley', from: 2015, to: 2019, roles: [
      { title: 'Frontend Developer, Cloud Integration Platform', tags: ['React', 'Redux', 'Node'], text: 'Rebuilt UIs and UX as the product moved from on-premise to SaaS and PaaS. Worked across several squads on tight deadlines and pushed for pair programming and a cleaner front-end architecture.' },
      { title: 'Full Stack Developer, App Connect', tags: ['React', 'Angular', 'Node'], text: 'Full-stack work across several microservices. Introduced UI testing to the department and shipped complex features in an award-winning UI alongside the design team.' },
      { title: 'Software Developer, MQ', tags: ['C', 'Angular'], text: 'Features and open-source integration in a large, multi-platform C codebase.' },
    ] },
    { company: 'BAE Systems', place: 'Warton', from: 2014, to: 2015, roles: [
      { title: 'Software Engineer', tags: ['Ada', 'C++'], text: 'Display systems and controls for the Eurofighter Typhoon, and the vehicle health management system for the F‑35. Safety-critical code written to an exact specification and rigorously tested.' },
    ] },
  ],
  skills: [
    { group: 'Languages', items: 'C++, Python, TypeScript, JavaScript, SQL, C, Ada' },
    { group: 'Data', items: 'Spark, Hadoop / HDFS, Kafka, pandas, ETL pipelines' },
    { group: 'Web', items: 'React, Node, Next.js, Preact, Redux' },
    { group: 'Infrastructure', items: 'AWS, Cloudflare Workers, Docker, Kubernetes, CI/CD, Linux' },
  ],
  projects: [
    { name: 'FPL Outlook', url: 'https://fploutlook.com', host: 'fploutlook.com', img: 'img/fpl.jpg', text: 'Fantasy Premier League planner: projections, odds and line-ups from five data sources.' },
    { name: "What's Live", url: 'https://whatslive.guide', host: 'whatslive.guide', img: 'img/whatslive.jpg', text: 'Every live sport on UK TV in one calendar, merged from listings, fixtures and EPG data.' },
    { name: 'TOPIK Trainer', url: 'https://topiktrainer.com', host: 'topiktrainer.com', img: 'img/topik.jpg', text: 'Korean reading exam practice on 480 past-paper questions, with sync and mock tests.' },
  ],
  // Co-invented at IBM through its internal invention programme, alongside the day job.
  patents: [
    { title: 'Pressure-sensitive PIN entry', number: 'US 10,216,311', url: 'https://patents.google.com/patent/US10216311B2/en', year: 2019,
      text: 'Hides a PIN from anyone watching: light key presses are silently ignored as decoys, while every press looks the same on screen.', also: 'Continued as US 10,528,717 and US 11,093,067' },
    { title: 'Compensating for hand tremors on touchscreens', number: 'US 10,747,429', url: 'https://patents.google.com/patent/US10747429B2/en', year: 2020,
      text: 'Tracks a finger as it approaches the screen, predicts the intended target and enlarges it before the touch lands.', also: 'Continued as US 11,003,354' },
    { title: 'Choosing which account pays', number: 'US 2018/0260801', url: 'https://patents.google.com/patent/US20180260801A1/en', year: 2018, application: true,
      text: 'Weighs context such as calendar, location and photos to decide whether a purchase is business or personal.' },
  ],
  education: { degree: 'MSc Mathematics, First Class', school: 'University of Leicester', note: 'Four module prizes' },
}

// Tiny helpers shared by the designs
window.h = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag)
  for (const k in attrs) {
    if (k === 'class') n.className = attrs[k]
    else if (k === 'html') n.innerHTML = attrs[k]
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k])
    else if (attrs[k] != null) n.setAttribute(k, attrs[k])
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c))
  return n
}
window.years = j => `${j.from} – ${j.to ?? 'now'}`

const C = CV, $ = s => document.querySelector(s)
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/* ---------- sections ---------- */
$('#jobs').append(...C.jobs.map(j => h('article', { class: 'job' }, h('div', {}, h('h3', {}, j.company), h('p', { class: 'when' }, `${j.from} to ${j.to ?? 'now'}, ${j.place}`)),
  h('ul', {}, j.roles.map(r => h('li', {}, h('b', {}, r.title), r.tags.length ? h('div', { class: 'tags' }, r.tags.join('  ')) : null, h('p', {}, r.text)))))))
$('#proj').append(...C.projects.map(p => h('a', { href: p.url, target: '_blank', rel: 'noopener' }, h('img', { src: p.img, alt: `${p.name} screenshot`, loading: 'lazy' }), h('b', {}, p.name), h('p', {}, p.text), h('span', {}, p.host))))
$('#pat').append(...C.patents.map(p => h('li', {}, h('div', {}, h('b', {}, p.title), h('p', {}, p.text)),
  h('div', { class: 'num' }, h('a', { href: p.url, target: '_blank', rel: 'noopener' }, p.number), h('small', {}, p.application ? `Published application, ${p.year}` : `Granted ${p.year}`), p.also ? h('small', {}, p.also) : null))))
$('#sk').append(...C.skills.map(s => h('div', {}, h('b', {}, s.group), h('p', {}, s.items))))
$('#links').append(...C.links.map(l => h('a', { href: l.url }, l.label)))

/* ---------- the shell ---------- */
const log = $('#log'), input = $('#cmd'), hint = $('#hint'), shell = $('#shell')
const jump = id => `<span class="jump" data-jump="${id}">open the ${id} section</span>`
const print = (html, cls = 'out') => { log.insertAdjacentHTML('beforeend', `<div class="ln ${cls}">${html}</div>`); log.scrollTop = log.scrollHeight }
const go = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ block: 'start' }) }
const open = url => window.open(url, '_blank', 'noopener')

const COMMANDS = {
  help: { d: 'show these commands', run: () => print('<div class="grid">' + Object.entries(COMMANDS).filter(([, c]) => !c.hidden).map(([k, c]) => `<span>${k}</span><span>${c.d}</span>`).join('') + '</div>Tab completes a command.') },
  about: { d: 'who I am', run: () => print(`<b>Andy Seymour</b>, software engineer in London. Trading strategies in C++ and Python at Gambit Research; before that IBM and BAE Systems. Two US patents. ${jump('about')}`) },
  experience: { d: 'where I have worked', run: () => print('<div class="grid">' + C.jobs.map(j => `<span>${j.from} to ${j.to ?? 'now'}</span><span>${j.company}</span>`).join('') + `</div>${jump('experience')}`) },
  projects: { d: 'things I build outside work', run: () => print('<div class="grid">' + C.projects.map(p => `<span>${p.name}</span><span><a href="${p.url}" target="_blank" rel="noopener">${p.host}</a></span>`).join('') + `</div>${jump('projects')}`) },
  contact: { d: 'how to reach me', run: () => print(`<a href="mailto:${C.email}">${C.email}</a>, <a href="${C.links[0].url}" target="_blank" rel="noopener">LinkedIn</a> or <a href="${C.links[1].url}" target="_blank" rel="noopener">GitHub</a>`) },
  cv: { d: 'save my CV as a PDF', run: () => { print('Opening the print dialog. Choose "Save as PDF" to keep a copy.'); setTimeout(() => window.print(), 300) } },
  clear: { d: 'clear the screen', run: () => log.replaceChildren() },
  whoami: { hidden: true, run: () => COMMANDS.about.run() },
}

/* the easter egg: anything starting with sudo */
function sudo(args) {
  const rest = args.join(' ').trim()
  if (/^hire( andy)?$/.test(rest)) {
    print('[sudo] password for recruiter: ********')
    setTimeout(() => { print('<b>Permission granted.</b> Opening a new email to Andy. Good choice.'); setTimeout(() => location.href = `mailto:${C.email}?subject=${encodeURIComponent("Let's talk")}`, 900) }, 700)
    return
  }
  if (/^rm\s+-rf/.test(rest)) return print('Nice try. This site is static; there is nothing to delete. The incident has been reported to my mum.', 'err')
  print('[sudo] password for visitor: ********')
  print('visitor is not in the sudoers file. This incident will be reported.', 'err')
}

const hist = []; let hi = 0
function run(raw) {
  const line = raw.trim()
  print(`<span class="ps">andy<i>@</i>london <i>~</i> $</span> ${esc(line)}`, 'cmdline')
  if (!line) return
  hist.push(line); hi = hist.length
  const [name, ...args] = line.split(/\s+/), key = name.toLowerCase()
  if (key === 'sudo') sudo(args)
  else if (COMMANDS[key]) COMMANDS[key].run(args)
  else print(`command not found: ${esc(name)}. Type <b>help</b> to see what I can do.`, 'err')
  atoms.burst()
  while (log.children.length > 60) log.firstChild.remove()
}

/* completion: commands first, then arguments; a second Tab lists the options */
const visible = () => Object.keys(COMMANDS).filter(k => !COMMANDS[k].hidden)
function candidates(v) {
  const parts = v.split(/\s+/)
  if (parts.length <= 1) return visible().filter(k => k.startsWith(parts[0].toLowerCase())).map(k => k)
  const c = COMMANDS[parts[0].toLowerCase()]; if (!c?.args) return []
  return c.args.filter(a => a.startsWith(parts[parts.length - 1])).map(a => [...parts.slice(0, -1), a].join(' '))
}
const common = list => list.reduce((p, s) => { let i = 0; while (i < p.length && p[i] === s[i]) i++; return p.slice(0, i) })
let lastTab = 0
function updateHint() {
  const v = input.value, c = v ? candidates(v) : []
  hint.textContent = c.length === 1 && c[0].length > v.length ? v + c[0].slice(v.length) : ''
}
input.addEventListener('input', updateHint)
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); const v = input.value; input.value = ''; hint.textContent = ''; run(v) }
  else if (e.key === 'Tab') {
    if (!input.value && !e.shiftKey) return // let Tab move focus when there is nothing to complete
    e.preventDefault(); const c = candidates(input.value)
    if (c.length === 1) input.value = c[0]
    else if (c.length > 1) { const p = common(c); if (p.length > input.value.length) input.value = p; else if (Date.now() - lastTab < 600) print(c.map(s => s.split(' ').pop()).join('   ')); lastTab = Date.now() }
    updateHint()
  }
  else if (e.key === 'ArrowUp') { if (hi > 0) { input.value = hist[--hi]; e.preventDefault(); updateHint() } }
  else if (e.key === 'ArrowDown') { if (hi < hist.length) { input.value = hist[++hi] ?? ''; e.preventDefault(); updateHint() } }
  else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); log.replaceChildren() }
  else if (e.key === 'ArrowRight' && hint.textContent && input.selectionStart === input.value.length) { input.value = hint.textContent; updateHint() }
})
shell.addEventListener('click', e => { const j = e.target.closest('[data-jump]'); if (j) return go(j.dataset.jump); if (!e.target.closest('a') && !getSelection().toString()) input.focus({ preventScroll: true }) })

/* clickable commands for people who would rather not type */
const chips = $('#chips')
;['help', 'about', 'experience', 'projects', 'contact', 'cv'].forEach(c => chips.append(h('button', { type: 'button', onclick: () => typeOut(c) }, c)))
document.querySelectorAll('[data-run]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); COMMANDS[a.dataset.run].run([]) }))
let typing = false
function typeOut(cmd) {
  if (typing) return; typing = true; input.value = ''; let i = 0
  const step = () => { input.value = cmd.slice(0, ++i); updateHint(); if (i < cmd.length) setTimeout(step, 40); else setTimeout(() => { input.value = ''; hint.textContent = ''; run(cmd); typing = false; if (matchMedia('(hover: hover)').matches) input.focus({ preventScroll: true }) }, 180) }
  step()
}

/* theme: follows the system until you pick one */
$('#mode').addEventListener('click', () => { const light = document.documentElement.classList.toggle('light'); try { localStorage.setItem('theme', light ? 'light' : 'dark') } catch {} })

/* greet */
print('Welcome. Type <b>help</b> and press Tab to complete, or click a command below.')
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
if (matchMedia('(prefers-reduced-motion: reduce)').matches) run('whoami'); else setTimeout(() => typeOut('whoami'), 700)
if (fine) input.focus({ preventScroll: true })

/* ---------- atoms: drifting nodes, linked when close, drawn to the cursor ---------- */
const atoms = (() => {
  const cv = $('#atoms'), x = cv.getContext('2d'), host = cv.parentElement
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  let W, H, P = [], mx = -1e4, my = -1e4, vis = true
  const dotRGB = () => getComputedStyle(document.documentElement).getPropertyValue('--dot').trim()
  const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  const strength = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--atom')) || 1
  function size() {
    const d = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0)
    const n = Math.round(Math.min(130, W * H / 11000))
    P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() < .12 ? 2.4 : 1.1 + Math.random() * .8, ph: Math.random() * 6.28 }))
  }
  size(); addEventListener('resize', size)
  host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top })
  host.addEventListener('pointerleave', () => { mx = my = -1e4 })
  new IntersectionObserver(e => vis = e[0].isIntersecting).observe(host)
  let col = dotRGB(), acc = accent(), k = strength(); new MutationObserver(() => { col = dotRGB(); acc = accent(); k = strength() }).observe(document.documentElement, { attributes: true })
  const LINK = 130, MOUSE = 180
  ;(function frame(t) {
    requestAnimationFrame(frame); if (!vis) return
    x.clearRect(0, 0, W, H)
    for (const p of P) {
      if (!reduced) {
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy)
        if (d < MOUSE && d > 1) { p.vx += dx / d * .012; p.vy += dy / d * .012 }
        p.vx *= .992; p.vy *= .992
        const sp = Math.hypot(p.vx, p.vy); if (sp > 1.6) { p.vx *= 1.6 / sp; p.vy *= 1.6 / sp } if (sp < .08) { p.vx += (Math.random() - .5) * .03; p.vy += (Math.random() - .5) * .03 }
        p.x += p.vx; p.y += p.vy
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20; if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20
      }
    }
    x.lineWidth = 1
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const a = P[i], b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d > LINK) continue
      x.strokeStyle = `rgba(${col},${Math.min(1, (1 - d / LINK) * .22 * k)})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke()
    }
    for (const p of P) {
      const d = Math.hypot(mx - p.x, my - p.y)
      if (d < MOUSE) { x.strokeStyle = acc; x.globalAlpha = Math.min(1, (1 - d / MOUSE) * .55 * Math.sqrt(k)); x.beginPath(); x.moveTo(mx, my); x.lineTo(p.x, p.y); x.stroke(); x.globalAlpha = 1 }
      x.fillStyle = `rgba(${col},${Math.min(1, (p.r > 2 ? .75 : .5) * Math.sqrt(k))})`; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill()
      if (p.r > 2 && !reduced) { // a few atoms have an orbiting electron
        const a = t / 900 + p.ph; x.strokeStyle = `rgba(${col},${.18 * k})`; x.beginPath(); x.ellipse(p.x, p.y, 9, 4, p.ph, 0, 6.283); x.stroke()
        const ex = p.x + Math.cos(a) * 9 * Math.cos(p.ph) - Math.sin(a) * 4 * Math.sin(p.ph), ey = p.y + Math.cos(a) * 9 * Math.sin(p.ph) + Math.sin(a) * 4 * Math.cos(p.ph)
        x.fillStyle = acc; x.beginPath(); x.arc(ex, ey, 1.2, 0, 6.283); x.fill()
      }
    }
  })(0)
  // a command nudges nearby atoms outward from the prompt
  return { burst() { if (reduced) return; const r = input.getBoundingClientRect(), hr = host.getBoundingClientRect(), cx = r.left - hr.left, cy = r.top - hr.top; for (const p of P) { const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1; if (d < 360) { const f = (1 - d / 360) * 2.2; p.vx += dx / d * f; p.vy += dy / d * f } } } }
})()
