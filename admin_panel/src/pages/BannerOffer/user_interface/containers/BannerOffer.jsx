import { useEffect, useState } from "react";
import { explainFailure } from "../../../../http/http_client";
import { useNavigate } from "react-router-dom";
import RecordPage from "../../../../components/RecordPage/RecordPage";
import { useApp } from "../../../../Context/AppContext";
import config from "../../../../config/config";
import defaultIcon from "../../../../images/no-offer.jpg";
import { loadOfferPage, saveOffer } from "../../services/bannerOfferService";
import style from "../style/offer.module.css";

const STATUS_FILTERS = [
  { value: "all", label: "All offers" },
  { value: "true", label: "On the menu" },
  { value: "false", label: "Hidden" },
];

const EMPTY = {
  offer_name: "",
  discount: "",
  video_link: "",
  show_video_Hide_Image: false,
  is_active: true,
  imageFile: null,
};

export default function BannerOffer() {
  const { enableHeader, Message } = useApp();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(Number(localStorage.getItem("listPerPage")) || 10);
  const [searchText, setSearchText] = useState("");
  const [columnToSort, setColumnToSort] = useState("offer_name");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    enableHeader();
  }, []);

  useEffect(() => {
    loadPage();
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage, statusFilter]);

  async function loadPage() {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo") || "{}").tenant_name;
    if (!tenant) return;
    const response = await loadOfferPage(tenant, {
      paginationDetails: { currentPage, listPerPage },
      columnToSort,
      columnSortingOrder,
      searchText: searchText.trim(),
      ...(statusFilter === "all" ? {} : { filters: { is_active: statusFilter === "true" } }),
    });
    setRows(response?.offerBannerList || []);
    setTotal(response?.offerBannerListCount || 0);
  }

  function sortBy(column) {
    if (columnToSort === column) {
      setColumnSortingOrder(columnSortingOrder === "ascending" ? "descending" : "ascending");
    } else {
      setColumnToSort(column);
      setColumnSortingOrder("ascending");
    }
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setFormOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      offer_name: row.offer_name || "",
      discount: row.discount || "",
      video_link: row.video_link || "",
      show_video_Hide_Image: Boolean(row.show_video_Hide_Image),
      is_active: Boolean(row.is_active),
      imageFile: null,
    });
    setError("");
    setFormOpen(true);
  }

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event) {
    event.preventDefault();
    const name = form.offer_name.trim();
    const discount = String(form.discount || "").trim();
    if (!name) {
      setError("Enter the offer name.");
      return;
    }
    if (!/^\d{1,2}$/.test(discount) || Number(discount) > 99) {
      setError("Discount is a whole number from 0 to 99.");
      return;
    }
    if (!editing && !form.imageFile && !form.video_link.trim()) {
      setError("Add a banner image, or a video link.");
      return;
    }
    setError("");
    setSaving(true);
    const body = new FormData();
    if (editing) body.append("id", editing.id);
    body.append("offer_name", name);
    body.append("discount", discount);
    body.append("video_link", form.video_link.trim());
    body.append("show_video_Hide_Image", form.show_video_Hide_Image ? "true" : "false");
    body.append("is_active", form.is_active ? "true" : "false");
    if (form.imageFile) body.append("offer_image", form.imageFile);
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await saveOffer(tenant, body);
    setSaving(false);
    if (response && response.msg) {
      const follow = form.is_active
        ? "It is on the menu. Add dishes or the price stays the same."
        : "It is hidden, so the menu and orders keep the normal price.";
      Message(`Offer saved. ${follow}`, "success");
      setFormOpen(false);
      setEditing(null);
      loadPage();
      return;
    }
    const reason = explainFailure(response, "This offer was not saved.");
    setError(reason);
    Message(reason, "warning");
  }

  async function toggleActive(row) {
    const body = new FormData();
    body.append("id", row.id);
    body.append("is_active", row.is_active ? "false" : "true");
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await saveOffer(tenant, body);
    if (response && response.msg) {
      Message(row.is_active ? `${row.offer_name} is hidden` : `${row.offer_name} is on the menu`, "success");
      loadPage();
    } else {
      Message(explainFailure(response, "This offer was not updated."), "warning");
    }
  }

  return (
    <RecordPage
      title="Offers"
      formOpen={formOpen}
      formTitle={editing ? "Edit offer" : "New offer"}
      onToggleForm={() => setFormOpen((open) => !open)}
      onCreate={openNew}
      createLabel="New offer"
      form={formOpen ? (
        <form className={style.form} onSubmit={save}>
          <div className={style.field}>
            <label className="req" htmlFor="offer-name">Name</label>
            <input id="offer-name" maxLength={40} value={form.offer_name} onChange={(event) => setField("offer_name", event.target.value)} />
          </div>
          <div className={style.field}>
            <label className="req" htmlFor="offer-discount">Discount %</label>
            <input id="offer-discount" inputMode="numeric" value={form.discount} onChange={(event) => setField("discount", event.target.value.replace(/\D/g, "").slice(0, 2))} />
          </div>
          <div className={style.field}>
            <label className={!form.video_link.trim() && !(editing && editing.offer_image) ? "req" : "opt"} htmlFor="offer-image">Banner image</label>
            <input id="offer-image" type="file" accept="image/*" onChange={(event) => setField("imageFile", event.target.files && event.target.files[0])} />
          </div>
          <label className={style.check}>
            <input type="checkbox" checked={form.is_active} onChange={(event) => setField("is_active", event.target.checked)} />
            Show on the menu
          </label>
          <div className={style.field}>
            <label className="opt" htmlFor="offer-video">Video link</label>
            <input id="offer-video" value={form.video_link} onChange={(event) => setField("video_link", event.target.value)} placeholder="Optional" />
          </div>
          <label className={style.check}>
            <input type="checkbox" checked={form.show_video_Hide_Image} onChange={(event) => setField("show_video_Hide_Image", event.target.checked)} />
            Play the video instead of the image
          </label>
          {error ? <div className={`${style.hint} ${style.wide}`}>{error}</div> : null}
          <div className={`${style.actions} ${style.wide}`}>
            <button className="desk-action" type="submit" disabled={saving}>{saving ? "Saving" : "Save offer"}</button>
            <button className="desk-action desk-action--quiet" type="button" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : null}
      searchPlaceholder="Search offer name or discount"
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
            <th />
            <th onClick={() => sortBy("offer_name")}>Offer</th>
            <th onClick={() => sortBy("discount")}>Off</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={style.empty} colSpan="5">No offers yet.</td>
            </tr>
          ) : rows.map((row) => (
            <tr key={row.id}>
              <td>
                <img
                  className={style.thumb}
                  alt=""
                  src={row.offer_image ? config.staticBaseURL + row.offer_image : defaultIcon}
                />
              </td>
              <td>{row.offer_name}</td>
              <td>{row.discount ? `${row.discount}%` : "—"}</td>
              <td>
                <button type="button" className="desk-toggle" onClick={() => toggleActive(row)}>
                  <span className={row.is_active ? style.pill : style.pillOff}>{row.is_active ? "On menu" : "Hidden"}</span>
                </button>
              </td>
              <td>
                <div className={style.rowActions}>
                  <button type="button" className="desk-action desk-action--quiet" onClick={() => navigate("/OfferItem", { state: { id: row.id, name: row.offer_name, discount: row.discount } })}>
                    Dishes
                  </button>
                  <button type="button" className="desk-action desk-action--quiet" onClick={() => openEdit(row)}>Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </RecordPage>
  );
}
