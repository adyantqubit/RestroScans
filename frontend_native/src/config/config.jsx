import React from "react";

const baseURL = "http://192.168.1.10:8000";

export const frontendUrl = "http://192.168.1.10:3000";

export const domainURL = "moreshop";

const config = {
  siteURL: "192.168.1.10:8000",
  apiBaseURL: `${baseURL}/api/v1`,
  staticBaseURL: `${baseURL}`,
  imageUrl: `${baseURL}/media/`,
  apiTimeout: 500000,
};
export default config;

// export var tenantName = "ashoka";

// export const getTenant = async () => {
//   var user = await SecureStore.getItemAsync("userData");
//   tenantName = JSON.parse(user).restaurant_name
//   // alert("data"+JSON.parse(user).restaurant_name);
//   // alert(tenant)
// };
