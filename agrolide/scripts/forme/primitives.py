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
TS_OUT_PATHS = APP / "src" / "components" / "brand" / "forme-paths.ts"
META_OUT_PATH = HERE / "meta.json"
# filet blanc entre le soleil et les collines, dans l'emblème en une couleur (px du favicon) : voir le rapport
FILET = 31.0


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

    # bande blanche de gauche (famille gauche) : son bord haut ferme le dôme de l'arche à gauche
    mg = cc == gauche
    top, botm = column_edges(mg, Wf, int(st[gauche][0]) + 6, int(st[gauche][0] + st[gauche][2]) - 6)
    keep = lambda p: p[np.hypot(p[:, 0] - cx, p[:, 1] - cy) < r_in - 18]  # noqa: E731
    arcs["bande-gauche-haut"] = fit_circle(keep(top))
    # le bord bas s'enroule dans la pointe droite de la bande : on l'écarte (25 % droits de la portée)
    xb0, xb1 = botm[:, 0].min(), botm[:, 0].max()
    arcs["bande-gauche-bas"] = fit_circle(keep(botm[botm[:, 0] < xb0 + 0.75 * (xb1 - xb0)]))

    # TRAITS : les trois sillons verts. Axe = milieux des bords sous-pixel appariés ; épaisseur = distance des bords.
    from scipy.spatial import cKDTree

    def bord(comp_mask, field, haut: bool):
        t_, b_ = column_edges(comp_mask, field, 0, W - 1, step=1)
        p = t_ if haut else b_
        return p[np.hypot(p[:, 0] - cx, p[:, 1] - cy) < r_in - 16]

    ciel_bas = bot[(bot[:, 0] > v[0] + 20) & (np.hypot(bot[:, 0] - cx, bot[:, 1] - cy) < r_in - 16)]
    paires = {
        "trait-1": (ciel_bas, bord(cc == droites[0], Wf, True)),
        "trait-2": (bord(cc == droites[0], Wf, False), bord(cc == droites[1], Wf, True)),
        "trait-3": (bord(cc == droites[1], Wf, False), bord(fm, Lf, True)),
    }
    out["traits"] = {}
    for k, (a_, b_) in paires.items():
        d_, i_ = cKDTree(b_).query(a_)
        mid = (a_ + b_[i_]) / 2
        (ccx, ccy, rr), mres, xres = fit_circle(mid)
        out["traits"][k] = {"c": [round(ccx, 2), round(ccy, 2)], "r": round(rr, 2), "epaisseur": round(float(np.median(d_)), 2),
                            "epaisseur_min": round(float(np.percentile(d_, 5)), 2), "epaisseur_max": round(float(np.percentile(d_, 95)), 2),
                            "residu_moyen": round(mres, 2), "residu_max": round(xres, 2)}
    # bout rond du trait 2 (la seule extrémité libre de l'emblème) : on suit l'axe jusqu'à ce que le vert disparaisse
    t2 = out["traits"]["trait-2"]
    ang = math.degrees(math.atan2(1385 - t2["c"][1], 730 - t2["c"][0]))
    for a_deg in np.arange(ang + 12, ang - 12, -0.02):
        a_ = math.radians(a_deg)
        px, py = t2["c"][0] + t2["r"] * math.cos(a_), t2["c"][1] + t2["r"] * math.sin(a_)
        if map_coordinates(F["G"], [[py], [px]], order=1)[0] < 0.5:
            out["trait2_pointe_deg"] = round(float(a_deg + 0.02), 3)
            out["trait2_pointe"] = [round(px, 1), round(py, 1)]
            break

    # intérieur de la COLLINE (aplat vert clair de gauche) : trois bords, chacun rattaché au modèle le plus proche
    gid = min((i for i in range(1, n2) if st2[i][4] > 2000), key=lambda i: cen2[i][0])
    cs_g, _ = cv2.findContours((lc == gid).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    Pg = max(cs_g, key=len)[:, 0, :].astype(float) + 0.5
    lbb_c, lbb_r = arcs["bande-gauche-bas"][0][:2], arcs["bande-gauche-bas"][0][2]
    s1_c, s1_r = arcs["sillon-1-haut"][0][:2], arcs["sillon-1-haut"][0][2]
    # chaque bord est parallèle au trait voisin (épaisseur constante) : centre imposé, seul le rayon est ajusté
    centres = {"colline-int-haut": (lbb_c, lbb_r - 62), "colline-int-droite": (s1_c, s1_r + 62), "colline-int-anneau": ((cx, cy), r_in)}
    E_ = np.stack([np.abs(np.hypot(Pg[:, 0] - c_[0], Pg[:, 1] - c_[1]) - r0) for c_, r0 in centres.values()], 1)
    lab_ = E_.argmin(1)
    for j, (k, (c_, _)) in enumerate(centres.items()):
        q = Pg[(lab_ == j) & (E_.min(1) < 14)]
        d_ = np.hypot(q[:, 0] - c_[0], q[:, 1] - c_[1])
        r_ = float(np.median(d_))
        arcs[k] = ((float(c_[0]), float(c_[1]), r_), float(np.mean(np.abs(d_ - r_))), float(np.max(np.abs(d_ - r_))))

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
    # arche DÉDUITE : silhouette de l'emblème au-dessus de la première ligne blanche (bande gauche + sillon 1),
    # plus le trait 2 (grand sillon) avec son bout rond. Vérité terrain colonne par colonne sur les pixels.
    T2 = out["traits"]["trait-2"]
    D = disc(out["centre"], C["anneau-ext"]["r"])
    dome_geo = D & ~disc(A["bande-gauche-haut"]["c"], A["bande-gauche-haut"]["r"]) & ~disc(A["sillon-1-haut"]["c"], A["sillon-1-haut"]["r"])
    bandes = (cc == gauche) | (cc == droites[0])
    filled = ink.copy()
    cs_, _ = cv2.findContours(ink.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    filled = cv2.drawContours(np.zeros(ink.shape, np.uint8), cs_, -1, 1, -1).astype(bool)
    y_cut = np.full(W, -1)
    for x in range(W):
        c_ = np.where(bandes[:, x])[0]
        if len(c_):
            y_cut[x] = c_.min()
    cols = y_cut >= 0
    zone = cols[None, :] & np.ones((H, 1), bool)
    dome_px = filled & (yy < y_cut[None, :]) & zone
    controle["arche : dôme (silhouette au-dessus de la 1re ligne blanche)"] = iou(dome_geo & zone, dome_px)
    dt2 = np.hypot(xx - T2["c"][0], yy - T2["c"][1])
    a_rel = (np.degrees(np.arctan2(yy - T2["c"][1], xx - T2["c"][0])) - out["trait2_pointe_deg"]) % 360
    band_geo = (np.abs(dt2 - T2["r"]) <= T2["epaisseur"] / 2) & (a_rel < 180) & D
    zone2 = disc(out["centre"], r_in - 8) & (xx < cx + 380)
    trait2_px = lab["G"] & (np.abs(dt2 - T2["r"]) <= T2["epaisseur"] / 2 + 6) & (a_rel < 180)
    controle["arche : trait 2 (axe mesuré, épaisseur constante)"] = iou(band_geo & zone2, trait2_px & zone2)
    for k_, zx in (("trait-1", v[0] + 30), ("trait-3", 960)):
        tr = out["traits"][k_]
        dd_ = np.hypot(xx - tr["c"][0], yy - tr["c"][1])
        z_ = disc(out["centre"], r_in - 8) & (xx > zx)
        g_ = (np.abs(dd_ - tr["r"]) <= tr["epaisseur"] / 2) & z_
        p_ = lab["G"] & (np.abs(dd_ - tr["r"]) <= tr["epaisseur"] / 2 + 6) & z_
        controle[f"sillons : {k_} (axe mesuré, épaisseur constante)"] = iou(g_, p_)
    # cercle inscrit du ciel : centre optique des pictogrammes et des chiffres posés dans le dôme
    dt = cv2.distanceTransform(ciel_geo.astype(np.uint8), cv2.DIST_L2, 5)
    iy, ix = np.unravel_index(np.argmax(dt), dt.shape)
    out["ciel_inscrit"] = {"c": [int(ix), int(iy)], "r": round(float(dt.max()), 1)}
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
        "feuille": {"haut": {"c": fh["c"], "r": fh["r"]}, "bas": {"c": fb["c"], "r": fb["r"]},
                    "pointes": [[round(p[0], 2), round(p[1], 2)] for p in tips]},
    }
    geo.update(derivees(m, geo))
    soleil_detache = geo.pop("_soleil_detache")
    # réseau vert de l'emblème couleur (couche « vert », repère du cadre de l'emblème) + soleil détaché par un filet blanc
    txt = TS_OUT_PATHS.read_text(encoding="utf-8")
    paths = json.loads(txt[txt.index("= ") + 2 : txt.rindex(";")])
    vert = next(l["d"] for l in paths["emblem-couleur"]["layers"] if l["id"] == "vert")
    off = json.loads(META_OUT_PATH.read_text(encoding="utf-8"))["emblem-couleur"]["frame"]
    geo["emblemeMono"] = {"reseau": vert, "soleil": soleil_detache(off, FILET), "filet": FILET,
                          "viewBox": paths["emblem-couleur"]["viewBox"]}
    geo["_soleil_detache"] = soleil_detache
    geo["_off"] = off
    return geo


# ----------------------------------------------------------------------------- formes dérivées (arcs exacts)


def ang(c, p):
    return math.degrees(math.atan2(p[1] - c[1], p[0] - c[0])) % 360


def pt(c, r, a):
    return (c[0] + r * math.cos(math.radians(a)), c[1] + r * math.sin(math.radians(a)))


def arc(c, r, a0, a1, sens):
    """Commande SVG A de l'angle a0 à a1 sur le cercle (c, r), sens +1 = horaire à l'écran (angles croissants)."""
    d = (a1 - a0) % 360 if sens > 0 else (a0 - a1) % 360
    x, y = pt(c, r, a1)
    return f"A{f2(r)} {f2(r)} 0 {1 if d > 180 else 0} {1 if sens > 0 else 0} {f2(x)} {f2(y)}"


def arc_court(c, r, p0, p1):
    """Arc mineur de p0 à p1 sur le cercle (c, r)."""
    a0, a1 = ang(c, p0), ang(c, p1)
    return arc(c, r, a0, a1, +1 if (a1 - a0) % 360 <= 180 else -1)


def inter(c0, r0, c1, r1, cle):
    return min(circle_intersections(c0, r0, c1, r1), key=cle)


def echantillon(c, r, a0, a1, sens, n=200):
    d = (a1 - a0) % 360 if sens > 0 else -((a0 - a1) % 360)
    return [pt(c, r, a0 + d * t / n) for t in range(n + 1)]


def derivees(m: dict, geo: dict):
    """Arche, fenêtre (ciel) et sillons reconstruits UNIQUEMENT avec les cercles mesurés de l'emblème."""
    C, A, T = geo["centre"], m["arcs"], m["traits"]
    R, Rin = geo["rayons"]["anneau-ext"], geo["rayons"]["anneau-int"]
    lb, s1 = A["bande-gauche-haut"], A["sillon-1-haut"]
    # dôme : disque de l'emblème au-dessus de la première ligne blanche (bande gauche à gauche, sillon 1 à droite)
    pl = inter(C, R, lb["c"], lb["r"], lambda p: p[0])
    pr = inter(C, R, s1["c"], s1["r"], lambda p: -p[0])
    vv = inter(lb["c"], lb["r"], s1["c"], s1["r"], lambda p: p[1] if 850 < p[0] < 1150 else 1e9)
    dome = (f"M{f2(pl[0])} {f2(pl[1])}" + arc(C, R, ang(C, pl), ang(C, pr), +1)
            + arc(s1["c"], s1["r"], ang(s1["c"], pr), ang(s1["c"], vv), -1)
            + arc(lb["c"], lb["r"], ang(lb["c"], vv), ang(lb["c"], pl), -1) + "Z")
    pts_dome = (echantillon(C, R, ang(C, pl), ang(C, pr), +1) + echantillon(s1["c"], s1["r"], ang(s1["c"], pr), ang(s1["c"], vv), -1)
                + echantillon(lb["c"], lb["r"], ang(lb["c"], vv), ang(lb["c"], pl), -1))
    # grand sillon (trait 2) : épaisseur constante, bout rond mesuré, coupé à droite par le disque de l'emblème
    t2 = T["trait-2"]
    c2, r2, e2 = t2["c"], t2["r"], t2["epaisseur"]
    ro, ri = r2 + e2 / 2, r2 - e2 / 2
    a_cap = m["trait2_pointe_deg"] + math.degrees((e2 / 2) / r2)
    qo = inter(C, R, c2, ro, lambda p: -p[0])
    qi = inter(C, R, c2, ri, lambda p: -p[0])
    cap_c = pt(c2, r2, a_cap)
    oc, ic = pt(c2, ro, a_cap), pt(c2, ri, a_cap)
    bande = (f"M{f2(oc[0])} {f2(oc[1])}" + arc(c2, ro, a_cap, ang(c2, qo), +1) + arc(C, R, ang(C, qo), ang(C, qi), +1)
             + arc(c2, ri, ang(c2, qi), a_cap, -1) + arc(cap_c, e2 / 2, ang(cap_c, ic), ang(cap_c, oc), +1) + "Z")
    pts_bande = echantillon(c2, ro, a_cap, ang(c2, qo), +1) + echantillon(cap_c, e2 / 2, ang(cap_c, ic), ang(cap_c, oc), +1)
    # ciel = fenêtre : disque intérieur de l'anneau au-dessus des deux collines
    hg, hd = geo["horizon"]["gauche"], geo["horizon"]["droite"]
    v = geo["horizon"]["creux"]
    ql = inter(C, Rin, hg["c"], hg["r"], lambda p: p[0])
    qr = inter(C, Rin, hd["c"], hd["r"], lambda p: -p[0])
    ciel = (f"M{f2(ql[0])} {f2(ql[1])}" + arc(C, Rin, ang(C, ql), ang(C, qr), +1)
            + arc(hd["c"], hd["r"], ang(hd["c"], qr), ang(hd["c"], v), -1) + arc(hg["c"], hg["r"], ang(hg["c"], v), ang(hg["c"], ql), -1) + "Z")
    # cercle inscrit du dôme (rastérisation exacte du tracé) : centre optique du badge
    import resvg_py
    png = resvg_py.svg_to_bytes(svg_string=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" width="2000" height="2000"><path d="{dome}" fill="#000"/></svg>')
    msk = (cv2.imdecode(np.frombuffer(bytes(png), np.uint8), cv2.IMREAD_UNCHANGED)[..., 3] > 127).astype(np.uint8)
    dtd = cv2.distanceTransform(msk, cv2.DIST_L2, 5)
    dy_, dx_ = np.unravel_index(np.argmax(dtd), dtd.shape)
    dome_ins = {"c": [int(dx_), int(dy_)], "r": round(float(dtd.max()), 1)}
    # centre optique : sur l'axe de symétrie du dôme (centre de l'emblème), à mi-hauteur de la corde verticale
    col = np.where(msk[:, int(round(C[0]))])[0]
    dome_centre = [round(C[0], 2), round((col.min() + col.max() + 1) / 2, 1)]
    pts_ciel = (echantillon(C, Rin, ang(C, ql), ang(C, qr), +1) + echantillon(hd["c"], hd["r"], ang(hd["c"], qr), ang(hd["c"], v), -1)
                + echantillon(hg["c"], hg["r"], ang(hg["c"], v), ang(hg["c"], ql), -1))
    PC = np.array(pts_ciel)
    ciel_vb = [round(PC[:, 0].min(), 2), round(PC[:, 1].min(), 2), round(np.ptp(PC[:, 0]), 2), round(np.ptp(PC[:, 1]), 2)]
    P = np.array(pts_dome + pts_bande)
    x0, y0, x1, y1 = P[:, 0].min(), P[:, 1].min(), P[:, 0].max(), P[:, 1].max()
    ins = m["ciel_inscrit"]
    # sillons : les trois traits (axes et épaisseurs mesurés), cadre = coin bas-droit de l'emblème
    tr = [T["trait-1"], T["trait-2"], T["trait-3"]]
    a1_fin = ang(tr[0]["c"], (v[0], tr[0]["c"][1] - math.sqrt(tr[0]["r"] ** 2 - (v[0] - tr[0]["c"][0]) ** 2)))  # bout du trait 1 à l'aplomb du V
    yb = geo["feuille"]["pointes"][0][1]  # bas du cadre : pointe gauche de la feuille
    xr = C[0] + Rin  # droite du cadre : bord intérieur de l'anneau
    traits = []
    for k, t in enumerate(tr):
        c_, r_ = t["c"], t["r"]
        a_fin = ang(c_, (xr + 200, c_[1] - math.sqrt(max(r_ ** 2 - (xr + 200 - c_[0]) ** 2, 0)))) if r_ > xr + 200 - c_[0] else 300.0
        if k == 0:
            a_deb, cap = a1_fin, True
        elif k == 1:
            a_deb, cap = a_cap, True
        else:
            a_deb, cap = ang(c_, (c_[0] - math.sqrt(r_ ** 2 - (yb + 60 - c_[1]) ** 2), yb + 60)), False
        p0 = pt(c_, r_, a_deb)
        traits.append({"d": f"M{f2(p0[0])} {f2(p0[1])}" + arc(c_, r_, a_deb, a_fin, +1), "epaisseur": t["epaisseur"], "boutRond": cap})
    ytop = min(t["c"][1] - math.sqrt(t["r"] ** 2 - (xr - t["c"][0]) ** 2) - t["epaisseur"] / 2 - 4 for t in tr)
    xl = pt(c2, r2, m["trait2_pointe_deg"])[0] - 4
    # ARCHE = le dôme seul (décision du 12/11/2026 : le sillon accolé est retiré)
    PD = np.array(pts_dome)
    dome_vb = [round(PD[:, 0].min(), 2), round(PD[:, 1].min(), 2), round(np.ptp(PD[:, 0]), 2), round(np.ptp(PD[:, 1]), 2)]

    # ÉCLATÉ : le dôme + les trois pièces du bas détachées. Règle : chaque pièce = son aplat intérieur + un DEMI-TRAIT
    # autour (le trait vert coupé en son milieu), coins arrondis du même demi-trait (comme le bout du grand sillon).
    demi = np.mean([T[k]["epaisseur"] for k in T]) / 2

    def piece(bords, sommets_approx):
        """bords : [(centre, rayon, dedans)] dans l'ordre horaire ; sommet i entre le bord i et le bord i+1."""
        n_ = len(bords)
        som = []
        for k in range(n_):
            (c0, r0, _), (c1, r1, _) = bords[k], bords[(k + 1) % n_]
            som.append(inter(c0, r0, c1, r1, lambda p, q=sommets_approx[k]: math.hypot(p[0] - q[0], p[1] - q[1])))

        def normale(k, V):
            c_, _, dedans = bords[k]
            u = ((V[0] - c_[0]), (V[1] - c_[1])); L = math.hypot(*u); u = (u[0] / L, u[1] / L)
            return u if dedans else (-u[0], -u[1])

        A_ = [None] * n_; B_ = [None] * n_
        for k in range(n_):
            V = som[k]
            n0, n1 = normale(k, V), normale((k + 1) % n_, V)
            A_[k] = (V[0] + demi * n0[0], V[1] + demi * n0[1])
            B_[k] = (V[0] + demi * n1[0], V[1] + demi * n1[1])
        d = f"M{f2(B_[-1][0])} {f2(B_[-1][1])}"
        pts = []
        for k in range(n_):
            c_, r_, dedans = bords[k]
            d += arc_court(c_, r_ + demi if dedans else r_ - demi, B_[k - 1], A_[k])
            d += arc_court(som[k], demi, A_[k], B_[k])
            pts += [A_[k], B_[k]]
        return d + "Z", som

    cg = {k: (A[k]["c"], A[k]["r"]) for k in ("colline-int-haut", "colline-int-droite", "colline-int-anneau", "feuille-haut", "feuille-bas")}
    colline_d, colline_som = piece([(*cg["colline-int-anneau"], True), (*cg["colline-int-haut"], True), (*cg["colline-int-droite"], False)],
                                   [(560, 1070), (820, 1120), (630, 1290)])
    tips = geo["feuille"]["pointes"]
    feuille_d, _ = piece([(*cg["feuille-haut"], True), (*cg["feuille-bas"], True)], [tips[1], tips[0]])
    # grand sillon : trait entier, bout rond d'origine à gauche ; à droite il s'arrête sur l'axe de l'anneau, bout rond
    rm = (R + Rin) / 2
    q_ = inter(C, rm, c2, r2, lambda p: -p[0])
    a_fin2 = ang(c2, q_)
    cap_d = pt(c2, r2, a_fin2)
    od, idd = pt(c2, ro, a_fin2), pt(c2, ri, a_fin2)
    sillon_d = (f"M{f2(oc[0])} {f2(oc[1])}" + arc(c2, ro, a_cap, a_fin2, +1) + arc(cap_d, e2 / 2, ang(cap_d, od), ang(cap_d, idd), +1)
                + arc(c2, ri, a_fin2, a_cap, -1) + arc(cap_c, e2 / 2, ang(cap_c, ic), ang(cap_c, oc), +1) + "Z")
    eclate = {"colline": colline_d, "sillon": sillon_d, "feuille": feuille_d, "demiTrait": round(demi, 2)}
    eclate_vb = [round(C[0] - R - 2, 2), round(C[1] - R - 2, 2), round(2 * R + 4, 2), round(2 * R + 4, 2)]

    # EMBLÈME EN UNE COULEUR : le réseau vert d'origine + le soleil détaché des collines par un filet blanc
    def soleil_detache(off, g):
        Cs = (C[0] - off[0], C[1] - off[1]); Rs = geo["rayons"]["soleil"]
        hg2 = ((hg["c"][0] - off[0], hg["c"][1] - off[1]), hg["r"] + g)
        hd2 = ((hd["c"][0] - off[0], hd["c"][1] - off[1]), hd["r"] + g)
        sl = inter(Cs, Rs, *hg2, lambda p: p[0]); sr = inter(Cs, Rs, *hd2, lambda p: -p[0])
        vg = inter(*hg2, *hd2, lambda p: math.hypot(p[0] - (v[0] - off[0]), p[1] - (v[1] - off[1])))
        return (f"M{f2(sl[0])} {f2(sl[1])}" + arc(Cs, Rs, ang(Cs, sl), ang(Cs, sr), +1)
                + arc_court(hd2[0], hd2[1], sr, vg) + arc_court(hg2[0], hg2[1], vg, sl) + "Z")

    return {
        "arche": {"dome": dome, "ciel": ciel, "viewBox": dome_vb,
                  "cielInscrit": {"c": ins["c"], "r": ins["r"]}, "domeInscrit": dome_ins, "domeCentre": dome_centre, "cielViewBox": [float(x) for x in ciel_vb]},
        "eclate": {**eclate, "viewBox": eclate_vb},
        "traits": {"liste": traits, "viewBox": [round(xl, 2), round(ytop, 2), round(xr - xl, 2), round(yb - ytop, 2)]},
        "_soleil_detache": soleil_detache,
    }


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
    # sillons : les trois traits mesurés
    ts = geo["traits"]
    body = "".join(f'<path d="{t["d"]}" fill="none" stroke="#1b5e38" stroke-width="{t["epaisseur"]}" stroke-linecap="{"round" if t["boutRond"] else "butt"}"/>' for t in ts["liste"])
    (ASSETS / "sillons.svg").write_text(svg(" ".join(f2(x) for x in ts["viewBox"]), body), encoding="utf-8")
    # arche (le dôme seul), fenêtre (ciel), emblème éclaté, emblème en une couleur et en contour
    ar = geo["arche"]
    vba = " ".join(f2(x) for x in ar["viewBox"])
    (ASSETS / "arche.svg").write_text(svg(vba, f'<path d="{ar["dome"]}" fill="#1b5e38"/>'), encoding="utf-8")
    (ASSETS / "fenetre.svg").write_text(svg(" ".join(f2(x) for x in ar["cielViewBox"]), f'<path d="{ar["ciel"]}" fill="#fcb726"/>'), encoding="utf-8")
    ec = geo["eclate"]
    p_ = ec
    (ASSETS / "emblem-eclate.svg").write_text(svg(" ".join(f2(x) for x in ec["viewBox"]),
        f'<path d="{ar["dome"]}{p_["colline"]}{p_["sillon"]}{p_["feuille"]}" fill="#1b5e38"/>'), encoding="utf-8")
    em = geo["emblemeMono"]
    vbe = " ".join(f2(x) for x in em["viewBox"])
    for nom, coul in (("emblem-noir", "#000000"), ("emblem-blanc", "#ffffff")):
        (ASSETS / f"{nom}.svg").write_text(svg(vbe, f'<path d="{em["reseau"]}{em["soleil"]}" fill="{coul}" fill-rule="evenodd"/>'), encoding="utf-8")
    (ASSETS / "emblem-contour.svg").write_text(svg(vbe, f'<path d="{em["reseau"]}{em["soleil"]}" fill="none" stroke="#000000" stroke-width="4" stroke-linejoin="round"/>'), encoding="utf-8")
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
        "  arche: { dome: string; ciel: string; viewBox: [number, number, number, number]; cielInscrit: Cercle; domeInscrit: Cercle; domeCentre: [number, number]; cielViewBox: [number, number, number, number] };\n"
        "  eclate: { colline: string; sillon: string; feuille: string; demiTrait: number; viewBox: [number, number, number, number] };\n"
        "  emblemeMono: { reseau: string; soleil: string; filet: number; viewBox: [number, number, number, number] };\n"
        "  traits: { liste: { d: string; epaisseur: number; boutRond: boolean }[]; viewBox: [number, number, number, number] };\n"
        "  feuille: { haut: Cercle; bas: Cercle; pointes: [number, number][] };\n"
        "  feuilleD: string;\n  feuilleVB: [number, number, number, number];\n  anneauD: { d: string; epaisseur: number; rayon: number };\n}\n\n"
        "export const GEOMETRIE: GeometrieEmbleme = "
    )
    TS_OUT.write_text(head + json.dumps(geo, indent=1, ensure_ascii=False) + ";\n", encoding="utf-8")


def apercu_filets(geo, soleil_detache, off, out):
    import resvg_py
    em = geo["emblemeMono"]
    vb = " ".join(f2(x) for x in em["viewBox"])
    cases = []
    for g in (0, 16, 24, 31, 45, 61):
        for taille in (240, 48, 24):
            png = resvg_py.svg_to_bytes(svg_string=svg(vb, f'<path d="{em["reseau"]}{soleil_detache(off, g)}" fill="#101510" fill-rule="evenodd"/>').replace("<svg ", f'<svg width="{taille}" height="{taille}" ', 1))
            cases.append((g, taille, cv2.imdecode(np.frombuffer(bytes(png), np.uint8), cv2.IMREAD_UNCHANGED)))
    W, H = 6 * 260, 340
    sheet = np.full((H, W, 3), 255, np.uint8)
    for i, (g, t, im) in enumerate(cases):
        col = i // 3
        a_ = im[..., 3:4].astype(np.float32) / 255
        rgb = (im[..., :3].astype(np.float32) * a_ + 255 * (1 - a_)).astype(np.uint8)
        y = {240: 10, 48: 262, 24: 274}[t]
        x = col * 260 + 10 + {240: 0, 48: 40, 24: 140}[t]
        sheet[y:y + t, x:x + t] = rgb
        if t == 240:
            cv2.putText(sheet, f"filet {g} px", (col * 260 + 10, 330), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.imwrite(out, sheet)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src")
    ap.add_argument("--apercu-filets", help="PNG : planche des largeurs de filet soleil/collines (emblème en une couleur)")
    a = ap.parse_args()
    m = measure(vz.find_src(a.src))
    geo = build(m)
    soleil_detache, off = geo.pop("_soleil_detache"), geo.pop("_off")
    if a.apercu_filets:
        apercu_filets(geo, soleil_detache, off, a.apercu_filets)
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
