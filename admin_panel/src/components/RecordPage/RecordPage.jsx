import { useEffect, useRef, useState } from "react";
import CustomButton from "../erp/CustomButton";
import CustomListPagination from "../erp/CustomListPagination";
import CustomListToolbar from "../erp/CustomListToolbar";

export default function RecordPage({
  title,
  showForm = true,
  formOpen = false,
  formSectionRef,
  formTitle = "Create or edit",
  onToggleForm,
  onCreate,
  createLabel = "New",
  collapsedFormLabel = "Show form",
  form,
  searchPlaceholder = "Search",
  onSearch,
  filterValue,
  filterOptions,
  onFilter,
  filterLabel = "Filter",
  secondaryFilterValue,
  secondaryFilterOptions,
  onSecondaryFilter,
  secondaryFilterLabel = "Filter",
  toolbarExtra,
  total,
  currentPage,
  listPerPage,
  onPageChange,
  setListPerPage,
  setCurrentPage,
  children,
}) {
  const [text, setText] = useState("");
  const skipSearch = useRef(true);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;
  const idPrefix = String(title || "list").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "list";
  const pageSize = Number(listPerPage) || 10;
  const totalCount = Number(total) || 0;
  const filters = [
    filterOptions ? { id: "filter", label: filterLabel, value: filterValue, onChange: onFilter, options: filterOptions } : null,
    secondaryFilterOptions ? { id: "filter-2", label: secondaryFilterLabel, value: secondaryFilterValue, onChange: onSecondaryFilter, options: secondaryFilterOptions } : null,
  ].filter(Boolean);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return undefined;
    }
    const timer = setTimeout(() => {
      if (onSearchRef.current) onSearchRef.current(text);
    }, 300);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="custom-screen-page-stack">
      <div className="page-header">
        <div className="page-header__title-wrap">
          <h2 className="page-header__title">{title}</h2>
        </div>
        <div className="page-header__meta">
          {showForm && onCreate ? (
            <CustomButton type="button" onClick={onCreate}>{createLabel}</CustomButton>
          ) : null}
          <span className="page-chip">{totalCount} records</span>
        </div>
      </div>

      {showForm ? (
        <section ref={formSectionRef} className={`custom-screen-section custom-screen-section--form${formOpen ? "" : " custom-screen-section--collapsed"}`}>
          <div className="erp-list-section-head">
            <div className="erp-list-section-head__copy">
              <strong>{formTitle}</strong>
            </div>
            <CustomButton type="button" className="button-secondary-style" onClick={onToggleForm}>
              {formOpen ? "Hide form" : collapsedFormLabel}
            </CustomButton>
          </div>
          {formOpen ? form : null}
        </section>
      ) : null}

      <section className="custom-screen-section custom-screen-section--table">
        <CustomListToolbar
          idPrefix={idPrefix}
          search={text}
          onSearchChange={setText}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
        />
        {toolbarExtra ? <div className="custom-item-filters-row">{toolbarExtra}</div> : null}
        <div className="table-wrapper">{children}</div>
        <CustomListPagination
          idPrefix={idPrefix}
          page={currentPage || 1}
          totalPages={Math.max(1, Math.ceil(totalCount / pageSize))}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={(size) => {
            if (setListPerPage) setListPerPage(size);
            if (setCurrentPage) setCurrentPage(1);
            localStorage.setItem("listPerPage", String(size));
          }}
        />
      </section>
    </div>
  );
}
