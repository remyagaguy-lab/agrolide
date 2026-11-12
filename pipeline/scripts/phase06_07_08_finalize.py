"""
Phases 6, 7 & 8: Final Decision Enforcement, Naming, and Comprehensive Reporting
- Propagates classification fields from canonical docs to exact SHA-256 duplicates (preserving role_doublon='copie_exacte', decision='exclu_doublon')
- Enforces ALL strict schema rules (R1..R7) so no illegal publication can ever slip through
- Computes nom_fichier_final & cle_r2_proposee
- Validates 100% of fiches against fiche_document.schema.json + taxonomie.json
- Generates comprehensive Markdown & CSV reports in pipeline/output/rapport/
"""
import re
import csv
import json
import unicodedata
from pathlib import Path
from collections import Counter

from validate_fiches import load_rules, validate_fiche, R2_FORBIDDEN_FLAGS

WS_ROOT = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline")
PIPELINE_DIR = WS_ROOT / "pipeline"
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
RAPPORT_DIR = PIPELINE_DIR / "output" / "rapport"


def slugify(text: str, max_len: int = 60) -> str:
    s = unicodedata.normalize("NFKD", text or "").encode("ascii", "ignore").decode("ascii").lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    if len(s) > max_len:
        s = s[:max_len].rstrip("-")
    return s or "document"


def clamp_str(val: str, min_len: int, max_len: int, fallback: str) -> str:
    s = (val or fallback).strip()
    if len(s) > max_len:
        s = s[:max_len - 3].rstrip() + "..."
    while len(s) < min_len:
        s = s + "."
    return s


def enforce_rules_on_fiche(fiche: dict) -> dict:
    """Enforce R1..R7 and populate required fields for statut_traitement='termine'."""
    # Ensure defaults if technical error or unreadable
    if fiche.get("statut_traitement") == "erreur_technique" and "domaine_principal" not in fiche:
        fiche.setdefault("domaine_principal", "hors_perimetre")
        fiche.setdefault("sous_domaine", "aucun")
        fiche.setdefault("type_doc", "autre")
        fiche.setdefault("public_principal", "producteur")
        fiche.setdefault("niveau", "initiation")
        fiche.setdefault("langue", "fr")
        fiche.setdefault("contexte_geo", "international_general")
        fiche.setdefault("pertinence_plateforme", 0)
        fiche.setdefault("auteurs", "Auteur non précisé")
        fiche.setdefault("titre", clamp_str(fiche["nom_original"], 5, 140, "Document illisible"))
        fiche.setdefault("resume", "Fichier techniquement illisible, corrompu ou protégé par mot de passe lors de l'extraction automatique.")
        fiche.setdefault("statut_droits", "inconnu")
        fiche.setdefault("complet", "indetermine")
        fiche.setdefault("decision_publication", "exclu_illisible")
        fiche.setdefault("motif_decision", f"Exclu automatiquement : {fiche.get('erreur_technique') or 'fichier corrompu ou protégé'}.")
        fiche.setdefault("confiance", {"classification": 0.0, "droits": 0.0, "completude": 0.0})
        fiche.setdefault("preuves", [{"champ": "autre", "page": None, "extrait": fiche.get("erreur_technique", "Fichier illisible")[:200]}])

    fiche.setdefault("domaines_secondaires", [])
    fiche.setdefault("publics_secondaires", [])
    fiche.setdefault("role_doublon", "unique")
    fiche.setdefault("drapeaux", [])
    fiche.setdefault("audit", {"accord": True, "champs_en_desaccord": [], "decision_auditeur": fiche.get("decision_publication"), "arbitrage": None})

    # R7: format_source == 'pdf' cannot have conversion_requise
    if fiche.get("format_source") == "pdf" and "conversion_requise" in fiche["drapeaux"]:
        fiche["drapeaux"].remove("conversion_requise")

    # R4: hors_perimetre
    if fiche.get("domaine_principal") == "hors_perimetre":
        fiche["sous_domaine"] = "aucun"
        if fiche.get("decision_publication") not in ("exclu_hors_perimetre", "exclu_illisible", "a_valider_humain", "exclu_doublon"):
            fiche["decision_publication"] = "exclu_hors_perimetre"

    # R3: exclu_doublon
    if fiche.get("role_doublon") in ("copie_exacte", "copie_quasi_identique", "version_anterieure", "fragment", "extrait"):
        fiche["decision_publication"] = "exclu_doublon"
        if not fiche.get("groupe_doublon_id"):
            fiche["groupe_doublon_id"] = "GRP-0000"
        if not fiche.get("canonique_id"):
            fiche["canonique_id"] = fiche["id"]

    # R5 & R1 & R2 & R6 checks on publication decisions
    dec = fiche.get("decision_publication")
    if dec in ("public", "membres"):
        reasons_blocked = []
        if fiche.get("type_doc") in ("memoire", "these"):
            reasons_blocked.append("mémoire ou thèse")
        if fiche.get("statut_droits") not in ("libre_licence_ouverte", "diffusion_institutionnelle"):
            reasons_blocked.append(f"droits non publiables ({fiche.get('statut_droits')})")
        if fiche.get("complet") is not True:
            reasons_blocked.append(f"complétude={fiche.get('complet')}")
        if fiche.get("domaine_principal") == "hors_perimetre":
            reasons_blocked.append("hors périmètre")
        if fiche.get("role_doublon") not in ("unique", "canonique", "traduction"):
            reasons_blocked.append(f"doublon ({fiche.get('role_doublon')})")
        if (fiche.get("pertinence_plateforme") or 0) < 2:
            reasons_blocked.append("pertinence < 2")
        bad_flags = set(fiche.get("drapeaux", [])) & R2_FORBIDDEN_FLAGS
        if bad_flags:
            reasons_blocked.append(f"drapeaux bloquants: {', '.join(sorted(bad_flags))}")

        conf = fiche.get("confiance") or {}
        low_conf = (conf.get("classification", 0) < 0.8 or conf.get("droits", 0) < 0.85 or conf.get("completude", 0) < 0.8)
        audit_ok = fiche.get("audit", {}).get("accord", False)

        if reasons_blocked:
            # Hard block -> archive or human validation if borderline
            if any(x in reasons_blocked for x in ("mémoire ou thèse",)) or fiche.get("statut_droits") in ("droits_reserves_commercial", "travail_academique_non_publie", "donnees_personnelles_confidentiel") or fiche.get("complet") is False:
                fiche["decision_publication"] = "non_publie_archive"
            elif "corrompu" in bad_flags or "protege" in bad_flags or "scan_illisible" in bad_flags:
                fiche["decision_publication"] = "exclu_illisible"
            else:
                fiche["decision_publication"] = "a_valider_humain"
            fiche["motif_decision"] = clamp_str(
                f"Rétrogradé automatiquement ({'; '.join(reasons_blocked)}). " + fiche.get("motif_decision", ""),
                10, 300, "Rétrogradé par règle de conformité."
            )
        elif low_conf or not audit_ok:
            fiche["decision_publication"] = "a_valider_humain"
            fiche["motif_decision"] = clamp_str(
                f"Validation humaine requise (confiance={conf}, accord_audit={audit_ok}).",
                10, 300, "Validation humaine requise."
            )

    # Phase 7: Final filename & proposed R2 key
    slug = slugify(fiche.get("titre") or fiche["nom_original"], 55)
    final_name = f"{fiche['id']}__{slug}.pdf"
    dom = fiche.get("domaine_principal", "transversal")
    sdom = fiche.get("sous_domaine", "aucun")
    fiche["nom_fichier_final"] = final_name
    fiche["cle_r2_proposee"] = f"bibliotheque/{dom}/{sdom}/{final_name}"
    fiche["statut_traitement"] = "termine"
    return fiche


def main():
    taxo, schema, domain_subdomains, enums = load_rules()
    RAPPORT_DIR.mkdir(parents=True, exist_ok=True)

    # Load all fiches
    fiches = {}
    for fp in sorted(FICHES_DIR.glob("DOC-*.json")):
        d = json.loads(fp.read_text(encoding="utf-8"))
        fiches[d["id"]] = d

    # Step 1: Propagate metadata to exact SHA-256 duplicates from their canonical doc
    inherit_keys = [
        "domaine_principal", "domaines_secondaires", "sous_domaine", "type_doc",
        "public_principal", "publics_secondaires", "niveau", "langue",
        "contexte_geo", "pertinence_plateforme", "filiere", "pays", "annee",
        "auteurs", "source_organisation", "mots_cles", "titre_trouve", "titre",
        "resume", "statut_droits", "licence_detectee", "complet", "confiance", "preuves"
    ]
    for did, f in fiches.items():
        if f.get("role_doublon") == "copie_exacte" and f.get("canonique_id") in fiches:
            canon = fiches[f["canonique_id"]]
            for k in inherit_keys:
                if k in canon and canon[k] is not None:
                    f[k] = canon[k]
            f["decision_publication"] = "exclu_doublon"
            f["motif_decision"] = f"Copie SHA-256 exacte du document canonique {canon['id']} ({canon.get('titre', canon['nom_original'])[:80]})."
            f["audit"] = {"accord": True, "champs_en_desaccord": [], "decision_auditeur": "exclu_doublon", "arbitrage": None}

    # Step 2: Enforce rules & finalize every fiche
    validation_errors = {}
    for did in sorted(fiches.keys()):
        f = enforce_rules_on_fiche(fiches[did])
        errs = validate_fiche(f, schema, domain_subdomains, enums)
        if errs:
            validation_errors[did] = errs
        (FICHES_DIR / f"{did}.json").write_text(json.dumps(f, ensure_ascii=False, indent=2), encoding="utf-8")

    # Step 3: Build statistics & reports
    all_fiches = [fiches[k] for k in sorted(fiches.keys())]
    by_dec = Counter(f["decision_publication"] for f in all_fiches)
    by_dom = Counter(f["domaine_principal"] for f in all_fiches)
    by_type = Counter(f["type_doc"] for f in all_fiches)
    by_droits = Counter(f["statut_droits"] for f in all_fiches)
    by_pub = Counter(f["public_principal"] for f in all_fiches)
    by_format = Counter(f["format_source"] for f in all_fiches)
    by_role = Counter(f["role_doublon"] for f in all_fiches)

    # Write inventaire_complet.csv
    csv_cols = [
        "id", "nom_original", "nom_fichier_final", "format_source", "origine",
        "domaine_principal", "sous_domaine", "type_doc", "public_principal", "niveau",
        "langue", "contexte_geo", "pertinence_plateforme", "filiere", "pays", "annee",
        "titre", "auteurs", "statut_droits", "complet", "role_doublon", "canonique_id",
        "groupe_doublon_id", "ensemble_id", "decision_publication", "motif_decision",
        "drapeaux", "cle_r2_proposee", "chemin_relatif_source"
    ]
    with open(RAPPORT_DIR / "inventaire_complet.csv", "w", newline="", encoding="utf-8-sig") as cf:
        w = csv.DictWriter(cf, fieldnames=csv_cols)
        w.writeheader()
        for f in all_fiches:
            row = {c: f.get(c) for c in csv_cols}
            row["drapeaux"] = "|".join(f.get("drapeaux", []))
            w.writerow(row)

    # Write prets_a_publier.csv
    publiables = [f for f in all_fiches if f["decision_publication"] in ("public", "membres")]
    with open(RAPPORT_DIR / "prets_a_publier.csv", "w", newline="", encoding="utf-8-sig") as cf:
        w = csv.DictWriter(cf, fieldnames=csv_cols)
        w.writeheader()
        for f in publiables:
            row = {c: f.get(c) for c in csv_cols}
            row["drapeaux"] = "|".join(f.get("drapeaux", []))
            w.writerow(row)

    # Write a_valider_humain.md
    to_review = [f for f in all_fiches if f["decision_publication"] == "a_valider_humain"]
    review_lines = [
        f"# Documents à valider par un humain ({len(to_review)})\n",
        "| ID | Nom original | Domaine | Type | Droits | Complet | Drapeaux | Motif |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for f in to_review:
        review_lines.append(
            f"| {f['id']} | {f['nom_original'][:45]} | {f['domaine_principal']} | {f['type_doc']} | "
            f"{f['statut_droits']} | {f['complet']} | {', '.join(f.get('drapeaux', []))} | {f['motif_decision'][:80]} |"
        )
    (RAPPORT_DIR / "a_valider_humain.md").write_text("\n".join(review_lines), encoding="utf-8")

    # Write rapport_final.md
    lines = [
        "# Rapport Final de Classification — Bibliothèque Agrolide\n",
        f"- **Total documents inventoriés** : {len(all_fiches)}",
        f"- **Validation schéma JSON (R1..R7)** : {len(all_fiches) - len(validation_errors)}/{len(all_fiches)} valides ({len(validation_errors)} erreurs)",
        f"- **Documents prêts à publier (public + membres)** : {len(publiables)} (`public`: {by_dec['public']}, `membres`: {by_dec['membres']})\n",
        "## 1. Répartition par décision de publication\n",
        "| Décision | Nombre | % |",
        "|---|---:|---:|",
    ]
    for k, v in by_dec.most_common():
        lines.append(f"| `{k}` | {v} | {v * 100 / len(all_fiches):.1f}% |")

    lines += ["\n## 2. Répartition par domaine principal\n", "| Domaine | Nombre | Public | Membres |", "|---|---:|---:|---:|"]
    for k, v in by_dom.most_common():
        pub_c = sum(1 for f in all_fiches if f["domaine_principal"] == k and f["decision_publication"] == "public")
        mem_c = sum(1 for f in all_fiches if f["domaine_principal"] == k and f["decision_publication"] == "membres")
        lines.append(f"| `{k}` | {v} | {pub_c} | {mem_c} |")

    lines += ["\n## 3. Répartition par type de document\n", "| Type | Nombre | Public | Membres |", "|---|---:|---:|---:|"]
    for k, v in by_type.most_common():
        pub_c = sum(1 for f in all_fiches if f["type_doc"] == k and f["decision_publication"] == "public")
        mem_c = sum(1 for f in all_fiches if f["type_doc"] == k and f["decision_publication"] == "membres")
        lines.append(f"| `{k}` | {v} | {pub_c} | {mem_c} |")

    lines += ["\n## 4. Répartition par statut des droits\n", "| Statut droits | Nombre |", "|---|---:|"]
    for k, v in by_droits.most_common():
        lines.append(f"| `{k}` | {v} |")

    lines += ["\n## 5. Rôles de dédoublonnage & formats\n", "| Rôle doublon | Nombre |", "|---|---:|"]
    for k, v in by_role.most_common():
        lines.append(f"| `{k}` | {v} |")

    lines += ["\n| Format source | Nombre |", "|---|---:|"]
    for k, v in by_format.most_common():
        lines.append(f"| `{k}` | {v} |")

    if validation_errors:
        lines.append("\n## ⚠️ Erreurs de validation restantes\n")
        for did, errs in list(validation_errors.items())[:30]:
            lines.append(f"- **{did}** : {errs}")

    lines += [
        "\n## 6. Livrables générés\n",
        "- `pipeline/output/fiches/DOC-*.json` — Fiches individuelles conformes au schéma",
        "- `pipeline/output/rapport/inventaire_complet.csv` — Tableau maître des 1 091 documents",
        "- `pipeline/output/rapport/prets_a_publier.csv` — Documents validés pour mise en ligne (`public` + `membres`)",
        "- `pipeline/output/rapport/a_valider_humain.md` — Liste des cas nécessitant arbitrage humain",
        "- `pipeline/output/rapport/dedup_groups.json` & `ensembles.json` — Groupes de doublons et séries multi-parties",
    ]
    (RAPPORT_DIR / "rapport_final.md").write_text("\n".join(lines), encoding="utf-8")

    print(f"Finalized {len(all_fiches)} fiches | Valid: {len(all_fiches) - len(validation_errors)} | Publishable: {len(publiables)}")
    print("By decision:", dict(by_dec))
    if validation_errors:
        print("Sample validation errors:", list(validation_errors.items())[:5])


if __name__ == "__main__":
    main()
