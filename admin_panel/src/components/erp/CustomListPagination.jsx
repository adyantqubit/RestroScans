import { useEffect, useState } from "react";
import CustomLabel from "./CustomLabel";
import CustomSelect from "./CustomSelect";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

const PAGE_SIZES = [10, 20, 30, 40, 50];
const btn = "button-secondary-style custom-list-pagination-btn";
const btnSym = `${btn} custom-list-pagination-btn--symbol`;

function CustomListPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  idPrefix = "list",
}) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safePage = Math.min(Math.max(1, page || 1), safeTotalPages);
  const canPrev = safePage > 1;
  const canNext = safePage < safeTotalPages;
  const sizes = pageSizeOptions || PAGE_SIZES;
  const startRow = totalCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRow = totalCount === 0 ? 0 : Math.min(safePage * pageSize, totalCount);
  const [goToDraft, setGoToDraft] = useState(String(safePage));

  useEffect(() => {
    setGoToDraft(String(safePage));
  }, [safePage]);

  const goToPage = (target) => {
    const n = parseInt(String(target).trim(), 10);
    if (Number.isNaN(n)) {
      setGoToDraft(String(safePage));
      return;
    }
    const clamped = Math.min(Math.max(1, n), safeTotalPages);
    onPageChange(clamped);
    setGoToDraft(String(clamped));
  };

  return (
    <div className="custom-list-pagination">
      <div className="custom-list-pagination-toolbar">
        <span className="custom-list-pagination-meta">
          {totalCount === 0
            ? "No rows"
            : `Rows ${startRow}–${endRow} of ${totalCount} · Page ${safePage} of ${safeTotalPages}`}
        </span>
        <div className="custom-list-pagination-controls">
          <div className="custom-list-pagination-size">
            <CustomLabel htmlFor={`${idPrefix}_page_size`} text="Per page" className="custom-list-controls-label" />
            <CustomSelect
              id={`${idPrefix}_page_size`}
              className="erp-input-compact custom-list-controls-input"
              value={String(pageSize)}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {sizes.map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </CustomSelect>
          </div>
          <nav className="custom-list-pagination-nav" aria-label="Pagination">
            <CustomButton type="button" className={btnSym} disabled={!canPrev} onClick={() => onPageChange(1)} aria-label="First page">«</CustomButton>
            <CustomButton type="button" className={btnSym} disabled={!canPrev} onClick={() => onPageChange(safePage - 1)} aria-label="Previous page">‹</CustomButton>
            <CustomButton type="button" className={btnSym} disabled={!canNext} onClick={() => onPageChange(safePage + 1)} aria-label="Next page">›</CustomButton>
            <CustomButton type="button" className={btnSym} disabled={!canNext} onClick={() => onPageChange(safeTotalPages)} aria-label="Last page">»</CustomButton>
          </nav>
          <form className="custom-list-pagination-goto" onSubmit={(event) => { event.preventDefault(); goToPage(goToDraft); }}>
            <span className="custom-list-pagination-goto-label" id={`${idPrefix}_goto_hint`}>Go to</span>
            <CustomInput
              id={`${idPrefix}_goto_page`}
              type="number"
              min={1}
              max={safeTotalPages}
              className="erp-input-compact custom-list-pagination-page-input"
              value={goToDraft}
              onChange={(event) => setGoToDraft(event.target.value)}
              disabled={totalCount === 0}
              aria-label={`Page number, 1 to ${safeTotalPages}`}
            />
            <CustomButton type="submit" className={btn} disabled={totalCount === 0}>Go</CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomListPagination;
