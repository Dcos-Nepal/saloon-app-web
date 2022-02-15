import { FC } from 'react';
import * as Yup from 'yup';
import { getIn, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { StopIcon } from '@primer/octicons-react';

import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';

interface IProps {
  closeModal: () => void;
  currentProperty?: any;
  saveProperty: (data: any) => any;
  updateProperty: (data: any) => any;
}

const PropertyForm: FC<IProps> = ({ closeModal, currentProperty, saveProperty, updateProperty }) => {
  const navigate = useNavigate();

  const initialValues = currentProperty
    ? currentProperty
    : {
        name: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        postalCode: undefined,
        country: ''
      };

  const PropertySchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    street1: Yup.string().required(`Street 1 is required`),
    street2: Yup.string().required(`Street 2 is required`),
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

      closeModal();
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

  const statesOption = [{ label: 'LA', value: 'LA' }];
  const countriesOption = [{ label: 'Aus', value: 'AUS' }];

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

        <div className="mb-3">
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
          <div className="mb-3 row">
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
                options={statesOption}
                helperComponent={<ErrorMessage name="state" />}
                value={statesOption.find((option) => option.value === formik.values.state) || { label: '', value: '' }}
                handleChange={(selectedOption: IOption) => {
                  formik.setFieldValue('state', selectedOption.value);
                }}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <div className="mb-3 row">
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
                value={countriesOption.find((option) => option.value === formik.values.country)}
                handleChange={(selectedOption: IOption) => {
                  formik.setFieldValue('country', selectedOption.value);
                }}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button onClick={closeModal} type="button" className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
