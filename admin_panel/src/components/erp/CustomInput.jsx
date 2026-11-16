import React from "react";

const CustomInput = React.forwardRef(function CustomInput(
  {
    type = "text",
    value,
    checked,
    onChange,
    placeholder,
    name,
    className = "",
    onFocus,
    onBlur,
    disabled = false,
    ...rest
  },
  ref
) {
  const isFile = type === "file";
  const isCheckbox = type === "checkbox";
  const props = {
    ref,
    className: `custom-input ${className}`.trim(),
    type,
    onChange,
    placeholder,
    name,
    onFocus,
    onBlur,
    disabled,
    ...rest,
  };
  if (isCheckbox) {
    props.checked = checked ?? Boolean(value);
  } else if (!isFile) {
    props.value = value ?? "";
  }
  return <input {...props} />;
});

export default CustomInput;
