import React from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { act } from "react-dom/test-utils";
import { Pagination } from "../../ui";
import { MdArrowDropUp } from "react-icons/md";
import ListPagination from "./ListPagination";

global.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom has no matchMedia, which antd reads when it mounts.
window.matchMedia =
  window.matchMedia ||
  (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));

const styles = {
  paginationContainer: "paginationContainer",
  paginationContent: "paginationContent",
  dropdown: "dropdown",
  dropbtn: "dropbtn",
  dropdown_content: "dropdown_content",
};

function LegacyFooter({ rows, total, currentPage, listPerPage, handlePageChange, setListPerPage, setCurrentPage }) {
  return (
    <div className={styles.paginationContainer}>
      {rows && rows.length > 0 ? (
        <div className={styles.paginationContent}>
          <Pagination
            defaultCurrent={currentPage}
            current={currentPage}
            simple
            total={total}
            defaultPageSize={listPerPage}
            pageSize={listPerPage}
            onChange={handlePageChange}
          />
          <div className={styles.dropdown} onClick={() => {}}>
            <button className={styles.dropbtn}>
              {listPerPage} / Page <MdArrowDropUp style={{ margin: "5px 0" }} />
            </button>
            <div className={styles.dropdown_content} id="dropdown">
              {total > 40 ? <span href="#" onClick={() => {}}>50 / Page</span> : null}
              {total > 30 ? <span href="#" onClick={() => {}}>40 / Page</span> : null}
              {total > 20 ? <span href="#" onClick={() => {}}>30 / Page</span> : null}
              <span href="#" onClick={() => {}}>20 / Page</span>
              <span href="#" onClick={() => {}}>10 / Page</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const noop = () => {};
const markup = (element) => renderToStaticMarkup(element).replace(/ href="#"/g, "");

describe("ListPagination", () => {
  test.each([0, 5, 20, 21, 31, 41, 500])("renders what the inline footer rendered for %i rows", (total) => {
    const rows = total ? [{}] : [];
    const props = { currentPage: 2, listPerPage: 10 };
    const legacy = markup(<LegacyFooter rows={rows} total={total} {...props} handlePageChange={noop} />);
    const shared = markup(
      <ListPagination
        styles={styles}
        hasRows={rows.length > 0}
        total={total}
        onPageChange={noop}
        setListPerPage={noop}
        setCurrentPage={noop}
        {...props}
      />
    );
    expect(shared).toBe(legacy);
  });

  test("offers 50 / 40 / 30 only for long lists", () => {
    const labels = (total) =>
      markup(
        <ListPagination styles={styles} hasRows total={total} currentPage={1} listPerPage={10}
          onPageChange={noop} setListPerPage={noop} setCurrentPage={noop} />
      ).match(/\d+ \/ Page<\/span>/g);
    expect(labels(15)).toEqual(["20 / Page</span>", "10 / Page</span>"]);
    expect(labels(25)).toEqual(["30 / Page</span>", "20 / Page</span>", "10 / Page</span>"]);
    expect(labels(35)).toHaveLength(4);
    expect(labels(45)).toHaveLength(5);
  });

  describe("in the page", () => {
    let container;
    let root;
    const setListPerPage = jest.fn();
    const setCurrentPage = jest.fn();

    beforeEach(() => {
      localStorage.clear();
      setListPerPage.mockClear();
      setCurrentPage.mockClear();
      container = document.createElement("div");
      document.body.appendChild(container);
      root = createRoot(container);
      act(() => {
        root.render(
          <ListPagination styles={styles} hasRows total={100} currentPage={3} listPerPage={10}
            onPageChange={noop} setListPerPage={setListPerPage} setCurrentPage={setCurrentPage} />
        );
      });
    });

    afterEach(() => {
      act(() => root.unmount());
      container.remove();
    });

    const option = (text) => [...container.querySelectorAll("#dropdown span")].find((s) => s.textContent === text);

    test("choosing a size saves it, and goes back to page 1", () => {
      act(() => option("40 / Page").click());
      expect(setListPerPage).toHaveBeenCalledWith(40);
      expect(setCurrentPage).toHaveBeenCalledWith(1);
      expect(localStorage.getItem("listPerPage")).toBe("40");
    });

    test("choosing 10 keeps the current page, as before", () => {
      act(() => option("10 / Page").click());
      expect(setListPerPage).toHaveBeenCalledWith(10);
      expect(setCurrentPage).not.toHaveBeenCalled();
      expect(localStorage.getItem("listPerPage")).toBe("10");
    });

    test("the button opens and closes the list by its id, which other code relies on", () => {
      const menu = document.getElementById("dropdown");
      const dropdown = container.querySelector(".dropdown");
      act(() => dropdown.click());
      expect(menu.style.display).toBe("block");
      act(() => dropdown.click());
      expect(menu.style.display).toBe("");
    });
  });
});
