import * as Yup from 'yup';
import { getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';
import TextArea from 'common/components/form/TextArea';

const StatusChangeWithReason = ({ id, status, onSave, closeModal }: any) => {
  const InitialValues = {
    reason: ''
  };

  const StatusReasonSchema = Yup.object().shape({
    reason: Yup.string().required('Please provide an reason.')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitialValues,
    onSubmit: async (data: any) => {
      // Prepare Payload
      data.id = id;
      data.status = {
        name: status.value,
        reason: data.reason
      };

      delete data.reason;
      await onSave(data.id, data);
      closeModal();
    },
    validationSchema: StatusReasonSchema
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
            <h5 className="modal-title">Update Status</h5>
            <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form no-validate="true" onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="validationTextarea" className="form-label">
                  Changing status to:
                </label>
                <div className="txt-bold">{status?.label || ''}</div>
              </div>

              <div className="mb-3">
                <TextArea
                  rows={8}
                  label={'Reason/Notes:'}
                  placeholder={`Add reasons for the status change`}
                  name="reason"
                  value={formik.values.reason || ''}
                  onChange={({ target }: { target: { value: string } }) => {
                    if (target.value !== formik.values.reason) formik.setFieldValue('reason', target.value);
                  }}
                  helperComponent={<ErrorMessage name="reason" />}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Update Status
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeWithReason;
