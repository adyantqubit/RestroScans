
import React, { useCallback, useEffect, useState } from 'react';
import httpClient from '../../http/http_client';
import style from '../Setting/user_interface/style/setup.module.css';

const endpoint = '/api/v1/workforce/settings/';

const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const leaveTypes = [
  ['paid_leaves_per_year', 'Annual Paid Leave (PL / EL)'],
  ['casual_leaves_per_year', 'Casual Leave (CL)'],
  ['sick_leaves_per_year', 'Sick Leave (SL)'],
  ['medical_leaves_per_year', 'Medical Leave (ML)'],
];

export default function AttendanceSettings() {
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await httpClient.get(endpoint);
      setSettings(response.data);
      setError('');
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        'Unable to load attendance settings.'
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSuccess('');
  };

  const changeWeekDay = (day, checked) => {
    setSettings((prev) => {
      const current = prev.week_off_days || [];
      return {
        ...prev,
        week_off_days: checked
          ? [...current.filter((item) => item !== day), day]
          : current.filter((item) => item !== day),
      };
    });
    setSuccess('');
  };

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');

    try {
      const response = await httpClient.put(endpoint, settings);
      setSettings(response.data);
      setSuccess('Attendance & Leave settings saved successfully.');
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        'Unable to save attendance settings.'
      );
    } finally {
      setBusy(false);
    }
  }

  const field = (key, label, options = {}) => (
    <div className={style.field} key={key}>
      <label htmlFor={`attendance-${key}`}>{label}</label>
      <input
        id={`attendance-${key}`}
        type="number"
        min={options.min ?? 0}
        max={options.max ?? 365}
        step={options.step ?? 1}
        required
        value={settings[key] ?? 0}
        onChange={(event) =>
          change(key, event.target.value)
        }
      />
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="page-header__title-wrap">
          <h2 className="page-header__title">
            Attendance & Leave Settings
          </h2>
          <p className="page-header__subtitle">
            Configure working hours, salary calculation, weekly offs
            and yearly leave allowances for your restaurant.
          </p>
        </div>
      </div>

      <section className="custom-screen-section custom-screen-section--form">
        {error && (
          <div
            role="alert"
            style={{
              padding: '12px 16px',
              marginBottom: 16,
              background: '#fff0f0',
              color: '#b42318',
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            style={{
              padding: '12px 16px',
              marginBottom: 16,
              background: '#eaf8f1',
              color: '#067647',
              borderRadius: 8,
            }}
          >
            {success}
          </div>
        )}

        {!settings ? (
          <p>Loading attendance settings...</p>
        ) : (
          <form className={style.form} onSubmit={save}>
            {field('male_hours', 'Male Working Hours', {
              min: 0.5,
              max: 24,
              step: 0.5,
            })}

            {field('female_hours', 'Female Working Hours', {
              min: 0.5,
              max: 24,
              step: 0.5,
            })}

            {field('other_hours', 'Other Working Hours', {
              min: 0.5,
              max: 24,
              step: 0.5,
            })}

            <div className={style.field}>
              <label htmlFor="attendance-salary-mode">
                Salary Mode
              </label>
              <select
                id="attendance-salary-mode"
                value={settings.salary_mode}
                onChange={(event) =>
                  change('salary_mode', event.target.value)
                }
              >
                <option value="day">Day Based</option>
                <option value="hour">Hour Based</option>
              </select>
            </div>

            <div className={style.field}>
              <label htmlFor="attendance-week-off">
                Week Off Policy
              </label>
              <select
                id="attendance-week-off"
                value={settings.week_off_mode || 'flexible'}
                onChange={(event) =>
                  change('week_off_mode', event.target.value)
                }
              >
                <option value="flexible">
                  Flexible Monthly Off
                </option>
                <option value="fixed">
                  Fixed Weekly Off
                </option>
              </select>
            </div>

            {settings.week_off_mode !== 'fixed' ? (
              field('monthly_off_quota', 'Paid Off Days / Month', {
                min: 0,
                max: 31,
              })
            ) : (
              <div className={style.wide}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Fixed Weekly Off Days
                </label>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  {weekDays.map((day) => (
                    <label
                      key={day}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={(settings.week_off_days || []).includes(day)}
                        onChange={(event) =>
                          changeWeekDay(day, event.target.checked)
                        }
                        style={{
                          width: 17,
                          height: 17,
                        }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div
              className={style.wide}
              style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: 20,
                marginTop: 10,
              }}
            >
              <h3
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: '#102b49',
                  margin: '0 0 6px',
                }}
              >
                Yearly Leave Allowances
              </h3>

              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                Set annual leave limits for each category.
                Enter 0 to disable a paid leave type.
                Unpaid leave remains available.
              </p>
            </div>

            {leaveTypes.map(([key, label]) =>
              field(key, label, {
                min: 0,
                max: 365,
              })
            )}

            <div
              className={style.wide}
              style={{
                padding: '12px 14px',
                background: '#f1f6fa',
                borderRadius: 8,
                color: '#47627d',
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Flexible unused offs carry forward only within
              the calendar year and expire on 31 December.
              Unused leave does not increase salary.
            </div>

            <div className={`${style.actions} ${style.wide}`}>
              <button
                className="desk-action"
                type="submit"
                disabled={busy}
              >
                {busy ? 'Saving...' : 'Save settings'}
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}
