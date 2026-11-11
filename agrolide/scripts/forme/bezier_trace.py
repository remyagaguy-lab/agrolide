"""Tracé vectoriel de précision : champ de couverture -> contours sous-pixel -> courbes de Bézier cubiques.

Dépendances : numpy, opencv (cv2), contourpy.

Pipeline
1. suréchantillonnage bicubique du champ de couverture (0..1) puis contour au niveau 0,5
   (marching squares, interpolation linéaire sous-pixel) ;
2. ré-échantillonnage à pas constant, lissage gaussien circulaire léger ;
3. détection des angles vifs (virage important sur une fenêtre très courte) ;
4. ajustement de Schneider (moindres carrés + reparamétrage de Newton), tangentes
   partagées aux jointures (continuité G1), fusion des segments redondants.
"""
from __future__ import annotations

import cv2
import numpy as np
from contourpy import contour_generator

# ----------------------------------------------------------------------------- contours


def upsample_field(field: np.ndarray, up: int = 4) -> np.ndarray:
    """Suréchantillonnage bicubique avec marge nulle de 2 px (les contours restent fermés)."""
    f = np.pad(field.astype(np.float32), 2, mode="constant", constant_values=0.0)
    h, w = f.shape
    return cv2.resize(f, (w * up, h * up), interpolation=cv2.INTER_CUBIC)


def trace_rings(field: np.ndarray, level: float = 0.5, up: int = 4, origin=(0.0, 0.0), big=None):
    """Contours fermés du champ `field` (~0..1) au niveau `level`.

    Coordonnées en pixels de la source (centre du pixel i = i + 0,5), décalées de `origin`.
    `big` : champ déjà suréchantillonné par `upsample_field` (même `up`), pour les combinaisons de champs.
    """
    if big is None:
        big = upsample_field(field, up)
    h, w = big.shape[0] // up, big.shape[1] // up
    xs = (np.arange(w * up) + 0.5) / up - 2.0
    ys = (np.arange(h * up) + 0.5) / up - 2.0
    gen = contour_generator(xs, ys, big)
    rings = []
    for line in gen.lines(level):
        line = np.asarray(line, dtype=np.float64)
        if len(line) < 8:
            continue
        if np.allclose(line[0], line[-1]):
            line = line[:-1]
        rings.append(line - np.array(origin))
    return rings


def ring_area(p: np.ndarray) -> float:
    x, y = p[:, 0], p[:, 1]
    return 0.5 * float(np.sum(x * np.roll(y, -1) - np.roll(x, -1) * y))


def resample_closed(p: np.ndarray, step: float) -> np.ndarray:
    q = np.vstack([p, p[:1]])
    seg = np.linalg.norm(np.diff(q, axis=0), axis=1)
    s = np.concatenate([[0], np.cumsum(seg)])
    total = s[-1]
    n = max(int(round(total / step)), 16)
    t = np.linspace(0, total, n, endpoint=False)
    return np.column_stack([np.interp(t, s, q[:, 0]), np.interp(t, s, q[:, 1])])


def smooth_closed(p: np.ndarray, sigma_samples: float) -> np.ndarray:
    if sigma_samples <= 0:
        return p
    r = int(np.ceil(4 * sigma_samples))
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma_samples) ** 2)
    k /= k.sum()
    out = np.empty_like(p)
    for c in range(p.shape[1]):
        ext = np.pad(p[:, c], r, mode="wrap")
        out[:, c] = np.convolve(ext, k, mode="valid")
    return out


def _second_derivative(p, step):
    return (np.roll(p, -1, axis=0) - 2 * p + np.roll(p, 1, axis=0)) / (step * step)


def smooth_adaptive(p: np.ndarray, step: float, s_small: float, s_big: float, r_lo: float = 14.0, r_hi: float = 45.0):
    """Lissage dépendant de la courbure (rayons en px de la source).

    Les portions douces (rayon > r_hi) sont lissées fortement (s_big) pour gommer l'ondulation de la
    source ; les extrémités arrondies et les coins (rayon < r_lo) ne le sont presque pas (s_small).
    Le rétrécissement du lissage gaussien (p_σ ≈ p + σ²/2 · p'') est compensé.
    """
    small = smooth_closed(p, s_small / step)
    big = smooth_closed(p, s_big / step)
    # corrections de biais (premier ordre)
    small = small - (s_small**2 / 2) * _second_derivative(small, step)
    big = big - (s_big**2 / 2) * _second_derivative(smooth_closed(big, 1.0 / step), step)
    # courbure locale (Menger) sur la version peu lissée
    # (échelle de 5 px : insensible aux marches d'escalier de la source, qui ont ~10 px de période)
    mid = smooth_closed(p, 5.0 / step)
    k = max(int(round(10.0 / step)), 1)
    a, b, c = np.roll(mid, k, axis=0), mid, np.roll(mid, -k, axis=0)
    ab, bc, ca = np.linalg.norm(b - a, axis=1), np.linalg.norm(c - b, axis=1), np.linalg.norm(a - c, axis=1)
    area2 = np.abs((b[:, 0] - a[:, 0]) * (c[:, 1] - a[:, 1]) - (b[:, 1] - a[:, 1]) * (c[:, 0] - a[:, 0]))
    kappa = 2 * area2 / (ab * bc * ca + 1e-12)
    kappa = smooth_closed(kappa[:, None], 4.0 / step)[:, 0]
    # le poids « fort » est étendu aux voisins : un coin garde sa zone protégée
    lo, hi = 1 / r_hi, 1 / r_lo
    w = np.clip((kappa - lo) / (hi - lo), 0, 1)
    w = smooth_closed(np.maximum.reduce([w, np.roll(w, 8), np.roll(w, -8)])[:, None], 3.0 / step)[:, 0]
    return big * (1 - w)[:, None] + small * w[:, None]


def detect_corners(p: np.ndarray, step: float, win_px: float, angle_deg: float):
    """Indices des angles vifs : virage supérieur à angle_deg sur une fenêtre de ±win_px."""
    n = len(p)
    w = max(int(round(win_px / step)), 1)
    a = p - np.roll(p, w, axis=0)
    b = np.roll(p, -w, axis=0) - p
    cosang = np.sum(a * b, 1) / (np.linalg.norm(a, axis=1) * np.linalg.norm(b, axis=1) + 1e-12)
    ang = np.degrees(np.arccos(np.clip(cosang, -1, 1)))
    idx = np.where(ang > angle_deg)[0]
    if len(idx) == 0:
        return [], ang
    groups, cur = [], [idx[0]]
    for j in idx[1:]:
        if j - cur[-1] <= 2 * w:
            cur.append(j)
        else:
            groups.append(cur)
            cur = [j]
    groups.append(cur)
    if len(groups) > 1 and (groups[0][0] + n - groups[-1][-1]) <= 2 * w:
        groups[0] = groups[-1] + groups[0]
        groups.pop()
    corners = []
    for g in groups:
        g = np.array(g)
        corners.append(int(g[np.argmax(ang[g % n])] % n))
    return sorted(set(corners)), ang


# ----------------------------------------------------------------------------- Schneider


def bez_eval(ctrl, t):
    t = np.asarray(t)[:, None]
    mt = 1 - t
    return mt**3 * ctrl[0] + 3 * mt**2 * t * ctrl[1] + 3 * mt * t**2 * ctrl[2] + t**3 * ctrl[3]


def _d1(ctrl, t):
    t = np.asarray(t)[:, None]
    mt = 1 - t
    return 3 * mt**2 * (ctrl[1] - ctrl[0]) + 6 * mt * t * (ctrl[2] - ctrl[1]) + 3 * t**2 * (ctrl[3] - ctrl[2])


def _d2(ctrl, t):
    t = np.asarray(t)[:, None]
    return 6 * (1 - t) * (ctrl[2] - 2 * ctrl[1] + ctrl[0]) + 6 * t * (ctrl[3] - 2 * ctrl[2] + ctrl[1])


def _chord(pts):
    d = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    u = np.concatenate([[0], np.cumsum(d)])
    return u / u[-1] if u[-1] > 0 else u


def _generate(pts, u, t1, t2):
    p0, p3 = pts[0], pts[-1]
    A1 = (3 * (1 - u) ** 2 * u)[:, None] * t1
    A2 = (3 * (1 - u) * u**2)[:, None] * t2
    b0, b1, b2, b3 = (1 - u) ** 3, 3 * (1 - u) ** 2 * u, 3 * (1 - u) * u**2, u**3
    C = np.array([[np.sum(A1 * A1), np.sum(A1 * A2)], [np.sum(A1 * A2), np.sum(A2 * A2)]])
    tmp = pts - (p0 * (b0 + b1)[:, None] + p3 * (b2 + b3)[:, None])
    X = np.array([np.sum(A1 * tmp), np.sum(A2 * tmp)])
    det = C[0, 0] * C[1, 1] - C[0, 1] * C[1, 0]
    seg = np.linalg.norm(p3 - p0)
    if abs(det) > 1e-12:
        a1 = (X[0] * C[1, 1] - X[1] * C[0, 1]) / det
        a2 = (C[0, 0] * X[1] - C[1, 0] * X[0]) / det
    else:
        a1 = a2 = 0.0
    if a1 < 1e-6 * seg or a2 < 1e-6 * seg:
        a1 = a2 = seg / 3
    return np.array([p0, p0 + t1 * a1, p3 + t2 * a2, p3])


def _reparam(ctrl, pts, u):
    d = bez_eval(ctrl, u) - pts
    d1, d2 = _d1(ctrl, u), _d2(ctrl, u)
    num = np.sum(d * d1, 1)
    den = np.sum(d1 * d1, 1) + np.sum(d * d2, 1)
    with np.errstate(divide="ignore", invalid="ignore"):
        un = np.where(np.abs(den) > 1e-12, u - num / den, u)
    return np.clip(un, 0, 1)


def _max_err(ctrl, pts, u):
    d = np.linalg.norm(bez_eval(ctrl, u) - pts, axis=1)
    i = int(np.argmax(d))
    return float(d[i]), i


def _unit(v):
    return v / (np.linalg.norm(v) + 1e-12)


def fit_cubic(pts, t1, t2, tol):
    n = len(pts)
    if n == 2:
        dist = np.linalg.norm(pts[1] - pts[0]) / 3
        return [np.array([pts[0], pts[0] + t1 * dist, pts[1] + t2 * dist, pts[1]])]
    u = _chord(pts)
    ctrl = _generate(pts, u, t1, t2)
    err, split = _max_err(ctrl, pts, u)
    if err < tol:
        return [ctrl]
    if err < tol * 8:
        for _ in range(30):
            u = _reparam(ctrl, pts, u)
            ctrl = _generate(pts, u, t1, t2)
            err, split = _max_err(ctrl, pts, u)
            if err < tol:
                return [ctrl]
    split = min(max(split, 1), n - 2)
    tc = _unit(pts[split - 1] - pts[split + 1])
    return fit_cubic(pts[: split + 1], t1, tc, tol) + fit_cubic(pts[split:], -tc, t2, tol)


def fit_open(pts, tol, t_start=None, t_end=None):
    k = min(4, len(pts) - 1)
    t1 = _unit(pts[k] - pts[0]) if t_start is None else t_start
    t2 = _unit(pts[-1 - k] - pts[-1]) if t_end is None else t_end
    return fit_cubic(pts, t1, t2, tol)


def fit_ring(p: np.ndarray, corners: list[int], tol: float):
    """Anneau fermé échantillonné -> (segments cubiques, drapeaux « angle vif au début du segment »)."""
    n = len(p)
    if not corners:
        t = _unit(p[1] - p[-1])
        segs = fit_open(np.vstack([p, p[:1]]), tol, t, -t)
        return segs, [False] * len(segs)
    corners = sorted(corners)
    segs, flags = [], []
    for ci, a in enumerate(corners):
        b = corners[(ci + 1) % len(corners)]
        idx = list(range(a, n)) + list(range(0, b + 1)) if b <= a else list(range(a, b + 1))
        s = fit_open(p[idx], tol)
        segs.extend(s)
        flags.extend([True] + [False] * (len(s) - 1))
    return segs, flags


def merge_segments(segs, flags, tol):
    """Fusionne des segments adjacents lisses si un unique cubique les représente à `tol` près."""
    segs, flags = list(segs), list(flags)
    ts = np.linspace(0, 1, 50)
    changed = True
    while changed and len(segs) > 2:
        changed = False
        i = 0
        while i < len(segs) and len(segs) > 2:
            j = (i + 1) % len(segs)
            if flags[j]:
                i += 1
                continue
            pts = np.vstack([bez_eval(segs[i], ts), bez_eval(segs[j], ts)[1:]])
            c = fit_cubic(pts, _unit(segs[i][1] - segs[i][0]), _unit(segs[j][2] - segs[j][3]), tol)
            if len(c) == 1:
                segs[i] = c[0]
                del segs[j], flags[j]
                changed = True
                if j < i:
                    i -= 1
            else:
                i += 1
    return segs, flags


def sample_segments(segs, per=80):
    ts = np.linspace(0, 1, per, endpoint=False)
    return np.vstack([bez_eval(s, ts) for s in segs])


def fmt(v, nd=2):
    s = f"{v:.{nd}f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def path_data(segs, ox=0.0, oy=0.0, nd=2):
    d = [f"M{fmt(segs[0][0][0] - ox, nd)} {fmt(segs[0][0][1] - oy, nd)}"]
    for s in segs:
        d.append("C" + " ".join(f"{fmt(q[0] - ox, nd)} {fmt(q[1] - oy, nd)}" for q in s[1:]))
    d.append("Z")
    return "".join(d)


def trace_field(field, level=0.5, up=4, origin=(0, 0), step=0.5, sigma_px=1.5,
                corner_win=1.5, corner_angle=48.0, tol=0.3, min_area=30.0, big=None, sigma_big=None,
                r_lo=14.0, r_hi=45.0):
    """Renvoie une liste d'anneaux : {'segs','flags','area','raw','corners'}."""
    out = []
    for r in trace_rings(field, level, up, origin, big):
        if abs(ring_area(r)) < min_area:
            continue
        rs = resample_closed(r, step)
        sm = (smooth_adaptive(rs, step, sigma_px, sigma_big, r_lo, r_hi) if sigma_big
              else smooth_closed(rs, sigma_px / step))
        corners, _ = detect_corners(smooth_closed(rs, 0.6 / step), step, corner_win, corner_angle)
        segs, flags = fit_ring(sm, corners, tol)
        segs, flags = merge_segments(segs, flags, tol)
        out.append({"segs": segs, "flags": flags, "area": ring_area(r), "raw": rs, "corners": corners})
    return out
