/* ============ Sursee: Stadtkarte ============
   Vom Bahnhof im Westen über die (verkürzte) Bahnhofstrasse mit Surseepark und Martigny-Platz zum Untertor.
   Die Altstadt liegt quer: oben die Gasse der Oberstadt mit Rathaus, Stadtcafé und Wildem Mann, dahinter Kirche St. Georg,
   Obertor mit Stadttheater und Sankturbanhof, rechts davon der Märtplatz mit der Chilbi. Unten die Unterstadt mit dem
   offenen Sure-Arm, dem Diebenturm und der Mühle, jenseits der Stadtmauer der Ehret-Park mit dem zweiten Sure-Arm.
   Am oberen Ende führt der Weg über den Beckenhof und die Münstervorstadt zum See. */

/* --- Objekte --- */
/* Altstadthaus: Nach dem letzten grossen Stadtbrand von 1734 wurde die Oberstadt barock und einheitlich wieder aufgebaut –
   traufständige Häuser mit bemalten Fassaden, gemalten Fensterumrahmungen, Eckquadern und geschmiedeten Wirtshausschildern */
const ALT_WALLS = ['#ecd7ae', '#e9c9b7', '#d9e0c2', '#cbd6de', '#f1e7cf', '#e6bf98', '#e2d2e0', '#d8c8a0'];
function altHouse(m, x, y, w, h, i, o = {}) {
  const wall = o.wall || ALT_WALLS[i % ALT_WALLS.length], frame = shade(wall, -0.22);
  const b = objBuilding(x, y, w, h, Object.assign({ floors: 4, wall, roof: ['#8a3b2a', '#7a3424', '#9a4a30', '#83402c'][i % 4], trim: '#f6efe0', shutter: ['#3f6b45', '#7a3a2a', null, '#2f4a6a'][i % 4], seed: x * 31 + y * 7 + i, dormers: true, corner: true, lintel: true, wins: 'tall', flowers: i % 3 !== 1, drawH: 12,
    special: (c, W, H, fy0) => {
      /* Dachgesims und gemalter Fries */
      R(c, 0, fy0, W, 3, shade(wall, 0.12)); R(c, 0, fy0 + 3, W, 1, frame);
      for (let k = 2; k < W - 2; k += 6) P(c, k, fy0 + 5, frame);
      /* gemalte Fensterumrahmungen in den Obergeschossen */
      const fl = Math.min(o.floors || 4, 4);
      for (let f = 1; f < fl; f++) for (let k = 0; k < W / 16; k++) {
        if (o.erker && k >= o.erker[0] && k < o.erker[0] + o.erker[1]) continue;
        const cx = k * 16 + 8, yy = H - (f + 1) * 16 + 3;
        R(c, cx - 5, yy - 3, 10, 1, frame); P(c, cx - 5, yy - 2, frame); P(c, cx + 4, yy - 2, frame); R(c, cx - 1, yy - 4, 2, 1, frame);
        R(c, cx - 4, yy + 11, 8, 1, frame);
      }
      if (o.extra) o.extra(c, W, H, fy0);
    } }, o.bo || {}, o));
  m.add(b);
  return b;
}

/* Stadttor mit Durchgang. dir 'h': Gasse läuft West–Ost durch das Tor (Untertor); 'v': Gasse läuft Nord–Süd (Obertor) */
function objGate(x, y, w, h, o = {}) {
  const st = o.wall || '#d8c8a4', sd = shade(st, -0.2), sl = shade(st, 0.12), roof = o.roof || '#8a3b2a';
  const ob = mkObj(x, y, w, h, o.drawH || 34, (c, W, H) => {
    const top = 6;
    /* Turmkörper */
    R(c, 2, top + 10, W - 4, H - top - 10, st);
    for (let i = 0; i < W * H / 30; i++) P(c, 2 + hash(i, 3, x) * (W - 4), top + 10 + hash(i, 5, y) * (H - top - 12), hash(i, 7) > 0.5 ? sd : sl);
    for (let yy = top + 16; yy < H; yy += 10) R(c, 2, yy, W - 4, 1, sd);
    R(c, W - 4, top + 10, 2, H - top - 10, sd); R(c, 2, top + 10, 2, H - top - 10, sl);
    /* hohes, steiles Zeltdach mit Spitze und Kugel, beim Untertor mit kleinen Giebelgauben */
    const rh = o.roofH || 14;
    for (let k = 0; k < rh; k++) { const ww = Math.round((W + 4) * (0.06 + 0.94 * k / rh)); R(c, W / 2 - ww / 2, top + 10 - rh + k, ww, 1, k % 3 ? roof : shade(roof, -0.2)); }
    if (o.dormers) for (const gx of [W / 2 - 13, W / 2 + 5]) { R(c, gx, top - 4, 8, 9, '#f4f1e8'); for (let k = 0; k < 4; k++) R(c, gx - 1 + k, top - 8 + k, 10 - k * 2, 1, roof); R(c, gx + 3, top - 1, 2, 3, '#3a3a40'); }
    R(c, W / 2 - 1, top + 2 - rh, 2, 10, '#5a3a2a'); E(c, W / 2, top + 1 - rh, 2, 2, '#e8c84a'); R(c, W / 2, top - 6 - rh, 1, 7, '#3a3a40'); R(c, W / 2 + 1, top - 5 - rh, 3, 2, '#c8302a');
    /* Uhr und Wappen */
    E(c, W / 2, top + 22, 6, 6, '#2a2a2e'); E(c, W / 2, top + 22, 5, 5, '#f4f0e0'); line(c, W / 2, top + 22, W / 2, top + 18, '#1a1a1a'); line(c, W / 2, top + 22, W / 2 + 3, top + 23, '#1a1a1a');
    R(c, W / 2 - 4, top + 31, 8, 9, '#f4f0e6'); R(c, W / 2 - 4, top + 31, 8, 4, '#c8302a'); R(c, W / 2 - 1, top + 33, 2, 6, '#c8302a');
    for (const wx of [8, W - 12]) { R(c, wx, top + 34, 4, 6, '#3a3a40'); R(c, wx - 1, top + 33, 6, 1, sl); }
    /* Durchgang */
    const pass = o.pass;
    if (o.dir === 'v') {
      const px0 = (pass[0] - x) * 16, pw = pass[1] * 16;
      c.clearRect(px0 + 2, H - 30, pw - 4, 30);
      for (let k = 0; k < 8; k++) { const ww = Math.round(Math.sqrt(1 - (k / 8) ** 2) * (pw / 2 - 2)); c.clearRect(W / 2 - ww, H - 38 + k, ww * 2, 1); }
      R(c, px0, H - 31, 2, 31, sd); R(c, px0 + pw - 2, H - 31, 2, 31, sd);
      for (let k = 0; k < 8; k++) { const ww = Math.round(Math.sqrt(1 - (k / 8) ** 2) * (pw / 2 - 2)); P(c, W / 2 - ww - 1, H - 38 + k, sd); P(c, W / 2 + ww, H - 38 + k, sd); }
    } else {
      /* Gasse West–Ost: Wer durch das Tor geht, verschwindet kurz hinter der Südwand; ein dunkler Torbogen zeigt den Durchgang */
      const py0 = (pass[0] - y) * 16 + (o.drawH || 34), ph = pass[1] * 16;
      const ax = 5, aw = W - 10, top2 = py0 + 4;
      R(c, ax, top2, aw, ph - 4, 'rgba(34,28,24,0.62)');
      for (let k = 0; k < 10; k++) { const ww = Math.round(Math.sqrt(1 - (k / 10) ** 2) * (aw / 2)); R(c, W / 2 - ww, top2 - 10 + k, ww * 2, 1, 'rgba(34,28,24,0.62)'); P(c, W / 2 - ww - 1, top2 - 10 + k, sl); P(c, W / 2 + ww, top2 - 10 + k, sl); }
      for (let yy = top2 + 2; yy < top2 + ph - 4; yy += 5) R(c, ax + 2, yy, aw - 4, 1, '#3a3430');
      R(c, ax - 1, top2 - 1, 1, ph - 3, sd); R(c, ax + aw, top2 - 1, 1, ph - 3, sd);
      R(c, 0, H - 3, W, 3, '#8f887c');
    }
    if (o.label) { const tw = pxTextW(o.label) + 6; R(c, W / 2 - tw / 2, top + 11, tw, 7, '#2a2a2e'); pxText(c, o.label, W / 2 - tw / 2 + 3, top + 12, '#f4e8c0'); }
  }, { solid: false });
  return ob;
}
/* Stadtkirche St. Georg (1638–1641), nach Foto: weisser Bau mit braunem Ziegeldach, hohe Rundbogenfenster mit Wabenverglasung,
   ovale Obergadenfenster; Turm weiss mit grauen Gesimsen, geschweiften Giebeln und goldener Uhr auf rotem Grund, darauf eine rote
   achteckige Laterne mit goldenem Geländer und eine schlanke rote Spitze mit goldener Kugel und Kreuz. */
function objKirche(x, y) {
  return mkObj(x, y, 14, 5, 176, (c, W, H) => {
    c.translate(0, 56); H -= 56;
    const wall = '#f2f0ea', wd = '#d8d6d0', grey = '#b8b8b4', roof = '#7a5a3e', red = '#b8503a';
    const fy = H - 64;
    /* braunes Satteldach */
    for (let k = 0; k < 40; k++) R(c, 10 - k * 0.1, fy - 40 + k, W - 66 + k * 0.2, 1, k % 3 ? roof : shade(roof, -0.15));
    for (let k = 0; k < 40; k += 3) for (let xx = 12; xx < W - 58; xx += 5) P(c, xx + (k % 2) * 2, fy - 39 + k, shade(roof, 0.12));
    R(c, 8, fy - 2, W - 60, 3, grey);
    /* Langhaus */
    R(c, 8, fy, W - 60, 64, wall); R(c, 8, fy + 18, W - 60, 2, grey); R(c, 8, H - 6, W - 60, 6, wd);
    for (let k = 0; k < 4; k++) { const wx = 16 + k * 34; E(c, wx + 6, fy + 9, 5, 4, grey); E(c, wx + 6, fy + 9, 4, 3, '#4a5868'); R(c, wx, fy + 24, 13, 30, grey); R(c, wx + 1, fy + 26, 11, 28, '#4a5868'); E(c, wx + 6.5, fy + 26, 5.5, 4, '#4a5868'); for (let yy = fy + 26; yy < fy + 54; yy += 3) for (let xx = wx + 1 + ((yy / 3) % 2); xx < wx + 12; xx += 3) P(c, xx, yy, '#7a8a9a'); }
    /* Portal mit Treppe */
    const px = 66;
    R(c, px - 4, H - 36, 30, 36, wd); R(c, px, H - 30, 22, 30, '#5a3a24'); E(c, px + 11, H - 30, 11, 6, '#5a3a24'); R(c, px + 10, H - 30, 2, 30, '#3a2414');
    E(c, px + 11, H - 42, 4, 4, '#e8c84a');
    /* Turm */
    const tx = W - 50, tw = 34, tt = 40;
    R(c, tx, tt, tw, H - tt, wall); R(c, tx + tw - 4, tt, 4, H - tt, wd); R(c, tx, tt, 2, H - tt, '#ffffff');
    for (const yy of [tt + 30, tt + 62, tt + 96]) R(c, tx - 1, yy, tw + 2, 3, grey);
    for (const yy of [tt + 40, tt + 72]) { for (const dx of [9, 19]) { R(c, tx + dx, yy, 6, 14, '#3a4a3a'); E(c, tx + dx + 3, yy, 3, 2, '#3a4a3a'); for (let k = 2; k < 14; k += 2) R(c, tx + dx, yy + k, 6, 1, '#5a6a5a'); } }
    /* geschweifte Giebel und Uhr */
    c.fillStyle = wall; c.beginPath(); c.moveTo(tx - 3, tt + 4); c.quadraticCurveTo(tx + tw / 2, tt - 16, tx + tw + 3, tt + 4); c.closePath(); c.fill();
    c.strokeStyle = grey; c.lineWidth = 2; c.beginPath(); c.moveTo(tx - 3, tt + 4); c.quadraticCurveTo(tx + tw / 2, tt - 16, tx + tw + 3, tt + 4); c.stroke();
    R(c, tx - 3, tt + 4, tw + 6, 3, grey);
    E(c, tx + tw / 2, tt + 14, 8, 8, '#e8c84a'); E(c, tx + tw / 2, tt + 14, 7, 7, '#b84a2a'); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; P(c, Math.round(tx + tw / 2 + Math.cos(a) * 6), Math.round(tt + 14 + Math.sin(a) * 6), '#ffd23d'); } line(c, tx + tw / 2, tt + 14, tx + tw / 2, tt + 9, '#ffd23d'); line(c, tx + tw / 2, tt + 14, tx + tw / 2 + 4, tt + 15, '#ffd23d');
    /* Wasserspeier an den Ecken */
    for (const [gx, d] of [[tx - 4, -1], [tx + tw + 4, 1]]) { R(c, gx - 2, tt + 2, 4, 3, '#3f8e6a'); P(c, gx + d * 2, tt + 1, '#e8c84a'); }
    /* rote achteckige Laterne mit goldenem Geländer */
    const lx = tx + tw / 2, ly = tt - 10;
    R(c, lx - 10, ly - 4, 20, 6, red); for (let k = -9; k < 10; k += 3) P(c, lx + k, ly - 5, '#e8c84a'); R(c, lx - 10, ly - 6, 20, 1, '#e8c84a');
    R(c, lx - 8, ly - 22, 16, 18, red); R(c, lx + 4, ly - 22, 4, 18, shade(red, -0.2));
    for (const dx of [-5, 1]) { R(c, lx + dx, ly - 19, 4, 10, '#2a2a2e'); E(c, lx + dx + 2, ly - 19, 2, 2, '#2a2a2e'); }
    R(c, lx - 10, ly - 25, 20, 3, '#5a3a2a');
    /* rote Haube und schlanke Spitze mit goldener Kugel und Kreuz */
    for (let k = 0; k < 8; k++) { const ww = Math.round(18 - k * 2); R(c, lx - ww / 2, ly - 26 - k, ww, 1, red); }
    R(c, lx - 1, ly - 64, 2, 32, red); R(c, lx, ly - 64, 1, 32, shade(red, 0.2));
    E(c, lx, ly - 66, 2.5, 2.5, '#e8c84a'); E(c, lx, ly - 70, 1.5, 1.5, '#e8c84a'); R(c, lx, ly - 80, 1, 10, '#e8c84a'); R(c, lx - 2, ly - 77, 5, 1, '#e8c84a');
  }, { solid: true });
}
/* Rathaus Sursee (spätgotisch, 1539–1546), nach Foto: Die Schauseite zur Gasse ist ein mächtiger Treppengiebel in hellem Beige,
   mit Vordächern zwischen den Geschossen, Geranien an allen Fenstern, Sonnenuhr mit Figur in der Mitte, zwei Rundbogentüren,
   rot-weiss geflammten Läden im Giebel. Dahinter der Turm mit roter Zwiebelhaube und Laterne. */
function objRathaus(x, y) {
  return mkObj(x, y, 8, 7, 92, (c, W, H) => {
    const wall = '#ddd2b6', wd = shade(wall, -0.14), wl = shade(wall, 0.07), trim = '#b8ab8c', eave = '#6a5a4a';
    const base = H - 112; /* Oberkante der drei Vollgeschosse */
    /* Turm mit roter Zwiebelhaube hinten rechts */
    const tx = W - 30;
    R(c, tx, base - 70, 18, 70, '#ece6d8'); R(c, tx + 14, base - 70, 4, 70, '#cfc8b8');
    R(c, tx - 2, base - 74, 22, 5, '#5a5a5e');
    E(c, tx + 9, base - 84, 11, 10, '#b8402a'); E(c, tx + 6, base - 87, 4, 4, '#d8604a'); R(c, tx + 5, base - 98, 8, 10, '#ece6d8'); R(c, tx + 7, base - 96, 4, 6, '#3a3a40');
    E(c, tx + 9, base - 100, 6, 4, '#b8402a'); R(c, tx + 8, base - 112, 2, 10, '#5a5a5e'); E(c, tx + 9, base - 104, 2, 2, '#e8c84a'); R(c, tx + 10, base - 112, 5, 3, '#c8302a');
    /* Treppengiebel über die ganze Breite */
    const steps = 7, gh = 84;
    for (let k = 0; k < steps; k++) { const inset = Math.round((k + 1) * (W / 2 - 14) / steps); R(c, inset, base - (k + 1) * (gh / steps), W - inset * 2, gh / steps + 1, wall); R(c, inset - 2, base - (k + 1) * (gh / steps), 4, 2, wl); R(c, W - inset - 2, base - (k + 1) * (gh / steps), 4, 2, wl); }
    R(c, W / 2 - 14, base - gh - 6, 28, 8, wall);
    /* Fenster im Giebel mit rot-weiss geflammten Läden */
    const flamm = (fx, fy) => { R(c, fx, fy, 6, 7, '#3e4c5e'); for (let k = 0; k < 7; k++) { P(c, fx - 3 + (k % 3), fy + k, k % 2 ? '#c8302a' : '#f4f0e6'); P(c, fx + 7 + (k % 3), fy + k, k % 2 ? '#c8302a' : '#f4f0e6'); } };
    flamm(W / 2 - 3, base - 80); flamm(W / 2 - 22, base - 58); flamm(W / 2 + 16, base - 58);
    /* Vordach (Klebdach) am Giebelfuss und zwischen den Geschossen */
    for (const ey of [base - 40, base]) { R(c, 8, ey, W - 16, 3, eave); R(c, 8, ey + 3, W - 16, 1, '#3a2a1a'); for (let xx = 10; xx < W - 10; xx += 6) P(c, xx, ey + 4, '#3a2a1a'); }
    /* Fenster des Giebelgeschosses */
    for (const fx of [24, W / 2 - 14, W / 2 + 4, W - 32]) { R(c, fx - 1, base - 30, 12, 13, trim); R(c, fx, base - 29, 10, 11, '#3e4c5e'); R(c, fx + 5, base - 29, 1, 11, trim); }
    /* drei Vollgeschosse */
    R(c, 0, base + 4, W, H - base - 4, wall); R(c, W - 2, base + 4, 2, H - base - 4, wd); R(c, 0, base + 4, 2, H - base - 4, wl);
    R(c, 0, base + 40, W, 2, wd);
    const win = (fx, fy, pair) => { const ww = pair ? 20 : 11; R(c, fx - 1, fy - 1, ww + 2, 15, trim); if (pair) { R(c, fx, fy, 9, 13, '#3e4c5e'); R(c, fx + 11, fy, 9, 13, '#3e4c5e'); } else R(c, fx, fy, 11, 13, '#3e4c5e'); R(c, fx - 2, fy + 13, ww + 4, 3, '#5a3a24'); for (let k = 0; k < ww + 2; k += 2) { P(c, fx - 1 + k, fy + 12, k % 4 ? '#e8302a' : '#3f8a3a'); P(c, fx + k, fy + 11, '#d8303a'); } };
    /* 1. Obergeschoss (unter dem Vordach) */
    for (const fx of [8, 34, 64, W - 30]) win(fx, base + 12, true);
    /* 2. Obergeschoss mit Sonnenuhr in der Mitte */
    for (const fx of [10, 32, W - 50, W - 26]) win(fx, base + 48, false);
    R(c, W / 2 - 16, base + 44, 32, 26, '#f2ecd8'); R(c, W / 2 - 16, base + 44, 32, 1, trim);
    for (let k = 0; k < 9; k++) { const a = Math.PI * (k / 8); line(c, W / 2, base + 52, W / 2 - Math.cos(a) * 13, base + 52 + Math.sin(a) * 14, '#c8a050'); }
    line(c, W / 2, base + 52, W / 2 + 5, base + 64, '#3a2a1a'); E(c, W / 2, base + 49, 4, 4, '#e8c23a'); R(c, W / 2 - 3, base + 47, 6, 4, '#c8302a'); P(c, W / 2 - 1, base + 48, '#f4e0c0');
    /* Erdgeschoss: zwei Rundbogentüren, Fenster, Mittelpfeiler */
    for (const dx of [20, W - 36]) { R(c, dx - 2, H - 26, 20, 26, trim); R(c, dx, H - 24, 16, 24, '#5a2a1a'); E(c, dx + 8, H - 24, 8, 5, '#5a2a1a'); R(c, dx + 7, H - 22, 1, 22, '#3a1a10'); }
    for (const fx of [W / 2 - 22, W / 2 + 12]) { R(c, fx - 1, H - 24, 12, 11, trim); R(c, fx, H - 23, 10, 9, '#3e4c5e'); }
    R(c, W / 2 - 4, H - 34, 8, 34, '#cfc4a6'); R(c, W / 2 - 5, H - 34, 10, 3, trim);
    R(c, 0, H - 3, W, 3, '#8f887c');
  }, { solid: true, emit: (c, W, H) => { const base = H - 112; for (const fx of [8, 34, 64, W - 30]) { R(c, fx, base + 12, 9, 13, '#ffd27a'); R(c, fx + 11, base + 12, 9, 13, '#ffd27a'); } for (const fx of [10, 32, W - 50, W - 26]) if (hash(fx, 3) > 0.3) R(c, fx, base + 48, 11, 13, '#ffd27a'); } });
}
/* Diebenturm: wuchtiger Mauerturm mit Zeltdach, Zunftfahne und Schild der Zunft Heini von Uri */
function objDiebenturm(x, y) {
  return mkObj(x, y, 4, 8, 50, (c, W, H) => {
    c.translate(0, 10);
    const st = '#bfae8a', sd = shade(st, -0.22), sl = shade(st, 0.1);
    R(c, 4, 18, W - 8, H - 18, st);
    for (let yy = 22; yy < H; yy += 6) for (let xx = 4 + ((yy / 6) % 2) * 5; xx < W - 6; xx += 10) R(c, xx, yy, 9, 5, (xx + yy) % 3 ? st : sd);
    R(c, W - 7, 18, 3, H - 18, sd); R(c, 4, 18, 2, H - 18, sl);
    /* steiles Ziegeldach */
    for (let k = 0; k < 28; k++) { const ww = Math.round((W - 2) * (k / 28)); R(c, W / 2 - ww / 2, k - 10, ww, 1, k % 3 ? '#8a3b2a' : '#7a3424'); }
    R(c, 2, 18, W - 4, 3, '#5a4a3a');
    for (const yy of [30, 52]) { R(c, W / 2 - 2, yy, 4, 8, '#2a2a30'); }
    R(c, W / 2 - 7, H - 22, 14, 22, '#4a3420'); E(c, W / 2, H - 22, 7, 4, '#4a3420'); R(c, W / 2 - 6, H - 21, 12, 1, '#6a4a30'); P(c, W / 2 + 4, H - 10, '#e8c84a');
    /* Zunftfahne */
    R(c, W - 10, 8, 1, 22, '#3a3a40'); R(c, W - 9, 8, 12, 8, '#f2d040'); R(c, W - 9, 12, 12, 1, '#c8302a'); E(c, W - 3, 11, 2, 2, '#c8302a');
    /* Schild */
    R(c, 8, H - 34, W - 16, 8, '#2a2a2e'); pxText(c, '1681', W / 2 - 8, H - 33, '#e8dcc0');
  }, { solid: true });
}
/* Stadthalle (eröffnet 1988): ein Kind der Achtzigerjahre – knallgrüne Verkleidung, gelbe Rohre als Tragwerk und Geländer, blaue Akzente */
function objStadthalle(x, y) {
  return mkObj(x, y, 16, 8, 22, (c, W, H) => {
    const G1 = '#3fb04a', G2 = '#2f8f3a', G3 = '#5fc864', Y = '#f2d020', YD = '#c8a818', B = '#2f6ec8';
    /* flaches, leicht gewölbtes Dach mit Wellblech */
    R(c, 0, 6, W, 22, '#c9ccd2'); for (let xx = 0; xx < W; xx += 3) R(c, xx, 6, 1, 22, '#aeb2b8'); R(c, 0, 26, W, 3, '#8a8e94');
    /* grüne Fassade mit Profilblech */
    R(c, 0, 29, W, H - 29, G1); for (let xx = 0; xx < W; xx += 4) R(c, xx, 29, 1, H - 29, G2); R(c, 0, 29, W, 2, G3);
    /* gelbes Rohrtragwerk: Stützen, Diagonalen und ein durchlaufendes Rohr über dem Dach */
    for (let xx = 6; xx < W; xx += 32) { R(c, xx, 10, 4, H - 10, Y); R(c, xx + 3, 10, 1, H - 10, YD); E(c, xx + 2, 10, 3, 3, Y); }
    R(c, 0, 12, W, 3, Y); R(c, 0, 14, W, 1, YD);
    for (let xx = 6; xx < W - 32; xx += 32) { line(c, xx + 4, 16, xx + 32, 34, Y); line(c, xx + 4, 34, xx + 32, 16, Y); }
    /* blaue Fensterbänder und Eingang mit Glasfront */
    R(c, 12, 40, W - 24, 10, B); for (let xx = 14; xx < W - 14; xx += 10) R(c, xx, 42, 7, 6, '#9ac8f0');
    R(c, W / 2 - 40, H - 38, 80, 38, '#24303c'); for (let xx = W / 2 - 40; xx < W / 2 + 40; xx += 10) R(c, xx, H - 38, 2, 38, B); R(c, W / 2 - 40, H - 22, 80, 2, B);
    /* gelbes Vordach auf Rohrstützen */
    R(c, W / 2 - 48, H - 44, 96, 5, Y); R(c, W / 2 - 48, H - 40, 96, 1, YD); for (const px of [W / 2 - 46, W / 2 + 42]) R(c, px, H - 40, 3, 40, Y);
    pxText(c, 'STADTHALLE SURSEE', W / 2 - 32, 32, '#ffffff');
    /* Konzertplakate */
    R(c, 8, H - 34, 14, 20, '#1a1a2a'); R(c, 9, H - 33, 12, 8, '#e85a3a'); pxText(c, 'SG', 11, H - 23, '#ffd23d');
    R(c, W - 22, H - 34, 14, 20, '#1a1a2a'); R(c, W - 21, H - 33, 12, 8, '#3a8ae8'); R(c, W - 20, H - 23, 10, 2, '#ffffff');
  }, { solid: true, emit: (c, W, H) => { R(c, W / 2 - 40, H - 38, 80, 38, '#ffe2a0'); for (let xx = 14; xx < W - 14; xx += 10) R(c, xx, 42, 7, 6, '#ffe8b0'); pxText(c, 'STADTHALLE SURSEE', W / 2 - 32, 32, '#ffd23d'); } });
}
/* Surseepark: Einkaufszentrum mit Glasfront und grossem Migros-M */
function objSurseepark(x, y, w, h) {
  return mkObj(x, y, w, h, 10, (c, W, H) => {
    paintRoof(c, W, H - 52, { roofType: 'flat', roof: '#6a6e74' }, rng(5));
    R(c, 0, H - 52, W, 52, '#c9ccd2'); R(c, 0, H - 52, W, 3, '#e8eaec');
    R(c, 6, H - 34, W - 12, 31, '#5a7086'); for (let xx = 6; xx < W - 6; xx += 14) R(c, xx, H - 34, 1, 31, '#3a4a5a'); R(c, 6, H - 22, W - 12, 1, '#3a4a5a');
    for (let i = 0; i < 30; i++) R(c, 8 + hash(i, 2) * (W - 20), H - 18 + hash(i, 3) * 10, 3, 4, ['#ff7a1a', '#e8c23a', '#3f8e4b', '#c8352d', '#2f5fb8'][i % 5]);
    R(c, 10, H - 49, 70, 11, '#2a2e34'); pxText(c, 'SURSEEPARK', 14, H - 46, '#ffffff');
    R(c, W - 30, H - 50, 18, 14, '#ff6a00'); pxText(c, 'M', W - 24, H - 46, '#ffffff');
    R(c, W / 2 - 16, H - 34, 32, 31, '#2a3440'); R(c, W / 2 - 1, H - 34, 2, 31, '#8a9aa8');
  }, { solid: true, emit: (c, W, H) => { R(c, 6, H - 34, W - 12, 31, '#ffe8b8'); R(c, W - 30, H - 50, 18, 14, '#ff8a20'); pxText(c, 'M', W - 24, H - 46, '#ffffff'); pxText(c, 'SURSEEPARK', 14, H - 46, '#ffffff'); } });
}
/* Moderner Wohnblock (Münstervorstadt) */
function objBlock(x, y, w, h, col = '#e4e0d8', o = {}) {
  return mkObj(x, y, w, h, 18, (c, W, H) => {
    const fl = Math.floor((H - 10) / 15);
    R(c, 0, 4, W, H - 4, col); R(c, 0, 4, W, 3, '#5a5e64'); R(c, W - 2, 4, 2, H - 4, shade(col, -0.18));
    for (let f = 0; f < fl; f++) for (let xx = 4; xx < W - 8; xx += 14) { R(c, xx, 12 + f * 15, 10, 9, '#3e4c5e'); R(c, xx, 21 + f * 15, 10, 1, '#8a8e94'); if (o.balcony && f % 2 === 0) R(c, xx - 2, 22 + f * 15, 14, 2, o.balcony); }
    if (o.door != null) { const dx = o.door * 16; R(c, dx + 2, H - 16, 12, 16, '#3a3c40'); R(c, dx + 3, H - 15, 10, 15, '#7a96ac'); R(c, dx + 7, H - 15, 1, 15, '#3a3c40'); }
    if (o.name) { R(c, (o.door ?? 0) * 16 - 4, H - 24, pxTextW(o.name) + 6, 7, '#2a2e34'); pxText(c, o.name, (o.door ?? 0) * 16 - 1, H - 23, '#f4e8c0'); }
  }, { solid: true, emit: (c, W, H) => { const fl = Math.floor((H - 10) / 15); for (let f = 0; f < fl; f++) for (let xx = 4; xx < W - 8; xx += 14) if (hash(xx, f, x) > 0.45) R(c, xx, 12 + f * 15, 10, 9, '#ffd890'); } });
}
/* Riesenrad mit drehenden Gondeln */
function objRiesenrad(x, y) {
  const o = mkObj(x, y, 6, 2, 84, (c, W, H) => {
    const cx = W / 2, cy = 44;
    line(c, cx, cy, cx - 22, H - 4, '#8a8e94'); line(c, cx, cy, cx + 22, H - 4, '#8a8e94'); line(c, cx + 1, cy, cx - 21, H - 4, '#6a6e74'); line(c, cx - 1, cy, cx + 21, H - 4, '#6a6e74');
    R(c, cx - 20, H - 14, 40, 10, '#c8302a'); R(c, cx - 20, H - 14, 40, 2, '#f4e8c0'); pxText(c, 'RIESENRAD', cx - 17, H - 11, '#ffffff');
  }, { solid: true });
  o.anim = (c, t, px, py) => {
    const cx = px + 48, cy = py + 44, r = 36;
    c.strokeStyle = '#d8dce0'; c.lineWidth = 1; c.beginPath(); c.arc(cx + 0.5, cy + 0.5, r, 0, 6.283); c.stroke(); c.beginPath(); c.arc(cx + 0.5, cy + 0.5, r - 6, 0, 6.283); c.stroke();
    const n = 12, rot = t * 0.18;
    for (let k = 0; k < n; k++) { const a = rot + k / n * 6.283; line(c, cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, '#b8bcc2'); }
    for (let k = 0; k < n; k++) {
      const a = rot + k / n * 6.283, gx = Math.round(cx + Math.cos(a) * r), gy = Math.round(cy + Math.sin(a) * r);
      const col = ['#c8302a', '#2f5fb8', '#e8c23a', '#3f8e4b'][k % 4];
      R(c, gx - 3, gy + 1, 7, 6, col); R(c, gx - 3, gy + 1, 7, 1, shade(col, 0.3)); R(c, gx - 2, gy + 2, 5, 2, '#bfe0f0'); P(c, gx, gy, '#4a4a50');
      if (isNight()) P(c, gx, gy + 7, ['#ffef80', '#ff8ad0', '#80e0ff'][(k + Math.floor(t * 3)) % 3]);
    }
    E(c, cx, cy, 3, 3, '#e8c84a');
    if (isNight()) for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283 + rot; if ((k + Math.floor(t * 4)) % 3 === 0) P(c, Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), '#fff4b0'); }
  };
  return o;
}
/* Achterbahn: Gerüst mit Schienen und einem Zug, der die Runde fährt */
const COASTER = [];
(() => { for (let k = 0; k <= 200; k++) { const t = k / 200; const x = 8 + t * 176; const y = 50 - Math.abs(Math.sin(t * Math.PI * 2.2)) * 34 * (1 - t * 0.3) - (t < 0.15 ? t / 0.15 * 10 : 10) + 10; COASTER.push([x, y]); } })();
function objAchterbahn(x, y) {
  const o = mkObj(x, y, 12, 3, 52, (c, W, H) => {
    for (let k = 0; k < COASTER.length; k += 8) { const [px, py] = COASTER[k]; R(c, px, py + 3, 1, H - py - 6, '#8a8e94'); if (k % 16 === 0) line(c, px, py + 4, px + 8, H - 6, '#6a6e74'); }
    for (let k = 1; k < COASTER.length; k++) { const [a, b] = COASTER[k - 1], [d, e] = COASTER[k]; line(c, a, b, d, e, '#d8302a'); line(c, a, b + 2, d, e + 2, '#a8221e'); }
    R(c, 0, H - 14, 46, 12, '#2f5fb8'); R(c, 0, H - 14, 46, 2, '#f4e8c0'); pxText(c, 'LOOPING', 6, H - 11, '#ffd23d');
    R(c, W - 30, H - 16, 28, 14, '#5a3a24'); R(c, W - 28, H - 14, 24, 8, '#e8c23a'); pxText(c, 'KASSE', W - 27, H - 13, '#5a3a24');
  }, { solid: true });
  o.anim = (c, t, px, py) => {
    const ph = (t * 0.22) % 1.4; if (ph > 1) return;
    const i = Math.floor(ph * (COASTER.length - 1));
    for (let w = 0; w < 4; w++) { const j = Math.max(0, i - w * 5); const [cx, cy] = COASTER[j]; R(c, px + cx - 3, py + cy - 5, 6, 4, ['#ffd23d', '#2f5fb8', '#3f8e4b', '#e3589c'][w]); P(c, px + cx - 1, py + cy - 6, '#e8c8a0'); P(c, px + cx + 1, py + cy - 6, '#5a3a24'); }
  };
  return o;
}
/* Chilbi-Bude mit gestreiftem Dach, Theke und Auslage je nach Art */
function objBude(x, y, w, kind, label) {
  const cols = { schiess: ['#c8302a', '#f4e8c0'], lukas: ['#2f5fb8', '#f4e8c0'], enten: ['#3f8ec8', '#f4e8c0'], buechsen: ['#3f8e4b', '#f4e8c0'], magenbrot: ['#8a3b2a', '#f2d040'], marroni: ['#5a3a24', '#e8c870'], los: ['#e3589c', '#f4e8c0'] }[kind] || ['#c8302a', '#f4e8c0'];
  const o = mkObj(x, y, w, 2, 22, (c, W, H) => {
    R(c, 2, 14, W - 4, H - 14, '#5a3a24'); R(c, 4, 18, W - 8, H - 26, '#2a2026');
    for (let k = 0; k < W; k += 8) R(c, k, 4, 8, 12, (k / 8) % 2 ? cols[0] : cols[1]);
    for (let k = 0; k < W; k += 8) { E(c, k + 4, 16, 4, 2, (k / 8) % 2 ? cols[0] : cols[1]); }
    R(c, 0, 2, W, 2, shade(cols[0], -0.3));
    R(c, 2, H - 12, W - 4, 8, '#8a5a32'); R(c, 2, H - 12, W - 4, 2, '#a87a50');
    if (kind === 'schiess') { for (let k = 0; k < 5; k++) { R(c, 8 + k * (W - 16) / 5, 26, 5, 4, '#e8c23a'); P(c, 12 + k * (W - 16) / 5, 25, '#e88a2a'); } for (let k = 0; k < 4; k++) E(c, 10 + k * 12, 36, 3, 3, ['#e3589c', '#ffffff', '#7ab0f0', '#e8c23a'][k]); }
    if (kind === 'enten') { E(c, W / 2, 34, W / 2 - 8, 6, '#3f86c8'); for (let k = 0; k < 6; k++) { R(c, 10 + k * (W - 20) / 6, 31, 4, 3, '#ffd23d'); P(c, 13 + k * (W - 20) / 6, 30, '#e88a2a'); } }
    if (kind === 'buechsen') for (let r = 0; r < 3; r++) for (let k = 0; k <= r; k++) R(c, W / 2 - r * 3 + k * 6 - 2, 24 + r * 5, 4, 5, ['#c9ccd2', '#c8352d', '#2f5fb8'][(r + k) % 3]);
    if (kind === 'magenbrot' || kind === 'marroni') { for (let k = 0; k < 8; k++) E(c, 8 + k * (W - 16) / 8, H - 14, 3, 2, kind === 'marroni' ? '#6a3a20' : '#8a4a2a'); if (kind === 'marroni') { R(c, W - 14, 22, 8, 10, '#2a2a2e'); for (let k = 0; k < 3; k++) P(c, W - 12 + k * 2, 21, '#ff8a3a'); } }
    if (kind === 'los') for (let k = 0; k < 10; k++) R(c, 6 + (k % 5) * 7, 24 + Math.floor(k / 5) * 7, 5, 5, ['#e3589c', '#7ab0f0', '#ffd23d'][k % 3]);
    if (label) { const tw = pxTextW(label) + 6; R(c, W / 2 - tw / 2, 6, tw, 8, '#1a1a22'); pxText(c, label, W / 2 - tw / 2 + 3, 7, '#ffd23d'); }
  }, { solid: true, light: { dx: w * 8, dy: 10, r: 30, c: '#ffd27a' } });
  if (kind === 'lukas') o.anim = (c, t, px, py) => { R(c, px + w * 16 - 10, py - 30, 4, 52, '#e8e4dc'); for (let k = 0; k < 8; k++) R(c, px + w * 16 - 10, py - 28 + k * 6, 4, 1, k < 3 ? '#c8302a' : k < 6 ? '#e8c23a' : '#3f8e4b'); const h = Math.abs(Math.sin(t * 0.9)) * 40; R(c, px + w * 16 - 11, py + 18 - h, 6, 3, '#2a2a2e'); E(c, px + w * 16 - 8, py - 33, 4, 3, '#e8c84a'); };
  return o;
}
/* Autoscooter (Putschibahn) mit fahrenden Wagen */
function objPutschi(x, y, w, h) {
  const o = mkObj(x, y, w, h, 20, (c, W, H) => {
    R(c, 0, 6, W, 6, '#3a3c44'); for (let k = 0; k < W; k += 6) R(c, k, 6, 3, 6, '#e8c23a'); R(c, 0, 12, W, 2, '#2a2a30');
    R(c, 2, 20, W - 4, H - 22, '#4a4e58'); for (let k = 4; k < W - 4; k += 16) for (let j = 22; j < H - 2; j += 16) P(c, k, j, '#8a8e98');
    R(c, 0, 14, 3, H - 14, '#8a8e94'); R(c, W - 3, 14, 3, H - 14, '#8a8e94');
    pxText(c, 'PUTSCHIBAHN', W / 2 - 22, 8, '#1a1a22');
  }, { solid: true });
  o.anim = (c, t, px, py) => {
    for (let k = 0; k < 5; k++) { const a = t * (0.5 + k * 0.13) + k * 1.7; const cx = px + w * 8 + Math.cos(a) * (w * 6 - 12), cy = py + 20 + (h * 16 - 4) / 2 + Math.sin(a * 1.3) * ((h * 16 - 14) / 2 - 6); const col = ['#c8302a', '#2f5fb8', '#e8c23a', '#3f8e4b', '#e3589c'][k]; R(c, cx - 6, cy - 3, 12, 7, col); R(c, cx - 6, cy - 3, 12, 1, shade(col, 0.3)); E(c, cx, cy - 2, 2, 2, '#e8c8a0'); line(c, cx, cy - 4, cx, cy - 14, '#8a8e94'); if ((Math.floor(t * 9) + k) % 7 === 0) P(c, cx, cy - 15, '#fff4a0'); }
  };
  return o;
}
/* Marktstand (Martigny-Platz) */
function objMarktstand(x, y, col = '#3f8e4b') {
  return mkObj(x, y, 2, 1, 14, (c, W, H) => {
    for (let k = 0; k < W; k += 6) R(c, k, 0, 6, 6, (k / 6) % 2 ? col : '#f4f0e6');
    R(c, 2, 6, 1, H - 6, '#5a3a24'); R(c, W - 3, 6, 1, H - 6, '#5a3a24');
    R(c, 1, H - 8, W - 2, 6, '#8a5a32'); for (let k = 0; k < 7; k++) E(c, 4 + k * 4, H - 9, 2, 1, ['#e8402e', '#e8c23a', '#3f8e4b', '#ff8a2a'][k % 4]);
  }, { solid: true });
}
/* Velo-Station mit Mietvelos */
function objVelos(x, y, n = 4) {
  return mkObj(x, y, n, 1, 8, (c, W, H) => {
    R(c, 0, H - 4, W, 2, '#6a6e74');
    for (let k = 0; k < n; k++) { const vx = k * 16 + 8; E(c, vx - 4, H - 5, 3, 3, 'rgba(0,0,0,0)'); c.strokeStyle = '#2a2a2e'; c.beginPath(); c.arc(vx - 4, H - 6, 3, 0, 6.283); c.stroke(); c.beginPath(); c.arc(vx + 4, H - 6, 3, 0, 6.283); c.stroke(); line(c, vx - 4, H - 6, vx, H - 10, '#c8302a'); line(c, vx, H - 10, vx + 4, H - 6, '#c8302a'); line(c, vx - 1, H - 10, vx + 3, H - 10, '#c8302a'); P(c, vx - 1, H - 12, '#1a1a1a'); }
  }, { solid: true });
}
/* Spielplatz: Schaukel und Rutschbahn */
function objSpielplatz(x, y) {
  return mkObj(x, y, 5, 2, 24, (c, W, H) => {
    R(c, 4, 4, 2, H - 6, '#8a5a32'); R(c, 30, 4, 2, H - 6, '#8a5a32'); R(c, 4, 4, 28, 2, '#8a5a32');
    for (const sx of [12, 22]) { line(c, sx, 6, sx, 26, '#5a5e64'); line(c, sx + 4, 6, sx + 4, 26, '#5a5e64'); R(c, sx - 1, 26, 7, 2, '#c8302a'); }
    R(c, 48, 8, 10, 4, '#e8c23a'); R(c, 50, 12, 2, H - 14, '#5a5e64'); R(c, 56, 12, 2, H - 14, '#5a5e64');
    for (let k = 0; k < 20; k++) R(c, 58 + k, 10 + k * 1.2, 2, 3, '#3f8ec8');
    R(c, 40, H - 12, 14, 8, '#d9c9a2'); R(c, 40, H - 12, 14, 1, '#8a5a32');
  }, { solid: true });
}
/* Infotafel */
function objTafel(x, y, col = '#2a3a2e', txt = 'INFO') {
  return mkObj(x, y, 1, 1, 14, (c, W, H) => { R(c, 3, 10, 2, H - 10, '#5a3a24'); R(c, 11, 10, 2, H - 10, '#5a3a24'); R(c, 1, 0, 14, 12, col); R(c, 1, 0, 14, 1, shade(col, 0.4)); pxText(c, txt.slice(0, 3), 2, 3, '#f4e8c0'); }, { solid: true });
}
/* Brunnen (Marienbrunnen / Ehret-Park) */
function objBrunnenSursee(x, y, figure = true) {
  const o = mkObj(x, y, 2, 2, 22, (c, W, H) => {
    E(c, W / 2, H - 9, 14, 7, '#9a978f'); E(c, W / 2, H - 10, 12, 5, '#3f86a8'); E(c, W / 2, H - 11, 9, 3, '#5aa0c0');
    R(c, W / 2 - 2, H - 34, 4, 24, '#c8bfa8');
    if (figure) { R(c, W / 2 - 3, H - 44, 6, 10, '#4f7aa8'); E(c, W / 2, H - 46, 2, 2, '#e8d8c0'); R(c, W / 2 - 3, H - 49, 6, 2, '#e8c84a'); }
  }, { solid: true });
  o.anim = (c, t, px, py) => { for (let k = 0; k < 3; k++) { const ph = (t * 1.5 + k / 3) % 1; P(c, px + 16 + (k - 1) * 3, py + 22 + 12 - ph * 6, 'rgba(200,230,255,0.85)'); } };
  return o;
}
/* Stadtmauer-Abschnitt */
function objMauer(x, y, w) {
  return mkObj(x, y, w, 1, 10, (c, W, H) => {
    R(c, 0, 2, W, H - 2, '#b8a888'); for (let yy = 4; yy < H; yy += 5) for (let xx = (yy % 2) * 4; xx < W; xx += 8) R(c, xx, yy, 7, 4, (xx + yy) % 3 ? '#c4b494' : '#a89878');
    for (let xx = 0; xx < W; xx += 8) R(c, xx, 0, 5, 3, '#a89878');
  }, { solid: true });
}

/* Bauernhof mit Scheune */
function objScheune(x, y, w, h) {
  return mkObj(x, y, w, h, 16, (c, W, H) => {
    for (let k = 0; k < 22; k++) R(c, 2 + k * 0.5, k, W - 4 - k, 1, k % 3 ? '#8a3b2a' : '#7a3424');
    R(c, 4, 22, W - 8, H - 22, '#9a6a3a'); for (let xx = 4; xx < W - 4; xx += 5) R(c, xx, 22, 1, H - 22, '#7a4a28');
    R(c, W / 2 - 12, H - 26, 24, 26, '#5a3a20'); line(c, W / 2 - 12, H - 26, W / 2 + 12, H - 1, '#7a4a28'); line(c, W / 2 + 12, H - 26, W / 2 - 12, H - 1, '#7a4a28');
    R(c, 8, 30, 8, 6, '#3e4c5e'); R(c, W - 16, 30, 8, 6, '#3e4c5e');
  }, { solid: true });
}
/* Gänsegehege: Zaun und schnatternde Gänse */
function objGehege(x, y, w, h) {
  const o = mkObj(x, y, w, h, 4, (c, W, H) => {
    R(c, 0, 4, W, H - 4, '#7a9a4a'); for (let i = 0; i < W * H / 30; i++) P(c, hash(i, 1, x) * W, 4 + hash(i, 2, y) * (H - 4), '#6a8a3a');
    for (let xx = 0; xx < W; xx += 6) { R(c, xx, 0, 2, 10, '#8a6a3a'); R(c, xx, H - 10, 2, 10, '#8a6a3a'); }
    R(c, 0, 2, W, 1, '#a88a5a'); R(c, 0, 6, W, 1, '#a88a5a'); R(c, 0, H - 8, W, 1, '#a88a5a'); R(c, 0, H - 4, W, 1, '#a88a5a');
    R(c, 0, 0, 2, H, '#8a6a3a'); R(c, W - 2, 0, 2, H, '#8a6a3a');
    E(c, W - 14, H - 14, 8, 4, '#4a86a8');
  }, { solid: true });
  o.anim = (c, t, px, py) => {
    for (let k = 0; k < 6; k++) {
      const gx = px + 10 + ((hash(k, 4) * (w * 16 - 24) + Math.sin(t * 0.4 + k) * 10) | 0), gy = py + 14 + ((hash(k, 7) * (h * 16 - 22) + Math.cos(t * 0.3 + k * 2) * 6) | 0), f = Math.sin(t * 0.4 + k) < 0 ? -1 : 1;
      E(c, gx, gy, 4, 3, '#f4f0e6'); R(c, gx + f * 3, gy - 7, 2, 6, '#f4f0e6'); E(c, gx + f * 4, gy - 7, 2, 2, '#f4f0e6'); P(c, gx + f * 6, gy - 7, '#e8902a'); P(c, gx + f * 4, gy - 8, '#1a1a1a');
      if (Math.floor(t * 2 + k) % 9 === 0) { R(c, gx + f * 4, gy - 9, 1, 2, '#e8902a'); }
    }
  };
  return o;
}
/* Schrebergarten-Parzelle mit Häuschen, Beeten und Zaun */
function objGarten(x, y, i) {
  return mkObj(x, y, 4, 3, 10, (c, W, H) => {
    R(c, 0, 10, W, H - 10, '#6a8a3a'); for (let r = 0; r < 4; r++) R(c, 4, 16 + r * 6, W - 30, 3, '#5a3a24');
    for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) P(c, 6 + k * 5, 15 + r * 6, ['#3f8a3a', '#c8402a', '#e8c23a'][(i + r) % 3]);
    const hx = W - 22; R(c, hx, 10, 18, 16, ['#8a5a32', '#4f7a8a', '#a84a3a'][i % 3]); for (let k = 0; k < 6; k++) R(c, hx - 1 + k, 4 + k, 20 - k * 2, 1, '#5a5e64'); R(c, hx + 7, 18, 5, 8, '#3a2a1a');
    for (let xx = 0; xx < W; xx += 4) R(c, xx, H - 4, 1, 4, '#c9b89a'); R(c, 0, H - 3, W, 1, '#c9b89a');
  }, { solid: true });
}

/* --- Karte --- */
MAP_BUILDERS.sursee = () => {
  const W = 132, H = 80;
  const m = new GMap('sursee', W, H, { name: 'Sursee', city: 'sursee', bg: '#2f4a2a' });
  m.fill(0, 0, W, H, T.GRASS, 1);
  /* Bahnlinie und Perron im Westen */
  m.fill(0, 0, 3, H, T.RAIL); m.fill(3, 0, 1, H, T.EDGE, 1); m.fill(4, 18, 2, 32, T.PLAT);
  /* Bahnhof Sursee */
  m.add(objBuilding(6, 26, 9, 6, { floors: 3, wall: '#d8d4cc', roof: '#8a9096', roofType: 'flat', trim: '#e8eaec', flowers: false, allShop: true, goods: ['#e8eaec', '#7ad0f0'], seed: 61, drawH: 8,
    doors: [{ dx: 4, type: 'glass' }], sign: { text: 'SURSEE', bg: '#d8302a', fg: '#ffffff', y: 6 } }));
  m.fill(4, 32, 16, 10, T.PLAZA, 1);
  m.add(objVelos(6, 38, 4)); m.trig(6, 38, 4, 1, { label: 'Velostation: Velo mieten', act: () => Sur.veloRent() });
  m.add(mkObj(14, 33, 1, 1, 12, (c, Wd, Hd) => { R(c, 2, 0, 12, Hd - 1, '#c8302a'); R(c, 4, 3, 8, 7, '#1a2a3a'); R(c, 5, 4, 6, 1, '#7ad0f0'); pxText(c, 'CHF', 4, 5, '#ffffff'); R(c, 5, 13, 6, 2, '#2a2a2e'); R(c, 4, 18, 8, 3, '#e8e4dc'); }, { solid: true, light: { dx: 8, dy: 4, r: 18, c: '#7ad0f0' } }));
  m.trig(14, 33, 1, 1, { label: 'Bankomat', act: () => Sur.atm() });
  m.add(objTafel(11, 33, '#1a3a7a', 'BUS'));
  for (const [x, y] of [[4, 34], [18, 34]]) m.add(objLamp(x, y, 'new'));
  m.add(objBench(16, 40, 0, '#6a6e74'));
  /* Polizeiposten */
  m.add(objBlock(15, 26, 4, 6, '#d8dce0', { door: 2, name: 'POLIZEI' }));
  m.warp(17, 31, 'polizei', 'entry', { label: 'Polizeiposten' }); m.spawn('polizei_out', 17, 32, 0);
  /* Bahnhofstrasse */
  m.fill(4, 36, 47, 1, T.PAVE); m.fill(18, 37, 33, 3, T.ASPH); m.fill(18, 38, 33, 1, T.ASPH, 1); m.fill(18, 40, 33, 1, T.PAVE);
  m.fill(4, 37, 14, 3, T.PLAZA, 1);
  for (const x of [22, 30, 38, 46]) m.add(objLamp(x, 36, 'new'));
  for (const x of [24, 34, 44]) m.add(objTree(x, 41, 'green'));
  /* Surseepark */
  m.fill(19, 24, 20, 12, T.PAVE, 2);
  m.add(objSurseepark(20, 27, 18, 8));
  m.warp(28, 34, 'surseepark', 'entry', { w: 2, label: 'Surseepark' }); m.spawn('surseepark_out', 28, 36, 0);
  m.add(objPlanter(20, 35)); m.add(objPlanter(37, 35, '#f2c23a'));
  /* Kapuzinerkloster an der Geuenseestrasse */
  m.fill(40, 4, 2, 32, T.ASPH); m.fill(40, 4, 2, 32, T.ASPH, 0);
  m.fill(26, 6, 13, 12, T.GRAVEL);
  m.add(objBuilding(27, 6, 10, 6, { floors: 3, wall: '#efe6d2', roof: '#7a4a3a', trim: '#f8f2e4', flowers: false, wins: 'arch', seed: 71, drawH: 12, doors: [{ dx: 5, type: 'arch' }],
    special: (c, Wd, Hd, fy0) => { R(c, Wd - 28, fy0 - 26, 8, 22, '#efe6d2'); for (let k = 0; k < 8; k++) R(c, Wd - 28 + k / 2, fy0 - 34 + k, 8 - k, 1, '#7a4a3a'); R(c, Wd - 25, fy0 - 20, 2, 4, '#3a3a40'); pxText(c, 'KAPUZINER', 6, Hd - 26, '#7a5a3a'); } }));
  m.warp(32, 11, 'kloster', 'entry', { label: 'Kapuzinerkloster' }); m.spawn('kloster_out', 32, 12, 0);
  for (const [x, y] of [[27, 15], [36, 15]]) m.add(objTree(x, y, 'green', true));
  for (let x = 26; x < 39; x++) if (x < 31 || x > 33) m.set(x, 17, T.HEDGE);
  m.fill(31, 12, 3, 6, T.GRAVEL, 0);
  m.fill(31, 18, 3, 1, T.PAVE); m.fill(34, 18, 6, 1, T.PAVE);
  /* Römischer Vicus: Grabungsfeld mit Mauerresten und Tafel */
  m.fill(20, 42, 18, 9, T.MEADOW);
  m.fill(23, 44, 12, 5, T.GRAVEL);
  for (const [x, y, w] of [[23, 44, 5], [30, 44, 5], [23, 48, 12]]) m.add(mkObj(x, y, w, 1, 3, (c, Wd, Hd) => { for (let xx = 0; xx < Wd; xx += 6) R(c, xx, Hd - 7, 5, 5, (xx / 6) % 2 ? '#a89878' : '#b8a888'); }, { solid: false }));
  m.add(objTafel(21, 43, '#6a3a20', 'ROM'));
  m.trig(21, 43, 1, 1, { label: 'Tafel: Römischer Vicus', act: () => Sur.look('vicus') });
  m.trig(23, 45, 12, 3, { here: true, label: 'Mit dem Metalldetektor suchen', act: () => Sur.detector(), cond: () => Sur.canDetect() });
  /* Feuerwehr mit dem Kulturwerk 118 im Keller */
  m.fill(16, 42, 2, 14, T.ASPH);
  m.fill(4, 43, 12, 13, T.ASPH, 0);
  m.add(objBuilding(4, 44, 11, 6, { floors: 3, wall: '#e8e4dc', roof: '#6a6e74', roofType: 'flat', trim: '#c8302a', flowers: false, seed: 81, drawH: 8, doors: [{ dx: 9, col: '#2a2a2e', lit: true }],
    special: (c, Wd, Hd) => { for (let k = 0; k < 3; k++) { R(c, 6 + k * 34, Hd - 30, 30, 28, '#c8302a'); for (let yy = Hd - 28; yy < Hd - 2; yy += 4) R(c, 6 + k * 34, yy, 30, 1, '#a8221e'); } R(c, 4, 20, 68, 8, '#c8302a'); pxText(c, 'FEUERWEHR SURSEE', 6, 21, '#ffffff'); R(c, Wd - 30, Hd - 40, 26, 9, '#1a1a1e'); pxText(c, '118', Wd - 27, Hd - 38, '#ff3a3a'); },
    specialNight: (c, Wd, Hd) => { R(c, Wd - 30, Hd - 40, 26, 9, '#1a1a1e'); pxText(c, '118', Wd - 27, Hd - 38, '#ff5a5a'); } }));
  m.warp(13, 49, 'kulturwerk', 'entry', { label: 'Kulturwerk 118', guard: () => Sur.kulturwerkDoor() }); m.spawn('kulturwerk_out', 13, 50, 0);
  m.light(13 * 16 + 8, 47 * 16, 26, '#ff4a4a');
  /* Martigny-Platz mit Wochenmarkt */
  m.fill(41, 41, 9, 10, T.PLAZA, 2);
  for (const [x, y, col] of [[42, 43, '#3f8e4b'], [45, 43, '#c8302a'], [42, 47, '#e8a020'], [45, 47, '#2f5fb8']]) m.add(objMarktstand(x, y, col));
  m.add(objBude(47, 45, 2, 'marroni', 'MARRONI')); m.trig(47, 46, 2, 1, { label: 'Marroni-Stand', act: () => Story.shop('marroni') });
  m.trig(42, 44, 5, 1, { label: 'Wochenmarkt', act: () => Sur.look('markt') });
  m.add(objTafel(48, 42, '#3a5a3a', 'MRT'));
  /* Sure: Hauptlauf nach Norden, beide Arme treffen sich unterhalb des Untertors */
  m.fill(43, 0, 13, 24, T.GRASS, 2);
  m.fill(50, 0, 2, 64, T.WATER);
  m.fill(50, 37, 2, 4, T.BRIDGE);
  for (const [x, y, k] of [[45, 4, 'green'], [47, 12, 'yellow'], [44, 19, 'green'], [48, 27, 'autumn'], [46, 32, 'green'], [54, 6, 'green']]) m.add(objTree(x, y, k, k === 'green'));
  m.birdSpots.push({ x: 50, y: 10, w: 2, h: 18, n: 4, kind: 'duck' });
  /* St. Urban-Strasse am Ostufer bis zur Stadthalle */
  m.fill(52, 9, 2, 28, T.ASPH); m.fill(52, 9, 20, 2, T.ASPH);
  m.add(mkObj(52, 22, 1, 1, 10, (c) => { R(c, 7, 4, 2, 10, '#5a5e64'); R(c, 1, 0, 14, 6, '#1a3a7a'); pxText(c, 'ST.URB', 1, 1, '#ffffff'); }, { solid: false }));
  /* Vierherrenplatz mit Pfarreizentrum */
  m.fill(54, 12, 10, 8, T.PLAZA, 1);
  m.add(objBlock(55, 12, 7, 4, '#d8d0c0', { door: 3, name: 'PFARREIZENTRUM', balcony: '#8a8e94' }));
  m.trig(57, 15, 3, 1, { label: 'Pfarreizentrum', act: () => Sur.look('pfarreizentrum') });
  m.add(objTree(62, 18, 'green')); m.add(objBench(56, 18, 0)); m.add(objTafel(54, 19, '#3a3a5a', 'VHP'));
  /* Heinibrunnen: 1975 vor dem Rathaus gebaut, 1979 mit der Figur des Heini von Uri von August Bläsi, seit 2001 am Vierherrenplatz */
  const heini = objBrunnenSursee(59, 17, false); m.add(heini);
  const heiniFig = heini.anim; heini.anim = (c, t, px, py) => { heiniFig(c, t, px, py); const x = px + 16, y = py + 22 + 2; R(c, x - 3, y - 18, 6, 10, '#e8c23a'); R(c, x - 3, y - 18, 3, 10, '#c8302a'); E(c, x, y - 21, 2, 2, '#e8d8c0'); line(c, x - 2, y - 23, x - 5, y - 27, '#c8302a'); line(c, x + 2, y - 23, x + 5, y - 27, '#e8c23a'); P(c, x - 5, y - 28, '#ffd23d'); P(c, x + 5, y - 28, '#ffd23d'); line(c, x + 3, y - 15, x + 7, y - 19, '#8a6a3a'); };
  m.trig(59, 17, 2, 2, { label: 'Heinibrunnen', act: () => Sur.look('heinibrunnen') });
  m.trig(58, 19, 4, 1, { here: true, label: 'Foto: Heinibrunnen', act: () => Sur.photo('heinibrunnen'), cond: () => !Sur.hasPhoto('heinibrunnen') });
  m.trig(54, 19, 1, 1, { label: 'Vierherrenplatz', act: () => Sur.look('vierherrenplatz') });
  /* Stadthalle */
  m.fill(64, 0, 20, 11, T.PAVE, 2);
  m.add(objStadthalle(65, 1, 16, 8));
  m.warp(72, 8, 'stadthalle', 'entry', { w: 2, label: 'Stadthalle', guard: () => Sur.stadthalleDoor() }); m.spawn('stadthalle_out', 72, 10, 0);
  for (const x of [66, 79]) m.add(objLamp(x, 10, 'new'));
  /* Theaterstrasse hinter der oberen Häuserreihe */
  m.fill(52, 27, 44, 3, T.COBBLE, 1);
  /* Sankturbanhof und Stadttheater beim Obertor */
  /* Sankturbanhof (1596–1598): Amtshaus des Klosters St. Urban mit Treppengiebeln und Erker */
  m.add(objBuilding(55, 21, 7, 6, { floors: 3, wall: '#efe0c0', roof: '#7a4a3a', trim: '#fbf4dc', seed: 91, wins: 'tall', lintel: true, flowers: false, drawH: 22, doors: [{ dx: 3, col: '#5a3a24' }], sign: { text: 'SANKTURBANHOF', bg: '#5a4a38', fg: '#f4e8c0' }, erker: [5, 1], erkerCol: '#f4e8cc',
    special: (c, Wd, Hd, fy0) => { for (const [gx, d] of [[0, 1], [Wd - 22, -1]]) for (let st = 0; st < 5; st++) { const ww = 22 - st * 4, xx = d > 0 ? gx : gx + st * 4; R(c, xx, fy0 - 26 + st * 5, ww, 6, st % 2 ? '#efe0c0' : '#f6ead0'); R(c, xx, fy0 - 26 + st * 5, ww, 1, '#fffaf0'); } } }));
  m.warp(58, 26, 'sankturbanhof', 'entry', { label: 'Museum Sankturbanhof', guard: () => Sur.openGuard('museum') }); m.spawn('sankturbanhof_out', 58, 27, 0);
  m.trig(55, 28, 6, 1, { here: true, label: 'Foto: Sankturbanhof', act: () => Sur.photo('sankturbanhof'), cond: () => !Sur.hasPhoto('sankturbanhof') });
  /* Stadttheater (1925/26, historisierend; 1998–2000 mit neuem Foyer und Bühnenhaus erweitert) */
  m.add(objBuilding(62, 20, 8, 7, { floors: 3, wall: '#ece4d4', roof: '#6a5a52', trim: '#ffffff', seed: 93, wins: 'arch', lintel: true, corner: true, flowers: false, drawH: 14, doors: [{ dx: 4, type: 'glass', lit: true }], shopWins: [5, 6, 7], goods: ['#e8c890', '#c8352d'], sign: { text: 'STADTTHEATER', bg: '#2a2a2e', fg: '#f4e8c0', lit: true },
    special: (c, Wd, Hd, fy0) => { R(c, Wd - 48, Hd - 20, 48, 20, '#5a6a78'); R(c, Wd - 46, Hd - 18, 44, 14, '#9ac0d8'); for (let xx = Wd - 46; xx < Wd - 2; xx += 8) R(c, xx, Hd - 18, 1, 14, '#5a6a78'); R(c, 6, fy0 - 14, Wd - 60, 14, '#ece4d4'); for (let k = 0; k < 7; k++) R(c, 6 + (Wd - 60) / 2 - k * 4, fy0 - 21 + k, k * 8, 1, '#ece4d4'); } }));
  m.warp(66, 26, 'theater', 'entry', { label: 'Stadttheater', guard: () => Sur.openGuard('theater') }); m.spawn('theater_out', 66, 27, 0);
  /* Murihof (Theaterstrasse 2): ehemalige Stadtburg der Kyburger und Habsburger, ältestes Steingebäude der Altstadt, seit Ende 14. Jh. Hof des Klosters Muri */
  m.fill(64, 19, 7, 1, T.COBBLE, 1);
  m.add(objBuilding(64, 13, 7, 6, { floors: 3, wall: '#e6dcc4', roof: '#6a5a52', trim: '#fbf4dc', seed: 641, wins: 'tall', lintel: true, corner: true, shutter: '#7a3a2a', flowers: false, drawH: 12, doors: [{ dx: 3, type: 'arch' }], sign: { text: 'MURIHOF', bg: '#5a4a38', fg: '#f4e8c0' } }));
  m.trig(67, 18, 1, 1, { label: 'Murihof', act: () => Sur.look('murihof') });
  m.trig(64, 19, 7, 1, { here: true, label: 'Foto: Murihof', act: () => Sur.photo('murihof'), cond: () => !Sur.hasPhoto('murihof') });
  /* Gasse durch das Obertor nach Norden zur Stadthalle */
  m.fill(71, 11, 2, 26, T.COBBLE, 1);
  /* Kirche St. Georg mit Kirchplatz, Treppe hinunter zum Rathaus */
  m.fill(73, 12, 22, 18, T.PLAZA, 0);
  m.add(objKirche(75, 18));
  m.trig(80, 22, 4, 1, { label: 'Stadtkirche St. Georg', act: () => Sur.look('kirche') });
  for (const [x, y] of [[74, 26], [93, 26]]) m.add(objTree(x, y, 'autumn'));
  m.add(objBench(89, 26, 0));
  m.birdSpots.push({ x: 76, y: 25, w: 12, h: 3, n: 6 });
  /* Märtplatz mit Chilbi (rechts von der Kirche, hinter der Häuserreihe) */
  m.fill(95, 9, 30, 19, T.ASPH, 0);
  m.fill(93, 27, 3, 10, T.COBBLE, 1);
  m.add(objAchterbahn(97, 10)); m.trig(105, 12, 3, 1, { label: 'Achterbahn: Einsteigen', act: () => Sur.achterbahn() });
  m.add(objRiesenrad(111, 12)); m.trig(113, 13, 2, 1, { label: 'Riesenrad: Einsteigen', act: () => Sur.riesenrad() });
  m.add(objBude(97, 17, 3, 'schiess', 'SCHIESSEN')); m.trig(97, 18, 3, 1, { label: 'Schiessbude', act: () => Sur.chilbi('schiessbude') });
  m.add(objBude(101, 17, 2, 'lukas', 'LUKAS')); m.trig(101, 18, 2, 1, { label: 'Hau den Lukas', act: () => Sur.chilbi('lukas') });
  m.add(objBude(105, 17, 3, 'enten', 'ENTEN')); m.trig(105, 18, 3, 1, { label: 'Entenfischen', act: () => Sur.chilbi('entenfischen') });
  m.add(objBude(109, 17, 3, 'buechsen', 'BÜCHSEN')); m.trig(109, 18, 3, 1, { label: 'Büchsenwerfen', act: () => Sur.chilbi('buechsen') });
  m.add(objBude(118, 17, 3, 'magenbrot', 'MAGENBROT')); m.trig(118, 18, 3, 1, { label: 'Magenbrot-Stand', act: () => Story.shop('magenbrot') });
  m.add(objBude(121, 21, 3, 'los', 'LOSE')); m.trig(121, 22, 3, 1, { label: 'Losbude', act: () => Sur.chilbi('los') });
  m.add(objPutschi(97, 22, 9, 4)); m.trig(97, 25, 9, 1, { label: 'Putschibahn', act: () => Sur.chilbi('putschi') });
  for (const [x, y] of [[96, 20], [108, 21], [116, 21], [124, 13]]) m.add(objLamp(x, y, 'new'));
  for (let x = 96; x < 125; x += 4) m.light(x * 16, 16 * 16, 34, ['#ff8ad0', '#ffd27a', '#80e0ff'][x % 3]);
  /* Obere Häuserreihe der Oberstadt (Fassaden zur Gasse) */
  m.add(objGate(53, 31, 3, 10, { dir: 'h', pass: [37, 4], label: 'UNTERTOR', drawH: 50, roofH: 34, wall: '#f4f1e8', roof: '#5a3a2e', dormers: true })); m.solid(53, 31, 3, 6);
  m.add(mkObj(53, 41, 4, 4, 26, (c, Wd, Hd) => {
    for (let k = 0; k < 22; k++) R(c, 2 + k * 0.6, k, Wd - 4 - k * 1.2, 1, k % 3 ? '#6a3a2a' : '#5a3424');
    R(c, 2, 22, Wd - 4, Hd - 22, '#f4efe2');
    for (let xx = 2; xx < Wd - 2; xx += 10) R(c, xx, 22, 2, Hd - 38, '#a8301e'); R(c, 2, 22, Wd - 4, 2, '#a8301e'); R(c, 2, 38, Wd - 4, 2, '#a8301e'); R(c, 2, Hd - 18, Wd - 4, 2, '#a8301e');
    for (let xx = 4; xx < Wd - 6; xx += 10) { line(c, xx, 24, xx + 8, 38, '#a8301e'); R(c, xx + 2, 27, 5, 7, '#3e4c5e'); for (let k = 0; k < 7; k++) P(c, xx + 1, 27 + k, k % 2 ? '#c8302a' : '#f4f0e6'); }
    for (let k = 0; k < 3; k++) { const ax = 6 + k * 18; R(c, ax, Hd - 16, 14, 16, '#3a3430'); E(c, ax + 7, Hd - 16, 7, 4, '#3a3430'); }
    pxText(c, 'SCHÜTZENHAUS', 3, 41, '#7a3a2a');
  }, { solid: true }));
  m.trig(53, 37, 3, 4, { here: true, label: 'Foto: Untertor', act: () => Sur.photo('untertor'), cond: () => !Sur.hasPhoto('untertor') });
  altHouse(m, 56, 30, 6, 7, 4, { wall: '#e8d4b0', roof: '#7a3a2a', doors: [{ dx: 2, col: '#4a2e1a', lit: true }], sign: { text: 'WILDER MANN', bg: '#3a2418', fg: '#f4d890', lit: true }, hang: { dx: 5, icon: 'beer', side: 'r' }, floors: 4, shutter: '#3f6b45' });
  m.warp(58, 36, 'wildermann', 'entry', { label: 'Wirtshaus Wilder Mann', guard: () => Sur.openGuard('wildermann') }); m.spawn('wildermann_out', 58, 37, 0);
  altHouse(m, 62, 30, 4, 7, 7, { wall: '#2a2a2e', roof: '#3a3a3e', trim: '#c8302a', doors: [{ dx: 1, col: '#1a1a1a', lit: true }], sign: { text: 'TNT', bg: '#c8302a', fg: '#1a1a1a', lit: true }, shutter: null, flowers: false });
  m.warp(63, 36, 'tnt', 'entry', { label: 'TNT Rock Bar', guard: () => Sur.openGuard('tnt') }); m.spawn('tnt_out', 63, 37, 0);
  altHouse(m, 66, 30, 4, 7, 1, { wall: '#e9d9b8', doors: [{ dx: 1, col: '#4a2e1a', lit: true }], sign: { text: 'HIRSCHEN', bg: '#3f5a3b', fg: '#f4e8c0', lit: true }, hang: { dx: 3, icon: 'gams', side: 'r' } }); m.trig(67, 36, 1, 1, { label: 'Hotel Hirschen', act: () => Sur.look('hirschen') });
  /* Obertor: Das Tor selbst steht nicht mehr (erhalten ist nur das Untertor); Mauerreste und das Strassenschild erinnern daran */
  for (const gx of [70, 73]) m.add(mkObj(gx, 30, 1, 7, 18, (c, Wd, Hd) => { R(c, 2, 14, 12, Hd - 14, '#c8b898'); for (let yy = 18; yy < Hd; yy += 6) for (let xx = 2 + ((yy / 6) % 2) * 3; xx < 13; xx += 6) R(c, xx, yy, 5, 5, (xx + yy) % 3 ? '#d4c4a4' : '#b8a888'); R(c, 1, 12, 14, 3, '#a89878'); }, { solid: true }));
  m.add(mkObj(71, 36, 2, 1, 14, (c, Wd) => { R(c, 15, 6, 2, 10, '#5a5e64'); R(c, 2, 0, 28, 8, '#1a3a7a'); R(c, 2, 0, 28, 1, '#ffffff'); pxText(c, 'OBERTOR', 3, 2, '#ffffff'); }, { solid: false }));
  altHouse(m, 74, 30, 3, 7, 6);
  m.add(objRathaus(77, 30)); m.trig(80, 36, 2, 1, { label: 'Rathaus', act: () => Sur.rathausDoor() }); m.spawn('rathaus_out', 80, 38, 0);
  m.trig(77, 37, 8, 2, { here: true, label: 'Foto: Rathaus', act: () => Sur.photo('rathaus_sursee'), cond: () => !Sur.hasPhoto('rathaus_sursee') });
  m.fill(85, 28, 2, 9, T.STAIRS); m.trig(85, 29, 2, 2, { here: true, label: 'Foto: St. Georg', act: () => Sur.photo('stgeorg'), cond: () => !Sur.hasPhoto('stgeorg') });
  altHouse(m, 87, 30, 6, 7, 9, { wall: '#f0e8d8', roof: '#6a5a52', doors: [{ dx: 2, type: 'glass', lit: true }], shopWins: [0, 1, 3, 4, 5], goods: ['#e8c890', '#c8352d', '#5a3a24'], sign: { text: 'STADTCAFÉ', bg: '#2a2a2e', fg: '#f4e8c0', lit: true }, awning: { cols: [0, 1, 3, 4, 5], col: '#2a2a2e' } });
  m.warp(89, 36, 'stadtcafe', 'entry', { label: 'Stadtcafé', guard: () => Sur.openGuard('stadtcafe') }); m.spawn('stadtcafe_out', 89, 37, 0);
  for (const [x] of [[88], [92]]) m.add(objUmbrellaTable(x, 38, '#2a2a2e'));
  altHouse(m, 96, 30, 5, 7, 5, { wall: '#e8a860', roof: '#8a3b2a', doors: [{ dx: 2, col: '#7a2a1a', lit: true }], sign: { text: 'EL MOSQUITO', bg: '#c8302a', fg: '#ffd23d', lit: true }, hang: { dx: 4, icon: 'cup', side: 'r' } });
  m.warp(98, 36, 'mosquito', 'entry', { label: 'El Mosquito Bodega & Bar', guard: () => Sur.openGuard('mosquito') }); m.spawn('mosquito_out', 98, 37, 0);
  altHouse(m, 101, 30, 4, 7, 2);
  altHouse(m, 105, 30, 5, 7, 8, { wall: '#8a8e94', roof: '#4a4a50', trim: '#3a3a3e', doors: [{ dx: 2, type: 'glass', lit: true }], sign: { text: 'CRAFTWERK', bg: '#1a1a1e', fg: '#e8a83a', lit: true }, shutter: null, flowers: false });
  m.warp(107, 36, 'craftwerk', 'entry', { label: 'Craftwerk', guard: () => Sur.openGuard('craftwerk') }); m.spawn('craftwerk_out', 107, 37, 0);
  altHouse(m, 110, 30, 4, 7, 3); altHouse(m, 114, 30, 4, 7, 6, { erker: [1, 2] });
  /* Gasse der Oberstadt mit Rathausplatz und Marienbrunnen */
  m.fill(51, 37, 69, 4, T.COBBLE, 0); m.fill(53, 41, 66, 1, T.PAVE, 1);
  m.fill(75, 37, 20, 4, T.PLAZA, 1);
  m.add(objBrunnenSursee(67, 38)); m.trig(67, 38, 2, 2, { label: 'Marienbrunnen', act: () => Sur.look('marienbrunnen') });
  m.trig(66, 40, 4, 1, { here: true, label: 'Foto: Marienbrunnen', act: () => Sur.photo('marienbrunnen'), cond: () => !Sur.hasPhoto('marienbrunnen') });
  for (const x of [60, 72, 95, 112]) m.add(objLamp(x, 40));
  m.birdSpots.push({ x: 76, y: 38, w: 16, h: 2, n: 8 });
  /* Mittlere Häuserreihe (Fassaden zur Unterstadt) */
  m.fill(57, 41, 3, 9, T.COBBLE, 1);
  altHouse(m, 60, 42, 6, 8, 0, { wall: '#c8302a', roof: '#6a2a2a', doors: [{ dx: 2, col: '#3a1a1a', lit: true }], sign: { text: 'RÖSSLI', bg: '#2a1a10', fg: '#ffd23d', lit: true }, hang: { dx: 5, icon: 'bed', side: 'r' }, floors: 4, shutter: '#f4e8c0' });
  m.warp(62, 49, 'roessli', 'entry', { label: 'Hotel Rössli · Nightbar', guard: () => Sur.openGuard('roessli') }); m.spawn('roessli_out', 62, 50, 0);
  altHouse(m, 66, 42, 4, 8, 4);
  altHouse(m, 70, 42, 4, 8, 7, { wall: '#3a2a20', roof: '#5a3a2a', trim: '#c8a060', doors: [{ dx: 1, type: 'glass', lit: true }], sign: { text: 'LA FUGA', bg: '#c8a060', fg: '#2a1a10', lit: true }, shutter: null });
  m.warp(71, 49, 'lafuga', 'entry', { label: 'La Fuga Kaffeebar', guard: () => Sur.openGuard('lafuga') }); m.spawn('lafuga_out', 71, 50, 0);
  altHouse(m, 74, 42, 3, 8, 2);
  /* Oberes Waschhaus (18./19. Jh.) am Diebenturm: im ersten Stock die Zunftstube der Zunft Heini von Uri */
  m.add(objBuilding(77, 42, 3, 8, { floors: 3, wall: '#e8dec4', roof: '#7a3a2a', trim: '#f6efe0', shutter: '#3f6b45', flowers: false, seed: 777, drawH: 10, doors: [{ dx: 1, col: '#5a3a24', lit: true }],
    special: (c, Wd, Hd) => { R(c, 6, Hd - 30, Wd - 12, 7, '#2a2a2e'); pxText(c, 'ZUNFT', 10, Hd - 29, '#f2d040'); R(c, Wd - 8, Hd - 44, 1, 16, '#3a3a40'); R(c, Wd - 7, Hd - 44, 8, 6, '#f2d040'); R(c, Wd - 7, Hd - 41, 8, 1, '#c8302a'); } }));
  m.add(objDiebenturm(80, 42)); m.trig(81, 49, 2, 1, { label: 'Diebenturm', act: () => Sur.look('diebenturm') });
  m.warp(78, 49, 'zunftstube', 'entry', { label: 'Waschhaus · Zunftstube', guard: () => Sur.diebenturmDoor() }); m.spawn('diebenturm_out', 78, 50, 0);
  m.trig(80, 50, 4, 1, { here: true, label: 'Foto: Diebenturm', act: () => Sur.photo('diebenturm'), cond: () => !Sur.hasPhoto('diebenturm') });
  altHouse(m, 84, 42, 5, 8, 5); altHouse(m, 89, 42, 5, 8, 8, { arcade: true }); altHouse(m, 94, 42, 4, 8, 1);
  altHouse(m, 98, 42, 6, 8, 3, { wall: '#efe0c8', roof: '#8a3b2a', doors: [{ dx: 3, col: '#5a2a1a', lit: true }], sign: { text: 'PIZZERIA ZUR MÜHLE', bg: '#2f7a3a', fg: '#ffffff', lit: true }, hang: { dx: 0, icon: 'cup', side: 'l' }, shutter: '#2f7a3a' });
  m.warp(101, 49, 'muehle', 'entry', { label: 'Pizzeria zur Mühle', guard: () => Sur.openGuard('muehle') }); m.spawn('muehle_out', 101, 50, 0);
  altHouse(m, 104, 42, 5, 8, 6); altHouse(m, 109, 42, 5, 8, 9);
  /* Gasse der Unterstadt mit offenem Sure-Arm, Mühleplatz, Hirschenplatz */
  m.fill(57, 50, 61, 3, T.COBBLE, 0);
  m.fill(86, 50, 7, 3, T.COBBLE, 1); m.fill(98, 50, 12, 3, T.PLAZA, 1);
  m.fill(52, 53, 66, 1, T.WATER);
  for (const x of [75, 96]) { m.fill(x, 53, 2, 1, T.BRIDGE); }
  m.add(mkObj(99, 53, 2, 1, 20, (c, Wd, Hd) => { E(c, 16, Hd - 6, 12, 12, '#6a4a2a'); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; line(c, 16, Hd - 6, 16 + Math.cos(a) * 12, Hd - 6 + Math.sin(a) * 12, '#4a3020'); } E(c, 16, Hd - 6, 3, 3, '#3a2414'); }, { solid: true }));
  m.trig(99, 53, 2, 1, { label: 'Mühlerad an der Sure', act: () => Sur.look('muehlerad') });
  m.trig(66, 52, 8, 1, { here: true, label: 'Foto: Sure in der Unterstadt', act: () => Sur.photo('unterstadt'), cond: () => !Sur.hasPhoto('unterstadt') });
  for (const x of [66, 84, 104]) m.add(objLamp(x, 52));
  m.add(objTafel(88, 50, '#5a3a24', 'HIR')); m.trig(88, 50, 1, 1, { label: 'Hirschenplatz', act: () => Sur.look('hirschenplatz') });
  m.birdSpots.push({ x: 60, y: 53, w: 50, h: 1, n: 5, kind: 'duck' });
  /* Stadtmauer mit Pforten in den Ehret-Park */
  for (const [x, w] of [[52, 23], [77, 19], [98, 20]]) m.add(objMauer(x, 54, w));
  m.fill(75, 54, 2, 1, T.COBBLE, 1); m.fill(96, 54, 2, 1, T.COBBLE, 1);
  /* Ehret-Park mit zweitem Sure-Arm, Brücke Badstrasse, Spielplatz, Brunnen */
  m.fill(52, 55, 66, 13, T.GRASS, 2);
  m.fill(52, 62, 80, 2, T.WATER);
  m.fill(84, 62, 3, 2, T.BRIDGE); m.fill(84, 55, 1, 7, T.GRAVEL); m.fill(84, 64, 1, 4, T.GRAVEL);
  m.fill(53, 58, 64, 1, T.GRAVEL); m.fill(75, 55, 1, 3, T.GRAVEL); m.fill(96, 55, 1, 3, T.GRAVEL);
  m.add(mkObj(84, 61, 3, 1, 6, (c, Wd) => { R(c, 0, 0, Wd, 2, '#8a8e94'); for (let k = 0; k < Wd; k += 6) R(c, k, 0, 1, 6, '#6a6e74'); }, { solid: false }));
  m.add(mkObj(84, 64, 3, 1, 4, (c, Wd) => { R(c, 0, 0, Wd, 2, '#8a8e94'); }, { solid: false }));
  m.add(mkObj(86, 66, 1, 1, 12, (c) => { R(c, 7, 4, 2, 10, '#5a5e64'); R(c, 0, 0, 16, 6, '#1a3a7a'); pxText(c, 'BAD', 2, 1, '#ffffff'); }, { solid: false }));
  m.add(objSpielplatz(63, 55)); m.trig(63, 57, 5, 1, { label: 'Spielplatz', act: () => Sur.look('spielplatz') });
  m.add(objBrunnenSursee(91, 56, false)); m.trig(91, 56, 2, 2, { label: 'Brunnen im Ehret-Park', act: () => Story.drinkFountain() });
  for (const [x, y, k] of [[55, 60, 'green'], [72, 56, 'autumn'], [79, 60, 'yellow'], [100, 56, 'green'], [107, 60, 'autumn'], [113, 57, 'red'], [58, 66, 'green'], [94, 66, 'yellow'], [110, 66, 'green']]) m.add(objTree(x, y, k, true));
  for (const [x, y] of [[69, 59], [88, 59], [104, 59]]) m.add(objBench(x, y, 0));
  m.birdSpots.push({ x: 56, y: 62, w: 50, h: 2, n: 7, kind: 'duck' });
  m.trig(53, 57, 64, 4, { here: true, label: 'Foto: Ehret-Park', act: () => Sur.photo('ehretpark'), cond: () => !Sur.hasPhoto('ehretpark') });
  /* Ost: Verbindung Ober-/Unterstadt, Beckenhof mit Städtlipark, Münstervorstadt, Weg zum See */
  m.fill(118, 30, 4, 24, T.COBBLE, 1);
  m.fill(114, 41, 4, 9, T.COBBLE, 1);
  m.fill(122, 36, 10, 14, T.GRASS, 0);
  m.add(objBuilding(123, 36, 8, 6, { floors: 3, wall: '#f2e6c8', roof: '#6a5a52', trim: '#ffffff', seed: 121, wins: 'tall', shutter: '#3f6b45', flowers: true, doors: [{ dx: 4, col: '#5a3a24' }], sign: { text: 'BECKENHOF', bg: '#3f5a3b', fg: '#f4e8c0' } }));
  m.trig(127, 41, 1, 1, { label: 'Beckenhof', act: () => Sur.look('beckenhof') });
  for (const [x, y, k] of [[123, 44, 'red'], [128, 45, 'yellow'], [125, 48, 'green']]) m.add(objTree(x, y, k, true));
  m.add(objBench(126, 47, 0));
  m.fill(118, 54, 14, 26, T.PAVE, 1);
  m.fill(118, 62, 14, 2, T.WATER); m.fill(122, 62, 3, 2, T.BRIDGE);
  m.add(objBlock(119, 55, 6, 6, '#e4e0d8', { door: 3, name: 'BEI ISA', balcony: '#7a8a6a' }));
  m.warp(122, 60, 'isa_haus', 'entry', { label: 'Bei Isa', guard: () => Sur.isaDoor() }); m.spawn('isa_out', 122, 61, 0);
  m.add(objBlock(126, 55, 6, 6, '#d8d4cc', { balcony: '#8a6a5a' }));
  m.add(objBlock(118, 65, 7, 6, '#ece8e0', { balcony: '#6a7a8a' })); m.add(objBlock(126, 65, 5, 6, '#e0dcd4', { balcony: '#8a8e94' }));
  m.add(mkObj(125, 71, 1, 1, 12, (c) => { R(c, 7, 4, 2, 10, '#5a5e64'); R(c, 0, 0, 16, 6, '#1a3a7a'); pxText(c, 'MÜV', 1, 1, '#ffffff'); }, { solid: false }));
  m.trig(125, 72, 1, 1, { label: 'Quartier Münstervorstadt', act: () => Sur.look('muenstervorstadt') });
  m.fill(127, 71, 3, 9, T.GRAVEL);
  m.add(mkObj(127, 76, 3, 1, 12, (c, Wd) => { R(c, 22, 4, 2, 10, '#5a5e64'); R(c, 6, 0, 36, 7, '#2f6e8f'); pxText(c, 'ZUM SEE', 9, 1, '#ffffff'); }, { solid: false }));
  m.warp(127, 79, 'sursee_see', 'from_town', { w: 3, label: 'Zum See' });
  for (const [x, y] of [[119, 52], [130, 52], [121, 72]]) m.add(objLamp(x, y, 'new'));
  /* Bauernhof mit Gänsen im Nordwesten (von dort kommen die Gänse für die Gansabhauet) */
  m.fill(19, 14, 2, 10, T.GRAVEL);
  m.fill(6, 4, 16, 11, T.MEADOW);
  house(m, 7, 3, 6, 5, 5, { wall: '#efe4c8', roof: '#7a3a2a', floors: 3, shutter: '#3f6b45', flowers: true, doors: [{ dx: 2, col: '#5a3a24' }] });
  m.add(objScheune(14, 3, 6, 5));
  m.add(objGehege(8, 10, 8, 4)); m.trig(8, 14, 8, 1, { label: 'Gänsegehege', act: () => Sur.look('gehege') });
  m.fill(6, 14, 13, 2, T.GRAVEL);
  for (const [x, y, k] of [[4, 6, 'green'], [22, 6, 'autumn'], [24, 12, 'green'], [5, 16, 'yellow'], [26, 18, 'green'], [23, 21, 'red']]) m.add(objTree(x, y, k, true));
  /* Wohnquartier im Südwesten */
  m.fill(4, 56, 46, 1, T.PAVE); m.fill(4, 57, 46, 2, T.ASPH); m.fill(4, 58, 46, 1, T.ASPH, 1); m.fill(4, 59, 46, 1, T.PAVE);
  m.fill(16, 56, 2, 24, T.ASPH);
  [[21, 50, 5], [26, 50, 4], [31, 50, 5], [37, 50, 4], [42, 50, 5]].forEach(([x, y, w], i) => house(m, x, y, w, 6, i + 2, { floors: 3, drawH: 8, flowers: true, doors: [{ dx: 1, col: ['#5a3a24', '#2f5a3a', '#7a2a2a'][i % 3] }] }));
  [[4, 61, 5], [9, 61, 5], [21, 61, 6], [27, 61, 5], [33, 61, 5], [39, 61, 6], [45, 61, 4]].forEach(([x, y, w], i) => house(m, x, y, w, 6, i + 5, { floors: 3, drawH: 8, flowers: i % 2 === 0, doors: [{ dx: 2, col: ['#5a3a24', '#2f5a3a', '#7a2a2a'][i % 3] }] }));
  m.fill(4, 67, 46, 1, T.PAVE);
  for (let x = 6; x < 48; x += 5) m.add(objTree(x, 70 + (x % 3), ['green', 'autumn', 'yellow', 'red'][x % 4], x % 2 === 0));
  for (const x of [8, 24, 40]) m.add(objLamp(x, 56, 'new'));
  /* Schrebergärten südlich des Ehret-Parks */
  m.fill(52, 64, 66, 1, T.GRAVEL); m.fill(60, 64, 1, 16, T.GRAVEL); m.fill(84, 64, 1, 16, T.GRAVEL); m.fill(104, 64, 1, 16, T.GRAVEL);
  for (const [x, y, i] of [[54, 66, 0], [62, 66, 1], [67, 66, 2], [72, 66, 0], [77, 66, 1], [86, 66, 2], [91, 66, 0], [96, 66, 1], [106, 66, 2], [111, 66, 0], [54, 71, 1], [62, 71, 2], [67, 71, 0], [72, 71, 1], [86, 71, 0], [91, 71, 2], [106, 71, 1], [111, 71, 2]]) m.add(objGarten(x, y, i));
  for (const [x, y, k] of [[56, 76, 'green'], [66, 77, 'autumn'], [78, 76, 'yellow'], [90, 77, 'green'], [100, 76, 'red'], [112, 77, 'green']]) m.add(objTree(x, y, k, true));
  m.add(objTafel(61, 64, '#3f5a3b', 'GRT')); m.trig(61, 64, 1, 1, { label: 'Familiengärten', act: () => Sur.look('gaerten') });
  /* Märtplatz: Parkplätze mit Autos neben der Chilbi */
  for (const [x, y, col] of [[113, 23, '#c8302a'], [116, 23, '#2f5fb8'], [119, 23, '#e8e4dc'], [122, 23, '#3a3c40'], [113, 26, '#3f8e4b'], [119, 26, '#e8c23a'], [122, 26, '#7a2f3a']]) m.add(objCar(x, y, col));
  m.add(mkObj(124, 20, 1, 1, 12, (c) => { R(c, 7, 4, 2, 10, '#5a5e64'); R(c, 1, 0, 14, 8, '#2f5fb8'); pxText(c, 'P', 6, 2, '#ffffff'); }, { solid: true }));
  /* Fussgänger und Spawns */
  m.pedZones.push({ x: 4, y: 56, w: 44, h: 4, n: 4 }, { x: 52, y: 64, w: 60, h: 1, n: 2 });
  m.pedZones.push({ x: 4, y: 33, w: 14, h: 8, n: 5 }, { x: 18, y: 36, w: 32, h: 1, n: 3 }, { x: 54, y: 37, w: 64, h: 4, n: 10 }, { x: 57, y: 50, w: 60, h: 3, n: 6 }, { x: 96, y: 12, w: 28, h: 4, n: 7 }, { x: 96, y: 19, w: 28, h: 2, n: 6 }, { x: 53, y: 56, w: 60, h: 5, n: 5 }, { x: 41, y: 41, w: 8, h: 9, n: 4 }, { x: 74, y: 26, w: 20, h: 3, n: 3 });
  m.spawn('bahnhof', 5, 30, 2);
  m.spawn('kirche_out', 82, 26, 0);
  m.spawn('untertor', 56, 38, 2);
  m.spawn('see_back', 128, 77, 3);
  m.spawn('chilbi', 110, 21, 0);
  m.spawn('ehretpark', 75, 57, 0);
  m.spawn('rathausplatz', 81, 40, 3);
  m.groundAnim = waterAnim;
  m.update = (dt) => Sur.mapUpdate(dt);
  return m;
};

/* ----------- Am See: der Triechter ----------- */
/* Boote am Steg: Pedalo (Schwan-Optik nein, klassisch gelb) und Elektroboot */
function objBoot(x, y, kind = 'e', col = '#e8e4dc') {
  const o = mkObj(x, y, 2, 1, 4, (c, W, H) => {
    if (kind === 'p') { R(c, 2, H - 12, 28, 8, '#f2d040'); R(c, 2, H - 12, 28, 2, '#fff4a0'); R(c, 8, H - 18, 14, 6, '#e8e4dc'); R(c, 10, H - 17, 4, 4, '#2f5fb8'); R(c, 16, H - 17, 4, 4, '#2f5fb8'); E(c, 6, H - 6, 3, 2, '#3a3c40'); E(c, 26, H - 6, 3, 2, '#3a3c40'); }
    else { c.fillStyle = col; c.beginPath(); c.moveTo(1, H - 12); c.lineTo(26, H - 12); c.lineTo(31, H - 8); c.lineTo(26, H - 4); c.lineTo(1, H - 4); c.closePath(); c.fill(); R(c, 1, H - 12, 25, 1, '#ffffff'); R(c, 1, H - 6, 28, 2, '#2f5fb8'); R(c, 8, H - 15, 10, 4, '#7a5a3a'); R(c, 20, H - 14, 3, 4, '#3a3c40'); }
  }, { solid: false });
  o.anim = (c, t, px, py) => { const b = Math.sin(t * 2 + x) * 0.8; if (Math.floor(t * 2 + x) % 7 === 0) R(c, px + 2, py + 16 + b, 28, 1, 'rgba(220,240,255,0.5)'); };
  return o;
}
function objSchilf(x, y, w) {
  return mkObj(x, y, w, 1, 8, (c, W, H) => { for (let k = 0; k < W; k += 2) { const h = 8 + hash(k, x, y) * 10; line(c, k, H - 2, k + (hash(k, y) > 0.5 ? 1 : -1), H - 2 - h, hash(k, 3) > 0.5 ? '#8a8a4a' : '#a89a5a'); if (hash(k, 9) > 0.7) R(c, k, H - 2 - h, 1, 3, '#6a4a2a'); } }, { solid: false });
}
function objSprungturm(x, y) {
  return mkObj(x, y, 2, 2, 46, (c, W, H) => {
    R(c, 2, H - 14, W - 4, 12, '#9a774e'); for (let k = 2; k < W - 2; k += 4) R(c, k, H - 14, 1, 12, '#73563a');
    for (const lx of [6, W - 8]) R(c, lx, 10, 2, H - 24, '#c9ccd2');
    R(c, 4, 10, W - 8, 3, '#2f5fb8'); R(c, 4, 26, W - 8, 3, '#2f5fb8'); R(c, W / 2 - 1, 10, 22, 2, '#e8e4dc'); R(c, W / 2 - 1, 26, 18, 2, '#e8e4dc');
    for (let k = 0; k < 8; k++) R(c, 2, 12 + k * 4, 4, 1, '#8a8e94');
    pxText(c, '5M', 9, 2, '#ffffff');
  }, { solid: true });
}
function objKapelle(x, y) {
  return mkObj(x, y, 4, 3, 30, (c, W, H) => {
    R(c, 6, 26, W - 12, H - 26, '#f4f0e6'); for (let k = 0; k < 14; k++) R(c, 4 + k * 0.6, 12 + k, W - 8 - k * 1.2, 1, '#8a3b2a');
    R(c, W - 22, 4, 10, 30, '#f4f0e6'); for (let k = 0; k < 10; k++) R(c, W - 22 + k / 2, -4 + k, 10 - k, 1, '#4f7a58'); R(c, W - 18, 12, 3, 5, '#3a3a40');
    R(c, W / 2 - 5, H - 16, 10, 16, '#5a3a24'); E(c, W / 2, H - 16, 5, 3, '#5a3a24');
    pxText(c, 'MARIAZELL', 6, 27, '#7a5a3a');
  }, { solid: true });
}
MAP_BUILDERS.sursee_see = () => {
  const W = 92, H = 60;
  const m = new GMap('sursee_see', W, H, { name: 'Sempachersee · Triechter', city: 'sursee', bg: '#1f4a5a' });
  m.fill(0, 0, W, H, T.WATER);
  /* Nordufer: Wiesen, Seehüseren, Ausfluss der Suhre */
  m.fill(0, 0, W, 17, T.GRASS, 1);
  m.fill(19, 0, 3, 17, T.WATER); m.fill(19, 6, 3, 2, T.BRIDGE);
  m.add(objTafel(23, 5, '#2f6e8f', 'SUH')); m.trig(23, 5, 1, 1, { label: 'Suhre-Ausfluss', act: () => Sur.look('suhre') });
  for (let k = 0; k < 6; k++) house(m, 2 + k * 3, 2, 3, 4, k + 3, { floors: 2, drawH: 8, flowers: true });
  m.fill(0, 6, 19, 2, T.ASPH); m.fill(22, 6, 70, 2, T.ASPH); m.fill(39, 0, 3, 6, T.GRAVEL);
  m.add(objTafel(36, 1, '#2f6e8f', 'SEE')); m.spawn('from_town', 40, 1, 0);
  m.warp(39, 0, 'sursee', 'see_back', { w: 3, label: 'Zurück in die Stadt' });
  /* Quai mit Bootsvermietung und Fischer */
  m.fill(24, 15, 18, 3, T.DECK);
  m.fill(32, 18, 2, 4, T.DECK); m.fill(38, 18, 3, 2, T.DECK);
  m.add(objBuilding(26, 10, 6, 5, { floors: 2, wall: '#8a5a32', roof: '#4a3a32', trim: '#e8dcc0', flowers: false, seed: 201, drawH: 8, doors: [{ dx: 2, col: '#4a2e1a' }], sign: { text: 'BOOTSVERMIETUNG', bg: '#2f6e8f', fg: '#ffffff' } }));
  m.add(objCounter(32, 14, 3, 1, { top: '#8a5a32', front: '#5a3a24', reg: true })); m.trig(32, 14, 3, 1, { label: 'Bootsvermietung', act: () => Sur.bootsverleih() });
  for (const [x, y, k, col] of [[28, 18, 'p'], [28, 19, 'p'], [34, 19, 'e', '#e8e4dc'], [34, 20, 'e', '#f4f0e6'], [30, 20, 'p']]) m.add(objBoot(x, y, k, col));
  m.trig(38, 19, 3, 1, { here: true, label: 'Fischen', act: () => Sur.fish('quai') });
  m.add(mkObj(40, 18, 1, 1, 10, (c) => { R(c, 6, 4, 4, 10, '#5a3a24'); line(c, 8, 4, 15, -6, '#c9ccd2'); line(c, 15, -6, 15, 10, 'rgba(255,255,255,0.5)'); }, { solid: true }));
  /* Promenade mit Buvette */
  m.fill(42, 15, 14, 2, T.KIES); m.fill(42, 17, 14, 1, T.PAVE);
  m.add(objKiosk(46, 11, 'BUVETTE', '#2f6e8f')); m.trig(46, 11, 3, 2, { label: 'Triechter Buvette', act: () => Story.shop('buvette') });
  for (const [x, y] of [[44, 14], [51, 14]]) m.add(objUmbrellaTable(x, y, '#2f6e8f'));
  for (const x of [43, 49, 55]) m.add(objLamp(x, 16, 'new'));
  for (const [x, y] of [[45, 16], [53, 16]]) m.add(objBench(x, y, 0));
  for (const [x, y, k] of [[42, 10, 'green'], [54, 10, 'autumn']]) m.add(objTree(x, y, k, true));
  m.trig(42, 17, 14, 1, { here: true, label: 'Foto: Triechter', act: () => Sur.photo('triechter'), cond: () => !Sur.hasPhoto('triechter') });
  /* Strandbad Sursee mit Sprungturm und Flosse */
  m.fill(56, 9, 16, 8, T.GRASS, 0); m.fill(56, 15, 16, 2, T.SAND);
  m.add(objBuilding(57, 9, 8, 4, { floors: 2, wall: '#e8e4dc', roof: '#2f6e8f', roofType: 'flat', trim: '#2f6e8f', flowers: false, seed: 211, drawH: 6, doors: [{ dx: 3, col: '#2f6e8f' }], sign: { text: 'STRANDBAD SURSEE', bg: '#2f6e8f', fg: '#ffffff' } }));
  m.fill(62, 17, 2, 4, T.DECK); m.add(objSprungturm(62, 20)); m.trig(62, 19, 2, 1, { label: 'Sprungturm', act: () => Sur.sprung() });
  m.add(mkObj(67, 23, 2, 2, 2, (c, Wd, Hd) => { R(c, 0, 4, Wd, Hd - 6, '#9a774e'); for (let k = 0; k < Wd; k += 4) R(c, k, 4, 1, Hd - 6, '#73563a'); R(c, 0, Hd - 3, Wd, 2, '#c9ccd2'); }, { solid: true }));
  for (const [x, y] of [[66, 11], [69, 12]]) m.add(objTree(x, y, 'green'));
  /* Seebadi Schenkon auf der Halbinsel im Osten */
  m.fill(72, 8, 20, 32, T.GRASS, 1); m.fill(72, 8, 3, 2, T.ASPH);
  for (let y = 10; y < 40; y++) { const w = Math.max(0, Math.round(18 - (y - 10) * 0.55)); m.fill(92 - w, y, w, 1, T.GRASS, 1); m.fill(72, y, 20 - w, 1, T.WATER); }
  m.fill(78, 18, 14, 2, T.SAND);
  m.add(objBuilding(80, 12, 7, 4, { floors: 2, wall: '#d8c8a0', roof: '#6a5a52', trim: '#ffffff', flowers: false, seed: 221, drawH: 6, doors: [{ dx: 3, col: '#5a3a24' }], sign: { text: 'SEEBADI SCHENKON', bg: '#3f8e4b', fg: '#ffffff' } }));
  m.add(mkObj(78, 17, 2, 1, 10, (c, Wd, Hd) => { for (let k = 0; k < 3; k++) { R(c, 2 + k * 9, 0, 6, Hd - 2, ['#ff7a2a', '#2f5fb8', '#e8c23a'][k]); R(c, 4 + k * 9, 2, 2, Hd - 6, '#ffffff'); } }, { solid: true }));
  m.trig(78, 18, 3, 1, { label: 'Stand-up-Paddle mieten', act: () => Sur.sup() });
  m.add(objTafel(84, 20, '#3f8e4b', 'SUP'));
  /* Mariazell auf der Anhöhe */
  m.add(objKapelle(82, 1)); m.trig(83, 3, 2, 1, { label: 'Wallfahrtskirche Mariazell', act: () => Sur.look('mariazell') });
  /* Zellmoos: Naturschutzgebiet auf der Halbinsel im Westen */
  for (let y = 17; y < 46; y++) { const w = Math.max(0, Math.round(17 - Math.max(0, y - 22) * 0.7)); m.fill(0, y, w, 1, T.MEADOW); }
  m.fill(4, 17, 2, 18, T.GRAVEL);
  m.add(objSchilf(0, 25, 14)); m.add(objSchilf(0, 33, 10)); m.add(objSchilf(10, 20, 6));
  for (const [x, y, k] of [[2, 21, 'green'], [8, 27, 'yellow'], [3, 31, 'green'], [12, 22, 'autumn']]) m.add(objTree(x, y, k, true));
  m.add(objTafel(6, 18, '#3a5a2a', 'NSG')); m.trig(6, 18, 1, 1, { label: 'Naturschutzgebiet Zellmoos', act: () => Sur.look('zellmoos') });
  m.birdSpots.push({ x: 12, y: 30, w: 10, h: 8, n: 6, kind: 'duck' }, { x: 30, y: 24, w: 30, h: 10, n: 6, kind: 'duck' });
  m.fill(15, 17, 9, 1, T.GRAVEL);
  /* Gamma-Inseli: draussen vor dem Triechter */
  m.add(mkObj(44, 47, 3, 2, 28, (c, Wd, Hd) => {
    E(c, Wd / 2, Hd - 8, 22, 9, '#8a8270'); E(c, Wd / 2, Hd - 10, 20, 7, '#5a7a3a');
    for (const [tx, h] of [[12, 34], [24, 40], [34, 30]]) { R(c, tx - 1, Hd - 12 - h * 0.5, 3, h * 0.5, '#4a3020'); E(c, tx, Hd - 14 - h * 0.6, 8, 10, '#2e5a28'); E(c, tx - 2, Hd - 17 - h * 0.6, 5, 6, '#3e6b32'); }
  }, { solid: true }));
  m.trig(48, 16, 3, 1, { label: 'Fernrohr: Blick aufs Gamma-Inseli', act: async () => { await Sur.look('inseli'); if (!Sur.hasPhoto('gammainseli')) await Sur.photo('gammainseli'); } });
  m.add(mkObj(48, 16, 1, 1, 12, (c) => { R(c, 7, 6, 2, 8, '#4a4e54'); R(c, 3, 2, 10, 5, '#2f5fb8'); R(c, 11, 3, 3, 3, '#8ac0e0'); }, { solid: true }));
  /* Bojen für den Slalom, Segelboot und Schwäne draussen auf dem See */
  for (const [x, y, col] of [[44, 24, '#e8302a'], [50, 27, '#ffd23d'], [56, 24, '#e8302a'], [62, 28, '#ffd23d'], [48, 32, '#e8302a']]) m.add(mkObj(x, y, 1, 1, 6, (c) => { E(c, 8, 13, 4, 2, 'rgba(255,255,255,0.4)'); R(c, 5, 4, 6, 9, col); R(c, 5, 4, 6, 2, '#ffffff'); R(c, 7, 0, 2, 4, '#3a3a40'); }, { solid: false }));
  const segel = mkObj(30, 38, 1, 1, 0, () => {}, { solid: false });
  segel.anim = (c, t, px, py) => { const x = px + Math.sin(t * 0.05) * 240, y = py + Math.cos(t * 0.07) * 20; c.fillStyle = '#f4f0e6'; c.beginPath(); c.moveTo(x, y - 30); c.lineTo(x + 16, y - 4); c.lineTo(x, y - 4); c.closePath(); c.fill(); c.fillStyle = '#e8d8c0'; c.beginPath(); c.moveTo(x - 1, y - 26); c.lineTo(x - 10, y - 4); c.lineTo(x - 1, y - 4); c.closePath(); c.fill(); R(c, x, y - 31, 1, 28, '#5a3a24'); c.fillStyle = '#8a3b2a'; c.beginPath(); c.moveTo(x - 12, y - 3); c.lineTo(x + 18, y - 3); c.lineTo(x + 14, y + 2); c.lineTo(x - 9, y + 2); c.closePath(); c.fill(); R(c, x - 14, y + 3, 34, 1, 'rgba(255,255,255,0.4)'); };
  m.add(segel);
  const schwaene = mkObj(66, 34, 1, 1, 0, () => {}, { solid: false });
  schwaene.anim = (c, t, px, py) => { for (let k = 0; k < 3; k++) { const x = px + k * 14 + Math.sin(t * 0.2 + k) * 10, y = py + k * 6 + Math.cos(t * 0.15 + k) * 4; E(c, x, y, 6, 3, '#f8f8f4'); R(c, x + 4, y - 9, 2, 8, '#f8f8f4'); E(c, x + 5, y - 9, 2, 2, '#f8f8f4'); R(c, x + 7, y - 9, 2, 1, '#e8702a'); P(c, x + 7, y - 8, '#1a1a1a'); R(c, x - 7, y + 3, 14, 1, 'rgba(255,255,255,0.35)'); } };
  m.add(schwaene);
  /* Gegenufer im Süden: Hügel mit Dörfern, weit weg */
  m.fill(0, 54, W, 6, T.MEADOW);
  m.add(mkObj(0, 54, W, 6, 20, (c, Wd, Hd) => {
    for (let x = 0; x < Wd; x++) { const h = 22 + Math.abs(Math.sin(x * 0.01)) * 14 + Math.sin(x * 0.033) * 5; R(c, x, Hd - 96 + 40 - h * 0.6, 1, 96, '#5a7a48'); }
    for (let x = 0; x < Wd; x += 3) { const y = Hd - 70 + Math.sin(x * 0.02) * 6; E(c, x, y, 3, 4, '#3e6b32'); }
    for (let k = 0; k < 14; k++) { const x = 40 + k * 100 + (k % 3) * 17, y = Hd - 62; R(c, x, y, 8, 5, '#e8e0cc'); R(c, x - 1, y - 2, 10, 2, '#8a3b2a'); if (k % 4 === 1) { R(c, x + 3, y - 10, 2, 8, '#e8e0cc'); R(c, x + 3, y - 12, 2, 2, '#4f7a58'); } }
    R(c, 0, 0, Wd, 22, 'rgba(0,0,0,0)');
  }, { solid: true }));
  /* Fussgänger und Spawns */
  m.pedZones.push({ x: 24, y: 15, w: 30, h: 2, n: 5 }, { x: 56, y: 10, w: 15, h: 6, n: 3 }, { x: 0, y: 6, w: 92, h: 2, n: 3 });
  m.npcDefs.push(
    { id: 'fischer', name: 'Fischer Wäli', x: 39 * 16 + 8, y: 18 * 16 + 12, dir: 0, look: npcLook(3101, { hat: 3, hatCol: 4, beard: 7, beardCol: 9, hairCol: 9, top: 7, topCol: 3, pants: 0, glasses: 0 }), talk: () => Sur.talk('fischer'), keepDir: true, bubbleRand: ['dots'] },
    { id: 'bootsvermieter', name: 'Bootsvermieter Sepp', x: 33 * 16 + 8, y: 13 * 16 + 12, dir: 0, look: npcLook(3102, { hat: 5, hatCol: 9, beard: 1, top: 10, topCol: 9, glasses: 4 }), talk: () => Sur.bootsverleih(), keepDir: true, bubbleRand: ['dots'] },
    { id: 'kari', name: 'Schatzsucher Kari', x: 7 * 16 + 8, y: 26 * 16 + 12, dir: 2, look: npcLook(3103, { hat: 1, hatCol: 7, beard: 3, top: 7, topCol: 6, glasses: 0 }), talk: () => Sur.talk('kari'), wander: { x: 4, y: 22, w: 5, h: 10 }, bubbleRand: ['?', 'dots'] },
  );
  m.spawn('quai', 33, 17, 0);
  m.spawn('inseli_back', 35, 18, 3);
  m.groundAnim = waterAnim;
  m.update = (dt) => Sur.mapUpdate(dt);
  return m;
};
