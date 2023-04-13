import { React, useContext, useState } from 'react';
import { Radio, Space, Button, Modal, message } from "antd";
import { GlobalContext } from "../../context/Context";
import secureLocalStorage from "react-secure-storage";
import './Payment.css';
import { updatePaymentModeApi } from '../../api/Services';
import { useNavigate, useParams } from "react-router-dom";
import Scanner from '../Scanner/Scan';
import cashImg from "../../images/cashImg.jpg";
import cardImg from "../../images/cardImg.png";


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
  const [value, setValue] = useState("cash");
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
  const submitPaymentMode = () => {
    if (document.getElementById("YES").checked) {
      ordernow();
    } else {
      showModal();
    }
  };
  // End of added code 10-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- when user select "Cash" option then in order table "payment mode will be update."
  const ordernow = async (value) => {
    const order = {
      order_id: orders.order_id,
      payment_mode: "cash",
    }
    var tenantName = localStorage.getItem("tenantName");
    const response = await updatePaymentModeApi(tenantName, order);
    console.log("res", order)
    console.log("ghchgc", response)
    if (response.msg) {
      message.success({
        content: "Payment done successfully",
        key: 1,
        // icon: <CheckCircleOutlined />,
        style: {
          marginTop: '5vh',
          fontSize: "16px",
          letterSpacing: "1.3px",
          fontFamily: "Times News Roman",
          color: colors.headingColor,
        },
      });
      navigate("/bill-success");
    }
    else {
      message.error({
        content: "Please try again",
        key: 1,
        // icon: <CheckCircleOutlined />,
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
        <h1 className='payment_heading'>Choose Payment Method</h1>
      </div>

      <div className='radio_container'>
        <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical">
            <Radio name="radio" id="YES" value="cash">
              <div className='payment_mode_container'>
                <div className='payment_mode_img_container'><img src={cashImg} style={{ width: '100%', height: '100%' }} alt="no img"></img></div>
                <span className='payment_mode_heading'>Cash</span>
              </div>
            </Radio>
            <Radio name="radio" id="no" value="scanner" >
              <div className='payment_mode_container'>
                <div className='payment_mode_img_container'><img src={cardImg} style={{ width: '100%', height: '10%' }} alt="no img"></img></div>
                <span className='payment_mode_heading'>Scan</span>
              </div></Radio>
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
