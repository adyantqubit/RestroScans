// Added by :- Parineeta Gedam
// Date :- 07-04-2023   
// Reason :- show the bill success page

import { React, useContext, useState } from 'react';
import secureLocalStorage from "react-secure-storage";
import { postCheckPaymentStatus } from '../../api/Services';
import { Button, message } from "antd";
import { GlobalContext } from "../../context/Context";
import { useNavigate, useParams } from "react-router-dom";


export default function BillSuccess() {

    // get data from context
    var { colors } = useContext(GlobalContext);

    // for navigations
    const navigate = useNavigate();

    // get data from local stroage
    var orders = secureLocalStorage.getItem('order');

    // Added by :- Parineeta Gedam
    // Date :- 13-04-2023
    // Reason :- check payment status 

    const [order, setOrder] = useState([]);

    const checkPaymentStatus = async () => {
        var tenantName = localStorage.getItem("tenantName")
        const order = {
            order_id: orders.order_id,
        }
        const response = await postCheckPaymentStatus(order, tenantName);
        console.log("response", response)
        setOrder(response)
        if (response.order.payment_status == "Completed") {
            if (response.order) {
                navigate("/billing");
            }
        }
        else {
            message.error({
                content: "In Progress",
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

    // End of added code

    return (
        <>
            <div>BillSuccess</div>

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
                        checkPaymentStatus();
                    }}
                >
                    Get Bill
                </Button>
            </div>
        </>

    )
}

// End of added code 13-04-2023