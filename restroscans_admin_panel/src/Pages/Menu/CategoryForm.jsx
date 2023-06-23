/**
 * Added by - Yuvraj Sahu on 17-06-2023
 * Reason - created form to get user input for category details
 */
import { useEffect, useState } from "react";
import style from "./categoryForm.module.css";
import Header from "../GlobalComponent/Header";
import {
  getMenuDetails,
  postMenuDetails,
  getCategoryDetails,
  postCategoryDetails,
  getMenusAPI,
} from "../../Api/services";
import { Message } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../Api/config";

function CategoryForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryData, setCategoryData] = useState({});
  const [categoryId, setCategoryId] = useState(null);
  const [name, setName] = useState(null);
  const [icon, setIcon] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [menu, setMenu] = useState(null);

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    menu: "",
    icon: "",
    is_active: "",
  });

  /**
   * Added by - Yuvraj Sahu on 17-06-2023
   * Reason - method that will execute when page loads and then call api
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state.id != null) {
      setCategoryId(location.state.id);
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      getCategoryData();
    } else {
      getMenus();
    }
  }, [categoryId]);
  /**
   * End of code addition by - Yuvraj Sahu on 17-06-2023
   * Reason - method that will execute when page loads and then call api
   */

  /**
   * Added by Yuvraj Sahu on 17-06-2023
   * Reason - calling api to get all menus for set dropdown
   */
  const getMenus = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getMenusAPI(tenant);
    if (response.msg) {
      setMenuList(response.menus);
    }
  };
  /**
   * End of addition by Yuvraj Sahu on 17-06-2023
   */

  /**
   * Added by - Yuvraj Sahu on 17-06-2023
   * Reason - created api that will get category data
   */
  const getCategoryData = async () => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
    const response = await getCategoryDetails(tenant, categoryId);
    if (response.category) {
      setCategoryData(response.category);
      setCategoryId(response.category.id);
      setName(response.category.name);
      setIcon(response.category.icon);
      setIsActive(response.category.is_active);
      setMenu(response.category.menu);
      setMenuList(response.menus);
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
   * Added by Yuvraj Sahu on 18-06-2023
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
  const saveCategory = async () => {
    var allowDataPost = false;

    // Commeted and modified by yuvraj sahu on 23-06-2023
    // Reason - to show validation message after clicking the clear and save
    // if (name == null && menu == null) {
    if (name == null || name == "" && menu == null) {
    // End showing validation message by Yuvraj Sahu on 23-06-2023
      const error = {
        name: "Please enter category name",
        menu: "Please enter menu name",
      };
      setValidationErrors({ ...validationErrors, ...error });
    } else {
      // Commeted and modified by yuvraj sahu on 23-06-2023
      // Reason - to show validation message after clicking the clear and save
      // if (name == null) {
      if (name == null || name == "") {
      // End showing validation message by Yuvraj Sahu on 23-06-2023
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
      const updatedCategoryData = new FormData();
      if (categoryId) {
        updatedCategoryData.append("id", categoryId);
      }
      updatedCategoryData.append("name", name);
      updatedCategoryData.append("menu", menu);
      if (selectedImage != null || selectedImage != undefined) {
        updatedCategoryData.append("icon", selectedImage);
      }
      updatedCategoryData.append("is_active", isActive);

      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await postCategoryDetails(tenant, updatedCategoryData);
      if (response.msg) {
        Message("Category saved successfully.", "success");
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
   * Added by - Yuvraj Sahu on 17-06-2023
   * Reason - Method to reset category form
   */
  const resetCategoryForm = (event) => {
    setName(categoryData.name ? categoryData.name : "");
    setIcon(categoryData.icon ? categoryData.icon : "");
    setIsActive(categoryData.is_active ? categoryData.is_active : true);
    setSelectedImageName(null);
    setSelectedImage(null);
    /**
     * Modification by Yuvraj Sahu on 18-06-2023
     * Reason - to set default value of menu
     */
    setMenu(categoryData.menu ? categoryData.menu : null);
    if (!categoryData.menu) {
      document.getElementById("menuDropdown").selectedIndex = 0;
    }
    /**
     * End of addition by Yuvraj Sahu on 18-06-2023
     */
    document.getElementById("icon").value = "";

    const error = {
      name: "",
      icon: "",
      is_active: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
  };
  /**
   * End of code addition by - Yuvraj Sahu on 17-06-2023
   * Reason - To reset category form
   */

  return (
    <Header>
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
                    // Added by Yuvraj Sahu on 18-06-2023
                    // Reason - to validate input go out side
                    onBlur={(e) => validateOnBlur("name", e.target.value.toString())}
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
                    <span className={style.mendatoryField}>* </span>Menu name
                  </div>
                  <select
                  // Added by Yuvraj Sahu on 18-06-2023
                  // Reason - to give id for reset dropdown
                    id="menuDropdown"
                  // End of addition by Yuvraj Sahu on 18-06-2023
                    className={`${style.textInputBox}`}
                    name="menu"
                    style={{ width: "200px" }}
                    onChange={(e) => {
                      setMenu(e.target.value);
                      validateOnInput("menu", e.target.value);
                    }}
                  >
                    <option disabled selected value>
                      {" "}
                      select menu{" "}
                    </option>
                    {menuList.map((data, index) => {
                      return (
                        <option
                          key={index}
                          name={data.id}
                          selected={data.id == menu}
                          value={data.id}
                        >
                          {data.name}
                          {/* {data?.background_color_label} ,{" "}
                          {data.heading_color_label} */}
                        </option>
                      );
                    })}
                  </select>
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
                    {/* Modified by Yuvraj Sahu on 18-06-2023
                    Reason - to remove mandatory */}
                    <span className={style.mendatoryField}></span>&nbsp;&nbsp; Icon
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
    </Header>
  );
}
export default CategoryForm;
