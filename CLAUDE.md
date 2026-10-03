# Gleis 4 nach Innsbruck – Hinweise für Claude Code

Browser-Rollenspiel (Pixel-Art, Top-down) über einen Jungs-Ausflug von Luzern nach Innsbruck.
Läuft komplett im Browser ohne Server, ohne Bibliotheken, ohne Build-Tools ausser Python.

## Bauen und Starten

```bash
python3 build.py          # erzeugt dist/index.html (offline spielbar) und dist/artifact.html
open dist/index.html      # oder einfach per Doppelklick im Browser öffnen
python3 tests/smoke_test.py   # optional: Playwright-Durchlauf der ganzen Story (pip install playwright)
```

`build.py` hängt `src/style.css` und alle `src/js/*.js` **in alphabetischer Reihenfolge** in `src/index.html` ein.
Die Nummern-Präfixe der JS-Dateien bestimmen die Reihenfolge. Top-Level-Code darf nur auf Dinge aus
Dateien mit kleinerer Nummer zugreifen (sonst TDZ-Fehler bei `const`). Funktionen werden erst zur Laufzeit aufgerufen.

## Aufbau (`src/js/`)

| Datei | Inhalt |
|---|---|
| `00_util.js` | Hilfsfunktionen, Pixel-Zeichnen (`R`, `P`, `E`, `line`), Pixelschrift `pxText`, `MAP_BUILDERS` |
| `01_audio.js` | `Snd`: synthetische Soundeffekte und Musik-Loops (WebAudio) |
| `02_look.js` | Charakter-Merkmale `LOOK_OPTS` (27 Merkmale, 247 Varianten), Porträt 64×64, Sprite-Sheets 18×26 |
| `03_editor.js` | Charakter-Editor (`Editor.open({mode})`: `new`, `clothes`, `hair`, `beard`) |
| `04_state.js` | Spielzustand `G`, `newState`, Gegenstände `ITEMS`, Sehenswürdigkeiten `SIGHTS`, Erlebnisse `ACH`, Werte-Logik, Speichern |
| `05_tiles.js` | Bodenkacheln `T`/`TILE_PAINT`, alle Objekte (Gebäude, Bäume, Möbel, Wahrzeichen) als vorgerenderte Sprites |
| `06_maps.js` | Alle Karten als Builder-Funktionen: `luzern`, `luzern_halle`, `zug`, `ibk`, `hotel_lobby`, `hotel_floor`, `hotel_room`, `bar`, `stueberl`, `club`, `seegrube`. Zug-Fahrplan, Tram, Autos |
| `07_engine.js` | `GMap`, Akteure, Kollision, Kamera, Licht/Nacht, Rendern, Interaktion, Zeitfluss |
| `08_ui.js` | HUD, Dialoge (`UI.say`, `UI.ask`), Läden, Overlays, Handy (`Phone`) |
| `09_story.js` | Reisegruppe `CREW` (12 Namen mit Rollen), Läden `SHOPS`, Öffnungszeiten, **gesamte Story & alle Interaktionen** (`Story.*`), Taxi, Ereignisse (Übergeben, Filmriss, Einschlafen) |
| `10_jass.js` | Schieber-Jass mit Regeln (`JassRules`) und KI |
| `11_minigames.js` | Darts, Armdrücken, Tanzen, Nageln, Steine flitschen, Kicker, Panorama |
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
- Wo die Jungs sind, entscheidet `Story.schedule(id)` (Uhrzeit, Story-Stufe, gemeinsame Taxifahrt in `G.S.flags.group`).
- Story-Stufen: `meet → board → ride → arrived → findHotel → checkin → room → bar → free`.
- Spielstand: `localStorage` Schlüssel `gleis4-innsbruck-v3` (Fotos separat unter `…-img`). Bei Änderungen an der
  Struktur von `newState` die Versionsnummer `v` und `SAVE_KEY` erhöhen.
- Texte auf Deutsch mit Schweizer/Tiroler Färbung. Fakten zu Sehenswürdigkeiten sind recherchiert – bei neuen Fakten bitte prüfen.

## Ideen für Erweiterungen

Weitere Bars in den Viaduktbögen, Weisen beim Jass, Multiplikatoren, Watten mit den Einheimischen,
Wetter (Föhn, Regen), zweiter Tag mit Ausflug (Bergisel), Rückfahrt als eigene Szene.
