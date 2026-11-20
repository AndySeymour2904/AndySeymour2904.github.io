(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const canvas = document.getElementById('field')
  const hero = document.querySelector('.hero')
  const mode = new URLSearchParams(location.search).get('hero') || 'topo'

  /* nav background after the hero */
  const nav = document.querySelector('.nav')
  const onScroll = () => nav.classList.toggle('solid', scrollY > innerHeight * 0.8)
  addEventListener('scroll', onScroll, { passive: true }); onScroll()

  document.getElementById('print').addEventListener('click', () => print())

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12 })
  document.querySelectorAll('.lede, .co, .skills > div, .proj, .edu').forEach(n => { n.classList.add('reveal'); io.observe(n) })

  /* shared pointer state, relative to hero */
  const ptr = { x: -1e4, y: -1e4, active: 0 }
  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.active = 1 })
  hero.addEventListener('pointerleave', () => { ptr.active = 0 })
  let visible = true
  new IntersectionObserver(es => { visible = es[0].isIntersecting }).observe(hero)

  if (mode === 'particles') particles(); else topo()

  /* ---------- A: topographic contour field (WebGL2) ---------- */
  function topo() {
    const gl = canvas.getContext('webgl2', { antialias: false })
    if (!gl) return
    const vs = `#version 300 es
    in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`
    const fs = `#version 300 es
    precision highp float;
    uniform vec2 R; uniform float T; uniform vec2 M; uniform float H;
    out vec4 o;
    vec2 hash(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1. + 2. * fract(sin(p) * 43758.5453); }
    float noise(vec2 p){
      const float K1 = .366025404, K2 = .211324865;
      vec2 i = floor(p + (p.x + p.y) * K1), a = p - i + (i.x + i.y) * K2;
      float m = step(a.y, a.x); vec2 o2 = vec2(m, 1. - m), b = a - o2 + K2, c = a - 1. + 2. * K2;
      vec3 h = max(.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.);
      vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o2)), dot(c, hash(i + 1.)));
      return dot(n, vec3(70.));
    }
    float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= .5; } return s; }
    void main(){
      vec2 uv = (gl_FragCoord.xy - .5 * R) / R.y;
      vec2 m = (M - .5 * R) / R.y;
      float t = T * .02;
      vec2 q = uv * .95;
      vec2 w = vec2(fbm(q + t), fbm(q + vec2(5.2, 1.3) - t));
      float h = fbm(q + w);
      float d = length(uv - m);
      h += H * .3 * exp(-d * d * 10.);
      float f = h * 11.;
      float fw = fwidth(f);
      float minor = 1. - smoothstep(0., 1.1, abs(fract(f + .5) - .5) / fw);
      float major = 1. - smoothstep(0., 1.4, abs(fract(f / 5. + .5) - .5) * 5. / fw);
      float near = exp(-d * d * 12.) * H;
      float fade = smoothstep(1.3, .2, length(uv * vec2(.75, 1.05)));
      vec3 col = vec3(.043, .047, .055);
      col = mix(col, vec3(.93, .92, .9), minor * .075 * fade);
      col = mix(col, vec3(.93, .92, .9), major * .2 * fade);
      col = mix(col, vec3(1., .42, .24), major * near * .55);
      o = vec4(col, 1.);
    }`
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
    const pr = gl.createProgram()
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr)
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return
    gl.useProgram(pr)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = n => gl.getUniformLocation(pr, n)
    const uR = u('R'), uT = u('T'), uM = u('M'), uH = u('H')
    const dpr = Math.min(devicePixelRatio, 1.5)
    const size = () => { canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; gl.viewport(0, 0, canvas.width, canvas.height) }
    size(); addEventListener('resize', size)
    let mx = canvas.clientWidth * .65, my = canvas.clientHeight * .4, hv = 0
    const t0 = performance.now()
    const frame = now => {
      requestAnimationFrame(frame)
      if (!visible) return
      if (ptr.active) { mx += (ptr.x - mx) * .06; my += (ptr.y - my) * .06 }
      hv += (ptr.active - hv) * .04
      gl.uniform2f(uR, canvas.width, canvas.height)
      gl.uniform1f(uT, reduced ? 0 : (now - t0) / 1000)
      gl.uniform2f(uM, mx * dpr, canvas.height - my * dpr)
      gl.uniform1f(uH, hv)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    requestAnimationFrame(frame)
    canvas.classList.add('on')
  }

  /* ---------- B: the name as particles (Canvas 2D) ---------- */
  function particles() {
    const x = canvas.getContext('2d')
    const h1 = document.querySelector('h1')
    let W, H, pts = []
    const build = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = W * dpr; canvas.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0)
      const off = document.createElement('canvas'); off.width = W; off.height = H
      const o = off.getContext('2d')
      const hr = hero.getBoundingClientRect()
      const cs = getComputedStyle(h1)
      o.font = `${cs.fontWeight} ${cs.fontSize} Archivo`
      if ('fontStretch' in o) o.fontStretch = 'semi-expanded'
      o.letterSpacing = cs.letterSpacing
      o.textBaseline = 'alphabetic'; o.fillStyle = '#000'
      h1.querySelectorAll('.l span').forEach(s => {
        const r = s.getBoundingClientRect()
        o.fillText(s.textContent.toUpperCase(), r.left - hr.left, r.top - hr.top + r.height * .86)
      })
      const d = o.getImageData(0, 0, W, H).data
      const step = W < 600 ? 3 : 4
      const old = pts; pts = []
      for (let yy = 0; yy < H; yy += step) for (let xx = 0; xx < W; xx += step) {
        if (d[(yy * W + xx) * 4 + 3] > 120) {
          const p = old[pts.length] || { x: xx, y: yy, vx: 0, vy: 0 }
          p.hx = xx; p.hy = yy; pts.push(p)
        }
      }
      x.r = step * .44
      h1.style.opacity = pts.length ? 0 : 1
      canvas.classList.add('on')
    }
    document.fonts.ready.then(() => setTimeout(() => { build(); requestAnimationFrame(tick) }, 1300))
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 150) })
    const R = 80
    function tick() {
      requestAnimationFrame(tick)
      if (!visible) return
      x.clearRect(0, 0, W, H)
      const moving = []
      x.fillStyle = '#ecebe6'
      for (const p of pts) {
        if (ptr.active && !reduced) {
          const dx = p.x - ptr.x, dy = p.y - ptr.y, dd = dx * dx + dy * dy
          if (dd < R * R) { const dist = Math.sqrt(dd) || 1, f = (1 - dist / R) * 1.4; p.vx += dx / dist * f; p.vy += dy / dist * f }
        }
        p.vx = (p.vx + (p.hx - p.x) * .06) * .8
        p.vy = (p.vy + (p.hy - p.y) * .06) * .8
        p.x += p.vx; p.y += p.vy
        if (Math.abs(p.vx) + Math.abs(p.vy) > 1.2) moving.push(p)
        else x.fillRect(p.x - x.r, p.y - x.r, x.r * 2, x.r * 2)
      }
      x.fillStyle = '#ff6a3d'
      for (const p of moving) x.fillRect(p.x - x.r, p.y - x.r, x.r * 2, x.r * 2)
    }
  }
})()
