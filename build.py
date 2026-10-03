#!/usr/bin/env python3
"""Baut das Spiel aus src/ zu einer einzigen HTML-Datei.

dist/index.html     – vollständiges Dokument, läuft offline per Doppelklick
dist/artifact.html  – derselbe Inhalt ohne <html>/<head>/<body> (für claude.ai-Artifacts)
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)

def read_changelog():
    """CHANGELOG.md → Liste von {v, date, items}; die erste Version ist die aktuelle."""
    log, cur = [], None
    for line in (ROOT / "CHANGELOG.md").read_text(encoding="utf-8").splitlines():
        m = re.match(r"^##\s+(\d+\.\d+\.\d+)\s*[–-]\s*(.+?)\s*$", line)
        if m:
            cur = {"v": m.group(1), "date": m.group(2), "items": []}
            log.append(cur)
        elif cur and line.startswith("- "):
            cur["items"].append(line[2:].strip())
    if not log:
        raise SystemExit("CHANGELOG.md enthält keine Version (## x.y.z – Datum)")
    return log

changelog = read_changelog()
version_js = (f"const APP_VERSION = {json.dumps(changelog[0]['v'])};\n"
              f"const APP_VERSION_DATE = {json.dumps(changelog[0]['date'])};\n"
              f"const CHANGELOG = {json.dumps(changelog, ensure_ascii=False)};\n")
css = (SRC / "style.css").read_text(encoding="utf-8")
js_files = sorted((SRC / "js").glob("*.js"))
js = "/* ---- Version (aus CHANGELOG.md) ---- */\n" + version_js + "\n".join(f"/* ---- {f.name} ---- */\n" + f.read_text(encoding="utf-8") for f in js_files)
tpl = (SRC / "index.html").read_text(encoding="utf-8")
body = tpl.replace("/*CSS*/", css).replace("/*JS*/", js)

(DIST / "artifact.html").write_text(body, encoding="utf-8")

title = re.search(r"<title>.*?</title>", body).group(0)
rest = body.replace(title, "", 1)
head_links = "\n".join(re.findall(r"<link [^>]+>", rest))
rest = re.sub(r"<link [^>]+>\n?", "", rest)
full = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#0f1a2b">
{title}
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Wiehnachtsreisli">
{head_links}
</head>
<body>
{rest}
</body>
</html>
"""
(DIST / "index.html").write_text(full, encoding="utf-8")

# ---- App-Icon (Pixel-Bierkrug), Manifest und Versionsdatei für den Homescreen ----
import struct, zlib

MUG = [
    "................",
    "....WWWWWWW.....",
    "...WWWWWWWWW....",
    "...WWWWWWWWW....",
    "...WWWWWWWWW....",
    "....GGGGGGG.....",
    "....GAGGAGGBB...",
    "....GAGGAGGBOB..",
    "....GGGGGGGBOB..",
    "....GAGGAGGBOB..",
    "....GAGGAGGBB...",
    "....GGGGGGG.....",
    "....GAGGAGG.....",
    "....GGGGGGG.....",
    "....OOOOOOO.....",
    "................",
]
COLS = {"W": (255, 250, 236), "G": (232, 179, 58), "A": (247, 206, 92), "B": (214, 234, 240), "O": (198, 130, 32)}

def icon_png(size):
    bg0, bg1 = (18, 38, 70), (10, 20, 38)
    cell = size / 16
    rows = []
    for y in range(size):
        row = bytearray([0])
        t = y / size
        for x in range(size):
            ch = MUG[int(y / cell)][int(x / cell)]
            if ch in COLS:
                r, g, b = COLS[ch]
            else:
                r, g, b = [int(bg0[i] * (1 - t) + bg1[i] * t) for i in range(3)]
                # Schneeflocken im Hintergrund
                if (x * 7 + y * 13) % 97 == 0 and (x + y) % 3 == 0: r, g, b = (200, 220, 240)
            row += bytes((r, g, b))
        rows.append(bytes(row))
    raw = b"".join(rows)
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")

for name, size in (("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)):
    (DIST / name).write_bytes(icon_png(size))
(DIST / "manifest.webmanifest").write_text(json.dumps({
    "name": "Wiehnachtsreisli 2026 nach Innsbruck", "short_name": "Wiehnachtsreisli", "start_url": "./", "scope": "./", "display": "standalone",
    "orientation": "any", "background_color": "#0f1a2b", "theme_color": "#0f1a2b",
    "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}],
}, ensure_ascii=False), encoding="utf-8")
(DIST / "version.json").write_text(json.dumps({"v": changelog[0]["v"], "date": changelog[0]["date"]}), encoding="utf-8")
print(f"OK: Version {changelog[0]['v']}, {len(js_files)} JS-Module, {len(full) // 1024} KB")
