"""Quick progress monitor for classification and audit batches."""
import json
from pathlib import Path

PIPELINE = Path(r"C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline\pipeline")
batches = sorted((PIPELINE / "output" / "batches").glob("batch_*.json"))
classified = sorted((PIPELINE / "output" / "classified").glob("batch_*_result.json"))
audit_in = sorted((PIPELINE / "output" / "audit_batches").glob("audit_batch_*.json"))
audit_out = sorted((PIPELINE / "output" / "audit_results").glob("audit_batch_*_result.json"))

done_ids = set()
bad_files = []
for cf in classified:
    try:
        data = json.loads(cf.read_text(encoding="utf-8"))
        items = data.get("results", data) if isinstance(data, dict) else data
        for it in items:
            if "id" in it:
                done_ids.add(it["id"])
    except Exception as e:
        bad_files.append((cf.name, str(e)))

expected_ids = set()
missing_batches = []
for bf in batches:
    bname = bf.stem
    res_file = PIPELINE / "output" / "classified" / f"{bname}_result.json"
    data = json.loads(bf.read_text(encoding="utf-8"))
    for doc in data["documents"]:
        expected_ids.add(doc["id"])
    if not res_file.exists():
        missing_batches.append(bname)

print(f"Classification batches: {len(classified)}/{len(batches)} files | Docs classified: {len(done_ids)}/{len(expected_ids)}")
if bad_files:
    print("Parse errors:", bad_files)
if missing_batches:
    print(f"Pending batches ({len(missing_batches)}):", ", ".join(missing_batches[:15]), "..." if len(missing_batches) > 15 else "")
missing_docs = sorted(expected_ids - done_ids)
if missing_docs and len(classified) == len(batches):
    print(f"MISSING DOC IDS ({len(missing_docs)}):", missing_docs[:20])
print(f"Audit batches: {len(audit_out)}/{len(audit_in)}")
