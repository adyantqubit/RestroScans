// created by rohan -13/4/23
// reason- this the bill pgae ui

import React, { useContext, useEffect, useState } from 'react'
import style from "./billing.module.css"

import { useLocation, useNavigate } from "react-router-dom";
import { disableHeader } from '../../App';


const Billing = () => {

    const {state}=useLocation()

    const [billingData, setBillingData] = useState(null)
    const nav=useNavigate()

    useEffect(() => {
        // Added By Rohan Kansari - 25/6/23
        // Reason - To disbale headerSiderbar
        disableHeader()
        // End of code - Rohan kansari - 25/6/23
        var data = {
            "items": state.orderItem,
            "detail": state.order,
            "restro_number":state.gstFssai,
            "restro_detail":state.restro_detail
      
        }
        // var data=null
        setBillingData(data)
        console.log(data)
    }, [])

    
    function ExtractDateTime(format) {
    
        var date = format?.substring(0, 10)
        var time = format?.substring(11, 16)

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
        <div style={{ paddingBottom:"50px",background:"grey"}} >
            {billingData ? <div className={style.billingContainer} style={{ background:"white",border: `1px solid black` }}>
                <div className={style.inLineContainer} >
                    <div className={style.Hotellabel} style={{ textAlign: "center" }}>{billingData.restro_detail.name.toUpperCase()}</div>
                </div>
                
                <div className={style.inLineContainer} style={{ textAlign: "center",margin:"0" }}>
                    <div className={style.centerLabel} style={{padding:"0 10px"}}>{billingData.restro_detail.address}</div>
                </div>
             
                {billingData.restro_number.gstin?.length>0?<div className={style.inLineContainer} style={{ textAlign: "center", margin: "3px 0" }}>
                    <div className={style.centerLabel}>GSTIN :{`  `}{billingData.restro_number.gstin}</div>
                </div>:null}

                {billingData.restro_number.fssaino?.length>0?<div className={style.inLineContainer} style={{ textAlign: "center", margin: "3px 0" }}>
                    <div className={style.centerLabel}>FSSAI NO :{`  `}{billingData.restro_number.fssaino}</div>
                </div>:null}
                {/* End of code- 4/5/23 Rohan Kansari */}
                <div className={style.breakLine} />

                
                <div className={style.inLineContainer}>
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Name</div><div>:</div>  </div><div className={style.text}>{billingData.detail.customer_name.length ? billingData.detail.customer_name : " --- "}</div></div> 
                     <div className={style.column1}><div className={style.label}><div style={{ width: "90%" }}>Phone</div><div>:</div> </div><div className={style.text}>{billingData.detail.customer_number}</div></div>
                </div>

                <div className={style.inLineContainer}>
                    
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Bill</div><div>:</div>  </div><div className={style.text}>{billingData.detail.order_id}</div></div>
                    <div className={style.column1}><div className={style.label}><div style={{ width: "90%" }}>Payment</div><div>:</div>  </div><div className={style.text}>{billingData.detail.payment_mode}</div></div>

                </div>
                <div className={style.inLineContainer}>
                  
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Date</div><div>:</div>  </div><div className={style.text}>{ExtractDateTime(billingData.detail.payment_confirmation_date_time).date}</div></div>

                    <div className={style.column1}> <div className={style.label}><div style={{ width: "90%" }}>Table</div><div>:</div>   </div><div className={style.text}>{billingData.detail.table_number ? billingData.detail.table_number : 'N/A'}</div></div>
                </div>
                
                <div className={style.inLineContainer}>

                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Time</div><div>:</div> </div><div className={style.text}>{ExtractDateTime(billingData.detail.payment_confirmation_date_time).time}</div></div>

                </div>
                <div className={style.tableHeader}>
                    <div className={style.titleHeading}>
                        Item Name
                    </div>
                    <div className={style.quantityHeading}>
                        Qty
                    </div>
                    <div className={style.rateHeading}>
                   
                        Rate({})

                    </div>
                    <div className={style.totalHeading}>
                
                        Amount({})

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
                            {(o.price / o.quantity).toFixed(2)}
                        </div>
                        <div className={style.totalText}>
                            {o.price.toFixed(2)}
                        </div>
                    </div>
                )}

                <div className={style.breakLine} />

                <div className={style.CalculationBoxContainer}>
                    <div className={style.calculationBox}>
             
                        {billingData?.detail.cgst>0||billingData?.detail.sgst>0?<div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>Sub-Total</div><div>:</div> </div> <div className={style.calculationText}>{}{SubtotalOfItems().toFixed(2)}</div></div>:null}
                        
                        {/* Added by Om shrivastava on 26-06-23
                        Reason : When loyality point show than show this div */}
                        {billingData?.detail.loyality_point_price>0?
                            <div className={style.calculationLine}>
                                <div className={style.calculationLabel}>
                                    <div style={{width:"98%"}}>Discount</div>
                                    <div> :</div>
                                     </div>
                                      <div className={style.calculationText}>{(billingData.detail.loyality_point_price).toFixed(2)}</div></div>:null}
                        {/* End of addition by Om Shrivastava on 26-06-23 */}

                        {billingData?.detail.cgst>0?<div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>CGST</div><div>({(billingData.detail.cgst/SubtotalOfItems()*100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{}{(billingData.detail.cgst).toFixed(2)}</div></div>:null}
                       
                         {billingData?.detail.sgst>0?<div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>SGST</div><div>({(billingData.detail.sgst/SubtotalOfItems()*100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{}{(billingData.detail.sgst).toFixed(2)}</div></div>:null}
                        
                        {billingData?.detail.cgst>0&&billingData?.detail.sgst>0?<div className={style.breakLine} style={{width:"98%"}}/>:null}
                        <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{width:"98%"}}>Total</div><div>:</div></div> <div className={style.calculationText}>{}{(SubtotalOfItems()+billingData.detail.cgst+billingData.detail.sgst).toFixed(2)}</div></div>
                         
                    </div>
                </div>

               <div className={style.breakLine} />
                <div className={style.TotalBoxContainer} >
                    <div className={style.TotalBox}>
                       <div className={style.calculationLine}><div className={style.TotalLabel}>Total :</div> <div className={style.TotalText}>{}{(SubtotalOfItems()+billingData.detail.cgst+billingData.detail.sgst).toFixed(2)}</div></div>
                         
                    </div>
                </div>
                <div className={style.breakLine} />  
      
                <div className={style.calculationLine}><div className={style.calculationLabel}>******** THANK YOU VISIT AGAIN *********</div></div>
                <div className={style.btnContainer} id="btn">
                    <button className={style.btn} onClick={e=>nav(-1)}>Cancel</button>
                    <button className={style.btn} onClick={e=>window.print()}>Print</button>
                </div>
            </div> : null}

            
        </div>
    )
}

export default Billing

// end of code