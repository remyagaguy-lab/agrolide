# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Prix et saisonnalité » : série de relevés FICTIFS (prix_saisonnalite.py), à remplacer par vos relevés datés.
Usage : python scripts/modeles_bp/build_gabarit_prix.py ; puis recalculer avec recalc_excel.ps1."""
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
sys.path.insert(0, "scripts/modeles_bp")
from prix_saisonnalite import MOIS, SERIES

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-prix-saisonnalite.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)
TITRE = Font(bold=True, size=13)
wb = Workbook()

r = wb.active
r.title = "Relevés"
r["A1"] = "Relevés de prix mensuels en FCFA par kg (cellules vertes). Série FICTIVE d'illustration : remplacez-la par vos relevés datés, avec lieu, stade et unité."; r["A1"].font = TITRE
r["A3"] = "Mois"; r["A3"].font = GRAS
for j, a in enumerate(SERIES, start=2):
    r.cell(3, j, a).font = GRAS
    for i, v in enumerate(SERIES[a], start=4):
        x = r.cell(i, j, v); x.fill = VERT; x.number_format = "#,##0"
for i, m in enumerate(MOIS, start=4):
    r.cell(i, 1, m)
r["A17"] = "Source, lieu de relevé, stade (bord de champ, marché de gros, détail) et qualité : à noter ici pour chaque série."
r.column_dimensions["A"].width = 30
for c in "BCD": r.column_dimensions[c].width = 14

s = wb.create_sheet("Saisonnalité")
s["A1"] = "Indice saisonnier : prix du mois divisé par la moyenne de l'année (1,00 = prix moyen de l'année)"; s["A1"].font = TITRE
s["A3"] = "Mois"; s["A3"].font = GRAS
for j, a in enumerate(SERIES, start=2): s.cell(3, j, a).font = GRAS
s["E3"] = "Indice moyen"; s["E3"].font = GRAS
for i, m in enumerate(MOIS, start=4):
    s.cell(i, 1, m)
    for j, col in enumerate("BCD", start=2):
        x = s.cell(i, j, f"=Relevés!{col}{i}/AVERAGE(Relevés!{col}$4:{col}$15)"); x.number_format = "0.000"; x.fill = GRIS
    y = s.cell(i, 5, f"=AVERAGE(B{i}:D{i})"); y.number_format = "0.000"; y.fill = GRIS
s.column_dimensions["A"].width = 20
for c in "BCDE": s.column_dimensions[c].width = 14

v = wb.create_sheet("Volatilité")
v["A1"] = "Volatilité et prix prudent (récolte : novembre et décembre ; soudure : juin et juillet ; à adapter à votre calendrier)"; v["A1"].font = TITRE
rows = [
    ("Prix moyen sur l'ensemble des relevés", "=AVERAGE(Relevés!B4:D15)", "0.0", "FCFA par kg"),
    ("Écart-type", "=STDEV(Relevés!B4:D15)", "0.0", "FCFA par kg"),
    ("Coefficient de variation", "=B4/B3", "0.0%", ""),
    ("Prix minimum", "=MIN(Relevés!B4:D15)", "0", "FCFA par kg"),
    ("Prix maximum", "=MAX(Relevés!B4:D15)", "0", "FCFA par kg"),
    ("Prix moyen à la récolte", "=AVERAGE(Relevés!B14:D15)", "0.0", "FCFA par kg"),
    ("Écart-type des prix à la récolte", "=STDEV(Relevés!B14:D15)", "0.0", "FCFA par kg"),
    ("Prix prudent à la récolte (moyenne moins un écart-type)", "=B8-B9", "0.0", "FCFA par kg"),
    ("Prix moyen à la soudure", "=AVERAGE(Relevés!B9:D10)", "0.0", "FCFA par kg"),
    ("Écart soudure par rapport à la récolte", "=B11/B8-1", "0.0%", ""),
]
for i, (lib, f, fmt, u) in enumerate(rows, start=3):
    v.cell(i, 1, lib); x = v.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS; v.cell(i, 3, u)
v.column_dimensions["A"].width = 62; v.column_dimensions["B"].width = 14; v.column_dimensions["C"].width = 16

m = wb.create_sheet("Impact")
m["A1"] = "Effet du prix prudent sur le chiffre d'affaires (cellules vertes = à remplacer par les chiffres de votre plan)"; m["A1"].font = TITRE
ent = [("Prix de vente retenu dans le plan", 190, "#,##0", "FCFA par kg"), ("Quantité vendue par an", 171, "0.0", "tonnes"), ("Coût complet par kilogramme", 162, "#,##0", "FCFA par kg")]
for i, (lib, val, fmt, u) in enumerate(ent, start=3):
    m.cell(i, 1, lib); x = m.cell(i, 2, val); x.fill = VERT; x.number_format = fmt; m.cell(i, 3, u)
res = [
    ("Chiffre d'affaires au prix du plan", "=B3*B4/1000", "0.0", "M FCFA"),
    ("Prix prudent à la récolte (feuille Volatilité)", "=Volatilité!B10", "0.0", "FCFA par kg"),
    ("Chiffre d'affaires au prix prudent", "=B7*B4/1000", "0.0", "M FCFA"),
    ("Écart de chiffre d'affaires", "=B8-B6", "0.0", "M FCFA"),
    ("Marge par kilogramme au prix prudent (avant impôt, hors capital)", "=B7-B5", "0.0", "FCFA par kg"),
    ("Écart entre le prix prudent et le prix du plan", "=B7/B3-1", "0.0%", ""),
]
for i, (lib, f, fmt, u) in enumerate(res, start=6):
    m.cell(i, 1, lib); x = m.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS; m.cell(i, 3, u)
m["A13"] = "Reportez ensuite le prix prudent dans le scénario pessimiste de votre classeur de filière et lisez le DSCR."
m.column_dimensions["A"].width = 66; m.column_dimensions["B"].width = 14; m.column_dimensions["C"].width = 16
wb.save(SORTIE)
print("écrit", SORTIE)
