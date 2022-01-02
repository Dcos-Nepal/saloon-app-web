import { FC } from "react";

const InputField: FC<any> = ({
  name,
  label,
  className,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label txt-dark-grey">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className={`form-control ${className}`}
        placeholder={placeholder}
      />
      <div className="form-text"></div>
    </div>
  );
};

export default InputField;
