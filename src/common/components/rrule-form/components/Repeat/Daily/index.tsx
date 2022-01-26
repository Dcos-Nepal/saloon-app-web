import React from 'react';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';

interface Props {
  id: string;
  daily: {
    interval: any;
  };
  handleChange: ({ target }: any) => void;
  translations: any;
}

const RepeatDaily = ({
  id,
  daily: { interval },
  handleChange,
  translations
}: Props) => (
  <div className='form-group row d-flex align-items-sm-center'>
    <div className='col-sm-2 offset-sm-2'>
      {translateLabel(translations, 'repeat.daily.every')}
    </div>
    <div className='col-sm-3'>
      <input
        id={`${id}-interval`}
        name='repeat.daily.interval'
        aria-label='Repeat daily interval'
        className=''
        value={interval}
        onChange={numericalFieldHandler(handleChange)}
        style={{'width': '50px'}}
      />
    </div>
    <div className='col-sm-3'>
      {translateLabel(translations, 'repeat.daily.days')}
    </div>
  </div>
);

export default RepeatDaily;
