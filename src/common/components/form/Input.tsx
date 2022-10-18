import { FC } from "react";

const InputField: FC<any> = ({
  name,
  label,
  value,
  className,
  placeholder,
  type = "text",
  onChange,
  onBlur,
  disabled = false,
  helperComponent,
  isRequired = false
}) => {
  return (
    <div className="mb-3">
      {label ? (<label htmlFor={name} className="form-label txt-dark-grey">{label}{isRequired ? (<span className='text-danger'>*</span>) : ''}</label>) : null}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        className={`form-control ${className}`}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      <div className="form-text">
        {helperComponent}
      </div>
    </div>
  );
};

export default InputField;
