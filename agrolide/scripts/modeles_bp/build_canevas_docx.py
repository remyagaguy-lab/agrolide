# -*- coding: utf-8 -*-
"""Génère le canevas Word du business plan agricole (12 sections, plan type de la leçon 6.4).
Usage : python scripts/modeles_bp/build_canevas_docx.py <fichier.docx>"""
import sys
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

VERT = RGBColor(0x1B, 0x43, 0x32)
VERT2 = RGBColor(0x2D, 0x6A, 0x4F)
GRIS = RGBColor(0x55, 0x55, 0x55)

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21), Cm(29.7)
sec.left_margin = sec.right_margin = Cm(2.2)
sec.top_margin, sec.bottom_margin = Cm(2.2), Cm(2.0)

st = doc.styles
st["Normal"].font.name = "Calibri"
st["Normal"].font.size = Pt(11)
st["Normal"].element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
for name, size, color in [("Heading 1", 18, VERT), ("Heading 2", 13, VERT2), ("Heading 3", 11.5, VERT2)]:
    s = st[name]
    s.font.name, s.font.size, s.font.bold, s.font.color.rgb = "Calibri", Pt(size), True, color
    s.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    s.paragraph_format.space_before = Pt(14 if name == "Heading 1" else 10)
    s.paragraph_format.space_after = Pt(6)
    s.paragraph_format.keep_with_next = True


def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), hexcolor)
    tcPr.append(shd)


def para(text="", bold=False, italic=False, size=None, color=None, align=None, after=4, style=None):
    p = doc.add_paragraph(style=style)
    p.paragraph_format.space_after = Pt(after)
    if align:
        p.alignment = align
    r = p.add_run(text)
    r.bold, r.italic = bold, italic
    if size:
        r.font.size = Pt(size)
    if color:
        r.font.color.rgb = color
    return p


def bullets(items, style="List Bullet"):
    for t in items:
        p = doc.add_paragraph(style=style)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(t)


def box(title, lines, fill="D8F3DC"):
    """Encadré à une cellule : titre en gras puis lignes."""
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.style = "Table Grid"
    c = t.rows[0].cells[0]
    shade(c, fill)
    p = c.paragraphs[0]
    r = p.add_run(title); r.bold = True; r.font.color.rgb = VERT
    for ln in lines:
        q = c.add_paragraph(ln)
        q.paragraph_format.space_after = Pt(2)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]
        shade(c, "2D6A4F")
        c.paragraphs[0].text = ""
        r = c.paragraphs[0].add_run(h); r.bold = True; r.font.color.rgb = RGBColor(255, 255, 255); r.font.size = Pt(10)
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].paragraphs[0].text = ""
            r = cells[i].paragraphs[0].add_run(v); r.font.size = Pt(10)
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def footer():
    f = sec.footer.paragraphs[0]
    f.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = f.add_run("Canevas de business plan agricole · réseau agrolide · page ")
    r.font.size = Pt(9); r.font.color.rgb = GRIS
    for tag, txt in (("begin", None), (None, "PAGE"), ("end", None)):
        run = f.add_run(); run.font.size = Pt(9); run.font.color.rgb = GRIS
        if tag:
            fc = OxmlElement("w:fldChar"); fc.set(qn("w:fldCharType"), tag); run._r.append(fc)
        else:
            it = OxmlElement("w:instrText"); it.set(qn("xml:space"), "preserve"); it.text = txt; run._r.append(it)


footer()

# ------------------------------------------------------------------ page de garde
for _ in range(5):
    doc.add_paragraph()
para("[NOM DE VOTRE ENTREPRISE]", bold=True, size=26, color=VERT, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
para("BUSINESS PLAN", bold=True, size=20, color=VERT2, align=WD_ALIGN_PARAGRAPH.CENTER, after=4)
para("[Intitulé du projet : culture, surface, zone]", italic=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, after=30)
table(["Rubrique", "À compléter"], [["Porteur de projet", "[Nom, prénom]"], ["Forme juridique", "[SARLU, SARL, GIE, coopérative…]"],
                                    ["Localisation", "[Commune, région, pays]"], ["Montant du financement demandé", "[… FCFA ou GHS, NGN…]"],
                                    ["Date et version", "[JJ/MM/AAAA · version n°]"], ["Contact", "[Téléphone · e-mail]"]], [6, 10])
para("Ce document est confidentiel.", italic=True, color=GRIS, align=WD_ALIGN_PARAGRAPH.CENTER)
doc.add_page_break()

# ------------------------------------------------------------------ mode d'emploi
doc.add_heading("Comment utiliser ce canevas", 1)
para("Ce canevas suit le plan type en 12 sections de la formation « Rédiger un business plan agricole qui convainc » du réseau agrolide (leçon 6.4). Pour chaque section vous trouvez : l'objectif, le contenu attendu, une trame à remplir (les textes entre [crochets]), les pièges à éviter et la leçon à relire.")
bullets([
    "Remplacez tous les textes entre [crochets] et supprimez les encadrés verts d'aide une fois la section rédigée.",
    "Écrivez la section 1 (résumé opérationnel) en dernier, mais placez-la au début du dossier.",
    "Appuyez chaque chiffre sur un devis, une enquête ou une source datée, et reportez-le à l'identique dans toutes les sections.",
    "Construisez les chiffres des sections 9 à 11 avec le classeur Excel « Modèle financier » fourni avec cette formation, et reportez-y les résultats.",
    "Faites relire le dossier par un professionnel (banquier, comptable, agronome, mentor) avant de l'envoyer.",
    "Longueur conseillée : 30 à 40 pages hors annexes ; résumé de 1 à 2 pages.",
])
box("Fiche synoptique à compléter en dernier (1 page)", [
    "Projet : [en une phrase]  ·  Porteur : [nom]  ·  Zone : [lieu]",
    "Produits : [cultures, volumes annuels]  ·  Clients ciblés : [segments]",
    "Coût du projet : [montant]  ·  Apport : [montant, %]  ·  Financement demandé : [montant, durée, différé]",
    "Chiffre d'affaires de croisière : [montant]  ·  Résultat net de croisière : [montant]",
    "Seuil de rentabilité : [montant]  ·  DSCR (réaliste / pessimiste) : [x / y]  ·  VAN : [montant]  ·  TRI : [%]",
])
doc.add_page_break()

# ------------------------------------------------------------------ sections
SECTIONS = [
    ("1. Résumé opérationnel (Executive Summary)", "6.2", "À écrire en dernier. 1 à 2 pages. Si ce résumé ne convainc pas, le reste ne sera jamais lu.",
     ["Le problème ou l'opportunité, avec un chiffre sourcé.", "Votre solution et vos volumes de production.", "Le marché ciblé et votre avantage concurrentiel.", "L'équipe : qui porte le projet et pourquoi lui.", "Le besoin de financement : coût total, apport, emprunt demandé.", "La rentabilité : chiffre d'affaires, résultat net, DSCR, VAN, TRI dans plusieurs scénarios."],
     ["Le projet [nom] produit [volume] de [produit] sur [surface] à [lieu], et [avantage : stockage, transformation, contrat…] pour vendre quand les prix sont les plus favorables.",
      "Notre clientèle : [segments] avec lesquels [nombre] lettres d'intention ont été obtenues.",
      "Le projet est porté par [nom], [profil], appuyé par [équipe].",
      "Besoin de financement : [coût total]. Apport : [montant] ([%]). Emprunt sollicité : [montant], [taux], [durée] dont [différé] de différé.",
      "Chiffre d'affaires de croisière : [montant] ; résultat net : [montant] ; couverture de la dette : [x] en scénario réaliste et [y] en scénario pessimiste ; TRI : [%] ; VAN : [montant]."],
     "Des généralités, du jargon, des chiffres qui ne se retrouvent pas dans les tableaux."),
    ("2. Contexte, problème et solution", "1.2", "Méthode en quatre temps : constat, problématique, solution, moyens. Fixez aussi vos objectifs chiffrés et datés.",
     ["Un constat général appuyé sur des chiffres sourcés et datés.", "Le problème précis que vous avez repéré.", "Votre proposition de valeur.", "Les moyens mis en œuvre.", "Objectifs à court terme (année 1) et à moyen terme (3 à 5 ans), avec indicateurs."],
     ["Constat : [chiffre de production ou de marché, source, date].", "Problème : [ce qui ne fonctionne pas pour les producteurs ou les clients].",
      "Solution : [ce que vous proposez et en quoi cela répond au problème].", "Moyens : [financement, équipements, compétences, partenaires].",
      "Objectifs : année 1 [volume, surface, CA] ; année 3 à 5 [extension, diversification…]."],
     "« Le pays a besoin de produire plus » : aucun chiffre, aucun problème précis."),
    ("3. Le porteur de projet et l'équipe", "1.3", "Un bailleur finance une idée portée par une personne : il doit pouvoir lui faire confiance.",
     ["Identité et parcours expliqués en lien avec le projet.", "Motivations (pas seulement financières).", "Compétences par famille : techniques, gestion, commerciales, transversales, avec une preuve concrète chacune.", "Contraintes assumées et la manière de les compenser.", "Organisation, organigramme et répartition du capital entre associés."],
     ["Parcours : [3 à 5 lignes] ; lien avec le projet : [explication].", "Motivations : [3 motivations].",
      "Contrainte : [laquelle] ; mesure de compensation : [comment]."],
     "Un CV brut sans lien avec le projet ; prétendre n'avoir aucune faiblesse."),
    ("4. Étude de marché : environnement, clients, concurrence, FFOM", "2.1 à 2.4", "Prouvez qu'il existe une demande réelle et que vous avez trouvé votre créneau.",
     ["Environnement (PESTEL) de VOTRE pays et de votre zone.", "Segmentation de la clientèle avec données primaires (vos enquêtes) et secondaires (statistiques).", "Cartographie de 3 à 5 concurrents directs et indirects, tableau comparatif et créneau.", "Matrice FFOM avec stratégies croisées."],
     ["Segments retenus : [grossistes, supermarchés, transformateurs, restaurants…], volumes visés : [t/an].", "Enquête : [nombre] acheteurs interrogés entre [date] et [date].",
      "Concurrents : [nom, forces, faiblesses, prix].", "Créneau : [proposition de valeur en une phrase]."],
     "« Tout le monde est mon client » ; « je n'ai pas de concurrent »."),
    ("5. Produits et itinéraire technique", "3.1", "Prouvez que vous maîtrisez techniquement votre métier et que vos rendements sont réalistes.",
     ["Fiche produit : variété, conditionnement, qualité, normes.", "Itinéraire technique en six étapes : préparation du sol, semis ou plantation, irrigation, entretien et fertilisation, protection phytosanitaire, récolte et post-récolte.", "Coûts par poste et par hectare, avec source et date."],
     ["Variété : [nom] choisie parce que [raison].", "Rendement visé : [t/ha], justifié par [pratiques].", "Coût variable : [montant/ha] ; coût au kilo : [FCFA/kg] ; prix de vente : [FCFA/kg]."],
     "Un rendement annoncé sans pratique qui le justifie ; des coûts sans source."),
    ("6. Calendrier d'installation et de production", "3.2", "Deux calendriers distincts : installation (avant la première mise en terre) et production (cycles annuels), adaptés à votre zone agro-climatique.",
     ["Zone agro-climatique et source des dates.", "Calendrier d'installation mois par mois (bail, forage, équipements, premiers intrants).", "Calendrier de production sur 12 mois et plan d'assolement.", "Plan d'approvisionnement en intrants."],
     ["Zone : [sahélienne / soudanienne / subhumide] ; source : [service agricole, météo].", "Mois 1 : [tâche] ; mois 2 : [tâche]…", "Année 1 : [pourcentage] de la pleine production, parce que [raison]."],
     "Des délais d'installation sous-estimés (forage, formalités)."),
    ("7. Forme juridique, organisation, autorisations", "3.3", "Justifiez votre choix de forme juridique et montrez que le projet est en règle.",
     ["Forme juridique choisie, avantages, limites, raison du choix.", "Organigramme : permanents et journaliers, budget des ressources humaines.", "Autorisations : acte foncier reconnu, autorisation d'eau ou de forage, identifiant fiscal, registre du commerce, obligations fiscales et sociales de votre pays."],
     ["Forme choisie : [forme] parce que [raison].", "Personnel permanent : [postes] ; journaliers : [pics, nombre].", "Statut du foncier : [titre, bail, affectation, certificat…], délivré par [autorité] le [date]."],
     "Oublier le foncier : sans acte reconnu, aucune banque ne prête."),
    ("8. Stratégie commerciale et plan de prospection", "4.1 et 4.2", "Montrez comment vous passerez du champ au client : les 4P, puis un plan de prospection avant la récolte.",
     ["Produit, prix (alignement, pénétration ou écrémage), distribution, communication.", "Plan de prospection en trois phases : avant le semis, pendant la croissance, un mois avant la récolte.", "Lettres d'intention, bons de commande et contrats (part de la production couverte).", "Budget de prospection."],
     ["Prix : [stratégie] ; niveau : [FCFA/kg] ; justification : [source datée].", "Circuit : [vente bord-champ, grossistes, supermarchés…].", "Engagements écrits : [x] lettres d'intention, [y] bons de commande, [z] contrats, soit [%] de la production."],
     "Compter une lettre d'intention comme une vente certaine."),
    ("9. Investissements, plan de financement et BFR", "5.1 et 5.2", "Total des emplois = total des ressources. Le BFR initial se finance dès le départ.",
     ["Coût du projet : frais d'établissement, investissements (avec devis récents), imprévus, BFR initial.", "Plan de financement : apport, emprunt, subventions éventuelles.", "Conditions de l'emprunt : taux, durée, différé, garanties.", "Calcul du BFR et creux de trésorerie."],
     ["Emplois : [détail] = [total]. Ressources : apport [montant] ([%]) + emprunt [montant] = [total].", "Prêt : [taux] sur [durée] ans dont [différé] de différé ; annuité : [montant]."],
     "Oublier le BFR ou les imprévus ; devis de plus de 3 mois."),
    ("10. Prévisions financières", "5.3 à 5.6", "Chiffre d'affaires en 3 scénarios, compte de résultat, budget de trésorerie mensuel et bilan. Les tableaux viennent du classeur Excel.",
     ["Chiffre d'affaires : volume × prix, scénarios réaliste, pessimiste et optimiste, et test de crise de prix.", "Compte de résultat sur 3 à 5 ans (construit sur le scénario réaliste).", "Budget de trésorerie mensuel de la première année (solde jamais négatif).", "Bilan prévisionnel (actif = passif)."],
     ["Hypothèses : rendement [t/ha], pertes [%], prix [FCFA/kg], source [étude], date [date].", "Résultat net : année 1 [montant] ; croisière [montant].", "Solde de trésorerie le plus bas : [montant] au mois [mois]."],
     "Bâtir le plan sur le scénario optimiste ; un seul chiffre de CA."),
    ("11. Indicateurs : seuil de rentabilité, couverture de la dette, VAN, TRI", "5.7", "Les cinq indicateurs que regardent les comités de crédit, calculés dans plusieurs scénarios.",
     ["Seuil de rentabilité avec TOUS les coûts fixes (personnel, amortissements, intérêts compris).", "DSCR : flux disponible ÷ service de la dette, en scénario réaliste, pessimiste et de crise.", "VAN, TRI et délai de récupération à partir du tableau de flux sur 5 ans.", "Lecture honnête : où se trouve la limite du projet ?"],
     ["Seuil : [montant] de CA, soit [%] du CA réaliste.", "DSCR année 2 : [x] réaliste, [y] pessimiste, [z] crise.", "VAN à [taux] : [montant] ; TRI : [%] ; délai : [années].", "Limite : le projet devient fragile si [hypothèse]."],
     "Ne présenter qu'un seul scénario ; calculer le seuil avec les seules charges fixes."),
    ("12. Risques, mitigation et annexes", "6.1 et 6.3", "Cotez vos risques (probabilité × impact) et prévoyez une réponse concrète pour chacun ; joignez les preuves en annexe.",
     ["Matrice des risques climatiques, techniques, commerciaux, humains, politiques, de change, de crédit client, fonciers et de financement.", "Cotation de 1 à 3 en probabilité et en impact ; traitez d'abord les scores de 6 ou plus.", "Assurance agricole : devis et prime budgétée.", "Annexes : preuves du foncier, devis, études techniques, preuves commerciales, CV."],
     [],
     "Cacher les risques : le banquier sait que l'agriculture est risquée."),
]
RISQ = [["[Risque 1]", "[1-3]", "[1-3]", "[score]", "[mesure concrète, chiffrée]"], ["[Risque 2]", "[1-3]", "[1-3]", "[score]", "[mesure]"],
        ["[Risque 3]", "[1-3]", "[1-3]", "[score]", "[mesure]"]]
for title, lecon, obj, contenu, trame, piege in SECTIONS:
    doc.add_heading(title, 1)
    para(f"Leçon à relire : {lecon}", italic=True, size=9.5, color=GRIS, after=2)
    box("Objectif", [obj])
    doc.add_heading("Contenu attendu", 3)
    bullets(contenu)
    doc.add_heading("Votre texte", 3)
    if trame:
        for t in trame:
            p = para(t, after=3)
    else:
        table(["Risque", "Probabilité", "Impact", "Score", "Mesure de mitigation"], RISQ, [4, 2.2, 2, 1.8, 6])
        para("Annexes à joindre (cochez) :", bold=True, after=2)
        bullets(["☐ Preuves du foncier (titre, bail, acte d'affectation)", "☐ Devis de moins de 3 mois pour tous les gros investissements",
                 "☐ Études techniques (sol, eau, débit du forage, climat)", "☐ Preuves commerciales (lettres d'intention, contrats, bons de commande)",
                 "☐ CV du porteur et du chef de culture", "☐ Statuts, extrait du registre du commerce, identifiant fiscal"], style="List Paragraph")
    para("[Rédigez ici votre section.]", italic=True, color=GRIS, after=8)
    box("Piège à éviter", [piege], fill="FFF3CD")
    doc.add_page_break()

# ------------------------------------------------------------------ checklist
doc.add_heading("Checklist avant d'envoyer le dossier", 1)
bullets(["☐ Chaque chiffre renvoie à un devis, une enquête ou une source datée.",
         "☐ Le même porteur, les mêmes montants et les mêmes hypothèses reviennent dans toutes les sections.",
         "☐ Les trois scénarios et la couverture de la dette (DSCR) sont calculés.",
         "☐ Les risques sont cotés et chacun a une mesure de mitigation.",
         "☐ L'acte foncier et les devis sont en annexe.",
         "☐ Le résumé opérationnel tient en 1 à 2 pages et reprend exactement les chiffres des tableaux.",
         "☐ Le dossier a été relu par un professionnel (banquier, comptable, agronome ou mentor)."], style="List Paragraph")
para("Plan d'action en 90 jours", bold=True, after=2)
table(["Période", "Actions"], [["Jours 1 à 30", "Enquêtes de terrain (au moins 10 acheteurs), prix relevés et datés, choix des cultures et de la surface, premiers devis."],
                               ["Jours 31 à 60", "Itinéraire technique chiffré, plan de financement, prévisions financières sur le classeur Excel, lettres d'intention d'achat, acte foncier."],
                               ["Jours 61 à 90", "Résumé opérationnel, pitch de 10 diapositives, relecture par un professionnel, dépôt des premiers dossiers."]], [3.5, 12.5])
para("Un bon business plan n'est jamais terminé : il vit et s'adapte à mesure que vous rencontrez le marché réel.", italic=True, color=GRIS)

doc.core_properties.title = "Canevas de business plan agricole"
doc.core_properties.author = "Réseau agrolide"
doc.save(sys.argv[1])
print("écrit", sys.argv[1])
