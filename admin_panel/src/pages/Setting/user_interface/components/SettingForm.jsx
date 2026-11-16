import LoginBackgroundSettings from "./LoginBackgroundSettings";

import '../../../Workforce/Workforce.css';
import AttendanceSettings from '../../../AttendanceSettings/AttendanceSettings';
import { useEffect, useState } from 'react';
import { Settings, CalendarCheck, CreditCard, Star } from 'lucide-react';
import { useApp } from '../../../../Context/AppContext';
import { hasFeature } from '../../../../plans';
import { loadSettings, phoneDigits, saveSettingFields, getRestaurantUPISettings, putRestaurantUPISettings } from '../../services/settingService';
import style from '../style/setup.module.css';
import './settingsTabs.css';

export default function SettingForm() {
  const { Message, enableHeader } = useApp();
  const [activeTab, setActiveTab] = useState('restaurant');
  const [themes, setThemes] = useState([]);
  const [form, setForm] = useState({
    app_theme: '',
    whatsapp_number: '',
    allow_half_price: true,
    show_item_ratings_to_customers: false,
    cgst: '',
    sgst: '',
    gstin: '',
    fssaino: '',
  });
  const [upiForm, setUpiForm] = useState({ upi_id: '', payee_name: '', is_enabled: false });
  const [upiError, setUpiError] = useState('');
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiSaving, setUpiSaving] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const showWhatsapp = hasFeature('whatsapp');

  useEffect(() => {
    enableHeader();
    loadSettings().then((response) => {
      const setting = response.setting || {};
      setThemes(response.themeOptions || []);
      setForm({
        app_theme: setting.app_theme ? String(setting.app_theme) : '',
        whatsapp_number: phoneDigits(setting.whatsapp_number),
        allow_half_price: Boolean(setting.allow_half_price),
        show_item_ratings_to_customers: Boolean(setting.show_item_ratings_to_customers),
        cgst: setting.cgst ?? '',
        sgst: setting.sgst ?? '',
        gstin: setting.gstin || '',
        fssaino: setting.fssaino || '',
      });
    });
  }, []);

  useEffect(() => {
    getRestaurantUPISettings().then((response) => {
      setUpiForm({
        upi_id: response.upi_id || '',
        payee_name: response.payee_name || '',
        is_enabled: Boolean(response.is_enabled),
      });
    }).catch((err) => {
      setUpiError(err.userMessage || err.response?.data?.error || 'Unable to load UPI settings.');
    }).finally(() => setUpiLoading(false));
  }, []);

  async function saveUpi(event) {
    event.preventDefault();
    const upi_id = upiForm.upi_id.trim();
    const payee_name = upiForm.payee_name.trim();
    if (upiForm.is_enabled && (!upi_id.includes('@') || !payee_name)) {
      setUpiError('Enter a valid UPI ID and payee name to enable UPI payments.');
      return;
    }
    setUpiError('');
    setUpiSaving(true);
    try {
      await putRestaurantUPISettings({ upi_id, payee_name, is_enabled: upiForm.is_enabled });
      Message('UPI payment settings saved', 'success');
    } catch (err) {
      const reason = err.userMessage || err.response?.data?.error || 'Unable to save UPI settings.';
      setUpiError(reason);
      Message(reason, 'warning');
    } finally {
      setUpiSaving(false);
    }
  }

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event) {
    event.preventDefault();

    const cgst = form.cgst === '' ? 0 : Number(form.cgst);
    const sgst = form.sgst === '' ? 0 : Number(form.sgst);

    if (
      !Number.isFinite(cgst) ||
      cgst < 0 ||
      cgst >= 100 ||
      !Number.isFinite(sgst) ||
      sgst < 0 ||
      sgst >= 100
    ) {
      setError('CGST and SGST are percentages from 0 up to 99.');
      return;
    }

    if (form.gstin && form.gstin.trim().length !== 15) {
      setError('GSTIN is 15 characters, or leave it blank.');
      return;
    }

    if (form.fssaino && form.fssaino.trim().length !== 14) {
      setError('FSSAI number is 14 characters, or leave it blank.');
      return;
    }

    if (
      showWhatsapp &&
      form.whatsapp_number &&
      form.whatsapp_number.length !== 10
    ) {
      setError('WhatsApp number is 10 digits, or leave it blank.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const saved = await saveSettingFields({
        app_theme: form.app_theme || null,
        allow_half_price: form.allow_half_price,
        show_item_ratings_to_customers: form.show_item_ratings_to_customers,
        cgst,
        sgst,
        gstin: form.gstin.trim(),
        fssaino: form.fssaino.trim(),
        ...(showWhatsapp
          ? {
            whatsapp_number: form.whatsapp_number
              ? `+91${form.whatsapp_number}`
              : '',
          }
          : {}),
      });

      if (saved.ok) {
        Message('Settings saved', 'success');
        setThemes(saved.themes || []);
      } else {
        const reason = saved.error || 'Settings were not saved.';
        setError(reason);
        Message(reason, 'warning');
      }
    } catch (err) {
      setError('Unable to save restaurant settings.');
      Message('Unable to save restaurant settings.', 'warning');
    } finally {
      setSaving(false);
    }
  }

  async function saveRatingSettings(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const saved = await saveSettingFields({
        show_item_ratings_to_customers: form.show_item_ratings_to_customers,
      });
      if (saved.ok) {
        Message('Item rating settings saved', 'success');
      } else {
        const reason = saved.error || 'Item rating settings were not saved.';
        setError(reason);
        Message(reason, 'warning');
      }
    } catch (err) {
      setError('Unable to save item rating settings.');
      Message('Unable to save item rating settings.', 'warning');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="custom-screen-page-stack">
      <div className="restro-settings-tabs">
        <button
          type="button"
          className={`restro-settings-tab ${activeTab === 'restaurant' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('restaurant')}
          aria-pressed={activeTab === 'restaurant'}
        >
          <Settings size={18} strokeWidth={2} />
          <span>Restaurant Settings</span>
        </button>

        <button
          type="button"
          className={`restro-settings-tab ${activeTab === 'payment' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('payment')}
          aria-pressed={activeTab === 'payment'}
        >
          <CreditCard size={18} strokeWidth={2} />
          <span>Payment Settings</span>
        </button>
        <button
          type="button"
          className={`restro-settings-tab ${activeTab === 'attendance' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('attendance')}
          aria-pressed={activeTab === 'attendance'}
        >
          <CalendarCheck size={18} strokeWidth={2} />
          <span>Attendance Settings</span>
        </button>
        <button
          type="button"
          className={`restro-settings-tab ${activeTab === 'ratings' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('ratings')}
          aria-pressed={activeTab === 'ratings'}
        >
          <Star size={18} strokeWidth={2} />
          <span>Item Rating Settings</span>
        </button>
      </div>

      {activeTab === 'ratings' ? (
        <>
          <div className="page-header">
            <div className="page-header__title-wrap">
              <h2 className="page-header__title">Item Rating Settings</h2>
              <p className="page-header__subtitle">
                Control whether customers can see average item ratings on the QR menu.
                Item ratings always remain visible in the admin panel.
              </p>
            </div>
          </div>
          <section className="custom-screen-section custom-screen-section--form">
            <form className={style.form} onSubmit={saveRatingSettings}>
              <label className={`${style.check} ${style.wide}`}>
                <input
                  type="checkbox"
                  checked={form.show_item_ratings_to_customers}
                  onChange={(event) => setField('show_item_ratings_to_customers', event.target.checked)}
                />
                Show Item Ratings to Customers
              </label>
              <p className={style.wide}>
                When enabled, customers will see stars and average ratings beside menu items.
                The number of customer ratings will not be shown.
              </p>
              {error ? <div className={`${style.hint} ${style.wide}`}>{error}</div> : null}
              <div className={`${style.actions} ${style.wide}`}>
                <button className="desk-action" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Rating Settings'}
                </button>
              </div>
            </form>
          </section>
        </>
      ) : activeTab === 'attendance' ? (
        <AttendanceSettings />
      ) : activeTab === 'payment' ? (
        <>
          <div className="page-header">
            <div className="page-header__title-wrap">
              <h2 className="page-header__title">Payment Settings</h2>
              <p className="page-header__subtitle">
                Set the restaurant UPI account used for amount-specific customer QR payments.
                Payments remain pending until an authorized restaurant user verifies them.
              </p>
            </div>
          </div>
          <section className="custom-screen-section custom-screen-section--form">
            <form className={style.form} onSubmit={saveUpi}>
              <div className={style.field}>
                <label className="opt" htmlFor="restaurant-upi-id">UPI ID</label>
                <input
                  id="restaurant-upi-id"
                  autoComplete="off"
                  maxLength={255}
                  placeholder="restaurant@bank"
                  value={upiForm.upi_id}
                  onChange={(event) => setUpiForm((current) => ({ ...current, upi_id: event.target.value }))}
                />
              </div>
              <div className={style.field}>
                <label className="opt" htmlFor="restaurant-payee-name">Payee Name</label>
                <input
                  id="restaurant-payee-name"
                  maxLength={255}
                  placeholder="Restaurant / Account Holder"
                  value={upiForm.payee_name}
                  onChange={(event) => setUpiForm((current) => ({ ...current, payee_name: event.target.value }))}
                />
              </div>
              <label className={`${style.check} ${style.wide}`}>
                <input
                  type="checkbox"
                  checked={upiForm.is_enabled}
                  onChange={(event) => setUpiForm((current) => ({ ...current, is_enabled: event.target.checked }))}
                />
                Enable UPI QR payments
              </label>
              {upiError ? <div className={`${style.hint} ${style.wide}`}>{upiError}</div> : null}
              <div className={`${style.actions} ${style.wide}`}>
                <button className="desk-action" type="submit" disabled={upiSaving || upiLoading}>
                  {upiSaving ? 'Saving...' : 'Save UPI Settings'}
                </button>
              </div>
            </form>
          </section>
        </>
      ) : (
        <>
          <div className="page-header">
            <div className="page-header__title-wrap">
              <h2 className="page-header__title">Settings</h2>
              <p className="page-header__subtitle">
                Tax is added on every order. Half portions show on the menu
                and the order desk.
              </p>
            </div>
          </div>

          <section className="custom-screen-section custom-screen-section--form">
            <form className={style.form} onSubmit={save}>
              <div className={style.field}>
                <label className="opt" htmlFor="theme">
                  Menu colours
                </label>
                <select
                  id="theme"
                  value={form.app_theme || ''}
                  onChange={(event) =>
                    setField('app_theme', event.target.value)
                  }
                >
                  <option value="">Default</option>
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.background_color_label} / {theme.heading_color_label}
                    </option>
                  ))}
                </select>
              </div>

              {showWhatsapp ? (
                <div className={style.field}>
                  <label className="opt" htmlFor="whatsapp">
                    WhatsApp number
                  </label>
                  <input
                    id="whatsapp"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.whatsapp_number}
                    onChange={(event) =>
                      setField(
                        'whatsapp_number',
                        event.target.value.replace(/\D/g, '').slice(0, 10)
                      )
                    }
                  />
                </div>
              ) : null}

              <label className={`${style.check} ${style.wide}`}>
                <input
                  type="checkbox"
                  checked={form.allow_half_price}
                  onChange={(event) =>
                    setField('allow_half_price', event.target.checked)
                  }
                />
                Guests can order a half portion
              </label>

              <div className={style.field}>
                <label className="opt" htmlFor="cgst">
                  CGST %
                </label>
                <input
                  id="cgst"
                  inputMode="decimal"
                  value={form.cgst}
                  onChange={(event) =>
                    setField('cgst', event.target.value)
                  }
                />
              </div>

              <div className={style.field}>
                <label className="opt" htmlFor="sgst">
                  SGST %
                </label>
                <input
                  id="sgst"
                  inputMode="decimal"
                  value={form.sgst}
                  onChange={(event) =>
                    setField('sgst', event.target.value)
                  }
                />
              </div>

              <div className={style.field}>
                <label className="opt" htmlFor="gstin">
                  GSTIN
                </label>
                <input
                  id="gstin"
                  maxLength={15}
                  value={form.gstin}
                  onChange={(event) =>
                    setField('gstin', event.target.value.toUpperCase())
                  }
                />
              </div>

              <div className={style.field}>
                <label className="opt" htmlFor="fssai">
                  FSSAI number
                </label>
                <input
                  id="fssai"
                  maxLength={14}
                  value={form.fssaino}
                  onChange={(event) =>
                    setField('fssaino', event.target.value)
                  }
                />
              </div>

              {error ? (
                <div className={`${style.hint} ${style.wide}`}>
                  {error}
                </div>
              ) : null}

              <div className={`${style.actions} ${style.wide}`}>
                <button
                  className="desk-action"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save settings'}
                </button>
              </div>
            </form>
          </section>
          <LoginBackgroundSettings />
        </>
      )}
    </div>
  );
}
