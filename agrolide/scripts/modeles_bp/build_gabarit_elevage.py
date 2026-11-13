# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Élevage : poulet de chair » (hypothèses du cas poulet-togo, à remplacer par les vôtres).
Usage : python scripts/modeles_bp/build_gabarit_elevage.py ; puis recalculer avec recalc_excel.ps1."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-elevage-poulet-de-chair.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)

wb = Workbook()

# ---------------------------------------------------------------- Hypothèses
h = wb.active
h.title = "Hypothèses"
h["A1"] = "Hypothèses (cellules vertes = à remplacer par vos devis et relevés datés)"; h["A1"].font = Font(bold=True, size=13)
lignes = [
    ("Nombre de bâtiments", 3, "bâtiments"),
    ("Places par bâtiment", 2000, "places"),
    ("Durée d'élevage", 42, "jours"),
    ("Vide sanitaire", 18, "jours"),
    ("Mortalité", 0.06, "%"),
    ("Poids de vente", 2.0, "kg"),
    ("Indice de consommation (IC)", 1.75, "kg aliment / kg poids vif"),
    ("Prix du poussin d'un jour", 550, "FCFA"),
    ("Prix de l'aliment", 380, "FCFA / kg"),
    ("Produits vétérinaires par poussin", 90, "FCFA"),
    ("Litière par poussin", 100, "FCFA"),
    ("Eau, énergie, divers par poussin", 100, "FCFA"),
    ("Prix de vente du poulet", 3000, "FCFA"),
    ("Charges fixes annuelles", 2.4, "M FCFA"),
    ("Personnel annuel", 5.4, "M FCFA"),
    ("Amortissements annuels", 2.7, "M FCFA"),
]
for i, (lib, val, unite) in enumerate(lignes, start=3):
    h.cell(i, 1, lib); c = h.cell(i, 2, val); c.fill = VERT; h.cell(i, 3, unite)
    if unite == "%": c.number_format = "0.0%"
h["A20"] = "Source et date de chaque hypothèse : à noter dans la feuille Engagements ou dans votre dossier."
h.column_dimensions["A"].width = 42; h.column_dimensions["B"].width = 14; h.column_dimensions["C"].width = 28
# Références
R = {k: f"Hypothèses!$B${i}" for i, k in enumerate(
    ["bat", "places", "duree", "vide", "mort", "poids", "ic", "poussin", "aliment", "veto", "litiere", "divers", "prix", "fixes", "pers", "amort"], start=3)}

# ---------------------------------------------------------------- Bande
b = wb.create_sheet("Bande")
b["A1"] = "Coût et marge d'une bande (un bâtiment)"; b["A1"].font = Font(bold=True, size=13)
rows = [
    ("Poussins mis en place", f"={R['places']}", "0"),
    ("Poulets vendus", f"=B3*(1-{R['mort']})", "0"),
    ("Poussins (FCFA)", f"=B3*{R['poussin']}", "#,##0"),
    ("Aliment (FCFA)", f"=B3*{R['ic']}*{R['poids']}*{R['aliment']}", "#,##0"),
    ("Produits vétérinaires (FCFA)", f"=B3*{R['veto']}", "#,##0"),
    ("Litière (FCFA)", f"=B3*{R['litiere']}", "#,##0"),
    ("Eau, énergie, divers (FCFA)", f"=B3*{R['divers']}", "#,##0"),
    ("Coût variable total de la bande (FCFA)", "=SUM(B5:B9)", "#,##0"),
    ("Coût variable par poussin mis en place (FCFA)", "=B10/B3", "#,##0"),
    ("Coût variable par poulet vendu (FCFA)", "=B10/B4", "#,##0"),
    ("Chiffre d'affaires de la bande (FCFA)", f"=B4*{R['prix']}", "#,##0"),
    ("Marge sur coûts variables de la bande (FCFA)", "=B13-B10", "#,##0"),
    ("Marge par poulet vendu (FCFA)", "=B14/B4", "#,##0"),
    ("Taux de marge sur coûts variables", "=B14/B13", "0.0%"),
    ("Part de l'aliment dans le coût variable", "=B6/B10", "0.0%"),
]
for i, (lib, f, fmt) in enumerate(rows, start=3):
    b.cell(i, 1, lib); c = b.cell(i, 2, f); c.number_format = fmt; c.fill = GRIS
b.column_dimensions["A"].width = 52; b.column_dimensions["B"].width = 18

# ---------------------------------------------------------------- Annuel
a = wb.create_sheet("Annuel")
a["A1"] = "Résultat annuel en croisière (millions de FCFA)"; a["A1"].font = Font(bold=True, size=13)
arows = [
    ("Bandes par an et par bâtiment", f"=ROUNDDOWN(365/({R['duree']}+{R['vide']}),0)", "0"),
    ("Poussins mis en place par an", f"={R['bat']}*{R['places']}*B3", "#,##0"),
    ("Poulets vendus par an", f"=B4*(1-{R['mort']})", "#,##0"),
    ("Poulets vendus par mois", "=B5/12", "#,##0"),
    ("Chiffre d'affaires", f"=B5*{R['prix']}/1000000", "0.0"),
    ("Charges variables", "=B4*Bande!B11/1000000", "0.0"),
    ("Charges fixes", f"={R['fixes']}", "0.0"),
    ("Personnel", f"={R['pers']}", "0.0"),
    ("EBE", "=B7-B8-B9-B10", "0.0"),
    ("Amortissements", f"={R['amort']}", "0.0"),
    ("Résultat d'exploitation", "=B11-B12", "0.0"),
    ("Taux de marge sur coûts variables", "=(B7-B8)/B7", "0.0%"),
    ("Coûts fixes totaux (hors intérêts)", "=B9+B10+B12", "0.0"),
    ("Seuil de rentabilité hors intérêts", "=B15/B14", "0.0"),
    ("Seuil en % du chiffre d'affaires", "=B16/B7", "0.0%"),
]
for i, (lib, f, fmt) in enumerate(arows, start=3):
    a.cell(i, 1, lib); c = a.cell(i, 2, f); c.number_format = fmt; c.fill = GRIS
a["A19"] = "Les intérêts de l'emprunt s'ajoutent aux coûts fixes pour le seuil complet : voir le modèle financier de la formation."
a.column_dimensions["A"].width = 46; a.column_dimensions["B"].width = 18

# ---------------------------------------------------------------- Sensibilité
s = wb.create_sheet("Sensibilité")
s["A1"] = "Sensibilité : effet annuel sur l'EBE (millions de FCFA)"; s["A1"].font = Font(bold=True, size=13)
s["A3"] = "Test"; s["B3"] = "Variation"; s["C3"] = "Effet sur l'EBE"
for c in ("A3", "B3", "C3"): s[c].font = GRAS
s["A4"] = "Prix de l'aliment"; s["B4"] = 0.10; s["B4"].number_format = "0%"; s["B4"].fill = VERT
s["C4"] = "=-Annuel!B4*Bande!B6/Bande!B3*B4/1000000"
s["A5"] = "Prix de vente du poulet"; s["B5"] = -0.05; s["B5"].number_format = "0%"; s["B5"].fill = VERT
s["C5"] = f"=Annuel!B5*{R['prix']}*B5/1000000"
s["A6"] = "Mortalité (points de pourcentage en plus)"; s["B6"] = 0.02; s["B6"].number_format = "0.0%"; s["B6"].fill = VERT
s["C6"] = f"=-Annuel!B4*B6*{R['prix']}/1000000"
s["A7"] = "Indice de consommation (points en plus)"; s["B7"] = 0.10; s["B7"].fill = VERT
s["C7"] = f"=-Annuel!B4*B7*{R['poids']}*{R['aliment']}/1000000"
s["A9"] = "Les trois premiers tests cumulés"; s["C9"] = "=C4+C5+C6"
s["A10"] = "EBE de croisière après les trois tests"; s["C10"] = "=Annuel!B11+C9"
for r in range(4, 11): s.cell(r, 3).number_format = "0.0"
s["A12"] = "Chaque test s'applique seul ; la ligne 9 les additionne. Les coûts non liés (fixes, personnel) ne bougent pas."
s.column_dimensions["A"].width = 46; s.column_dimensions["B"].width = 14; s.column_dimensions["C"].width = 18

# ---------------------------------------------------------------- Engagements
e = wb.create_sheet("Engagements")
e["A1"] = "Suivi des engagements clients (lettres d'intention, contrats)"; e["A1"].font = Font(bold=True, size=13)
cols = ["Client", "Type (lettre / contrat)", "Volume par mois (poulets)", "Prix (FCFA)", "Délai de paiement (jours)", "Date du document", "Source / contact"]
for j, t in enumerate(cols, start=1):
    c = e.cell(3, j, t); c.font = GRAS; c.alignment = Alignment(wrap_text=True)
for r in range(4, 14):
    for j in range(1, 8): e.cell(r, j).fill = VERT
dv = DataValidation(type="list", formula1='"lettre,contrat"', allow_blank=True)
e.add_data_validation(dv); dv.add("B4:B13")
e["A15"] = "Total des volumes engagés"; e["C15"] = "=SUM(C4:C13)"
e["A16"] = "Part du volume mensuel visé"; e["C16"] = "=C15/Annuel!B6"; e["C16"].number_format = "0%"
e["A17"] = "BFR immobilisé par les délais de paiement (M FCFA)"
e["C17"] = "=SUMPRODUCT(C4:C13,D4:D13,E4:E13)/30/1000000"; e["C17"].number_format = "0.0"
for col, w in zip("ABCDEFG", (30, 22, 20, 14, 18, 18, 30)): e.column_dimensions[col].width = w

wb.save(SORTIE)
print("écrit", SORTIE)
