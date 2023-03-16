import API from "./API";

// -------------------------- FOR SHOW THE TENANT DETAILS -------------------------

export const gettenantList = async (tenantId) => {
  const response = await API.get(`/${tenantId}/tenant-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// -------------------------- FOR SHOW THE MENU LIST -------------------------

export const getmenuList = async (tenantId) => {
  const response = await API.get(`/${tenantId}/menu-list/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// -------------------------- FOR SHOW THE OFFER LIST -------------------------

export const getofferDetails = async (tenantId) => {
  const response = await API.get(`/${tenantId}/offer-details/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// -------------------------- FOR SHOW THE FOOTER AND DESCRIPTION -------------------------

export const getfooterDetails = async (tenantId) => {
  const response = await API.get(`/${tenantId}/footer-description/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

// -------------------------- FOR SHOW THE FOOTER AND DESCRIPTION -------------------------

export const getThemeChanges = async (tenantId) => {
  const response = await API.get(`/${tenantId}/setting-changes/color/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  console.log(response)
  return response ? response.data : {};
};