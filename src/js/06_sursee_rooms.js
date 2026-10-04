/* ============ Sursee: Innenräume ============
   Alle Innenräume des zweiten Kapitels: Zunftstube (im oberen Waschhaus beim Diebenturm), Rathaus, Wilder Mann, Pizzeria zur Mühle, Stadtcafé,
   die Bars der Oberstadt, Surseepark, Stadttheater, Museum Sankturbanhof, Stadthalle, Kulturwerk 118, Isas Wohnung,
   Polizeiposten, Kapuzinerkloster – plus das Gamma-Inseli im Sempachersee (Aussenkarte).
   Räume über sRoom() (06_sursee.js); Interaktionen rufen Sur.* bzw. Story.shop(id) – nur in Rückrufen, nie auf oberster Ebene.
   spots = Plätze für Figuren, die die Story je nach Lage setzt (Freunde, Isa, Kinder, Täter). */

/* ---------- Helfer: Wandschmuck (in den Boden-Layer gemalt) ---------- */
function srFrame(c, px, py, w, h, fn, fr = '#c9a65a') {
  R(c, px, py, w, h, shade(fr, -0.4)); R(c, px + 1, py + 1, w - 2, h - 2, fr); R(c, px + 2, py + 2, w - 4, h - 4, '#2a2420');
  P(c, px + 1, py + 1, shade(fr, 0.45));
  if (fn) { c.save(); c.beginPath(); c.rect(px + 2, py + 2, w - 4, h - 4); c.clip(); fn(c, px + 2, py + 2, w - 4, h - 4); c.restore(); }
  R(c, px, py + h, w, 1, 'rgba(0,0,0,0.18)');
}
/* Ölbild eines Ratsherrn / Zunftmeisters */
function srPortrait(c, px, py, k = 0) {
  srFrame(c, px, py, 12, 15, (c, x, y, w, h) => {
    R(c, x, y, w, h, ['#3a2a1e', '#2a3a2e', '#3a2430', '#2a2a3a'][k % 4]);
    E(c, x + 4, y + h + 1, 5, 5, ['#1a1a1e', '#6a1a1a', '#22284a', '#3a2a1a'][k % 4]); R(c, x + 3, y + h - 4, 2, 2, '#f4f0e6');
    E(c, x + 4, y + 4, 2, 3, '#e0c09a'); R(c, x + 2, y + 1, 5, 2, ['#e8e4dc', '#4a2a1a', '#8a8a8a', '#1a1a1a'][(k + 1) % 4]);
    if (k % 3 === 1) R(c, x + 1, y, 7, 1, '#1a1a1a');
    P(c, x + 3, y + 4, '#2a1a10'); P(c, x + 5, y + 4, '#2a1a10');
  });
}
/* Altes Stadtbild (sepia oder farbig): 0 = Tor mit Turm, 1 = See mit Hügeln, 2 = Gassenzeile mit Kirchturm */
function srTownPic(c, px, py, w, h, k = 0, sep = true, fr = '#8a6a3a') {
  srFrame(c, px, py, w, h, (c, x, y, iw, ih) => {
    const sky = sep ? '#dccca4' : '#a8c8e0', d = sep ? '#6a5236' : '#7a4a32', m = sep ? '#a88c62' : '#e0c8a0', g = sep ? '#8a7450' : '#6a9a4a', wat = sep ? '#b8a47e' : '#4f8fb8';
    R(c, x, y, iw, ih, sky);
    if (k % 3 === 1) {
      for (let i = 0; i < iw; i++) R(c, x + i, y + ih - 6 - Math.round(2 + Math.sin(i * 0.4 + k) * 2), 1, 6, g);
      R(c, x, y + ih - 4, iw, 4, wat); R(c, x + 2, y + ih - 3, 3, 1, shade(wat, 0.3)); R(c, x + iw - 7, y + ih - 2, 4, 1, shade(wat, 0.3));
      R(c, x + (iw >> 1), y + ih - 5, 4, 1, d); P(c, x + (iw >> 1) + 2, y + ih - 7, d); P(c, x + (iw >> 1) + 2, y + ih - 6, d);
      return;
    }
    R(c, x, y + ih - 3, iw, 3, g);
    for (let i = 0; i < iw; i += 5) { const hh = 4 + (hash(i, k, 3) * 4 | 0); R(c, x + i, y + ih - 3 - hh, 4, hh, m); R(c, x + i, y + ih - 4 - hh, 4, 1, d); P(c, x + i + 1, y + ih - 1 - hh, d); }
    const tx = x + (iw >> 1) - 3;
    if (k % 3 === 0) { R(c, tx, y + 4, 6, ih - 7, m); R(c, tx + 5, y + 4, 1, ih - 7, d); for (let r = 0; r < 4; r++) R(c, tx + 3 - r, y + r, r * 2, 1, d); R(c, tx + 2, y + ih - 7, 2, 4, d); P(c, tx + 2, y + 6, d); }
    else { R(c, tx + 1, y + 3, 4, ih - 6, m); R(c, tx + 2, y, 2, 3, d); P(c, tx + 3, y + 5, d); }
  }, fr);
}
/* Fasnachtslarve aus Holz: k = 0 glatt, 1 mit Fellhaaren, 2 mit Hörnern */
function srLarve(c, px, py, col, k = 0) {
  const d = shade(col, -0.32);
  if (k === 1) { E(c, px + 6, py + 4, 7, 5, '#5a3a24'); for (let i = 0; i < 7; i++) line(c, px + i * 2, py + 2, px + i * 2 - 1, py - 1, '#4a2e1c'); }
  if (k === 2) { line(c, px + 2, py + 3, px - 1, py - 2, '#e8dcc0'); line(c, px + 10, py + 3, px + 13, py - 2, '#e8dcc0'); }
  E(c, px + 6, py + 8, 5, 7, d); E(c, px + 6, py + 7, 5, 6, col); E(c, px + 5, py + 5, 2, 2, shade(col, 0.25));
  R(c, px + 3, py + 6, 2, 2, '#1a1410'); R(c, px + 8, py + 6, 2, 2, '#1a1410');
  P(c, px + 6, py + 9, d); P(c, px + 6, py + 8, d); R(c, px + 4, py + 11, 5, 1, '#8a1a1a'); P(c, px + 3, py + 10, '#8a1a1a'); P(c, px + 9, py + 10, '#8a1a1a');
  P(c, px + 2, py + 9, '#e86a6a'); P(c, px + 10, py + 9, '#e86a6a');
}
/* Grende: wilde Holzmaske mit Fellmähne, Glotzaugen und Zähnen */
function srGrende(c, px, py, col = '#c8a040') {
  E(c, px + 8, py + 9, 8, 9, '#4a3020');
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; line(c, px + 8 + Math.cos(a) * 6, py + 9 + Math.sin(a) * 7, px + 8 + Math.cos(a) * 9, py + 9 + Math.sin(a) * 10, i % 2 ? '#3a2416' : '#6a4a2a'); }
  E(c, px + 8, py + 10, 5, 6, shade(col, -0.3)); E(c, px + 8, py + 9, 5, 6, col);
  E(c, px + 5, py + 7, 2, 2, '#f4f0e6'); E(c, px + 11, py + 7, 2, 2, '#f4f0e6'); P(c, px + 5, py + 7, '#1a1410'); P(c, px + 11, py + 7, '#1a1410');
  R(c, px + 7, py + 9, 3, 3, shade(col, -0.15)); R(c, px + 4, py + 13, 9, 3, '#5a1010'); for (let k = 0; k < 4; k++) R(c, px + 5 + k * 2, py + 13, 1, 2, '#f4f0e6');
  line(c, px + 3, py + 2, px, py - 3, '#e8dcc0'); line(c, px + 13, py + 2, px + 16, py - 3, '#e8dcc0');
}
/* Sonnenmaske (Emblem der Zunft) */
function srSun(c, cx, cy, r, col = '#e8b830') {
  for (let a = 0; a < 12; a++) { const an = a / 12 * 6.283; line(c, cx + Math.cos(an) * (r + 1), cy + Math.sin(an) * (r + 1), cx + Math.cos(an) * (r + 3), cy + Math.sin(an) * (r + 3), col); }
  E(c, cx, cy, r, r, shade(col, -0.25)); E(c, cx - 1, cy - 1, r - 1, r - 1, col);
  if (r >= 4) { P(c, cx - 2, cy - 1, '#5a3a10'); P(c, cx + 2, cy - 1, '#5a3a10'); R(c, cx - 1, cy + 2, 3, 1, '#5a3a10'); }
}
/* Zunftbanner an einer Querstange, unten zwei Zipfel */
function srBanner(c, px, py, a, b, h = 26, sun = true) {
  R(c, px - 2, py, 15, 2, '#5a3a24'); P(c, px - 3, py, '#c9a65a'); P(c, px + 12, py, '#c9a65a'); R(c, px + 4, py - 2, 3, 2, '#5a3a24');
  R(c, px, py + 2, 11, h - 6, a); R(c, px, py + 2, 2, h - 6, b); R(c, px + 9, py + 2, 2, h - 6, b); R(c, px, py + 2, 11, 1, shade(a, -0.3));
  for (let i = 0; i < 4; i++) { R(c, px + i, py + h - 4 + i, 4 - i, 1, a); R(c, px + 7 + i, py + h - 4 + i, 4 - i, 1, a); }
  if (sun) srSun(c, px + 5, py + 10, 2, '#f2d050');
}
/* Wappen von Sursee: gespalten von Rot und Weiss */
function srWappen(c, px, py, w = 12, h = 14) {
  for (let yy = 0; yy < h; yy++) { const ins = yy > h * 0.55 ? Math.round((yy - h * 0.55) * (w / 2) / (h * 0.45)) : 0; R(c, px - 1 + ins, py + yy, w + 2 - ins * 2, 1, '#2a2420'); }
  for (let yy = 1; yy < h - 1; yy++) { const ins = yy > h * 0.55 ? Math.round((yy - h * 0.55) * (w / 2) / (h * 0.45)) : 0; R(c, px + ins, py + yy, w / 2 - ins, 1, '#c8302a'); R(c, px + w / 2, py + yy, w / 2 - ins, 1, '#f4f2ea'); }
}
/* Doppeladler (Reichsadler) in Schwarz auf Gold */
function srAdler(c, cx, cy) {
  E(c, cx, cy + 3, 2, 4, '#1a1a1a');
  for (const s of [-1, 1]) { for (let i = 0; i < 6; i++) R(c, s > 0 ? cx + 2 + i : cx - 2 - i, cy + i * 0.7, 1, 6 - i, '#1a1a1a'); R(c, cx + s * 2 - (s < 0 ? 1 : 0), cy - 3, 2, 2, '#1a1a1a'); P(c, cx + s * 4, cy - 3, '#c8302a'); line(c, cx + s, cy + 7, cx + s * 3, cy + 9, '#1a1a1a'); }
}
function srRug(c, px, py, w, h, a, b) {
  R(c, px, py, w, h, a); R(c, px + 2, py + 2, w - 4, h - 4, b); R(c, px + 4, py + 4, w - 8, h - 8, a);
  for (let k = 6; k < w - 6; k += 6) { P(c, px + k, py + 3, a); P(c, px + k, py + h - 4, a); }
  for (let k = 1; k < h; k += 2) { P(c, px - 1, py + k, '#e8dcc0'); P(c, px + w, py + k, '#e8dcc0'); }
}
/* Flaschenregal an der Wand hinter der Bar */
function srBottleWall(c, px, py, w, rows = 2, back = '#2a1a10') {
  R(c, px, py, w, rows * 13 + 2, back); R(c, px, py, w, 1, shade(back, 0.2));
  for (let r = 0; r < rows; r++) {
    const by = py + 2 + r * 13;
    for (let k = 2; k < w - 3; k += 4) {
      const col = ['#2f7a3a', '#a8401e', '#d8b040', '#4a2a6a', '#e0e0e0', '#7a3a1a', '#3a6ab0', '#c8c0a0'][(hash(px + k, r, 7) * 8) | 0];
      const hh = 5 + (hash(k, r, px) * 4 | 0);
      R(c, px + k, by + 10 - hh, 3, hh, col); R(c, px + k + 1, by + 8 - hh, 1, 2, shade(col, -0.2)); P(c, px + k, by + 11 - hh, 'rgba(255,255,255,0.55)');
    }
    R(c, px, by + 10, w, 2, '#7a5232'); R(c, px, by + 10, w, 1, '#a07450');
  }
}
function srPoster(c, px, py, w, h, bg, fg, txt, k = 0) {
  R(c, px, py, w, h, bg); R(c, px, py, w, 1, shade(bg, 0.3));
  if (k % 3 === 0) { E(c, px + w / 2, py + h * 0.42, w * 0.3, h * 0.2, shade(bg, -0.4)); R(c, px + w / 2 - 1, py + h * 0.2, 2, h * 0.4, fg); }
  else if (k % 3 === 1) { for (let i = 0; i < 4; i++) R(c, px + 2 + i * (w - 4) / 4, py + h * 0.5 - i * 2, (w - 4) / 4 - 1, i * 2 + 3, fg); }
  else { line(c, px + 2, py + h - 8, px + w / 2, py + 3, fg); line(c, px + w / 2, py + 3, px + w - 2, py + h - 8, fg); }
  if (txt) pxText(c, txt, px + Math.max(1, (w - pxTextW(txt)) >> 1), py + h - 6, fg);
  P(c, px + 1, py + 1, '#c9ccd2'); P(c, px + w - 2, py + 1, '#c9ccd2');
}
function srGuitar(c, px, py, col, k = 0) {
  R(c, px + 1, py - 1, 6, 1, '#8a8e94');
  R(c, px + 3, py, 2, 3, '#2a2a2a'); R(c, px + 3, py + 3, 2, 9, '#5a3a22'); for (let j = 4; j < 12; j += 2) P(c, px + 3, py + j, '#c9ccd2');
  if (k) { R(c, px + 1, py + 12, 6, 8, col); R(c, px, py + 13, 1, 5, col); R(c, px + 7, py + 15, 2, 4, col); }
  else { E(c, px + 4, py + 16, 4, 4, col); E(c, px + 4, py + 12, 3, 2, col); E(c, px + 4, py + 15, 1, 1, '#1a1a1a'); }
  R(c, px + 2, py + 18, 5, 1, '#e8e4dc');
}
/* Leuchtschrift mit Schein (statisch; Flackern über srNeonObj) */
function srNeon(c, txt, px, py, col, s = 1) {
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) pxText(c, txt, px + dx, py + dy, rgba(col, 0.32), s);
  pxText(c, txt, px, py, col, s); pxText(c, txt, px, py + s, shade(col, -0.2), s); pxText(c, txt, px, py, shade(col, 0.45), s);
}
/* Tafel mit Kreideschrift */
function srChalk(c, px, py, w, h, lines, title) {
  R(c, px, py, w, h, '#6a4a2a'); R(c, px + 1, py + 1, w - 2, h - 2, '#26302a');
  let y = py + 3;
  if (title) { pxText(c, title, px + 3, y, '#f4e8a0'); y += 7; }
  for (let k = 0; k < lines && y < py + h - 4; k++, y += 4) { R(c, px + 3, y, 6 + (hash(px, k, 3) * (w - 16) | 0), 1, '#e9efe6'); R(c, px + w - 9, y, 5, 1, '#f4c8a0'); }
}
function srGothWin(c, px, py, w = 14, h = 26) {
  R(c, px - 2, py - 1, w + 4, h + 3, '#b8ac94'); R(c, px - 2, py + h + 1, w + 4, 2, '#8a7e68');
  R(c, px, py + 4, w, h - 4, '#9ec2d8'); for (let r = 0; r < 4; r++) R(c, px + Math.max(0, 3 - r * 1.5), py + r, w - 2 * Math.max(0, 3 - r * 1.5), 1, '#9ec2d8');
  for (let yy = 5; yy < h; yy += 4) for (let xx = 2; xx < w - 1; xx += 4) { E(c, px + xx, py + yy, 1, 1, '#c8e0ec'); P(c, px + xx, py + yy, '#7aa2bc'); }
  R(c, px + w / 2 - 0.5, py + 2, 1, h - 2, '#6a5e48'); R(c, px, py + h / 2, w, 1, '#6a5e48');
}
/* Kinderzeichnung an der Wand */
function srDrawing(c, px, py, k) {
  const bg = ['#f8f4e8', '#fff8d0', '#e8f4ff'][k % 3];
  R(c, px, py, 12, 10, bg); R(c, px + 5, py - 1, 2, 2, ['#e8402e', '#3a8ae0', '#f2c23a'][k % 3]);
  if (k % 3 === 0) { R(c, px + 2, py + 5, 6, 4, '#e8402e'); for (let i = 0; i < 4; i++) R(c, px + 2 + i, py + 4 - i, 6 - i * 2, 1, '#3a6ab0'); E(c, px + 10, py + 2, 1, 1, '#f2c23a'); }
  else if (k % 3 === 1) { E(c, px + 6, py + 4, 2, 2, '#f2c23a'); line(c, px + 6, py + 6, px + 6, py + 8, '#1a1a1a'); line(c, px + 4, py + 7, px + 8, py + 7, '#1a1a1a'); R(c, px + 1, py + 9, 10, 1, '#3fae4a'); }
  else { for (let i = 0; i < 5; i++) R(c, px + 1 + i * 2, py + 2 + i, 2, 6 - i, ['#e8402e', '#f2c23a', '#3fae4a', '#3a8ae0', '#9a5ae0'][i]); }
}

/* ---------- Helfer: Möbel und Objekte ---------- */
/* Objekt um 'extra' Pixel nach oben erweitern und Dekor (deco) darauf malen, z. B. Flaschen auf einem Tisch */
function srWrap(o, extra, deco) {
  const p = o.paint, e = o.emit;
  o.drawH += extra;
  o.paint = (c, W, H, ob) => { c.save(); c.translate(0, extra); p(c, W, H - extra, ob); c.restore(); deco(c, W, H, extra); };
  if (e) o.emit = (c, W, H, ob) => { c.save(); c.translate(0, extra); e(c, W, H - extra, ob); c.restore(); };
  return o;
}
/* Sitzbank (begehbar, man kann darauf sitzen) */
function srBench(x, y, w, col = '#7a4a28', back = false) {
  return mkObj(x, y, w, 1, back ? 12 : 4, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.2)');
    if (back) { R(c, 1, H - 22, W - 2, 3, shade(col, -0.1)); R(c, 1, H - 22, W - 2, 1, shade(col, 0.2)); for (let k = 4; k < W - 2; k += 12) R(c, k, H - 19, 2, 8, shade(col, -0.25)); }
    R(c, 1, H - 12, W - 2, 4, col); R(c, 1, H - 12, W - 2, 1, shade(col, 0.25)); R(c, 1, H - 8, W - 2, 2, shade(col, -0.3));
    for (let k = 3; k < W; k += 16) { R(c, k, H - 6, 2, 5, shade(col, -0.45)); R(c, W - 1 - k - 2, H - 6, 2, 5, shade(col, -0.45)); }
  }, { solid: false });
}
/* Glasvitrine auf Holzsockel; inner(c, x, y, w, h) zeichnet den Inhalt */
function srVitrine(x, y, w, h, inner, o = {}) {
  return mkObj(x, y, w, h, o.dh ?? 14, (c, W, H) => {
    const base = o.base || '#5a3a24', bg = o.bg || '#3a1a26';
    E(c, W / 2, H - 2, W / 2 - 1, 2, 'rgba(0,0,0,0.22)');
    R(c, 1, H - 9, W - 2, 8, base); R(c, 1, H - 9, W - 2, 1, shade(base, 0.3)); R(c, 1, H - 2, W - 2, 1, shade(base, -0.35));
    if (o.label) { R(c, W / 2 - 5, H - 7, 10, 3, '#c9a65a'); R(c, W / 2 - 4, H - 6, 8, 1, '#6a5020'); }
    const gy = 2, gh = H - 11;
    R(c, 2, gy, W - 4, gh, bg); R(c, 2, gy + gh - 4, W - 4, 4, shade(bg, 0.18));
    if (inner) { c.save(); c.beginPath(); c.rect(3, gy + 1, W - 6, gh - 1); c.clip(); inner(c, 3, gy + 1, W - 6, gh - 2); c.restore(); }
    c.fillStyle = 'rgba(200,230,245,0.16)'; c.fillRect(2, gy, W - 4, gh);
    R(c, 1, gy - 1, W - 2, 1, '#c9a65a'); R(c, 1, gy, 1, gh, '#c9a65a'); R(c, W - 2, gy, 1, gh, '#c9a65a'); R(c, 2, gy + gh - 5, W - 4, 1, 'rgba(255,255,255,0.25)');
    for (let k = 0; k < 2; k++) line(c, 4 + k * 4, gy + gh - 7, 8 + k * 4, gy + 2, 'rgba(255,255,255,0.35)');
  }, { solid: true });
}
/* Hakenleiste mit roten Mänteln; gap = leerer Haken */
function srCloaks(x, y, w, gap = -1, col = '#b02a2a') {
  return mkObj(x, y, w, 1, 18, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.2)');
    R(c, 1, 0, W - 2, 3, '#6a4428'); R(c, 1, 0, W - 2, 1, '#8a5a34');
    const n = Math.floor((W - 4) / 7);
    for (let k = 0; k < n; k++) {
      const hx = 3 + k * 7;
      R(c, hx + 2, 3, 1, 2, '#c9a65a');
      if (k === gap) { P(c, hx + 3, 5, '#c9a65a'); continue; }
      R(c, hx, 5, 6, H - 9, col); R(c, hx, 5, 1, H - 9, shade(col, -0.3)); R(c, hx + 5, 5, 1, H - 9, shade(col, -0.25)); R(c, hx + 1, 5, 4, 2, shade(col, 0.2));
      R(c, hx, H - 5, 6, 1, '#e8c84a'); R(c, hx - 1, H - 4, 8, 1, shade(col, -0.35));
    }
  }, { solid: true });
}
/* Fahne an Querstange (Gonfanon) auf Ständer; cloth(c, x, y, w, h) malt das Tuch */
function srFlagStand(x, y, cloth) {
  return mkObj(x, y, 1, 1, 30, (c, W, H) => {
    E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 4, H - 5, 8, 3, '#3a2a1a'); R(c, 7, 2, 2, H - 6, '#8a6a3a'); E(c, 8, 1, 2, 2, '#e8c23a');
    R(c, 1, 5, 14, 1, '#5a3a24');
    cloth(c, 2, 6, 12, 18);
    for (let i = 0; i < 3; i++) { R(c, 2 + i, 24 + i, 3 - i, 1, 'rgba(0,0,0,0)'); }
    R(c, 2, 6, 1, 18, 'rgba(0,0,0,0.2)');
  });
}
const SR_CLOTH = {
  sursee: (c, x, y, w, h) => { R(c, x, y, w / 2, h, '#c8302a'); R(c, x + w / 2, y, w / 2, h, '#f4f2ea'); },
  ch: (c, x, y, w, h) => { R(c, x, y, w, h, '#d8302a'); R(c, x + w / 2 - 1, y + 4, 2, 9, '#ffffff'); R(c, x + w / 2 - 4, y + 7, 8, 3, '#ffffff'); },
  lu: (c, x, y, w, h) => { R(c, x, y, w / 2, h, '#2f6fc0'); R(c, x + w / 2, y, w / 2, h, '#f4f2ea'); },
  zunft: (c, x, y, w, h) => { R(c, x, y, w, h, '#c8302a'); R(c, x, y + h - 3, w, 3, '#e8c23a'); srSun(c, x + w / 2, y + 7, 3, '#f2d050'); },
};
function srChest(x, y, col = '#6a4426') {
  return mkObj(x, y, 2, 1, 8, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.25)');
    R(c, 2, 5, W - 4, H - 7, col); R(c, 2, 2, W - 4, 6, shade(col, 0.15)); R(c, 2, 2, W - 4, 1, shade(col, 0.35)); R(c, 2, 8, W - 4, 1, shade(col, -0.45));
    for (const bx of [4, W - 6]) { R(c, bx, 2, 2, H - 4, '#3a3a3e'); P(c, bx, 4, '#8a8e94'); P(c, bx, 14, '#8a8e94'); }
    for (let k = 9; k < W - 10; k += 5) { const d = shade(col, -0.35); P(c, k, 14, d); P(c, k + 1, 13, d); P(c, k + 1, 15, d); P(c, k + 2, 14, d); P(c, k + 1, 14, shade(col, 0.3)); }
    R(c, W / 2 - 2, 9, 4, 4, '#c9a65a'); P(c, W / 2 - 1, 11, '#2a2a2a');
  });
}
/* Grosse Fasnachtspauke der Guggenmusik */
function srDrum(x, y) {
  return mkObj(x, y, 1, 1, 10, (c, W, H) => {
    E(c, 8, H - 2, 6, 2, 'rgba(0,0,0,0.25)');
    R(c, 2, H - 17, 12, 14, '#c8302a'); for (let k = 0; k < 12; k += 4) { line(c, 2 + k, H - 16, 2 + k + 4, H - 5, '#e8c23a'); line(c, 2 + k + 4, H - 16, 2 + k, H - 5, '#e8c23a'); }
    R(c, 2, H - 18, 12, 2, '#e8dcc0'); E(c, 8, H - 19, 6, 2, '#f4ecd8'); R(c, 2, H - 5, 12, 2, '#e8dcc0');
    line(c, 3, H - 25, 8, H - 20, '#8a5a34'); E(c, 3, H - 25, 1, 1, '#f4f0e6'); line(c, 13, H - 25, 9, H - 20, '#8a5a34'); E(c, 13, H - 25, 1, 1, '#f4f0e6');
  });
}
/* Lampen und Leuchter hängen über den Figuren: Zeichnung im Overlay */
function srOver(m, fn, post = false) { const k = post ? 'postOverlay' : 'overlay', prev = m[k]; m[k] = prev ? (c, cx, cy, t) => { prev(c, cx, cy, t); fn(c, cx, cy, t); } : fn; }
function srPendants(m, pts, col = '#2a2c30', glow = '#ffd78a', kind = 0) {
  for (const [x, y] of pts) m.light(x * 16 + 8, y * 16 - 4, 42, glow);
  srOver(m, (c, cx, cy) => {
    for (const [x, y] of pts) {
      const px = Math.round(x * 16 + 8 - cx), py = Math.round(y * 16 - 24 - cy);
      R(c, px, py - 16, 1, 16, '#1a1a1a');
      if (kind === 1) { R(c, px - 2, py, 5, 2, col); E(c, px, py + 5, 3, 3, rgba(glow, 0.9)); E(c, px, py + 5, 1, 2, '#fff6d8'); }
      else if (kind === 2) { R(c, px - 3, py, 7, 6, '#c8302a'); R(c, px - 4, py + 1, 9, 4, '#e84a3a'); R(c, px - 1, py + 6, 3, 1, '#fff2c0'); }
      else { R(c, px - 3, py, 7, 2, col); R(c, px - 5, py + 2, 11, 3, col); R(c, px - 5, py + 2, 11, 1, shade(col, 0.3)); R(c, px - 3, py + 5, 7, 1, '#fff2c0'); }
    }
  });
}
function srChandelier(m, x, y) {
  m.light(x, y + 12, 64, '#ffc870');
  srOver(m, (c, cx, cy, t) => {
    const px = x - cx, py = y - cy;
    R(c, px, py - 34, 1, 30, '#1a1a1a');
    for (let a = 0; a < 6.283; a += 0.08) { P(c, px + Math.cos(a) * 13, py + Math.sin(a) * 3.5, '#2a2420'); P(c, px + Math.cos(a) * 13, py + 1 + Math.sin(a) * 3.5, '#4a3a2a'); }
    for (let k = 0; k < 4; k++) line(c, px, py - 6, px + Math.cos(k * 1.571 + 0.4) * 13, py + Math.sin(k * 1.571 + 0.4) * 3.5, '#2a2420');
    for (let k = 0; k < 8; k++) {
      const a = k / 8 * 6.283, kx = Math.round(px + Math.cos(a) * 13), ky = Math.round(py + Math.sin(a) * 3.5);
      R(c, kx - 1, ky - 4, 2, 4, '#f4ecd8'); const f = Math.sin(t * 11 + k * 1.7) > 0.3 ? 1 : 0;
      P(c, kx, ky - 5 - f, '#ffd060'); P(c, kx, ky - 6 - f, '#fff0b0'); P(c, kx - 1, ky - 5, 'rgba(255,190,80,0.6)');
    }
  });
}
/* Glitzernde Spur mit Auslöser (Hinweise in der Zunftstube) */
function srClue(m, x, y, id) {
  glitter(m, x, y, () => Sur.clueOpen(id));
  m.trig(x, y, 1, 1, { label: 'Etwas glitzert …', act: () => Sur.clue(id), cond: () => Sur.clueOpen(id) });
}
function srNpc(m, id, name, tx, ty, dir, seed, look, talk, bubble = ['dots'], extra = {}) {
  m.npcDefs.push(Object.assign({ id, name, x: tx * 16 + 8, y: ty * 16 + 12, dir, look: npcLook(seed, look), talk, keepDir: true, bubbleRand: bubble }, extra));
}
/* Tisch mit Stühlen links/rechts (Stühle zeigen zum Tisch) */
function srTableLR(m, x, y, w, o, ccol) { m.add(objTable(x, y, w, 1, o)); m.add(objChair(x - 1, y, 2, ccol)); m.add(objChair(x + w, y, 1, ccol)); }
/* Tisch mit Stühlen oben/unten */
function srTableTB(m, x, y, w, h, o, ccol, top = true, bottom = true) {
  m.add(objTable(x, y, w, h, o));
  for (let k = 0; k < w; k++) { if (top) m.add(objChair(x + k, y - 1, 3, ccol)); if (bottom) m.add(objChair(x + k, y + h, 0, ccol)); }
}
/* Pizzaofen-/Kaminglut: flackernde Glutpunkte in einem Rechteck */
function srEmbers(c, t, x, y, w, h, seed = 0) {
  for (let k = 0; k < 10; k++) {
    const f = Math.sin(t * (5 + hash(k, seed) * 6) + k * 2.1) * 0.5 + 0.5;
    P(c, x + (hash(k, seed, 1) * w | 0), y + h - 1 - (hash(k, seed, 2) * h * 0.6 | 0) - (f > 0.7 ? 1 : 0), f > 0.66 ? '#fff0a0' : f > 0.33 ? '#ffb030' : '#e8501a');
  }
  for (let k = 0; k < 3; k++) { const ph = (t * 1.6 + k / 3) % 1; P(c, x + w / 2 - 2 + k * 2 + Math.sin(t * 4 + k) * 1, y + h * 0.4 - ph * h * 0.6, rgba('#ffd060', 1 - ph)); }
}
/* Terracotta-Fliesen als Bodenbelag (Decal) */
function srTerracotta(m, x0, y0, w, h, base = '#b8603a') {
  m.decal((c) => {
    for (let ty = y0; ty < y0 + h; ty++) for (let tx = x0; tx < x0 + w; tx++) for (let q = 0; q < 4; q++) {
      const px = tx * 16 + (q % 2) * 8, py = ty * 16 + (q >> 1) * 8, col = shade(base, (hash(tx * 2 + (q % 2), ty * 2 + (q >> 1), 5) - 0.5) * 0.18);
      R(c, px, py, 8, 8, shade(base, -0.28)); R(c, px + 1, py + 1, 7, 7, col); P(c, px + 2, py + 2, shade(col, 0.15));
    }
    if (y0 === 3) R(c, x0 * 16, 48, w * 16, 3, 'rgba(0,0,0,0.16)');
  });
}
/* Bierglas, Weinflasche, Kerze als Tischdeko (für srWrap) */
function srGlass(c, x, y, col = '#e8b33a') { R(c, x, y, 3, 5, col); R(c, x, y - 1, 3, 1, '#ffffff'); P(c, x + 2, y + 1, 'rgba(255,255,255,0.6)'); }
function srChianti(c, x, y) { E(c, x + 2, y + 6, 3, 3, '#c8a050'); for (let k = -2; k <= 2; k += 2) line(c, x + 2 + k, y + 3, x + 2 + k, y + 9, '#9a7030'); R(c, x + 1, y - 2, 3, 5, '#2a5a2a'); R(c, x + 1, y - 3, 3, 1, '#8a1a1a'); P(c, x + 1, y, 'rgba(255,255,255,0.5)'); }
function srCandle(c, x, y) { R(c, x, y, 2, 4, '#f4ecd8'); P(c, x, y - 1, '#ffb030'); P(c, x + 1, y - 2, '#fff0b0'); }

/* =================================================================== */
/* 1. Zunftstube der Zunft Heini von Uri: erster Stock des angebauten oberen Waschhauses beim Diebenturm,
   Fenster mit Blick auf den Turm (1681 als Gefängnis- und Pulverturm gebaut) */
sRoom('zunftstube', { name: 'Zunftstube · Waschhaus beim Diebenturm', sign: false, w: 18, h: 12, door: 8, back: ['sursee', 'zunftstube_out'], style: 6, cap: '#4a4038', floor: T.STONE, floorV: 1, music: 'stube', ambient: 0.18, lightC: '#ffcf80',
  spots: { heinivater: [12, 6, 1], elin: [6, 8, 3], timo: [7, 8, 3], friend: [3, 7, 2] },
  wall: (c) => {
    /* Jubiläumsfoto 1876–2026 */
    srFrame(c, 18, 17, 44, 20, (c, x, y, w, h) => {
      R(c, x, y, w, h, '#cdb88e'); R(c, x, y + h - 5, w, 5, '#a8946a');
      for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) { const hx = x + 3 + k * 4 + (r % 2) * 2, hy = y + 3 + r * 4; E(c, hx, hy, 1, 1, '#6a5236'); R(c, hx - 1, hy + 2, 3, 3, r === 2 ? '#5a4028' : '#7a6040'); }
      R(c, x + 15, y + 1, 10, 2, '#6a5236');
    });
    R(c, 20, 39, 40, 8, '#8a6a3a'); R(c, 21, 40, 38, 6, '#c9a65a'); pxText(c, '1876-2026', 23, 40, '#4a3410');
    /* Wo die Sonnenmaske hing: Bildlampe, verblasster Umriss */
    R(c, 72, 17, 16, 2, '#3a3a3e'); R(c, 76, 19, 8, 3, '#c9a65a'); srSun(c, 80, 27, 3, '#b8a888');
    srBanner(c, 99, 18, '#c8302a', '#e8c23a', 27);
    /* Zunftschild und Larven */
    R(c, 113, 16, 80, 11, '#5a3a20'); R(c, 114, 17, 78, 9, '#7a5232'); R(c, 114, 17, 78, 1, '#9a7048'); pxText(c, 'ZUNFT HEINI VON URI', 116, 19, '#f2d050');
    for (let k = 0; k < 5; k++) srLarve(c, 116 + k * 15, 30, ['#e8c890', '#d8402a', '#f4ecd8', '#3a8a4a', '#e8b830'][k], [0, 2, 0, 1, 0][k]);
    srGrende(c, 196, 14, '#b88a40');
    /* Sprossenfenster mit Blick auf den Diebenturm */
    R(c, 227, 17, 28, 29, '#8a8070'); R(c, 229, 19, 24, 25, '#9ec8e8'); R(c, 229, 38, 24, 6, '#c8bca0');
    R(c, 236, 25, 11, 19, '#b8ac94'); for (let y = 27; y < 44; y += 3) R(c, 236, y, 11, 1, '#a89c84'); R(c, 245, 25, 2, 19, '#9a8e76');
    for (let r = 0; r < 6; r++) R(c, 241 - r, 19 + r, 1 + r * 2, 1, '#8a3a2a'); P(c, 241, 18, '#2a2420'); R(c, 239, 30, 2, 3, '#3a3020'); R(c, 239, 37, 2, 3, '#3a3020');
    R(c, 229, 30, 24, 1, '#e8e4dc'); R(c, 240, 19, 1, 25, '#e8e4dc'); R(c, 225, 45, 32, 2, '#a89e8a');
  },
  build: (m) => {
    m.decal((c) => {
      srRug(c, 4 * 16 + 6, 5 * 16 + 4, 9 * 16 - 4, 4 * 16 - 2, '#6a1e1e', '#8a2a24');
      c.fillStyle = 'rgba(255,240,200,0.12)'; c.beginPath(); c.moveTo(229, 48); c.lineTo(253, 48); c.lineTo(262, 84); c.lineTo(222, 84); c.closePath(); c.fill();
    });
    m.add(srDrum(1, 5));
    /* Guggenmusik: Sousaphon und Trompete auf einem Ständer, Fass mit Zunftwein */
    m.add(mkObj(2, 5, 1, 1, 14, (c, W, H) => { E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 7, 8, 2, H - 10, '#3a3a3e'); R(c, 4, H - 3, 8, 2, '#3a3a3e'); for (let a = 0; a < 6.28; a += 0.25) P(c, 8 + Math.cos(a) * 6, 10 + Math.sin(a) * 6, '#e8c23a'); E(c, 12, 4, 4, 4, '#e8c23a'); E(c, 12, 4, 2, 2, '#8a6a1a'); R(c, 2, 14, 6, 2, '#d8b030'); E(c, 2, 15, 1, 2, '#e8c23a'); }));
    m.add(mkObj(15, 6, 1, 1, 10, (c, W, H) => { E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.25)'); R(c, 2, H - 6, 2, 5, '#4a3020'); R(c, 12, H - 6, 2, 5, '#4a3020'); E(c, 8, H - 13, 7, 8, '#7a4a28'); E(c, 8, H - 13, 5, 6, '#9a6038'); E(c, 8, H - 13, 1, 1, '#3a2a1a'); for (const dy of [-6, 6]) R(c, 1, H - 13 + dy, 14, 1, '#3a3a3e'); R(c, 7, H - 7, 2, 3, '#c9a65a'); pxText(c, 'Z', 7, H - 22, '#e8c23a'); }));
    m.add(srVitrine(4, 3, 2, 1, (c, x, y, w, h) => { E(c, x + w / 2, y + h - 3, 10, 3, '#7a1a2a'); E(c, x + w / 2, y + h - 4, 8, 2, '#9a2a3a'); for (let a = 0; a < 6.28; a += 0.5) P(c, x + w / 2 + Math.cos(a) * 5, y + h - 4 + Math.sin(a) * 1.5, '#c8a8a0'); }, { dh: 16, label: true }));
    m.trig(4, 3, 2, 1, { label: 'Leere Vitrine', act: () => Sur.look('vitrine') });
    m.add(srCloaks(12, 3, 2));
    m.add(srFlagStand(16, 3, SR_CLOTH.zunft));
    /* Larvenschnitzbank mit halbfertiger Larve */
    m.add(mkObj(1, 8, 2, 1, 8, (c, W, H) => {
      E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.22)');
      R(c, 1, 6, W - 2, 6, '#9a7048'); R(c, 1, 6, W - 2, 1, '#b88a5a'); R(c, 2, 12, 2, H - 13, '#5a3a24'); R(c, W - 4, 12, 2, H - 13, '#5a3a24'); R(c, 2, H - 6, W - 4, 1, '#5a3a24');
      E(c, 10, 7, 5, 4, '#d8b888'); E(c, 10, 7, 3, 3, '#e8c898'); P(c, 8, 6, '#3a2a1a'); P(c, 12, 6, '#3a2a1a');
      for (let k = 0; k < 4; k++) { R(c, 19 + k * 3, 4, 1, 4, '#9aa0a6'); R(c, 19 + k * 3, 8, 1, 3, '#6a4428'); }
      for (let k = 0; k < 6; k++) P(c, 4 + k * 4, 13 + (k % 2), '#e8d0a0');
    }));
    /* Langer Eichentisch mit Bänken, Zunftmeisterstuhl am Kopfende */
    m.add(srBench(5, 5, 7, '#6a4426'));
    m.add(srWrap(objTable(5, 6, 7, 2, { col: '#7a5230' }), 6, (c, W, H, e) => {
      for (const gx of [14, 30, 62, 86]) srGlass(c, gx, e + 6, '#d8a030');
      srCandle(c, 48, e + 4); srCandle(c, 52, e + 4); R(c, 44, e + 8, 12, 2, '#3a2a1a');
      R(c, 70, e + 12, 10, 7, '#f4ecd8'); R(c, 71, e + 13, 8, 1, '#8a8e94'); R(c, 71, e + 15, 6, 1, '#8a8e94'); R(c, 18, e + 16, 8, 6, '#5a1a1a'); R(c, 19, e + 17, 6, 1, '#e8c23a');
    }));
    m.add(srBench(5, 8, 7, '#6a4426'));
    m.add(objChair(12, 6, 1, '#4a2a18'));
    m.add(objChair(4, 7, 2, '#6a4426'));
    m.add(srChest(13, 9));
    srChandelier(m, 8 * 16 + 8, 6 * 16 - 8);
    m.light(15 * 16 + 8, 4 * 16, 34, '#e8f0ff');
    /* Drei Spuren: Feder unterm Fenster, Jeton unter der Bank, nasser Quittungsfetzen bei der Truhe */
    srClue(m, 15, 3, 'feder');
    srClue(m, 10, 8, 'jeton');
    srClue(m, 15, 9, 'quittung');
  } });

/* 2. Rathaus Sursee (spätgotisch, 1539–1546): Eingangshalle unten, Ratssaal oben */
sRoom('rathaus', { name: 'Rathaus Sursee', sign: false, w: 20, h: 14, door: 9, back: ['sursee', 'rathaus_out'], style: 2, cap: '#3e2a1a', floor: T.STONE, floorV: 2,
  spots: { heinivater: [16, 4, 1], isa: [7, 6, 3], lexx: [9, 6, 3], pfister: [5, 3, 0] },
  wall: (c) => {
    /* Kassettendecke angedeutet */
    for (let k = 1; k < 19; k++) { R(c, k * 16 + 1, 2, 14, 11, '#2a1a10'); R(c, k * 16 + 3, 4, 10, 7, '#5a3a22'); R(c, k * 16 + 5, 6, 6, 3, '#6a4628'); P(c, k * 16 + 8, 7, '#e8c23a'); }
    srGothWin(c, 2 * 16 + 1, 18); srGothWin(c, 16 * 16 + 1, 18);
    for (const [px, k] of [[56, 0], [72, 1], [96, 2], [208, 3], [232, 0], [248, 2]]) srPortrait(c, px, 22, k);
    /* Wappenpyramide: Reichsschild mit Doppeladler, darunter zweimal Sursee */
    R(c, 136, 16, 48, 31, '#4a3018'); R(c, 137, 17, 46, 29, '#6a4628');
    srFrame(c, 153, 17, 14, 13, (c, x, y, w, h) => { R(c, x, y, w, h, '#e8c23a'); srAdler(c, x + w / 2, y + 4); }, '#9a7a3a');
    srWappen(c, 141, 31, 12, 14); srWappen(c, 167, 31, 12, 14);
    R(c, 120, 18, 2, 26, '#e8c23a'); R(c, 198, 18, 2, 26, '#e8c23a');
  },
  build: (m) => {
    /* Ratssaal: Holzboden; Trennwand mit gotischem Portal zur Halle */
    m.fill(1, 3, 18, 5, T.WOOD, 3);
    m.fill(1, 8, 18, 1, T.WALL); m.fill(1, 9, 18, 1, T.WALLF, 6);
    m.fill(9, 8, 2, 2, T.STONE, 2);
    m.decal((c) => {
      R(c, 16, 160, 18 * 16, 3, 'rgba(0,0,0,0.16)');
      R(c, 9 * 16 - 4, 8 * 16, 4, 32, '#b8ac94'); R(c, 11 * 16, 8 * 16, 4, 32, '#b8ac94'); R(c, 9 * 16 - 4, 8 * 16 - 2, 40, 4, '#b8ac94'); for (let i = 0; i < 6; i++) R(c, 9 * 16 + 8 + i, 8 * 16 - 6 + i * 0.6, 16 - i * 2, 1, '#a89c84');
      R(c, 2 * 16, 9 * 16 + 2, 40, 12, '#7a5a3a'); R(c, 2 * 16 + 1, 9 * 16 + 3, 38, 10, '#c8b890'); for (let k = 0; k < 5; k++) R(c, 2 * 16 + 3 + k * 7, 9 * 16 + 4 + (k % 2), 5, 7, ['#f4f0e6', '#e8e0c8', '#f8f4e8', '#fff4c0', '#f4f0e6'][k]);
      R(c, 5 * 16 + 4, 9 * 16 + 4, 44, 9, '#a89c84'); pxText(c, 'ERBAUT 1539-1546', 5 * 16 + 6, 9 * 16 + 6, '#3a3020');
      R(c, 12 * 16 + 2, 9 * 16 + 2, 28, 12, '#6a5a44'); R(c, 12 * 16 + 4, 9 * 16 + 4, 24, 8, '#9ec2d8'); R(c, 12 * 16 + 4, 9 * 16 + 9, 24, 3, '#8a7a5a'); R(c, 12 * 16 + 15, 9 * 16 + 4, 2, 8, '#6a5a44');
      srRug(c, 3 * 16 + 4, 3 * 16 + 6, 14 * 16 - 8, 4 * 16 - 8, '#5a2020', '#7a2a24');
      srRug(c, 9 * 16 + 2, 10 * 16 + 2, 28, 44, '#7a2a24', '#5a2020');
    });
    /* Langer Ratstisch mit Akten, Glocke, Karaffe */
    m.add(srWrap(objTable(4, 4, 12, 2, { col: '#5a3a20' }), 6, (c, W, H, e) => {
      for (let k = 0; k < 5; k++) { const px = 22 + k * 32; R(c, px, e + 6, 9, 7, '#f4ecd8'); R(c, px + 1, e + 7, 7, 1, '#8a8e94'); R(c, px + 1, e + 9, 5, 1, '#8a8e94'); R(c, px + 10, e + 8, 1, 4, '#2a2a2e'); }
      for (let k = 0; k < 5; k++) { const px = 22 + k * 32; R(c, px + 4, e + 18, 9, 6, '#e8e0d0'); R(c, px + 5, e + 19, 7, 1, '#8a8e94'); }
      R(c, 95, e + 10, 4, 6, '#c8e0ec'); R(c, 96, e + 9, 2, 1, '#e8f4fa'); E(c, 186, e + 12, 3, 2, '#c9a65a'); R(c, 185, e + 8, 2, 3, '#8a6a2a');
    }));
    for (const x of [5, 7, 9, 11, 13]) { m.add(objChair(x, 3, 3, '#4a2a18')); m.add(objChair(x, 6, 0, '#4a2a18')); }
    m.add(objChair(3, 4, 2, '#4a2a18')); m.add(objChair(16, 4, 1, '#3a1a10'));
    m.trig(4, 4, 12, 2, { label: 'Ratssaal', act: () => Sur.look('ratssaal') });
    m.add(srFlagStand(18, 3, SR_CLOTH.sursee)); m.add(srFlagStand(1, 3, SR_CLOTH.lu));
    /* Eingangshalle: Stadtschreiber am Pult, Wartebank, Stadtmodell, Fahnen */
    m.add(objCounter(14, 11, 3, 1, { top: '#5a3a20', front: '#3a2414', reg: false }));
    m.add(srWrap(mkObj(14, 11, 3, 1, 0, () => {}, { solid: false, sortOff: -2 }), 10, (c, W) => { R(c, 30, 0, 12, 8, '#2a2c30'); R(c, 31, 1, 10, 6, '#4a7ab0'); R(c, 35, 8, 2, 2, '#2a2c30'); R(c, 6, 4, 10, 6, '#f4ecd8'); R(c, 7, 5, 8, 1, '#8a8e94'); R(c, 18, 6, 3, 4, '#2a2a2e'); }));
    srNpc(m, 'stadtschreiber', 'Stadtschreiber Huber', 15, 10, 0, 2101, { hair: 12, hairCol: 9, beard: 2, beardCol: 9, glasses: 7, top: 9, topCol: 15, pants: 5, pantsCol: 3, hat: 0, build: 1 }, () => Sur.talk('stadtschreiber'), ['dots', '!']);
    m.trig(14, 11, 3, 1, { label: 'Reden: Stadtschreiber Huber', act: () => Sur.talk('stadtschreiber') });
    m.add(objBench(1, 11, 0, '#6a4428'));
    m.add(srVitrine(4, 11, 3, 1, (c, x, y, w, h) => {
      R(c, x, y + h - 6, w, 6, '#7aa05a'); R(c, x, y + h - 3, w, 3, '#4f8fb8');
      for (let k = 0; k < 9; k++) { const hx = x + 3 + k * 4; R(c, hx, y + h - 9 - (k % 3), 3, 4 + (k % 3), ['#e8d8b8', '#d8b8a0', '#f0e0c0'][k % 3]); R(c, hx, y + h - 10 - (k % 3), 3, 1, '#9a3a2a'); }
      R(c, x + 18, y + 2, 4, 9, '#d8c8a8'); R(c, x + 19, y, 2, 2, '#6a5a4a');
    }, { bg: '#2a2a30', base: '#4a3020', label: true }));
    m.add(srFlagStand(12, 10, SR_CLOTH.ch));
    m.add(objPlant(18, 10)); m.add(objPlant(1, 10));
    srChandelier(m, 10 * 16, 5 * 16 - 4);
    m.light(10 * 16, 11 * 16, 50, '#ffe0a0');
  } });

/* 3. Wirtshaus Wilder Mann (seit 1495, beim Untertor) */
sRoom('wildermann', { name: 'Wilder Mann', w: 20, h: 13, door: 9, back: ['sursee', 'wildermann_out'], style: 8, cap: '#2e2014', floor: T.WOOD, floorV: 0, signCol: '#f2d070', music: 'stube', ambient: 0.14, lightC: '#ffc070',
  spots: { friend1: [2, 7, 0], friend2: [5, 9, 1], friend3: [1, 8, 2], isa: [15, 7, 0] },
  wall: (c) => {
    pxText(c, 'SEIT 1495', 20, 28, '#c8a860');
    srTownPic(c, 6 * 16 + 1, 18, 15, 13, 0); srTownPic(c, 7 * 16 + 1, 20, 14, 11, 2);
    /* Der Wilde Mann: geschnitztes Wirtshauszeichen mit Keule */
    E(c, 9 * 16, 32, 13, 14, '#4a3018'); E(c, 9 * 16, 32, 12, 13, '#8a6038');
    const wx = 9 * 16, wy = 22;
    E(c, wx, wy + 2, 3, 3, '#e0b080'); E(c, wx, wy + 1, 4, 4, '#6a4a2a'); E(c, wx, wy + 3, 2, 2, '#e0b080'); P(c, wx - 1, wy + 2, '#1a1a1a'); P(c, wx + 1, wy + 2, '#1a1a1a');
    R(c, wx - 3, wy + 6, 7, 9, '#5a8a3a'); for (let k = 0; k < 7; k += 2) P(c, wx - 3 + k, wy + 7 + (k % 3), '#3a6a2a'); R(c, wx - 2, wy + 15, 2, 6, '#e0b080'); R(c, wx + 1, wy + 15, 2, 6, '#e0b080');
    line(c, wx + 4, wy + 7, wx + 9, wy - 2, '#5a3a20'); E(c, wx + 9, wy - 2, 2, 2, '#5a3a20'); line(c, wx - 3, wy + 8, wx - 7, wy + 12, '#e0b080');
    srBottleWall(c, 12 * 16 + 2, 17, 6 * 16 - 4, 2, '#24160c');
    srTownPic(c, 18 * 16 + 1, 20, 14, 12, 1);
  },
  build: (m) => {
    m.add(objKachelofen(1, 3));
    m.add(srBench(1, 5, 2, '#7a5230', false));
    /* Vitrinen: Fahnen des Männerchors und der Sportvereine, Pokale */
    const flags = (cols) => (c, x, y, w, h) => { for (let k = 0; k < cols.length; k++) { const fx = x + 2 + k * 8; R(c, fx, y + 1, 1, h - 3, '#8a6a3a'); R(c, fx + 1, y + 1, 6, 6, cols[k][0]); R(c, fx + 1, y + 4, 6, 1, cols[k][1]); for (let i = 0; i < 3; i++) R(c, fx + 1 + i, y + 7 + i, 6 - i * 2, 1, cols[k][0]); } };
    m.add(srVitrine(4, 3, 2, 1, (c, x, y, w, h) => { flags([['#c8302a', '#f4f2ea'], ['#2f5fb8', '#e8c23a'], ['#3a7a3a', '#f4f2ea']])(c, x, y, w, h); R(c, x + w - 5, y + h - 7, 4, 4, '#e8c23a'); R(c, x + w - 4, y + h - 3, 2, 2, '#c9a65a'); }, { dh: 18, bg: '#2a1a14' }));
    m.add(srVitrine(10, 3, 2, 1, (c, x, y, w, h) => { for (let k = 0; k < 4; k++) { const tx = x + 2 + k * 6, th = 5 + (k % 2) * 3; R(c, tx, y + h - 3 - th, 4, th - 2, k === 2 ? '#c8c8c8' : '#e8c23a'); R(c, tx + 1, y + h - 3, 2, 2, '#5a3a20'); E(c, tx + 2, y + h - 3 - th, 2, 1, '#f4e080'); } R(c, x + 1, y + 1, 9, 6, '#c8302a'); R(c, x + 1, y + 3, 9, 1, '#f4f2ea'); }, { dh: 18, bg: '#2a1a14' }));
    /* Bar: Rückbuffet mit Kaffeemaschine, Wirtin, Tresen mit Zapfhähnen */
    m.add(srWrap(objCounter(12, 3, 6, 1, { top: '#5a3a20', front: '#3a2414' }), 8, (c, W, H, e) => { R(c, 6, e - 6, 14, 10, '#2a2c30'); R(c, 8, e - 4, 10, 3, '#c9ccd2'); P(c, 12, e + 1, '#c8302a'); for (let k = 0; k < 5; k++) srGlass(c, 34 + k * 7, e, '#f4f0e6'); R(c, 76, e - 4, 12, 8, '#7a5a3a'); R(c, 77, e - 3, 10, 2, '#e8c23a'); }));
    srNpc(m, 'wirtin', 'Wirtin Marlies', 14, 4, 0, 2201, { hair: 16, hairCol: 4, beard: 0, top: 11, topCol: 13, pants: 5, pantsCol: 2, glasses: 0, hat: 0, build: 3 }, () => Story.shop('wildermann'), ['dots', 'note']);
    m.add(objCounter(12, 5, 6, 1, { top: '#6a4426', front: '#3a2414', taps: 3, glasses: 2 }));
    m.trig(12, 5, 6, 1, { label: 'Bei Marlies bestellen', act: () => Story.shop('wildermann') });
    for (const x of [13, 16]) m.add(objStool(x, 6, '#6a3a1e'));
    /* Stammtisch mit Schild */
    m.add(srWrap(objTable(2, 8, 3, 2, { col: '#6a4426', items: 3 }), 16, (c, W, H) => { R(c, W / 2 - 1, 4, 2, 14, '#2a2a2e'); R(c, 4, 0, W - 8, 9, '#2a2a2e'); R(c, 5, 1, W - 10, 7, '#e8dcc0'); pxText(c, 'STAMMTISCH', 5, 2, '#6a1a1a'); P(c, 3, 4, '#2a2a2e'); P(c, W - 4, 4, '#2a2a2e'); }));
    for (const x of [2, 3, 4]) m.add(objChair(x, 7, 3, '#5a3a20'));
    m.add(objChair(1, 8, 2, '#5a3a20')); m.add(objChair(1, 9, 2, '#5a3a20')); m.add(objChair(5, 8, 1, '#5a3a20')); m.add(objChair(5, 9, 1, '#5a3a20')); m.add(objChair(3, 10, 0, '#5a3a20'));
    /* Gaststube: Tisch mit Bänken, Familientisch, Zweiertisch */
    m.add(srBench(7, 5, 3, '#6a4426', true)); m.add(objTable(7, 6, 3, 1, { col: '#6a4426', items: 2 })); m.add(srBench(7, 7, 3, '#6a4426'));
    srTableTB(m, 13, 8, 3, 2, { col: '#6a4426', items: 2, candle: true }, '#5a3a20');
    m.add(objChair(12, 8, 2, '#5a3a20')); m.add(objChair(16, 9, 1, '#5a3a20'));
    m.add(objTable(17, 11, 1, 1, { col: '#6a4426', round: true, candle: true })); m.add(objChair(18, 11, 1, '#5a3a20'));
    m.add(objTable(7, 10, 2, 1, { col: '#6a4426', items: 1 })); m.add(objChair(6, 10, 2, '#5a3a20'));
    /* Garderobe und Schirmständer beim Eingang */
    m.add(mkObj(11, 11, 1, 1, 22, (c, W, H) => { R(c, 7, 4, 2, H - 6, '#4a3020'); R(c, 3, H - 3, 10, 2, '#4a3020'); for (const [dx, col] of [[-1, '#3a4a6a'], [1, '#7a2a2a']]) { R(c, 8 + dx * 3 - 2, 6, 4, 12, col); } R(c, 2, 3, 12, 2, '#4a3020'); E(c, 4, 5, 3, 2, '#2a3a2a'); }));
    m.add(objPlant(1, 11));
    m.pedZones.push({ x: 7, y: 5, w: 3, h: 1, n: 2, sit: true }, { x: 13, y: 10, w: 2, h: 1, n: 1, sit: true });
    srPendants(m, [[8, 6], [14, 8]], '#3a2a1a', '#ffc070'); m.light(3 * 16 + 8, 9 * 16, 40, '#ffc070');
    m.decal((c) => srRug(c, 7 * 16, 8 * 16 + 6, 5 * 16, 22, '#6a2a1e', '#8a3a24'));
    m.light(2 * 16, 4 * 16, 40, '#ff9a40');
  } });

/* 4. Pizzeria zur Mühle (Mühleplatz, Unterstadt, seit 1976) */
sRoom('muehle', { name: 'Pizzeria zur Mühle', w: 18, h: 12, door: 8, back: ['sursee', 'muehle_out'], style: 6, cap: '#5a3424', floor: T.STONE, signCol: '#fff4d0', music: 'lounge', ambient: 0.12, lightC: '#ffc080',
  spots: { friend1: [10, 7, 1], friend2: [7, 7, 2], isa: [11, 4, 2] },
  wall: (c) => {
    /* Weinranken mit Trauben */
    for (let x = 6 * 16; x < 17 * 16; x += 3) { const y = 18 + Math.round(Math.sin(x * 0.15) * 2); P(c, x, y, '#5a4a2a'); P(c, x + 1, y, '#5a4a2a'); if (x % 9 === 0) { E(c, x, y + 2, 2, 1, '#4f8a3a'); P(c, x - 1, y + 1, '#6aa04a'); } if (x % 27 === 0) { for (let g = 0; g < 4; g++) P(c, x + 1 + (g % 2), y + 2 + g, '#6a2a6a'); } }
    R(c, 6 * 16 + 2, 24, 15, 10, '#3a8a4a'); R(c, 6 * 16 + 7, 24, 5, 10, '#f4f2ea'); R(c, 6 * 16 + 12, 24, 5, 10, '#d8302a'); R(c, 6 * 16 + 2, 24, 5, 10, '#2f9a4a');
    /* Bilder aus Italien: Kolosseum, Venedig, Vesuv, Toskana */
    srFrame(c, 7 * 16 + 6, 22, 18, 14, (c, x, y, w, h) => { R(c, x, y, w, h, '#a8c8e8'); R(c, x, y + h - 3, w, 3, '#c8b890'); E(c, x + w / 2, y + 6, 6, 4, '#c8a878'); for (let k = 0; k < 5; k++) R(c, x + 3 + k * 2.5, y + 4 + (k % 2), 1, 2, '#6a5030'); R(c, x + 2, y + 9, 13, 1, '#a8885a'); });
    srFrame(c, 9 * 16 + 2, 22, 18, 14, (c, x, y, w, h) => { R(c, x, y, w, h, '#f0c890'); R(c, x, y + 8, w, 6, '#3a7a9a'); R(c, x + 1, y + 2, 4, 6, '#d8a070'); R(c, x + 10, y + 1, 4, 7, '#c88a60'); R(c, x + 4, y + 10, 7, 1, '#1a1a1a'); P(c, x + 11, y + 9, '#1a1a1a'); line(c, x + 9, y + 9, x + 11, y + 6, '#1a1a1a'); });
    srFrame(c, 10 * 16 + 14, 22, 18, 14, (c, x, y, w, h) => { R(c, x, y, w, h, '#e8b890'); for (let i = 0; i < 7; i++) R(c, x + 3 + i, y + 5 - Math.min(i, 6 - i), 1, 6 + Math.min(i, 6 - i), '#6a5a6a'); R(c, x, y + 9, w, 5, '#3a6a9a'); P(c, x + 6, y + 1, '#d8d8d8'); P(c, x + 7, y, '#e8e8e8'); });
    srFrame(c, 12 * 16 + 10, 22, 18, 14, (c, x, y, w, h) => { R(c, x, y, w, h, '#a8c8e0'); R(c, x, y + 6, w, 8, '#c8b060'); R(c, x, y + 9, w, 5, '#8aa04a'); for (const k of [3, 9, 13]) { R(c, x + k, y + 3, 2, 7, '#2a4a2a'); P(c, x + k, y + 2, '#2a4a2a'); } });
    /* Terrassentür: Glas mit Blick auf Oleander und Sonnenschirm */
    R(c, 14 * 16 + 2, 17, 28, 31, '#5a3a24'); R(c, 14 * 16 + 4, 19, 11, 28, '#9ec8e0'); R(c, 15 * 16 + 1, 19, 11, 28, '#9ec8e0');
    for (const px of [14 * 16 + 4, 15 * 16 + 1]) { R(c, px, 38, 11, 9, '#c8b890'); E(c, px + 5, 34, 4, 3, '#4f8a3a'); P(c, px + 3, 33, '#e86a9a'); P(c, px + 7, 34, '#e86a9a'); R(c, px + 5, 5 * 4 + 7, 1, 8, '#8a8e94'); }
    E(c, 14 * 16 + 9, 26, 6, 2, '#d8302a'); R(c, 14 * 16 + 3, 26, 12, 1, '#f4f2ea'); R(c, 14 * 16 + 9, 28, 1, 10, '#8a8e94');
    R(c, 14 * 16 + 15, 19, 2, 28, '#5a3a24'); P(c, 14 * 16 + 13, 33, '#e8c23a'); P(c, 15 * 16 + 3, 33, '#e8c23a');
    R(c, 14 * 16 - 2, 17, 5, 30, '#c8302a'); R(c, 16 * 16 - 1, 17, 5, 30, '#c8302a'); for (let y = 19; y < 46; y += 4) { P(c, 14 * 16, y, '#8a1a1a'); P(c, 16 * 16 + 1, y, '#8a1a1a'); }
  },
  build: (m) => {
    /* Terracotta-Boden */
    m.decal((c) => {
      for (let ty = 3; ty < 11; ty++) for (let tx = 1; tx < 17; tx++) for (let q = 0; q < 4; q++) {
        const px = tx * 16 + (q % 2) * 8, py = ty * 16 + (q >> 1) * 8, col = shade('#b8603a', (hash(tx * 2 + (q % 2), ty * 2 + (q >> 1), 5) - 0.5) * 0.18);
        R(c, px, py, 8, 8, '#8a4a2e'); R(c, px + 1, py + 1, 7, 7, col); P(c, px + 2, py + 2, shade(col, 0.15));
      }
      R(c, 16, 48, 17 * 16 - 16, 3, 'rgba(0,0,0,0.16)');
    });
    /* Holzofen mit Glut */
    const oven = mkObj(1, 3, 3, 2, 18, (c, W, H) => {
      R(c, 10, 0, 10, 14, '#7a4a32'); for (let y = 2; y < 14; y += 3) R(c, 10, y, 10, 1, '#5a3424');
      E(c, W / 2, 30, 22, 18, '#5a3424'); E(c, W / 2, 29, 21, 17, '#a85a3a');
      for (let r = 0; r < 6; r++) for (let k = 0; k < 9; k++) { const a = -3.0 + k * 0.38, rr = 6 + r * 2.6; P(c, W / 2 + Math.cos(a) * rr * 1.2, 29 + Math.sin(a) * rr, '#8a4a2e'); }
      R(c, 0, H - 14, W, 14, '#c8b8a0'); R(c, 0, H - 14, W, 2, '#e8dcc8'); R(c, 0, H - 2, W, 2, '#8a7a68');
      E(c, W / 2, 34, 9, 7, '#2a140c'); R(c, W / 2 - 9, 34, 19, 6, '#2a140c'); E(c, W / 2, 34, 7, 5, '#5a1e0c'); R(c, W / 2 - 7, 34, 15, 5, '#5a1e0c');
      R(c, W / 2 - 10, 39, 21, 2, '#3a2a20'); pxText(c, '1976', W / 2 - 7, H - 10, '#7a5a3a');
    }, { emit: (c, W) => { E(c, W / 2, 34, 7, 5, '#ff8030'); } });
    oven.anim = (c, t, px, py) => { const W = 48; srEmbers(c, t, px + W / 2 - 7, py + 32, 15, 8, 3); const f = Math.sin(t * 7) * 0.5 + 0.5; c.globalAlpha = 0.3 + f * 0.25; E(c, px + W / 2, py + 36, 6, 3, '#ffb040'); c.globalAlpha = 1; };
    m.add(oven);
    m.light(2 * 16 + 8, 4 * 16 + 4, 48, '#ff8a30');
    m.add(mkObj(4, 3, 1, 1, 10, (c, W, H) => { for (let r = 0; r < 4; r++) for (let k = 0; k < 3 - (r === 3 ? 1 : 0); k++) { const lx = 2 + k * 4 + (r % 2) * 2, ly = H - 6 - r * 4; E(c, lx + 1, ly + 1, 2, 2, '#8a5a32'); E(c, lx + 1, ly + 1, 1, 1, '#c89a62'); } }));
    m.add(mkObj(5, 3, 1, 1, 18, (c, W, H) => { R(c, 1, 2, 14, H - 3, '#6a4428'); for (const y of [9, 19]) R(c, 1, y, 14, 2, '#8a5a34'); for (let k = 0; k < 3; k++) { R(c, 2 + k * 4, 4, 3, 5, '#c8302a'); R(c, 2 + k * 4, 5, 3, 2, '#3a8a3a'); } R(c, 2, 12, 6, 7, '#e8dcc0'); R(c, 8, 13, 6, 6, '#e8dcc0'); pxText(c, '00', 3, 14, '#2f5fb8'); R(c, 3, H - 6, 10, 4, '#d8c8a0'); }));
    /* Arbeitstheke mit Teig, Sauce, Basilikum und Schaufel */
    m.add(srWrap(objCounter(1, 6, 4, 1, { top: '#e8e4dc', front: '#8a5a34' }), 6, (c, W, H, e) => { E(c, 12, e + 6, 7, 3, '#f4e8c8'); E(c, 12, e + 6, 5, 2, '#d8402a'); for (let k = 0; k < 4; k++) P(c, 9 + k * 2, e + 5 + (k % 2), '#f8f0d8'); E(c, 30, e + 6, 4, 2, '#c8302a'); E(c, 40, e + 6, 3, 2, '#4f9a3a'); R(c, 50, e + 2, 2, 10, '#c8a070'); E(c, 51, e + 2, 4, 3, '#d8b080'); R(c, 24, e, 4, 5, '#f4f0e6'); }));
    m.trig(1, 6, 4, 1, { label: 'Pizza bestellen', act: () => Story.shop('muehle') });
    srNpc(m, 'gino', 'Pizzaiolo Gino', 4, 5, 0, 2301, { hair: 2, hairCol: 0, beard: 2, beardCol: 0, top: 0, topCol: 13, pants: 0, pantsCol: 3, hat: 0, build: 3 }, () => Story.shop('muehle'), ['note', 'dots']);
    /* Tische mit Karotuch, Kerze und Chianti */
    const tab = (x, y) => { m.add(srWrap(objTable(x, y, 2, 1, { col: '#f4f0e6', cloth: '#c8352d' }), 8, (c, W, H, e) => { srChianti(c, 9, e - 1); srCandle(c, 20, e + 2); R(c, 3, e + 6, 4, 2, '#f4f4f0'); R(c, 25, e + 6, 4, 2, '#f4f4f0'); })); m.add(objChair(x - 1, y, 2, '#7a4a28')); m.add(objChair(x + 2, y, 1, '#7a4a28')); };
    tab(8, 4); tab(12, 4); tab(8, 7); tab(12, 7);
    m.add(srWrap(objTable(14, 9, 2, 1, { col: '#f4f0e6', cloth: '#c8352d' }), 8, (c, W, H, e) => { srChianti(c, 13, e - 1); srCandle(c, 6, e + 2); }));
    m.add(objChair(16, 9, 1, '#7a4a28'));
    /* Mühlstein als Erinnerung an die alte Mühle, Olivenbäumchen */
    m.add(mkObj(16, 3, 1, 1, 10, (c, W, H) => { E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.25)'); E(c, 8, H - 12, 7, 10, '#8a8478'); E(c, 8, H - 12, 6, 9, '#aaa498'); E(c, 8, H - 12, 2, 2, '#5a5448'); for (let a = 0; a < 6.28; a += 0.8) line(c, 8 + Math.cos(a) * 3, H - 12 + Math.sin(a) * 3, 8 + Math.cos(a) * 6, H - 12 + Math.sin(a) * 8, '#8a8478'); }));
    m.add(mkObj(13, 3, 1, 1, 16, (c, W, H) => { E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 4, H - 8, 8, 7, '#c86a3a'); R(c, 4, H - 8, 8, 1, '#e88a5a'); R(c, 7, H - 18, 2, 10, '#6a5a3a'); E(c, 8, H - 22, 6, 6, '#6a8a4a'); for (let i = 0; i < 9; i++) P(c, 3 + (hash(i, 2) * 10 | 0), H - 26 + (hash(i, 3) * 9 | 0), i % 3 ? '#8aaa6a' : '#2a3a1a'); }));
    m.add(srWrap(objTable(2, 9, 2, 1, { col: '#f4f0e6', cloth: '#c8352d' }), 8, (c, W, H, e) => { srChianti(c, 4, e - 1); srCandle(c, 15, e + 2); R(c, 20, e + 4, 8, 4, '#e8c890'); E(c, 24, e + 5, 3, 1, '#d8402a'); }));
    m.add(objChair(1, 9, 2, '#7a4a28')); m.add(objChair(4, 9, 1, '#7a4a28')); m.add(objChair(2, 8, 3, '#7a4a28'));
    m.add(objPlant(1, 10)); m.add(objPlant(6, 3));
    srPendants(m, [[2, 9], [9, 4], [13, 4], [9, 7], [13, 7]], '#c8a050', '#ffd090', 1);
    m.pedZones.push({ x: 7, y: 4, w: 1, h: 1, n: 1, sit: true }, { x: 14, y: 7, w: 1, h: 1, n: 1, sit: true });
  } });

/* 5. Stadtcafé Sursee am Rathausplatz (im ehemaligen Modehaus Heimann) */
sRoom('stadtcafe', { name: 'Stadtcafé Sursee', sign: 'Stadtcafe Sursee', w: 16, h: 11, door: 7, back: ['sursee', 'stadtcafe_out'], style: 5, cap: '#34363c', floor: T.WOOD, floorV: 2, signCol: '#2a2c30', music: 'lounge', lightC: '#fff0d0',
  spots: { isa: [6, 5, 2], lexx: [8, 5, 1], friend1: [9, 8, 3] },
  wall: (c) => {
    /* Wechselnde Ausstellung: moderne Bilder mit Spots und Täfelchen */
    const art = [
      [6 * 16 + 2, 20, 20, 18, (c, x, y, w, h) => { R(c, x, y, w, h, '#f4f2ea'); R(c, x, y, 6, 8, '#d8302a'); R(c, x + 8, y + 9, 8, 6, '#2f5fb8'); R(c, x + 13, y, 3, 6, '#f2d050'); R(c, x + 6, y, 1, h, '#1a1a1a'); R(c, x, y + 8, w, 1, '#1a1a1a'); R(c, x + 12, y + 8, 1, h - 8, '#1a1a1a'); }],
      [7 * 16 + 10, 18, 16, 22, (c, x, y, w, h) => { R(c, x, y, w, h, '#2a3a5a'); E(c, x + w / 2, y + 7, 4, 4, '#f2c050'); for (let k = 0; k < 4; k++) R(c, x, y + 12 + k * 2, w, 1, ['#3a6a9a', '#4f8ab8', '#6aa0c8', '#8ab8d8'][k]); }],
      [9 * 16 + 4, 22, 24, 16, (c, x, y, w, h) => { R(c, x, y, w, h, '#e8e0d0'); for (let k = 0; k < 6; k++) E(c, x + 3 + k * 3.5, y + 4 + (k % 3) * 3, 2, 2, ['#e8402e', '#3fae4a', '#3a8ae0', '#f2c23a', '#9a5ae0', '#1a1a1a'][k]); line(c, x + 1, y + h - 3, x + w - 2, y + 3, '#1a1a1a'); }],
      [11 * 16 + 4, 20, 18, 20, (c, x, y, w, h) => { R(c, x, y, w, h, '#f4f0e6'); E(c, x + 8, y + 10, 6, 5, '#1a1a1a'); E(c, x + 8, y + 10, 5, 4, '#f4f0e6'); R(c, x + 3, y + 6, 4, 3, '#1a1a1a'); R(c, x + 11, y + 12, 3, 2, '#1a1a1a'); R(c, x + 4, y + 15, 2, 3, '#1a1a1a'); R(c, x + 10, y + 15, 2, 3, '#1a1a1a'); E(c, x + 13, y + 5, 2, 2, '#e8a0a0'); }],
    ];
    for (const [px, py, w, h, fn] of art) { srFrame(c, px, py, w, h, fn, '#f4f4f0'); R(c, px + w / 2 - 3, py + h + 2, 6, 3, '#f4f4f0'); R(c, px + w / 2 - 1, 16, 2, 2, '#2a2c30'); }
    R(c, 6 * 16, 16, 7 * 16, 1, '#2a2c30');
    /* Grosses Fenster zum Rathausplatz */
    R(c, 13 * 16 + 4, 17, 28, 29, '#e8e8e4'); R(c, 13 * 16 + 6, 19, 24, 25, '#a8cce4'); R(c, 13 * 16 + 6, 36, 24, 8, '#d3cabb');
    { const fx = 13 * 16 + 7; R(c, fx, 26, 22, 10, '#e8d8b8'); for (let i = 0; i < 4; i++) R(c, fx + 2 + i * 2, 25 - i * 2, 18 - i * 4, 2, '#c8b898'); R(c, fx + 9, 17, 4, 3, '#8a3a2a'); E(c, fx + 11, 21, 2, 2, '#f4f0e6'); P(c, fx + 11, 21, '#1a1a1a'); for (let k = 0; k < 4; k++) { R(c, fx + 2 + k * 5, 28, 2, 3, '#5a6a8a'); R(c, fx + 2 + k * 5, 32, 2, 3, '#5a6a8a'); } }
    R(c, 13 * 16 + 17, 19, 2, 25, '#e8e8e4');
  },
  build: (m) => {
    /* Theke mit Siebträgermaschine und Kuchenvitrine, Regal mit Tassen */
    m.add(mkObj(1, 3, 4, 1, 18, (c, W, H) => { R(c, 0, 2, W, H - 3, '#e8e4dc'); for (const y of [8, 16]) { R(c, 0, y, W, 2, '#8a6a4a'); for (let k = 2; k < W - 3; k += 5) { R(c, k, y - 4, 3, 4, (k / 5) % 2 ? '#f4f4f0' : '#2a2c30'); } } R(c, 2, 20, 10, 8, '#7a5a3a'); pxText(c, 'BIO', 3, 22, '#f4e8c0'); R(c, 40, 19, 18, 9, '#2a2c30'); pxText(c, 'MENU', 42, 21, '#f4f4f0'); }));
    m.add(srWrap(objCounter(1, 5, 4, 1, { top: '#d9dcdf', front: '#2a2c30', reg: true }), 12, (c, W, H, e) => {
      R(c, 18, e - 9, 18, 13, '#c9ccd2'); R(c, 18, e - 9, 18, 2, '#e8eaee'); R(c, 20, e - 5, 4, 3, '#2a2a2e'); R(c, 29, e - 5, 4, 3, '#2a2a2e'); R(c, 21, e - 2, 2, 3, '#5a5e64'); R(c, 30, e - 2, 2, 3, '#5a5e64'); R(c, 25, e - 7, 3, 2, '#3ad0a0');
      R(c, 40, e - 6, 20, 10, '#f4f4f0'); R(c, 41, e - 5, 18, 7, '#d8ecf8'); for (let k = 0; k < 3; k++) R(c, 42 + k * 6, e - 2, 5, 3, ['#5a3420', '#f4e0c0', '#c8302a'][k]);
    }));
    m.trig(1, 5, 4, 1, { label: 'Kaffee bestellen', act: () => Story.shop('stadtcafe') });
    srNpc(m, 'barista', 'Barista Lea', 2, 4, 0, 2401, { hair: 9, hairCol: 7, beard: 0, top: 0, topCol: 16, pants: 0, pantsCol: 2, glasses: 0, hat: 0, jewel: 1 }, () => Story.shop('stadtcafe'), ['note', 'dots']);
    m.trig(6, 2, 7, 1, { label: 'Ausstellung', act: () => Sur.look('ausstellung') });
    /* Bistrotische, langer Tisch mit Hockern, Lounge */
    for (const x of [7, 11]) { m.add(srWrap(objTable(x, 5, 1, 1, { col: '#f4f4f0', round: true }), 4, (c, W, H, e) => { R(c, 5, e + 2, 4, 3, '#f4f4f0'); R(c, 6, e + 1, 2, 1, '#6a4428'); })); m.add(objChair(x - 1, 5, 2, '#2a2c30')); m.add(objChair(x + 1, 5, 1, '#2a2c30')); }
    m.add(srWrap(objTable(6, 7, 4, 1, { col: '#c8a070' }), 4, (c, W, H, e) => { for (let k = 0; k < 4; k++) { R(c, 6 + k * 16, e + 3, 4, 3, '#f4f4f0'); P(c, 7 + k * 16, e + 2, '#6a4428'); } R(c, 34, e + 1, 3, 5, '#c8e0ec'); P(c, 35, e, '#4f9a3a'); E(c, 35, e - 1, 2, 1, '#e86a9a'); }));
    for (let k = 0; k < 4; k++) m.add(objStool(6 + k, 8, '#2a2c30'));
    m.add(objSofa(12, 8, 2, '#3a6a6a')); m.add(objTable(12, 9, 2, 1, { col: '#c8a070', items: 1 }));
    /* Erinnerung ans Modehaus: Schaufensterpuppe mit Schal */
    m.add(mkObj(14, 6, 1, 1, 22, (c, W, H) => { R(c, 6, H - 4, 4, 3, '#2a2c30'); R(c, 7, 8, 2, H - 12, '#c9b89a'); R(c, 4, 6, 8, 10, '#e8e4dc'); R(c, 4, 6, 8, 3, '#c8302a'); R(c, 9, 9, 2, 6, '#c8302a'); E(c, 8, 4, 3, 3, '#e8d8c0'); }));
    m.add(objPlant(14, 3)); m.add(objPlant(1, 9));
    /* Leseecke mit Zeitungsständer */
    m.add(objSofa(2, 8, 2, '#c8a040')); m.add(srWrap(objTable(2, 9, 2, 1, { col: '#2a2c30' }), 4, (c, W, H, e) => { R(c, 4, e + 3, 10, 6, '#f4f0e6'); R(c, 5, e + 4, 8, 1, '#2a2c30'); R(c, 5, e + 6, 6, 1, '#8a8e94'); R(c, 20, e + 4, 4, 3, '#f4f4f0'); }));
    m.add(mkObj(4, 8, 1, 1, 14, (c, W, H) => { R(c, 7, 4, 2, H - 6, '#5a5e64'); R(c, 4, H - 3, 8, 2, '#5a5e64'); for (let k = 0; k < 3; k++) { R(c, 2, 4 + k * 6, 12, 5, '#f4f0e6'); R(c, 3, 5 + k * 6, 6, 1, '#2a2c30'); } pxText(c, 'SW', 3, 11, '#c8302a'); }));
    srPendants(m, [[7, 5], [11, 5], [8, 7]], '#2a2c30', '#fff0d0', 1);
    m.pedZones.push({ x: 6, y: 8, w: 2, h: 1, n: 1, sit: true }, { x: 12, y: 8, w: 2, h: 1, n: 1, sit: true });
  } });

/* ---------- Helfer für die Bars ---------- */
/* Leuchtschrift als Objekt an der Rückwand, flackert gelegentlich */
function srNeonObj(m, x, w, txt, col, dx, dy, s = 1) {
  const o = mkObj(x, 3, w, 1, 40, () => {}, { solid: false });
  o.anim = (c, t, px, py) => { const fl = Math.sin(t * 23 + x) > 0.985 || (Math.floor(t * 3 + x) % 41 === 0 && Math.sin(t * 50) > 0); if (!fl) srNeon(c, txt, px + dx, py + dy, col, s); else pxText(c, txt, px + dx, py + dy, shade(col, -0.55), s); };
  m.add(o); m.light(x * 16 + dx + pxTextW(txt, s) / 2, 3 * 16 - 40 + dy + 4, 40, col);
  return o;
}
function srBilliard(x, y) {
  return mkObj(x, y, 3, 2, 6, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.3)');
    for (const lx of [2, W / 2 - 1, W - 5]) R(c, lx, H - 9, 3, 8, '#3a2010');
    R(c, 0, 2, W, H - 10, '#5a2e14'); R(c, 0, 2, W, 1, '#8a4a24'); R(c, 0, H - 9, W, 2, '#3a1e0c');
    R(c, 4, 6, W - 8, H - 18, '#1f7a4a'); R(c, 4, 6, W - 8, 1, '#2a9a5e'); R(c, 13, 7, 1, H - 20, 'rgba(255,255,255,0.18)');
    for (const [px, py] of [[4, 6], [W / 2, 5], [W - 5, 6], [4, H - 13], [W / 2, H - 12], [W - 5, H - 13]]) E(c, px, py, 2, 1, '#0a0a0a');
    const bc = ['#e8c23a', '#2f5fb8', '#c8302a', '#6a2a8a', '#e87a2a', '#2f8a3a', '#1a1a1a', '#8a1a1a', '#e8c23a', '#2f5fb8'];
    let k = 0; for (let r = 0; r < 4; r++) for (let j = 0; j <= r; j++) { if (k >= 10) break; E(c, 30 + r * 3, 15 - r * 1.5 + j * 3, 1, 1, bc[k++]); }
    E(c, 13, 16, 1, 1, '#f4f4f0'); line(c, 2, 24, 11, 17, '#c8a070'); P(c, 2, 24, '#1a1a1a');
  });
}
/* Liegende Weinfässer im Gestell */
function srBarrelRack(x, y, w) {
  return mkObj(x, y, w, 1, 16, (c, W, H) => {
    R(c, 0, H - 4, W, 3, '#4a3020');
    const n = w * 2 - 1;
    for (let k = 0; k < n; k++) { const bx = 8 + k * 8, by = k % 2 ? H - 22 : H - 11; E(c, bx, by, 6, 6, '#3a2414'); E(c, bx, by, 5, 5, '#8a5a32'); E(c, bx, by, 3, 3, '#7a4a28'); for (let a = 0; a < 6.28; a += 0.3) P(c, bx + Math.cos(a) * 5, by + Math.sin(a) * 5, '#3a3a3e'); R(c, bx - 1, by + 1, 2, 2, '#2a1a10'); }
  });
}
/* Fass als Stehtisch mit Gläsern */
function srBarrelTable(x, y, top) {
  return mkObj(x, y, 1, 1, 12, (c, W, H) => {
    E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.25)');
    R(c, 2, H - 18, 12, 16, '#7a4a28'); for (let k = 3; k < 14; k += 3) R(c, k, H - 17, 1, 14, '#5a3420'); R(c, 1, H - 15, 14, 1, '#3a3a3e'); R(c, 1, H - 6, 14, 1, '#3a3a3e');
    E(c, 8, H - 18, 6, 2, '#a06a3a'); E(c, 8, H - 18, 5, 1, '#b07a48');
    if (top) top(c, H - 18);
  });
}
/* Edelstahl-Fässer (Kegs) gestapelt */
function srKegs(x, y) {
  return mkObj(x, y, 1, 1, 14, (c, W, H) => {
    E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.25)');
    for (const [kx, ky] of [[2, H - 13], [8, H - 13], [5, H - 25]]) { R(c, kx, ky, 7, 11, '#a8acb2'); R(c, kx, ky, 2, 11, '#d8dce0'); R(c, kx + 5, ky, 2, 11, '#7a7e84'); R(c, kx, ky + 3, 7, 1, '#6a6e74'); R(c, kx, ky + 8, 7, 1, '#6a6e74'); E(c, kx + 3, ky, 3, 1, '#c8ccd2'); }
  });
}
/* Kaffeesäcke aus Jute mit Stempel */
function srSacks(x, y, w = 1) {
  return mkObj(x, y, w, 1, 10, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 1, 2, 'rgba(0,0,0,0.22)');
    for (let k = 0; k < w * 2 - 1; k++) { const sx = 2 + k * 7, sy = k % 2 ? H - 24 : H - 15; R(c, sx, sy, 12, 13, '#b8946a'); R(c, sx, sy, 12, 2, '#9a7850'); R(c, sx + 1, sy - 2, 10, 2, '#a88458'); for (let i = 0; i < 6; i++) P(c, sx + 1 + (hash(k, i) * 10 | 0), sy + 3 + (hash(i, k) * 9 | 0), '#9a7850'); R(c, sx + 3, sy + 5, 6, 4, k % 2 ? '#3a6a3a' : '#8a2a1a'); P(c, sx + 5, sy + 6, '#e8dcc0'); }
  });
}
/* Grosse Siebträgermaschine (für srWrap auf einer Theke) */
function srEspresso(c, x, y, big = true) {
  const w = big ? 26 : 18;
  R(c, x, y, w, 14, '#c9ccd2'); R(c, x, y, w, 2, '#e8eaee'); R(c, x, y + 12, w, 2, '#8a8e94'); R(c, x + 1, y + 3, w - 2, 1, '#a8acb2');
  for (let k = 0; k < (big ? 2 : 1); k++) { const gx = x + 5 + k * 12; R(c, gx, y + 7, 5, 3, '#5a5e64'); R(c, gx + 1, y + 10, 3, 2, '#2a2a2e'); R(c, gx + 4, y + 9, 6, 2, '#1a1a1a'); R(c, gx + 1, y + 13, 3, 2, '#f4f4f0'); }
  E(c, x + w / 2, y + 4, 2, 2, '#f4f4f0'); P(c, x + w / 2, y + 4, '#c8302a'); line(c, x + w - 2, y + 6, x + w + 1, y + 12, '#a8acb2');
  for (let k = 0; k < (big ? 5 : 3); k++) R(c, x + 2 + k * 5, y - 3, 4, 3, k % 2 ? '#f4f4f0' : '#e8e4dc');
}
/* Zapfhahnwand: Edelstahlpaneel mit vielen Hähnen und bunten Griffen */
function srTapWall(c, px, py, w, n) {
  R(c, px, py, w, 18, '#8a8e94'); R(c, px, py, w, 1, '#c8ccd2'); R(c, px, py + 17, w, 1, '#5a5e64'); R(c, px + 2, py + 9, w - 4, 2, '#c8ccd2');
  for (let k = 0; k < n; k++) {
    const tx = px + 4 + k * ((w - 8) / (n - 1)) - 1, col = ['#c8302a', '#e8c23a', '#2f8a3a', '#2f5fb8', '#e87a2a', '#6a2a8a', '#f4f4f0', '#1a1a1a'][k % 8];
    R(c, tx, py + 8, 2, 5, '#d8dce0'); R(c, tx, py + 13, 2, 1, '#5a5e64'); R(c, tx - 1, py + 1 + (k % 3), 4, 7 - (k % 3), col); R(c, tx - 1, py + 1 + (k % 3), 4, 1, shade(col, 0.4));
    R(c, tx - 1, py + 20, 4, 3, '#26302a'); P(c, tx, py + 21, '#f4e8a0');
  }
}
/* Spiegelkugel mit wandernden Lichtpunkten */
function srMirrorBall(m, x, y, fx0, fy0, fw, fh) {
  srOver(m, (c, cx, cy, t) => {
    const px = x - cx, py = y - cy;
    R(c, px, py - 26, 1, 20, '#1a1a1a');
    E(c, px, py, 6, 6, '#7a7e84');
    for (let j = -5; j <= 5; j += 2) for (let i = -5; i <= 5; i += 2) { if (i * i + j * j > 30) continue; const b = (i + j + Math.floor(t * 8)) & 3; R(c, px + i, py + j, 2, 2, ['#e8eaee', '#a8acb2', '#c8ccd2', '#ffffff'][b]); }
    P(c, px - 2, py - 3, '#ffffff');
  });
  srOver(m, (c, cx, cy, t) => {
    c.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 26; k++) {
      const a = k * 0.83 + t * 0.7, r = 0.35 + (k % 5) * 0.16;
      const sx = Math.round(fx0 + fw / 2 + Math.cos(a) * fw * r - cx), sy = Math.round(fy0 + fh / 2 + Math.sin(a) * fh * r * 0.9 - cy);
      const col = ['#ffffff', '#ffd0e8', '#d0e8ff', '#fff0b0'][k % 4];
      c.fillStyle = rgba(col, 0.55); c.fillRect(sx, sy, 2, 2); c.fillStyle = rgba(col, 0.25); c.fillRect(sx - 1, sy, 4, 1); c.fillRect(sx, sy - 1, 1, 4);
    }
    c.globalCompositeOperation = 'source-over';
  }, true);
}

/* 6. TNT Rock Bar (Oberstadt) */
sRoom('tnt', { name: 'TNT Rock Bar', sign: false, w: 16, h: 11, door: 7, back: ['sursee', 'tnt_out'], style: 1, cap: '#1a1214', floor: T.WOOD, floorV: 1, music: 'bar', ambient: 0.34, light: false,
  spots: { friend1: [11, 6, 3], friend2: [8, 9, 2] },
  wall: (c) => {
    pxText(c, 'ROCK BAR', 17, 37, '#e8a040');
    srPoster(c, 4 * 16 + 2, 19, 13, 18, '#1a1a1a', '#e8402e', 'AC', 0); srPoster(c, 5 * 16 + 1, 21, 17, 17, '#e8c23a', '#1a1a1a', 'LIVE', 1);
    srPoster(c, 6 * 16 + 4, 18, 13, 16, '#5a1a6a', '#f4f0e6', 'RIP', 2); srPoster(c, 7 * 16 + 3, 22, 13, 14, '#2a4a8a', '#f4f0e6', '', 0);
    srGuitar(c, 8 * 16 + 4, 20, '#c8302a', 0); srGuitar(c, 9 * 16 + 2, 19, '#1a1a1a', 1); srGuitar(c, 9 * 16 + 12, 21, '#e8b030', 0);
    srBottleWall(c, 11 * 16, 17, 4 * 16, 2, '#140c0c');
    R(c, 15 * 16 - 15, 22, 13, 13, '#2a1a10'); DECAL.dart(c, 15 * 16 - 14, 23);
  },
  build: (m) => {
    m.decal((c) => srRug(c, 6 * 16, 7 * 16, 5 * 16, 2 * 16, '#2a2a2e', '#3a1a1a'));
    srNeonObj(m, 1, 3, 'TNT', '#ff5a2a', 4, 16, 2);
    /* Dynamitbündel mit glimmender Zündschnur */
    const dyn = mkObj(3, 3, 1, 1, 30, (c, W, H) => { for (let k = 0; k < 3; k++) { R(c, 3 + k * 4, 14, 3, 12, '#c8302a'); R(c, 3 + k * 4, 14, 1, 12, '#e85a4a'); } R(c, 2, 18, 13, 2, '#2a2a2e'); R(c, 2, 22, 13, 2, '#2a2a2e'); line(c, 8, 14, 11, 8, '#5a4a3a'); line(c, 11, 8, 9, 5, '#5a4a3a'); }, { solid: false });
    dyn.anim = (c, t, px, py) => { const f = Math.floor(t * 9) % 3; P(c, px + 9, py + 4 - (f === 1 ? 1 : 0), '#fff0a0'); P(c, px + 8 + f, py + 3, '#ffb030'); P(c, px + 10 - f, py + 2, '#ff5a2a'); };
    m.add(dyn);
    m.add(objJukebox(5, 3));
    m.add(objSpeaker(4, 3)); m.add(objSpeaker(10, 3));
    /* Bar mit Kühlschrank im Rückbuffet */
    m.add(srWrap(objCounter(11, 3, 4, 1, { top: '#2a2020', front: '#1a1414' }), 10, (c, W, H, e) => { R(c, 2, e - 8, 16, 12, '#2a2c30'); R(c, 3, e - 7, 14, 10, '#4a8ab0'); for (let k = 0; k < 4; k++) { R(c, 4 + k * 3, e - 6, 2, 4, '#c8a040'); R(c, 4 + k * 3, e - 1, 2, 3, '#2f7a3a'); } R(c, 40, e - 2, 12, 6, '#3a3c42'); R(c, 41, e - 1, 10, 2, '#7ad07a'); }));
    srNpc(m, 'tntbar', 'Barkeeper Ändu', 12, 4, 0, 2501, { hair: 14, hairCol: 0, beard: 8, beardCol: 0, top: 0, topCol: 16, print: 1, pants: 0, pantsCol: 2, hat: 0, glasses: 0, build: 2 }, () => Story.shop('tnt'), ['note', 'beer']);
    m.add(objCounter(10, 5, 5, 1, { top: '#3a2a20', front: '#1a1414', taps: 3, glasses: 2 }));
    m.trig(10, 5, 5, 1, { label: 'Bar: Bestellen', act: () => Story.shop('tnt') });
    for (const x of [11, 13]) m.add(objStool(x, 6, '#c8302a'));
    m.add(srBilliard(2, 6)); m.trig(2, 6, 3, 2, { label: 'Billard', act: () => Sur.look('billard') });
    m.add(mkObj(1, 9, 1, 1, 18, (c, W, H) => { R(c, 3, 2, 10, H - 4, '#4a2a14'); for (let k = 0; k < 4; k++) { line(c, 5 + k * 2, 3, 5 + k * 2, H - 4, '#c8a070'); P(c, 5 + k * 2, 3, '#2a5a8a'); } R(c, 3, H - 6, 10, 2, '#2a1a0a'); }));
    for (const [x, y] of [[8, 8], [13, 8]]) { m.add(srWrap(objTable(x, y, 1, 1, { col: '#2a2020', round: true }), 4, (c, W, H, e) => { srGlass(c, 5, e + 1); srGlass(c, 9, e + 2, '#2a1a10'); })); m.add(objStool(x - 1, y + 1, '#2a2a2e')); m.add(objStool(x + 1, y + 1, '#2a2a2e')); }
    m.add(objPlant(14, 9));
    srPendants(m, [[3, 6], [3, 7]], '#1f5a3a', '#e8f0c0', 0);
    srPendants(m, [[8, 8], [13, 8]], '#3a2a20', '#ffb060', 2);
    m.light(12 * 16 + 8, 4 * 16 + 8, 60, '#ffa050'); m.light(5 * 16 + 8, 3 * 16, 30, '#ffd27a'); m.light(8 * 16, 10 * 16, 40, '#ff8a50');
    m.pedZones.push({ x: 5, y: 6, w: 4, h: 3, n: 3, drink: true });
  } });

/* 7. Rössli Nightbar: roter Samt, Spiegelkugel, kleine Tanzfläche */
sRoom('roessli', { name: 'Rössli Nightbar', sign: false, w: 16, h: 11, door: 7, back: ['sursee', 'roessli_out'], style: 3, cap: '#2a0a12', floor: T.CARPET, floorV: 0, music: 'disco', ambient: 0.4, light: false,
  spots: { friend1: [11, 6, 3], friend2: [4, 8, 1] },
  wall: (c) => {
    /* Samtvorhänge mit Falten und Goldborte */
    for (let x = 16; x < 15 * 16; x++) { const f = Math.sin(x * 0.55) * 0.5 + 0.5; R(c, x, 17, 1, 30, shade('#8a1020', (f - 0.5) * 0.5)); }
    R(c, 16, 16, 14 * 16, 2, '#c9a65a'); R(c, 16, 45, 14 * 16, 2, '#c9a65a'); for (let x = 18; x < 15 * 16; x += 3) P(c, x, 47, '#e8c870');
    srBottleWall(c, 11 * 16 - 4, 18, 4 * 16 + 4, 2, '#1a0608');
    for (let k = 0; k < 3; k++) { const px = 1 * 16 + 6 + k * 18; R(c, px, 32, 12, 12, '#c9a65a'); R(c, px + 1, 33, 10, 10, '#d8c0d0'); E(c, px + 6, 37, 2, 3, '#8a1020'); }
  },
  build: (m) => {
    /* Tanzfläche: schwarz-weisses Schachbrett mit Goldrand */
    m.fill(5, 5, 5, 4, T.MARBLE);
    m.decal((c) => { R(c, 5 * 16 - 2, 5 * 16 - 2, 5 * 16 + 4, 2, '#c9a65a'); R(c, 5 * 16 - 2, 9 * 16, 5 * 16 + 4, 2, '#c9a65a'); R(c, 5 * 16 - 2, 5 * 16, 2, 4 * 16, '#c9a65a'); R(c, 10 * 16, 5 * 16, 2, 4 * 16, '#c9a65a'); });
    srNeonObj(m, 5, 5, 'RÖSSLI', '#ff6ab0', 6, 16, 2);
    /* Leuchtendes Pferdchen neben dem Schriftzug */
    const horse = mkObj(4, 3, 1, 1, 40, () => {}, { solid: false });
    horse.anim = (c, t, px, py) => { const col = Math.sin(t * 2) > -0.9 ? '#ff9ad0' : '#8a3a5a'; line(c, px + 4, py + 30, px + 6, py + 20, col); line(c, px + 6, py + 20, px + 10, py + 17, col); line(c, px + 10, py + 17, px + 13, py + 19, col); line(c, px + 13, py + 19, px + 12, py + 21, col); line(c, px + 12, py + 21, px + 9, py + 22, col); line(c, px + 9, py + 22, px + 10, py + 30, col); line(c, px + 7, py + 19, px + 6, py + 16, col); line(c, px + 6, py + 20, px + 3, py + 24, col); P(c, px + 11, py + 19, col); };
    m.add(horse);
    m.add(srWrap(objCounter(11, 3, 4, 1, { top: '#2a0a12', front: '#1a0608' }), 6, (c, W, H, e) => { for (let k = 0; k < 6; k++) R(c, 4 + k * 9, e - 2, 3, 6, k % 2 ? '#c8e0ec' : '#f4f0e6'); E(c, 58, e, 3, 2, '#c9a65a'); }));
    srNpc(m, 'roesslibar', 'Barfrau Nicole', 12, 4, 0, 2601, { hair: 10, hairCol: 5, beard: 0, top: 5, topCol: 16, pants: 0, pantsCol: 2, jewel: 4, glasses: 0, hat: 0 }, () => Story.shop('roessli'), ['heart', 'dots']);
    m.add(objCounter(10, 5, 5, 1, { top: '#3a0a18', front: '#5a0a1a', glasses: 3 }));
    m.decal((c) => { for (let k = 0; k < 5; k++) R(c, 10 * 16 + 4 + k * 16, 6 * 16 - 1, 8, 1, '#ff6ab0'); });
    m.trig(10, 5, 5, 1, { label: 'Bar: Bestellen', act: () => Story.shop('roessli') });
    for (const x of [11, 13]) m.add(objStool(x, 6, '#c9a65a'));
    /* Samtsofas mit Tischchen */
    m.add(objSofa(1, 4, 3, '#8a1a2a')); m.add(srWrap(objTable(2, 5, 1, 1, { col: '#1a0a0a', round: true }), 4, (c) => { srCandle(c, 7, 4); srGlass(c, 3, 6, '#f4c0d0'); }));
    m.add(objSofa(1, 7, 2, '#8a1a2a')); m.add(objTable(1, 8, 2, 1, { col: '#1a0a0a', round: true, candle: true })); m.add(objChair(3, 8, 1, '#8a1a2a')); m.add(objChair(4, 8, 1, '#8a1a2a'));
    m.add(objTable(12, 8, 1, 1, { col: '#1a0a0a', round: true, candle: true })); m.add(objChair(11, 8, 2, '#8a1a2a')); m.add(objChair(13, 8, 1, '#8a1a2a'));
    m.add(objSpeaker(5, 3)); m.add(objSpeaker(9, 3));
    m.add(objPlant(14, 9));
    srMirrorBall(m, 7 * 16 + 8, 5 * 16 + 2, 5 * 16, 5 * 16, 5 * 16, 4 * 16);
    m.dynLights = () => { const t = G.t; return [0, 1, 2].map((i) => ({ x: (7.5 + Math.sin(t * 0.8 + i * 2.1) * 2.2) * 16, y: (7 + Math.cos(t * 1.1 + i) * 1.6) * 16, r: 36, c: ['#ff6ab0', '#6ad0ff', '#ffe06a'][i] })); };
    m.light(12 * 16 + 8, 4 * 16 + 8, 56, '#ff8ac0'); m.light(2 * 16 + 8, 5 * 16, 36, '#ffb0a0'); m.light(12 * 16 + 8, 8 * 16, 30, '#ffb0a0'); m.light(2 * 16, 8 * 16, 30, '#ffb0a0');
    m.pedZones.push({ x: 5, y: 5, w: 5, h: 4, n: 6, dance: true });
  } });

/* 8. El Mosquito: Bodega & Bar mit spanischen Fliesen, Fässern und Schinken */
sRoom('mosquito', { name: 'El Mosquito', sign: false, w: 14, h: 10, door: 6, back: ['sursee', 'mosquito_out'], style: 6, cap: '#4a2a1a', floor: T.STONE, music: 'lounge', ambient: 0.16, lightC: '#ffc080',
  spots: { friend1: [9, 5, 3] },
  wall: (c) => {
    R(c, 16, 16, 12 * 16, 32, '#e8c890');
    /* Azulejos im unteren Wandteil */
    for (let x = 16; x < 13 * 16; x += 8) for (let y = 32; y < 48; y += 8) { const alt = ((x + y) / 8) % 2; R(c, x, y, 8, 8, '#f4f0e6'); R(c, x, y, 8, 1, '#c8c0b0'); R(c, x, y, 1, 8, '#c8c0b0'); if (alt) { R(c, x + 3, y + 1, 2, 6, '#2f5fb8'); R(c, x + 1, y + 3, 6, 2, '#2f5fb8'); P(c, x + 4, y + 4, '#e8c23a'); } else { P(c, x + 2, y + 2, '#2f5fb8'); P(c, x + 5, y + 2, '#2f5fb8'); P(c, x + 2, y + 5, '#2f5fb8'); P(c, x + 5, y + 5, '#2f5fb8'); R(c, x + 3, y + 3, 2, 2, '#e8a02a'); } }
    srNeon(c, 'EL MOSQUITO', 20, 19, '#ffd060');
    /* Mücke als Wappentier */
    E(c, 80, 22, 2, 1, '#2a2a2e'); line(c, 78, 22, 73, 20, '#2a2a2e'); E(c, 82, 20, 3, 1, 'rgba(160,200,230,0.8)'); E(c, 79, 20, 3, 1, 'rgba(160,200,230,0.8)'); line(c, 81, 23, 83, 26, '#2a2a2e'); line(c, 79, 23, 78, 26, '#2a2a2e');
    /* Schinken an der Stange */
    R(c, 6 * 16, 17, 4 * 16, 2, '#5a3a24');
    for (let k = 0; k < 4; k++) { const hx = 6 * 16 + 6 + k * 15; line(c, hx, 19, hx, 21, '#e8dcc0'); R(c, hx - 1, 21, 2, 3, '#3a2a1a'); E(c, hx, 26, 2, 3, '#8a3a24'); E(c, hx + 1, 32, 4, 7, '#7a3020'); E(c, hx + 1, 32, 3, 6, '#9a4a2e'); E(c, hx + 2, 33, 1, 3, '#c86a4a'); R(c, hx - 2, 36, 7, 1, '#e8dcc0'); }
    srGuitar(c, 11 * 16 + 4, 19, '#c88a50', 0);
    srFrame(c, 12 * 16 - 6, 19, 12, 16, (c, x, y, w, h) => { R(c, x, y, w, h, '#e8c23a'); R(c, x, y, w, 3, '#c8302a'); R(c, x, y + h - 3, w, 3, '#c8302a'); E(c, x + 4, y + 7, 2, 2, '#1a1a1a'); line(c, x + 4, y + 9, x + 2, y + 12, '#c8302a'); line(c, x + 4, y + 9, x + 7, y + 12, '#c8302a'); });
  },
  build: (m) => {
    srTerracotta(m, 1, 3, 12, 6, '#b8683a');
    m.add(srBarrelRack(1, 3, 3));
    /* Tapas-Theke: Schälchen mit Oliven, Tortilla, Patatas bravas, Pimientos */
    m.add(srWrap(objCounter(8, 4, 5, 1, { top: '#5a3a20', front: '#3a2414', glasses: 2 }), 6, (c, W, H, e) => {
      const tap = [['#4a6a2a', '#7a9a3a'], ['#e8c870', '#d8a840'], ['#e8a050', '#c8302a'], ['#3a8a2a', '#5aa83a'], ['#f4e0b0', '#c8a070']];
      for (let k = 0; k < 5; k++) { const bx = 6 + k * 11; E(c, bx, e + 6, 4, 2, '#f4f0e6'); E(c, bx, e + 5, 3, 1, tap[k][0]); P(c, bx - 1, e + 5, tap[k][1]); P(c, bx + 1, e + 4, tap[k][1]); }
      R(c, 62, e - 2, 10, 6, '#f4f0e6'); R(c, 63, e - 1, 8, 4, '#d8ecf8'); R(c, 64, e, 6, 2, '#8a3a24');
    }));
    m.trig(8, 4, 5, 1, { label: 'Tapas und Wein', act: () => Story.shop('mosquito') });
    srNpc(m, 'mosquitobar', 'Wirt Paco', 10, 3, 0, 2701, { skin: 5, hair: 3, hairCol: 0, beard: 2, beardCol: 0, top: 1, topCol: 16, pants: 5, pantsCol: 2, hat: 0, glasses: 0, build: 1 }, () => Story.shop('mosquito'), ['note', 'dots']);
    for (const x of [9, 11]) m.add(objStool(x, 5, '#8a3a24'));
    /* Fässer als Stehtische */
    for (const [x, y] of [[3, 6], [6, 7], [11, 7]]) { m.add(srBarrelTable(x, y, (c, ty) => { srGlass(c, 4, ty - 4, '#7a1a2a'); srGlass(c, 9, ty - 3, '#e8c23a'); E(c, 8, ty, 2, 1, '#f4f0e6'); })); m.add(objStool(x - 1, y, '#5a3a24')); m.add(objStool(x + 1, y, '#5a3a24')); }
    m.add(objPlant(12, 3)); m.add(objPlant(1, 8));
    srPendants(m, [[4, 6], [10, 5], [7, 7]], '#c8a050', '#ffc080', 1);
    m.pedZones.push({ x: 2, y: 6, w: 2, h: 1, n: 1, drink: true }, { x: 10, y: 7, w: 3, h: 1, n: 1, drink: true });
  } });

/* 9. La Fuga: kleine Kaffeebar */
sRoom('lafuga', { name: 'La Fuga', sign: false, w: 11, h: 8, door: 5, back: ['sursee', 'lafuga_out'], style: 5, cap: '#2a2420', floor: T.WOOD, floorV: 3, music: 'lounge', lightC: '#ffe0b0',
  spots: { friend1: [2, 5, 3] },
  wall: (c) => {
    R(c, 16, 16, 9 * 16, 32, '#3a2a22'); for (let x = 16; x < 10 * 16; x += 8) R(c, x, 16, 1, 32, '#2e2018');
    pxText(c, 'LA FUGA', 20, 20, '#f4e8c0', 1); R(c, 20, 27, 27, 1, '#c8a070');
    E(c, 54, 22, 4, 3, '#f4f0e6'); R(c, 50, 22, 9, 4, '#f4f0e6'); R(c, 59, 22, 2, 2, '#f4f0e6'); for (let k = 0; k < 3; k++) line(c, 52 + k * 2, 19, 53 + k * 2, 16, 'rgba(255,255,255,0.5)');
    srChalk(c, 6 * 16 + 2, 18, 40, 26, 4, 'ESPRESSO');
    srFrame(c, 4 * 16 + 4, 26, 16, 18, (c, x, y, w, h) => { R(c, x, y, w, h, '#e8d8b8'); R(c, x + 4, y + 8, 5, 6, '#8a8e94'); R(c, x + 5, y + 3, 3, 5, '#a8acb2'); R(c, x + 3, y + 7, 7, 1, '#5a5e64'); R(c, x + 9, y + 4, 2, 4, '#2a2a2e'); P(c, x + 6, y + 2, '#2a2a2e'); for (let k = 0; k < 3; k++) P(c, x + 5 + k, y - 0 + k % 2, '#ffffff'); });
  },
  build: (m) => {
    m.add(srWrap(objCounter(1, 4, 5, 1, { top: '#c8a070', front: '#3a2a22', reg: false }), 14, (c, W, H, e) => {
      srEspresso(c, 3, e - 10, true);
      R(c, 36, e - 8, 8, 6, '#2a2a2e'); E(c, 40, e - 10, 4, 3, '#6a3a20'); E(c, 40, e - 11, 3, 2, '#8a5a30'); R(c, 38, e - 2, 4, 6, '#3a3a3e');
      R(c, 66, e - 4, 10, 7, '#3a3c42'); R(c, 67, e - 3, 8, 2, '#7ad07a'); R(c, 50, e + 1, 8, 5, '#f4f0e6'); R(c, 51, e + 2, 6, 1, '#c8a070');
    }));
    m.trig(1, 4, 5, 1, { label: 'Kaffee bestellen', act: () => Story.shop('lafuga') });
    srNpc(m, 'fugabar', 'Barista Matteo', 3, 3, 0, 2801, { hair: 15, hairCol: 0, beard: 7, beardCol: 0, top: 0, topCol: 16, pants: 0, pantsCol: 2, hat: 0, glasses: 0 }, () => Story.shop('lafuga'), ['note', 'dots']);
    for (const x of [1, 2, 3, 4]) m.add(objStool(x, 5, '#c8a070'));
    m.add(srSacks(8, 3, 2)); m.add(srSacks(9, 5, 1));
    m.add(srWrap(objTable(7, 5, 1, 1, { col: '#3a2a22', round: true }), 4, (c, W, H, e) => { R(c, 5, e + 2, 4, 3, '#f4f4f0'); P(c, 6, e + 1, '#6a4428'); }));
    m.add(objStool(6, 5, '#3a2a22'));
    m.add(objPlant(9, 6));
    srPendants(m, [[7, 5], [4, 6]], '#c8a050', '#ffe0b0', 1);
  } });

/* 10. Craftwerk: Craft-Beer-Bar mit Zapfhahnwand */
sRoom('craftwerk', { name: 'Craftwerk', sign: false, w: 16, h: 11, door: 7, back: ['sursee', 'craftwerk_out'], style: 1, cap: '#22201e', floor: T.STONE, floorV: 1, music: 'bar', ambient: 0.2, light: false,
  spots: { friend1: [6, 6, 3], friend2: [3, 7, 0] },
  wall: (c) => {
    srNeon(c, 'CRAFTWERK', 19, 18, '#7ad0f0');
    srChalk(c, 18, 26, 44, 21, 4, 'HEUTE');
    srTapWall(c, 5 * 16 - 4, 22, 8 * 16 + 4, 16);
    R(c, 5 * 16 - 4, 17, 8 * 16 + 4, 3, '#5a3a24'); pxText(c, '16 ZAPFHÄHNE', 7 * 16 - 2, 17, '#f4e8c0');
    for (let k = 0; k < 4; k++) R(c, 14 * 16 + 1 + k * 3, 20, 2, 26, '#8a6a4a');
  },
  build: (m) => {
    m.decal((c) => { R(c, 16, 48, 14 * 16, 7 * 16, 'rgba(120,120,116,0.55)'); for (let i = 0; i < 160; i++) P(c, 16 + hash(i, 1) * 14 * 16, 48 + hash(i, 2) * 7 * 16, i % 2 ? '#9a9a94' : '#6a6a66'); R(c, 16, 48, 14 * 16, 3, 'rgba(0,0,0,0.2)'); });
    m.add(objCounter(5, 5, 8, 1, { top: '#6a4a2a', front: '#3a3a3e', glasses: 4 }));
    m.decal((c) => { for (let k = 0; k < 8; k++) R(c, 5 * 16 + 2 + k * 16, 6 * 16 - 7, 12, 5, k % 2 ? '#8a6a4a' : '#7a5a3a'); });
    m.trig(5, 5, 8, 1, { label: 'Craft Beer bestellen', act: () => Story.shop('craftwerk') });
    srNpc(m, 'craftbar', 'Brauer Jonas', 9, 4, 0, 2901, { hair: 9, hairCol: 3, beard: 8, beardCol: 3, top: 7, topCol: 0, pants: 0, pantsCol: 0, hat: 3, hatCol: 3, glasses: 6 }, () => Story.shop('craftwerk'), ['beer', 'note']);
    for (const x of [6, 8, 10, 12]) m.add(objStool(x, 6, '#3a3a3e'));
    m.add(srKegs(14, 3)); m.add(srKegs(1, 4)); m.add(srKegs(14, 5));
    /* Lange Tische aus Paletten */
    for (const [x, y] of [[2, 8], [9, 8]]) { m.add(srWrap(objTable(x, y, 4, 1, { col: '#a8845a' }), 4, (c, W, H, e) => { for (let k = 0; k < 4; k++) srGlass(c, 6 + k * 15, e + 2 + (k % 2), ['#e8b33a', '#3a1a10', '#d88a2a', '#f0d070'][k]); R(c, 30, e + 3, 6, 4, '#e8c890'); })); for (let k = 0; k < 4; k++) { m.add(objStool(x + k, y - 1, '#5a5e64')); m.add(objStool(x + k, y + 1, '#5a5e64')); } }
    m.add(objPlant(1, 6));
    srPendants(m, [[3, 8], [5, 8], [10, 8], [12, 8], [7, 6], [11, 6]], '#2a2c30', '#ffd27a', 0);
    m.light(9 * 16, 4 * 16, 60, '#fff0c0'); m.light(2 * 16, 2 * 16 + 8, 30, '#7ad0f0');
    m.pedZones.push({ x: 9, y: 7, w: 4, h: 1, n: 2, sit: true }, { x: 2, y: 9, w: 4, h: 1, n: 1, sit: true });
  } });

/* ---------- Helfer für Einkaufszentrum, Theater, Museum und Konzertsäle ---------- */
/* Kühlregal mit Glastüren (Milchprodukte) */
function srFridge(x, y, w) {
  return mkObj(x, y, w, 1, 18, (c, W, H) => {
    R(c, 0, 0, W, H - 1, '#c9ccd2'); R(c, 0, 0, W, 3, '#e8eaee'); R(c, 2, 4, W - 4, H - 8, '#a8d4ec');
    for (let r = 0; r < 3; r++) { const ry = 6 + r * 7; R(c, 2, ry + 5, W - 4, 1, '#e8eaee'); for (let k = 4; k < W - 5; k += 5) R(c, k, ry, 4, 5, ['#f4f4f0', '#3a8ae0', '#e8c23a', '#f4f4f0', '#3fae4a', '#e8402e'][(k / 5 + r) % 6 | 0]); }
    for (let k = 16; k < W; k += 16) R(c, k - 1, 4, 2, H - 8, '#c9ccd2');
    c.fillStyle = 'rgba(255,255,255,0.2)'; c.fillRect(2, 4, W - 4, H - 8); R(c, 0, H - 4, W, 3, '#5a5e64');
  });
}
/* Gemüse- und Früchtestand mit grünen Harassen */
function srProduce(x, y, w) {
  return mkObj(x, y, w, 1, 10, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 1, 2, 'rgba(0,0,0,0.2)');
    R(c, 0, 6, W, H - 8, '#8a6a4a'); R(c, 0, 6, W, 1, '#a88a6a');
    const fr = [['#e8402e', '#c8302a'], ['#f2c23a', '#d8a020'], ['#3fae4a', '#2f8a3a'], ['#e87a2a', '#c85a1a'], ['#9a4a8a', '#7a2a6a'], ['#c8e04a', '#9ab83a']];
    for (let k = 0; k < Math.floor(W / 11); k++) { const bx = 1 + k * 11; R(c, bx, 2, 10, 9, '#3a8a4a'); R(c, bx, 2, 10, 1, '#5aaa6a'); for (let i = 0; i < 7; i++) E(c, bx + 2 + (i % 3) * 3, 3 + Math.floor(i / 3) * 2, 1, 1, fr[k % fr.length][i % 2]); R(c, bx + 2, 12, 6, 3, '#f4f0e6'); R(c, bx + 3, 13, 3, 1, '#c8302a'); }
  });
}
/* Kasse mit Förderband */
function srCheckout(x, y, w) {
  return mkObj(x, y, w, 1, 8, (c, W, H) => {
    R(c, 0, 2, W, H - 4, '#c9ccd2'); R(c, 0, 2, W, 2, '#e8eaee'); R(c, 2, 5, W - 16, 5, '#2a2a2e'); for (let k = 4; k < W - 16; k += 4) R(c, k, 5, 1, 5, '#3a3a3e');
    R(c, W - 13, 0, 10, 7, '#3a3c42'); R(c, W - 12, 1, 8, 3, '#7ad07a'); R(c, W - 14, H - 6, 12, 3, '#ff7a1a'); R(c, 0, H - 4, W, 2, '#ff7a1a');
  });
}
/* Fernsehwand mit laufenden Bildern */
function srTVWall(x, y, w) {
  const o = mkObj(x, y, w, 1, 26, (c, W, H) => { R(c, 0, H - 14, W, 13, '#2a2a2e'); R(c, 0, H - 14, W, 1, '#5a5e64'); for (let k = 0; k < w; k++) for (let r = 0; r < 2; r++) { R(c, 1 + k * 16, r * 13, 14, 12, '#141418'); } });
  o.anim = (c, t, px, py) => {
    for (let k = 0; k < w; k++) for (let r = 0; r < 2; r++) {
      const sx = px + 2 + k * 16, sy = py + 1 + r * 13, mode = (k + r * 2 + Math.floor(t / 4)) % 4;
      if (mode === 0) { R(c, sx, sy, 12, 10, '#3f9a4a'); R(c, sx + 5, sy, 1, 10, '#e8f0e8'); P(c, sx + 2 + Math.floor((t * 6) % 9), sy + 3 + Math.floor(Math.sin(t * 3) * 2 + 2), '#ffffff'); }
      else if (mode === 1) { for (let i = 0; i < 6; i++) R(c, sx + i * 2, sy, 2, 10, ['#f4f4f0', '#e8e040', '#40d0e0', '#40d040', '#e040e0', '#e04040'][i]); }
      else if (mode === 2) { R(c, sx, sy, 12, 6, '#7ab8e8'); R(c, sx, sy + 6, 12, 4, '#4f8a3a'); for (let i = 0; i < 12; i++) R(c, sx + i, sy + 4 - Math.round(Math.abs(Math.sin(i * 0.6 + k)) * 3), 1, 2, '#8a8e94'); E(c, sx + 3 + (t * 2) % 7, sy + 2, 1, 1, '#ffffff'); }
      else { R(c, sx, sy, 12, 10, '#2a2a4a'); E(c, sx + 6, sy + 5, 3 + Math.sin(t * 4) * 1, 3, '#e8a0c0'); }
    }
  };
  return o;
}
/* Rolltreppe: Stufen laufen nach oben */
function srEscalator(x, y) {
  const o = mkObj(x, y, 2, 3, 20, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2, 3, 'rgba(0,0,0,0.25)');
    R(c, 0, 0, W, H - 2, '#8a8e94'); R(c, 3, 2, W - 6, H - 8, '#3a3c42'); R(c, 0, 0, 3, H - 2, '#c9ccd2'); R(c, W - 3, 0, 3, H - 2, '#c9ccd2'); R(c, 0, 0, 3, 2, '#1a1a1a'); R(c, W - 3, 0, 3, 2, '#1a1a1a');
    R(c, 1, 0, 1, H - 2, '#1a1a1a'); R(c, W - 2, 0, 1, H - 2, '#1a1a1a'); R(c, 4, H - 6, W - 8, 4, '#e8c23a');
  });
  o.anim = (c, t, px, py) => { c.save(); c.beginPath(); c.rect(px + 3, py + 2, 26, 60); c.clip(); for (let k = -1; k < 13; k++) { const yy = py + 2 + ((k * 5 - t * 14) % 65 + 65) % 65; R(c, px + 3, yy, 26, 1, '#9aa0a6'); R(c, px + 3, yy + 1, 26, 1, '#5a5e64'); } c.restore(); R(c, px + 13, py - 4, 6, 4, '#2f8a3a'); P(c, px + 15, py - 3, '#ffffff'); P(c, px + 16, py - 3, '#ffffff'); P(c, px + 14, py - 2, '#ffffff'); P(c, px + 17, py - 2, '#ffffff'); };
  return o;
}
/* Christbaum mit blinkenden Lichtern */
function srXmasTree(x, y) {
  const o = mkObj(x, y, 2, 1, 38, (c, W, H) => {
    E(c, W / 2, H - 2, 12, 3, 'rgba(0,0,0,0.25)'); R(c, W / 2 - 6, H - 8, 12, 7, '#c8302a'); R(c, W / 2 - 6, H - 8, 12, 1, '#e85a4a'); R(c, W / 2 - 1, H - 12, 2, 4, '#5a3a24');
    for (let i = 0; i < 4; i++) { const top = 4 + i * 10, wB = 5 + i * 3.5; for (let k = 0; k < 12; k++) { const ww = Math.round(wB * (k / 11)); R(c, W / 2 - ww, top + k, ww * 2 + 1, 1, k > 9 ? '#1f4a2a' : '#2e6a38'); } }
    for (let i = 0; i < 9; i++) E(c, W / 2 - 10 + (hash(i, 7) * 20 | 0), 14 + (hash(i, 8) * 30 | 0), 1, 1, ['#e8402e', '#e8c23a', '#3a8ae0'][i % 3]);
    for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283 - 1.571; line(c, W / 2, 3, W / 2 + Math.cos(a) * 3, 3 + Math.sin(a) * 3, '#f2d050'); }
  });
  o.anim = (c, t, px, py) => { for (let i = 0; i < 12; i++) { if (Math.sin(t * 3 + i * 1.9) < 0) continue; P(c, px + 16 - 12 + (hash(i, 3) * 24 | 0), py + 10 + (hash(i, 4) * 36 | 0), ['#fff0a0', '#ffd0e8', '#d0f0ff'][i % 3]); } };
  o.light = { dx: 16, dy: 26, r: 40, c: '#ffe0a0' };
  return o;
}
function srATM(x, y) {
  return mkObj(x, y, 1, 1, 18, (c, W, H) => { E(c, 8, H - 2, 6, 1, 'rgba(0,0,0,0.25)'); R(c, 1, 0, 14, H - 2, '#5a5e64'); R(c, 1, 0, 14, 5, '#c8302a'); R(c, 5, 1, 6, 3, '#f4f4f0'); R(c, 5, 2, 6, 1, '#2f5fb8'); R(c, 3, 6, 10, 7, '#1a2a3a'); R(c, 4, 7, 8, 5, '#3a8ae0'); R(c, 3, 15, 10, 5, '#8a8e94'); for (let k = 0; k < 3; k++) R(c, 4 + k * 3, 16, 2, 3, '#e8eaee'); R(c, 4, 22, 8, 1, '#1a1a1a'); R(c, 1, H - 4, 14, 2, '#3a3c42'); }, { emit: (c) => R(c, 4, 7, 8, 5, '#6ab0ff') });
}
/* Theatersessel-Reihe (begehbar) */
function srSeatRow(x, y, w, col = '#9a1a2a') {
  return mkObj(x, y, w, 1, 6, (c, W, H) => { for (let k = 0; k < w; k++) { const sx = k * 16 + 2; R(c, sx, H - 18, 12, 9, shade(col, -0.2)); R(c, sx + 1, H - 17, 10, 2, shade(col, 0.15)); R(c, sx, H - 9, 12, 5, col); R(c, sx - 1, H - 12, 2, 8, '#3a2a20'); R(c, sx + 11, H - 12, 2, 8, '#3a2a20'); P(c, sx + 5, H - 16, '#e8c23a'); } }, { solid: false });
}
/* Kostümpuppe der Zunft: roter Mantel, Larve, Hut */
function srZunftDummy(x, y, mask = '#e8c890', hat = '#1a1a1a') {
  return mkObj(x, y, 1, 1, 24, (c, W, H) => { E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 5, H - 4, 6, 3, '#3a2a1a'); R(c, 7, H - 10, 2, 7, '#8a8e94'); R(c, 3, 9, 10, H - 18, '#b02a2a'); R(c, 3, 9, 1, H - 18, '#7a1a1a'); R(c, 3, H - 10, 10, 1, '#e8c84a'); R(c, 6, 9, 4, 2, '#f4f0e6'); srLarve(c, 2, -1, mask, 0); R(c, 3, 0, 10, 2, hat); R(c, 5, -3, 6, 3, hat); }, { solid: true });
}
/* Theatermasken Komödie und Tragödie */
function srTheaterMasks(c, px, py) {
  E(c, px + 5, py + 6, 5, 6, '#f2d050'); R(c, px + 2, py + 4, 2, 2, '#1a1a1a'); R(c, px + 6, py + 4, 2, 2, '#1a1a1a'); for (let i = 0; i < 5; i++) P(c, px + 3 + i, py + 9 + (i === 0 || i === 4 ? 0 : 1), '#1a1a1a');
  E(c, px + 13, py + 9, 5, 6, '#e8e4dc'); R(c, px + 10, py + 7, 2, 2, '#1a1a1a'); R(c, px + 14, py + 7, 2, 2, '#1a1a1a'); for (let i = 0; i < 5; i++) P(c, px + 11 + i, py + 13 - (i === 0 || i === 4 ? 0 : 1), '#1a1a1a');
  line(c, px + 4, py + 12, px + 2, py + 16, '#c8302a'); line(c, px + 14, py + 15, px + 17, py + 18, '#2f5fb8');
}
/* Bühnenscheinwerfer-Strahlen von einer Traverse (im postOverlay, additiv) */
function srBeams(m, y0, xs, cols, spread = 120, len = 150, alpha = 0.1) {
  srOver(m, (c, cx, cy, t) => {
    c.globalCompositeOperation = 'lighter';
    xs.forEach((x, i) => {
      const a = Math.sin(t * (0.7 + i * 0.13) + i * 1.7) * 0.6, ox = x - cx, oy = y0 - cy, tx = ox + Math.sin(a) * spread, ty = oy + len;
      c.fillStyle = rgba(cols[i % cols.length], alpha); c.beginPath(); c.moveTo(ox - 2, oy); c.lineTo(ox + 2, oy); c.lineTo(tx + 18, ty); c.lineTo(tx - 18, ty); c.closePath(); c.fill();
      c.fillStyle = rgba(cols[i % cols.length], alpha * 1.6); c.beginPath(); c.ellipse(tx, ty, 18, 6, 0, 0, 6.283); c.fill();
    });
    c.globalCompositeOperation = 'source-over';
  }, true);
}
/* Traverse mit farbigen Scheinwerfern (Overlay über den Figuren) */
function srTruss(m, x0, x1, y, cols) {
  srOver(m, (c, cx, cy, t) => {
    const px0 = x0 - cx, px1 = x1 - cx, py = y - cy;
    R(c, px0, py, px1 - px0, 1, '#9aa0a6'); R(c, px0, py + 5, px1 - px0, 1, '#9aa0a6'); for (let x = px0; x < px1; x += 6) { line(c, x, py, x + 3, py + 5, '#7a7e84'); line(c, x + 3, py + 5, x + 6, py, '#7a7e84'); }
    for (let k = 0; k < cols.length; k++) { const lx = px0 + 12 + k * ((px1 - px0 - 24) / Math.max(1, cols.length - 1)); R(c, lx - 3, py + 6, 6, 5, '#2a2a2e'); const on = Math.sin(t * 2.3 + k * 1.3) > -0.6; E(c, lx, py + 11, 2, 1, on ? '#fff8e0' : '#5a5a5a'); if (on) P(c, lx, py + 12, cols[k]); }
  });
}
/* Kleines Schlagzeug (wird vor dem Schlagzeuger gezeichnet) */
function srDrumKit(x, y) {
  return mkObj(x, y, 3, 1, 10, (c, W, H) => {
    E(c, W / 2, H - 4, 12, 4, '#8a8e94'); E(c, W / 2, H - 5, 11, 3, '#c8302a'); E(c, W / 2, H - 6, 6, 4, '#f4f0e6'); E(c, W / 2, H - 6, 4, 3, '#e8e4dc'); pxText(c, 'X', W / 2 - 1, H - 8, '#c8302a');
    for (const [dx, dy, r] of [[-12, -10, 4], [12, -10, 4], [-6, -14, 3], [6, -14, 3]]) { E(c, W / 2 + dx, H + dy, r, r - 1, '#e8e4dc'); E(c, W / 2 + dx, H + dy + 1, r, 1, '#c8302a'); }
    for (const dx of [-18, 18]) { R(c, W / 2 + dx, H - 18, 1, 14, '#8a8e94'); E(c, W / 2 + dx, H - 18, 5, 1, '#e8c23a'); }
  }, { solid: false, sortOff: -26 });
}
function srMic(x, y, dx = 12) {
  return mkObj(x, y, 1, 1, 12, (c, W, H) => { R(c, dx, H - 22, 1, 20, '#5a5e64'); R(c, dx - 3, H - 2, 7, 1, '#3a3a3e'); line(c, dx, H - 22, dx - 4, H - 25, '#5a5e64'); R(c, dx - 6, H - 27, 3, 3, '#2a2a2e'); }, { solid: false, sortOff: -26 });
}

/* 11. Surseepark: Einkaufszentrum mit Migros, Restaurant, Sport, Elektro, Kiosk */
sRoom('surseepark', { name: 'Surseepark', sign: false, w: 30, h: 15, door: 14, back: ['sursee', 'surseepark_out'], style: 5, cap: '#5a5e64', floor: T.PLAZA, floorV: 0, lightC: '#fffaf0', lightR: 80,
  spots: { friend1: [18, 12, 0] },
  wall: (c) => {
    /* Migros */
    R(c, 18, 17, 14, 14, '#ff7a1a'); pxText(c, 'M', 21, 19, '#ffffff', 2); pxText(c, 'MIGROS', 36, 19, '#ff7a1a', 2);
    /* Migros-Restaurant mit Menütafeln */
    pxText(c, 'MIGROS RESTAURANT', 11 * 16 + 2, 18, '#ff7a1a');
    for (let k = 0; k < 3; k++) { const bx = 11 * 16 + 4 + k * 32; R(c, bx, 25, 26, 15, '#2a2c30'); R(c, bx + 2, 27, 10, 6, ['#e8a050', '#7ab04a', '#e8d070'][k]); for (let l = 0; l < 3; l++) R(c, bx + 14, 27 + l * 4, 9, 1, '#f4f4f0'); R(c, bx + 2, 35, 14, 1, '#f4f4f0'); }
    /* Sport */
    pxText(c, 'SPORT SURSEE', 19 * 16 + 2, 18, '#2f5fb8'); R(c, 19 * 16 + 2, 24, 47, 1, '#2f5fb8');
    for (let k = 0; k < 6; k++) { const rx = 19 * 16 + 4 + k * 5; line(c, rx, 27, rx + 1, 46, '#3a3a3e'); P(c, rx + 1, 27, '#c8302a'); E(c, rx + 1, 40, 1, 1, '#c9ccd2'); }
    /* Elektro */
    R(c, 25 * 16, 16, 4 * 16, 6, '#1a3a8a'); pxText(c, 'ELEKTRO', 25 * 16 + 18, 16, '#ffffff');
    /* Säulen zwischen den Läden */
    for (const x of [10, 18, 24]) { R(c, x * 16 + 2, 16, 12, 32, '#e8eaee'); R(c, x * 16 + 2, 16, 2, 32, '#ffffff'); R(c, x * 16 + 12, 16, 2, 32, '#c9ccd2'); }
  },
  build: (m) => {
    m.fill(1, 3, 9, 7, T.STONE, 2); m.fill(19, 3, 5, 7, T.WOOD, 2); m.fill(25, 3, 4, 7, T.CARPET, 2);
    m.decal((c) => {
      R(c, 16, 10 * 16 - 2, 28 * 16, 2, '#c9ccd2'); R(c, 16, 48, 28 * 16, 3, 'rgba(0,0,0,0.12)');
      for (let x = 2; x < 28; x += 4) { E(c, x * 16 + 8, 11 * 16 + 8, 10, 4, 'rgba(255,255,255,0.25)'); }
    });
    /* Säulen als Ladentrennung */
    for (const x of [10, 18, 24]) m.add(mkObj(x, 3, 1, 6, 0, (c, W, H) => { R(c, 2, 0, 12, H, '#e8eaee'); R(c, 2, 0, 2, H, '#ffffff'); R(c, 12, 0, 2, H, '#c9ccd2'); R(c, 2, H - 3, 12, 3, '#9aa0a6'); }));
    /* Migros: Kühlregal, Brot, Regale, Früchte und Gemüse, zwei Kassen */
    m.add(srFridge(1, 3, 5));
    m.add(mkObj(6, 3, 4, 1, 16, (c, W, H) => { R(c, 0, 0, W, H - 1, '#8a5a32'); for (const ry of [3, 13]) { R(c, 1, ry + 7, W - 2, 2, '#a8784a'); for (let k = 0; k < W - 10; k += 10) drawLoaf(c, k + 2, ry, ['ruch', 'zopf', 'baguette', 'weggli', 'brezel', 'ruch'][(k / 10 + ry) % 6 | 0]); } }));
    m.add(shelfRow(1, 5, 4, ['#ff7a1a', '#e8c23a', '#c8352d', '#f4f0e6', '#2f5fb8']));
    m.add(shelfRow(6, 5, 4, ['#3f8e4b', '#f4f0e6', '#e8c23a', '#7a3a1a', '#ff7a1a']));
    m.add(srProduce(1, 7, 4)); m.add(shelfRow(6, 7, 4, ['#c8352d', '#2f5fb8', '#f4f0e6', '#e8c23a'], '#8a9096'));
    m.add(srCheckout(2, 9, 2)); m.add(srCheckout(6, 9, 2));
    m.decal((c) => { R(c, 6 * 16 + 4, 9 * 16 - 10, 24, 7, '#f4f4f0'); pxText(c, 'ZU', 6 * 16 + 12, 9 * 16 - 9, '#c8302a'); });
    m.trig(2, 9, 2, 1, { label: 'Migros: Kasse', act: () => Story.shop('migros') });
    srNpc(m, 'migroskasse', 'Kassiererin Sandra', 3, 8, 0, 3101, { hair: 16, hairCol: 5, beard: 0, top: 2, topCol: 2, pants: 0, pantsCol: 2, hat: 0, glasses: 0 }, () => Story.shop('migros'), ['dots']);
    m.pedZones.push({ x: 1, y: 4, w: 9, h: 1, n: 2 }, { x: 1, y: 6, w: 9, h: 1, n: 1 });
    /* Migros-Restaurant */
    m.add(srWrap(objCounter(11, 4, 5, 1, { top: '#d9dcdf', front: '#ff7a1a', reg: true }), 6, (c, W, H, e) => { R(c, 18, e - 2, 40, 8, '#f4f4f0'); R(c, 19, e - 1, 38, 5, '#d8ecf8'); for (let k = 0; k < 5; k++) E(c, 23 + k * 7, e + 2, 2, 1, ['#7ab04a', '#e8a050', '#c8302a', '#e8d070', '#8a5a32'][k]); for (let k = 0; k < 3; k++) R(c, 62 + k * 4, e + 1, 3, 4, '#c9ccd2'); }));
    m.trig(11, 4, 5, 1, { label: 'Migros-Restaurant', act: () => Story.shop('migrosresto') });
    srNpc(m, 'migrosresto', 'Köchin Gabi', 13, 3, 0, 3102, { hair: 9, hairCol: 2, beard: 0, top: 0, topCol: 13, pants: 0, pantsCol: 2, hat: 3, hatCol: 6, glasses: 0 }, () => Story.shop('migrosresto'), ['note']);
    m.add(mkObj(16, 3, 1, 1, 18, (c, W, H) => { R(c, 2, 0, 12, H - 2, '#8a8e94'); for (let k = 0; k < 6; k++) R(c, 3, 2 + k * 4, 10, 2, k % 2 ? '#ff7a1a' : '#e8e4dc'); }));
    srTableLR(m, 12, 6, 2, { col: '#f4f4f0', items: 2 }, '#ff7a1a'); srTableLR(m, 12, 8, 2, { col: '#f4f4f0', items: 1 }, '#ff7a1a');
    m.add(objTable(16, 7, 1, 1, { col: '#f4f4f0', round: true })); m.add(objChair(17, 7, 1, '#ff7a1a'));
    m.pedZones.push({ x: 11, y: 6, w: 4, h: 3, n: 2, sit: true });
    /* Sport Sursee: Fischerruten, Neoprenanzüge, Velohelme, Velo */
    m.add(mkObj(19, 3, 2, 1, 14, (c, W, H) => { R(c, 0, 4, W, H - 5, '#5a3a24'); for (const ry of [6, 16]) R(c, 1, ry + 6, W - 2, 2, '#8a5a34'); for (let k = 0; k < 4; k++) for (let r = 0; r < 2; r++) { const hx = 4 + k * 7, hy = 8 + r * 10; E(c, hx + 2, hy + 2, 3, 3, ['#c8302a', '#2f5fb8', '#e8c23a', '#3fae4a', '#1a1a1a', '#f4f4f0', '#e87a2a', '#9a5ae0'][k + r * 4]); R(c, hx - 1, hy + 4, 7, 1, '#1a1a1a'); P(c, hx + 1, hy, '#ffffff'); } }));
    m.add(rackRow(21, 3, 3, ['#1a1a1e', '#2f5fb8', '#1a1a1e', '#3a3a48']));
    m.add(mkObj(19, 5, 2, 1, 10, (c, W, H) => { const y = H - 8; E(c, 6, y, 5, 5, '#1a1a1e'); E(c, 6, y, 3, 3, '#c9ccd2'); E(c, W - 7, y, 5, 5, '#1a1a1e'); E(c, W - 7, y, 3, 3, '#c9ccd2'); line(c, 6, y, 14, y - 6, '#c8302a'); line(c, 14, y - 6, W - 7, y, '#c8302a'); line(c, 14, y - 6, 20, y - 6, '#c8302a'); line(c, 20, y - 6, W - 7, y, '#c8302a'); line(c, 13, y - 9, 14, y - 6, '#1a1a1a'); R(c, 11, y - 10, 5, 2, '#1a1a1a'); line(c, 20, y - 6, 21, y - 9, '#1a1a1a'); R(c, 19, y - 10, 5, 1, '#1a1a1a'); }));
    m.add(objCounter(20, 8, 3, 1, { top: '#c9ccd2', front: '#2f5fb8', reg: true }));
    m.trig(20, 8, 3, 1, { label: 'Sport Sursee', act: () => Story.shop('sportsursee') });
    srNpc(m, 'sportsursee', 'Verkäufer Reto', 21, 7, 0, 3103, { hair: 2, hairCol: 4, beard: 1, beardCol: 4, top: 10, topCol: 9, pants: 4, pantsCol: 2, hat: 0, glasses: 5 }, () => Story.shop('sportsursee'), ['dots', '!']);
    /* Elektro: Fernsehwand, Theke */
    m.add(srTVWall(25, 3, 4));
    m.add(srWrap(objCounter(25, 7, 3, 1, { top: '#2a2c30', front: '#1a3a8a', reg: true }), 4, (c) => { R(c, 22, 2, 10, 6, '#3a3c42'); R(c, 23, 3, 8, 4, '#7ab0f0'); R(c, 36, 4, 4, 6, '#1a1a1e'); R(c, 37, 5, 2, 4, '#4a8ae0'); }));
    m.trig(25, 7, 3, 1, { label: 'Elektro', act: () => Story.shop('elektro') });
    srNpc(m, 'elektro', 'Verkäufer Dario', 26, 6, 0, 3104, { hair: 4, hairCol: 0, beard: 0, top: 2, topCol: 9, pants: 1, pantsCol: 2, hat: 0, glasses: 2 }, () => Story.shop('elektro'), ['dots']);
    /* Mall: Kiosk, Bankomat, Rolltreppe, Christbaum, Bänke, Pflanzen */
    m.add(objKiosk(1, 11, 'KIOSK', '#d8302a'));
    m.trig(1, 11, 3, 2, { label: 'Kiosk', act: () => Story.shop('kiosk_sursee') });
    m.add(srATM(9, 10)); m.trig(9, 10, 1, 1, { label: 'Bankomat', act: () => Sur.atm() });
    m.add(srEscalator(25, 11));
    m.add(srXmasTree(20, 11));
    m.add(objBench(17, 13, 0, '#c8a070')); m.add(objBench(6, 13, 0, '#c8a070')); m.add(objBench(22, 13, 0, '#c8a070'));
    for (const [x, y] of [[5, 11], [12, 13], [17, 11], [28, 13]]) m.add(objPlant(x, y));
    m.pedZones.push({ x: 1, y: 10, w: 28, h: 4, n: 8 }, { x: 19, y: 4, w: 5, h: 3, n: 1 }, { x: 25, y: 4, w: 4, h: 2, n: 1 });
    m.light(5 * 16, 6 * 16, 80, '#fffaf0'); m.light(24 * 16, 6 * 16, 80, '#fffaf0');
  } });

/* 12. Stadttheater Sursee (beim Obertor): Bühne, Zuschauerreihen, Foyer mit Kasse, Fundus hinter der Bühne */
sRoom('theater', { name: 'Stadttheater Sursee', sign: false, w: 20, h: 13, door: 12, back: ['sursee', 'theater_out'], style: 0, cap: '#3a1a1a', floor: T.WOOD, floorV: 3, lightC: '#ffe0a0', light: false,
  spots: { friend1: [14, 9, 3] },
  wall: (c) => {
    /* Fundus: Hutregal und Perücken */
    pxText(c, 'FUNDUS', 20, 19, '#6a3a1a');
    R(c, 48, 27, 58, 2, '#6a4428'); for (let k = 0; k < 4; k++) { const hx = 52 + k * 14, hc = ['#1a1a1a', '#c8302a', '#3a6a3a', '#5a3a8a'][k]; R(c, hx, 22, 8, 5, hc); R(c, hx - 2, 26, 12, 1, hc); if (k === 1) { R(c, hx + 6, 19, 1, 4, '#f4f0e6'); } }
    /* Bühnenvorhang (roter Samt) */
    for (let x = 8 * 16; x < 19 * 16; x++) { const f = Math.sin(x * 0.45) * 0.5 + 0.5; R(c, x, 16, 1, 32, shade('#9a1a24', (f - 0.5) * 0.55)); }
    R(c, 8 * 16, 16, 11 * 16, 4, '#c9a65a'); for (let x = 8 * 16; x < 19 * 16; x += 4) R(c, x + 1, 20, 2, 2, '#e8c870');
    c.fillStyle = '#1a0a0a'; c.beginPath(); c.moveTo(12 * 16, 48); c.lineTo(15 * 16, 48); c.lineTo(14 * 16 + 4, 22); c.lineTo(12 * 16 + 12, 22); c.closePath(); c.fill();
    R(c, 9 * 16, 22, 4, 26, '#c9a65a'); R(c, 18 * 16 - 4, 22, 4, 26, '#c9a65a');
  },
  build: (m) => {
    /* Trennwand Fundus | Theater, Durchgang unten */
    for (let y = 3; y < 12; y++) if (y !== 9 && y !== 10) m.set(7, y, T.WALL);
    m.fill(1, 3, 6, 9, T.WOOD, 1);
    /* Bühne mit Rampenlicht */
    const stage = mkObj(8, 3, 11, 2, 2, (c, W, H) => { R(c, 0, 0, W, H - 6, '#5a3a24'); E(c, W / 2, 12, 22, 7, '#6a4a30'); for (let k = 0; k < W; k += 12) R(c, k, 0, 1, H - 6, '#4a2a18'); R(c, W / 2 - 1, 4, 3, 10, '#5a5e64'); R(c, W / 2 - 4, 14, 9, 1, '#3a3a3e'); R(c, W / 2 - 1, 2, 3, 3, '#2a2a2e'); R(c, 0, H - 8, W, 2, '#7a5232'); R(c, 0, H - 6, W, 6, '#2a1a10'); }, { solid: true });
    stage.anim = (c, t, px, py) => { for (let k = 6; k < 176 - 4; k += 14) { const f = Math.sin(t * 2 + k) > -0.95; E(c, px + k, py + 28, 2, 1, f ? '#fff0b0' : '#8a7a50'); } };
    m.add(stage);
    m.light(13 * 16 + 8, 4 * 16, 70, '#ffe0a0');
    /* Zuschauerreihen */
    for (const y of [6, 7]) m.add(srSeatRow(9, y, 9));
    /* Foyer: roter Teppich, Kasse, Plakatständer */
    m.fill(12, 8, 2, 4, T.CARPET, 0);
    m.add(objCounter(15, 10, 3, 1, { top: '#5a3a24', front: '#8a1a24', reg: true }));
    m.add(mkObj(15, 9, 3, 1, 0, () => {}, { solid: false }));
    srNpc(m, 'theaterkasse', 'Kassiererin Vreni', 16, 9, 0, 3201, { hair: 12, hairCol: 9, beard: 0, top: 4, topCol: 1, pants: 5, pantsCol: 2, glasses: 7, hat: 0 }, null, ['dots']);
    m.add(mkObj(9, 10, 1, 1, 20, (c, W, H) => { line(c, 3, H - 2, 7, 4, '#5a3a24'); line(c, 13, H - 2, 9, 4, '#5a3a24'); R(c, 2, 2, 12, 16, '#1a1a2a'); srTheaterMasks(c, 2, 4); R(c, 3, 16, 10, 1, '#e8c870'); }));
    m.add(objPlant(18, 8)); m.add(objPlant(8, 11)); m.add(objPlant(18, 11));
    /* Fundus: Kleiderstangen, Kostümpuppen, Schminkspiegel, Truhe, Mantel-Haken mit Lücke */
    m.add(rackRow(1, 3, 3, ['#c8352d', '#1c1c24', '#e8c23a', '#f4f0e6', '#3f8e4b', '#5a3a8a', '#2f5fb8']));
    m.add(srCloaks(4, 3, 3, 2));
    m.trig(4, 3, 3, 1, { label: 'Fundus: Rote Mäntel', act: () => Sur.look('fundus') });
    m.add(rackRow(1, 6, 3, ['#7a4a28', '#f4f0e6', '#c8352d', '#1c1c24', '#e8a0c0']));
    m.add(dummy(5, 6, '#9aa0a8', '#8a9098', '#5a5e64')); m.add(srZunftDummy(6, 6));
    m.add(mkObj(1, 8, 2, 1, 20, (c, W, H) => { R(c, 1, H - 8, W - 2, 6, '#6a4428'); R(c, 1, H - 8, W - 2, 1, '#8a5a34'); R(c, 4, 0, W - 8, H - 10, '#c9a65a'); R(c, 6, 2, W - 12, H - 14, '#bcd6e2'); line(c, 8, 4, 12, 9, '#e8f4fa'); for (let k = 0; k < 5; k++) { E(c, 5 + k * 6, 1, 1, 1, '#fff0b0'); } R(c, 8, H - 10, 4, 2, '#c8302a'); E(c, 20, H - 9, 2, 1, '#e8a0c0'); }, { emit: (c, W) => { for (let k = 0; k < 5; k++) E(c, 5 + k * 6, 1, 2, 2, '#fff0b0'); } }));
    m.add(srChest(3, 10, '#5a3a5a'));
    m.add(objChair(1, 9, 3, '#5a3a24'));
    /* Bea's Nähtisch mit Nähmaschine und Stoffballen */
    m.add(mkObj(5, 10, 2, 1, 10, (c, W, H) => { E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.22)'); R(c, 1, 6, W - 2, 6, '#8a6a4a'); R(c, 1, 6, W - 2, 1, '#a88a6a'); R(c, 2, 12, 2, H - 13, '#5a3a24'); R(c, W - 4, 12, 2, H - 13, '#5a3a24'); R(c, 4, 0, 12, 4, '#2a2a2e'); R(c, 4, 0, 3, 8, '#2a2a2e'); R(c, 14, 3, 2, 4, '#2a2a2e'); P(c, 6, 1, '#e8c23a'); R(c, 18, 2, 10, 5, '#c8302a'); R(c, 18, 2, 10, 1, '#e85a4a'); E(c, 23, 7, 3, 1, '#3a6aa0'); for (let k = 0; k < 3; k++) P(c, 9 + k * 2, 9, '#f4f0e6'); }));
    m.add(objChair(5, 11, 0, '#5a3a24'));
    srNpc(m, 'bea', 'Kostümbildnerin Bea', 4, 8, 0, 3202, { hair: 7, hairCol: 7, beard: 0, top: 4, topCol: 11, pants: 5, pantsCol: 2, glasses: 1, hat: 0, acc: 2 }, () => Sur.talk('bea'), ['dots', '!']);
    m.light(3 * 16, 6 * 16, 50, '#ffe0a0'); m.light(15 * 16, 10 * 16, 60, '#ffe0a0');
  } });

/* 13. Museum Sankturbanhof (Theaterstrasse 9): Jubiläumsausstellung „zünftig – 150 Jahre Zunft Heini von Uri“ */
sRoom('sankturbanhof', { name: 'Museum Sankturbanhof', sign: false, w: 20, h: 13, door: 9, back: ['sursee', 'sankturbanhof_out'], style: 7, cap: '#2a2420', floor: T.WOOD, floorV: 2, lightC: '#fff4d8', lightR: 60,
  spots: { friend1: [6, 9, 3] },
  wall: (c) => {
    /* Ausstellungsbanner */
    R(c, 88, 16, 128, 28, '#8a1a24'); R(c, 90, 18, 124, 24, '#a8222c'); R(c, 88, 42, 128, 2, '#e8c23a');
    pxText(c, 'ZÜNFTIG', 125, 20, '#f2d050', 2); pxText(c, '150 JAHRE ZUNFT HEINI VON URI', 95, 34, '#f4f0e6');
    srSun(c, 104, 25, 4, '#f2d050'); srSun(c, 200, 25, 4, '#f2d050');
    /* Fotowand: 150 Jahre Fasnacht */
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) { const px = 13 * 16 + 10 + k * 14 + (r % 2) * 2, py = 17 + r * 10; R(c, px, py, 12, 9, '#f4f0e6'); R(c, px + 1, py + 1, 10, 7, r === 2 && k > 2 ? '#8ab0c8' : ['#b8a07a', '#a89070', '#c8b088'][(k + r) % 3]); E(c, px + 6, py + 4, 2, 2, ['#6a5236', '#c8302a', '#5a4028'][(k * r) % 3]); R(c, px + 3, py + 6, 6, 2, '#5a4028'); }
    /* Larven und Grende links */
    srGrende(c, 18, 18, '#a8783a'); srLarve(c, 40, 22, '#e8c890', 2); srLarve(c, 56, 30, '#c8402a', 0); srLarve(c, 72, 22, '#3a8a4a', 1);
  },
  build: (m) => {
    m.decal((c) => { srRug(c, 7 * 16, 5 * 16, 6 * 16, 4 * 16, '#5a2a2a', '#7a3a34'); });
    /* Vitrinen mit Larven, Grende und Zunftbechern */
    m.add(srVitrine(1, 5, 2, 1, (c, x, y, w, h) => { srLarve(c, x + 1, y + h - 15, '#e8b830', 0); srLarve(c, x + 13, y + h - 15, '#f4ecd8', 2); }, { dh: 16, label: true }));
    m.add(srVitrine(4, 5, 2, 1, (c, x, y, w, h) => { for (let k = 0; k < 3; k++) { const bx = x + 3 + k * 9; R(c, bx, y + h - 11, 6, 7, '#c9a65a'); R(c, bx + 1, y + h - 4, 4, 2, '#8a6a2a'); E(c, bx + 3, y + h - 11, 3, 1, '#e8d080'); } }, { dh: 16, label: true }));
    m.add(srZunftDummy(1, 8, '#e8c890')); m.add(srZunftDummy(2, 8, '#d8402a', '#3a2a1a')); m.add(srZunftDummy(4, 8, '#3a8a4a'));
    /* Leere Mittelvitrine mit Absperrkordel */
    m.add(srVitrine(9, 6, 2, 1, (c, x, y, w, h) => { E(c, x + w / 2, y + h - 3, 9, 3, '#5a1a24'); E(c, x + w / 2, y + h - 4, 7, 2, '#7a2a34'); R(c, x + w / 2 - 4, y + 2, 8, 3, '#f4f0e6'); R(c, x + w / 2 - 3, y + 3, 6, 1, '#8a8e94'); }, { dh: 18, bg: '#2a1a20', label: true }));
    for (const [x, y] of [[8, 5], [11, 5], [8, 7], [11, 7]]) m.add(mkObj(x, y, 1, 1, 6, (c, W, H) => { const px = x === 8 ? 12 : 3; R(c, px, H - 14, 2, 12, '#c9a65a'); E(c, px + 1, H - 15, 2, 2, '#e8c870'); R(c, px - 1, H - 3, 4, 2, '#8a6a2a'); }, { solid: false }));
    m.decal((c) => { for (const yy of [5 * 16 + 4, 8 * 16 - 2]) for (let x = 8 * 16 + 13; x < 11 * 16 + 4; x++) P(c, x, yy + Math.round(Math.sin((x - 8 * 16) / 52 * Math.PI) * 3), '#8a1a24'); for (const xx of [8 * 16 + 13, 11 * 16 + 4]) for (let y = 5 * 16 + 4; y < 8 * 16 - 2; y++) P(c, xx, y, '#8a1a24'); });
    /* Römerzeit: Vitrine mit Keramik, Fibel und fünf leeren Münzmulden */
    m.add(srVitrine(15, 6, 3, 1, (c, x, y, w, h) => {
      R(c, x, y + h - 6, w, 6, '#2a2a3a');
      for (let k = 0; k < 5; k++) { E(c, x + 6 + k * 6, y + h - 3, 2, 1, '#14141e'); P(c, x + 5 + k * 6, y + h - 4, '#3a3a4a'); }
      R(c, x + 2, y + 2, 7, 6, '#b8603a'); R(c, x + 3, y + 1, 5, 1, '#c87048'); R(c, x + 4, y + 8, 3, 1, '#8a4a2a');
      line(c, x + 14, y + 4, x + 20, y + 6, '#c9a65a'); E(c, x + 21, y + 6, 1, 1, '#c9a65a'); E(c, x + 30, y + 5, 3, 2, '#8a6a4a'); P(c, x + 29, y + 4, '#a88a6a');
    }, { dh: 16, bg: '#3a3a4a', base: '#3a2a20' }));
    m.trig(15, 6, 3, 1, { label: 'Römische Funde', act: () => Sur.look('roemervitrine') });
    /* Besucherbuch auf dem Pult */
    m.add(mkObj(12, 10, 1, 1, 10, (c, W, H) => { E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 7, H - 14, 2, 12, '#5a3a24'); R(c, 4, H - 3, 8, 2, '#5a3a24'); R(c, 1, H - 20, 14, 7, '#6a4428'); R(c, 2, H - 21, 12, 6, '#f4ecd8'); R(c, 7, H - 21, 1, 6, '#c8b890'); for (let k = 0; k < 3; k++) { R(c, 3, H - 19 + k * 2, 3, 1, '#4a5a8a'); R(c, 9, H - 19 + k * 2, 3, 1, '#4a5a8a'); } line(c, 13, H - 22, 15, H - 26, '#1a1a1a'); }));
    m.trig(12, 10, 1, 1, { label: 'Besucherbuch', act: () => Sur.look('besucherbuch') });
    /* Museumswärter mit Stuhl, Bank, Pflanzen, Infotafel */
    m.add(objChair(17, 10, 1, '#5a3a24'));
    srNpc(m, 'museum', 'Museumswärter Bruno', 16, 10, 0, 3301, { hair: 12, hairCol: 9, beard: 2, beardCol: 9, top: 9, topCol: 10, pants: 5, pantsCol: 8, glasses: 7, hat: 0, build: 3 }, () => Sur.talk('museum'), ['dots', '!']);
    m.add(objBench(4, 11, 0, '#5a3a24'));
    m.add(mkObj(16, 4, 2, 1, 6, (c, W, H) => { R(c, 6, H - 8, 2, 7, '#3a3a3e'); R(c, W - 8, H - 8, 2, 7, '#3a3a3e'); R(c, 2, H - 21, W - 4, 14, '#f4f0e6'); R(c, 2, H - 21, W - 4, 6, '#2a2420'); pxText(c, 'RÖMER', 6, H - 20, '#e8c870'); R(c, 4, H - 13, 8, 5, '#b8a07a'); for (let k = 0; k < 2; k++) R(c, 14, H - 13 + k * 3, 14, 1, '#5a5e64'); }));
    m.add(objPlant(18, 3)); m.add(objPlant(1, 11)); m.add(objPlant(18, 11));
    m.light(10 * 16, 6 * 16, 50, '#fff4d8'); m.light(16 * 16, 6 * 16, 40, '#fff4d8'); m.light(3 * 16, 6 * 16, 40, '#fff4d8');
    m.pedZones.push({ x: 13, y: 8, w: 5, h: 1, n: 1 }, { x: 2, y: 10, w: 6, h: 1, n: 1 });
  } });

/* 14. Stadthalle Sursee: Konzertsaal mit grosser Bühne, Traverse, Galerie, Bar und Kasse */
sRoom('stadthalle', { name: 'Stadthalle Sursee', sign: false, w: 30, h: 18, door: 14, back: ['sursee', 'stadthalle_out'], style: 3, cap: '#141218', floor: T.WOOD, floorV: 3, music: 'disco', ambient: 0.35, light: false,
  spots: { isa: [16, 10, 3], friend1: [14, 10, 3], friend2: [15, 11, 3], friend3: [17, 11, 3], band1: [9, 6, 0], band2: [12, 6, 0], band3: [19, 6, 0], band4: [15, 6, 0] },
  wall: (c) => {
    /* Bühnenrückwand mit Leinwand */
    R(c, 6 * 16, 16, 18 * 16, 32, '#0e0c12'); R(c, 9 * 16, 18, 12 * 16, 26, '#1a1824');
    pxText(c, 'STADTHALLE SURSEE', 15 * 16 - 33, 18, '#7a6a9a'); pxText(c, 'STUBETE GÄNG', 15 * 16 - 47, 25, '#ff6ab0', 2);
    srBottleWall(c, 26 * 16, 18, 3 * 16 - 2, 2, '#14101a');
  },
  build: (m) => {
    /* Bühne: begehbare Fläche für die Band, vorne eine Kante mit Rampenlichtern */
    m.decal((c) => { R(c, 5 * 16, 3 * 16, 20 * 16, 4 * 16, '#2a2228'); for (let x = 5 * 16; x < 25 * 16; x += 16) R(c, x, 3 * 16, 1, 4 * 16, '#221a20'); R(c, 5 * 16, 3 * 16, 20 * 16, 2, '#3a3238'); for (let k = 0; k < 6; k++) { R(c, (7 + k * 3) * 16, 5 * 16 + 6, 10, 1, '#c8c8c8'); } });
    const edge = mkObj(5, 7, 20, 1, 0, (c, W, H) => { R(c, 0, 0, W, 4, '#3a3238'); R(c, 0, 4, W, H - 4, '#1a1418'); for (let k = 8; k < W; k += 24) R(c, k, 6, 10, 3, '#2a2a2e'); }, { solid: true });
    edge.anim = (c, t, px, py) => { for (let k = 0; k < 13; k++) { const on = Math.sin(t * 4 + k * 0.9) > -0.3; R(c, px + 9 + k * 24, py + 6, 8, 2, on ? ['#ff5ab0', '#5ad0ff', '#ffe05a'][k % 3] : '#2a2a2e'); } };
    m.add(edge);
    m.trig(5, 7, 20, 1, { label: 'Vor die Bühne', act: () => Sur.concert() });
    m.add(srDrumKit(14, 6));
    for (const x of [9, 12, 19]) m.add(srMic(x, 6));
    for (const x of [7, 22]) m.add(mkObj(x, 4, 1, 1, 6, (c, W, H) => { R(c, 1, H - 16, 14, 14, '#1a1a1e'); R(c, 1, H - 16, 14, 3, '#2a2a2e'); R(c, 3, H - 12, 10, 8, '#2a2830'); for (let k = 0; k < 3; k++) P(c, 4 + k * 3, H - 15, '#e8c23a'); }));
    /* Boxentürme links und rechts der Bühne */
    for (const x of [3, 25]) m.add(mkObj(x, 3, 1, 4, 24, (c, W, H) => { for (let k = 0; k < 6; k++) { const by = 2 + k * 14; R(c, 0, by, W, 13, '#141218'); R(c, 0, by, W, 1, '#2a2830'); E(c, 8, by + 7, 4, 4, '#2a2830'); E(c, 8, by + 7, 1, 1, '#5a5a5a'); } }));
    srTruss(m, 5 * 16, 25 * 16, 2 * 16 + 4, ['#ff5ab0', '#5ad0ff', '#ffe05a', '#7a5aff', '#5aff9a', '#ff5ab0', '#5ad0ff']);
    srBeams(m, 2 * 16 + 14, [7 * 16, 11 * 16, 15 * 16, 19 * 16, 23 * 16], ['#ff5ab0', '#5ad0ff', '#ffe05a', '#7a5aff', '#5aff9a'], 70, 150, 0.08);
    for (const x of [8, 12, 15, 19, 22]) m.light(x * 16, 5 * 16, 56, ['#ff8ad0', '#8ad8ff', '#fff0a0', '#a08aff', '#8affc0'][x % 5]);
    m.dynLights = () => { const t = G.t; return [0, 1, 2, 3].map((i) => ({ x: (15 + Math.sin(t * 0.7 + i * 1.6) * 7) * 16, y: (10.5 + Math.cos(t * 0.9 + i) * 2) * 16, r: 46, c: ['#ff5ab0', '#5ad0ff', '#ffe05a', '#7a5aff'][i] })); };
    /* Galerie links, über die Treppe erreichbar */
    m.add(mkObj(1, 8, 3, 6, 10, (c, W, H) => {
      R(c, 0, 0, W, H - 4, '#2a2228'); for (let y = 2; y < H - 6; y += 16) for (let k = 0; k < 3; k++) { R(c, 3 + k * 15, y + 2, 10, 8, '#6a1a2a'); E(c, 8 + k * 15, y - 1, 3, 3, ['#3a2a20', '#c8a060', '#1a1a1a'][(y + k) % 3]); R(c, 5 + k * 15, y + 2, 6, 5, ['#2f5fb8', '#c8302a', '#3a3a3e'][(y + k) % 3]); }
      R(c, W - 4, 0, 4, H - 4, '#5a4a52'); R(c, W - 4, 0, 1, H - 4, '#8a7a82'); for (let y = 4; y < H - 6; y += 6) R(c, W - 5, y, 6, 1, '#c9a65a'); R(c, 0, H - 6, W, 4, '#1a1418');
    }));
    m.fill(1, 14, 3, 1, T.STAIRS, 1);
    m.trig(1, 14, 3, 1, { here: true, label: 'Galerie', act: () => Sur.galerie() });
    m.decal((c) => pxText(c, 'GALERIE', 18, 14 * 16 + 5, '#f4e8c0'));
    /* Bar oben rechts */
    m.add(objCounter(26, 6, 3, 1, { top: '#2a2830', front: '#14121a', taps: 2, glasses: 2 }));
    m.trig(26, 6, 3, 1, { label: 'Bar: Bestellen', act: () => Story.shop('stadthalle_bar') });
    srNpc(m, 'hallenbar', 'Barkeeper Luca', 27, 5, 0, 3401, { hair: 4, hairCol: 1, beard: 1, beardCol: 1, top: 0, topCol: 16, pants: 0, pantsCol: 2, hat: 0, glasses: 0 }, () => Story.shop('stadthalle_bar'), ['beer', 'dots']);
    m.add(mkObj(26, 3, 3, 1, 8, (c, W, H) => { R(c, 0, 4, W, H - 5, '#2a2830'); R(c, 2, 6, 14, 10, '#3a8ab0'); for (let k = 0; k < 4; k++) R(c, 3 + k * 3, 8, 2, 6, '#e8b33a'); R(c, 24, 8, 18, 6, '#3a3c42'); }));
    m.light(27 * 16 + 8, 5 * 16, 50, '#ffd27a');
    /* Kasse und Garderobe beim Eingang */
    m.add(srWrap(objCounter(18, 15, 4, 1, { top: '#2a2830', front: '#14121a', reg: true }), 14, (c, W) => { R(c, W - 10, 4, 2, 12, '#5a5e64'); R(c, W - 30, 0, 28, 7, '#2a2830'); pxText(c, 'KASSE', W - 28, 1, '#ffe05a'); }));
    m.trig(18, 15, 4, 1, { label: 'Kasse und Garderobe', act: () => Sur.concertKasse() });
    srNpc(m, 'hallenkasse', 'Kassierer Kevin', 19, 14, 0, 3402, { hair: 13, hairCol: 5, beard: 0, top: 3, topCol: 6, pants: 0, pantsCol: 2, hat: 0, glasses: 0 }, () => Sur.concertKasse(), ['dots']);
    m.add(mkObj(22, 15, 3, 1, 16, (c, W) => { R(c, 0, 4, W, 2, '#6a6e74'); for (let k = 2; k < W - 4; k += 6) R(c, k, 6, 5, 14, ['#3a3c40', '#7a2f3a', '#2f4a7a', '#5a6234', '#c8a070'][(k / 6 | 0) % 5]); }));
    /* Merchandise-Stand */
    m.add(mkObj(6, 15, 3, 1, 14, (c, W) => { R(c, 0, 14, W, 12, '#2a2830'); R(c, 0, 14, W, 1, '#4a4650'); for (let k = 0; k < 3; k++) { const tx = 4 + k * 15, col = ['#1a1a1e', '#c8302a', '#f4f0e6'][k]; R(c, tx, 2, 10, 9, col); R(c, tx - 2, 2, 3, 4, col); R(c, tx + 9, 2, 3, 4, col); pxText(c, 'X', tx + 3, 4, k === 2 ? '#c8302a' : '#ffe05a'); } for (let k = 0; k < 4; k++) R(c, 4 + k * 11, 17, 8, 4, ['#ffe05a', '#5ad0ff', '#ff5ab0', '#f4f0e6'][k]); }));
    m.light(20 * 16, 15 * 16, 50, '#ffe0a0'); m.light(2 * 16, 14 * 16, 40, '#ffe0a0');
    m.pedZones.push({ x: 6, y: 8, w: 18, h: 5, n: 18, dance: true }, { x: 25, y: 7, w: 4, h: 2, n: 3, drink: true }, { x: 5, y: 14, w: 10, h: 2, n: 3 });
  } });

/* 15. Kulturwerk 118: Konzertkeller im Feuerwehrgebäude (118 = Notruf der Feuerwehr) */
sRoom('kulturwerk', { name: 'Kulturwerk 118', sign: false, w: 18, h: 12, door: 8, back: ['sursee', 'kulturwerk_out'], style: 1, cap: '#2a1a14', floor: T.STONE, floorV: 1, music: 'bar', ambient: 0.3, light: false,
  spots: { band1: [5, 4, 0], band2: [7, 4, 0], band3: [11, 4, 0], band4: [9, 4, 0], friend1: [8, 8, 3] },
  wall: (c) => {
    /* Backsteingewölbe: Bögen über der Wand */
    for (let k = 0; k < 4; k++) { const ax = 16 + k * 64; for (let a = 0; a <= Math.PI; a += 0.03) { P(c, ax + 32 - Math.cos(a) * 32, 17 + 14 - Math.sin(a) * 14, '#5a2a1e'); P(c, ax + 32 - Math.cos(a) * 30, 18 + 14 - Math.sin(a) * 13, '#a85a3e'); } }
    /* Feuerwehr-Deko: Schlauchhaspel, Helm, Beil */
    E(c, 30, 32, 10, 10, '#8a1a1a'); E(c, 30, 32, 8, 8, '#c8302a'); for (let r = 3; r < 8; r += 2) for (let a = 0; a < 6.28; a += 0.2) P(c, 30 + Math.cos(a) * r, 32 + Math.sin(a) * r, '#d8c8a0'); E(c, 30, 32, 2, 2, '#3a3a3e'); line(c, 38, 36, 44, 46, '#d8c8a0');
    E(c, 56, 30, 6, 4, '#c9a65a'); R(c, 50, 30, 13, 2, '#a8843a'); R(c, 55, 24, 3, 4, '#c9a65a'); line(c, 66, 22, 74, 40, '#6a4428'); R(c, 63, 20, 6, 4, '#9aa0a6');
    /* Bühnenrückwand */
    R(c, 5 * 16, 16, 8 * 16, 32, '#141014');
    srBottleWall(c, 13 * 16 + 4, 18, 4 * 16 - 8, 2, '#1a0e0a');
  },
  build: (m) => {
    m.decal((c) => { R(c, 16, 48, 16 * 16, 8 * 16, 'rgba(50,40,40,0.55)'); for (let i = 0; i < 120; i++) P(c, 16 + hash(i, 4) * 16 * 16, 48 + hash(i, 5) * 8 * 16, i % 2 ? '#6a5a5a' : '#3a2e2e'); R(c, 5 * 16, 3 * 16, 8 * 16, 2 * 16, '#2a2024'); for (let x = 5 * 16; x < 13 * 16; x += 12) R(c, x, 3 * 16, 1, 32, '#221a1e'); });
    srNeonObj(m, 7, 3, '118', '#ff3a2a', 6, 18, 3);
    const edge = mkObj(5, 5, 8, 1, 0, (c, W, H) => { R(c, 0, 0, W, 4, '#3a2a2a'); R(c, 0, 4, W, H - 4, '#1a1214'); for (let k = 4; k < W; k += 8) R(c, k, 8, 4, 2, '#3a3a3e'); }, { solid: true });
    m.add(edge);
    m.trig(5, 5, 8, 1, { label: 'Bühne', act: () => Sur.kulturwerk() });
    m.add(srDrumKit(8, 4)); m.add(srMic(5, 4)); m.add(srMic(7, 4)); m.add(srMic(11, 4));
    m.add(objSpeaker(5, 3)); m.add(objSpeaker(12, 3));
    for (const x of [6, 10]) m.light(x * 16 + 8, 4 * 16, 44, ['#ff8a6a', '#ffd27a'][x % 2]);
    srTruss(m, 5 * 16, 13 * 16, 2 * 16 + 8, ['#ff5a3a', '#ffd27a', '#ff5a3a', '#ffd27a']);
    srBeams(m, 3 * 16 + 2, [7 * 16, 11 * 16], ['#ff7a5a', '#ffd27a'], 30, 70, 0.08);
    /* Bar rechts */
    m.add(objCounter(13, 5, 4, 1, { top: '#3a2420', front: '#2a1a14', taps: 3, glasses: 1 }));
    m.trig(13, 5, 4, 1, { label: 'Bar: Bestellen', act: () => Story.shop('kulturwerk') });
    srNpc(m, 'kwbar', 'Barfrau Mia', 15, 4, 0, 3501, { hair: 6, hairCol: 13, beard: 0, top: 0, topCol: 16, pants: 0, pantsCol: 2, jewel: 3, hat: 0, glasses: 0 }, () => Story.shop('kulturwerk'), ['note', 'beer']);
    for (const x of [14, 16]) m.add(objStool(x, 6, '#c8302a'));
    m.light(15 * 16, 5 * 16, 46, '#ffb070');
    /* Feuerlöscher, Hydrant, Stehtische, Gewölbepfeiler */
    m.add(mkObj(1, 3, 1, 1, 10, (c, W, H) => { E(c, 8, H - 2, 4, 1, 'rgba(0,0,0,0.25)'); R(c, 5, H - 18, 6, 16, '#c8302a'); R(c, 5, H - 18, 2, 16, '#e85a4a'); R(c, 6, H - 21, 4, 3, '#2a2a2e'); line(c, 10, H - 20, 13, H - 12, '#1a1a1a'); R(c, 6, H - 12, 4, 3, '#f4f0e6'); }));
    m.add(mkObj(16, 9, 1, 1, 8, (c, W, H) => { E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 4, H - 16, 8, 14, '#c8302a'); E(c, 8, H - 16, 4, 2, '#e85a4a'); R(c, 2, H - 12, 12, 3, '#c8302a'); R(c, 3, H - 4, 10, 2, '#8a1a1a'); E(c, 8, H - 18, 2, 1, '#c9a65a'); }));
    for (const x of [4, 13]) m.add(mkObj(x, 9, 1, 1, 24, (c, W, H) => { R(c, 2, 0, 12, H - 2, '#8a4a36'); for (let y = 2; y < H - 2; y += 4) { R(c, 2, y, 12, 1, '#6a3626'); R(c, (y / 4) % 2 ? 6 : 10, y - 3, 1, 3, '#6a3626'); } R(c, 2, 0, 12, 2, '#a85a3e'); E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.3)'); }));
    for (const [x, y] of [[3, 7], [11, 8]]) { m.add(srWrap(objTable(x, y, 1, 1, { col: '#3a2a2a', round: true }), 4, (c, W, H, e) => { srGlass(c, 5, e + 1); srGlass(c, 9, e + 2, '#3a1a10'); })); }
    m.add(objPlant(16, 3));
    m.pedZones.push({ x: 5, y: 6, w: 8, h: 3, n: 8, dance: true }, { x: 13, y: 6, w: 3, h: 2, n: 2, drink: true });
  } });

/* ---------- Helfer für Wohnung, Polizei und Kloster ---------- */
/* Anzahl brennender Adventskerzen nach Spieldatum (Advent 2026: 29.11., 6., 13., 20.12.) */
function srAdventLit() { try { const d = calDate(); if (d.m === 12) return Math.min(4, 1 + [6, 13, 20].filter((x) => d.d >= x).length); if (d.m === 11 && d.d >= 29) return 1; } catch (e) { /* ohne Spielstand */ } return 2; }
function srAdventWreath(c, x, y) {
  E(c, x, y, 9, 4, '#1f4a2a'); E(c, x, y, 7, 3, '#2e6a38'); E(c, x, y, 4, 1, '#c8a070');
  for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; P(c, x + Math.cos(a) * 7, y + Math.sin(a) * 3, i % 3 ? '#3f8a4a' : '#c8302a'); }
  for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283 + 0.6, cx = Math.round(x + Math.cos(a) * 6), cy = Math.round(y + Math.sin(a) * 2.5); R(c, cx - 1, cy - 5, 2, 5, '#c8302a'); P(c, cx - 1, cy - 5, '#e85a4a'); }
}
function srSofaUp(x, y, w, col) {
  /* Sofa von hinten gesehen (man schaut zum Fernseher hinauf) */
  return mkObj(x, y, w, 1, 6, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 1, 2, 'rgba(0,0,0,0.2)');
    R(c, 0, 2, W, 9, shade(col, 0.1)); for (let k = 1; k < w; k++) R(c, k * 16, 3, 1, 7, shade(col, -0.2)); R(c, 3, 3, 8, 4, '#e8c23a'); R(c, W - 12, 3, 8, 4, '#f4f0e6');
    R(c, 0, 10, W, 10, shade(col, -0.18)); R(c, 0, 10, W, 2, shade(col, 0.05)); R(c, 0, 2, 4, 16, shade(col, -0.25)); R(c, W - 4, 2, 4, 16, shade(col, -0.25));
    R(c, W - 20, 6, 14, 4, '#c8302a'); for (let k = 0; k < 6; k++) P(c, W - 19 + k * 2, 7, '#f4f0e6');
  });
}
function srArmchair(x, y, dir, col) {
  return mkObj(x, y, 1, 1, 8, (c, W, H) => {
    E(c, 8, H - 2, 6, 2, 'rgba(0,0,0,0.2)'); R(c, 2, H - 12, 12, 9, col); R(c, 2, H - 12, 12, 1, shade(col, 0.2));
    if (dir === 2) R(c, 1, H - 18, 4, 15, shade(col, -0.2)); else R(c, 11, H - 18, 4, 15, shade(col, -0.2));
    R(c, 2, H - 4, 12, 2, shade(col, -0.35));
  }, { solid: false });
}
/* Kapuzinerhabit auf einer Figur: braune Kutte, Kapuze, weisser Strick */
function srHabit(x, y) {
  return mkObj(x, y, 1, 1, 22, (c, W, H) => { E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 5, H - 3, 6, 2, '#3a2a1a'); R(c, 3, 8, 10, H - 11, '#6a4428'); R(c, 3, 8, 1, H - 11, '#4a2e1a'); R(c, 12, 8, 1, H - 11, '#4a2e1a'); E(c, 8, 6, 4, 4, '#6a4428'); E(c, 8, 7, 2, 2, '#2a1a10'); R(c, 3, 16, 10, 1, '#f4f0e6'); R(c, 9, 16, 1, 8, '#f4f0e6'); P(c, 9, 24, '#e8dcc0'); R(c, 1, 11, 2, 8, '#6a4428'); R(c, 13, 11, 2, 8, '#6a4428'); });
}
function srBookshelf(x, y, w, col = '#5a3a24') {
  return mkObj(x, y, w, 1, 20, (c, W, H) => {
    R(c, 0, 0, W, H - 1, col); R(c, 0, 0, W, 2, shade(col, 0.25));
    for (const ry of [3, 12, 21]) { R(c, 1, ry + 7, W - 2, 2, shade(col, 0.3)); for (let k = 2; k < W - 3; k += 3) { const bc = ['#6a2a1a', '#2a3a5a', '#5a4a2a', '#3a4a2a', '#7a5a3a', '#4a2a3a'][(hash(x + k, ry, 3) * 6) | 0]; const bh = 5 + (hash(k, ry, x) * 3 | 0); R(c, k, ry + 7 - bh, 2, bh, bc); P(c, k, ry + 8 - bh + 1, '#c9a65a'); } }
  });
}

/* 16. Isas Wohnung in der Münstervorstadt: Wohnzimmer, Küche, Esstisch, Kinderecke, Gästezimmer, Bad */
sRoom('isa_haus', { name: 'Bei Isa', sign: false, w: 22, h: 14, door: 9, back: ['sursee', 'isa_out'], style: 0, cap: '#4a4038', floor: T.WOOD, floorV: 0, lightC: '#fff0d0', light: false,
  spots: { isa: [3, 10, 0], elin: [12, 5, 0], timo: [14, 5, 1], cuche: [6, 5, 2], thierry: [10, 5, 1], louve: [5, 10, 3] },
  wall: (c) => {
    /* Küche: Hängeschränke, Fliesenspiegel */
    R(c, 16, 30, 4 * 16, 18, '#e8ecee'); for (let x = 16; x < 5 * 16; x += 4) R(c, x, 30, 1, 18, '#c9d1d6'); for (let y = 30; y < 48; y += 4) R(c, 16, y, 4 * 16, 1, '#c9d1d6');
    R(c, 16, 16, 3 * 16, 13, '#f4f0e6'); for (let k = 0; k < 3; k++) { R(c, 16 + k * 16 + 1, 17, 14, 11, '#ece8dc'); R(c, 16 + k * 16 + 12, 22, 1, 3, '#8a8e94'); }
    /* Fenster mit Papierstern und Blick auf die Neubauten */
    R(c, 4 * 16 + 2, 17, 26, 24, '#f4f4f0'); R(c, 4 * 16 + 4, 19, 22, 20, '#a8cce4'); for (let k = 0; k < 3; k++) R(c, 4 * 16 + 6 + k * 7, 26 - k * 3, 6, 13 + k * 3, ['#e8e0d0', '#d8d4cc', '#e0d8c8'][k]); for (let k = 0; k < 3; k++) for (let r = 0; r < 3; r++) P(c, 4 * 16 + 8 + k * 7, 29 + r * 3, '#5a6a8a'); R(c, 4 * 16 + 14, 19, 2, 20, '#f4f4f0');
    srSun(c, 4 * 16 + 9, 23, 2, '#f2d050');
    /* Familienfotos über dem Fernseher */
    for (let k = 0; k < 3; k++) srFrame(c, 7 * 16 + 4 + k * 14, 18, 11, 9, (c, x, y, w, h) => { R(c, x, y, w, h, ['#a8c8e0', '#e8d0b0', '#b8d8a8'][k]); E(c, x + 2, y + 3, 1, 1, '#e0b090'); E(c, x + 4, y + 4, 1, 1, '#e0b090'); R(c, x + 1, y + 4, 5, 2, ['#c8302a', '#2f5fb8', '#3fae4a'][k]); }, '#f4f4f0');
    /* Kinderzeichnungen */
    for (let k = 0; k < 4; k++) srDrawing(c, 11 * 16 + 2 + k * 15, 20 + (k % 2) * 6, k);
    R(c, 11 * 16, 16, 5 * 16, 2, '#f2c23a');
  },
  build: (m) => {
    /* Innenwände: Bad oben rechts, Gästezimmer unten rechts */
    for (let y = 3; y < 13; y++) if (y !== 5 && y !== 10) m.set(16, y, T.WALL);
    m.fill(17, 7, 4, 1, T.WALL);
    m.fill(17, 1, 4, 2, T.WALLF, 4); m.fill(17, 3, 4, 4, T.BATH); m.fill(17, 8, 4, 5, T.WOOD, 2);
    m.fill(1, 3, 5, 3, T.STONE, 2); m.set(16, 5, T.WOOD, 0); m.set(16, 10, T.WOOD, 0);
    m.decal((c) => {
      for (const yy of [5, 10]) { R(c, 16 * 16, yy * 16, 2, 16, '#e8e4dc'); R(c, 16 * 16 + 14, yy * 16, 2, 16, '#e8e4dc'); }
      srRug(c, 7 * 16, 8 * 16 + 4, 5 * 16, 3 * 16, '#7a9ab8', '#a8c0d8');
      srRug(c, 7 * 16 - 4, 4 * 16 + 4, 3 * 16 + 8, 3 * 16, '#c8a070', '#e8d0a0');
      /* Spielteppich mit Strasse und verstreuten Legosteinen */
      R(c, 11 * 16 + 2, 4 * 16 + 2, 4 * 16 + 12, 2 * 16 + 12, '#7ab04a'); R(c, 11 * 16 + 6, 5 * 16 + 4, 4 * 16 + 4, 6, '#5a5e64'); for (let k = 0; k < 8; k++) R(c, 11 * 16 + 8 + k * 8, 5 * 16 + 6, 4, 1, '#f4f4f0'); R(c, 13 * 16, 4 * 16 + 4, 6, 2 * 16 + 8, '#5a5e64');
      for (let i = 0; i < 14; i++) R(c, 11 * 16 + 4 + hash(i, 1) * 70, 4 * 16 + 4 + hash(i, 2) * 40, 3, 2, ['#e8402e', '#f2c23a', '#3a8ae0', '#3fae4a', '#f4f4f0'][i % 5]);
      R(c, 18 * 16, 5 * 16, 24, 10, '#7ab0d0'); R(c, 17 * 16 + 4, 9 * 16, 3 * 16, 2 * 16, '#c8b0d0');
      R(c, 9 * 16 + 2, 12 * 16 + 3, 2 * 16 - 4, 11, '#8a6a4a'); pxText(c, 'GRÜEZI', 9 * 16 + 4, 12 * 16 + 6, '#f4e8c0');
    });
    /* Küche: Kombination mit Spüle und Herd, Kühlschrank mit Kinderzeichnungen */
    m.add(mkObj(1, 3, 3, 1, 6, (c, W, H) => { R(c, 0, 0, W, H - 1, '#f4f0e6'); R(c, 0, 0, W, 3, '#8a6a4a'); R(c, 4, 1, 12, 6, '#c9ccd2'); R(c, 6, 2, 8, 4, '#a8b0b8'); R(c, 9, -2, 2, 3, '#a8b0b8'); for (const [bx, by] of [[24, 2], [32, 2], [24, 6], [32, 6]]) E(c, bx, by, 2, 1, '#2a2a2e'); R(c, 38, 1, 8, 6, '#e8c890'); for (let k = 0; k < W; k += 16) { R(c, k + 2, 10, 12, H - 13, '#ece8dc'); R(c, k + 7, 12, 2, 1, '#8a8e94'); } }));
    m.add(mkObj(4, 3, 1, 1, 20, (c, W, H) => { R(c, 1, 0, 14, H - 1, '#f4f4f0'); R(c, 1, 0, 14, 1, '#ffffff'); R(c, 1, 12, 14, 1, '#c9d1d6'); R(c, 12, 4, 1, 6, '#8a8e94'); R(c, 12, 15, 1, 8, '#8a8e94'); srDrawing(c, 2, 2, 1); R(c, 4, 15, 6, 6, '#fff8d0'); P(c, 6, 17, '#e8402e'); P(c, 3, 23, '#3a8ae0'); P(c, 9, 25, '#f2c23a'); }));
    m.trig(4, 3, 1, 1, { label: 'Kühlschrank', act: () => Sur.fridge() });
    /* Kaffeemaschine „Bruno“ (Isa trinkt etwas viel Kaffee) */
    m.add(mkObj(1, 4, 1, 1, 12, (c, W, H) => { R(c, 2, H - 14, 12, 13, '#3a3a40'); R(c, 3, H - 13, 10, 4, '#5a5e64'); R(c, 6, H - 8, 4, 3, '#1a1a1e'); R(c, 6, H - 5, 4, 3, '#f4f0e6'); R(c, 7, H - 4, 2, 1, '#6a4428'); E(c, 11, H - 11, 1, 1, '#3aff6a'); pxText(c, 'B', 4, H - 13, '#f2c23a'); }));
    m.trig(1, 4, 1, 1, { label: 'Kaffeemaschine Bruno', act: () => Sur.kaffee(false) });
    /* Isas Homeoffice: Pult mit Laptop, Headset und vielen Kaffeetassen */
    m.add(mkObj(2, 11, 3, 1, 10, (c, W, H) => { R(c, 0, 4, W, 6, '#c8a070'); R(c, 0, 4, W, 1, '#e8c890'); R(c, 2, 10, 2, H - 10, '#8a6a4a'); R(c, W - 4, 10, 2, H - 10, '#8a6a4a'); R(c, 14, -4, 18, 9, '#2a2a2e'); R(c, 15, -3, 16, 7, '#4a6a8a'); for (let k = 0; k < 6; k++) R(c, 16 + (k % 3) * 5, -2 + Math.floor(k / 3) * 3, 4, 2, ['#e0b090', '#c89070', '#f0c8a0'][k % 3]); R(c, 12, 5, 22, 2, '#5a5e64'); for (let k = 0; k < 4; k++) { R(c, 2 + k * 3, 1, 3, 4, '#f4f4f0'); P(c, 3 + k * 3, 1, '#6a4428'); } E(c, 40, 3, 4, 2, '#2a2a2e'); R(c, 36, 0, 8, 1, '#2a2a2e'); R(c, 6, 6, 5, 3, '#f2e05a'); }, { emit: (c) => R(c, 15, -3, 16, 7, '#9ac8f0') }));
    m.trig(2, 11, 3, 1, { label: 'Isas Homeoffice', act: () => Sur.look('homeoffice') });
    /* Elins Gitarre */
    m.add(mkObj(13, 3, 1, 1, 14, (c, W, H) => { E(c, 8, H - 6, 5, 5, '#c87a3a'); E(c, 8, H - 12, 4, 4, '#c87a3a'); E(c, 8, H - 7, 2, 2, '#3a2418'); R(c, 7, H - 26, 2, 14, '#6a4428'); R(c, 6, H - 28, 4, 3, '#3a2418'); P(c, 7, H - 20, '#f2c23a'); P(c, 8, H - 17, '#e87ac0'); line(c, 5, H, 8, H - 4, '#2a2a2e'); line(c, 11, H, 8, H - 4, '#2a2a2e'); }));
    m.trig(13, 3, 1, 1, { label: 'Elins Gitarre', act: () => Sur.gitarre() });
    m.add(objPlant(5, 3));
    /* Esstisch mit Adventskranz */
    const tab = srWrap(objTable(2, 7, 3, 2, { col: '#c8a070' }), 6, (c, W, H, e) => { srAdventWreath(c, W / 2, e + 13); for (const gx of [8, 36]) { R(c, gx, e + 20, 5, 3, '#f4f4f0'); } R(c, 6, e + 6, 6, 3, '#f4f4f0'); });
    const lit = mkObj(2, 7, 3, 2, 6, () => {}, { solid: false, sortOff: -1 });
    lit.anim = (c, t, px, py) => { const n = srAdventLit(); for (let k = 0; k < n; k++) { const a = k / 4 * 6.283 + 0.6, cx = Math.round(px + 24 + Math.cos(a) * 6), cy = Math.round(py + 13 + Math.sin(a) * 2.5); const f = Math.sin(t * 9 + k * 2) > 0.2 ? 1 : 0; P(c, cx - 1, cy - 6 - f, '#ffd060'); P(c, cx - 1, cy - 7 - f, '#fff0b0'); } };
    m.add(tab); m.add(lit);
    for (const x of [2, 3, 4]) { m.add(objChair(x, 6, 3, '#8a6a4a')); m.add(objChair(x, 9, 0, '#8a6a4a')); }
    m.add(objChair(1, 7, 2, '#8a6a4a')); m.add(objChair(5, 8, 1, '#8a6a4a'));
    m.light(3 * 16 + 8, 8 * 16, 44, '#ffd090');
    /* Wohnzimmer: Fernsehmöbel, Salontisch, Sofa, Sessel, Bücherregal */
    m.add(srWrap(mkObj(7, 3, 3, 1, 6, (c, W, H) => { R(c, 0, 6, W, H - 7, '#5a4a3a'); R(c, 0, 6, W, 1, '#7a6a5a'); for (let k = 0; k < 3; k++) R(c, 3 + k * 16, 10, 12, 8, '#4a3a2a'); }), 14, (c, W) => { R(c, 8, 0, 32, 18, '#18181c'); R(c, 9, 1, 30, 15, '#2a4a6a'); R(c, 9, 10, 30, 6, '#3a6a3a'); E(c, 30, 5, 3, 3, '#f2d050'); R(c, 22, 18, 4, 2, '#18181c'); }));
    m.add(srWrap(objTable(7, 5, 3, 1, { col: '#8a6a4a' }), 4, (c, W, H, e) => { R(c, 8, e + 3, 10, 7, '#3a8ae0'); R(c, 9, e + 4, 8, 5, '#f4f0e6'); R(c, 28, e + 4, 5, 4, '#f4f4f0'); E(c, 38, e + 6, 4, 2, '#c8a070'); for (let k = 0; k < 3; k++) E(c, 37 + k * 2, e + 5, 1, 1, ['#e8402e', '#f2c23a', '#e87a2a'][k]); }));
    m.add(srSofaUp(7, 6, 3, '#4a6a8a'));
    m.add(srArmchair(6, 5, 2, '#8a5a3a')); m.add(srArmchair(10, 5, 1, '#8a5a3a'));
    m.add(srBookshelf(15, 8, 1)); m.add(mkObj(15, 11, 1, 1, 26, (c, W, H) => { E(c, 8, H - 2, 4, 1, 'rgba(0,0,0,0.25)'); R(c, 7, 8, 2, H - 10, '#3a3a3e'); R(c, 4, H - 3, 8, 2, '#3a3a3e'); E(c, 8, 6, 5, 4, '#f4e8c8'); R(c, 3, 6, 11, 3, '#e8dcc0'); }, { emit: (c) => E(c, 8, 6, 5, 4, '#fff0c0') }));
    m.light(15 * 16 + 8, 11 * 16 - 10, 40, '#fff0c0');
    /* Kinderecke: Spielzeugregal, Tipi, Kindertisch, Lego-Burg, Sitzsack */
    m.add(mkObj(11, 3, 2, 1, 12, (c, W, H) => { R(c, 0, 0, W, H - 1, '#f4f4f0'); for (const ry of [5, 14]) R(c, 1, ry + 7, W - 2, 1, '#c9ccd2'); for (let k = 0; k < 4; k++) { const bx = 3 + k * 7; R(c, bx, 7, 5, 5, ['#e8402e', '#3a8ae0', '#f2c23a', '#3fae4a'][k]); R(c, bx, 16, 5, 5, ['#9a5ae0', '#e87a2a', '#e8a0c0', '#7ad0f0'][k]); } E(c, 8, 4, 3, 3, '#c8a070'); P(c, 7, 3, '#1a1a1a'); P(c, 9, 3, '#1a1a1a'); E(c, 6, 1, 1, 1, '#c8a070'); E(c, 10, 1, 1, 1, '#c8a070'); }));
    m.add(mkObj(14, 3, 2, 1, 22, (c, W, H) => { E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.2)'); for (let yy = 0; yy < H - 4; yy++) { const ww = Math.round((yy / (H - 4)) * (W / 2 - 2)); R(c, W / 2 - ww, yy + 2, ww * 2, 1, yy % 6 < 3 ? '#f4e8c8' : '#e8d8b0'); } R(c, W / 2 - 4, H - 14, 8, 12, '#3a2a20'); line(c, W / 2, 0, W / 2 - 3, 4, '#8a6a4a'); line(c, W / 2, 0, W / 2 + 3, 4, '#8a6a4a'); for (let k = 0; k < 5; k++) P(c, 6 + k * 5, 16 + (k % 2) * 3, ['#e8402e', '#3a8ae0', '#f2c23a', '#3fae4a', '#9a5ae0'][k]); }));
    m.add(srWrap(objTable(13, 5, 1, 1, { col: '#f2c23a' }), 4, (c) => { R(c, 3, 4, 10, 6, '#f4f4f0'); line(c, 4, 6, 10, 8, '#e8402e'); line(c, 5, 8, 9, 5, '#3a8ae0'); }));
    m.add(mkObj(12, 6, 1, 1, 6, (c, W, H) => { for (let r = 0; r < 3; r++) for (let k = 0; k < 4 - r; k++) R(c, 2 + k * 3 + r * 1.5, H - 6 - r * 3, 3, 3, ['#e8402e', '#f2c23a', '#3a8ae0', '#3fae4a'][(k + r) % 4]); R(c, 5, H - 15, 2, 4, '#e8402e'); R(c, 5, H - 15, 4, 2, '#e8402e'); }, { solid: false }));
    m.add(mkObj(14, 8, 1, 1, 4, (c, W, H) => { E(c, 8, H - 6, 7, 6, '#e87a2a'); E(c, 7, H - 8, 4, 3, '#f09a4a'); }, { solid: false }));
    m.add(mkObj(12, 11, 2, 1, 8, (c, W, H) => { R(c, 2, 6, W - 4, H - 8, '#3a8ae0'); R(c, 2, 6, W - 4, 2, '#7ab0f0'); R(c, 6, 2, 6, 5, '#e8402e'); E(c, 20, 4, 3, 3, '#f2c23a'); R(c, 4, 12, W - 8, 1, '#2a5ab0'); pxText(c, 'TOYS', 8, 15, '#f4f4f0'); }));
    /* Garderobe und Schuhschrank beim Eingang */
    m.add(mkObj(6, 12, 2, 1, 10, (c, W, H) => { R(c, 1, 6, W - 2, H - 7, '#f4f0e6'); R(c, 1, 6, W - 2, 1, '#c9ccd2'); for (let k = 0; k < 5; k++) { R(c, 3 + k * 6, 3, 4, 3, ['#2a2a2e', '#e8402e', '#3a8ae0', '#6a4428', '#f2c23a'][k]); } }));
    m.add(mkObj(11, 12, 1, 1, 24, (c, W, H) => { R(c, 7, 2, 2, H - 4, '#8a6a4a'); R(c, 4, H - 3, 8, 2, '#8a6a4a'); for (const [dx, col, len] of [[-4, '#c8302a', 10], [3, '#2f5fb8', 14], [-1, '#f2c23a', 8]]) R(c, 6 + dx, 6, 5, len, col); E(c, 9, 4, 3, 2, '#e87a2a'); }));
    /* Bad: WC, Lavabo mit Spiegel, Dusche */
    m.decal((c) => { DECAL.mirror(c, 18 * 16 + 2, 16 + 4); R(c, 17 * 16 + 4, 18, 8, 6, '#f4f4f0'); });
    m.add(objToilet(17, 3)); m.add(objSink(18, 3)); m.add(objShower(19, 3));
    m.trig(17, 3, 1, 1, { label: 'WC', act: () => Sur.wc() });
    m.trig(19, 3, 2, 2, { here: true, label: 'Duschen', act: () => Sur.shower() });
    m.add(mkObj(20, 6, 1, 1, 6, (c, W, H) => { R(c, 2, H - 14, 12, 12, '#e8e4dc'); R(c, 2, H - 14, 12, 2, '#f4f4f0'); R(c, 4, H - 10, 8, 2, '#7ab0d0'); R(c, 4, H - 7, 8, 2, '#e8a0c0'); }));
    /* Gästezimmer */
    m.add(objBed(19, 9));
    m.trig(19, 9, 2, 3, { label: 'Gästebett', act: () => Sur.sleep() });
    m.add(mkObj(17, 8, 1, 1, 6, (c, W, H) => { R(c, 2, 4, 12, H - 5, '#c8a070'); R(c, 2, 4, 12, 1, '#e8c890'); R(c, 6, 0, 4, 5, '#e8d08a'); R(c, 7, 5, 2, 2, '#5a5e64'); R(c, 3, 9, 6, 2, '#2f5fb8'); }, { emit: (c) => R(c, 6, 0, 4, 5, '#fff0b0') }));
    m.add(objWardrobe(17, 12, 1));
    m.light(18 * 16, 9 * 16, 36, '#fff0c0'); m.light(18 * 16 + 8, 4 * 16, 40, '#f0f8ff');
    srPendants(m, [[3, 8]], '#f4f0e6', '#fff0d0', 0);
    m.add(objPlant(1, 11));
    /* Trottinett der Kinder und Wäschekorb */
    m.add(mkObj(13, 10, 1, 1, 6, (c, W, H) => { line(c, 3, H - 4, 12, H - 4, '#3a8ae0'); E(c, 3, H - 3, 2, 2, '#2a2a2e'); E(c, 13, H - 3, 2, 2, '#2a2a2e'); line(c, 12, H - 4, 11, H - 16, '#8a8e94'); R(c, 8, H - 17, 7, 2, '#2a2a2e'); }, { solid: false }));
    m.add(mkObj(6, 9, 1, 1, 6, (c, W, H) => { R(c, 2, H - 12, 12, 10, '#d8c8a0'); for (let k = 3; k < 14; k += 3) R(c, k, H - 12, 1, 10, '#b8a880'); E(c, 8, H - 12, 5, 2, '#f4f4f0'); P(c, 6, H - 13, '#e8402e'); P(c, 10, H - 13, '#3a8ae0'); }));
    m.light(13 * 16, 5 * 16, 50, '#fff0d0'); m.light(9 * 16, 11 * 16, 50, '#fff0d0');
  } });

/* 17. Polizeiposten Sursee */
sRoom('polizei', { name: 'Polizeiposten Sursee', sign: false, w: 14, h: 10, door: 6, back: ['sursee', 'polizei_out'], style: 5, cap: '#1a2a4a', floor: T.STONE, floorV: 1, lightC: '#f0f8ff', lightR: 60,
  spots: {},
  wall: (c) => {
    R(c, 18, 17, 54, 11, '#1a3a8a'); pxText(c, 'POLIZEI', 22, 20, '#ffffff'); R(c, 54, 19, 14, 7, '#d8302a'); R(c, 60, 20, 2, 5, '#ffffff'); R(c, 58, 22, 6, 1, '#ffffff');
    pxText(c, 'LUZERNER POLIZEI', 18, 31, '#1a3a8a');
    /* Anschlagbrett mit Fahndungsplakaten */
    R(c, 8 * 16 - 2, 17, 4 * 16 + 4, 29, '#8a6a3a'); R(c, 8 * 16, 19, 4 * 16, 25, '#c8a070');
    for (let k = 0; k < 4; k++) { const px = 8 * 16 + 2 + k * 16, py = 21 + (k % 2) * 2; R(c, px, py, 13, 17, '#f4f0e6'); R(c, px + 1, py + 1, 11, 4, '#c8302a'); R(c, px + 2, py + 2, 9, 1, '#f4f0e6'); E(c, px + 6, py + 10, 3, 3, ['#e0b090', '#c89070', '#a87050', '#f0c8a0'][k]); R(c, px + 3, py + 13, 7, 3, '#5a5e64'); P(c, px + 5, py + 9, '#1a1a1a'); P(c, px + 7, py + 9, '#1a1a1a'); P(c, px + 6, py, '#c8302a'); }
    /* Karte der Region Sursee mit Sempachersee */
    R(c, 4 * 16 + 4, 36, 34, 11, '#f4f4f0'); E(c, 4 * 16 + 24, 42, 8, 3, '#7ab0d8'); R(c, 4 * 16 + 8, 39, 6, 4, '#e8c8a0'); P(c, 4 * 16 + 11, 41, '#c8302a'); line(c, 4 * 16 + 5, 45, 4 * 16 + 36, 38, '#8a8e94');
    DECAL.clock(c, 12 * 16 + 3, 20);
  },
  build: (m) => {
    /* Schalter mit Glasscheibe */
    m.add(srWrap(objCounter(1, 5, 5, 1, { top: '#c9ccd2', front: '#1a3a8a' }), 14, (c, W, H) => { R(c, 2, 0, W - 4, 16, 'rgba(180,220,240,0.3)'); R(c, 2, 0, W - 4, 1, '#c9ccd2'); R(c, 2, 0, 1, 16, '#c9ccd2'); R(c, W - 3, 0, 1, 16, '#c9ccd2'); R(c, W / 2 - 6, 12, 12, 3, '#2a2a2e'); line(c, 6, 4, 12, 12, 'rgba(255,255,255,0.4)'); }));
    m.trig(1, 5, 5, 1, { label: 'Reden: Polizistin Fischer', act: () => Sur.talk('polizei') });
    srNpc(m, 'polizei', 'Polizistin Fischer', 3, 4, 0, 3601, { hair: 9, hairCol: 5, beard: 0, top: 1, topCol: 10, pants: 5, pantsCol: 8, hat: 0, glasses: 0, build: 2 }, () => Sur.talk('polizei'), ['dots', '!']);
    /* Arbeitsplatz mit Computer, Aktenschränke, Kaffeemaschine */
    const desk = mkObj(8, 4, 2, 1, 14, (c, W, H) => { R(c, 0, 12, W, H - 18, '#c9ccd2'); R(c, 0, 12, W, 1, '#e8eaee'); R(c, 1, H - 6, 2, 6, '#5a5e64'); R(c, W - 3, H - 6, 2, 6, '#5a5e64'); R(c, 8, 0, 16, 11, '#2a2a2e'); R(c, 9, 1, 14, 8, '#2a4a8a'); R(c, 15, 11, 2, 2, '#2a2a2e'); R(c, 6, 16, 14, 3, '#3a3a3e'); R(c, 24, 15, 4, 5, '#f4f0e6'); R(c, 2, 14, 3, 5, '#c8302a'); });
    desk.anim = (c, t, px, py) => { for (let k = 0; k < 4; k++) R(c, px + 10, py + 2 + k * 2, 3 + ((k * 5 + Math.floor(t * 2)) % 9), 1, '#9ad0ff'); if (Math.floor(t * 2) % 2) R(c, px + 20, py + 8, 2, 1, '#ffffff'); };
    m.add(desk); m.add(objChair(8, 5, 3, '#2a2a2e'));
    m.add(mkObj(12, 3, 1, 1, 18, (c, W, H) => { R(c, 1, 0, 14, H - 1, '#8a9096'); for (let k = 0; k < 4; k++) { R(c, 2, 2 + k * 8, 12, 7, '#a8b0b6'); R(c, 6, 5 + k * 8, 4, 1, '#3a3a3e'); } }));
    m.add(mkObj(11, 3, 1, 1, 10, (c, W, H) => { R(c, 2, 4, 12, H - 5, '#3a3a3e'); R(c, 3, 6, 10, 6, '#2a2a2e'); R(c, 6, 13, 4, 3, '#f4f0e6'); P(c, 11, 7, '#3ad07a'); }));
    m.add(objBench(9, 8, 0, '#1a3a8a')); m.add(objPlant(12, 8)); m.add(objPlant(1, 8));
    /* Arrestzelle mit Gitter, Prospektständer, Wartestühle */
    m.add(mkObj(11, 5, 2, 2, 16, (c, W, H) => { R(c, 0, 0, W, H - 2, '#5a5e64'); R(c, 2, 2, W - 4, H - 8, '#3a3c42'); R(c, 4, H - 18, 12, 5, '#6a6e74'); R(c, 4, H - 18, 12, 1, '#8a8e94'); for (let k = 2; k < W - 2; k += 4) R(c, k, 2, 2, H - 6, '#a8acb2'); R(c, 0, 2, W, 2, '#8a8e94'); R(c, 0, H - 6, W, 2, '#8a8e94'); R(c, W / 2 - 3, H / 2, 6, 4, '#c9a65a'); R(c, 4, 0, W - 8, 7, '#1a3a8a'); pxText(c, 'ZELLE', W / 2 - 9, 1, '#ffffff'); }));
    m.add(mkObj(5, 8, 1, 1, 14, (c, W, H) => { R(c, 7, 4, 2, H - 6, '#5a5e64'); R(c, 4, H - 3, 8, 2, '#5a5e64'); for (let k = 0; k < 3; k++) { R(c, 2, 2 + k * 6, 12, 5, ['#f4f0e6', '#e8c23a', '#7ab0d8'][k]); R(c, 3, 3 + k * 6, 6, 1, '#1a3a8a'); } }));
    for (const x of [2, 3]) m.add(objChair(x, 8, 0, '#1a3a8a'));
    m.add(srFlagStand(7, 3, SR_CLOTH.ch));
    m.add(mkObj(1, 7, 1, 1, 14, (c, W, H) => { R(c, 4, 4, 8, H - 5, '#c9ccd2'); R(c, 5, 0, 6, 8, '#a8d4ec'); R(c, 6, 1, 4, 6, '#c8e8f8'); R(c, 6, 14, 4, 2, '#3a8ae0'); }));
  } });

/* 18. Ehemaliges Kapuzinerkloster (1606–1608), heute Museum der Schweizer Kapuziner, mit Klostergarten */
sRoom('kloster', { name: 'Kapuzinerkloster', sign: false, w: 22, h: 13, door: 5, back: ['sursee', 'kloster_out'], style: 6, cap: '#4a3a2a', floor: T.STONE, floorV: 0, lightC: '#fff0d0', light: false,
  spots: {},
  wall: (c) => {
    pxText(c, 'MUSEUM DER KAPUZINER', 20, 19, '#5a3a24');
    DECAL.cross(c, 8 * 16 + 11, 16);
    srFrame(c, 4 * 16 + 2, 27, 14, 17, (c, x, y, w, h) => { R(c, x, y, w, h, '#3a2a1a'); E(c, x + 5, y + 3, 3, 3, '#e8c23a'); E(c, x + 5, y + 3, 2, 2, '#3a2a1a'); E(c, x + 5, y + 4, 2, 2, '#e0b090'); R(c, x + 2, y + 6, 7, 7, '#6a4428'); R(c, x + 2, y + 9, 7, 1, '#f4f0e6'); }, '#a8843a');
    srFrame(c, 5 * 16 + 4, 30, 22, 14, (c, x, y, w, h) => { R(c, x, y, w, h, '#a8c8d8'); R(c, x, y + 7, w, 3, '#7aa05a'); R(c, x + 4, y + 3, 10, 5, '#e8dcc8'); for (let i = 0; i < 4; i++) R(c, x + 4 + i, y + 3 - i, 10 - i * 2 + 4, 1, '#8a3a2a'); R(c, x + 13, y, 2, 6, '#e8dcc8'); R(c, x, y + 9, w, 2, '#4f8fb8'); }, '#a8843a');
    /* Kreuzgang-Bögen über dem Garten */
    for (let k = 0; k < 4; k++) { const ax = 12 * 16 + k * 36 + 4; R(c, ax, 26, 32, 22, '#2a3a2a'); for (let a = 0; a <= Math.PI; a += 0.04) { P(c, ax + 16 - Math.cos(a) * 16, 30 - Math.sin(a) * 10, '#c8bca0'); P(c, ax + 16 - Math.cos(a) * 14, 30 - Math.sin(a) * 9, '#b0a488'); } R(c, ax + 2, 30, 28, 18, '#9ec2d8'); R(c, ax + 2, 40, 28, 8, '#6a9a4a'); }
    for (let k = 0; k <= 4; k++) R(c, 12 * 16 + 2 + k * 36, 22, 4, 26, '#c8bca0');
  },
  build: (m) => {
    /* Trennmauer mit Rundbogen zum Garten */
    for (let y = 3; y < 12; y++) if (y !== 8) m.set(11, y, T.WALL);
    m.decal((c) => { R(c, 11 * 16 - 2, 8 * 16 - 6, 20, 6, '#c8bca0'); for (let a = 0; a <= Math.PI; a += 0.05) P(c, 11 * 16 + 8 - Math.cos(a) * 9, 8 * 16 - Math.sin(a) * 5, '#a89c84'); });
    /* Klostergarten: Wiese, Kieswege, Kräuterbeete, Brunnen */
    m.fill(12, 3, 9, 9, T.GRASS, 2);
    m.fill(12, 8, 9, 1, T.KIES); m.fill(16, 3, 1, 9, T.KIES); m.fill(15, 5, 3, 3, T.KIES);
    m.fill(12, 3, 9, 1, T.STONE, 0);
    for (const [x, y] of [[13, 5], [19, 5], [13, 10], [19, 10]]) { m.set(x, y, T.FLOWER); m.set(x + 1, y, T.FLOWER); }
    const fountain = mkObj(16, 6, 1, 1, 14, (c, W, H) => { E(c, 8, H - 6, 10, 6, '#8e877b'); E(c, 8, H - 7, 9, 5, '#c9c2b4'); E(c, 8, H - 7, 7, 4, '#3f86a8'); R(c, 6, H - 22, 4, 16, '#a8a090'); E(c, 8, H - 22, 3, 2, '#c9c2b4'); }, { padX: 4 });
    fountain.anim = (c, t, px, py) => { for (let k = 0; k < 5; k++) { const ph = (t * 1.5 + k / 5) % 1; P(c, px + 12 + Math.cos(k * 1.3) * ph * 6, py + 10 + ph * 12 - Math.sin(ph * 3.14) * 6, 'rgba(210,235,255,0.9)'); } P(c, px + 12, py + 8, '#e8f4fa'); };
    m.add(fountain);
    for (const x of [12, 14, 18, 20]) m.add(mkObj(x, 3, 1, 1, 20, (c, W, H) => { R(c, 5, 2, 6, H - 3, '#c8bca0'); R(c, 5, 2, 2, H - 3, '#e0d4b8'); R(c, 3, 0, 10, 3, '#b0a488'); R(c, 4, H - 3, 8, 2, '#a89c84'); }));
    m.add(objBush(20, 7, '#3f6a3a')); m.add(objBush(12, 7, '#3f6a3a', '#e8402e')); m.add(objTree(19, 11, 'green'));
    m.add(objBench(13, 9, 0, '#7a5a3a'));
    glitter(m, 14, 9, () => Sur.hiddenOpen('trainingsplan'));
    m.trig(13, 9, 2, 1, { label: 'Bank im Klostergarten', act: () => Sur.look('klosterbank') });
    m.birdSpots.push({ x: 17, y: 9, w: 3, h: 2, n: 2 });
    /* Museumsraum: Habits, Bücher, Lesepult, Vitrine mit Handschriften */
    m.add(srHabit(1, 3)); m.add(srHabit(2, 3)); m.add(srHabit(3, 3));
    m.decal((c) => srRug(c, 2 * 16, 9 * 16 + 2, 7 * 16, 2 * 16, '#6a4428', '#8a5a34'));
    m.add(srBookshelf(7, 3, 2)); m.add(srBookshelf(9, 3, 2, '#4a2e1a'));
    m.add(mkObj(5, 5, 1, 1, 10, (c, W, H) => { E(c, 8, H - 2, 5, 1, 'rgba(0,0,0,0.25)'); R(c, 7, H - 14, 2, 12, '#5a3a24'); R(c, 4, H - 3, 8, 2, '#5a3a24'); R(c, 0, H - 21, 16, 8, '#6a4428'); R(c, 1, H - 22, 14, 7, '#f0e4c8'); R(c, 7, H - 22, 2, 7, '#c8b890'); for (let k = 0; k < 3; k++) { R(c, 2, H - 20 + k * 2, 4, 1, '#3a2a1a'); R(c, 10, H - 20 + k * 2, 4, 1, '#3a2a1a'); } P(c, 2, H - 20, '#c8302a'); }));
    m.add(srVitrine(6, 7, 3, 1, (c, x, y, w, h) => { R(c, x + 2, y + h - 9, 12, 8, '#f0e4c8'); R(c, x + 3, y + h - 8, 4, 1, '#c8302a'); for (let k = 0; k < 3; k++) R(c, x + 3, y + h - 6 + k * 2, 10, 1, '#5a4a3a'); R(c, x + 18, y + h - 10, 12, 9, '#6a2a1a'); R(c, x + 19, y + h - 9, 10, 7, '#8a3a2a'); E(c, x + 24, y + h - 6, 2, 2, '#e8c23a'); R(c, x + 34, y + h - 6, 6, 5, '#c9a65a'); }, { dh: 14, label: true, bg: '#2a1a14' }));
    m.add(objBench(2, 9, 0, '#6a4428'));
    srNpc(m, 'kapuziner', 'Museumsführerin Agnes', 9, 9, 1, 3701, { hair: 16, hairCol: 9, beard: 0, top: 4, topCol: 17, pants: 5, pantsCol: 9, glasses: 6, hat: 0, build: 1 }, () => Sur.talk('kapuziner'), ['dots', '!']);
    m.add(objPlant(10, 11));
    m.light(5 * 16, 6 * 16, 60, '#fff0d0'); m.light(16 * 16, 7 * 16, 80, '#f8fff0');
  } });

/* 19. Gamma-Inseli im Sempachersee: winzige Insel (184 m²) mit hohen Bäumen, Schilf und einem Bootssteg */
MAP_BUILDERS.inseli = () => {
  const m = new GMap('inseli', 20, 15, { name: 'Gamma-Inseli', bg: '#2a5a6a', city: 'sursee' });
  m.fill(0, 0, 20, 15, T.WATER, 1);
  const land = (x, y) => ((x - 10) / 5.6) ** 2 + ((y - 6.5) / 4.3) ** 2 + (hash(x, y, 31) - 0.5) * 0.24;
  for (let y = 0; y < 15; y++) for (let x = 0; x < 20; x++) { const d = land(x, y); if (d <= 1) m.set(x, y, d > 0.62 ? T.KIES : T.GRASS, 2); }
  m.set(10, 11, T.DECK); m.set(10, 12, T.DECK); m.set(9, 12, T.DECK);
  /* Ufer weich zeichnen: keine Quaimauer, sondern seichtes Wasser und Kiesel */
  m.decal((c) => {
    for (let y = 0; y < 15; y++) for (let x = 0; x < 20; x++) {
      if (m.at(x, y) !== T.WATER) continue;
      const nb = [[0, -1], [0, 1], [-1, 0], [1, 0]].filter(([dx, dy]) => { const t = m.at(x + dx, y + dy); return t !== T.WATER && t !== T.VOID && t !== T.DECK; });
      R(c, x * 16, y * 16, 16, 16, '#3f86a8'); for (let i = 0; i < 4; i++) R(c, x * 16 + (hash(x, y, i) * 12 | 0), y * 16 + (hash(y, x, i) * 15 | 0), 4, 1, '#4f96b8');
      for (const [dx, dy] of nb) { const px = x * 16 + (dx > 0 ? 10 : 0), py = y * 16 + (dy > 0 ? 10 : 0), w = dx ? 6 : 16, h = dy ? 6 : 16; R(c, px, py, w, h, '#6aa8b8'); for (let i = 0; i < 5; i++) E(c, px + hash(x, i, 7) * (w - 1), py + hash(y, i, 8) * (h - 1), 1, 1, ['#a8a090', '#8a8478', '#c4bdb0'][i % 3]); }
    }
    for (let y = 0; y < 15; y++) for (let x = 0; x < 20; x++) if (m.at(x, y) === T.GRASS) for (let i = 0; i < 6; i++) { const px = x * 16 + hash(x, y, i + 20) * 14, py = y * 16 + hash(y, x, i + 30) * 14; R(c, px, py, 2, 1, ['#8a5a2a', '#a8742a', '#6a4a2a'][i % 3]); }
    /* Wurzeln */
    for (const [tx, ty] of [[7, 4], [12, 4], [9, 7]]) for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283 + 0.4; line(c, tx * 16 + 8, ty * 16 + 12, tx * 16 + 8 + Math.cos(a) * 13, ty * 16 + 12 + Math.sin(a) * 7, '#4a3220'); }
    R(c, 9 * 16, 11 * 16, 32, 2, '#73563a');
  });
  m.groundAnim = waterAnim;
  /* Alte Bäume: zwei grosse Laubbäume (Winterlaub), eine Eibe, Büsche */
  m.add(objTree(7, 4, 'autumn', true)); m.add(objTree(12, 4, 'green', true)); m.add(objTree(9, 7, 'yellow', true)); m.add(objFir(14, 6, 34));
  for (const [x, y, col] of [[6, 8, '#3f6a3a'], [13, 9, '#4f8040'], [11, 3, '#3f6a3a'], [8, 3, '#4f7a3a']]) m.add(objBush(x, y, col));
  /* Hohler Baumstrunk, Felsbrocken, Schilf */
  m.add(mkObj(11, 8, 1, 1, 10, (c, W, H) => { E(c, 8, H - 2, 7, 2, 'rgba(0,0,0,0.25)'); R(c, 2, H - 18, 12, 16, '#5a3c26'); R(c, 2, H - 18, 3, 16, '#6e4a30'); E(c, 8, H - 18, 6, 2, '#8a6a4a'); E(c, 8, H - 18, 4, 1, '#2a1a10'); E(c, 8, H - 9, 3, 4, '#1a100a'); for (let k = 0; k < 4; k++) P(c, 3 + k * 3, H - 14 + (k % 2) * 5, '#3a6a2a'); }));
  m.add(mkObj(5, 6, 1, 1, 6, (c, W, H) => { E(c, 8, H - 4, 8, 6, '#6a665e'); E(c, 7, H - 6, 7, 5, '#8a8478'); E(c, 5, H - 8, 3, 2, '#a8a298'); P(c, 10, H - 6, '#5a7a3a'); P(c, 11, H - 5, '#5a7a3a'); }));
  const reeds = (x, y) => { const o = mkObj(x, y, 1, 1, 14, (c, W, H) => { for (let k = 0; k < 9; k++) { const rx = 1 + k * 1.7, rh = 14 + (hash(x, y, k) * 10 | 0); line(c, rx, H - 2, rx + (k % 3) - 1, H - 2 - rh, k % 2 ? '#8a9a4a' : '#a8a05a'); if (k % 3 === 0) R(c, rx + (k % 3) - 1, H - 4 - rh, 2, 4, '#6a4a2a'); } }); return o; };
  for (const [x, y] of [[16, 6], [15, 9], [4, 8], [5, 4], [16, 4], [4, 6]]) if (m.at(x, y) === T.WATER) m.add(reeds(x, y));
  /* Suchstellen: unter dem Baum, im hohlen Strunk, im Schilf, beim Felsbrocken */
  const search = [[7, 4], [11, 8], [16, 6], [5, 6]];
  search.forEach(([x, y], k) => { glitter(m, x, y, () => Sur.maskSpot(k)); m.trig(x, y, 1, 1, { label: 'Absuchen', act: () => Sur.search(k) }); });
  /* Bootssteg mit Elektroboot */
  const boat = mkObj(11, 12, 2, 1, 12, (c, W, H) => {
    E(c, W / 2, H - 3, W / 2, 4, 'rgba(10,40,60,0.35)');
    R(c, 2, H - 12, W - 6, 8, '#f4f4f0'); for (let k = 0; k < 4; k++) R(c, W - 4 + k, H - 11 + k, 1, 7 - k * 2, '#f4f4f0'); R(c, 2, H - 7, W - 4, 2, '#2f5fb8'); R(c, 4, H - 11, W - 12, 4, '#8a6a4a');
    R(c, 6, H - 22, 1, 10, '#c9ccd2'); R(c, W - 12, H - 22, 1, 10, '#c9ccd2'); R(c, 4, H - 24, W - 14, 3, '#2f5fb8'); R(c, 4, H - 24, W - 14, 1, '#5a8ad8');
    R(c, 0, H - 11, 3, 6, '#3a3c42'); R(c, 1, H - 6, 1, 4, '#2a2a2e'); pxText(c, 'E', 22, H - 7, '#f4f4f0');
  });
  boat.anim = (c, t, px, py) => { for (let k = 0; k < 3; k++) { const ph = (t * 0.7 + k / 3) % 1; R(c, px - 2 + ph * 6, py + 26 + k, 5, 1, `rgba(220,240,255,${0.5 * (1 - ph)})`); R(c, px + 30 - ph * 4, py + 26 + k, 4, 1, `rgba(220,240,255,${0.5 * (1 - ph)})`); } };
  m.add(boat);
  m.add(mkObj(9, 11, 1, 1, 6, (c, W, H) => { R(c, 6, H - 14, 3, 12, '#5a3a24'); E(c, 7, H - 14, 2, 1, '#8a6a4a'); for (let k = 0; k < 3; k++) P(c, 7, H - 12 + k * 3, '#c8b890'); line(c, 9, H - 10, 22, H - 6, '#c8b890'); }));
  m.trig(11, 12, 2, 1, { label: 'Zum Boot', act: () => Sur.inseliBoat() });
  m.spawn('landing', 10, 12, 3);
  m.spots = { pfister: [10, 4, 0], friend: [11, 10, 3] };
  m.birdSpots.push({ x: 1, y: 10, w: 6, h: 3, n: 3, kind: 'duck' }, { x: 14, y: 1, w: 4, h: 2, n: 2, kind: 'duck' });
  return m;
};

const SURSEE_ROOMS = ['zunftstube', 'rathaus', 'wildermann', 'muehle', 'stadtcafe', 'tnt', 'roessli', 'mosquito', 'lafuga', 'craftwerk', 'surseepark', 'theater', 'sankturbanhof', 'stadthalle', 'kulturwerk', 'isa_haus', 'polizei', 'kloster', 'inseli'];
