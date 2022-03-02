import { PersonIcon } from '@primer/octicons-react';
import { FC } from 'react';

interface IProps {
  event: any;
  closeModal: () => void;
}

const VisitDetail: FC<IProps> = ({ closeModal, event }) => {
  const property = event.job?.property;

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit or {event.job?.jobFor?.fullName}</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  onChange={() => {}}
                  checked={event.status?.status === 'COMPLETED'}
                  id="flexCheckDefault"
                />
                <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
                  Completed
                </label>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Details</h5>
              <div>{event.title}</div>
              <div className="mt-3">
                <label>
                  <strong>Visit Status</strong>
                </label>
                <div className="mt-1">
                  {event.status?.status === 'COMPLETED' ? (
                    <span className="status status-green">{event.status?.status}</span>
                  ) : (
                    <span className="status status-blue">{event.status?.status}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Team</h5>
              <div>
                {event.job?.team ? (
                  event.job?.team.map((mem: { fullName: string }) => (
                    <div key={mem.fullName}>
                      <span className="status status-blue p-2"><PersonIcon /> {mem.fullName}</span> &nbsp;
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
                {property?.street1}, {property?.postalCode},{' '}
                {property?.city}, {property?.state},{' '}
                {property?.country}
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              {event.startDate ? (
                <div className="col">
                  <h5>Start Date/Time</h5>
                  <div>{new Date(event.startDate).toLocaleDateString()}</div>
                  <div>{new Date(event.startDate).toLocaleTimeString()}</div>
                </div>
              ) : null}
              {event.endDate ? (
                <div className="col">
                  <h5>End Date/Time</h5>
                  <div>{new Date(event.endDate).toLocaleDateString()}</div>
                  <div>{new Date(event.endDate).toLocaleTimeString()}</div>
                </div>
              ) : null}
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
