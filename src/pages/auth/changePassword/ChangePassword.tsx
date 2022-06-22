import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LogoFull from "assets/images/LogoFull.svg";

import InputField from "common/components/form/Input";
import { useNavigate, useParams } from "react-router-dom";
import { resetUserPasswordApi } from "services/auth.service";
import { Loader } from "common/components/atoms/Loader";
import { toast } from "react-toastify";
import { InfoIcon } from "@primer/octicons-react";
import { endpoints } from "common/config";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { pwdToken } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const InitForgotPassword = {
    email: '',
    newPassword: '',
    confirmPassword: ''
  }

  const ChangePasswordSchema = Yup.object().shape({
    email: Yup.string().required('Please provide an email.').email('Invalid email provided'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('New Password is required'),
    confirmPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitForgotPassword,
    onSubmit: async (userData: any) => {
      // Set Password Token
      userData.passwordToken = pwdToken;

      if (userData.newPassword !== userData.confirmPassword) {
        formik.setErrors({ "confirmPassword": "Password do not match!" })
        return false;
      }

      // Making a User Login Request
      setIsLoading(true);
      try {
        const response: any = await resetUserPasswordApi(userData);

        if (response.data.success === true) {
          setIsLoading(false);
          toast.success('Success! Password changed successfully.');
          return navigate('/signin');
        }

        setIsLoading(false);
        toast.error('Error while resetting the password.');
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error('Error! Try again later.');
      }
      
    },
    validationSchema: ChangePasswordSchema,
  });

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="mt-5">
          <div className="d-flex justify-content-center mb-4">
            <img src={LogoFull} alt="Orange Cleaning" style={{height: '145px'}} />
          </div>
          <div className="main-container card bg-white p-4">
            <Loader isLoading={isLoading} />
            <div>
              <h4>Change password</h4>
              <label>Fill your new password to change</label>
            </div>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className="alert alert-info mt-1 mb-1" role="alert">
                <small><InfoIcon />&nbsp; For better security, use the password different from the ones used previously</small>
              </div>
              <div className="row mt-2 min-width-22">
                <InputField
                  name="email"
                  label="Email Address:"
                  type="email"
                  placeholder="Enter your email"
                  helperComponent={formik.errors.email && formik.touched.email ? (<div className="txt-red">{formik.errors.email}</div>) : null}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="row min-width-22">
                <InputField
                  name="newPassword"
                  label="New Password:"
                  type="password"
                  placeholder="Password"
                  helperComponent={formik.errors.newPassword && formik.touched.newPassword ? (<div className="txt-red">{formik.errors.newPassword}</div>) : null}
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
                  helperComponent={formik.errors.confirmPassword && formik.touched.confirmPassword ? (<div className="txt-red">{formik.errors.confirmPassword}</div>) : null}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="d-flex justify-content-center mt-2">
                <button type="submit" className="btn btn-primary btn-full">Submit</button>
              </div>
            </form>
            <div className="mt-2">
              <div className="d-flex justify-content-center mt-3">
                <div>
                  Already have an account and password?
                  <span className="txt-orange pointer ms-2" onClick={() => navigate(endpoints.auth.signIn)}>
                    Sign In Now
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='mb-5 mt-5 text-center pb-5'>
            Copyright &copy; {new Date().getFullYear()} <b>Orange Cleaning</b>, All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword
