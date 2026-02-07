import { useEffect, useState } from "react";
import { fetchDocuments } from "../api/documents";
import PreviewModal from "./PreviewModal";
import { deleteDocument } from "../api/documents";


export default function DocumentList({ refreshKey }) {
  const [docs, setDocs] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);


useEffect(() => {
  load();
}, [page, sortBy, sortOrder, q, refreshKey]);

useEffect(() => {
  setPage(1);
}, [q, sortBy, sortOrder]);


  async function load() {
    setLoading(true);
    const data = await fetchDocuments({
      page,
      pageSize: 5,
      q,
      sortBy,
      sortOrder
    });
    setDocs(data.items);
    setTotalSize(data.total_size);
    setLoading(false);
  }

  return (
    <>
    <div className="card">
  <strong>
    Total Storage Used: {(totalSize / (1024 * 1024)).toFixed(2)} MB
  </strong>
</div>

      <div className="card">
        <input
          placeholder="Search by title"
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <select onChange={e => setSortBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="title">Title (A-Z)</option>
          <option value="type">Type</option>
        </select>

        <select onChange={e => setSortOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <button className="secondary" onClick={load}>
          Apply
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && docs.length === 0 && <p>No documents found.</p>}

      {docs.map(doc => (
        <div className="card" key={doc.id}>
          <h4>{doc.title}</h4>
          <p>
            {(doc.size / 1024).toFixed(1)} KB ·{" "}
            {new Date(doc.uploaded_at).toLocaleString()}
          </p>

          <button className="secondary" onClick={() => setPreview(doc)}>
            Preview
          </button>

          <a href={`http://localhost:8000/documents/${doc.id}/download`}>
            <button className="primary">Download</button>
          </a>

        <button
  className="secondary"
  onClick={async () => {
  await deleteDocument(doc.id);
  if (preview?.id === doc.id) {
    setPreview(null);
  }
  load();
}}
>
  Delete
</button>


        </div>
      ))}

      <div className="card">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {preview && (
        <PreviewModal doc={preview} onClose={() => setPreview(null)} />
      )}
    </>
  );
}
