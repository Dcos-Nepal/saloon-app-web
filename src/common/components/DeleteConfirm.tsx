import { useState } from 'react';
import { Loader } from './atoms/Loader';

const DeleteConfirm = ({ content, onDelete, closeModal }: { content?: string; onDelete: any; closeModal: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteHandler = async () => {
    setIsLoading(true);

    await onDelete();

    setIsLoading(false);
  };

  return (
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog mt-5">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Are you sure you want to delete?</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <Loader isLoading={isLoading} />
            <div className="row">
              <div className="col">
                <div>{content ? content : 'Deleting this data will mark it as deleted from the system.'}</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={onDeleteHandler} disabled={isLoading}>
              Delete
            </button>
            <button type="button" className="btn btn--secondary" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
