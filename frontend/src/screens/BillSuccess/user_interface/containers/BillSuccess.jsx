import { React, useContext, useState } from 'react';
import secureLocalStorage from "react-secure-storage";
import { postCheckPaymentStatus } from '../../../Payment/services/paymentService';
import { Button, message } from "antd";
import { GlobalContext } from "../../../../context/Context";
import { useNavigate} from "react-router-dom";
import '../style/BillSuccess.css';
import enjoyYourMealImg1 from "../../../../images/enjoyYourMealImg1.jpg";
import { CheckCircleOutlined } from '@ant-design/icons';
import { useBillSuccessState } from "../../usestate/billSuccessState";

export default function BillSuccess() {
    // get data from context
    var { colors } = useContext(GlobalContext);

    const navigate = useNavigate();

    // get data from local stroage
    var orders = secureLocalStorage.getItem('order');

    var { order, setOrder } = useBillSuccessState();

    const checkPaymentStatus = async () => {
        var tenantName = localStorage.getItem("tenantName")
        const order = {
            order_id: orders.order_id,
        }
        const response = await postCheckPaymentStatus(order, tenantName);
        setOrder(response)
        if (response && response.order && response.order.payment_status == "Completed") {
            {
                navigate("/billing");
                secureLocalStorage.setItem('order',response.order)
                secureLocalStorage.setItem('invoice_detail',response)
            }
        }
        else {
            message.error({
                content: "Please wait for confirmation",
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

    return (
        <>
            <div className='bill-success-container'>
            <img src={enjoyYourMealImg1} style={{ width: '100%', height: '100%' }} alt="no img"></img>
            </div>

            <div className='bill_success_btn_container'>
                <Button
                    id="signBtn"
                    type="primary"
                    htmlType="submit"
                    block
                    className='bill_success_btn_heading'
                    style={{
                        backgroundColor: colors.bannerColor,
                        color: colors.backgroundTheme,
                        border: "none",
                    }}
                    onClick={() => {
                        checkPaymentStatus();
                    }}
                >
                    Get Bill
                </Button>
            </div>
        </>
    )
}
