/**
 * Created by - Ashish Dewangan on 03-06-2023
 * Reason - To have customer details section
 */

import React, { useEffect, useState } from "react";
import style from "./customerDetail.module.css";
import Header from "../GlobalComponent/Header";
import { getCustomerList } from "../../Api/services";
import { useNavigate } from "react-router-dom";

const CustomerDetail = () => {
  const [customerList, setCustomerList] = useState([]);
  const navigate = useNavigate();

  /**
   * Added by - Ashish Dewangan on 03-06-2023
   * Reason - method that will execute when page loads. this method will call cutomer list api
   */
  useEffect(() => {
    getListOfCustomers();
  }, []);
  /**
   * End of code addition by - Ashish Dewangan on 03-06-2023
   * Reason - method that will execute when page loads. this method will call cutomer list api
   */

  /**
   * Added by - Ashish Dewangan on 03-06-2023
   * Reason - created api to get list of customers
   */
  const getListOfCustomers = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getCustomerList(tenant);
    setCustomerList(response.allCustomers);
  };
  /**
   * End of code addition by - Ashish Dewangan on 03-06-2023
   * Reason - created api to get list of customers
   */

  return (
    <Header>
      <div className={style.container}>
        <div className={`${style.pageTitleContainer}`}>
          <div className={style.pageTitle}>Customer List</div>
        </div>
        <div className={style.customerListSection}>
          <div className={style.tableContainer} >
            <div className={style.table}>
              <div className={style.tableHeadingContainer}>
                <div className={style.commonColumnTitle}> Name </div>
                <div className={style.commonColumnTitle}> Email </div>
                <div className={style.commonColumnTitle}> Contact Number </div>
                <div className={style.commonColumnTitle}> Loyality Points</div>
              </div>
              <div className={style.tableDataContainer} style={{
                backgroundColor:'#f5f5f5',
                paddingLeft:'40px',
                paddingRight:'40px',
              
                }}>
                {customerList != null && customerList.length > 0 ? (
                  customerList.map((customerDetails, index) => {
                    return (
                      <div className={style.tableData} style={{
                        // backgroundColor:(index%2==0?'yellow':'green'),
                        backgroundColor:'white',
                        padding:'10px',
                        marginTop:'10px',
                        borderRadius:'8px',
                        boxShadow:"var(--ds-shadow-raised,0 1px 2px 0 rgba(9,30,66,.25))"
                        }}>
                        <div className={style.commonColumnData}>
                          {customerDetails.last_customer_name}
                        </div>
                        <div className={style.commonColumnData}>
                          {customerDetails.last_email}
                        </div>
                        <div className={style.commonColumnData}>
                          {customerDetails.contact_number}
                        </div>
                        <div className={style.commonColumnData}>
                          {customerDetails.loyality_points}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center" }}>Please Add Settings</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default CustomerDetail;
