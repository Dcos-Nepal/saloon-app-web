import { InfoIcon, PencilIcon, XIcon } from '@primer/octicons-react';
import Modal from 'common/components/atoms/Modal';
import SelectField from 'common/components/form/Select';
import { DateTime } from 'luxon';
import { FC, useState } from 'react';
import { updateStatus } from 'services/visits.service';
import StatusChangeWithReason from './BookingStatusChange';

interface IProps {
  event: any;
  closeModal: () => void;
  handleEventEdit: (data: any) => void;
}

const bookingStatusOptions = [
  {label: "BOOKED", value: "BOOKED"},
  {label: "RE_SCHEDULED", value: "RE_SCHEDULED"},
  {label: "VISITED", value: "VISITED"},
  {label: "NOT_VISITED", value: "NOT_VISITED"},
  {label: "PNR", value: "PNR"},
  {label: "CANCELLED", value: "CANCELLED"}
];

const ScheduleEventDetail: FC<IProps> = ({ closeModal, event, handleEventEdit}) => {
  const [meta, setMeta] = useState(event?.extendedProps?.meta || event.meta);

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

  const Status = ({ obj }: { obj: any }) => {
    const [statusChangeInProgress, setStatusChangeInProgress] = useState('');

    const handleStatusChange = async (id: string, data: any) => {
      const updatedBooking = await updateStatus(id, data);
      setMeta({...updatedBooking.data.data.data, customer: obj.customer});
      setStatusChangeInProgress('');
    };

    return (
      <div style={{ minWidth: '150px' }}>
        <SelectField
          label=""
          options={bookingStatusOptions}
          isClearable={false}
          value={obj.status.status}
          placeholder="Select Booking Status"
          handleChange={(selected: { label: string; value: string }) => {
            setStatusChangeInProgress(selected.value);
          }}
          helperComponent={<div className="">{obj.status?.reason ? <><InfoIcon className='mt-2'/> <span>{obj.status?.reason || ''}</span></> : null}</div>}
        />
        <Modal isOpen={!!statusChangeInProgress} onRequestClose={() => setStatusChangeInProgress('')}>
          <StatusChangeWithReason
            id={obj.id}
            statusData={obj.status}
            status={bookingStatusOptions.find((statusLabelValue) => statusLabelValue.value === statusChangeInProgress)}
            onSave={handleStatusChange}
            closeModal={() => setStatusChangeInProgress('')}
          />
        </Modal>
      </div>
    );
  };

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Visit Detail - {getCustomerInfo(meta).fullName}</h5>
            <div className="row">
              <div className="col btn cursor-pointer" onClick={() => handleEventEdit(meta)}><PencilIcon size={16} /></div>
              <div className="col btn cursor-pointer" onClick={closeModal}><XIcon size={22}/></div>
            </div>
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
                      <Status obj={meta} />
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
                  {DateTime.fromJSDate(new Date(meta.status.date)).toFormat('yyyy-MM-dd hh:mm a')}
                </div>
              </div>
              <div className="col">
                <h5>Created Date</h5>
                <div>
                  {DateTime.fromJSDate(new Date(meta.createdAt)).toFormat('yyyy-MM-dd hh:mm a')}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {meta.customer ? (
              <button type="button"  disabled={true} className="btn btn-secondary" onClick={() => {}}>
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
