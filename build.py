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
{head_links}
</head>
<body>
{rest}
</body>
</html>
"""
(DIST / "index.html").write_text(full, encoding="utf-8")
print(f"OK: Version {changelog[0]['v']}, {len(js_files)} JS-Module, {len(full) // 1024} KB")
