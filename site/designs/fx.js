// Reusable hero effects. Each pauses when off screen.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const watch = (el, fn) => { let v = false; new IntersectionObserver(e => { v = e[0].isIntersecting; if (v) fn() }).observe(el); return () => v }
  const pointer = host => {
    const p = { x: -1e4, y: -1e4, on: 0, nx: 0, ny: 0 }
    host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); p.x = e.clientX - r.left; p.y = e.clientY - r.top; p.nx = p.x / r.width - .5; p.ny = p.y / r.height - .5; p.on = 1 })
    host.addEventListener('pointerleave', () => p.on = 0)
    return p
  }
  const hex = c => [parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255]

  /* topographic contours (WebGL2) */
  function topo(canvas, o = {}) {
    const gl = canvas.getContext('webgl2', { antialias: false }); if (!gl) return
    const host = o.host || canvas.parentElement, ptr = pointer(host)
    const fs = `#version 300 es
    precision highp float;
    uniform vec2 R; uniform float T; uniform vec2 M; uniform float H; uniform vec3 BG, INK, ACC; uniform float A1, A2, AA, SC;
    out vec4 o;
    vec2 hs(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1. + 2. * fract(sin(p) * 43758.5453); }
    float n(vec2 p){ const float K1 = .366025404, K2 = .211324865; vec2 i = floor(p + (p.x + p.y) * K1), a = p - i + (i.x + i.y) * K2; float m = step(a.y, a.x); vec2 q = vec2(m, 1. - m), b = a - q + K2, c = a - 1. + 2. * K2; vec3 h = max(.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.); return dot(h * h * h * h * vec3(dot(a, hs(i)), dot(b, hs(i + q)), dot(c, hs(i + 1.))), vec3(70.)); }
    float f(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * n(p); p = p * 2.02 + vec2(1.7, 9.2); a *= .5; } return s; }
    void main(){
      vec2 uv = (gl_FragCoord.xy - .5 * R) / R.y, m = (M - .5 * R) / R.y;
      float t = T * .02; vec2 q = uv * SC;
      float h = f(q + vec2(f(q + t), f(q + vec2(5.2, 1.3) - t)));
      float d = length(uv - m); h += H * .3 * exp(-d * d * 10.);
      float F = h * 11., w = fwidth(F);
      float mi = 1. - smoothstep(0., 1.1, abs(fract(F + .5) - .5) / w);
      float ma = 1. - smoothstep(0., 1.4, abs(fract(F / 5. + .5) - .5) * 5. / w);
      float near = exp(-d * d * 12.) * H;
      vec3 col = mix(BG, INK, mi * A1); col = mix(col, INK, ma * A2); col = mix(col, ACC, ma * near * AA);
      o = vec4(col, 1.);
    }`
    const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x }
    const pr = gl.createProgram()
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, '#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0.,1.);}')); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr)
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return
    gl.useProgram(pr); gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    const U = k => gl.getUniformLocation(pr, k)
    gl.uniform3fv(U('BG'), hex(o.bg || '#0b0c0e')); gl.uniform3fv(U('INK'), hex(o.ink || '#eceae4')); gl.uniform3fv(U('ACC'), hex(o.acc || '#ff6a3d'))
    gl.uniform1f(U('A1'), o.minor ?? .075); gl.uniform1f(U('A2'), o.major ?? .2); gl.uniform1f(U('AA'), o.accent ?? .55); gl.uniform1f(U('SC'), o.scale ?? .95)
    const dpr = Math.min(devicePixelRatio, 1.5)
    const size = () => { canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; gl.viewport(0, 0, canvas.width, canvas.height) }
    size(); addEventListener('resize', size)
    let mx = canvas.clientWidth * .65, my = canvas.clientHeight * .45, hv = 0, t0 = performance.now(), running = false
    const vis = watch(host, () => { if (!running) { running = true; requestAnimationFrame(frame) } })
    function frame(now) {
      if (!vis()) { running = false; return }
      requestAnimationFrame(frame)
      if (ptr.on) { mx += (ptr.x - mx) * .06; my += (ptr.y - my) * .06 }
      hv += (ptr.on - hv) * .04
      gl.uniform2f(U('R'), canvas.width, canvas.height); gl.uniform1f(U('T'), reduced ? 0 : (now - t0) / 1000)
      gl.uniform2f(U('M'), mx * dpr, canvas.height - my * dpr); gl.uniform1f(U('H'), hv)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
  }

  /* text as particles: draws each [data-p] line of `textEl`, then hides the real text */
  function particles(canvas, textEl, o = {}) {
    const x = canvas.getContext('2d'), host = o.host || canvas.parentElement, ptr = pointer(host)
    let W, H, pts = [], r = 1.5
    const build = () => {
      const dpr = Math.min(devicePixelRatio, 2); W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = W * dpr; canvas.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0)
      const off = document.createElement('canvas'); off.width = W; off.height = H; const c = off.getContext('2d')
      const hr = canvas.getBoundingClientRect(), cs = getComputedStyle(textEl)
      textEl.style.visibility = 'visible'
      c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; c.letterSpacing = cs.letterSpacing; c.fillStyle = '#000'; c.textBaseline = 'alphabetic'
      textEl.querySelectorAll('[data-p]').forEach(s => { const b = s.getBoundingClientRect(); c.fillText(cs.textTransform === 'uppercase' ? s.textContent.toUpperCase() : s.textContent, b.left - hr.left, b.top - hr.top + b.height * .8) })
      const d = c.getImageData(0, 0, W, H).data, step = W < 600 ? 3 : 4
      const old = pts; pts = []
      for (let yy = 0; yy < H; yy += step) for (let xx = 0; xx < W; xx += step) if (d[(yy * W + xx) * 4 + 3] > 120) { const p = old[pts.length] || { x: xx, y: yy, vx: 0, vy: 0 }; p.hx = xx; p.hy = yy; pts.push(p) }
      r = step * .44; if (pts.length) textEl.style.visibility = 'hidden'
    }
    let running = false
    const vis = watch(host, () => { if (!running) { running = true; requestAnimationFrame(tick) } })
    document.fonts.ready.then(() => setTimeout(build, 200))
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 150) })
    const R = o.radius || 80
    function tick() {
      if (!vis()) { running = false; return }
      requestAnimationFrame(tick); x.clearRect(0, 0, W, H)
      const mv = []; x.fillStyle = o.color || '#ecebe6'
      for (const p of pts) {
        if (ptr.on && !reduced) { const dx = p.x - ptr.x, dy = p.y - ptr.y, dd = dx * dx + dy * dy; if (dd < R * R) { const s = Math.sqrt(dd) || 1, f = (1 - s / R) * 1.4; p.vx += dx / s * f; p.vy += dy / s * f } }
        p.vx = (p.vx + (p.hx - p.x) * .06) * .8; p.vy = (p.vy + (p.hy - p.y) * .06) * .8; p.x += p.vx; p.y += p.vy
        if (Math.abs(p.vx) + Math.abs(p.vy) > 1.2) mv.push(p); else x.fillRect(p.x - r, p.y - r, r * 2, r * 2)
      }
      x.fillStyle = o.acc || '#ff6a3d'; for (const p of mv) x.fillRect(p.x - r, p.y - r, r * 2, r * 2)
    }
  }

  /* perspective point wave (Canvas 2D) */
  function wave(canvas, o = {}) {
    const x = canvas.getContext('2d'), host = o.host || canvas.parentElement, ptr = pointer(host)
    let W, H, mx = 0, my = 0
    const size = () => { const dpr = Math.min(devicePixelRatio, 2); W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * dpr; canvas.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0) }
    size(); addEventListener('resize', size)
    const t0 = performance.now(); let running = false
    const vis = watch(host, () => { if (!running) { running = true; requestAnimationFrame(frame) } })
    function frame(now) {
      if (!vis()) { running = false; return }
      requestAnimationFrame(frame)
      const t = reduced ? 0 : (now - t0) / 1000
      mx += (ptr.nx * ptr.on - mx) * .04; my += (ptr.ny * ptr.on - my) * .04
      x.clearRect(0, 0, W, H)
      const fov = Math.min(W, H) * 1.1, camY = -1.2 + my * .6, rot = mx * .35, cr = Math.cos(rot), sr = Math.sin(rot)
      for (let j = 0; j < 46; j++) for (let i = 0; i < 90; i++) {
        const gx = (i / 89 - .5) * 16, gz = j / 45 * 14 + 2
        const gy = Math.sin(gx * .55 + t * .9) * .35 + Math.cos(gz * .5 - t * .7) * .35 + Math.sin((gx + gz) * .3 + t * .4) * .25
        const rx = gx * cr - (gz - 8) * sr, rz = gx * sr + (gz - 8) * cr + 8
        const px = W / 2 + rx / rz * fov, py = H * (o.horizon ?? .5) + (gy - camY) / rz * fov
        if (px < -5 || px > W + 5 || py < -5 || py > H + 5) continue
        const depth = 1 - rz / 18, lit = Math.max(0, gy + .6) / 1.6
        x.globalAlpha = Math.min(1, Math.max(0, depth) * (.45 + lit * 1.1)) * (o.alpha ?? 1)
        x.fillStyle = lit > .78 ? (o.acc || '#7cc4ff') : (o.color || '#eef0f2')
        const rr = Math.max(.7, 2.4 * depth); x.fillRect(px - rr / 2, py - rr / 2, rr, rr)
      }
      x.globalAlpha = 1
    }
  }

  /* simulated order book (DOM). Styling comes from the page's .ob classes */
  function orderbook(box) {
    const N = 7, tick = .01; let mid = 2.48, last = mid
    const mk = c => { const i = document.createElement('i'), s = [0, 1, 2].map(() => document.createElement('span')), el = document.createElement('div'); el.className = 'ob-l ' + c; el.append(i, ...s); return { el, i, s, size: 50 + Math.random() * 900 } }
    const asks = Array.from({ length: N }, () => mk('a')), bids = Array.from({ length: N }, () => mk('b'))
    const midEl = document.createElement('div'); midEl.className = 'ob-mid'
    const head = document.createElement('div'); head.className = 'ob-h'; head.innerHTML = '<span>Price</span><span>Size</span><span>Total</span>'
    const foot = document.createElement('div'); foot.className = 'ob-f'; foot.textContent = 'Simulated'
    box.append(head, ...asks.map(a => a.el).reverse(), midEl, ...bids.map(b => b.el), foot)
    const draw = () => {
      for (const [side, sg] of [[asks, 1], [bids, -1]]) { let tot = 0; side.forEach((l, k) => { tot += l.size; l.tot = tot; l.s[0].textContent = (mid + sg * (k + 1) * tick).toFixed(2); l.s[1].textContent = Math.round(l.size); l.s[2].textContent = Math.round(tot) }); side.forEach(l => l.i.style.width = l.tot / tot * 100 + '%') }
      midEl.textContent = mid.toFixed(3); midEl.dataset.dir = mid > last ? 'up' : mid < last ? 'dn' : ''
    }
    draw()
    let vis = false; new IntersectionObserver(e => vis = e[0].isIntersecting).observe(box)
    if (!reduced) setInterval(() => { if (!vis) return; last = mid; const l = (Math.random() < .5 ? asks : bids)[Math.floor(Math.random() * N)]; l.size = Math.max(10, l.size + (Math.random() - .45) * 300); if (Math.random() < .18) mid = +(mid + (Math.random() < .5 ? -tick : tick)).toFixed(2); draw() }, 220)
  }

  /* career branch graph (SVG). Colours via CSS: .cg-lane[data-i], .cg-node etc. */
  function graph(box, C, o = {}) {
    const NS = 'http://www.w3.org/2000/svg', s = (t, a, p) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); p && p.appendChild(n); return n }
    const W = 1000, H = o.h || 220, X0 = 10, X1 = 990, Y0 = 2010, Y1 = 2027, x = y => X0 + (y - Y0) / (Y1 - Y0) * (X1 - X0)
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'cg' }, box)
    for (let y = 2010; y <= 2026; y += 2) { s('line', { x1: x(y), x2: x(y), y1: 8, y2: H - 24, class: 'cg-grid' }, svg); s('text', { x: x(y), y: H - 6, 'text-anchor': 'middle', class: 'cg-yr' }, svg).textContent = y }
    const trunk = H - 44, lanes = [...C.jobs].reverse(), ly = [trunk - 40, trunk - 82, trunk - 132]
    s('path', { d: `M${x(2010)},${trunk} L${x(2026.6)},${trunk}`, class: 'cg-trunk' }, svg)
    s('circle', { cx: x(2010.2), cy: trunk, r: 5, class: 'cg-node', 'data-i': 9 }, svg)
    s('text', { x: x(2010.2) + 10, y: trunk + 18, class: 'cg-yr' }, svg).textContent = 'Leicester'
    lanes.forEach((j, i) => {
      const y = ly[i], from = x(j.from), to = x(j.to ?? 2026.6)
      const p = s('path', { d: `M${from - 30},${trunk} C${from - 8},${trunk} ${from - 18},${y} ${from + 6},${y} L${to},${y}` + (j.to ? ` C${to + 20},${y} ${to + 6},${ly[i + 1]} ${to + 26},${ly[i + 1]}` : ''), class: 'cg-lane', 'data-i': i }, svg)
      const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len
      p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 900, delay: 300 + i * 450, fill: 'forwards', easing: 'cubic-bezier(.5,0,.2,1)' })
      s('text', { x: from + 8, y: i === 0 ? y + 22 : y - 12, class: 'cg-co' }, svg).textContent = j.company
      const roles = [...j.roles].reverse(), span = (j.to ?? 2026.4) - j.from
      roles.forEach((r, k) => { const c = s('circle', { cx: x(j.from + span * (k + .5) / roles.length), cy: y, r: 5, class: 'cg-node', 'data-i': i }, svg); c.style.opacity = 0; c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 800 + i * 450 + k * 120, fill: 'forwards' }); const tt = s('title', {}, c); tt.textContent = `${r.title}, ${j.company}` })
    })
  }


  /* shared canvas setup */
  const setup = (canvas, o) => {
    const x = canvas.getContext('2d'), host = o.host || canvas.parentElement, ptr = pointer(host), st = { x, ptr, W: 0, H: 0 }
    const size = () => { const dpr = Math.min(devicePixelRatio, 2); st.W = canvas.clientWidth; st.H = canvas.clientHeight; canvas.width = st.W * dpr; canvas.height = st.H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); o.onSize && o.onSize(st) }
    size(); addEventListener('resize', size)
    let running = false
    const vis = watch(host, () => { if (!running) { running = true; requestAnimationFrame(loop) } })
    const t0 = performance.now()
    function loop(now) { if (!vis()) { running = false; return } requestAnimationFrame(loop); st.t = reduced ? 0 : (now - t0) / 1000; o.draw(st) }
    return st
  }
  const rgba = (c, a) => { const [r, g, b] = hex(c).map(v => Math.round(v * 255)); return `rgba(${r},${g},${b},${a})` }

  /* connecting dots network with depth */
  function network(canvas, o = {}) {
    const ink = o.color || '#e8eaed', acc = o.acc || '#7aa2ff'
    let pts = []
    o.onSize = st => {
      const n = Math.round(Math.min(150, st.W * st.H / (o.density || 9000)))
      pts = Array.from({ length: n }, () => ({ x: Math.random() * st.W, y: Math.random() * st.H, z: .35 + Math.random() * .65, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }))
    }
    let px = 0, py = 0
    o.draw = st => {
      const { x, W, H, ptr } = st
      px += ((ptr.on ? ptr.nx : 0) - px) * .05; py += ((ptr.on ? ptr.ny : 0) - py) * .05
      x.clearRect(0, 0, W, H)
      const L = o.link || 150, pos = pts.map(p => {
        if (!reduced) { p.x += p.vx; p.y += p.vy }
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20; if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20
        return [p.x - px * 40 * p.z, p.y - py * 40 * p.z, p.z]
      })
      x.lineWidth = 1
      for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1], d = Math.hypot(dx, dy)
        if (d < L) { x.strokeStyle = rgba(ink, (1 - d / L) * .22 * Math.min(pos[i][2], pos[j][2])); x.beginPath(); x.moveTo(pos[i][0], pos[i][1]); x.lineTo(pos[j][0], pos[j][1]); x.stroke() }
      }
      if (ptr.on) for (const q of pos) {
        const d = Math.hypot(q[0] - ptr.x, q[1] - ptr.y)
        if (d < L * 1.3) { x.strokeStyle = rgba(acc, (1 - d / (L * 1.3)) * .7); x.beginPath(); x.moveTo(q[0], q[1]); x.lineTo(ptr.x, ptr.y); x.stroke() }
      }
      for (const q of pos) { const near = ptr.on && Math.hypot(q[0] - ptr.x, q[1] - ptr.y) < L * 1.3; x.fillStyle = near ? acc : rgba(ink, .35 + q[2] * .5); x.beginPath(); x.arc(q[0], q[1], 1 + q[2] * 1.6, 0, 7); x.fill() }
    }
    setup(canvas, o)
  }

  /* layered neural network with forward-propagating pulses */
  function neural(canvas, o = {}) {
    const ink = o.color || '#e8eaed', acc = o.acc || '#7aa2ff', layers = o.layers || [5, 9, 12, 9, 4]
    let nodes = [], edges = [], pulses = [], last = 0
    o.onSize = st => {
      const x0 = st.W * (o.left ?? .5), x1 = st.W * (o.right ?? .94), y0 = st.H * .16, y1 = st.H * .84
      nodes = []; edges = []
      layers.forEach((n, li) => { for (let k = 0; k < n; k++) nodes.push({ l: li, x: x0 + (x1 - x0) * li / (layers.length - 1), y: y0 + (y1 - y0) * (n === 1 ? .5 : k / (n - 1)) * (1 - .15 * Math.abs(li - 2) / 2) + (y1 - y0) * .075 * Math.abs(li - 2) / 2, a: 0, out: [] }) })
      nodes.forEach(a => nodes.forEach(b => { if (b.l === a.l + 1) { const e = { a, b, w: Math.random() ** 2 }; edges.push(e); a.out.push(e) } }))
      nodes.forEach(n => n.out.sort((p, q) => q.w - p.w))
    }
    const fire = (n, s = 1) => { n.a = Math.min(1, n.a + s); n.out.slice(0, 3).forEach(e => { if (Math.random() < .8) pulses.push({ e, t: 0, s: s * (.6 + e.w * .4) }) }) }
    o.draw = st => {
      const { x, W, H, ptr, t } = st
      x.clearRect(0, 0, W, H)
      if (!reduced && t - last > .7) { last = t; fire(nodes[Math.floor(Math.random() * layers[0])]) }
      if (ptr.on) for (const n of nodes) if (Math.hypot(n.x - ptr.x, n.y - ptr.y) < 34 && n.a < .3) fire(n)
      x.lineWidth = 1
      for (const e of edges) { x.strokeStyle = rgba(ink, .03 + e.w * .1); x.beginPath(); x.moveTo(e.a.x, e.a.y); x.lineTo(e.b.x, e.b.y); x.stroke() }
      pulses = pulses.filter(p => {
        p.t += .018 + p.e.w * .01
        const { a, b } = p.e, k = Math.min(1, p.t), px = a.x + (b.x - a.x) * k, py = a.y + (b.y - a.y) * k
        x.strokeStyle = rgba(acc, .55 * p.s); x.lineWidth = 1.5; x.beginPath(); x.moveTo(a.x + (b.x - a.x) * Math.max(0, k - .25), a.y + (b.y - a.y) * Math.max(0, k - .25)); x.lineTo(px, py); x.stroke()
        if (k >= 1) { if (p.s > .25) fire(b, p.s * .75); else b.a = Math.min(1, b.a + p.s); return false }
        return true
      })
      x.lineWidth = 1
      for (const n of nodes) {
        n.a *= .96
        if (n.a > .02) { x.fillStyle = rgba(acc, n.a * .18); x.beginPath(); x.arc(n.x, n.y, 6 + n.a * 12, 0, 7); x.fill() }
        x.fillStyle = o.bg || '#0a0b0d'; x.strokeStyle = n.a > .05 ? rgba(acc, .5 + n.a * .5) : rgba(ink, .45); x.beginPath(); x.arc(n.x, n.y, 4.2, 0, 7); x.fill(); x.stroke()
        if (n.a > .05) { x.fillStyle = rgba(acc, n.a); x.beginPath(); x.arc(n.x, n.y, 2.4, 0, 7); x.fill() }
      }
    }
    setup(canvas, o)
  }

  /* embedding space: rotating 3D clusters with labels */
  function embedding(canvas, o = {}) {
    const ink = o.color || '#e8eaed', acc = o.acc || '#7aa2ff'
    const groups = o.groups || [
      { label: 'Trading', items: ['C++', 'Python', 'Strategies', 'Pricing'], c: [1.1, .2, 0] },
      { label: 'Data', items: ['Spark', 'Hadoop', 'Kafka', 'ETL', 'pandas'], c: [-.9, .6, .5] },
      { label: 'Web', items: ['React', 'TypeScript', 'Node', 'Next.js'], c: [-.4, -.8, -.6] },
      { label: 'Systems', items: ['Ada', 'C', 'Linux', 'AWS'], c: [.3, -.3, 1.1] },
    ]
    const g = () => { let u = 0, v = 0; while (!u) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }
    const pts = []
    groups.forEach((gr, gi) => { for (let i = 0; i < 70; i++) pts.push({ p: gr.c.map(c => c + g() * .28), gi }); gr.items.forEach(it => pts.push({ p: gr.c.map(c => c + g() * .22), gi, label: it })) })
    let rx = .3, ry = 0, ax = 0, ay = 0
    o.draw = st => {
      const { x, W, H, ptr, t } = st
      ax += ((ptr.on ? ptr.ny * .8 : 0) - ax) * .04; ay += ((ptr.on ? ptr.nx * 1.4 : 0) - ay) * .04
      ry = t * .08 + ay; rx = .35 + ax
      x.clearRect(0, 0, W, H)
      const cx = W * (o.cx ?? .68), cy = H * (o.cy ?? .5), sc = Math.min(W, H) * (o.scale ?? .3)
      const cr = Math.cos(ry), sr = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx)
      const pr = pts.map(q => { let [a, b, c] = q.p; const a1 = a * cr - c * sr, c1 = a * sr + c * cr, b1 = b * cX - c1 * sX, c2 = b * sX + c1 * cX, f = 3.2 / (3.2 + c2); return { ...q, X: cx + a1 * sc * f, Y: cy + b1 * sc * f, z: c2, f } }).sort((p, q) => q.z - p.z)
      const hot = ptr.on ? pr.reduce((best, q) => { const d = Math.hypot(q.X - ptr.x, q.Y - ptr.y); return d < best.d ? { d, gi: q.gi } : best }, { d: 90, gi: -1 }).gi : -1
      for (const q of pr) {
        const on = q.gi === hot, a = Math.max(.08, Math.min(1, (1.6 - q.z) / 2.4))
        x.fillStyle = on ? rgba(acc, a) : rgba(ink, a * .7)
        const r = (q.label ? 2.6 : 1.3) * q.f; x.beginPath(); x.arc(q.X, q.Y, r, 0, 7); x.fill()
        if (q.label && (on || a > .55)) { x.font = `${on ? 600 : 400} ${Math.round(11 * q.f + 1)}px "Geist Mono", monospace`; x.fillStyle = on ? acc : rgba(ink, a * .85); x.fillText(q.label, q.X + 6, q.Y + 4) }
      }
      groups.forEach((gr, gi) => { const q = pr.filter(p => p.gi === gi); const mX = q.reduce((s, p) => s + p.X, 0) / q.length, mY = Math.min(...q.map(p => p.Y)) - 14; x.font = '600 12px Geist, sans-serif'; x.fillStyle = gi === hot ? acc : rgba(ink, .55); x.textAlign = 'center'; x.fillText(gr.label.toUpperCase(), mX, mY); x.textAlign = 'start' })
    }
    setup(canvas, o)
  }

  /* attention arcs between the words of a sentence (SVG over DOM words) */
  function attention(box, o = {}) {
    const words = [...box.querySelectorAll('[data-w]')], NS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'attn'); box.prepend(svg)
    const W = o.weights || {}
    const weight = (i, j) => { const a = words[i].dataset.w, b = words[j].dataset.w; return W[a + '>' + b] ?? W[b + '>' + a] ?? (i === j ? 0 : .06 + .04 / Math.abs(i - j)) }
    let cur = 0, timer
    const show = i => {
      cur = i; words.forEach((w, k) => w.classList.toggle('on', k === i))
      const br = box.getBoundingClientRect(); svg.setAttribute('viewBox', `0 0 ${br.width} ${br.height}`); svg.replaceChildren()
      const a = words[i].getBoundingClientRect(), ax = a.left + a.width / 2 - br.left, ay = a.top - br.top
      words.forEach((w, j) => {
        if (j === i) return
        const ww = weight(i, j), b = w.getBoundingClientRect(), bx = b.left + b.width / 2 - br.left, by = b.top - br.top
        const lift = Math.min(160, 30 + Math.abs(bx - ax) * .35) + Math.abs(ay - by) * .2
        const p = document.createElementNS(NS, 'path'); p.setAttribute('d', `M${ax},${ay - 4} C${ax},${Math.min(ay, by) - lift} ${bx},${Math.min(ay, by) - lift} ${bx},${by - 4}`)
        p.setAttribute('stroke-width', (.6 + ww * 6).toFixed(2)); p.style.opacity = (.12 + ww * .88).toFixed(2); svg.appendChild(p)
        const len = p.getTotalLength(); p.style.strokeDasharray = len; p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 600, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' })
        w.style.setProperty('--w', ww.toFixed(2))
      })
      words[i].style.setProperty('--w', 1)
    }
    const auto = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => show((cur + 1) % words.length), 2400) }
    words.forEach((w, i) => { w.addEventListener('pointerenter', () => { clearInterval(timer); show(i) }); w.addEventListener('pointerleave', auto) })
    document.fonts.ready.then(() => { show(o.start ?? 0); auto() }); addEventListener('resize', () => show(cur))
  }

  window.FX = { topo, particles, wave, orderbook, graph, network, neural, embedding, attention }
})()
