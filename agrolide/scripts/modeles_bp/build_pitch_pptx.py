# -*- coding: utf-8 -*-
"""Génère le modèle de pitch deck (10 diapositives, structure de la leçon 6.3).
Usage : python scripts/modeles_bp/build_pitch_pptx.py <fichier.pptx>"""
import sys
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

DG, MG, LG = RGBColor(0x1B, 0x43, 0x32), RGBColor(0x2D, 0x6A, 0x4F), RGBColor(0xD8, 0xF3, 0xDC)
AMB, GRY, WHT = RGBColor(0xFF, 0xF3, 0xCD), RGBColor(0x55, 0x55, 0x55), RGBColor(255, 255, 255)

prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
BLANK = prs.slide_layouts[6]


def rect(slide, x, y, w, h, fill, line=None):
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    s.fill.solid(); s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
    s.shadow.inherit = False
    return s


def text(slide, x, y, w, h, paras, size=18, color=DG, bold=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for i, p_ in enumerate(paras if isinstance(paras, list) else [paras]):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(6)
        r = p.add_run()
        r.text = p_
        r.font.size, r.font.bold, r.font.color.rgb, r.font.name = Pt(size), bold, color, "Calibri"
    return tb


def slide(num, titre, question, puces, notes, cle=None):
    s = prs.slides.add_slide(BLANK)
    rect(s, 0, 0, prs.slide_width, Inches(1.25), DG)
    text(s, Inches(0.6), Inches(0.18), Inches(10.8), Inches(0.9), titre, size=30, color=WHT, bold=True, anchor=MSO_ANCHOR.MIDDLE)
    c = rect(s, Inches(11.9), Inches(0.3), Inches(0.75), Inches(0.65), MG)
    text(s, Inches(11.9), Inches(0.3), Inches(0.75), Inches(0.65), str(num), size=22, color=WHT, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    text(s, Inches(0.6), Inches(1.45), Inches(12.1), Inches(0.6), question, size=16, color=GRY)
    text(s, Inches(0.6), Inches(2.1), Inches(7.6), Inches(4.6), ["•  " + p for p in puces], size=22, color=RGBColor(0x22, 0x22, 0x22))
    if cle:
        rect(s, Inches(8.6), Inches(2.2), Inches(4.15), Inches(3.2), LG)
        text(s, Inches(8.8), Inches(2.3), Inches(3.8), Inches(0.5), "Chiffre clé", size=14, color=MG, bold=True)
        text(s, Inches(8.8), Inches(2.8), Inches(3.8), Inches(1.6), cle[0], size=40, color=DG, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        text(s, Inches(8.8), Inches(4.4), Inches(3.8), Inches(0.9), cle[1], size=14, color=GRY, align=PP_ALIGN.CENTER)
    rect(s, 0, Inches(7.1), prs.slide_width, Inches(0.4), LG)
    text(s, Inches(0.6), Inches(7.12), Inches(12), Inches(0.36), "[Nom de l'entreprise]  ·  Pitch deck  ·  Modèle du réseau agrolide", size=11, color=MG)
    s.notes_slide.notes_text_frame.text = notes
    return s


# 1. Page de garde
s = prs.slides.add_slide(BLANK)
rect(s, 0, 0, prs.slide_width, prs.slide_height, DG)
rect(s, Inches(0.8), Inches(3.55), Inches(2.2), Emu(45000), RGBColor(0x95, 0xD5, 0xB2))
text(s, Inches(0.8), Inches(1.6), Inches(11.5), Inches(1.4), "[NOM DE L'ENTREPRISE]", size=48, color=WHT, bold=True)
text(s, Inches(0.8), Inches(2.9), Inches(11.5), Inches(0.7), "[Projet : culture, surface, zone]", size=24, color=RGBColor(0xD8, 0xF3, 0xDC))
text(s, Inches(0.8), Inches(3.9), Inches(11.5), Inches(1.6), ["Pitch de présentation du projet", "[Nom du porteur]  ·  [Téléphone]  ·  [E-mail]  ·  [Date]"], size=18, color=WHT)
s.notes_slide.notes_text_frame.text = ("Diapositive 1 : page de garde. Titre, logo, contact. Présentez-vous en une phrase. Durée : 20 secondes. "
                                      "Le pitch complet dure environ 10 minutes pour 10 diapositives : comptez 1 minute par diapositive.")

slide(2, "Le problème", "Quel problème précis rencontrent les producteurs ou les clients de votre filière ?",
      ["[Constat chiffré et sourcé : production, pertes, prix]", "[Conséquence : ce qui est perdu ou gaspillé]", "[Qui est touché : producteurs, consommateurs, transformateurs]"],
      "Diapositive 2 : le problème identifié. Un chiffre, une source, une date. Exemple de la formation : la récolte d'oignon arrive en bloc, les prix chutent à la récolte puis remontent quelques mois plus tard. Évitez les généralités.",
      cle=("[chiffre]", "[source et année]"))
slide(3, "La solution", "Que proposez-vous, et en quoi répond-elle au problème ?",
      ["[Votre projet en une phrase]", "[Votre produit phare : variété, calibre, conditionnement]", "[Votre avantage : stockage, transformation, qualité, contrat]"],
      "Diapositive 3 : la solution. Reliez-la au problème de la diapositive 2. Une image de votre produit ou de votre site vaut mieux qu'un long texte.")
slide(4, "Le marché et la cible", "Qui va acheter, quelle quantité, à quelles conditions ?",
      ["[Segments choisis : grossistes, supermarchés, transformateurs…]", "[Volume visé par segment (t/an)]", "[Engagements obtenus : lettres d'intention, contrats]"],
      "Diapositive 4 : la taille du marché et la cible. Montrez que vous avez choisi vos clients (pas « tout le monde ») et citez le nombre d'acheteurs rencontrés. Mentionnez les engagements écrits.",
      cle=("[x] lettres", "[volume couvert en % de la production]"))
slide(5, "Le modèle d'affaires", "Comment fixez-vous vos prix et faites-vous vos marges ?",
      ["[Stratégie de prix : alignement, pénétration ou écrémage]", "[Prix de vente moyen (FCFA/kg) et coût variable au kilo]", "[Circuit de distribution et calendrier des ventes]"],
      "Diapositive 5 : modèle d'affaires. Donnez le prix moyen et la marge sur coûts variables. Dans le cas de la formation, le prix moyen de l'oignon est de 200 FCFA/kg (60 % à la récolte, 40 % stocké) pour un coût variable d'environ 52 FCFA/kg.",
      cle=("[prix] FCFA/kg", "[prix de vente moyen]"))
slide(6, "L'itinéraire technique et les opérations", "Quelle preuve donnez-vous que vous savez produire ?",
      ["[Variété, rendement visé (t/ha) et pratiques qui le justifient]", "[Irrigation, fertilisation, protection des cultures]", "[Récolte, séchage, tri, stockage]"],
      "Diapositive 6 : l'itinéraire technique. Résumez les six étapes en une ligne chacune. Le rendement annoncé doit être cohérent avec vos pratiques et avec le tableau des coûts.",
      cle=("[x] t/ha", "[rendement visé]"))
slide(7, "L'équipe", "Qui fait quoi, et pourquoi cette équipe peut réussir ?",
      ["[Porteur : parcours et lien avec le projet]", "[Équipe permanente : chef de culture, responsable irrigation…]", "[Appuis : conseil technique, réseau, mentors]"],
      "Diapositive 7 : l'équipe. Présentez les compétences par famille (techniques, gestion, commerciales, transversales) et nommez honnêtement ce qui manque et comment vous le comblez.")
slide(8, "Le calendrier d'exécution", "Quand le projet démarre-t-il et quand génère-t-il ses premières ventes ?",
      ["[Mois 1 à 5 : installation (bail, forage, équipements)]", "[Première campagne : semis, récolte, ventes]", "[Rythme de montée en puissance : % de la pleine production en année 1]"],
      "Diapositive 8 : calendrier d'exécution. Une frise simple suffit. Précisez l'année 0 (installation, sans chiffre d'affaires) et l'année 1.")
slide(9, "Les données financières clés", "Quel investissement, quel chiffre d'affaires, quelle rentabilité ?",
      ["[Coût du projet : apport + emprunt]", "[Chiffre d'affaires et résultat net : année 1 et croisière]", "[Seuil de rentabilité, DSCR (réaliste / pessimiste), VAN, TRI]"],
      "Diapositive 9 : données financières. Reprenez exactement les chiffres du business plan et du classeur Excel, dans plusieurs scénarios. Dites honnêtement où est la limite du projet (par exemple une chute des prix de 25 %).",
      cle=("[x] / [y]", "DSCR réaliste / pessimiste"))
slide(10, "La demande", "Qu'attendez-vous du jury ou du banquier ?",
      ["Nous cherchons [montant] de financement", "[Durée, taux souhaité, différé demandé]", "[Garanties proposées et prochaines étapes]"],
      "Diapositive 10 : la demande. Une phrase claire : « Nous cherchons X millions pour… ». Terminez en remerciant et en laissant vos coordonnées affichées.",
      cle=("[montant]", "financement demandé"))

prs.core_properties.title = "Modèle de pitch deck : projet agricole"
prs.core_properties.author = "Réseau agrolide"
prs.save(sys.argv[1])
print("écrit", sys.argv[1])
