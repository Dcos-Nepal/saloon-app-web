import { useNavigate } from "react-router-dom";
import LogoFull from "assets/images/LogoFull.svg";
import { endpoints } from 'common/config';

const ConnectionError = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid txt-grey">
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="mt-5">
          <div className="d-flex justify-content-center mb-4">
            <img src={LogoFull} alt="Cilnic App" style={{height: '145px'}} />
          </div>
          <div className="main-container card bg-white p-4">
            <div>
              <h4>Internet Connection error.</h4>
              <label>Check your internet connection and click the button below to reload.</label>
            </div>
            <div className="d-flex justify-content-center mt-2">
              <button type="button" className="btn btn-primary btn-full" onClick={() => navigate(endpoints.admin.home)}>Reload Now</button>
            </div>
          </div>
          <div className='mb-5 mt-5 text-center pb-5'>
            Copyright &copy; {new Date().getFullYear()} <b>Cilnic App</b>, All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectionError;
