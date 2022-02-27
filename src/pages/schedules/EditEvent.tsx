import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CompleteJob from './CompleteJob';
import Modal from 'common/components/atoms/Modal';

interface IProps {
  event: any;
  closeModal: () => void;
}

const EditEvent: FC<IProps> = ({ closeModal, event }) => {
  const navigate = useNavigate();
  const [completeJobFor, setCompleteJobFor] = useState<any | null>(null);

  return (
    <div className={`modal fade show`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Detail - {event.extendedProps?.meta?.job?.jobFor?.fullName}</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div
                onClick={() => {
                  setCompleteJobFor(event);
                }}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  checked={event.extendedProps?.meta?.status?.status === 'COMPLETED'}
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
                  event.extendedProps?.meta?.job?.team.map((mem: { fullName: string }) => (
                    <>
                      <span className="status status-blue">{mem.fullName}</span> &nbsp;
                    </>
                  ))
                ) : (
                  <div>No Team Assigned for this visit</div>
                )}
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Property Location</h5>
              <div className="txt-grey">{event.extendedProps?.meta?.job?.property?.name || ''}</div>
              <div className="">
                {event.extendedProps?.meta?.job?.property?.street1}, {event.extendedProps?.meta?.job?.property?.postalCode},{' '}
                {event.extendedProps?.meta?.job?.property?.city}, {event.extendedProps?.meta?.job?.property?.state},{' '}
                {event.extendedProps?.meta?.job?.property?.country}
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              {event.start ? (
                <div className="col">
                  <h5>Start Date/Time</h5>
                  <div>{new Date(event.start).toLocaleDateString()}</div>
                  <div>{new Date(event.start).toLocaleTimeString()}</div>
                </div>
              ) : null}
              {event.end ? (
                <div className="col">
                  <h5>End Date/Time</h5>
                  <div>{new Date(event.end).toLocaleDateString()}</div>
                  <div>{new Date(event.end).toLocaleTimeString()}</div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/dashboard/quotes/${event.extendedProps?.meta?.job?._id}`)}>View Details</button>
            <button type="button" className="btn btn-primary" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
      <Modal isOpen={completeJobFor} onRequestClose={() => setCompleteJobFor(null)}>
        <CompleteJob closeModal={() => setCompleteJobFor(null)} job={completeJobFor} />
      </Modal>
    </div>
  );
};

export default EditEvent;
