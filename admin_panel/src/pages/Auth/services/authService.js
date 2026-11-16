import {
  postRestaurantDetail,
  restaurentAuthentication,
  sendOtpApi,
  updatePasswordApi,
  waiterAuthentication,
  tokenValidationAPI,
} from '../api/authApi';

export function registerRestaurant(value) {
  return postRestaurantDetail(value);
}

export function loginRestaurant(value) {
  return restaurentAuthentication(value);
}

export function sendPasswordOtp(value) {
  return sendOtpApi(value);
}

export function updatePassword(value) {
  return updatePasswordApi(value);
}

export function loginWaiter(_tenant, value) {
  return waiterAuthentication(_tenant, value);
}

export function validateToken(value) {
  return tokenValidationAPI(value);
}

function withoutField(errors, key) {
  return errors.filter(function (row) {
    return Object.keys(row) != key;
  });
}

export function ownerNameErrors(text) {
  var messages = [];
  if (text.length == 0) messages.push({ owner_error: "Please enter owner name" });
  if (text.match(/\d+/g)) messages.push({ owner_error: "Please enter only characters" });
  return messages;
}

export function emailErrors(text) {
  var messages = [];
  if (text.length == 0) messages.push({ Email: "Please enter Email" });
  if (text.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null)
    messages.push({ Email: "Please enter Email in this format example@gmail.com" });
  return messages;
}

export function restaurantNameErrors(text) {
  if (text.length == 0) return [{ Restaurant_name: "Please enter restaurant name" }];
  return [];
}

export function addressErrors(text) {
  if (text.length == 0) return [{ Address: "Please enter restaurant address" }];
  return [];
}

export function mobileErrors(text) {
  var messages = [];
  if (text.length == 0) messages.push({ Mobile: "Please enter mobile number" });
  if (text.length < 10) messages.push({ Mobile: "Mobile number should not be less than 10 digits" });
  return messages;
}

export function passwordErrors(text) {
  var messages = [];
  if (text.length == 0) messages.push({ password: "Please enter password" });
  if (text.length < 8 && text.length != 0) messages.push({ password: "Password must be atleast 8 characters" });
  return messages;
}

export function confirmPasswordErrors(text, password) {
  var messages = [];
  if (text.length == 0) messages.push({ confirm_password: "Please confirm your password" });
  if (password != text) messages.push({ confirm_password: "Password and Confirm Password should be same" });
  return messages;
}

export function imageSizeErrors(file, key) {
  if (file.size > 1024 * 200) {
    var row = {};
    row[key] = "Image should be less than 200KB";
    return [row];
  }
  return [];
}

export function applyFieldErrors(errors, key, messages) {
  return withoutField(errors, key).concat(messages);
}

export function loginEmailErrors(text) {
  var messages = [];
  if (text.length == 0) messages.push({ Email: "Please enter Email" });
  if (text.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null)
    messages.push({ Email: "Please enter email in this format example@gmail.com" });
  return messages;
}

export function otpErrors(text) {
  var messages = [];
  if (text.length == 0) messages.push({ OTP: "Please enter OTP" });
  if (text.length != 0 && text.length < 6) messages.push({ OTP: "OTP should be 6 digits" });
  return messages;
}

export function resetPasswordErrors(text) {
  var messages = [];
  if (text.length == 0) messages.push({ password: "Please enter password" });
  if (text.length < 8 && text.length != 0) messages.push({ password: "Password should not be less than 8 characters" });
  return messages;
}

export function resetConfirmErrors(text, password) {
  var messages = [];
  if (text.length == 0) messages.push({ confirm_password: "Please Confirm Your Password" });
  if (password != text) messages.push({ confirm_password: "Password and Confirm Password should be same" });
  return messages;
}

export function waiterLoginField(errorText, field, value) {
  if (field === "contact_number") {
    if (value.length == 0) errorText.numberError = "Number should not be blank";
    else if (value.length < 10) errorText.numberError = "Number should not be less than 10 digits";
    else if (value.length > 10) errorText.numberError = "Number should not be more than 10 digits";
    else delete errorText.numberError;
  }
  if (field == "password") {
    if (value.length == 0) errorText.passwordError = "Password should not be blank";
    else if (value.length < 5) errorText.passwordError = "Password should not be less than 5 characters";
    else delete errorText.passwordError;
  }
  if (field == "tenant") {
    if (value.length == 0) errorText.tenantError = "Tenant should not be blank";
    else delete errorText.tenantError;
  }
  return errorText;
}
