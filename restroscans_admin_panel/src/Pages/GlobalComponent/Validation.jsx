// Added by Om Shrivastava on 26-08-23
// Reason : Set the validation function

export const checkIsNotADigit = (value) => {
  if (isNaN(value)) return true;
  return false;
};

export const checkIsEmpty = (value) => {
  if (value && value.toString().trim().length > 0) return false;
  return true;
};

export const checkIfGreaterThanMaxLength = (value, length) => {
  if (value && value.toString().trim().length > length) return true;
  return false;
};

export const checkIfSmallerThanMinLength = (value, length) => {
  if (value && value.toString().trim().length < length) return true;
  return false;
};

export const checkIfGreaterThanMaxValue = (value, maximum) => {
  if (value && maximum && value >= maximum) return true;
  return false;
};
export const checkIfMinimumThanMinValue = (value, minimum) => {
  if (value && minimum && value <= minimum) return true;
  return false;
};
export const checkIsNotZero = (value) => {
  if (value && value!=0) return false;
  return true;
};
// End of addition by Om Shrivastava on 26-08-23
// Reason : Set the validation function