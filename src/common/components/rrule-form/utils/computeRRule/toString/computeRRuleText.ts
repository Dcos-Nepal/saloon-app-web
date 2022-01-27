import RRule from 'rrule';

import computeStart from './computeStart';
import computeRepeat from './computeRepeat';
import computeEnd from './computeEnd';
import computeOptions from './computeOptions';

const computeRRuleText = ({ start, repeat, end, options }: any) => {
  const rruleObject = {
    ...computeStart(start),
    ...computeRepeat(repeat),
    ...computeEnd(end),
    ...computeOptions(options)
  };
  const rrule = new RRule(rruleObject);
  return rrule.toText();
};

export default computeRRuleText;
