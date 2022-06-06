import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import * as jobsActions from '../../../store/actions/job.actions';
import { InfoIcon } from '@primer/octicons-react';
import { Loader } from 'common/components/atoms/Loader';
import useMountedRef from 'common/hooks/is-mounted';
import JobForm from '../JobForm';
import { DateTime } from 'luxon';

interface IProps {
  actions: { fetchJob: (id: string, query: any) => any };
  isLoading: boolean;
  job: any;
}

const EditJob = (props: IProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMounted = useMountedRef();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (isMounted) {
      props.actions.fetchJob(id as string, {});
    }
  }, [isMounted, id, props.actions]);

  useEffect(() => {
    const job = props.job;
    if (!job) return;

    if (isMounted) {
      setInitialValues({
        _id: job?._id,
        title: job?.title,
        instruction: job?.instruction,
        jobFor: { value: job?.jobFor?._id, label: job?.jobFor.fullName, meta: job?.jobFor },
        property: job?.property?._id || null,
        type: job?.type,
        jobType: job?.jobType,
        team: job?.team.map((t: any) => ({ value: t._id, label: t.fullName })),
        lineItems: job?.lineItems.map((lineItem: any) => ({
          name: { label: lineItem.name, value: lineItem._id },
          description: lineItem.description,
          quantity: lineItem.quantity,
          unitPrice: lineItem.unitPrice,
          total: lineItem.quantity * lineItem.unitPrice
        })),
        schedule: {
          rruleSet: job?.primaryVisit?.rruleSet || '',
          startDate: job?.primaryVisit?.startDate || '',
          startTime: job?.primaryVisit?.startTime || '',
          endDate: job?.primaryVisit?.endDate || '',
          endTime: job?.primaryVisit?.endTime || ''
        },
        oneOff: {
          rruleSet: job?.primaryVisit?.rruleSet || '',
          startDate: DateTime.fromISO(job?.primaryVisit?.startDate).toLocaleString() || '',
          startTime: job?.primaryVisit?.startTime || '',
          endDate: DateTime.fromISO(job?.primaryVisit?.endDate).toLocaleString() || '',
          endTime: job?.primaryVisit?.endTime || ''
        },
        notes: job?.notes || '' ,
        docs: job?.docs || []
      });
    }
  }, [isMounted, props.job]);

  return (
    <>
      <div className="row">
        <div className="txt-orange pointer mb-3" onClick={() => navigate(-1)}>
          <span className="col me-1">
            <box-icon name="arrow-back" size="xs" color="#EC7100" />
          </span>
          <span className="col">Back to previous</span>
        </div>
        <div className="d-flex flex-row">
          <div className='mt-2'>
            <h3 className="txt-bold extra">Edit Job Detail</h3>
            <p className="text-secondary"><InfoIcon /> This is the Job Details view. In contains the all the information for the job with it's visits.</p>
          </div>
        </div>
      </div>
      <Loader isLoading={props.isLoading} />
      {initialValues && (
        <div className="">
          <JobForm initialValues={{...initialValues, refCode: props.job?.refCode}} />
          {/* <JobEditForm isLoading={props.isLoading} job={{...initialValues, refCode: props.job?.refCode}} jobUpdated={() => console.log('updated')} /> */}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: { jobs: any; isLoading: boolean }) => {
  return { job: state.jobs.job, isLoading: state.jobs.isLoading };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    fetchJob: (id: string, query: any) => {
      dispatch(jobsActions.fetchJob(id, query));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditJob);
