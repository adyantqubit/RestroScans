import React from "react";

const baseURL = "http://127.0.0.1:8000";

export const frontendUrl = "http://127.0.0.1:3000";


export const domainURL="restroscans";

// Added by - Suman sahu On 25/05/2023
// reason - create url for generate qr code 

export const localURL='192.168.1.10:3001';
export const HTTP_METHOD = "http://"

// end of addition by - Suman sahu On 25/05/2023

const config = {
  siteURL: "127.0.0.1:8000",
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
