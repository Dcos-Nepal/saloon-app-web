import * as Yup from 'yup';
import { getIn, useFormik } from 'formik';
import { StopIcon, XCircleIcon } from '@primer/octicons-react';

import { getData } from 'utils/storage';
import TextArea from 'common/components/form/TextArea';

const CompleteJob = ({ closeModal, job, completeJob }: { job: any; closeModal: () => void; completeJob: (data: any) => any }) => {
  const initialValues = {
    note: '',
    docs: [],
    completedBy: '',
    date: null
  };

  const CompleteJobSchema = Yup.object().shape({
    note: Yup.string().required('Note is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: CompleteJobSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      const currentUser = getData('user');
      if (currentUser?._id) {
        let formData = new FormData();
        data.docs.forEach((doc: any) => formData.append('docs[]', doc));
        formData.append('note', data.note);
        formData.append('date', new Date().toISOString());
        formData.append('completedBy', currentUser?._id);

        await completeJob(formData);
      }
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
    <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog mt-5">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Complete Job
            </h5>
            <button onClick={() => closeModal()} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form className="was-validated" onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <TextArea
                  rows={8}
                  label={'Notes:'}
                  placeholder="Required notes"
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
                  Files:
                </label>
                {formik.values.docs.map((doc: any, index: number) => (
                  <div className="row mb-3 ps-1" key={index}>
                    <div className="col-9">
                      <span className="mt-1 btn btn-secondary btn-sm">{doc.name}</span>
                    </div>
                    <div className="col mt-2"></div>
                    <div className="col-2 mt-2 pointer text-center">
                      <span
                        onClick={() => {
                          const docs = [...formik.values.docs];
                          docs.splice(index, 1);

                          formik.setFieldValue('docs', docs);
                        }}
                      >
                        <XCircleIcon size={20} />
                      </span>
                    </div>
                  </div>
                ))}
                <div className="">
                  <input
                    className="form-control hidden"
                    id="file"
                    type="file"
                    value={undefined}
                    onChange={(event) => {
                      if (event.target.files?.length) formik.setFieldValue(`docs`, [...formik.values.docs, event.target.files[0]]);
                    }}
                  />
                  <label htmlFor={'file'} className="txt-orange dashed-file mt-2">
                    Select document to upload
                  </label>
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
      </div>
    </div>
  );
};

export default CompleteJob;
