import { useState } from "react";

export default function UploadForm({ onUpload }) {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    Array.from(files).forEach(f => formData.append("files", f));

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      setProgress(0);
      setFiles([]);
      onUpload();
    };

    xhr.open("POST", "http://localhost:8000/documents");
    xhr.send(formData);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Upload Documents</h3>
      <input type="file" multiple onChange={e => setFiles(e.target.files)} />
      <button className="primary">Upload</button>

      {progress > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ width: `${progress}%`, height: 8, background: "#4f46e5" }} />
          <small>{progress}%</small>
        </div>
      )}
    </form>
  );
}
