export const DEFAULT_PER_PAGE = 10;

// Rows per page last chosen by the user. A first visit or a page opened by URL has nothing stored yet,
// so fall back to 10 instead of a blank value that shows "NaN / NaN" in the pager.
export function storedPerPage() {
  const saved = parseInt(localStorage.getItem("listPerPage"), 10);
  return saved > 0 ? saved : DEFAULT_PER_PAGE;
}
