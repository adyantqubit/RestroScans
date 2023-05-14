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


    const { colors, restaurant_name,rupee_sign } = useContext(GlobalContext)
    const [billingData, setBillingData] = useState(null)

    useEffect(() => {
        var data = {
            "items": secureLocalStorage.getItem('orderItem'),
            "detail": secureLocalStorage.getItem('order'),
            
            // Modified by rohankansari - 10/5/23 - To correct the customer detail name
            "customer_detail": secureLocalStorage.getItem('customer_details'),
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
        // Modified by rohankansari - 10/5/23 - extracting date
        var date = format.substring(0, 10)
        var time = format.substring(11, 16)

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
        <div style={{ background: colors.backgroundTheme,paddingBottom:"50px"}}>
            {billingData ? <div className={style.billingContainer} style={{ background: colors.backgroundTheme, border: `1px solid ${colors.subHeadingColor}` }}>
                <div className={style.inLineContainer} >
                    <div className={style.Hotellabel} style={{ textAlign: "center" }}>{restaurant_name.toUpperCase()}</div>
                </div>
                {/* Adding - by ROhankansari - 4/5/23
                    Reason- To manage style */}
                <div className={style.inLineContainer} style={{ textAlign: "center",margin:"0" }}>
                    <div className={style.centerLabel} style={{padding:"0 10px"}}>{billingData.restro_detail.address}</div>
                </div>
                {/* ENd of code - 4/5/23 */}

                {/* Modified by - ROhan Kansari - 4/5/23
                    Reason- Removing margin */}
    {/*Added by- ROhan kANsari- 11/5/23
       Reason - All modification is to align column   */}
                {billingData.restro_number.gstin?.length>0?<div className={style.inLineContainer} style={{ textAlign: "center", margin: "3px 0" }}>
                    <div className={style.centerLabel}>GSTIN :{`  `}{billingData.restro_number.gstin}</div>
                </div>:null}

                {billingData.restro_number.fssaino?.length>0?<div className={style.inLineContainer} style={{ textAlign: "center", margin: "3px 0" }}>
                    <div className={style.centerLabel}>FSSAI NO :{`  `}{billingData.restro_number.fssaino}</div>
                </div>:null}
                {/* End of code- 4/5/23 Rohan Kansari */}
                <div className={style.breakLine} />

                {/* Added by Rohan kansari - 10/5/23
                   Reason - Added new labels in bill ( name and contact number)*/}
                <div className={style.inLineContainer}>
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Name</div><div>:</div>  </div><div className={style.text}>{billingData.customer_detail.name.length ? billingData.customer_detail.name : " --- "}</div></div>
                    <div className={style.column1}><div className={style.label}><div style={{ width: "90%" }}>Phone</div><div>:</div> </div><div className={style.text}>{billingData.customer_detail.contact_number}</div></div>
                </div>
                {/* End of code - Rohan - 10/5/23 */}

                <div className={style.inLineContainer}>
                    {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                    {/* Modified on - 3/5/23 - To align colons */}
                    {/* Modified on - 10/5/23 - Getting payment date */}
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Bill</div><div>:</div>  </div><div className={style.text}>{billingData.detail.order_id}</div></div>
                    <div className={style.column1}><div className={style.label}><div style={{ width: "90%" }}>Payment</div><div>:</div>  </div><div className={style.text}>{billingData.detail.payment_mode}</div></div>

                    {/* ENd of code - Rohan - 24/4/23 */}
                </div>
                <div className={style.inLineContainer}>
                    {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                    {/* Modified on - 3/5/23 - To align colons */}
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Date</div><div>:</div>  </div><div className={style.text}>{ExtractDateTime(billingData.detail.payment_confirmation_date_time).date}</div></div>

                    <div className={style.column1}> <div className={style.label}><div style={{ width: "90%" }}>Table</div><div>:</div>   </div><div className={style.text}>{billingData.detail.table_number ? billingData.detail.table_number : 'N/A'}</div></div>
                    {/* ENd of code - Rohan - 24/4/23 */}
                </div>
                {/* <div className={style.inLineContainer}> */}
                      {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                         {/*Modified by Rohankansari- 29/4/23
                        Reason - requirements is to hide pax sess    */}
                {/* <div className={style.column1}>  <div className={style.label}>Pax  </div><div className={style.text}>{billingData.detail.pax}</div></div>
                <div className={style.column1}><div className={style.label}>Sess  </div><div className={style.text}>{billingData.detail.sess}</div></div> */}
                     {/* ENd of code - Rohan - 24/4/23 */}
                {/* </div> */}
                {/* <div className={style.inLineContainer}> */}
                     {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                        {/*Modified by Rohankansari- 29/4/23
                        Reason - requirements is to hide pax sess    */}
                {/* <div className={style.column1}> <div className={style.label}>Dshr  </div><div className={style.text}>{billingData.detail.dshr&&billingData.detail.dshr.length?billingData.detail.dshr:`N/A`}</div></div>
                <div className={style.column1}> <div className={style.label}>Capt  </div><div className={style.text}>{billingData.detail.capt&&billingData.detail.capt.length?billingData.detail.capt:`N/A`}</div></div> */}
                {/* ENd of code - Rohan - 24/4/23 */}
                {/* </div> */}
                <div className={style.inLineContainer}>
                    {/* Modiefied by Rohan kansari - 24/4/23
                        Reason - To align all label */}
                    {/* Modified on - 3/5/23 - To align colons */}
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Time</div><div>:</div> </div><div className={style.text}>{ExtractDateTime(billingData.detail.payment_confirmation_date_time).time}</div></div>

                    {/* Commented by - Rohan Kansari - 10/5/23
                    Reason - New requirement is to hide status column */}
                {/* <div className={style.column1}><div className={style.label}><div style={{width:"90%"}}>Status</div><div>:</div>   </div><div className={style.text}>{billingData.detail.payment_status}</div></div> */}
                {/* End of commenting- Rohan Kansari - 10/5/23 */}
                   {/* ENd of code - Rohan - 24/4/23 */}
                </div>
{/*End of code by- ROhan kANsari- 11/5/23 */}
                <div className={style.tableHeader}>
                    <div className={style.titleHeading}>
                        Item Name
                    </div>
                    <div className={style.quantityHeading}>
                        Qty
                    </div>
                    {/* Added by Rohan KAnsari 5/5/23- showing rupees sign only in top  */}
                    <div className={style.rateHeading}>
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */}
                        {/* Rate(₹) */}
                        Rate({rupee_sign})
                        {/* End of addition by Om Shrivastava on 08-05-23 */}

                    </div>
                    {/* Added by Rohan KAnsari 5/5/23- showing rupees sign only in top  */}
                    <div className={style.totalHeading}>
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */}
                        {/* Amount(₹) */}
                        Amount({rupee_sign})
                        {/* End of addition by Om Shrivastava on 08-05-23 */}

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
                        {/* Modified by Rohan Kansari - 14/5/23
                            Reason - To apply float format in prices */}
                        <div className={style.rateText}>
                            {(o.price / o.quantity).toFixed(2)}
                        </div>
                        <div className={style.totalText}>
                            {o.price.toFixed(2)}
                        </div>
                        {/* End of code - Rohan kansari */}
                    </div>
                )}

                <div className={style.breakLine} />

                <div className={style.CalculationBoxContainer}>
                    <div className={style.calculationBox}>
                        {/* Modified on - 3/5/23 - To align colons */}
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */}
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */}
                        {/* <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>Sub-Total</div><div>:</div> </div> <div className={style.calculationText}>₹{SubtotalOfItems().toFixed(2)}</div></div> */}
                        {/* Modified by Rohan kansari - 14/5/23 - To hide if cgst and sgst */}
                        {billingData?.detail.cgst>0&&billingData?.detail.sgst>0?<div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>Sub-Total</div><div>:</div> </div> <div className={style.calculationText}>{rupee_sign}{SubtotalOfItems().toFixed(2)}</div></div>:null}
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                        
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */}
                        {/* <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>CGST</div><div>({(billingData.detail.cgst/SubtotalOfItems()*100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>₹{(billingData.detail.cgst).toFixed(2)}</div></div> */}
                        {/* Modified by ROhan kansari - 13/5/23 - to remove cgst if price is zero*/}
                         {/* Modified by - ROhan KAnsari - 13/5/23 to dont show cgst if it is zero*/}
                        {billingData?.detail.cgst>0?<div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>CGST</div><div>({(billingData.detail.cgst/SubtotalOfItems()*100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.cgst).toFixed(2)}</div></div>:null}
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                        
                         {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */}
                        {/* <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>SGST</div><div>({(billingData.detail.sgst/SubtotalOfItems()*100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>₹{(billingData.detail.sgst).toFixed(2)}</div></div> */}
                          {/* Modified by - ROhan KAnsari - 13/5/23 to dont show sgst if it is zero*/}
                         {billingData?.detail.sgst>0?<div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>SGST</div><div>({(billingData.detail.sgst/SubtotalOfItems()*100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.sgst).toFixed(2)}</div></div>:null}
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                        
                        {billingData?.detail.cgst>0&&billingData?.detail.sgst>0?<div className={style.breakLine} style={{width:"98%"}}/>:null}
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */} 
                        {/* <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>Total</div><div>:</div></div> <div className={style.calculationText}>₹{(SubtotalOfItems()+billingData.detail.cgst+billingData.detail.sgst).toFixed(2)}</div></div> */}
                        <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>Total</div><div>:</div></div> <div className={style.calculationText}>{rupee_sign}{(SubtotalOfItems()+billingData.detail.cgst+billingData.detail.sgst).toFixed(2)}</div></div>
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                         
                    </div>
                </div>

               <div className={style.breakLine} />
                <div className={style.TotalBoxContainer} >
                    <div className={style.TotalBox}>
                        {/* // Modified and commented by Om Shrivastava on 08-05-23
                         // Reason : Create the rupee sign globally for using the config file. */}
                        {/* <div className={style.calculationLine}><div className={style.TotalLabel}>Total :</div> <div className={style.TotalText}>₹{(SubtotalOfItems()+billingData.detail.cgst+billingData.detail.sgst).toFixed(2)}</div></div> */}
                        <div className={style.calculationLine}><div className={style.TotalLabel}>Total :</div> <div className={style.TotalText}>{rupee_sign}{(SubtotalOfItems()+billingData.detail.cgst+billingData.detail.sgst).toFixed(2)}</div></div>
                        {/* End of addition by Om Shrivastava on 08-05-23 */}
                         
                    </div>
                </div>
                <div className={style.breakLine} />  
                  {/* Modified by - ROhan Kansari - 4/5/23
                    Reason- Removing margin */}
                <div className={style.calculationLine}><div className={style.calculationLabel}>******** THANK YOU VISIT AGAIN *********</div></div>
                {/* End of code */}
                
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