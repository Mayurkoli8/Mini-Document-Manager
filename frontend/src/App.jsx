import { useState } from "react";
import UploadForm from "./components/UploadForm";
import DocumentList from "./components/DocumentList";
import "./App.css";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="container">
      <h1>Mini Document Manager</h1>

      <UploadForm onUpload={() => setRefreshKey(k => k + 1)} />

      <DocumentList refreshKey={refreshKey} />
    </div>
  );
}
