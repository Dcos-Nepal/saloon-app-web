import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

import * as Yup from "yup";
import { getIn, useFormik } from "formik";

import { endpoints } from 'common/config';
import { getData, setData } from 'utils/storage';
import { signInUserApi } from 'services/auth.service';

import LogoFull from 'assets/images/LogoFull.svg';
import { Loader } from 'common/components/atoms/Loader';
import InputField from 'common/components/form/Input';
import { toast } from 'react-toastify';
import { getShopsOptions } from 'data';
import { StopIcon } from '@primer/octicons-react';
import SelectField from 'common/components/form/Select';
import { IOption } from 'common/types/form';

const Signin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentUser = getData('user');

  const InitSignIn = {
    shopId: "",
    email: "",
    password: "",
    deviceType: "WEB",
    deviceToken: "MOCK",
  };

  const SignInSchema = Yup.object().shape({
    shopId: Yup.string().required("Please select Shop."),
    email: Yup.string()
      .required("Please provide an email.")
      .email("Invalid email provided"),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitSignIn,
    onSubmit: async (userData: any) => {
      // Set device token
      userData.deviceToken = '0xr2ysf9a7sfdnk4537ndsakf7n7sdafn54x';

      // Making a User Login Request
      try {
        setIsLoading(true);
        userData.email = userData.email.trim().toLowerCase();
        const response: any = await signInUserApi(userData);

        if (response.data.success === true) {
          const {data: {token: { accessToken, refreshToken }, user}} = response.data;

          // Set data in the Local Storage
          setData('user', user);
          setData('accessToken', accessToken);
          setData('refreshToken', refreshToken);

          // Decode token and save in storage
          const decoded: any = jwt_decode(accessToken);

          setData('shopId', decoded.shopId ?? '');

          // Display success message
          toast.success('Welcome! Login successful.');
          return setIsLoading(false);
        }
        
        toast.error('Invalid credentials provided.');
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('Invalid credentials provided.');
        setIsLoading(false);
      }
    },
    validationSchema: SignInSchema,
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
        <div className="mt-5">
          <div className="d-flex justify-content-center mt-5 mb-4">
            <img src={LogoFull} alt="Cilnic App" style={{height: '145px'}}/>
          </div>

          <div className="main-container card bg-white p-4">
            <Loader isLoading={isLoading} />
            <div>
              <h4>Welcome</h4>
              <label>Fill your details or continue with Cilnic App</label>
            </div>

            <form noValidate onSubmit={formik.handleSubmit}>
              <div className="row mt-3">
                <div className="col">
                  <SelectField
                    label="Select Shop"
                    name="shopId"
                    isMulti={false}
                    value={formik.values.shopId}
                    options={getShopsOptions().filter((service) => service.isActive)}
                    helperComponent={<ErrorMessage name="shopId" />}
                    handleChange={(selectedTag: IOption) => {
                      formik.setFieldValue('shopId', !!selectedTag ? selectedTag.value : '');
                    }}getAppoinmentVeriation
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
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
              <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className='mb-5 mt-5 text-center pb-5'>
            Copyright &copy; {new Date().getFullYear()} <b>Cilnic App</b>, All Rights Reserved.
            <br/>
            <span className='cursor-pointer' onClick={() => navigate('/' + endpoints.privacy)}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
