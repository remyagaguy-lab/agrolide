"""
Range la bibliothèque Agrolide : un dossier par domaine, un sous-dossier par type,
chaque document renommé (DOC-xxxxx__titre-court.ext).

Principes
- Les fichiers de Bibliothèque-Agrolide sont DÉPLACÉS (renommage sur le même disque : instantané,
  rien n'est copié, rien n'est supprimé). Les fichiers extraits d'archives (.rar/.zip) sont COPIÉS.
- Chaque déplacement est écrit dans _Index/deplacements.csv ; annuler_rangement.py remet tout en place.
- Sans --execute, le script ne touche à rien : il vérifie et affiche le plan.

Usage :  python -I ranger_bibliotheque.py            (essai à blanc)
         python -I ranger_bibliotheque.py --execute  (rangement réel)
"""
import csv, glob, json, os, shutil, sys, unicodedata, collections

ONEDRIVE = r"C:\Users\PC\OneDrive\Documents\Professionnel\Carrière\Business\agrolide.org"
SRC_ROOT = ONEDRIVE + r"\Opérations\Formation\Bibliothèque-Agrolide"
DEST = SRC_ROOT + r"\Classée"
WT = r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline\pipeline"
CORR = ONEDRIVE + r"\Bibliotheque-Curation\correction-lot-public"
TAXO = ONEDRIVE + r"\Bibliotheque-Curation\taxonomie.json"
EXECUTE = "--execute" in sys.argv
MAX_PATH = 245

DOMAINES = {
    "production_vegetale": "01 Production végétale",
    "production_animale": "02 Production animale",
    "agroeconomie": "03 Agroéconomie",
    "agroalimentaire": "04 Agroalimentaire",
    "ressources_naturelles_environnement": "05 Ressources naturelles",
    "transversal": "06 Transversal",
}
TYPES = {t["code"]: t["label"].split(" / ")[0].replace("Article scientifique ou technique", "Article") for t in json.load(open(TAXO, encoding="utf-8"))["types_document"]}
TYPES.update({"outil_modele": "Outil et modèle", "actes_conference": "Actes de conférence", "texte_officiel": "Texte officiel"})
EXCLUS = {"exclu_hors_perimetre": "_Hors périmètre", "exclu_doublon": "_Doublons", "exclu_illisible": "_Illisibles"}

fiches = {}
for f in glob.glob(WT + r"\output\fiches\DOC-*.json"):
    d = json.load(open(f, encoding="utf-8")); fiches[d["id"]] = d
paths = json.load(open(WT + r"\checkpoints\path_index.json", encoding="utf-8"))
patch = json.load(open(CORR + r"\corrections_proposees.json", encoding="utf-8"))
corr_rows = list(csv.DictReader(open(CORR + r"\correction_lot_public.csv", encoding="utf-8-sig"), delimiter=";"))
groupes = collections.defaultdict(set)
for r in corr_rows: groupes[r["id"]].add(r["groupe"])

# ---- décisions finales (décisions d'Antigravity + corrections validées par l'utilisateur)
final = {}
for i, d in fiches.items():
    dec, why = d["decision_publication"], ""
    g = groupes.get(i, set())
    if i in patch and "decision_publication" in patch[i]:
        dec = patch[i]["decision_publication"]; why = "Droits : " + ("/".join(sorted(g)))
    if "E" in g:
        dec, why = "non_publie_archive", "Document d'avant 2000 : non publié (décision du responsable)"
    elif "D" in g and dec == "public":
        dec, why = "membres", "Contexte tempéré : réservé aux inscrits (décision du responsable)"
    elif "D" in g:
        why = "Contexte tempéré : réservé aux inscrits (décision du responsable)"
    final[i] = (dec, why)

def dossier(d, dec):
    if dec in EXCLUS: return EXCLUS[dec]
    if d["domaine_principal"] == "hors_perimetre": return EXCLUS["exclu_hors_perimetre"]
    return os.path.join(DOMAINES[d["domaine_principal"]], TYPES[d["type_doc"]])

plan = []
for i in sorted(fiches):
    d = fiches[i]; dec, why = final[i]
    src = paths[i]
    ext = os.path.splitext(src)[1].lower()
    stem = os.path.splitext(d["nom_fichier_final"])[0]
    if len(stem) > 58: stem = stem[:58].rstrip("-_")   # garde le chemin sous la limite Windows de 260 caractères
    rel = os.path.join(dossier(d, dec), stem + ext)
    dst = os.path.join(DEST, rel)
    mode = "copie" if src.startswith(WT) else "deplacement"
    plan.append((i, src, dst, mode, dec, why))

# ---- vérifications
errs = []
dsts = [p[2] for p in plan]
if len(set(x.lower() for x in dsts)) != len(dsts): errs.append("collisions de noms de destination")
mx = max(len(x) for x in dsts)
if mx > MAX_PATH: errs.append(f"chemin trop long : {mx}")
for i, src, dst, mode, dec, why in plan:
    if not os.path.isfile(src): errs.append(f"source absente {i}")
    elif os.path.getsize(src) != fiches[i]["taille_octets"]: errs.append(f"taille différente {i}")
print("documents:", len(plan), "| déplacés:", sum(p[3] == "deplacement" for p in plan), "| copiés (archives):", sum(p[3] == "copie" for p in plan))
print("chemin le plus long:", mx, "| erreurs:", errs[:5] if errs else "aucune")
print("décisions finales:", dict(collections.Counter(p[4] for p in plan)))
par = collections.Counter(os.path.relpath(os.path.dirname(p[2]), DEST).split(os.sep)[0] for p in plan)
print("par dossier:", dict(sorted(par.items())))
if errs or not EXECUTE:
    print("\nESSAI À BLANC : rien n'a été modifié." if not EXECUTE else "\nARRÊT : erreurs détectées, rien n'a été modifié.")
    sys.exit(1 if errs else 0)

# ---- exécution
idx = os.path.join(DEST, "_Index"); os.makedirs(idx, exist_ok=True)
journal = open(os.path.join(idx, "deplacements.csv"), "w", newline="", encoding="utf-8-sig")
w = csv.writer(journal, delimiter=";"); w.writerow(["id", "mode", "ancien_chemin", "nouveau_chemin"])
done = 0
for i, src, dst, mode, dec, why in plan:
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if mode == "copie": shutil.copy2(src, dst)
    else: os.rename(src, dst)
    w.writerow([i, mode, src, dst]); journal.flush(); done += 1
journal.close()
print("fichiers traités:", done)

# ---- index lisible + données d'Antigravity + décisions finales
cols = ["id", "dossier", "nouveau_nom", "decision_finale", "motif_de_la_decision", "titre", "auteurs", "annee", "domaine", "sous_domaine",
        "type", "langue", "public_cible", "contexte_geo", "pertinence", "droits", "licence", "ancien_nom", "sha256"]
with open(os.path.join(idx, "INDEX.csv"), "w", newline="", encoding="utf-8-sig") as fh:
    cw = csv.writer(fh, delimiter=";"); cw.writerow(cols)
    for i, src, dst, mode, dec, why in plan:
        d = fiches[i]; lic = (patch.get(i, {}).get("licence_detectee") or d.get("licence_detectee") or "")
        cw.writerow([i, os.path.relpath(os.path.dirname(dst), DEST), os.path.basename(dst), dec, why or d["motif_decision"], d["titre"], d["auteurs"], d.get("annee") or "",
                     d["domaine_principal"], d["sous_domaine"], d["type_doc"], d["langue"], d["public_principal"], d["contexte_geo"],
                     d["pertinence_plateforme"], patch.get(i, {}).get("statut_droits", d["statut_droits"]), lic, d["nom_original"], d["sha256"]])
json.dump({i: {"decision_publication": final[i][0], "motif_changement": final[i][1], **({k: v for k, v in patch.get(i, {}).items() if k != "decision_publication"})} for i in final},
          open(os.path.join(idx, "decisions_finales.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
shutil.copytree(WT + r"\output\fiches", os.path.join(idx, "donnees_antigravity", "fiches"), dirs_exist_ok=True)
shutil.copytree(WT + r"\output\rapport", os.path.join(idx, "donnees_antigravity", "rapport"), dirs_exist_ok=True)

# ---- annulation
undo = '''"""Remet chaque fichier déplacé à son emplacement d'origine (les copies d'archives sont simplement supprimées)."""
import csv, os, shutil
rows = list(csv.DictReader(open(os.path.join(os.path.dirname(__file__), "deplacements.csv"), encoding="utf-8-sig"), delimiter=";"))
for r in rows:
    if r["mode"] == "deplacement" and os.path.exists(r["nouveau_chemin"]):
        os.makedirs(os.path.dirname(r["ancien_chemin"]), exist_ok=True)
        os.rename(r["nouveau_chemin"], r["ancien_chemin"])
    elif r["mode"] == "copie" and os.path.exists(r["nouveau_chemin"]):
        os.remove(r["nouveau_chemin"])
print(len(rows), "fichiers traités")
'''
open(os.path.join(idx, "annuler_rangement.py"), "w", encoding="utf-8").write(undo)
print("Index, décisions et script d'annulation écrits dans", idx)
