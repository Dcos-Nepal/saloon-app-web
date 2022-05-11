import { PencilIcon } from '@primer/octicons-react';
import { useNavigate, useParams } from 'react-router-dom';

import ClientJobDetailData from './ClientJobDetailData';

const ClientAdd = () => {
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
        <div className="d-flex flex-row justify-content-between mt-2">
          <h3 className="txt-bold extra">Job Detail View</h3>
          <div className="d-flex flex-row align-items-center mt-2">
            <button onClick={() => id && navigate(`edit`)} type="button" className="btn btn-primary d-flex float-end me-2">
              <PencilIcon className="mt-1" />
              &nbsp; Edit Job Details
            </button>
          </div>
        </div>
      </div>
      <div className="m-1">
        <ClientJobDetailData id={id} />
      </div>
    </>
  );
};

export default ClientAdd;
