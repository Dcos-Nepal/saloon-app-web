import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';

import { endpoints } from 'common/config';
import LogoFull from 'assets/images/LogoFull.svg';
import { useEffect, useState } from 'react';
import { Loader } from 'common/components/atoms/Loader';
import InputField from 'common/components/form/Input';
import { registerUserApi } from 'services/auth.service';
import { toast } from 'react-toastify';

const SignUp = (props: any) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const search = useLocation().search;
  const referredBy = new URLSearchParams(search).get('referralCode');

  const InitSignUp = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    userType: ''
  };

  const SignUpSchema = Yup.object().shape({
    userType: Yup.string().required('Please select a User Type'),
    firstName: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('First Name is required'),
    lastName: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Invalid email'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').max(24, 'Password can be maximum 24 characters').required('Password is required'),
    phoneNumber: Yup.string().length(10).label('Phone Number').required('Phone Number is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitSignUp,
    onSubmit: async (formData: any) => {
      // Setting User Type
      formData.roles = [formData.userType];

      // Set referred by
      if (referredBy) {
        formData.userData = {
          type: formData.userType,
          referredBy: referredBy
        };
      }

      // Remove the userType attribute.
      delete formData.userType;

      // Making a User Registration Request
      setIsLoading(true);
      const response: any = await registerUserApi(formData);

      if (response.data.success === true) {
        setIsLoading(false);
        toast.success('Success!! Check your email for verification.');
        return navigate(endpoints.auth.signIn);
      } else {
        setIsLoading(false);
        toast.error('Error! Error while registering user.');
      }
    },
    validationSchema: SignUpSchema
  });

  useEffect(() => {
    if (props.isSuccess && props.isFailed === false) {
      navigate(endpoints.auth.signIn);
    }
  }, [props.isSuccess, props.isFailed, navigate]);

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center">
        <div className="mb-5">
          <div className="d-flex justify-content-center">
            <img src={LogoFull} alt="Orange Cleaning" />
          </div>

          <div className="main-container card bg-white p-4">
            <Loader isLoading={isLoading} />
            <div>
              <h4>Register Account</h4>
              <label>Fill your details or continue with google account</label>
            </div>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className="row mt-3 mb-3">
                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                  <input name="userType" onChange={formik.handleChange} type="radio" value="CLIENT" className="btn-check" id="client" autoComplete="off" />
                  <label className="btn btn-outline-dangerr" htmlFor="client">
                    I am a Client
                  </label>

                  <input name="userType" onChange={formik.handleChange} type="radio" value="WORKER" className="btn-check" id="worker" autoComplete="off" />
                  <label className="btn btn-outline-dangerr" htmlFor="worker">
                    I am a Worker
                  </label>
                </div>
                <div className="form-text">
                  {formik.errors.userType && formik.touched.userType ? <div className="txt-red">{formik.errors.userType}</div> : null}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <InputField
                    label="First Name:"
                    name="firstName"
                    placeholder="First name"
                    helperComponent={formik.errors.firstName && formik.touched.firstName ? <div className="txt-red">{formik.errors.firstName}</div> : null}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="col">
                  <InputField
                    label="Last Name:"
                    name="lastName"
                    placeholder="Last name"
                    helperComponent={formik.errors.lastName && formik.touched.lastName ? <div className="txt-red">{formik.errors.lastName}</div> : null}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <InputField
                    label="Phone Number:"
                    name="phoneNumber"
                    placeholder="Phone number"
                    helperComponent={
                      formik.errors.phoneNumber && formik.touched.phoneNumber ? <div className="txt-red">{formik.errors.phoneNumber}</div> : null
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
              <div className="row">
                <InputField
                  type={'email'}
                  name="email"
                  label="Email:"
                  placeholder="Your email (example@gmail.com)"
                  helperComponent={formik.errors.email && formik.touched.email ? <div className="txt-red">{formik.errors.email}</div> : null}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name="password"
                  label={
                    <div>
                      <div>
                        Password:{' '}
                        <label className="txt-orange">
                          <small>Use alphanumeric with special characters</small>
                        </label>
                      </div>
                    </div>
                  }
                  type="password"
                  placeholder="Login Password"
                  helperComponent={formik.errors.password && formik.touched.password ? <div className="txt-red">{formik.errors.password}</div> : null}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="d-flex justify-content-center mt-2">
                <button type="submit" className="btn btn-primary btn-long">
                  Sign up
                </button>
              </div>
            </form>
            <div className="mt-2">
              <div className="d-flex justify-content-center mt-3">
                <div>
                  Already have an account?
                  <span className="txt-orange pointer ms-2" onClick={() => navigate(endpoints.auth.signIn)}>
                    Sign In
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-5 text-center pb-5">
            Copyright &copy; {new Date().getFullYear()} <b>Orange Cleaning</b>, All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
