#!/usr/bin/env python
"""Primitives géométriques de l'emblème agrolide, MESURÉES sur les pixels du favicon.

Usage (depuis agrolide/) :
    python scripts/forme/primitives.py [--src <dossier Branding/Identité>]

L'emblème n'est pas un dessin libre : il se décompose en cercles. Ce script le démontre et en tire les
primitives du design system, sans aucun point posé à la main :

  1. Système du SOLEIL : quatre cercles concentriques (soleil clair, soleil, blanc, anneau).
     Mesure : transitions radiales de couleur (niveau 0,5 du champ de couverture) sur 61 rayons de la moitié
     haute, puis ajustement de cercle par moindres carrés sur chaque frontière.
  2. ANNEAU : la couronne verte et son ouverture (angles où la couronne est blanche).
  3. Familles de SILLONS : les bords des collines et des bandes blanches sont des arcs de cercles dont les
     centres sont sous l'emblème (famille droite) ; la famille gauche donne la colline de gauche.
  4. HORIZON : les deux collines (arc gauche + arc droit) qui se rejoignent en V sous le soleil.
  5. FEUILLE : une lentille, intersection du disque de l'emblème et d'un disque de la famille droite.

Sorties :
    src/components/brand/geometrie.ts      -> constantes (repère du favicon 2000 px) pour les composants
    public/design-assets/{soleil,anneau,horizon,sillons,feuille}.svg
    scripts/forme/primitives.json          -> mesures, résidus et IoU (pour le rapport)
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import cv2
import numpy as np
from scipy.ndimage import map_coordinates

sys.path.insert(0, str(Path(__file__).resolve().parent))
import vectorize as vz  # noqa: E402

HERE = Path(__file__).resolve().parent
APP = HERE.parents[1]
ASSETS = APP / "public" / "design-assets"
TS_OUT = APP / "src" / "components" / "brand" / "geometrie.ts"
JSON_OUT = HERE / "primitives.json"


# ----------------------------------------------------------------------------- mesures


def fit_circle(pts: np.ndarray):
    """Cercle des moindres carrés (Kåsa) ; renvoie (cx, cy, r) et les résidus moyen / max en px."""
    x, y = pts[:, 0].astype(float), pts[:, 1].astype(float)
    A = np.c_[2 * x, 2 * y, np.ones_like(x)]
    c = np.linalg.lstsq(A, x * x + y * y, rcond=None)[0]
    r = math.sqrt(c[2] + c[0] ** 2 + c[1] ** 2)
    res = np.abs(np.hypot(x - c[0], y - c[1]) - r)
    return (float(c[0]), float(c[1]), r), float(res.mean()), float(res.max())


def crossings(v: np.ndarray, t: np.ndarray, level=0.5):
    """Abscisses (interpolées) où le profil v(t) franchit `level`."""
    s = v - level
    i = np.where(np.sign(s[:-1]) != np.sign(s[1:]))[0]
    return t[i] + (t[i + 1] - t[i]) * s[i] / (s[i] - s[i + 1])


def column_edges(mask: np.ndarray, field: np.ndarray, x0: int, x1: int, step=2):
    """Bords haut et bas d'une bande (un seul segment par colonne), au niveau 0,5 du champ (sous-pixel)."""
    top, bot = [], []
    for x in range(x0, x1, step):
        ys = np.where(mask[:, x])[0]
        if len(ys) == 0 or np.any(np.diff(ys) > 1):
            continue
        for y_edge, out in ((ys[0], top), (ys[-1], bot)):
            t = np.arange(y_edge - 4, y_edge + 5, dtype=float)
            c = crossings(field[t.astype(int), x], t)
            if len(c):
                out.append((x, float(c[np.argmin(np.abs(c - y_edge))])))
    return np.array(top), np.array(bot)


def measure(src: Path):
    rgb = cv2.cvtColor(vz.imread(src / "Favicon agrolide.png"), cv2.COLOR_BGR2RGB)
    F = vz.unmix_classes(rgb, vz.sample_endmembers(rgb))
    names = list(F)
    K = np.stack([F[k] for k in names], 2).argmax(2)
    lab = {n: K == i for i, n in enumerate(names)}
    H, W = K.shape
    out: dict = {"source": "Favicon agrolide.png", "taille": [W, H]}

    # 1. cercles concentriques : on part du centre approché de la silhouette, deux passes
    ink = ~lab["W"]
    ys, xs = np.where(ink)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    r = np.arange(250, 540, 0.25)
    frontieres = {"soleil-clair": ("Y", 0), "soleil": ("O", 0), "anneau-int": ("G", 0), "anneau-ext": ("G", 1)}
    for _ in range(2):
        pts = {k: [] for k in frontieres}
        for ang in np.linspace(200, 340, 61):  # moitié haute, loin des collines (angles écran, y vers le bas)
            a = math.radians(ang)
            X, Y = cx + r * math.cos(a), cy + r * math.sin(a)
            for k, (cls, idx) in frontieres.items():
                c = crossings(map_coordinates(F[cls], [Y, X], order=1), r)
                if k == "soleil-clair":
                    c = c[:1]  # bord du jaune vers l'orange
                if k == "soleil":
                    c = c[-1:]  # bord extérieur de l'orange
                if len(c) > idx:
                    rr = c[idx] if k.startswith("anneau") else c[0]
                    pts[k].append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
        cercles = {k: fit_circle(np.array(v)) for k, v in pts.items()}
        cx = float(np.mean([c[0][0] for c in cercles.values()]))
        cy = float(np.mean([c[0][1] for c in cercles.values()]))
    out["centre"] = [round(cx, 2), round(cy, 2)]
    out["cercles"] = {k: {"c": [round(v[0][0], 2), round(v[0][1], 2)], "r": round(v[0][2], 2),
                          "residu_moyen": round(v[1], 2), "residu_max": round(v[2], 2)} for k, v in cercles.items()}

    # 2. ouverture de l'anneau
    yy, xx = np.mgrid[0:H, 0:W]
    rr_ = np.hypot(xx - cx, yy - cy)
    th = np.degrees(np.arctan2(yy - cy, xx - cx)) % 360
    r_in, r_out = cercles["anneau-int"][0][2], cercles["anneau-ext"][0][2]
    mid = (r_in + r_out) / 2
    band = (np.abs(rr_ - mid) < 1.0) & lab["W"]
    out["anneau_ouverture_deg"] = [round(float(th[band].min()), 1), round(float(th[band].max()), 1)]

    # 3. bandes blanches intérieures (composantes connexes du blanc dans le disque)
    inside = (rr_ < r_in - 3).astype(np.uint8)
    n, cc, st, _ = cv2.connectedComponentsWithStats((lab["W"] & inside.astype(bool)).astype(np.uint8), 8)
    comps = sorted([i for i in range(1, n) if st[i][4] > 3000], key=lambda i: st[i][1])  # par y du haut
    # croissant (le plus haut), bande gauche, bande droite 1, bande droite 2
    croissant, gauche = comps[0], comps[1]
    droites = sorted(comps[2:], key=lambda i: st[i][1])
    Wf = F["W"]

    # ciel = croissant + soleil -> son bord bas est l'horizon
    sky = (cc == croissant) | lab["O"] | lab["Y"]
    sky = cv2.morphologyEx(sky.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)).astype(bool)
    bot = []
    for x in range(int(cx - r_in + 10), int(cx + r_in - 10)):
        c = np.where(sky[:, x])[0]
        if len(c):
            y_e = c.max()
            t = np.arange(y_e - 4, y_e + 5, dtype=float)
            f = (F["W"] + F["O"] + F["Y"])[t.astype(int), x]
            k = crossings(f, t)
            if len(k):
                bot.append((x, float(k[np.argmin(np.abs(k - y_e))])))
    bot = np.array(bot)
    v = bot[np.argmax(bot[:, 1])]
    L = bot[(bot[:, 0] < v[0] - 25) & (np.hypot(bot[:, 0] - cx, bot[:, 1] - cy) < r_in - 15)]
    R = bot[(bot[:, 0] > v[0] + 25) & (np.hypot(bot[:, 0] - cx, bot[:, 1] - cy) < r_in - 15)]
    arcs = {"colline-gauche": fit_circle(L), "colline-droite": fit_circle(R)}
    out["creux_du_v_mesure"] = [round(float(v[0]), 1), round(float(v[1]), 1)]

    # famille droite : bords des deux bandes blanches de droite
    for j, comp in enumerate(droites, start=1):
        m = cc == comp
        x0, x1 = int(xs.min()), int(xs.max())
        top, botm = column_edges(m, Wf, x0, x1)
        keep = lambda p: p[np.hypot(p[:, 0] - cx, p[:, 1] - cy) < r_in - 18]  # noqa: E731
        arcs[f"sillon-{j}-haut"] = fit_circle(keep(top))
        arcs[f"sillon-{j}-bas"] = fit_circle(keep(botm))

    # feuille : intérieur vert clair en bas à droite
    leaf = (lab["L1"] | lab["L2"]).astype(np.uint8)
    n2, lc, st2, cen2 = cv2.connectedComponentsWithStats(leaf, 8)
    fid = max(range(1, n2), key=lambda i: cen2[i][0] * (st2[i][4] > 2000))
    fm = lc == fid
    Lf = F["L1"] + F["L2"]
    top, botm = column_edges(fm, Lf, int(st2[fid][0]), int(st2[fid][0] + st2[fid][2]), step=1)
    a, b = int(len(top) * 0.12), int(len(top) * 0.88)
    arcs["feuille-haut"] = fit_circle(top[a:b])
    arcs["feuille-bas"] = fit_circle(botm[a:b])

    out["arcs"] = {k: {"c": [round(v[0][0], 2), round(v[0][1], 2)], "r": round(v[0][2], 2),
                       "residu_moyen": round(v[1], 2), "residu_max": round(v[2], 2)} for k, v in arcs.items()}

    # ---------------------------------------------------------------- contrôle : IoU des primitives
    def disc(c, rad):
        return np.hypot(xx - c[0], yy - c[1]) <= rad

    A = out["arcs"]
    C = out["cercles"]
    sous_horizon = disc(A["colline-gauche"]["c"], A["colline-gauche"]["r"]) | disc(A["colline-droite"]["c"], A["colline-droite"]["r"])
    ciel_geo = disc(out["centre"], C["anneau-int"]["r"]) & ~sous_horizon

    def iou(a_, b_):
        return round(float((a_ & b_).sum() / max((a_ | b_).sum(), 1)), 4)

    verts = sky
    controle = {
        "ciel (disque intérieur moins collines) / croissant + soleil": iou(ciel_geo, verts),
        "soleil (disque orange moins collines) / orange + jaune": iou(disc(out["centre"], C["soleil"]["r"]) & ~sous_horizon, lab["O"] | lab["Y"]),
        "soleil clair (disque jaune moins collines) / jaune": iou(disc(out["centre"], C["soleil-clair"]["r"]) & ~sous_horizon, lab["Y"]),
    }
    haut = (th > 195) & (th < 345)
    ring_geo = disc(out["centre"], C["anneau-ext"]["r"]) & ~disc(out["centre"], C["anneau-int"]["r"])
    controle["anneau (moitié haute) / vert"] = iou(ring_geo & haut, lab["G"] & haut & (rr_ > r_in - 30))
    lens = disc(A["feuille-haut"]["c"], A["feuille-haut"]["r"]) & disc(A["feuille-bas"]["c"], A["feuille-bas"]["r"])
    controle["feuille (lentille) / intérieur de la feuille"] = iou(lens, fm)
    lim = disc(out["centre"], r_in - 18)
    for j, comp in enumerate(droites, start=1):
        g = disc(A[f"sillon-{j}-haut"]["c"], A[f"sillon-{j}-haut"]["r"]) & ~disc(A[f"sillon-{j}-bas"]["c"], A[f"sillon-{j}-bas"]["r"])
        p = (cc == comp)
        zone = lim & (xx > cx - 250)  # loin de l'ouverture
        controle[f"sillon {j} (couronne excentrée) / bande blanche"] = iou(g & zone, p & zone)
    out["controle_iou"] = controle
    return out


# ----------------------------------------------------------------------------- géométrie dérivée


def circle_intersections(c0, r0, c1, r1):
    (x0, y0), (x1, y1) = c0, c1
    d = math.hypot(x1 - x0, y1 - y0)
    a = (r0 * r0 - r1 * r1 + d * d) / (2 * d)
    h = math.sqrt(max(r0 * r0 - a * a, 0))
    xm, ym = x0 + a * (x1 - x0) / d, y0 + a * (y1 - y0) / d
    return [(xm + h * (y1 - y0) / d, ym - h * (x1 - x0) / d), (xm - h * (y1 - y0) / d, ym + h * (x1 - x0) / d)]


def f2(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def build(m: dict):
    C, A = m["cercles"], m["arcs"]
    c = m["centre"]
    # horizon : intersection des deux collines la plus proche du creux mesuré
    gL, gR = A["colline-gauche"], A["colline-droite"]
    pts = circle_intersections(gL["c"], gL["r"], gR["c"], gR["r"])
    v = min(pts, key=lambda p: math.hypot(p[0] - m["creux_du_v_mesure"][0], p[1] - m["creux_du_v_mesure"][1]))
    # feuille : pointes = intersections des deux arcs
    fh, fb = A["feuille-haut"], A["feuille-bas"]
    tips = sorted(circle_intersections(fh["c"], fh["r"], fb["c"], fb["r"]), key=lambda p: p[0])
    geo = {
        "repere": "pixels de Favicon agrolide.png (2000 x 2000, y vers le bas)",
        "centre": c,
        "rayons": {k: C[k]["r"] for k in ("soleil-clair", "soleil", "anneau-int", "anneau-ext")},
        "anneauOuverture": m["anneau_ouverture_deg"],
        "horizon": {"gauche": {"c": gL["c"], "r": gL["r"]}, "droite": {"c": gR["c"], "r": gR["r"]}, "creux": [round(v[0], 2), round(v[1], 2)]},
        "sillons": [{"c": A[k]["c"], "r": A[k]["r"]} for k in ("colline-droite", "sillon-1-haut", "sillon-1-bas", "sillon-2-haut", "sillon-2-bas", "feuille-haut")],
        "feuille": {"haut": {"c": fh["c"], "r": fh["r"]}, "bas": {"c": fb["c"], "r": fb["r"]},
                    "pointes": [[round(p[0], 2), round(p[1], 2)] for p in tips]},
    }
    return geo


def svg(viewbox, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">{body}</svg>\n'


def write(geo: dict, m: dict):
    c = geo["centre"]
    R = geo["rayons"]
    # soleil : plan + 3 échos = soleil clair, soleil, blanc, anneau
    ro = R["anneau-ext"]
    vb = f"{f2(c[0]-ro)} {f2(c[1]-ro)} {f2(2*ro)} {f2(2*ro)}"
    body = (f'<circle cx="{c[0]}" cy="{c[1]}" r="{R["anneau-ext"]}" fill="#1b5e38"/>'
            f'<circle cx="{c[0]}" cy="{c[1]}" r="{R["anneau-int"]}" fill="#ffffff"/>'
            f'<circle cx="{c[0]}" cy="{c[1]}" r="{R["soleil"]}" fill="#f99e1d"/>'
            f'<circle cx="{c[0]}" cy="{c[1]}" r="{R["soleil-clair"]}" fill="#fcb726"/>')
    (ASSETS / "soleil.svg").write_text(svg(vb, body), encoding="utf-8")
    # anneau ouvert (bouts ronds ; l'ouverture visible = l'ouverture mesurée)
    rm, ep = (R["anneau-int"] + R["anneau-ext"]) / 2, R["anneau-ext"] - R["anneau-int"]
    a0, a1 = geo["anneauOuverture"]
    cap = math.degrees((ep / 2) / rm)
    s, e = math.radians(a0 - cap), math.radians(a1 + cap)  # l'arc va de a1+cap à a0-cap (en passant par le haut)
    p0 = (c[0] + rm * math.cos(e), c[1] + rm * math.sin(e))
    p1 = (c[0] + rm * math.cos(s), c[1] + rm * math.sin(s))
    d = f"M{f2(p0[0])} {f2(p0[1])}A{f2(rm)} {f2(rm)} 0 1 1 {f2(p1[0])} {f2(p1[1])}"
    (ASSETS / "anneau.svg").write_text(svg(vb, f'<path d="{d}" fill="none" stroke="#1b5e38" stroke-width="{f2(ep)}" stroke-linecap="round"/>'), encoding="utf-8")
    # horizon : ciel = disque intérieur au-dessus des deux collines
    hz = geo["horizon"]
    body = (f'<defs><clipPath id="d"><circle cx="{c[0]}" cy="{c[1]}" r="{R["anneau-ext"]}"/></clipPath></defs>'
            f'<g clip-path="url(#d)"><circle cx="{hz["gauche"]["c"][0]}" cy="{hz["gauche"]["c"][1]}" r="{hz["gauche"]["r"]}" fill="#1b5e38"/>'
            f'<circle cx="{hz["droite"]["c"][0]}" cy="{hz["droite"]["c"][1]}" r="{hz["droite"]["r"]}" fill="#1b5e38"/></g>')
    (ASSETS / "horizon.svg").write_text(svg(vb, body), encoding="utf-8")
    # sillons : disques emboîtés de la famille droite
    tons = ["#daebe1", "#ffffff", "#92d5a5", "#ffffff", "#44845a", "#1b5e38"]
    body = "".join(f'<circle cx="{s_["c"][0]}" cy="{s_["c"][1]}" r="{s_["r"]}" fill="{t}"/>' for s_, t in zip(geo["sillons"], tons))
    (ASSETS / "sillons.svg").write_text(svg(f"{f2(c[0]-ro)} {f2(c[1]-ro)} {f2(2*ro)} {f2(2*ro)}",
                                             f'<defs><clipPath id="d"><circle cx="{c[0]}" cy="{c[1]}" r="{R["anneau-int"]}"/></clipPath></defs><g clip-path="url(#d)">{body}</g>'), encoding="utf-8")
    # feuille : lentille
    fl = geo["feuille"]
    (t0, t1) = fl["pointes"]
    d = (f"M{f2(t0[0])} {f2(t0[1])}A{f2(fl['haut']['r'])} {f2(fl['haut']['r'])} 0 0 1 {f2(t1[0])} {f2(t1[1])}"
         f"A{f2(fl['bas']['r'])} {f2(fl['bas']['r'])} 0 0 1 {f2(t0[0])} {f2(t0[1])}Z")
    xs = [t0[0], t1[0]]
    geo["feuilleD"] = d
    # cadre serré de la lentille (échantillonnage des deux arcs)
    pts = []
    for arc in (fl["haut"], fl["bas"]):
        a_ = [math.atan2(t[1] - arc["c"][1], t[0] - arc["c"][0]) for t in (t0, t1)]
        lo, hi = sorted(a_)
        if hi - lo > math.pi:
            lo, hi = hi, lo + 2 * math.pi
        for t in np.linspace(lo, hi, 400):
            pts.append((arc["c"][0] + arc["r"] * math.cos(t), arc["c"][1] + arc["r"] * math.sin(t)))
    P = np.array(pts)
    inl = [p_ for p_ in P if all(math.hypot(p_[0] - a["c"][0], p_[1] - a["c"][1]) <= a["r"] + 0.5 for a in (fl["haut"], fl["bas"]))]
    P = np.array(inl)
    geo["feuilleVB"] = [round(float(P[:, 0].min()), 2), round(float(P[:, 1].min()), 2),
                        round(float(np.ptp(P[:, 0])), 2), round(float(np.ptp(P[:, 1])), 2)]
    (ASSETS / "feuille.svg").write_text(svg(" ".join(f2(v) for v in geo["feuilleVB"]), f'<path d="{d}" fill="#50a853"/>'), encoding="utf-8")
    geo["anneauD"] = {"d": f"M{f2(p0[0])} {f2(p0[1])}A{f2(rm)} {f2(rm)} 0 1 1 {f2(p1[0])} {f2(p1[1])}", "epaisseur": round(ep, 2), "rayon": round(rm, 2)}

    head = (
        "// Fichier généré par scripts/forme/primitives.py — NE PAS ÉDITER À LA MAIN.\n"
        "// Géométrie de l'emblème MESURÉE sur les pixels de « Favicon agrolide.png » (repère 2000 x 2000 px, y vers le bas).\n"
        "// L'emblème se décompose en cercles : système concentrique du soleil, arcs des collines et des sillons,\n"
        "// lentille de la feuille. Résidus d'ajustement et IoU de contrôle : scripts/forme/primitives.json.\n\n"
        "export interface Cercle {\n  c: [number, number];\n  r: number;\n}\n\n"
        "export interface GeometrieEmbleme {\n  repere: string;\n  centre: [number, number];\n"
        "  rayons: { 'soleil-clair': number; soleil: number; 'anneau-int': number; 'anneau-ext': number };\n"
        "  anneauOuverture: [number, number];\n"
        "  horizon: { gauche: Cercle; droite: Cercle; creux: [number, number] };\n"
        "  sillons: Cercle[];\n"
        "  feuille: { haut: Cercle; bas: Cercle; pointes: [number, number][] };\n"
        "  feuilleD: string;\n  feuilleVB: [number, number, number, number];\n  anneauD: { d: string; epaisseur: number; rayon: number };\n}\n\n"
        "export const GEOMETRIE: GeometrieEmbleme = "
    )
    TS_OUT.write_text(head + json.dumps(geo, indent=1, ensure_ascii=False) + ";\n", encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src")
    a = ap.parse_args()
    m = measure(vz.find_src(a.src))
    geo = build(m)
    m["geometrie"] = geo
    write(geo, m)
    JSON_OUT.write_text(json.dumps(m, indent=1, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({k: m[k] for k in ("centre", "cercles", "anneau_ouverture_deg", "creux_du_v_mesure")}, indent=1, ensure_ascii=False))
    for k, v in m["arcs"].items():
        print(f"{k:16s} c={v['c']} r={v['r']}  résidu moyen {v['residu_moyen']} px, max {v['residu_max']} px")
    print("creux du V calculé", geo["horizon"]["creux"])
    for k, v in m["controle_iou"].items():
        print(f"IoU {v:.4f}  {k}")


if __name__ == "__main__":
    main()
