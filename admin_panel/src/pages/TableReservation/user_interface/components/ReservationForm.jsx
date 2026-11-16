import { useEffect, useState } from "react";
import { explainFailure } from "../../../../http/http_client";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../../Context/AppContext";
import { homePath } from "../../../../plans";
import { loadDiningTables } from "../../../Tables/services/tablesService";
import { saveReservation } from "../../services/tableReservationService";
import style from "../style/book.module.css";

function clockValue(value) {
  return value ? String(value).slice(0, 5) : "";
}

function todayStamp() {
  const current = new Date();
  const month = String(current.getMonth() + 1).padStart(2, "0");
  const day = String(current.getDate()).padStart(2, "0");
  return `${current.getFullYear()}-${month}-${day}`;
}

const EMPTY = {
  name: "",
  contact_number: "",
  email: "",
  number_of_person: "2",
  table_number: "",
  date: "",
  time: "19:00",
  reservation_status: "Pending",
  special_instructions: "",
};

export default function ReservationForm({ embedded = false, record = null, onSaved, onClose }) {
  const { Message, enableHeader } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY, date: todayStamp() });
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!embedded) enableHeader();
    loadDiningTables().then((data) => setTables(data?.tables || [])).catch(() => setTables([]));
  }, [embedded]);

  useEffect(() => {
    if (!record) {
      setForm({ ...EMPTY, date: todayStamp() });
      setError("");
      return;
    }
    setForm({
      name: record.name || "",
      contact_number: record.contact_number || "",
      email: record.email || "",
      number_of_person: record.number_of_person || "",
      table_number: record.table_number || "",
      date: record.date || todayStamp(),
      time: clockValue(record.time) || "19:00",
      reservation_status: record.reservation_status || "Pending",
      special_instructions: record.special_instructions || "",
    });
    setError("");
  }, [record]);

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function finish() {
    if (embedded && onSaved) onSaved();
    else navigate(-1);
  }

  function cancel() {
    if (embedded && onClose) onClose();
    else navigate(homePath());
  }

  async function save(event) {
    event.preventDefault();
    const name = form.name.trim();
    const phone = form.contact_number.trim();
    const party = String(form.number_of_person || "").trim();
    if (!name) {
      setError("Enter the guest name.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a 10-digit phone number.");
      return;
    }
    if (!party || Number(party) < 1) {
      setError("Enter how many guests are coming.");
      return;
    }
    if (!form.date || !form.time) {
      setError("Choose the date and time.");
      return;
    }
    if (form.email && !form.email.includes("@")) {
      setError("Email needs an @, or leave it blank.");
      return;
    }
    setError("");
    setSaving(true);
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await saveReservation(tenant, {
      ...(record && record.id ? { id: record.id } : {}),
      name,
      contact_number: phone,
      email: form.email.trim() || null,
      number_of_person: party,
      table_number: form.table_number,
      date: form.date,
      time: form.time,
      reservation_status: form.reservation_status || "Pending",
      special_instructions: form.special_instructions.trim(),
    });
    setSaving(false);
    if (response && response.msg === "Saved Successfully") {
      Message("Booking saved", "success");
      finish();
      return;
    }
    const reason = explainFailure(response, "This booking was not saved.");
    setError(reason);
    Message(reason, "warning");
  }

  const knownTables = tables.filter((table) => table.is_active);
  const extraTable = form.table_number && !knownTables.some((table) => table.name === form.table_number)
    ? form.table_number
    : "";

  const fields = (
    <form className={style.form} onSubmit={save}>
      <div className={style.field}>
        <label className="req" htmlFor="booking-name">Guest</label>
        <input id="booking-name" value={form.name} maxLength={255} onChange={(event) => setField("name", event.target.value)} />
      </div>
      <div className={style.field}>
        <label className="req" htmlFor="booking-phone">Phone</label>
        <input id="booking-phone" inputMode="numeric" maxLength={10} value={form.contact_number} onChange={(event) => setField("contact_number", event.target.value.replace(/\D/g, "").slice(0, 10))} />
      </div>
      <div className={style.field}>
        <label className="req" htmlFor="booking-party">Guests</label>
        <input id="booking-party" inputMode="numeric" min="1" value={form.number_of_person} onChange={(event) => setField("number_of_person", event.target.value.replace(/\D/g, "").slice(0, 3))} />
      </div>
      <div className={style.field}>
        <label className="opt" htmlFor="booking-table">Table</label>
        <select id="booking-table" value={form.table_number} onChange={(event) => setField("table_number", event.target.value)}>
          <option value="">Unassigned</option>
          {extraTable ? <option value={extraTable}>{extraTable}</option> : null}
          {knownTables.map((table) => (
            <option key={table.id} value={table.name}>{table.name} · {table.seats} seats</option>
          ))}
        </select>
      </div>
      <div className={style.field}>
        <label className="req" htmlFor="booking-date">Date</label>
        <input id="booking-date" type="date" value={form.date || ""} onChange={(event) => setField("date", event.target.value)} />
      </div>
      <div className={style.field}>
        <label className="req" htmlFor="booking-time">Time</label>
        <input id="booking-time" type="time" value={form.time || ""} onChange={(event) => setField("time", event.target.value)} />
      </div>
      <div className={style.field}>
        <label className="req" htmlFor="booking-status">Status</label>
        <select id="booking-status" value={form.reservation_status} onChange={(event) => setField("reservation_status", event.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Confirm">Confirmed</option>
        </select>
      </div>
      <div className={style.field}>
        <label className="opt" htmlFor="booking-email">Email</label>
        <input id="booking-email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} placeholder="Optional" />
      </div>
      <div className={`${style.field} ${style.wide}`}>
        <label className="opt" htmlFor="booking-note">Note</label>
        <input id="booking-note" value={form.special_instructions} onChange={(event) => setField("special_instructions", event.target.value)} placeholder="Birthday, high chair, window seat" />
      </div>
      {error ? <div className={`${style.hint} ${style.wide}`}>{error}</div> : null}
      <div className={`${style.actions} ${style.wide}`}>
        <button className="desk-action" type="submit" disabled={saving}>{saving ? "Saving" : "Save booking"}</button>
        <button className="desk-action desk-action--quiet" type="button" onClick={cancel}>Cancel</button>
      </div>
    </form>
  );

  if (embedded) return fields;
  return (
    <div className="custom-screen-page-stack">
      <div className="page-header">
        <div className="page-header__title-wrap">
          <h2 className="page-header__title">{record ? "Edit booking" : "New booking"}</h2>
        </div>
      </div>
      <section className="custom-screen-section custom-screen-section--form">{fields}</section>
    </div>
  );
}
