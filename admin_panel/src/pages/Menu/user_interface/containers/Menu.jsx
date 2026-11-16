import React, { useEffect, useState } from "react";
import style from "../style/menu.module.css";
import { loadMenuCount, loadMenuPage, rememberPage, setMenuActive, toggleSort, storedPage } from "../../services/menuService";
import { useMenuState } from "../../usestate/menuState";
import RecordPage from "../../../../components/RecordPage/RecordPage";
import MenuForm from "../components/MenuForm";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { MdCancel, MdCheckCircle } from "react-icons/md";

import config from "../../../../config/config";
import { useApp } from "../../../../Context/AppContext";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const Menu = () => {
  const { enableHeader, Message } = useApp();
  const {
    count: backendMenuCount,
    setCount: setBackendMenuCount,
    rows: menuList,
    setRows: setMenuList,
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
  } = useMenuState();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    enableHeader()

    const page = storedPage();
    if (page) {
      setCurrentPage(page);
    }
    getCountOfMenu();
    getListOfMenu(page || currentPage);
  }, []);

  useEffect(() => {
    getListOfMenu();
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage, statusFilter]);

  const getCountOfMenu = async () => {
    setBackendMenuCount(await loadMenuCount());
  };

  const getListOfMenu = async (page = currentPage) => {
    const response = await loadMenuPage({
      currentPage: page,
      listPerPage,
      columnToSort,
      columnSortingOrder,
      searchText,
      filters: statusFilter === "all" ? undefined : { is_active: statusFilter === "true" },
    });
    setMenuList(response.rows);
    setBackendMenuCount(response.count);
  };

  const handlePageChange = async (pageNumber) => {
    rememberPage(pageNumber)
    setCurrentPage(pageNumber);
  };

  const sortMenuList = (columnName) => {
    const next = toggleSort(columnToSort, columnSortingOrder, columnName);
    setColumnToSort(next.columnToSort);
    setColumnSortingOrder(next.columnSortingOrder);
  };

  const toggleMenu = async (menu) => {
    const next = !menu.is_active;
    const saved = await setMenuActive(menu.id, next);
    if (saved) {
      Message(next ? `${menu.name} is on` : `${menu.name} is hidden`, "success");
      getListOfMenu();
    } else {
      Message("Could not update this menu", "warning");
    }
  };

  const openMenuDetails = (id) => {
    setEditingId(id ?? null);
    setFormOpen(true);
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
      title="Menus"
      formOpen={formOpen}
      formTitle={editingId ? "Edit menu" : "New menu"}
      onToggleForm={() => setFormOpen((open) => !open)}
      onCreate={() => openMenuDetails(null)}
      createLabel="New menu"
      form={formOpen ? (
        <MenuForm
          key={editingId || "new"}
          embedded
          recordId={editingId}
          onSaved={() => {
            closeForm();
            getListOfMenu();
          }}
          onClose={closeForm}
        />
      ) : null}
      searchPlaceholder="Search menu name"
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
      total={backendMenuCount}
      currentPage={currentPage}
      listPerPage={listPerPage}
      onPageChange={handlePageChange}
      setListPerPage={setListPerPage}
      setCurrentPage={setCurrentPage}
      hasRows={Boolean(menuList && menuList.length > 0)}
    >
      <div className={style.menuListSection}>
        <div className={style.tableContainer}>
          <div className={style.table}>
            <div className={style.tableHeadingContainer}
              onClick={hideDropdown}
              onTouchStart={hideDropdown}
            >
              <div className={style.commonColumnTitle}>Icon </div>

              <div
                className={style.commonColumnTitle}>
                <span onClick={(e) => {
                  setShowSortingIcon(false);
                  sortMenuList("name");
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
                  style={{ wordBreak: "break-word" }}>Name{" "}</span>
                <span onClick={(e) => {
                  setShowSortingIcon(false);
                  sortMenuList("name");
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
                  }}>
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
                </span>
              </div>

              <div
                className={style.commonColumnTitle}
              >
                <span onClick={(e) => {
                  setShowSortingIcon(false);
                  sortMenuList("is_active");
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
                  }} style={{ wordBreak: "break-word" }}>Available{" "}</span>
                <span onClick={(e) => {
                  setShowSortingIcon(false);
                  sortMenuList("is_active");
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
                  }}>
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
                </span>
              </div>

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
              {menuList != null && menuList.length > 0 ? (
                menuList.map((menuDetails, index) => {
                  return (
                    <div
                      key={index}
                      className={style.tableData}
                      style={{
                        padding: "2px",
                        marginTop: "2px",
                        marginBottom:
                          menuList.length == index + 1 ? "2px" : "0px",
                      }}
                    >
                      <div className={style.commonColumnData}>
                        <img
                          className={style.menuImage}
                          src={config.staticBaseURL + menuDetails.icon}
                        />
                      </div>
                      <div className={style.commonColumnData} style={{ wordBreak: "break-word" }}>
                        {menuDetails.name}
                      </div>

                      <div className={style.commonColumnData}>
                        <button
                          type="button"
                          className="desk-toggle"
                          title={menuDetails.is_active ? "Hide this menu" : "Show this menu"}
                          onClick={() => toggleMenu(menuDetails)}
                        >
                          {menuDetails.is_active == true ? (
                            <MdCheckCircle className={style.yesIcon} />
                          ) : (
                            <MdCancel className={style.noIcon} />
                          )}
                        </button>
                      </div>

                      <div
                        className={`${style.commonColumnData}`}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          className={` ${style.primaryButton}`}
                          onClick={() => openMenuDetails(menuDetails.id)}
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

export default Menu;
