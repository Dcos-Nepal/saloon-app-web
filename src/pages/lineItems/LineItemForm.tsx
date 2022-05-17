import * as Yup from 'yup';
import { useState } from 'react';
import { getIn, useFormik } from 'formik';
import { StopIcon } from '@primer/octicons-react';

import TextArea from 'common/components/form/TextArea';
import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';
import { Loader } from 'common/components/atoms/Loader';
import { getServices } from 'data';

const LineItemForm = ({ closeModal, lineItem, saveHandler }: { lineItem?: any; closeModal: () => void; saveHandler: (data: any) => any }) => {
  const initialValues = lineItem
    ? lineItem
    : {
        name: '',
        tags: [],
        description: '',
        refCost: 0
      };

  const [isLoading, setIsLoading] = useState(false);

  const LineItemFormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().optional(),
    refCost: Yup.number(),
    tags: Yup.array(Yup.string())
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

        <SelectField
          label="Tags/Services"
          name="tags"
          isMulti={true}
          value={getServices().find((service) => formik.values.tags?.find((tag: string) => tag === service.value))}
          options={getServices().filter((service) => service.isActive)}
          helperComponent={<ErrorMessage name="tags" />}
          handleChange={(selectedTags: IOption[]) => {
            formik.setFieldValue(
              'tags',
              selectedTags.map((tagOption) => tagOption.value)
            );
          }}
          onBlur={formik.handleBlur}
        />
        <InputField
          label="Ref cost"
          type="number"
          placeholder="Enter ref cost"
          name={`refCost`}
          value={formik.values.refCost}
          onChange={formik.handleChange}
          helperComponent={<ErrorMessage name="refCost" />}
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

export default LineItemForm;
