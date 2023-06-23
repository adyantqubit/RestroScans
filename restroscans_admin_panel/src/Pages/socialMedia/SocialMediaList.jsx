// Created by Yuvraj Sahu on 29-05-2023
// Reason - to show all social media

import React, { useEffect, useState } from "react";
import Header from "../GlobalComponent/Header";
import { deteleSocialMediaApi, getSocialMediaApi } from "../../Api/services";
import style from "./SocialMediaList.module.css";
import config from "../../Api/config";
import { useNavigate } from "react-router-dom";
import { Button, message, Modal, Popconfirm } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { Message } from "../../App";

export default function SocialMediaList() {
  const navigate = useNavigate();

  /**
   * Set all social media datas that is come from api calling
   */
  var [allSocialMedia, setAllSocialMedia] = useState([]);
  /**
   * End of set all social media
   */

  /**
   * Function calling when page render
   */
  useEffect(() => {
    // Added by Yuvraj Sahu on 12-06-2023
    // Reason - to open page from top
    window.scrollTo(0, 0);
    // End of additionm by Yuvraj Sahu on 12-06-2023
    getSocialMedias();
  }, []);
  /**
   * End of function calling page rendering
   */

  /**
   * get all social media ( API calling )
   */
  const getSocialMedias = async () => {
    var tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    var response = await getSocialMediaApi(tenant);
    if (response.msg) {
      setAllSocialMedia(response.social);
    }
  };
  /**
   * End of getting social media
   */
  /**
   * To check and uncheck checkbox for select
   */
  //   function checkAndUncheckAll(value) {
  //     // To store all item in checked item if value get false then remove all from checked item
  //     if (value) {
  //         checkedItems = selectedOrder
  //         setCheckedItem(selectedOrder)
  //     }
  //     else
  //         setCheckedItem([])
  //     if (checkedItems.length > 0) {
  //         var allCheckboxes = document.querySelectorAll("#checkbox")
  //         for (let index = 0; index < allCheckboxes.length; index++) {
  //             allCheckboxes[index].checked = value
  //         }
  //     }
  //     else if (value) {
  //         uncheckAll()
  //         Message("No item present", "warning")
  //     }
  // }

  // --------------- delete confirm ------------------
  /**
   * Added by Yuvraj Sahu on 22-06-2023
   * Reason - to open and close modal for delete social media
   */
  var [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState({isOpen : false, id : null});
  /**
   * End of addition by Yuvraj Sahu on 22-06-2023
   */

  const handleDeleteConfirmation = async (e) => {
    var tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    var response = await deteleSocialMediaApi(tenant, e);
    if (response.msg) {
      // message.success(response.msg);
      /**
       * Added by Yuvraj Sahu on 10-06-2023
       * Reason - to give success message
       */
      Message("Social media deleted successfully.", "success");
      /** Added by yuvraj Sahu on 22-06-2023
      * Reson - to close modal
      */
      setIsConfirmationModalOpen({isOpen : false});
      /**
      * End of addition by Yuvraj Sahu on 22-06-2023
      */
      /**
       * End of addition by Yuvraj Sahu 10-06-2023
       */
      setAllSocialMedia(response.socialData);
    } else {
      /**
       * Added by Yuvraj Sahu on 10-06-2023
       * Reason - to give error message
       */
      Message("Something went wrong", "error");
    }
    /**
     * End of addition by Yuvraj Sahu 10-06-2023
     */
  };
  /**
   * End of addition by Yuvraj Sahu 10-06-2023
   */
  const cancel = (e) => {
    // message.error("not delete");
  };
  // --------------- End delete confirm --------------

  return (
    <Header>
      <div className={style.container}>
        <h1 className={style.heading}>Social Media List</h1>
        <div className={style.addBtnContainer}>
          <button
            className={style.AddSocialLink}
            onClick={() => navigate("/add-social-media", { state: { id: 0 } })}
          >
            Add Social Media
          </button>
        </div>
        <div className={style.TabelContainer}>
          {/* <div className={style.table}> */}
          <div className={style.tableColumnHeading}>
            <div className={style.tableColumn1}>S.No</div>
            {/* <div className={style.tableColumn2}>ID </div> */}
            <div className={style.tableColumn3}>Social Media Name</div>
            <div className={style.tableColumn4}>Social Media Link</div>
            <div className={style.tableColumn5}>Social Media Icon</div>
            <div className={style.tableColumn6}>Delete</div>
          </div>

          {allSocialMedia && allSocialMedia.length > 0 ? (
            allSocialMedia.map((data, i) => (
              <div className={style.tableRow}>
                <div className={style.tableColumn1}>{i + 1}</div>
                {/* <div
                  className={style.tableColumn2}
                  onClick={() => {
                    navigate(`/update-social-media/${data.id}`, {
                      state: { id: data.id },
                    });
                  }}
                >
                  {data.id}
                </div> */}
                <div
                  className={`${style.tableColumn3} ${style.tableSocialMediaName}`}
                  onClick={() => {
                    navigate(`/update-social-media/${data.id}`, {
                      state: { id: data.id },
                    });
                  }}
                  style={{ wordBreak: "break-word" }}
                >
                  {data.social_media_name}
                </div>
                <div className={style.tableColumn4}>
                  {data.social_media_link}
                </div>
                <div className={style.tableColumn5}>
                  <img
                    src={config.staticBaseURL + data.social_media_icon}
                    className={style.socialIcon}
                    // Added by Yuvraj Sahu on 17-06-2023
                    // Reason - to navigate when we click icon
                    onClick={() => {
                      navigate(`/update-social-media/${data.id}`, {
                        state: { id: data.id },
                      });
                    }}
                    // End of addition by Yuvraj Sahu on 17-06-2023
                  />
                </div>
                <div className={style.tableColumn5}>
                  {/* Commeted and modified by Yuvraj Sahu on 22-06-2023
                  Reason - to pop confirm to modal */}
                  {/* <Popconfirm
                    title="Are you sure you want to delete"
                    onConfirm={() => confirm(data.id)}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  > */}
                  <Modal
                    // mask={false}
                    maskStyle={{
                      backgroundColor: "rgba(0,0,0,0.03)",
                    }}
                    title="Confirmation"
                    open={isConfirmationModalOpen.isOpen}
                    onOk={() => setIsConfirmationModalOpen({isOpen : false})}
                    onCancel={() => setIsConfirmationModalOpen({isOpen : false})}
                    footer={null}
                    className={style.modalContainerSocial}
                  >
                    <h1 style={{fontSize: "15px", fontWeight: 500}}>Are you sure you want to delete</h1>
                    <div className={style.btnContainer}>
                      <div className={style.selectionContainer}>
                        <button
                          className={style.btnUpdate}
                          onClick={e => handleDeleteConfirmation(isConfirmationModalOpen.id)}
                        >
                          Delete
                        </button>
                      </div>
                      <div className={style.selectionContainer}>
                        <button
                          className={style.btnUpdate}
                          onClick={e => setIsConfirmationModalOpen({isOpen : false})}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Modal>
                  <DeleteTwoTone
                    color="red"
                    style={{ fontSize: 20 }}
                    twoToneColor="red"
                    onClick={() => setIsConfirmationModalOpen({isOpen : true, id : data.id})}
                  />
                  {/* </Popconfirm> */}
                  {/* End of changing pop confirm by Yuvraj Sahu on 22-06-2023 */}
                </div>
              </div>
            ))
          ) : (
            <div className={style.row}>
              <div className={style.EmptyText}>
                {" "}
                No social media created yet !
              </div>
            </div>
          )}
        </div>
        {/* </div> */}
      </div>
    </Header>
  );
}
