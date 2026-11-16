import axios from "axios";
import * as siteConfig from "../config/config";
import { resolveTenantSlug } from "../utils/tenant";

const API = axios.create({
  baseURL: siteConfig.default.apiBaseURL,
  timeout: siteConfig.default.apiTimeout,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
});

API.interceptors.request.use(
  (config) => {
    const tenant = resolveTenantSlug();
    if (tenant) {
      config.headers["X-Tenant"] = tenant;
    }
    const orderToken = localStorage.getItem("orderToken");
    if (orderToken) {
      config.headers["X-Order-Token"] = orderToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** A message that is safe to show to a customer for a failed request. */
export function friendlyErrorMessage(error) {
  if (!error) return "Something went wrong. Please try again.";
  if (error.code === "ECONNABORTED") return "The request took too long. Please check your connection and try again.";
  if (!error.response) return "Unable to reach the restaurant. Please check your internet connection.";
  const data = error.response.data || {};
  if (typeof data.message === "string" && data.message) return data.message;
  if (error.response.status >= 500) return "Something went wrong. Please try again.";
  return "We could not complete that request. Please try again.";
}

API.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = friendlyErrorMessage(error);
    return Promise.reject(error);
  }
);

export default API;
