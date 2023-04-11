import { React, useContext, useEffect, useState } from 'react';
import { Radio, Space, Button, Modal} from "antd";
import { GlobalContext } from "../../context/Context";
import secureLocalStorage from "react-secure-storage";
import './Payment.css';
import { updatePaymentModeApi } from '../../api/Services';
import { useNavigate, useParams } from "react-router-dom";

export default function Payment() {

    // get colors from context 
    var { colors } = useContext(GlobalContext);
    var orders = secureLocalStorage.getItem('order');
    
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
  
    const navigate = useNavigate();


    // svhavchjd

    const ordernow = async (value) => {
        const order = {
          order_id: orders.order_id,
          payment_mode: "cash",
        }
        var tenantName = localStorage.getItem("tenantName");
        const response = await updatePaymentModeApi(tenantName, order);
        console.log("res", order)
        console.log("ghchgc",response)
    }
    // 

    // pari

    const [value, setValue] = useState("cash");
    const onChange = (e) => {
        setValue(e.target.value);
    };

    const submitPaymentMode = () => {
        if (document.getElementById("YES").checked) {
          ordernow();
        } else {
            
        //   showModal();
        }
      };
    

    // 
    return (
        <>
            <div className='payment_heading_container'>
                <span className='payment_heading'>Choose Payment Method</span>
            </div>

            <div className='radio_container'>
                <Radio.Group onChange={onChange} value={value}>
                    <Space direction="vertical">
                        <Radio name="radio" id="YES" value="cash">
                            <div className='payment_mode_container'>
                                <img />
                                <span>Pay in Cash</span>
                            </div>
                        </Radio>
                        <Radio name="radio" id="no" value="online">
                            <b>Pay Securely with scan</b>
                        </Radio>
                    </Space>
                </Radio.Group>
            </div>

            <div className='payment_btn_container'>
                <Button
                    id="signBtn"
                    type="primary"
                    htmlType="submit"
                    block
                    style={{
                        backgroundColor: colors.bannerColor,
                        color: colors.backgroundTheme,
                        border: "none",
                        fontWeight: "600",
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
                {/* <Scanner /> */}
              </Modal>
            </div>


        </>
    )
}
