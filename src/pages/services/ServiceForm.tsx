import * as Yup from 'yup';
import { useState } from 'react';
import { getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';

import TextArea from 'common/components/form/TextArea';
import InputField from 'common/components/form/Input';
import { Loader } from 'common/components/atoms/Loader';

const ServiceForm = ({ closeModal, lineItem, saveHandler }: { lineItem?: any; closeModal: () => void; saveHandler: (data: any) => any }) => {
  const initialValues = lineItem
    ? lineItem
    : {
        name: '',
        description: ''
      };

  const [isLoading, setIsLoading] = useState(false);

  const ServiceFormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().optional()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ServiceFormSchema,
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
          name={`name`}
          value={formik.values.name}
          onChange={formik.handleChange}
          helperComponent={<ErrorMessage name="name" />}
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

export default ServiceForm;
