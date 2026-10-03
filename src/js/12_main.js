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

function changelogHtml() {
  return CHANGELOG.map((e, i) => `<div class="cl-entry${i === 0 ? ' cur' : ''}"><div class="cl-head"><b>Version ${e.v}</b><span>${e.date}${i === 0 ? ' · aktuell' : ''}</span></div><ul>${e.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('');
}
function showTitle() {
  const t = document.getElementById('title');
  const save = loadSave();
  t.hidden = false;
  t.innerHTML = `<div class="snow" aria-hidden="true"></div><div class="title-card">
    <div class="lights" aria-hidden="true"></div>
    <p class="title-kicker">❄ Gleis 4 nach Innsbruck · Freitag, 11. Dezember 2026 ❄</p>
    <h1 class="title-name">🎄 Wiehnachtsreisli 2026 <span>nach Innsbruck</span></h1>
    <p class="title-sub">Zwölf Jungs, ein Gruppenbillett, ein Hotel in der Altstadt. Bau dir deinen Charakter, kauf das Billett, erwisch den Zug um 9:10, jass im Zug, finde das Hotel, triff die Kollegen in der Bar – und dann ist Innsbruck dein Spielplatz.</p>
    <div class="title-btns">
      ${save && !save.finished ? `<button class="btn primary" id="tCont">Weiterspielen · ${save.name}, ${dateStr(save.time)} ${clockStr(save.time)}</button>` : ''}
      ${save && save.finished ? `<p class="title-sub">Letzte Reise abgeschlossen: ${save.name}, ${Object.keys(save.ach || {}).length} Erlebnisse in ${Math.floor(save.time / 1440) + 1} Tagen.</p>` : ''}
      <button class="btn ${save && !save.finished ? '' : 'primary'}" id="tNew">Neues Spiel</button>
    </div>
    <div class="keys">Tastatur: <kbd>WASD</kbd>/<kbd>Pfeile</kbd> gehen · <kbd>Shift</kbd> rennen · <kbd>E</kbd> Aktion · <kbd>M</kbd> Handy. Am Handy: links ziehen zum Gehen, <kbd>A</kbd> für Aktionen. Läuft komplett im Browser, Spielstand bleibt auf diesem Gerät.</div>
    <div class="version"><span>Version ${APP_VERSION} · ${APP_VERSION_DATE}</span><button class="link" id="tLog" aria-expanded="false">Was ist neu?</button></div>
    <div class="changelog" id="tChangelog" hidden>${changelogHtml()}</div>
  </div>`;
  const logBtn = t.querySelector('#tLog'), logBox = t.querySelector('#tChangelog');
  logBtn.onclick = () => { const open = logBox.hidden; logBox.hidden = !open; logBtn.textContent = open ? 'Historie schliessen' : 'Was ist neu?'; logBtn.setAttribute('aria-expanded', String(open)); if (open) logBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
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
    if (res.pid === 'cuche') { S2.money.eur += 150; S2.money.chf += TICKET_CASH; }
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
    await UI.card(`${dateLong()} · ${clockStr()} Uhr · Bahnhofplatz Luzern`, 1800);
    await Story.say(null, playerIsKassier()
      ? `Du bist ${G.S.name}, der Kassier. Die Gruppenkasse ist bei dir – und du kaufst das Gruppenbillett am Automaten im Bahnhof. Die Jungs warten beim Torbogen – begrüss vor allem ${fname(who('party'))} (Proviant) und ${fname(who('foto'))} (Fototipp), die winken mit einem „!“. Um 9:10 fährt der Zug auf Gleis 4, und zwar pünktlich.`
      : `Du bist ${G.S.name}, ${CREW.find((c) => c.id === G.S.pid).role}. Heute geht's mit den Jungs nach Innsbruck! Sie warten beim Torbogen – begrüss dort ${fname(who('party'))}, ${fname(who('foto'))} und ${fname(who('kassier'))}, die winken mit einem „!“. Du bist für die Fahrkarten zuständig: ${fname(who('kassier'))} gibt dir das Geld, du kaufst das Gruppenbillett am Automaten. Um 9:10 fährt der Zug auf Gleis 4 – wer zu spät kommt, bleibt in Luzern.`);
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
    stick.style.left = e.clientX + 'px'; stick.style.top = e.clientY + 'px'; stick.classList.add('on'); document.body.classList.add('stick-on');
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
  const end = (e) => { if (e.pointerId !== S.id) return; S.on = false; S.x = 0; S.y = 0; stick.classList.remove('on'); document.body.classList.remove('stick-on'); };
  scr.addEventListener('pointerdown', start);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  document.getElementById('touch').addEventListener('pointerdown', (e) => { if (e.target.id === 'touch' || e.target.id === 'stickHint') start(e); });
  document.getElementById('btnA').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); Snd.init(); if (UI.dlgOpen) { UI.dlgAdvance(); return; } doInteract(); });
  document.addEventListener('contextmenu', (e) => { if (G.mode === 'play') e.preventDefault(); });
  /* Audio bei jeder Geste wieder freigeben (Handy-Browser halten den Kontext nach Sperren/Hintergrund an) */
  document.addEventListener('pointerdown', () => Snd.init());
  document.addEventListener('keydown', () => Snd.init());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) Snd.init(); });
}
window.addEventListener('load', boot);
/* Easter Egg: Handy 3 Sekunden kräftig schütteln → zufälliges Ereignis. Android liefert die Bewegungsdaten sofort,
   iPhones erst nach einer Erlaubnis per Tippen (Handy → Optionen → Bewegungssensoren, oder beim Darts mit Neigung). */
const Shake = {
  on: false, t: 0, last: 0, lastPeak: 0, fired: -1e9, fx: 0,
  KEY: 'gleis4-sensoren',
  needsPermission() { return typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function'; },
  init() {
    if (typeof DeviceMotionEvent === 'undefined') return;
    if (!this.needsPermission()) { this.listen(); return; }
    /* iPhone: Die Erlaubnis gilt nur bis zum Neuladen. Wer sie einmal gegeben hat, bekommt sie beim ersten Tippen still erneuert. */
    let ok = false; try { ok = localStorage.getItem(this.KEY) === '1'; } catch (e) {}
    if (ok) { const renew = () => { this.ask(); }; window.addEventListener('pointerdown', renew, { once: true, capture: true }); }
  },
  async ask() {
    if (typeof DeviceMotionEvent === 'undefined') return false;
    try { if (this.needsPermission()) { const r = await DeviceMotionEvent.requestPermission(); if (r !== 'granted') return false; } } catch (e) { return false; }
    try { localStorage.setItem(this.KEY, '1'); } catch (e) {}
    this.listen(); return true;
  },
  listen() {
    if (this.on) return; this.on = true;
    window.addEventListener('devicemotion', (e) => {
      const a = e.acceleration, g = e.accelerationIncludingGravity;
      let m;
      if (a && a.x != null) m = Math.hypot(a.x || 0, a.y || 0, a.z || 0);
      else if (g && g.x != null) m = Math.abs(Math.hypot(g.x || 0, g.y || 0, g.z || 0) - 9.81);
      else return;
      this.feed(m, performance.now() / 1000);
    });
  },
  /* Kräftige Ausschläge (über 11 m/s²) zählen als Schütteln; Pausen über 0,35 s lassen den Zähler schnell wieder sinken */
  feed(m, now) {
    const gap = now - (this.last || now); this.last = now;
    if (gap > 0.5) this.t = 0; /* keine Sensordaten mehr = Schütteln vorbei */
    const dt = Math.min(0.2, Math.max(0, gap));
    if (m > 9) this.lastPeak = now;
    if (now - this.lastPeak < 0.35) this.t += dt; else this.t = Math.max(0, this.t - dt * 2);
    if (this.t > 1 && G.mode === 'play' && !G.busy) G.fx.shake = Math.max(G.fx.shake || 0, Math.min(0.6, (this.t - 1) * 0.3));
    if (this.t >= 3) { this.t = 0; this.trigger(); }
  },
  /* Blockierte Versuche bekommen eine kurze Rückmeldung, damit klar ist, warum nichts passiert */
  hint(txt) { const now = performance.now(); if (now - (this._hintAt || 0) < 4000) return; this._hintAt = now; UI.toast(txt); },
  trigger() {
    const now = performance.now();
    if (!G.S || G.mode !== 'play') return;
    const wait = Math.ceil((30000 - (now - this.fired)) / 1000);
    if (wait > 0) { this.hint(`📳 Dein Handy ist noch ganz durchgeschüttelt. Noch ${wait} Sekunden …`); return; }
    if (G.live) { this.hint('📳 Gerade passiert schon etwas – erst mal das hier überstehen!'); return; }
    if (G.busy || !document.getElementById('overlay').hidden) { this.hint('📳 Erst Gespräch oder Handy schliessen, dann schütteln.'); return; }
    this.fired = now;
    try { if (navigator.vibrate) navigator.vibrate([80, 60, 180]); } catch (e) {}
    Story.shakeEvent();
  },
};
window.addEventListener('load', () => Shake.init());
/* Homescreen-Apps und Browser halten gern eine alte Version im Cache: version.json ohne Cache lesen und zum Neuladen auffordern */
async function checkUpdate() {
  if (!/^https?:/.test(location.protocol)) return;
  try {
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    if (!j.v || j.v === APP_VERSION) return;
    const el = UI.toast(`Neue Version ${j.v} verfügbar – hier tippen zum Neuladen.`, 'ach');
    if (el) { el.addEventListener('pointerdown', () => location.reload(), { once: true }); setTimeout(() => el.classList.remove('out'), 400); }
  } catch (e) { /* offline */ }
}
window.addEventListener('load', () => setTimeout(checkUpdate, 2500));
