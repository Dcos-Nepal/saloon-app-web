import { useNavigate } from "react-router-dom";

import ClientJobAddForm from "./ClientJobAddForm";

const ClientAdd = () => {
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
          <h3>Job for Client name</h3>
        </div>
      </div>
      <div className="m-1">
        <ClientJobAddForm />
      </div>
    </>
  );
};

export default ClientAdd;
