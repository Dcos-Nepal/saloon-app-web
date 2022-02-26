import * as Yup from 'yup';

import StarRating from 'common/components/StarRating';
import { FormikProvider, getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';
import TextArea from 'common/components/form/TextArea';

const Feedback = ({ closeModal, job, provideFeedback }: { job: any; closeModal: () => void; provideFeedback: (data: any) => any }) => {
  const FeedbackSchema = Yup.object().shape({
    note: Yup.string().required('Feedback is required'),
    rating: Yup.number().required('Rating is required').min(1, 'Please provide rating')
  });

  const initialValues = {
    note: '',
    rating: 0
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: FeedbackSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      await provideFeedback({ ...data, date: new Date().toISOString() });
    }
  });

  /**
   * Custom Error Message
   * @param param0 Props Object
   * @returns JSX
   */
  const ErrorMessage = ({ name }: any) => {
    if (!name) return <></>;

    const error = getIn(formik.errors, name);
    const touch = getIn(formik.touched, name);

    return (touch && error) || error ? (
      <div className="row txt-red">
        <div className="col-1" style={{ width: '20px' }}>
          <StopIcon size={14} />
        </div>
        <div className="col">{error}</div>
      </div>
    ) : null;
  };

  return (
    <div className="modal-content lg">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          Job Feedback
        </h5>
        <button onClick={() => closeModal()} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form noValidate onSubmit={formik.handleSubmit} className="was-validated">
        <FormikProvider value={formik}>
          <div className="modal-body">
            <div className="mb-3">
              <TextArea
                rows={8}
                label={'Feedback:'}
                placeholder="Required feedback"
                name="note"
                value={formik.values.note || ''}
                onChange={({ target }: { target: { value: string } }) => {
                  if (target.value !== formik.values.note) formik.setFieldValue('note', target.value);
                }}
                helperComponent={<ErrorMessage name="note" />}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="additional-doc" className="form-label">
                Ratings:
              </label>
              <StarRating
                totalStars={5}
                onValueChange={(val: number) => {
                  if (val !== formik.values.rating) formik.setFieldValue('rating', val);
                }}
              />
              <ErrorMessage name="rating" />
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
        </FormikProvider>
      </form>
    </div>
  );
};

export default Feedback;
