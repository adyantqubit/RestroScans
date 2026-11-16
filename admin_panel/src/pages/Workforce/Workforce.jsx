
import React, { useCallback, useEffect, useState } from 'react';
import httpClient from '../../http/http_client';
import './Workforce.css';
import { captureAttendanceLocation } from '../../utils/attendanceLocation';
import { AttendanceAddress } from '../../utils/attendanceAddress';

const api = '/api/v1/workforce/';
const today = new Date().toISOString().slice(0, 10);
const currentMonth = today.slice(0, 7);
const PAGE_SIZE = 5;

const STAFF_PERMISSIONS = [
    ['orders', 'Orders'],
    ['order_history', 'Order History'],
    ['tables', 'Tables'],
    ['kitchen', 'Kitchen / KOT'],
    ['items', 'Items'],
    ['billing', 'Billing'],
    ['reservations', 'Reservations'],
    ['customers', 'Customers'],
    ['reports', 'Reports'],
    ['payments', 'Payments'],
    ['loyalty', 'Loyalty'],
    ['expenses', 'Expenses']
];

const blankEmployee = {
    name: '',
    phone: '',
    role: '',
    gender: 'Other',
    monthly_salary: '',
    employment_type: 'Permanent',
    joining_date: today,
    is_active: true,
    can_approve: false,
    access_permissions: [],
    enable_staff_login: false,
    login_password: ''
};

function Pagination({ total, page, onChange }) {
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    if (pages <= 1) {
        return (
            <div className="workforcePager workforcePagerSingle">
                Showing {total} record{total === 1 ? '' : 's'}
            </div>
        );
    }

    return (
        <div className="workforcePager">
            <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </span>
            <div>
                <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
                    Previous
                </button>
                <span>Page {page} of {pages}</span>
                <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}

function message(error) {
    return error?.response?.data?.error ||
        error?.response?.data?.detail ||
        'Request failed. Please try again.';
}


function displayDate(value) {
    if (!value) return '';
    const raw = String(value).slice(0, 10);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

function parseDisplayDate(value) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (date.getFullYear() !== Number(yyyy) || date.getMonth() !== Number(mm) - 1 || date.getDate() !== Number(dd)) return null;
    return `${yyyy}-${mm}-${dd}`;
}

function WorkforceDateInput({ value, onChange, required = false, disabled = false }) {
    const [draft, setDraft] = useState(displayDate(value));
    const pickerRef = React.useRef(null);
    useEffect(() => setDraft(displayDate(value)), [value]);
    const commit = () => {
        const parsed = parseDisplayDate(draft);
        if (parsed) onChange(parsed);
        else setDraft(displayDate(value));
    };
    return (
        <div className="workforceDateInput">
            <input
                type="text"
                inputMode="numeric"
                placeholder="DD/MM/YYYY"
                value={draft}
                disabled={disabled}
                required={required}
                onChange={e => {
                    const next = e.target.value;
                    setDraft(next);
                    const parsed = parseDisplayDate(next);
                    if (parsed) onChange(parsed);
                }}
                onBlur={commit}
                aria-label="Date (DD/MM/YYYY)"
            />
            <input ref={pickerRef} className="workforceNativeDate" type="date" value={value || ''}
                disabled={disabled} tabIndex={-1} aria-hidden="true"
                onChange={e => onChange(e.target.value)} />
            <button type="button" className="workforceCalendarButton" disabled={disabled}
                aria-label="Choose date" onClick={() => {
                    if (pickerRef.current?.showPicker) pickerRef.current.showPicker();
                    else pickerRef.current?.focus();
                }}>▦</button>
        </div>
    );
}

export default function Workforce() {
    const [tab, setTab] = useState('Leaves');
    const [isOwner, setIsOwner] = useState(false);
    const [canApprove, setCanApprove] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [offBalances, setOffBalances] = useState({});
    const [attendanceMonth, setAttendanceMonth] = useState(currentMonth);
    const [attendanceEmployee, setAttendanceEmployee] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState('');
    const [employeeSearch, setEmployeeSearch] = useState('');
    const [employeeJoinMonth, setEmployeeJoinMonth] = useState('');
    const [employeeStatus, setEmployeeStatus] = useState('');
    const [leaveMonth, setLeaveMonth] = useState(currentMonth);
    const [leaveEmployee, setLeaveEmployee] = useState('');
    const [leaveStatus, setLeaveStatus] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [salaryFilterMonth, setSalaryFilterMonth] = useState(currentMonth);
    const [salaryEmployee, setSalaryEmployee] = useState('');
    const [pages, setPages] = useState({
        Employees: 1,
        Attendance: 1,
        Leaves: 1,
        Salary: 1
    });

    const changePage = (name, value) => {
        setPages(prev => ({ ...prev, [name]: value }));
    };

    const resetPage = (name) => changePage(name, 1);

    const [leaves, setLeaves] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [settings, setSettings] = useState({
        male_hours: '10',
        female_hours: '8',
        other_hours: '8',
        salary_mode: 'day',
        paid_leaves_per_year: 12,
        week_off_mode: 'flexible',
        monthly_off_quota: 4,
        week_off_days: ['Sunday']
    });
    const [employee, setEmployee] = useState({ ...blankEmployee });
    const [editingId, setEditingId] = useState(null);
    const [selected, setSelected] = useState('');
    const [day, setDay] = useState(today);
    const [clock, setClock] = useState(new Date().toTimeString().slice(0, 5));
    const [dayFraction, setDayFraction] = useState('Full');
    const [advances, setAdvances] = useState([]);
    const [salaryPayments, setSalaryPayments] = useState([]);
    const [expandedSalaryRow, setExpandedSalaryRow] = useState('');
    const [salaryFormOpen, setSalaryFormOpen] = useState(false);
    const [salaryAction, setSalaryAction] = useState('salary');
    const [salarySearch, setSalarySearch] = useState('');
    const [salaryStatus, setSalaryStatus] = useState('');
    const [salaryFormEmployee, setSalaryFormEmployee] = useState('');
    const [salaryCalculating, setSalaryCalculating] = useState(false);
    const combinedSalaryRegister = (() => {
        const groups = new Map();
        const getGroup = (employeeId, employee, month, year) => {
            const key = `${employeeId}-${year}-${month}`;
            if (!groups.has(key)) groups.set(key, { key, employee_id: employeeId, employee, month, year, payroll: null, gross: 0, advance: 0, salaryPaid: 0, remaining: 0, transactions: [] });
            return groups.get(key);
        };
        payroll.forEach(p => {
            const r = getGroup(p.employee_id, p.employee, Number(p.month), Number(p.year));
            r.payroll = p;
            r.gross = Number(p.gross_salary ?? p.calculated_salary) || 0;
            r.remaining = Number(p.remaining_amount ?? p.calculated_salary) || 0;
        });
        advances.forEach(a => {
            const [year, month] = String(a.date).split('-').map(Number);
            const r = getGroup(a.employee_id, a.employee, month, year);
            const amount = Number(a.amount) || 0;
            r.advance += amount;
            r.transactions.push({ key: `advance-${a.id}`, date: a.date, type: 'Salary Advance', amount, mode: '—', remark: a.remark || '' });
        });
        salaryPayments.forEach(p => {
            const r = getGroup(p.employee_id, p.employee, Number(p.month), Number(p.year));
            const amount = Number(p.amount) || 0;
            r.salaryPaid += amount;
            r.transactions.push({ key: `salary-${p.id}`, date: p.payment_date, type: 'Monthly Salary', amount, mode: p.payment_mode || '—', remark: p.remark || '' });
        });
        return [...groups.values()].map(r => ({ ...r, transactions: r.transactions.sort((a, b) => a.date.localeCompare(b.date) || a.key.localeCompare(b.key)) }))
            .sort((a, b) => b.year - a.year || b.month - a.month || a.employee.localeCompare(b.employee));
    })();

    const [payingPayroll, setPayingPayroll] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [paymentDate, setPaymentDate] = useState(today);
    const [paymentRemark, setPaymentRemark] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState('');
    const [advanceDate, setAdvanceDate] = useState(today);
    const [advanceRemark, setAdvanceRemark] = useState('');
    const [leave, setLeave] = useState({
        leave_type: 'Paid',
        start_date: today,
        end_date: today,
        reason: ''
    });
    const [month, setMonth] = useState(currentMonth);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        try {
            const a = await httpClient.get(api + 'employees/');
            const c = await httpClient.get(api + 'leaves/', {
                params: { month: leaveMonth }
            });

            const employeeRows = a.data.results || [];
            setEmployees(employeeRows);
            setLeaves(c.data.results || []);

            const results = await Promise.allSettled([
                httpClient.get(api + 'settings/'),
                httpClient.get(api + 'attendance/', {
                    params: { month: attendanceMonth }
                }),
                httpClient.get(api + 'payroll/', {
                    params: { month: salaryFilterMonth }
                })
            ]);

            const own = results[0].status === 'fulfilled';
            setIsOwner(own);
            setCanApprove(own);

            if (own) {
                setSettings(results[0].value.data);

                if (results[1].status === 'fulfilled') {
                    setAttendance(results[1].value.data.results || []);
                    setOffBalances(results[1].value.data.off_balances || {});
                }

                if (results[2].status === 'fulfilled') {
                    setPayroll(results[2].value.data.results || []);
                    setAdvances(results[2].value.data.advances || []);
                    setSalaryPayments(results[2].value.data.payments || []);
                }
            }
        } catch (err) {
            setError(message(err));
        }
    }, [attendanceMonth, leaveMonth, salaryFilterMonth]);

    useEffect(() => {
        load();
    }, [load]);

    const run = async (task, successMessage, onSuccess) => {
        setBusy(true);
        setError('');
        setSuccess('');

        try {
            await task();
            if (onSuccess) onSuccess();
            setSuccess(successMessage);
            await load();
        } catch (err) {
            setError(message(err));
        } finally {
            setBusy(false);
        }
    };

    const pick = (field, value) => {
        setEmployee(prev => ({ ...prev, [field]: value }));
    };

    const selectedEmployee = selected ||
        (employees.find(e => e.is_active)
            ? String(employees.find(e => e.is_active).id)
            : '');

    const resetEmployee = () => {
        setEditingId(null);
        setEmployee({ ...blankEmployee });
    };

    const editEmployee = record => {
        setEditingId(record.id);
        setEmployee({
            name: record.name,
            phone: record.phone || '',
            role: record.role || '',
            gender: record.gender,
            monthly_salary: record.monthly_salary,
            employment_type: record.employment_type || 'Permanent',
            joining_date: record.joining_date,
            is_active: Boolean(record.is_active),
            can_approve: Boolean(record.can_approve),
            access_permissions: record.access_permissions || [],
            enable_staff_login: Boolean(record.staff_login_enabled),
            login_password: ''
        });
        setError('');
        setSuccess('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const saveEmployee = event => {
        event.preventDefault();

        const payload = {
            name: employee.name,
            phone: employee.phone,
            role: employee.role,
            gender: employee.gender,
            monthly_salary: employee.monthly_salary,
            employment_type: employee.employment_type,
            is_active: employee.is_active,
            can_approve: employee.can_approve,
            access_permissions: employee.access_permissions || [],
            enable_staff_login: employee.enable_staff_login,
            login_password: employee.login_password
        };

        run(
            () => editingId
                ? httpClient.patch(api + `employees/${editingId}/`, payload)
                : httpClient.post(api + 'employees/', {
                    ...payload,
                    joining_date: employee.joining_date
                }),
            editingId ? 'Employee updated successfully' : 'Employee added successfully',
            resetEmployee
        );
    };

    const filteredEmployees = employees.filter(e =>
        (!employeeSearch ||
            [e.name, e.role, e.phone].some(v =>
                String(v || '').toLowerCase().includes(employeeSearch.toLowerCase())
            )) &&
        (!employeeJoinMonth || e.joining_date.startsWith(employeeJoinMonth)) &&
        (!employeeStatus ||
            (employeeStatus === 'Active' ? e.is_active : !e.is_active))
    );

    const filteredLeaves = leaves.filter(x =>
        (!leaveEmployee || String(x.employee_id) === leaveEmployee) &&
        (!leaveStatus || x.status === leaveStatus) &&
        (!leaveType || x.leave_type === leaveType)
    );

    const filteredPayroll = payroll.filter(p =>
        !salaryEmployee || String(p.employee_id) === salaryEmployee
    );

    const pageRows = (items, name) =>
        items.slice((pages[name] - 1) * PAGE_SIZE, pages[name] * PAGE_SIZE);

    const filteredAttendance = attendance.filter(a =>
        (!attendanceEmployee || String(a.employee_id) === attendanceEmployee) &&
        (!attendanceMonth || a.date.startsWith(attendanceMonth)) &&
        (!attendanceStatus || a.status === attendanceStatus)
    );

    const balance = offBalances[String(selectedEmployee)] || {
        earned: 0,
        used: 0,
        remaining: 0
    };

    return (
        <main className="workforce">
            <style>{`.workforceLabelText { display: inline-flex; align-items: baseline; gap: 3px; width: max-content; max-width: 100%; } .workforceRequired { color: #dc2626; font-weight: 700; }`}</style>
            <header className="workforceHeader">
                <div>
                    <p>Restaurant operations</p>
                    <h1>Staff & Payroll</h1>
                    <span>Manage employees, attendance, leaves and salaries for this restaurant.</span>
                </div>
                <button onClick={load}>Refresh</button>
            </header>

            <nav className="workforceTabs">
                {(isOwner
                    ? ['Employees', 'Attendance', 'Leaves', 'Salary']
                    : canApprove
                        ? ['Leaves']
                        : ['Leaves']
                ).map(name => (
                    <button
                        key={name}
                        className={tab === name ? 'active' : ''}
                        onClick={() => {
                            setTab(name);
                            setError('');
                            setSuccess('');
                        }}
                    >
                        {name}
                    </button>
                ))}
            </nav>

            {error && <div className="workforceError" role="alert">{error}</div>}
            {success && <div className="workforceSuccess" role="status">{success}</div>}

            {isOwner && tab === 'Employees' && (
                <section className="workforceCard">
                    <h2>{editingId ? 'Edit Employee' : 'Add Employee'}</h2>

                    <form onSubmit={saveEmployee}>
                        <div className="workforceGrid">
                            <label>
                                <span className="workforceLabelText">Name <span className="workforceRequired" aria-hidden="true">*</span></span>
                                <input
                                    required
                                    value={employee.name}
                                    onChange={e => pick('name', e.target.value)}
                                />
                            </label>

                            <label>
                                Phone
                                <input
                                    value={employee.phone}
                                    onChange={e => pick('phone', e.target.value)}
                                />
                            </label>

                            <label>
                                Role
                                <input
                                    value={employee.role}
                                    onChange={e => pick('role', e.target.value)}
                                />
                            </label>

                            <label>
                                Gender
                                <select
                                    value={employee.gender}
                                    onChange={e => pick('gender', e.target.value)}
                                >
                                    {['Male', 'Female', 'Other'].map(v => (
                                        <option key={v}>{v}</option>
                                    ))}
                                </select>
                            </label>


                            <label>
                                <span className="workforceLabelText">Monthly Salary <span className="workforceRequired" aria-hidden="true">*</span></span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={employee.monthly_salary}
                                    onChange={e => pick('monthly_salary', e.target.value)}
                                />
                            </label>

                            <label>
                                <span className="workforceLabelText">Joining Date <span className="workforceRequired" aria-hidden="true">*</span></span>
                                <WorkforceDateInput required disabled={Boolean(editingId)} value={employee.joining_date} onChange={value => pick('joining_date', value)} />
                            </label>

                            <fieldset className="workforceRadioFieldset workforceEmployeeType" aria-label="Employee type">
                                <div className="workforceRadioOptions">
                                    <label><input type="radio" name="employmentType" value="Permanent" checked={employee.employment_type === 'Permanent'} onChange={() => pick('employment_type', 'Permanent')} /> Permanent Employee</label>
                                    <label><input type="radio" name="employmentType" value="Temporary" checked={employee.employment_type === 'Temporary'} onChange={() => pick('employment_type', 'Temporary')} /> Temporary Employee</label>
                                </div>
                            </fieldset>

                            {editingId !== null && (
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        alignSelf: 'end',
                                        paddingBottom: 8,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={employee.is_active}
                                        onChange={e => pick('is_active', e.target.checked)}
                                        style={{
                                            width: 18,
                                            height: 18,
                                            margin: 0,
                                            flex: '0 0 auto'
                                        }}
                                    />
                                    <span>Active Employee</span>
                                </label>
                            )}
                        </div>

                        {/* Special Access - Existing functionality, new position */}
                        <div className="rsPermissionBox">
                            <h3>Special Access</h3>
                            <div className="rsPermissionGrid">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(employee.can_approve)}
                                        onChange={e => pick('can_approve', e.target.checked)}
                                    />
                                    Can Approve Attendance & Leave
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(employee.enable_staff_login)}
                                        onChange={e => pick('enable_staff_login', e.target.checked)}
                                    />
                                    Enable Staff Login
                                </label>
                            </div>

                            {employee.enable_staff_login && (
                                <div className="workforceGrid" style={{ marginTop: 16 }}>
                                    <label>
                                        <span className="workforceLabelText">Staff Login Password <span className="workforceRequired" aria-hidden="true">*</span></span>
                                        <input
                                            type="password"
                                            autoComplete="new-password"
                                            minLength="8"
                                            placeholder={
                                                editingId
                                                    ? 'Leave blank to keep current password'
                                                    : 'Minimum 8 characters'
                                            }
                                            required={!editingId}
                                            value={employee.login_password || ''}
                                            onChange={e => pick('login_password', e.target.value)}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Existing Staff Permissions */}
                        <div className="rsPermissionBox">
                            <h3>Staff Access & Permissions</h3>
                            <p>
                                Employee sees only allowed features included in the restaurant plan.
                                Attendance and My Leaves are always available.
                            </p>

                            <div className="rsPermissionGrid">
                                {STAFF_PERMISSIONS.map(([key, label]) => (
                                    <label key={key}>
                                        <input
                                            type="checkbox"
                                            checked={(employee.access_permissions || []).includes(key)}
                                            onChange={e => pick(
                                                'access_permissions',
                                                e.target.checked
                                                    ? [...(employee.access_permissions || []), key]
                                                    : (employee.access_permissions || []).filter(x => x !== key)
                                            )}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="workforceActions">
                            <button disabled={busy} type="submit">
                                {editingId ? 'Update Employee' : 'Save Employee'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={resetEmployee}
                                    style={{ background: '#64748b' }}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    <h2>Employees</h2>

                    <div className="workforceGrid workforceFilters">
                        <label>
                            Search Employee
                            <input
                                placeholder="Name, role or phone"
                                value={employeeSearch}
                                onChange={e => {
                                    setEmployeeSearch(e.target.value);
                                    resetPage('Employees');
                                }}
                            />
                        </label>

                        <label>
                            Joining Month
                            <input
                                type="month"
                                value={employeeJoinMonth}
                                onChange={e => {
                                    setEmployeeJoinMonth(e.target.value);
                                    resetPage('Employees');
                                }}
                            />
                        </label>

                        <label>
                            Status
                            <select
                                value={employeeStatus}
                                onChange={e => {
                                    setEmployeeStatus(e.target.value);
                                    resetPage('Employees');
                                }}
                            >
                                <option value="">All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </label>
                    </div>

                    <div className="workforceTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Gender</th>
                                    <th>Monthly Salary</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageRows(filteredEmployees, 'Employees').map(e => (
                                    <tr key={e.id}>
                                        <td>{e.name}</td>
                                        <td>{e.role}</td>
                                        <td>{e.gender}</td>
                                        <td>₹{e.monthly_salary} <small>({e.employment_type || 'Permanent'})</small></td>
                                        <td>
                                            <span
                                                style={{
                                                    color: e.is_active ? '#087f89' : '#a33',
                                                    fontWeight: 700
                                                }}
                                            >
                                                {e.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="workforceActions">
                                                <button
                                                    type="button"
                                                    disabled={busy}
                                                    onClick={() => editEmployee(e)}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        total={filteredEmployees.length}
                        page={pages.Employees}
                        onChange={p => changePage('Employees', p)}
                    />
                </section>
            )}

            {isOwner && tab === 'Attendance' && (
                <section className="workforceCard">
                    <h2>Mark Attendance</h2>

                    <div className="workforceGrid">
                        <label>
                            <span className="workforceLabelText">Employee <span className="workforceRequired" aria-hidden="true">*</span></span>
                            <select
                                value={selectedEmployee}
                                onChange={e => setSelected(e.target.value)}
                            >
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span className="workforceLabelText">Date <span className="workforceRequired" aria-hidden="true">*</span></span>
                            <WorkforceDateInput value={day} onChange={setDay} />
                        </label>

                        <label>
                            <span className="workforceLabelText">Time <span className="workforceRequired" aria-hidden="true">*</span></span>
                            <input
                                type="time"
                                value={clock}
                                onChange={e => setClock(e.target.value)}
                            />
                        </label>
                    </div>

                    <fieldset className="workforceRadioFieldset workforceAttendanceType">
                        <legend>Attendance Type</legend>
                        <div className="workforceRadioOptions">
                            <label><input type="radio" name="attendanceType" value="Full" checked={dayFraction === 'Full'} onChange={() => setDayFraction('Full')} /> Full Day</label>
                            <label><input type="radio" name="attendanceType" value="Half" checked={dayFraction === 'Half'} onChange={() => setDayFraction('Half')} /> Half Day</label>
                        </div>
                    </fieldset>
                    <div className="workforceActions">
                        <button
                            disabled={busy || !selectedEmployee}
                            onClick={() => run(
                                async () => httpClient.post(api + 'attendance/', {
                                    employee_id: selectedEmployee,
                                    date: day,
                                    time: clock,
                                    action: 'in',
                                    day_fraction: dayFraction,
                                    ...(await captureAttendanceLocation())
                                }),
                                'Check-in saved'
                            )}
                        >
                            Check In
                        </button>

                        <button
                            disabled={busy || !selectedEmployee}
                            onClick={() => run(
                                async () => httpClient.post(api + 'attendance/', {
                                    employee_id: selectedEmployee,
                                    date: day,
                                    time: clock,
                                    action: 'out',
                                    day_fraction: dayFraction,
                                    ...(await captureAttendanceLocation())
                                }),
                                'Check-out saved'
                            )}
                        >
                            Check Out
                        </button>
                    </div>

                    {settings.week_off_mode === 'flexible' && (
                        <div className="workforceOffPanel">
                            <div>
                                <strong>Flexible Paid Off</strong>
                                <p>
                                    Earned <b>{balance.earned}</b> · Used <b>{balance.used}</b> · Available <b>{balance.remaining}</b>
                                </p>
                                <small>Unused offs expire on 31 December.</small>
                            </div>

                            <div className="workforceOffButtons">
                                <button
                                    type="button"
                                    disabled={busy || !selectedEmployee}
                                    onClick={() => run(
                                        () => httpClient.post(api + 'attendance/', {
                                            employee_id: selectedEmployee,
                                            date: day,
                                            action: 'off'
                                        }),
                                        'Week Off marked'
                                    )}
                                >
                                    + Mark Paid Off
                                </button>

                                <button
                                    type="button"
                                    className="workforceOutlineButton"
                                    disabled={busy || !selectedEmployee}
                                    onClick={() => run(
                                        () => httpClient.post(api + 'attendance/', {
                                            employee_id: selectedEmployee,
                                            date: day,
                                            action: 'remove_off'
                                        }),
                                        'Week Off removed'
                                    )}
                                >
                                    Remove Off
                                </button>
                            </div>
                        </div>
                    )}

                    <h2>Attendance Records</h2>

                    <div className="workforceGrid">
                        <label>
                            Filter Month
                            <input
                                type="month"
                                value={attendanceMonth}
                                onChange={e => {
                                    setAttendanceMonth(e.target.value);
                                    resetPage('Attendance');
                                }}
                            />
                        </label>

                        <label>
                            Filter Employee
                            <select
                                value={attendanceEmployee}
                                onChange={e => {
                                    setAttendanceEmployee(e.target.value);
                                    resetPage('Attendance');
                                }}
                            >
                                <option value="">All Employees</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Filter Status
                            <select
                                value={attendanceStatus}
                                onChange={e => {
                                    setAttendanceStatus(e.target.value);
                                    resetPage('Attendance');
                                }}
                            >
                                <option value="">All</option>
                                <option value="Present">Present</option>
                                <option value="Week Off">Week Off</option>
                            </select>
                        </label>
                    </div>

                    <div className="workforceTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>In</th>
                                    <th>Out</th>
                                    <th>Check-In Location</th>
                                    <th>Check-Out Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageRows(filteredAttendance, 'Attendance').map(a => (
                                    <tr key={a.id}>
                                        <td>{a.employee}</td>
                                        <td>{displayDate(a.date)}</td>
                                        <td>{a.status === 'Present' ? (a.day_fraction === 'Half' ? 'Half Day' : 'Full Day') : a.status}</td>
                                        <td>{a.check_in || '—'}</td>
                                        <td>{a.check_out || '—'}</td>
                                        {['check_in', 'check_out'].map(kind => {
                                            const lat = a[`${kind}_latitude`];
                                            const lon = a[`${kind}_longitude`];
                                            return <td key={kind} style={{ minWidth: 185 }}>
                                                <AttendanceAddress latitude={lat} longitude={lon} />
                                            </td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        total={filteredAttendance.length}
                        page={pages.Attendance}
                        onChange={p => changePage('Attendance', p)}
                    />
                </section>
            )}

            {tab === 'Leaves' && (
                <section className="workforceCard">
                    <h2>Leave Request</h2>

                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            run(
                                () => httpClient.post(api + 'leaves/', {
                                    ...leave,
                                    employee_id: selectedEmployee
                                }),
                                'Leave request created'
                            );
                        }}
                    >
                        <div className="workforceGrid">
                            <label>
                                <span className="workforceLabelText">Employee <span className="workforceRequired" aria-hidden="true">*</span></span>
                                <select
                                    value={selectedEmployee}
                                    onChange={e => setSelected(e.target.value)}
                                >
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span className="workforceLabelText">Type <span className="workforceRequired" aria-hidden="true">*</span></span>
                                <select
                                    value={leave.leave_type}
                                    onChange={e => setLeave({
                                        ...leave,
                                        leave_type: e.target.value
                                    })}
                                >
                                    {['Paid', 'Casual', 'Sick', 'Medical', 'Unpaid'].map(x => (
                                        <option key={x}>{x}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span className="workforceLabelText">Start <span className="workforceRequired" aria-hidden="true">*</span></span>
                                <WorkforceDateInput value={leave.start_date} onChange={value => setLeave(prev => ({ ...prev, start_date: value }))} />
                            </label>

                            <label>
                                <span className="workforceLabelText">End <span className="workforceRequired" aria-hidden="true">*</span></span>
                                <WorkforceDateInput value={leave.end_date} onChange={value => setLeave(prev => ({ ...prev, end_date: value }))} />
                            </label>

                            <label>
                                <span className="workforceLabelText">Reason <span className="workforceRequired" aria-hidden="true">*</span></span>
                                <input
                                    value={leave.reason}
                                    onChange={e => setLeave({
                                        ...leave,
                                        reason: e.target.value
                                    })}
                                />
                            </label>
                        </div>

                        <button disabled={busy || !selectedEmployee}>
                            Create Request
                        </button>
                    </form>

                    <h2>Leave Requests</h2>

                    <div className="workforceGrid workforceFilters">
                        <label>
                            Filter Month
                            <input
                                type="month"
                                value={leaveMonth}
                                onChange={e => {
                                    setLeaveMonth(e.target.value);
                                    resetPage('Leaves');
                                }}
                            />
                        </label>

                        <label>
                            Filter Employee
                            <select
                                value={leaveEmployee}
                                onChange={e => {
                                    setLeaveEmployee(e.target.value);
                                    resetPage('Leaves');
                                }}
                            >
                                <option value="">All Employees</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Leave Type
                            <select
                                value={leaveType}
                                onChange={e => {
                                    setLeaveType(e.target.value);
                                    resetPage('Leaves');
                                }}
                            >
                                <option value="">All Types</option>
                                {['Paid', 'Unpaid', 'Medical'].map(v => (
                                    <option key={v}>{v}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Status
                            <select
                                value={leaveStatus}
                                onChange={e => {
                                    setLeaveStatus(e.target.value);
                                    resetPage('Leaves');
                                }}
                            >
                                <option value="">All Statuses</option>
                                {['Pending', 'Approved', 'Rejected'].map(v => (
                                    <option key={v}>{v}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="workforceTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Dates</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageRows(filteredLeaves, 'Leaves').map(x => (
                                    <tr key={x.id}>
                                        <td>{x.employee}</td>
                                        <td>{displayDate(x.start_date)} to {displayDate(x.end_date)}</td>
                                        <td>{x.leave_type}</td>
                                        <td>{x.status}</td>
                                        <td>
                                            {canApprove && x.status === 'Pending' && (
                                                <div className="workforceActions">
                                                    <button
                                                        disabled={busy}
                                                        onClick={() => run(
                                                            () => httpClient.post(
                                                                api + `leaves/${x.id}/decision/`,
                                                                { status: 'Approved' }
                                                            ),
                                                            'Leave approved'
                                                        )}
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        disabled={busy}
                                                        onClick={() => run(
                                                            () => httpClient.post(
                                                                api + `leaves/${x.id}/decision/`,
                                                                { status: 'Rejected' }
                                                            ),
                                                            'Leave rejected'
                                                        )}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        total={filteredLeaves.length}
                        page={pages.Leaves}
                        onChange={p => changePage('Leaves', p)}
                    />
                </section>
            )}

            {isOwner && tab === 'Salary' && (
                <section className="workforceCard workforceSalaryPage">
                    {(() => {
                        const money = n => `₹${(Number(n) || 0).toFixed(2)}`;
                        const employeeId = salaryFormEmployee || selectedEmployee;
                        const selectedRow = combinedSalaryRegister.find(r => String(r.employee_id) === String(employeeId) && `${r.year}-${String(r.month).padStart(2, '0')}` === salaryFilterMonth);
                        const selectedRecord = selectedRow?.payroll;
                        const gross = Number(selectedRecord?.gross_salary ?? selectedRecord?.calculated_salary ?? 0);
                        const advancesPaid = Number(selectedRow?.advance || 0);
                        const monthlyPaid = Number(selectedRow?.salaryPaid || 0);
                        const due = selectedRecord ? Math.max(0, Number(selectedRecord.remaining_amount ?? (gross - advancesPaid - monthlyPaid))) : 0;
                        const getStatus = r => !r.payroll ? (r.advance ? 'Advance Only' : 'Not Calculated') : Number(r.remaining) <= 0 ? 'Paid' : r.salaryPaid > 0 ? 'Partially Paid' : 'Pending';
                        const rows = employees.map(e => {
                            const found = combinedSalaryRegister.find(r => String(r.employee_id) === String(e.id) && `${r.year}-${String(r.month).padStart(2, '0')}` === salaryFilterMonth);
                            return found || { key: `empty-${e.id}`, employee_id: e.id, employee: e.name, payroll: null, gross: 0, advance: 0, salaryPaid: 0, remaining: 0, transactions: [], month: Number(salaryFilterMonth.slice(5)), year: Number(salaryFilterMonth.slice(0, 4)) };
                        });
                        const visible = rows.filter(r => (!salaryEmployee || String(r.employee_id) === salaryEmployee) && (!salarySearch || r.employee.toLowerCase().includes(salarySearch.trim().toLowerCase())) && (!salaryStatus || getStatus(r) === salaryStatus));
                        const totals = rows.reduce((a, r) => ({ gross: a.gross + r.gross, advance: a.advance + r.advance, paid: a.paid + r.salaryPaid, remaining: a.remaining + (r.payroll ? Math.max(0, r.remaining) : 0) }), { gross: 0, advance: 0, paid: 0, remaining: 0 });
                        const openForm = (r, kind = 'salary') => {
                            setSalaryFormEmployee(String(r.employee_id));
                            setSalaryAction(kind);
                            setPaymentAmount(r.payroll ? String(Math.max(0, r.remaining).toFixed(2)) : '');
                            setAdvanceAmount('');
                            setPaymentDate(today);
                            setAdvanceDate(today);
                            setSalaryFormOpen(true);
                            setError('');
                        };
                        const calculate = async () => {
                            if (!employeeId || salaryCalculating) return;
                            setSalaryCalculating(true);
                            setError('');
                            try {
                                await httpClient.post(api + 'payroll/', { employee_id: employeeId, year: Number(salaryFilterMonth.slice(0, 4)), month: Number(salaryFilterMonth.slice(5, 7)) });
                                setSuccess('Salary calculated successfully');
                                await load();
                            } catch (err) { setError(message(err)); }
                            finally { setSalaryCalculating(false); }
                        };
                        return <>
                            <div className="workforceSalaryTop">
                                <div><h2>Salary Management</h2><p>All employees, payments and salary details in one place.</p></div>
                                <button type="button" onClick={() => openForm(rows.find(r => String(r.employee_id) === String(selectedEmployee)) || rows[0] || { employee_id: '', payroll: null })} disabled={!employees.length || busy}>+ Manage Salary</button>
                            </div>
                            <div className="workforceSalaryStats">
                                <div><span>Gross Salary</span><strong>{money(totals.gross)}</strong></div>
                                <div><span>Advance Paid</span><strong>{money(totals.advance)}</strong></div>
                                <div><span>Monthly Salary Paid</span><strong>{money(totals.paid)}</strong></div>
                                <div><span>Remaining Payable</span><strong>{money(totals.remaining)}</strong></div>
                            </div>
                            {salaryFormOpen && <div className="workforceSalaryForm">
                                <div className="workforceSalaryTop"><div><h3>Manage Employee Salary</h3><p>Select an employee and choose what to record.</p></div><button type="button" className="workforceSalarySecondary" onClick={() => setSalaryFormOpen(false)}>Close ×</button></div>
                                <div className="workforceSalaryFilters">
                                    <label>Employee *<select value={employeeId} onChange={e => { setSalaryFormEmployee(e.target.value); setPaymentAmount(''); }}><option value="">Select Employee</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label>
                                    <label>Salary Month<input type="month" value={salaryFilterMonth} onChange={e => setSalaryFilterMonth(e.target.value)} /></label>
                                </div>
                                <div className="workforceSalaryBreakdown">
                                    <div><span>Gross Salary</span><strong>{selectedRecord ? money(gross) : 'Not calculated'}</strong></div>
                                    <div><span>Advance Paid</span><strong>{money(advancesPaid)}</strong></div>
                                    <div><span>Monthly Paid</span><strong>{money(monthlyPaid)}</strong></div>
                                    <div><span>Remaining</span><strong>{selectedRecord ? money(due) : '—'}</strong></div>
                                </div>
                                {!selectedRecord && <div className="workforceSalaryNotice">Salary has not been generated for this employee and month. Generate it to get an accurate attendance-based amount. <button type="button" disabled={!employeeId || salaryCalculating || busy} onClick={calculate}>{salaryCalculating ? 'Calculating...' : 'Generate Salary'}</button></div>}
                                {selectedRecord && <p className="workforceSalaryHint">Attendance: {selectedRecord.present_days || 0} days · Hours: {selectedRecord.worked_hours || 0} · Paid leave: {selectedRecord.paid_leave_days || 0} · Half days: {selectedRecord.half_days || 0}</p>}
                                <div className="workforceSalarySwitch"><button type="button" className={salaryAction === 'salary' ? 'selected' : ''} onClick={() => { setSalaryAction('salary'); setPaymentAmount(selectedRecord ? due.toFixed(2) : ''); }}>Pay Monthly Salary</button><button type="button" className={salaryAction === 'advance' ? 'selected' : ''} onClick={() => setSalaryAction('advance')}>Give Advance</button></div>
                                {salaryAction === 'salary' ? <div className="workforceSalaryFilters">
                                    <label>Payment Amount (₹) *<input type="number" min="0.01" step="0.01" max={due} value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} /></label>
                                    <label>Payment Date<WorkforceDateInput value={paymentDate} onChange={setPaymentDate} /></label>
                                    <label>Payment Mode<select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>{['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Other'].map(m => <option key={m}>{m}</option>)}</select></label>
                                    <label>Remark (Optional)<input value={paymentRemark} onChange={e => setPaymentRemark(e.target.value)} /></label>
                                </div> : <div className="workforceSalaryFilters">
                                    <label>Advance Amount (₹) *<input type="number" min="0.01" step="0.01" value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} /></label>
                                    <label>Advance Date<WorkforceDateInput value={advanceDate} onChange={setAdvanceDate} /></label>
                                    <label>Remark (Optional)<input value={advanceRemark} onChange={e => setAdvanceRemark(e.target.value)} /></label>
                                </div>}
                                <div className="workforceActions"><button type="button" disabled={busy || !employeeId || (salaryAction === 'salary' ? (!selectedRecord || due <= 0 || !(Number(paymentAmount) > 0) || Number(paymentAmount) > due) : !(Number(advanceAmount) > 0))} onClick={() => salaryAction === 'salary' ? run(() => httpClient.post(api + 'payroll/', { action: 'pay_salary', payroll_id: selectedRecord.id, amount: paymentAmount, payment_date: paymentDate, payment_mode: paymentMode, remark: paymentRemark }), 'Salary payment recorded', () => { setSalaryFormOpen(false); setPaymentAmount(''); setPaymentRemark(''); }) : run(() => httpClient.post(api + 'payroll/', { action: 'advance', employee_id: employeeId, amount: advanceAmount, date: advanceDate, remark: advanceRemark }), 'Salary advance saved', () => { setSalaryFormOpen(false); setAdvanceAmount(''); setAdvanceRemark(''); })}>{busy ? 'Saving...' : salaryAction === 'salary' ? 'Confirm Salary Payment' : 'Save Advance'}</button><button type="button" className="workforceSalarySecondary" onClick={() => setSalaryFormOpen(false)}>Cancel</button></div>
                            </div>}
                            <div className="workforceSalaryFilters">
                                <label>Search Employee<input placeholder="Search by employee name" value={salarySearch} onChange={e => { setSalarySearch(e.target.value); resetPage('Salary'); }} /></label>
                                <label>Salary Month<input type="month" value={salaryFilterMonth} onChange={e => { setSalaryFilterMonth(e.target.value); setSalaryFormOpen(false); resetPage('Salary'); }} /></label>
                                <label>Status<select value={salaryStatus} onChange={e => { setSalaryStatus(e.target.value); resetPage('Salary'); }}><option value="">All Statuses</option><option>Not Calculated</option><option>Advance Only</option><option>Pending</option><option>Partially Paid</option><option>Paid</option></select></label>
                            </div>
                            <h3 className="workforceSalaryListHeading">Employee Salary Register <small>{visible.length} employees</small></h3>
                            <div className="workforceTable"><table><thead><tr><th>Employee</th><th>Gross Salary</th><th>Advance</th><th>Salary Paid</th><th>Total Paid</th><th>Remaining</th><th>Status</th><th>Actions</th></tr></thead><tbody>
                                {pageRows(visible, 'Salary').map(r => <React.Fragment key={r.key}><tr><td><strong>{r.employee}</strong><small className="workforceSalaryMonth">{String(r.month).padStart(2, '0')}/{r.year}</small></td><td>{r.payroll ? money(r.gross) : '—'}</td><td>{money(r.advance)}</td><td>{money(r.salaryPaid)}</td><td>{money(r.advance + r.salaryPaid)}</td><td>{r.payroll ? money(Math.max(0, r.remaining)) : '—'}</td><td><span className={`workforceSalaryStatus ${getStatus(r).toLowerCase().replace(/\s+/g, '-')}`}>{getStatus(r)}</span></td><td><div className="workforceSalaryRowActions"><button type="button" onClick={() => openForm(r)}>Manage</button><button type="button" className="workforceSalarySecondary" onClick={() => setExpandedSalaryRow(v => v === r.key ? '' : r.key)}>{expandedSalaryRow === r.key ? 'Hide' : 'Details'}</button></div></td></tr>
                                    {expandedSalaryRow === r.key && <tr className="workforceSalaryDetailRow"><td colSpan={8}><div className="workforceSalaryDetail"><h4>{r.employee} — Complete Salary Details</h4>{r.payroll ? <div className="workforceSalaryBreakdown"><div><span>Period</span><strong>{displayDate(r.payroll.start_date)} – {displayDate(r.payroll.end_date)}</strong></div><div><span>Present / Half Days</span><strong>{r.payroll.present_days || 0} / {r.payroll.half_days || 0}</strong></div><div><span>Hours / Paid Leave</span><strong>{r.payroll.worked_hours || 0} / {r.payroll.paid_leave_days || 0}</strong></div><div><span>Net Salary</span><strong>{money(r.payroll.calculated_salary)}</strong></div></div> : <p>Payroll not generated for this month.</p>}<h4>Advance & Salary Payment History</h4>{r.transactions.length ? <div className="workforceTable"><table><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Mode</th><th>Remark</th></tr></thead><tbody>{r.transactions.map(t => <tr key={t.key}><td>{displayDate(t.date)}</td><td>{t.type}</td><td>{money(t.amount)}</td><td>{t.mode}</td><td>{t.remark || '—'}</td></tr>)}</tbody></table></div> : <p>No payments recorded for this month.</p>}</div></td></tr>}
                                </React.Fragment>)}
                                {!visible.length && <tr><td colSpan={8}>No employees found for these filters.</td></tr>}
                            </tbody></table></div>
                            <Pagination total={visible.length} page={pages.Salary} onChange={p => changePage('Salary', p)} />
                        </>;
                    })()}
                </section>
            )}
        </main>
    );
}
