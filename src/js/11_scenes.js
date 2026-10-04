/* ============ Szenen: kurze animierte Pixel-Bilder für Aktivitäten ============
   Scene.play(kind, { text, ms, keep, ... }) zeigt im Überblend-Overlay ein 160×96-Bild, das
   für `ms` Millisekunden animiert wird. Mit keep: true bleibt das Overlay danach stehen
   (z. B. für einen Kartenwechsel) und der Aufrufer beendet es mit UI.fadeIn(). */
const SCENE_W = 160, SCENE_H = 96;
const POSE_I = { stand: 0, walkA: 1, walkB: 2, sit: 3, drink: 4, danceA: 5, danceB: 6, bend: 7 };
function sceneSprite(c, st, pose, dir, x, y, s = 1, alpha = 1) {
  c.globalAlpha = alpha;
  c.drawImage(st.sheet, POSE_I[pose] * SPR_W, dir * SPR_H, SPR_W, SPR_H, Math.round(x), Math.round(y), SPR_W * s, SPR_H * s);
  c.globalAlpha = 1;
}
/* Figur beim Durchqueren einer Tür nur innerhalb der Türöffnung zeichnen – nichts ragt über den Rahmen */
function inRect(c, x, y, w, h, fn) { c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); fn(); c.restore(); }
function sceneHead(c, st, x, y, s = 1, dir = 0) { c.drawImage(st.sheet, 0, dir * SPR_H, SPR_W, 12, Math.round(x), Math.round(y), SPR_W * s, 12 * s); }
function sceneSky(c, night, p = 0, dawn = false) {
  const top = night ? (dawn ? mix('#121a3a', '#f2a65a', p) : '#121a3a') : '#8fc3e8', bot = night ? (dawn ? mix('#2a3660', '#ffd9a0', p) : '#2a3660') : '#d8ecf8';
  for (let y = 0; y < 60; y++) R(c, 0, y, SCENE_W, 1, mix(top, bot, y / 60));
  if (night && !(dawn && p > 0.6)) { for (let i = 0; i < 18; i++) P(c, Math.floor(hash(i, 3) * SCENE_W), Math.floor(hash(i, 7) * 40), hash(i, 9) > 0.5 ? '#ffffff' : '#c8d0ff'); E(c, 132, 14, 7, 7, '#f4f0d8'); E(c, 136, 12, 6, 6, top); }
}
function sceneMountains(c, y0, col, snow, off = 0) {
  for (let x = 0; x < SCENE_W; x++) {
    const xx = x + off;
    const h = 14 + Math.abs(Math.sin(xx * 0.05) * 16 + Math.sin(xx * 0.13 + 1) * 6 + Math.sin(xx * 0.31) * 2);
    R(c, x, y0 - h, 1, h + 40, col);
    if (snow) R(c, x, y0 - h, 1, Math.max(1, Math.round(h * 0.28)), '#f4f6fa');
  }
}
/* Fassaden der Orte für die Türszenen */
const FACADES = {
  hotel_lobby: { name: 'HOTEL ZIRBE', wall: '#e8dcc4', door: 'glass', sign: ['#2a4a3a', '#f4e8c0'], inner: '#ffe6a8', stars: 4, flags: true, plants: true },
  stueberl: { name: 'TIROLER STÜBERL', wall: '#d8c09a', door: 'wood', doorCol: '#5a3a24', sign: ['#5a3a24', '#f8e8c8'], inner: '#ffb860', lantern: true, flowers: true },
  bar: { name: 'GAMSBOCK BAR', wall: '#c9a27a', door: 'wood', doorCol: '#3a2418', sign: ['#2a1a10', '#ffb53d'], inner: '#ffc870', neonBeer: true, antlers: true },
  casino: { name: 'CASINO', wall: '#2a2a34', door: 'glass', sign: ['#1a1a22', '#ffd23d'], inner: '#ffe08a', bulbs: true, carpet: '#8a1a2a', trim: '#c9a227' },
  club: { name: 'CLUB LAWINE', arch: true, door: 'metal', sign: ['#101028', '#7ad0ff'], inner: 'strobe', rope: true, bass: true, bouncer: true },
  rouge: { name: 'ROUGE', arch: true, door: 'curtain', sign: ['#1a0a10', '#ff5aa0'], inner: '#ff4a7a', redlight: true, rope: true },
  luzern_halle: { name: 'BAHNHOF LUZERN', wall: '#d8d4cc', door: 'glass', sign: ['#1a3a7a', '#ffffff'], inner: '#eef4fa', station: true },
};
function facadeFor(id) {
  if (id && id.startsWith('shop_')) {
    const sid = id.slice(5), sg = (typeof SHOP_SIGNS !== 'undefined' && SHOP_SIGNS[sid]) || {};
    return { name: sg.text || (SHOPS[sid] && SHOPS[sid].title.toUpperCase()) || 'LADEN', wall: sg.wall || '#e8d8c0', door: 'glass', sign: [sg.bg || '#2a3a4a', sg.fg || '#ffffff'], inner: '#fff4d0', shop: true, goods: sg.goods || ['#c8352d', '#2f5fb8', '#e8c23a'], awning: sg.awning, bell: true, pole: sid === 'barbier', cross: sid === 'apotheke' };
  }
  return FACADES[id] || { name: '', wall: '#c8b89a', door: 'wood', sign: ['#3a2a20', '#f4e8c0'], inner: '#f6d890' };
}
/* Welcher Übergang passt? Treppe, Lift, Zimmertür, Zug, Rauswurf, Sperrstunde – sonst die Fassade des Lokals/Ladens */
function transitionFor(from, to, spawn, opts = {}) {
  const venue = (getMap(to).indoor && to !== 'zug') ? to : from;
  if (opts.kind === 'thrown') return { kind: 'thrown', style: facadeFor(from), ms: 1500 };
  if (opts.kind === 'closing') return { kind: 'door', exit: true, closing: true, style: facadeFor(from), ms: 1400 };
  const hotel = ['hotel_lobby', 'hotel_floor'];
  if (hotel.includes(from) && hotel.includes(to)) return spawn === 'lift' ? { kind: 'hotellift', up: to === 'hotel_floor', ms: 1900 } : { kind: 'stairs', up: to === 'hotel_floor', ms: 1300 };
  if (from === 'hotel_floor' && to === 'hotel_room') return { kind: 'roomdoor', exit: false, ms: 1150 };
  if (from === 'hotel_room' && to === 'hotel_floor') return { kind: 'roomdoor', exit: true, ms: 1000 };
  if (from === 'zug') return { kind: 'trainexit', ms: 1600 };
  if ((from === 'luzern' && to === 'luzern_halle') || (from === 'luzern_halle' && to === 'luzern')) return { kind: 'door', exit: to === 'luzern', style: facadeFor('luzern_halle'), ms: 950 };
  const exit = !(getMap(to).indoor);
  return { kind: 'door', exit, style: facadeFor(exit ? from : venue), ms: 950 };
}
/* Fassade zeichnen: Wand (Putz oder Viaduktbogen), Fenster/Schaufenster, Schild, Tür nach Typ, Extras je Ort */
function drawFacade(c, t, st, open, lightsOff) {
  const S = st.style || facadeFor(''), night = st.night;
  const dx = 62, dy = 30, dw = 36, dh = 56;
  const W = SCENE_W, H = SCENE_H;
  const inner = S.inner === 'strobe' ? ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7aff6a'][Math.floor(t * 6) % 4] : S.inner || '#f6d890';
  if (S.arch) {
    R(c, 0, 0, W, H, night ? '#3a302a' : '#8a7a6a');
    for (let y = 0; y < 88; y += 6) for (let x = -6; x < W; x += 12) R(c, x + ((y / 6) % 2 ? 6 : 0), y, 11, 5, night ? ((x + y) % 5 ? '#4a3e36' : '#52463c') : ((x + y) % 5 ? '#9a8a78' : '#928270'));
    c.fillStyle = '#14100e'; c.beginPath(); c.moveTo(42, 88); c.lineTo(42, 40); c.quadraticCurveTo(80, -6, 118, 40); c.lineTo(118, 88); c.closePath(); c.fill();
    for (let k = 0; k <= 12; k++) { const a = Math.PI + k / 12 * Math.PI, rx = 40, ry = 46; R(c, 80 + Math.cos(a) * rx - 3, 42 + Math.sin(a) * ry - 3, 6, 6, night ? '#5a4c42' : '#a89a88'); }
  } else {
    const wall = S.wall || '#c8b89a';
    R(c, 0, 0, W, H, night ? shade(wall, -0.55) : wall);
    for (let i = 0; i < 70; i++) P(c, (i * 37) % W, (i * 23) % 86, night ? shade(wall, -0.62) : shade(wall, -0.06));
    if (S.station) { for (let x = 4; x < W; x += 22) { if (x > 46 && x < 114) continue; R(c, x, 14, 18, 68, '#5a646c'); R(c, x + 2, 16, 14, 64, night ? '#ffe8b0' : '#b8d4e8'); R(c, x + 2, 40, 14, 1, '#5a646c'); } E(c, 80, 8, 7, 7, '#f4f4f0'); E(c, 80, 8, 7, 7, 'rgba(0,0,0,0)'); const hm = hourOf(G.S.time) % 12, mm = G.S.time % 60; line(c, 80, 8, 80 + Math.sin(hm / 12 * 6.283) * 4, 8 - Math.cos(hm / 12 * 6.283) * 4, '#1a1a1e'); line(c, 80, 8, 80 + Math.sin(mm / 60 * 6.283) * 6, 8 - Math.cos(mm / 60 * 6.283) * 6, '#1a1a1e'); }
    else if (S.shop) { for (const sx of [6, 106]) { R(c, sx, 34, 48, 40, '#3a3c40'); R(c, sx + 2, 36, 44, 36, lightsOff ? '#2a3040' : night ? '#ffe8b0' : '#cfe4f0'); for (let row = 0; row < 3; row++) { R(c, sx + 2, 46 + row * 10, 44, 1, '#8a6a4a'); for (let k = 0; k < 6; k++) R(c, sx + 4 + k * 7, 40 + row * 10, 5, 5, S.goods[(k + row) % S.goods.length]); } } if (S.awning) for (let k = 0; k < W; k += 8) { R(c, k, 24, 8, 8, (k / 8) % 2 ? S.awning : '#f4f0e6'); } if (S.pole) { R(c, 56, 32, 4, 30, '#e8e8e8'); for (let k = 0; k < 6; k++) R(c, 56, 32 + ((k * 6 + t * 18) % 30), 4, 3, k % 2 ? '#c8302a' : '#2f5fb8'); } if (S.cross) { R(c, 104, 14, 14, 4, '#2f9a4a'); R(c, 109, 9, 4, 14, '#2f9a4a'); } }
    else for (const wx of [14, 126]) { R(c, wx, 26, 20, 26, '#3a4a5a'); R(c, wx + 2, 28, 16, 22, lightsOff ? '#1a2030' : night ? '#ffd27a' : '#9fd0f0'); R(c, wx + 9, 28, 2, 22, '#3a4a5a'); R(c, wx + 2, 38, 16, 1, '#3a4a5a'); R(c, wx - 2, 52, 24, 3, '#8a3b2a'); if (S.flowers || !S.casino) for (let k = 0; k < 5; k++) { P(c, wx + 1 + k * 5, 50, k % 2 ? '#e8402e' : '#f2c23a'); P(c, wx + 2 + k * 5, 49, '#3f8e4b'); } }
  }
  R(c, 0, 86, W, 10, night ? '#2a2a30' : '#8a8a90'); R(c, 0, 86, W, 1, night ? '#44444c' : '#b0b0b8');
  if (S.carpet) { c.fillStyle = S.carpet; c.beginPath(); c.moveTo(dx, 86); c.lineTo(dx + dw, 86); c.lineTo(dx + dw + 16, H); c.lineTo(dx - 16, H); c.closePath(); c.fill(); for (const px of [dx - 12, dx + dw + 10]) { R(c, px, 78, 2, 12, S.trim); E(c, px + 1, 77, 2, 2, S.trim); } line(c, dx - 11, 80, dx - 2, 84, '#c8302a'); line(c, dx + dw + 2, 84, dx + dw + 11, 80, '#c8302a'); }
  if (S.trim && !S.arch) { R(c, dx - 10, dy - 8, 6, dh + 8, S.trim); R(c, dx + dw + 4, dy - 8, 6, dh + 8, S.trim); }
  /* Türöffnung mit Licht von innen */
  R(c, dx - 4, dy - 4, dw + 8, dh + 4, S.arch ? '#2a2420' : S.door === 'glass' ? '#5a5e64' : '#5a3a24');
  R(c, dx, dy, dw, dh, lightsOff ? '#1a1418' : inner);
  if (!lightsOff) R(c, dx + 4, dy + 8, dw - 8, dh - 14, mix(inner, '#ffffff', 0.25));
  /* Türflügel */
  const type = S.door || 'wood';
  if (type === 'glass') { const half = dw / 2, sl = Math.round(half * open * 0.95); for (const [x0, w] of [[dx, half - sl], [dx + half + sl, half - sl]]) if (w > 0) { R(c, x0, dy, w, dh, '#7a8088'); R(c, x0 + 1, dy + 1, Math.max(0, w - 2), dh - 2, 'rgba(190,225,245,0.55)'); if (w > 4) R(c, x0 + (x0 === dx ? w - 3 : 1), dy + 22, 2, 14, '#c9ccd2'); } }
  else if (type === 'curtain') { const half = dw / 2, w = Math.round(half * (1 - open * 0.85)); for (const [x0, ww, side] of [[dx, w, 0], [dx + dw - w, w, 1]]) { R(c, x0, dy, ww, dh, '#8a1030'); for (let k = 2; k < ww; k += 4) R(c, x0 + k, dy, 1, dh, '#a8204a'); if (open > 0.3) E(c, side ? x0 + 2 : x0 + ww - 2, dy + 30, 2, 3, '#c9a227'); } }
  else { const pw = Math.round(dw * (1 - open * 0.92)); const col = type === 'metal' ? '#1e1e24' : (S.doorCol || '#7a4a28'); if (pw > 0) { R(c, dx, dy, pw, dh, col); if (type === 'metal') { for (let k = 4; k < dh; k += 8) { P(c, dx + 2, dy + k, '#5a5e64'); if (pw > 4) P(c, dx + pw - 3, dy + k, '#5a5e64'); } if (pw > 14) { E(c, dx + pw / 2, dy + 16, 5, 5, '#3a3c40'); E(c, dx + pw / 2, dy + 16, 4, 4, inner); } } else if (pw > 6) { R(c, dx + 3, dy + 5, Math.max(0, pw - 6), 20, shade(col, 0.12)); R(c, dx + 3, dy + 31, Math.max(0, pw - 6), 20, shade(col, 0.12)); } if (pw > 10) R(c, dx + pw - 6, dy + 30, 2, 3, '#e8c84a'); R(c, dx + pw - 1, dy, 1, dh, shade(col, -0.3)); } }
  if (open > 0 && !lightsOff) { c.fillStyle = `rgba(${S.inner === 'strobe' ? '180,120,255' : S.redlight ? '255,80,120' : '255,220,140'},${0.28 * open})`; c.beginPath(); c.moveTo(dx, dy + dh); c.lineTo(dx + dw, dy + dh); c.lineTo(dx + dw + 24, H); c.lineTo(dx - 24, H); c.closePath(); c.fill(); }
  /* Schild */
  let name = S.name || ''; while (name.length > 3 && pxTextW(name) > 130) name = name.slice(0, -1);
  if (name) { const w = pxTextW(name) + 8, sy = S.arch ? 22 : dy - 16; R(c, 80 - w / 2, sy, w, 11, S.sign[0]); R(c, 80 - w / 2, sy, w, 1, shade(S.sign[0], 0.3)); const glow = (night || S.arch) && !lightsOff; if (glow) E(c, 80, sy + 5, w / 2 + 6, 9, `rgba(${S.redlight ? '255,90,160' : S.bass ? '120,200,255' : '255,200,120'},${0.12 + Math.sin(t * 5) * 0.04})`); pxText(c, name, 80 - pxTextW(name) / 2, sy + 3, lightsOff ? shade(S.sign[1], -0.6) : S.sign[1]); }
  /* Extras */
  if (S.stars) for (let k = 0; k < S.stars; k++) { const sx = 80 - (S.stars - 1) * 5 + k * 10, sy = dy - 24; P(c, sx, sy - 1, '#ffd23d'); R(c, sx - 1, sy, 3, 1, '#ffd23d'); P(c, sx, sy + 1, '#ffd23d'); }
  if (S.flags) for (const fx of [36, 124]) { R(c, fx, 4, 1, 26, '#5a5e64'); const wv = Math.sin(t * 6 + fx) * 1.5; R(c, fx + 1, 5 + wv * 0.3, 12, 2, '#c8352d'); R(c, fx + 1, 7 + wv * 0.3, 12, 2, '#f4f0e6'); R(c, fx + 1, 9 + wv * 0.3, 12, 2, '#c8352d'); }
  if (S.plants) for (const px of [dx - 14, dx + dw + 6]) { R(c, px, 78, 8, 8, '#8a5a32'); for (let k = 0; k < 5; k++) R(c, px + 4 - k, 76 - k * 4, k * 2 + 1, 4, '#2f5a30'); }
  if (S.lantern) { line(c, dx + dw + 6, dy - 6, dx + dw + 14, dy - 6, '#2a2a2e'); R(c, dx + dw + 11, dy - 5, 6, 9, '#2a2a2e'); R(c, dx + dw + 12, dy - 4, 4, 7, lightsOff ? '#3a3a3e' : '#ffd27a'); if (!lightsOff) E(c, dx + dw + 14, dy, 10, 10, `rgba(255,200,120,${0.18 + Math.sin(t * 9) * 0.04})`); }
  if (S.antlers) { const ax = 80; R(c, ax - 3, dy - 30, 6, 4, '#e8dcc0'); line(c, ax - 2, dy - 30, ax - 9, dy - 38, '#d8c8a0'); line(c, ax + 2, dy - 30, ax + 9, dy - 38, '#d8c8a0'); line(c, ax - 6, dy - 34, ax - 10, dy - 33, '#d8c8a0'); line(c, ax + 6, dy - 34, ax + 10, dy - 33, '#d8c8a0'); }
  if (S.neonBeer && !lightsOff) { const on = Math.floor(t * 7) % 9 !== 0; const col = on ? '#ffb53d' : '#5a3a10'; R(c, 22, 60, 10, 12, col); R(c, 22, 58, 10, 2, on ? '#fff4d0' : '#5a5040'); R(c, 32, 62, 3, 6, col); if (on) E(c, 27, 66, 12, 10, 'rgba(255,180,60,0.15)'); }
  if (S.bulbs) { const n = 18; for (let k = 0; k < n; k++) { const on = (k + Math.floor(t * 8)) % 3 !== 0 && !lightsOff; const bx = 30 + k * 6; E(c, bx, dy - 22, 1.5, 1.5, on ? '#fff4b0' : '#5a5040'); E(c, bx, dy - 4, 1.5, 1.5, on ? '#fff4b0' : '#5a5040'); } }
  if (S.bass && !lightsOff) { c.fillStyle = `rgba(140,80,255,${0.08 + Math.abs(Math.sin(t * 8)) * 0.1})`; c.fillRect(0, 0, W, H); }
  if (S.redlight && !lightsOff) { R(c, 79, 0, 2, 6, '#2a2a2e'); E(c, 80, 9, 4, 4, '#ff3a5a'); c.fillStyle = `rgba(255,40,90,${0.08 + Math.sin(t * 2) * 0.04})`; c.fillRect(0, 0, W, H); }
  if (S.rope) { for (const px of [24, 46]) { R(c, px, 74, 2, 14, '#c9a227'); E(c, px + 1, 73, 2, 2, '#c9a227'); } c.strokeStyle = '#a8203a'; c.lineWidth = 2; c.beginPath(); c.moveTo(26, 76); c.quadraticCurveTo(36, 82, 46, 76); c.stroke(); }
  if (S.bouncer) { R(c, 124, 50, 16, 36, '#121216'); E(c, 132, 46, 5, 6, '#c99a6c'); R(c, 127, 44, 10, 2, '#121216'); R(c, 128, 46, 8, 1, '#151519'); R(c, 120, 58, 4, 16, '#121216'); R(c, 140, 58, 4, 16, '#121216'); }
  if (S.station && !lightsOff) { for (let k = 0; k < 3; k++) { const px = ((t * 18 + k * 50) % 180) - 10; R(c, px, 70, 4, 16, ['#2a3a5a', '#7a2a2a', '#3a3c40'][k]); E(c, px + 2, 68, 2, 2, '#e8c8a0'); } }
  return { dx, dy, dw, dh };
}
const SCENES = {
  /* Brunnenbad im Leopoldsbrunnen */
  bath(c, t, p, st) {
    sceneSky(c, st.night);
    for (let i = 0; i < 9; i++) { const w = 14 + Math.floor(hash(i, 1) * 10), h = 22 + Math.floor(hash(i, 2) * 14), x = i * 18; R(c, x, 56 - h, w, h, mix('#c9b08a', '#8a7a66', hash(i, 4))); for (let wy = 60 - h; wy < 52; wy += 6) for (let wx = x + 2; wx < x + w - 2; wx += 5) R(c, wx, wy, 2, 3, st.night ? '#ffd27a' : '#5a6a7a'); }
    R(c, 0, 56, SCENE_W, 40, '#b8b0a0'); for (let i = 0; i < 60; i++) P(c, Math.floor(hash(i, 5) * SCENE_W), 56 + Math.floor(hash(i, 6) * 40), '#a8a090');
    /* Sockel und Reiterstatue */
    R(c, 70, 30, 20, 30, '#7a7e86'); R(c, 66, 58, 28, 4, '#6a6e76');
    R(c, 72, 20, 16, 9, '#6a7a4a'); R(c, 86, 16, 6, 7, '#6a7a4a'); R(c, 74, 29, 3, 6, '#6a7a4a'); R(c, 84, 29, 3, 6, '#6a7a4a'); R(c, 78, 10, 5, 11, '#7a8a5a'); E(c, 80, 8, 3, 3, '#7a8a5a');
    /* Becken */
    E(c, 80, 78, 56, 14, '#5a5e66'); E(c, 80, 77, 52, 11, '#3a78b0');
    for (let k = 0; k < 6; k++) { const ph = (t * 0.7 + k * 0.37) % 1; E(c, 80, 77, 8 + ph * 44, 2 + ph * 9, `rgba(200,230,255,${0.5 * (1 - ph)})`); }
    /* Wasserstrahlen von der Statue */
    for (let s = -1; s <= 1; s += 2) for (let k = 0; k < 10; k++) { const u = ((t * 1.6 + k * 0.1) % 1); const x = 80 + s * (6 + u * 26), y = 36 - Math.sin(u * Math.PI) * 14 + u * 36; P(c, Math.round(x), Math.round(y), '#dff2ff'); }
    /* Spieler im Wasser, auf und ab */
    const bob = Math.sin(t * 4) * 2;
    sceneSprite(c, st, p < 0.15 ? 'stand' : 'danceA', 0, 46, 54 + bob + (p < 0.15 ? -(0.15 - p) * 120 : 0));
    E(c, 80, 79, 50, 9, 'rgba(58,120,176,0.85)');
    for (let i = 0; i < 24; i++) { const u = ((t * 1.2 + hash(i, 8)) % 1); const x = 55 + hash(i, 9) * 22, y = 72 - u * 22 * hash(i, 10); if (u < 0.8) R(c, Math.round(x + Math.sin(u * 9 + i) * 4), Math.round(y), 2, 2, `rgba(220,240,255,${1 - u})`); }
    if (p > 0.15 && Math.floor(t * 3) % 2 === 0) pxText(c, 'PLATSCH!', 96, 40, '#ffffff');
    if (st.cop && p > 0.6) sceneSprite(c, st, 'stand', 1, 130 - (p - 0.6) * 60, 60, 1);
  },
  /* Fiaker-Rundfahrt durch die Altstadt */
  fiaker(c, t, p, st) {
    sceneSky(c, st.night);
    sceneMountains(c, 34, '#7a8aa0', true, t * 4);
    const off = t * 34;
    for (let i = -1; i < 12; i++) {
      const bx = Math.round(i * 24 - (off % 24)), k = Math.floor((i + Math.floor(off / 24)) % 9 + 9) % 9;
      const h = 26 + Math.floor(hash(k, 1) * 16), col = ['#e8d2a8', '#d8b890', '#c8c0b0', '#e0c8c0', '#d0d8c8'][k % 5];
      R(c, bx, 62 - h, 22, h, col); R(c, bx, 62 - h - 4, 22, 4, k % 3 === 0 ? '#c9a227' : '#8a4a3a');
      for (let wy = 66 - h; wy < 58; wy += 7) for (let wx = bx + 3; wx < bx + 20; wx += 6) R(c, wx, wy, 3, 4, st.night ? '#ffd27a' : '#4a5a6a');
      if (k === 4) { R(c, bx + 6, 62 - h - 22, 10, 22, '#d8d0c0'); R(c, bx + 5, 62 - h - 26, 12, 4, '#4a6a4a'); }
    }
    R(c, 0, 62, SCENE_W, 34, '#9a9088'); for (let i = 0; i < 80; i++) P(c, Math.floor((hash(i, 2) * 200 - off * 1.0) % 200 + 200) % 200 - 20, 62 + Math.floor(hash(i, 3) * 34), '#8a8078');
    /* Kutsche */
    const cx = 50, cy = 60;
    R(c, cx, cy - 16, 34, 16, '#2a2420'); R(c, cx + 2, cy - 14, 30, 12, '#3a2e28'); R(c, cx + 20, cy - 20, 14, 4, '#1a1612');
    R(c, cx + 4, cy - 12, 10, 8, '#8ab0c8');
    sceneHead(c, st, cx + 2, cy - 13, 1, 2);
    sceneSprite(c, st, 'sit', 2, cx + 20, cy - 24, 1);
    const ang = t * 7;
    for (const wx of [cx + 6, cx + 28]) { E(c, wx, cy + 2, 6, 6, '#1a1a1e'); E(c, wx, cy + 2, 4, 4, '#4a4a50'); for (let s = 0; s < 4; s++) line(c, wx, cy + 2, wx + Math.cos(ang + s * 1.57) * 5, cy + 2 + Math.sin(ang + s * 1.57) * 5, '#9a9a9a'); }
    /* Pferd */
    const hx = cx + 44, hy = cy - 4;
    R(c, hx, hy - 8, 24, 10, '#6a4428'); R(c, hx + 20, hy - 16, 8, 10, '#6a4428'); R(c, hx + 26, hy - 14, 6, 5, '#6a4428'); R(c, hx + 22, hy - 18, 2, 3, '#4a2e1a');
    R(c, hx - 3, hy - 8, 3, 8, '#3a2214'); for (let k = 0; k < 6; k++) P(c, hx + 20 + k, hy - 17 - (k % 2), '#3a2214');
    for (let l = 0; l < 4; l++) { const ph = Math.sin(t * 8 + l * 1.6) * 3; R(c, hx + 2 + l * 6, hy + 2, 3, 8 + Math.round(ph), '#5a3820'); }
    line(c, cx + 34, cy - 8, hx, hy - 4, '#2a2420');
    const step = Math.floor(t * 4); if (step !== st._step) { st._step = step; Snd.tone(step % 2 ? 220 : 180, 0.04, 'triangle', 0.08); }
    if (Math.floor(t * 2) % 2 === 0) pxText(c, 'KLIPP KLAPP', 6, 6, '#ffffff');
  },
  /* Schlafen im Hotelzimmer */
  sleep(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#241c2c'); R(c, 0, 66, SCENE_W, 30, '#3a2a22');
    /* Fenster mit Himmel */
    R(c, 104, 8, 44, 34, '#5a4a40'); c.save(); c.beginPath(); c.rect(107, 11, 38, 28); c.clip(); c.translate(107, 11); sceneSky(c, true, p, st.long); c.restore();
    R(c, 125, 11, 2, 28, '#5a4a40'); R(c, 107, 24, 38, 2, '#5a4a40');
    /* Wanduhr */
    E(c, 30, 20, 11, 11, '#e8e2d0'); E(c, 30, 20, 10, 10, '#f8f4ea'); for (let k = 0; k < 12; k++) P(c, Math.round(30 + Math.cos(k * 0.524) * 8), Math.round(20 + Math.sin(k * 0.524) * 8), '#8a8070');
    const mh = t * (st.long ? 9 : 3), hh = mh / 12;
    line(c, 30, 20, 30 + Math.cos(mh) * 7, 20 + Math.sin(mh) * 7, '#1a1a1a'); line(c, 30, 20, 30 + Math.cos(hh) * 5, 20 + Math.sin(hh) * 5, '#1a1a1a');
    /* Bett */
    R(c, 20, 46, 110, 8, '#5a3a20'); R(c, 20, 54, 110, 26, '#4a2e18'); R(c, 24, 50, 102, 26, '#f0e8d8');
    R(c, 26, 48, 24, 12, '#ffffff'); R(c, 27, 49, 22, 10, '#f4f2ec');
    const br = Math.sin(t * 1.5) * 1.5;
    R(c, 50, 52 - br, 76, 22 + br, '#7a2f3a'); for (let y = 56; y < 72; y += 5) R(c, 50, y - br, 76, 1, '#8a3f4a');
    sceneHead(c, st, 30, 44, 1, 0);
    /* Zzz */
    for (let k = 0; k < 3; k++) { const u = ((t * 0.5 + k * 0.33) % 1); pxText(c, 'Z', Math.round(44 + u * 20 + Math.sin(u * 6 + k) * 4), Math.round(40 - u * 30), `rgba(140,170,255,${1 - u})`, k === 2 ? 2 : 1); }
    if (st.long && p > 0.7) { R(c, 0, 0, SCENE_W, SCENE_H, `rgba(255,220,160,${(p - 0.7) * 0.5})`); if (Math.floor(t * 2) % 2) pxText(c, 'GUTEN MORGEN', 50, 84, '#ffd27a'); }
  },
  /* Duschen */
  shower(c, t, p, st) {
    for (let y = 0; y < SCENE_H; y += 8) for (let x = 0; x < SCENE_W; x += 8) R(c, x, y, 7, 7, (x + y) % 16 ? '#9fcbe0' : '#b4d8ea');
    R(c, 0, 86, SCENE_W, 10, '#c8ccd0'); E(c, 80, 90, 6, 2, '#4a5058'); for (let k = 0; k < 4; k++) E(c, 80, 90, 3 + k, 1, k % 2 ? '#8ab0c8' : '#4a5058');
    R(c, 60, 4, 40, 4, '#8a9096'); R(c, 96, 0, 4, 10, '#8a9096');
    for (let i = 0; i < 11; i++) { const x = 62 + i * 3.5; for (let k = 0; k < 6; k++) { const y = ((t * 110 + k * 14 + i * 5) % 80) + 8; R(c, Math.round(x + Math.sin(t * 3 + i) * 0.5), Math.round(y), 1, 4, 'rgba(210,235,255,0.9)'); } }
    sceneSprite(c, st, p < 0.5 ? 'stand' : 'danceB', 0, 71, 48, 1, 0.9);
    /* Milchglas-Duschwand vor der Figur */
    R(c, 50, 10, 60, 80, 'rgba(225,240,250,0.55)'); for (let x = 52; x < 110; x += 6) R(c, x, 10, 1, 80, 'rgba(255,255,255,0.35)');
    /* Seifenblasen und Dampf */
    for (let i = 0; i < 10; i++) { const u = ((t * 0.4 + hash(i, 1)) % 1); E(c, Math.round(50 + hash(i, 2) * 60 + Math.sin(u * 7 + i) * 4), Math.round(84 - u * 60), 2 + Math.floor(hash(i, 3) * 2), 2 + Math.floor(hash(i, 3) * 2), `rgba(255,255,255,${0.8 * (1 - u)})`); }
    for (let i = 0; i < 8; i++) { const u = ((t * 0.25 + hash(i, 4)) % 1); E(c, Math.round(40 + hash(i, 5) * 80), Math.round(90 - u * 90), 6 + u * 10, 4 + u * 6, `rgba(240,245,250,${0.25 * (1 - u)})`); }
    /* Duschvorhang halb zugezogen */
    for (let x = 0; x < 50; x += 5) R(c, x, 10, 4, 80, x % 10 ? 'rgba(230,240,250,0.85)' : 'rgba(200,220,240,0.85)');
    for (let x = 110; x < SCENE_W; x += 5) R(c, x, 10, 4, 80, x % 10 ? 'rgba(230,240,250,0.85)' : 'rgba(200,220,240,0.85)');
    R(c, 0, 8, SCENE_W, 2, '#8a9096');
    if (Math.floor(t * 1.5) % 2 === 0) pxText(c, '♪ LA LA LA', 60, 16, '#ffffff');
    if (Math.floor(t * 2.5) !== st._drop) { st._drop = Math.floor(t * 2.5); Snd.noise(0.25, 0.02, 2200, 0, 'highpass'); }
  },
  /* WC */
  toilet(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, st.zug ? '#8a9096' : '#d8d0c0'); R(c, 0, 80, SCENE_W, 16, st.zug ? '#3a3c40' : '#8a7a66');
    const open = p > 0.78;
    R(c, 56, 12, 48, 70, '#4a3a2a');
    if (!open) { R(c, 59, 15, 42, 67, st.zug ? '#c9ccd2' : '#8a6a44'); R(c, 62, 20, 36, 26, st.zug ? '#b8bcc2' : '#7a5a34'); R(c, 62, 50, 36, 26, st.zug ? '#b8bcc2' : '#7a5a34'); R(c, 92, 48, 3, 3, '#e8c84a'); }
    else { R(c, 59, 15, 42, 67, '#f4f4f0'); R(c, 70, 50, 20, 14, '#ffffff'); R(c, 68, 62, 24, 6, '#e8e8e8'); R(c, 72, 40, 16, 10, '#f0f0f0'); R(c, 59, 15, 8, 67, '#8a6a44'); for (let k = 0; k < 5; k++) { const u = ((t * 1.5 + k * 0.2) % 1); E(c, 80, 56, 2 + u * 7, 1 + u * 3, `rgba(100,160,220,${1 - u})`); } }
    R(c, 70, 8, 20, 10, '#ffffff'); pxText(c, 'WC', 74, 10, '#1a3a7a');
    R(c, 62, 23, 36, 8, open ? '#4ad04a' : p > 0.1 ? '#e2554a' : '#ffffff'); pxText(c, open ? 'FREI' : p > 0.1 ? 'BESETZT' : '', open ? 71 : 64, 24, '#ffffff');
    if (!open) { const tap = Math.floor(t * 3) % 2; R(c, 70, 82 - (tap ? 2 : 0), 8, 4, lc(st.look, 'shoesCol')); R(c, 82, 82 - (tap ? 0 : 2), 8, 4, lc(st.look, 'shoesCol')); }
    else sceneSprite(c, st, 'stand', 0, 100, 58, 1);
    for (let k = 0; k < 3; k++) { const u = ((t * 0.6 + k * 0.33) % 1); if (!open) pxText(c, k % 2 ? '♪' : '♫', Math.round(104 + Math.sin(u * 5 + k) * 6), Math.round(40 - u * 30), `rgba(80,40,160,${1 - u})`); }
    if (open && !st._flush) { st._flush = 1; Snd.sfx('splash'); }
    if (st.zug) { const sh = Math.sin(t * 9) * 1.5; R(c, 0, 0, 3, SCENE_H, `rgba(0,0,0,${0.1 + sh * 0.05})`); }
  },
  /* Nordkettenbahn: Bergfahrt (st.down = Talfahrt) */
  cable(c, t, p, st) {
    sceneSky(c, st.night);
    const q = st.down ? 1 - p : p;
    sceneMountains(c, 40, '#6a7f9a', true, 20);
    sceneMountains(c, 62, '#3f6b32', false, 60 + q * 40);
    for (let i = 0; i < 24; i++) { const x = Math.floor(hash(i, 1) * SCENE_W), y = 50 + Math.floor(hash(i, 2) * 46) + Math.round(q * 30) % 50; R(c, x, y - 6, 1, 6, '#2e4a24'); R(c, x - 2, y - 8, 5, 3, '#3e6b32'); R(c, x - 1, y - 10, 3, 2, '#3e6b32'); }
    line(c, 0, 90, SCENE_W, 14, '#2a2a2e'); line(c, 0, 91, SCENE_W, 15, '#5a5a60');
    for (const px of [30, 110]) { R(c, px - 1, 90 - (px * 76 / SCENE_W), 3, 30, '#3a3a40'); }
    const gx = 10 + q * 130, gy = 90 - (gx * 76 / SCENE_W) + Math.sin(t * 3) * 0.6;
    R(c, gx - 1, gy, 2, 6, '#2a2a2e'); R(c, gx - 9, gy + 6, 18, 14, '#c8302a'); R(c, gx - 7, gy + 8, 14, 7, '#8ab0c8'); R(c, gx - 9, gy + 6, 18, 2, '#e8e4dc');
    sceneHead(c, st, gx - 6, gy + 7, 0.7, 0);
    for (let i = 0; i < 3; i++) { const cx2 = (hash(i, 3) * 200 + t * 6) % 200 - 20; E(c, cx2, 16 + i * 8, 10, 3, 'rgba(255,255,255,0.8)'); }
    pxText(c, st.down ? 'TALFAHRT' : `${Math.round(574 + q * 1331)} M`, 6, 6, '#ffffff');
  },
  /* Haustür: Fassade passend zum Ort (st.style aus facadeFor). Hinein: Rückenansicht, Tür geht auf, Licht fällt heraus.
     Hinaus: Figur kommt aus der Tür, die hinter ihr zugeht. st.closing: Sperrstunde, Lichter gehen aus, Schild „Geschlossen“. */
  door(c, t, p, st) {
    const enter = !st.exit;
    const open = enter ? clamp((p - 0.15) / 0.25, 0, 1) : clamp(1 - (p - 0.62) / 0.25, 0, 1);
    const off = st.closing && p > 0.72;
    const g = drawFacade(c, t, st, open, off);
    const f = Math.floor(t * 8) % 2 ? 'walkA' : 'walkB';
    /* Füsse immer auf dem Boden: von vorne (nah, gross) bis zur Schwelle (fern, so klein, dass die Figur in die Öffnung passt).
       Ab der Schwelle wird nur innerhalb der Türöffnung gezeichnet – die Figur verschwindet im Haus statt über den Rahmen zu ragen. */
    const floorY = g.dy + g.dh;
    if (enter) {
      const q = clamp(p / 0.45, 0, 1), q2 = clamp((p - 0.45) / 0.4, 0, 1);
      if (q2 <= 0) { const y = 98 - q * (98 - floorY), sc = 1.9 - q * 0.65; sceneSprite(c, st, q < 1 ? f : 'stand', 3, 80 - SPR_W * sc / 2, y - SPR_H * sc, sc); }
      else inRect(c, g.dx, g.dy, g.dw, g.dh, () => { const y = floorY - q2 * 5, sc = 1.25 - q2 * 0.3; sceneSprite(c, st, f, 3, 80 - SPR_W * sc / 2, y - SPR_H * sc, sc, 1 - q2); });
    } else {
      const q1 = clamp((p - 0.05) / 0.3, 0, 1), q = clamp((p - 0.35) / 0.45, 0, 1);
      if (q <= 0) inRect(c, g.dx, g.dy, g.dw, g.dh, () => { const y = floorY - (1 - q1) * 5, sc = 0.95 + q1 * 0.3; sceneSprite(c, st, f, 0, 80 - SPR_W * sc / 2, y - SPR_H * sc, sc, q1); });
      else { const y = floorY + q * (98 - floorY), sc = 1.25 + q * 0.65; sceneSprite(c, st, q < 1 ? f : 'stand', 0, 80 - SPR_W * sc / 2, y - SPR_H * sc, sc); }
    }
    if (st.closing) { if (p > 0.72) { R(c, 66, g.dy + 14, 28, 9, '#f4f0e6'); R(c, 79, g.dy + 10, 2, 4, '#8a8e94'); pxText(c, 'ZU', 74, g.dy + 16, '#c8352d'); } const w = pxTextW('SPERRSTUNDE'); R(c, 80 - w / 2 - 3, 4, w + 6, 9, 'rgba(0,0,0,0.6)'); pxText(c, 'SPERRSTUNDE', 80 - w / 2, 6, '#ffb53d'); if (!st._lo && p > 0.72) { st._lo = 1; Snd.tone(220, 0.08, 'square', 0.05); } }
    if (!st._snd && open > 0) { st._snd = 1; if (st.style && st.style.bell) Snd.sfx('ding'); else if (st.style && st.style.door === 'glass') Snd.noise(0.25, 0.05, 2500); else Snd.sfx('door'); }
    if (!enter && !st._snd2 && p > 0.82) { st._snd2 = 1; if (st.style && st.style.door === 'glass') Snd.noise(0.2, 0.04, 2500); else Snd.sfx('door'); }
    const stp = Math.floor(t * 8); if (stp !== st._step) { st._step = stp; if ((enter && p < 0.75) || (!enter && p > 0.05 && p < 0.8)) Snd.sfx('step'); }
    if (st.style && st.style.bass && Math.floor(t * 4) !== st._bass) { st._bass = Math.floor(t * 4); Snd.tone(55, 0.1, 'sine', 0.08 * (enter ? open : 1 - p)); }
  },
  /* Rauswurf: Tür fliegt auf, eine Pranke wirft dich auf die Strasse, die Tür knallt zu */
  thrown(c, t, p, st) {
    const open = p < 0.5 ? clamp(p / 0.08, 0, 1) : clamp(1 - (p - 0.5) / 0.06, 0, 1);
    const g = drawFacade(c, t, st, open, false);
    if (p < 0.5) { const bx = 80, by = g.dy + g.dh; R(c, bx - 9, by - 46, 18, 46, '#121216'); E(c, bx, by - 50, 6, 6, '#121216'); const arm = p < 0.2 ? p / 0.2 : 1; R(c, bx - 2, by - 34, 6 + arm * 14, 5, '#121216'); }
    const q = clamp((p - 0.12) / 0.4, 0, 1);
    if (p > 0.12) {
      const x = 80 - q * 40, y = (g.dy + g.dh - 22) + q * 18 - Math.sin(q * Math.PI) * 26;
      c.save(); c.translate(x, y); c.rotate(p < 0.52 ? -q * 5 : -Math.PI / 2); sceneSprite(c, st, 'stand', 0, -SPR_W * 0.8, -SPR_H * 0.8, 1.6); c.restore();
      if (p > 0.52 && !st._land) { st._land = 1; Snd.sfx('hit'); for (let k = 0; k < 8; k++) (st.dust = st.dust || []).push({ x: x + rnd(-10, 10), y: 88, vx: rnd(-20, 20), vy: rnd(-14, -4), t: 0 }); }
      if (p > 0.82) { for (let k = 0; k < 3; k++) { const a = t * 6 + k * 2.1; pxText(c, '*', x - 4 + Math.cos(a) * 8, y - 18 + Math.sin(a) * 3, '#ffd23d'); } }
    }
    for (const d of st.dust || []) { d.t += 0.016; d.x += d.vx * 0.016; d.y += d.vy * 0.016; E(c, d.x, d.y, 3 + d.t * 6, 2 + d.t * 3, `rgba(200,190,170,${Math.max(0, 0.6 - d.t)})`); }
    if (p > 0.1 && p < 0.55) { R(c, 100, 52, pxTextW('RAUS!') + 4, 9, 'rgba(0,0,0,0.6)'); pxText(c, 'RAUS!', 102, 54 - Math.sin(t * 20), '#ff5a4a', 1); }
    if (p > 0.55 && !st._slam) { st._slam = 1; Snd.sfx('door'); Snd.tone(70, 0.2, 'square', 0.1); }
    if (!st._whoosh && p > 0.12) { st._whoosh = 1; Snd.sfx('whoosh'); }
  },
  /* Hotel-Treppenhaus: Stufe um Stufe hinauf in den 3. Stock oder hinunter in die Lobby */
  stairs(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#e8dcc4');
    for (let x = 0; x < SCENE_W; x += 10) R(c, x, 0, 1, SCENE_H, '#ddd0b4');
    R(c, 0, 0, SCENE_W, 6, '#3a2a20'); R(c, 0, 6, SCENE_W, 2, '#6a4428');
    R(c, 12, 14, 18, 14, '#6a4428'); R(c, 14, 16, 14, 10, '#8aa86a'); R(c, 18, 20, 6, 4, '#f4f0e6');
    R(c, 128, 46, 22, 26, '#3a4a5a'); R(c, 130, 48, 18, 22, st.night ? '#1a2a4a' : '#9ac0d8'); R(c, 138, 48, 2, 22, '#3a4a5a'); if (st.night) { P(c, 134, 52, '#ffffff'); P(c, 143, 58, '#ffffff'); }
    const N = 10, x0 = 14, y0 = 92, sw = 11, sh = 7;
    for (let k = 0; k < N; k++) { const x = x0 + k * sw, y = y0 - (k + 1) * sh; R(c, x, y, SCENE_W, sh, '#7a5232'); R(c, x, y, SCENE_W, 2, '#a87a50'); R(c, x, y + 2, sw, sh - 2, '#3f5e4c'); R(c, x, y + 2, sw, 1, '#4f7a62'); }
    line(c, x0, y0 - 18, x0 + N * sw, y0 - (N + 1) * sh - 16, '#5a3a24'); line(c, x0, y0 - 17, x0 + N * sw, y0 - (N + 1) * sh - 15, '#8a5a34');
    for (let k = 0; k <= N; k += 2) { const x = x0 + k * sw; R(c, x, y0 - k * sh - 18 + 1, 1, 18 - 1, '#5a3a24'); }
    const lbl = (txt, x, y) => { R(c, x, y, 18, 10, '#2a4a3a'); pxText(c, txt, x + 9 - pxTextW(txt) / 2, y + 2, '#f4e8c0'); };
    lbl('E', 2, 70); lbl('3', 140, 10);
    const up = st.up !== false, q = up ? p : 1 - p;
    const k = q * N, x = x0 + k * sw - 4, y = y0 - Math.floor(k) * sh - 1 - (k % 1 > 0.5 ? 2 : 0);
    sceneSprite(c, st, Math.floor(t * 8) % 2 ? 'walkA' : 'walkB', up ? 2 : 1, x, y - SPR_H * 1.2, 1.2);
    pxText(c, up ? 'HINAUF' : 'HINUNTER', 56, 2, '#f4e8c0');
    const stp = Math.floor(k); if (stp !== st._step) { st._step = stp; Snd.sfx('step'); }
  },
  /* Hotel-Lift: Türen schliessen, Anzeige zählt die Stockwerke, Ding, Türen auf */
  hotellift(c, t, p, st) {
    const up = st.up !== false;
    const arrived = p > 0.72;
    const lobby = (up && !arrived) || (!up && arrived);
    R(c, 0, 0, SCENE_W, SCENE_H, lobby ? '#e9e4d8' : '#e8dcc4');
    if (lobby) for (let x = 0; x < SCENE_W; x += 16) for (let y = 0; y < SCENE_H; y += 16) if ((x + y) % 32 === 0) R(c, x, y, 16, 16, '#d8d2c4');
    else for (let x = 0; x < SCENE_W; x += 10) R(c, x, 0, 1, SCENE_H, '#ddd0b4');
    R(c, 0, 86, SCENE_W, 10, lobby ? '#4a4e56' : '#3f5e4c');
    const dx = 54, dy = 22, dw = 52, dh = 64;
    R(c, dx - 5, dy - 5, dw + 10, dh + 5, '#8a9096'); R(c, dx - 3, dy - 3, dw + 6, dh + 3, '#b8bec4');
    R(c, dx, dy, dw, dh, '#c8b48a'); R(c, dx + 2, dy + 2, dw - 4, 30, '#a8c0d0'); R(c, dx, dy + 40, dw, 2, '#8a8e94');
    sceneSprite(c, st, 'stand', 0, 80 - SPR_W * 1.4 / 2, dy + dh - SPR_H * 1.4 - 1, 1.4);
    const op = p < 0.12 ? 1 : p < 0.26 ? 1 - (p - 0.12) / 0.14 : p < 0.76 ? 0 : clamp((p - 0.76) / 0.14, 0, 1);
    const half = dw / 2, sl = Math.round(half * op * 0.95);
    for (const [x0, w] of [[dx, half - sl], [dx + half + sl, half - sl]]) if (w > 0) { R(c, x0, dy, w, dh, '#9aa0a8'); R(c, x0, dy, w, 1, '#c9ced4'); for (let k = 4; k < w; k += 6) R(c, x0 + k, dy + 2, 1, dh - 4, '#8a9098'); }
    if (op === 0) R(c, 79, dy, 2, dh, '#6a7078');
    const floors = ['E', '1', '2', '3'];
    const fq = clamp((p - 0.28) / 0.44, 0, 1), fi = Math.round(up ? fq * 3 : 3 - fq * 3);
    R(c, 70, 8, 20, 10, '#1a1a1e'); pxText(c, floors[fi], 74, 10, '#ff5a3a'); pxText(c, op === 0 && p < 0.72 ? (up ? '+' : '-') : ' ', 82, 10, '#ff5a3a');
    R(c, 112, 46, 8, 14, '#8a9096'); E(c, 116, 50, 2, 2, up ? '#ffd23d' : '#5a5e64'); E(c, 116, 56, 2, 2, !up ? '#ffd23d' : '#5a5e64');
    if (p > 0.28 && p < 0.72) { c.translate(0, Math.sin(t * 40) * 0.3); if (Math.floor(t * 3) !== st._hum) { st._hum = Math.floor(t * 3); Snd.tone(90, 0.3, 'sine', 0.03); } }
    if (fi !== st._fi) { st._fi = fi; if (p > 0.3) Snd.tone(1200, 0.04, 'square', 0.02); }
    if (p > 0.72 && !st._ding) { st._ding = 1; Snd.sfx('ding'); }
    if (p > 0.12 && !st._cl) { st._cl = 1; Snd.noise(0.3, 0.04, 1200); }
  },
  /* Hotelzimmer 307: Karte an den Leser, grünes Licht, Tür auf – oder hinaus in den Flur */
  roomdoor(c, t, p, st) {
    const enter = !st.exit;
    R(c, 0, 0, SCENE_W, SCENE_H, '#e8dcc4');
    for (let x = 0; x < SCENE_W; x += 10) R(c, x, 0, 1, 58, '#ddd0b4');
    R(c, 0, 58, SCENE_W, 2, '#6a4428'); R(c, 0, 60, SCENE_W, 26, '#c9b89a'); for (let x = 0; x < SCENE_W; x += 20) R(c, x, 60, 1, 26, '#a89878');
    R(c, 0, 86, SCENE_W, 10, '#3f5e4c'); for (let x = 0; x < SCENE_W; x += 8) P(c, x + 3, 90, '#4f7a62');
    for (const lx of [24, 136]) { R(c, lx - 4, 22, 8, 6, '#c9a227'); E(c, lx, 30, 6, 3, st.night ? '#ffe8a0' : '#fff4d0'); E(c, lx, 34, 14, 6, 'rgba(255,230,160,0.15)'); }
    const dx = 62, dy = 26, dw = 36, dh = 60;
    R(c, dx - 3, dy - 3, dw + 6, dh + 3, '#5a3a24'); R(c, dx, dy, dw, dh, '#f6e0a8'); R(c, dx + 4, dy + 30, dw - 8, 20, '#7a5232');
    const open = enter ? clamp((p - 0.36) / 0.16, 0, 1) : clamp(1 - (p - 0.62) / 0.22, 0, 1);
    const pw = Math.round(dw * (1 - open * 0.92));
    if (pw > 0) { R(c, dx, dy, pw, dh, '#8a5e3a'); if (pw > 8) { R(c, dx + 3, dy + 4, pw - 6, 24, '#9a6e46'); R(c, dx + 3, dy + 32, pw - 6, 24, '#9a6e46'); R(c, dx + pw / 2 - 6, dy + 10, 12, 6, '#c9a227'); pxText(c, '307', dx + pw / 2 - 5, dy + 10, '#3a2a10'); } if (pw > 10) R(c, dx + pw - 6, dy + 34, 3, 2, '#c9a227'); }
    if (!enter && p > 0.85 && pw > 14) { R(c, dx + pw - 9, dy + 36, 8, 10, '#c8352d'); pxText(c, 'Z', dx + pw - 7, dy + 38, '#ffffff'); }
    R(c, dx + dw + 6, dy + 28, 7, 11, '#2a2a2e'); const green = enter ? p > 0.32 : true; E(c, dx + dw + 9.5, dy + 31, 1.5, 1.5, green ? '#3fe05a' : '#e2554a');
    const f = Math.floor(t * 8) % 2 ? 'walkA' : 'walkB';
    const floorY = dy + dh;
    if (enter) {
      /* zur Tür gehen, Karte an den Leser, Tür auf, durch die Öffnung hinein (abgeschnitten am Rahmen) */
      const q = clamp(p / 0.3, 0, 1), q2 = clamp((p - 0.52) / 0.35, 0, 1);
      if (p < 0.52) { const y = 98 - q * (98 - floorY), sc = 1.9 - q * 0.6; sceneSprite(c, st, q < 1 ? f : 'stand', 3, 80 - SPR_W * sc / 2, y - SPR_H * sc, sc); if (p > 0.22 && p < 0.4) { R(c, dx + dw + 2, dy + 32, 6, 4, '#f4f0e6'); R(c, 80 + 10, floorY - 24, dx + dw + 2 - 90, 3, '#2a2a30'); } }
      else inRect(c, dx, dy, dw, dh, () => { const sc = 1.3 - q2 * 0.3; sceneSprite(c, st, f, 3, 80 - SPR_W * sc / 2, floorY - q2 * 5 - SPR_H * sc, sc, 1 - q2); });
      if (p > 0.32 && !st._beep) { st._beep = 1; Snd.tone(1600, 0.06, 'square', 0.04); Snd.tone(2000, 0.08, 'square', 0.04, 0.08); }
    } else {
      const q1 = clamp(p / 0.25, 0, 1), q = clamp((p - 0.25) / 0.45, 0, 1);
      if (q <= 0) inRect(c, dx, dy, dw, dh, () => { const sc = 1 + q1 * 0.3; sceneSprite(c, st, f, 0, 80 - SPR_W * sc / 2, floorY - (1 - q1) * 5 - SPR_H * sc, sc, q1); });
      else { const sc = 1.3 + q * 0.6; sceneSprite(c, st, q < 1 ? f : 'stand', 0, 80 - SPR_W * sc / 2, floorY + q * (98 - floorY) - SPR_H * sc, sc); }
    }
    if (!st._snd && open > 0) { st._snd = 1; Snd.sfx('door'); }
    if (!enter && !st._snd2 && p > 0.78) { st._snd2 = 1; Snd.sfx('door'); }
    const stp = Math.floor(t * 8); if (stp !== st._step) { st._step = stp; if ((enter && (p < 0.3 || p > 0.52)) || (!enter && p < 0.7)) Snd.sfx('step'); }
  },
  /* Ankunft Innsbruck Hbf: der Railjet steht am Bahnsteig, die Tür zischt auf, du steigst aus */
  trainexit(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, st.night ? '#1a2030' : '#a8b4c0');
    for (let x = -10; x < SCENE_W; x += 24) { line(c, x, 0, x + 24, 14, '#5a646c'); line(c, x + 24, 0, x, 14, '#5a646c'); }
    R(c, 0, 14, SCENE_W, 2, '#5a646c');
    R(c, 52, 18, 56, 9, '#1a3a7a'); pxText(c, 'INNSBRUCK HBF', 80 - pxTextW('INNSBRUCK HBF') / 2, 20, '#ffffff'); R(c, 79, 14, 2, 4, '#5a646c');
    E(c, 132, 22, 6, 6, '#f4f4f0'); line(c, 132, 22, 132, 18, '#1a1a1e'); line(c, 132, 22, 135, 23, '#1a1a1e'); E(c, 132, 22, 6, 6, 'rgba(0,0,0,0)');
    const ty = 30;
    R(c, 0, ty, SCENE_W, 46, '#c8302a'); R(c, 0, ty, SCENE_W, 4, '#8a1a1a'); R(c, 0, ty + 30, SCENE_W, 3, '#f4f4f0'); R(c, 0, ty + 42, SCENE_W, 4, '#3a3c40');
    for (const wx of [6, 30, 112, 136]) { R(c, wx, ty + 8, 20, 14, '#3a4a5a'); R(c, wx + 1, ty + 9, 18, 12, st.night ? '#ffe8b0' : '#9ac0d8'); }
    const dx = 64, dw = 32, dh = 40, op = clamp((p - 0.12) / 0.18, 0, 1), sl = Math.round(dw / 2 * op * 0.95);
    R(c, dx, ty + 4, dw, dh, '#2a2a30'); R(c, dx + 2, ty + 6, dw - 4, dh - 4, '#f4e8c8');
    /* Im Wagen (abgeschnitten an der Türöffnung) nach vorne treten, dann auf den Bahnsteig hinunter */
    const doorBot = ty + 4 + dh, f = Math.floor(t * 8) % 2 ? 'walkA' : 'walkB';
    const q1 = clamp((p - 0.25) / 0.25, 0, 1), q = clamp((p - 0.5) / 0.4, 0, 1);
    if (p > 0.25 && q <= 0) inRect(c, dx + 2, ty + 6, dw - 4, dh - 2, () => { const sc = 0.95 + q1 * 0.2; sceneSprite(c, st, f, 0, 80 - SPR_W * sc / 2, doorBot - 3 + q1 * 3 - SPR_H * sc, sc, q1); });
    for (const [x0, w] of [[dx, dw / 2 - sl], [dx + dw / 2 + sl, dw / 2 - sl]]) if (w > 0) { R(c, x0, ty + 4, w, dh, '#c8302a'); R(c, x0 + 2, ty + 8, Math.max(0, w - 4), 14, '#3a4a5a'); }
    if (q > 0) { const sc = 1.15 + q * 0.75, y = doorBot + q * (95 - doorBot) - Math.sin(q * Math.PI) * 3; sceneSprite(c, st, q < 1 ? f : 'stand', 0, 80 - SPR_W * sc / 2, y - SPR_H * sc, sc); }
    if (op > 0 && op < 1) for (let k = 0; k < 2; k++) E(c, dx + rnd(0, dw), ty + dh + 2, 3, 1.5, 'rgba(255,255,255,0.35)');
    R(c, 0, 82, SCENE_W, 14, '#8a8e94'); R(c, 0, 82, SCENE_W, 2, '#ffd23d'); for (let x = 0; x < SCENE_W; x += 6) P(c, x + 2, 88, '#7a7e84');
    if (p > 0.12 && !st._hiss) { st._hiss = 1; Snd.noise(0.5, 0.06, 3000); Snd.tone(880, 0.08, 'square', 0.03); }
    const stp = Math.floor(t * 8); if (stp !== st._step) { st._step = stp; if (p > 0.25 && p < 0.9) Snd.sfx('step'); }
  },
  /* Apokalypse – Endsequenz: Teil 1 der Railjet flieht aus der versinkenden Stadt, Teil 2 im Abteil mit Bier */
  apocend(c, t, p, st) {
    const sky = (top, bot) => { for (let y = 0; y < SCENE_H; y++) R(c, 0, y, SCENE_W, 1, mix(top, bot, y / SCENE_H)); };
    const bolt = (x0, y0, y1, seed) => { let x = x0, y = y0; c.strokeStyle = '#eaf4ff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); for (let k = 1; k <= 7; k++) { x = x0 + Math.sin(seed * 9 + k * 2.3) * 7; y = y0 + (y1 - y0) * k / 7; c.lineTo(x, y); } c.stroke(); c.strokeStyle = 'rgba(150,200,255,0.4)'; c.lineWidth = 4; c.stroke(); };
    const flash = Math.floor(t * 2.6) % 5 === 0 && (t * 2.6) % 1 < 0.35;
    if (!st._th && flash) { st._th = 1; Snd.noise(1.2, 0.12, 160); Snd.tone(42, 1, 'sawtooth', 0.1, 0, -10); } if (!flash) st._th = 0;
    if (p < 0.4) {
      const q = p / 0.4;
      sky('#140404', '#a8381a');
      /* Nordkette als Vulkan */
      c.fillStyle = '#2a1414'; c.beginPath(); c.moveTo(0, 60); for (let x = 0; x <= SCENE_W; x += 4) c.lineTo(x, 40 - Math.abs(Math.sin(x * 0.05) * 16 + Math.sin(x * 0.13) * 5)); c.lineTo(SCENE_W, 60); c.closePath(); c.fill();
      for (const [vx, vy] of [[32, 22], [96, 26], [140, 30]]) { for (let k = 0; k < 4; k++) { const sy = vy - k * 6 - ((t * 10) % 6), r = 4 + k * 3; E(c, vx + Math.sin(t + k) * 3, sy, r, r * 0.7, `rgba(40,30,30,${0.7 - k * 0.12})`); } line(c, vx, vy, vx - 6, vy + 18, '#ff6a10'); line(c, vx + 1, vy, vx + 7, vy + 16, '#ff8a20'); if (Math.floor(t * 8 + vx) % 3 === 0) P(c, vx + rnd(-3, 3), vy - rnd(2, 8), '#ffd060'); }
      /* Stadt: Silhouetten, brennend, versinkend */
      for (let k = 0; k < 14; k++) { const bx = k * 12 - 4, bh = 14 + ((k * 7) % 12), sink = clamp(q * 1.6 - (k % 5) * 0.12, 0, 1) * bh; R(c, bx, 60 - bh + sink, 10, bh - sink + 2, '#1e1010'); for (let w = 0; w < 3; w++) if ((k + w) % 2) P(c, bx + 2 + w * 3, 64 - bh + sink, '#ffb050'); if (sink < bh) { const fh = 3 + Math.abs(Math.sin(t * 8 + k)) * 4; R(c, bx + 3, 60 - bh + sink - fh, 4, fh, '#ff6a10'); P(c, bx + 4, 60 - bh + sink - fh - 1, '#ffd040'); } }
      if (q > 0.3 && Math.floor(t * 3) % 4 === 0) { const cx = 70 + Math.sin(t) * 20; R(c, cx - 3, 44, 6, 16, '#e8b830'); }
      /* Lavameer steigt */
      const ly = 64 - q * 4;
      for (let y = ly; y < SCENE_H; y++) R(c, 0, y, SCENE_W, 1, mix('#ff7a20', '#8a1a08', (y - ly) / (SCENE_H - ly)));
      for (let x = 0; x < SCENE_W; x += 7) { const yy = ly + 2 + Math.sin(t * 3 + x) * 1.5; R(c, (x + t * 20) % SCENE_W, yy, 4, 1, '#ffe070'); }
      /* Brücke und flüchtender Railjet */
      R(c, 0, 74, SCENE_W, 3, '#3a2a24'); for (let x = 0; x < SCENE_W; x += 16) R(c, x + 6, 77, 3, 19, '#3a2a24');
      const tx = -160 + q * q * 330;
      for (let k = 0; k < 3; k++) { const x = tx + k * 52; R(c, x, 58, 50, 16, '#c8302a'); R(c, x, 58, 50, 3, '#8a1a1a'); R(c, x, 69, 50, 2, '#f4f4f0'); for (let w = 0; w < 4; w++) R(c, x + 4 + w * 12, 61, 8, 6, '#ffe8b0'); E(c, x + 10, 74, 3, 3, '#1e1e22'); E(c, x + 40, 74, 3, 3, '#1e1e22'); }
      sceneHead(c, st, tx + 2 * 52 + 28, 61, 0.5, 0);
      R(c, tx + 152, 60, 6, 12, '#a8202a'); E(c, tx + 157, 66, 2, 2, '#fff4c0');
      if (q > 0.05) for (let k = 0; k < 6; k++) P(c, tx - k * 4 + rnd(-1, 1), 70 + rnd(-2, 2), 'rgba(255,200,120,0.8)');
      if (flash) { bolt(40 + (Math.floor(t * 2.6) * 37) % 90, 0, 50, Math.floor(t * 2.6)); c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(0, 0, SCENE_W, SCENE_H); }
      for (let k = 0; k < 24; k++) { const ax = (k * 37 + t * 14) % SCENE_W, ay = (k * 23 + t * 18) % SCENE_H; P(c, ax, ay, k % 4 ? '#5a5250' : '#ff8a30'); }
      if (q > 0.35) { const tt = 'LAST EXIT INNSBRUCK', w = pxTextW(tt); R(c, 80 - w / 2 - 4, 6, w + 8, 10, 'rgba(0,0,0,0.6)'); pxText(c, tt, 80 - w / 2, 8, '#ffd23d'); }
      const stp = Math.floor(t * (2 + q * 8)); if (stp !== st._ck) { st._ck = stp; Snd.tone(80, 0.05, 'square', 0.03); }
      return;
    }
    /* Teil 2: im Abteil */
    const r = (p - 0.4) / 0.6;
    const jolt = Math.sin(t * 31) * 0.5 + (flash ? Math.sin(t * 60) * 1.5 : 0);
    c.save(); c.translate(0, Math.round(jolt));
    R(c, 0, 0, SCENE_W, SCENE_H, '#3a3c44');
    /* Fenster mit vorbeiziehender Apokalypse */
    const wx = 8, wy = 6, ww = 144, wh = 40;
    c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip();
    for (let y = wy; y < wy + wh; y++) R(c, wx, y, ww, 1, mix('#1a0505', '#c0441a', (y - wy) / wh));
    const off1 = t * 12, off2 = t * 70;
    c.fillStyle = '#2a1414'; c.beginPath(); c.moveTo(wx, wy + 30); for (let x = 0; x <= ww; x += 3) c.lineTo(wx + x, wy + 22 - Math.abs(Math.sin((x + off1) * 0.04) * 12 + Math.sin((x + off1) * 0.11) * 4)); c.lineTo(wx + ww, wy + 30); c.closePath(); c.fill();
    const vx = wx + ww - ((off1 * 0.6) % (ww + 40)); line(c, vx, wy + 12, vx - 5, wy + 26, '#ff6a10'); line(c, vx + 1, wy + 12, vx + 6, wy + 25, '#ff8a20'); for (let k = 0; k < 3; k++) E(c, vx + Math.sin(t + k) * 2, wy + 8 - k * 4 - ((t * 8) % 4), 3 + k * 2, 2 + k, `rgba(40,30,30,${0.6 - k * 0.15})`);
    for (let y = wy + 28; y < wy + wh; y++) R(c, wx, y, ww, 1, mix('#ff7a20', '#7a1a08', (y - wy - 28) / 12));
    for (let k = 0; k < 10; k++) { const x = wx + ww - ((off2 + k * 31) % (ww + 20)); R(c, x, wy + 18, 2, 12, '#1a1010'); const fh = 4 + Math.abs(Math.sin(t * 9 + k)) * 4; R(c, x - 1, wy + 18 - fh, 4, fh, '#ff6a10'); P(c, x, wy + 17 - fh, '#ffd040'); }
    if (flash) { bolt(wx + 20 + (Math.floor(t * 2.6) * 41) % 100, wy, wy + 30, Math.floor(t * 2.6) + 3); c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(wx, wy, ww, wh); }
    for (let k = 0; k < 16; k++) P(c, wx + ((k * 29 - off2 * 0.8) % ww + ww) % ww, wy + (k * 13 + t * 20) % wh, '#5a5250');
    c.restore();
    R(c, wx - 2, wy - 2, ww + 4, 2, '#8a8e94'); R(c, wx - 2, wy + wh, ww + 4, 3, '#8a8e94'); R(c, 79, wy, 2, wh, '#8a8e94');
    /* Rotes Flackern im Abteil */
    c.fillStyle = `rgba(255,80,20,${0.08 + Math.abs(Math.sin(t * 5)) * 0.06 + (flash ? 0.1 : 0)})`; c.fillRect(0, wy + wh, SCENE_W, SCENE_H);
    /* Tisch mit Bier und die Jungs */
    R(c, 0, 86, SCENE_W, 10, '#2a2c34');
    R(c, 54, 66, 52, 5, '#9aa0a8'); R(c, 54, 66, 52, 1, '#c9ccd2'); R(c, 78, 71, 4, 15, '#5a5e64');
    const fr = st.friends || [];
    const toast = r > 0.32 && r < 0.5, lift = toast ? 1 : 0;
    const seat = (sheet, x, dir, back) => { if (!sheet) return; const pose = toast || (Math.floor(t * 0.8 + x) % 4 === 0) ? 'drink' : 'sit'; sceneSprite(c, { sheet }, pose, dir, x, 44 + (back ? -3 : 0), back ? 1.45 : 1.6, back ? 0.85 : 1); };
    R(c, 8, 50, 30, 36, '#2f4a7a'); R(c, 8, 50, 30, 4, '#3f5a8a'); R(c, 122, 50, 30, 36, '#2f4a7a'); R(c, 122, 50, 30, 4, '#3f5a8a');
    seat(fr[0], 12, 2, true); seat(fr[1], 120, 1, true);
    seat(st.sheet, 22, 2, false); seat(fr[2], 110, 1, false);
    for (let k = 0; k < 4; k++) { const mx = 60 + k * 11, my = 60 - lift * 4 - (toast && (k === 1 || k === 2) ? 2 : 0); R(c, mx, my, 5, 6, '#e8b33a'); R(c, mx, my - 1, 5, 2, '#fbf6e8'); R(c, mx + 5, my + 1, 2, 3, '#d9e2e6'); }
    if (toast) { const w = pxTextW('PROST!'); R(c, 80 - w / 2 - 3, 50, w + 6, 9, 'rgba(0,0,0,0.55)'); pxText(c, 'PROST!', 80 - w / 2, 52, '#ffd23d'); for (let k = 0; k < 4; k++) P(c, 74 + rnd(0, 12), 56 + rnd(-3, 2), '#ffffff'); if (!st._clink) { st._clink = 1; Snd.sfx('clink'); setTimeout(() => Snd.sfx('cheer'), 300); } }
    if (r > 0.7) { const tt = 'AUF INNSBRUCK!', w = pxTextW(tt); R(c, 80 - w / 2 - 3, 88, w + 6, 8, 'rgba(0,0,0,0.5)'); pxText(c, tt, 80 - w / 2, 89, '#ffd27a'); }
    c.restore();
    const stp = Math.floor(t * 9); if (stp !== st._ck) { st._ck = stp; if (stp % 2) Snd.tone(70, 0.05, 'square', 0.03); }
  },
  /* Apokalypse verpasst: der Zug fährt ab, du stehst am Bahnsteig, die Lava steigt */
  apocfail(c, t, p, st) {
    for (let y = 0; y < SCENE_H; y++) R(c, 0, y, SCENE_W, 1, mix('#140404', '#a8381a', y / SCENE_H));
    R(c, 52, 10, 56, 9, '#1a3a7a'); pxText(c, 'INNSBRUCK HBF', 80 - pxTextW('INNSBRUCK HBF') / 2, 12, '#ffffff');
    const tx = 20 + p * p * 260;
    for (let k = 0; k < 3; k++) { const x = tx + k * 52; R(c, x, 34, 50, 26, '#c8302a'); R(c, x, 34, 50, 3, '#8a1a1a'); R(c, x, 52, 50, 2, '#f4f4f0'); for (let w = 0; w < 4; w++) { R(c, x + 4 + w * 12, 38, 8, 8, '#ffe8b0'); if (k === 0 && w % 2 === 0) { const fs = st.friends && st.friends[w / 2]; if (fs) sceneHead(c, { sheet: fs }, x + 4 + w * 12, 39, 0.45, 0); } } }
    R(c, 0, 60, SCENE_W, 4, '#3a3c40'); R(c, 0, 64, SCENE_W, 32, '#8a8e94'); R(c, 0, 64, SCENE_W, 2, '#ffd23d');
    const ly = 96 - p * 28;
    for (let y = ly; y < SCENE_H; y++) R(c, 0, y, SCENE_W, 1, mix('#ffb040', '#a81a08', (y - ly) / 30));
    for (let x = 0; x < SCENE_W; x += 6) R(c, x, ly + Math.sin(t * 4 + x) * 1.5, 3, 1, '#ffe070');
    sceneSprite(c, st, p > 0.6 ? 'bend' : 'stand', 2, 30, 84 - SPR_H * 1.6 + (p > 0.8 ? (p - 0.8) * 40 : 0), 1.6);
    if (p > 0.3) { const tt = 'ZU SPÄT …', w = pxTextW(tt); pxText(c, tt, 80 - w / 2, 24, '#ffd23d'); }
    if (p > 0.85) { c.fillStyle = `rgba(160,20,0,${(p - 0.85) / 0.15})`; c.fillRect(0, 0, SCENE_W, SCENE_H); }
    if (!st._s) { st._s = 1; Snd.tone(40, 4, 'sawtooth', 0.1, 0, -10); Snd.noise(4, 0.1, 200); }
  },
  /* Jessy: Händchenhalten am Inn, Kuscheln im Bogen, das volle Programm (Vorhang zu) */
  jessy(c, t, p, st) {
    const js = st.jsheet || st.sheet;
    const heart = (x, y, col = '#ff5a8a') => { P(c, x, y, col); P(c, x + 2, y, col); R(c, x - 1, y + 1, 5, 1, col); R(c, x, y + 2, 3, 1, col); P(c, x + 1, y + 3, col); };
    const hearts = (n, x0, w, y0, speed = 10) => { for (let i = 0; i < n; i++) { const ph = (t * speed + i * 17) % 40; heart(x0 + Math.floor(hash(i, 5) * w) + Math.sin(t * 2 + i) * 2, y0 - ph, i % 2 ? '#ff5a8a' : '#ff8ab0'); } };
    if (st.kind === 0) {
      sceneSky(c, true);
      sceneMountains(c, 44, '#2a3046', true, 30);
      R(c, 0, 60, SCENE_W, 36, '#1e3a58'); for (let x = 0; x < SCENE_W; x += 8) { const w = Math.sin(t * 2 + x * 0.3) * 1.5; R(c, x, 70 + w, 5, 1, '#3a6a98'); R(c, x + 3, 80 - w, 5, 1, '#2f5a88'); } R(c, 128, 62, 10, 30, 'rgba(244,240,216,0.18)');
      R(c, 0, 56, SCENE_W, 6, '#3a3c40'); R(c, 0, 56, SCENE_W, 1, '#5a5e64'); R(c, 0, 50, SCENE_W, 6, '#4f8040');
      R(c, 56, 44, 48, 3, '#6a4428'); R(c, 58, 47, 2, 8, '#4a2e1a'); R(c, 100, 47, 2, 8, '#4a2e1a');
      sceneSprite(c, st, 'sit', 0, 60, 24, 1.3); sceneSprite(c, { sheet: js }, 'sit', 0, 82, 24, 1.3);
      R(c, 82, 50, 4, 2, '#f1c3a6');
      hearts(4, 70, 30, 30, 8);
      for (const lx of [20, 140]) { R(c, lx, 30, 2, 26, '#3a3a40'); E(c, lx + 1, 29, 4, 3, '#ffe8a0'); E(c, lx + 1, 34, 12, 6, 'rgba(255,230,160,0.12)'); }
      pxText(c, 'AM INN', 6, 6, '#ffffff');
    } else if (st.kind === 1) {
      R(c, 0, 0, SCENE_W, SCENE_H, '#1a0e14');
      for (let y = 0; y < SCENE_H; y += 6) for (let x = -6; x < SCENE_W; x += 12) R(c, x + ((y / 6) % 2 ? 6 : 0), y, 11, 5, (x + y) % 7 ? '#2e1a22' : '#36202a');
      c.fillStyle = '#120a10'; c.beginPath(); c.moveTo(0, 0); c.lineTo(SCENE_W, 0); c.lineTo(SCENE_W, 30); c.quadraticCurveTo(80, -30, 0, 30); c.closePath(); c.fill();
      for (let k = 0; k < 10; k++) { const lx = 10 + k * 15, ly = 18 + Math.sin(k * 0.8) * 6; P(c, lx, ly, Math.floor(t * 3 + k) % 3 ? ['#ffd27a', '#ff8ab0', '#8ad0ff'][k % 3] : '#3a2a30'); line(c, lx, ly - 1, lx + 15, ly - 1 + Math.sin((k + 1) * 0.8) * 6 - Math.sin(k * 0.8) * 6, '#2a1a20'); }
      R(c, 30, 54, 100, 36, '#7a2a3a'); R(c, 34, 50, 92, 8, '#8a3a4a'); R(c, 30, 54, 100, 2, '#9a4a5a');
      R(c, 40, 58, 80, 28, '#c8305a'); for (let x = 42; x < 118; x += 8) R(c, x, 60 + ((x / 8) % 2) * 4, 5, 2, '#e05a80');
      sceneHead(c, st, 52, 42, 1.4, 0); sceneHead(c, { sheet: js }, 84, 42, 1.4, 0);
      R(c, 40, 58, 80, 4, '#d84a70');
      hearts(5, 50, 60, 36, 7);
      if (Math.floor(t) % 3 === 2) pxText(c, 'ZZZ', 108, 30, '#c8d0ff');
      R(c, 132, 60, 14, 26, '#3a2a30'); R(c, 134, 62, 10, 12, '#ffd27a'); pxText(c, 'VANILLE', 6, 6, '#ff8ab0');
    } else {
      sceneSky(c, true);
      R(c, 0, 20, SCENE_W, 76, '#4a3a32'); for (let y = 20; y < 96; y += 6) for (let x = -6; x < SCENE_W; x += 12) R(c, x + ((y / 6) % 2 ? 6 : 0), y, 11, 5, (x + y) % 7 ? '#5a4a40' : '#52443a');
      c.fillStyle = '#1a0e14'; c.beginPath(); c.moveTo(40, 92); c.lineTo(40, 50); c.quadraticCurveTo(80, 10, 120, 50); c.lineTo(120, 92); c.closePath(); c.fill();
      const shake = p > 0.3 && p < 0.85 ? Math.sin(t * 22) * 1.2 : 0;
      c.fillStyle = '#c8305a'; c.beginPath(); c.moveTo(44 + shake, 92); c.lineTo(44 + shake, 52); c.quadraticCurveTo(80 + shake, 16, 116 + shake, 52); c.lineTo(116 + shake, 92); c.closePath(); c.fill();
      for (let x = 48; x < 116; x += 10) R(c, x + shake, 52, 2, 40, '#a8204a');
      const flick = Math.floor(t * 7) % 5 === 0;
      R(c, 70 + shake, 34, 20, 8, flick ? '#ff8ab0' : '#ff5a8a'); pxText(c, '12', 76 + shake, 35, '#1a0e14');
      R(c, 60, 86, 10, 5, '#2a2a30'); R(c, 72, 86, 10, 5, '#2a2a30'); R(c, 86, 86, 8, 5, '#e3589c'); R(c, 96, 86, 8, 5, '#e3589c');
      R(c, 122, 56, 34, 16, '#f4f0e6'); R(c, 138, 52, 2, 4, '#8a8e94'); pxText(c, 'NICHT', 125, 58, '#1a1a1e'); pxText(c, 'STOEREN', 124, 65, '#1a1a1e');
      hearts(p > 0.3 ? 7 : 2, 50, 60, 30, 12);
      if (p > 0.3 && p < 0.85 && Math.floor(t * 4) % 2) pxText(c, '!', 128, 40, '#ffd23d');
      R(c, 0, 92, SCENE_W, 4, '#2a2a30');
      pxText(c, 'BOGEN 12', 6, 6, '#ff8ab0');
    }
  },
  /* Tram zum Bergisel (oder zurück): Häuserzeilen, Oberleitung, rote Tram */
  tram(c, t, p, st) {
    sceneSky(c, st.night);
    sceneMountains(c, 34, '#7a8aa0', true, st.back ? 90 : 10);
    const off = t * 60;
    if (!st.back) { /* Richtung Bergisel: die Schanze wächst am Horizont */ const sx = 118 - p * 14, sy = 34 - p * 10, sc = 0.6 + p * 0.9; R(c, sx, sy, 3 * sc, 22 * sc, '#d8dcdf'); E(c, sx + 1.5 * sc, sy, 5 * sc, 2.5 * sc, '#e8ecef'); line(c, sx + 3 * sc, sy + 2, sx + 14 * sc, sy + 20 * sc, '#eef3f8'); }
    for (let i = -1; i < 10; i++) { const bx = Math.round(i * 30 - (off % 30)), k = Math.floor((i + Math.floor(off / 30)) % 7 + 7) % 7; const h = 18 + Math.floor(hash(k, 4) * 24); R(c, bx, 60 - h, 26, h, ['#e8d8c0', '#c8c8d0', '#d8c0b0', '#b8c0b0', '#e0c8a8'][k % 5]); R(c, bx - 1, 60 - h - 4, 28, 5, ['#8a3b2a', '#5a5e64', '#7a4a3a'][k % 3]); for (let wy = 64 - h; wy < 56; wy += 6) for (let wx = bx + 3; wx < bx + 24; wx += 6) R(c, wx, wy, 3, 3, st.night && hash(k, wy + wx) > 0.3 ? '#ffd27a' : '#3a4a5a'); if (k === 2) { R(c, bx + 4, 52, 18, 8, '#f4f0e6'); pxText(c, 'WILTEN', bx + 5, 53, '#2a2a2e'); } }
    for (let i = -1; i < 6; i++) { const lx = Math.round(i * 60 - (off % 60)) + 10; R(c, lx, 36, 2, 24, '#3a3a40'); R(c, lx - 3, 36, 8, 1, '#3a3a40'); }
    line(c, 0, 37, SCENE_W, 37, '#5a5a60');
    R(c, 0, 60, SCENE_W, 36, '#3a3c40'); R(c, 0, 60, SCENE_W, 2, '#8a8a90');
    R(c, 0, 72, SCENE_W, 1, '#8a8e94'); R(c, 0, 76, SCENE_W, 1, '#8a8e94');
    for (let i = -1; i < 20; i++) R(c, Math.round(i * 8 - (off % 8)), 71, 4, 7, '#2a2a2e');
    const cx = 36, cy = 64 + Math.sin(t * 9) * 0.5;
    R(c, cx, cy - 18, 90, 20, '#c8302a'); R(c, cx, cy - 18, 90, 6, '#f4f0e6'); R(c, cx + 2, cy - 16, 86, 2, '#c8302a');
    for (let k = 0; k < 7; k++) { R(c, cx + 4 + k * 12, cy - 15, 9, 9, st.night ? '#ffe8b0' : '#9ac0d8'); if (k === 1 || k === 4) sceneHead(c, st, cx + 2 + k * 12, cy - 14, 0.6, 0); }
    R(c, cx, cy - 20, 90, 2, '#2a2a2e'); R(c, cx + 40, cy - 30, 2, 10, '#2a2a2e'); line(c, cx + 34, cy - 30, cx + 48, cy - 30, '#2a2a2e');
    R(c, cx + 8, cy - 26, 30, 6, '#1a1a1e'); pxText(c, st.back ? 'HBF' : 'BERGISEL', cx + 9, cy - 25, '#ffb53d');
    R(c, cx + 86, cy - 8, 4, 3, '#fff8d0'); R(c, cx, cy - 8, 3, 3, '#e2554a');
    for (const wx of [cx + 10, cx + 70]) { E(c, wx, cy + 3, 4, 4, '#1e1e22'); E(c, wx + 12, cy + 3, 4, 4, '#1e1e22'); }
    if (Math.floor(t * 2) % 5 === 0) { Snd.sfx('ding'); }
    pxText(c, st.back ? 'TRAM · HAUPTBAHNHOF' : 'TRAM · BERGISEL', 6, 6, '#ffffff');
  },
  /* Panoramalift im Bergisel-Turm: Glaskabine, die Stadt sinkt */
  lift(c, t, p, st) {
    sceneSky(c, st.night);
    const q = st.down ? 1 - p : p;
    sceneMountains(c, 46 + q * 10, '#6a7f9a', true, 30);
    const base = 70 + q * 50;
    for (let i = 0; i < 60; i++) { const x = (i * 29) % SCENE_W, w = 6 + (i * 5) % 9, h = 6 + (i * 7) % 10, y = base - h + (i * 11) % 24; R(c, x, y, w, h, st.night ? '#2a2a3a' : ['#e8d8c0', '#c8c8d0', '#d8c0b0'][i % 3]); R(c, x, y - 2, w, 2, '#7a4a3a'); if (st.night && i % 2) P(c, x + 2, y + 2, '#ffd27a'); }
    /* Aufsprunghügel und Stadion unter dem Turm */
    c.fillStyle = '#eef3f8'; c.beginPath(); c.moveTo(60, 96); c.lineTo(100 + q * 30, 40 + q * 56); c.lineTo(SCENE_W, 60 + q * 40); c.lineTo(SCENE_W, 96); c.closePath(); c.fill();
    /* Turmschaft und Kabine */
    R(c, 20, 0, 22, 96, '#d0d6dc'); R(c, 20, 0, 5, 96, '#b8c0c8'); R(c, 37, 0, 5, 96, '#e6eaee');
    const ky = 30 - Math.sin(t * 6) * 0.4;
    R(c, 23, ky, 16, 26, '#3a5068'); R(c, 24, ky + 1, 14, 24, st.night ? '#243a50' : '#9ac8e8');
    sceneSprite(c, st, 'stand', 0, 22, ky + 3, 0.85);
    R(c, 23, ky, 16, 1, '#c9ccd2'); R(c, 23, ky + 25, 16, 1, '#c9ccd2');
    for (let k = 0; k < 6; k++) { const yy = ((k * 18 + q * 110) % 108) - 6; R(c, 26, yy, 10, 2, 'rgba(0,0,0,0.12)'); }
    pxText(c, `${Math.round(q * 50)} M`, 6, 6, '#ffffff');
    const stp = Math.floor(t * 1.5); if (stp !== st._step && !st.night) { st._step = stp; }
  },
  /* Stadtturm: 133 Stufen */
  tower(c, t, p, st) {
    const off = Math.round(t * 40);
    for (let y = -8; y < SCENE_H; y += 8) for (let x = 0; x < SCENE_W; x += 12) { const yy = y + (off % 8); R(c, x + ((Math.floor((y + off) / 8) % 2) ? 6 : 0), yy, 11, 7, (x + y) % 5 ? '#6a6660' : '#5e5a54'); }
    for (const sx of [20, 130]) { const sy = ((off * 0.5) % 60); R(c, sx, sy - 10, 6, 18, '#1a1a22'); R(c, sx + 1, sy - 9, 4, 16, st.night ? '#223' : '#9fd0f0'); }
    for (let k = 0; k < 7; k++) { const y = ((k * 14 + off) % 98) - 8; R(c, 60, y, 40, 4, '#8a8278'); R(c, 60, y + 4, 40, 3, '#5a544c'); }
    const f = Math.floor(t * 6) % 2 ? 'walkA' : 'walkB';
    sceneSprite(c, st, f, 3, 71, 46 + Math.sin(t * 6) * 1.5, 1);
    const n = Math.min(133, Math.floor(p * 133) + 1);
    pxText(c, `STUFE ${n} / 133`, 6, 6, '#ffd27a');
    if (p > 0.5 && Math.floor(t * 2) % 2) pxText(c, 'PUH…', 100, 40, '#ffffff');
    if (n > 20 && Math.floor(t * 5) % 3 === 0) P(c, 88, 50, '#8ab0e8');
    const stp = Math.floor(t * 6); if (stp !== st._step) { st._step = stp; Snd.sfx('step'); }
  },
  /* Taxi durch Innsbruck */
  taxi(c, t, p, st) {
    sceneSky(c, st.night);
    sceneMountains(c, 36, '#7a8aa0', true, 10);
    const off = t * 70;
    for (let i = -1; i < 10; i++) { const bx = Math.round(i * 30 - (off % 30)), k = Math.floor((i + Math.floor(off / 30)) % 7 + 7) % 7; const h = 20 + Math.floor(hash(k, 1) * 24); R(c, bx, 60 - h, 26, h, ['#c8b89a', '#a8a8b0', '#d8c0b0', '#b0b8a8'][k % 4]); for (let wy = 64 - h; wy < 56; wy += 6) for (let wx = bx + 3; wx < bx + 24; wx += 6) R(c, wx, wy, 3, 3, st.night && hash(k, wy + wx) > 0.3 ? '#ffd27a' : '#3a4a5a'); }
    for (let i = -1; i < 6; i++) { const lx = Math.round(i * 60 - (off % 60)) + 10; R(c, lx, 40, 2, 20, '#3a3a40'); R(c, lx - 2, 38, 6, 3, st.night ? '#ffe8a0' : '#8a8a90'); if (st.night) E(c, lx + 1, 39, 10, 4, 'rgba(255,230,160,0.15)'); }
    R(c, 0, 60, SCENE_W, 36, '#3a3c40'); R(c, 0, 60, SCENE_W, 2, '#8a8a90');
    for (let i = -1; i < 9; i++) R(c, Math.round(i * 20 - (off % 20)), 78, 10, 2, '#e8e4dc');
    const cx = 56, cy = 66;
    R(c, cx, cy, 52, 14, '#e8dcb0'); R(c, cx + 8, cy - 10, 32, 11, '#e8dcb0'); R(c, cx + 10, cy - 8, 12, 8, '#8ab0c8'); R(c, cx + 25, cy - 8, 13, 8, '#8ab0c8');
    R(c, cx + 18, cy - 14, 14, 4, '#ffd23d'); pxText(c, 'TAXI', cx + 19, cy - 15, '#1a1a1a');
    R(c, cx + 50, cy + 4, 3, 3, '#fff8d0'); R(c, cx - 1, cy + 4, 2, 3, '#e2554a');
    if (st.night) { for (let k = 0; k < 20; k++) P(c, cx + 54 + k * 2, cy + 5 + (k % 3), `rgba(255,248,208,${0.5 - k * 0.025})`); }
    sceneHead(c, st, cx + 24, cy - 9, 0.8, 2);
    const ang = t * 9;
    for (const wx of [cx + 10, cx + 42]) { E(c, wx, cy + 14, 6, 6, '#1a1a1e'); E(c, wx, cy + 14, 3, 3, '#6a6a70'); for (let s = 0; s < 3; s++) line(c, wx, cy + 14, wx + Math.cos(ang + s * 2.1) * 4, cy + 14 + Math.sin(ang + s * 2.1) * 4, '#9a9a9a'); }
    if (Math.floor(t * 4) % 4 === 0) R(c, cx + 2, cy + 2, 4, 2, '#ffb53d');
  },
  /* Zugfahrt (st.col = Zugfarbe, st.label = Aufschrift) */
  /* Schöttli-Rundi im Railjet: Kusi verteilt Mini-Fläschli, alle klopfen, Zum Wohl, ex, Schütteln */
  schoettli(c, t, p, st) {
    const W = SCENE_W, H = SCENE_H, r2 = st.round > 1;
    const q = r2 ? 0.25 + p * 0.75 : p;
    /* Abteil und Fenster mit vorbeiziehender Landschaft */
    R(c, 0, 0, W, H, '#c9c4b8'); R(c, 0, 0, W, 4, '#b0aa9c');
    const wx = 8, wy = 6, ww = 144, wh = 38;
    c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip();
    sceneSky(c, false);
    sceneMountains(c, wy + 30, '#8a9ab0', true, t * 4);
    sceneMountains(c, wy + 36, '#4f8040', false, t * 16);
    R(c, wx, wy + 32, ww, wh - 32, '#6a9a4a');
    for (let k = 0; k < 8; k++) { const x = wx + ww - ((t * 90 + k * 23) % (ww + 10)); R(c, x, wy + 24, 1, 12, '#3a2a1a'); E(c, x, wy + 22, 3, 4, '#2e6b32'); }
    for (let k = 0; k < 3; k++) { const x = wx + ww - ((t * 140 + k * 61) % (ww + 30)); R(c, x, wy + 18, 1, 20, '#5a5e64'); }
    c.restore();
    R(c, wx - 2, wy - 2, ww + 4, 2, '#8a8e94'); R(c, wx - 2, wy + wh, ww + 4, 3, '#8a8e94'); R(c, 79, wy, 2, wh, '#8a8e94');
    R(c, 0, 86, W, 10, '#4a4c54'); for (let x = 0; x < W; x += 8) R(c, x, 88, 4, 1, '#5a5c64');
    /* Sitze (Railjet rot) */
    for (const sx of [6, 122]) { R(c, sx, 48, 32, 38, '#7a2f3a'); R(c, sx, 48, 32, 4, '#9a3f4a'); R(c, sx + 2, 52, 28, 1, '#6a2530'); }
    const fr = st.friends || [];
    const front = st.meK ? fr[3] : st.sheet;
    /* Personen: [sheet, x, y, dir, scale, Platz auf dem Tisch] */
    const P5 = [
      { sh: front, x: 22, y: 44, dir: 2, s: 1.6, spot: 57, me: !st.meK },
      { sh: fr[0], x: 12, y: 41, dir: 2, s: 1.45, spot: 66, back: true },
      { sh: st.meK ? st.sheet : st.kusi, x: 66, y: 32, dir: 0, s: 1.5, spot: 78, kusi: true },
      { sh: fr[1], x: 120, y: 41, dir: 1, s: 1.45, spot: 90, back: true },
      { sh: fr[2], x: 110, y: 44, dir: 1, s: 1.6, spot: 99 },
    ].filter((o) => o.sh);
    const shake = q > 0.8 ? Math.sin(t * 50) * (1 - (q - 0.8) / 0.2) * 1.5 : 0;
    const mouth = (o) => o.dir === 0 ? [o.x + 9 * o.s, o.y + 10 * o.s] : [o.x + (o.dir === 2 ? 13 : 5) * o.s, o.y + 9 * o.s];
    const bottle = (x, y, ang, kind, empty) => {
      const col = [['#3a2a1a', '#f2e6c8', '#c8302a', '#2a1a10'], ['#d6e8ee', '#6a3a8a', '#f4f4f0', '#e8eef2'], ['#d8eadc', '#3f8e4b', '#f2c23a', '#eef6ee'], ['#c8302a', '#f4f4f0', '#c9a227', '#e05040']][kind];
      c.save(); c.translate(Math.round(x), Math.round(y)); c.rotate(ang);
      R(c, -2, -7, 4, 6, col[0]); if (!empty && kind > 0 && kind < 3) R(c, -1, -5, 2, 4, col[3]);
      R(c, -2, -5, 4, 2, col[1]); P(c, 0, -5, col[2]);
      R(c, -1, -9, 2, 2, col[0]); R(c, -1, -10, 2, 1, kind === 2 ? '#c9a227' : '#1a1a1e');
      R(c, -2, -1, 4, 1, shade(col[0], -0.25));
      c.restore();
    };
    const kindOf = (o) => (o.me && st.declined ? 3 : st.kind || 0);
    /* Hinterreihe, Kusi, Tisch, Vorderreihe */
    const drinking = q > 0.58 && q < 0.8;
    const poseOf = (o) => (o.kusi ? (q < 0.22 && !r2 ? (Math.floor(t * 4) % 2 ? 'bend' : 'stand') : 'stand') : 'sit');
    for (const o of P5) if (o.back) sceneSprite(c, { sheet: o.sh }, poseOf(o), o.dir, o.x + shake, o.y, o.s, 0.88);
    const ko = P5.find((o) => o.kusi);
    if (ko) {
      sceneSprite(c, { sheet: ko.sh }, poseOf(ko), ko.dir, ko.x + shake, ko.y, ko.s);
      if (q < 0.25 && !r2) { R(c, 72, 54, 16, 12, '#3f6a3a'); R(c, 72, 54, 16, 2, '#5a8a52'); R(c, 78, 52, 4, 3, '#2a4a28'); for (let k = 0; k < 3; k++) P(c, 74 + k * 5, 56 + (Math.floor(t * 6 + k) % 2), '#d8eadc'); }
    }
    R(c, 52, 66, 56, 5, '#9aa0a8'); R(c, 52, 66, 56, 1, '#c9ccd2'); R(c, 78, 71, 4, 15, '#5a5e64');
    for (const o of P5) if (!o.back && !o.kusi) sceneSprite(c, { sheet: o.sh }, 'sit', o.dir, o.x + shake, o.y, o.s);
    /* Fläschli je nach Phase */
    P5.forEach((o, i) => {
      const kd = kindOf(o), base = [o.spot, 66];
      if (q < 0.25) {
        const t0 = i * 0.045, f = clamp((q - t0) / 0.07, 0, 1);
        if (f <= 0) return;
        const sx = 80, sy = 56, x = sx + (base[0] - sx) * f, y = sy + (base[1] - sy) * f - Math.sin(f * Math.PI) * 10;
        bottle(x, y, (1 - f) * 3, kd);
        if (f >= 1 && !(st._land || {})[i]) { st._land = st._land || {}; st._land[i] = 1; Snd.sfx('clink'); }
      } else if (q < 0.45) {
        const k = (q - 0.25) / 0.2 * 3, hop = Math.abs(Math.sin(k * Math.PI)) * 4;
        bottle(base[0], base[1] - hop, 0, kd);
      } else if (q < 0.58) {
        const f = clamp((q - 0.45) / 0.06, 0, 1), m = mouth(o);
        bottle(base[0] + (80 + (o.spot - 78) * 0.5 - base[0]) * f, base[1] - f * (base[1] - 50), 0, kd);
      } else if (q < 0.8) {
        const f = clamp((q - 0.58) / 0.06, 0, 1), m = mouth(o), ex = 80 + (o.spot - 78) * 0.5;
        const ang = f * (o.dir === 1 ? -2.2 : o.dir === 2 ? 2.2 : (i % 2 ? 2.6 : -2.6));
        bottle(ex + (m[0] - ex) * f, 50 + (m[1] - 50) * f, ang, kd, f >= 1 && q > 0.7);
      } else {
        const f = clamp((q - 0.8) / 0.05, 0, 1);
        bottle(base[0], base[1] - (1 - f) * 8 + (f >= 1 ? 9 : 0), f * Math.PI, kd, true);
      }
    });
    /* Text und Sounds */
    const banner = (txt, _y, col = '#ffd23d') => { const y = 88; const w = pxTextW(txt); R(c, 80 - w / 2 - 3, y - 2, w + 6, 9, 'rgba(0,0,0,0.6)'); pxText(c, txt, 80 - w / 2, y, col); };
    if (q < 0.25 && !r2) banner(q < 0.12 ? 'SCHÖTTLI-RUNDI!' : st.declined ? 'RIVELLA?! NA GUET …' : 'EIS FÜR JEDE!', 47);
    else if (q < 0.45) {
      const n = Math.min(3, Math.floor((q - 0.25) / 0.2 * 3) + 1);
      banner(['KLOPF!', 'KLOPF! KLOPF!', 'KLOPF! KLOPF! KLOPF!'][n - 1], 47);
      if (n !== st._kn) { st._kn = n; Snd.tone(110, 0.06, 'square', 0.07); Snd.noise(0.05, 0.08, 300); }
    } else if (q < 0.58) { banner('ZUM WOHL!', 38); if (!st._cl) { st._cl = 1; Snd.sfx('clink'); } for (let k = 0; k < 5; k++) P(c, 74 + ((k * 7 + Math.floor(t * 20)) % 12), 40 + (k % 3), '#ffffff'); }
    else if (q < 0.8) { banner(st.round > 1 ? 'NO EIS – EX!' : 'EX!', 38); if (!st._gl) { st._gl = 1; Snd.sfx('gulp'); setTimeout(() => Snd.sfx('gulp'), 260); } }
    else {
      const word = st.declined ? 'KUSI TRINKT ZWEI!' : ['BRRRR!', 'AHHH – PFLÜMLI!', 'FEIGLING? NIE!'][st.kind || 0];
      banner(word, 38, '#ffffff');
      if (!st._ch) { st._ch = 1; Snd.sfx('cheer'); Snd.sfx('hicks'); }
      for (let k = 0; k < 8; k++) { const a = t * 3 + k * 0.8; P(c, 80 + Math.cos(a) * (18 + k), 30 + Math.sin(a) * 6, k % 2 ? '#ffd23d' : '#ffffff'); }
      if (P5[0].me && st.declined) { R(c, 30, 30, 14, 9, '#ffffff'); R(c, 34, 39, 2, 2, '#ffffff'); pxText(c, '...', 32, 32, '#1a1a1e'); }
    }
    const stp = Math.floor(t * 7); if (stp !== st._ck) { st._ck = stp; if (stp % 2) Snd.tone(75, 0.04, 'square', 0.02); }
  },
  train(c, t, p, st) {
    sceneSky(c, st.night);
    sceneMountains(c, 44, '#7a8aa0', true, t * 3);
    sceneMountains(c, 60, '#4f8040', false, t * 12);
    if (st.lake) { R(c, 0, 58, SCENE_W, 12, '#3a78b0'); for (let k = 0; k < 20; k++) R(c, Math.floor((hash(k, 1) * 200 + t * 20) % 170) - 5, 60 + Math.floor(hash(k, 2) * 9), 4, 1, 'rgba(220,240,255,0.6)'); }
    R(c, 0, 70, SCENE_W, 26, '#6a9a4a');
    for (let i = -1; i < 10; i++) { const x = Math.round(i * 18 - ((t * 60) % 18)); R(c, x, 60, 2, 10, '#3a2a1a'); E(c, x + 1, 56, 5, 6, '#2e6b32'); }
    R(c, 0, 84, SCENE_W, 3, '#5a5a60'); for (let i = -1; i < 24; i++) R(c, Math.round(i * 8 - ((t * 140) % 8)), 86, 5, 2, '#8a7a5a');
    const tx = -20 + Math.min(1, p * 1.6) * 20;
    const col = st.col || '#c8302a';
    for (let w = 0; w < 3; w++) { const wx = tx + w * 54; R(c, wx, 64, 50, 20, '#f2f0ea'); R(c, wx, 64, 50, 3, '#c9ccd2'); R(c, wx, 76, 50, 6, col); R(c, wx, 82, 50, 2, '#2a2a2e'); for (let k = 4; k < 46; k += 9) R(c, wx + k, 67, 6, 7, '#4a6478'); if (w === 1) sceneHead(c, st, wx + 12, 66, 0.7, 2); }
    R(c, tx + 160, 64, 10, 20, col);
    if (st.label) pxText(c, st.label, 6, 6, '#ffffff');
    const wh = Math.floor(t * 8); if (wh !== st._step) { st._step = wh; if (wh % 2 === 0) Snd.noise(0.05, 0.03, 600); }
  },
};
const Scene = {
  async play(kind, o = {}) {
    const els = UI.els, cv = els.fadeCv;
    const draw = SCENES[kind];
    if (!cv || !draw) { await UI.fadeOut(o.text || ''); await sleep(o.ms || 1500); if (!o.keep) await UI.fadeIn(); return; }
    cv.width = SCENE_W; cv.height = SCENE_H;
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
    els.fadeText.textContent = o.text || '';
    const st = Object.assign({ sheet: getSheet(G.S.look), look: G.S.look, night: isNight() }, o);
    try { draw(x, 0, 0, st); } catch (e) { console.error(e); }
    els.fade.classList.add('scene'); els.fade.classList.add('on');
    await sleep(380);
    const ms = o.ms || 2500, t0 = performance.now();
    await new Promise((res) => {
      const loop = (now) => {
        const dt = now - t0;
        try { draw(x, dt / 1000, Math.min(1, dt / ms), st); } catch (e) { console.error(e); res(); return; }
        if (dt < ms) requestAnimationFrame(loop); else res();
      };
      requestAnimationFrame(loop);
    });
    if (!o.keep) await UI.fadeIn();
  },
};
