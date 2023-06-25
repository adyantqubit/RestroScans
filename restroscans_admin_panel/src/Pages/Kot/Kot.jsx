// created by rohan -13/4/23
// reason- this the bill pgae ui

import React, { useContext, useEffect, useState } from 'react'
import style from "./kot.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import { disableHeader } from '../../App';


const Kot = () => {

    const { state } = useLocation()
    const [kotData, setKot] = useState(null)
    const nav = useNavigate()

    useEffect(() => {
        // Added By Rohan Kansari - 25/6/23
        // Reason - To disable headerSiderbar
        disableHeader()
        // End of code - Rohan kansari - 25/6/23
        var data = {
            "items": state.orderItem,
            "detail": state.order,
            "restro_number": state.gstFssai,
            "restro_detail": state.restro_detail
        }
        // var data=null
        setKot(data)
        console.log(data)
    }, [])

    function ExtractDateTime(format) {
        var date = format.substring(0, 10)
        var time = format.substring(11, 16)
        return { date, time }
    }

    return (
        // Modified by Rohan Kansari - 24/4/23
        // Reason - To apply color even after 100vh
        <div className={style.container} style={{ paddingBottom: "50px", background: "grey" }} >
            {kotData ? <div className={style.kotContainer} style={{ background: "white", border: `1px solid black` }}>

                <div className={style.inLineContainer} >
                    <div className={style.Hotellabel} style={{ textAlign: "center" }}>{kotData.restro_detail.name.toUpperCase()}</div>
                </div>
                <hr />
                <div className={style.inLineContainer}>
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Date</div><div>:</div>  </div><div className={style.text}>{new Date(
                        kotData.detail.date
                    ).toLocaleDateString("en-GB")}</div></div>
                    <div className={style.column1}><div className={style.label}><div style={{ width: "90%" }}>Time</div><div>:</div> </div><div className={style.text}> {ExtractDateTime(kotData.detail.date).time}</div></div>
                </div>

                <div className={style.inLineContainer}>

                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Order id</div><div>:</div>  </div><div className={style.text}> {kotData.detail.order_id}</div></div>
                    <div className={style.column1}><div className={style.label}><div style={{ width: "90%" }}>Table</div><div>:</div>  </div><div className={style.text}>{
                        !kotData.detail.table_number ? "N/A" : kotData.detail.table_number
                    }</div></div>

                </div>


                <div className={style.tableHeader}>
                    <div className={style.serialNo}> SNo   </div>
                    <div className={style.titleHeading}>Item Name</div>
                    <div className={style.qtyHeading}>   Qty   </div>
                </div>
                {kotData.items.map((item, i) =>
                    <div className={style.tableContents}>
                        <div className={style.quantityText}>{i+1}</div>
                        <div className={style.titleText}>{item.item} ({
                            item.serving_size
                        })</div>
                        <div className={style.rateText}>{item.quantity}</div>
                    </div>

                )}
                <div className={style.btnContainer} id="btn">
                    <button className={style.btn} onClick={e=>nav(-1)}>Cancel</button>
                    <button className={style.btn} onClick={e=>window.print()}>Print</button>
                </div>
            </div>
                : null}


        </div>
    )
}

export default Kot

// end of code