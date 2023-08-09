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

  // Added by :- Rohan kansari
// Date :- 13-07-2023
// Reason :- Post API for update orders
export const postUpdateOrderItemsApi = async(tenantId,updateOrderItems) => {
  const response = await API.put(`/api/v1/${tenantId}/update_order_items/`,updateOrderItems,
  {headers : {'Content-Type':'application/json'}}).catch(
      err => console.log(err))
  return response ? response.data: {}
}
// End of added code by :- Added by :- Rohan kansari - 13-07-2023


  
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


/**
 * Added by - Yuvraj Sahu on 23-06-2023
 * Reason - To get item count
 */
export const getItemCount = async (tenantId) => {
  const response = await API.get(`api/v1/${tenantId}/item-count/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * Ent of code adition by - Yuvraj Sahu on 23-06-2023
 * Reason - To get item count
 */


/**
 * Added by - Yuvraj Sahu on 23-06-2023
 * Reason - To get item list of tenant.
 */
export const getItemList = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/item-list-v2/`, filteringCriteria,{
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Yuvraj Sahu on 23-06-2023.
 * Reason - To get item list of tenant.
 */ 


/**
 * Added by - Yuvraj Sahu on 23-06-2023
 * Reason - To get item data by id.
 */
export const getItemDetails = async (tenantId,itemId) => {
  const response = await API.get(`/api/v1/${tenantId}/item-details/${itemId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by Yuvraj Sahu on 23-06-2023
 * Reason -  To get item data by id.
 * */ 


/**
 * Added by - Yuvraj Sahu on 23-06-2023
 * Reason - To get all category from database.
 */
export const getCategoriesAPI = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/get-categories/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by Yuvraj Sahu on 23-06-2023
 * Reason -  To get categories.
 * */ 


/**
 * Added by - Yuvraj Sahu on 23-06-2023
 * Reason - To save item details
 */
export const postItemDetails = async (tenant,values) => {
  const response = await API.post(`/api/v1/${tenant}/item-details/`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by - Yuvraj Sahu on 23-06-2023.
 * Reason - To save item details
 */

// Added by Om shrivastava on 24-06-2023
// Reason - to post added order items

export const postOrderItemsApi = async (data, tenant) => {
  const response = await API.post(`/api/v1/${tenant}/add_order_items/`, data, {
    headers: {
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  // console.log(response,'Post the add more items.. sucessfully')
  return response ? response.data : {};
};

export const getAllMenuList = async (tenantId) => {
  const response = await API.get(`/api/v1/${tenantId}/all-menus/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

export const getOrderItemsApi = async (tenant, id) => {
  const response = await API.get(`api/v1/${tenant}/order-items/${id}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End of added code by Om shrivastava on 24-06-23

// Added by Om Shrivastava on 16-06-23
// Reason - to get all social media
export const getOrderItemCountApi = async (tenant) => {
  const response = await API.get(`/api/v1/${tenant}/order-item-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  // console.log(response.data)
  return response ? response.data : {};
};

export const getOrdersItemDetailApi = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/order-item-list-v2/`, filteringCriteria, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  // console.log(response.data,'++++++++++++++++++++++')
  return response ? response.data : {};
};

// Added by Om on 30-06-2023
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

// Added by Om Shrivastava on 30-06-23
// Reason - to get all order-items details and need to save
export const getOrderItemDataApi = async (tenant) => {
  const response = await API.get(`/api/v1/${tenant}/order-item-data/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  console.log(response.data,'get order item details for post')
  return response ? response.data : {};
};

export const saveOrderItemDetailsApi = async (tenant,value) => {
  const response = await API.post(`/api/v1/${tenant}/order-item-data/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  console.log(response.data,'post the order item details')
  return response ? response.data : {};
};

export const getOrderItemDataShowApi = async (tenant) => {
  const response = await API.get(`/api/v1/${tenant}/order-item-show/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  // console.log(response.data)
  return response ? response.data : {};
};
// End of addition by Om Shrivastava on 30-06-23

// ------------------------------- Payment method API --------------------------- //
// Added by Parineeta Gedam on 12-07-2023
// Reason - to save payment method
export const savePaymentMethodApi = async (tenant,value) => {
  const response = await API.post(`/api/v1/${tenant}/get-scanner/`, value, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End saving payment method

// ------------------------------- Payment method API --------------------------- //
// Added by Parineeta Gedam on 27-4-2023
// Reason - to get payment method
export const getPaymentMethodApi = async (tenant) => {
  const response = await API.get(`/api/v1/${tenant}/get-scanner/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
// End getting payment method

/**
 * Added by - Om Shrivastava on 24-07-2023
 * Reason - To get rating and review count for restaurant
 */
export const getRestaurantRatingReviewCount = async (tenantId) => {
  const response = await API.get(`api/v1/${tenantId}/restaurant-rating-count/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/** 
 * Ent of code adition by - Om Shrivastava on 24-07-2023
 * Reason - To get rating and review count for restaurant
 */
 
/**
 * Added by - Om Shrivastava on 24-07-2023
 * Reason - To get rating and review list of tenant.
 */
export const getRestaurantRatingReviewList = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/restaurant-rating-list/`, filteringCriteria,{
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by Om Shrivastava on 24-07-2023.
 * Reason - To get rating and review list of tenant.
 */ 

/**
 * Added by - Om Shrivastava on 24-07-2023
 * Reason - To get offer/banner count for restaurant
 */
export const getOfferBannerCount = async (tenantId) => {
  const response = await API.get(`api/v1/${tenantId}/offer-banner-count/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/** 
 * Ent of code adition by - Om Shrivastava on 24-07-2023
 * Reason - To get offer/banner count for restaurant
 */
 
/**
 * Added by - Om Shrivastava on 05-08-23
 * Reason - To get offer/banner banner list
 */
export const getOfferBannerList = async (tenant,filteringCriteria) => {
  const response = await API.post(`api/v1/${tenant}/offer-banner-list/`, filteringCriteria,{
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};
/**
 * End of code addition by Om Shrivastava on 05-08-23.
 * Reason - To get offer/banner banner list
 */ 

/**
 * Added by - Om Shrivastava on 06-08-23
 * Reason - To save the offer data
 */
export const getofferDetails = async (tenantId,offerId) => {
  const response = await API.get(`/api/v1/${tenantId}/offer-banner-details/${offerId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  console.log(response)
  return response ? response.data : {};
};

export const postOfferBannerDetails = async (tenant,values) => {
  const response = await API.post(`/api/v1/${tenant}/offer-banner-save/`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).catch((err) => console.log(err));
  console.log(response)

  return response ? response.data : {};
};

/**
 * End of code addition by - Om Shrivastava on 06-08-23.
 * Reason - To update item details
 */

// added by Rohan kansari - 7/8/23 
// Reason - To post newly created order
export const postCustomerDetails = async(formdata,tenantId) => {
 
    const response = await API.post(`api/v1/${tenantId}/customer-details/`,formdata,
    {headers : {'Content-Type':'application/json'}}).catch(
        err => console.log(err))
    return response ? response.data: {}
  }

// End of code - Rohan kansari - 7/8/23