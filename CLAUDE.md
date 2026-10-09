# Wiehnachtsreisli 2026 nach Innsbruck (Gleis 4 nach Innsbruck) – Hinweise für Claude Code

Browser-Rollenspiel (Pixel-Art, Top-down) über einen Jungs-Ausflug von Luzern nach Innsbruck.
Läuft komplett im Browser ohne Server, ohne Bibliotheken, ohne Build-Tools ausser Python.

## Bauen und Starten

```bash
python3 build.py          # erzeugt dist/index.html (offline spielbar), dist/artifact.html, Icons, manifest.webmanifest, version.json
open dist/index.html      # oder einfach per Doppelklick im Browser öffnen
python3 tests/smoke_test.py   # optional: Playwright-Durchlauf der ganzen Story (pip install playwright; CHROMIUM_PATH=… für einen vorhandenen Chromium)
```

`build.py` hängt `src/style.css` und alle `src/js/*.js` **in alphabetischer Reihenfolge** in `src/index.html` ein.
Vorher liest es `CHANGELOG.md` und bettet `APP_VERSION`, `APP_VERSION_DATE` und `CHANGELOG` als Konstanten ein
(Startbildschirm „Was ist neu?“ und Handy → Optionen). **Bei jeder Änderung einen neuen Eintrag `## x.y.z – TT.MM.JJJJ` zuoberst anlegen.**
Die Nummern-Präfixe der JS-Dateien bestimmen die Reihenfolge. Top-Level-Code darf nur auf Dinge aus
Dateien mit kleinerer Nummer zugreifen (sonst TDZ-Fehler bei `const`). Funktionen werden erst zur Laufzeit aufgerufen.

## Aufbau (`src/js/`)

| Datei | Inhalt |
|---|---|
| `00_util.js` | Hilfsfunktionen, Pixel-Zeichnen (`R`, `P`, `E`, `line`), Pixelschrift `pxText`, `MAP_BUILDERS`, Grafikstufe `GFX` (2 = HD, 1 = Klassisch, Einstellung `gleis4-grafik`), `upscale` (Scale2x nur für echte Schrägen), `rimLight` (Lichtkante) |
| `01_audio.js` | `Snd`: synthetische Soundeffekte und Musik-Loops (WebAudio) |
| `02_look.js` | Charakter-Merkmale `LOOK_OPTS` (28 Merkmale inkl. `costume`), Kostüme `COSTUMES` + `effLook` (ersetzen Kleidung, Extras via `drawCostumeSprite`/`drawCostumeP`), Porträt 64×64, Sprite-Sheets 18×26 |
| `03_editor.js` | Charakter-Editor (`Editor.open({mode})`: `new`, `clothes`, `hair`, `beard`) |
| `04_track.js` | `Track`: Fortschritt pro Gerät an Firebase Realtime Database per REST (`PATCH devices/<Gerät>.json`, Mehrpfad mit `games/<gameId>/s` und `games/<gameId>/log/<id>`), Drosselung 45 s, Pause nach Fehlern, Opt-out `gleis4-track-off`; Hooks in `saveGame`, `achieve`, `Story.setStage`, `Ending.show`, `UI.gameOver`, `startGame` |
| `04_state.js` | Spielzustand `G`, `newState`, Gegenstände `ITEMS`, Sehenswürdigkeiten `SIGHTS`, Erlebnisse `ACH`, Werte-Logik, Speichern |
| `05_tiles.js` | Bodenkacheln `T`/`TILE_PAINT`, alle Objekte (Gebäude, Bäume, Möbel, Wahrzeichen) als vorgerenderte Sprites |
| `06_maps.js` | Alle Karten als Builder-Funktionen: `luzern`, `luzern_halle`, `zug`, `ibk`, `hotel_lobby`, `hotel_floor`, `hotel_room`, `bar`, `stueberl`, `club`, `rouge` (Tabledance in den Bögen), `casino` (Roulette, Blackjack), `bergisel` (Schanze `objSchanze`, Tribünen, Kassa, Turm, Hofer-Denkmal, Tirol Panorama; Tram ab `ibk`-Spawn `bergisel_stop`), `shop_<id>` (individuelle Laden-Innenräume via `shopInterior(id, { build(m, h) })` mit Helfern `h.counter/keeper/shelf/door`, Rückweg über `flags.shopBack`), `seegrube`. Zug-Fahrplan, Tram, Autos |
| `06_sursee.js` | Kapitel Sursee: Raum-Helfer `sRoom(id, o)` (Innenraum mit Tür zurück, `o.spots` für Story-Figuren), `glitter(m, x, y, cond)`, S-Bahn-Wagen `sbahn` (Halte `SB_STOPS`, `sbState()`, Fensterblick mit See) |
| `06_sursee_map.js` | Karten `sursee` (132×80: Bahnhof, Surseepark, Martigny-Platz, Untertor `objGate`, Oberstadt, Rathaus, St. Georg, Obertor, Theater, Sankturbanhof, Stadthalle, Märtplatz-Chilbi mit `objRiesenrad`/`objAchterbahn`/`objBude`/`objPutschi`, Unterstadt mit Sure-Arm, Diebenturm, Ehret-Park, Beckenhof, Münstervorstadt, Bauernhof, Wohnquartier, Familiengärten) und `sursee_see` (Triechter, Quai, Bootsvermietung, Strandbad, Zellmoos, Seebadi Schenkon, Gamma-Inseli) |
| `06_sursee_rooms.js` | Innenräume in Sursee (alle über `sRoom`), Obergeschoss `surseepark_og` (Rolltreppe aus `surseepark`, Spawn `esc` auf beiden Etagen, Läden `spielwaren`/`buchhandlung`/`glace_og` über `Sur.ogShop`, `Sur.kinderparadies`), Liste `SURSEE_ROOMS`, Aussenkarte `inseli` |
| `07_engine.js` | `GMap`, Akteure, Kollision, Kamera, Licht/Nacht, Rendern, Interaktion, Zeitfluss |
| `08_ui.js` | Vorlesen `Voice` (Web Speech API, `mode` 0/1/2 = aus/Dialoge/Dialoge+Hinweise, `rate`, Stimmlage je Sprecher, Einstellung `gleis4-vorlesen`, Hooks in `UI.say/ask/toast/hideDlg`), HUD, Dialoge (`UI.say`, `UI.ask`), Läden, Overlays, Handy (`Phone`), Schnappschüsse `Snap` (Kamera-Knopf, Galerie unter `SAVE_KEY-snaps`, pro Spiel über `flags.gameId` gefiltert, neues Spiel leert Galerie und Sehenswürdigkeits-Fotos, Teilen über Web Share) |
| `09_sursee.js` | Kapitel 2 „Gans oder gar nicht“: Stufen `SU_STAGES` (an `STAGES` angehängt), Leute `SU_P`, `SIGHTS_SU`, Läden/Lokale (CHF), Objekt `Sur` (Kapitelwechsel `toLuzern`, S-Bahn, Ankunft, Ziele, Notizbuch, Begleiter Elin/Timo, Fall, Fährten, Anklage, Gansabhauet-Finale, Narr, Ereignisse, Freizeit) |
| `09_story.js` | Reisegruppe `CREW` (13 Namen mit Rollen, zuletzt Fibu der Surfer mit `Story.fibuTalk`), Läden `SHOPS`, Öffnungszeiten, **gesamte Story & alle Interaktionen** (`Story.*`), Taxi, Ereignisse (Übergeben, Filmriss, Einschlafen) |
| `10_jass.js` | Schieber-Jass mit Regeln (`JassRules`) und KI; Stammtisch-Gespräche in Sprechblasen (`say`, Listen `TRIP`/`JASS`/`JOKES`/`BEER`, Erinnerungen an Strassburg, Turin, Dublin, Lyon), Biergläser mit Füllstand (`sip`, `refill`, ausgetrunken = `consume('bier')` bzw. `G.S.fprom`) |
| `11_minigames.js` | Wirtshausrauferei (`brawl`, Testhilfe `Mini._brawl`), Darts, Armdrücken, Tanzen, Nageln, Steine flitschen, Kicker, Panorama (`turm`, `seegrube`, `bergisel`), Bierpong (`beerpong`), Roulette (`rouletteSpin`), Blackjack, Skispringen (`skijump`: Anlauf, Absprung-Timing, Haltung, Telemark; Hilfsobjekt `Mini._sj` für Tests) |
| `11_scenes_sursee.js` | Fassaden aller Sursee-Gebäude (`FACADES`, eigene Zeichnung über `paint(c, t, night, off)`, Helfer `fW`), Band auf der Bühne siehe `Sur.spawnBand` (Stadthalle 20–23 Uhr, Soundcheck 18–20, Kulturwerk ab 20 Uhr, Instrumente `drawBandInstr`), Szenen `boat`, `umzug`, `raebeli`, `putschi` |
| `11_minisursee.js` | Sursee-Minispiele auf `Mini` (Fischen, Pedalo, Motorboot, SUP, Sprungturm, Velo, Chilbi-Spiele, Achterbahn, Riesenrad, Gansabhauet, Kinderspiele, Rhythmus, Bootsjagd, Detektor) |
| `11_scenes.js` | `Scene.play(kind, opts)`: animierte 160×96-Pixelszenen im Überblend-Overlay (Brunnenbad, Fiaker, Schlafen, Duschen, WC, Seilbahn, Turm, Taxi, Zug, Tram, Panoramalift, Übergänge bei jedem `warpTo` über `transitionFor(from, to, spawn, opts)`: `door` mit Fassade aus `FACADES`/`facadeFor` (Läden über `SHOP_SIGNS`), `stairs`, `hotellift`, `roomdoor`, `trainexit`/`trainboard` (Aus-/Einsteigen am Perron über `trainDoorScene`, Optionen `station`, `gleis`, `body`, `top`, `band`, `doorCol`; S-Bahn-Farben in `SBAHN_LOOK`), `thrown` (`opts.kind`), Sperrstunde (`kind: 'closing'`); `plain: true` = nur Abblenden, Jessy `jessy` mit `kind` 0–2) |
| `12_main.js` | Titel, Start, Eingabe (Tastatur + Touch-Joystick), Hauptschleife |

## HD-Grafik

- Alles wird weiter in logischen Pixeln gezeichnet (16 pro Kachel). Bei `GFX = 2` werden Kartenboden (`m.gcv`), Objekte (`o.cv`, `o.ecv`) und Figuren (`getSheetHD`) nach dem Zeichnen mit `upscale` verdoppelt; Objekte merken sich die logische Grösse in `o.cw`/`o.ch`, beim Zeichnen immer diese Grösse angeben.
- Bei HD rendern die Ansichten `View.cv/wcv/lcv` in voller Geräteauflösung: `View.k` = Gerätepixel pro Spielpixel (gerade, aus `devicePixelRatio` und Zoom `gleis4-zoom` = `nah`/`normal`/`weit` über `ZOOM_TILES`), gezeichnet wird mit `setTransform(View.k, …)`. Wer aus `View.wcv` ausschneidet, rechnet die Quellkoordinaten mal `View.k`. Ist `View.k` durch 4 teilbar, nimmt `drawActor` die Figuren aus `getSheetHD(look, 4)`. Bei Klassisch ist `View.k = 1`.
- HD-Extras: `groundDetail(m)` (Halme, Kiesel, Holzmaserung), `shadeObject` (Lichtverlauf grosser Objekte), Kontaktschatten in `renderWorld`, `rimLight` für Figuren und kleine Objekte. Szenen (`Scene.play`) zeichnen weiter in 160×96, die Leinwand ist bei HD aber `SCENE_SS`-mal (4) so gross; `sceneCtx` biegt `drawImage` so um, dass normale Sprite-Sheets (`getSheet`, merken sich `_look`) automatisch durch `hdSheetOf(sheet, 4)` ersetzt werden. Minispiele bleiben in ihrer eigenen Auflösung.

## Veröffentlichung

- GitHub Pages (`.github/workflows/pages.yml`) baut bei jedem Push auf `main` und veröffentlicht `dist/` unter https://simoncuche.github.io/xmastrip/.
- `build.py` kennt noch `BUILD_VARIANT` (eigener Speicherstand `SAVE_KEY` + `-<variante>`, Hinweis „Vorschau“ im Titel) und `NO_TRACK=1` (ohne Tracking), falls wieder einmal eine Vorschau gebraucht wird.

## Tracking und Tracker-Seite

- Datenbank-URL in `tracking.json` (`databaseURL`) oder Umgebungsvariable `TRACK_DB` (im Workflow aus der Repo-Variable `vars.TRACK_DB`). Leer = kein Tracking. `build.py` bettet sie als `TRACK_DB` ein.
- `src/tracker.html` wird zu `dist/tracker.html` (mit `00_util.js` und `02_look.js` für die Porträts). URL-Parameter `?db=` überschreibt die Datenbank zum Testen.
- Ereignisse: `Story.announce` zählt jedes erlebte Ereignis in `flags.evSeen` (`Story.evSeen()`, alte Stände aus `flags.ev`), Track sendet `ev`/`evTotal`; `build.py` übernimmt die Titel aus `EV_TITLES` in die Tracker-Seite.
- Ranglisten zählen nur offene Spiele (aktuelles Spiel des Geräts, ohne `finished`/`apoc`/`over`); beendete Spiele stehen separat in `endedList`.
- Firebase-Regeln: `devices` lesbar, `devices/$device` beschreibbar. Fehler beim Senden dürfen das Spiel nie stören.

## Wichtige Konventionen

- Kachelgrösse `TS = 16`. Karten werden programmatisch gebaut (`m.fill`, `m.add(obj)`, `m.trig`, `m.warp`, `m.spawn`).
- Objekte haben einen Fussabdruck (`x, y, w, h` in Kacheln) plus `drawH` Pixel nach oben; sie werden nach Unterkante sortiert.
- Trigger: `m.trig(x, y, w, h, { label, act, here, cond })` – `here: true` heisst „auslösen, wenn der Spieler darauf steht“,
  sonst „wenn er darauf schaut“. `m.warp(...)` ist ein automatischer Trigger mit optionalem `guard` (z. B. Türsteher).
- Alle Interaktionen sind `async` und laufen innerhalb von `G.busy` (Welt pausiert). Dialoge immer über `Story.say/ask`.
- Werte: `G.S.st` = `energy`, `food`, `mood` (0–100), `prom` (Promille), `nau` (Übelkeit 0–140), `wet`, `smell`, `hang` (Kater).
  `consume(itemId)` wendet Essen/Trinken an, `tickStats` läuft pro Spielminute.
- Freunde: `FRIENDS` wird aus `CREW` gebaut (ohne den Spieler). Funktionale Rollen per `who('jass' | 'arm' | 'party' …)`
  mit Fallbacks in `FN_FALLBACK`, damit jede Rolle besetzt ist, egal wen man spielt.
- Wo die Jungs sind, entscheidet `Story.schedule(id)` (Uhrzeit, Story-Stufe, gemeinsame Taxifahrt in `G.S.flags.group`, Krankenlager `flags.sick`); `Story.whereIs(id)` liefert Text und Kartenpunkt dazu.
- Zufallsereignisse: `Story.EVENTS` (Bedingung, Maximum), `Story.maybeEvent()` pro Spielminute in `ibk` ab Stufe `free`, Handler `Story.ev_<id>`; Tagesplan `flags.evPlan[tag]` (Array mit zwei Startstunden: tagsüber und abends; `null` = keine), Zähler `flags.evN[tag]`, Runden: alle Ereignisse reihum, neue Runde mischt `flags.evOrder` neu (`flags.evCycle`; `max` wird nicht mehr begrenzt), mindestens 150 Spielminuten Abstand (`flags.lastEv`), Reihenfolge pro Spiel gemischt in `flags.evOrder`, Godzilla (`monster`) zufällig wie die anderen in `EVENTS` (`ev_monster`: verfolgt den Spieler, Berührung oder Atomstrahl = erwischt, Aufladen der Rückenplatten, `god`-Zustand, `dbg()`); Live-Ereignisse in der Welt über `G.live = { update, draw, lights, onLeave, runWhileBusy }` (Engine-Hook, wird bei Kartenwechsel gelöscht); Hilfen `tempActor`, `walk`, `dropActor`; Polizeiwache über `flags.jail`.
- Flöru und Hännsu sind 40: `Story.line40(id)` liefert Sprüche dazu (eigene, über die beiden, oder an den Spieler, wenn er einer von ihnen ist), eingestreut in `Story.line`; beim Jassen zusätzliche Paare in `TRIP`.
- Zug: Schöttli-Rundi von Kusi (`Story.schoettliStart/schoettliFollow/schoettli`, ab Fahrminute 80 nach der Billettkontrolle, einmalig über `flags.schoettli`, Szene `schoettli` mit `kind` 0–2, `declined`, `round`, `meK` wenn der Spieler Kusi ist; Gegenstand `schoettli`).
- Yännu-Story (`playerIsLate()` = Spieler ist `yaennu`, dann ist `latecomer()` der Spieler selbst): Start mit `LATE_CHF`, Torbogen nur Partylöwe + Kassier (`meetNeed`), Kassier kauft das Billett, `Story.luSmoke` (Aschenbecher vor dem Bahnhof, Szene `smokeout`) bzw. 9:10 ohne Rauchen → `Story.trainGone` (`flags.missed`, Zug `irTrain.gone`), `Story.taxiTicketLU` (Taxizentrale in `luzern_halle`, Gegenstand `taxiticket`, `TAXI_LU_PRICE`), `Story.taxiLU` (Taxistand auf dem Bahnhofplatz, Szene `taxi` mit `highway`/`snow`) → `findHotel` in `ibk` (`flags.taxiLU`, `flags.lateArrived`); eigene Ziele über `Story.lateSteps()`.
- Flitzer: `Story.ev_flitzer` (Didu und Römu, Ersatz über `Story.flitzerIds()` wenn man einen der beiden spielt, ihre angezogenen Figuren werden solange ausgeblendet, Look-Flag `naked` mit Zensurbalken in `drawCostumeSprite`, `lookKey` berücksichtigt es).
- Rouge: Hakan Yakin und Xherdan Shaqiri (`npcDefs` `yakin`/`shaqiri`), Gespräch `Story.fussballTisch` mit Themen und Quiz; Fakten (EM 2008, CL 2013/2019, Frauen-EM 2025, FCB-Double 2025, Yakin beim FCL 2009–2011) sind geprüft.
- Pegel der Kollegen: `G.S.fprom[id]`, steigt über `Story.friendDrink`, Übergeben ab 2,6 ‰ (`Story.friendVomit`).
- Spielende: `Story.goHome()` (Heimreise am Hauptbahnhof) zeigt die Innsbruck-Bilanz `Ending.show({ cont: true })` und führt mit `Sur.toLuzern()` nach Luzern (Gleis 4). Dort beendet erst `Sur.leaveLuzern()` (Ausgang der Halle) das Spiel mit `G.S.finished` und `Ending.show({ final: true })`; der Titel bietet dann nur „Neues Spiel“. Die Apokalypse führt ebenfalls nach Luzern.
- Kapitel Sursee: `G.S.chapter` ('heim' in Luzern, 'sursee' ab Ankunft), Zustand in `G.S.su` (`Sur.st()`). Sobald `Sur.active()`, leiten `Story.objective/steps/objectiveTag/mapPois/whereIs/populate/minute/onEnter/shakeEvent` an `Sur` weiter. Stufen: `heim → sbahn → s_ankunft → s_tatort → s_faehrten → s_strahl → s_probe → s_boot → s_gans → s_frei` (`suAt(s)`). Täter ist Ruedi Pfister (Pechvogel), Beweise in `SU_EVID` (`p: 1` zeigt auf ihn). Minispiele immer über `Sur.mini(name, …)` (Fallback, falls eines fehlt). Mietvelo: `G.player.velo` (×1,8, Zeichnung `drawVelo`; Ab-/Aufsteigen mit A über `Sur.veloAction()`/`veloToggle()`, `su.veloOff`; `findInteraction` prüft Begleiter erst nach allen Triggern), Begleiter mit `follower`, Zusatzzeichnung über `actor.extra(c, x, y, a)` (Larven `drawLarve`, Narrenkappe). Kinderfiguren: Look-Feld `kid` (1 Schulkind, 2 Kleinkind) staucht den Körper (`kidFrame`). Fotos in Sursee über `Sur.photo` (eigene Reihe `SIGHTS_SU`). Ereignisse `guuggen`, `gans`, `nebel`, `drohne`, `brand` (Titel in `Story.EV_TITLES`). Poller beim Untertor `Sur.ev_poller` (Postauto oder Auto, `su.pollerDay`/`pollerN`, Zeichnung in der Karte über `Sur._poller.up`). Elin und Timo sagen nur zu Cuche „Papi“: `sayP/kidSay/askP` ersetzen bei ihnen „Papi“ über `kidText` durch den Spielernamen. Familie: Sprüche `Sur.kidFact(k)` (Elin, Timo, Thierry, Louve), `Sur.rechnen()` (drei Aufgaben bis 20), `Sur.kita()` (Kita Villa Luna beim Märtplatz, Lejan `SU_P.lejan` werktags 8–17), `Sur.gitarre()`, `Sur.kaffee()` (Isa, `su.isaKaffee`), `Sur.bauernQuiz()`/`Sur.scheune()`; Isa ist werktags im Homeoffice (`isaWhere`), Kaffeepausen 10 und 15 Uhr im Stadtcafé. Feuerwehreinsatz `Sur.ev_brand` (Haus neben dem La Fuga, Notruf 118, Löschfahrzeug, Strahlrohr per A, Drehleiter, Frau Wüest; einmal sicher ab `s_strahl` über `su.brandDone`, danach im Zufallspool; Testhilfe `Sur._brand`). `G.live.onAction` darf `false` zurückgeben, dann läuft die normale Interaktion weiter.
- Story-Stufen: `meet → board → ride → arrived → findHotel → checkin → room → bar → free`.
- Abfahrt Luzern: Der Spieler kauft das Gruppenbillett (`Story.ticketMachine`, Gegenstand `billett`, Preis `TICKET_PRICE`),
  Abfahrt ist `DEP_TIME` (9:10). `Story.minute` zählt herunter; ist die Gruppe dann nicht im Zug → `Story.missedTrain` → `UI.gameOver`
  (Spielstand wird gelöscht). In Luzern läuft die Uhr mit `timeScale = 0.2`. Der Raucher (`latecomer()` = `who('smoke')`, meist Yännu)
  verpasst den Zug planmässig (`flags.late`), fehlt bis `flags.lateArrived` (`Story.away`) und kommt in der Bar per Taxi nach (`Story.lateArrival`).
  Sprecher-Rollen über `voice(fn)` wählen, damit nie der Nachzügler selbst spricht.
- Spielstand: `localStorage` Schlüssel `gleis4-innsbruck-v4` (Fotos separat unter `…-img`). Bei Änderungen an der
  Struktur von `newState` die Versionsnummer `v` und `SAVE_KEY` erhöhen.
- Datum: Tag 0 ist Freitag, 11. Dezember 2026 (`START_DATE`, `DAYS`, `dateStr`, `dateLong`). Öffnungszeiten prüfen per `dayStr()`.
- Bergisel: `Story.bergiselTram/bergiselBack` (Tram-Szene), `bergiselTicket` (Tagesticket `flags.bergiselTicket`), `bergiselTower` (Lift-Szene, Panorama, `SHOPS.turmcafe`), `skijump` (Trainer, Bedingungen, Auswertung, Rekord `G.S.rec.jump`).
- Apokalypse: `Story.ev_apokalypse` (Tag 5 bei Dunkelheit ab 18:30 bis zum Morgen, `Story.apocDue()` mit `APOC_DAY`/`APOC_DUSK`, in `maybeEvent`, letztes Element von `SHAKE_ORDER`, 7 s Schütteln). Live-Ereignis mit `drawGround` (Lava-Risse, Pfützen, Trümmer unter den Figuren), `onAction` (Sprung), `noTriggers`, `hudText`; Gebäude über `o.apo`/`o.sink`/`o.gone`/`o.dark`, Figuren springen mit `a.z`/`jumpT`, Sturz mit `sinkY`; `flags.adrenalin` schaltet Kollaps/Warnungen ab; Ende über Szenen `apocend`/`apocfail`, `Ending.show({ apoc: true })`, `UI.gameOver(title, text, note)`.
- Easter Egg: `Shake` (12_main.js) erkennt 3 s Schütteln (vorgemerkt bis zum Loslassen, 7 s = Apokalypse) über `devicemotion` (`Shake.feed(m, now)` testbar), ruft `Story.shakeEvent()` (feste Reihenfolge `Story.SHAKE_ORDER`, Zeiger `flags.shakeIdx`, Godzilla am Schluss); iOS-Erlaubnis über `Shake.ask()` (Optionen, Darts-Neigung).
- Stüberl: `Story.ferdl` → `Story.brawl` (Minispiel, danach Hausverbot `flags.stueberlBan`, geprüft in `openGuard`).
- Ereignisse starten über `Story.announce(id)` (Sequenz mit `#cine`, Titel in `Story.EV_TITLES`), danach `Story.ev_<id>`.
- Kleider: `SHOPS.mode/boutique` (Sets via `wear`), `SHOPS.kostuem` (`wear: { costume: n }`, Freischaltung `unlock`, `LOCKED.costume`); Querformat-Layout per `@media (orientation: landscape) and (max-height: 600px)`.
- Luzern: Bäckerei-Stand in `luzern_halle` aus `objBakeryShelf`/`objBakeryCounter`/`objBrezelStand` (Hilfe `drawLoaf`), Bäckerin `baeckerin`, Laden `SHOPS.baeckerei_lu`; Abfahrtstafel und Uhr hängen über den Billettautomaten.
- Barbier: `SHOPS.barbier` hat `special: 'hair' | 'beard'` (Editor) und `'glatze' | 'rasur'` (setzt `look.hair`/`look.beard` auf 0); Animation `Story.barberAnim(kind, shave)` auf dem nächsten der drei Sessel.
- Läden: `mode: 'take'` legt alles ins Inventar, `mode: 'eat'` konsumiert sofort oder legt per 🎒-Knopf ins Inventar (`Story.buy(def, item, cur, { take })`).
  Alles in der Tasche (Inventar) mit Typ `drink`/`food`/`med` ist jederzeit im Handy konsumierbar.
- Gebrauchszähler: `takeUse(id)` verbraucht einen Gebrauch (Zigaretten, Kondome). NPC-Definitionen mit `cond` (z. B. Jessy nachts) werden in `ibk` stündlich ein-/ausgeblendet.
- Texte auf Deutsch mit Schweizer/Tiroler Färbung. Fakten zu Sehenswürdigkeiten sind recherchiert – bei neuen Fakten bitte prüfen.

## Ideen für Erweiterungen

Weitere Bars in den Viaduktbögen, Weisen beim Jass, Multiplikatoren, Watten mit den Einheimischen,
Wetter (Föhn, Regen), Fasnacht in Sursee (Umzug am Güdisdienstag, Monsterkonzert), Sempach mit der Vogelwarte.
