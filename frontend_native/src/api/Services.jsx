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

// ---------------------- Menu API -------------------------- //
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

// Added by Yuvraj Sahu on 6-4-2023
// Reason - to update menu
export const updateMenuApi = async (value, tenant, id) => {
  const response = await API.put(`/api/v1/${tenant}/menu-list/${id}/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of update menu
// -------------------------- End Menu API ----------------------- //


// ------------------------------- Category API --------------------------- //
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
// Reason - to update category
export const updateCategoryApi = async (value, tenant, id) => {
  const response = await API.put(`/api/v1/${tenant}/category/${id}/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End update category
// --------------------- End Category API ---------------------------- //


// ------------------------ Item API -------------------------------- //
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

// Added by Yuvraj Sahu on 6-4-2023
// Reason - to update item
export const updateItemApi = async (value, tenant, id) => {
  const response = await API.put(`/api/v1/${tenant}/item/${id}/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End saving item
// ----------------------- End of Item API ---------------------------- //


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


// Added by Yuvraj Sahu on 6-4-2023
// Reason - to get all menu list
export const getAllMenuList = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/all-menus/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End getting menu list

// Added by Om on 6-4-2023
// Reason - to delete menu
export const deleteMenuApi = async ( tenant, id) => {
  const response = await API.delete(`/api/v1/${tenant}/menu-list/${id}/`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of deletion menu
// -------------------------- End Menu API ----------------------- //

// Added by Om on 6-4-2023
// Reason - to delete category
export const deleteCategoryApi = async ( tenant, id) => {
  const response = await API.delete(`/api/v1/${tenant}/category/${id}/`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of deletion category
// -------------------------- End Category API ----------------------- //

// Added by Om on 6-4-2023
// Reason - to delete items
export const deleteItemApi = async ( tenant, id) => {
  const response = await API.delete(`/api/v1/${tenant}/item/${id}/`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of deletion items
// -------------------------- End Items API ----------------------- //

// Added by Om on 8-4-2023
// Reason - to get all offers
export const getAllOfferList = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/offer-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End getting offers

// Added by Om on 8-4-2023
// Reason - to get all offers
export const getAllOfferItemList = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/offer-items-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End getting offers

// Added by Om on 8-4-2023
// Reason - to post all offers

export const saveAllOffer = async (value, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/offer-details/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End getting offers

// Added by Om on 8-4-2023
// Reason - to edit all offers
export const updateAllOffer = async (value, tenant,id) => {
  const response = await API.put(`/api/v1/${tenant}/offer-details/${id}/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End getting offers

// Added by Om on 8-4-2023
// Reason - to post all offers items
export const saveAllOfferItems = async (value, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/offer-items-details/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End getting offers

// Added by Om on 8-4-2023
// Reason - to edit all offers
export const updateAllOfferItems = async (value, tenant,id) => {
  const response = await API.put(`/api/v1/${tenant}/offer-items-details/${id}/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End getting offers



// ------------------------ App Setting API -------------------------------- //
// Added by Yuvraj Sahu on 8-4-2023
// Reason - to save app setting
export const saveSettingApi = async (value, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/app-theme/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End saving setting


// Added by Yuvraj Sahu on 8-4-2023
// Reason - to save app setting
export const getSettingApi = async (tenant) => {
  const response = await API.get(`api/v1/${tenant}/app-theme/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End saving setting
// --------------------- End of app setting API ----------------------


// This function is used to call
// API for get all orders from backend
// Added by Yuvraj Sahu on 9-4-2023
// Reason - to get all orders
export const getOrdersApi = async (tenant) => {
  const response = await API.get(`api/v1/${tenant}/all-orders/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of getting all orders


// This function is used to call
// API for get all items of that perticular order from backend
// Added by Yuvraj Sahu on 9-4-2023
// Reason - to get order items
export const getOrderItemsApi = async (tenant, id) => {
  const response = await API.get(`api/v1/${tenant}/order-items/${id}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of getting all orders