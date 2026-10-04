/* ============ Szenen für Sursee ============
   Fassaden der Lokale für die Türszenen, Bootsfahrt zum Gamma-Inseli, Umzug zur Gansabhauet,
   Räbeliechtli-Umzug und Putschibahn. */
Object.assign(FACADES, {
  wildermann: { name: 'WILDER MANN', wall: '#e8d4b0', door: 'wood', doorCol: '#4a2e1a', sign: ['#3a2418', '#f4d890'], inner: '#ffc870', lantern: true, flowers: true },
  muehle: { name: 'PIZZERIA ZUR MÜHLE', wall: '#efe0c8', door: 'wood', doorCol: '#5a2a1a', sign: ['#2f7a3a', '#ffffff'], inner: '#ffb860', lantern: true, flowers: true },
  stadtcafe: { name: 'STADTCAFÉ', wall: '#f0e8d8', door: 'glass', sign: ['#2a2a2e', '#f4e8c0'], inner: '#fff0c8', plants: true },
  tnt: { name: 'TNT ROCK BAR', wall: '#2a2a2e', door: 'metal', sign: ['#c8302a', '#1a1a1a'], inner: '#ff6a3a', bass: true },
  roessli: { name: 'RÖSSLI NIGHTBAR', wall: '#c8302a', door: 'curtain', sign: ['#2a1a10', '#ffd23d'], inner: '#ff4a7a', redlight: true },
  mosquito: { name: 'EL MOSQUITO', wall: '#e8a860', door: 'wood', doorCol: '#7a2a1a', sign: ['#c8302a', '#ffd23d'], inner: '#ffb050', lantern: true },
  lafuga: { name: 'LA FUGA', wall: '#3a2a20', door: 'glass', sign: ['#c8a060', '#2a1a10'], inner: '#ffe0a8' },
  craftwerk: { name: 'CRAFTWERK', wall: '#8a8e94', door: 'glass', sign: ['#1a1a1e', '#e8a83a'], inner: '#ffd27a' },
  zunftstube: { name: 'ZUNFT HEINI VON URI', wall: '#bfae8a', door: 'wood', doorCol: '#4a3420', sign: ['#2a2a2e', '#f2d040'], inner: '#ffc870', lantern: true },
  rathaus: { name: 'RATHAUS', wall: '#e8dcc4', door: 'wood', doorCol: '#5a3a24', sign: ['#c8302a', '#ffffff'], inner: '#ffe6a8', flags: true },
  theater: { name: 'STADTTHEATER', wall: '#e8d8e0', door: 'wood', doorCol: '#5a2a4a', sign: ['#5a3a6a', '#ffffff'], inner: '#ffd8a0', carpet: '#8a1a2a', trim: '#c9a227' },
  sankturbanhof: { name: 'SANKTURBANHOF', wall: '#efe0c0', door: 'wood', doorCol: '#5a3a24', sign: ['#5a4a38', '#f4e8c0'], inner: '#fff0d0' },
  stadthalle: { name: 'STADTHALLE SURSEE', wall: '#d8d0b8', door: 'glass', sign: ['#c8b040', '#2a2a18'], inner: 'strobe', bass: true },
  kulturwerk: { name: 'KULTURWERK 118', wall: '#e8e4dc', door: 'metal', sign: ['#1a1a1e', '#ff3a3a'], inner: '#ff6a5a', bass: true },
  surseepark: { name: 'SURSEEPARK', wall: '#c9ccd2', door: 'glass', sign: ['#2a2e34', '#ffffff'], inner: '#fff4d0', shop: true, goods: ['#ff7a1a', '#e8c23a', '#3f8e4b', '#c8352d'] },
  isa_haus: { name: 'NR. 8', wall: '#e4e0d8', door: 'glass', sign: ['#2a2e34', '#f4e8c0'], inner: '#ffe8b8', plants: true },
  polizei: { name: 'POLIZEI', wall: '#d8dce0', door: 'glass', sign: ['#1a3a7a', '#ffffff'], inner: '#eef4fa' },
  kloster: { name: 'KAPUZINERKLOSTER', wall: '#efe6d2', door: 'wood', doorCol: '#5a3a24', sign: ['#5a3a24', '#f4e8c0'], inner: '#fff0d0', flowers: true },
});
Object.assign(SCENES, {
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
