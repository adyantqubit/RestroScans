import React, { useContext, useEffect, useState } from 'react'
import style from "../style/billing.module.css"
import { GlobalContext } from '../../../../context/Context'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from "react-router-dom";
import { getBillingDataAPI, extractBillDateTime, billSubtotal } from '../../services/billingService';
import { useBillingState } from "../../usestate/billingState";
import { hasFeature } from '../../../../plans'

const Billing = () => {
    const navigate = useNavigate();
    var customerDetail = secureLocalStorage.getItem('customer_details');

    const { colors, restaurant_name, rupee_sign, subscribePlan } = useContext(GlobalContext)
    var { billingData, setBillingData, isLoading, setLoading } = useBillingState();

    useEffect(() => {
        window.onpopstate = () => {
            navigate("/menu-item")
            secureLocalStorage.removeItem("order");
            secureLocalStorage.removeItem("orderItem");
            secureLocalStorage.removeItem("invoice_detail");
            secureLocalStorage.removeItem('setting_data');
        }
    }, [])

    useEffect(() => {
        getBillingData()
    }, [])

    const getBillingData = async () => {
        var tenantName = localStorage.getItem("tenantName")
        if (!customerDetail || !customerDetail.contact_number) {
            return
        }
        const data = {
            contact_number: customerDetail.contact_number,
        }
        const response = await getBillingDataAPI(data, tenantName);
        if (response && response.msg) {
            secureLocalStorage.setItem("orderItem", response.orderItem)
            secureLocalStorage.setItem("order", response.order)
            var responseData = {
                "items": secureLocalStorage.getItem("orderItem"),
                "detail": secureLocalStorage.getItem("order"),
                "customer_detail": secureLocalStorage.getItem('customer_details'),
                "restro_number": response.setting,
                "restro_detail": response.tenant
            }
            setBillingData(responseData)
        }
    }

    function ExtractDateTime(format) {
        return extractBillDateTime(format)
    }

    function SubtotalOfItems() {
        return billSubtotal(billingData.items)
    }

    return (
        <div style={{ background: colors.backgroundTheme, minHeight: "100vh", paddingBottom: "85px" }}>
            <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderBottom: `1px solid ${colors.subHeadingColor}`, background: colors.backgroundTheme }}>
                <button type="button" onClick={() => navigate("/menu-item", { replace: true })} style={{ background: colors.bannerColor, color: colors.backgroundTheme, border: "none", borderRadius: 7, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>
                    ← Back to Menu
                </button>
                <strong style={{ color: colors.headingColor, fontSize: 14, textAlign: "right" }}>{restaurant_name}</strong>
            </header>
            {billingData ? <div className={style.billingContainer} style={{ background: colors.backgroundTheme, border: `1px solid ${colors.subHeadingColor}` }}>
                <div className={style.inLineContainer} >
                    <div className={style.Hotellabel} style={{ textAlign: "center" }}>{restaurant_name.toUpperCase()}</div>
                </div>
                <div className={style.inLineContainer} style={{ textAlign: "center", margin: "0" }}>
                    <div className={style.centerLabel} style={{ padding: "0 10px" }}>{billingData.restro_detail.address}</div>
                </div>

                {billingData.restro_number.gstin?.length > 0 ? <div className={style.inLineContainer} style={{ textAlign: "center", margin: "3px 0" }}>
                    <div className={style.centerLabel}>GSTIN :{`  `}{billingData.restro_number.gstin}</div>
                </div> : null}

                {billingData.restro_number.fssaino?.length > 0 ? <div className={style.inLineContainer} style={{ textAlign: "center", margin: "3px 0" }}>
                    <div className={style.centerLabel}>FSSAI NO :{`  `}{billingData.restro_number.fssaino}</div>
                </div> : null}
                <div className={style.breakLine} />

                <div className={style.inLineContainer}>
                    <div className={style.column1} >
                        <div className={style.label1}>
                            <div style={{ width: "90%" }}>Name</div>
                            <div>:</div>
                        </div>
                        <div className={style.text}>
                            {billingData.detail.customer_name.length ? billingData.detail.customer_name : "---"}
                        </div>
                    </div>
                    <div className={style.column1}><div className={style.label}><div style={{ width: "90%" }}>Mob No.</div><div>:</div> </div><div className={style.text}>{billingData.customer_detail.contact_number}</div></div>
                </div>

                <div className={style.inLineContainer}>
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Date</div><div>:</div>  </div><div className={style.text}>{ExtractDateTime(billingData.detail.payment_confirmation_date_time).date}</div></div>

                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Time</div><div>:</div> </div><div className={style.text}>{ExtractDateTime(billingData.detail.payment_confirmation_date_time).time}</div></div>

                </div>

                <div className={style.inLineContainer}>
                    <div className={style.column1}><div className={style.label1}><div style={{ width: "90%" }}>Bill No.</div><div>:</div>  </div><div className={style.text}>{billingData.detail.order_id}</div></div>

                    <div className={style.column1}> <div className={style.label}><div style={{ width: "90%" }}>Table</div><div>:</div>   </div><div className={style.text}>{billingData.detail.table_number ? billingData.detail.table_number : 'N/A'}</div></div>

                </div>

                <div className={style.inLineContainer}>
                    <div className={style.column1}><div className={style.label}><div style={{ width: "90%" }}>Payment</div><div>:</div>  </div><div className={style.text}>{billingData.detail.payment_mode}</div></div>

                </div>
                <div className={style.tableHeader}>
                    <div className={style.titleHeading}>
                        Item Name
                    </div>
                    <div className={style.quantityHeading}>
                        Qty
                    </div>
                    <div className={style.rateHeading}>
                        Rate({rupee_sign})

                    </div>
                    <div className={style.totalHeading}>
                        Amount({rupee_sign})

                    </div>
                </div>
                {billingData.items.map(o =>
                    <>
                        {o.item_status == "Cancelled" ? null :
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
                        }
                    </>
                )}

                <div className={style.breakLine} />

                <div className={style.CalculationBoxContainer}>
                    <div className={style.calculationBox}>
                        {billingData.detail.discount_rupees > 0 ?
                            <>
                                <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Sub-Total</div><div>:</div> </div> <div className={style.calculationText}>{rupee_sign}{SubtotalOfItems().toFixed(2)}</div></div>
                                <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Discount</div><div>:</div> </div> <div className={style.calculationText}>{rupee_sign}{billingData.detail.discount_rupees.toFixed(2)}</div></div>

                                {billingData?.detail.loyality_point_price > 0 && billingData?.detail.loyality_point_price != null ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Loyality Price</div><div>:</div></div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.loyality_point_price).toFixed(2)}</div></div> : null}

                                {billingData?.detail.cgst > 0 || billingData?.detail.sgst > 0 ? (<div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Total</div><div>:</div> </div> <div className={style.calculationText}>{rupee_sign}{billingData.detail.total.toFixed(2)}</div></div>) : null}

                                {billingData?.detail.cgst > 0 ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>CGST</div><div>({Math.round(billingData.detail.cgst / billingData.detail.total * 100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.cgst).toFixed(2)}</div></div> : null}
                                {billingData?.detail.sgst > 0 ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>SGST</div><div>({Math.round(billingData.detail.sgst / billingData.detail.total * 100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.sgst).toFixed(2)}</div></div> : null}
                                <div className={style.breakLine} style={{ width: "98%" }} />
                                <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Grand Total</div><div>:</div></div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.final_amount).toFixed(2)}</div></div>
                            </>
                            :
                            <>
                                {billingData?.detail.cgst > 0 || billingData?.detail.sgst > 0 || billingData?.detail.loyality_point_price > 0 ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Sub-Total</div><div>:</div> </div> <div className={style.calculationText}>{rupee_sign}{SubtotalOfItems().toFixed(2)}</div></div> : null}

                                {billingData?.detail.loyality_point_price > 0 && billingData?.detail.loyality_point_price != null ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Loyality Price</div><div>:</div></div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.loyality_point_price).toFixed(2)}</div></div> : null}

                                {billingData?.detail.loyality_point_price > 0 && billingData?.detail.loyality_point_price != null ? <div className={style.breakLine} style={{ width: "98%", margin: '7px auto' }} /> : null}

                                {billingData?.detail.loyality_point_price > 0 || billingData.detail.discount_rupees > 0 ? (<div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Total</div><div>:</div> </div> <div className={style.calculationText}>{rupee_sign}{billingData.detail.total.toFixed(2)}</div></div>) : null}

                                {billingData?.detail.loyality_point_price > 0 && billingData?.detail.loyality_point_price != null ?
                                    <>
                                        {billingData?.detail.cgst > 0 ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>CGST</div><div>({Math.round(billingData.detail.cgst / billingData.detail.total * 100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.cgst).toFixed(2)}</div></div> : null}
                                        {billingData?.detail.sgst > 0 ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>SGST</div><div>({Math.round(billingData.detail.sgst / billingData.detail.total * 100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.sgst).toFixed(2)}</div></div> : null}
                                    </>
                                    : <>
                                        {billingData?.detail.cgst > 0 ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>CGST</div><div>({(billingData.detail.cgst / billingData.detail.sub_total * 100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.cgst).toFixed(2)}</div></div> : null}
                                        {billingData?.detail.sgst > 0 ? <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>SGST</div><div>({(billingData.detail.sgst / billingData.detail.sub_total * 100).toFixed(2)}%) :</div> </div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.sgst).toFixed(2)}</div></div> : null}
                                    </>}
                                {billingData?.detail.cgst > 0 || billingData?.detail.sgst > 0 ? <div className={style.breakLine} style={{ width: "98%" }} /> : null}
                                <div className={style.calculationLine}><div className={style.calculationLabel}><div style={{ width: "98%" }}>Grand Total</div><div>:</div></div> <div className={style.calculationText}>{rupee_sign}{(billingData.detail.final_amount).toFixed(2)}</div></div>
                            </>
                        }
                    </div>
                </div>

                <div className={style.breakLine} />
                <div className={style.TotalBoxContainer} >
                    <div className={style.TotalBox}>

                        <div className={style.calculationLine}><div className={style.TotalLabel}>Payable Amount :</div> <div className={style.TotalText}>{rupee_sign}{(billingData.detail.final_amount).toFixed(2)}</div></div>

                    </div>
                </div>
                <div className={style.breakLine} />
                <div className={style.calculationLine}><div className={style.calculationLabel}>******** THANK YOU VISIT AGAIN *********</div></div>

                {hasFeature(subscribePlan, "rating") ? <div className={style.rate_us_container}>
                    <div className={style.rate_us_btn_container}>
                        <button className={style.rate_us_button} style={{ background: colors.bannerColor, color: colors.backgroundTheme }} onClick={(e) => navigate("/rating-review")}>Rate us</button>
                    </div>
                </div> : null}
            </div> : null}
            <footer style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: colors.backgroundTheme, borderTop: `1px solid ${colors.subHeadingColor}`, display: "flex", justifyContent: "center", zIndex: 10 }}>
                <button type="button" onClick={() => navigate("/menu-item", { replace: true })} style={{ background: colors.bannerColor, color: colors.backgroundTheme, border: "none", borderRadius: 7, padding: "10px 28px", fontWeight: 700, cursor: "pointer" }}>
                    ← Back to Menu
                </button>
            </footer>
        </div>
    )
}

export default Billing
