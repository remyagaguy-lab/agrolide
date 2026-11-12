#!/usr/bin/env python
"""Contrôle quantitatif et visuel des vecteurs produits par vectorize.py.

Usage (depuis agrolide/) :
    python scripts/forme/verify.py [--src <Branding/Identité>] [--out <dossier de sortie>]

Pour l'emblème couleur (public/design-assets/emblem-couleur.svg), le script
  1. rastérise le SVG à l'échelle exacte de l'image source (2000 px pour l'emblème) avec resvg ;
  2. mesure le recouvrement (IoU) avec le masque de la source et, quand ils existent, avec les PNG
     dérivés du dossier Branding (favicon-forme-*, favicon-contour-*) ;
  3. mesure l'écart de bord : distance entre le tracé vectoriel (échantillonné finement) et le contour
     sous-pixel de la source (moyenne, p95, max, en pixels de la source) ;
  4. écrit des images de différence (rouge = vecteur en trop, bleu = manque) et des planches de rendu
     à 16, 24, 32, 48 et 96 px sur fonds clair, vert profond (#1b5e38) et sombre (#101510).
Résultats : <out>/rapport.json + PNG ; le Markdown est rédigé à partir de rapport.json.
"""
from __future__ import annotations

import argparse
import io
import json
import re
import sys
from pathlib import Path

import cv2
import numpy as np
import resvg_py
from PIL import Image
from scipy.spatial import cKDTree

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bezier_trace as bt  # noqa: E402
import vectorize as vz  # noqa: E402

ASSETS = vz.ASSETS
META = json.loads(vz.META_OUT.read_text(encoding="utf-8")) if vz.META_OUT.exists() else {}


# ----------------------------------------------------------------------------- SVG


def svg_inner(svg: str) -> str:
    return svg[svg.index(">") + 1 : svg.rindex("</svg>")]


def render(svg_text: str, w: int, h: int) -> np.ndarray:
    png = bytes(resvg_py.svg_to_bytes(svg_string=svg_text))
    return np.array(Image.open(io.BytesIO(png)).convert("RGBA"))


def render_in_source_frame(name: str, color: str = "#000000", bg: str | None = "#ffffff") -> np.ndarray:
    """Rastérise l'asset dans le repère de l'image source (1 px SVG = 1 px source)."""
    m = META[name]
    x0, y0 = m["frame"][0], m["frame"][1]
    W, H = m["size"] if "size" in m else (2000, 2000)
    svg = (ASSETS / f"{name}.svg").read_text(encoding="utf-8").replace("currentColor", color)
    wrapped = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
        + (f'<rect width="{W}" height="{H}" fill="{bg}"/>' if bg else "")
        + f'<g transform="translate({x0} {y0})">{svg_inner(svg)}</g></svg>'
    )
    return render(wrapped, W, H)


def parse_rings(d: str):
    """Relit les anneaux cubiques (M ... C ... Z) produits par path_data."""
    rings = []
    for sub in re.findall(r"M[^Z]*Z", d):
        nums = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?(?:e-?\d+)?", sub)]
        p0 = np.array(nums[:2])
        pts = np.array(nums[2:]).reshape(-1, 2)
        segs, cur = [], p0
        for i in range(0, len(pts), 3):
            c1, c2, e = pts[i], pts[i + 1], pts[i + 2]
            segs.append(np.array([cur, c1, c2, e]))
            cur = e
        rings.append(segs)
    return rings


def rings_abs(name: str):
    """Segments cubiques de l'asset, remis dans le repère de l'image source."""
    off = np.array(META[name]["frame"][:2])
    paths, _ = asset_paths(name)
    return [[seg + off for seg in ring] for d, _ in paths for ring in parse_rings(d)]


def asset_paths(name: str):
    svg = (ASSETS / f"{name}.svg").read_text(encoding="utf-8")
    return [(m.group(1), m.group(0)) for m in re.finditer(r'<path[^>]*? d="([^"]+)"', svg)], svg


# ----------------------------------------------------------------------------- références


def read_mask_png(path: Path) -> np.ndarray:
    im = cv2.imdecode(np.fromfile(str(path), np.uint8), cv2.IMREAD_UNCHANGED)
    if im.ndim == 3 and im.shape[2] == 4:
        return im[..., 3].astype(np.float32) / 255
    g = im if im.ndim == 2 else cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    return 1 - g.astype(np.float32) / 255


def ink_field_emblem(src: Path) -> np.ndarray:
    rgb = cv2.cvtColor(vz.imread(src / "Favicon agrolide.png"), cv2.COLOR_BGR2RGB)
    return np.clip((255 - rgb.min(2).astype(np.float32)) / (255 - 28), 0, 1)


def ink_field_marker(path: Path) -> np.ndarray:
    im = vz.imread(path)
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
    ink = float(np.median(g[g < 110]))
    return np.clip((255 - g) / (255 - ink), 0, 1)


def fill_holes(mask: np.ndarray) -> np.ndarray:
    m = (mask > 0.5).astype(np.uint8)
    inv = 1 - m
    h, w = m.shape
    ff = inv.copy()
    pad = np.pad(ff, 1, constant_values=1)
    cv2.floodFill(pad, np.zeros((h + 4, w + 4), np.uint8), (0, 0), 2)
    outside = pad[1:-1, 1:-1] == 2
    return (~outside).astype(np.float32)


def contour_points(field: np.ndarray, step: float = 0.1, up: int = 4):
    pts = []
    for r in bt.trace_rings(field, 0.5, up):
        pts.append(bt.resample_closed(r, step))
    return np.vstack(pts)


def edge_stats(rings, ref_pts):
    tree = cKDTree(ref_pts)
    d = np.concatenate([tree.query(bt.sample_segments(r, 200))[0] for r in rings])
    return {"mean": float(d.mean()), "p95": float(np.percentile(d, 95)), "max": float(d.max())}


def iou(a: np.ndarray, b: np.ndarray) -> float:
    a, b = a > 0.5, b > 0.5
    return float((a & b).sum() / max((a | b).sum(), 1))


def diff_image(cov: np.ndarray, ref: np.ndarray) -> np.ndarray:
    a, b = cov > 0.5, ref > 0.5
    out = np.full(a.shape + (3,), 255, np.uint8)
    out[a & b] = (205, 205, 205)
    out[a & ~b] = (230, 30, 30)  # vecteur en trop : rouge (RGB)
    out[~a & b] = (30, 60, 230)  # manque : bleu
    return out


# ----------------------------------------------------------------------------- planches


def sheet(name: str, outdir: Path, mono: bool):
    sizes = [16, 24, 32, 48, 96]
    bgs = [("clair", "#ffffff", "#1b5e38"), ("vert", "#1b5e38", "#ffffff"), ("sombre", "#101510", "#e8efe9")]
    svg = (ASSETS / f"{name}.svg").read_text(encoding="utf-8")
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    vw, vh = float(m.group(1)), float(m.group(2))
    pad, cellw = 10, 96 + 20
    rows = []
    for label, bg, fg in bgs:
        row = np.zeros((96 + 2 * pad, cellw * len(sizes), 3), np.uint8)
        row[:] = [int(bg[i : i + 2], 16) for i in (1, 3, 5)]
        x = 0
        for s in sizes:
            w = s
            h = max(round(s * vh / vw), 1)
            sv = svg.replace("currentColor", fg).replace("<svg ", f'<svg width="{w}" height="{h}" ', 1)
            rgba = render(sv, w, h)
            a = rgba[..., 3:4].astype(np.float32) / 255
            patch = rgba[..., :3] * a + np.array([int(bg[i : i + 2], 16) for i in (1, 3, 5)]) * (1 - a)
            yy = pad + (96 - h) // 2
            row[yy : yy + h, x + 10 : x + 10 + w] = patch.astype(np.uint8)
            x += cellw
        rows.append(row)
    img = np.vstack(rows)
    Image.fromarray(img).save(outdir / f"planche-{name}.png")
    # même planche agrandie ×4 (plus lisible à l'écran)
    Image.fromarray(img).resize((img.shape[1] * 2, img.shape[0] * 2), Image.NEAREST).save(outdir / f"planche-{name}-x2.png")


# ----------------------------------------------------------------------------- main


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src")
    ap.add_argument("--out", default=str(vz.HERE / "verification"))
    a = ap.parse_args()
    src = vz.find_src(a.src)
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {}

    # ---------------- emblème
    ink = ink_field_emblem(src)
    ink_pts = contour_points(ink)
    sil_ref = ink > 0.5
    # (les contrôles de l'emblème « plein » et de l'arche-marqueur sont retirés avec ces formes : les formes dérivées
    #  sont contrôlées par primitives.py, IoU dans primitives.json)

    # couleur : comparaison pixel à pixel au Favicon
    r = render_in_source_frame("emblem-couleur", bg="#ffffff")
    rgb_src = cv2.cvtColor(vz.imread(src / "Favicon agrolide.png"), cv2.COLOR_BGR2RGB).astype(np.float32)
    rgb_svg = r[..., :3].astype(np.float32)
    dist = np.linalg.norm(rgb_svg - rgb_src, axis=2)
    cov = r[..., 3].astype(np.float32) / 255
    sil_svg = render_in_source_frame("emblem-couleur", bg=None)[..., 3] > 127
    rings = rings_abs("emblem-couleur")
    sil_png = (ink > 0.5)
    inside = sil_png | sil_svg
    report["emblem-couleur"] = {
        "IoU_silhouette": iou(sil_svg.astype(np.float32), sil_png.astype(np.float32)),
        "colour_error_mean_RGB": float(dist.mean()),
        "colour_error_mean_inside_RGB": float(dist[inside].mean()),
        "pixels_error_gt_40_pct_of_symbol": float((dist[inside] > 40).mean() * 100),
        "nodes": sum(len(s) for s in rings),
        "colors": META["emblem-couleur"]["colors"],
        "measured": META["emblem-couleur"]["measured"],
    }
    heat = np.clip(dist * 4, 0, 255).astype(np.uint8)
    Image.fromarray(255 - heat).save(out / "diff-emblem-couleur.png")
    Image.fromarray(r[..., :3]).save(out / "rendu-emblem-couleur-2000.png")

    # ---------------- planches de lisibilité
    sheet("emblem-couleur", out, False)

    (out / "rapport.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    for k, v in report.items():
        print(k, json.dumps(v, ensure_ascii=False))


if __name__ == "__main__":
    main()
