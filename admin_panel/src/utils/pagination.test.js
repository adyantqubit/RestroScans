import { storedPerPage, DEFAULT_PER_PAGE } from "./pagination";

describe("storedPerPage", () => {
  beforeEach(() => localStorage.clear());

  it("falls back to 10 when nothing is stored, so the pager never shows NaN", () => {
    expect(storedPerPage()).toBe(DEFAULT_PER_PAGE);
  });

  it("returns the page size the user picked", () => {
    localStorage.setItem("listPerPage", "30");
    expect(storedPerPage()).toBe(30);
  });

  it("ignores a broken stored value", () => {
    localStorage.setItem("listPerPage", "null");
    expect(storedPerPage()).toBe(DEFAULT_PER_PAGE);
  });
});
