# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Services agricoles » (hypothèses du cas mecanisation-burkina-faso, à remplacer par les vôtres).
Usage : python scripts/modeles_bp/build_gabarit_services.py ; puis recalculer avec recalc_excel.ps1."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-services-agricoles.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)
TITRE = Font(bold=True, size=13)

wb = Workbook()

# ------------------------------------------------------------ Activité
a = wb.active
a.title = "Activité"
a["A1"] = "Activité et chiffre d'affaires (cellules vertes = à remplacer par vos relevés et vos clients identifiés)"; a["A1"].font = TITRE
entrees = [
    ("Nombre de tracteurs", 2, "tracteurs", "0"),
    ("Hectares labourés par tracteur et par an", 480, "ha", "#,##0"),
    ("Tarif de labour", 35000, "FCFA par hectare", "#,##0"),
    ("Nombre de batteuses", 2, "batteuses", "0"),
    ("Tonnes battues par batteuse et par an", 900, "t", "#,##0"),
    ("Tarif de battage", 17000, "FCFA par tonne", "#,##0"),
    ("Impayés et rabais", 0.05, "% du chiffre d'affaires brut", "0%"),
    ("Activité de l'année 1", 0.65, "% de l'activité de croisière", "0%"),
]
for i, (lib, val, unite, fmt) in enumerate(entrees, start=3):
    a.cell(i, 1, lib); x = a.cell(i, 2, val); x.fill = VERT; x.number_format = fmt; a.cell(i, 3, unite)
a["A12"] = "Résultats calculés"; a["A12"].font = GRAS
calculs = [
    ("Hectares labourés par an", "=B3*B4", "#,##0", "ha"),
    ("Tonnes battues par an", "=B6*B7", "#,##0", "t"),
    ("Chiffre d'affaires du labour", "=B13*B5/1000000", "0.0", "M FCFA"),
    ("Chiffre d'affaires du battage", "=B14*B8/1000000", "0.0", "M FCFA"),
    ("Chiffre d'affaires brut", "=B15+B16", "0.0", "M FCFA"),
    ("Impayés et rabais", "=B17*B9", "0.0", "M FCFA"),
    ("Chiffre d'affaires encaissé de croisière", "=B17-B18", "0.0", "M FCFA"),
    ("Chiffre d'affaires encaissé de l'année 1", "=B19*B10", "0.0", "M FCFA"),
]
for i, (lib, f, fmt, unite) in enumerate(calculs, start=13):
    a.cell(i, 1, lib); x = a.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS; a.cell(i, 3, unite)
a.column_dimensions["A"].width = 52; a.column_dimensions["B"].width = 16; a.column_dimensions["C"].width = 34

# ------------------------------------------------------------ Hypothèses
h = wb.create_sheet("Hypothèses")
h["A1"] = "Coûts du service (cellules vertes = à remplacer par vos consommations, vos devis et vos relevés datés)"; h["A1"].font = TITRE
lignes = [
    ("Gasoil par hectare labouré", 12, "litres", "0.0"),
    ("Gasoil par tonne battue", 4, "litres", "0.0"),
    ("Prix du gasoil", 750, "FCFA par litre", "#,##0"),
    ("Valeur du matériel (tracteurs, charrues, batteuses)", 68.0, "M FCFA", "0.0"),
    ("Pièces et entretien", 0.10, "% de la valeur du matériel par an", "0%"),
    ("Opérateurs saisonniers", 3.0, "M FCFA par an", "0.0"),
    ("Transport du matériel et petits frais", 1.5, "M FCFA par an", "0.0"),
    ("Personnel permanent", 6.0, "M FCFA par an", "0.0"),
    ("Charges fixes (assurance, local, gestion)", 2.6, "M FCFA par an", "0.0"),
    ("Taux d'impôt sur les bénéfices (à titre d'exemple)", 0.30, "%", "0%"),
]
for i, (lib, val, unite, fmt) in enumerate(lignes, start=3):
    h.cell(i, 1, lib); x = h.cell(i, 2, val); x.fill = VERT; x.number_format = fmt; h.cell(i, 3, unite)
h["A14"] = "Résultats calculés"; h["A14"].font = GRAS
calc_h = [
    ("Gasoil de croisière", "=(Activité!B13*B3+Activité!B14*B4)*B5/1000000", "0.0", "M FCFA"),
    ("Pièces et entretien", "=B6*B7", "0.0", "M FCFA"),
    ("Charges variables de croisière", "=B15+B16+B8+B9", "0.0", "M FCFA"),
    ("Gasoil pour un hectare labouré", "=B3*B5", "#,##0", "FCFA"),
    ("Part du gasoil dans le tarif de labour", "=IF(Activité!B5=0,0,B18/Activité!B5)", "0%", ""),
]
for i, (lib, f, fmt, unite) in enumerate(calc_h, start=15):
    h.cell(i, 1, lib); x = h.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS; h.cell(i, 3, unite)
h.column_dimensions["A"].width = 56; h.column_dimensions["B"].width = 16; h.column_dimensions["C"].width = 36

# ------------------------------------------------------------ Financement
f = wb.create_sheet("Financement")
f["A1"] = "Investissement et financement (cellules vertes = à remplacer par vos devis datés), en millions de FCFA"; f["A1"].font = TITRE
for col, t in zip("ABCD", ("Poste", "Montant", "Durée d'amortissement (ans)", "Amortissement annuel")):
    f[f"{col}3"] = t; f[f"{col}3"].font = GRAS
immos = [("Frais d'établissement et immatriculation", 0.5, 5), ("2 tracteurs de 75 CV avec charrues à disques", 44.0, 8),
         ("2 batteuses", 24.0, 8), ("Hangar d'abri et atelier", 6.0, 20), ("Remorque et outillage d'atelier", 4.0, 5), ("Imprévus (capitalisés)", 2.5, 10)]
for i, (lib, m, d) in enumerate(immos, start=4):
    f.cell(i, 1, lib); x = f.cell(i, 2, m); x.fill = VERT; x.number_format = "0.0"
    y = f.cell(i, 3, d); y.fill = VERT
    z = f.cell(i, 4, f"=IF(C{i}=0,0,B{i}/C{i})"); z.number_format = "0.00"; z.fill = GRIS
f["A10"] = "Total immobilisations"; f["A10"].font = GRAS
f["B10"] = "=SUM(B4:B9)"; f["D10"] = "=SUM(D4:D9)"
f["B10"].number_format = "0.0"; f["D10"].number_format = "0.00"
f["A12"] = "Besoin en fonds de roulement (crédit accordé aux clients, stocks de pièces et de gasoil)"; f["B12"] = 10.0; f["B12"].fill = VERT; f["B12"].number_format = "0.0"
suite = [
    (13, "Coût total du projet", "=B10+B12", "0.0", None),
    (14, "Part d'apport", 0.30, "0%", VERT),
    (15, "Apport", "=ROUND(B13*B14,1)", "0.0", None),
    (16, "Emprunt", "=B13-B15", "0.0", None),
    (17, "Taux d'intérêt", 0.09, "0%", VERT),
    (18, "Durée de l'emprunt (ans)", 8, "0", VERT),
    (19, "Différé (années où seuls les intérêts sont payés)", 1, "0", VERT),
    (20, "Annuité constante (après le différé)", "=PMT(B17,B18-B19,-B16)", "0.00", None),
    (21, "Intérêts de l'année 1", "=B16*B17", "0.00", None),
    (22, "Intérêts de l'année 2", "=B16*B17", "0.00", None),
]
for r, lib, val, fmt, fill in suite:
    f.cell(r, 1, lib); x = f.cell(r, 2, val); x.number_format = fmt
    x.fill = fill if fill is not None else GRIS
f["A24"] = "Les intérêts de l'année 2 supposent aucun remboursement de capital pendant l'année de différé."
f.column_dimensions["A"].width = 76; f.column_dimensions["B"].width = 14; f.column_dimensions["C"].width = 28; f.column_dimensions["D"].width = 22

# ------------------------------------------------------------ Annuel
n = wb.create_sheet("Annuel")
n["A1"] = "Résultat annuel de croisière (année 2), seuil de rentabilité et couverture de la dette, en millions de FCFA"; n["A1"].font = TITRE
rows = [
    ("Chiffre d'affaires encaissé", "=Activité!B19", "0.0"),
    ("Charges variables", "=Hypothèses!B17", "0.0"),
    ("Marge sur coûts variables", "=B3-B4", "0.0"),
    ("Taux de marge", "=IF(B3=0,0,B5/B3)", "0.0%"),
    ("Personnel permanent", "=Hypothèses!B10", "0.0"),
    ("Charges fixes", "=Hypothèses!B11", "0.0"),
    ("EBE", "=B5-B7-B8", "0.0"),
    ("Amortissements", "=Financement!D10", "0.0"),
    ("Résultat d'exploitation", "=B9-B10", "0.0"),
    ("Intérêts", "=Financement!B22", "0.0"),
    ("Résultat avant impôt", "=B11-B12", "0.0"),
    ("Impôt", "=MAX(0,B13*Hypothèses!B12)", "0.0"),
    ("Résultat net", "=B13-B14", "0.0"),
    ("Coûts fixes totaux (personnel, charges fixes, amortissements, intérêts)", "=B7+B8+B10+B12", "0.0"),
    ("Seuil de rentabilité (M FCFA de chiffre d'affaires)", "=IF(B6=0,0,B16/B6)", "0.0"),
    ("Seuil en % du chiffre d'affaires", "=IF(B3=0,0,B17/B3)", "0%"),
    ("Marge de sécurité", "=1-B18", "0%"),
    ("Flux disponible pour la dette (EBE moins impôt)", "=B9-B14", "0.0"),
    ("Service de la dette (annuité)", "=Financement!B20", "0.0"),
    ("DSCR", "=IF(B21=0,0,B20/B21)", "0.00"),
]
for i, (lib, fm, fmt) in enumerate(rows, start=3):
    n.cell(i, 1, lib); x = n.cell(i, 2, fm); x.number_format = fmt; x.fill = GRIS
n.column_dimensions["A"].width = 76; n.column_dimensions["B"].width = 16

# ------------------------------------------------------------ Scénarios
s = wb.create_sheet("Scénarios")
s["A1"] = "Trois scénarios sur l'année 2 (cellules vertes = facteurs de test à modifier)"; s["A1"].font = TITRE
for col, t in zip("ABCD", ("", "Réaliste", "Pessimiste", "Mauvaise saison")):
    s[f"{col}3"] = t; s[f"{col}3"].font = GRAS
facteurs = [
    ("Facteur d'activité (1 = prévu)", (1.0, 0.85, 0.70), "0.00"),
    ("Impayés et rabais", (0.05, 0.10, 0.15), "0%"),
    ("Facteur gasoil (1 = prix prévu)", (1.0, 1.10, 1.0), "0.00"),
    ("Facteur entretien (1 = prévu)", (1.0, 1.15, 1.0), "0.00"),
]
for i, (lib, vals, fmt) in enumerate(facteurs, start=4):
    s.cell(i, 1, lib)
    for j, v in enumerate(vals, start=2):
        x = s.cell(i, j, v); x.fill = VERT; x.number_format = fmt
s["A9"] = "Résultats (M FCFA)"; s["A9"].font = GRAS
for j, col in enumerate("BCD", start=2):
    formules = [
        f"=(Activité!$B$13*Activité!$B$5+Activité!$B$14*Activité!$B$8)/1000000*{col}4*(1-{col}5)",
        f"=(Activité!$B$13*Hypothèses!$B$3+Activité!$B$14*Hypothèses!$B$4)*{col}4*Hypothèses!$B$5/1000000*{col}6+Hypothèses!$B$6*Hypothèses!$B$7*{col}7+Hypothèses!$B$8+Hypothèses!$B$9",
        f"={col}10-{col}11-Hypothèses!$B$10-Hypothèses!$B$11",
        f"={col}12-Financement!$D$10-Financement!$B$22",
        f"=MAX(0,{col}13*Hypothèses!$B$12)",
        f"={col}12-{col}14",
        f"=IF(Financement!$B$20=0,0,{col}15/Financement!$B$20)",
    ]
    for r, fm in zip(range(10, 17), formules):
        x = s.cell(r, j, fm); x.fill = GRIS; x.number_format = "0.00" if r == 16 else "0.0"
libs = ["Chiffre d'affaires encaissé", "Charges variables", "EBE", "Résultat avant impôt", "Impôt", "Flux disponible pour la dette", "DSCR"]
for r, lib in zip(range(10, 17), libs):
    s.cell(r, 1, lib)
s["A18"] = "Un DSCR inférieur à 1 signifie que l'annuité n'est pas couverte. Testez aussi le facteur d'activité seul."
s.column_dimensions["A"].width = 40
for col in "BCD":
    s.column_dimensions[col].width = 16

# ------------------------------------------------------------ Calendrier
k = wb.create_sheet("Calendrier")
k["A1"] = "Calendrier des chantiers sur 12 mois : L (labour), B (battage), E (entretien du matériel), A (autre activité), X (arrêt)"; k["A1"].font = TITRE
mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
k["A3"] = "Machine ou ligne de service"; k["A3"].font = GRAS
for j, m in enumerate(mois, start=2):
    k.cell(3, j, m).font = GRAS
    k.column_dimensions[k.cell(3, j).column_letter].width = 6
for i in range(4, 14):
    for j in range(1, 14):
        k.cell(i, j).fill = VERT
k["A15"] = "Conseil : remplissez ce calendrier avec vos clients réservés avant d'acheter le matériel, et cherchez une activité hors saison pour les mois vides."
k.column_dimensions["A"].width = 34

wb.save(SORTIE)
print("écrit", SORTIE)
