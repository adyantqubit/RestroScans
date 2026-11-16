const CustomButton = ({
  onClick,
  type = "button",
  children,
  className = "",
  disabled,
  ...rest
}) => (
  <button
    className={`custom-button ${className}`}
    onClick={onClick}
    type={type}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
);

export default CustomButton;
