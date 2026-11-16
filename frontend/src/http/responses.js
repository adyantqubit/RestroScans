// Shared response handling for the page api modules.

export function readBody(response) {
  return response ? response.data : {};
}

export function quiet(err) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  return {};
}

/** Return the server's error body (e.g. ``{success: false, message}``) so the page can show it. */
export function errorBody(err) {
  if (err && err.response && err.response.data && typeof err.response.data === "object") {
    return err.response.data;
  }
  return { success: false, message: err && err.userMessage };
}
