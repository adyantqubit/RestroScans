import {
  getfooterDetails as requestFooterDetails,
  getSocialLinks as requestSocialLinks,
} from "../api/footerApi";

export function getfooterDetails(tenantId) {
  return requestFooterDetails(tenantId);
}

export function getSocialLinks(tenantId) {
  return requestSocialLinks(tenantId);
}
