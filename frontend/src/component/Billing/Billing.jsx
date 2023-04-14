// created by rohan -13/4/23
// reason- this the bill pgae ui

import React, { useContext } from 'react'
import style from "./billing.module.css"
import { GlobalContext } from '../../context/Context'

const Billing = () => {
    const { colors } = useContext(GlobalContext)
    return (
        <div className={style.billingContainer} style={{ background: colors.backgroundTheme, border: `1px solid ${colors.subHeadingColor}` }}>
            <div className={style.inLineContainer} >
                <div className={style.Hotellabel} style={{textAlign:"center"}}>DADI'S PAAKSHALA</div>
            </div>
            <div className={style.inLineContainer} style={{textAlign:"center"}}>
                <div className={style.centerLabel}>FIRST FLOOR ,ABOVE BICYCLE HUB OPPOSITE SURYAHAIR APARTMENT PACHPEDI NAKA ROAD ,Raipur ,CHHATTISGARH - 492001</div>
            </div>
            <div className={style.inLineContainer} style={{textAlign:"center"}}>
                <div className={style.centerLabel}>GSTIN :-{`  `}22AAPFD0210N1ZP</div>
            </div>
            <div className={style.inLineContainer} style={{textAlign:"center"}}>
                <div className={style.centerLabel}>FSSAI NO :-{`  `}10518016001001</div>
            </div>
            <div className={style.breakLine} />
            <div className={style.inLineContainer}>
                <div className={style.label}>Date : </div><div className={style.text}>09/04/2023</div>
                <div className={style.label}>Time : </div><div className={style.text}>4:30pm</div>
            </div>
            <div className={style.inLineContainer}>
                <div className={style.label}>Bill : </div><div className={style.text}>B156703</div>
                <div className={style.label}>Table : </div><div className={style.text}>N/A</div>
            </div>
            <div className={style.inLineContainer}>
                <div className={style.label}>Pax : </div><div className={style.text}>0</div>
                <div className={style.label}>Sess : </div><div className={style.text}>1</div>
            </div>
            <div className={style.inLineContainer}>
                <div className={style.label}>Dshr : </div><div className={style.text}>Cashier</div>
                <div className={style.label}>Capt : </div><div className={style.text}>N/A</div>
            </div>
            <div className={style.inLineContainer}>
                <div className={style.label}>Payment : </div><div className={style.text}>Online</div>
                <div className={style.label}>Status : </div><div className={style.text}>Paid</div>
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
            <div className={style.tableContents}>
                <div className={style.titleText}>
                    Chicken butter tikka masala (Full Plate)
                </div>
                <div className={style.quantityText}>
                    2
                </div>
                <div className={style.rateText}>
                    ₹ 750
                </div>
                <div className={style.totalText}>
                    ₹ 1500
                </div>
            </div>
            <div className={style.tableContents}>
                <div className={style.titleText}>
                    Butter Tandoori Naan (Half Plate)
                </div>
                <div className={style.quantityText}>
                    5
                </div>
                <div className={style.rateText}>
                    ₹ 750
                </div>
                <div className={style.totalText}>
                    ₹ 1500
                </div>
            </div>
            <div className={style.tableContents}>
                <div className={style.titleText}>
                    masala papad (Full Plate)
                </div>
                <div className={style.quantityText}>
                    2
                </div>
                <div className={style.rateText}>
                    ₹ 75
                </div>
                <div className={style.totalText}>
                    ₹ 150
                </div>
            </div>
            <div className={style.tableContents}>
                <div className={style.titleText}>
                    Boondi Rayata (Half Plate)
                </div>
                <div className={style.quantityText}>
                    1
                </div>
                <div className={style.rateText}>
                    ₹ 80
                </div>
                <div className={style.totalText}>
                    ₹ 80
                </div>
            </div>

            <div className={style.breakLine} />

            <div className={style.CalculationBoxContainer}>
                <div className={style.calculationBox}>
                    <div className={style.calculationLine}><div className={style.calculationLabel}>Sub-Total :</div> <div className={style.calculationText}>₹ 6000</div></div>
                    <div className={style.calculationLine}><div className={style.calculationLabel}>CGST (%2.5) :</div> <div className={style.calculationText}>₹ 800.01</div></div>
                    <div className={style.breakLine} />
                    <div className={style.calculationLine}><div className={style.calculationLabel}>Total :</div> <div className={style.calculationText}>₹ 6800</div></div>
                </div>
            </div>

            <div className={style.breakLine} />
            <div className={style.TotalBoxContainer} >
                <div className={style.TotalBox}>
                    <div className={style.calculationLine}><div className={style.TotalLabel}>Total :</div> <div className={style.TotalText}>₹ 6800</div></div>
                </div>
            </div>
            <div className={style.breakLine} />

            <div className={style.calculationLine}><div className={style.calculationLabel}>****** THANK YOU VISIT AGAIN ******</div></div>


        </div>
    )
}

export default Billing

// end of code