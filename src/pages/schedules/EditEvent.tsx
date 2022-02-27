import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CompleteJob from './CompleteJob';
import Modal from 'common/components/atoms/Modal';
import { completeJobApi } from 'services/jobs.service';
import { toast } from 'react-toastify';

interface IProps {
  event: any;
  closeModal: () => void;
  fetchJobSchedule: () => void;
}

const EditEvent: FC<IProps> = ({ closeModal, event, fetchJobSchedule }) => {
  const navigate = useNavigate();
  const [completeJobFor, setCompleteJobFor] = useState<any | null>(null);

  const completeJobHandler = async (data: any) => {
    try {
      await completeJobApi(completeJobFor?._id, data);
      await fetchJobSchedule();
      toast.success('Job completed successfully');
      setCompleteJobFor(null);
      closeModal();
    } catch (ex) {
      toast.error('Failed to complete job');
    }
  };

  return (
    <div className="modal-object--md">
      <div className="modal-header row bg-background-grey">
        <h5 className="col-10">Visit Detail - {event.extendedProps?.meta?.job?.jobFor?.fullName}</h5>
        <div className="col-2">
          <span onClick={closeModal} className="pointer d-flex float-end">
            <box-icon name="x" />
          </span>
        </div>
      </div>
      <div className="modal-body">
        <div className="row">
          <div
            onClick={() => {
              setCompleteJobFor(event.extendedProps?.meta?.job);
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
              <div>No Team Assigned</div>
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
        <button onClick={() => navigate('/dashboard/quotes/123456')} type="button" className="btn btn-primary">
          View details
        </button>
        <button onClick={closeModal} type="button" className="btn btn-secondary">
          Edit
        </button>
        <Modal isOpen={completeJobFor} onRequestClose={() => setCompleteJobFor(null)}>
          <CompleteJob completeJob={completeJobHandler} closeModal={() => setCompleteJobFor(null)} job={completeJobFor} />
        </Modal>
      </div>
    </div>
  );
};

export default EditEvent;
