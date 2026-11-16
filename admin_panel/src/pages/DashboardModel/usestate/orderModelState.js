import { useState } from 'react';

export function useOrderModelState() {
  const [orderItem, setOrderItem] = useState([]);
  const [orderObject, setOrderobject] = useState({});
  const [unUpdatedOrderObj, setUnupdatedOrderObj] = useState(
        JSON.stringify({})
    );
  const [unUpdatedOrderItemObj, setUnupdatedOrderItemObj] = useState(
        JSON.stringify({})
    );
  const [inputEnable, setInputEnable] = useState("");
  const [tickedItems, setTickedItems] = useState([]);
  const [AddMoreItemmodalVisible, setAddMoreItemModalVisible] = useState(false);
  const [errorText, setErrorText] = useState({});
  const [isCancelClicked, setCancelClicked] = useState(false);
  const [cancelReason,setCancelReason]=useState("");
  return {
    orderItem,
    setOrderItem,
    orderObject,
    setOrderobject,
    unUpdatedOrderObj,
    setUnupdatedOrderObj,
    unUpdatedOrderItemObj,
    setUnupdatedOrderItemObj,
    inputEnable,
    setInputEnable,
    tickedItems,
    setTickedItems,
    AddMoreItemmodalVisible,
    setAddMoreItemModalVisible,
    errorText,
    setErrorText,
    isCancelClicked,
    setCancelClicked,
    cancelReason,
    setCancelReason,
  };
}
