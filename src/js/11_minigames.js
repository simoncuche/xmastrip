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
    return this.run('Darts', opp ? `gegen ${opp.name}` : 'Training', `<canvas aria-label="Dartscheibe"></canvas><div class="mini-bar"><span id="dInfo">Tippe oder drück A, wenn das Fadenkreuz richtig steht.</span><b id="dScore">0</b></div><button class="btn primary" id="dThrow">Werfen</button>${'DeviceOrientationEvent' in window ? '<button class="btn" id="dTilt">📱 Mit Handyneigung zielen</button>' : ''}`, 160, 132, (api) => {
      const st = { round: 1, dart: 0, me: 0, opp: 0, darts: [], turn: 'me', t: 0, msg: '', aiT: 0, bull: false, phase: 'aim', wait: 0 };
      const amp = 22 * Mini.wob();
      /* Zielen per Handyneigung: Lage beim Einschalten = Mitte der Scheibe; Alkohol und Müdigkeit lassen das Kreuz zittern */
      const tilt = { on: false, b0: null, g0: null, x: CX, y: CY, tx: CX, ty: CY };
      const onOri = (e) => {
        if (!api.cv.isConnected) { window.removeEventListener('deviceorientation', onOri); return; }
        if (e.beta == null || e.gamma == null) return;
        const ang = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
        let ix = e.gamma, iy = e.beta;
        if (ang === 90) { ix = e.beta; iy = -e.gamma; } else if (ang === -90 || ang === 270) { ix = -e.beta; iy = e.gamma; }
        if (tilt.b0 == null) { tilt.g0 = ix; tilt.b0 = iy; }
        tilt.tx = clamp(CX + (ix - tilt.g0) * 3.2, 4, 156); tilt.ty = clamp(CY + (iy - tilt.b0) * 3.2, 4, 128);
      };
      const tiltBtn = api.o.querySelector('#dTilt');
      const enableTilt = async () => {
        try { if (typeof DeviceOrientationEvent.requestPermission === 'function') { const r = await DeviceOrientationEvent.requestPermission(); if (r !== 'granted') { UI.toast('Ohne Erlaubnis für Bewegungssensoren geht das Zielen per Neigung nicht.', 'warn'); return; } } } catch (e) { UI.toast('Bewegungssensoren sind hier nicht verfügbar.', 'warn'); return; }
        if (!tilt.on) window.addEventListener('deviceorientation', onOri);
        if (typeof Shake !== 'undefined') Shake.ask();
        tilt.on = true; tilt.b0 = null; tilt.g0 = null; tilt.x = tilt.tx = CX; tilt.y = tilt.ty = CY;
        G.S.flags.dartsTilt = 1;
        if (tiltBtn) tiltBtn.textContent = '📱 Neu ausrichten (Mitte = jetzige Lage)';
        st.msg = 'Handy neigen zum Zielen, tippen zum Werfen.';
      };
      if (tiltBtn) tiltBtn.onclick = enableTilt;
      if (G.S.flags.dartsTilt && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') enableTilt();
      Mini._darts = { tilt, enableTilt }; /* für Tests */
      const aim = () => {
        if (tilt.on) { const w = 3.5 + Math.max(0, Mini.wob() - 1) * 7; return [tilt.x + Math.sin(st.t * 2.3) * w + Math.sin(st.t * 5.7) * w * 0.4, tilt.y + Math.sin(st.t * 1.9 + 1) * w + Math.cos(st.t * 6.1) * w * 0.3]; }
        return [CX + Math.sin(st.t * 1.7) * amp + Math.sin(st.t * 4.1) * amp * 0.25, CY + Math.sin(st.t * 2.3 + 1) * amp * 0.8];
      };
      const throwIt = () => {
        if (st.turn !== 'me' || st.phase !== 'aim') return;
        const [ax, ay] = aim();
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
        if (tilt.on) { const k = 1 - Math.pow(0.0005, dt); tilt.x += (tilt.tx - tilt.x) * k; tilt.y += (tilt.ty - tilt.y) * k; }
        if (st.turn === 'me' && st.phase === 'aim' && st.wait <= 0) {
          const [ax, ay] = aim();
          for (const [col, o] of [['#101014', 1], ['#ffffff', 0]]) { R(c, ax - 7 - o, ay - o, 5 + o * 2, 1 + o * 2, col); R(c, ax + 3 - o, ay - o, 5 + o * 2, 1 + o * 2, col); R(c, ax - o, ay - 7 - o, 1 + o * 2, 5 + o * 2, col); R(c, ax - o, ay + 3 - o, 1 + o * 2, 5 + o * 2, col); }
          c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1; c.beginPath(); c.arc(ax + 0.5, ay + 0.5, 5, 0, Math.PI * 2); c.stroke(); P(c, ax, ay, '#ff3a3a');
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

  /* ---------- Wirtshausrauferei im Stüberl: Gegner holt aus (hoch → ducken, tief → blocken), verfehlt er, wankt er – dann zuschlagen ---------- */
  brawl(opp, o = {}) {
    const W = 160, H = 120, GY = 110;
    const st0 = G.S.st, L0 = G.S.look;
    const mut = st0.prom > 0.4 && st0.prom < 1.6 ? 1.2 : 1;
    const wob = Mini.wob();
    const dmgMul = mut * (0.7 + st0.energy / 330) * [0.85, 1, 1.12, 1.25][L0.build];
    const guardT = clamp(0.5 / Math.max(1, wob * 0.85), 0.28, 0.5);
    const allies = o.allies || [];
    const mySheet = getSheet(L0), opSheet = getSheet(opp.look);
    const crowd = (o.crowd || []).slice(0, 4).map((c) => ({ sheet: getSheet(c.look), name: c.name }));
    const regulars = (o.regulars || []).map((L) => getSheet(L));
    const resi = o.resi ? getSheet(o.resi) : null;
    const pose = (sh, pz, dir, x, y, s = 2, alpha = 1) => { c0.globalAlpha = alpha; c0.drawImage(sh, POSE_IDX[pz] * SPR_W, dir * SPR_H, SPR_W, SPR_H, Math.round(x - SPR_W * s / 2), Math.round(y - SPR_H * s), SPR_W * s, SPR_H * s); c0.globalAlpha = 1; };
    let c0 = null;
    const POSE_IDX = { stand: 0, walkA: 1, walkB: 2, sit: 3, drink: 4, danceA: 5, danceB: 6, bend: 7 };
    return this.run('Wirtshausrauferei', `gegen ${opp.name}`, `<canvas aria-label="Rauferei"></canvas><div class="mini-bar"><span id="bInfo">Er holt aus: <b>hoch</b> → ducken, <b>tief</b> → blocken. Wankt er: zuschlagen!</span><b id="bScore"></b></div><div class="lanes" style="grid-template-columns:repeat(${allies.length ? 4 : 3},1fr)"><button data-b="duck">⬇ Ducken</button><button data-b="punch" class="primary">Schlag</button><button data-b="block">Blocken</button>${allies.length ? '<button data-b="ally">Kumpel!</button>' : ''}</div>`, W, H, (api) => {
      c0 = api.ctx;
      const me = { x: 58, hp: 100, act: null, actT: 0, cd: 0, punchT: 0, hitT: 0, kx: 0, ko: 0, miss: 0 };
      const op = { x: 104, hp: 100, phase: 'intro', pt: 1.5, kind: null, tele: 0.66, punchT: 0, hitT: 0, kx: 0, ko: 0, hat: { on: true }, attacks: 0 };
      let t = 0, done = false, msg = 'FIGHT!', msgT = 0, msgCol = '#ffd23d', shake = 0, cheer = 0, allyUsed = false, mug = null, hatFly = null, flash = 0;
      const parts = [];
      const say = (m, col = '#ffd23d', d = 0.9) => { msg = m; msgT = d; msgCol = col; };
      say('FIGHT!', '#ffd23d', 1.2);
      const pow = (x, y, txt, col) => { for (let k = 0; k < 8; k++) parts.push({ x, y, vx: rnd(-50, 50), vy: rnd(-60, -10), t: 0, life: 0.5, k: 'star', col: k % 2 ? '#ffd23d' : '#ffffff' }); parts.push({ x, y: y - 6, vx: 0, vy: -16, t: 0, life: 0.7, k: 'txt', txt, col }); };
      const sweat = (x, y) => { for (let k = 0; k < 3; k++) parts.push({ x: x + rnd(-6, 6), y: y + rnd(-4, 4), vx: rnd(-20, 20), vy: rnd(-30, -10), g: 120, t: 0, life: 0.6, k: 'drop' }); };
      const hurtMe = (dmg, kind) => {
        me.hp = Math.max(0, me.hp - dmg); me.hitT = 0.35; me.kx = -8; shake = 1; flash = 0.12; cheer = 1;
        Snd.sfx('hit'); Snd.tone(110, 0.15, 'square', 0.1, 0, -40);
        pow(me.x + 4, GY - (kind === 'hoch' ? 50 : 30), kind === 'hoch' ? 'WATSCHN!' : 'UFF!', '#ff6a5a'); sweat(me.x, GY - 48);
        if (me.hp <= 0) { me.ko = 0.001; say('K.O.', '#ff6a5a', 3); Snd.sfx('lose'); }
      };
      const hurtOp = (dmg, crit) => {
        op.hp = Math.max(0, op.hp - dmg); op.hitT = 0.3; op.kx = crit ? 10 : 5; shake = crit ? 0.8 : 0.4; cheer = 1;
        Snd.sfx('hit'); Snd.tone(crit ? 90 : 150, 0.12, 'square', 0.1, 0, -30);
        pow(op.x - 6, GY - 48, crit ? pick(['WUMMS!', 'KRACH!', 'BAM!']) : pick(['POW', 'ZACK']), crit ? '#ffd23d' : '#ffffff'); sweat(op.x, GY - 50);
        if (crit && op.hat.on && Math.random() < 0.6) { op.hat.on = false; hatFly = { x: op.x, y: GY - 58, vx: 40, vy: -70, r: 0 }; }
        if (op.hp <= 0) { op.ko = 0.001; op.phase = 'ko'; say('K.O.!', '#7af0a0', 3); Snd.sfx('win'); Snd.sfx('cheer'); }
      };
      const act = (a) => {
        if (done || me.ko || op.ko || op.phase === 'intro') return;
        if (a === 'ally') {
          if (allyUsed || !allies.length) return; allyUsed = true;
          mug = { x: 8, y: GY - 60, vx: 150, vy: -40, r: 0, who: allies[0] };
          say(`${allies[0]}!`, '#7fb4e2', 0.9); Snd.sfx('whoosh');
          const b = api.o.querySelector('[data-b="ally"]'); if (b) b.disabled = true;
          return;
        }
        if (me.cd > 0) return;
        if (a === 'duck' || a === 'block') { me.act = a; me.actT = guardT; me.cd = guardT + 0.08; Snd.sfx('blip'); return; }
        if (a === 'punch') {
          me.punchT = 0.22; me.cd = 0.38; me.act = null;
          if (Math.random() < (wob - 1) * 0.22) { me.miss = 0.4; say('DANEBEN!', '#ff9a7a', 0.6); Snd.sfx('whoosh'); me.kx = 6; return; }
          if (op.phase === 'open' || op.phase === 'stun') hurtOp(Math.round(10 * dmgMul), true);
          else if (op.phase === 'wind') hurtOp(Math.round(3 * dmgMul), false);
          else if (Math.random() < 0.8) { say('GEBLOCKT', '#c9ccd2', 0.5); Snd.tone(300, 0.05, 'square', 0.05); op.kx = 2; op.guardT = 0.25; }
          else hurtOp(Math.round(3 * dmgMul), false);
        }
      };
      api.o.querySelectorAll('[data-b]').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); act(b.dataset.b); }));
      Mini.key = (k) => { if (['ArrowDown', 'KeyS'].includes(k)) act('duck'); if (['Space', 'KeyE', 'Enter'].includes(k)) act('punch'); if (['ArrowUp', 'KeyW', 'KeyB'].includes(k)) act('block'); if (k === 'KeyK') act('ally'); };
      Mini._brawl = { me, op, act }; /* für Tests */
      const info = api.o.querySelector('#bScore');
      return (dt) => {
        const c = api.ctx;
        t += dt; if (msgT > 0) msgT -= dt; if (shake > 0) shake = Math.max(0, shake - dt * 3); if (flash > 0) flash -= dt; if (cheer > 0) cheer -= dt * 0.8;
        me.cd = Math.max(0, me.cd - dt); me.punchT = Math.max(0, me.punchT - dt); me.hitT = Math.max(0, me.hitT - dt); me.miss = Math.max(0, me.miss - dt);
        if (me.actT > 0) { me.actT -= dt; if (me.actT <= 0) me.act = null; }
        me.kx *= Math.pow(0.02, dt); op.kx *= Math.pow(0.02, dt);
        op.punchT = Math.max(0, op.punchT - dt); op.hitT = Math.max(0, op.hitT - dt); if (op.guardT) op.guardT = Math.max(0, op.guardT - dt);
        /* ---- Gegner-KI ---- */
        if (!me.ko && !op.ko) {
          op.pt -= dt;
          if (op.phase === 'intro' && op.pt <= 0) { op.phase = 'idle'; op.pt = rnd(0.6, 1.1); }
          else if (op.phase === 'idle' && op.pt <= 0) { op.phase = 'wind'; op.kind = Math.random() < 0.5 ? 'hoch' : 'tief'; op.pt = op.tele * rnd(0.85, 1.15); Snd.tone(op.kind === 'hoch' ? 520 : 260, 0.08, 'square', 0.05); }
          else if (op.phase === 'wind' && op.pt <= 0) {
            op.phase = 'strike'; op.pt = 0.18; op.punchT = 0.2; op.attacks++; op.tele = Math.max(0.42, op.tele * 0.97);
            const ok = (op.kind === 'hoch' && me.act === 'duck') || (op.kind === 'tief' && me.act === 'block');
            if (ok) { op.res = 'miss'; say(op.kind === 'hoch' ? 'GEDUCKT!' : 'GEBLOCKT!', '#7af0a0', 0.7); Snd.sfx('whoosh'); if (op.kind === 'tief') { Snd.tone(200, 0.06, 'square', 0.06); me.kx = -3; } }
            else { op.res = 'hit'; hurtMe(op.kind === 'hoch' ? 16 : 13, op.kind); }
          } else if (op.phase === 'strike' && op.pt <= 0) {
            if (op.res === 'miss') { op.phase = 'open'; op.pt = 0.8; say('ER WANKT! ZUSCHLAGEN!', '#ffd23d', 0.9); } else { op.phase = 'idle'; op.pt = rnd(0.5, 1.1); }
          } else if ((op.phase === 'open' || op.phase === 'stun') && op.pt <= 0) { op.phase = 'idle'; op.pt = rnd(0.5, 0.9); }
        }
        /* Bierkrug vom Kumpel */
        if (mug) { mug.x += mug.vx * dt; mug.y += mug.vy * dt; mug.vy += 160 * dt; mug.r += dt * 14; if (mug.x >= op.x - 6) { hurtOp(18, true); op.phase = 'stun'; op.pt = 1.3; for (let k = 0; k < 10; k++) parts.push({ x: op.x - 4, y: GY - 52, vx: rnd(-40, 40), vy: rnd(-60, 0), g: 140, t: 0, life: 0.7, k: 'beer' }); mug = null; } }
        if (hatFly) { hatFly.x += hatFly.vx * dt; hatFly.y += hatFly.vy * dt; hatFly.vy += 200 * dt; hatFly.r += dt * 9; if (hatFly.y > GY - 2) { hatFly.y = GY - 2; hatFly.vx = 0; hatFly.vy = 0; } }
        for (const pp of parts) { pp.t += dt; pp.x += pp.vx * dt; pp.y += pp.vy * dt; if (pp.g) pp.vy += pp.g * dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].t > parts[i].life) parts.splice(i, 1);
        if (me.ko) me.ko += dt; if (op.ko) op.ko += dt;
        if (!done && (me.ko > 2.2 || op.ko > 2.2)) { done = true; api.finish({ win: !!op.ko, hp: me.hp, attacks: op.attacks, ally: allyUsed }); }
        /* ---- Zeichnen ---- */
        c.save();
        if (shake > 0) c.translate(Math.round(rnd(-2, 2) * shake), Math.round(rnd(-2, 2) * shake));
        /* Stube: Holztäfer, Herrgottswinkel, Geweih, Fenster, Kachelofen, Boden */
        R(c, -4, -4, W + 8, H + 8, '#5a3a1e');
        for (let x = 0; x < W; x += 8) { R(c, x, 0, 7, 74, (x / 8) % 2 ? '#7a4a28' : '#704424'); R(c, x + 7, 0, 1, 74, '#4a2e16'); }
        R(c, 0, 72, W, 3, '#4a2e16'); R(c, 0, 18, W, 2, '#4a2e16');
        R(c, 8, 24, 2, 10, '#3a2210'); R(c, 5, 27, 8, 2, '#3a2210');
        for (const ax of [46, 112]) { R(c, ax, 30, 6, 4, '#e8dcc0'); line(c, ax, 30, ax - 6, 23, '#d8c8a0'); line(c, ax + 5, 30, ax + 11, 23, '#d8c8a0'); line(c, ax - 3, 27, ax - 6, 28, '#d8c8a0'); line(c, ax + 8, 27, ax + 11, 28, '#d8c8a0'); }
        R(c, 70, 34, 22, 14, '#3a2210'); R(c, 72, 36, 18, 10, isNight() ? '#1a2a4a' : '#9ac0d8'); R(c, 80, 36, 2, 10, '#3a2210'); if (isNight()) { P(c, 75, 38, '#ffffff'); P(c, 86, 41, '#ffffff'); }
        R(c, 140, 26, 20, 50, '#3f7a5a'); for (let y = 28; y < 74; y += 6) for (let x = 141; x < 160; x += 6) R(c, x, y, 5, 5, (x + y) % 4 ? '#4f8a6a' : '#5a9a7a'); E(c, 150, 70, 6, 3, `rgba(255,150,60,${0.4 + Math.sin(t * 6) * 0.15})`);
        for (let y = 75; y < H; y += 5) { R(c, 0, y, W, 4, (y / 5) % 2 ? '#8a5a34' : '#80522e'); R(c, 0, y + 4, W, 1, '#5a3a1e'); }
        /* Hintergrund: Stammtisch mit Stammgästen, Resi hinterm Tresen, die Jungs feuern an */
        R(c, 0, 50, 32, 24, '#5a3418'); R(c, 0, 50, 32, 2, '#a8784a');
        if (resi) { const panic = me.ko || op.ko; pose(resi, panic ? 'danceA' : 'stand', 0, 16, 56, 1); if (panic) { R(c, 22, 30, 2, 10, '#c8a070'); } }
        R(c, 96, 60, 40, 6, '#a8784a'); R(c, 98, 66, 3, 10, '#5a3a1e'); R(c, 131, 66, 3, 10, '#5a3a1e'); R(c, 96, 60, 40, 2, '#c8352d');
        for (let k = 0; k < 3; k++) { R(c, 102 + k * 10, 55, 4, 5, '#e8b33a'); R(c, 102 + k * 10, 54, 4, 1, '#fbf6e8'); }
        regulars.forEach((sh, i) => { const jump = cheer > 0 ? Math.abs(Math.sin(t * 14 + i)) * 2 : 0; pose(sh, cheer > 0 ? (i % 2 ? 'danceA' : 'danceB') : 'sit', 0, 104 + i * 22, 66 - jump, 1); });
        crowd.forEach((cr, i) => { const jump = Math.abs(Math.sin(t * (cheer > 0 ? 12 : 3) + i * 1.3)) * (cheer > 0 ? 4 : 1); pose(cr.sheet, Math.floor(t * 4 + i) % 2 ? 'danceA' : 'danceB', 0, 40 + i * 16, 74 - jump, 1); });
        /* Bänke als Kampfplatz-Rand */
        R(c, 0, 102, 8, 8, '#6a4428'); R(c, 152, 102, 8, 8, '#6a4428');
        /* ---- Kämpfer ---- */
        const shadow = (x) => E(c, x, GY + 1, 14, 3, 'rgba(0,0,0,0.3)');
        shadow(me.x + me.kx); shadow(op.x + op.kx);
        /* Gegner */
        const ox = op.x + op.kx;
        if (op.ko) { c.save(); c.translate(ox, GY); c.rotate(Math.min(1, op.ko * 3) * Math.PI / 2); pose(opSheet, 'stand', 1, 0, 0, 2); c.restore(); for (let k = 0; k < 3; k++) { const a = t * 5 + k * 2.1; pxText(c, '*', ox + 14 + Math.cos(a) * 8, GY - 22 + Math.sin(a) * 3, '#ffd23d'); } }
        else {
          const wind = op.phase === 'wind', strike = op.phase === 'strike', open = op.phase === 'open' || op.phase === 'stun';
          const lean = wind ? 4 : strike ? -6 : open ? Math.sin(t * 10) * 3 : 0;
          const bob = op.phase === 'idle' ? Math.abs(Math.sin(t * 5)) * 1 : 0;
          pose(opSheet, op.hitT > 0 ? 'bend' : open ? (Math.floor(t * 6) % 2 ? 'walkA' : 'walkB') : 'stand', 1, ox + lean, GY - bob, 2, op.hitT > 0 && Math.floor(t * 30) % 2 ? 0.6 : 1);
          const skin = lc(opp.look, 'skin'), sleeve = lc(opp.look, 'topCol');
          /* Ausholen: Faust weit zurück, hoch über dem Kopf oder tief in der Hüfte, mit Warnzeichen */
          if (wind) { const hy = op.kind === 'hoch' ? GY - 54 : GY - 24; R(c, ox + lean + 6, hy, 10, 5, sleeve); R(c, ox + lean + 15, hy - 1, 6, 7, skin); const blink = Math.floor(t * 12) % 2; pxText(c, op.kind === 'hoch' ? 'HOCH!' : 'TIEF!', ox - 12, GY - 66, blink ? '#ff6a5a' : '#ffd23d'); line(c, ox - 26, hy + 2, ox - 18, hy + 2, '#ff6a5a'); }
          if (strike) { const hy = op.kind === 'hoch' ? GY - 46 : GY - 26; R(c, ox + lean - 26, hy, 22, 5, sleeve); R(c, ox + lean - 32, hy - 1, 7, 7, skin); for (let k = 0; k < 3; k++) line(c, ox + lean - 4 + k * 4, hy - 2 + k * 3, ox + lean + 6 + k * 4, hy - 2 + k * 3, 'rgba(255,255,255,0.6)'); }
          if (open) for (let k = 0; k < 3; k++) { const a = t * 6 + k * 2.1; pxText(c, '*', ox - 2 + Math.cos(a) * 8, GY - 60 + Math.sin(a) * 3, '#ffd23d'); }
          if (op.guardT > 0) { R(c, ox - 10, GY - 46, 6, 14, sleeve); R(c, ox - 11, GY - 48, 7, 5, skin); }
          if (!op.hat.on) { R(c, ox - 6, GY - 54, 12, 2, lc(opp.look, 'hairCol')); }
        }
        if (hatFly) { c.save(); c.translate(hatFly.x, hatFly.y); c.rotate(hatFly.r); R(c, -6, -2, 12, 3, '#3f5a3b'); R(c, -3, -5, 6, 3, '#3f5a3b'); R(c, 2, -9, 1, 4, '#1d1d1d'); c.restore(); }
        /* Spieler */
        const mx = me.x + me.kx;
        if (me.ko) { c.save(); c.translate(mx, GY); c.rotate(-Math.min(1, me.ko * 3) * Math.PI / 2); pose(mySheet, 'stand', 2, 0, 0, 2); c.restore(); for (let k = 0; k < 3; k++) { const a = t * 5 + k * 2.1; pxText(c, '*', mx - 18 + Math.cos(a) * 8, GY - 22 + Math.sin(a) * 3, '#ffd23d'); } }
        else {
          const ducking = me.act === 'duck', blocking = me.act === 'block';
          const skin = lc(L0, 'skin'), sleeve = effLook(L0).costume ? (COSTUMES[L0.costume] || {}).topC || lc(L0, 'topCol') : lc(L0, 'topCol');
          if (ducking) pose(mySheet, 'bend', 2, mx - 2, GY + 10, 2);
          else pose(mySheet, me.hitT > 0 ? 'bend' : me.miss > 0 ? 'walkA' : 'stand', 2, mx + (me.punchT > 0 ? 4 : 0), GY, 2, me.hitT > 0 && Math.floor(t * 30) % 2 ? 0.6 : 1);
          if (blocking) { R(c, mx + 6, GY - 46, 6, 18, sleeve); R(c, mx + 6, GY - 48, 7, 5, skin); R(c, mx + 4, GY - 30, 6, 10, sleeve); }
          if (me.punchT > 0) { const ext = Math.sin((1 - me.punchT / 0.22) * Math.PI) * 20; R(c, mx + 8, GY - 40, 6 + ext, 5, sleeve); R(c, mx + 13 + ext, GY - 41, 7, 7, skin); if (ext > 12) for (let k = 0; k < 3; k++) line(c, mx + 4 + k * 3, GY - 42 + k * 3, mx + 10 + k * 3, GY - 42 + k * 3, 'rgba(255,255,255,0.5)'); }
        }
        if (mug) { c.save(); c.translate(mug.x, mug.y); c.rotate(mug.r); R(c, -3, -4, 6, 8, '#e8b33a'); R(c, -3, -5, 6, 2, '#fbf6e8'); R(c, 3, -2, 2, 4, '#d9e2e6'); c.restore(); }
        for (const pp of parts) {
          const a = 1 - pp.t / pp.life;
          if (pp.k === 'star') P(c, pp.x, pp.y, pp.col);
          else if (pp.k === 'drop') P(c, pp.x, pp.y, `rgba(160,210,255,${a})`);
          else if (pp.k === 'beer') R(c, pp.x, pp.y, 2, 2, `rgba(232,179,58,${a})`);
          else if (pp.k === 'txt') { const w = pxTextW(pp.txt); R(c, pp.x - w / 2 - 2, pp.y - 1, w + 4, 8, `rgba(0,0,0,${0.5 * a})`); pxText(c, pp.txt, pp.x - w / 2, pp.y, pp.col); }
        }
        if (flash > 0) R(c, 0, 0, W, H, `rgba(255,60,60,${flash * 2})`);
        c.restore();
        /* ---- HUD: Lebensbalken wie im Arcade ---- */
        R(c, 4, 3, 64, 7, '#1a1a1a'); R(c, 5, 4, Math.round(62 * me.hp / 100), 5, me.hp > 35 ? '#3fe05a' : '#ff6a5a'); pxText(c, 'DU', 5, 11, '#ffffff');
        R(c, 92, 3, 64, 7, '#1a1a1a'); const ow = Math.round(62 * op.hp / 100); R(c, 93 + 62 - ow, 4, ow, 5, op.hp > 35 ? '#ffb53d' : '#ff6a5a'); const on = opp.name.toUpperCase().slice(0, 10); pxText(c, on, 155 - pxTextW(on), 11, '#ffffff');
        pxText(c, 'VS', 74, 4, '#ffd23d');
        if (msgT > 0) { const w = pxTextW(msg); R(c, 80 - w / 2 - 3, 22, w + 6, 9, 'rgba(0,0,0,0.6)'); pxText(c, msg, 80 - w / 2, 23, msgCol); }
        info.textContent = `${me.hp} : ${op.hp}`;
        api.o.querySelectorAll('[data-b="duck"],[data-b="block"],[data-b="punch"]').forEach((b) => { b.style.opacity = me.cd > 0 ? 0.6 : 1; });
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



  /* ---------- Skispringen am Bergisel: Anlauf, Absprung, Flug mit Haltung, Telemark ---------- */
  skijump() {
    const W = 160, H = 120, S = 2.0; /* Pixel pro Meter */
    const LAND = (() => { const l = [0]; let y = 0; for (let x = 1; x <= 220; x++) { let s; if (x < 8) s = 0.12 + x / 8 * 0.3; else if (x < 30) s = 0.42 + (x - 8) / 22 * 0.25; else if (x < 118) s = 0.67; else if (x < 140) s = 0.67 - (x - 118) / 22 * 0.45; else if (x < 165) s = 0.22 - (x - 140) / 25 * 0.22; else s = 0; y += s; l.push(y); } return l; })();
    const IN = (() => { const a = []; let y = 0; for (let u = 0; u <= 70; u++) { a.push(y); y += u < 44 ? 0.72 : u < 64 ? 0.72 - (u - 44) / 20 * 0.54 : 0.18; } const end = a[70]; return a.map((v) => v - end); })();
    const yHill = (x) => { if (x <= -70) return IN[0]; if (x < 0) { const u = x + 70, i = Math.floor(u), f = u - i; return IN[i] * (1 - f) + (IN[i + 1] ?? IN[i]) * f; } if (x >= 220) return LAND[220]; const i = Math.floor(x), f = x - i; return LAND[i] * (1 - f) + LAND[i + 1] * f; };
    const slopeAt = (x) => yHill(x + 0.5) - yHill(x - 0.5);
    const night = isNight(), wob = Mini.wob();
    const wind = Math.round(rnd(-2, 2) * 10) / 10; /* positiv = Aufwind, hilft */
    const PH = { v0: 0.4, v1: 2.4, l0: 0.6, l1: 3.9, lw: 0.2 };
    const suit = lc(G.S.look, 'topCol'), skin = lc(G.S.look, 'skin'), seed = Math.random() * 7;
    const sheet = getSheet(G.S.look);
    return this.run('Bergiselschanze', 'Gästespringen · HS 128', `<canvas aria-label="Schanze"></canvas><div class="mini-bar"><span id="sjInfo">Tippe START.</span><b id="sjDist">–</b></div><div class="lanes"><button id="sjL" aria-label="Vorlage">◀ Vorlage</button><button id="sjA" class="primary">START</button><button id="sjR" aria-label="Rücklage">Rücklage ▶</button></div>`, W, H, (api) => {
      const st = { phase: 'ready', x: -70, y: yHill(-70) - 1, v: 0, vx: 0, vy: 0, t: 0, pt: 0, lean: 0, q: 1, qSum: 0, qN: 0, tq: 0, tap: -9, msg: '', msgT: 0, msgCol: '#ffb53d', d: 0, tele: false, crash: false, res: null, spin: 0, parts: [], cheer: 0, ang: 0 };
      const info = api.o.querySelector('#sjInfo'), dist = api.o.querySelector('#sjDist'), btnA = api.o.querySelector('#sjA');
      const flash = (m, col = '#ffb53d', t = 0.9) => { st.msg = m; st.msgT = t; st.msgCol = col; };
      const takeoff = () => {
        const tq = clamp(1 - Math.abs(st.x + 1.5) / 7, 0, 1);
        st.tq = tq; st.phase = 'flight'; st.pt = 0; st.vx = st.v; st.vy = -(PH.v0 + PH.v1 * tq); st.y = yHill(0) - 2.2; if (st.x < 0) st.x = 0;
        flash(tq > 0.85 ? 'PERFEKT!' : tq > 0.5 ? 'GUT' : st.x < -1.5 ? 'ZU FRÜH' : 'ZU SPÄT', tq > 0.5 ? '#7af0a0' : '#ffb53d');
        Snd.sfx('whoosh'); btnA.textContent = 'TELEMARK'; info.textContent = 'Haltung halten: Balken im grünen Bereich. Vor dem Boden: TELEMARK.';
      };
      const land = () => {
        st.d = Math.round(st.x * 2) / 2;
        const since = st.pt - st.tap;
        st.tele = since >= 0 && since < 0.6 && !st.crash;
        if (!st.crash && (Math.abs(st.lean) > 22 || st.d > 152)) st.crash = true;
        st.phase = 'slide'; st.pt = 0; st.y = yHill(st.x);
        if (st.crash) { Snd.sfx('hit'); Snd.sfx('lose'); flash('STURZ!', '#e2554a', 1.6); }
        else { Snd.sfx(st.tele ? 'win' : 'ok'); flash(st.tele ? 'TELEMARK!' : 'BEIDBEINIG', st.tele ? '#7af0a0' : '#ffb53d', 1.2); Snd.sfx('cheer'); st.cheer = 2.5; }
        for (let k = 0; k < 18; k++) st.parts.push({ x: st.x, y: st.y, vx: rnd(-6, 2), vy: rnd(-9, -2), t: 0, life: rnd(0.4, 0.9) });
        btnA.textContent = 'Weiter';
      };
      const finishJump = () => {
        const qa = st.qN ? st.qSum / st.qN : 0;
        const judges = []; for (let k = 0; k < 5; k++) { const j = st.crash ? 8 + rnd(0, 3) : 16.5 + qa * 2 + (st.tele ? 1 : -0.5) + (st.d > 110 ? 0.5 : 0) + rnd(-0.5, 0.5); judges.push(clamp(Math.round(j * 2) / 2, 5, 20)); }
        judges.sort((a, b) => a - b); const style = judges[1] + judges[2] + judges[3];
        const total = Math.max(0, Math.round((60 + (st.d - 120) * 1.8 + style) * 10) / 10);
        st.res = { d: st.d, style, total, crash: st.crash, telemark: st.tele, judges, wind };
        st.phase = 'result'; info.textContent = st.crash ? 'Sturz. Die Punktrichter schauen weg.' : st.d >= 120 ? 'Über den K-Punkt!' : 'Gelandet.';
        Snd.sfx(st.crash ? 'lose' : st.d >= 120 ? 'win' : 'ok');
      };
      const act = () => {
        if (st.phase === 'ready') { st.phase = 'go'; st.pt = 0; Snd.sfx('ding'); btnA.textContent = 'ABSPRUNG'; info.textContent = 'Anlauf … am Schanzentisch ABSPRUNG drücken!'; }
        else if (st.phase === 'inrun') { if (st.x < -14) flash('NOCH NICHT!', '#e2554a', 0.5); else takeoff(); }
        else if (st.phase === 'flight') { st.tap = st.pt; }
        else if (st.phase === 'result') api.finish(st.res);
      };
      const lean = (dir) => { if (st.phase === 'flight') { st.lean += dir * 5; Snd.sfx('blip'); } };
      btnA.addEventListener('pointerdown', (e) => { e.preventDefault(); act(); });
      api.o.querySelector('#sjL').addEventListener('pointerdown', (e) => { e.preventDefault(); lean(-1); });
      api.o.querySelector('#sjR').addEventListener('pointerdown', (e) => { e.preventDefault(); lean(1); });
      Mini.key = (k) => { if (['Space', 'Enter', 'KeyE'].includes(k)) act(); if (['ArrowLeft', 'KeyA'].includes(k)) lean(-1); if (['ArrowRight', 'KeyD'].includes(k)) lean(1); };
      Mini._sj = { st, act, lean, yHill }; /* für Tests */
      const crowdCol = ['#c8352d', '#2f5fb8', '#e8c23a', '#f4f0e6', '#3a3c40', '#7a2f3a', '#3f8e4b'];
      /* Skispringer: Anzug in deiner Oberteilfarbe, Helm, Brille, Ski */
      const drawSkier = (c, sx, sy, mode, ang, t) => {
        c.save(); c.translate(Math.round(sx), Math.round(sy)); c.rotate(ang);
        const ski = '#ffd23d', helm = '#e8e4dc';
        if (mode === 'ready') { R(c, -6, 2, 14, 1, ski); R(c, -6, 4, 14, 1, ski); R(c, -3, -6, 7, 8, suit); E(c, 1, -8, 2.5, 2.5, helm); P(c, 2, -8, '#1a1a2e'); R(c, -2, 0, 2, 3, '#1a1a2e'); R(c, 2, 0, 2, 3, '#1a1a2e'); }
        else if (mode === 'inrun') { R(c, -9, 3, 18, 1, ski); R(c, -9, 5, 18, 1, ski); R(c, -2, 1, 5, 2, '#1a1a2e'); R(c, -5, -3, 10, 4, suit); R(c, -6, -1, 3, 3, suit); E(c, 6, -4, 2.5, 2.5, helm); P(c, 7, -4, '#1a1a2e'); P(c, 5, -3, skin); if (t > 0.3) for (let k = 0; k < 3; k++) line(c, -12 - k * 3, 2 + k, -16 - k * 3, 2 + k, 'rgba(255,255,255,0.7)'); }
        else if (mode === 'flight') { line(c, -1, 3, -14, 0, ski); line(c, -1, 4, -14, 6, ski); line(c, 0, 3, 13, 1, ski); line(c, 0, 4, 13, 7, ski); R(c, -3, 0, 4, 3, '#1a1a2e'); R(c, -4, -3, 13, 4, suit); R(c, 8, -4, 4, 3, suit); E(c, 12, -4, 2.5, 2.5, helm); P(c, 13, -4, '#1a1a2e'); P(c, 11, -3, skin); line(c, -3, -1, -8, 2, suit); }
        else if (mode === 'tele') { R(c, -10, 3, 20, 1, ski); R(c, -8, 5, 20, 1, ski); R(c, 2, 0, 3, 3, '#1a1a2e'); R(c, -5, 1, 3, 3, '#1a1a2e'); R(c, -3, -7, 6, 8, suit); R(c, -8, -6, 5, 2, suit); R(c, 3, -6, 5, 2, suit); E(c, 0, -9, 2.5, 2.5, helm); P(c, 1, -9, '#1a1a2e'); }
        else if (mode === 'two') { R(c, -9, 3, 18, 1, ski); R(c, -9, 5, 18, 1, ski); R(c, -3, 0, 3, 3, '#1a1a2e'); R(c, 1, 0, 3, 3, '#1a1a2e'); R(c, -3, -6, 7, 7, suit); R(c, -7, -4, 4, 2, suit); R(c, 4, -4, 4, 2, suit); E(c, 0, -8, 2.5, 2.5, helm); P(c, 1, -8, '#1a1a2e'); }
        else { /* Sturz: rollt */ c.rotate(t * 9); R(c, -4, -4, 8, 8, suit); E(c, 4, -3, 2.5, 2.5, helm); R(c, -8, 2, 6, 1, ski); R(c, 3, -7, 1, 6, ski); }
        c.restore();
      };
      let last = 0;
      return (dt, T) => {
        const c = api.ctx;
        st.t += dt;
        /* ---- Physik ---- */
        if (st.phase === 'go') { st.pt += dt; if (st.pt > 1.1) { st.phase = 'inrun'; st.pt = 0; Snd.sfx('ok'); } }
        else if (st.phase === 'inrun') {
          st.pt += dt;
          const sl = slopeAt(st.x); st.v += (9.81 * sl * 0.92 - 0.004 * st.v * st.v) * dt; st.x += st.v * dt * 0.96; st.y = yHill(st.x) - 1;
          if (st.v > 8 && Math.floor(st.t * 8) !== last) { last = Math.floor(st.t * 8); Snd.noise(0.1, 0.02 + st.v / 600, 900 + st.v * 40); }
          if (st.x > 3) { flash('VERSCHLAFEN!', '#e2554a', 1.1); takeoff(); }
        } else if (st.phase === 'flight') {
          st.pt += dt;
          /* Ohne Gegensteuern kippt der Springer langsam in die Rücklage; Wind und Böen kommen dazu, Alkohol macht zittrig */
          const drift = 2.2 + wind * 0.9 + Math.sin(st.pt * 1.7 + seed) * 2.2 + Math.sin(st.pt * 4.3 + seed * 2) * 1.2 * wob + rnd(-1, 1) * (wob - 1) * 3;
          st.lean += drift * dt * 2.4;
          const q = clamp(1 - Math.abs(st.lean) / 14, 0, 1); st.q = q; st.qSum += q * dt; st.qN += dt;
          const L = st.crash ? 0 : PH.l0 + PH.l1 * q + wind * PH.lw;
          st.vy += (9.81 - L) * dt; st.vx *= Math.pow(0.9995, dt * 100); st.x += st.vx * dt; st.y += st.vy * dt;
          if (!st.crash && Math.abs(st.lean) > 32) { st.crash = true; flash('ZU SCHRÄG!', '#e2554a', 1); Snd.sfx('error'); }
          if (st.y >= yHill(st.x)) land();
        } else if (st.phase === 'slide') {
          st.pt += dt; st.cheer -= dt;
          st.vx *= Math.pow(st.crash ? 0.5 : 0.75, dt); st.x += st.vx * dt; st.y = yHill(st.x);
          if (st.pt < 1 && Math.floor(st.pt * 20) % 2 === 0) st.parts.push({ x: st.x - 1, y: st.y, vx: rnd(-5, -1), vy: rnd(-6, -1), t: 0, life: 0.5 });
          if (st.pt > 2.4 || st.vx < 0.5) finishJump();
        }
        for (const pp of st.parts) { pp.t += dt; pp.x += pp.vx * dt; pp.y += pp.vy * dt; pp.vy += 12 * dt; }
        st.parts = st.parts.filter((pp) => pp.t < pp.life);
        if (st.msgT > 0) st.msgT -= dt;
        /* ---- Kamera ---- */
        const camX = st.x - 30, camY = st.y - 25;
        const sx = (xm) => (xm - camX) * S, sy = (ym) => (ym - camY) * S;
        /* ---- Himmel, Nordkette, Stadt ---- */
        const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, night ? '#0a1028' : '#6fa8dc'); g.addColorStop(1, night ? '#28345a' : '#d8ecf8'); c.fillStyle = g; c.fillRect(0, 0, W, H);
        if (night) for (let i = 0; i < 20; i++) P(c, (i * 53) % W, (i * 29) % 50, i % 3 ? '#ffffff' : '#c8d0ff');
        const hor = 36 - camY * 0.25;
        for (let px = 0; px < W; px++) { const xx = px + camX * 0.3; const h = 10 + Math.abs(Math.sin(xx * 0.04) * 16 + Math.sin(xx * 0.11 + 1) * 6 + Math.sin(xx * 0.27) * 2); R(c, px, hor - h, 1, h + 60, night ? '#2a3046' : '#8ea0b8'); R(c, px, hor - h, 1, Math.max(1, Math.round(h * 0.3)), night ? '#9aa8c8' : '#f4f6f8'); }
        for (let i = 0; i < 50; i++) { const bx = ((i * 37 - camX * 0.5) % (W + 40) + W + 40) % (W + 40) - 20, by = hor + 8 + (i * 7) % 12, bw = 5 + (i * 3) % 6, bh = 4 + (i * 5) % 6; R(c, bx, by, bw, bh, night ? '#1e2638' : ['#e8d8c0', '#c8c8d0', '#d8c0b0'][i % 3]); if (night && i % 2) P(c, bx + 1, by + 1, '#ffd27a'); }
        /* ---- Hügel ---- */
        for (let px = 0; px < W; px++) {
          const xm = camX + px / S, ym = yHill(xm), yy = Math.round(sy(ym));
          R(c, px, yy, 1, H - yy, night ? '#b8c4d8' : '#f2f6fa');
          R(c, px, yy, 1, 1, night ? '#dde6f2' : '#ffffff');
          if (xm < 0 && xm > -70) { R(c, px, yy - 1, 1, 2, '#c9d4e0'); if (Math.floor(xm) % 2 === 0) R(c, px, yy, 1, 1, '#8aa0b4'); }
          if (xm > 0 && xm < 170 && Math.floor(px + camX) % 6 === 0) P(c, px, yy + 2 + (px * 7) % 5, night ? '#9aa8c0' : '#dbe4ee');
        }
        /* Schanzentisch */
        R(c, sx(-6), sy(yHill(-1)) - 1, 12, 5, '#7a8690'); R(c, sx(-6), sy(yHill(-1)) - 1, 12, 1, '#c9d2da');
        /* Weitenmarken, K-Punkt, Hillsize, Rekord */
        for (let d = 60; d <= 150; d += 10) { const mx = sx(d), my = sy(yHill(d)); if (mx < -20 || mx > W + 20) continue; const k = d === 120, hs = d === 130; const col = k ? '#e03a3a' : hs ? '#3a6ae0' : '#8a96a8'; R(c, mx, my - 6, 1, 6, col); if (d % 20 === 0 || k) pxText(c, k ? 'K' : '' + d, mx - 3, my - 13, col); }
        { const mx = sx(128), my = sy(yHill(128)); if (mx > -20 && mx < W + 20) { R(c, mx, my - 8, 1, 8, '#3a6ae0'); pxText(c, 'HS', mx + 2, my - 8, '#3a6ae0'); } }
        { const mx = sx(138), my = sy(yHill(138)); if (mx > -20 && mx < W + 20) { R(c, mx, my - 10, 1, 10, '#ffd23d'); pxText(c, 'REK', mx + 2, my - 10, '#ffd23d'); } }
        /* Turm mit Café-Kopf, Startbalken */
        { const tx = sx(-72), ty = sy(yHill(-70)); R(c, tx, ty - 6, 8, 160, '#d0d6dc'); R(c, tx, ty - 6, 2, 160, '#b8c0c8'); R(c, tx + 6, ty - 6, 2, 160, '#e6eaee'); for (let k = 0; k < 12; k++) R(c, tx + 3, ty + 6 + k * 12, 2, 5, '#5a6a7a'); c.fillStyle = '#e8ecef'; c.beginPath(); c.moveTo(tx - 6, ty - 6); c.quadraticCurveTo(tx - 8, ty - 26, tx + 6, ty - 26); c.lineTo(tx + 22, ty - 26); c.quadraticCurveTo(tx + 30, ty - 24, tx + 26, ty - 12); c.lineTo(tx + 20, ty - 6); c.closePath(); c.fill(); R(c, tx - 2, ty - 21, 24, 6, '#3a5068'); for (let k = 0; k < 6; k++) R(c, tx - 1 + k * 4, ty - 20, 3, 4, night ? '#ffe09a' : '#7ab0d8'); R(c, tx + 6, ty - 30, 2, 4, '#c9ccd2'); R(c, tx + 4, ty - 32, 6, 2, '#c8302a'); R(c, tx + 8, ty - 2, 10, 1, '#5a5e64'); }
        /* Sprungrichterturm, Tribünen, Fahnen, Flutlicht */
        { const jx = sx(52), jy = sy(yHill(52)); R(c, jx, jy - 16, 10, 16, '#5a5e64'); R(c, jx + 1, jy - 15, 8, 5, night ? '#ffe09a' : '#9ac0d8'); R(c, jx - 1, jy - 17, 12, 1, '#2a2e34'); }
        for (let xm = 96; xm < 176; xm += 3) { const bx = sx(xm); if (bx < -4 || bx > W) continue; const by = sy(yHill(xm)); for (let row = 0; row < 4; row++) { const col = crowdCol[(xm * 7 + row * 3) % crowdCol.length]; const jump = st.cheer > 0 ? Math.abs(Math.sin(st.t * 12 + xm)) * 2 : 0; R(c, bx, by - 8 - row * 3 - jump, 2, 2, col); } R(c, bx, by - 4, 2, 4, '#8a8e94'); }
        for (const fx of [100, 120, 140, 160]) { const px = sx(fx), py = sy(yHill(fx)); if (px < -10 || px > W) continue; R(c, px, py - 26, 1, 22, '#5a5e64'); const wave = Math.sin(st.t * 6 + fx) * 1.5; const col = fx === 160 ? '#c8352d' : fx === 140 ? '#ffffff' : '#c8352d'; R(c, px + 1, py - 26 + wave, 7, 4, col); if (fx === 160) { R(c, px + 4, py - 25 + wave, 1, 2, '#ffffff'); R(c, px + 3, py - 24.5 + wave, 3, 1, '#ffffff'); } if (fx === 140) R(c, px + 1, py - 25 + wave, 7, 2, '#c8352d'); }
        for (const lx of [40, 150]) { const px = sx(lx), py = sy(yHill(lx)); if (px < -10 || px > W) continue; R(c, px, py - 34, 1, 30, '#4a4e54'); R(c, px - 3, py - 36, 7, 3, '#2a2e34'); if (night) { R(c, px - 2, py - 35, 5, 1, '#fff4c0'); c.fillStyle = 'rgba(255,240,190,0.08)'; c.beginPath(); c.moveTo(px, py - 34); c.lineTo(px - 30, py + 10); c.lineTo(px + 30, py + 10); c.closePath(); c.fill(); } }
        /* Schneespritzer */
        for (const pp of st.parts) P(c, sx(pp.x), sy(pp.y), 'rgba(255,255,255,0.9)');
        /* ---- Springer ---- */
        const psx = sx(st.x), psy = sy(st.y);
        if (st.phase === 'ready' || st.phase === 'go') drawSkier(c, psx, psy - 4, 'ready', 0, st.t);
        else if (st.phase === 'inrun') drawSkier(c, psx, psy - 1, 'inrun', Math.atan(slopeAt(st.x)), st.pt);
        else if (st.phase === 'flight') { st.ang = Math.atan2(st.vy, st.vx) + st.lean * 0.012; drawSkier(c, psx, psy, st.crash ? 'crash' : 'flight', st.ang, st.pt); }
        else if (st.phase === 'slide' || st.phase === 'result') drawSkier(c, psx, psy - 4, st.crash ? 'crash' : st.tele && st.pt < 1.2 ? 'tele' : 'two', st.crash ? 0 : Math.atan(slopeAt(st.x)), st.crash ? Math.min(st.pt, 1.2) : st.pt);
        /* ---- HUD ---- */
        R(c, 0, 0, W, 11, 'rgba(10,16,32,0.55)');
        if (st.phase === 'inrun' || st.phase === 'go') pxText(c, `${Math.round(st.v * 3.6)} KM/H`, 3, 2, '#ffffff');
        else if (st.phase === 'flight' || st.phase === 'slide' || st.phase === 'result') pxText(c, `${(st.phase === 'flight' ? st.x : st.d).toFixed(1)} M`, 3, 2, st.x >= 120 ? '#7af0a0' : '#ffffff');
        else pxText(c, 'BEREIT', 3, 2, '#ffffff');
        { const wx = W - 34; pxText(c, `${wind > 0 ? '+' : ''}${wind.toFixed(1)}`, wx + 8, 2, wind > 0 ? '#7af0a0' : wind < 0 ? '#ff9a7a' : '#ffffff'); R(c, wx, 5, 6, 1, '#ffffff'); if (wind !== 0) { R(c, wind > 0 ? wx : wx + 5, 4, 1, 3, '#ffffff'); } }
        if (st.phase === 'flight') { const bx = 50, bw = 60; R(c, bx, 3, bw, 5, '#2a2e34'); R(c, bx + bw / 2 - 9, 3, 18, 5, '#2f7a3a'); R(c, bx + bw / 2 - 4, 3, 8, 5, '#3fb04a'); const mx = clamp(bx + bw / 2 + st.lean * 1.4, bx, bx + bw - 2); R(c, mx, 2, 2, 7, Math.abs(st.lean) < 14 ? '#ffffff' : '#e2554a'); }
        if (st.phase === 'go') { const n = Math.min(3, Math.floor(st.pt / 0.37)); for (let k = 0; k < 3; k++) E(c, 80 - 10 + k * 10, 24, 3.5, 3.5, k < n ? (k === 2 ? '#3fe05a' : '#ffd23d') : '#3a3c40'); }
        if (st.phase === 'ready' && Math.floor(st.t * 2) % 2) pxText(c, 'START ANTIPPEN', 48, 40, '#ffffff');
        if (st.phase === 'inrun' && st.x > -14 && st.x < 3 && Math.floor(st.t * 10) % 2) pxText(c, 'JETZT!', 66, 30, '#7af0a0');
        if (st.phase === 'flight' && st.x > 40 && yHill(st.x) - st.y < 2.2 && Math.floor(st.t * 10) % 2) pxText(c, 'TELEMARK!', 60, 30, '#7af0a0');
        if (st.msgT > 0) { const w = pxTextW(st.msg); pxText(c, st.msg, 80 - w / 2, 46, st.msgCol); }
        if (st.phase === 'result') {
          const r = st.res; R(c, 22, 28, 116, 62, 'rgba(10,16,32,0.88)'); R(c, 22, 28, 116, 1, '#ffd23d');
          pxText(c, r.crash ? 'STURZ' : r.d > 138 ? 'SCHANZENREKORD!' : r.d >= 120 ? 'K-PUNKT GEKNACKT' : 'GELANDET', 28, 32, r.crash ? '#e2554a' : '#ffd23d');
          pxText(c, `WEITE   ${r.d.toFixed(1)} M`, 28, 44, '#ffffff'); pxText(c, `HALTUNG ${r.style.toFixed(1)}`, 28, 54, '#ffffff'); pxText(c, `TOTAL   ${r.total.toFixed(1)}`, 28, 64, '#7af0a0');
          pxText(c, r.judges.map((j) => j.toFixed(1)).join(' '), 28, 76, '#9aa8c0');
        }
        dist.textContent = st.phase === 'result' ? `${st.d.toFixed(1)} m` : st.phase === 'flight' ? `${st.x.toFixed(0)} m` : st.phase === 'inrun' ? `${Math.round(st.v * 3.6)} km/h` : '–';
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
    const tower = kind === 'turm', berg = kind === 'bergisel';
    return this.run(tower ? 'Blick vom Stadtturm' : berg ? 'Bergisel-Turm' : 'Fernrohr auf der Seegrube', tower ? '31 m über der Altstadt' : berg ? '50 m über dem Stadion · Blick nach Norden' : '1.905 m · Blick nach Süden', `<div style="overflow-x:auto;touch-action:pan-x;border-radius:8px"><canvas aria-label="Panorama" style="width:auto;height:240px;max-width:none"></canvas></div><p class="note" id="pInfo">Wisch zur Seite, um dich umzusehen.</p>${kind === 'seegrube' && !G.S.photos.seegrube ? '<button class="btn primary" id="pFoto">Foto machen</button>' : ''}<button class="btn" id="pOk">Zurück</button>`, 480, 160, (api) => {
      api.o.querySelector('#pOk').onclick = () => api.finish(true);
      const pf = api.o.querySelector('#pFoto');
      if (pf) pf.onclick = () => { G.photoImg = G.photoImg || {}; G.photoImg.seegrube = api.cv.toDataURL(); addPhoto('seegrube'); pf.remove(); };
      const c = api.ctx;
      const night = isNight();
      const sky = c.createLinearGradient(0, 0, 0, 100);
      sky.addColorStop(0, night ? '#0a1028' : '#7fb2e0'); sky.addColorStop(1, night ? '#28345a' : '#d8eaf4');
      c.fillStyle = sky; c.fillRect(0, 0, 480, 160);
      const ridge = (base, amp, f, col, snow, s) => { for (let x = 0; x < 480; x++) { let v = 0; for (let k = 1; k < 4; k++) v += Math.abs(Math.sin(x / 480 * f * k + s * k)) / k; const y = base - v * amp; R(c, x, y, 1, 160 - y, col); if (snow && v > 1.05) R(c, x, y, 1, 3, night ? '#9aa8c8' : '#f4f6f8'); } };
      if (berg) {
        ridge(62, 36, 8, night ? '#2a3046' : '#9aa6b8', true, 0.9);
        ridge(86, 12, 10, night ? '#1e2638' : '#4a6a44', false, 2.4);
        R(c, 0, 96, 480, 64, night ? '#141a2a' : '#8a9a7a');
        for (let i = 0; i < 160; i++) { const x = (i * 23) % 480, w = 6 + (i * 5) % 8, h = 5 + (i * 7) % 9, y = 98 + (i * 13) % 34; R(c, x, y, w, h, night ? '#2a2a3a' : PASTELS[i % PASTELS.length]); R(c, x, y - 2, w, 2, night ? '#3a2a2a' : ROOFS[i % ROOFS.length]); if (night && i % 2) P(c, x + 2, y + 2, '#ffd27a'); }
        R(c, 0, 118, 480, 4, night ? '#20304a' : '#4a8aa8');
        R(c, 236, 104, 8, 7, '#e8b830'); R(c, 150, 100, 4, 16, '#f0d8b8'); R(c, 160, 100, 4, 16, '#f0d8b8'); R(c, 300, 102, 5, 14, '#c8302a');
        /* Aufsprunghügel und Stadion direkt unter dem Turm */
        c.fillStyle = night ? '#9aa8c0' : '#f2f6fa'; c.beginPath(); c.moveTo(140, 160); c.lineTo(200, 130); c.lineTo(280, 130); c.lineTo(340, 160); c.closePath(); c.fill();
        line(c, 206, 139, 274, 139, '#e03a3a'); line(c, 212, 145, 268, 145, '#3a6ae0');
        for (let k = 0; k < 40; k++) { R(c, 120 + (k * 7) % 60, 150 + (k * 3) % 10, 2, 3, ['#c8352d', '#2f5fb8', '#e8c23a'][k % 3]); R(c, 300 + (k * 7) % 60, 150 + (k * 3) % 10, 2, 3, ['#f4f0e6', '#c8352d', '#3a3c40'][k % 3]); }
        pxText(c, 'NORDKETTE', 200, 22, '#ffffff'); pxText(c, 'SEEGRUBE', 318, 36, '#ffffff'); pxText(c, 'HUNGERBURG', 60, 70, '#ffffff'); pxText(c, 'INNSBRUCK', 190, 86, '#ffffff'); pxText(c, 'INN', 400, 112, '#ffffff'); pxText(c, 'ALTSTADT', 130, 90, '#ffffff');
        pxText(c, 'K120', 282, 134, '#e03a3a'); pxText(c, 'STADION', 220, 150, '#1a1a2e');
      } else if (tower) {
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
