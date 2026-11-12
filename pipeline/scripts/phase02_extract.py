"""
Phase 2: Text Extraction
- Extracts text from the first 5 pages of each PDF
- For non-PDF formats, marks them for manual conversion
- Saves extracted text alongside fiche JSON
- Updates status to 'extrait'
"""
import os
import sys
import json
import struct
import zlib
import re
from pathlib import Path
from datetime import datetime, timezone

# Configuration
SOURCE_DIR = Path(r"C:\Users\PC\OneDrive\Documents\Professionnel\Carrière\Business\agrolide.org\Opérations\Formation\Bibliothèque-Agrolide\Docs")
PIPELINE_DIR = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline\pipeline")
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
TEXT_DIR = PIPELINE_DIR / "output" / "textes"
CHECKPOINT_FILE = PIPELINE_DIR / "checkpoints" / "phase02_checkpoint.json"
LOG_FILE = PIPELINE_DIR / "logs" / f"phase02_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.log"

MAX_PAGES = 5
MAX_TEXT_CHARS = 8000  # Max text to store per document

TEXT_DIR.mkdir(parents=True, exist_ok=True)


def log(msg: str):
    ts = datetime.now(timezone.utc).isoformat()
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def extract_text_from_pdf_basic(filepath: Path, max_pages: int = 5) -> tuple[str | None, int | None, str | None]:
    """
    Basic PDF text extraction without external dependencies.
    Returns (text, nb_pages, error).
    Falls back to reading raw streams if needed.
    """
    try:
        with open(filepath, "rb") as f:
            data = f.read()
        
        if not data.startswith(b"%PDF"):
            return None, None, "Not a valid PDF file"
        
        # Count pages (rough estimate)
        page_count = len(re.findall(rb'/Type\s*/Page[^s]', data))
        if page_count == 0:
            page_count = data.count(b'/Type /Page') + data.count(b'/Type/Page')
        
        # Extract text from stream objects
        text_parts = []
        # Find all stream objects
        stream_pattern = rb'stream\r?\n(.*?)\r?\nendstream'
        streams = re.findall(stream_pattern, data, re.DOTALL)
        
        pages_extracted = 0
        for stream_data in streams:
            if pages_extracted >= max_pages:
                break
            try:
                # Try to decompress (most PDF streams are FlateDecode)
                try:
                    decompressed = zlib.decompress(stream_data)
                except:
                    decompressed = stream_data
                
                # Extract text operators: Tj, TJ, ' , "
                text_in_stream = []
                
                # Find Tj strings: (text) Tj
                tj_matches = re.findall(rb'\(([^)]*)\)', decompressed)
                for match in tj_matches:
                    try:
                        decoded = match.decode('utf-8', errors='ignore')
                        if decoded.strip():
                            text_in_stream.append(decoded)
                    except:
                        pass
                
                # Find hex strings: <hex> Tj
                hex_matches = re.findall(rb'<([0-9A-Fa-f]+)>', decompressed)
                for match in hex_matches:
                    try:
                        decoded = bytes.fromhex(match.decode('ascii')).decode('utf-16-be', errors='ignore')
                        if decoded.strip() and len(decoded) > 1:
                            text_in_stream.append(decoded)
                    except:
                        pass
                
                if text_in_stream:
                    combined = " ".join(text_in_stream)
                    if len(combined.strip()) > 20:  # Meaningful text
                        text_parts.append(combined)
                        pages_extracted += 1
            except:
                continue
        
        full_text = "\n\n".join(text_parts)
        
        # Clean up the text
        full_text = re.sub(r'\s+', ' ', full_text)
        full_text = full_text.strip()
        
        if not full_text or len(full_text) < 30:
            return None, page_count, "No extractable text (possibly scanned/image PDF)"
        
        return full_text[:MAX_TEXT_CHARS], page_count, None
        
    except Exception as e:
        return None, None, f"PDF read error: {str(e)}"


def main():
    log("=" * 60)
    log("PHASE 2: Text Extraction")
    log("=" * 60)

    # Load all fiches
    fiche_files = sorted(FICHES_DIR.glob("DOC-*.json"))
    log(f"Found {len(fiche_files)} fiches to process")

    # Load checkpoint
    checkpoint = {}
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            checkpoint = json.load(f)
    processed_set = set(checkpoint.get("processed", []))

    stats = {
        "total": len(fiche_files),
        "extracted": 0,
        "no_text": 0,
        "non_pdf": 0,
        "exact_dup_skipped": 0,
        "errors": 0,
        "already_done": len(processed_set)
    }

    for i, fiche_path in enumerate(fiche_files):
        doc_id = fiche_path.stem
        
        if doc_id in processed_set:
            continue

        try:
            with open(fiche_path, "r", encoding="utf-8") as f:
                fiche = json.load(f)

            # Skip exact duplicates (they share content with canonical)
            if fiche.get("role_doublon") == "copie_exacte":
                stats["exact_dup_skipped"] += 1
                processed_set.add(doc_id)
                continue

            rel_path = fiche["chemin_relatif_source"]
            filepath = SOURCE_DIR / rel_path
            fmt = fiche["format_source"]

            if not filepath.exists():
                log(f"WARN: File not found: {rel_path}")
                fiche["statut_traitement"] = "erreur_technique"
                fiche["erreur_technique"] = "Fichier source introuvable"
                stats["errors"] += 1
            elif fmt != "pdf":
                # Non-PDF: mark for conversion but can't extract yet
                fiche["statut_traitement"] = "inventorie"  # stays at inventorie
                stats["non_pdf"] += 1
                log(f"SKIP non-PDF: {rel_path} ({fmt})")
            else:
                # Extract text from PDF
                text, nb_pages, error = extract_text_from_pdf_basic(filepath, MAX_PAGES)
                
                if nb_pages is not None:
                    fiche["nb_pages"] = nb_pages

                if text and len(text.strip()) >= 50:
                    # Save extracted text
                    text_path = TEXT_DIR / f"{doc_id}.txt"
                    with open(text_path, "w", encoding="utf-8") as f:
                        f.write(text)
                    fiche["statut_traitement"] = "extrait"
                    stats["extracted"] += 1
                else:
                    # No text extractable
                    if "drapeaux" not in fiche:
                        fiche["drapeaux"] = []
                    if "ocr_necessaire" not in fiche["drapeaux"]:
                        fiche["drapeaux"].append("ocr_necessaire")
                    fiche["statut_traitement"] = "extrait"
                    fiche["erreur_technique"] = error or "Texte insuffisant"
                    stats["no_text"] += 1
                    # Still save whatever we got
                    if text:
                        text_path = TEXT_DIR / f"{doc_id}.txt"
                        with open(text_path, "w", encoding="utf-8") as f:
                            f.write(text)
                    log(f"LOW TEXT: {rel_path} - {error}")

            # Save updated fiche
            with open(fiche_path, "w", encoding="utf-8") as f:
                json.dump(fiche, f, ensure_ascii=False, indent=2)

            processed_set.add(doc_id)

            if (i + 1) % 50 == 0:
                log(f"Progress: {i + 1}/{len(fiche_files)} ({stats['extracted']} extracted, {stats['no_text']} no text, {stats['non_pdf']} non-pdf)")
                checkpoint["processed"] = list(processed_set)
                with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
                    json.dump(checkpoint, f)

        except Exception as e:
            log(f"ERROR {doc_id}: {e}")
            stats["errors"] += 1
            processed_set.add(doc_id)

    # Final checkpoint
    checkpoint["processed"] = list(processed_set)
    checkpoint["completed"] = True
    checkpoint["stats"] = stats
    with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
        json.dump(checkpoint, f, ensure_ascii=False, indent=2)

    log("")
    log("=" * 60)
    log("TEXT EXTRACTION COMPLETE")
    for k, v in stats.items():
        log(f"  {k}: {v}")
    log("=" * 60)


if __name__ == "__main__":
    main()
