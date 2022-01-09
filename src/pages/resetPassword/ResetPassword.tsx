import LogoFull from "assets/images/LogoFull.svg";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPassword = () => {

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="">
          <div className="d-flex justify-content-center mb-5">
            <img src={LogoFull} alt="Orange Cleaning" />
          </div>

          <div className="main-container card bg-white p-4">
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

export default ResetPassword;
