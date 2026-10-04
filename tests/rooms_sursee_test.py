#!/usr/bin/env python3
"""Prüft die Sursee-Innenräume (06_sursee_rooms.js) im Headless-Browser.

Für jeden Raum: Karte laden, Bildschirmfoto (Spielansicht + ganze Karte) nach SHOT_DIR (falls gesetzt),
dann per Breitensuche über begehbare Kacheln ab dem Eingang prüfen, ob jeder Auslöser (Trigger),
jede feste Figur (npcDefs) und jeder Story-Platz (spots) erreichbar bzw. ansprechbar ist.
Benötigt: pip install playwright (CHROMIUM_PATH=/pfad/zu/chrome für einen vorhandenen Chromium)
"""
import base64, json, os, pathlib, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / "build.py")], check=True)
URL = (ROOT / "dist" / "index.html").as_uri()
SHOT = os.environ.get("SHOT_DIR")
if SHOT:
    pathlib.Path(SHOT).mkdir(parents=True, exist_ok=True)
DEFAULT_CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
CHROME = os.environ.get("CHROMIUM_PATH") or (DEFAULT_CHROME if os.path.exists(DEFAULT_CHROME) else None)
errors = []

# Sur existiert in diesem Zweig evtl. noch nicht: Platzhalter, der für jede Funktion true liefert
STUB = """() => { if (typeof Sur === 'undefined') window.Sur = new Proxy({}, { get: () => () => true }); }"""

# Breitensuche: Kachel begehbar = nicht solide und keine feste Figur/kein Story-Platz darauf.
CHECK = r"""(id) => {
  const m = G.map, out = [];
  const key = (x, y) => x + ',' + y;
  const occ = new Set();
  const npcT = (d) => [Math.floor(d.x / 16), Math.floor((d.y - 2) / 16)];
  for (const d of m.npcDefs) occ.add(key(...npcT(d)));
  const spots = m.spots || {};
  for (const k in spots) occ.add(key(spots[k][0], spots[k][1]));
  const sp = m.spawns[id === 'inseli' ? 'landing' : 'entry'];
  const sx = Math.floor(sp.x / 16), sy = Math.floor((sp.y - 2) / 16);
  const free = (x, y) => m.in(x, y) && !m.isSolid(x, y) && !occ.has(key(x, y));
  if (!free(sx, sy)) out.push('Eingang blockiert ' + key(sx, sy));
  const seen = new Set([key(sx, sy)]), q = [[sx, sy]];
  while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = key(nx, ny); if (!seen.has(k) && free(nx, ny)) { seen.add(k); q.push([nx, ny]); } } }
  const ok = (x, y) => seen.has(key(x, y));
  const near = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => ok(x + dx, y + dy));
  /* über eine Theke hinweg ansprechbar: Figur oben, eine solide Kachel dazwischen, Spieler darunter */
  const talk = (x, y) => near(x, y) || (m.isSolid(x, y + 1) && ok(x, y + 2));
  const trigs = [];
  for (const t of m.trigs) {
    if (t.auto) continue;
    let r = false;
    for (let y = t.y; y < t.y + t.h && !r; y++) for (let x = t.x; x < t.x + t.w && !r; x++) r = t.here ? ok(x, y) || near(x, y) : near(x, y);
    const lab = typeof t.label === 'function' ? t.label() : t.label;
    trigs.push(lab);
    if (!r) out.push('Trigger nicht erreichbar: ' + lab + ' @' + key(t.x, t.y));
  }
  const npcs = [];
  for (const d of m.npcDefs) { const [x, y] = npcT(d); npcs.push(d.id); if (!talk(x, y)) out.push('Figur nicht ansprechbar: ' + d.id + ' @' + key(x, y)); if (m.isSolid(x, y)) out.push('Figur steht auf solider Kachel: ' + d.id); }
  for (const k in spots) { const [x, y] = spots[k]; if (m.isSolid(x, y)) out.push('Platz auf solider Kachel: ' + k + ' @' + key(x, y)); if (!talk(x, y)) out.push('Platz nicht ansprechbar: ' + k + ' @' + key(x, y)); }
  const warps = m.trigs.filter((t) => t.auto && t.warp).map((t) => t.warp.join(':'));
  return { problems: out, w: m.w, h: m.h, trigs, npcs, spots, warps, reach: seen.size };
}"""

# Ganze Karte in eine Leinwand zeichnen (Boden, Objekte, Figuren, Animationen); debug = Trigger und Plätze markieren
RENDER = r"""([debug]) => {
  const m = G.map, W = m.w * 16, H = m.h * 16;
  const [cv, c] = canvas(W, H);
  c.fillStyle = m.bg; c.fillRect(0, 0, W, H);
  c.drawImage(m.gcv, 0, 0);
  const vw = View.w, vh = View.h; View.w = W; View.h = H;
  try {
    if (m.groundAnim) m.groundAnim(c, 0, 0, G.t);
    const list = [];
    for (const o of m.objs) list.push({ y: o.sortY, o });
    for (const a of G.npcs) if (!a.hidden) list.push({ y: a.y, a });
    for (const a of G.peds) list.push({ y: a.y, a });
    for (const b of G.birds) list.push({ y: b.y, b });
    list.sort((p, q) => p.y - q.y);
    for (const it of list) {
      if (it.o) { if (it.o.gone) continue; c.drawImage(it.o.cv, it.o.px, it.o.py); if (it.o.anim) it.o.anim(c, G.t, it.o.px, it.o.py); }
      else if (it.a) drawActor(c, it.a, 0, 0);
      else drawBird(c, it.b, 0, 0);
    }
    if (m.overlay) m.overlay(c, 0, 0, G.t);
    if (m.postOverlay) m.postOverlay(c, 0, 0, G.t);
  } finally { View.w = vw; View.h = vh; }
  if (debug) {
    c.lineWidth = 1;
    for (const t of m.trigs) { c.strokeStyle = t.auto ? 'rgba(0,160,255,0.9)' : 'rgba(255,40,40,0.95)'; c.strokeRect(t.x * 16 + 0.5, t.y * 16 + 0.5, t.w * 16 - 1, t.h * 16 - 1); }
    for (const k in (m.spots || {})) { const [x, y] = m.spots[k]; c.fillStyle = 'rgba(40,255,80,0.55)'; c.fillRect(x * 16 + 4, y * 16 + 4, 8, 8); pxText(c, k, x * 16 + 1, y * 16 + 1, '#0f0'); }
    for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (m.isSolid(x, y)) { c.fillStyle = 'rgba(255,0,0,0.12)'; c.fillRect(x * 16, y * 16, 16, 16); }
  }
  const [big, b] = canvas(W * 3, H * 3); b.imageSmoothingEnabled = false; b.drawImage(cv, 0, 0, W * 3, H * 3);
  return big.toDataURL('image/png');
}"""

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME)
    pg = browser.new_page(viewport={"width": 900, "height": 700})
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    pg.goto(URL)
    time.sleep(0.8)
    pg.evaluate(STUB)
    # Dialoge automatisch weiterklicken (wie im Smoke-Test)
    pg.evaluate("""() => { setInterval(() => { if (UI.dlgOpen) { if (UI._choices && UI._pick) UI._pick(0); else UI.dlgAdvance(); } }, 40); }""")
    pg.evaluate("() => { const S2 = newState(randomLook(rng(9), {}), 'Hoshy'); S2.pid = 'hoshy'; startGame(S2, true); }")
    time.sleep(2.0)
    pg.evaluate("() => { G.S.stage = 'free'; G.S.time = 14 * 60; }")
    rooms = pg.evaluate("() => SURSEE_ROOMS")
    bad = 0
    for rid in rooms:
        spawn = "landing" if rid == "inseli" else "entry"
        n0 = len(errors)
        pg.evaluate(f"() => {{ enterMap({json.dumps(rid)}, {json.dumps(spawn)}); }}")
        time.sleep(0.6)
        res = pg.evaluate(CHECK, rid)
        if SHOT:
            pg.screenshot(path=os.path.join(SHOT, f"{rid}_view.png"))
            for dbg, suf in ((False, "full"), (True, "debug")):
                url = pg.evaluate(RENDER, [dbg])
                pathlib.Path(SHOT, f"{rid}_{suf}.png").write_bytes(base64.b64decode(url.split(",", 1)[1]))
        errs = errors[n0:]
        status = "OK" if not res["problems"] and not errs else "FEHLER"
        if status != "OK":
            bad += 1
        print(f"{rid:14s} {res['w']}x{res['h']} {status}  trigs={res['trigs']} npcs={res['npcs']} spots={list(res['spots'])} warps={res['warps']}")
        for pr in res["problems"] + errs:
            print("   -", pr)
    pg.evaluate("() => { clearSave(); }")
    browser.close()

if errors or bad:
    print(f"{bad} Raum/Räume mit Problemen" + ("\nJS-Fehler:\n" + "\n".join(errors) if errors else ""))
    sys.exit(1)
print("Sursee-Räume: alle erreichbar, keine Fehler.")
