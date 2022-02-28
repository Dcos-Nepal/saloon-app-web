import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import WorkerForm from "../WorkerForm";

interface IProps {}

const WorkerEdit: FC<IProps> = () => {
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
        <div className="d-flex flex-row mt-2">
          <h3 className="extra">Update Worker Details</h3>
        </div>
      </div>
      <div className="row m-1">
        <WorkerForm id={id} />
      </div>
    </>
  );
};

export default WorkerEdit;
