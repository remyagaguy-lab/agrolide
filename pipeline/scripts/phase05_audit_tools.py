"""
Phase 5 Tools: Prepare & Apply Independent QA Audit Batches
Usage:
  python phase05_audit_tools.py --prepare
  python phase05_audit_tools.py --apply
"""
import sys
import json
import re
from pathlib import Path

WS_ROOT = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline")
PIPELINE_DIR = WS_ROOT / "pipeline"
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
TEXT_DIR = PIPELINE_DIR / "output" / "textes"
AUDIT_IN_DIR = PIPELINE_DIR / "output" / "audit_batches"
AUDIT_OUT_DIR = PIPELINE_DIR / "output" / "audit_results"
BATCH_SIZE = 20
MAX_AUDIT_BYTES = 34000


def prepare():
    AUDIT_IN_DIR.mkdir(parents=True, exist_ok=True)
    AUDIT_OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in AUDIT_IN_DIR.glob("audit_batch_*.json"):
        old.unlink()

    items = []
    for fp in sorted(FICHES_DIR.glob("DOC-*.json")):
        f = json.loads(fp.read_text(encoding="utf-8"))
        if f.get("decision_publication") == "exclu_doublon":
            continue
        if f.get("statut_traitement") == "erreur_technique":
            continue
        if f.get("statut_traitement") not in ("classifie", "dedoublonne", "audite"):
            continue
        tp = TEXT_DIR / f"{f['id']}.txt"
        txt = tp.read_text(encoding="utf-8") if tp.exists() else ""
        short_txt = txt[:900] + ("\n...\n" + txt[-350:] if len(txt) > 900 else "") if txt else "(AUCUN TEXTE)"
        items.append({
            "id": f["id"],
            "nom_original": f["nom_original"],
            "fmt": f["format_source"],
            "pages": f.get("nb_pages"),
            "domaine": f.get("domaine_principal"),
            "sous_domaine": f.get("sous_domaine"),
            "type_doc": f.get("type_doc"),
            "public": f.get("public_principal"),
            "pertinence": f.get("pertinence_plateforme"),
            "titre": f.get("titre"),
            "droits": f.get("statut_droits"),
            "complet": f.get("complet"),
            "flags": f.get("drapeaux", []),
            "decision": f.get("decision_publication"),
            "motif": f.get("motif_decision"),
            "extrait": short_txt,
        })

    chunks = []
    cur = []
    cur_bytes = 200
    for it in items:
        b = len(json.dumps(it, ensure_ascii=False).encode("utf-8")) + 20
        if cur and (cur_bytes + b > MAX_AUDIT_BYTES or len(cur) >= BATCH_SIZE):
            chunks.append(cur)
            cur = [it]
            cur_bytes = 200 + b
        else:
            cur.append(it)
            cur_bytes += b
    if cur:
        chunks.append(cur)

    total_batches = len(chunks)
    files = []
    for idx, chunk in enumerate(chunks, 1):
        bf = AUDIT_IN_DIR / f"audit_batch_{idx:03d}.json"
        bf.write_text(json.dumps({
            "batch_number": idx,
            "total_batches": total_batches,
            "documents": chunk
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        files.append(bf.name)

    (AUDIT_IN_DIR / "manifest.json").write_text(
        json.dumps({"total_documents": len(items), "total_batches": total_batches, "files": files}, indent=2),
        encoding="utf-8"
    )
    print(f"Prepared {total_batches} audit batches ({len(items)} documents)")


def apply():
    result_files = sorted(AUDIT_OUT_DIR.glob("audit_batch_*_result.json"))
    print(f"Found {len(result_files)} audit result files")
    applied = 0
    disagreements = 0
    for rf in result_files:
        raw = rf.read_text(encoding="utf-8").strip()
        if raw.startswith("```"):
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
        data = json.loads(raw)
        audits = data.get("audits", data) if isinstance(data, dict) else data
        for a in audits:
            did = a.get("id")
            fp = FICHES_DIR / f"{did}.json"
            if not fp.exists():
                continue
            f = json.loads(fp.read_text(encoding="utf-8"))
            accord = bool(a.get("accord", True))
            dec_aud = a.get("decision_auditeur") or f.get("decision_publication")
            f["audit"] = {
                "accord": accord,
                "champs_en_desaccord": a.get("champs_en_desaccord") or [],
                "decision_auditeur": dec_aud,
                "arbitrage": a.get("arbitrage"),
            }
            if not accord:
                disagreements += 1
                corr = a.get("corrections") or {}
                for k in ("domaine_principal", "sous_domaine", "type_doc", "statut_droits", "complet"):
                    if k in corr and corr[k] is not None:
                        f[k] = corr[k]
                # R6 compliance
                if dec_aud in ("a_valider_humain", "non_publie_archive", "exclu_hors_perimetre", "exclu_doublon", "exclu_illisible"):
                    f["decision_publication"] = dec_aud
                else:
                    f["decision_publication"] = "a_valider_humain"
                if a.get("arbitrage"):
                    f["motif_decision"] = str(a["arbitrage"])[:300]
            f["statut_traitement"] = "audite"
            fp.write_text(json.dumps(f, ensure_ascii=False, indent=2), encoding="utf-8")
            applied += 1
    print(f"Applied {applied} audits ({disagreements} disagreements flagged/corrected)")


if __name__ == "__main__":
    if "--prepare" in sys.argv:
        prepare()
    elif "--apply" in sys.argv:
        apply()
    else:
        print("Specify --prepare or --apply")
