import React, { useEffect, useState } from "react";
import style from "./revenue.module.css";
import Header from "../GlobalComponent/Header";
import { getOrderReport, getTotalRevenueDetails } from "../../Api/services";
import { FaRupeeSign } from "react-icons/fa";
import { Select, Space } from "antd";
import { enableHeader } from "../../App";

const Revenue = () => {
  const [data, setData] = useState();
  const [todaySummary, setTodaySummary] = useState();
  const [thisWeekSummary, setThisWeekSummary] = useState();
  const [thisMonthSummary, setThisMonthSummary] = useState();
  const [thisYearSummary, setThisYearSummary] = useState();
  const [totalDashboardRevenue, setTotalDashboardRevenue] = useState();

  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Rohan kansari - 25/6/23
    TotalRevenueDetails();
    OrderReport();
  }, []);

  // added by - Suman sahu On 27/05/2023
  // reason - get Order Report
  async function OrderReport() {
    const response = await getOrderReport(
      JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
    );
    if (response) {
      // console.log("+++++++++++++++++++++++", response);
      setData(response)
      setTodaySummary(response.revenue_details.todays_summary);
      setThisWeekSummary(response.revenue_details.this_weeks_summary);
      setThisMonthSummary(response.revenue_details.this_months_summary);
      setThisYearSummary(response.revenue_details.this_years_summary);
    }
  }
  // end of addition by - Suman sahu On 27/05/2023

  // added by - Suman sahu On 28/05/2023
  // reason - get restaurent dashboard data(total menu, item and category)
  async function TotalRevenueDetails() {
    const response = await getTotalRevenueDetails(
      JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
    );
    if (response) {
      setTotalDashboardRevenue(response.revenue_details);
    }
  }
  // end of addition by - Suman sahu On 28/05/2023

  return (
   // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.Container}>
      <h3 className={style.heading}>Restaurant Dashboard</h3>
      <div className={style.Restaurant_dashboard_section}>
        <div className={style.dashboard_container}>
          {totalDashboardRevenue ? (
            <div className={style.dashboard_upper_div1}>
              {totalDashboardRevenue.totalCategories}
            </div>
          ) : null}
          <h2 className={style.dashboard_lower_div}>Total Listed Menus</h2>
        </div>

        <div className={style.dashboard_container}>
          {totalDashboardRevenue ? (
            <div className={style.dashboard_upper_div1}>
              {totalDashboardRevenue.totalSubCategories}
            </div>
          ) : null}
          <h2 className={style.dashboard_lower_div}>
            Total Listed Categories
          </h2>
        </div>

        <div className={style.dashboard_container}>
          {totalDashboardRevenue ? (
            <div className={style.dashboard_upper_div1}>
              {totalDashboardRevenue.totalItems}
            </div>
          ) : null}
          <h2 className={style.dashboard_lower_div}>Total Listed Items</h2>
        </div>
      </div>
      <h1 className={style.heading}>Revenue Details</h1>
      <div className={style.custom_container}>
        <label className={style.custom_label}>Custom</label>
        <div>
          <span>From:&nbsp;</span>{" "}
          <input
            className={style.start_date}
            id="start_date"
            type="date"
            name="fav_language"
          />
          &nbsp;&nbsp;&nbsp;&nbsp; <span>To:&nbsp;</span>
          <input
            className={style.end_date}
            id="end_date"
            type="date"
            name="fav_language"
          />
        </div>
      </div>
      <div className={style.revenue_main_section}>
        <div className={style.revenue_first_div}>
          <div className={style.revenue_container}>
            <h1 className={style.primary_heading}>Today's Revenue</h1>
            <h2>Total Orders</h2>

            {todaySummary ? (
              <div className={style.order_count}>
                {todaySummary.order_count}
              </div>
            ) : null}
            <h2>Total Revenue</h2>
            {todaySummary ? (
              <div className={style.total_revenue}>
                <FaRupeeSign />
                {/* Modified by Rohan kansari - 28/6/23
                    Reason - to show float with 2 decimal point */}
                {todaySummary.total_revenue.toFixed(2)}
              </div>
            ) : null}
            <div className={style.btn_div}>
              <button className={style.order_report_btn}>
                View Order Report
              </button>
            </div>
            <div className={style.btn_div}>
              <button className={style.item_report_btn}>
                View Item Report
              </button>
            </div>
          </div>

          <div className={style.revenue_container}>
            <h1 className={style.primary_heading}>This Week's Revenue</h1>
            <h2>Total Orders</h2>

            {thisWeekSummary ? (
              <p className={style.order_count}>
                {thisWeekSummary.order_count}
              </p>
            ) : null}
            <h2>Total Revenue</h2>
            {thisWeekSummary ? (
              <p className={style.total_revenue}>
                <FaRupeeSign />
                {/* Modified by Rohan kansari - 28/6/23
                    Reason - to show float with 2 decimal point */}
                {thisWeekSummary.total_revenue.toFixed(2)}
              </p>
            ) : null}
            <div className={style.btn_div}>
              <button className={style.order_report_btn}>
                View Order Report
              </button>
            </div>
            <div className={style.btn_div}>
              <button className={style.item_report_btn}>
                View Item Report
              </button>
            </div>
          </div>
        </div>

        <div className={style.revenue_second_div}>
          <div className={style.revenue_container}>
            <h1 className={style.primary_heading}>This Month's Revenue</h1>
            <h2>Total Orders</h2>

            {thisMonthSummary ? (
              <p className={style.order_count}>
                {thisMonthSummary.order_count}
              </p>
            ) : null}
            <h2>Total Revenue</h2>
            {thisMonthSummary ? (
              <p className={style.total_revenue}>
                <FaRupeeSign />
                {/* Modified by Rohan kansari - 28/6/23
                    Reason - to show float with 2 decimal point */}
                {thisMonthSummary.total_revenue.toFixed(2)}
              </p>
            ) : null}
            <div className={style.btn_div}>
              <button className={style.order_report_btn}>
                View Order Report
              </button>
            </div>
            <div className={style.btn_div}>
              <button className={style.item_report_btn}>
                View Item Report
              </button>
            </div>
          </div>

          <div className={style.revenue_container}>
            <h1 className={style.primary_heading}>This Year's Revenue</h1>
            <h2>Total Orders</h2>

            {thisYearSummary ? (
              <p className={style.order_count}>
                {thisYearSummary.order_count}
              </p>
            ) : null}
            <h2>Total Revenue</h2>
            {thisYearSummary ? (
              <p className={style.total_revenue}>
                <FaRupeeSign />
                {/* Modified by Rohan kansari - 28/6/23
                    Reason - to show float with 2 decimal point */}
                {thisYearSummary.total_revenue.toFixed(2)}
              </p>
            ) : null}
            <div className={style.btn_div}>
              <button className={style.order_report_btn}>
                View Order Report
              </button>
            </div>
            <div className={style.btn_div}>
              <button className={style.item_report_btn}>
                View Item Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </Header>
  );
};

export default Revenue;
