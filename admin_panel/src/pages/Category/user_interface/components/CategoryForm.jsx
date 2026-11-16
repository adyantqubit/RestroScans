import { useEffect } from "react";
import style from "../style/categoryForm.module.css";
import Header from "../../../../components/Header/Header";
import { loadCategory, loadMenuOptions, saveCategory as persistCategory } from "../../services/categoryService";
import { useApp } from "../../../../Context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../../../config/config";
import { Select } from '../../../../ui';
import { useCategoryFormState } from "../../usestate/categoryFormState";
const { Option } = Select;

function CategoryForm({ embedded = false, recordId = null, onSaved, onClose }) {
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
    categoryData,
    setCategoryData,
    categoryId,
    setCategoryId,
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
    menuList,
    setMenuList,
    menu,
    setMenu,
    menuName,
    setMenuName,
    validationErrors,
    setValidationErrors,
    defaultValueData,
    setDefaultValueData,
  } = useCategoryFormState();

  var defalutMenu = { label: null, value: null }
  var b

  useEffect(() => {
    if (!embedded) enableHeader();
    window.scrollTo(0, 0);
    const nextId = embedded ? recordId : (location.state && location.state.id != null ? location.state.id : null);
    if (nextId != null) setCategoryId(nextId);
  }, [embedded, recordId]);

  useEffect(() => {
    if (categoryId) {
      getCategoryData();
    } else {
      getMenus();
    }
  }, [categoryId]);

  const getMenus = async () => {
    setMenuList(await loadMenuOptions());
  };

  const getCategoryData = async () => {
    const loaded = await loadCategory(categoryId);
    const category = loaded.category;
    if (category) {
      setCategoryData(category);
      setCategoryId(category.id);
      setName(category.name || "");
      setIcon(category.icon);
      setIsActive(category.is_active);
      setMenu(category.menu);
      setMenuName(category.menu_name)
      b = category.menu
      defalutMenu = { label: category.menu_name, value: category.menu }
      setMenuList(loaded.menus);
    }
  };

  const validateOnBlur = (inputName, value) => {
    if (inputName == "name") {
      if (name != null || value) {
        const error = {
          name: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          name: "Please enter category name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "menu") {
      if (value) {
        const error = {
          menu: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          menu: "Please select menu name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };

  const validateOnInput = (inputName, value) => {
    if (inputName == "name") {
      if (name != null || value) {
        const error = {
          name: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          name: "Please enter category name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "menu") {
      if (value) {
        const error = {
          menu: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          menu: "Please enter menu name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };

  const validateOnFileInput = (inputName, value) => {
    if (inputName == "icon") {
      if (value != null && value != undefined) {
        if (value.size / 1024 > 40 * 1024) {
          const error = {
            icon: "Image must be smaller than 40 MB before automatic compression",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            icon: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          icon: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };

  const saveCategory = async () => {
    var allowDataPost = false;

    if ((name == null || name == "") && menu == null) {
      const error = {
        name: "Please enter category name",
        menu: "Please enter menu name",
      };
      setValidationErrors({ ...validationErrors, ...error });
    } else {
      if (name == null || name == "") {
        const error = {
          name: "Please enter category name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }

      if (menu == null) {
        const error = {
          menu: "Please enter menu name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (
      name == null ||
      name == undefined ||
      name.trim() == "" ||
      menu == null
    ) {
      allowDataPost = false;
    } else {
      if (categoryId == null || categoryId == undefined) {
        if (menu == null || menu == undefined) {
          allowDataPost = false;
        } else {
          allowDataPost = true;
        }
      } else {
        allowDataPost = true;
      }
    }

    if (
      validationErrors.icon != "" ||
      validationErrors.name != "" ||
      validationErrors.menu != ""
    ) {
      allowDataPost = false;
    }

    if (allowDataPost) {
      const saved = await persistCategory({
        categoryId,
        name,
        menu,
        iconFile: selectedImage,
        isActive,
      });
      if (saved && saved.ok) {
        Message("Category saved successfully.", "success");
        finish();
      } else {
        Message((saved && saved.error) || "The category was not saved.", "error");
      }
    } else {
    }
  };

  const resetCategoryForm = (event) => {
    setName(categoryData.name ? categoryData.name : "");
    setIcon(categoryData.icon ? categoryData.icon : "");
    setIsActive(categoryData.is_active == true || categoryData.is_active == false ? categoryData.is_active : true);
    setSelectedImageName(null);
    setSelectedImage(null);
    setMenu(categoryData.menu ? categoryData.menu : null);
    document.getElementById("icon").value = "";

    const error = {
      name: "",
      menu: "",
      icon: "",
      is_active: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };

  const handleMenuChange = (value) => {
    setMenu(value)
    const error = {
      menu: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };

  const newArrayOfObj = menuList.map(({
    name: label,
    id: value,
    ...rest
  }) => ({
    label,
    value,
    ...rest
  }));

  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Category</div>
      </div>
      <form className={style.categorySection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>
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
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setName(e.target.value.toString());
                    validateOnInput("name", e.target.value.toString());
                  }}
                  onBlur={(e) => validateOnBlur("name", e.target.value.toString())}
                  maxLength={30}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.name}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Menu name
                </div>

                <Select
                  placeholder="Please select menu"
                  optionFilterProp="children"
                  value={menu}
                  onChange={handleMenuChange}
                  style={{ width: 200, border: "1px solid black", borderRadius: "7px", fontSize: "18px" }}
                  listHeight={190}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {menuList.map((items) => (
                    <Option value={items.id}>{items.name}</Option>
                  ))}
                </Select>

              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.menu}
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
                {validationErrors.is_active}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}></span>&nbsp;&nbsp; Icon
                </div>
                <div className={style.categoryImageContainer}>
                  {selectedImageName ? (
                    selectedImageName
                  ) : icon ? (
                    <img
                      src={config.staticBaseURL + icon}
                      className={style.categoryImage}
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
                  }}
                />
              </div>

              <div className={`${style.inputErrorArea}`}>
                {validationErrors.icon}
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
              resetCategoryForm();
              window.scrollTo(0, 0);
            }}
          >
            Clear
          </div>

          <div
            className={` ${style.proceedButton}`}
            onClick={() => {
              saveCategory();
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
export default CategoryForm;
