import React, { useContext, useEffect } from 'react'
import style from "../style/kot.module.css"
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from '../../../../Context/AppContext';
import { useKotState } from "../../usestate/kotState";
import { kotDateTime } from "../../services/kotService";

const Kot = () => {
    const { disableHeader } = useApp();

    const { state } = useLocation()
    var {
        kotData,
        setKot,
    } = useKotState();
    const nav = useNavigate()

    useEffect(() => {
        disableHeader()
        var data = {
            "items": state?.orderItem || [],
            "detail": state?.order || null,
            "restro_number": state?.gstFssai || null,
            "restro_detail": state?.restro_detail || null
        }
        if (state?.orderItem && state?.order && state?.restro_detail) setKot(data)
    }, [])

    function ExtractDateTime(format) {
        return kotDateTime(format)
    }

    if (!state?.orderItem || !state?.order || !state?.restro_detail) {
        return <div style={{ padding: 24 }}>KOT print data is unavailable. Open an order and use its Print KOT action.</div>;
    }

    return (
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
                        <div className={style.quantityText}>{i + 1}</div>
                        <div className={style.titleText}>{item.item} ({
                            item.serving_size
                        })</div>
                        <div className={style.rateText}>{item.quantity}</div>
                    </div>
                )}
                <div className={style.btnContainer} id="btn">
                    <button className={style.btn} onClick={e => nav(-1)}>Cancel</button>
                    <button className={style.btn} onClick={e => window.print()}>Print</button>
                </div>
            </div>
                : null}

        </div>
    )
}

export default Kot
