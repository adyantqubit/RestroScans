import React, { useEffect, useState } from "react";
import style from "../style/category.module.css";
import { loadCategoryCount, loadCategoryPage, rememberPage, setCategoryActive, toggleSort, storedPage } from "../../services/categoryService";
import { useCategoryState } from "../../usestate/categoryState";
import RecordPage from "../../../../components/RecordPage/RecordPage";
import CategoryForm from "../components/CategoryForm";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
  BsSortNumericDownAlt,
  BsSortNumericDown,
} from "react-icons/bs";

import { MdCancel, MdCheckCircle } from "react-icons/md";

import config from "../../../../config/config";
import defaultIcon from "../../../../images/no-category.jpg"
import { useApp } from "../../../../Context/AppContext";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const Category = () => {
  const { enableHeader, Message } = useApp();
  const {
    count: backendCategoryCount,
    setCount: setBackendCategoryCount,
    rows: categoryList,
    setRows: setCategoryList,
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
  } = useCategoryState();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    enableHeader()

    const page = storedPage();
    if (page) {
      setCurrentPage(page);
    }
    getCountOfCategory();
    getListOfCategory(page || currentPage);
  }, []);

  useEffect(() => {
    getListOfCategory();
  }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage, statusFilter]);

  const getCountOfCategory = async () => {
    setBackendCategoryCount(await loadCategoryCount());
  };

  const getListOfCategory = async (page = currentPage) => {
    const response = await loadCategoryPage({
      currentPage: page,
      listPerPage,
      columnToSort,
      columnSortingOrder,
      searchText,
      filters: statusFilter === "all" ? undefined : { is_active: statusFilter === "true" },
    });
    setCategoryList(response.rows);
    setBackendCategoryCount(response.count);
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

  const toggleCategory = async (category) => {
    const next = !category.is_active;
    const saved = await setCategoryActive(category.id, next);
    if (saved) {
      Message(next ? `${category.name} is on` : `${category.name} is hidden`, "success");
      getListOfCategory();
    } else {
      Message("Could not update this category", "warning");
    }
  };

  const openCategoryDetails = (id) => {
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
      title="Categories"
      formOpen={formOpen}
      formTitle={editingId ? "Edit category" : "New category"}
      onToggleForm={() => setFormOpen((open) => !open)}
      onCreate={() => openCategoryDetails(null)}
      createLabel="New category"
      form={formOpen ? (
        <CategoryForm
          key={editingId || "new"}
          embedded
          recordId={editingId}
          onSaved={() => {
            closeForm();
            getListOfCategory();
          }}
          onClose={closeForm}
        />
      ) : null}
      searchPlaceholder="Search by name or menu"
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
      total={backendCategoryCount}
      currentPage={currentPage}
      listPerPage={listPerPage}
      onPageChange={handlePageChange}
      setListPerPage={setListPerPage}
      setCurrentPage={setCurrentPage}
      hasRows={Boolean(categoryList && categoryList.length > 0)}
    >
      <div className={style.categoryListSection}>
        <div className={style.tableContainer}>
          <div className={style.table}>
            <div className={style.tableHeadingContainer}

              onClick={hideDropdown}
              onTouchStart={hideDropdown}
            >
              <div className={style.commonColumnTitle}>Icon </div>

              <div
                className={style.commonColumnTitle}
                onClick={(e) => {
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
                  sortMenuList("menu");
                }}
                onMouseEnter={(e) => {
                  if (columnToSort != "menu") {
                    setShowSortingIcon(true);
                  }
                }}
                onMouseLeave={(e) => {
                  if (columnToSort != "menu") {
                    setShowSortingIcon(false);
                  }
                }}
              >
                Menu name
                {columnToSort == "menu" &&
                  columnSortingOrder == "ascending" && (
                    <BsSortAlphaDown className={style.sortingIcon} />
                  )}
                {columnToSort == "menu" &&
                  columnSortingOrder == "descending" && (
                    <BsSortAlphaDownAlt className={style.sortingIcon} />
                  )}
                {columnToSort != "menu" && showSortingIcon && (
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
                }}
              >
                Available{" "}
                {columnToSort == "is_active" &&
                  columnSortingOrder == "ascending" && (
                    <MdCancel className={style.sortingIconNA} />
                  )}
                {columnToSort == "is_active" &&
                  columnSortingOrder == "descending" && (
                    <MdCheckCircle className={style.sortingIconA} />
                  )}
                {columnToSort != "is_active" && showSortingIcon && (
                  <MdCancel color="grey" className={style.sortingIconA} />
                )}
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
              {categoryList != null && categoryList.length > 0 ? (
                categoryList.map((categoryDetails, index) => {
                  return (
                    <div
                      key={index}
                      className={style.tableData}
                      style={{
                        padding: "2px",
                        marginTop: "2px",
                        marginBottom:
                          categoryList.length == index + 1 ? "2px" : "0px",
                      }}
                    >
                      <div className={style.commonColumnData}>
                        <img
                          className={style.categoryImage}
                          src={categoryDetails.icon ? config.staticBaseURL + categoryDetails.icon : defaultIcon}
                        />
                      </div>
                      <div className={style.commonColumnData} style={{ wordBreak: "break-word" }}>
                        {categoryDetails.name}
                      </div>

                      <div className={style.commonColumnData}>
                        {categoryDetails.menu_name}
                      </div>

                      <div className={style.commonColumnData}>
                        <button
                          type="button"
                          className="desk-toggle"
                          title={categoryDetails.is_active ? "Hide this category" : "Show this category"}
                          onClick={() => toggleCategory(categoryDetails)}
                        >
                          {categoryDetails.is_active == true ? (
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
                          onClick={() =>
                            openCategoryDetails(categoryDetails.id)
                          }
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

export default Category;
