"""
Phase 3-Prep: Prepare classification batches
Creates batch files of document texts for classification by AI subagents.
Each batch = 10 documents with their extracted text + filename context.
"""
import json
import os
from pathlib import Path

PIPELINE_DIR = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline\pipeline")
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
TEXT_DIR = PIPELINE_DIR / "output" / "textes"
BATCH_DIR = PIPELINE_DIR / "output" / "batches"
CONFIG_DIR = PIPELINE_DIR / "config"
BATCH_SIZE = 10

BATCH_DIR.mkdir(parents=True, exist_ok=True)


def load_taxonomie():
    with open(CONFIG_DIR / "taxonomie.json", "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    # Collect all fiches with extracted text
    docs_to_classify = []
    
    fiche_files = sorted(FICHES_DIR.glob("DOC-*.json"))
    
    for fiche_path in fiche_files:
        with open(fiche_path, "r", encoding="utf-8") as f:
            fiche = json.load(f)
        
        doc_id = fiche["id"]
        
        # Skip already classified or exact duplicates
        if fiche["statut_traitement"] in ("classifie", "audite", "dedoublonne", "decide", "nomme", "termine"):
            continue
        if fiche.get("role_doublon") == "copie_exacte":
            continue
        
        # Read extracted text
        text_path = TEXT_DIR / f"{doc_id}.txt"
        text = ""
        if text_path.exists():
            with open(text_path, "r", encoding="utf-8") as f:
                text = f.read()
        
        docs_to_classify.append({
            "id": doc_id,
            "nom_original": fiche["nom_original"],
            "format_source": fiche["format_source"],
            "taille_octets": fiche["taille_octets"],
            "nb_pages": fiche.get("nb_pages"),
            "drapeaux": fiche.get("drapeaux", []),
            "text_preview": text[:4000] if text else "(Aucun texte extrait)",
        })
    
    print(f"Documents to classify: {len(docs_to_classify)}")
    
    # Create batches
    batches = []
    for i in range(0, len(docs_to_classify), BATCH_SIZE):
        batch = docs_to_classify[i:i + BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1
        batch_file = BATCH_DIR / f"batch_{batch_num:03d}.json"
        
        with open(batch_file, "w", encoding="utf-8") as f:
            json.dump({
                "batch_number": batch_num,
                "total_batches": -1,  # filled after
                "documents": batch
            }, f, ensure_ascii=False, indent=2)
        
        batches.append(batch_file)
    
    # Update total_batches
    for bf in batches:
        with open(bf, "r", encoding="utf-8") as f:
            data = json.load(f)
        data["total_batches"] = len(batches)
        with open(bf, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Created {len(batches)} batches of {BATCH_SIZE} documents each")
    print(f"Batches saved to: {BATCH_DIR}")

    # Save batch manifest
    manifest = {
        "total_documents": len(docs_to_classify),
        "total_batches": len(batches),
        "batch_size": BATCH_SIZE,
        "batch_files": [str(bf.name) for bf in batches]
    }
    with open(BATCH_DIR / "manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
