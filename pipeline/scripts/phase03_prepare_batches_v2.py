"""
Phase 3 Prep v3: Creates size-capped batches (<= 34 KB each) so every batch
can be read in ONE single read_file call by subagents without truncation or scripts.
"""
import json
from pathlib import Path

WS_ROOT = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline")
PIPELINE_DIR = WS_ROOT / "pipeline"
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
TEXT_DIR = PIPELINE_DIR / "output" / "textes"
META_DIR = PIPELINE_DIR / "output" / "meta_extract"
BATCH_DIR = PIPELINE_DIR / "output" / "batches"

MAX_BATCH_BYTES = 34000
MAX_BATCH_DOCS = 15
MAX_TEXT_PER_DOC = 1800


def main():
    BATCH_DIR.mkdir(parents=True, exist_ok=True)
    for old in BATCH_DIR.glob("batch_*.json"):
        old.unlink()

    docs = []
    for fp in sorted(FICHES_DIR.glob("DOC-*.json")):
        fiche = json.loads(fp.read_text(encoding="utf-8"))
        doc_id = fiche["id"]

        if fiche.get("role_doublon") == "copie_exacte":
            continue
        if fiche["statut_traitement"] in ("classifie", "audite", "dedoublonne", "decide", "nomme", "termine", "erreur_technique"):
            continue

        txt = ""
        tp = TEXT_DIR / f"{doc_id}.txt"
        if tp.exists():
            raw = tp.read_text(encoding="utf-8")
            if len(raw) <= MAX_TEXT_PER_DOC:
                txt = raw
            else:
                txt = raw[:1250] + "\n...\n" + raw[-500:]

        meta = {}
        mp = META_DIR / f"{doc_id}.json"
        if mp.exists():
            meta = json.loads(mp.read_text(encoding="utf-8"))

        docs.append({
            "id": doc_id,
            "nom_original": fiche["nom_original"],
            "chemin": fiche["chemin_relatif_source"],
            "indice": fiche.get("indice_ancien_dossier"),
            "origine": fiche.get("origine"),
            "fmt": fiche["format_source"],
            "Mo": round(fiche["taille_octets"] / (1024 * 1024), 2),
            "pages": fiche.get("nb_pages"),
            "flags": fiche.get("drapeaux", []),
            "pdf_meta": meta.get("pdf_meta", {}),
            "toc": meta.get("toc", [])[:8],
            "texte": txt if txt else "(AUCUN TEXTE EXTRACTIBLE)",
        })

    batches_docs = []
    cur = []
    cur_bytes = 200
    for d in docs:
        d_bytes = len(json.dumps(d, ensure_ascii=False).encode("utf-8")) + 20
        if cur and (cur_bytes + d_bytes > MAX_BATCH_BYTES or len(cur) >= MAX_BATCH_DOCS):
            batches_docs.append(cur)
            cur = [d]
            cur_bytes = 200 + d_bytes
        else:
            cur.append(d)
            cur_bytes += d_bytes
    if cur:
        batches_docs.append(cur)

    total_batches = len(batches_docs)
    batch_files = []
    max_sz = 0
    for idx, chunk in enumerate(batches_docs, 1):
        bf = BATCH_DIR / f"batch_{idx:03d}.json"
        content = json.dumps({
            "batch_number": idx,
            "total_batches": total_batches,
            "count": len(chunk),
            "documents": chunk,
        }, ensure_ascii=False, indent=2)
        bf.write_text(content, encoding="utf-8")
        sz = len(content.encode("utf-8"))
        if sz > max_sz:
            max_sz = sz
        batch_files.append(bf.name)

    manifest = {
        "total_documents": len(docs),
        "total_batches": total_batches,
        "max_batch_bytes": max_sz,
        "batch_files": batch_files,
    }
    (BATCH_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Prepared {total_batches} batches ({len(docs)} docs, max {max_sz} bytes/batch)")


if __name__ == "__main__":
    main()
