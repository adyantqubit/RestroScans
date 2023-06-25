import React, { useEffect, useState } from 'react'
import style from "./orderItem.module.css"
import Header from '../GlobalComponent/Header'
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { AiFillCalendar, AiOutlineCalendar, AiOutlineClose, AiOutlineSortAscending } from 'react-icons/ai';
import {BsSortNumericDownAlt} from 'react-icons/bs'
import "./checkbox.scss"
import { OrderItemFilterQueryAPI } from '../../Api/services';
import { enableHeader } from '../../App';

const OrderItemReport = () => {
    const [value, onChange] = useState("");
    var [itemNameIsSort, setItemNameSort] = useState(false)
    var [orderCountIsSort, setOrderCountSort] = useState(false)
    var [ratingIsSort, setRatingSort] = useState(false)
    var [cancellationIsSort, setCancellationSort] = useState(false)

    var [reportOrderItem, setReportOrderItem] = useState(null)


    useEffect(() => {
        // Added By Rohan Kansari - 25/6/23
        // Reason - To enable headerSiderbar
        enableHeader()
        // End of code - Rohan kansari - 25/6/23
        postQuery()
    }, [])

    async function postQuery() {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const data = {
            search: value,
            itemSort: itemNameIsSort,
            orderSort: orderCountIsSort,
            ratingSort: ratingIsSort,
            cancellationSort: cancellationIsSort
        }
        await OrderItemFilterQueryAPI(tenant, data).then(r => setReportOrderItem(r.item))
    }    

    function cancellationSelect(value){
        if (value){
            itemNameIsSort=false
            orderCountIsSort=false
            ratingIsSort=false
            cancellationIsSort=true
            setItemNameSort(false)
            setOrderCountSort(false)
            setRatingSort(false)
            setCancellationSort(true)
        }else{
            itemNameIsSort=false
            orderCountIsSort=false
            ratingIsSort=false
            cancellationIsSort=false
            setItemNameSort(false)
            setOrderCountSort(false)
            setRatingSort(false)
            setCancellationSort(false)
        }
        postQuery()

    }

    function ratingSelect(value){
        if (value){
            itemNameIsSort=false
            orderCountIsSort=false
            ratingIsSort=true
            cancellationIsSort=false
            setItemNameSort(false)
            setOrderCountSort(false)
            setRatingSort(true)
            setCancellationSort(false)
        }else{
            itemNameIsSort=false
            orderCountIsSort=false
            ratingIsSort=false
            cancellationIsSort=false
            setItemNameSort(false)
            setOrderCountSort(false)
            setRatingSort(false)
            setCancellationSort(false)
        }
        postQuery()

    }

    function orderCountSelect(value){
        if (value){
            itemNameIsSort=false
            orderCountIsSort=true
            ratingIsSort=false
            cancellationIsSort=false
            setItemNameSort(false)
            setOrderCountSort(true)
            setRatingSort(false)
            setCancellationSort(false)
        }else{
            itemNameIsSort=false
            orderCountIsSort=false
            ratingIsSort=false
            cancellationIsSort=false
            setItemNameSort(false)
            setOrderCountSort(false)
            setRatingSort(false)
            setCancellationSort(false)
        }
        postQuery()

    }

    function itemSelect(value){
        if (value){
            itemNameIsSort=true
            orderCountIsSort=false
            ratingIsSort=false
            cancellationIsSort=false

            setItemNameSort(true)
            setOrderCountSort(false)
            setRatingSort(false)
            setCancellationSort(false)
        }else{
            itemNameIsSort=false
            orderCountIsSort=false
            ratingIsSort=false
            cancellationIsSort=false

            setItemNameSort(false)
            setOrderCountSort(false)
            setRatingSort(false)
            setCancellationSort(false)
        }
        postQuery()

    }


    return (
     // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
        // <Header>
            <div className={style.orderContainer}>
                <div className={style.filterContainer}>
                    {/*Filter 1  */}
                    <div className={style.statusContainer}>
                        <div className={style.label}>Search By Item Name</div>
                        <div className={style.selctedContentBox}>
                            <input className={style.searchInput} type="text" onChange={e => onChange(e.target.value)} />
                        </div>
                    </div>

                    <div className={style.BtnContainer}>
                        <button className={style.GenerateBtn} onClick={postQuery}>Generate Report</button>
                    </div>
                </div>


                <div className={style.tabelContainer}>
                    <div className={style.container} >
                        <div className={style.TabelContainer}>

                            <div className={style.table}>
                                <div className={style.tableHeading}>
                                    <div className={style.column1}>Sno</div>
                                    <div className={style.column2}><input type="checkbox" id="itemName" style={{display:"none"}} name='itemName' checked={itemNameIsSort} onChange={e =>itemSelect(e.target.checked)} /> <label className={style.sortingLabel} htmlFor='itemName'><AiOutlineSortAscending className={style.SortIcon}/> Item Name </label></div>
                                    <div className={style.column3}> <input type="checkbox" id="orderCount" style={{display:"none"}} name="orderCount" checked={orderCountIsSort}  onChange={e =>orderCountSelect(e.target.checked)} /> <label className={style.sortingLabel} htmlFor='orderCount'> <BsSortNumericDownAlt className={style.SortIcon}/> Order Count</label></div>
                                    <div className={style.column4}><input type="checkbox" id="rating" style={{display:"none"}} name="rating" checked={ratingIsSort} onChange={e =>ratingSelect(e.target.checked)} /><label className={style.sortingLabel} htmlFor='rating'> <BsSortNumericDownAlt className={style.SortIcon}/> Rating</label></div>
                                    <div className={style.column5}>Price</div>
                                    {/* <div className={style.column5}>Discount</div> */}
                                    <div className={style.column6}><input type="checkbox" id="cancellation" style={{display:"none"}} name="cancellation" checked={cancellationIsSort} onChange={e =>cancellationSelect(e.target.checked)} /><label className={style.sortingLabel} htmlFor='cancellation'> <BsSortNumericDownAlt className={style.SortIcon}/>Cancellation Count</label></div>
                                    {/* <div className={style.column7}>Last Review</div> */}
                                </div>


                                {reportOrderItem?.map((m, i) =>
                                    <div className={style.row} >
                                        <div className={style.columnData1}>{i+1}</div>
                                        <div className={style.columnData2}>{m.item}({m.serving_size})</div>
                                        <div className={style.columnData3}>{m.item_count}</div>
                                        <div className={style.columnData4}>{m.average_rating?m.average_rating:" - "}</div>
                                        <div className={style.columnData5}>{m.sum_price}</div>
                                        {/* <div className={style.columnData5}>30</div> */}
                                        <div className={style.columnData6}>{m.cancellation_count}</div>
                                        {/* <div className={style.columnData7}>
                                            <button className={style.printBtn} >Late Service! Disappointed</button>
                                        </div> */}
                                    </div>
                                )}

                                {/* <div className={style.row}>
                                    <div className={style.EmptyText}> No order created yet !</div>
                                </div> */}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        // </Header>
    )
}

export default OrderItemReport