# -*- coding: utf-8 -*-
"""Série de prix FICTIVE (pédagogique) pour la leçon « Prix et saisonnalité » : calcule l'indice saisonnier, la volatilité et un prix prudent.
Les chiffres ne sont pas des relevés de marché. Usage : python scripts/modeles_bp/prix_saisonnalite.py"""
import statistics as st

MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
SERIES = {
    "Année 1": [190, 196, 204, 214, 224, 236, 246, 232, 210, 188, 176, 178],
    "Année 2": [205, 212, 222, 236, 250, 262, 274, 255, 226, 200, 186, 190],
    "Année 3": [182, 186, 192, 200, 208, 218, 226, 214, 196, 178, 168, 170],
}
RECOLTE = (10, 11)      # indices 0-based : novembre et décembre
SOUDURE = (5, 6)        # juin et juillet


def calcule():
    moy_an = {a: st.mean(v) for a, v in SERIES.items()}
    indice = [st.mean(SERIES[a][m] / moy_an[a] for a in SERIES) for m in range(12)]
    tout = [x for v in SERIES.values() for x in v]
    moy, sd = st.mean(tout), st.stdev(tout)
    rec = [SERIES[a][m] for a in SERIES for m in RECOLTE]
    sou = [SERIES[a][m] for a in SERIES for m in SOUDURE]
    moy_rec, sd_rec, moy_sou = st.mean(rec), st.stdev(rec), st.mean(sou)
    ecart_an = {a: st.mean(SERIES[a][m] for m in SOUDURE) / st.mean(SERIES[a][m] for m in RECOLTE) - 1 for a in SERIES}
    return dict(moy_an=moy_an, indice=indice, moy=moy, sd=sd, cv=sd / moy, mn=min(tout), mx=max(tout), moy_rec=moy_rec, sd_rec=sd_rec,
                prudent=moy_rec - sd_rec, moy_sou=moy_sou, ecart=moy_sou / moy_rec - 1, ecart_an=ecart_an,
                rec_an={a: st.mean(SERIES[a][m] for m in RECOLTE) for a in SERIES})


if __name__ == "__main__":
    r = calcule()
    for k, v in r.items():
        print(k, [round(x, 3) for x in v] if isinstance(v, list) else ({a: round(x, 3) for a, x in v.items()} if isinstance(v, dict) else round(v, 3)))
