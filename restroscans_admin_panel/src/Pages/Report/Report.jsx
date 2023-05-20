import React from 'react'
import Header from '../GlobalComponent/Header'
import style from "./report.module.css"

const Report = () => {
    return (
        <Header>
            <div className={style.report}>
            <div className={style.tabContainer}>
                <div className={style.card}></div>
                <div className={style.card}></div>
                <div className={style.card}></div>
            </div>

            <div className={style.filterContainer}></div>

            <div className={style.tabelContainer}>

            </div>

            </div>
        </Header>
    )
}

export default Report