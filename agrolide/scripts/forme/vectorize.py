#!/usr/bin/env python
"""Vectorisation de précision des formes agrolide (emblème du favicon + marqueur « Forme »).

Usage (depuis agrolide/) :
    python scripts/forme/vectorize.py [--src <dossier Branding/Identité>] [--only emblem|arche]

Sources (lecture seule) :
    Favicon agrolide.png                 -> emblème couleur, plein (silhouette) et creux (contour)
    Marqueurs/Forme agrolide.png         -> arche « creux »  (arche épaisse + bande en contour)
    Marqueurs/forme plein agrolide.png   -> arche « plein » (dôme + bande pleins)

Sorties :
    public/design-assets/*.svg           -> vecteurs finaux
    src/components/brand/forme-paths.ts  -> mêmes tracés pour les composants React
    scripts/forme/meta.json              -> cadrage de chaque tracé dans l'image source (pour verify.py)

Aucune retouche à la main : tout est tracé depuis les pixels (voir bezier_trace.py).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bezier_trace as bt  # noqa: E402

HERE = Path(__file__).resolve().parent
APP = HERE.parents[1]  # agrolide/
ASSETS = APP / "public" / "design-assets"
TS_OUT = APP / "src" / "components" / "brand" / "forme-paths.ts"
META_OUT = HERE / "meta.json"

UP = 4
# couleurs de marque (la mesure des aplats de la source figure dans le rapport de vérification)
BRAND = {
    "vert": "#1b5e38",
    "soleil": "#f99e1d",
    "soleil-clair": "#fcb726",
}


def find_src(arg: str | None) -> Path:
    cands = []
    if arg:
        cands.append(Path(arg))
    if os.environ.get("AGROLIDE_BRANDING_DIR"):
        cands.append(Path(os.environ["AGROLIDE_BRANDING_DIR"]))
    for parent in [APP, *APP.parents]:
        cands.append(parent / "Branding" / "Identité")
    for c in cands:
        if (c / "Favicon agrolide.png").exists():
            return c
    sys.exit("Dossier Branding/Identité introuvable : passer --src ou AGROLIDE_BRANDING_DIR.")


def imread(path: Path) -> np.ndarray:
    im = cv2.imdecode(np.fromfile(str(path), np.uint8), cv2.IMREAD_UNCHANGED)
    if im is None:
        sys.exit(f"Lecture impossible : {path}")
    if im.ndim == 3 and im.shape[2] == 4:  # composite sur blanc
        a = im[..., 3:4].astype(np.float32) / 255
        im = (im[..., :3] * a + 255 * (1 - a)).astype(np.uint8)
    return im


# ----------------------------------------------------------------------------- utilitaires géométrie


def ring_depths(rings):
    """Profondeur d'imbrication de chaque anneau (0 = extérieur, 1 = trou, ...)."""
    polys = [np.round(r["raw"] * 16).astype(np.int32) for r in rings]
    depth = []
    for i, r in enumerate(rings):
        pt = tuple(float(v) * 16 for v in r["raw"][0])
        d = 0
        for j, p in enumerate(polys):
            if i != j and abs(rings[j]["area"]) > abs(r["area"]) and cv2.pointPolygonTest(p, pt, False) > 0:
                d += 1
        depth.append(d)
    return depth


def bbox_of(rings, pad=0.0):
    pts = np.vstack([bt.sample_segments(r["segs"], 200) for r in rings])
    return (pts[:, 0].min() - pad, pts[:, 1].min() - pad, pts[:, 0].max() + pad, pts[:, 1].max() + pad)


def d_of(rings, ox, oy, nd=2):
    return "".join(bt.path_data(r["segs"], ox, oy, nd) for r in rings)


def node_count(rings):
    return sum(len(r["segs"]) for r in rings)


def square_frame(bb):
    x0, y0, x1, y1 = bb
    w, h = x1 - x0, y1 - y0
    s = max(w, h)
    return (x0 - (s - w) / 2, y0 - (s - h) / 2, s, s)


# ----------------------------------------------------------------------------- arches (marqueurs)


def trace_marker(path: Path, name: str, *, tol=0.3, sigma=1.5):
    im = imread(path)
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
    ink = float(np.median(g[g < 110]))
    f = np.clip((255 - g) / (255 - ink), 0, 1)
    rings = bt.trace_field(f, up=UP, tol=tol, sigma_px=sigma)
    # ignore les poussières (éclat parasite de l'image source)
    keep = [r for r in rings if abs(r["area"]) > 0.0004 * f.shape[0] * f.shape[1]]
    return {"name": name, "rings": keep, "size": f.shape[::-1], "ink_gray": ink, "src": path.name}


# ----------------------------------------------------------------------------- emblème


ENDMEMBERS = {  # points d'échantillonnage dans Favicon agrolide.png (x, y) -> médiane 7x7
    "W": (100, 100),
    "G": (998, 515),
    "O": (666, 832),
    "Y": (998, 811),
    "L1": (593, 1102),
    "L2": (624, 1175),
}


def sample_endmembers(rgb):
    E = {}
    for k, (x, y) in ENDMEMBERS.items():
        E[k] = np.median(rgb[y - 3 : y + 4, x - 3 : x + 4].reshape(-1, 3), axis=0)
    return E


def unmix_classes(rgb, E, pure_margin=4.0):
    """Démélange à deux pôles : chaque pixel = mélange de deux couleurs franches (ou une seule).

    Renvoie un champ de couverture (H, W, K) par couleur : aux transitions, la couverture vaut la
    part réelle de chaque couleur, d'où des frontières exactes (niveau 0,5) entre classes voisines.
    """
    names = list(E)
    K = len(names)
    M = np.stack([E[k] for k in names]).astype(np.float32)
    H, W, _ = rgb.shape
    p = rgb.reshape(-1, 3).astype(np.float32)
    pure = np.stack([np.linalg.norm(p - M[k], axis=1) for k in range(K)], 1)
    pure_k = pure.argmin(1)
    pure_res = pure.min(1)
    best_res = np.full(len(p), np.inf, np.float32)
    bi = np.zeros(len(p), np.int8)
    bj = np.zeros(len(p), np.int8)
    ba = np.zeros(len(p), np.float32)
    for i in range(K):
        for j in range(i + 1, K):
            d = M[j] - M[i]
            a = np.clip(((p - M[i]) @ d) / float(d @ d), 0, 1)
            res = np.linalg.norm(p - (M[i] + a[:, None] * d), axis=1)
            m = res < best_res
            best_res[m], bi[m], bj[m], ba[m] = res[m], i, j, a[m]
    use_pair = best_res < pure_res - pure_margin
    F = np.zeros((len(p), K), np.float32)
    rows = np.arange(len(p))
    F[rows[~use_pair], pure_k[~use_pair]] = 1
    F[rows[use_pair], bi[use_pair]] = 1 - ba[use_pair]
    F[rows[use_pair], bj[use_pair]] = ba[use_pair]
    return {names[k]: F[:, k].reshape(H, W) for k in range(K)}


def maxfilter(big, r):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    return cv2.dilate(big, k)


def trace_emblem(src: Path, *, tol=0.7, sigma=1.5, sigma_big=14.0):
    rgb = cv2.cvtColor(imread(src / "Favicon agrolide.png"), cv2.COLOR_BGR2RGB)
    E = sample_endmembers(rgb)
    # --- silhouette (non blanc) : canal le plus bas, identique pour le vert et l'orange
    ink = np.clip((255 - rgb.min(2).astype(np.float32)) / (255 - 28), 0, 1)
    ys, xs = np.where(ink > 0.5)
    pad = 14
    cx0, cy0 = max(xs.min() - pad, 0), max(ys.min() - pad, 0)
    cx1, cy1 = min(xs.max() + pad + 1, rgb.shape[1]), min(ys.max() + pad + 1, rgb.shape[0])
    crop = (slice(cy0, cy1), slice(cx0, cx1))
    origin = (-(cx0), -(cy0))  # coordonnées absolues dans l'image 2000 px
    ink_c = ink[crop]
    sil = bt.trace_field(ink_c, up=UP, origin=origin, tol=tol, sigma_px=sigma, sigma_big=sigma_big, r_hi=60.0, min_area=60,
                         corner_win=3.0, corner_angle=60.0)
    depth = ring_depths(sil)
    outer = [r for r, d in zip(sil, depth) if d % 2 == 0]

    # --- couleurs
    F = unmix_classes(rgb[crop], E)

    def tone_ratio(a, b, sigma=4.0):
        """Part de `a` dans le mélange a+b, lissée par convolution normalisée (dégradés doux)."""
        m = np.clip(F[a] + F[b], 0, 1)
        t = cv2.GaussianBlur(F[a], (0, 0), sigma) / np.maximum(cv2.GaussianBlur(m, (0, 0), sigma), 1e-3)
        return np.minimum(np.clip(t, 0, 1), m), m

    Y_f, O_m = tone_ratio("Y", "O")
    L2_f, L_m = tone_ratio("L2", "L1")
    big = {
        "G": bt.upsample_field(F["G"], UP),
        "O_u": bt.upsample_field(O_m, UP),
        "Y": bt.upsample_field(Y_f, UP),
        "L_u": bt.upsample_field(L_m, UP),
        "L2": bt.upsample_field(L2_f, UP),
    }
    # les couches basses passent sous le trait vert ; la couche de base plus loin que celle des tons, afin
    # qu'aucun liseré du ton inférieur ne dépasse malgré le lissage indépendant de chaque contour
    G = big["G"]

    def under(self_f, top_f, px):
        return np.maximum(self_f, np.minimum(maxfilter(self_f, px * UP), top_f))

    layers = {
        "soleil": under(big["O_u"], G, 8),
        "soleil-clair": under(big["Y"], G, 3),
        "feuille-claire": under(big["L_u"], G, 8),
        "feuille": under(big["L2"], G, 3),
        "vert": G,
    }
    traced = {}
    for k, big_f in layers.items():
        tone = k != "vert"  # frontières de tons : dégradés doux, lissage plus fort
        traced[k] = bt.trace_field(None, up=UP, origin=origin, tol=1.0 if tone else tol,
                                   sigma_px=5.0 if tone else sigma, sigma_big=24.0 if tone else sigma_big,
                                   r_hi=80.0 if tone else 60.0, min_area=800 if tone else 60, big=big_f,
                                   corner_win=3.0, corner_angle=60.0)
    return {
        "E": {k: [float(v) for v in vv] for k, vv in E.items()},
        "sil_rings": sil,
        "sil_depth": depth,
        "outer": outer,
        "layers": traced,
        "size": (rgb.shape[1], rgb.shape[0]),
    }


# ----------------------------------------------------------------------------- écriture


def svg_doc(frame, body, title_id=None, extra_attrs=""):
    x0, y0, w, h = frame
    vb = f"0 0 {bt.fmt(w, 2)} {bt.fmt(h, 2)}"
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="none" {extra_attrs}>'.replace("  ", " ")
        + body
        + "</svg>\n"
    )


def hexfix(c):
    return c


def build_outputs(src_dir: Path, only: str | None):
    ASSETS.mkdir(parents=True, exist_ok=True)
    meta, ts = {}, {}

    if only in (None, "emblem"):
        e = trace_emblem(src_dir)
        # cadre carré calé sur la silhouette (+ demi-trait pour la version creuse)
        bb = bbox_of(e["outer"])
        stroke = 3.0
        side_frame = square_frame(bb)
        x0, y0, s, _ = side_frame
        # (les anciennes sorties « plein » et « creux » de la silhouette sont abandonnées : l'emblème en une couleur et son
        #  contour sont construits par primitives.py, avec le soleil détaché des collines)
        # couleur
        c = e["E"]
        def hx(v): return "#%02x%02x%02x" % tuple(int(round(t)) for t in v)
        col = {
            "soleil": BRAND["soleil"], "soleil-clair": BRAND["soleil-clair"], "vert": BRAND["vert"],
            "feuille-claire": hx(c["L1"]), "feuille": hx(c["L2"]),
        }
        parts = []
        for k in ("soleil", "soleil-clair", "feuille-claire", "feuille", "vert"):
            dd = d_of([r for r in e["layers"][k] if True], x0, y0)
            parts.append(f'<path id="{k}" fill="{col[k]}" fill-rule="evenodd" d="{dd}"/>')
        body_col = "<g>" + "".join(parts) + "</g>"
        (ASSETS / "emblem-couleur.svg").write_text(svg_doc(side_frame, body_col), encoding="utf-8")
        ts["emblem-couleur"] = {"viewBox": [0, 0, round(s, 2), round(s, 2)],
                                "layers": [{"id": k, "fill": col[k], "d": d_of(e["layers"][k], x0, y0)}
                                           for k in ("soleil", "soleil-clair", "feuille-claire", "feuille", "vert")]}
        meta["emblem-couleur"] = {"src": "Favicon agrolide.png", "frame": list(side_frame), "colors": col,
                                  "measured": e["E"],
                                  "nodes": sum(node_count(v) for v in e["layers"].values())}
        print("emblem couleur", {k: node_count(v) for k, v in e["layers"].items()}, "cadre", [round(v, 2) for v in side_frame])

    prev = {}
    if META_OUT.exists():
        prev = json.loads(META_OUT.read_text(encoding="utf-8"))
    prev.update(meta)
    META_OUT.write_text(json.dumps(prev, indent=1, ensure_ascii=False), encoding="utf-8")
    if TS_OUT.exists() and only:
        # fusion avec l'existant
        pass
    write_ts(ts, only)


def write_ts(ts, only):
    existing = {}
    if only and TS_OUT.exists():
        txt = TS_OUT.read_text(encoding="utf-8")
        s = txt.index("= ") + 2
        existing = json.loads(txt[s : txt.rindex(";")])
    existing.update(ts)
    head = (
        "// Fichier généré par scripts/forme/vectorize.py — NE PAS ÉDITER À LA MAIN.\n"
        "// Tracés de Bézier issus des pixels des sources du dossier Branding (voir scripts/forme/README.md).\n\n"
        "export interface FormePath {\n  viewBox: [number, number, number, number];\n  d?: string;\n  stroke?: number;\n"
        "  layers?: { id: string; fill: string; d: string }[];\n}\n\n"
        "export const FORME_PATHS: Record<string, FormePath> = "
    )
    TS_OUT.write_text(head + json.dumps(existing, indent=1, ensure_ascii=False) + ";\n", encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src")
    ap.add_argument("--only", choices=["emblem"])
    a = ap.parse_args()
    build_outputs(find_src(a.src), a.only)


if __name__ == "__main__":
    main()
