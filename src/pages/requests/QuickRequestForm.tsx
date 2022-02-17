import * as Yup from 'yup';
import { useFormik } from 'formik';

const AddRequestForm = (props: any) => {
  const InitJobRequest = {
    email: '',
    password: '',
  };

  const JobRequestSchema = Yup.object().shape({
    email: Yup.string().required('Please provide an email.').email('Invalid email provided'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitJobRequest,
    onSubmit: async (userData: any) => {
      // Making a User Login Request

      // props.actions.signInUser(userData);
    },
    validationSchema: JobRequestSchema,
  });

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Job Request</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form className="was-validated" onSubmit={formik.handleSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="request-title" className="form-label">Request Title:</label>
              <input type="text" className="form-control" id="request-title" placeholder="Required example" required />
              <div className="invalid-feedback">
                Please enter a message in the input.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="select-client" className="form-label">Select Client</label>
              <select className="form-select" id="select-client" required aria-label="select example">
                <option value="">Select Client</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
              <div className="invalid-feedback">Example invalid select feedback</div>
            </div>
            <div className="mb-3">
              <label htmlFor="validationTextarea" className="form-label">Job Details:</label>
              <textarea className="form-control" id="validationTextarea" placeholder="Required example textarea" required />
              <div className="invalid-feedback">
                Please enter a message in the textarea.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="any-notes" className="form-label">Notes/Instructions:</label>
              <textarea className="form-control" id="any-notes" placeholder="Required example textarea" required />
              <div className="invalid-feedback">
                Please enter a message in the textarea.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="additional-doc" className="form-label">Any Files/Docs:</label>
              <input type="file" className="form-control" id="additional-doc" aria-label="doc" required />
              <div className="invalid-feedback">Example invalid form file feedback</div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" className="btn btn-primary">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRequestForm;
