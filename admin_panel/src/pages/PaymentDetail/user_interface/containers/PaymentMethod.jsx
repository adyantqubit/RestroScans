import { useEffect, useState } from "react";
import { explainFailure } from "../../../../http/http_client";
import { useApp } from "../../../../Context/AppContext";
import config from "../../../../config/config";
import { loadPaymentMethod, savePaymentMethod } from "../../services/paymentDetailService";
import style from "../../../Setting/user_interface/style/setup.module.css";

export default function PaymentMethod() {
  const { Message, enableHeader } = useApp();
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [scanner, setScanner] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    enableHeader();
    refresh();
  }, []);

  async function refresh() {
    const rows = await loadPaymentMethod();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) return;
    setId(row.id);
    setName(row.name || "");
    setPhone(row.contact_number || "");
    setScanner(row.scanner || "");
  }

  function chooseFile(event) {
    const next = event.target.files && event.target.files[0];
    if (!next) {
      setFile(null);
      setPreview("");
      return;
    }
    if (next.size > 200 * 1024) {
      setError("The QR image must be under 200 KB.");
      event.target.value = "";
      return;
    }
    setError("");
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  async function save(event) {
    event.preventDefault();
    if (phone && phone.length !== 10) {
      setError("Phone is 10 digits, or leave it blank.");
      return;
    }
    if (!id && !file) {
      setError("Add the QR image guests will scan.");
      return;
    }
    setError("");
    setSaving(true);
    const body = new FormData();
    if (id) body.append("id", id);
    body.append("name", name.trim());
    body.append("contact_number", phone);
    if (file) body.append("scanner", file);
    const tenant = JSON.parse(localStorage.getItem("tenantInfo") || "{}").tenant_name;
    const response = await savePaymentMethod(tenant, body);
    setSaving(false);
    if (response && response.msg) {
      Message("Payment QR saved", "success");
      setFile(null);
      setPreview("");
      refresh();
      return;
    }
    const reason = explainFailure(response, "The payment QR was not saved.");
    setError(reason);
    Message(reason, "warning");
  }

  const shown = preview || (scanner ? config.staticBaseURL + scanner : "");

  return (
    <div className="custom-screen-page-stack">
      <div className="page-header">
        <div className="page-header__title-wrap">
          <h2 className="page-header__title">Payments</h2>
          <p className="page-header__subtitle">The QR guests scan to pay. Cash still works without this.</p>
        </div>
      </div>
      <section className="custom-screen-section custom-screen-section--form">
        <form className={style.form} onSubmit={save}>
          <div className={style.field}>
            <label className="opt" htmlFor="payee">Name on the payment</label>
            <input id="payee" maxLength={255} value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className={style.field}>
            <label className="opt" htmlFor="pay-phone">Phone</label>
            <input id="pay-phone" inputMode="numeric" maxLength={10} value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} />
          </div>
          <div className={style.field}>
            <label className={scanner ? "opt" : "req"} htmlFor="pay-qr">QR image</label>
            <input id="pay-qr" type="file" accept="image/*" onChange={chooseFile} />
          </div>
          {shown ? (
            <div className={style.field}>
              <span className={style.choice}>Current QR</span>
              <img className={style.preview} alt="Payment QR" src={shown} />
            </div>
          ) : null}
          {error ? <div className={`${style.hint} ${style.wide}`}>{error}</div> : null}
          <div className={`${style.actions} ${style.wide}`}>
            <button className="desk-action" type="submit" disabled={saving}>{saving ? "Saving" : "Save payment"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
