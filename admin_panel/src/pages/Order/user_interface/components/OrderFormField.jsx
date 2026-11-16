import React from "react";
import style from "../style/orderform.module.css";

const join = (...names) => names.filter(Boolean).join(" ");

// A label, the input passed as children and the message area under it.
export const FormField = ({ label, children, error, showErrorArea = true, areaClass, labelClass }) => (
  <div className={style.inputContainer}>
    <div className={join(style.inputArea, areaClass)}>
      <div className={join(style.inputLabel, labelClass)}>{label}</div>
      {children}
    </div>
    {showErrorArea && <div className={style.inputErrorArea}>{error}</div>}
  </div>
);

// A figure the cashier can read but not change (sub-total, tax, grand total ...). These sit in the
// right-hand column, which uses the responsive layout classes.
export const ReadOnlyField = ({ label, name, value, width, showErrorArea = true, labelClass = style.inputLabel2 }) => (
  <FormField
    label={label}
    labelClass={labelClass}
    areaClass={style.inputAreaForResponsive}
    showErrorArea={showErrorArea}
  >
    <input
      className={`${style.textInputBox} ${style.disabledInputBox}`}
      type="text"
      name={name}
      style={width ? { width } : undefined}
      value={value}
      disabled
    />
  </FormField>
);
