import { React, createContext, useContext } from 'react'
import { useEffect } from 'react'
import { useContextState } from "./usestate/contextState";

export const GlobalContext = createContext();

export default function Context(props) {
    var {
    showOfferForm,
    setShowOfferForm,
    disabled,
    setDisabled,
    showOfferItemForm,
    setShowOfferItemForm,
    disabledItemForm,
    setDisabledItemForm,
  } = useContextState();

    return (
        <>
            <GlobalContext.Provider value={{
                showOfferForm,
                setShowOfferForm,
                disabled, setDisabled,
                showOfferItemForm,setShowOfferItemForm,
                disabledItemForm, setDisabledItemForm
            }}>
                {props.children}
            </GlobalContext.Provider>
        </>
    )
}
