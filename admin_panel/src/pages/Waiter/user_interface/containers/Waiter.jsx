import { useEffect, useState } from "react";
import { explainFailure } from "../../../../http/http_client";
import style from "../style/waiter.module.css";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import WaiterForm from "../components/WaiterForm";
import { loadWaiterPage, saveWaiter } from "../../services/waiterService";
import RecordPage from "../../../../components/RecordPage/RecordPage";
import { useApp } from "../../../../Context/AppContext";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const Waiter = () => {
  const { Message } = useApp();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(Number(localStorage.getItem("listPerPage")) || 10);
  const [searchText, setSearchText] = useState("");
  const [columnToSort, setColumnToSort] = useState("name");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState(null);

  useEffect(() => {
    loadPage();
  }, [currentPage, listPerPage, searchText, columnToSort, columnSortingOrder, statusFilter]);

  async function setDuty(row) {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await saveWaiter(tenant, {
      id: row.id,
      name: row.name,
      contact_number: row.contact_number,
      is_active: !row.is_active,
    });
    if (response && response.data) {
      Message(response.data.is_active ? `${row.name} is on duty` : `${row.name} is off duty`, "success");
      loadPage();
    } else {
      Message(explainFailure(response, "This waiter was not updated."), "warning");
    }
  }

  async function loadPage() {
    const response = await loadWaiterPage({
      currentPage,
      listPerPage,
      searchText,
      columnToSort,
      columnSortingOrder,
      filters: statusFilter === "all" ? undefined : { is_active: statusFilter === "true" },
    });
    setRows(response.data || []);
    setTotal(response.count || 0);
  }

  const sortBy = (column) => {
    if (columnToSort === column) {
      setColumnSortingOrder(columnSortingOrder === "ascending" ? "descending" : "ascending");
    } else {
      setColumnToSort(column);
      setColumnSortingOrder("ascending");
    }
  };

  const openForm = (row) => {
    setSelectedWaiter(row);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedWaiter(null);
  };

  return (
    <RecordPage
      title="Waiters"
      formOpen={formOpen}
      formTitle={selectedWaiter ? "Edit waiter" : "New waiter"}
      onToggleForm={() => setFormOpen((open) => !open)}
      onCreate={() => openForm(null)}
      createLabel="New waiter"
      form={formOpen ? (
        <WaiterForm
          key={selectedWaiter ? selectedWaiter.id : "new"}
          inline
          selectedWaiter={selectedWaiter}
          setSelectedWaiter={setSelectedWaiter}
          onSaved={() => {
            closeForm();
            loadPage();
          }}
        />
      ) : null}
      searchPlaceholder="Search name or contact number"
      onSearch={(value) => {
        setCurrentPage(1);
        setSearchText(value);
      }}
      filterValue={statusFilter}
      filterOptions={STATUS_FILTERS}
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
      hasRows={rows.length > 0}
    >
      <div className={style.table}>
        <div className={style.tableHeadingContainer}>
          <div className={style.commonColumnTitle} onClick={() => sortBy("name")}>Name</div>
          <div className={style.commonColumnTitle} onClick={() => sortBy("contact_number")}>Contact Number</div>
          <div className={style.commonColumnTitle} onClick={() => sortBy("is_active")}>Active</div>
          <div className={style.commonColumnTitle}>Action</div>
        </div>
        {rows.length > 0 ? rows.map((data) => (
          <div key={data.id} className={style.tableData}>
            <div className={style.commonColumnData}>{data.name}</div>
            <div className={style.commonColumnData}>{data.contact_number}</div>
            <div className={style.commonColumnData}>
              {data.is_active ? <MdCheckCircle className={style.yesIcon} /> : <MdCancel className={style.noIcon} />}
            </div>
            <div className={style.commonColumnData} style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
              <button type="button" className="desk-action desk-action--quiet" onClick={() => setDuty(data)}>
                {data.is_active ? "Off duty" : "On duty"}
              </button>
              <div className={style.primaryButton} onClick={() => openForm(data)}>View</div>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: "center" }}>No records found</div>
        )}
      </div>
    </RecordPage>
  );
};

export default Waiter;
