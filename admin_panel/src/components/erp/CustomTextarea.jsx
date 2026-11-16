const CustomTextarea = ({ className = "", ...rest }) => (
  <textarea className={`custom-input ${className}`.trim()} {...rest} />
);

export default CustomTextarea;
