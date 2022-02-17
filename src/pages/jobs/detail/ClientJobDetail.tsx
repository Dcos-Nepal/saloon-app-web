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
        <div className="d-flex flex-row">
          <h3 className="txt-bold">Job for Bonnie Green</h3>
        </div>
        <div className="txt-grey">Job #13</div>
      </div>
      <div className="m-1">
        <ClientJobDetailData id={id} />
      </div>
    </>
  );
};

export default ClientAdd;
