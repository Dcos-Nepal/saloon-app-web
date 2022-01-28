import { FC } from "react";

import Select from "react-select";

const SelectField: FC<any> = ({
  name,
  label,
  placeholder,
  options,
  handleChange,
  value,
  className,
  isDisabled,
  helperComponent,
  isMulti = false,
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      <label htmlFor={name} className="form-label txt-dark-grey">
        {label}
      </label>
      <Select
        id={name}
        value={value}
        onChange={handleChange}
        name={name}
        menuPlacement="auto"
        options={options}
        isDisabled={isDisabled}
        classNamePrefix="form-control"
        placeholder={placeholder}
        isMulti={isMulti}
        menuPortalTarget={document.body}
        styles={{ menuPortal: base => ({ ...base, zIndex: 999 }) }}
      />
      <div className="form-text">{helperComponent}</div>
    </div>
  );
};

export default SelectField;
