import { React, useContext, useEffect, useState } from 'react';
import { Radio, Space, Button, Modal, message } from "antd";
import { GlobalContext } from "../../context/Context";
import secureLocalStorage from "react-secure-storage";
import './Payment.css';
import { updatePaymentModeApi, postCheckPaymentStatus,getPaymentModeApi } from '../../api/Services';
import { useNavigate } from "react-router-dom";
import Scanner from '../Scanner/Scan';
import cashPayment from "../../images/cashPayment.png";
import scan from "../../images/scan.png";
import debitCard from "../../images/debitCard.png";
import { CheckCircleOutlined } from '@ant-design/icons';

export default function Payment() {

// Added by pratap sahu on 06-10-2023 
// Reason: To set default payment mode option on UI Invoice detail page
  useEffect(()=>{
    getPaymentMode();
  },[]);
  // End of code by pratap sahu on 06-10-2023

  // get colors from context 
  var { colors,  orders, setOrders, } = useContext(GlobalContext);

  // get data from local stroage
  // var orders = secureLocalStorage.getItem('order');

  // for navigations
  const navigate = useNavigate();

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- click on cash radio options.

  // Modified by pratap sahu on 06-10-2023 
  // Uncommented by Pratap sahu on 11-10-2023
  const [value, setValue] = useState("Cash");
  // const [value, setValue] = useState();
  //  End of code by pratap sahu on 06-10-2023

  const onChange = (e) => {
    setValue(e.target.value);
  };
  // End of added code 11-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- when select "Scanner" options then open a model.
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // End of added code 10-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- check, which radio options select by user.

  // commented by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- check, which radio options select by user.
  // const submitPaymentMode = () => {
  //   if (document.getElementById("cash").checked) {
  //     ordernow();
  //   } else {
  //     showModal();
  //   }
  // };

  // End of added code 13-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- check, which radio options select by user.

  // Added by pratap sahu on 06-10-2023
  const getPaymentMode=async()=>{
    var tenantName = localStorage.getItem("tenantName")
    const response = await getPaymentModeApi(tenantName,orders.id);
    setValue(response.paymentMode)
  }
  // End of Code by Pratap sahu on 06-10-2023

  const submitPaymentMode = () => {
    if (document.getElementById("Cash").checked) {
      ordernow("Cash");
    }
    if (document.getElementById("Scanner").checked) {
      showModal();
    }
    // Commented by ROhan kansari - 29/4/23
    // Reason - because card option not needed any more
    // if (document.getElementById("Card").checked) {
    //   ordernow("Card");
    // }
    // End of code - ROhankansari - 29/4/23
  }
  // End of added code 10-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- when user select "Cash" option then in order table "payment mode will be update."
  const ordernow = async (payment_mode) => {
    const order = {
      order_id: orders.order_id,
      payment_mode: payment_mode,
    }
    var tenantName = localStorage.getItem("tenantName");
    const response = await updatePaymentModeApi(tenantName, order);
    if (response.msg) {
      console.log("res", response)
      //   // Commented by :- Parineeta Gedam
      //   // Date :- 14-04-2023
      //   // Reason :- dont'show success msg
        message.success({
          content: "Payment Done Successfully",
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
      //   // End of commented code 14-04-2023
      //   navigate("/bill-success");
    }
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
  }
  // End of added code 10-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 21-05-2023
  // Reason :- check payment status 

  // const [order, setOrder] = useState([]);

  const checkPaymentStatus = async () => {
    var tenantName = localStorage.getItem("tenantName")
    const order = {
      order_id: orders.order_id,
    }
    const response = await postCheckPaymentStatus(order, tenantName);
    console.log("response", response)
    setOrders(response)
    if (response.order.payment_status == "Completed") {
      if (response.order) {
        navigate("/billing");
        // Commented by :- Parineeta Gedam on 28-05-2023
        // added by rohan -14/4/23
        // reason- To save updated order detail
        // secureLocalStorage.setItem('order', response.order)
        // secureLocalStorage.setItem('invoice_detail', response)
        // end of code
        // End of commented code by PArineeta Gedam on 28-05-2023

        // Added by :- Parineeta Gedam 
        // Date :- 28-05-2023
        // Reason :- remove the data from local stroage
        // Commented by ROhan kansari - 18/8/23 
        // Reason - To remove all data in back click only
        // secureLocalStorage.removeItem('order')
        // secureLocalStorage.removeItem('orderItem')
        // secureLocalStorage.removeItem('setting_data')
        // secureLocalStorage.removeItem('invoice_detail')
        // ENd of commenting 18/8/23 - Rohan kansari - To remove all data in back click only
        // End of added code by :- Parineeta Gedam on 28-05-2023
      }
    }
    else {
      message.error({
        // Modfication and addition by Om Shrivastava on 17-05-23
        // Reason : Change the confirmation message
        // content: "In Progress",
        content: "Please wait for confirmation",
        // End of mofication and addition by Om Shrivastava on 17-05-23
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
  // End of added code by :- Parineeta Gedam  Date :- 21-05-2023

  

  return (
    <>
      <div className='payment_heading_container'>
        <h1 className='payment_heading' style={{ color: colors.headingColor }}>Choose Payment Method</h1>
      </div>

      {/* Commented by :- Parineeta Gedam 
          Date :- 15-04-2023
          Reason :- re-desiging payment page
      */}

      {/* <div className='radio_container'>
        <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical">
            <Radio name="radio" id="Cash" value="Cash">
              <div className='payment_mode_container'>
                <div className='payment_mode_img_container'><img src={cashImg} style={{ width: '100%', height: '100%' }} alt="no img"></img></div>
                <span className='payment_mode_heading'>Cash</span>
              </div>
            </Radio>
            <Radio name="radio" id="Scanner" value="Scanner" >
              <div className='payment_mode_container'>
                <div className='payment_mode_img_container'><img src={scanImg} style={{ width: '100%', height: '10%' }} alt="no img"></img></div>
                <span className='payment_mode_heading'>Scanner</span>
              </div>
            </Radio>
            <Radio name="radio" id="Card" value="Card" >
              <div className='payment_mode_container'>
                <div className='payment_mode_img_container'><img src={cardImg} style={{ width: '100%', height: '10%' }} alt="no img"></img></div>
                <span className='payment_mode_heading'>Card</span>
              </div>
            </Radio>
          </Space>
        </Radio.Group>

        <div className='payment_btn_container'>
          <Button
            id="signBtn"
            type="primary"
            htmlType="submit"
            block
            className='payment_btn_heading'
            style={{
              backgroundColor: colors.bannerColor,
              color: colors.backgroundTheme,
              border: "none",
            }}
            onClick={() => {
              submitPaymentMode();
            }}
          >
            Pay
          </Button>
        </div>
      </div> */}

      {/* End of commented code 15-04-2023 */}

      {/* Added by :- Parineeta Gedam
          Date :- 15-04-2023
          Reason :- re-desiging payment page
      */}

      <div className='payment_parent_container'>
        <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical">
            <div className='payment_child_container'>
              <Radio name="radio" id="Cash" value="Cash" onClick={onChange}>
                <div className="payment_mode_container">
                  <div className='payment_mode_img_container'><img src={cashPayment} style={{ width: '100%', height: '100%' }} alt="no img"></img></div>
                  <span className='payment_mode_heading'>Cash</span>
                </div>
              </Radio>
            </div>
            <div className='payment_child_container'>
              <Radio name="radio" id="Scanner" value="Scanner"onClick={onChange}>
                <div className="payment_mode_container">
                  <div className='payment_mode_img_container'><img src={scan} style={{ width: '100%', height: '100%' }} alt="no img"></img></div>
                  <span className='payment_mode_heading'>Scanner</span>
                </div>
              </Radio>
            </div>
            {/* Commented by :- Parineeta Gedam on 21-04-2023
                reason :- now card option not show
            */}
            {/* <div className='payment_child_container'>
              <Radio name="radio" id="Card" value="Card">
                <div className="payment_mode_container">
                  <div className='payment_mode_img_container'><img src={debitCard} style={{ width: '100%', height: '100%' }} alt="no img"></img></div>
                  <span className='payment_mode_heading'>Card</span>
                </div>
              </Radio>
            </div> */}
            {/* End of commented code on 21-04-2023 */}
          </Space>
        </Radio.Group>
      </div>

      {/* Commented by :- Parineeta Gedam on 21-05-2023 
          reason :- don't show this button 
      */}
      {/* Commented by :- Parineeta Gedam on 21-05-2023 
          reason :-changes in ui 
      */}
      {/* <div className='payment_btn_container'>
        <Button
          id="signBtn"
          type="primary"
          htmlType="submit"
          block
          className='payment_btn_heading'
          style={{
            backgroundColor: colors.bannerColor,
            color: colors.backgroundTheme,
            border: "none",
          }}
          onClick={() => {
            submitPaymentMode();
          }}
        >
          Pay
        </Button>
      </div> */}
      {/* End of added code 15-04-2023 */}
      {/* End of added code by Parineeta gedam 21-05-2023 */}

      {/* Added by :- Parineeta Gedam on 21-05-2023
            reason :- changes in ui
        */}
      <div className='payment_btn_container'>

        {/* Added and Modified by :- Parineeta Gedam on 22-06-2023 
        reason :- After completing the order when we click on "Proceed to pay" button, then again confirmation notification is display on page */}
        {orders.payment_status == "Completed" ?
        <button className='payment_btn_pay' style={{ background: "grey", color: colors.backgroundTheme }}>Proceed to pay </button>: 
        <button className='payment_btn_pay' style={{ background: colors.bannerColor, color: colors.backgroundTheme}}
          onClick={(e) => submitPaymentMode()}>
          Proceed to pay </button>
        }
        {/* End of added and modified code by :- Parineeta Gedam on on 22-06-2023 */}

        {orders.payment_status == "Completed" ?
          <button className='payment_btn_get_bill' style={{ background: colors.bannerColor, color: colors.backgroundTheme }}
            onClick={(e) => checkPaymentStatus()}>Get Bill</button>
           :
          <button className='payment_btn_get_bill' style={{ background: "grey", color: colors.backgroundTheme }}
          >Get Bill</button>} 
      </div>

      {/* End of added code by :- Parineeta Gedam on 14-05-2023*/}


      <div>
        <Modal
          footer={null}
          visible={isModalOpen}
          onCancel={handleCancel}
        >
          <Scanner handleOk={handleOk} />
        </Modal>
      </div>


    </>
  )
}
