/* Interactive point-surface wave (the Spotlight hero), reusable.
   Wave2(canvas, { host, dot, glow, line, horizon, spot, spotX, density, alpha })
   - host: element that receives pointer events (default: canvas parent)
   - dot: base dot colour [r,g,b]; glow: colour under the cursor [r,g,b]
   - spot: 0..1 strength of the centre spotlight; spotX: 0..1 its x position
   - horizon: 0..1 vertical position of the horizon */
window.Wave2 = function (cv, o = {}) {
  const host = o.host || cv.parentElement, x = cv.getContext('2d')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const dot = o.dot || [245, 245, 247], glow = o.glow || [41, 151, 255], line = o.line || '#7fb5ff'
  const spotK = o.spot ?? 1, spotX = o.spotX ?? .5
  let W, H, NX, NZ, fov, horizon, X0, X1
  const camY = o.camY ?? -1.25, Z0 = 1.6, Z1 = 17
  function size() {
    const dpr = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight
    if (!W || !H) return
    cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0)
    const small = W < 700; NZ = Math.round((small ? 46 : 70) * (o.density || 1))
    fov = Math.max(W * .55, H * .9); horizon = H * (o.horizon ?? .7)
    X1 = W / 2 / fov * Z1 * 1.02; X0 = -X1; NX = Math.round(Math.min(170, X1 * (small ? 16 : 11.5)) * (o.density || 1))
  }
  size(); new ResizeObserver(size).observe(cv)
  const ptr = { sx: 0, sy: 0, on: false, last: -1e9 }
  host.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); ptr.sx = e.clientX - r.left; ptr.sy = e.clientY - r.top; ptr.on = true; ptr.last = performance.now() })
  host.addEventListener('pointerleave', () => ptr.on = false)
  const ripples = []
  host.addEventListener('pointerdown', e => { if (e.target.closest('a,button')) return; const p = toPlane(ptr.sx, ptr.sy); if (p) ripples.push({ x: p[0], z: p[1], t: performance.now() }) })
  const toPlane = (sx, sy) => { if (sy <= horizon + 4) return null; const rz = -camY * fov / (sy - horizon); return [(sx - W / 2) * rz / fov, rz] }
  let cx = 0, cz = 7, amp = 0, vis = true, boost = 0
  new IntersectionObserver(e => vis = e[0].isIntersecting).observe(cv)
  const t0 = performance.now()
  const rgb = (c, a) => `rgb(${c[0]},${c[1]},${c[2]})`
  function frame(now) {
    requestAnimationFrame(frame)
    if (!vis || !W) return
    const t = reduced ? 3 : (now - t0) / 1000, intro = reduced ? 1 : Math.min(1, t / 2.4), ease = 1 - (1 - intro) ** 3
    let tx = Math.sin(t * .23) * X1 * .4, tz = 6.5 + Math.sin(t * .31) * 2.5, follow = .02
    const p = ptr.on || now - ptr.last < 1500 ? toPlane(ptr.sx, ptr.sy) : null
    if (p) { tx = p[0]; tz = Math.min(p[1], Z1); follow = .14 }
    cx += (tx - cx) * follow; cz += (tz - cz) * follow
    amp += ((p ? 1 : .55) - amp) * .04
    while (ripples.length && now - ripples[0].t > 4000) ripples.shift()
    boost *= .965
    x.clearRect(0, 0, W, H)
    const near = []
    for (let j = NZ - 1; j >= 0; j--) {
      const gz = Z0 + (j / (NZ - 1)) ** 1.15 * (Z1 - Z0), depth = 1 - (gz - Z0) / (Z1 - Z0)
      for (let i = 0; i < NX; i++) {
        const gx = X0 + i / (NX - 1) * (X1 - X0)
        let gy = (Math.sin(gx * .42 + t * .7) * .32 + Math.cos(gz * .38 - t * .55) * .3 + Math.sin((gx * .6 + gz) * .27 + t * .35) * .22) * ease * (o.amp ?? 1) * (1 + boost)
        const dx = gx - cx, dz = gz - cz, bump = Math.exp(-(dx * dx + dz * dz) / 4) * 1.1 * amp
        gy += bump
        for (const r of ripples) { const age = (now - r.t) / 1000, f = Math.hypot(gx - r.x, gz - r.z) - age * 6; gy += Math.exp(-f * f * 1.4) * Math.cos(f * 3) * .55 * (r.k || 1) * Math.exp(-age * .8) }
        const px = W / 2 + gx / gz * fov, py = horizon + (gy - camY) / gz * fov
        if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue
        const sxn = (px - W * spotX) / (W * .26), spot = (1 - spotK) + spotK * Math.exp(-sxn * sxn) * (.3 + .7 * Math.exp(-((gz - 5) ** 2) / 18))
        const lit = Math.max(0, (gy + .5) / 1.6)
        const a = (.07 + spot * (.75 + lit * .9)) * (.25 + .75 * depth) * ease * (o.alpha ?? 1)
        if (a < .02) continue
        const g = Math.min(1, bump * 1.3), r = Math.max(.7, 2.6 * depth + .3 + g * 1.2)
        x.globalAlpha = Math.min(1, a + g * .5)
        x.fillStyle = g > .25 ? rgb(dot.map((v, k) => Math.round(v + (glow[k] - v) * Math.min(1, g * 1.1)))) : rgb(dot)
        x.fillRect(px - r / 2, py - r / 2, r, r)
        if (g > .2 && i % 3 === 0 && j % 2 === 0) near.push([px, py, g])
      }
    }
    x.lineWidth = .7; x.strokeStyle = line
    for (let a = 0; a < near.length; a++) for (let b = a + 1; b < near.length; b++) {
      const d = Math.hypot(near[a][0] - near[b][0], near[a][1] - near[b][1])
      if (d > 70) continue
      x.globalAlpha = (1 - d / 70) * Math.min(near[a][2], near[b][2]) * .7 * (o.alpha ?? 1)
      x.beginPath(); x.moveTo(near[a][0], near[a][1]); x.lineTo(near[b][0], near[b][1]); x.stroke()
    }
    x.globalAlpha = 1
  }
  requestAnimationFrame(frame)
  // hooks so other parts of the page can drive the surface
  return {
    ripple(nx = .5, nz = .35, k = 1) { if (!W) return; ripples.push({ x: X0 + nx * (X1 - X0), z: Z0 + nz * (Z1 - Z0), t: performance.now(), k }) },
    pulse(k = .6) { boost = Math.min(2, boost + k) },
  }
}

/* The portrait rebuilt from dots: samples a photo's brightness into points that
   scatter away from the cursor and spring back, with lines between close points. */
window.DotPortrait = function (cv, src, o = {}) {
  const host = o.host || cv.parentElement, x = cv.getContext('2d')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const col = o.color || '#f5f5f7', link = o.link || '#7fb5ff'
  let P = [], W, H
  const img = new Image(); img.src = src
  const ptr = { x: -1e4, y: -1e4 }
  host.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top })
  host.addEventListener('pointerleave', () => { ptr.x = ptr.y = -1e4 })
  function build() {
    const dpr = Math.min(devicePixelRatio, 2); W = cv.clientWidth; H = cv.clientHeight
    if (!W || !img.complete) return
    cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0)
    const s = Math.min(W, H) * (o.scale || .9), ox = W * (o.cx ?? .5) - s / 2, oy = H * (o.cy ?? .5) - s / 2
    const c = document.createElement('canvas'), n = 170; c.width = c.height = n; const g = c.getContext('2d'); g.drawImage(img, 0, 0, n, n)
    const d = g.getImageData(0, 0, n, n).data; P = []
    const step = W < 700 ? 1.6 : 1
    for (let yy = 0; yy < n; yy += step) for (let xx = 0; xx < n; xx += step) {
      const k = ((yy | 0) * n + (xx | 0)) * 4, L = (d[k] * .3 + d[k + 1] * .59 + d[k + 2] * .11) / 255
      const vx = (xx / n - .5) * 2, vy = (yy / n - .5) * 2, vig = 1 - Math.min(1, Math.hypot(vx * .9, vy * .75)) ** 3
      const v = Math.min(1, L ** 1.05 * vig * 1.2)
      if (Math.random() > v * 1.1) continue
      const tx = ox + xx / n * s, ty = oy + yy / n * s
      P.push({ tx, ty, x: tx + (Math.random() - .5) * W, y: ty + (Math.random() - .5) * H, vx: 0, vy: 0, r: .8 + v * 1.5 })
    }
  }
  img.onload = build; new ResizeObserver(build).observe(cv)
  let vis = true; new IntersectionObserver(e => vis = e[0].isIntersecting).observe(cv)
  ;(function frame() {
    requestAnimationFrame(frame); if (!vis || !P.length) return
    x.clearRect(0, 0, W, H); x.fillStyle = col
    const R = 90, near = []
    for (const p of P) {
      const dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy
      if (!reduced && d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 2.4; p.vx += dx / d * f; p.vy += dy / d * f; if (Math.random() < .08) near.push(p) }
      p.vx += (p.tx - p.x) * (reduced ? 1 : .045); p.vy += (p.ty - p.y) * (reduced ? 1 : .045); p.vx *= .82; p.vy *= .82
      p.x += p.vx; p.y += p.vy
      x.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r)
    }
    x.strokeStyle = link; x.lineWidth = .6
    for (let a = 0; a < near.length; a++) for (let b = a + 1; b < near.length; b++) { const d = Math.hypot(near[a].x - near[b].x, near[a].y - near[b].y); if (d < 46) { x.globalAlpha = 1 - d / 46; x.beginPath(); x.moveTo(near[a].x, near[a].y); x.lineTo(near[b].x, near[b].y); x.stroke() } }
    x.globalAlpha = 1
  })()
}
