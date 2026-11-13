# -*- coding: utf-8 -*-
"""
Génère le classeur « Modèle financier du business plan agricole » (SYSCOHADA), pré-rempli avec le cas Diap Touré.
Usage : python scripts/modeles_bp/build_modele_financier.py <fichier.xlsx>
Toutes les valeurs numériques en bleu sont des hypothèses modifiables ; tout le reste est calculé.
Montants en millions de FCFA (M FCFA). Les chiffres du cas viennent de CAS-FIL-ROUGE-reference.md.
"""
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.formatting.rule import CellIsRule, FormulaRule

C_DG, C_MG, C_LG, C_W = "1B4332", "2D6A4F", "D8F3DC", "FFFFFF"
C_AB, C_AF = "FFF3CD", "856404"
F_TITLE = Font(name="Calibri", size=14, bold=True, color=C_W)
F_SUB = Font(name="Calibri", size=10, italic=True, color=C_W)
F_HEAD = Font(name="Calibri", size=10, bold=True, color=C_W)
F_IN = Font(name="Calibri", size=10, color="0000FF")
F_CALC = Font(name="Calibri", size=10, color="000000")
F_BOLD = Font(name="Calibri", size=10, bold=True, color="000000")
F_NOTE = Font(name="Calibri", size=9, italic=True, color="555555")
FILL_DG = PatternFill("solid", fgColor=C_DG)
FILL_MG = PatternFill("solid", fgColor=C_MG)
FILL_LG = PatternFill("solid", fgColor=C_LG)
FILL_AB = PatternFill("solid", fgColor=C_AB)
THIN = Side(style="thin", color="BBBBBB")
THICK = Side(style="medium", color=C_DG)
B_ALL = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
NUM = '#,##0.00;[Red]-#,##0.00'
NUM1 = '#,##0.0;[Red]-#,##0.0'
PCT = '0.0%'
PCT0 = '0%'

wb = Workbook()
REG = {}  # nom -> adresse absolue « 'FEUILLE'!$C$5 »


def sheet(name, title, sub, widths, first=False):
    ws = wb.active if first else wb.create_sheet()
    ws.title = name
    ws.sheet_view.showGridLines = False
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[L(i)].width = w
    n = len(widths)
    for r, (txt, f) in enumerate([(title, F_TITLE), (sub, F_SUB)], 1):
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=n)
        c = ws.cell(r, 1, txt)
        c.font, c.fill = f, FILL_DG
        c.alignment = Alignment(vertical="center", indent=1)
        ws.row_dimensions[r].height = 24 if r == 1 else 18
    return ws


def reg(ws, name, row, col):
    REG[name] = f"'{ws.title}'!${L(col)}${row}"
    return REG[name]


def R(name):
    return REG[name]


def head(ws, row, labels, start=1):
    for i, t in enumerate(labels):
        c = ws.cell(row, start + i, t)
        c.font, c.fill, c.border = F_HEAD, FILL_MG, B_ALL
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[row].height = 30


def section(ws, row, text, ncols):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=ncols)
    c = ws.cell(row, 1, text)
    c.font, c.fill = F_HEAD, FILL_MG
    c.alignment = Alignment(indent=1)


def cell(ws, row, col, value, kind="calc", fmt=None, bold=False, fill=None, wrap=False, align=None):
    c = ws.cell(row, col, value)
    c.font = F_IN if kind == "in" else (F_BOLD if bold else F_CALC)
    if kind == "in":
        c.fill = FILL_AB
    if fill:
        c.fill = fill
    c.border = B_ALL
    if fmt:
        c.number_format = fmt
    if wrap or align:
        c.alignment = Alignment(wrap_text=wrap, horizontal=align, vertical="center")
    return c


def total_row(ws, row, ncols, start=1):
    for col in range(start, ncols + 1):
        c = ws.cell(row, col)
        c.font, c.fill = F_HEAD, FILL_DG
        c.border = Border(left=THIN, right=THIN, top=THICK, bottom=THICK)


def note(ws, row, text, ncols):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=ncols)
    c = ws.cell(row, 1, text)
    c.font = F_NOTE
    c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[row].height = max(15, 13 * (1 + len(text) // 110))


def zebra(ws, r1, r2, ncols):
    for r in range(r1, r2 + 1):
        if (r - r1) % 2 == 0:
            for col in range(1, ncols + 1):
                c = ws.cell(r, col)
                if c.fill is None or c.fill.fgColor.rgb in (None, "00000000"):
                    c.fill = FILL_LG


# ======================================================================================
# ACCUEIL (rempli à la fin, mais créé en premier pour l'index 0)
# ======================================================================================
wsA = sheet("ACCUEIL", "MODÈLE FINANCIER — BUSINESS PLAN AGRICOLE (SYSCOHADA)",
            "Pré-rempli avec le cas fil rouge « Diap Touré » (maraîchage oignon / pomme de terre, Niayes, Sénégal) · Montants en millions de FCFA",
            [4, 30, 78, 16], first=True)

# ======================================================================================
# HYPOTHESES
# ======================================================================================
ws = sheet("HYPOTHESES", "HYPOTHÈSES DU PROJET",
           "Toutes les cellules bleues sur fond jaune sont à remplacer par VOS chiffres (devis, enquêtes, relevés de prix datés)",
           [44, 14, 14, 70])
r = 4
head(ws, r, ["Hypothèse", "Valeur", "Unité", "Source / commentaire à compléter"])
r += 1


def hyp(name, label, value, unit, comment, fmt=None, kind="in"):
    global r
    cell(ws, r, 1, label)
    cell(ws, r, 2, value, kind, fmt)
    cell(ws, r, 3, unit)
    cell(ws, r, 4, comment, wrap=True)
    reg(ws, name, r, 2)
    r += 1


def sec(text):
    global r
    section(ws, r, text, 4)
    r += 1


sec("1. Le projet")
hyp("entite", "Nom de l'entreprise", "Ferme Touré Niayes (SUARL)", "", "Forme : SARLU (SUARL au Sénégal)", None)
hyp("pays", "Pays / zone", "Sénégal · Niayes", "", "Cas pédagogique reconstitué, chiffres à remplacer", None)
sec("2. Surfaces, rendements et pertes")
hyp("ha_o", "Oignon : surface (contre-saison froide)", 7, "ha", "Assolement du cas Diap Touré", '0.0')
hyp("ha_p", "Pomme de terre : surface (contre-saison froide)", 3, "ha", "", '0.0')
hyp("ha_h", "Gombo / maïs doux : surface (hivernage)", 3, "ha", "7 ha en engrais vert pendant l'hivernage", '0.0')
hyp("rd_o", "Oignon : rendement brut", 28, "t/ha", "À justifier par l'itinéraire technique (leçon 3.1)", '0.0')
hyp("rd_p", "Pomme de terre : rendement brut", 25, "t/ha", "", '0.0')
hyp("rd_h", "Gombo / maïs doux : rendement brut", 8, "t/ha", "", '0.0')
hyp("pt_o", "Oignon : pertes post-récolte", 0.10, "%", "Séchage, tri, stockage", PCT)
hyp("pt_p", "Pomme de terre : pertes", 0.08, "%", "", PCT)
hyp("pt_h", "Gombo / maïs doux : pertes", 0.10, "%", "", PCT)
hyp("mont", "Année 1 : part de la pleine production", 0.85, "%", "Montée en puissance (année 0 = installation, sans CA)", PCT0)
sec("3. Prix de vente (à dater et sourcer)")
hyp("px_or", "Oignon vendu à la récolte", 160, "FCFA/kg", "Enquête auprès des grossistes (leçon 2.2)", '#,##0')
hyp("px_os", "Oignon stocké, vendu de juin à août", 260, "FCFA/kg", "Gain de stockage ≈ 100 FCFA/kg (leçon 2.3)", '#,##0')
hyp("part_s", "Part de l'oignon stockée sous hangar", 0.40, "% volume", "", PCT0)
cell(ws, r, 1, "Oignon : prix moyen pondéré"); cell(ws, r, 2, f"=(1-{R('part_s')})*{R('px_or')}+{R('part_s')}*{R('px_os')}", "calc", '#,##0.0')
cell(ws, r, 3, "FCFA/kg"); cell(ws, r, 4, "Calculé : 60 % × 160 + 40 % × 260 = 200 FCFA/kg"); reg(ws, "px_o", r, 2); r += 1
hyp("px_p", "Pomme de terre", 230, "FCFA/kg", "", '#,##0')
hyp("px_h", "Gombo / maïs doux", 150, "FCFA/kg", "", '#,##0')
sec("4. Scénarios (leçon 5.3) : écarts appliqués au scénario réaliste")
head(ws, r, ["Scénario", "Rendement (×)", "Pertes (± points)", "Prix (×)"]); r += 1
SCEN = [("re", "Réaliste", 1.0, 0.0, 1.0), ("pe", "Pessimiste", 0.9, 0.03, 0.9),
        ("op", "Optimiste", 1.1, -0.03, 1.2), ("cr", "Crise de prix", 1.0, 0.0, 0.75)]
for k, nom, a, b, c_ in SCEN:
    cell(ws, r, 1, nom, bold=True)
    cell(ws, r, 2, a, "in", '0.00'); reg(ws, f"fr_{k}", r, 2)
    cell(ws, r, 3, b, "in", '0.0%'); reg(ws, f"dp_{k}", r, 3)
    cell(ws, r, 4, c_, "in", '0.00'); reg(ws, f"fp_{k}", r, 4)
    r += 1
sec("5. Fiscalité et évaluation")
hyp("is", "Taux d'impôt sur les bénéfices", 0.30, "%", "Exemple pédagogique : vérifier le taux, les exonérations agricoles et l'impôt minimum de votre pays", PCT0)
hyp("act", "Taux d'actualisation (VAN)", 0.10, "%", "Coût de l'emprunt (9 %) + prime de risque : à justifier", PCT0)
hyp("dscr_min", "DSCR minimum exigé par la banque", 1.2, "×", "En général 1,2 à 1,3 : à confirmer auprès de votre banque", '0.00')
sec("6. Financement")
hyp("p_app", "Apport personnel (part du coût du projet)", 0.20, "%", "Les banques exigent souvent 10 à 30 %", PCT0)
hyp("tx", "Taux d'intérêt de l'emprunt", 0.09, "%", "Taux supposé : à remplacer par l'offre de votre banque", PCT)
hyp("du", "Durée de l'emprunt (différé compris)", 7, "ans", "", '0')
hyp("di", "Différé de remboursement du capital", 1, "an", "Pendant le différé, seuls les intérêts sont payés", '0')
sec("7. BFR et clôture de l'année 1")
hyp("p_cf", "Crédit fournisseurs (part des intrants payée à 60 jours)", 0.40, "%", "", PCT0)
hyp("secu", "Marge de sécurité du BFR", 0.6, "M FCFA", "Aléas", NUM)
hyp("mois", "Mois sans encaissement significatif", 5, "mois", "De la pépinière aux premières ventes", '0')
hyp("cl_a1", "Créances clients au 31/12 de l'année 1", 2.0, "M FCFA", "Ventes non encaissées en fin d'année", NUM)
hyp("fo_a1", "Dettes fournisseurs en fin d'année 1", 1.0, "M FCFA", "", NUM)
r += 1
note(ws, r, "Couleurs : bleu sur fond jaune = hypothèse à saisir ; noir = calcul automatique. Ne saisissez rien dans les cellules noires.", 4)
ws.freeze_panes = "A5"

# ======================================================================================
# CHARGES
# ======================================================================================
ws = sheet("CHARGES", "CHARGES D'EXPLOITATION", "Charges variables par poste et par hectare (leçon 3.1), charges fixes et personnel · M FCFA",
           [46, 14, 14, 14, 14, 50])
r = 4
section(ws, r, "A. Charges variables de culture : coût par hectare (M FCFA/ha)", 6); r += 1
head(ws, r, ["Poste", "Oignon", "Pomme de terre", "Gombo / maïs doux", "Total /ha", "Nature"]); r += 1
POSTES = [("Semences, plants, pépinière", .15, 1.10, .08, "Intrant"), ("Fertilisation (fumure, NPK, urée)", .40, .50, .20, "Intrant"),
          ("Produits phytosanitaires", .15, .20, .07, "Intrant"), ("Énergie et entretien de l'irrigation", .10, .10, .05, "Intrant"),
          ("Journaliers avant récolte (pépinière, repiquage, entretien)", .20, .20, .10, "Journaliers avant récolte"),
          ("Journaliers de récolte, séchage et tri", .15, .15, .05, "Journaliers de récolte"),
          ("Filets, sacs, étiquettes et divers", .15, .15, .05, "Emballages")]
p0 = r
for lab, a, b, c_, nat in POSTES:
    cell(ws, r, 1, lab)
    for j, v in enumerate((a, b, c_)):
        cell(ws, r, 2 + j, v, "in", NUM)
    cell(ws, r, 5, f"=SUM(B{r}:D{r})", "calc", NUM)
    cell(ws, r, 6, nat)
    r += 1
p1 = r - 1
cell(ws, r, 1, "Coût variable total par hectare", bold=True)
for col in range(2, 6):
    cell(ws, r, col, f"=SUM({L(col)}{p0}:{L(col)}{p1})", "calc", NUM, bold=True)
reg(ws, "cv_ha_o", r, 2); reg(ws, "cv_ha_p", r, 3); reg(ws, "cv_ha_h", r, 4)
total_row(ws, r, 6); r += 1
cell(ws, r, 1, "Surface cultivée (ha)")
cell(ws, r, 2, f"={R('ha_o')}", "calc", '0.0'); cell(ws, r, 3, f"={R('ha_p')}", "calc", '0.0'); cell(ws, r, 4, f"={R('ha_h')}", "calc", '0.0'); cell(ws, r, 5, "")
srow = r; r += 1
cell(ws, r, 1, "Coût variable de la campagne (M FCFA)", bold=True)
for col in range(2, 5):
    cell(ws, r, col, f"={L(col)}{r-2}*{L(col)}{srow}", "calc", NUM, bold=True)
cell(ws, r, 5, f"=SUM(B{r}:D{r})", "calc", NUM, bold=True)
reg(ws, "cv_o", r, 2); reg(ws, "cv_p", r, 3); reg(ws, "cv_h", r, 4); reg(ws, "cv_tot", r, 5)
cell(ws, r, 6, "Charges variables annuelles du compte de résultat")
r += 2
section(ws, r, "B. Ventilation utile au BFR et à la trésorerie (contre-saison froide : oignon + pomme de terre)", 6); r += 1
head(ws, r, ["Rubrique", "Montant (M FCFA)", "", "", "", "Utilisé dans"]); r += 1


def ventil(name, label, formula, usage):
    global r
    cell(ws, r, 1, label); cell(ws, r, 2, formula, "calc", NUM); cell(ws, r, 6, usage); reg(ws, name, r, 2); r += 1


rowsel = {"i": p0, "ja": p0 + 4, "jr": p0 + 5, "em": p0 + 6}
ventil("int_f", "Intrants (semences, fertilisation, phytosanitaires, énergie)",
       f"=B{srow}*SUM(B{p0}:B{p0+3})+C{srow}*SUM(C{p0}:C{p0+3})", "BFR, trésorerie (crédit fournisseurs)")
ventil("ja_f", "Journaliers avant récolte", f"=B{srow}*B{rowsel['ja']}+C{srow}*C{rowsel['ja']}", "BFR, trésorerie")
ventil("jr_f", "Journaliers de récolte, séchage et tri", f"=B{srow}*B{rowsel['jr']}+C{srow}*C{rowsel['jr']}", "Trésorerie")
ventil("em_f", "Filets, sacs et divers", f"=B{srow}*B{rowsel['em']}+C{srow}*C{rowsel['em']}", "Trésorerie")
ventil("hv_f", "Charges variables de l'hivernage (gombo / maïs doux)", f"={R('cv_h')}", "Trésorerie")
cell(ws, r, 1, "Contrôle : somme = charges variables totales", bold=True)
cell(ws, r, 2, f"=IF(ABS({R('int_f')}+{R('ja_f')}+{R('jr_f')}+{R('em_f')}+{R('hv_f')}-{R('cv_tot')})<0.001,\"✅ OK\",\"❌ écart\")", "calc")
r += 2
section(ws, r, "C. Charges fixes annuelles (M FCFA/an)", 6); r += 1
head(ws, r, ["Poste", "M FCFA/an", "", "", "", "Commentaire"]); r += 1
f0 = r
for lab, v, cm in [("Assurance agricole", 0.9, "Prime annuelle (devis à joindre, leçon 6.1)"), ("Entretien du matériel, du forage et du hangar", 1.2, ""),
                   ("Énergie et eau hors culture", 0.9, ""), ("Commercial et marketing", 1.0, "400 000 étiquettes + 350 000 déplacements + 150 000 téléphone + 100 000 échantillons (leçon 4.2)"),
                   ("Comptabilité, frais bancaires et généraux", 0.5, "")]:
    cell(ws, r, 1, lab); cell(ws, r, 2, v, "in", NUM); cell(ws, r, 6, cm, wrap=True); r += 1
cell(ws, r, 1, "Total charges fixes", bold=True); cell(ws, r, 2, f"=SUM(B{f0}:B{r-1})", "calc", NUM, bold=True); reg(ws, "cf", r, 2); total_row(ws, r, 6); r += 2
section(ws, r, "D. Personnel permanent (M FCFA/an)", 6); r += 1
head(ws, r, ["Poste", "M FCFA/an", "", "", "", "Commentaire"]); r += 1
q0 = r
for lab, v, cm in [("Gérant (Diap Touré)", 1.8, ""), ("Chef de culture", 1.6, "Indispensable : veille sur les cultures au quotidien"),
                   ("Responsable irrigation et maintenance", 0.9, "Solaire et goutte-à-goutte"), ("2 ouvriers agricoles permanents", 1.0, "2 × 0,5"),
                   ("Gardien", 0.4, ""), ("Cotisations sociales", 0.8, "Taux et plafonds à vérifier dans votre pays")]:
    cell(ws, r, 1, lab); cell(ws, r, 2, v, "in", NUM); cell(ws, r, 6, cm, wrap=True); r += 1
cell(ws, r, 1, "Total personnel", bold=True); cell(ws, r, 2, f"=SUM(B{q0}:B{r-1})", "calc", NUM, bold=True); reg(ws, "pers", r, 2); total_row(ws, r, 6); r += 2
note(ws, r, "Les journaliers (repiquage, récolte, tri) sont des charges variables : ils figurent dans le tableau A. Les coûts à l'hectare viennent de la leçon 3.1 ; remplacez-les par vos devis.", 6)
ws.freeze_panes = "B4"

# ======================================================================================
# INVESTISSEMENTS
# ======================================================================================
ws = sheet("INVESTISSEMENTS", "INVESTISSEMENTS ET AMORTISSEMENTS", "Coût du projet (leçon 5.1) et amortissements linéaires (leçon 5.4) · M FCFA",
           [46, 14, 12, 12, 12, 12, 12, 12, 12, 14])
r = 4
section(ws, r, "A. Coût du projet", 10); r += 1
head(ws, r, ["Poste", "Montant", "Durée amort. (ans)", "Taux", "", "", "", "", "", "Commentaire"]); r += 1
IMM = [("Frais d'établissement (notaire, études, bail)", 0.6, 5), ("Aménagements et forage", 12.0, 10),
       ("Système solaire, pompage et irrigation goutte-à-goutte", 14.8, 10), ("Hangar de séchage et de stockage (150 t)", 7.2, 20),
       ("Tricycle et petit matériel", 4.0, 5), ("Imprévus (capitalisés)", 2.4, 10)]
i0 = r
for lab, v, d in IMM:
    cell(ws, r, 1, lab); cell(ws, r, 2, v, "in", NUM); cell(ws, r, 3, d, "in", '0'); cell(ws, r, 4, f"=1/C{r}", "calc", PCT); r += 1
i1 = r - 1
cell(ws, r, 1, "Total immobilisations", bold=True); cell(ws, r, 2, f"=SUM(B{i0}:B{i1})", "calc", NUM, bold=True); reg(ws, "immos", r, 2); total_row(ws, r, 10); r += 1
cell(ws, r, 1, "Besoin en fonds de roulement initial (feuille BFR)"); cell(ws, r, 2, "=ROUND(BFR!$B$14,1)", "calc", NUM); reg(ws, "bfr", r, 2); r += 1
cell(ws, r, 1, "COÛT TOTAL DU PROJET", bold=True); cell(ws, r, 2, f"={R('immos')}+{R('bfr')}", "calc", NUM, bold=True); reg(ws, "cout", r, 2); total_row(ws, r, 10); r += 2
section(ws, r, "B. Tableau des amortissements (linéaire, la valeur nette comptable ne devient jamais négative)", 10); r += 1
head(ws, r, ["Poste", "Base", "An 1", "An 2", "An 3", "An 4", "An 5", "Cumul 5 ans", "VNC fin An 5", ""]); r += 1
a0 = r
for k in range(len(IMM)):
    src = i0 + k
    cell(ws, r, 1, f"=A{src}"); cell(ws, r, 2, f"=B{src}", "calc", NUM)
    for y in range(5):
        col = 3 + y
        prev = f"SUM($C{r}:{L(col-1)}{r})" if y else "0"
        cell(ws, r, col, f"=MAX(0,MIN($B{r}/$C{src},$B{r}-{prev}))", "calc", NUM)
    cell(ws, r, 8, f"=SUM(C{r}:G{r})", "calc", NUM); cell(ws, r, 9, f"=B{r}-H{r}", "calc", NUM)
    r += 1
cell(ws, r, 1, "TOTAL", bold=True)
for col in range(2, 10):
    cell(ws, r, col, f"=SUM({L(col)}{a0}:{L(col)}{r-1})", "calc", NUM, bold=True)
total_row(ws, r, 10)
for y in range(5):
    reg(ws, f"am{y+1}", r, 3 + y)
reg(ws, "vnc5", r, 9)
r += 1
cell(ws, r, 1, "Valeur nette comptable en fin d'année", bold=True)
for y in range(5):
    col = 3 + y
    cell(ws, r, col, f"=$B{r-1}-SUM($C{r-1}:{L(col)}{r-1})", "calc", NUM)
reg(ws, "vnc1", r, 3)
r += 2
note(ws, r, "Les imprévus sont capitalisés avec les investissements, comme dans le cas Diap (coût du projet 55,0 dont 41,0 d'immobilisations). Les durées d'amortissement sont des exemples : adoptez celles de votre plan comptable et de la fiscalité de votre pays.", 10)
ws.freeze_panes = "B4"

# ======================================================================================
# BFR
# ======================================================================================
ws = sheet("BFR", "BESOIN EN FONDS DE ROULEMENT INITIAL", "Méthode du premier cycle (leçon 5.2) · M FCFA", [58, 16, 70])
r = 4
head(ws, r, ["Élément", "M FCFA", "Calcul"]); r += 1
BF = [("Intrants de la contre-saison froide (oignon + pomme de terre)", f"={R('int_f')}", "Feuille CHARGES, tableau B"),
      ("Journaliers avant la récolte", f"={R('ja_f')}", "Pépinière, repiquage, entretien"),
      ("Salaires de l'équipe permanente sur la période", f"={R('pers')}/12*{R('mois')}", "Personnel annuel ÷ 12 × mois sans encaissement"),
      ("Charges fixes sur la période", f"={R('cf')}/12*{R('mois')}", "Charges fixes annuelles ÷ 12 × mois"),
      ("− Crédit fournisseurs obtenu", f"=-{R('p_cf')}*{R('int_f')}", "40 % des intrants payés à 60 jours"),
      ("Marge de sécurité", f"={R('secu')}", "Aléas")]
for lab, f, cm in BF:
    cell(ws, r, 1, lab); cell(ws, r, 2, f, "calc", NUM); cell(ws, r, 3, cm); r += 1
# la ligne 14 doit porter le total : on place des lignes vides pour l'alignement stable
while r < 13:
    r += 1
cell(ws, 13, 1, "")
cell(ws, 14, 1, "BFR INITIAL À FINANCER", bold=True)
cell(ws, 14, 2, "=SUM(B5:B10)", "calc", NUM, bold=True)
total_row(ws, 14, 3)
cell(ws, 14, 3, "Arrondi à 0,1 M FCFA dans le plan de financement (14,0 pour Diap)")
note(ws, 16, "Au sens comptable SYSCOHADA, BFR = (stocks + créances) − dettes à court terme. La méthode ci-dessus en est l'équivalent pratique pour une exploitation qui démarre : le montant à financer est le creux de trésorerie avant les premières ventes (voir feuille TRESORERIE).", 3)

# ======================================================================================
# FINANCEMENT
# ======================================================================================
ws = sheet("FINANCEMENT", "PLAN DE FINANCEMENT ET TABLEAU DE LA DETTE", "Emplois = ressources (leçon 5.1) · emprunt avec différé (leçon 5.7) · M FCFA",
           [44, 16, 16, 16, 16, 16])
r = 4
head(ws, r, ["EMPLOIS", "M FCFA", "", "RESSOURCES", "M FCFA", "Part"]); r += 1
EMP = [("Frais d'établissement", "=INVESTISSEMENTS!B6"), ("Aménagements et forage", "=INVESTISSEMENTS!B7"),
       ("Matériel (solaire, hangar, tricycle)", "=SUM(INVESTISSEMENTS!B8:B10)"), ("Imprévus", "=INVESTISSEMENTS!B11"),
       ("BFR initial", f"={R('bfr')}")]
e0 = r
for lab, f in EMP:
    cell(ws, r, 1, lab); cell(ws, r, 2, f, "calc", NUM); r += 1
cell(ws, r, 1, "TOTAL EMPLOIS", bold=True); cell(ws, r, 2, f"=SUM(B{e0}:B{r-1})", "calc", NUM, bold=True); reg(ws, "emplois", r, 2); total_row(ws, r, 3)
cell(ws, e0, 4, "Apport personnel (capital)"); cell(ws, e0, 5, f"=ROUND({R('cout')}*{R('p_app')},1)", "calc", NUM); reg(ws, "apport", e0, 5)
cell(ws, e0 + 1, 4, "Emprunt bancaire"); cell(ws, e0 + 1, 5, f"={R('cout')}-{R('apport')}", "calc", NUM); reg(ws, "emprunt", e0 + 1, 5)
cell(ws, e0, 6, f"=E{e0}/E{r}", "calc", PCT0); cell(ws, e0 + 1, 6, f"=E{e0+1}/E{r}", "calc", PCT0)
cell(ws, r, 4, "TOTAL RESSOURCES", bold=True); cell(ws, r, 5, f"=SUM(E{e0}:E{e0+1})", "calc", NUM, bold=True); reg(ws, "ressources", r, 5)
for col in (4, 5, 6):
    ws.cell(r, col).font, ws.cell(r, col).fill = F_HEAD, FILL_DG
r += 1
cell(ws, r, 1, "Contrôle emplois = ressources", bold=True)
cell(ws, r, 2, f"=IF(ABS({R('emplois')}-{R('ressources')})<0.001,\"✅ ÉQUILIBRÉ\",\"❌ écart \"&ROUND({R('emplois')}-{R('ressources')},2))", "calc")
reg(ws, "ctl_fin", r, 2); r += 2
section(ws, r, "Tableau de la dette (annuités constantes après le différé)", 6); r += 1
cell(ws, r, 1, "Annuité constante après le différé (M FCFA)"); cell(ws, r, 2, f"=PMT({R('tx')},{R('du')}-{R('di')},-{R('emprunt')})", "calc", NUM); reg(ws, "annuite", r, 2); r += 1
head(ws, r, ["Année", "Capital début", "Intérêts", "Capital remboursé", "Annuité payée", "Capital fin"]); r += 1
d0 = r
for y in range(1, 8):
    cell(ws, r, 1, f"Année {y}", bold=True)
    cell(ws, r, 2, f"={R('emprunt')}" if y == 1 else f"=F{r-1}", "calc", NUM)
    cell(ws, r, 3, f"=B{r}*{R('tx')}", "calc", NUM)
    cell(ws, r, 4, f"=IF({y}<={R('di')},0,IF({y}>{R('du')},0,{R('annuite')}-C{r}))", "calc", NUM)
    cell(ws, r, 5, f"=C{r}+D{r}", "calc", NUM)
    cell(ws, r, 6, f"=B{r}-D{r}", "calc", NUM)
    if y <= 5:
        reg(ws, f"int{y}", r, 3)
        reg(ws, f"srv{y}", r, 5)
    reg(ws, f"cap_fin{y}", r, 6)
    r += 1
cell(ws, r, 1, "Total", bold=True)
for col in (3, 4, 5):
    cell(ws, r, col, f"=SUM({L(col)}{d0}:{L(col)}{r-1})", "calc", NUM, bold=True)
total_row(ws, r, 6); r += 1
cell(ws, r, 1, "Contrôle : capital soldé à la dernière année", bold=True)
cell(ws, r, 2, f"=IF(ABS(F{r-2})<0.001,\"✅ SOLDÉ\",\"❌ reste \"&ROUND(F{r-2},2))", "calc"); r += 2
note(ws, r, "Taux, durée et différé viennent de la feuille HYPOTHESES. Vérifiez auprès de votre banque le taux, les frais de dossier, le différé, les garanties exigées et l'éventuelle assurance emprunteur : ils déterminent l'annuité, donc la solidité de tout le dossier.", 6)

# ======================================================================================
# CHIFFRE D'AFFAIRES
# ======================================================================================
ws = sheet("CHIFFRE_AFFAIRES", "CHIFFRE D'AFFAIRES : 3 SCÉNARIOS ET TEST DE CRISE", "CA = (surface × rendement − pertes) × prix (leçon 5.3) · année de croisière · M FCFA",
           [44, 12, 14, 12, 16, 14, 14])
r = 4
for k, nom, *_ in SCEN:
    section(ws, r, f"Scénario {nom.upper()}", 7); r += 1
    head(ws, r, ["Culture", "Surface (ha)", "Rendement brut (t/ha)", "Pertes", "Volume vendable (t)", "Prix (FCFA/kg)", "CA (M FCFA)"]); r += 1
    s0 = r
    for lab, ha, rd, pt, px in [("Oignon (contre-saison froide)", "ha_o", "rd_o", "pt_o", "px_o"), ("Pomme de terre (contre-saison froide)", "ha_p", "rd_p", "pt_p", "px_p"),
                                ("Gombo / maïs doux (hivernage)", "ha_h", "rd_h", "pt_h", "px_h")]:
        cell(ws, r, 1, lab); cell(ws, r, 2, f"={R(ha)}", "calc", '0.0')
        cell(ws, r, 3, f"={R(rd)}*{R('fr_'+k)}", "calc", '0.0')
        cell(ws, r, 4, f"={R(pt)}+{R('dp_'+k)}", "calc", PCT)
        cell(ws, r, 5, f"=B{r}*C{r}*(1-D{r})", "calc", '#,##0.0')
        cell(ws, r, 6, f"={R(px)}*{R('fp_'+k)}", "calc", '#,##0.0')
        cell(ws, r, 7, f"=E{r}*F{r}/1000", "calc", NUM)
        if lab.startswith("Oignon"):
            oig_row = r
        r += 1
    cell(ws, r, 1, "TOTAL (croisière)", bold=True); cell(ws, r, 5, f"=SUM(E{s0}:E{r-1})", "calc", '#,##0.0', bold=True)
    cell(ws, r, 7, f"=SUM(G{s0}:G{r-1})", "calc", NUM, bold=True); total_row(ws, r, 7)
    reg(ws, f"ca_{k}", r, 7); reg(ws, f"vol_{k}", r, 5); r += 1
    cell(ws, r, 1, "CA de l'année 1 (montée en puissance)")
    cell(ws, r, 7, f"=G{r-1}*{R('mont')}", "calc", NUM); reg(ws, f"ca1_{k}", r, 7); r += 1
    if k == "re":
        cell(ws, r, 1, "dont oignon vendu à la récolte (60 % du volume, prix de récolte)")
        cell(ws, r, 7, f"=E{oig_row}*(1-{R('part_s')})*{R('px_or')}/1000", "calc", NUM); reg(ws, "ca_or", r, 7); r += 1
        cell(ws, r, 1, "dont oignon stocké, vendu de juin à août (40 %, prix de stockage)")
        cell(ws, r, 7, f"=E{oig_row}*{R('part_s')}*{R('px_os')}/1000", "calc", NUM); reg(ws, "ca_os", r, 7); r += 1
        cell(ws, r, 1, "Pomme de terre"); cell(ws, r, 7, f"=E{oig_row+1}*F{oig_row+1}/1000", "calc", NUM); reg(ws, "ca_pp", r, 7); r += 1
        cell(ws, r, 1, "Gombo / maïs doux"); cell(ws, r, 7, f"=E{oig_row+2}*F{oig_row+2}/1000", "calc", NUM); reg(ws, "ca_hh", r, 7); r += 1
    r += 1
cell(ws, r, 1, "Écart pessimiste / réaliste", bold=True); cell(ws, r, 7, f"={R('ca_pe')}/{R('ca_re')}-1", "calc", PCT); r += 1
cell(ws, r, 1, "Écart optimiste / réaliste", bold=True); cell(ws, r, 7, f"={R('ca_op')}/{R('ca_re')}-1", "calc", PCT); r += 2
note(ws, r, "Construisez le compte de résultat, la trésorerie et le bilan sur le scénario RÉALISTE (ou un point entre pessimiste et réaliste). Ne bâtissez jamais un business plan sur le scénario optimiste. Les prix doivent être datés et sourcés (enquête, relevé de marché).", 7)
ws.freeze_panes = "B4"

# ======================================================================================
# RESULTAT
# ======================================================================================
ws = sheet("RESULTAT", "COMPTE DE RÉSULTAT PRÉVISIONNEL (SIG SYSCOHADA)", "Scénario réaliste · année 0 = installation (aucun CA) · M FCFA", [46, 14, 14, 14, 14, 14])
r = 4
head(ws, r, ["Poste", "Année 1 (85 %)", "Année 2", "Année 3", "Année 4", "Année 5"]); r += 1
rows = {}


def line(name, label, fn, bold=False, fmt=NUM, total=False):
    global r
    cell(ws, r, 1, label, bold=bold)
    for y in range(1, 6):
        cell(ws, r, 1 + y, fn(y, L(1 + y)), "calc", fmt, bold=bold)
    rows[name] = r
    if total:
        total_row(ws, r, 6)
    r += 1


line("ca", "Chiffre d'affaires", lambda y, c: f"={R('ca1_re')}" if y == 1 else f"={R('ca_re')}", bold=True)
line("cv", "− Charges variables (semences, engrais, énergie, journaliers, emballages)", lambda y, c: f"=-{R('cv_tot')}")
line("mcv", "Marge sur coûts variables", lambda y, c: f"={c}{rows['ca']}+{c}{rows['cv']}", bold=True)
line("cf", "− Charges fixes (assurance, entretien, énergie, commercial, comptabilité)", lambda y, c: f"=-{R('cf')}")
line("pe", "− Frais de personnel", lambda y, c: f"=-{R('pers')}")
line("ebe", "EXCÉDENT BRUT D'EXPLOITATION (EBE)", lambda y, c: f"={c}{rows['mcv']}+{c}{rows['cf']}+{c}{rows['pe']}", bold=True, total=True)
line("am", "− Dotations aux amortissements", lambda y, c: f"=-{R('am'+str(y))}")
line("rex", "RÉSULTAT D'EXPLOITATION", lambda y, c: f"={c}{rows['ebe']}+{c}{rows['am']}", bold=True)
line("fi", "− Charges financières (intérêts de l'emprunt)", lambda y, c: f"=-{R('int'+str(y))}")
line("rai", "RÉSULTAT AVANT IMPÔT", lambda y, c: f"={c}{rows['rex']}+{c}{rows['fi']}", bold=True)
line("is", "− Impôt sur les bénéfices", lambda y, c: f"=-MAX(0,{c}{rows['rai']}*{R('is')})")
line("rn", "RÉSULTAT NET", lambda y, c: f"={c}{rows['rai']}+{c}{rows['is']}", bold=True, total=True)
r += 1
line("tebe", "Taux d'EBE (EBE ÷ CA)", lambda y, c: f"={c}{rows['ebe']}/{c}{rows['ca']}", fmt=PCT)
line("trn", "Taux de résultat net (RN ÷ CA)", lambda y, c: f"={c}{rows['rn']}/{c}{rows['ca']}", fmt=PCT)
line("caf", "Capacité d'autofinancement (RN + amortissements)", lambda y, c: f"={c}{rows['rn']}-{c}{rows['am']}")
for y in range(1, 6):
    reg(ws, f"ca_a{y}", rows['ca'], 1 + y); reg(ws, f"ebe_a{y}", rows['ebe'], 1 + y); reg(ws, f"rn_a{y}", rows['rn'], 1 + y)
    reg(ws, f"rex_a{y}", rows['rex'], 1 + y); reg(ws, f"is_a{y}", rows['is'], 1 + y); reg(ws, f"rai_a{y}", rows['rai'], 1 + y)
r += 1
note(ws, r, "Les charges variables de culture sont engagées en totalité dès l'année 1 même si les rendements ne montent qu'à 85 % ; le résultat de l'année 1 est donc positif mais mince. Impôt : taux à vérifier dans votre pays (exonérations agricoles, impôt minimum).", 6)
ws.freeze_panes = "B5"

# ======================================================================================
# TRESORERIE
# ======================================================================================
ws = sheet("TRESORERIE", "BUDGET DE TRÉSORERIE MENSUEL — ANNÉE 1 (octobre → septembre)", "Encaissements et décaissements réels (leçon 5.5) · M FCFA · le solde de fin de mois ne doit jamais être négatif",
           [48] + [9.5] * 12 + [11])
MOIS = ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep"]
r = 4
section(ws, r, "A. Calendrier d'encaissement et de décaissement (en % du total annuel de chaque rubrique ; chaque ligne doit totaliser 100 %)", 14); r += 1
head(ws, r, ["Rubrique"] + [f"M{i+1}\n{m}" for i, m in enumerate(MOIS)] + ["Total"]); r += 1
PH = {
    "Achats d'intrants de la contre-saison froide": [20, 15, 15, 10, 10, 20, 10, 0, 0, 0, 0, 0],
    "Journaliers avant récolte": [20, 25, 20, 15, 20, 0, 0, 0, 0, 0, 0, 0],
    "Journaliers de récolte, séchage et tri": [0, 0, 0, 0, 0, 30, 40, 30, 0, 0, 0, 0],
    "Filets, sacs et divers": [0, 0, 0, 0, 0, 20, 30, 20, 10, 10, 10, 0],
    "Charges variables de l'hivernage": [0, 0, 0, 0, 0, 0, 0, 0, 20, 30, 30, 20],
    "Ventes de pomme de terre": [0, 0, 0, 0, 0, 40, 60, 0, 0, 0, 0, 0],
    "Ventes d'oignon à la récolte": [0, 0, 0, 0, 0, 0, 40, 40, 20, 0, 0, 0],
    "Ventes d'oignon stocké": [0, 0, 0, 0, 0, 0, 0, 0, 20, 40, 40, 0],
    "Ventes de gombo / maïs doux": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
}
ph_row = {}
for lab, vals in PH.items():
    cell(ws, r, 1, lab)
    for j, v in enumerate(vals):
        cell(ws, r, 2 + j, v / 100, "in", PCT0)
    cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", PCT0)
    ph_row[lab] = r
    r += 1
r += 1
section(ws, r, "B. Plan de trésorerie", 14); r += 1
head(ws, r, ["Rubrique"] + [f"M{i+1}\n{m}" for i, m in enumerate(MOIS)] + ["Total"]); r += 1
init_row = r
cell(ws, r, 1, "Solde initial", bold=True)
cell(ws, r, 2, f"={R('ressources')}-{R('immos')}", "calc", NUM, bold=True)
for c in range(3, 14):
    cell(ws, r, c, f"={L(c-1)}{r+99}", "calc", NUM, bold=True)  # remplacé plus bas
r_init = r
r += 1
section(ws, r, "Encaissements", 14); r += 1
enc0 = r


def enc(label, fml_total, key):
    global r
    cell(ws, r, 1, label)
    for j in range(12):
        c = L(2 + j)
        cell(ws, r, 2 + j, f"={fml_total}*{c}{ph_row[key]}", "calc", NUM)
    cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM)
    r += 1


enc("Ventes de pomme de terre", f"{R('ca_pp')}*{R('mont')}", "Ventes de pomme de terre")
enc("Ventes d'oignon à la récolte", f"{R('ca_or')}*{R('mont')}", "Ventes d'oignon à la récolte")
enc("Ventes d'oignon stocké", f"{R('ca_os')}*{R('mont')}", "Ventes d'oignon stocké")
enc("Ventes de gombo / maïs doux", f"{R('ca_hh')}*{R('mont')}", "Ventes de gombo / maïs doux")
cell(ws, r, 1, "− Créances clients non encaissées en fin d'année")
for j in range(12):
    cell(ws, r, 2 + j, f"=-{R('cl_a1')}" if j == 11 else 0, "calc", NUM)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1
enc1 = r - 1
cell(ws, r, 1, "TOTAL ENCAISSEMENTS", bold=True)
for c in range(2, 15):
    cell(ws, r, c, f"=SUM({L(c)}{enc0}:{L(c)}{enc1})", "calc", NUM, bold=True)
total_row(ws, r, 14); r_enc = r; r += 1
section(ws, r, "Décaissements", 14); r += 1
dec0 = r
# intrants avec crédit fournisseurs payé à 60 jours (2 mois après l'achat)
cell(ws, r, 1, "Intrants (60 % comptant, 40 % à 60 jours)")
pr = ph_row["Achats d'intrants de la contre-saison froide"]
for j in range(12):
    c = L(2 + j)
    f = f"={R('int_f')}*((1-{R('p_cf')})*{c}{pr}" + (f"+{R('p_cf')}*{L(j)}{pr}" if False else "")
    f = f"={R('int_f')}*((1-{R('p_cf')})*{c}{pr}" + (f"+{R('p_cf')}*{L(2+j-2)}{pr}" if j >= 2 else "") + ")"
    cell(ws, r, 2 + j, f, "calc", NUM)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1


def dec(label, tot, key):
    global r
    cell(ws, r, 1, label)
    for j in range(12):
        cell(ws, r, 2 + j, f"={tot}*{L(2+j)}{ph_row[key]}", "calc", NUM)
    cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1


dec("Journaliers avant récolte", R('ja_f'), "Journaliers avant récolte")
dec("Journaliers de récolte, séchage et tri", R('jr_f'), "Journaliers de récolte, séchage et tri")
dec("Filets, sacs et divers", R('em_f'), "Filets, sacs et divers")
dec("Charges variables de l'hivernage", R('hv_f'), "Charges variables de l'hivernage")
cell(ws, r, 1, "− Dettes fournisseurs non payées en fin d'année")
for j in range(12):
    cell(ws, r, 2 + j, f"=-{R('fo_a1')}" if j == 11 else 0, "calc", NUM)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1
cell(ws, r, 1, "Salaires et charges sociales")
for j in range(12):
    cell(ws, r, 2 + j, f"={R('pers')}/12", "calc", NUM)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1
cell(ws, r, 1, "Charges fixes")
for j in range(12):
    cell(ws, r, 2 + j, f"={R('cf')}/12", "calc", NUM)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1
cell(ws, r, 1, "Intérêts de l'emprunt (payés en fin d'année)")
for j in range(12):
    cell(ws, r, 2 + j, f"={R('int1')}" if j == 11 else 0, "calc", NUM)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1
cell(ws, r, 1, "Remboursement du capital (différé : néant en année 1)")
for j in range(12):
    cell(ws, r, 2 + j, "='FINANCEMENT'!D" + str(d0) if j == 11 else 0, "calc", NUM)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1
cell(ws, r, 1, "Impôt sur les bénéfices (payé l'année suivante)")
for j in range(12):
    cell(ws, r, 2 + j, 0, "in", NUM)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM); r += 1
dec1 = r - 1
cell(ws, r, 1, "TOTAL DÉCAISSEMENTS", bold=True)
for c in range(2, 15):
    cell(ws, r, c, f"=SUM({L(c)}{dec0}:{L(c)}{dec1})", "calc", NUM, bold=True)
total_row(ws, r, 14); r_dec = r; r += 1
cell(ws, r, 1, "FLUX NET DU MOIS", bold=True)
for c in range(2, 14):
    cell(ws, r, c, f"={L(c)}{r_enc}-{L(c)}{r_dec}", "calc", NUM, bold=True)
cell(ws, r, 14, f"=SUM(B{r}:M{r})", "calc", NUM, bold=True); r_flux = r; r += 1
cell(ws, r, 1, "SOLDE DE FIN DE MOIS", bold=True)
for c in range(2, 14):
    cell(ws, r, c, f"={L(c)}{r_init}+{L(c)}{r_flux}", "calc", NUM, bold=True)
total_row(ws, r, 14)
r_fin = r; r += 1
for c in range(3, 14):  # solde initial = solde final du mois précédent
    ws.cell(r_init, c).value = f"={L(c-1)}{r_fin}"
cell(ws, r, 1, "Alerte de trésorerie")
for c in range(2, 14):
    cell(ws, r, c, f'=IF({L(c)}{r_fin}<0,"⚠ Découvert","OK")', "calc", align="center")
ws.conditional_formatting.add(f"B{r}:M{r}", CellIsRule(operator="equal", formula=['"⚠ Découvert"'], font=Font(color="9C0006", bold=True), fill=PatternFill("solid", bgColor="FFC7CE")))
ws.conditional_formatting.add(f"B{r_fin}:M{r_fin}", CellIsRule(operator="lessThan", formula=["0"], font=Font(color="9C0006", bold=True)))
r_alert = r; r += 2
cell(ws, r, 1, "Solde le plus bas de l'année", bold=True); cell(ws, r, 2, f"=MIN(B{r_fin}:M{r_fin})", "calc", NUM, bold=True); reg(ws, "tr_min", r, 2); r += 1
cell(ws, r, 1, "Creux avant les premières ventes (trésorerie consommée)", bold=True)
cell(ws, r, 2, f"=B{r_init}-MIN(B{r_fin}:F{r_fin})", "calc", NUM, bold=True); reg(ws, "tr_creux", r, 2)
cell(ws, r, 3, "Trésorerie consommée jusqu'à fin février : à comparer au BFR financé", "calc"); r += 1
cell(ws, r, 1, "Contrôle : BFR financé ≥ creux", bold=True)
cell(ws, r, 2, f'=IF({R("bfr")}>=B{r-1},"✅ OK","❌ BFR sous-estimé")', "calc"); reg(ws, "ctl_tr", r, 2); r += 1
cell(ws, r, 1, "Trésorerie de clôture (fin septembre)", bold=True); cell(ws, r, 2, f"=M{r_fin}", "calc", NUM, bold=True); reg(ws, "tr_fin", r, 2); r += 2
note(ws, r, "Un bénéfice au compte de résultat n'est pas de l'argent en banque : c'est ce tableau qui montre si le compte reste positif chaque mois. Si une case d'alerte apparaît : augmentez le BFR initial, négociez des délais fournisseurs ou avancez des cultures à cycle court. Le calendrier ci-dessus (zone des Niayes) est à adapter à votre zone agro-climatique (leçon 3.2).", 14)
ws.freeze_panes = "B6"

# ======================================================================================
# BILAN
# ======================================================================================
ws = sheet("BILAN", "BILAN PRÉVISIONNEL AU 30 SEPTEMBRE DE L'ANNÉE 1", "Actif = passif (leçon 5.6) · M FCFA · hypothèse : toute la récolte est vendue avant la clôture", [46, 16, 6, 46, 16])
r = 4
head(ws, r, ["ACTIF", "M FCFA", "", "PASSIF", "M FCFA"]); r += 1
cell(ws, r, 1, "Immobilisations nettes (coût − amortissement An 1)"); cell(ws, r, 2, f"={R('immos')}-{R('am1')}", "calc", NUM); b1 = r
cell(ws, r, 4, "Capital social (apport)"); cell(ws, r, 5, f"={R('apport')}", "calc", NUM); r += 1
cell(ws, r, 1, "Stocks"); cell(ws, r, 2, 0, "in", NUM)
cell(ws, r, 4, "Résultat de l'année 1"); cell(ws, r, 5, f"={R('rn_a1')}", "calc", NUM); r += 1
cell(ws, r, 1, "Créances clients"); cell(ws, r, 2, f"={R('cl_a1')}", "calc", NUM)
cell(ws, r, 4, "Emprunt bancaire restant dû"); cell(ws, r, 5, f"={R('cap_fin1')}", "calc", NUM); r += 1
cell(ws, r, 1, "Disponibilités (feuille TRESORERIE)"); cell(ws, r, 2, f"={R('tr_fin')}", "calc", NUM)
cell(ws, r, 4, "Dettes fournisseurs"); cell(ws, r, 5, f"={R('fo_a1')}", "calc", NUM); r += 1
cell(ws, r, 1, ""); cell(ws, r, 2, "")
cell(ws, r, 4, "Dettes fiscales (impôt à payer)"); cell(ws, r, 5, f"=-{R('is_a1')}", "calc", NUM); r += 1
cell(ws, r, 1, "TOTAL ACTIF", bold=True); cell(ws, r, 2, f"=SUM(B{b1}:B{r-1})", "calc", NUM, bold=True)
cell(ws, r, 4, "TOTAL PASSIF", bold=True); cell(ws, r, 5, f"=SUM(E{b1}:E{r-1})", "calc", NUM, bold=True)
total_row(ws, r, 5); reg(ws, "tot_actif", r, 2); reg(ws, "tot_passif", r, 5); r += 1
cell(ws, r, 1, "Contrôle d'équilibre", bold=True)
cell(ws, r, 2, f'=IF(ABS({R("tot_actif")}-{R("tot_passif")})<0.01,"✅ ÉQUILIBRÉ","❌ écart "&ROUND({R("tot_actif")}-{R("tot_passif")},2))', "calc"); reg(ws, "ctl_bilan", r, 2); r += 2
cell(ws, r, 1, "Capitaux propres (capital + résultat)"); cell(ws, r, 2, f"=E{b1}+E{b1+1}", "calc", NUM); r += 1
cell(ws, r, 1, "Disponibilités ÷ dettes à court terme"); cell(ws, r, 2, f"=B{b1+3}/(E{b1+3}+E{b1+4})", "calc", '0.0"×"'); r += 1
cell(ws, r, 1, "Ressources stables − immobilisations (fonds de roulement)"); cell(ws, r, 2, f"=E{b1}+E{b1+1}+E{b1+2}-B{b1}", "calc", NUM); r += 2
note(ws, r, "Les disponibilités sont élevées parce que l'emprunt n'est pas encore remboursé (différé d'un an) : ce coussin sert à payer la première annuité de l'année 2. Si vous stockez une partie de la récolte au-delà de la clôture, inscrivez la valeur du stock invendu à la ligne Stocks (et retirez la vente correspondante).", 5)

# ======================================================================================
# INDICATEURS
# ======================================================================================
ws = sheet("INDICATEURS", "INDICATEURS : SEUIL DE RENTABILITÉ, DSCR, VAN, TRI, DÉLAI DE RÉCUPÉRATION", "Leçon 5.7 · calculés dans plusieurs scénarios · M FCFA", [48, 15, 15, 15, 15, 15, 15])
r = 4
section(ws, r, "1. Seuil de rentabilité (année 2, croisière, scénario réaliste)", 7); r += 1
cell(ws, r, 1, "Taux de marge sur coûts variables"); cell(ws, r, 2, f"=({R('ca_re')}-{R('cv_tot')})/{R('ca_re')}", "calc", '0.0%'); tm = r; r += 1
cell(ws, r, 1, "Coûts fixes totaux (personnel + charges fixes + amortissements + intérêts)")
cell(ws, r, 2, f"={R('pers')}+{R('cf')}+{R('am2')}+{R('int2')}", "calc", NUM); cft = r; r += 1
cell(ws, r, 1, "SEUIL DE RENTABILITÉ (M FCFA de CA)", bold=True)
cell(ws, r, 2, f"=ROUND(B{cft},1)/ROUND(B{tm},3)", "calc", NUM1, bold=True); reg(ws, "seuil", r, 2)
cell(ws, r, 3, "Arrondis comme dans la leçon 5.7 : coûts fixes à 0,1 et taux à 0,1 %", "calc"); r += 1
cell(ws, r, 1, "Seuil en % du CA réaliste"); cell(ws, r, 2, f"=B{r-1}/{R('ca_re')}", "calc", PCT0); r += 1
cell(ws, r, 1, "Marge de sécurité"); cell(ws, r, 2, f"=({R('ca_re')}-B{r-2})/{R('ca_re')}", "calc", PCT0); r += 1
cell(ws, r, 1, "Seuil avec les seules charges fixes (erreur à éviter)")
cell(ws, r, 2, f"={R('cf')}/B{tm}", "calc", NUM1); cell(ws, r, 3, "Sous-estime fortement le point mort", "calc"); r += 2

section(ws, r, "2. Couverture du service de la dette (DSCR), année 2", 7); r += 1
head(ws, r, ["Rubrique", "Réaliste", "Pessimiste", "Crise de prix", "Optimiste"]); r += 1
sc = [("re", 2), ("pe", 3), ("cr", 4), ("op", 5)]
rd = {}


def dline(name, label, fn, fmt=NUM, bold=False):
    global r
    cell(ws, r, 1, label, bold=bold)
    for k, col in sc:
        cell(ws, r, col, fn(k, L(col)), "calc", fmt, bold=bold)
    rd[name] = r
    r += 1


dline("ca", "Chiffre d'affaires", lambda k, c: f"={R('ca_'+k)}")
dline("ebe", "EBE", lambda k, c: f"={c}{rd['ca']}-{R('cv_tot')}-{R('cf')}-{R('pers')}")
dline("rai", "Résultat avant impôt", lambda k, c: f"={c}{rd['ebe']}-{R('am2')}-{R('int2')}")
dline("is", "Impôt sur les bénéfices", lambda k, c: f"=MAX(0,{c}{rd['rai']}*{R('is')})")
dline("fl", "Flux disponible avant dette (EBE − impôt)", lambda k, c: f"={c}{rd['ebe']}-{c}{rd['is']}", bold=True)
dline("sd", "Service de la dette (intérêts + capital)", lambda k, c: f"={R('srv2')}")
dline("ds", "DSCR", lambda k, c: f"={c}{rd['fl']}/{c}{rd['sd']}", fmt='0.00', bold=True)
cell(ws, r, 1, "Verdict (minimum exigé : voir HYPOTHESES)")
for k, col in sc:
    c = L(col)
    cell(ws, r, col, f'=IF({c}{rd["ds"]}>={R("dscr_min")},"✅ couvert",IF({c}{rd["ds"]}>=1,"⚠ fragile","❌ non couvert"))', "calc", align="center")
rd["vd"] = r; r += 1
for k, col in sc:
    reg(ws, f"dscr_{k}", rd["ds"], col)
r += 1

section(ws, r, "3. Flux du projet, VAN, TRI et délai de récupération (flux avant financement)", 7); r += 1
SYN = {}
blocks = []
for k, nom, *_ in SCEN:
    head(ws, r, [f"Scénario {nom}", "Année 0", "Année 1", "Année 2", "Année 3", "Année 4", "Année 5"]); r += 1
    b = {}
    cell(ws, r, 1, "Chiffre d'affaires"); cell(ws, r, 2, 0, "calc", NUM)
    for y in range(1, 6):
        cell(ws, r, 2 + y, f"={R('ca1_'+k)}" if y == 1 else f"={R('ca_'+k)}", "calc", NUM)
    b["ca"] = r; r += 1
    cell(ws, r, 1, "EBE"); cell(ws, r, 2, 0, "calc", NUM)
    for y in range(1, 6):
        c = L(2 + y)
        cell(ws, r, 2 + y, f"={c}{b['ca']}-{R('cv_tot')}-{R('cf')}-{R('pers')}", "calc", NUM)
    b["ebe"] = r; r += 1
    cell(ws, r, 1, "Impôt sur le résultat d'exploitation (hors intérêts)"); cell(ws, r, 2, 0, "calc", NUM)
    for y in range(1, 6):
        c = L(2 + y)
        cell(ws, r, 2 + y, f"=MAX(0,({c}{b['ebe']}-{R('am'+str(y))})*{R('is')})", "calc", NUM)
    b["is"] = r; r += 1
    cell(ws, r, 1, "Investissement initial (coût total du projet)"); cell(ws, r, 2, f"=-{R('cout')}", "calc", NUM)
    for y in range(1, 6):
        cell(ws, r, 2 + y, 0, "calc", NUM)
    b["inv"] = r; r += 1
    cell(ws, r, 1, "Valeur résiduelle (VNC des immobilisations + BFR récupéré)")
    for y in range(0, 5):
        cell(ws, r, 2 + y, 0, "calc", NUM)
    cell(ws, r, 7, f"={R('vnc5')}+{R('bfr')}", "calc", NUM)
    b["res"] = r; r += 1
    cell(ws, r, 1, "FLUX DU PROJET (arrondis à 0,1 comme dans la leçon 5.7)", bold=True)
    cell(ws, r, 2, f"=B{b['inv']}", "calc", NUM, bold=True)
    for y in range(1, 6):
        c = L(2 + y)
        cell(ws, r, 2 + y, f"=ROUND({c}{b['ebe']}-{c}{b['is']}+{c}{b['res']},1)", "calc", NUM, bold=True)
    total_row(ws, r, 7); b["fl"] = r; r += 1
    cell(ws, r, 1, "Cumul des flux (hors valeur résiduelle)"); cell(ws, r, 2, f"=B{b['fl']}", "calc", NUM)
    for y in range(1, 6):
        c = L(2 + y); p = L(1 + y)
        cell(ws, r, 2 + y, f"={p}{r}+{c}{b['ebe']}-{c}{b['is']}", "calc", NUM)
    b["cum"] = r; r += 1
    cell(ws, r, 1, "VAN au taux d'actualisation", bold=True)
    cell(ws, r, 2, f"=B{b['fl']}+NPV({R('act')},C{b['fl']}:G{b['fl']})", "calc", NUM, bold=True); b["van"] = r
    cell(ws, r, 3, "TRI", bold=True, align="right"); cell(ws, r, 4, f"=IRR(B{b['fl']}:G{b['fl']})", "calc", PCT, bold=True); b["tri"] = r
    cell(ws, r, 5, "Délai (ans)", bold=True, align="right")
    pb = '"> 5 ans"'
    for y in range(5, 0, -1):
        pb = f"IF({L(2+y)}{b['cum']}>=0,{y-1}+(-{L(1+y)}{b['cum']})/({L(2+y)}{b['ebe']}-{L(2+y)}{b['is']}),{pb})"
    cell(ws, r, 6, "=" + pb, "calc", '0.0', bold=True)
    cell(ws, r, 7, f'=IF(B{r}>0,"✅ VAN > 0","❌ VAN < 0")', "calc", align="center")
    reg(ws, f"van_{k}", r, 2); reg(ws, f"tri_{k}", r, 4); reg(ws, f"pb_{k}", r, 6)
    r += 2
section(ws, r, "4. Synthèse à reporter dans le business plan", 7); r += 1
head(ws, r, ["Indicateur", "Réaliste", "Pessimiste", "Crise de prix", "Optimiste"]); r += 1
for lab, nm, fmt in [("DSCR (année 2)", "dscr", '0.00'), ("VAN (M FCFA)", "van", NUM1), ("TRI", "tri", PCT), ("Délai de récupération (ans)", "pb", '0.0')]:
    cell(ws, r, 1, lab, bold=True)
    for k, col in [("re", 2), ("pe", 3), ("cr", 4), ("op", 5)]:
        if nm == "pb" and k not in ("re", "pe", "op", "cr"):
            continue
        cell(ws, r, col, f"={R(nm+'_'+k)}", "calc", fmt)
    r += 1
r += 1
note(ws, r, "Lecture honnête pour le banquier : le projet résiste à un recul de 10 % (scénario pessimiste) mais devient fragile si les prix reculent de 25 % (crise de prix). Prévoyez en conséquence stockage, contrats de vente à prix plancher, assurance et réserve de trésorerie. Les flux du projet sont arrondis à 0,1 M comme dans la leçon 5.7 : un écart de 0,1 sur la VAN ou de 0,1 point sur le TRI est possible selon l'arrondi (crise de prix : VAN de − 2,0 à − 2,1). Ces indicateurs ne valent que ce que valent vos hypothèses : chaque chiffre doit renvoyer à un devis, une enquête ou une source datée.", 7)
ws.freeze_panes = "B4"

# ======================================================================================
# ACCUEIL (contenu)
# ======================================================================================
ws = wsA
r = 4
cell(ws, r, 2, "Entreprise", bold=True); ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=4)
cell(ws, r, 3, f"={R('entite')}&\" · \"&{R('pays')}"); r += 2
head(ws, r, ["", "Onglet", "Rôle", "Leçon"]); r += 1
NAV = [("HYPOTHESES", "Surfaces, rendements, prix, scénarios, fiscalité, financement : le seul endroit où saisir vos hypothèses", "5.1 à 5.7"),
       ("CHARGES", "Coûts par poste et par hectare, charges fixes, personnel", "3.1, 5.4"),
       ("INVESTISSEMENTS", "Coût du projet et amortissements linéaires sur 5 ans", "5.1"),
       ("BFR", "Besoin en fonds de roulement initial", "5.2"),
       ("FINANCEMENT", "Emplois = ressources, tableau de la dette avec différé", "5.1, 5.7"),
       ("CHIFFRE_AFFAIRES", "CA en 3 scénarios (réaliste, pessimiste, optimiste) et test de crise de prix", "5.3"),
       ("RESULTAT", "Compte de résultat prévisionnel sur 5 ans (EBE, résultat d'exploitation, résultat net)", "5.4"),
       ("TRESORERIE", "Budget de trésorerie mensuel de l'année 1 avec alerte de découvert", "5.5"),
       ("BILAN", "Bilan prévisionnel de fin d'année 1 avec contrôle d'équilibre", "5.6"),
       ("INDICATEURS", "Seuil de rentabilité, DSCR, VAN, TRI, délai de récupération en 4 scénarios", "5.7")]
for n, d, le in NAV:
    cell(ws, r, 1, ""); c = cell(ws, r, 2, n, bold=True)
    c.hyperlink = f"#'{n}'!A1"
    cell(ws, r, 3, d, wrap=True); cell(ws, r, 4, le, align="center"); ws.row_dimensions[r].height = 28; r += 1
r += 1
section(ws, r, "Contrôles automatiques", 4); r += 1
for lab, ref in [("Emplois = ressources", R("ctl_fin")), ("Bilan équilibré", R("ctl_bilan")), ("BFR financé ≥ creux de trésorerie", R("ctl_tr"))]:
    cell(ws, r, 2, lab); cell(ws, r, 3, f"={ref}"); r += 1
cell(ws, r, 2, "Solde de trésorerie le plus bas"); cell(ws, r, 3, f"={R('tr_min')}", "calc", NUM); r += 2
section(ws, r, "Résultats clés du cas pré-rempli (M FCFA)", 4); r += 1
for lab, f, fmt in [("Coût du projet", f"={R('cout')}", NUM1), ("Chiffre d'affaires de croisière", f"={R('ca_re')}", NUM1),
                    ("EBE de croisière (année 2)", f"={R('ebe_a2')}", NUM1), ("Résultat net de croisière (année 2)", f"={R('rn_a2')}", NUM1),
                    ("Seuil de rentabilité", f"={R('seuil')}", NUM1), ("DSCR année 2 (réaliste / pessimiste)", f'=ROUND({R("dscr_re")},2)&" / "&ROUND({R("dscr_pe")},2)', None),
                    ("VAN à 10 % (réaliste)", f"={R('van_re')}", NUM1), ("TRI (réaliste)", f"={R('tri_re')}", PCT)]:
    cell(ws, r, 2, lab); cell(ws, r, 3, f, "calc", fmt, align="left"); r += 1
r += 1
section(ws, r, "Comment utiliser ce classeur", 4); r += 1
for t in ["1. Lisez les leçons 5.1 à 5.7 de la formation : chaque onglet y correspond.",
          "2. Dans HYPOTHESES et CHARGES, remplacez les chiffres du cas Diap Touré par les vôtres (cellules bleues sur fond jaune). Joignez devis et sources dans votre dossier.",
          "3. Dans INVESTISSEMENTS, ajustez les postes et les durées d'amortissement à votre projet et à la fiscalité de votre pays.",
          "4. Dans TRESORERIE, adaptez le calendrier mensuel (partie A) à votre zone agro-climatique et à vos cultures.",
          "5. Vérifiez que les trois contrôles ci-dessus affichent ✅ ; si une alerte rouge apparaît dans TRESORERIE, corrigez le BFR ou les délais.",
          "6. Reportez la synthèse de l'onglet INDICATEURS dans votre business plan, dans les trois scénarios.",
          "Les montants sont en millions de FCFA. Pour une autre monnaie (GHS, NGN, EUR…), changez simplement vos unités : aucune formule ne dépend de la devise."]:
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
    c = ws.cell(r, 2, t); c.font = F_CALC; c.alignment = Alignment(wrap_text=True, vertical="top"); ws.row_dimensions[r].height = 30; r += 1
r += 1
note(ws, r, "Modèle fourni par le réseau agrolide à titre pédagogique. Les chiffres du cas Diap Touré sont reconstitués ; les taux d'impôt, de cotisation et d'intérêt sont des exemples à vérifier dans votre pays. Ce classeur ne remplace pas l'avis d'un expert-comptable.", 4)
ws.freeze_panes = "A4"

for w in wb.worksheets:
    w.sheet_properties.tabColor = C_MG if w.title != "ACCUEIL" else C_DG
    w.page_setup.orientation = "landscape"
    w.page_setup.fitToWidth = 1
    w.page_setup.fitToHeight = 0
    w.sheet_properties.pageSetUpPr.fitToPage = True

wb.save(sys.argv[1])
print("écrit", sys.argv[1])
