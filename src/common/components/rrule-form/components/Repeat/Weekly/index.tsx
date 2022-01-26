import React from 'react';
import toPairs from 'lodash/toPairs';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';

interface Props {
  id: string;
  weekly: {
    interval: any;
    days: any;
    options: any;
  };
  handleChange: any;
  translations: any;
}

const RepeatWeekly = ({
  id,
  weekly: { interval, days, options },
  handleChange,
  translations
}: Props) => {
  let daysArray = toPairs(days);
  if (options.weekStartsOnSunday) {
    daysArray = daysArray.slice(-1).concat(daysArray.slice(0, -1));
  }

  return (
    <div className='px-3'>
      <div className='form-group row d-flex align-items-sm-center'>
        <div className='col-sm-2 offset-sm-2'>
          {translateLabel(translations, 'repeat.weekly.every')}
        </div>
        <div className='col-sm-3'>
          <input
            id={`${id}-interval`}
            name='repeat.weekly.interval'
            aria-label='Repeat weekly interval'
            className=''
            value={interval}
            onChange={numericalFieldHandler(handleChange)}
            style={{'width': '50px'}}
          />
        </div>
        <div className='col-sm-3'>
          {translateLabel(translations, 'repeat.weekly.weeks')}
        </div>
      </div>

      <div className='form-group row mt-2' style={{'width': '370px'}}>
        <div className='btn-group btn-group-toggle offset-sm-2'>
          {daysArray.map(([dayName, isDayActive]) => (
            <label
              htmlFor={`${id}-${dayName}`}
              key={dayName}
              className={`btn btn-primary ${isDayActive ? 'active' : ''}`}
              style={{'padding': '3px 0', 'fontSize': '14px'}}
            >
              <input
                type='checkbox'
                id={`${id}-${dayName}`}
                name={`repeat.weekly.days[${dayName}]`}
                className='hidden'
                checked={isDayActive as any}
                onChange={(event) => {
                  const editedEvent = {
                    ...event,
                    target: {
                      ...event.target,
                      value: !isDayActive,
                      name: event.target.name
                    }
                  };

                  handleChange(editedEvent);
                }}
              />
              {translateLabel(
                translations,
                `days_short.${dayName.toLowerCase()}`
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepeatWeekly;
