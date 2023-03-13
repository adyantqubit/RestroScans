import React from "react";

// const baseURL="http://api.moreshop.co.in:8000"
const baseURL="http://192.168.1.25:8000"


const config={
    // siteURL:"http://moreshop.co.in:8000",
    siteURL:"http://192.168.1.25:8000",
    apiBaseURL:`${baseURL}/api/v1`,
    staticBaseURL:`${baseURL}`,
    apiTimeout: 500000
}
export default config;