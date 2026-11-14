#!/usr/bin/env python
"""Formes alternatives à l'« arche » agrolide : génération des tracés, SANS rien remplacer sur le site.

Usage (depuis agrolide/) :
    python scripts/forme/formes_alternatives.py

Python standard uniquement (aucune dépendance : pas besoin du venv de vectorize.py).

Chaque forme est une FONCTION (largeur, hauteur) -> tracé : les rayons sont proportionnels au petit côté, donc les
courbes restent des vrais arcs (jamais un cercle étiré) dans les quatre formats du comparatif :
    portrait   400 x 500   fenêtre d'image verticale (fiche, portrait)
    paysage    600 x 400   fenêtre d'image horizontale (en-tête de fiche, pilier)
    pastille   240 x 240   chiffre ou date (jour d'événement, numéro d'étape)
    vignette   640 x 360   grande vignette (carte article, formation à la une)

Méthode (comme les autres scripts de ce dossier : tout est calculé, rien n'est posé à la main sur la page) :
  - un tracé SVG propre (lignes, arcs de cercle ou d'ellipse, courbes de Bézier cubiques), importable tel quel
    dans Illustrator (Fichier > Ouvrir) ou Photoshop (calque de forme : coller le SVG) ;
  - les mêmes segments sont échantillonnés pour MESURER : aire, part de la boîte conservée (donc de la photo),
    centre optique du texte et plus grand cercle inscrit (pôle d'inaccessibilité, par balayage de grille).

Sorties :
    public/design-assets/formes-alternatives/<forme>-<format>.svg      (remplissage currentColor)
    src/app/design-system/formes/formes-alternatives.ts                (généré : NE PAS ÉDITER À LA MAIN)
    scripts/forme/formes-alternatives.json                             (mesures de contrôle)
"""
from __future__ import annotations

import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parents[1]
SVG_DIR = APP / "public" / "design-assets" / "formes-alternatives"
TS_OUT = APP / "src" / "app" / "design-system" / "formes" / "formes-alternatives.ts"
# forme retenue le 14/11/2026 (encoche solaire) : tracés consommés par les composants de marque
TS_ENCOCHE = APP / "src" / "components" / "brand" / "encoche-paths.ts"
JSON_OUT = HERE / "formes-alternatives.json"

FORMATS = {
    "portrait": (400, 500),
    "paysage": (600, 400),
    "pastille": (240, 240),
    "vignette": (640, 360),
}


def f(v: float) -> str:
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


# ----------------------------------------------------------------------------- constructeur de tracé


class Path:
    """Enregistre le tracé SVG (d) et ses points échantillonnés (pts), pour la mesure."""

    def __init__(self) -> None:
        self.cmds: list[str] = []
        self.pts: list[tuple[float, float]] = []
        self.cur = (0.0, 0.0)

    def M(self, x: float, y: float) -> "Path":
        self.cmds.append(f"M{f(x)} {f(y)}")
        self.pts.append((x, y))
        self.cur = (x, y)
        return self

    def L(self, x: float, y: float) -> "Path":
        if math.hypot(x - self.cur[0], y - self.cur[1]) < 1e-6:
            return self
        self.cmds.append(f"L{f(x)} {f(y)}")
        self.pts.append((x, y))
        self.cur = (x, y)
        return self

    def C(self, x1: float, y1: float, x2: float, y2: float, x: float, y: float) -> "Path":
        x0, y0 = self.cur
        self.cmds.append(f"C{f(x1)} {f(y1)} {f(x2)} {f(y2)} {f(x)} {f(y)}")
        for i in range(1, 25):
            t = i / 24
            u = 1 - t
            self.pts.append((
                u**3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t**3 * x,
                u**3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t**3 * y,
            ))
        self.cur = (x, y)
        return self

    def arc(self, cx: float, cy: float, rx: float, ry: float, a0: float, a1: float) -> "Path":
        """Arc d'ellipse de centre (cx, cy) entre les angles a0 et a1 (degrés, repère écran : y vers le bas,
        sens positif = horaire). Part du point courant (qui doit être à a0) ; l'arc fait au plus 180 degrés."""
        x = cx + rx * math.cos(math.radians(a1))
        y = cy + ry * math.sin(math.radians(a1))
        sweep = 1 if a1 > a0 else 0
        large = 1 if abs(a1 - a0) > 180 else 0
        self.cmds.append(f"A{f(rx)} {f(ry)} 0 {large} {sweep} {f(x)} {f(y)}")
        n = max(4, int(abs(a1 - a0) / 6))
        for i in range(1, n + 1):
            a = math.radians(a0 + (a1 - a0) * i / n)
            self.pts.append((cx + rx * math.cos(a), cy + ry * math.sin(a)))
        self.cur = (x, y)
        return self

    def start_on_arc(self, cx: float, cy: float, rx: float, ry: float, a0: float) -> "Path":
        return self.M(cx + rx * math.cos(math.radians(a0)), cy + ry * math.sin(math.radians(a0)))

    @property
    def d(self) -> str:
        return "".join(self.cmds) + "Z"


def rounded_polygon(vertices: list[tuple[float, float]], r: float) -> Path:
    """Polygone convexe aux sommets arrondis par des arcs de cercle de rayon r (tangents aux deux côtés)."""
    n = len(vertices)
    p = Path()
    segs = []
    for i in range(n):
        a, b, c = vertices[i - 1], vertices[i], vertices[(i + 1) % n]
        v1 = (a[0] - b[0], a[1] - b[1])
        v2 = (c[0] - b[0], c[1] - b[1])
        l1, l2 = math.hypot(*v1), math.hypot(*v2)
        u1, u2 = (v1[0] / l1, v1[1] / l1), (v2[0] / l2, v2[1] / l2)
        theta = math.acos(max(-1, min(1, u1[0] * u2[0] + u1[1] * u2[1])))  # angle intérieur
        d = r / math.tan(theta / 2)
        t1 = (b[0] + u1[0] * d, b[1] + u1[1] * d)
        t2 = (b[0] + u2[0] * d, b[1] + u2[1] * d)
        bis = (u1[0] + u2[0], u1[1] + u2[1])
        lb = math.hypot(*bis)
        k = r / math.sin(theta / 2)
        ctr = (b[0] + bis[0] / lb * k, b[1] + bis[1] / lb * k)
        a0 = math.degrees(math.atan2(t1[1] - ctr[1], t1[0] - ctr[0]))
        a1 = math.degrees(math.atan2(t2[1] - ctr[1], t2[0] - ctr[0]))
        # plus court chemin entre a0 et a1
        while a1 - a0 > 180:
            a1 -= 360
        while a1 - a0 < -180:
            a1 += 360
        segs.append((t1, t2, ctr, a0, a1))
    p.M(*segs[0][0])
    for i, (t1, t2, ctr, a0, a1) in enumerate(segs):
        if i:
            p.L(*t1)
        p.arc(ctr[0], ctr[1], r, r, a0, a1)
    return p


# ----------------------------------------------------------------------------- les formes


def petale(w: float, h: float) -> dict:
    """Rectangle dont deux coins opposés (haut gauche, bas droite) sont arrondis à presque la demi-largeur,
    les deux autres presque vifs : la lame d'une feuille, une graine posée en diagonale."""
    m = min(w, h)
    R, r = 0.46 * m, 0.07 * m
    p = Path()
    p.start_on_arc(R, R, R, R, 180)
    p.arc(R, R, R, R, 180, 270)
    p.L(w - r, 0)
    p.arc(w - r, r, r, r, 270, 360)
    p.L(w, h - R)
    p.arc(w - R, h - R, R, R, 0, 90)
    p.L(r, h)
    p.arc(r, h - r, r, r, 90, 180)
    p.L(0, R)
    return {"path": p}


def goutte(w: float, h: float) -> dict:
    """Trois coins arrondis à la demi-hauteur, un coin vif (bas gauche) : une goutte ou un pétale plein."""
    m = min(w, h)
    R, r = 0.5 * m, 0.05 * m
    p = Path()
    p.start_on_arc(R, R, R, R, 180)
    p.arc(R, R, R, R, 180, 270)
    p.L(w - R, 0)
    p.arc(w - R, R, R, R, 270, 360)
    p.L(w, h - R)
    p.arc(w - R, h - R, R, R, 0, 90)
    p.L(r, h)
    p.arc(r, h - r, r, r, 90, 180)
    p.L(0, R)
    return {"path": p}


def alveole(w: float, h: float) -> dict:
    """Hexagone aux sommets adoucis : l'alvéole (ruche, pollinisation, parcellaire). Sommet en haut dans les
    formats hauts ou carrés (hexagone régulier au carré), côté plat en haut dans les formats larges."""
    m = min(w, h)
    r = 0.085 * m
    if abs(w - h) < 1e-6:
        R = h / 2
        cx, cy = w / 2, h / 2
        verts = [(cx + R * math.cos(math.radians(a)), cy + R * math.sin(math.radians(a))) for a in range(-90, 270, 60)]
    elif w < h:
        verts = [(w / 2, 0), (w, h * 0.25), (w, h * 0.75), (w / 2, h), (0, h * 0.75), (0, h * 0.25)]
    else:
        verts = [(w * 0.25, 0), (w * 0.75, 0), (w, h / 2), (w * 0.75, h), (w * 0.25, h), (0, h / 2)]
    return {"path": rounded_polygon(verts, r)}


def colline(w: float, h: float) -> dict:
    """Bord supérieur en colline douce : une seule courbe qui monte lentement, culmine à droite du centre puis
    redescend plus court (dune), coins du bas et extrémités arrondis. Le contenu se pose sous la crête."""
    m = min(w, h)
    r = 0.07 * m
    yl, yr = 0.28 * h, 0.15 * h  # hauteur des extrémités gauche et droite
    xs = 0.64 * w  # abscisse de la crête
    p = Path()
    p.M(r, h)
    p.L(w - r, h)
    p.arc(w - r, h - r, r, r, 90, 0)
    p.L(w, yr + r)
    p.arc(w - r, yr + r, r, r, 0, -90)
    p.C(w - 0.14 * w, yr, xs + 0.14 * w, 0, xs, 0)
    p.C(xs - 0.26 * w, 0, 0.20 * w, yl, r, yl)
    p.arc(r, yl + r, r, r, 270, 180)
    p.L(0, h - r)
    p.arc(r, h - r, r, r, 180, 90)
    return {"path": p}


def encoche(w: float, h: float) -> dict:
    """Rectangle aux coins doux dont le coin bas droit est mordu par un quart de cercle concave : le soleil
    qui se lève derrière la parcelle (même langage que l'anneau et le soleil de l'emblème). Un petit disque
    de soleil peut se loger dans l'encoche (`compagnon`).
    Les deux pointes que laisse la morsure (là où l'arc concave rencontre le bord droit et le bord bas) sont
    adoucies par un raccord de rayon f, tangent au bord et à l'arc : demande du 14/11/2026, « un tout petit peu »."""
    m = min(w, h)
    r = 0.09 * m
    b = 0.30 * m
    f = 0.035 * m
    s = math.sqrt(b * b + 2 * b * f)  # distance (selon l'axe) entre le centre de la morsure et le centre du raccord
    # raccord haut (bord droit) : centre (w - f, h - s) ; raccord bas (bord bas) : centre (w - s, h - f)
    a1 = math.degrees(math.atan2(s, f))  # angle, vu du centre du raccord haut, vers le centre de la morsure
    b1 = 360 + math.degrees(math.atan2(-s, -f))  # angle, vu du centre de la morsure, vers le raccord haut
    b2 = 360 + math.degrees(math.atan2(-f, -s))  # angle, vu du centre de la morsure, vers le raccord bas
    a2 = math.degrees(math.atan2(f, s))  # angle, vu du centre du raccord bas, vers le centre de la morsure
    p = Path()
    p.start_on_arc(r, r, r, r, 180)
    p.arc(r, r, r, r, 180, 270)
    p.L(w - r, 0)
    p.arc(w - r, r, r, r, 270, 360)
    p.L(w, h - s)
    p.arc(w - f, h - s, f, f, 0, a1)
    p.arc(w, h, b, b, b1, b2)
    p.arc(w - s, h - f, f, f, a2, 90)
    p.L(r, h)
    p.arc(r, h - r, r, r, 90, 180)
    p.L(0, r)
    return {"path": p, "compagnon": {"cx": w, "cy": h, "r": 0.20 * m}}


def galet(w: float, h: float) -> dict:
    """Quatre coins elliptiques de rayons inégaux (somme des côtés = 1) : un galet ou une graine posée,
    sans arête ni axe de symétrie. L'organique le plus sobre."""
    TL, TR, BR, BL = (0.58, 0.46), (0.42, 0.40), (0.52, 0.60), (0.48, 0.54)
    p = Path()
    p.start_on_arc(TL[0] * w, TL[1] * h, TL[0] * w, TL[1] * h, 180)
    p.arc(TL[0] * w, TL[1] * h, TL[0] * w, TL[1] * h, 180, 270)
    p.arc(w - TR[0] * w, TR[1] * h, TR[0] * w, TR[1] * h, 270, 360)
    p.arc(w - BR[0] * w, h - BR[1] * h, BR[0] * w, BR[1] * h, 0, 90)
    p.arc(BL[0] * w, h - BL[1] * h, BL[0] * w, BL[1] * h, 90, 180)
    return {"path": p}


FORMES = {
    "petale": petale,
    "goutte": goutte,
    "alveole": alveole,
    "colline": colline,
    "encoche": encoche,
    "galet": galet,
}


# ----------------------------------------------------------------------------- mesures


def area_centroid(pts):
    a = cx = cy = 0.0
    n = len(pts)
    for i in range(n):
        x0, y0 = pts[i]
        x1, y1 = pts[(i + 1) % n]
        c = x0 * y1 - x1 * y0
        a += c
        cx += (x0 + x1) * c
        cy += (y0 + y1) * c
    a /= 2
    return abs(a), cx / (6 * a), cy / (6 * a)


def inside(pts, x, y):
    ins = False
    n = len(pts)
    j = n - 1
    for i in range(n):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            ins = not ins
        j = i
    return ins


def dist_seg(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    l2 = dx * dx + dy * dy
    t = 0 if l2 == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / l2))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def pole(pts, w, h, n=56):
    """Pôle d'inaccessibilité : centre du plus grand cercle inscrit (grille puis affinage local)."""
    pts = pts[:: max(1, len(pts) // 160)]

    def d_edge(x, y):
        return min(dist_seg(x, y, *pts[i], *pts[(i + 1) % len(pts)]) for i in range(len(pts)))

    best = (0.0, w / 2, h / 2)
    for iy in range(n + 1):
        for ix in range(n + 1):
            x, y = w * ix / n, h * iy / n
            if inside(pts, x, y):
                d = d_edge(x, y)
                if d > best[0]:
                    best = (d, x, y)
    step = max(w, h) / n
    for _ in range(4):
        d0, x0, y0 = best
        for iy in range(-6, 7):
            for ix in range(-6, 7):
                x, y = x0 + ix * step / 6, y0 + iy * step / 6
                if inside(pts, x, y):
                    d = d_edge(x, y)
                    if d > best[0]:
                        best = (d, x, y)
        step /= 4
    return best


def bande_texte(pts, w, h, y0=0.60, y1=0.92, marge=0.04):
    """Plus longue plage horizontale (en % de la largeur) qui reste DANS la forme sur toute la bande de hauteur
    [y0 h, y1 h] : l'endroit où un titre peut se poser sans toucher le bord. Marge de 4 % de chaque côté."""
    ys = [h * (y0 + (y1 - y0) * i / 6) for i in range(7)]
    n = 240
    ok = [all(inside(pts, w * (ix + 0.5) / n, y) for y in ys) for ix in range(n)]
    best, run = (0, 0), None
    for i, v in enumerate(ok + [False]):
        if v and run is None:
            run = i
        if not v and run is not None:
            if i - run > best[1] - best[0]:
                best = (run, i)
            run = None
    a, b = best[0] / n + marge, best[1] / n - marge
    return [round(a * 100, 1), round(max(a, b) * 100, 1)]


# ----------------------------------------------------------------------------- sorties


def main() -> None:
    SVG_DIR.mkdir(parents=True, exist_ok=True)
    TS_OUT.parent.mkdir(parents=True, exist_ok=True)
    out: dict = {}
    mesures: dict = {}
    for nom, fn in FORMES.items():
        out[nom] = {}
        mesures[nom] = {}
        for fmt, (w, h) in FORMATS.items():
            res = fn(w, h)
            p: Path = res["path"]
            aire, gx, gy = area_centroid(p.pts)
            d_in, px, py = pole(p.pts, w, h)
            entree = {
                "w": w,
                "h": h,
                "d": p.d,
                # part de la boîte que la forme laisse voir (donc de la photo conservée)
                "conserve": round(aire / (w * h) * 100, 1),
                # centre de gravité et centre du plus grand cercle inscrit, en % de la boîte
                "gravite": [round(gx / w * 100, 1), round(gy / h * 100, 1)],
                "inscrit": [round(px / w * 100, 1), round(py / h * 100, 1)],
                # diamètre du plus grand cercle inscrit, en % du petit côté
                "diametre": round(2 * d_in / min(w, h) * 100, 1),
            }
            if fmt == "vignette":
                entree["texte"] = bande_texte(p.pts, w, h)
            if "compagnon" in res:
                c = res["compagnon"]
                entree["compagnon"] = {"cx": round(c["cx"], 2), "cy": round(c["cy"], 2), "r": round(c["r"], 2)}
            out[nom][fmt] = entree
            mesures[nom][fmt] = {k: v for k, v in entree.items() if k != "d"}
            svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><path d="{p.d}" fill="currentColor"/></svg>\n'
            (SVG_DIR / f"{nom}-{fmt}.svg").write_text(svg, encoding="utf-8")
    ts = (
        "// Fichier généré par scripts/forme/formes_alternatives.py — NE PAS ÉDITER À LA MAIN.\n"
        "// Formes alternatives à l'arche : tracés par format (rayons proportionnels au petit côté) et mesures.\n\n"
        "export interface FormeFormat {\n"
        "  w: number\n  h: number\n  d: string\n"
        "  /** Part de la boîte visible (donc de la photo conservée), en % */\n  conserve: number\n"
        "  /** Centre de gravité, en % de la boîte */\n  gravite: [number, number]\n"
        "  /** Centre du plus grand cercle inscrit (centre optique du texte), en % de la boîte */\n  inscrit: [number, number]\n"
        "  /** Diamètre du plus grand cercle inscrit, en % du petit côté */\n  diametre: number\n"
        "  /** Vignette : plage horizontale sûre pour un titre (bande de 60 à 92 % de la hauteur), en % */\n  texte?: [number, number]\n"
        "  compagnon?: { cx: number; cy: number; r: number }\n}\n\n"
        "export type FormeId = " + " | ".join(f"'{k}'" for k in FORMES) + "\n"
        "export type FormatId = " + " | ".join(f"'{k}'" for k in FORMATS) + "\n\n"
        "export const FORMES_ALTERNATIVES: Record<FormeId, Record<FormatId, FormeFormat>> = "
        + json.dumps(out, ensure_ascii=False, indent=1)
        + "\n"
    )
    TS_OUT.write_text(ts, encoding="utf-8")
    ts_enc = (
        "// Fichier généré par scripts/forme/formes_alternatives.py — NE PAS ÉDITER À LA MAIN.\n"
        "// Encoche solaire (forme retenue le 14/11/2026) : un tracé par format, rayons proportionnels au petit côté.\n"
        "// `inscrit` = centre optique du texte (centre du plus grand cercle inscrit), en % de la boîte ;\n"
        "// `compagnon` = disque du quart de soleil logé dans l'encoche, en unités du viewBox.\n\n"
        "export interface EncocheFormat {\n  w: number\n  h: number\n  d: string\n  inscrit: [number, number]\n"
        "  compagnon: { cx: number; cy: number; r: number }\n}\n\n"
        "export type EncocheFormatId = " + " | ".join(f"'{k}'" for k in FORMATS) + "\n\n"
        "export const ENCOCHE: Record<EncocheFormatId, EncocheFormat> = "
        + json.dumps(
            {k: {x: v for x, v in out["encoche"][k].items() if x in ("w", "h", "d", "inscrit", "compagnon")} for k in FORMATS},
            ensure_ascii=False,
            indent=1,
        )
        + "\n"
    )
    TS_ENCOCHE.write_text(ts_enc, encoding="utf-8")
    JSON_OUT.write_text(json.dumps(mesures, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(FORMES)} formes x {len(FORMATS)} formats -> {SVG_DIR}, {TS_OUT.relative_to(APP)}")
    for nom in FORMES:
        print(
            f"  {nom:9s}",
            "  ".join(f"{fmt}: conserve {mesures[nom][fmt]['conserve']}% cercle {mesures[nom][fmt]['diametre']}%" for fmt in FORMATS),
        )


if __name__ == "__main__":
    main()
