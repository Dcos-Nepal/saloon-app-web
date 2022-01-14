import { connect } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from "common/components/form/Input";
import * as authActions from "../../store/actions/auth.actions";
import { useParams } from "react-router-dom";

const ChangePassword = (props: any) => {
  const {pwdToken} = useParams();
  const InitForgotPassword = {
    email: '',
    newPassword: '',
    confirmPassword: ''
  }

  const SignInSchema = Yup.object().shape({
    email: Yup.string().required('Please provide an email.').email('Invalid email provided'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('New Password is required'),
    confirmPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitForgotPassword,
    onSubmit: async (userData: any) => {
      debugger;
      // Set Password Token
      userData.passwordToken = pwdToken;

      if (userData.newPassword !== userData.confirmPassword) {
        formik.setErrors({"confirmPassword": "Password do not match!"})
        return false;
      }

      // Making a User Login Request
      props.actions.resetPassword(userData);
    },
    validationSchema: SignInSchema,
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
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
  );
};


const mapStateToProps = (state: any) => {
  return ({ isLoading: state.auth.isLoading })
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    resetPassword: (payload: any) => {
      dispatch(authActions.resetPassword(payload));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
