import * as yup from "yup";

const contactRegExp = /^[6789]\d{9}$/;
const passwordRegExp = /^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,15})/;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    // added by - Suman sahu  On 10/05/2023
    // reason - add trim method for trim white space in email input
    .trim()
    // End of addition 10/05/2023
    .email("Please enter valid email!")
    .required("Email address is required!"),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters!`)
    // .max(20, ({ max }) => `Password is Too Long!`)
    .required("Password is required!")
    .matches(/^(?!\s+$).*/, "Password cannot contain only blankspaces!"),
});

// Added by yuvraj Sahu on 20-2-2023
// Reason - to validate email and password
export const emailSchema = yup.object().shape({
  email: yup
    .string()
    // added by - Suman sahu  On 10/05/2023
    // reason - add trim method for trim white space in email input
    .trim()
    // End of addition 10/05/2023
    .email("Please enter valid email!")
    .required("Email address is required!"),
});

export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters!`)
    // .max(20, ({ max }) => `Password is Too Long!`)
    .required("Password is required!")
    .matches(/^(?!\s+$).*/, "Password cannot contain only blankspaces!"),
});

export const forgetPasswordSchema = yup.object().shape({
  // email: yup
  //   .string()
  //   .email("Please enter valid email!")
  //   .required("Email address is required!"),

  // Added by- Suman sahu  On 24/04/2023
  // Reason- for add error msg on "OTP" input field

  otp: yup
    .string()
    .min(4, ({ min }) => `OTP must be at least ${min} digits!`)
    .max(4, ({ max }) => `OTP contain only ${max} digits!`)
    .required("OTP is required!"),

  // End of added code 24/04/2023

  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters!`)
    // .max(20, ({ max }) => `Password is Too Long!`)
    .required("Password is required!")
    .matches(/^(?!\s+$).*/, "Password cannot contain only blankspaces!"),
  confirm_password: yup
    .string()
    // .min(8, ({ min }) => `Confirm Password must be at least ${min} characters!`)
    // .max(20, ({ max }) => `Password must be at least ${max} characters`)
    .required("Confirm Password is required!")
    .oneOf(
      [yup.ref("password"), null],
      "Password and confirm password should be same!"
    )
    .matches(
      /^(?!\s+$).*/,
      "Confirm Password cannot contain only blankspaces!"
    ),
});

// End of addition

export const registrationSchema = yup.object().shape({
  // Modified by- Suman sahu On 24/04/2023
  // Reason - Add validations on the registration page

  // firstName: yup
  //   .string()
  //   .required("First Name is required!")
  //   .matches(/^(?!\s+$).*/, "First Name cannot contain only blankspaces!"),

  // lastName: yup
  //   .string()
  //   .required("Last Name is required!")
  //   .matches(/^(?!\s+$).*/, "Last Name cannot contain only blankspaces!"),

  // gender: yup.string(),
  // .required("Gender is required!"),

  // dateOfBirth: yup.string().required("Date Of Birth is required!"),

  // End of commented code 24/04/2023

  owner_name: yup
    .string()
    .required("Owner name is required!")
    .matches(/^(?!\s+$).*/, "Owner name cannot contain only blankspaces!"),

  restaurant_name: yup
    .string()
    .required("Restaurant name is required!")
    .matches(/^(?!\s+$).*/, "Restaurant name cannot contain only blankspaces!"),

  // modify by - Suman sahu  On 10/05/2023
  // reason - add trim method for trim white space in email input
  email: yup
    .string()
    .trim()
    .email("Email is invalid!")
    .required("Email is required!"),
  // end of modification 10/05/2023

  // Commented by:- Suman sahu  On 24/04/2023

  // contactNumber: yup
  //   .string()
  //   // .min(10, ({ min }) => `Password must be ${min} numbers!`)
  //   // .max(12, ({ max }) => `Password must be ${max} numbers!`)
  //   .matches(contactRegExp, "Please enter valid contact number!")
  //   .required("Contact Number is required!"),

  // End of commented code 24/04/2023

  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters!`)
    .required("Password is required!"),
  // .matches(/^(?!\s+$).*/, "Password cannot contain only blankspaces!")
  // .matches(passwordRegExp, 'contains at least one capital letter, contains at least one digit , whitespace does not contain, 8 to 15 characters')
  // .matches(
  //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  // )
  confirm_password: yup
    .string()
    // .min(8, ({ min }) => `Confirm Password must be at least ${min} characters!`)
    // .max(20, ({ max }) => `Password must be at least ${max} characters`)
    .required("Confirm password is required!")
    .oneOf(
      [yup.ref("password"), null],
      "Password and Confirm password does not match!"
    )
    .matches(
      /^(?!\s+$).*/,
      "Confirm password cannot contain only blankspaces!"
    ),

  // country: yup.string().required("Country is required!"),
  // state: yup.string().required("State is required!"),
  // city: yup.string().required("City is required!"),

  // country: yup.string(),
  // state: yup.string(),
  // city: yup.string(),

  mobile_number: yup
    .string()
    .min(10, ({ min }) => `Mobile number must be ${min} digits!`)
    .max(10, ({ max }) => `Mobile number must be ${max} digits!`)
    .required("Mobile Number is required!"),

  address: yup.string().required("Address is required!"),

  // End of modified code 24/04/2023
});

export const userProfileSchema = yup.object().shape({
  firstName: yup.string(),
  // .required("First Name is required!")
  // .matches(/^(?!\s+$).*/, "First Name cannot contain only blankspaces!"),
  lastName: yup.string(),
  // .required("Last Name is required!")
  // .matches(/^(?!\s+$).*/, "Last Name cannot contain only blankspaces!"),
  gender: yup.string(),
  // .required("Gender is required!"),
  // "dateOfBirth": yup.string()
  // // .required("Date Of Birth is required!"),
  // ,

  email: yup.string(),

  contactNumber: yup.string(),
  // .min(10, ({ min }) => `Password must be ${min} numbers!`)
  // .max(12, ({ max }) => `Password must be ${max} numbers!`)
  // .matches(contactRegExp, "Please enter valid contact number!")
  // .required("Contact Number is required!"),
  country: yup.string(),
  // .required("Country is required!"),
  state: yup.string(),
  // .required("State is required!"),
  city: yup.string(),
  // .required("City is required!"),
});

// Added by yuvraj Sahu on 22-04-2023
// Reason - to validate setting
export const settingSchema = yup.object().shape({
  gstin: yup
    .string()
    .matches(
      /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
      "Enter valid GST number"
    ),
  // Added by Yuvraj Sahu on 28-4-2023
  // Reason - to validate cgst and sgst
  cgst: yup
    .number()
    .max(99, ({ max }) => `cgst should not be more than ${max}`),
  sgst: yup
    .number()
    .max(99, ({ max }) => `sgst should not be more than ${max}`),
  // End of addition
  /**
   * Added by Yuvraj Sahu on 04-05-2023
   * Reason - to give max length of fssai no.
   */
  fssaino: yup
    .string()
    .max(50, ({ max }) => `fssaino should not be more than ${max}`),
  /**
   * End of addition by Yuvraj Sahu on 04-05-2023
   */

  // * Added by Om Shrivastava on 05-06-23
  //  * Reason - Add validation for loyality point price and amount
  per_loyality_point_value: yup
    .number()
    .min(1, ({ min }) => `Per loyality point should not be less than 0`),
  
    amount_for_single_loyality_point: yup
    .number()
    .min(1, ({ min }) => `Amount for single loyality point should not be less than 0`),
  /**
   * End of addition by Om Shrivastava on 05-06-23
   */
});

// Added by yuvraj Sahu on 22-04-2023
// Reason - to validate add menu
export const addMenuSchema = yup.object().shape({
  name: yup
    .string()
    .required("Menu name is required!")
    .max(30, ({ max }) => `Menu name should no be more than ${max} characters`),
});
// End of addition

// Added by yuvraj Sahu on 23-04-2023
// Reason - to validate add menu
export const addCategorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required!")
    .max(
      30,
      ({ max }) => `Category name should no be more than ${max} characters`
    ),
});
// End of addition

// Added by yuvraj Sahu on 23-04-2023
// Reason - to validate add menu
export const addItemSchema = yup.object().shape({
  name: yup
    .string()
    .required("Item name is required!")
    .max(30, ({ max }) => `Item name should no be more than ${max} characters`),
});
// End of addition

// Added by yuvraj Sahu on 26-04-2023
// Reason - to validate add Offer
export const addOfferSchema = yup.object().shape({
  offer_name: yup
    .string()
    .required("Offer name is required!")
    .max(
      40,
      ({ max }) => `Offer name should not be more than ${max} characters`
    ),
  video_link: yup
    .string()
    /**
     * Added by Yuvraj Sahu on 08-05-2023
     * Reason - to validate video url
     */
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url!"
    )
    .max(
      500,
      ({ max }) => `Video link should not be more than ${max} characters`
    ),
  discount: yup
    // Added and modified by Yuvraj Sahu on 05-05-2023
    // Reason to not allow decimal value
    // .number("Offer name should be number")
    .string()
    // .max(100, ({ max }) => `Discount should not be more than ${max}`)
    .matches(
      /^[0-9]{1,2}$/g,
      "Discount should not be more than 100 and decimal value"
    ),
  // end of addition by yuvraj Sahu on 05-05-2023
});
// End of addition

// Added by yuvraj Sahu on 27-04-2023
// Reason - to give validation in payment method
export const addPaymentMethodSchema = yup.object().shape({
  name: yup
    .string()
    .max(255, ({ max }) => `Name should not be more than ${max} characters`),
  contact_number: yup
    .string()
    .max(
      10,
      ({ max }) => `Contact number should not be more than ${max} characters`
    )
    .min(
      10,
      ({ min }) => `Contact number should not be less than ${min} characters`
    ),
});
// End of addition


// Added by yuvraj Sahu on 26-05-2023
// Reason - to validate add social media
export const addSocialMedia = yup.object().shape({
  social_media_name: yup
    .string()
    .max(
      255,
      ({ max }) => `Social media name should no be more than ${max} characters`
    ),
  social_media_link: yup
    .string()
    // Commeted by Yuvraj Sahu on 07-05-2023
    // Reason - to remove validation message from link
    // .matches(
    //   /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
    //   "Enter correct url!"
    // )
    // End of commet by Yuvraj Sahu on 07-06-2023
    .required("Social media link is required!"),
});
// End of addition by Yuvraj Sahu on 26-05-2023

// Added by Parineeta Gedam  on 25-04-2023
// Reason - to validate qunatity
export const addOrderItemSchema = yup.object().shape({
  quantity: yup.string().required("plaese enter quantity"),
  price: yup.string()
});
 // end of addition code by Parineeta Gedam  on 25-04-2023

// Added by Parineeta Gedam  on 25-04-2023
// Reason - to validate qunatity
export const updateReservationSchema = yup.object().shape({
  name: yup.string().required("Please enter name"),
  email: yup.string().trim().email("Please enter valid email!").required("Email address is required!"),
  contact_number: yup.string().min(10, ({ min }) => `Contact number must be ${min} digits!`).max(10, ({ max }) => `Contact number must be ${max} digits!`).required("Contact Number is required!"),
  number_of_person: yup.string().required("Please enter number of person"),
  /* Commented by :- Parineeta Gedam on 16-06-2023 reason :- remove the mandatory */
  // special_instructions:yup.string().required("Please enter special instructions"),
  /* End of commented code by :- by :- Parineeta Gedam on 16-06-2023 reason :- remove the mandatory */
  table_number : yup.string().required("Please enter table number"),
  date : yup.string().required("Please enter date"),
  time : yup.string().required("Please enter time"),

});
 // end of addition code by Parineeta Gedam  on 25-04-2023
// End of addition
