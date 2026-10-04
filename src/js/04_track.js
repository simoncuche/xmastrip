/* ============ Tracking: Spielfortschritt pro Gerät in Firebase (Realtime Database über REST, ohne Bibliothek) ============
   TRACK_DB kommt aus tracking.json (build.py). Leer, offline, abgeschaltet oder nicht erreichbar: das Spiel läuft einfach weiter.
   Daten: devices/<Gerät> = { info, lastSeen, current, label?, games/<gameId> = { s: Spielstand-Auszug, started, log/<id> } }.
   Die Auswertung zeigt dist/tracker.html. */
const Track = {
  KEY: 'gleis4-device',
  OFF_KEY: 'gleis4-track-off',
  MIN_GAP: 45000,
  _last: 0, _blockUntil: 0, _backoff: 60000, _busy: false, _timer: 0, _log: {}, _n: 0,
  enabled() { return !!(typeof TRACK_DB === 'string' && TRACK_DB) && !this.optOut(); },
  optOut() { try { return localStorage.getItem(this.OFF_KEY) === '1'; } catch (e) { return false; } },
  setOptOut(off) { try { if (off) localStorage.setItem(this.OFF_KEY, '1'); else localStorage.removeItem(this.OFF_KEY); } catch (e) {} if (!off) this.send('optin', true); },
  device() {
    let id = '';
    try { id = localStorage.getItem(this.KEY) || ''; } catch (e) {}
    if (!/^[a-z0-9]{6,32}$/.test(id)) { id = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); try { localStorage.setItem(this.KEY, id); } catch (e) {} }
    return id;
  },
  deviceInfo() {
    const ua = navigator.userAgent || '';
    const os = /iPhone/.test(ua) ? 'iPhone' : /iPad|Macintosh.*Mobile/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Unbekannt';
    const br = /Edg\//.test(ua) ? 'Edge' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
    let app = false; try { app = !!(navigator.standalone || matchMedia('(display-mode: standalone)').matches); } catch (e) {}
    return { os, browser: br, app, screen: `${screen.width}×${screen.height}`, lang: navigator.language || '' };
  },
  /* Auszug aus dem Spielstand: Fortschritt, Werte, Erlebnisse, Rekorde */
  snapshot() {
    const S = G.S, r1 = (v) => Math.round((v || 0) * 10) / 10;
    const st = {}; for (const k of Object.keys(S.st)) st[k] = k === 'prom' ? Math.round(S.st.prom * 100) / 100 : r1(S.st[k]);
    return {
      name: S.name, pid: S.pid || '', role: (typeof CREW !== 'undefined' && (CREW.find((c) => c.id === S.pid) || {}).role) || '',
      look: S.look, stage: S.stage, stageIdx: STAGES.indexOf(S.stage), day: dayOf(S.time), time: Math.round(S.time),
      when: `${dateStr()} ${clockStr()}`, map: (G.map && G.map.name) || S.map || '',
      st, money: { eur: Math.round(S.money.eur * 100) / 100, chf: Math.round(S.money.chf * 100) / 100 },
      beers: S.beers || 0, shots: S.shots || 0, burgers: S.burgers || 0,
      ach: Object.keys(S.ach || {}), achTotal: Object.keys(ACH).length,
      sights: Object.keys(S.photos || {}).length, rec: S.rec || {},
      finished: !!S.finished, apoc: !!(S.flags && S.flags.apocDone), over: G.mode === 'over',
      v: APP_VERSION, at: { '.sv': 'timestamp' },
    };
  },
  /* Ereignis fürs Protokoll merken; wichtige Ereignisse sofort senden */
  event(kind, val, now) {
    if (!this.enabled() || !G.S) return;
    const id = Date.now().toString(36) + (this._n++ % 36).toString(36);
    this._log[id] = { e: kind, v: val == null ? '' : String(val).slice(0, 80), when: G.S.time != null ? `${dateStr()} ${clockStr()}` : '', at: { '.sv': 'timestamp' } };
    if (now) this.send(kind, true);
    else this.send(kind);
  },
  /* Senden mit Drosselung (MIN_GAP), Zeitlimit und Pause nach Fehlern; Fehler werden still ignoriert */
  send(reason, force, keepalive) {
    if (!this.enabled() || !G.S || !G.S.flags || !G.S.flags.gameId) return;
    const now = Date.now();
    if (now < this._blockUntil || (typeof navigator !== 'undefined' && navigator.onLine === false)) return;
    if (this._busy && !keepalive) { this._again = this._again === 'force' || force ? 'force' : 'later'; return; }
    if (!force && now - this._last < this.MIN_GAP) {
      if (!this._timer) this._timer = setTimeout(() => { this._timer = 0; this.send('later'); }, this.MIN_GAP - (now - this._last) + 50);
      return;
    }
    clearTimeout(this._timer); this._timer = 0;
    const gid = G.S.flags.gameId, base = `games/${gid}`;
    const body = { info: this.deviceInfo(), lastSeen: { '.sv': 'timestamp' }, current: gid, [`${base}/s`]: this.snapshot() };
    if (!G.S.flags.trackStarted) body[`${base}/started`] = { '.sv': 'timestamp' };
    const log = this._log; this._log = {};
    for (const k of Object.keys(log)) body[`${base}/log/${k}`] = log[k];
    this._last = now; this._busy = true;
    const url = `${TRACK_DB.replace(/\/+$/, '')}/devices/${this.device()}.json`;
    let ctl = null, to = 0;
    try { ctl = new AbortController(); to = setTimeout(() => ctl.abort(), 7000); } catch (e) {}
    let p;
    try { p = fetch(url, { method: 'PATCH', body: JSON.stringify(body), keepalive: !!keepalive, signal: ctl ? ctl.signal : undefined, headers: { 'Content-Type': 'application/json' } }); }
    catch (e) { p = Promise.reject(e); }
    p.then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      G.S.flags.trackStarted = 1; this._backoff = 60000;
    }).catch(() => {
      /* Nicht erreichbar: Ereignisse für später behalten, eine Weile Pause (bis 30 Minuten) */
      Object.assign(this._log, log);
      const keys = Object.keys(this._log); if (keys.length > 40) for (const k of keys.slice(0, keys.length - 40)) delete this._log[k];
      this._blockUntil = Date.now() + this._backoff; this._backoff = Math.min(this._backoff * 2, 30 * 60000);
    }).finally(() => {
      clearTimeout(to); this._busy = false;
      if (this._again) { const f = this._again === 'force'; this._again = false; this.send('again', f); }
    });
  },
  init() {
    if (this._init) return; this._init = true;
    /* Regelmässiges Lebenszeichen, solange gespielt wird */
    setInterval(() => { if (G.S && G.mode === 'play' && !document.hidden) this.send('tick'); }, 60000);
    document.addEventListener('visibilitychange', () => { if (document.hidden && G.S) this.send('hide', true, true); });
    window.addEventListener('pagehide', () => { if (G.S) this.send('hide', true, true); });
  },
};
