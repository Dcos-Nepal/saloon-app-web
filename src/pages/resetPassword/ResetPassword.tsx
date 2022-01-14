import LogoFull from "assets/images/LogoFull.svg";
import { Loader } from "common/components/atoms/Loader";
import { endpoints } from "common/config";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPassword = (props: any) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if(props.isSuccess && props.isFailed === false) {
      navigate(endpoints.auth.signin);
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
              <h4>Reset password</h4>
              <label>Fill your email to change your password</label>
            </div>
            <ResetPasswordForm />
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

export default connect(mapStateToProps)(ResetPassword);
