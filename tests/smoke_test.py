#!/usr/bin/env python3
"""Automatischer Durchlauf der Story im Headless-Browser.

Startet ein neues Spiel, trifft die Jungs, fährt Zug, jasst, checkt ein, geht in die Bar,
kauft ein, spielt Minispiele und löst die Ereignisse aus. Bricht bei JavaScript-Fehlern ab.
Benötigt: pip install playwright && playwright install chromium
(oder CHROMIUM_PATH=/pfad/zu/chrome setzen, um einen vorhandenen Chromium zu nutzen)
"""
import json, pathlib, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / "build.py")], check=True)
URL = (ROOT / "dist" / "index.html").as_uri()
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=__import__('os').environ.get('CHROMIUM_PATH') or None)
    pg = browser.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    pg.goto(URL)
    time.sleep(0.8)
    # Dialoge automatisch weiterklicken (Auswahl: erste Option oder aus der Warteschlange)
    pg.evaluate("""() => { window.__q = []; setInterval(() => { if (UI.dlgOpen) { if (UI._choices && UI._pick) { const q = window.__q.length ? window.__q.shift() : 0; UI._pick(Math.min(q, UI._choices.length - 1)); } else UI.dlgAdvance(); } }, 40); }""")

    def run(js, wait=0.4, q=None):
        if q is not None:
            pg.evaluate(f"window.__q = {json.dumps(q)}")
        pg.evaluate(f"async () => {{ {js} }}")
        time.sleep(wait)

    def state():
        return pg.evaluate("() => ({stage: G.S.stage, map: G.map.id, time: clockStr(), beers: G.S.beers})")

    run("const S2 = newState(randomLook(rng(9), {}), 'Hoshy'); S2.pid = 'hoshy'; await startGame(S2, true);", 1.0)
    run("for (const id of Object.keys(FRIENDS)) { G.busy++; await Story.meetTalk(id); G.busy--; }", 1.0)
    assert state()["stage"] == "board", state()
    # Ohne Billett lässt dich niemand einsteigen
    run("G.busy++; await Story.boardTrain(); G.busy--;", 0.6)
    assert state()["map"] == "luzern", state()
    run("G.busy++; await Story.ticketMachine(); G.busy--;", 0.8, q=[0])
    assert pg.evaluate("() => hasInv('billett') && G.S.money.chf < 100"), "Billett nicht gekauft"
    run("G.busy++; await Story.boardTrain(); G.busy--;", 1.0)
    assert state()["map"] == "zug", state()
    assert pg.evaluate("() => G.S.flags.late === 1 && !G.npcs.some((n) => n.id === latecomer())"), "Nachzügler sitzt im Zug"
    run("G.busy++; await Story.ticketCheck(); G.busy--;", 0.8)
    pg.evaluate("() => { window.__j = setInterval(() => { const a = document.querySelector('.jass-actions .btn'); if (a) { a.click(); return; } const c = document.querySelector('.hand .card.ok'); if (c) c.click(); }, 100); G.busy++; Story.jass().then(() => { G.busy--; window.__jd = 1; }); }")
    for _ in range(90):
        if pg.evaluate("() => window.__jd === 1"):
            break
        time.sleep(1)
    assert pg.evaluate("() => window.__jd === 1"), "Jass nicht beendet"
    run("G.S.flags.trainDep = G.S.time - 217;", 2.5)
    assert state()["stage"] == "arrived", state()
    run("G.busy++; await Story.trainDoor(); G.busy--;", 1.2)
    run("await warpTo('hotel_lobby', 'entry'); G.busy++; await Story.reception(); await Story.roomDoor(307); await Story.unpack(); G.busy--;", 1.0)
    assert state()["stage"] == "bar", state()
    run("await warpTo('bar', 'entry');", 6.0)
    assert state()["stage"] == "free", state()
    assert pg.evaluate("() => G.S.flags.lateArrived === 1 && G.npcs.some((n) => n.id === latecomer())"), "Nachzügler nicht angekommen"
    run("G.busy++; await Story.taxi({ group: true }); G.busy--;", 2.5, q=[2, 0])
    run("G.S.st.nau = 101; checkThresholds();", 3.0)
    run("G.S.st.prom = 2.7; checkThresholds();", 6.0)
    print("Endzustand:", state())
    # Zug verpassen: neues Spiel, Uhr auf 9:10 stellen → Game Over
    run("const S3 = newState(randomLook(rng(5), {}), 'Yännu'); S3.pid = 'yaennu'; await startGame(S3, true); G.S.time = 9 * 60 + 10; Story.minute();", 3.5)
    assert pg.evaluate("() => G.mode === 'over' && !!document.querySelector('#goRestart')"), "Kein Game Over nach verpasstem Zug"
    pg.evaluate("() => { clearSave(); }")
    browser.close()

if errors:
    print("FEHLER:\n" + "\n".join(errors))
    sys.exit(1)
print("Smoke-Test bestanden.")
