import { useEffect, useState } from "react";
import siteConfig from "../../../../config/config";

function tenantFromHost() {
  const hostname = window.location.hostname.toLowerCase();
  return hostname.endsWith(".restroscans.com") ? hostname.split(".")[0] : "";
}

export default function useRestaurantLoginBackground(enteredTenant) {
  const [backgroundUrl, setBackgroundUrl] = useState("");
  useEffect(() => {
    const tenant = tenantFromHost() || String(enteredTenant || "").trim().toLowerCase();
    if (!tenant) { setBackgroundUrl(""); return; }
    const controller = new AbortController();
    const base = String(siteConfig.staticBaseURL || "").replace(/\/+$/, "");
    fetch(`${base}/api/v1/login-background/`, {
      headers: {"X-Tenant": tenant}, signal: controller.signal, cache: "no-store",
    })
      .then(async response => {
        if (!response.ok) throw new Error(`Background API: HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (!controller.signal.aborted) {
          const url = data?.image_url || "";
          setBackgroundUrl(url.startsWith("data:image/jpeg;base64,") ? url : "");
        }
      })
      .catch(error => {
        if (error.name !== "AbortError") console.error("Login background:", error);
      });
    return () => controller.abort();
  }, [enteredTenant]);
  return backgroundUrl;
}
