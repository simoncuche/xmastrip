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
  /* UFO landet auf dem Platz, ein Alien steigt aus */
  ufo(c, t, p, st) {
    sceneSky(c, true);
    for (let i = 0; i < 9; i++) { const w = 14 + Math.floor(hash(i, 1) * 10), h = 22 + Math.floor(hash(i, 2) * 14), x = i * 18; R(c, x, 60 - h, w, h, '#2a2a3a'); for (let wy = 64 - h; wy < 56; wy += 6) for (let wx = x + 2; wx < x + w - 2; wx += 5) R(c, wx, wy, 2, 3, hash(i, wy) > 0.4 ? '#ffd27a' : '#2a2a3a'); }
    R(c, 0, 60, SCENE_W, 36, '#6a6660');
    const uy = 10 + Math.min(1, p / 0.55) * 34 + Math.sin(t * 3) * 1.5, ux = 80;
    if (p > 0.5) { const bw = 10 + (p - 0.5) * 60; c.fillStyle = 'rgba(160,255,200,0.25)'; c.beginPath(); c.moveTo(ux - 6, uy + 6); c.lineTo(ux + 6, uy + 6); c.lineTo(ux + bw / 2, 92); c.lineTo(ux - bw / 2, 92); c.closePath(); c.fill(); }
    E(c, ux, uy + 4, 30, 7, '#8a9096'); E(c, ux, uy + 3, 28, 5, '#b8bcc2'); E(c, ux, uy - 3, 12, 8, 'rgba(160,230,255,0.7)');
    for (let k = 0; k < 8; k++) { const a = t * 4 + k * 0.785; P(c, Math.round(ux + Math.cos(a) * 24), Math.round(uy + 6 + Math.sin(a) * 4), k % 2 ? '#ff5aa0' : '#5aff8a'); }
    if (p > 0.72) { const ay = 92 - Math.min(1, (p - 0.72) / 0.2) * 20; R(c, ux - 3, ay - 12, 6, 12, '#7ad08a'); E(c, ux, ay - 15, 5, 5, '#8ae09a'); R(c, ux - 3, ay - 16, 2, 2, '#1a1a1e'); R(c, ux + 1, ay - 16, 2, 2, '#1a1a1e'); R(c, ux - 6, ay - 8, 3, 1, '#7ad08a'); R(c, ux + 3, ay - 8, 3, 1, '#7ad08a'); }
    sceneSprite(c, st, 'stand', 3, 36, 66, 1);
    if (p > 0.85 && Math.floor(t * 2) % 2) pxText(c, 'BLIP BLOP', 100, 40, '#8ae09a');
    const bl = Math.floor(t * 3); if (bl !== st._step) { st._step = bl; if (p < 0.6) Snd.tone(600 + bl % 3 * 200, 0.05, 'sine', 0.04); }
  },
  /* Wagenkolonne mit Fähnchen */
  motorcade(c, t, p, st) {
    sceneSky(c, st.night);
    sceneMountains(c, 36, '#7a8aa0', true, 10);
    for (let i = 0; i < 8; i++) { const bx = i * 20; R(c, bx, 36, 18, 26, ['#e8d2a8', '#d8b890', '#c8c0b0'][i % 3]); for (let wy = 40; wy < 58; wy += 7) for (let wx = bx + 3; wx < bx + 16; wx += 6) R(c, wx, wy, 3, 4, '#4a5a6a'); }
    R(c, 0, 62, SCENE_W, 34, '#3a3c40'); R(c, 0, 62, SCENE_W, 2, '#8a8a90');
    for (let i = 0; i < 20; i++) { const fx = i * 8 + 2; R(c, fx, 64 + (i % 2) * 28, 2, 4, hash(i, 1) > 0.5 ? '#c8302a' : '#2f5fb8'); R(c, fx + 1, 63 + (i % 2) * 28, 1, 5, '#ffffff'); }
    const off = 200 - Math.min(1, p / 0.7) * 170;
    for (let k = 0; k < 3; k++) {
      const cx = off + k * 52;
      R(c, cx, 72, 44, 12, '#111114'); R(c, cx + 8, 64, 28, 9, '#111114'); R(c, cx + 10, 66, 10, 6, '#2a3a4a'); R(c, cx + 23, 66, 11, 6, '#2a3a4a');
      R(c, cx + 2, 60, 1, 6, '#8a8a90'); R(c, cx + 3, 60, 5, 3, k === 1 ? '#c8302a' : '#2f5fb8'); R(c, cx + 3, 60, 2, 3, k === 1 ? '#ffffff' : '#2f5fb8'); for (let s = 0; s < 3; s++) P(c, cx + 3 + s, 61, k === 1 ? '#ffffff' : '#c8302a');
      for (const wx of [cx + 8, cx + 36]) { E(c, wx, 84, 5, 5, '#1a1a1e'); E(c, wx, 84, 2, 2, '#6a6a70'); }
      if (k === 1) sceneHead(c, st, cx + 24, 65, 0.7, 2);
    }
    const mx = off - 30; R(c, mx, 76, 16, 6, '#2f5fb8'); R(c, mx + 4, 70, 6, 6, '#1a1a1e'); if (Math.floor(t * 8) % 2) R(c, mx + 2, 68, 4, 3, '#4a8aff'); else R(c, mx + 10, 68, 4, 3, '#ff4a4a');
    if (p > 0.75) { c.fillStyle = 'rgba(255,255,255,' + (Math.floor(t * 10) % 2 ? 0.08 : 0) + ')'; c.fillRect(0, 0, SCENE_W, SCENE_H); }
    pxText(c, 'SIRENEN', 6, 6, '#ff6a5a');
    const sr = Math.floor(t * 2); if (sr !== st._step) { st._step = sr; Snd.tone(sr % 2 ? 660 : 520, 0.25, 'square', 0.03); }
  },
  /* Godzilla und King Kong hinter der Nordkette */
  monster(c, t, p, st) {
    for (let y = 0; y < 60; y++) R(c, 0, y, SCENE_W, 1, mix('#4a1020', '#c05030', y / 60));
    sceneMountains(c, 48, '#3a2a3a', true, 10);
    const bob = Math.sin(t * 2) * 3, bob2 = Math.cos(t * 2) * 3;
    /* Godzilla */
    const gx = 30 + p * 20, gy = 50;
    R(c, gx - 10, gy - 36 + bob, 20, 40, '#1f3a2a'); R(c, gx - 4, gy - 48 + bob, 12, 14, '#1f3a2a'); R(c, gx + 6, gy - 44 + bob, 10, 5, '#1f3a2a');
    for (let k = 0; k < 6; k++) R(c, gx - 8 + k * 3, gy - 40 - (k % 2) * 3 + bob, 2, 4, '#3a6a3a');
    line(c, gx - 10, gy - 10 + bob, gx - 30, gy + 2 + bob, '#1f3a2a'); line(c, gx - 10, gy - 9 + bob, gx - 30, gy + 3 + bob, '#1f3a2a');
    P(c, gx + 2, gy - 45 + bob, '#ffd23d'); if (Math.floor(t * 3) % 3 === 0) { for (let k = 0; k < 10; k++) P(c, gx + 16 + k * 3, gy - 42 + bob + Math.sin(k) * 2, '#7ad0ff'); }
    /* Kong */
    const kx = 120 - p * 15, ky = 52;
    R(c, kx - 14, ky - 30 + bob2, 28, 32, '#3a2a1a'); R(c, kx - 8, ky - 42 + bob2, 16, 14, '#3a2a1a'); R(c, kx - 5, ky - 36 + bob2, 10, 7, '#5a4a3a');
    R(c, kx - 22, ky - 44 + bob2, 8, 20, '#3a2a1a'); R(c, kx + 14, ky - 44 + bob2, 8, 20, '#3a2a1a');
    P(c, kx - 3, ky - 39 + bob2, '#ffffff'); P(c, kx + 2, ky - 39 + bob2, '#ffffff');
    /* Stadt im Vordergrund */
    for (let i = 0; i < 10; i++) { const w = 14, h = 16 + Math.floor(hash(i, 1) * 10), x = i * 16; const crumble = p > 0.5 && hash(i, 5) > 0.5 ? Math.min(h - 4, (p - 0.5) * 30) : 0; R(c, x, 70 - h + crumble, w, h - crumble, '#5a4a4a'); for (let wy = 74 - h + crumble; wy < 66; wy += 6) for (let wx = x + 2; wx < x + w - 2; wx += 5) R(c, wx, wy, 2, 3, '#ffb53d'); }
    R(c, 0, 70, SCENE_W, 26, '#4a4040');
    for (let i = 0; i < 12; i++) { const u = ((t * 0.5 + hash(i, 3)) % 1); const x = 150 - u * 160; R(c, Math.round(x), 76 + Math.floor(hash(i, 4) * 12), 2, 5, '#e8d0b0'); P(c, Math.round(x), 75 + Math.floor(hash(i, 4) * 12), '#3a2a1a'); }
    for (let k = 0; k < 14; k++) { const u = ((t * 0.7 + hash(k, 8)) % 1); R(c, Math.floor(hash(k, 9) * SCENE_W), Math.round(40 + u * 50), 2, 2, `rgba(220,200,180,${1 - u})`); }
    if (Math.floor(t * 2) % 2) pxText(c, 'RRROOOAAAR!', 44, 8, '#ffffff', 1);
    const rr = Math.floor(t * 1.5); if (rr !== st._step) { st._step = rr; Snd.tone(55, 0.6, 'sawtooth', 0.12, 0, -20); Snd.noise(0.3, 0.1, 300); }
  },
  /* Zugfahrt (st.col = Zugfarbe, st.label = Aufschrift) */
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
