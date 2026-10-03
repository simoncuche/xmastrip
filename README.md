# Wiehnachtsreisli 2026 nach Innsbruck

*Gleis 4 nach Innsbruck · Abfahrt Freitag, 11. Dezember 2026*

Ein Pixel-Rollenspiel für den Browser: Zwölf Jungs treffen sich am Bahnhof Luzern, fahren mit dem Zug nach Innsbruck,
checken im Hotel Zirbe ein und treffen sich danach in der Gamsbock Bar. Ab dann gehört dir die Stadt.

**Spielen:** online unter https://simoncuche.github.io/xmastrip/ oder `dist/index.html` lokal im Browser öffnen.
Kein Server, keine Installation. Funktioniert am Handy und am Computer.

## Was drin ist

- **Charakter-Editor** mit 27 Merkmalen und 249 Varianten (Kopf, Gesicht, Haare, Bart, Brille, Kleidung …).
  Du wählst, wer du bist: Cuche, Didu, Dous, Coel, Kusi, Römu, Flöru, Hoshy, Ölu, Yännu, Lexx oder Hännsu.
  Die anderen elf fahren mit, jeder mit seiner Rolle.
- **Luzern:** Treffpunkt Torbogen, Kiosk, Kapellbrücke, Gleis 4. Du bist für die Fahrkarten zuständig: Gruppenbillett am Automaten kaufen
  und die ganze Truppe bis 9:10 in den Zug bringen – sonst ist der Ausflug vorbei und es geht von vorne los. Yännu raucht noch eine und verpasst den Zug.
- **Zug:** IR nach Zürich, Railjet nach Innsbruck mit Speisewagen, Fahrkartenkontrolle, Arlbergtunnel und **Jass** (Schieber) am Vierertisch.
- **Innsbruck:** Altstadt mit Goldenem Dachl, Stadtturm, Dom, Hofburg, Leopoldsbrunnen, Annasäule, Triumphpforte, Inn mit bunten Häusern,
  Hofgarten, Viaduktbögen, Hauptbahnhof, Tram, Autos, Tauben, Enten, Strassenmusiker, Fiaker. Tag und Nacht.
- **Hotel Zirbe:** Check-in, Lift, Zimmer 307 mit Bett, Dusche, Minibar, Kleiderschrank.
- **Ausgang:** Gamsbock Bar (Burger, Bier, Darts, Kicker, Jukebox, Armdrücken), Tiroler Stüberl (Nageln, Kachelofen),
  Club Lawine (Türsteher, Tanzen, Raucherhof, Garderobe).
- **Shopping:** Sportgeschäft, Trachtenladen (Lederhose, Tirolerhut …), Souvenirs, Supermarkt, Apotheke, Trafik, Barbier, Konditorei, Würstelstand, Kebap.
- **Ausflüge:** Nordkettenbahn zur Seegrube (1.905 m), Stadtturm (133 Stufen), Fernrohr-Panorama.
- **Taxi:** allein oder gemeinsam mit den Jungs zum Hotel, in die Bar, ins Stüberl oder in den Club. Yännu kommt damit aus Luzern nach.
- **Körper:** Energie, Hunger, Laune, Promille, Übelkeit. Wer trinkt, ohne zu essen und zu schlafen, muss sich übergeben.
  Zu viel → Filmriss. Müde → im Hotelzimmer hinlegen. Am nächsten Morgen vielleicht ein Kater.
- **Interaktiv:** Im Leopoldsbrunnen baden (Vorsicht, Polizei), Steine flitschen am Inn, Tauben und Enten füttern, Fotos sammeln.

## Steuerung

- **Handy:** links auf den Bildschirm tippen und ziehen = gehen (weit ziehen = rennen), **A** = Aktion, oben rechts = Handy.
- **Tastatur:** WASD/Pfeile gehen, Shift rennen, E/Leertaste Aktion, M Handy.

## Entwickeln

```bash
python3 build.py              # src/ → dist/index.html
python3 tests/smoke_test.py   # automatischer Durchlauf (benötigt: pip install playwright && playwright install chromium)
```

Bei jedem Push auf `main` baut der Workflow `.github/workflows/pages.yml` das Spiel und veröffentlicht `dist/` auf GitHub Pages
(Repo-Einstellungen → Pages → Source: *GitHub Actions*).

Die Versionsnummer und die Historie kommen aus `CHANGELOG.md`; bei jeder Änderung dort einen Eintrag ergänzen.

Mehr zur Struktur in `CLAUDE.md`.
