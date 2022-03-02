import { useEffect,  } from "react";
import * as authActions from "../../../store/actions/auth.actions";
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="">
          <div className="d-flex justify-content-center mb-5">
            <img src={LogoFull} alt="Orange Cleaning" style={{height: '175px'}} />
          </div>
          <div className="main-container card bg-white p-4" style={{minHeight: '200px', minWidth: '350px'}}>
            {(props.isSuccess && props.isFailed === false) ? 
              (<Success
                msg="Thank you for verifying your email/account."
                okMsg="Go to login"
                okHandler={() => navigate(endpoints.auth.signIn)}
              />) : <Loader isLoading={props.isLoading} />
            }
            {(!props.isSuccess && props.isFailed === true) ? 
              (<div>Resend Email verification!</div>) : ""
            }
          </div>
          <div className='mb-5 text-center pb-5'>
            Copyright &copy; {new Date().getFullYear()} <b>Orange Cleaning</b>, All Rights Reserved.
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
