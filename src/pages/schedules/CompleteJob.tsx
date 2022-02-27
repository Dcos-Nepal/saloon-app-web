import * as Yup from 'yup';
import { FormikProvider, getIn, useFormik } from 'formik';

import { PlusCircleIcon, StopIcon, XCircleIcon } from '@primer/octicons-react';
import { getData } from 'utils/storage';
import TextArea from 'common/components/form/TextArea';

const CompleteJob = ({ closeModal, job, completeJob }: { job: any; closeModal: () => void; completeJob: (data: any) => any }) => {
  const initialValues = {
    note: '',
    docs: [
      {
        url: '',
        key: ''
      }
    ],
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
        await completeJob({
          ...data,
          docs: data.docs.filter((doc: { url?: string }) => doc.url),
          date: new Date().toISOString(),
          completedBy: currentUser?._id
        });
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
    <div className="modal-content lg">
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
