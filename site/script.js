(() => {
  const NS = 'http://www.w3.org/2000/svg'
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag)
    for (const k in attrs) if (attrs[k] !== undefined) n.setAttribute(k, attrs[k])
    if (parent) parent.appendChild(n)
    return n
  }
  const text = (parent, x, y, str, cls, extra = {}) => {
    const t = el('text', { x, y, class: cls, ...extra }, parent)
    t.textContent = str
    return t
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

  // Catmull-Rom -> cubic Bézier path through points
  const smooth = pts => {
    let d = `M${pts[0][0]},${pts[0][1]}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
      const t = 6
      d += ` C${p1[0] + (p2[0] - p0[0]) / t},${p1[1] + (p2[1] - p0[1]) / t} ${p2[0] - (p3[0] - p1[0]) / t},${p2[1] - (p3[1] - p1[1]) / t} ${p2[0]},${p2[1]}`
    }
    return d
  }
  const drawable = path => {
    const len = Math.ceil(path.getTotalLength())
    path.style.setProperty('--len', len)
    path.classList.add('draw')
  }

  /* ---------- theme ---------- */
  const root = document.documentElement
  const themeBtn = document.getElementById('theme')
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  const syncThemeLabel = () => { themeBtn.textContent = isDark() ? 'paper' : 'chalkboard' }
  syncThemeLabel()
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark'
    try { localStorage.setItem('theme', root.dataset.theme) } catch (e) {}
    syncThemeLabel()
  })
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeLabel)

  document.getElementById('print').addEventListener('click', () => window.print())

  document.getElementById('qed').addEventListener('click', () => {
    const ref = document.querySelector('#refs li')
    document.getElementById('refs').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    ref.classList.remove('flash'); void ref.offsetWidth; ref.classList.add('flash')
    setTimeout(() => ref.classList.remove('flash'), 2200)
  })

  /* ---------- page number + TOC ---------- */
  const pageno = document.getElementById('pageno')
  const onScroll = () => {
    const vh = innerHeight
    const total = Math.max(1, Math.ceil(document.documentElement.scrollHeight / vh))
    const cur = Math.min(total, Math.floor((scrollY + vh * 0.5) / vh) + 1)
    pageno.textContent = `p. ${cur} / ${total}`
  }
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll)
  onScroll()

  const tocLinks = [...document.querySelectorAll('.toc a')]
  const sections = tocLinks.map(a => document.querySelector(a.getAttribute('href')))
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      tocLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id))
    })
  }, { rootMargin: '-30% 0px -60% 0px' })
  sections.forEach(s => s && spy.observe(s))

  /* ---------- reveal on scroll ---------- */
  const revealables = document.querySelectorAll('.work, .job, .tbl, .toolkit > div, .fig-nc500, .theorem')
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target) } })
  }, { threshold: 0.15 })
  revealables.forEach(n => { if (!n.classList.contains('tbl')) n.classList.add('reveal'); io.observe(n) })

  /* ---------- Figure 1: trajectory ---------- */
  ;(() => {
    const svg = document.getElementById('trajectory')
    const X0 = 48, X1 = 620, Y0 = 196, Y1 = 18
    const x = yr => X0 + (yr - 2010) / 16 * (X1 - X0)
    // axes
    el('path', { d: `M${X0},${Y1 - 6} L${X0},${Y0} L${X1 + 8},${Y0}`, class: 'axis' }, svg)
    el('path', { d: `M${X1 + 3},${Y0 - 4} L${X1 + 9},${Y0} L${X1 + 3},${Y0 + 4}`, class: 'axis' }, svg)
    el('path', { d: `M${X0 - 4},${Y1 - 1} L${X0},${Y1 - 7} L${X0 + 4},${Y1 - 1}`, class: 'axis' }, svg)
    for (let yr = 2010; yr <= 2026; yr += 2) {
      el('line', { x1: x(yr), x2: x(yr), y1: Y1, y2: Y0, class: 'gridl' }, svg)
      text(svg, x(yr), Y0 + 16, yr, 'lbl-sm', { 'text-anchor': 'middle' })
    }
    text(svg, X1 + 6, Y0 - 8, 't', 'lbl-it', { 'text-anchor': 'end' })
    text(svg, X0 + 8, Y1 + 2, 'b(t)', 'lbl-it')

    const pts = [[2010, 188], [2014, 160], [2015, 140], [2019, 98], [2023, 62], [2025, 38], [2026, 26]].map(([y, v]) => [x(y), v])
    const fillPath = el('path', { d: smooth(pts) + ` L${x(2026)},${Y0} L${X0},${Y0} Z`, class: 'curve-fill fade-in', style: 'animation-delay:1.6s' }, svg)
    const curve = el('path', { d: smooth(pts), class: 'curve' }, svg)
    drawable(curve)

    // [year, value, name, sub, dx, dy, anchor]
    const marks = [
      [2010, 188, 'Leicester', 'MSc Maths, 1st', -4, -34, 'start'],
      [2014, 160, 'BAE Systems', 'Typhoon · F-35', -8, -36, 'end'],
      [2015, 140, 'IBM', 'MQ · App Connect', 10, 26, 'start'],
      [2019, 98, 'Gambit Research', 'data team lead', 0, 24, 'middle'],
      [2025, 38, 'Own products', 'see §2', -12, -22, 'end'],
    ]
    marks.forEach(([yr, v, name, sub, dx, dy, anchor], i) => {
      const g = el('g', { class: 'fade-in', style: `animation-delay:${0.5 + i * 0.38}s` }, svg)
      const cx = x(yr)
      el('circle', { cx, cy: v, r: 4.5, class: 'pt' }, g)
      text(g, cx + dx, v + dy, name, 'lbl', { 'text-anchor': anchor })
      text(g, cx + dx, v + dy + 13, sub, 'lbl-sm', { 'text-anchor': anchor })
    })
  })()

  /* ---------- §2 mini figures (schematic) ---------- */
  const minis = {
    fpl(svg) {
      const vals = [4.1, 6.8, 3.2, 8.4, 5.5, 2.7, 7.1]
      el('line', { x1: 18, x2: 205, y1: 98, y2: 98, class: 'm-ink' }, svg)
      vals.forEach((v, i) => {
        const h = v * 9, bx = 26 + i * 26
        el('rect', { x: bx, y: 98 - h, width: 15, height: h, class: v === 8.4 ? 'm-fillred' : 'm-fill', opacity: v === 8.4 ? 1 : .8 }, svg)
      })
      text(svg, 18, 112, 'xP by GW', '')
      text(svg, 104, 16, 'captain ↓', '')
    },
    whatslive(svg) {
      const days = 'MTWTFSS'
      for (let c = 0; c < 7; c++) text(svg, 28 + c * 25, 16, days[c], '', { 'text-anchor': 'middle' })
      for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
        const n = r * 7 + c
        const x = 17 + c * 25, y = 24 + r * 22
        const live = [2, 5, 6, 9, 12, 13, 16].includes(n)
        const tbc = n > 19 && [20, 22, 26, 27].includes(n)
        el('rect', { x, y, width: 22, height: 19, rx: 1.5, class: live ? 'm-fill' : tbc ? 'm-red' : 'm-grid', fill: live ? undefined : 'none', 'stroke-dasharray': tbc ? '2 2' : 'none', opacity: live ? .85 : 1 }, svg)
      }
      text(svg, 205, 116, 'TBC ⇢', '', { 'text-anchor': 'end' })
    },
    topik(svg) {
      text(svg, 20, 58, '읽기', 'ko')
      ;['①', '②', '③', '④'].forEach((s, i) => {
        const y = 82 + (i % 2) * 18, x = 20 + Math.floor(i / 2) * 90
        el('circle', { cx: x + 5, cy: y - 3, r: 5.5, class: i === 2 ? 'm-fillred' : 'm-ink' }, svg)
        el('line', { x1: x + 16, x2: x + 70, y1: y - 3, y2: y - 3, class: 'm-grid' }, svg)
      })
      text(svg, 200, 22, 'Q31–70', '', { 'text-anchor': 'end' })
      text(svg, 200, 34, '×12', '', { 'text-anchor': 'end' })
    },
    odds(svg) {
      const pts = []
      let v = 62
      for (let i = 0; i <= 40; i++) {
        const t = i / 40
        v += (Math.sin(i * 1.7) * 2.2) + (t > .7 ? -1.6 : .15)
        pts.push([16 + t * 176, v])
      }
      el('line', { x1: 192, x2: 192, y1: 10, y2: 104, class: 'm-ink', 'stroke-dasharray': '3 3' }, svg)
      text(svg, 188, 18, 'KO', '', { 'text-anchor': 'end' })
      el('line', { x1: 16, x2: 200, y1: 104, y2: 104, class: 'm-grid' }, svg)
      el('path', { d: 'M' + pts.map(p => p.join(',')).join(' L'), class: 'm-red' }, svg)
      text(svg, 16, 116, '−24h', '')
      text(svg, 16, 18, 'LTP', '')
    },
  }
  document.querySelectorAll('svg.mini').forEach(svg => minis[svg.dataset.fig]?.(svg))

  /* ---------- Figure 2: NC500 schematic ---------- */
  ;(() => {
    const svg = document.getElementById('nc500')
    // rough coastline blob (schematic, not survey-grade)
    el('path', { class: 'coast', d: 'M40,215 C30,180 45,160 30,140 C20,120 50,110 60,95 C70,80 80,70 95,55 C105,40 110,20 125,12 C150,4 200,10 240,12 C270,10 300,8 305,20 C312,40 300,60 295,75 C285,95 265,110 255,125 C245,140 270,150 268,170 C265,195 250,215 240,218 Z' }, svg)
    const stops = [
      ['Inverness', 228, 192], [null, 180, 178], [null, 120, 165], ['Applecross', 52, 150], [null, 70, 128], ['Ullapool', 92, 98],
      [null, 102, 70], [null, 118, 40], ['Durness', 132, 20], ['Tongue', 178, 26], ['Thurso', 236, 24], ['John o’ Groats', 290, 20],
      ['Wick', 288, 58], [null, 268, 95], ['Dornoch', 248, 138], [null, 238, 165], [null, 228, 192],
    ]
    const pts = stops.map(s => [s[1], s[2]])
    el('path', { d: smooth(pts), class: 'route-bg' }, svg)
    const route = el('path', { d: smooth(pts), class: 'route' }, svg)
    const len = route.getTotalLength()
    route.style.strokeDasharray = len
    route.style.strokeDashoffset = len
    stops.forEach(([name, x, y]) => {
      if (!name) return
      el('circle', { cx: x, cy: y, r: 2.6, class: 'town' }, svg)
      const right = x < 160 || name === 'Inverness'
      text(svg, x + (right ? 6 : -6), y + (name === 'John o’ Groats' || name === 'Durness' ? -6 : 3.5), name, '', { 'text-anchor': right ? 'start' : 'end' })
    })
    const rider = el('circle', { r: 4.5, fill: 'var(--red)', opacity: 0 }, svg)
    const miles = text(svg, 12, 18, '0 mi', '')

    let raf, t0 = null, progress = 0
    const step = ts => {
      if (t0 === null) t0 = ts - progress * 4500
      progress = Math.min(1, (ts - t0) / 4500)
      const p = route.getPointAtLength(progress * len)
      route.style.strokeDashoffset = len * (1 - progress)
      rider.setAttribute('cx', p.x); rider.setAttribute('cy', p.y); rider.setAttribute('opacity', 1)
      miles.textContent = `${Math.round(progress * 516)} mi`
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    const ride = () => {
      if (reduced) { route.style.strokeDashoffset = 0; miles.textContent = '516 mi'; return }
      if (progress >= 1) { progress = 0 }
      cancelAnimationFrame(raf); t0 = null; raf = requestAnimationFrame(step)
    }
    svg.addEventListener('pointerenter', ride)
    svg.addEventListener('click', ride)
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { ride(); o.disconnect() } }, { threshold: 0.6 }).observe(svg)
  })()
})()
