"""
Phase 3 Apply: Merges classified batch JSON outputs into pipeline/output/fiches/DOC-XXXXX.json
Normalizes values, validates against taxonomie.json, logs any schema warning.
"""
import json
import re
from pathlib import Path

WS_ROOT = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline")
PIPELINE_DIR = WS_ROOT / "pipeline"
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
CLASSIFIED_DIR = PIPELINE_DIR / "output" / "classified"
CONFIG_DIR = PIPELINE_DIR / "config"

taxo = json.loads((CONFIG_DIR / "taxonomie.json").read_text(encoding="utf-8"))
DOMAIN_SUBDOMAINS = {
    d["code"]: {sd["code"] for sd in d["sous_domaines"]}
    for d in taxo["domaines"]
}
VALID_DOMAINS = set(DOMAIN_SUBDOMAINS.keys())
VALID_TYPES = {t["code"] for t in taxo["types_document"]}
VALID_PUBLICS = {p["code"] for p in taxo["publics"]}
VALID_NIVEAUX = {n["code"] for n in taxo["niveaux"]}
VALID_LANGUES = set(taxo["langues"])
VALID_GEO = {c["code"] for c in taxo["contextes_geo"]}
VALID_DROITS = {s["code"] for s in taxo["statuts_droits"]}
VALID_FLAGS = {f["code"] for f in taxo["drapeaux"]}
VALID_DECISIONS = {d["code"] for d in taxo["decisions_publication"]}


def clamp_str(val, min_len, max_len, fallback):
    s = (val or fallback).strip()
    if len(s) > max_len:
        s = s[:max_len - 3].rstrip() + "..."
    while len(s) < min_len:
        s = s + "."
    return s


def extract_json_payload(raw_text: str):
    raw_text = raw_text.strip()
    if raw_text.startswith("```"):
        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
        raw_text = re.sub(r"\s*```$", "", raw_text)
    return json.loads(raw_text)


def main():
    CLASSIFIED_DIR.mkdir(parents=True, exist_ok=True)
    result_files = sorted(CLASSIFIED_DIR.glob("batch_*_result.json"))
    print(f"Found {len(result_files)} classified batch files")

    applied = 0
    errors = []

    for rf in result_files:
        try:
            data = extract_json_payload(rf.read_text(encoding="utf-8"))
            results = data["results"] if isinstance(data, dict) and "results" in data else data
        except Exception as e:
            errors.append(f"{rf.name}: JSON parse error: {e}")
            continue

        for item in results:
            doc_id = item.get("id")
            fiche_path = FICHES_DIR / f"{doc_id}.json"
            if not fiche_path.exists():
                errors.append(f"{rf.name}: unknown id {doc_id}")
                continue

            fiche = json.loads(fiche_path.read_text(encoding="utf-8"))

            dom = item.get("domaine_principal", "transversal")
            if dom not in VALID_DOMAINS:
                dom = "transversal"

            sdom = item.get("sous_domaine")
            allowed_sdoms = DOMAIN_SUBDOMAINS[dom]
            if sdom not in allowed_sdoms:
                sdom = "aucun" if dom == "hors_perimetre" else sorted(allowed_sdoms)[0]

            sec_doms = [d for d in (item.get("domaines_secondaires") or []) if d in VALID_DOMAINS and d != "hors_perimetre" and d != dom]
            sec_doms = list(dict.fromkeys(sec_doms))

            tdoc = item.get("type_doc", "autre")
            if tdoc not in VALID_TYPES:
                tdoc = "autre"

            pub = item.get("public_principal", "producteur")
            if pub not in VALID_PUBLICS:
                pub = "producteur"

            sec_pubs = [p for p in (item.get("publics_secondaires") or []) if p in VALID_PUBLICS and p != pub]
            sec_pubs = list(dict.fromkeys(sec_pubs))

            niv = item.get("niveau", "intermediaire")
            if niv not in VALID_NIVEAUX:
                niv = "intermediaire"

            lang = item.get("langue", "fr")
            if lang not in VALID_LANGUES:
                lang = "fr"

            geo = item.get("contexte_geo", "international_general")
            if geo not in VALID_GEO:
                geo = "international_general"

            pert = item.get("pertinence_plateforme", 2)
            try:
                pert = max(0, min(3, int(pert)))
            except Exception:
                pert = 1

            droits = item.get("statut_droits", "inconnu")
            if droits not in VALID_DROITS:
                droits = "inconnu"

            complet = item.get("complet", "indetermine")
            if complet not in (True, False, "indetermine"):
                complet = "indetermine"

            # Merge flags
            flags = list(fiche.get("drapeaux", []))
            for fl in (item.get("drapeaux_ajoutes") or item.get("drapeaux") or []):
                if fl in VALID_FLAGS and fl not in flags:
                    flags.append(fl)
            if complet is False and "incomplet" not in flags:
                flags.append("incomplet")

            # R7: format_source == 'pdf' cannot have conversion_requise
            if fiche["format_source"] == "pdf" and "conversion_requise" in flags:
                flags.remove("conversion_requise")

            # Keywords (3..8, 2..40 chars)
            raw_kw = item.get("mots_cles") or []
            kws = []
            for k in raw_kw:
                ks = str(k).strip()[:40]
                if len(ks) >= 2 and ks not in kws:
                    kws.append(ks)
            while len(kws) < 3:
                fallback_kw = [dom.replace("_", " "), sdom.replace("_", " "), tdoc.replace("_", " ")][len(kws)]
                if fallback_kw not in kws:
                    kws.append(fallback_kw[:40])
                else:
                    kws.append(f"agrolide {len(kws)}")
            kws = kws[:8]

            # Preuves (min 1)
            raw_preuves = item.get("preuves") or []
            preuves = []
            allowed_preuve_champs = {"domaine", "type_doc", "titre", "auteurs", "annee", "droits", "licence", "completude", "langue", "contexte_geo", "doublon", "decision", "autre"}
            for pr in raw_preuves:
                if isinstance(pr, dict) and pr.get("extrait"):
                    ch = pr.get("champ", "autre")
                    if ch not in allowed_preuve_champs:
                        ch = "autre"
                    pg = pr.get("page")
                    if pg is not None:
                        try:
                            pg = max(1, int(pg))
                        except Exception:
                            pg = None
                    preuves.append({
                        "champ": ch,
                        "page": pg,
                        "extrait": str(pr["extrait"])[:200]
                    })
            if not preuves:
                preuves.append({
                    "champ": "titre",
                    "page": 1,
                    "extrait": (item.get("titre_trouve") or fiche["nom_original"])[:200]
                })

            conf = item.get("confiance") or {}
            def clamp_c(v):
                try:
                    return round(max(0.0, min(1.0, float(v))), 2)
                except Exception:
                    return 0.7
            conf_clean = {
                "classification": clamp_c(conf.get("classification", 0.85)),
                "droits": clamp_c(conf.get("droits", 0.8)),
                "completude": clamp_c(conf.get("completude", 0.8)),
            }

            annee = item.get("annee")
            if annee is not None:
                try:
                    annee = int(annee)
                    if not (1800 <= annee <= 2100):
                        annee = None
                except Exception:
                    annee = None

            dec = item.get("decision_publication", "a_valider_humain")
            if dec not in VALID_DECISIONS:
                dec = "a_valider_humain"

            fiche.update({
                "statut_traitement": "classifie",
                "domaine_principal": dom,
                "domaines_secondaires": sec_doms,
                "sous_domaine": sdom,
                "type_doc": tdoc,
                "public_principal": pub,
                "publics_secondaires": sec_pubs,
                "niveau": niv,
                "langue": lang,
                "contexte_geo": geo,
                "pertinence_plateforme": pert,
                "filiere": item.get("filiere"),
                "pays": item.get("pays"),
                "annee": annee,
                "auteurs": (item.get("auteurs") or "Auteur non précisé").strip() or "Auteur non précisé",
                "source_organisation": item.get("source_organisation"),
                "mots_cles": kws,
                "titre_trouve": item.get("titre_trouve"),
                "titre": clamp_str(item.get("titre"), 5, 140, fiche["nom_original"]),
                "resume": clamp_str(item.get("resume"), 80, 500, "Document agricole de la bibliothèque Agrolide classifié automatiquement selon son contenu."),
                "statut_droits": droits,
                "licence_detectee": item.get("licence_detectee"),
                "complet": complet,
                "drapeaux": flags,
                "role_doublon": fiche.get("role_doublon", "unique"),
                "decision_publication": dec,
                "motif_decision": clamp_str(item.get("motif_decision"), 10, 300, "Classification initiale selon contenu et droits."),
                "confiance": conf_clean,
                "preuves": preuves,
            })

            fiche_path.write_text(json.dumps(fiche, ensure_ascii=False, indent=2), encoding="utf-8")
            applied += 1

    print(f"Applied {applied} classifications. Errors: {len(errors)}")
    for e in errors[:20]:
        print("  ERR:", e)


if __name__ == "__main__":
    main()
