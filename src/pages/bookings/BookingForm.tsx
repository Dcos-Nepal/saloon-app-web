import * as Yup from 'yup';
import { useState } from 'react';
import { getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';

import TextArea from 'common/components/form/TextArea';
import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';
import { getAppointmentTypes } from 'data';

const BookingFrom = ({ closeModal, saveHandler }: { closeModal: () => void; saveHandler: (data: any) => any }) => {
  const initialValues = {
    fullName: '',
    phoneNumber: '',
    description: '',
    address: '',
    type: 'CONSULTANT',
    bookingDate: ''
  };

  const [isLoading, setIsLoading] = useState(false);

  const LineItemFormSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    description: Yup.string().optional(),
    address: Yup.string(),
    phoneNumber: Yup.string().required('Phone Number is required'),
    type: Yup.string().required('Type is required'),
    bookingDate: Yup.date().required('Booking date is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: LineItemFormSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
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
      <div className="modal-body">
        <Loader isLoading={isLoading} />
        <InputField
          label="Name"
          type="text"
          placeholder="Enter name"
          name={`fullName`}
          value={formik.values.fullName}
          onChange={formik.handleChange}
          helperComponent={<ErrorMessage name="fullName" />}
        />

        <InputField
          label="Phone Number"
          type="text"
          placeholder="Enter Phone Number"
          name={`phoneNumber`}
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          helperComponent={<ErrorMessage name="phoneNumber" />}
        />

        <TextArea
          rows={2}
          label={'Address:'}
          placeholder="Enter address"
          name="address"
          value={formik.values.address || ''}
          onChange={({ target }: { target: { value: string } }) => {
            if (target.value !== formik.values.address) formik.setFieldValue('address', target.value);
          }}
          helperComponent={<ErrorMessage name="address" />}
          onBlur={formik.handleBlur}
        />

        <InputField
          label="Booking Date"
          type="datetime-local"
          placeholder="Enter booking date"
          name={`bookingDate`}
          value={formik.values.bookingDate}
          onChange={formik.handleChange}
          helperComponent={<ErrorMessage name="bookingDate" />}
        />

        <SelectField
          label="Appointment Type"
          name="type"
          isMulti={false}
          value={getAppointmentTypes().find((service) => formik.values.type === service.value)}
          options={getAppointmentTypes().filter((service) => service.isActive)}
          helperComponent={<ErrorMessage name="type" />}
          handleChange={(selectedTag: IOption) => {
            formik.setFieldValue('type', selectedTag.value);
          }}getAppoinmentVeriation
          onBlur={formik.handleBlur}
        />

        <TextArea
          rows={5}
          label={'Description:'}
          placeholder="Enter description"
          name="description"
          value={formik.values.description || ''}
          onChange={({ target }: { target: { value: string } }) => {
            if (target.value !== formik.values.description) formik.setFieldValue('description', target.value);
          }}
          helperComponent={<ErrorMessage name="description" />}
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
    </form>
  );
};

export default BookingFrom;
