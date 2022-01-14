import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import SigninForm from "./SigninForm";
import Google from "assets/images/google.svg";
import LogoFull from "assets/images/LogoFull.svg";
import { endpoints } from "common/config";
import { Loader } from "common/components/atoms/Loader";

const Signin = (props: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    if(props.isSuccess && props.isFailed === false) {
      navigate(endpoints.admin.home);
    }
  }, [props.isSuccess, props.isFailed])

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="">
          <div className="d-flex justify-content-center mb-5">
            <img src={LogoFull} alt="Orange Cleaning" />
          </div>

          <div className="main-container card bg-white p-4">
            <Loader isLoading={props.isLoading} />
            <div>
              <h4>Welcome</h4>
              <label>Fill your details or continue with google account</label>
            </div>

            <SigninForm />

            <div>
              <div className="row p-3">
                <div className="col hr"></div>
                <div className="col col-6">Or Continue with</div>
                <div className="col hr"></div>
              </div>
              <div className="d-flex justify-content-center mt-1">
                <button className="btn btn-card btn-full p-2">
                  <img src={Google} alt="G" />
                  <label className="pointer ms-2">Continue with Google</label>
                </button>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <div>
                  Don’t have an account?
                  <span
                    className="txt-orange pointer ms-2"
                    onClick={() => navigate(endpoints.auth.signup)}
                  >
                    Sign Up
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
    isLoading: state.auth.isLoading,
    isSuccess: state.auth.isSuccess,
    isFailed: state.auth.isFailed,
  });
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
