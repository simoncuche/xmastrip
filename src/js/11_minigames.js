/* ============ Minispiele ============ */
const Mini = {
  key: null,
  frame(title, sub, inner) {
    return `<div class="panel mini"><div class="panel-head"><h2>${title}</h2><span class="sub" id="miniSub">${sub || ''}</span><button class="x-btn" id="miniX" aria-label="Abbrechen">×</button></div><div class="panel-body">${inner}</div></div>`;
  },
  run(title, sub, inner, W, H, setup) {
    return new Promise((resolve) => {
      let done = false, raf = 0;
      const finish = (v) => { if (done) return; done = true; cancelAnimationFrame(raf); Mini.key = null; UI.closeOverlay(); resolve(v); };
      const o = UI.overlay(Mini.frame(title, sub, inner), () => { if (!done) { done = true; cancelAnimationFrame(raf); Mini.key = null; resolve(null); } });
      o.querySelector('#miniX').onclick = () => finish(null);
      const cv = o.querySelector('canvas');
      const ctx = cv ? cv.getContext('2d') : null;
      if (cv) { cv.width = W; cv.height = H; ctx.imageSmoothingEnabled = false; }
      const api = { o, cv, ctx, finish, sub: (t) => { o.querySelector('#miniSub').innerHTML = t; }, t0: performance.now() };
      const tick = setup(api);
      let last = performance.now();
      const loop = (now) => { if (done) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; tick(dt, (now - api.t0) / 1000); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
  },
  wob() { const p = G.S.st.prom; return 1 + Math.max(0, p - 0.4) * 1.4 + (G.S.st.energy < 25 ? 0.5 : 0); },

  /* ---------- Darts ---------- */
  darts(opp) {
    const SEG = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    const CX = 80, CY = 66, RAD = 54;
    const score = (x, y) => {
      const dx = x - CX, dy = y - CY, r = Math.hypot(dx, dy) / RAD;
      if (r > 1) return { v: 0, t: 'daneben' };
      if (r < 0.045) return { v: 50, t: 'BULL!', bull: 1 };
      if (r < 0.1) return { v: 25, t: 'Single Bull' };
      let a = Math.atan2(dx, -dy) * 180 / Math.PI; if (a < 0) a += 360;
      const seg = SEG[Math.floor(((a + 9) % 360) / 18)];
      if (r > 0.47 && r < 0.53) return { v: seg * 3, t: 'Triple ' + seg };
      if (r > 0.94) return { v: seg * 2, t: 'Double ' + seg };
      return { v: seg, t: '' + seg };
    };
    const [bc, bx] = canvas(160, 132);
    for (let y = 0; y < 132; y++) for (let x = 0; x < 160; x++) {
      const dx = x - CX, dy = y - CY, r = Math.hypot(dx, dy) / RAD;
      if (r > 1.18) continue;
      if (r > 1) { P(bx, x, y, '#1a1a1a'); continue; }
      let a = Math.atan2(dx, -dy) * 180 / Math.PI; if (a < 0) a += 360;
      const si = Math.floor(((a + 9) % 360) / 18);
      const dark = si % 2 === 0;
      let c = dark ? '#1d1d1f' : '#efe4c8';
      if ((r > 0.47 && r < 0.53) || r > 0.94) c = dark ? '#c8302a' : '#2a8a3a';
      if (r < 0.1) c = '#2a8a3a';
      if (r < 0.045) c = '#c8302a';
      P(bx, x, y, c);
    }
    for (let i = 0; i < 20; i++) { const a = (i * 18) * Math.PI / 180; const tx = CX + Math.sin(a) * (RAD + 6) - 3, ty = CY - Math.cos(a) * (RAD + 6) - 2; pxText(bx, SEG[i], Math.round(tx - (SEG[i] > 9 ? 2 : 0)), Math.round(ty), '#f2eee4'); }
    return this.run('Darts', opp ? `gegen ${opp.name}` : 'Training', `<canvas aria-label="Dartscheibe"></canvas><div class="mini-bar"><span id="dInfo">Tippe oder drück A, wenn das Fadenkreuz richtig steht.</span><b id="dScore">0</b></div><button class="btn primary" id="dThrow">Werfen</button>`, 160, 132, (api) => {
      const st = { round: 1, dart: 0, me: 0, opp: 0, darts: [], turn: 'me', t: 0, msg: '', aiT: 0, bull: false, phase: 'aim', wait: 0 };
      const amp = 22 * Mini.wob();
      const throwIt = () => {
        if (st.turn !== 'me' || st.phase !== 'aim') return;
        const ax = CX + Math.sin(st.t * 1.7) * amp + Math.sin(st.t * 4.1) * amp * 0.25, ay = CY + Math.sin(st.t * 2.3 + 1) * amp * 0.8;
        const n = 2 + G.S.st.prom * 3;
        const hx = ax + rnd(-n, n), hy = ay + rnd(-n, n);
        const s = score(hx, hy);
        st.darts.push({ x: hx, y: hy, me: 1 }); st.me += s.v; st.dart++; if (s.bull) st.bull = true;
        Snd.sfx('dart'); st.msg = s.t + (s.v ? ` (+${s.v})` : '');
        if (st.dart >= 3) { st.turn = opp ? 'opp' : 'next'; st.dart = 0; st.wait = 1.1; }
      };
      api.o.querySelector('#dThrow').onclick = throwIt;
      api.cv.addEventListener('pointerdown', throwIt);
      Mini.key = (k) => { if (['Space', 'Enter', 'KeyE'].includes(k)) throwIt(); };
      return (dt) => {
        st.t += dt;
        const c = api.ctx;
        c.fillStyle = '#2a1a10'; c.fillRect(0, 0, 160, 132);
        c.drawImage(bc, 0, 0);
        for (const d of st.darts) { R(c, d.x - 1, d.y - 1, 3, 3, d.me ? '#ffb53d' : '#7ad0f0'); R(c, d.x + 1, d.y - 4, 1, 3, '#e8e8e8'); }
        if (st.wait > 0) { st.wait -= dt; if (st.wait <= 0) { if (st.turn === 'next') { st.round++; st.darts = []; st.turn = 'me'; } else if (st.turn === 'opp') st.phase = 'ai'; } }
        if (st.turn === 'me' && st.phase === 'aim' && st.wait <= 0) {
          const ax = CX + Math.sin(st.t * 1.7) * amp + Math.sin(st.t * 4.1) * amp * 0.25, ay = CY + Math.sin(st.t * 2.3 + 1) * amp * 0.8;
          R(c, ax - 5, ay, 4, 1, '#ffffff'); R(c, ax + 2, ay, 4, 1, '#ffffff'); R(c, ax, ay - 5, 1, 4, '#ffffff'); R(c, ax, ay + 2, 1, 4, '#ffffff'); P(c, ax, ay, '#ff3a3a');
        }
        if (st.phase === 'ai') {
          st.aiT -= dt;
          if (st.aiT <= 0) {
            const skill = opp.fn === 'saeufer' ? 9 - Math.min(4, G.S.st.prom * 2) : 11;
            const tx = CX + rnd(-skill, skill), ty = CY - RAD * 0.5 + rnd(-skill, skill);
            const s = score(tx, ty);
            st.darts.push({ x: tx, y: ty, me: 0 }); st.opp += s.v; st.dart++;
            Snd.sfx('dart'); st.msg = `${opp.name}: ${s.t}${s.v ? ` (+${s.v})` : ''}`;
            st.aiT = 0.8;
            if (st.dart >= 3) { st.dart = 0; st.phase = 'aim'; st.turn = 'next'; st.wait = 1.2; }
          }
        }
        if (st.round > 3) {
          const win = !opp || st.me > st.opp;
          api.finish({ score: st.me, win: opp ? st.me > st.opp : true, bull: st.bull });
          if (opp) UI.toast(win ? `Gewonnen! ${st.me} : ${st.opp}` : `Verloren. ${st.me} : ${st.opp}`, win ? 'ach' : '');
          else UI.toast(`Du hast ${st.me} Punkte geworfen.`);
          return;
        }
        api.o.querySelector('#dInfo').textContent = st.msg || `Runde ${st.round}/3 · Pfeil ${st.dart + 1}/3`;
        api.o.querySelector('#dScore').textContent = opp ? `Du ${st.me} · ${opp.name} ${st.opp}` : `${st.me} Punkte`;
      };
    });
  },

  /* ---------- Armdrücken ---------- */
  arm(f) {
    const strong = f.fn === 'muskel';
    return this.run('Armdrücken', `gegen ${f.name}`, `<canvas aria-label="Armdrücken"></canvas><div class="mini-bar"><span id="aInfo">Tippe so schnell du kannst!</span><b id="aT"></b></div><button class="btn primary" id="aPush" style="height:64px;font-size:20px">DRÜCKEN!</button>`, 160, 100, (api) => {
      const L = G.S.look, st = G.S.st;
      let factor = [0.86, 1, 1.12, 1.22][L.build] * (0.62 + st.energy / 260);
      if (st.prom > 0.3 && st.prom < 1.1) factor *= 1.08; if (st.prom > 1.7) factor *= 0.85;
      let v = 0, rate = strong ? 0.52 : 0.33, t = 0, started = false, burst = 0;
      const push = () => { if (!started) started = true; v += 0.072 * factor; Snd.sfx('hit'); };
      api.o.querySelector('#aPush').addEventListener('pointerdown', (e) => { e.preventDefault(); push(); });
      Mini.key = (k) => { if (['Space', 'Enter', 'KeyE'].includes(k)) push(); };
      const myL = getSheet(G.S.look), opL = getSheet(f.look);
      return (dt) => {
        const c = api.ctx;
        if (started) { t += dt; rate *= Math.pow(0.975, dt); if (Math.random() < dt * 0.7) burst = 0.4; if (burst > 0) { burst -= dt; v -= dt * 0.35; } v -= rate * dt; }
        v = clamp(v, -1, 1);
        R(c, 0, 0, 160, 100, '#3a2418'); R(c, 0, 62, 160, 38, '#6a4428'); R(c, 0, 62, 160, 2, '#8a5a34');
        c.drawImage(myL, 0, 0, SPR_W, SPR_H, 8, 30, SPR_W * 1.6, SPR_H * 1.6);
        c.drawImage(opL, 0, 2 * SPR_H, SPR_W, SPR_H, 122, 30, SPR_W * 1.6, SPR_H * 1.6);
        const ang = -Math.PI / 2 + v * 1.2;
        const ex = 80, ey = 70;
        const hx = ex + Math.cos(ang) * 26, hy = ey + Math.sin(ang) * 26;
        const skin = lc(G.S.look, 'skin'), oskin = lc(f.look, 'skin');
        c.strokeStyle = skin; c.lineWidth = 7; c.beginPath(); c.moveTo(36, 66); c.lineTo(ex - 4, ey); c.lineTo(hx, hy); c.stroke();
        c.strokeStyle = oskin; c.beginPath(); c.moveTo(124, 66); c.lineTo(ex + 4, ey); c.lineTo(hx + 2, hy); c.stroke();
        E(c, hx, hy, 5, 5, mix(skin, oskin, 0.5));
        R(c, 20, 8, 120, 8, '#1a1a1a'); R(c, 80, 8, Math.round(v * 60), 8, v > 0 ? '#ffb53d' : '#e2554a'); R(c, 79, 6, 2, 12, '#ffffff');
        api.o.querySelector('#aT').textContent = started ? (v > 0 ? 'Du drückst!' : `${f.name} drückt!`) : 'Bereit?';
        if (v >= 1) { Snd.sfx('win'); api.finish(true); }
        if (v <= -1) { Snd.sfx('lose'); api.finish(false); }
      };
    });
  },

  /* ---------- Tanzen ---------- */
  dance() {
    const lanes = ['←', '↓', '↑', '→'];
    return this.run('Tanzfläche', 'DJ Firn legt auf', `<canvas aria-label="Tanzfläche"></canvas><div class="mini-bar"><span id="nInfo">Drück die Pfeile, wenn sie die Linie treffen.</span><b id="nScore">0 %</b></div><div class="lanes">${lanes.map((l, i) => `<button data-l="${i}" aria-label="Spur ${i + 1}">${l}</button>`).join('')}</div>`, 160, 140, (api) => {
      const beat = 60 / 124;
      const notes = [];
      const r = rng(dayOf(G.S.time) * 13 + Math.floor(G.t));
      for (let b = 4; b < 40; b++) { if (r() < 0.82) notes.push({ t: b * beat, l: Math.floor(r() * 4) }); if (b > 20 && r() < 0.2) notes.push({ t: (b + 0.5) * beat, l: Math.floor(r() * 4) }); }
      const travel = 1.8;
      /* Trefferfenster (± Sekunden): grosszügig genug für Touch-Latenz; Alkohol und Müdigkeit machen es enger */
      let win = 0.15, good = 0.28;
      const p = G.S.st.prom; if (p > 1) { win *= 0.85; good *= 0.85; } if (p > 1.8) { win *= 0.75; good *= 0.8; } if (G.S.st.energy < 25) { win *= 0.85; }
      let pts = 0, t = -2.0, judge = '', jt = 0, combo = 0, lastBeat = -1;
      const hit = (l) => {
        const btn = api.o.querySelector(`[data-l="${l}"]`); btn.classList.add('hit'); setTimeout(() => btn.classList.remove('hit'), 90);
        let best = null, bd = 9;
        for (const n of notes) if (!n.done && n.l === l) { const d = Math.abs(n.t - t); if (d < bd) { bd = d; best = n; } }
        if (best && bd < good) { best.done = true; const pf = bd < win; pts += pf ? 100 : 75; judge = pf ? 'PERFEKT!' : 'Gut'; combo++; Snd.tone([523, 587, 659, 784][l], 0.08, 'square', 0.04); }
        else { judge = 'Daneben'; combo = 0; }
        jt = 0.5;
      };
      api.o.querySelectorAll('[data-l]').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); hit(+b.dataset.l); }));
      Mini.key = (k) => { const m = { ArrowLeft: 0, KeyA: 0, ArrowDown: 1, KeyS: 1, ArrowUp: 2, KeyW: 2, ArrowRight: 3, KeyD: 3 }; if (k in m) hit(m[k]); };
      const sheet = getSheet(G.S.look);
      Mini._dance = { notes, now: () => t }; /* für Tests */
      const LW = 40, ly = 112; /* vier Spuren à 40 px über die volle Breite – die Knöpfe darunter liegen genau darunter */
      const arrow = (c, ax, ay, d, col) => { for (let k = 0; k < 4; k++) { if (d === 0) R(c, ax + k, ay + 3 - k, 1, k * 2 + 1, col); if (d === 3) R(c, ax + 6 - k, ay + 3 - k, 1, k * 2 + 1, col); if (d === 1) R(c, ax + 3 - k, ay + 6 - k, k * 2 + 1, 1, col); if (d === 2) R(c, ax + 3 - k, ay + k, k * 2 + 1, 1, col); } };
      const LANE_COL = ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7aff6a'];
      return (dt) => {
        t += dt; jt -= dt;
        const c = api.ctx;
        const bt = Math.floor(t / beat);
        /* Metronom: Klick auf jedem Schlag, Akzent auf der Eins – so hört man den Takt */
        if (bt !== lastBeat && t >= 0) { lastBeat = bt; Snd.tone(bt % 4 === 0 ? 1400 : 900, 0.025, 'square', bt % 4 === 0 ? 0.05 : 0.03); }
        R(c, 0, 0, 160, 140, '#120f1a');
        for (let i = 0; i < 4; i++) R(c, i * LW, 0, LW, 140, i % 2 ? '#1a1626' : '#171322');
        if (bt % 4 === 0 && t >= 0) R(c, 0, 0, 160, 140, 'rgba(255,58,208,0.05)');
        /* Tänzer halbtransparent im Hintergrund, mittig */
        c.globalAlpha = 0.4;
        c.drawImage(sheet, (bt % 2 ? 5 : 6) * SPR_W, 0, SPR_W, SPR_H, 62, 26, SPR_W * 2, SPR_H * 2);
        c.globalAlpha = 1;
        /* Ziellinie und Pfeile je Spur */
        R(c, 0, ly, 160, 2, '#f2eee4');
        for (let i = 0; i < 4; i++) { R(c, i * LW + 4, ly - 1, LW - 8, 4, 'rgba(255,255,255,0.12)'); arrow(c, i * LW + LW / 2 - 3, ly + 6, i, LANE_COL[i]); }
        const jitter = p > 1.4 ? (p - 1.4) * 3 : 0;
        for (const n of notes) {
          if (n.done) continue;
          const dtn = n.t - t;
          if (dtn < -good) { n.done = true; n.miss = true; combo = 0; judge = 'Verpasst'; jt = 0.4; continue; }
          if (dtn > travel) continue;
          const y = ly - (dtn / travel) * ly;
          const x = n.l * LW + 6 + Math.sin(t * 5 + n.t) * jitter;
          R(c, x, y - 3, LW - 12, 6, LANE_COL[n.l]); R(c, x + 2, y - 2, LW - 16, 1, '#ffffff');
          arrow(c, n.l * LW + LW / 2 - 3, y - 3, n.l, '#120f1a');
        }
        if (jt > 0) { const w = pxTextW(judge.toUpperCase()); pxText(c, judge.toUpperCase(), 80 - w / 2, 8, judge === 'Daneben' || judge === 'Verpasst' ? '#e2554a' : '#ffb53d'); }
        if (combo > 3) pxText(c, combo + 'X', 72, 18, '#7af0e0');
        if (t < 0) pxText(c, 'BEREIT…', 36, 50, '#ffb53d', 2);
        const pct = Math.round((pts / (notes.length * 100)) * 100);
        api.o.querySelector('#nScore').textContent = pct + ' %';
        if (t > notes[notes.length - 1].t + 1) { api.finish(pct); UI.toast(`Tanzwertung: ${pct} %`, pct >= 80 ? 'ach' : ''); }
      };
    });
  },



  /* ---------- Bierpong: zielen, Kraft, werfen – jeder Treffer lässt den anderen trinken ---------- */
  beerpong(opp, onDrink) {
    const CUPS = (top) => { const out = []; const rows = top ? [[3, 22], [2, 30], [1, 38]] : [[1, 104], [2, 112], [3, 120]]; for (const [n, y] of rows) for (let i = 0; i < n; i++) out.push({ x: 80 + (i - (n - 1) / 2) * 13, y, alive: true }); return out; };
    const theirs = CUPS(true), mine = CUPS(false);
    const me = getSheet(G.S.look), oppSheet = getSheet(opp.look);
    const oppSkill = Math.max(0.22, 0.52 - ((G.S.fprom && G.S.fprom[opp.id]) || 0) * 0.1);
    const mySkill = G.S.st.prom > 1.5 ? 1.8 : G.S.st.prom > 0.8 ? 1.3 : 1;
    return this.run('Bierpong', `gegen ${opp.name}`, `<canvas aria-label="Bierpong"></canvas><div class="mini-bar"><span id="nInfo">Tippen: Richtung festlegen. Nochmal tippen: Kraft.</span><b id="nScore"></b></div><div class="lanes" style="grid-template-columns:1fr"><button data-l="0" aria-label="Werfen">WERFEN</button></div>`, 160, 150, (api) => {
      let phase = 'aim', t = 0, aimX = 80, power = 0.5, ball = null, msg = '', mt = 0, over = false, myDrinks = 0, oppDrinks = 0;
      const info = (s) => { api.o.querySelector('#nInfo').textContent = s; };
      const score = () => { api.o.querySelector('#nScore').textContent = `${mine.filter((c) => c.alive).length} : ${theirs.filter((c) => c.alive).length}`; };
      score();
      const tap = () => {
        if (over) return;
        if (phase === 'aim') { phase = 'power'; info('Tippen, wenn die Kraft stimmt – die Becher stehen in der Mitte.'); Snd.sfx('blip'); }
        else if (phase === 'power') {
          phase = 'fly';
          const wob = (Math.random() - 0.5) * 10 * (mySkill - 1);
          const land = { x: aimX + wob, y: 44 + (0.55 - power) * 120 + wob };
          ball = { x: 80, y: 136, tx: land.x, ty: land.y, t: 0, mine: true };
          Snd.sfx('whoosh');
        }
      };
      api.o.querySelector('[data-l]').addEventListener('pointerdown', (e) => { e.preventDefault(); tap(); });
      api.cv.addEventListener('pointerdown', (e) => { e.preventDefault(); tap(); });
      Mini.key = (k) => { if (['Space', 'Enter', 'KeyE'].includes(k)) tap(); };
      const finish = () => { over = true; const win = theirs.every((c) => !c.alive); setTimeout(() => api.finish({ win, myDrinks, oppDrinks, myLeft: mine.filter((c) => c.alive).length, theirLeft: theirs.filter((c) => c.alive).length }), 1400); };
      const landBall = () => {
        const cups = ball.mine ? theirs : mine;
        let best = null, bd = 99;
        for (const c of cups) if (c.alive) { const d = Math.hypot(c.x - ball.tx, c.y - ball.ty); if (d < bd) { bd = d; best = c; } }
        if (best && bd < 7) {
          best.alive = false; Snd.sfx('splash');
          if (ball.mine) { msg = 'TREFFER!'; oppDrinks++; if (onDrink) onDrink('opp'); }
          else { msg = `${opp.name} trifft – du trinkst!`; myDrinks++; if (onDrink) onDrink('me'); }
        } else { msg = ball.mine ? 'Daneben.' : `${opp.name} verfehlt.`; Snd.sfx('card'); }
        mt = 1.2; score();
        const wasMine = ball.mine; ball = null;
        if (theirs.every((c) => !c.alive) || mine.every((c) => !c.alive)) { finish(); return; }
        if (wasMine) { phase = 'opp'; info(`${opp.name} wirft …`); setTimeout(() => { if (over) return; const alive = mine.filter((c) => c.alive); const target = pick(alive); const hit = Math.random() < oppSkill; const off = hit ? rnd(-4, 4) : rnd(9, 20) * (Math.random() < 0.5 ? -1 : 1); ball = { x: 80, y: 14, tx: target.x + off, ty: target.y + (hit ? rnd(-3, 3) : rnd(-12, 12)), t: 0, mine: false }; Snd.sfx('whoosh'); }, 900); }
        else { phase = 'aim'; info('Tippen: Richtung festlegen. Nochmal tippen: Kraft.'); }
      };
      return (dt) => {
        t += dt; if (mt > 0) mt -= dt;
        const c = api.ctx;
        R(c, 0, 0, 160, 150, '#2a1a10'); R(c, 20, 6, 120, 138, '#1f6a3a'); R(c, 22, 8, 116, 134, '#2a7a44'); R(c, 20, 74, 120, 2, '#f4f0e6');
        const cup = (k, red) => { if (!k.alive) { E(c, k.x, k.y + 3, 5, 2, 'rgba(0,0,0,0.15)'); return; } R(c, k.x - 5, k.y - 6, 10, 12, red ? '#c8302a' : '#2f5fb8'); R(c, k.x - 5, k.y - 6, 10, 2, red ? '#e85a4a' : '#5a8ae8'); R(c, k.x - 3, k.y - 4, 6, 2, '#e8c23a'); };
        for (const k of theirs) cup(k, true); for (const k of mine) cup(k, false);
        c.drawImage(oppSheet, 0, 0, SPR_W, SPR_H, 2, 20, SPR_W, SPR_H); c.drawImage(me, 0, 3 * SPR_H, SPR_W, SPR_H, 140, 104, SPR_W, SPR_H);
        pxText(c, opp.name.toUpperCase(), 2, 50, '#ffb53d'); pxText(c, 'DU', 142, 134, '#ffb53d');
        if (phase === 'aim') { aimX = 80 + Math.sin(t * 3.2) * 34; R(c, Math.round(aimX) - 1, 14, 2, 36, 'rgba(255,255,255,0.6)'); R(c, Math.round(aimX) - 4, 48, 8, 1, '#ffffff'); }
        if (phase === 'power') { power = (Math.sin(t * 5) + 1) / 2; R(c, 146, 60, 8, 40, '#1a1a1e'); R(c, 147, 99 - Math.round(power * 38), 6, Math.round(power * 38), power > 0.42 && power < 0.68 ? '#6fe08a' : '#ffb53d'); R(c, 145, 99 - Math.round(0.55 * 38), 10, 1, '#ffffff'); R(c, Math.round(aimX) - 1, 14, 2, 36, 'rgba(255,255,255,0.25)'); }
        if (ball) { ball.t += dt * 1.6; const u = Math.min(1, ball.t); const bx = ball.x + (ball.tx - ball.x) * u, by = ball.y + (ball.ty - ball.y) * u - Math.sin(u * Math.PI) * 30; E(c, Math.round(ball.x + (ball.tx - ball.x) * u), Math.round(ball.y + (ball.ty - ball.y) * u) + 2, 3, 1, 'rgba(0,0,0,0.25)'); E(c, Math.round(bx), Math.round(by), 3, 3, '#f8f4e8'); if (u >= 1) landBall(); }
        if (mt > 0) { const w = pxTextW(msg); pxText(c, msg, 80 - w / 2, 66, msg.startsWith('TREFFER') ? '#6fe08a' : '#ffffff'); }
        if (over) { const win = theirs.every((k) => !k.alive); pxText(c, win ? 'GEWONNEN!' : 'VERLOREN', 52, 80, win ? '#6fe08a' : '#ff6a5a', 2); }
      };
    });
  },
  /* ---------- Roulette: Kessel dreht, Kugel fällt auf eine Zahl ---------- */
  rouletteSpin(target) {
    const ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return this.run('Roulette', 'Rien ne va plus', `<canvas aria-label="Roulette"></canvas><div class="mini-bar"><span id="nInfo">Die Kugel läuft …</span><b id="nScore"></b></div>`, 160, 140, (api) => {
      const idx = ORDER.indexOf(target);
      const total = 4.2;
      let t = 0, done = false;
      const ease = (u) => 1 - Math.pow(1 - u, 3);
      return (dt) => {
        t += dt;
        const c = api.ctx;
        R(c, 0, 0, 160, 140, '#1a3a24');
        const CX = 80, CY = 72, RO = 60;
        const u = Math.min(1, t / total);
        const wheelA = t * 1.2;
        const ballA = -(ease(u) * (6 * Math.PI * 2) + (idx / 37) * Math.PI * 2) + wheelA;
        E(c, CX, CY, RO + 4, RO + 4, '#5a3a20'); E(c, CX, CY, RO, RO, '#2a1a10');
        for (let i = 0; i < 37; i++) {
          const a0 = wheelA + (i / 37) * Math.PI * 2, a1 = wheelA + ((i + 1) / 37) * Math.PI * 2;
          const n = ORDER[i], col = n === 0 ? '#2f8e4b' : RED.includes(n) ? '#c8302a' : '#1a1a1e';
          c.fillStyle = col; c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, RO - 2, a0, a1); c.closePath(); c.fill();
        }
        E(c, CX, CY, 34, 34, '#3a2a1a'); E(c, CX, CY, 30, 30, '#5a3a20'); E(c, CX, CY, 6, 6, '#c9a227');
        const br = u < 1 ? RO - 8 - ease(u) * 14 : RO - 22;
        E(c, CX + Math.cos(ballA) * br, CY + Math.sin(ballA) * br, 3, 3, '#f4f4f0');
        if (u >= 1) { pxText(c, String(target), target < 10 ? 76 : 72, 120, target === 0 ? '#6fe08a' : RED.includes(target) ? '#ff6a5a' : '#ffffff', 2); if (!done) { done = true; Snd.sfx('ding'); setTimeout(() => api.finish(target), 1400); } }
        else if (Math.floor(t * 12) % 3 === 0 && u < 0.8) Snd.noise(0.01, 0.015, 3000, 0, 'highpass');
      };
    });
  },
  /* ---------- Blackjack gegen die Bank ---------- */
  blackjack(bet) {
    const SUITS = ['♥', '♦', '♠', '♣'], RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = []; for (let s = 0; s < 4; s++) for (let r = 0; r < 13; r++) deck.push({ s, r });
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    const val = (h) => { let v = 0, aces = 0; for (const c of h) { if (c.r === 0) { aces++; v += 11; } else v += Math.min(10, c.r + 1); } while (v > 21 && aces > 0) { v -= 10; aces--; } return v; };
    const me = [deck.pop(), deck.pop()], bank = [deck.pop(), deck.pop()];
    let state = 'play', mult = bet, result = null, reveal = false;
    return this.run('Blackjack', `Einsatz ${fmtEur(bet)}`, `<canvas aria-label="Blackjack"></canvas><div class="mini-bar"><span id="nInfo">Näher an 21 als die Bank – aber nicht drüber.</span><b id="nScore"></b></div><div class="lanes" style="grid-template-columns:1fr 1fr 1fr"><button data-a="hit">Karte</button><button data-a="stand">Halten</button><button data-a="double">Verdoppeln</button></div>`, 160, 120, (api) => {
      const btn = (a) => api.o.querySelector(`[data-a="${a}"]`);
      const end = (res, m) => { state = 'done'; reveal = true; result = res; mult = m; api.sub(res === 'win' ? 'Gewonnen!' : res === 'push' ? 'Unentschieden' : 'Verloren'); Snd.sfx(res === 'win' ? 'win' : res === 'push' ? 'blip' : 'lose'); setTimeout(() => api.finish({ res, mult }), 1800); };
      const bankPlay = () => { reveal = true; while (val(bank) < 17) bank.push(deck.pop()); const b = val(bank), m = val(me); if (b > 21 || m > b) end('win', mult); else if (m === b) end('push', 0); else end('lose', -mult); };
      const act = (a) => {
        if (state !== 'play') return;
        Snd.sfx('card');
        if (a === 'hit') { me.push(deck.pop()); if (val(me) > 21) end('lose', -mult); }
        if (a === 'stand') bankPlay();
        if (a === 'double') { if (me.length !== 2 || !canPay('eur', bet)) { UI.toast('Verdoppeln geht nur mit zwei Karten und genug Geld.', 'warn'); return; } mult = bet * 2; me.push(deck.pop()); if (val(me) > 21) end('lose', -mult); else bankPlay(); }
      };
      ['hit', 'stand', 'double'].forEach((a) => btn(a).addEventListener('pointerdown', (e) => { e.preventDefault(); act(a); }));
      Mini.key = (k) => { if (k === 'KeyH' || k === 'Space') act('hit'); if (k === 'KeyS' || k === 'Enter') act('stand'); if (k === 'KeyD') act('double'); };
      if (val(me) === 21) { reveal = true; if (val(bank) === 21) end('push', 0); else end('win', Math.round(bet * 1.5)); api.sub('Blackjack!'); }
      const card = (c, x, y, k, hidden) => {
        R(c, x, y, 20, 28, '#1a1a1e'); R(c, x + 1, y + 1, 18, 26, hidden ? '#2f5fb8' : '#f8f6f0');
        if (hidden) { for (let i = 3; i < 17; i += 4) for (let j = 3; j < 25; j += 4) P(c, x + i, y + j, '#7fb4e2'); return; }
        const red = k.s < 2, col = red ? '#c8302a' : '#1a1a1e';
        pxText(c, RANKS[k.r], x + 3, y + 3, col);
        const sx = x + 10, sy = y + 18;
        if (k.s === 0) { R(c, sx - 3, sy - 2, 3, 2, col); R(c, sx + 1, sy - 2, 3, 2, col); R(c, sx - 3, sy, 7, 2, col); R(c, sx - 2, sy + 2, 5, 1, col); P(c, sx, sy + 3, col); }
        else if (k.s === 1) { P(c, sx, sy - 3, col); R(c, sx - 1, sy - 2, 3, 1, col); R(c, sx - 2, sy - 1, 5, 2, col); R(c, sx - 1, sy + 1, 3, 1, col); P(c, sx, sy + 2, col); }
        else if (k.s === 2) { P(c, sx, sy - 3, col); R(c, sx - 1, sy - 2, 3, 1, col); R(c, sx - 3, sy - 1, 7, 2, col); R(c, sx - 2, sy + 1, 5, 1, col); R(c, sx, sy + 2, 1, 2, col); }
        else { R(c, sx - 1, sy - 3, 3, 2, col); R(c, sx - 3, sy - 1, 3, 2, col); R(c, sx + 1, sy - 1, 3, 2, col); R(c, sx, sy, 1, 4, col); }
      };
      return () => {
        const c = api.ctx;
        R(c, 0, 0, 160, 120, '#1f6a3a'); R(c, 0, 0, 160, 120, 'rgba(0,0,0,0.08)');
        pxText(c, 'BANK', 6, 6, '#f4e8c0'); pxText(c, reveal ? String(val(bank)) : '?', 36, 6, '#ffd23d');
        bank.forEach((k, i) => card(c, 6 + i * 24, 16, k, i === 1 && !reveal));
        pxText(c, 'DU', 6, 70, '#f4e8c0'); pxText(c, String(val(me)), 24, 70, val(me) > 21 ? '#ff6a5a' : '#ffd23d');
        me.forEach((k, i) => card(c, 6 + i * 24, 80, k, false));
        if (result) pxText(c, result === 'win' ? 'GEWONNEN' : result === 'push' ? 'UNENTSCHIEDEN' : 'VERLOREN', 90, 50, result === 'win' ? '#7af07a' : result === 'push' ? '#ffd23d' : '#ff6a5a');
        btn('double').disabled = state !== 'play' || me.length !== 2; btn('hit').disabled = state !== 'play'; btn('stand').disabled = state !== 'play';
      };
    });
  },
  /* ---------- Nageln ---------- */
  nageln() {
    return this.run('Nageln', 'gegen Hias', `<canvas aria-label="Nagelstock"></canvas><div class="mini-bar"><span id="gInfo">Schlag zu, wenn der Zeiger im grünen Bereich ist!</span><b id="gS"></b></div><button class="btn primary" id="gHit" style="height:56px">Zuschlagen</button>`, 160, 110, (api) => {
      let me = 0, hias = 0, turn = 'me', t = 0, hammer = 0, msg = '', wait = 0;
      const speed = 1.6 * (1 + Math.max(0, G.S.st.prom - 0.5) * 0.6);
      const zone = 0.16 / (1 + Math.max(0, G.S.st.prom - 1) * 0.5);
      const hit = () => {
        if (turn !== 'me' || wait > 0) return;
        const pos = (Math.sin(t * speed * Math.PI) + 1) / 2;
        const d = Math.abs(pos - 0.5);
        let add = 0;
        if (d < zone / 2) { add = 0.34; msg = 'Volltreffer!'; } else if (d < zone * 1.4) { add = 0.17; msg = 'Gut getroffen.'; } else { add = 0.02; msg = 'Daneben – Nagel krumm!'; }
        me = Math.min(1, me + add); hammer = 0.3; Snd.sfx('nail');
        turn = 'hias'; wait = 1.0;
      };
      api.o.querySelector('#gHit').onclick = hit;
      api.cv.addEventListener('pointerdown', hit);
      Mini.key = (k) => { if (['Space', 'Enter', 'KeyE'].includes(k)) hit(); };
      return (dt) => {
        t += dt; hammer -= dt;
        if (wait > 0) { wait -= dt; if (wait <= 0 && turn === 'hias') { const r = Math.random(); const add = r < 0.45 ? 0.34 : r < 0.85 ? 0.17 : 0.02; hias = Math.min(1, hias + add); msg = 'Hias: ' + (add > 0.3 ? 'Volltreffer!' : add > 0.1 ? 'Guat.' : 'Sakra, krumm!'); Snd.sfx('nail'); turn = 'me'; wait = 0.7; } }
        const c = api.ctx;
        R(c, 0, 0, 160, 110, '#5a3a20');
        E(c, 80, 74, 50, 30, '#7a5432'); E(c, 80, 70, 48, 16, '#c89a62'); for (let k = 1; k < 5; k++) E(c, 80, 70, k * 10, k * 3, 'rgba(0,0,0,0)');
        for (let k = 1; k < 5; k++) { c.strokeStyle = '#a8784a'; c.beginPath(); c.ellipse(80, 70, k * 11, k * 3.3, 0, 0, 6.28); c.stroke(); }
        const nail = (x, d, col) => { const h = Math.round(20 * (1 - d)); R(c, x, 70 - h, 2, h, '#9aa0a6'); R(c, x - 2, 70 - h - 1, 6, 2, col); };
        nail(62, me, '#ffb53d'); nail(98, hias, '#7ad0f0');
        if (hammer > 0) { R(c, turn === 'me' ? 66 : 102, 30, 4, 22, '#6a4428'); R(c, turn === 'me' ? 58 : 94, 26, 18, 6, '#3a3c40'); }
        R(c, 20, 8, 120, 8, '#2a1a10');
        R(c, 20 + 60 - (zone * 120) / 2, 8, zone * 120, 8, '#3fae4a');
        const pos = (Math.sin(t * speed * Math.PI) + 1) / 2;
        if (turn === 'me' && wait <= 0) R(c, 20 + pos * 120 - 1, 5, 2, 14, '#ffffff');
        api.o.querySelector('#gInfo').textContent = msg || 'Schlag zu, wenn der Zeiger im grünen Bereich ist!';
        api.o.querySelector('#gS').textContent = `Du ${Math.round(me * 100)} % · Hias ${Math.round(hias * 100)} %`;
        if (me >= 1 && wait <= 0) { Snd.sfx('win'); api.finish(true); }
        else if (hias >= 1 && wait <= 0) { Snd.sfx('lose'); api.finish(false); }
      };
    });
  },

  /* ---------- Steine flitschen ---------- */
  stones() {
    return this.run('Steine flitschen', 'am Inn', `<canvas aria-label="Inn"></canvas><div class="mini-bar"><span id="sInfo">Flacher Winkel = mehr Sprünge. Tippen zum Werfen.</span><b id="sB">Rekord ${G.S.rec.stone}×</b></div><button class="btn primary" id="sThrow">Werfen</button>`, 160, 100, (api) => {
      let t = 0, phase = 'aim', ang = 0, skips = 0, sx = 0, sy = 0, hop = 0, k = 0, tries = 3, best = 0, splashes = [];
      const throwIt = () => {
        if (phase !== 'aim') return;
        const a = (Math.sin(t * 2.2 * Mini.wob()) + 1) / 2;
        ang = a;
        const quality = 1 - Math.min(1, Math.abs(a - 0.18) / 0.5);
        skips = Math.max(0, Math.round(quality * 11 + rnd(-1.5, 1.5) - G.S.st.prom * 1.5));
        phase = 'fly'; sx = 14; sy = 60; k = 0; hop = 0; splashes = []; tries--;
        Snd.sfx('whoosh');
      };
      api.o.querySelector('#sThrow').onclick = throwIt;
      api.cv.addEventListener('pointerdown', throwIt);
      Mini.key = (kk) => { if (['Space', 'Enter', 'KeyE'].includes(kk)) throwIt(); };
      return (dt) => {
        t += dt;
        const c = api.ctx;
        R(c, 0, 0, 160, 40, '#9fc4e2'); for (let x = 0; x < 160; x++) { const h = 8 + Math.abs(Math.sin(x * 0.05)) * 14; R(c, x, 40 - h, 1, h, '#8c8a86'); if (h > 18) P(c, x, 40 - h, '#f2f4f6'); }
        R(c, 0, 34, 160, 6, '#e8b4a0'); for (let x = 0; x < 160; x += 9) R(c, x, 30, 7, 6, PASTELS[(x / 9) % PASTELS.length | 0]);
        R(c, 0, 40, 160, 60, '#2f6e8f'); for (let i = 0; i < 20; i++) R(c, (i * 37 + t * 8) % 160, 45 + (i * 13) % 50, 5, 1, '#5a9ab8');
        R(c, 0, 82, 160, 18, '#9f988c');
        for (const s of splashes) { s.t += dt; E(c, s.x, s.y, 2 + s.t * 8, 1 + s.t * 3, `rgba(220,240,255,${Math.max(0, 0.8 - s.t)})`); }
        if (phase === 'aim') {
          const a = (Math.sin(t * 2.2 * Mini.wob()) + 1) / 2;
          for (let i = 0; i < 20; i++) P(c, 14 + Math.cos(-a * 1.2) * i * 1.5, 70 + Math.sin(-a * 1.2) * i * 1.5, '#ffb53d');
          R(c, 12, 68, 4, 3, '#7a7a7a');
          pxText(c, a < 0.3 ? 'FLACH' : a < 0.55 ? 'MITTEL' : 'STEIL', 40, 88, '#2a2622');
        } else {
          hop += dt * (5 - Math.min(3, k * 0.25));
          const segLen = Math.max(5, 20 - k * 1.6);
          const prog = Math.min(1, hop);
          const x = sx + prog * segLen, y = sy - Math.sin(prog * Math.PI) * Math.max(2, 10 - k);
          R(c, x - 1, y - 1, 3, 2, '#7a7a7a');
          if (hop >= 1) { sx += segLen; hop = 0; k++; splashes.push({ x: sx, y: sy, t: 0 }); Snd.tone(900 + k * 40, 0.04, 'sine', 0.05); if (k > skips) { phase = 'end'; splashes.push({ x: sx, y: sy, t: -0.1 }); Snd.sfx('splash'); best = Math.max(best, skips); api.o.querySelector('#sInfo').textContent = `${skips} × gesprungen!${skips >= 8 ? ' Wahnsinn!' : ''} Noch ${tries} Würfe.`; setTimeout(() => { if (tries > 0) phase = 'aim'; else api.finish(best); }, 1100); } }
        }
        api.o.querySelector('#sB').textContent = `Bester Wurf ${best}× · Rekord ${Math.max(best, G.S.rec.stone)}×`;
      };
    });
  },

  /* ---------- Kicker ---------- */
  kicker(opp) {
    return this.run('Tischfussball', opp ? `gegen ${opp.name}` : 'gegen dich selbst', `<canvas aria-label="Kickertisch"></canvas><div class="mini-bar"><span id="kInfo">Schiess, wenn der Torwart zur Seite rutscht!</span><b id="kS">0 : 0</b></div><button class="btn primary" id="kShot">Schuss!</button>`, 160, 100, (api) => {
      let me = 0, op = 0, t = 0, phase = 'aim', ball = null, msg = '';
      const gk = () => Math.sin(t * 2.4) * 0.8 + Math.sin(t * 5.3) * 0.2;
      const shoot = () => {
        if (phase !== 'aim') return;
        const target = rnd(-0.25, 0.25) + Math.sin(t * 9) * 0.1 * Mini.wob();
        ball = { x: 30, y: 50, ty: 50 + target * 40, goal: Math.abs(gk() - target) > 0.42 };
        phase = 'shot'; Snd.sfx('hit');
      };
      api.o.querySelector('#kShot').onclick = shoot;
      api.cv.addEventListener('pointerdown', shoot);
      Mini.key = (k) => { if (['Space', 'Enter', 'KeyE'].includes(k)) shoot(); };
      return (dt) => {
        t += dt;
        const c = api.ctx;
        R(c, 0, 0, 160, 100, '#5a3a24'); R(c, 6, 6, 148, 88, '#3f8a3a'); R(c, 80, 6, 1, 88, '#e8f0e8'); R(c, 150, 34, 4, 32, '#e8f0e8');
        for (let x = 20; x < 150; x += 26) { R(c, x, 0, 2, 100, '#c9ccd2'); }
        const gy = 50 + gk() * 18;
        R(c, 138, gy - 6, 6, 12, '#2f5fb8'); R(c, 139, gy - 8, 4, 3, '#f2d0b0');
        R(c, 24, 46, 6, 12, '#c8352d'); R(c, 25, 44, 4, 3, '#f2d0b0');
        if (ball) {
          ball.x += dt * 160; ball.y += (ball.ty - ball.y) * dt * 4;
          E(c, ball.x, ball.y, 2, 2, '#ffffff');
          if (ball.x > 146) {
            if (ball.goal) { me++; msg = 'TOR!'; Snd.sfx('cheer'); } else { msg = 'Gehalten!'; }
            ball = null; phase = 'opp';
            setTimeout(() => { const skill = opp && opp.fn === 'frech' ? 0.55 : 0.42; if (Math.random() < skill) { op++; msg = `${opp ? opp.name : 'Gegner'} trifft!`; Snd.sfx('hit'); } else msg = 'Du hältst!'; phase = 'aim'; }, 700);
          }
        }
        api.o.querySelector('#kInfo').textContent = msg || 'Schiess, wenn der Torwart zur Seite rutscht!';
        api.o.querySelector('#kS').textContent = `${me} : ${op}`;
        if (phase === 'aim' && (me >= 3 || op >= 3)) { api.finish(me >= 3); UI.toast(me >= 3 ? `Kicker gewonnen ${me}:${op}!` : `Kicker verloren ${me}:${op}.`); }
      };
    });
  },

  /* ---------- Panorama ---------- */
  panorama(kind) {
    const tower = kind === 'turm';
    return this.run(tower ? 'Blick vom Stadtturm' : 'Fernrohr auf der Seegrube', tower ? '31 m über der Altstadt' : '1.905 m · Blick nach Süden', `<div style="overflow-x:auto;touch-action:pan-x;border-radius:8px"><canvas aria-label="Panorama" style="width:auto;height:240px;max-width:none"></canvas></div><p class="note" id="pInfo">Wisch zur Seite, um dich umzusehen.</p>${!tower && !G.S.photos.seegrube ? '<button class="btn primary" id="pFoto">Foto machen</button>' : ''}<button class="btn" id="pOk">Zurück</button>`, 480, 160, (api) => {
      api.o.querySelector('#pOk').onclick = () => api.finish(true);
      const pf = api.o.querySelector('#pFoto');
      if (pf) pf.onclick = () => { G.photoImg = G.photoImg || {}; G.photoImg.seegrube = api.cv.toDataURL(); addPhoto('seegrube'); pf.remove(); };
      const c = api.ctx;
      const night = isNight();
      const sky = c.createLinearGradient(0, 0, 0, 100);
      sky.addColorStop(0, night ? '#0a1028' : '#7fb2e0'); sky.addColorStop(1, night ? '#28345a' : '#d8eaf4');
      c.fillStyle = sky; c.fillRect(0, 0, 480, 160);
      const ridge = (base, amp, f, col, snow, s) => { for (let x = 0; x < 480; x++) { let v = 0; for (let k = 1; k < 4; k++) v += Math.abs(Math.sin(x / 480 * f * k + s * k)) / k; const y = base - v * amp; R(c, x, y, 1, 160 - y, col); if (snow && v > 1.05) R(c, x, y, 1, 3, night ? '#9aa8c8' : '#f4f6f8'); } };
      if (tower) {
        ridge(70, 34, 7, night ? '#2a3046' : '#8c8a86', true, 1.3);
        ridge(92, 14, 11, night ? '#1a2a24' : '#3a5a34', false, 2);
        for (let i = 0; i < 70; i++) { const x = (i * 53) % 480, w = 14 + (i * 7) % 18, y = 100 + (i * 11) % 40; R(c, x, y, w, 60, night ? '#2a2a3a' : PASTELS[i % PASTELS.length]); R(c, x - 1, y - 6, w + 2, 7, night ? '#3a2a2a' : ROOFS[i % ROOFS.length]); if (night) for (let k = 0; k < 3; k++) if ((i + k) % 2) R(c, x + 3 + k * 4, y + 6, 2, 3, '#ffd27a'); }
        R(c, 228, 92, 20, 30, '#e8b830'); for (let k = 0; k < 10; k++) R(c, 224 + k * 0.6, 84 + k, 28 - k * 1.2, 1, '#f8d860');
        pxText(c, 'GOLDENES DACHL', 200, 76, '#ffffff'); pxText(c, 'NORDKETTE', 60, 24, '#ffffff'); pxText(c, 'SEEGRUBE', 300, 40, '#ffffff'); R(c, 330, 46, 2, 6, '#ffffff');
        pxText(c, 'DOM', 380, 90, '#ffffff'); R(c, 372, 98, 6, 22, '#f0d8b8'); R(c, 390, 98, 6, 22, '#f0d8b8'); E(c, 375, 96, 3, 3, '#5f8a7a'); E(c, 393, 96, 3, 3, '#5f8a7a');
      } else {
        ridge(66, 30, 9, night ? '#2a3046' : '#9aa6b8', true, 0.4);
        ridge(84, 18, 6, night ? '#1e2638' : '#6a7a62', false, 1.9);
        R(c, 0, 112, 480, 48, night ? '#141a2a' : '#7a9a5a');
        R(c, 0, 118, 480, 5, night ? '#20304a' : '#4a8aa8');
        for (let i = 0; i < 260; i++) { const x = (i * 37) % 480, y = 120 + (i * 13) % 38; R(c, x, y, 2, 2, night ? (i % 3 ? '#ffd27a' : '#fff0c0') : (i % 2 ? '#e8d8c0' : '#c8a088')); }
        pxText(c, 'PATSCHERKOFEL', 330, 30, '#ffffff'); pxText(c, 'SERLES', 210, 26, '#ffffff'); pxText(c, 'STUBAIER ALPEN', 40, 22, '#ffffff'); pxText(c, 'INNSBRUCK', 180, 104, '#ffffff'); pxText(c, 'INN', 60, 124, '#ffffff'); pxText(c, 'BERGISEL', 120, 92, '#ffffff'); R(c, 140, 98, 3, 10, '#d8d8d8');
      }
      return () => {};
    });
  },
};
