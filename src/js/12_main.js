/* ============ Start & Hauptschleife ============ */
G.mode = 'title';
function isTouch() { return window.matchMedia && (matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window); }

function boot() {
  View.cv = document.getElementById('screen');
  View.ctx = View.cv.getContext('2d');
  [View.wcv, View.wctx] = canvas(320, 200);
  [View.lcv, View.lctx] = canvas(320, 200);
  resizeView();
  window.addEventListener('resize', resizeView);
  UI.init();
  Input.touch = isTouch();
  document.body.classList.toggle('touch', Input.touch);
  wireInput();
  showTitle();
  let last = performance.now(), hudT = 0;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (G.mode === 'play' && G.map) {
      try {
        updateWorld(dt);
        renderWorld();
        renderScreen();
      } catch (e) { console.error(e); }
      hudT += dt; if (hudT > 0.5) { hudT = 0; UI.hud(); }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.mode === 'play') saveGame(true); });
}

function showTitle() {
  const t = document.getElementById('title');
  const save = loadSave();
  t.hidden = false;
  t.innerHTML = `<div class="title-card">
    <div class="dep" aria-label="Abfahrt">
      <div class="dep-head"><span>Abfahrt · Luzern</span><span>Gleis</span></div>
      <div class="dep-row"><span class="tm">09:10</span><span class="ds">IR 70 Zürich HB<small>weiter mit Railjet nach Innsbruck Hbf, an 13:20</small></span><span class="gl">4</span></div>
      <div class="dep-row"><span class="tm">09:14</span><span class="ds" style="color:var(--ink-dim)">S1 Sursee<small>&nbsp;</small></span><span class="gl" style="background:var(--ink-dim)">1</span></div>
    </div>
    <h1 class="title-name">Gleis 4 nach <span>Innsbruck</span></h1>
    <p class="title-sub">Zwölf Jungs, ein Gruppenbillett, ein Hotel in der Altstadt. Bau dir deinen Charakter, jass im Zug, finde das Hotel, triff die Kollegen in der Bar – und dann ist Innsbruck dein Spielplatz.</p>
    <div class="title-btns">
      ${save ? `<button class="btn primary" id="tCont">Weiterspielen · ${save.name}, ${DAYS[Math.floor(save.time / 1440) % 7]} ${pad2(Math.floor((save.time % 1440) / 60))}:${pad2(Math.floor(save.time % 60))}</button>` : ''}
      <button class="btn ${save ? '' : 'primary'}" id="tNew">Neues Spiel</button>
    </div>
    <div class="keys">Tastatur: <kbd>WASD</kbd>/<kbd>Pfeile</kbd> gehen · <kbd>Shift</kbd> rennen · <kbd>E</kbd> Aktion · <kbd>M</kbd> Handy. Am Handy: links ziehen zum Gehen, <kbd>A</kbd> für Aktionen. Läuft komplett im Browser, Spielstand bleibt auf diesem Gerät.</div>
  </div>`;
  const cont = t.querySelector('#tCont');
  if (cont) cont.onclick = () => { Snd.init(); startGame(save); };
  t.querySelector('#tNew').onclick = async () => {
    Snd.init();
    t.hidden = true;
    const res = await Editor.open({ mode: 'new', look: randomLook(Math.random, {}) });
    if (!res) { showTitle(); return; }
    const crew = CREW.find((c) => c.id === res.pid);
    const S2 = newState(res.look, crew.name);
    S2.pid = res.pid;
    S2.flags.crewSeed = res.crewSeed;
    S2.flags.deck = 'de';
    if (res.pid === 'cuche') { S2.money.eur += 150; }
    clearSave();
    try { localStorage.removeItem(SAVE_KEY + '-img'); } catch (e) {}
    startGame(S2, true);
  };
}

async function startGame(state, fresh) {
  G.S = state;
  if (!G.S.flags.met) G.S.flags.met = {};
  buildFriends();
  G.photoImg = {};
  try { G.photoImg = JSON.parse(localStorage.getItem(SAVE_KEY + '-img') || '{}'); } catch (e) {}
  document.getElementById('title').hidden = true;
  document.getElementById('hud').hidden = false;
  document.getElementById('touch').hidden = false;
  G.player = null;
  if (fresh) enterMap('luzern', 'start');
  else enterMap(G.S.map, { x: G.S.x, y: G.S.y, dir: G.S.dir });
  Story._lastHour = Math.floor(hourOf(G.S.time));
  G.mode = 'play';
  Story.ready = true;
  UI.hud();
  if (fresh) {
    G.busy++;
    await UI.card('Samstag, 8:38 Uhr · Bahnhofplatz Luzern', 1500);
    await Story.say(null, playerIsKassier()
      ? `Du bist ${G.S.name}, der Kassier. Das Gruppenbillett und die Gruppenkasse sind bei dir. Die Jungs warten beim Torbogen – um 9:10 fährt der Zug auf Gleis 4.`
      : `Du bist ${G.S.name}, ${CREW.find((c) => c.id === G.S.pid).role}. Heute geht's mit den Jungs nach Innsbruck! Sie warten beim Torbogen, ${fname(who('kassier'))} hat das Gruppenbillett. Der Zug fährt um 9:10 auf Gleis 4.`);
    if (Input.touch) await Story.say(null, 'Zieh mit dem Daumen links auf dem Bildschirm, um zu gehen. Weit ziehen heisst rennen. Mit A sprichst du mit Leuten und benutzt Dinge. Oben rechts ist dein Handy.');
    else await Story.say(null, 'WASD oder Pfeiltasten zum Gehen, Shift zum Rennen, E für Aktionen, M für dein Handy.');
    G.busy--;
    saveGame(true);
  }
}

function wireInput() {
  const keyDown = (e) => {
    if (G.mode !== 'play') return;
    if (!document.getElementById('editor').hidden) return;
    const code = e.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) e.preventDefault();
    if (UI.dlgOpen) { UI.dlgKey(code); return; }
    if (UI.ovOpen) {
      if (Mini.key) { Mini.key(code); return; }
      if (code === 'Escape' || code === 'KeyM') UI.closeOverlay();
      return;
    }
    Input.keys[code] = true;
    if (['KeyE', 'Space', 'Enter'].includes(code)) doInteract();
    if (code === 'KeyM' || code === 'Tab') { e.preventDefault(); if (!G.busy) Phone.open(); }
  };
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', (e) => { Input.keys[e.code] = false; });
  window.addEventListener('blur', () => { Input.keys = {}; });
  const scr = document.getElementById('screen');
  const stick = document.getElementById('stick'), knob = document.getElementById('knob');
  const S = Input.stick;
  const start = (e) => {
    if (G.mode !== 'play' || G.busy) return;
    Input.touch = true; document.body.classList.add('touch');
    if (S.on) return;
    S.on = true; S.id = e.pointerId; S.ox = e.clientX; S.oy = e.clientY; S.x = 0; S.y = 0;
    stick.style.left = e.clientX + 'px'; stick.style.top = e.clientY + 'px'; stick.classList.add('on');
    knob.style.transform = 'translate(0,0)';
    e.preventDefault();
  };
  const move = (e) => {
    if (!S.on || e.pointerId !== S.id) return;
    const dx = e.clientX - S.ox, dy = e.clientY - S.oy;
    const d = Math.hypot(dx, dy), max = 48;
    const k = d > max ? max / d : 1;
    S.x = (dx * k) / max * (d > 8 ? 1 : 0); S.y = (dy * k) / max * (d > 8 ? 1 : 0);
    if (d > 70) { S.x *= 1.2; S.y *= 1.2; }
    knob.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
  };
  const end = (e) => { if (e.pointerId !== S.id) return; S.on = false; S.x = 0; S.y = 0; stick.classList.remove('on'); };
  scr.addEventListener('pointerdown', start);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  document.getElementById('touch').addEventListener('pointerdown', (e) => { if (e.target.id === 'touch' || e.target.id === 'stickHint') start(e); });
  document.getElementById('btnA').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); Snd.init(); if (UI.dlgOpen) { UI.dlgAdvance(); return; } doInteract(); });
  document.addEventListener('contextmenu', (e) => { if (G.mode === 'play') e.preventDefault(); });
  document.addEventListener('pointerdown', () => Snd.init(), { once: true });
}
window.addEventListener('load', boot);
