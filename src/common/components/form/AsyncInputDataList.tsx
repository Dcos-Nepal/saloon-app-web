import { AxiosResponse } from 'axios';
import { FC, useEffect, useState } from 'react';

import { filterApi } from 'services/common.service';
import { getUuid } from 'utils';

const AsyncInputDataList: FC<any> = ({ name, label, placeholder, onChange, value, resource, isDisabled, helperComponent, closeOnSelect = true, isMulti = false }) => {
  const [options, setOptions] = useState<[{ label: string; value: string; meta: any }]>();
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValue, setInputValue]= useState('');
  const uuid = getUuid();

  /**
   * Load Options for the data list
   * @param inputValue
   * @returns Array of Options
   */
  const loadOptions = async (inputValue: string) => {
    setIsLoading(true);
    await filterApi(resource.name, { q: inputValue, ...(resource?.params ? resource.params : ''), page: 1, limit: 20 })
      .then((response: AxiosResponse) => {
        const {
          data: { data }
        } = response;
        return data?.data ? data.data : data;
      })
      .then((data: any) => {
        setIsLoading(false);
        setOptions(data.rows.map((d: never) => ({ label: d[resource.labelProp], value: d[resource.valueProp], meta: d })));
      });
  };

  /**
   * Handles changes in input value
   * @param inputValue
   * @param selected
   */
  const handleInputChange = (inputValue: string, selected: any) => {
    loadOptions(inputValue);

    if (selected) {
      onChange(selected);
    } else {
      onChange({label: inputValue, value: inputValue, meta: {}});
    }
  };

  /**
   * Use Effect for async data-list
   */
  useEffect(() => {
    typeof value === 'string' ? setInputValue(value) : setInputValue(value.label);
  }, [value])

  return (
    <div className={`${name}`}>
      {label ? (
        <label htmlFor={name} className="form-label txt-dark-grey">{label}</label>
      ) : null}
      <input className="form-control" list={uuid} placeholder={placeholder} value={defaultValue} name="browser" id="browser" onChange={(event) => handleInputChange(event.target.value, options?.find(o => o.label === event.target.value))} />
      <datalist id={uuid}>
        {isLoading ? <option value="">Loading...</option> : null}
        {options && options.map((option) => <option key={option?.label} value={option.label}>{option.meta.description}</option>)}
      </datalist>
    </div>);
};

export default AsyncInputDataList;
