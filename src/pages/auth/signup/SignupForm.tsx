import * as authActions from "../../../store/actions/auth.actions";
import { connect } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import InputField from "common/components/form/Input";

const SignUpForm = (props: any) => {
  const InitSignUp = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    userType: '',
  }

  const SignUpSchema = Yup.object().shape({
    userType: Yup.string()
    .required('Please select a User Type'),
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(20, 'Too Long!')
      .required('First Name is required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Invalid email'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('Password is required'),
    phoneNumber: Yup.string()
      .length(10)
      .label("Phone Number")
      .required('Phone Number is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitSignUp,
    onSubmit: async (userData: any) => {
      // Setting User Type
      userData.roles = [userData.userType];

      // Remove the userType attribute.
      delete userData.userType;

      // Making a User Registration Request
      props.actions.registerUser(userData);
    },
    validationSchema: SignUpSchema,
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className="row mt-3 mb-3">
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input name="userType" onChange={formik.handleChange} type="radio" value="Client" className="btn-check" id="btnradio1" autoComplete="off" />
          <label className="btn btn-outline-dangerr" htmlFor="btnradio1">I am a Client</label>

          <input name="userType" onChange={formik.handleChange} type="radio" value="Worker" className="btn-check" id="btnradio2" autoComplete="off" />
          <label className="btn btn-outline-dangerr" htmlFor="btnradio2">I am a Worker</label>
        </div>
        <div className="form-text">
          {formik.errors.userType && formik.touched.userType ? (<div className="txt-red">{formik.errors.userType}</div>) : null} 
        </div>
      </div>
      <div className="row">
        <div className="col">
          <InputField
            label="First Name:"
            name="firstName"
            placeholder="Your first name" 
            helperComponent={formik.errors.firstName && formik.touched.firstName ? (<div className="txt-red">{formik.errors.firstName}</div>) : null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="col">
          <InputField
            label="Last Name:"
            name="lastName"
            placeholder="Your last name"
            helperComponent={formik.errors.lastName && formik.touched.lastName ? (<div className="txt-red">{formik.errors.lastName}</div>) : null}
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
            placeholder="Your phone number"
            helperComponent={formik.errors.phoneNumber && formik.touched.phoneNumber ? (<div className="txt-red">{formik.errors.phoneNumber}</div>) : null} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="col">
          <InputField
            type={"email"}
            name="email"
            label="Email:"
            placeholder="Your email"
            helperComponent={formik.errors.email && formik.touched.email ? (<div className="txt-red">{formik.errors.email}</div>) : null}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>
      <div className="row">
        <InputField
          name="password"
          label="Password"
          type="password"
          placeholder="Password:"
          helperComponent={formik.errors.password && formik.touched.password ? (<div className="txt-red">{formik.errors.password}</div>) : null}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      <div className="d-flex justify-content-center mt-2">
        <button type="submit" className="btn btn-primary btn-long">Sign up</button>
      </div>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  console.log(state);
  return ({
    auth: state.auth,
    isLoading: state.auth.isLoading
  })
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    registerUser: (payload: any) => {
      dispatch(authActions.registerUser(payload));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
