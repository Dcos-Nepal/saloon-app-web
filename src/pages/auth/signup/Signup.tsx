import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import SignUpForm from "./SignupForm";
import { endpoints } from "common/config";
import Google from "assets/images/google.svg";
import LogoFull from "assets/images/LogoFull.svg";
import { useEffect } from "react";
import { Loader } from "common/components/atoms/Loader";

const SignUp = (props: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isSuccess && props.isFailed === false) {
      navigate(endpoints.auth.signIn);
    }
  }, [props.isSuccess, props.isFailed, navigate])

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center">
        <div className="">
          <div className="d-flex justify-content-center mb-5">
            <img src={LogoFull} alt="Orange Cleaning" />
          </div>

          <div className="main-container card bg-white p-4">
            <Loader isLoading={props.isLoading} />
            <div>
              <h4>Register Account</h4>
              <label>Fill your details or continue with google account</label>
            </div>
            <SignUpForm />
            <div>
              <div className="row p-3">
                <div className="col hr"></div>
                <div className="col"><small>Or continue with</small></div>
                <div className="col hr"></div>
              </div>
              <div className="d-flex justify-content-center mt-1">
                <button disabled className="btn btn-card btn-long p-2 disabled">
                  <img src={Google} alt="G" />
                  <label className="pointer ms-2">Continue with Google</label>
                </button>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <div>
                  Already have an account?
                  <span
                    className="txt-orange pointer ms-2"
                    onClick={() => navigate(endpoints.auth.signIn)}
                  >
                    Sign In
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return ({
    isLoading: state.auth.signup.isLoading,
    isSuccess: state.auth.signup.isSuccess,
    isFailed: state.auth.signup.isFailed,
  })
};

export default connect(mapStateToProps)(SignUp);
