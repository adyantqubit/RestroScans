import React, { useEffect, useRef, useState } from "react";
import httpClient from "../../../../http/http_client";

const endpoint = "/api/v1/login-background/";

export default function LoginBackgroundSettings() {
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const fileInput = useRef(null);

  async function reload() {
    try {
      const { data } = await httpClient.get(endpoint, { params: { _t: Date.now() } });
      setImage(data?.configured ? data.image_url || "" : "");
      return Boolean(data?.configured);
    } catch (error) {
      setMessage(error.response?.data?.error || "Unable to load saved background.");
      return false;
    }
  }
  useEffect(() => { reload(); }, []);

  async function upload(event) {
    event.preventDefault();
    if (!file || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const body = new FormData();
      body.append("image", file);
      const { data } = await httpClient.post(endpoint, body);
      if (!data?.configured) throw new Error("Server did not confirm saving the photo.");
      const persisted = await reload();
      if (!persisted) throw new Error("Photo was uploaded but could not be retrieved after saving.");
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      setMessage("Photo saved and verified. It will appear on Admin and Staff login.");
    } catch (error) {
      setMessage(error.response?.data?.error || error.message || "Unable to save photo.");
    } finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm("Remove login background?")) return;
    setBusy(true);
    try {
      await httpClient.delete(endpoint);
      setImage("");
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      setMessage("Photo removed.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Unable to remove photo.");
    } finally { setBusy(false); }
  }
  return <section style={{ background: "#fff", padding: 24, border: "1px solid #e2e8f0", borderRadius: 16, marginTop: 20 }}>
    <h2>Login Page Background</h2>
    <p>Upload a restaurant photo for both Admin and Staff login pages. Your photo is saved in this restaurant's database.</p>
    {image ? <img src={image} alt="Saved login background" style={{ width: "100%", maxWidth: 520, maxHeight: 260, objectFit: "cover", borderRadius: 12 }} /> : <p>No photo saved yet.</p>}
    <form onSubmit={upload} style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} required />
      <button type="submit" disabled={busy || !file} style={{ background: "#078c96", color: "#fff", border: 0, borderRadius: 8, padding: "11px 16px", cursor: "pointer" }}>{busy ? "Saving..." : "Upload Background"}</button>
      {image && <button type="button" disabled={busy} onClick={remove} style={{ padding: "11px 16px", borderRadius: 8, border: "1px solid #cbd5e1", cursor: "pointer" }}>Remove Photo</button>}
    </form>
    <small>JPG, PNG or WEBP, max 5 MB. Recommended 1600 × 900.</small>
    {message && <p role="status">{message}</p>}
  </section>;
}
