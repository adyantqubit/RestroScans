const CustomSelect = ({ className = "", children, ...rest }) => (
  <select className={`custom-input ${className}`.trim()} {...rest}>
    {children}
  </select>
);

export default CustomSelect;
