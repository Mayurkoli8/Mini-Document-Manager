# Mini Document Manager

A minimal full-stack document management system built with **FastAPI (Python)** and **React (Vite)**.

The application supports uploading, listing, searching, sorting, previewing, and downloading documents with a clean separation between file storage and metadata storage.

---

## Features

- Upload multiple documents in a single action
- Upload progress bar
- List documents with:
  - Pagination
  - Search by title (simple contains search)
  - Sorting by:
    - Date
    - Title (A–Z / Z–A)
    - File type
- Preview support:
  - Images (jpg, png, etc.)
  - PDFs
  - Text files
- Streaming downloads (memory-safe)
- Displays file title, size, upload date and time

---

## Tech Stack

### Frontend
- React (Vite)
- Plain CSS
- Fetch API and XMLHttpRequest (for upload progress)

### Backend
- Python
- FastAPI
- Local disk storage

---

## Architecture Overview

- **Frontend** handles UI, state, and user interactions
- **Backend** handles validation, metadata management, and streaming
- **File storage** (binary data) is stored on local disk
- **Metadata storage** (title, size, timestamps, id) is stored separately in a JSON file

This separation makes the system easier to scale and migrate to object storage like S3 in the future.

Refer to the architecture diagram included in the submission for a visual overview.

---

## API Endpoints

### POST `/documents`
Upload one or more documents using multipart form data.

### GET `/documents`
Query parameters:
- `page`
- `page_size`
- `q` (search query)
- `sort_by` (date, title, type)
- `sort_order` (asc, desc)

### GET `/documents/{id}/download`
Streams the file to the client for download or preview.

---

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+

---

### Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
#### Run the backend server:
```bash
uvicorn app.main:app --reload
```

#### Backend will be available at:
```bash
http://localhost:8000
```
### Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

#### Frontend will be available at:
```bash
http://localhost:5173
```

## Usage

1. Open the frontend in the browser
2. Upload one or more files
3. View upload progress
4. Search documents by title
5. Sort documents by date, title, or type
6. Preview supported file types
7. Download files using streaming

---

## Design Questions

### 1. Multiple Uploads

Multiple files are uploaded in a single multipart request.

This reduces network overhead and simplifies frontend state handling.  
A tradeoff is that very large batches may increase request duration, so size and count limits should be enforced in production systems.

---

### 2. Streaming

Streaming is used for downloads to avoid loading entire files into server memory.

This prevents high memory usage, allows concurrent downloads, and improves scalability when handling large files.

---

### 3. Moving to Object Storage (S3)

If files were moved to object storage:

- Backend would store only metadata and object keys
- Files could be streamed directly from S3 or accessed via pre-signed URLs
- Backend would no longer manage raw file bytes

This would significantly reduce backend load.

---

### 4. Frontend UX Improvements (Given More Time)

- Drag-and-drop uploads
- Chunked uploads for very large files
- Previews for additional file formats
- Better error handling and retry mechanisms

---

## Assumptions & Tradeoffs

- Authentication and authorization are out of scope
- Metadata is stored in JSON for simplicity
- Local disk storage is used instead of cloud storage
- Focus was on clarity, correctness, and explainability rather than feature breadth

---

## Final Notes

The system is intentionally minimal and interview-friendly.  
All components are designed to be easy to explain and extend.
