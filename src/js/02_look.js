/* ============ Aussehen: Merkmale, Porträt, Spielfigur ============ */
const LOOK_OPTS = [
  { g: 'Körper', k: 'skin', n: 'Hautton', col: [['Porzellan', '#ffe3cc'], ['Hell', '#f6d2b4'], ['Rosig', '#f1c3a6'], ['Warm hell', '#e9b98f'], ['Sand', '#dcaa7f'], ['Oliv', '#c99a6c'], ['Honig', '#c48a58'], ['Bronze', '#a8714a'], ['Karamell', '#93613c'], ['Kakao', '#7a4c2f'], ['Dunkel', '#5f3a24'], ['Ebenholz', '#47291a']] },
  { g: 'Körper', k: 'build', n: 'Statur', v: ['Schlank', 'Normal', 'Athletisch', 'Kräftig'] },
  { g: 'Körper', k: 'height', n: 'Grösse', v: ['Klein', 'Mittel', 'Gross'] },
  { g: 'Kopf', k: 'head', n: 'Kopfform', v: ['Oval', 'Rund', 'Eckig', 'Lang', 'Herz', 'Breit'] },
  { g: 'Kopf', k: 'ears', n: 'Ohren', v: ['Normal', 'Klein', 'Abstehend', 'Gross'] },
  { g: 'Kopf', k: 'hair', n: 'Frisur', v: ['Glatze', 'Buzzcut', 'Kurzhaar', 'Seitenscheitel', 'Undercut', 'Tolle', 'Irokese', 'Locken', 'Afro', 'Man-Bun', 'Surfer lang', 'Vokuhila', 'Halbglatze', 'Spikes', 'Dreadlocks', 'Pompadour', 'Mittelscheitel', 'Flat-Top'] },
  { g: 'Kopf', k: 'hairCol', n: 'Haarfarbe', col: [['Schwarz', '#1f1b1a'], ['Dunkelbraun', '#3b2618'], ['Braun', '#5c3a22'], ['Hellbraun', '#82572f'], ['Dunkelblond', '#9e7746'], ['Blond', '#d3aa5e'], ['Platin', '#ebddb0'], ['Rot', '#a8431d'], ['Kupfer', '#c4682e'], ['Grau', '#8c8985'], ['Weiss', '#ece9e2'], ['Blau', '#3360d4'], ['Grün', '#3d9c52'], ['Pink', '#e3589c']] },
  { g: 'Gesicht', k: 'eyes', n: 'Augenform', v: ['Normal', 'Gross', 'Schmal', 'Mandel', 'Müde', 'Schräg', 'Wach'] },
  { g: 'Gesicht', k: 'eyeCol', n: 'Augenfarbe', col: [['Braun', '#6b4024'], ['Dunkelbraun', '#3e2414'], ['Haselnuss', '#8a6a2e'], ['Grün', '#4f8a3c'], ['Graugrün', '#6f8a73'], ['Blau', '#3f74c4'], ['Hellblau', '#79b1e0'], ['Grau', '#7d8790'], ['Bernstein', '#c08a28'], ['Violett', '#7a5aa8']] },
  { g: 'Gesicht', k: 'brows', n: 'Augenbrauen', v: ['Normal', 'Buschig', 'Dünn', 'Gerade', 'Gewölbt', 'Grimmig', 'Monobraue'] },
  { g: 'Gesicht', k: 'nose', n: 'Nase', v: ['Klein', 'Gerade', 'Breit', 'Spitz', 'Knollig', 'Haken', 'Stups'] },
  { g: 'Gesicht', k: 'mouth', n: 'Mund', v: ['Lächeln', 'Neutral', 'Grinsen', 'Schmal', 'Volle Lippen', 'Schief', 'Zahnlücke'] },
  { g: 'Gesicht', k: 'beard', n: 'Bart', v: ['Glatt rasiert', '3-Tage-Bart', 'Schnauz', 'Walross', 'Kinnbart', 'Goatee', 'Henriquatre', 'Vollbart kurz', 'Vollbart lang', 'Koteletten', 'Hufeisen', 'Kinnriemen', 'Wikinger', 'Musketier'] },
  { g: 'Gesicht', k: 'beardCol', n: 'Bartfarbe', col: [['Schwarz', '#1f1b1a'], ['Dunkelbraun', '#3b2618'], ['Braun', '#5c3a22'], ['Hellbraun', '#82572f'], ['Dunkelblond', '#9e7746'], ['Blond', '#d3aa5e'], ['Platin', '#ebddb0'], ['Rot', '#a8431d'], ['Kupfer', '#c4682e'], ['Grau', '#8c8985'], ['Weiss', '#ece9e2'], ['Salz & Pfeffer', '#6a6560'], ['Rotblond', '#c58a4f'], ['Kastanie', '#6e3320']] },
  { g: 'Gesicht', k: 'mark', n: 'Besonderheit', v: ['Keine', 'Sommersprossen', 'Narbe Wange', 'Narbe Braue', 'Muttermal', 'Rote Wangen', 'Sonnenbrand', 'Augenringe'] },
  { g: 'Gesicht', k: 'glasses', n: 'Brille', v: ['Keine', 'Rund', 'Eckig', 'Pilot', 'Sonnenbrille', 'Sportbrille', 'Hornbrille', 'Halbbrille', 'Rund, braun'] },
  { g: 'Gesicht', k: 'jewel', n: 'Ohrschmuck', v: ['Keiner', 'Stecker links', 'Ring rechts', 'Beidseitig', 'Kreolen'] },
  { g: 'Kleidung', k: 'hat', n: 'Kopfbedeckung', v: ['Keine', 'Cap', 'Cap verkehrt', 'Beanie', 'Fischerhut', 'Trucker-Cap', 'Stirnband', 'Cowboyhut', 'Schiebermütze', 'Tirolerhut', 'Baskenmütze', 'Cap, kurzer Schirm'] },
  { g: 'Kleidung', k: 'hatCol', n: 'Farbe Kopfbedeckung', col: [['Schwarz', '#232327'], ['Rot', '#c4312b'], ['Navy', '#22345e'], ['Grau', '#7b7f86'], ['Beige', '#c9b38a'], ['Oliv', '#5d6a37'], ['Weiss', '#ece9e1'], ['Orange', '#e07b25'], ['Lodengrün', '#3f5a3b'], ['Braun', '#6a4428']] },
  { g: 'Kleidung', k: 'top', n: 'Oberteil', v: ['T-Shirt', 'Hemd', 'Polo', 'Hoodie', 'Pullover', 'Tanktop', 'Fussballtrikot', 'Holzfällerhemd', 'Lederjacke', 'Sakko', 'Trainerjacke', 'Trachtenhemd'] },
  { g: 'Kleidung', k: 'topCol', n: 'Farbe Oberteil', col: [['Rot', '#c8352d'], ['Weinrot', '#7c2333'], ['Orange', '#e27c2c'], ['Senf', '#cf9f2e'], ['Gelb', '#efd34a'], ['Oliv', '#6e7a3a'], ['Grün', '#3f8e4b'], ['Petrol', '#1f6f73'], ['Hellblau', '#7fb4e2'], ['Blau', '#2f5fb8'], ['Navy', '#23325a'], ['Lila', '#6a4a9c'], ['Rosa', '#e79bb4'], ['Weiss', '#efede6'], ['Hellgrau', '#b9bbbf'], ['Anthrazit', '#45474d'], ['Schwarz', '#212125'], ['Beige', '#d4c09a']] },
  { g: 'Kleidung', k: 'print', n: 'Muster', v: ['Uni', 'Streifen', 'Schweizerkreuz', 'Nummer 10', 'Karo', 'Brustlogo'] },
  { g: 'Kleidung', k: 'pants', n: 'Hose', v: ['Jeans', 'Chino', 'Cargo', 'Shorts', 'Jogginghose', 'Anzughose', 'Bermuda', 'Lederhose'] },
  { g: 'Kleidung', k: 'pantsCol', n: 'Farbe Hose', col: [['Jeansblau', '#38558a'], ['Helle Jeans', '#7e9cc6'], ['Schwarz', '#222226'], ['Anthrazit', '#4a4c52'], ['Grau', '#8c8e93'], ['Beige', '#cdb48c'], ['Khaki', '#9a8a5c'], ['Oliv', '#5a6234'], ['Navy', '#253158'], ['Braun', '#6b4a2e'], ['Weiss', '#e9e6de'], ['Rot', '#a83a30']] },
  { g: 'Kleidung', k: 'shoes', n: 'Schuhe', v: ['Sneaker', 'Boots', 'Wanderschuhe', 'Halbschuhe', 'Sandalen', 'Laufschuhe', 'Haferlschuhe'] },
  { g: 'Kleidung', k: 'shoesCol', n: 'Farbe Schuhe', col: [['Weiss', '#efede8'], ['Schwarz', '#1f1f23'], ['Braun', '#6e4527'], ['Grau', '#85878c'], ['Rot', '#c3352c'], ['Blau', '#2f5fb8'], ['Grün', '#3f8e4b'], ['Beige', '#cbb58f'], ['Orange', '#e3762a'], ['Neon', '#c8f03a']] },
  { g: 'Kleidung', k: 'acc', n: 'Accessoire', v: ['Keines', 'Rucksack', 'Halskette', 'Armbanduhr', 'Fan-Schal', 'Bauchtasche'] },
];
const LOOK_GROUPS = ['Körper', 'Kopf', 'Gesicht', 'Kleidung'];
const LOOK_BY_KEY = Object.fromEntries(LOOK_OPTS.map((o) => [o.k, o]));
const LOOK_COUNT = LOOK_OPTS.reduce((s, o) => s + (o.col || o.v).length, 0);
/* Trachtenstücke sind erst nach dem Kauf im Trachtenladen frei */
const LOCKED = { hat: { 9: 'tirolerhut' }, top: { 11: 'trachtenhemd' }, pants: { 7: 'lederhose' }, shoes: { 6: 'haferlschuhe' } };
const optLen = (k) => (LOOK_BY_KEY[k].col || LOOK_BY_KEY[k].v).length;
const optName = (k, i) => { const o = LOOK_BY_KEY[k]; return o.col ? o.col[i][0] : o.v[i]; };
const lc = (L, k) => LOOK_BY_KEY[k].col[L[k]][1];
function isLocked(k, i, unlocked) { const l = LOCKED[k]; return !!(l && l[i] && !(unlocked && unlocked[l[i]])); }

function defaultLook() {
  return { skin: 2, build: 1, height: 1, head: 0, ears: 0, hair: 3, hairCol: 2, eyes: 0, eyeCol: 5, brows: 0, nose: 1, mouth: 0, beard: 1, beardCol: 2, mark: 0, glasses: 0, jewel: 0, hat: 0, hatCol: 2, top: 7, topCol: 0, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, acc: 0 };
}
function randomLook(r = Math.random, unlocked) {
  const L = {};
  for (const o of LOOK_OPTS) {
    const n = (o.col || o.v).length;
    let i = Math.floor(r() * n);
    let guard = 0;
    while (isLocked(o.k, i, unlocked) && guard++ < 20) i = Math.floor(r() * n);
    L[o.k] = i;
  }
  if (r() < 0.55) L.hat = 0;
  if (r() < 0.6) L.glasses = 0;
  if (r() < 0.6) L.jewel = 0;
  if (r() < 0.5) L.mark = 0;
  if (r() < 0.5) L.print = 0;
  if (r() < 0.75) L.beardCol = Math.min(L.hairCol, 10);
  return L;
}
const lookKey = (L) => LOOK_OPTS.map((o) => L[o.k] | 0).join('.');

/* ---------- Porträt (64x64) ---------- */
const HEADS = [
  [4, 9, 11, 12, 12.5, 12.5, 12, 11, 9.5, 7, 3.5],
  [5, 10, 12.5, 13.5, 14, 14, 13.5, 12.5, 10.5, 7.5, 4],
  [6, 11, 12.5, 13, 13, 13, 13, 12.5, 12, 10, 7],
  [4, 8, 10, 11, 11, 11, 10.5, 10, 8.5, 6.5, 3.5],
  [5, 10.5, 13, 13.5, 13.5, 12.5, 11, 9.5, 7.5, 5, 2.5],
  [5, 10, 12.5, 13.5, 14, 14.5, 14.5, 14, 13, 10.5, 6],
];
function headGeo(L) {
  const lang = L.head === 3;
  const top = lang ? 11 : 13, chin = lang ? 47 : 45;
  const prof = HEADS[L.head] || HEADS[0];
  const hw = (y) => {
    const t = (y - top) / (chin - top);
    if (t < 0) return prof[0];
    if (t > 1) return -1;
    const f = t * 10, i = Math.floor(f);
    return i >= 10 ? prof[10] : lerp(prof[i], prof[i + 1], f - i);
  };
  const ey = Math.round(top + (chin - top) * 0.5);
  const my = Math.round(top + (chin - top) * 0.82);
  let maxW = 0;
  for (let y = top; y <= chin; y++) maxW = Math.max(maxW, hw(y));
  return { top, chin, hw, cx: 32, ey, my, maxW };
}

function maskRender(x, M, base, tex, opt = {}) {
  const dark = shade(base, -0.32), light = shade(base, 0.22), deep = shade(base, -0.5);
  const at = (xx, yy) => (xx >= 0 && xx < 64 && yy >= 0 && yy < 64 ? M[yy * 64 + xx] : 0);
  for (let y = 0; y < 64; y++)
    for (let xx = 0; xx < 64; xx++) {
      const v = M[y * 64 + xx];
      if (!v) continue;
      if (v === 2) { if ((xx + y) % 2 === 0) P(x, xx, y, opt.stub || mix(base, '#c9a080', 0.35)); continue; }
      const h = hash(xx, y, 7);
      let c = base;
      if (tex === 'curl') { if ((xx + (Math.floor(y / 2) % 2) * 2) % 4 === 0 && y % 2 === 0) c = dark; else if (h > 0.8) c = light; }
      else if (tex === 'rope') { if (xx % 3 === 0) c = dark; else if (xx % 3 === 1 && y % 4 === 0) c = light; }
      else if (tex === 'comb') { if (y % 3 === 0 && h > 0.25) c = dark; else if (h > 0.9) c = light; }
      else if (tex === 'beard') { if (h > 0.62) c = dark; else if (h > 0.93) c = light; }
      else { if (xx % 3 === 0 && h > 0.45) c = dark; else if (h > 0.9) c = light; }
      if (!at(xx, y - 1) && !opt.noTopLight) c = light;
      if (!at(xx, y + 1) || !at(xx - 1, y) || !at(xx + 1, y)) c = opt.edge === false ? c : dark;
      P(x, xx, y, c);
    }
  if (opt.outline) {
    for (let y = 0; y < 64; y++)
      for (let xx = 0; xx < 64; xx++) {
        if (M[y * 64 + xx]) continue;
        if (at(xx, y - 1) === 1 && y < opt.outlineMaxY) { P(x, xx, y, deep); continue; }
        if ((at(xx - 1, y) === 1 || at(xx + 1, y) === 1) && y < opt.outlineMaxY) P(x, xx, y, deep);
      }
  }
}

function drawPortrait(x, L, opt = {}) {
  const g = headGeo(L);
  const { cx, top, chin, ey, my, hw } = g;
  const skin = lc(L, 'skin'), skinD = shade(skin, -0.14), skinDD = shade(skin, -0.3), ol = shade(skin, -0.45), skinL = shade(skin, 0.12);
  const hair = lc(L, 'hairCol');
  const beardC = lc(L, 'beardCol');
  const topC = lc(L, 'topCol');
  const hatC = lc(L, 'hatCol');
  if (!opt.noBg) {
    R(x, 0, 0, 64, 64, opt.bg || '#2a3a52');
  }
  const hasHat = L.hat > 0;
  /* Haar hinten (lange Frisuren) */
  const HB = new Uint8Array(64 * 64), HF = new Uint8Array(64 * 64);
  const mset = (M, xx, yy, v = 1) => { xx = Math.round(xx); yy = Math.round(yy); if (xx >= 0 && xx < 64 && yy >= 0 && yy < 64 && (!M[yy * 64 + xx] || v === 1)) M[yy * 64 + xx] = v; };
  const mrow = (M, x0, x1, yy, v = 1) => { for (let xx = Math.round(x0); xx <= Math.round(x1); xx++) mset(M, xx, yy, v); };
  const mell = (M, ecx, ecy, rx, ry, v = 1) => { for (let yy = -ry; yy <= ry; yy++) { const w = rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry))); mrow(M, ecx - w, ecx + w, ecy + yy, v); } };
  const domeHalf = (y, vol, ext) => {
    const base = hw(top + 3) + ext;
    if (y >= top + 3) return hw(y) + ext;
    const ry = vol + 3, dy = top + 3 - y;
    return base * Math.sqrt(Math.max(0, 1 - (dy / ry) * (dy / ry)));
  };
  const cap = (vol, ext, bottomFn, v = 1, sideTo = ey - 2, sideW = 2) => {
    for (let y = top - vol; y <= sideTo + 12; y++) {
      if (y < top - vol) continue;
      const half = y <= top + 14 ? domeHalf(y, vol, ext) : hw(y) + ext;
      for (let xx = Math.round(cx - half); xx <= Math.round(cx + half); xx++) {
        const dx = Math.abs(xx - cx);
        const faceEdge = y >= top ? hw(y) : 0;
        const inSide = dx >= faceEdge - sideW;
        const by = bottomFn(xx);
        if (y <= by || (inSide && y <= sideTo)) mset(HF, xx, y, v);
      }
    }
  };
  const hs = L.hair;
  let tex = 'std';
  const flatTop = hasHat;
  switch (hs) {
    case 0: break;
    case 1: cap(0, 0, () => top + 7, 2, ey - 3, 2); break;
    case 2: cap(2, 1, (xx) => top + 7 + (hash(xx, 3) > 0.6 ? 1 : 0), 1, ey - 1); break;
    case 3: cap(3, 1, (xx) => (xx < cx - 4 ? top + 6 : top + 7 + Math.min(4, Math.floor((xx - cx + 4) / 3))), 1, ey - 1); break;
    case 4: cap(0, 0, () => top + 8, 2, ey, 3); cap(flatTop ? 0 : 4, -1, () => top + 6, 1, top + 5, 0); break;
    case 5: cap(2, 1, () => top + 6, 1, ey - 3); if (!flatTop) mell(HF, cx - 2, top - 2, 9, 5); break;
    case 6: cap(0, 0, () => top + 8, 2, ey - 2, 3); if (!flatTop) for (let xx = cx - 3; xx <= cx + 3; xx++) for (let y = top - 8 + (xx % 2 ? 2 : 0); y <= top + 8; y++) mset(HF, xx, y, 1); break;
    case 7: tex = 'curl'; for (let y = ey - 2; y <= chin - 6; y++) mrow(HB, cx - hw(y) - 4, cx + hw(y) + 4, y); cap(flatTop ? 1 : 5, 3, (xx) => top + 8 + (hash(xx, 9) > 0.5 ? 1 : 0), 1, ey + 3, 3); break;
    case 8: tex = 'curl'; if (!flatTop) mell(HB, cx, top + 9, 22, 19); else for (let y = top + 4; y <= ey + 6; y++) mrow(HB, cx - hw(y) - 7, cx + hw(y) + 7, y); cap(1, 2, () => top + 8, 1, ey + 2, 4); break;
    case 9: tex = 'comb'; cap(1, 0, () => top + 6, 1, ey - 2); if (!flatTop) mell(HF, cx, top - 4, 5, 4); break;
    case 10: for (let y = top + 6; y <= 58; y++) { const w = hw(Math.min(y, ey)) + 4 - Math.max(0, y - 54); mrow(HB, cx - w, cx + w, y); }
      cap(flatTop ? 1 : 3, 2, (xx) => top + 7 + Math.floor(Math.abs(xx - cx) * 0.35), 1, chin + 6, 4); break;
    case 11: cap(2, 1, (xx) => top + 6 + (hash(xx, 2) > 0.5 ? 1 : 0), 1, ey - 3); for (let y = ey; y <= 57; y++) { const w = hw(Math.min(y, chin - 4)) + 2 - Math.max(0, (y - 52)); mrow(HB, cx - w, cx + w, y); } break;
    case 12: for (let y = top + 7; y <= ey + 1; y++) { const w = hw(y) + 1; mrow(HF, cx - w, cx - w + 3, y); mrow(HF, cx + w - 3, cx + w, y); }
      for (let y = top + 9; y <= ey + 4; y++) mrow(HB, cx - hw(y) - 1, cx + hw(y) + 1, y); mset(HF, cx - 1, top + 1); mset(HF, cx + 2, top + 2); break;
    case 13: cap(2, 1, () => top + 7, 1, ey - 2); if (!flatTop) for (let sx = cx - 10; sx <= cx + 10; sx += 4) for (let k = 0; k < 6; k++) mrow(HF, sx - Math.max(0, 2 - Math.floor(k / 2)), sx + Math.max(0, 2 - Math.floor(k / 2)), top - 2 - k + 3); break;
    case 14: tex = 'rope'; for (let y = top + 4; y <= 60; y++) { const w = hw(Math.min(y, ey)) + 5; mrow(HB, cx - w, cx + w, y); }
      cap(flatTop ? 1 : 3, 2, () => top + 7, 1, chin + 8, 5); break;
    case 15: cap(2, 0, () => top + 6, 1, ey - 3); if (!flatTop) mell(HF, cx + 1, top - 4, 12, 7); break;
    case 16: cap(2, 1, (xx) => (Math.abs(xx - cx) < 9 ? top + 5 + Math.floor(Math.abs(xx - cx) * 0.5) : top + 9), 1, ey + 2, 3); break;
    case 17: cap(0, 0, () => top + 8, 2, ey - 2, 3); if (!flatTop) { const W = Math.round(hw(top + 6)) - 1; for (let y = top - 5; y <= top + 6; y++) mrow(HF, cx - W, cx + W, y); } else cap(0, 0, () => top + 6, 1, top + 5, 0); break;
  }
  /* Haar hinten */
  maskRender(x, HB, shade(hair, -0.12), tex, {});
  /* Rücken-Langhaar über Schultern -> nach Körper zeichnen? Körper zuerst */
  /* Körper / Schultern */
  const sh = [18, 21, 23, 26][L.build];
  const nw = [4, 5, 6, 7][L.build];
  // Hals
  for (let y = chin - 6; y <= 52; y++) R(x, cx - nw, y, nw * 2 + 1, 1, y < chin + 3 ? skinDD : skinD);
  R(x, cx + nw - 1, chin, 2, 52 - chin, skinDD);
  drawTopPortrait(x, L, g, sh, nw, topC, skin);
  if (L.hair === 10 || L.hair === 14) {
    // Strähnen über die Schultern
    const M = new Uint8Array(64 * 64);
    for (let y = ey; y <= 60; y++) { const w = hw(Math.min(y, chin)) + 4; mrow(M, cx - w - 1, cx - w + 3, y); mrow(M, cx + w - 3, cx + w + 1, y); }
    maskRender(x, M, hair, tex, {});
  }
  /* Ohren */
  const earH = [7, 5, 8, 9][L.ears], earW = [3, 2, 5, 4][L.ears];
  for (const s of [-1, 1]) {
    const ex0 = cx + s * (hw(ey) - 1);
    for (let k = 0; k < earH; k++) {
      const y = ey - 3 + k;
      const w = earW - (k === 0 || k === earH - 1 ? 1 : 0) + (L.ears === 2 && k < 3 ? 1 : 0);
      const xA = s < 0 ? ex0 - w : ex0;
      R(x, xA, y, w + 1, 1, skin);
      P(x, s < 0 ? xA : xA + w, y, ol);
      if (k > 1 && k < earH - 2) P(x, s < 0 ? xA + 1 : xA + w - 1, y, skinDD);
    }
    P(x, s < 0 ? ex0 - earW + 1 : ex0 + earW - 1, ey - 3, ol);
  }
  /* Kopf */
  for (let y = top; y <= chin; y++) {
    const half = hw(y);
    const x0 = Math.round(cx - half), x1 = Math.round(cx + half);
    R(x, x0, y, x1 - x0 + 1, 1, skin);
    R(x, x1 - 2, y, 2, 1, skinD);
    if (y > my + 1) R(x, x0 + 1, y, 2, 1, skinD);
    P(x, x0, y, ol); P(x, x1, y, ol);
    if (y === top) R(x, x0, y, x1 - x0 + 1, 1, ol);
    if (y === chin) R(x, x0, y, x1 - x0 + 1, 1, ol);
    if (y === chin - 1) R(x, x0 + 1, y, x1 - x0 - 1, 1, skinD);
  }
  // Wangen-Glanzlicht
  P(x, cx - 8, ey + 3, skinL); P(x, cx - 9, ey + 4, skinL);
  if (L.hair === 0 || L.hair === 12) { R(x, cx - 6, top + 2, 4, 1, skinL); R(x, cx - 7, top + 3, 2, 1, skinL); }
  /* Gesichts-Merkmale */
  const mk = L.mark;
  if (mk === 6) { for (let y = top + 3; y < top + 7; y++) R(x, cx - hw(y) + 2, y, (hw(y) - 2) * 2, 1, mix(skin, '#e0503c', 0.18)); for (let y = ey + 2; y < ey + 6; y++) { R(x, cx - 10, y, 5, 1, mix(skin, '#e0503c', 0.35)); R(x, cx + 6, y, 5, 1, mix(skin, '#e0503c', 0.35)); } }
  if (mk === 5) for (let y = ey + 3; y < ey + 6; y++) { R(x, cx - 10, y, 4, 1, mix(skin, '#e86a7a', 0.38)); R(x, cx + 7, y, 4, 1, mix(skin, '#e86a7a', 0.38)); }
  if (mk === 1) { const fr = mix(skin, '#9a4a20', 0.45); [[-7, 3], [-9, 4], [-5, 4], [-8, 6], [-6, 5], [7, 3], [9, 4], [5, 4], [8, 6], [6, 5], [-2, 2], [2, 2], [0, 3]].forEach(([dx, dy]) => P(x, cx + dx, ey + dy, fr)); }
  if (mk === 7) for (const s of [-1, 1]) { R(x, cx + s * 6 - 2, ey + 3, 5, 1, mix(skin, '#5a3a5a', 0.3)); }
  /* Augen */
  const eyeC = lc(L, 'eyeCol');
  for (const s of [-1, 1]) drawEyeP(x, cx + s * 6, ey, s, L.eyes, eyeC, skin);
  /* Brauen */
  const browC = mix(L.hair === 0 || L.hair === 12 ? beardC : hair, '#2a1a12', 0.35);
  drawBrowsP(x, g, L.brows, browC, L.eyes);
  if (mk === 3) { R(x, cx + 7, ey - 5, 1, 4, skinL); P(x, cx + 7, ey - 1, skinD); }
  /* Nase */
  drawNoseP(x, g, L.nose, skin);
  /* Mund */
  drawMouthP(x, g, L.mouth, skin);
  if (mk === 2) { line(x, cx + 5, ey + 3, cx + 9, ey + 7, mix(skin, '#ffffff', 0.35)); P(x, cx + 6, ey + 5, skinDD); P(x, cx + 8, ey + 6, skinDD); }
  if (mk === 4) P(x, cx - 6, my - 2, '#4a2e22');
  /* Bart */
  drawBeardP(x, L, g, beardC, skin);
  /* Haar vorne */
  maskRender(x, HF, hair, tex, { stub: mix(hair, skin, 0.42) });
  if (hs === 3 && !hasHat) line(x, cx - 4, top - 1, cx - 4, top + 3, shade(hair, -0.5));
  if (hs === 16 && !hasHat) line(x, cx, top - 1, cx, top + 4, shade(hair, -0.5));
  if (hs === 9 && !hasHat) R(x, cx - 4, top, 9, 1, shade(hair, -0.5));
  /* Brille */
  drawGlassesP(x, g, L.glasses, skin);
  /* Ohrschmuck */
  const gold = '#f2c84b', silver = '#d9dde3';
  const lobe = (s) => [cx + s * (hw(ey) + (L.ears === 2 ? 3 : 1)), ey + [3, 1, 4, 5][L.ears]];
  if (L.jewel === 1 || L.jewel === 3) { const [lx, ly] = lobe(-1); R(x, lx - 1, ly, 2, 2, gold); }
  if (L.jewel === 3) { const [lx, ly] = lobe(1); R(x, lx, ly, 2, 2, gold); }
  if (L.jewel === 2) { const [lx, ly] = lobe(1); P(x, lx, ly + 1, silver); P(x, lx + 1, ly + 2, silver); P(x, lx, ly + 3, silver); P(x, lx - 1, ly + 2, silver); }
  if (L.jewel === 4) for (const s of [-1, 1]) { const [lx, ly] = lobe(s); for (let a = 0; a < 12; a++) P(x, lx + Math.round(Math.cos(a / 12 * 6.283) * 2.5), ly + 3 + Math.round(Math.sin(a / 12 * 6.283) * 3), gold); }
  /* Kopfbedeckung */
  drawHatP(x, L, g, hatC, hair);
}

function drawEyeP(x, ex, ey, s, st, eyeC, skin) {
  const white = '#f5f2ea', pup = '#17110e', lid = shade(skin, -0.6), lidSoft = shade(skin, -0.25);
  const S = [{ w: 4, h: 2, iw: 2 }, { w: 5, h: 3, iw: 3 }, { w: 4, h: 1, iw: 2 }, { w: 5, h: 2, iw: 2 }, { w: 4, h: 2, iw: 2 }, { w: 4, h: 2, iw: 2 }, { w: 5, h: 3, iw: 3 }][st];
  const x0 = ex - Math.floor(S.w / 2) + (S.w % 2 === 0 && s > 0 ? 1 : 0);
  const y0 = ey - Math.floor(S.h / 2);
  for (let r = 0; r < S.h; r++) {
    const inset = S.h > 2 && (r === 0 || r === S.h - 1) ? 1 : 0;
    R(x, x0 + inset, y0 + r, S.w - inset * 2, 1, white);
  }
  const ix = ex - Math.floor(S.iw / 2) + (S.iw % 2 === 0 && s > 0 ? 1 : 0) - (s > 0 ? 0 : 0);
  R(x, ix, y0, S.iw, S.h, eyeC);
  P(x, ix + Math.floor(S.iw / 2) - (S.iw === 2 && s < 0 ? 0 : 0), y0 + (S.h > 1 ? S.h - 1 - (S.h > 2 ? 1 : 0) : 0), pup);
  if (S.h > 1) P(x, ix, y0, shade(eyeC, 0.5));
  if (st === 6) P(x, ix, y0, '#ffffff');
  // Lid
  R(x, x0, y0 - 1, S.w, 1, lid);
  const outer = s < 0 ? x0 - 1 : x0 + S.w;
  if (st === 3) { P(x, outer, y0, lid); }
  if (st === 5) { P(x, outer, y0 - 1, lid); P(x, s < 0 ? x0 : x0 + S.w - 1, y0 + S.h - 1, shade(skin, -0.1)); }
  if (st === 6) P(x, outer, y0 - 2, lid);
  if (st === 4) { R(x, x0, y0, S.w, 1, lidSoft); R(x, x0, y0 - 1, S.w, 1, lid); R(x, x0, y0 + S.h + 1, S.w, 1, shade(skin, -0.12)); }
}
function drawBrowsP(x, g, st, c, eyeSt) {
  const { cx, ey } = g;
  const by = ey - ([1, 6].includes(eyeSt) ? 5 : 4);
  for (const s of [-1, 1]) {
    const ex = cx + s * 6;
    const inner = s < 0 ? 1 : -1;
    switch (st) {
      case 0: R(x, ex - 2, by, 5, 1, c); P(x, ex + inner * 2, by + 1, c); P(x, ex - inner * 3, by + 1, shade(c, 0.2)); break;
      case 1: R(x, ex - 3, by - 1, 7, 2, c); P(x, ex - inner * 3, by - 1, shade(c, 0.25)); break;
      case 2: R(x, ex - 2, by, 4, 1, shade(c, 0.2)); break;
      case 3: R(x, ex - 3, by, 7, 1, c); break;
      case 4: R(x, ex - 1, by - 1, 3, 1, c); P(x, ex - 2, by, c); P(x, ex + 2, by, c); P(x, ex - 3, by + 1, c); P(x, ex + 3, by + 1, c); break;
      case 5: for (let k = 0; k < 6; k++) P(x, ex - inner * (3 - k) , by - 1 + Math.floor(k / 2), c), P(x, ex - inner * (3 - k), by + Math.floor(k / 2), c); break;
      case 6: R(x, ex - 3, by - 1, 7, 2, c); break;
    }
  }
  if (st === 6) R(x, cx - 3, by, 7, 1, c);
}
function drawNoseP(x, g, st, skin) {
  const { cx, ey } = g;
  const sd = shade(skin, -0.2), dk = shade(skin, -0.42), hl = shade(skin, 0.14);
  const n = ey + 1;
  switch (st) {
    case 0: P(x, cx + 1, n + 3, sd); P(x, cx - 1, n + 4, dk); P(x, cx + 1, n + 4, dk); P(x, cx, n + 2, hl); break;
    case 1: R(x, cx + 1, n, 1, 5, sd); R(x, cx - 2, n + 5, 5, 1, sd); P(x, cx - 1, n + 5, dk); P(x, cx + 1, n + 5, dk); P(x, cx, n + 3, hl); break;
    case 2: R(x, cx + 1, n + 1, 1, 4, sd); R(x, cx - 3, n + 5, 7, 1, sd); P(x, cx - 2, n + 5, dk); P(x, cx + 2, n + 5, dk); P(x, cx - 3, n + 4, sd); P(x, cx + 3, n + 4, sd); break;
    case 3: R(x, cx + 1, n, 1, 6, sd); P(x, cx, n + 6, sd); P(x, cx - 1, n + 5, dk); P(x, cx + 1, n + 6, dk); break;
    case 4: R(x, cx + 1, n, 1, 3, sd); E(x, cx, n + 4, 2, 1, mix(skin, '#d0605a', 0.22)); P(x, cx - 1, n + 3, hl); R(x, cx - 2, n + 6, 5, 1, sd); P(x, cx - 2, n + 5, dk); P(x, cx + 2, n + 5, dk); break;
    case 5: P(x, cx + 1, n, sd); P(x, cx + 2, n + 1, sd); P(x, cx + 2, n + 2, sd); R(x, cx + 1, n + 3, 1, 3, sd); P(x, cx, n + 6, dk); P(x, cx - 1, n + 5, dk); P(x, cx + 1, n + 6, dk); break;
    case 6: R(x, cx + 1, n + 2, 1, 2, sd); P(x, cx, n + 3, hl); P(x, cx - 1, n + 4, dk); P(x, cx + 1, n + 4, dk); R(x, cx - 1, n + 5, 3, 1, sd); break;
  }
}
function drawMouthP(x, g, st, skin) {
  const { cx, my } = g;
  const ln = shade(mix(skin, '#6a2a2a', 0.5), -0.2), lip = mix(skin, '#c45a62', 0.38), lipL = shade(lip, 0.15);
  switch (st) {
    case 0: R(x, cx - 3, my, 7, 1, ln); P(x, cx - 4, my - 1, ln); P(x, cx + 4, my - 1, ln); R(x, cx - 2, my + 1, 5, 1, lip); break;
    case 1: R(x, cx - 3, my, 6, 1, ln); R(x, cx - 2, my + 1, 4, 1, lip); break;
    case 2: R(x, cx - 4, my - 1, 9, 1, ln); R(x, cx - 4, my, 9, 2, '#5a1e1e'); R(x, cx - 3, my, 7, 1, '#f4efe4'); P(x, cx - 5, my - 2, ln); P(x, cx + 5, my - 2, ln); R(x, cx - 3, my + 2, 7, 1, lip); break;
    case 3: R(x, cx - 2, my, 5, 1, ln); break;
    case 4: R(x, cx - 3, my - 1, 7, 1, lip); R(x, cx - 3, my, 7, 1, ln); R(x, cx - 3, my + 1, 7, 2, lip); R(x, cx - 1, my + 1, 3, 1, lipL); break;
    case 5: R(x, cx - 3, my, 4, 1, ln); R(x, cx + 1, my - 1, 3, 1, ln); P(x, cx + 4, my - 2, ln); R(x, cx - 2, my + 1, 3, 1, lip); break;
    case 6: R(x, cx - 4, my - 1, 9, 1, ln); R(x, cx - 4, my, 9, 2, '#5a1e1e'); R(x, cx - 3, my, 7, 1, '#f4efe4'); P(x, cx, my, '#2a0e0e'); P(x, cx - 5, my - 2, ln); P(x, cx + 5, my - 2, ln); break;
  }
}
function drawBeardP(x, L, g, c, skin) {
  const st = L.beard;
  if (!st) return;
  const { cx, ey, my, chin, hw, top } = g;
  const M = new Uint8Array(64 * 64);
  const set = (xx, yy, v = 1) => { xx = Math.round(xx); yy = Math.round(yy); if (xx >= 0 && xx < 64 && yy >= 0 && yy < 64) M[yy * 64 + xx] = v; };
  const row = (x0, x1, yy, v = 1) => { for (let xx = Math.round(x0); xx <= Math.round(x1); xx++) set(xx, yy, v); };
  const inFace = (xx, yy) => yy <= chin && Math.abs(xx - cx) <= hw(yy) - 0.5;
  const full = (v = 1, from = ey + 3) => { for (let yy = from; yy <= chin; yy++) for (let xx = 0; xx < 64; xx++) if (inFace(xx, yy) && (Math.abs(xx - cx) >= hw(yy) - 4 || yy >= my + 2)) set(xx, yy, v); };
  const must = (w = 4, rows = 2, v = 1) => { for (let r = 0; r < rows; r++) row(cx - w + (r === 0 ? 1 : 0), cx + w - (r === 0 ? 1 : 0), my - 2 + r - (rows > 2 ? 1 : 0), v); };
  const ext = (len, w0) => { for (let k = 0; k <= len; k++) { const w = Math.max(1.5, w0 * (1 - k / (len + 2))); row(cx - w, cx + w, chin + k); } };
  switch (st) {
    case 1: full(2, ey + 4); must(4, 2, 2); break;
    case 2: must(4, 2); set(cx - 5, my - 1); set(cx + 5, my - 1); break;
    case 3: must(5, 3); set(cx - 6, my); set(cx + 6, my); set(cx - 6, my - 1); set(cx + 6, my - 1); break;
    case 4: for (let yy = my + 2; yy <= chin + 1; yy++) row(cx - 3, cx + 3, yy); break;
    case 5: must(4, 2); for (let yy = my - 1; yy <= chin + 1; yy++) { if (yy >= my + 2) row(cx - 4, cx + 4, yy); else { set(cx - 4, yy); set(cx + 4, yy); } } break;
    case 6: row(cx - 3, cx + 3, my - 2); set(cx - 4, my - 1); set(cx + 4, my - 1); for (let yy = my + 2; yy <= chin + 4; yy++) { const w = Math.max(0, 2 - Math.floor((yy - chin) / 2)); row(cx - w, cx + w, yy); } break;
    case 7: full(1); must(5, 2); break;
    case 8: full(1); must(5, 2); ext(9, hw(chin - 3)); break;
    case 9: for (let yy = ey - 2; yy <= my + 2; yy++) { const w = hw(yy); row(cx - w + 0.5, cx - w + 4.5, yy); row(cx + w - 4.5, cx + w - 0.5, yy); } must(5, 2); break;
    case 10: must(5, 2); for (let yy = my - 1; yy <= chin; yy++) { row(cx - 6, cx - 5, yy); row(cx + 5, cx + 6, yy); } break;
    case 11: for (let yy = ey + 1; yy <= chin; yy++) for (let xx = 0; xx < 64; xx++) if (inFace(xx, yy) && (Math.abs(xx - cx) >= hw(yy) - 2 || yy >= chin - 1)) set(xx, yy); break;
    case 12: full(1); must(5, 2); ext(15, hw(chin - 3) + 1); break;
    case 13: row(cx - 3, cx + 3, my - 2); set(cx - 4, my - 3); set(cx - 5, my - 4); set(cx + 4, my - 3); set(cx + 5, my - 4); for (let yy = my + 2; yy <= my + 4; yy++) set(cx, yy); set(cx - 1, my + 3); break;
  }
  maskRender(x, M, c, 'beard', { stub: mix(c, skin, 0.5), noTopLight: true });
  if (st === 12) { const by = chin + 10; R(x, cx - 2, by, 5, 2, '#c8ccd2'); R(x, cx - 2, by, 5, 1, '#eef0f2'); }
  if ([5, 7, 8, 12].includes(st)) R(x, cx - 2, my, 5, 1, '#3a1818');
}
function drawGlassesP(x, g, st, skin) {
  if (!st) return;
  const { cx, ey, hw } = g;
  const fr = ['#000', '#2a2a30', '#1f1f24', '#c9a24a', '#1a1a1e', '#2b2b30', '#5a3418', '#7d6b55', '#7a4a20'][st];
  const lx = cx - 6, rx = cx + 6;
  const rectO = (ex, y0, w, h, c, th = 1) => { R(x, ex - Math.floor(w / 2), y0, w, th, c); R(x, ex - Math.floor(w / 2), y0 + h - th, w, th, c); R(x, ex - Math.floor(w / 2), y0, th, h, c); R(x, ex - Math.floor(w / 2) + w - th, y0, th, h, c); };
  const temples = (y) => { R(x, cx - hw(ey) , y, lx - 3 - (cx - hw(ey)), 1, fr); R(x, rx + 4, y, cx + hw(ey) - rx - 4, 1, fr); };
  switch (st) {
    case 1: case 8: for (const ex of [lx, rx]) { rectO(ex, ey - 3, 8, 7, fr); P(x, ex - 4, ey - 3, skin); P(x, ex + 3, ey - 3, skin); P(x, ex - 4, ey + 3, skin); P(x, ex + 3, ey + 3, skin); } R(x, lx + 4, ey - 2, rx - lx - 7, 1, fr); temples(ey - 2); break;
    case 2: for (const ex of [lx, rx]) rectO(ex, ey - 3, 9, 6, fr); R(x, lx + 5, ey - 2, rx - lx - 9, 1, fr); temples(ey - 2); break;
    case 3: for (const ex of [lx, rx]) { R(x, ex - 4, ey - 3, 9, 1, fr); for (let k = 0; k < 5; k++) { const w = 9 - (k > 2 ? (k - 2) * 2 : 0); R(x, ex - 4 + (9 - w) / 2, ey - 2 + k, w, 1, 'rgba(120,150,170,0.25)'); P(x, ex - 4 + (9 - w) / 2, ey - 2 + k, fr); P(x, ex + 4 - (9 - w) / 2, ey - 2 + k, fr); } } R(x, lx + 5, ey - 3, rx - lx - 9, 1, fr); temples(ey - 3); break;
    case 4: for (const ex of [lx, rx]) { R(x, ex - 4, ey - 3, 9, 6, '#18181c'); P(x, ex - 2, ey - 2, '#5a6070'); P(x, ex - 3, ey - 1, '#5a6070'); R(x, ex - 4, ey - 3, 9, 1, '#000'); } R(x, lx + 5, ey - 3, rx - lx - 9, 1, '#000'); temples(ey - 2); break;
    case 5: for (let xx = cx - 12; xx <= cx + 12; xx++) for (let yy = ey - 3; yy <= ey + 2; yy++) { if ((yy === ey + 2) && Math.abs(xx - cx) < 2) continue; P(x, xx, yy, mix('#ff7a2a', '#7a3ad0', (xx - cx + 12) / 24)); } R(x, cx - 12, ey - 3, 25, 1, '#1a1a1e'); P(x, cx - 8, ey - 2, '#ffd8a0'); P(x, cx - 7, ey - 2, '#ffd8a0'); temples(ey - 2); break;
    case 6: for (const ex of [lx, rx]) rectO(ex, ey - 3, 9, 7, fr, 2); R(x, lx + 5, ey - 2, rx - lx - 9, 2, fr); temples(ey - 2); break;
    case 7: for (const ex of [lx, rx]) { R(x, ex - 4, ey + 1, 9, 1, fr); R(x, ex - 4, ey + 4, 9, 1, fr); R(x, ex - 4, ey + 1, 1, 4, fr); R(x, ex + 4, ey + 1, 1, 4, fr); } R(x, lx + 5, ey + 2, rx - lx - 9, 1, fr); temples(ey + 1); break;
  }
}
function drawHatP(x, L, g, c, hair) {
  const st = L.hat;
  if (!st) return;
  const { cx, top, hw, maxW } = g;
  const dk = shade(c, -0.3), lt = shade(c, 0.2), W = Math.round(maxW) + 1;
  const dome = (cy, ry, w, from, to, col) => { for (let y = from; y <= to; y++) { const dy = cy - y; const hh = dy > 0 ? w * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))) : w; R(x, cx - hh, y, hh * 2 + 1, 1, col); P(x, cx - hh, y, dk); P(x, cx + hh, y, dk); } };
  switch (st) {
    case 1: case 5: case 11: {
      dome(top + 8, 11, W, top - 3, top + 8, c);
      if (st === 5) { dome(top + 8, 11, W - 6, top - 2, top + 8, mix(c, '#ffffff', 0.75)); for (let y = top; y <= top + 8; y++) for (let xx = -W; xx <= W; xx++) if (Math.abs(xx) > W - 6 && (xx + y) % 2) P(x, cx + xx, y, dk); R(x, cx - 2, top + 3, 5, 1, c); P(x, cx - 1, top + 2, c); P(x, cx + 1, top + 2, c); }
      R(x, cx - 1, top - 4, 3, 1, dk);
      line(x, cx - 6, top - 2, cx - 4, top + 7, dk); line(x, cx + 6, top - 2, cx + 4, top + 7, dk);
      if (st === 11) { E(x, cx, top + 9, W - 4, 1, dk); R(x, cx - W + 3, top + 8, (W - 3) * 2 + 1, 1, lt); }
      else { E(x, cx, top + 9, W - 1, 2, dk); R(x, cx - W + 2, top + 8, (W - 2) * 2 + 1, 1, lt); }
      R(x, cx - hw(top + 11) + 1, top + 11, (hw(top + 11) - 1) * 2, 1, 'rgba(0,0,0,0.18)');
      break;
    }
    case 2: dome(top + 7, 10, W, top - 3, top + 7, c); R(x, cx - 6, top - 5, 13, 2, dk); R(x, cx - 3, top + 3, 7, 5, hair); R(x, cx - 3, top + 6, 7, 1, '#2a2a2a'); R(x, cx - 1, top - 4, 3, 1, lt); break;
    case 3: { dome(top + 10, 13, W, top - 3, top + 11, c); for (let xx = -W; xx <= W; xx++) R(x, cx + xx, top + 7, 1, 5, xx % 2 ? dk : c); P(x, cx - W, top + 7, dk); E(x, cx, top - 5, 4, 3, lt); for (let k = 0; k < 6; k++) P(x, cx - 3 + k, top - 6 + (k % 3), c); break; }
    case 4: dome(top + 6, 9, W - 1, top - 3, top + 6, c); for (let k = 0; k < 5; k++) { const w = W + 1 + k; R(x, cx - w, top + 6 + k, w * 2 + 1, 1, k < 2 ? c : dk); } R(x, cx - W + 1, top + 4, (W - 1) * 2 + 1, 1, dk); break;
    case 6: for (let y = top + 6; y <= top + 9; y++) { const w = hw(y) + 1; R(x, cx - w, y, w * 2 + 1, 1, y === top + 7 ? lt : c); } break;
    case 7: {
      for (let y = top - 6; y <= top + 5; y++) { const w = W - 3; R(x, cx - w, y, w * 2 + 1, 1, c); P(x, cx - w, y, dk); P(x, cx + w, y, dk); }
      R(x, cx - 2, top - 6, 5, 2, '#2a3a52'); R(x, cx - W + 3, top + 2, (W - 3) * 2 + 1, 2, dk);
      E(x, cx, top + 7, W + 11, 2, c); R(x, cx - W - 11, top + 8, (W + 11) * 2 + 1, 1, dk);
      R(x, cx - W - 12, top + 3, 3, 4, c); R(x, cx + W + 10, top + 3, 3, 4, c);
      break;
    }
    case 8: { for (let y = top - 1; y <= top + 8; y++) { const w = Math.round(lerp(W - 3, W + 1, (y - top + 1) / 9)); R(x, cx - w, y, w * 2 + 1, 1, c); for (let xx = -w; xx <= w; xx++) if (hash(cx + xx, y, 4) > 0.7) P(x, cx + xx, y, dk); P(x, cx - w, y, dk); P(x, cx + w, y, dk); } R(x, cx - W + 2, top + 8, (W - 2) * 2 + 1, 2, dk); break; }
    case 9: {
      for (let y = top - 6; y <= top + 6; y++) { const w = Math.round(lerp(W - 5, W - 2, (y - top + 6) / 12)); R(x, cx - w, y, w * 2 + 1, 1, c); P(x, cx - w, y, dk); P(x, cx + w, y, dk); }
      R(x, cx - 4, top - 6, 9, 1, dk);
      for (let xx = -(W - 2); xx <= W - 2; xx++) { P(x, cx + xx, top + 4, xx % 2 ? '#c23a2a' : '#2f7a3a'); P(x, cx + xx, top + 5, xx % 2 ? '#2f7a3a' : '#c23a2a'); }
      E(x, cx, top + 7, W + 4, 1, c); R(x, cx - W - 4, top + 8, (W + 4) * 2 + 1, 1, dk);
      const fx = cx + W - 4; line(x, fx, top + 3, fx + 6, top - 10, '#1d1d1d'); line(x, fx + 1, top + 3, fx + 7, top - 9, '#3b3b3b'); P(x, fx + 6, top - 10, '#f0f0f0'); P(x, fx + 7, top - 10, '#f0f0f0'); P(x, fx + 5, top - 8, '#6a7cb0');
      break;
    }
    case 10: {
      /* Baskenmütze: flache Scheibe, leicht nach rechts hängend, mit Stiel */
      for (let y = top - 3; y <= top + 5; y++) {
        const t = (y - (top - 3)) / 8;
        const w = Math.round(lerp(W - 5, W + 3, Math.sin(t * Math.PI))) + (t > 0.5 ? 1 : 0);
        const off = Math.round(t * 3);
        R(x, cx - w + off, y, w * 2 + 1, 1, y === top - 2 ? lt : c); P(x, cx - w + off, y, dk); P(x, cx + w + off, y, dk);
      }
      R(x, cx - W + 4, top + 5, (W - 4) * 2 + 1, 1, dk);
      R(x, cx, top - 5, 1, 2, dk);
      break;
    }
  }
}
function drawTopPortrait(x, L, g, sh, nw, c, skin) {
  const { cx, chin } = g;
  const dk = shade(c, -0.28), lt = shade(c, 0.18), dd = shade(c, -0.45);
  const t = L.top;
  const bodyRow = (y) => (y < 53 ? Math.round(lerp(nw + 4, sh, (y - 49) / 4)) : Math.round(sh + (y - 53) * 0.25));
  const fillBody = (col, fn) => { for (let y = 49; y < 64; y++) { const w = bodyRow(y); R(x, cx - w, y, w * 2 + 1, 1, col); if (fn) fn(y, w); R(x, cx + w - 3, y, 3, 1, shade(col, -0.18)); P(x, cx - w, y, shade(col, -0.4)); P(x, cx + w, y, shade(col, -0.4)); } };
  const vNeck = (depth, col) => { for (let k = 0; k < depth; k++) { const w = Math.max(0, nw - 1 - Math.floor(k * 0.7)); R(x, cx - w, 49 + k, w * 2 + 1, 1, col); } };
  const crew = (rim) => { for (let k = 0; k < 3; k++) { const w = nw - k; R(x, cx - w, 49 + k, w * 2 + 1, 1, shade(skin, -0.14)); } R(x, cx - nw - 1, 49, 2, 1, rim); R(x, cx + nw, 49, 2, 1, rim); for (let k = 0; k <= nw; k++) { P(x, cx - nw + k, 51 + (k > nw - 2 ? 1 : 0), rim); P(x, cx + nw - k, 51 + (k > nw - 2 ? 1 : 0), rim); } R(x, cx - 2, 52, 5, 1, rim); };
  const collar = (col) => { for (let k = 0; k < 5; k++) { R(x, cx - nw - 2 + k, 48 + k, 3, 1, col); R(x, cx + nw + 2 - k - 2, 48 + k, 3, 1, col); } };
  const pattern = () => {
    const pr = L.print;
    if (![0, 2, 3, 4, 5, 6].includes(t)) return;
    if (pr === 1) for (let y = 54; y < 64; y += 3) { const w = bodyRow(y) - 1; R(x, cx - w, y, w * 2 + 1, 1, t === 6 ? '#f2f0ea' : lt); }
    if (pr === 2) { const red = L.topCol === 0 || L.topCol === 1; const bg = red ? '#ffffff' : '#d52b1e', fg = red ? '#d52b1e' : '#ffffff'; R(x, cx - 5, 53, 11, 11, bg); R(x, cx - 1, 55, 3, 7, fg); R(x, cx - 3, 57, 7, 3, fg); }
    if (pr === 3) pxText(x, '10', cx - 7, 54, L.topCol >= 13 && L.topCol <= 14 ? '#22223a' : '#f6f4ee', 2);
    if (pr === 4) for (let y = 53; y < 64; y++) { const w = bodyRow(y) - 1; for (let xx = -w; xx <= w; xx++) if (((Math.floor((xx + 30) / 3) + Math.floor(y / 3)) % 2) === 0) P(x, cx + xx, y, dk); }
    if (pr === 5) { const lc2 = L.topCol >= 13 && L.topCol <= 14 ? '#2a3a62' : '#f6f4ee'; P(x, cx + 8, 55, lc2); R(x, cx + 7, 56, 3, 1, lc2); R(x, cx + 6, 57, 5, 1, lc2); P(x, cx + 10, 56, lc2); R(x, cx + 9, 57, 3, 1, lc2); }
  };
  switch (t) {
    case 0: fillBody(c); crew(dk); pattern(); break;
    case 1: fillBody(c); vNeck(5, shade(skin, -0.14)); collar(lt); for (let y = 55; y < 64; y += 3) P(x, cx, y, dd); R(x, cx, 54, 1, 10, dk); break;
    case 2: fillBody(c); vNeck(4, shade(skin, -0.14)); collar(lt); P(x, cx, 53, '#eee'); P(x, cx, 55, '#eee'); pattern(); break;
    case 3: fillBody(c); for (let k = 0; k < 4; k++) { const w = nw + 4 - k; R(x, cx - w, 46 + k, w * 2 + 1, 1, dk); } crew(dd); R(x, cx - 3, 52, 1, 6, '#efefef'); R(x, cx + 3, 52, 1, 7, '#efefef'); R(x, cx - 3, 58, 2, 1, '#cfcfcf'); R(x, cx + 3, 59, 2, 1, '#cfcfcf'); R(x, cx - 7, 60, 15, 1, dk); pattern(); break;
    case 4: fillBody(c); crew(dk); for (let xx = -nw - 1; xx <= nw + 1; xx++) if (xx % 2) P(x, cx + xx, 52 + (Math.abs(xx) > nw - 1 ? -1 : 0), dd); pattern(); break;
    case 5: { fillBody(skin); const w0 = Math.max(4, sh - 9); for (let y = 49; y < 64; y++) { const w = y < 53 ? (Math.abs(1) && 2) : Math.min(bodyRow(y) - 2, w0 + (y - 53)); if (y < 53) { R(x, cx - w0 - 1, y, 3, 1, c); R(x, cx + w0 - 1, y, 3, 1, c); } else R(x, cx - w, y, w * 2 + 1, 1, c); } for (let k = 0; k < 3; k++) R(x, cx - nw + k + 1, 53 + k, (nw - k - 1) * 2 + 1, 1, skin); pattern(); break; }
    case 6: { fillBody(c); vNeck(5, shade(skin, -0.14)); for (let k = 0; k < 5; k++) { P(x, cx - nw + 1 + Math.floor(k * 0.7) - 1, 49 + k, '#f6f4ee'); P(x, cx + nw - 1 - Math.floor(k * 0.7) + 1, 49 + k, '#f6f4ee'); } line(x, cx - sh + 2, 54, cx - nw - 2, 49, '#f6f4ee'); line(x, cx + sh - 2, 54, cx + nw + 2, 49, '#f6f4ee'); pattern(); break; }
    case 7: { fillBody(c, (y, w) => { for (let xx = -w; xx <= w; xx++) { const a = ((cx + xx) % 6 === 0), b = (y % 6 === 0); if (a && b) P(x, cx + xx, y, dd); else if (a || b) P(x, cx + xx, y, dk); } }); vNeck(4, shade(skin, -0.14)); collar(shade(c, -0.1)); for (let y = 55; y < 64; y += 3) P(x, cx, y, '#efe8d0'); break; }
    case 8: { const J = '#2a2420'; fillBody(J); for (let k = 0; k < 11; k++) { const w = Math.max(0, nw + 1 - Math.floor(k * 0.6)); R(x, cx - w, 49 + k, w * 2 + 1, 1, c); } for (let k = 0; k < 9; k++) { P(x, cx - nw - 2 + Math.floor(k * 0.6), 49 + k, '#4a3f38'); P(x, cx + nw + 2 - Math.floor(k * 0.6), 49 + k, '#4a3f38'); } R(x, cx - nw - 4, 48, 4, 3, '#3a322c'); R(x, cx + nw + 1, 48, 4, 3, '#3a322c'); P(x, cx + 9, 59, '#a0a4a8'); break; }
    case 9: { fillBody(c); for (let k = 0; k < 12; k++) { const w = Math.max(0, nw - Math.floor(k * 0.5)); R(x, cx - w, 49 + k, w * 2 + 1, 1, '#f1efe8'); } for (let k = 0; k < 10; k++) { P(x, cx - nw - 1 + Math.floor(k * 0.55), 49 + k, dk); P(x, cx + nw + 1 - Math.floor(k * 0.55), 49 + k, dk); P(x, cx - nw - 2 + Math.floor(k * 0.55), 49 + k, lt); P(x, cx + nw + 2 - Math.floor(k * 0.55), 49 + k, lt); } P(x, cx, 62, dd); break; }
    case 10: { fillBody(c); R(x, cx - nw - 1, 47, (nw + 1) * 2 + 1, 3, dk); R(x, cx, 50, 1, 14, '#c9ccd0'); R(x, cx - 1, 51, 3, 2, '#e6e8ea'); line(x, cx - sh + 1, 57, cx - nw - 3, 50, '#f6f4ee'); line(x, cx - sh + 2, 58, cx - nw - 2, 51, '#f6f4ee'); line(x, cx + sh - 1, 57, cx + nw + 3, 50, '#f6f4ee'); line(x, cx + sh - 2, 58, cx + nw + 2, 51, '#f6f4ee'); break; }
    case 11: { const wh = '#f3f0e6'; fillBody(wh, (y, w) => { for (let xx = -w; xx <= w; xx++) if ((Math.floor((cx + xx) / 2) + Math.floor(y / 2)) % 2 === 0) P(x, cx + xx, y, mix(wh, c, 0.55)); }); R(x, cx - nw - 1, 47, (nw + 1) * 2 + 1, 3, mix(wh, c, 0.3)); R(x, cx, 50, 1, 14, shade(wh, -0.15)); for (let y = 52; y < 64; y += 3) P(x, cx, y, '#8a6a3a'); break; }
  }
  /* Hosenträger zur Lederhose */
  if (L.pants === 7 && ![8, 9].includes(t)) { const br = '#5b3a1e'; for (const s of [-1, 1]) R(x, cx + s * 8 - 1, 49, 3, 15, br); R(x, cx - 7, 57, 15, 3, br); R(x, cx - 1, 57, 3, 3, '#f2efe0'); P(x, cx, 58, '#e6c94a'); }
  /* Accessoires */
  const a = L.acc;
  if (a === 1) for (const s of [-1, 1]) { R(x, cx + s * (sh - 6) - 1, 49, 3, 15, '#30333a'); R(x, cx + s * (sh - 6) - 1, 58, 3, 2, '#8c9096'); }
  if (a === 2) { for (let k = -nw; k <= nw; k++) P(x, cx + k, 51 + Math.round((1 - (k * k) / (nw * nw)) * 3), '#e8c04a'); R(x, cx - 1, 54, 3, 3, '#e8c04a'); P(x, cx, 55, '#b8902a'); }
  if (a === 4) { for (let y = 47; y <= 51; y++) { const w = nw + 4; for (let xx = -w; xx <= w; xx++) P(x, cx + xx, y, Math.floor((xx + 20) / 3) % 2 ? '#1b4fa0' : '#f4f4f4'); } for (let y = 52; y < 64; y++) for (let xx = cx - 9; xx < cx - 4; xx++) P(x, xx, y, Math.floor(y / 3) % 2 ? '#1b4fa0' : '#f4f4f4'); }
  if (a === 5) { for (let k = 0; k < 16; k++) R(x, cx + sh - 5 - k * 1.3, 49 + k, 3, 1, '#2a2c33'); R(x, cx - sh + 2, 59, 10, 5, '#3a3d45'); R(x, cx - sh + 3, 60, 8, 1, '#5a5e68'); }
}

/* ---------- Spielfigur (Sprite 16x24 in 18x26-Rahmen) ---------- */
const SPR_W = 18, SPR_H = 26;
const POSES = ['stand', 'walkA', 'walkB', 'sit', 'drink', 'danceA', 'danceB', 'bend'];
const _sprCache = new Map();
function getSheet(L) {
  const key = lookKey(L);
  let s = _sprCache.get(key);
  if (s) return s;
  const [c, x] = canvas(SPR_W * POSES.length, SPR_H * 4);
  for (let d = 0; d < 4; d++)
    for (let p = 0; p < POSES.length; p++) {
      const [fc, fx] = canvas(SPR_W, SPR_H);
      const dir = d === 2 ? 1 : d;
      drawSprite(fx, L, dir, POSES[p], 1, 1);
      outlineCanvas(fc, fx);
      if (d === 2) { x.save(); x.translate(p * SPR_W + SPR_W, d * SPR_H); x.scale(-1, 1); x.drawImage(fc, 0, 0); x.restore(); }
      else x.drawImage(fc, p * SPR_W, d * SPR_H);
    }
  s = c;
  _sprCache.set(key, s);
  if (_sprCache.size > 80) _sprCache.delete(_sprCache.keys().next().value);
  return s;
}
function outlineCanvas(c, x) {
  const id = x.getImageData(0, 0, c.width, c.height), d = id.data, W = c.width, H = c.height;
  const op = (xx, yy) => xx >= 0 && yy >= 0 && xx < W && yy < H && d[(yy * W + xx) * 4 + 3] > 40;
  const out = [];
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) if (!op(xx, yy) && (op(xx - 1, yy) || op(xx + 1, yy) || op(xx, yy - 1) || op(xx, yy + 1))) out.push(yy * W + xx);
  for (const i of out) { d[i * 4] = 24; d[i * 4 + 1] = 18; d[i * 4 + 2] = 24; d[i * 4 + 3] = 235; }
  x.putImageData(id, 0, 0);
}

function drawSprite(x, L, dir, pose, OX, OY) {
  const p = (xx, yy, c) => P(x, OX + xx, OY + yy, c);
  const r = (xx, yy, w, h, c) => R(x, OX + xx, OY + yy, w, h, c);
  const skin = lc(L, 'skin'), skinD = shade(skin, -0.18), skinL = shade(skin, 0.12);
  const hair = lc(L, 'hairCol'), hairD = shade(hair, -0.3), hairL = shade(hair, 0.22);
  const beard = lc(L, 'beardCol');
  let topC = lc(L, 'topCol');
  const pantsC = lc(L, 'pantsCol'), shoeC = lc(L, 'shoesCol'), hatC = lc(L, 'hatCol');
  const sitting = pose === 'sit', bend = pose === 'bend';
  const walkA = pose === 'walkA', walkB = pose === 'walkB';
  const bob = walkA || walkB ? -1 : 0;
  const dh = [1, 0, -1][L.height];
  const sitDrop = sitting ? 3 : bend ? 2 : 0;
  const hy = 2 + dh + bob + sitDrop;
  const legsTop = (L.height === 2 ? 17 : 18) + (sitting ? 2 : 0);
  const tTop = hy + 9;
  const bw = [[5, 10], [4, 11], [4, 11], [3, 12]][L.build];
  const [tx0, tx1] = bw;
  const T = L.top;
  if (T === 11) topC = '#f1eee4';
  if (T === 8) topC = '#2c2622';
  const topD = shade(topC, -0.25), topL = shade(topC, 0.18);
  const longSleeve = ![0, 5, 6].includes(T);
  const shortsLike = L.pants === 3 || L.pants === 6 || L.pants === 7;
  /* -------- Rückansicht -------- */
  if (dir === 3) {
    // Beine
    if (!sitting) drawLegs(r, p, L, 3, pose, legsTop, pantsC, skin, shoeC, bw);
    // Rumpf
    r(tx0, tTop, tx1 - tx0 + 1, legsTop - tTop, topC);
    r(tx0, legsTop - 1, tx1 - tx0 + 1, 1, topD);
    if (T === 6) pxTextTiny(r, '10', tx0 + 1, tTop + 1, '#f6f4ee');
    if (T === 3) r(tx0 + 1, tTop, tx1 - tx0 - 1, 2, topD);
    if (T === 7 || T === 11) for (let yy = tTop; yy < legsTop; yy++) for (let xx = tx0; xx <= tx1; xx++) if ((xx + yy) % 3 === 0) p(xx, yy, T === 11 ? mix('#f1eee4', lc(L, 'topCol'), 0.5) : topD);
    if (L.pants === 7) { r(tx0 + 1, tTop, 1, legsTop - tTop, '#5b3a1e'); r(tx1 - 1, tTop, 1, legsTop - tTop, '#5b3a1e'); r(tx0 + 2, tTop + 2, tx1 - tx0 - 3, 1, '#5b3a1e'); }
    // Arme
    const armUp = pose === 'danceA' || pose === 'danceB';
    for (const ax of [tx0 - 1, tx1 + 1]) {
      if (armUp && (pose === 'danceA' || ax > 8)) { r(ax, hy - 2, 1, tTop - hy + 3, longSleeve ? topC : skin); p(ax, hy - 3, skin); }
      else { r(ax, tTop + 1, 1, legsTop - tTop - 1, longSleeve ? topD : skin); if (!longSleeve) r(ax, tTop + 1, 1, 2, topD); p(ax, legsTop, skin); }
    }
    if (L.acc === 1) { r(5, tTop + 1, 6, 5, '#30333a'); r(6, tTop + 2, 4, 1, '#4a4e57'); }
    // Kopf
    r(5, hy, 6, 1, skin); r(4, hy + 1, 8, 7, skin); r(5, hy + 8, 6, 1, skin);
    r(6, hy + 9, 4, 1, skinD);
    const earW = L.ears === 2 ? 2 : 1;
    r(4 - earW, hy + 4, earW, 2, skinD); r(12, hy + 4, earW, 2, skinD);
    drawHairBack(r, p, L, hy, hair, hairD, hairL, skin);
    drawHatSprite(r, p, L, 3, hy, hatC);
    return;
  }
  /* -------- Seitenansicht (nach links) -------- */
  if (dir === 1) {
    if (!sitting) drawLegs(r, p, L, 1, pose, legsTop, pantsC, skin, shoeC, bw);
    else {
      r(3, legsTop, 6, 2, pantsC); r(3, legsTop + 2, 3, 2, shortsLike ? skin : pantsC); r(2, legsTop + 4, 4, 2, shoeC); r(2, legsTop + 5, 4, 1, shade(shoeC, -0.3));
    }
    const sx0 = tx0 + 2, sx1 = tx1 - 1;
    r(sx0, tTop, sx1 - sx0 + 1, legsTop - tTop, topC);
    r(sx1, tTop, 1, legsTop - tTop, topD);
    if (L.acc === 1) r(sx1 - 1, tTop + 1, 3, 5, '#30333a');
    if (L.acc === 5) r(sx0 - 1, legsTop - 2, 3, 2, '#3a3d45');
    if (L.pants === 7) r(sx0 + 1, tTop, 1, legsTop - tTop, '#5b3a1e');
    if (T === 8) r(sx0, tTop + 1, 1, legsTop - tTop - 2, lc(L, 'topCol'));
    // Kopf
    r(5, hy, 5, 1, skin); r(4, hy + 1, 7, 7, skin); r(5, hy + 8, 5, 1, skin);
    r(9, hy + 1, 1, 7, skinD);
    p(3, hy + 5, skin); p(3, hy + 6, skinD);
    if ([2, 4, 5].includes(L.nose)) p(2, hy + 5, skinD);
    r(6, hy + 9, 3, 1, skinD);
    p(5, hy + 4, '#21160f');
    if (L.eyes === 1 || L.eyes === 6) p(5, hy + 3, '#f5f2ea');
    p(4, hy + 7, shade(skin, -0.4));
    const earX = 8; r(earX, hy + 4, 1 + (L.ears === 2 ? 1 : 0), 2, skinD);
    if (L.jewel >= 1) p(earX, hy + 6, '#f2c84b');
    drawBeardSide(r, p, L, hy, beard, skin);
    drawHairSide(r, p, L, hy, hair, hairD, hairL, skin);
    if (L.glasses) { const gc = L.glasses === 4 ? '#18181c' : L.glasses === 5 ? '#ff7a2a' : L.glasses === 3 ? '#c9a24a' : L.glasses === 8 ? '#7a4a20' : '#202024'; r(4, hy + 4, 3, 1, gc); r(7, hy + 4, 2, 1, gc); if (L.glasses === 4) r(4, hy + 3, 2, 1, gc); }
    drawHatSprite(r, p, L, 1, hy, hatC);
    // Arm
    let ax = 7, ay = tTop + 1;
    if (walkA) ax = 5; if (walkB) ax = 9;
    if (pose === 'drink') { r(4, hy + 6, 2, tTop - hy - 4, longSleeve ? topC : skin); drawMug(r, p, 1, hy + 4); }
    else if (pose === 'danceA' || pose === 'danceB') { r(7, hy - 2, 2, tTop - hy + 3, longSleeve ? topC : skin); p(7, hy - 3, skin); p(8, hy - 3, skin); }
    else if (bend) { r(5, tTop + 1, 2, legsTop - tTop - 1, longSleeve ? topD : skin); }
    else if (sitting) { r(6, tTop + 1, 2, legsTop - tTop - 1, longSleeve ? topD : skin); p(5, legsTop - 1, skin); }
    else { r(ax, ay, 2, legsTop - tTop - 1, longSleeve ? topD : skin); if (!longSleeve) r(ax, ay, 2, 2, topD); r(ax, legsTop, 2, 1, skin); if (L.acc === 3) p(ax, legsTop - 1, '#d9dde3'); }
    if (T === 10) p(ax, tTop + 2, '#f6f4ee');
    return;
  }
  /* -------- Frontansicht -------- */
  if (!sitting) drawLegs(r, p, L, 0, pose, legsTop, pantsC, skin, shoeC, bw);
  else { r(5, legsTop, 6, 2, pantsC); r(5, legsTop + 2, 2, 2, shortsLike ? skin : pantsC); r(9, legsTop + 2, 2, 2, shortsLike ? skin : pantsC); r(4, legsTop + 4, 3, 2, shoeC); r(9, legsTop + 4, 3, 2, shoeC); }
  // langes Haar hinter dem Körper
  if ([10, 14, 11, 8].includes(L.hair)) drawHairBehind(r, p, L, hy, hair, hairD);
  // Rumpf
  r(tx0, tTop, tx1 - tx0 + 1, legsTop - tTop, topC);
  r(tx1 - 1, tTop, 2, legsTop - tTop, topD);
  if (L.build === 2) { p(tx0 - 1, tTop, topC); p(tx1 + 1, tTop, topD); }
  r(tx0, legsTop - 1, tx1 - tx0 + 1, 1, L.pants === 7 ? '#5b3a1e' : shade(pantsC, -0.25));
  drawTopFront(r, p, L, T, tTop, legsTop, tx0, tx1, topC, topD, topL, skin);
  // Arme
  const armCol = longSleeve ? topC : skin, armColD = longSleeve ? topD : skinD;
  const drawArm = (ax, side) => {
    if (pose === 'drink' && side > 0) { r(ax, tTop + 1, 1, 2, armCol); r(ax - 1, hy + 7, 1, tTop - hy - 6, armCol); drawMug(r, p, ax - 2, hy + 6); return; }
    if (pose === 'danceA' || (pose === 'danceB' && side > 0)) { r(ax + side, hy - 1, 1, tTop - hy + 2, armCol); p(ax + side, hy - 2, skin); p(ax, tTop, armCol); return; }
    if (pose === 'danceB' && side < 0) { r(ax - 2, tTop + 1, 3, 1, armCol); p(ax - 3, tTop + 1, skin); return; }
    let len = legsTop - tTop - 1;
    if ((walkA && side < 0) || (walkB && side > 0)) len += 1;
    if ((walkA && side > 0) || (walkB && side < 0)) len -= 1;
    r(ax, tTop + 1, 1, len, side > 0 ? armColD : armCol);
    if (!longSleeve && T !== 5) r(ax, tTop + 1, 1, 2, side > 0 ? topD : topC);
    p(ax, tTop + 1 + len, skin);
    if (T === 10) p(ax, tTop + 2, '#f6f4ee');
    if (L.acc === 3 && side < 0) p(ax, tTop + len, '#d9dde3');
  };
  drawArm(tx0 - 1, -1); drawArm(tx1 + 1, 1);
  if (L.acc === 1) { r(tx0 + 1, tTop, 1, 4, '#30333a'); r(tx1 - 1, tTop, 1, 4, '#30333a'); }
  if (L.acc === 5) { for (let k = 0; k < 5; k++) p(tx1 - 1 - k, tTop + k, '#2a2c33'); r(tx0, tTop + 5, 3, 2, '#3a3d45'); }
  if (L.acc === 4) { r(5, tTop, 6, 1, '#1b4fa0'); p(6, tTop, '#f4f4f4'); p(8, tTop, '#f4f4f4'); r(5, tTop + 1, 1, 3, '#1b4fa0'); p(5, tTop + 2, '#f4f4f4'); }
  if (L.acc === 2) p(8, tTop + 1, '#e8c04a');
  // Kopf
  r(5, hy, 6, 1, skin); r(4, hy + 1, 8, 7, skin); r(5, hy + 8, 6, 1, skin);
  r(11, hy + 1, 1, 7, skinD); r(5, hy + 8, 6, 1, skinD);
  if (L.head === 1 || L.head === 5) { p(4, hy + 8, skin); p(11, hy + 8, skinD); }
  if (L.head === 3) r(5, hy + 9, 6, 1, skinD);
  const earW = L.ears === 2 ? 2 : 1;
  r(4 - earW, hy + 4, earW, 2, skin); r(12, hy + 4, earW, 2, skinD);
  if (L.ears === 3) { p(3, hy + 3, skin); p(12, hy + 3, skinD); }
  // Gesicht
  const eyeY = hy + 4, eyeDark = '#21160f';
  if (L.eyes === 4 || L.eyes === 2) { p(6, eyeY, shade(skin, -0.45)); p(9, eyeY, shade(skin, -0.45)); }
  else { p(6, eyeY, eyeDark); p(9, eyeY, eyeDark); if (L.eyes === 1 || L.eyes === 6) { p(5, eyeY, '#f5f2ea'); p(10, eyeY, '#f5f2ea'); } }
  const browC = mix(L.hair === 0 || L.hair === 12 ? beard : hair, '#2a1a12', 0.35);
  if ([1, 5, 6].includes(L.brows)) { p(5, eyeY - 1, browC); p(6, eyeY - 1, browC); p(9, eyeY - 1, browC); p(10, eyeY - 1, browC); if (L.brows === 6) { p(7, eyeY - 1, browC); p(8, eyeY - 1, browC); } }
  p(8, hy + 5, skinD); if ([2, 4, 5].includes(L.nose)) p(7, hy + 6, skinD);
  const mouthC = shade(mix(skin, '#7a2a2a', 0.5), -0.1);
  if (L.mouth === 2 || L.mouth === 6) { r(6, hy + 7, 4, 1, '#f4efe4'); p(5, hy + 6, mouthC); p(10, hy + 6, mouthC); if (L.mouth === 6) p(8, hy + 7, '#3a1010'); }
  else r(7, hy + 7, 2, 1, mouthC);
  if (L.mark === 5 || L.mark === 6) { p(5, hy + 6, mix(skin, '#e05a6a', 0.45)); p(10, hy + 6, mix(skin, '#e05a6a', 0.45)); }
  if (L.mark === 1) { p(5, hy + 5, mix(skin, '#9a4a20', 0.4)); p(10, hy + 5, mix(skin, '#9a4a20', 0.4)); }
  if (L.mark === 2) { p(10, hy + 5, skinL); p(10, hy + 6, skinL); }
  if (L.jewel === 1 || L.jewel === 3 || L.jewel === 4) p(3, hy + 6, '#f2c84b');
  if (L.jewel >= 2) p(12, hy + 6, L.jewel === 2 ? '#d9dde3' : '#f2c84b');
  drawBeardFront(r, p, L, hy, beard, skin);
  drawHairFront(r, p, L, hy, hair, hairD, hairL, skin);
  if (L.glasses) {
    const gc = ['', '#26262c', '#26262c', '#c9a24a', '#151519', '#2b2b30', '#5a3418', '#7d6b55', '#7a4a20'][L.glasses];
    if (L.glasses === 4) { r(5, eyeY, 6, 1, '#151519'); p(5, eyeY, '#5a6070'); }
    else if (L.glasses === 5) { r(4, eyeY, 8, 1, '#ff7a2a'); p(9, eyeY, '#b45ad0'); p(10, eyeY, '#b45ad0'); }
    else if (L.glasses === 7) { p(5, eyeY + 1, gc); p(7, eyeY + 1, gc); p(8, eyeY + 1, gc); p(10, eyeY + 1, gc); }
    else { p(5, eyeY, gc); p(7, eyeY, gc); p(8, eyeY, gc); p(10, eyeY, gc); if (L.glasses === 6) { p(6, eyeY - 1, gc); p(9, eyeY - 1, gc); } }
  }
  drawHatSprite(r, p, L, 0, hy, hatC);
}
function drawMug(r, p, xx, yy) { r(xx, yy, 2, 3, '#e8b33a'); r(xx, yy - 1, 2, 1, '#fbf6e8'); p(xx + 2, yy + 1, '#d9e2e6'); }
function pxTextTiny(r, s, xx, yy, c) {
  const G = { 1: ['010', '110', '010', '010', '111'], 0: ['111', '101', '101', '101', '111'] };
  let cx = xx;
  for (const ch of s) { const g = G[ch]; for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (g[j][i] === '1') r(cx + i, yy + j, 1, 1, c); cx += 3; }
}
function drawLegs(r, p, L, dir, pose, legsTop, pantsC, skin, shoeC, bw) {
  const pd = shade(pantsC, -0.25);
  const shD = shade(shoeC, -0.35), shL = shade(shoeC, 0.25);
  const pt = L.pants, sh = L.shoes;
  const legLen = 22 - legsTop; // bis inkl. Zeile 21
  const short = pt === 3 ? 2 : pt === 6 ? 3 : pt === 7 ? 2 : 0;
  const sock = pt === 7 ? '#ecebe4' : null;
  const leg = (xx, w, yOff, len, front) => {
    const y0 = legsTop + yOff;
    for (let k = 0; k < len; k++) {
      let c = k < (short || len) ? (front ? pantsC : pd) : skin;
      if (short && k >= short && sock && k >= short + 1) c = sock;
      r(xx, y0 + k, w, 1, c);
    }
    if (pt === 4 && !short) r(xx, y0 + len - 1, w, 1, shade(pantsC, -0.4));
    if (pt === 2 && w > 2) p(xx + (dir === 0 ? 0 : 1), y0 + 1, shade(pantsC, -0.35));
    if (pt === 7) r(xx, y0, w, 1, shade('#6b4423', 0));
  };
  const shoe = (xx, yy, w, toeLeft) => {
    const h = sh === 1 ? 3 : 2;
    const sc = sh === 6 ? '#5a3a1e' : sh === 4 ? mix(shoeC, '#c9a27a', 0.4) : shoeC;
    r(xx, yy - (h - 2), w, h, sc);
    if (sh === 0 || sh === 5) r(xx, yy + 1, w, 1, '#f2f0ea');
    else r(xx, yy + 1, w, 1, shade(sc, -0.35));
    if (sh === 4) { r(xx, yy, w, 1, skin); p(xx + 1, yy, shade(sc, -0.2)); }
    if (sh === 5) p(xx + (toeLeft ? 0 : w - 1), yy, '#c8f03a');
    if (sh === 2 || sh === 6) p(xx + Math.floor(w / 2), yy, shL);
    if (sh === 3) p(xx + 1, yy, shL);
  };
  const pc = pt === 7 ? '#6b4423' : pantsC;
  if (pt === 7) pantsC = '#6b4423';
  if (dir === 0 || dir === 3) {
    const [tx0, tx1] = bw;
    const lx = tx0 + 1, rx = Math.floor((tx0 + tx1) / 2) + 1;
    const lw = rx - lx, rw = tx1 - rx;
    const la = pose === 'walkA' ? -1 : 0, rb = pose === 'walkB' ? -1 : 0;
    const spread = pose === 'danceB' ? 1 : 0;
    leg(lx - spread, lw, 0, legLen + la, true);
    leg(rx + spread, rw, 0, legLen + rb, true);
    r(rx - 1 + spread, legsTop, 1, legLen + rb, shade(pc, -0.2));
    shoe(lx - 1 - spread, 22 + la, lw + 1, true);
    shoe(rx + spread, 22 + rb, rw + 1, false);
    return;
  }
  // Seite
  if (pose === 'walkA' || pose === 'walkB') {
    const f = pose === 'walkA';
    leg(f ? 5 : 6, 2, 0, legLen, false); leg(f ? 9 : 8, 2, 0, legLen, true);
    shoe(f ? 4 : 5, 22, 3, true); shoe(f ? 9 : 8, 22, 3, true);
  } else {
    leg(7, 3, 0, legLen, true);
    shoe(6, 22, 4, true);
  }
}
function drawTopFront(r, p, L, T, tTop, legsTop, tx0, tx1, c, cd, cl, skin) {
  const mid = Math.floor((tx0 + tx1) / 2);
  const pr = L.print;
  if (T === 0 || T === 4 || T === 3) { p(mid, tTop, shade(skin, -0.2)); p(mid + 1, tTop, shade(skin, -0.2)); }
  if (T === 1 || T === 2 || T === 7 || T === 11) { p(mid - 1, tTop, cl); p(mid + 2, tTop, cl); p(mid, tTop, shade(skin, -0.2)); p(mid + 1, tTop, shade(skin, -0.2)); if (T !== 2) for (let yy = tTop + 2; yy < legsTop - 1; yy += 2) p(mid, yy, cd); }
  if (T === 7) for (let yy = tTop; yy < legsTop - 1; yy++) for (let xx = tx0; xx <= tx1; xx++) if ((xx + yy) % 3 === 0) p(xx, yy, cd);
  if (T === 11) { const pc = lc(L, 'topCol'); for (let yy = tTop + 1; yy < legsTop - 1; yy++) for (let xx = tx0; xx <= tx1; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, mix('#f1eee4', pc, 0.5)); p(mid, tTop, shade(skin, -0.2)); }
  if (T === 3) { p(mid, tTop + 1, '#efefef'); p(mid + 1, tTop + 1, '#efefef'); p(mid, tTop + 2, '#efefef'); p(mid + 1, tTop + 2, '#efefef'); r(tx0 + 1, tTop + 4, tx1 - tx0 - 1, 1, cd); }
  if (T === 5) { r(tx0, tTop, 1, 2, skin); r(tx1, tTop, 1, 2, skin); r(mid, tTop, 2, 1, skin); }
  if (T === 6) { p(mid, tTop, '#f6f4ee'); p(mid + 1, tTop, '#f6f4ee'); p(mid, tTop + 1, shade(skin, -0.2)); p(mid + 1, tTop + 1, '#f6f4ee'); }
  if (T === 8) { const ic = lc(L, 'topCol'); r(mid, tTop, 2, legsTop - tTop - 1, ic); p(mid - 1, tTop + 1, '#4a3f38'); p(mid + 2, tTop + 1, '#4a3f38'); }
  if (T === 9) { r(mid, tTop, 2, 3, '#f1efe8'); p(mid - 1, tTop + 1, cl); p(mid + 2, tTop + 1, cl); p(mid, tTop + 4, shade(c, -0.45)); }
  if (T === 10) { r(mid, tTop, 1, legsTop - tTop - 1, '#c9ccd0'); r(tx0, tTop, tx1 - tx0 + 1, 1, cd); }
  if (L.pants === 7 && T !== 8 && T !== 9) { r(tx0 + 1, tTop, 1, legsTop - tTop - 1, '#5b3a1e'); r(tx1 - 1, tTop, 1, legsTop - tTop - 1, '#5b3a1e'); r(tx0 + 1, tTop + 3, tx1 - tx0 - 1, 1, '#5b3a1e'); }
  if ([0, 2, 3, 4, 5, 6].includes(T)) {
    if (pr === 1) for (let yy = tTop + 2; yy < legsTop - 1; yy += 2) r(tx0, yy, tx1 - tx0, 1, T === 6 ? '#f6f4ee' : cl);
    if (pr === 2) { const red = L.topCol <= 1; r(mid - 1, tTop + 2, 4, 4, red ? '#fff' : '#d52b1e'); r(mid, tTop + 3, 2, 2, red ? '#d52b1e' : '#fff'); p(mid - 1 + 1, tTop + 3, red ? '#d52b1e' : '#fff'); }
    if (pr === 4) for (let yy = tTop + 1; yy < legsTop - 1; yy++) for (let xx = tx0; xx <= tx1; xx++) if ((Math.floor(xx / 2) + Math.floor(yy / 2)) % 2) p(xx, yy, cd);
    if (pr === 5) p(tx1 - 2, tTop + 2, '#f6f4ee');
    if (pr === 3) { p(mid, tTop + 2, '#f6f4ee'); p(mid + 1, tTop + 2, '#f6f4ee'); p(mid, tTop + 3, '#f6f4ee'); p(mid + 1, tTop + 4, '#f6f4ee'); }
  }
}
function drawBeardFront(r, p, L, hy, c, skin) {
  const st = L.beard; if (!st) return;
  const stub = mix(c, skin, 0.5);
  const y = hy;
  switch (st) {
    case 1: for (let yy = y + 6; yy <= y + 8; yy++) for (let xx = 5; xx <= 10; xx++) if ((xx + yy) % 2 === 0 && !(yy === y + 7 && (xx === 7 || xx === 8))) p(xx, yy, stub); break;
    case 2: r(6, y + 6, 4, 1, c); break;
    case 3: r(5, y + 6, 6, 2, c); p(5, y + 8, c); p(10, y + 8, c); break;
    case 4: r(7, y + 8, 2, 1, c); break;
    case 5: r(6, y + 6, 4, 1, c); r(6, y + 8, 4, 1, c); p(6, y + 7, c); p(9, y + 7, c); break;
    case 6: r(6, y + 6, 4, 1, c); r(7, y + 8, 2, 2, c); break;
    case 7: case 8: case 12: r(4, y + 5, 1, 3, c); r(11, y + 5, 1, 3, c); r(5, y + 7, 2, 2, c); r(9, y + 7, 2, 2, c); r(6, y + 6, 4, 1, c); r(6, y + 8, 4, 1, c);
      if (st >= 8) r(6, y + 9, 4, 1, c); if (st === 8) r(7, y + 10, 2, 1, c);
      if (st === 12) { r(6, y + 10, 4, 1, c); r(7, y + 11, 2, 2, shade(c, -0.15)); p(7, y + 12, '#c8ccd2'); }
      break;
    case 9: r(4, y + 3, 1, 5, c); r(11, y + 3, 1, 5, c); p(5, y + 6, c); p(10, y + 6, c); r(6, y + 6, 4, 1, c); break;
    case 10: r(6, y + 6, 4, 1, c); r(6, y + 7, 1, 2, c); r(9, y + 7, 1, 2, c); break;
    case 11: r(4, y + 5, 1, 3, c); r(11, y + 5, 1, 3, c); r(5, y + 8, 6, 1, c); break;
    case 13: r(6, y + 6, 4, 1, c); p(5, y + 5, c); p(10, y + 5, c); p(7, y + 8, c); break;
  }
}
function drawBeardSide(r, p, L, hy, c, skin) {
  const st = L.beard; if (!st) return;
  const y = hy;
  if (st === 1) { p(5, y + 6, mix(c, skin, 0.5)); p(7, y + 7, mix(c, skin, 0.5)); return; }
  if ([2, 3, 5, 6, 10, 13].includes(st)) r(3, y + 6, 3, 1, c);
  if ([4, 5, 6].includes(st)) r(4, y + 8, 2, 1, c);
  if ([7, 8, 12].includes(st)) { r(4, y + 6, 5, 3, c); if (st >= 8) r(4, y + 9, 3, st === 12 ? 4 : 2, c); }
  if (st === 9) r(6, y + 3, 2, 5, c);
  if (st === 11) { r(6, y + 5, 2, 3, c); r(4, y + 8, 4, 1, c); }
}
function hairStyleSprite(L) { return L.hair; }
function drawHairFront(r, p, L, hy, h, hd, hl, skin) {
  const st = L.hair, hat = L.hat > 0, y = hy;
  const stub = mix(h, skin, 0.45);
  const capTop = (from) => { r(5, from, 6, 1, h); r(4, from + 1, 8, y + 2 - from - 1, h); };
  const sides = (to, x0 = 4, x1 = 11) => { r(x0, y + 2, 1, to - y - 1, hd); r(x1, y + 2, 1, to - y - 1, hd); };
  switch (st) {
    case 0: if (!hat) p(6, y + 1, shade(skin, 0.25)); break;
    case 1: for (let yy = y; yy <= y + 2; yy++) for (let xx = 4; xx <= 11; xx++) if ((xx + yy) % 2 === 0 && (yy > y || (xx > 4 && xx < 11))) p(xx, yy, stub); break;
    case 2: capTop(y - 1); r(4, y + 2, 2, 1, h); r(9, y + 2, 3, 1, h); sides(y + 3); p(6, y, hl); break;
    case 3: capTop(y - 1); r(4, y + 2, 5, 1, h); r(4, y + 3, 2, 1, hd); sides(y + 3); p(6, y - 1, hd); p(9, y, hl); break;
    case 4: r(5, y - 1, 6, 3, h); for (let yy = y + 1; yy <= y + 3; yy++) { p(4, yy, stub); p(11, yy, stub); } p(7, y - 1, hl); break;
    case 5: capTop(y - 1); if (!hat) { r(5, y - 2, 5, 1, h); p(6, y - 2, hl); } sides(y + 2); break;
    case 6: if (!hat) r(7, y - 3, 2, 5, h); else r(7, y, 2, 2, h); p(7, y - 3, hl); for (let yy = y + 1; yy <= y + 3; yy++) { p(4, yy, stub); p(11, yy, stub); } break;
    case 7: r(3, y - 1, 10, 3, h); if (!hat) r(4, y - 2, 8, 1, h); r(4, y + 2, 8, 1, h); r(3, y + 2, 1, 5, h); r(12, y + 2, 1, 5, h); for (let xx = 3; xx <= 12; xx += 2) { p(xx, y - 1, hl); p(xx + 1, y + 1, hd); } break;
    case 8: r(4, y - 1, 8, 3, h); r(4, y + 2, 8, 1, h); for (let xx = 4; xx <= 11; xx += 2) p(xx, y, hl); break;
    case 9: r(5, y, 6, 1, h); r(4, y + 1, 8, 1, h); if (!hat) { r(7, y - 3, 2, 3, h); p(7, y - 3, hl); } sides(y + 3); p(6, y + 1, hd); break;
    case 10: capTop(y - 1); r(4, y + 2, 3, 1, h); r(9, y + 2, 3, 1, h); r(3, y + 2, 2, 9, h); r(11, y + 2, 2, 9, h); r(3, y + 9, 1, 3, hd); r(12, y + 9, 1, 3, hd); p(7, y, hd); break;
    case 11: capTop(y - 1); r(5, y + 2, 2, 1, h); r(9, y + 2, 2, 1, h); sides(y + 3); p(6, y - 1, hl); break;
    case 12: r(4, y + 2, 1, 4, h); r(11, y + 2, 1, 4, h); if (!hat) p(6, y + 1, shade(skin, 0.25)); break;
    case 13: capTop(y - 1); if (!hat) { p(5, y - 2, h); p(7, y - 2, h); p(9, y - 2, h); p(6, y - 3, h); p(10, y - 3, h); } sides(y + 3); break;
    case 14: capTop(y - 1); r(4, y + 2, 2, 1, h); r(10, y + 2, 2, 1, h); for (const xx of [3, 4, 11, 12]) for (let yy = y + 2; yy <= y + 12; yy++) p(xx, yy, (xx + Math.floor(yy / 2)) % 2 ? h : hd); break;
    case 15: capTop(y - 1); if (!hat) { r(5, y - 3, 7, 2, h); p(6, y - 3, hl); p(7, y - 3, hl); } sides(y + 2); break;
    case 16: capTop(y - 1); r(4, y + 2, 3, 1, h); r(9, y + 2, 3, 1, h); r(4, y + 3, 1, 4, h); r(11, y + 3, 1, 4, h); p(7, y, shade(skin, -0.1)); p(8, y, shade(skin, -0.1)); break;
    case 17: if (!hat) r(4, y - 2, 8, 4, h); else r(4, y, 8, 2, h); r(4, y - 2, 8, 1, hl); for (let yy = y + 2; yy <= y + 3; yy++) { p(4, yy, stub); p(11, yy, stub); } break;
  }
}
function drawHairBehind(r, p, L, hy, h, hd) {
  const st = L.hair, y = hy;
  if (st === 8) { r(2, y - 3, 12, 9, h); r(1, y - 1, 14, 5, h); r(3, y - 4, 10, 1, h); }
  if (st === 10 || st === 14) r(3, y + 5, 10, 8, hd);
  if (st === 11) { r(4, y + 8, 8, 4, hd); }
}
function drawHairBack(r, p, L, hy, h, hd, hl, skin) {
  const st = L.hair, y = hy, hat = L.hat > 0;
  const stub = mix(h, skin, 0.45);
  if (st === 0) { p(7, y + 1, shade(skin, 0.2)); return; }
  if (st === 1) { for (let yy = y; yy <= y + 6; yy++) for (let xx = 4; xx <= 11; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, stub); return; }
  if (st === 12) { r(4, y + 3, 8, 5, h); r(5, y + 8, 6, 1, hd); return; }
  if (st === 8) { r(2, y - 3, 12, 11, h); r(1, y - 1, 14, 7, h); r(3, y - 4, 10, 1, h); return; }
  let bottom = y + 7;
  if ([7, 16].includes(st)) bottom = y + 9;
  if ([10, 11, 14].includes(st)) bottom = y + 12;
  r(5, y - 1, 6, 1, h); r(4, y, 8, bottom - y, h); r(5, bottom, 6, 1, hd);
  if (st === 10 || st === 14) r(3, y + 4, 10, bottom - y - 3, h);
  for (let yy = y; yy < bottom; yy++) if (yy % 2) p(5 + (yy % 3), yy, hd);
  if ((st === 4 || st === 6 || st === 17) ) { for (let yy = y + 3; yy < bottom; yy++) for (let xx = 4; xx <= 11; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, stub); }
  if (st === 6 && !hat) r(7, y - 3, 2, 6, h);
  if (st === 9 && !hat) { r(7, y - 2, 2, 2, h); r(7, y, 2, 1, hd); }
  if (st === 14) for (let xx = 3; xx <= 12; xx += 2) r(xx, y + 2, 1, bottom - y - 2, hd);
}
function drawHairSide(r, p, L, hy, h, hd, hl, skin) {
  const st = L.hair, y = hy, hat = L.hat > 0;
  const stub = mix(h, skin, 0.45);
  if (st === 0) { p(6, y + 1, shade(skin, 0.25)); return; }
  if (st === 1) { for (let yy = y; yy <= y + 4; yy++) for (let xx = 5; xx <= 10; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, stub); return; }
  if (st === 12) { r(8, y + 2, 3, 6, h); return; }
  if (st === 8) { r(5, y - 3, 9, 10, h); r(4, y - 2, 10, 4, h); return; }
  r(5, y - 1, 5, 1, h); r(4, y, 7, 2, h); r(7, y + 2, 4, 3, h); r(9, y + 5, 2, 2, hd);
  if ([2, 3, 5, 7, 13, 15, 16].includes(st)) r(4, y + 2, 2, 1, h);
  if ([7, 16].includes(st)) r(8, y + 5, 3, 4, h);
  if ([10, 14].includes(st)) r(8, y + 4, 3, 9, st === 14 ? hd : h);
  if (st === 11) r(9, y + 5, 2, 7, h);
  if ([4, 6, 17].includes(st)) { r(6, y + 2, 5, 4, skin); for (let yy = y + 2; yy <= y + 5; yy++) for (let xx = 6; xx <= 10; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, stub); }
  if (hat) return;
  if (st === 5) r(3, y - 2, 5, 2, h);
  if (st === 15) r(3, y - 3, 6, 3, h);
  if (st === 6) r(6, y - 3, 4, 3, h);
  if (st === 9) r(9, y - 2, 2, 2, h);
  if (st === 13) { p(5, y - 2, h); p(7, y - 2, h); p(9, y - 2, h); }
  if (st === 17) r(4, y - 2, 7, 2, h);
  p(6, y - 1, hl);
}
function drawHatSprite(r, p, L, dir, hy, c) {
  const st = L.hat; if (!st) return;
  const dk = shade(c, -0.3), lt = shade(c, 0.2), y = hy;
  const side = dir === 1;
  switch (st) {
    case 1: case 5: case 2: case 11: {
      r(5, y - 1, 6, 1, c); r(4, y, 8, 2, c); p(7, y - 1, lt);
      if (st === 5 && !side && dir !== 3) r(6, y - 1, 4, 2, mix(c, '#ffffff', 0.7));
      if (side) { if (st === 2) r(9, y + 1, 3, 1, dk); else if (st === 11) r(2, y + 1, 3, 1, dk); else r(1, y + 1, 4, 1, dk); }
      else if (dir === 0) { if (st === 2) r(6, y - 2, 4, 1, dk); else if (st === 11) r(5, y + 1, 6, 1, dk); else r(4, y + 1, 8, 1, dk); }
      else { if (st === 2) r(4, y + 1, 8, 1, dk); else r(6, y + 1, 4, 1, dk); }
      break;
    }
    case 3: r(5, y - 1, 6, 1, c); r(4, y, 8, 3, c); r(4, y + 2, 8, 1, dk); for (let xx = 4; xx <= 11; xx += 2) p(xx, y + 2, c); r(7, y - 3, 2, 2, lt); break;
    case 4: r(5, y - 1, 6, 2, c); r(3, y + 1, 10, 1, dk); r(4, y + 1, 8, 1, c); r(3, y + 2, 10, 1, dk); break;
    case 6: r(4, y + 2, 8, 1, c); if (dir === 3) p(11, y + 3, c); break;
    case 7: r(5, y - 3, 6, 3, c); p(7, y - 3, dk); p(8, y - 3, dk); r(5, y - 1, 6, 1, dk); r(1, y, 14, 1, c); p(1, y - 1, c); p(14, y - 1, c); r(2, y + 1, 12, 1, dk); break;
    case 8: r(4, y - 1, 8, 3, c); for (let xx = 4; xx < 12; xx += 3) p(xx, y, dk); if (side) r(2, y + 1, 3, 1, dk); else if (dir === 0) r(5, y + 2, 6, 1, dk); break;
    case 9: r(6, y - 3, 4, 1, c); r(5, y - 2, 6, 3, c); for (let xx = 5; xx <= 10; xx++) p(xx, y, xx % 2 ? '#c23a2a' : '#2f7a3a'); r(3, y + 1, 10, 1, c); r(3, y + 2, 10, 1, dk); r(11, y - 5, 1, 4, '#1d1d1d'); p(12, y - 6, '#1d1d1d'); p(12, y - 7, '#f0f0f0'); break;
    case 10: r(4, y - 1, 8, 1, lt); r(3, y, 11, 2, c); r(5, y + 2, 7, 1, dk); p(8, y - 2, dk); if (side) r(10, y, 4, 1, dk); else if (dir === 0) p(13, y + 1, c); break;
  }
}

/* Porträt-Cache für Dialoge */
const _portCache = new Map();
function portraitCanvas(L, bg) {
  const key = lookKey(L) + (bg || '');
  let c = _portCache.get(key);
  if (c) return c;
  const [cv, x] = canvas(64, 64);
  drawPortrait(x, L, { bg });
  _portCache.set(key, cv);
  if (_portCache.size > 60) _portCache.delete(_portCache.keys().next().value);
  return cv;
}
