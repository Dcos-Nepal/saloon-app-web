import { FC } from "react";

import Select from "react-select";

const SelectField: FC<any> = ({
  name,
  label,
  placeholder,
  options,
  handleChange,
  handleBlur,
  value,
  className,
  isDisabled,
  helperComponent,
  isMulti = false,
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label ? (<label htmlFor={name} className="form-label txt-dark-grey">
        {label}
      </label>) : null}
      <Select
        id={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        name={name}
        menuPlacement="auto"
        options={options}
        isDisabled={isDisabled}
        classNamePrefix="form-control"
        placeholder={placeholder}
        isMulti={isMulti}
        menuPortalTarget={document.body}
        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
      />
      <div className="form-text">{helperComponent}</div>
    </div>
  );
};

export default SelectField;
