import React, { useEffect, useState } from 'react'
import { Modal } from "antd"
import style from "./waiterForm.module.css"
import { postWaiterListApi } from '../../Api/services'
import { Message } from '../../App'

const WaiterForm = ({ IsModalOpen, setModelVisiblity, selectedWaiter, setWaiterList, waiterList }) => {

    const [errortext, setErrorText] = useState({})

    var [formData, setFormData] = useState({
        "id": null,
        "name": null,
        "contact_number": null,
        "password": null,
        "is_active": null,
    })

    useEffect(() => {
        if (selectedWaiter?.id) {
            selectedWaiter["password_key"] = selectedWaiter["password"]
            selectedWaiter["reset_password"] = ""
            setFormData({ ...selectedWaiter })
            console.log("true run")
        }
        else {
            console.log("false run")
            resetForm()
        }
    }, [selectedWaiter])


    async function postWaiterData() {

        validate("name", formData.name)
        validate("contact_number", formData.contact_number)
        if (formData.password_key)
            validate("reset_password", formData.reset_password)
        else
            validate("password", formData.password)

        if (formData.password_key && formData.reset_password?.length)
            formData.password = formData.reset_password

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

        if (Object.keys(errortext).length == 0)
            await postWaiterListApi(tenant, formData).then(r => {
                if (r.data) {
                    if (formData.id) {
                        waiterList = waiterList.filter(e => e.id != r.data.id)
                        setWaiterList([r.data, ...waiterList])
                    } else {
                        setWaiterList([r.data, ...waiterList])
                    }
                    resetForm()
                    setModelVisiblity(!IsModalOpen);
                }
                else {
                    var keys = Object.keys(r.error);
                    Message(r.error[keys[0]][0], "error")
                }

            })
    }


    function resetForm() {
        document.getElementById("form")?.reset()
        setFormData(
            {
                ...{
                    "id": null,
                    "name": null,
                    "contact_number": null,
                    "password": null,
                    "is_active": null,
                }
            }
        )

        setErrorText({})
    }

    function validate(field, value) {
        if (field === "name") {
            if (value.length == 0) {
                errortext["nameError"] = "Name should not be blank"
            }
            else if (value.length < 2) {
                errortext["nameError"] = "Name should not be less than 2 characters"
            }
            else {
                delete errortext["nameError"]
            }
        }

        if (field === "contact_number") {
            if (value.length == 0) {
                errortext["numberError"] = "Number should not be blank"
            }
            else if (value.length < 10) {
                errortext["numberError"] = "Number should not be less than 10 digits"
            }
            else if (value.length > 10) {
                errortext["numberError"] = "Number should not be more than 10 digits"
            }
            else {
                delete errortext["numberError"]
            }
        }

        if (field == "reset_password") {

            if (value.length > 0 && value.length < 5)
                errortext["passError"] = "Password should not be less than 5 characters"
            else {
                delete errortext["passError"]
            }
        }

        if (field == "password") {
            if (value.length == 0)
                errortext["passError"] = "Password should not be blank"
            else if (value.length < 5)
                errortext["passError"] = "Password should not be less than 5 characters"
            else {
                delete errortext["passError"]
            }
        }

        setErrorText({ ...errortext })
    }


   return (
        < Modal
            onCancel={e => { setModelVisiblity(!IsModalOpen); }}
            onOk={e => { postWaiterData() }}
            open={IsModalOpen}
        >

            <form className={style.container} id="form" style={{ minHeight: formData.password_key ? "35vh" : "30vh" }}>
                <div className={style.inputContainer}>
                    <div className={style.label}>Name <span className={style.astrik}>*</span></div>
                    <div className={style.inputContains}>
                        <input type='text' className={style.inputField}
                            value={formData.name ? formData.name : null}
                            onChange={e => { formData.name = e.target.value; setFormData({ ...formData }); validate("name", e.target.value) }}
                            onPaste={e => { formData.name = e.target.value; setFormData({ ...formData }); validate("name", e.target.value) }}
                            onCut={e => { formData.name = e.target.value; setFormData({ ...formData }); validate("name", e.target.value) }}
                        />
                        {errortext.nameError ? <span className={style.errorText}>{errortext.nameError}</span> : null}
                    </div>
                </div>
                <div className={style.inputContainer}>
                    <div className={style.label}>Contact Number <span className={style.astrik}>*</span></div>
                    <div className={style.inputContains}>
                        <input type='number' className={style.inputField}
                            value={formData.contact_number ? formData.contact_number : null}
                            onChange={e => { formData.contact_number = e.target.value; setFormData({ ...formData }); validate("contact_number", e.target.value) }}
                            onPaste={e => { formData.contact_number = e.target.value; setFormData({ ...formData }); validate("contact_number", e.target.value) }}
                            onCut={e => { formData.contact_number = e.target.value; setFormData({ ...formData }); validate("contact_number", e.target.value) }}
                        />
                        {errortext.numberError ? <span className={style.errorText}>{errortext.numberError}</span> : null}
                    </div>
                </div>

                {formData.password_key ?
                    <>
                        <div className={style.inputContainer}>
                            <div className={style.label}>Password</div>
                            <div className={style.EncryptPassword}>
                               ********** {formData.password_key ? formData.password_key.substring(formData.password_key.length-12,formData.password_key.length) : null}
                            </div>
                        </div>
                        <div className={style.inputContainer}>
                            <div className={style.label}>Reset Password</div>
                            <div className={style.inputContains}>
                                <input type='text' className={style.inputField}
                                    onChange={e => { formData["reset_password"] = e.target.value; setFormData({ ...formData }); validate("reset_password", e.target.value) }}
                                    onPaste={e => { formData["reset_password"] = e.target.value; setFormData({ ...formData }); validate("reset_password", e.target.value) }}
                                    onCut={e => { formData["reset_password"] = e.target.value; setFormData({ ...formData }); validate("reset_password", e.target.value) }}
                                />
                                {errortext.passError ? <span className={style.errorText}>{errortext.passError}</span> : null}
                            </div>
                        </div>
                    </>
                    :
                    <div className={style.inputContainer}>
                        <div className={style.label}>Password <span className={style.astrik}>*</span></div>
                        <div className={style.inputContains}>
                            <input type='text' className={style.inputField}
                                onChange={e => { formData.password = e.target.value; setFormData({ ...formData }); validate("password", e.target.value) }}
                                onPaste={e => { formData.password = e.target.value; setFormData({ ...formData }); validate("password", e.target.value) }}
                                onCut={e => { formData.password = e.target.value; setFormData({ ...formData }); validate("password", e.target.value) }}
                            />
                            {errortext.passError ? <span className={style.errorText}>{errortext.passError}</span> : null}
                        </div>
                    </div>
                }
                <div className={style.inputContainer}>
                    <div className={style.label}>Active</div>
                    <div className={style.inputContains}>
                        <input type='checkbox' className={style.checkboxField}
                            checked={formData.is_active ? formData.is_active : null}
                            onChange={e => { formData.is_active = e.target.checked; setFormData({ ...formData }) }}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default WaiterForm