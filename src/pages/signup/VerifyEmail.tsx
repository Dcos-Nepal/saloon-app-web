import { useEffect,  } from "react";
import * as authActions from "../../store/actions/auth.actions";
import { useNavigate, useParams } from "react-router-dom";
import { endpoints } from "common/config";
import { connect } from "react-redux";

import LogoFull from "assets/images/LogoFull.svg";
import Success from "common/components/atoms/Success";
import { Loader } from "common/components/atoms/Loader";

const VerifyEmail = (props: any) => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    props.actions.verifyEmail(token);
  }, []);

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="">
          <div className="d-flex justify-content-center mb-5">
            <img src={LogoFull} alt="Orange Cleaning" />
          </div>
          <div className="main-container card bg-white p-4" style={{minHeight: '200px', minWidth: '350px'}}>
            {(props.isSuccess && props.isFailed === false) ? 
              (<Success
                msg="You have successfully verified your email."
                okMsg="Go to login"
                okHandler={() => navigate(endpoints.auth.signin)}
              />) : <Loader isLoading={props.isLoading} />
            }
            {(!props.isSuccess && props.isFailed === true) ? 
              (<div>Resend Email verification!</div>) : ""
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return ({
    isLoading: state.auth.verify.isLoading,
    isSuccess: state.auth.verify.isSuccess,
    isFailed: state.auth.verify.isFailed,
  })
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: {
    verifyEmail: (payload: any) => {
      dispatch(authActions.verifyEmail(payload));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
