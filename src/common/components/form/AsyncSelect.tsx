import { AxiosResponse } from 'axios';
import { IOption } from 'common/types/form';
import { FC, useEffect, useState } from 'react';

import AsyncSelect from 'react-select/async';
import { filterApi } from 'services/common.service';

const SelectAsync: FC<any> = ({ name, label, customOption, placeholder, onChange, value, resource, isDisabled, helperComponent, preload = false, closeOnSelect = true, isMulti = false, isClearable = true }) => {
  const [query, setQuery] = useState('');
  const [defaultOptions, setDefaultOptions] = useState([]);

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

  useEffect(() => {
    if (preload) {
      filterApi(resource.name, { ...(resource?.params ? resource.params : ''), page: 1, limit: 20 })
        .then((response: AxiosResponse) => {
          const {
            data: { data }
          } = response;
          return data?.data ? data.data : data;
        })
        .then((data: any) => {
          if (data?.rows) {
            setDefaultOptions(data.rows.map((d: never) => ({ label: d[resource.labelProp], value: d[resource.valueProp], meta: d })));
          }
        });
    }
  }, []);

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
        value={
          isMulti
            ? defaultOptions.find((option: IOption) => value?.find((tag: string) => tag === option.value))
            : defaultOptions.find((option: IOption) => option.value === value)
        }
        onChange={onChange}
        onInputChange={handleInputChange}
        loadOptions={loadOptions}
        cacheOptions={true}
        defaultOptions={defaultOptions}
        menuPlacement="auto"
        isDisabled={isDisabled}
        isClearable = {isClearable}
        formatOptionLabel={customOption}
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
