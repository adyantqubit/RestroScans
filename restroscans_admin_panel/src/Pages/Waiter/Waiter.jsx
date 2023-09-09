import { useState } from "react";
import style from "./waiter.module.css";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import Search from "antd/es/input/Search";
import { BsSortAlphaDown, BsSortAlphaDownAlt } from "react-icons/bs";
import WaiterForm from "./WaiterForm";

const Waiter = () => {

    const [columnSortingOrder,setColumnSortingOrder]=useState(true)

    const [IsModalOpen,setModelVisiblity]=useState(false)

    return (<div className={style.container}>
        <WaiterForm IsModalOpen={IsModalOpen} setModelVisiblity={setModelVisiblity}/>
        <div className={`${style.pageTitleContainer}`}>
            <div className={style.pageTitle}>Menu List</div>
        </div>

        <div className={style.menuListSection}>
            <div className={style.tableContainer}>
                <div className={style.table}>
                    <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white",
                            padding: "4px",
                            width: "100%",
                        }}
                    >
                        <Search
                            placeholder="Search menu name"
                            allowClear
                            enterButton
                            className={style.searchBox}
                        />
                        <div className={`${style.primaryButton}`}
                             style={{ marginLeft: "10px", minWidth: "100px", textAlign: "center" }}
                             onClick={e=>setModelVisiblity(!IsModalOpen)}
                        >
                            Add Menu
                        </div>
                    </div>

                    <div className={style.tableHeadingContainer}>
                    <div className={style.commonColumnTitle}>
                            <span onClick={(e) => {
                                setColumnSortingOrder(!columnSortingOrder);
                            }}
                                style={{ wordBreak: "break-word" }}>Name{" "}</span>
                            <span onClick={(e) => {
                                setColumnSortingOrder(!columnSortingOrder)
                            }}>
                                {columnSortingOrder?
                                        <BsSortAlphaDown className={style.sortingIcon} />
                                :
                                        <BsSortAlphaDownAlt className={style.sortingIcon} />
                                }
                            </span>
                        </div>
                        <div className={style.commonColumnTitle}>Contact Number </div>
                        <div className={style.commonColumnTitle} >
                            <span  style={{ wordBreak: "break-word" }}>Password</span>
                        </div>
                        <div className={style.commonColumnTitle}> Action </div>
                    </div>
                   

                    <div className={style.tableDataContainer}
                        style={{
                            backgroundColor: "#efefef",
                        }}
                    
                    //     onClick={hideDropdown}
                    //     onTouchStart={hideDropdown}
                    
                    >
                        {true ? (
                            [""].map((menuDetails, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={style.tableData}
                                        style={{
                                            padding: "2px",
                                            marginTop: "2px",
                                            // marginBottom:
                                                // menuList.length == index + 1 ? "2px" : "0px",
                                        }}
                                    >
                                        <div className={style.commonColumnData}>
                                            6264170187
                                        </div>
                                        <div className={style.commonColumnData} style={{ wordBreak: "break-word" }}>
                                            Rohan Kumar Kansari
                                        </div>

                                        {true? (
                                            <div className={style.commonColumnData}>
                                                <MdCheckCircle className={style.yesIcon} />
                                            </div>
                                        ) : (
                                            <div className={style.commonColumnData}>
                                                <MdCancel className={style.noIcon} />
                                            </div>
                                        )}

                                        <div className={`${style.commonColumnData}`}
                                            style={{ display: "flex", justifyContent: "center" }}>
                                            <div className={` ${style.primaryButton}`} onClick={e=>setModelVisiblity(!IsModalOpen)}>
                                                View
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ textAlign: "center" }}>No records found!</div>
                        )}
                    </div>
                </div>
            </div>
        </div>


    </div>)
}

export default Waiter