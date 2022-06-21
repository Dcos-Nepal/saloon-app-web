import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';

import { endpoints } from 'common/config';
import LogoFull from 'assets/images/LogoFull.svg';
import { Loader } from 'common/components/atoms/Loader';
import InputField from 'common/components/form/Input';
import { registerUserApi } from 'services/auth.service';
import { toast } from 'react-toastify';
import { AlertFillIcon } from '@primer/octicons-react';
import { useState } from 'react';

const SignUp = () => {
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
    phoneNumber: Yup.string().label('Phone Number')
      .required('Phone Number is required')
      .matches(
        /^\+(?:[0-9] ?){6,14}[0-9]$/,
        "Phone number must be at least 6 numbers to 14 numbers starting with '+'"
      ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitSignUp,
    onSubmit: async (formData: any) => {
      // Setting User Type or Role
      formData.roles = [formData.userType];

      // Set referred by
      if (referredBy) {
        formData.userData = {
          type: formData.userType,
          referredBy: referredBy
        };
      }

      // Making a User Registration Request
      try {
        setIsLoading(true);
        formData.email = formData.email.trim().toLowerCase();
        const response: any = await registerUserApi(formData);

        if (response.data?.success === true) {
          setIsLoading(false);
          toast.success('Registration Success! Please check your email inbox or spam folder with verification link.');
          return navigate(endpoints.auth.signIn);
        }

        if (response.data?.message === 'REGISTRATION.USER_ALREADY_REGISTERED') {
          toast.error('The email is already used. Try another email.');
        } else {
          toast.error('Error while registering user.');
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('Error while registering user.');
        setIsLoading(false);
      }
    },
    validationSchema: SignUpSchema
  });

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center">
        <div className="mt-5">
          <div className="d-flex justify-content-center mb-4">
            <img src={LogoFull} alt="Orange Cleaning" style={{height: '145px'}} />
          </div>

          <div className="main-container card bg-white p-4">
            <Loader isLoading={isLoading} />
            <div>
              <h4>Register Account</h4>
              <label>Fill your details for signing up at Orange Cleaning</label>
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

              <div className='row mb-3'>
                <small className='text-success'>
                  <AlertFillIcon /> By signing up you agree to our <span className='cursor-pointer' onClick={() => navigate('/' + endpoints.privacy)}><strong>Privacy Policy</strong></span>.
                </small>
              </div>

              <div className="d-flex justify-content-center mt-2">
                <button type="submit" className="btn btn-primary btn-long" disabled={isLoading}>
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
          <div className="mb-5 mt-5 text-center pb-5">
            Copyright &copy; {new Date().getFullYear()} <b>Orange Cleaning</b>, All Rights Reserved.
            <br/>
            <span className='cursor-pointer' onClick={() => navigate('/' + endpoints.privacy)}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
