import React, { useEffect, useState } from "react";
import { explainFailure } from "../../../../http/http_client";
import { deleteSocialLink, loadSocialPage } from "../../services/socialMediaService";
import style from "../style/SocialMediaList.module.css";
import config from "../../../../config/config";
import { Modal } from "../../../../ui";
import { DeleteTwoTone } from "@ant-design/icons";
import { useApp } from "../../../../Context/AppContext";
import { useSocialMediaListState } from "../../usestate/socialMediaListState";
import RecordPage from "../../../../components/RecordPage/RecordPage";
import SocialMediaForm from "../components/SocialMediaForm";

export default function SocialMediaList() {
  const { Message, enableHeader } = useApp();
  const { isConfirmationModalOpen, setIsConfirmationModalOpen } = useSocialMediaListState();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [listPerPage, setListPerPage] = useState(Number(localStorage.getItem("listPerPage")) || 10);
  const [searchText, setSearchText] = useState("");
  const [columnToSort, setColumnToSort] = useState("name");
  const [columnSortingOrder, setColumnSortingOrder] = useState("ascending");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    enableHeader();
  }, []);

  useEffect(() => {
    loadPage();
  }, [currentPage, listPerPage, searchText, columnToSort, columnSortingOrder]);

  const loadPage = async () => {
    const response = await loadSocialPage({
      currentPage,
      listPerPage,
      searchText,
      columnToSort,
      columnSortingOrder,
    });
    if (response.msg) {
      setRows(response.social || []);
      setTotal(response.count || 0);
    }
  };

  const sortBy = (column) => {
    if (columnToSort === column) {
      setColumnSortingOrder(columnSortingOrder === "ascending" ? "descending" : "ascending");
    } else {
      setColumnToSort(column);
      setColumnSortingOrder("ascending");
    }
  };

  const openForm = (row) => {
    setEditing(row || null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleDeleteConfirmation = async (id) => {
    const response = await deleteSocialLink(null, id);
    if (response.msg) {
      Message("Social media deleted successfully.", "success");
      setIsConfirmationModalOpen({ isOpen: false });
      loadPage();
    } else {
      Message(explainFailure(response, "This social link was not deleted."), "error");
    }
  };

  return (
    <RecordPage
      title="Social media"
      formOpen={formOpen}
      formTitle={editing ? "Edit social link" : "New social link"}
      onToggleForm={() => setFormOpen((open) => !open)}
      onCreate={() => openForm(null)}
      createLabel="New link"
      form={formOpen ? (
        <SocialMediaForm
          key={editing ? editing.id : "new"}
          embedded
          recordId={editing ? editing.id : 0}
          record={editing}
          onSaved={() => {
            closeForm();
            loadPage();
          }}
          onClose={closeForm}
        />
      ) : null}
      searchPlaceholder="Search name or link"
      onSearch={(value) => {
        setCurrentPage(1);
        setSearchText(value);
      }}
      total={total}
      currentPage={currentPage}
      listPerPage={listPerPage}
      onPageChange={setCurrentPage}
      setListPerPage={setListPerPage}
      setCurrentPage={setCurrentPage}
      hasRows={rows.length > 0}
    >
      <div className={style.TabelContainer}>
        <div className={style.tableColumnHeading}>
          <div className={style.tableColumn1}>S.No</div>
          <div className={style.tableColumn3} onClick={() => sortBy("name")}>Social Media Name</div>
          <div className={style.tableColumn4} onClick={() => sortBy("link")}>Social Media Link</div>
          <div className={style.tableColumn5}>Social Media Icon</div>
          <div className={style.tableColumn6}>Delete</div>
        </div>
        {rows.length > 0 ? rows.map((data, i) => (
          <div className={style.tableRow} key={data.id}>
            <div className={style.tableColumn1}>{(currentPage - 1) * listPerPage + i + 1}</div>
            <div
              className={`${style.tableColumn3} ${style.tableSocialMediaName}`}
              onClick={() => openForm(data)}
              style={{ wordBreak: "break-word" }}
            >
              {data.social_media_name}
            </div>
            <div className={style.tableColumn4}>{data.social_media_link}</div>
            <div className={style.tableColumn5}>
              <img
                src={config.staticBaseURL + data.social_media_icon}
                className={style.socialIcon}
                alt=""
                onClick={() => openForm(data)}
              />
            </div>
            <div className={style.tableColumn5}>
              <DeleteTwoTone
                style={{ fontSize: 20 }}
                twoToneColor="red"
                onClick={() => setIsConfirmationModalOpen({ isOpen: true, id: data.id })}
              />
            </div>
          </div>
        )) : (
          <div className={style.row}>
            <div className={style.EmptyText}>No social media created yet</div>
          </div>
        )}
      </div>
      <Modal
        maskStyle={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        title="Confirmation"
        open={isConfirmationModalOpen.isOpen}
        onCancel={() => setIsConfirmationModalOpen({ isOpen: false })}
        footer={null}
      >
        <h1 style={{ fontSize: "15px", fontWeight: 500 }}>Are you sure you want to delete</h1>
        <div className={style.btnContainer}>
          <button className={style.btnUpdate} onClick={() => handleDeleteConfirmation(isConfirmationModalOpen.id)}>
            Delete
          </button>
          <button className={style.btnUpdate} onClick={() => setIsConfirmationModalOpen({ isOpen: false })}>
            Cancel
          </button>
        </div>
      </Modal>
    </RecordPage>
  );
}
