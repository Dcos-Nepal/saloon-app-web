import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import JobForm from '../add/ClientJobAddForm';

interface IProps {}

const JobEdit: FC<IProps> = () => {
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
          <h3>Update Job</h3>
        </div>
      </div>
      <JobForm id={id} />
    </>
  );
};

export default JobEdit;
