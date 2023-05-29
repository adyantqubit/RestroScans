import { React, useContext, useEffect} from 'react';
import { GlobalContext } from "../../context/Context";
import './RatingAndReview.css';
import { Rate, Button } from 'antd';
import secureLocalStorage from "react-secure-storage";
import { updateRatingAndReviewApi } from '../../api/Services';
import { useNavigate } from "react-router-dom";
import SocialLinks from '../social_links/SocialLinks';

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

        // Added by ROhan kansari - 4/5/23
        // Reason - Sending overall review 

        const postingData={
            ItemRateReview:orderData,
            overallReview:document.getElementsByClassName("text_area")[0].value,
            order_id:secureLocalStorage.getItem("order").order_id
        }
        const response = await updateRatingAndReviewApi(tenantName, postingData);
        // End of code - 4/5/23 - Rohan Kansari
        navigate(`/menu-item`);
    }

    // Added by :- Parineeta Gedam on 24-04-2023
    const navigations = () => {
        navigate(`/menu-item`);
      };
    //   End of added code on 24-04-2023


    // Added by :- Rohan Kansari on 5/5/23
    // Reason :- remove duplicate element

    
    function removeDuplicates(arr) {
        return arr.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.item === arr.item)))
    }     
    // End of code - 5/5/23 - Rohan Kansari
    
    return (
        <>
            <div className='rating_review_parent_container' style={{background:colors.backgroundTheme}}>
                <div className='first_parent_container'>
                    <div className='rating_review_heading'>Please give rating and review</div>
                    {/* Commented by Rohan Kansari - 5/5/23
                        Reason - To remove duplicates in */}
                    {/* {removeDuplicates(orderItems).map((items, index) => ( */}
                        {orderItems.map((items, index) => (
                        <>
                            <div className='rating_review_data_container' id={"order" + items.id} key={index}>
                                <div className='rating_data_container'>
                                    {/* Commented and modified by Ashish Dewangan on 21-05-2023
                                    Reason - To show half and full price on rating and review */}
                                    {/* <div className='orderitem_name'>{items.item }</div> */}
                                    <div className='orderitem_name'>{items.item } ({items.serving_size})</div>
                                    {/* End of code modification by Ashish Dewangan on 21-05-2023 to show half and
                                    full price on rating and review*/}
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

                {/* Added by Rohan Kansari - 4/5/23 
                    Reason- To add one text area for overall review */}
                <div className='Overall_container'>
                    <div className='review_label' style={{width:"80%"}}>Give Overall Review</div>
                    <textarea className='text_area'></textarea>
                </div>
                {/* End of code- 4/5/23 - Rohan  */}
                <div className='rating_review_btn_container'>
                <button className='rating_review_skip_btn' style={{ background: colors.bannerColor, color: colors.backgroundTheme }} 
                onClick={(e) => navigations()}> Skip </button>
                <button className='rating_review_done_heading' style={{ background: colors.bannerColor, color: colors.backgroundTheme }}  onClick={(e) => updateInvoiceData()}> Done </button>
                </div>
            </div>
            {/* Added by Yuvraj Sahu on 26-05-2023
                Reason - to give social link */}
            <div style={{position: "fixed", bottom: 0, height: "60px", width: "100%", background:colors.backgroundTheme}}>
          <SocialLinks />
      </div>
      {/* End of addition by Yuvraj Sahu on 26-05-2023 */}
        </>
    )
}
