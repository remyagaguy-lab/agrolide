# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Maraîchage » (hypothèses du cas maraichage-benin, à remplacer par les vôtres).
Usage : python scripts/modeles_bp/build_gabarit_maraichage.py ; puis recalculer avec recalc_excel.ps1."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-maraichage.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)

wb = Workbook()

# ------------------------------------------------------------ Cultures (jusqu'à 5 cultures)
c = wb.active
c.title = "Cultures"
c["A1"] = "Plan de cultures (cellules vertes = à remplacer par vos relevés datés)"; c["A1"].font = Font(bold=True, size=13)
ent = ["Culture", "Surface (ha)", "Cycles par an", "Rendement (t/ha)", "Prix (FCFA/kg)", "Intrants (M FCFA / ha / cycle)",
       "Hectares-cycles", "Production brute (t)", "CA brut (M FCFA)", "Intrants annuels (M FCFA)"]
for j, t in enumerate(ent, start=1):
    x = c.cell(3, j, t); x.font = GRAS; x.alignment = Alignment(wrap_text=True)
exemples = [("Tomate", 1.5, 1, 25, 250, 1.6), ("Chou", 1.5, 2, 30, 180, 1.0), (None,) * 6, (None,) * 6, (None,) * 6]
for i, ex in enumerate(exemples, start=4):
    for j, v in enumerate(ex, start=1):
        x = c.cell(i, j, v)
        if j <= 6: x.fill = VERT
    c.cell(i, 7, f"=B{i}*C{i}"); c.cell(i, 8, f"=G{i}*D{i}")
    c.cell(i, 9, f"=H{i}*E{i}/1000"); c.cell(i, 10, f"=G{i}*F{i}")
    for j in range(7, 11): c.cell(i, j).fill = GRIS
c["A10"] = "Total"; c["A10"].font = GRAS
for col in "BGHIJ": c[f"{col}10"] = f"=SUM({col}4:{col}8)"
c["A12"] = "Intensité culturale (hectares-cycles ÷ surface)"; c["B12"] = "=IF(B10=0,0,G10/B10)"; c["B12"].number_format = "0%"
for i in range(4, 11):
    for col in "BGHIJ": c[f"{col}{i}"].number_format = "0.0"
c.column_dimensions["A"].width = 44
for col in "BCDEFGHIJ": c.column_dimensions[col].width = 16
c.row_dimensions[3].height = 45

# ------------------------------------------------------------ Hypothèses générales
h = wb.create_sheet("Hypothèses")
h["A1"] = "Autres hypothèses (cellules vertes = à remplacer)"; h["A1"].font = Font(bold=True, size=13)
lignes = [
    ("Pertes après récolte", 0.10, "% de la production brute"),
    ("Main-d'œuvre saisonnière", 4.0, "M FCFA par an"),
    ("Caisses, emballages et transport", 1.6, "M FCFA par an"),
    ("Eau et énergie", 1.2, "M FCFA par an"),
    ("Personnel permanent", 3.0, "M FCFA par an"),
    ("Charges fixes (assurance, entretien, comptabilité)", 1.2, "M FCFA par an"),
    ("Amortissements annuels", 2.26, "M FCFA par an"),
    ("Intérêts annuels (année de croisière)", 1.44, "M FCFA par an"),
]
for i, (lib, val, unite) in enumerate(lignes, start=3):
    h.cell(i, 1, lib); x = h.cell(i, 2, val); x.fill = VERT; h.cell(i, 3, unite)
    if lib.startswith("Pertes"): x.number_format = "0%"
h.column_dimensions["A"].width = 52; h.column_dimensions["B"].width = 14; h.column_dimensions["C"].width = 28
H = {k: f"Hypothèses!$B${i}" for i, k in enumerate(["pertes", "mo", "caisses", "eau", "pers", "fixes", "amort", "interets"], start=3)}

# ------------------------------------------------------------ Annuel
a = wb.create_sheet("Annuel")
a["A1"] = "Résultat annuel en croisière (millions de FCFA)"; a["A1"].font = Font(bold=True, size=13)
rows = [
    ("Chiffre d'affaires brut", "=Cultures!I10", "0.0"),
    ("Pertes après récolte", f"=-B3*{H['pertes']}", "0.0"),
    ("Chiffre d'affaires net", "=B3+B4", "0.0"),
    ("Intrants", "=Cultures!J10", "0.0"),
    ("Main-d'œuvre saisonnière, caisses, eau et énergie", f"={H['mo']}+{H['caisses']}+{H['eau']}", "0.0"),
    ("Charges variables", "=B6+B7", "0.0"),
    ("Taux de marge sur coûts variables", "=IF(B5=0,0,(B5-B8)/B5)", "0.0%"),
    ("Personnel permanent", f"={H['pers']}", "0.0"),
    ("Charges fixes", f"={H['fixes']}", "0.0"),
    ("EBE", "=B5-B8-B10-B11", "0.0"),
    ("Amortissements", f"={H['amort']}", "0.0"),
    ("Résultat d'exploitation", "=B12-B13", "0.0"),
    ("Coûts fixes totaux (personnel, charges fixes, amortissements, intérêts)", f"=B10+B11+B13+{H['interets']}", "0.0"),
    ("Seuil de rentabilité (M FCFA de CA)", "=IF(B9=0,0,B15/B9)", "0.0"),
    ("Seuil en % du chiffre d'affaires", "=IF(B5=0,0,B16/B5)", "0%"),
    ("Marge de sécurité", "=1-B17", "0%"),
]
for i, (lib, f, fmt) in enumerate(rows, start=3):
    a.cell(i, 1, lib); x = a.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS
a.column_dimensions["A"].width = 64; a.column_dimensions["B"].width = 16

# ------------------------------------------------------------ Sensibilité
s = wb.create_sheet("Sensibilité")
s["A1"] = "Sensibilité : effet annuel sur l'EBE (M FCFA), un test à la fois"; s["A1"].font = Font(bold=True, size=13)
for col, t in zip("ABC", ("Test", "Variation", "Effet sur l'EBE")): s[f"{col}3"] = t; s[f"{col}3"].font = GRAS
tests = [
    ("Prix de vente", -0.10, "=Annuel!B5*B4"),
    ("Pertes après récolte (points en plus ; négatif = moins de pertes)", 0.03, "=-Annuel!B3*B5"),
    ("Rendements", -0.10, "=Annuel!B5*B6"),
    ("Intrants", 0.10, "=-Annuel!B6*B7"),
]
for i, (lib, v, f) in enumerate(tests, start=4):
    s.cell(i, 1, lib); x = s.cell(i, 2, v); x.fill = VERT; x.number_format = "0%"
    y = s.cell(i, 3, f); y.number_format = "0.0"
s["A9"] = "Le test sur les rendements suppose que les charges variables ne changent pas (récolte plus faible, mêmes coûts)."
s.column_dimensions["A"].width = 70; s.column_dimensions["B"].width = 12; s.column_dimensions["C"].width = 18

# ------------------------------------------------------------ Calendrier
k = wb.create_sheet("Calendrier")
k["A1"] = "Calendrier sur 12 mois : écrivez S (semis ou plantation), C (culture), R (récolte), V (vente)"; k["A1"].font = Font(bold=True, size=13)
mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
k["A3"] = "Culture / parcelle"; k["A3"].font = GRAS
for j, m in enumerate(mois, start=2):
    k.cell(3, j, m).font = GRAS
    k.column_dimensions[k.cell(3, j).column_letter].width = 6
for i in range(4, 14):
    for j in range(1, 14): k.cell(i, j).fill = VERT
k["A15"] = "Conseil : décalez les plantations pour étaler les récoltes et les ventes (voir la leçon 4)."
k.column_dimensions["A"].width = 34

wb.save(SORTIE)
print("écrit", SORTIE)
