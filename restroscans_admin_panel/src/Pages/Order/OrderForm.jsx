import React, { useEffect } from "react";
import style from "./orderform.module.css";
import Header from "../GlobalComponent/Header";
import { useLocation, useNavigate } from "react-router-dom";
import {
    getOrderDetailsApi,
    saveSocialMediaApi,
  } from "../../Api/services";
import { useState } from "react";

const OrderForm = () => {
    const navigate = useNavigate();

    /**
     * Added by Yuvraj Sahu on 07-06-2023
     * Reason - to recieve id for update social media
     */
    const { state } = useLocation();
    const { id } = state; // Read values passed on state
    /**
     * End of addition by Yuvraj Sahu on 07-06-2023
     */
  const [orderDetailsObj, setorderDetailsObj] = useState({});

  const [tablenumber, setTablenumber] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [paymentStatus, setPaymemntStatus] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);
  const [cancelledBy, setCancelledBy] = useState(null);
  const [cancelReaon, setCancelReason] = useState(null);

  const [discountRupee, setDiscountRupee] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [discountReason, setDiscountReason] = useState(null);
  const [applyLoyalityPoint, setApplyLoyalityPoint] = useState(null);
  const [loyalityPointPrice, setLoyalityPointPrice] = useState(null);
  const [loyalityPointStatus, setLoyalityPointStatus] = useState(null);
  const [loyalityPointCalculated, setLoyalityPointCalculated] = useState(null);

  const [subTotal, setSubTotal] = useState(null);
  const [cgst, setCGST] = useState(null);
  const [total, setTotal] = useState(null);
  const [sgst, setSGST] = useState(null);
  const [finalAmount, setFinalAmount] = useState(null);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);


  useEffect(() => {
    getSettingData();
  }, []);
      /**
   * Added by - Yuvraj Sahu on 02-06-2023
   * Reason - created api that will get social media data
   */
  const getSettingData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getOrderDetailsApi(tenant);
    if (response.msg) {
      // setSettingData(response.setting);
      if (id != 0) {
        var filterOrderObj = response.orderData.filter(
          (dt) => dt.id == id
        )[0];
        setorderDetailsObj(filterOrderObj);

        setOrderId(filterOrderObj.order_id);
        setTablenumber(filterOrderObj.table_number);

        setOrderStatus(filterOrderObj.order_status);
        setPaymemntStatus(filterOrderObj.payment_status);
        setPaymentMode(filterOrderObj.payment_mode);
        setCancelledBy(filterOrderObj.cancelled_by);
        setCancelReason(filterOrderObj.cancel_reason);

        setDiscountRupee(filterOrderObj.discount_rupees);
        setDiscountPercentage(filterOrderObj.discount_percentage);
        setDiscountReason(filterOrderObj.discount_reason);
        setApplyLoyalityPoint(filterOrderObj.apply_loyality_point);
        setLoyalityPointPrice(filterOrderObj.loyality_point_price);
        setLoyalityPointStatus(filterOrderObj.loyality_point_status);
        setLoyalityPointCalculated(filterOrderObj.loyality_point_calculated);

        setSubTotal(filterOrderObj.sub_total);
        setCGST(filterOrderObj.cgst);
        setSGST(filterOrderObj.sgst);
        setTotal(filterOrderObj.total);
        setFinalAmount(filterOrderObj.final_amount);
        setRating(filterOrderObj.rating);
        setReview(filterOrderObj.review);


        // setImageUrl(filterSocialMediaObj.social_media_icon);
      }
    }
    // setThemeList(response.themeOptions);
  };
  console.log(paymentStatus)
  /**
   * End of code addition by - Yuvraj Sahu on 02-06-2023
   * Reason - created api that will get setting data
   */

  return (
    <Header>
      <div className={style.container}>
        <div className={style.titleContainer}>
          {/* <div className={style.backButton}><BiArrowBack style={{width:"30px",height:"30px"}}/></div> */}
          <div className={style.pageTitle}>Order</div>
        </div>
        <form className={style.settingSection}>
          <div className={style.formContainer}>
            <div className={`${style.sectionInsideForm}`}>
            <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Order Id</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="whatsapp_number"
                    value={orderId}
                    // style={{ width: "200px" }}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    // onChange={(e) => {
                    //   setWhatsappNumber(e.target.value);
                    //   validateOnInput("whatsapp_number", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("whatsapp_number", e.target.value);
                    // }}
                    maxLength={10}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.whatsapp_number} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Table number</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="whatsapp_number"
                    value={tablenumber}
                    // style={{ width: "200px" }}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    // onChange={(e) => {
                    //   setWhatsappNumber(e.target.value);
                    //   validateOnInput("whatsapp_number", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("whatsapp_number", e.target.value);
                    // }}
                    maxLength={10}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.whatsapp_number} */}
                </div>
              </div>


              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Order Status</div>
                  <select
                    className={`${style.textInputBox}`}
                    name="app_theme"
                    style={{ width: "200px" }}

                    value={orderStatus}

                    onChange={(e) => {
                    //   setOrderStatus(e.target.value);
                    //   validateOnInput("app_theme", e.target.value);
                    }}
                  >
                    {/* {themeList.map((data, index) => {
                      return (
                        <option
                          key={index}
                          name={data.id}
                          selected={data.id == appTheme}
                          value={data.id}
                        >
                          {data?.background_color_label} ,{" "}
                          {data.heading_color_label}
                        </option>
                      );
                    })} */}
                  </select>
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.app_theme} */}
                </div>
              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Payment Status</div>
                  <select
                    className={`${style.textInputBox}`}
                    name="app_theme"
                    style={{ width: "200px" }}
                    onChange={(e) => {
                      setPaymemntStatus(e.target.value);
                    //   validateOnInput("app_theme", e.target.value);
                    }}
                  >
                    {/* {themeList.map((data, index) => {
                      return (
                        <option
                          key={index}
                          name={data.id}
                          selected={data.id == appTheme}
                          value={data.id}
                        >
                          {data?.background_color_label} ,{" "}
                          {data.heading_color_label}
                        </option>
                      );
                    })} */}
                  </select>
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.app_theme} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Payment mode</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="whatsapp_number"
                    value={paymentMode}
                    // style={{ width: "200px" }}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    // onChange={(e) => {
                    //   setWhatsappNumber(e.target.value);
                    //   validateOnInput("whatsapp_number", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("whatsapp_number", e.target.value);
                    // }}
                    maxLength={10}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.whatsapp_number} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Order is cancelled by </div>
                  <select
                    className={`${style.textInputBox}`}
                    name="app_theme"
                    style={{ width: "200px" }}
                    onChange={(e) => {
                      setCancelledBy(e.target.value);
                    //   validateOnInput("app_theme", e.target.value);
                    }}
                  >
                    {/* {themeList.map((data, index) => {
                      return (
                        <option
                          key={index}
                          name={data.id}
                          selected={data.id == appTheme}
                          value={data.id}
                        >
                          {data?.background_color_label} ,{" "}
                          {data.heading_color_label}
                        </option>
                      );
                    })} */}
                  </select>
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.app_theme} */}
                </div>
              </div>


              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Cancel reason</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="whatsapp_number"
                    value={cancelReaon}
                    // style={{ width: "200px" }}
                    // onFocus={(e)=>{
                    //   if(whatsappNumber.length==13)
                    //     setWhatsappNumber(whatsappNumber.substring(3,13))
                    // }}
                    // onChange={(e) => {
                    //   setWhatsappNumber(e.target.value);
                    //   validateOnInput("whatsapp_number", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("whatsapp_number", e.target.value);
                    // }}
                    maxLength={100}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.whatsapp_number} */}
                </div>
              </div>

            </div>

            <div className={`${style.sectionInsideForm}`}>
              

              

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    Discount in (₹)
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="amount_for_single_loyality_point"
                    style={{ width: "100px" }}
                    value={discountRupee}
                    // onChange={(e) => {
                    //   setAmountForSingleLoyalityPoint(e.target.value);
                    //   validateOnInput(
                    //     "amount_for_single_loyality_point",
                    //     e.target.value
                    //   );
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur(
                    //     "amount_for_single_loyality_point",
                    //     e.target.value
                    //   );
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.amount_for_single_loyality_point} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Discount in (%)</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="cgst"
                    style={{ width: "100px" }}
                    value={discountPercentage}
                    // onChange={(e) => {
                    //   setCgst(e.target.value);
                    //   validateOnInput("cgst", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("cgst", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.cgst} */}
                </div>
              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Discount reason</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="sgst"
                    style={{ width: "100px" }}
                    value={discountReason}
                    // onChange={(e) => {
                    //   setSgst(e.target.value);
                    //   validateOnInput("sgst", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("sgst", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.sgst} */}
                </div>
              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                   Apply loyality point
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="amount_for_single_loyality_point"
                    style={{ width: "100px" }}
                    value={applyLoyalityPoint}
                    // onChange={(e) => {
                    //   setAmountForSingleLoyalityPoint(e.target.value);
                    //   validateOnInput(
                    //     "amount_for_single_loyality_point",
                    //     e.target.value
                    //   );
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur(
                    //     "amount_for_single_loyality_point",
                    //     e.target.value
                    //   );
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.amount_for_single_loyality_point} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    Loyality point price
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="amount_for_single_loyality_point"
                    style={{ width: "100px" }}
                    value={loyalityPointPrice}
                    // onChange={(e) => {
                    //   setAmountForSingleLoyalityPoint(e.target.value);
                    //   validateOnInput(
                    //     "amount_for_single_loyality_point",
                    //     e.target.value
                    //   );
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur(
                    //     "amount_for_single_loyality_point",
                    //     e.target.value
                    //   );
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.amount_for_single_loyality_point} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                  Loyality point status
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="amount_for_single_loyality_point"
                    style={{ width: "100px" }}
                    value={loyalityPointStatus}
                    // onChange={(e) => {
                    //   setAmountForSingleLoyalityPoint(e.target.value);
                    //   validateOnInput(
                    //     "amount_for_single_loyality_point",
                    //     e.target.value
                    //   );
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur(
                    //     "amount_for_single_loyality_point",
                    //     e.target.value
                    //   );
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.amount_for_single_loyality_point} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>
                    Loyality point calculated
                  </div>
                  <input
                    className={`${style.textInputBox}`}
                    type="checkbox"
                    name="allow_loyality_points"
                    style={{ width: "18px", height: "18px" }}
                    checked={loyalityPointCalculated}
                    // onChange={(e) => {
                    //   setAllowLoyalityPoints(e.target.checked);
                    //   validateOnInput("allow_loyality_points", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.allow_loyality_points} */}
                </div>
              </div>
            </div>

            

            {/* <div className={`${style.sectionInsideForm}`}>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Allow Half Price</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="checkbox"
                    name="allow_half_price"
                    style={{ width: "18px", height: "18px" }}
                    checked={allowHalfPrice}
                    onChange={(e) => {
                      setAllowHalfPrice(e.target.checked);
                      validateOnInput("allow_half_price", e.target.value);
                    }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {validationErrors.allow_half_price}
                </div>
              </div>
            </div> */}

            <div className={`${style.sectionInsideForm}`}>
              

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Subtotal</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="gstin"
                    style={{ width: "200px" }}
                    value={subTotal}
                    // maxLength={15}
                    // onChange={(e) => {
                    //   setGstin(e.target.value);
                    //   validateOnInput("gstin", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("gstin", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>CGST</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="gstin"
                    style={{ width: "200px" }}
                    value={cgst}
                    // maxLength={15}
                    // onChange={(e) => {
                    //   setGstin(e.target.value);
                    //   validateOnInput("gstin", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("gstin", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>SGST</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="gstin"
                    style={{ width: "200px" }}
                    value={sgst}
                    // maxLength={15}
                    // onChange={(e) => {
                    //   setGstin(e.target.value);
                    //   validateOnInput("gstin", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("gstin", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Total</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="gstin"
                    style={{ width: "200px" }}
                    value={total}
                    // maxLength={15}
                    // onChange={(e) => {
                    //   setGstin(e.target.value);
                    //   validateOnInput("gstin", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("gstin", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Grand Total</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="gstin"
                    style={{ width: "200px" }}
                    value={finalAmount}
                    // maxLength={15}
                    // onChange={(e) => {
                    //   setGstin(e.target.value);
                    //   validateOnInput("gstin", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("gstin", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>
              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Rating</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="gstin"
                    style={{ width: "200px" }}
                    value={rating}
                    // maxLength={15}
                    // onChange={(e) => {
                    //   setGstin(e.target.value);
                    //   validateOnInput("gstin", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("gstin", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.gstin} */}
                </div>
              </div>

              <div className={`${style.inputContainer}`}>
                <div className={`${style.inputArea}`}>
                  <div className={`${style.inputLabel}`}>Review</div>
                  <input
                    className={`${style.textInputBox}`}
                    type="text"
                    name="fssaino"
                    style={{ width: "200px" }}
                    value={review}
                    // maxLength={14}
                    // onChange={(e) => {
                    //   setFssaiNumber(e.target.value);
                    //   validateOnInput("fssaino", e.target.value);
                    // }}
                    // onBlur={(e) => {
                    //   validateOnBlur("fssaino", e.target.value);
                    // }}
                  />
                </div>
                <div className={`${style.inputErrorArea}`}>
                  {/* {validationErrors.fssaino} */}
                </div>
              </div>
            </div>
          </div>

          <div className={style.actionContainer}>
            <div
              className={` ${style.backButton}`}
              style={{
                marginRight: "10px",
              }}
              onClick={(e) => {
                navigate("/Dashboard");
              }}
            >
              Back
            </div>

            <div
              className={` ${style.cancelButton}`}
              style={{
                marginRight: "10px",
              }}
            //   onClick={(e) => {
            //     resetSettingsForm();
            //     window.scrollTo(0, 0);
            //   }}
            >
              Clear
            </div>

            <div
              className={` ${style.proceedButton}`}
            //   onClick={() =>{ saveSettings(); window.scrollTo(0, 0);}}
              
            >
              Save
            </div>
          </div>
        </form>
      </div>
    </Header>
  );
};

export default OrderForm;
