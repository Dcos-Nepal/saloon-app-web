import * as Yup from 'yup';
import { getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';
import TextArea from 'common/components/form/TextArea';
import InputField from 'common/components/form/Input';

const StatusChangeWithReason = ({ id, status, onSave, closeModal, statusData }: any) => {
  const dt = statusData?.date ? new Date(statusData.date) : new Date();
  const InitialValues = {
    reason: '',
    date: `${dt.getFullYear()}-${`${dt.getMonth() +1}`.padStart(2,'0')}-${`${dt.getDate()}`.padStart(2,'0')}T${`${dt.getHours()}`.padStart(2,'0')}:${`${dt.getMinutes()}`.padStart(2, '0')}`
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
        status: status.value,
        reason: data.reason,
        date: new Date(data.date).toISOString() || new Date().toISOString()
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
              <InputField
                label="Booking Date"
                type="datetime-local"
                placeholder="Enter booking date"
                name={`date`}
                value={formik.values.date}
                onChange={formik.handleChange}
                helperComponent={<ErrorMessage name="date" />}
                isRequired={false}
              />
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
