import * as Yup from 'yup';
import { Suspense, useEffect, useState } from 'react';
import { getIn, useFormik } from 'formik';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

import { clearData, getData, setData } from 'utils/storage';
import Footer from 'common/components/layouts/footer';
import { Loader } from 'common/components/atoms/Loader';
import SideNavbar from 'common/components/layouts/sidebar';
import InputField from 'common/components/form/Input';
import { changePasswordApi } from 'services/auth.service';
import * as workersActions from 'store/actions/workers.actions';
import { StopIcon, UploadIcon, XCircleIcon } from '@primer/octicons-react';
import SelectField from 'common/components/form/Select';
import { COUNTRIES_OPTIONS, DAYS_OF_WEEK, STATES_OPTIONS } from 'common/constants';
import { IOption } from 'common/types/form';
import { updateUserApi } from 'services/users.service';
import PropertyForm from 'pages/clients/PropertyForm';
import Modal from 'common/components/atoms/Modal';
import PropertyDetail from 'pages/clients/PropertyDetail';
import * as propertiesActions from 'store/actions/properties.actions';
import { deletePublicFile, uploadPublicFile } from 'services/files.service';
import { getServices } from 'data';
import { usePlacesWidget } from 'react-google-autocomplete';

const Setting = ({
  actions,
  properties
}: {
  actions: {
    updateWorker: (data: any) => void;
    addProperty: (data: any) => void;
    fetchProperties: (filter: any) => void;
    updateProperty: (data: any) => void;
  };
  properties: any[];
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPCLoading, setIsPCLoading] = useState<boolean>(false);
  const [addProperty, setAddProperty] = useState(false);
  const [editPropertyFor, setEditPropertyFor] = useState<any>(null);

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

  // Get Currently logged in user
  const currentUser = getData('user');

  const initialValues = {
    email: currentUser?.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const profileInitialValues = currentUser;

  const { ref }: any = usePlacesWidget({
    apiKey: process.env.REACT_APP_MAP_KEY,
    onPlaceSelected: (place) => {
      let street = '';
      let city = '';
      let state = '';
      let postalCode = '';
      let country = '';

      place.address_components.forEach((component: any) => {
        if (component.types.includes('locality')) {
          street = component.long_name;
        }
      
        if (component.types.includes('administrative_area_level_2')) {
          city = component.long_name;
        }
      
        if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
      
        if (component.types.includes('postal_code')) {
          postalCode = component.long_name;
        }
      
        if (component.types.includes('country')) {
          country = component.short_name;
        }
      });

      profileFormik.setFieldValue('address.street1', street);
      profileFormik.setFieldValue('address.city', city);
      profileFormik.setFieldValue('address.state', state);
      profileFormik.setFieldValue('address.postalCode', postalCode);
      profileFormik.setFieldValue('address.country', country);
    },
    options: {
      types: ["(regions)"],
      componentRestrictions: { country: "AUS" },
    },
  });

  /**
   * Save Property
   * @param data
   */
  const savePropertyHandler = async (data: any) => {
    if (currentUser?._id) {
      await actions.addProperty({ ...data, user: currentUser._id });

      actions.fetchProperties({ user: currentUser._id });
      setAddProperty(false);
    }
  };

  /**
   * Update Property
   * @param data
   */
  const updatePropertyHandler = async (data: any) => {
    if (currentUser?._id) {
      await actions.updateProperty({ ...data, user: currentUser._id });

      actions.fetchProperties({ user: currentUser._id });
      setEditPropertyFor(null);
    }
  };

  /**
   * Handle File Upload
   * @param event
   * @param docKey
   * @param type
   */
  const handleFileUpload = async (event: any, docKey: string, type: string) => {
    const formData = new FormData();
    const file = event.target.files[0];

    formData.append('file', file, file.name);

    setDocument({ ...getDocument, [docKey]: file });
    setIsUploading({ ...isUploading, [docKey]: true });

    try {
      const uploadedFile = await uploadPublicFile(formData);

      // Setting Formik form document properties
      profileFormik.setFieldValue(`userData.documents[${docKey}].key`, uploadedFile.data.data.key);
      profileFormik.setFieldValue(`userData.documents[${docKey}].url`, uploadedFile.data.data.url);
      profileFormik.setFieldValue(`userData.documents[${docKey}].type`, type);

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
    if ((profileFormik.values.userData.documents as any)[docKey].key) {
      setIsDeleting({ ...isDeleting, [docKey]: true });
      try {
        await deletePublicFile((profileFormik.values.userData.documents as any)[docKey].key);

        // Setting Formik form document properties
        profileFormik.setFieldValue(`userData.documents[${docKey}].key`, '');
        profileFormik.setFieldValue(`userData.documents[${docKey}].url`, '');

        setIsDeleting({ ...isDeleting, [docKey]: false });
      } catch (error) {
        console.log('Error: ', error);
        setIsDeleting({ ...isDeleting, [docKey]: false });
      }
    }
    setDocument({ ...getDocument, [docKey]: null });
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
    const documents = profileFormik.values.userData?.documents as any;
    return (
      <div className="mb-3">
        <label className="form-label txt-dark-grey">{label}</label>
        {(documents && documents[id]?.key) || (getDocument as any)[id]?.name ? (
          <div className="row">
            <div className="col-3">
              {(isUploading as any)[id] ? 
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                : null
              }
              {documents && documents[id]?.url ? (<img src={documents[id]?.url} className="rounded float-start" alt="" style={{ width: '150px', height: '150px' }} />) : null}
            </div>
            {!(isUploading as any)[id] ? (
              <div className="col-9 d-flex align-items-center">
                <button
                  type="button"
                  title="Delete"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    handleFileDelete(id);
                  }}
                >
                  {(isDeleting as any)[id] ? 'Deleting...' : <XCircleIcon size={16} />}
                </button>
              </div>
            ): null}
          </div>
        ) : null}

        <input className="form-control hidden" type="file" id={id} name={name} onChange={(event) => handleFileUpload(event, id, type)} onBlur={formik.handleBlur} />
        {!(getDocument as any)[id] && !(documents && documents[id]?.key) ? (
          <label htmlFor={id} className="txt-orange dashed-file">
            <UploadIcon /> {dropText}
          </label>
        ) : null}
      </div>
    );
  };

  const ChangePasswordSchema = Yup.object().shape({
    email: Yup.string().required('Please provide an email.').email('Invalid email provided'),
    currentPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('Current Password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('New Password is required'),
    confirmPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(24, 'Password can be maximum 24 characters')
      .when("newPassword", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("newPassword")],
          "Both password need to be the same"
        )
      })
      .required('Confirm Password is required'),
    userData: Yup.object().shape({
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
      })
    })
  });

  const ProfileUpdateSchema = Yup.object().shape({
    firstName: Yup.string().required(`First name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    lastName: Yup.string().required(`Last name is required`).min(2, 'Too Short!').max(20, 'Too Long!'),
    address: Yup.object().shape({
      street1: Yup.string().required(`Street 1 is required`),
      street2: Yup.string().notRequired(),
      city: Yup.string().required(`City is required`),
      state: Yup.string().required(`State is required`),
      postalCode: Yup.string().required(`Postal Code is required`),
      country: Yup.string().required(`Country is required`)
    }),
    email: Yup.string().required(`Email is required`).email('Invalid email'),
    phoneNumber: Yup.string().label('Phone Number')
      .required(`Phone number is required`)
      .matches(
        /^\+(?:[0-9] ?){6,14}[0-9]$/,
        "Phone number must be at least 6 numbers to 14 numbers starting with '+'"
      ),
    userData: Yup.object().shape({
      workingHours: Yup.object().shape({
        start: Yup.string(),
        end: Yup.string()
      }),
      workingDays: Yup.array(Yup.string()),
      services: Yup.array(Yup.string())
    })
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: async (userData: any) => {
      if (userData.newPassword !== userData.confirmPassword) {
        formik.setErrors({ confirmPassword: 'Password do not match!' });
        return false;
      }

      // Making a Password Reset Request
      setIsPCLoading(true);
      const response: any = await changePasswordApi(userData);

      if (response.data.success === true) {
        clearData();
        setIsPCLoading(false);
        toast.success('Password changed successfully!');
        return navigate('/signin');
      } else {
        setIsPCLoading(false);
        toast.error('Failed to change password');
      }
    },
    validationSchema: ChangePasswordSchema
  });

  const profileFormik = useFormik({
    enableReinitialize: true,
    initialValues: profileInitialValues,
    onSubmit: async (userData: any) => {
      setIsLoading(true);
      const { data: response }: any = await updateUserApi(userData);

      if (response.data.success === true) {
        setIsLoading(false);
        toast.success('Profile updated successfully!');
        setData('user', response.data?.data || currentUser);

        return navigate('/dashboard/profile');
      } else {
        setIsLoading(false);
        toast.error('Failed to update profile');
      }
    },
    validationSchema: ProfileUpdateSchema
  });

  const onWorkingDaysChange = (day: string) => {
    if (profileFormik.values.userData?.workingDays?.length && profileFormik.values.userData?.workingDays.find((selectedDay: string) => selectedDay === day)) {
      profileFormik.setFieldValue(
        'userData.workingDays',
        profileFormik.values.userData?.workingDays.filter((selectedDay: string) => selectedDay !== day)
      );
    } else {
      profileFormik.setFieldValue(
        'userData.workingDays',
        profileFormik.values.userData?.workingDays ? [...profileFormik.values.userData?.workingDays, day] : [day]
      );
    }
  };

  /**
   * Custom Error Message
   * @param param0 Props Object
   * @returns JSX
   */
  const ErrorMessage = ({ formik, name }: any) => {
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

  useEffect(() => {
    if (currentUser?._id && currentUser?.userData?.type === 'CLIENT') {
      actions.fetchProperties({ user: currentUser._id });
    }
  }, [currentUser?._id, currentUser?.userData?.type, actions]);

  return (
    <>
      <SideNavbar active="Setting" />
      <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
        <div className="row">
          <div className="txt-orange pointer" onClick={() => navigate(-1)}>
            <span className="col me-1">
              <box-icon name="arrow-back" size="xs" color="#EC7100" />
            </span>
            <span className="col">Back to previous</span>
          </div>
          <div>
            <div className="d-flex flex-row mt-2">
              <h3 className="txt-bold extra">Settings</h3>
            </div>

            <div className="row m-1">
              <div className="card col">
                <Loader isLoading={isLoading} />
                <div className="mb-2">
                  <h4>Update Profile</h4>
                  <label>Edit the values and save to update profile</label>
                </div>
                <form noValidate onSubmit={profileFormik.handleSubmit}>
                  <div className="row">
                    <div className="col">
                      <InputField
                        label="First name"
                        placeholder="Enter first name"
                        name="firstName"
                        helperComponent={<ErrorMessage formik={profileFormik} name="firstName" />}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        value={profileFormik.values.firstName}
                      />
                    </div>
                    <div className="col">
                      <InputField
                        label="Last name"
                        placeholder="Enter last name"
                        name="lastName"
                        helperComponent={<ErrorMessage formik={profileFormik} name="lastName" />}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        value={profileFormik.values.lastName}
                      />
                    </div>
                  </div>
                  <InputField
                    label="Email address"
                    placeholder="Enter email address"
                    type="email"
                    name="email"
                    helperComponent={<ErrorMessage formik={profileFormik} name="email" />}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    value={profileFormik.values.email}
                    disabled={true}
                  />
                  <InputField
                    label="Phone number: [+xxx xxxxxxxxxx]"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    helperComponent={<ErrorMessage formik={profileFormik} name="phoneNumber" />}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    value={profileFormik.values.phoneNumber}
                  />
                  <div className="mb-2">
                    <label className="txt-bold mt-2 mb-2">Address Section</label>
                    <div className="mb-3">
                      <input ref={ref} className="form-control" placeholder="Type here to search address" />
                    </div>

                    <InputField
                      label="Street 1"
                      placeholder="Enter street 1"
                      name="address.street1"
                      helperComponent={<ErrorMessage formik={profileFormik} name="address.street1" />}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      value={profileFormik.values.address?.street1}
                    />
                    <InputField
                      label="Street 2"
                      placeholder="Enter street 2"
                      name="address.street2"
                      helperComponent={<ErrorMessage formik={profileFormik} name="address.street2" />}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      value={profileFormik.values.address?.street2}
                    />
                    <div className="mb-2 row">
                      <div className="col">
                        <InputField
                          label="Suburb"
                          placeholder="Enter city"
                          name="address.city"
                          helperComponent={<ErrorMessage formik={profileFormik} name="address.city" />}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          value={profileFormik.values.address?.city}
                        />
                      </div>
                      <div className="col">
                        <SelectField
                          label="State"
                          name="address.state"
                          options={STATES_OPTIONS}
                          helperComponent={<ErrorMessage formik={profileFormik} name="address.state" />}
                          value={STATES_OPTIONS.find((option) => option.value === profileFormik.values.address?.state)}
                          handleChange={(selectedOption: IOption) => {
                            profileFormik.setFieldValue('address.state', selectedOption.value);
                          }}
                          onBlur={profileFormik.handleBlur}
                        />
                      </div>
                    </div>
                    <div className="mb-2 row">
                      <div className="col">
                        <InputField
                          type="text"
                          label="Post code"
                          placeholder="Enter post code"
                          name="address.postalCode"
                          helperComponent={<ErrorMessage formik={profileFormik} name="address.postalCode" />}
                          onChange={profileFormik.handleChange}
                          onBlur={profileFormik.handleBlur}
                          value={profileFormik.values.address?.postalCode?.toString()}
                        />
                      </div>
                      <div className="col">
                        <SelectField
                          label="Country"
                          name="address.country"
                          options={COUNTRIES_OPTIONS}
                          helperComponent={<ErrorMessage formik={profileFormik} name="address.country" />}
                          value={COUNTRIES_OPTIONS.find((option) => option.value === profileFormik.values.address?.country)}
                          handleChange={(selectedOption: IOption) => {
                            profileFormik.setFieldValue('address.country', selectedOption.value);
                          }}
                          onBlur={profileFormik.handleBlur}
                        />
                      </div>
                    </div>
                  </div>

                  {currentUser?.userData?.type === 'CLIENT' ? (
                    <div className="col">
                      <div className="row">
                        <div className="col">
                          <h5>{properties.length ? 'Listed Properties' : 'Properties'}</h5>
                          {properties.length
                            ? properties.map((property) => <PropertyDetail setEditPropertyFor={setEditPropertyFor} property={property} />)
                            : null}

                          <div
                            onClick={() => {
                              if (currentUser && currentUser._id) setAddProperty(true);
                            }}
                            className="dashed bold txt-orange pointer mt-2"
                          >
                            + {properties.length ? 'Additional' : 'Add'} property details
                          </div>
                        </div>
                      </div>
                      <Modal isOpen={addProperty} onRequestClose={() => setAddProperty(false)}>
                        <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
                          <div className="modal-dialog mt-5">
                            <div className="modal-content">
                              <div className="modal-header row border-bottom">
                                <h5 className="col">Property details</h5>
                                <div className="col">
                                  <span onClick={() => setAddProperty(false)} className="pointer d-flex float-end">
                                    <box-icon name="x" />
                                  </span>
                                </div>
                              </div>
                              <div className="p-3">
                                <Suspense fallback={<Loader isLoading={true} />}>
                                  <PropertyForm
                                    cleanForm={() => setAddProperty(false)}
                                    saveProperty={savePropertyHandler}
                                    updateProperty={updatePropertyHandler}
                                    closeModal={() => setAddProperty(false)}
                                  />
                                </Suspense>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Modal>
                      <Modal isOpen={editPropertyFor} onRequestClose={() => setEditPropertyFor(null)}>
                        <div className={`modal fade show mt-5`} role="dialog" style={{ display: 'block' }}>
                          <div className="modal-dialog mt-5">
                            <div className="modal-content">
                              <div className="modal-header row border-bottom">
                                <h5 className="col">Property details</h5>
                                <div className="col">
                                  <span onClick={() => setEditPropertyFor(null)} className="pointer d-flex float-end">
                                    <box-icon name="x" />
                                  </span>{' '}
                                </div>
                              </div>
                              <div className="p-3">
                                <Suspense fallback={<Loader isLoading={true} />}>
                                  <PropertyForm
                                    currentProperty={editPropertyFor}
                                    saveProperty={savePropertyHandler}
                                    updateProperty={updatePropertyHandler}
                                    cleanForm={() => setEditPropertyFor(null)}
                                    closeModal={() => setEditPropertyFor(null)}
                                  />
                                </Suspense>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  ) : null}

                  {currentUser?.userData?.type === 'WORKER' ? (
                    <>
                      <div className="mb-2 row">
                        <div className="col-5">
                          <InputField
                            label="Working hours"
                            placeholder="Start Hours"
                            type="time"
                            name="userData.workingHours.start"
                            value={profileFormik.values.userData?.workingHours?.start}
                            onChange={profileFormik.handleChange}
                            onBlur={profileFormik.handleBlur}
                          />
                          <InputField
                            label=""
                            placeholder="End Hours"
                            type="time"
                            name="userData.workingHours.end"
                            value={profileFormik.values.userData?.workingHours?.end}
                            onChange={profileFormik.handleChange}
                            onBlur={profileFormik.handleBlur}
                          />
                        </div>
                        <div className="col week-list">
                          <label className="form-label txt-dark-grey">Available working days and time</label>
                          <ul>
                            {DAYS_OF_WEEK.map((day) => (
                              <li
                                key={day}
                                className={`${
                                  profileFormik.values.userData?.workingDays?.length &&
                                  profileFormik.values.userData?.workingDays.find((selectedDay: string) => selectedDay === day)
                                    ? 'selected'
                                    : null
                                }`}
                                onClick={() => onWorkingDaysChange(day)}
                              >
                                <span className="item">{day[0]?.toString().toUpperCase()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <SelectField
                        label="Services"
                        name="userData.services"
                        isMulti={true}
                        placeholder="Search available services..."
                        options={getServices().filter((service) => service.isActive)}
                        value={getServices().filter((tagOption) =>
                          profileFormik.values.userData?.services?.find((service: string) => service === tagOption.value)
                        )}
                        handleChange={(selectedTags: IOption[]) => {
                          profileFormik.setFieldValue(
                            'userData.services',
                            selectedTags.map((tagOption) => tagOption.value)
                          );
                        }}
                        onBlur={profileFormik.handleBlur}
                      />
                      <div className="col">
                        <h5>Documents</h5>
                        <div className="text-success">
                          <StopIcon size={16} /> Make sure to upload each document before saving.
                        </div>
                        <div className="mt-3" />
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
                    </>
                  ) : null}

                  <div className="d-flex justify-content-center mt-2">
                    <button type="submit" className="btn btn-primary btn-full">
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
              <div className="card ms-3 col-5">
                <Loader isLoading={isPCLoading} />
                <div className="mb-2">
                  <h4>Change password</h4>
                  <label>Fill your new password to change</label>
                </div>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <div className="row mt-2">
                    <InputField
                      name="currentPassword"
                      label="Current Password:"
                      type="password"
                      placeholder="Enter your current password"
                      helperComponent={
                        formik.errors.currentPassword && formik.touched.currentPassword ? <div className="txt-red">{formik.errors.currentPassword}</div> : null
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div className="row">
                    <InputField
                      name="newPassword"
                      label="New Password:"
                      type="password"
                      placeholder="Password"
                      helperComponent={
                        formik.errors.newPassword && formik.touched.newPassword ? <div className="txt-red">{formik.errors.newPassword}</div> : null
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div className="row">
                    <InputField
                      name="confirmPassword"
                      label="Confirm Password:"
                      type="password"
                      placeholder="Password"
                      helperComponent={
                        formik.errors.confirmPassword && formik.touched.confirmPassword ? <div className="txt-red">{formik.errors.confirmPassword}</div> : null
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <button type="submit" className="btn btn-primary btn-full">
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isWorkersLoading: state.workers.isLoading,
    properties: state.properties.properties,
    currentWorker: state.workers.currentUser
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    updateWorker: (data: any) => {
      dispatch(workersActions.updateWorker(data));
    },
    addProperty: (data: any) => {
      dispatch(propertiesActions.addProperty(data));
    },
    fetchProperties: (filter: any) => {
      dispatch(propertiesActions.fetchProperties(filter));
    },
    updateProperty: (data: any) => {
      dispatch(propertiesActions.updateProperty(data));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
