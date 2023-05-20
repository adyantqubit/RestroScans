import React from 'react'
import style from "./dashboard.module.css"
import TodayOrder from './components/TodayOrder'
import Header from '../GlobalComponent/Header'
import CurrentDateNTime from './components/CurrentDateNTime'

const Dashboard = () => {
  return (
    <Header>
      <div className={style.Container}>
        {/* Removed by Rohan KAnsari - 26/5/23
             Reason - Not needed yet */}
        {/* <CurrentDateNTime /> */}
        {/* End of code - 26/5/23 */}
        <TodayOrder />
      </div>
    </Header>
  )
}

export default Dashboard