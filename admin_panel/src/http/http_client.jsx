import axios from "axios";
import siteConfig, { domainURL } from "../config/config";

const clientOptions = {
  baseURL: siteConfig.staticBaseURL,
  timeout: siteConfig.apiTimeout,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
};

const httpClient = axios.create(clientOptions);
const refreshClient = axios.create(clientOptions);

function storedTenant() {
  const tenant = localStorage.getItem("tenantName");
  if (tenant) return tenant;
  try {
    return (JSON.parse(localStorage.getItem("tenantInfo") || "{}") || {}).tenant_name || "";
  } catch (err) {
    return "";
  }
}

httpClient.interceptors.request.use(
  (config) => {
    // With an empty baseURL a path like "api/v1/x" would resolve against the current page URL.
    if (config.url && !/^(https?:)?\/\//i.test(config.url) && !config.url.startsWith("/")) {
      config.url = `/${config.url}`;
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenant = storedTenant();
    if (tenant && !config.headers["X-Tenant"]) {
      config.headers["X-Tenant"] = tenant;
    }
    // A preset Content-Type drops the multipart boundary, so file forms never parse.
    if (typeof FormData !== "undefined" && config.data instanceof FormData && config.headers) {
      if (typeof config.headers.delete === "function") config.headers.delete("Content-Type");
      else {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const FIELD_LABELS = {
  name: "Name",
  offer_name: "Offer name",
  discount: "Discount",
  offer_image: "Banner image",
  video_link: "Video link",
  contact_number: "Phone",
  email: "Email",
  gstin: "GSTIN",
  fssaino: "FSSAI number",
  cgst: "CGST",
  sgst: "SGST",
  whatsapp_number: "WhatsApp number",
  app_theme: "Menu colours",
  scanner: "QR image",
  icon: "Image",
  password: "Password",
  item_name: "Dish",
  non_field_errors: "Form",
  detail: "Request",
};

function fieldLabel(key) {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return String(key || "Field").replace(/_/g, " ");
}

const GENERIC_FAILURE = /^(error|something went wrong\.?|not saved)$/i;

function readable(text) {
  const value = String(text || "").trim();
  if (!value || GENERIC_FAILURE.test(value)) return "";
  return value;
}

function flattenErrors(value, key) {
  if (value == null || value === "" || typeof value === "boolean" || typeof value === "number") return [];
  if (typeof value === "string") {
    const label = key ? fieldLabel(key) : "";
    if (/this field is required|may not be blank|may not be null/i.test(value)) {
      return [label ? `${label} is required.` : value];
    }
    return [readable(label ? `${label}: ${value}` : value)];
  }
  if (Array.isArray(value)) return value.flatMap((item) => flattenErrors(item, key));
  if (typeof value === "object") return Object.entries(value).flatMap(([child, item]) => flattenErrors(item, child));
  return [readable(value)];
}

/** Turn a response body into one sentence. Works for a string, a field map, or an empty failure. */
export function explainFailure(body, fallback) {
  if (!body) return fallback;
  if (typeof body === "string") return readable(body) || fallback;
  const lines = [];
  if (typeof body.message === "string") lines.push(readable(body.message));
  if (typeof body.msg === "string" && body.msg !== "success") lines.push(readable(body.msg));
  if (typeof body.error === "string") lines.push(readable(body.error));
  else if (body.error) lines.push(...flattenErrors(body.error));
  if (!lines.filter(Boolean).length && body && typeof body === "object" && !body.msg && body.success === undefined) {
    lines.push(...flattenErrors(body));
  }
  const text = lines.filter(Boolean).join(" ");
  return text || fallback;
}

/** A message that is safe to show to staff for a failed request. */
export function friendlyErrorMessage(error) {
  if (!error) return "Something went wrong. Please try again.";
  if (error.code === "ECONNABORTED") return "The request took too long. Please check your connection and try again.";
  if (!error.response) return "Unable to reach the server. Please check your internet connection.";
  const data = error.response.data || {};
  const lines = [];
  if (typeof data.message === "string") lines.push(readable(data.message));
  if (typeof data.msg === "string" && data.msg !== "success") lines.push(readable(data.msg));
  if (data.error) lines.push(...flattenErrors(data.error));
  if (!lines.length && data && typeof data === "object") lines.push(...flattenErrors(data));
  const text = lines.filter(Boolean).join(" ");
  if (text) return text;
  if (error.response.status >= 500) return "The server could not save this. Please try again.";
  return "The server rejected this. Please check the fields and try again.";
}

const isAuthRequest = (url) => /\/admin_app\/|\/waiter-login\//.test(url || "");

let pendingRefresh = null;

function refreshTokens() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return Promise.resolve(null);
  if (!pendingRefresh) {
    const tenant = storedTenant();
    pendingRefresh = refreshClient
      .post(
        `/admin_app/${domainURL}/validate-token/`,
        { access: localStorage.getItem("token"), refresh },
        tenant ? { headers: { "X-Tenant": tenant } } : undefined
      )
      .then((response) => {
        const data = response && response.data;
        if (!data || !data.access_token) return null;
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        return data.access_token;
      })
      .catch(() => null)
      .finally(() => {
        pendingRefresh = null;
      });
  }
  return pendingRefresh;
}

function endSession() {
  const loginPage = localStorage.getItem("waiterData") ? "/WaiterLogin" : "/Login";
  localStorage.clear();
  if (window.location.pathname !== loginPage) {
    window.location.assign(loginPage);
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const sentToken = original.headers && original.headers.Authorization;
    if (error.response && error.response.status === 401 && sentToken && !isAuthRequest(original.url)) {
      if (!original._retried) {
        original._retried = true;
        const token = await refreshTokens();
        if (token) {
          original.headers.Authorization = `Bearer ${token}`;
          return httpClient(original);
        }
      }
      endSession();
    }
    error.userMessage = friendlyErrorMessage(error);
    if (process.env.NODE_ENV !== "production") {
      console.error("API request failed", original.method, original.url, error.response ? error.response.status : error.message);
    }
    return Promise.reject(error);
  }
);

export default httpClient;
