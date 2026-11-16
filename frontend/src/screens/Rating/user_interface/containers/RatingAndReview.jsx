import { React, useContext, useEffect } from "react";
import { GlobalContext } from "../../../../context/Context";
import "../style/RatingAndReview.css";
import { Rate, Button } from "antd";
import secureLocalStorage from "react-secure-storage";
import { updateRatingAndReviewApi, uniqueRatedItems, ratingPostBody } from '../../services/ratingService';
import { useLocation, useNavigate } from "react-router-dom";
import SocialLinks from "../../../Footer/user_interface/components/SocialLinks";
import { useState } from "react";
import { useRatingAndReviewState } from "../../usestate/ratingAndReviewState";

export default function RatingAndReview() {
  var { skip, setSkip, done, setDone, overallRating, setOverallRating } = useRatingAndReviewState();

  // get colors from context
  var { colors } = useContext(GlobalContext);

  // For navigations
  const navigate = useNavigate();

  var orderItems = secureLocalStorage.getItem("orderItem");
  var tenantName = localStorage.getItem("tenantName");

  const getRatingValue = (id, e) => {
    document.getElementById("order" + id + "rating").value = e;
  };

  const updateInvoiceData = async () => {
    const postingData = ratingPostBody(
      orderItems,
      document.getElementsByClassName("text_area")[0].value,
      overallRating,
      secureLocalStorage.getItem("order").order_id,
      function (id) {
        var node = document.getElementById(id);
        return node != null ? node.value : "";
      }
    );
    const response = await updateRatingAndReviewApi(tenantName, postingData);
    navigate(`/menu-item`);
  };

  const navigations = () => {
    navigate(`/menu-item`);
  };

  function removeDuplicates(arr) {
    return uniqueRatedItems(arr);
  }

  return (
    <>
      <div
        className="rating_review_parent_container"
        style={{ background: colors.backgroundTheme }}
      >
        <div className="first_parent_container">
          <div className="rating_review_heading">
            Please give rating and review
          </div>
          {orderItems.map((items, index) => (
            <>
              {items.item_status == "Cancelled" ? null : (
                <div
                  className="rating_review_data_container"
                  id={"order" + items.id}
                  key={index}
                >
                  <div className="rating_data_container">
                    <div className="orderitem_name">
                      {items.item} ({items.serving_size})
                    </div>
                    <div
                      className="rating_container"
                      id={"order" + items.id + "rating"}
                      name="rating"
                    >
                      <Rate
                        name="rating"
                        onChange={(e) => getRatingValue(items.id, e)}
                      />
                      <input
                        name="rating"
                        id={"order" + items.id + "rating"}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="review_container" name="review">
                    <div className="review_label">Review : </div>
                    <input
                      className="review_input_box"
                      name="review"
                      id={"order" + items.id + "review"}
                      maxLength={255}
                    />
                  </div>
                </div>
              )}
            </>
          ))}
        </div>

        <div className="Overall_container">
          <div className="review_label" style={{ width: "80%" }}>
            Give Overall Rating
          </div>

          <Rate
            name="rating"
            onChange={(e) => setOverallRating(e)}
            defaultValue={3}
          />
        </div>

        <div className="Overall_container">
          <div className="review_label" style={{ width: "80%" }}>
            Give Overall Review
          </div>
          <textarea className="text_area"></textarea>
        </div>

        <div className="button-container">
        <button className="rating_review_skip_btn" onClick={(e) => navigations()}
        style={{
              background: colors.bannerColor,
              color: colors.backgroundTheme,
            }}>
          Skip
        </button>
        <button className="rating_review_done_heading" onClick={(e) => updateInvoiceData()}
        style={{
              background: colors.bannerColor,
              color: colors.backgroundTheme,
              textAlign:'center'
            }}>
          Done
        </button>
      </div>

      </div>
      <div
        style={{
          position: "fixed",
          bottom: 5,
          height: "65px",
          width: "100%",
          background: colors.backgroundTheme,
        }}
      >
        <SocialLinks />
      </div>
    </>
  );
}
