import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChecklistIcon, PersonIcon } from '@primer/octicons-react';
import { Loader } from 'common/components/atoms/Loader';

interface IProps {
  event: any;
  markVisitCompleteHandler: (isComplete: boolean, data: any) => void;
  closeModal: () => void;
}

const ScheduleEventDetail: FC<IProps> = ({ closeModal, markVisitCompleteHandler, event }) => {
  const navigate = useNavigate();
  const property = event.extendedProps?.meta?.job?.property;

  const [isLoading, setIsLoading] = useState(false);

  const markVisitComplete = async (visitObj: any) => {
    setIsLoading(true);
    await markVisitCompleteHandler(true, visitObj);
    setIsLoading(false);
  };

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Detail - {event.extendedProps?.meta?.job?.jobFor?.fullName}</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
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
              <div className="txt-grey">{property?.name || ''}</div>
              <div className="">
                {property?.street1}, {property?.postalCode}, {property?.city}, {property?.state}, {property?.country}
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              {event.start ? (
                <div className="col">
                  <h5>Start Date/Time</h5>
                  <div>{new Date(event.start).toLocaleDateString('en-US', { timeZone: 'Australia/Adelaide' })}</div>
                  <div>{new Date(event.start).toLocaleTimeString('en-US', { timeZone: 'Australia/Adelaide' })}</div>
                </div>
              ) : null}
              {event.end ? (
                <div className="col">
                  <h5>End Date/Time</h5>
                  <div>{new Date(event.end).toLocaleDateString('en-US', { timeZone: 'Australia/Adelaide' })}</div>
                  <div>{new Date(event.end).toLocaleTimeString('en-US', { timeZone: 'Australia/Adelaide' })}</div>
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
