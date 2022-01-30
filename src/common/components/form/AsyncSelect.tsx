import { AxiosResponse } from "axios";
import { FC, useState } from "react";

import AsyncSelect from 'react-select/async';
import { filterApi } from "services/common.service";
import { generateQueryParams } from "utils";

const SelectAsync: FC<any> = ({
  name,
  label,
  placeholder,
  onChange,
  value,
  resource,
  isDisabled,
  helperComponent,
  isMulti = false,
}) => {
  const [query, setQuery] = useState('');
  const loadOptions = async (inputValue: string) => {
    return await filterApi(resource.name, { q: inputValue, ...(resource?.params ? resource.params : ''), page: 0, limit: 10 }).then((response: AxiosResponse) => {
      const { data: { data } } = response;
      return (data?.data) ? data.data : data;
      }).then((data: any) => {
      return data.rows.map((d: never) => ({ 'label': d[resource.labelProp], 'value': d[resource.valueProp], 'meta': d }));
    });
  };

  const handleInputChange = (inputValue: string) => {
    setQuery(inputValue)
  };

  return (
    <div className={`${name}`}>
      <label htmlFor={name} className="form-label txt-dark-grey">
        {label}
      </label>
      <AsyncSelect
        id={name}
        name={name}
        closeMenuOnSelect={false}
        inputValue={query}
        value={value}
        onChange={onChange}
        onInputChange={handleInputChange}
        loadOptions={loadOptions}
        cacheOptions={false}
        menuPlacement="auto"
        isDisabled={isDisabled}
        classNamePrefix={`form-control`}
        placeholder={placeholder}
        isMulti={isMulti}
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 999 }) }}
      />
      <div className="form-text">{helperComponent}</div>
    </div>
  );
};

export default SelectAsync;
