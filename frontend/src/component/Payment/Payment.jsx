import { React, useContext, useState } from 'react';
import { Radio, Space, Button, Modal, message } from "antd";
import { GlobalContext } from "../../context/Context";
import secureLocalStorage from "react-secure-storage";
import './Payment.css';
import { updatePaymentModeApi } from '../../api/Services';
import { useNavigate } from "react-router-dom";
import Scanner from '../Scanner/Scan';
import cashPayment from "../../images/cashPayment.png";
import scan from "../../images/scan.png";
import debitCard from "../../images/debitCard.png";
import { CheckCircleOutlined } from '@ant-design/icons';

export default function Payment() {

  // get colors from context 
  var { colors } = useContext(GlobalContext);

  // get data from local stroage
  var orders = secureLocalStorage.getItem('order');

  // for navigations
  const navigate = useNavigate();

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- click on cash radio options.
  const [value, setValue] = useState("Cash");
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

  const submitPaymentMode = () => {
    if (document.getElementById("Cash").checked) {
      ordernow("Cash");
    }
    if (document.getElementById("Scanner").checked) {
      showModal();
    }
    if (document.getElementById("Card").checked) {
      ordernow("Card");
    }
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
      // Commented by :- Parineeta Gedam
      // Date :- 14-04-2023
      // Reason :- dont'show success msg
      // message.success({
      //   content: "Payment done successfully",
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
      // End of commented code 14-04-2023
      navigate("/bill-success");
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
  // End of added code 10-04-2023


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
              <Radio name="radio" id="Cash" value="Cash">
                <div className="payment_mode_container">
                  <div className='payment_mode_img_container'><img src={cashPayment} style={{ width: '100%', height: '100%' }} alt="no img"></img></div>
                  <span className='payment_mode_heading'>Cash</span>
                </div>
              </Radio>
            </div>
            <div className='payment_child_container'>
              <Radio name="radio" id="Scanner" value="Scanner">
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
      {/* End of added code 15-04-2023 */}

      <div>
        <Modal
          footer={null}
          visible={isModalOpen}
          onCancel={handleCancel}
        >
          <Scanner />
        </Modal>
      </div>


    </>
  )
}
