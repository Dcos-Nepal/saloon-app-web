import { FC } from "react";

const TextArea: FC<any> = ({
  name,
  label,
  className,
  placeholder,
  onChange,
  onBlur,
  rows = 3,
  helperComponent,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label txt-dark-grey">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`form-control ${className}`}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
      <div className="form-text">
        {helperComponent}
      </div>
    </div>
  );
};

export default TextArea;
