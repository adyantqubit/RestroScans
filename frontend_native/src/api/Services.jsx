import { domainURL } from "../config/config";
import API from "./API";

// Added by Yuvraj Sahu on 15-2-2023
// Reason - to get restaurant menu list
export const getMenuList = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/menu-list/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  // alert('menu list'+JSON.stringify(response.data))
  return response ? response.data : {};
};
// End getting menu list

// Added by Yuvraj Sahu on 15-2-2023
// Reason - to save restaurant registration data
export const postRestaurantDetail = async (value) => {
  // alert("ppppppppp" + JSON.stringify(value));
  const response = await API.post(
    // `/admin_app/moreshop/registration-request/`,
    `/admin_app/${domainURL}/registration-request/`,
    value,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  ).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of restaurant registration

// Added by Yuvraj Sahu on 15-2-2023
// Reason - to login restaurant
export const restaurentAuthentication = async (value) => {
  // alert("ppppppppp" + JSON.stringify(value));
  // const response = await API.post(`/admin_app/moreshop/login/`, value, {
  const response = await API.post(`/admin_app/${domainURL}/login/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of login

// Added by Yuvraj Sahu on 18-2-2023
// Reason - to send otp for forget password
export const sendOtpApi = async (value) => {
  // alert("ppppppppp" + JSON.stringify(value));
  // const response = await API.post(`/admin_app/moreshop/save-otp/`, value, {
  const response = await API.post(`/admin_app/${domainURL}/save-otp/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of send otp

// Added by Yuvraj Sahu on 18-2-2023
// Reason - to update password for reset password
export const updatePasswordApi = async (value) => {
  // alert("ppppppppp" + JSON.stringify(value));
  const response = await API.put(
    // `/admin_app/moreshop/update-password/`,
    `/admin_app/${domainURL}/update-password/`,
    value,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of update password

// Added by Yuvraj Sahu on 23-3-2023
// Reason - to save menu
export const saveMenuApi = async (value, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/menu-list/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of saving menu

// Added by Yuvraj Sahu on 23-3-2023
// Reason - to save category
export const saveCategoryApi = async (value, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/category/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End saving category

// Added by Yuvraj Sahu on 23-3-2023
// Reason - to save item
export const saveItemApi = async (value, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/item/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End saving item


export const getAppSetting = async (tenantId) => {
  // const response = await API.get(`/admin_app/moreshop/app-settings/`, {
  const response = await API.get(`/admin_app/${domainURL}/app-settings/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  // alert('menu list'+JSON.stringify(response.data))
  return response ? response.data : {};
};