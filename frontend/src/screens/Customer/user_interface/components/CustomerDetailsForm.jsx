// import { React, useContext, useEffect, useState } from 'react';
// import { qrTableId, resolveQrTable } from '../../services/tableQrService';
// import { GlobalContext } from "../../../../context/Context";
// import { Button, Form, Input, Card, message, } from "antd";
// import { postCustomerDetails, checkTableNumberApi, customerOrderDraft } from '../../services/customerService';
// import { CheckCircleOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
// import style from "../style/customer.module.css";
// import { AiOutlineClose } from "react-icons/ai"
// import secureLocalStorage from "react-secure-storage";

// export default function CustomerDetailsForm({ isPopupOpen, setPopupVisiblity }) {
//   // get data from context
//   var { colors, cart, setCart, restaurant_name } = useContext(GlobalContext);

//   // close the customer details popup
//   function closePopup() {
//     setPopupVisiblity(!isPopupOpen)
//   }

//   const navigate = useNavigate();
//   const [qrTable, setQrTable] = useState(null);
//   const [qrError, setQrError] = useState('');
//   useEffect(() => {
//     if (!isPopupOpen || !qrTableId()) return;
//     let active = true;
//     setQrError('');
//     setQrTable(null);
//     resolveQrTable()
//       .then(table => { if (active) setQrTable(table); })
//       .catch(err => { if (active) setQrError(err.message || 'Unable to verify table QR.'); });
//     return () => { active = false; };
//   }, [isPopupOpen]);

//   const SubmitCustomerDetails = async (formdata) => {
//     var tenantName = localStorage.getItem("tenantName")
//     if (qrTableId() && !qrTable) { message.error(qrError || 'Table QR is still loading.'); return; }
//     if (qrTable) {
//       formdata.table_number = qrTable.location_label;
//       formdata.dining_table = qrTable.id;
//     }
//     const response = qrTable ? { message: 'QR table verified' } : await checkTableNumberApi(formdata.table_number ? formdata.table_number : '', tenantName);
//     if (response.error) {
//       message.error({
//         content: "This Table is not vacant, Please try others",
//         key: 1,
//         icon: <CheckCircleOutlined />,
//         style: {
//           marginTop: "5vh",
//           fontSize: "16px",
//           letterSpacing: "1.3px",
//           fontFamily: "Times News Roman",
//           color: colors.headingColor,
//         },
//       })
//     }
//     if (response.message) {
//       const customerDetail = customerOrderDraft(formdata, cart, restaurant_name);

//       navigate("/Verification", { state: customerDetail })
//     }
//   }

//   return (
//     <>
//       {isPopupOpen ?
//         <div className={`${style.customerPopupContainer} ${style.fade}}`} id="detailModel">
//           <div className={style.customerCloseContainer}>
//             <AiOutlineClose size={30} style={{ color: "#fff", margin: "auto 0" }} onClick={closePopup} />
//           </div>

//           <div className={style.customerInformationBox} style={{ backgroundColor: colors.backgroundTheme }}>
//             <Card hoverable>
//               <h2 style={{ textAlign: "center", color: colors.headingColor }} className={style.customerFormHeading}>Please fill the details</h2>
//               <Form
//                 name="basic"
//                 labelCol={{
//                   span: 8,
//                 }}
//                 wrLoginerCol={{
//                   span: 16,
//                 }}
//                 initialValues={{
//                   remember: true,
//                 }}
//                 onFinish={SubmitCustomerDetails}

//               >
//                 <Form.Item
//                   name="contact_number"
//                   label={<div className={style.labelContainer}><span className={style.main_label}>Contact Number &nbsp;</span><div className={style.about_label}></div></div>}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter contact number",
//                     },
//                     () => ({
//                       validator(_, value) {
//                         if (!value) {
//                           return Promise.reject();
//                         }
//                         if (isNaN(value)) {
//                           return Promise.reject("Contact has to be in digits.");
//                         }
//                         if (value.length < 10) {
//                           return Promise.reject(
//                             "Contact number should be in 10 digits"
//                           );
//                         }
//                         if (value.length > 10) {
//                           return Promise.reject(
//                             "Contact number can't be more than 10 digits"
//                           );
//                         }

//                         if (value) {
//                           if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
//                             return Promise.resolve();
//                           }
//                           return Promise.reject(new Error("Contact number has to be in digits"));
//                         }

//                         return Promise.resolve();
//                       },
//                     }),
//                   ]}
//                   hasFeedback
//                 >
//                   <Input
//                     maxLength={10}
//                     minLength={10}
//                   />
//                 </Form.Item>
//                 {qrTable ? <div style={{ padding: 12, marginBottom: 16, background: '#f5f8f1', borderRadius: 8 }}>
//                   Table automatically detected: <strong>{qrTable.location_label}</strong>
//                 </div> : null}
//                 {qrTableId() && !qrTable && !qrError ? <div style={{ marginBottom: 12 }}>Verifying your QR table...</div> : null}
//                 {qrError ? <div style={{ color: '#b42318' }}>{qrError}</div> : null}
//                 {!qrTableId() ? <Form.Item
//                   name="table_number"
//                   label={<div className={style.labelContainer}><span className={style.main_label}>Table Number &nbsp;</span><div className={style.about_label}></div></div>}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter table number",
//                     },
//                   ]}
//                   hasFeedback
//                 >
//                   <Input
//                   // allowClear
//                   />
//                 </Form.Item> : null}

//                 <Form.Item
//                   name="name"
//                   label={<div className={style.labelContainer}><span className={style.main_label}>Name &nbsp;</span><div className={style.about_label}>( Optional )</div></div>}
//                   rules={[
//                     {
//                       message: "Please enter your name",
//                     },
//                   ]}
//                   hasFeedback
//                 >
//                   <Input
//                   // allowClear
//                   />
//                 </Form.Item>

//                 <Form.Item
//                   name="email"
//                   label={<div className={style.labelContainer}><span className={style.main_label}>Email &nbsp;</span><div className={style.about_label}>( Optional )</div></div>}
//                   rules={[
//                     {
//                       message: "Please enter your email",
//                     },

//                     {
//                       type: "email",
//                       message: "Please must be sure Email is valid",
//                     },
//                   ]}
//                   hasFeedback
//                 >
//                   <Input
//                   // allowClear
//                   />
//                 </Form.Item>

//                 <div className={style.checkInvoiceBtn}>

//                   <button className={style.checkInvoiceBtnHeading}
//                     style={{
//                       backgroundColor: colors.bannerColor,
//                       color: colors.backgroundTheme,
//                       border: "none",
//                     }}>Place Order</button>
//                 </div>
//               </Form>
//             </Card>

//           </div>
//         </div>
//         : null}
//     </>
//   )
// }



import { React, useContext, useEffect, useState } from 'react';
import { qrTableId, resolveQrTable } from '../../services/tableQrService';
import { GlobalContext } from "../../../../context/Context";
import { Button, Form, Input, Card, message, } from "antd";
import { postCustomerDetails, checkTableNumberApi, customerOrderDraft } from '../../services/customerService';
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import style from "../style/customer.module.css";
import { AiOutlineClose } from "react-icons/ai"
import secureLocalStorage from "react-secure-storage";

export default function CustomerDetailsForm({ isPopupOpen, setPopupVisiblity }) {
  // get data from context
  var { colors, cart, setCart, restaurant_name } = useContext(GlobalContext);

  // close the customer details popup
  function closePopup() {
    setPopupVisiblity(!isPopupOpen)
  }

  const navigate = useNavigate();
  const [qrTable, setQrTable] = useState(null);
  const [qrError, setQrError] = useState('');
  useEffect(() => {
    if (!isPopupOpen || !qrTableId()) return;
    let active = true;
    setQrError('');
    setQrTable(null);
    resolveQrTable()
      .then(table => { if (active) setQrTable(table); })
      .catch(err => { if (active) setQrError(err.message || 'Unable to verify table QR.'); });
    return () => { active = false; };
  }, [isPopupOpen]);

  const SubmitCustomerDetails = async (formdata) => {
    var tenantName = localStorage.getItem("tenantName")
    if (qrTableId() && !qrTable) { message.error(qrError || 'Table QR is still loading.'); return; }
    if (qrTable) {
      formdata.table_number = qrTable.location_label;
      formdata.dining_table = qrTable.id;
    }
    const response = qrTable ? { message: 'QR table verified' } : await checkTableNumberApi(formdata.table_number ? formdata.table_number : '', tenantName);
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
      const customerDetail = customerOrderDraft(formdata, cart, restaurant_name);

      navigate("/Verification", { state: customerDetail })
    }
  }

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

              >
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

                        if (value) {
                          if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Contact number has to be in digits"));
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input
                    maxLength={10}
                    minLength={10}
                  />
                </Form.Item>
                {qrTable ? <div style={{ padding: 12, marginBottom: 16, background: '#f5f8f1', borderRadius: 8 }}>
                  Table automatically detected: <strong>{qrTable.location_label}</strong>
                </div> : null}
                {qrTableId() && !qrTable && !qrError ? <div style={{ marginBottom: 12 }}>Verifying your QR table...</div> : null}
                {qrError ? <div style={{ color: '#b42318' }}>{qrError}</div> : null}
                {!qrTableId() ? <Form.Item
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
                </Form.Item> : null}

                <Form.Item
                  name="name"
                  label={<div className={style.labelContainer}><span className={style.main_label}>Name &nbsp;</span><div className={style.about_label}>( Optional )</div></div>}
                  rules={[
                    {
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

                <div className={style.checkInvoiceBtn}>

                  <button className={style.checkInvoiceBtnHeading}
                    style={{
                      backgroundColor: colors.bannerColor,
                      color: colors.backgroundTheme,
                      border: "none",
                    }}>Place Order</button>
                </div>
              </Form>
            </Card>

          </div>
        </div>
        : null}
    </>
  )
}
