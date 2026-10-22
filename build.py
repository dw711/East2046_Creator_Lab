#!/usr/bin/env python3
"""Inline CSS, JS and local images into dist/index.html (one self-contained file).
Usage: python3 build.py
Images referenced as assets/<file> (or ../assets/<file> in CSS) are base64-inlined
if the file exists; missing files are left as-is (the page has graceful fallbacks).
"""
import base64, mimetypes, re
from pathlib import Path

root = Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")

def css(m):
    return "<style>\n" + (root / m.group(1)).read_text(encoding="utf-8") + "\n</style>"

def js(m):
    code = (root / m.group(1)).read_text(encoding="utf-8").replace("</script", "<\\/script")
    return "<script>\n" + code + "\n</script>"

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
html = re.sub(r'<script src="([^"]+)"></script>', js, html)

def asset(m):
    prefix, rel = m.group(1), m.group(2)
    f = root / rel.replace("../", "")
    if not f.exists():
        return m.group(0)
    mime = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
    return prefix + "data:%s;base64,%s" % (mime, base64.b64encode(f.read_bytes()).decode())

html = re.sub(r"""(['"(])((?:\.\./)?assets/[A-Za-z0-9_.-]+)""", asset, html)

out = root / "dist"
out.mkdir(exist_ok=True)
(out / "index.html").write_text(html, encoding="utf-8")
print("Wrote %s (%.0f KB)" % (out / "index.html", len(html.encode()) / 1024))
