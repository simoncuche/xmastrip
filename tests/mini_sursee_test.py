#!/usr/bin/env python3
"""Test der Sursee-Minispiele (src/js/11_minisursee.js) im Headless-Browser.

Startet ein neues Spiel und ruft jedes Minispiel auf. Ein kleiner Autopilot im Browser drückt zufällig die
passenden Tasten (keydown/keyup, auch gehalten) und tippt auf Canvas und Knöpfe.
  - Schnellmodus (Standard): ein paar Sekunden spielen, dann mit × schliessen, falls nicht fertig.
  - FULL=1: mit Playwright-Uhr im Zeitraffer bis zum natürlichen Ende spielen (höchstens 150 s Spielzeit).
Geprüft wird: keine JavaScript-Fehler, das Promise löst sich auf (Wert oder null), Rückgabeform stimmt.
SHOT_DIR=/pfad speichert pro Spiel Bildschirmfotos. CHROMIUM_PATH=/pfad/zu/chrome nutzt einen vorhandenen Chromium.
"""
import json, os, pathlib, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / "build.py")], check=True, stdout=subprocess.DEVNULL)
URL = (ROOT / "dist" / "index.html").as_uri()
SHOT_DIR = os.environ.get("SHOT_DIR")
FULL = os.environ.get("FULL") == "1"
ONLY = [g for g in os.environ.get("ONLY", "").split(",") if g]
DEFAULT_CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
CHROME = os.environ.get("CHROMIUM_PATH") or (DEFAULT_CHROME if os.path.exists(DEFAULT_CHROME) else None)

ACT = ["Space", "Enter", "KeyE"]
LR = ["ArrowLeft", "ArrowRight", "KeyA", "KeyD"]
ARROWS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
# (Name, Aufruf, Tasten für den Autopiloten, erwartete Schlüssel im Ergebnis)
GAMES = [
    ("fishing", "Mini.fishing('quai')", ACT + ["Space"], ["fish", "cm", "best", "felchen"]),
    ("fishing_boot", "Mini.fishing('boot')", ACT, ["fish", "cm", "best", "felchen"]),
    ("pedalo", "Mini.pedalo()", LR, ["time", "ok"]),
    ("motorboat", "Mini.motorboat()", LR, ["time", "hits", "ok"]),
    ("sup", "Mini.sup()", LR, ["ok", "dist"]),
    ("sprung1", "Mini.sprung(1)", ACT + ["ArrowLeft", "ArrowDown", "ArrowRight"], ["score", "figure", "splash"]),
    ("sprung5", "Mini.sprung(5)", ACT + ["ArrowRight"], ["score", "figure", "splash"]),
    ("velo_zeit", "Mini.velo('zeit')", LR + ["Space"], ["ok", "time"]),
    ("velo_chase", "Mini.velo('chase')", LR + ["Space"], ["ok", "time"]),
    ("schiessbude", "Mini.schiessbude()", ARROWS + ["Space"], ["hits", "prize"]),
    ("lukas", "Mini.lukas()", ACT, ["best", "bell"]),
    ("entenfischen", "Mini.entenfischen()", ARROWS + ["Space"], ["ducks", "points"]),
    ("buechsen", "Mini.buechsen()", ACT, ["cleared", "cans"]),
    ("achterbahn", "Mini.achterbahn()", ["ArrowUp", "Space"], ["score"]),
    ("riesenrad", "Mini.riesenrad()", ARROWS + ["Space"], ["found"]),
    ("gansabhauet", "Mini.gansabhauet()", LR + ["Space"], ["hit", "quality"]),
    ("sackgumpe", "Mini.sackgumpe(['Elin', 'Timo', 'Thierry'])", LR, ["place"]),
    ("chaeszaenne", "Mini.chaeszaenne()", ACT, ["score", "win"]),
    ("stange", "Mini.stange()", LR, ["top", "height"]),
    ("rhythm_konzert", "Mini.rhythm('konzert')", ARROWS, ["pct"]),
    ("rhythm_guugge", "Mini.rhythm('guugge')", ARROWS, ["pct"]),
    ("bootsjagd", "Mini.bootsjagd()", LR, ["ok"]),
    ("detektor", "Mini.detektor()", ARROWS + ["Space"], ["found"]),
]
if ONLY:
    GAMES = [g for g in GAMES if g[0] in ONLY]

AUTOPILOT = """(keys) => {
  clearInterval(window.__ap); window.__held = window.__held || {};
  const fire = (type, code) => window.dispatchEvent(new KeyboardEvent(type, { code, key: code, bubbles: true }));
  window.__ap = setInterval(() => {
    if (!UI.ovOpen) return;
    const r = Math.random();
    if (r < 0.7) {
      const code = keys[Math.floor(Math.random() * keys.length)];
      if (window.__held[code]) return;
      window.__held[code] = 1; fire('keydown', code);
      setTimeout(() => { fire('keyup', code); window.__held[code] = 0; }, 30 + Math.random() * 350);
    } else {
      const cv = document.querySelector('.mini canvas'), btns = [...document.querySelectorAll('.mini .panel-body button')].filter((b) => !b.disabled);
      const el = r < 0.85 && cv ? cv : btns[Math.floor(Math.random() * btns.length)] || cv;
      if (!el) return;
      const b = el.getBoundingClientRect(), x = b.left + Math.random() * b.width, y = b.top + Math.random() * b.height;
      const o = { clientX: x, clientY: y, bubbles: true, pointerId: 1, pointerType: 'touch', isPrimary: true };
      el.dispatchEvent(new PointerEvent('pointerdown', o));
      setTimeout(() => { el.dispatchEvent(new PointerEvent('pointerup', o)); el.dispatchEvent(new MouseEvent('click', o)); }, 40 + Math.random() * 200);
    }
  }, 110);
}"""

errors, results, failures = [], {}, []


def shot(fn):
    """Nur das Spielfeld fotografieren (falls es noch offen ist)."""
    el = pg.query_selector(".mini canvas")
    (el or pg).screenshot(path=os.path.join(SHOT_DIR, fn))

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME)
    pg = browser.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    pg.on("pageerror", lambda e: errors.append(f"[{cur}] pageerror: {e} | {(e.stack or '').splitlines()[1:3]}"))
    pg.on("console", lambda m: errors.append(f"[{cur}] console.{m.type}: {m.text}") if m.type == "error" and "Failed to load resource" not in m.text else None)
    pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    cur = "start"
    pg.goto(URL)
    time.sleep(0.8)
    pg.evaluate("""() => { setInterval(() => { if (UI.dlgOpen) { if (UI._choices && UI._pick) UI._pick(0); else UI.dlgAdvance(); } }, 40); }""")
    pg.evaluate("async () => { const S2 = newState(randomLook(rng(9), {}), 'Hoshy'); S2.pid = 'hoshy'; await startGame(S2, true); }")
    time.sleep(1.0)
    missing = [g[0] for g in GAMES if not pg.evaluate(f"() => typeof Mini.{g[1].split('.')[1].split('(')[0]} === 'function'")]
    if missing:
        failures.append("fehlende Funktionen: " + ", ".join(missing))
    if FULL:
        pg.clock.install()
    for name, call, keys, shape in GAMES:
        if name in missing:
            continue
        cur = name
        pg.evaluate("() => { while (UI.dlgOpen) UI.dlgAdvance(); G.busy = 1; }")
        pg.evaluate(f"() => {{ window.__r = undefined; window.__t0 = performance.now(); {call}.then((v) => {{ window.__r = v === undefined ? 'UNDEFINED' : v; window.__t1 = performance.now(); }}); }}")
        pg.evaluate(AUTOPILOT, keys)
        resolved = False
        if FULL:
            for step in range(150):
                pg.clock.run_for(1000)
                if step == 3 and SHOT_DIR:
                    shot(f"{name}_a.png")
                if step == 12 and SHOT_DIR:
                    shot(f"{name}_b.png")
                if pg.evaluate("() => window.__r !== undefined"):
                    resolved = True
                    break
        else:
            for step in range(14):
                time.sleep(0.5)
                if step == 3 and SHOT_DIR:
                    shot(f"{name}_a.png")
                if step == 11 and SHOT_DIR:
                    shot(f"{name}_b.png")
                if pg.evaluate("() => window.__r !== undefined"):
                    resolved = True
                    break
        pg.evaluate("() => clearInterval(window.__ap)")
        natural = resolved
        if not resolved:
            x = pg.query_selector("#miniX")
            if x:
                x.click()
            if FULL:
                pg.clock.run_for(300)
            else:
                time.sleep(0.3)
            resolved = pg.evaluate("() => window.__r !== undefined")
        r = pg.evaluate("() => window.__r")
        secs = pg.evaluate("() => window.__t1 ? Math.round((window.__t1 - window.__t0) / 100) / 10 : null")
        results[name] = r
        print(f"{name:16s} {'fertig' if natural else 'mit × geschlossen'} {('nach ' + str(secs) + ' s') if natural else ''}: {json.dumps(r, ensure_ascii=False)}")
        if not resolved:
            failures.append(f"{name}: Promise nicht aufgelöst")
        elif r == "UNDEFINED":
            failures.append(f"{name}: mit undefined aufgelöst")
        elif r is not None:
            miss = [k for k in shape if k not in r]
            if miss:
                failures.append(f"{name}: Schlüssel fehlen {miss}")
        if pg.evaluate("() => !!document.querySelector('.mini')") and pg.evaluate("() => UI.ovOpen"):
            pg.evaluate("() => UI.closeOverlay()")
        pg.evaluate("() => { G.busy = 0; }")
    browser.close()

if errors:
    print("FEHLER:\n" + "\n".join(errors))
if failures:
    print("FEHLGESCHLAGEN:\n" + "\n".join(failures))
if errors or failures:
    sys.exit(1)
print(f"Sursee-Minispiele: {len(results)} Spiele ohne Fehler.")
