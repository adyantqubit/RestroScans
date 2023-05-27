import React, { useEffect, useState } from "react";
import style from "./revenue.module.css";
import Header from "../GlobalComponent/Header";
import { getOrderReport } from "../../Api/services";

const Revenue = () => {
  const [todaySummary, setTodaySummary] = useState();
  const [thisWeekSummary, setThisWeekSummary] = useState();
  const [thisMonthSummary, setThisMonthSummary] = useState();
  const [thisYearSummary, setThisYearSummary] = useState();

  useEffect(() => {
    OrderReport();
  }, []);

  async function OrderReport() {
    const response = await getOrderReport(
      JSON.parse(localStorage.getItem("tenantInfo")).tenant_name
    );
    if (response) {
      console.log("+++++++++++", response.revenue_details.todays_summary);
      setTodaySummary(response.revenue_details.todays_summary);
      setThisWeekSummary(response.revenue_details.this_weeks_summary);
      setThisMonthSummary(response.revenue_details.this_months_summary);
      setThisYearSummary(response.revenue_details.this_years_summary);
    }
  }
  return (
    <Header>
      <div className={style.Container}>
        <h1 className={style.heading}>Revenue Details</h1>
        <div className={style.revenue_main_section}>
          <div className={style.revenue_container}>
            <h1 className={style.primary_heading}>Today's Revenue</h1>
            <h2>Total Orders</h2>

            {todaySummary ? <div>{todaySummary.order_count}</div> : null}
            <h2>Total Revenue</h2>
            {todaySummary ? <div>{todaySummary.total_revenue}</div> : null}
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

            {thisWeekSummary ? <p>{thisWeekSummary.order_count}</p> : null}
            <h2>Total Revenue</h2>
            {thisWeekSummary ? <p>{thisWeekSummary.total_revenue}</p> : null}
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
            <h1 className={style.primary_heading}>This Month's Revenue</h1>
            <h2>Total Orders</h2>

            {thisMonthSummary ? <p>{thisMonthSummary.order_count}</p> : null}
            <h2>Total Revenue</h2>
            {thisMonthSummary ? <p>{thisMonthSummary.total_revenue}</p> : null}
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

            {thisYearSummary ? <p>{thisYearSummary.order_count}</p> : null}
            <h2>Total Revenue</h2>
            {thisYearSummary ? <p>{thisYearSummary.total_revenue}</p> : null}
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
    </Header>
  );
};

export default Revenue;
