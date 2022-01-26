import { useNavigate } from "react-router-dom";

import RequestAddForm from "./RequestAddForm";

const RequestAdd = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="row">
        <div className="txt-orange pointer" onClick={() => navigate(-1)}>
          <span className="col me-1">
            <box-icon name="arrow-back" size="xs" color="#EC7100" />
          </span>
          <span className="col">Back to previous</span>
        </div>
        <div className="d-flex flex-row">
          <h3>New Job Request</h3>
        </div>
      </div>
      <div className="m-1">
        <RequestAddForm />
      </div>
    </>
  );
};

export default RequestAdd;
