"""
Generate human-readable supplementary reports and non-destructive renamed PDF copies:
1. pipeline/output/rapport/doublons_et_ensembles.md
2. pipeline/output/rapport/propositions_taxonomie.md
3. pipeline/output/renommes/<decision>/<domaine>/<sous_domaine>/<nom_fichier_final>
"""
import json
import shutil
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

WS_ROOT = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline")
ONEDRIVE_ROOT = Path(r"C:\Users\PC\OneDrive\Documents\Professionnel\Carrière\Business\agrolide.org\Opérations\Formation\Bibliothèque-Agrolide")
WS_BIB = WS_ROOT / "Bibliothèque"
EXTRACTED_ARCHIVES_DIR = WS_ROOT / "pipeline" / "input" / "archives_extraites"

FICHES_DIR = WS_ROOT / "pipeline" / "output" / "fiches"
RAPPORT_DIR = WS_ROOT / "pipeline" / "output" / "rapport"
RENOMMES_DIR = WS_ROOT / "pipeline" / "output" / "renommes"
TAXONOMIE_JSON = WS_ROOT / "pipeline" / "config" / "taxonomie.json"


def resolve_source_path(chemin_relatif_source: str) -> Path | None:
    prefixes = {
        "OD_Docs/": ONEDRIVE_ROOT / "Docs",
        "OD_Agrobusiness/": ONEDRIVE_ROOT / "Agrobusiness",
        "OD_ArchivesExtraites/": EXTRACTED_ARCHIVES_DIR,
        "WS_Bib/": WS_BIB,
        "OD_traites/": ONEDRIVE_ROOT / "traites",
        "OD_doublons/": ONEDRIVE_ROOT / "doublons",
    }
    for prefix, base in prefixes.items():
        if chemin_relatif_source.startswith(prefix):
            rel = chemin_relatif_source[len(prefix):]
            for norm in ("NFC", "NFD"):
                cand = base / unicodedata.normalize(norm, rel)
                if cand.exists():
                    return cand
    for norm in ("NFC", "NFD"):
        cand = ONEDRIVE_ROOT / unicodedata.normalize(norm, chemin_relatif_source)
        if cand.exists():
            return cand
    return None


def main():
    fiches_list = [json.loads(p.read_text(encoding="utf-8")) for p in sorted(FICHES_DIR.glob("DOC-*.json"))]
    fiches = {f["id"]: f for f in fiches_list}
    taxo = json.loads(TAXONOMIE_JSON.read_text(encoding="utf-8"))

    # 1. Generate doublons_et_ensembles.md
    dedup_groups = json.loads((RAPPORT_DIR / "dedup_groups.json").read_text(encoding="utf-8"))
    ensembles = json.loads((RAPPORT_DIR / "ensembles.json").read_text(encoding="utf-8"))

    lines = [
        "# Doublons et Ensembles Multi-Parties — Bibliothèque Agrolide\n",
        f"- **Groupes de doublons détectés** : {len(dedup_groups)}",
        f"- **Ensembles multi-parties détectés** : {len(ensembles)}\n",
        "## 1. Groupes de doublons (`GRP-XXXX`)\n",
        "| Groupe | Canonique retenu | Décision canonique | Membres (rôle & nom original) |",
        "|---|---|---|---|",
    ]
    for grp in dedup_groups:
        cid = grp["canonique_id"]
        cf = fiches.get(cid, {})
        cdec = cf.get("decision_publication", "?")
        members_str = "; ".join(
            f"`{m['id']}` ({m['role']}: {m['nom_original']})" for m in grp["membres"]
        )
        lines.append(f"| `{grp['groupe_id']}` | `{cid}` ({cf.get('nom_original', '?')}) | `{cdec}` | {members_str} |")

    lines.append("\n## 2. Ensembles multi-parties (`ENS-XXXX`)\n")
    lines.append("| Ensemble | Clé / Dossier | Nb parties | Documents inclus |")
    lines.append("|---|---|---:|---|")
    for ens in ensembles:
        m_str = ", ".join(
            f"`{mid}` ({fiches[mid]['nom_original']})" if mid in fiches else f"`{mid}`"
            for mid in ens["membres"]
        )
        lines.append(f"| `{ens['ensemble_id']}` | `{ens['key']}` | {len(ens['membres'])} | {m_str} |")

    (RAPPORT_DIR / "doublons_et_ensembles.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    # 2. Generate propositions_taxonomie.md
    dom_sub_counts = Counter((f["domaine_principal"], f["sous_domaine"]) for f in fiches_list)
    autre_types = [f for f in fiches_list if f["type_doc"] == "autre"]
    autre_dom = defaultdict(list)
    for f in autre_types:
        autre_dom[f["domaine_principal"]].append(f)

    tlines = [
        "# Propositions d'Évolution de la Taxonomie (`v1-depart` -> `v2`)\n",
        f"Analyse basée sur les **{len(fiches_list)}** fiches finalisées.\n",
        "## 1. Couverture des sous-domaines par domaine\n",
        "| Domaine | Sous-domaine | Nb docs | Public/Membres |",
        "|---|---|---:|---:|",
    ]
    pub_sub_counts = Counter(
        (f["domaine_principal"], f["sous_domaine"])
        for f in fiches_list
        if f["decision_publication"] in ("public", "membres")
    )
    for dom_obj in taxo["domaines"]:
        dom = dom_obj["code"]
        for sub_obj in dom_obj.get("sous_domaines", []):
            sub = sub_obj["code"]
            tot = dom_sub_counts[(dom, sub)]
            pubc = pub_sub_counts[(dom, sub)]
            tlines.append(f"| `{dom}` | `{sub}` | {tot} | {pubc} |")

    # Unused subdomains
    unused = [
        (dom_obj["code"], sub_obj["code"])
        for dom_obj in taxo["domaines"]
        for sub_obj in dom_obj.get("sous_domaines", [])
        if dom_sub_counts[(dom_obj["code"], sub_obj["code"])] == 0
    ]
    tlines.append("\n## 2. Observations et recommandations pour `taxonomie.json` v2\n")
    tlines.append(f"- **Sous-domaines à 0 document dans ce corpus** ({len(unused)}) : " +
                  (", ".join(f"`{d}/{s}`" for d, s in unused) if unused else "aucun"))
    tlines.append(f"- **Documents classés en `type_doc = autre`** : {len(autre_types)} (dont " +
                  ", ".join(f"`{d}`: {len(lst)}" for d, lst in sorted(autre_dom.items(), key=lambda x: -len(x[1]))) + ").")
    tlines.append("\n### Pistes d'affinage suggérées pour la v2 :")
    tlines.append("1. **Distinction `travaux_diriges_examen` vs `cours` / `autre`** : une part importante des cours académiques contient en réalité des sujets d'examen, TD/TP corrigés et formulaires étudiants (`type_doc = autre` ou `cours`).")
    tlines.append("2. **Sous-domaine `machinisme_equipement` / `genie_rural` en `production_vegetale` ou `transversal`** : plusieurs guides techniques couvrent les couveuses artisanales, pompes solaires, matériel de transformation et bâtiments.")
    tlines.append("3. **Règles de conversion automatique (`conversion_requise`)** : 105 fichiers exploitables sont au format Office (`.docx`, `.pptx`, `.ppt`, `.doc`, `.xlsx`, `.odt`). Une conversion PDF par LibreOffice permettrait de débloquer ceux qui ont déjà des droits ouverts.")
    tlines.append("4. **Campagne OCR ciblée** : sur les 149 documents en `a_valider_humain`, une majorité sont des fiches techniques ou cours scannés sans couche texte (`ocr_necessaire`) qui peuvent être réévalués après OCR.\n")

    (RAPPORT_DIR / "propositions_taxonomie.md").write_text("\n".join(tlines) + "\n", encoding="utf-8")

    # 3. Copy the 321 publishable PDFs non-destructively into pipeline/output/renommes/
    if RENOMMES_DIR.exists():
        shutil.rmtree(RENOMMES_DIR)
    RENOMMES_DIR.mkdir(parents=True, exist_ok=True)

    pub = [f for f in fiches_list if f["decision_publication"] in ("public", "membres")]
    copied = 0
    missing = []
    for f in pub:
        src = resolve_source_path(f["chemin_relatif_source"])
        if src is None:
            missing.append((f["id"], f["chemin_relatif_source"]))
            continue
        dst = RENOMMES_DIR / f["decision_publication"] / f["domaine_principal"] / f["nom_fichier_final"]
        dst.parent.mkdir(parents=True, exist_ok=True)
        src_p = r"\\?\\" + str(src.resolve()) if len(str(src)) > 240 else str(src)
        dst_p = r"\\?\\" + str(dst.resolve()) if len(str(dst)) > 240 else str(dst)
        shutil.copy2(src_p, dst_p)
        copied += 1

    print(f"Generated doublons_et_ensembles.md & propositions_taxonomie.md")
    print(f"Copied publishable PDFs to renommes/: {copied}/{len(pub)} (missing: {len(missing)})")
    if missing:
        print("Missing examples:", missing[:5])

    # Print sizes for .gitignore check
    p = WS_ROOT / "pipeline"
    for sub in sorted(p.iterdir()):
        if sub.is_dir():
            files = [f for f in sub.rglob("*") if f.is_file()]
            sz = sum(f.stat().st_size for f in files)
            print(f"pipeline/{sub.name}: {sz / (1024*1024):.2f} MB ({len(files)} files)")
            if sub.name == "output":
                for s2 in sorted(sub.iterdir()):
                    if s2.is_dir():
                        f2 = [f for f in s2.rglob("*") if f.is_file()]
                        sz2 = sum(f.stat().st_size for f in f2)
                        print(f"  pipeline/output/{s2.name}: {sz2 / (1024*1024):.2f} MB ({len(f2)} files)")


if __name__ == "__main__":
    main()
