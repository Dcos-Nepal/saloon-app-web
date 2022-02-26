import * as Yup from 'yup';
import { getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';
import TextArea from 'common/components/form/TextArea';

const StatusChangeWithReason = ({ id, status, onSave, closeModal }: any) => {
  const InitialValues = {
    id: id,
    reason: '',
    status: status
  };

  const StatusReasonSchema = Yup.object().shape({
    reason: Yup.string().required('Please provide an reason.')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitialValues,
    onSubmit: async (data: any) => {
      await onSave(data.id, data.status, data.reason);
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
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          Update Status
        </h5>
        <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
      </div>
      <form className="was-validated" onSubmit={formik.handleSubmit}>
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
              label={'Reason:'}
              placeholder="Required reason"
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
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            Change Status
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusChangeWithReason;
