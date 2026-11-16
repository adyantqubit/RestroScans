import { gettenantList as requestTenantList } from "../api/coverApi";

export function gettenantList(tenantId) {
  return requestTenantList(tenantId);
}
