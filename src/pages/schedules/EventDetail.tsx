import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PersonIcon } from '@primer/octicons-react';

import CompleteVisit from './CompleteVisit';
import Modal from 'common/components/atoms/Modal';
import { completeVisitApi } from 'services/visits.service';

interface IProps {
  event: any;
  closeModal: () => void;
}

const EditEvent: FC<IProps> = ({ closeModal, event }) => {
  const navigate = useNavigate();
  const [completeVisitFor, setCompleteVisitFor] = useState<any | null>(null);
  const property = event.extendedProps?.meta?.job?.property;

  const completeVisitHandler = async (data: any) => {
    try {
      await completeVisitApi(completeVisitFor?._id, data);
      toast.success('Visit completed successfully');
      setCompleteVisitFor(null);
      closeModal();
    } catch (ex) {
      toast.error('Failed to complete visit');
    }
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
            <div className="row">
              <div
                onClick={() => {
                  event.extendedProps?.meta?.status?.status !== 'COMPLETED' && setCompleteVisitFor(event.extendedProps?.meta);
                }}
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  defaultChecked={event.extendedProps?.meta?.status?.status === 'COMPLETED'}
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

      {/* Modals Section */}
      <Modal isOpen={!!completeVisitFor} onRequestClose={() => setCompleteVisitFor(null)}>
        <CompleteVisit
          completeVisit={completeVisitHandler}
          closeModal={() => {
            setCompleteVisitFor(null);
          }}
          visit={completeVisitFor}
        />
      </Modal>
    </div>
  );
};

export default EditEvent;
