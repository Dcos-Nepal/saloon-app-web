import { useNavigate } from "react-router-dom";
import ClientDetailForm from "../ClientDetailForm";

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
          <h3>New Client</h3>
        </div>
      </div>
      <ClientDetailForm />
    </>
  );
};

export default ClientAdd;
