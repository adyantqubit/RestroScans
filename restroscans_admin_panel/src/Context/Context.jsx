import { useState } from 'react'
import { React, createContext, useContext } from 'react'
import { useEffect } from 'react'

export const GlobalContext = createContext();

export default function Context(props) {

    var [showOfferForm,setShowOfferForm] = useState(false)
    var [disabled, setDisabled] = useState(false);
    //  Addition by Om Shrivastava on 22-09-23
    //  Reason : Set the disable property of the offer form 
    var [showOfferItemForm,setShowOfferItemForm] = useState(false)
    var [disabledItemForm, setDisabledItemForm] = useState(false);
    //  End of addition by Om Shrivastava on 22-09-23
    //  Reason : Set the disable property of the offer form  

    return (
        <>
            <GlobalContext.Provider value={{
                showOfferForm,
                setShowOfferForm,
                disabled, setDisabled,
//  Addition by Om Shrivastava on 22-09-23
    //  Reason : Set the disable property of the offer form 
                showOfferItemForm,setShowOfferItemForm,
                disabledItemForm, setDisabledItemForm
                //  End of addition by Om Shrivastava on 22-09-23
    //  Reason : Set the disable property of the offer form  

               
            }}>
                {props.children}
            </GlobalContext.Provider>
        </>
    )
}