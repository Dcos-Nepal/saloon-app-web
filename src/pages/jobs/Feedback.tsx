import StarRating from 'common/components/StarRating';

const Feedback = ({ closeModal, job }: { job: any; closeModal: () => void }) => {
  return (
    <div className="modal-content lg">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          Job Feedback
        </h5>
        <button onClick={() => closeModal()} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form className="was-validated">
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="validationTextarea" className="form-label">
              Feedback:
            </label>
            <textarea rows={8} className="form-control" id="validationTextarea" placeholder="Required feedback" required />
            <div className="invalid-feedback">Please enter a feedback.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="additional-doc" className="form-label">
              Ratings:
            </label>
            <StarRating totalStars={5} onClick={() => {}} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-primary">
            Send Feedback
          </button>
          <button onClick={() => closeModal()} type="button" className="ms-2 btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;
