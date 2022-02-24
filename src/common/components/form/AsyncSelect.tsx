import { AxiosResponse } from 'axios';
import { FC, useState } from 'react';

import AsyncSelect from 'react-select/async';
import { filterApi } from 'services/common.service';

const SelectAsync: FC<any> = ({ name, label, placeholder, onChange, value, resource, isDisabled, helperComponent, closeOnSelect = true, isMulti = false }) => {
  const [query, setQuery] = useState('');
  const loadOptions = async (inputValue: string) => {
    return await filterApi(resource.name, { q: inputValue, ...(resource?.params ? resource.params : ''), page: 1, limit: 20 })
      .then((response: AxiosResponse) => {
        const {
          data: { data }
        } = response;
        return data?.data ? data.data : data;
      })
      .then((data: any) => {
        return data.rows.map((d: never) => ({ label: d[resource.labelProp], value: d[resource.valueProp], meta: d }));
      });
  };

  const handleInputChange = (inputValue: string) => {
    setQuery(inputValue);
  };

  return (
    <div className={`${name}`}>
      {label ? (
        <label htmlFor={name} className="form-label txt-dark-grey">
          {label}
        </label>
      ) : null}
      <AsyncSelect
        id={name}
        name={name}
        closeMenuOnSelect={closeOnSelect}
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
        styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
      />
      <div className="form-text">{helperComponent}</div>
    </div>
  );
};

export default SelectAsync;
