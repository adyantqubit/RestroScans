const CustomLabel = ({ text, htmlFor, children, className = "" }) => (
  <label className={`custom-label ${className}`} htmlFor={htmlFor}>
    {text || children}
  </label>
);

export default CustomLabel;
