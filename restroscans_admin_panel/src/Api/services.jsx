import API from "./api";
import { domainURL } from "./config";



export const postRestaurantDetail = async (value) => {
    // alert("ppppppppp" + JSON.stringify(value));
    const response = await API.post(
      // `/admin_app/moreshop/registration-request/`,
      `admin_app/${domainURL}/registration-request/`,
      value,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ).catch((err) => console.log(err));
    return response ? response.data : {};
  };


  export const restaurentAuthentication = async (value) => {
    const response = await API.post(`/admin_app/${domainURL}/login/`, value, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
    return response ? response.data : {};
  };


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


  export const getDashboardData = async (tenantId) => {
    const response = await API.get(`/api/v1/${tenantId}/dashboard-data/`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
    return response ? response.data : {};
  };

  export const updateOrderAndPaymentStatus = async (tenant, status, orderID) => {
    const response = await API.put(`/api/v1/${tenant}/order-payment-status/${orderID}/`, status, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).catch((err) => console.log(err));
    return response ? response.data : {};
  };

  export const updateItemStatus = async (tenant, status, orderID) => {
    const response = await API.put(`/api/v1/${tenant}/order-item-status/${orderID}/`, status, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
    return response ? response.data : {};
  };


  
  export const tokenValidationAPI = async ( tokens) => {
    const response = await API.post(`/admin_app/${domainURL}/validate-token/`, tokens, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
    return response ? response.data : {};
  };