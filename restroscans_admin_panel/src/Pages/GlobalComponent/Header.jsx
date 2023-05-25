import React from 'react'
import style from "./header.module.css"
import Sidebar from './Sidebar'

const Header = (props) => {
  return (
    <>
    <div className={style.container}>Header</div>
    <div className={style.contentAndSideBar}>
    <Sidebar/>
    {props.children}
    </div>
    
    </>
  )
}

export default Header