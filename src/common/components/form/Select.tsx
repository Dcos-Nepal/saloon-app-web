import { IOption } from "common/types/form";
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
  isClearable = true,
  helperComponent,
  customOption,
  isMulti = false,
  isRequired = false
}) => {
  return (
    <div className={`${className}`}>
      {label ? (<label htmlFor={name} className="form-label txt-dark-grey">{label}{isRequired ? (<span className='text-danger'>*</span>) : ''}</label>) : null}
      <Select
        id={name}
        value={
          isMulti
            ? options.find((option: IOption) => value?.find((tag: string) => tag === option.value))
            : options.find((option: IOption) => option.value === value)
        }
        onChange={handleChange}
        onBlur={handleBlur}
        name={name}
        menuPlacement="auto"
        options={options}
        isDisabled={isDisabled}
        isClearable = {isClearable}
        classNamePrefix="form-control"
        placeholder={placeholder}
        isMulti={isMulti}
        formatOptionLabel={customOption}
        menuPortalTarget={document.body}
        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
      />
      <div className="form-text">{helperComponent}</div>
    </div>
  );
};

export default SelectField;
