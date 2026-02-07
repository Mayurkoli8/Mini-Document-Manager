export default function PreviewModal({ doc, onClose }) {
  const url = `http://localhost:8000/documents/${doc.id}/download`;
  const ext = doc.title.split(".").pop().toLowerCase();

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{doc.title}</h3>

        {["jpg", "jpeg", "png", "gif"].includes(ext) && (
          <img src={url} alt="" style={{ maxWidth: "100%" }} />
        )}

        {ext === "pdf" && <iframe src={url} width="100%" height="90%" />}

        {["txt", "md"].includes(ext) && (
          <iframe src={url} width="100%" height="90%" />
        )}

        {["doc", "docx"].includes(ext) && (
          <p>Preview not supported for DOC files. Please download.</p>
        )}

        <button className="secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
