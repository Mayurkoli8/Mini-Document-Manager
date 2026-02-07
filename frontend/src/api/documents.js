const BASE_URL = "http://localhost:8000";

export function uploadDocuments(files, onProgress) {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));

  return fetch(`${BASE_URL}/documents`, {
    method: "POST",
    body: formData
  });
}

export async function fetchDocuments({ page, pageSize, q, sortBy, sortOrder }) {
  const params = new URLSearchParams({
    page,
    page_size: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder
  });

  if (q) params.append("q", q);

  const res = await fetch(`${BASE_URL}/documents?${params}`);
  return res.json();
}

export async function deleteDocument(id) {
  return fetch(`${BASE_URL}/documents/${id}`, {
    method: "DELETE"
  });
}

