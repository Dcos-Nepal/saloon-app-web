import { PlusCircleIcon, XCircleIcon } from '@primer/octicons-react';

const CompleteJob = ({ closeModal, job }: { job: any; closeModal: () => void }) => {
  return (
    <div className="modal-content lg">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          Complete Job
        </h5>
        <button onClick={() => closeModal()} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form className="was-validated">
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="validationTextarea" className="form-label">
              Notes:
            </label>
            <textarea rows={8} className="form-control" id="validationTextarea" placeholder="Required notes" required />
            <div className="invalid-feedback">Please enter a notes.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="additional-doc" className="form-label">
              Files:
            </label>
            <input className="form-control hidden" id="file" type="file" />
            <label htmlFor={'file'} className="txt-orange dashed-file">
              {'Please select documents'}
            </label>
            <div className="row">
              <div className="col">
                <input className="form-control hidden" id="file2" type="file" />
                <label htmlFor={'file2'} className="txt-orange dashed-file mt-2">
                  {'Please select documents'}
                </label>
              </div>
              <div className="col-2 mt-5 ps-1 pointer text-center">
                <span className="mr-2" onClick={() => {}}>
                  <PlusCircleIcon size={20} />
                </span>
                &nbsp;&nbsp;
                <span onClick={() => {}}>
                  <XCircleIcon size={20} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-primary">
            Complete Job
          </button>
          <button onClick={() => closeModal()} type="button" className="ms-2 btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteJob;
