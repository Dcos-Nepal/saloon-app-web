import React from 'react';
import RepeatYearly from './Yearly/index';
import RepeatMonthly from './Monthly/index';
import RepeatWeekly from './Weekly/index';
import RepeatDaily from './Daily/index';
import RepeatHourly from './Hourly/index';
import translateLabel from '../../utils/translateLabel';

interface Props {
  id: string;
  repeat: {
    frequency: 'Yearly' | 'Monthly' | 'Weekly' | 'Daily' | 'Hourly';
    yearly: {
      mode: any;
      on: any;
      onThe: any;
      options: any;
    };
    monthly: {
      mode: any;
      interval: any;
      on: any;
      onThe: any;
      options: any;
    };
    weekly: {
      interval: any;
      days: any;
      options: any;
    };
    daily: {
      interval: any;
    };
    hourly: {
      interval: any;
    };
    options: {
      frequency: 'Yearly' | 'Monthly' | 'Weekly' | 'Daily' | 'Hourly';
    };
  };
  handleChange: ({ target }: any) => void;
  translations: {};
}

const Repeat: React.FC<Props> = ({
  id,
  repeat: { frequency, yearly, monthly, weekly, daily, hourly },
  handleChange,
  translations
}): React.ReactElement => {
  /**
   * Get the correct component to render based on the frequency
   * @param option 
   * @returns  Boolean
   */
  const isOptionSelected = (option: string) => {
    return frequency === option;
  }

  return (
    <div className='px-3'>
      <div className='row form-group d-flex align-items-sm-center'>
        <div className='col-sm-2 text-sm-right'>
          <label htmlFor={`${id}-frequency`} className='col-form-label'>
            <strong>{translateLabel(translations, 'repeat.label')}</strong>
          </label>
        </div>
        <div className='col-sm-6'>
          <select
            name='repeat.frequency'
            id={`${id}-frequency`}
            className='form-control'
            value={frequency}
            onChange={handleChange}
          >
              <option value='Yearly'>
                {translateLabel(translations, 'repeat.yearly.label')}
              </option>
              <option value='Monthly'>
                {translateLabel(translations, 'repeat.monthly.label')}
              </option>
              <option value='Weekly'>
                {translateLabel(translations, 'repeat.weekly.label')}
              </option>
              <option value='Daily'>
                {translateLabel(translations, 'repeat.daily.label')}
              </option>
              <option value='Hourly'>
                {translateLabel(translations, 'repeat.hourly.label')}
              </option>
          </select>
        </div>
      </div>

      {isOptionSelected('Yearly') && (
        <RepeatYearly
          id={`${id}-yearly`}
          yearly={yearly}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      {isOptionSelected('Monthly') && (
        <RepeatMonthly
          id={`${id}-monthly`}
          monthly={monthly}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      {isOptionSelected('Weekly') && (
        <RepeatWeekly
          id={`${id}-weekly`}
          weekly={weekly}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      {isOptionSelected('Daily') && (
        <RepeatDaily
          id={`${id}-daily`}
          daily={daily}
          handleChange={handleChange}
          translations={translations}
        />
      )}
      {isOptionSelected('Hourly') && (
        <RepeatHourly
          id={`${id}-hourly`}
          hourly={hourly}
          handleChange={handleChange}
          translations={translations}
        />
      )}
    </div>
  );
};

export default Repeat;
