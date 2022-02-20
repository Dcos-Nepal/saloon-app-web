import { useNavigate } from 'react-router-dom';

import InvoiceDetailData from './InvoiceDetailData';

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
          <h3 className="txt-bold extra">Invoice Details</h3>
        </div>
      </div>
      <div className="m-1">
        <InvoiceDetailData />
      </div>
    </>
  );
};

export default ClientAdd;
