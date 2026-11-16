// import React, { useEffect } from "react";
// import style from "../style/restaurantratingreview.module.css";
// import Header from "../../../../components/Header/Header";
// import { loadRatingCount, loadRatings } from "../../services/restaurantRatingReviewService";
// import {
//     BsSortAlphaDownAlt,
//     BsSortAlphaDown,
//     BsSortNumericDownAlt,
//     BsSortNumericDown,
// } from "react-icons/bs";

// import { useApp } from "../../../../Context/AppContext";
// import ReactReadMoreReadLess from "react-read-more-read-less";
// import { useRatingReviewState } from "../../usestate/ratingReviewState";
// import {
//     StarFilled,
//   } from '@ant-design/icons';
// import RecordPage from "../../../../components/RecordPage/RecordPage";
// const RatingReview = () => {
//     const { enableHeader } = useApp();
//     var {
//     backenRatingReviewCount,
//     setBackendRatingReviewCount,
//     ratingReviewList,
//     setRatingReviewList,
//     listPerPage,
//     setListPerPage,
//     columnToSort,
//     setColumnToSort,
//     columnSortingOrder,
//     setColumnSortingOrder,
//     showSortingIcon,
//     setShowSortingIcon,
//     currentPage,
//     setCurrentPage,
//     searchText,
//     setSearchText,
//   } = useRatingReviewState();

//     useEffect(() => {
//         enableHeader()
//         if (localStorage.getItem("globalPageIndex")) {
//             currentPage = parseInt(localStorage.getItem("globalPageIndex"))
//             setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
//         }

//         getCountOfCutomers();
//         getListOfRatingReview();
//     }, []);

//     useEffect(() => {
//         getListOfRatingReview();
//     }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);

//     const getCountOfCutomers = async () => {
//         const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
//         const response = await loadRatingCount(tenant);
//         setBackendRatingReviewCount(response.ratingCount);
//     };

//     const getListOfRatingReview = async () => {
//         const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
//         const paginationDetails = {
//             currentPage: currentPage,
//             listPerPage: listPerPage,
//         };
//         const filteringCriteria = {
//             paginationDetails: paginationDetails,
//             columnToSort: columnToSort,
//             columnSortingOrder: columnSortingOrder,
//             searchText: searchText.trim(),
//         };
//         const response = await loadRatings(tenant, filteringCriteria);
//         setRatingReviewList(response.ratingReviewList);
//         setBackendRatingReviewCount(response.ratingReviewListCount)
//     };

//     const handlePageChange = async (pageNumber) => {
//         localStorage.setItem("globalPageIndex", pageNumber)
//         setCurrentPage(pageNumber);
//     };

//     const sortratingReviewList = (columnName) => {
//         if (columnToSort == columnName) {
//             if (columnSortingOrder == "ascending") {
//                 setColumnSortingOrder("descending");
//             } else {
//                 setColumnSortingOrder("ascending");
//             }
//         }
//         setColumnToSort(columnName);
//     };

//     function hideDropdown() {
//         ((document.getElementById("dropdown") || { style: {} }).style.display = "")
//     }

//     return (
//         <RecordPage
//             title="Ratings"
//             showForm={false}
//             searchPlaceholder="Search rating or review"
//             onSearch={(value) => { setCurrentPage(1); setSearchText(value); }}
//             total={backenRatingReviewCount}
//             currentPage={currentPage}
//             listPerPage={listPerPage}
//             onPageChange={handlePageChange}
//             setListPerPage={setListPerPage}
//             setCurrentPage={setCurrentPage}
//             hasRows={Boolean(ratingReviewList && ratingReviewList.length > 0)}
//         >
//             <div className={style.ratingListSection}>
//                 <div className={style.tableContainer}>
//                     <div className={style.table}>

//                         <div className={style.tableHeadingContainer}
//                             onClick={hideDropdown}
//                             onTouchStart={hideDropdown}
//                         >

//                             <div
//                                 className={`${style.commonColumnTitle} ${style.commonColumnTitle2}`}
//                             >
//                                 SNo.
//                             </div>

//                             <div
//                                 className={`${style.commonColumnTitle} ${style.commonColumnTitle2}`}
//                             >
//                                 <span onClick={(e) => {
//                                     setShowSortingIcon(false);
//                                     sortratingReviewList("rating");
//                                 }}
//                                     onMouseEnter={(e) => {
//                                         if (columnToSort != "rating") {
//                                             setShowSortingIcon(true);
//                                         }
//                                     }}
//                                     onMouseLeave={(e) => {
//                                         if (columnToSort != "rating") {
//                                             setShowSortingIcon(false);
//                                         }
//                                     }}
//                                     style={{ wordBreak: "break-word" }}>Rating{" "}</span>
//                                 <span onClick={(e) => {
//                                     setShowSortingIcon(false);
//                                     sortratingReviewList("rating");
//                                 }}
//                                     onMouseEnter={(e) => {
//                                         if (columnToSort != "rating") {
//                                             setShowSortingIcon(true);
//                                         }
//                                     }}
//                                     onMouseLeave={(e) => {
//                                         if (columnToSort != "rating") {
//                                             setShowSortingIcon(false);
//                                         }
//                                     }}>
//                                     {columnToSort == "rating" &&
//                                         columnSortingOrder == "ascending" && (
//                                             <BsSortNumericDown className={style.sortingIcon} />
//                                         )}
//                                     {columnToSort == "rating" &&
//                                         columnSortingOrder == "descending" && (
//                                             <BsSortNumericDownAlt className={style.sortingIcon} />
//                                         )}
//                                     {columnToSort != "rating" && showSortingIcon && (
//                                         <BsSortNumericDown
//                                             color="grey"
//                                             className={style.sortingIcon}
//                                         />
//                                     )}
//                                 </span>
//                             </div>

//                             <div
//                                 className={`${style.commonColumnTitle} ${style.commonColumnTitle3}`}

//                             >
//                                 <span
//                                      className={style.reviewContainer}
//                                     style={{ wordBreak: "break-word",textAlign:'left' }}>Review{" "}</span>
//                             </div>

//                         </div>
//                         <div
//                             className={style.tableDataContainer}
//                             style={{
//                                 backgroundColor: "#efefef",
//                             }}
//                             onClick={hideDropdown}
//                             onTouchStart={hideDropdown}
//                         >
//                             {ratingReviewList != null && ratingReviewList.length > 0 ? (
//                                 ratingReviewList.map((RatingReviews, index) => {
//                                     return (
//                                         <div
//                                             key={index}
//                                             className={style.tableData}
//                                             style={{
//                                                 padding: "2px",
//                                                 marginTop: "2px",
//                                                 marginBottom:
//                                                     ratingReviewList.length == index + 1 ? "2px" : "0px",
//                                             }}
//                                         >
//                                             <div
//                                                 className={`${style.commonColumnData} ${style.commonColumnData2}`}
//                                             >
//                                                 {(currentPage * listPerPage - listPerPage) + index + 1}
//                                             </div>
//                                             <div className={`${style.commonColumnData} ${style.commonColumnData2}`}
//                                             >
//                                                 {RatingReviews.rating != null || RatingReviews.rating != undefined ?
//                                                     <>
//                                                       <span style={{fontWeight:'bold'}}>
//                                                       {RatingReviews.rating}
//                                                         </span> <StarFilled style={{color:'#ffd800'}}/>
//                                                     </> : '-'}
//                                             </div>
//                                             <div className={style.commonColumnData} style={{ textJustify: 'inter-word',textAlign:'left'}}>
//                                                 {RatingReviews.review != null || RatingReviews.review != undefined ?
//                                                     <>

//                                                         <ReactReadMoreReadLess
//                                                             charLimit={55}
//                                                             readMoreText={"more"}
//                                                             readLessText={"less"}
//                                                         >
//                                                             {RatingReviews.review}
//                                                         </ReactReadMoreReadLess>
//                                                     </> : '---'}
//                                             </div>

//                                         </div>
//                                     );
//                                 })
//                             ) : (
//                                 <div style={{ textAlign: "center" }}>No records found!</div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </RecordPage>
//     );
// };

// export default RatingReview;






import React, { useEffect, useState } from "react";
import style from "../style/restaurantratingreview.module.css";
import Header from "../../../../components/Header/Header";
import { loadRatingCount, loadRatings } from "../../services/restaurantRatingReviewService";
import {
    BsSortAlphaDownAlt,
    BsSortAlphaDown,
    BsSortNumericDownAlt,
    BsSortNumericDown,
} from "react-icons/bs";

import { useApp } from "../../../../Context/AppContext";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { useRatingReviewState } from "../../usestate/ratingReviewState";
import {
    StarFilled,
} from '@ant-design/icons';
import RecordPage from "../../../../components/RecordPage/RecordPage";
const RatingReview = () => {
    const { enableHeader } = useApp();
    const [ratingSummary, setRatingSummary] = useState({ average: 0, count: 0 });
    var {
        backenRatingReviewCount,
        setBackendRatingReviewCount,
        ratingReviewList,
        setRatingReviewList,
        listPerPage,
        setListPerPage,
        columnToSort,
        setColumnToSort,
        columnSortingOrder,
        setColumnSortingOrder,
        showSortingIcon,
        setShowSortingIcon,
        currentPage,
        setCurrentPage,
        searchText,
        setSearchText,
    } = useRatingReviewState();

    useEffect(() => {
        enableHeader()
        if (localStorage.getItem("globalPageIndex")) {
            currentPage = parseInt(localStorage.getItem("globalPageIndex"))
            setCurrentPage(parseInt(localStorage.getItem("globalPageIndex")))
        }

        getCountOfCutomers();
        getListOfRatingReview();
    }, []);

    useEffect(() => {
        getListOfRatingReview();
    }, [columnToSort, columnSortingOrder, currentPage, searchText, listPerPage]);

    const getCountOfCutomers = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const response = await loadRatingCount(tenant);
        if (response && !response.error) {
            setBackendRatingReviewCount(response.ratingCount);
            setRatingSummary({ average: Number(response.averageRating) || 0, count: Number(response.ratedCustomerCount) || 0 });
        }
    };

    const getListOfRatingReview = async () => {
        const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
        const paginationDetails = {
            currentPage: currentPage,
            listPerPage: listPerPage,
        };
        const filteringCriteria = {
            paginationDetails: paginationDetails,
            columnToSort: columnToSort,
            columnSortingOrder: columnSortingOrder,
            searchText: searchText.trim(),
        };
        const response = await loadRatings(tenant, filteringCriteria);
        setRatingReviewList(response.ratingReviewList);
        setBackendRatingReviewCount(response.ratingReviewListCount)
    };

    const handlePageChange = async (pageNumber) => {
        localStorage.setItem("globalPageIndex", pageNumber)
        setCurrentPage(pageNumber);
    };

    const sortratingReviewList = (columnName) => {
        if (columnToSort == columnName) {
            if (columnSortingOrder == "ascending") {
                setColumnSortingOrder("descending");
            } else {
                setColumnSortingOrder("ascending");
            }
        }
        setColumnToSort(columnName);
    };

    function hideDropdown() {
        ((document.getElementById("dropdown") || { style: {} }).style.display = "")
    }

    return (
        <RecordPage
            title="Ratings"
            showForm={false}
            searchPlaceholder="Search rating or review"
            onSearch={(value) => { setCurrentPage(1); setSearchText(value); }}
            total={backenRatingReviewCount}
            currentPage={currentPage}
            listPerPage={listPerPage}
            onPageChange={handlePageChange}
            setListPerPage={setListPerPage}
            setCurrentPage={setCurrentPage}
            hasRows={Boolean(ratingReviewList && ratingReviewList.length > 0)}
        >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 20, padding: "20px 24px", border: "1px solid #e0e6ef", borderRadius: 12, background: "linear-gradient(110deg, #ffffff 0%, #f5f8ff 100%)" }}>
                <div>
                    <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>Overall Restaurant Rating</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <strong style={{ fontSize: 38, lineHeight: 1.2, color: "#0f172a" }}>{ratingSummary.count ? ratingSummary.average.toFixed(1) : "0.0"}</strong>
                        <span style={{ fontSize: 16, color: "#64748b" }}>/ 5</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>Based on {ratingSummary.count} customer {ratingSummary.count === 1 ? "rating" : "ratings"}</div>
                </div>
                <div aria-label={`${ratingSummary.average.toFixed(1)} out of 5 stars`} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ position: "relative", display: "inline-block", fontSize: 31, lineHeight: 1, color: "#d7dce5" }}>
                            ★
                            <span aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: `${Math.max(0, Math.min(1, ratingSummary.average - (star - 1))) * 100}%`, overflow: "hidden", color: "#f5b301", whiteSpace: "nowrap" }}>★</span>
                        </span>
                    ))}
                </div>
            </div>
            <div className={style.ratingListSection}>
                <div className={style.tableContainer}>
                    <div className={style.table}>

                        <div className={style.tableHeadingContainer}
                            onClick={hideDropdown}
                            onTouchStart={hideDropdown}
                        >

                            <div
                                className={`${style.commonColumnTitle} ${style.commonColumnTitle2}`}
                            >
                                SNo.
                            </div>

                            <div
                                className={`${style.commonColumnTitle} ${style.commonColumnTitle2}`}
                            >
                                <span onClick={(e) => {
                                    setShowSortingIcon(false);
                                    sortratingReviewList("rating");
                                }}
                                    onMouseEnter={(e) => {
                                        if (columnToSort != "rating") {
                                            setShowSortingIcon(true);
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (columnToSort != "rating") {
                                            setShowSortingIcon(false);
                                        }
                                    }}
                                    style={{ wordBreak: "break-word" }}>Rating{" "}</span>
                                <span onClick={(e) => {
                                    setShowSortingIcon(false);
                                    sortratingReviewList("rating");
                                }}
                                    onMouseEnter={(e) => {
                                        if (columnToSort != "rating") {
                                            setShowSortingIcon(true);
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (columnToSort != "rating") {
                                            setShowSortingIcon(false);
                                        }
                                    }}>
                                    {columnToSort == "rating" &&
                                        columnSortingOrder == "ascending" && (
                                            <BsSortNumericDown className={style.sortingIcon} />
                                        )}
                                    {columnToSort == "rating" &&
                                        columnSortingOrder == "descending" && (
                                            <BsSortNumericDownAlt className={style.sortingIcon} />
                                        )}
                                    {columnToSort != "rating" && showSortingIcon && (
                                        <BsSortNumericDown
                                            color="grey"
                                            className={style.sortingIcon}
                                        />
                                    )}
                                </span>
                            </div>

                            <div
                                className={`${style.commonColumnTitle} ${style.commonColumnTitle3}`}

                            >
                                <span
                                    className={style.reviewContainer}
                                    style={{ wordBreak: "break-word", textAlign: 'left' }}>Review{" "}</span>
                            </div>

                        </div>
                        <div
                            className={style.tableDataContainer}
                            style={{
                                backgroundColor: "#efefef",
                            }}
                            onClick={hideDropdown}
                            onTouchStart={hideDropdown}
                        >
                            {ratingReviewList != null && ratingReviewList.length > 0 ? (
                                ratingReviewList.map((RatingReviews, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={style.tableData}
                                            style={{
                                                padding: "2px",
                                                marginTop: "2px",
                                                marginBottom:
                                                    ratingReviewList.length == index + 1 ? "2px" : "0px",
                                            }}
                                        >
                                            <div
                                                className={`${style.commonColumnData} ${style.commonColumnData2}`}
                                            >
                                                {(currentPage * listPerPage - listPerPage) + index + 1}
                                            </div>
                                            <div className={`${style.commonColumnData} ${style.commonColumnData2}`}
                                            >
                                                {RatingReviews.rating != null || RatingReviews.rating != undefined ?
                                                    <>
                                                        <span style={{ fontWeight: 'bold' }}>
                                                            {RatingReviews.rating}
                                                        </span> <StarFilled style={{ color: '#ffd800' }} />
                                                    </> : '-'}
                                            </div>
                                            <div className={style.commonColumnData} style={{ textJustify: 'inter-word', textAlign: 'left' }}>
                                                {RatingReviews.review != null || RatingReviews.review != undefined ?
                                                    <>

                                                        <ReactReadMoreReadLess
                                                            charLimit={55}
                                                            readMoreText={"more"}
                                                            readLessText={"less"}
                                                        >
                                                            {RatingReviews.review}
                                                        </ReactReadMoreReadLess>
                                                    </> : '---'}
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

        </RecordPage>
    );
};

export default RatingReview;
