import React, { useEffect } from 'react'
import style from "./waiterDashboard.module.css"
import { enableHeader } from '../../App'

const WaiterDashboard = () => {
    useEffect(()=>{
    enableHeader()
    },[])
  return (
    <div className={style.container}>WaiterDashboard</div>
  )
}

export default WaiterDashboard