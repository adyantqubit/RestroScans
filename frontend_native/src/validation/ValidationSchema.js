import * as yup from "yup";

const contactRegExp = /^[6789]\d{9}$/;
const passwordRegExp = /^((?!.*[\s])(?=.*[A-Z])(?=.*\d).{8,15})/;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
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
  firstName: yup
    .string()
    .required("First Name is required!")
    .matches(/^(?!\s+$).*/, "First Name cannot contain only blankspaces!"),

  lastName: yup
    .string()
    .required("Last Name is required!")
    .matches(/^(?!\s+$).*/, "Last Name cannot contain only blankspaces!"),

  gender: yup.string(),
  // .required("Gender is required!"),

  // dateOfBirth: yup.string().required("Date Of Birth is required!"),

  email: yup
    .string()
    .email("Please enter valid email!")
    .required("Email address is required!"),

  contactNumber: yup
    .string()
    // .min(10, ({ min }) => `Password must be ${min} numbers!`)
    // .max(12, ({ max }) => `Password must be ${max} numbers!`)
    .matches(contactRegExp, "Please enter valid contact number!")
    .required("Contact Number is required!"),

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
  confirmPassword: yup
    .string()
    // .min(8, ({ min }) => `Confirm Password must be at least ${min} characters!`)
    // .max(20, ({ max }) => `Password must be at least ${max} characters`)
    .required("Confirm Password is required!")
    .oneOf(
      [yup.ref("password"), null],
      "Password and Confirm Password does not match!"
    )
    .matches(
      /^(?!\s+$).*/,
      "Confirm Password cannot contain only blankspaces!"
    ),

  // country: yup.string().required("Country is required!"),
  // state: yup.string().required("State is required!"),
  // city: yup.string().required("City is required!"),

  country: yup.string(),
  state: yup.string(),
  city: yup.string(),
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
});

// Added by yuvraj Sahu on 22-04-2023
// Reason - to validate add menu
export const addMenuSchema = yup.object().shape({
  name: yup
    .string()
    .required("Menu name is required!")
    .max(30, ({ max }) => `Menu name should no be more than ${max} characters`),
});