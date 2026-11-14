# -*- coding: utf-8 -*-
"""Gabarit Excel « Choisir son financement » : comparer quatre montages pour le même projet (hypothèses pédagogiques
de scripts/modeles_bp/montages_financement.py, à remplacer par les offres écrites de vos financeurs).
Usage : python scripts/modeles_bp/build_gabarit_financement.py ; puis recalculer avec recalc_excel.ps1."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-financement.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)
TITRE = Font(bold=True, size=13)

wb = Workbook()

# ------------------------------------------------------------ Projet
p = wb.active
p.title = "Projet"
p["A1"] = "Le projet à financer (cellules vertes = à remplacer par vos chiffres), en millions de FCFA"; p["A1"].font = TITRE
for i, (lib, v) in enumerate([("Coût total du projet (investissements + besoin en fonds de roulement)", 80.0), ("dont matériel finançable en crédit-bail", 60.0),
                              ("EBE annuel de croisière (avant impôt)", 20.0)], start=3):
    p.cell(i, 1, lib); x = p.cell(i, 2, v); x.fill = VERT; x.number_format = "0.0"
p["A7"] = "Le DSCR de cette feuille est simplifié : EBE ÷ service de la dette (avant impôt). Pour votre dossier, utilisez le DSCR du modèle financier."
p.column_dimensions["A"].width = 74; p.column_dimensions["B"].width = 14

# ------------------------------------------------------------ Montages
m = wb.create_sheet("Montages")
m["A1"] = "Quatre montages pour le même projet (cellules vertes = offres de vos financeurs, avec date et source)"; m["A1"].font = TITRE
noms = ["A. Prêt bancaire seul", "B. Prêt avec fonds de garantie", "C. Crédit-bail du matériel", "D. Subvention et prêt"]
m["A3"] = "Hypothèses du montage"; m["A3"].font = GRAS
for j, n in enumerate(noms, start=2):
    m.cell(3, j, n).font = GRAS
entrees = [
    ("Part d'apport (% du coût)", [0.30, 0.20, 0.25, 0.15], "0%"),
    ("Subvention (% du coût)", [0.0, 0.0, 0.0, 0.20], "0%"),
    ("Crédit-bail du matériel (1 = oui, 0 = non)", [0, 0, 1, 0], "0"),
    ("Taux du prêt", [0.10, 0.10, 0.0, 0.10], "0.0%"),
    ("Durée du prêt (ans)", [7, 7, 0, 7], "0"),
    ("Différé (ans, intérêts seuls)", [1, 1, 0, 1], "0"),
    ("Frais de garantie (% du prêt, payés une fois)", [0.0, 0.015, 0.0, 0.0], "0.0%"),
    ("Taux implicite du crédit-bail", [0.0, 0.0, 0.12, 0.0], "0.0%"),
    ("Durée du crédit-bail (ans)", [0, 0, 5, 0], "0"),
]
for i, (lib, vals, fmt) in enumerate(entrees, start=4):
    m.cell(i, 1, lib)
    for j, v in enumerate(vals, start=2):
        x = m.cell(i, j, v); x.fill = VERT; x.number_format = fmt
m["A14"] = "Résultats calculés (M FCFA)"; m["A14"].font = GRAS
cols = "BCDE"
calc = [
    (15, "Apport", "={c}4*Projet!$B$3", "0.0"),
    (16, "Subvention", "={c}5*Projet!$B$3", "0.0"),
    (17, "Prêt", "=IF({c}6=1,0,Projet!$B$3-{c}15-{c}16)", "0.0"),
    (18, "Frais de garantie", "={c}10*{c}17", "0.00"),
    (19, "Loyer annuel du crédit-bail", "=IF({c}6=1,PMT({c}11,{c}12,-Projet!$B$4),0)", "0.00"),
    (20, "Annuité du prêt (après le différé)", "=IF({c}17=0,0,PMT({c}7,{c}8-{c}9,-{c}17))", "0.00"),
]
for r, lib, f, fmt in calc:
    m.cell(r, 1, lib)
    for c in cols:
        x = m[f"{c}{r}"]; x.value = f.format(c=c); x.number_format = fmt; x.fill = GRIS
m["A22"] = "Service de la dette par année (M FCFA)"; m["A22"].font = GRAS
for y in range(1, 8):
    r = 22 + y
    m.cell(r, 1, f"Année {y}")
    for c in cols:
        f = (f"=IF({c}$17=0,0,IF({y}<={c}$9,{c}$17*{c}$7,IF({y}<={c}$8,{c}$20,0)))+IF(AND({c}$6=1,{y}<={c}$12),{c}$19,0)")
        x = m[f"{c}{r}"]; x.value = f; x.number_format = "0.00"; x.fill = GRIS
m["A31"] = "DSCR simplifié par année"; m["A31"].font = GRAS
for y in range(1, 8):
    r = 31 + y
    m.cell(r, 1, f"Année {y}")
    for c in cols:
        x = m[f"{c}{r}"]; x.value = f'=IF({c}{22 + y}=0,"n.d.",Projet!$B$5/{c}{22 + y})'; x.number_format = "0.00"; x.fill = GRIS
m["A40"] = "Comparaison"; m["A40"].font = GRAS
comp = [
    (41, "Somme des paiements au financeur (service + frais)", "=SUM({c}23:{c}29)+{c}18", "0.0"),
    (42, "Montant financé par le prêt ou le crédit-bail", "={c}17+IF({c}6=1,Projet!$B$4,0)", "0.0"),
    (43, "Coût du financement (paiements moins montant financé)", "={c}41-{c}42", "0.0"),
    (44, "Coût du financement par million financé", "=IF({c}42=0,0,{c}43/{c}42)", "0.00"),
    (45, "DSCR de l'année 2", "={c}33", "0.00"),
    (46, "Contrôle : apport + subvention + financement = coût du projet", "={c}15+{c}16+{c}42-Projet!$B$3", "0.0"),
]
for r, lib, f, fmt in comp:
    m.cell(r, 1, lib)
    for c in cols:
        x = m[f"{c}{r}"]; x.value = f.format(c=c); x.number_format = fmt; x.fill = GRIS
m["A48"] = "Un coût du financement plus bas ne veut pas dire un meilleur montage : comparez aussi la durée, le DSCR de l'année 2 et ce que le financeur exige (garanties, délais)."
m.column_dimensions["A"].width = 62
for c in cols:
    m.column_dimensions[c].width = 28

wb.save(SORTIE)
print("écrit", SORTIE)
