import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoFull from "assets/images/LogoFull.svg";
import InputField from "common/components/form/Input";
import { Loader } from "common/components/atoms/Loader";
import { forgotUserPasswordApi } from "services/auth.service";
import { endpoints } from 'common/config';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const InitForgotPassword = {
    email: '',
  }

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Please provide an email.').email('Invalid email provided')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitForgotPassword,
    onSubmit: async (userData: any) => {
      // Making a User Login Request
      setIsLoading(true);
      const response: any = await forgotUserPasswordApi(userData);

      if (response.data.success === true) {
        setIsLoading(false);
        return navigate('/signin');
      } else {
        setIsLoading(false);
      }
    },
    validationSchema: ResetPasswordSchema,
  });

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="">
          <div className="d-flex justify-content-center mb-5">
            <img src={LogoFull} alt="Orange Cleaning" />
          </div>
          <div className="main-container card bg-white p-4">
            <Loader isLoading={isLoading} />
            <div>
              <h4>Reset password</h4>
              <label>Fill your email to change your password</label>
            </div>
            <form noValidate onSubmit={formik.handleSubmit} style={{ position: "relative" }}>
              <div className="row mt-3">
                <div className="col">
                  <InputField
                    name="email"
                    type={"email"}
                    label="Email Address:"
                    placeholder="Enter your valid email"
                    helperComponent={formik.errors.email && formik.touched.email ? (<div className="txt-red">{formik.errors.email}</div>) : null}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <button type="submit" className="btn btn-primary btn-full">Send email</button>
              </div>
              <div className='mt-3'>
                <div className="d-flex justify-content-center mt-3">
                  <div>
                    Remembered your password?
                    <span className="txt-orange pointer ms-2" onClick={() => navigate(endpoints.auth.signIn)}>
                      Sign In
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className='mb-5 text-center pb-5'>
            Copyright &copy; {new Date().getFullYear()} <b>Orange Cleaning</b>, All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
