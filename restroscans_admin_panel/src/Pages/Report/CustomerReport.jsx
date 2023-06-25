import React, { useEffect } from 'react'
import style from "./customerReport.module.css"
import Header from '../GlobalComponent/Header'
import { enableHeader } from '../../App'

const CustomerReport = () => {
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
    <div className={style.customerContainer}>
      <div className={style.filterContainer}>

      </div>

      <div className={style.tabelContainer}>

      </div>
    </div>
    // </Header>
  )
}

export default CustomerReport