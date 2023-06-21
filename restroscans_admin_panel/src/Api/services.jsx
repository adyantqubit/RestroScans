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
 * Modified by - Ashish Dewangan on 06-06-2023
 * Reason - to send criteria to backend based on which data will be retrieved.
 */
//export const getCustomerList = async (tenant) => {
//  const response = await API.get(`api/v1/${tenant}/all-customers/`, { 
export const getCustomerList = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/customer-list/`, filteringCriteria,{
/**
 * Modified by - Ashish Dewangan on 06-06-2023
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


// ------------------------------- Social media APIs --------------------------- //
// Added by Yuvraj Sahu on 29-05-2023
// Reason - to save social media
export const saveSocialMediaApi = async (value, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/social-links/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of addition by Yuvraj Sahu on 29-05-2023


// Added by Yuvraj Sahu on 29-05-2023
// Reason - to get all social media
export const getSocialMediaApi = async (tenant) => {
  const response = await API.get(`/api/v1/${tenant}/social-links/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of addition by Yuvraj Sahu on 29-05-2023


// Added by Yuvraj Sahu on 29-05-2023
// Reason - to delete social media
export const deteleSocialMediaApi = async (tenant, id) => {
  const response = await API.delete(`/api/v1/${tenant}/social-links/${id}`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of addition by Yuvraj Sahu on 29-05-2023


// Added by Yuvraj Sahu on 29-05-2023
// Reason - to update social media
export const updateSocialMediaApi = async (value, tenant, id) => {
  const response = await API.put(`/api/v1/${tenant}/social-links/${id}`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of addition by Yuvraj Sahu on 29-05-2023



/**
 * Added by - Ashish Dewangan on 12-06-2023
 * Reason - To get menu count
 */
export const getMenuCount = async (tenantId) => {
  const response = await API.get(`api/v1/${tenantId}/menu-count/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * Ent of code adition by - Ashish Dewangan on 12-06-2023
 * Reason - To get menu count
 */

/**
 * Added by - Ashish Dewangan on 12-06-2023
 * Reason - To get menu list of tenant.
 */
export const getMenuList = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/menu-list-v2/`, filteringCriteria,{
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Ashish Dewangan on 12-06-2023.
 * Reason - To get menu list of tenant.
 */ 

/**
 * Added by - Om Shrivastava on 15-06-2023
 * Reason - To get order list of tenant.
 */
export const getOrderCount = async (tenantId) => {
  const response = await API.get(`api/v1/${tenantId}/order-count/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

export const getOrdersApi = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/order-list-v2/`, filteringCriteria, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  // console.log(response.data,'++++++++++++++++++++++')
  return response ? response.data : {};
};
/**
 * End of code addition by - Om Shrivastava on 15-06-2023
 * Reason - To get order list of tenant
 */ 


/**
 * Added by - Ashish Dewangan on 15-06-2023
 * Reason - To get menu data by id.
 */
export const getMenuDetails = async (tenantId,menuId) => {
  const response = await API.get(`/api/v1/${tenantId}/menu-details/${menuId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

/**
 * End of code addition by Ashish Dewangan on 15-06-2023
 * Reason -  To get menu data by id.
 * */ 

/**
 * Added by - Ashish Dewangan on 16-06-2023
 * Reason - To save menu details
 */
export const postMenuDetails = async (tenant,values) => {
  const response = await API.post(`/api/v1/${tenant}/menu-details/`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Ashish Dewangan on 16-06-2023.
 * Reason - To save menu details
 */

// Added by Om Shrivastava on 16-06-23
// Reason - to get all social media
export const getOrderDetailsApi = async (tenant) => {
  const response = await API.get(`/api/v1/${tenant}/order-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

export const saveOrderDetailsApi = async (tenant,value) => {
  const response = await API.post(`/api/v1/${tenant}/order-details/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of addition by Om Shrivastava on 16-06-23


/**
 * Added by - Yuvraj Sahu on 16-06-2023
 * Reason - To get category count
 */
export const getCategoryCount = async (tenantId) => {
  const response = await API.get(`api/v1/${tenantId}/category-count/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * Ent of code adition by - Yuvraj Sahu on 16-06-2023
 * Reason - To get category count
 */


/**
 * Added by - Yuvraj Sahu on 16-06-2023
 * Reason - To get category list of tenant.
 */
export const getCategoryList = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/category-list-v2/`, filteringCriteria,{
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Yuvraj Sahu on 16-06-2023.
 * Reason - To get category list of tenant.
 */ 


/**
 * Added by - Yuvraj Sahu on 17-06-2023
 * Reason - To get category data by id.
 */
export const getCategoryDetails = async (tenantId,categoryId) => {
  const response = await API.get(`/api/v1/${tenantId}/category-details/${categoryId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by Yuvraj Sahu on 17-06-2023
 * Reason -  To get category data by id.
 * */ 


/**
 * Added by - Yuvraj Sahu on 17-06-2023
 * Reason - To get all menu from database.
 */
export const getMenusAPI = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/get-menus/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by Yuvraj Sahu on 17-06-2023
 * Reason -  To get menus.
 * */ 


/**
 * Added by - Yuvraj Sahu on 17-06-2023
 * Reason - To save category details
 */
export const postCategoryDetails = async (tenant,values) => {
  const response = await API.post(`/api/v1/${tenant}/category-details/`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Yuvraj Sahu on 17-06-2023.
 * Reason - To save category details
 */