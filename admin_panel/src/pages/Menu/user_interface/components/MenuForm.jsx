import { useEffect } from "react";
import style from "../style/menuForm.module.css";
import Header from "../../../../components/Header/Header";
import { loadMenu, saveMenu as persistMenu } from "../../services/menuService";
import { useApp } from "../../../../Context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../../../config/config";
import { useMenuFormState } from "../../usestate/menuFormState";

function MenuForm({ embedded = false, recordId = null, onSaved, onClose }) {
  const { Message, enableHeader } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const finish = () => {
    if (embedded && onSaved) onSaved();
    else navigate(-1);
  };
  const back = () => {
    if (embedded && onClose) onClose();
    else navigate(-1);
  };
  var {
    menuData,
    setMenuData,
    menuId,
    setMenuId,
    name,
    setName,
    icon,
    setIcon,
    isActive,
    setIsActive,
    selectedImageName,
    setSelectedImageName,
    selectedImage,
    setSelectedImage,
    nameError,
    setNameError,
    iconError,
    setIconError,
  } = useMenuFormState();

  useEffect(() => {
    if (!embedded) enableHeader();
    window.scrollTo(0, 0);
    const nextId = embedded ? recordId : (location?.state?.id ?? null);
    if (nextId != null) setMenuId(nextId);
  }, [embedded, recordId]);

  useEffect(() => {
    if (menuId) {
      getMenuData();
    }
  }, [menuId]);

  const getMenuData = async () => {
    const menu = await loadMenu(menuId);
    if (menu) {
      setMenuData(menu);
      setMenuId(menu.id);
      setName(menu.name || "");
      setIcon(menu.icon);
      setIsActive(menu.is_active);
    }
  };

  const validateOnBlur = (inputName, value) => { };

  const validateOnInput = (inputName, value) => {
    if (inputName == "name") {
      if (value != null || value != undefined || value?.trim() != "") {
        setNameError("")
      }
    }
  };

  const validateOnFileInput = (inputName, value) => {
    if (inputName == "icon") {
      if (value != null && value != undefined) {
        if (value?.size / 1024 > 40 * 1024) {
          setIconError("Image must be smaller than 40 MB before automatic compression")
        } else {
          setIconError("")
        }
      } else {
        setIconError("")
      }
    }
  };

  const saveMenu = async () => {
    var allowDataPost = false;

    if (name == null || name == undefined || name.trim() == "") {
      setNameError("Please enter menu name")
    } else {
      setNameError("")
    }

    if (menuId == null || menuId == undefined) {
      if (selectedImage == null || selectedImage == undefined) {
        setIconError("Please select image")
      }
      else if (selectedImage?.size / 1024 > 40 * 1024) {
        setIconError("Image must be smaller than 40 MB before automatic compression")
      }
    }

    if (name == null || name == undefined || name.trim() == "" ||
      ((menuId == null || menuId == undefined) && (selectedImage == null || selectedImage == undefined)) || (selectedImage?.size / 1024 > 40 * 1024)) {
      allowDataPost = false
    } else {
      if (nameError != "" || iconError != "") {
        allowDataPost = false;
      } else {
        allowDataPost = true;
      }
    }

    if (allowDataPost) {
      const saved = await persistMenu({
        menuId,
        name,
        iconFile: selectedImage,
        isActive,
      });
      if (saved && saved.ok) {
        Message("Menu saved successfully.", "success");
        finish();
      } else {
        Message((saved && saved.error) || "The menu was not saved.", "error");
      }
    }
  };

  const resetMenuForm = (event) => {
    setName(menuData.name ? menuData.name : "");
    setIcon(menuData.icon ? menuData.icon : "");
    setIsActive(typeof menuData.is_active === 'boolean' ? menuData.is_active ? true : false : true);
    setSelectedImageName(null);
    setSelectedImage(null);
    document.getElementById("icon").value = "";

    setIconError("")
    setNameError("")
  };

  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Menu</div>
      </div>
      <form className={style.menuSection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Icon
                </div>
                <div className={style.menuImageContainer}>
                  {selectedImageName ? (
                    selectedImageName
                  ) : icon ? (
                    <img
                      src={config.staticBaseURL + icon}
                      className={style.menuImage}
                      width={"200px"}
                      height={"200px"}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.optionalField}>* </span>Select new
                  icon
                </div>

                <input
                  className={`${style.textInputBox}`}
                  type="file"
                  name="icon"
                  id="icon"
                  accept="image/png,image/jpg,image/jpeg"
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setSelectedImageName(e.target.files[0].name);
                      setSelectedImage(e.target.files[0]);
                      validateOnFileInput("icon", e.target.files[0]);
                    }
                    else {
                      setSelectedImageName(null);
                      setSelectedImage(null)
                    }
                  }}
                />
              </div>

              <div className={`${style.inputErrorArea}`}>
                {iconError}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Name
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="name"
                  value={name}
                  onKeyPress={e => {
                    if (e.which == 13) {
                      e.preventDefault();
                      //do something
                    }
                  }}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setName(e.target.value?.toString());
                    validateOnInput("name", e.target.value?.toString());
                  }}
                  maxLength={30}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {nameError}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.optionalField}>* </span>Is Available
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="checkbox"
                  name="is_available"
                  style={{ width: "18px", height: "18px" }}
                  checked={isActive}
                  onChange={(e) => {
                    setIsActive(e.target.checked);
                    validateOnInput("is_available", e.target.value);
                  }}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {""}
              </div>
            </div>

          </div>
        </div>

        <div className={style.actionContainer}>
          <div
            className={` ${style.backButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              back();
            }}
          >
            Back
          </div>

          <div
            className={` ${style.cancelButton}`}
            style={{
              marginRight: "10px",
            }}
            onClick={(e) => {
              resetMenuForm();
              window.scrollTo(0, 0);
            }}
          >
            Clear
          </div>

          <div
            className={` ${style.proceedButton}`}
            onClick={() => {
              saveMenu();
              window.scrollTo(0, 0);
            }}
          >
            Save
          </div>
        </div>
      </form>
    </div>
  );
}
export default MenuForm;
