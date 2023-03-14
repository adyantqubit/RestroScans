import React from "react";

const baseURL="http://192.168.1.13:8000"

export const frontendUrl = "http://192.168.1.13:3000"

const config={
    siteURL:"192.168.1.13:8000",
    apiBaseURL:`${baseURL}/api/v1`,
    staticBaseURL:`${baseURL}`,
    imageUrl: `${baseURL}/media/`,
    apiTimeout: 500000
}
export default config;