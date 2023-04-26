// created by rohan -13/4/23
// reason- this the bill pgae ui

import React, { useContext, useEffect, useState } from 'react'
import style from "./billing.module.css"
import { GlobalContext } from '../../context/Context'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from "react-router-dom";


const Billing = () => {

    // Added by :- Parineeta Gedam
    const navigate = useNavigate();


    const { colors, restaurant_name } = useContext(GlobalContext)
    const [billingData, setBillingData] = useState(null)

    useEffect(() => {
        var data = {
            "items": secureLocalStorage.getItem('orderItem'),
            "detail": secureLocalStorage.getItem('order'),
            "customer_detail": secureLocalStorage.getItem('customerDetails'),
            "restro_number":secureLocalStorage.getItem('invoice_detail').setting,
            "restro_detail":secureLocalStorage.getItem('invoice_detail').tenant
      
        }
        setBillingData(data)
        console.log(data)
    }, [])

    // created by rohan -14/4/23
    // reason- To extract date and time
    function ExtractDateTime(format) {
        var d = new Date(format);
        var date = d.toLocaleDateString()
        var time = d.toLocaleTimeString()

        return { date, time }
    }


    function SubtotalOfItems(){
        var total=0
        billingData.items.filter(o=>{
           total+=o.price
        })

        return total
    }

    return (
        // Modified by Rohan Kansari - 24/4/23
        // Reason - To apply color even after 100vh
        <div style={{ background: colors.backgroundTheme}}>
            {billingData ? <div className={style.billingContainer} style={{ background: colors.backgroundTheme, border: `1px solid ${colors.subHeadingColor}` }}>
                <div className={style.inLineContainer} >
                    <div className={style.Hotellabel} style={{ textAlign: "center" }}>{restaurant_name.toUpperCase()}</div>
                </div>
                <div className={style.inLineContainer} style={{ textAlign: "center" }}>
                    <div className={style.centerLabel}>{billingData.restro_detail.address}</div>
                </div>
                <div className={style.inLineContainer} style={{ textAlign: "center" }}>
                    <div className={style.centerLabel}>GSTIN :-{`  `}{billingData.restro_number.gstin}</div>
                </div>
                <div className={style.inLineContainer} style={{ textAlign: "center" }}>
                    <div className={style.centerLabel}>FSSAI NO :-{`  `}{billingData.restro_number.fssaino}</div>
                </div>
                <div className={style.breakLine} />
                <div className={style.inLineContainer}>
                    {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                    <div className={style.column1}><div className={style.label}>Date  </div><div className={style.text}>{ExtractDateTime(billingData.detail.date).date}</div></div>
                    <div className={style.column1}><div className={style.label}>Time  </div><div className={style.text}>{ExtractDateTime(billingData.detail.date).time}</div></div>
                     {/* ENd of code - Rohan - 24/4/23 */}
                </div>
                <div className={style.inLineContainer}>
                    {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                <div className={style.column1}><div className={style.label}>Bill  </div><div className={style.text}>{billingData.detail.order_id}</div></div>
                <div className={style.column1}> <div className={style.label}>Table  </div><div className={style.text}>{billingData.detail.table_number ? billingData.detail.table_number : 'N/A'}</div></div>
                   {/* ENd of code - Rohan - 24/4/23 */}
                </div>
                <div className={style.inLineContainer}>
                      {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                <div className={style.column1}>  <div className={style.label}>Pax  </div><div className={style.text}>{billingData.detail.pax}</div></div>
                <div className={style.column1}><div className={style.label}>Sess  </div><div className={style.text}>{billingData.detail.sess}</div></div>
                     {/* ENd of code - Rohan - 24/4/23 */}
                </div>
                <div className={style.inLineContainer}>
                     {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                <div className={style.column1}> <div className={style.label}>Dshr  </div><div className={style.text}>{billingData.detail.dshr&&billingData.detail.dshr.length?billingData.detail.dshr:`N/A`}</div></div>
                <div className={style.column1}> <div className={style.label}>Capt  </div><div className={style.text}>{billingData.detail.capt&&billingData.detail.capt.length?billingData.detail.capt:`N/A`}</div></div>
                {/* ENd of code - Rohan - 24/4/23 */}
                </div>
                <div className={style.inLineContainer}>
                    {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                <div className={style.column1}><div className={style.label}>Payment  </div><div className={style.text}>{billingData.detail.payment_mode}</div></div>
                <div className={style.column1}><div className={style.label}>Status  </div><div className={style.text}>{billingData.detail.payment_status}</div></div>
                   {/* ENd of code - Rohan - 24/4/23 */}
                </div>

                <div className={style.tableHeader}>
                    <div className={style.titleHeading}>
                        Item Name
                    </div>
                    <div className={style.quantityHeading}>
                        Qty
                    </div>
                    <div className={style.rateHeading}>
                        Rate
                    </div>
                    <div className={style.totalHeading}>
                        Amount
                    </div>
                </div>
                {billingData.items.map(o =>
                    <div className={style.tableContents}>
                        <div className={style.titleText}>
                            {o.item} ({o.serving_size})
                        </div>
                        <div className={style.quantityText}>
                            {o.quantity}
                        </div>
                        <div className={style.rateText}>
                            ₹{o.price/o.quantity}
                        </div>
                        <div className={style.totalText}>
                            ₹{o.price}
                        </div>
                    </div>
                )}

                <div className={style.breakLine} />

                <div className={style.CalculationBoxContainer}>
                    <div className={style.calculationBox}>
                        <div className={style.calculationLine}><div className={style.calculationLabel}>Sub-Total :</div> <div className={style.calculationText}>₹{SubtotalOfItems().toFixed(2)}</div></div>
                        <div className={style.calculationLine}><div className={style.calculationLabel}>CGST({(billingData.detail.cgst/SubtotalOfItems()*100).toFixed(2)}%) :</div> <div className={style.calculationText}>₹{(billingData.detail.cgst).toFixed(2)}</div></div>
                        <div className={style.calculationLine}><div className={style.calculationLabel}>SGST({(billingData.detail.sgst/SubtotalOfItems()*100).toFixed(2)}%) :</div> <div className={style.calculationText}>₹{(billingData.detail.sgst).toFixed(2)}</div></div>
                        <div className={style.breakLine} />   
                        <div className={style.calculationLine}><div className={style.calculationLabel}>Total :</div> <div className={style.calculationText}>₹{(SubtotalOfItems()+billingData.detail.cgst+billingData.detail.sgst).toFixed(2)}</div></div>
                    </div>
                </div>

                <div className={style.breakLine} />
                <div className={style.TotalBoxContainer} >
                    <div className={style.TotalBox}>
                        <div className={style.calculationLine}><div className={style.TotalLabel}>Total :</div> <div className={style.TotalText}>₹{(SubtotalOfItems()+billingData.detail.cgst+billingData.detail.sgst).toFixed(2)}</div></div>
                    </div>
                </div>
                <div className={style.breakLine} />  

                <div className={style.calculationLine}><div className={style.calculationLabel}>****** THANK YOU VISIT AGAIN ******</div></div>

                {/* Added by :- Parineeta Gedam
                    Date :- 24-04-2023
                    Reason :- Add rate and review
                */}
                <div className={style.rate_us_container}>
                    {/* Commented by :- Parineeta Gedam */}
                    {/* <div className={style.rate_us_heading}>Rating and Review</div> */}
                    <div className={style.rate_us_btn_container}>
                    <button className={style.rate_us_button} style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={(e) => navigate("/rating-review")}>Rate us</button>
                    </div>
                </div>
                {/* End of added code on 24-04-2023  */}
            </div> : null}
        </div>
        // End of code - 24/4/23- Rohan Kansari
    )
}

export default Billing

// end of code