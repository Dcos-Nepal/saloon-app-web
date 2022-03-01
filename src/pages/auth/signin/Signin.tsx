import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from "yup";
import { useFormik } from "formik";

import { endpoints } from 'common/config';
import { getData, setData } from 'utils/storage';
import { signInUserApi } from 'services/auth.service';

import LogoFull from 'assets/images/LogoFull.svg';
import { Loader } from 'common/components/atoms/Loader';
import InputField from 'common/components/form/Input';

const Signin = (props: any) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentUser = getData('user');

  const InitSignIn = {
    email: "",
    password: "",
    deviceType: "WEB",
    deviceToken: "MOCK",
  };

  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .required("Please provide an email.")
      .email("Invalid email provided"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(24, "Password can be maximum 24 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitSignIn,
    onSubmit: async (userData: any) => {
      // Set device token
      userData.deviceToken = '12345';
      // Making a User Login Request
      setIsLoading(true);
      const response: any = await signInUserApi(userData);

      if (response.data.success === true) {
        const {data: {token: { accessToken, refreshToken }, user}} = response.data;

         // Set data in the Local Storage
        setData('user', user);
        setData('accessToken', accessToken);
        setData('refreshToken', refreshToken);

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    },
    validationSchema: SignInSchema,
  });

  useEffect(() => {
    if (currentUser?._id) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      if (params.redirect) {
        window.location.href = decodeURI(params.redirect);
      } else {
        navigate(endpoints.admin.home);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, isLoading]);

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
              <h4>Welcome</h4>
              <label>Fill your details or continue with google account</label>
            </div>

            <form noValidate onSubmit={formik.handleSubmit}>
              <div className="row mt-3">
                <div className="col">
                  <InputField
                    name="email"
                    type={"email"}
                    label="Email Address:"
                    placeholder="Your valid email"
                    helperComponent={
                      formik.errors.email && formik.touched.email ? (
                        <div className="txt-red">{formik.errors.email}</div>
                      ) : null
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
              <div className="row">
                <InputField
                  name="password"
                  label="Password:"
                  type="password"
                  placeholder="Password"
                  helperComponent={
                    formik.errors.password && formik.touched.password ? (
                      <div className="txt-red">{formik.errors.password}</div>
                    ) : null
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="row">
                <small>
                  Forgot password?
                  <span
                    className="txt-orange pointer ms-2"
                    onClick={() => navigate(endpoints.auth.resetPassword)}
                  >
                    Reset here
                  </span>
                </small>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary btn-full">
                  Login
                </button>
              </div>
            </form>

            <div className="d-flex justify-content-center mt-3">
              <div className='mt-2'>
                Don’t have an account?
                <span className="txt-orange pointer ms-2" onClick={() => navigate(endpoints.auth.signUp)}>
                  Sign Up
                </span>
              </div>
            </div>
          </div>
          <div className='mb-5 text-center pb-5'>
            Copyright &copy; {new Date().getFullYear()} <b>Orange Cleaning</b>, All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
