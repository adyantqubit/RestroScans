import { useEffect, useState } from "react";
import { useApp } from "../../../../Context/AppContext";
import { loadSettings, saveSettingFields } from "../../services/settingService";
import style from "../style/setup.module.css";

export default function LoyaltySetup() {
  const { Message, enableHeader } = useApp();
  const [enabled, setEnabled] = useState(false);
  const [earnEvery, setEarnEvery] = useState("");
  const [pointValue, setPointValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    enableHeader();
    loadSettings().then((response) => {
      const setting = response.setting || {};
      setEnabled(Boolean(setting.allow_loyality_points));
      setEarnEvery(setting.amount_for_single_loyality_point || "");
      setPointValue(setting.per_loyality_point_value || "");
    });
  }, []);

  const spend = Number(earnEvery);
  const worth = Number(pointValue);
  const example = enabled && spend > 0 && worth > 0
    ? `A ₹${spend * 10} bill earns 10 points, worth ₹${worth * 10} off a later bill.`
    : "Turn points on, then set how guests earn them and what they are worth.";

  async function save(event) {
    event.preventDefault();
    if (enabled && (!Number.isInteger(spend) || spend <= 0 || !Number.isInteger(worth) || worth <= 0)) {
      setError("Both amounts are whole rupees greater than 0.");
      return;
    }
    setError("");
    setSaving(true);
    const saved = await saveSettingFields({
      allow_loyality_points: enabled,
      amount_for_single_loyality_point: enabled ? spend : 0,
      per_loyality_point_value: enabled ? worth : 0,
    });
    setSaving(false);
    if (saved.ok) {
      Message(enabled ? "Loyalty saved. Paid orders earn these points, and open orders can spend them." : "Loyalty is off. Orders will not earn or spend points.", "success");
      return;
    }
    const reason = saved.error || "Loyalty was not saved.";
    setError(reason);
    Message(reason, "warning");
  }

  return (
    <div className="custom-screen-page-stack">
      <div className="page-header">
        <div className="page-header__title-wrap">
          <h2 className="page-header__title">Loyalty</h2>
          <p className="page-header__subtitle">A paid order earns these points. An open order can spend them.</p>
        </div>
      </div>
      <section className="custom-screen-section custom-screen-section--form">
        <form className={style.form} onSubmit={save}>
          <label className={`${style.check} ${style.wide}`}>
            <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
            Guests earn points
          </label>
          <div className={style.field}>
            <label className={enabled ? "req" : "opt"} htmlFor="earn-every">Rupees spent for 1 point</label>
            <input id="earn-every" inputMode="numeric" disabled={!enabled} value={earnEvery} onChange={(event) => setEarnEvery(event.target.value.replace(/\D/g, ""))} />
          </div>
          <div className={style.field}>
            <label className={enabled ? "req" : "opt"} htmlFor="point-value">Rupees off for 1 point</label>
            <input id="point-value" inputMode="numeric" disabled={!enabled} value={pointValue} onChange={(event) => setPointValue(event.target.value.replace(/\D/g, ""))} />
          </div>
          <p className={`${style.example} ${style.wide}`}>{example}</p>
          {error ? <div className={`${style.hint} ${style.wide}`}>{error}</div> : null}
          <div className={`${style.actions} ${style.wide}`}>
            <button className="desk-action" type="submit" disabled={saving}>{saving ? "Saving" : "Save loyalty"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
