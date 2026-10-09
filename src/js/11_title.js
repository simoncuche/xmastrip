/* ============ Startseite: Winternacht am Gleis 4 – die ganze Reisegruppe wartet, tanzt, trinkt und springt ============
   TitleScene.start(canvas, stageEl) zeichnet in Gerätepixeln (logisches Pixel = s CSS-Pixel). Die Jungs stehen auf dem Perron
   über dem unteren Rand von stageEl, Antippen lässt eine Figur hüpfen und zeigt Name und Rolle. */
const TITLE_LINES = {
  kassier: ['BILLETT DA!', 'KASSE STIMMT'], saeufer: ['PROST!', 'NO EIS!'], gourmet: ['KAISERSCHMARRN!', 'HUNGER!'],
  party: ['PARTY!', 'SHOTS!'], frech: ['HEHE', 'KICKER-DUELL!'], pilot: ['BOARDING!', 'CAPTAIN SPEAKING'],
  taenzer: ['TANZEN!', '40 UND FIT'], muskel: ['ARMDRÜCKEN!', '200 LIEGESTÜTZ'], kanadier: ['SORRY, EH!', 'AHORNSIRUP!'],
  raucher: ['KURZ EINE RAUCHEN', 'BIN GLEICH DA'], anwalt: ['EINSPRUCH!', 'IM ZWEIFEL: PROST'], charmeur: ['FRISUR SITZT', 'HOI ZÄME'],
  surfer: ["SURF'S UP!", 'FELLE DRAUF!'],
};
const TITLE_ANY = ['JASSEN!', 'GLEIS 4!', 'INNSBRUCK!', 'NOCH 3 MIN!', 'WO IST YÄNNU'];
const TitleScene = {
  cv: null, x: null, stage: null, raf: 0, last: 0, t: 0, crew: [], flakes: [], bg: null, train: null, monster: null, bubbles: [],
  dpr: 1, k: 2, s: 2, W: 0, H: 0, G: 0, P: 0, stageT: 0, reduced: false,
  start(cv, stage) {
    this.stop();
    this.cv = cv; this.stage = stage; this.x = cv.getContext('2d');
    this.reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.t = 0; this.bubbles = []; this.train = { x: 0, dir: -1, wait: 2.5, on: false }; this.monster = { wait: 28, t: -1, x: 0 };
    this.resize();
    this.makeCrew();
    cv.onpointerdown = (e) => this.tap(e);
    this.onResize = () => { this.resize(); };
    window.addEventListener('resize', this.onResize);
    this.last = performance.now();
    const loop = (now) => {
      if (!this.cv || !this.cv.isConnected || this.cv.closest('[hidden]')) { this.stop(); return; }
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      this.update(dt); this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  },
  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    this.onResize = null;
  },
  resize() {
    const cv = this.cv, cw = cv.clientWidth || window.innerWidth, ch = cv.clientHeight || window.innerHeight;
    this.dpr = Math.min(3, window.devicePixelRatio || 1);
    this.s = clamp(Math.round(Math.min(cw / 190, ch / 210)), 2, 5);
    this.k = Math.max(2, Math.round(this.s * this.dpr));
    cv.width = Math.round(cw * this.dpr); cv.height = Math.round(ch * this.dpr);
    this.W = cv.width / this.k; this.H = cv.height / this.k;
    this.q = GFX > 1 ? (this.k % 4 === 0 ? 4 : this.k % 2 === 0 ? 2 : 1) : 1;
    this.layout(true);
    this.flakes = Array.from({ length: Math.round(this.W * this.H / 260) }, () => this.flake(true));
  },
  /* Perron-Kante: unterer Rand der Bühne (zwischen Titel und Karte) */
  layout(force) {
    const r = this.stage.getBoundingClientRect(), c = this.cv.getBoundingClientRect(), f = this.dpr / this.k;
    const G = Math.max(60, Math.min(this.H - 4, (r.bottom - c.top) * f)), sh = Math.max(20, r.height * f);
    const P = Math.round(G - clamp(sh * 0.42, 20, 38));
    this.x0 = Math.max(0, (r.left - c.left) * f); this.x1 = Math.min(this.W, (r.right - c.left) * f);
    if (!force && Math.abs(G - this.G) < 0.5 && P === this.P) return;
    const moved = this.G && Math.abs(G - this.G) > 0.5;
    this.G = G; this.P = P;
    if (moved) for (const m of this.crew) { m.y = clamp(m.y, this.P + 9, this.G - 2); m.x = clamp(m.x, this.x0 + 8, this.x1 - 8); }
    this.buildBg();
  },
  flake(any) { return { x: Math.random() * this.W, y: any ? Math.random() * this.H : -4, v: 7 + Math.random() * 12, r: Math.random() < 0.25 ? 2 : 1, ph: Math.random() * 6 }; },
  makeCrew() {
    const n = CREW.length;
    this.crew = CREW.map((c, i) => {
      const look = crewLook(c.id);
      return { id: c.id, name: c.name, role: c.role, fn: c.fn, look, sheet: this.q > 1 ? getSheetHD(look, this.q) : getSheet(look),
        x: this.x0 + 10 + (this.x1 - this.x0 - 20) * (i + 0.5) / n + rnd(-4, 4), y: rnd(this.P + 9, this.G - 2), z: 0, vz: 0,
        st: 'idle', tt: rnd(0.3, 2.5), dir: 0, vx: 0, ph: Math.random() };
    });
  },
  pick(m) {
    const r = Math.random(), fn = m.fn;
    const dancer = ['taenzer', 'party', 'charmeur'].includes(fn), drinker = ['saeufer', 'kanadier', 'gourmet'].includes(fn);
    if (this.reduced) { m.st = 'idle'; m.dir = 0; m.tt = rnd(3, 6); return; }
    if (r < 0.42) { m.st = 'walk'; m.dir = Math.random() < 0.5 ? 1 : 2; m.vx = (m.dir === 1 ? -1 : 1) * rnd(9, 17); m.tt = rnd(1.5, 4.5); m.ty = rnd(this.P + 9, this.G - 2); }
    else if (r < (dancer ? 0.75 : 0.55)) { m.st = 'dance'; m.dir = 0; m.tt = rnd(2, 4); }
    else if (r < (drinker ? 0.85 : 0.65)) { m.st = 'drink'; m.dir = 0; m.tt = rnd(1.5, 3); }
    else if (r < 0.72) { m.st = 'idle'; m.dir = 3; m.tt = rnd(1, 2.5); }
    else { m.st = 'idle'; m.dir = 0; m.tt = rnd(1, 3); }
    if (Math.random() < 0.08) this.jump(m);
  },
  jump(m) { if (m.z <= 0) m.vz = 70 + Math.random() * 25; },
  say(m, text, name) {
    this.bubbles = this.bubbles.filter((b) => b.m !== m);
    this.bubbles.push({ m, text, name, t: name ? 3.2 : 2.4 });
  },
  tap(e) {
    const r = this.cv.getBoundingClientRect(), f = this.dpr / this.k;
    const px = (e.clientX - r.left) * f, py = (e.clientY - r.top) * f;
    const hit = [...this.crew].sort((a, b) => b.y - a.y).find((m) => Math.abs(px - m.x) < 9 && py < m.y - m.z + 1 && py > m.y - m.z - 27);
    if (!hit) return;
    try { Snd.init(); Snd.sfx('blip'); } catch (err) {}
    this.jump(hit); hit.st = 'idle'; hit.dir = 0; hit.tt = 2.5;
    this.say(hit, hit.role.toUpperCase(), hit.name.toUpperCase());
    const hint = document.querySelector('.t-hint'); if (hint) hint.classList.add('gone');
  },
  update(dt) {
    this.t += dt;
    this.stageT -= dt;
    if (this.stageT <= 0) { this.stageT = 0.25; this.layout(false); }
    const W = this.W, lo = this.x0 + 8, hi = this.x1 - 8;
    for (const m of this.crew) {
      m.tt -= dt;
      if (m.tt <= 0) this.pick(m);
      if (m.st === 'walk') {
        m.x += m.vx * dt;
        m.y += clamp((m.ty - m.y) * dt, -6 * dt, 6 * dt);
        if (m.x < lo) { m.x = lo; m.vx = Math.abs(m.vx); m.dir = 2; }
        if (m.x > hi) { m.x = hi; m.vx = -Math.abs(m.vx); m.dir = 1; }
      }
      if (m.vz || m.z > 0) { m.z += m.vz * dt; m.vz -= 260 * dt; if (m.z <= 0) { m.z = 0; m.vz = 0; } }
    }
    /* Sprechblasen */
    for (const b of this.bubbles) b.t -= dt;
    this.bubbles = this.bubbles.filter((b) => b.t > 0);
    if (!this.reduced && this.bubbles.length < 2 && Math.random() < dt * 0.45) {
      const m = pick(this.crew);
      this.say(m, Math.random() < 0.7 ? pick(TITLE_LINES[m.fn] || TITLE_ANY) : pick(TITLE_ANY));
    }
    /* Zug */
    const tr = this.train;
    if (!tr.on) { tr.wait -= dt; if (tr.wait <= 0 && !this.reduced) { tr.on = true; tr.dir = -tr.dir; tr.x = tr.dir < 0 ? W + 10 : -200; } }
    else { tr.x += tr.dir * 85 * dt; if ((tr.dir < 0 && tr.x < -200) || (tr.dir > 0 && tr.x > W + 10)) { tr.on = false; tr.wait = rnd(7, 12); } }
    /* Godzilla schaut ab und zu hinter den Bergen hervor */
    const mo = this.monster;
    if (mo.t < 0) { mo.wait -= dt; if (mo.wait <= 0 && !this.reduced) { mo.t = 0; mo.x = rnd(W * 0.15, W * 0.85); } }
    else { mo.t += dt; if (mo.t > 7) { mo.t = -1; mo.wait = rnd(35, 60); } }
    for (const f of this.flakes) { f.y += f.v * dt * (this.reduced ? 0.3 : 1); f.x += Math.sin(this.t * 0.8 + f.ph) * 6 * dt; if (f.y > this.H + 2) Object.assign(f, this.flake(false)); }
  },
  /* Statischer Hintergrund: Himmel, Berge mit Schnee, Innsbrucker Dächer – einmal pro Grösse in Spielpixeln */
  buildBg() {
    const W = Math.ceil(this.W), H = Math.ceil(this.H), P = this.P;
    const [c, x] = canvas(W, H);
    for (let y = 0; y < H; y++) R(x, 0, y, W, 1, mix('#0a1328', '#2a3a6a', clamp(y / Math.max(1, P), 0, 1)));
    this.stars = Array.from({ length: Math.round(W * P / 90) }, (_, i) => ({ x: Math.floor(hash(i, 3) * W), y: Math.floor(hash(i, 7) * (P - 30)), b: hash(i, 9) }));
    for (const s of this.stars) P_(x, s.x, s.y, s.b > 0.6 ? '#ffffff' : '#a8b4e8');
    /* Mond */
    const mx = Math.round(W * 0.82), my = Math.round(Math.min(26, P * 0.18));
    E(x, mx, my, 8, 8, '#f4f0d8'); E(x, mx + 3, my - 2, 7, 7, mix('#0a1328', '#2a3a6a', my / Math.max(1, P)));
    /* Hintere Bergkette (Nordkette) */
    const base = P - 10;
    for (let X = 0; X < W; X++) {
      const h = 34 + Math.abs(Math.sin(X * 0.021) * 26 + Math.sin(X * 0.057 + 1) * 10 + Math.sin(X * 0.13) * 3);
      R(x, X, base - h, 1, h + 10, '#1c2a4a');
      R(x, X, base - h, 1, Math.max(2, Math.round(h * 0.22)), '#c8d4ec');
    }
    for (let X = 0; X < W; X++) { const h = 14 + Math.abs(Math.sin(X * 0.04 + 2) * 10 + Math.sin(X * 0.11) * 4); R(x, X, base - h + 4, 1, h, '#142038'); R(x, X, base - h + 4, 1, 2, '#9aa8c8'); }
    /* Altstadt-Dächer mit Fenstern */
    let X = -4, i = 0;
    while (X < W) {
      const w = 10 + Math.floor(hash(i, 1) * 10), h = 10 + Math.floor(hash(i, 2) * 12), col = ['#2a2438', '#30283e', '#262a40'][i % 3];
      R(x, X, base - h, w, h + 4, col);
      if (hash(i, 4) > 0.75) { R(x, X + w / 2 - 2, base - h - 9, 4, 9, col); E(x, X + w / 2, base - h - 10, 3, 3, '#3a4a3a'); P_(x, X + w / 2, base - h - 14, '#3a4a3a'); }
      else { for (let k = 0; k < w / 2; k++) R(x, X + k, base - h - k * 0.6, w - k * 2, 1, '#3a2a30'); }
      for (let wy = base - h + 3; wy < base - 1; wy += 4) for (let wx = X + 2; wx < X + w - 2; wx += 4) if (hash(wx, wy) > 0.55) R(x, wx, wy, 2, 2, hash(wx + 1, wy) > 0.5 ? '#ffd27a' : '#f4a84a');
      X += w; i++;
    }
    /* Gleisbett und Perron */
    R(x, 0, P - 7, W, 7, '#262428'); R(x, 0, P - 5, W, 1, '#7a7e86'); R(x, 0, P - 2, W, 1, '#7a7e86');
    for (let k = 0; k < W; k += 5) R(x, k, P - 4, 3, 1, '#3e3832');
    R(x, 0, P, W, H - P, '#6e7278'); R(x, 0, P, W, 2, '#9a9ea6'); R(x, 0, P + 3, W, 1, '#ffd23d');
    for (let y = P + 8; y < H; y += 7) R(x, 0, y, W, 1, '#62666c');
    for (let k = 0; k < W; k += 14) R(x, k + ((Math.floor(k / 14) % 2) * 7), P + 4, 1, H, 'rgba(0,0,0,0.08)');
    this.bg = c;
  },
  drawSprite(c, m) {
    const pose = m.st === 'walk' ? (Math.floor(this.t * 7 + m.ph * 4) % 2 ? 'walkA' : 'walkB') : m.st === 'dance' ? (Math.floor(this.t * 4 + m.ph * 4) % 2 ? 'danceA' : 'danceB') : m.st === 'drink' ? 'drink' : 'stand';
    const q = this.q, fx = Math.round(m.x - SPR_W / 2), fy = Math.round(m.y - SPR_H - m.z);
    E(c, Math.round(m.x), Math.round(m.y) - 1, Math.max(3, 6 - m.z / 6), 2, 'rgba(0,0,0,0.32)');
    c.drawImage(m.sheet, POSE_I[pose] * SPR_W * q, m.dir * SPR_H * q, SPR_W * q, SPR_H * q, fx, fy, SPR_W, SPR_H);
  },
  drawBubble(c, b) {
    const m = b.m, a = Math.min(1, b.t * 3);
    const w1 = pxTextW(b.text), w2 = b.name ? pxTextW(b.name) : 0, w = Math.max(w1, w2) + 6, h = b.name ? 15 : 9;
    const x0 = Math.round(clamp(m.x - w / 2, 2, this.W - w - 2)), y0 = Math.round(m.y - m.z - SPR_H - h - 5);
    c.globalAlpha = a;
    R(c, x0, y0, w, h, '#fffaf0'); R(c, x0 + 1, y0 - 1, w - 2, 1, '#fffaf0'); R(c, x0 + 1, y0 + h, w - 2, 1, '#fffaf0');
    const tx = Math.round(clamp(m.x, x0 + 3, x0 + w - 4)); R(c, tx - 1, y0 + h + 1, 3, 1, '#fffaf0'); P_(c, tx, y0 + h + 2, '#fffaf0');
    if (b.name) { pxText(c, b.name, x0 + 3, y0 + 2, '#c8302a'); pxText(c, b.text, x0 + 3, y0 + 8, '#1a2238'); }
    else pxText(c, b.text, x0 + 3, y0 + 2, '#1a2238');
    c.globalAlpha = 1;
  },
  draw() {
    const c = this.x, W = this.W, H = this.H, P = this.P, t = this.t;
    c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = false;
    c.setTransform(this.k, 0, 0, this.k, 0, 0); c.imageSmoothingEnabled = false;
    if (this.bg) c.drawImage(this.bg, 0, 0);
    /* Funkelnde Sterne */
    for (let i = 0; i < this.stars.length; i += 7) { const s = this.stars[i]; if (Math.sin(t * 2 + s.b * 20) > 0.6) { P_(c, s.x - 1, s.y, '#ffffff'); P_(c, s.x + 1, s.y, '#ffffff'); P_(c, s.x, s.y - 1, '#ffffff'); P_(c, s.x, s.y + 1, '#ffffff'); } }
    /* Godzilla hinter den Bergen */
    const mo = this.monster;
    if (mo.t >= 0) {
      const up = Math.min(1, mo.t / 1.5, (7 - mo.t) / 1.5), gy = P - 30 - up * 22, gx = mo.x;
      R(c, gx - 7, gy, 14, 26, '#0e1424'); R(c, gx - 4, gy - 8, 10, 10, '#0e1424'); R(c, gx + 4, gy - 5, 6, 4, '#0e1424');
      P_(c, gx + 3, gy - 6, '#ff4a3a');
      const glow = 0.5 + 0.5 * Math.sin(t * 6);
      for (let k = 0; k < 4; k++) R(c, gx - 9 - (k % 2), gy + 2 + k * 5, 3, 3, `rgba(110,200,255,${0.4 + glow * 0.6})`);
      R(c, 0, P - 12, W, 3, '#142038');
    }
    /* Zug (Railjet) */
    const tr = this.train;
    if (tr.on) {
      const ty = P - 25;
      for (let k = 0; k < 3; k++) {
        const x0 = Math.round(tr.x + k * 64);
        R(c, x0, ty, 62, 20, '#a8282a'); R(c, x0, ty, 62, 3, '#6a1418'); R(c, x0, ty + 14, 62, 2, '#e8e4dc'); R(c, x0, ty + 18, 62, 2, '#2a2a2e');
        for (let w = 0; w < 5; w++) R(c, x0 + 4 + w * 12, ty + 5, 8, 6, '#ffe8a8');
        R(c, x0 + 26, ty + 4, 6, 14, '#7a1a1e');
      }
      const nose = tr.dir < 0 ? Math.round(tr.x) - 6 : Math.round(tr.x + 192);
      R(c, nose, ty + 3, 6, 17, '#a8282a'); R(c, nose + (tr.dir < 0 ? 0 : 3), ty + 5, 3, 5, '#3a4a5a');
      E(c, tr.dir < 0 ? nose + 1 : nose + 5, ty + 15, 1, 1, '#fff4c0');
    }
    /* Requisiten hinten auf dem Perron: Laternen, Gleis-Schild, Christbaum */
    const lamp = (lx) => { R(c, lx, P - 34, 2, 38, '#2a2e36'); R(c, lx - 3, P - 37, 8, 4, '#2a2e36'); R(c, lx - 2, P - 33, 6, 2, '#ffe6a0'); c.fillStyle = 'rgba(255,220,140,0.10)'; c.beginPath(); c.moveTo(lx - 2, P - 31); c.lineTo(lx - 16, P + 30); c.lineTo(lx + 18, P + 30); c.lineTo(lx + 4, P - 31); c.fill(); };
    lamp(Math.round(W * 0.1)); lamp(Math.round(W * 0.9));
    const sx = Math.round(W * 0.3);
    const gw = pxTextW('GLEIS 4') + 6;
    R(c, sx, P - 30, 1, 34, '#3a3e46'); R(c, sx + gw - 3, P - 30, 1, 34, '#3a3e46');
    R(c, sx - 2, P - 34, gw + 2, 12, '#ffffff'); R(c, sx - 1, P - 33, gw, 10, '#1a3a7a'); pxText(c, 'GLEIS 4', sx + 2, P - 31, '#ffffff');
    const cx = Math.round(W * 0.68);
    R(c, cx + 2, P - 2, 3, 5, '#5a3a20');
    for (let k = 0; k < 5; k++) R(c, cx + 3 - (k + 1) * 2, P - 4 - k * 5, (k + 1) * 4 + 1, 5, k % 2 ? '#1f5a32' : '#2a6a3a');
    P_(c, cx + 3, P - 30, '#ffd23d'); R(c, cx + 2, P - 29, 3, 1, '#ffd23d');
    const cols = ['#ff5a4a', '#ffd23d', '#5ab0ff', '#ffffff'];
    for (let k = 0; k < 9; k++) { const on = Math.floor(t * 3 + k) % 3 !== 0; if (on) P_(c, cx + 3 + Math.round(Math.sin(k * 2.1) * (2 + k * 0.9)), P - 26 + k * 3, cols[k % 4]); }
    /* Die Jungs, nach Tiefe sortiert */
    for (const m of [...this.crew].sort((a, b) => a.y - b.y)) this.drawSprite(c, m);
    for (const b of this.bubbles) this.drawBubble(c, b);
    /* Schnee im Vordergrund */
    for (const f of this.flakes) R(c, Math.round(f.x), Math.round(f.y), f.r, f.r, f.r > 1 ? 'rgba(255,255,255,0.9)' : 'rgba(230,240,255,0.7)');
  },
};
/* P ist in den Karten-Bauern ein häufiger Name – hier unmissverständlich */
const P_ = (c, x, y, col) => P(c, x, y, col);
