import React, { useEffect } from 'react'
import style from "./dashboard.module.css"
import TodayOrder from './components/TodayOrder'
import Header from '../GlobalComponent/Header'
import CurrentDateNTime from './components/CurrentDateNTime'
import { enableHeader } from '../../App'

const Dashboard = () => {
  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader()   
    // End of code - Rohan kansari - 25/6/23
  }, [])
  return (
   // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.Container}>
      {/* Removed by Rohan KAnsari - 26/5/23
             Reason - Not needed yet */}
      {/* <CurrentDateNTime /> */}
      {/* End of code - 26/5/23 */}
      <TodayOrder />
    </div>
    // </Header> 
  )
}

export default Dashboard