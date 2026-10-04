#!/usr/bin/env python3
"""Durchlauf des Kapitels Sursee im Headless-Browser.

Heimreise aus Innsbruck → Luzern → S-Bahn → Sursee → Tatort → drei Fährten → Schatzkiste → Guuggen-Probe →
Verfolgung → Bootsjagd → Gamma-Inseli → Anklage → Gansabhauet → freies Spiel. Dazu alle Innenräume, die
Ereignisse in Sursee und das Spielende in Luzern. Bricht bei JavaScript-Fehlern ab.
Benötigt: pip install playwright (CHROMIUM_PATH=/pfad/zu/chrome für einen vorhandenen Chromium)
"""
import json, os, pathlib, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / "build.py")], check=True, stdout=subprocess.DEVNULL)
URL = (ROOT / "dist" / "index.html").as_uri()
SHOT = os.environ.get("SHOT_DIR")
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH") or None)
    pg = browser.new_page(viewport={"width": 900, "height": 640})
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    pg.route("**/*firebasedatabase.app/**", lambda r: r.abort())
    pg.goto(URL)
    time.sleep(0.8)
    # Dialoge und Ende-Knöpfe automatisch weiterklicken; Minispiele mit × schliessen, falls eines offen bleibt
    pg.evaluate("""() => { window.__q = []; setInterval(() => {
      const c = document.querySelector('#endCont'); if (c) c.click();
      if (UI.dlgOpen) { if (UI._choices && UI._pick) { const q = window.__q.length ? window.__q.shift() : 0; UI._pick(Math.min(q, UI._choices.length - 1)); } else UI.dlgAdvance(); }
    }, 30); setInterval(() => { const x = document.querySelector('#miniX'); if (x) x.click(); }, 1500); }""")

    def run(js, wait=0.4, q=None):
        if os.environ.get("VERBOSE"):
            print("·", js[:70], flush=True)
        if q is not None:
            pg.evaluate(f"window.__q = {json.dumps(q)}")
        pg.evaluate(f"async () => {{ G.busy++; try {{ {js} }} finally {{ G.busy--; }} }}")
        time.sleep(wait)

    def st():
        return pg.evaluate("() => ({ stage: G.S.stage, map: G.map.id, time: clockStr(), chap: G.S.chapter || '', busy: G.busy })")

    def shot(name):
        if SHOT:
            pg.screenshot(path=f"{SHOT}/{name}.png")

    def expect(cond, msg):
        if not pg.evaluate(f"() => !!({cond})"):
            raise SystemExit(f"FEHLER: {msg} · {st()} · {errors[:3]}")

    pg.evaluate("async () => { const S2 = newState(randomLook(rng(9), {}), 'Hoshy'); S2.pid = 'hoshy'; await startGame(S2, true); G.S.stage = 'free'; G.S.time = 2 * 1440 + 13 * 60; enterMap('ibk', 'hbf'); }")
    time.sleep(0.6)
    # Heimreise → Luzern, Gleis 2
    run("await Story.goHome();", 1.0)
    expect("G.S.stage === 'heim' && G.map.id === 'luzern_halle' && !G.S.finished", "Nicht in Luzern angekommen")
    run("await Sur.boardSBahn();", 1.0)
    expect("G.map.id === 'sbahn'", "Nicht in der S-Bahn")
    run("G.S.time = G.S.flags.sbDep + 12;", 0.6)
    shot("sbahn")
    run("await Sur.sbahnDoor();", 0.5)
    expect("G.map.id === 'sbahn'", "Vor Sursee ausgestiegen")
    run("await Sur.talk('alter');", 0.4)
    run("G.S.time = G.S.flags.sbDep + 26; await Sur.sbahnDoor();", 1.2)
    expect("G.S.stage === 's_ankunft' && G.map.id === 'sursee' && G.npcs.filter((n) => n.follower).length === 2", "Ankunft in Sursee fehlgeschlagen")
    shot("ankunft")
    # Tatort
    run("await warpTo('zunftstube', 'entry');", 2.0)
    expect("G.S.stage === 's_tatort'", "Tatort nicht gestartet")
    expect("G.npcs.some((n) => n.id === 'su_heinivater')", "Heinivater fehlt in der Zunftstube")
    shot("zunftstube")
    run("await Sur.clue('feder'); await Sur.clue('jeton'); await Sur.clue('quittung');", 0.6)
    expect("G.S.stage === 's_faehrten' && G.S.su.notes.length >= 7", "Spuren nicht vollständig")
    # Fährte Chilbi
    run("G.S.time = dayOf(G.S.time) * 1440 + 14 * 60; await warpTo('sursee', 'chilbi'); await Sur.talkRoli();", 1.2)
    expect("G.S.su.f.roli === 1", "Roli hat nichts verraten")
    run("G.S.time = dayOf(G.S.time) * 1440 + 18 * 60; await Sur.riesenrad();", 0.8, q=[0])
    expect("G.S.su.f.rad === 1", "Kein Licht vom Riesenrad")
    # Fährte See
    run("await warpTo('sursee_see', 'quai'); G.S.time = dayOf(G.S.time + 1440) * 1440 + 10 * 60; await Sur.bootsverleih();", 1.2, q=[0])
    expect("G.S.su.f.log === 1", "Logbuch nicht gelesen")
    run("await Sur.talkFischer(); await Sur.fish('quai'); await Sur.talkFischer();", 1.0)
    expect("G.S.su.f.fischer === 1", "Fischer hat nichts erzählt")
    # Fährte Altstadt
    run("G.S.time = dayOf(G.S.time) * 1440 + 13 * 60; await warpTo('sursee', 'untertor'); await warpTo('sankturbanhof', 'entry'); await Sur.talkMuseum(); await Sur.look('besucherbuch');", 1.5)
    run("await warpTo('theater', 'entry'); await Sur.talk('bea'); await Sur.look('fundus');", 1.5)
    expect("G.S.stage === 's_strahl'", "Fährten nicht abgeschlossen")
    # Schatzkiste und Isa
    run("await warpTo('sursee', 'ehretpark'); await Sur.cousinsTalk('louve');", 1.2)
    expect("hasInv('strahl')", "Kein goldener Strahl")
    run("await Sur.talkIsa();", 0.6)
    expect("G.S.stage === 's_probe'", "Isa hat den Strahl nicht gesehen")
    # Guuggen-Probe, Verfolgung, Bootsjagd, Inseli, Anklage
    run("G.S.time = dayOf(G.S.time) * 1440 + 17 * 60; enterMap('sursee', 'untertor');", 0.6)
    expect("G.npcs.some((n) => n.id === 'su_sousa')", "Keine Guuggen-Probe")
    shot("probe")
    run("await Sur.guuggenTalk(); await Sur.sousaphonist();", 3.5)
    expect("G.S.stage === 's_boot'", "Verfolgung nicht abgeschlossen")
    for _ in range(20):
        if pg.evaluate("() => G.map.id === 'inseli' && G.busy === 0"):
            break
        time.sleep(0.5)
    expect("G.map.id === 'inseli'", "Nicht auf dem Gamma-Inseli")
    shot("inseli")
    run("for (let k = 0; k < 4 && !G.S.su.maskFound; k++) await Sur.search(k);", 3.0)
    for _ in range(20):
        if pg.evaluate("() => G.S.stage === 's_gans' && G.busy === 0"):
            break
        time.sleep(0.5)
    expect("G.S.stage === 's_gans' && G.map.id === 'sursee_see' && G.S.ach.su_maske", "Maske nicht gefunden oder keine Anklage")
    # Finale
    run("G.S.time = dayOf(G.S.time + 1440) * 1440 + 10 * 60 + 30; enterMap('sursee', 'diebenturm_out');", 0.5)
    expect("G.npcs.some((n) => n.id === 'su_heinivater')", "Heinivater fehlt beim Diebenturm")
    run("await Sur.talkHeinivater();", 4.0, q=[3, 0, 0, 0, 0, 0, 0, 0, 0])
    expect("G.S.stage === 's_frei' && G.S.ach.su_zunft", "Gansabhauet nicht abgeschlossen")
    shot("frei")
    # Alle Innenräume betreten
    rooms = pg.evaluate("() => (typeof SURSEE_ROOMS !== 'undefined' ? SURSEE_ROOMS : [])")
    for r in rooms:
        run(f"enterMap('{r}', '{'landing' if r == 'inseli' else 'entry'}');", 0.15)
    expect("G.map.id === %s" % json.dumps(rooms[-1] if rooms else 'sursee'), "Innenräume nicht geladen")
    # Ereignisse in Sursee
    run("enterMap('sursee', 'rathausplatz');", 0.3)
    for ev in ["guuggen", "gans", "nebel", "drohne"]:
        run(f"await Story.announce('{ev}'); await Sur.ev_{ev}();", 1.5)
        pg.evaluate("() => { G.live = null; }")
    # Feuerwehreinsatz: Notruf, Löschfahrzeug, Strahlrohr, Drehleiter, Rettung
    run("G.S.time = dayOf(G.S.time) * 1440 + 15 * 60; enterMap('sursee', 'rathausplatz'); await Story.announce('brand'); await Sur.ev_brand();", 0.5, q=[0, 0])
    expect("G.live && Sur._brand && Sur._brand.truck.go === 3", "Feuerwehreinsatz nicht gestartet")
    pg.evaluate("() => { const B = Sur._brand; B.t = 4; B.truck.i = 4; B.truck.x = 58.5 * 16; B.truck.y = 51.3 * 16; G.player.x = 1088; G.player.y = 820; }")
    for _ in range(20):
        if pg.evaluate("() => Sur._brand.phase === 'loeschen' && G.busy === 0"):
            break
        time.sleep(0.3)
    expect("Sur._brand.phase === 'loeschen'", "Löschfahrzeug nicht angekommen")
    for _ in range(14):
        pg.evaluate("() => { if (G.live && G.live.onAction) { const B = Sur._brand; G.player.x = 1064 + (B.helped % 4) * 16; G.live.onAction(); } }")
        time.sleep(0.15)
    for _ in range(40):
        if pg.evaluate("() => Sur._brand.phase === 'done' && G.busy === 0"):
            break
        time.sleep(0.3)
    expect("Sur._brand.phase === 'done' && G.S.ach.su_feuer && G.S.su.brandDone", "Rettung nicht abgeschlossen")
    shot("brand")
    # Handy mit Notizbuch, Karte und Status
    for tab in ["fall", "karte", "status", "fotos", "ziele"]:
        pg.evaluate(f"() => {{ Phone.open('{tab}'); }}")
        time.sleep(0.2)
        pg.evaluate("() => UI.closeOverlay()")
    # Spielende in Luzern: neues Spiel, Heimreise, durch die Halle heimgehen
    pg.evaluate("() => { clearSave(); }")
    pg.goto(URL)
    time.sleep(0.8)
    pg.evaluate("""() => { window.__q = []; setInterval(() => {
      const c = document.querySelector('#endCont'); if (c) c.click();
      if (UI.dlgOpen) { if (UI._choices && UI._pick) { const q = window.__q.length ? window.__q.shift() : 0; UI._pick(Math.min(q, UI._choices.length - 1)); } else UI.dlgAdvance(); }
    }, 30); }""")
    pg.evaluate("async () => { const S3 = newState(randomLook(rng(4), {}), 'Cuche'); S3.pid = 'cuche'; await startGame(S3, true); G.S.stage = 'free'; G.S.time = 1440 + 15 * 60; enterMap('ibk', 'hbf'); }")
    time.sleep(0.6)
    run("await Story.goHome();", 1.0)
    pg.evaluate("() => { window.__q = [0]; Sur.leaveLuzern(); }")
    time.sleep(1.0)
    expect("G.S.finished === 1 && G.mode === 'over'", "Spielende in Luzern fehlgeschlagen")
    pg.evaluate("() => { clearSave(); }")
    browser.close()

if errors:
    print("FEHLER:\n" + "\n".join(errors))
    sys.exit(1)
print("Sursee-Test bestanden.")
