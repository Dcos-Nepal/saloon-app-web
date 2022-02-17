import { FC } from 'react';
import * as Yup from 'yup';
import { getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';

import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';

interface IProps {
  currentProperty?: any;
  cleanForm: () => void;
  saveProperty: (data: any) => any;
  updateProperty: (data: any) => any;
}

const PropertyForm: FC<IProps> = ({ cleanForm, currentProperty, saveProperty, updateProperty }) => {
  const initialValues = currentProperty
    ? currentProperty
    : {
      name: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    };

  const PropertySchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    street1: Yup.string().required(`Street 1 is required`),
    street2: Yup.string().notRequired(),
    city: Yup.string().required(`City is required`),
    state: Yup.string().required(`State is required`),
    postalCode: Yup.string().required(`Postal Code is required`),
    country: Yup.string().required(`Country is required`)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: PropertySchema,
    onSubmit: async (data: any) => {
      // For updating property
      if (currentProperty) await updateProperty(data);
      // For creating property
      else await saveProperty(data);
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

  const statesOption = [
    { label: 'New South Wales', value: 'New South Wales' },
    { label: 'New South', value: 'New South' },
    { label: 'New Wales', value: 'New Wales' }
  ];

  const countriesOption = [
    {
      label: 'AUS',
      value: 'AUS'
    },
    {
      label: 'USA',
      value: 'USA'
    }
  ];

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col">
          <InputField
            label="Property name"
            placeholder="Enter property name"
            name="name"
            helperComponent={<ErrorMessage name="name" />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
        </div>

        <div className="mb-2">
          <InputField
            label="Street 1"
            placeholder="Enter street 1"
            name="street1"
            helperComponent={<ErrorMessage name="street1" />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.street1}
          />
          <InputField
            label="Street 2"
            placeholder="Enter street 2"
            name="street2"
            helperComponent={<ErrorMessage name="street2" />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.street2}
          />
          <div className="mb-2 row">
            <div className="col">
              <InputField
                label="City"
                placeholder="Enter city"
                name="city"
                helperComponent={<ErrorMessage name="city" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
              />
            </div>
            <div className="col">
              <SelectField
                label="State"
                name="state"
                options={[
                  { label: 'New South Wales', value: 'New South Wales' },
                  { label: 'New South', value: 'New South' },
                  { label: 'New Wales', value: 'New Wales' }
                ]}
                helperComponent={<ErrorMessage name="state" />}
                value={statesOption.find((option) => option.value === formik.values.state) || null}
                handleChange={(selectedOption: IOption) => {
                  formik.setFieldValue('state', selectedOption.value);
                }}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <InputField
                label="Post code"
                placeholder="Enter post code"
                name="postalCode"
                helperComponent={<ErrorMessage name="postalCode" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.postalCode}
              />
            </div>
            <div className="col">
              <SelectField
                label="Country"
                name="country"
                options={countriesOption}
                helperComponent={<ErrorMessage name="country" />}
                value={countriesOption.find((option) => option.value === formik.values.country) || null}
                handleChange={(selectedOption: IOption) => {
                  formik.setFieldValue('country', selectedOption.value);
                }}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          {currentProperty ? 'Update Property' : 'Save Property'}
        </button>
        &nbsp;&nbsp;
        <button onClick={cleanForm} type="button" className="btn btn-danger">
          Cancel
        </button>
        &nbsp;&nbsp;
        <button onClick={() => formik.resetForm()} type="button" className="btn btn-warning">
          Reset Form
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
