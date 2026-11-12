"""
Phase 0-1 Consolidated: Exhaustive Inventory & Hashing
1. Extracts internal .rar and .zip archives inside Docs/ into pipeline/input/archives_extraites/
2. Scans ALL local sources (Docs, Agrobusiness, traites, doublons, root, workspace/Bibliotheque, archives_extraites)
3. Matches against supabase-export/documents.json to tag existing R2 imports (origine='import_existant_r2')
4. Deduplicates/links exact SHA-256 copies while preserving every file in the inventory with stable DOC-XXXXX IDs
"""
import os
import sys
import json
import hashlib
import zipfile
import subprocess
import unicodedata
from pathlib import Path
from datetime import datetime, timezone

ONEDRIVE_ROOT = Path(r"C:\Users\PC\OneDrive\Documents\Professionnel\Carrière\Business\agrolide.org\Opérations\Formation\Bibliothèque-Agrolide")
WS_ROOT = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline")
WS_BIB = WS_ROOT / "Bibliothèque"
DB_EXPORT_JSON = WS_ROOT / "agrolide" / "supabase-export" / "documents.json"

PIPELINE_DIR = WS_ROOT / "pipeline"
EXTRACTED_ARCHIVES_DIR = PIPELINE_DIR / "input" / "archives_extraites"
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
RAPPORT_DIR = PIPELINE_DIR / "output" / "rapport"
LOG_FILE = PIPELINE_DIR / "logs" / f"phase01_consolidated_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.log"

UNRAR_EXE = Path(r"C:\Program Files\WinRAR\UnRAR.exe")

EXPLOITABLE_EXTS = {'.pdf', '.docx', '.doc', '.pptx', '.ppt', '.odt', '.xlsx', '.xls'}
SKIP_EXTS = {'.mp4', '.enc', '.rar', '.zip', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.txt', '.json'}


def log(msg: str):
    ts = datetime.now(timezone.utc).isoformat()
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def sha256_file(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def extract_internal_archives():
    """Extract .rar and .zip files found inside Docs/ (not the top-level backup ZIPs)."""
    docs_dir = ONEDRIVE_ROOT / "Docs"
    EXTRACTED_ARCHIVES_DIR.mkdir(parents=True, exist_ok=True)

    # Extract .rar files using UnRAR
    rar_files = sorted(docs_dir.rglob("*.rar"))
    for rf in rar_files:
        target = EXTRACTED_ARCHIVES_DIR / rf.stem
        if target.exists() and any(target.rglob("*")):
            continue
        target.mkdir(parents=True, exist_ok=True)
        if UNRAR_EXE.exists():
            res = subprocess.run(
                [str(UNRAR_EXE), "x", "-o+", "-y", str(rf), str(target) + os.sep],
                capture_output=True, text=True, errors="ignore"
            )
            log(f"UnRAR {rf.name} -> exit {res.returncode}")

    # Extract .zip files inside Docs/
    zip_files = sorted(docs_dir.rglob("*.zip"))
    for zf_path in zip_files:
        target = EXTRACTED_ARCHIVES_DIR / zf_path.stem
        if target.exists() and any(target.rglob("*")):
            continue
        target.mkdir(parents=True, exist_ok=True)
        try:
            with zipfile.ZipFile(zf_path) as zf:
                zf.extractall(target)
            log(f"Unzip {zf_path.name} -> OK")
        except Exception as e:
            log(f"Unzip {zf_path.name} -> ERR: {e}")


def main():
    log("=" * 60)
    log("PHASE 0-1 CONSOLIDATED: Exhaustive Inventory")
    log("=" * 60)

    # Clean old fiches & text cache to guarantee clean, consistent IDs DOC-00001..N
    FICHES_DIR.mkdir(parents=True, exist_ok=True)
    RAPPORT_DIR.mkdir(parents=True, exist_ok=True)
    for old in FICHES_DIR.glob("DOC-*.json"):
        old.unlink()

    # Step 1: extract internal archives from Docs/
    extract_internal_archives()

    # Load existing DB export (102 docs)
    db_by_hash = {}
    if DB_EXPORT_JSON.exists():
        db_docs = json.loads(DB_EXPORT_JSON.read_text(encoding="utf-8"))
        for row in db_docs:
            if row.get("file_hash"):
                db_by_hash[row["file_hash"]] = row
        log(f"Loaded {len(db_docs)} existing DB records ({len(db_by_hash)} with sha256)")

    # Step 2: collect candidate files in priority order of canonical source
    # Priority: Docs > Agrobusiness > OD_Root > extracted_archives > WS_Bib > OD_traites > OD_doublons
    sources = [
        ("OD_Docs", ONEDRIVE_ROOT / "Docs", None),
        ("OD_Agrobusiness", ONEDRIVE_ROOT / "Agrobusiness", "Agrobusiness"),
        ("OD_ArchivesExtraites", EXTRACTED_ARCHIVES_DIR, "archive_interne"),
        ("WS_Bib", WS_BIB, "workspace_bib"),
        ("OD_traites", ONEDRIVE_ROOT / "traites", "traites"),
        ("OD_doublons", ONEDRIVE_ROOT / "doublons", "doublons"),
    ]

    candidates = []
    skipped_non_doc = []

    # Add root files from ONEDRIVE_ROOT (excluding top-level .zip)
    for f in sorted(ONEDRIVE_ROOT.iterdir()):
        if f.is_file() and f.suffix.lower() != ".zip":
            ext = f.suffix.lower()
            if ext in EXPLOITABLE_EXTS:
                candidates.append(("OD_Root", nfc(f.name), f, None))
            else:
                skipped_non_doc.append({"source": "OD_Root", "file": f.name, "ext": ext, "size": f.stat().st_size})

    for label, base, default_hint in sources:
        if not base.exists():
            continue
        for f in base.rglob("*"):
            if not f.is_file():
                continue
            ext = f.suffix.lower()
            rel = nfc(f"{label}/{f.relative_to(base).as_posix()}")
            if ext in EXPLOITABLE_EXTS:
                hint = default_hint
                if label == "WS_Bib" and f.parent != base:
                    hint = f"ws_{f.relative_to(base).parts[0]}"
                candidates.append((label, rel, f, hint))
            else:
                skipped_non_doc.append({"source": label, "file": rel, "ext": ext, "size": f.stat().st_size})

    # Sort deterministically by normalized relative path within each priority tier,
    # Wait: if we sort all candidates by rel path NFC, DOC IDs are alphabetical by chemin_relatif_source
    # Keep first occurrence per sha256 as the primary file to process, but record ALL occurrences?
    # Better: assign DOC-XXXXX to EVERY unique (sha256) OR every exploitable file?
    # Note: schema says "copie_exacte: Même SHA-256 qu'un autre fichier."
    # If we keep unique files from the primary corpus (OD_Docs + OD_ArchivesExtraites + OD_Agrobusiness + OD_Root + unique from WS_Bib/OD_traites/OD_doublons),
    # we avoid duplicating the 100 WS_Bib files that are identical copies of OD_Docs!
    # Wait: within OD_Docs itself, there ARE 64 internal exact duplicates that we MUST keep in the inventory as 'copie_exacte' so the user sees why they were deduplicated!
    # For WS_Bib / OD_traites / OD_doublons: only add files whose SHA-256 does NOT already appear in OD_Docs/OD_Agro/OD_Root/OD_Archives.

    primary_labels = {"OD_Docs", "OD_Agrobusiness", "OD_Root", "OD_ArchivesExtraites"}
    primary_items = sorted([c for c in candidates if c[0] in primary_labels], key=lambda x: x[1])
    secondary_items = sorted([c for c in candidates if c[0] not in primary_labels], key=lambda x: x[1])

    seen_hashes = {}
    selected_items = []

    for label, rel, fp, hint in primary_items:
        h = sha256_file(fp)
        selected_items.append((label, rel, fp, hint, h))
        seen_hashes.setdefault(h, rel)

    added_from_secondary = 0
    for label, rel, fp, hint in secondary_items:
        h = sha256_file(fp)
        if h not in seen_hashes:
            selected_items.append((label, rel, fp, hint, h))
            seen_hashes[h] = rel
            added_from_secondary += 1

    # Re-sort selected items alphabetically by normalized path for stable DOC IDs
    selected_items.sort(key=lambda x: x[1])

    log(f"Primary items: {len(primary_items)}, Unique recovered from WS/traites/doublons: {added_from_secondary}")
    log(f"Total corpus files to inventory: {len(selected_items)}")

    # Step 3: Assign DOC-XXXXX IDs and write minimal fiches
    hash_first_doc = {}
    duplicates_hash = []
    ext_counts = {}
    r2_matched = 0

    # Also build a path index so Phase 2 knows the absolute source path
    path_index = {}

    for idx, (label, rel, fp, hint, file_hash) in enumerate(selected_items):
        doc_id = f"DOC-{idx + 1:05d}"
        fmt = fp.suffix.lower().lstrip(".")
        ext_counts[fmt] = ext_counts.get(fmt, 0) + 1
        file_size = fp.stat().st_size

        is_exact_dup = False
        dup_of = None
        if file_hash in hash_first_doc:
            is_exact_dup = True
            dup_of = hash_first_doc[file_hash]
            duplicates_hash.append({
                "doc_id": doc_id,
                "duplicate_of": dup_of,
                "file": rel
            })
        else:
            hash_first_doc[file_hash] = doc_id

        drapeaux = []
        if fmt != "pdf":
            drapeaux.append("format_non_pdf")
            if fmt in ("docx", "doc", "pptx", "ppt", "odt", "xlsx", "xls"):
                drapeaux.append("conversion_requise")
        if file_size > 40 * 1024 * 1024:
            drapeaux.append("taille_excessive")

        db_row = db_by_hash.get(file_hash)
        origine = "import_existant_r2" if db_row else "corpus"
        if db_row:
            r2_matched += 1

        fiche = {
            "id": doc_id,
            "sha256": file_hash,
            "nom_original": nfc(fp.name),
            "chemin_relatif_source": rel,
            "indice_ancien_dossier": hint,
            "format_source": fmt,
            "taille_octets": file_size,
            "origine": origine,
            "cle_r2_existante": db_row.get("fichier_r2_key") if db_row else None,
            "nb_telechargements_existant": db_row.get("nb_telechargements") if db_row else None,
            "statut_traitement": "inventorie",
            "version_regles": "v1-depart",
            "drapeaux": drapeaux,
        }
        if is_exact_dup:
            fiche["role_doublon"] = "copie_exacte"
            fiche["canonique_id"] = dup_of

        (FICHES_DIR / f"{doc_id}.json").write_text(json.dumps(fiche, ensure_ascii=False, indent=2), encoding="utf-8")
        path_index[doc_id] = str(fp)

    # Save path index & reports
    (PIPELINE_DIR / "checkpoints" / "path_index.json").write_text(
        json.dumps(path_index, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (RAPPORT_DIR / "duplicates_hash.json").write_text(
        json.dumps(duplicates_hash, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (RAPPORT_DIR / "skipped_files.json").write_text(
        json.dumps(skipped_non_doc, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    summary = {
        "total_inventorie": len(selected_items),
        "unique_sha256": len(hash_first_doc),
        "exact_duplicates_sha256": len(duplicates_hash),
        "matched_existing_db": r2_matched,
        "skipped_non_doc": len(skipped_non_doc),
        "by_format": ext_counts,
    }
    (PIPELINE_DIR / "checkpoints" / "phase01_consolidated.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    log("")
    log("=" * 60)
    log("CONSOLIDATED INVENTORY COMPLETE")
    for k, v in summary.items():
        log(f"  {k}: {v}")
    log("=" * 60)


if __name__ == "__main__":
    main()
