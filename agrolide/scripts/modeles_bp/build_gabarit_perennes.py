# -*- coding: utf-8 -*-
"""Gabarit Excel du module « Cultures pérennes » (hypothèses du cas cacao-cote-d-ivoire, à remplacer par les vôtres).
Horizon 15 ans, financement avec différé, VAN, TRI, délai de récupération, DSCR.
Usage : python scripts/modeles_bp/build_gabarit_perennes.py ; puis recalculer avec recalc_excel.ps1."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

SORTIE = "public/documents/bp-agricole/Agrolide-gabarit-cultures-perennes.xlsx"
VERT = PatternFill("solid", fgColor="E2F0D9")
GRIS = PatternFill("solid", fgColor="F2F2F2")
GRAS = Font(bold=True)
TITRE = Font(bold=True, size=13)

wb = Workbook()

# ------------------------------------------------------------ Hypothèses
h = wb.active
h.title = "Hypothèses"
h["A1"] = "Hypothèses (cellules vertes = à remplacer par vos devis et vos relevés datés)"; h["A1"].font = TITRE
lignes = [
    ("Surface plantée", 20, "hectares", "0.0"),
    ("Rendement de croisière", 900, "kg par hectare", "#,##0"),
    ("Prix de vente", 1800, "FCFA/kg", "#,##0"),
    ("Entretien pendant l'installation", 0.25, "M FCFA par hectare et par an", "0.00"),
    ("Entretien en production", 0.30, "M FCFA par hectare et par an", "0.00"),
    ("Années d'installation (entretien réduit, cultures associées)", 3, "années", "0"),
    ("Recettes des cultures associées", 3.0, "M FCFA par an pendant l'installation", "0.0"),
    ("Coût de récolte et de post-récolte", 250, "FCFA par kg", "#,##0"),
    ("Personnel permanent", 3.6, "M FCFA par an", "0.0"),
    ("Charges fixes", 1.2, "M FCFA par an", "0.0"),
    ("Taux d'impôt sur les bénéfices", 0.25, "", "0%"),
    ("Taux d'actualisation", 0.10, "", "0%"),
    ("Part d'apport dans le coût du projet", 0.40, "", "0%"),
    ("Taux d'intérêt de l'emprunt", 0.09, "", "0.0%"),
    ("Durée de l'emprunt", 14, "années", "0"),
    ("Différé (intérêts seuls)", 5, "années", "0"),
    ("Années prises en compte pour les déficits d'exploitation", 5, "années", "0"),
    ("Test : facteur sur le rendement (1 = inchangé)", 1.0, "ex. 0,9 pour − 10 %", "0.00"),
    ("Test : facteur sur le prix (1 = inchangé)", 1.0, "ex. 0,7 pour − 30 %", "0.00"),
    ("Test : facteur sur l'entretien en production (1 = inchangé)", 1.0, "ex. 1,1 pour + 10 %", "0.00"),
]
for i, (lib, val, unite, fmt) in enumerate(lignes, start=3):
    h.cell(i, 1, lib); x = h.cell(i, 2, val); x.fill = VERT; x.number_format = fmt; h.cell(i, 3, unite)
h["A24"] = "Immobilisations"; h["A24"].font = GRAS
for j, t in enumerate(["Poste", "Montant (M FCFA)", "Durée d'amortissement (ans)", "Valeur nette année 15"], start=1):
    h.cell(25, j, t).font = GRAS
immos = [
    ("Frais d'établissement et agréments", 0.5, 5),
    ("Installation de la plantation (préparation, plants, ombrage, pare-feu)", 18.0, 25),
    ("Fermentoir, séchoir et magasin", 4.0, 20),
    ("Forage, outillage et petit matériel", 3.0, 8),
    ("Imprévus (capitalisés)", 1.5, 10),
]
for i, (lib, m, d) in enumerate(immos, start=26):
    h.cell(i, 1, lib)
    x = h.cell(i, 2, m); x.fill = VERT
    y = h.cell(i, 3, d); y.fill = VERT
    z = h.cell(i, 4, f"=MAX(0,B{i}-15*B{i}/C{i})"); z.fill = GRIS; z.number_format = "0.0"
h["A31"] = "Total"; h["A31"].font = GRAS
h["B31"] = "=SUM(B26:B30)"; h["D31"] = "=SUM(D26:D30)"
h["A32"] = "Amortissement annuel (constant, simplification du cas)"
h["B32"] = "=B26/C26+B27/C27+B28/C28+B29/C29+B30/C30"
for c in ("B31", "D31", "B32"):
    h[c].number_format = "0.00"; h[c].fill = GRIS
h.column_dimensions["A"].width = 66; h.column_dimensions["B"].width = 18; h.column_dimensions["C"].width = 40; h.column_dimensions["D"].width = 20
H = lambda r: f"Hypothèses!$B${r}"
HA, HR, HP, HEI, HE, HAI, HAS, HRC, HPE, HF, HIS, HACT, HAP, HTX, HDU, HDI, HAD, FR, FP, FE = [H(r) for r in range(3, 23)]

# ------------------------------------------------------------ Plantation (15 ans)
p = wb.create_sheet("Plantation")
p["A1"] = "Résultat d'exploitation sur 15 ans (millions de FCFA) — saisissez la montée en production (colonne B)"; p["A1"].font = TITRE
ent = ["Année", "Part du rendement de croisière", "Récolte (kg)", "CA des fèves", "CA cultures associées", "Entretien", "Récolte et post-récolte", "EBE", "Impôt (flux du projet)", "Flux du projet"]
for j, t in enumerate(ent, start=1):
    x = p.cell(3, j, t); x.font = GRAS; x.alignment = Alignment(wrap_text=True)
rampe = [0, 0, 0, 0.25, 0.5, 0.75] + [1.0] * 9
for k in range(15):
    r = 4 + k
    p.cell(r, 1, k + 1)
    x = p.cell(r, 2, rampe[k]); x.fill = VERT; x.number_format = "0%"
    p.cell(r, 3, f"={HA}*{HR}*{FR}*B{r}").number_format = "#,##0"
    p.cell(r, 4, f"=C{r}*{HP}*{FP}/1000000").number_format = "0.0"
    p.cell(r, 5, f"=IF(A{r}<={HAI},{HAS},0)").number_format = "0.0"
    p.cell(r, 6, f"={HA}*IF(A{r}<={HAI},{HEI},{HE}*{FE})").number_format = "0.0"
    p.cell(r, 7, f"=C{r}*{HRC}/1000000").number_format = "0.0"
    p.cell(r, 8, f"=D{r}+E{r}-F{r}-G{r}-{HPE}-{HF}").number_format = "0.0"
    p.cell(r, 9, f"=MAX(0,(H{r}-Hypothèses!$B$32)*{HIS})").number_format = "0.0"
    p.cell(r, 10, f"=H{r}-I{r}" + ("+Hypothèses!$D$31" if k == 14 else "")).number_format = "0.0"
    for j in range(3, 11):
        p.cell(r, j).fill = GRIS
p["A20"] = "L'année 15 du flux du projet inclut la valeur nette comptable restante des immobilisations."
p.column_dimensions["A"].width = 10
for col in "BCDEFGHIJ":
    p.column_dimensions[col].width = 17
p.row_dimensions[3].height = 48

# ------------------------------------------------------------ Financement
f = wb.create_sheet("Financement")
f["A1"] = "Coût du projet et financement (millions de FCFA)"; f["A1"].font = TITRE
res = [
    ("Immobilisations", "=Hypothèses!B31", "0.0"),
    ("Déficits d'exploitation des premières années", f'=-SUMIFS(Plantation!H4:H18,Plantation!H4:H18,"<0",Plantation!A4:A18,"<="&{HAD})', "0.0"),
    ("Coût total du projet", f"=(B3+B4)/(1-(1-{HAP})*{HTX}*{HDI})", "0.0"),
    ("dont intérêts payés pendant le différé", "=B5-B3-B4", "0.0"),
    ("Emprunt", f"=B5*(1-{HAP})", "0.0"),
    ("Apport", "=B5-B7", "0.0"),
    ("Annuité constante après le différé", f"=PMT({HTX},{HDU}-{HDI},-B7)", "0.00"),
]
for i, (lib, formule, fmt) in enumerate(res, start=3):
    f.cell(i, 1, lib); x = f.cell(i, 2, formule); x.number_format = fmt; x.fill = GRIS
f["A11"] = "Remboursement sur 15 ans"; f["A11"].font = GRAS
ent = ["Année", "Capital début d'année", "Intérêts", "Remboursement du capital", "Service de la dette", "Capital fin d'année", "Résultat avant impôt", "Perte reportable", "Impôt", "DSCR"]
for j, t in enumerate(ent, start=1):
    x = f.cell(12, j, t); x.font = GRAS; x.alignment = Alignment(wrap_text=True)
for k in range(15):
    r = 13 + k
    pr = 4 + k
    f.cell(r, 1, k + 1)
    f.cell(r, 2, "=B7" if k == 0 else f"=F{r-1}")
    f.cell(r, 3, f"=B{r}*{HTX}")
    f.cell(r, 4, f"=IF(OR(A{r}<={HDI},A{r}>{HDU}),0,$B$9-C{r})")
    f.cell(r, 5, f"=C{r}+D{r}")
    f.cell(r, 6, f"=B{r}-D{r}")
    f.cell(r, 7, f"=Plantation!H{pr}-Hypothèses!$B$32-C{r}")
    f.cell(r, 8, f"=MAX(0,-G{r})" if k == 0 else f"=MAX(0,-(G{r}-H{r-1}))")
    f.cell(r, 9, f"=MAX(0,G{r})*{HIS}" if k == 0 else f"=MAX(0,G{r}-H{r-1})*{HIS}")
    f.cell(r, 10, f'=IF(D{r}>0.000001,(Plantation!H{pr}-I{r})/E{r},"")')
    for j in range(2, 10):
        f.cell(r, j).number_format = "0.0"
    f.cell(r, 10).number_format = "0.00"
    for j in range(2, 11):
        f.cell(r, j).fill = GRIS
f.column_dimensions["A"].width = 46
for col in "BCDEFGHIJ":
    f.column_dimensions[col].width = 16
f.row_dimensions[12].height = 32

# ------------------------------------------------------------ Indicateurs
d = wb.create_sheet("Indicateurs")
d["A1"] = "Indicateurs sur 15 ans"; d["A1"].font = TITRE
for j, t in enumerate(["Année", "Flux du projet", "Flux cumulé", "Récupération (année)"], start=1):
    d.cell(3, j, t).font = GRAS
d["A4"] = 0; d["B4"] = "=-Hypothèses!B31"; d["C4"] = "=B4"
for k in range(15):
    r = 5 + k
    d.cell(r, 1, k + 1)
    d.cell(r, 2, f"=Plantation!J{4+k}")
    d.cell(r, 3, f"=C{r-1}+B{r}")
    d.cell(r, 4, f'=IF(AND(C{r}>=0,C{r-1}<0,B{r}>0),A{r-1}+(-C{r-1})/B{r},"")')
    for j in range(2, 5):
        d.cell(r, j).number_format = "0.0"
        d.cell(r, j).fill = GRIS
d["F3"] = "Indicateur"; d["F3"].font = GRAS; d["G3"] = "Valeur"; d["G3"].font = GRAS
ind = [
    ("VAN du projet", f"=B4+NPV({HACT},B5:B19)", "0.0"),
    ("TRI du projet", "=IRR(B4:B19)", "0.0%"),
    ("Délai de récupération (années)", '=IF(COUNT(D5:D19)=0,"au-delà de 15 ans",MIN(D5:D19))', "0.0"),
    ("DSCR le plus bas (après le début des remboursements)", "=MIN(Financement!J13:J27)", "0.00"),
    ("EBE de croisière", "=Plantation!H18", "0.0"),
    ("Chiffre d'affaires de croisière", "=Plantation!D18+Plantation!E18", "0.0"),
]
for i, (lib, formule, fmt) in enumerate(ind, start=4):
    d.cell(i, 6, lib); x = d.cell(i, 7, formule); x.number_format = fmt; x.fill = GRIS
d["F12"] = "Pour tester un scénario, changez les trois facteurs en bas de la feuille Hypothèses : pessimiste = 0,9 / 0,9 / 1,1 ; crise de prix = 1 / 0,7 / 1."
d.column_dimensions["A"].width = 10
for col in "BCD":
    d.column_dimensions[col].width = 20
d.column_dimensions["F"].width = 56; d.column_dimensions["G"].width = 20

wb.save(SORTIE)
print("écrit", SORTIE)
