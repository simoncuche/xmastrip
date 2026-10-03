/* ============ Bodenkacheln ============ */
const T = {
  VOID: 0, COBBLE: 1, ASPH: 2, PAVE: 3, GRASS: 4, WATER: 5, BRIDGE: 6, STONE: 7, WOOD: 8, CARPET: 9, BATH: 10,
  PLAT: 11, RAIL: 12, LED: 13, DARK: 14, ROCK: 15, GRAVEL: 16, PLAZA: 17, TRAINF: 18, FLOWER: 19, ZEBRA: 20,
  DECK: 21, KIES: 22, WALL: 23, WALLF: 24, FOREST: 25, TRAMR: 26, EDGE: 27, MEADOW: 28, CLIFF: 29, STAIRS: 30,
  MARBLE: 31, HEDGE: 32, SAND: 33,
};
const SOLID_T = new Set([T.VOID, T.WATER, T.RAIL, T.WALL, T.WALLF, T.FOREST, T.FLOWER, T.CLIFF, T.HEDGE]);

function stoneRows(x, px, py, tx, ty, base, gap, rowH, wMin, wMax, seed) {
  R(x, px, py, 16, 16, gap);
  for (let r = 0; r < 16 / rowH; r++) {
    let cx = -Math.floor(hash(tx, ty * 7 + r, seed) * wMax);
    let k = 0;
    while (cx < 16) {
      const w = wMin + Math.floor(hash(tx * 13 + k, ty * 5 + r, seed + 1) * (wMax - wMin + 1));
      const c = shade(base, (hash(tx + k, ty + r, seed + 2) - 0.5) * 0.18);
      const x0 = Math.max(cx, 0), x1 = Math.min(cx + w - 1, 16);
      if (x1 > x0) { R(x, px + x0, py + r * rowH, x1 - x0, rowH - 1, c); P(x, px + x0, py + r * rowH, shade(c, 0.15)); }
      cx += w; k++;
    }
  }
}
const TILE_PAINT = {
  [T.VOID]: (x, px, py) => R(x, px, py, 16, 16, '#0a0c10'),
  [T.COBBLE]: (x, px, py, tx, ty, m, v) => {
    const base = ['#a39a8b', '#b19c86', '#8e8a84'][v] || '#a39a8b';
    stoneRows(x, px, py, tx, ty, base, shade(base, -0.35), 4, 3, 6, 11);
  },
  [T.ASPH]: (x, px, py, tx, ty, m, v) => {
    R(x, px, py, 16, 16, '#5a5d62');
    for (let i = 0; i < 14; i++) P(x, px + Math.floor(hash(tx, ty, i) * 16), py + Math.floor(hash(ty, tx, i + 40) * 16), hash(tx, i, ty) > 0.5 ? '#63666b' : '#505357');
    if (v === 1 && tx % 3 !== 0) R(x, px, py + 7, 16, 2, '#e9e6dc');
    if (v === 2) R(x, px, py + 7, 16, 2, '#e3c24a');
    if (v === 3 && tx % 2 === 0) R(x, px + 2, py + 2, 12, 12, '#4f5256');
  },
  [T.PAVE]: (x, px, py, tx, ty, m, v) => {
    const base = ['#c3bcae', '#b9b2a4', '#d3cbbb'][v] || '#c3bcae';
    R(x, px, py, 16, 16, base);
    const line = shade(base, -0.13);
    R(x, px, py, 16, 1, line); R(x, px, py + 8, 16, 1, line); R(x, px + ((ty % 2) ? 4 : 12), py, 1, 8, line); R(x, px + ((ty % 2) ? 12 : 4), py + 8, 1, 8, line);
    if (hash(tx, ty, 3) > 0.85) P(x, px + 5, py + 11, shade(base, -0.25));
    const below = m.at(tx, ty + 1);
    if (below === T.ASPH || below === T.TRAMR || below === T.ZEBRA) { R(x, px, py + 14, 16, 2, '#8d887e'); R(x, px, py + 13, 16, 1, '#ddd6c8'); }
    const above = m.at(tx, ty - 1);
    if (above === T.ASPH || above === T.TRAMR) R(x, px, py, 16, 2, '#9a958a');
  },
  [T.GRASS]: (x, px, py, tx, ty, m, v) => {
    const base = ['#6c9a47', '#6c9a47', '#5c8a3e', '#7a9a4a'][v] || '#6c9a47';
    R(x, px, py, 16, 16, base);
    for (let i = 0; i < 18; i++) { const gx = Math.floor(hash(tx, ty, i) * 16), gy = Math.floor(hash(ty, tx, i + 9) * 15); P(x, px + gx, py + gy, shade(base, -0.18)); P(x, px + gx, py + gy + 1, shade(base, 0.08)); }
    if (v === 1) for (let i = 0; i < 4; i++) { const gx = Math.floor(hash(tx, ty, i + 50) * 14) + 1, gy = Math.floor(hash(ty, tx, i + 60) * 14) + 1; P(x, px + gx, py + gy, ['#f2f2f2', '#f3d24a', '#e86a8a', '#b98ae0'][i]); }
    if (v === 3) for (let i = 0; i < 5; i++) { const gx = Math.floor(hash(tx, ty, i + 70) * 15), gy = Math.floor(hash(ty, tx, i + 80) * 15); P(x, px + gx, py + gy, ['#d8a33a', '#c9612a', '#e0b84a', '#a8482a', '#d49a2a'][i]); }
  },
  [T.WATER]: (x, px, py, tx, ty, m, v) => {
    const deep = v === 1 ? '#3f86a8' : '#2f6e8f';
    R(x, px, py, 16, 16, deep);
    for (let i = 0; i < 4; i++) R(x, px + Math.floor(hash(tx, ty, i) * 12), py + Math.floor(hash(ty, tx, i) * 15), 4, 1, shade(deep, 0.12));
    const up = m.at(tx, ty - 1), dn = m.at(tx, ty + 1);
    if (up !== T.WATER && up !== T.BRIDGE) { R(x, px, py, 16, 5, '#9f988c'); R(x, px, py, 16, 1, '#c9c2b4'); for (let k = 0; k < 16; k += 5) R(x, px + k, py + 1, 1, 4, '#857e72'); R(x, px, py + 5, 16, 2, shade(deep, -0.25)); }
    if (dn !== T.WATER && dn !== T.BRIDGE) { R(x, px, py + 13, 16, 3, '#8e877b'); R(x, px, py + 12, 16, 1, shade(deep, 0.2)); }
    const lf = m.at(tx - 1, ty), rt = m.at(tx + 1, ty);
    if (lf !== T.WATER && lf !== T.BRIDGE && lf !== T.VOID) R(x, px, py, 2, 16, '#8e877b');
    if (rt !== T.WATER && rt !== T.BRIDGE && rt !== T.VOID) R(x, px + 14, py, 2, 16, '#8e877b');
  },
  [T.BRIDGE]: (x, px, py, tx, ty, m, v) => {
    if (v === 1) { R(x, px, py, 16, 16, '#8a6a46'); for (let k = 0; k < 16; k += 4) { R(x, px, py + k, 16, 1, '#6e5236'); P(x, px + (hash(tx, ty + k, 2) * 14 | 0), py + k + 2, '#9e7c56'); } return; }
    stoneRows(x, px, py, tx, ty, '#a8a299', '#7c776e', 8, 6, 10, 3);
  },
  [T.STONE]: (x, px, py, tx, ty, m, v) => {
    const base = ['#d6cfc1', '#c9c2b5', '#e0d9cc'][v] || '#d6cfc1';
    R(x, px, py, 16, 16, base);
    R(x, px, py, 16, 1, shade(base, -0.1)); R(x, px, py, 1, 16, shade(base, -0.1));
    P(x, px + 3, py + 3, shade(base, 0.2)); P(x, px + 4, py + 4, shade(base, 0.2));
    if (hash(tx, ty) > 0.7) line(x, px + 9, py + 5, px + 13, py + 9, shade(base, -0.05));
  },
  [T.WOOD]: (x, px, py, tx, ty, m, v) => {
    const base = ['#b58654', '#6b4528', '#d9a96c', '#8a5c34'][v] || '#b58654';
    R(x, px, py, 16, 16, base);
    for (let k = 0; k < 4; k++) {
      const yy = py + k * 4;
      R(x, px, yy + 3, 16, 1, shade(base, -0.3));
      const seam = Math.floor(hash(tx, ty * 4 + k, 5) * 16);
      R(x, px + seam, yy, 1, 3, shade(base, -0.25));
      R(x, px, yy, 16, 1, shade(base, 0.06 * ((k + tx) % 2)));
      if (v === 2 && hash(tx, ty + k, 8) > 0.6) { P(x, px + ((seam + 6) % 16), yy + 1, shade(base, -0.4)); }
    }
  },
  [T.CARPET]: (x, px, py, tx, ty, m, v) => {
    const base = ['#8e2f34', '#2f5e4a', '#2c3e6e', '#5a3a5e'][v] || '#8e2f34';
    R(x, px, py, 16, 16, base);
    const d = shade(base, -0.22), l = shade(base, 0.18);
    for (let k = 0; k < 16; k += 8) for (let j = 0; j < 16; j += 8) { P(x, px + k + 4, py + j + 2, l); P(x, px + k + 3, py + j + 3, l); P(x, px + k + 5, py + j + 3, l); P(x, px + k + 4, py + j + 4, l); P(x, px + k + 4, py + j + 3, d); }
    for (let i = 0; i < 6; i++) P(x, px + (hash(tx, ty, i) * 16 | 0), py + (hash(ty, tx, i) * 16 | 0), d);
  },
  [T.BATH]: (x, px, py) => { R(x, px, py, 16, 16, '#e8ecee'); for (let k = 0; k < 16; k += 4) { R(x, px + k, py, 1, 16, '#c9d1d6'); R(x, px, py + k, 16, 1, '#c9d1d6'); } },
  [T.PLAT]: (x, px, py, tx, ty) => {
    R(x, px, py, 16, 16, '#b7b3aa');
    for (let i = 0; i < 10; i++) P(x, px + (hash(tx, ty, i) * 16 | 0), py + (hash(ty, tx, i) * 16 | 0), hash(i, tx, ty) > 0.5 ? '#a8a49b' : '#c4c0b8');
    if (tx % 4 === 0) R(x, px, py, 1, 16, '#a19d94');
  },
  [T.RAIL]: (x, px, py, tx, ty) => {
    R(x, px, py, 16, 16, '#77695a');
    for (let i = 0; i < 26; i++) P(x, px + (hash(tx, ty, i) * 16 | 0), py + (hash(ty, tx, i) * 16 | 0), ['#8a7c6a', '#5f5347', '#9a8d7a'][i % 3]);
    for (let k = 0; k < 16; k += 4) R(x, px + k, py + 2, 2, 12, '#4a3a2c');
    R(x, px, py + 4, 16, 2, '#b8bcc2'); R(x, px, py + 5, 16, 1, '#6f747a');
    R(x, px, py + 11, 16, 2, '#b8bcc2'); R(x, px, py + 12, 16, 1, '#6f747a');
  },
  [T.LED]: (x, px, py) => { R(x, px, py, 16, 16, '#1a1824'); R(x, px + 1, py + 1, 14, 14, '#25222f'); },
  [T.DARK]: (x, px, py, tx, ty) => { R(x, px, py, 16, 16, '#1e1c26'); for (let i = 0; i < 5; i++) P(x, px + (hash(tx, ty, i) * 16 | 0), py + (hash(ty, tx, i) * 16 | 0), '#2b2836'); },
  [T.ROCK]: (x, px, py, tx, ty, m, v) => {
    R(x, px, py, 16, 16, '#9a958c');
    for (let i = 0; i < 9; i++) { const sx = hash(tx, ty, i) * 14 | 0, sy = hash(ty, tx, i) * 14 | 0; R(x, px + sx, py + sy, 2 + (i % 2), 2, shade('#9a958c', hash(i, tx, ty) > 0.5 ? 0.15 : -0.18)); }
    if (v === 1 && hash(tx, ty, 99) > 0.5) E(x, px + 8, py + 8, 5, 3, '#f1f3f5');
  },
  [T.GRAVEL]: (x, px, py, tx, ty) => { R(x, px, py, 16, 16, '#c2b59a'); for (let i = 0; i < 22; i++) P(x, px + (hash(tx, ty, i) * 16 | 0), py + (hash(ty, tx, i) * 16 | 0), ['#a99b80', '#d4c8ae', '#9a8d74'][i % 3]); },
  [T.PLAZA]: (x, px, py, tx, ty, m, v) => {
    const base = ['#d3cabb', '#c7bead', '#bfb5a3'][v] || '#d3cabb';
    R(x, px, py, 16, 16, base);
    R(x, px, py, 16, 1, shade(base, -0.12)); R(x, px, py, 1, 16, shade(base, -0.12));
    if ((tx + ty) % 2 === 0) R(x, px + 1, py + 1, 15, 15, shade(base, -0.04));
    if (hash(tx, ty, 4) > 0.8) P(x, px + 6, py + 9, shade(base, -0.2));
  },
  [T.TRAINF]: (x, px, py, tx, ty, m, v) => {
    if (v === 1) { R(x, px, py, 16, 16, '#3e4f73'); for (let k = 0; k < 16; k += 4) for (let j = 0; j < 16; j += 4) P(x, px + k + ((j / 4) % 2) * 2, py + j, '#4a5d85'); return; }
    R(x, px, py, 16, 16, '#565b63'); for (let k = 0; k < 16; k += 3) R(x, px, py + k, 16, 1, '#4d525a');
  },
  [T.FLOWER]: (x, px, py, tx, ty) => {
    R(x, px, py, 16, 16, '#5a3e2a'); R(x, px, py, 16, 2, '#9a958c'); R(x, px, py + 14, 16, 2, '#7d786f');
    for (let i = 0; i < 9; i++) { const fx = 1 + (hash(tx, ty, i) * 13 | 0), fy = 3 + (hash(ty, tx, i) * 9 | 0); R(x, px + fx, py + fy, 2, 2, '#3f7a34'); P(x, px + fx, py + fy - 1, ['#e8402e', '#f2c23a', '#e86ab0', '#ffffff', '#9a5ae0'][i % 5]); }
  },
  [T.ZEBRA]: (x, px, py) => { R(x, px, py, 16, 16, '#5a5d62'); R(x, px + 2, py, 5, 16, '#ece9e0'); R(x, px + 10, py, 5, 16, '#ece9e0'); },
  [T.DECK]: (x, px, py, tx, ty) => { R(x, px, py, 16, 16, '#9a774e'); for (let k = 0; k < 16; k += 4) { R(x, px + k + 3, py, 1, 16, '#73563a'); if (hash(tx, ty, k) > 0.6) P(x, px + k + 1, py + (hash(ty, tx, k) * 14 | 0), '#b08c62'); } },
  [T.KIES]: (x, px, py, tx, ty) => { R(x, px, py, 16, 16, '#a59d8e'); for (let i = 0; i < 16; i++) E(x, px + (hash(tx, ty, i) * 15 | 0), py + (hash(ty, tx, i) * 15 | 0), 1, 1, ['#c4bdb0', '#8a8375', '#b6aea0'][i % 3]); },
  [T.WALL]: (x, px, py, tx, ty, m, v) => {
    const st = m.wallStyle || {};
    const cap = st.cap || '#2c2420';
    R(x, px, py, 16, 16, cap);
    R(x, px, py, 16, 1, shade(cap, 0.18));
    const dn = m.at(tx, ty + 1);
    if (dn !== T.WALL && dn !== T.WALLF && dn !== T.VOID) { R(x, px, py + 12, 16, 4, shade(cap, 0.25)); R(x, px, py + 12, 16, 1, shade(cap, 0.4)); }
  },
  [T.WALLF]: (x, px, py, tx, ty, m, v) => paintWallFace(x, px, py, tx, ty, m, v),
  [T.FOREST]: (x, px, py, tx, ty) => {
    R(x, px, py, 16, 16, '#2c4a2a');
    for (let i = 0; i < 4; i++) { const cx = (hash(tx, ty, i) * 16) | 0, cy = (hash(ty, tx, i) * 16) | 0; E(x, px + cx, py + cy, 4, 4, i % 2 ? '#365a32' : '#24402a'); P(x, px + cx - 1, py + cy - 2, '#4a7040'); }
  },
  [T.TRAMR]: (x, px, py, tx, ty) => {
    TILE_PAINT[T.ASPH](x, px, py, tx, ty, null, 0);
    R(x, px, py + 4, 16, 1, '#a8acb2'); R(x, px, py + 5, 16, 1, '#3c3e42');
    R(x, px, py + 10, 16, 1, '#a8acb2'); R(x, px, py + 11, 16, 1, '#3c3e42');
  },
  [T.EDGE]: (x, px, py, tx, ty, m, v) => {
    TILE_PAINT[T.PLAT](x, px, py, tx, ty);
    if (v === 0) { R(x, px, py, 16, 3, '#e8e4d8'); R(x, px, py + 4, 16, 2, '#e8c22e'); for (let k = 0; k < 16; k += 2) P(x, px + k, py + 4, '#c9a21a'); }
    else { R(x, px, py + 13, 16, 3, '#e8e4d8'); R(x, px, py + 10, 16, 2, '#e8c22e'); for (let k = 0; k < 16; k += 2) P(x, px + k, py + 11, '#c9a21a'); }
  },
  [T.MEADOW]: (x, px, py, tx, ty) => {
    R(x, px, py, 16, 16, '#86a058');
    for (let i = 0; i < 14; i++) P(x, px + (hash(tx, ty, i) * 16 | 0), py + (hash(ty, tx, i) * 16 | 0), ['#6e8a46', '#9ab468', '#7a6a4a'][i % 3]);
    if (hash(tx, ty, 77) > 0.75) { R(x, px + 4, py + 9, 4, 3, '#a8a49c'); R(x, px + 4, py + 9, 4, 1, '#c9c5bd'); }
  },
  [T.CLIFF]: (x, px, py, tx, ty, m) => {
    R(x, px, py, 16, 16, '#7d786f');
    for (let k = 0; k < 16; k += 4) { R(x, px, py + k, 16, 1, '#5f5a52'); R(x, px + (hash(tx, ty, k) * 12 | 0), py + k + 1, 4, 2, '#948f86'); }
    const up = m.at(tx, ty - 1);
    if (up !== T.CLIFF) { R(x, px, py, 16, 3, '#9aa06a'); }
  },
  [T.STAIRS]: (x, px, py, tx, ty, m, v) => { const b = v === 1 ? '#8a6a46' : '#b5aea2'; R(x, px, py, 16, 16, b); for (let k = 0; k < 16; k += 4) { R(x, px, py + k, 16, 1, shade(b, 0.2)); R(x, px, py + k + 3, 16, 1, shade(b, -0.3)); } },
  [T.MARBLE]: (x, px, py, tx, ty) => { const a = (tx + ty) % 2 ? '#e9e4d8' : '#4a4e56'; R(x, px, py, 16, 16, a); line(x, px + 2, py + 3, px + 9, py + 12, shade(a, (tx + ty) % 2 ? -0.06 : 0.08)); },
  [T.HEDGE]: (x, px, py, tx, ty) => { R(x, px, py, 16, 16, '#3c6a34'); for (let i = 0; i < 10; i++) R(x, px + (hash(tx, ty, i) * 14 | 0), py + (hash(ty, tx, i) * 14 | 0), 2, 2, i % 2 ? '#4d8040' : '#2f5629'); R(x, px, py + 13, 16, 3, '#2a4a24'); },
  [T.SAND]: (x, px, py, tx, ty) => { R(x, px, py, 16, 16, '#d9c9a2'); for (let i = 0; i < 10; i++) P(x, px + (hash(tx, ty, i) * 16 | 0), py + (hash(ty, tx, i) * 16 | 0), '#c4b48c'); },
};
function paintWallFace(x, px, py, tx, ty, m, v) {
  const upper = m.at(tx, ty + 1) === T.WALLF;
  const s = v;
  if (s === 0) { // Hotel: Streifentapete + Holz
    if (upper) { R(x, px, py, 16, 16, '#e7dcc3'); for (let k = 0; k < 16; k += 4) R(x, px + k, py, 2, 16, '#ddd0b3'); R(x, px, py + 15, 16, 1, '#b79f78'); }
    else { R(x, px, py, 16, 16, '#7a4f30'); for (let k = 0; k < 16; k += 8) R(x, px + k, py + 2, 1, 10, '#5e3c24'); R(x, px, py, 16, 2, '#9a6a44'); R(x, px, py + 13, 16, 3, '#3e2818'); }
  } else if (s === 1) { // Bar: Ziegel oben, dunkles Holz unten
    if (upper) { R(x, px, py, 16, 16, '#8a4a36'); for (let r = 0; r < 4; r++) { R(x, px, py + r * 4 + 3, 16, 1, '#6a3626'); R(x, px + (r % 2 ? 4 : 12), py + r * 4, 1, 3, '#6a3626'); R(x, px + (r % 2 ? 12 : 4) - 8 + 8, py + r * 4, 1, 0, '#6a3626'); } }
    else { R(x, px, py, 16, 16, '#4a3020'); for (let k = 0; k < 16; k += 4) R(x, px + k, py, 1, 13, '#3a2418'); R(x, px, py, 16, 2, '#6a4a32'); R(x, px, py + 13, 16, 3, '#2a1a10'); }
  } else if (s === 2) { // Zirbenstube
    R(x, px, py, 16, 16, '#d8a468');
    for (let k = 0; k < 16; k += 5) R(x, px + k, py, 1, 16, '#b07e48');
    if (hash(tx, ty, 3) > 0.4) { E(x, px + 3 + (hash(tx, ty) * 8 | 0), py + 6 + (hash(ty, tx) * 6 | 0), 1, 1, '#8a5a2a'); }
    if (!upper) { R(x, px, py + 12, 16, 4, '#8a5a32'); R(x, px, py + 12, 16, 1, '#e8b880'); }
  } else if (s === 3) { // Club
    R(x, px, py, 16, 16, '#14121c'); for (let k = 0; k < 16; k += 8) R(x, px + k, py, 1, 16, '#1c1a26');
    if (!upper) { R(x, px, py + 13, 16, 1, '#c23ad0'); R(x, px, py + 14, 16, 2, '#0e0c14'); }
  } else if (s === 4) { // Fliesen
    R(x, px, py, 16, 16, '#dfe7ea'); for (let k = 0; k < 16; k += 4) { R(x, px + k, py, 1, 16, '#bfcad0'); R(x, px, py + k, 16, 1, '#bfcad0'); }
  } else if (s === 5) { // Zug innen
    R(x, px, py, 16, 16, '#d9dcdf'); R(x, px, py + (upper ? 0 : 12), 16, upper ? 2 : 4, '#a7adb4');
  } else if (s === 6) { // Bahnhofshalle Sandstein
    R(x, px, py, 16, 16, '#d8c8a4'); for (let r = 0; r < 4; r++) { R(x, px, py + r * 4 + 3, 16, 1, '#bba987'); R(x, px + (r % 2 ? 7 : 15), py + r * 4, 1, 3, '#bba987'); }
    if (!upper) { R(x, px, py + 12, 16, 4, '#9a8a6a'); }
  } else if (s === 7) { // Lobby grüne Tapete
    if (upper) { R(x, px, py, 16, 16, '#3f5e4c'); for (let k = 0; k < 16; k += 8) { P(x, px + k + 4, py + 4, '#c8b070'); P(x, px + k, py + 12, '#c8b070'); } R(x, px, py + 15, 16, 1, '#c8b070'); }
    else { R(x, px, py, 16, 16, '#6a4428'); R(x, px + 2, py + 2, 12, 9, '#7d5232'); R(x, px, py + 13, 16, 3, '#3e2818'); }
  } else if (s === 8) { // Hütte: Holzbalken
    R(x, px, py, 16, 16, '#7a5432'); for (let k = 0; k < 16; k += 4) { R(x, px, py + k, 16, 1, '#5a3c22'); R(x, px, py + k + 1, 16, 1, '#8e6640'); }
  } else { R(x, px, py, 16, 16, '#cfc6b4'); }
}

/* ============ Objekte (vorgerendert, nach y sortiert) ============ */
function mkObj(x, y, w, h, drawH, paint, extra = {}) {
  return Object.assign({ x, y, w, h, drawH, padX: 0, paint, solid: true }, extra);
}
/* --- Baum --- */
const TREE_PAL = {
  green: ['#3e6b32', '#4f8040', '#6a9e4c', '#2e5228'],
  autumn: ['#a8641e', '#c8842a', '#e0b048', '#7a4416'],
  yellow: ['#9c8a24', '#c2ae34', '#e2d062', '#6e6018'],
  red: ['#8a3a1e', '#b04a26', '#d47040', '#5e2414'],
};
function objTree(x, y, kind = 'green', big = false) {
  const R0 = big ? 15 : 12;
  return mkObj(x, y, 1, 1, big ? 32 : 26, (c) => {
    const W = 16 + 16, cx = 16;
    const pal = TREE_PAL[kind] || TREE_PAL.green;
    E(c, cx, (big ? 46 : 40) - 2, 8, 2, 'rgba(0,0,0,0.22)');
    const tb = big ? 47 : 41;
    R(c, cx - 2, tb - 14, 4, 14, '#5a3c26'); R(c, cx + 1, tb - 14, 1, 14, '#3e2818'); P(c, cx - 2, tb - 1, '#3e2818'); P(c, cx + 1, tb - 1, '#3e2818');
    const cy = R0 + 3;
    const blobs = [[0, 0, R0], [-R0 * 0.55, R0 * 0.25, R0 * 0.7], [R0 * 0.55, R0 * 0.3, R0 * 0.7], [0, R0 * 0.55, R0 * 0.65], [-R0 * 0.3, -R0 * 0.4, R0 * 0.6]];
    for (const [dx, dy, r] of blobs) E(c, cx + dx, cy + dy + 1, Math.round(r), Math.round(r * 0.9), pal[3]);
    for (const [dx, dy, r] of blobs) E(c, cx + dx, cy + dy, Math.round(r - 1), Math.round(r * 0.9 - 1), pal[0]);
    for (const [dx, dy, r] of blobs) E(c, cx + dx - 2, cy + dy - 2, Math.round(r * 0.55), Math.round(r * 0.45), pal[1]);
    for (let i = 0; i < 26; i++) { const a = hash(x, y, i) * 6.28, d = hash(y, x, i) * R0 * 0.9; P(c, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.9, i % 3 ? pal[2] : pal[3]); }
  }, { padX: 8, solid: true, sortOff: 0 });
}
function objFir(x, y, h = 30) {
  return mkObj(x, y, 1, 1, h, (c, W, H) => {
    const cx = 16;
    E(c, cx, H - 3, 7, 2, 'rgba(0,0,0,0.22)');
    R(c, cx - 1, H - 8, 3, 7, '#4a3020');
    const layers = Math.floor(h / 7);
    for (let i = 0; i < layers; i++) {
      const top = 2 + i * 6, wB = 3 + i * 2.2;
      for (let k = 0; k < 9; k++) { const w = Math.round(wB * (k / 8)); R(c, cx - w, top + k, w * 2 + 1, 1, k > 6 ? '#22402a' : '#2e5a34'); P(c, cx - w, top + k, '#1a3020'); }
      P(c, cx - 2, top + 4, '#4a7a48');
    }
  }, { padX: 8 });
}
function objBush(x, y, col = '#4f8040', flowers) {
  return mkObj(x, y, 1, 1, 4, (c, W, H) => {
    E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.2)');
    E(c, 8, H - 8, 7, 6, shade(col, -0.25)); E(c, 7, H - 9, 6, 5, col); E(c, 6, H - 11, 3, 2, shade(col, 0.2));
    if (flowers) for (let i = 0; i < 6; i++) P(c, 3 + (hash(x, y, i) * 10 | 0), H - 13 + (hash(y, x, i) * 9 | 0), flowers);
  });
}
/* --- Strassenlaterne (Altstadt) --- */
function objLamp(x, y, style = 'old') {
  const o = mkObj(x, y, 1, 1, 30, (c, W, H) => {
    E(c, 8, H - 2, 4, 1, 'rgba(0,0,0,0.25)');
    R(c, 6, H - 5, 4, 4, '#2a2c30'); R(c, 7, 8, 2, H - 12, '#34373c'); P(c, 7, 8, '#4a4e54');
    if (style === 'old') { R(c, 4, 1, 8, 2, '#2a2c30'); R(c, 5, 3, 6, 6, '#f2dc9a'); R(c, 5, 3, 1, 6, '#2a2c30'); R(c, 10, 3, 1, 6, '#2a2c30'); R(c, 7, 3, 2, 6, '#e8c870'); R(c, 4, 9, 8, 1, '#2a2c30'); R(c, 7, 0, 2, 1, '#2a2c30'); }
    else { R(c, 3, 3, 10, 2, '#34373c'); R(c, 4, 5, 8, 1, '#f4eecf'); }
  }, { emit: (c) => { if (style === 'old') R(c, 5, 3, 6, 6, '#ffe7a0'); else R(c, 4, 5, 8, 1, '#fff6d0'); } });
  o.light = { dx: 8, dy: 6, r: 46, c: '#ffd78a' };
  return o;
}
function objBench(x, y, dir = 0, col = '#8a5a32') {
  return mkObj(x, y, 2, 1, 6, (c, W, H) => {
    E(c, 16, H - 2, 14, 2, 'rgba(0,0,0,0.2)');
    R(c, 3, H - 6, 2, 6, '#2e3034'); R(c, W - 5, H - 6, 2, 6, '#2e3034');
    if (dir === 0) { R(c, 1, H - 13, W - 2, 3, col); R(c, 1, H - 13, W - 2, 1, shade(col, 0.2)); R(c, 1, H - 9, W - 2, 3, shade(col, -0.1)); R(c, 1, H - 6, W - 2, 1, shade(col, -0.35)); }
    else { R(c, 1, H - 10, W - 2, 3, col); R(c, 1, H - 7, W - 2, 3, shade(col, -0.15)); R(c, 1, H - 16, W - 2, 3, shade(col, -0.1)); R(c, 3, H - 16, 2, 6, '#2e3034'); R(c, W - 5, H - 16, 2, 6, '#2e3034'); }
  });
}
function objBin(x, y) { return mkObj(x, y, 1, 1, 6, (c, W, H) => { E(c, 8, H - 2, 4, 1, 'rgba(0,0,0,0.2)'); R(c, 4, H - 14, 8, 12, '#3a5a3a'); R(c, 4, H - 14, 8, 2, '#4f7a4f'); R(c, 5, H - 11, 1, 8, '#2e4a2e'); R(c, 8, H - 11, 1, 8, '#2e4a2e'); R(c, 5, H - 15, 6, 1, '#1e2a1e'); }); }
function objBollard(x, y) { return mkObj(x, y, 1, 1, 2, (c, W, H) => { E(c, 8, H - 3, 3, 1, 'rgba(0,0,0,0.2)'); R(c, 6, H - 12, 4, 10, '#3a3c40'); R(c, 6, H - 12, 4, 1, '#5a5e64'); R(c, 6, H - 9, 4, 1, '#d0b040'); }); }
function objPlanter(x, y, fl = '#e8402e') {
  return mkObj(x, y, 1, 1, 8, (c, W, H) => {
    E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.2)');
    R(c, 2, H - 10, 12, 8, '#8a7a62'); R(c, 2, H - 10, 12, 1, '#a8977c'); R(c, 2, H - 3, 12, 1, '#6a5c48');
    E(c, 8, H - 13, 6, 4, '#3f7a34'); for (let i = 0; i < 8; i++) P(c, 3 + (hash(x, y, i) * 10 | 0), H - 17 + (hash(y, x, i) * 6 | 0), i % 3 ? fl : '#ffffff');
  });
}
function objLitfass(x, y) {
  return mkObj(x, y, 1, 1, 26, (c, W, H) => {
    E(c, 8, H - 2, 6, 2, 'rgba(0,0,0,0.25)');
    R(c, 3, 8, 10, H - 10, '#c9c2b2');
    const cols = ['#d23a2a', '#2f6fb8', '#e8c23a', '#3f8e4b', '#e86ab0', '#f2f0ea'];
    for (let k = 0; k < 4; k++) { R(c, 3, 10 + k * 7, 10, 6, cols[(x + y + k) % 6]); R(c, 4, 12 + k * 7, 5, 1, '#1e1e22'); R(c, 4, 14 + k * 7, 7, 1, shade(cols[(x + y + k) % 6], -0.3)); }
    R(c, 11, 8, 2, H - 10, 'rgba(0,0,0,0.18)');
    R(c, 2, 5, 12, 3, '#3a4a3a'); R(c, 5, 2, 6, 3, '#3a4a3a'); R(c, 2, H - 3, 12, 2, '#3a4a3a');
  });
}
function objBikes(x, y) {
  return mkObj(x, y, 2, 1, 6, (c, W, H) => {
    R(c, 2, H - 4, W - 4, 1, '#6a6e74');
    for (let k = 0; k < 3; k++) {
      const bx = 3 + k * 9, col = ['#c8352d', '#2f5fb8', '#3a3c40'][k];
      for (const wx of [bx, bx + 6]) { E(c, wx, H - 6, 2, 3, '#1e1e22'); P(c, wx, H - 6, '#9a9ea4'); }
      line(c, bx, H - 6, bx + 3, H - 10, col); line(c, bx + 3, H - 10, bx + 6, H - 6, col); line(c, bx + 2, H - 12, bx + 3, H - 10, col); R(c, bx + 1, H - 13, 3, 1, '#2a2a2a'); R(c, bx + 5, H - 12, 2, 1, '#2a2a2a');
    }
  }, { solid: true });
}
function objUmbrellaTable(x, y, col = '#c8352d') {
  return mkObj(x, y, 2, 2, 18, (c, W, H) => {
    E(c, 16, H - 8, 11, 4, 'rgba(0,0,0,0.18)');
    R(c, 7, H - 14, 18, 6, '#e9e4d8'); R(c, 7, H - 9, 18, 1, '#b8b2a4');
    R(c, 3, H - 12, 4, 4, '#8a5a32'); R(c, 25, H - 12, 4, 4, '#8a5a32'); R(c, 14, H - 6, 4, 4, '#8a5a32');
    R(c, 15, 10, 2, H - 22, '#d9d4c8');
    for (let k = 0; k < 10; k++) { const w = Math.round(3 + k * 1.3); R(c, 16 - w, 2 + k, w * 2, 1, k % 3 === 2 ? shade(col, -0.2) : col); }
    for (let k = 0; k < 28; k += 4) R(c, 2 + k, 12, 2, 2, shade(col, -0.25));
  }, { padX: 0 });
}
function objCar(x, y, col = '#2f5fb8', dir = 'h') {
  return mkObj(x, y, 2, 1, 6, (c, W, H) => {
    E(c, 16, H - 2, 15, 2, 'rgba(0,0,0,0.3)');
    R(c, 1, H - 14, 30, 11, col); R(c, 1, H - 14, 30, 1, shade(col, 0.25)); R(c, 1, H - 4, 30, 1, shade(col, -0.35));
    R(c, 8, H - 20, 15, 7, shade(col, -0.08)); R(c, 9, H - 19, 6, 5, '#a8c4d8'); R(c, 16, H - 19, 6, 5, '#93b2c8'); R(c, 8, H - 20, 15, 1, shade(col, 0.2));
    R(c, 3, H - 4, 6, 3, '#1c1c20'); R(c, 23, H - 4, 6, 3, '#1c1c20'); P(c, 5, H - 3, '#8a8e94'); P(c, 25, H - 3, '#8a8e94');
    R(c, 1, H - 11, 2, 2, '#f4eecf'); R(c, 29, H - 11, 2, 2, '#c43a2a');
  });
}
/* --- Gebäude --- */
function objBuilding(x, y, w, h, o) {
  o = Object.assign({ floors: 3, wall: '#e8c9a0', roof: '#8a3b2a', roofType: 'gable', trim: '#f4efe4', shutter: null, flowers: true, wins: 'std', doors: [], shopWins: [], seed: x * 31 + y * 17, drawH: 10 }, o);
  const ob = mkObj(x, y, w, h, o.drawH, (c, W, H) => paintBuilding(c, W, H, o, false), { emit: (c, W, H) => paintBuilding(c, W, H, o, true), bld: o });
  return ob;
}
function paintBuilding(c, W, H, o, night) {
  const fh = Math.min(o.floors * 16, H - 8);
  const fy0 = H - fh;
  const wall = o.wall, wD = shade(wall, -0.16), wL = shade(wall, 0.12);
  const r = rng(o.seed);
  const cols = W / 16;
  if (!night) {
    /* Dach */
    paintRoof(c, W, fy0, o, r);
    /* Fassade */
    R(c, 0, fy0, W, fh, wall);
    for (let i = 0; i < W * fh / 40; i++) P(c, r() * W, fy0 + r() * fh, r() > 0.5 ? wD : wL);
    R(c, 0, fy0, W, 2, 'rgba(0,0,0,0.28)');
    R(c, W - 1, fy0, 1, fh, wD); R(c, 0, fy0, 1, fh, wL);
    for (let f = 1; f < o.floors; f++) { const yy = H - f * 16; R(c, 0, yy, W, 1, wL); R(c, 0, yy + 1, W, 1, wD); }
    R(c, 0, H - 3, W, 3, '#8f887c'); R(c, 0, H - 3, W, 1, '#a8a194');
    if (o.corner) { for (let yy = fy0 + 2; yy < H - 3; yy += 4) { R(c, 0, yy, 3, 3, wL); R(c, W - 3, yy, 3, 3, wL); } }
  }
  /* Fenster */
  for (let f = 1; f < o.floors; f++) {
    const yy = H - (f + 1) * 16;
    for (let k = 0; k < cols; k++) {
      if (o.erker && k >= o.erker[0] && k < o.erker[0] + o.erker[1] && f >= 1) continue;
      paintWindow(c, k * 16 + 8, yy + 3, o, night, hash(o.seed, k * 7 + f));
    }
  }
  /* Erker */
  if (o.erker) paintErker(c, H, o, night);
  /* Erdgeschoss */
  for (let k = 0; k < cols; k++) {
    const d = o.doors.find((d) => d.dx === k);
    const px = k * 16;
    if (d) paintDoor(c, px, H - 16, d, o, night);
    else if (o.shopWins.includes(k) || o.allShop) paintShopWindow(c, px, H - 16, o, night, k);
    else if (o.arcade) paintArcade(c, px, H - 16, o, night);
    else paintWindow(c, px + 8, H - 13, o, night, hash(o.seed, k * 3 + 99), true);
  }
  if (o.awning && !night) for (const k of o.awning.cols) paintAwning(c, k * 16, H - 16, o.awning.col);
  if (o.sign) paintSign(c, W, H, o, night);
  if (o.hang) paintHangSign(c, o.hang.dx * 16 + (o.hang.side === 'r' ? 14 : 0), H - 25, o.hang.icon, night, o.hang.side);
  if (o.special && !night) o.special(c, W, H, fy0);
  if (o.specialNight && night) o.specialNight(c, W, H, fy0);
}
function paintRoof(c, W, fy0, o, r) {
  const rf = o.roof, rD = shade(rf, -0.25), rL = shade(rf, 0.18);
  if (o.roofType === 'flat') {
    R(c, 0, 4, W, fy0 - 4, '#7c7a76'); for (let i = 0; i < W * fy0 / 10; i++) P(c, r() * W, 4 + r() * (fy0 - 4), r() > 0.5 ? '#6c6a66' : '#8c8a86');
    R(c, 0, 4, W, 2, '#a4a29c'); R(c, 0, fy0 - 3, W, 3, '#5e5c58'); R(c, 0, 4, 2, fy0 - 4, '#a4a29c'); R(c, W - 2, 4, 2, fy0 - 4, '#5e5c58');
    if (W > 40) { R(c, W - 26, 12, 12, 8, '#9a9ca0'); R(c, W - 26, 12, 12, 1, '#c0c2c6'); E(c, W - 20, 16, 3, 3, '#6a6c70'); }
    return;
  }
  const top = 2;
  R(c, 0, top, W, fy0 - top, rf);
  const ridge = top + Math.floor((fy0 - top) * 0.32);
  R(c, 0, top, W, ridge - top, rD);
  for (let yy = top + 2; yy < ridge; yy += 3) for (let xx = (yy % 2) * 2; xx < W; xx += 4) P(c, xx, yy, shade(rD, -0.15));
  R(c, 0, ridge, W, 2, rL);
  for (let yy = ridge + 3; yy < fy0 - 2; yy += 3) { R(c, 0, yy, W, 1, rD); for (let xx = (Math.floor(yy / 3) % 2) * 2; xx < W; xx += 4) P(c, xx, yy - 1, shade(rf, 0.08)); }
  R(c, 0, fy0 - 3, W, 3, shade(rf, -0.4));
  R(c, 0, top, 1, fy0 - top, rD); R(c, W - 1, top, 1, fy0 - top, shade(rf, -0.45));
  if (o.roofType === 'copper') { /* Patina */ for (let i = 0; i < W; i += 2) P(c, i, ridge + 4 + (i % 5), '#8fb8a4'); }
  /* Kamine & Gauben */
  const nCh = Math.max(1, Math.floor(W / 40));
  for (let i = 0; i < nCh; i++) {
    const cx = 6 + Math.floor(r() * (W - 16));
    R(c, cx, ridge - 6, 6, 9, '#8a5a44'); R(c, cx, ridge - 6, 6, 2, '#4a3a32'); R(c, cx + 4, ridge - 4, 2, 7, '#6a4434');
  }
  if (o.dormers && fy0 - ridge > 12) for (let k = 0; k < W / 16; k += 2) { const dx = k * 16 + 4; R(c, dx, ridge + 4, 8, 7, rL); R(c, dx + 2, ridge + 6, 4, 4, '#3d4a5a'); R(c, dx - 1, ridge + 3, 10, 2, rD); }
}
function paintWindow(c, cx, y, o, night, h, ground) {
  const lit = night && h > 0.42;
  const glass = lit ? (h > 0.85 ? '#ffe9b0' : '#ffd27a') : '#3e4c5e';
  if (night && !lit) return;
  const tall = o.wins === 'tall', arch = o.wins === 'arch';
  const ww = 6, wh = ground ? 8 : tall ? 10 : 9;
  const x0 = cx - ww / 2;
  if (!night) {
    R(c, x0 - 1, y - 1, ww + 2, wh + 2, o.trim);
    if (arch) { R(c, x0, y - 2, ww, 1, o.trim); }
    if (o.lintel) R(c, x0 - 2, y - 3, ww + 4, 2, shade(o.trim, -0.08));
  }
  R(c, x0, y, ww, wh, glass);
  if (!night) {
    P(c, x0 + 1, y + 1, '#8fa4b8'); P(c, x0 + 2, y + 1, '#6a7e94');
    R(c, x0 + ww / 2 - 0.5, y, 1, wh, o.trim); R(c, x0, y + Math.floor(wh / 2), ww, 1, o.trim);
    if (o.shutter) { R(c, x0 - 3, y, 2, wh, o.shutter); R(c, x0 + ww + 1, y, 2, wh, o.shutter); for (let k = 1; k < wh; k += 2) { P(c, x0 - 3, y + k, shade(o.shutter, -0.3)); P(c, x0 + ww + 2, y + k, shade(o.shutter, -0.3)); } }
    if (o.flowers && !ground && h > 0.3) { R(c, x0 - 1, y + wh + 1, ww + 2, 2, '#6a4a2a'); for (let k = 0; k < ww + 2; k++) P(c, x0 - 1 + k, y + wh, k % 2 ? '#e8402e' : '#3f7a34'); P(c, x0, y + wh - 1, '#e8402e'); P(c, x0 + ww - 1, y + wh - 1, '#e86ab0'); }
    if (o.curtain && h > 0.5) R(c, x0, y, 2, wh, o.curtain);
  } else {
    R(c, x0 + ww / 2 - 0.5, y, 1, wh, shade(glass, -0.35));
  }
}
function paintErker(c, H, o, night) {
  const [k0, kw] = o.erker;
  const x0 = k0 * 16 + 2, w = kw * 16 - 4;
  const yTop = H - o.floors * 16 + 4, yBot = H - 18;
  if (!night) {
    const col = o.erkerCol || shade(o.wall, 0.08);
    R(c, x0, yTop, w, yBot - yTop, col);
    R(c, x0 + w - 2, yTop, 2, yBot - yTop, shade(col, -0.2));
    for (let k = 0; k < 4; k++) R(c, x0 + 2 + k, yBot + k, w - 4 - k * 2, 1, shade(col, -0.15 - k * 0.05));
    if (o.erkerRoof) {
      const g = o.erkerRoof;
      for (let k = 0; k < 9; k++) { const ww = w + 4 - Math.max(0, (k - 2)) * 2; R(c, x0 + w / 2 - ww / 2, yTop - 9 + k, ww, 1, k % 2 ? g[0] : g[1]); }
      for (let xx = 0; xx < w + 2; xx += 2) for (let yy = 0; yy < 7; yy += 2) { const ww = w + 4 - Math.max(0, (yy + 2 - 2)) * 2; if (Math.abs(xx - w / 2) < ww / 2) P(c, x0 + xx, yTop - 7 + yy, g[2]); }
      R(c, x0 - 2, yTop - 1, w + 4, 2, g[1]);
      if (o.reliefs) { const ry = yBot - 14; for (let k = 0; k < 4; k++) { const rx = x0 + 3 + k * (w - 6) / 4; R(c, rx, ry, (w - 6) / 4 - 1, 10, '#d8cba8'); P(c, rx + 2, ry + 3, '#a8402a'); P(c, rx + 3, ry + 4, '#2f5a8a'); P(c, rx + 1, ry + 6, '#c8a030'); } R(c, x0 + 1, ry - 2, w - 2, 1, '#9a7a3a'); }
    }
  }
  for (let f = 1; f < o.floors - (o.reliefs ? 1 : 0); f++) {
    const yy = H - (f + 1) * 16 + 4;
    for (let k = 0; k < kw; k++) paintWindow(c, x0 + 6 + k * (w - 12) / Math.max(1, kw - 1 || 1) * (kw > 1 ? 1 : 0) + (kw === 1 ? w / 2 - 6 : 0), yy, Object.assign({}, o, { shutter: null, flowers: !o.reliefs }), night, hash(o.seed, k + f * 13 + 5));
  }
}
function paintDoor(c, px, py, d, o, night) {
  const t = d.type || 'door';
  if (night) { if (t === 'glass' || d.lit) R(c, px + 3, py + 3, 10, 11, '#ffdc8a'); return; }
  if (t === 'arch') { R(c, px + 1, py + 2, 14, 14, shade(o.wall, -0.25)); R(c, px + 2, py + 4, 12, 12, '#2a2622'); R(c, px + 3, py + 3, 10, 1, '#2a2622'); R(c, px + 5, py + 2, 6, 1, '#2a2622'); return; }
  R(c, px + 1, py + 1, 14, 15, o.trim); R(c, px + 2, py + 2, 12, 1, shade(o.trim, -0.15));
  if (t === 'glass') { R(c, px + 3, py + 3, 10, 13, '#5a7086'); R(c, px + 3, py + 3, 10, 13, 'rgba(160,190,210,0.25)'); R(c, px + 8, py + 3, 1, 13, '#2e3a46'); P(c, px + 4, py + 4, '#c4d8e8'); P(c, px + 5, py + 5, '#c4d8e8'); R(c, px + 6, py + 9, 1, 2, '#c9cdd2'); R(c, px + 9, py + 9, 1, 2, '#c9cdd2'); return; }
  const dc = d.col || '#6a4428';
  R(c, px + 3, py + 3, 10, 13, dc); R(c, px + 3, py + 3, 10, 1, shade(dc, 0.2));
  R(c, px + 4, py + 5, 3, 4, shade(dc, -0.2)); R(c, px + 9, py + 5, 3, 4, shade(dc, -0.2)); R(c, px + 4, py + 11, 3, 3, shade(dc, -0.2)); R(c, px + 9, py + 11, 3, 3, shade(dc, -0.2));
  R(c, px + 8, py + 3, 1, 13, shade(dc, -0.35)); P(c, px + 10, py + 10, '#e8c84a');
  R(c, px + 2, py + 1, 12, 2, shade(o.trim, -0.1));
}
function paintShopWindow(c, px, py, o, night, k) {
  if (night) { R(c, px + 2, py + 3, 12, 9, '#ffe3a8'); return; }
  R(c, px + 1, py + 2, 14, 11, o.shopFrame || '#3a3430'); R(c, px + 2, py + 3, 12, 9, '#6a7e90');
  R(c, px + 2, py + 3, 12, 9, 'rgba(255,255,255,0.08)');
  const g = o.goods || ['#c8352d', '#e8c23a', '#2f5fb8'];
  for (let i = 0; i < 4; i++) R(c, px + 3 + i * 3, py + 8 + (i % 2), 2, 4 - (i % 2), g[(i + k) % g.length]);
  P(c, px + 3, py + 4, '#c9dcea'); P(c, px + 4, py + 5, '#c9dcea');
  R(c, px + 1, py + 13, 14, 1, shade(o.wall, -0.3));
}
function paintArcade(c, px, py, o, night) {
  if (night) return;
  R(c, px, py, 16, 16, shade(o.wall, -0.2)); R(c, px + 2, py + 4, 12, 12, '#3a3530'); R(c, px + 3, py + 3, 10, 1, '#3a3530'); R(c, px + 5, py + 2, 6, 1, '#3a3530');
  R(c, px + 4, py + 8, 8, 6, '#5a6a7a'); R(c, px + 4, py + 8, 8, 1, '#8a9aa8');
}
function paintAwning(c, px, py, col) {
  for (let k = 0; k < 5; k++) for (let xx = 0; xx < 16; xx++) P(c, px + xx, py - 2 + k, (Math.floor(xx / 2) % 2) ? col : '#f4f0e6');
  for (let xx = 0; xx < 16; xx += 4) R(c, px + xx, py + 3, 2, 1, col);
}
function paintSign(c, W, H, o, night) {
  const s = o.sign;
  const tw = pxTextW(s.text) + 4;
  const sx = s.x !== undefined ? s.x : Math.round(W / 2 - tw / 2), sy = s.y !== undefined ? s.y : H - 23;
  if (night && !s.lit) return;
  R(c, sx, sy, tw, 7, night ? s.bg : s.bg); if (!night) R(c, sx, sy + 6, tw, 1, shade(s.bg, -0.3));
  pxText(c, s.text, sx + 2, sy + 1, s.fg);
}
function paintHangSign(c, x0, y0, icon, night, side) {
  const dir = side === 'r' ? 1 : -1;
  if (!night) { R(c, x0 + (dir > 0 ? 0 : -6), y0, 8, 1, '#2a2622'); line(c, x0, y0 + 3, x0 + dir * 5, y0, '#2a2622'); }
  const cx = x0 + dir * 5, cy = y0 + 6;
  if (!night) { E(c, cx, cy, 4, 4, '#2a2622'); E(c, cx, cy, 3, 3, '#e8c870'); }
  paintIcon(c, cx, cy, icon, night);
}
function paintIcon(c, cx, cy, icon, night) {
  if (night) { if (['beer', 'bed'].includes(icon)) E(c, cx, cy, 3, 3, '#ffdc8a'); return; }
  switch (icon) {
    case 'beer': R(c, cx - 2, cy - 1, 3, 4, '#c8901a'); R(c, cx - 2, cy - 2, 3, 1, '#ffffff'); P(c, cx + 1, cy, '#7a5a1a'); break;
    case 'bed': R(c, cx - 3, cy, 6, 2, '#5a3a24'); R(c, cx - 3, cy - 1, 2, 1, '#ffffff'); break;
    case 'hat': R(c, cx - 3, cy + 1, 7, 1, '#3f5a3b'); R(c, cx - 1, cy - 2, 3, 3, '#3f5a3b'); P(c, cx + 2, cy - 3, '#1a1a1a'); break;
    case 'shirt': R(c, cx - 2, cy - 2, 4, 5, '#2f5fb8'); P(c, cx - 3, cy - 2, '#2f5fb8'); P(c, cx + 2, cy - 2, '#2f5fb8'); break;
    case 'brezel': E(c, cx, cy, 2, 2, '#9a5a20'); P(c, cx, cy, '#e8c870'); break;
    case 'scissors': P(c, cx - 1, cy - 2, '#555'); P(c, cx + 1, cy - 2, '#555'); P(c, cx, cy - 1, '#555'); E(c, cx - 1, cy + 2, 1, 1, '#555'); E(c, cx + 1, cy + 2, 1, 1, '#555'); break;
    case 'apo': R(c, cx - 1, cy - 2, 2, 5, '#c8352d'); R(c, cx - 2, cy - 1, 4, 1, '#c8352d'); break;
    case 'cup': R(c, cx - 2, cy - 1, 4, 3, '#ffffff'); P(c, cx + 2, cy, '#ffffff'); break;
    case 'gift': R(c, cx - 2, cy - 1, 4, 4, '#c8352d'); R(c, cx - 2, cy, 4, 1, '#e8c23a'); R(c, cx, cy - 1, 1, 4, '#e8c23a'); break;
    case 'ski': line(c, cx - 3, cy + 2, cx + 3, cy - 2, '#2f5fb8'); line(c, cx - 3, cy - 2, cx + 3, cy + 2, '#c8352d'); break;
    case 'gams': R(c, cx - 2, cy, 4, 2, '#5a3a24'); P(c, cx - 2, cy - 1, '#5a3a24'); P(c, cx - 3, cy - 2, '#2a1a10'); P(c, cx - 1, cy - 2, '#2a1a10'); break;
  }
}

/* --- Wandschmuck (direkt in den Boden-Layer gemalt) --- */
const DECAL = {
  window: (c, px, py, w = 14, h = 12, view = 'day') => {
    R(c, px - 1, py - 1, w + 2, h + 2, '#e8e4dc'); R(c, px, py, w, h, '#8ec3e6'); R(c, px, py + h - 4, w, 4, '#7aa55a'); R(c, px + 2, py + h - 8, 4, 4, '#6d8a9e'); R(c, px + 7, py + h - 9, 5, 5, '#5e7a8e');
    R(c, px + w / 2 - 0.5, py, 1, h, '#e8e4dc'); R(c, px, py + h / 2, w, 1, '#e8e4dc'); R(c, px - 2, py + h + 1, w + 4, 2, '#cfc8bc');
  },
  picture: (c, px, py, col = '#6a8ab0') => { R(c, px, py, 10, 8, '#8a6a3a'); R(c, px + 1, py + 1, 8, 6, col); R(c, px + 1, py + 5, 8, 2, '#5a7a4a'); P(c, px + 3, py + 2, '#f2e2a0'); },
  antlers: (c, px, py) => { R(c, px + 3, py + 6, 6, 4, '#7a5a3a'); E(c, px + 6, py + 7, 2, 2, '#e8dcc8'); for (const s of [-1, 1]) { line(c, px + 6 + s * 2, py + 6, px + 6 + s * 7, py, '#e6d6b8'); line(c, px + 6 + s * 5, py + 3, px + 6 + s * 4, py - 1, '#e6d6b8'); line(c, px + 6 + s * 6, py + 2, px + 6 + s * 8, py + 3, '#e6d6b8'); } },
  gams: (c, px, py) => { R(c, px + 2, py + 8, 10, 4, '#6a4a2a'); E(c, px + 7, py + 6, 4, 4, '#5a3a24'); R(c, px + 5, py + 7, 4, 2, '#e8dcc8'); P(c, px + 5, py + 4, '#1a1410'); P(c, px + 9, py + 4, '#1a1410'); line(c, px + 5, py + 3, px + 4, py - 2, '#1a1410'); line(c, px + 9, py + 3, px + 10, py - 2, '#1a1410'); P(c, px + 3, py - 2, '#1a1410'); P(c, px + 11, py - 2, '#1a1410'); },
  shelf: (c, px, py, w = 32) => { R(c, px, py + 6, w, 2, '#5a3a24'); R(c, px, py + 14, w, 2, '#5a3a24'); for (let k = 2; k < w - 2; k += 3) { const col = ['#2f7a3a', '#a8401e', '#d8b040', '#4a2a6a', '#e0e0e0', '#7a3a1a'][(k + px) % 6]; R(c, px + k, py, 2, 6, col); P(c, px + k, py - 1, '#2a2a2a'); R(c, px + k, py + 9, 2, 5, ['#d8b040', '#e0e0e0', '#7a3a1a'][(k + px) % 3]); } },
  tv: (c, px, py, w = 22, h = 13) => { R(c, px, py, w, h, '#18181c'); R(c, px + 1, py + 1, w - 2, h - 2, '#2e7a3a'); R(c, px + 1, py + h / 2, w - 2, 1, '#f2f2f2'); E(c, px + w / 2, py + h / 2, 2, 2, '#f2f2f2'); },
  dart: (c, px, py) => { R(c, px - 1, py - 1, 16, 16, '#2a1a10'); E(c, px + 7, py + 7, 7, 7, '#1a1a1a'); for (let a = 0; a < 20; a++) { const an = a / 20 * 6.283; line(c, px + 7, py + 7, px + 7 + Math.cos(an) * 6, py + 7 + Math.sin(an) * 6, a % 2 ? '#e8dcc0' : '#1a1a1a'); } E(c, px + 7, py + 7, 4, 4, 'rgba(0,0,0,0)'); for (let a = 0; a < 20; a++) { const an = a / 20 * 6.283; P(c, px + 7 + Math.cos(an) * 6, py + 7 + Math.sin(an) * 6, a % 2 ? '#c8352d' : '#2f8a3a'); P(c, px + 7 + Math.cos(an) * 3.5, py + 7 + Math.sin(an) * 3.5, a % 2 ? '#c8352d' : '#2f8a3a'); } P(c, px + 7, py + 7, '#c8352d'); },
  board: (c, px, py, lines = 4) => { R(c, px, py, 18, 14, '#7a5a3a'); R(c, px + 1, py + 1, 16, 12, '#2a3a2e'); for (let k = 0; k < lines; k++) R(c, px + 3, py + 3 + k * 3, 6 + (k * 3) % 8, 1, '#e9efe6'); },
  clock: (c, px, py) => { E(c, px + 5, py + 5, 5, 5, '#2a2a2e'); E(c, px + 5, py + 5, 4, 4, '#f4f2ea'); line(c, px + 5, py + 5, px + 5, py + 2, '#1a1a1a'); line(c, px + 5, py + 5, px + 7, py + 5, '#1a1a1a'); },
  mirror: (c, px, py) => { R(c, px, py, 12, 14, '#c9a65a'); R(c, px + 1, py + 1, 10, 12, '#bcd6e2'); line(c, px + 3, py + 3, px + 6, py + 6, '#e8f4fa'); },
  lift: (c, px, py) => { R(c, px, py, 26, 28, '#9aa0a6'); R(c, px + 2, py + 4, 22, 24, '#c6ccd2'); R(c, px + 12, py + 4, 2, 24, '#7a8086'); R(c, px + 9, py, 8, 3, '#1a1a1e'); pxText(c, '3', px + 11, py - 1, '#f2c84a'); P(c, px + 27, py + 14, '#f2c84a'); },
  cross: (c, px, py) => { R(c, px + 4, py, 2, 12, '#5a3a24'); R(c, px + 1, py + 3, 8, 2, '#5a3a24'); R(c, px - 1, py + 12, 12, 2, '#5a3a24'); P(c, px + 2, py + 13, '#c8352d'); P(c, px + 6, py + 13, '#f2c23a'); },
  poster: (c, px, py, col) => { R(c, px, py, 10, 14, col); R(c, px + 1, py + 2, 8, 1, '#ffffff'); R(c, px + 2, py + 5, 6, 5, shade(col, -0.3)); },
  neon: (c, px, py, text, col) => { pxText(c, text, px, py, col); },
  flag: (c, px, py) => { R(c, px, py, 14, 4, '#c8352d'); R(c, px, py + 4, 14, 4, '#f4f2ea'); E(c, px + 7, py + 4, 2, 2, '#c8352d'); },
};

/* --- Innenmöbel --- */
function objCounter(x, y, w, h, o = {}) {
  const top = o.top || '#7a4a2a', front = o.front || '#4a2c18';
  return mkObj(x, y, w, h, 4, (c, W, H) => {
    R(c, 0, 0, W, H, top); R(c, 0, 0, W, 2, shade(top, 0.22)); R(c, 0, H - 8, W, 8, front); R(c, 0, H - 8, W, 1, shade(front, -0.3));
    for (let k = 6; k < W; k += 12) R(c, k, H - 7, 1, 6, shade(front, 0.15));
    if (o.taps) for (let k = 0; k < o.taps; k++) { const tx = 10 + k * 9; R(c, tx, 2, 4, 6, '#c9ccd2'); R(c, tx + 1, 0, 2, 3, ['#c8352d', '#2f7a3a', '#e8c23a', '#2f5fb8'][k % 4]); }
    if (o.glasses) for (let k = 0; k < o.glasses; k++) { const gx = W - 12 - k * 6; R(c, gx, 4, 3, 5, '#e8b33a'); R(c, gx, 3, 3, 1, '#fff'); }
    if (o.coffee) { R(c, W - 18, 1, 12, 9, '#2a2c30'); R(c, W - 16, 3, 8, 2, '#c9ccd2'); P(c, W - 12, 7, '#c8352d'); }
    if (o.reg) { R(c, 4, 2, 8, 6, '#3a3c42'); R(c, 5, 3, 6, 2, '#7ad07a'); }
  }, { solid: true });
}
function objStool(x, y, col = '#c8352d') { return mkObj(x, y, 1, 1, 4, (c, W, H) => { E(c, 8, H - 3, 4, 1, 'rgba(0,0,0,0.25)'); R(c, 7, H - 9, 2, 7, '#6a6e74'); E(c, 8, H - 11, 4, 2, col); E(c, 8, H - 12, 3, 1, shade(col, 0.25)); }, { solid: false }); }
function objChair(x, y, dir = 0, col = '#8a5a32') {
  return mkObj(x, y, 1, 1, 8, (c, W, H) => {
    E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.2)');
    R(c, 3, H - 9, 10, 4, col); R(c, 3, H - 9, 10, 1, shade(col, 0.2)); R(c, 3, H - 5, 1, 4, shade(col, -0.3)); R(c, 12, H - 5, 1, 4, shade(col, -0.3));
    if (dir === 3) { R(c, 3, H - 16, 10, 7, shade(col, -0.1)); R(c, 4, H - 15, 8, 1, shade(col, 0.15)); }
    if (dir === 0) { R(c, 3, H - 6, 10, 2, shade(col, -0.2)); }
    if (dir === 1) { R(c, 11, H - 16, 2, 11, shade(col, -0.15)); }
    if (dir === 2) { R(c, 3, H - 16, 2, 11, shade(col, -0.15)); }
  }, { solid: false });
}
function objTable(x, y, w = 2, h = 1, o = {}) {
  const col = o.col || '#8a5a32';
  return mkObj(x, y, w, h, 6, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.2)');
    const topH = H - 8;
    if (o.round) { E(c, W / 2, topH / 2 + 2, W / 2 - 1, topH / 2, shade(col, -0.25)); E(c, W / 2, topH / 2 + 1, W / 2 - 1, topH / 2 - 1, col); R(c, W / 2 - 1, topH, 2, 6, '#3a3c40'); }
    else {
      R(c, 1, 2, W - 2, topH, col); R(c, 1, 2, W - 2, 1, shade(col, 0.2)); R(c, 1, topH + 1, W - 2, 2, shade(col, -0.3));
      R(c, 2, topH + 3, 2, 4, shade(col, -0.35)); R(c, W - 4, topH + 3, 2, 4, shade(col, -0.35));
      if (o.cloth) for (let yy = 2; yy < topH + 1; yy++) for (let xx = 1; xx < W - 1; xx++) if ((Math.floor(xx / 3) + Math.floor(yy / 3)) % 2 === 0) P(c, xx, yy, o.cloth);
    }
    if (o.items) for (let k = 0; k < o.items; k++) { const ix = 6 + k * ((W - 12) / Math.max(1, o.items - 1)); R(c, ix, 4, 3, 5, '#e8b33a'); R(c, ix, 3, 3, 1, '#fff'); }
    if (o.cards) { for (let k = 0; k < 5; k++) { R(c, W / 2 - 8 + k * 3, topH / 2 - 1, 3, 4, '#f4f0e6'); P(c, W / 2 - 7 + k * 3, topH / 2, k % 2 ? '#c8352d' : '#1a1a1a'); } R(c, 3, 3, 6, 4, '#2a3a2e'); }
    if (o.candle) { R(c, W / 2 - 1, 2, 2, 4, '#f4f0e6'); P(c, W / 2, 1, '#ffb030'); }
  });
}
function objSofa(x, y, w = 3, col = '#5a2a2a', dir = 0) {
  return mkObj(x, y, w, 1, 10, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 1, 2, 'rgba(0,0,0,0.2)');
    R(c, 0, H - 22, W, 10, shade(col, -0.15)); R(c, 0, H - 22, W, 2, shade(col, 0.1));
    R(c, 0, H - 13, W, 10, col); for (let k = 1; k < w; k++) R(c, k * 16, H - 13, 1, 9, shade(col, -0.25));
    R(c, 0, H - 16, 4, 14, shade(col, -0.2)); R(c, W - 4, H - 16, 4, 14, shade(col, -0.2));
  });
}
function objBed(x, y) {
  return mkObj(x, y, 2, 3, 4, (c, W, H) => {
    R(c, 0, 0, W, 8, '#6a4428'); R(c, 0, 0, W, 2, '#8a5a34');
    R(c, 1, 6, W - 2, H - 8, '#f4f2ec');
    R(c, 3, 8, 11, 6, '#ffffff'); R(c, 18, 8, 11, 6, '#ffffff'); R(c, 3, 13, 11, 1, '#d8d8d4'); R(c, 18, 13, 11, 1, '#d8d8d4');
    R(c, 1, 18, W - 2, H - 22, '#c84a3a'); for (let yy = 18; yy < H - 4; yy += 4) for (let xx = 1; xx < W - 1; xx += 4) P(c, xx + 2, yy + 2, '#e8786a');
    R(c, 1, 18, W - 2, 2, '#e8786a'); R(c, 1, H - 4, W - 2, 4, '#5a3a24');
  });
}
function objWardrobe(x, y, w = 2) { return mkObj(x, y, w, 1, 18, (c, W, H) => { R(c, 0, 0, W, H, '#7a5232'); R(c, 0, 0, W, 2, '#9a6a44'); R(c, W / 2, 3, 1, H - 4, '#4a3020'); R(c, 3, 4, W / 2 - 5, H - 8, '#8a5e3a'); R(c, W / 2 + 3, 4, W / 2 - 5, H - 8, '#8a5e3a'); P(c, W / 2 - 2, H / 2, '#e8c84a'); P(c, W / 2 + 2, H / 2, '#e8c84a'); }); }
function objPlant(x, y) { return mkObj(x, y, 1, 1, 12, (c, W, H) => { E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 4, H - 8, 8, 7, '#b0603a'); R(c, 4, H - 8, 8, 1, '#c8784a'); for (let i = 0; i < 7; i++) { const a = -2.6 + i * 0.35; line(c, 8, H - 8, 8 + Math.cos(a) * 9, H - 8 + Math.sin(a) * 12, i % 2 ? '#3f8a3a' : '#2f6a2e'); } }); }
function objSink(x, y) { return mkObj(x, y, 1, 1, 4, (c, W, H) => { R(c, 1, 2, 14, 10, '#f4f6f8'); E(c, 8, 7, 5, 3, '#c9d6de'); R(c, 7, 1, 2, 3, '#a8b0b8'); R(c, 1, 11, 14, 2, '#c9d1d6'); }); }
function objToilet(x, y) { return mkObj(x, y, 1, 1, 6, (c, W, H) => { R(c, 3, 0, 10, 6, '#f4f6f8'); R(c, 3, 5, 10, 1, '#c9d1d6'); E(c, 8, 12, 5, 5, '#f4f6f8'); E(c, 8, 12, 3, 3, '#c9dce6'); }); }
function objShower(x, y) { return mkObj(x, y, 2, 2, 4, (c, W, H) => { R(c, 0, 0, W, H, '#d8e4ea'); for (let k = 0; k < W; k += 4) for (let j = 0; j < H; j += 4) R(c, k, j, 3, 3, '#e8f0f4'); E(c, W / 2, H / 2, 2, 2, '#8a96a0'); R(c, 0, 0, W, 2, '#a8c0d0'); R(c, 0, 0, 2, H, 'rgba(160,200,220,0.6)'); R(c, W - 2, 0, 2, H, 'rgba(160,200,220,0.6)'); R(c, 0, H - 2, W, 2, 'rgba(160,200,220,0.8)'); }, { solid: false }); }
function objMinibar(x, y) { return mkObj(x, y, 1, 1, 6, (c, W, H) => { R(c, 2, 0, 12, H - 1, '#2a2c30'); R(c, 3, 2, 10, H - 5, '#3a3d42'); R(c, 11, 6, 1, 6, '#9aa0a6'); R(c, 3, 2, 10, 1, '#5a5e64'); }); }
function objDesk(x, y) { return mkObj(x, y, 2, 1, 8, (c, W, H) => { R(c, 0, 2, W, H - 8, '#8a5e3a'); R(c, 0, 2, W, 1, '#a87a50'); R(c, 1, H - 6, 2, 6, '#5a3a24'); R(c, W - 3, H - 6, 2, 6, '#5a3a24'); R(c, 4, 4, 8, 6, '#f4f0e0'); R(c, 5, 5, 6, 1, '#7a8090'); R(c, W - 9, 0, 3, 5, '#2a2a2e'); E(c, W - 8, 0, 4, 2, '#e8d08a'); }, { emit: (c, W) => E(c, W - 8, 0, 4, 2, '#ffe8a0') }); }
function objSuitcase(x, y, col = '#2f5fb8') { return mkObj(x, y, 1, 1, 4, (c, W, H) => { R(c, 2, H - 14, 12, 12, col); R(c, 2, H - 14, 12, 1, shade(col, 0.25)); R(c, 6, H - 16, 4, 2, '#2a2a2e'); R(c, 2, H - 9, 12, 1, shade(col, -0.3)); R(c, 3, H - 2, 2, 1, '#1a1a1a'); R(c, 11, H - 2, 2, 1, '#1a1a1a'); }, { solid: false }); }
function objJukebox(x, y) {
  const o = mkObj(x, y, 1, 1, 14, (c, W, H) => { R(c, 1, 4, 14, H - 5, '#6a2a1a'); E(c, 8, 6, 7, 5, '#8a3a24'); R(c, 3, 8, 10, 6, '#ffd27a'); R(c, 3, 16, 10, 8, '#2a1a10'); for (let k = 0; k < 4; k++) R(c, 4, 17 + k * 2, 8, 1, ['#e8402e', '#f2c23a', '#3fae4a', '#3a8ae0'][k]); }, { emit: (c) => R(c, 3, 8, 10, 6, '#ffe6a0') });
  o.anim = (cx, t, px, py) => { R(cx, px + 3, py + 17 + (Math.floor(t * 4) % 4) * 2, 8, 1, '#ffffff'); };
  return o;
}
function objKicker(x, y) {
  return mkObj(x, y, 3, 2, 4, (c, W, H) => {
    R(c, 0, 0, W, H - 2, '#5a3a24'); R(c, 3, 3, W - 6, H - 8, '#3f8a3a'); R(c, 3, 3, W - 6, 1, '#5aa850');
    R(c, W / 2, 3, 1, H - 8, '#e8f0e8'); E(c, W / 2, H / 2 - 1, 3, 3, 'rgba(255,255,255,0.5)');
    for (let k = 1; k < 6; k++) { const rx = 3 + k * (W - 6) / 6; R(c, rx, -1, 1, H, '#c9ccd2'); for (let j = 0; j < 3; j++) R(c, rx - 1, 6 + j * 7, 3, 3, k % 2 ? '#c8352d' : '#2f5fb8'); }
  });
}
function objDJ(x, y) {
  const o = mkObj(x, y, 4, 1, 10, (c, W, H) => { R(c, 0, 0, W, H, '#1a1820'); R(c, 0, 0, W, 2, '#3a3646'); E(c, 14, 8, 6, 4, '#2a2830'); E(c, W - 14, 8, 6, 4, '#2a2830'); E(c, 14, 8, 2, 1, '#888'); E(c, W - 14, 8, 2, 1, '#888'); R(c, W / 2 - 6, 4, 12, 8, '#2e2c36'); for (let k = 0; k < 5; k++) P(c, W / 2 - 4 + k * 2, 6, '#3ae0c0'); R(c, 2, H - 6, W - 4, 2, '#c23ad0'); }, { emit: (c, W, H) => { R(c, 2, H - 6, W - 4, 2, '#e85af0'); for (let k = 0; k < 5; k++) P(c, W / 2 - 4 + k * 2, 6, '#7af0e0'); } });
  o.anim = (cx, t, px, py) => { for (let k = 0; k < 5; k++) { const h = 1 + Math.floor((Math.sin(t * 9 + k * 1.7) * 0.5 + 0.5) * 4); R(cx, px + 26 + k * 2, py + 12 - h, 1, h, '#3ae0c0'); } };
  return o;
}
function objSpeaker(x, y) { return mkObj(x, y, 1, 1, 14, (c, W, H) => { R(c, 1, 0, 14, H - 1, '#141218'); E(c, 8, 7, 4, 4, '#2a2830'); E(c, 8, 7, 1, 1, '#555'); E(c, 8, 19, 5, 5, '#2a2830'); E(c, 8, 19, 2, 2, '#555'); }); }
function objKachelofen(x, y) {
  return mkObj(x, y, 2, 2, 16, (c, W, H) => {
    R(c, 0, 4, W, H - 4, '#3f6a4a');
    for (let k = 0; k < W; k += 6) for (let j = 6; j < H - 4; j += 6) { R(c, k + 1, j, 5, 5, '#4f8a5e'); P(c, k + 2, j + 1, '#7ab88a'); }
    R(c, 0, 2, W, 3, '#c8b890'); R(c, 0, H - 6, W, 6, '#b8a880'); R(c, -1, H - 5, W + 2, 1, '#8a7a5a');
    R(c, W / 2 - 4, H - 16, 8, 6, '#2a1a10'); R(c, W / 2 - 3, H - 14, 6, 3, '#e8702a');
  }, { emit: (c, W, H) => R(c, W / 2 - 3, H - 14, 6, 3, '#ffa040') });
}
function objNagelstock(x, y) {
  return mkObj(x, y, 1, 1, 8, (c, W, H) => {
    E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.25)');
    R(c, 1, H - 16, 14, 14, '#7a5432'); E(c, 8, H - 16, 7, 3, '#c89a62'); E(c, 8, H - 16, 4, 2, '#a8784a'); E(c, 8, H - 16, 1, 1, '#8a5a32');
    for (let i = 0; i < 9; i++) P(c, 3 + (hash(i, 3) * 10 | 0), H - 18 + (hash(i, 7) * 5 | 0), '#3a3c40');
    R(c, 1, H - 13, 1, 10, '#5a3a22');
  });
}
function objReception(x, y, w = 4) {
  return mkObj(x, y, w, 1, 10, (c, W, H) => {
    R(c, 0, 0, W, H, '#6a4428'); R(c, 0, 0, W, 4, '#2a2622'); R(c, 0, 0, W, 1, '#4a4642');
    for (let k = 8; k < W; k += 16) R(c, k, 6, 10, H - 9, '#7d5232');
    R(c, W - 14, 1, 6, 3, '#e8c84a'); P(c, W - 11, 0, '#ffd85a');
    pxText(c, 'REZEPTION', 4, H - 9, '#e8c870');
  });
}
function objLuggage(x, y) { return mkObj(x, y, 1, 1, 18, (c, W, H) => { R(c, 2, H - 4, 12, 2, '#c9a65a'); R(c, 2, 4, 1, H - 6, '#c9a65a'); R(c, 13, 4, 1, H - 6, '#c9a65a'); R(c, 2, 4, 12, 1, '#e8c870'); R(c, 4, H - 14, 8, 10, '#2f5fb8'); R(c, 5, H - 20, 6, 6, '#8a3a2a'); E(c, 4, H - 1, 1, 1, '#1a1a1a'); E(c, 12, H - 1, 1, 1, '#1a1a1a'); }); }
function objSeat(x, y, face, col = '#2f4a7a') {
  return mkObj(x, y, 1, 1, 6, (c, W, H) => {
    const back = face === 'l' ? 12 : 1;
    R(c, 2, H - 14, 12, 12, col); R(c, 2, H - 14, 12, 1, shade(col, 0.25));
    R(c, back, H - 18, 3, 16, shade(col, -0.2)); R(c, back, H - 18, 3, 3, '#d9dce0');
  }, { solid: true });
}
function objTrainTable(x, y) { return mkObj(x, y, 1, 2, 2, (c, W, H) => { R(c, 2, 4, 12, H - 8, '#8a8e94'); R(c, 2, 4, 12, 1, '#b8bcc2'); R(c, 7, H - 6, 2, 4, '#5a5e64'); }); }

/* --- Spezielle Wahrzeichen --- */
function objTorbogen(x, y) {
  const o = mkObj(x, y, 5, 1, 34, (c, W, H) => {
    const st = '#cdbd98', sd = '#a8976f', sl = '#e2d4b2';
    R(c, 0, 6, 14, H - 6, st); R(c, W - 14, 6, 14, H - 6, st);
    R(c, 0, 0, W, 16, st); R(c, 0, 0, W, 2, sl); R(c, 0, 14, W, 2, sd);
    for (let k = 0; k < 7; k++) { const w2 = Math.round(Math.sqrt(Math.max(0, 1 - ((k - 7) / 8) ** 2)) * 26); R(c, W / 2 - w2, 16 + k, w2 * 2, 1, 'rgba(0,0,0,0)'); }
    c.clearRect(14, 18, W - 28, H - 18);
    for (let k = 0; k < 6; k++) { const ww = W - 28 + Math.round((1 - k / 6) * 0); R(c, 14 + k * 0.5, 16 + k, ww - k, 1, sd); }
    c.clearRect(16, 20, W - 32, H - 20);
    for (let yy = 22; yy < H; yy += 6) { R(c, 0, yy, 14, 1, sd); R(c, W - 14, yy, 14, 1, sd); }
    R(c, 13, 6, 1, H - 6, sd); R(c, W - 14, 6, 1, H - 6, sl);
    pxText(c, 'BAHNHOF', W / 2 - 14, 5, '#5a4a32');
    E(c, W / 2, 11, 3, 2, '#5a4a32');
  }, { solid: false });
  return o;
}
function objMountains(x, y, w, h, o = {}) {
  return mkObj(x, y, w, h, o.drawH || 40, (c, W, H) => {
    const r = rng(o.seed || 7);
    const sky = c.createLinearGradient(0, 0, 0, H * 0.6);
    sky.addColorStop(0, '#9fc4e2'); sky.addColorStop(1, '#d8e8f0');
    c.fillStyle = sky; c.fillRect(0, 0, W, H);
    const ridge = (base, amp, freq, col, snow, seed) => {
      const pts = [];
      for (let xx = 0; xx <= W; xx++) { const t = xx / W; let v = 0; for (let k = 1; k <= 4; k++) v += Math.sin(t * freq * k + seed * k * 1.7) / k; pts.push(base - Math.abs(v) * amp - (Math.sin(t * 3 + seed) * amp * 0.25)); }
      for (let xx = 0; xx <= W; xx++) { R(c, xx, pts[xx], 1, H - pts[xx], col); if (snow) { R(c, xx, pts[xx], 1, 2 + ((xx * 7) % 3), '#f3f5f7'); } if (xx > 0 && pts[xx] < pts[xx - 1] - 0.5) P(c, xx, pts[xx] + 1, shade(col, 0.2)); }
      return pts;
    };
    ridge(H * 0.42, H * 0.22, 9, '#a7b2c0', true, 2);
    const p2 = ridge(H * 0.55, H * 0.25, 13, '#8c8a86', true, 5);
    for (let i = 0; i < W * 0.6; i++) { const xx = r() * W | 0; const yy = p2[xx] + 6 + r() * 20; P(c, xx, yy, r() > 0.5 ? '#a19e98' : '#76736e'); }
    for (let xx = 0; xx < W; xx += 3) { const g = p2[xx] + 18 + Math.sin(xx * 0.3) * 4; if (g < H) R(c, xx, g, 3, 2, '#9a978f'); }
    const forestTop = H * 0.72;
    for (let xx = 0; xx < W; xx++) { const ft = forestTop + Math.sin(xx * 0.23) * 3 + Math.sin(xx * 0.07) * 6; R(c, xx, ft, 1, H - ft, '#2f4f30'); if (xx % 3 === 0) R(c, xx, ft - 2, 2, 3, '#365c36'); }
    for (let i = 0; i < W / 3; i++) { const xx = r() * W, yy = forestTop + 8 + r() * (H - forestTop - 10); E(c, xx, yy, 2, 2, r() > 0.5 ? '#3d653c' : '#264428'); }
    if (o.village) for (let i = 0; i < 9; i++) { const xx = W * (0.3 + r() * 0.3), yy = forestTop + 4 + r() * 10; R(c, xx, yy, 5, 4, '#e8e0cc'); R(c, xx - 1, yy - 2, 7, 2, '#8a3b2a'); }
    if (o.cable) { line(c, W * 0.42, H, W * 0.47, H * 0.48, '#3a3c40'); R(c, W * 0.47 - 3, H * 0.48 - 3, 7, 4, '#e8e4dc'); R(c, W * 0.445 - 2, H * 0.73, 4, 3, '#c8352d'); }
    R(c, 0, H - 4, W, 4, '#2a4628');
  }, { solid: true });
}
function objStadtturm(x, y) {
  return mkObj(x, y, 3, 3, 78, (c, W, H) => {
    const st = '#e2d2a8', sd = '#b8a47a', sl = '#f0e4c4';
    const bx = 4, bw = W - 8;
    R(c, bx, 46, bw, H - 46, st); R(c, bx + bw - 3, 46, 3, H - 46, sd); R(c, bx, 46, 2, H - 46, sl);
    for (let yy = 50; yy < H - 4; yy += 8) R(c, bx, yy, bw, 1, sd);
    E(c, W / 2, 62, 6, 6, '#2a2a2e'); E(c, W / 2, 62, 5, 5, '#f4f0e0'); line(c, W / 2, 62, W / 2, 58, '#1a1a1a'); line(c, W / 2, 62, W / 2 + 3, 62, '#1a1a1a');
    for (const yy of [76, 90]) { R(c, W / 2 - 2, yy, 4, 7, '#3a3a40'); R(c, W / 2 - 3, yy - 1, 6, 1, sl); }
    R(c, W / 2 - 5, H - 16, 10, 14, '#4a3a2a'); R(c, W / 2 - 4, H - 18, 8, 2, '#4a3a2a'); R(c, W / 2 - 6, H - 17, 12, 1, sd);
    // Galerie
    R(c, 0, 40, W, 7, '#d4c49a'); R(c, 0, 40, W, 1, sl); for (let xx = 1; xx < W; xx += 3) R(c, xx, 41, 1, 5, '#8a7a5a'); R(c, 0, 46, W, 1, sd);
    // Achteck-Aufsatz
    R(c, bx + 4, 22, bw - 8, 18, st); R(c, bx + bw - 7, 22, 3, 18, sd);
    R(c, W / 2 - 3, 26, 6, 9, '#3a3a40'); R(c, bx + 6, 28, 3, 6, '#3a3a40'); R(c, bx + bw - 10, 28, 3, 6, '#3a3a40');
    // Haube
    for (let k = 0; k < 14; k++) { const w = Math.round(Math.sin((k / 14) * Math.PI * 0.9 + 0.3) * (bw / 2 - 2)); R(c, W / 2 - w, 8 + k, w * 2, 1, k < 3 ? '#6fa08a' : '#4f7a68'); P(c, W / 2 - w + 2, 8 + k, '#8ac0a8'); }
    R(c, W / 2 - 2, 2, 4, 7, '#4f7a68'); R(c, W / 2 - 1, 0, 2, 3, '#e8c84a');
  });
}
function objAnnasaeule(x, y) {
  return mkObj(x, y, 2, 2, 52, (c, W, H) => {
    E(c, W / 2, H - 3, 15, 3, 'rgba(0,0,0,0.25)');
    R(c, 1, H - 20, W - 2, 18, '#c9c0ae'); R(c, 1, H - 20, W - 2, 2, '#e2dacb'); R(c, 1, H - 4, W - 2, 2, '#9a917f');
    R(c, 4, H - 16, W - 8, 10, '#b8ae9a'); pxText(c, '1703', W / 2 - 7, H - 13, '#6a604e');
    for (const s of [3, W - 7]) { R(c, s, H - 27, 4, 7, '#d8d2c4'); E(c, s + 2, H - 28, 2, 2, '#e2dccf'); }
    R(c, W / 2 - 3, 18, 6, H - 38, '#a8564a'); R(c, W / 2 + 1, 18, 2, H - 38, '#86403a'); R(c, W / 2 - 3, 18, 1, H - 38, '#c47a6a');
    R(c, W / 2 - 5, 14, 10, 4, '#d8d0c0'); R(c, W / 2 - 5, H - 22, 10, 3, '#d8d0c0');
    R(c, W / 2 - 3, 4, 6, 10, '#e4e0d6'); E(c, W / 2, 3, 2, 2, '#e4e0d6'); R(c, W / 2 - 4, 8, 8, 3, '#d8d2c6'); P(c, W / 2 - 2, 0, '#e8c84a'); P(c, W / 2 + 2, 0, '#e8c84a'); P(c, W / 2, -1, '#e8c84a');
  }, { padX: 0 });
}
function objTriumph(x, y) {
  return mkObj(x, y, 7, 2, 36, (c, W, H) => {
    const st = '#d4cab4', sd = '#aaa08a', sl = '#ebe4d4';
    R(c, 0, 10, W, H - 10, st);
    R(c, 0, 4, W, 8, sl); R(c, 0, 4, W, 1, '#fff'); R(c, 0, 12, W, 2, sd); pxText(c, 'LEOPOLDO', W / 2 - 16, 6, '#7a6e58');
    c.clearRect(W / 2 - 14, 32, 28, H - 32);
    for (let k = 0; k < 10; k++) { const w = Math.round(Math.sqrt(1 - (k / 10) ** 2) * 14); c.clearRect(W / 2 - w, 32 - k, w * 2, 1); }
    R(c, W / 2 - 15, 21, 30, 1, sd);
    for (const s of [6, W - 22]) { R(c, s, 16, 16, H - 18, shade(st, 0.04)); E(c, s + 8, 30, 5, 5, '#c8bea6'); E(c, s + 8, 30, 3, 3, '#b0a68e'); R(c, s + 2, H - 14, 12, 10, '#c4bba6'); }
    for (const s of [2, 22, W - 26, W - 6]) R(c, s, 14, 4, H - 16, sl);
    R(c, 0, H - 4, W, 4, sd);
  }, { solid: false });
}
function objFountain(x, y, big = true) {
  const o = mkObj(x, y, 4, 3, 30, (c, W, H) => {
    E(c, W / 2, H - 14, W / 2, 14, '#8e877b'); E(c, W / 2, H - 15, W / 2 - 1, 13, '#c9c2b4'); E(c, W / 2, H - 15, W / 2 - 4, 10, '#3f86a8');
    R(c, 0, H - 15, W, 2, 'rgba(0,0,0,0)');
    R(c, W / 2 - 4, 24, 8, H - 36, '#a8a090'); R(c, W / 2 - 5, 22, 10, 3, '#c9c2b4'); R(c, W / 2 - 5, H - 16, 10, 3, '#8e877b');
    // Reiterstatue (Bronze, Pferd aufbäumend)
    const b = '#4a5a48', bl = '#6a7e64';
    R(c, W / 2 - 7, 12, 12, 6, b); R(c, W / 2 + 3, 4, 4, 9, b); R(c, W / 2 + 5, 2, 4, 4, b); P(c, W / 2 + 8, 3, bl);
    R(c, W / 2 - 6, 18, 2, 5, b); R(c, W / 2 + 2, 16, 2, 4, b); line(c, W / 2 + 5, 12, W / 2 + 8, 16, b); line(c, W / 2 + 4, 12, W / 2 + 6, 17, b);
    R(c, W / 2 - 2, 4, 4, 9, '#3e4c3c'); E(c, W / 2, 2, 2, 2, '#3e4c3c'); R(c, W / 2 - 4, 6, 3, 2, '#3e4c3c'); P(c, W / 2 - 1, 6, bl); line(c, W / 2 - 8, 13, W / 2 - 11, 18, b);
  });
  o.anim = (ctx, t, px, py) => {
    const W = 64, H = 48 + 30;
    for (let i = 0; i < 6; i++) { const ph = (t * 1.6 + i / 6) % 1; const a = i / 6 * 6.283; const r = ph * 18; R(ctx, px + W / 2 + Math.cos(a) * r - (r > 0 ? 0 : 0), py + H - 18 - Math.sin(ph * 3.14) * 9 + Math.sin(a) * r * 0.35, 1, 2, 'rgba(220,240,255,0.85)'); }
    for (let i = 0; i < 10; i++) { const ph = (t * 0.7 + i * 0.13) % 1; P(ctx, px + W / 2 - 18 + i * 4, py + H - 15 + Math.sin(t * 3 + i) * 1.5, 'rgba(255,255,255,0.5)'); }
  };
  return o;
}
function objTrinkbrunnen(x, y) {
  const o = mkObj(x, y, 1, 1, 12, (c, W, H) => { E(c, 8, H - 3, 6, 3, '#8e877b'); E(c, 8, H - 4, 5, 2, '#3f86a8'); R(c, 6, 2, 4, H - 7, '#9aa0a6'); R(c, 6, 2, 4, 1, '#c9ccd2'); R(c, 9, 6, 4, 2, '#8a9096'); });
  o.anim = (c, t, px, py) => { for (let k = 0; k < 4; k++) P(c, px + 12, py + 9 + ((t * 20 + k * 2) % 8), 'rgba(200,230,255,0.9)'); };
  return o;
}
function objWurstStand(x, y) {
  return mkObj(x, y, 3, 2, 18, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.25)');
    R(c, 2, 14, W - 4, H - 16, '#d8d0c0'); R(c, 2, H - 14, W - 4, 12, '#c8352d'); R(c, 2, H - 14, W - 4, 2, '#e85a4a');
    R(c, 0, H - 18, W, 4, '#9aa0a6'); R(c, 0, H - 18, W, 1, '#c9ccd2');
    for (let k = 0; k < 6; k++) R(c, 6 + k * 6, H - 20, 4, 2, k % 2 ? '#c8722a' : '#a8502a');
    for (let xx = 0; xx < W; xx++) for (let k = 0; k < 6; k++) P(c, xx, 6 + k, Math.floor(xx / 4) % 2 ? '#f4f0e6' : '#c8352d');
    R(c, 0, 12, W, 2, '#9a2a22'); pxText(c, 'WÜRSTEL', W / 2 - 14, 2, '#2a2622'); R(c, W / 2 - 16, 1, 32, 1, 'rgba(0,0,0,0)');
  });
}
function objKiosk(x, y, label = 'KIOSK', col = '#2f5fb8') {
  return mkObj(x, y, 3, 2, 14, (c, W, H) => {
    R(c, 0, 4, W, H - 4, '#e8e4da'); R(c, 0, 0, W, 8, col); pxText(c, label, W / 2 - pxTextW(label) / 2, 2, '#ffffff');
    R(c, 3, 12, W - 6, 12, '#5a6e80'); for (let k = 0; k < 6; k++) R(c, 5 + k * 6, 16, 4, 6, ['#c8352d', '#e8c23a', '#2f7a3a', '#f4f0e6', '#2f5fb8', '#e86ab0'][k]);
    R(c, 0, H - 10, W, 2, '#8a8e94'); R(c, 0, H - 8, W, 8, shade(col, -0.2));
  });
}
function objFiaker(x, y) {
  return mkObj(x, y, 4, 2, 14, (c, W, H) => {
    E(c, W / 2, H - 3, W / 2 - 2, 3, 'rgba(0,0,0,0.22)');
    // Pferd
    R(c, 4, H - 18, 18, 8, '#7a4a28'); R(c, 2, H - 26, 6, 10, '#7a4a28'); R(c, 0, H - 26, 4, 4, '#6a3e22'); P(c, 3, H - 25, '#1a1a1a'); R(c, 6, H - 27, 3, 2, '#2a1a10');
    for (const lx of [5, 9, 16, 20]) R(c, lx, H - 10, 2, 8, '#6a3e22');
    R(c, 6, H - 22, 3, 6, '#2a1a10'); line(c, 22, H - 16, 26, H - 10, '#2a1a10');
    R(c, 8, H - 18, 10, 2, '#2a2622');
    // Kutsche
    R(c, 28, H - 26, 30, 16, '#1e1e22'); R(c, 30, H - 30, 26, 5, '#2a2a30'); R(c, 32, H - 24, 10, 6, '#5a3a3a'); R(c, 28, H - 26, 30, 1, '#4a4a52');
    for (const wx of [32, 52]) { E(c, wx, H - 7, 5, 5, '#3a2a1a'); E(c, wx, H - 7, 3, 3, '#c8a050'); P(c, wx, H - 7, '#3a2a1a'); }
    R(c, 22, H - 18, 8, 1, '#3a2a1a');
  });
}
function objTram(col = '#c8352d') {
  const [c, x] = canvas(96, 26);
  R(x, 0, 6, 96, 18, col); R(x, 0, 6, 96, 2, shade(col, 0.25)); R(x, 0, 20, 96, 4, '#2a2a2e');
  R(x, 0, 2, 96, 4, '#efede6'); R(x, 0, 2, 96, 1, '#ffffff');
  for (let k = 4; k < 92; k += 11) R(x, k, 9, 8, 7, '#7a96ac');
  R(x, 30, 9, 6, 11, '#3a3d42'); R(x, 62, 9, 6, 11, '#3a3d42');
  R(x, 1, 10, 2, 3, '#f4eecf'); R(x, 93, 10, 2, 3, '#f4eecf');
  pxText(x, '3', 6, 15, '#ffffff');
  return c;
}
function objTrainExterior(x, y, w, o = {}) {
  return mkObj(x, y, w, 2, 6, (c, W, H) => {
    const red = o.col || '#c8302a';
    R(c, 0, 2, W, H - 4, '#f2f0ea'); R(c, 0, 2, W, 3, '#c9ccd2'); R(c, 0, H - 10, W, 6, red); R(c, 0, H - 4, W, 2, '#2a2a2e');
    const doors = o.doors || [];
    for (let k = 0; k < W; k += 16) { if (k % 128 === 120 || doors.includes(k / 16)) continue; R(c, k + 3, 8, 10, 8, '#4a6478'); P(c, k + 4, 9, '#8ab0c8'); }
    for (let k = 0; k < W; k += 128) { R(c, k + 124, 2, 4, H - 6, '#3a3c40'); }
    if (o.label) pxText(c, o.label, 8, H - 9, '#ffffff');
    /* Einstiegstüren: dunkler Rahmen, zwei Scheiben, Trittstufe, grüner Öffner */
    for (const dx of doors) {
      const px = dx * 16;
      R(c, px + 1, 5, 14, H - 7, '#2a2c30'); R(c, px + 2, 6, 12, H - 9, '#3a3d42');
      R(c, px + 3, 8, 4, 9, '#7a96ac'); R(c, px + 9, 8, 4, 9, '#7a96ac'); P(c, px + 3, 8, '#b8d0e0'); P(c, px + 9, 8, '#b8d0e0');
      R(c, px + 7, 20, 1, H - 24, '#1a1a1e');
      R(c, px + 8, H - 12, 2, 2, '#4ad04a');
      R(c, px + 1, H - 3, 14, 2, '#8a8e94'); R(c, px + 1, H - 3, 14, 1, '#c9ccd2');
    }
  });
}
