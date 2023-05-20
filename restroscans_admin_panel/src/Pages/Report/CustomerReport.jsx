import React from 'react'
import style from "./customerReport.module.css"
import Header from '../GlobalComponent/Header'

const CustomerReport = () => {
  return (
    <Header>
            <div className={style.customerContainer}>
                <div className={style.filterContainer}>
                   
                </div>

                <div className={style.tabelContainer}>

                </div>
            </div>
        </Header>
  )
}

export default CustomerReport