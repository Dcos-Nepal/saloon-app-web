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
import { getPaymentTypes } from 'data';

interface IProps {
  closeModal: () => void;
  saveHandler: (data: any) => any;
  updateHandler: (id: string, data: any) => any;
  packageClient: any;
}

const PackageClientForm = ({ closeModal, saveHandler, updateHandler, packageClient }: IProps) => {
  const initialValues = !!packageClient ? packageClient : {
    customer: '',
    paymentType: 'CASH',
    packagePaidDate: '',
    noOfSessions: 0
  };

  const [isLoading, setIsLoading] = useState(false);

  const PackageClientSchema = Yup.object().shape({
    customer: Yup.string().nullable().notRequired(),
    description: Yup.string().optional(),
    paymentType: Yup
      .string()
      .when("customer", {
        is: (customer: string) => !customer,
        then: Yup.string().required('Payment Type is required'),
      }),
    noOfSessions: Yup.number().required('No of sessions is required'),
    packagePaidDate: Yup
      .string()
      .when("customer", {
        is: (customer: string) => !customer,
        then: Yup.string().required('Package payment date is required'),
      })
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: PackageClientSchema,
    validateOnChange: true,
    onSubmit: async (data: any) => {
      setIsLoading(true);

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
            resource={{ name: 'customers', labelProp: 'fullName', valueProp: '_id' }}
            onChange={handleClientSelection}
            preload={true}
          />
          <ErrorMessage name={`customer.value`} />
        </div>

        <div className='row'>
          <div className='col'>
            <InputField
              label="Booking Date"
              type="datetime-local"
              placeholder="Enter booking date"
              name={`packagePaidDate`}
              value={formik.values.packagePaidDate}
              onChange={formik.handleChange}
              helperComponent={<ErrorMessage name="packagePaidDate" />}
            />
          </div>
          <div className='col'>
            <SelectField
              label="Payment Type"
              name="paymentType"
              isMulti={false}
              value={formik.values.paymentType}
              options={getPaymentTypes().filter((type) => type.isActive)}
              helperComponent={<ErrorMessage name="paymentType" />}
              handleChange={(selectedTag: IOption) => {
                formik.setFieldValue('paymentType', !!selectedTag ? selectedTag.value : '');
              }} getAppoinmentVeriation
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

        <div className='row'>
          <InputField
            label="Recommended Sessions"
            type="number"
            placeholder="Enter no. of sessions"
            name={`noOfSessions`}
            value={formik.values.noOfSessions}
            onChange={formik.handleChange}
            helperComponent={<ErrorMessage name="noOfSessions" />}
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

export default PackageClientForm;
