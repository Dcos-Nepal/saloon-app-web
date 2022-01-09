import { useNavigate } from "react-router-dom";

import { endpoints } from "common/config";
import InputField from "common/components/form/Input";

const SigninForm = () => {
  const navigate = useNavigate();

  return (
    <form>
      <div className="row mt-3">
        <div className="col">
          <InputField type={"email"} label="Email" placeholder="Your email" />
        </div>
      </div>
      <div className="row">
        <InputField
          helperComponent={
            <>
              Trouble logging in?
              <span
                className="txt-orange pointer ms-2"
                onClick={() => navigate(endpoints.auth.resetPassword)}
              >
                Learn more
              </span>
            </>
          }
          label="Password"
          type="password"
          placeholder="Password"
        />
      </div>
      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-primary btn-full">Login</button>
      </div>
    </form>
  );
};

export default SigninForm;
