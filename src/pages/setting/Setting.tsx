import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router';

import { clearData, getData } from 'utils/storage';
import Footer from 'common/components/layouts/footer';
import { Loader } from 'common/components/atoms/Loader';
import SideNavbar from 'common/components/layouts/sidebar';
import InputField from 'common/components/form/Input';
import { changePasswordApi } from 'services/auth.service';
import { toast } from 'react-toastify';

const Setting = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentUser = getData('user');

  const initialValues = {
    email: currentUser.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
      .required('Confirm Password is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: async (userData: any) => {
      if (userData.newPassword !== userData.confirmPassword) {
        formik.setErrors({ confirmPassword: 'Password do not match!' });
        return false;
      }

      // Making a User Login Request
      setIsLoading(true);
      const response: any = await changePasswordApi(userData);

      if (response.data.success === true) {
        setIsLoading(false);
        clearData();
        toast.success('Password changed');
        return navigate('/signin');
      } else {
        setIsLoading(false);
        toast.error('Failed to change password');
      }
    },
    validationSchema: ChangePasswordSchema
  });

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

            <div className="row card">
              <div className="col">
                <Loader isLoading={isLoading} />
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
                      Submit
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

export default Setting;
