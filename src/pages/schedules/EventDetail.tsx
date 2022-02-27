import { FC, useState } from 'react';

import CompleteJob from './CompleteJob';
import { IEvent } from 'common/types/events';
import { useNavigate } from 'react-router-dom';
import Modal from 'common/components/atoms/Modal';

interface IProps {
  event: IEvent;
  closeModal: () => void;
}

const EventDetail: FC<IProps> = ({ closeModal, event }) => {
  const navigate = useNavigate();
  const [completeJobFor, setCompleteJobFor] = useState<any | null>(null);

  return (
    <div className="modal-object--sm">
      <div className="modal-header row bg-background-grey">
        <h5 className="col-10">Mr. Dan Din - Regular clean</h5>
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
              setCompleteJobFor(event);
            }}
          >
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            <label className="ms-2 form-check-label" htmlFor="flexCheckDefault">
              Completed
            </label>
          </div>
        </div>

        <div className="hr mb-3"></div>

        <div className="row">
          <h5>Details</h5>
          <div>{event.title}</div>
        </div>

        <div className="hr mb-3"></div>

        <div className="row">
          <h5>Team</h5>
          <div>
            <span className="status status-blue">MOCK</span>
          </div>
        </div>

        <div className="hr mb-3"></div>

        <div className="row">
          <h5>Location</h5>
          <div>43 Halley Crescent / Mansfield Park, South Australia 5012</div>
        </div>

        <div className="hr mb-3"></div>

        <div className="row">
          <div className="col">
            <h5>Start Date/Time</h5>
            <div>{new Date(event.start).toLocaleDateString()}</div>
            <div>{new Date(event.start).toLocaleTimeString()}</div>
          </div>
          <div className="col">
            <h5>End Date/Time</h5>
            <div>{new Date(event.end).toLocaleDateString()}</div>
            <div>{new Date(event.end).toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={() => navigate('/dashboard/quotes/123456')} type="button" className="btn btn-primary">
          View details
        </button>
        <button onClick={closeModal} type="button" className="btn btn-secondary">
          Edit
        </button>
      </div>
      <Modal isOpen={completeJobFor} onRequestClose={() => setCompleteJobFor(null)}>
        <CompleteJob completeJob={() => {}} closeModal={() => setCompleteJobFor(null)} job={completeJobFor} />
      </Modal>
    </div>
  );
};

export default EventDetail;
