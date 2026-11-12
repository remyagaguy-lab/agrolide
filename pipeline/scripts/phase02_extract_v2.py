"""
Phase 2 v2: High-fidelity Text & Metadata Extraction
Uses pymupdf (fitz) for PDF, python-docx for DOCX, python-pptx for PPTX, openpyxl for XLSX, zipfile+xml for ODT.
Extracts:
- First 5 pages + Last 2 pages (to detect incomplete/cut documents!)
- PDF metadata (title, author, creator, producer, subject, encryption, page count)
- Table of contents (if any)
- Text hash (normalized) for near-duplicate detection in Phase 4!
"""
import os
import re
import json
import hashlib
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime, timezone

import pymupdf
import docx
import pptx
import openpyxl

WS_ROOT = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline")
PIPELINE_DIR = WS_ROOT / "pipeline"
FICHES_DIR = PIPELINE_DIR / "output" / "fiches"
TEXT_DIR = PIPELINE_DIR / "output" / "textes"
META_DIR = PIPELINE_DIR / "output" / "meta_extract"
PATH_INDEX_FILE = PIPELINE_DIR / "checkpoints" / "path_index.json"
LOG_FILE = PIPELINE_DIR / "logs" / f"phase02_v2_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.log"

TEXT_DIR.mkdir(parents=True, exist_ok=True)
META_DIR.mkdir(parents=True, exist_ok=True)


def log(msg: str):
    ts = datetime.now(timezone.utc).isoformat()
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def clean_ws(text: str) -> str:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_pdf(fp: Path) -> dict:
    try:
        doc = pymupdf.open(fp)
    except Exception as e:
        return {"error": f"corrompu: {e}", "flag": "corrompu"}

    if doc.is_encrypted:
        # Try empty password just in case
        if not doc.authenticate(""):
            doc.close()
            return {"error": "protege par mot de passe", "flag": "protege"}

    nb_pages = len(doc)
    meta = doc.metadata or {}
    toc = []
    try:
        toc = [[lvl, title, page] for lvl, title, page in doc.get_toc()[:25]]
    except Exception:
        pass

    # Extract first 5 pages
    head_indices = list(range(min(5, nb_pages)))
    # Extract last 2 pages (if not already in head)
    tail_indices = [i for i in range(max(0, nb_pages - 2), nb_pages) if i not in head_indices]

    head_parts = []
    for i in head_indices:
        try:
            t = doc[i].get_text("text") or ""
            if t.strip():
                head_parts.append(f"[PAGE {i + 1}]\n{clean_ws(t)}")
        except Exception:
            pass

    tail_parts = []
    for i in tail_indices:
        try:
            t = doc[i].get_text("text") or ""
            if t.strip():
                tail_parts.append(f"[PAGE {i + 1}]\n{clean_ws(t)}")
        except Exception:
            pass

    # Also compute a normalized text signature across first 3 pages for near-dup detection
    sig_text = "".join(head_parts[:3])
    sig_norm = re.sub(r"\W+", "", sig_text.lower())[:4000]
    text_sig = hashlib.sha256(sig_norm.encode("utf-8", errors="ignore")).hexdigest() if len(sig_norm) >= 100 else None

    doc.close()

    head_text = "\n\n".join(head_parts)[:7000]
    tail_text = "\n\n".join(tail_parts)[:2500]
    total_chars = len(head_text) + len(tail_text)

    res = {
        "nb_pages": nb_pages,
        "pdf_meta": {k: v for k, v in meta.items() if v},
        "toc": toc,
        "head_text": head_text,
        "tail_text": tail_text,
        "text_sig": text_sig,
        "chars": total_chars,
    }
    if total_chars < 80:
        res["flag"] = "ocr_necessaire"
    return res


def extract_docx(fp: Path) -> dict:
    try:
        d = docx.Document(fp)
        parts = [p.text.strip() for p in d.paragraphs if p.text.strip()]
        for tbl in d.tables[:10]:
            for row in tbl.rows[:20]:
                cells = [c.text.strip() for c in row.cells if c.text.strip()]
                if cells:
                    parts.append(" | ".join(cells))
        full = "\n".join(parts)
        head = full[:7000]
        tail = full[-2000:] if len(full) > 7000 else ""
        sig_norm = re.sub(r"\W+", "", full.lower())[:4000]
        text_sig = hashlib.sha256(sig_norm.encode("utf-8", errors="ignore")).hexdigest() if len(sig_norm) >= 100 else None
        cp = d.core_properties
        meta = {}
        if cp.title: meta["title"] = cp.title
        if cp.author: meta["author"] = cp.author
        return {
            "nb_pages": None,
            "pdf_meta": meta,
            "toc": [],
            "head_text": head,
            "tail_text": tail,
            "text_sig": text_sig,
            "chars": len(full),
        }
    except Exception as e:
        return {"error": f"docx read error: {e}", "flag": "corrompu"}


def extract_pptx(fp: Path) -> dict:
    try:
        prs = pptx.Presentation(fp)
        slides_text = []
        for idx, slide in enumerate(prs.slides, 1):
            st = []
            for shape in slide.shapes:
                if shape.has_text_frame:
                    t = shape.text_frame.text.strip()
                    if t:
                        st.append(t)
            if st:
                slides_text.append(f"[SLIDE {idx}]\n" + "\n".join(st))
        full = "\n\n".join(slides_text)
        sig_norm = re.sub(r"\W+", "", full.lower())[:4000]
        text_sig = hashlib.sha256(sig_norm.encode("utf-8", errors="ignore")).hexdigest() if len(sig_norm) >= 100 else None
        return {
            "nb_pages": len(prs.slides),
            "pdf_meta": {},
            "toc": [],
            "head_text": full[:7000],
            "tail_text": full[-2000:] if len(full) > 7000 else "",
            "text_sig": text_sig,
            "chars": len(full),
        }
    except Exception as e:
        return {"error": f"pptx read error: {e}", "flag": "corrompu"}


def extract_xlsx(fp: Path) -> dict:
    try:
        wb = openpyxl.load_workbook(fp, read_only=True, data_only=True)
        parts = []
        for name in wb.sheetnames[:5]:
            ws = wb[name]
            parts.append(f"[SHEET {name}]")
            for i, row in enumerate(ws.iter_rows(values_only=True)):
                if i >= 40:
                    break
                vals = [str(v) for v in row if v is not None]
                if vals:
                    parts.append(" | ".join(vals))
        wb.close()
        full = "\n".join(parts)
        return {"nb_pages": None, "pdf_meta": {}, "toc": [], "head_text": full[:7000], "tail_text": "", "text_sig": None, "chars": len(full)}
    except Exception as e:
        return {"error": f"xlsx read error: {e}", "flag": "corrompu"}


def extract_odt(fp: Path) -> dict:
    try:
        with zipfile.ZipFile(fp) as zf:
            xml_bytes = zf.read("content.xml")
        root = ET.fromstring(xml_bytes)
        texts = [t.strip() for t in root.itertext() if t and t.strip()]
        full = " ".join(texts)
        return {"nb_pages": None, "pdf_meta": {}, "toc": [], "head_text": full[:7000], "tail_text": full[-2000:] if len(full) > 7000 else "", "text_sig": None, "chars": len(full)}
    except Exception as e:
        return {"error": f"odt read error: {e}", "flag": "corrompu"}


def extract_legacy_binary(fp: Path) -> dict:
    """Best-effort printable ASCII/UTF-16LE string extraction for legacy .doc/.ppt files."""
    try:
        data = fp.read_bytes()
        # Extract UTF-16LE text chunks (common in .doc/.ppt)
        u16_chunks = re.findall(rb"(?:[\x20-\x7e\xe0-\xff]\x00){6,}", data)
        decoded = []
        for c in u16_chunks:
            try:
                s = c.decode("utf-16-le", errors="ignore").strip()
                if len(s) >= 6 and not s.startswith(("Root Entry", "WordDocument", "SummaryInformation", "Microsoft")):
                    decoded.append(s)
            except Exception:
                pass
        full = "\n".join(decoded)
        if len(full) < 80:
            # Fallback ASCII
            ascii_chunks = re.findall(rb"[\x20-\x7e]{10,}", data)
            full = "\n".join(c.decode("latin1", errors="ignore") for c in ascii_chunks)
        return {"nb_pages": None, "pdf_meta": {}, "toc": [], "head_text": full[:6000], "tail_text": "", "text_sig": None, "chars": len(full)}
    except Exception as e:
        return {"error": f"legacy binary error: {e}", "flag": "corrompu"}


def main():
    log("=" * 60)
    log("PHASE 2 v2: High-fidelity Text Extraction")
    log("=" * 60)

    # Clear old text/meta outputs
    for f in TEXT_DIR.glob("DOC-*.txt"):
        f.unlink()
    for f in META_DIR.glob("DOC-*.json"):
        f.unlink()

    path_index = json.loads(PATH_INDEX_FILE.read_text(encoding="utf-8"))
    fiche_files = sorted(FICHES_DIR.glob("DOC-*.json"))
    log(f"Total fiches: {len(fiche_files)}")

    stats = {"total": len(fiche_files), "extracted": 0, "ocr_needed": 0, "corrupt_or_protected": 0, "exact_dup_skipped": 0}

    for i, fp_json in enumerate(fiche_files, 1):
        fiche = json.loads(fp_json.read_text(encoding="utf-8"))
        doc_id = fiche["id"]

        if fiche.get("role_doublon") == "copie_exacte":
            stats["exact_dup_skipped"] += 1
            continue

        src_path = Path(path_index[doc_id])
        fmt = fiche["format_source"]

        if fmt == "pdf":
            res = extract_pdf(src_path)
        elif fmt == "docx":
            res = extract_docx(src_path)
        elif fmt == "pptx":
            res = extract_pptx(src_path)
        elif fmt in ("xlsx", "xls"):
            res = extract_xlsx(src_path)
        elif fmt == "odt":
            res = extract_odt(src_path)
        elif fmt in ("doc", "ppt"):
            res = extract_legacy_binary(src_path)
        else:
            res = {"error": f"format non supporte: {fmt}", "flag": "format_non_pdf"}

        if res.get("nb_pages") is not None:
            fiche["nb_pages"] = res["nb_pages"]

        flag = res.get("flag")
        if flag:
            if flag not in fiche["drapeaux"]:
                fiche["drapeaux"].append(flag)

        if res.get("error"):
            fiche["erreur_technique"] = res["error"]
            if flag in ("corrompu", "protege"):
                fiche["statut_traitement"] = "erreur_technique"
                stats["corrupt_or_protected"] += 1
            else:
                fiche["statut_traitement"] = "extrait"
                stats["ocr_needed"] += 1
        elif flag == "ocr_necessaire":
            fiche["statut_traitement"] = "extrait"
            stats["ocr_needed"] += 1
        else:
            fiche["statut_traitement"] = "extrait"
            stats["extracted"] += 1

        # Write extracted text & meta
        combined_text = ""
        if res.get("head_text"):
            combined_text += "=== DEBUT ===\n" + res["head_text"]
        if res.get("tail_text"):
            combined_text += "\n\n=== FIN ===\n" + res["tail_text"]

        if combined_text:
            (TEXT_DIR / f"{doc_id}.txt").write_text(combined_text, encoding="utf-8")

        meta_out = {
            "id": doc_id,
            "nb_pages": res.get("nb_pages"),
            "pdf_meta": res.get("pdf_meta", {}),
            "toc": res.get("toc", []),
            "text_sig": res.get("text_sig"),
            "chars": res.get("chars", 0),
            "flag": flag,
            "error": res.get("error"),
        }
        (META_DIR / f"{doc_id}.json").write_text(json.dumps(meta_out, ensure_ascii=False, indent=2), encoding="utf-8")
        fp_json.write_text(json.dumps(fiche, ensure_ascii=False, indent=2), encoding="utf-8")

        if i % 100 == 0:
            log(f"Progress {i}/{len(fiche_files)}: extracted={stats['extracted']}, ocr_needed={stats['ocr_needed']}, corrupt={stats['corrupt_or_protected']}")

    (PIPELINE_DIR / "checkpoints" / "phase02_v2.json").write_text(
        json.dumps(stats, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    log("")
    log("=" * 60)
    log("PHASE 2 v2 COMPLETE")
    for k, v in stats.items():
        log(f"  {k}: {v}")
    log("=" * 60)


if __name__ == "__main__":
    main()
