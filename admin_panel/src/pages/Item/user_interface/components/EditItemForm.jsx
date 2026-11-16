import { useEffect, useState } from "react";
import style from "../style/editItemForm.module.css";
import Header from "../../../../components/Header/Header";
import { loadCategoryOptions, loadItem, saveItem } from "../../services/itemService";
import { useApp } from "../../../../Context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../../../config/config";
import { Select } from "../../../../ui";
import { Icon } from "@chakra-ui/react";
import { useEditItemFormState } from "../../usestate/editItemFormState";
const { Option } = Select;

function EditItemForm({ embedded = false, recordId = null, onSaved, onClose, staffMode = false }) {
  const { Message, enableHeader } = useApp();
  const [kitchenAvailable, setKitchenAvailable] = useState(true);
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
    itemData,
    setItemData,
    itemId,
    setItemId,
    name,
    setName,
    fullPrice,
    setFullPrice,
    halfPrice,
    setHalfPrice,
    description,
    setDescription,
    icon,
    setIcon,
    isActive,
    setIsActive,
    isBestSeller,
    setIsBestSeller,
    selectedImageName,
    setSelectedImageName,
    selectedImage,
    setSelectedImage,
    categoryList,
    setCategoryList,
    category,
    setCategory,
    itemType,
    setItemType,
    menuName,
    setMenuName,
    validationErrors,
    setValidationErrors,
    defaultValueData,
    setDefaultValueData,
  } = useEditItemFormState();

  var defalutMenu = { label: null, value: null };
  var b;

  useEffect(() => {
    if (!embedded) enableHeader();
    window.scrollTo(0, 0);
    const nextId = embedded ? recordId : (location.state && location.state.id != null ? location.state.id : null);
    if (nextId != null) setItemId(nextId);
  }, [embedded, recordId]);

  useEffect(() => {
    if (itemId) {
      getItemData();
    } else {
      getCategories();
    }
  }, [itemId]);

  const getCategories = async () => {
    const categoryList = await loadCategoryOptions(staffMode);
    if (categoryList.length) {
      setCategoryList(categoryList);
    }
  };

  const getItemData = async () => {
    const loaded = await loadItem(itemId, staffMode);
    const response = { item: loaded.item, categories: loaded.categories };
    if (response.item) {
      setItemData(response.item);
      setFullPrice(response.item.price_full ?? "");
      setHalfPrice(response.item.price_half ?? "");
      setItemType(response.item.item_type);
      setItemId(response.item.id);
      setName(response.item.name || "");
      setIcon(response.item.icon);
      setIsActive(response.item.is_active);
      setKitchenAvailable(response.item.kitchen_available !== false);
      setDescription(response.item.description || "");
      setIsBestSeller(response.item.best_seller);
      setCategory(response.item.category);
      b = response.item.category;
      defalutMenu = {
        label: response.item.category_name,
        value: response.item.category,
      };
      setCategoryList(response.categories);
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
          name: "Please Enter Item Name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "category") {
      if (value) {
        const error = {
          category: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          category: "Please select category name",
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
          name: "Please Enter Item Name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (inputName == "menu") {
      if (value) {
        const error = {
          category: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          menu: "Please enter category name",
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
          setIcon(value)
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          icon: "",
        };
        setIcon(value)
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };

  const handleUpdateItem = async () => {
    var allowDataPost = false;

    if ((name == null || name == "") && category == null && icon == null) {
      const error = {
        name: "Please Enter Item Name",
        category: "Please Select Category",
        icon: "Please Upload Image"
      };
      setValidationErrors({ ...validationErrors, ...error });
    } else {
      if (name == null || name == "") {
        const error = {
          name: "Please Enter Item Name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
      else if (category == null) {
        const error = {
          category: "Please Select Category",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
      else if (icon == null) {
        const error = {
          icon: "Please Upload Image"
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (
      name == null ||
      name == undefined ||
      name.trim() == "" ||
      category == null ||
      icon == null
    ) {
      allowDataPost = false;
    } else {
      if (itemId == null || itemId == undefined) {
        if (category == null || category == undefined) {
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
      validationErrors.category != ""
    ) {
      allowDataPost = false;
    }

    if (allowDataPost) {
      const saved = await saveItem({
        itemId,
        name,
        itemType,
        category,
        iconFile: selectedImage,
        isActive,
        fullPrice,
        halfPrice,
        isBestSeller,
        description,
        staffMode,
        kitchenAvailable,
      });
      if (saved && saved.ok) {
        Message("Item updated successfully.", "success");
        finish();
      } else {
        Message((saved && saved.error) || "The item was not saved.", "error");
      }
    } else {
    }
  };

  const resetItemForm = (event) => {
    setName(itemData.name ? itemData.name : "");
    setIcon(itemData.icon ? itemData.icon : null);
    setCategory(itemData.category ? itemData.category : null);
    setItemType(itemData.item_type ? itemData.item_type : "Other");
    setKitchenAvailable(itemData.kitchen_available !== false);
    setIsActive(
      itemData.is_active == true || itemData.is_active == false
        ? itemData.is_active
        : true
    );
    setIsBestSeller(
      itemData.best_seller == true || itemData.best_seller == false
        ? itemData.best_seller
        : false
    );
    setDescription(itemData.description ? itemData.description : "");
    setHalfPrice(itemData.price_half ? itemData.price_half : "");
    setFullPrice(itemData.price_full ? itemData.price_full : "");
    setSelectedImageName(null);
    setSelectedImage(null);
    setCategory(itemData.category ? itemData.category : null);
    document.getElementById("icon").value = "";

    const error = {
      name: "",
      category: "",
      icon: "",
      is_active: "",
      best_seller: "",
      description: "",
      price_full: "",
      price_half: "",
      item_type: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    const error = {
      category: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };

  const handleItemTypeChange = (value) => {
    setItemType(value);
  };

  const newArrayOfObj = categoryList.map(
    ({ name: label, id: value, ...rest }) => ({
      label,
      value,
      ...rest,
    })
  );

  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Add Item</div>
      </div>
      <form className={`${style.categorySection} staffItemsEditForm`}>
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
                  onBlur={(e) =>
                    validateOnBlur("name", e.target.value.toString())
                  }
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
                  <span className={style.mendatoryField}>* </span>Category name
                </div>

                <Select
                  placeholder="Please select category"
                  optionFilterProp="children"
                  value={category}
                  onChange={handleCategoryChange}
                  style={{
                    width: 200,
                    border: "1px solid black",
                    borderRadius: "7px",
                    fontSize: "18px",
                  }}
                  listHeight={190}
                >
                  {categoryList.map((items) => (
                    <Option value={items.id}>{items.name}</Option>
                  ))}
                </Select>

              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.category}
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Item type
                </div>
                <Select
                  placeholder="Please select item type"
                  optionFilterProp="children"
                  value={itemType}
                  onChange={handleItemTypeChange}
                  style={{
                    width: 200,
                    border: "1px solid black",
                    borderRadius: "7px",
                    fontSize: "18px",
                  }}
                  listHeight={190}
                >
                  <Option value="Other">Other</Option>
                  <Option value="Veg">Veg</Option>
                  <Option value="Nonveg">Nonveg</Option>
                </Select>
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div>

            <div className={`${style.inputArea} ${style.priceInput} rs-newrow`}>
              <div className={`${style.inputLabel}`}>
                <span className={style.mendatoryField}> &nbsp;&nbsp;</span>Full
                price
              </div>
              <input
                className={`${style.textInputBox}`}
                type="number"
                name="price_full"
                value={fullPrice}
                style={{ width: "200px" }}
                onChange={(e) => {
                  setFullPrice(e.target.value);
                  validateOnInput("fullPrice", e.target.value);
                }}
                onWheel={(e) => e.target.blur()}
                onBlur={(e) => validateOnBlur("fullPrice", e.target.value)}
                maxLength={30}
              />
            </div>

            <div className={`${style.inputArea} ${style.priceInput}`}>
              <div className={`${style.inputLabel}`}>
                <span className={style.mendatoryField}> &nbsp;&nbsp;</span>Half
                price
              </div>
              <input
                className={`${style.textInputBox}`}
                type="number"
                name="price_half"
                value={halfPrice}
                style={{ width: "200px" }}
                onChange={(e) => {
                  setHalfPrice(e.target.value);
                  validateOnInput("halfPrice", e.target.value);
                }}
                onWheel={(e) => e.target.blur()}
                onBlur={(e) => validateOnBlur("halfPrice", e.target.value)}
                maxLength={30}
              />
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.optionalField}>* </span>Is Active
                </div>
                <input
                  className={`${style.textInputBox} ${style.inputCheck}`}
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

            {<div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Kitchen Available</div>
                <input className={`${style.textInputBox} ${style.inputCheck}`} type="checkbox"
                  aria-label="Kitchen Available" style={{ width: "18px", height: "18px" }}
                  checked={kitchenAvailable} onChange={e => setKitchenAvailable(e.target.checked)} />
              </div>
            </div>}

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.optionalField}>* </span>Best seller
                </div>
                <input
                  className={`${style.textInputBox} ${style.inputCheck}`}
                  type="checkbox"
                  name="best_seller"
                  style={{ width: "18px", height: "18px" }}
                  checked={isBestSeller}
                  onChange={(e) => {
                    setIsBestSeller(e.target.checked);
                    validateOnInput("best_seller", e.target.value);
                  }}
                />
              </div>
            </div>

            <div className={`${style.inputContainer} rs-span`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  Description
                </div>
                <textarea
                  className={`${style.textInputBox}`}
                  type="text"
                  name="description"
                  value={description}
                  style={{ width: "200px", resize: "none", height: "100px" }}
                  onChange={(e) => {
                    setDescription(e.target.value.toString());
                    validateOnInput("description", e.target.value.toString());
                  }}
                  onBlur={(e) =>
                    validateOnBlur("description", e.target.value.toString())
                  }
                  maxLength={500}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
              </div>
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}></span>&nbsp;&nbsp;
                  Icon
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
                  <span className={style.mendatoryField}>* </span>Select new icon
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

        <div className={`${style.actionContainer} staffItemsFormActions`}>
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
              resetItemForm();
              window.scrollTo(0, 0);
            }}
          >
            Clear
          </div>

          <div
            className={` ${style.proceedButton}`}
            onClick={() => {
              handleUpdateItem();
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
export default EditItemForm;
