#!/usr/bin/env python3
"""Inline local assets into one self-contained page (PLAN.md §3).

    python3 build.py

Writes:
  dist/index.html       — the submission file: works on its own, e.g. from a USB stick
  dist/mani-scene.html  — the same page for the MANI project at maniengine.com/t/T7lVd05wE151.
                          MANI serves pages in a CSP sandbox without allow-popups, so links
                          that open a new tab are switched to open in the same tab.
"""
import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"


def inline_assets(html: str) -> str:
    """Replace src="assets/..." with data: URLs."""
    def to_data_url(match):
        path = ROOT / match.group(2)
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        data = base64.b64encode(path.read_bytes()).decode("ascii")
        return f'{match.group(1)}="data:{mime};base64,{data}"'
    return re.sub(r'(src|href)="(assets/[^"]+)"', to_data_url, html)


def for_mani(html: str) -> str:
    """Popups are blocked inside MANI's sandbox, so open external links in the same tab."""
    return html.replace(' target="_blank" rel="noopener"', "")


def main():
    html = inline_assets((ROOT / "index.html").read_text(encoding="utf-8"))
    DIST.mkdir(exist_ok=True)
    (DIST / "index.html").write_text(html, encoding="utf-8")
    (DIST / "mani-scene.html").write_text(for_mani(html), encoding="utf-8")
    for name in ("index.html", "mani-scene.html"):
        print(f"dist/{name}: {(DIST / name).stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
