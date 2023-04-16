// Added by :- PArineeta Gedam
// Date :- 14-04-2023
// Reason :- show the scanner

import { React, useEffect, useState, useContext } from 'react';
import { GlobalContext } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import { getScannerApi } from '../../api/Services';
import { updatePaymentModeApi } from '../../api/Services';
import secureLocalStorage from "react-secure-storage";
import siteConfig from "../../config/config";
import './Scan.css';
import { CheckCircleOutlined } from '@ant-design/icons';

export default function Scan() {

  // get colors from context 
  var { colors } = useContext(GlobalContext);

  // get data from local stroage
  var tenantName = localStorage.getItem("tenantName");
  var orders = secureLocalStorage.getItem('order');

  // for navigations
  const navigate = useNavigate();

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- get scanner
  const [scanner, setScanner] = useState([]);

  useEffect(() => {
    getScanner();
  }, []);

  const getScanner = async () => {
    const scanner = await getScannerApi(tenantName);
    if (scanner) {
      setScanner(scanner);
    }
  };

  // End of added code 11-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- when select "Scanner" options then open a model.

  // commented by :- Parineeta Gedam
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };
  // End of added code 10-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- click on cash radio options.

  // commented by :- Parineeta Gedam
  // const [value, setValue] = useState("scanner");
  // const onChange = (e) => {
  //   setValue(e.target.value);
  // };
  // End of added code 11-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- check, which radio options select by user.
  const submitPaymentMode = () => {
    ordernow();
  };
  // End of added code 10-04-2023

  // Added by :- Parineeta Gedam
  // Date :- 10-04-2023
  // Reason :- when user select "scanner" option then in order table "payment mode will be update."
  const ordernow = async (value) => {
    const order = {
      order_id: orders.order_id,
      payment_mode: "Scanner",
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
      <div className='scanner_parent_container'>
        <h1
          className='scanner_heading'
          style={{ backgroundColor: colors.headingBackgroundColor, color: colors.headingColor }}
        >
          Scan and Pay
        </h1>
        <div className="scanner_img_container">
          <div
            className="scanner_childdiv"
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            {scanner.map((scanner) => {
              return (
                <>
                  <img
                    src={siteConfig.siteURL + scanner.scanner}
                    style={{
                      width: "50vw",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                    className="scanner_img"
                  />

                  {/* Added by :- Parineeta Gedam
                Date :- 15-04-2023
                Reason :- show name and contact number
             */}
                  <div className='scan_details_1'>
                    <span className='scan_details_value'>{scanner.name}</span>
                  </div>
                  <div className='scan_details_1'>
                    <span className='scan_details_heading'>Contact Number </span>
                    <span className='scan_details_colon'>: </span>
                    <span className='scan_details_value'>{scanner.contact_number}</span>
                  </div>
                  {/* End of added code 15-04-2023 */}
                </>
              );
            })}
            <br></br>
            {/* Commented by :- Parineeta Gedam on 15-04-2023 */}
            {/* <h1 className="scan_sub_heading">
              Scan this QR code to secure payments
            </h1> */}
            {/* End of commented code 15-04-2023
             */}


          </div>
        </div>

        <div className='scanner_btn_container'>
          <Button
            htmlType="submit"
            type="primary"
            className='scanner_btn_heading'
            style={{
              backgroundColor: colors.bannerColor,
              color: colors.backgroundTheme,
              border: "none",
            }}
            onClick={submitPaymentMode}
          >
            {/* Pay and Confirm Order */}
            Confirm
          </Button>
        </div>
      </div>
    </>
  )
}

// End of added code 13-04-2023