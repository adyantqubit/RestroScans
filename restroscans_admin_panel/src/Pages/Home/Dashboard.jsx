import React from 'react'
import style from "./dashboard.module.css"
import TodayOrder from './components/TodayOrder'
import Header from '../GlobalComponent/Header'
import CurrentDateNTime from './components/CurrentDateNTime'

const Dashboard = () => {
  return (
    <Header>
      <div className={style.Container}>
        <CurrentDateNTime />
        <TodayOrder />
      </div>
    </Header>
  )
}

export default Dashboard