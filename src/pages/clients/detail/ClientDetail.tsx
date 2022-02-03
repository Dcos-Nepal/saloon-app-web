import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  match: {
    params: { id: string };
  };
}

const ClientDetail: FC<IProps> = ({ match: { params } }) => {
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
          <h3>Update Client</h3>
        </div>
      </div>
    </>
  );
};

export default ClientDetail;
