"use client"

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");

  const BACKEND_BASE = "http://127.0.0.1:8000";

  const handleDownload = async () => {
    if (!link) return alert("Please paste a video link");

    setLoading(true);
    setDownloadUrl(null);
    setTitle("");

    try {
      const form = new FormData();
      form.append("url", link);

      const resp = await axios.post(`${BACKEND_BASE}/download`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (resp.data.status === "success") {
        setDownloadUrl(`${BACKEND_BASE}/file/${resp.data.filename}`);
        setTitle(resp.data.title || "Video");
      } else {
        alert("Error: " + resp.data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>Video Downloader (Next.js + Python)</h1>
      <input
        type="text"
        placeholder="Paste video URL"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Downloading..." : "Download"}
      </button>

      {downloadUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>{title}</h3>
          <a href={downloadUrl} download>
            Click here to download
          </a>
        </div>
      )}
    </div>
  );
}
