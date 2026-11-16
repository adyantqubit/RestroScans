import React, { useEffect } from 'react'
import { explainFailure } from '../../../../http/http_client'
import { Modal } from "../../../../ui"
import style from "../style/waiterForm.module.css"
import { saveWaiter, waiterFieldError } from '../../services/waiterService'
import { useApp } from '../../../../Context/AppContext'
import { useWaiterFormState } from "../../usestate/waiterFormState";

const WaiterForm = ({ IsModalOpen, setModelVisiblity, setSelectedWaiter, selectedWaiter, setWaiterList, waiterList, inline = false, onSaved }) => {
    const { Message } = useApp();

    var {
    errortext,
    setErrorText,
    formData,
    setFormData,
  } = useWaiterFormState();

    useEffect(() => {
        if (selectedWaiter?.id) {
            setFormData({ ...selectedWaiter, password_key: true, reset_password: "" })
        }
        else {
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

        const payload = { ...formData }
        delete payload.password_key
        delete payload.reset_password
        // An empty password on edit keeps the current one.
        if (formData.password_key)
            payload.password = formData.reset_password || ""

        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;

        if (Object.keys(errortext).length == 0)
            await saveWaiter(tenant, payload).then(r => {
                if (r.data) {
                    if (onSaved) {
                        onSaved();
                    } else if (setWaiterList && waiterList) {
                        if (formData.id) {
                            setWaiterList(waiterList.map(e => (e.id == r.data.id ? r.data : e)))
                        } else {
                            setWaiterList([r.data, ...waiterList])
                        }
                    }
                    resetForm()
                    if (!inline && setModelVisiblity) setModelVisiblity(false);
                }
                else {
                    Message(explainFailure(r, "The waiter was not saved."), "error")
                }
            })
    }

    function resetForm() {
        document.getElementById("form")?.reset()
        setFormData(
            {
                ...{
                    "id": null,
                    "name": "",
                    "contact_number": "",
                    "password": "",
                    "is_active": true,
                }
            }
        )

        setErrorText({})
    }

    function validate(field, value) {
        waiterFieldError(errortext, field, value)
        setErrorText({ ...errortext })
    }

    const fields = (
            <form className={style.container} id="form" style={{ minHeight: inline ? 0 : (formData.password_key ? "35vh" : "30vh") }}>
                <div className={style.inputContainer}>
                    <div className={style.label}>Name <span className={style.astrik}>*</span></div>
                    <div className={style.inputContains}>
                        <input type='text' className={style.inputField}
                            value={formData.name || ""}
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
                            value={formData.contact_number || ""}
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
                               ********
                            </div>
                        </div>
                        <div className={style.inputContainer}>
                            <div className={style.label}>Reset password <span className="opt" /></div>
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
                            checked={formData.is_active}
                            onChange={e => { formData.is_active = e.target.checked; setFormData({ ...formData }) }}
                        />
                    </div>
                </div>
                {inline ? (
                    <div className={style.inputContainer}>
                        <button type="button" onClick={postWaiterData}>Save</button>
                    </div>
                ) : null}
            </form>
    );

    if (inline) return fields;

    return (
        <Modal
            onCancel={e => { setModelVisiblity(!IsModalOpen); setSelectedWaiter(null); resetForm(); }}
            onOk={e => { postWaiterData() }}
            open={IsModalOpen}
        >
            {fields}
        </Modal>
    )
}

export default WaiterForm
