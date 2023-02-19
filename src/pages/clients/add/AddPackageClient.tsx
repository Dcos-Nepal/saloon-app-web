import { FC } from 'react';
import PackageClientForm from '../PackageClientForm';

interface IProps {
  closeModal: () => void;
  saveHandler: (data: any) => any;
  updateHandler: (id: string, data: any) => any;
  packageClient: any;
}

const AddPackageClient: FC<IProps> = ({ closeModal, saveHandler, updateHandler, packageClient }) => {
  const dt = packageClient?.packagePaidDate ? new Date(packageClient?.packagePaidDate) : new Date();
  const packageClientObj = {
    id: !!packageClient ? packageClient?.id : '',
    customer: !!packageClient?.customer ? packageClient?.customer?._id : '',
    paymentType: packageClient?.type || 'CASH',
    noOfSessions: packageClient?.noOfSessions || 0,
    isApproved: packageClient?.isApproved,
    description: packageClient?.description,
    packagePaidDate: `${dt.getFullYear()}-${`${dt.getMonth() +1}`.padStart(2,'0')}-${`${dt.getDate()}`.padStart(2,'0')}T${`${dt.getHours()}`.padStart(2,'0')}:${`${dt.getMinutes()}`.padStart(2, '0')}`
  }

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog mt-5">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="col">{packageClientObj?.id ? 'Update' : 'Add New'} Package Client</h5>
            <div className="col">
              <span onClick={closeModal} className="pointer d-flex float-end">
                <box-icon name="x" />
              </span>
            </div>
          </div>
          <PackageClientForm saveHandler={saveHandler} closeModal={closeModal} packageClient={packageClientObj} updateHandler={updateHandler}/>
        </div>
      </div>
    </div>
  );
};

export default AddPackageClient;
