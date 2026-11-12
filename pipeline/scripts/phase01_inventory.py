"""
Phase 0-1: Inventory & Hashing
- Scans all files in the source directory
- Computes SHA-256 hash for each file
- Creates minimal JSON fiches (status: inventorie)
- Detects exact duplicates by hash
"""
import os
import sys
import json
import hashlib
import unicodedata
from pathlib import Path
from datetime import datetime, timezone

# Configuration
SOURCE_DIR = Path(r"C:\Users\PC\OneDrive\Documents\Professionnel\Carrière\Business\agrolide.org\Opérations\Formation\Bibliothèque-Agrolide\Docs")
PIPELINE_DIR = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline\pipeline")
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
CHECKPOINT_FILE = PIPELINE_DIR / "checkpoints" / "phase01_checkpoint.json"
LOG_FILE = PIPELINE_DIR / "logs" / f"phase01_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.log"

# Supported formats
SUPPORTED_FORMATS = {'.pdf', '.docx', '.doc', '.pptx', '.ppt', '.odt', '.xlsx'}
SKIP_FORMATS = {'.mp4', '.enc', '.rar', '.zip', '.jpg', '.jpeg', '.png'}


def log(msg: str):
    ts = datetime.now(timezone.utc).isoformat()
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def sha256_file(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def normalize_path(p: str) -> str:
    """NFC-normalize a path string for consistent sorting."""
    return unicodedata.normalize("NFC", p)


def get_format(filepath: Path) -> str:
    return filepath.suffix.lower().lstrip(".")


def main():
    log("=" * 60)
    log("PHASE 0-1: Inventory & Hashing")
    log(f"Source: {SOURCE_DIR}")
    log("=" * 60)

    if not SOURCE_DIR.exists():
        log(f"ERROR: Source directory not found: {SOURCE_DIR}")
        sys.exit(1)

    # Collect all files recursively
    all_files = []
    skipped = []
    for root, dirs, files in os.walk(SOURCE_DIR):
        for fname in files:
            fp = Path(root) / fname
            ext = fp.suffix.lower()
            rel = fp.relative_to(SOURCE_DIR)
            if ext in SKIP_FORMATS:
                skipped.append(str(rel))
                continue
            all_files.append((normalize_path(str(rel)), fp))

    # Sort by normalized relative path (for stable ID assignment)
    all_files.sort(key=lambda x: x[0])

    log(f"Found {len(all_files)} exploitable files, {len(skipped)} skipped")

    # Load checkpoint if exists
    checkpoint = {}
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            checkpoint = json.load(f)
        log(f"Loaded checkpoint with {len(checkpoint.get('processed', []))} already processed")

    processed_set = set(checkpoint.get("processed", []))

    # Hash tracking for duplicate detection
    hash_map = {}  # sha256 -> first DOC id
    inventory = []
    duplicates_by_hash = []
    errors = []

    for idx, (rel_path, filepath) in enumerate(all_files):
        doc_id = f"DOC-{idx + 1:05d}"
        
        if doc_id in processed_set:
            # Load existing fiche to rebuild hash_map
            fiche_path = FICHES_DIR / f"{doc_id}.json"
            if fiche_path.exists():
                with open(fiche_path, "r", encoding="utf-8") as f:
                    existing = json.load(f)
                    h = existing.get("sha256")
                    if h and h not in hash_map:
                        hash_map[h] = doc_id
            continue

        try:
            file_size = filepath.stat().st_size
            file_hash = sha256_file(filepath)
            fmt = get_format(filepath)

            # Check for exact duplicate
            is_exact_dup = False
            dup_of = None
            if file_hash in hash_map:
                is_exact_dup = True
                dup_of = hash_map[file_hash]
                duplicates_by_hash.append({
                    "doc_id": doc_id,
                    "duplicate_of": dup_of,
                    "file": str(rel_path)
                })
            else:
                hash_map[file_hash] = doc_id

            # Detect flags
            drapeaux = []
            if fmt not in ("pdf",):
                drapeaux.append("format_non_pdf")
                if fmt in ("docx", "doc", "pptx", "ppt", "odt"):
                    drapeaux.append("conversion_requise")
            if file_size > 40 * 1024 * 1024:
                drapeaux.append("taille_excessive")

            # Create minimal fiche
            fiche = {
                "id": doc_id,
                "sha256": file_hash,
                "nom_original": filepath.name,
                "chemin_relatif_source": str(rel_path),
                "format_source": fmt,
                "taille_octets": file_size,
                "origine": "corpus",
                "statut_traitement": "inventorie",
                "version_regles": "v1-depart",
                "drapeaux": drapeaux,
            }

            if is_exact_dup:
                fiche["role_doublon"] = "copie_exacte"
                fiche["canonique_id"] = dup_of

            # Save fiche
            fiche_path = FICHES_DIR / f"{doc_id}.json"
            with open(fiche_path, "w", encoding="utf-8") as f:
                json.dump(fiche, f, ensure_ascii=False, indent=2)

            processed_set.add(doc_id)
            inventory.append(fiche)

            if (idx + 1) % 50 == 0:
                log(f"Progress: {idx + 1}/{len(all_files)} files processed")
                # Save checkpoint
                checkpoint["processed"] = list(processed_set)
                checkpoint["last_idx"] = idx
                with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
                    json.dump(checkpoint, f)

        except Exception as e:
            errors.append({"doc_id": doc_id, "file": str(rel_path), "error": str(e)})
            log(f"ERROR processing {rel_path}: {e}")

    # Final checkpoint
    checkpoint["processed"] = list(processed_set)
    checkpoint["completed"] = True
    checkpoint["total_files"] = len(all_files)
    checkpoint["total_duplicates_hash"] = len(duplicates_by_hash)
    checkpoint["total_errors"] = len(errors)
    with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
        json.dump(checkpoint, f, ensure_ascii=False, indent=2)

    # Summary
    log("")
    log("=" * 60)
    log("INVENTORY COMPLETE")
    log(f"Total files: {len(all_files)}")
    log(f"Processed: {len(processed_set)}")
    log(f"Exact duplicates (by hash): {len(duplicates_by_hash)}")
    log(f"Errors: {len(errors)}")
    log(f"Skipped formats: {len(skipped)}")
    log("=" * 60)

    # Extension breakdown
    ext_counts = {}
    for _, fp in all_files:
        ext = fp.suffix.lower()
        ext_counts[ext] = ext_counts.get(ext, 0) + 1
    log("\nBy extension:")
    for ext, count in sorted(ext_counts.items(), key=lambda x: -x[1]):
        log(f"  {ext}: {count}")

    # Save duplicates report
    dup_report = PIPELINE_DIR / "output" / "rapport" / "duplicates_hash.json"
    with open(dup_report, "w", encoding="utf-8") as f:
        json.dump(duplicates_by_hash, f, ensure_ascii=False, indent=2)

    # Save errors report
    err_report = PIPELINE_DIR / "output" / "rapport" / "inventory_errors.json"
    with open(err_report, "w", encoding="utf-8") as f:
        json.dump(errors, f, ensure_ascii=False, indent=2)

    # Save skipped files
    skip_report = PIPELINE_DIR / "output" / "rapport" / "skipped_files.json"
    with open(skip_report, "w", encoding="utf-8") as f:
        json.dump(skipped, f, ensure_ascii=False, indent=2)

    log(f"\nFiches saved to: {FICHES_DIR}")
    log(f"Reports saved to: {PIPELINE_DIR / 'output' / 'rapport'}")


if __name__ == "__main__":
    main()
