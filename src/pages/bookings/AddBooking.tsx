import { FC } from 'react';
import BookingFrom from './BookingForm';

interface IProps {
  closeModal: () => void;
  saveHandler: (data: any) => any;
}

const AddBookingForm: FC<IProps> = ({ closeModal, saveHandler }) => {
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
          <BookingFrom saveHandler={saveHandler} closeModal={closeModal} />
        </div>
      </div>
    </div>
  );
};

export default AddBookingForm;
