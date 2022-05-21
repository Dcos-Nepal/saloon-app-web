import { InfoIcon } from "@primer/octicons-react";
import { useNavigate } from "react-router-dom";

import ClientJobCreateForm from "./ClientJobCreateForm";

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
          <div className='mt-2'>
            <h3 className="txt-bold extra">Create Job for Client</h3>
            <p className="text-secondary"><InfoIcon /> This is the Job Creation form. Please add all the information for the Job.</p>
          </div>
        </div>
      </div>
      <div className="">
        <ClientJobCreateForm />
      </div>
    </>
  );
};

export default ClientAdd;
