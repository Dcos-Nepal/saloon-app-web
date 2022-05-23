import { FC } from 'react';
import ServiceForm from '../ServiceForm';

interface IProps {
  closeModal: () => void;
  saveHandler: (data: any) => any;
  lineItem: any;
}

const ServiceEdit: FC<IProps> = ({ closeModal, saveHandler, lineItem }) => {
  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog mt-5">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="col">Edit Service</h5>
            <div className="col">
              <span onClick={closeModal} className="pointer d-flex float-end">
                <box-icon name="x" />
              </span>
            </div>
          </div>
          <ServiceForm lineItem={lineItem} saveHandler={saveHandler} closeModal={closeModal} />
        </div>{' '}
      </div>
    </div>
  );
};

export default ServiceEdit;
