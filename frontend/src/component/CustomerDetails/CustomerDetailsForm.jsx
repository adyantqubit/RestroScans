// Added by :- Parineeta Gedam
// Date :- 07-04-2023   
// Reason :- show the customer form

import { React, useContext } from 'react';
import { GlobalContext } from "../../context/Context";
import { Button, Form, Input, Card, message, } from "antd";
import { postCustomerDetails,checkTableNumberApi } from '../../api/Services';
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import style from "./customer.module.css";
import { AiOutlineClose } from "react-icons/ai"
import secureLocalStorage from "react-secure-storage";


export default function CustomerDetailsForm({ isPopupOpen, setPopupVisiblity }) {

  // get data from context
  var { colors, cart, setCart,restaurant_name } = useContext(GlobalContext);

  // close the customer details popup
  function closePopup() {
    setPopupVisiblity(!isPopupOpen)
  }

  // for the navigations
  const navigate = useNavigate();

  {/* Added by :- Parineeta Gedam
    Date :- 06-04-2023
    Reason :- submit the customer details, orders, and order items
*/}

  const SubmitCustomerDetails = async (formdata) => {
// Added by :Pratap sahu on 15-10-2023 To validate Table number before OTP Verification
      var tenantName = localStorage.getItem("tenantName")
      const response = await checkTableNumberApi(formdata.table_number?formdata.table_number:"",tenantName);
      if (response.error) {
        message.error({
          content: "This Table is not vacant, Please try others",
          key: 1,
          icon: <CheckCircleOutlined />,
          style: {
            marginTop: "5vh",
            fontSize: "16px",
            letterSpacing: "1.3px",
            fontFamily: "Times News Roman",
            color: colors.headingColor,
          },
        })
      }
      if (response.message) {
  // End of code by :Pratap sahu on 15-10-2023 To validate Table number before OTP Verification
          const customerDetail = {
            name: formdata.name ? formdata.name : "",
            email: formdata.email ? formdata.email : "",
            contact_number: formdata.contact_number,
            table_number: formdata.table_number,
            cart: cart,
            //added by rohan- 18/4/23 - to set tenant validation
            tenant:restaurant_name,
            // Added by Rohan kansari - 4/9/23 - To set admin is valid or not
            // Modified by Pratap Sahu On 24-11-2023
            // order_created_by: "User"
            order_created_by: "Customer"
            // End of code by Pratap Sahu On 24-11-2023
          };

    // Added by Rohan kansari - 26/4/23
    // Reason- To navigate otp form first then proceed further
    navigate("/Verification",{state:customerDetail})
    // End of code - Rohan kansari - 26/4/23

  
    // Commented by Rohan kansari - 27/4/23
    // Reason - TO shift all placeorder functionality in otp section so not needed here
    // var tenantName = localStorage.getItem("tenantName")
    // const response = await postCustomerDetails(customerDetail, tenantName);
    // if (response.msg) {
    //   secureLocalStorage.setItem("invoice_detail", response.data)
    //   //added by rohan- 18/4/23 - to set tenant validation
    //   secureLocalStorage.setItem("customer_details",customerDetail)
    //   secureLocalStorage.setItem("order", response.data.order_details)
    //   secureLocalStorage.setItem("orderItem", response.data.order_items)

    //   // Added by :- Parineeta Gedam
    //   // Date :- 14-04-2023
    //   // Reason :- remove cart data from local storage

    //   localStorage.removeItem('cart');
    //   setCart([])

    //   // End of added code 15-04-2023

    //   // Commented by :- Parineeta Gedam
    //   // Date :- 13-04-2023
    //   // Reason :- remove the validations msg
    //   // message.success({
    //   //   content: "Successfully Submit",
    //   //   key: 1,
    //   //   icon: <CheckCircleOutlined />,
    //   //   style: {
    //   //     marginTop: '5vh',
    //   //     fontSize: "16px",
    //   //     letterSpacing: "1.3px",
    //   //     fontFamily: "Times News Roman",
    //   //     color: colors.headingColor,
    //   //   },
    //   // });
    //   // End of added code 13-04-2023
    //   navigate("/invoice");
    // }
    // else {
    //   message.error({
    //     content: "Please try again",
    //     key: 1,
    //     icon: <CheckCircleOutlined />,
    //     style: {
    //       marginTop: '5vh',
    //       fontSize: "16px",
    //       letterSpacing: "1.3px",
    //       fontFamily: "Times News Roman",
    //       color: colors.headingColor,
    //     },
    //   });
    // }
  // End of commenting 0 rjan kansari - 27/4/23
  }
}
  //   End of added code 06-04-2023


  return (
    <>
      {isPopupOpen ?
        <div className={`${style.customerPopupContainer} ${style.fade}}`} id="detailModel">
          <div className={style.customerCloseContainer}>
            <AiOutlineClose size={30} style={{ color: "#fff", margin: "auto 0" }} onClick={closePopup} />
          </div>

          <div className={style.customerInformationBox} style={{ backgroundColor: colors.backgroundTheme }}>
            <Card hoverable>
              <h2 style={{ textAlign: "center", color: colors.headingColor }} className={style.customerFormHeading}>Please fill the details</h2>
              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrLoginerCol={{
                  span: 16,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={SubmitCustomerDetails}

              //   id="regi"
              >
                {/* Added by ROhan kansari - 3/5/23
                    Reason - requirent is to show mandotary field in top */}
                    <Form.Item
                  name="contact_number"
                  label={<div className={style.labelContainer}><span className={style.main_label}>Contact Number &nbsp;</span><div className={style.about_label}></div></div>}
                  rules={[
                    {
                      required: true,
                      message: "Please enter contact number",
                    },
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject();
                        }
                        if (isNaN(value)) {
                          return Promise.reject("Contact has to be in digits.");
                        }
                        if (value.length < 10) {
                          return Promise.reject(
                            "Contact number should be in 10 digits"
                          );
                        }
                        if (value.length > 10) {
                          return Promise.reject(
                            "Contact number can't be more than 10 digits"
                          );
                        }

                        // Added by :- Parineeta Gedam on 12-06-2023 
                        // Ticket No :- 174
                        // Reason :- To validate contact number ( When user enter 9 digits mobile number and enter space then it is consider as 10th digit)
                        if (value) {
                          if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
                            return Promise.resolve();
                          }
                            return Promise.reject(new Error("Contact number has to be in digits"));
                        }  
                        // End of added code by :- Parineeta Gedam on 12-06-2023 

                        return Promise.resolve();
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input
                    maxLength={10}
                    minLength={10}
                    // addonBefore="+91"
                    // allowClear
                  />
                </Form.Item>
                <Form.Item>
                  <Form.Item
                    name="table_number"
                    label={<div className={style.labelContainer}><span className={style.main_label}>Table Number &nbsp;</span><div className={style.about_label}></div></div>}
                    rules={[
                      {
                        required: true,
                        message: "Please enter table number",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input 
                    // allowClear 
                    />
                  </Form.Item>
                </Form.Item>
                {/* End of addition - 3/5/23 */}

                <Form.Item
                  name="name"
                  label={<div className={style.labelContainer}><span className={style.main_label}>Name &nbsp;</span><div className={style.about_label}>( Optional )</div></div>}
                  rules={[
                    {
                      // commented by :- Parineeta [remove the requied validations]
                      // required: true,
                      message: "Please enter your name",
                    },
                  ]}
                  hasFeedback
                >
                  <Input 
                  // allowClear 
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<div className={style.labelContainer}><span className={style.main_label}>Email &nbsp;</span><div className={style.about_label}>( Optional )</div></div>}
                  rules={[
                    {
                      // commented by :- Parineeta [remove the requied validations]
                      // required: true,
                      message: "Please enter your email",
                    },

                    {
                      type: "email",
                      message: "Please must be sure Email is valid",
                    },
                  ]}
                  hasFeedback
                >
                  <Input 
                  // allowClear 
                  />
                </Form.Item>

              {/* Commented by - Rohan kansari 3/5/23
                  Reason - To shift this mandatory field in top */}
                {/* <Form.Item
                  name="contact_number"
                  label="Contact number :"
                  rules={[
                    {
                      required: true,
                      message: "Please enter contact number",
                    },
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject();
                        }
                        if (isNaN(value)) {
                          return Promise.reject("Contact has to be in digits.");
                        }
                        if (value.length < 10) {
                          return Promise.reject(
                            "Contact number should be in 10 digits"
                          );
                        }
                        if (value.length > 10) {
                          return Promise.reject(
                            "Contact number can't be more than 10 digits"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input maxLength={10} 
                  // allowClear 
                  />
                </Form.Item>
                <Form.Item>
                  <Form.Item
                    name="table_number"
                    label="Table number :"
                    rules={[
                      {
                        required: true,
                        message: "Please enter table number",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input 
                    // allowClear 
                    />
                  </Form.Item>
                </Form.Item> */}

                <div className={style.checkInvoiceBtn}>
                  {/* <Form.Item>
                    <Button
                      id="signBtn"
                      // type="primary"
                      htmlType="submit"
                      block
                      className={style.checkInvoiceBtnHeading}
                      style={{
                        backgroundColor: colors.bannerColor,
                        color: colors.backgroundTheme,
                        border: "none",
                        // width: "80%",
                      }}
                    >
                      {/* Check invoice 
                      Place order
                      Place Order
                    </Button>
                  </Form.Item> */}
                 {/* End of commenting - 3/5/23 - Rohan kansari */}

                  {/* Added by ROhan kansari - 1/5/23
                      Reason - To design new button because antd button showing blue effect which is a bug */}
                  <button className={style.checkInvoiceBtnHeading}
                  style={{
                    backgroundColor: colors.bannerColor,
                    color: colors.backgroundTheme,
                    border: "none",
                    // width: "80%",
                  }}>Place Order</button>
                  {/* End of code - 1/5/23 - ROhankansari */}
                </div>
              </Form>
            </Card>

          </div>
        </div>
        : null}
    </>
  )
}


// End of added code 07-04-2023
