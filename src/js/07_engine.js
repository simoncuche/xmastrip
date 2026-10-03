/* ============ Karten-Laufzeit ============ */
class GMap {
  constructor(id, w, h, o = {}) {
    Object.assign(this, { id, w, h, name: o.name || id, indoor: !!o.indoor, bg: o.bg || '#0a0c10', music: o.music || null, city: o.city || null, daylight: o.daylight !== false && !o.indoor, wallStyle: o.wallStyle || {}, ambient: o.ambient || 0 });
    this.g = new Uint8Array(w * h);
    this.v = new Uint8Array(w * h);
    this.sol = new Uint8Array(w * h);
    this.objs = []; this.trigs = []; this.npcDefs = []; this.lights = []; this.decals = []; this.spawns = {};
    this.vehicles = []; this.pedZones = []; this.birdSpots = []; this.anims = [];
  }
  in(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  at(x, y) { return this.in(x, y) ? this.g[y * this.w + x] : T.VOID; }
  set(x, y, t, v = 0) { if (!this.in(x, y)) return; const i = y * this.w + x; this.g[i] = t; this.v[i] = v; this.sol[i] = SOLID_T.has(t) ? 1 : 0; }
  fill(x, y, w, h, t, v = 0) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) this.set(xx, yy, t, typeof v === 'function' ? v(xx, yy) : v); }
  solid(x, y, w = 1, h = 1, val = 1) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (this.in(xx, yy)) this.sol[yy * this.w + xx] = val; }
  isSolid(x, y) { return !this.in(x, y) || this.sol[y * this.w + x] === 1; }
  add(o) { this.objs.push(o); if (o.solid) this.solid(o.x, o.y, o.w, o.h, 1); if (o.light) this.lights.push({ x: o.x * TS + o.light.dx, y: o.y * TS - o.drawH + o.light.dy, r: o.light.r, c: o.light.c }); return o; }
  trig(x, y, w, h, o) { const t = Object.assign({ x, y, w, h }, o); this.trigs.push(t); return t; }
  warp(x, y, to, spawn, o = {}) { this.solid(x, y, o.w || 1, o.h || 1, 0); return this.trig(x, y, o.w || 1, o.h || 1, Object.assign({ auto: true, warp: [to, spawn] }, o)); }
  spawn(name, x, y, dir = 0) { this.spawns[name] = { x: x * TS + 8, y: y * TS + 14, dir }; }
  decal(fn) { this.decals.push(fn); }
  light(px, py, r, c = '#ffd78a') { this.lights.push({ x: px, y: py, r, c }); }
}
function getMap(id) {
  if (!BUILT[id]) { const m = MAP_BUILDERS[id](); prerenderMap(m); BUILT[id] = m; }
  return BUILT[id];
}
function prerenderMap(m) {
  const [gc, gx] = canvas(m.w * TS, m.h * TS);
  for (let y = 0; y < m.h; y++)
    for (let x = 0; x < m.w; x++) {
      const t = m.g[y * m.w + x];
      const fn = TILE_PAINT[t];
      if (fn) fn(gx, x * TS, y * TS, x, y, m, m.v[y * m.w + x]);
    }
  for (const d of m.decals) d(gx);
  m.gcv = gc;
  for (const o of m.objs) {
    const W = o.w * TS + o.padX * 2, H = o.h * TS + o.drawH;
    const [c, x] = canvas(W, H);
    o.paint(x, W, H, o);
    o.cv = c;
    if (o.emit) { const [ec, ex] = canvas(W, H); o.emit(ex, W, H, o); o.ecv = ec; }
    o.px = o.x * TS - o.padX; o.py = o.y * TS - o.drawH;
    /* Tiefenlinie knapp über der untersten Kachelreihe: Wer in der untersten Reihe steht (z. B. in einer Tür), wird vor dem Objekt gezeichnet;
       Akteure haben ihre Füsse bei Kachel*16+3 … +18, darum -14. */
    o.sortY = (o.y + o.h) * TS - 14 - (o.sortOff || 0);
  }
}

/* ============ Akteure ============ */
class Actor {
  constructor(o) {
    Object.assign(this, { x: 0, y: 0, dir: 0, pose: 'stand', look: null, name: '', speed: 42, solid: true, walkT: 0, moving: false, hidden: false, anim: null, bubble: null, bubbleT: 0, path: null, emote: null }, o);
  }
}
function actorBlocked(m, x, y, self) {
  const x0 = Math.floor((x - 5) / TS), x1 = Math.floor((x + 4) / TS), y0 = Math.floor((y - 5) / TS), y1 = Math.floor((y - 1) / TS);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (m.isSolid(tx, ty)) return true;
  const list = self === G.player ? G.npcs : G.npcs.concat([G.player]);
  for (const n of list) {
    if (n === self || n.hidden || !n.solid) continue;
    if (Math.abs(n.x - x) < 10 && Math.abs(n.y - y) < 7) return true;
  }
  return false;
}
function moveActor(a, dx, dy) {
  const m = G.map;
  let moved = false;
  if (dx) {
    if (!actorBlocked(m, a.x + dx, a.y, a)) { a.x += dx; moved = true; }
    else if (!dy) for (const n of [1, -1, 2, -2, 3, -3, 4, -4]) { if (!actorBlocked(m, a.x + dx, a.y + n, a) && !actorBlocked(m, a.x, a.y + Math.sign(n), a)) { a.y += Math.sign(n) * Math.min(1, Math.abs(dx)); moved = true; break; } }
  }
  if (dy) {
    if (!actorBlocked(m, a.x, a.y + dy, a)) { a.y += dy; moved = true; }
    else if (!dx) for (const n of [1, -1, 2, -2, 3, -3, 4, -4]) { if (!actorBlocked(m, a.x + n, a.y + dy, a) && !actorBlocked(m, a.x + Math.sign(n), a.y, a)) { a.x += Math.sign(n) * Math.min(1, Math.abs(dy)); moved = true; break; } }
  }
  return moved;
}
const DIRV = [[0, 1], [-1, 0], [1, 0], [0, -1]];
function dirTo(ax, ay, bx, by) { const dx = bx - ax, dy = by - ay; return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : dy < 0 ? 3 : 0; }

/* ============ Eingabe ============ */
const Input = {
  keys: {}, stick: { x: 0, y: 0, on: false, id: null, ox: 0, oy: 0 }, aQueued: false, touch: false,
  axis() {
    let x = 0, y = 0;
    const k = this.keys;
    if (k.ArrowLeft || k.KeyA) x -= 1; if (k.ArrowRight || k.KeyD) x += 1;
    if (k.ArrowUp || k.KeyW) y -= 1; if (k.ArrowDown || k.KeyS) y += 1;
    let run = !!(k.ShiftLeft || k.ShiftRight);
    if (this.stick.on) { x = this.stick.x; y = this.stick.y; run = Math.hypot(x, y) > 0.92; }
    const l = Math.hypot(x, y);
    if (l > 1) { x /= l; y /= l; }
    return { x, y, run };
  },
};

/* ============ Kamera & Ansicht ============ */
const View = { cv: null, ctx: null, wcv: null, wctx: null, lcv: null, lctx: null, w: 320, h: 200, scale: 3 };
function resizeView() {
  const W = window.innerWidth, H = window.innerHeight;
  const s = Math.max(2, Math.floor(Math.min(W, H * 1.15) / (16 * 11.5)));
  View.scale = s;
  View.w = Math.ceil(W / s); View.h = Math.ceil(H / s);
  for (const k of ['cv', 'wcv', 'lcv']) { View[k].width = View.w; View[k].height = View.h; }
  View.cv.style.width = View.w * s + 'px'; View.cv.style.height = View.h * s + 'px';
  for (const k of ['ctx', 'wctx', 'lctx']) View[k].imageSmoothingEnabled = false;
}
function updateCamera(snap) {
  const m = G.map, p = G.player;
  let tx = p.x - View.w / 2, ty = p.y - 12 - View.h / 2;
  const mw = m.w * TS, mh = m.h * TS;
  if (mw <= View.w) tx = (mw - View.w) / 2; else tx = clamp(tx, 0, mw - View.w);
  if (mh <= View.h) ty = (mh - View.h) / 2; else ty = clamp(ty, 0, mh - View.h);
  if (m.camYOff) ty += m.camYOff;
  if (snap) { G.cam.x = tx; G.cam.y = ty; }
  else { G.cam.x += (tx - G.cam.x) * 0.18; G.cam.y += (ty - G.cam.y) * 0.18; }
}

/* ============ Karte laden ============ */
function enterMap(id, spawn, opts = {}) {
  const m = getMap(id);
  G.map = m;
  const sp = typeof spawn === 'string' ? m.spawns[spawn] : spawn;
  if (!G.player) G.player = new Actor({ look: G.S.look, name: G.S.name, solid: true });
  G.player.look = G.S.look;
  if (sp) { G.player.x = sp.x; G.player.y = sp.y; G.player.dir = sp.dir ?? G.player.dir; }
  G.player.pose = 'stand'; G.player.anim = null;
  G.npcs = []; G.peds = []; G.parts = []; G.birds = [];
  if (G.live) { const l = G.live; G.live = null; if (l.onLeave) l.onLeave(); }
  for (const d of m.npcDefs) if (!d.cond || d.cond()) G.npcs.push(new Actor(Object.assign({}, d)));
  Story.populate(m);
  spawnPeds(m);
  spawnBirds(m);
  for (const v of m.vehicles) if (v.reset) v.reset();
  Snd.music(m.musicFn ? m.musicFn() : m.music);
  updateCamera(true);
  G.lastTile = null;
  UI.hud();
  if (m.onEnter) m.onEnter(opts);
  G.S.map = id;
  Story.onEnter(m);
}
async function warpTo(id, spawn, opts = {}) {
  G.busy++;
  const to = getMap(id);
  /* Kleine Türszene statt nur Schwarzbild: hinein (Rückenansicht, Tür geht auf) oder hinaus (Tür zu, Gesicht zum Spieler) */
  const exit = !!(G.map && G.map.indoor && !to.indoor);
  if (opts.plain || typeof Scene === 'undefined') { Snd.sfx('door'); await UI.fadeOut(); }
  else await Scene.play('door', { ms: 820, keep: true, exit, label: opts.label || '' });
  enterMap(id, spawn, opts);
  await sleep(100);
  await UI.fadeIn();
  G.busy--;
  if (opts.after) await opts.after();
  saveGame(true);
}

/* ============ Fussgänger, Vögel, Partikel ============ */
function spawnPeds(m) {
  for (const z of m.pedZones) {
    for (let i = 0; i < z.n; i++) {
      for (let tries = 0; tries < 30; tries++) {
        const tx = z.x + Math.floor(Math.random() * z.w), ty = z.y + Math.floor(Math.random() * z.h);
        if (m.isSolid(tx, ty)) continue;
        const look = randomLook(Math.random, {});
        const a = new Actor({ x: tx * TS + 8, y: ty * TS + 12, dir: rint(0, 3), look, solid: false, speed: rnd(16, 26), zone: z, ped: true, name: '', wait: rnd(0, 3) });
        if (z.sit) { a.pose = 'sit'; a.speed = 0; }
        if (z.dance) { a.dance = true; a.speed = 0; a.dir = 0; }
        if (z.drink) { a.drinker = true; a.speed = 0; }
        G.peds.push(a);
        break;
      }
    }
  }
}
function updatePed(a, dt) {
  const m = G.map;
  if (a.dance) { a.pose = Math.floor(G.t * 2.07 + a.x) % 2 ? 'danceA' : 'danceB'; return; }
  if (a.drinker) { a.pose = Math.floor(G.t * 0.25 + a.x * 0.1) % 4 === 0 ? 'drink' : 'stand'; return; }
  if (a.speed === 0) return;
  if (a.wait > 0) { a.wait -= dt; a.moving = false; return; }
  if (!a.target) {
    const z = a.zone;
    for (let tries = 0; tries < 8; tries++) {
      const d = rint(0, 3), len = rint(2, 7);
      const tx = Math.floor(a.x / TS) + DIRV[d][0] * len, ty = Math.floor(a.y / TS) + DIRV[d][1] * len;
      if (tx < z.x || ty < z.y || tx >= z.x + z.w || ty >= z.y + z.h || m.isSolid(tx, ty)) continue;
      a.target = { x: tx * TS + 8, y: ty * TS + 12 }; a.dir = d; break;
    }
    if (!a.target) { a.wait = rnd(0.5, 2); return; }
  }
  const dx = a.target.x - a.x, dy = a.target.y - a.y;
  const d = Math.hypot(dx, dy);
  if (d < 1.5) { a.target = null; a.moving = false; if (Math.random() < 0.4) a.wait = rnd(0.5, 4); return; }
  const sp = a.speed * dt;
  const nx = a.x + (dx / d) * sp, ny = a.y + (dy / d) * sp;
  const tx = Math.floor(nx / TS), ty = Math.floor((ny - 2) / TS);
  if (m.isSolid(tx, ty)) { a.target = null; a.wait = rnd(0.3, 1); return; }
  a.x = nx; a.y = ny; a.moving = true; a.walkT += dt;
  a.dir = dirTo(0, 0, dx, dy);
}
function spawnBirds(m) {
  for (const s of m.birdSpots) for (let i = 0; i < s.n; i++) G.birds.push({ x: (s.x + Math.random() * s.w) * TS, y: (s.y + Math.random() * s.h) * TS, vx: 0, vy: 0, z: 0, vz: 0, state: 'peck', t: rnd(0, 3), spot: s, kind: s.kind || 'pigeon', fx: Math.random() < 0.5 });
}
function updateBirds(dt) {
  const p = G.player;
  let dead = false;
  for (const b of G.birds) {
    if (b.kind === 'cat' || b.kind === 'dog') { b.t += dt; b.x += b.vx * dt; b.y += b.vy * dt; b.fx = b.vx < 0; if (b.t > b.life) { b.dead = true; dead = true; } continue; }
    const d = Math.hypot(b.x - p.x, b.y - p.y);
    if (b.kind === 'marmot') {
      if (b.state === 'hide') { b.t += dt; if (b.t > 7) { b.state = 'peck'; b.t = 0; } }
      else { b.t += dt; if (d < 42) { b.state = 'hide'; b.t = 0; Snd.tone(2400, 0.18, 'sine', 0.06); Snd.tone(2000, 0.12, 'sine', 0.05, 0.2); } }
      continue;
    }
    if (b.state !== 'fly' && (b.kind === 'pigeon' || b.kind === 'crow') && d < (p.running ? 34 : 16)) { b.state = 'fly'; b.vx = (b.x - p.x) / (d || 1) * rnd(40, 70); b.vy = (b.y - p.y) / (d || 1) * rnd(20, 40) - 10; b.vz = rnd(40, 60); if (Math.random() < 0.3) Snd.sfx('whoosh'); }
    if (b.state === 'fly') {
      b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt; b.vz -= 5 * dt;
      b.t += dt;
      if (b.t > 2.5) { b.state = 'return'; b.t = 0; b.tx = (b.spot.x + Math.random() * b.spot.w) * TS; b.ty = (b.spot.y + Math.random() * b.spot.h) * TS; }
    } else if (b.state === 'return') {
      const dx = b.tx - b.x, dy = b.ty - b.y, dd = Math.hypot(dx, dy);
      b.x += dx / (dd || 1) * Math.min(dd, 60 * dt); b.y += dy / (dd || 1) * Math.min(dd, 60 * dt); b.z = Math.max(0, b.z - 30 * dt);
      if (dd < 2 && b.z <= 0) { b.state = 'peck'; b.t = 0; }
    } else if (b.state === 'feed') {
      const dx = b.tx - b.x, dy = b.ty - b.y, dd = Math.hypot(dx, dy);
      if (dd > 3) { b.x += dx / dd * 22 * dt; b.y += dy / dd * 22 * dt; b.fx = dx < 0; }
      b.t += dt; if (b.t > 8) { b.state = 'peck'; b.t = 0; }
    } else {
      b.t += dt;
      if (b.kind === 'duck') { b.x += Math.sin(b.t * 0.6 + b.y) * 4 * dt; b.y += Math.cos(b.t * 0.4 + b.x) * 3 * dt; }
      else if (Math.random() < dt * 0.6) { b.x += rnd(-3, 3); b.y += rnd(-2, 2); b.fx = Math.random() < 0.5; }
    }
  }
  if (dead) G.birds = G.birds.filter((b) => !b.dead);
}
function drawBird(c, b, cx, cy) {
  const x = Math.round(b.x - cx), y = Math.round(b.y - cy - b.z);
  if (b.kind === 'cat' || b.kind === 'dog') {
    const leg = Math.floor(b.t * 12) % 2, s = b.fx ? -1 : 1;
    E(c, x, y + 1, 5, 1, 'rgba(0,0,0,0.25)');
    if (b.kind === 'cat') {
      R(c, x - 4, y - 4, 8, 3, '#7a7a82'); R(c, x + s * 4, y - 6, 3, 3, '#7a7a82'); P(c, x + s * 4, y - 7, '#7a7a82'); P(c, x + s * 6, y - 7, '#7a7a82');
      P(c, x + s * 5, y - 5, '#3ad04a'); line(c, x - s * 4, y - 4, x - s * 8, y - 8 + leg, '#7a7a82');
      R(c, x - 3, y - 1, 1, 2 - leg, '#5a5a62'); R(c, x + 2, y - 1, 1, 1 + leg, '#5a5a62');
    } else {
      R(c, x - 6, y - 4, 12, 4, '#6a4428'); R(c, x + s * 6, y - 7, 4, 4, '#6a4428'); R(c, x + s * 7, y - 8, 2, 2, '#4a2e1a'); P(c, x + s * 8, y - 6, '#1a1a1a');
      line(c, x - s * 6, y - 4, x - s * 8, y - 7, '#6a4428');
      R(c, x - 5, y, 2, 2 - leg, '#4a2e1a'); R(c, x + 3, y, 2, 1 + leg, '#4a2e1a');
    }
    return;
  }
  if (b.kind === 'marmot') {
    E(c, x, y + 1, 4, 1, 'rgba(0,0,0,0.25)');
    if (b.state === 'hide') { E(c, x, y, 3, 1, '#4a3a2a'); return; }
    const up = Math.floor(b.t * 0.5 + b.x) % 3 === 0;
    if (up) { R(c, x - 2, y - 8, 5, 8, '#8a6a42'); R(c, x - 1, y - 10, 3, 3, '#7a5a38'); P(c, x, y - 9, '#1a1a1a'); R(c, x - 1, y - 5, 3, 3, '#c8a878'); }
    else { R(c, x - 4, y - 4, 8, 4, '#8a6a42'); R(c, x + (b.fx ? -6 : 3), y - 5, 3, 3, '#7a5a38'); P(c, x + (b.fx ? -5 : 4), y - 4, '#1a1a1a'); }
    return;
  }
  if (b.kind === 'duck') {
    R(c, x - 3, y - 2, 6, 3, '#8a6a4a'); R(c, x + (b.fx ? -4 : 2), y - 4, 3, 3, '#2f6a3a'); P(c, x + (b.fx ? -5 : 5), y - 3, '#e8a83a'); R(c, x - 3, y + 1, 7, 1, 'rgba(255,255,255,0.35)');
    return;
  }
  if (b.z <= 0) E(c, x, y + 1, 2, 1, 'rgba(0,0,0,0.2)'); else E(c, Math.round(b.x - cx), Math.round(b.y - cy) + 1, 2, 1, 'rgba(0,0,0,0.15)');
  const fl = b.state === 'fly' && Math.floor(G.t * 14) % 2;
  const crow = b.kind === 'crow', body = crow ? '#1c1c24' : '#8a8e9a', head = crow ? '#121218' : '#6a6e7a', wing = crow ? '#2a2a34' : '#a8acb8';
  R(c, x - 2, y - 3, 4, 3, body); R(c, x + (b.fx ? -3 : 1), y - 5, 2, 2, head); P(c, x + (b.fx ? -3 : 2), y - 4, crow ? '#3a3a40' : '#e86a3a');
  if (b.state === 'peck' && Math.floor(G.t * 3 + b.x) % 4 === 0) R(c, x + (b.fx ? -3 : 1), y - 3, 2, 2, head);
  if (fl) { R(c, x - 4, y - 5, 3, 1, wing); R(c, x + 1, y - 5, 3, 1, wing); }
  P(c, x - 1, y - 2, crow ? '#3a3a48' : '#4a7a8a');
}
function addPart(o) { G.parts.push(Object.assign({ t: 0, life: 1, vx: 0, vy: 0, g: 0 }, o)); }
function updateParts(dt) {
  for (const p of G.parts) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; }
  G.parts = G.parts.filter((p) => p.t < p.life);
}

/* ============ Rendern ============ */
function frameIndex(a) {
  if (a.pose === 'sit') return 3;
  if (a.pose === 'drink') return 4;
  if (a.pose === 'danceA') return 5;
  if (a.pose === 'danceB') return 6;
  if (a.pose === 'bend') return 7;
  if (a.moving) { const f = Math.floor(a.walkT * (a.running ? 10 : 7)) % 4; return [1, 0, 2, 0][f]; }
  return 0;
}
function drawActor(c, a, cx, cy) {
  if (a.hidden) return;
  const sheet = getSheet(a.look);
  const fi = frameIndex(a);
  const x = Math.round(a.x - cx - SPR_W / 2), y = Math.round(a.y - cy - SPR_H + 1);
  if (a.pose !== 'sit') E(c, Math.round(a.x - cx), Math.round(a.y - cy) - 1, 5, 2, 'rgba(0,0,0,0.25)');
  c.drawImage(sheet, fi * SPR_W, a.dir * SPR_H, SPR_W, SPR_H, x, y, SPR_W, SPR_H);
  if (a.dog) {
    const dx = Math.round(a.x - cx) + (a.dir === 1 ? 10 : a.dir === 2 ? -16 : 8), dy = Math.round(a.y - cy) - 1;
    const step = a.moving && Math.floor(G.t * 8) % 2;
    E(c, dx + 4, dy, 5, 1, 'rgba(0,0,0,0.2)');
    R(c, dx, dy - 5, 9, 3, '#7a4a24'); R(c, dx + (a.dir === 2 ? -2 : 8), dy - 7, 3, 3, '#7a4a24'); P(c, dx + (a.dir === 2 ? -2 : 10), dy - 6, '#1a1a1a');
    R(c, dx + 1, dy - 2, 1, 2 - step, '#5a3418'); R(c, dx + 7, dy - 2, 1, 1 + step, '#5a3418'); R(c, dx + (a.dir === 2 ? 9 : -1), dy - 6, 1, 2, '#5a3418');
  }
  if (a.bubble && a.bubbleT > 0) drawBubble(c, Math.round(a.x - cx), y - 3, a.bubble);
  if (a === G.player && G.S.st.wet > 0 && Math.random() < 0.3) addPart({ x: a.x + rnd(-5, 5), y: a.y - rnd(4, 18), vy: 20, life: 0.5, kind: 'drip' });
}
function drawBubble(c, x, y, b) {
  R(c, x - 6, y - 10, 13, 9, '#ffffff'); R(c, x - 5, y - 11, 11, 1, '#ffffff'); R(c, x - 5, y - 1, 11, 1, '#ffffff'); P(c, x - 1, y, '#ffffff');
  R(c, x - 7, y - 10, 1, 9, '#1a1a22'); R(c, x + 7, y - 10, 1, 9, '#1a1a22'); R(c, x - 5, y - 12, 11, 1, '#1a1a22'); R(c, x - 5, y, 4, 1, '#1a1a22'); R(c, x + 1, y, 5, 1, '#1a1a22');
  const ic = b;
  if (ic === '!') { R(c, x, y - 9, 1, 4, '#d8352d'); P(c, x, y - 4, '#d8352d'); }
  else if (ic === '?') { R(c, x - 1, y - 9, 3, 1, '#2f5fb8'); P(c, x + 1, y - 8, '#2f5fb8'); P(c, x, y - 7, '#2f5fb8'); P(c, x, y - 4, '#2f5fb8'); }
  else if (ic === 'beer') { R(c, x - 2, y - 8, 4, 5, '#e8b33a'); R(c, x - 2, y - 9, 4, 1, '#fff'); P(c, x + 2, y - 6, '#c9ccd2'); }
  else if (ic === 'note') { R(c, x - 1, y - 9, 1, 5, '#6a3ab0'); R(c, x - 3, y - 5, 3, 2, '#6a3ab0'); R(c, x, y - 9, 3, 1, '#6a3ab0'); }
  else if (ic === 'heart') { R(c, x - 3, y - 8, 2, 2, '#e04a6a'); R(c, x + 1, y - 8, 2, 2, '#e04a6a'); R(c, x - 2, y - 7, 5, 2, '#e04a6a'); P(c, x, y - 5, '#e04a6a'); }
  else if (ic === 'zzz') { pxText(c, 'Z', x - 3, y - 9, '#2f5fb8'); P(c, x + 2, y - 8, '#2f5fb8'); }
  else if (ic === 'dots') { P(c, x - 3, y - 6, '#555'); P(c, x, y - 6, '#555'); P(c, x + 3, y - 6, '#555'); }
  else if (ic === 'card') { R(c, x - 2, y - 9, 4, 6, '#f4f0e6'); P(c, x - 1, y - 7, '#c8352d'); R(c, x - 2, y - 9, 4, 1, '#888'); }
}
function drawPart(c, p, cx, cy) {
  const x = Math.round(p.x - cx), y = Math.round(p.y - cy);
  const a = 1 - p.t / p.life;
  switch (p.kind) {
    case 'drip': P(c, x, y, `rgba(150,200,240,${a})`); break;
    case 'splash': R(c, x, y, 2, 2, `rgba(170,215,245,${a})`); break;
    case 'smoke': E(c, x, y, 1 + p.t * 3, 1 + p.t * 2.5, `rgba(220,220,225,${a * 0.45})`); break;
    case 'vomit': R(c, x, y, p.s || 2, p.s || 2, p.col || `rgba(165,170,60,${a})`); if (p.s > 2) P(c, x, y, `rgba(220,215,120,${a})`); break;
    case 'txt': pxText(c, p.txt, x - pxTextW(p.txt) / 2, y, p.col || `rgba(255,255,255,${a})`, p.scale || 1); break;
    case 'note': R(c, x, y - 4, 1, 4, `rgba(80,40,160,${a})`); R(c, x - 2, y, 3, 2, `rgba(80,40,160,${a})`); break;
    case 'crumb': P(c, x, y, `rgba(220,190,120,${a})`); break;
    case 'spark': P(c, x, y, p.col || `rgba(255,230,140,${a})`); break;
    case 'zzz': pxText(c, 'Z', x, y, `rgba(60,90,180,${a})`); break;
    case 'heart': R(c, x - 1, y, 3, 2, `rgba(224,74,106,${a})`); P(c, x, y + 2, `rgba(224,74,106,${a})`); break;
    case 'beer': R(c, x, y, 3, 4, `rgba(232,179,58,${a})`); R(c, x, y - 1, 3, 1, `rgba(255,255,255,${a})`); break;
  }
}
function darkness() {
  const m = G.map;
  if (!m.daylight) return { a: m.ambient || 0, tint: null };
  const h = hourOf(G.S.time);
  let a = 0;
  if (h < 5.5) a = 0.66; else if (h < 7.5) a = lerp(0.66, 0, (h - 5.5) / 2);
  else if (h < 18.5) a = 0; else if (h < 21) a = lerp(0, 0.66, (h - 18.5) / 2.5); else a = 0.66;
  let tint = null;
  if (h > 17.5 && h < 20.5) tint = `rgba(255,120,40,${0.12 * Math.sin(((h - 17.5) / 3) * Math.PI)})`;
  if (h > 5.5 && h < 7.5) tint = `rgba(255,170,120,${0.1 * Math.sin(((h - 5.5) / 2) * Math.PI)})`;
  return { a, tint };
}
function renderWorld() {
  const c = View.wctx, m = G.map;
  const cx = Math.round(G.cam.x), cy = Math.round(G.cam.y);
  const vw = View.w, vh = View.h;
  c.fillStyle = m.bg; c.fillRect(0, 0, vw, vh);
  if (m.bgDraw) m.bgDraw(c, cx, cy, G.t);
  c.drawImage(m.gcv, -cx, -cy);
  if (m.groundAnim) m.groundAnim(c, cx, cy, G.t);
  for (const v of G.S.vomitSpots) if (v.map === m.id && G.S.time - v.t < 240) { const x = Math.round(v.x - cx), y = Math.round(v.y - cy); E(c, x, y, 11, 5, 'rgba(140,150,50,0.85)'); E(c, x + 4, y - 2, 5, 3, 'rgba(190,190,80,0.9)'); E(c, x - 5, y + 1, 4, 2, 'rgba(150,160,60,0.85)'); for (let k = 0; k < 6; k++) P(c, x - 7 + k * 3, y - 3 + (k % 3), k % 2 ? '#c8a040' : '#9aa050'); P(c, x + 9, y + 1, '#c8a040'); P(c, x - 9, y - 1, '#c8a040'); }
  /* Nachtlicht vorab berechnen: leuchtende Fenster werden mit dem Objekt gezeichnet (hinter Figuren), nicht als Ebene darüber */
  const d = darkness();
  const emitA = d.a > 0.2 ? clamp((d.a - 0.2) / 0.3, 0, 1) : 0;
  const emitVisible = (o) => o.ecv && !(o.px - cx > vw || o.px + o.cv.width - cx < 0 || o.py - cy > vh || o.py + o.cv.height - cy < 0);
  /* sortierte Ebene */
  const list = [];
  for (const o of m.objs) {
    if (o.px - cx > vw || o.px + o.cv.width - cx < 0 || o.py - cy > vh || o.py + o.cv.height - cy < 0) continue;
    list.push({ y: o.sortY, o });
  }
  for (const a of G.npcs) if (!a.hidden) list.push({ y: a.y + (a.sortAdd || 0), a });
  for (const a of G.peds) list.push({ y: a.y, a });
  if (!G.player.hidden) list.push({ y: G.player.y + (G.player.sortAdd || 0), a: G.player });
  for (const v of m.vehicles) if (v.draw) list.push({ y: v.sortY ? v.sortY() : v.y, v });
  for (const b of G.birds) list.push({ y: b.y, b });
  list.sort((p, q) => p.y - q.y);
  for (const it of list) {
    if (it.o) {
      c.drawImage(it.o.cv, it.o.px - cx, it.o.py - cy);
      if (emitA > 0 && it.o.ecv) { c.globalAlpha = emitA; c.drawImage(it.o.ecv, it.o.px - cx, it.o.py - cy); c.globalAlpha = 1; }
      if (it.o.anim) it.o.anim(c, G.t, it.o.px - cx, it.o.py - cy);
    }
    else if (it.a) drawActor(c, it.a, cx, cy);
    else if (it.v) it.v.draw(c, cx, cy, G.t);
    else if (it.b) drawBird(c, it.b, cx, cy);
  }
  for (const p of G.parts) drawPart(c, p, cx, cy);
  if (G.live && G.live.draw) G.live.draw(c, cx, cy, G.t);
  if (m.overlay) m.overlay(c, cx, cy, G.t);
  /* Licht */
  if (d.a > 0.01) {
    const l = View.lctx;
    l.globalCompositeOperation = 'source-over';
    l.clearRect(0, 0, vw, vh);
    l.fillStyle = `rgba(10,14,38,${d.a})`;
    l.fillRect(0, 0, vw, vh);
    l.globalCompositeOperation = 'destination-out';
    const lights = m.lights.concat(m.dynLights ? m.dynLights() : [], G.live && G.live.lights ? G.live.lights() : []);
    for (const L of lights) {
      const x = L.x - cx, y = L.y - cy;
      if (x < -L.r || y < -L.r || x > vw + L.r || y > vh + L.r) continue;
      const gr = l.createRadialGradient(x, y, 0, x, y, L.r);
      gr.addColorStop(0, 'rgba(0,0,0,0.95)'); gr.addColorStop(0.5, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      l.fillStyle = gr; l.fillRect(x - L.r, y - L.r, L.r * 2, L.r * 2);
    }
    if (!m.indoor) { const px = G.player.x - cx, py = G.player.y - cy - 10; const gr = l.createRadialGradient(px, py, 0, px, py, 30); gr.addColorStop(0, 'rgba(0,0,0,0.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); l.fillStyle = gr; l.fillRect(px - 30, py - 30, 60, 60); }
    /* Fensterflächen aus der Dunkelheit ausschneiden, damit sie hell leuchten – wer davor steht, wird vom Fenster angestrahlt */
    if (emitA > 0) { l.globalAlpha = emitA * 0.9; for (const o of m.objs) if (emitVisible(o)) l.drawImage(o.ecv, o.px - cx, o.py - cy); l.globalAlpha = 1; }
    l.globalCompositeOperation = 'source-over';
    c.drawImage(View.lcv, 0, 0);
    if (d.a > 0.2) {
      c.globalCompositeOperation = 'lighter';
      for (const L of lights) {
        const x = L.x - cx, y = L.y - cy;
        if (x < -L.r || y < -L.r || x > vw + L.r || y > vh + L.r) continue;
        const gr = c.createRadialGradient(x, y, 0, x, y, L.r * 0.6);
        gr.addColorStop(0, rgba(L.c, 0.22 * d.a)); gr.addColorStop(1, rgba(L.c, 0));
        c.fillStyle = gr; c.fillRect(x - L.r, y - L.r, L.r * 2, L.r * 2);
      }
      c.globalCompositeOperation = 'source-over';
    }
  }
  if (d.tint) { c.fillStyle = d.tint; c.fillRect(0, 0, vw, vh); }
  if (m.postOverlay) m.postOverlay(c, cx, cy, G.t);
}
function renderScreen() {
  const c = View.ctx, vw = View.w, vh = View.h;
  const st = G.S ? G.S.st : null;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#05070b'; c.fillRect(0, 0, vw, vh);
  if (!G.map) return;
  const prom = st ? st.prom : 0;
  let ox = 0, oy = 0, rot = 0;
  if (prom > 0.8) { const amp = Math.min(3.5, (prom - 0.8) * 2.2); ox = Math.sin(G.t * 1.3) * amp; oy = Math.sin(G.t * 0.9 + 1) * amp * 0.5; rot = Math.sin(G.t * 0.7) * Math.min(0.025, (prom - 0.8) * 0.012); }
  if (G.fx.shake > 0) { ox += rnd(-1, 1) * G.fx.shake * 4; oy += rnd(-1, 1) * G.fx.shake * 4; }
  c.save();
  c.translate(vw / 2 + ox, vh / 2 + oy); c.rotate(rot); c.translate(-vw / 2, -vh / 2);
  c.drawImage(View.wcv, 0, 0);
  if (prom > 1.6) { c.globalAlpha = Math.min(0.42, (prom - 1.6) * 0.5); const d = 3 + Math.sin(G.t * 1.7) * 2; c.drawImage(View.wcv, d, Math.sin(G.t) * 1.5); c.globalAlpha = 1; }
  c.restore();
  if (st) {
    if (st.energy < 25) { const a = (25 - st.energy) / 25 * 0.75 * (0.85 + 0.15 * Math.sin(G.t * 1.5)); vignette(c, vw, vh, a, '5,6,12'); }
    if (st.nau > 70) { c.fillStyle = `rgba(110,160,40,${Math.min(0.2, (st.nau - 70) / 150)})`; c.fillRect(0, 0, vw, vh); }
    if (prom > 1.2) vignette(c, vw, vh, Math.min(0.35, (prom - 1.2) * 0.3), '40,10,30');
  }
  if (G.fx.flash > 0) { c.fillStyle = `rgba(255,255,255,${G.fx.flash})`; c.fillRect(0, 0, vw, vh); }
}
function vignette(c, w, h, a, rgb) {
  const g = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.7);
  g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(1, `rgba(${rgb},${a})`);
  c.fillStyle = g; c.fillRect(0, 0, w, h);
}

/* ============ Aktualisieren ============ */
function facingPoint(dist = 12) { const p = G.player, d = DIRV[p.dir]; return { x: p.x + d[0] * dist, y: p.y - 4 + d[1] * dist }; }
function findInteraction() {
  const p = G.player, m = G.map;
  const fp = facingPoint(12);
  let best = null, bd = 18;
  for (const n of G.npcs) {
    if (n.hidden || !n.talk) continue;
    const d = Math.hypot(n.x - fp.x, n.y - 4 - fp.y);
    if (d < bd) { bd = d; best = { npc: n, label: n.label || 'Reden: ' + n.name }; }
  }
  if (best) return best;
  const ftx = Math.floor(fp.x / TS), fty = Math.floor(fp.y / TS);
  const ptx = Math.floor(p.x / TS), pty = Math.floor((p.y - 2) / TS);
  for (const t of m.trigs) {
    if (t.auto || (t.cond && !t.cond())) continue;
    const inF = ftx >= t.x && ftx < t.x + t.w && fty >= t.y && fty < t.y + t.h;
    const inP = t.here && ptx >= t.x && ptx < t.x + t.w && pty >= t.y && pty < t.y + t.h;
    if (inF || inP) return { trig: t, label: typeof t.label === 'function' ? t.label() : t.label };
  }
  return null;
}
async function doInteract() {
  if (G.busy) return;
  const it = findInteraction();
  if (!it) return;
  G.player.moving = false;
  G.busy++;
  try {
    if (it.npc) {
      const n = it.npc;
      const prevDir = n.dir;
      if (n.facePlayer !== false && n.pose !== 'sit') n.dir = dirTo(n.x, n.y, G.player.x, G.player.y);
      await n.talk(n);
      if (n.keepDir) n.dir = prevDir;
    } else if (it.trig.act) await it.trig.act(it.trig);
  } catch (e) { console.error(e); }
  G.busy--;
  UI.hud();
}
function checkAutoTriggers() {
  const p = G.player, m = G.map;
  const tx = Math.floor(p.x / TS), ty = Math.floor((p.y - 3) / TS);
  const key = tx + ',' + ty;
  if (key === G.lastTile) return;
  G.lastTile = key;
  for (const t of m.trigs) {
    if (!t.auto) continue;
    if (tx >= t.x && tx < t.x + t.w && ty >= t.y && ty < t.y + t.h) {
      if (t.cond && !t.cond()) continue;
      runAuto(t);
      return;
    }
  }
}
async function runAuto(t) {
  G.busy++;
  try {
    if (t.guard) { const ok = await t.guard(t); if (!ok) { G.busy--; pushBack(); return; } }
    if (t.warp) { G.busy--; await warpTo(t.warp[0], typeof t.warp[1] === 'function' ? t.warp[1]() : t.warp[1], t.opts || {}); return; }
    if (t.act) await t.act(t);
  } catch (e) { console.error(e); }
  G.busy--;
}
function pushBack() { const p = G.player, d = DIRV[p.dir]; for (let i = 0; i < 10; i++) moveActor(p, -d[0], -d[1]); G.lastTile = null; }

function updatePlayer(dt) {
  const p = G.player, st = G.S.st;
  if (p.lock) { p.moving = false; return; }
  const ax = Input.axis();
  let vx = ax.x, vy = ax.y;
  const prom = st.prom;
  if (prom > 1.1 && (vx || vy)) {
    const w = Math.min(0.75, (prom - 1.1) * 0.55);
    vx += Math.sin(G.t * 2.3) * w; vy += Math.cos(G.t * 1.7) * w * 0.7;
  }
  if (prom > 1.8 && Math.random() < dt * 0.35) { const a = rnd(0, 6.28); p.stumble = { x: Math.cos(a) * 30, y: Math.sin(a) * 20, t: 0.25 }; if (Math.random() < 0.5) Snd.sfx('hicks'); }
  const tired = st.energy < 12 ? 0.7 : 1;
  const run = ax.run && st.energy > 8;
  p.running = run && (vx || vy);
  const sp = (run ? 82 : 50) * tired * (prom > 1.8 ? 0.85 : 1);
  let dx = vx * sp * dt, dy = vy * sp * dt;
  if (p.stumble) { dx += p.stumble.x * dt; dy += p.stumble.y * dt; p.stumble.t -= dt; if (p.stumble.t <= 0) p.stumble = null; }
  if (Math.abs(ax.x) > 0.2 || Math.abs(ax.y) > 0.2) {
    p.dir = Math.abs(ax.x) > Math.abs(ax.y) ? (ax.x < 0 ? 1 : 2) : ax.y < 0 ? 3 : 0;
    if (p.pose === 'sit' || p.pose === 'drink' || p.pose.startsWith('dance') || p.pose === 'bend') p.pose = 'stand';
  }
  const moved = (dx || dy) ? moveActor(p, dx, dy) : false;
  p.moving = moved && (Math.abs(dx) + Math.abs(dy) > 0.01);
  if (p.moving) { p.walkT += dt; if (Math.floor(p.walkT * (run ? 10 : 7)) !== Math.floor((p.walkT - dt) * (run ? 10 : 7)) && Math.floor(p.walkT * 7) % 2 === 0) Snd.sfx('step'); }
}
function updateNpc(a, dt) {
  if (a.bubbleT > 0) a.bubbleT -= dt;
  if (a.path && a.path.length) {
    const tgt = a.path[0];
    const dx = tgt.x - a.x, dy = tgt.y - a.y, d = Math.hypot(dx, dy);
    if (d < 1.5) { a.x = tgt.x; a.y = tgt.y; a.path.shift(); if (!a.path.length) { a.moving = false; if (a.onArrive) { const f = a.onArrive; a.onArrive = null; f(a); } } return; }
    const sp = (a.speed || 40) * dt;
    a.x += dx / d * Math.min(sp, d); a.y += dy / d * Math.min(sp, d);
    a.dir = dirTo(0, 0, dx, dy); a.moving = true; a.walkT += dt;
    return;
  }
  if (a.danceIdle) { a.pose = Math.floor(G.t * 2.07 + a.x * 0.1) % 2 ? 'danceA' : 'danceB'; return; }
  if (a.drinkIdle) { if (!a.dt) a.dt = rnd(4, 9); a.dt -= dt; if (a.dt < 0) { a.pose = a.pose === 'drink' ? (a.sitIdle ? 'sit' : 'stand') : 'drink'; a.dt = a.pose === 'drink' ? 1.2 : rnd(4, 10); } }
  if (a.wander && !G.busy) {
    a.wt = (a.wt || rnd(1, 4)) - dt;
    if (a.wt < 0) {
      a.wt = rnd(2, 6);
      const w = a.wander, tx = rint(w.x, w.x + w.w - 1), ty = rint(w.y, w.y + w.h - 1);
      if (!G.map.isSolid(tx, ty)) a.path = [{ x: tx * TS + 8, y: ty * TS + 12 }];
    }
  }
  if (a.bubbleRand && Math.random() < dt * 0.05) { a.bubble = pick(a.bubbleRand); a.bubbleT = 2.5; }
}
let _saveT = 0;
function updateWorld(dt) {
  G.t += dt;
  if (G.fx.flash > 0) G.fx.flash = Math.max(0, G.fx.flash - dt * 3);
  if (G.fx.shake > 0) G.fx.shake = Math.max(0, G.fx.shake - dt * 2);
  updateParts(dt);
  if (G.live && G.live.update && (G.live.runWhileBusy || !G.busy)) G.live.update(dt);
  updateBirds(dt);
  for (const a of G.peds) updatePed(a, dt);
  for (const a of G.npcs) updateNpc(a, dt);
  for (const v of G.map.vehicles) if (v.update) v.update(dt);
  if (G.map.update) G.map.update(dt);
  if (!G.busy) {
    updatePlayer(dt);
    checkAutoTriggers();
    const scale = G.map.timeScale || 1;
    const before = Math.floor(G.S.time);
    G.S.time += dt * scale;
    const dm = Math.floor(G.S.time) - before;
    if (dm > 0) { tickStats(dm); Story.minute(); }
    _saveT += dt; if (_saveT > 60) { _saveT = 0; saveGame(true); }
  } else { G.player.moving = false; }
  updateCamera(false);
  UI.updatePrompt();
}
/* Zeit überspringen (Schlafen, Fahren, Sitzen) */
function passTime(min, opts = {}) {
  const steps = Math.ceil(min / 5);
  for (let i = 0; i < steps; i++) {
    const d = Math.min(5, min - i * 5);
    G.S.time += d;
    if (opts.sleep) { const st = G.S.st; st.energy = clamp(st.energy + d * (opts.rate || 0.22), 0, 100); st.prom = Math.max(0, st.prom - 0.2 / 60 * d); st.nau = Math.max(0, st.nau - 0.5 * d); st.food = Math.max(0, st.food - 2 / 60 * d); }
    else tickStatsQuiet(d);
  }
  UI.hud();
}
function tickStatsQuiet(d) { const w = G.warned; const keep = Object.assign({}, w); tickStats(d); Object.assign(G.warned, keep); }
