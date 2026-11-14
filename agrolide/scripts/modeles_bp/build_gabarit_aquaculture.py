# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Aquaculture » (hypothèses du cas aquaculture-senegal, à remplacer par les vôtres).
Usage : python scripts/modeles_bp/build_gabarit_aquaculture.py ; puis recalculer avec recalc_excel.ps1."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-aquaculture.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)

wb = Workbook()

# ------------------------------------------------------------ Production
p = wb.active
p.title = "Production"
p["A1"] = "Cycle de production (cellules vertes = à remplacer par vos relevés datés)"; p["A1"].font = Font(bold=True, size=13)
entrees = [
    ("Nombre d'étangs", 12, "étangs", "0"),
    ("Surface par étang", 500, "m²", "0"),
    ("Densité de mise en charge", 3, "alevins par m²", "0.0"),
    ("Cycles par an", 2, "cycles", "0"),
    ("Taux de survie", 0.85, "% des alevins vendus", "0%"),
    ("Poids moyen de vente", 0.42, "kg par poisson", "0.00"),
    ("Indice de conversion alimentaire", 1.6, "kg d'aliment par kg de poisson", "0.00"),
    ("Prix de vente du poisson", 2600, "FCFA/kg", "#,##0"),
    ("Prix d'un alevin", 50, "FCFA", "#,##0"),
    ("Prix de l'aliment", 580, "FCFA/kg", "#,##0"),
]
for i, (lib, val, unite, fmt) in enumerate(entrees, start=3):
    p.cell(i, 1, lib); x = p.cell(i, 2, val); x.fill = VERT; x.number_format = fmt; p.cell(i, 3, unite)
calculs = [
    ("Alevins mis en charge par an", "=B3*B4*B5*B6", "#,##0", "alevins"),
    ("Poissons vendus par an", "=B14*B7", "#,##0", "poissons"),
    ("Production annuelle", "=B15*B8", "#,##0", "kg"),
    ("Aliment nécessaire", "=B16*B9", "#,##0", "kg"),
    ("Chiffre d'affaires de croisière", "=B16*B10/1000000", "0.0", "M FCFA"),
    ("Coût de l'aliment", "=B17*B12/1000000", "0.0", "M FCFA"),
    ("Coût des alevins", "=B14*B11/1000000", "0.0", "M FCFA"),
]
for i, (lib, f, fmt, unite) in enumerate(calculs, start=14):
    p.cell(i, 1, lib); x = p.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS; p.cell(i, 3, unite)
p["A13"] = "Résultats calculés"; p["A13"].font = GRAS
p.column_dimensions["A"].width = 40; p.column_dimensions["B"].width = 16; p.column_dimensions["C"].width = 34

# ------------------------------------------------------------ Hypothèses générales
h = wb.create_sheet("Hypothèses")
h["A1"] = "Autres hypothèses (cellules vertes = à remplacer)"; h["A1"].font = Font(bold=True, size=13)
lignes = [
    ("Main-d'œuvre saisonnière (nourrissage de pointe, pêche)", 1.2, "M FCFA par an"),
    ("Énergie et pompage", 2.0, "M FCFA par an"),
    ("Glace et transport", 1.2, "M FCFA par an"),
    ("Chaux, fertilisation et soins", 0.6, "M FCFA par an"),
    ("Personnel permanent", 4.8, "M FCFA par an"),
    ("Charges fixes (assurance, entretien, comptabilité)", 1.8, "M FCFA par an"),
    ("Amortissements annuels", 2.25, "M FCFA par an"),
    ("Intérêts annuels (année de croisière)", 1.92, "M FCFA par an"),
]
for i, (lib, val, unite) in enumerate(lignes, start=3):
    h.cell(i, 1, lib); x = h.cell(i, 2, val); x.fill = VERT; h.cell(i, 3, unite)
h.column_dimensions["A"].width = 56; h.column_dimensions["B"].width = 14; h.column_dimensions["C"].width = 22
H = {k: f"Hypothèses!$B${i}" for i, k in enumerate(["mo", "energie", "glace", "chaux", "pers", "fixes", "amort", "interets"], start=3)}

# ------------------------------------------------------------ Annuel
a = wb.create_sheet("Annuel")
a["A1"] = "Résultat annuel en croisière (millions de FCFA)"; a["A1"].font = Font(bold=True, size=13)
rows = [
    ("Chiffre d'affaires", "=Production!B18", "0.0"),
    ("Aliment", "=Production!B19", "0.0"),
    ("Alevins", "=Production!B20", "0.0"),
    ("Autres charges variables (main-d'œuvre saisonnière, énergie, glace, soins)", f"={H['mo']}+{H['energie']}+{H['glace']}+{H['chaux']}", "0.0"),
    ("Charges variables", "=B4+B5+B6", "0.0"),
    ("Taux de marge sur coûts variables", "=IF(B3=0,0,(B3-B7)/B3)", "0.0%"),
    ("Part de l'aliment dans les charges variables", "=IF(B7=0,0,B4/B7)", "0%"),
    ("Personnel permanent", f"={H['pers']}", "0.0"),
    ("Charges fixes", f"={H['fixes']}", "0.0"),
    ("EBE", "=B3-B7-B10-B11", "0.0"),
    ("Amortissements", f"={H['amort']}", "0.0"),
    ("Résultat d'exploitation", "=B12-B13", "0.0"),
    ("Coûts fixes totaux (personnel, charges fixes, amortissements, intérêts)", f"=B10+B11+B13+{H['interets']}", "0.0"),
    ("Seuil de rentabilité (M FCFA de CA)", "=IF(B8=0,0,B15/B8)", "0.0"),
    ("Seuil en % du chiffre d'affaires", "=IF(B3=0,0,B16/B3)", "0%"),
    ("Marge de sécurité", "=1-B17", "0%"),
]
for i, (lib, f, fmt) in enumerate(rows, start=3):
    a.cell(i, 1, lib); x = a.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS
a.column_dimensions["A"].width = 70; a.column_dimensions["B"].width = 16

# ------------------------------------------------------------ Sensibilité
s = wb.create_sheet("Sensibilité")
s["A1"] = "Sensibilité : effet annuel sur l'EBE (M FCFA), un test à la fois"; s["A1"].font = Font(bold=True, size=13)
for col, t in zip("ABC", ("Test", "Variation", "Effet sur l'EBE")): s[f"{col}3"] = t; s[f"{col}3"].font = GRAS
tests = [
    ("Prix de vente du poisson", -0.10, "0%", "=Annuel!B3*B4"),
    ("Taux de survie (points ; négatif = moins de poissons vendus)", -0.05, "0%", "=Production!B14*B5*Production!B8*Production!B10/1000000"),
    ("Prix de l'aliment", 0.10, "0%", "=-Annuel!B4*B6"),
    ("Indice de conversion (négatif = amélioration)", -0.1, "0.0", "=-Production!B16*B7*Production!B12/1000000"),
]
for i, (lib, v, fmt, f) in enumerate(tests, start=4):
    s.cell(i, 1, lib); x = s.cell(i, 2, v); x.fill = VERT; x.number_format = fmt
    y = s.cell(i, 3, f); y.number_format = "0.0"
s["A9"] = "Le test sur la survie suppose que l'aliment acheté ne change pas (poissons morts : aliment déjà consommé)."
s.column_dimensions["A"].width = 70; s.column_dimensions["B"].width = 12; s.column_dimensions["C"].width = 18

# ------------------------------------------------------------ Calendrier
k = wb.create_sheet("Calendrier")
k["A1"] = "Calendrier des cycles sur 12 mois : M (mise en charge), C (croissance), P (pêche), V (vide et assec)"; k["A1"].font = Font(bold=True, size=13)
mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
k["A3"] = "Étang ou groupe d'étangs"; k["A3"].font = GRAS
for j, m in enumerate(mois, start=2):
    k.cell(3, j, m).font = GRAS
    k.column_dimensions[k.cell(3, j).column_letter].width = 6
for i in range(4, 14):
    for j in range(1, 14): k.cell(i, j).fill = VERT
k["A15"] = "Conseil : décalez les mises en charge entre groupes d'étangs pour étaler les pêches et les ventes."
k.column_dimensions["A"].width = 34

wb.save(SORTIE)
print("écrit", SORTIE)
