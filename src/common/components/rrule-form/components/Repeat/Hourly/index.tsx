import React from 'react';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';

interface Props {
  id: string;
  hourly: {
    interval: any;
  };
  handleChange: ({ target }: any) => void;
  translations: any;
}

const RepeatHourly = ({
  id,
  hourly: { interval },
  handleChange,
  translations
}: Props) => (
  <div className='form-group row mt-2 d-flex align-items-sm-center'>
    <div className='col-sm-2 offset-sm-2'>
      {translateLabel(translations, 'repeat.hourly.every')}
    </div>
    <div className='col-sm-3'>
      <input
        id={`${id}-interval`}
        name='repeat.hourly.interval'
        aria-label='Repeat hourly interval'
        className='form-control'
        value={interval}
        onChange={numericalFieldHandler(handleChange)}
        style={{'width': '50px'}}
      />
    </div>
    <div className='col-sm-3'>
      {translateLabel(translations, 'repeat.hourly.hours')}
    </div>
  </div>
);

export default RepeatHourly;
