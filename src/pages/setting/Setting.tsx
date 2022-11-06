import * as Yup from 'yup';
import { useState } from 'react';
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
import { InfoIcon, StopIcon } from '@primer/octicons-react';
import SelectField from 'common/components/form/Select';
import { COUNTRIES_OPTIONS, DAYS_OF_WEEK, STATES_OPTIONS } from 'common/constants';
import { IOption } from 'common/types/form';
import { updateUserApi } from 'services/customers.service';
import { getServices } from 'data';
import SearchLocation from 'common/components/form/SearchLocation';

const Setting = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPCLoading, setIsPCLoading] = useState<boolean>(false);

  // Get Currently logged in user
  const currentUser = getData('user');

  const initialValues = {
    email: currentUser?.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const profileInitialValues = currentUser;

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
      .required('Confirm Password is required')
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
      )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: async (userData: any) => {
      // Cleaning up data
      userData.email = userData.email.trim().toLowerCase();

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
      // Cleaning up data
      userData.email = userData.email.trim().toLowerCase();
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
                    label={<span>Email address &nbsp; <br/><small><InfoIcon /> You'll receive a verification email if you update your email.</small></span>}
                    placeholder="Enter email address"
                    type="email"
                    name="email"
                    helperComponent={<ErrorMessage formik={profileFormik} name="email" />}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    value={profileFormik.values.email}
                  />
                  <InputField
                    label={<span>Phone Number: <i>[eg. +61 1234567890]</i> &nbsp; <br/><small><InfoIcon/ > You'll need to verify your Phone Number if you update it.</small></span>}
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
                      <SearchLocation formikForm={profileFormik} addressPath={"address"}/>
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
                    <button
                      type="submit"
                      className="btn btn-primary btn-full"
                    >
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
  actions: {}
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
