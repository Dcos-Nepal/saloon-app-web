import {LockIcon} from '@primer/octicons-react'

const EmptyState = () => {
  return (
    <div className='blank-state blank-state-sm'>
      <LockIcon verticalAlign="middle" size={'medium'}/>
      <h6 className='mt-2'>All Caught Up!</h6>
      <p>Your search query does not match any results.</p>
      <div>Please reload this page</div>

    </div>
  );
}

export default EmptyState;
