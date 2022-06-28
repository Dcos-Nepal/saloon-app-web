import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChecklistIcon, PersonIcon, StopIcon } from '@primer/octicons-react';
import { Loader } from 'common/components/atoms/Loader';
import { getCurrentUser, getJobAddress, isDateBefore } from 'utils';
import Image from 'common/components/atoms/Image';
import { DateTime } from 'luxon';

interface IProps {
  event: any;
  markVisitCompleteHandler: (isComplete: boolean, data: any) => void;
  closeModal: () => void;
}

const ScheduleEventDetail: FC<IProps> = ({ closeModal, markVisitCompleteHandler, event }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const currUser: { role: string; id: string } = getCurrentUser();

  /**
   * Mark visit complete
   * @param visitObj
   */
  const markVisitComplete = async (visitObj: any) => {
    setIsLoading(true);
    await markVisitCompleteHandler(true, visitObj);
    setIsLoading(false);
  };

  const getVisitWorker = (event: any) => {
    if (event?.team) {
      return  event?.team.map((mem: { fullName: string }) => (
        <div key={mem.fullName}>
          <span className="status status-blue p-2">
            <PersonIcon /> {mem.fullName}
          </span>{' '}
          &nbsp;
        </div>
      ))
    }
  
    return event.job?.team ? (
      event.job?.team.map((mem: { fullName: string }) => (
        <div key={mem.fullName}>
          <span className="status status-blue p-2">
            <PersonIcon /> {mem.fullName}
          </span>{' '}
          &nbsp;
        </div>
      ))
    ) : (
      <div>No Team Assigned for this visit</div>
    )
  }

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Detail - {event.extendedProps?.meta?.job?.jobFor?.fullName}</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '600px', overflowY: 'scroll' }}>
            <Loader isLoading={isLoading} />
            <div className="row">
              <h5>Details</h5>
              <div>{event.title}</div>
              <div className="mt-3">
                <div className='row mt-2 d-flex align-items-center'>
                  <div className="col">
                    <label>
                      <strong>Visit Status</strong>
                    </label>
                    <div className="mt-1">
                      <span className={`status status-${event.extendedProps?.meta?.status?.status === 'COMPLETED' ? 'green' : 'blue'}`}>
                        {event.extendedProps?.meta?.status?.status}
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <label>
                      <strong>Visit Type</strong>
                    </label>
                    <div className="mt-1">
                      <span className="status status-blue">{event.extendedProps?.meta?.job?.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Team</h5>
              <div>
                {getVisitWorker(event.extendedProps?.meta)}
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Property Location</h5>
              <div className="txt-grey">{event.extendedProps?.meta?.job?.property ? event.extendedProps?.meta?.job?.property?.name : 'Primary Address'}</div>
              <div className="">{getJobAddress(event.extendedProps?.meta?.job)}</div>
            </div>

            <div className="hr mb-3"></div>

            {event.extendedProps?.meta?.status?.status === 'COMPLETED' ? (
              <>
                <div className="row">
                  <h5>Completion Information</h5>
                  <div className="mb-3">
                    <strong>Notes:</strong>
                    <p>
                      {event.extendedProps?.meta?.completion?.notes || (
                        <>
                          <StopIcon size={16} /> Not notes added yet!.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="mb-3">
                    <strong>Images/Pictures:</strong>
                    <div className="d-flex flex-row justify-content-start">
                      {event.extendedProps?.meta?.completion?.docs.map((doc: any, index: number) => (
                        <div key={`~${index}`} className="mr-2 p-2">
                          <a target="_blank" href={doc.url} rel="noreferrer">
                            <Image fileSrc={doc.url} className="img-thumbnail float-start" style={{ width: '100px', height: '100px' }} />
                          </a>
                        </div>
                      ))}
                      <div className="txt-grey pt-2">
                        {event.extendedProps?.meta?.completion?.docs.length ? null : (
                          <>
                            <StopIcon size={16} /> Not document added yet!.
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hr mb-3"></div>
              </>
            ) : null}

            <div className="row">
              {event.start ? (
                <div className="col">
                  <h5>Visit Date</h5>
                  <div>
                    {new Date(event.start).toLocaleDateString()}
                    {event.extendedProps?.meta?.job.type === 'ONE-OFF' ? " - " + new Date(event.end).toLocaleDateString() : null}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="row mt-3">
              <div className="col">
                <h5>Start - End Time</h5>
                <div>
                  {DateTime.fromISO(event.extendedProps?.meta?.startTime).toFormat('h:mm:ss a')}
                  {' - '}
                  {DateTime.fromISO(event.extendedProps?.meta?.endTime).toFormat('h:mm:ss a')}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {(currUser.role === 'ADMIN' || currUser.role === 'WORKER') && event.extendedProps?.meta?.status?.status !== 'COMPLETED' && isDateBefore(event.start, new Date()) ? (
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
            ) : null}
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
