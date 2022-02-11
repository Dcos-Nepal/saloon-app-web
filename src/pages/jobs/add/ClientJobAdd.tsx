import { useNavigate } from "react-router-dom";

import ClientJobAddForm from "./ClientJobAddForm";

const ClientAdd = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="row">
        <div className="txt-orange pointer mb-3" onClick={() => navigate(-1)}>
          <span className="col me-1">
            <box-icon name="arrow-back" size="xs" color="#EC7100" />
          </span>
          <span className="col">Back to previous</span>
        </div>
        <div className="d-flex flex-row">
          <h3 className="extra">Create Job for Client</h3>
        </div>
      </div>
      <div className="">
        <ClientJobAddForm />
      </div>
    </>
  );
};

export default ClientAdd;
