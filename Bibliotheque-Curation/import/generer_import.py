"""
Prépare l'import des documents publiés (decision_finale = public ou membres) :
  - documents.sql          : les INSERT pour la table `documents` (D1)
  - manifeste_upload.json  : fichier local -> clé R2, taille, empreinte (lu par envoyer-bibliotheque-r2.mjs)
Ne se connecte à rien : il lit le dossier Classée/_Index et écrit deux fichiers à côté de lui.

Usage : python -I generer_import.py
"""
import csv, glob, hashlib, json, os, uuid, datetime

ROOT = r"C:\Users\PC\OneDrive\Documents\Professionnel\Carrière\Business\agrolide.org"
CLASSEE = ROOT + r"\Opérations\Formation\Bibliothèque-Agrolide\Classée"
IDX = CLASSEE + r"\_Index"
OUT = os.path.dirname(os.path.abspath(__file__))

DOMAINE_LABEL = {
    "production_vegetale": "Production végétale", "production_animale": "Production animale", "agroeconomie": "Agroéconomie",
    "agroalimentaire": "Agroalimentaire", "ressources_naturelles_environnement": "Ressources naturelles", "transversal": "Transversal",
}
fiches = {}
for f in glob.glob(IDX + r"\donnees_antigravity\fiches\DOC-*.json"):
    d = json.load(open(f, encoding="utf-8")); fiches[d["id"]] = d
final = json.load(open(IDX + r"\decisions_finales.json", encoding="utf-8"))
index = {r["id"]: r for r in csv.DictReader(open(IDX + r"\INDEX.csv", encoding="utf-8-sig"), delimiter=";")}
# compteurs des anciens documents en ligne, repris pour ceux qu'on republie
anciens = {}
p = IDX + r"\sauvegarde_base_2026-11-12\documents_deja_en_ligne.csv"
for r in csv.DictReader(open(p, encoding="utf-8-sig"), delimiter=";"):
    if r["nouvel_id"]: anciens[r["nouvel_id"]] = int(r["telechargements"] or 0)

publies = [i for i in sorted(fiches) if final[i]["decision_publication"] in ("public", "membres")]
# Le site classe par date de création décroissante : les documents les plus utiles reçoivent les dates les plus récentes.
def priorite(i):
    d = fiches[i]; acces = final[i]["decision_publication"]
    return (acces == "public", d["pertinence_plateforme"], d["type_doc"] in ("fiche_technique", "guide_pratique"), -int(i[4:]))
ordre = sorted(publies, key=priorite)  # du moins prioritaire au plus prioritaire
debut = datetime.datetime(2026, 11, 12, 12, 0, 0, tzinfo=datetime.timezone.utc)
dates = {i: (debut + datetime.timedelta(seconds=n)).strftime("%Y-%m-%dT%H:%M:%S.000Z") for n, i in enumerate(ordre)}

def q(v):
    if v is None or v == "": return "NULL"
    if isinstance(v, (int, float)): return str(v)
    return "'" + str(v).replace("'", "''") + "'"

lignes, manifeste, problemes = [], [], []
for i in publies:
    d, r = fiches[i], index[i]
    acces = final[i]["decision_publication"]
    local = os.path.join(CLASSEE, r["dossier"], r["nouveau_nom"])
    if not os.path.isfile(local): problemes.append(f"fichier absent : {i}"); continue
    taille = os.path.getsize(local)
    if taille != d["taille_octets"]: problemes.append(f"taille différente : {i}")
    if not local.lower().endswith(".pdf"): problemes.append(f"pas un PDF : {i}")
    sha = hashlib.sha256(open(local, "rb").read()).hexdigest()
    if sha != d["sha256"]: problemes.append(f"empreinte différente : {i}")
    cle = d["cle_r2_proposee"]
    licence = r["licence"] or None
    vals = {
        "id": str(uuid.uuid5(uuid.NAMESPACE_URL, "agrolide-biblio/" + i)),
        "acces": acces, "annee": d.get("annee"), "auteurs": d["auteurs"], "created_at": dates[i], "depose_par": None,
        "fichier_r2_key": cle, "filiere": d.get("filiere"), "langue": d["langue"] if d["langue"] in ("fr", "en") else "autre",
        "nb_telechargements": anciens.get(i, 0), "pays": d.get("pays"), "published_at": dates[i], "resume": d["resume"],
        "statut": "publie", "taille_octets": taille, "thematique": DOMAINE_LABEL[d["domaine_principal"]], "titre": d["titre"],
        "type_doc": d["type_doc"], "valide_par": None,
        "domaine": d["domaine_principal"], "sous_domaine": d["sous_domaine"], "public_cible": d["public_principal"], "niveau": d["niveau"],
        "licence": licence, "source_organisation": d.get("source_organisation"),
        "mots_cles": json.dumps(d["mots_cles"], ensure_ascii=False), "reference": i,
    }
    cols = ", ".join(vals); data = ", ".join(q(v) for v in vals.values())
    lignes.append(f"INSERT OR IGNORE INTO documents ({cols}) VALUES ({data});")
    manifeste.append({"id": i, "local": local, "cle": cle, "taille": taille, "sha256": sha, "acces": acces})

if problemes:
    print("ERREURS, rien n'est écrit :"); [print(" -", x) for x in problemes]; raise SystemExit(1)
cles = [m["cle"] for m in manifeste]
assert len(set(cles)) == len(cles), "clés R2 en double"
open(OUT + r"\documents.sql", "w", encoding="utf-8", newline="\n").write("\n".join(lignes) + "\n")
json.dump(manifeste, open(OUT + r"\manifeste_upload.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(lignes)} documents ({sum(m['acces']=='public' for m in manifeste)} publics, {sum(m['acces']=='membres' for m in manifeste)} membres)")
print(f"{sum(m['taille'] for m in manifeste)/1048576:.0f} Mo à envoyer | fichiers écrits dans {OUT}")
