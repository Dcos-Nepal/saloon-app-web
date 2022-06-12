import { ChecklistIcon, PersonIcon, StopIcon } from '@primer/octicons-react';
import Image from 'common/components/atoms/Image';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { getCurrentUser, getJobAddress, isDateBefore } from 'utils';

interface IProps {
  event: any;
  closeModal: () => void;
  markVisitCompleteHandler: (isComplete: boolean, data: any) => void;
}

const VisitDetail: FC<IProps> = ({ closeModal, markVisitCompleteHandler, event }) => {
  const currUser: { role: string; id: string } = getCurrentUser();

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
            <h5 className="modal-title">Visit for {event.job?.jobFor?.fullName}</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '600px', overflowY: 'scroll' }}>
            {(currUser.role === 'ADMIN' || currUser.role === 'WORKER') && event.status?.status !== 'COMPLETED' && isDateBefore(event.startDate, new Date()) ? (
              <>
                <div className="row">
                  <div>
                    <button className="btn btn-primary" onClick={(e) => markVisitCompleteHandler(true, event)}>
                      <ChecklistIcon /> &nbsp; Complete this Visit
                    </button>
                  </div>
                </div>
                <div className="hr mb-3"></div>
              </>
            ) : null}

            <div className="row">
              <h5>Details</h5>
              <div>{event.title}</div>
              <div className='row mt-2 d-flex align-items-center'>
                <div className="col">
                  <label>
                    <strong>Visit Status</strong>
                  </label>
                  <div className="mt-1">
                    <span className={`status status-${event.status?.status === 'COMPLETED' ? 'green' : 'blue'}`}>
                      {event.status?.status}
                    </span>
                  </div>
                </div>
                <div className="col">
                  <label>
                    <strong>Visit Type</strong>
                  </label>
                  <div className="mt-1">
                    <span className="status status-blue">{event?.job?.type}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Team</h5>
              <div>
                {getVisitWorker(event)}
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row mb-3">
              <h5>Property Location</h5>
              <div className="txt-grey">{event.job?.property ? event.job?.property?.name : 'Primary Address'}</div>
              <div className="">{getJobAddress(event.job)}</div>
            </div>

            <div className="hr mb-3"></div>

            {event.status?.status === 'COMPLETED' ? (
              <>
                <div className="row">
                  <h5>Completion Information</h5>
                  <div className="mb-3">
                    <strong>Notes:</strong>
                    <p>
                      {event?.completion?.notes || (
                        <>
                          <StopIcon size={16} /> Not notes added yet!.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="mb-3">
                    <strong>Images/Pictures:</strong>
                    <div className="d-flex flex-row justify-content-start">
                      {event?.completion?.docs.map((doc: any, index: number) => (
                        <div key={`~${index}`} className="mr-2 p-2">
                          <a target="_blank" href={doc.url} rel="noreferrer">
                            <Image fileSrc={doc.url} className="img-thumbnail float-start" style={{ width: '100px', height: '100px' }} />
                          </a>
                        </div>
                      ))}
                      <div className="txt-grey pt-2">
                        {event?.completion?.docs.length ? null : (
                          <><StopIcon size={16} /> Not document added yet!.</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hr mb-3"></div>
              </>
            ) : null}

            <div className="row">
              {event.startDate ? (
                <div className="col">
                  <h5>Visit Date</h5>
                  <div>
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="row mt-3">
              <div className="col">
                <h5>Start - End Time</h5>
                <div>
                  {DateTime.fromISO(event?.startTime).toFormat('h:mm:ss a')}
                  {' - '}
                  {DateTime.fromISO(event?.endTime).toFormat('h:mm:ss a')}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitDetail;
