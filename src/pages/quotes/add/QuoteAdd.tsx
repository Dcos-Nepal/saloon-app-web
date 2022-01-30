import { useNavigate } from "react-router-dom";

import QuoteAddForm from "./QuoteAddForm";

const QuoteAdd = () => {
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
        <div className="d-flex flex-row mt-3">
          <h3 className="extra">Create a Quote</h3>
        </div>
      </div>
      <div>
        <QuoteAddForm />
      </div>
    </>
  );
};

export default QuoteAdd;
