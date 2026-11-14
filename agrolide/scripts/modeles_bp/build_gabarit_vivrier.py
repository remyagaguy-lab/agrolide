# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Cultures vivrières : maïs, riz, soja » (hypothèses du cas riz-irrigue-mali, à remplacer par les vôtres).
Usage : python scripts/modeles_bp/build_gabarit_vivrier.py ; puis recalculer avec recalc_excel.ps1."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-cultures-vivrieres.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)
TITRE = Font(bold=True, size=13)

wb = Workbook()

# ------------------------------------------------------------ Hypothèses
h = wb.active
h.title = "Hypothèses"
h["A1"] = "Culture, rendement, prix et budget à l'hectare (cellules vertes = à remplacer par vos relevés et vos devis datés)"; h["A1"].font = TITRE
entrees = [
    ("Culture et système", "Riz irrigué (paddy), deux campagnes", "texte", "@"),
    ("Hectares cultivés", 15, "ha", "0"),
    ("Campagnes par an", 2, "campagnes", "0"),
    ("Rendement", 6000, "kg par hectare et par campagne", "#,##0"),
    ("Prix de vente à la récolte", 190, "FCFA par kg", "#,##0"),
    ("Pertes (récolte, séchage, battage)", 0.05, "% de la récolte", "0%"),
    ("Activité de l'année 1", 0.80, "% de la production de croisière", "0%"),
    ("Taux d'impôt sur les bénéfices (à titre d'exemple)", 0.30, "%", "0%"),
]
for i, (lib, val, unite, fmt) in enumerate(entrees, start=3):
    h.cell(i, 1, lib); x = h.cell(i, 2, val); x.fill = VERT; x.number_format = fmt; h.cell(i, 3, unite)
h["A11"] = "Budget d'une campagne à l'hectare (M FCFA par hectare et par campagne)"; h["A11"].font = GRAS
budget = [
    ("Semences", 0.045), ("Engrais", 0.150), ("Produits phytosanitaires", 0.045), ("Eau et énergie de pompage", 0.070),
    ("Labour et battage en prestation", 0.150), ("Main-d'œuvre (repiquage, entretien, récolte)", 0.090), ("Sacs et transport", 0.040),
]
for i, (lib, val) in enumerate(budget, start=12):
    h.cell(i, 1, lib); x = h.cell(i, 2, val); x.fill = VERT; x.number_format = "0.000"; h.cell(i, 3, "M FCFA")
h["A19"] = "Personnel permanent (chef de culture, gardien)"; h["B19"] = 3.6
h["A20"] = "Charges fixes (assurance, entretien, comptabilité, gestion)"; h["B20"] = 1.5
for r in (19, 20):
    h.cell(r, 2).fill = VERT; h.cell(r, 2).number_format = "0.0"; h.cell(r, 3, "M FCFA par an")
h["A22"] = "Résultats calculés"; h["A22"].font = GRAS
calc = [
    ("Hectares-campagnes par an", "=B4*B5", "0", "ha-campagnes"),
    ("Production vendable", "=B23*B6*(1-B8)/1000", "0.0", "tonnes"),
    ("Chiffre d'affaires de croisière", "=B24*B7/1000", "0.0", "M FCFA"),
    ("Budget total par hectare et par campagne", "=SUM(B12:B18)", "0.000", "M FCFA"),
    ("Charges variables de croisière", "=B23*B26", "0.0", "M FCFA"),
    ("Coût variable par kilogramme", "=IF(B24=0,0,B27*1000/B24)", "0.0", "FCFA par kg"),
    ("Chiffre d'affaires par hectare et par campagne", "=IF(B23=0,0,B25/B23)", "0.000", "M FCFA"),
]
for i, (lib, f, fmt, unite) in enumerate(calc, start=23):
    h.cell(i, 1, lib); x = h.cell(i, 2, f); x.number_format = fmt; x.fill = GRIS; h.cell(i, 3, unite)
h.column_dimensions["A"].width = 56; h.column_dimensions["B"].width = 36; h.column_dimensions["C"].width = 34

# ------------------------------------------------------------ Financement
f = wb.create_sheet("Financement")
f["A1"] = "Investissement et financement (cellules vertes = à remplacer par vos devis datés), en millions de FCFA"; f["A1"].font = TITRE
for col, t in zip("ABCD", ("Poste", "Montant", "Durée d'amortissement (ans)", "Amortissement annuel")):
    f[f"{col}3"] = t; f[f"{col}3"].font = GRAS
immos = [("Frais d'établissement et accord foncier", 0.4, 5), ("Aménagement des parcelles (planage, diguettes, canaux)", 12.0, 15),
         ("Pompe, groupe et réseau d'irrigation", 6.0, 8), ("Magasin de stockage et aire de séchage", 5.0, 20),
         ("Petit matériel et motoculteur", 3.0, 5), ("Imprévus (capitalisés)", 1.5, 10)]
for i, (lib, m, d) in enumerate(immos, start=4):
    f.cell(i, 1, lib); x = f.cell(i, 2, m); x.fill = VERT; x.number_format = "0.0"
    y = f.cell(i, 3, d); y.fill = VERT
    z = f.cell(i, 4, f"=IF(C{i}=0,0,B{i}/C{i})"); z.number_format = "0.00"; z.fill = GRIS
f["A10"] = "Total immobilisations"; f["A10"].font = GRAS
f["B10"] = "=SUM(B4:B9)"; f["D10"] = "=SUM(D4:D9)"
f["B10"].number_format = "0.0"; f["D10"].number_format = "0.00"
f["A12"] = "Besoin en fonds de roulement (semences, engrais et main-d'œuvre payés avant la récolte)"; f["B12"] = 8.0; f["B12"].fill = VERT; f["B12"].number_format = "0.0"
suite = [
    (13, "Coût total du projet", "=B10+B12", "0.0", None),
    (14, "Part d'apport", 0.30, "0%", VERT),
    (15, "Apport", "=ROUND(B13*B14,1)", "0.0", None),
    (16, "Emprunt", "=B13-B15", "0.0", None),
    (17, "Taux d'intérêt", 0.09, "0%", VERT),
    (18, "Durée de l'emprunt (ans)", 7, "0", VERT),
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
    ("Chiffre d'affaires", "=Hypothèses!B25", "0.0"),
    ("Charges variables", "=Hypothèses!B27", "0.0"),
    ("Marge sur coûts variables", "=B3-B4", "0.0"),
    ("Taux de marge", "=IF(B3=0,0,B5/B3)", "0.0%"),
    ("Personnel permanent", "=Hypothèses!B19", "0.0"),
    ("Charges fixes", "=Hypothèses!B20", "0.0"),
    ("EBE", "=B5-B7-B8", "0.0"),
    ("Amortissements", "=Financement!D10", "0.0"),
    ("Résultat d'exploitation", "=B9-B10", "0.0"),
    ("Intérêts", "=Financement!B22", "0.0"),
    ("Résultat avant impôt", "=B11-B12", "0.0"),
    ("Impôt", "=MAX(0,B13*Hypothèses!B10)", "0.0"),
    ("Résultat net", "=B13-B14", "0.0"),
    ("Coûts fixes totaux (personnel, charges fixes, amortissements, intérêts)", "=B7+B8+B10+B12", "0.0"),
    ("Seuil de rentabilité (M FCFA de chiffre d'affaires)", "=IF(B6=0,0,ROUND(B16,1)/ROUND(B6,3))", "0.0"),
    ("Seuil en % du chiffre d'affaires", "=IF(B3=0,0,B17/B3)", "0%"),
    ("Marge de sécurité", "=1-B18", "0%"),
    ("Flux disponible pour la dette (EBE moins impôt)", "=B9-B14", "0.0"),
    ("Service de la dette (annuité)", "=Financement!B20", "0.0"),
    ("DSCR", "=IF(B21=0,0,B20/B21)", "0.00"),
    ("Coût complet par kilogramme (charges variables et coûts fixes totaux, avant impôt)", "=IF(Hypothèses!B24=0,0,(B4+B16)*1000/Hypothèses!B24)", "0.0"),
]
for i, (lib, fm, fmt) in enumerate(rows, start=3):
    n.cell(i, 1, lib); x = n.cell(i, 2, fm); x.number_format = fmt; x.fill = GRIS
n["C23"] = "FCFA par kg"
n.column_dimensions["A"].width = 80; n.column_dimensions["B"].width = 16

# ------------------------------------------------------------ Scénarios
s = wb.create_sheet("Scénarios")
s["A1"] = "Trois scénarios sur l'année 2 (cellules vertes = facteurs de test à modifier)"; s["A1"].font = TITRE
for col, t in zip("ABCD", ("", "Réaliste", "Pessimiste", "Mauvaise campagne")):
    s[f"{col}3"] = t; s[f"{col}3"].font = GRAS
facteurs = [
    ("Facteur de rendement (1 = prévu)", (1.0, 0.95, 0.80), "0.00"),
    ("Facteur de prix de vente (1 = prévu)", (1.0, 0.96, 0.95), "0.00"),
    ("Facteur engrais (1 = prévu)", (1.0, 1.10, 1.0), "0.00"),
    ("Facteur labour et battage (1 = prévu)", (1.0, 1.05, 1.0), "0.00"),
    ("Pertes supplémentaires (points de pourcentage)", (0.0, 0.0, 0.0), "0%"),
]
for i, (lib, vals, fmt) in enumerate(facteurs, start=4):
    s.cell(i, 1, lib)
    for j, v in enumerate(vals, start=2):
        x = s.cell(i, j, v); x.fill = VERT; x.number_format = fmt
s["A10"] = "Résultats (M FCFA)"; s["A10"].font = GRAS
for j, col in enumerate("BCD", start=2):
    formules = [
        f"=Hypothèses!$B$23*Hypothèses!$B$6*{col}4*(1-Hypothèses!$B$8-{col}8)*Hypothèses!$B$7*{col}5/1000000",
        f"=Hypothèses!$B$23*(Hypothèses!$B$12+Hypothèses!$B$14+Hypothèses!$B$17+Hypothèses!$B$18+Hypothèses!$B$13*{col}6+Hypothèses!$B$15+Hypothèses!$B$16*{col}7)",
        f"={col}11-{col}12-Hypothèses!$B$19-Hypothèses!$B$20",
        f"={col}13-Financement!$D$10-Financement!$B$22",
        f"=MAX(0,{col}14*Hypothèses!$B$10)",
        f"={col}13-{col}15",
        f"=IF(Financement!$B$20=0,0,{col}16/Financement!$B$20)",
    ]
    for r, fm in zip(range(11, 18), formules):
        x = s.cell(r, j, fm); x.fill = GRIS; x.number_format = "0.00" if r == 17 else "0.0"
libs = ["Chiffre d'affaires", "Charges variables", "EBE", "Résultat avant impôt", "Impôt", "Flux disponible pour la dette", "DSCR"]
for r, lib in zip(range(11, 18), libs):
    s.cell(r, 1, lib)
s["A19"] = "Un DSCR inférieur à 1 signifie que l'annuité n'est pas couverte. Testez aussi le rendement seul, puis le prix seul."
s.column_dimensions["A"].width = 52
for col in "BCD":
    s.column_dimensions[col].width = 20

# ------------------------------------------------------------ Stockage
t = wb.create_sheet("Stockage")
t["A1"] = "Vendre à la récolte ou plus tard (cellules vertes = à remplacer par vos relevés de prix de plusieurs années et vos frais)"; t["A1"].font = TITRE
ent = [
    ("Part de la récolte stockée", 0.40, "0%", "% de la récolte"),
    ("Hausse de prix après le stockage", 0.15, "0%", "hypothèse pédagogique : à relever sur votre marché"),
    ("Durée du stockage", 4, "0", "mois"),
    ("Frais de stockage (magasin, sacs, traitement, gardiennage)", 0.03, "0%", "% de la valeur stockée"),
    ("Pertes de stockage", 0.02, "0%", "% des quantités"),
    ("Coût de l'argent immobilisé", 0.09, "0%", "% par an"),
]
for i, (lib, v, fmt, u) in enumerate(ent, start=3):
    t.cell(i, 1, lib); x = t.cell(i, 2, v); x.fill = VERT; x.number_format = fmt; t.cell(i, 3, u)
t["A10"] = "Résultats calculés (M FCFA)"; t["A10"].font = GRAS
res = [
    ("Valeur de la récolte au prix de récolte", "=Hypothèses!B25", "0.0"),
    ("Valeur stockée au prix de récolte", "=B11*B3", "0.0"),
    ("Vente différée, après pertes et hausse de prix", "=B12*(1-B7)*(1+B4)", "0.0"),
    ("Frais de stockage", "=B12*B6", "0.0"),
    ("Coût de l'argent immobilisé", "=B12*B8*B5/12", "0.0"),
    ("Gain net du stockage", "=B13-B12-B14-B15", "0.0"),
    ("Hausse de prix minimale pour que le stockage rapporte", "=(1+B6+B8*B5/12)/(1-B7)-1", "0.0%"),
]
for i, (lib, fm, fmt) in enumerate(res, start=11):
    t.cell(i, 1, lib); x = t.cell(i, 2, fm); x.number_format = fmt; x.fill = GRIS
t.column_dimensions["A"].width = 62; t.column_dimensions["B"].width = 14; t.column_dimensions["C"].width = 50

# ------------------------------------------------------------ Calendrier
k = wb.create_sheet("Calendrier")
k["A1"] = "Calendrier cultural sur 12 mois : P (préparation), S (semis ou repiquage), E (entretien), R (récolte), V (vente), X (arrêt)"; k["A1"].font = TITRE
mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
k["A3"] = "Parcelle ou campagne"; k["A3"].font = GRAS
for j, m in enumerate(mois, start=2):
    k.cell(3, j, m).font = GRAS
    k.column_dimensions[k.cell(3, j).column_letter].width = 6
for i in range(4, 14):
    for j in range(1, 14):
        k.cell(i, j).fill = VERT
k["A15"] = "Conseil : placez les pointes de travail (repiquage, récolte, battage) avant de chiffrer la main-d'œuvre, et réservez les prestations à l'avance."
k.column_dimensions["A"].width = 34

wb.save(SORTIE)
print("écrit", SORTIE)
