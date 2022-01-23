import { useNavigate } from "react-router-dom";
import WorkerDetailForm from "./WorkerDetailForm";

const WorkerAdd = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="row">
        <div
          className="txt-orange pointer"
          onClick={() => navigate(-1)}
        >
          <span className="col me-1">
            <box-icon name="arrow-back" size="xs" color="#EC7100" />
          </span>
          <span className="col">Back to previous</span>
        </div>
        <div className="d-flex flex-row">
          <h3>Add New Worker</h3>
        </div>
      </div>
      <div className="row m-1">
        <div className="col card">
          <h5>Worker Details</h5>
          <WorkerDetailForm />
        </div>
      </div>
    </>
  );
};

export default WorkerAdd;
