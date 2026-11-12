#!/usr/bin/env python
"""Jeu d'icônes proposé, rastérisé depuis les vecteurs (à brancher uniquement après validation visuelle).

Usage (depuis agrolide/) : python scripts/forme/icons.py
Sorties dans public/design-assets/icons/ :
  icon.svg                  emblème couleur, cadrage au plus juste (favicon vectoriel : src/app/icon.svg)
  apple-icon-180.png        180 px, fond blanc, marge de 12 % (src/app/apple-icon.png)
  icon-192.png, icon-512.png            « any » : emblème sur fond blanc, marge 8 %
  icon-maskable-512.png     zone de sécurité Android (emblème dans le disque central de 66 %) sur fond blanc
  icon-monochrome.svg       emblème en une couleur (soleil détaché), pour les icônes monochromes
"""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

import resvg_py

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parents[1] / "public" / "design-assets"
OUT = ASSETS / "icons"


def inner(svg_name: str):
    svg = (ASSETS / svg_name).read_text(encoding="utf-8")
    vb = [float(v) for v in re.search(r'viewBox="([\d. ]+)"', svg).group(1).split()]
    return svg[svg.index(">") + 1 : svg.rindex("</svg>")], vb[2], vb[3]


def png(size: int, margin: float, bg: str, name: str):
    body, w, h = inner("emblem-couleur.svg")
    s = size * (1 - 2 * margin)
    k = s / max(w, h)
    ox, oy = (size - w * k) / 2, (size - h * k) / 2
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">'
        f'<rect width="{size}" height="{size}" fill="{bg}"/>'
        f'<g transform="translate({ox:.3f} {oy:.3f}) scale({k:.6f})">{body}</g></svg>'
    )
    (OUT / name).write_bytes(bytes(resvg_py.svg_to_bytes(svg_string=svg)))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ASSETS / "emblem-couleur.svg", OUT / "icon.svg")
    shutil.copyfile(ASSETS / "emblem-noir.svg", OUT / "icon-monochrome.svg")
    png(180, 0.12, "#ffffff", "apple-icon-180.png")
    png(192, 0.08, "#ffffff", "icon-192.png")
    png(512, 0.08, "#ffffff", "icon-512.png")
    png(512, 0.17, "#ffffff", "icon-maskable-512.png")
    print("icônes écrites dans", OUT)


if __name__ == "__main__":
    sys.exit(main())
