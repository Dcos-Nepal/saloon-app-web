import * as Yup from 'yup';
import { useState } from 'react';
import { getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';

import SelectAsync from 'common/components/form/AsyncSelect';
import TextArea from 'common/components/form/TextArea';
import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';
import { getAppointmentTypes } from 'data';

interface IProps {
  closeModal: () => void;
  saveHandler: (data: any) => any;
  updateHandler: (id: string, data: any) => any;
  bookingDetails: any;
}

const BookingFrom = ({ closeModal, saveHandler, updateHandler, bookingDetails }: IProps) => {
  const initialValues = !!bookingDetails ? bookingDetails : {
    customer: '',
    fullName: '',
    phoneNumber: '',
    description: '',
    address: '',
    type: 'CONSULATION',
    bookingDate: ''
  };

  const [isLoading, setIsLoading] = useState(false);

  const LineItemFormSchema = Yup.object().shape({
    customer: Yup.string().nullable().notRequired(),
    fullName: Yup
      .string()
      .when("customer", {
        is: (customer: string) => !customer,
        then: Yup.string().required('Name is required'),
      }),
    description: Yup.string().optional(),
    address: Yup.string(),
    phoneNumber: Yup
      .string()
      .when("customer", {
        is: (customer: string) => !customer,
        then: Yup.string().required('Phone Number is required'),
      }),
    type: Yup
      .string()
      .when("customer", {
        is: (customer: string) => !customer,
        then: Yup.string().required('Type is required'),
      }),
    bookingDate: Yup
      .string()
      .when("customer", {
        is: (customer: string) => !customer,
        then: Yup.string().required('Booking date is required'),
      })
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: LineItemFormSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      setIsLoading(true);
      data.status = {
        status: 'BOOKED',
        date: new Date(data.bookingDate).toISOString(),
        reason: '',
        updatedBy: null,
      }

      if (!data.customer) delete data.customer;

      // Remove the booking date
      delete data.bookingDate;

      if (data?.id) {
        await updateHandler(data?.id, data);
      } else {
        await saveHandler(data);
      }

      setIsLoading(false);
    }
  });

  /**
   * Handles Client selection
   */
   const handleClientSelection = async (event: any) => {
    formik.setFieldValue(`customer`, event ? event.value : '');
  };

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
        <div className='row'>
          <SelectAsync
            name={`customer`}
            label="Select Client"
            value={formik.values.customer}
            resource={{ name: 'customers', labelProp: 'fullName', valueProp: '_id'}}
            onChange={handleClientSelection}
            preload={true}
          />
          <ErrorMessage name={`customer.value`} />
        </div>

        { (!formik.values.customer) ? (
          <>
            <div className='row'>
              <div className='col'>
                <InputField
                  label="Name"
                  type="text"
                  placeholder="Enter name"
                  name={`fullName`}
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  helperComponent={<ErrorMessage name="fullName" />}
                />
              </div>
              <div className='col'>
                <InputField
                  label="Phone Number"
                  type="text"
                  placeholder="Enter Phone Number"
                  name={`phoneNumber`}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  helperComponent={<ErrorMessage name="phoneNumber" />}
                />
              </div>
            </div>
            
            <div className='row'>
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
            </div>
          </>
        ) : null}
        
        <div className='row'>
          <div className='col'>
            <InputField
              label="Booking Date"
              type="datetime-local"
              placeholder="Enter booking date"
              name={`bookingDate`}
              value={formik.values.bookingDate}
              onChange={formik.handleChange}
              helperComponent={<ErrorMessage name="bookingDate" />}
            />
          </div>
          <div className='col'>
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
          </div>
        </div>

        <div className='row'>
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
