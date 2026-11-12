"""
Phase 4: Intelligent Deduplication & Ensemble Grouping
Detects:
1. Exact SHA-256 duplicates (already tagged in Phase 1, grouped into GRP-XXXX)
2. Near-identical content duplicates via text_sig (normalized text hash)
3. Title/filename similarity + page/size heuristics (copie_quasi_identique, version_anterieure, fragment, extrait)
4. Multi-part series / ensembles (ENS-XXXX) such as Partie 1/2, Tome 1/2, Chapitre X, Résumé 1..6
Elects the best canonical document per group and assigns GRP-XXXX / canonique_id.
"""
import re
import json
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

WS_ROOT = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline")
PIPELINE_DIR = WS_ROOT / "pipeline"
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
META_DIR = PIPELINE_DIR / "output" / "meta_extract"
RAPPORT_DIR = PIPELINE_DIR / "output" / "rapport"


def norm_title(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode("ascii").lower()
    s = re.sub(r"\.(pdf|docx|doc|pptx|ppt|odt|xlsx)$", "", s)
    s = re.sub(r"\(\d+\)|\[.*?\]|compress|converti|copie|version\s*\d+|v\d+", " ", s)
    s = re.sub(r"[^a-z0-9]+", " ", s).strip()
    return s


def quality_score(fiche: dict, meta: dict) -> tuple:
    """Higher tuple = better canonical candidate."""
    is_pdf = 1 if fiche.get("format_source") == "pdf" else 0
    is_complete = 1 if fiche.get("complet") is True else 0
    no_ocr = 0 if "ocr_necessaire" in fiche.get("drapeaux", []) else 1
    chars = meta.get("chars", 0)
    pages = fiche.get("nb_pages") or 0
    annee = fiche.get("annee") or 0
    # Prefer PDF, complete, readable text, more pages, more recent year, shorter/cleaner id tiebreak
    return (is_pdf, is_complete, no_ocr, pages, chars, annee, -int(fiche["id"].split("-")[1]))


def main():
    fiches = {}
    metas = {}
    for fp in sorted(FICHES_DIR.glob("DOC-*.json")):
        d = json.loads(fp.read_text(encoding="utf-8"))
        fiches[d["id"]] = d
        mp = META_DIR / f"{d['id']}.json"
        metas[d["id"]] = json.loads(mp.read_text(encoding="utf-8")) if mp.exists() else {}

    # Reset any previous dedup grouping before recomputing cleanly
    groups = []  # list of sets of doc_ids
    doc_to_group = {}

    def link_docs(id_a: str, id_b: str):
        ga = doc_to_group.get(id_a)
        gb = doc_to_group.get(id_b)
        if ga is not None and gb is not None:
            if ga != gb:
                groups[ga].update(groups[gb])
                for x in list(groups[gb]):
                    doc_to_group[x] = ga
                groups[gb].clear()
        elif ga is not None:
            groups[ga].add(id_b)
            doc_to_group[id_b] = ga
        elif gb is not None:
            groups[gb].add(id_a)
            doc_to_group[id_a] = gb
        else:
            idx = len(groups)
            groups.append({id_a, id_b})
            doc_to_group[id_a] = idx
            doc_to_group[id_b] = idx

    # 1. Exact SHA-256 duplicates
    by_sha = {}
    for doc_id, f in fiches.items():
        by_sha.setdefault(f["sha256"], []).append(doc_id)
    for sha, ids in by_sha.items():
        if len(ids) > 1:
            base = ids[0]
            for other in ids[1:]:
                link_docs(base, other)

    # 2. Exact normalized text_sig duplicates (different file, identical extracted text)
    by_tsig = {}
    for doc_id, m in metas.items():
        ts = m.get("text_sig")
        if ts:
            by_tsig.setdefault(ts, []).append(doc_id)
    for ts, ids in by_tsig.items():
        if len(ids) > 1:
            base = ids[0]
            for other in ids[1:]:
                link_docs(base, other)

    # 3. Normalized title exact/near matches (when non-empty & >= 12 chars, excluding generic part names)
    by_ntitle = {}
    for doc_id, f in fiches.items():
        # Skip exact sha duplicates already linked
        if f.get("role_doublon") == "copie_exacte":
            continue
        t = norm_title(f.get("titre_trouve") or f.get("titre") or f["nom_original"])
        if len(t) >= 12:
            by_ntitle.setdefault(t, []).append(doc_id)

    for t, ids in by_ntitle.items():
        if len(ids) > 1:
            # Verify they are genuinely same topic/pages or one is non-PDF version of PDF
            base = ids[0]
            for other in ids[1:]:
                f1, f2 = fiches[base], fiches[other]
                p1, p2 = f1.get("nb_pages") or 0, f2.get("nb_pages") or 0
                same_domain = f1.get("domaine_principal") == f2.get("domaine_principal")
                if same_domain and (p1 == 0 or p2 == 0 or abs(p1 - p2) <= max(3, int(0.15 * max(p1, p2)))):
                    link_docs(base, other)

    # Assign GRP-XXXX and roles
    grp_counter = 0
    dedup_report = []

    non_empty_groups = [sorted(g) for g in groups if len(g) > 1]
    for members in non_empty_groups:
        grp_counter += 1
        grp_id = f"GRP-{grp_counter:04d}"

        # Pick canonical among non-exact-dup or all members
        # Note: if canonical has exact sha copies, pick earliest DOC-ID among the highest quality
        best_id = max(members, key=lambda did: quality_score(fiches[did], metas.get(did, {})))
        best_sha = fiches[best_id]["sha256"]
        best_tsig = metas.get(best_id, {}).get("text_sig")
        best_pages = fiches[best_id].get("nb_pages") or 0

        grp_entry = {"groupe_id": grp_id, "canonique_id": best_id, "membres": []}

        for did in members:
            f = fiches[did]
            f["groupe_doublon_id"] = grp_id
            if did == best_id:
                f["role_doublon"] = "canonique"
                f["canonique_id"] = None
            else:
                f["canonique_id"] = best_id
                if f["sha256"] == best_sha:
                    f["role_doublon"] = "copie_exacte"
                elif best_tsig and metas.get(did, {}).get("text_sig") == best_tsig:
                    f["role_doublon"] = "copie_quasi_identique"
                elif "extrait" in f["nom_original"].lower():
                    f["role_doublon"] = "extrait"
                elif best_pages and (f.get("nb_pages") or 0) < best_pages * 0.6:
                    f["role_doublon"] = "fragment"
                elif (f.get("annee") or 9999) < (fiches[best_id].get("annee") or 0):
                    f["role_doublon"] = "version_anterieure"
                else:
                    f["role_doublon"] = "copie_quasi_identique"

                f["decision_publication"] = "exclu_doublon"
                f["motif_decision"] = f"Doublon ({f['role_doublon']}) du document canonique {best_id}."

            grp_entry["membres"].append({
                "id": did,
                "role": f["role_doublon"],
                "nom_original": f["nom_original"],
                "format": f["format_source"],
                "nb_pages": f.get("nb_pages"),
            })
        dedup_report.append(grp_entry)

    # 4. Detect multi-part ensembles (ENS-XXXX) for series like Partie 1/2, Tome 1/2, Résumé 1..N, Chapitre N
    series_buckets = {}
    part_regex = re.compile(r"\b(partie|tome|vol|volume|chapitre|chap|resume|r[eé]sum[eé]|part)\s*[-_:]?\s*\d+\b", re.IGNORECASE)
    for did, f in fiches.items():
        if f.get("decision_publication") == "exclu_doublon":
            continue
        name = f["nom_original"]
        if part_regex.search(name):
            stem = part_regex.sub("", norm_title(name)).strip()
            parent = str(Path(f["chemin_relatif_source"]).parent)
            key = f"{parent}::{stem}" if len(stem) >= 4 else f"{parent}::series"
            series_buckets.setdefault(key, []).append(did)

    ens_counter = 0
    ens_report = []
    for key, ids in sorted(series_buckets.items()):
        if len(ids) > 1:
            ens_counter += 1
            ens_id = f"ENS-{ens_counter:04d}"
            for did in ids:
                fiches[did]["ensemble_id"] = ens_id
                if "ensemble_partiel" not in fiches[did].get("drapeaux", []):
                    fiches[did].setdefault("drapeaux", []).append("ensemble_partiel")
            ens_report.append({"ensemble_id": ens_id, "key": key, "membres": ids})

    # Save all updated fiches
    for did, f in fiches.items():
        if f.get("statut_traitement") in ("classifie", "audite"):
            f["statut_traitement"] = "dedoublonne"
        (FICHES_DIR / f"{did}.json").write_text(json.dumps(f, ensure_ascii=False, indent=2), encoding="utf-8")

    (RAPPORT_DIR / "dedup_groups.json").write_text(json.dumps(dedup_report, ensure_ascii=False, indent=2), encoding="utf-8")
    (RAPPORT_DIR / "ensembles.json").write_text(json.dumps(ens_report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Deduplication complete: {grp_counter} duplicate groups, {ens_counter} multi-part ensembles")


if __name__ == "__main__":
    main()
