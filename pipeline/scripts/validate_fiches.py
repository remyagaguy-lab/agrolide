"""
Strict validator for Agrolide document fiches against:
- pipeline/config/taxonomie.json
- pipeline/config/fiche_document.schema.json (including allOf rules R1..R7)
"""
import json
import re
from pathlib import Path
from typing import Any

PIPELINE_DIR = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline\pipeline")
TAXO_PATH = PIPELINE_DIR / "config" / "taxonomie.json"
SCHEMA_PATH = PIPELINE_DIR / "config" / "fiche_document.schema.json"


def load_rules():
    taxo = json.loads(TAXO_PATH.read_text(encoding="utf-8"))
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    domain_subdomains = {
        d["code"]: {sd["code"] for sd in d["sous_domaines"]}
        for d in taxo["domaines"]
    }
    enums = {
        "domaines": {d["code"] for d in taxo["domaines"]},
        "types_document": {t["code"] for t in taxo["types_document"]},
        "publics": {p["code"] for p in taxo["publics"]},
        "niveaux": {n["code"] for n in taxo["niveaux"]},
        "langues": set(taxo["langues"]),
        "contextes_geo": {c["code"] for c in taxo["contextes_geo"]},
        "statuts_droits": {s["code"] for s in taxo["statuts_droits"]},
        "decisions_publication": {d["code"] for d in taxo["decisions_publication"]},
        "drapeaux": {f["code"] for f in taxo["drapeaux"]},
        "roles_doublon": {r["code"] for r in taxo["roles_doublon"]},
        "statuts_traitement": set(taxo["statuts_traitement"]),
    }
    return taxo, schema, domain_subdomains, enums


R2_FORBIDDEN_FLAGS = {
    "incomplet", "pages_manquantes", "ensemble_partiel", "scan_illisible",
    "protege", "corrompu", "droits_reserves", "licence_nc", "donnees_personnelles",
    "confidentiel_interne", "contenu_commercial", "conversion_requise",
    "taille_excessive", "donnees_phyto_a_verifier", "obsolete", "titre_introuvable"
}


def validate_fiche(fiche: dict[str, Any], schema: dict, domain_subdomains: dict, enums: dict) -> list[str]:
    errors: list[str] = []
    allowed_props = set(schema["properties"].keys())
    extra = set(fiche.keys()) - allowed_props
    if extra:
        errors.append(f"Champs interdits (additionalProperties): {sorted(extra)}")

    for req in schema["required"]:
        if req not in fiche or fiche[req] is None:
            errors.append(f"Champ obligatoire manquant: {req}")

    if "id" in fiche and not re.match(r"^DOC-[0-9]{5}$", str(fiche["id"])):
        errors.append(f"id invalide: {fiche['id']}")
    if "sha256" in fiche and not re.match(r"^[0-9a-f]{64}$", str(fiche["sha256"])):
        errors.append(f"sha256 invalide")

    statut = fiche.get("statut_traitement")
    if statut not in enums["statuts_traitement"]:
        errors.append(f"statut_traitement invalide: {statut}")

    if statut == "termine":
        req_done = [
            "domaine_principal", "sous_domaine", "type_doc", "public_principal",
            "niveau", "langue", "contexte_geo", "pertinence_plateforme",
            "auteurs", "titre", "resume", "statut_droits", "complet",
            "drapeaux", "role_doublon", "decision_publication",
            "motif_decision", "confiance", "preuves", "audit"
        ]
        for k in req_done:
            if k not in fiche or fiche[k] is None:
                errors.append(f"Champ requis pour statut='termine' manquant: {k}")

    # Enum checks when present
    dom = fiche.get("domaine_principal")
    sdom = fiche.get("sous_domaine")
    if dom is not None:
        if dom not in enums["domaines"]:
            errors.append(f"domaine_principal invalide: {dom}")
        elif sdom is not None and sdom not in domain_subdomains.get(dom, set()):
            errors.append(f"sous_domaine '{sdom}' incompatible avec domaine '{dom}'")

    if fiche.get("type_doc") is not None and fiche["type_doc"] not in enums["types_document"]:
        errors.append(f"type_doc invalide: {fiche['type_doc']}")
    if fiche.get("public_principal") is not None and fiche["public_principal"] not in enums["publics"]:
        errors.append(f"public_principal invalide: {fiche['public_principal']}")
    if fiche.get("niveau") is not None and fiche["niveau"] not in enums["niveaux"]:
        errors.append(f"niveau invalide: {fiche['niveau']}")
    if fiche.get("langue") is not None and fiche["langue"] not in enums["langues"]:
        errors.append(f"langue invalide: {fiche['langue']}")
    if fiche.get("contexte_geo") is not None and fiche["contexte_geo"] not in enums["contextes_geo"]:
        errors.append(f"contexte_geo invalide: {fiche['contexte_geo']}")
    if fiche.get("statut_droits") is not None and fiche["statut_droits"] not in enums["statuts_droits"]:
        errors.append(f"statut_droits invalide: {fiche['statut_droits']}")
    if fiche.get("role_doublon") is not None and fiche["role_doublon"] not in enums["roles_doublon"]:
        errors.append(f"role_doublon invalide: {fiche['role_doublon']}")

    dec = fiche.get("decision_publication")
    if dec is not None and dec not in enums["decisions_publication"]:
        errors.append(f"decision_publication invalide: {dec}")

    flags = fiche.get("drapeaux", [])
    if isinstance(flags, list):
        bad_flags = set(flags) - enums["drapeaux"]
        if bad_flags:
            errors.append(f"drapeaux invalides: {sorted(bad_flags)}")
        if len(flags) != len(set(flags)):
            errors.append("drapeaux contient des doublons")

    # String length checks
    if "titre" in fiche and fiche["titre"] is not None:
        if not (5 <= len(fiche["titre"]) <= 140):
            errors.append(f"titre hors limites (5..140): {len(fiche['titre'])}")
    if "resume" in fiche and fiche["resume"] is not None:
        if not (80 <= len(fiche["resume"]) <= 500):
            errors.append(f"resume hors limites (80..500): {len(fiche['resume'])}")
    if "motif_decision" in fiche and fiche["motif_decision"] is not None:
        if not (10 <= len(fiche["motif_decision"]) <= 300):
            errors.append(f"motif_decision hors limites (10..300): {len(fiche['motif_decision'])}")

    if "mots_cles" in fiche and fiche["mots_cles"] is not None:
        mc = fiche["mots_cles"]
        if not (3 <= len(mc) <= 8):
            errors.append(f"mots_cles hors limites (3..8): {len(mc)}")

    if "nom_fichier_final" in fiche and fiche["nom_fichier_final"] is not None:
        if not re.match(r"^DOC-[0-9]{5}__[a-z0-9]+(-[a-z0-9]+)*\.pdf$", fiche["nom_fichier_final"]):
            errors.append(f"nom_fichier_final format invalide: {fiche['nom_fichier_final']}")

    if "cle_r2_proposee" in fiche and fiche["cle_r2_proposee"] is not None:
        if not re.match(r"^bibliotheque/[a-z_]+/[a-z_]+/DOC-[0-9]{5}__[a-z0-9]+(-[a-z0-9]+)*\.pdf$", fiche["cle_r2_proposee"]):
            errors.append(f"cle_r2_proposee format invalide: {fiche['cle_r2_proposee']}")

    # R1 & R2
    if dec in ("public", "membres"):
        if fiche.get("statut_droits") not in ("libre_licence_ouverte", "diffusion_institutionnelle"):
            errors.append(f"R1: decision='{dec}' mais statut_droits='{fiche.get('statut_droits')}'")
        if fiche.get("type_doc") in ("memoire", "these"):
            errors.append(f"R2: memoire/these interdit en publication ('{dec}')")
        if fiche.get("complet") is not True:
            errors.append(f"R2: complet doit etre true pour '{dec}', obtenu {fiche.get('complet')}")
        if dom == "hors_perimetre":
            errors.append("R2: hors_perimetre interdit en publication")
        if fiche.get("role_doublon") not in ("unique", "canonique", "traduction"):
            errors.append(f"R2: role_doublon='{fiche.get('role_doublon')}' interdit en publication")
        if (fiche.get("pertinence_plateforme") or 0) < 2:
            errors.append(f"R2: pertinence_plateforme < 2 ({fiche.get('pertinence_plateforme')})")
        conf = fiche.get("confiance") or {}
        if conf.get("classification", 0) < 0.8 or conf.get("droits", 0) < 0.85 or conf.get("completude", 0) < 0.8:
            errors.append(f"R2: confiance insuffisante pour '{dec}': {conf}")
        if not (fiche.get("audit") or {}).get("accord", False):
            errors.append("R2: audit.accord doit etre true pour publier")
        forbidden_present = set(flags) & R2_FORBIDDEN_FLAGS
        if forbidden_present:
            errors.append(f"R2: drapeaux bloquants presents pour '{dec}': {sorted(forbidden_present)}")

    # R3
    if dec == "exclu_doublon":
        if fiche.get("role_doublon") not in ("copie_exacte", "copie_quasi_identique", "version_anterieure", "fragment", "extrait"):
            errors.append(f"R3: role_doublon incompatible avec exclu_doublon: {fiche.get('role_doublon')}")
        if not fiche.get("canonique_id") or not fiche.get("groupe_doublon_id"):
            errors.append("R3: canonique_id et groupe_doublon_id requis pour exclu_doublon")

    # R4
    if dom == "hors_perimetre":
        if sdom != "aucun":
            errors.append(f"R4: sous_domaine doit etre 'aucun' pour hors_perimetre (obtenu '{sdom}')")
        if dec is not None and dec not in ("exclu_hors_perimetre", "exclu_illisible", "a_valider_humain"):
            errors.append(f"R4: decision incompatible avec hors_perimetre: {dec}")

    # R5
    if fiche.get("type_doc") in ("memoire", "these") and dec in ("public", "membres"):
        errors.append("R5: memoire/these ne peut jamais etre public/membres")

    # R6
    audit = fiche.get("audit")
    if isinstance(audit, dict) and audit.get("accord") is False:
        if dec not in ("a_valider_humain", "non_publie_archive", "exclu_hors_perimetre", "exclu_doublon", "exclu_illisible"):
            errors.append(f"R6: audit.accord=false interdit decision '{dec}'")

    # R7
    if fiche.get("format_source") == "pdf" and "conversion_requise" in flags:
        errors.append("R7: conversion_requise interdit quand format_source == 'pdf'")

    return errors


def main():
    taxo, schema, domain_subdomains, enums = load_rules()
    fiches_dir = PIPELINE_DIR / "output" / "fiches"
    files = sorted(fiches_dir.glob("DOC-*.json"))
    invalid = 0
    for fp in files:
        fiche = json.loads(fp.read_text(encoding="utf-8"))
        errs = validate_fiche(fiche, schema, domain_subdomains, enums)
        if errs:
            invalid += 1
            if invalid <= 20:
                print(f"{fp.name}: {errs}")
    print(f"Validated {len(files)} fiches: {len(files) - invalid} valid, {invalid} invalid")


if __name__ == "__main__":
    main()
