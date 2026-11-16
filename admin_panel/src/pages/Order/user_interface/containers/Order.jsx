import React, { useEffect, useState, useRef } from "react";
import "./waiterOrderTag.css";
import httpClient from "../../../../http/http_client";
import axios from "axios";
import style from "../style/order.module.css";
import Header from "../../../../components/Header/Header";
import {
  loadOrderReport,
  loadDashboard,
  loadOrderCount,
  loadOrderItemCount,
  loadOrderItemBoard,
  loadOrderItems,
  loadOrders,
  displayDateTime,
  slipDateTime,
} from "../../services/orderService";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import {
  MdArrowDropDown,
  MdCancel,
  MdCheckCircle,
} from "react-icons/md";

import config from "../../../../config/config";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../../Context/AppContext";
import PrintBill from "../../../Home/user_interface/components/PrintBill";
import { PrintKot } from "../../../Home/user_interface/components/PrintKot";
import DatePicker from "react-date-picker";
import {
  AiFillCalendar,
  AiFillEye,
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineSortAscending,
} from "react-icons/ai";
import Loader from "../../../../components/Loader/Loader";
import NewOrderDesk from "../components/NewOrderDesk";
import OrderForm from "../components/OrderForm";
import { useOrderState } from "../../usestate/orderState";
import RecordPage from "../../../../components/RecordPage/RecordPage";
import { saveAllOrderStatus } from "../../../Home/services/homeService";
import { buildBulkUpdate, nextServiceStep } from "../../../Home/services/todayOrderRules";

function formatOrderTableLocation(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '—';
  const parts = raw.split(/\s*[·|]\s*/);
  if (parts.length >= 2) {
    const floor = /^(direct|ground(?:\s+floor)?)$/i.test(parts[0]) ? 'Ground Floor' : parts[0];
    const table = /^(?:t|table\s*)?(\d+)$/i.exec(parts.slice(1).join(' ').trim());
    return `${floor} · ${table ? `Table ${Number(table[1])}` : parts.slice(1).join(' · ')}`;
  }
  const simple = /^(?:t|table\s*)?(\d+)$/i.exec(raw);
  return simple ? `Table ${Number(simple[1])}` : raw;
}

const ORDER_STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "Placed", label: "Placed" },
  { value: "Confirm", label: "Confirmed" },
  { value: "Cooked", label: "Cooked" },
  { value: "Served", label: "Served" },
  { value: "Cancelled", label: "Cancelled" },
];

const Order = ({ staffMode = false, focusOrderId = null, onFocusConsumed }) => {
  const staffSection = typeof staffMode === "string" ? staffMode : "orders";
  const isStaff = Boolean(staffMode);
  const [staffError, setStaffError] = useState("");
  const [activity, setActivity] = useState({});
  const [paymentBusy, setPaymentBusy] = useState(null);
  const [activityError, setActivityError] = useState("");
  const latestOrders = useRef([]);
  const activityBusy = useRef(false);
  const tenantActivityKey = () => `restroscans-item-seen:${getCurrentTenantName() || "default"}`;
  const seenItems = useRef(null);
  const readSeenItems = () => {
    if (seenItems.current === null) {
      try { seenItems.current = JSON.parse(sessionStorage.getItem(tenantActivityKey()) || "{}"); }
      catch { seenItems.current = {}; }
    }
    return seenItems.current;
  };
  const acknowledgeItems = async (orderId) => {
    const item = activity[String(orderId)];
    if (!item?.latest_item_id) return;
    try {
      await activityRequest("post", {
        action: "acknowledge_items",
        order_id: orderId,
        latest_item_id: Number(item.latest_item_id),
      });
      const seen = readSeenItems();
      seen[String(orderId)] = Number(item.latest_item_id);
      sessionStorage.setItem(tenantActivityKey(), JSON.stringify(seen));
      setActivity(old => ({
        ...old,
        [String(orderId)]: { ...old[String(orderId)], items_added: false, acknowledged_item_id: Number(item.latest_item_id) },
      }));
      await refreshActivity();
    } catch (error) {
      window.alert(error?.response?.data?.error || error?.message || "Could not acknowledge added items");
    }
  };
  const activityRequest = async (method, data) => {
    const url = "/api/v1/manual-payment/verify/";
    if (isStaff) {
      const session = JSON.parse(sessionStorage.getItem("restroStaffSession") || "null");
      if (!session?.token || !session?.tenant) throw new Error("Staff login required");
      const response = await axios({
        baseURL: config.staticBaseURL, url, method,
        headers: { Authorization: `Bearer ${session.token}`, "X-Tenant": session.tenant },
        ...(method === "get" ? { params: data } : { data })
      });
      return response.data;
    }
    const response = method === "get" ? await httpClient.get(url, { params: data }) : await httpClient.post(url, data);
    return response.data;
  };
  const refreshActivity = async () => {
    const ids = latestOrders.current.map(row => row.id).filter(Boolean);
    if (!ids.length || activityBusy.current) return;
    activityBusy.current = true;
    try {
      const response = await activityRequest("get", { activity: 1, order_ids: ids.join(",") });
      const seen = readSeenItems();
      const next = {};
      let changed = false;
      for (const [key, entry] of Object.entries(response.orders || {})) {
        const latest = Number(entry.latest_item_id || 0);
        const first = Date.parse(entry.first_item_at || "");
        const last = Date.parse(entry.last_item_at || "");
        // Only added lines (not the original cart) trigger an activity marker.
        const addedLater = Number.isFinite(first) && Number.isFinite(last) && last - first > 10000;
        const acknowledged = Number(entry.acknowledged_item_id || 0);
        if (seen[key] === undefined) {
          // Initial load: show only recent additions, not old historical orders.
          seen[key] = addedLater && Date.now() - last < 30 * 60 * 1000 ? 0 : latest;
          changed = true;
        }
        if (acknowledged > Number(seen[key] || 0)) {
          seen[key] = acknowledged;
          changed = true;
        }
        next[key] = { ...entry, items_added: addedLater && latest > Math.max(acknowledged, Number(seen[key] || 0)) };
      }
      if (changed) sessionStorage.setItem(tenantActivityKey(), JSON.stringify(seen));
      setActivity(next);
      setActivityError("");
    } catch (error) {
      setActivityError(error?.response?.data?.error || error?.message || "Live activity unavailable");
    } finally { activityBusy.current = false; }
  };
  const quickVerify = async (row, action) => {
    const approve = action === "confirm_paid";
    const prompt = approve
      ? `Have you independently confirmed receipt of ₹${Number(row.final_amount || 0).toFixed(2)} for ${row.order_id}?`
      : `Reject the payment claim for ${row.order_id}?`;
    if (!window.confirm(prompt)) return;
    setPaymentBusy(row.id);
    try {
      await activityRequest("post", { order_id: row.id, action });
      await Promise.all([allOrders(), refreshActivity()]);
      window.dispatchEvent(new Event("order-live"));
    } catch (error) {
      window.alert(error?.response?.data?.error || error?.message || "Payment verification failed");
    } finally { setPaymentBusy(null); }
  };
  const staffApi = async (method, payload) => {
    const session = JSON.parse(sessionStorage.getItem("restroStaffSession") || "null");
    if (!session?.token || !session?.tenant) throw new Error("Staff login required");
    const response = await axios({
      method, baseURL: config.staticBaseURL, url: "/api/v1/workforce/staff-operations/",
      headers: { Authorization: `Bearer ${session.token}`, "X-Tenant": session.tenant },
      ...(method === "get" ? { params: { section: staffSection } } : { data: { section: staffSection, ...payload } }),
    });
    return response.data;
  };
  const { enableHeader } = useApp();
  var {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    allDateFilter,
    setAllDateFilter,
    allowFilter,
    setAllowFilter,
    dateValidation,
    setDateValidation,
    backendOrderCount,
    setOrderCount,
    orders,
    setOrders,
    listPerPage,
    setListPerPage,
    columnToSort,
    setColumnToSort,
    columnSortingOrder,
    setColumnSortingOrder,
    showSortingIcon,
    setShowSortingIcon,
    currentPage,
    setCurrentPage,
    searchText,
    setSearchText,
    restroDetail,
    setRestroDetail,
    gstFssai,
    setGstFsaai,
    orderItems,
    setOrderItems,
    openActionPopupModal,
    setOpenActionPopupModal,
    isLoader,
    setIsLoader,
    showDesk,
    setShowDesk,
  } = useOrderState();

  const navigate = useNavigate();

  const [editingOrderId, setEditingOrderId] = useState(null);
  const orderFormSectionRef = useRef(null);

  useEffect(() => {
    if (editingOrderId == null) return undefined;
    const frame = requestAnimationFrame(() => {
      orderFormSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [editingOrderId]);
  // Dashboard View Orders opens the existing Orders Module's original OrderForm.
  useEffect(() => {
    if (!isStaff || focusOrderId == null) return;
    setShowDesk(false);
    setEditingOrderId(focusOrderId);
    onFocusConsumed?.();
  }, [focusOrderId, isStaff, onFocusConsumed, setShowDesk]);

  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  useEffect(() => {
    if (isStaff) return;
    enableHeader();

    if (localStorage.getItem("globalPageIndex")) {
      currentPage = parseInt(localStorage.getItem("globalPageIndex"));
      setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")));
    }
  }, []);

  useEffect(() => {
    getCountofOrder();
    allOrders();

    getOrderItems();
  }, []);

  useEffect(() => {
    allOrders();
    localStorage.setItem("globalPageIndex", currentPage);

    setDateValidation(false);
  }, [
    columnToSort,
    columnSortingOrder,
    currentPage,
    searchText,
    listPerPage,
    allowFilter,
    orderStatusFilter,
  ]);

  const getCurrentTenantName = () => {
    try {
      const adminTenant = JSON.parse(localStorage.getItem("tenantInfo") || "null");
      if (adminTenant?.tenant_name) return adminTenant.tenant_name;
    } catch (error) {
      console.warn("Invalid tenantInfo", error);
    }
    try {
      const staffSession = JSON.parse(sessionStorage.getItem("restroStaffSession") || "null");
      if (staffSession?.tenant_name) return staffSession.tenant_name;
      if (staffSession?.tenant) return staffSession.tenant;
    } catch (error) {
      console.warn("Invalid staff session", error);
    }
    const host = window.location.hostname.toLowerCase();
    if (host.endsWith(".restroscans.com")) return host.split(".")[0];
    return null;
  };

  const getCountofOrder = async () => {
    const tenant = getCurrentTenantName();
    if (isStaff) return;
    const response = await loadOrderCount(tenant);
    setOrderCount(response.orderCount);
    setGstFsaai(response.setting);
    setRestroDetail(response.tenant);
    setOrderItems(response.order_item);
  };

  const allOrders = async () => {
    const tenant = getCurrentTenantName();
    const paginationDetails = {
      currentPage: currentPage,
      listPerPage: listPerPage,
    };
    const filteringCriteria = {
      paginationDetails: paginationDetails,
      columnToSort: columnToSort,
      columnSortingOrder: columnSortingOrder,
      searchText: searchText.trim(),
      ...(orderStatusFilter === "all" ? {} : { filters: { order_status: orderStatusFilter } }),
    };

    if (allDateFilter) {
      let copyToDate = new Date(toDate);
      copyToDate.setDate(copyToDate.getDate() + 1);

      filteringCriteria["startDate"] = fromDate;
      filteringCriteria["endDate"] = copyToDate;
    }

    if (isStaff) {
      try {
        const data = await staffApi("get");
        let results = data.results || [];
        if (searchText.trim()) {
          const q = searchText.trim().toLowerCase();
          results = results.filter(o => [o.order_id, o.table_number, o.order_status, o.payment_status].some(v => String(v || "").toLowerCase().includes(q)));
        }
        if (orderStatusFilter !== "all") results = results.filter(o => o.order_status === orderStatusFilter);
        if (allDateFilter && fromDate && toDate) results = results.filter(o => {
          const dt = new Date(o.date);
          return dt >= new Date(fromDate) && dt <= new Date(new Date(toDate).setHours(23, 59, 59, 999));
        });
        results.sort((a, b) => {
          const av = a[columnToSort], bv = b[columnToSort];
          const c = typeof av === "number" && typeof bv === "number" ? av - bv : String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
          return columnSortingOrder === "ascending" ? c : -c;
        });
        setOrderCount(results.length);
        const visibleRows = results.slice((currentPage - 1) * listPerPage, currentPage * listPerPage);
        latestOrders.current = visibleRows;
        setOrders(visibleRows);
        setOrderItems(data.order_items || []);
        setRestroDetail(data.restaurant || {});
        setGstFsaai(data.settings || {});
        setStaffError("");
      } catch (err) {
        setStaffError(err?.response?.data?.error || err.message || "Could not load orders");
        setOrders([]); setOrderCount(0);
      } finally { setIsLoader(false); }
      return;
    }
    var response = await loadOrders(tenant, filteringCriteria);
    setIsLoader(false);
    latestOrders.current = response.orderList || [];
    setOrders(response.orderList);

    setOrderCount(response.orderListCount);
  };
  useEffect(() => {
    const onLive = () => allOrders();
    window.addEventListener('order-live', onLive);
    return () => window.removeEventListener('order-live', onLive);
  }, []);
  useEffect(() => {
    const refresh = () => { allOrders(); refreshActivity(); };
    const timer = window.setInterval(refresh, 4000);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", onFocus); };
  }, [currentPage, listPerPage, searchText, orderStatusFilter, columnToSort, columnSortingOrder, allDateFilter, fromDate, toDate]);
  useEffect(() => { refreshActivity(); }, [orders]);
  const getOrderItems = async () => {
    const tenant = getCurrentTenantName();
  };
  const handlePageChange = async (pageNumber) => {
    if (allDateFilter == false) {
      setFromDate(null);
      setToDate(null);
    }

    localStorage.setItem("globalPageIndex", pageNumber);

    setCurrentPage(pageNumber);
  };
  const openMenuDetails = (id) => {
    alert(id);
  };

  const advanceOrder = async (orderDetail) => {
    const step = nextServiceStep(orderDetail);
    if (!step) return;
    if (isStaff) {
      const action = orderDetail.order_status === "Placed" ? "confirm"
        : orderDetail.order_status === "Confirm" ? "cooked" : "serve";
      try { await staffApi("post", { action, order_id: orderDetail.id }); await allOrders(); }
      catch (err) { setStaffError(err?.response?.data?.error || err.message || "Order update failed"); }
      return;
    }
    const tenant = getCurrentTenantName();
    const result = await saveAllOrderStatus(tenant, buildBulkUpdate([orderDetail], step.change));
    if (result && result.success) allOrders();
  };

  const sortOrderId = (columnName) => {
    if (columnToSort == columnName) {
      if (columnSortingOrder == "descending") {
        setColumnSortingOrder("ascending");
      } else {
        setColumnSortingOrder("descending");
      }
    }
    setColumnToSort(columnName);
  };

  var backgroundColor = 1;

  const openOrderDetails = (id) => {
    alert(id);
  };

  function ExtractDateTime(format) {
    return displayDateTime(format);
  }

  function hideDropdown() {
    if (orders && orders.length > 0) {
      ((document.getElementById("dropdown") || { style: {} }).style.display = "");
    }
  }

  const handleFilterData = async () => {
    if (fromDate == null || toDate == null) {
      setDateValidation(true);
    } else {
      setAllDateFilter(true);
      setDateValidation(false);
      if (currentPage != 1) {
        localStorage.setItem("globalPageIndex", 1);
        setCurrentPage(1);
      } else {
        setAllowFilter(!allowFilter);
      }
    }
  };

  const handleClearFilter = () => {
    setFromDate(null);
    setToDate(null);

    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    setAllDateFilter(false);
    handlePageChange(1);
    setAllowFilter(!allowFilter);
  };

  const closeOrderForm = () => {
    setShowDesk(false);
    setEditingOrderId(null);
  };

  return (
    <RecordPage
      title="Orders"
      formSectionRef={orderFormSectionRef}
      formOpen={showDesk || editingOrderId != null}
      formTitle={showDesk ? "New order" : (editingOrderId ? "Edit order" : "Order")}
      onToggleForm={() => {
        if (showDesk || editingOrderId != null) closeOrderForm();
        else setShowDesk(true);
      }}
      collapsedFormLabel={isStaff ? "Show form" : "New order"}
      form={showDesk ? (
        <NewOrderDesk onBack={() => { setShowDesk(false); allOrders(); }} />
      ) : editingOrderId ? (
        <OrderForm
          key={editingOrderId}
          embedded
          recordId={editingOrderId}
          staffMode={isStaff}
          onSaved={() => { closeOrderForm(); allOrders(); }}
          onClose={closeOrderForm}
        />
      ) : null}
      searchPlaceholder="Search order id, table, or status"
      onSearch={(value) => {
        setCurrentPage(1);
        setSearchText(value);
      }}
      filterValue={orderStatusFilter}
      filterOptions={ORDER_STATUS_FILTERS}
      onFilter={(value) => {
        setCurrentPage(1);
        setOrderStatusFilter(value);
      }}
      total={backendOrderCount}
      currentPage={currentPage}
      listPerPage={listPerPage}
      onPageChange={handlePageChange}
      setListPerPage={setListPerPage}
      setCurrentPage={setCurrentPage}
      hasRows={Boolean(orders && orders.length > 0)}
    >
      {staffError && <div role="alert" style={{ color: "#b91c1c", padding: 12 }}>{staffError}</div>}
      {isLoader == true ? <Loader /> :
        <div >

          <div className={style.dateFilterContainer}>
            <div className={style.filterButtonContainer}>
              <div className={style.dateContainer}>
                <div className={style.datepicker1}>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setFromDate(new Date(e.target.value));
                      setDateValidation(false);
                    }}
                    style={{
                      border: "1px solid",
                      padding: "2px",
                      borderRadius: "5px",
                    }}
                    id="fromDate"
                    className={style.calendar}
                  />
                </div>
                <div className={style.datepicker1}>
                  <input
                    type="date"
                    min={
                      fromDate != null
                        ? fromDate.getFullYear() +
                        "-" +
                        ("0" + (fromDate.getMonth() + 1)).slice(-2) +
                        "-" +
                        ("0" + fromDate.getDate()).slice(-2)
                        : null
                    }
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setToDate(new Date(e.target.value));
                      setDateValidation(false);
                    }}
                    style={{
                      border: "1px solid",
                      padding: "2px",
                      borderRadius: "5px",
                    }}
                    id="toDate"
                    disabled={fromDate != null ? false : true}
                    className={style.calendar}
                  />
                </div>
              </div>
              <div className={style.dateValidation}>
                {dateValidation && "Please enter start and end date!"}{" "}
              </div>
            </div>
            <div className={style.filterButtonContainer}>
              <button
                onClick={handleFilterData}
                className={style.filterButtonSpace}
              >
                Filter
              </button>
              <button
                onClick={handleClearFilter}
                className={style.filterButtonSpace}
              >
                Clear filter
              </button>
            </div>
          </div>

          <div className={style.orderListSection}>
            <div className={style.tableContainer}>
              <div className={`${style.table} rsAlignedOrdersTable ${isStaff ? "rsStaffOrdersTable" : "rsAdminOrdersTable"}`}>
                <div
                  className={style.tableHeadingContainer}
                >
                  <div
                    className={style.sNoColumn}
                  >
                    S.No{" "}
                  </div>
                  <div
                    className={style.actionColumn}
                  >
                    Action
                  </div>
                  <div
                    className={style.OrderIdColumn}
                    onClick={(e) => {
                      setShowSortingIcon(false);
                      sortOrderId("order_id");
                    }}
                    onMouseEnter={(e) => {
                      if (columnToSort != "order_id") {
                        setShowSortingIcon("order_id");
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (columnToSort != "order_id") {
                        setShowSortingIcon("");
                      }
                    }}
                  >
                    Order ID{" "}
                    {columnToSort == "order_id" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortNumericDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "order_id" &&
                      columnSortingOrder == "descending" && (
                        <BsSortNumericDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "order_id" && showSortingIcon == "order_id" && (
                      <BsSortNumericDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )}
                  </div>
                  <div
                    className={style.tableNoColumn}
                    onClick={(e) => {
                      setShowSortingIcon(false);
                      sortOrderId("table_number");
                    }}
                    onMouseEnter={(e) => {
                      if (columnToSort != "table_number") {
                        { }
                        setShowSortingIcon("table_number");
                        { }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (columnToSort != "table_number") {
                        { }
                        setShowSortingIcon("");
                        { }
                      }
                    }}
                  >
                    Table No{" "}
                    {columnToSort == "table_number" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortNumericDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "table_number" &&
                      columnSortingOrder == "descending" && (
                        <BsSortNumericDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "table_number" && showSortingIcon == "table_number" && (
                      <BsSortNumericDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )}
                  </div>

                  <div
                    className={style.orderStatusColumn}
                    onClick={(e) => {
                      setShowSortingIcon(false);
                      sortOrderId("order_status");
                    }}
                    onMouseEnter={(e) => {
                      if (columnToSort != "order_status") {
                        { }
                        setShowSortingIcon("order_status");
                        { }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (columnToSort != "order_status") {
                        { }
                        setShowSortingIcon("");
                        { }
                      }
                    }}
                  >
                    {" "}
                    Order Status
                    {columnToSort == "order_status" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortAlphaDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "order_status" &&
                      columnSortingOrder == "descending" && (
                        <BsSortAlphaDownAlt className={style.sortingIcon} />
                      )}
                    {/* {columnToSort != "order_status" && showSortingIcon && ( */}
                    {columnToSort != "order_status" && showSortingIcon == "order_status" && (
                      <BsSortAlphaDown color="grey" className={style.sortingIcon} />
                    )}
                  </div>

                  <div
                    className={style.paymentStatusColumn}
                    onClick={(e) => {
                      setShowSortingIcon(false);
                      sortOrderId("payment_status");
                    }}
                    onMouseEnter={(e) => {
                      if (columnToSort != "payment_status") {
                        { }
                        setShowSortingIcon("payment_status");
                        { }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (columnToSort != "payment_status") {
                        { }
                        setShowSortingIcon("");
                        { }
                      }
                    }}
                  >
                    Payment Status
                    {columnToSort == "payment_status" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortAlphaDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "payment_status" &&
                      columnSortingOrder == "descending" && (
                        <BsSortAlphaDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "payment_status" && showSortingIcon == "payment_status" && (
                      <BsSortAlphaDown color="grey" className={style.sortingIcon} />
                    )}
                  </div>

                  <div className={style.subtotalColumn}>Sub-Total</div>
                  <div
                    className={style.cgstColumn}
                  >
                    CGST
                  </div>
                  <div
                    className={style.sgstColumn}
                  >
                    SGST
                  </div>
                  <div
                    className={style.finalRupees}
                  >
                    Final Amount
                  </div>
                  <div
                    className={style.dateColumn}
                    onClick={(e) => {
                      setShowSortingIcon(false);
                      sortOrderId("date");
                    }}
                    onMouseEnter={(e) => {
                      if (columnToSort != "date") {
                        { }
                        setShowSortingIcon("date");
                        { }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (columnToSort != "date") {
                        { }
                        setShowSortingIcon("");
                      }
                    }}
                  >
                    Date
                    {columnToSort == "date" &&
                      columnSortingOrder == "ascending" && (
                        <BsSortNumericDown className={style.sortingIcon} />
                      )}
                    {columnToSort == "date" &&
                      columnSortingOrder == "descending" && (
                        <BsSortNumericDownAlt className={style.sortingIcon} />
                      )}
                    {columnToSort != "date" && showSortingIcon == "date" && (
                      <BsSortNumericDown
                        color="grey"
                        className={style.sortingIcon}
                      />
                    )}
                  </div>
                  <div
                    className={style.totalColumn}
                  >
                    Time
                  </div>
                  <div
                    className={style.discountColumn}
                  >
                    Get Bill
                  </div>
                  <div
                    className={style.loayltyColumn}
                  >
                    Get KOT
                  </div>
                </div>
                <div
                  className={style.tableDataContainer}
                  style={{
                    backgroundColor: "#efefef",
                  }}
                >
                  {orders && orders.length > 0 ? (
                    orders.map((orderDetail, index) => {
                      return (
                        <div
                          key={index}
                          className={style.tableData}
                          style={{
                            padding: "2px",
                            marginTop: "2px",
                            marginBottom: orders.length === index + 1 ? "2px" : "0px",
                            minHeight: "46px",
                            backgroundColor: activity[String(orderDetail.id)]?.verification_state === "awaiting_verification"
                              ? "#fff0b3"
                              : activity[String(orderDetail.id)]?.items_added
                                ? "#dbeafe"
                                : backgroundColor++ % 2 == 0 ? "white" : "#1677ff14",
                            boxSizing: "border-box",
                            width: "100%",
                          }}
                        >
                          <div
                            className={`${style.sNoColumn} ${style.commonColumnData} `}
                          >
                            {currentPage * listPerPage - listPerPage + index + 1}
                          </div>
                          <div
                            className={`${style.actionColumn} ${style.commonColumnData} `}

                          >
                            <AiFillEye
                              style={{ fontSize: 15, color: "rgb(24, 94, 224)" }}
                              onClick={() => {
                                setShowDesk(false);
                                setEditingOrderId(orderDetail.id);
                              }}
                            />
                          </div>

                          <div
                            className={`${style.OrderIdColumn} ${style.commonColumnData} `}

                          >
                            {/* <span
                        // onClick={() => {
                        //     navigate(`/update-order/${orderDetail.id}`, {
                        //         state: { id: orderDetail.id },
                        //     });
                        // }}
                        > */}
                            {" "}
                            {orderDetail.order_id}
                          </div>

                          <div
                            className={`${style.tableNoColumn} ${style.commonColumnData} `}

                          >
                            {/* <span
                        // onClick={() => {
                        //     navigate(`/update-order/${orderDetail.id}`, {
                        //         state: { id: orderDetail.id },
                        //     });
                        // }}
                        > */}
                            {" "}
                            <span className="rsOrderTableLocation" title={formatOrderTableLocation(orderDetail.table_number)}>
                              {formatOrderTableLocation(orderDetail.table_number)}
                            </span>
                            {!isStaff && ['Waiter', 'Admin', 'Customer'].includes(orderDetail.order_created_by) && (
                              <span
                                className="rsWaiterOrderTag"
                                title={orderDetail.order_created_by === 'Waiter'
                                  ? `Order taken by ${orderDetail.waiter_name || 'Staff'}${orderDetail.waiter_contact_number ? ` · Staff contact: ${orderDetail.waiter_contact_number}` : ''}`
                                  : `Order placed by ${orderDetail.order_created_by}`}
                              >
                                <span className="rsWaiterOrderDot" aria-hidden="true" />
                                <span className="rsWaiterOrderName">
                                  {orderDetail.order_created_by === 'Waiter'
                                    ? `Waiter: ${orderDetail.waiter_name || 'Staff'}`
                                    : `Order: ${orderDetail.order_created_by}`}
                                </span>
                              </span>
                            )}
                          </div>

                          <div
                            className={`${style.orderStatusColumn} ${style.commonColumnData} `}
                            style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}
                          >
                            {(!isStaff || staffSection === "orders") && nextServiceStep(orderDetail) ? (
                              <button type="button" className="desk-action" onClick={() => advanceOrder(orderDetail)}>
                                {nextServiceStep(orderDetail).label}
                              </button>
                            ) : null}
                            {orderDetail.order_status}
                            {activity[String(orderDetail.id)]?.items_added && (
                              <button type="button" title="New items added - click to acknowledge"
                                onClick={() => acknowledgeItems(orderDetail.id)}
                                style={{ border: "1px solid #eab308", borderRadius: 5, background: "#facc15", color: "#1f2937", padding: "7px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                                New Item
                              </button>
                            )}
                          </div>
                          <div className={`${style.paymentStatusColumn} ${style.commonColumnData} `}>
                            {activity[String(orderDetail.id)]?.verification_state === "awaiting_verification" ? (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width: "100%" }}>
                                <button type="button" title="Approve after checking actual payment"
                                  aria-label={`Approve payment ${orderDetail.order_id}`}
                                  disabled={paymentBusy === orderDetail.id}
                                  onClick={() => quickVerify(orderDetail, "confirm_paid")}
                                  style={{ border: 0, borderRadius: 5, background: "#15803d", color: "white", padding: 0, width: 28, height: 28, flexShrink: 0, cursor: "pointer", fontWeight: 700 }}>✓</button>
                                <button type="button" title="Reject payment claim"
                                  aria-label={`Reject payment ${orderDetail.order_id}`}
                                  disabled={paymentBusy === orderDetail.id}
                                  onClick={() => quickVerify(orderDetail, "reject")}
                                  style={{ border: 0, borderRadius: 5, background: "#b91c1c", color: "white", padding: 0, width: 28, height: 28, flexShrink: 0, cursor: "pointer", fontWeight: 700 }}>✕</button>
                              </div>
                            ) : orderDetail.payment_status}
                          </div>
                          <div
                            className={`${style.subtotalColumn} ${style.commonColumnData} `}
                          >
                            {(orderDetail.sub_total).toFixed(2)}
                          </div>
                          <div
                            className={`${style.cgstColumn} ${style.commonColumnData} `}
                          >
                            {(orderDetail.cgst).toFixed(2)}
                          </div>
                          <div
                            className={`${style.sgstColumn} ${style.commonColumnData} `}
                          >
                            {(orderDetail.sgst).toFixed(2)}
                          </div>
                          <div
                            className={`${style.finalRupees} ${style.commonColumnData} `}
                          >
                            {(orderDetail.final_amount).toFixed(2)}
                          </div>
                          <div
                            className={`${style.dateColumn} ${style.commonColumnData} `}
                          >
                            {ExtractDateTime(orderDetail.date).date}
                          </div>
                          <div
                            className={`${style.totalColumn} ${style.commonColumnData} `}
                          >
                            {ExtractDateTime(orderDetail.date).time}
                          </div>
                          <div
                            className={`${style.discountColumn} ${style.commonColumnData} `}
                          >
                            {orderDetail.order_status != "Cancelled" ? (
                              <div
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                  padding: "3px 8px",
                                  borderRadius: "50px",
                                  cursor: "pointer",
                                  fontSize: "10px",
                                }}
                                onClick={(e) => {
                                  openActionPopupModal = orderDetail;
                                  setOpenActionPopupModal(orderDetail);
                                  PrintBill(
                                    openActionPopupModal,
                                    orderItems?.filter((o) => {
                                      return (
                                        o.order_id == openActionPopupModal.order_id
                                      );
                                    }),
                                    restroDetail,
                                    gstFssai
                                  );
                                }}
                              >
                                {" "}
                                Get Bill
                              </div>
                            ) : (
                              "---"
                            )}
                          </div>
                          <div
                            className={`${style.loayltyColumn} ${style.commonColumnData} `}
                          >
                            {orderDetail.order_status != "Placed" &&
                              orderDetail.order_status != "Cancelled" ? (
                              <div
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                  padding: "3px 8px",
                                  borderRadius: "50px",
                                  cursor: "pointer",
                                  fontSize: "10px",
                                }}
                                onClick={(e) =>
                                  PrintKot(
                                    orderDetail,
                                    orderItems?.filter(
                                      (o) =>
                                        o.item_status != "cancelled" &&
                                        o.order_id == orderDetail.order_id
                                    ),
                                    restroDetail,
                                    gstFssai
                                  )
                                }
                              >
                                {" "}
                                Print KOT
                              </div>
                            ) : (
                              "---"
                            )}

                          </div>

                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: "center" }}>No records found!</div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      }
    </RecordPage>
  );
};

export default Order;
