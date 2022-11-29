import { FC } from 'react';
import BookingFrom from './BookingForm';

interface IProps {
  closeModal: () => void;
  saveHandler: (data: any) => any;
  updateHandler: (id: string, data: any) => any;
  bookingDetails: any;
}

const AddBookingForm: FC<IProps> = ({ closeModal, saveHandler, updateHandler, bookingDetails }) => {
  // format the booking object here
  const dt = new Date(bookingDetails?.bookingDate);
  const bookingObj = {
    id: !!bookingDetails ? bookingDetails?.id : '',
    customer: !!bookingDetails?.customer ? bookingDetails?.customer?.id : '',
    fullName: bookingDetails?.fullName || '',
    phoneNumber: bookingDetails?.phoneNumber || '',
    description: bookingDetails?.description || '',
    address: bookingDetails?.address || '',
    type: bookingDetails?.type || '',
    bookingDate: !!dt ? `${dt.getFullYear()}-${`${dt.getMonth() +1}`.padStart(2,'0')}-${`${dt.getDate()}`.padStart(2,'0')}T${`${dt.getHours()}`.padStart(2,'0')}:${`${dt.getMinutes()}`.padStart(2, '0')}` : ''
  }

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog mt-5">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="col">Add New Booking</h5>
            <div className="col">
              <span onClick={closeModal} className="pointer d-flex float-end">
                <box-icon name="x" />
              </span>
            </div>
          </div>
          <BookingFrom saveHandler={saveHandler} closeModal={closeModal} bookingDetails={bookingObj} updateHandler={updateHandler}/>
        </div>
      </div>
    </div>
  );
};

export default AddBookingForm;
