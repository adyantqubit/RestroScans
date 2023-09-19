/**
 * Created by - Pratap Sahu on 21-08-2023
 * Reason - To have Table Reservation Form
 */
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import {
  AiFillCalendar,
  AiOutlineCalendar,
  AiOutlineClose,
  AiOutlineSortAscending,
} from "react-icons/ai";
import { Message, enableHeader } from "../../App";
import React from "react";
import { json, useLocation, useNavigate } from "react-router-dom";
import style from "./ReservationForm.module.css";
import {
  // getReservationDetailsApi,
  updateReservationApi,
} from "../../Api/services";
import { useEffect, useState } from "react";
import { Select} from "antd";
const { Option} = Select;

const ReservationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [numberOfPerson, setNumberOfPerson] = useState(null);
  // Modified By Pratap Sahu on 14-09-2023
  // Reason:to save Empty data instead of null
  // const [specialInstructions, setSpecialInstructions] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  // End of Modification By Pratap Sahu on 14-09-2023
  // Reason:to save Empty data instead of null
  
  // Added by pratap sahu on 10-09-2023
  //to change the date formate into yyyy-mm-dd
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate1 = `${year}-${month}-${day}`;

  const [date, setDate] = useState(formattedDate1);
  // End of Addition by pratap sahu on 10-09-2023
  //to change the date formate into yyyy-mm-dd

  const [dateValidation, setDateValidation] = useState(false);
  const [time, setTime] = useState("12:00");
  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };
  const [tableNumber, setTableNumber] = useState(null);
  const [reservationStatusSelected, setReservationStatusSelected] = useState(
    "Pending");
  const [reservationDetails, setReservationDetails] = useState({});
  const [id, setId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    contact_number: "",
    numberOfPerson: "",
    date: "",
    time: "",
    table_number: "",
    reservation_status:""
  });

  /**
 * Added by - Pratap Sahu on 08-09-2023
 * Reason - To get specific customer's Reservation details
 */
  const getReservationDetails = async (response) => {
    if (response) {
      setReservationDetails(response);
      setId(response.id);
      setName(response.name);
      setEmail(response.email);
      setContactNumber(response.contact_number);
      setNumberOfPerson(response.number_of_person);
      setSpecialInstructions(response.special_instructions);
      setDate(response.date);
      setTime(response.time);
      setTableNumber(response.table_number);
      setReservationStatusSelected(response.reservation_status);
    }
  };
    /**
 * End of Addition by - Pratap Sahu on 08-09-2023
 * Reason - To get specific customer's Reservation details
 */
  
  /**
   * Added by - Pratap Sahu on 08-09-2023
   * Reason - method that will execute when page loads and then call api
   */
  useEffect(() => {
    enableHeader();
    window.scrollTo(0, 0);
    // if (location.state.id != null) {
    //   setId(location.state.id);
    // }
    if (location.state.data != null) {
      getReservationDetails(location.state.data);
    }
  }, []);
  /**
   * End of code addition by - Pratap Sahu on 08-09-2023
   * Reason - method that will execute when page loads and then call api
   */

  /**
   * Added by - Pratap Sahu on 08-09-2023
   * Reason - created api to save reservation details.After saving it will redirect to category list page.
   */
  const updateReservation = async () => {
    var allowDataPost = false;
    // added by Pratap sahu on 08-09-2023
    // Reason - to show validation message after clicking the clear and save
    if (
      name == null ||
      name == ""&& 
      email == null ||
      email == "" &&
      contactNumber == null ||
      contactNumber == "" &&
      numberOfPerson == null ||
      numberOfPerson == ""&&
      date == null ||
      date == "" &&
      time == null ||
      time == ""&& 
      tableNumber == null ||
      tableNumber == ""
    ) {
      const error = {
        name: "Please Enter Name",
        email: "Please Enter Email",
        contact_number: "Please Enter Contact Number",
        numberOfPerson: "Please Enter Number Of Person",
        table_number: "Please Enter Table Number",
      // Commented by Pratap sahu on 19-09-2023
      // Reason - No need,bydefault selected as 'Pending'
        // reservation_status:"please enter reservation status"
      // End of Comment by Pratap sahu on 19-09-2023
      // Reason - No need,bydefault selected as 'Pending'        
      };
      setValidationErrors({ ...validationErrors, ...error });
    }
     else {
      // Added by Pratap sahu on 08-09-2023
      // Reason - to show validation message after clicking the clear and save
      // Modified by pratap sahu on 18-09-2023 To fix bug on validation during submit
      if (name == null || name == "") {
        const error = {
          name: "Please Enter Customer name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
      // else if (email == null || email == "") {
        else if (email == null || email == "") {
          const error = {
          email: "Please Enter email",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
      // else if (contactNumber == null || contactNumber == "") {
        else if (contactNumber == null || contactNumber == "") {
          const error = {
          contact_number: "Please Enter contact Number",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
      // else if (numberOfPerson == null || numberOfPerson == "") {
        else if (numberOfPerson == null || numberOfPerson == "") {
          const error = {
          numberOfPerson: "Please Enter Number Of Person",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
      // else if (tableNumber == null || tableNumber == "") {
        else if (tableNumber == null || tableNumber == "") {
          const error = {
          table_number: "Please Enter Table Number",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
      // Modified by pratap sahu on 18-09-2023 To fix bug on validation during submit
      // End showing validation message by Pratap sahu on 08-09-2023
    }
    if (
      name == undefined ||
      email == undefined ||
      contactNumber == undefined ||
      numberOfPerson == undefined ||
      tableNumber == undefined ||
      date == null ||
      time == null ||
      reservationStatus == null
    ) {
      allowDataPost = false;
    } else {
      // To create new reservation
      if (id == null || id == undefined) {
        if (
          name == null ||
          name == "" ||
          email == null ||
          email == "" ||
          contactNumber == null ||
          contactNumber == "" ||
          numberOfPerson == null ||
          numberOfPerson == "" ||
          date == null ||
          date == "" ||
          time == null ||
          time == "" ||
          tableNumber == null ||
          tableNumber == "" ||
          reservationStatus == null ||
          reservationStatus == ""
        ) {
          allowDataPost = false;
        } else {
          allowDataPost = true;
        }
      } else {
        allowDataPost = true;
      }
    }
    if (allowDataPost) {
      const updatedReservationData = new FormData();
      if (id) {
        updatedReservationData.append("id", id);
      }
      updatedReservationData.append("name", name);
      updatedReservationData.append("email", email);
      updatedReservationData.append("contact_number", contactNumber);
      updatedReservationData.append("table_number", tableNumber);
      updatedReservationData.append("number_of_person", numberOfPerson);
      updatedReservationData.append("date", date);
      updatedReservationData.append("time", time);
      updatedReservationData.append("reservation_status", reservationStatusSelected);
      updatedReservationData.append("special_instructions",specialInstructions)

      const tenant = JSON.parse(localStorage.getItem("tenantInfo")).tenant_name;
      const response = await updateReservationApi(
        tenant,
        updatedReservationData
        );
      if (response.msg) {
        Message("Reservation saved successfully.", "success");
        navigate(-1);
      } else {
        Message("Something went wrong", "error");
      }
    }
    /**
     * End of code addition by - Pratap sahu on 08-09-2023
     * Reason - created api to save category. After saving the category it will redirect to category list page.
     */
   };

  var reservationStatus = [
    { key: "Pending", value: "Pending" },
    { key: "Confirm", value: "Confirm" },
  ];

  /**
   * Added by - Pratap sahu on 08-09-2023
   * Reason -  method to validate inputs when user is filling data on the Field
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
          name: "Please Enter your name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    if (inputName == "contact_number") {
      if (value.toString().length > 0) {
        if (isNaN(value)) {
          const error = {
            contact_number: "contact number must be digits only",
          };
          setValidationErrors({ ...validationErrors, ...error });
        } else {
          const error = {
            contact_number: "",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          contact_number: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    // Added And Commented by pratap sahu on 18-09-2023
    // Reason: To have on change validation on these fields

    // if (inputName == "reservationStatus") {
    //   if (name != null || value) {
    //     const error = {
    //       reservationStatus: "",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   } else {
    //     const error = {
    //       reservationStatus: "Please Enter your name",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   }
    // }
    if (inputName == "email") {
      if (email != null || value) {
        const error = {
          email: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          email: "Please Enter your mail",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    if (inputName == "numberOfPerson") {
      if (numberOfPerson != null || value) {
        const error = {
          numberOfPerson: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          numberOfPerson: "Please Enter The Number of person ",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    if (inputName == "tableNumber") {
      if (tableNumber != null || value) {
        const error = {
          table_number: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          table_number: "Please Enter The Table Number",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    // End of Addition by pratap sahu on 18-09-2023
    // Reason: To have on change validation on these fields
  };
    /**
   * End of Addition by - Pratap sahu on 08-09-2023
   * Reason -  method to validate inputs when user is filling data on the Field
   */

  /**
   * Added by -Pratap sahu on 08-09-2023
   * Reason -  method to validate inputs when input is focused out
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
          name: "Please Enter your name",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    if (inputName == "contact_number") {
      if (value.toString().length > 0) {
        if (!isNaN(value)) {
          if (value.toString().length != 10) {
            const error = {
              contact_number: "contact number must be 10 digits long",
            };
            setValidationErrors({ ...validationErrors, ...error });
          } else {
            const error = {
              contact_number: "",
            };
            setValidationErrors({ ...validationErrors, ...error });
          }
        } else {
          const error = {
            contact_number: "contact number must be digits only",
          };
          setValidationErrors({ ...validationErrors, ...error });
        }
      } else {
        const error = {
          contact_number: "Please Enter Contact Number",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    if (inputName == "email") {
      if (email != null || value) {
        const error = {
          email: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          email: "Please Enter your email",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    //Commented By pratap sahu on 18-09-2023
    // Reason:bydefault date is selected,so no need to validate
    // if (inputName == "date") {
    //   if (date != null || value) {
    //     const error = {
    //       date: "",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   } else {
    //     const error = {
    //       date: "Please Enter date",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   }
    // }
    //Commented By pratap sahu on 18-09-2023
    // Reason:bydefault date is selected,so no need to validate
    if (inputName == "numberOfPerson") {
      if (numberOfPerson != null || value) {
        const error = {
          numberOfPerson: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          numberOfPerson: "Please Enter number of Person",
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
    //Commented By pratap sahu on 18-09-2023
    // Reason:bydefault time is selected,so no need to validate
    // if (inputName == "time") {
    //   if (time != null || value) {
    //     const error = {
    //       time: "",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   } else {
    //     const error = {
    //       time: "Please Enter time",
    //     };
    //     setValidationErrors({ ...validationErrors, ...error });
    //   }
    // }
    //end of comment By pratap sahu on 18-09-2023
    // Reason:bydefault time is selected,so no need to validate
    if (inputName == "tableNumber") {
      if (tableNumber != null || value) {
        const error = {
      //commented By pratap sahu on 18-09-2023
    // Reason:correction in table number to validate when focused out
          // tableNumber: "",
          table_number: "",
        };
        setValidationErrors({ ...validationErrors, ...error });
      } else {
        const error = {
          // tableNumber: "Please Enter Table Number",
          table_number: "Please Enter Table Number",
      //end of comment By pratap sahu on 18-09-2023
    // Reason:correction in table number to validate when focused out      
        };
        setValidationErrors({ ...validationErrors, ...error });
      }
    }
  }; 
  /**
  * End of Addition by -Pratap sahu on 08-09-2023
  * Reason -  method to validate inputs when input is focused out
  */

  // Added By Pratap Sahu on 08-09-2023
  // Reason: To clear the Currrent Changes from the Reservation Form Fields
  const resetReservationForm = (event) => {
    setName(reservationDetails.name ? reservationDetails.name : "");
    setContactNumber(
      reservationDetails.contact_number ? reservationDetails.contact_number : ""
    );
    setEmail(reservationDetails.email ? reservationDetails.email : "");
    setNumberOfPerson(
      reservationDetails.number_of_person
        ? reservationDetails.number_of_person
        : ""
    );
    setSpecialInstructions(
      reservationDetails.special_instructions
        ? reservationDetails.special_instructions
        : ""
    );
    setDate(reservationDetails.date ? reservationDetails.date : formattedDate1);
    setTime(reservationDetails.time ? reservationDetails.time : "12:00");
    setTableNumber(
      reservationDetails.table_number ? reservationDetails.table_number : ""
    );
    setReservationStatusSelected(
      reservationDetails.reservation_status
        ? reservationDetails.reservation_status
        // Modified By pratap Sahu on 13-09-2023 
        // : "pending"
        : "Pending"
        // Modified By pratap Sahu on 13-09-2023 

    );
    /**
     * Added by Pratap Sahu on 10-09-2023
     * Reason - to clear the validation message
     */
    const error = {
      name: "",
      email: "",
      contact_number: "",
      numberOfPerson:"",
      table_number: "",
    };
    setValidationErrors({ ...validationErrors, ...error });
    /**
     * End of Addition by Pratap Sahu on 10-09-2023
     * Reason - to clear the validation message
     */
  };
  return (
    <div className={style.container}>
      <div className={style.titleContainer}>
        <div className={style.pageTitle}>Reservation Form</div>
      </div>
      {/* Form */}
      <form className={style.categorySection}>
        <div className={style.formContainer}>
          <div className={`${style.sectionInsideForm}`}>
          {/* Name */}
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
            {/* Email */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Email
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="email"
                  value={email}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setEmail(e.target.value.toString());
                    validateOnInput("email", e.target.value.toString());
                  }}
                  onBlur={(e) =>
                    validateOnBlur("email", e.target.value.toString())
                  }
                  maxLength={30}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.email}
              </div>
            </div>
              {/* Contact Number */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Contact Number
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="number"
                  name="contact_number"
                  value={contactNumber}
                  style={{ width: "200px" }}
                  onFocus={(e) => {
                    if (contactNumber?.toString().length == 13)
                      setContactNumber(contactNumber.substring(3, 13));
                  }}
                  onChange={(e) => {
                    setContactNumber(e.target.value.toString());
                    validateOnInput(
                      "contact_number",
                      e.target.value.toString()
                    );
                  }}
                  onBlur={(e) =>
                    validateOnBlur("contact_number", e.target.value.toString())
                  }
                  maxLength={13}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.contact_number}
              </div>
            </div>
            {/* Number Of Person */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Number Of
                  Person
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="number"
                  name="number_of_person"
                  value={numberOfPerson}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setNumberOfPerson(e.target.value.toString());
                    validateOnInput(
                      "numberOfPerson",
                      e.target.value.toString()
                    );
                  }}
                  onBlur={(e) =>
                    validateOnBlur("numberOfPerson", e.target.value.toString())
                  }
                  maxLength={30}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.numberOfPerson}
              </div>
            </div>
            {/* Special Instruction */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>Special Instruction</div>
                <textarea
                  className={`${style.InstrArea}`}
                  name="specialInstruction"
                  value={specialInstructions}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setSpecialInstructions(e.target.value.toString());
                    validateOnInput(
                      "specialInstructions",
                      e.target.value.toString()
                    );
                  }}
                  maxLength={255}
                />
              </div>
            </div>
            {/* Date */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Date
                </div>
                <div className={style.datepicker1}>
                     <DatePicker
                    calendarClassName={style.calendar}
                    className={style.dateInput}
                    calendarIcon={<AiOutlineCalendar />}
                    clearIcon={<AiOutlineClose />}
                    onChange={(value) => {
                       var date = new Date(value);
                       var day = date.getDate(); // day (1-31)
                       var month = date.getMonth() + 1; // month (0-11), added 1 to make(1-12)
                       var year = date.getFullYear(); // 1995

                       var formattedDay = String(day).padStart(2, '0');
                       var formattedMonth = String(month).padStart(2, '0');
                       var formattedDate = year + '-' + formattedMonth  + '-' + formattedDay;
                       setDateValidation(false);
                       setDate(formattedDate);
                    }}
                    value={date}
                    format="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </div>
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.date}
              </div>
            </div>
            {/* Time */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Time
                </div>
                <TimePicker
                  // style={"${style.time}"}
                  onChange={handleTimeChange}
                  value={time}
                  disableClock={true}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.time}
              </div>
            </div>
            {/* Table Number */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Table Number
                </div>
                <input
                  className={`${style.textInputBox}`}
                  type="text"
                  name="tableNumber"
                  value={tableNumber}
                  style={{ width: "200px" }}
                  onChange={(e) => {
                    setTableNumber(e.target.value.toString());
                    validateOnInput("tableNumber", e.target.value.toString());
                  }}
                  onBlur={(e) =>
                    validateOnBlur("tableNumber", e.target.value.toString())
                  }
                  maxLength={30}
                />
              </div>
              <div className={`${style.inputErrorArea}`}>
                {validationErrors.table_number}
              </div>
            </div>
            {/* Reservation Status */}
            <div className={`${style.inputContainer}`}>
              <div className={`${style.inputArea}`}>
                <div className={`${style.inputLabel}`}>
                  <span className={style.mendatoryField}>* </span>Reservation
                  Status
                </div>
                <Select
                  className={`${style.textInputBox}`}
                  // type="option"
                  name="status"
                  value={reservationStatusSelected}
                  style={{width: 200, border: "1px solid black", borderRadius: "7px", fontSize: "18px"}}
                  data={reservationStatusSelected}
                  // touchUi={false}
                  // inputComponent="input"
                  onChange={(value) => {
                    setReservationStatusSelected(value.toString());
                    validateOnInput(
                      "reservationStatus",
                      value.toString()
                    );
                  }}
                  >
                  {reservationStatus.map((data) => {
                    return (
                      <Option
                        // key={index}
                        name={data.key}
                        selected={data.key == reservationStatusSelected}
                        value={data.key}>
                        {data?.key}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className={style.actionContainer}>
            <div
              className={` ${style.backButton}`}
              style={{
                marginRight: "10px",
              }}
              onClick={(e) => {
                navigate("/Dashboard");
              }}>
              Back
            </div>

            <div
              className={` ${style.cancelButton}`}
              style={{
                marginRight: "10px",
              }}
              onClick={(e) => {
                resetReservationForm();
                window.scrollTo(0, 0);
              }}>
              Clear
            </div>

            <div
              className={` ${style.proceedButton}`}
              onClick={() => {
                updateReservation();
                window.scrollTo(0, 0);
              }}>
              Save
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ReservationForm;
