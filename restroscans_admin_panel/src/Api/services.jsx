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


  // Added by ROhan Kansari - 25/5/23
  // Reason - sending all selected order to update in one click

  export const updateAllOrderAPI = async ( tenant,orders) => {
    const response = await API.post(`/api/v1/${tenant}/all-order-status-update/`, orders, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
    return response ? response.data : {};
  };

  // End of code - Rohan KAnsari - 25/5/23
  
  
// Added by Suman sahu - 27/5/23
// Reason - API for get the order report
export const getOrderReport = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/revenue-order-report/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of code - Suman sahu - 27/5/23

// Added by Suman sahu - 28/5/23
// Reason - API for get total menu, item and category details
export const getTotalRevenueDetails = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/total-revenue-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of addition by Suman Sahu on 28-5-2023


 // Added by ROhan Kansari - 28/5/23
  // Reason - Sending query to generate report

  export const OrderFilterQueryAPI = async ( tenant,query) => {
    const response = await API.post(`/api/v1/${tenant}/all-order-report-query/`, query, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
    return response ? response.data : {};
  };

  // End of code - Rohan KAnsari - 28/5/23

    // Added by ROhan Kansari - 28/5/23
  // Reason - Sending query to generate report

  export const OrderItemFilterQueryAPI = async ( tenant,query) => {
    const response = await API.post(`/api/v1/${tenant}/all-order-item-report-query/`, query, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
    return response ? response.data : {};
  };

  // End of code - Rohan KAnsari - 28/5/23

/**
 * Added by - Ashish Dewangan on 01-06-2023
 * Reason - To get Setting data of tenant.
 */
export const getSettingsDetails = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/app-theme/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

/**
 * End of code addition by Ashish Dewangan on 01-06-2023.
 * Reason - to get setting data 
 * */ 

/**
 * Added by - Ashish Dewangan on 02-06-2023
 * Reason - To save settings
 */
export const postSettingsDetails = async (values, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/app-theme/`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Ashish Dewangan on 02-06-2023.
 * Reason - To save settings
 */

/**
 * Added by - Ashish Dewangan on 05-06-2023
 * Reason - To get customer count
 */
export const getCutomersCount = async (tenantId) => {
  const response = await API.get(`api/v1/${tenantId}/customers-count/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * Ent of code adition by - Ashish Dewangan on 05-06-2023
 * Reason - To get customer count
 */

/**
 * Added by - Ashish Dewangan on 03-06-2023
 * Reason - To get customer list of tenant.
 */
 
 /**
 * Modified by - Ashish Dewangan on 07-06-2023
 * Reason - to send criteria to backend based on which data will be retrieved.
 */
//export const getCustomerList = async (tenant) => {
//  const response = await API.get(`api/v1/${tenant}/all-customers/`, { 
export const getCustomerList = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/customer-list/`, filteringCriteria,{
/**
 * Modified by - Ashish Dewangan on 07-06-2023
 * Reason - to send criteria to backend based on which data will be retrieved.
 */  
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by Ashish Dewangan on 03-06-2023.
 * Reason - To get customer list of tenant.
 */ 