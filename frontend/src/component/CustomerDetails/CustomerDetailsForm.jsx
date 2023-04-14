// Added by :- Parineeta Gedam
// Date :- 07-04-2023   
// Reason :- show the customer form

import { React, useContext } from 'react';
import { GlobalContext } from "../../context/Context";
import { Button, Form, Input, Card, message, } from "antd";
import { postCustomerDetails } from '../../api/Services';
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import style from "./customer.module.css";
import { AiOutlineClose } from "react-icons/ai"
import secureLocalStorage from "react-secure-storage";


export default function CustomerDetailsForm({ isPopupOpen, setPopupVisiblity }) {

  // get data from context
  var { colors, cart } = useContext(GlobalContext);

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

    const customerDetail = {
      name: formdata.name,
      email: formdata.email,
      contact_number: formdata.contact_number,
      table_number: formdata.table_number,
      cart: cart,
    };
    var tenantName = localStorage.getItem("tenantName")
    const response = await postCustomerDetails(customerDetail, tenantName);
    if (response.msg) {
      secureLocalStorage.setItem("invoice_detail", response.data)
      secureLocalStorage.setItem("customerDetails", JSON.stringify(response.data.contact_number))
      secureLocalStorage.setItem("order", response.data.order_details)
      secureLocalStorage.setItem("orderItem", response.data.order_items)
      // Commented by :- Parineeta Gedam
      // Date :- 13-04-2023
      // Reason :- remove the validations msg
      // message.success({
      //   content: "Successfully Submit",
      //   key: 1,
      //   icon: <CheckCircleOutlined />,
      //   style: {
      //     marginTop: '5vh',
      //     fontSize: "16px",
      //     letterSpacing: "1.3px",
      //     fontFamily: "Times News Roman",
      //     color: colors.headingColor,
      //   },
      // });
      // End of added code 13-04-2023
      navigate("/invoice");
    }
    else {
      message.error({
        content: "Please try again",
        key: 1,
        icon: <CheckCircleOutlined />,
        style: {
          marginTop: '5vh',
          fontSize: "16px",
          letterSpacing: "1.3px",
          fontFamily: "Times News Roman",
          color: colors.headingColor,
        },
      });
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
              <h2 style={{ textAlign: "center", color: colors.headingColor }}>Please fill the details</h2>
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
                <Form.Item
                  name="name"
                  label="Name :"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your name",
                    },
                  ]}
                  hasFeedback
                >
                  <Input allowClear />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                    },

                    {
                      type: "email",
                      message: "Please must be sure Email is valid",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>

                <Form.Item
                  name="contact_number"
                  label="Contact number :"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your valid contact number",
                    },
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject();
                        }
                        if (isNaN(value)) {
                          return Promise.reject("Contact has to be a number.");
                        }
                        if (value.length < 10) {
                          return Promise.reject(
                            "Contact number can't be less than 10 digits"
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
                  <Input maxLength={10} allowClear />
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
                    <Input allowClear />
                  </Form.Item>
                </Form.Item>

                <div className={style.checkInvoiceBtn}>
                  <Form.Item>
                    <Button
                      id="signBtn"
                      type="primary"
                      htmlType="submit"
                      block
                      className={style.checkInvoiceBtnHeading}
                      style={{
                        backgroundColor: colors.bannerColor,
                        color: colors.backgroundTheme,
                        border: "none",
                        width: "80%",
                      }}
                    >
                      {/* Check invoice */}
                      Place order
                    </Button>
                  </Form.Item>
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
