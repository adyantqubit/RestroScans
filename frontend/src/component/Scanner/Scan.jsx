import { React,useEffect, useState,useContext } from 'react';
import { GlobalContext } from "../../context/Context";
import { Button, message} from "antd";
import { getScannerApi } from '../../api/Services';
import { updatePaymentModeApi } from '../../api/Services';
import secureLocalStorage from "react-secure-storage";


export default function Scan() {

  // get colors from context 
  var { colors } = useContext(GlobalContext);

  // get data from local stroage
  var tenantName = localStorage.getItem("tenantName");
  var orders = secureLocalStorage.getItem('order');

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
  console.log("sdaf", scanner)

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
    // Reason :- click on cash radio options.
    const [value, setValue] = useState("scanner");
    const onChange = (e) => {
        setValue(e.target.value);
    };
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
    // Reason :- when user select "Cash" option then in order table "payment mode will be update."
    const ordernow = async (value) => {
      const order = {
        order_id: orders.order_id,
        payment_mode: "scanner",
      }
      var tenantName = localStorage.getItem("tenantName");
      const response = await updatePaymentModeApi(tenantName, order);
      console.log("res", order)
      console.log("ghchgc",response)
      if(response.msg) {
        message.success({
          content: "success",
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
      else {
        message.error({
          content: "error",
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
   <div style={{ paddingTop: "4%", backgroundColor: "#f0f0f0" }}>
      <h2
        style={{
          textAlign: "center",
          justifyContent: "center",
          color: "black",
        }}
      >
        <b>Scan and Pay</b>
      </h2>
      <div className="scanner_pardiv">
        <div
          className="scanner_childdiv"
          style={{ textAlign: "center", justifyContent: "center" }}
        >
          {/* {myqrad.map((article) => {
            return (
              <img
                src={config.staticBaseURL + article.myqr}
                style={{
                  width: "10vw",
                  textAlign: "center",
                  justifyContent: "center",
                }}
                className="scanner_img"
              />
            );
          })} */}
          <br></br>
          <h6 style={{ textAlign: "center", justifyContent: "center" }}>
            Scan this QR code to secure payments
          </h6>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          justifyContent: "center",
          paddingBottom: "1%",
        }}
      >
        {/* {props.hidebutton ? null : ( */}
          <Button
            htmlType="submit"
            type="primary"
            style={{
              backgroundColor: colors.bannerColor,
              color: colors.backgroundTheme,
              border: "none",
              fontWeight: "600",
            }}
            onClick={submitPaymentMode}
          >
            Pay and Confirm Order{" "}
          </Button>
        {/* )} */}
      </div>
    </div>
    </>
  )
}
