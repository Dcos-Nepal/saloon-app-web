import { FC } from 'react';

interface IProps {
  event: any;
  closeModal: () => void;
}

const ScheduleEventDetail: FC<IProps> = ({ closeModal, event }) => {
  const meta = event.extendedProps?.meta;

  const getCustomerInfo = (meta: any) => {
    if (meta.customer) {
      return meta.customer;
    } else {
      return {
        fullName: meta.fullName,
        phoneNumber: meta.phoneNumber,
        address: meta.address
      };
    }
  }

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Detail - {getCustomerInfo(meta).fullName}</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '600px' }}>
            <div className="row">
              <h5>Booking Details</h5>
              <div>Booking for {getCustomerInfo(meta).fullName}</div>
              <div className="mt-3">
                <div className='row mt-2 d-flex align-items-center'>
                  <div className="col">
                    <label>
                      <strong>Booking Status</strong>
                    </label>
                    <div className="mt-1">
                      <span className={`status status-${meta?.status?.status === 'COMPLETED' ? 'green' : 'blue'}`}>
                        {meta?.status?.status}
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <label>
                      <strong>Booking Type</strong>
                    </label>
                    <div className="mt-1">
                      <span className="status status-blue">{meta?.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <h5>Client Details</h5>
              <div>
                <div><b>Name: </b>{getCustomerInfo(meta).fullName}</div>
                <div><b>Address: </b> {getCustomerInfo(meta).address}</div>
                <div><b>Phone Number: </b> {getCustomerInfo(meta).phoneNumber}</div>
                <div><b>Description: </b> {meta.description}</div>
              </div>
            </div>

            <div className="hr mb-3"></div>

            <div className="row">
              <div className="col">
                <h5>Booking Date</h5>
                <div>
                  {new Date(meta.bookingDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {meta.customer ? (
              <button type="button" className="btn btn-secondary" onClick={() => {}}>
                Convert to Client 
              </button>
            ) : null}
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
