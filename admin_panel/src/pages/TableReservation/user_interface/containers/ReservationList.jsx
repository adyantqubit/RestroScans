import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../../Context/AppContext";
import RecordPage from "../../../../components/RecordPage/RecordPage";
import { loadReservations, saveReservation } from "../../services/tableReservationService";
import ReservationForm from "../components/ReservationForm";
import style from "../style/book.module.css";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Confirm", label: "Confirmed" },
];

const WHEN_FILTERS = [
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "all", label: "All dates" },
];

function clockLabel(value) {
  if (!value) return "";
  const [hourText, minute] = String(value).slice(0, 5).split(":");
  const hour = Number(hourText);
  if (Number.isNaN(hour) || minute == null) return String(value).slice(0, 5);
  const suffix = hour >= 12 ? "pm" : "am";
  return `${hour % 12 || 12}:${minute} ${suffix}`;
}

function dayLabel(value) {
  if (!value) return "No date";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function ReservationList() {
  const { enableHeader, Message } = useApp();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(Number(localStorage.getItem("listPerPage")) || 10);
  const [searchText, setSearchText] = useState("");
  const [columnToSort, setColumnToSort] = useState("time");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [statusFilter, setStatusFilter] = useState("all");
  const [whenFilter, setWhenFilter] = useState("today");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    enableHeader();
  }, []);

  useEffect(() => {
    loadPage();
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage, statusFilter, whenFilter]);

  async function loadPage() {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo") || "{}").tenant_name;
    if (!tenant) return;
    const response = await loadReservations(tenant, {
      paginationDetails: { currentPage, listPerPage },
      columnToSort,
      columnSortingOrder,
      searchText: searchText.trim(),
      when: whenFilter,
      ...(statusFilter === "all" ? {} : { filters: { reservation_status: statusFilter } }),
    });
    setRows(response?.reservation || []);
    setTotal(response?.reservationListCount || 0);
  }

  function sortBy(column) {
    if (columnToSort === column) {
      setColumnSortingOrder(columnSortingOrder === "ascending" ? "descending" : "ascending");
    } else {
      setColumnToSort(column);
      setColumnSortingOrder("ascending");
    }
  }

  function openRow(row) {
    setEditingRow(row || null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingRow(null);
  }

  async function confirmReservation(row) {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await saveReservation(tenant, { ...row, reservation_status: "Confirm" });
    if (response && response.msg === "Saved Successfully") {
      Message("Reservation confirmed", "success");
      loadPage();
    } else {
      Message("Could not confirm this reservation", "warning");
    }
  }

  function seat(row) {
    if (!row.table_number) {
      Message("Assign a table before seating this booking", "warning");
      openRow(row);
      return;
    }
    navigate("/Dashboard", { state: { seatTable: row.table_number, seatAt: Date.now() } });
  }

  return (
    <RecordPage
      title="Reservations"
      formOpen={formOpen}
      formTitle={editingRow ? "Edit booking" : "New booking"}
      onToggleForm={() => setFormOpen((open) => !open)}
      onCreate={() => openRow(null)}
      createLabel="New booking"
      form={formOpen ? (
        <ReservationForm
          key={editingRow ? editingRow.id : "new"}
          embedded
          record={editingRow}
          onSaved={() => {
            closeForm();
            loadPage();
          }}
          onClose={closeForm}
        />
      ) : null}
      searchPlaceholder="Search guest, phone, or table"
      onSearch={(value) => {
        setCurrentPage(1);
        setSearchText(value);
      }}
      filterValue={statusFilter}
      filterOptions={STATUS_FILTERS}
      filterLabel="Status"
      onFilter={(value) => {
        setCurrentPage(1);
        setStatusFilter(value);
      }}
      secondaryFilterValue={whenFilter}
      secondaryFilterOptions={WHEN_FILTERS}
      secondaryFilterLabel="When"
      onSecondaryFilter={(value) => {
        setCurrentPage(1);
        setWhenFilter(value);
        setColumnToSort(value === "today" ? "time" : "date");
        setColumnSortingOrder("ascending");
      }}
      total={total}
      currentPage={currentPage}
      listPerPage={listPerPage}
      onPageChange={setCurrentPage}
      setListPerPage={setListPerPage}
      setCurrentPage={setCurrentPage}
    >
      <table className={style.table}>
        <thead>
          <tr>
            <th onClick={() => sortBy(whenFilter === "today" ? "time" : "date")}>When</th>
            <th onClick={() => sortBy("name")}>Guest</th>
            <th onClick={() => sortBy("contact_number")}>Phone</th>
            <th onClick={() => sortBy("number_of_person")}>Party</th>
            <th onClick={() => sortBy("table_number")}>Table</th>
            <th>Note</th>
            <th onClick={() => sortBy("reservation_status")}>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={style.empty} colSpan="8">
                {whenFilter === "today" ? "No bookings for today." : "No bookings match this view."}
              </td>
            </tr>
          ) : rows.map((row) => (
            <tr key={row.id}>
              <td>
                <div className={style.when}>
                  <strong>{clockLabel(row.time) || "No time"}</strong>
                  <span>{dayLabel(row.date)}</span>
                </div>
              </td>
              <td>{row.name || "—"}</td>
              <td>{row.contact_number || "—"}</td>
              <td>{row.number_of_person ? `${row.number_of_person}` : "—"}</td>
              <td>{row.table_number || "—"}</td>
              <td className={style.note} title={row.special_instructions || ""}>{row.special_instructions || "—"}</td>
              <td>
                <span className={row.reservation_status === "Confirm" ? style.pill : style.pillWait}>
                  {row.reservation_status === "Confirm" ? "Confirmed" : "Pending"}
                </span>
              </td>
              <td>
                <div className={style.rowActions}>
                  {row.reservation_status === "Pending" ? (
                    <button type="button" className="desk-action" onClick={() => confirmReservation(row)}>Confirm</button>
                  ) : null}
                  <button type="button" className="desk-action desk-action--quiet" onClick={() => seat(row)}>Seat</button>
                  <button type="button" className="desk-action desk-action--quiet" onClick={() => openRow(row)}>Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </RecordPage>
  );
}
