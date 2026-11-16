import React, { useEffect } from "react";
import style from "../style/revenue.module.css";
import Header from "../../../../components/Header/Header";
import { loadOrderReport, loadRevenueTotals } from "../../services/revenueService";
import { FaRupeeSign } from "react-icons/fa";
import { useApp } from "../../../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { useRevenueState } from "../../usestate/revenueState";
import Screen from "../../../../components/erp/Screen";

const Revenue = () => {
  const { enableHeader } = useApp();
  var {
    data,
    setData,
    todaySummary,
    setTodaySummary,
    thisWeekSummary,
    setThisWeekSummary,
    thisMonthSummary,
    setThisMonthSummary,
    thisYearSummary,
    setThisYearSummary,
    totalDashboardRevenue,
    setTotalDashboardRevenue,
  } = useRevenueState();

  const navigate = useNavigate()

  useEffect(() => {
    enableHeader()
    TotalRevenueDetails();
    OrderReport();
  }, []);

  async function OrderReport() {
    const response = await loadOrderReport(
      JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
    );
    if (response) {
      setData(response)
      setTodaySummary(response.revenue_details.todays_summary);
      setThisWeekSummary(response.revenue_details.this_weeks_summary);
      setThisMonthSummary(response.revenue_details.this_months_summary);
      setThisYearSummary(response.revenue_details.this_years_summary);
    }
  }

  async function TotalRevenueDetails() {
    const response = await loadRevenueTotals(
      JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
    );
    if (response) {
      setTotalDashboardRevenue(response.revenue_details);
    }
  }

  return (
    <Screen title="Revenue" kicker="Reports">
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
                {todaySummary?.total_revenue?.toFixed(2)}
              </div>
            ) : null}
            <div className={style.btn_div}>
              <button className={style.order_report_btn} onClick={e => navigate("/NewOrderReport", {
                state: {
                  today: true,
                  week: false,
                  month: false,
                  year: false,
                }
              })}>
                View Order Report
              </button>
            </div>
              <div className={style.btn_div}>
              <button className={style.item_report_btn} onClick={e => navigate("/OrderItemReport", {
                state: {
                  today: true,
                  week: false,
                  month: false,
                  year: false,
                }
              })}>
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
                {thisWeekSummary?.total_revenue?.toFixed(2)}
              </p>
            ) : null}
            <div className={style.btn_div}>
              <button className={style.order_report_btn} onClick={e => navigate("/NewOrderReport", {
                state: {
                  today: false,
                  week: true,
                  month: false,
                  year: false,
                }
              })}>
                View Order Report
              </button>
            </div>
            <div className={style.btn_div}>
              <button className={style.item_report_btn} onClick={e => navigate("/OrderItemReport", {
                state: {
                  today: false,
                  week: true,
                  month: false,
                  year: false,
                }
              })}>
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
                {thisMonthSummary?.total_revenue?.toFixed(2)}
              </p>
            ) : null}
            <div className={style.btn_div}>
              <button className={style.order_report_btn} onClick={e => navigate("/NewOrderReport", {
                state: {
                  today: false,
                  week: false,
                  month: true,
                  year: false,
                }
              })}>
                View Order Report
              </button>
            </div>
            <div className={style.btn_div}>
              <button className={style.item_report_btn} onClick={e => navigate("/OrderItemReport", {
                state: {
                  today: false,
                  week: false,
                  month: true,
                  year: false,
                }
              })}>
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
                {thisYearSummary?.total_revenue?.toFixed(2)}
              </p>
            ) : null}
            <div className={style.btn_div}>
              <button className={style.order_report_btn} onClick={e => navigate("/NewOrderReport", {
                state: {
                  today: false,
                  week: false,
                  month: false,
                  year: true,
                }
              })}>
                View Order Report
              </button>
            </div>
            <div className={style.btn_div}>
              <button className={style.item_report_btn} onClick={e => navigate("/OrderItemReport", {
                state: {
                  today: false,
                  week: false,
                  month: false,
                  year: true,
                }
              })}>
                View Item Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Screen>
  );
};

export default Revenue;
