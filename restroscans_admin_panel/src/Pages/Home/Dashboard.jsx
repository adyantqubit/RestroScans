import React, { useState, useEffect } from 'react'
import style from "./dashboard.module.css"
import TodayOrder from './components/TodayOrder'
import Header from '../GlobalComponent/Header'
import { enableHeader } from '../../App'
import OrderCreation from './components/OrderCreation'

const Dashboard = () => {
  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()
    // End of code - Rohan kansari - 25/6/23
  }, [])


  const [IsOrderPopupVisible, setOrderPopupvisible] = useState(false)

  const [recall, setRecall] = useState([]);


  return (
    // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.Container}>
      {/* Removed by Rohan KAnsari - 26/5/23
             Reason - Not needed yet */}
      {/* <CurrentDateNTime /> */}
      {/* End of code - 26/5/23 */}


      {/* Added by Rohan kansari - 9/8/23
          Reason - Order creation button  */}
      <div className={style.ordCreateContainer}>
        <button className={style.orderCreateBtn} onClick={e => {
          setOrderPopupvisible(true)
        }}>
        Create Order 
        </button>
      </div>

      <OrderCreation recall={recall} setRecall={setRecall} IsOrderPopupVisible={IsOrderPopupVisible} setOrderPopupvisible={setOrderPopupvisible} />
      <TodayOrder recall={recall} />

      {/* End  of code - Rohan kansari - 9/8/23 */}
    </div>
    // </Header> 
  )
}

export default Dashboard