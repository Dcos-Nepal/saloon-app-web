import { useNavigate } from "react-router-dom";

import SignupForm from "./SignupForm";
import { endpoints } from "common/config";
import Google from "assets/images/google.svg";
import LogoFull from "assets/images/LogoFull.svg";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="">
          <div className="d-flex justify-content-center mb-5">
            <img src={LogoFull} alt="Orange Cleaning" />
          </div>

          <div className="main-container card bg-white p-4">
            <div>
              <h4>Register Account</h4>
              <label>Fill your details or continue with google account</label>
            </div>

            <SignupForm />

            <div>
              <div className="row p-3">
                <div className="col hr"></div>
                <div className="col">Or Continue with</div>
                <div className="col hr"></div>
              </div>
              <div className="d-flex justify-content-center mt-1">
                <button className="btn btn-card btn-long p-2">
                  <img src={Google} alt="G" />
                  <label className="pointer ms-2">Continue with Google</label>
                </button>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <div>
                  Already have an account?
                  <span
                    className="txt-orange pointer ms-2"
                    onClick={() => navigate(endpoints.auth.signin)}
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

export default Signup;
