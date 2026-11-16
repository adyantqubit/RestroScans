import React, { useEffect, useRef, useState } from "react";
import style from "../style/item.module.css";
import { loadItemCount, loadItemPage, rememberPage, setItemActive, setKitchenAvailable, toggleSort, storedPage } from "../../services/itemService";
import { useItemState } from "../../usestate/itemState";
import RecordPage from "../../../../components/RecordPage/RecordPage";
import EditItemForm from "../components/EditItemForm";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { MdCancel, MdCheckCircle } from "react-icons/md";
import config from "../../../../config/config";
import defaultIcon from "../../../../images/no-category.jpg";
import { useApp } from "../../../../Context/AppContext";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const SELLER_FILTERS = [
  { value: "all", label: "All items" },
  { value: "true", label: "Best sellers" },
  { value: "false", label: "Other items" },
];

const AdminItem = ({ staffMode = false }) => {
  const { enableHeader, Message } = useApp();
  const {
    count: backendItemCount,
    setCount: setBackendItemCount,
    rows: itemList,
    setRows: setItemList,
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
  } = useItemState();
  const [formOpen, setFormOpen] = useState(false);
  const tableScrollRef = useRef(null);
  const touchStartRef = useRef(null);
  const scrollTable = (direction) => {
    const el = tableScrollRef.current;
    if (el) el.scrollBy({ left: direction * Math.max(260, el.clientWidth * 0.85), behavior: "smooth" });
  };
  const [availabilityBusy, setAvailabilityBusy] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sellerFilter, setSellerFilter] = useState("all");

  useEffect(() => {
    enableHeader()

    const page = storedPage();
    if (page) {
      setCurrentPage(page);
    }
    getCountOfItem();
    getListOfItem(page || currentPage);
  }, []);

  useEffect(() => {
    getListOfItem();
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage, statusFilter, sellerFilter]);

  const getCountOfItem = async () => {
    setBackendItemCount(await loadItemCount(staffMode));
  };

  const getListOfItem = async (page = currentPage) => {
    const response = await loadItemPage({
      currentPage: page,
      listPerPage,
      columnToSort,
      columnSortingOrder,
      searchText,
      filters: {
        ...(statusFilter === "all" ? {} : { is_active: statusFilter === "true" }),
        ...(sellerFilter === "all" ? {} : { best_seller: sellerFilter === "true" }),
      },
    }, staffMode);
    setItemList(response.rows);
    setBackendItemCount(response.count);
  };

  const handlePageChange = async (pageNumber) => {
    rememberPage(pageNumber);
    setCurrentPage(pageNumber);
  };

  const sortItemList = (columnName) => {
    const next = toggleSort(columnToSort, columnSortingOrder, columnName);
    setColumnToSort(next.columnToSort);
    setColumnSortingOrder(next.columnSortingOrder);
  };

  const openItemDetails = (id) => {
    setEditingId(id ?? null);
    setFormOpen(true);
  };

  const toggleItem = async (item) => {
    const next = !item.is_active;
    const saved = await setItemActive(item.id, next, staffMode);
    if (saved) {
      Message(next ? `${item.name} is back on the menu` : `${item.name} is off the menu`, "success");
      getListOfItem();
    } else {
      Message("Could not update this item", "warning");
    }
  };

  const toggleAvailability = async (item) => {
    setAvailabilityBusy(item.id);
    try { await setKitchenAvailable(item.id, !item.kitchen_available, staffMode); await getListOfItem(); }
    catch (e) { Message(e.response?.data?.error || "Could not update availability", "error"); }
    finally { setAvailabilityBusy(null); }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  function hideDropdown() {
    if (document.getElementById("dropdown"))
      ((document.getElementById("dropdown") || { style: {} }).style.display = "")
  }
  return (
    <RecordPage
      title="Items"
      formOpen={formOpen}
      formTitle={editingId ? "Edit item" : "New item"}
      onToggleForm={() => setFormOpen((open) => !open)}
      onCreate={() => openItemDetails(null)}
      createLabel="New item"
      form={formOpen ? (
        <EditItemForm
          key={editingId || "new"}
          embedded
          staffMode={staffMode}
          recordId={editingId}
          onSaved={() => {
            closeForm();
            getListOfItem();
          }}
          onClose={closeForm}
        />
      ) : null}
      searchPlaceholder="Search name, category, or price"
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
      secondaryFilterValue={sellerFilter}
      secondaryFilterOptions={SELLER_FILTERS}
      onSecondaryFilter={(value) => {
        setCurrentPage(1);
        setSellerFilter(value);
      }}
      total={backendItemCount}
      currentPage={currentPage}
      listPerPage={listPerPage}
      onPageChange={handlePageChange}
      setListPerPage={setListPerPage}
      setCurrentPage={setCurrentPage}
      hasRows={Boolean(itemList && itemList.length > 0)}
    >
      <div className={`${style.itemListSection} staffItemsTableRegion`}>
        {staffMode && <div className="staffItemsScrollControls" aria-label="Items table navigation">
          <span>Swipe sideways to view all columns</span>
          <div>
            <button type="button" aria-label="Scroll table left" onClick={() => scrollTable(-1)}>←</button>
            <button type="button" aria-label="Scroll table right" onClick={() => scrollTable(1)}>→</button>
          </div>
        </div>}
        <div className={`${style.tableContainer} staffItemsTableScroll`} ref={tableScrollRef}
          onTouchStart={(e) => { touchStartRef.current = { x: e.touches[0].clientX, left: e.currentTarget.scrollLeft }; }}
          onTouchMove={(e) => {
            const start = touchStartRef.current;
            if (start && e.touches.length === 1) e.currentTarget.scrollLeft = start.left + start.x - e.touches[0].clientX;
          }}
          onTouchEnd={() => { touchStartRef.current = null; }}>
          <div className={`${style.table} staffItemsWideTable`}>
            <div
              className={style.tableHeadingContainer}
              onClick={hideDropdown}
              onTouchStart={hideDropdown}
            >
              <div className={style.commonColumnTitle}>Icon </div>
              <div className={style.commonColumnTitle}>Avg. rating</div>
              <div
                className={style.commonColumnTitle}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortItemList("name");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "name") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "name") {
                    setShowSortingIcon(false);
                  }
                }}
              >
                Name{" "}
                {columnToSort == "name" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortAlphaDown className={style.sortingIcon} />
                  )}
                {columnToSort == "name" &&
                  columnSortingOrder == "descending" && (
                    <BsSortAlphaDownAlt className={style.sortingIcon} />
                  )}
                {columnToSort != "name" && showSortingIcon && (
                  <BsSortAlphaDown
                    color="grey"
                    className={style.sortingIcon}
                  />
                )}
              </div>

              <div
                className={style.commonColumnTitle}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortItemList("category");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "category") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "category") {
                    setShowSortingIcon(false);
                  }
                }}
              >
                Category name
                {columnToSort == "category" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortAlphaDown className={style.sortingIcon} />
                  )}
                {columnToSort == "category" &&
                  columnSortingOrder == "descending" && (
                    <BsSortAlphaDownAlt className={style.sortingIcon} />
                  )}
                {columnToSort != "category" && showSortingIcon && (
                  <BsSortAlphaDown
                    color="grey"
                    className={style.sortingIcon}
                  />
                )}
              </div>

              <div
                className={style.commonColumnTitle}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortItemList("priceFull");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "priceFull") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "priceFull") {
                    setShowSortingIcon(false);
                  }
                }}
              >
                Full price
                {columnToSort == "priceFull" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortNumericDown className={style.sortingIcon} />
                  )}
                {columnToSort == "priceFull" &&
                  columnSortingOrder == "descending" && (
                    <BsSortNumericDownAlt className={style.sortingIcon} />
                  )}
                {columnToSort != "priceFull" && showSortingIcon && (
                  <BsSortNumericDown
                    color="grey"
                    className={style.sortingIcon}
                  />
                )}
              </div>

              <div
                className={style.commonColumnTitle}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortItemList("priceHalf");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "priceHalf") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "priceHalf") {
                    setShowSortingIcon(false);
                  }
                }}
              >
                Half price
                {columnToSort == "priceHalf" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortNumericDown className={style.sortingIcon} />
                  )}
                {columnToSort == "priceHalf" &&
                  columnSortingOrder == "descending" && (
                    <BsSortNumericDownAlt className={style.sortingIcon} />
                  )}
                {columnToSort != "priceHalf" && showSortingIcon && (
                  <BsSortNumericDown
                    color="grey"
                    className={style.sortingIcon}
                  />
                )}
              </div>

              <div
                className={style.commonColumnTitle}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortItemList("is_active");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "is_active") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "is_active") {
                    setShowSortingIcon(false);
                  }
                }}
              >
                Is Active{" "}
                {columnToSort == "is_active" &&
                  columnSortingOrder == "ascending" && (
                    <MdCancel className={style.sortingIconNA} />
                  )}
                {columnToSort == "is_active" &&
                  columnSortingOrder == "descending" && (
                    <MdCheckCircle className={style.sortingIconA} />
                  )}
                {columnToSort != "is_active" && showSortingIcon && (
                  <MdCancel color="grey" className={style.sortingIcon} />
                )}
              </div>

              <div
                className={style.commonColumnTitle}
                onClick={(e) => {
                  setShowSortingIcon(false);
                  sortItemList("best_seller");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "best_seller") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "best_seller") {
                    setShowSortingIcon(false);
                  }
                }}
              >
                Best Seller{" "}
                {columnToSort == "best_seller" &&
                  columnSortingOrder == "ascending" && (
                    <MdCancel className={style.sortingIconNA} />
                  )}
                {columnToSort == "best_seller" &&
                  columnSortingOrder == "descending" && (
                    <MdCheckCircle className={style.sortingIconA} />
                  )}
                {columnToSort != "best_seller" && showSortingIcon && (
                  <MdCancel color="grey" className={style.sortingIcon} />
                )}
              </div>

              <div className={style.commonColumnTitle}>Availability</div>
              <div className={style.commonColumnTitle}> Action </div>
            </div>

            <div
              className={style.tableDataContainer}
              style={{
                backgroundColor: "#efefef",
              }}
              onClick={hideDropdown}
              onTouchStart={hideDropdown}
            >
              {itemList != null && itemList.length > 0 ? (
                itemList.map((itemDetails, index) => {
                  return (
                    <div
                      key={index}
                      className={style.tableData}
                      style={{
                        padding: "2px",
                        marginTop: "2px",
                        marginBottom:
                          itemList.length == index + 1 ? "2px" : "0px",
                      }}
                    >
                      <div className={style.commonColumnData}>
                        <img
                          className={style.itemImage}
                          src={
                            itemDetails.icon
                              ? config.staticBaseURL + itemDetails.icon
                              : defaultIcon
                          }
                        />
                      </div>
                      <div className={style.commonColumnData} style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                        {itemDetails.average_rating == null ? <span style={{ color: "#64748b" }}>Not rated</span> : <span><span style={{ color: "#f5a400" }}>★</span> {Number(itemDetails.average_rating).toFixed(1)}</span>}
                      </div>
                      <div
                        className={style.commonColumnData}
                        style={{ wordBreak: "break-word" }}
                      >
                        {itemDetails.name}
                      </div>

                      <div className={style.commonColumnData}>
                        {itemDetails.category_name}
                      </div>

                      <div className={style.commonColumnData}>
                        {itemDetails.price_full
                          ? itemDetails.price_full
                          : "-"}
                      </div>

                      <div className={style.commonColumnData}>
                        {itemDetails.price_half
                          ? itemDetails.price_half
                          : "-"}
                      </div>

                      <div className={style.commonColumnData}>
                        <button
                          type="button"
                          className="desk-toggle"
                          title={itemDetails.is_active ? "Take off the menu" : "Put back on the menu"}
                          onClick={() => toggleItem(itemDetails)}
                        >
                          {itemDetails.is_active == true ? (
                            <MdCheckCircle className={style.yesIcon} />
                          ) : (
                            <MdCancel className={style.noIcon} />
                          )}
                        </button>
                      </div>

                      {itemDetails.best_seller == true ? (
                        <div className={style.commonColumnData}>
                          <MdCheckCircle className={style.yesIcon} />
                        </div>
                      ) : (
                        <div className={style.commonColumnData}>
                          <MdCancel className={style.noIcon} />
                        </div>
                      )}

                      {<div className={style.commonColumnData}>
                        <button type="button" className="desk-toggle" disabled={availabilityBusy === itemDetails.id}
                          title={itemDetails.kitchen_available ? 'Mark unavailable' : 'Mark available'}
                          onClick={() => toggleAvailability(itemDetails)}>
                          {itemDetails.kitchen_available ? <MdCheckCircle className={style.yesIcon} /> : <MdCancel className={style.noIcon} />}
                        </button>
                      </div>}
                      <div
                        className={`${style.commonColumnData}`}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          className={` ${style.primaryButton}`}
                          onClick={() => openItemDetails(itemDetails.id)}
                        >
                          View
                        </div>
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

    </RecordPage>
  );
};

export default AdminItem;
