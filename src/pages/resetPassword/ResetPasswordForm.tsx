import { connect } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from "common/components/form/Input";
import * as authActions from "../../store/actions/auth.actions";

const ResetPassword = (props: any) => {
  const InitForgotPassword = {
    email: '',
  }

  const SignInSchema = Yup.object().shape({
    email: Yup.string().required('Please provide an email.').email('Invalid email provided')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: InitForgotPassword,
    onSubmit: async (userData: any) => {
      // Making a User Login Request
      props.actions.forgotPassword(userData);
    },
    validationSchema: SignInSchema,
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
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
    </form>
  );
}

const mapStateToProps = (state: any) => {
  return ({ isLoading: state.auth.isLoading })
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    forgotPassword: (payload: any) => {
      dispatch(authActions.forgotPassword(payload));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
