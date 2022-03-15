import * as Yup from 'yup';
import { connect } from 'react-redux';
import { getIn, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';

import { IOption } from 'common/types/form';
import { COUNTRIES_OPTIONS, DAYS_OF_WEEK, DEFAULT_COUNTRY, STATES_OPTIONS } from 'common/constants';
import InputField from 'common/components/form/Input';
import SelectField from 'common/components/form/Select';
import * as workersActions from 'store/actions/workers.actions';
import { StopIcon, UploadIcon, XCircleIcon } from '@primer/octicons-react';
import { deletePublicFile, uploadPublicFile } from 'services/files.service';

interface IProps {
  actions: {
    addWorker: (data: any) => any;
    fetchWorker: (id: string) => void;
    updateWorker: (data: any) => void;
  };
  id?: string;
  currentWorker?: any;
  isWorkersLoading: boolean;
}

const WorkerDetailForm: FC<IProps> = ({ id, actions, currentWorker, isWorkersLoading }) => {
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState({
    idCard: false,
    cleaningCert: false,
    policeCert: false
  });
  const [isDeleting, setIsDeleting] = useState({
    idCard: false,
    cleaningCert: false,
    policeCert: false
  });

  const [getDocument, setDocument] = useState<{
    idCard: File | null;
    cleaningCert: File | null;
    policeCert: File | null;
  }>({
    idCard: null,
    cleaningCert: null,
    policeCert: null
  });

  const tagOptions = [
    { label: 'Window', value: 'Window' },
    { label: 'Garden', value: 'Garden' },
    { label: 'Kitchen', value: 'Kitchen' },
    { label: 'Other', value: 'Other' }
  ];

  useEffect(() => {
    if (id) actions.fetchWorker(id);
  }, [id, actions]);

  const initialValues =
    id && currentWorker
      ? currentWorker
      : {
          firstName: '',
          lastName: '',
          email: '',
          roles: ['WORKER'],
          phoneNumber: '',
          address: {
            street1: '',
            street2: '',
            city: '',
            state: '',
            postalCode: undefined,
            country: DEFAULT_COUNTRY.value
          },
          userData: {
            type: 'WORKER',
            workingHours: '',
            workingDays: [],
            documents: {
              idCard: {
                url: '',
                key: '',
                type: 'ID_CARD'
              },
              cleaningCert: {
                url: '',
                key: '',
                type: 'CLEANING_CERTIFICATE'
              },
              policeCert: {
                url: '',
                key: '',
                type: 'POLICE_CERTIFICATE'
              }
            },
            services: []
          },
          avatar: ''
        };

  const WorkerSchema = Yup.object().shape({
    firstName: Yup.string().required(`First name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    lastName: Yup.string().required(`Last name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    address: Yup.object().shape({
      street1: Yup.string().required(`Street 1 is required`),
      street2: Yup.string().notRequired(),
      city: Yup.string().required(`City is required`),
      state: Yup.string().required(`State is required`),
      postalCode: Yup.number().required(`Postal Code is required`),
      country: Yup.string().required(`Country is required`)
    }),
    email: Yup.string().required(`Email is required`).email('Invalid email'),
    phoneNumber: Yup.string().label('Phone Number').required(`Phone number is required`).length(10),
    userData: Yup.object().shape({
      type: Yup.string(),
      documents: Yup.object().shape({
        idCard: Yup.object().shape({
          key: Yup.string(),
          url: Yup.string(),
          type: Yup.string()
        }),
        cleaningCert: Yup.object().shape({
          key: Yup.string(),
          url: Yup.string(),
          type: Yup.string()
        }),
        policeCert: Yup.object().shape({
          key: Yup.string(),
          url: Yup.string(),
          type: Yup.string()
        })
      }),
      workingHours: Yup.string().required(`Working hours is required`).max(20, 'Too Long!'),
      workingDays: Yup.array(Yup.string()).min(1, `Working days is required`),
      services: Yup.array(Yup.string())
    })
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: WorkerSchema,
    onSubmit: async (data: any) => {
      // Set default password as phone number
      data.password = data.phoneNumber;

      // Set type if no type is provided
      if (!data.userData?.type) data.userData.type = 'WORKER';
      // For updating worker
      if (id) await actions.updateWorker(data);
      // For creating worker
      else await actions.addWorker(data);
      // Redirect to previous page
      navigate(-1);
    }
  });

  /**
   * Handle File Select
   * @param event
   * @param key
   */
  const handleFileSelect = async (event: any, key: string) => {
    const file = event.target.files[0];
    setDocument({ ...getDocument, [key]: file });
  };

  /**
   * Handle File Upload
   * @param docKey
   */
  const handleFileUpload = async (docKey: string, type: string) => {
    const formData = new FormData();
    formData.append('file', (getDocument as any)[docKey], (getDocument as any)[docKey].name);

    setIsUploading({ ...isUploading, [docKey]: true });

    try {
      const uploadedFile = await uploadPublicFile(formData);

      // Setting Formik form document properties
      formik.setFieldValue(`userData.documents[${docKey}].key`, uploadedFile.data.data.key);
      formik.setFieldValue(`userData.documents[${docKey}].url`, uploadedFile.data.data.url);
      formik.setFieldValue(`userData.documents[${docKey}].type`, type);

      setIsUploading({ ...isUploading, [docKey]: false });
    } catch (error) {
      setIsUploading({ ...isUploading, [docKey]: false });
    }
  };

  /**
   * Handles file delete
   * @param docKey
   */
  const handleFileDelete = async (docKey: string) => {
    if ((formik.values.userData.documents as any)[docKey].key) {
      setIsDeleting({ ...isDeleting, [docKey]: true });
      try {
        await deletePublicFile((formik.values.userData.documents as any)[docKey].key);

        // Setting Formik form document properties
        formik.setFieldValue(`userData.documents[${docKey}].key`, '');
        formik.setFieldValue(`userData.documents[${docKey}].url`, '');

        setIsDeleting({ ...isDeleting, [docKey]: false });
      } catch (error) {
        console.log('Error: ', error);
        setIsDeleting({ ...isDeleting, [docKey]: false });
      }
    }
    setDocument({ ...getDocument, [docKey]: null });
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

  const onWorkingDaysChange = (day: string) => {
    if (formik.values.userData?.workingDays?.length && formik.values.userData?.workingDays.find((selectedDay: string) => selectedDay === day)) {
      formik.setFieldValue(
        'userData.workingDays',
        formik.values.userData?.workingDays.filter((selectedDay: string) => selectedDay !== day)
      );
    } else {
      formik.setFieldValue('userData.workingDays', formik.values.userData?.workingDays ? [...formik.values.userData?.workingDays, day] : [day]);
    }
  };

  /**
   *  Display DOC Select Section
   *
   * @param label
   * @param name
   * @param id
   * @param dropText
   * @returns JSX
   */
  const generateDocSelect = (label: string, name: string, id: string, dropText: string, type: string) => {
    const documents = formik.values.userData?.documents as any;
    return (
      <div className="mb-3">
        <label className="form-label txt-dark-grey">{label}</label>
        {(documents && documents[id]?.key) || (getDocument as any)[id]?.name ? (
          <div className="row">
            <div className="col-9">
              <span className="mt-1 btn btn-secondary btn-sm">{documents ? documents[id]?.key : (getDocument as any)[id]?.name}</span>
            </div>
            <div className="col-3">
              <button
                type="button"
                title="Upload"
                className="btn btn-warning btn-sm"
                onClick={() => {
                  handleFileUpload(id, type);
                }}
              >
                {(isUploading as any)[id] ? 'loading...' : <UploadIcon size={16} />}
              </button>
              &nbsp;
              <button
                type="button"
                title="Delete"
                className="btn btn-danger btn-sm"
                onClick={() => {
                  handleFileDelete(id);
                }}
              >
                {(isDeleting as any)[id] ? 'loading...' : <XCircleIcon size={16} />}
              </button>
            </div>
          </div>
        ) : null}

        <input className="form-control hidden" type="file" id={id} name={name} onChange={(event) => handleFileSelect(event, id)} onBlur={formik.handleBlur} />
        {!(getDocument as any)[id] && !(documents && documents[id]?.key) ? (
          <label htmlFor={id} className="txt-orange dashed-file">
            <UploadIcon /> {dropText}
          </label>
        ) : null}
      </div>
    );
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col card">
          <h5>Worker Details ({formik.values?.userCode})</h5>
          <div className="row">
            <div className="col">
              <InputField
                label="First name"
                placeholder="Enter first name"
                name="firstName"
                helperComponent={<ErrorMessage name="firstName" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
            </div>
            <div className="col">
              <InputField
                label="Last name"
                placeholder="Enter last name"
                name="lastName"
                helperComponent={<ErrorMessage name="lastName" />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
            </div>
          </div>
          <InputField
            label="Email address"
            placeholder="Enter email address"
            type="email"
            name="email"
            helperComponent={<ErrorMessage name="email" />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <InputField
            label="Phone number"
            placeholder="Enter phone number"
            name="phoneNumber"
            helperComponent={<ErrorMessage name="phoneNumber" />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
          />
          <div className="mb-3 row">
            <div className="col-5">
              <InputField
                label="Working hours"
                placeholder="Enter working hours"
                name="userData.workingHours"
                value={formik.values.userData?.workingHours}
                helperComponent={<ErrorMessage name={'userData.workingHours'} />}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col week-list">
              <label className="form-label txt-dark-grey">Available working days and time</label>
              <ul>
                {DAYS_OF_WEEK.map((day) => (
                  <li
                    key={day}
                    className={`${
                      formik.values.userData?.workingDays?.length && formik.values.userData?.workingDays.find((selectedDay: string) => selectedDay === day)
                        ? 'selected'
                        : null
                    }`}
                    onClick={() => onWorkingDaysChange(day)}
                  >
                    <span className="item">{day[0].toString().toUpperCase()}</span>
                  </li>
                ))}
              </ul>
              <ErrorMessage name="userData.workingDays" />
            </div>
          </div>

          <SelectField
            label="Services"
            name="userData.services"
            isMulti={true}
            placeholder="Search available services..."
            value={tagOptions.filter((tagOption) => formik.values.userData?.services?.find((service: string) => service === tagOption.value))}
            options={tagOptions}
            helperComponent={<ErrorMessage name="userData.services" />}
            handleChange={(selectedTags: IOption[]) => {
              formik.setFieldValue(
                'userData.services',
                selectedTags.map((tagOption) => tagOption.value)
              );
            }}
            onBlur={formik.handleBlur}
          />

          <div className="mb-3">
            <label className="txt-bold mt-2 mb-2">Address</label>
            <InputField
              label="Street 1"
              placeholder="Enter street 1"
              name="address.street1"
              helperComponent={<ErrorMessage name="address.street1" />}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address?.street1}
            />
            <InputField
              label="Street 2"
              placeholder="Enter street 2"
              name="address.street2"
              helperComponent={<ErrorMessage name="address.street2" />}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address?.street2}
            />
            <div className="mb-3 row">
              <div className="col">
                <InputField
                  label="City"
                  placeholder="Enter city"
                  name="address.city"
                  helperComponent={<ErrorMessage name="address.city" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address?.city}
                />
              </div>
              <div className="col">
                <SelectField
                  label="State"
                  name="address.state"
                  options={STATES_OPTIONS}
                  helperComponent={<ErrorMessage name="address.state" />}
                  value={STATES_OPTIONS.find((option) => option.value === formik.values.address?.state)}
                  handleChange={(selectedOption: IOption) => {
                    formik.setFieldValue('address.state', selectedOption.value);
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
                  name="address.postalCode"
                  helperComponent={<ErrorMessage name="address.postalCode" />}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address?.postalCode}
                />
              </div>
              <div className="col">
                <SelectField
                  label="Country"
                  name="address.country"
                  options={COUNTRIES_OPTIONS}
                  helperComponent={<ErrorMessage name="address.country" />}
                  value={COUNTRIES_OPTIONS.find((option) => option.value === formik.values.address?.country)}
                  handleChange={(selectedOption: IOption) => {
                    formik.setFieldValue('address.country', selectedOption.value);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col card ms-3">
          <h5>Upload documents</h5>
          <div className="text-success">
            <StopIcon size={16} /> Make sure to upload each document before saving.
          </div>
          <div className="mt-5" />
          {generateDocSelect(
            '1. ID CARD/DRIVING LICENSE:',
            "userData.documents['idCard'].url",
            'idCard',
            'Click to browse or drag and drop your file to upload ID card.',
            'ID_CARD'
          )}
          {generateDocSelect(
            '2. CLEANING CERTIFICATE:',
            "userData.documents['cleaningCert'].url",
            'cleaningCert',
            'Click to browse or drag and drop your file to upload clinic certificate.',
            'CLEANING_CERTIFICATE'
          )}
          {generateDocSelect(
            '3. POLICE CERTIFICATE:',
            "userData.documents['policeCert'].url",
            'policeCert',
            'Click to browse or drag and drop your file to upload police check.',
            'POLICE_CERTIFICATE'
          )}
        </div>
      </div>
      <div className="mb-3 mt-3">
        <button
          type="button"
          onClick={async () => {
            await formik.handleSubmit();
            // navigate(-1);
          }}
          className="btn btn-primary"
        >
          Save worker
        </button>
        {id ? null : (
          <button
            type="button"
            onClick={async () => {
              await formik.handleSubmit();
              // formik.resetForm();
            }}
            className="btn btn-secondary ms-3"
          >
            Save and create another
          </button>
        )}
        <button onClick={() => navigate(-1)} type="button" className="btn ms-3">
          Cancel
        </button>
      </div>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isWorkersLoading: state.workers.isLoading,
    currentWorker: state.workers.currentUser
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    addWorker: (data: any) => {
      dispatch(workersActions.addWorker(data));
    },
    fetchWorker: (id: string) => {
      dispatch(workersActions.fetchWorker(id));
    },
    updateWorker: (data: any) => {
      dispatch(workersActions.updateWorker(data));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkerDetailForm);
