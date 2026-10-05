/* ============ Szenen für Sursee ============
   Fassaden der Lokale für die Türszenen, Bootsfahrt zum Gamma-Inseli, Umzug zur Gansabhauet,
   Räbeliechtli-Umzug und Putschibahn. */
/* Fassaden der Sursee-Gebäude für die Türszenen, passend zu den Zeichnungen auf der Karte (Tür immer in der Mitte, x 62–98, y 30–86).
   paint(c, t, night, off) zeichnet die Fassade über die Grundfarbe; fW zeichnet ein Fenster links/rechts der Tür. */
const fW = (c, x, y, w, h, o = {}) => {
  const night = o.night, off = o.off;
  if (o.shut) { R(c, x - 5, y, 4, h, o.shut); R(c, x + w + 1, y, 4, h, o.shut); if (o.flame) for (let k = 0; k < h; k += 2) { R(c, x - 5 + (k % 4 ? 2 : 0), y + k, 2, 1, '#f4f0e6'); R(c, x + w + 1 + (k % 4 ? 0 : 2), y + k, 2, 1, '#f4f0e6'); } }
  R(c, x - 1, y - 1, w + 2, h + 2, o.frame || '#a8a49a'); R(c, x, y, w, h, off ? '#1a2030' : night ? '#ffd27a' : (o.glass || '#7aa8c8'));
  R(c, x + Math.floor(w / 2), y, 1, h, o.frame || '#a8a49a'); R(c, x, y + Math.floor(h / 3), w, 1, o.frame || '#a8a49a');
  if (!night) R(c, x + 1, y + 1, 2, 3, '#c8e0f0');
};
const fNoise = (c, n, col, y0 = 0, y1 = 86) => { for (let i = 0; i < n; i++) P(c, Math.floor(hash(i, 51) * 160), y0 + Math.floor(hash(i, 52) * (y1 - y0)), col); };
Object.assign(FACADES, {
  wildermann: { name: 'WILDER MANN', wall: '#f6f4ee', door: 'wood', doorCol: '#4a2e1a', sign: ['#3a2418', '#f4d890'], inner: '#ffc870', lantern: true,
    paint: (c, t, n, off) => { for (const wx of [14, 36, 112, 134]) for (const wy of [10, 46]) fW(c, wx, wy, 12, 18, { shut: '#b8302a', night: n, off }); for (let x = 0; x < 160; x += 8) R(c, x, 0, 4, 4, '#b8302a'); R(c, 0, 4, 160, 2, '#7a3a2a'); } },
  muehle: { name: 'PIZZERIA ZUR MÜHLE', wall: '#e8d8b8', door: 'wood', doorCol: '#5a2a1a', sign: ['#2f7a3a', '#ffffff'], inner: '#ffb860', lantern: true, flowers: true,
    paint: (c, t, n, off) => { fNoise(c, 120, '#d4c4a0'); for (const wx of [20, 124]) fW(c, wx, 22, 14, 18, { shut: '#3f6b45', night: n, off }); const cx = 22, cy = 66, r = 16, a = t * 0.8; c.strokeStyle = '#6a4428'; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, r, 0, 6.283); c.stroke(); for (let k = 0; k < 8; k++) { const an = a + k * 0.785; line(c, cx, cy, cx + Math.cos(an) * r, cy + Math.sin(an) * r, '#7a5434'); } E(c, cx, cy, 3, 3, '#4a2e1a'); R(c, 132, 50, 4, 2, '#3f8e4b'); R(c, 136, 50, 4, 2, '#f4f0e6'); R(c, 140, 50, 4, 2, '#c8302a'); } },
  stadtcafe: { name: 'STADTCAFE', wall: '#f6f2ea', door: 'glass', sign: ['#2a2a2e', '#f4e8c0'], inner: '#fff0c8', plants: true,
    paint: (c, t, n, off) => { for (const wx of [14, 40, 108, 132]) fW(c, wx, 8, 12, 16, { shut: '#8a2a2a', night: n, off }); for (let x = 4; x < 58; x += 6) R(c, x, 50, 6, 8, (x / 6) % 2 ? '#2f5fb8' : '#f4f4f0'); for (let x = 102; x < 156; x += 6) R(c, x, 50, 6, 8, (x / 6) % 2 ? '#2f5fb8' : '#f4f4f0'); for (const wx of [8, 106]) { R(c, wx, 58, 46, 22, '#3a3c40'); R(c, wx + 2, 60, 42, 18, off ? '#2a3040' : n ? '#ffe8b0' : '#cfe4f0'); } } },
  tnt: { name: 'TNT ROCK BAR', wall: '#1e1e22', door: 'metal', sign: ['#c8302a', '#1a1a1a'], inner: '#ff6a3a', bass: true,
    paint: (c, t, n, off) => { for (let y = 0; y < 86; y += 6) for (let x = (y / 6) % 2 ? 0 : 6; x < 160; x += 12) R(c, x, y, 11, 5, '#26262c'); const on = !off && Math.floor(t * 5) % 7 !== 0; pxText(c, 'TNT', 16, 20, on ? '#ff3a3a' : '#5a1a1a', 3); line(c, 132, 14, 124, 30, on ? '#ffd23d' : '#5a5020'); line(c, 124, 30, 134, 30, on ? '#ffd23d' : '#5a5020'); line(c, 134, 30, 126, 46, on ? '#ffd23d' : '#5a5020'); for (const [px, col] of [[14, '#e8c23a'], [34, '#7ab0f0']]) { R(c, px, 50, 16, 22, col); R(c, px + 2, 52, 12, 8, '#1a1a1a'); } } },
  roessli: { name: 'RÖSSLI NIGHTBAR', wall: '#c8302a', door: 'curtain', sign: ['#2a1a10', '#ffd23d'], inner: '#ff4a7a', redlight: true,
    paint: (c, t, n, off) => { for (const wx of [14, 36, 112, 134]) fW(c, wx, 12, 12, 18, { shut: '#f4e8c0', night: n, off }); R(c, 128, 46, 22, 16, '#2a1a10'); E(c, 139, 54, 6, 5, '#ffd23d'); R(c, 140, 48, 4, 6, '#ffd23d'); R(c, 138, 49, 1, 4, '#2a1a10'); } },
  mosquito: { name: 'EL MOSQUITO', wall: '#e8a860', door: 'wood', doorCol: '#7a2a1a', sign: ['#c8302a', '#ffd23d'], inner: '#ffb050', lantern: true,
    paint: (c, t, n, off) => { for (let x = 0; x < 160; x += 8) for (const y of [0, 80]) R(c, x, y, 7, 5, ['#2f5fb8', '#e8c23a', '#c8302a'][(x / 8) % 3]); for (const wx of [18, 126]) fW(c, wx, 18, 14, 20, { night: n, off, frame: '#7a2a1a' }); for (const px of [20, 128]) { R(c, px, 70, 10, 8, '#c86a3a'); R(c, px + 4, 54, 3, 16, '#3f8e4b'); R(c, px + 1, 58, 3, 2, '#3f8e4b'); R(c, px + 1, 56, 1, 4, '#3f8e4b'); R(c, px + 7, 60, 3, 2, '#3f8e4b'); R(c, px + 9, 58, 1, 4, '#3f8e4b'); } } },
  lafuga: { name: 'LA FUGA', wall: '#3a2a20', door: 'glass', sign: ['#c8a060', '#2a1a10'], inner: '#ffe0a8',
    paint: (c, t, n, off) => { for (const wx of [14, 36, 112, 134]) for (const wy of [10, 46]) fW(c, wx, wy, 12, 18, { frame: '#c8a060', night: n, off }); R(c, 0, 40, 160, 2, '#c8a060'); } },
  craftwerk: { name: 'CRAFTWERK', wall: '#8a8e94', door: 'glass', sign: ['#1a1a1e', '#e8a83a'], inner: '#ffd27a',
    paint: (c, t, n, off) => { for (let x = 0; x < 160; x += 4) R(c, x, 0, 1, 86, '#7a7e84'); for (const wx of [12, 116]) fW(c, wx, 14, 32, 22, { frame: '#3a3c40', night: n, off }); for (const bx of [16, 30, 118]) { E(c, bx, 76, 6, 9, '#8a5a32'); R(c, bx - 6, 72, 12, 1, '#5a5e64'); R(c, bx - 6, 80, 12, 1, '#5a5e64'); } for (let k = 0; k < 12; k++) E(c, 50 + (k % 6) * 12, 6 + Math.floor(k / 6) * 4, 3, 2, '#5a9a3a'); } },
  zunftstube: { name: 'ZUNFT HEINI VON URI', wall: '#f2ece0', door: 'wood', doorCol: '#4a3420', sign: ['#2a2a2e', '#f2d040'], inner: '#ffc870', lantern: true,
    paint: (c, t, n, off) => { for (const wx of [14, 36]) fW(c, wx, 16, 12, 18, { shut: '#3f6b45', night: n, off }); R(c, 112, 0, 48, 86, '#ddd3bc'); for (let y = 2, k = 0; y < 86; y += 7, k++) R(c, 112, y, k % 2 ? 6 : 10, 6, '#b8a27c'); R(c, 130, 24, 3, 8, '#3a3632'); R(c, 50, 0, 1, 24, '#3a3a40'); const wv = Math.sin(t * 5) * 1.5; R(c, 51, 2 + wv * 0.2, 16, 5, '#f2d040'); R(c, 51, 7 + wv * 0.2, 16, 5, '#c8302a'); } },
  rathaus: { name: 'RATHAUS', wall: '#ebe9e1', door: 'wood', doorCol: '#5a3a24', sign: ['#c8302a', '#ffffff'], inner: '#ffe6a8', flags: true,
    paint: (c, t, n, off) => { for (const wx of [12, 30, 114, 132]) fW(c, wx, 40, 12, 18, { frame: '#a8a49a', night: n, off }); R(c, 0, 34, 160, 3, '#5a4a3a'); for (const wx of [20, 124]) fW(c, wx, 8, 14, 16, { frame: '#a8a49a', night: n, off }); R(c, 44, 4, 18, 22, '#f6f2e0'); for (let k = 0; k < 7; k++) { const a = Math.PI * (k / 6); line(c, 53, 10, 53 - Math.cos(a) * 7, 10 + Math.sin(a) * 10, '#c89a3a'); } R(c, 49, 0, 8, 6, '#c8302a'); R(c, 51, 1, 4, 4, '#f4f0e6'); E(c, 80, 30, 22, 8, '#a8a49a'); } },
  theater: { name: 'STADTTHEATER', wall: '#e8d8e0', door: 'wood', doorCol: '#5a2a4a', sign: ['#5a3a6a', '#ffffff'], inner: '#ffd8a0', carpet: '#8a1a2a', trim: '#c9a227' },
  sankturbanhof: { name: 'SANKTURBANHOF', wall: '#efe0c0', door: 'wood', doorCol: '#5a3a24', sign: ['#5a4a38', '#f4e8c0'], inner: '#fff0d0',
    paint: (c, t, n, off) => { for (const wx of [12, 32, 116, 136]) for (const wy of [8, 44]) fW(c, wx, wy, 10, 22, { frame: '#fbf4dc', night: n, off }); R(c, 0, 38, 160, 2, '#d8c8a0'); c.fillStyle = '#e4d4b0'; c.beginPath(); c.moveTo(56, 22); c.lineTo(80, 8); c.lineTo(104, 22); c.closePath(); c.fill(); } },
  stadthalle: { name: 'STADTHALLE', wall: '#5ccc4a', door: 'glass', sign: ['#2f8a6a', '#f2d81c'], inner: 'strobe', bass: true,
    paint: (c, t, n, off) => { for (let x = 0; x < 160; x += 5) R(c, x, 0, 1, 86, '#48b03a'); R(c, 0, 0, 160, 12, '#2c3f6a'); for (let x = 2; x < 160; x += 9) R(c, x, 0, 1, 12, '#4a6090'); R(c, 0, 12, 160, 8, off ? '#2a4040' : '#7ac8c8'); for (let k = 0; k < 3; k++) { const bx = 14 + k * 14, top = 30 + (k % 2) * 4; R(c, bx, top, 8, 56 - top + 30, '#f2d81c'); R(c, bx + 6, top, 2, 56 - top + 30, '#c8a810'); c.strokeStyle = '#f2d81c'; c.lineWidth = 8; c.beginPath(); c.arc(bx + 10, top, 6, Math.PI, Math.PI * 1.5); c.stroke(); } R(c, 132, 20, 8, 66, '#f2d81c'); R(c, 138, 20, 2, 66, '#c8a810'); E(c, 136, 20, 4, 2, '#fff070'); if (!off) { R(c, 102, 36, 22, 30, '#1a1a2a'); pxText(c, 'STUBETE', 104, 40, '#ff6ab0'); pxText(c, 'GÄNG', 106, 48, '#ffd23d'); pxText(c, '20 UHR', 104, 56, '#ffffff'); } } },
  kulturwerk: { name: 'KULTURWERK 118', wall: '#e8e4dc', door: 'metal', sign: ['#1a1a1e', '#ff3a3a'], inner: '#ff6a5a', bass: true,
    paint: (c, t, n, off) => { for (const gx of [4, 108]) { R(c, gx, 30, 48, 56, '#c8302a'); for (let y = 32; y < 86; y += 5) R(c, gx, y, 48, 1, '#a8221e'); } R(c, 0, 0, 160, 12, '#c8302a'); pxText(c, 'FEUERWEHR SURSEE', 48, 3, '#ffffff'); } },
  surseepark: { name: 'SURSEEPARK', wall: '#7ab0c0', door: 'glass', sign: ['#ffffff', '#1f6ab8'], inner: '#fff4d0',
    paint: (c, t, n, off) => { for (let y = 0; y < 86; y += 15) { R(c, 0, y, 160, 3, '#a4a8ae'); R(c, 0, y + 3, 160, 12, n ? (off ? '#2a3a48' : '#c8b878') : y < 40 ? '#8ac0d0' : '#5a9aa8'); } for (let x = 0; x < 160; x += 12) R(c, x, 0, 1, 86, '#3e5a66'); for (let i = 0; i < 6; i++) R(c, (i * 31) % 150, 6 + (i % 4) * 15, 10, 1, 'rgba(240,250,255,0.7)'); R(c, 108, 58, 52, 28, '#b8d040'); for (let x = 108; x < 160; x += 10) R(c, x, 58, 1, 28, '#6a8a2a'); R(c, 140, 40, 14, 12, '#ff6a00'); pxText(c, 'M', 145, 43, '#ffffff'); R(c, 16, 20, 10, 66, '#f2f4f6'); for (let i = 0; i < 6; i++) pxText(c, 'SURSEE'[i], 19, 24 + i * 7, '#1f6ab8'); } },
  isa_haus: { name: '', wall: '#6c785c', door: 'glass', sign: ['#2a2e34', '#f4e8c0'], inner: '#ffe8b8', plants: true,
    paint: (c, t, n, off) => { for (let x = 0; x < 160; x += 2) R(c, x, 0, 1, 86, (x / 2) % 3 ? '#5a6650' : '#7c886c'); for (const y of [0, 26, 52]) R(c, 0, y, 160, 2, '#d4d8cc'); for (const wx of [14, 34, 116, 136]) for (const wy of [6, 32]) { R(c, wx, wy, 8, 16, '#d8dcd4'); R(c, wx + 1, wy + 1, 6, 14, off ? '#1a2030' : n ? '#ffd890' : '#2c3236'); } R(c, 104, 40, 10, 10, '#1f4fa0'); pxText(c, '8', 107, 42, '#ffffff'); R(c, 20, 60, 30, 3, '#c8ccc4'); for (let k = 0; k < 30; k += 3) R(c, 20 + k, 60, 1, 10, '#9a9e96'); } },
  polizei: { name: 'POLIZEI', wall: '#d8dce0', door: 'glass', sign: ['#1a3a7a', '#ffffff'], inner: '#eef4fa',
    paint: (c, t, n, off) => { for (const wy of [8, 34, 60]) for (const wx of [10, 26, 42, 110, 126, 142]) { R(c, wx, wy, 12, 16, '#3e4c5e'); if (n && !off && hash(wx, wy) > 0.4) R(c, wx + 1, wy + 1, 10, 14, '#ffe8b0'); } R(c, 0, 0, 160, 3, '#5a5e64'); } },
  kloster: { name: 'KAPUZINERKLOSTER', wall: '#efe6d2', door: 'wood', doorCol: '#5a3a24', sign: ['#5a3a24', '#f4e8c0'], inner: '#fff0d0', flowers: true,
    paint: (c, t, n, off) => { fNoise(c, 100, '#e0d6c0'); for (const wx of [16, 124]) { E(c, wx + 8, 22, 8, 6, '#a8a49a'); R(c, wx, 22, 16, 22, '#a8a49a'); E(c, wx + 8, 23, 7, 5, off ? '#1a2030' : n ? '#ffd27a' : '#6a8aa8'); R(c, wx + 1, 23, 14, 20, off ? '#1a2030' : n ? '#ffd27a' : '#6a8aa8'); } R(c, 76, 0, 8, 12, '#7a4a3a'); R(c, 78, 4, 4, 5, '#3a3a40'); } },
});
Object.assign(SCENES, {
  /* Spaziergang zwischen Städtli und See: Weg mit Bäumen und Laternen zieht vorbei, am Horizont der Sempachersee (bzw. zurück die Altstadt) */
  seeweg(c, t, p, st) {
    const n = st.night;
    sceneSky(c, n);
    const hz = 40;
    if (!st.back) {
      sceneMountains(c, hz - 2, n ? '#2a3448' : '#8a9ab4', !n, 40);
      R(c, 0, hz - 6, SCENE_W, 8, n ? '#1a3050' : '#5a9ac0'); for (let k = 0; k < 10; k++) R(c, (k * 37 + t * 6) % 170 - 5, hz - 4 + (k % 3) * 2, 8, 1, n ? 'rgba(200,220,255,0.3)' : 'rgba(255,255,255,0.6)');
      E(c, 120, hz - 4, 6, 2, n ? '#1e3a1a' : '#4f7a3a'); R(c, 119, hz - 9, 1, 5, '#4a3020');
    } else {
      R(c, 0, hz - 4, SCENE_W, 6, n ? '#1e2a1a' : '#5a7a4a');
      for (let i = 0; i < 9; i++) { const x = 30 + i * 11, h = 8 + (i % 3) * 3; R(c, x, hz - 4 - h, 10, h, n ? '#3a3440' : PASTELS[i % PASTELS.length]); R(c, x - 1, hz - 6 - h, 12, 3, n ? '#2a2026' : ROOFS[i % ROOFS.length]); if (n) P(c, x + 4, hz - h, '#ffd27a'); }
      R(c, 78, hz - 30, 6, 26, n ? '#3a3a44' : '#f2eee2'); E(c, 81, hz - 32, 5, 4, n ? '#4a2a2a' : '#8e2a2e'); R(c, 80, hz - 40, 2, 6, '#5a5a5e');
    }
    R(c, 0, hz, SCENE_W, SCENE_H - hz, n ? '#1e2e1a' : '#5a8a3a');
    for (let i = 0; i < 40; i++) P(c, Math.floor(hash(i, 61) * SCENE_W), hz + 2 + Math.floor(hash(i, 62) * 54), n ? '#26381e' : '#6a9e48');
    /* Weg in die Tiefe */
    c.fillStyle = n ? '#4a463e' : '#c8b890'; c.beginPath(); c.moveTo(76, hz); c.lineTo(84, hz); c.lineTo(120, SCENE_H); c.lineTo(40, SCENE_H); c.closePath(); c.fill();
    /* Bäume und Laternen ziehen vorbei (von hinten nach vorne) */
    for (let k = 0; k < 6; k++) {
      const z = ((k / 6) + t * 0.45) % 1, sc = 0.25 + z * 1.6, y = hz + z * z * 60;
      for (const side of [-1, 1]) {
        const x = 80 + side * (10 + z * 70);
        if ((k + (side > 0 ? 1 : 0)) % 3 === 0) { R(c, x - 0.5 * sc, y - 22 * sc, Math.max(1, sc), 22 * sc, '#2a2a2e'); E(c, x, y - 23 * sc, 2 * sc, 2 * sc, n ? '#ffd27a' : '#e8e4d8'); }
        else { R(c, x - 1.5 * sc, y - 12 * sc, 3 * sc, 12 * sc, '#4a3020'); E(c, x, y - 20 * sc, 9 * sc, 10 * sc, n ? '#1e3a1e' : (k % 2 ? '#3e6b32' : '#a8641e')); E(c, x - 2 * sc, y - 23 * sc, 5 * sc, 5 * sc, n ? '#264a26' : (k % 2 ? '#4f8040' : '#c8842a')); }
      }
    }
    /* Spieler läuft vom Betrachter weg den Weg entlang */
    sceneSprite(c, st, Math.floor(t * 6) % 2 ? 'walkA' : 'walkB', 3, 71, 64);
    pxText(c, st.back ? 'INS STÄDTLI' : 'ZUM SEMPACHERSEE', 6, 6, '#ffffff');
  },
  /* Elektroboot über den Triechter, das Gamma-Inseli kommt näher (back: zurück zum Quai) */
  boat(c, t, p, st) {
    sceneSky(c, st.night);
    sceneMountains(c, 40, '#7a8aa0', true, 30);
    for (let x = 0; x < SCENE_W; x++) { const h = 3 + Math.abs(Math.sin(x * 0.07)) * 2; R(c, x, 44 - h, 1, h, st.night ? '#1e2a1a' : '#4f7a3a'); }
    R(c, 0, 44, SCENE_W, 52, st.night ? '#14304a' : '#3f7ea0');
    for (let k = 0; k < 24; k++) R(c, (hash(k, 3) * 200 - t * 30 * (1 + hash(k, 5))) % 170 + 170 * (((hash(k, 3) * 200 - t * 30) < 0) ? 1 : 0), 48 + hash(k, 7) * 46, 4, 1, 'rgba(220,240,255,0.45)');
    const q = st.back ? 1 - p : p;
    const ix = 40 + q * 60, isz = 0.4 + q * 1.4;
    E(c, ix, 46, 14 * isz, 3 * isz, st.night ? '#2a3a20' : '#5a7a3a');
    for (const [dx, h] of [[-6, 16], [2, 20], [8, 14]]) { R(c, ix + dx * isz, 46 - h * isz * 0.6, Math.max(1, isz), h * isz * 0.6, '#4a3020'); E(c, ix + dx * isz, 46 - h * isz * 0.75, 5 * isz, 6 * isz, st.night ? '#1e3a1a' : '#2e5a28'); }
    if (!st.back && st.night) E(c, ix + 4 * isz, 42, 1.5, 1.5, Math.floor(t * 4) % 2 ? '#fff4a0' : '#5a5030');
    const bx = 30, by = 70 + Math.sin(t * 4) * 1.5;
    c.fillStyle = '#e8e4dc'; c.beginPath(); c.moveTo(bx - 26, by); c.lineTo(bx + 30, by); c.lineTo(bx + 40, by + 6); c.lineTo(bx + 30, by + 12); c.lineTo(bx - 26, by + 12); c.closePath(); c.fill();
    R(c, bx - 26, by + 8, 66, 3, '#2f5fb8'); R(c, bx - 4, by - 8, 14, 8, '#7a5a3a');
    sceneHead(c, st, bx - 18, by - 10, 1, 2);
    for (let k = 0; k < 6; k++) R(c, bx - 30 - k * 6 - (t * 40) % 6, by + 10 + (k % 2), 4, 1, 'rgba(255,255,255,0.7)');
    pxText(c, st.back ? 'ZURÜCK ZUM QUAI' : 'GAMMA-INSELI', 6, 6, '#ffffff');
    if (Math.floor(t * 6) % 3 === 0) Snd.noise(0.04, 0.02, 400);
  },
  /* Umzug zur Gansabhauet: Tambouren, Zunft mit Fahne, Stadtrat, Schläger in rotem Mantel und Sonnenmaske */
  umzug(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, st.night ? '#1a1e2a' : '#9ec6e6');
    for (let i = 0; i < 9; i++) { const x = i * 20 - 4; R(c, x, 14, 18, 52, PASTELS[i % PASTELS.length]); R(c, x - 1, 10, 20, 5, ROOFS[i % ROOFS.length]); for (let f = 0; f < 3; f++) R(c, x + 4, 20 + f * 14, 4, 6, '#3e4c5e'); }
    R(c, 0, 66, SCENE_W, 30, '#a49a8a'); for (let x = 0; x < SCENE_W; x += 6) R(c, x, 66 + (x % 12 ? 0 : 3), 5, 1, '#8a8274');
    for (let i = 0; i < 26; i++) { const x = (i * 13) % SCENE_W, y = i % 2 ? 62 : 86; E(c, x, y - 5, 3, 3, '#e8c8a0'); R(c, x - 3, y - 2, 6, 8, ['#c8352d', '#2f5fb8', '#3f8e4b', '#e8c23a', '#4a4a50'][i % 5]); }
    const off = (t * 22) % 40;
    const marchers = [['#c8302a', 'tambour'], ['#c8302a', 'tambour'], ['#f2d040', 'fahne'], ['#23325a', 'rat'], ['#23325a', 'rat'], ['#c8302a', 'mask']];
    marchers.forEach(([col, k], i) => {
      const x = -30 + off + i * 26 + p * 60, y = 74 + (Math.floor(t * 6 + i) % 2);
      R(c, x - 3, y - 12, 7, 12, col); E(c, x, y - 15, 3, 3, '#e8c8a0'); R(c, x - 2, y, 2, 3, '#2a2a2e'); R(c, x + 1, y, 2, 3, '#2a2a2e');
      if (k === 'tambour') { E(c, x + 5, y - 6, 3, 3, '#f4f0e6'); if (Math.floor(t * 8 + i) % 2) line(c, x + 2, y - 12, x + 5, y - 9, '#8a6a3a'); }
      if (k === 'fahne') { R(c, x + 4, y - 30, 1, 28, '#5a3a24'); R(c, x + 5, y - 30, 12, 8, '#f2d040'); R(c, x + 5, y - 26, 12, 1, '#c8302a'); }
      if (k === 'rat') R(c, x - 3, y - 18, 7, 2, '#1a1a1a');
      if (k === 'mask') { R(c, x - 5, y - 13, 11, 13, '#c8302a'); for (let a = 0; a < 8; a++) { const an = a / 8 * 6.283; line(c, x, y - 15, x + Math.cos(an) * 5, y - 15 + Math.sin(an) * 5, '#f2d040'); } E(c, x, y - 15, 3, 3, '#f2d040'); }
    });
    const b = Math.floor(t * 4); if (b !== st._b) { st._b = b; Snd.tone(b % 2 ? 110 : 80, 0.08, 'triangle', 0.12); }
    pxText(c, 'GANSABHAUET SURSEE', 6, 4, '#ffffff');
  },
  /* Räbeliechtli-Umzug durch die dunkle Altstadt */
  raebeli(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#0e1220');
    for (let i = 0; i < 9; i++) { const x = i * 20 - 4; R(c, x, 14, 18, 52, '#1e2232'); R(c, x - 1, 10, 20, 5, '#14161e'); for (let f = 0; f < 3; f++) R(c, x + 4, 20 + f * 14, 4, 6, hash(i, f) > 0.5 ? '#ffd27a' : '#1a1e2a'); }
    R(c, 0, 66, SCENE_W, 30, '#24262e');
    for (let i = 0; i < 14; i++) {
      const x = ((i * 17 + t * 14) % (SCENE_W + 30)) - 15, y = 78 + (i % 3) * 5, kid = i % 3 !== 0;
      const hgt = kid ? 9 : 14;
      R(c, x - 2, y - hgt, 5, hgt, ['#c8352d', '#2f5fb8', '#3f8e4b', '#e8c23a'][i % 4]); E(c, x, y - hgt - 3, 3, 3, '#e8c8a0');
      line(c, x + 3, y - hgt + 2, x + 6, y - hgt - 6, '#8a6a3a');
      const fl = 0.7 + Math.sin(t * 9 + i) * 0.2;
      E(c, x + 6, y - hgt - 3, 3, 3, '#e88a2a'); E(c, x + 6, y - hgt - 3, 2 * fl, 2 * fl, '#ffe080');
      c.fillStyle = 'rgba(255,200,100,0.12)'; c.beginPath(); c.arc(x + 6, y - hgt - 3, 10, 0, 6.283); c.fill();
    }
    pxText(c, 'RÄBELIECHTLI', 6, 4, '#ffd27a');
  },
  /* Putschibahn */
  putschi(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#1a1a22');
    for (let k = 0; k < SCENE_W; k += 8) R(c, k, 0, 4, 8, ['#ff3ad0', '#3ae0ff', '#ffe03a'][(k / 8 + Math.floor(t * 4)) % 3]);
    R(c, 6, 20, SCENE_W - 12, 70, '#4a4e58'); for (let k = 10; k < SCENE_W - 10; k += 12) for (let j = 24; j < 88; j += 12) P(c, k, j, '#8a8e98');
    const cars = [[0.6, '#c8302a'], [1.1, '#2f5fb8'], [0.8, '#e8c23a']];
    cars.forEach(([sp, col], i) => { const a = t * sp + i * 2; const x = 80 + Math.cos(a) * 52, y = 56 + Math.sin(a * 1.3) * 22; R(c, x - 12, y - 6, 24, 12, col); R(c, x - 12, y - 6, 24, 2, shade(col, 0.3)); if (i === 0) sceneHead(c, st, x - 9, y - 16, 1, 0); else E(c, x, y - 8, 3, 3, '#e8c8a0'); line(c, x, y - 6, x, y - 30, '#8a8e94'); if (Math.floor(t * 9 + i) % 4 === 0) P(c, x, y - 31, '#fff4a0'); });
    if (Math.floor(t * 1.5) % 2 === 0 && (t % 0.66) < 0.05) Snd.sfx('hit');
    pxText(c, 'PUTSCHIBAHN', 6, 10, '#ffd23d');
  },
});
