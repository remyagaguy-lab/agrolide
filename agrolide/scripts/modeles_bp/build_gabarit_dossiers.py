# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Dossiers de financement » : registre des dispositifs à compléter et rétroplanning.
Aucune condition de dispositif n'est préremplie : tout est à renseigner avec une source et une date.
Usage : python scripts/modeles_bp/build_gabarit_dossiers.py ; puis recalculer avec recalc_excel.ps1."""
import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-dossiers-financement.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)
TITRE = Font(bold=True, size=13)
wb = Workbook()

g = wb.active
g.title = "Registre"
g["A1"] = "Registre des dispositifs visés (cellules vertes = à remplir avec la source et la date de vérification ; ne rien recopier de mémoire)"; g["A1"].font = TITRE
cols = ["Dispositif", "Organisme et contact", "Ce qu'il finance ou garantit", "Conditions d'éligibilité (source)", "Pièces demandées (liste du guichet)",
        "Délai annoncé par le guichet (jours)", "Date de la dernière vérification", "Statut (actif, en transition, non confirmé)", "Prochaine échéance connue", "Décision (déposer, écarter)"]
for j, c in enumerate(cols, start=1):
    g.cell(3, j, c).font = GRAS
    g.column_dimensions[g.cell(3, j).column_letter].width = 26
for i in range(4, 14):
    for j in range(1, len(cols) + 1):
        g.cell(i, j).fill = VERT
for i in range(4, 14):
    g.cell(i, 7).number_format = "dd/mm/yyyy"; g.cell(i, 9).number_format = "dd/mm/yyyy"
g["A15"] = "Vérifications à renouveler : nombre de lignes dont la vérification date de plus de 90 jours"
g["A16"] = "Aujourd'hui (saisir la date du jour)"; g["B16"] = datetime.date(2027, 1, 15); g["B16"].fill = VERT; g["B16"].number_format = "dd/mm/yyyy"
g["A17"] = "Lignes à revérifier"; g["B17"] = '=SUMPRODUCT((G4:G13<>"")*(($B$16-G4:G13)>90))'; g["B17"].fill = GRIS
g["C16"] = "Date d'exemple : remplacez-la."
g.column_dimensions["A"].width = 40

r = wb.create_sheet("Rétroplanning")
r["A1"] = "Rétroplanning à rebours depuis la date où vous avez besoin des fonds (cellules vertes = vos dates et les délais annoncés par le guichet)"; r["A1"].font = TITRE
ent = [("Date où les fonds doivent être disponibles (exemple)", datetime.date(2027, 5, 1), "dd/mm/yyyy"),
       ("Délai de décaissement après accord (jours, à demander)", 30, "0"),
       ("Délai d'instruction du dossier (jours, à demander)", 60, "0"),
       ("Délai pour réunir les pièces (jours, selon votre liste)", 45, "0"),
       ("Marge de sécurité (jours)", 15, "0")]
for i, (lib, v, fmt) in enumerate(ent, start=3):
    r.cell(i, 1, lib); x = r.cell(i, 2, v); x.fill = VERT; x.number_format = fmt
r["C3"] = "Les délais de l'exemple sont des hypothèses pédagogiques : demandez les délais réels."
r["A9"] = "Dates calculées"; r["A9"].font = GRAS
res = [("Accord à obtenir au plus tard le", "=B3-B4-B7"), ("Dossier à déposer au plus tard le", "=B10-B5"), ("Début de la constitution du dossier au plus tard le", "=B11-B6")]
for i, (lib, f) in enumerate(res, start=10):
    r.cell(i, 1, lib); x = r.cell(i, 2, f); x.number_format = "dd/mm/yyyy"; x.fill = GRIS
r["A14"] = "Durée totale à prévoir (jours)"; r["B14"] = "=B3-B12"; r["B14"].fill = GRIS
r.column_dimensions["A"].width = 62; r.column_dimensions["B"].width = 16

p = wb.create_sheet("Pièces")
p["A1"] = "Liste de contrôle des pièces (cellules vertes = statut, date de la pièce, observations)"; p["A1"].font = TITRE
for j, c in enumerate(["Pièce", "Obtenue (oui/non)", "Date de la pièce", "Observations"], start=1): p.cell(3, j, c).font = GRAS
pieces = ["Business plan et résumé", "Modèle financier (classeur) et hypothèses sourcées", "Statuts et extrait du registre du commerce", "Pièces d'identité des dirigeants",
          "Preuve du droit sur la terre ou le local", "Devis datés des investissements", "Lettres d'intention ou contrats de vente", "États financiers ou relevés des exercices passés (si activité existante)",
          "Relevés bancaires et situation des crédits en cours", "Preuve de l'apport (épargne, ou autre)", "Attestations de conformité (fiscale, sociale) si le guichet les demande", "Devis d'assurance"]
for i, t in enumerate(pieces, start=4):
    p.cell(i, 1, t)
    for j in (2, 3, 4): p.cell(i, j).fill = VERT
    p.cell(i, 3).number_format = "dd/mm/yyyy"
p["A17"] = "Pièces obtenues"; p["B17"] = '=COUNTIF(B4:B15,"oui")'; p["A18"] = "Pièces à obtenir"; p["B18"] = '=COUNTA(A4:A15)-B17'
p["B17"].fill = GRIS; p["B18"].fill = GRIS
p.column_dimensions["A"].width = 70
for c in "BCD": p.column_dimensions[c].width = 22
wb.save(SORTIE)
print("écrit", SORTIE)
