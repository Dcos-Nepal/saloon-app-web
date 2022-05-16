import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChecklistIcon, PersonIcon, StopIcon } from '@primer/octicons-react';
import { Loader } from 'common/components/atoms/Loader';
import { getJobPropertyAddress } from 'utils';
import { DateTime } from 'luxon';

interface IProps {
  event: any;
  markVisitCompleteHandler: (isComplete: boolean, data: any) => void;
  closeModal: () => void;
}

const ScheduleEventDetail: FC<IProps> = ({ closeModal, markVisitCompleteHandler, event }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Mark visit complete
   * @param visitObj 
   */
  const markVisitComplete = async (visitObj: any) => {
    setIsLoading(true);
    await markVisitCompleteHandler(true, visitObj);
    setIsLoading(false);
  };

  /**
   * Gets Event Date diff
   */
  const getDateDiff = () => {
    const date1 = DateTime.fromJSDate(event.end)
    const date2 = DateTime.fromJSDate(event.start)

    const diff = date1.diff(date2, ["years", "months", "days", "hours"])

    console.log(diff.toObject())
  }

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Detail - {event.extendedProps?.meta?.job?.jobFor?.fullName}</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body" style={{maxHeight: '600px', overflowY: 'scroll'}}>
            <Loader isLoading={isLoading} />
            {event.extendedProps?.meta?.status?.status !== 'COMPLETED' ? (
              <>
                <div className="row">
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        const visitObj = {
                          ...event.extendedProps?.meta,
                          title: event.title,
                          startDate: event.start,
                          endDate: event.end ? event.end : event.start
                        };
                        event.extendedProps?.meta?.status?.status !== 'COMPLETED' && markVisitComplete(visitObj);
                      }}
                    >
                      {' '}
                      <ChecklistIcon /> Complete this Visit
                    </button>
                  </div>
                </div>
                <div className="hr mb-3"></div>
              </>
            ) : null}

            <div className="row">
              <h5>Details</h5>
              <div>{event.title}</div>
              <div className="mt-3">
                <label>
                  <strong>Visit Status</strong>
                </label>
                <div className="mt-1">
                  {event.extendedProps?.meta?.status?.status === 'COMPLETED' ? (
                    <span className="status status-green">{event.extendedProps?.meta?.status?.status}</span>
                  ) : (
                    <span className="status status-blue">{event.extendedProps?.meta?.status?.status}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Team</h5>
              <div>
                {event.extendedProps?.meta?.job?.team ? (
                  event.extendedProps?.meta?.job?.team.map((mem: { fullName: string }, index: number) => (
                    <div key={mem.fullName + index}>
                      <span className="status status-blue p-2">
                        <PersonIcon /> {mem.fullName}
                      </span>{' '}
                      &nbsp;
                    </div>
                  ))
                ) : (
                  <div>No Team Assigned for this visit</div>
                )}
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Property Location</h5>
              <div className="txt-grey">{event.extendedProps?.meta?.job?.property ? event.extendedProps?.meta?.job?.property?.name : 'Primary Address'}</div>
              <div className="">
                {getJobPropertyAddress(event.extendedProps?.meta?.job)}
              </div>
            </div>

            <div className="hr mb-3"></div>

            {event.extendedProps?.meta?.status?.status === 'COMPLETED' ? (
              <>
                <div className='row'>
                  <h5>Completion Information</h5>
                  <div className="mb-3">
                    <strong>Notes:</strong>
                    <p>{event.extendedProps?.meta?.completion?.notes || <><StopIcon size={16} /> Not notes added yet!.</>}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Images/Pictures:</strong>
                    <div className='d-flex flex-row justify-content-start'>
                      {event.extendedProps?.meta?.completion?.docs.map((doc: any, index: number) => (
                        <div key={`~${index}`} className="mr-2 p-2">
                          <a target="_blank" href={doc.url} rel="noreferrer">
                            <img src={doc.url} className="img-thumbnail float-start" alt="" style={{ width: '100px', height: '100px' }} />
                          </a>
                        </div>
                      ))}
                      <div className="txt-grey pt-2">{event.extendedProps?.meta?.completion?.docs.length ? null : <><StopIcon size={16} /> Not document added yet!.</>}</div>
                    </div>
                  </div>
                </div>

                <div className="hr mb-3"></div>
              </>)
              : null
            }

            <div className="row">
              {event.start ? (
                <div className="col">
                  <h5>Start Date/Time</h5>
                  <div>{new Date(event.start).toLocaleDateString('en-US', { timeZone: 'Australia/Adelaide' })}&nbsp;{new Date(event.start).toLocaleTimeString('en-US', { timeZone: 'Australia/Adelaide' })}</div>
                </div>
              ) : null}
              {event.end ? (
                <div className="col">
                  <h5>End Date/Time</h5>
                  <div>{new Date(event.end).toLocaleDateString('en-US', { timeZone: 'Australia/Adelaide' })}&nbsp;{new Date(event.end).toLocaleTimeString('en-US', { timeZone: 'Australia/Adelaide' })}</div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/dashboard/jobs/${event.extendedProps?.meta?.job?._id}`)}>
              View Details
            </button>
            <button type="button" className="btn btn-primary" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEventDetail;
