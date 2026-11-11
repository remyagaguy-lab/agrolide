#!/usr/bin/env python
"""Vectorisation du motif de marque (plante sur collines en sillons) en tuile SVG parfaitement raccordable.

Usage (depuis agrolide/) : python scripts/forme/vectorize_motif.py [--src <Branding/Identité>]

Source : `Motif agrolide transparent.png` (1620 x 2025, RGBA).
Méthode
 1. Le réseau est régulier : translations a = (204, 0) et b = (102, 208,8) sur les 5 rangées centrales (les rangées
    du bas de la source dérivent). On replie ces rangées sur la cellule 204 x 417,5 (deux rangées) : la moyenne
    de ~40 répétitions supprime le bruit de la source.
 2. Tons de la cellule : collines (arcs + bande), feuilles, contour et tige, reflet. Champs souples par seuil sur
    le canal vert.
 3. Les champs sont répétés 3 x 3 puis tracés (contours sous-pixel + Bézier, voir bezier_trace.py) : un élément qui
    traverse le bord de la tuile reste d'un seul tenant ; on garde les anneaux qui touchent la cellule centrale.
Sorties : public/design-assets/motif-couleur.svg (tuile couleur) et motif-masque.svg (alpha ton sur ton, pour mask-image), entrée « motif » de forme-paths.ts.
"""
from __future__ import annotations

import argparse
import io
import json
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bezier_trace as bt  # noqa: E402
import vectorize as vz  # noqa: E402

AX, BX, BY = 204.0, 102.0, 208.8
CELL_W, CELL_H = 204.0, 417.5  # deux rangées
S = 2  # facteur de travail (la cellule est calculée à 2x)
Y0, Y1 = 215, 1290  # rangées régulières (px de la source)


def fold_cell(src: Path):
    im = cv2.imdecode(np.fromfile(str(src / "Motif agrolide transparent.png"), np.uint8), cv2.IMREAD_UNCHANGED)
    a = im[..., 3].astype(np.float32) / 255
    pm = np.dstack([im[..., :3].astype(np.float32) * a[..., None], a])
    big = cv2.resize(pm, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
    H, W, _ = big.shape
    cw, ch = int(CELL_W * S), int(round(CELL_H * S))
    valid = np.zeros((H, W), np.float32)
    valid[Y0 * S : Y1 * S, :] = 1
    acc = np.zeros((ch, cw, 4), np.float64)
    cnt = np.zeros((ch, cw), np.float64)
    for j in range(-8, 10):
        for i in range(-10, 12):
            M = np.float32([[1, 0, -(i * AX + j * BX) * S], [0, 1, -j * BY * S]])
            w = cv2.warpAffine(big, M, (cw, ch), flags=cv2.INTER_LINEAR, borderValue=0)
            v = cv2.warpAffine(valid, M, (cw, ch), flags=cv2.INTER_NEAREST, borderValue=0)
            acc += w * v[..., None]
            cnt += v
    m = acc / np.maximum(cnt, 1)[..., None]
    A = m[..., 3].astype(np.float32)
    col = (m[..., :3] / np.maximum(A[..., None], 1e-3)).astype(np.float32)  # BGR non prémultiplié
    return A, col


def soft(x):
    return np.clip(0.5 + x, 0, 1).astype(np.float32)


def tone_fields(A, col):
    g = cv2.GaussianBlur(col[..., 1], (0, 0), 0.8)  # canal vert
    A = cv2.GaussianBlur(A, (0, 0), 0.6)
    hill = np.minimum(A, soft((100 - g) / 30))  # collines : G < 100
    plant = np.minimum(A, soft((g - 100) / 30))  # tout ce qui n'est pas colline
    leaf = np.maximum(np.minimum(plant, soft((135 - g) / 25)), np.minimum(plant, soft((g - 165) / 20)))
    light = np.minimum(plant, soft((g - 165) / 20))  # reflet
    return {"hill": hill, "plant": plant, "leaf": leaf, "light": light}


def tile3(f):
    return np.tile(f, (3, 3))


def trace_layer(f, name, tol=0.7):
    h, w = f.shape
    T = tile3(f)
    rings = bt.trace_field(T, up=2, step=1.0, sigma_px=3.0, sigma_big=14.0, r_lo=10.0, r_hi=45.0, tol=tol,
                           corner_win=3.0, corner_angle=55.0, min_area=40 * S * S)
    # coordonnées en px de travail (2x) du pavage 3x3 ; la cellule centrale = [w, 2w) x [h, 2h)
    keep = []
    for r in rings:
        pts = bt.sample_segments(r["segs"], 20)
        x0, y0, x1, y1 = pts[:, 0].min(), pts[:, 1].min(), pts[:, 0].max(), pts[:, 1].max()
        if x1 > w and x0 < 2 * w and y1 > h and y0 < 2 * h:
            keep.append(r)
    out = []
    for r in keep:
        segs = [(s - np.array([w, h])) / S for s in r["segs"]]
        out.append(segs)
    return out


def d_of(rings, nd=1):
    s = ""
    for segs in rings:
        s += bt.path_data(segs, 0, 0, nd)
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src")
    a = ap.parse_args()
    src = vz.find_src(a.src)
    A, col = fold_cell(src)
    F = tone_fields(A, col)
    traced = {k: trace_layer(f, k) for k, f in F.items()}
    nodes = {k: sum(len(r) for r in v) for k, v in traced.items()}
    print("noeuds", nodes)
    D = {k: d_of(v) for k, v in traced.items()}
    # couleurs mesurées sur la cellule moyennée (centroïdes de tons) : voir le rapport
    colors = {"hill": "#2f5417", "leaf": "#32771f", "plant": "#4c9747", "light": "#87ca87"}
    # --- couleur : collines, silhouette de plante (ton contour), feuilles, reflet
    def doc(body):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CELL_W:g} {CELL_H:g}" '
                f'width="{CELL_W:g}" height="{CELL_H:g}">{body}</svg>\n')
    body_c = (f'<path fill="{colors["hill"]}" fill-rule="evenodd" d="{D["hill"]}"/>'
              f'<path fill="{colors["plant"]}" fill-rule="evenodd" d="{D["plant"]}"/>'
              f'<path fill="{colors["leaf"]}" fill-rule="evenodd" d="{D["leaf"]}"/>'
              f'<path fill="{colors["light"]}" fill-rule="evenodd" d="{D["light"]}"/>')
    (vz.ASSETS / "motif-couleur.svg").write_text(doc(body_c), encoding="utf-8")
    # --- masque ton sur ton (utilisé par Motif.tsx avec mask-image + currentColor) : l'alpha porte les tons
    body_m = (f'<g fill="#000" fill-rule="evenodd"><path fill-opacity=".42" d="{D["hill"]}"/>'
              f'<path fill-opacity=".7" d="{D["plant"]}"/><path d="{D["plant"]}{D["leaf"]}"/></g>')
    (vz.ASSETS / "motif-masque.svg").write_text(doc(body_m), encoding="utf-8")
    ts = {"motif": {"viewBox": [0, 0, CELL_W, CELL_H], "layers": [
        {"id": k, "fill": colors[k], "d": D[k]} for k in ("hill", "plant", "leaf", "light")]}}
    vz.write_ts(ts, only="motif")
    meta = json.loads(vz.META_OUT.read_text(encoding="utf-8")) if vz.META_OUT.exists() else {}
    meta["motif"] = {"src": "Motif agrolide transparent.png", "cell": [CELL_W, CELL_H], "nodes": nodes}
    vz.META_OUT.write_text(json.dumps(meta, indent=1, ensure_ascii=False), encoding="utf-8")
    # champs de référence pour verify_motif
    np.savez_compressed(vz.HERE / "verification_motif_cell.npz", **F) if False else None


if __name__ == "__main__":
    main()
