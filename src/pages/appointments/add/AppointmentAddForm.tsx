import * as Yup from 'yup';
import { useState } from 'react';
import { getIn, useFormik } from 'formik';
import { ClockIcon, StopIcon } from '@primer/octicons-react';

import TextArea from 'common/components/form/TextArea';
import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';
import { Loader } from 'common/components/atoms/Loader';
import { getAppoinmentVeriation, getAppointmentTypes, getServices } from 'data';
import { DateTime } from 'luxon';

const AppointmentAddForm = ({ closeModal, client, saveHandler }: { client?: any; closeModal: () => void; saveHandler: (data: any) => any }) => {
  const initialValues = {
    customer: client._id,
    type: '',
    services: [],
    appointmentDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-MM-dd'),
    appointmentTime: DateTime.fromJSDate(new Date()).toFormat('hh:mm'),
    notes: '',
    session: 0,
    interval: 'REGULAR'
  };

  const [isLoading, setIsLoading] = useState(false);

  const LineItemFormSchema = Yup.object().shape({
    customer: Yup.string().required('Customer is required'),
    type: Yup.string().required('Type is required'),
    appointmentDate: Yup.string().required('Date is required'),
    appointmentTime: Yup.string().required('Time is required'),
    services: Yup
      .array()
      .when("type", {
        is: 'TREATMENT',
        then: Yup.array()
          .min(1, 'Please select at least 1 servce')
          .of(Yup.string()).required("Please select the services")
      }),
    interval: Yup
      .string()
      .when("type", {
        is: 'MAINTAINANCE',
        then: Yup.string().required("Please select the interval")
      }),
    session: Yup
      .number()
      .when("type", {
        is: 'MAINTAINANCE',
        then: Yup.number().nullable()
      })
      .min(0, 'Session should be greater than 0')
      .required('Session is required'),
    notes: Yup.string().optional(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: LineItemFormSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      // Preparing the data
      data.createdDate = new Date().toISOString();
      data.status = {
        name: 'WAITING',
        date: new Date().toISOString(),
        duration: ''
      };

      setIsLoading(true);
      await saveHandler(data);
      setIsLoading(false);
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
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog mt-5">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><ClockIcon className='m-1'/> Appointment for <strong>{client.name}</strong></h5>
              <button type="button" className="btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Loader isLoading={isLoading} />
              <SelectField
                label="Appointment Type"
                name="type"
                isMulti={false}
                value={formik.values.type}
                options={getAppointmentTypes().filter((service) => service.isActive)}
                helperComponent={<ErrorMessage name="type" />}
                handleChange={(selectedTag: IOption) => {
                  formik.setFieldValue('type', !!selectedTag ? selectedTag.value : '');
                }}getAppoinmentVeriation
                onBlur={formik.handleBlur}
              />

              {formik.values.type === 'TREATMENT' ? (
                <SelectField
                  label="Products or Services"
                  name="services"
                  isMulti={true}
                  value={formik.values.services}
                  options={getServices().filter((service) => service.isActive)}
                  helperComponent={<ErrorMessage name="services" />}
                  handleChange={(selectedTags: IOption[]) => {
                    formik.setFieldValue(
                      'services',
                      selectedTags.map((tagOption) => tagOption.value)
                    );
                  }}
                  onBlur={formik.handleBlur}
                />
              ): null}

              {formik.values.type === 'MAINTAINANCE' ? (
                <SelectField
                  label="Appointment Interval"
                  name="interval"
                  isMulti={false}
                  value={formik.values.interval}
                  options={getAppoinmentVeriation().filter((service) => service.isActive)}
                  helperComponent={<ErrorMessage name="interval" />}
                  handleChange={(selectedTags: IOption) => {
                    formik.setFieldValue('interval', !!selectedTags ? selectedTags.value : '');
                  }}
                  onBlur={formik.handleBlur}
                />
              ): null}

              {formik.values.type === 'TREATMENT' ? (
                <InputField
                  label="Session Name"
                  type="number"
                  placeholder="Select Session"
                  name="session"
                  value={formik.values.session}
                  onChange={formik.handleChange}
                  helperComponent={<ErrorMessage name="session"/>}
                />
              ) : null}

              <div className='row'>
                <div className='col'>
                  <InputField
                    label="Appointment Date"
                    type="date"
                    placeholder="Select Date"
                    name="appointmentDate"
                    value={formik.values.appointmentDate}
                    onChange={formik.handleChange}
                    helperComponent={<ErrorMessage name="appointmentDate"/>}
                  />
                </div>
                <div className='col'>
                  <InputField
                    label="Appointment Time"
                    type="time"
                    placeholder="Select Time"
                    name="appointmentTime"
                    value={formik.values.appointmentTime}
                    onChange={formik.handleChange}
                    helperComponent={<ErrorMessage name="appointmentTime"/>}
                  />
                </div>
              </div>
              
              <TextArea
                rows={5}
                label={'Appointment Notes:'}
                placeholder="Enter Notes"
                name="description"
                value={formik.values.notes || ''}
                onChange={({ target }: { target: { value: string } }) => {
                  if (target.value !== formik.values.notes) formik.setFieldValue('notes', target.value);
                }}
                helperComponent={<ErrorMessage name="notes" />}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="modal-footer">
              <button disabled={isLoading} type="submit" className="btn btn-primary">
                Save
              </button>
              <button onClick={() => closeModal()} type="button" className="ms-2 btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AppointmentAddForm;
