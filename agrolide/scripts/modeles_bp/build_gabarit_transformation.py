# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Transformation » (hypothèses du cas mangue-sechee-benin, à remplacer par les vôtres).
Usage : python scripts/modeles_bp/build_gabarit_transformation.py ; puis recalculer avec recalc_excel.ps1."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-transformation.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)

wb = Workbook()

# ------------------------------------------------------------ Production
p = wb.active
p.title = "Production"
p["A1"] = "Bilan matière et capacité (cellules vertes = à remplacer par vos mesures et relevés datés)"; p["A1"].font = Font(bold=True, size=13)
entrees = [
    ("Matière première traitée par jour", 1.8, "t par jour", "0.0"),
    ("Jours de fonctionnement par an", 100, "jours", "0"),
    ("Rendement matière", 0.11, "kg de produit fini par kg de matière première", "0.00"),
    ("Pertes au conditionnement", 0.04, "% du produit fini", "0%"),
    ("Prix d'achat de la matière première", 110, "FCFA/kg", "#,##0"),
    ("Prix de vente du produit fini", 4000, "FCFA/kg", "#,##0"),
    ("Coût d'emballage et d'étiquetage", 300, "FCFA par kg de produit", "#,##0"),
]
for i, (lib, val, unite, fmt) in enumerate(entrees, start=3):
    p.cell(i, 1, lib); x = p.cell(i, 2, val); x.fill = VERT; x.number_format = fmt; p.cell(i, 3, unite)
calculs = [
    ("Matière première traitée par an", "=B3*B4", "0.0", "t"),
    ("Volume de produit fini vendable", "=B12*1000*B5*(1-B6)", "#,##0", "kg"),
    ("Chiffre d'affaires de croisière", "=B13*B8/1000000", "0.0", "M FCFA"),
    ("Coût de la matière première", "=B12*1000*B7/1000000", "0.0", "M FCFA"),
    ("Coût d'emballage", "=B12*1000*B5*B9/1000000", "0.0", "M FCFA"),
    ("Kilos de matière première par kg de produit fini", "=IF(B5=0,0,1/B5)", "0.0", "kg"),
]
for i, (lib, f, fmt, unite) in enumerate(calculs, start=12):
    p.cell(i, 1, lib); x = p.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS; p.cell(i, 3, unite)
p["A11"] = "Résultats calculés"; p["A11"].font = GRAS
p.column_dimensions["A"].width = 48; p.column_dimensions["B"].width = 16; p.column_dimensions["C"].width = 46

# ------------------------------------------------------------ Hypothèses générales
h = wb.create_sheet("Hypothèses")
h["A1"] = "Autres hypothèses (cellules vertes = à remplacer)"; h["A1"].font = Font(bold=True, size=13)
lignes = [
    ("Énergie de transformation (séchage, cuisson)", 5.0, "M FCFA par an"),
    ("Main-d'œuvre saisonnière", 11.0, "M FCFA par an"),
    ("Transport et contrôles de qualité", 3.0, "M FCFA par an"),
    ("Personnel permanent", 7.2, "M FCFA par an"),
    ("Charges fixes (assurance, entretien, comptabilité)", 3.6, "M FCFA par an"),
    ("Amortissements annuels", 6.825, "M FCFA par an"),
    ("Intérêts annuels (année de croisière)", 4.66, "M FCFA par an"),
]
for i, (lib, val, unite) in enumerate(lignes, start=3):
    h.cell(i, 1, lib); x = h.cell(i, 2, val); x.fill = VERT; h.cell(i, 3, unite)
h.column_dimensions["A"].width = 56; h.column_dimensions["B"].width = 14; h.column_dimensions["C"].width = 22
H = {k: f"Hypothèses!$B${i}" for i, k in enumerate(["energie", "mo", "transport", "pers", "fixes", "amort", "interets"], start=3)}

# ------------------------------------------------------------ Annuel
a = wb.create_sheet("Annuel")
a["A1"] = "Résultat annuel en croisière (millions de FCFA)"; a["A1"].font = Font(bold=True, size=13)
rows = [
    ("Chiffre d'affaires", "=Production!B14", "0.0"),
    ("Matière première", "=Production!B15", "0.0"),
    ("Emballage", "=Production!B16", "0.0"),
    ("Autres charges variables (énergie, main-d'œuvre saisonnière, transport)", f"={H['energie']}+{H['mo']}+{H['transport']}", "0.0"),
    ("Charges variables", "=B4+B5+B6", "0.0"),
    ("Taux de marge sur coûts variables", "=IF(B3=0,0,(B3-B7)/B3)", "0.0%"),
    ("Part de la matière première dans les charges variables", "=IF(B7=0,0,B4/B7)", "0%"),
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
    ("Prix de vente du produit fini", -0.10, "0%", "=Annuel!B3*B4"),
    ("Rendement matière (en points, ex. -0,01 ; coûts inchangés)", -0.01, "0.00", "=Production!B12*1000*B5*(1-Production!B6)*Production!B8/1000000"),
    ("Prix de la matière première", 0.10, "0%", "=-Annuel!B4*B6"),
    ("Pertes au conditionnement (points en plus)", 0.03, "0%", "=-Production!B12*1000*Production!B5*B7*Production!B8/1000000"),
]
for i, (lib, v, fmt, f) in enumerate(tests, start=4):
    s.cell(i, 1, lib); x = s.cell(i, 2, v); x.fill = VERT; x.number_format = fmt
    y = s.cell(i, 3, f); y.number_format = "0.0"
s["A9"] = "Les tests sur le rendement et sur les pertes supposent que les coûts d'achat ne changent pas."
s.column_dimensions["A"].width = 70; s.column_dimensions["B"].width = 12; s.column_dimensions["C"].width = 18

# ------------------------------------------------------------ Calendrier
k = wb.create_sheet("Calendrier")
k["A1"] = "Calendrier de campagne sur 12 mois : A (approvisionnement), T (transformation), V (vente), X (arrêt et entretien)"; k["A1"].font = Font(bold=True, size=13)
mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
k["A3"] = "Produit ou ligne de production"; k["A3"].font = GRAS
for j, m in enumerate(mois, start=2):
    k.cell(3, j, m).font = GRAS
    k.column_dimensions[k.cell(3, j).column_letter].width = 6
for i in range(4, 14):
    for j in range(1, 14): k.cell(i, j).fill = VERT
k["A15"] = "Conseil : cherchez un second produit ou une conservation de la matière première pour allonger la saison de fonctionnement."
k.column_dimensions["A"].width = 34

wb.save(SORTIE)
print("écrit", SORTIE)
