import React from "react";
import { Pagination } from "../../ui";
import { MdArrowDropUp } from "react-icons/md";

// Page sizes offered next to the pager. A size is only offered once the list is longer than `over`,
// so a short list is not given a "50 / Page" choice. 20 and 10 are always available.
const PAGE_SIZES = [
  { size: 50, over: 40 },
  { size: 40, over: 30 },
  { size: 30, over: 20 },
  { size: 20 },
  { size: 10 },
];

const DROPDOWN_ID = "dropdown";

function toggleDropdown() {
  const menu = document.getElementById(DROPDOWN_ID);
  if (menu) menu.style.display = menu.style.display.length === 0 ? "block" : "";
}

export default function ListPagination({
  styles,
  hasRows,
  total,
  currentPage,
  listPerPage,
  onPageChange,
  setListPerPage,
  setCurrentPage,
}) {
  const choose = (option) => {
    setListPerPage(option.size);
    if (option.size !== 10) setCurrentPage(1);
    localStorage.setItem("listPerPage", option.size);
  };

  return (
    <div className={styles.paginationContainer}>
      {hasRows ? (
        <div className={styles.paginationContent}>
          <Pagination
            current={currentPage}
            total={total}
            defaultPageSize={listPerPage}
            pageSize={listPerPage}
            simple
            onChange={onPageChange}
          />
          <div className={styles.dropdown} onClick={toggleDropdown}>
            <button className={styles.dropbtn}>
              {listPerPage} / Page <MdArrowDropUp style={{ margin: "5px 0" }} />
            </button>
            <div className={styles.dropdown_content} id={DROPDOWN_ID}>
              {PAGE_SIZES.filter((option) => option.over === undefined || total > option.over).map((option) => (
                <span key={option.size} onClick={() => choose(option)}>
                  {option.size} / Page
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
