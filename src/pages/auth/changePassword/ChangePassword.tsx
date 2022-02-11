import { useNavigate } from "react-router-dom";

import { endpoints } from "common/config";
import LogoFull from "assets/images/LogoFull.svg";
import ChangePasswordForm from "./ChangePasswordForm";
import Success from "common/components/atoms/Success";
import { connect } from "react-redux";
import { Loader } from "common/components/atoms/Loader";
import { useEffect } from "react";

const ChangePassword = (props: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    if(props.isSuccess && props.isFailed === false) {
      setTimeout(() => navigate(endpoints.auth.signIn), 3000);
    }
  }, [props.isSuccess, props.isFailed, navigate])

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="">
          <div className="d-flex justify-content-center mb-5">
            <img src={LogoFull} alt="Orange Cleaning" />
          </div>
          {(!props.isLoading && props.isSuccess && props.isFailed === false) ? (
            <div className="main-container card bg-white p-4">
              <Success
                okMsg="Go to login"
                okHandler={() => navigate(endpoints.auth.signIn)}
                msg="You have successfully changed your password"
              />
            </div>) : (
              <div className="main-container card bg-white p-4">
                <Loader isLoading={props.isLoading} />
                <div>
                  <h4>Change password</h4>
                  <label>Fill your new password to change</label>
                </div>
                <ChangePasswordForm />
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return ({ 
    isLoading: state.auth.forgotPwd.isLoading,
    isSuccess: state.auth.forgotPwd.isSuccess,
    isFailed: state.auth.forgotPwd.isFailed,
  });
};

export default connect(mapStateToProps)(ChangePassword);
