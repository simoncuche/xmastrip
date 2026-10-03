# Wiehnachtsreisli 2026 nach Innsbruck (Gleis 4 nach Innsbruck) – Hinweise für Claude Code

Browser-Rollenspiel (Pixel-Art, Top-down) über einen Jungs-Ausflug von Luzern nach Innsbruck.
Läuft komplett im Browser ohne Server, ohne Bibliotheken, ohne Build-Tools ausser Python.

## Bauen und Starten

```bash
python3 build.py          # erzeugt dist/index.html (offline spielbar) und dist/artifact.html
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
| `00_util.js` | Hilfsfunktionen, Pixel-Zeichnen (`R`, `P`, `E`, `line`), Pixelschrift `pxText`, `MAP_BUILDERS` |
| `01_audio.js` | `Snd`: synthetische Soundeffekte und Musik-Loops (WebAudio) |
| `02_look.js` | Charakter-Merkmale `LOOK_OPTS` (27 Merkmale, 250 Varianten), Porträt 64×64, Sprite-Sheets 18×26 |
| `03_editor.js` | Charakter-Editor (`Editor.open({mode})`: `new`, `clothes`, `hair`, `beard`) |
| `04_state.js` | Spielzustand `G`, `newState`, Gegenstände `ITEMS`, Sehenswürdigkeiten `SIGHTS`, Erlebnisse `ACH`, Werte-Logik, Speichern |
| `05_tiles.js` | Bodenkacheln `T`/`TILE_PAINT`, alle Objekte (Gebäude, Bäume, Möbel, Wahrzeichen) als vorgerenderte Sprites |
| `06_maps.js` | Alle Karten als Builder-Funktionen: `luzern`, `luzern_halle`, `zug`, `ibk`, `hotel_lobby`, `hotel_floor`, `hotel_room`, `bar`, `stueberl`, `club`, `rouge` (Tabledance in den Bögen), `seegrube`. Zug-Fahrplan, Tram, Autos |
| `07_engine.js` | `GMap`, Akteure, Kollision, Kamera, Licht/Nacht, Rendern, Interaktion, Zeitfluss |
| `08_ui.js` | HUD, Dialoge (`UI.say`, `UI.ask`), Läden, Overlays, Handy (`Phone`) |
| `09_story.js` | Reisegruppe `CREW` (12 Namen mit Rollen), Läden `SHOPS`, Öffnungszeiten, **gesamte Story & alle Interaktionen** (`Story.*`), Taxi, Ereignisse (Übergeben, Filmriss, Einschlafen) |
| `10_jass.js` | Schieber-Jass mit Regeln (`JassRules`) und KI |
| `11_minigames.js` | Darts, Armdrücken, Tanzen, Nageln, Steine flitschen, Kicker, Panorama |
| `11_scenes.js` | `Scene.play(kind, opts)`: animierte 160×96-Pixelszenen im Überblend-Overlay (Brunnenbad, Fiaker, Schlafen, Duschen, WC, Seilbahn, Turm, Taxi, Zug) |
| `12_main.js` | Titel, Start, Eingabe (Tastatur + Touch-Joystick), Hauptschleife |

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
- Zufallsereignisse: `Story.EVENTS` (Bedingung, Maximum), `Story.maybeEvent()` pro Spielminute in `ibk` ab Stufe `free`, Handler `Story.ev_<id>`; Hilfen `tempActor`, `walk`, `dropActor`; Polizeiwache über `flags.jail`.
- Pegel der Kollegen: `G.S.fprom[id]`, steigt über `Story.friendDrink`, Übergeben ab 2,6 ‰ (`Story.friendVomit`).
- Story-Stufen: `meet → board → ride → arrived → findHotel → checkin → room → bar → free`.
- Abfahrt Luzern: Der Spieler kauft das Gruppenbillett (`Story.ticketMachine`, Gegenstand `billett`, Preis `TICKET_PRICE`),
  Abfahrt ist `DEP_TIME` (9:10). `Story.minute` zählt herunter; ist die Gruppe dann nicht im Zug → `Story.missedTrain` → `UI.gameOver`
  (Spielstand wird gelöscht). In Luzern läuft die Uhr mit `timeScale = 0.2`. Der Raucher (`latecomer()` = `who('smoke')`, meist Yännu)
  verpasst den Zug planmässig (`flags.late`), fehlt bis `flags.lateArrived` (`Story.away`) und kommt in der Bar per Taxi nach (`Story.lateArrival`).
  Sprecher-Rollen über `voice(fn)` wählen, damit nie der Nachzügler selbst spricht.
- Spielstand: `localStorage` Schlüssel `gleis4-innsbruck-v4` (Fotos separat unter `…-img`). Bei Änderungen an der
  Struktur von `newState` die Versionsnummer `v` und `SAVE_KEY` erhöhen.
- Datum: Tag 0 ist Freitag, 11. Dezember 2026 (`START_DATE`, `DAYS`, `dateStr`, `dateLong`). Öffnungszeiten prüfen per `dayStr()`.
- Läden: `mode: 'take'` legt alles ins Inventar, `mode: 'eat'` konsumiert sofort oder legt per 🎒-Knopf ins Inventar (`Story.buy(def, item, cur, { take })`).
  Alles in der Tasche (Inventar) mit Typ `drink`/`food`/`med` ist jederzeit im Handy konsumierbar.
- Texte auf Deutsch mit Schweizer/Tiroler Färbung. Fakten zu Sehenswürdigkeiten sind recherchiert – bei neuen Fakten bitte prüfen.

## Ideen für Erweiterungen

Weitere Bars in den Viaduktbögen, Weisen beim Jass, Multiplikatoren, Watten mit den Einheimischen,
Wetter (Föhn, Regen), zweiter Tag mit Ausflug (Bergisel), Rückfahrt als eigene Szene.
