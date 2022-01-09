import { useNavigate } from "react-router-dom";

import { endpoints } from "common/config";
import LogoFull from "assets/images/LogoFull.svg";
import ChangePasswordForm from "./ChangePasswordForm";
import Success from "common/components/atoms/Success";

const ChangePassword = () => {
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
              <h4>Change password</h4>
              <label>Fill your new password to change</label>
            </div>

            <ChangePasswordForm />
          </div>

          <div className="main-container card bg-white p-4">
            <Success
              okMsg="Go to login"
              okHandler={() => navigate(endpoints.auth.signin)}
              msg="You have successfully changed your password"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
