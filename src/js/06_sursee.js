/* ============ Sursee: S-Bahn, Raum-Helfer ============
   Zweites Kapitel „Gans oder gar nicht“: Nach der Heimreise aus Innsbruck fährt ab Luzern Gleis 2 die S-Bahn nach Sursee.
   Karten hier: sbahn (Wagen mit Seeblick). Die Stadt, der See und die Innenräume folgen in 06_sursee_*.js.
   Alle Interaktionen laufen über Sur.* (09_sursee.js). */

/* Innenraum in Sursee: Wände, Schild, Tür unten zurück auf die Aussenkarte. o.back = [Karte, Spawn],
   o.spots = { name: [x, y, dir] } für Figuren, die die Story je nach Lage platziert (Sur.populate). */
function sRoom(id, o) {
  MAP_BUILDERS[id] = () => {
    const m = new GMap(id, o.w, o.h, { name: o.name, indoor: true, wallStyle: { cap: o.cap || '#3a2a20' }, bg: '#0a0a10', music: o.music || null, city: 'sursee', ambient: o.ambient || 0 });
    roomShell(m, o.style ?? 1, { floor: o.floor ?? T.WOOD, floorV: o.floorV ?? 0 });
    m.decal((c) => { if (o.sign !== false) pxText(c, (o.sign || o.name).toUpperCase(), 20, 21, o.signCol || '#f4e8c0'); if (o.wall) o.wall(c, m); });
    doorBottom(m, o.door, o.doorW || 2, o.back[0], o.back[1], o.exitLabel || 'Ausgang');
    m.spawn('entry', o.door, o.h - 2, 3);
    m.spots = o.spots || {};
    if (o.build) o.build(m);
    if (o.light !== false) m.light((o.w / 2) * 16, 3 * 16, o.lightR || 44, o.lightC || '#ffd78a');
    return m;
  };
}
/* Glitzern für Spuren und Fundstellen: kleine Sterne über einer Kachel, solange cond() wahr ist */
function glitter(m, x, y, cond) {
  const o = mkObj(x, y, 1, 1, 0, () => {}, { solid: false });
  o.anim = (c, t, px, py) => { if (cond && !cond()) return; for (let k = 0; k < 3; k++) { const ph = (t * 1.3 + k * 0.37) % 1; if (ph > 0.55) continue; const sx = px + 3 + ((k * 5 + Math.floor(t * 1.3 + k * 0.37) * 7) % 10), sy = py + 4 + ((k * 7 + Math.floor(t * 1.3 + k * 0.37) * 3) % 9); const a = 1 - Math.abs(ph - 0.27) / 0.27; c.globalAlpha = a; P(c, sx, sy, '#fff8c0'); P(c, sx - 1, sy, '#ffe070'); P(c, sx + 1, sy, '#ffe070'); P(c, sx, sy - 1, '#ffe070'); P(c, sx, sy + 1, '#ffe070'); c.globalAlpha = 1; } };
  m.add(o);
  return o;
}

/* ----------- S-Bahn Luzern → Sursee ----------- */
/* Halte in Fahrtrichtung (Minuten ab Abfahrt): echte Halte der S-Bahn am Westufer des Sempachersees */
const SB_STOPS = [{ n: 'Luzern', t: 0 }, { n: 'Emmenbrücke', t: 5 }, { n: 'Rothenburg Station', t: 10 }, { n: 'Sempach-Neuenkirch', t: 15 }, { n: 'Nottwil', t: 20 }, { n: 'Sursee', t: 25 }];
const SB_END = 25;
function sbState() {
  const f = G.S.flags;
  const tm = f.sbDep != null ? clamp(G.S.time - f.sbDep, 0, SB_END) : 0;
  let stop = null;
  for (const s of SB_STOPS) if (tm >= s.t && tm < s.t + 1) stop = s;
  if (tm >= SB_END) stop = SB_STOPS[SB_STOPS.length - 1];
  const next = SB_STOPS.find((s) => s.t > tm) || SB_STOPS[SB_STOPS.length - 1];
  const scene = tm < 8 ? 'city' : tm < 14 ? 'land' : 'lake';
  return { tm, stop, next, scene, moving: !stop };
}
let _sbScroll = 0;
MAP_BUILDERS.sbahn = () => {
  const m = new GMap('sbahn', 30, 9, { name: 'S-Bahn nach Sursee', indoor: true, bg: '#5a7a4a', wallStyle: { cap: '#9aa0a6' }, city: 'sursee' });
  m.fill(0, 0, 30, 9, T.TRAINF, 1);
  m.fill(0, 0, 30, 1, T.WALL); m.fill(0, 1, 30, 1, T.WALLF, 5); m.fill(0, 7, 30, 2, T.WALL);
  for (let y = 1; y < 7; y++) { m.set(0, y, T.WALL); m.set(29, y, T.WALL); }
  m.fill(12, 2, 5, 5, T.TRAINF, 0);
  m.wins = [];
  /* Vierergruppen links und rechts vom Einstiegsraum: Sitze rot-grau wie im FLIRT */
  const group = (x, top) => {
    const ys = top ? [2, 3] : [5, 6];
    for (const y of ys) { m.add(objSeat(x, y, 'r', '#8a2f36')); m.add(objSeat(x + 2, y, 'l', '#8a2f36')); }
    m.add(objTrainTable(x + 1, ys[0]));
    if (top) m.wins.push({ x: (x + 1) * 16 - 4, w: 24 });
  };
  for (const x of [1, 5, 8]) { group(x, true); group(x, false); }
  for (const x of [18, 21, 25]) { group(x, true); group(x, false); }
  /* Einstiegsraum mit Doppeltür, Infobildschirm und Velo-Haken */
  m.wins.push({ x: 13 * 16 + 4, w: 10, door: true }, { x: 15 * 16 + 2, w: 10, door: true });
  m.decal((c) => {
    for (const w of m.wins) if (!w.door) R(c, w.x - 1, 17, w.w + 2, 13, '#9aa0a6');
    const dx = 13 * 16;
    R(c, dx, 16, 48, 16, '#2a2c30'); R(c, dx + 2, 17, 44, 14, '#5a5e64'); R(c, dx + 22, 17, 4, 14, '#2a2c30'); R(c, dx + 23, 17, 2, 14, '#8a8e94');
    R(c, dx + 17, 20, 4, 2, '#4ad04a'); R(c, dx + 27, 20, 4, 2, '#4ad04a'); R(c, dx, 30, 48, 2, '#d8302a');
    R(c, 12 * 16 + 2, 2 * 16 + 2, 12, 9, '#1a1a1e'); R(c, 12 * 16 + 3, 2 * 16 + 3, 10, 7, '#0f3a7a');
    for (const vx of [17 * 16 + 4]) { R(c, vx, 2 * 16, 2, 14, '#8a8e94'); E(c, vx + 6, 2 * 16 + 9, 5, 5, 'rgba(0,0,0,0)'); line(c, vx, 2 * 16 + 4, vx + 8, 2 * 16 + 4, '#8a8e94'); }
  });
  for (const x of [13, 14, 15]) m.trig(x, 1, 1, 1, { label: 'Tür: Aussteigen', act: () => Sur.sbahnDoor() });
  m.trig(9, 3, 1, 1, { label: 'Hinsetzen', act: () => Sur.sbahnSeat() });
  m.spawn('start', 14, 4, 0);
  m.spots = { cuche: [6, 2, 2], alter: [20, 3, 1], friend: [6, 3, 2] };
  m.groundAnim = (c, cx, cy, t) => {
    const st = sbState();
    for (const w of m.wins) {
      const px = w.x - cx, py = 17 - cy;
      c.save(); c.beginPath(); c.rect(px, py, w.w, 11); c.clip();
      drawSbahnView(c, px, py, w.w, 11, st, t, w.x);
      c.restore();
    }
  };
  m.bgDraw = (c, cx, cy, t) => drawSbahnOutside(c, cx, cy, t);
  m.timeScale = 1;
  m.update = (dt) => Sur.sbahnUpdate(dt);
  return m;
};
/* Blick aus dem Fenster: Agglo, Felder, dann der Sempachersee mit Sempach am Ostufer und dem Paraplegiker-Zentrum in Nottwil */
function drawSbahnView(c, px, py, w, h, st, t, wx0) {
  const night = isNight();
  const sky = night ? '#1a2440' : '#a8c6e0';
  R(c, px, py, w, h, sky);
  if (night) for (let k = 0; k < 4; k++) P(c, px + ((k * 7 + wx0) % w), py + 1 + (k % 3), '#e8ecff');
  const sh = st.stop ? 0 : _sbScroll * 0.25;
  /* Hügel und Pilatus-Rigi-Kette am Horizont */
  for (let x = 0; x < w; x++) { const gx = x + wx0 * 0.2 + sh * 0.15; const hh = 3 + Math.abs(Math.sin(gx * 0.045)) * 3 + Math.sin(gx * 0.11) * 1; R(c, px + x, py + h - 6 - hh, 1, hh, night ? '#2a3448' : '#7d8aa0'); if (hh > 5.6 && !night) P(c, px + x, py + h - 6 - hh, '#eef2f6'); }
  if (st.stop) {
    R(c, px, py + h - 6, w, 6, night ? '#3a3c44' : '#b7b3aa'); R(c, px, py + h - 6, w, 1, '#e8c22e');
    const n = st.stop.n.toUpperCase(), tw = pxTextW(n) + 4;
    const sx = px + ((wx0 * 0.37) % 40) - 10;
    R(c, sx, py + 1, tw, 7, '#0f3a7a'); pxText(c, n, sx + 2, py + 2, '#ffffff');
    return;
  }
  if (st.scene === 'lake') {
    R(c, px, py + h - 6, w, 6, night ? '#14304a' : '#3f7ea0');
    /* Gegenufer: Sempach mit Kirchturm, weiter hinten die Vogelwarte */
    for (let x = 0; x < w; x++) { const gx = x + wx0 + sh * 0.35; if (Math.sin(gx * 0.03) > 0.2) R(c, px + x, py + h - 7, 1, 1, night ? '#2a3a30' : '#5e7a48'); }
    const town = ((wx0 + sh * 0.35) % 260);
    if (town < 40) { const tx = px + 20 - town; R(c, tx, py + h - 9, 8, 2, night ? '#ffd27a' : '#e8d8c0'); R(c, tx + 3, py + h - 12, 1, 3, night ? '#3a3a48' : '#d8d4cc'); }
    for (let k = 0; k < 3; k++) R(c, px + ((k * 13 + t * 6 + wx0) % w), py + h - 3 + k % 2, 3, 1, 'rgba(220,240,255,0.55)');
    if (st.tm > 17 && st.tm < 21) { const bx = px + w - ((sh * 2 + wx0) % (w + 30)); R(c, bx, py + h - 10, 14, 4, night ? '#ffe8b0' : '#e4e8ea'); R(c, bx, py + h - 10, 14, 1, '#7a8088'); }
  } else if (st.scene === 'land') {
    R(c, px, py + h - 6, w, 6, night ? '#24321e' : '#7aa255');
    for (let x = 0; x < w; x += 5) { const gx = Math.floor(x + sh) % 37; if (gx < 3) R(c, px + x, py + h - 9, 4, 3, night ? '#3a3020' : '#c8a878'); }
  } else {
    R(c, px, py + h - 6, w, 6, night ? '#2a2c30' : '#9a9a96');
    for (let x = 0; x < w; x += 6) { const gx = Math.floor((x + sh) / 6) % 5; R(c, px + x, py + h - 10 - gx, 5, 4 + gx, night ? (gx % 2 ? '#ffd27a' : '#2a2c34') : ['#e8c9a0', '#cfd2d4', '#d8b0a0', '#c8c0b0', '#e0d0b8'][gx]); }
  }
  for (let x = 0; x < w; x++) { const gx = x + sh; R(c, px + x, py + h - 2 - (Math.sin(gx * 0.3) > 0.7 ? 1 : 0), 1, 2, night ? '#1e2a1a' : '#4f7a3a'); }
  const pole = (sh * 2) % 40; R(c, px + w - pole, py, 1, h, '#4a4c52');
}
function drawSbahnOutside(c, cx, cy, t) {
  const st = sbState(), vw = View.w, vh = View.h, night = isNight();
  R(c, 0, 0, vw, vh, st.scene === 'lake' ? (night ? '#14304a' : '#3f7ea0') : night ? '#1e2a1a' : '#6c9a47');
  const off = st.stop ? 0 : _sbScroll;
  for (const ry of [-2, 9]) { const yy = ry * 16 - cy; R(c, 0, yy, vw, 16, '#77695a'); for (let x = -(off % 8); x < vw; x += 8) R(c, x, yy + 2, 3, 12, '#4a3a2c'); R(c, 0, yy + 4, vw, 2, '#b8bcc2'); R(c, 0, yy + 11, vw, 2, '#b8bcc2'); }
  if (st.stop) { R(c, 0, -cy + 10 * 16, vw, 3 * 16, '#b7b3aa'); R(c, 0, -cy + 10 * 16, vw, 3, '#e8c22e'); const n = st.stop.n, tw = pxTextW(n) + 8; for (const sx of [vw * 0.25, vw * 0.7]) { R(c, sx, -cy + 11 * 16, tw, 11, '#0f3a7a'); pxText(c, n, sx + 4, -cy + 11 * 16 + 3, '#ffffff'); } return; }
  for (let i = 0; i < 18; i++) { const span = vw + 120, x = ((hash(i, 5) * span - off * (0.9 + hash(i, 6) * 0.2)) % span + span) % span - 60, y = i % 2 ? -cy - 3 * 16 - hash(i, 7) * 100 : -cy + 10 * 16 + hash(i, 8) * 100; if (st.scene === 'lake' && i % 2 === 0) { R(c, x - 20, y, 50, 2, 'rgba(220,240,255,0.4)'); continue; } E(c, x, y, 8, 7, night ? '#1a2a18' : '#2e5a28'); E(c, x - 1, y - 1, 7, 6, night ? '#24361f' : '#3e6b32'); }
}
