import { useNavigate } from "react-router-dom";
import ClientForm from "../ClientForm";

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
        <div className="d-flex flex-row mt-2">
          <h3 className="extra">New Client</h3>
        </div>
      </div>
      <ClientForm />
    </>
  );
};

export default ClientAdd;
