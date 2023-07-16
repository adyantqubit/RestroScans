/**
 * Added by - Yuvraj Sahu on 01-07-2023
 * Reason - created form to get user input for item details
 */
import { useEffect, useState } from "react";
import style from "./editItemForm.module.css";
import Header from "../GlobalComponent/Header";
import {
  getMenuDetails,
  postMenuDetails,
  getCategoryDetails,
  postCategoryDetails,
  getMenusAPI,
  getCategoriesAPI,
  getItemDetails,
  postItemDetails,
} from "../../Api/services";
import { Message, enableHeader } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../Api/config";
import { Select } from "antd";
const { Option } = Select;

function EditItemForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [itemData, setItemData] = useState({});
  const [itemId, setItemId] = useState(null);
  const [name, setName] = useState(null);
  /**
   * Added by Yuvraj Sahu on 15-07-2023
   * Reason - to set more fields for default value
   */
  const [fullPrice, setFullPrice] = useState(null);
  const [halfPrice, setHalfPrice] = useState(null);
  const [description, setDescription] = useState(null);
  /**
   * End of addition by Yuvraj Sahu 15-07-2023
   */
  const [icon, setIcon] = useState(null);
  const [isActive, setIsActive] = useState(true);
  /**
   * Added by Yuvraj Sahu on 15-07-2023
   * Reason - to set the best seller
   */
  const [isBestSeller, setIsBestSeller] = useState(false);
  /**
   * End of addition by Yuvraj Sahu on 15-07-2023
   */
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState(null);
  /**
   * Added by Yuvraj Sahu on 16-07-2023
   * Reason - to set and use the item type
   */
  const [itemType, setItemType] = useState("Other");
  /**
   * End of addition by yuvraj Sahu on 16-07-2023
   */

  /**
   * Added by yuvraj sahu on 15-07-2023
   * Reason - to set category name for dropdown
   */
  var [menuName, setMenuName] = useState(null);
  /**
   * End of addition by yuvraj Sahu on 24-06-2023
   */
  var defalutMenu = { label: null, value: null };
  var b;

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    category: "",
    icon: "",
    is_active: "",
    best_seller: "",
    description: "",
    price_full: "",
    price_half: "",
    item_type: "",
  });

  /**
   * Added by - Yuvraj Sahu on 17-06-2023
   * Reason - method that will execute when page loads and then call api
   */
  useEffect(() => {
    // Added By Rohan Kansari - 25/6/23
    // Reason - To enable headerSiderbar
    enableHeader();
    // End of code - Rohan kansari - 25/6/23

    window.scrollTo(0, 0);
    if (location.state.id != null) {
      setItemId(location.state.id);
    }
  }, []);

  useEffect(() => {
    if (itemId) {
      getItemData();
    } else {
      getCategories();
    }
  }, [itemId]);
  /**
   * End of code addition by - Yuvraj Sahu on 17-06-2023
   * Reason - method that will execute when page loads and then call api
   */

  /**
   * Added by Yuvraj Sahu on 01-07-2023
   * Reason - calling api to get all categories for set dropdown
   */
  const getCategories = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getCategoriesAPI(tenant);
    if (response.msg) {
      setCategoryList(response.categoryList);
    }
  };
  /**
   * End of addition by Yuvraj Sahu on 01-07-2023
   */

  /**
   * Added by - Yuvraj Sahu on 16-07-2023
   * Reason - created api that will get item data
   */
  const getItemData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getItemDetails(tenant, itemId);
    if (response.item) {
      setItemData(response.item);
      /**
       * Added by Yuvraj Sahu on 15-07-2023
       * Reason - to set more fields value for default
       */
      setFullPrice(response.item.price_full);
      setHalfPrice(response.item.price_half);
      setItemType(response.item.item_type);
      /**
       * End of addtion by Yuvraj Sahu on 15-07-2023
       */
      setItemId(response.item.id);
      setName(response.item.name);
      setIcon(response.item.icon);
      setIsActive(response.item.is_active);
      setDescription(response.item.description);
      /**
       * Added by Yuvraj Sahu on 15-07-2023
       * Reason - to set best seller for default
       */
      setIsBestSeller(response.item.best_seller);
      /**
       * End of addition by Yuvraj Sahu on 15-07-2023
       */
      setCategory(response.item.category);
      /**
       * Added by yuvraj sahu on 15-07-2023
       * Reason - to set category name for dropdown
       */
      // setMenuName(response.category.menu_name)
      b = response.item.category;
      defalutMenu = {
        label: response.item.category_name,
        value: response.item.category,
      };
      /**
       * End of addition by yuvraj Sahu on 15-07-2023
       */
      setCategoryList(response.categories);
    }
  };
  /**
   * End of code addition by - Yuvraj Sahu on 17-06-2023
   * Reason - created api that will get category data
   */

  /**
   * Added by - Yuvraj Sahu on 17-06-2023
   * Reason -  method to validate inputs when input is focused out
   */
  /**
   * Added by Yuvraj Sahu on 16-07-2023
   * Reason - to validate input when we go back input
   */
  const validateOnBlur = (inputName, value) => {
    if (inputName == "name") {
      if (name != null || value) {
        const error = {
          name: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          name: "Please enter item name",
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
          menu: "Please select category name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  };
  /**
   * End of addition by Yuvraj Sahu on 18-06-2023
   */
  /**
   * End of code addition by - Yuvraj Sahu on 17-06-2023
   * Reason -  method to validate inputs when input is focused out
   */

  /**
   * Added by - Yuvraj Sahu on 17-06-2023
   * Reason - method to validate inputs when user is entering some data
   */
  const validateOnInput = (inputName, value) => {
    if (inputName == "name") {
      if (name != null || value) {
        const error = {
          name: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          name: "Please enter item name",
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
  /**
   * End of code addition by - Yuvraj Sahu on 17-06-2023
   * Reason -  method to validate input when user is entering some data
   */

  /**
   * Added by - Yuvraj Sahu on 17-06-2023
   * Reason - method to validate image when user is entering some data
   */
  const validateOnFileInput = (inputName, value) => {
    if (inputName == "icon") {
      if (value != null && value != undefined) {
        if (value.size / 1024 > 200) {
          const error = {
            icon: "File size must be below 200 KB",
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
  /**
   * End of code addition by - Yuvraj Sahu on 17-06-2023
   * Reason -  method to validate images when user is entering some data
   */

  /**
   * Added by - Yuvraj Sahu on 17-06-2023
   * Reason - created api to save category. After saving the category it will redirect to category list page.
   */
  const handleUpdateItem = async () => {
    var allowDataPost = false;

    // Commeted and modified by yuvraj sahu on 23-06-2023
    // Reason - to show validation message after clicking the clear and save
    // if (name == null && menu == null) {
    if (name == null || (name == "" && category == null)) {
      // End showing validation message by Yuvraj Sahu on 23-06-2023
      const error = {
        name: "Please enter item name",
        category: "Please enter category name",
      };
      setValidationErrors({ ...validationErrors, ...error });
    } else {
      // Commeted and modified by yuvraj sahu on 23-06-2023
      // Reason - to show validation message after clicking the clear and save
      // if (name == null) {
      if (name == null || name == "") {
        // End showing validation message by Yuvraj Sahu on 23-06-2023
        const error = {
          name: "Please enter item name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }

      if (category == null) {
        const error = {
          menu: "Please enter category name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }

    if (
      name == null ||
      name == undefined ||
      name.trim() == "" ||
      category == null
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
      // Modified by yuvraj Sahu on Yuvraj Sahu on 16-07-2023
      // Reason - to add change and add more fields
      const updatedItemData = new FormData();
      if (itemId) {
        updatedItemData.append("id", itemId);
      }
      updatedItemData.append("name", name);
      updatedItemData.append("item_type", itemType);
      updatedItemData.append("category", category);
      if (selectedImage != null || selectedImage != undefined) {
        updatedItemData.append("icon", selectedImage);
      }
      updatedItemData.append("is_active", isActive);
      if (fullPrice != null || fullPrice != undefined){
      updatedItemData.append("price_full", fullPrice);
      }
      if (halfPrice != null || halfPrice != undefined){
      updatedItemData.append("price_half", halfPrice);
      }
      updatedItemData.append("best_seller", isBestSeller);
      if (description != null || description != undefined){
      updatedItemData.append("description", description);
      }

      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await postItemDetails(tenant, updatedItemData);
      if (response.msg) {
        Message("Item updated successfully.", "success");
        navigate(-1);
      } else {
        Message("Something went wrong", "error");
      }
    } else {
      // Message("Please provide values for all mendatory fields", "info");
    }

    /**
     * End of code addition by - Yuvraj Sahu on 17-06-2023
     * Reason - created api to save category. After saving the category it will redirect to category list page.
     */
  };

  /**
   * Added by - Yuvraj Sahu on 17-07-2023
   * Reason - Method to reset item form
   */
  const resetItemForm = (event) => {
    setName(itemData.name ? itemData.name : "");
    setIcon(itemData.icon ? itemData.icon : null);
    setCategory(itemData.category ? itemData.category : null);
    setItemType(itemData.item_type ? itemData.item_type : "Other");
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
    setHalfPrice(itemData.price_half ? itemData.price_half : null);
    setFullPrice(itemData.price_full ? itemData.price_full : null);
    setSelectedImageName(null);
    setSelectedImage(null);
    /**
     * Modification by Yuvraj Sahu on 18-06-2023
     * Reason - to set default value of menu
     */
    setCategory(itemData.category ? itemData.category : null);
    // Commeted by yuvraj Sahu on 28-06-2023
    // Reason - to replace dropdown with antd select
    // if (!itemData.menu) {
    //   document.getElementById("menuDropdown").selectedIndex = 0;
    // }
    // end of commet by Yuvraj Sahu on 29-06-2023
    /**
     * End of addition by Yuvraj Sahu on 18-06-2023
     */
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
  /**
   * End of code addition by - Yuvraj Sahu on 17-06-2023
   * Reason - To reset category form
   */

  /**
   * Added by Yuvraj Sahu on 24-06-2023
   * Reason - to set dropdown value
   */
  const handleCategoryChange = (value) => {
    setCategory(value);
    // setValidationErrors({menu: ""})
    const error = {
      category: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };

  /**
   * Added by Yuvraj Sahu on 16-07-2023
   * Reason - to set dropdown value of item type
   */
  const handleItemTypeChange = (value) => {
    setItemType(value);
    // setValidationErrors({menu: ""})
    // const error = {
    //   menu: "",
    // };
    // setValidationErrors({ ...validationErrors, ...error });
  };
  /**
   * End of addition by yuvraj Sahu on 16-07-2023
   */

  const newArrayOfObj = categoryList.map(
    ({ name: label, id: value, ...rest }) => ({
      label,
      value,
      ...rest,
    })
  );
  /**
   * End of addition by yuvraj Sahu on 24-06-2023
   */

  var [defaultValueData, setDefaultValueData] = useState(10);

  return (
    // Modified by Rohan Kansari - 25/6/23
    // Reason - removing header from each page and making it global
    // <Header>
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Edit Item</div>
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
                  // Added by Yuvraj Sahu on 18-06-2023
                  // Reason - to validate input go out side
                  onBlur={(e) =>
                    validateOnBlur("name", e.target.value.toString())
                  }
                  // End of addition by Yuvraj Sahu on 18-06-2023
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

                {/* Added by Yuvraj sahu on 24-06-2023
                  Reason - to have dropdown for menu */}
                {/* {alert(itemData.menu_name)} */}
                <Select
                  // showSearch
                  // onChange={getStateName}
                  placeholder="Please select category"
                  optionFilterProp="children"
                  // defaultValue={menu}
                  value={category}
                  // onChange={()=> {setCategory(); setValidationErrors({menu: ""})}}
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

                {/* End of adfdition by Yuvraj sahu on 24-06-2023 */}
                {/* <select
                  // Added by Yuvraj Sahu on 18-06-2023
                  // Reason - to give id for reset dropdown
                    id="menuDropdown"
                  // End of addition by Yuvraj Sahu on 18-06-2023
                    className={`${style.textInputBox}`}
                    name="category"
                    style={{ width: "200px" }}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      validateOnInput("menu", e.target.value);
                    }}
                  >
                    <option disabled selected value>
                      {" "}
                      select menu{" "}
                    </option>
                    {categoryList.map((data, index) => {
                      return (
                        <option
                          key={index}
                          name={data.id}
                          selected={data.id == category}
                          value={data.id}
                        >
                          {data.name}
                        </option>
                      );
                    })}
                  </select> */}
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.menu}
              </div>
            </div>

            {/* Added by yuvraj Sahu on 16-07-2023
              Reason - to select the item type */}
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
                  {/* {categoryList.map((items) => ( */}
                  <Option value="Other">Other</Option>
                  <Option value="Veg">Veg</Option>
                  <Option value="Nonveg">Nonveg</Option>
                  {/* ))} */}
                </Select>
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.menu}
              </div>
            </div>
            {/* End of addition by yuvraj Sahu on 16-07-2023 */}

            <div className={`${style.inputArea} ${style.priceInput}`}>
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
                // Added by Yuvraj Sahu on 15-07-2023
                // Reason - to validate input go out side
                onBlur={(e) => validateOnBlur("fullPrice", e.target.value)}
                // End of addition by Yuvraj Sahu on 18-06-2023
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
                // Added by Yuvraj Sahu on 15-07-2023
                // Reason - to validate input go out side
                onBlur={(e) => validateOnBlur("halfPrice", e.target.value)}
                // End of addition by Yuvraj Sahu on 18-06-2023
                maxLength={30}
              />
            </div>

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.optionalField}>* </span>Is Available
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
              {/* <div className={`${style.inputErrorArea}`}>
                  {validationErrors.best_seller}
                </div> */}
            </div>

            {/* Added by Yuvraj Sahu on 16-07-2023
            Reason - to add description  */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>&nbsp;&nbsp;</span>
                  Description
                </div>
                <textarea
                  className={`${style.textInputBox}`}
                  type="text"
                  name="description"
                  value={description}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setDescription(e.target.value.toString());
                    validateOnInput("description", e.target.value.toString());
                  }}
                  onBlur={(e) =>
                    validateOnBlur("description", e.target.value.toString())
                  }
                  maxLength={30}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {/* {validationErrors.name} */}
              </div>
            </div>
            {/* End of addition by Yuvraj Sahu on 16-07-2023 */}

            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  {/* Modified by Yuvraj Sahu on 18-06-2023
                    Reason - to remove mandatory */}
                  <span className={style.mendatoryField}></span>&nbsp;&nbsp;
                  Icon
                  {/* End of modification by Yuvraj Sahu on 18-06-2023 */}
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
                  <span className={style.optionalField}>* </span>Select new icon
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
              navigate(-1);
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
    //</Header>
  );
}
export default EditItemForm;
