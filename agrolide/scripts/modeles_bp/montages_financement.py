# -*- coding: utf-8 -*-
"""
Module « Choisir son financement » : le même projet financé de quatre façons (hypothèses PÉDAGOGIQUES : taux, frais, durées et
subvention sont des exemples, à remplacer par les offres écrites de vos financeurs, avec date et source).
Usage : python scripts/modeles_bp/montages_financement.py [--json sortie.json]
"""
import json
import sys

from cas_chiffres import pmt

COUT = 80.0          # M FCFA : 70,0 d'investissements dont 60,0 de matériel + 10,0 de besoin en fonds de roulement
MATERIEL = 60.0
EBE = 20.0           # M FCFA par an en croisière (avant impôt)
ANS = 7


def annuites(emprunt, taux, duree, differe):
    """Échéancier : seuls les intérêts pendant le différé, puis annuité constante. Renvoie la liste des services annuels."""
    n = duree - differe
    ann = pmt(taux, n, emprunt)
    cap, out = emprunt, []
    for y in range(1, ANS + 1):
        inte = cap * taux
        remb = 0.0 if y <= differe or y > duree else ann - inte
        out.append(inte + remb)
        cap -= remb
    return out


def montage(nom, **p):
    apport, dette = p.get("apport", 0.0), p.get("dette", 0.0)
    subvention, frais = p.get("subvention", 0.0), p.get("frais", 0.0)
    if p.get("bail"):
        # crédit-bail du matériel : loyers constants sur la durée du bail
        loyers = [pmt(p["bail_taux"], p["bail_duree"], MATERIEL)] * p["bail_duree"] + [0.0] * (ANS - p["bail_duree"])
    else:
        loyers = [0.0] * ANS
    service = annuites(dette, p["taux"], p["duree"], p["differe"]) if dette > 0 else [0.0] * ANS
    total = [s + l for s, l in zip(service, loyers)]
    dscr = [EBE / t if t > 0 else None for t in total]
    cout_fin = sum(total) + frais - (dette + (MATERIEL if p.get("bail") else 0.0))
    return dict(nom=nom, apport=apport, dette=dette, subvention=subvention, frais=frais, service=total, dscr=dscr, cout_financement=cout_fin,
                dscr_an2=dscr[1], service_an2=total[1], service_an1=total[0])


def tous():
    m = {}
    # A. Banque seule : apport 30 %, 10 % sur 7 ans avec 1 an de différé
    m["A"] = montage("Prêt bancaire seul", apport=0.30 * COUT, dette=0.70 * COUT, taux=0.10, duree=7, differe=1)
    # B. Banque avec garantie : apport 20 %, frais de garantie de 1,5 % du prêt payés une fois
    dette_b = 0.80 * COUT
    m["B"] = montage("Prêt bancaire avec fonds de garantie", apport=0.20 * COUT, dette=dette_b, taux=0.10, duree=7, differe=1, frais=0.015 * dette_b)
    # C. Crédit-bail du matériel (60) sur 5 ans à 12 % implicite ; apport de 20 pour le reste (bâtiment, besoin en fonds de roulement)
    m["C"] = montage("Crédit-bail du matériel", apport=COUT - MATERIEL, dette=0.0, taux=0.0, duree=1, differe=0, bail=True, bail_taux=0.12, bail_duree=5)
    # D. Subvention de 20 % de l'investissement (16) + banque : apport 15 % du coût, prêt pour le reste
    sub = 0.20 * COUT
    apport_d = 0.15 * COUT
    m["D"] = montage("Subvention de 20 % et prêt bancaire", apport=apport_d, dette=COUT - sub - apport_d, subvention=sub, taux=0.10, duree=7, differe=1)
    return m


if __name__ == "__main__":
    res = tous()
    for k, v in res.items():
        print(k, v["nom"], f"apport {v['apport']:.1f} dette {v['dette']:.1f} sub {v['subvention']:.1f} frais {v['frais']:.2f}")
        print("   service", [round(x, 2) for x in v["service"]])
        print("   DSCR  ", [None if d is None else round(d, 2) for d in v["dscr"]], f"coût du financement {v['cout_financement']:.1f}")
    if "--json" in sys.argv:
        with open(sys.argv[sys.argv.index("--json") + 1], "w", encoding="utf-8") as f:
            json.dump(res, f, ensure_ascii=False, indent=1)
