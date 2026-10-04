/* ============ Karten ============ */
function npcLook(seed, o = {}) { const L = randomLook(rng(seed), {}); return Object.assign(L, o); }
function roomShell(m, style, opts = {}) {
  m.fill(0, 0, m.w, m.h, opts.floor ?? T.WOOD, opts.floorV ?? 0);
  m.fill(0, 0, m.w, 1, T.WALL);
  m.fill(0, 1, m.w, 2, T.WALLF, style);
  for (let y = 0; y < m.h; y++) { m.set(0, y, T.WALL); m.set(m.w - 1, y, T.WALL); }
  m.fill(0, m.h - 1, m.w, 1, T.WALL);
  m.decal((c) => R(c, 16, 3 * 16, (m.w - 2) * 16, 3, 'rgba(0,0,0,0.16)'));
}
function doorBottom(m, x, w, to, spawn, label) {
  for (let k = 0; k < w; k++) m.set(x + k, m.h - 1, T.STONE, 1);
  m.decal((c) => { R(c, x * 16, (m.h - 1) * 16, w * 16, 16, '#3a3430'); R(c, x * 16 + 2, (m.h - 1) * 16 + 2, w * 16 - 4, 10, '#6a5a48'); for (let k = 4; k < w * 16 - 4; k += 3) R(c, x * 16 + k, (m.h - 1) * 16 + 3, 1, 8, '#5a4a3a'); });
  m.warp(x, m.h - 1, to, spawn, { w, label });
}
function wallDoorDecal(m, tx, num, col = '#6a4428') {
  m.decal((c) => {
    const px = tx * 16, py = 16;
    R(c, px + 1, py + 2, 14, 30, '#3a2a1c'); R(c, px + 2, py + 3, 12, 29, col); R(c, px + 3, py + 5, 10, 10, shade(col, -0.15)); R(c, px + 3, py + 18, 10, 10, shade(col, -0.15));
    P(c, px + 12, py + 18, '#e8c84a'); if (num) { const tw = pxTextW(String(num)) + 2; R(c, px + 8 - Math.ceil(tw / 2), py - 1, tw, 7, '#c9a65a'); pxText(c, String(num), px + 9 - Math.ceil(tw / 2), py, '#2a1a10'); }
  });
}

/* ----------- Luzern: Bahnhofplatz ----------- */
MAP_BUILDERS.luzern = () => {
  const m = new GMap('luzern', 36, 24, { name: 'Bahnhofplatz Luzern', bg: '#2f6e8f' });
  m.fill(0, 0, 36, 24, T.PLAZA, (x, y) => (x + y) % 3 === 0 ? 1 : 0);
  m.fill(0, 8, 36, 2, T.PAVE);
  m.fill(0, 20, 36, 1, T.PAVE, 1);
  m.fill(0, 21, 36, 3, T.WATER, 1);
  m.fill(28, 8, 8, 12, T.PAVE, 2);
  /* Bahnhofsgebäude mit Glasfront */
  const station = objBuilding(1, 0, 27, 8, {
    floors: 4, wall: '#cfd2d4', roof: '#8a9096', roofType: 'flat', trim: '#e8eaec', flowers: false, seed: 4,
    doors: [{ dx: 12, type: 'glass' }, { dx: 13, type: 'glass' }, { dx: 14, type: 'glass' }], allShop: true, goods: ['#e8eaec'],
    special: (c, W, H, fy0) => {
      R(c, 4, fy0 + 4, W - 8, H - fy0 - 22, '#7f97aa');
      for (let xx = 4; xx < W - 4; xx += 12) R(c, xx, fy0 + 4, 1, H - fy0 - 22, '#4a5a68');
      for (let yy = fy0 + 4; yy < H - 18; yy += 10) R(c, 4, yy, W - 8, 1, '#4a5a68');
      for (let i = 0; i < 40; i++) P(c, 6 + (hash(i, 1) * (W - 12)), fy0 + 6 + hash(i, 2) * (H - fy0 - 26), '#b8cad8');
      R(c, 0, H - 19, W, 3, '#5a646c'); R(c, 0, H - 19, W, 1, '#8a949c');
      pxText(c, 'LUZERN', W / 2 - 11, fy0 - 9, '#ffffff');
      R(c, W / 2 - 16, fy0 - 11, 32, 9, 'rgba(0,0,0,0)');
    },
    sign: { text: 'LUZERN', bg: '#d8302a', fg: '#ffffff', y: 22 },
  });
  m.add(station);
  m.warp(13, 7, 'luzern_halle', 'entry', { w: 3, label: 'Bahnhof betreten' });
  /* KKL-artiges Gebäude mit grossem Dach */
  m.add(objBuilding(28, 0, 8, 8, { floors: 3, wall: '#3a4048', roof: '#6a5040', roofType: 'flat', trim: '#5a6068', flowers: false, allShop: true, goods: ['#8ab0c8'], seed: 9, drawH: 6,
    special: (c, W, H) => { R(c, 0, 0, W, 12, '#7a5a3e'); R(c, 0, 10, W, 2, '#4a3828'); for (let k = 0; k < W; k += 6) R(c, k, 2, 3, 6, '#8a6a4a'); } }));
  /* Torbogen */
  m.add(objTorbogen(15, 13));
  m.solid(15, 13, 1, 1); m.solid(19, 13, 1, 1);
  m.trig(15, 12, 5, 3, { here: true, label: 'Foto: Torbogen', act: () => Story.photo('torbogen'), cond: () => !G.S.photos.torbogen });
  /* Bäume, Lampen, Bänke */
  for (const [x, y, k] of [[3, 12, 'autumn'], [9, 15, 'green'], [24, 12, 'yellow'], [30, 16, 'autumn'], [5, 17, 'green'], [27, 18, 'red']]) m.add(objTree(x, y, k));
  for (const x of [2, 11, 23, 33]) m.add(objLamp(x, 19));
  for (const [x, y] of [[7, 19], [20, 19]]) m.add(objBench(x, y, 0));
  m.add(objBench(26, 14, 0));
  m.add(objKiosk(4, 10, 'KIOSK', '#d8302a'));
  m.trig(4, 10, 3, 2, { label: 'Kiosk', act: () => Story.shop('kiosk_lu') });
  m.add(objTrinkbrunnen(12, 11));
  m.trig(12, 11, 1, 1, { label: 'Trinkbrunnen', act: () => Story.drinkFountain() });
  m.add(objBikes(31, 9)); m.add(objBikes(33, 9));
  for (const x of [9, 10, 11]) m.add(objBollard(x, 9));
  m.add(objLitfass(22, 9));
  /* Aschenbecher-Säule neben dem Bahnhofseingang (Raucherecke) */
  m.add(mkObj(18, 9, 1, 1, 14, (c, W, H) => {
    E(c, 8, H - 2, 5, 2, 'rgba(0,0,0,0.25)'); R(c, 4, 6, 8, H - 8, '#8a9096'); R(c, 4, 6, 2, H - 8, '#b0b6bc'); R(c, 10, 6, 2, H - 8, '#6a7076');
    R(c, 3, 4, 10, 3, '#5a6066'); R(c, 4, 4, 8, 1, '#c8ccd0'); for (const k of [5, 7, 9, 11]) P(c, k, 5, '#e8e4dc'); P(c, 6, 5, '#ff8a3a');
    R(c, 4, 12, 8, 2, '#d8302a'); R(c, 4, 14, 8, 1, '#f4f0e6');
  }, { solid: true }));
  m.trig(18, 9, 1, 1, { label: 'Aschenbecher: Eine rauchen', act: () => Story.luSmoke() });
  /* Taxistand auf dem Bahnhofplatz (Richtung KKL) */
  for (const y of [12, 14]) { m.add(objCar(32, y, '#1e1e22')); m.solid(32, y, 2, 1); m.trig(32, y, 2, 1, { label: 'Taxistand', act: () => Story.taxiLU() }); }
  m.add(mkObj(34, 11, 1, 1, 18, (c, Wd, Hd) => { R(c, 7, 6, 2, Hd - 7, '#3a3c40'); R(c, 1, 0, 14, 8, '#f0d040'); R(c, 1, 0, 14, 1, '#fff4a0'); pxText(c, 'TAXI', 1, 2, '#1a1a1a'); }, { solid: true }));
  m.trig(34, 11, 1, 1, { label: 'Taxistand', act: () => Story.taxiLU() });
  for (const y of [12, 14]) m.add(mkObj(32, y, 2, 1, 10, (c, W, H) => { R(c, 11, H - 25, 10, 5, '#f0d040'); R(c, 11, H - 25, 10, 1, '#fff4a0'); R(c, 12, H - 23, 8, 1, '#1a1a1a'); }));
  m.npcDefs.push({ id: 'hakan_taxi', name: 'Taxifahrer Hakan', x: 31 * 16 + 8, y: 13 * 16 + 12, dir: 2, look: npcLook(1201, { hair: 2, hairCol: 0, beard: 3, beardCol: 0, top: 9, topCol: 16, pants: 5, pantsCol: 2, hat: 0, glasses: 0, build: 3 }), talk: () => Story.taxiLU(), keepDir: true, bubbleRand: ['dots'] });
  /* Kapellbrücke & Wasserturm */
  m.add(mkObj(0, 21, 11, 1, 12, (c, W, H) => {
    R(c, 0, H - 10, W, 6, '#7a5434'); R(c, 0, H - 10, W, 1, '#a07450');
    for (let k = 0; k < W; k += 6) R(c, k, H - 4, 2, 6, '#5a3c24');
    for (let k = 0; k < W; k++) { const yy = H - 18 + Math.round(Math.abs(((k % 12) - 6)) * 0.3); R(c, k, yy, 1, 8, k % 2 ? '#8a3b2a' : '#9a4a34'); }
    for (let k = 0; k < W; k += 4) P(c, k, H - 12, '#e8402e');
  }, { solid: true }));
  m.add(mkObj(8, 21, 2, 2, 22, (c, W, H) => {
    R(c, 3, 10, W - 6, H - 12, '#b8986a'); for (let yy = 12; yy < H - 2; yy += 4) R(c, 3, yy, W - 6, 1, '#9a7a50'); R(c, W - 6, 10, 3, H - 12, '#9a7a50');
    for (let k = 0; k < 8; k++) R(c, W / 2 - k * 1.6, 2 + k, k * 3.2, 1, '#8a3b2a');
    R(c, W / 2 - 1, 15, 2, 4, '#2a2622');
  }));
  m.trig(4, 20, 9, 1, { here: true, label: 'Foto: Kapellbrücke', act: () => Story.photo('kapellbruecke'), cond: () => !G.S.photos.kapellbruecke });
  m.pedZones.push({ x: 0, y: 10, w: 36, h: 10, n: 9 });
  m.birdSpots.push({ x: 14, y: 15, w: 8, h: 3, n: 7 });
  m.birdSpots.push({ x: 14, y: 21, w: 18, h: 2, n: 5, kind: 'duck' });
  m.spawn('start', 9, 18, 3);
  m.spawn('from_halle', 14, 9, 0);
  m.groundAnim = waterAnim;
  m.timeScale = 0.2; /* bis zur Abfahrt um 9:10 zählt jede Minute – deshalb läuft die Uhr hier langsamer */
  return m;
};
function waterAnim(c, cx, cy, t) {
  const m = G.map;
  const x0 = Math.max(0, Math.floor(cx / TS)), x1 = Math.min(m.w - 1, Math.floor((cx + View.w) / TS));
  const y0 = Math.max(0, Math.floor(cy / TS)), y1 = Math.min(m.h - 1, Math.floor((cy + View.h) / TS));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (m.at(x, y) !== T.WATER) continue;
    const up = m.at(x, y - 1);
    const top = up !== T.WATER && up !== T.BRIDGE ? 7 : 0;
    for (let k = 0; k < 3; k++) {
      const ph = (t * 0.8 + hash(x, y, k)) % 1;
      const yy = y * TS + top + Math.floor(hash(x, y, k + 9) * (14 - top));
      const xx = x * TS + Math.floor(((hash(x, y, k + 4) * 16) + ph * 10) % 13);
      R(c, xx - cx, yy - cy, 3, 1, `rgba(200,230,245,${0.5 * Math.sin(ph * Math.PI)})`);
    }
  }
}

/* ----------- Luzern: Bahnhofshalle & Gleis 4 ----------- */
/* ---- Bäckerei-Objekte ---- */
function drawLoaf(c, x, y, kind) {
  if (kind === 'ruch') { E(c, x + 5, y + 3, 5, 3.5, '#6a3a1c'); E(c, x + 5, y + 2, 4, 2.5, '#8a5028'); line(c, x + 2, y + 1, x + 4, y + 4, '#c89058'); line(c, x + 5, y + 1, x + 7, y + 4, '#c89058'); P(c, x + 3, y + 1, '#e8d8c0'); }
  else if (kind === 'zopf') { for (let k = 0; k < 4; k++) { E(c, x + 1.5 + k * 2.4, y + 3 - (k % 2), 1.8, 1.6, '#d88a2c'); P(c, x + 1 + k * 2.4, y + 2 - (k % 2), '#f8c868'); } }
  else if (kind === 'baguette') { line(c, x, y + 4, x + 10, y, '#c8843a'); line(c, x + 1, y + 4, x + 10, y + 1, '#d8a050'); for (let k = 2; k < 9; k += 3) P(c, x + k, y + 3 - k * 0.35, '#f0d090'); }
  else if (kind === 'weggli') { E(c, x + 2, y + 3, 2.2, 1.8, '#d8a050'); P(c, x + 2, y + 2, '#f0d090'); }
  else if (kind === 'brezel') { c.strokeStyle = '#8a4a1a'; c.lineWidth = 1.4; c.beginPath(); c.arc(x + 3, y + 3, 2.4, 0.2, Math.PI * 2 - 0.2); c.stroke(); c.beginPath(); c.arc(x + 6, y + 3, 2.4, Math.PI + 0.2, Math.PI * 3 - 0.2); c.stroke(); line(c, x + 2, y + 5, x + 7, y + 1, '#8a4a1a'); P(c, x + 3, y + 1, '#ffffff'); P(c, x + 6, y + 2, '#ffffff'); }
}
function objBakeryShelf(x, y, w) {
  return mkObj(x, y, w, 1, 34, (c, W, H) => {
    /* Markise und Schild */
    for (let k = 0; k < W; k += 8) { R(c, k, 0, 8, 7, (k / 8) % 2 ? '#f4ead8' : '#8a5028'); R(c, k, 7, 8, 2, (k / 8) % 2 ? '#e0d4bc' : '#6a3a1c'); }
    for (let k = 0; k < W; k += 8) { c.fillStyle = (k / 8) % 2 ? '#e0d4bc' : '#6a3a1c'; c.beginPath(); c.moveTo(k, 9); c.lineTo(k + 8, 9); c.lineTo(k + 4, 12); c.closePath(); c.fill(); }
    const sw = 50; R(c, W / 2 - sw / 2, 1, sw, 8, '#3a2210'); R(c, W / 2 - sw / 2, 1, sw, 1, '#c8843a'); pxText(c, 'BÄCKEREI', W / 2 - pxTextW('BÄCKEREI') / 2, 2, '#f8e8c8');
    drawLoaf(c, W / 2 - sw / 2 - 11, 1, 'brezel'); drawLoaf(c, W / 2 + sw / 2 + 2, 1, 'brezel');
    /* Rückwand mit Holzregal */
    R(c, 0, 13, W, H - 13, '#7a4a28'); R(c, 0, 13, W, 2, '#5a3418');
    for (let k = 0; k < W; k += 12) R(c, k, 15, 1, H - 16, '#5a3418');
    const rows = [17, 26, 35];
    for (const ry of rows) { R(c, 1, ry + 6, W - 2, 2, '#a8784a'); R(c, 1, ry + 8, W - 2, 1, '#4a2a14'); }
    /* Brote: Ruchbrot, Zopf, Baguettes, Weggli – und Brezeln an Haken */
    for (let k = 0; k < W - 10; k += 11) drawLoaf(c, k + 2, rows[0], ['ruch', 'zopf', 'ruch', 'zopf', 'ruch', 'zopf', 'ruch', 'zopf', 'ruch'][(k / 11) | 0]);
    for (let k = 0; k < W - 12; k += 12) drawLoaf(c, k + 1, rows[1], k % 24 ? 'baguette' : 'baguette');
    for (let k = 0; k < W - 6; k += 6) drawLoaf(c, k + 1, rows[2], (k / 6) % 3 === 2 ? 'brezel' : 'weggli');
    /* Brotkörbe auf dem Boden */
    for (const bx of [4, W - 18]) { R(c, bx, H - 9, 14, 8, '#a87a4a'); for (let k = 0; k < 14; k += 3) R(c, bx + k, H - 9, 1, 8, '#7a5232'); for (let k = 0; k < 3; k++) line(c, bx + 2 + k * 4, H - 9, bx + 4 + k * 4, H - 16, '#c8843a'); }
  }, { solid: true, anim: (c, t, px, py) => { for (let k = 0; k < 3; k++) { const ph = (t * 0.6 + k * 0.33) % 1, x = px + 14 + k * 32 + Math.sin(t * 2 + k) * 2, y = py + 16 - ph * 12; c.fillStyle = `rgba(255,255,255,${0.35 * (1 - ph)})`; c.fillRect(x, y, 2, 2); c.fillRect(x + 1, y - 2, 1, 2); } } });
}
function objBakeryCounter(x, y, w) {
  return mkObj(x, y, w, 1, 12, (c, W, H) => {
    R(c, 0, 4, W, H - 4, '#8a5028'); R(c, 0, 4, W, 2, '#c8843a'); for (let k = 4; k < W; k += 8) R(c, k, 8, 1, H - 10, '#6a3a1c');
    /* gläserne Vitrine mit Gebäck */
    R(c, 2, 0, W - 18, 9, '#d8e8f0'); R(c, 2, 0, W - 18, 1, '#ffffff'); R(c, 3, 6, W - 20, 2, '#f4ead8');
    const goods = ['brezel', 'weggli', 'brezel', 'weggli', 'brezel', 'weggli', 'brezel'];
    for (let k = 0; k < (W - 24) / 7; k++) drawLoaf(c, 4 + k * 7, 1, goods[k % goods.length]);
    for (let k = 0; k < 3; k++) { E(c, 8 + k * 14, 8, 2.5, 1.3, '#e0a050'); P(c, 8 + k * 14, 7, '#f8f0e0'); }
    /* Kasse und Kaffeemaschine */
    R(c, W - 14, 0, 12, 7, '#2a2a2e'); R(c, W - 12, 2, 6, 3, '#7ad0f0'); R(c, W - 5, 4, 2, 2, '#c8302a');
  }, { solid: true });
}
function objBrezelStand(x, y) {
  return mkObj(x, y, 1, 1, 26, (c, W, H) => {
    R(c, 7, 4, 2, H - 5, '#6a3a1c'); R(c, 3, H - 3, 10, 2, '#4a2a14');
    for (let k = 0; k < 4; k++) { const yy = 4 + k * 6, xx = k % 2 ? 0 : 7; drawLoaf(c, xx, yy, 'brezel'); }
    R(c, 6, 1, 4, 3, '#c8843a');
  }, { solid: true });
}
MAP_BUILDERS.luzern_halle = () => {
  const m = new GMap('luzern_halle', 34, 22, { name: 'Bahnhof Luzern', indoor: true, bg: '#0e1116', wallStyle: { cap: '#4a443c' } });
  m.fill(0, 0, 34, 2, T.RAIL);
  m.fill(0, 2, 34, 1, T.EDGE, 0); m.fill(0, 3, 34, 2, T.PLAT); m.fill(0, 5, 34, 1, T.EDGE, 1);
  m.fill(0, 6, 34, 2, T.RAIL);
  m.fill(0, 8, 34, 1, T.EDGE, 0); m.fill(0, 9, 34, 2, T.PLAT);
  m.fill(0, 11, 34, 1, T.WALL); m.fill(0, 12, 34, 1, T.WALLF, 6);
  for (const [a, b] of [[4, 7], [14, 19], [26, 29]]) for (let x = a; x <= b; x++) { m.set(x, 11, T.PLAT); m.set(x, 12, T.STONE); }
  m.fill(1, 13, 32, 7, T.STONE);
  for (let y = 11; y < 22; y++) { m.set(0, y, T.WALL); m.set(33, y, T.WALL); }
  m.fill(0, 20, 34, 2, T.WALL);
  for (let x = 15; x <= 18; x++) { m.set(x, 20, T.STONE, 1); m.set(x, 21, T.STONE, 1); }
  /* Zweites Kapitel: Nach der Heimreise ist Gleis 4 umgeschildert – auf Gleis 2 wartet die S-Bahn nach Sursee */
  const heim = !!(G.S && G.S.chapter);
  m.warp(15, 21, 'luzern', 'from_halle', heim ? { w: 4, label: 'Heimgehen', guard: () => Sur.leaveLuzern() } : { w: 4, label: 'Zum Bahnhofplatz' });
  m.decal((c) => R(c, 16, 13 * 16, 32 * 16, 3, 'rgba(0,0,0,0.18)'));
  /* Züge */
  m.add(objTrainExterior(1, 0, 32, { col: '#2f5fb8', label: 'S-BAHN', doors: [9, 23] }));
  const TRAIN_DOORS = [6, 14, 22];
  const train = heim ? objTrainExterior(1, 6, 32, { col: '#d8302a', label: 'S1 SURSEE', doors: TRAIN_DOORS.map((x) => x - 1) }) : objTrainExterior(1, 6, 32, { col: '#c8302a', label: 'IR 70 ZÜRICH HB', doors: TRAIN_DOORS.map((x) => x - 1) });
  m.add(train);
  m.irTrain = train;
  if (!heim && G.S && G.S.flags && G.S.flags.missed) train.gone = true; /* Yännu hat den Zug verraucht */
  for (const x of TRAIN_DOORS) m.trig(x, 7, 1, 1, { label: heim ? 'S-Bahn nach Sursee: Einsteigen' : 'Zugtür: Einsteigen', act: () => (heim ? Sur.boardSBahn() : Story.boardTrain()) });
  /* Abfahrtstafel, Uhr, Schilder */
  m.decal((c) => {
    const px = 20 * 16 + 2, py = 12 * 16 + 1;
    R(c, px, py, 84, 14, '#0f1a2c'); R(c, px, py, 84, 1, '#2a3d5a');
    if (heim) { pxText(c, 'S1 SURSEE          2', px + 3, py + 2, '#ffb53d'); pxText(c, 'IR70 ZÜRICH HB     4', px + 3, py + 8, '#f2eee4'); }
    else { pxText(c, '0910 IR70 ZÜRICH HB 4', px + 3, py + 2, '#ffb53d'); pxText(c, '0914 S1 SURSEE     1', px + 3, py + 8, '#f2eee4'); }
    const qx = 31 * 16, qy = 12 * 16 + 2;
    E(c, qx + 6, qy + 6, 6, 6, '#20232a'); E(c, qx + 6, qy + 6, 5, 5, '#f4f2ea'); line(c, qx + 6, qy + 6, qx + 6, qy + 2, '#1a1a1a'); line(c, qx + 6, qy + 6, qx + 9, qy + 7, '#1a1a1a');
  });
  for (const x of [5, 16, 27]) m.add(mkObj(x, 9, 1, 1, 20, (c, Wd, Hd) => { R(c, 7, 8, 2, Hd - 9, '#4a4e54'); R(c, 1, 0, 14, 10, '#1a3a7a'); R(c, 1, 0, 14, 1, '#ffffff'); pxText(c, heim ? '2' : '4', 6, 3, '#ffffff'); }));
  m.add(objCounter(2, 14, 4, 1, { top: '#d8302a', front: '#a8221e', reg: true }));
  m.trig(2, 14, 4, 1, { label: 'Bahnhofkiosk', act: () => Story.shop('kiosk_lu') });
  /* Bäckerei-Stand: Brotregal an der Wand, Markise mit Schild und Riesenbrezel, Vitrine, Brezel-Stange, Bäckerin */
  m.add(objBakeryShelf(8, 13, 6));
  m.add(objBakeryCounter(9, 14, 4));
  m.add(objBrezelStand(13, 14));
  m.trig(9, 14, 4, 1, { label: 'Bäckerei', act: () => Story.shop('baeckerei_lu') });
  m.trig(13, 14, 1, 1, { label: 'Bäckerei', act: () => Story.shop('baeckerei_lu') });
  m.npcDefs.push({ id: 'baeckerin', name: 'Bäckerin Vreni', x: 11 * 16, y: 13 * 16 + 13, dir: 0, look: npcLook(1104, { hair: 9, hairCol: 5, beard: 0, top: 4, topCol: 13, hat: 0, glasses: 0, mouth: 0, build: 2 }), talk: () => Story.shop('baeckerei_lu'), keepDir: true, bubbleRand: ['dots', 'heart'] });
  for (const x of [22, 24]) m.add(mkObj(x, 14, 1, 1, 12, (c, W, H) => { R(c, 2, 0, 12, H - 1, '#c8302a'); R(c, 4, 3, 8, 7, '#1a2a3a'); R(c, 5, 4, 6, 1, '#7ad0f0'); R(c, 5, 13, 6, 2, '#2a2a2e'); R(c, 4, 18, 8, 3, '#e8e4dc'); }));
  m.trig(22, 14, 3, 1, { label: 'Billettautomat', act: () => Story.ticketMachine() });
  m.trig(20, 12, 6, 1, { label: 'Abfahrtstafel', act: () => Sur.tafel() });
  /* Taxizentrale: Taxi-Tickets zum Fixpreis (für Yännu, wenn der Zug weg ist) */
  m.add(objCounter(28, 14, 3, 1, { top: '#f0d040', front: '#b89418', reg: true }));
  m.trig(28, 14, 3, 1, { label: 'Taxizentrale', act: () => Story.taxiTicketLU() });
  m.decal((c) => { const sx = 28 * 16 + 2, sy = 12 * 16 + 2; R(c, sx, sy, 42, 11, '#1a1a1e'); R(c, sx, sy, 42, 1, '#f0d040'); pxText(c, 'TAXI', sx + 3, sy + 3, '#f0d040'); pxText(c, '24H', sx + 25, sy + 3, '#e8e4dc'); });
  m.npcDefs.push({ id: 'taxidisp', name: 'Taxizentrale', x: 29 * 16 + 8, y: 13 * 16 + 13, dir: 0, look: npcLook(1202, { hair: 16, hairCol: 4, beard: 0, top: 1, topCol: 4, hat: 0, glasses: 1 }), talk: () => Story.taxiTicketLU(), keepDir: true, bubbleRand: ['dots'] });
  for (const [x, y] of [[8, 17], [20, 17], [27, 17]]) m.add(objBench(x, y, 0, '#6a6e74'));
  for (const [x, y] of [[1, 18], [32, 18]]) m.add(objPlant(x, y));
  for (const [x, y] of [[3, 10], [12, 10], [24, 10], [31, 10]]) m.add(objBench(x, y, 0, '#6a6e74'));
  m.pedZones.push({ x: 1, y: 15, w: 32, h: 4, n: 7 }, { x: 0, y: 9, w: 34, h: 2, n: 4 }, { x: 0, y: 3, w: 34, h: 2, n: 3 });
  m.spawn('entry', 16, 19, 3);
  m.spawn('gleis', 16, 10, 0);
  m.timeScale = heim ? 1 : 0.2;
  return m;
};

/* ----------- Zug: Railjet nach Innsbruck ----------- */
const TRAIN_STOPS = [
  { n: 'Zürich HB', t: 0 }, { n: 'Sargans', t: 56 }, { n: 'Buchs SG', t: 75 }, { n: 'Feldkirch', t: 92 },
  { n: 'Bludenz', t: 112 }, { n: 'Landeck-Zams', t: 165 }, { n: 'Ötztal', t: 186 }, { n: 'Innsbruck Hbf', t: 216 },
];
const TRAIN_SCENES = [
  { to: 20, kind: 'city' }, { to: 50, kind: 'walensee' }, { to: 110, kind: 'rheintal' }, { to: 120, kind: 'arlberg' },
  { to: 134, kind: 'tunnel' }, { to: 165, kind: 'arlberg' }, { to: 216, kind: 'inntal' },
];
function trainState() {
  const f = G.S.flags;
  const tm = f.trainDep != null ? clamp(G.S.time - f.trainDep, 0, 216) : 0;
  let stop = null;
  for (const s of TRAIN_STOPS) if (tm >= s.t && tm < s.t + 2) stop = s;
  if (tm >= 216) stop = TRAIN_STOPS[TRAIN_STOPS.length - 1];
  const scene = (TRAIN_SCENES.find((s) => tm < s.to) || TRAIN_SCENES[TRAIN_SCENES.length - 1]).kind;
  return { tm, stop, scene, moving: !stop && f.trainDep != null };
}
MAP_BUILDERS.zug = () => {
  const m = new GMap('zug', 64, 9, { name: 'Railjet → Innsbruck', indoor: true, bg: '#6a8a4a', wallStyle: { cap: '#8a9096' } });
  m.fill(0, 0, 64, 9, T.TRAINF, 1);
  m.fill(0, 0, 64, 1, T.WALL); m.fill(0, 1, 64, 1, T.WALLF, 5); m.fill(0, 7, 64, 2, T.WALL);
  m.set(0, 1, T.WALL); m.set(63, 1, T.WALL);
  for (let y = 2; y < 7; y++) { m.set(0, y, T.WALL); m.set(63, y, T.WALL); }
  for (const x of [19, 23, 40, 44]) for (let y = 1; y < 7; y++) if (y !== 4) m.set(x, y, T.WALL);
  m.fill(20, 2, 3, 5, T.TRAINF, 0); m.fill(41, 2, 3, 5, T.TRAINF, 0); m.fill(24, 2, 16, 5, T.TRAINF, 0);
  m.wins = [];
  const seatGroup = (x, top, col) => {
    const ys = top ? [2, 3] : [5, 6];
    for (const y of ys) { m.add(objSeat(x, y, 'r', col)); m.add(objSeat(x + 2, y, 'l', col)); }
    m.add(objTrainTable(x + 1, ys[0]));
    if (top) m.wins.push({ x: (x + 1) * 16 - 4, w: 24 });
  };
  for (const x of [1, 5, 9, 13]) { seatGroup(x, true, '#2f4a7a'); seatGroup(x, false, '#2f4a7a'); }
  for (const x of [46, 50, 54, 58]) { seatGroup(x, true, '#7a2f3a'); seatGroup(x, false, '#7a2f3a'); }
  /* Speisewagen */
  m.add(objCounter(26, 5, 8, 1, { top: '#d9dcdf', front: '#7a2f3a', coffee: true, glasses: 3 }));
  m.trig(26, 5, 8, 1, { label: 'Speisewagen: Bestellen', act: () => Story.shop('speisewagen') });
  for (const x of [25, 29, 33, 37]) { m.add(objTable(x, 2, 2, 1, { col: '#e8e4dc', items: x === 29 ? 2 : 0 })); m.wins.push({ x: x * 16 + 4, w: 24 }); }
  for (const x of [35, 37]) m.add(objPlant(x + 1, 6));
  /* Ausstiegstür im Vorraum (Kacheln 20–22): zwei Glasflügel mit Aussicht, Mittelgriff, grüne Öffner */
  m.wins.push({ x: 20 * 16 + 4, w: 10, door: true }, { x: 22 * 16 + 2, w: 10, door: true }, { x: 41 * 16 + 2, w: 12 });
  m.decal((c) => {
    for (const w of m.wins) { if (!w.door) R(c, w.x - 1, 16 + 1, w.w + 2, 13, '#8a9096'); }
    const dx = 20 * 16;
    R(c, dx, 16, 48, 16, '#2a2c30'); R(c, dx + 2, 17, 44, 14, '#5a5e64');
    R(c, dx + 3, 18, 12, 12, '#1a1b1e'); R(c, dx + 33, 18, 12, 12, '#1a1b1e');
    R(c, dx + 22, 17, 4, 14, '#2a2c30'); R(c, dx + 23, 17, 2, 14, '#8a8e94');
    R(c, dx + 17, 20, 4, 2, '#4ad04a'); R(c, dx + 27, 20, 4, 2, '#4ad04a');
    R(c, dx + 17, 25, 4, 1, '#c9ccd2'); R(c, dx + 27, 25, 4, 1, '#c9ccd2');
    R(c, dx, 30, 48, 2, '#c8a020');
    pxText(c, 'WC', 42 * 16 + 3, 16 + 4, '#2f5fb8');
    R(c, 26 * 16, 6 * 16, 8 * 16, 16, '#3a3c40');
  });
  m.trig(42, 1, 1, 1, { label: 'WC', act: () => Story.toilet('zug') });
  for (const x of [20, 21, 22]) m.trig(x, 1, 1, 1, { label: 'Zugtür: Aussteigen', act: () => Story.trainDoor() });
  m.trig(48, 3, 1, 1, { label: 'Hinsetzen', act: () => Story.trainSeat() });
  m.spawn('start', 21, 4, 2);
  m.groundAnim = (c, cx, cy, t) => {
    const ts = trainState();
    for (const w of m.wins) {
      const px = w.x - cx, py = 17 - cy;
      c.save(); c.beginPath(); c.rect(px, py, w.w, 11); c.clip();
      drawWindowView(c, px, py, w.w, 11, ts, t, w.door);
      c.restore();
    }
  };
  m.bgDraw = (c, cx, cy, t) => drawTrainOutside(c, cx, cy, t);
  m.timeScale = 1.5;
  m.update = (dt) => Story.trainUpdate(dt);
  m.pedZones.push({ x: 1, y: 4, w: 18, h: 1, n: 1 });
  return m;
};
let _trainScroll = 0;
function drawWindowView(c, px, py, w, h, ts, t, door) {
  const sc = ts.scene;
  const sh = ts.stop ? 0 : _trainScroll * 0.25;
  if (sc === 'tunnel' && !ts.stop) { R(c, px, py, w, h, '#14161a'); if (Math.floor((t * 6) % 4) === 0) R(c, px + ((t * 300) % w), py + 4, 2, 1, '#ffd27a'); return; }
  const sky = isNight() ? '#1a2440' : sc === 'arlberg' ? '#a8c8e8' : '#9ec6e6';
  R(c, px, py, w, h, sky);
  for (let x = 0; x < w; x++) {
    const wx = x + sh * 0.3;
    const hh = sc === 'arlberg' || sc === 'walensee' ? 7 + Math.abs(Math.sin(wx * 0.05)) * 3 + Math.sin(wx * 0.13) * 1.5 : sc === 'city' ? 2 : 4 + Math.abs(Math.sin(wx * 0.04)) * 3;
    R(c, px + x, py + h - hh, 1, hh, sc === 'arlberg' ? '#7a7c86' : '#7d8aa0');
    if (hh > 7.5) P(c, px + x, py + h - hh, '#f2f4f6');
  }
  if (ts.stop) { R(c, px, py + h - 4, w, 4, '#b7b3aa'); R(c, px, py + h - 4, w, 1, '#e8c22e'); return; }
  for (let x = 0; x < w; x++) { const wx = x + sh; R(c, px + x, py + h - 3 - (Math.sin(wx * 0.3) > 0.6 ? 2 : 0), 1, 3, sc === 'walensee' ? '#3f86a8' : '#4f7a3a'); }
  const pole = ((sh * 2) % 40);
  R(c, px + w - pole, py, 1, h, '#4a4c52');
}
function drawTrainOutside(c, cx, cy, t) {
  const ts = trainState();
  const vw = View.w, vh = View.h;
  if (ts.scene === 'tunnel' && !ts.stop) { R(c, 0, 0, vw, vh, '#1a1b1e'); for (let i = 0; i < 6; i++) { const x = ((i * 97 - _trainScroll * 1.0) % (vw + 40) + vw + 40) % (vw + 40) - 20; R(c, x, -cy + 12, 3, 2, '#ffd27a'); R(c, x, -cy + 9 * 16 + 4, 3, 2, '#ffd27a'); } return; }
  const sc = ts.scene;
  const base = sc === 'city' ? '#8a8e8a' : sc === 'arlberg' ? '#5f7a46' : '#6c9a47';
  R(c, 0, 0, vw, vh, base);
  const off = ts.stop ? 0 : _trainScroll;
  /* Gleise oben und unten */
  for (const ry of [-2, 9]) {
    const yy = ry * 16 - cy;
    R(c, 0, yy, vw, 16, '#77695a');
    for (let x = -((off) % 8); x < vw; x += 8) R(c, x, yy + 2, 3, 12, '#4a3a2c');
    R(c, 0, yy + 4, vw, 2, '#b8bcc2'); R(c, 0, yy + 11, vw, 2, '#b8bcc2');
  }
  if (ts.stop) {
    R(c, 0, -cy - 4 * 16, vw, 2 * 16, '#b7b3aa'); R(c, 0, -cy - 2 * 16 - 3, vw, 3, '#e8c22e');
    R(c, 0, -cy + 11 * 16, vw, 3 * 16, '#b7b3aa'); R(c, 0, -cy + 11 * 16, vw, 3, '#e8c22e');
    const tw = pxTextW(ts.stop.n) + 8;
    for (const sx of [vw * 0.2, vw * 0.65]) { R(c, sx, -cy - 3 * 16, tw, 11, '#0f3a7a'); R(c, sx, -cy - 3 * 16, tw, 1, '#ffffff'); pxText(c, ts.stop.n, sx + 4, -cy - 3 * 16 + 3, '#ffffff'); }
    return;
  }
  /* Landschaft */
  for (let i = 0; i < 26; i++) {
    const seed = i * 131;
    const span = vw + 120;
    const x = ((hash(seed, 1) * span - off * (0.9 + hash(seed, 2) * 0.2)) % span + span) % span - 60;
    const side = i % 2 ? -1 : 1;
    const y = side < 0 ? -cy - 3 * 16 - hash(seed, 3) * 120 : -cy + 11 * 16 + hash(seed, 4) * 120;
    if (sc === 'walensee' && side > 0 && i % 3 === 0) { R(c, x - 30, y, 90, 50, '#3f86a8'); continue; }
    if (sc === 'inntal' && side > 0 && i % 4 === 0) { R(c, x - 40, y + 10, 140, 16, '#4a8aa8'); continue; }
    if (sc === 'city' && i % 2 === 0) { R(c, x, y, 26, 20, ['#e8c9a0', '#cfd2d4', '#d8b0a0'][i % 3]); R(c, x, y, 26, 6, '#8a3b2a'); continue; }
    if (i % 3 === 0) { R(c, x - 20, y, 60, 30, i % 2 ? '#c9b46a' : '#8aaa52'); for (let k = 0; k < 60; k += 4) R(c, x - 20 + k, y, 1, 30, shade(i % 2 ? '#c9b46a' : '#8aaa52', -0.1)); }
    else { const k = sc === 'arlberg' ? '#2e5a34' : '#3e6b32'; E(c, x, y, 8, 7, shade(k, -0.25)); E(c, x - 1, y - 1, 7, 6, k); E(c, x - 3, y - 3, 3, 2, shade(k, 0.2)); }
  }
  for (let x = -((off * 1.0) % 64); x < vw; x += 64) { R(c, x, -cy - 6, 2, 8, '#4a4c52'); R(c, x, -cy + 9 * 16 + 2, 2, 8, '#4a4c52'); }
}

/* ----------- Innsbruck ----------- */
const PASTELS = ['#e8b4a0', '#f2d58a', '#a8c8d8', '#c8d8a0', '#e8c8d8', '#f0e6d0', '#d89a6a', '#b8a8d0', '#f0c890', '#b8d8c8'];
const ROOFS = ['#8a3b2a', '#7a4a3a', '#6a5a52', '#9a4a2a', '#5a5a5e'];
function house(m, x, y, w, h, i, o = {}) {
  const b = objBuilding(x, y, w, h, Object.assign({ floors: 4, wall: PASTELS[i % PASTELS.length], roof: ROOFS[(i * 3) % ROOFS.length], shutter: i % 3 === 0 ? '#3f6b45' : i % 3 === 1 ? '#7a3a2a' : null, seed: x * 31 + y * 7 + i, dormers: i % 2 === 0, corner: i % 4 === 1, lintel: i % 2 === 1, wins: ['std', 'tall', 'arch'][i % 3] }, o));
  m.add(b);
  return b;
}
/* Schild, Wandfarbe und Waren je Laden – für die passende Türszene beim Betreten und Verlassen */
const SHOP_SIGNS = {};
function shopHouse(m, x, y, w, h, i, sign, doorDx, shopId, o = {}) {
  SHOP_SIGNS[shopId] = Object.assign({}, sign, { wall: o.wall || PASTELS[i % PASTELS.length], goods: o.goods, awning: o.awning && o.awning.col });
  const b = house(m, x, y, w, h, i, Object.assign({ doors: [{ dx: doorDx, type: 'glass' }], shopWins: [...Array(w).keys()].filter((k) => k !== doorDx), sign }, o));
  /* Läden sind betretbar: Tür führt in den Innenraum shop_<id>; der Rückweg merkt sich die Haustür */
  const back = `shop_${shopId}_${x}_${y}`;
  m.spawn(back, x + doorDx, y + h, 0);
  m.warp(x + doorDx, y + h - 1, 'shop_' + shopId, 'entry', { label: (sign && sign.label) || sign.text, guard: async () => { const ok = await Story.openGuard(SHOPS[shopId].venue || shopId); if (ok) G.S.flags.shopBack = back; return ok; } });
  return b;
}
/* Laden-Innenräume: jeder Laden hat seinen eigenen Grundriss; gemeinsam sind Theke mit Kasse, Verkäufer und der Ausgang
   zurück zur Haustür (flags.shopBack). shopRoom() liefert Helfer, build(m, h) richtet den Laden ein. */
function shelfRow(x, y, w, goods, col = '#5a3a24') {
  return mkObj(x, y, w, 1, 14, (c, W, H) => { R(c, 0, 0, W, H - 1, col); R(c, 1, 7, W - 2, 2, shade(col, 0.3)); R(c, 1, H - 2, W - 2, 1, shade(col, 0.3)); for (let k = 3; k < W - 4; k += 6) { R(c, k, 1, 4, 5, goods[(k / 6) % goods.length | 0]); R(c, k, 9, 4, 5, goods[(k / 6 + 1) % goods.length | 0]); } }, { solid: true });
}
function shopInterior(shopId, o) {
  MAP_BUILDERS['shop_' + shopId] = () => {
    const m = new GMap('shop_' + shopId, o.w, o.h, { name: o.name, indoor: true, wallStyle: { cap: o.cap || '#3a2a20' }, music: null, bg: '#0a0a10' });
    roomShell(m, o.style ?? 1, { floor: o.floor ?? T.WOOD, floorV: o.floorV ?? 0 });
    m.decal((c) => { pxText(c, (o.sign || o.name).toUpperCase(), 16 + 4, 16 + 5, o.signCol || '#f4e8c0'); if (o.wall) o.wall(c, m); });
    const h = {
      counter: (x, y, w, ct = {}) => { m.add(objCounter(x, y, w, 1, Object.assign({ top: '#7a4a2a', front: '#4a2c18', reg: true }, ct))); m.trig(x, y, w, 1, { label: o.buy || 'Kaufen', act: () => Story.shop(shopId) }); },
      keeper: (x, y) => m.npcDefs.push({ id: 'keeper', name: o.keeper, x: x * 16 + 8, y: y * 16 + 10, dir: 0, look: npcLook(o.seed, o.look), talk: () => Story.shop(shopId), keepDir: true, bubbleRand: o.bubble || ['dots'] }),
      shelf: (x, y, w, goods, col) => m.add(shelfRow(x, y, w, goods, col)),
      door: (x) => { doorBottom(m, x, 2, 'ibk', () => G.S.flags.shopBack || 'hbf', 'Ausgang'); m.spawn('entry', x, o.h - 2, 3); },
    };
    o.build(m, h);
    m.light((o.w / 2) * 16, 3 * 16, 44, '#ffd78a');
    return m;
  };
}
/* Sport Gipfel: Skiständer, Turnschuhwand, Theke rechts */
shopInterior('sport', { name: 'Sport Gipfel', w: 14, h: 9, keeper: 'Verkäufer Markus', seed: 991, look: { top: 10, topCol: 9, hair: 1, beard: 0, hat: 5, hatCol: 2 }, floor: T.STONE, cap: '#2a3a5a', signCol: '#7fb4e2', buy: 'Ausrüstung kaufen',
  wall: (c) => { for (let k = 0; k < 6; k++) { const px = 7 * 16 + k * 14, py = 20; R(c, px, py + 6, 11, 5, ['#c8352d', '#2f5fb8', '#e8c23a', '#3f8e4b', '#ff7a2a', '#f4f0e6'][k]); R(c, px, py + 10, 11, 2, '#1a1a1e'); R(c, px + 2, py + 4, 5, 3, shade(['#c8352d', '#2f5fb8', '#e8c23a', '#3f8e4b', '#ff7a2a', '#f4f0e6'][k], -0.2)); } },
  build: (m, h) => {
    h.counter(9, 5, 4, { top: '#c9ccd2', front: '#3a4a5a' }); h.keeper(10, 4);
    for (const x of [1, 4]) m.add(mkObj(x, 4, 2, 1, 26, (c, W, H) => { for (let k = 0; k < 4; k++) { R(c, 3 + k * 7, 0, 3, H - 2, ['#c8352d', '#2f5fb8', '#e8c23a', '#3f8e4b'][k]); R(c, 2 + k * 7, H - 4, 5, 2, '#1a1a1e'); P(c, 4 + k * 7, 2, '#ffffff'); } }, { solid: true }));
    h.shelf(1, 6, 4, ['#2f5fb8', '#f4f0e6', '#c8352d', '#1a1a1e'], '#8a9096');
    m.add(objTable(6, 6, 2, 1, { col: '#c9ccd2', items: 2 }));
    m.add(objPlant(12, 7)); h.door(7);
  } });
/* Trachten Holzer: Schaufensterpuppen, Hüte an der Wand, Umkleide */
shopInterior('tracht', { name: 'Trachten Holzer', w: 12, h: 10, keeper: 'Frau Holzer', seed: 992, look: { hair: 9, hairCol: 2, beard: 0, top: 11, topCol: 0, pants: 5, pantsCol: 9 }, floor: T.WOOD, floorV: 1, cap: '#3f5a3b', signCol: '#f4e8c0', buy: 'Tracht anprobieren',
  wall: (c) => { for (let k = 0; k < 4; k++) { const px = 5 * 16 + k * 18, py = 18; R(c, px, py + 8, 14, 2, '#3f5a3b'); R(c, px + 3, py + 2, 8, 6, '#3f5a3b'); R(c, px + 3, py + 6, 8, 1, '#c23a2a'); line(c, px + 11, py + 7, px + 13, py + 1, '#1d1d1d'); } },
  build: (m, h) => {
    h.counter(7, 6, 4, { top: '#7a4a2a', front: '#4a2c18' }); h.keeper(8, 5);
    const mann = (x, y, hose) => mkObj(x, y, 1, 1, 22, (c, W, H) => { R(c, 6, H - 4, 4, 3, '#5a3a24'); R(c, 7, 8, 2, H - 12, '#c9b89a'); R(c, 4, 6, 8, 8, hose ? '#e8e0d0' : '#c23a2a'); R(c, 4, 14, 8, 6, hose ? '#6b4423' : '#3f5a3b'); R(c, 5, 8, 1, 6, '#6b4423'); R(c, 10, 8, 1, 6, '#6b4423'); E(c, 8, 4, 3, 3, '#e8d8c0'); }, { solid: true });
    m.add(mann(2, 4, true)); m.add(mann(4, 4, false)); m.add(mann(2, 7, true));
    m.add(mkObj(9, 3, 2, 1, 26, (c, W, H) => { R(c, 0, 0, W, 3, '#5a3a24'); for (let k = 0; k < W; k += 4) R(c, k, 3, 3, H - 4, k % 8 ? '#7a2a2a' : '#8a3a3a'); }, { solid: true }));
    m.trig(9, 3, 2, 1, { label: 'Umkleide', act: () => Story.wardrobe() });
    h.shelf(5, 3, 3, ['#6b4423', '#3f5a3b', '#f1eee4', '#c23a2a']);
    m.add(objPlant(10, 8)); h.door(5);
  } });
/* Souvenirs: Mitteltisch mit Schneekugeln, Postkartenständer */
shopInterior('souvenir', { name: 'Souvenirs Dachl', w: 12, h: 9, keeper: 'Verkäuferin Anna', seed: 993, look: { hair: 16, hairCol: 5, beard: 0, top: 4, topCol: 0 }, floor: T.WOOD, cap: '#5a2a2a', signCol: '#ffd27a', buy: 'Andenken kaufen',
  wall: (c) => { for (let k = 0; k < 5; k++) { const px = 5 * 16 + k * 16; E(c, px + 6, 26, 5, 5, '#c8e8f8'); R(c, px + 4, 28, 4, 2, '#e8b830'); R(c, px + 2, 31, 8, 3, '#5a3a24'); } },
  build: (m, h) => {
    h.counter(8, 3, 3, { top: '#7a4a2a', front: '#4a2c18' }); h.keeper(9, 2);
    m.add(mkObj(4, 5, 4, 2, 10, (c, W, H) => { R(c, 0, 8, W, H - 10, '#7a4a2a'); R(c, 0, 8, W, 2, '#9a6a4a'); R(c, 0, H - 2, W, 2, '#4a2c18'); for (let k = 0; k < 5; k++) { E(c, 8 + k * 12, 5, 4, 4, '#c8e8f8'); R(c, 6 + k * 12, 8, 4, 2, '#e8b830'); } for (let k = 0; k < 4; k++) R(c, 6 + k * 14, 14, 10, 6, ['#c8352d', '#2f5fb8', '#e8b830', '#f4f0e6'][k]); }, { solid: true }));
    m.add(mkObj(1, 3, 1, 1, 22, (c, W, H) => { R(c, 6, 0, 4, H - 2, '#8a8e94'); for (let k = 0; k < 4; k++) { R(c, 1, 2 + k * 6, 6, 5, k % 2 ? '#7ab0f0' : '#e8d8b0'); R(c, 9, 2 + k * 6, 6, 5, k % 2 ? '#e8d8b0' : '#7ab0f0'); } }, { solid: true }));
    h.shelf(1, 6, 2, ['#e8b830', '#c8352d', '#f4f0e6', '#2f5fb8']);
    m.add(objPlant(10, 7)); h.door(5);
  } });
/* Apotheke: weiss, grünes Kreuz, breite Theke, Plakat */
shopInterior('apotheke', { name: 'Apotheke', w: 12, h: 9, keeper: 'Apothekerin Dr. Steiner', seed: 994, look: { hair: 9, hairCol: 9, beard: 0, glasses: 7, top: 9, topCol: 13, pants: 5, pantsCol: 10 }, floor: T.STONE, floorV: 1, cap: '#2a4a3a', style: 5, signCol: '#6fe08a', buy: 'Beraten lassen und kaufen',
  wall: (c) => { R(c, 8 * 16 + 2, 18, 12, 12, '#3f8e4b'); R(c, 8 * 16 + 6, 20, 4, 8, '#ffffff'); R(c, 8 * 16 + 4, 22, 8, 4, '#ffffff'); R(c, 4 * 16, 18, 22, 14, '#ffffff'); R(c, 4 * 16 + 2, 20, 18, 4, '#3f8e4b'); R(c, 4 * 16 + 2, 26, 18, 1, '#2f5fb8'); R(c, 4 * 16 + 2, 28, 12, 1, '#2f5fb8'); },
  build: (m, h) => {
    h.counter(4, 4, 6, { top: '#f4f4f0', front: '#3f8e4b', reg: true }); h.keeper(7, 3);
    h.shelf(1, 3, 2, ['#ffffff', '#3f8e4b', '#c8352d', '#2f5fb8'], '#e8e8e4'); h.shelf(1, 6, 2, ['#ffffff', '#ffffff', '#c8352d', '#3f8e4b'], '#e8e8e4');
    h.shelf(10, 3, 1, ['#ffffff', '#2f5fb8'], '#e8e8e4');
    m.add(objBench(8, 6, 0, '#c9ccd2')); m.add(objPlant(10, 7)); h.door(5);
  } });
/* Supermarkt: drei Gänge, Kühlwand, Kasse beim Ausgang */
shopInterior('spar', { name: 'Supermarkt', w: 16, h: 11, keeper: 'Kassierer Ali', seed: 995, look: { hair: 2, hairCol: 0, beard: 1, top: 2, topCol: 0, pants: 0 }, floor: T.STONE, floorV: 0, cap: '#4a2a2a', signCol: '#ff8a7a', buy: 'An die Kasse',
  build: (m, h) => {
    const g = ['#e8c23a', '#3f8e4b', '#c8352d', '#2f5fb8', '#f4f0e6', '#ff7a2a'];
    for (const y of [3, 5, 7]) h.shelf(2, y, 7, g, y === 5 ? '#8a9096' : '#5a3a24');
    m.add(mkObj(13, 3, 2, 4, 18, (c, W, H) => { R(c, 0, 0, W, H - 1, '#c9ccd2'); R(c, 2, 2, W - 4, H - 6, '#7fb4e2'); for (let y = 5; y < H - 8; y += 6) for (let x = 4; x < W - 6; x += 7) R(c, x, y, 5, 4, ['#f4f0e6', '#e8c23a', '#3f8e4b', '#c8352d'][(x + y) % 4]); R(c, W / 2 - 1, 2, 2, H - 6, '#9fc8e8'); }, { solid: true }));
    h.counter(10, 8, 3, { top: '#c9ccd2', front: '#c8352d', reg: true }); h.keeper(11, 7);
    m.add(mkObj(1, 8, 1, 1, 12, (c, W, H) => { R(c, 2, 2, 12, H - 4, '#2f5fb8'); R(c, 3, 3, 10, 2, '#7ab0f0'); R(c, 3, 8, 10, 1, '#1a1a1e'); }, { solid: true }));
    h.door(7);
  } });
/* Trafik: winzig, Zeitungsständer, Lotto-Plakat, Theke direkt vor dir */
shopInterior('trafik', { name: 'Trafik', w: 9, h: 7, keeper: 'Trafikantin Gerti', seed: 996, look: { hair: 12, hairCol: 9, beard: 0, glasses: 7, top: 4, topCol: 11 }, floor: T.WOOD, cap: '#5a4a2a', signCol: '#ffd27a', buy: 'Zeitung, Tabak und mehr',
  wall: (c) => { for (let k = 0; k < 4; k++) { R(c, 16 + k * 9, 34, 7, 10, k % 2 ? '#f4f0e6' : '#e8e4dc'); R(c, 18 + k * 9, 36, 3, 1, '#1a1a1a'); } R(c, 6 * 16 + 6, 18, 20, 12, '#e8c23a'); pxText(c, 'LOTTO', 6 * 16 + 7, 21, '#c8352d'); },
  build: (m, h) => {
    h.counter(2, 3, 5, { top: '#7a4a2a', front: '#4a2c18', reg: true }); h.keeper(4, 2);
    m.add(mkObj(1, 4, 1, 1, 22, (c, W, H) => { R(c, 6, 0, 4, H - 2, '#8a8e94'); for (let k = 0; k < 4; k++) { R(c, 1, 2 + k * 6, 6, 5, '#f4f0e6'); R(c, 9, 2 + k * 6, 6, 5, '#e8e4dc'); R(c, 2, 3 + k * 6, 4, 1, '#1a1a1a'); } }, { solid: true }));
    m.add(objPlant(7, 5)); h.door(4);
  } });
/* Konditorei: Vitrine mit Torten, runde Tische, Fenster */
shopInterior('cafe', { name: 'Café Konditorei', sign: 'Cafe Konditorei', w: 13, h: 10, keeper: 'Konditorin Rosa', seed: 997, look: { hair: 9, hairCol: 1, beard: 0, top: 4, topCol: 12, hat: 0 }, floor: T.WOOD, floorV: 1, cap: '#5a2a2a', signCol: '#f8e8c8', buy: 'Kaffee und Mehlspeisen',
  wall: (c) => { DECAL.window(c, 8 * 16 + 4, 18, 28, 12); for (let k = 0; k < 2; k++) DECAL.picture(c, 2 * 16 + 4 + k * 16, 33, k ? '#c8a060' : '#6a8ab0'); },
  build: (m, h) => {
    m.add(mkObj(2, 3, 5, 1, 14, (c, W, H) => { R(c, 0, 4, W, H - 4, '#f4f4f0'); R(c, 0, 4, W, 1, '#c9ccd2'); R(c, 2, 6, W - 4, 6, '#d8ecf8'); for (let k = 0; k < 6; k++) R(c, 4 + k * 13, 7, 9, 4, ['#5a3420', '#e8c23a', '#f4e0c0', '#c8302a', '#8a4a2a', '#f4f0e6'][k]); R(c, 0, H - 3, W, 3, '#7a2a2a'); }, { solid: true }));
    m.trig(2, 3, 5, 1, { label: 'Vitrine: Kaffee und Mehlspeisen', act: () => Story.shop('cafe') });
    h.counter(8, 3, 3, { top: '#d9dcdf', front: '#7a2a2a', coffee: true, reg: false }); h.keeper(9, 2);
    for (const [x, y] of [[2, 6], [6, 6], [10, 6]]) { m.add(objTable(x, y, 1, 1, { col: '#f4f0e6', round: true })); m.add(objStool(x - 1, y, '#7a2a2a')); m.add(objStool(x + 1, y, '#7a2a2a')); }
    m.add(objPlant(11, 8)); h.door(5);
  } });
/* Kleiderstange mit Jacken in Farben */
function rackRow(x, y, w, cols) {
  return mkObj(x, y, w, 1, 20, (c, W, H) => { R(c, 1, 0, W - 2, 2, '#8a8e94'); R(c, 1, H - 4, 2, 4, '#5a5e64'); R(c, W - 3, H - 4, 2, 4, '#5a5e64'); for (let k = 0; k < Math.floor((W - 4) / 5); k++) { const col = cols[k % cols.length]; R(c, 3 + k * 5, 2, 1, 2, '#c9ccd2'); R(c, 2 + k * 5, 4, 4, 11, col); R(c, 2 + k * 5, 4, 1, 11, shade(col, -0.25)); R(c, 3 + k * 5, 5, 2, 1, shade(col, 0.3)); } }, { solid: true });
}
/* Schaufensterpuppe in frei wählbaren Farben (Oberteil, Hose, Kopfbedeckung) */
function dummy(x, y, top, pants, hat) {
  return mkObj(x, y, 1, 1, 22, (c, W, H) => { R(c, 6, H - 4, 4, 3, '#5a3a24'); R(c, 7, 8, 2, H - 12, '#c9b89a'); R(c, 4, 6, 8, 8, top); R(c, 4, 14, 8, 6, pants); R(c, 5, 8, 1, 6, shade(top, -0.3)); R(c, 10, 8, 1, 6, shade(top, -0.3)); E(c, 8, 4, 3, 3, '#e8d8c0'); if (hat) { R(c, 4, 0, 8, 2, hat); R(c, 5, 2, 6, 1, hat); } }, { solid: true });
}
/* Mode Alpin: Jackenstangen, Mützenregal, Umkleide */
shopInterior('mode', { name: 'Mode Alpin', w: 12, h: 9, keeper: 'Verkäuferin Lena', seed: 1001, look: { hair: 10, hairCol: 5, beard: 0, top: 3, topCol: 2, hat: 3, hatCol: 7 }, floor: T.STONE, cap: '#1f6f73', signCol: '#9fe0e0', buy: 'Outfit kaufen', bubble: ['dots', 'heart'],
  wall: (c) => { for (let k = 0; k < 6; k++) { const px = 6 * 16 + k * 14, col = ['#e27c2c', '#2f5fb8', '#efede6', '#3f8e4b', '#e3589c', '#212125'][k]; R(c, px, 34, 10, 5, col); R(c, px + 1, 32, 8, 2, shade(col, 0.3)); R(c, px + 4, 30, 2, 2, shade(col, 0.3)); } },
  build: (m, h) => {
    h.counter(8, 6, 3, { top: '#c9ccd2', front: '#1f6f73' }); h.keeper(9, 5);
    m.add(rackRow(1, 3, 5, ['#e27c2c', '#2f5fb8', '#efede6', '#c8352d'])); m.add(rackRow(1, 6, 4, ['#3f8e4b', '#212125', '#e3589c', '#7fb4e2']));
    m.add(dummy(7, 3, '#e27c2c', '#45474d', '#e07b25')); m.add(dummy(9, 3, '#2f5fb8', '#38558a', '#22345e'));
    m.add(mkObj(10, 7, 1, 1, 24, (c, W, H) => { R(c, 2, 0, 12, H - 2, '#7a2a2a'); for (let k = 0; k < 4; k++) R(c, 3 + k * 3, 2, 2, H - 6, k % 2 ? '#8a3a3a' : '#7a2a2a'); R(c, 2, 0, 12, 2, '#5a5e64'); }, { solid: true }));
    m.trig(10, 7, 1, 1, { label: 'Umkleide', act: () => Story.wardrobe() });
    m.add(objPlant(1, 8)); h.door(5);
  } });
/* Boutique Maximilian: Teppich, Anzug-Puppen, Spiegelwand, Schuhregal */
shopInterior('boutique', { name: 'Boutique Maximilian', w: 12, h: 9, keeper: 'Herr Maximilian', seed: 1002, look: { hair: 3, hairCol: 9, beard: 2, beardCol: 9, top: 9, topCol: 16, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1, glasses: 7 }, floor: T.CARPET, cap: '#1a1a22', signCol: '#e8c870', buy: 'Beraten lassen', bubble: ['dots'],
  wall: (c) => { for (let k = 0; k < 3; k++) { R(c, 2 * 16 + k * 36, 30, 30, 16, '#8a9096'); R(c, 2 * 16 + 1 + k * 36, 31, 28, 14, '#c8e0f0'); R(c, 2 * 16 + 3 + k * 36, 33, 10, 10, 'rgba(255,255,255,0.35)'); } },
  build: (m, h) => {
    h.counter(7, 6, 4, { top: '#1a1a22', front: '#2a2a34', reg: true }); h.keeper(8, 5);
    m.add(dummy(2, 3, '#23325a', '#222226', 0)); m.add(dummy(4, 3, '#efede6', '#cdb48c', 0)); m.add(dummy(6, 3, '#212125', '#222226', 0));
    m.add(mkObj(9, 3, 2, 1, 22, (c, W, H) => { R(c, 0, 0, W, H - 1, '#3a2a1a'); for (let row = 0; row < 3; row++) { R(c, 1, 2 + row * 7, W - 2, 1, '#8a6a3a'); for (let k = 0; k < 4; k++) R(c, 2 + k * 7, 3 + row * 7, 5, 3, ['#1f1f23', '#6e4527', '#85878c', '#efede8'][(k + row) % 4]); } }, { solid: true }));
    m.add(objSofa(1, 7, 2, '#3a2a3a', 0)); m.add(objTable(3, 7, 1, 1, { col: '#1a1a22', round: true, items: 1 }));
    m.add(mkObj(10, 7, 1, 1, 24, (c, W, H) => { R(c, 2, 0, 12, H - 2, '#2a2a34'); for (let k = 0; k < 4; k++) R(c, 3 + k * 3, 2, 2, H - 6, k % 2 ? '#3a3a48' : '#2a2a34'); R(c, 2, 0, 12, 2, '#e8c870'); }, { solid: true }));
    m.trig(10, 7, 1, 1, { label: 'Umkleide', act: () => Story.wardrobe() });
    h.door(5);
  } });
/* Maskerade: Masken an der Wand, bunte Kostümstange, Pirat und Dino als Puppen, Spiegel, Umkleide */
shopInterior('kostuem', { name: 'Maskerade', w: 13, h: 10, keeper: 'Verkäufer Fredl', seed: 1003, look: { hair: 6, hairCol: 13, beard: 5, beardCol: 0, top: 0, topCol: 11, print: 1, hat: 0, glasses: 0 }, floor: T.WOOD, floorV: 1, cap: '#4a2a6c', signCol: '#ffd23d', buy: 'Kostüm leihen', bubble: ['!', 'note', 'dots'],
  wall: (c) => { for (let k = 0; k < 7; k++) { const px = 16 + k * 22 + (k > 2 ? 40 : 0), col = ['#ffd23d', '#e3589c', '#3f8e4b', '#c8352d', '#7fb4e2', '#efede6', '#e27c2c'][k]; if (px > 12 * 16) break; E(c, px + 7, 38, 7, 8, col); R(c, px + 3, 35, 3, 2, '#1a1a1e'); R(c, px + 8, 35, 3, 2, '#1a1a1e'); R(c, px + 5, 40, 4, 1, '#1a1a1e'); if (k % 2) R(c, px + 2, 30, 10, 2, shade(col, -0.3)); } },
  build: (m, h) => {
    h.counter(9, 6, 3, { top: '#4a2a6c', front: '#2a1a3c', reg: true }); h.keeper(10, 5);
    m.add(rackRow(1, 3, 6, ['#c8352d', '#1c1c24', '#7a4a28', '#f4f0e6', '#3f8e4b', '#2f5fb8', '#9aa0a8', '#6b4a2e']));
    m.add(dummy(8, 3, '#c8352d', '#222226', '#232327')); m.add(dummy(10, 3, '#3f8e4b', '#3f8e4b', '#2f6a38'));
    m.add(mkObj(1, 6, 2, 1, 22, (c, W, H) => { R(c, 0, 0, W, H - 1, '#8a9096'); R(c, 1, 1, W - 2, H - 3, '#c8e0f0'); R(c, 3, 3, 8, 10, 'rgba(255,255,255,0.35)'); R(c, 0, 0, W, 2, '#ffd23d'); for (let k = 2; k < W; k += 6) P(c, k, 1, '#fff8c0'); }, { solid: true }));
    m.add(mkObj(11, 7, 1, 1, 24, (c, W, H) => { R(c, 2, 0, 12, H - 2, '#6a4a9c'); for (let k = 0; k < 4; k++) R(c, 3 + k * 3, 2, 2, H - 6, k % 2 ? '#7a5aac' : '#6a4a9c'); R(c, 2, 0, 12, 2, '#ffd23d'); }, { solid: true }));
    m.trig(11, 7, 1, 1, { label: 'Umkleide', act: () => Story.wardrobe() });
    m.add(mkObj(4, 7, 2, 1, 10, (c, W, H) => { R(c, 0, 2, W, H - 3, '#5a3a24'); R(c, 0, 2, W, 1, '#7a5a3a'); for (let k = 0; k < 5; k++) R(c, 2 + k * 6, 4, 4, 3, ['#ffd23d', '#e3589c', '#7fb4e2', '#c8352d', '#3f8e4b'][k]); E(c, 8, 0, 4, 2, '#1a1a1e'); E(c, 22, 0, 4, 2, '#e3589c'); }, { solid: true }));
    m.add(objPlant(1, 8)); h.door(6);
  } });
/* Coiffeur: drei Sessel mit Spiegeln, drehender Pole, Wartebank */
shopInterior('barbier', { name: 'Friseur & Barbier', w: 14, h: 9, keeper: 'Barbier Mehmet', seed: 998, look: { hair: 4, hairCol: 0, beard: 7, beardCol: 0, top: 1, topCol: 16, pants: 5, pantsCol: 2, acc: 0 }, floor: T.STONE, floorV: 1, cap: '#1a1a22', signCol: '#ffd27a', buy: 'Termin: Haare oder Bart', bubble: ['note', 'dots'],
  wall: (c) => { for (const x of [2, 5, 8]) { R(c, x * 16 + 2, 33, 28, 14, '#8a9096'); R(c, x * 16 + 3, 34, 26, 12, '#c8e0f0'); R(c, x * 16 + 5, 36, 8, 8, 'rgba(255,255,255,0.35)'); } },
  build: (m, h) => {
    const chair = (x) => mkObj(x, 4, 2, 1, 14, (c, W, H) => { R(c, 6, 0, 20, 14, '#c8302a'); R(c, 8, 2, 16, 10, '#e04a3a'); R(c, 4, 14, 24, 6, '#c8302a'); R(c, 12, 20, 8, 6, '#8a8e94'); R(c, 8, 26, 16, 2, '#5a5e64'); R(c, 2, 12, 4, 4, '#8a8e94'); R(c, 26, 12, 4, 4, '#8a8e94'); }, { solid: true });
    for (const x of [2, 5, 8]) { m.add(chair(x)); m.trig(x, 4, 2, 1, { label: 'Barbierstuhl', act: () => Story.shop('barbier') }); }
    h.counter(11, 4, 2, { top: '#2a2a2e', front: '#1a1a1e', reg: true }); h.keeper(11, 3);
    const pole = mkObj(12, 7, 1, 1, 22, (c, W, H) => { R(c, 6, 0, 4, H, '#c9ccd2'); }, { solid: true });
    pole.anim = (c, t, px, py) => { c.save(); c.beginPath(); c.rect(px + 6, py + 2, 4, 18); c.clip(); for (let k = -2; k < 8; k++) { const y = py + 2 + ((k * 6 + t * 18) % 24); R(c, px + 6, y, 4, 3, k % 2 ? '#c8302a' : '#2f5fb8'); } c.restore(); };
    m.add(pole);
    m.add(objBench(1, 7, 0, '#3a3c40')); m.add(objTable(3, 7, 1, 1, { col: '#3a3c40', round: true, items: 1 }));
    h.door(6);
  } });
MAP_BUILDERS.ibk = () => {
  const W = 96, H = 90;
  const m = new GMap('ibk', W, H, { name: 'Innsbruck', city: 'ibk', bg: '#2f4a2a' });
  m.fill(0, 0, W, H, T.COBBLE, 0);
  /* Nordkette */
  m.add(objMountains(0, 0, W, 10, { drawH: 0, village: true, cable: true, seed: 3 }));
  m.fill(0, 0, W, 10, T.FOREST);
  /* Mariahilf */
  m.fill(0, 10, W, 6, T.COBBLE, 2);
  const mh = [[1, 5], [6, 5], [11, 4], [15, 5], [20, 4], [24, 4], [33, 5], [38, 5], [43, 4], [47, 5], [52, 5], [57, 4], [61, 5], [66, 3], [74, 5], [79, 5], [84, 5], [89, 6]];
  mh.forEach(([x, w], i) => house(m, x, 10, w, 6, i + 2, { floors: 4, drawH: 8, flowers: true }));
  m.fill(0, 16, W, 1, T.COBBLE, 2); m.fill(0, 17, W, 1, T.PAVE);
  for (const x of [4, 14, 24, 40, 52, 62, 78, 90]) m.add(objLamp(x, 17));
  /* Inn */
  m.fill(0, 18, W, 6, T.WATER);
  m.fill(29, 18, 3, 6, T.BRIDGE);
  m.fill(28, 18, 1, 6, T.BRIDGE); m.fill(32, 18, 1, 6, T.BRIDGE); m.solid(28, 18, 1, 6); m.solid(32, 18, 1, 6);
  m.fill(71, 18, 1, 6, T.BRIDGE, 1); m.fill(70, 18, 1, 6, T.BRIDGE, 1); m.fill(72, 18, 1, 6, T.BRIDGE, 1); m.solid(70, 18, 1, 6); m.solid(72, 18, 1, 6);
  const rail = (x, y, h, wood) => m.add(mkObj(x, y, 1, h, 8, (c, Wd, Hd) => {
    const col = wood ? '#5a5e64' : '#c9c2b4';
    R(c, 6, 0, 4, Hd, wood ? 'rgba(0,0,0,0)' : shade(col, -0.2));
    for (let yy = 4; yy < Hd; yy += 5) R(c, 5, yy, 6, 3, col);
    R(c, 4, 0, 8, 3, shade(col, 0.15)); R(c, 6, 0, 1, Hd, shade(col, 0.2)); R(c, 9, 0, 1, Hd, shade(col, -0.3));
  }, { solid: true }));
  rail(28, 18, 6); rail(32, 18, 6); rail(70, 18, 6, true); rail(72, 18, 6, true);
  m.add(objLamp(28, 17)); m.add(objLamp(32, 17)); m.add(objLamp(28, 24)); m.add(objLamp(32, 24));
  m.trig(29, 19, 3, 3, { here: true, label: 'Foto: Innbrücke', act: () => Story.photo('innbruecke'), cond: () => !G.S.photos.innbruecke });
  m.birdSpots.push({ x: 38, y: 19, w: 26, h: 3, n: 6, kind: 'duck' });
  /* Südufer */
  m.fill(0, 24, W, 2, T.PAVE);
  for (const x of [4, 20, 36, 52, 66, 84]) m.add(objLamp(x, 25));
  for (const x of [12, 44, 58, 88]) m.add(objBench(x, 25, 0));
  m.trig(8, 24, 18, 1, { here: true, label: 'Foto: Bunte Häuser am Inn', act: () => Story.photo('mariahilf'), cond: () => !G.S.photos.mariahilf });
  m.trig(38, 24, 5, 1, { here: true, label: 'Steine flitschen', act: () => Story.stones() });
  m.trig(46, 24, 10, 1, { here: true, label: 'Steine flitschen', act: () => Story.stones() });
  /* Strasse am Inn */
  m.fill(0, 26, W, 3, T.ASPH); m.fill(0, 27, W, 1, T.ASPH, 1);
  m.fill(29, 26, 3, 3, T.ZEBRA); m.fill(70, 26, 3, 3, T.ZEBRA);
  m.fill(0, 29, W, 1, T.PAVE);
  /* Reihe Nord */
  house(m, 1, 30, 5, 6, 1); house(m, 6, 30, 5, 6, 4); house(m, 11, 30, 5, 6, 7);
  house(m, 16, 30, 6, 6, 2, { erker: [2, 2] }); house(m, 22, 30, 5, 6, 5, { wall: '#e9d7b4', floors: 4 }); house(m, 27, 30, 4, 6, 8);
  const dachl = objBuilding(31, 30, 7, 6, {
    floors: 4, wall: '#ede0c4', roof: '#7a4a3a', trim: '#f8f2e4', seed: 77, erker: [2, 3], erkerCol: '#f2e8d0', erkerRoof: ['#e8b830', '#f8d860', '#fff4b0'], reliefs: true, flowers: false, drawH: 12,
    doors: [{ dx: 0, type: 'arch' }, { dx: 6, type: 'arch' }], arcade: true,
  });
  m.add(dachl);
  dachl.anim = (c, t, px, py) => { const g = (t * 0.6) % 1; if (g < 0.35) { const gx = px + 2 * 16 + 4 + g / 0.35 * 40; R(c, gx, py + 12 + 6 + 14, 2, 1, '#ffffff'); P(c, gx + 1, py + 12 + 5 + 14, '#fff7c8'); } };
  m.trig(31, 36, 7, 2, { here: true, label: 'Foto: Goldenes Dachl', act: () => Story.photo('dachl'), cond: () => !G.S.photos.dachl });
  shopHouse(m, 38, 30, 3, 6, 9, { text: 'CAFÉ', bg: '#5a3a24', fg: '#f8e8c8', label: 'Café Konditorei' }, 1, 'cafe', { awning: { cols: [0, 2], col: '#7a2a2a' } });
  const dom = mkObj(41, 29, 10, 7, 46, (c, Wd, Hd) => paintDom(c, Wd, Hd));
  m.add(dom);
  m.trig(41, 36, 10, 2, { here: true, label: 'Foto: Dom St. Jakob', act: () => Story.photo('dom'), cond: () => !G.S.photos.dom });
  m.trig(45, 35, 2, 1, { label: 'Dom St. Jakob', act: () => Story.say(null, 'Im Dom ist es still und kühl. Über dem Hochaltar hängt das Mariahilf-Bild von Cranach. Du zündest eine Kerze an.').then(() => mood(3)) });
  house(m, 51, 30, 3, 6, 3);
  const hofburg = objBuilding(54, 30, 18, 7, { floors: 4, wall: '#efd690', roof: '#6f7c7a', roofType: 'copper', trim: '#fbf4dc', seed: 55, wins: 'tall', lintel: true, flowers: false, drawH: 10, corner: true,
    doors: [{ dx: 8, type: 'arch' }, { dx: 9, type: 'arch' }],
    special: (c, Wd, Hd, fy0) => { const x0 = 6 * 16, w = 6 * 16; R(c, x0, fy0 - 10, w, 12, '#efd690'); for (let k = 0; k < 10; k++) R(c, x0 + w / 2 - k * 4.5, fy0 - 10 + k, k * 9, 1, '#e4c878'); E(c, x0 + w / 2, fy0 - 3, 4, 4, '#c9a65a'); for (let xx = x0 + 4; xx < x0 + w; xx += 12) R(c, xx, fy0, 2, Hd - fy0 - 3, '#fbf4dc'); } });
  m.add(hofburg);
  m.trig(54, 37, 18, 2, { here: true, label: 'Foto: Hofburg', act: () => Story.photo('hofburg'), cond: () => !G.S.photos.hofburg });
  m.trig(62, 36, 2, 1, { label: 'Hofburg besichtigen', act: () => Story.museum('hofburg') });
  /* Hungerburgbahn Congress */
  m.fill(73, 29, 23, 5, T.GRASS, 2);
  m.fill(73, 33, 9, 1, T.PLAZA);
  const hbb = mkObj(74, 29, 7, 4, 14, (c, Wd, Hd) => {
    R(c, 6, 20, Wd - 12, Hd - 22, '#3a4450'); R(c, 8, 22, Wd - 16, Hd - 26, '#7a96ac');
    for (let xx = 0; xx < Wd; xx++) { const y = 6 + Math.sin(xx / Wd * Math.PI) * -6 + Math.sin(xx * 0.09) * 3; R(c, xx, y + 4, 1, 16 - Math.abs(Math.sin(xx * 0.05)) * 6, '#f4f6f8'); P(c, xx, y + 4, '#ffffff'); R(c, xx, y + 18 - Math.abs(Math.sin(xx * 0.05)) * 6, 1, 2, '#c9d4dc'); }
    pxText(c, 'NORDKETTENBAHN', Wd / 2 - 27, Hd - 9, '#ffffff');
  });
  m.add(hbb);
  m.trig(76, 32, 3, 1, { label: 'Nordkettenbahn zur Seegrube', act: () => Story.cableCar() });
  /* Breites Altstadt-Band */
  m.fill(0, 36, 16, 5, T.COBBLE, 0); m.fill(16, 36, 38, 5, T.COBBLE, 1); m.fill(54, 36, 19, 5, T.PLAZA, 1);
  m.add(objStadtturm(23, 37));
  m.trig(24, 39, 1, 1, { label: 'Stadtturm besteigen', act: () => Story.tower() });
  m.trig(22, 40, 5, 1, { here: true, label: 'Foto: Stadtturm', act: () => Story.photo('stadtturm'), cond: () => !G.S.photos.stadtturm });
  const ft = m.add(objFountain(60, 37));
  m.trig(60, 37, 4, 3, { label: 'Leopoldsbrunnen', act: () => Story.fountain() });
  m.trig(59, 40, 6, 1, { here: true, label: 'Foto: Leopoldsbrunnen', act: () => Story.photo('leopold'), cond: () => !G.S.photos.leopold });
  m.add(objFiaker(66, 38));
  m.trig(66, 38, 4, 2, { label: 'Fiaker', act: () => Story.fiaker() });
  m.add(objTrinkbrunnen(40, 38)); m.trig(40, 38, 1, 1, { label: 'Trinkbrunnen', act: () => Story.drinkFountain() });
  for (const x of [18, 29, 37, 53, 57, 71]) m.add(objLamp(x, 40));
  for (const [x, y, k] of [[55, 39, 'autumn'], [72, 39, 'yellow']]) m.add(objTree(x, y, k));
  m.add(objBench(48, 39, 0)); m.add(objLitfass(14, 37)); m.add(objPlanter(20, 36)); m.add(objPlanter(38, 36, '#e86ab0'));
  m.birdSpots.push({ x: 26, y: 37, w: 8, h: 3, n: 9 });
  m.light(61 * 16 + 16, 38 * 16, 40, '#9ad0ff');
  for (const [x, col] of [[71, '#ff5af0'], [65, '#5ae0ff'], [77, '#ffc040']]) m.light(x * 16 + 8, 61 * 16, 44, col);
  /* Reihe Mitte */
  shopHouse(m, 1, 41, 6, 6, 3, { text: 'SPORT GIPFEL', bg: '#2f5fb8', fg: '#ffffff', label: 'Sport Gipfel' }, 2, 'sport', { goods: ['#c8352d', '#2f5fb8', '#e8c23a', '#3f8e4b'], awning: { cols: [0, 1, 3, 4, 5], col: '#2f5fb8' } });
  shopHouse(m, 7, 41, 5, 6, 8, { text: 'TRACHTEN', bg: '#3f5a3b', fg: '#f4e8c8', label: 'Trachten Holzer' }, 2, 'tracht', { goods: ['#6b4423', '#3f5a3b', '#f1eee4', '#c23a2a'], hang: { dx: 4, icon: 'hat', side: 'r' } });
  house(m, 12, 41, 4, 6, 6);
  const hotel = house(m, 16, 41, 7, 6, 5, { wall: '#e7d2a6', roof: '#7a4a3a', floors: 4, shutter: '#3f6b45', doors: [{ dx: 3, col: '#5a3a24', lit: true }], sign: { text: 'HOTEL ZIRBE', bg: '#3f5a3b', fg: '#f4e8c8', lit: true }, hang: { dx: 5, icon: 'bed', side: 'r' }, erker: [1, 1] });
  m.warp(19, 46, 'hotel_lobby', 'entry', { label: 'Hotel Zirbe' });
  m.add(objPlanter(18, 47)); m.add(objPlanter(20, 47, '#e86ab0'));
  house(m, 23, 41, 5, 6, 9, { wall: '#d8c09a', doors: [{ dx: 2, col: '#4a2e1a', lit: true }], sign: { text: 'STÜBERL', bg: '#5a3a24', fg: '#f8e8c8', lit: true }, hang: { dx: 4, icon: 'beer', side: 'r' }, wins: 'arch' });
  m.warp(25, 46, 'stueberl', 'entry', { label: 'Tiroler Stüberl', guard: () => Story.openGuard('stueberl') });
  shopHouse(m, 28, 41, 4, 6, 4, { text: 'SOUVENIRS', bg: '#c8352d', fg: '#ffffff', label: 'Souvenirladen' }, 1, 'souvenir', { goods: ['#e8b830', '#c8352d', '#f4f0e6', '#2f5fb8'] });
  m.fill(32, 41, 4, 14, T.COBBLE, 1);
  house(m, 36, 41, 5, 6, 6, { arcade: true }); house(m, 41, 41, 6, 6, 1, { arcade: true, erker: [2, 2] }); house(m, 47, 41, 7, 6, 2, { arcade: true });
  const theater = objBuilding(54, 41, 11, 6, { floors: 3, wall: '#efe6d2', roof: '#6f7c7a', roofType: 'copper', trim: '#ffffff', seed: 13, flowers: false, wins: 'tall', drawH: 8, doors: [{ dx: 5, col: '#5a3a24' }],
    special: (c, Wd, Hd) => { const x0 = 3 * 16, w = 5 * 16; R(c, x0, Hd - 52, w, 6, '#ffffff'); for (let k = 0; k < 8; k++) R(c, x0 + w / 2 - k * 5, Hd - 60 + k, k * 10, 1, '#f4f0e6'); for (let xx = x0 + 3; xx < x0 + w; xx += 10) { R(c, xx, Hd - 46, 4, 43, '#f8f4ea'); R(c, xx + 3, Hd - 46, 1, 43, '#c9c2b4'); } pxText(c, 'THEATER', x0 + w / 2 - 13, Hd - 51, '#7a6e58'); } });
  m.add(theater);
  m.trig(59, 46, 1, 1, { label: 'Landestheater', act: () => Story.say(null, 'Heute Abend: „Der Bockerer“. Ausverkauft. Vielleicht ein andermal.') });
  house(m, 65, 41, 8, 6, 7);
  /* Hofgarten */
  m.fill(73, 34, 23, 21, T.GRASS, 2);
  for (let y = 34; y < 55; y++) { m.set(73, y, T.HEDGE); }
  m.fill(73, 37, 1, 3, T.GRAVEL); m.fill(73, 47, 1, 2, T.GRAVEL);
  m.fill(74, 38, 22, 1, T.GRAVEL); m.fill(74, 47, 22, 1, T.GRAVEL); m.fill(84, 34, 1, 21, T.GRAVEL);
  m.fill(78, 41, 4, 4, T.WATER, 1); m.fill(87, 41, 6, 4, T.WATER, 1);
  m.birdSpots.push({ x: 87, y: 42, w: 5, h: 2, n: 4, kind: 'duck' });
  const trees = [[75, 35, 'autumn', 1], [80, 35, 'yellow', 1], [89, 35, 'red', 1], [93, 36, 'green', 1], [76, 44, 'yellow'], [82, 45, 'autumn'], [86, 40, 'green', 1], [92, 46, 'autumn', 1], [75, 50, 'red'], [80, 51, 'green', 1], [91, 51, 'yellow', 1], [94, 52, 'autumn'], [78, 53, 'green'], [91, 39, 'yellow']];
  for (const [x, y, k, b] of trees) m.add(objTree(x, y, k, !!b));
  for (const [x, y] of [[86, 37], [78, 46], [89, 46], [80, 48]]) m.add(objBench(x, y, 0));
  m.add(mkObj(85, 49, 4, 3, 22, (c, Wd, Hd) => { R(c, 4, Hd - 10, Wd - 8, 8, '#d8d0bc'); for (let xx = 6; xx < Wd - 6; xx += 9) R(c, xx, 14, 3, Hd - 24, '#f4f0e6'); for (let k = 0; k < 14; k++) R(c, Wd / 2 - k * 2.4, 2 + k, k * 4.8, 1, k % 2 ? '#5a7a6a' : '#4f6e5e'); pxText(c, 'PAVILLON', Wd / 2 - 15, Hd - 9, '#7a6e58'); }));
  m.trig(80, 38, 8, 1, { here: true, label: 'Foto: Hofgarten', act: () => Story.photo('hofgarten'), cond: () => !G.S.photos.hofgarten });
  m.trig(78, 40, 4, 6, { label: 'Enten füttern', act: () => Story.feedBirds('duck') });
  m.trig(87, 40, 6, 6, { label: 'Enten füttern', act: () => Story.feedBirds('duck') });
  m.light(80 * 16, 42 * 16, 36, '#9ad0ff');
  /* Gasse */
  m.fill(0, 47, 73, 2, T.COBBLE, 1);
  for (const x of [6, 22, 38, 52, 68]) m.add(objLamp(x, 48));
  /* Reihe Süd */
  house(m, 1, 49, 6, 6, 9); house(m, 7, 49, 5, 6, 3, { erker: [1, 2] }); house(m, 12, 49, 4, 6, 6); house(m, 16, 49, 6, 6, 1, { arcade: true });
  house(m, 22, 49, 5, 6, 8, { arcade: true }); house(m, 27, 49, 5, 6, 2, { arcade: true, erker: [2, 2] });
  house(m, 36, 49, 6, 6, 5, { arcade: true }); house(m, 42, 49, 6, 6, 4, { erker: [2, 2] }); house(m, 48, 49, 6, 6, 7);
  house(m, 54, 49, 7, 6, 0); house(m, 61, 49, 6, 6, 3); house(m, 67, 49, 6, 6, 8);
  m.add(objPlanter(32, 54)); m.add(objPlanter(35, 54, '#f2c23a'));
  /* Burggraben mit Tram */
  m.fill(0, 55, W, 3, T.ASPH); m.fill(0, 56, W, 1, T.TRAMR);
  m.fill(32, 55, 4, 1, T.ZEBRA); m.fill(32, 57, 4, 1, T.ZEBRA);
  /* Maria-Theresien-Strasse */
  m.fill(0, 58, 57, 26, T.COBBLE, 0);
  m.fill(30, 58, 12, 23, T.PLAZA);
  m.fill(0, 65, 30, 2, T.COBBLE, 1); m.fill(42, 65, 12, 2, T.COBBLE, 1); m.fill(0, 73, 30, 2, T.COBBLE, 1); m.fill(42, 73, 12, 2, T.COBBLE, 1);
  shopHouse(m, 1, 59, 7, 6, 2, { text: 'MODE ALPIN', bg: '#1f6f73', fg: '#ffffff', label: 'Mode Alpin' }, 3, 'mode', { goods: ['#e27c2c', '#2f5fb8', '#f4f0e6'] });
  shopHouse(m, 8, 59, 8, 6, 5, { text: 'BOUTIQUE MAXIMILIAN', bg: '#1a1a22', fg: '#e8c870', label: 'Boutique Maximilian' }, 3, 'boutique', { goods: ['#23325a', '#efede6', '#212125'], awning: { cols: [0, 1, 2, 4, 5, 6, 7], col: '#1a1a22' } });
  shopHouse(m, 16, 59, 7, 6, 1, { text: 'MASKERADE', bg: '#6a4a9c', fg: '#ffd23d', label: 'Kostümverleih Maskerade' }, 3, 'kostuem', { goods: ['#ffd23d', '#e3589c', '#3f8e4b', '#c8352d'] });
  house(m, 23, 59, 7, 6, 6, { erker: [2, 2] });
  const bar = house(m, 42, 59, 6, 6, 7, { wall: '#c9a27a', roof: '#5a3a2a', doors: [{ dx: 1, col: '#3a2418', lit: true }], sign: { text: 'GAMSBOCK BAR', bg: '#2a1a10', fg: '#ffb53d', lit: true, x: 22 }, hang: { dx: 0, icon: 'gams', side: 'l' }, shopWins: [3, 4, 5], goods: ['#e8b33a', '#c8352d', '#e8b33a'] });
  m.warp(43, 64, 'bar', 'entry', { label: 'Gamsbock Bar', guard: () => Story.openGuard('bar') });
  house(m, 48, 59, 6, 6, 0);
  house(m, 1, 67, 7, 6, 8); house(m, 8, 67, 8, 6, 3);
  shopHouse(m, 16, 67, 7, 6, 4, { text: 'APOTHEKE', bg: '#f4f2ec', fg: '#c8352d', label: 'Apotheke' }, 5, 'apotheke', { hang: { dx: 6, icon: 'apo', side: 'r' }, goods: ['#f4f2ec', '#3f8e4b', '#c8352d'] });
  shopHouse(m, 23, 67, 7, 6, 1, { text: 'SPAR', bg: '#d8302a', fg: '#ffffff', label: 'Supermarkt' }, 5, 'spar', { goods: ['#e8c23a', '#3f8e4b', '#c8352d', '#2f5fb8'] });
  shopHouse(m, 42, 67, 6, 6, 2, { text: 'SOUVENIRS', bg: '#c8352d', fg: '#ffffff', label: 'Souvenirs Dachl' }, 1, 'souvenir', { goods: ['#e8b830', '#c8352d', '#f4f0e6'] });
  shopHouse(m, 48, 67, 6, 6, 9, { text: 'TRAFIK', bg: '#c8352d', fg: '#ffffff', label: 'Trafik' }, 1, 'trafik');
  house(m, 1, 75, 7, 6, 6); house(m, 8, 75, 8, 6, 2);
  house(m, 16, 75, 7, 6, 3, { sign: { text: 'BANK', bg: '#1a3a7a', fg: '#ffffff' } });
  m.add(mkObj(19, 80, 1, 1, 12, (c, Wd, Hd) => { R(c, 2, 0, 12, Hd - 1, '#c8302a'); R(c, 4, 3, 8, 7, '#1a2a3a'); R(c, 5, 4, 6, 1, '#7ad0f0'); pxText(c, '€', 6, 5, '#ffffff'); R(c, 5, 13, 6, 2, '#2a2a2e'); R(c, 4, 18, 8, 3, '#e8e4dc'); }, { solid: true, light: { dx: 8, dy: 4, r: 18, c: '#7ad0f0' } }));
  m.trig(19, 80, 1, 1, { label: 'Bankomat', act: () => Story.atm() });
  shopHouse(m, 23, 75, 7, 6, 0, { text: 'BARBIER', bg: '#2a2a2e', fg: '#f4f0e6', label: 'Friseur & Barbier' }, 5, 'barbier', { hang: { dx: 6, icon: 'scissors', side: 'r' }, goods: ['#c8352d', '#f4f0e6', '#2f5fb8'] });
  shopHouse(m, 42, 75, 6, 6, 5, { text: 'KONDITOREI', bg: '#7a2a2a', fg: '#f8e8c8', label: 'Café Konditorei' }, 1, 'cafe', { awning: { cols: [0, 2, 3, 4, 5], col: '#7a2a2a' } });
  /* Casino Innsbruck */
  house(m, 48, 75, 6, 6, 4, { wall: '#2a2a34', roof: '#1a1a22', trim: '#c9a227', doors: [{ dx: 2, type: 'glass', lit: true }], sign: { text: 'CASINO', bg: '#1a1a22', fg: '#ffd23d', lit: true }, shutter: null });
  m.warp(50, 80, 'casino', 'entry', { label: 'Casino Innsbruck', guard: () => Story.casinoDoor() });
  m.spawn('casino_out', 50, 81, 0);
  for (const [x, y] of [[44, 81], [46, 81]]) m.add(objUmbrellaTable(x, y, '#7a2a2a'));
  m.add(objAnnasaeule(35, 63));
  m.trig(33, 62, 6, 5, { here: true, label: 'Foto: Annasäule', act: () => Story.photo('annasaeule'), cond: () => !G.S.photos.annasaeule });
  m.trig(33, 66, 6, 2, { here: true, label: 'Tauben füttern', act: () => Story.feedBirds('pigeon'), cond: () => !!G.S.photos.annasaeule });
  m.birdSpots.push({ x: 32, y: 65, w: 8, h: 3, n: 11 });
  for (const y of [60, 68, 76]) { m.add(objLamp(30, y)); m.add(objLamp(41, y)); }
  for (const [x, y] of [[31, 70], [38, 70], [31, 78]]) m.add(objBench(x, y, 0));
  m.add(objLitfass(39, 59)); m.add(objPlanter(30, 74)); m.add(objPlanter(41, 74, '#f2c23a'));
  m.add(objTriumph(32, 81)); m.solid(32, 81, 2, 2); m.solid(37, 81, 2, 2);
  m.fill(30, 81, 12, 2, T.PLAZA);
  m.trig(33, 79, 5, 2, { here: true, label: 'Foto: Triumphpforte', act: () => Story.photo('triumphpforte'), cond: () => !G.S.photos.triumphpforte });
  m.fill(0, 83, W, 1, T.PAVE); m.fill(0, 84, W, 3, T.ASPH); m.fill(0, 85, W, 1, T.TRAMR); m.fill(0, 87, W, 1, T.PAVE); m.fill(0, 88, W, 2, T.GRASS, 2);
  for (let x = 2; x < W; x += 7) m.add(objTree(x, 88, ['autumn', 'green', 'yellow', 'red'][x % 4]));
  m.fill(33, 84, 5, 1, T.ZEBRA); m.fill(33, 86, 5, 1, T.ZEBRA);
  /* Osten: Strasse, Viaduktbögen, Hauptbahnhof */
  m.fill(54, 58, 3, 26, T.ASPH); m.fill(57, 58, 1, 26, T.PAVE);
  const viad = mkObj(58, 58, 38, 6, 8, (c, Wd, Hd) => paintViaduct(c, Wd, Hd), { emit: (c, Wd, Hd) => paintViaduct(c, Wd, Hd, true) });
  m.add(viad);
  viad.anim = (c, t, px, py) => { const ph = (t / 24) % 1; if (ph < 0.25) { const x = px - 120 + ph / 0.25 * (38 * 16 + 240); c.drawImage(TRAIN_SPRITE(), x, py + 1); } };
  m.fill(57, 64, W - 57, 2, T.PAVE);
  m.warp(71, 63, 'club', 'entry', { label: 'Club Lawine', guard: () => Story.bouncer() });
  /* Rouge – Tabledance im Bogen 65 */
  m.warp(65, 63, 'rouge', 'entry', { label: 'Rouge Tabledance', guard: () => Story.rougeDoor() });
  m.add(mkObj(64, 63, 3, 1, 14, (c, Wd, Hd) => { R(c, 2, 0, Wd - 4, 11, '#1a0a10'); R(c, 3, 1, Wd - 6, 9, '#2a0e18'); pxText(c, 'ROUGE', 10, 2, '#ff5aa0'); R(c, 4, 3, 2, 2, '#ff2a6a'); R(c, Wd - 6, 3, 2, 2, '#ff2a6a'); for (let k = 3; k < Wd - 3; k += 4) P(c, k, 10, '#ff8ac0'); }, { solid: false, light: { dx: 24, dy: 6, r: 28, c: '#ff5aa0' } }));
  m.spawn('rouge_out', 65, 64, 0);
  m.trig(77, 63, 1, 1, { label: 'Kebap im Bogen', act: () => Story.shop('kebap') });
  m.trig(61, 64, 32, 2, { here: true, label: 'Foto: Viaduktbögen', act: () => Story.photo('bogen'), cond: () => !G.S.photos.bogen });
  m.fill(57, 66, W - 57, 3, T.ASPH); m.fill(57, 67, W - 57, 1, T.ASPH, 1); m.fill(74, 66, 3, 3, T.ZEBRA);
  const hbf = objBuilding(60, 69, 30, 6, { floors: 3, wall: '#d4d8dc', roof: '#7c8086', roofType: 'flat', trim: '#e8eaec', flowers: false, allShop: true, goods: ['#e8eaec', '#7ad0f0'], seed: 21, drawH: 6,
    doors: [{ dx: 13, type: 'glass' }, { dx: 14, type: 'glass' }, { dx: 15, type: 'glass' }],
    special: (c, Wd, Hd, fy0) => { R(c, 0, fy0 + 2, Wd, 6, '#2a3a4a'); pxText(c, 'INNSBRUCK HAUPTBAHNHOF', Wd / 2 - 43, fy0 + 3, '#ffffff'); R(c, 0, Hd - 20, Wd, 3, '#5a646c'); R(c, 6, Hd - 14, 10, 10, '#c8302a'); R(c, 8, Hd - 12, 6, 4, '#1a2a3a'); pxText(c, '€', 9, Hd - 7, '#ffffff'); } });
  m.add(hbf);
  m.trig(60, 74, 2, 1, { label: 'Bankomat', act: () => Story.atm() });
  m.trig(73, 74, 3, 1, { label: 'Hauptbahnhof', act: () => Story.station() });
  m.fill(57, 75, W - 57, 9, T.PLAZA, 2);
  m.add(objWurstStand(60, 77)); m.trig(60, 77, 3, 2, { label: 'Würstelstand', act: () => Story.shop('wurst') });
  m.add(objKiosk(66, 77, 'TRAFIK', '#c8352d')); m.trig(66, 77, 3, 2, { label: 'Trafik', act: () => Story.shop('trafik') });
  for (const [x, c] of [[84, '#f0d040'], [86, '#f0d040'], [88, '#f0d040']]) m.add(objCar(x, 77, c));
  m.add(mkObj(90, 76, 1, 1, 16, (c, Wd, Hd) => { R(c, 7, 4, 2, Hd - 5, '#3a3c40'); R(c, 2, 0, 12, 8, '#f0d040'); pxText(c, 'TAXI', 1, 2, '#1a1a1a'); }));
  m.trig(84, 78, 7, 1, { here: true, label: 'Taxi nehmen', act: () => Story.taxi() });
  m.trig(84, 77, 6, 1, { label: 'Taxi nehmen', act: () => Story.taxi() });
  for (const [x, y, k] of [[72, 80, 'autumn'], [80, 81, 'green'], [92, 79, 'yellow'], [58, 81, 'red']]) m.add(objTree(x, y, k));
  for (const [x, y] of [[64, 81], [76, 82]]) m.add(objBench(x, y, 0));
  for (const x of [58, 70, 82, 94]) m.add(objLamp(x, 76, 'new'));
  /* Laternen an Gassen */
  for (const x of [4, 12, 20, 48]) { m.add(objLamp(x, 66)); m.add(objLamp(x, 74)); }
  /* Strassenmusiker, Polizist etc. */
  m.npcDefs.push(
    { id: 'busker', name: 'Strassenmusiker', x: 28 * 16 + 8, y: 39 * 16 + 12, dir: 0, look: npcLook(901, { hat: 8, hatCol: 9, top: 9, topCol: 15, beard: 7, beardCol: 9, hairCol: 9 }), talk: () => Story.busker(), keepDir: true, bubbleRand: ['note'] },
    { id: 'polizei', name: 'Polizist', x: 64 * 16 + 8, y: 40 * 16 + 12, dir: 1, look: npcLook(902, { hat: 1, hatCol: 2, top: 10, topCol: 10, pants: 5, pantsCol: 8, shoes: 3, shoesCol: 1, beard: 2, glasses: 0, print: 0, acc: 0 }), talk: () => Story.police(), wander: { x: 55, y: 37, w: 16, h: 3 } },
    { id: 'kutscher', name: 'Fiakerin', x: 70 * 16 + 8, y: 40 * 16 + 12, dir: 1, look: npcLook(903, { hat: 8, hatCol: 0, top: 9, topCol: 16, beard: 0, hair: 9 }), talk: () => Story.fiaker(), keepDir: true },
    { id: 'tuer', name: 'Türsteher', x: 72 * 16 + 4, y: 64 * 16 + 14, dir: 0, look: npcLook(904, { build: 3, hair: 0, beard: 7, beardCol: 0, top: 8, topCol: 16, glasses: 4, pants: 0, pantsCol: 2, shoes: 1, shoesCol: 1 }), talk: () => Story.bouncerTalk() },
    { id: 'jessy', name: 'Jessy', x: 61 * 16 + 8, y: 65 * 16 + 12, dir: 0, look: npcLook(990, { hair: 10, hairCol: 13, beard: 0, top: 5, topCol: 12, pants: 3, pantsCol: 2, shoes: 1, shoesCol: 4, jewel: 4, glasses: 0, hat: 0, print: 0, acc: 2, mouth: 4 }), talk: () => Story.jessy(), cond: () => { const h = hourOf(G.S.time); return h >= 22 || h < 4; }, wander: { x: 58, y: 65, w: 6, h: 1 }, bubbleRand: ['heart'] },
    { id: 'hund', name: 'Frau mit Dackel', x: 84 * 16 + 8, y: 44 * 16 + 12, dir: 0, look: npcLook(905, { hair: 10, beard: 0, top: 4, topCol: 12 }), talk: () => Story.dog(), wander: { x: 84, y: 36, w: 1, h: 17 }, dog: true },
  );
  /* Fussgänger */
  m.pedZones.push({ x: 30, y: 58, w: 12, h: 22, n: 12 }, { x: 16, y: 36, w: 38, h: 5, n: 9 }, { x: 54, y: 36, w: 18, h: 4, n: 4 }, { x: 0, y: 24, w: 96, h: 2, n: 6 }, { x: 0, y: 16, w: 96, h: 2, n: 4 }, { x: 57, y: 75, w: 38, h: 8, n: 8 }, { x: 74, y: 38, w: 22, h: 10, n: 4 }, { x: 0, y: 47, w: 72, h: 2, n: 5 }, { x: 57, y: 64, w: 38, h: 2, n: 4 });
  /* Fahrzeuge */
  m.vehicles.push(makeTram(56, W), makeCar(26, -1, '#c8352d', 0.2), makeCar(28, 1, '#2f5fb8', 0.6), makeCar(26, -1, '#efede6', 0.75), makeCar(84, 1, '#3a3c40', 0.1), makeCar(86, -1, '#3f8e4b', 0.5), makeCar(66, 1, '#e8c23a', 0.3, 57), makeCar(68, -1, '#7a2f3a', 0.8, 57));
  m.vehicles.push(makeTram(85, W, 0.5));
  m.spawn('hbf', 74, 75, 0);
  /* Tram-Haltestelle Richtung Bergisel */
  m.add(objTramStop(79, 83, 'BERGISEL'));
  m.trig(78, 83, 4, 1, { label: 'Tram zum Bergisel', act: () => Story.bergiselTram() });
  m.spawn('bergisel_stop', 81, 83, 1);
  m.spawn('hotel_out', 19, 47, 0);
  m.spawn('bar_out', 43, 65, 0);
  m.spawn('stueberl_out', 25, 47, 0);
  m.spawn('club_out', 71, 64, 0);
  m.spawn('hbb_out', 77, 33, 0);
  m.spawn('tower_out', 24, 40, 0);
  m.groundAnim = waterAnim;
  m.dynLights = () => m.vehicles.filter((v) => v.light).map((v) => v.light());
  return m;
};
let _trainSpr = null;
function TRAIN_SPRITE() { if (_trainSpr) return _trainSpr; const [c, x] = canvas(240, 10); R(x, 0, 1, 240, 8, '#c8302a'); R(x, 0, 1, 240, 2, '#e8e4dc'); for (let k = 4; k < 236; k += 10) R(x, k, 3, 7, 3, '#4a6478'); for (let k = 78; k < 240; k += 80) R(x, k, 1, 2, 8, '#2a2a2e'); _trainSpr = c; return c; }
function paintViaduct(c, W, H, night) {
  if (night) {
    for (let a = 0; a < Math.floor(W / 48); a++) {
      if (![2, 4, 6].includes(a)) continue;
      const ax = a * 48 + 6, aw = 36, ay = 30;
      const col = a === 4 ? '#ff7af8' : a === 2 ? '#7af0ff' : '#ffd060';
      const label = a === 4 ? 'LAWINE' : a === 2 ? 'BOGEN' : 'KEBAP';
      pxText(c, label, ax + aw / 2 - pxTextW(label) / 2, ay - 8, col);
      R(c, ax + 4, ay + 6, aw - 8, H - ay - 22, rgba(col, 0.35));
    }
    return;
  }
  R(c, 0, 0, W, 10, '#8a8e94'); R(c, 0, 0, W, 2, '#b8bcc2'); R(c, 0, 9, W, 1, '#5a5e64');
  for (let x = 0; x < W; x += 4) R(c, x, 3, 2, 5, '#6a5a4a');
  R(c, 0, 10, W, H - 10, '#a58a6a');
  for (let yy = 12; yy < H; yy += 4) for (let xx = (yy % 8 ? 0 : 4); xx < W; xx += 8) R(c, xx, yy, 1, 3, '#8a7050');
  for (let yy = 13; yy < H; yy += 4) R(c, 0, yy, W, 1, '#94785a');
  const arches = Math.floor(W / 48);
  for (let a = 0; a < arches; a++) {
    const ax = a * 48 + 6, aw = 36;
    const ay = 30;
    R(c, ax, ay, aw, H - ay, '#2a2420');
    for (let k = 0; k < 12; k++) { const w = Math.round(Math.sqrt(1 - ((12 - k) / 12) ** 2) * (aw / 2)); R(c, ax + aw / 2 - w, ay - 12 + k, w * 2, 1, '#2a2420'); }
    if (a === 4 || a === 2 || a === 6) {
      const tx = a === 4 ? 70 : a === 2 ? 64 : 78;
      const col = tx === 70 ? '#c23ad0' : tx === 64 ? '#3ac0e0' : '#f0b030';
      R(c, ax + 2, ay + 4, aw - 4, H - ay - 6, '#3a3640'); R(c, ax + 2, ay + 4, aw - 4, H - ay - 6, 'rgba(120,160,200,0.25)');
      const label = tx === 70 ? 'LAWINE' : tx === 64 ? 'BOGEN' : 'KEBAP';
      pxText(c, label, ax + aw / 2 - pxTextW(label) / 2, ay - 8, col);
      R(c, ax + aw / 2 - 6, H - 15, 12, 15, '#18161c'); R(c, ax + aw / 2 - 5, H - 14, 10, 14, shade(col, -0.5));
    } else {
      for (let k = 0; k < 6; k++) R(c, ax + 4 + k * 5, H - 10, 3, 8, ['#5a6e80', '#3a3c40'][k % 2]);
    }
  }
}
function paintDom(c, W, H) {
  const wall = '#f0d8b8', trim = '#fbf4e4', sd = '#d8bc98';
  /* Kuppel hinten */
  E(c, W / 2, 26, 22, 18, '#5f8a7a'); E(c, W / 2 - 4, 22, 12, 9, '#7aa898'); R(c, W / 2 - 2, 4, 4, 6, '#5f8a7a'); R(c, W / 2 - 1, 0, 2, 5, '#e8c84a');
  /* Fassade */
  R(c, 0, 48, W, H - 48, wall);
  R(c, 0, 48, W, 2, trim);
  for (let f = 0; f < 3; f++) R(c, 0, H - 16 - f * 22, W, 2, trim);
  /* Türme */
  for (const tx of [0, W - 32]) {
    R(c, tx, 20, 32, H - 20, wall); R(c, tx + 28, 20, 4, H - 20, sd);
    for (const yy of [40, 70]) { R(c, tx + 12, yy, 8, 14, '#3a4250'); E(c, tx + 16, yy, 4, 3, '#3a4250'); R(c, tx + 11, yy - 1, 10, 1, trim); }
    E(c, tx + 16, 66 + 30, 5, 5, '#2a2a2e'); E(c, tx + 16, 66 + 30, 4, 4, '#f4f0e0');
    for (let k = 0; k < 14; k++) { const w = Math.round(Math.sin((k / 14) * Math.PI * 0.85 + 0.35) * 15); R(c, tx + 16 - w, 4 + k, w * 2, 1, k < 4 ? '#7aa898' : '#5f8a7a'); }
    R(c, tx + 15, 0, 2, 5, '#e8c84a'); R(c, tx, 18, 32, 3, trim);
  }
  /* Mittelteil */
  for (let k = 0; k < 18; k++) R(c, W / 2 - k * 2.2, 30 + k, k * 4.4, 1, k % 3 ? wall : trim);
  E(c, W / 2, 42, 5, 5, '#c9a65a'); E(c, W / 2, 42, 3, 3, '#f4e8b8');
  for (let k = 0; k < 4; k++) { R(c, 40 + k * 18, 60, 6, 14, '#3a4250'); E(c, 43 + k * 18, 60, 3, 2, '#3a4250'); R(c, 38 + k * 18, H - 40, 2, 38, trim); }
  R(c, W / 2 - 10, H - 30, 20, 30, '#4a3220'); E(c, W / 2, H - 30, 10, 6, '#4a3220'); R(c, W / 2 - 12, H - 32, 24, 2, trim); R(c, W / 2, H - 30, 1, 30, '#2a1a10');
  R(c, 0, H - 3, W, 3, '#b8a888');
}
function makeTram(row, W, phase = 0) {
  const spr = objTram('#c8352d');
  const v = { kind: 'tram', y: row * TS + 14, x: -200, dir: 1, speed: 46, wait: 0, ringT: 0 };
  v.reset = () => { v.x = phase * W * TS; v.dir = phase > 0.4 ? -1 : 1; };
  v.update = (dt) => {
    if (v.wait > 0) { v.wait -= dt; return; }
    const p = G.player;
    const front = v.dir > 0 ? v.x + 96 : v.x;
    const ahead = v.dir > 0 ? p.x - front : front - p.x;
    if (Math.abs(p.y - v.y) < 20 && ahead > -4 && ahead < 46) { v.ringT -= dt; if (v.ringT <= 0) { Snd.sfx('ding'); v.ringT = 1.6; v.bubble = 1.2; } return; }
    v.x += v.dir * v.speed * dt;
    if (v.bubble > 0) v.bubble -= dt;
    if (v.x > W * TS + 60) { v.dir = -1; v.wait = rnd(3, 8); }
    if (v.x < -160) { v.dir = 1; v.wait = rnd(3, 8); }
  };
  v.draw = (c, cx, cy) => {
    const x = Math.round(v.x - cx), y = Math.round(v.y - cy - 24);
    if (x > View.w + 10 || x < -110) return;
    R(c, x + 2, y + 22, 92, 3, 'rgba(0,0,0,0.25)');
    if (v.dir < 0) { c.save(); c.translate(x + 96, y); c.scale(-1, 1); c.drawImage(spr, 0, 0); c.restore(); } else c.drawImage(spr, x, y);
    if (v.bubble > 0) drawBubble(c, x + (v.dir > 0 ? 90 : 6), y - 2, '!');
  };
  v.sortY = () => v.y + 2;
  v.light = () => ({ x: v.x + (v.dir > 0 ? 100 : -6), y: v.y - 10, r: 34, c: '#fff6d0' });
  return v;
}
function makeCar(row, dir, col, phase, minX = 0) {
  const [cc, cx] = canvas(32, 22);
  objCar(0, 0, col).paint(cx, 32, 22);
  const v = { kind: 'car', y: row * TS + 13, x: 0, dir, speed: rnd(44, 58), honk: 0 };
  v.reset = () => { v.x = minX * TS + phase * (G.map.w - minX) * TS; };
  v.update = (dt) => {
    const p = G.player;
    const front = v.dir > 0 ? v.x + 32 : v.x;
    const ahead = v.dir > 0 ? p.x - front : front - p.x;
    if (Math.abs(p.y - v.y) < 14 && ahead > -6 && ahead < 30) { v.honk -= dt; if (v.honk <= 0) { Snd.tone(330, 0.18, 'square', 0.05); Snd.tone(392, 0.18, 'square', 0.04, 0.2); v.honk = 2.5; } return; }
    v.x += v.dir * v.speed * dt;
    const Wpx = G.map.w * TS;
    const lo = minX ? minX * TS - 8 : -40;
    if (v.x > Wpx + 40) v.x = lo; if (v.x < lo) v.x = Wpx + 40;
  };
  v.draw = (c, cx2, cy2) => {
    const x = Math.round(v.x - cx2), y = Math.round(v.y - cy2 - 20);
    if (x > View.w + 10 || x < -40) return;
    if (minX) { c.save(); c.beginPath(); c.rect(minX * TS - cx2, 0, 9999, View.h); c.clip(); }
    if (v.dir < 0) { c.save(); c.translate(x + 32, y); c.scale(-1, 1); c.drawImage(cc, 0, 0); c.restore(); } else c.drawImage(cc, x, y);
    if (minX) c.restore();
  };
  v.sortY = () => v.y;
  v.light = () => ({ x: v.x + (v.dir > 0 ? 36 : -4), y: v.y - 8, r: 26, c: '#fff6d0' });
  return v;
}

/* ----------- Hotel Zirbe: Lobby ----------- */
MAP_BUILDERS.hotel_lobby = () => {
  const m = new GMap('hotel_lobby', 18, 13, { name: 'Hotel Zirbe · Lobby', indoor: true, wallStyle: { cap: '#3a2a20' }, music: null });
  roomShell(m, 7, { floor: T.MARBLE });
  m.fill(7, 6, 4, 6, T.CARPET, 1);
  m.decal((c) => {
    DECAL.picture(c, 2 * 16 + 3, 16 + 6, '#8ab0c8'); DECAL.clock(c, 9 * 16 + 3, 16 + 4); DECAL.antlers(c, 6 * 16, 16 + 2);
    R(c, 2 * 16, 2 * 16, 64, 12, '#4a3020'); for (let k = 0; k < 8; k++) { R(c, 2 * 16 + 4 + k * 7, 2 * 16 + 2, 3, 6, '#c9a65a'); } pxText(c, 'HOTEL ZIRBE', 9 * 16 + 18 - 22, 16 + 18, '#c8b070');
    DECAL.lift(c, 13 * 16 + 3, 16 + 3);
  });
  m.add(objReception(2, 4, 5));
  m.trig(2, 4, 5, 1, { label: 'Rezeption', act: () => Story.reception() });
  m.npcDefs.push({ id: 'rezeption', name: 'Frau Hofer', x: 4 * 16 + 8, y: 3 * 16 + 12, dir: 0, look: npcLook(911, { hair: 9, beard: 0, top: 9, topCol: 7, glasses: 0, hairCol: 2, mouth: 0, jewel: 1 }), talk: () => Story.reception(), keepDir: true, solid: true });
  m.trig(13, 2, 2, 1, { label: 'Lift: 3. Stock', act: () => Story.lift('up') });
  m.fill(16, 3, 1, 2, T.STAIRS, 1);
  m.warp(16, 3, 'hotel_floor', 'stairs', { h: 2, label: 'Treppe', guard: () => Story.needKey() });
  m.add(objSofa(12, 7, 3, '#3f5e4c')); m.add(objTable(12, 9, 2, 1, { col: '#6a4428' }));
  for (const [x, y] of [[1, 6], [16, 7], [1, 11], [16, 11]]) m.add(objPlant(x, y));
  m.add(objLuggage(8, 4));
  m.add(objTable(2, 8, 2, 1, { col: '#f4f2ec' })); m.add(objTable(2, 10, 2, 1, { col: '#f4f2ec' }));
  m.add(objBuffet(4, 8, 3));
  m.trig(4, 8, 3, 1, { label: 'Frühstücksbuffet', act: () => Story.breakfast() });
  doorBottom(m, 8, 2, 'ibk', 'hotel_out', 'Ausgang');
  m.spawn('entry', 9, 11, 3); m.spawn('lift', 14, 3, 0); m.spawn('stairs', 15, 4, 1);
  return m;
};
/* ----------- Hotel: 3. Stock ----------- */
MAP_BUILDERS.hotel_floor = () => {
  const m = new GMap('hotel_floor', 24, 8, { name: 'Hotel Zirbe · 3. Stock', indoor: true, wallStyle: { cap: '#3a2a20' } });
  roomShell(m, 0, { floor: T.CARPET, floorV: 0 });
  const rooms = [[3, 301], [6, 302], [9, 303], [12, 304], [15, 305], [18, 306], [21, 307]];
  for (const [x, n] of rooms) { wallDoorDecal(m, x, n); m.trig(x, 2, 1, 1, { label: 'Zimmer ' + n, act: () => Story.roomDoor(n) }); }
  m.decal((c) => { DECAL.lift(c, 1 * 16 - 8, 16 + 3); DECAL.picture(c, 7 * 16 + 4, 16 + 4, '#c89a6a'); DECAL.picture(c, 13 * 16 + 4, 16 + 4, '#6a8ab0'); DECAL.picture(c, 19 * 16 + 4, 16 + 4, '#8aa86a'); });
  m.trig(0, 2, 2, 1, { label: 'Lift: Lobby', act: () => Story.lift('down') });
  m.fill(22, 3, 1, 4, T.STAIRS, 1); m.set(22, 3, T.STAIRS, 1);
  m.warp(22, 4, 'hotel_lobby', 'stairs', { h: 2, label: 'Treppe' });
  m.add(objPlant(10, 6)); m.add(objPlant(17, 6));
  m.spawn('lift', 1, 3, 0); m.spawn('stairs', 21, 4, 1); m.spawn('room', 21, 3, 0);
  return m;
};
/* ----------- Hotel: Zimmer 307 ----------- */
MAP_BUILDERS.hotel_room = () => {
  const m = new GMap('hotel_room', 14, 11, { name: 'Zimmer 307', indoor: true, wallStyle: { cap: '#3a2a20' } });
  roomShell(m, 0, { floor: T.WOOD, floorV: 0 });
  m.fill(11, 1, 2, 2, T.WALLF, 4);
  for (let y = 3; y < 10; y++) m.set(10, y, T.WALL);
  m.set(10, 5, T.BATH); m.set(10, 6, T.BATH);
  m.fill(11, 3, 2, 7, T.BATH);
  m.fill(3, 5, 5, 4, T.CARPET, 2);
  m.decal((c) => {
    const wx = 3 * 16 + 2, wy = 16 + 2;
    R(c, wx - 2, wy - 2, 32, 27, '#e8e4dc'); R(c, wx, wy, 28, 23, '#8ec3e6');
    for (let x = 0; x < 28; x++) { const hh = 8 + Math.abs(Math.sin(x * 0.25)) * 7 + Math.sin(x * 0.7) * 2; R(c, wx + x, wy + 23 - hh, 1, hh, '#8c8a86'); if (hh > 12) P(c, wx + x, wy + 23 - hh, '#f2f4f6'); }
    R(c, wx, wy + 19, 28, 4, '#3a5a34'); R(c, wx + 13, wy, 2, 23, '#e8e4dc'); R(c, wx - 3, wy + 23, 34, 3, '#cfc8bc');
    R(c, wx - 6, wy - 3, 4, 28, '#8a3a2a'); R(c, wx + 30, wy - 3, 4, 28, '#8a3a2a');
    DECAL.picture(c, 6 * 16 + 4, 16 + 6, '#c8a06a'); DECAL.tv(c, 7 * 16 + 4, 16 + 8, 22, 13);
    DECAL.mirror(c, 11 * 16 + 2, 16 + 4);
  });
  m.add(objBed(1, 3));
  m.add(mkObj(3, 3, 1, 1, 4, (c, W, H) => { R(c, 2, 2, 12, H - 4, '#6a4428'); R(c, 2, 2, 12, 1, '#8a5a34'); R(c, 6, 0, 4, 4, '#e8d08a'); }, { emit: (c) => R(c, 6, 0, 4, 4, '#ffe8a0') }));
  m.add(objWardrobe(5, 3, 2));
  m.add(objDesk(7, 3)); m.add(objChair(7, 4, 3, '#6a4428'));
  m.add(objMinibar(9, 3));
  m.add(objSink(11, 3)); m.add(objToilet(12, 3)); m.add(objShower(11, 8));
  m.add(objSofa(7, 8, 2, '#3f5e4c'));
  m.add(mkObj(1, 7, 2, 1, 6, (c, W, H) => { R(c, 1, H - 8, W - 2, 6, '#8a5a34'); R(c, 1, H - 8, W - 2, 1, '#a87a50'); R(c, 4, H - 18, 18, 11, '#c8352d'); R(c, 4, H - 18, 18, 1, '#e85a4a'); R(c, 8, H - 20, 10, 2, '#2a2a2e'); }));
  m.trig(1, 3, 2, 3, { label: 'Bett', act: () => Story.bed() });
  m.trig(5, 3, 2, 1, { label: 'Kleiderschrank: Umziehen', act: () => Story.wardrobe() });
  m.trig(7, 3, 2, 1, { label: 'Schreibtisch & TV', act: () => Story.desk() });
  m.trig(9, 3, 1, 1, { label: 'Minibar', act: () => Story.shop('minibar') });
  m.trig(1, 7, 2, 1, { label: 'Rucksack', act: () => Story.unpack() });
  m.trig(3, 2, 2, 1, { label: 'Aus dem Fenster schauen', act: () => Story.window() });
  m.trig(11, 3, 1, 1, { label: 'Waschbecken & Spiegel', act: () => Story.mirror() });
  m.trig(12, 3, 1, 1, { label: 'Toilette', act: () => Story.toilet('hotel') });
  m.trig(11, 8, 2, 2, { here: true, label: 'Duschen', act: () => Story.shower() });
  m.trig(11, 7, 2, 1, { label: 'Duschen', act: () => Story.shower() });
  doorBottom(m, 4, 2, 'hotel_floor', 'room', 'Flur');
  m.spawn('entry', 4, 9, 3); m.spawn('bed', 3, 5, 1);
  return m;
};
/* ----------- Gamsbock Bar ----------- */
MAP_BUILDERS.bar = () => {
  const m = new GMap('bar', 22, 15, { name: 'Gamsbock Bar', indoor: true, wallStyle: { cap: '#2a1a10' }, music: 'bar' });
  roomShell(m, 1, { floor: T.WOOD, floorV: 1 });
  m.decal((c) => {
    DECAL.shelf(c, 1 * 16 + 2, 16 + 4, 120); DECAL.shelf(c, 1 * 16 + 2, 16 + 18, 120);
    DECAL.gams(c, 10 * 16, 16 + 4); DECAL.antlers(c, 12 * 16 + 4, 16 + 4);
    DECAL.tv(c, 14 * 16 + 2, 16 + 3, 26, 15); DECAL.dart(c, 19 * 16 + 1, 16 + 6); DECAL.board(c, 17 * 16, 16 + 8);
    R(c, 18 * 16, 6 * 16 + 4, 48, 2, '#e8dcc0');
    pxText(c, 'GAMSBOCK', 9 * 16 - 4, 2 * 16 + 4, '#ffb53d');
    DECAL.flag(c, 1 * 16 + 2, 2 * 16 + 6);
  });
  wallDoorDecal(m, 20, null, '#5a3a24');
  m.decal((c) => pxText(c, 'WC', 20 * 16 + 5, 16 + 6, '#f2e8d0'));
  m.add(objCounter(1, 5, 8, 1, { top: '#6a3a1e', front: '#3a2010', taps: 4, glasses: 3 }));
  m.trig(1, 5, 8, 1, { label: 'Bar: Bestellen', act: () => Story.shop('bar') });
  for (const x of [2, 4, 6, 8]) m.add(objStool(x, 6, '#8a2a22'));
  m.npcDefs.push({ id: 'sepp', name: 'Sepp (Barkeeper)', x: 5 * 16 + 8, y: 4 * 16 + 10, dir: 0, look: npcLook(921, { hair: 12, hairCol: 9, beard: 9, beardCol: 9, top: 7, topCol: 0, build: 3, glasses: 0 }), talk: () => Story.shop('bar'), keepDir: true, drinkIdle: false });
  m.add(objTable(10, 8, 3, 2, { col: '#7a4a28', items: 4, cards: true }));
  for (const [x, y, d] of [[10, 7, 0], [12, 7, 0], [9, 8, 2], [9, 9, 2], [13, 8, 1], [13, 9, 1], [10, 10, 3], [11, 10, 3], [12, 10, 3]]) m.add(objChair(x, y, d === 0 ? 3 : d === 3 ? 0 : d, '#6a3a1e'));
  m.trig(11, 10, 1, 1, { here: true, label: 'Zu den Jungs setzen', act: () => Story.barTable() });
  m.add(objTable(15, 10, 2, 2, { col: '#7a4a28', items: 1 }));
  m.add(objSofa(17, 13, 4, '#5a2a2a'));
  m.add(objTable(2, 10, 2, 2, { col: '#7a4a28', round: true, candle: true }));
  m.add(objKicker(14, 4));
  m.trig(14, 4, 3, 2, { label: 'Tischfussball', act: () => Story.kicker() });
  m.add(objJukebox(12, 3));
  m.trig(12, 3, 1, 1, { label: 'Jukebox', act: () => Story.jukebox() });
  m.trig(19, 2, 1, 1, { label: 'Darts spielen', act: () => Story.darts() });
  m.trig(14, 2, 2, 1, { label: 'Fussball schauen', act: () => Story.tv() });
  m.trig(20, 2, 1, 1, { label: 'WC', act: () => Story.toilet('bar') });
  m.add(objPlant(20, 12)); m.add(objPlant(1, 12));
  doorBottom(m, 10, 2, 'ibk', 'bar_out', 'Ausgang');
  m.pedZones.push({ x: 15, y: 11, w: 5, h: 2, n: 3, sit: true }, { x: 1, y: 6, w: 8, h: 1, n: 2, drink: true });
  m.spawn('entry', 10, 13, 3);
  m.light(6 * 16, 5 * 16, 60, '#ffb060');
  return m;
};
/* ----------- Tiroler Stüberl ----------- */
MAP_BUILDERS.stueberl = () => {
  const m = new GMap('stueberl', 16, 12, { name: 'Tiroler Stüberl', indoor: true, wallStyle: { cap: '#5a3a1e' }, music: 'stube' });
  roomShell(m, 2, { floor: T.WOOD, floorV: 2 });
  m.decal((c) => { DECAL.cross(c, 1 * 16 + 3, 16 + 2); DECAL.antlers(c, 5 * 16, 16 + 4); DECAL.antlers(c, 9 * 16, 16 + 4); DECAL.clock(c, 7 * 16 + 3, 16 + 4); DECAL.picture(c, 11 * 16 + 3, 16 + 6, '#8aa86a'); DECAL.shelf(c, 2 * 16, 16 + 18, 64); DECAL.flag(c, 12 * 16 + 4, 16 + 18); });
  m.add(objCounter(1, 4, 5, 1, { top: '#a8784a', front: '#7a4a28', taps: 2 }));
  m.trig(1, 4, 5, 1, { label: 'Bei der Resi bestellen', act: () => Story.shop('stueberl') });
  m.npcDefs.push({ id: 'resi', name: 'Wirtin Resi', x: 3 * 16 + 8, y: 3 * 16 + 12, dir: 0, look: npcLook(931, { hair: 9, hairCol: 9, beard: 0, top: 11, topCol: 1, build: 3, glasses: 7 }), talk: () => Story.shop('stueberl'), keepDir: true });
  m.add(objKachelofen(13, 3));
  m.trig(13, 3, 2, 2, { label: 'Kachelofen', act: () => Story.stove() });
  m.add(objTable(7, 6, 3, 2, { col: '#a8784a', cloth: '#c8352d', items: 3 }));
  m.add(objTable(11, 8, 2, 2, { col: '#a8784a', cloth: '#c8352d' }));
  m.add(objTable(2, 8, 2, 2, { col: '#a8784a', cloth: '#c8352d', candle: true }));
  m.add(objNagelstock(5, 9));
  m.trig(5, 9, 1, 1, { label: 'Nageln', act: () => Story.nageln() });
  m.npcDefs.push(
    { id: 'hias', name: 'Hias', x: 6 * 16 + 8, y: 7 * 16 + 12, dir: 2, pose: 'sit', look: npcLook(932, { hair: 12, hairCol: 9, beard: 7, beardCol: 10, top: 11, topCol: 6, pants: 7, hat: 9, hatCol: 8, build: 3 }), talk: () => Story.hias(), keepDir: true, drinkIdle: true, sitIdle: true },
    { id: 'ferdl', name: 'Holzknecht Ferdl', x: 13 * 16 + 8, y: 9 * 16 + 12, dir: 1, pose: 'sit', look: npcLook(934, { hair: 1, hairCol: 1, beard: 12, beardCol: 1, top: 7, topCol: 0, pants: 7, hat: 9, hatCol: 8, build: 3, height: 2, brows: 5, mark: 2, glasses: 0 }), talk: () => Story.ferdl(), keepDir: true, drinkIdle: true, sitIdle: true, bubbleRand: ['!', 'dots'] },
    { id: 'loisl', name: 'Loisl', x: 10 * 16 + 8, y: 6 * 16 + 12, dir: 1, pose: 'sit', look: npcLook(933, { hair: 0, beard: 10, beardCol: 10, top: 4, topCol: 7, glasses: 7, build: 1 }), talk: () => Story.loisl(), keepDir: true, drinkIdle: true, sitIdle: true },
  );
  doorBottom(m, 7, 2, 'ibk', 'stueberl_out', 'Ausgang');
  m.spawn('entry', 7, 10, 3);
  m.light(13 * 16 + 16, 4 * 16 + 4, 50, '#ff9a40');
  return m;
};
/* ----------- Casino Innsbruck ----------- */
MAP_BUILDERS.casino = () => {
  const m = new GMap('casino', 18, 13, { name: 'Casino Innsbruck', indoor: true, wallStyle: { cap: '#1a1a22' }, music: 'lounge', bg: '#0a0a10' });
  roomShell(m, 3, { floor: T.DARK });
  m.decal((c) => { pxText(c, 'CASINO', 7 * 16 + 2, 16 + 6, '#ffd23d'); pxText(c, 'CASINO', 7 * 16 + 1, 16 + 5, '#fff4c0'); DECAL.shelf(c, 13 * 16, 16 + 6, 64); for (let x = 16; x < 17 * 16; x += 32) for (let y = 3 * 16; y < 12 * 16; y += 32) R(c, x, y, 16, 16, 'rgba(120,20,40,0.18)'); });
  /* Roulettetisch links, Blackjack rechts */
  m.add(mkObj(2, 4, 5, 3, 10, (c, W, H) => { R(c, 0, 8, W, H - 10, '#2a6a3a'); R(c, 0, 8, W, 2, '#3a8a4a'); R(c, 0, H - 2, W, 2, '#5a3a20'); E(c, 20, 24, 14, 10, '#4a3020'); E(c, 20, 24, 12, 8, '#8a2a2a'); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; R(c, Math.round(20 + Math.cos(a) * 9), Math.round(24 + Math.sin(a) * 6), 2, 2, k % 2 ? '#1a1a1e' : '#c8302a'); } E(c, 20, 24, 3, 2, '#c9a227'); for (let k = 0; k < 6; k++) R(c, 46 + k * 5, 14 + (k % 2) * 6, 4, 10, k % 2 ? '#c8302a' : '#1a1a1e'); pxText(c, 'ROULETTE', 44, 30, '#f4e8c0'); }, { solid: true, light: { dx: 40, dy: 10, r: 40, c: '#ffd27a' } }));
  m.trig(2, 4, 5, 3, { label: 'Roulette spielen', act: () => Story.roulette() });
  m.add(mkObj(11, 4, 5, 3, 10, (c, W, H) => { R(c, 0, 8, W, H - 10, '#2a6a3a'); R(c, 0, 8, W, 2, '#3a8a4a'); R(c, 0, H - 2, W, 2, '#5a3a20'); for (let k = 0; k < 4; k++) { R(c, 8 + k * 18, 16, 12, 16, '#f4f4f0'); R(c, 9 + k * 18, 17, 10, 14, k % 2 ? '#f4f4f0' : '#c8302a'); } pxText(c, 'BLACKJACK', 14, 36, '#f4e8c0'); }, { solid: true, light: { dx: 40, dy: 10, r: 40, c: '#ffd27a' } }));
  m.trig(11, 4, 5, 3, { label: 'Blackjack spielen', act: () => Story.blackjack() });
  m.npcDefs.push({ id: 'croupier1', name: 'Croupier Max', x: 4 * 16 + 8, y: 3 * 16 + 10, dir: 0, look: npcLook(981, { hair: 3, hairCol: 0, beard: 0, top: 9, topCol: 16, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1, glasses: 0, hat: 0 }), talk: () => Story.roulette(), keepDir: true });
  m.npcDefs.push({ id: 'croupier2', name: 'Croupière Lisa', x: 13 * 16 + 8, y: 3 * 16 + 10, dir: 0, look: npcLook(982, { hair: 16, hairCol: 1, beard: 0, top: 9, topCol: 16, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1, glasses: 0, hat: 0 }), talk: () => Story.blackjack(), keepDir: true });
  m.add(objCounter(7, 9, 4, 1, { top: '#2a2a34', front: '#1a1a22', glasses: 3 }));
  m.trig(7, 9, 4, 1, { label: 'Casinobar', act: () => Story.shop('casinobar') });
  for (const x of [7, 9]) m.add(objStool(x, 10, '#c9a227'));
  m.add(objPlant(1, 1)); m.add(objPlant(16, 1)); m.add(objSofa(1, 9, 3, '#5a1a2a')); m.add(objSofa(14, 9, 3, '#5a1a2a'));
  doorBottom(m, 8, 2, 'ibk', 'casino_out', 'Ausgang');
  m.spawn('entry', 8, 11, 3);
  m.light(4 * 16 + 8, 5 * 16, 36, '#ffd27a'); m.light(13 * 16 + 8, 5 * 16, 36, '#ffd27a');
  return m;
};
/* ----------- Rouge: Tabledance-Lokal in den Bögen ----------- */
MAP_BUILDERS.rouge = () => {
  const m = new GMap('rouge', 16, 12, { name: 'Rouge · Tabledance', indoor: true, wallStyle: { cap: '#2a0a10' }, music: 'lounge', bg: '#0c0408' });
  roomShell(m, 3, { floor: T.DARK });
  m.decal((c) => { pxText(c, 'ROUGE', 6 * 16 + 4, 16 + 6, '#ff5aa0'); pxText(c, 'ROUGE', 6 * 16 + 3, 16 + 5, '#ffd0e8'); DECAL.shelf(c, 11 * 16, 16 + 6, 64); });
  /* Bühne mit Stange und Lichtern */
  m.add(mkObj(5, 3, 6, 2, 6, (c, W, H) => {
    R(c, 0, 6, W, H - 6, '#3a1020'); R(c, 0, 6, W, 2, '#6a2040'); for (let k = 2; k < W; k += 8) R(c, k, H - 3, 3, 2, '#ff5aa0');
    R(c, W / 2 - 1, -0, 2, H - 2, '#c9ccd2'); R(c, W / 2, 0, 1, H - 2, '#f4f4f4');
  }, { solid: true, light: { dx: 48, dy: 10, r: 46, c: '#ff5aa0' } }));
  m.npcDefs.push({ id: 'dancer', name: 'Chantal', x: 7 * 16 + 8, y: 4 * 16 + 8, dir: 0, look: npcLook(961, { hair: 10, hairCol: 6, beard: 0, top: 5, topCol: 12, pants: 3, pantsCol: 2, shoes: 3, shoesCol: 4, jewel: 4, glasses: 0, hat: 0, print: 0, acc: 0 }), talk: () => Story.dancer(), keepDir: true, danceIdle: true, solid: true });
  m.npcDefs.push({ id: 'dancer2', name: 'Vanessa', x: 9 * 16 + 8, y: 4 * 16 + 8, dir: 0, look: npcLook(962, { hair: 7, hairCol: 0, beard: 0, top: 5, topCol: 4, pants: 3, pantsCol: 2, shoes: 3, shoesCol: 1, jewel: 3, glasses: 0, hat: 0, print: 0, acc: 0 }), talk: () => Story.dancer(), keepDir: true, danceIdle: true, solid: true });
  /* Bar rechts */
  m.add(objCounter(11, 5, 4, 1, { top: '#2a0e18', front: '#1a0810', glasses: 3 }));
  m.trig(11, 5, 4, 1, { label: 'Bar: Bestellen', act: () => Story.shop('rouge') });
  m.npcDefs.push({ id: 'rougebar', name: 'Jacky', x: 13 * 16 + 8, y: 4 * 16 + 10, dir: 0, look: npcLook(963, { hair: 16, hairCol: 7, beard: 0, top: 1, topCol: 16, jewel: 4, glasses: 0, hat: 0 }), talk: () => Story.shop('rouge'), keepDir: true });
  for (const x of [11, 13]) m.add(objStool(x, 6, '#ff5aa0'));
  /* Sofas und Tischchen */
  m.add(objSofa(1, 6, 3, '#6a1a30')); m.add(objSofa(1, 9, 3, '#6a1a30')); m.add(objSofa(11, 9, 3, '#6a1a30'));
  m.add(objTable(2, 7, 1, 1, { col: '#2a1a20', round: true })); m.add(objTable(12, 10, 1, 1, { col: '#2a1a20', round: true }));
  m.add(objPlant(14, 1)); m.add(objPlant(1, 1));
  m.trig(5, 5, 6, 1, { label: 'An die Bühne', act: () => Story.stageFront() });
  /* Am Tisch rechts: Hakan Yakin und Xherdan Shaqiri diskutieren über Fussball */
  m.npcDefs.push({ id: 'yakin', name: 'Hakan Yakin', x: 11 * 16 + 8, y: 9 * 16 + 12, dir: 0, pose: 'sit', look: npcLook(1401, { skin: 4, hair: 2, hairCol: 0, beard: 1, beardCol: 0, build: 1, height: 1, top: 9, topCol: 16, pants: 5, pantsCol: 2, hat: 0, glasses: 0, print: 0, acc: 3, costume: 0 }), talk: () => Story.fussballTisch(), keepDir: true, sitIdle: true, drinkIdle: true, bubbleRand: ['dots', 'beer'] });
  m.npcDefs.push({ id: 'shaqiri', name: 'Xherdan Shaqiri', x: 13 * 16 + 8, y: 9 * 16 + 12, dir: 0, pose: 'sit', look: npcLook(1402, { skin: 5, hair: 4, hairCol: 0, beard: 7, beardCol: 0, build: 3, height: 0, top: 6, topCol: 0, pants: 4, pantsCol: 2, hat: 0, glasses: 0, print: 0, acc: 0, costume: 0 }), talk: () => Story.fussballTisch(), keepDir: true, sitIdle: true, drinkIdle: true, bubbleRand: ['dots', 'note'] });
  m.trig(12, 10, 1, 1, { label: 'Zu Hakan und Xherdan setzen', act: () => Story.fussballTisch() });
  doorBottom(m, 7, 2, 'ibk', 'rouge_out', 'Ausgang');
  m.spawn('entry', 7, 10, 3);
  m.light(2 * 16 + 8, 7 * 16, 30, '#ff8ac0'); m.light(12 * 16 + 8, 9 * 16, 30, '#ff8ac0');
  return m;
};
/* ----------- Club Lawine ----------- */
MAP_BUILDERS.club = () => {
  const m = new GMap('club', 24, 18, { name: 'Club Lawine', indoor: true, wallStyle: { cap: '#0e0c14' }, music: 'disco', bg: '#08070c' });
  roomShell(m, 3, { floor: T.DARK });
  m.fill(7, 6, 10, 6, T.LED);
  m.decal((c) => { pxText(c, 'LAWINE', 10 * 16 + 2, 16 + 6, '#e85af0'); pxText(c, 'LAWINE', 10 * 16 + 1, 16 + 5, '#ffd0ff'); DECAL.shelf(c, 18 * 16, 16 + 6, 80); pxText(c, 'RAUCHERHOF', 1 * 16 + 4, 11 * 16 + 4, '#7ad0f0'); });
  m.add(objDJ(10, 4)); m.add(objSpeaker(8, 3)); m.add(objSpeaker(15, 3)); m.add(objSpeaker(1, 3)); m.add(objSpeaker(22, 3));
  m.npcDefs.push({ id: 'dj', name: 'DJ Firn', x: 11 * 16 + 16, y: 3 * 16 + 14, dir: 0, look: npcLook(941, { hat: 2, hatCol: 0, top: 3, topCol: 16, glasses: 4, beard: 1 }), talk: () => Story.dj(), keepDir: true, danceIdle: true, solid: true });
  m.add(objCounter(18, 5, 5, 1, { top: '#2a2830', front: '#14121a', glasses: 4 }));
  m.trig(18, 5, 5, 1, { label: 'Clubbar: Bestellen', act: () => Story.shop('club') });
  m.npcDefs.push({ id: 'clubbar', name: 'Bardame Mira', x: 20 * 16 + 8, y: 4 * 16 + 10, dir: 0, look: npcLook(942, { hair: 10, hairCol: 13, beard: 0, top: 5, topCol: 16, jewel: 4 }), talk: () => Story.shop('club'), keepDir: true });
  for (const x of [18, 20, 22]) m.add(objStool(x, 6, '#c23ad0'));
  m.add(objSofa(1, 6, 3, '#4a2a5a')); m.add(objSofa(1, 9, 3, '#4a2a5a'));
  m.trig(7, 6, 10, 6, { here: true, label: 'Tanzen', act: () => Story.dance() });
  /* Raucherraum (Glaswand) */
  for (let x = 1; x <= 6; x++) m.solid(x, 11, 1, 1);
  for (let y = 12; y <= 16; y++) if (y !== 14) m.solid(7, y, 1, 1);
  m.add(mkObj(1, 11, 6, 1, 14, (c, W, H) => { R(c, 0, 4, W, H - 4, 'rgba(140,200,230,0.18)'); R(c, 0, 4, W, 1, '#9ad0f0'); R(c, 0, H - 2, W, 2, '#5a6a7a'); for (let k = 0; k < W; k += 16) R(c, k, 4, 1, H - 4, '#7ab0d0'); }, { solid: false }));
  m.add(mkObj(7, 12, 1, 5, 14, (c, W, H) => { R(c, 6, 0, 3, H, 'rgba(140,200,230,0.25)'); R(c, 6, 0, 1, H, '#9ad0f0'); c.clearRect(0, 2 * 16 + 2, W, 16); R(c, 5, 2 * 16 + 14, 5, 2, '#7ab0d0'); }, { solid: false, sortOff: 60 }));
  m.add(objTable(2, 13, 2, 1, { col: '#3a3640', round: true })); m.add(objTable(4, 15, 2, 1, { col: '#3a3640', round: true }));
  m.fill(1, 12, 6, 5, T.PAVE, 1);
  m.trig(1, 12, 6, 5, { here: true, label: 'Eine rauchen (Raucherhof)', act: () => Story.smoke() });
  m.add(mkObj(6, 12, 1, 1, 10, (c, W, H) => { R(c, 2, 0, 12, H - 1, '#5a5e64'); R(c, 4, 3, 8, 8, '#1a1a1e'); for (let k = 0; k < 4; k++) R(c, 4 + k * 2, 13, 1, 6, '#c8c8c8'); R(c, 4, 4, 8, 2, '#7ad0f0'); }));
  /* Garderobe */
  m.add(objCounter(18, 14, 4, 1, { top: '#2a2830', front: '#14121a' }));
  m.trig(18, 14, 4, 1, { label: 'Garderobe', act: () => Story.coatcheck() });
  m.add(mkObj(18, 15, 4, 1, 14, (c, W) => { R(c, 0, 4, W, 2, '#6a6e74'); for (let k = 2; k < W; k += 6) { R(c, k, 6, 5, 12, ['#3a3c40', '#7a2f3a', '#2f4a7a', '#5a6234'][k % 4]); } }, { solid: true }));
  doorBottom(m, 11, 2, 'ibk', 'club_out', 'Ausgang');
  m.pedZones.push({ x: 7, y: 6, w: 10, h: 6, n: 11, dance: true }, { x: 18, y: 6, w: 5, h: 2, n: 3, drink: true }, { x: 1, y: 7, w: 3, h: 1, n: 2, sit: true }, { x: 1, y: 12, w: 5, h: 4, n: 3, drink: true });
  m.spawn('entry', 11, 16, 3);
  m.ambient = 0.38;
  m.groundAnim = (c, cx, cy, t) => {
    const beat = Math.floor(t * 124 / 60);
    for (let y = 6; y < 12; y++) for (let x = 7; x < 17; x++) {
      const h = (hash(x, y, beat) + Math.sin((x + y) * 0.5 + t * 3) * 0.3);
      const col = ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7a3aff', '#3aff8a'][Math.floor(Math.abs(h) * 5) % 5];
      c.globalAlpha = 0.35 + 0.35 * ((x + y + beat) % 2);
      R(c, x * 16 + 1 - cx, y * 16 + 1 - cy, 14, 14, col);
    }
    c.globalAlpha = 1;
  };
  m.dynLights = () => { const t = G.t; return [0, 1, 2, 3].map((i) => ({ x: (12 + Math.sin(t * 0.9 + i * 1.7) * 6) * 16, y: (8 + Math.cos(t * 1.1 + i) * 3) * 16, r: 44, c: ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7a3aff'][i] })).concat([{ x: 20 * 16, y: 5 * 16, r: 50, c: '#e85af0' }, { x: 3 * 16, y: 14 * 16, r: 40, c: '#7ad0f0' }]); };
  m.postOverlay = (c, cx, cy, t) => {
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      const a = t * 0.8 + i * 2.1, ox = 12 * 16 - cx, oy = 3 * 16 - cy;
      c.fillStyle = rgba(['#ff3ad0', '#3ae0ff', '#ffe03a'][i], 0.08);
      c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + Math.cos(a) * 260 - 30, oy + Math.abs(Math.sin(a)) * 220 + 40); c.lineTo(ox + Math.cos(a) * 260 + 30, oy + Math.abs(Math.sin(a)) * 220 + 40); c.closePath(); c.fill();
    }
    c.globalCompositeOperation = 'source-over';
    if (Math.floor(t * 124 / 60) % 16 === 0 && (t * 124 / 60) % 1 < 0.15) { c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(0, 0, View.w, View.h); }
  };
  return m;
};
/* ----------- Seegrube ----------- */
/* Frühstücksbuffet: Tischtuch, Brotkorb, Gipfeli, Käse und Schinken, Eier, Früchte, Säfte, Müesli, Kaffee */
function objBuffet(x, y, w = 3) {
  return mkObj(x, y, w, 1, 18, (c, W, H) => {
    R(c, 0, 10, W, H - 10, '#f4f2ec'); R(c, 0, 10, W, 2, '#ffffff'); R(c, 0, H - 4, W, 4, '#6a4428'); for (let k = 0; k < W; k += 6) R(c, k, 12, 3, H - 16, '#e8e4dc');
    /* Brotkorb mit Semmeln */
    R(c, 2, 6, 11, 6, '#8a5a32'); R(c, 3, 7, 9, 4, '#a87a4a'); E(c, 5, 6, 2, 1.5, '#d8a060'); E(c, 8, 5, 2, 1.5, '#e0b070'); E(c, 11, 6, 2, 1.5, '#d8a060'); E(c, 6, 4, 2, 1.5, '#e8c080');
    /* Gipfeli */
    for (let k = 0; k < 2; k++) { E(c, 16 + k * 5, 8, 2.5, 1.5, '#e0a040'); P(c, 15 + k * 5, 7, '#f0c060'); P(c, 18 + k * 5, 7, '#f0c060'); }
    /* Käse- und Schinkenplatte */
    E(c, 28, 9, 6, 3, '#f8f8f4'); R(c, 24, 7, 4, 3, '#f2d050'); R(c, 29, 7, 4, 3, '#f2c040'); R(c, 26, 5, 5, 2, '#f0a0a8'); R(c, 30, 5, 3, 2, '#e88a98');
    /* Eier im Becher */
    for (let k = 0; k < 2; k++) { R(c, 37 + k * 4, 8, 3, 3, '#f4f0e6'); E(c, 38 + k * 4, 6, 1.5, 2, '#fff8e0'); P(c, 38 + k * 4, 5, '#f2c030'); }
    /* Früchteschale */
    E(c, 50, 9, 6, 3, '#4a6a8a'); for (let k = 0; k < 5; k++) P(c, 46 + k * 2, 6 - (k % 2), ['#e03030', '#60b040', '#f0a020', '#e03030', '#f0d040'][k]); P(c, 50, 5, '#60b040');
    if (W > 56) {
      /* Saftkrüge */
      R(c, 58, 2, 4, 9, '#f0a020'); R(c, 58, 2, 4, 1, '#f8f8f4'); R(c, 62, 4, 1, 4, '#c88010'); R(c, 64, 2, 4, 9, '#c83040'); R(c, 64, 2, 4, 1, '#f8f8f4'); R(c, 68, 4, 1, 4, '#a02030');
      /* Müesli und Kaffeekanne */
      R(c, 72, 3, 6, 8, '#d8e8f0'); R(c, 73, 6, 4, 4, '#d8b070'); R(c, 72, 3, 6, 1, '#8aa0b0');
      R(c, 82, 1, 6, 10, '#c9ccd2'); R(c, 83, 0, 4, 1, '#8a8e94'); R(c, 88, 3, 2, 5, '#8a8e94'); R(c, 84, 11, 2, 1, '#2a2a2e');
      /* Schild */
      R(c, 36, 0, 28, 7, '#f4f2ec'); R(c, 36, 0, 28, 1, '#c9c5bd'); pxText(c, 'BUFFET', 38, 1, '#6a4428');
    }
  }, { solid: true });
}
/* Haltestellen-Schild (grünes H) mit Zielanzeige */
function objTramStop(x, y, txt) {
  return mkObj(x, y, 1, 1, 22, (c, W, H) => {
    const cx = W / 2;
    R(c, cx - 1, 6, 2, H - 7, '#5a5e64'); R(c, cx - 7, 0, 14, 10, '#1f7a3a'); R(c, cx - 6, 1, 12, 8, '#2f9a4a'); pxText(c, 'H', cx - 3, 2, '#ffe84a');
    const tw = pxTextW(txt) + 4; R(c, cx - tw / 2, 11, tw, 7, '#f4f0e6'); R(c, cx - tw / 2, 11, tw, 1, '#c9c5bd'); pxText(c, txt, cx - tw / 2 + 2, 12, '#1a1a1e');
  }, { solid: true, padX: 12 });
}
/* Bergiselschanze: Turm (Zaha Hadid), Anlaufspur, Aufsprunghügel, Stadion – ein grosses Sprite */
function objSchanze(x, y) {
  return mkObj(x, y, 12, 4, 120, (c, W, H) => {
    /* Hang hinter der Schanze */
    for (let yy = 40; yy < H; yy++) R(c, 0, yy, W, 1, mix('#c9d8e6', '#eef3f8', (yy - 40) / (H - 40)));
    for (let i = 0; i < 40; i++) { const fx = (i * 37) % W, fy = 44 + (i * 23) % (H - 60); if (fx > 24 && fx < 150 && fy < 120) continue; R(c, fx, fy, 1, 6, '#2e4a24'); R(c, fx - 2, fy - 3, 5, 3, '#3e6b32'); R(c, fx - 1, fy - 5, 3, 2, '#3e6b32'); }
    /* Anlaufspur vom Turm bis zum Schanzentisch */
    c.fillStyle = '#dde6ee'; c.beginPath(); c.moveTo(22, 22); c.lineTo(38, 22); c.lineTo(110, 112); c.lineTo(92, 114); c.closePath(); c.fill();
    c.fillStyle = '#f6f9fc'; c.beginPath(); c.moveTo(26, 23); c.lineTo(34, 23); c.lineTo(104, 111); c.lineTo(96, 112); c.closePath(); c.fill();
    line(c, 28, 24, 99, 111, '#8aa0b4'); line(c, 32, 24, 102, 111, '#8aa0b4');
    for (let k = 0; k < 9; k++) { const t = k / 9; R(c, 22 + t * 70, 26 + t * 86, 2, 4 + t * 10, '#9aa6b0'); }
    /* Schanzentisch */
    R(c, 92, 110, 20, 6, '#7a8690'); R(c, 92, 110, 20, 1, '#c9d2da');
    /* Aufsprunghügel mit K-Linie (rot) und Hillsize (blau) */
    c.fillStyle = '#f2f6fa'; c.beginPath(); c.moveTo(84, 116); c.lineTo(118, 116); c.lineTo(176, H - 10); c.lineTo(36, H - 10); c.closePath(); c.fill();
    for (let k = 0; k < 7; k++) { const yy = 124 + k * 8; const wL = 84 - k * 7, wR = 118 + k * 8; line(c, wL, yy, wR, yy, k === 3 ? '#e03a3a' : k === 4 ? '#3a6ae0' : '#d6e0ea'); if (k === 3) pxText(c, 'K120', wR + 2, yy - 3, '#e03a3a'); if (k === 4) pxText(c, 'HS128', wR + 2, yy - 3, '#3a6ae0'); }
    /* Turm: schlanker Schaft, geschwungener Kopf mit Café und Panoramafenstern */
    R(c, 10, 18, 14, 112, '#d0d6dc'); R(c, 10, 18, 4, 112, '#b8c0c8'); R(c, 20, 18, 4, 112, '#e6eaee');
    for (let k = 0; k < 9; k++) R(c, 15, 30 + k * 11, 4, 5, '#5a6a7a');
    c.fillStyle = '#e8ecef'; c.beginPath(); c.moveTo(2, 20); c.quadraticCurveTo(0, 0, 22, 2); c.lineTo(40, 2); c.quadraticCurveTo(50, 2, 48, 14); c.lineTo(44, 24); c.lineTo(6, 24); c.closePath(); c.fill();
    R(c, 8, 8, 34, 7, '#3a5068'); for (let k = 0; k < 8; k++) R(c, 9 + k * 4, 9, 3, 5, '#7ab0d8');
    R(c, 6, 15, 38, 2, '#c9ccd2'); R(c, 18, 2, 2, 6, '#c9ccd2'); R(c, 16, 0, 6, 2, '#c8302a');
    E(c, 25, 24, 20, 4, 'rgba(0,0,0,0.18)');
    /* Flutlichtmasten und Fahnen */
    for (const fx of [60, 150]) { R(c, fx, 100, 2, 60, '#4a4e54'); R(c, fx - 5, 96, 12, 5, '#2a2e34'); for (let k = 0; k < 3; k++) R(c, fx - 4 + k * 4, 97, 3, 3, '#ffe8a0'); }
    for (let k = 0; k < 6; k++) { const fx = 40 + k * 26; R(c, fx, H - 36, 1, 26, '#5a5e64'); const col = ['#c8352d', '#ffffff', '#c8352d', '#ffffff', '#c8352d', '#2f5fb8'][k]; R(c, fx + 1, H - 36, 8, 5, col); if (k === 5) { R(c, fx + 4, H - 35, 2, 3, '#ffffff'); R(c, fx + 3, H - 34, 4, 1, '#ffffff'); } }
    pxText(c, 'BERGISEL', 76, H - 24, '#1a1a2e');
  }, { solid: true, emit: (c, W, H) => { for (const fx of [60, 150]) for (let k = 0; k < 3; k++) R(c, fx - 4 + k * 4, 97, 3, 3, '#fff4c0'); for (let k = 0; k < 8; k++) R(c, 9 + k * 4, 9, 3, 5, '#ffe09a'); } });
}
/* Tribüne mit Zuschauern */
function objTribune(x, y, w, side) {
  return mkObj(x, y, w, 3, 20, (c, W, H) => {
    const r = rng(x * 7 + y);
    for (let k = 0; k < 5; k++) { const yy = 4 + k * 9; R(c, 0, yy, W, 9, k % 2 ? '#8a8e94' : '#9aa0a6'); R(c, 0, yy, W, 1, '#c9ccd2'); for (let px = 2; px < W - 3; px += 4) { if (r() < 0.25) continue; const col = ['#c8352d', '#2f5fb8', '#e8c23a', '#f4f0e6', '#3a3c40', '#7a2f3a'][r() * 6 | 0]; R(c, px, yy + 2, 3, 5, col); R(c, px, yy, 3, 2, '#e8c8a0'); } }
    R(c, 0, H - 4, W, 4, '#5a5e64');
    if (side < 0) R(c, W - 2, 0, 2, H, '#5a5e64'); else R(c, 0, 0, 2, H, '#5a5e64');
  }, { solid: true });
}
/* Andreas-Hofer-Denkmal (1893): Bronzefigur auf Granitsockel */
function objHofer(x, y) {
  return mkObj(x, y, 2, 1, 44, (c, W, H) => {
    E(c, 16, H - 2, 14, 3, 'rgba(0,0,0,0.2)');
    R(c, 4, H - 22, 24, 20, '#8a8e94'); R(c, 6, H - 24, 20, 3, '#a8acb2'); R(c, 4, H - 22, 24, 1, '#c9ccd2');
    R(c, 8, H - 14, 16, 6, '#6a6e74'); pxText(c, 'HOFER', 7, H - 13, '#e8e4dc');
    R(c, 13, H - 42, 6, 10, '#4a6a5a'); R(c, 11, H - 36, 10, 12, '#4a6a5a'); R(c, 12, H - 48, 8, 7, '#5a7a6a'); R(c, 11, H - 50, 10, 3, '#3a5a4a');
    R(c, 20, H - 46, 2, 22, '#3a5a4a'); R(c, 20, H - 50, 8, 5, '#c8352d'); R(c, 20, H - 50, 8, 2, '#f4f0e6');
    R(c, 9, H - 36, 3, 10, '#4a6a5a');
  }, { solid: true });
}
MAP_BUILDERS.bergisel = () => {
  const m = new GMap('bergisel', 30, 24, { name: 'Bergisel · 746 m', bg: '#2a3a2a' });
  m.fill(0, 0, 30, 24, T.SNOW, (x, y) => (hash(x, y, 5) > 0.72 ? 1 : 0));
  m.add(objMountains(0, 0, 30, 7, { drawH: 0, seed: 17 }));
  m.fill(0, 0, 30, 7, T.CLIFF);
  m.fill(0, 7, 30, 1, T.FOREST);
  m.add(objSchanze(9, 8));
  m.fill(7, 12, 16, 3, T.SNOW, 0);
  m.add(objTribune(3, 12, 4, -1)); m.add(objTribune(23, 12, 4, 1));
  m.fill(1, 15, 28, 2, T.GRAVEL); m.fill(6, 17, 2, 4, T.GRAVEL); m.fill(1, 20, 28, 1, T.GRAVEL);
  m.fill(0, 21, 30, 1, T.PAVE); m.fill(0, 22, 30, 2, T.ASPH); m.fill(0, 22, 30, 1, T.TRAMR);
  /* Kassa */
  const kassa = objBuilding(1, 16, 4, 2, { floors: 1, wall: '#d8dcdf', roof: '#5a5e64', roofType: 'flat', flowers: false, seed: 41, doors: [{ dx: 1, type: 'glass' }], allShop: true, goods: ['#c9d4dc'], sign: { text: 'KASSA', bg: '#c8302a', fg: '#ffffff' }, drawH: 6 });
  m.add(kassa);
  m.trig(2, 18, 1, 1, { label: 'Kassa: Eintritt und Panoramalift', act: () => Story.bergiselTicket() });
  m.trig(10, 12, 2, 1, { label: 'Panoramalift auf den Turm', act: () => Story.bergiselTower() });
  m.trig(13, 12, 5, 1, { label: 'Schanze: Gästespringen', act: () => Story.skijump() });
  m.trig(9, 15, 12, 2, { here: true, label: 'Foto: Bergiselschanze', act: () => Story.photo('bergisel'), cond: () => !G.S.photos.bergisel });
  m.add(objHofer(24, 16)); m.trig(23, 16, 4, 2, { label: 'Andreas-Hofer-Denkmal', act: () => Story.hofer() });
  const museum = objBuilding(21, 17, 8, 3, { floors: 1, wall: '#c9b8a0', roof: '#4a4e54', roofType: 'flat', flowers: false, seed: 43, doors: [{ dx: 3, type: 'glass' }], wins: 'tall', sign: { text: 'TIROL PANORAMA', bg: '#2a3a4a', fg: '#ffffff' }, drawH: 8 });
  m.add(museum);
  m.trig(24, 20, 1, 1, { label: 'Tirol Panorama: Riesenrundgemälde', act: () => Story.panoramaMuseum() });
  for (const [x, y, h] of [[0, 9, 34], [1, 11, 28], [28, 9, 30], [29, 11, 26], [0, 17, 24], [29, 15, 30], [14, 18, 20], [17, 18, 24], [11, 19, 18]]) m.add(objFir(x, y, h));
  m.add(objBench(9, 18, 0, '#8a5a32')); m.add(objBench(19, 18, 0, '#8a5a32'));
  for (const x of [4, 12, 20, 27]) m.add(objLamp(x, 21, 'new'));
  m.add(objTramStop(5, 21, 'STADT'));
  m.trig(4, 21, 3, 1, { label: 'Tram in die Stadt', act: () => Story.bergiselBack() });
  m.spawn('entry', 7, 21, 3);
  m.spawn('tower_out', 11, 13, 0);
  m.npcDefs.push(
    { id: 'trainer', name: 'Trainer Sepp', x: 15 * 16 + 8, y: 13 * 16 + 12, dir: 0, look: npcLook(930, { hat: 2, hatCol: 2, top: 10, topCol: 2, pants: 5, pantsCol: 8, beard: 2, beardCol: 0, glasses: 4 }), talk: () => Story.skijump(), keepDir: true, bubbleRand: ['dots', '!'] },
    { id: 'kassa', name: 'Kassierin Vroni', x: 2 * 16 + 8, y: 15 * 16 + 10, dir: 0, look: npcLook(931, { hair: 7, hairCol: 9, beard: 0, top: 4, topCol: 10, glasses: 7 }), talk: () => Story.bergiselTicket(), keepDir: true },
  );
  m.pedZones.push({ x: 8, y: 15, w: 14, h: 2, n: 4 });
  for (const [x, y] of [[12.5, 14], [18.5, 14]]) m.light(x * 16, y * 16, 70, '#fff4c0');
  m.light(11 * 16, 1 * 16 + 8, 36, '#ffe09a');
  m.vehicles.push(makeTram(22, 30, 0.3));
  m.birdSpots.push({ x: 1, y: 8, w: 6, h: 3, n: 3, kind: 'crow' });
  return m;
};
MAP_BUILDERS.seegrube = () => {
  const m = new GMap('seegrube', 30, 20, { name: 'Seegrube · 1.905 m', bg: '#8c8a86' });
  m.fill(0, 0, 30, 20, T.ROCK, (x, y) => (hash(x, y, 2) > 0.7 ? 1 : 0));
  m.add(objMountains(0, 0, 30, 6, { drawH: 0, seed: 11 }));
  m.fill(0, 0, 30, 6, T.CLIFF);
  m.fill(0, 6, 30, 2, T.MEADOW);
  m.fill(9, 8, 3, 8, T.GRAVEL); m.fill(2, 11, 26, 2, T.GRAVEL);
  m.fill(17, 11, 11, 3, T.DECK);
  m.fill(9, 15, 8, 3, T.DECK);
  m.fill(0, 18, 30, 2, T.CLIFF);
  for (let x = 0; x < 30; x++) if (x < 9 || x > 16) m.fill(x, 16, 1, 2, T.ROCK, 1);
  const station = objBuilding(2, 6, 6, 5, { floors: 2, wall: '#d8dcdf', roof: '#5a5e64', roofType: 'flat', flowers: false, seed: 31, doors: [{ dx: 3, type: 'glass' }], allShop: true, goods: ['#c9d4dc'], sign: { text: 'SEEGRUBE', bg: '#c8302a', fg: '#ffffff' }, drawH: 6,
    special: (c, W) => { R(c, W / 2 - 1, 0, 2, 10, '#3a3c40'); line(c, W / 2, 2, W + 30, -30, '#3a3c40'); } });
  m.add(station);
  m.trig(5, 10, 1, 1, { label: 'Seilbahn ins Tal', act: () => Story.cableDown() });
  const huette = objBuilding(18, 6, 9, 5, { floors: 2, wall: '#e8dcc4', roof: '#6a4428', trim: '#f4efe4', shutter: '#7a3a2a', seed: 32, doors: [{ dx: 4, col: '#5a3a24' }], wins: 'std', drawH: 10, sign: { text: 'RESTAURANT SEEGRUBE', bg: '#5a3a24', fg: '#f8e8c8' } });
  m.add(huette);
  m.trig(22, 10, 1, 1, { label: 'Hütte: Bestellen', act: () => Story.shop('huette') });
  for (const [x, c] of [[18, '#c8352d'], [22, '#2f5fb8'], [25, '#c8352d']]) m.add(objUmbrellaTable(x, 12, c));
  m.add(mkObj(9, 18, 8, 1, 10, (c, W, H) => { R(c, 0, 0, W, 4, '#6a6e74'); for (let k = 0; k < W; k += 6) R(c, k, 0, 2, H, '#5a5e64'); R(c, 0, 0, W, 1, '#9aa0a6'); }));
  m.add(mkObj(12, 16, 1, 1, 12, (c, W, H) => { R(c, 7, 8, 2, H - 9, '#3a3c40'); R(c, 3, 4, 10, 5, '#2f5fb8'); R(c, 2, 5, 2, 3, '#1a1a1e'); R(c, 4, H - 2, 8, 2, '#3a3c40'); }));
  m.trig(12, 16, 1, 1, { label: 'Durchs Fernrohr schauen', act: () => Story.telescope() });
  m.trig(13, 15, 3, 1, { here: true, label: 'Foto: Seegrube', act: () => Story.photo('seegrube'), cond: () => !G.S.photos.seegrube });
  m.trig(9, 15, 8, 3, { here: true, label: 'Juchzen!', act: () => Story.yodel() });
  for (const [x, y, h] of [[1, 14, 34], [4, 16, 28], [27, 15, 30], [25, 16, 26], [7, 14, 24], [29, 8, 30], [14, 8, 26]]) m.add(objFir(x, y, h));
  m.add(objBench(12, 13, 0, '#8a5a32'));
  m.birdSpots.push({ x: 2, y: 13, w: 5, h: 3, n: 3, kind: 'marmot' }, { x: 22, y: 7, w: 4, h: 1, n: 0 });
  m.pedZones.push({ x: 2, y: 11, w: 26, h: 2, n: 4 }, { x: 17, y: 11, w: 10, h: 3, n: 3 });
  m.spawn('entry', 5, 11, 0);
  return m;
};
