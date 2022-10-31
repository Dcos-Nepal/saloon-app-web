import { FC } from 'react';

interface IProps {
  event: any;
  closeModal: () => void;
}

const ScheduleEventDetail: FC<IProps> = ({ closeModal, event }) => {
  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Detail - {event.extendedProps?.meta?.fullName}</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '600px' }}>
            <div className="row">
              <h5>Booking Details</h5>
              <div>Booking for {event.extendedProps?.meta?.fullName}</div>
              <div className="mt-3">
                <div className='row mt-2 d-flex align-items-center'>
                  <div className="col">
                    <label>
                      <strong>Booking Status</strong>
                    </label>
                    <div className="mt-1">
                      <span className={`status status-${event.extendedProps?.meta?.status?.status === 'COMPLETED' ? 'green' : 'blue'}`}>
                        {event.extendedProps?.meta?.status?.status}
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <label>
                      <strong>Booking Type</strong>
                    </label>
                    <div className="mt-1">
                      <span className="status status-blue">{event.extendedProps?.meta?.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Client Details</h5>
              <div>
                <div><b>Name: </b>{event.extendedProps?.meta.fullName}</div>
                <div><b>Address: </b> {event.extendedProps?.meta.address}</div>
                <div><b>Phone Number: </b> {event.extendedProps?.meta.phoneNumber}</div>
                <div><b>Description: </b> {event.extendedProps?.meta.description}</div>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <div className="col">
                <h5>Booking Date</h5>
                <div>
                  {new Date(event.extendedProps?.meta.bookingDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
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
