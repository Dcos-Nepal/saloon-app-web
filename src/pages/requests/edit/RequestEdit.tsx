import { InfoIcon } from "@primer/octicons-react";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RequestForm from "../RequestForm";

interface IProps {}

const RequestEdit: FC<IProps> = () => {
  const { id } = useParams();
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
        <div className="col">
          <h3 className="extra mt-2">Update Request</h3>
          <p className="text-secondary"><InfoIcon /> Job Request made by a client. This stores the information about type of job, and client's requirements. </p>
        </div>
      </div>
      <RequestForm id={id} />
    </>
  );
};

export default RequestEdit;
