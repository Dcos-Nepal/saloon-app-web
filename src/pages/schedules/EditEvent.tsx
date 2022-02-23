import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  event: any;
  closeModal: () => void;
}

const EditEvent: FC<IProps> = ({ closeModal, event }) => {
  const navigate = useNavigate();

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
          <div>
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
            <label><strong>Visit Status</strong></label>
            <div className="mt-1">
              {event.extendedProps?.meta?.status?.status === 'COMPLETED'
                ? <span className="status status-green">{event.extendedProps?.meta?.status?.status}</span>
                : <span className="status status-blue">{event.extendedProps?.meta?.status?.status}</span>}
            </div>
          </div>
        </div>

        <div className="hr mb-3"></div>

        <div className="row">
          <h5>Team</h5>
          <div>
            {event.extendedProps?.meta?.job?.team
              ? event.extendedProps?.meta?.job?.team.map((mem: { fullName: string }) => (<><span className="status status-blue">{mem.fullName}</span> &nbsp;</>))
              : <div>No Team Assigned</div>
            }
          </div>
        </div>

        <div className="hr mb-3"></div>

        <div className="row">
          <h5>Property Location</h5>
          <div className="txt-grey">{event.extendedProps?.meta?.job?.property.name}</div>
          <div className="">
            {event.extendedProps?.meta?.job?.property?.street1}, {event.extendedProps?.meta?.job?.property?.postalCode}, {event.extendedProps?.meta?.job?.property?.city}, {event.extendedProps?.meta?.job?.property?.state}, {event.extendedProps?.meta?.job?.property?.country}
          </div>
        </div>

        <div className="hr mb-3"></div>

        <div className="row">
          {event.start ? (<div className="col">
            <h5>Start Date/Time</h5>
            <div>{new Date(event.start).toLocaleDateString()}</div>
            <div>{new Date(event.start).toLocaleTimeString()}</div>
          </div>) : null}
          {event.end ? (<div className="col">
            <h5>End Date/Time</h5>
            <div>{new Date(event.end).toLocaleDateString()}</div>
            <div>{new Date(event.end).toLocaleTimeString()}</div>
          </div>) : null}
          
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={() => navigate('/dashboard/quotes/123456')} type="button" className="btn btn-primary">
          View details
        </button>
        <button
          onClick={closeModal}
          type="button"
          className="btn btn-secondary"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default EditEvent;
