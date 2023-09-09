import React, { useState } from 'react'
import { Modal } from "antd"
import style from "./waiterForm.module.css"
const WaiterForm = ({IsModalOpen,setModelVisiblity}) => {

    const [errortext,setErrorText]=useState({})

    
    console.log(Object.keys(errortext))

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
    return (
        < Modal
            onCancel={e=>setModelVisiblity(!IsModalOpen)}
            onOk={e=>setModelVisiblity(!IsModalOpen)}
            open={IsModalOpen}>
            <div className={style.container}>
                <div className={style.inputContainer}>
                    <div className={style.label}>Name</div>
                    <div className={style.inputContains}>
                    <input type='text' className={style.inputField} onChange={e=> {if(e.target.value.length>0)errortext["nameError"]=e.target.value; else delete errortext["nameError"]; setErrorText({...errortext})}}/>
                        {errortext.nameError?<span className={style.errorText}>This field should not be blank.</span> :null}
                    </div>
                </div>
                <div className={style.inputContainer}>
                    <div className={style.label}>Contact Number</div>
                    <div className={style.inputContains}>
                    <input type='number' className={style.inputField} onChange={e=> {if(e.target.value.length>0)errortext["numberError"]=e.target.value; else delete errortext["numberError"]; setErrorText({...errortext})}}/>
                        {errortext.numberError?<span className={style.errorText}>This field should not be blank.</span> :null}
                    </div>
                </div>
                <div className={style.inputContainer}>
                    <div className={style.label}>Password</div>
                    <div className={style.EncryptPassword}>
                        {makeid(12)}**********
                    </div>
                </div>
                <div className={style.inputContainer}>
                    <div className={style.label}>Reset Password</div>
                    <div className={style.inputContains}>
                        <input type='text' className={style.inputField} onChange={e=> {if(e.target.value.length>0)errortext["passError"]=e.target.value; else delete errortext["passError"]; setErrorText({...errortext})}}/>
                        {errortext.passError?<span className={style.errorText}>This field should not be blank.</span> :null}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default WaiterForm