import { useNavigate } from "react-router-dom";
import ClientJobDetailData from "./JobQuoteDetailData";

const JobQuoteDetail = () => {
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
        <div className="mt-2 d-flex flex-row">
          <h3 className="txt-bold extra">Job Quote</h3>
        </div>
      </div>
      <div className="m-1">
        <ClientJobDetailData />
      </div>
    </>
  );
};

export default JobQuoteDetail;
