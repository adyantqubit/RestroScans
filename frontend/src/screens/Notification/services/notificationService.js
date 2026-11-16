import { postFCMToken as requestFcmToken } from "../api/notificationApi";

export function postFCMToken(data, tenantId) {
  return requestFcmToken(data, tenantId);
}
