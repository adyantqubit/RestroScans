import { useEffect, useState } from "react";
import { useApp } from "../../../../Context/AppContext";
import { loadSettings, saveSettingFields } from "../../services/settingService";
import style from "../style/setup.module.css";

const RUPEES = "Discount in (₹)";
const PERCENT = "Discount in (%)";

export default function DiscountSetup() {
  const { Message, enableHeader } = useApp();
  const [mode, setMode] = useState(RUPEES);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    enableHeader();
    loadSettings().then((response) => {
      const current = response.setting && response.setting.discount_in;
      setMode(current === PERCENT ? PERCENT : RUPEES);
    });
  }, []);

  async function save(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const saved = await saveSettingFields({ discount_in: mode });
    setSaving(false);
    if (saved.ok) {
      Message("Discount saved. New orders use this on the bill.", "success");
      return;
    }
    const reason = saved.error || "The discount was not saved.";
    setError(reason);
    Message(reason, "warning");
  }

  const percent = mode === PERCENT;

  return (
    <div className="custom-screen-page-stack">
      <div className="page-header">
        <div className="page-header__title-wrap">
          <h2 className="page-header__title">Discount</h2>
          <p className="page-header__subtitle">Orders use this when staff take money off a bill. Dish prices come from Offers.</p>
        </div>
      </div>
      <section className="custom-screen-section custom-screen-section--form">
        <form className={style.form} onSubmit={save}>
          <label className={`${style.choice} ${style.wide}`}>
            <input type="radio" name="discount-mode" checked={!percent} onChange={() => setMode(RUPEES)} />
            Rupees off the bill
          </label>
          <label className={`${style.choice} ${style.wide}`}>
            <input type="radio" name="discount-mode" checked={percent} onChange={() => setMode(PERCENT)} />
            Percent off the bill
          </label>
          {error ? <div className={`${style.hint} ${style.wide}`}>{error}</div> : null}
          <p className={`${style.example} ${style.wide}`}>
            {percent
              ? "On a ₹500 bill, 10% takes off ₹50."
              : "On a ₹500 bill, ₹50 takes off ₹50."}
          </p>
          <div className={`${style.actions} ${style.wide}`}>
            <button className="desk-action" type="submit" disabled={saving}>{saving ? "Saving" : "Save discount"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
