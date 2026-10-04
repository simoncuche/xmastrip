/* ============ Minispiele für Sursee (Krimi „Gans oder gar nicht“) ============
   Ergänzt das Objekt Mini aus 11_minigames.js. Jedes Spiel läuft über Mini.run und löst sein Promise immer auf
   (× = null). Rekorde liegen in G.S.rec, Schlüssel werden bei Bedarf angelegt.
   See:     fishing(spot) Fischen vom Quai oder Boot · pedalo() einmal ums Gamma-Inseli · motorboat() Bojen-Slalom im Triechter
            sup() Stand-up-Paddle · sprung(h) Sprungturm im Strandbad · bootsjagd() Verfolgung bis zum Gamma-Inseli
   Velo:    velo('zeit' | 'chase') Zeitfahren Bahnhof → See oder Verfolgung durchs Städtli
   Chilbi:  schiessbude() · lukas() Hau den Lukas · entenfischen() · buechsen() Büchsenwerfen · achterbahn() · riesenrad() Suchbild
   Brauch:  gansabhauet() Hieb mit Sonnenmaske · sackgumpe(names) · chaeszaenne() Grimassen · stange() Stangechlädere
   Musik:   rhythm('konzert' | 'guugge') Stubete Gäng (Samichlaus Tour) in der Stadthalle oder Probe der Diebetormtöibeler
   Römer:   detektor() Metalldetektor im Vicus
   Gemeinsame Hilfen in MSU: gehaltene Tasten/Knöpfe, Pointer-Position, Spielerfigur, Himmel, Hügel, See, Rekorde. */
const MSU = {
  ACT: ['Space', 'Enter', 'KeyE'], LEFT: ['ArrowLeft', 'KeyA'], RIGHT: ['ArrowRight', 'KeyD'], UP: ['ArrowUp', 'KeyW'], DOWN: ['ArrowDown', 'KeyS'],
  POSE: { stand: 0, walkA: 1, walkB: 2, sit: 3, drink: 4, danceA: 5, danceB: 6, bend: 7 },
  /* gehaltene Tasten: map = { name: [codes] } → st.name ist true, solange gedrückt. Räumt sich selbst weg, wenn das Spiel zu ist. */
  hold(api, map) {
    const st = {};
    const names = (code) => Object.keys(map).filter((k) => map[k].includes(code));
    const off = () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('blur', bl); };
    const kd = (e) => { if (!api.cv.isConnected) return off(); for (const k of names(e.code)) st[k] = true; };
    const ku = (e) => { if (!api.cv.isConnected) return off(); for (const k of names(e.code)) st[k] = false; };
    const bl = () => { for (const k in st) st[k] = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku); window.addEventListener('blur', bl);
    return st;
  },
  /* Knopf oder Fläche halten (Touch und Maus) */
  holdEl(el, st, k, onDown) {
    if (!el) return;
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); st[k] = true; if (onDown) onDown(e); try { el.setPointerCapture(e.pointerId); } catch (er) { /* egal */ } });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(ev, () => { st[k] = false; });
  },
  tap(el, fn) { if (el) el.addEventListener('pointerdown', (e) => { e.preventDefault(); fn(e); }); },
  pos(api, e, W, H) { const r = api.cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; },
  me() { return getSheet(G.S.look); },
  spr(c, sheet, pose, dir, x, y, s = 1, alpha = 1) { c.globalAlpha = alpha; c.drawImage(sheet, MSU.POSE[pose] * SPR_W, dir * SPR_H, SPR_W, SPR_H, Math.round(x), Math.round(y), SPR_W * s, SPR_H * s); c.globalAlpha = 1; },
  head(c, sheet, x, y, s = 1, dir = 0) { c.drawImage(sheet, 0, dir * SPR_H, SPR_W, 12, Math.round(x), Math.round(y), SPR_W * s, 12 * s); },
  txt(c, s, x, y, col, sc = 1, sh = '#10161f') { pxText(c, s, Math.round(x) + sc, Math.round(y) + sc, sh, sc); pxText(c, s, Math.round(x), Math.round(y), col, sc); },
  ctr(c, s, cx, y, col, sc = 1, sh) { MSU.txt(c, s, cx - pxTextW(s, sc) / 2, y, col, sc, sh); },
  /* Rekord setzen: lower = kleiner ist besser (Zeiten) */
  rec(k, v, lower) { G.S.rec = G.S.rec || {}; const o = G.S.rec[k]; const nb = o == null || (lower ? v < o : v > o); if (nb) G.S.rec[k] = v; return nb; },
  sec: (s) => s.toFixed(1).replace('.', ',') + ' s',
  tri: (u) => 1 - Math.abs((((u % 2) + 2) % 2) - 1),
  look(seed, kid) { const L = randomLook(rng(seed), {}); if (kid) L.kid = kid; return L; },
  /* Himmel im Dezember: blassblau am Tag, tiefblau mit Sternen in der Nacht */
  sky(c, W, y1, night, seed = 1) {
    const top = night ? '#0c1230' : '#93b0c8', bot = night ? '#2c3660' : '#e6edf0';
    for (let y = 0; y < y1; y++) R(c, 0, y, W, 1, mix(top, bot, y / Math.max(1, y1)));
    if (night) for (let i = 0; i < 26; i++) P(c, Math.floor(hash(i, seed) * W), Math.floor(hash(i, seed + 3) * y1 * 0.75), hash(i, 9) > 0.6 ? '#ffffff' : '#9aa8d8');
  },
  /* ferne Alpen (Pilatus, Rigi) und verschneite Hügel rund um den Sempachersee */
  hills(c, W, yH, night, off = 0) {
    for (let x = 0; x < W; x++) {
      const xx = x + off;
      const a = 10 + Math.abs(Math.sin(xx * 0.019 + 1.3)) * 11 + Math.abs(Math.sin(xx * 0.061)) * 4;
      R(c, x, yH - a, 1, a, night ? '#2e365a' : '#a6b2c6'); R(c, x, yH - a, 1, Math.max(1, Math.round(a * 0.4)), night ? '#8892b8' : '#f6f8fa');
      const b = 5 + Math.sin(xx * 0.035 + 0.4) * 3 + Math.sin(xx * 0.11) * 1.5;
      R(c, x, yH - b, 1, b, night ? '#1a262c' : '#687a5e'); if (hash(xx, 3) < 0.55) P(c, x, yH - b, night ? '#9aa4b8' : '#f2f4f2');
      if (hash(xx, 5) < 0.12) R(c, x, yH - b - 2, 1, 2, night ? '#16202a' : '#3f5242');
    }
  },
  /* Wasser von der Seite: dunkles Blaugrün mit Glitzerstrichen */
  water(c, W, y0, y1, t, night) {
    const top = night ? '#18343c' : '#3c6c6c', bot = night ? '#0a1a22' : '#173e44';
    for (let y = y0; y < y1; y++) R(c, 0, y, W, 1, mix(top, bot, (y - y0) / Math.max(1, y1 - y0)));
    for (let i = 0; i < 44; i++) { const yy = y0 + 1 + Math.floor(hash(i, 2) * (y1 - y0 - 1)), w = 2 + (i % 4) + Math.round((yy - y0) * 0.06); const xx = ((hash(i, 4) * (W + 30) + t * (3 + (i % 3) * 2)) % (W + 30)) - 15; R(c, xx, yy, w, 1, night ? '#2c5260' : '#6a9896'); }
  },
  /* Wasser von oben (Kartenblick), verschiebbar mit oy */
  waterTop(c, x0, y0, w, h, oy, t, night) {
    R(c, x0, y0, w, h, night ? '#123038' : '#24575a');
    for (let i = 0; i < 60; i++) { const yy = ((hash(i, 7) * (h + 20) + oy) % (h + 20) + h + 20) % (h + 20) - 10 + y0; const xx = x0 + hash(i, 8) * w + Math.sin(t * 1.3 + i) * 2; R(c, xx, yy, 3 + (i % 3), 1, night ? '#21485a' : '#3d7a78'); if (i % 4 === 0) P(c, xx + 1, yy - 1, night ? '#2a5868' : '#5c9a96'); }
  },
  /* Gamma-Inseli seitlich: winzige Insel mit hohen kahlen Bäumen */
  isle(c, x, y, s, night) {
    const crown = night ? '#141c1c' : '#5a4e44', twig = night ? '#22302c' : '#7a6c5a', trunk = night ? '#101414' : '#3a3028';
    E(c, x, y + 1, 10 * s + 1, Math.max(1, 1.4 * s), night ? 'rgba(0,0,0,0.35)' : 'rgba(20,50,50,0.35)');
    E(c, x, y, 9 * s, Math.max(1, 1.6 * s), night ? '#1a2418' : '#6a6440');
    for (const [dx, hh, w] of [[-5.5, 15, 2.4], [-2, 21, 3.2], [2, 18, 3], [6, 12, 2.2]]) {
      const tx = Math.round(x + dx * s), th = hh * s, cw = Math.max(1, w * s), cy = y - th * 0.62, cry = th * 0.4;
      line(c, tx, y - 1, tx, cy, trunk);
      E(c, tx, cy, cw, cry, crown);
      for (let k = 0; k < th; k++) if (hash(tx, k, 3) < 0.35) P(c, tx + Math.round((hash(tx, k, 4) - 0.5) * cw * 2), cy - cry + k * cry * 2 / th, twig);
      if (!night) P(c, tx, cy - cry, '#f4f6f4');
    }
  },
  /* Gamma-Inseli von oben */
  isleTop(c, x, y, rx, ry, night) {
    E(c, x, y, rx + 2, ry + 2, night ? '#1d3e40' : '#3f7a74');
    E(c, x, y, rx, ry, night ? '#3a3a2a' : '#8a7a52');
    E(c, x - 1, y - 1, rx - 2, ry - 2, night ? '#2a3424' : '#6a7448');
    for (let k = 0; k < 7; k++) { const a = k * 0.9, tx = x + Math.cos(a) * rx * 0.5, ty = y + Math.sin(a) * ry * 0.45; E(c, tx, ty, 4, 3, night ? '#1a2418' : '#4c5a34'); dither(c, Math.round(tx - 3), Math.round(ty - 2), 6, 4, night ? '#2c2a20' : '#6a5a40', 0.5); P(c, tx, ty - 2, '#f4f6f4'); }
  },
  /* Chilbi-Hintergrund am Abend: Lichterketten, Zelte, Riesenrad am Horizont */
  chilbi(c, W, H, t, yGround) {
    for (let y = 0; y < yGround; y++) R(c, 0, y, W, 1, mix('#0e1030', '#3a2a5a', y / yGround));
    for (let i = 0; i < 16; i++) P(c, Math.floor(hash(i, 21) * W), Math.floor(hash(i, 22) * yGround * 0.5), '#c8d0ff');
    const cx = W - 30, cy = yGround - 34;
    c.strokeStyle = '#4a3a6a'; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, 26, 0, Math.PI * 2); c.stroke();
    for (let k = 0; k < 10; k++) { const a = t * 0.2 + k * Math.PI / 5; line(c, cx, cy, cx + Math.cos(a) * 26, cy + Math.sin(a) * 26, '#3a2e58'); P(c, cx + Math.cos(a) * 26, cy + Math.sin(a) * 26, k % 2 ? '#ffd23d' : '#ff6ad0'); }
    line(c, cx, cy, cx - 12, yGround, '#3a2e58'); line(c, cx, cy, cx + 12, yGround, '#3a2e58');
    for (let i = 0; i < 6; i++) { const x = i * 30 - 6, h = 14 + (i % 3) * 5; R(c, x, yGround - h, 26, h, ['#5a2a4a', '#2a3a5a', '#4a2a2a'][i % 3]); for (let k = 0; k < 26; k += 4) R(c, x + k, yGround - h - 3, 2, 3, k % 8 ? '#e8e0d0' : '#c8302a'); }
    for (let x = 0; x < W; x += 5) { const y = 8 + Math.sin(x * 0.06) * 3; P(c, x, y, ['#ffd23d', '#ff6a5a', '#6ae0ff', '#7aff6a'][(x / 5 + Math.floor(t * 3)) % 4 | 0]); }
  },
  /* Fische fürs Fangbild */
  fish(c, k, cx, cy, L) {
    const h = L / 2;
    if (k === 'schuh') {
      R(c, cx - h, cy - 2, L * 0.75, 7, '#5a3a24'); R(c, cx - h + L * 0.45, cy - 10, L * 0.3, 10, '#5a3a24'); R(c, cx - h, cy + 4, L * 0.9, 2, '#2a1a10');
      R(c, cx - h + L * 0.5, cy - 9, L * 0.2, 1, '#8a6a4a'); for (let k2 = 0; k2 < 3; k2++) line(c, cx - h + L * 0.48, cy - 7 + k2 * 2, cx - h + L * 0.7, cy - 6 + k2 * 2, '#d8d0c0');
      line(c, cx - h + 3, cy - 2, cx - h + 1, cy - 8, '#3f7a3a'); line(c, cx - h + 5, cy - 2, cx - h + 7, cy - 9, '#3f7a3a');
      for (let k2 = 0; k2 < 3; k2++) P(c, cx - h + 6 + k2 * 6, cy + 7 + k2 % 2, '#7ab8e0');
      return;
    }
    const D = { felchen: ['#5f7f94', '#e6eef2', 7, '#9fb0bc'], egli: ['#7a8a3a', '#e8d8a0', 4.4, '#e8602a'], hecht: ['#4a6a34', '#d8d8a0', 8.5, '#8a7a3a'] }[k];
    const ry = Math.max(2, Math.round(L / D[2]));
    c.fillStyle = D[3]; c.beginPath(); c.moveTo(cx - h + 2, cy); c.lineTo(cx - h - ry * 1.4, cy - ry * 1.3); c.lineTo(cx - h - ry * 0.6, cy); c.lineTo(cx - h - ry * 1.4, cy + ry * 1.3); c.closePath(); c.fill();
    E(c, cx, cy, h, ry, D[0]); E(c, cx, cy + Math.ceil(ry / 2), h - 2, Math.max(1, Math.floor(ry / 2)), D[1]);
    if (k === 'egli') { for (let i = 0; i < 6; i++) R(c, cx - h * 0.6 + i * L * 0.13, cy - ry + 1, 2, ry + 1, '#3a4a1e'); for (let i = 0; i < 5; i++) line(c, cx - h * 0.3 + i * 3, cy - ry, cx - h * 0.3 + i * 3 + 1, cy - ry - 4, '#5a6a2a'); R(c, cx - 2, cy + ry - 1, 5, 3, D[3]); }
    if (k === 'hecht') { for (let i = 0; i < 18; i++) P(c, cx - h * 0.8 + hash(i, 3) * L * 0.8, cy - ry + 1 + hash(i, 4) * ry * 1.4, '#c8c890'); R(c, cx + h - 2, cy - 1, 6, 3, D[0]); R(c, cx + h - 2, cy + 1, 6, 1, '#2a3a1e'); R(c, cx - h * 0.55, cy - ry - 3, L * 0.12, 3, D[3]); }
    if (k === 'felchen') { R(c, cx - 3, cy - ry - 3, 5, 3, D[3]); line(c, cx - h + 3, cy, cx + h - 4, cy, '#c8d4da'); }
    E(c, cx + h - 4, cy - 1, 1.5, 1.5, '#f4f4f0'); P(c, cx + h - 4, cy - 1, '#101010');
    line(c, cx + h - 9, cy - ry + 2, cx + h - 8, cy + ry - 2, shade(D[0], -0.3));
  },
};

Object.assign(Mini, {
  /* ---------- Fischen: Kraft wählen, warten, Anhieb im richtigen Moment, Drill mit Schnurspannung ---------- */
  fishing(spot = 'quai') {
    const boat = spot === 'boot', W = 160, H = 120, HY = 42;
    const night = isNight(), wob = Mini.wob(), sheet = MSU.me();
    G.S.rec = G.S.rec || {}; G.S.rec.fish = G.S.rec.fish || {};
    const FISH = {
      felchen: { n: 'Felchen', a: 25, b: 45, pull: 1, len: 3.4, zone: [0.32, 0.76] },
      egli: { n: 'Egli', a: 15, b: 30, pull: 0.8, len: 2.6, zone: [0.3, 0.78] },
      hecht: { n: 'Hecht', a: 50, b: 100, pull: 1.55, len: 5.5, zone: [0.38, 0.72] },
      schuh: { n: 'Alter Schuh', a: 26, b: 31, pull: 0, len: 2, zone: [0.25, 0.85] },
    };
    return this.run('Fischen', boat ? 'im Boot auf dem Triechter' : 'am Quai', `<canvas aria-label="Fischen am Sempachersee"></canvas><div class="mini-bar"><span id="fInfo">Tippen, wenn die Wurfkraft stimmt. Weiter draussen beissen die Grossen.</span><b id="fScore">3 Würfe</b></div><button class="btn primary" id="fBtn" style="height:56px">Auswerfen</button>`, W, H, (api) => {
      const st = { phase: 'power', t: 0, pt: 0, pow: 0, meter: 0, tries: 3, wait: 0, nib: 0, bite: 0, bitten: false, k: null, cm: 0, ten: 0.4, prog: 0, surge: 0, surgeT: 2, slack: 0, catches: [], last: null, msg: '', msgT: 0, rip: [], tick: 0 };
      const hold = MSU.hold(api, { reel: ['Space', 'Enter', 'KeyE', 'ArrowUp', 'KeyW'] });
      const btn = api.o.querySelector('#fBtn'), info = api.o.querySelector('#fInfo'), score = api.o.querySelector('#fScore');
      const say = (m, t = 1.1) => { st.msg = m; st.msgT = t; };
      const spotXY = (p) => [46 + p * 100, 104 - p * 50];
      const rodBase = boat ? [34, 70] : [24, 46];
      const ripple = (x, y) => st.rip.push({ x, y, t: 0 });
      const finishAll = () => {
        const fishes = st.catches.filter((k) => k.k !== 'schuh'), pool = fishes.length ? fishes : st.catches;
        const top = pool.reduce((a, b) => (!a || b.cm > a.cm ? b : a), null);
        api.finish({ fish: top ? top.k : null, cm: top ? top.cm : 0, best: top ? G.S.rec.fish[top.k] : 0, felchen: st.catches.some((k) => k.k === 'felchen'), rekord: st.catches.some((k) => k.rec), catches: st.catches.map((k) => ({ fish: k.k, cm: k.cm })) });
      };
      const next = () => {
        if (st.tries <= 0) { st.phase = 'end'; st.pt = 0; btn.textContent = 'Fertig'; const n = st.catches.filter((k) => k.k !== 'schuh').length; info.textContent = n ? `Petri Heil! ${n} Fisch${n > 1 ? 'e' : ''} im Kessel.` : 'Heute wollte keiner beissen.'; return; }
        st.phase = 'power'; st.pt = 0; st.last = null; btn.textContent = 'Auswerfen'; info.textContent = 'Tippen, wenn die Wurfkraft stimmt.';
      };
      const lost = (m) => { st.phase = 'show'; st.pt = 0; st.last = null; say(m, 1.6); info.textContent = m; Snd.sfx('lose'); btn.textContent = 'Weiter'; };
      const caught = () => {
        const F = FISH[st.k];
        const old = G.S.rec.fish[st.k] || 0, isRec = st.k !== 'schuh' && st.cm > old;
        if (st.cm > old) G.S.rec.fish[st.k] = st.cm;
        st.last = { k: st.k, cm: st.cm, rec: isRec }; st.catches.push(st.last);
        st.phase = 'show'; st.pt = 0; btn.textContent = 'Weiter';
        if (st.k === 'schuh') { Snd.sfx('splash'); info.textContent = 'Ein alter Schuh … immerhin Grösse 44.'; }
        else { Snd.sfx('win'); info.textContent = `${F.n}, ${st.cm} cm!${isRec ? ' Neuer Rekord!' : ''}`; }
      };
      const hook = () => {
        const far = st.pow, r = Math.random();
        const pH = 0.07 + (boat ? 0.07 : 0) + (far > 0.75 ? 0.05 : 0), pS = boat ? 0.07 : 0.1, pE = 0.3 - far * 0.08;
        st.k = r < pH ? 'hecht' : r < pH + pS ? 'schuh' : r < pH + pS + pE ? 'egli' : 'felchen';
        const F = FISH[st.k];
        st.cm = Math.round(F.a + (F.b - F.a) * Math.pow(Math.random(), 1.5) * (0.7 + far * 0.3));
        st.phase = 'drill'; st.pt = 0; st.ten = 0.45; st.prog = 0; st.slack = 0; st.surge = 0; st.surgeT = rnd(0.8, 1.6);
        Snd.sfx('hit'); say('ANHIEB!', 0.8); btn.textContent = 'Einholen (halten)';
        info.textContent = 'Halten = einholen, loslassen = Schnur geben. Spannung im grünen Bereich halten!';
      };
      const act = () => {
        if (st.phase === 'power') { st.pow = clamp(st.meter, 0.06, 1); st.tries--; st.phase = 'fly'; st.pt = 0; Snd.sfx('whoosh'); btn.textContent = 'Anhieb!'; info.textContent = 'Warte, bis der Zapfen ganz abtaucht – dann Anhieb!'; score.textContent = `${st.tries} Würfe übrig`; }
        else if (st.phase === 'wait') {
          if (st.bite > 0) hook();
          else if (st.nib > 0) { say('ZU FRÜH!'); info.textContent = 'Nur geknabbert! Der Fisch ist misstrauisch – nochmal warten.'; st.wait = rnd(2, 3.4); st.nib = 0; Snd.sfx('error'); }
          else say('GEDULD', 0.6);
        } else if (st.phase === 'show' && st.pt > 0.5) next();
        else if (st.phase === 'end' && st.pt > 0.4) finishAll();
      };
      btn.addEventListener('pointerdown', (e) => { e.preventDefault(); hold.reelB = true; act(); });
      for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) btn.addEventListener(ev, () => { hold.reelB = false; });
      api.cv.addEventListener('pointerdown', (e) => { e.preventDefault(); hold.reelC = true; act(); });
      for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) api.cv.addEventListener(ev, () => { hold.reelC = false; });
      Mini.key = (k) => { if (MSU.ACT.includes(k) || MSU.UP.includes(k)) act(); };
      Mini._fish = { st, act, hold }; /* für Tests */
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; st.pt += dt; if (st.msgT > 0) st.msgT -= dt;
        const reel = !!(hold.reel || hold.reelB || hold.reelC);
        if (st.phase === 'power') st.meter = MSU.tri(st.t * 0.9 * wob);
        if (st.phase === 'fly' && st.pt > 0.75) { st.phase = 'wait'; st.pt = 0; st.wait = rnd(2, 4.6); st.bite = 0; st.bitten = false; st.nib = 0; const [x, y] = spotXY(st.pow); ripple(x, y); Snd.tone(320, 0.1, 'sine', 0.07, 0, -160); }
        if (st.phase === 'wait') {
          st.wait -= dt; if (st.nib > 0) st.nib -= dt;
          if (st.wait > 0.9 && st.nib <= 0 && Math.random() < dt * 0.45) { st.nib = 0.35; Snd.tone(760, 0.04, 'sine', 0.04); const [x, y] = spotXY(st.pow); ripple(x, y); }
          if (st.wait <= 0 && !st.bitten) { st.bitten = true; st.bite = 0.95 / Math.sqrt(wob); st.nib = 0; Snd.tone(200, 0.16, 'sine', 0.12, 0, -110); say('BISS!', 0.8); const [x, y] = spotXY(st.pow); ripple(x, y); ripple(x, y + 1); }
          if (st.bitten) { st.bite -= dt; if (st.bite <= 0) lost('Weg ist er! Zu spät angeschlagen.'); }
        }
        if (st.phase === 'drill') {
          const F = FISH[st.k];
          st.surgeT -= dt; if (st.surgeT <= 0) { st.surge = F.pull ? rnd(0.5, 1) : 0; st.surgeT = rnd(1.3, 2.6) / Math.max(0.6, F.pull); if (st.surge) { say('ER ZIEHT!', 0.7); Snd.tone(160, 0.2, 'sawtooth', 0.04, 0, 60); } }
          if (st.surge > 0) st.surge -= dt;
          st.ten += ((reel ? 0.6 : -0.48) + (st.surge > 0 ? 0.52 * F.pull : 0) + Math.sin(st.t * 6.3) * 0.1 * wob) * dt;
          st.ten = Math.max(0, st.ten);
          const [z0, z1] = F.zone, green = st.ten >= z0 && st.ten <= z1;
          if (reel && st.ten >= z0 * 0.8) { st.prog += dt / F.len * (green ? 1 : 0.4); st.tick -= dt; if (st.tick <= 0) { st.tick = 0.09; Snd.tone(1300, 0.012, 'square', 0.015); } }
          if (st.ten >= 1) lost('Schnur gerissen! Zu fest gezogen.');
          else if (st.ten < 0.1) { st.slack += dt; if (st.slack > 2) lost('Ausgehakt! Die Schnur war zu locker.'); } else st.slack = 0;
          if (st.phase === 'drill' && st.prog >= 1) caught();
        }
        if (st.phase === 'show' && st.pt > 3.2) next();
        if (st.phase === 'end' && st.pt > 2.4) { finishAll(); return; }
        for (const r of st.rip) r.t += dt; st.rip = st.rip.filter((r) => r.t < 1.2);
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        MSU.sky(c, W, HY, night, 4); MSU.hills(c, W, HY, night, 40);
        if (!night) for (let i = 0; i < 3; i++) { const cx = (i * 61 + st.t * 2) % 190 - 20; E(c, cx, 10 + i * 6, 10, 2, 'rgba(255,255,255,0.55)'); }
        MSU.water(c, W, HY, H, st.t, night);
        MSU.isle(c, 132, HY + 2, 0.55, night);
        R(c, 60, HY, 30, 1, night ? '#2a3a2a' : '#7a8a6a'); for (let x = 60; x < 90; x += 3) P(c, x, HY - 1, night ? '#2a3a2a' : '#8a9a5a');
        /* Enten ziehen vorbei */
        for (let i = 0; i < 2; i++) { const dx = ((st.t * 4 + i * 9) % 220) - 30, dy = 50 + i; E(c, 170 - dx, dy, 2, 1, '#6a5a3a'); P(c, 168 - dx, dy - 1, i ? '#2a6a3a' : '#6a5a3a'); }
        /* Schneeflocken */
        for (let i = 0; i < 14; i++) P(c, (hash(i, 1) * W + Math.sin(st.t + i) * 4) % W, (hash(i, 2) * H + st.t * (6 + i % 4)) % H, 'rgba(255,255,255,0.7)');
        let bx = 0, by = 0;
        const [tx, ty] = spotXY(st.pow);
        if (st.phase === 'fly') { const u = Math.min(1, st.pt / 0.75); bx = lerp(rodBase[0] + 24, tx, u); by = lerp(rodBase[1] - 24, ty, u) - Math.sin(u * Math.PI) * 26; }
        else if (st.phase === 'wait') { bx = tx; by = ty + (st.nib > 0 ? 1 : 0) + Math.sin(st.t * 2) * 0.5; }
        else if (st.phase === 'drill') { const [nx, ny] = spotXY(0); bx = lerp(tx, nx - 4, st.prog) + (st.surge > 0 ? Math.sin(st.t * 22) * 2 : Math.sin(st.t * 3) * 3); by = lerp(ty, ny + 2, st.prog); }
        for (const r of st.rip) { const a = Math.max(0, 0.8 - r.t); c.strokeStyle = `rgba(220,240,240,${a})`; c.beginPath(); c.ellipse(r.x, r.y + 1, 2 + r.t * 9, 1 + r.t * 3, 0, 0, 6.29); c.stroke(); }
        /* Ufer oder Boot mit Spielerfigur */
        if (!boat) {
          R(c, 0, 72, 36, 48, '#6e685c'); for (let y = 72; y < 120; y += 5) for (let x = ((y / 5) % 2) * 5 - 5; x < 36; x += 10) { R(c, x + 1, y + 1, 8, 3, '#7e786a'); P(c, x + 1, y + 1, '#968e7e'); }
          R(c, 0, 70, 38, 3, '#b8b0a0'); R(c, 0, 69, 38, 1, '#dcd6ca'); R(c, 36, 72, 2, 48, '#4e4a42');
          R(c, 0, 72, 36, 1, 'rgba(255,255,255,0.4)');
          for (let x = 2; x < 34; x += 10) R(c, x, 58, 2, 12, '#3a3c40'); R(c, 0, 58, 36, 2, '#4a4c52');
          R(c, 30, 30, 2, 40, '#2a2c30'); R(c, 27, 27, 8, 4, '#3a3c40'); E(c, 31, 33, 2, 2, night ? '#ffe9a0' : '#d8d4c4'); if (night) E(c, 31, 34, 8, 6, 'rgba(255,220,140,0.12)');
          MSU.spr(c, sheet, 'stand', 2, 6, 44, 1);
        } else {
          const bob = Math.sin(st.t * 1.6) * 1;
          MSU.spr(c, sheet, 'sit', 2, 10, 50 + bob, 1);
          c.fillStyle = '#7a4a2a'; c.beginPath(); c.moveTo(0, 70 + bob); c.lineTo(46, 70 + bob); c.lineTo(40, 80 + bob); c.lineTo(4, 80 + bob); c.closePath(); c.fill();
          R(c, 0, 70 + bob, 46, 2, '#a86a3a'); R(c, 4, 76 + bob, 36, 1, '#5a3a1e'); R(c, 0, 80 + bob, 42, 1, 'rgba(255,255,255,0.3)');
          line(c, 6, 66 + bob, 18, 86 + bob, '#c8a070'); R(c, 16, 84 + bob, 4, 3, '#c8a070');
        }
        /* Rute und Schnur */
        const bend = st.phase === 'drill' ? st.ten * 10 + (st.surge > 0 ? 3 : 0) : st.phase === 'power' ? -st.meter * 6 : 0;
        const [rx0, ry0] = rodBase, rtx = rx0 + 22 + (st.phase === 'power' ? -st.meter * 14 : 0), rty = ry0 - 26 + bend;
        line(c, rx0, ry0, (rx0 + rtx) / 2, (ry0 + rty) / 2 - 3 + bend * 0.2, '#3a2a1a'); line(c, (rx0 + rtx) / 2, (ry0 + rty) / 2 - 3 + bend * 0.2, rtx, rty, '#6a5a4a'); R(c, rx0 + 2, ry0 - 3, 3, 3, '#9aa0a8');
        if (st.phase === 'fly' || st.phase === 'wait' || st.phase === 'drill') {
          const sag = st.phase === 'drill' ? (1 - st.ten) * 8 : 10;
          let px = rtx, py = rty; for (let i = 1; i <= 12; i++) { const u = i / 12, nx = lerp(rtx, bx, u), ny = lerp(rty, by - 3, u) + Math.sin(u * Math.PI) * sag; line(c, px, py, nx, ny, 'rgba(240,240,240,0.7)'); px = nx; py = ny; }
          const under = st.phase === 'drill' || (st.bitten && st.bite > 0);
          if (!under) { R(c, bx - 1, by - 4, 3, 2, '#e8302a'); R(c, bx - 1, by - 2, 3, 2, '#f4f0e6'); P(c, bx, by - 5, '#1a1a1a'); }
          else { E(c, bx, by + 2, 5, 2, 'rgba(10,20,20,0.5)'); if (st.phase === 'drill') { E(c, bx, by + 3, 4, 1, shade(st.k === 'schuh' ? '#5a3a24' : '#2a3a3a', 0)); if (Math.floor(st.t * 6) % 3 === 0) ripple(bx, by); } }
        }
        /* Anzeigen */
        if (st.phase === 'power') {
          R(c, 52, 108, 102, 8, '#10161f'); R(c, 53, 109, Math.round(st.meter * 100), 6, mix('#7af0a0', '#ffb53d', st.meter)); R(c, 128, 107, 1, 10, '#ffffff'); MSU.txt(c, 'KRAFT', 54, 100, '#f4f0e6');
        }
        if (st.phase === 'drill') {
          const F = FISH[st.k], bh = 64, by0 = 14, zy = (v) => by0 + bh - Math.round(clamp(v, 0, 1) * bh);
          R(c, 148, by0 - 1, 9, bh + 2, '#10161f'); R(c, 149, zy(1), 7, bh, '#7a2a2a'); R(c, 149, zy(F.zone[1]), 7, Math.round((F.zone[1] - F.zone[0]) * bh), '#3fae4a'); R(c, 149, zy(F.zone[0]), 7, Math.round(F.zone[0] * bh), '#2a3a5a');
          R(c, 146, zy(st.ten), 13, 2, '#ffffff'); MSU.txt(c, 'ZUG', 146, by0 + bh + 3, '#f4f0e6');
          R(c, 52, 4, 82, 6, '#10161f'); R(c, 53, 5, Math.round(st.prog * 80), 4, '#ffd23d'); MSU.txt(c, 'EINHOLEN', 54, 12, '#f4f0e6');
        }
        if (st.phase === 'show' && st.last) {
          R(c, 22, 30, 116, 58, 'rgba(10,16,24,0.82)'); R(c, 22, 30, 116, 1, '#ffd23d');
          const L = clamp(st.last.cm * 0.9, 24, 92);
          MSU.fish(c, st.last.k, 80 + (st.last.k === 'schuh' ? 4 : 0), 54 + Math.sin(st.pt * 5) * (st.pt < 1 ? 2 : 0), L);
          MSU.ctr(c, `${FISH[st.last.k].n} ${st.last.cm} CM`, 80, 74, '#ffd23d');
          if (st.last.rec) MSU.ctr(c, 'NEUER REKORD!', 80, 81, Math.floor(st.t * 4) % 2 ? '#7af0a0' : '#ffffff');
        }
        if (st.phase === 'end') {
          R(c, 18, 26, 124, 64, 'rgba(10,16,24,0.85)'); MSU.ctr(c, 'FANG DES TAGES', 80, 30, '#ffd23d');
          st.catches.forEach((k, i) => { MSU.fish(c, k.k, 46 + i * 34, 52, 24); MSU.ctr(c, k.cm + ' CM', 46 + i * 34, 64, '#f4f0e6'); });
          if (!st.catches.length) MSU.ctr(c, 'NICHTS GEFANGEN', 80, 52, '#c9ccd2');
        }
        if (st.msgT > 0) MSU.ctr(c, st.msg, 92, 26, st.msg === 'BISS!' || st.msg === 'ANHIEB!' ? '#7af0a0' : '#ffb53d', 2);
      };
    });
  },

  /* ---------- Pedalo: einmal ums Gamma-Inseli an vier Bojen vorbei, auf Zeit ---------- */
  pedalo() {
    const W = 160, H = 120, LIMIT = 35, night = isNight(), wob = Mini.wob(), skin = lc(G.S.look, 'skin'), hair = lc(G.S.look, 'hairCol'), top = lc(G.S.look, 'topCol');
    const IX = 80, IY = 52, IRX = 16, IRY = 11;
    const BUOYS = [[128, 80], [128, 24], [32, 24], [32, 80]];
    return this.run('Pedalo', 'einmal ums Gamma-Inseli', `<canvas aria-label="Pedalo auf dem Sempachersee"></canvas><div class="mini-bar"><span id="pInfo">Abwechselnd links und rechts treten = geradeaus. Nur eine Seite = Kurve.</span><b id="pT">0,0 s</b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-p="l">◀ Links</button><button data-p="r">Rechts ▶</button></div>`, W, H, (api) => {
      const st = { x: 80, y: 104, a: 0, v: 0, va: 0, t: 0, run: false, next: 0, last: null, done: false, end: 0, wake: [], msg: '', msgT: 0, pedal: 0, bump: 0 };
      const info = api.o.querySelector('#pInfo'), tEl = api.o.querySelector('#pT');
      const pedal = (s) => {
        if (st.done) return;
        if (!st.run) { st.run = true; Snd.sfx('ding'); }
        const alt = st.last !== s; st.last = s;
        st.va += (s === 'l' ? -1 : 1) * (alt ? 0.5 : 1.0) * (1 + (wob - 1) * 0.3 * Math.random());
        st.v = Math.min(22, st.v + (alt ? 3.4 : 1.8)); st.pedal += 1;
        Snd.tone(alt ? 520 : 440, 0.03, 'triangle', 0.03);
        const b = api.o.querySelector(`[data-p="${s}"]`); b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 80);
      };
      api.o.querySelectorAll('[data-p]').forEach((b) => MSU.tap(b, () => pedal(b.dataset.p)));
      MSU.tap(api.cv, (e) => { const [x] = MSU.pos(api, e, W, H); pedal(x < W / 2 ? 'l' : 'r'); });
      Mini.key = (k) => { if (MSU.LEFT.includes(k)) pedal('l'); if (MSU.RIGHT.includes(k)) pedal('r'); };
      Mini._pedalo = { st, pedal, BUOYS }; /* für Tests */
      const done = (ok) => {
        st.done = true; st.end = 0; const time = Math.round(st.t * 10) / 10;
        st.res = { time, ok };
        if (ok) { const nb = MSU.rec('pedalo', time, true); Snd.sfx('win'); info.textContent = `Ziel! ${MSU.sec(time)}${nb ? ' – Rekord!' : ''}`; }
        else { Snd.sfx('lose'); info.textContent = 'Zu langsam – der Bootsvermieter winkt dich zurück.'; }
      };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        if (st.run && !st.done) st.t += dt;
        if (st.msgT > 0) st.msgT -= dt; if (st.bump > 0) st.bump -= dt;
        /* Bewegung: Drehimpuls klingt ab, Fahrt bremst im Wasser */
        st.a += st.va * dt; st.va *= Math.pow(0.04, dt); st.v *= Math.pow(0.55, dt);
        st.x += Math.sin(st.a) * st.v * dt; st.y -= Math.cos(st.a) * st.v * dt;
        st.x = clamp(st.x, 8, W - 8); st.y = clamp(st.y, 8, 106);
        const dx = (st.x - IX) / (IRX + 5), dy = (st.y - IY) / (IRY + 5), d = Math.hypot(dx, dy);
        if (d < 1) { st.x = IX + dx / d * (IRX + 5); st.y = IY + dy / d * (IRY + 5); st.v *= 0.4; if (st.bump <= 0) { st.bump = 0.5; Snd.sfx('hit'); st.msg = 'RUMMS!'; st.msgT = 0.6; } }
        if (st.v > 3 && Math.random() < dt * 14) st.wake.push({ x: st.x - Math.sin(st.a) * 7, y: st.y + Math.cos(st.a) * 7, t: 0 });
        for (const w of st.wake) w.t += dt; st.wake = st.wake.filter((w) => w.t < 1.4);
        if (!st.done && st.run) {
          if (st.next < 4) { const [bx, by] = BUOYS[st.next]; if (Math.hypot(st.x - bx, st.y - by) < 13) { st.next++; Snd.sfx('coin'); st.msg = st.next < 4 ? `BOJE ${st.next}` : 'ZURÜCK ZUM STEG!'; st.msgT = 0.9; } }
          else if (st.y > 94 && Math.abs(st.x - 80) < 22) done(st.t <= LIMIT);
          if (!st.done && st.t > LIMIT + 25) done(false);
        }
        if (st.done) { st.end += dt; if (st.end > 1.8) { api.finish(st.res); return; } }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        MSU.waterTop(c, 0, 0, W, H, 0, st.t, night);
        /* Ufer unten: Quai mit Steg, Bootsvermietung */
        R(c, 0, 108, W, 12, '#8a8478'); R(c, 0, 107, W, 2, '#b8b0a0'); for (let x = 0; x < W; x += 8) R(c, x, 112, 7, 3, '#9a9486');
        R(c, 68, 96, 24, 12, '#8a6a44'); for (let x = 68; x < 92; x += 3) R(c, x, 96, 1, 12, '#6a4a2a'); R(c, 68, 96, 24, 1, '#b08a5a');
        R(c, 8, 110, 22, 10, '#c8302a'); R(c, 8, 110, 22, 2, '#e8e0d0'); pxText(c, 'BOOTE', 10, 114, '#ffffff');
        for (let i = 0; i < 3; i++) { R(c, 104 + i * 14, 100, 10, 7, '#f4f0e6'); R(c, 104 + i * 14, 100, 1, 7, '#2f7fb8'); R(c, 113 + i * 14, 100, 1, 7, '#2f7fb8'); }
        /* Schilf links oben (Zellmoos) */
        for (let i = 0; i < 30; i++) { const x = hash(i, 4) * 12, y = hash(i, 5) * 40; line(c, x, y, x + 1, y - 4, night ? '#4a4a30' : '#a08a4a'); }
        MSU.isleTop(c, IX, IY, IRX, IRY, night);
        if (st.next < 4) { const [bx, by] = BUOYS[st.next]; c.strokeStyle = `rgba(255,210,60,${0.4 + Math.sin(st.t * 6) * 0.3})`; c.beginPath(); c.arc(bx, by, 9, 0, 6.29); c.stroke(); }
        BUOYS.forEach(([bx, by], i) => { const ok = i < st.next; E(c, bx, by + 1, 4, 2, 'rgba(0,0,0,0.25)'); E(c, bx, by, 3, 3, ok ? '#3fae4a' : '#e8602a'); R(c, bx - 1, by - 4, 3, 3, ok ? '#7af0a0' : '#ffd23d'); pxText(c, String(i + 1), bx + 5, by - 3, '#ffffff'); });
        for (const w of st.wake) { const a = Math.max(0, 0.5 - w.t * 0.35); E(c, w.x, w.y, 1 + w.t * 4, 1 + w.t * 2, `rgba(230,245,245,${a})`); }
        /* Pedalo von oben */
        c.save(); c.translate(Math.round(st.x), Math.round(st.y)); c.rotate(st.a);
        R(c, -7, -8, 3, 16, '#2f7fb8'); R(c, 4, -8, 3, 16, '#2f7fb8'); R(c, -7, -9, 3, 2, '#5a9fd8'); R(c, 4, -9, 3, 2, '#5a9fd8');
        R(c, -4, -6, 8, 12, '#f4f0e6'); R(c, -4, 3, 8, 3, '#e8c23a'); const ph = Math.floor(st.pedal) % 2; R(c, -2, 6 + ph, 4, 2, '#3a3c40');
        E(c, -2, 0, 2, 2, top); E(c, 2, 0, 2, 2, '#c8302a'); E(c, -2, -1, 1.5, 1.5, hair); E(c, 2, -1, 1.5, 1.5, '#5a3a24'); P(c, -2, -3, skin);
        c.restore();
        /* Pfeil zur nächsten Boje */
        if (!st.done && st.run) { const [gx, gy] = st.next < 4 ? BUOYS[st.next] : [80, 100]; const ang = Math.atan2(gy - st.y, gx - st.x); if (Math.hypot(gx - st.x, gy - st.y) > 22) for (let k = 0; k < 3; k++) P(c, st.x + Math.cos(ang) * (13 + k * 2), st.y + Math.sin(ang) * (13 + k * 2), '#ffd23d'); }
        if (!st.run) MSU.ctr(c, 'LOS GEHTS', 80, 70, '#ffd23d', 2);
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, 6, '#ffd23d');
        if (st.done) MSU.ctr(c, st.res.ok ? 'ZIEL!' : 'ZU LANGSAM', 80, 70, st.res.ok ? '#7af0a0' : '#ff6a5a', 2);
        tEl.textContent = `${MSU.sec(st.t)} · Boje ${Math.min(4, st.next)}/4`;
      };
    });
  },

  /* ---------- Elektroboot-Slalom durch die Bojentore im Triechter ---------- */
  motorboat() { return this._lakeRun('slalom'); },
  /* ---------- Bootsjagd: dem flüchtenden Boot bis zum Gamma-Inseli folgen (o.friend = Name des Kollegen am Steuer) ---------- */
  bootsjagd(o = {}) { return this._lakeRun('chase', o); },
  /* gemeinsamer See-Scroller von oben: Boot fährt nach oben, Ufer des Triechters links (Zellmoos) und rechts (Schenkon) */
  _lakeRun(mode, o = {}) {
    const chase = mode === 'chase', W = 160, H = 120, BY = 92, LEN = chase ? 2450 : 1750, LIMIT = 36, BASE = 62;
    const night = isNight(), wob = Mini.wob(), hair = lc(G.S.look, 'hairCol'), top = lc(G.S.look, 'topCol');
    const friend = o.friend || 'Kollege';
    const shore = (y) => { const u = clamp(y / 1100, 0, 1), w = lerp(84, 150, u * u * (3 - 2 * u)) + Math.sin(y * 0.011) * 6, cx = 80 + Math.sin(y * 0.0035 + 1) * 8 * u; return [cx - w / 2, cx + w / 2]; };
    const r = rng((Math.random() * 1e9) | 0);
    const gates = [], obs = [];
    if (!chase) for (let i = 0, y = 230; y < LEN - 120; i++, y += 128) { const [l, rr] = shore(y), cx = clamp((l + rr) / 2 + (i % 2 ? 22 : -22) + (r() - 0.5) * 10, l + 24, rr - 24); gates.push({ y, x: cx, w: 34, done: 0 }); }
    if (chase) for (let y = 260; y < LEN - 80; y += 95 + r() * 70) {
      const [l, rr] = shore(y), k = r(), x = l + 14 + r() * (rr - l - 28);
      if (k < 0.32) { obs.push({ k: 'schwan', x, y, vx: (r() - 0.5) * 8 }); if (r() < 0.6) obs.push({ k: 'schwan', x: x + 9, y: y + 6, vx: 0, kid: 1 }); }
      else if (k < 0.52) obs.push({ k: 'pedalo', x: r() < 0.5 ? l + 8 : rr - 8, y, vx: 0, dir: 0 });
      else if (k < 0.76) obs.push({ k: 'welle', x: clamp(x, l + 30, rr - 30), y, w: 54 });
      else obs.push({ k: 'boje', x, y });
    }
    for (const ob of obs) if (ob.k === 'pedalo') { ob.vx = ob.x < 80 ? 14 : -14; }
    const title = chase ? 'Bootsjagd' : 'Elektroboot-Slalom', sub = chase ? 'hinterher bis zum Gamma-Inseli' : 'Bojentore im Triechter';
    return this.run(title, sub, `<canvas aria-label="${title}"></canvas><div class="mini-bar"><span id="lInfo">${chase ? `${friend} gibt Gas, du steuerst. Bleib dran – weich Schwänen, Pedalos und Wellen aus!` : 'Steuern mit ◀ ▶ (halten). Durch jedes Tor fahren, Bojen nicht rammen!'}</span><b id="lT">0,0 s</b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-s="l">◀</button><button data-s="r">▶</button></div>`, W, H, (api) => {
      const st = { x: 80, vx: 0, py: 0, sp: 0, t: 0, cd: 1.6, pen: 0, hits: 0, miss: 0, clean: 0, inv: 0, done: false, end: 0, res: null, msg: '', msgT: 0, shake: 0, wake: [], ey: 48, ex: 80, warned: new Set() };
      const hold = MSU.hold(api, { l: MSU.LEFT, r: MSU.RIGHT });
      api.o.querySelectorAll('[data-s]').forEach((b) => MSU.holdEl(b, hold, 'b' + b.dataset.s));
      MSU.holdEl(api.cv, hold, 'cv', (e) => { hold.cx = MSU.pos(api, e, W, H)[0]; });
      api.cv.addEventListener('pointermove', (e) => { if (hold.cv) hold.cx = MSU.pos(api, e, W, H)[0]; });
      Mini.key = () => {};
      const info = api.o.querySelector('#lInfo'), tEl = api.o.querySelector('#lT');
      const say = (m, t = 0.9) => { st.msg = m; st.msgT = t; };
      Mini._lake = { st, gates, obs }; /* für Tests */
      const bump = (m, pen) => { if (st.inv > 0) return; st.inv = 0.9; st.hits++; st.pen += pen; st.sp = 26; st.clean = 0; st.shake = 0.5; say(m); Snd.sfx('hit'); if (chase) st.ey += 4; };
      const finish = (ok) => {
        st.done = true; st.end = 0;
        if (chase) { st.res = { ok, time: Math.round(st.t * 10) / 10, hits: st.hits }; info.textContent = ok ? 'Er legt am Gamma-Inseli an – du bist ihm auf den Fersen!' : 'Weg ist er … Das Boot verschwindet hinter dem Zellmoos.'; Snd.sfx(ok ? 'win' : 'lose'); }
        else {
          const time = Math.round((st.t + st.pen) * 10) / 10, okk = time <= LIMIT;
          st.res = { time, hits: st.hits, missed: st.miss, ok: okk };
          const nb = MSU.rec('boot', time, true);
          info.textContent = `${MSU.sec(time)} (davon ${st.pen} s Strafe)${nb ? ' – Rekord!' : ''}`; Snd.sfx(okk ? 'win' : 'lose');
        }
      };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        if (st.msgT > 0) st.msgT -= dt; if (st.inv > 0) st.inv -= dt; if (st.shake > 0) st.shake -= dt;
        if (st.cd > 0) { st.cd -= dt; if (st.cd <= 0) { Snd.sfx('ding'); say('LOS!', 0.7); } }
        const run = st.cd <= 0 && !st.done;
        if (run) {
          st.t += dt;
          let steer = (hold.l || hold.bl ? -1 : 0) + (hold.r || hold.br ? 1 : 0);
          if (hold.cv && hold.cx != null) steer = clamp((hold.cx - st.x) / 12, -1, 1);
          st.vx += steer * 300 * dt; st.vx *= Math.pow(0.012, dt); st.vx += Math.sin(st.t * 2.1) * (wob - 1) * 30 * dt;
          st.x += st.vx * dt;
          st.clean += dt;
          const target = chase && st.clean > 1.5 ? BASE + 9 : BASE;
          st.sp += clamp(target - st.sp, -40 * dt, 30 * dt);
          st.py += st.sp * dt;
          const [l, rr] = shore(st.py + 4);
          if (st.x < l + 6 || st.x > rr - 6) { st.x = clamp(st.x, l + 6, rr - 6); st.vx *= -0.3; if (st.inv <= 0) { st.sp *= 0.6; st.inv = 0.4; st.shake = 0.3; say('UFER!', 0.5); Snd.tone(120, 0.1, 'triangle', 0.08); } }
          for (const g of gates) {
            for (const bx of [g.x - g.w / 2, g.x + g.w / 2]) if (Math.abs(bx - st.x) < 6 && Math.abs(g.y - (st.py + 2)) < 7 && !g['h' + bx]) { g['h' + bx] = 1; bump('BOJE! +2 S', 2); }
            if (!g.done && st.py > g.y) { g.done = Math.abs(st.x - g.x) < g.w / 2 ? 1 : 2; if (g.done === 1) Snd.sfx('coin'); else { st.miss++; st.pen += 3; say('TOR VERPASST! +3 S'); Snd.sfx('error'); } }
          }
          for (const ob of obs) {
            if (ob.k === 'schwan') ob.x += Math.sin(st.t * 0.8 + ob.y) * 4 * dt + ob.vx * dt;
            if (ob.k === 'pedalo') { ob.x += ob.vx * dt; const [l2, r2] = shore(ob.y); if (ob.x < l2 + 8 || ob.x > r2 - 8) ob.vx *= -1; }
            const dy = ob.y - st.py, ahead = dy > 40 && dy < 95;
            const hw = ob.k === 'welle' ? ob.w / 2 : ob.k === 'pedalo' ? 8 : 5;
            if (ahead && Math.abs(ob.x - st.x) < hw + 12 && !st.warned.has(ob)) { st.warned.add(ob); say(friend.toUpperCase() + ': ' + { schwan: 'SCHWAN!', pedalo: 'PEDALO!', welle: 'WELLE!', boje: 'BOJE!' }[ob.k], 1); }
            if (!ob.hit && Math.abs(dy) < (ob.k === 'welle' ? 4 : 7) && Math.abs(ob.x - st.x) < hw + 3) {
              ob.hit = 1;
              if (ob.k === 'welle') { st.sp *= 0.7; st.shake = 0.6; st.clean = 0; say('PLATSCH!', 0.6); Snd.sfx('splash'); st.ey += 6; }
              else bump({ schwan: 'SCHWAN! ZISCH!', pedalo: 'SORRY!', boje: 'BOJE!' }[ob.k], 0);
            }
          }
          if (chase) {
            const es = BASE + Math.sin(st.t * 0.7) * 5 + (Math.sin(st.t * 0.23) > 0.8 ? 6 : 0);
            st.ey = Math.min(st.ey + es * dt, LEN + 70);
            const [l3, r3] = shore(st.ey); st.ex = clamp((l3 + r3) / 2 + Math.sin(st.t * 0.9) * (r3 - l3) * 0.28, l3 + 12, r3 - 12);
            if (st.ey - st.py > 200) finish(false);
            else if (st.py >= LEN) finish(true);
          } else if (st.py >= LEN) finish(true);
          if (st.sp > 20 && Math.random() < dt * 20) st.wake.push({ x: st.x, y: st.py - 8, t: 0 });
        }
        for (const w of st.wake) w.t += dt; st.wake = st.wake.filter((w) => w.t < 1.2);
        if (st.done) { st.end += dt; if (st.end > 2) { api.finish(st.res); return; } }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        c.save(); if (st.shake > 0) c.translate(Math.round(rnd(-1, 1) * 2), Math.round(rnd(-1, 1) * 2));
        const sy = (wy) => BY - (wy - st.py);
        MSU.waterTop(c, -4, -4, W + 8, H + 8, st.py, st.t, night);
        for (let ys = -4; ys < H + 4; ys += 2) {
          const wy = st.py + (BY - ys), [l, rr] = shore(wy);
          R(c, -4, ys, l + 4, 2, night ? '#2a3020' : '#6a6a3e'); R(c, l - 3, ys, 3, 2, night ? '#3a3a24' : '#a08a4a');
          R(c, rr, ys, W - rr + 4, 2, night ? '#24302a' : '#5e7448'); R(c, rr, ys, 2, 2, night ? '#5a5a4a' : '#c8bc98');
          if (hash(Math.floor(wy / 2), 1) < 0.3) P(c, l - 6 - hash(Math.floor(wy / 2), 2) * 10, ys, '#f2f4f2');
          if (hash(Math.floor(wy / 2), 3) < 0.3) P(c, rr + 4 + hash(Math.floor(wy / 2), 4) * 14, ys, '#f2f4f2');
          if (hash(Math.floor(wy / 2), 5) < 0.4) line(c, l - 1, ys, l - 2, ys - 3, night ? '#4a4a30' : '#b8a060');
        }
        /* Häuser von Schenkon am rechten Ufer, Bäume im Zellmoos */
        for (let k = Math.floor((st.py - 40) / 140); k < Math.floor((st.py + 160) / 140) + 1; k++) {
          const wy = k * 140 + 40, ys = sy(wy), [l, rr] = shore(wy);
          R(c, rr + 10, ys - 6, 12, 10, ['#e8d8c0', '#d8c0b0', '#f0e6d0'][((k % 3) + 3) % 3]); R(c, rr + 9, ys - 8, 14, 4, '#8a3b2a'); R(c, rr + 9, ys - 8, 14, 1, '#f4f6f4'); if (night) P(c, rr + 14, ys - 2, '#ffd27a');
          E(c, l - 14, ys + 30, 6, 5, night ? '#1a2418' : '#3f4a2a'); P(c, l - 15, ys + 27, '#f4f6f4');
        }
        /* Start am Quai */
        if (sy(0) < H + 10) { const ys = sy(0); R(c, 0, ys, W, 30, '#8a8478'); R(c, 0, ys, W, 2, '#b8b0a0'); R(c, 60, ys - 12, 8, 12, '#8a6a44'); R(c, 92, ys - 12, 8, 12, '#8a6a44'); pxText(c, 'QUAI', 70, ys + 6, '#f4f0e6'); }
        /* Ziel */
        if (!chase) { const ys = sy(LEN); if (ys > -10 && ys < H + 10) { const [l, rr] = shore(LEN); for (let x = l; x < rr; x += 4) R(c, x, ys, 2, 2, Math.floor(x / 4) % 2 ? '#f4f0e6' : '#c8302a'); MSU.ctr(c, 'ZIEL', 80, ys - 9, '#ffffff'); } }
        else { const ys = sy(LEN + 90); if (ys > -30) MSU.isleTop(c, 80, ys, 20, 13, night); }
        for (const g of gates) {
          const ys = sy(g.y); if (ys < -8 || ys > H + 8) continue;
          if (!g.done) for (let x = g.x - g.w / 2 + 4; x < g.x + g.w / 2 - 3; x += 3) P(c, x, ys, 'rgba(255,255,255,0.35)');
          for (const [bx, col] of [[g.x - g.w / 2, '#e2302a'], [g.x + g.w / 2, '#ffd23d']]) { E(c, bx, ys + 1, 4, 2, 'rgba(0,0,0,0.3)'); E(c, bx, ys, 3, 3, g['h' + bx] ? '#7a7a7a' : col); P(c, bx - 1, ys - 1, '#ffffff'); }
          if (g.done === 1) pxText(c, '+', g.x - 1, ys - 2, '#7af0a0');
        }
        for (const ob of obs) {
          const ys = sy(ob.y); if (ys < -14 || ys > H + 14) continue;
          if (ob.k === 'schwan') { const s = ob.kid ? 0.7 : 1, cg = ob.kid ? '#a8a49a' : '#f6f6f2'; E(c, ob.x, ys + 1, 4 * s, 3 * s, 'rgba(0,0,0,0.2)'); E(c, ob.x, ys, 4 * s, 3 * s, cg); R(c, ob.x - 1, ys - 6 * s, 2, 5 * s, cg); R(c, ob.x - 1, ys - 7 * s, 2, 2, ob.kid ? '#5a5a5a' : '#e8802a'); P(c, ob.x - 1, ys - 6 * s, '#101010'); }
          if (ob.k === 'pedalo') { R(c, ob.x - 7, ys - 5, 14, 3, '#2f7fb8'); R(c, ob.x - 7, ys + 3, 14, 3, '#2f7fb8'); R(c, ob.x - 5, ys - 3, 10, 6, '#f4f0e6'); E(c, ob.x - 2, ys, 1.5, 1.5, '#5a3a24'); E(c, ob.x + 2, ys, 1.5, 1.5, '#e8c23a'); }
          if (ob.k === 'welle') for (let k = 0; k < 3; k++) for (let x = ob.x - ob.w / 2; x < ob.x + ob.w / 2; x += 2) P(c, x, ys - k * 3 + Math.sin(x * 0.5 + st.t * 4 + k) * 1, k ? 'rgba(220,240,240,0.5)' : '#e8f4f4');
          if (ob.k === 'boje') { E(c, ob.x, ys, 3, 3, '#ffd23d'); R(c, ob.x - 1, ys - 4, 2, 3, '#e2302a'); }
        }
        for (const w of st.wake) { const ys = sy(w.y), a = Math.max(0, 0.6 - w.t * 0.5); P(c, w.x - 3 - w.t * 9, ys, `rgba(235,248,248,${a})`); P(c, w.x + 3 + w.t * 9, ys, `rgba(235,248,248,${a})`); }
        /* Boote */
        const boatTop = (x, ys, hull, stripe, heads) => {
          c.fillStyle = 'rgba(0,0,0,0.25)'; c.beginPath(); c.moveTo(x + 1, ys - 8); c.lineTo(x + 6, ys - 1); c.lineTo(x + 6, ys + 9); c.lineTo(x - 4, ys + 9); c.lineTo(x - 4, ys - 1); c.closePath(); c.fill();
          c.fillStyle = hull; c.beginPath(); c.moveTo(x, ys - 9); c.lineTo(x + 5, ys - 2); c.lineTo(x + 5, ys + 8); c.lineTo(x - 5, ys + 8); c.lineTo(x - 5, ys - 2); c.closePath(); c.fill();
          R(c, x - 5, ys + 1, 1, 7, stripe); R(c, x + 5, ys + 1, 1, 7, stripe); R(c, x - 3, ys - 3, 7, 1, '#7ab0d0'); R(c, x - 2, ys + 8, 4, 2, '#3a3c40');
          heads.forEach(([hx, hy, hc, bc]) => { E(c, x + hx, ys + hy + 1, 2, 1.5, bc); E(c, x + hx, ys + hy, 1.5, 1.5, hc); });
        };
        if (chase) {
          const eys = sy(st.ey);
          if (eys > -6) boatTop(st.ex, eys, '#5a2a2a', '#ffd23d', [[0, 2, '#1a1a22', '#c8302a']]);
          else { MSU.ctr(c, 'HOCH', clamp(st.ex, 12, 148), 3, '#ff6a5a'); }
        }
        if (st.inv <= 0 || Math.floor(st.t * 12) % 2) boatTop(st.x, BY, '#f4f0e6', '#2f7fb8', chase ? [[-2, 1, hair, top], [2, 4, '#5a3a24', '#2f5fb8']] : [[0, 2, hair, top]]);
        c.restore();
        /* Anzeigen */
        if (chase) {
          const gap = Math.max(0, st.ey - st.py), q = clamp(1 - (gap - 25) / 175, 0, 1);
          R(c, 30, 112, 100, 6, '#10161f'); R(c, 31, 113, Math.round(q * 98), 4, q > 0.45 ? '#7af0a0' : q > 0.2 ? '#ffb53d' : '#ff6a5a'); MSU.txt(c, 'DRANBLEIBEN', 31, 105, '#f4f0e6');
          R(c, 150, 20, 4, 80, '#10161f'); R(c, 151, 21 + Math.round(78 * (1 - clamp(st.py / LEN, 0, 1))), 2, 2, '#ffd23d'); R(c, 149, 18, 6, 2, '#7af0a0');
        }
        if (st.cd > 0) MSU.ctr(c, String(Math.ceil(st.cd / 0.55)), 80, 40, '#ffd23d', 3);
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, chase ? 20 : 8, '#ffd23d');
        if (st.done) MSU.ctr(c, chase ? (st.res.ok ? 'GAMMA-INSELI!' : 'ENTKOMMEN') : st.res.ok ? 'ZIEL!' : 'ZU LANGSAM', 80, 46, (st.res.ok ? '#7af0a0' : '#ff6a5a'), 2);
        tEl.textContent = chase ? `${MSU.sec(st.t)} · ${st.hits} Rempler` : `${MSU.sec(st.t + st.pen)} · ${st.hits} Bojen`;
      };
    });
  },

  /* ---------- Stand-up-Paddle: Gleichgewicht halten, während Wellen von Booten kommen ---------- */
  sup() {
    const W = 160, H = 112, DUR = 30, night = isNight(), wob = Mini.wob(), sheet = MSU.me();
    return this.run('Stand-up-Paddle', 'auf dem Sempachersee', `<canvas aria-label="Stand-up-Paddle"></canvas><div class="mini-bar"><span id="uInfo">Kippt das Brett nach rechts, paddle links – und umgekehrt. 30 Sekunden oben bleiben!</span><b id="uT">30 s</b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-u="l">◀ Links paddeln</button><button data-u="r">Rechts paddeln ▶</button></div>`, W, H, (api) => {
      const st = { a: 0, av: 0, t: 0, dist: 0, v: 0.6, side: 'r', stroke: 0, wave: null, nextWave: rnd(3.5, 5), boat: null, fell: 0, done: false, end: 0, res: null, msg: '', msgT: 0, splash: [] };
      const info = api.o.querySelector('#uInfo'), tEl = api.o.querySelector('#uT');
      const paddle = (s) => {
        if (st.done) return;
        st.av += (s === 'l' ? -0.5 : 0.5); st.v = Math.min(2.4, st.v + 0.32); st.side = s; st.stroke = 0.35;
        Snd.noise(0.12, 0.05, 700, 0, 'bandpass');
        const b = api.o.querySelector(`[data-u="${s}"]`); b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 80);
      };
      api.o.querySelectorAll('[data-u]').forEach((b) => MSU.tap(b, () => paddle(b.dataset.u)));
      MSU.tap(api.cv, (e) => paddle(MSU.pos(api, e, W, H)[0] < W / 2 ? 'l' : 'r'));
      Mini.key = (k) => { if (MSU.LEFT.includes(k)) paddle('l'); if (MSU.RIGHT.includes(k)) paddle('r'); };
      Mini._sup = { st, paddle }; /* für Tests */
      const end = (ok) => { st.done = true; st.end = 0; st.res = { ok, dist: Math.round(st.dist * 10) / 10, time: Math.round(st.t * 10) / 10 }; if (ok) { Snd.sfx('win'); info.textContent = `Trocken geblieben! ${st.res.dist} m gepaddelt.`; } else { Snd.sfx('splash'); info.textContent = 'PLATSCH! Das Wasser hat etwa 6 Grad …'; } };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        if (st.msgT > 0) st.msgT -= dt; if (st.stroke > 0) st.stroke -= dt;
        if (!st.done) {
          st.t += dt;
          /* Boot fährt draussen vorbei, kurz danach kommt seine Welle */
          st.nextWave -= dt;
          if (st.nextWave <= 0 && !st.boat) { st.boat = { x: -20, dir: Math.random() < 0.5 ? -1 : 1, t: 0 }; st.nextWave = rnd(5.5, 7.5); }
          if (st.boat) { st.boat.t += dt; st.boat.x += 70 * dt; if (st.boat.t > 1.6 && !st.wave) { st.wave = { t: 0, A: rnd(1.3, 2) * st.boat.dir }; st.msg = 'WELLE!'; st.msgT = 0.9; Snd.sfx('whoosh'); } if (st.boat.x > W + 30) st.boat = null; }
          let dist = Math.sin(st.t * 1.3) * 0.22 + Math.sin(st.t * 3.1 + 1) * 0.2 * (wob - 1) * 2;
          if (st.wave) { st.wave.t += dt; const u = st.wave.t; dist += st.wave.A * Math.sin(u * 7) * Math.exp(-u * 1.2); if (u > 3) st.wave = null; }
          st.av += (st.a * 1.25 + dist) * dt; st.av *= Math.pow(0.3, dt); st.a += st.av * dt;
          st.v *= Math.pow(0.7, dt); st.dist += st.v * dt;
          if (Math.abs(st.a) >= 1) { st.fell = Math.sign(st.a); end(false); for (let k = 0; k < 24; k++) st.splash.push({ x: 80 + st.fell * 14, y: 74, vx: rnd(-40, 40), vy: rnd(-70, -20), t: 0 }); }
          else if (st.t >= DUR) end(true);
        } else { st.end += dt; if (st.end > 2.2) { api.finish(st.res); return; } }
        for (const s of st.splash) { s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 160 * dt; } st.splash = st.splash.filter((s) => s.t < 1);
        /* ---- Zeichnen: Blick von hinten über das Brett auf den See ---- */
        const c = api.ctx, HY = 40;
        MSU.sky(c, W, HY, night, 7); MSU.hills(c, W, HY, night, 120 + st.dist * 0.5);
        MSU.water(c, W, HY, H, st.t + st.dist * 2, night);
        MSU.isle(c, 40 - st.dist * 0.15, HY + 2, 0.5 + st.dist * 0.004, night);
        if (st.boat) { const bx = st.boat.x, by = HY + 4; R(c, bx - 6, by - 2, 12, 3, '#f4f0e6'); R(c, bx - 2, by - 4, 4, 2, '#2f5fb8'); for (let k = 1; k < 5; k++) P(c, bx - 6 - k * 3, by + (k % 2), 'rgba(255,255,255,0.6)'); }
        if (st.wave) { const yy = HY + 6 + st.wave.t * 26; if (yy < 90) for (let x = 0; x < W; x += 2) P(c, x, yy + Math.sin(x * 0.2 + st.t * 5) * 1.2, 'rgba(230,248,248,0.75)'); }
        /* Bojen, die vorbeiziehen */
        for (let k = 0; k < 3; k++) { const z = ((k * 37 + st.dist * 6) % 110) / 110, bx = 80 + (k % 2 ? 1 : -1) * (12 + z * 70), by = HY + 4 + z * 60; E(c, bx, by, 1 + z * 3, 1 + z * 3, '#e8602a'); }
        /* Brett und Figur, gekippt um die Brettachse */
        const ang = st.done && st.fell ? st.fell * Math.min(1.5, 0.5 + st.end * 2) : st.a * 0.5;
        const px = 80, py = 92;
        c.save(); c.translate(px, py); c.rotate(ang * 0.6);
        c.fillStyle = '#e8e4d8'; c.beginPath(); c.moveTo(-9, 8); c.lineTo(9, 8); c.lineTo(5, -14); c.lineTo(-5, -14); c.closePath(); c.fill();
        R(c, -9, 7, 18, 2, '#2f9fb8'); R(c, -1, -12, 2, 18, '#2f9fb8'); R(c, -6, -2, 12, 4, '#c8c4b8');
        c.restore();
        if (!(st.done && st.fell && st.end > 0.4)) {
          c.save(); c.translate(px, py); c.rotate(ang);
          MSU.spr(c, sheet, 'stand', 3, -SPR_W, -SPR_H * 2 + 2, 2);
          const sd = st.side === 'l' ? -1 : 1, dip = st.stroke > 0 ? st.stroke * 30 : 0;
          line(c, sd * 10, -34, sd * (16 + dip * 0.2), 2 - dip * 0.1, '#3a3c40'); R(c, sd * (16 + dip * 0.2) - 2, -1 - dip * 0.1, 4, 6, '#e8602a');
          c.restore();
        }
        for (const s of st.splash) R(c, s.x, s.y, 2, 2, `rgba(230,248,255,${1 - s.t})`);
        if (st.stroke > 0.2) E(c, px + (st.side === 'l' ? -18 : 18), 96, 4, 1, 'rgba(255,255,255,0.6)');
        /* Gleichgewichtsanzeige */
        const gx = 80, gy = 26;
        for (let k = -30; k <= 30; k++) { const a2 = k / 30, x = gx + Math.sin(a2 * 1.1) * 26, y = gy - Math.cos(a2 * 1.1) * 18; R(c, x, y, 2, 2, Math.abs(a2) < 0.35 ? '#3fae4a' : Math.abs(a2) < 0.7 ? '#ffb53d' : '#e2302a'); }
        const na = clamp(st.a, -1, 1) * 1.1; line(c, gx, gy, gx + Math.sin(na) * 20, gy - Math.cos(na) * 14, '#ffffff'); E(c, gx, gy, 2, 2, '#ffffff');
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, 32, '#ffd23d', 2);
        if (st.done) MSU.ctr(c, st.res.ok ? 'TROCKEN!' : 'PLATSCH!', 80, 50, st.res.ok ? '#7af0a0' : '#7ad0f0', 2);
        tEl.textContent = `${Math.max(0, Math.ceil(DUR - st.t))} s · ${st.dist.toFixed(0)} m`;
      };
    });
  },

  /* ---------- Sprungturm im Strandbad: Anlauf, Absprung, Figur in der Luft, Eintauchen – mit Haltungsnoten ---------- */
  sprung(h = 3) {
    h = clamp(Math.round(+h || 3), 1, 5);
    const W = 160, H = 128, WY = 112, MPX = 16, night = isNight(), wob = Mini.wob(), sheet = MSU.me();
    const BOARDS = [...new Set([1, 3, 5, h])].sort();
    const FIG = { koepfler: { n: 'Köpfler', rot: Math.PI, dd: 1.2 }, arschbombe: { n: 'Arschbombe', rot: 0, dd: 1.0 }, salto: { n: 'Salto', rot: Math.PI * 2, dd: 1.6 }, fuss: { n: 'Fuss voran', rot: 0, dd: 0.8 } };
    const by = (hh) => WY - hh * MPX - 2, TX = 34;
    return this.run('Sprungturm', `Strandbad Sursee · ${h}-Meter-Brett`, `<canvas aria-label="Sprungturm"></canvas><div class="mini-bar"><span id="jInfo">Tippen: Anlauf. Am Brettende nochmal tippen: Absprung!</span><b id="jS">–</b></div><div class="lanes" style="grid-template-columns:1fr 1fr 1fr"><button data-f="koepfler">◀ Köpfler</button><button data-f="arschbombe">▼ Arschbombe</button><button data-f="salto">Salto ▶</button></div><button class="btn primary" id="jGo" style="height:52px">Anlauf</button>`, W, H, (api) => {
      const st = { phase: 'ready', t: 0, pt: 0, u: 0, x: TX + 2, y: by(h), vx: 0, vy: 0, rot: 0, fig: null, figT: 0, tq: 0, T: 1, slow: 0.5, tuck: 0, splash: [], res: null, msg: '', msgT: 0, crowd: 0, entry: null };
      const info = api.o.querySelector('#jInfo'), sEl = api.o.querySelector('#jS'), go = api.o.querySelector('#jGo');
      const say = (m, t = 0.9) => { st.msg = m; st.msgT = t; };
      const tip = TX + 26;
      const jump = () => {
        st.tq = clamp(1 - Math.abs(st.u - 0.9) / 0.2, 0, 1);
        if (st.u < 0.6) st.tq *= 0.4;
        const v0 = (2.6 + 1.6 * st.tq) * MPX;
        st.vx = (1.0 + st.tq * 0.6) * MPX; st.vy = -v0; st.vy0 = st.vy;
        const g = 9.81 * MPX, d = WY - 4 - st.y;
        st.T = (st.vy * -1 + Math.sqrt(st.vy * st.vy + 2 * g * d)) / g; /* Flugzeit in echten Sekunden */
        st.phase = 'flight'; st.pt = 0; Snd.sfx('whoosh'); say(st.tq > 0.8 ? 'TOP ABSPRUNG!' : st.tq > 0.45 ? 'GUTER ABSPRUNG' : 'WACKLIG');
        go.textContent = '…'; info.textContent = 'Jetzt die Figur wählen – im grünen Bereich starten!';
      };
      const act = () => {
        if (st.phase === 'ready') { st.phase = 'run'; st.pt = 0; Snd.sfx('ding'); go.textContent = 'Absprung!'; info.textContent = 'Am Brettende abspringen!'; }
        else if (st.phase === 'run') jump();
        else if (st.phase === 'result' && st.pt > 0.6) api.finish(st.res);
      };
      const figure = (f) => {
        if (st.phase !== 'flight' || st.fig) return;
        st.fig = f; st.figT = st.pt; st.figF = st.pt / st.T;
        st.omega = FIG[f].rot ? FIG[f].rot / (st.T * 0.6) : 0;
        Snd.sfx('blip'); say(FIG[f].n.toUpperCase() + '!', 0.7);
        const b = api.o.querySelector(`[data-f="${f}"]`); if (b) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 200); }
      };
      go.addEventListener('pointerdown', (e) => { e.preventDefault(); act(); });
      api.o.querySelectorAll('[data-f]').forEach((b) => MSU.tap(b, () => (st.phase === 'flight' ? figure(b.dataset.f) : act())));
      MSU.tap(api.cv, () => act());
      Mini.key = (k) => { if (MSU.ACT.includes(k)) act(); if (MSU.LEFT.includes(k)) figure('koepfler'); if (MSU.DOWN.includes(k)) figure('arschbombe'); if (MSU.RIGHT.includes(k) || MSU.UP.includes(k)) figure('salto'); };
      Mini._sprung = { st, act, figure }; /* für Tests */
      const enter = () => {
        const f = st.fig || 'fuss', F = FIG[f];
        let qe, splash, flop = false;
        if (f === 'arschbombe') { const tuckQ = clamp((st.pt - st.figT) / 0.3, 0, 1); qe = tuckQ * 0.9 + 0.1; splash = Math.round(clamp(30 + h * 11 * tuckQ + st.tq * 12 + rnd(-5, 5), 5, 100)); }
        else if (f === 'fuss') { qe = 0.75; splash = Math.round(18 + h * 3); }
        else {
          const err = Math.abs(st.rot - F.rot), e = Math.abs(((err + Math.PI) % (Math.PI * 2)) - Math.PI);
          qe = clamp(1 - e / (Math.PI * 0.62), 0, 1); flop = e > Math.PI * 0.38 && e < Math.PI * 0.62;
          splash = Math.round(clamp((1 - qe) * 80 + h * 4 + (flop ? 30 : 0), 4, 100));
        }
        const judges = []; for (let k = 0; k < 5; k++) { const base = f === 'arschbombe' ? 2.5 + st.tq * 1.5 + splash / 100 * 6 : 2.2 + st.tq * 2 + qe * 5.6 - (flop ? 3 : 0); judges.push(clamp(Math.round((base + rnd(-0.5, 0.5)) * 2) / 2, 0, 10)); }
        const sorted = judges.slice().sort((a, b) => a - b), style = sorted[1] + sorted[2] + sorted[3];
        const score = Math.round(style * F.dd * (1 + (h - 1) * 0.1) * 10) / 10;
        st.res = { score, figure: f, splash, judges, klatscher: flop, h };
        st.entry = { f, flop, qe };
        for (let k = 0; k < 10 + splash / 2; k++) st.splash.push({ x: st.x + rnd(-3, 3), y: WY, vx: rnd(-1, 1) * (12 + splash * 0.6), vy: -rnd(20, 40 + splash * 1.6), t: 0 });
        Snd.sfx('splash'); if (flop) { say('KLATSCH!', 1.4); Snd.tone(90, 0.2, 'square', 0.1); } else if (f === 'arschbombe' && splash > 70) say('MEGA-BOMBE!', 1.4); else if (qe > 0.8) say('SAUBER!', 1.2);
        st.crowd = 2.5; if (!flop) Snd.sfx('cheer');
        st.phase = 'splash'; st.pt = 0; go.textContent = 'Wertung';
        const nb = MSU.rec('sprung', score);
        info.textContent = `${FIG[f].n}${flop ? ' – Bauchklatscher!' : ''} · Spritzer ${splash}${nb ? ' · Rekord!' : ''}`;
      };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; st.pt += dt; if (st.msgT > 0) st.msgT -= dt; if (st.crowd > 0) st.crowd -= dt;
        if (st.phase === 'run') {
          st.u = Math.min(1.1, st.pt / 1.15 * (0.9 + 0.1 * wob)); st.x = TX + 2 + st.u * 24;
          if (Math.floor(st.pt * 9) !== Math.floor((st.pt - dt) * 9)) Snd.sfx('step');
          if (st.u >= 1.1) { jump(); st.tq = 0; say('ABGERUTSCHT!'); }
        } else if (st.phase === 'flight') {
          const sdt = dt * st.slow; st.pt -= dt; st.pt += sdt;
          st.vy += 9.81 * MPX * sdt; st.x += st.vx * sdt; st.y += st.vy * sdt;
          if (st.fig && st.omega) st.rot += st.omega * sdt;
          if (st.fig === 'arschbombe') st.tuck = Math.min(1, st.tuck + sdt / 0.3);
          if (st.y >= WY - 4) enter();
        } else if (st.phase === 'splash') { if (st.pt > 1.8) { st.phase = 'result'; st.pt = 0; go.textContent = 'Fertig'; Snd.sfx(st.res.score > 40 ? 'win' : 'ok'); } }
        else if (st.phase === 'result' && st.pt > 6) { api.finish(st.res); return; }
        for (const s of st.splash) { s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 140 * dt; } st.splash = st.splash.filter((s) => s.y < WY + 2 && s.t < 2);
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        MSU.sky(c, W, 62, night, 12); MSU.hills(c, W, 62, night, 10);
        MSU.water(c, W, 62, H, st.t, night);
        MSU.isle(c, 138, 64, 0.5, night);
        /* Liegewiese mit Schnee, Badihäuschen */
        R(c, 0, 58, 30, 6, night ? '#2a3424' : '#7a8a5a'); for (let x = 0; x < 30; x += 2) P(c, x, 58, '#f2f4f2'); R(c, 2, 50, 18, 9, '#c8a070'); R(c, 1, 48, 20, 3, '#8a3b2a'); R(c, 8, 54, 4, 5, '#5a3a24');
        /* Becken-Abtrennung und Zuschauer auf dem Steg */
        R(c, 0, WY + 6, W, 2, '#c8302a'); for (let x = 0; x < W; x += 6) E(c, x + 3, WY + 7, 2, 2, x % 12 ? '#f4f0e6' : '#c8302a');
        R(c, 96, 72, 64, 4, '#8a6a44'); for (let x = 98; x < 160; x += 12) R(c, x, 76, 2, 36, '#5a4a34');
        for (let k = 0; k < 6; k++) { const x = 100 + k * 10, j = st.crowd > 0 ? Math.abs(Math.sin(st.t * 10 + k)) * 3 : 0; R(c, x, 64 - j, 5, 8, ['#c8302a', '#2f5fb8', '#e8c23a', '#3f8e4b', '#e8e0d0', '#7a2f8a'][k]); E(c, x + 2, 61 - j, 2, 2, ['#f2d0b0', '#c89a72', '#f2d0b0', '#8a5a3a', '#f2d0b0', '#e8b890'][k]); if (st.crowd > 0) { R(c, x - 1, 58 - j, 1, 4, '#f2d0b0'); R(c, x + 5, 58 - j, 1, 4, '#f2d0b0'); } }
        /* Sprungturm */
        R(c, TX - 6, by(5) - 4, 4, WY - by(5) + 8, '#9a9488'); R(c, TX - 2, by(5) - 4, 4, WY - by(5) + 8, '#b8b2a4'); for (let y = by(5); y < WY; y += 4) R(c, TX - 12, y, 6, 1, '#6a6a6a'); R(c, TX - 12, by(5) - 4, 1, WY - by(5) + 4, '#6a6a6a'); R(c, TX - 7, by(5) - 4, 1, WY - by(5) + 4, '#6a6a6a');
        for (const b of BOARDS) { const yy = by(b); R(c, TX, yy, 26, 3, b === h ? '#e8e0c8' : '#c8c0a8'); R(c, TX, yy + 3, 26, 1, '#5a5448'); R(c, TX, yy - 6, 1, 6, '#6a6a6a'); line(c, TX, yy - 6, TX + 6, yy - 6, '#6a6a6a'); pxText(c, b + 'M', TX - 22, yy - 2, '#f4f0e6'); }
        /* Höhenanzeige mit grünem Bereich für den Figurstart */
        if (st.phase === 'flight' || st.phase === 'run' || st.phase === 'ready') {
          R(c, 150, by(h) - 2, 5, WY - by(h) + 2, '#10161f');
          const yAt = (f) => { const tt = f * st.T, g = 9.81 * MPX, v0 = st.phase === 'flight' ? st.vy0 : -(3.6 * MPX); return clamp(by(h) + v0 * tt + 0.5 * g * tt * tt, by(h) - 30, WY); };
          if (st.phase === 'flight') { const ya = yAt(0.3), yb = yAt(0.5); R(c, 151, Math.min(ya, yb), 3, Math.max(2, Math.abs(yb - ya)), '#3fae4a'); R(c, 148, clamp(st.y, by(h) - 2, WY) - 1, 9, 2, '#ffffff'); }
        }
        /* Springer */
        const fig = st.fig, s = 1;
        if (st.phase === 'ready' || st.phase === 'run') MSU.spr(c, sheet, st.phase === 'run' ? (Math.floor(st.pt * 9) % 2 ? 'walkA' : 'walkB') : 'stand', 2, st.x - SPR_W / 2, by(h) - SPR_H + 1, s);
        else if (st.phase === 'flight') {
          c.save(); c.translate(Math.round(st.x), Math.round(st.y - 12)); c.rotate(st.rot);
          if (fig === 'arschbombe') { c.scale(1, 1 - st.tuck * 0.35); MSU.spr(c, sheet, st.tuck > 0.5 ? 'sit' : 'stand', 2, -SPR_W / 2, -SPR_H / 2, s); }
          else MSU.spr(c, sheet, 'stand', 2, -SPR_W / 2, -SPR_H / 2, s);
          c.restore();
        } else if (st.phase === 'splash' && st.pt < 0.25) { const e = st.entry; c.save(); c.translate(Math.round(st.x), WY - 4 + st.pt * 30); c.rotate(e.f === 'koepfler' || e.f === 'salto' ? st.rot : 0); MSU.spr(c, sheet, 'stand', 2, -SPR_W / 2, -SPR_H / 2, s); c.restore(); }
        else if (st.phase === 'splash' && st.pt > 1.1) { const hy = WY - 2 - Math.min(4, (st.pt - 1.1) * 10); MSU.head(c, sheet, st.x - SPR_W / 2, hy - 8, 1, 0); if (st.entry && st.entry.flop) { R(c, st.x - 4, hy - 1, 8, 1, '#ff6a6a'); } }
        R(c, 0, WY, W, 1, 'rgba(255,255,255,0.35)');
        for (const p of st.splash) R(c, p.x, p.y, 2, 2, `rgba(235,250,255,${clamp(1.6 - p.t, 0, 1)})`);
        if (st.msgT > 0) MSU.ctr(c, st.msg, 92, 18, '#ffd23d', 1);
        if (st.phase === 'result') {
          R(c, 14, 14, 132, 64, 'rgba(10,16,24,0.88)'); R(c, 14, 14, 132, 1, '#ffd23d');
          MSU.ctr(c, FIG[st.res.figure].n.toUpperCase() + (st.res.klatscher ? ' - KLATSCH' : ''), 80, 18, '#ffd23d');
          st.res.judges.forEach((j, i) => { const x = 22 + i * 24, sorted = st.res.judges.slice().sort((a, b) => a - b), out = j === sorted[0] && i === st.res.judges.indexOf(sorted[0]) || j === sorted[4] && i === st.res.judges.lastIndexOf(sorted[4]); R(c, x, 28, 20, 14, out ? '#3a3c40' : '#f4f0e6'); MSU.ctr(c, String(j).replace('.', ','), x + 10, 33, out ? '#8a8c90' : '#1a1a2e', 1, 'rgba(0,0,0,0)'); });
          MSU.ctr(c, `PUNKTE ${String(st.res.score).replace('.', ',')}`, 80, 50, '#7af0a0', 2);
          MSU.ctr(c, `SPRITZER ${st.res.splash}`, 80, 66, '#7ad0f0');
        }
        sEl.textContent = st.res ? `${String(st.res.score).replace('.', ',')} Punkte` : `${h} m`;
      };
    });
  },

  /* ---------- Velo: Zeitfahren Bahnhof → See oder Verfolgung durchs Städtli (drei Spuren, Klingel scheucht Leute weg) ---------- */
  velo(mode = 'zeit') {
    const chase = mode === 'chase', W = 160, H = 128, PY = 104, LX = [52, 80, 108], LEN = chase ? 3500 : 2300, LIMIT = 30;
    const night = isNight(), wob = Mini.wob(), top = lc(G.S.look, 'topCol'), hair = lc(G.S.look, 'hairCol'), pants = lc(G.S.look, 'pantsCol');
    const SECT = chase
      ? [[0, 'UNTERSTADT', 'sure'], [0.22, 'EHRET-PARK', 'park'], [0.36, 'BRÜCKE', 'bridge'], [0.4, 'EHRET-PARK', 'park'], [0.5, 'BECKENHOF', 'town'], [0.72, 'MÜNSTERVORSTADT', 'new'], [0.95, 'SEE', 'lake']]
      : [[0, 'BAHNHOF', 'station'], [0.14, 'BAHNHOFSTRASSE', 'town'], [0.38, 'UNTERTOR', 'gate'], [0.42, 'ALTSTADT', 'old'], [0.62, 'BECKENHOF', 'town'], [0.8, 'MÜNSTERVORSTADT', 'new'], [0.96, 'SEE', 'lake']];
    const sectAt = (wy) => { let s = SECT[0]; for (const x of SECT) if (wy >= x[0] * LEN) s = x; return s; };
    const POOL = { sure: ['enten', 'stand', 'fussg', 'stand'], park: ['enten', 'wagen', 'fussg'], bridge: [], town: chase ? ['wagen', 'poller', 'fussg', 'pauke'] : ['auto', 'poller', 'fussg'], new: ['wagen', 'pauke', 'poller', 'fussg'], station: ['koffer', 'fussg', 'poller'], gate: [], old: ['stand', 'tauben', 'fussg', 'pauke'], lake: [] };
    const MOVE = { fussg: 1, enten: 1, wagen: 1, tauben: 1 };
    const r = rng((Math.random() * 1e9) | 0), obs = [];
    for (let y = 200; y < LEN - 160; y += 70 + r() * 50) {
      const pool = POOL[sectAt(y)[2]]; if (!pool.length) continue;
      const free = Math.floor(r() * 3), n = r() < 0.3 ? 2 : 1, lanes = [0, 1, 2].filter((l) => l !== free).sort(() => r() - 0.5).slice(0, n);
      for (const l of lanes) { const k = pool[Math.floor(r() * pool.length)]; obs.push({ k, x: LX[l], y: y + (k === 'enten' ? 0 : r() * 8), vx: k === 'enten' ? (r() < 0.5 ? -9 : 9) : 0, vy: k === 'fussg' ? -8 : k === 'wagen' ? -5 : 0, seed: r() * 99, aside: 0 }); }
    }
    const NAMES = { enten: 'ENTEN!', stand: 'MARKTSTAND!', fussg: 'ACHTUNG!', wagen: 'KINDERWAGEN!', pauke: 'GUUGGEN-PAUKE!', poller: 'POLLER!', auto: 'AUTO!', koffer: 'KOFFER!', tauben: 'TAUBEN!' };
    return this.run(chase ? 'Velo-Verfolgung' : 'Velo-Zeitfahren', chase ? 'Bleib am Velofahrer dran!' : 'vom Bahnhof an den See', `<canvas aria-label="Velo"></canvas><div class="mini-bar"><span id="vInfo">◀ ▶ Spur wechseln, 🔔 klingeln: Leute, Enten und Kinderwagen machen Platz.</span><b id="vT">0,0 s</b></div><div class="lanes" style="grid-template-columns:1fr 1fr 1fr"><button data-v="l">◀</button><button data-v="b">🔔</button><button data-v="r">▶</button></div>`, W, H, (api) => {
      const st = { lane: 1, x: LX[1], d: 0, sp: 80, t: 0, cd: 1.6, clean: 0, crash: 0, hits: 0, bell: 0, ring: 0, g: 62, fx: 80, fl: 1, flT: 1, done: false, end: 0, res: null, msg: '', msgT: 0, sect: '', sectT: 0, warned: new Set() };
      const info = api.o.querySelector('#vInfo'), tEl = api.o.querySelector('#vT');
      const say = (m, t = 0.8) => { st.msg = m; st.msgT = t; };
      const steer = (s) => { if (st.done) return; st.lane = clamp(st.lane + s, 0, 2); Snd.tone(600 + st.lane * 80, 0.03, 'triangle', 0.03); };
      const bell = () => {
        if (st.done || st.bell > 0) return; st.bell = 1.2; st.ring = 0.5;
        Snd.tone(2350, 0.18, 'sine', 0.07); Snd.tone(2350, 0.2, 'sine', 0.07, 0.16);
        for (const o of obs) if (MOVE[o.k] && !o.aside && o.y - st.d > 0 && o.y - st.d < 130) { o.aside = o.x < 80 ? -1 : o.x > 80 ? 1 : (Math.random() < 0.5 ? -1 : 1); }
      };
      const press = (b) => { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 80); };
      api.o.querySelectorAll('[data-v]').forEach((b) => MSU.tap(b, () => { press(b); const v = b.dataset.v; if (v === 'l') steer(-1); else if (v === 'r') steer(1); else bell(); }));
      MSU.tap(api.cv, (e) => { const [x] = MSU.pos(api, e, W, H); if (x < 56) steer(-1); else if (x > 104) steer(1); else bell(); });
      Mini.key = (k) => { if (MSU.LEFT.includes(k)) steer(-1); if (MSU.RIGHT.includes(k)) steer(1); if (MSU.ACT.includes(k) || MSU.UP.includes(k) || k === 'KeyB') bell(); };
      Mini._velo = { st, obs, steer, bell }; /* für Tests */
      const end = (ok) => {
        st.done = true; st.end = 0; const time = Math.round(st.t * 10) / 10;
        st.res = { ok, time, hits: st.hits };
        if (!chase) { st.res.ok = ok && time <= LIMIT; const nb = MSU.rec('velo', time, true); info.textContent = `Am See nach ${MSU.sec(time)}${nb ? ' – Rekord!' : ''}`; }
        else info.textContent = ok ? 'Am See ist Schluss: Er bremst am Quai – du hast ihn!' : 'Er ist weg … verloren in den Gassen.';
        Snd.sfx(st.res.ok ? 'win' : 'lose');
      };
      /* Velofahrer von oben */
      const rider = (c, x, y, tc, hc, pc, t, mask) => {
        const ol = '#141018', ph = Math.round(Math.sin(t * 16) * 2);
        E(c, x + 2, y + 2, 5, 9, 'rgba(0,0,0,0.22)');
        R(c, x - 2, y - 14, 4, 10, ol); R(c, x - 2, y + 4, 4, 10, ol); R(c, x - 1, y - 13, 2, 8, '#2a2a2e'); R(c, x - 1, y + 5, 2, 8, '#2a2a2e'); P(c, x - 1, y - 12, '#6a6c72');
        R(c, x, y - 7, 1, 13, '#c8ccd4'); R(c, x - 6, y - 10, 13, 3, ol); R(c, x - 5, y - 9, 11, 1, '#8a8c92');
        R(c, x - 5, y + ph, 4, 6, ol); R(c, x + 2, y - ph, 4, 6, ol); R(c, x - 4, y + 1 + ph, 2, 4, pc); R(c, x + 3, y + 1 - ph, 2, 4, pc);
        R(c, x - 6, y - 9, 3, 8, ol); R(c, x + 4, y - 9, 3, 8, ol); R(c, x - 5, y - 8, 1, 6, tc); R(c, x + 5, y - 8, 1, 6, tc);
        E(c, x, y - 1, 5, 4, ol); E(c, x, y - 1, 4, 3, tc); R(c, x - 3, y - 2, 6, 1, shade(tc, 0.2));
        E(c, x, y - 4, 3, 3, ol); E(c, x, y - 4, 2, 2, hc); P(c, x - 1, y - 5, shade(hc, 0.3));
        if (mask) { R(c, x - 3, y - 8, 7, 3, '#e8c23a'); P(c, x - 2, y - 7, '#c8302a'); P(c, x + 2, y - 7, '#c8302a'); P(c, x, y - 9, '#ff6ad0'); }
      };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        if (st.msgT > 0) st.msgT -= dt; if (st.bell > 0) st.bell -= dt; if (st.ring > 0) st.ring -= dt; if (st.crash > 0) st.crash -= dt;
        if (st.cd > 0) { st.cd -= dt; if (st.cd <= 0) { Snd.sfx('ding'); say('LOS!'); } }
        const run = st.cd <= 0 && !st.done;
        st.x += clamp(LX[st.lane] - st.x, -170 * dt, 170 * dt);
        if (run) {
          st.t += dt; st.clean += dt;
          const target = (chase ? 92 : 86) + Math.min(chase ? 30 : 36, st.clean * 6);
          st.sp += clamp(target - st.sp, -60 * dt, 34 * dt);
          st.d += st.sp * dt;
          for (const o of obs) {
            o.x += o.vx * dt; o.y += o.vy * dt;
            if (o.k === 'enten' && (o.x < 40 || o.x > 120)) o.vx *= -1;
            if (o.aside) { o.x += o.aside * 60 * dt; if (o.k === 'tauben') o.fly = (o.fly || 0) + dt; }
            const dy = o.y - st.d;
            if (dy > 40 && dy < 100 && Math.abs(o.x - st.x) < 14 && !st.warned.has(o) && !o.aside) { st.warned.add(o); say(NAMES[o.k], 0.7); }
            if (!o.hit && !(o.aside && Math.abs(o.x - 80) > 40) && Math.abs(dy) < 8 && Math.abs(o.x - st.x) < 12 && st.crash <= 0) {
              o.hit = 1; st.hits++; st.crash = 0.8; st.sp = 24; st.clean = 0; Snd.sfx('hit'); say(pick(['HOPPLA!', 'AUTSCH!', 'SORRY!', 'UPS!']), 0.8);
              if (o.k === 'enten' || o.k === 'tauben') { o.aside = o.x < st.x ? -1 : 1; Snd.tone(900, 0.08, 'square', 0.05, 0, -300); }
            }
          }
          const sc = sectAt(st.d + 40); if (sc[1] !== st.sect) { st.sect = sc[1]; st.sectT = 1.4; }
          if (chase) {
            const fs = 92 + Math.sin(st.t * 0.6) * 6;
            st.g = clamp(st.g + (st.sp - fs) * 0.24 * dt, 0, 100);
            st.flT -= dt; if (st.flT <= 0) { st.fl = Math.floor(Math.random() * 3); st.flT = rnd(0.8, 1.8); }
            st.fx += clamp(LX[st.fl] - st.fx, -90 * dt, 90 * dt);
            if (st.g <= 0) end(false); else if (st.d >= LEN) end(true);
          } else if (st.d >= LEN) end(true);
        }
        if (st.sectT > 0) st.sectT -= dt;
        if (st.done) { st.end += dt; st.sp *= Math.pow(0.2, dt); st.d += st.sp * dt; if (st.end > 2) { api.finish(st.res); return; } }
        /* ---- Zeichnen ---- */
        const c = api.ctx, sy = (wy) => PY - (wy - st.d);
        for (let ys = 0; ys < H; ys += 4) {
          const wy = st.d + (PY - ys), kind = sectAt(wy)[2], b = Math.floor(wy / 4), blk = Math.floor(wy / 26), inB = ((wy % 26) + 26) % 26;
          /* Strasse */
          const road = kind === 'park' || kind === 'bridge' ? '#8a8478' : kind === 'old' || kind === 'sure' || kind === 'gate' ? '#7a7470' : '#5a5c62';
          R(c, 36, ys, 88, 4, night ? shade(road, -0.35) : road);
          if (kind === 'old' || kind === 'sure' || kind === 'gate') for (let x = 36 + (b % 2) * 3; x < 124; x += 6) R(c, x, ys + 1, 4, 2, night ? '#4a4648' : '#8a8480');
          else if (kind !== 'park' && kind !== 'bridge' && b % 6 < 3) { R(c, 65, ys, 1, 4, '#d8d4c8'); R(c, 94, ys, 1, 4, '#d8d4c8'); }
          if (kind === 'park' || kind === 'bridge') { if (hash(b, 2) < 0.3) P(c, 40 + hash(b, 3) * 80, ys + 1, '#9a948a'); }
          /* Ränder */
          for (const side of [0, 1]) {
            const x0 = side ? 124 : 0, w = 36, hs = hash(blk, side + 7);
            if (kind === 'sure' && !side || kind === 'bridge') {
              R(c, x0, ys, w, 4, night ? '#14303a' : '#2f6a78'); if (hash(b, side + 3) < 0.5) R(c, x0 + hash(b, 5) * 30, ys + 1, 4, 1, '#5a9aa8'); if (hash(b, side) < 0.12) E(c, x0 + 6 + hash(b, 9) * 24, ys + 2, 2, 1, '#8a8a80');
              R(c, side ? 124 : 34, ys, 2, 4, '#5a5048');
            } else if (kind === 'park' || kind === 'lake') {
              R(c, x0, ys, w, 4, night ? '#1e2a20' : '#5e7a4a'); if (hash(b, side + 11) < 0.25) P(c, x0 + hash(b, side + 12) * w, ys + 1, '#f2f4f2');
            } else if (kind === 'station' && !side) {
              R(c, x0, ys, w, 4, '#6a645a'); R(c, 6, ys, 1, 4, '#b8bcc0'); R(c, 14, ys, 1, 4, '#b8bcc0'); R(c, 20, ys, 1, 4, '#b8bcc0'); R(c, 28, ys, 1, 4, '#b8bcc0'); if (b % 2) { R(c, 4, ys + 1, 12, 1, '#5a4030'); R(c, 18, ys + 1, 12, 1, '#5a4030'); }
            } else {
              R(c, side ? 124 : 30, ys, 6, 4, night ? '#4a4a4e' : '#b4b0a8');
              const hx = side ? 130 : 0, inHouse = inB < 22 && hs < 0.85;
              const roof = kind === 'new' ? (hs < 0.4 ? '#7a7c80' : '#8a8c90') : kind === 'old' || kind === 'sure' || kind === 'gate' ? ['#9a4a2a', '#8a3b2a', '#a85a3a', '#7a4a3a'][Math.floor(hs * 4)] : ['#6a5a52', '#8a3b2a', '#5a5a5e', '#7a5a4a'][Math.floor(hs * 4)];
              if (inHouse) { R(c, hx, ys, 30, 4, night ? shade(roof, -0.4) : roof); if (kind !== 'new' && (inB === 10 || inB === 11)) R(c, hx, ys, 30, 1, shade(roof, -0.3)); if (kind === 'new' && inB % 8 < 3 && hs > 0.5) R(c, hx + 4, ys, 10, 3, '#2a4a7a'); if (hash(b, side + 21) < 0.35) P(c, hx + hash(b, side + 22) * 30, ys + 1, '#f4f6f8'); if (night && hash(b, side + 23) < 0.08) P(c, hx + (side ? 0 : 29), ys + 1, '#ffd27a'); }
              else R(c, hx, ys, 30, 4, night ? '#1e2a20' : '#6a7a52');
            }
          }
        }
        /* Requisiten am Strassenrand: Bäume, Laternen, Kamine, Bänke */
        for (let k = Math.floor((st.d - 40) / 48); k <= Math.floor((st.d + H) / 48) + 1; k++) {
          const wy = k * 48 + 20, ys = sy(wy), kind = sectAt(wy)[2];
          for (const side of [0, 1]) {
            const hs = hash(k, side, 77), sx = side ? 128 : 32;
            if (kind === 'town' || kind === 'new') { if (hs < 0.55) { E(c, sx + 1, ys + 2, 6, 4, 'rgba(0,0,0,0.2)'); E(c, sx, ys, 6, 6, night ? '#1a2a1a' : '#3f5a34'); E(c, sx - 1, ys - 1, 4, 4, night ? '#22341f' : '#58784a'); P(c, sx - 2, ys - 3, '#f4f6f4'); P(c, sx + 2, ys - 1, '#f4f6f4'); } else { E(c, sx, ys, 2, 2, '#3a3c40'); if (night) E(c, sx, ys, 7, 5, 'rgba(255,220,140,0.15)'); P(c, sx, ys, night ? '#ffe9a0' : '#c9ccd2'); } }
            else if (kind === 'old' || kind === 'sure') { if (!(kind === 'sure' && !side) && hs < 0.6) { R(c, (side ? 136 : 8) + hs * 10, ys - 3, 3, 3, '#5a4a44'); R(c, (side ? 136 : 8) + hs * 10, ys - 3, 3, 1, '#f4f6f4'); } if (hs > 0.5) { E(c, sx, ys + 8, 2, 2, '#2a2a2e'); P(c, sx, ys + 8, night ? '#ffe9a0' : '#d8c890'); } }
            else if (kind === 'park') { E(c, (side ? 142 : 16) + 2, ys + 3, 9, 6, 'rgba(0,0,0,0.2)'); E(c, side ? 142 : 16, ys, 9, 8, night ? '#1a2418' : '#4a5a3a'); dither(c, (side ? 142 : 16) - 6, ys - 5, 12, 10, night ? '#2a3428' : '#6a7a52', 0.5); P(c, side ? 140 : 14, ys - 6, '#f4f6f4'); if (hs < 0.4) { R(c, sx - 3, ys + 12, 8, 3, '#7a5a3a'); R(c, sx - 3, ys + 12, 8, 1, '#a07a4a'); } }
          }
          if (kind === 'sure' && hash(k, 9) < 0.4) { const ex = 6 + hash(k, 10) * 18; E(c, ex, ys + 20, 2, 1, '#6a5a3a'); P(c, ex + 2, ys + 19, '#2a6a3a'); }
        }
        /* Brücke: Geländer; Untertor: Turm über der Strasse; See am Ende */
        for (const [f, name, kind] of SECT) {
          const ys = sy(f * LEN);
          if (kind === 'lake' && ys > -60) { R(c, 0, -10, W, ys - 6 + 10, night ? '#123038' : '#24575a'); for (let i = 0; i < 20; i++) R(c, (i * 37 + st.t * 6) % W, ys - 10 - (i * 13) % 50, 4, 1, '#3d7a78'); R(c, 0, ys - 6, W, 6, '#b8b0a0'); MSU.isleTop(c, 120, ys - 34, 9, 6, night); for (let x = 36; x < 124; x += 4) R(c, x, ys - 2, 2, 2, Math.floor(x / 4) % 2 ? '#f4f0e6' : '#1a1a1a'); }
        }
        const bridge = SECT.find((s) => s[2] === 'bridge');
        if (bridge) { const y0 = sy(bridge[0] * LEN), y1 = sy(SECT[SECT.indexOf(bridge) + 1][0] * LEN); R(c, 34, y1, 2, y0 - y1, '#7a5a3a'); R(c, 124, y1, 2, y0 - y1, '#7a5a3a'); for (let y = y1; y < y0; y += 6) { R(c, 33, y, 4, 2, '#5a3a24'); R(c, 123, y, 4, 2, '#5a3a24'); } }
        /* Hindernisse */
        for (const o of obs) {
          const ys = sy(o.y); if (ys < -16 || ys > H + 16) continue;
          const x = Math.round(o.x), y = Math.round(ys), sd = o.seed;
          if (o.k === 'stand') { R(c, x - 12, y - 7, 24, 14, '#6a4a2a'); for (let k = 0; k < 24; k += 4) R(c, x - 12 + k, y - 8, 2, 16, k % 8 ? '#e8e0d0' : '#c8302a'); R(c, x - 12, y + 6, 24, 2, '#3a2a1a'); E(c, x - 6, y + 9, 2, 1, '#e8602a'); E(c, x, y + 9, 2, 1, '#7ab83a'); E(c, x + 6, y + 9, 2, 1, '#e8c23a'); }
          else if (o.k === 'enten') { for (let k = 0; k < 4; k++) { const ex = x + k * 5 * -Math.sign(o.vx || 1), ey = y + (k % 2), s2 = k ? 0.7 : 1; E(c, ex, ey, 3 * s2, 2 * s2, k ? '#a08a5a' : '#6a5a3a'); E(c, ex + Math.sign(o.vx || 1) * 2, ey - 1, 1.5, 1.5, k ? '#a08a5a' : '#2a6a3a'); P(c, ex + Math.sign(o.vx || 1) * 4, ey - 1, '#e8a02a'); } }
          else if (o.k === 'fussg') { E(c, x, y, 4, 3, ['#2f5fb8', '#7a2f3a', '#3a5a3a', '#5a4a6a'][Math.floor(sd) % 4]); E(c, x, y - 1, 2, 2, ['#3a2a1a', '#e8c890', '#7a7a7a', '#2a2a2a'][Math.floor(sd / 3) % 4]); R(c, x - 4, y + 2, 2, 2, '#1a1a1a'); }
          else if (o.k === 'wagen') { R(c, x - 4, y - 6, 8, 10, '#2f5f8a'); E(c, x, y - 5, 4, 3, '#1f4f7a'); R(c, x - 5, y - 6, 1, 2, '#1a1a1a'); R(c, x + 4, y - 6, 1, 2, '#1a1a1a'); R(c, x - 5, y + 3, 1, 2, '#1a1a1a'); R(c, x + 4, y + 3, 1, 2, '#1a1a1a'); R(c, x - 3, y + 6, 6, 1, '#9aa0a8'); E(c, x, y + 10, 3, 3, '#7a4a5a'); E(c, x, y + 9, 2, 2, '#5a3a24'); }
          else if (o.k === 'pauke') { E(c, x, y, 8, 8, '#c8302a'); E(c, x, y, 6, 6, '#f4f0e6'); E(c, x, y, 2, 2, '#e8e0c8'); pxText(c, 'D', x - 1, y - 2, '#c8302a'); line(c, x - 10, y - 6, x - 4, y + 2, '#c8a070'); }
          else if (o.k === 'poller') { E(c, x, y + 1, 4, 2, 'rgba(0,0,0,0.3)'); E(c, x, y, 3, 3, '#3a3c40'); E(c, x, y - 1, 2, 2, '#6a6c70'); R(c, x - 3, y - 1, 6, 1, '#e8c23a'); }
          else if (o.k === 'auto') { R(c, x - 7, y - 11, 14, 22, ['#c8302a', '#2f5fb8', '#e8e0d0', '#3a3c40'][Math.floor(sd) % 4]); R(c, x - 6, y - 7, 12, 5, '#7ab0d0'); R(c, x - 6, y + 4, 12, 4, '#5a8aa8'); R(c, x - 6, y - 2, 12, 6, 'rgba(255,255,255,0.15)'); }
          else if (o.k === 'koffer') { R(c, x - 6, y - 4, 12, 8, '#7a4a2a'); R(c, x - 6, y - 1, 12, 1, '#5a3a1a'); R(c, x - 2, y - 6, 4, 2, '#3a2a1a'); R(c, x + 2, y - 4, 2, 8, '#c8a050'); }
          else if (o.k === 'tauben') { for (let k = 0; k < 5; k++) { const fy = o.fly ? -o.fly * 60 : 0, tx = x + Math.sin(k * 2.1 + sd) * 7 + (o.fly ? (k - 2) * o.fly * 20 : 0), ty = y + Math.cos(k * 1.7 + sd) * 4 + fy; if (o.fly) { R(c, tx - 3, ty, 7, 1, '#8a8c98'); P(c, tx, ty - 1, '#5a5c68'); } else { E(c, tx, ty, 2, 1, '#8a8c98'); P(c, tx + 1, ty - 1, '#3a6a5a'); } } }
        }
        /* Verfolgter: Guuggen-Bläser mit Larve */
        if (chase) { const fy = -6 + st.g * 0.62; if (fy > -14) rider(c, st.fx, fy + 14, '#2a2a3a', '#2a1a10', '#1a1a2e', st.t, true); else MSU.ctr(c, 'HOCH', st.fx, 2, '#ff6a5a'); }
        if (st.crash <= 0 || Math.floor(st.t * 12) % 2) rider(c, st.x, PY, top, hair, pants, st.done ? st.t * 0.2 : st.t, false);
        if (st.ring > 0) { c.strokeStyle = `rgba(255,230,120,${st.ring * 1.6})`; c.beginPath(); c.arc(st.x, PY - 8, 10 + (0.5 - st.ring) * 40, 0, 6.29); c.stroke(); }
        /* Untertor über der Strasse (man fährt unten durch) */
        if (!chase) { const g = SECT.find((s) => s[2] === 'gate'), ys = sy(g[0] * LEN) - 10; if (ys > -30 && ys < H + 10) { R(c, 26, ys - 14, 108, 24, '#c8b8a0'); R(c, 26, ys - 14, 108, 3, '#e8dcc8'); for (let k = 0; k < 13; k++) R(c, 30 + k * 8, ys - 10, 6, 16, k % 2 ? '#8a3b2a' : '#9a4a2a'); R(c, 76, ys - 20, 8, 8, '#2a2a2e'); E(c, 80, ys - 16, 3, 3, '#f4f0e6'); line(c, 80, ys - 16, 80, ys - 18, '#1a1a1a'); MSU.ctr(c, 'UNTERTOR', 80, ys + 12, '#f4f0e6'); } }
        /* Anzeigen */
        if (chase) { R(c, 4, 4, 6, 70, '#10161f'); const hh = Math.round(st.g * 0.68); R(c, 5, 5 + 68 - hh, 4, hh, st.g > 45 ? '#7af0a0' : st.g > 20 ? '#ffb53d' : '#ff6a5a'); }
        R(c, 150, 6, 4, 68, '#10161f'); R(c, 151, 6 + Math.round(66 * (1 - clamp(st.d / LEN, 0, 1))), 2, 2, '#ffd23d'); R(c, 149, 4, 6, 2, '#7af0a0');
        if (st.sectT > 0 && st.sect) MSU.ctr(c, st.sect, 80, 30, '#ffffff');
        if (st.cd > 0) MSU.ctr(c, String(Math.ceil(st.cd / 0.55)), 80, 46, '#ffd23d', 3);
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, 40, '#ffd23d');
        if (st.done) MSU.ctr(c, st.res.ok ? (chase ? 'ERWISCHT!' : 'AM SEE!') : (chase ? 'ENTWISCHT' : 'ZU LANGSAM'), 80, 54, st.res.ok ? '#7af0a0' : '#ff6a5a', 2);
        tEl.textContent = chase ? `${MSU.sec(st.t)} · ${Math.round(st.g)} %` : MSU.sec(st.t);
      };
    });
  },

  /* ---------- Schiessbude an der Chilbi: Blechenten und Sterne, 10 Schuss ---------- */
  schiessbude() {
    const W = 160, H = 120, wob = Mini.wob();
    return this.run('Schiessbude', 'Chilbi auf dem Märtplatz', `<canvas aria-label="Schiessbude"></canvas><div class="mini-bar"><span id="sbInfo">Tippe aufs Ziel zum Anvisieren, dann SCHUSS. Maus: zielen und klicken. Tasten: Pfeile + Leertaste.</span><b id="sbS">10 Schuss</b></div><button class="btn primary" id="sbFire" style="height:56px">Schuss!</button>`, W, H, (api) => {
      const ROWS = [{ y: 34, v: 22, n: 7, k: 'ente', gap: 26 }, { y: 56, v: -32, n: 6, k: 'stern', gap: 32 }, { y: 78, v: 42, n: 6, k: 'ente2', gap: 30 }];
      const tg = []; ROWS.forEach((rw, i) => { for (let k = 0; k < rw.n; k++) tg.push({ row: i, x: k * rw.gap + (i * 11), down: 0 }); });
      const st = { ax: 80, ay: 56, tx: 80, ty: 56, t: 0, shots: 10, hits: 0, holes: [], flash: 0, done: false, end: 0, res: null, msg: '', msgT: 0 };
      const hold = MSU.hold(api, { l: MSU.LEFT, r: MSU.RIGHT, u: MSU.UP, d: MSU.DOWN });
      const info = api.o.querySelector('#sbInfo'), sEl = api.o.querySelector('#sbS');
      const aim = () => [st.ax + Math.sin(st.t * 1.9) * 2.2 * wob + Math.sin(st.t * 4.7) * 0.9 * wob, st.ay + Math.sin(st.t * 2.3 + 1) * 1.8 * wob];
      const span = (rw) => rw.n * rw.gap;
      const tpos = (o) => { const rw = ROWS[o.row], L = span(rw); let x = ((o.x + st.t * rw.v) % L + L) % L - 12; return [x, rw.y]; };
      const prizeOf = (h) => (h >= 9 ? 'Plüsch-Gans' : h >= 7 ? 'Rose' : h >= 4 ? 'Schlüsselanhänger' : null);
      const fire = () => {
        if (st.done || st.shots <= 0) return;
        const [x, y] = aim(); st.shots--; st.flash = 0.08; st.holes.push({ x, y, t: 0 });
        Snd.noise(0.07, 0.16, 2600, 0, 'highpass'); Snd.tone(140, 0.06, 'square', 0.06);
        let hit = null;
        for (const o of tg) { if (o.down > 0) continue; const [ox, oy] = tpos(o); if (Math.abs(ox - x) < 6 && Math.abs(oy - y) < 6) { hit = o; break; } }
        if (hit) { hit.down = 2.4; st.hits++; Snd.tone(1500, 0.12, 'square', 0.05, 0.03); Snd.tone(2000, 0.1, 'square', 0.04, 0.09); st.msg = pick(['PENG!', 'TREFFER!', 'BING!']); st.msgT = 0.5; st.holes.pop(); }
        if (st.shots <= 0) { st.done = true; st.end = 0; const prize = prizeOf(st.hits); st.res = { hits: st.hits, prize }; info.textContent = prize ? `${st.hits} Treffer – du gewinnst: ${prize}!` : `${st.hits} Treffer – leider kein Preis.`; Snd.sfx(prize ? 'win' : 'lose'); }
      };
      api.o.querySelector('#sbFire').addEventListener('pointerdown', (e) => { e.preventDefault(); fire(); });
      api.cv.addEventListener('pointerdown', (e) => { e.preventDefault(); const [x, y] = MSU.pos(api, e, W, H); st.tx = x; st.ty = y; if (e.pointerType === 'mouse') { st.ax = x; st.ay = y; fire(); } });
      api.cv.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons) { const [x, y] = MSU.pos(api, e, W, H); st.tx = x; st.ty = y; if (e.pointerType === 'mouse') { st.ax = x; st.ay = y; } } });
      Mini.key = (k) => { if (MSU.ACT.includes(k)) fire(); };
      Mini._schiess = { st, tg, tpos, fire }; /* für Tests */
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; if (st.flash > 0) st.flash -= dt; if (st.msgT > 0) st.msgT -= dt;
        const kx = (hold.r ? 1 : 0) - (hold.l ? 1 : 0), ky = (hold.d ? 1 : 0) - (hold.u ? 1 : 0);
        if (kx || ky) { st.tx = clamp(st.ax + kx * 6, 4, W - 4); st.ty = clamp(st.ay + ky * 6, 20, 92); }
        const k = 1 - Math.pow(0.0004, dt); st.ax += (st.tx - st.ax) * k; st.ay += (st.ty - st.ay) * k;
        st.ax = clamp(st.ax, 4, W - 4); st.ay = clamp(st.ay, 18, 96);
        for (const o of tg) if (o.down > 0) o.down -= dt;
        for (const h of st.holes) h.t += dt;
        if (st.done) { st.end += dt; if (st.end > 2.8) { api.finish(st.res); return; } }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        R(c, 0, 0, W, H, '#1a1020');
        R(c, 8, 14, 144, 84, '#1f3a2e'); for (let y = 14; y < 98; y += 2) R(c, 8, y, 144, 1, 'rgba(0,0,0,0.12)');
        for (let i = 0; i < 18; i++) P(c, 14 + hash(i, 1) * 132, 16 + hash(i, 2) * 10, '#ffd23d');
        ROWS.forEach((rw) => { R(c, 8, rw.y + 6, 144, 2, '#8a8c90'); R(c, 8, rw.y + 8, 144, 1, '#3a3c40'); });
        for (const o of tg) {
          const [x, y] = tpos(o), ki = ROWS[o.row].k;
          if (x < 0 || x > W) continue;
          if (o.down > 0) { R(c, x - 4, y + 4, 9, 2, '#6a6c70'); continue; }
          if (ki === 'stern') { const cc = '#ffd23d'; R(c, x - 1, y - 5, 3, 11, cc); R(c, x - 5, y - 1, 11, 3, cc); R(c, x - 3, y - 3, 7, 7, cc); P(c, x, y, '#c8302a'); R(c, x, y + 5, 1, 2, '#8a8c90'); }
          else { const s2 = ki === 'ente2' ? 0.8 : 1, col = ki === 'ente2' ? '#e8e0d0' : '#e8c23a'; const fl = ROWS[o.row].v > 0 ? 1 : -1; E(c, x, y + 1, 5 * s2, 3 * s2, col); E(c, x + fl * 4 * s2, y - 3 * s2, 2.5 * s2, 2.5 * s2, col); R(c, x + fl * 6 * s2, y - 3 * s2, 2, 1, '#e8602a'); P(c, x + fl * 4 * s2, y - 4 * s2, '#1a1a1a'); R(c, x - 2, y + 2, 4, 1, shade(col, -0.25)); E(c, x, y + 1, 1.5, 1.5, '#c8302a'); R(c, x, y + 4, 1, 3, '#8a8c90'); }
        }
        for (const h of st.holes) if (h.t < 3) { P(c, h.x, h.y, '#0a0a0a'); P(c, h.x + 1, h.y, '#3a3a3a'); }
        /* Rahmen, Glühbirnen, Markise, Preise */
        R(c, 0, 14, 8, 90, '#7a2a2a'); R(c, 152, 14, 8, 90, '#7a2a2a');
        for (let y = 18; y < 100; y += 8) { const on = (Math.floor(st.t * 4) + y / 8) % 2 < 1; E(c, 4, y, 1.5, 1.5, on ? '#ffe9a0' : '#8a6a3a'); E(c, 156, y, 1.5, 1.5, on ? '#8a6a3a' : '#ffe9a0'); }
        for (let x = 0; x < W; x += 10) { R(c, x, 0, 10, 12, (x / 10) % 2 ? '#f4f0e6' : '#c8302a'); E(c, x + 5, 12, 5, 3, (x / 10) % 2 ? '#f4f0e6' : '#c8302a'); }
        MSU.ctr(c, 'SCHIESSBUDE', 80, 3, '#1a1a2e', 1, 'rgba(0,0,0,0)');
        R(c, 0, 98, W, 22, '#6a4428'); R(c, 0, 98, W, 2, '#8a5a34'); for (let x = 4; x < W; x += 22) R(c, x, 104, 1, 14, '#5a3a20');
        /* Preise auf der Theke */
        const goose = (x, y, s2) => { E(c, x, y, 5 * s2, 4 * s2, '#f6f6f2'); R(c, x + 2 * s2, y - 8 * s2, 2 * s2, 6 * s2, '#f6f6f2'); E(c, x + 3 * s2, y - 8 * s2, 2 * s2, 2 * s2, '#f6f6f2'); R(c, x + 5 * s2, y - 8 * s2, 2 * s2, 1 * s2, '#e8802a'); P(c, x + 3 * s2, y - 9 * s2, '#1a1a1a'); R(c, x + 1 * s2, y - 4 * s2, 4 * s2, 1 * s2, '#c8302a'); };
        goose(16, 112, 1); goose(144, 112, 1);
        for (let k = 0; k < 4; k++) { line(c, 40 + k * 4, 116, 40 + k * 4, 108, '#3f8e4b'); E(c, 40 + k * 4, 107, 1.5, 1.5, '#c8302a'); }
        for (let k = 0; k < 4; k++) { R(c, 108 + k * 6, 110, 3, 4, ['#ffd23d', '#c8302a', '#2f5fb8', '#7af0a0'][k]); line(c, 109 + k * 6, 110, 109 + k * 6, 107, '#c9ccd2'); }
        /* Gewehr und Fadenkreuz */
        const [ax, ay] = aim();
        if (!st.done) {
          const ga = Math.atan2(ay - 124, ax - 80); line(c, 80, 124, 80 + Math.cos(ga) * 22, 124 + Math.sin(ga) * 22, '#2a2a2e'); line(c, 81, 124, 81 + Math.cos(ga) * 22, 124 + Math.sin(ga) * 22, '#5a5c60');
          for (const [col, o] of [['#101014', 1], ['#ffffff', 0]]) { R(c, ax - 6 - o, ay - o, 4 + o * 2, 1 + o * 2, col); R(c, ax + 3 - o, ay - o, 4 + o * 2, 1 + o * 2, col); R(c, ax - o, ay - 6 - o, 1 + o * 2, 4 + o * 2, col); R(c, ax - o, ay + 3 - o, 1 + o * 2, 4 + o * 2, col); }
          P(c, ax, ay, '#ff3a3a');
        }
        if (st.flash > 0) R(c, 0, 0, W, H, 'rgba(255,240,200,0.25)');
        for (let k = 0; k < 10; k++) R(c, 50 + k * 6, 100, 3, 4, k < st.shots ? '#e8c23a' : '#3a2a1a');
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, 88, '#ffd23d');
        if (st.done) {
          R(c, 24, 30, 112, 52, 'rgba(10,8,16,0.88)'); MSU.ctr(c, `${st.hits} TREFFER`, 80, 34, '#ffd23d', 2);
          const p = st.res.prize; MSU.ctr(c, p ? 'PREIS: ' + p.toUpperCase() : 'KEIN PREIS', 80, 50, p ? '#7af0a0' : '#c9ccd2');
          if (p === 'Plüsch-Gans') goose(80, 72, 1.4); else if (p === 'Rose') { line(c, 80, 78, 80, 64, '#3f8e4b'); E(c, 80, 62, 3, 3, '#c8302a'); P(c, 79, 61, '#ff6a6a'); R(c, 81, 70, 3, 1, '#3f8e4b'); } else if (p) { R(c, 77, 66, 6, 7, '#ffd23d'); E(c, 80, 63, 3, 3, '#c9ccd2'); E(c, 80, 63, 2, 2, 'rgba(10,8,16,1)'); pxText(c, 'S', 79, 68, '#c8302a'); }
        }
        sEl.textContent = `${st.shots} Schuss · ${st.hits} Treffer`;
      };
    });
  },

  /* ---------- Hau den Lukas: im richtigen Moment zuschlagen, drei Versuche ---------- */
  lukas() {
    const W = 160, H = 128, GY = 108, wob = Mini.wob(), sheet = MSU.me(), skin = lc(G.S.look, 'skin');
    const bonus = [0, 2, 3, 5][G.S.look.build | 0] || 0;
    const LABELS = [[100, 'LUKAS!'], [80, 'MUNI'], [60, 'STARK'], [40, 'GEHT SO'], [20, 'LAUCH']];
    return this.run('Hau den Lukas', 'Chilbi auf dem Märtplatz', `<canvas aria-label="Hau den Lukas"></canvas><div class="mini-bar"><span id="hlInfo">Zuschlagen, wenn der Balken ganz oben ist!</span><b id="hlS">3 Schläge</b></div><button class="btn primary" id="hlHit" style="height:60px;font-size:20px">ZUSCHLAGEN!</button>`, W, H, (api) => {
      const st = { phase: 'aim', t: 0, pt: 0, m: 0, tries: 3, pow: 0, best: 0, bell: false, pk: 0, sw: 0, ring: 0, msg: '', msgT: 0, hits: [], shake: 0 };
      const info = api.o.querySelector('#hlInfo'), sEl = api.o.querySelector('#hlS');
      const POLE_T = 18, POLE_B = 98, ph = POLE_B - POLE_T;
      const hit = () => {
        if (st.phase !== 'aim') return;
        st.pow = clamp(Math.round(st.m * 100 * (0.94 + rnd(0, 0.06)) + bonus), 3, 100);
        st.phase = 'swing'; st.pt = 0; st.tries--; Snd.sfx('whoosh');
      };
      api.o.querySelector('#hlHit').addEventListener('pointerdown', (e) => { e.preventDefault(); hit(); });
      MSU.tap(api.cv, hit);
      Mini.key = (k) => { if (MSU.ACT.includes(k)) hit(); };
      Mini._lukas = { st, hit }; /* für Tests */
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; st.pt += dt; if (st.msgT > 0) st.msgT -= dt; if (st.ring > 0) st.ring -= dt; if (st.shake > 0) st.shake -= dt;
        if (st.phase === 'aim') st.m = MSU.tri(st.t * 1.35 * (0.9 + wob * 0.15));
        if (st.phase === 'swing' && st.pt > 0.22) { st.phase = 'fly'; st.pt = 0; st.shake = 0.3; Snd.sfx('hit'); Snd.tone(90, 0.15, 'square', 0.08); }
        if (st.phase === 'fly') {
          const up = 0.55;
          st.pk = st.pt < up ? (1 - Math.pow(1 - st.pt / up, 2)) * st.pow / 100 : Math.max(0, st.pow / 100 - Math.pow((st.pt - up) / 0.55, 2) * st.pow / 100);
          if (st.pt >= up && !st.done1) {
            st.done1 = true; st.hits.push(st.pow); st.best = Math.max(st.best, st.pow);
            if (st.pow >= 92) { st.bell = true; st.ring = 1.2; Snd.sfx('ding'); Snd.sfx('cheer'); st.msg = 'BIMM! LUKAS!'; }
            else st.msg = LABELS.find((l) => st.pow >= l[0] - 20)?.[1] || 'LAUCH';
            st.msgT = 1.3; info.textContent = `${st.pow} von 100${st.pow >= 92 ? ' – die Glocke läutet!' : ''}`;
          }
          if (st.pt > up + 0.6) { st.done1 = false; st.pk = 0; if (st.tries > 0) { st.phase = 'aim'; st.pt = 0; } else { st.phase = 'end'; st.pt = 0; Snd.sfx(st.bell ? 'win' : 'ok'); } }
        }
        if (st.phase === 'end' && st.pt > 2) { const nb = MSU.rec('lukas', st.best); api.finish({ best: st.best, bell: st.bell, hits: st.hits.slice(), rekord: nb }); return; }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        c.save(); if (st.shake > 0) c.translate(0, Math.round(rnd(-1, 1) * 2));
        MSU.chilbi(c, W, H, st.t, GY);
        R(c, 0, GY, W, H - GY, '#4a4450'); for (let x = 0; x < W; x += 8) R(c, x + ((GY / 4) % 2) * 4, GY + 4, 6, 1, '#5a5460');
        /* Lukas-Turm */
        const PX = 116;
        R(c, PX - 9, POLE_T - 4, 18, ph + 8, '#3a2a4a'); R(c, PX - 8, POLE_T - 3, 16, ph + 6, '#5a3a6a');
        for (let i = 0; i < 10; i++) { const y = POLE_B - (i + 1) * ph / 10; R(c, PX - 7, y, 14, ph / 10 - 1, mix('#3fae4a', '#e2302a', i / 9)); }
        R(c, PX - 1, POLE_T, 2, ph, '#c9ccd2');
        for (const [v, l] of LABELS) { const y = POLE_B - v / 100 * ph; R(c, PX + 9, y, 3, 1, '#f4f0e6'); pxText(c, l, PX + 13, y - 2, '#f4f0e6'); }
        const bx = PX, by = POLE_T - 8, sw = st.ring > 0 ? Math.sin(st.t * 40) * 2 : 0;
        E(c, bx + sw, by, 7, 5, '#c9a227'); E(c, bx + sw, by - 1, 5, 3, '#ffd23d'); R(c, bx - 1, by - 8, 2, 4, '#8a6a20'); E(c, bx + sw, by + 4, 2, 1, '#8a6a20');
        if (st.ring > 0) for (let k = 0; k < 6; k++) { const a = k * 1.05 + st.t * 3; line(c, bx + Math.cos(a) * 9, by + Math.sin(a) * 7, bx + Math.cos(a) * 13, by + Math.sin(a) * 10, '#ffe9a0'); }
        const pky = POLE_B - 4 - st.pk * (ph - 4);
        R(c, PX - 4, pky, 8, 5, '#c8302a'); R(c, PX - 4, pky, 8, 1, '#ff6a5a');
        R(c, PX - 12, POLE_B, 24, 8, '#2a2a2e'); R(c, PX - 10, POLE_B - 3, 20, 4, '#c8302a'); R(c, PX - 10, POLE_B - 3, 20, 1, '#ff6a5a');
        /* Spieler mit Vorschlaghammer */
        const sx = 52, sy0 = GY - SPR_H * 2;
        MSU.spr(c, sheet, st.phase === 'swing' ? 'bend' : 'stand', 2, sx, sy0, 2);
        const ang = st.phase === 'aim' ? -2.3 + Math.sin(st.t * 3) * 0.05 : st.phase === 'swing' ? lerp(-2.3, 0.25, Math.min(1, st.pt / 0.22)) : 0.25;
        const hx = sx + 22, hy = sy0 + 30;
        const ex = hx + Math.cos(ang) * 34, ey = hy + Math.sin(ang) * 34;
        line(c, hx, hy, ex, ey, '#8a5a30'); line(c, hx + 1, hy, ex + 1, ey, '#6a4020');
        c.save(); c.translate(ex, ey); c.rotate(ang); R(c, -3, -6, 7, 12, '#3a3c40'); R(c, -3, -6, 7, 2, '#6a6c70'); c.restore();
        E(c, hx, hy, 2, 2, skin);
        c.restore();
        /* Kraftmesser */
        R(c, 8, 20, 10, 82, '#10161f'); const mh = Math.round(st.m * 80);
        R(c, 9, 101 - mh, 8, mh, st.m > 0.92 ? '#ffd23d' : mix('#3fae4a', '#e2302a', st.m)); R(c, 6, 101 - Math.round(0.92 * 80), 14, 1, '#ffffff');
        pxText(c, 'BIMM', 3, 12, '#ffd23d');
        if (st.msgT > 0) MSU.ctr(c, st.msg, 64, 26, st.bell && st.ring > 0 ? '#ffd23d' : '#ffffff', 2);
        if (st.phase === 'end') { R(c, 30, 46, 100, 30, 'rgba(10,8,16,0.85)'); MSU.ctr(c, `BESTER SCHLAG ${st.best}`, 80, 52, '#ffd23d'); MSU.ctr(c, st.bell ? 'GLOCKE GELÄUTET!' : 'NOCH ÜBEN', 80, 62, st.bell ? '#7af0a0' : '#c9ccd2'); }
        sEl.textContent = `${st.tries} Schläge · Bestwert ${st.best}`;
      };
    });
  },

  /* ---------- Entenfischen: Gummienten mit dem Haken aus dem Wasserkarussell angeln, 30 Sekunden ---------- */
  entenfischen() {
    const W = 160, H = 120, CX = 80, CY = 64, RX = 56, RY = 27, DUR = 30, wob = Mini.wob();
    return this.run('Entenfischen', 'Chilbi auf dem Märtplatz', `<canvas aria-label="Entenfischen"></canvas><div class="mini-bar"><span id="efInfo">Tippe auf eine Ente: der Haken fährt hin und taucht ein. Den Ring auf dem Kopf erwischen!</span><b id="efS">30 s</b></div><button class="btn primary" id="efDip" style="height:52px">Haken eintauchen</button>`, W, H, (api) => {
      const val = () => { const r = Math.random(); return r < 0.08 ? 20 : r < 0.25 ? 10 : rint(1, 5); };
      const ducks = []; for (let k = 0; k < 12; k++) ducks.push({ a: k / 12 * Math.PI * 2, v: val(), gold: false, up: 0 });
      ducks.forEach((d) => { d.gold = d.v === 20; });
      const st = { hx: 80, hy: 30, tx: null, ty: null, t: 0, dip: 0, auto: false, ducks: 0, pts: 0, pop: [], done: false, end: 0, res: null, msg: '', msgT: 0 };
      const hold = MSU.hold(api, { l: MSU.LEFT, r: MSU.RIGHT, u: MSU.UP, d: MSU.DOWN });
      const info = api.o.querySelector('#efInfo'), sEl = api.o.querySelector('#efS');
      const pos = (d) => [CX + Math.cos(d.a) * RX, CY + Math.sin(d.a) * RY];
      const dip = () => { if (st.done || st.dip > 0) return; st.dip = 0.32; st.checked = false; Snd.tone(500, 0.05, 'sine', 0.04, 0, -200); };
      api.o.querySelector('#efDip').addEventListener('pointerdown', (e) => { e.preventDefault(); dip(); });
      api.cv.addEventListener('pointerdown', (e) => { e.preventDefault(); const [x, y] = MSU.pos(api, e, W, H); if (e.pointerType === 'mouse') { st.hx = x; st.hy = y - 4; dip(); } else { st.tx = x; st.ty = y - 4; st.auto = true; } });
      api.cv.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { const [x, y] = MSU.pos(api, e, W, H); st.hx = x; st.hy = y - 4; } });
      Mini.key = (k) => { if (MSU.ACT.includes(k)) dip(); };
      Mini._enten = { st, ducks, pos, dip }; /* für Tests */
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        if (st.msgT > 0) st.msgT -= dt;
        if (!st.done) { st.t += dt; if (st.t >= DUR) { st.done = true; st.end = 0; st.res = { ducks: st.ducks, points: st.pts }; Snd.sfx('win'); info.textContent = `${st.ducks} Enten, ${st.pts} Punkte!`; MSU.rec('enten', st.pts); } }
        else { st.end += dt; if (st.end > 2.4) { api.finish(st.res); return; } }
        for (const d of ducks) { d.a += dt * 0.34; if (d.up > 0) { d.up += dt; if (d.up > 2.2) { d.up = 0; d.v = val(); d.gold = d.v === 20; } } }
        const kx = (hold.r ? 1 : 0) - (hold.l ? 1 : 0), ky = (hold.d ? 1 : 0) - (hold.u ? 1 : 0);
        if (kx || ky) { st.hx += kx * 70 * dt; st.hy += ky * 70 * dt; st.auto = false; }
        if (st.auto && st.tx != null) { const dx = st.tx - st.hx, dy = st.ty - st.hy, dd = Math.hypot(dx, dy), sp = 140 * dt; if (dd <= sp) { st.hx = st.tx; st.hy = st.ty; st.auto = false; dip(); } else { st.hx += dx / dd * sp; st.hy += dy / dd * sp; } }
        st.hx = clamp(st.hx + Math.sin(st.t * 3) * (wob - 1) * 6 * dt, 10, 150); st.hy = clamp(st.hy, 24, 100);
        if (st.dip > 0) {
          st.dip -= dt;
          if (st.dip < 0.16 && !st.checked) {
            st.checked = true; let best = null, bd = 6;
            for (const d of ducks) { if (d.up) continue; const [x, y] = pos(d), dd = Math.hypot(x - st.hx, y - 6 - st.hy); if (dd < bd) { bd = dd; best = d; } }
            if (best && !st.done) { best.up = 0.01; st.ducks++; st.pts += best.v; st.pop.push({ x: st.hx, y: st.hy, v: best.v, t: 0, gold: best.gold }); Snd.sfx(best.gold ? 'win' : 'coin'); st.msg = best.gold ? 'GOLDENTE!' : '+' + best.v; st.msgT = 0.8; }
            else { Snd.tone(300, 0.08, 'sine', 0.05); st.msg = 'PLATSCH'; st.msgT = 0.4; }
          }
        }
        for (const p of st.pop) p.t += dt; st.pop = st.pop.filter((p) => p.t < 1.2);
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        MSU.chilbi(c, W, H, st.t, 40);
        R(c, 0, 40, W, H - 40, '#3a2a3a');
        for (let x = 0; x < W; x += 10) { R(c, x, 0, 10, 8, (x / 10) % 2 ? '#ffd23d' : '#2f7fb8'); E(c, x + 5, 8, 5, 2, (x / 10) % 2 ? '#ffd23d' : '#2f7fb8'); }
        E(c, CX, CY + 2, RX + 14, RY + 12, '#1a4a7a'); E(c, CX, CY, RX + 12, RY + 10, '#2f7fb8'); E(c, CX, CY, RX + 9, RY + 7, '#4a9ad8');
        for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + st.t * 0.34, rr = 0.85 + (i % 3) * 0.12; R(c, CX + Math.cos(a) * RX * rr, CY + Math.sin(a) * RY * rr, 3, 1, '#8ac8f0'); }
        /* Mittelinsel mit Leuchtturm */
        E(c, CX, CY, RX - 16, RY - 11, '#e8e0d0'); E(c, CX, CY - 1, RX - 18, RY - 13, '#c8302a'); for (let k = -3; k <= 3; k++) R(c, CX + k * 7 - 2, CY - 4, 4, 6, k % 2 ? '#ffd23d' : '#f4f0e6');
        R(c, CX - 3, CY - 22, 6, 18, '#f4f0e6'); R(c, CX - 3, CY - 16, 6, 3, '#c8302a'); R(c, CX - 3, CY - 9, 6, 3, '#c8302a'); R(c, CX - 4, CY - 25, 8, 3, '#3a3c40'); E(c, CX, CY - 27, 2, 2, Math.floor(st.t * 3) % 2 ? '#ffe9a0' : '#c8a040');
        /* Enten, von hinten nach vorne gezeichnet */
        const order = ducks.filter((d) => !d.up).map((d) => [d, pos(d)]).sort((a, b) => a[1][1] - b[1][1]);
        for (const [d, [x, y]] of order) {
          const fl = -Math.sin(d.a) >= 0 ? 1 : -1, bob = Math.sin(st.t * 4 + d.a * 3) * 0.6, col = d.gold ? '#ffd23d' : '#f6e04a';
          E(c, x, y + 2, 5, 1.5, 'rgba(0,30,60,0.35)'); E(c, x, y + bob, 4, 3, col); E(c, x + fl * 3, y - 3 + bob, 2.5, 2.5, col); R(c, x + fl * 5, y - 3 + bob, 2, 1, '#e8602a'); P(c, x + fl * 3, y - 4 + bob, '#1a1a1a'); R(c, x - fl * 4, y - 1 + bob, 2, 1, shade(col, -0.2));
          c.strokeStyle = '#9aa0a8'; c.beginPath(); c.arc(x + fl * 2.5, y - 7 + bob, 1.6, 0, 6.29); c.stroke();
          if (d.gold && Math.floor(st.t * 5) % 3 === 0) P(c, x - 2, y - 4, '#ffffff');
        }
        /* Rute und Haken */
        const dy = st.dip > 0 ? Math.sin((0.32 - st.dip) / 0.32 * Math.PI) * 4 : 0;
        const tipx = st.hx + 2, tipy = Math.max(6, st.hy - 26);
        line(c, 8, 118, tipx, tipy, '#c8a070'); line(c, 9, 118, tipx + 1, tipy, '#8a6a40');
        line(c, tipx, tipy, st.hx, st.hy + dy - 2, 'rgba(240,240,240,0.8)');
        R(c, st.hx, st.hy + dy - 2, 1, 4, '#c9a227'); R(c, st.hx - 2, st.hy + dy + 1, 3, 1, '#c9a227'); P(c, st.hx - 2, st.hy + dy, '#c9a227');
        c.strokeStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(st.hx, st.hy + 6, 3, 0, 6.29); c.stroke();
        for (const p of st.pop) { const y = p.y - p.t * 30; E(c, p.x, y, 4, 3, p.gold ? '#ffd23d' : '#f6e04a'); R(c, p.x - 5, y + 4, 10, 7, '#f4f0e6'); MSU.ctr(c, String(p.v), p.x, y + 5, '#c8302a', 1, 'rgba(0,0,0,0)'); }
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, 108, '#ffd23d');
        if (st.done) { R(c, 30, 40, 100, 34, 'rgba(10,8,16,0.85)'); MSU.ctr(c, `${st.ducks} ENTEN`, 80, 46, '#ffd23d', 2); MSU.ctr(c, `${st.pts} PUNKTE`, 80, 62, '#7af0a0'); }
        sEl.textContent = `${Math.max(0, Math.ceil(DUR - st.t))} s · ${st.pts} Punkte`;
      };
    });
  },

  /* ---------- Büchsenwerfen: Pyramide aus sechs Büchsen, drei Bälle ---------- */
  buechsen() {
    const W = 160, H = 112, TY = 88, CW = 8, CH = 11, G0 = 260, wob = Mini.wob(), sheet = MSU.me();
    return this.run('Büchsenwerfen', 'Chilbi auf dem Märtplatz', `<canvas aria-label="Büchsenwerfen"></canvas><div class="mini-bar"><span id="bwInfo">Tippen: Richtung festlegen. Nochmal tippen: Kraft.</span><b id="bwS">3 Bälle</b></div><button class="btn primary" id="bwGo" style="height:56px">Werfen</button>`, W, H, (api) => {
      const cans = []; [[113, 122, 131], [117.5, 126.5], [122]].forEach((row, ri) => row.forEach((x, i) => cans.push({ x, y: TY - CH * (ri + 1), vx: 0, vy: 0, r: 0, vr: 0, s: 'stand', row: ri, i })));
      const st = { phase: 'aim', t: 0, pt: 0, ang: 0, pow: 0, balls: 3, ball: null, done: false, end: 0, res: null, msg: '', msgT: 0, arm: 0 };
      const info = api.o.querySelector('#bwInfo'), sEl = api.o.querySelector('#bwS'), go = api.o.querySelector('#bwGo');
      const angOf = () => -0.12 + MSU.tri(st.t * 0.75 * wob) * 0.62;
      const powOf = () => MSU.tri(st.t * 0.9 * wob);
      const down = () => cans.filter((k) => k.s !== 'stand').length;
      const act = () => {
        if (st.phase === 'aim') { st.ang = angOf(); st.phase = 'power'; st.t = 0; Snd.sfx('blip'); info.textContent = 'Und jetzt die Kraft!'; }
        else if (st.phase === 'power') {
          st.pow = powOf(); const v = 150 + st.pow * 125;
          st.ball = { x: 26, y: 70, vx: Math.cos(st.ang) * v, vy: -Math.sin(st.ang) * v, t: 0 }; st.balls--; st.phase = 'fly'; st.arm = 0.25; Snd.sfx('whoosh');
        } else if (st.phase === 'end' && st.end > 0.5) api.finish(st.res);
      };
      go.addEventListener('pointerdown', (e) => { e.preventDefault(); act(); });
      MSU.tap(api.cv, act);
      Mini.key = (k) => { if (MSU.ACT.includes(k)) act(); };
      Mini._buechsen = { st, cans, act }; /* für Tests */
      const knock = (k, vx, vy) => { if (k.s === 'stand') { k.s = 'fly'; Snd.tone(rnd(700, 1100), 0.08, 'square', 0.05); Snd.noise(0.05, 0.08, 3000, 0, 'highpass'); } k.vx = vx; k.vy = vy; k.vr = rnd(-14, 14); };
      const overlap = (a, b) => Math.abs(a.x - b.x) < CW && Math.abs(a.y - b.y) < CH;
      const step = (dt) => {
        const b = st.ball;
        if (b) {
          b.t += dt; b.vy += G0 * dt; b.x += b.vx * dt; b.y += b.vy * dt;
          for (const k of cans) { if (k.s === 'off') continue; const nx = clamp(b.x, k.x, k.x + CW), ny = clamp(b.y, k.y, k.y + CH); if (Math.hypot(b.x - nx, b.y - ny) < 3 && !b['h' + k.row + k.i]) { b['h' + k.row + k.i] = 1; knock(k, b.vx * 0.6 + rnd(-10, 10), b.vy * 0.4 - rnd(30, 60)); b.vx *= 0.35; b.vy *= 0.5; } }
          if (b.y > TY - 2 && b.x > 104 && b.x < 152 && b.vy > 0) { b.y = TY - 2; b.vy *= -0.35; b.vx *= 0.7; }
          if (b.x > 154) { b.x = 154; b.vx = -b.vx * 0.2; }
          if (b.y > 112 || b.t > 2.6 || (Math.abs(b.vx) < 5 && b.t > 1)) st.ball = null;
        }
        /* Büchsen: fallen, kippen, stossen andere an */
        for (const k of cans) {
          if (k.s === 'stand' && k.row > 0) { const sup = cans.filter((o) => o.row === k.row - 1 && (o.i === k.i || o.i === k.i + 1)); if (sup.some((o) => o.s !== 'stand')) knock(k, rnd(-20, 20), -10); }
          if (k.s !== 'fly') continue;
          k.vy += G0 * dt; k.x += k.vx * dt; k.y += k.vy * dt; k.r += k.vr * dt;
          if (Math.abs(k.vx) > 80) for (const o of cans) if (o !== k && o.s === 'stand' && overlap(k, o)) { knock(o, k.vx * 0.45, -20); k.vx *= 0.5; }
          const onTable = k.x + CW > 104 && k.x < 152;
          if (onTable && k.y + CH > TY && k.vy > 0 && k.y < TY) { k.y = TY - CH * 0.6; k.vy *= -0.3; k.vx *= 0.6; k.vr *= 0.5; if (Math.abs(k.vy) < 15) { k.vy = 0; k.vr = 0; k.r = Math.PI / 2; } }
          if (k.x > 152) { k.x = 152; k.vx *= -0.3; }
          if (k.y > H) k.s = 'off';
        }
      };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; st.pt += dt; if (st.msgT > 0) st.msgT -= dt; if (st.arm > 0) st.arm -= dt;
        for (let i = 0; i < 4; i++) step(dt / 4);
        if (st.phase === 'fly' && !st.ball) {
          const n = down();
          if (n >= 6 || st.balls <= 0) { st.phase = 'end'; st.end = 0; st.res = { cleared: n >= 6, cans: n, balls: 3 - st.balls }; info.textContent = n >= 6 ? `Abgeräumt mit ${3 - st.balls} Ball${3 - st.balls > 1 ? 'en' : ''}!` : `${n} von 6 Büchsen umgeworfen.`; Snd.sfx(n >= 6 ? 'win' : 'ok'); if (n >= 6) Snd.sfx('cheer'); go.textContent = 'Fertig'; }
          else { st.phase = 'aim'; st.t = 0; go.textContent = 'Werfen'; info.textContent = `${n} liegen schon. Nächster Ball!`; }
        }
        if (st.phase === 'end') { st.end += dt; if (st.end > 3) { api.finish(st.res); return; } }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        MSU.chilbi(c, W, H, st.t, 50);
        R(c, 96, 22, 64, 66, '#3a5a8a'); for (let x = 96; x < 160; x += 8) R(c, x, 22, 4, 66, '#2f4a7a');
        for (let x = 96; x < 160; x += 8) { R(c, x, 14, 8, 8, (x / 8) % 2 ? '#f4f0e6' : '#2f7fb8'); E(c, x + 4, 22, 4, 2, (x / 8) % 2 ? '#f4f0e6' : '#2f7fb8'); }
        R(c, 0, 50, 96, 62, '#3a2a3a'); R(c, 0, 98, W, 14, '#4a4450');
        R(c, 104, TY, 48, 4, '#8a5a34'); R(c, 104, TY, 48, 1, '#b07a4a'); R(c, 106, TY + 4, 3, 20, '#5a3a20'); R(c, 147, TY + 4, 3, 20, '#5a3a20');
        MSU.ctr(c, '3 BÄLLE 2 FR.', 128, 26, '#ffd23d');
        for (const k of cans) {
          if (k.s === 'off' && k.y > H) continue;
          c.save(); c.translate(k.x + CW / 2, k.y + CH / 2); c.rotate(k.r);
          R(c, -CW / 2, -CH / 2, CW, CH, '#c9ccd2'); R(c, -CW / 2, -CH / 2 + 2, CW, 5, k.row === 2 ? '#c8302a' : k.row === 1 ? '#2f7fb8' : '#3fae4a'); R(c, -CW / 2, -CH / 2, CW, 1, '#f4f6f8'); R(c, -CW / 2 + 1, -CH / 2 + 1, 1, CH - 2, '#f4f6f8'); R(c, CW / 2 - 1, -CH / 2, 1, CH, '#8a8c90');
          c.restore();
        }
        /* Werfer */
        const px = 6, py = 98 - SPR_H * 2 + 2;
        MSU.spr(c, sheet, st.arm > 0 ? 'bend' : 'stand', 2, px, py, 2);
        if (st.phase === 'aim' || st.phase === 'power') E(c, 26, 70, 3, 3, '#f4f0e6');
        if (st.phase === 'aim' || st.phase === 'power') {
          const a = st.phase === 'aim' ? angOf() : st.ang, v = 150 + (st.phase === 'power' ? powOf() : 0.5) * 125;
          let x = 26, y = 70, vx = Math.cos(a) * v, vy = -Math.sin(a) * v;
          for (let i = 0; i < 14; i++) { for (let j = 0; j < 3; j++) { vy += G0 * 0.012; x += vx * 0.012; y += vy * 0.012; } if (i % 2 === 0) P(c, x, y, st.phase === 'aim' ? '#ffd23d' : 'rgba(255,210,60,0.5)'); }
        }
        if (st.phase === 'power') { const p = powOf(); R(c, 40, 102, 50, 6, '#10161f'); R(c, 41, 103, Math.round(p * 48), 4, mix('#7af0a0', '#ff6a5a', p)); MSU.txt(c, 'KRAFT', 42, 94, '#f4f0e6'); }
        if (st.ball) { E(c, st.ball.x, Math.min(TY + 2, st.ball.y + 6), 2, 1, 'rgba(0,0,0,0.2)'); E(c, st.ball.x, st.ball.y, 2.5, 2.5, '#f4f0e6'); P(c, st.ball.x - 1, st.ball.y - 1, '#ffffff'); R(c, st.ball.x - 2, st.ball.y, 5, 1, '#c8302a'); }
        for (let k = 0; k < 3; k++) E(c, 54 + k * 7, 106, 2.5, 2.5, k < st.balls ? '#f4f0e6' : '#3a3440');
        if (st.phase === 'end') { R(c, 28, 34, 104, 30, 'rgba(10,8,16,0.85)'); MSU.ctr(c, st.res.cleared ? 'ABGERÄUMT!' : `${st.res.cans} VON 6`, 80, 40, st.res.cleared ? '#7af0a0' : '#ffd23d', 2); }
        sEl.textContent = `${st.balls} Bälle · ${down()} / 6`;
      };
    });
  },

  /* ---------- Achterbahn: Fahrt mit Loopings, Reaktion auf „Hände hoch!“ und „Foto!“, am Schluss das Fahrfoto ---------- */
  achterbahn() {
    const W = 160, H = 120, GND = 150, GRAV = 125, sheet = MSU.me(), skin = lc(G.S.look, 'skin'), topC = lc(G.S.look, 'topCol');
    /* Strecke als Punktliste: Station, Kettenlift, Abfahrten, zwei Loopings, Kamelbuckel, Bremsen */
    const pts = [[0, 120]];
    const last = () => pts[pts.length - 1];
    const seg = (x1, y1, lin) => { const [x0, y0] = last(), n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2)); for (let i = 1; i <= n; i++) { const u = i / n, e = lin ? u : (1 - Math.cos(u * Math.PI)) / 2; pts.push([lerp(x0, x1, u), lerp(y0, y1, e)]); } };
    const loop = (Rr) => { const [x0, y0] = last(), cy = y0 - Rr, n = Math.ceil(Rr * 6.3 / 2); for (let i = 1; i <= n; i++) { const f = i / n, ph = f * Math.PI * 2; pts.push([x0 + Rr * Math.sin(ph) + f * 16, cy + Rr * Math.cos(ph)]); } };
    seg(70, 120, true); seg(90, 116); seg(250, -70, true); seg(275, -78); seg(420, 128); seg(470, 128, true); seg(600, -10); seg(730, 128); seg(770, 128, true); loop(44); seg(850, 128, true);
    for (let k = 0; k < 3; k++) { const x = last()[0]; seg(x + 70, 52 + k * 10); seg(x + 140, 128); }
    seg(last()[0] + 30, 128, true); loop(34); seg(last()[0] + 60, 128, true); seg(last()[0] + 120, 30); seg(last()[0] + 140, 124); seg(last()[0] + 340, 120, true);
    const S = [0]; for (let i = 1; i < pts.length; i++) S.push(S[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const TOT = S[S.length - 1];
    const idxAt = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m] <= s) lo = m; else hi = m; } return lo; };
    const at = (s) => { const i = idxAt(clamp(s, 0, TOT - 0.01)), f = (s - S[i]) / Math.max(0.001, S[i + 1] - S[i]), a = pts[i], b = pts[i + 1] || a; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0])]; };
    const liftEnd = S[pts.findIndex((p) => p[0] >= 275)], yTop = -78, brake = TOT - 300;
    const ride = brake - liftEnd;
    const kinds = ['haende', 'foto', 'haende', 'haende', 'foto', 'haende', 'foto', 'haende'].sort(() => Math.random() - 0.5);
    const prompts = [0.04, 0.16, 0.28, 0.4, 0.52, 0.64, 0.76, 0.88].map((f, i) => ({ s: liftEnd + ride * f, k: kinds[i], st: 0 }));
    return this.run('Achterbahn', 'Chilbi beim Stadttheater', `<canvas aria-label="Achterbahn"></canvas><div class="mini-bar"><span id="abInfo">Bei „HÄNDE HOCH!“ die Hände hoch, bei „FOTO!“ grinsen – so schnell wie möglich!</span><b id="abS">0 Punkte</b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-a="haende">🙌 Hände hoch</button><button data-a="foto">😁 Grinsen</button></div>`, W, H, (api) => {
      const st = { s: 0, v: 26, t: 0, pts: 0, cur: null, ct: 0, hands: 0, grin: 0, msg: '', msgT: 0, flash: 0, clack: 0, phase: 'ride', end: 0, fotoHands: false, fotoGrin: false, shake: 0, hits: 0 };
      const info = api.o.querySelector('#abInfo'), sEl = api.o.querySelector('#abS');
      const press = (k) => {
        if (st.phase !== 'ride') return;
        if (k === 'haende') st.hands = 0.8; else st.grin = 0.8;
        const b = api.o.querySelector(`[data-a="${k}"]`); if (b) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 90); }
        const p = st.cur; if (!p) return;
        if (p.k === k) { const add = Math.round(9 + 3.5 * (1 - clamp(st.ct / 1.1, 0, 1))); st.pts += add; st.hits++; p.st = 1; st.cur = null; st.msg = st.ct < 0.4 ? 'BLITZSCHNELL!' : 'SUPER!'; st.msgT = 0.7; Snd.sfx('coin'); if (k === 'foto') { st.flash = 0.25; Snd.sfx('shutter'); st.fotoGrin = true; st.fotoHands = st.hands > 0; } }
        else { st.pts = Math.max(0, st.pts - 3); st.msg = 'FALSCH!'; st.msgT = 0.6; Snd.sfx('error'); }
      };
      api.o.querySelectorAll('[data-a]').forEach((b) => MSU.tap(b, () => press(b.dataset.a)));
      MSU.tap(api.cv, (e) => { if (st.phase === 'photo') { if (st.end > 0.6) done(); return; } press(MSU.pos(api, e, W, H)[0] < W / 2 ? 'haende' : 'foto'); });
      Mini.key = (k) => { if (st.phase === 'photo' && MSU.ACT.includes(k)) { if (st.end > 0.6) done(); return; } if (MSU.UP.includes(k) || k === 'KeyH' || MSU.LEFT.includes(k)) press('haende'); if (MSU.ACT.includes(k) || k === 'KeyG' || MSU.RIGHT.includes(k)) press('foto'); };
      const score = () => Math.round(clamp(st.pts / (prompts.length * 12.5) * 100, 0, 100));
      const done = () => { const sc = score(); MSU.rec('achterbahn', sc); api.finish({ score: sc, hits: st.hits, foto: st.fotoGrin }); };
      Mini._ab = { st, prompts, press, TOT }; /* für Tests */
      /* Sursee am Horizont: St. Georg, Dächer, Lichter */
      const [bgc, bgx] = canvas(400, 60);
      for (let x = 0; x < 400; x++) { const h = 8 + Math.abs(Math.sin(x * 0.03)) * 6; R(bgx, x, 60 - h - 14, 1, h + 14, '#1a1a34'); }
      for (let i = 0; i < 40; i++) { const x = i * 10 + (i % 3) * 2, w = 8 + (i % 4), h = 8 + (i * 7) % 8; R(bgx, x, 60 - h, w, h, '#22223e'); R(bgx, x - 1, 60 - h - 3, w + 2, 3, '#2a2848'); if (i % 2) P(bgx, x + 3, 60 - h + 3, '#ffd27a'); }
      R(bgx, 150, 14, 8, 46, '#2a2848'); for (let k = 0; k < 12; k++) R(bgx, 154 - k / 3, 2 + k, 1 + k * 2 / 3, 1, '#2a2848'); E(bgx, 154, 22, 2, 2, '#ffe9a0');
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        const c = api.ctx;
        st.t += dt; if (st.msgT > 0) st.msgT -= dt; if (st.flash > 0) st.flash -= dt; if (st.hands > 0) st.hands -= dt; if (st.grin > 0) st.grin -= dt; if (st.shake > 0) st.shake -= dt;
        if (st.phase === 'ride') {
          const [, y] = at(st.s);
          if (st.s < liftEnd) { st.v = st.s < 80 ? 30 : 34; st.clack -= dt; if (st.clack <= 0 && st.s > 80) { st.clack = 0.13; Snd.tone(1200, 0.015, 'square', 0.03); } }
          else if (st.s < brake) { const v2 = 34 * 34 + 2 * GRAV * (y - yTop); st.v = Math.sqrt(Math.max(28 * 28, v2)) * 0.985; if (Math.random() < dt * st.v / 40) Snd.noise(0.05, 0.02 + st.v / 6000, 400 + st.v * 3); }
          else st.v = Math.max(0, st.v - 140 * dt);
          st.s += st.v * dt;
          if (st.s > liftEnd && st.s < liftEnd + 30 && !st.yell) { st.yell = 1; Snd.sfx('cheer'); }
          for (const p of prompts) if (!p.st && !st.cur && st.s >= p.s) { st.cur = p; st.ct = 0; p.st = -1; Snd.tone(p.k === 'foto' ? 1800 : 900, 0.08, 'square', 0.05); }
          if (st.cur) { st.ct += dt; if (st.ct > 1.1) { st.cur.st = 2; st.cur = null; st.msg = 'ZU SPÄT'; st.msgT = 0.6; } }
          if (st.s >= TOT - 2 || (st.s > brake && st.v <= 0)) { st.phase = 'photo'; st.end = 0; Snd.sfx('shutter'); Snd.sfx(score() >= 60 ? 'win' : 'ok'); info.textContent = `Dein Fahrfoto! ${score()} Punkte. Tippen zum Weiter.`; }
        } else { st.end += dt; if (st.end > 4.5) { done(); return; } }
        /* ---- Zeichnen ---- */
        const [cx, cy, ca] = at(st.s);
        const camX = cx - 56, camY = clamp(cy - 64, -140, GND - H + 6);
        c.save(); if (st.v > 150 && st.phase === 'ride') c.translate(Math.round(rnd(-1, 1) * (st.v - 150) / 60), 0);
        for (let y = 0; y < H; y++) R(c, 0, y, W, 1, mix('#0a0c28', '#3a2a5a', clamp((y + camY + 140) / 300, 0, 1)));
        for (let i = 0; i < 40; i++) P(c, ((hash(i, 1) * 600 - camX * 0.05) % W + W) % W, ((hash(i, 2) * 260 - camY * 0.1) % 200) - 40, '#c8d0ff');
        E(c, 130, 18 - camY * 0.05, 6, 6, '#f4f0d8');
        c.drawImage(bgc, Math.round(-(camX * 0.15) % 240) - 0, Math.round(GND - camY * 0.5 - 70 - camY * 0.1) + 10);
        /* Boden mit Chilbi-Lichtern */
        const gy = GND - camY;
        if (gy < H) { R(c, 0, gy, W, H - gy, '#2a2234'); for (let x = 0; x < W; x += 6) { const wx = x + camX, on = (Math.floor(wx / 6) + Math.floor(st.t * 3)) % 3; P(c, x - (camX % 6), gy + 2, ['#ffd23d', '#ff6ad0', '#6ae0ff'][on]); } for (let i = 0; i < 8; i++) { const wx = i * 220 + 60, x = wx - camX; if (x > -40 && x < W + 40) { R(c, x, gy - 12, 30, 12, ['#5a2a4a', '#2a3a5a'][i % 2]); for (let k = 0; k < 30; k += 4) R(c, x + k, gy - 15, 2, 3, k % 8 ? '#e8e0d0' : '#c8302a'); } } }
        /* Stützen */
        for (let i = 0; i < pts.length; i += 12) { const [x, y] = pts[i], sx = x - camX; if (sx < -4 || sx > W + 4) continue; if (y < GND - 4) { line(c, sx, y - camY + 3, sx, gy, '#4a4a5e'); if (i % 24 === 0) line(c, sx, y - camY + 3, sx + 10, gy, '#3a3a4e'); } }
        /* Schienen */
        for (let i = 1; i < pts.length; i++) {
          const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], sx = x0 - camX; if (sx < -6 || sx > W + 6) continue;
          const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a);
          line(c, sx, y0 - camY, x1 - camX, y1 - camY, '#c8302a'); line(c, sx + nx * 3, y0 - camY + ny * 3, x1 - camX + nx * 3, y1 - camY + ny * 3, '#8a1a1a');
          if (i % 3 === 0) line(c, sx, y0 - camY, sx + nx * 3, y0 - camY + ny * 3, '#5a5a6a');
          if (S[i] < liftEnd && S[i] > 90 && i % 2 === 0) P(c, sx + nx * 1.5, y0 - camY + ny * 1.5, '#9aa0a8');
        }
        /* Station */
        { const sx = 10 - camX, sy = 120 - camY; if (sx > -70) { R(c, sx - 8, sy - 26, 70, 4, '#c8302a'); R(c, sx - 8, sy - 22, 2, 24, '#5a5a6a'); R(c, sx + 60, sy - 22, 2, 24, '#5a5a6a'); MSU.txt(c, 'BLITZ', sx + 14, sy - 34, '#ffd23d'); } }
        /* Wagen mit dir */
        c.save(); c.translate(Math.round(cx - camX), Math.round(cy - camY)); c.rotate(ca);
        const up = st.hands > 0;
        MSU.head(c, sheet, -9, -16, 1, 0);
        if (st.grin > 0) { R(c, -2, -9, 5, 1, '#5a1e1e'); R(c, -2, -9, 5, 1, '#f4efe4'); }
        if (up) { line(c, -5, -6, -8, -17, topC); line(c, 4, -6, 7, -17, topC); E(c, -8, -18, 1.5, 1.5, skin); E(c, 7, -18, 1.5, 1.5, skin); }
        R(c, -10, -6, 20, 8, '#e8302a'); R(c, -10, -6, 20, 2, '#ffd23d'); R(c, -11, -7, 3, 6, '#c8302a'); pxText(c, '7', 3, -4, '#ffffff');
        E(c, -6, 3, 2, 2, '#2a2a2e'); E(c, 6, 3, 2, 2, '#2a2a2e');
        c.restore();
        c.restore();
        /* Aufforderungen */
        if (st.cur) {
          const k = st.cur.k, blink = Math.floor(st.t * 10) % 2;
          R(c, 0, 4, W, 18, k === 'foto' ? 'rgba(255,255,255,0.25)' : 'rgba(255,90,200,0.3)');
          MSU.ctr(c, k === 'foto' ? 'FOTO! GRINSEN!' : 'HÄNDE HOCH!', 80, 7, blink ? '#ffffff' : '#ffd23d', 2);
          R(c, 40, 24, Math.round(80 * (1 - st.ct / 1.1)), 2, '#ffd23d');
        }
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, 30, st.msg === 'FALSCH!' || st.msg === 'ZU SPÄT' ? '#ff6a5a' : '#7af0a0');
        if (st.s < liftEnd && st.phase === 'ride') MSU.ctr(c, st.s < 90 ? 'BITTE EINSTEIGEN' : 'UF GAHTS!', 80, 108, '#ffffff');
        if (st.flash > 0) R(c, 0, 0, W, H, `rgba(255,255,255,${st.flash * 3})`);
        /* Fahrfoto */
        if (st.phase === 'photo') {
          R(c, 0, 0, W, H, 'rgba(8,8,20,0.75)');
          R(c, 34, 10, 92, 92, '#f4f0e6'); R(c, 40, 16, 80, 64, '#1a1838');
          for (let y = 16; y < 80; y++) R(c, 40, y, 80, 1, mix('#2a2a6a', '#6a3a7a', (y - 16) / 64));
          for (let k = 0; k < 10; k++) line(c, 40 + k * 9, 80, 40 + k * 9 + 26, 16, 'rgba(255,255,255,0.08)');
          line(c, 40, 72, 120, 64, '#c8302a'); line(c, 40, 74, 120, 66, '#8a1a1a');
          MSU.head(c, sheet, 62, 38, 2, 0);
          if (st.fotoGrin) { R(c, 74, 55, 10, 2, '#5a1e1e'); R(c, 75, 55, 8, 1, '#f4efe4'); }
          if (st.fotoHands) { line(c, 64, 62, 56, 34, topC); line(c, 65, 62, 57, 34, topC); line(c, 92, 62, 100, 34, topC); line(c, 93, 62, 101, 34, topC); E(c, 56, 32, 3, 3, skin); E(c, 101, 32, 3, 3, skin); }
          R(c, 52, 62, 56, 14, '#e8302a'); R(c, 52, 62, 56, 3, '#ffd23d'); pxText(c, 'BLITZ', 70, 68, '#ffffff');
          MSU.ctr(c, `${score()} PUNKTE`, 80, 86, '#1a1a2e', 1, 'rgba(0,0,0,0)'); MSU.ctr(c, 'CHILBI SURSEE 2026', 80, 94, '#8a8c90', 1, 'rgba(0,0,0,0)');
        }
        sEl.textContent = `${score()} Punkte`;
      };
    });
  },

  /* ---------- Riesenrad: Fahrt nach oben, dann Suchbild über Sursee bei Nacht – wo blinkt die Taschenlampe? ---------- */
  riesenrad() {
    const W = 160, H = 120, LIMIT = 40, ISL = [46, 62], TORCH = [47, 58];
    return this.run('Riesenrad', 'Chilbi beim Stadttheater', `<canvas aria-label="Riesenrad"></canvas><div class="mini-bar"><span id="rrInfo">Uf gaht's! Gleich bist du ganz oben …</span><b id="rrT"></b></div><button class="btn primary" id="rrGo" style="height:52px">Da! (zeigen)</button>`, W, H, (api) => {
      const st = { phase: 'up', t: 0, pt: 0, cx: 80, cy: 60, found: false, guess: 0, msg: '', msgT: 0, end: 0, res: null, hint: 0, mark: null };
      const hold = MSU.hold(api, { l: MSU.LEFT, r: MSU.RIGHT, u: MSU.UP, d: MSU.DOWN });
      const info = api.o.querySelector('#rrInfo'), tEl = api.o.querySelector('#rrT');
      /* Panorama einmal vorzeichnen */
      const [pc, px] = canvas(W, H);
      for (let y = 0; y < 52; y++) R(px, 0, y, W, 1, mix('#070a22', '#22305a', y / 52));
      for (let i = 0; i < 40; i++) P(px, hash(i, 31) * W, hash(i, 32) * 40, hash(i, 33) > 0.7 ? '#ffffff' : '#8a96c8');
      E(px, 134, 12, 5, 5, '#f4f0d8'); E(px, 136, 11, 4, 4, '#101634');
      for (let x = 0; x < W; x++) { const h = 6 + Math.abs(Math.sin(x * 0.03 + 0.5)) * 7 + Math.sin(x * 0.11) * 1.5; R(px, x, 52 - h, 1, h, '#1c2440'); R(px, x, 52 - h, 1, 2, '#6a7498'); }
      R(px, 0, 52, W, 16, '#0e2630'); for (let i = 0; i < 30; i++) R(px, hash(i, 41) * W, 53 + hash(i, 42) * 14, 3, 1, '#18404a');
      for (let y = 53; y < 68; y++) if (y % 2) R(px, 131 + Math.sin(y) * 2, y, 6, 1, 'rgba(244,240,216,0.25)');
      E(px, ISL[0], ISL[1], 6, 2, '#0a1414'); for (const [dx, h] of [[-3, 7], [0, 9], [2, 8], [4, 6]]) { line(px, ISL[0] + dx, ISL[1], ISL[0] + dx, ISL[1] - h, '#0c1418'); E(px, ISL[0] + dx, ISL[1] - h + 2, 1.5, 3, '#101a1c'); }
      R(px, 0, 66, W, 4, '#141a24'); for (let x = 0; x < W; x += 7) P(px, x, 67, '#c8b070');
      /* Altstadt: Dächer mit Schnee, St. Georg, Rathaus, Untertor */
      for (let i = 0; i < 26; i++) { const x = i * 7 - 4 + (i % 3), w = 9 + (i % 3), y = 76 + (i * 5) % 9; R(px, x, y, w, H - y, '#1a1a28'); for (let k = 0; k < 4; k++) R(px, x + k, y - k, w - k * 2, 1, '#3a3446'); R(px, x + 1, y - 2, w - 3, 1, '#c8ccd8'); }
      for (let i = 0; i < 18; i++) { const x = i * 9 + 2, y = 92 + (i * 7) % 10; R(px, x, y, 12, H - y, '#14141f'); for (let k = 0; k < 5; k++) R(px, x - 1 + k, y - k, 14 - k * 2, 1, '#2e2a3a'); R(px, x + 2, y - 3, 6, 1, '#d8dce8'); }
      R(px, 94, 46, 8, 50, '#2a2838'); R(px, 95, 46, 1, 50, '#3a3848'); for (let k = 0; k < 22; k++) R(px, 98 - k / 4.4, 24 + k, Math.max(1, k / 2.2), 1, '#3a5a5a'); R(px, 97, 20, 1, 5, '#c9a227'); E(px, 98, 54, 2, 2, '#e8d8a0'); R(px, 95, 62, 2, 3, '#ffd27a'); R(px, 99, 62, 2, 3, '#ffd27a');
      R(px, 56, 74, 26, 22, '#2a2632'); for (let k = 0; k < 4; k++) { R(px, 56 + k * 2, 70 - k * 2, 2, 4, '#2a2632'); R(px, 80 - k * 2, 70 - k * 2, 2, 4, '#2a2632'); } R(px, 66, 60, 6, 14, '#2a2632'); for (let k = 0; k < 6; k++) R(px, 69 - k / 2, 54 + k, k + 1, 1, '#3a2a2a'); for (let k = 0; k < 3; k++) { R(px, 59 + k * 8, 80, 3, 4, '#ffd27a'); R(px, 59 + k * 8, 87, 3, 4, '#ffd27a'); }
      R(px, 18, 70, 12, 26, '#2a2632'); for (let k = 0; k < 7; k++) R(px, 24 - k, 64 + k, k * 2 + 1, 1, '#3a2a2a'); R(px, 22, 86, 4, 10, '#0a0a12');
      const WIN = []; for (let i = 0; i < 46; i++) { const x = Math.floor(hash(i, 51) * W), y = 78 + Math.floor(hash(i, 52) * 36); WIN.push([x, y]); R(px, x, y, 2, 2, hash(i, 53) > 0.4 ? '#ffd27a' : '#e8a050'); }
      for (let x = 30; x < 130; x += 4) { const y = 108 + Math.sin(x * 0.08) * 2; P(px, x, y, ['#ffd23d', '#ff6a5a', '#6ae0ff', '#7aff6a'][(x / 4) % 4 | 0]); }
      const DECOY = [{ x: 98, y: 54, n: 'die Turmuhr von St. Georg' }, { x: 120, y: 60, n: 'die rote Boje vor dem Strandbad' }, { x: 70, y: 82, n: 'ein Fenster im Rathaus' }, { x: 132, y: 60, n: 'nur der Mond im Wasser' }, { x: 24, y: 70, n: 'das Untertor' }, { x: 80, y: 108, n: 'die Lichterkette am Märtplatz' }];
      const guess = (x, y) => {
        if (st.phase !== 'view' || st.cool > 0) return;
        st.mark = { x, y, t: 0 };
        if (Math.hypot(x - TORCH[0], y - TORCH[1]) < 7) { st.found = true; st.phase = 'end'; st.end = 0; st.res = { found: true, time: Math.round(st.pt * 10) / 10, guesses: st.guess + 1 }; Snd.sfx('win'); info.textContent = 'Da! Auf dem Gamma-Inseli blinkt eine Taschenlampe – da ist jemand!'; return; }
        st.guess++; st.cool = 0.8; Snd.sfx('error');
        let best = null, bd = 12; for (const d of DECOY) { const dd = Math.hypot(d.x - x, d.y - y); if (dd < bd) { bd = dd; best = d; } }
        info.textContent = best ? `Nein, das ist ${best.n}.` : WIN.some(([wx, wy]) => Math.abs(wx - x) < 4 && Math.abs(wy - y) < 4) ? 'Nur ein Fenster in der Altstadt.' : 'Da ist nichts. Such das Blinken!';
      };
      api.o.querySelector('#rrGo').addEventListener('pointerdown', (e) => { e.preventDefault(); if (st.phase === 'end') { if (st.end > 0.5) api.finish(st.res); } else guess(st.cx, st.cy); });
      api.cv.addEventListener('pointerdown', (e) => { e.preventDefault(); const [x, y] = MSU.pos(api, e, W, H); if (st.phase === 'end') { if (st.end > 0.5) api.finish(st.res); return; } st.cx = x; st.cy = y; guess(x, y); });
      api.cv.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' && st.phase === 'view') { const [x, y] = MSU.pos(api, e, W, H); st.cx = x; st.cy = y; } });
      Mini.key = (k) => { if (MSU.ACT.includes(k)) { if (st.phase === 'end') { if (st.end > 0.5) api.finish(st.res); } else guess(st.cx, st.cy); } };
      Mini._rad = { st, guess, TORCH }; /* für Tests */
      const torchOn = (t) => { const u = t % 2.6; return u < 0.18 || (u > 0.36 && u < 0.54) || (u > 0.72 && u < 0.9); };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; if (st.msgT > 0) st.msgT -= dt; if (st.mark) st.mark.t += dt; if (st.cool > 0) st.cool -= dt;
        if (st.phase === 'up') { st.pt += dt; if (st.pt > 5) { st.phase = 'view'; st.pt = 0; Snd.sfx('ding'); info.textContent = 'Ganz oben! Irgendwo blinkt ein Licht, das nicht hierher gehört. Tippe darauf!'; } }
        else if (st.phase === 'view') {
          st.pt += dt;
          const kx = (hold.r ? 1 : 0) - (hold.l ? 1 : 0), ky = (hold.d ? 1 : 0) - (hold.u ? 1 : 0);
          st.cx = clamp(st.cx + kx * 50 * dt, 2, W - 2); st.cy = clamp(st.cy + ky * 50 * dt, 2, H - 2);
          if (st.pt > 15 && st.hint === 0) { st.hint = 1; info.textContent = 'Tipp: Schau auf den See hinaus – beim kleinen Inseli links.'; Snd.sfx('blip'); }
          if (st.pt > 26 && st.hint === 1) { st.hint = 2; info.textContent = 'Da, links auf dem dunklen Wasser! Das kleine Inseli mit den Bäumen …'; }
          if (st.pt > LIMIT) { st.phase = 'end'; st.end = 0; st.res = { found: false, time: LIMIT, guesses: st.guess }; Snd.sfx('lose'); info.textContent = 'Die Gondel fährt wieder runter. Nichts gefunden …'; }
        } else { st.end += dt; if (st.end > 3.5) { api.finish(st.res); return; } }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        if (st.phase === 'up') {
          MSU.chilbi(c, W, H, st.t, 104); R(c, 0, 104, W, 16, '#2a2234');
          const ox = 80, oy = 60, Rr = 44, rot = st.pt / 5 * Math.PI * 0.9;
          line(c, ox, oy, ox - 24, 104, '#8a8ca0'); line(c, ox, oy, ox + 24, 104, '#8a8ca0'); line(c, ox - 1, oy, ox - 25, 104, '#6a6c80');
          c.strokeStyle = '#c8c8d8'; c.beginPath(); c.arc(ox, oy, Rr, 0, 6.29); c.stroke(); c.beginPath(); c.arc(ox, oy, Rr - 4, 0, 6.29); c.stroke();
          for (let k = 0; k < 12; k++) { const a = rot + k * Math.PI / 6; line(c, ox, oy, ox + Math.cos(a) * Rr, oy + Math.sin(a) * Rr, '#9a9ab0'); P(c, ox + Math.cos(a) * (Rr - 2), oy + Math.sin(a) * (Rr - 2), ['#ffd23d', '#ff6ad0', '#6ae0ff'][(k + Math.floor(st.t * 4)) % 3]); }
          for (let k = 0; k < 12; k++) { const a = rot + k * Math.PI / 6 + Math.PI / 2, gx = ox + Math.cos(a) * Rr, gy = oy + Math.sin(a) * Rr; line(c, gx, gy, gx, gy + 3, '#9a9ab0'); R(c, gx - 4, gy + 3, 8, 6, k === 0 ? '#ffd23d' : ['#c8302a', '#2f7fb8', '#3fae4a'][k % 3]); R(c, gx - 3, gy + 4, 6, 2, '#ffe9a0'); if (k === 0) { MSU.head(c, MSU.me(), gx - 5, gy - 4, 0.55, 0); } }
          E(c, ox, oy, 4, 4, '#ffd23d');
          MSU.ctr(c, 'UF GAHTS!', 80, 6, '#ffffff', 2);
        } else {
          c.drawImage(pc, 0, 0);
          /* bewegte Lichter: Boot, Auto am Ufer, rote Boje */
          const bx = (st.t * 4) % 200 - 20; P(c, bx, 60, '#7aff6a'); P(c, bx + 2, 60, '#ff5a5a');
          const ax = 160 - (st.t * 18) % 200; R(c, ax, 67, 2, 1, '#fff6c8');
          if (Math.floor(st.t * 1.2) % 2) { P(c, 120, 60, '#ff3a3a'); P(c, 120, 59, 'rgba(255,60,60,0.4)'); }
          if (torchOn(st.t)) { P(c, TORCH[0], TORCH[1], '#fffbe0'); P(c, TORCH[0] + 1, TORCH[1], '#ffe9a0'); E(c, TORCH[0], TORCH[1], 2, 1, 'rgba(255,240,180,0.35)'); }
          if (st.hint >= 2) { c.strokeStyle = `rgba(255,210,60,${0.25 + Math.sin(st.t * 4) * 0.15})`; c.beginPath(); c.arc(ISL[0], ISL[1] - 3, 11, 0, 6.29); c.stroke(); }
          /* Gondelrand vorne */
          R(c, 0, 0, W, 3, '#c8302a'); R(c, 0, 0, 3, H, '#c8302a'); R(c, W - 3, 0, 3, H, '#c8302a'); R(c, 0, H - 10, W, 10, '#c8302a'); R(c, 0, H - 10, W, 2, '#ffd23d');
          if (st.phase === 'view') { const x = Math.round(st.cx), y = Math.round(st.cy); c.strokeStyle = '#ffffff'; c.beginPath(); c.arc(x + 0.5, y + 0.5, 5, 0, 6.29); c.stroke(); R(c, x - 8, y, 3, 1, '#ffffff'); R(c, x + 6, y, 3, 1, '#ffffff'); R(c, x, y - 8, 1, 3, '#ffffff'); R(c, x, y + 6, 1, 3, '#ffffff'); }
          if (st.mark && st.mark.t < 0.8 && !st.found) { MSU.ctr(c, 'NEIN', st.mark.x, st.mark.y - 12, '#ff6a5a'); }
          if (st.phase === 'end') { if (st.found) { c.strokeStyle = '#7af0a0'; c.beginPath(); c.arc(TORCH[0], TORCH[1], 8 + Math.sin(st.t * 8), 0, 6.29); c.stroke(); MSU.ctr(c, 'GEFUNDEN!', 80, 20, '#7af0a0', 2); } else MSU.ctr(c, 'ZU SPÄT', 80, 20, '#ff6a5a', 2); }
          if (st.phase === 'view') tEl.textContent = `${Math.max(0, Math.ceil(LIMIT - st.pt))} s`;
        }
      };
    });
  },

  /* ---------- Gansabhauet: mit Sonnenmaske und rotem Mantel ein einziger Hieb mit dem stumpfen Säbel ---------- */
  gansabhauet() {
    const W = 160, H = 120, LIMIT = 20, AMP = 15, PER = 2.4, sheet = MSU.me(), wob = Mini.wob();
    return this.run('Gansabhauet', 'vor dem Rathaus Sursee', `<canvas aria-label="Gansabhauet"></canvas><div class="mini-bar"><span id="gaInfo">Mit verbundenen Augen, Sonnenmaske und rotem Mantel: ein einziger Hieb!</span><b id="gaT"></b></div><div class="lanes" style="grid-template-columns:1fr 1.3fr 1fr"><button data-g="l">◀ drehen</button><button data-g="hau" class="primary">HAUEN!</button><button data-g="r">drehen ▶</button></div>`, W, H, (api) => {
      const st = { phase: 'intro', t: 0, pt: 0, th: 0, shout: 1.2, shoutTxt: '', shoutSide: 0, shoutT: 0, beat: 0, s: 0, res: null, end: 0, err: 99, fall: 0, feathers: [], conf: [], swing: 0 };
      const info = api.o.querySelector('#gaInfo'), tEl = api.o.querySelector('#gaT');
      const gx = (t) => AMP * Math.sin(t / PER * Math.PI * 2);
      const errNow = () => Math.abs(st.th * 0.9 + gx(st.t));
      const strike = () => {
        if (st.phase !== 'dark') return;
        st.err = Math.abs(st.th * 0.9 + gx(st.t + 0.08)); st.phase = 'swing'; st.pt = 0; Snd.sfx('whoosh'); Snd.noise(0.3, 0.1, 900, 0.05, 'bandpass');
        const hit = st.err < 4, knapp = !hit && st.err < 12;
        st.res = { hit, quality: Math.round(clamp(100 - st.err * 6, 0, 100)), result: hit ? 'hit' : knapp ? 'knapp' : 'luft' };
      };
      const turn = (d) => { if (st.phase !== 'dark') return; st.th += d * 6; Snd.sfx('step'); };
      const act = (g) => { if (st.phase === 'intro') { if (st.pt > 0.5) { st.phase = 'spin'; st.pt = 0; Snd.sfx('whoosh'); } return; } if (st.phase === 'reveal') { if (st.pt > 1.2) api.finish(st.res); return; } if (g === 'l') turn(-1); else if (g === 'r') turn(1); else strike(); };
      api.o.querySelectorAll('[data-g]').forEach((b) => MSU.tap(b, () => act(b.dataset.g)));
      MSU.tap(api.cv, (e) => { const [x] = MSU.pos(api, e, W, H); act(x < 50 ? 'l' : x > 110 ? 'r' : 'hau'); });
      Mini.key = (k) => { if (MSU.LEFT.includes(k)) act('l'); else if (MSU.RIGHT.includes(k)) act('r'); else if (MSU.ACT.includes(k) || MSU.DOWN.includes(k)) act('hau'); };
      Mini._gans = { st, gx, errNow, strike, turn }; /* für Tests */
      /* Gans am Draht (tot, wie beim echten Brauch), Comic-Stil */
      const goose = (c, x, y, sway, cut, fall) => {
        line(c, x, y - 8 + 0, x + sway * 0.2, y, '#d8d8d8');
        const nx = x + sway * 0.3;
        R(c, nx - 1, y, 2, 10, '#f2f2ee'); E(c, nx, y + 1, 2, 2, '#f2f2ee'); R(c, nx + 1, y + 1, 2, 1, '#e8902a');
        const by = y + 16 + fall, bx = nx + sway * 0.5;
        if (cut && fall > 0) { R(c, nx - 1, y + 8, 2, 2, '#f2f2ee'); }
        E(c, bx, by, 6, 8, '#f6f6f2'); E(c, bx - 2, by, 3, 6, '#e2e2dc'); R(c, bx - 2, by + 8, 1, 3, '#e8902a'); R(c, bx + 1, by + 8, 1, 3, '#e8902a'); if (!cut || fall <= 0) R(c, nx - 1, y + 8, 2, by - y - 14, '#f2f2ee');
      };
      const rathaus = (c) => {
        for (let y = 0; y < 50; y++) R(c, 0, y, W, 1, mix('#9ab4c8', '#e2eaee', y / 50));
        R(c, 14, 22, 132, 74, '#c8b89a'); R(c, 14, 22, 132, 2, '#e0d4bc');
        for (let k = 0; k < 6; k++) { R(c, 14 + k * 4, 22 - k * 4, 4, 4, '#c8b89a'); R(c, 142 - k * 4, 22 - k * 4, 4, 4, '#c8b89a'); }
        R(c, 38, -2, 84, 2, '#c8b89a');
        R(c, 72, 0, 16, 40, '#b8a888'); for (let k = 0; k < 10; k++) R(c, 80 - k * 0.8, -10 + k, Math.max(1, k * 1.6), 1, '#5a6a7a'); E(c, 80, 14, 4, 4, '#f4f0e6'); line(c, 80, 14, 80, 11, '#1a1a1a'); line(c, 80, 14, 82, 15, '#1a1a1a');
        for (let k = 0; k < 6; k++) { const x = 20 + k * 21; R(c, x, 46, 8, 11, '#3a4a5a'); R(c, x - 2, 46, 2, 11, '#c8302a'); R(c, x + 8, 46, 2, 11, '#f4f0e6'); R(c, x, 51, 8, 1, '#c8b89a'); }
        for (let k = 0; k < 5; k++) { const x = 22 + k * 26; R(c, x, 70, 16, 26, '#4a3a2a'); E(c, x + 8, 70, 8, 5, '#4a3a2a'); }
        R(c, 0, 96, W, 24, '#8a8478'); for (let y = 98; y < H; y += 4) for (let x = (y % 8) ? 0 : 4; x < W; x += 8) R(c, x, y, 6, 3, '#9a9488');
        line(c, 0, 30, W, 30, '#4a4a4a');
      };
      const crowd = (c, cheer, laugh) => {
        for (let k = 0; k < 14; k++) { const x = k < 7 ? 2 + k * 7 : 104 + (k - 7) * 8, y = 92 + (k % 2) * 4, j = cheer ? Math.abs(Math.sin(st.t * 9 + k)) * 3 : laugh ? Math.abs(Math.sin(st.t * 14 + k)) : 0; R(c, x, y - j, 6, 14, ['#2a3a5a', '#5a2a2a', '#3a4a3a', '#4a3a5a', '#6a5a3a'][k % 5]); E(c, x + 3, y - 3 - j, 3, 3, ['#f2d0b0', '#c89a72', '#e8b890', '#8a5a3a'][k % 4]); if (k % 3 === 0) R(c, x, y - 6 - j, 6, 2, '#2a2a2a'); if (cheer) { R(c, x - 1, y - 9 - j, 1, 5, '#f2d0b0'); R(c, x + 6, y - 9 - j, 1, 5, '#f2d0b0'); } }
      };
      const schlaeger = (c, x, y, sabre) => {
        c.fillStyle = '#b8202a'; c.beginPath(); c.moveTo(x - 8, y - 22); c.lineTo(x + 8, y - 22); c.lineTo(x + 12, y + 8); c.lineTo(x - 12, y + 8); c.closePath(); c.fill();
        R(c, x - 8, y - 22, 16, 2, '#e8402a'); for (let k = -10; k < 12; k += 4) R(c, x + k, y + 6, 2, 2, '#8a1a1a');
        E(c, x, y - 30, 9, 9, '#c9a227'); E(c, x, y - 30, 7, 7, '#ffd23d');
        for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6 + st.t * 0.3; line(c, x + Math.cos(a) * 9, y - 30 + Math.sin(a) * 9, x + Math.cos(a) * 13, y - 30 + Math.sin(a) * 13, '#ffd23d'); }
        P(c, x - 3, y - 32, '#8a6a10'); P(c, x + 3, y - 32, '#8a6a10'); R(c, x - 2, y - 26, 5, 1, '#8a6a10');
        R(c, x - 3, y + 8, 2, 4, '#1a1a1a'); R(c, x + 2, y + 8, 2, 4, '#1a1a1a');
        if (sabre != null) { c.save(); c.translate(x + 7, y - 16); c.rotate(sabre); R(c, 0, -1, 26, 2, '#d8dce0'); R(c, 0, -1, 26, 1, '#ffffff'); R(c, -4, -3, 4, 6, '#c9a227'); c.restore(); }
      };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; st.pt += dt; if (st.shoutT > 0) st.shoutT -= dt;
        const c = api.ctx;
        if (st.phase === 'intro') {
          rathaus(c); goose(c, 80, 30, Math.sin(st.t * 2.6) * 2, false, 0); crowd(c, false, false);
          schlaeger(c, 80, 88, -1.2);
          MSU.ctr(c, 'GANSABHAUET', 80, 4, '#c8302a', 2, '#f4f0e6');
          if (st.pt > 1) MSU.ctr(c, 'TIPPEN ZUM START', 80, 108, Math.floor(st.t * 2) % 2 ? '#ffffff' : '#ffd23d');
          if (st.pt > 6) { st.phase = 'spin'; st.pt = 0; Snd.sfx('whoosh'); }
          tEl.textContent = ''; return;
        }
        if (st.phase === 'spin') {
          R(c, 0, 0, W, H, '#05050a');
          for (let k = 0; k < 18; k++) { const a = st.pt * 7 + k * 0.35, rr = 20 + k * 3; P(c, 80 + Math.cos(a) * rr, 60 + Math.sin(a) * rr * 0.6, k % 3 ? '#3a3020' : '#8a7030'); }
          MSU.ctr(c, ['EINS!', 'ZWEI!', 'DREI!'][Math.min(2, Math.floor(st.pt / 0.75))], 80, 54, '#5a5040', 2, 'rgba(0,0,0,0)');
          if (Math.floor(st.pt / 0.75) !== Math.floor((st.pt - dt) / 0.75)) Snd.tone(220, 0.12, 'triangle', 0.08);
          if (st.pt > 2.25) { st.phase = 'dark'; st.pt = 0; st.th = (Math.random() < 0.5 ? -1 : 1) * rnd(40, 110); info.textContent = 'Hör auf die Leute! Wo es am stärksten flimmert und pocht, hängt die Gans. Dann: HAUEN!'; }
          return;
        }
        if (st.phase === 'dark') {
          st.th += Math.sin(st.t * 0.9) * 2.5 * wob * dt + (Math.random() - 0.5) * 3 * wob * dt;
          const err = errNow(); st.s = Math.exp(-Math.pow(err / 10, 2)) * (0.7 + Math.random() * 0.3);
          st.shout -= dt;
          if (st.shout <= 0) {
            st.shout = rnd(1.1, 1.6);
            const a = st.th * 0.9;
            if (Math.abs(a) > 8) { let side = a > 0 ? -1 : 1; if (Math.random() < 0.12) side = -side; st.shoutSide = side; st.shoutTxt = pick(side < 0 ? ['LINKS!', 'MEH LINKS!', 'NACH LINKS!'] : ['RECHTS!', 'MEH RECHTS!', 'NACH RECHTS!']); Snd.tone(side < 0 ? 420 : 520, 0.12, 'triangle', 0.05, 0, side < 0 ? -120 : 120); }
            else { st.shoutSide = 0; st.shoutTxt = pick(['HAU ZUE!', 'JETZ!', 'GUET SO!', 'HÜ!']); Snd.tone(470, 0.1, 'triangle', 0.04); }
            st.shoutT = 1;
          }
          st.beat -= dt;
          if (st.beat <= 0) { st.beat = 0.7; const v = 0.02 + st.s * 0.16; Snd.tone(58, 0.12, 'sine', v); Snd.tone(52, 0.1, 'sine', v * 0.8, 0.16); st.pulse = 1; }
          if (st.pulse > 0) st.pulse -= dt * 3;
          if (Math.floor(st.t * 3) % 4 === 0 && Math.random() < dt * 3) Snd.noise(0.08, 0.02, 1400, 0, 'bandpass');
          R(c, 0, 0, W, H, '#040406');
          const glow = (0.04 + st.s * 0.28) * (0.75 + (st.pulse || 0) * 0.25) * (0.85 + Math.random() * 0.3);
          for (let k = 5; k >= 1; k--) E(c, 80, 56, k * 9, k * 6, `rgba(255,200,90,${glow / k})`);
          for (let k = 0; k < 8; k++) if (Math.random() < st.s * 0.5) P(c, 80 + rnd(-20, 20), 56 + rnd(-12, 12), 'rgba(255,230,160,0.6)');
          /* Sehschlitze der Maske */
          R(c, 50, 30, 22, 2, '#0e0c08'); R(c, 88, 30, 22, 2, '#0e0c08');
          if (st.shoutT > 0) { const a = Math.min(1, st.shoutT * 1.5) * 0.7; const col = `rgba(220,210,190,${a})`; if (st.shoutSide < 0) pxText(c, st.shoutTxt, 4, 80, col); else if (st.shoutSide > 0) pxText(c, st.shoutTxt, W - pxTextW(st.shoutTxt) - 4, 80, col); else pxText(c, st.shoutTxt, 80 - pxTextW(st.shoutTxt) / 2, 96, col); }
          R(c, 60, 112, 40, 2, '#141210'); R(c, 60, 112, Math.round(40 * (1 - st.pt / LIMIT)), 2, '#5a4a2a');
          if (st.pt > LIMIT) { info.textContent = 'Der Weibel mahnt: Jetzt hau zue!'; strike(); }
          tEl.textContent = `${Math.max(0, Math.ceil(LIMIT - st.pt))} s`;
          return;
        }
        if (st.phase === 'swing') {
          R(c, 0, 0, W, H, '#040406'); const u = st.pt / 0.45; line(c, 160 * (1 - u), 0, 160 * (1 - u) - 40, 120, `rgba(255,255,255,${1 - u})`);
          if (st.pt > 0.45) {
            st.phase = 'reveal'; st.pt = 0; const r = st.res.result;
            if (r === 'hit') { Snd.sfx('hit'); Snd.sfx('cheer'); Snd.sfx('win'); info.textContent = 'BRAVO! Die Gans ist ab – ein Hieb, ein Treffer! Sursee jubelt.'; for (let k = 0; k < 40; k++) st.conf.push({ x: rnd(0, W), y: rnd(-40, 0), vy: rnd(20, 50), c: pick(['#c8302a', '#ffd23d', '#f4f0e6', '#2f7fb8']) }); }
            else if (r === 'knapp') { Snd.tone(300, 0.1, 'square', 0.06); Snd.sfx('lose'); info.textContent = 'Knapp daneben! Der Säbel streift nur ein paar Federn.'; for (let k = 0; k < 12; k++) st.feathers.push({ x: 80, y: 46, vx: rnd(-30, 30), vy: rnd(-30, 0), t: 0 }); }
            else { Snd.sfx('lose'); info.textContent = 'Luftloch! Der Säbel saust ins Leere – die Leute lachen.'; }
          }
          return;
        }
        /* Enthüllung */
        const r = st.res.result;
        if (r === 'hit') st.fall = Math.min(56, st.fall + dt * (60 + st.fall * 4));
        rathaus(c);
        goose(c, 80, 30, r === 'knapp' ? Math.sin(st.t * 9) * 8 * Math.max(0, 1 - st.pt / 2) : Math.sin(st.t * 2.6) * 2, r === 'hit', st.fall);
        for (const f of st.feathers) { f.t += dt; f.x += f.vx * dt; f.y += f.vy * dt; f.vy = Math.min(14, f.vy + 30 * dt); f.vx *= Math.pow(0.4, dt); R(c, f.x + Math.sin(f.t * 6) * 2, f.y, 3, 1, '#f6f6f2'); }
        crowd(c, r === 'hit', r !== 'hit');
        const off = clamp(st.th * 0.6, -30, 30);
        schlaeger(c, 80 + off, 88, r === 'hit' ? 0.5 : 0.9);
        R(c, 80 + off - 9, 50, 18, 6, '#ffd23d');
        for (const p of st.conf) { p.y += p.vy * dt; p.x += Math.sin(st.t * 3 + p.y) * 0.3; R(c, p.x, p.y, 2, 2, p.c); }
        MSU.ctr(c, r === 'hit' ? 'BRAVO! GANS AB!' : r === 'knapp' ? 'KNAPP DANEBEN!' : 'LUFTLOCH!', 80, 4, r === 'hit' ? '#ffd23d' : '#ffffff', 2, '#3a1a1a');
        if (r !== 'hit') MSU.ctr(c, 'HAHAHA', 30, 76, '#ffffff');
        if (st.pt > 5) { api.finish(st.res); return; }
        tEl.textContent = `Qualität ${st.res.quality}`;
      };
    });
  },

  /* ---------- Sackgumpe: Sackhüpfen gegen drei Kinder – abwechselnd tippen, aber nicht hetzen ---------- */
  sackgumpe(names = ['Elin', 'Timo', 'Thierry']) {
    const W = 160, H = 120, X0 = 30, X1 = 148, LEN = 60, HOP = 1.55, HT = 0.36, sheet = MSU.me();
    const kids = (names && names.length ? names : ['Elin', 'Timo', 'Thierry']).slice(0, 3).map((n, i) => {
      const name = typeof n === 'string' ? n : n.name || 'Kind', seed = [...name].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0;
      const look = typeof n === 'object' && n.look ? n.look : MSU.look(seed, 1);
      return { name, kid: !!look.kid, sheet: getSheet(look), d: 0, hop: 0, wait: 0.2 + i * 0.07, rate: rnd(0.4, 0.5), fall: 0, fin: 0 };
    });
    const sackC = ['#a8844a', '#9a7a44', '#b08c50', '#8a6a3a'];
    return this.run('Sackgumpe', 'Gansabhauet-Spiele vor dem Rathaus', `<canvas aria-label="Sackhüpfen"></canvas><div class="mini-bar"><span id="sgInfo">Abwechselnd links und rechts tippen = hüpfen. Erst wieder tippen, wenn du gelandet bist!</span><b id="sgS"></b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-s="l">◀ Links</button><button data-s="r">Rechts ▶</button></div>`, W, H, (api) => {
      const st = { d: 0, hop: 0, hopLen: HOP, last: null, fall: 0, t: 0, cd: 2.4, fin: 0, place: 0, done: false, end: 0, res: null, msg: '', msgT: 0, falls: 0 };
      const info = api.o.querySelector('#sgInfo'), sEl = api.o.querySelector('#sgS');
      const say = (m, t = 0.8) => { st.msg = m; st.msgT = t; };
      const tap = (s) => {
        if (st.cd > 0 || st.fin || st.fall > 0) return;
        const b = api.o.querySelector(`[data-s="${s}"]`); if (b) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 80); }
        if (st.hop > 0 && st.hop < 0.62) { st.fall = 1.2; st.hop = 0; st.falls++; say('HOPPLA! ZU HASTIG'); Snd.sfx('hit'); Snd.tone(150, 0.2, 'sawtooth', 0.05, 0, -60); return; }
        if (st.hop > 0) { st.queued = s; return; }
        const alt = st.last !== s; st.last = s; st.hop = 0.001; st.hopLen = alt ? HOP : HOP * 0.45;
        if (!alt) say('ABWECHSELN!', 0.5);
        Snd.tone(alt ? 330 : 260, 0.05, 'triangle', 0.05);
      };
      api.o.querySelectorAll('[data-s]').forEach((b) => MSU.tap(b, () => tap(b.dataset.s)));
      MSU.tap(api.cv, (e) => tap(MSU.pos(api, e, W, H)[0] < W / 2 ? 'l' : 'r'));
      Mini.key = (k) => { if (MSU.LEFT.includes(k)) tap('l'); if (MSU.RIGHT.includes(k)) tap('r'); };
      Mini._sack = { st, kids, tap }; /* für Tests */
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        if (st.msgT > 0) st.msgT -= dt;
        if (st.cd > 0) { const a = Math.ceil(st.cd / 0.8); st.cd -= dt; if (Math.ceil(st.cd / 0.8) !== a) Snd.tone(st.cd <= 0 ? 880 : 440, 0.12, 'square', 0.05); if (st.cd <= 0) say('LOS!', 0.7); }
        const run = st.cd <= 0;
        if (run && !st.done) st.t += dt;
        if (run) {
          if (st.fall > 0) st.fall -= dt;
          if (st.hop > 0) { const was = st.hop; st.hop += dt / HT; st.d += st.hopLen * dt / HT; if (st.hop >= 1) { st.hop = 0; Snd.sfx('step'); if (st.queued) { const q = st.queued; st.queued = null; if (was > 0.62) tap(q); } } }
          for (const k of kids) {
            if (k.fin) continue;
            if (k.fall > 0) { k.fall -= dt; continue; }
            if (k.hop > 0) { k.hop += dt / HT; k.d += HOP * dt / HT; if (k.hop >= 1) { k.hop = 0; k.wait = Math.max(0, k.rate - HT + rnd(-0.04, 0.06)); if (Math.random() < 0.03) { k.fall = 1.1; } } }
            else { k.wait -= dt; if (k.wait <= 0) k.hop = 0.001; }
            if (k.d >= LEN) { k.fin = st.t; Snd.tone(600, 0.08, 'square', 0.03); }
          }
          if (!st.fin && st.d >= LEN) { st.fin = st.t; st.place = 1 + kids.filter((k) => k.fin).length; say(st.place === 1 ? 'SIEG!' : st.place + '. PLATZ', 1.6); Snd.sfx(st.place === 1 ? 'win' : 'ok'); if (st.place === 1) Snd.sfx('cheer'); }
          if (!st.done && (st.fin && st.t > st.fin + 1.6 || st.t > 45)) { st.done = true; st.end = 0; if (!st.fin) st.place = 4; st.res = { place: st.place, time: Math.round((st.fin || st.t) * 10) / 10, falls: st.falls }; info.textContent = st.place === 1 ? 'Gewonnen! Die Kinder wollen eine Revanche.' : `${st.place}. Platz – die Kinder sind flink!`; }
          if (st.done) { st.end += dt; if (st.end > 1.2) { api.finish(st.res); return; } }
        }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        for (let y = 0; y < 34; y++) R(c, 0, y, W, 1, mix('#9ab4c8', '#e2eaee', y / 34));
        for (let i = 0; i < 8; i++) { const x = i * 21 - 4, h = 18 + (i * 7) % 10, col = ['#e8d8b0', '#d8b8a0', '#c8d8c0', '#f0e0c0', '#d0c0d8'][i % 5]; R(c, x, 40 - h, 20, h, col); for (let k = 0; k < 6; k++) R(c, x - 1 + k, 40 - h - 6 + k, 22 - k * 2, 1, '#8a3b2a'); R(c, x + 3, 40 - h + 4, 4, 5, '#3a4a5a'); R(c, x + 12, 40 - h + 4, 4, 5, '#3a4a5a'); R(c, x + 2, 40 - h + 4, 1, 5, '#2f6a3a'); R(c, x + 7, 40 - h + 4, 1, 5, '#2f6a3a'); }
        R(c, 0, 40, W, 80, '#7a7468'); for (let y = 42; y < H; y += 4) for (let x = (y % 8 ? 0 : 3); x < W; x += 6) R(c, x, y, 5, 3, '#8a8478');
        for (let x = 0; x < W; x += 5) P(c, x, 39 + (x % 3), '#f4f6f8');
        const lanesY = [58, 74, 90, 108];
        lanesY.forEach((y, i) => { R(c, 0, y - 3, X1, 5, i % 2 ? 'rgba(80,120,60,0.35)' : 'rgba(90,130,70,0.35)'); R(c, X0, y + 2, X1 - X0, 1, 'rgba(255,255,255,0.45)'); });
        R(c, X0, 48, 1, 64, '#f4f0e6'); for (let y = 48; y < 112; y += 4) R(c, X1, y, 2, 2, Math.floor(y / 4) % 2 ? '#1a1a1a' : '#f4f0e6');
        const runner = (sh, d, hop, fall, y, sack, label, me, kid) => {
          const x = X0 - 3 + (Math.min(LEN, d) / LEN) * (X1 - X0 - 12), jy = hop > 0 ? -Math.sin(hop * Math.PI) * 7 : 0, sh2 = kid ? 9 : 12;
          if (label) MSU.txt(c, label, 1, y - 5, me ? '#ffd23d' : '#f4f0e6');
          E(c, x + 9, y + 1, 6, 1.5, 'rgba(0,0,0,0.25)');
          if (fall > 0) { c.save(); c.translate(x + 9, y - 4); c.rotate(-1.4); MSU.spr(c, sh, 'stand', 2, -9, -SPR_H + 6, 1); c.restore(); R(c, x + 2, y - 6, 12, 6, sack); return; }
          MSU.spr(c, sh, 'stand', 2, x, y - SPR_H + 1 + jy, 1);
          R(c, x + 3, y - sh2 + jy, 12, sh2, sack); R(c, x + 3, y - sh2 + jy, 12, 2, shade(sack, 0.2)); R(c, x + 2, y - sh2 + jy, 1, 3, shade(sack, 0.2)); R(c, x + 15, y - sh2 + jy, 1, 3, shade(sack, 0.2)); for (let k = 0; k < 3; k++) P(c, x + 5 + k * 3, y - 4 + jy, shade(sack, -0.25));
        };
        kids.forEach((k, i) => runner(k.sheet, k.d, k.hop, k.fall, lanesY[i], sackC[i], k.name.toUpperCase().slice(0, 6), false, k.kid));
        runner(sheet, st.d, st.hop, st.fall, lanesY[3], sackC[3], 'DU', true);
        if (st.cd > 0) MSU.ctr(c, st.cd > 1.6 ? 'AUF DIE PLÄTZE' : st.cd > 0.8 ? 'FERTIG' : 'LOS', 80, 18, '#ffd23d', 2);
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, 18, st.msg.startsWith('HOPPLA') ? '#ff6a5a' : '#ffd23d', st.msg.length > 10 ? 1 : 2);
        sEl.textContent = st.fin ? `${st.place}. Platz` : `${Math.round(st.d / LEN * 100)} %`;
      };
    });
  },

  /* ---------- Chäszänne: Grimassen schneiden – drei Walzen stoppen, die grässlichste Kombination gewinnt den Käse ---------- */
  chaeszaenne() {
    const W = 160, H = 128, L = G.S.look, skin = lc(L, 'skin'), g = headGeo(effLook(L));
    const REELS = [
      { n: 'AUGEN', o: [['NORMAL', 0], ['ZUGEKNIFFEN', 3], ['AUFGERISSEN', 5], ['SCHIELEN', 8], ['EIN AUGE ZU', 4], ['VERDREHT', 10]] },
      { n: 'MUND', o: [['LÄCHELN', 0], ['SCHNUTE', 4], ['ZÄHNE', 6], ['UNTERBISS', 8], ['O-MUND', 5], ['SAUER', 7]] },
      { n: 'EXTRA', o: [['NICHTS', 0], ['ZUNGE RAUS', 5], ['ZUNGE NASE', 9], ['SCHWEINSNASE', 8], ['ZUNGE SEITE', 6], ['BACKEN AUF', 7]] },
    ];
    REELS.forEach((r) => { r.o = r.o.slice(0, 1).concat(r.o.slice(1).sort(() => Math.random() - 0.5)); });
    const [fc, fx] = canvas(64, 64), [bc, bx] = canvas(64, 64);
    drawPortrait(bx, L, { bg: '#3a2a4a' });
    return this.run('Chäszänne', 'Gansabhauet-Spiele: die grässlichste Grimasse gewinnt', `<canvas aria-label="Grimassen"></canvas><div class="mini-bar"><span id="czInfo">Die Walzen drehen. Tippe dreimal: Augen, Mund, Extra. Je grässlicher, desto besser!</span><b id="czS"></b></div><button class="btn primary" id="czStop" style="height:56px">Stopp!</button>`, W, H, (api) => {
      const st = { t: 0, reel: 0, idx: [0, 0, 0], ph: [0, 0.3, 0.6], stopped: [false, false, false], done: false, end: 0, res: null, laugh: 0, msg: '', msgT: 0 };
      const info = api.o.querySelector('#czInfo'), sEl = api.o.querySelector('#czS');
      const SPEED = [3.4, 3.8, 4.2];
      const slot = (i) => ((Math.floor(st.ph[i]) % 6) + 6) % 6 || 0, cur = (i) => (st.stopped[i] ? st.idx[i] : slot(i));
      const combo = () => { const a = REELS[0].o[cur(0)][0], m = REELS[1].o[cur(1)][0], e = REELS[2].o[cur(2)][0]; let b = 0; if (a === 'SCHIELEN' && e === 'ZUNGE NASE') b += 12; if (a === 'VERDREHT' && e === 'SCHWEINSNASE') b += 10; if (m === 'UNTERBISS' && e === 'BACKEN AUF') b += 6; if (a === 'AUFGERISSEN' && m === 'O-MUND') b += 6; return b; };
      const stop = () => {
        if (st.done) { if (st.end > 0.6) api.finish(st.res); return; }
        if (st.reel > 2) return;
        const i = st.reel; st.idx[i] = slot(i); st.stopped[i] = true; st.reel++;
        Snd.tone(500 + i * 120, 0.08, 'square', 0.06); Snd.sfx('card');
        st.msg = REELS[i].o[st.idx[i]][0]; st.msgT = 0.8;
        if (st.reel >= 3) {
          const sum = st.idx.reduce((a, k, j) => a + REELS[j].o[k][1], 0) + combo();
          const score = Math.round(clamp(sum / 36 * 100 + rnd(-3, 3), 0, 100)), win = score >= 70;
          st.res = { score, win, face: st.idx.map((k, j) => REELS[j].o[k][0]) }; st.done = true; st.end = 0; st.laugh = score / 100;
          info.textContent = win ? `Die Jury kugelt sich vor Lachen: ${score} Punkte – der Käse gehört dir!` : `${score} Punkte. Die Jury schmunzelt nur – da geht noch mehr Grässlichkeit!`;
          Snd.sfx(win ? 'win' : 'ok'); if (win) Snd.sfx('cheer'); MSU.rec('chaes', score);
        }
      };
      api.o.querySelector('#czStop').addEventListener('pointerdown', (e) => { e.preventDefault(); stop(); });
      MSU.tap(api.cv, stop);
      Mini.key = (k) => { if (MSU.ACT.includes(k)) stop(); };
      Mini._chaes = { st, REELS, stop }; /* für Tests */
      /* Gesicht: Porträt plus Grimassenteile */
      const face = (eye, mouth, extra, t) => {
        fx.clearRect(0, 0, 64, 64); fx.drawImage(bc, 0, 0);
        const { cx, ey, my } = g, ln = shade(skin, -0.5), red = '#c84a5a', sk = skin;
        const eyeBox = (ex) => R(fx, ex - 3, ey - 2, 7, 5, sk);
        if (eye !== 'NORMAL') for (const s of [-1, 1]) {
          const ex = cx + s * 6; eyeBox(ex);
          if (eye === 'ZUGEKNIFFEN') { line(fx, ex - 3, ey - 1, ex + 2, ey + 1, ln); line(fx, ex - 3, ey + 1, ex + 2, ey - 1, ln); }
          else if (eye === 'AUFGERISSEN') { E(fx, ex, ey, 3, 3, '#f8f6f0'); E(fx, ex, ey, 1, 1, '#17110e'); }
          else if (eye === 'SCHIELEN') { E(fx, ex, ey, 2, 2, '#f8f6f0'); R(fx, ex - s * 1 - (s > 0 ? 1 : 0), ey - 1, 2, 2, '#17110e'); }
          else if (eye === 'EIN AUGE ZU') { if (s < 0) R(fx, ex - 3, ey, 6, 1, ln); else { E(fx, ex, ey, 3, 3, '#f8f6f0'); R(fx, ex, ey - 1, 2, 2, '#17110e'); } }
          else if (eye === 'VERDREHT') { E(fx, ex, ey, 2.5, 2.5, '#f8f6f0'); R(fx, ex - 1, ey - 3, 2, 1, '#17110e'); }
        }
        const mouthBox = () => R(fx, cx - 6, my - 2, 13, 5, sk);
        if (mouth !== 'LÄCHELN' || extra === 'BACKEN AUF') mouthBox();
        if (mouth === 'SCHNUTE') { E(fx, cx, my, 2, 2, red); P(fx, cx, my, '#5a1e1e'); }
        else if (mouth === 'ZÄHNE') { R(fx, cx - 5, my - 1, 11, 3, '#5a1e1e'); R(fx, cx - 4, my - 1, 9, 1, '#f4efe4'); R(fx, cx - 4, my + 1, 9, 1, '#f4efe4'); for (let k = -3; k <= 3; k += 2) P(fx, cx + k, my, '#c8c0b0'); }
        else if (mouth === 'UNTERBISS') { R(fx, cx - 4, my - 1, 9, 1, ln); R(fx, cx - 4, my, 9, 2, red); R(fx, cx - 3, my - 2, 2, 1, '#f4efe4'); R(fx, cx + 2, my - 2, 2, 1, '#f4efe4'); }
        else if (mouth === 'O-MUND') { E(fx, cx, my, 3, 3, red); E(fx, cx, my, 2, 2, '#3a0e0e'); }
        else if (mouth === 'SAUER') { R(fx, cx - 3, my, 7, 1, ln); P(fx, cx - 4, my + 1, ln); P(fx, cx + 4, my + 1, ln); P(fx, cx - 5, my + 2, ln); P(fx, cx + 5, my + 2, ln); }
        const wag = Math.sin(t * 8) * 1;
        if (extra === 'ZUNGE RAUS') { R(fx, cx - 2, my + 1, 5, 5 + wag, '#e8606a'); R(fx, cx, my + 2, 1, 3, '#c8404a'); }
        else if (extra === 'ZUNGE NASE') { R(fx, cx - 2, my - 6, 5, 7, '#e8606a'); E(fx, cx, my - 7, 2, 1, '#e8606a'); R(fx, cx, my - 5, 1, 4, '#c8404a'); }
        else if (extra === 'SCHWEINSNASE') { E(fx, cx, ey + 5, 3, 2, mix(skin, '#e8a0a0', 0.5)); P(fx, cx - 1, ey + 5, '#3a1a1a'); P(fx, cx + 1, ey + 5, '#3a1a1a'); line(fx, cx, ey + 7, cx, ey + 10, shade(skin, -0.3)); }
        else if (extra === 'ZUNGE SEITE') { R(fx, cx + 3, my, 4, 3, '#e8606a'); P(fx, cx + 6, my + 3 + Math.round(wag), '#e8606a'); }
        else if (extra === 'BACKEN AUF') { for (const s of [-1, 1]) E(fx, cx + s * 8, my - 2, 4, 3, shade(skin, 0.08)); R(fx, cx - 1, my, 3, 1, ln); }
      };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; if (st.msgT > 0) st.msgT -= dt;
        for (let i = 0; i < 3; i++) if (!st.stopped[i]) st.ph[i] += dt * SPEED[i] * (i === st.reel ? 1 : 0.6);
        if (st.done) { st.end += dt; if (st.end > 3.8) { api.finish(st.res); return; } }
        const c = api.ctx;
        R(c, 0, 0, W, H, '#2a1e30');
        face(REELS[0].o[cur(0)][0], REELS[1].o[cur(1)][0], REELS[2].o[cur(2)][0], st.t);
        const shake = st.done ? Math.sin(st.t * 20) * st.laugh * 1.5 : 0;
        c.drawImage(fc, 6, 2, 52, 62, Math.round(shake), 4, 104, 124);
        /* Walzen */
        for (let i = 0; i < 3; i++) {
          const y = 6 + i * 30, x = 106, active = i === st.reel && !st.done;
          R(c, x - 2, y - 2, 54, 28, active ? '#ffd23d' : '#5a4a6a'); R(c, x, y, 50, 24, '#f4f0e6');
          pxText(c, REELS[i].n, x + 2, y + 2, '#8a7a9a');
          const k = cur(i), name = REELS[i].o[k][0], nxt = REELS[i].o[(k + 1) % 6][0];
          const off = st.stopped[i] ? 0 : (st.ph[i] % 1) * 8;
          c.save(); c.beginPath(); c.rect(x, y + 9, 50, 13); c.clip();
          pxText(c, name, x + 25 - pxTextW(name) / 2, y + 13 + Math.round(off), st.stopped[i] ? '#c8302a' : '#1a1a2e');
          if (!st.stopped[i]) pxText(c, nxt, x + 25 - pxTextW(nxt) / 2, y + 5 + Math.round(off), '#1a1a2e');
          c.restore();
          if (st.stopped[i]) for (let s = 0; s < REELS[i].o[k][1] / 2; s++) P(c, x + 3 + s * 3, y + 22, '#c8302a');
        }
        /* Jury */
        for (let j = 0; j < 3; j++) {
          const x = 112 + j * 16, y = 104, lg = st.done ? st.laugh : 0, jj = lg > 0.4 ? Math.abs(Math.sin(st.t * 12 + j)) * lg * 3 : 0;
          E(c, x, y - jj, 6, 6, ['#f2d0b0', '#c89a72', '#e8b890'][j]); R(c, x - 6, y + 6, 12, 12, ['#2f5fb8', '#3f8e4b', '#7a2f3a'][j]); R(c, x - 6, y - 7 - jj, 12, 3, ['#5a3a24', '#c8c8c8', '#2a2a2a'][j]);
          P(c, x - 2, y - 2 - jj, '#1a1a1a'); P(c, x + 2, y - 2 - jj, '#1a1a1a');
          if (lg > 0.6) R(c, x - 2, y + 2 - jj, 5, 2, '#5a1e1e'); else if (lg > 0.3) R(c, x - 2, y + 2 - jj, 5, 1, '#5a1e1e'); else R(c, x - 1, y + 2 - jj, 3, 1, '#5a1e1e');
          if (lg > 0.6 && Math.floor(st.t * 4 + j) % 2) pxText(c, 'HA', x - 3, y - 18 - jj, '#ffd23d');
        }
        if (st.done) { MSU.txt(c, `${st.res.score}`, 8, 6, st.res.win ? '#7af0a0' : '#ffd23d', 2); if (st.res.win) { E(c, 92, 116, 9, 5, '#f2c84a'); E(c, 92, 115, 8, 4, '#ffd86a'); P(c, 88, 115, '#e8b030'); P(c, 94, 117, '#e8b030'); } }
        if (st.msgT > 0 && !st.done) MSU.ctr(c, st.msg, 52, 118, '#ffd23d');
        sEl.textContent = st.done ? `${st.res.score} Punkte` : `Walze ${st.reel + 1}/3`;
      };
    });
  },

  /* ---------- Stangechlädere: an der geschälten Tanne hochklettern bis zum Preiskranz ---------- */
  stange() {
    const W = 160, H = 128, TOP = 10, LIMIT = 25, GY = 120, PT = 22, sheet = MSU.me(), wob = Mini.wob();
    const perTap = 0.42 * (0.75 + Math.min(1, G.S.st.energy / 100) * 0.3), px = (h) => GY - 8 - h / TOP * (GY - PT - 16);
    return this.run('Stangechlädere', 'Gansabhauet-Spiele vor dem Rathaus', `<canvas aria-label="Stange klettern"></canvas><div class="mini-bar"><span id="stInfo">Abwechselnd links und rechts greifen – im Takt, nicht hetzen! Wer nicht greift, rutscht.</span><b id="stS">0,0 m</b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-c="l">◀ Links</button><button data-c="r">Rechts ▶</button></div>`, W, H, (api) => {
      const st = { h: 0, last: null, since: 9, t: 0, slip: 0, done: false, end: 0, res: null, msg: '', msgT: 0, pose: 0, best: 0, started: false, grab: 0 };
      const info = api.o.querySelector('#stInfo'), sEl = api.o.querySelector('#stS');
      const say = (m, t = 0.7) => { st.msg = m; st.msgT = t; };
      const grab = (s) => {
        if (st.done) return;
        const b = api.o.querySelector(`[data-c="${s}"]`); if (b) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 80); }
        st.started = true;
        const fast = 0.17 + (wob - 1) * 0.05;
        if (st.since < fast) { st.h = Math.max(0, st.h - 0.5); st.slip = 0.4; say('ZU HASTIG!'); Snd.tone(200, 0.15, 'sawtooth', 0.05, 0, -80); }
        else if (st.last === s) { st.h = Math.max(0, st.h - 0.25); st.slip = 0.3; say('ANDERE HAND!'); Snd.sfx('error'); }
        else { st.h = Math.min(TOP, st.h + perTap * (st.since < 0.75 ? 1 : 0.7)); st.pose = 1 - st.pose; st.grab = 0.15; Snd.tone(300 + st.h * 30, 0.05, 'triangle', 0.05); if (st.since >= 0.24 && st.since <= 0.6) say('GUET!', 0.3); }
        st.last = s; st.since = 0; st.best = Math.max(st.best, st.h);
      };
      api.o.querySelectorAll('[data-c]').forEach((b) => MSU.tap(b, () => grab(b.dataset.c)));
      MSU.tap(api.cv, (e) => grab(MSU.pos(api, e, W, H)[0] < W / 2 ? 'l' : 'r'));
      Mini.key = (k) => { if (MSU.LEFT.includes(k)) grab('l'); if (MSU.RIGHT.includes(k)) grab('r'); };
      Mini._stange = { st, grab }; /* für Tests */
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        if (st.msgT > 0) st.msgT -= dt; if (st.slip > 0) st.slip -= dt; if (st.grab > 0) st.grab -= dt;
        if (!st.done) {
          if (st.started) st.t += dt; st.since += dt;
          if (st.started && st.since > 0.9 && st.h > 0) { st.h = Math.max(0, st.h - 0.6 * dt); if (Math.random() < dt * 4) Snd.noise(0.05, 0.03, 1200); }
          if (st.h >= TOP) { st.done = true; st.end = 0; st.res = { top: true, height: TOP, time: Math.round(st.t * 10) / 10 }; Snd.sfx('win'); Snd.sfx('cheer'); info.textContent = `Ganz oben! Der Preiskranz gehört dir (${MSU.sec(st.t)}).`; MSU.rec('stange', st.res.time, true); }
          else if (st.t >= LIMIT) { st.done = true; st.end = 0; st.res = { top: false, height: Math.round(st.best * 10) / 10, time: LIMIT }; Snd.sfx('lose'); info.textContent = `Die Kräfte sind weg … ${String(st.res.height).replace('.', ',')} m geschafft.`; }
        } else { st.end += dt; if (!st.res.top) st.h = Math.max(0, st.h - dt * 4); if (st.end > 2.6) { api.finish(st.res); return; } }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        for (let y = 0; y < 70; y++) R(c, 0, y, W, 1, mix('#93b0c8', '#e6edf0', y / 70));
        for (let i = 0; i < 9; i++) { const x = i * 19 - 6, h = 40 + (i * 13) % 26, col = ['#e8d8b0', '#d8b8a0', '#c8d8c0', '#f0e0c0', '#d0c0d8', '#e8c8a8'][i % 6]; R(c, x, 96 - h, 18, h, col); for (let k = 0; k < 7; k++) R(c, x - 1 + k, 96 - h - 7 + k, 20 - k * 2, 1, '#8a3b2a'); R(c, x + 2, 96 - h - 6, 14, 1, '#f4f6f8'); for (let r2 = 0; r2 < 3; r2++) for (let k = 0; k < 2; k++) { R(c, x + 3 + k * 8, 96 - h + 6 + r2 * 11, 4, 6, '#3a4a5a'); R(c, x + 2 + k * 8, 96 - h + 6 + r2 * 11, 1, 6, '#2f6a3a'); R(c, x + 7 + k * 8, 96 - h + 6 + r2 * 11, 1, 6, '#2f6a3a'); } }
        for (let x = 0; x < W; x += 12) { line(c, x, 40, x + 6, 44, '#5a5a5a'); R(c, x + 3, 41, 3, 4, ['#c8302a', '#f4f0e6', '#ffd23d'][(x / 12) % 3]); }
        R(c, 0, 96, W, 32, '#8a8478'); for (let y = 98; y < H; y += 4) for (let x = (y % 8) ? 0 : 3; x < W; x += 6) R(c, x, y, 5, 3, '#9a9488');
        /* Tanne, geschält */
        R(c, 77, PT, 6, GY - PT, '#e8d4b0'); R(c, 77, PT, 2, GY - PT, '#f4e6c8'); R(c, 82, PT, 1, GY - PT, '#c8b088'); for (let y = PT + 6; y < GY; y += 13) { E(c, 80 + (y % 2 ? 1 : -1), y, 1, 1, '#a8885a'); }
        R(c, 74, GY - 4, 12, 4, '#6a5a3a');
        for (let m = 2; m <= 8; m += 2) { const y = px(m) + 22; R(c, 86, y, 3, 1, '#1a1a2e'); pxText(c, m + 'M', 90, y - 2, '#1a1a2e'); }
        /* Preiskranz */
        const ky = PT - 4; c.strokeStyle = '#2f6a2a'; c.lineWidth = 3; c.beginPath(); c.ellipse(80, ky, 14, 4, 0, 0, 6.29); c.stroke(); c.lineWidth = 1;
        for (let k = 0; k < 10; k++) { const a = k / 10 * 6.29; P(c, 80 + Math.cos(a) * 14, ky + Math.sin(a) * 4, '#4a8a3a'); }
        R(c, 66, ky + 2, 2, 8, '#a85a3a'); R(c, 70, ky + 3, 2, 7, '#a85a3a'); R(c, 89, ky + 2, 3, 9, '#2a5a3a'); R(c, 90, ky, 1, 2, '#c9a227'); E(c, 94, ky + 6, 3, 3, '#a8603a'); P(c, 94, ky + 5, '#f4f0e6'); R(c, 75, ky + 3, 2, 6, '#c8302a');
        if (st.done && st.res.top) for (let k = 0; k < 8; k++) { const a = st.t * 3 + k * 0.8; P(c, 80 + Math.cos(a) * 20, ky + Math.sin(a) * 8, '#ffd23d'); }
        /* Zuschauer */
        for (let k = 0; k < 9; k++) { const x = 4 + k * 17 + (k > 4 ? 10 : 0), y = 112, j = st.done && st.res.top ? Math.abs(Math.sin(st.t * 10 + k)) * 3 : 0; if (Math.abs(x - 80) < 14) continue; R(c, x, y - j, 7, 14, ['#2a3a5a', '#5a2a2a', '#3a4a3a', '#c8302a', '#6a5a3a'][k % 5]); E(c, x + 3, y - 3 - j, 3, 3, ['#f2d0b0', '#c89a72', '#e8b890'][k % 3]); R(c, x, y - 7 - j, 7, 2, ['#c8302a', '#2a2a2a', '#ffd23d', '#2f5fb8'][k % 4]); }
        /* Kletterer: Rückenansicht an der Stange */
        const yy = px(st.h) + (st.slip > 0 ? Math.sin(st.t * 40) * 1 : 0);
        MSU.spr(c, sheet, st.pose ? 'walkA' : 'walkB', 3, 80 - SPR_W / 2, yy, 1);
        const skin2 = lc(G.S.look, 'skin');
        R(c, st.pose ? 74 : 83, yy + 4 - (st.grab > 0 ? 2 : 0), 3, 3, skin2); R(c, st.pose ? 83 : 74, yy + 9, 3, 3, skin2);
        /* Taktanzeige */
        R(c, 4, 6, 50, 6, '#10161f'); R(c, 4 + 0.24 / 1 * 50, 6, (0.6 - 0.24) * 50, 6, '#2a6a3a'); R(c, 4 + Math.min(1, st.since) * 50 - 1, 4, 2, 10, '#ffffff'); MSU.txt(c, 'TAKT', 5, 14, '#1a1a2e', 1, 'rgba(0,0,0,0)');
        R(c, 106, 6, 50, 4, '#10161f'); R(c, 106, 6, Math.round(50 * Math.max(0, 1 - st.t / LIMIT)), 4, '#ffb53d');
        if (st.msgT > 0) MSU.ctr(c, st.msg, 120, 16, st.msg === 'GUET!' ? '#3fae4a' : '#c8302a', 1, '#f4f0e6');
        if (st.done) MSU.ctr(c, st.res.top ? 'GANZ OBEN!' : 'RUNTERGERUTSCHT', 80, 54, st.res.top ? '#ffd23d' : '#f4f0e6', 2, '#3a1a1a');
        sEl.textContent = `${st.h.toFixed(1).replace('.', ',')} m · ${Math.max(0, Math.ceil(LIMIT - st.t))} s`;
      };
    });
  },

  /* ---------- Rhythmus: Konzert der Stubete Gäng (Samichlaus Tour) in der Stadthalle oder Guuggen-Probe der Diebetormtöibeler unter dem Untertor ---------- */
  rhythm(kind = 'konzert') {
    const guugge = kind === 'guugge', W = 160, H = 140;
    const lanes = guugge ? ['🥁', '🪘', '🎺', '📯'] : ['👏', '⬇', '🙌', '🎉'];
    const names = guugge ? ['Pauke', 'Trommle', 'Trompete', 'Sousaphon'] : ['Klatschen', 'Hüpfen', 'Hände hoch', 'Jubeln'];
    return this.run(guugge ? 'Guuggen-Probe' : 'Konzert', guugge ? 'Diebetormtöibeler unter dem Untertor' : 'Stubete Gäng · Samichlaus Tour in der Stadthalle', `<canvas aria-label="${guugge ? 'Guuggenmusig' : 'Konzert'}"></canvas><div class="mini-bar"><span id="rInfo">Drück die Spur, wenn das Zeichen die Linie trifft. ${names.join(' · ')}</span><b id="rScore">0 %</b></div><div class="lanes">${lanes.map((l, i) => `<button data-l="${i}" aria-label="${names[i]}">${l}</button>`).join('')}</div>`, W, H, (api) => {
      const bpm = guugge ? 108 : 124, beat = 60 / bpm, notes = [];
      const r = rng((Math.random() * 1e9) | 0);
      const add = (b, l) => { if (!notes.some((n) => Math.abs(n.t - b * beat) < 0.01 && n.l === l)) notes.push({ t: b * beat, l }); };
      if (guugge) {
        /* Guuggen-Groove: Pauke auf 1 und 3, Trommle dazwischen, Sousaphon-Bass, Trompeten-Stösse */
        for (let b = 4; b < 36; b++) {
          const m = b % 4;
          if (m === 0 || (m === 2 && r() < 0.6)) add(b, 0);
          if (m === 1 || m === 3) { if (r() < 0.7) add(b, 1); }
          if (b > 8 && m === 0 && r() < 0.6) add(b + 0.5, 3); else if (m === 2 && r() < 0.35) add(b, 3);
          if (b > 12 && (b % 8 === 6 || b % 8 === 7) && r() < 0.8) add(b + (r() < 0.4 ? 0.5 : 0), 2);
        }
        add(36, 0); add(36, 2);
      } else {
        /* Strophe: klatschen auf 2 und 4 · Refrain: Hände hoch und hüpfen · Schluss: Ballade mit Handylichtern */
        for (let b = 4; b < 16; b++) if (b % 2) add(b, 0);
        for (let b = 16; b < 32; b++) { const m = b % 4; if (m === 0) add(b, 2); if (m === 2) add(b, 1); if (m === 3 && r() < 0.7) add(b, 0); if (b > 24 && m === 1 && r() < 0.5) add(b, 3); }
        for (let b = 32; b < 44; b += 2) add(b, b % 4 ? 3 : 2);
        add(44, 3);
      }
      notes.sort((a, b) => a.t - b.t);
      const travel = 1.8, BALLAD = guugge ? 1e9 : 32 * beat;
      let win = 0.15, good = 0.28;
      const p = G.S.st.prom; if (p > 1) { win *= 0.85; good *= 0.85; } if (p > 1.8) { win *= 0.75; good *= 0.8; } if (G.S.st.energy < 25) win *= 0.85;
      let pts = 0, t = -2.0, judge = '', jt = 0, combo = 0, lastBeat = -1, hype = 0;
      const sound = (l) => {
        if (guugge) { if (l === 0) { Snd.tone(62, 0.3, 'sine', 0.22, 0, -20); Snd.noise(0.08, 0.08, 300); } else if (l === 1) Snd.noise(0.09, 0.14, 2600, 0, 'bandpass'); else if (l === 2) { const f = pick([523, 587, 659, 784]); Snd.tone(f, 0.16, 'sawtooth', 0.05); Snd.tone(f * 1.5, 0.16, 'square', 0.02); } else Snd.tone(pick([73, 82, 98, 110]), 0.24, 'triangle', 0.16); }
        else { if (l === 0) { Snd.noise(0.05, 0.14, 3200, 0, 'highpass'); Snd.noise(0.04, 0.08, 1800, 0.03, 'bandpass'); } else if (l === 1) Snd.tone(80, 0.12, 'sine', 0.14, 0, -30); else if (l === 2) Snd.tone(660, 0.1, 'triangle', 0.05, 0, 200); else Snd.sfx('cheer'); }
      };
      const hit = (l) => {
        const btn = api.o.querySelector(`[data-l="${l}"]`); if (btn) { btn.classList.add('hit'); setTimeout(() => btn.classList.remove('hit'), 90); }
        let best = null, bd = 9;
        for (const n of notes) if (!n.done && n.l === l) { const d = Math.abs(n.t - t); if (d < bd) { bd = d; best = n; } }
        if (best && bd < good) { best.done = true; const pf = bd < win; pts += pf ? 100 : 75; judge = pf ? 'PERFEKT!' : 'GUT'; combo++; hype = Math.min(1, hype + 0.08); sound(l); }
        else { judge = 'DANEBEN'; combo = 0; hype = Math.max(0, hype - 0.1); if (guugge) Snd.tone(110, 0.1, 'sawtooth', 0.04, 0, -40); }
        jt = 0.5;
      };
      api.o.querySelectorAll('[data-l]').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); hit(+b.dataset.l); }));
      api.cv.addEventListener('pointerdown', (e) => { e.preventDefault(); hit(clamp(Math.floor(MSU.pos(api, e, W, H)[0] / 40), 0, 3)); });
      Mini.key = (k) => { const m = { ArrowLeft: 0, KeyA: 0, ArrowDown: 1, KeyS: 1, ArrowUp: 2, KeyW: 2, ArrowRight: 3, KeyD: 3 }; if (k in m) hit(m[k]); };
      Mini._rhythm = { notes, now: () => t, hit }; /* für Tests */
      const sheet = MSU.me(), LW = 40, ly = 120;
      const LANE_COL = guugge ? ['#e8602a', '#ffd23d', '#f4d03a', '#c9a227'] : ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7aff6a'];
      const icon = (c, l, x, y, col) => {
        if (guugge) { if (l === 0) { E(c, x + 3, y + 3, 4, 3, col); R(c, x - 1, y + 2, 9, 1, '#1a1a1a'); } else if (l === 1) { R(c, x, y + 1, 7, 5, col); line(c, x - 1, y - 1, x + 3, y + 2, '#1a1a1a'); } else if (l === 2) { R(c, x - 1, y + 2, 6, 2, col); E(c, x + 6, y + 3, 2, 3, col); } else { c.strokeStyle = col; c.beginPath(); c.arc(x + 3, y + 3, 4, 0, 6.29); c.stroke(); } return; }
        if (l === 0) { R(c, x, y, 3, 6, col); R(c, x + 4, y, 3, 6, col); } else if (l === 1) { for (let k = 0; k < 4; k++) R(c, x + 3 - k, y + 6 - k, k * 2 + 1, 1, col); } else if (l === 2) { R(c, x, y, 2, 7, col); R(c, x + 5, y, 2, 7, col); R(c, x + 1, y + 4, 5, 3, col); } else { for (let k = 0; k < 4; k++) { const a = k * 1.57 + 0.78; line(c, x + 3, y + 3, x + 3 + Math.cos(a) * 4, y + 3 + Math.sin(a) * 4, col); } P(c, x + 3, y + 3, col); }
      };
      const bandMember = (c, x, y, body, headC, inst, bt) => {
        const bob = bt % 2 ? 1 : 0;
        R(c, x - 3, y - 10 + bob, 7, 10, body); E(c, x, y - 13 + bob, 3, 3, headC); R(c, x - 3, y, 2, 4, '#1a1a2e'); R(c, x + 2, y, 2, 4, '#1a1a2e');
        if (inst === 'gitarre') { line(c, x - 4, y - 4 + bob, x + 7, y - 9 + bob, '#c9a227'); E(c, x - 3, y - 3 + bob, 3, 2, '#a8602a'); }
        if (inst === 'oergeli') { R(c, x - 4, y - 8 + bob, 8, 5, '#c8302a'); for (let k = 0; k < 4; k++) P(c, x - 3 + k * 2, y - 7 + bob, '#f4f0e6'); }
        if (inst === 'mikro') { line(c, x + 3, y - 12 + bob, x + 5, y - 2, '#8a8c90'); R(c, x + 2, y - 14 + bob, 2, 2, '#3a3c40'); }
        if (inst === 'pauke') { E(c, x, y - 4 + bob, 6, 5, '#c8302a'); E(c, x, y - 6 + bob, 5, 2, '#f4f0e6'); }
        if (inst === 'trompete') { R(c, x + 2, y - 12 + bob, 7, 2, '#ffd23d'); E(c, x + 9, y - 11 + bob, 2, 2, '#ffd23d'); }
        if (inst === 'sousa') { c.strokeStyle = '#e8c23a'; c.beginPath(); c.arc(x, y - 8 + bob, 6, 0, 6.29); c.stroke(); E(c, x + 3, y - 18 + bob, 5, 3, '#ffd23d'); E(c, x + 3, y - 18 + bob, 3, 2, '#8a6a10'); }
        if (inst === 'trommle') { R(c, x - 4, y - 5 + bob, 8, 5, '#2f5fb8'); R(c, x - 4, y - 5 + bob, 8, 1, '#f4f0e6'); }
      };
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        t += dt; jt -= dt; hype = Math.max(0, hype - dt * 0.03);
        const c = api.ctx;
        const bt = Math.floor(t / beat);
        if (bt !== lastBeat && t >= 0) { lastBeat = bt; Snd.tone(bt % 4 === 0 ? 1400 : 900, 0.025, 'square', bt % 4 === 0 ? 0.05 : 0.03); if (guugge && bt % 2 === 0) Snd.tone(55, 0.08, 'sine', 0.06); }
        const ballad = t > BALLAD;
        /* ---- Bühne / Untertor ---- */
        if (guugge) {
          for (let y = 0; y < 70; y++) R(c, 0, y, W, 1, mix('#1a2040', '#4a4a6a', y / 70));
          R(c, 40, 0, 80, 74, '#b8a888'); R(c, 40, 0, 80, 3, '#d8ccb0'); for (let y = 6; y < 74; y += 6) for (let x = 40 + (y % 12 ? 0 : 5); x < 120; x += 10) R(c, x, y, 9, 1, '#a89878');
          E(c, 80, 30, 20, 16, '#1a1420'); R(c, 60, 30, 40, 44, '#1a1420'); R(c, 60, 30, 40, 44, 'rgba(255,200,120,0.08)');
          E(c, 80, 10, 6, 6, '#f4f0e6'); line(c, 80, 10, 80, 6, '#1a1a1a'); line(c, 80, 10, 83, 11, '#1a1a1a');
          R(c, 0, 40, 40, 34, '#c8b89a'); R(c, 120, 40, 40, 34, '#d8c0a8'); for (let k = 0; k < 2; k++) { R(c, 8 + k * 16, 48, 8, 10, '#ffd27a'); R(c, 128 + k * 16, 48, 8, 10, '#ffd27a'); }
          MSU.ctr(c, 'DIEBETORMTÖIBELER', 80, 76, '#ffd23d');
          const band = [['#7a2f8a', 'pauke'], ['#2f7f3a', 'trommle'], ['#c8302a', 'trompete'], ['#2f5fb8', 'sousa'], ['#e8602a', 'trompete']];
          band.forEach(([col, inst], i) => { const x = 22 + i * 29; bandMember(c, x, 70, col, ['#ffd23d', '#7af0a0', '#ff6ad0', '#6ae0ff', '#ffb53d'][i], inst, bt + i); R(c, x - 3, 53 + (bt + i) % 2, 7, 3, '#1a1a1a'); });
          for (let k = 0; k < 10; k++) { const x = 4 + k * 16, j = hype > 0.3 && (bt + k) % 2 ? 2 : 0; E(c, x, 100 - j, 4, 4, '#2a2030'); E(c, x, 94 - j, 3, 3, '#3a2a3a'); }
        } else {
          R(c, 0, 0, W, 86, ballad ? '#08060e' : '#120a1e');
          if (!ballad) for (let k = 0; k < 4; k++) { const a = Math.sin(t * 0.9 + k * 1.7) * 0.5; c.fillStyle = ['rgba(255,58,208,0.13)', 'rgba(58,224,255,0.13)', 'rgba(255,224,58,0.12)', 'rgba(122,255,106,0.12)'][k]; c.beginPath(); c.moveTo(20 + k * 40, 0); c.lineTo(20 + k * 40 + Math.sin(a) * 60 - 16, 86); c.lineTo(20 + k * 40 + Math.sin(a) * 60 + 16, 86); c.closePath(); c.fill(); }
          R(c, 10, 2, 140, 10, '#2a1a3a'); MSU.ctr(c, 'STUBETE GÄNG', 80, 5, ballad ? '#8a7a9a' : '#ffd23d'); if (t < 1) MSU.ctr(c, 'SAMICHLAUS TOUR', 80, 15, '#ff6a5a');
          R(c, 0, 52, W, 6, '#3a2a4a'); R(c, 0, 52, W, 1, '#6a5a7a');
          const band = [['#3a3c40', '#c8302a', 'gitarre'], ['#f4f0e6', '#2a2a2a', 'mikro'], ['#2f5f8a', '#ffd23d', 'oergeli'], ['#5a3a24', '#2f7f3a', 'trommle']];
          band.forEach(([col, hc, inst], i) => bandMember(c, 30 + i * 33, 52, col, hc === '#c8302a' ? '#f2d0b0' : '#e8b890', inst, bt + i));
          for (let k = 0; k < 12; k++) { const x = 4 + k * 14, up = !ballad && hype > 0.25 && (bt + k) % 2, j = up ? 2 : 0; E(c, x, 84 - j, 5, 5, '#1a1424'); E(c, x, 77 - j, 3, 3, '#2a2034'); if (up) { R(c, x - 5, 68 - j, 1, 6, '#2a2034'); R(c, x + 5, 68 - j, 1, 6, '#2a2034'); } if (ballad) { const sw = Math.sin(t * 1.6 + k * 0.5) * 3; R(c, x + sw - 1, 64, 2, 3, k % 3 ? '#e8f4ff' : '#ffd27a'); E(c, x + sw, 64, 3, 2, 'rgba(232,244,255,0.18)'); } }
          if (ballad) MSU.ctr(c, 'HANDYLICHTER!', 80, 30, '#e8f4ff');
        }
        /* ---- Spuren ---- */
        c.drawImage(sheet, (bt % 2 ? 5 : 6) * SPR_W, 3 * SPR_H, SPR_W, SPR_H, 71, 100, SPR_W, SPR_H);
        for (let i = 0; i < 4; i++) R(c, i * LW, 86, LW, H - 86, i % 2 ? 'rgba(26,22,38,0.55)' : 'rgba(23,19,34,0.55)');
        for (let i = 0; i < 4; i++) R(c, i * LW, 0, LW, 86, 'rgba(0,0,0,0.12)');
        R(c, 0, ly, 160, 2, '#f2eee4');
        for (let i = 0; i < 4; i++) { R(c, i * LW + 4, ly - 1, LW - 8, 4, 'rgba(255,255,255,0.12)'); icon(c, i, i * LW + LW / 2 - 3, ly + 6, LANE_COL[i]); }
        for (const n of notes) {
          if (n.done) continue;
          const dtn = n.t - t;
          if (dtn < -good) { n.done = true; n.miss = true; combo = 0; judge = 'VERPASST'; jt = 0.4; hype = Math.max(0, hype - 0.05); continue; }
          if (dtn > travel) continue;
          const y = ly - (dtn / travel) * ly, x = n.l * LW + 6;
          R(c, x, y - 4, LW - 12, 8, LANE_COL[n.l]); R(c, x + 2, y - 3, LW - 16, 1, '#ffffff');
          icon(c, n.l, n.l * LW + LW / 2 - 3, y - 3, '#120f1a');
        }
        if (jt > 0) MSU.ctr(c, judge, 80, 90, judge === 'DANEBEN' || judge === 'VERPASST' ? '#e2554a' : '#ffb53d');
        if (combo > 3) MSU.ctr(c, combo + 'X', 80, 100, '#7af0e0');
        if (t < 0) MSU.ctr(c, guugge ? 'EINS ZWEI' : 'HALLO SURSEE', 80, 60, '#ffb53d', 2);
        const pct = Math.round((pts / (notes.length * 100)) * 100);
        api.o.querySelector('#rScore').textContent = pct + ' %';
        if (t > notes[notes.length - 1].t + 1) { MSU.rec(guugge ? 'guugge' : 'konzert', pct); api.finish({ pct }); UI.toast(guugge ? `Guuggen-Probe: ${pct} %` : `Konzert: ${pct} %`, pct >= 80 ? 'ach' : ''); }
      };
    });
  },

  /* ---------- Metalldetektor im römischen Vicus: absuchen, piepsen lassen, dreimal graben ---------- */
  detektor() {
    const W = 160, H = 120, LIMIT = 50;
    const coin = [rnd(30, 130), rnd(36, 100)];
    const junk = [0, 1, 2].map((k) => ({ x: rnd(16, 144), y: rnd(30, 106), n: ['einen Kronkorken', 'einen rostigen Nagel', 'eine alte Büchse'][k] })).filter((j) => Math.hypot(j.x - coin[0], j.y - coin[1]) > 30);
    return this.run('Metalldetektor', 'Römischer Vicus westlich der Altstadt', `<canvas aria-label="Metalldetektor"></canvas><div class="mini-bar"><span id="mdInfo">Schwenke den Detektor über die Wiese. Je schneller es piepst, desto näher. Drei Mal graben!</span><b id="mdS">3 × graben</b></div><button class="btn primary" id="mdDig" style="height:52px">Hier graben</button>`, W, H, (api) => {
      const st = { x: 80, y: 66, tx: null, ty: null, t: 0, beep: 0, digs: 3, holes: [], found: false, done: false, end: 0, res: null, msg: '', msgT: 0, sig: 0, digT: 0 };
      const hold = MSU.hold(api, { l: MSU.LEFT, r: MSU.RIGHT, u: MSU.UP, d: MSU.DOWN });
      const info = api.o.querySelector('#mdInfo'), sEl = api.o.querySelector('#mdS');
      const signal = (x, y) => { const dc = Math.hypot(x - coin[0], y - coin[1]); let s = clamp(1 - dc / 60, 0, 1); for (const j of junk) if (!j.dug) s = Math.max(s, clamp(1 - Math.hypot(x - j.x, y - j.y) / 26, 0, 1) * 0.55); return s; };
      const dig = () => {
        if (st.done) { if (st.end > 0.6) api.finish(st.res); return; }
        if (st.digs <= 0 || st.digT > 0) return;
        st.digs--; st.digT = 0.6; Snd.noise(0.2, 0.12, 500); Snd.noise(0.15, 0.1, 400, 0.25);
        const h = { x: st.x, y: st.y, what: null };
        if (Math.hypot(st.x - coin[0], st.y - coin[1]) < 7) { h.what = 'coin'; st.found = true; }
        else { const j = junk.find((j2) => !j2.dug && Math.hypot(st.x - j2.x, st.y - j2.y) < 7); if (j) { j.dug = true; h.what = 'junk'; h.n = j.n; } }
        st.holes.push(h);
        setTimeout(() => {
          if (!api.cv.isConnected) return;
          if (h.what === 'coin') { Snd.sfx('win'); info.textContent = 'Eine römische Münze! Ein Denar, fast 2000 Jahre alt – der Vicus von Sursee lässt grüssen.'; st.msg = 'MÜNZE!'; }
          else if (h.what === 'junk') { Snd.sfx('error'); info.textContent = `Nur ${h.n}.`; st.msg = 'SCHROTT'; }
          else { Snd.sfx('step'); info.textContent = 'Nur Erde und ein Regenwurm.'; st.msg = 'NICHTS'; }
          st.msgT = 1;
          if (st.found || st.digs <= 0) { st.done = true; st.end = 0; st.res = { found: st.found, digs: 3 - st.digs }; }
        }, 600);
      };
      api.o.querySelector('#mdDig').addEventListener('pointerdown', (e) => { e.preventDefault(); dig(); });
      api.cv.addEventListener('pointerdown', (e) => { e.preventDefault(); if (st.done) { dig(); return; } const [x, y] = MSU.pos(api, e, W, H); st.tx = x; st.ty = y; if (e.pointerType === 'mouse') { st.x = x; st.y = y; } });
      api.cv.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons) { const [x, y] = MSU.pos(api, e, W, H); st.tx = x; st.ty = y; if (e.pointerType === 'mouse') { st.x = x; st.y = y; } } });
      Mini.key = (k) => { if (MSU.ACT.includes(k)) dig(); };
      Mini._detektor = { st, coin, dig }; /* für Tests */
      return (dt) => {
        dt = Math.max(0, dt); /* erstes Bild kann einen negativen Zeitschritt liefern */
        st.t += dt; if (st.msgT > 0) st.msgT -= dt; if (st.digT > 0) st.digT -= dt;
        const kx = (hold.r ? 1 : 0) - (hold.l ? 1 : 0), ky = (hold.d ? 1 : 0) - (hold.u ? 1 : 0);
        if (kx || ky) { st.x += kx * 45 * dt; st.y += ky * 45 * dt; st.tx = null; }
        if (st.tx != null) { const dx = st.tx - st.x, dy = st.ty - st.y, d = Math.hypot(dx, dy), sp = 90 * dt; if (d <= sp) { st.x = st.tx; st.y = st.ty; st.tx = null; } else { st.x += dx / d * sp; st.y += dy / d * sp; } }
        st.x = clamp(st.x, 8, W - 8); st.y = clamp(st.y, 26, H - 6);
        st.sig = signal(st.x, st.y);
        if (!st.done) {
          st.beep -= dt;
          if (st.beep <= 0) { st.beep = lerp(1.0, 0.07, st.sig); if (st.sig > 0.05) Snd.tone(400 + st.sig * 1100, 0.04, 'sine', 0.04 + st.sig * 0.05); }
          if (st.t > LIMIT && st.digT <= 0) { st.done = true; st.end = 0; st.res = { found: false, digs: 3 - st.digs }; info.textContent = 'Es dämmert – Zeit, nach Hause zu gehen.'; }
        } else { st.end += dt; if (st.end > 3) { api.finish(st.res); return; } }
        /* ---- Zeichnen ---- */
        const c = api.ctx;
        for (let y = 0; y < 20; y++) R(c, 0, y, W, 1, mix('#93b0c8', '#dfe8ec', y / 20));
        for (let i = 0; i < 9; i++) { const x = i * 19 - 4, h = 8 + (i * 5) % 6; R(c, x, 20 - h, 17, h, ['#e8d8c0', '#d8c8b8', '#c8c0b0'][i % 3]); for (let k = 0; k < 4; k++) R(c, x - 1 + k, 20 - h - 4 + k, 19 - k * 2, 1, '#8a3b2a'); R(c, x + 3, 20 - h - 3, 10, 1, '#f4f6f8'); }
        R(c, 0, 20, W, H - 20, '#6a7a4a');
        for (let i = 0; i < 260; i++) { const x = hash(i, 61) * W, y = 20 + hash(i, 62) * 100; P(c, x, y, hash(i, 63) < 0.5 ? '#7a8a54' : '#5a6a3e'); if (hash(i, 64) < 0.15) P(c, x, y, '#f2f4f2'); }
        R(c, 0, 22, W, 6, '#a8a090'); for (let x = 0; x < W; x += 3) P(c, x, 23 + (x % 4), '#bab2a2');
        /* Grundmauern des Vicus im Gras */
        c.strokeStyle = 'rgba(160,150,120,0.55)'; c.strokeRect(20.5, 44.5, 50, 30); c.strokeRect(96.5, 60.5, 40, 34); R(c, 96, 60, 1, 34, 'rgba(160,150,120,0.55)');
        for (let k = 0; k < 6; k++) E(c, 22 + k * 10, 44, 2, 1, '#9a9282');
        R(c, 140, 30, 14, 10, '#f4f0e6'); R(c, 146, 40, 2, 8, '#6a4a2a'); pxText(c, 'VICUS', 141, 33, '#1a1a2e');
        for (const h of st.holes) { E(c, h.x, h.y, 5, 3, '#4a3424'); E(c, h.x, h.y - 1, 4, 2, '#3a2418'); E(c, h.x + 6, h.y + 2, 3, 2, '#6a4a30'); if (h.what === 'coin') { E(c, h.x, h.y - 3, 3, 3, '#c9a227'); E(c, h.x, h.y - 3, 2, 2, '#ffd86a'); P(c, h.x - 1, h.y - 4, '#ffffff'); } if (h.what === 'junk') R(c, h.x - 1, h.y - 3, 3, 2, '#8a7a6a'); }
        /* Detektor: Stiel und Spule */
        const sw = Math.sin(st.t * 3) * 2;
        line(c, st.x + 22, st.y + 34, st.x + sw, st.y, '#3a3c40'); R(c, st.x + 12, st.y + 18, 4, 3, '#2a2a2e');
        E(c, st.x + sw, st.y + 1, 7, 3, 'rgba(0,0,0,0.25)'); E(c, st.x + sw, st.y, 6, 3, '#2a2a2e'); E(c, st.x + sw, st.y, 4, 1.5, '#5a5c60');
        if (st.sig > 0.05 && st.beep > lerp(1.0, 0.07, st.sig) - 0.05) E(c, st.x + sw, st.y, 8, 4, `rgba(255,230,120,${st.sig * 0.5})`);
        /* Anzeige */
        R(c, 4, 4, 42, 12, '#10161f'); for (let k = 0; k < 8; k++) R(c, 6 + k * 5, 13 - k, 4, k + 1, k < Math.round(st.sig * 8) ? mix('#7af0a0', '#ff6a5a', k / 7) : '#2a3040');
        if (st.msgT > 0) MSU.ctr(c, st.msg, 80, 36, st.msg === 'MÜNZE!' ? '#ffd23d' : '#f4f0e6', 2);
        if (st.done && st.found) { R(c, 52, 52, 56, 40, 'rgba(10,16,24,0.85)'); E(c, 80, 70, 12, 12, '#c9a227'); E(c, 80, 70, 10, 10, '#e8c050'); E(c, 79, 69, 5, 6, '#c9a227'); P(c, 77, 66, '#fff6c8'); MSU.ctr(c, 'DENAR', 80, 84, '#ffd23d'); }
        sEl.textContent = `${st.digs} × graben · ${Math.max(0, Math.ceil(LIMIT - st.t))} s`;
      };
    });
  },
});
