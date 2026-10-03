/* ============ Oberfläche ============ */
const ICON_CACHE = {};
function itemIconURL(icon) {
  if (ICON_CACHE[icon]) return ICON_CACHE[icon];
  const [c, x] = canvas(16, 16);
  const beerGlass = (col) => { R(x, 4, 3, 8, 11, col); R(x, 4, 3, 8, 2, '#fffaf0'); R(x, 12, 6, 2, 5, '#d9e2e6'); R(x, 5, 6, 1, 7, shade(col, 0.3)); R(x, 4, 14, 8, 1, shade(col, -0.3)); };
  switch (icon) {
    case 'beer': beerGlass('#e8b33a'); break;
    case 'weiss': R(x, 5, 2, 6, 13, '#e8a03a'); R(x, 5, 1, 6, 3, '#fffaf0'); R(x, 6, 5, 1, 8, '#f8c86a'); break;
    case 'can': R(x, 4, 2, 8, 13, '#c9ccd2'); R(x, 4, 5, 8, 7, '#2f7a3a'); R(x, 5, 6, 6, 1, '#e8c23a'); R(x, 5, 2, 6, 1, '#8a9096'); break;
    case 'can2': R(x, 4, 2, 8, 13, '#2f5fb8'); R(x, 4, 5, 8, 6, '#c8f03a'); R(x, 5, 2, 6, 1, '#8a9096'); break;
    case 'bottle': R(x, 6, 1, 4, 4, '#4a7a3a'); R(x, 5, 5, 6, 10, '#4a7a3a'); R(x, 5, 8, 6, 4, '#f2e8c8'); break;
    case 'shot': R(x, 5, 6, 6, 8, '#e8f0f2'); R(x, 6, 8, 4, 5, '#c8a050'); R(x, 5, 14, 6, 1, '#a8b0b8'); break;
    case 'long': R(x, 4, 2, 8, 13, '#e8f0f2'); R(x, 5, 5, 6, 9, '#c84a7a'); R(x, 9, 0, 1, 6, '#3ab0e0'); P(x, 6, 7, '#ffffff'); break;
    case 'tea': R(x, 3, 6, 9, 8, '#f4f0e6'); R(x, 4, 7, 7, 4, '#b8501e'); R(x, 12, 8, 2, 3, '#f4f0e6'); R(x, 2, 14, 12, 1, '#c9c2b4'); break;
    case 'wine': R(x, 5, 2, 6, 6, '#e8f0f2'); R(x, 6, 4, 4, 3, '#8a1e3a'); R(x, 7, 8, 2, 5, '#e8f0f2'); R(x, 5, 13, 6, 1, '#e8f0f2'); break;
    case 'water': R(x, 5, 2, 6, 13, '#a8d8f0'); R(x, 6, 0, 4, 2, '#2f5fb8'); R(x, 5, 7, 6, 3, '#2f5fb8'); break;
    case 'coffee': R(x, 3, 6, 9, 7, '#f4f0e6'); R(x, 4, 6, 7, 2, '#5a3a1e'); R(x, 12, 7, 2, 3, '#f4f0e6'); R(x, 2, 13, 12, 1, '#c9c2b4'); R(x, 6, 2, 1, 3, '#c9c2b4'); R(x, 9, 1, 1, 3, '#c9c2b4'); break;
    case 'burger': E(x, 8, 5, 6, 3, '#d8902a'); R(x, 2, 7, 12, 2, '#3f8a3a'); R(x, 2, 9, 12, 2, '#6a3a1e'); R(x, 2, 8, 12, 1, '#e8c23a'); E(x, 8, 12, 6, 2, '#d8902a'); P(x, 6, 3, '#fff0c0'); P(x, 9, 4, '#fff0c0'); break;
    case 'ribs': R(x, 2, 5, 12, 7, '#8a3a1e'); for (let k = 3; k < 14; k += 3) R(x, k, 3, 1, 11, '#f4e8d0'); break;
    case 'wings': E(x, 6, 8, 4, 3, '#c8582a'); E(x, 10, 9, 4, 3, '#b8481a'); R(x, 12, 6, 2, 1, '#f4e8d0'); break;
    case 'fries': R(x, 4, 7, 8, 8, '#c8352d'); for (let k = 5; k < 12; k += 2) R(x, k, 2 + (k % 3), 1, 6, '#f2c84a'); break;
    case 'nachos': for (let k = 0; k < 4; k++) { R(x, 2 + k * 3, 6 + (k % 2) * 2, 4, 5, '#e8c23a'); } R(x, 3, 8, 10, 2, '#f8e8a0'); break;
    case 'schnitzel': E(x, 7, 8, 6, 4, '#d8a040'); R(x, 4, 6, 2, 1, '#f0c870'); E(x, 13, 5, 2, 2, '#f2e65a'); break;
    case 'pan': E(x, 8, 9, 7, 5, '#3a3c40'); E(x, 8, 8, 6, 4, '#d8a040'); E(x, 6, 7, 2, 2, '#ffffff'); P(x, 6, 7, '#f2c23a'); R(x, 14, 8, 2, 1, '#3a3c40'); break;
    case 'board': R(x, 2, 5, 12, 8, '#a87a4a'); R(x, 3, 6, 4, 3, '#c84a4a'); R(x, 8, 6, 4, 3, '#f4e8d0'); R(x, 4, 10, 6, 2, '#e8c23a'); break;
    case 'soup': E(x, 8, 9, 6, 4, '#f4f0e6'); E(x, 8, 8, 5, 2, '#c87a2a'); E(x, 8, 8, 2, 1, '#e8c87a'); break;
    case 'schmarrn': E(x, 8, 9, 7, 4, '#f4f0e6'); for (let k = 0; k < 6; k++) R(x, 4 + (k * 3) % 8, 6 + (k % 3), 3, 2, '#d8a050'); for (let k = 0; k < 6; k++) P(x, 4 + k * 2, 6 + (k % 2), '#ffffff'); break;
    case 'strudel': R(x, 2, 7, 12, 5, '#e0b060'); for (let k = 3; k < 13; k += 3) R(x, k, 7, 1, 5, '#b88038'); R(x, 2, 6, 12, 1, '#ffffff'); break;
    case 'cake': R(x, 3, 6, 10, 7, '#4a2a1a'); R(x, 3, 6, 10, 2, '#3a1a10'); R(x, 3, 9, 10, 1, '#c8502a'); P(x, 8, 5, '#f4f0e6'); break;
    case 'brezel': E(x, 8, 8, 6, 5, '#a8602a'); E(x, 6, 8, 2, 2, 'rgba(0,0,0,0)'); P(x, 5, 6, '#fff'); P(x, 10, 7, '#fff'); R(x, 6, 8, 1, 1, '#f4e8d0'); R(x, 9, 8, 1, 1, '#f4e8d0'); break;
    case 'wurst': R(x, 2, 7, 12, 4, '#b8582a'); R(x, 2, 7, 12, 1, '#d87a4a'); R(x, 4, 10, 8, 1, '#e8c23a'); break;
    case 'croissant': for (let k = 0; k < 5; k++) E(x, 4 + k * 2, 9 - Math.abs(k - 2), 2, 2, '#d8a050'); break;
    case 'sandwich': R(x, 2, 6, 12, 2, '#e8c890'); R(x, 2, 8, 12, 1, '#3f8a3a'); R(x, 2, 9, 12, 1, '#e86a7a'); R(x, 2, 10, 12, 2, '#e8c890'); break;
    case 'chips': R(x, 4, 2, 8, 12, '#e8c23a'); R(x, 5, 5, 6, 4, '#c8352d'); R(x, 4, 2, 8, 1, '#a8901a'); break;
    case 'banana': for (let k = 0; k < 9; k++) R(x, 3 + k, 10 - Math.round(Math.sin(k / 8 * 3.1) * 5), 2, 2, '#f2d84a'); break;
    case 'bread': E(x, 8, 9, 6, 4, '#c8883a'); R(x, 5, 7, 6, 1, '#e8b870'); break;
    case 'speck': R(x, 2, 5, 12, 7, '#b84a3a'); R(x, 2, 5, 12, 2, '#f4e8d8'); R(x, 2, 9, 12, 1, '#f4e8d8'); break;
    case 'choco': R(x, 3, 3, 10, 10, '#5a3420'); for (let k = 3; k < 13; k += 3) { R(x, k, 3, 1, 10, '#3a2010'); R(x, 3, k, 10, 1, '#3a2010'); } break;
    case 'pill': R(x, 3, 6, 10, 5, '#ffffff'); R(x, 8, 6, 5, 5, '#c8352d'); R(x, 3, 6, 10, 1, '#e8e8e8'); break;
    case 'cig': R(x, 2, 4, 12, 9, '#f4f0e6'); R(x, 2, 4, 12, 3, '#c8352d'); R(x, 5, 1, 2, 4, '#e8c890'); R(x, 8, 1, 2, 4, '#f4f0e6'); break;
    case 'lighter': R(x, 5, 4, 6, 10, '#2f5fb8'); R(x, 5, 2, 6, 2, '#c9ccd2'); R(x, 7, 0, 2, 2, '#ffb030'); break;
    case 'paper': R(x, 2, 3, 12, 10, '#f4f0e6'); R(x, 3, 4, 10, 2, '#1a1a1a'); for (let k = 7; k < 12; k += 2) R(x, 3, k, 10, 1, '#8a8a8a'); break;
    case 'globe': E(x, 8, 7, 5, 5, '#c8e8f8'); R(x, 6, 7, 4, 3, '#e8b830'); R(x, 4, 12, 8, 3, '#5a3a24'); break;
    case 'magnet': R(x, 3, 3, 10, 9, '#e8b830'); R(x, 4, 4, 8, 3, '#c8352d'); R(x, 4, 9, 8, 2, '#f4f0e6'); break;
    case 'card': R(x, 2, 3, 12, 10, '#f4f0e6'); R(x, 3, 4, 7, 6, '#8ec3e6'); R(x, 3, 7, 7, 3, '#7a7c86'); R(x, 11, 4, 2, 2, '#c8352d'); break;
    case 'flower': for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; E(x, 8 + Math.cos(a) * 4, 8 + Math.sin(a) * 4, 2, 1, '#f4f4f0'); } E(x, 8, 8, 2, 2, '#e8c23a'); break;
    case 'coin': E(x, 8, 8, 5, 5, '#e8c23a'); E(x, 8, 8, 3, 3, '#c8a020'); break;
    case 'shirt': R(x, 4, 3, 8, 11, '#2f5fb8'); R(x, 1, 3, 3, 5, '#2f5fb8'); R(x, 12, 3, 3, 5, '#2f5fb8'); R(x, 7, 3, 2, 2, '#f4f0e6'); break;
    case 'hat': R(x, 1, 10, 14, 2, '#3f5a3b'); R(x, 4, 4, 8, 6, '#3f5a3b'); R(x, 4, 8, 8, 1, '#c23a2a'); line(x, 12, 9, 14, 1, '#1d1d1d'); break;
    case 'pants': R(x, 4, 2, 8, 6, '#6b4423'); R(x, 4, 8, 3, 6, '#6b4423'); R(x, 9, 8, 3, 6, '#6b4423'); R(x, 5, 2, 1, 6, '#3a2010'); R(x, 10, 2, 1, 6, '#3a2010'); break;
    case 'shoe': R(x, 2, 8, 12, 5, '#5a3a1e'); R(x, 2, 12, 12, 1, '#2a1a10'); R(x, 4, 6, 5, 3, '#5a3a1e'); break;
    case 'glasses': R(x, 1, 6, 6, 4, '#18181c'); R(x, 9, 6, 6, 4, '#18181c'); R(x, 7, 7, 2, 1, '#18181c'); P(x, 2, 7, '#5a6070'); break;
    case 'cap': E(x, 8, 8, 6, 4, '#c8352d'); R(x, 2, 8, 12, 4, '#c8352d'); R(x, 9, 11, 7, 2, '#8a1e1a'); break;
    case 'scissors': line(x, 3, 3, 12, 12, '#c9ccd2'); line(x, 12, 3, 3, 12, '#c9ccd2'); E(x, 3, 13, 2, 2, '#c8352d'); E(x, 12, 13, 2, 2, '#c8352d'); break;
    case 'ticket': R(x, 2, 4, 12, 8, '#f4f0e6'); R(x, 2, 4, 3, 8, '#c8352d'); R(x, 6, 6, 6, 1, '#1a1a1a'); R(x, 6, 9, 4, 1, '#1a1a1a'); break;
    case 'kondom': R(x, 3, 3, 10, 10, '#2f5fb8'); R(x, 4, 4, 8, 8, '#4a7ad8'); E(x, 8, 8, 3, 3, '#e8e4dc'); E(x, 8, 8, 2, 2, '#c9ccd2'); R(x, 3, 3, 10, 1, '#ffffff'); break;
    case 'kebap': R(x, 3, 4, 10, 9, '#e8c890'); R(x, 4, 6, 8, 3, '#8a4a2a'); R(x, 4, 9, 8, 1, '#3f8a3a'); R(x, 4, 10, 8, 1, '#c8352d'); break;
    default: R(x, 3, 3, 10, 10, '#8a9096');
  }
  ICON_CACHE[icon] = c.toDataURL();
  return ICON_CACHE[icon];
}

const UI = {
  els: {}, dlgOpen: false, _dlgResolve: null, _typing: null, _choices: null, _sel: 0, ovOpen: false,
  init() {
    for (const id of ['hud', 'hClock', 'hDay', 'hPlace', 'hEur', 'hChf', 'hProm', 'boardText', 'boardGl', 'toasts', 'dialog', 'dlgPort', 'dlgName', 'dlgText', 'dlgChoices', 'overlay', 'fade', 'fadeText', 'fadeCv', 'touch', 'btnA', 'actLabel', 'coaster', 'btnPhone']) this.els[id] = document.getElementById(id);
    this.els.dialog.addEventListener('pointerdown', (e) => { if (e.target.closest('.choice')) return; e.preventDefault(); this.dlgAdvance(); });
    this.els.btnPhone.addEventListener('click', () => { if (!G.busy && !this.ovOpen) Phone.open(); });
  },
  /* ---- HUD ---- */
  hud() {
    if (!G.S) return;
    const e = this.els, st = G.S.st;
    e.hClock.textContent = clockStr();
    const cd = calDate();
    e.hDay.textContent = `${dayStr()} ${cd.d}.${cd.m}.` + (dayOf(G.S.time) ? ' · Tag ' + (dayOf(G.S.time) + 1) : '');
    e.hPlace.textContent = G.map ? G.map.name : '';
    e.hEur.textContent = fmtEur(G.S.money.eur);
    e.hChf.textContent = fmtChf(G.S.money.chf);
    e.hProm.textContent = promStr();
    e.hProm.style.color = st.prom > 2 ? 'var(--bad)' : st.prom > 1.2 ? 'var(--warn)' : st.prom > 0.5 ? 'var(--amber)' : 'var(--ink)';
    const setBar = (id, v, inv) => { const el = document.getElementById(id).querySelector('i'); el.style.setProperty('--v', Math.round(v) + '%'); const good = inv ? 100 - v : v; el.style.setProperty('--c', good > 55 ? 'var(--ok)' : good > 25 ? 'var(--warn)' : 'var(--bad)'); };
    setBar('bEnergy', st.energy); setBar('bFood', st.food); setBar('bMood', st.mood);
    e.boardText.textContent = Story.objective();
    e.boardGl.textContent = Story.objectiveTag();
    this.drawCoaster();
  },
  drawCoaster() {
    const cv = this.els.coaster, x = cv.getContext('2d');
    const n = G.S.beers;
    if (this._lastBeers === n) return;
    this._lastBeers = n;
    x.clearRect(0, 0, 44, 44);
    const groups = Math.floor(n / 5), rest = n % 5;
    let gx = 7, gy = 10;
    x.fillStyle = '#2a2a3a';
    const drawGroup = (k, full) => { for (let i = 0; i < k; i++) x.fillRect(gx + i * 3, gy, 1.5, 9); if (full) { x.save(); x.translate(gx - 1, gy + 7); x.rotate(-0.55); x.fillRect(0, 0, 16, 1.5); x.restore(); } gx += 15; if (gx > 33) { gx = 7; gy += 12; } };
    for (let i = 0; i < Math.min(groups, 4); i++) drawGroup(4, true);
    if (groups < 4) drawGroup(rest, false);
    if (n === 0) { x.fillStyle = '#c8352d'; x.font = 'bold 10px Barlow Semi Condensed, sans-serif'; x.textAlign = 'center'; x.fillText('PROST', 22, 26); }
    if (n > 20) { x.fillStyle = '#c8352d'; x.font = 'bold 11px Barlow Semi Condensed, sans-serif'; x.textAlign = 'center'; x.fillText(n, 22, 40); }
  },
  toast(html, type = '') {
    const d = document.createElement('div');
    d.className = 'toast ' + type;
    d.innerHTML = `<span>${html}</span><b class="x" aria-label="Schliessen">×</b>`;
    this.els.toasts.appendChild(d);
    while (this.els.toasts.children.length > 4) this.els.toasts.firstChild.remove();
    const close = () => { if (d.classList.contains('out')) return; d.classList.add('out'); setTimeout(() => d.remove(), 350); };
    d.addEventListener('pointerdown', (e) => { e.stopPropagation(); close(); });
    setTimeout(close, type === 'ach' ? 9000 : 8000);
  },
  /* ---- Sprecher ---- */
  speaker(sp) {
    if (!sp) return null;
    if (sp === 'me') return { name: G.S.name, look: G.S.look };
    if (typeof sp === 'string') {
      if (FRIENDS[sp]) return { name: FRIENDS[sp].name, look: FRIENDS[sp].look, bg: FRIENDS[sp].bg };
      const n = G.npcs.find((a) => a.name && a.name.startsWith(sp));
      if (n) return { name: sp, look: n.look };
      let h = 7; for (const ch of sp) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      return { name: sp, look: npcLook(h) };
    }
    return sp;
  },
  showDlg(sp) {
    const s = this.speaker(sp);
    const d = this.els.dialog;
    d.hidden = false;
    this.dlgOpen = true;
    this.els.touch.querySelector('#btnA').classList.add('idle');
    if (s && s.look) {
      d.classList.remove('noport');
      const pc = this.els.dlgPort.getContext('2d');
      pc.imageSmoothingEnabled = false;
      pc.clearRect(0, 0, 64, 64);
      pc.drawImage(portraitCanvas(s.look, s.bg || '#2a3a52'), 0, 0);
    } else d.classList.add('noport');
    this.els.dlgName.textContent = s ? s.name : '';
    this.els.dlgName.hidden = !s;
  },
  type(text) {
    const el = this.els.dlgText;
    return new Promise((res) => {
      el.innerHTML = '';
      const full = text;
      let i = 0;
      const plain = full.replace(/<[^>]+>/g, '');
      if (plain.length > 0 && Snd.on) Snd.sfx('talk');
      const step = () => {
        i += 2;
        if (i >= plain.length) { el.innerHTML = full; this._typing = null; res(); return; }
        el.textContent = plain.slice(0, i);
        if (i % 12 === 0) Snd.sfx('talk');
        this._typing = { t: setTimeout(step, 22), finish: () => { clearTimeout(this._typing.t); el.innerHTML = full; this._typing = null; res(); } };
      };
      step();
    });
  },
  async say(sp, text) {
    this.showDlg(sp);
    this.els.dlgChoices.innerHTML = '';
    await this.type(text);
    const more = document.createElement('span'); more.className = 'dlg-more'; more.textContent = '▼'; this.els.dlgText.appendChild(more);
    await new Promise((res) => { this._dlgResolve = res; });
    this.hideDlg();
  },
  dlgAdvance() {
    if (!this.dlgOpen) return;
    if (this._typing) { this._typing.finish(); return; }
    if (this._choices) return;
    if (this._dlgResolve) { const r = this._dlgResolve; this._dlgResolve = null; Snd.sfx('blip'); r(); }
  },
  hideDlg() { this.els.dialog.hidden = true; this.dlgOpen = false; this.els.btnA.classList.remove('idle'); },
  async ask(sp, text, opts) {
    this.showDlg(sp);
    this.els.dlgChoices.innerHTML = '';
    await this.type(text);
    return new Promise((res) => {
      const box = this.els.dlgChoices;
      const items = opts.map((o) => (typeof o === 'string' ? { t: o } : o));
      this._choices = items;
      this._sel = items.findIndex((o) => !o.disabled);
      items.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'choice';
        b.innerHTML = `<span>${o.t}</span>${o.r ? `<small>${o.r}</small>` : ''}`;
        if (o.disabled) b.disabled = true;
        b.addEventListener('click', (e) => { e.stopPropagation(); pickC(i); });
        box.appendChild(b);
      });
      const pickC = (i) => { if (items[i].disabled) return; Snd.sfx('blip'); this._choices = null; this._pick = null; this.hideDlg(); this.els.dlgChoices.innerHTML = ''; res(i); };
      this._pick = pickC;
      this.markSel();
    });
  },
  markSel() { [...this.els.dlgChoices.children].forEach((b, i) => b.classList.toggle('sel', i === this._sel)); },
  dlgKey(code) {
    if (!this.dlgOpen) return false;
    if (this._choices) {
      const n = this._choices.length;
      if (code === 'ArrowDown' || code === 'KeyS') { do { this._sel = (this._sel + 1) % n; } while (this._choices[this._sel].disabled); this.markSel(); }
      else if (code === 'ArrowUp' || code === 'KeyW') { do { this._sel = (this._sel - 1 + n) % n; } while (this._choices[this._sel].disabled); this.markSel(); }
      else if (code === 'Enter' || code === 'Space' || code === 'KeyE') this._pick(this._sel);
      else if (/^Digit[1-9]$/.test(code)) { const i = +code.slice(5) - 1; if (i < n) this._pick(i); }
      else if (code === 'Escape') { const i = this._choices.length - 1; this._pick(i); }
      return true;
    }
    if (['Enter', 'Space', 'KeyE', 'Escape'].includes(code)) this.dlgAdvance();
    return true;
  },
  /* ---- Überblenden ---- */
  fadeOut(text = '') { this.els.fade.classList.remove('scene'); this.els.fadeText.textContent = text; this.els.fade.classList.add('on'); return sleep(380); },
  async fadeIn() { this.els.fade.classList.remove('on'); await sleep(300); this.els.fade.classList.remove('scene'); },
  async card(text, ms = 1600) { await this.fadeOut(text); await sleep(ms); await this.fadeIn(); },
  /* Spiel verloren: Es gibt nur den Neustart. */
  gameOver(title, text) {
    const html = `<div class="panel"><div class="panel-head"><h2>${title}</h2></div><div class="panel-body">
      <p class="note">${text}</p>
      <p class="note">Der Ausflug ist vorbei, bevor er angefangen hat. Der Spielstand wird gelöscht – versuch es nochmal.</p>
      </div><div class="panel-foot"><span>Game Over</span><button class="btn primary" id="goRestart">Von vorne anfangen</button></div></div>`;
    const o = this.overlay(html, null);
    o.querySelector('#goRestart').addEventListener('click', () => { clearSave(); try { localStorage.removeItem(SAVE_KEY + '-img'); } catch (e) {} location.reload(); });
    G.mode = 'over';
  },
  /* ---- Overlay ---- */
  overlay(html, onClose) {
    const o = this.els.overlay;
    o.innerHTML = html;
    o.hidden = false;
    document.body.classList.add('ov');
    this.ovOpen = true;
    this._ovClose = onClose;
    G.busy++;
    o.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => this.closeOverlay()));
    return o;
  },
  closeOverlay() {
    if (!this.ovOpen) return;
    const o = this.els.overlay;
    o.hidden = true; o.innerHTML = '';
    document.body.classList.remove('ov');
    this.ovOpen = false;
    G.busy = Math.max(0, G.busy - 1);
    const f = this._ovClose; this._ovClose = null;
    if (f) f();
    this.hud();
  },
  /* ---- Aktionshinweis ---- */
  updatePrompt() {
    const l = this.els.actLabel;
    if (G.busy || !G.map) { l.hidden = true; return; }
    const it = findInteraction();
    if (it) { l.hidden = false; const lbl = it.label || ''; if (l._t !== lbl) { l.innerHTML = `<kbd>${Input.touch ? 'A' : 'E'}</kbd>${lbl}`; l._t = lbl; } }
    else l.hidden = true;
  },
  /* ---- Laden ---- */
  shop(def) {
    return new Promise((resolve) => {
      const cur = def.cur || 'eur';
      const render = () => {
        const money = cur === 'eur' ? fmtEur(G.S.money.eur) : fmtChf(G.S.money.chf);
        let body = '';
        for (const sec of def.sections) {
          body += `<div class="shop-sec">${sec.t}</div>`;
          for (const it of sec.items) {
            const item = ITEMS[it.id] || {};
            const price = it.price;
            const ok = canPay(cur, price) && (!it.cond || it.cond());
            const priceTxt = cur === 'eur' ? fmtEur(price) : fmtChf(price);
            const consumable = ['drink', 'food', 'med'].includes(item.t) && !it.special && def.mode === 'eat';
            const have = G.S.inv[it.id] ? `<span class="have">🎒 ${G.S.inv[it.id]}</span>` : '';
            const btns = consumable
              ? `<button class="btn buy" data-i="${it.key}" ${ok ? '' : 'disabled'} title="Jetzt ${item.t === 'food' ? 'essen' : 'trinken'}">${priceTxt}</button><button class="btn take" data-i="${it.key}" ${ok ? '' : 'disabled'} title="Mitnehmen (in die Tasche)">🎒</button>`
              : `<button class="btn buy" data-i="${it.key}" ${ok ? '' : 'disabled'}>${priceTxt}</button>`;
            body += `<div class="shop-item ${ok ? '' : 'off'}"><img alt="" src="${itemIconURL(it.icon || item.icon)}"><span><span class="nm">${it.n || item.n}${have}</span><br><span class="ds">${it.d || itemDesc(it.id)}</span></span><span class="pr">${btns}</span></div>`;
          }
        }
        const foot = def.foot || (def.mode === 'eat' ? 'Preis = jetzt konsumieren · 🎒 = mitnehmen' : def.mode === 'take' ? 'Gekauftes landet in der Tasche (Handy)' : 'Tippen zum Kaufen');
        return `<div class="panel"><div class="panel-head"><h2>${def.title}</h2><span class="sub">${money}</span><button class="x-btn" data-close aria-label="Schliessen">×</button></div><div class="panel-body">${def.intro ? `<p class="note">${def.intro}</p>` : ''}${body}</div><div class="panel-foot"><span>${foot}</span><button class="btn" data-close>Fertig</button></div></div>`;
      };
      const flat = {};
      let k = 0;
      for (const sec of def.sections) for (const it of sec.items) { it.key = k; flat[k++] = it; }
      const o = this.overlay(render(), resolve);
      const wire = () => {
        o.querySelectorAll('.shop-item .buy, .shop-item .take').forEach((b) => b.addEventListener('click', async () => {
          const it = flat[b.dataset.i];
          const done = await Story.buy(def, it, cur, { take: b.classList.contains('take') });
          if (done === 'close') { this.closeOverlay(); return; }
          const scroll = o.querySelector('.panel-body').scrollTop;
          o.innerHTML = render(); o.querySelector('.panel-body').scrollTop = scroll;
          o.querySelectorAll('[data-close]').forEach((x) => x.addEventListener('click', () => this.closeOverlay()));
          wire();
          this.hud();
        }));
      };
      wire();
    });
  },
};
function itemDesc(id) {
  const it = ITEMS[id]; if (!it) return '';
  const p = [];
  if (it.t === 'ticket') p.push('12 Personen, 2. Klasse, gültig heute');
  if (it.alc) p.push('Alkohol');
  if (it.food) p.push(it.food >= 50 ? 'macht richtig satt' : it.food >= 25 ? 'macht satt' : 'Snack');
  if (it.en > 10) p.push('weckt auf');
  if (it.nau < -20) p.push('beruhigt den Magen');
  if (it.hang) p.push('gegen Kater');
  if (it.water) p.push('Wasser');
  if (it.t === 'souv') p.push('Andenken');
  return p.join(' · ');
}

/* ============ Handy ============ */
const Phone = {
  tab: 'ziele',
  open(tab) {
    if (tab) this.tab = tab;
    const o = UI.overlay(`<div class="panel" style="height:min(720px,100%)"><div class="panel-head"><h2>${G.S.name}s Handy</h2><span class="sub">${clockStr()} · ${dateStr()}</span><button class="x-btn" data-close aria-label="Schliessen">×</button></div>
      <div class="tabs" role="tablist">${[['ziele', 'Ziele'], ['karte', 'Karte'], ['inv', 'Tasche'], ['fotos', 'Fotos'], ['status', 'Status'], ['opt', 'Optionen']].map(([k, n]) => `<button class="tab ${k === this.tab ? 'on' : ''}" data-tab="${k}" role="tab">${n}</button>`).join('')}</div>
      <div class="panel-body" id="phoneBody"></div></div>`);
    o.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => { this.tab = b.dataset.tab; o.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x === b)); this.render(); }));
    this.render();
  },
  render() {
    const b = document.getElementById('phoneBody');
    if (!b) return;
    b.innerHTML = '';
    this[this.tab](b);
  },
  ziele(b) {
    const steps = Story.steps();
    const achN = Object.keys(G.S.ach).length, achT = Object.keys(ACH).length;
    b.innerHTML = `<div class="row" style="border-color:var(--amber)"><div><div class="d">Jetzt</div><div class="t">${Story.objective()}</div></div></div>
      <div class="shop-sec">Reiseplan</div><div class="list">${steps.map((s) => `<div class="row ${s.done ? 'done' : ''}"><div><div class="t">${s.t}</div>${s.d ? `<div class="d">${s.d}</div>` : ''}</div><span class="${s.done ? 'tick' : 'open'}">${s.done ? '✓' : '·'}</span></div>`).join('')}</div>
      <div class="shop-sec">Erlebnisse ${achN}/${achT}</div><div class="list">${Object.entries(ACH).map(([k, [t, d]]) => `<div class="row ${G.S.ach[k] ? 'done' : ''}"><div><div class="t">${G.S.ach[k] ? t : '???'}</div><div class="d">${d}</div></div><span class="${G.S.ach[k] ? 'tick' : 'open'}">${G.S.ach[k] ? '✓' : '·'}</span></div>`).join('')}</div>`;
  },
  karte(b) {
    const showCity = G.map.indoor && BUILT.ibk && (['hotel_lobby', 'hotel_floor', 'hotel_room', 'bar', 'stueberl', 'club', 'rouge', 'casino'].includes(G.map.id) || G.map.id.startsWith('shop_'));
    const m = showCity ? BUILT.ibk : G.map;
    const sc = m.w > 60 ? 7 : 9;
    const [c, x] = canvas(m.w * sc, m.h * sc);
    const col = { [T.WATER]: '#3f86a8', [T.GRASS]: '#5c8a3e', [T.FOREST]: '#2f4a2e', [T.ASPH]: '#5a5d62', [T.TRAMR]: '#5a5d62', [T.ZEBRA]: '#8a8d92', [T.PLAZA]: '#d6cbb8', [T.COBBLE]: '#a49a8a', [T.PAVE]: '#c3bcae', [T.BRIDGE]: '#b0a690', [T.HEDGE]: '#2f5a2a', [T.GRAVEL]: '#c2b59a', [T.WALL]: '#3a3430', [T.WALLF]: '#5a5048', [T.RAIL]: '#6a5a4a', [T.PLAT]: '#b7b3aa', [T.EDGE]: '#c8b860', [T.STONE]: '#d6cfc1', [T.ROCK]: '#9a958c', [T.MEADOW]: '#86a058', [T.CLIFF]: '#6a665e', [T.DECK]: '#9a774e' };
    for (let y = 0; y < m.h; y++) for (let xx = 0; xx < m.w; xx++) { const t = m.at(xx, y); R(x, xx * sc, y * sc, sc, sc, col[t] || '#7a7470'); }
    for (const o of m.objs) { if (!o.bld && o.w < 2) continue; R(x, o.x * sc, o.y * sc, o.w * sc, o.h * sc, o.bld ? shade(o.bld.roof, -0.1) : '#6a6058'); if (o.bld) R(x, o.x * sc, (o.y + o.h) * sc - 2, o.w * sc, 2, shade(o.bld.wall, -0.1)); }
    const pois = Story.mapPois(m.id);
    x.font = 'bold 13px Barlow Semi Condensed, sans-serif';
    pois.forEach((p, i) => {
      const px = (p.x + 0.5) * sc, py = (p.y + 0.5) * sc;
      const ly = py + (i % 2 ? -9 : 13);
      E(x, px, py, 6, 6, '#0f1a2b'); E(x, px, py, 5, 5, p.c);
      x.lineWidth = 3; x.strokeStyle = '#0f1a2b'; x.strokeText(p.n, px - 4, ly); x.fillStyle = '#ffffff'; x.fillText(p.n, px - 4, ly);
    });
    /* Die Jungs: pro Ort ein weisser Kreis mit Anzahl */
    if (m.id === 'ibk') {
      const groups = {};
      for (const k of Object.keys(FRIENDS)) { const w = Story.whereIs(k); if (w.x == null) continue; const key = w.x + ',' + w.y; (groups[key] = groups[key] || { x: w.x, y: w.y, names: [] }).names.push(FRIENDS[k].name); }
      for (const g of Object.values(groups)) { const px = (g.x + 0.5) * sc + 9, py = (g.y + 0.5) * sc - 9; E(x, px, py, 8, 8, '#0f1a2b'); E(x, px, py, 7, 7, '#ffffff'); x.fillStyle = '#0f1a2b'; x.font = 'bold 11px Barlow Semi Condensed, sans-serif'; x.fillText(String(g.names.length), px - (g.names.length > 9 ? 6 : 3), py + 4); }
    }
    if (G.map.id === m.id) { const px = G.player.x / TS * sc, py = G.player.y / TS * sc; E(x, px, py, 6, 6, '#ffffff'); E(x, px, py, 4, 4, '#d8352d'); }
    b.innerHTML = `<div class="note">${m.id === 'ibk' ? 'Innsbruck: Nordkette im Norden, der Inn, darunter Altstadt, Maria-Theresien-Strasse und Hauptbahnhof. Weisse Kreise mit Zahl: so viele der Jungs sind dort – Details unter Status.' : m.name}</div><div class="mapwrap"></div><div class="legend"><span><i style="background:#d8352d"></i>Du</span><span><i style="background:#ffffff"></i>Die Jungs</span><span><i style="background:#ffb53d"></i>Lokale</span><span><i style="background:#6cc46f"></i>Läden</span><span><i style="background:#7ab0f0"></i>Sehenswert</span><span><i style="background:#e85af0"></i>Nachtleben</span></div>`;
    c.style.width = (m.w * sc) + 'px';
    b.querySelector('.mapwrap').appendChild(c);
    const wrap = b.querySelector('.mapwrap');
    const focus = G.map.id === m.id ? [G.player.x / TS, G.player.y / TS] : (Story.playerCityPos ? Story.playerCityPos() : [48, 45]);
    setTimeout(() => { wrap.scrollLeft = focus[0] * sc - wrap.clientWidth / 2; wrap.scrollTop = focus[1] * sc - wrap.clientHeight / 2; }, 0);
    if (false) setTimeout(() => { wrap.scrollLeft = G.player.x / TS * sc - wrap.clientWidth / 2; wrap.scrollTop = G.player.y / TS * sc - wrap.clientHeight / 2; }, 0);
  },
  inv(b) {
    const ids = Object.keys(G.S.inv).filter((k) => G.S.inv[k] > 0);
    const L = G.S.look;
    b.innerHTML = `<div class="note">Du trägst: ${optName('top', L.top)} (${optName('topCol', L.topCol)}), ${optName('pants', L.pants)}, ${optName('shoes', L.shoes)}${L.hat ? ', ' + optName('hat', L.hat) : ''}.</div>`;
    if (!ids.length) { b.innerHTML += '<p class="note">Deine Taschen sind leer. Was du im Laden kaufst oder in der Bar mit 🎒 mitnimmst, landet hier – und kannst du jederzeit konsumieren.</p>'; return; }
    for (const id of ids) {
      const it = ITEMS[id];
      const usable = ['drink', 'food', 'med', 'pack', 'smoke', 'read', 'souv', 'ticket'].includes(it.t);
      const uses = G.S.uses[id];
      const row = document.createElement('div');
      row.className = 'shop-item';
      row.innerHTML = `<img alt="" src="${itemIconURL(it.icon)}"><span><span class="nm">${it.n}${G.S.inv[id] > 1 ? ' ×' + G.S.inv[id] : ''}</span><br><span class="ds">${uses ? uses + ' übrig · ' : ''}${itemDesc(id)}</span></span>${usable ? `<button class="btn">${{ drink: 'Trinken', food: 'Essen', med: 'Nehmen', pack: 'Öffnen', smoke: 'Rauchen', read: 'Lesen', souv: 'Ansehen', ticket: 'Ansehen' }[it.t]}</button>` : '<span></span>'}`;
      const btn = row.querySelector('button');
      if (btn) btn.addEventListener('click', async () => { UI.closeOverlay(); G.busy++; await Story.useItem(id); G.busy--; UI.hud(); });
      b.appendChild(row);
    }
  },
  fotos(b) {
    const grid = document.createElement('div');
    grid.className = 'photos';
    for (const [id, s] of Object.entries(SIGHTS)) {
      const d = document.createElement('div');
      if (G.S.photos[id]) {
        d.className = 'photo';
        d.style.setProperty('--r', ((hash(id.length, id.charCodeAt(0)) - 0.5) * 4).toFixed(1) + 'deg');
        const src = (G.photoImg || {})[id];
        d.innerHTML = `${src ? `<img alt="" src="${src}" style="width:100%;image-rendering:pixelated;display:block">` : '<canvas width="64" height="40"></canvas>'}<b>${s.n}</b><p>${s.f}</p>`;
        if (!src) { const cv = d.querySelector('canvas').getContext('2d'); R(cv, 0, 0, 64, 40, '#8ec3e6'); R(cv, 0, 26, 64, 14, '#7a9a5a'); R(cv, 20, 10, 24, 18, '#e8c9a0'); R(cv, 18, 6, 28, 5, '#8a3b2a'); }
      } else { d.className = 'photo missing'; d.innerHTML = `<span>${s.n}<br><small>noch kein Foto</small></span>`; }
      grid.appendChild(d);
    }
    b.innerHTML = `<div class="note">${Object.keys(G.S.photos).length} von ${Object.keys(SIGHTS).length} Sehenswürdigkeiten fotografiert. Stell dich davor und tippe auf „Foto“.</div>`;
    b.appendChild(grid);
  },
  status(b) {
    const st = G.S.st;
    const awake = Math.max(0, minutesAwake() / 60).toFixed(1).replace('.', ',');
    const food = Math.max(0, (G.S.time - G.S.lastFood) / 60).toFixed(1).replace('.', ',');
    const f = (v) => Math.round(v);
    b.innerHTML = `<div class="statgrid">
      <div class="stat"><small>Energie</small><b>${f(st.energy)} %</b></div><div class="stat"><small>Sättigung</small><b>${f(st.food)} %</b></div>
      <div class="stat"><small>Laune</small><b>${f(st.mood)} %</b></div><div class="stat"><small>Pegel</small><b>${promStr()}</b></div>
      <div class="stat"><small>Übelkeit</small><b style="color:${st.nau > 80 ? 'var(--bad)' : st.nau > 50 ? 'var(--warn)' : 'var(--ink)'}">${f(st.nau)} %</b></div><div class="stat"><small>Kater</small><b>${st.hang > 0 ? 'ja' : 'nein'}</b></div>
      <div class="stat"><small>Wach seit</small><b>${awake} h</b></div><div class="stat"><small>Letzte Mahlzeit</small><b>vor ${food} h</b></div>
      <div class="stat"><small>Bier gesamt</small><b>${G.S.beers}</b></div><div class="stat"><small>Schnäpse & Shots</small><b>${G.S.shots}</b></div>
      <div class="stat"><small>Jass gewonnen / verloren</small><b>${G.S.rec.jassW} / ${G.S.rec.jassL}</b></div><div class="stat"><small>Bestes Darts</small><b>${G.S.rec.darts}</b></div>
      <div class="stat"><small>Bestes Tanzen</small><b>${G.S.rec.dance} %</b></div><div class="stat"><small>Rekord Flitzer</small><b>${G.S.rec.stone}×</b></div></div>
      <p class="note">Wer viel trinkt, ohne zu essen oder zu schlafen, dem wird übel. Bei 100 % Übelkeit musst du dich übergeben. Essen, Wasser und Schlaf helfen. Ab 2,6 ‰ droht ein Filmriss.</p>
      <div class="shop-sec">Die Jungs – wo sie sind, wie gut ihr euch versteht, ihr Pegel</div><div class="list">${Object.entries(FRIENDS).map(([k, fr]) => { const w = Story.whereIs(k); const pr = (G.S.fprom && G.S.fprom[k]) || 0; return `<div class="row"><div><div class="t">${fr.name} <small style="color:var(--ink-dim)">· ${fr.role}</small></div><div class="d">📍 ${w.t}${pr > 0.3 ? ` · 🍺 ${promStr(pr)}${pr > 2 ? ' – sturzbetrunken' : pr > 1.2 ? ' – angeheitert' : ''}` : ''}</div></div><div class="bar" style="width:120px;grid-template-columns:1fr"><i style="--v:${f(G.S.aff[k])}%;--c:var(--amber)"></i></div></div>`; }).join('')}</div>`;
  },
  opt(b) {
    b.innerHTML = `<div class="opt-row"><span>Soundeffekte</span><button class="btn" id="oSnd">${Snd.on ? 'An' : 'Aus'}</button></div>
      <div class="opt-row"><span>Musik</span><button class="btn" id="oMus">${Snd.musicOn ? 'An' : 'Aus'}</button></div>
      <p class="note">Ton: ${Snd.state()}. Kein Ton auf dem Handy? Beim iPhone den Stummschalter an der Seite umlegen und die Lautstärke hochdrehen; danach einmal auf den Bildschirm tippen.</p>
      <div class="opt-row"><span>Jasskarten</span><button class="btn" id="oDeck">${G.S.flags.deck === 'fr' ? 'Französisch' : 'Deutsch'}</button></div>
      <div class="opt-row"><span>Spielstand</span><button class="btn primary" id="oSave">Speichern</button></div>
      <div class="opt-row"><span>Neues Spiel beginnen</span><button class="btn red" id="oNew">Neu starten</button></div>
      <p class="note">Steuerung: Pfeiltasten oder WASD gehen, Shift rennen, E oder Leertaste für Aktionen, M öffnet das Handy. Auf dem Handy: links ziehen zum Gehen (weit ziehen = rennen), A-Knopf für Aktionen.</p>
      <div class="shop-sec">Version ${APP_VERSION} · ${APP_VERSION_DATE}</div>
      <div class="changelog">${changelogHtml()}</div>`;
    b.querySelector('#oSnd').onclick = (e) => { Snd.on = !Snd.on; e.target.textContent = Snd.on ? 'An' : 'Aus'; };
    b.querySelector('#oMus').onclick = (e) => { Snd.musicOn = !Snd.musicOn; e.target.textContent = Snd.musicOn ? 'An' : 'Aus'; };
    b.querySelector('#oDeck').onclick = (e) => { G.S.flags.deck = G.S.flags.deck === 'fr' ? 'de' : 'fr'; e.target.textContent = G.S.flags.deck === 'fr' ? 'Französisch' : 'Deutsch'; };
    b.querySelector('#oSave').onclick = () => saveGame();
    const nb = b.querySelector('#oNew');
    nb.onclick = () => { if (nb.dataset.sure) { clearSave(); location.reload(); } else { nb.dataset.sure = 1; nb.textContent = 'Wirklich? Nochmal tippen'; } };
  },
};
