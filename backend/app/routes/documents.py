from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from fastapi.responses import StreamingResponse
from uuid import uuid4
from datetime import datetime
import json
import os

from app.models.document import Document
from app.services.storage import save_file

router = APIRouter()
DATA_FILE = "app/data/documents.json"

def load_documents():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        content = f.read().strip()
        if not content:
            return []
        return json.loads(content)

def save_documents(docs):
    with open(DATA_FILE, "w") as f:
        json.dump(docs, f, default=str)

@router.post("/documents")
async def upload_documents(files: list[UploadFile] = File(...)):
    documents = load_documents()

    for file in files:
        filename, size, _ = save_file(file)

        doc = {
            "id": str(uuid4()),
            "title": file.filename,
            "filename": filename,
            "size": size,
            "uploaded_at": datetime.utcnow().isoformat()
        }

        documents.append(doc)

    save_documents(documents)
    return {"message": "Documents uploaded successfully"}

@router.get("/documents")
def list_documents(
    page: int = 1,
    page_size: int = 10,
    q: str | None = None,
    sort_order: str = "desc"
):
    documents = load_documents()

    if q:
        documents = [d for d in documents if q.lower() in d["title"].lower()]

    documents.sort(
        key=lambda d: d["uploaded_at"],
        reverse=(sort_order == "desc")
    )

    start = (page - 1) * page_size
    end = start + page_size

    return {
        "total": len(documents),
        "items": documents[start:end]
    }

@router.get("/documents/{doc_id}/download")
def download_document(doc_id: str):
    documents = load_documents()
    doc = next((d for d in documents if d["id"] == doc_id), None)

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = os.path.join("app/uploads", doc["filename"])

    def file_stream():
        with open(file_path, "rb") as f:
            while chunk := f.read(1024 * 1024):
                yield chunk

    return StreamingResponse(
        file_stream(),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{doc["title"]}"'
        }
    )
