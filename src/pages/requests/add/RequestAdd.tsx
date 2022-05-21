import { InfoIcon } from "@primer/octicons-react";
import { useNavigate } from "react-router-dom";

import RequestAddForm from "../RequestForm";

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
        <div className="mt-2">
          <h3 className="extra">New Job Request</h3>
          <p className="text-secondary"><InfoIcon /> Job Request made by a client. This stores the information about type of job, and client's requirements. </p>
        </div>
      </div>
      <div>
        <RequestAddForm />
      </div>
    </>
  );
};

export default RequestAdd;
