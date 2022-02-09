import * as Yup from "yup";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as authActions from "../../../store/actions/auth.actions";

import { endpoints } from "common/config";
import InputField from "common/components/form/Input";

const SignInForm = (props: any) => {
  const navigate = useNavigate();

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
      props.actions.signInUser(userData);
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
      <div className="d-flex justify-content-center mt-2">
        <button type="submit" className="btn btn-primary btn-full">
          Login
        </button>
      </div>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return { isLoading: state.auth.isLoading };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    signInUser: (payload: any) => {
      dispatch(authActions.signInUser(payload));
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
