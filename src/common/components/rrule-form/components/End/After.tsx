import numericalFieldHandler from '../../utils/numericalFieldHandler';
import translateLabel from '../../utils/translateLabel';

interface Props {
  id: string;
  after: number;
  handleChange: any;
  translations: any;
}

const EndAfter = ({ id, after, handleChange, translations }: Props) => (
  <div className='col-5'>
    <div className='form-group m-0 row d-flex align-items-center'>
      <div className='col-3 col-sm-6 pl-0'>
        <input
          id={id}
          name='end.after'
          aria-label='End after'
          className=''
          value={after}
          onChange={numericalFieldHandler(handleChange)}
          style={{'width': '50px'}}
        />
      </div>
      <div className='col-9 col-sm-6'>
        {translateLabel(translations, 'end.executions')}
      </div>
    </div>
  </div>
);

export default EndAfter;
