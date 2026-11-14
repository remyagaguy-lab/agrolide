# -*- coding: utf-8 -*-
"""Génère les fiches Cadre pays Burkina Faso, Mali, Niger (src/content/cadre-pays/*.ts), vérifiées sur le web le 14/11/2026.
Principe de la série : textes cités par numéro, aucun taux ni plafond recopié, « non confirmé » quand une source manque.
Usage : python scripts/cadre_pays/gen_sahel.py (depuis agrolide/)."""
import json

DATE, REVISION = "2026-11-14", "2027-02-14"

INTRO = """### Comment lire cette fiche

Cette fiche rassemble ce qu'un porteur de projet agricole doit vérifier {au} avant de chiffrer son business plan. Elle a été contrôlée sur le web le **14 novembre 2026** ; chaque point renvoie à une source listée en fin de fiche.

- Les **textes** (lois, décrets) sont cités par leur numéro : ils changent peu.
- Les **taux, plafonds, seuils et frais** ne sont volontairement **pas** recopiés : ils changent chaque année. La fiche dit où lire la valeur en vigueur, et ces valeurs doivent être saisies dans le modèle financier avec leur source et leur date.
- Quand un point n'a pas pu être confirmé, c'est écrit : « non confirmé ». Une information non confirmée n'est jamais présentée comme acquise.
- Plusieurs sources consultées sont des articles de presse ou des sites commerciaux : elles ne servent qu'à repérer un sujet, jamais à fixer un montant.
- Cette fiche est **moins détaillée** que celles du Togo, du Bénin, de la Côte d'Ivoire et du Sénégal : certains points restent à vérifier auprès des administrations locales.
- La fiche sera revérifiée au plus tard le **14 février 2027**.

*Cette fiche est un guide pédagogique, pas un conseil juridique ou fiscal : faites confirmer chaque point par un professionnel local (notaire, expert-comptable, conseil juridique) avant de signer ou de déposer un dossier.*
"""

STATUTS = """### 1. Statuts juridiques

Le pays applique les Actes uniformes de l'OHADA. Formes courantes en agriculture : l'**entreprise individuelle** (patrimoine personnel non protégé), l'**entreprenant** (statut simplifié réservé à une personne physique, plafond d'activité fixé par chaque pays), la **SARL** et la **SARL à associé unique (SARLU)**, la **SAS/SASU** (statuts très libres, utile avec des investisseurs), la **société coopérative** (acte uniforme du 15 décembre 2010) et le **GIE** (solidarité des dettes). Le capital minimal et les frais de constitution sont à confirmer au guichet de création : les sources consultées sont des sites commerciaux aux chiffres contradictoires.

**Pour votre dossier :** indiquez la forme choisie et la raison du choix ; joignez les statuts et l'extrait du registre du commerce (RCCM).
"""

EAU = "Le régime des forages et des prélèvements d'eau, l'homologation des produits phytosanitaires et les éventuelles études d'impact environnemental **n'ont pas été vérifiés** pour cette fiche : interrogez les directions chargées de l'eau et de la protection des végétaux avant de lancer vos travaux.\n"

ASSUR = "- **Non confirmé** : aucune source retrouvée sur un dispositif d'assurance agricole accessible aux producteurs {adj}s. Demandez un devis aux assureurs, en précisant la culture et la zone.\n- Ne présentez aucune assurance comme acquise dans le plan sans devis écrit.\n"

FIN_INTRO = "Statut vérifié au 14 novembre 2026. Aucun taux ni plafond n'est cité.\n\n| Dispositif | Ce que c'est | Statut vérifié |\n|---|---|---|\n"
FIN_OUTRO = "\n**Dans votre dossier :** nommez le dispositif visé, ses conditions à la date où vous écrivez, la pièce qui prouve votre éligibilité et un contact de l'organisme.\n"
FIN_COMMUN = (
    "| Institutions de microfinance et banques commerciales | Crédits de campagne et d'investissement | Non vérifié individuellement |\n"
    "| Programmes de bailleurs et fonds de garantie | Appuis aux producteurs et aux PME | **Non confirmé** : aucun dispositif vérifié pour cette fiche |\n"
)


def fiche(slug, ident, nom, au, adj, resume, foncier, identifiants, finance, checklist_id, sources):
    c = INTRO.format(au=au) + "\n" + STATUTS + "\n### 2. Foncier\n\n" + foncier + "\n### 3. Identifiants et formalités\n\n" + identifiants
    c += f"\n### 4. Fiscalité de base (à vérifier avec un expert-comptable {adj})\n\n"
    c += "- Lisez dans le **code général des impôts en vigueur** : le taux de l'impôt sur les bénéfices, les régimes applicables aux petites entreprises, le traitement de la TVA sur les produits agricoles et le seuil d'assujettissement. Ces valeurs se saisissent dans la feuille HYPOTHESES du modèle financier.\n"
    c += "- Intrants et matériel importés : vérifiez les droits de douane et les exonérations auprès de la douane (tarif extérieur commun CEDEAO).\n- Les montants cités par les prestataires de création d'entreprise ne font pas foi.\n"
    c += "\n### 5. Eau, environnement et protection des cultures\n\n" + EAU + "\n### 6. Financeurs, garanties et appuis\n\n" + finance + "\n### 7. Assurance agricole\n\n" + ASSUR.format(adj=adj)
    c += "\n### 8. Votre checklist avant de chiffrer\n\n"
    items = [
        "Forme juridique choisie et capital minimal confirmé au guichet de création.",
        "Acte foncier obtenu ou procédure engagée.",
        f"{checklist_id} prévus au calendrier d'installation.",
        "Taux d'impôt, régime applicable et TVA lus dans le code général des impôts en vigueur, avec la date de lecture.",
        "Régime de l'eau et homologation des produits phytosanitaires instruits.",
        "Dispositif de financement ou de garantie visé, conditions écrites et datées.",
        "Devis d'assurance obtenu, prime inscrite dans les charges fixes.",
        "Chaque taux ou plafond saisi dans le modèle financier porte une source et une date.",
    ]
    c += "\n".join(f"{i}. ☐ {t}" for i, t in enumerate(items, 1))
    c += "\n\n### Sources consultées (14 novembre 2026)\n\n" + sources
    ts = "import type { FichePays } from './types'\n\n"
    ts += f"export const {ident}: FichePays = {{\n  slug: '{slug}',\n  nom: {json.dumps(nom, ensure_ascii=False)},\n  devise: 'FCFA (franc CFA UEMOA)',\n"
    ts += f"  verifieLe: '{DATE}',\n  prochaineRevision: '{REVISION}',\n  disponible: true,\n  resume: {json.dumps(resume, ensure_ascii=False)},\n  contenu: {json.dumps(c, ensure_ascii=False)},\n}}\n"
    with open(f"src/content/cadre-pays/{slug}.ts", "w", encoding="utf-8", newline="\r\n") as f:
        f.write(ts)


# ---------------------------------------------------------------- Burkina Faso
fiche(
    "burkina-faso", "burkina_faso", "Burkina Faso", "au Burkina Faso", "burkinabè",
    "Loi de 2009 sur le foncier rural et attestation de possession foncière rurale, CEFORE, IFU, programmes publics, financeurs à vérifier.",
    "- Le texte de référence pour les terres rurales est la **loi n° 034-2009/AN du 16 juin 2009 portant régime foncier rural** (promulguée le 13 juillet 2009). Elle ne s'applique qu'aux terres rurales de production, pas à l'habitat ni au commerce. Une loi du 2 juillet 2012 sur la **réorganisation agraire et foncière (RAF)** la consolide.\n"
    "- La loi reconnaît le **droit de possession foncière rurale**. Après une procédure locale, publique et contradictoire, la commune délivre une **attestation de possession foncière rurale (APFR)**, instruite par le **service foncier rural (SFR)** (décret n° 404 de 2010 sur les structures locales de gestion foncière).\n"
    "- Les commissions foncières villageoises associent les coutumiers, les religieux et les femmes.\n"
    "- **Non confirmé** : un article de presse de juin 2026 évoque une *nouvelle loi* sur la réorganisation agraire et foncière qui maintiendrait l'APFR. Vérifiez la version en vigueur et les articles applicables auprès de la commune ou du ministère avant de vous appuyer sur la loi de 2009.\n"
    "- **Non confirmé** : les délais et les frais actuels de délivrance d'une APFR.\n\n**Pour votre dossier :** joignez l'APFR ou le titre sécurisant votre terre, ou à défaut la preuve de la procédure engagée. Sans foncier sécurisé, aucune banque ne prête.\n",
    "- La création passe par le **centre de formalités des entreprises (CEFORE)** de la Maison de l'entreprise, présent à Ouagadougou, Bobo-Dioulasso et dans d'autres villes : le registre du commerce (**RCCM**), l'**IFU** (identifiant financier unique, délivré par la direction générale des impôts), la carte professionnelle et l'affiliation à la caisse de sécurité sociale (CNSS) sont obtenus dans le même parcours, selon le guide de la Maison de l'entreprise.\n"
    "- Ne confondez pas l'IFU avec le NIF (Togo, Mali, Niger), le NINEA (Sénégal), l'identifiant unique ivoirien ou le TIN (Ghana, Nigeria).\n"
    "- **Frais et délais** : les sources consultées sont des blogs et sites commerciaux aux chiffres variables. Lisez le tarif officiel sur le site de la Maison de l'entreprise avant de planifier.\n"
    "- **Sécurité sociale** : lisez les taux et plafonds sur le site de la caisse (ils alimentent la ligne « cotisations sociales » de la feuille CHARGES).\n",
    FIN_INTRO
    + "| PATAB (projet d'appui à la transformation de l'agriculture, Banque mondiale) | Financement public d'environ 216 millions de dollars annoncé en mars 2026 pour la productivité, l'investissement privé et la sécurité alimentaire | Annoncé ; **non confirmé** : accès direct pour un porteur privé |\n"
    "| Projet du FIDA de résilience agricole (2026-2031) | Accord de financement signé avec le gouvernement ; budget total de l'ordre de 157 millions de dollars selon la presse | Annoncé ; **non confirmé** : bénéficiaires et modalités |\n"
    "| BOAD | Finance l'acquisition d'intrants pour la campagne cotonnière 2026-2027 | Concerne la filière coton, pas un guichet pour un projet individuel |\n"
    "| FBDES, banques commerciales (dont Coris Bank) | Crédits de campagne et d'investissement | **Non confirmé** : aucune source fiable retrouvée sur leurs conditions agricoles |\n"
    + FIN_COMMUN + FIN_OUTRO,
    "IFU, RCCM et affiliation sociale",
    "- Foncier rural : [GRET, capitalisation de la politique foncière](https://gret.org/wp-content/uploads/2021/12/Capitalisation_politique_fonciere_Burkina-VF.pdf) ; [Land Portal, texte de la loi 034-2009](https://data.landportal.info/sites/default/files/library/resources/Loi_034_portant_regime_foncier_en_milieu_rural.pdf) ; [Sidwaya, titres de jouissance](https://www.sidwaya.info/carrefour/2024/11/28/securisation-des-exploitations-agricoles-ruee-vers-les-titres-de-jouissance-au-centre-ouest/) ; nouvelle loi RAF : [AllAfrica, juin 2026](https://fr.allafrica.com/stories/202606300443.html)\n"
    "- Création d'entreprise : [Maison de l'entreprise du Burkina Faso](https://www.me.bf/wp-content/uploads/2024/01/Formalite-personne-physique.pdf) ; [Africarrières](https://africarrieres.com/burkina-faso/fr/guide/employeur-entreprise/starting-business)\n"
    "- Financements publics : [FIDA](https://www.ifad.org/ar/w/news/ifad-and-burkina-faso-sign-a-us-59-million-financing-agreement-to-boost-climate-resilient-agriculture) ; [Capmad, Banque mondiale](https://www.capmad.com/post/world-bank-financing-for-agriculture-in-burkina-faso)\n",
)

# ---------------------------------------------------------------- Mali
fiche(
    "mali", "mali", "Mali", "au Mali", "malien",
    "Loi d'orientation agricole de 2006, loi sur le foncier agricole de 2017, API-Mali, NIF, financeurs à vérifier.",
    "- La **loi d'orientation agricole (LOA) de 2006** fixe le cadre : accès équitable à la terre, sécurisation des exploitations, reconnaissance des droits coutumiers, création des **commissions foncières (COFO)**.\n"
    "- La **loi sur le foncier agricole (LFA)**, promulguée en **avril 2017**, a traité pour la première fois spécifiquement le foncier agricole. Elle reconnaît les droits coutumiers et crée deux documents : l'**attestation de détention coutumière** et l'**attestation de possession foncière**. La commission foncière de village ou de hameau facilite la formalisation de ces droits ; un observatoire du foncier suit l'application de la loi.\n"
    "- Le **titre foncier** relève de l'ancien code domanial et foncier. D'après une source, les terres coutumières relèvent du domaine privé de l'État tant qu'elles ne sont pas titrées.\n"
    "- **Non confirmé** : comment les attestations de la LFA s'articulent avec le titre foncier en pratique, leurs délais et leurs frais, et leur acceptation par les banques comme garantie. Interrogez la commune et la banque visée.\n\n**Pour votre dossier :** joignez l'attestation ou le titre qui sécurise votre terre, ou la preuve de la procédure engagée.\n",
    "- La création passe par le **guichet unique de l'API-Mali** (Agence pour la promotion des investissements), qui regroupe la plupart des formalités : dénomination, **RCCM**, **NIF** (numéro d'identification fiscale) et déclaration à la caisse de sécurité sociale. Il a été créé par le décret n° 08-276/P-RM du 13 mai 2008, modifié en 2009, et dispose de guichets régionaux (Kayes, Ségou, Sikasso, Mopti).\n"
    "- Les guides consultés annoncent 3 à 5 jours ouvrables pour le RCCM et un NIF quasi immédiat ; le décret prévoit une réponse 72 heures après le dépôt. **Frais** : les chiffres des blogs varient ; lisez le tarif officiel à l'API-Mali avant de planifier.\n"
    "- Ne confondez pas le NIF avec l'IFU (Bénin, Burkina Faso), le NINEA (Sénégal), l'identifiant unique ivoirien ou le TIN (Ghana, Nigeria).\n"
    "- **Sécurité sociale** : lisez les taux et plafonds sur le site de la caisse (ils alimentent la ligne « cotisations sociales » de la feuille CHARGES).\n",
    FIN_INTRO
    + "| BNDA (Banque nationale de développement agricole) | Banque agricole du pays | **Non confirmé** : aucune source retrouvée sur ses conditions actuelles |\n"
    + FIN_COMMUN + FIN_OUTRO,
    "NIF, RCCM et affiliation sociale",
    "- Foncier agricole : [IISD, nouvelle loi pour sécuriser les terres](https://www.iisd.org/articles/insight/une-nouvelle-loi-pour-securiser-les-terres-au-profit-des-paysans-maliens) ; [IPAR, innovations de la loi foncière agricole](https://ipar.sn/wp-content/uploads/2024/09/Les-innovations-de-la-loi-fonciere-agricole-au-mali.pdf) ; [FAOLEX](https://faolex.fao.org/docs/pdf/mli155451.pdf)\n"
    "- Création d'entreprise : [API-Mali, présentation 2025](https://apimali.gov.ml/wp-content/uploads/2025/06/2025-Présentation-API-Mali.pdf) ; [Africarrières](https://africarrieres.com/mali/fr/guide/employeur-entreprise/starting-business)\n",
)

# ---------------------------------------------------------------- Niger
fiche(
    "niger", "niger", "Niger", "au Niger", "nigérien",
    "Code rural de 1993, commissions foncières, Maison de l'entreprise, NIF, financeurs à vérifier.",
    "- Le texte cadre est l'**ordonnance n° 93-015 du 2 mars 1993 fixant les principes d'orientation du code rural**. Elle a créé le comité national du code rural, des secrétariats permanents régionaux et des **commissions foncières** (communales, départementales, de base).\n"
    "- Les droits coutumiers sont reconnus par une procédure publique et contradictoire ; le code prévoit des moyens de formaliser la propriété (acte authentique, **certificat d'inscription au dossier rural**, acte sous seing privé) en plus de l'immatriculation.\n"
    "- **Réforme** : une revue de l'ordonnance en 2013 a relevé des textes dépassés et contradictoires ; une consultation nationale a suivi en 2018. Les sources consultées indiquent qu'une nouvelle loi foncière n'était pas encore rédigée ; **non confirmé** : l'état actuel de la réforme.\n"
    "- **Non confirmé** : les délais et les frais actuels, et l'acceptation par les banques des documents du dossier rural comme garantie.\n\n**Pour votre dossier :** joignez l'acte sécurisant votre terre (inscription au dossier rural ou titre), ou la preuve de la procédure engagée auprès de la commission foncière.\n",
    "- La création passe par le **centre des formalités des entreprises (CFE)** de la Maison de l'entreprise à Niamey : dépôt en personne, transmission au registre du commerce, délivrance de l'extrait **RCCM** et du **NIF** (numéro d'identification fiscale) ; le guichet regroupe le greffe, les impôts et la sécurité sociale selon les sources consultées.\n"
    "- **Frais et délais** : les sources se contredisent (de 72 heures à plusieurs semaines ; des coûts très différents selon la forme juridique). Lisez le tarif officiel à la Maison de l'entreprise.\n"
    "- **Capital des SARL** : les sources se contredisent (capital libre ou fixé par décret) ; confirmez au guichet.\n"
    "- Ne confondez pas le NIF avec l'IFU (Bénin, Burkina Faso), le NINEA (Sénégal), l'identifiant unique ivoirien ou le TIN (Ghana, Nigeria).\n",
    FIN_INTRO
    + "| BAGRI (Banque agricole du Niger) | Banque agricole du pays | **Non confirmé** : aucune source retrouvée sur ses conditions actuelles |\n"
    + FIN_COMMUN + FIN_OUTRO,
    "NIF, RCCM et affiliation sociale",
    "- Code rural : [FAOLEX, ordonnance 93-015](https://faolex.fao.org/docs/pdf/ner80747.pdf) ; [Land Portal, fiche Niger](https://landportal.org/nl/node/217904) ; [RECA, terres communautaires](https://reca-niger.org/IMG/pdf/2015-04_Les_terres_communautaires.pdf)\n"
    "- Création d'entreprise : [Africarrières](https://africarrieres.com/niger/fr/guide/employeur-entreprise/starting-business) ; [Création d'entreprise](https://www.creerentreprise.fr/creer-entreprise-niger/)\n",
)

# ---------------------------------------------------------------- index
p = "src/content/cadre-pays/index.ts"
s = open(p, "rb").read().decode("utf-8")
nl = "\r\n" if "\r\n" in s else "\n"
if "burkina_faso" not in s:
    s = s.replace("import { senegal } from './senegal'" + nl, "import { senegal } from './senegal'" + nl + "import { burkina_faso } from './burkina-faso'" + nl + "import { mali } from './mali'" + nl + "import { niger } from './niger'" + nl, 1)
    lines = [l for l in s.split(nl) if not l.strip().startswith(("aVenir('burkina-faso'", "aVenir('mali'", "aVenir('niger'"))]
    s = nl.join(lines).replace("  senegal," + nl, "  senegal," + nl + "  burkina_faso," + nl + "  mali," + nl + "  niger," + nl, 1)
    open(p, "wb").write(s.encode("utf-8"))
print("fiches écrites")
