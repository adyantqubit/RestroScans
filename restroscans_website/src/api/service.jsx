import API from "./api";

// Added by:- Suman sahu On 08/04/2023
// Reason:- Created API for get Pricing plans details

export const PricingPlansGetApi = async () => {
  const response = await API.get("get-pricing-plans/", {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// End of added code 08/04/2023

// Added by:- Suman sahu On 09/04/2023
// Reason:- Created API for get Pricing plans details

export const GalleryDetailsGetApi = async () => {
  const response = await API.get("get-gallery-details/", {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// End of added code 08/04/2023

// Added by:- Suman sahu On 13/04/2023
// Reason:- Created API for for post GetRestroscans Requests

export const RestaurantRequestPostApi = async (data) => {
  const response = await API.post("registration-request/", data, {
    headers: { "Content-Type": "application/json" },
  }).catch((err) => console.error("Registration failed"));
  return response ? response.data : {};
};
// End of added code 13/04/2023

// Added by:- Suman sahu On 14/04/2023
// Reason:- Created API for for post ContactUs Requests

export const ContactUsPostApi = async (data) => {
  const response = await API.post("contact-us-request/", data, {
    headers: { "Content-Type": "application/json" },
  }).catch((err) => console.error("Registration failed"));
  return response ? response.data : {};
};
// End of added code 14/04/2023

// Added by:- Suman sahu On 19/04/2023
// Reason:- Created Api for get Top Restuarent details which is connected with us

export const OurTopRestaurentGetApi = async () => {
  const response = await API.get("restaurent-patners-details/", {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// End of added code 19/04/2023

// Added by:- Suman sahu On 17/05/2023
// Reason:- Created API for get Pricing plans details

export const PricingPlansDetailGetApi = async () => {
  const response = await API.get("get-pricing-plans-details/", {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// End of added code 08/04/2023