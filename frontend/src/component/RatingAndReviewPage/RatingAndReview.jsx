import { React, useContext} from 'react';
import { GlobalContext } from "../../context/Context";
import './RatingAndReview.css';
import { Rate, Button } from 'antd';
import secureLocalStorage from "react-secure-storage";
import { updateRatingAndReviewApi } from '../../api/Services';
import { useNavigate } from "react-router-dom";

export default function RatingAndReview() {

    // get colors from context 
    var { colors } = useContext(GlobalContext);

    // For navigations
    const navigate = useNavigate();

    // Added by :- Parineeta Gedam
    // Date :- 24-04-2023
    // Reason :- get data from local stroage

    var orderItems = secureLocalStorage.getItem('orderItem');
    var tenantName = localStorage.getItem("tenantName");

    // End of added code 24-04-2023 

    // Added by: - Parineeta Gedam
    // reason: - get rating value

    const getRatingValue = (id, e) => {
        document.getElementById("order" + id + "rating").value = e
    }

    // Added by: - Parineeta Gedam
    // Date: - 11 - 04 - 2023
    // reason: - update the rating and review

    const updateInvoiceData = async () => {

        var orderData = [];
        for (var i = 0; i < orderItems.length; i++) {

            var data = {
                id: orderItems[i].id,
                rating: document.getElementById("order" + orderItems[i].id + "rating").value,
                review: document.getElementById("order" + orderItems[i].id + "review").value,
            };
            orderData.push(data);
        }
        const response = await updateRatingAndReviewApi(tenantName, orderData);
        navigate(`/menu-item`);
    }

    // Added by :- Parineeta Gedam on 24-04-2023
    const navigations = () => {
        navigate(`/menu-item`);
      };
    //   End of added code on 24-04-2023
    
    return (
        <>
            <div className='rating_review_parent_container' style={{background:colors.backgroundTheme}}>
                <div className='first_parent_container'>
                    <div className='rating_review_heading'>Please give rating and review</div>
                    {orderItems.map((items, index) => (
                        <>
                            <div className='rating_review_data_container' id={"order" + items.id} key={index}>
                                <div className='rating_data_container'>
                                    <div className='orderitem_name'>{items.item}</div>
                                    <div className='rating_container' id={"order" + items.id + "rating"} name="rating" >
                                        <Rate name="rating" onChange={e => getRatingValue(items.id, e)} />
                                        <input name="rating" id={"order" + items.id + "rating"} style={{ display: "none" }} />
                                    </div>
                                </div>
                                <div className='review_container' name="review">
                                    <div className='review_label'>Review : </div>
                                    <input className='review_input_box' name="review" id={"order" + items.id + "review"} maxLength={255} />
                                </div>
                            </div>
                        </>
                    ))}
                </div>

                <div className='rating_review_btn_container'>
                <button className='rating_review_skip_btn' style={{ background: colors.bannerColor, color: colors.backgroundTheme }} 
                onClick={(e) => navigations()}> Skip </button>
                <button className='rating_review_done_heading' style={{ background: colors.bannerColor, color: colors.backgroundTheme }}  onClick={(e) => updateInvoiceData()}> Done </button>
                </div>
            </div>
        </>
    )
}
